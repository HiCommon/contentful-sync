const { asyncForEach, asyncMap } = require('./asyncIterators.js');

class Entries {
  constructor(space, { updatedContent, newContent, removedContent }) {
    this.space = space;
    this.updatedEntries = updatedContent;
    this.newEntries = newContent;
    this.removedEntries = removedContent;
  }
  async upsertAndDelete() {
    const { updatedEntries, newEntries, removedEntries, space } = this;

    let entriesToPublish = [];
    if (newEntries.length) {
      console.log('Creating new Entries...');
      console.log(JSON.stringify(newEntries));
      const entries = await this.createEntries(newEntries, space);
      entriesToPublish = [...entriesToPublish, ...entries];
      console.log('Successfully created Entries');
    } else {
      console.log('No Entries to create');
    }

    if (updatedEntries.length) {
      console.log('Updating Entries...');
      console.log(JSON.stringify(updatedEntries));
      const entries = await this.updateEntries(updatedEntries, space);
      entriesToPublish = [...entriesToPublish, ...entries];
      console.log('Successfully updated Entries');
    } else {
      console.log('No Entries to update');
    }

    if (removedEntries.length) {
      console.log('Removing Entries...');
      console.log(JSON.stringify(removedEntries));
      await this.removeEntries(removedEntries, space);
      console.log('Successfully removed Entries');
    } else {
      console.log('No Entries to remove');
    }

    if (entriesToPublish.length) {
      console.log('Publishing entries:');
      console.log(JSON.stringify(entriesToPublish));
      await this.publishEntries(entriesToPublish, space);
    } else {
      console.log('No Entries to publish');
    }
  }
  async updateEntries(entriesToUpdate, space) {
    return await asyncMap(entriesToUpdate, async entry => {
      try {
        const foundEntry = await space.getEntry(entry.sys.id);
        // merge found entry and existing entry and save
        delete entry.sys;
        const mergedEntry = Object.assign(foundEntry, entry);
        return await mergedEntry.update();
      } catch (e) {
        console.error('Error updating Entry. Entry was:');
        console.log(JSON.stringify(entry));
        throw e;
      }
    });
  }
  async createEntries(newEntries, space) {
    return await asyncMap(newEntries, async entry => {
      try {
        return await space.createEntryWithId(
          entry.sys.contentType.sys.id, // ID of ContentType
          entry.sys.id, // ID of Entry
          entry // Entry data
        );
      } catch (e) {
        console.error('Error creating Entry. Entry was:');
        console.log(JSON.stringify(entry));
        throw e;
      }
    });
  }
  async removeEntries(removedEntries, space) {
    return await asyncForEach(removedEntries, async entry => {
      try {
        const foundEntry = await space.getEntry(entry.sys.id);
        const unpublishedEntry = await foundEntry.unpublish();
        return await unpublishedEntry.delete();
      } catch (e) {
        console.error('Error removing Entry. Entry was:');
        console.log(JSON.stringify(entry));
        throw e;
      }
    });
  }
  async publishEntries(entriesToPublish, space) {
    return await asyncForEach(entriesToPublish, async entry => {
      try {
        return await entry.publish();
      } catch (e) {
        console.error('Error publishing Entry. Entry was:');
        console.log(JSON.stringify(entry));
        throw e;
      }
    });
  }
}

module.exports = Entries;
