const dumpContentful = require('./dumpContentful.js');
const diffSpaces = require('./diffSpaces.js');
const upsertContentful = require('./upsertContentful.js');

dumpContentful()
.then(diffSpaces)
.then(upsertContentful)
.catch(err => {
  console.error('Error!');
  console.error(err);
});
