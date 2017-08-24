const dumpContentful = require('./dumpContentful.js');
const diffSpaces = require('./diffSpaces.js');
const upsertContentful = require('./upsertContentful.js');

dumpContentful()
.then(upsertContentful(diffSpaces()))
.catch(err => {
  console.error('Error!');
  console.error(err);
});
