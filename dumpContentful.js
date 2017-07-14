require('dotenv').config();
const stagingSpaceId = process.env.STAGING_SPACE_ID;
const productionSpaceId = process.env.PRODUCTION_SPACE_ID;
const managementToken = process.env.MANAGEMENT_TOKEN;

const spaceExport = require('contentful-export');

const stagingSpaceOpts = {
  spaceId: stagingSpaceId,
  managementToken: managementToken,
  maxAllowedItems: 10000,
  skipRoles: true
}

const productionSpaceOpts = {
  spaceId: productionSpaceId,
  managementToken: managementToken,
  maxAllowedItems: 10000,
  skipRoles: true
}


module.exports = () => {
  return Promise.resolve();
  // return spaceExport(stagingSpaceOpts)
  // .then( (res) => spaceExport(productionSpaceOpts) )
  // .catch( (err) => {
  //   console.error('error!');
  //   console.error(err);
  // });
}