const contentful = require('contentful-management');
const client = contentful.createClient({
  accessToken: process.env.MANAGEMENT_TOKEN
});

module.exports = (updatedEntries, newEntries, removedEntries) => {
  const promises = [];
  if (updatedEntries.length) {
    promises.push(updateEntries(updatedEntries));
  }
  if (newEntries.length) {
    promises.push(createEntries(newEntries));
  }
  if (removedEntries.length) {
    promises.push(removeEntries(removedEntries));
  }
  const flattenedPromises = [].concat.apply([], promises);
  return Promise.all(flattenedPromises)
}

const createEntries = (newEntries) => {
  console.log('Creating new entries...');
  console.log(newEntries);
  return client.getSpace(process.env.TARGET_SPACE_ID)
  .then( (space) => {
    return newEntries.map( (entry) => {
      return space.createEntryWithId(entry.sys.contentType.sys.id, entry.sys.id, entry)
      .then( (createdEntry) => {
        return createdEntry.publish();
      })
      .catch( (err) => {
        console.error('Issue creating entry!');
        console.log(entry)
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
  console.log('Updating entries...');
  console.log(updatedEntries);
  return client.getSpace(process.env.TARGET_SPACE_ID)
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
        console.log(entry)
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

const removeEntries = (removedEntries) => {
  return client.getSpace(process.env.TARGET_SPACE_ID)
  .then( (space) => {
    return removedEntries.map( (entry) => {
      return space.getEntry(entry.sys.id)
      .then( (foundEntry) => {
        return foundEntry.delete();
      })
      .catch( (err) => {
        console.error('Error deleting entry!');
        console.log(entry);
        console.error(err);
        throw new Error(err);
      });
    });
  })
  .catch( (err) => {
    console.error('Error!')
    console.error(err);
    throw new Error(err);
  });
}