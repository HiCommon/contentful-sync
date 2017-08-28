const spaceExport = require('contentful-export');

class DumpContentful {
  constructor(config) {
    this.config = config;
    this.setStagingSpaceOpts();
    this.setProductionSpaceOpts();
  }
  setStagingSpaceOpts () {
    const { originSpaceId, managementToken } = this.config;
    this.stagingSpaceOpts = {
      spaceId: originSpaceId,
      managementToken,
      maxAllowedItems: 10000,
      skipRoles: true,
      saveFile: false
    };
  }
  setProductionSpaceOpts () {
    const { targetSpaceId, managementToken } = this.config;
    this.productionSpaceOpts = {
      spaceId: targetSpaceId,
      managementToken,
      maxAllowedItems: 10000,
      skipRoles: true,
      saveFile: false
    };
  }
  dump () {
    console.log('Beginning dump of Contentful...');
    const data = {};
    return spaceExport(this.stagingSpaceOpts)
    .then(stagingData => {
      data.stagingData = stagingData;
      return spaceExport(this.productionSpaceOpts);
    })
    .then(productionData => {
      data.productionData = productionData;
      return data;
    })
    .catch(err => {
      console.error('Error dumping Contentful');
      console.error(err);
    });
  }
}

module.exports = DumpContentful;