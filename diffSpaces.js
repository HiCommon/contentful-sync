require('dotenv').config();
const stagingSpaceId = process.env.ORIGIN_SPACE_ID;
const productionSpaceId = process.env.TARGET_SPACE_ID;

const fs = require('fs');
const moment = require('moment');

const findDifferences = ({stagingContent, productionContent, type}) => {
  const updatedContent = [];
  const newContent = [];
  const removedContent = [];
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
  productionContent.forEach( (productionDatum) => {
    const matchingStagingDatum = stagingContent.find( (stagingDatum) => {
      return productionDatum.sys.id === stagingDatum.sys.id;
    });
    if (!matchingStagingDatum) {
      removedContent.push(productionDatum)
    }
  })
  return {
    type,
    updatedContent,
    newContent,
    removedContent
  }
}

const formatData = function (contentfulData) {
  const { stagingData, productionData } = contentfulData;
  const productionSchema = productionData.contentTypes;
  const productionEntries = productionData.entries;
  const productionAssets = productionData.assets;

  const stagingSchema = stagingData.contentTypes;
  const stagingEntries = stagingData.entries;
  const stagingAssets = stagingData.assets;
  return [
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
}

const diffSpaces = (contentfulData) => {
  console.log('Beginning diffing of Contentful spaces');
  const dataSets = formatData(contentfulData)
  return dataSets.map( (set) => {
    return findDifferences(set)
  });
}

module.exports = diffSpaces;
