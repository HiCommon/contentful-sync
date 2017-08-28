const DumpContentful = require('./lib/DumpContentful.js');
const DiffSpaces = require('./lib/DiffSpaces.js');
const upsertContentful = require('./lib/upsertContentful.js');

const validateKeys = (config) => {
  return ['originSpaceId', 'targetSpaceId', 'managementToken'].reduce((acc, curr) => {
    if (!config[curr]) {
      return acc = false;
    }
    return acc;
  }, true)
}

module.exports = (config) => {
  const hasRequiredKeys = validateKeys(config);
  if (!hasRequiredKeys) {
    throw new Error('Missing one or more of required keys: originSpaceId, targetSpaceId, managementToken')
  }
  const contentful = new DumpContentful(config);
  return contentful.dump()
  .then((contentfulData) => {
    const spaceDiff = new DiffSpaces(contentfulData);
    return spaceDiff.differences;
  })
  .then((setOfDifferences) => upsertContentful(config, setOfDifferences))
  .catch(err => {
    console.error('Error!');
    console.error(err);
  });
}
