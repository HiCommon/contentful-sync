const contentful = require('contentful-management');
const client = contentful.createClient({
  accessToken: process.env.MANAGEMENT_TOKEN
});

module.exports = (updatedEntries, newEntries) => {
  const promises = [];
  if (updatedEntries.length) {
    promises.push(updateEntries(updatedEntries));
  }
  if (newEntries.length) {
    promises.push(createEntries(newEntries));
  }
  const flattenedPromises = [].concat.apply([], promises);
  return Promise.all(flattenedPromises)
}

const createEntries = (newEntries) => {
  return client.getSpace(process.env.PRODUCTION_SPACE_ID)
  .then( (space) => {
    return newEntries.map( (entry) => {
      // console.log(entry.sys.id, entry.sys.contentType.sys.id)
      return space.createEntryWithId(entry.sys.contentType.sys.id, entry.sys.id, entry)
      .then( (createdEntry) => {
        return createdEntry.publish();
      })
      .catch( (err) => {
        console.error('Issue creating entry!');
        console.error(err);
        throw new Error(err);
      });
    });
  })
  .catch( (err) => {
    console.log('Something went wrong...');
    console.error(err);
    throw new Error(err)
  });
}

const updateEntries = (updatedEntries) => {
  return client.getSpace(process.env.PRODUCTION_SPACE_ID)
  .then( (space) => {
    return updatedEntries.map( (entry) => {
      return space.getEntry(entry.sys.id)
      .then( (foundEntry) => {
        // merge found entry and exist entry and save
        delete entry.sys
        foundEntry = Object.assign(foundEntry, entry);
        return foundEntry.update();
      })
      .then( (updatedEntry) => {
        updatedEntry.publish();
      })
      .catch( (err) => {
        console.error('Issue updating entry');
        console.error(err);
        throw new Error(err);
      });
    });
  })
  .catch( (err) => {
    console.error('Something bad happened');
    console.error(err);
  });
}