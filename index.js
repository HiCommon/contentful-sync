const dumpContentful = require('./dumpContentful.js');

module.exports = () => {
  return dumpContentful()
  .then( () => require('./diffSpaces.js')() )
  .then( (sets) => require('./upsertContentful.js')(sets))
  .catch( (err) => {
    console.error('Error!')
    console.error(err);
  })
}