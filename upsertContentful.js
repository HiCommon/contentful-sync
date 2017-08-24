require('dotenv').config();

const upsertAndRemoveAssets = require('./upsertAndRemoveAssets.js');
const upsertAndRemoveEntries = require('./upsertAndRemoveEntries.js');
const upsertAndRemoveSchema = require('./upsertAndRemoveSchema.js');

module.exports = (setOfDifferences) => {
  console.log('Beginning upsert to Contentful...');
  const assets = setOfDifferences.find(set => set.type === 'Assets');
  return upsertAndRemoveAssets(assets.updatedContent, assets.newContent, assets.removedContent)
  .then( (res) => {
    const schema = setOfDifferences.find(set => set.type === 'Schema');
    return upsertAndRemoveSchema(schema.updatedContent, schema.newContent, schema.removedContent)
  })
  .then( (res) => {
    const entries = setOfDifferences.find(set => set.type === 'Entries');
    return upsertAndRemoveEntries(entries.updatedContent, entries.newContent, entries.removedContent);
  })
  .then( (res) => {
    console.log('Finished upsert!');
  })
  .catch( (err) => {
    console.error('Error');
    throw new Error(err);
  });
}