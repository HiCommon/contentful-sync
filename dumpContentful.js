require('dotenv').config();
const stagingSpaceId = process.env.ORIGIN_SPACE_ID;
const productionSpaceId = process.env.TARGET_SPACE_ID;
const managementToken = process.env.MANAGEMENT_TOKEN;

const spaceExport = require('contentful-export');

const stagingSpaceOpts = {
  spaceId: stagingSpaceId,
  managementToken: managementToken,
  maxAllowedItems: 10000,
  skipRoles: true,
  saveFile: false
}

const productionSpaceOpts = {
  spaceId: productionSpaceId,
  managementToken: managementToken,
  maxAllowedItems: 10000,
  skipRoles: true,
  saveFile: false
}

const dumpContentful = () => {
  console.log('Beginning dump of Contentful...')
  const data = {};
  return spaceExport(stagingSpaceOpts)
  .then( (stagingData) => {
    data.stagingData = stagingData;
    return spaceExport(productionSpaceOpts)
  })
  .then((productionData) => {
    data.productionData = productionData;
    return data;
  })
  .catch( (err) => {
    console.error('error!');
    console.error(err);
  });
}

module.exports = dumpContentful;