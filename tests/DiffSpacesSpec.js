const DiffSpaces = require('../lib/DiffSpaces.js');
const expect = require('chai').expect;
const moment = require('moment');

describe('DiffSpaces', function() {
  it('correctly finds new content', function() {
    const mockContentfulData = {
      stagingData: {
        assets: [
          {
            sys: { id: 1 },
            file: { image: { url: 'somelink.com' } }
          }
        ],
        entries: [
          {
            sys: { id: 45 },
            fields: { name: 'Sean' }
          },
          {
            sys: { id: 11 },
            fields: { age: 34 }
          }
        ],
        contentTypes: []
      },
      productionData: {
        assets: [],
        entries: [],
        contentTypes: []
      }
    };
    const differences = new DiffSpaces(mockContentfulData).differences;
    const expectedDifferences = [
      {
        type: 'Entries',
        newContent: [
          {
            sys: { id: 45 },
            fields: { name: 'Sean' }
          },
          {
            sys: { id: 11 },
            fields: { age: 34 }
          }
        ],
        updatedContent: [],
        removedContent: []
      },
      {
        type: 'Assets',
        newContent: [
          {
            sys: { id: 1 },
            file: { image: { url: 'somelink.com' } }
          }
        ],
        updatedContent: [],
        removedContent: []
      },
      {
        type: 'ContentTypes',
        newContent: [],
        updatedContent: [],
        removedContent: []
      }
    ];
    expect(differences).to.deep.equal(expectedDifferences);
  });
  it('correctly finds updated content', function() {
    const assetPublishedAt = moment().add(1, 'days').toDate();
    const mockContentfulData = {
      stagingData: {
        assets: [
          {
            sys: {
              id: 1,
              publishedAt: assetPublishedAt
            },
            file: { image: { url: 'somelink.com/helloworld' } }
          }
        ],
        entries: [
          {
            sys: {
              id: 45,
              publishedAt: moment().toDate()
            },
            fields: { name: 'Sean' }
          }
        ],
        contentTypes: []
      },
      productionData: {
        assets: [
          {
            sys: {
              id: 1,
              publishedAt: moment().toDate()
            },
            file: { image: { url: 'somelink.com' } }
          }
        ],
        entries: [
          {
            sys: {
              id: 45,
              publishedAt: moment().add(1, 'days').toDate()
            },
            fields: { name: 'Sean' }
          }
        ],
        contentTypes: []
      }
    };
    const expectedDifferences = [
      {
        type: 'Entries',
        newContent: [],
        updatedContent: [],
        removedContent: []
      },
      {
        type: 'Assets',
        newContent: [],
        updatedContent: [
          {
            sys: {
              id: 1,
              publishedAt: assetPublishedAt
            },
            file: { image: { url: 'somelink.com/helloworld' } }
          }
        ],
        removedContent: []
      },
      {
        type: 'ContentTypes',
        newContent: [],
        updatedContent: [],
        removedContent: []
      }
    ];
    const differences = new DiffSpaces(mockContentfulData).differences;    
    expect(differences).to.deep.equal(expectedDifferences);
    
  });
  it('correctly finds removed content', function() {
    const mockContentfulData = {
      stagingData: {
        assets: [],
        entries: [],
        contentTypes: []
      },
      productionData: {
        assets: [
          {
            sys: { id: 1 },
            file: { image: { url: 'somelink.com' } }
          }
        ],
        entries: [
          {
            sys: { id: 45 },
            fields: { name: 'Sean' }
          }
        ],
        contentTypes: []
      }
    };
    const expectedDifferences = [
      {
        type: 'Entries',
        newContent: [],
        updatedContent: [],
        removedContent: [
          {
            sys: { id: 45 },
            fields: { name: 'Sean' }
          }
        ]
      },
      {
        type: 'Assets',
        newContent: [],
        updatedContent: [],
        removedContent: [
          {
            sys: { id: 1 },
            file: { image: { url: 'somelink.com' } }
          }
        ]
      },
      {
        type: 'ContentTypes',
        newContent: [],
        updatedContent: [],
        removedContent: []
      }
    ];
    const differences = new DiffSpaces(mockContentfulData).differences;    
    expect(differences).to.deep.equal(expectedDifferences);
  });
});
