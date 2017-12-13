class ContentTypes {
  constructor(space, {updatedContent, newContent, removedContent}) {
    this.space = space;
    this.updatedContentTypes = updatedContent;
    this.newContentTypes = newContent;
    this.removedContentTypes = removedContent; 
  }
  async upsertAndDelete() {
    await this.updateContentTypes()
    await this.createContentTypes()
    await this.removeContentTypes()
  }
  async updateContentTypes () {
    const { updatedContentTypes, space } = this;
    if (!updatedContentTypes.length) {
      console.log('No Content Types to update. Moving along...')
      return Promise.resolve();
    }
    console.log('Updating Content Types...');
    for(var i=0; i<updatedContentTypes.length; i++) {
      const contentType = updatedContentTypes[i];
      const foundContentType = await space.getContentType(contentType.sys.id);
      delete contentType.sys
      const mergedContentType = Object.assign(foundContentType, contentType);
      const updatedContentType = await mergedContentType.update();
      return await updatedContentType.publish();
    }
  }
  async createContentTypes () {
    const { newContentTypes, space } = this;
    if (!newContentTypes.length) {
      console.log('No Content Types to create. Moving along...')
      return Promise.resolve();
    }
    console.log('Creating new Content Types...');
    for(var i=0; i<newContentTypes.length; i++) {
      const contentType = newContentTypes[i];
      const createdContentType = await space.createContentTypeWithId(contentType.sys.id, contentType);
      return await createdContentType.publish();
    }
  }
  async removeContentTypes () {
    const { removedContentTypes, space } = this;
    if (!removedContentTypes.length) {
      console.log('No Content Types to removed. Moving along...')
      return Promise.resolve();
    }
    console.log('Removing Content Types...');
    for(var i=0; i<removedContentTypes.length; i++) {
      const contentType = removedContentTypes[i];
      const foundContentType = await space.getEntry(contentType.sys.id);
      const unpublishedContentType = await foundContentType.unpublish();
      return await unpublishedContentType.delete();
    }
  }
}

module.exports = ContentTypes;