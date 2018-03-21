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

module.exports = async (config) => {
  try {  
    const hasRequiredKeys = validateKeys(config);
    if (!hasRequiredKeys) {
      throw new Error('Missing one or more of required keys: originSpaceId, targetSpaceId, managementToken')
    }
    const contentful = new DumpContentful(config);
    const contentfulData = await contentful.dump()
    const differences = new DiffSpaces(contentfulData).differences;
    return await upsertContentful(config, differences)
  } catch(e) {
    process.exitCode = 1;
    console.error(e);
  }
}
