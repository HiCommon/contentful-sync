const dumpContentful = require('./dumpContentful.js');
const diffSpaces = require('./diffSpaces.js');
const upsertContentful = require('./upsertContentful.js');

module.exports = (config) => {
  return dumpContentful(config)
  .then(diffSpaces)
  .then((setOfDifferences) => upsertContentful(config, setOfDifferences))
  .catch(err => {
    console.error('Error!');
    console.error(err);
  });
}