const dumpContentful = require('./dumpContentful.js');

module.exports = () => {
  return dumpContentful()
  .then( () => require('./diffSpaces.js')() )
  .catch( (err) => {
    console.error('Error!')
    console.error(err);
  })
}