require('dotenv').config();
const stagingSpaceId = process.env.STAGING_SPACE_ID;
const productionSpaceId = process.env.PRODUCTION_SPACE_ID;

const fs = require('fs');
const moment = require('moment');
const dirFiles = fs.readdirSync('.');
const productionDumpFile = dirFiles.find( (file) => {
  return file.includes(productionSpaceId);
});

const stagingDumpFile = dirFiles.find( (file) => {
  return file.includes(stagingSpaceId);
});

if (!stagingDumpFile || !productionDumpFile) {
  throw new Error('Could not find production and/or staging dump files');
}

const productionData = JSON.parse(fs.readFileSync(productionDumpFile, 'utf8'));
const productionSchema = productionData.contentTypes;
const productionEntries = productionData.entries;
const productionAssets = productionData.assets;

const stagingData = JSON.parse(fs.readFileSync(stagingDumpFile, 'utf8'));
const stagingSchema = stagingData.contentTypes;
const stagingEntries = stagingData.entries;
const stagingAssets = stagingData.assets;

const findDifferences = ({stagingContent, productionContent, type}) => {
  const updatedContent = [];
  const newContent = [];
  stagingContent.forEach( (stagingDatum) => {
    const matchingProductionDatum = productionContent.find( (productionDatum) => {
      return stagingDatum.sys.id === productionDatum.sys.id
    });
    if (matchingProductionDatum) {
      const productionPublishTime = moment(matchingProductionDatum.sys.publishedAt);
      const stagingPublishTime = moment(stagingDatum.sys.publishedAt);
      if (stagingPublishTime.isSameOrAfter(productionPublishTime)) {
        updatedContent.push(stagingDatum)
      }
    } else {
      newContent.push(stagingDatum)
    }
  });
  return {
    type,
    updatedContent,
    newContent
  }
}

const dataSets = [
  {
    type: 'Entries',
    stagingContent: stagingEntries,
    productionContent: productionEntries
  },
  {
    type: 'Assets',
    stagingContent: stagingAssets,
    productionContent: productionAssets
  },
  {
    type: 'Schema',
    stagingContent: stagingSchema,
    productionContent: productionSchema
  }
]

module.exports = () => {
  return dataSets.map( (set) => {
    return findDifferences(set)
  });
}
