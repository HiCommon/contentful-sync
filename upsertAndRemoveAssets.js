const contentful = require('contentful-management');
const client = contentful.createClient({
  accessToken: process.env.MANAGEMENT_TOKEN
});

module.exports = (updatedAssets, newAssets, removedAssets) => {
  return updateAssets(updatedAssets)
  .then(() => createAssets(newAssets))
  .then(() => removeAssets(removedAssets))
  .catch((err) => console.error(err));
}

const createAssets = (newAssets) => {
  if (!newAssets.length) {
    console.log('No assets to create. Moving along...')
    return Promise.resolve();
  }
  return client.getSpace(process.env.TARGET_SPACE_ID)
  .then( (space) => {
    const filteredNewAssets = newAssets.filter( asset => !!Object.keys(asset.fields).length && !!asset.fields.file && !!(asset.fields.file && asset.fields.file['en-US'].url))
    console.log('Creating assets...');
    console.log(filteredNewAssets);
    return Promise.all(filteredNewAssets.map( (asset) => {
      return space.createAssetWithId(asset.sys.id, asset)
      .then( (createdAsset) => {
        return createdAsset.publish();
      })
      .catch( err => {
        console.error('Issue creating asset!')
        console.log(asset)
        console.error(err);
        throw new Error(err)
      })
    }));
  })
}

const updateAssets = (updatedAssets) => {
  if (!updatedAssets.length) {
    console.log('No assets to update. Moving along...')
    return Promise.resolve();
  }
  return client.getSpace(process.env.TARGET_SPACE_ID)
  .then( (space) => {
    const filteredUpdatedAssets = updatedAssets.filter( asset => !!Object.keys(asset.fields).length && !!asset.fields.file && !!(asset.fields.file && asset.fields.file['en-US'].url))
    console.log('Updating assets...');
    console.log(filteredUpdatedAssets);
    return Promise.all(filteredUpdatedAssets.map( (asset) => {
      return space.getAsset(asset.sys.id)
      .then( (foundAsset) => {
        delete asset.sys
        foundAsset = Object.assign(foundAsset, asset);
        return foundAsset.update();
      })
      .then( (updatedAsset) => {
        return updatedAsset.publish();
      })
      .catch( (err) => {
        console.error('Issue updating asset!');
        console.log(asset)
        console.error(err);
        throw new Error(err);
      })
    }));
  })
  .catch( (err) => {
    console.error(err);
    throw new Error(err);
  })
}

const removeAssets = (removedAssets) => {
  if (!removedAssets.length) {
    console.log('No assets to remove. Moving along...')
    return Promise.resolve();
  }
  return client.getSpace(process.env.TARGET_SPACE_ID)
  .then( (space) => {
    return Promise.all(removedAssets.map( (asset) => {
      return space.getAsset(asset.sys.id)
      .then( (foundAsset) => {
        return foundAsset.unpublish();
      })
      .then( (unpublishedAsset) => {
        return unpublishedAsset.delete();
      })
      .catch( (err) => {
        console.error('Error deleting asset!');
        console.log(asset);
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