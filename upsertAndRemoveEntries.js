const contentful = require('contentful-management');
const client = contentful.createClient({
  accessToken: process.env.MANAGEMENT_TOKEN
});

module.exports = (updatedEntries, newEntries, removedEntries) => {
  return updateEntries(updatedEntries)
  .then(() => createEntries(newEntries))
  .then(() => removeEntries(removedEntries))
  .catch((err) => console.error(err))
}

const createEntries = (newEntries) => {
  if (!newEntries.length) {
    console.log('No entries to create. Moving along...')
    return Promise.resolve();
  }
  console.log('Creating new entries...');
  return client.getSpace(process.env.TARGET_SPACE_ID)
  .then( (space) => {
    return Promise.all(newEntries.map( (entry) => {
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
    }));
  })
  .catch( (err) => {
    console.log('Something went wrong...');
    console.error(err);
    throw new Error(err)
  });
}

const updateEntries = (updatedEntries) => {
  if (!updatedEntries.length) {
    console.log('No entries to update. Moving along...')
    return Promise.resolve();
  }
  console.log('Updating entries...');
  return client.getSpace(process.env.TARGET_SPACE_ID)
  .then( (space) => {
    return Promise.all(updatedEntries.map( (entry) => {
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
    }));
  })
  .catch( (err) => {
    console.error('Something bad happened');
    console.error(err);
  });
}

const removeEntries = (removedEntries) => {
  if (!removedEntries.length) {
    console.log('No entries to remove. Moving along...')
    return Promise.resolve();
  }
  console.log('Removing entries...')
  return client.getSpace(process.env.TARGET_SPACE_ID)
  .then( (space) => {
    return Promise.all(removedEntries.map( (entry) => {
      return space.getEntry(entry.sys.id)
      .then( (foundEntry) => {
        return foundEntry.unpublish();
      })
      .then( (unpublishedEntry) => {
        return unpublishedEntry.delete();
      })
      .catch( (err) => {
        console.error('Error deleting entry!');
        console.log(entry);
        console.error(err);
        throw new Error(err);
      });
    }));
  })
  .catch( (err) => {
    console.error('Error!')
    console.error(err);
    throw new Error(err);
  });
}