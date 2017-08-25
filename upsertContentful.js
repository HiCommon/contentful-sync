const contentful = require('contentful-management');
const Assets = require('./Assets.js');
const Entries = require('./Entries.js');
const ContentTypes = require('./ContentTypes.js');

const getSpace = ({managementToken, targetSpaceId}) => {
  const client = contentful.createClient({
    accessToken: managementToken
  });
  return client.getSpace(targetSpaceId);
}

module.exports = (config, setOfDifferences) => {
  console.log('Beginning upsert to Contentful...');
  let space;
  return getSpace(config)
  .then((contentfulSpace) => {
    space = contentfulSpace;
    const assets = setOfDifferences.find(set => set.type === 'Assets');
    const asset = new Assets(space, assets);
    return asset.upsertAndDelete();
  })
  .then( () => {
    const contentTypes = setOfDifferences.find(set => set.type === 'ContentTypes');
    const contentType = new ContentTypes(space, contentTypes);
    return contentType.upsertAndDelete();
  })
  .then( () => {
    const entries = setOfDifferences.find(set => set.type === 'Entries');
    const entry = new Entries(space, entries);
    return entry.upsertAndDelete();
  })
  .then( () => {
    console.log('Finished!');
  })
  .catch( (err) => {
    console.error('Error in the upsert/deletion process');
    throw new Error(err);
  });
}

