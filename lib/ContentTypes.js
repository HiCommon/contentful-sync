class ContentTypes {
  constructor(space, {updatedContent, newContent, removedContent}) {
    this.space = space;
    this.updatedContentTypes = updatedContent;
    this.newContentTypes = newContent;
    this.removedContentTypes = removedContent; 
  }
  upsertAndDelete() {
    return this.updateContentTypes()
    .then(() => this.createContentTypes())
    .then(() => this.removeContentTypes())
    .catch((err) => console.error(err));
  }
  updateContentTypes () {
    const { updatedContentTypes, space } = this;
    if (!updatedContentTypes.length) {
      console.log('No Content Types to update. Moving along...')
      return Promise.resolve();
    }
    console.log('Updating Content Types...');
    return Promise.all(updatedContentTypes.map( (contentType) => {
      return space.getContentType(contentType.sys.id)
      .then( (foundContentType) => {
        // merge found content type and exist content type and save
        delete contentType.sys
        foundContentType = Object.assign(foundContentType, contentType);
        return foundContentType.update();
      })
      .then( (updatedContentType) => {
        return updatedContentType.publish();
      })
      .catch( (err) => {
        console.error('Issue updating content type');
        console.log(contentType)
        console.error(err);
        throw new Error(err);
      });
    }))
    .catch( (err) => {
      console.error('Something bad happened');
      console.error(err);
    })
  }
  createContentTypes () {
    const { newContentTypes, space } = this;
    if (!newContentTypes.length) {
      console.log('No Content Types to create. Moving along...')
      return Promise.resolve();
    }
    console.log('Creating new Content Types...');
    return Promise.all(newContentTypes.map( (contentType) => {
      return space.createContentTypeWithId(contentType.sys.id, contentType)
      .then( (createdContentType) => {
        return createdContentType.publish();
      })
      .catch( (err) => {
        console.error('Issue creating content type!');
        console.log(contentType);
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
  removeContentTypes () {
    const { removedContentTypes, space } = this;    
    if (!removedContentTypes.length) {
      console.log('No Content Types to removed. Moving along...')
      return Promise.resolve();
    }
    console.log('Removing Content Types...');
    return Promise.all(removedContentTypes.map( (contentType) => {
      return space.getEntry(contentType.sys.id)
      .then( (foundContentType) => {
        return foundContentType.unpublish();
      })
      .then( (unpublishedContentType) => {
        return unpublishedContentType.delete();
      })
      .catch( (err) => {
        console.error('Error deleting contentType!');
        console.log(contentType);
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

module.exports = ContentTypes;