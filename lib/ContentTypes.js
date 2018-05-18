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
    const fields = originalContentType.fields.map(field => {
      const updatedContentTypeFieldIds = updatedContentType.fields.map(f => f.id);
      if (!updatedContentTypeFieldIds.includes(field.id)) {
        console.log('omitting!', field.id)
        field.omitted = true;
      }
      return field;
    })
    originalContentType.fields = fields;
    try {
      console.log('updating with omitted fields!')
      const updated = await originalContentType.update();
      const published = await updated.publish();
      console.log('omitted fields successfully')
      return published;
    } catch(e) {
      console.error('Error updating w omitted fields')
      console.error(e);
      console.log(JSON.stringify(originalContentType));
      throw e
    }
  }
  async updateContentTypes (updatedContentTypes, space) {
    return await asyncForEach(updatedContentTypes, async (contentType) => {
      try {
        const foundContentType = await space.getContentType(contentType.sys.id);
        delete contentType.sys;
        console.log('merging...')
        const contentTypeWithRemovedFields = await this.removeOutdatedFields(foundContentType, contentType);
        console.log(JSON.stringify(contentTypeWithRemovedFields))
        console.log('====================================');        
        console.log(JSON.stringify(contentType))
        const o = Object.assign(contentTypeWithRemovedFields, contentType);
        console.log('====================================');
        console.log(JSON.stringify(o))        
        console.log('====================================');
        
        const updatedContentType = await o.update();
        console.log('publishing...')
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