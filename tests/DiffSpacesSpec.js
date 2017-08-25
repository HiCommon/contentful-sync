const DiffSpaces = require('../DiffSpaces.js');
const expect = require('chai').expect;

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
  it('correctly finds updated content', function() {});
  it('correctly finds removed content', function() {});
});
