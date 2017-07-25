require('dotenv').config();
const dumpAndDiff = require('./index.js');

const upsertAssets = require('./upsertAssets.js');
const upsertEntries = require('./upsertEntries.js');
const upsertSchema = require('./upsertSchema.js');

const upsertContentful = () => {
  let setOfDifferences;
  return dumpAndDiff()
  .then( (sets) => {
    setOfDifferences = sets;
    const assets = setOfDifferences.find(set => set.type === 'Assets');
    return upsertAssets(assets.updatedContent, assets.newContent)
  })
  .then( (res) => {
    const schema = setOfDifferences.find(set => set.type === 'Schema');
    return upsertSchema(schema.updatedContent, schema.newContent)
  })
  .then( (res) => {
    const entries = setOfDifferences.find(set => set.type === 'Entries');
    return upsertEntries(entries.updatedContent, entries.newContent)
  })
  .then( (res) => {
    console.log('didnt fail?')
    console.log(res)
  })
  .catch( (err) => {
    console.error('Error');
    throw new Error(err);
  });
}
upsertContentful();