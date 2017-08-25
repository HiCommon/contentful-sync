const spaceExport = require('contentful-export');

const stagingSpaceOpts = ({ originSpaceId, managementToken }) => {
  return {
    spaceId: originSpaceId,
    managementToken,
    maxAllowedItems: 10000,
    skipRoles: true,
    saveFile: false
  };
};

const productionSpaceOpts = ({ targetSpaceId, managementToken }) => {
  return {
    spaceId: targetSpaceId,
    managementToken,
    maxAllowedItems: 10000,
    skipRoles: true,
    saveFile: false
  };
};

const dumpContentful = config => {
  console.log('Beginning dump of Contentful...');
  const data = {};
  return spaceExport(stagingSpaceOpts(config))
  .then(stagingData => {
    data.stagingData = stagingData;
    return spaceExport(productionSpaceOpts(config));
  })
  .then(productionData => {
    data.productionData = productionData;
    return data;
  })
  .catch(err => {
    console.error('Error dumping Contentful');
    console.error(err);
  });
};

module.exports = dumpContentful;
