require('dotenv').config();
const dumpAndDiff = require('./index.js');
const contentful = require('contentful-management');
const client = contentful.createClient({
  space: process.env.PRODUCTION_SPACE_ID,
  accessToken: process.env.ACCESS_TOKEN
});

const updateEntries = (updatedEntries) => {
  return client.getSpace(process.env.PRODUCTION_SPACE_ID)
  .then( (space) => {
    return updatedEntries.map( (entry) => {
      return space.getEntry(entry.sys.id)
      .then( (foundEntry) => {
        // merge found entry and exist entry fields
      })
    })
  })
}

const addEntries = (newEntries) => {

}

const upsertEntries = (updatedEntries, newEntries) => {
  if (updatedEntries.length) {
    updateEntries(updatedEntries);
  }
  if (newEntries.length) {
    addEntries(newEntries);
  }
} 

const upsertContentful = () => {
  return dumpAndDiff()
  .then( (setOfDifferences) => {
    setOfDifferences.forEach( ({type, updatedContent, newContent}) => {
      if (type === 'Entries') {
        upsertEntries(updatedContent, newContent);
      }
    })
  })
  .catch( (err) => {
    console.error('Error');
    throw new Error(err);
  });
}
upsertContentful();