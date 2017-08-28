const DumpContentful = require('./lib/DumpContentful.js');
const DiffSpaces = require('./lib/DiffSpaces.js');
const upsertContentful = require('./lib/upsertContentful.js');

module.exports = (config) => {
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