const dumpDiffAndUpsert = () => {
  return require('./dumpContentful.js')()
  .then( () => require('./diffSpaces.js')() )
  .then( (sets) => require('./upsertContentful.js')(sets) )
  .catch( (err) => {
    console.error('Error!')
    console.error(err);
  })
}

dumpDiffAndUpsert();