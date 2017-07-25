const contentful = require('contentful-management');
const client = contentful.createClient({
  accessToken: process.env.MANAGEMENT_TOKEN
});

module.exports = (updatedAssets, newAssets) => {
  const promises = [];
  if (updatedAssets.length) {
    promises.push(updateAssets(updatedAssets));
  }
  if (newAssets.length) {
    promises.push(createAssets(newAssets));
  }
  const flattenedPromises = [].concat.apply([], promises);
  return Promise.all(flattenedPromises);
}

const createAssets = (newAssets) => {
  return client.getSpace(process.env.TARGET_SPACE_ID)
  .then( (space) => {
    const filteredNewAssets = newAssets.filter( asset => !!Object.keys(asset.fields).length && !!asset.fields.file && !!(asset.fields.file && asset.fields.file['en-US'].url))
    return filteredNewAssets.map( (asset) => {
      return space.createAssetWithId(asset.sys.id, asset)
      .then( (createdAsset) => {
        return createdAsset.publish();
      })
      .catch( err => {
        console.error('Issue creating asset!')
        console.error(err);
        throw new Error(err)
      })
    })
  })
}

const updateAssets = (updatedAssets) => {
  return client.getSpace(process.env.TARGET_SPACE_ID)
  .then( (space) => {
    const filteredUpdatedAssets = updatedAssets.filter( asset => !!Object.keys(asset.fields).length && !!asset.fields.file && !!(asset.fields.file && asset.fields.file['en-US'].url))
    return filteredUpdatedAssets.map( (asset) => {
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
        console.error(err);
        throw new Error(err);
      })
    })
  })
  .catch( (err) => {
    console.error(err);
    throw new Error(err);
  })
}