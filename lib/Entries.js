const asyncForEach = require('asyncForEach.js')

class Entries {
  constructor(space, {updatedContent, newContent, removedContent}) {
    this.space = space;
    this.updatedEntries = updatedContent;
    this.newEntries = newContent;
    this.removedEntries = removedContent; 
  }
  async upsertAndDelete() {
    const { updatedEntries, newEntries, removedEntries, space } = this;

    if (updatedEntries.length) {
      console.log('Updating Entries...');
      console.log(JSON.stringify(updatedEntries));
      await this.updateEntries(updatedEntries, space);
      console.log('Successfully updated Entries');
    } else {
      console.log('No Entries to update');
    }

    if (newEntries.length) {
      console.log('Creating new Entries...');
      console.log(JSON.stringify(newEntries));
      await this.createEntries(newEntries, space);
      console.log('Successfully created Entries');
    } else {
      console.log('No Entries to create');
    }

    if(removedEntries.length) {
      console.log('Removing Entries...');
      console.log(JSON.stringify(removedEntries));
      await this.removeEntries(removedEntries, space);
      console.log('Successfully removed Entries');
    } else {
      console.log('No Entries to remove');
    }
  }
  async updateEntries (updatedEntries, space) {
    return await asyncForEach(updatedEntries, async (entry) => {
      try {
        const foundEntry = await space.getEntry(entry.sys.id);
        // merge found entry and existing entry and save
        delete entry.sys;
        const mergedEntry = Object.assign(foundEntry, entry);
        const updatedEntry = await mergedEntry.update();
        return await updatedEntry.publish();
      } catch(e) {
        console.error('Error updating Entry. Entry was:');
        console.log(JSON.stringify(entry));
        throw e;
      }
    });
  }
  async createEntries (newEntries, space) {
    return await asyncForEach(newEntries, async (entry) => {
      try {
        const createdEntry = await space.createEntryWithId(entry.sys.contentType.sys.id, entry.sys.id, entry);
        return await createdEntry.publish();
      } catch(e) {
        console.error('Error creating Entry. Entry was:');
        console.log(JSON.stringify(entry));
        throw e;
      }
    });
  }
  async removeEntries (removedEntries, space) {
    return await asyncForEach(removedEntries, async (entry) => {
      try {
        const foundEntry = await space.getEntry(entry.sys.id);
        const unpublishedEntry = await foundEntry.unpublish();
        return await unpublishedEntry.delete();
      } catch(e) {
        console.error('Error removing Entry. Entry was:');
        console.log(JSON.stringify(entry));
        throw e;
      }
    });
  }
}

module.exports = Entries;