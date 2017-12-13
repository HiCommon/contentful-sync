class Entries {
  constructor(space, {updatedContent, newContent, removedContent}) {
    this.space = space;
    this.updatedEntries = updatedContent;
    this.newEntries = newContent;
    this.removedEntries = removedContent; 
  }
  async upsertAndDelete() {
    await this.updateEntries()
    await this.createEntries()
    await this.removeEntries()
  }
  async updateEntries () {
    const { updatedEntries, space } = this;
    if (!updatedEntries.length) {
      console.log('No entries to update. Moving along...')
      return Promise.resolve();
    }
    console.log('Updating entries...');
    for(var i=0; i<updatedEntries.length; i++) {
      const entry = updatedEntries[i];
      const foundEntry = await space.getEntry(entry.sys.id);
      // merge found entry and exist entry and save
      delete entry.sys
      const mergedEntry = Object.assign(foundEntry, entry);
      const updatedEntry = await mergedEntry.update();
      return await updatedEntry.publish();
    }
  }
  async createEntries () {
    const { newEntries, space } = this;
    if (!newEntries.length) {
      console.log('No entries to create. Moving along...')
      return Promise.resolve();
    }
    console.log('Creating new entries...');
    for(var i=0; i<newEntries.length; i++) {
      const entry = newEntries[i];
      const createdEntry = await space.createEntryWithId(entry.sys.contentType.sys.id, entry.sys.id, entry);
      return await createdEntry.publish();
    }
  }
  async removeEntries () {
    const { removedEntries, space } = this;
    if (!removedEntries.length) {
      console.log('No entries to remove. Moving along...')
      return Promise.resolve();
    }
    console.log('Removing entries...')
    for(var i=0; i<removedEntries.length; i++) {
      const entry = removedEntries[i];
      const foundEntry = await space.getEntry(entry.sys.id);
      const unpublishedEntry = await foundEntry.unpublish();
      return await unpublishedEntry.delete();
    }
  }
}

module.exports = Entries;