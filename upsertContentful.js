require('dotenv').config();
const dumpAndDiff = require('./index.js');
const contentful = require('contentful-management');
const client = contentful.createClient({
  space: process.env.PRODUCTION_SPACE_ID,
  accessToken: process.env.ACCESS_TOKEN
});

const updateEntries = async (updatedEntries) => {
  return client.getSpace(process.env.PRODUCTION_SPACE_ID)
  .then( (space) => {
    return updatedEntries.map( (entry) => {
      return space.getEntry(entry.sys.id)
      // .then( (foundEntry) => {
      //   // merge found entry and exist entry fields
      // })
    })
  })
}

const addEntries = (newEntries) => {

}

const upsertEntries = async (updatedEntries, newEntries) => {
  if (updatedEntries.length) {
    await updateEntries(updatedEntries);
  }
  // if (newEntries.length) {
  //   addEntries(newEntries);
  // }
} 

const upsertContentful = async () => {
  return dumpAndDiff()
  .then( (setOfDifferences) => {
    const entries = setOfDifferences.find(set => set.type === 'Entries');
    await upsertEntries(entries.updatedContent, entries.newContent);
    // setOfDifferences.forEach( ({type, updatedContent, newContent}) => {
    //   if (type === 'Entries') {
    //     await upsertEntries(updatedContent, newContent);
    //   }
    // })
  })
  .catch( (err) => {
    console.error('Error');
    throw new Error(err);
  });
}
await upsertContentful();