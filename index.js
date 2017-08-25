const DumpContentful = require('./DumpContentful.js');
const DiffSpaces = require('./DiffSpaces.js');
const upsertContentful = require('./upsertContentful.js');

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