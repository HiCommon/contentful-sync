class Entries {
  constructor(space, {updatedContent, newContent, removedContent}) {
    this.space = space;
    this.updatedEntries = updatedContent;
    this.newEntries = newContent;
    this.removedEntries = removedContent; 
  }
  upsertAndDelete() {
    return this.updateEntries()
    .then(() => this.createEntries())
    .then(() => this.removeEntries())
    .catch((err) => console.error(err));
  }
  updateEntries () {
    const { updatedEntries, space } = this;
    if (!updatedEntries.length) {
      console.log('No entries to update. Moving along...')
      return Promise.resolve();
    }
    console.log('Updating entries...');
    return Promise.all(updatedEntries.map( (entry) => {
      return space.getEntry(entry.sys.id)
      .then( (foundEntry) => {
        // merge found entry and exist entry and save
        delete entry.sys
        foundEntry = Object.assign(foundEntry, entry);
        return foundEntry.update();
      })
      .then( (updatedEntry) => {
        updatedEntry.publish();
      })
      .catch( (err) => {
        console.error('Issue updating entry');
        console.log(entry)
        console.error(err);
        throw new Error(err);
      });
    }))
    .catch( (err) => {
      console.error('Something bad happened');
      console.error(err);
    });
  }
  createEntries () {
    const { newEntries, space } = this;
    if (!newEntries.length) {
      console.log('No entries to create. Moving along...')
      return Promise.resolve();
    }
    console.log('Creating new entries...');
    return Promise.all(newEntries.map( (entry) => {
      return space.createEntryWithId(entry.sys.contentType.sys.id, entry.sys.id, entry)
      .then( (createdEntry) => {
        return createdEntry.publish();
      })
      .catch( (err) => {
        console.error('Issue creating entry!');
        console.log(entry)
        console.error(err);
        throw new Error(err);
      });
    }))
    .catch( (err) => {
      console.log('Something went wrong...');
      console.error(err);
      throw new Error(err)
    });
  }
  removeEntries () {
    const { removedEntries, space } = this;
    if (!removedEntries.length) {
      console.log('No entries to remove. Moving along...')
      return Promise.resolve();
    }
    console.log('Removing entries...')
    return Promise.all(removedEntries.map( (entry) => {
      return space.getEntry(entry.sys.id)
      .then( (foundEntry) => {
        return foundEntry.unpublish();
      })
      .then( (unpublishedEntry) => {
        return unpublishedEntry.delete();
      })
      .catch( (err) => {
        console.error('Error deleting entry!');
        console.log(entry);
        console.error(err);
        throw new Error(err);
      });
    }))
    .catch( (err) => {
      console.error('Error!')
      console.error(err);
      throw new Error(err);
    });
  }
}

module.exports =  Entries;