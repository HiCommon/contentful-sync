const { asyncForEach } = require('./asyncIterators.js');

class ContentTypes {
  constructor(space, {updatedContent, newContent, removedContent}) {
    this.space = space;
    this.updatedContentTypes = updatedContent;
    this.newContentTypes = newContent;
    this.removedContentTypes = removedContent; 
  }
  async upsertAndDelete() {
    const {updatedContentTypes, newContentTypes, removedContentTypes, space } = this;
    if (updatedContentTypes.length) {
      console.log('Updating Content Types...');
      console.log(JSON.stringify(updatedContentTypes));
      await this.updateContentTypes(updatedContentTypes, space);
      console.log('Successfully updated Content Types');
    } else {
      console.log('No Content Types to update');
    }

    if (newContentTypes.length) {
      console.log('Creating new Content Types...');
      console.log(JSON.stringify(newContentTypes));
      await this.createContentTypes(newContentTypes, space);
      console.log('Successfully created Content Types');
    } else {
      console.log('No Content Types to create');
    }

    if(removedContentTypes.length) {
      console.log('Removing Content Types...');
      console.log(JSON.stringify(removedContentTypes));
      await this.removeContentTypes(removedContentTypes, space);
      console.log('Successfully removed Content Types');
    } else {
      console.log('No Content Types to remove');
    }
  }
  async removeOutdatedFields(originalContentType, updatedContentType) {
    originalContentType.fields = originalContentType.fields.map(field => {
      const updatedContentTypeFieldIds = updatedContentType.fields.map(f => f.id);
      if (!updatedContentTypeFieldIds.includes(field.id)) {
        field.omitted = true;
      }
      return field;
    });
    return originalContentType;
  }
  async updateContentTypes (updatedContentTypes, space) {
    console.log('Updating Content Types...');
    console.log(JSON.stringify(updatedContentTypes));
    return await asyncForEach(updatedContentTypes, async (contentType) => {
      try {
        const foundContentType = await space.getContentType(contentType.sys.id);
        delete contentType.sys;
        const contentTypeWithRemovedFields = this.removeOutdatedFields(foundContentType, contentType);
        const mergedContentType = Object.assign(contentTypeWithRemovedFields, contentType);
        const updatedContentType = await mergedContentType.update();
        return await updatedContentType.publish();
      } catch(e) {
        console.error('Error updating Content Type. Content Type was:');
        console.log(JSON.stringify(contentType));
        throw e;
      }
    });
  }
  async createContentTypes (newContentTypes, space) {
    console.log('Creating new Content Types...');
    console.log(JSON.stringify(newContentTypes));
    return await asyncForEach(newContentTypes, async (contentType) => {
      try {
        const createdContentType = await space.createContentTypeWithId(contentType.sys.id, contentType);
        return await createdContentType.publish();
      } catch(e) {
        console.error('Error creating Content Type. Content Type was:');
        console.log(JSON.stringify(contentType));
        throw e;
      }
    });
  }
  async removeContentTypes (removedContentTypes, space) {
    return await asyncForEach(removedContentTypes, async (contentType) => {
      try {
        const foundContentType = await space.getContentType(contentType.sys.id);
        const unpublishedContentType = await foundContentType.unpublish();
        return await unpublishedContentType.delete();
      } catch(e) {
        console.error('Error removing Content Type. Content Type was:');
        console.log(JSON.stringify(contentType));
        throw e;
      }
    });
  }
}

module.exports = ContentTypes;