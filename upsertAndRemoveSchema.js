const contentful = require('contentful-management');
const client = contentful.createClient({
  accessToken: process.env.MANAGEMENT_TOKEN
});

module.exports = (updatedContentTypes, newContentTypes, removedContentTypes) => {
  return updateContentTypes(updatedContentTypes)
  .then(() => createContentTypes(newContentTypes))
  .then(() => removeContentTypes(removedContentTypes))
  .catch((err) => {
    console.error(err);
  });
}

const createContentTypes = (newContentTypes) => {
  if (!newContentTypes.length) {
    console.log('No Content Types to create. Moving along...')
    return Promise.resolve();
  }
  return client.getSpace(process.env.TARGET_SPACE_ID)
  .then( (space) => {
    console.log('Creating new Content Types...');
    console.log(newContentTypes);
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
    }));
  })
  .catch( (err) => {
    console.log('Something went wrong...');
    console.error(err);
    throw new Error(err)
  });
}

const updateContentTypes = (updatedContentTypes) => {
  if (!updatedContentTypes.length) {
    console.log('No Content Types to update. Moving along...')
    return Promise.resolve();
  }
  return client.getSpace(process.env.TARGET_SPACE_ID)
  .then( (space) => {
    console.log('Updating Content Types...');
    console.log(updatedContentTypes)
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
    }));
  })
  .catch( (err) => {
    console.error('Something bad happened');
    console.error(err);
  })
}

const removeContentTypes = (removedContentTypes) => {
  if (!removedContentTypes.length) {
    console.log('No Content Types to removed. Moving along...')
    return Promise.resolve();
  }
  return client.getSpace(process.env.TARGET_SPACE_ID)
  .then( (space) => {
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
    }));
  })
  .catch( (err) => {
    console.error('Error!')
    console.error(err);
    throw new Error(err);
  });
}