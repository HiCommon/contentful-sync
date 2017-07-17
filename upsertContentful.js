require('dotenv').config();
const dumpAndDiff = require('./index.js');
const contentful = require('contentful-management');
const client = contentful.createClient({
  accessToken: process.env.MANAGEMENT_TOKEN
});

const updateEntries = (updatedEntries) => {
  return client.getSpace(process.env.PRODUCTION_SPACE_ID)
  .then( (space) => {
    const updateEntryPromises = updatedEntries.map( (entry) => {
      return space.getEntry(entry.sys.id)
      .then( (foundEntry) => {
        // merge found entry and exist entry fields and save
        console.log('original')
        console.log(JSON.stringify(entry.fields))
        console.log('before')
        console.log(JSON.stringify(foundEntry.fields))
        foundEntry.fields = Object.assign(foundEntry.fields, entry.fields);
        console.log('after')
        console.log(JSON.stringify(foundEntry.fields))
        return foundEntry.update();
      })
      .catch( (err) => {
        console.error('Issue updating entry')
        console.error(err)
      });
    });
    return updateEntryPromises;
  })
  .catch( (err) => {
    console.error('some shit happened')
    console.error(err)
  })
}

const addEntries = (newEntries) => {

}

const upsertEntries = (updatedEntries, newEntries) => {
  const promises = [];
  if (updatedEntries.length) {
    promises.push(updateEntries(updatedEntries));
  }
  const flattenedPromises = [].concat.apply([], promises);
  return Promise.all(flattenedPromises)
  // if (newEntries.length) {
  //   promises.push(addEntries(newEntries));
  // }
} 

const upsertContentful = () => {
  return dumpAndDiff()
  .then( (setOfDifferences) => {
    const entries = setOfDifferences.find(set => set.type === 'Entries');
    return upsertEntries(entries.updatedContent, entries.newContent)
    // setOfDifferences.forEach( ({type, updatedContent, newContent}) => {
    //   if (type === 'Entries') {
    //     await upsertEntries(updatedContent, newContent);
    //   }
    // })
  })
  .then( (res) => {
    console.log('didnt fail?')
    console.log(res)
  })
  .catch( (err) => {
    console.error('Errorrrrr');
    throw new Error(err);
  });
}
upsertContentful();