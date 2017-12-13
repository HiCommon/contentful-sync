const contentful = require('contentful-management');
const Assets = require('./Assets.js');
const Entries = require('./Entries.js');
const ContentTypes = require('./ContentTypes.js');

async function getSpace({managementToken, targetSpaceId}) {
  const client = contentful.createClient({
    accessToken: managementToken
  });
  return client.getSpace(targetSpaceId);
}

module.exports = async (config, setOfDifferences) => {
  console.log('Beginning update to Contentful...');
  const space = await getSpace(config)
  const assets = setOfDifferences.find(set => set.type === 'Assets');
  const asset = new Assets(space, assets);
  await asset.upsertAndDelete();
  const contentTypes = setOfDifferences.find(set => set.type === 'ContentTypes');
  const contentType = new ContentTypes(space, contentTypes);
  await contentType.upsertAndDelete();
  const entries = setOfDifferences.find(set => set.type === 'Entries');
  const entry = new Entries(space, entries);
  await entry.upsertAndDelete();
  console.log('Finished!');
  return setOfDifferences;
}

