## Overview

[Contentful Sync](https://github.com/HiCommon/contentful-sync) is a library for doing in-memory diffing of two [Contentful](https://www.contentful.com) spaces.

Rather than using the [contentful-import](https://github.com/contentful/contentful-import) library, which (as far as I understand) clones down the 'original' space and then makes an API request for each asset, entry, content type, etc., in the 'target' space to deduce which pieces of data need creating/updating, this library clones _both_ the original and target spaces and performs the diff in-memory. It then takes the result from the diff and performs a create, update, or delete request for the relevant pieces of content.

As it currently stands, this library does not handle API rate limiting well and thus should probably not be used to clone spaces within Contentful. This library is better suited to sync spaces that have fewer differences.

## Assumptions and limitations
### Limitations
At the moment, the library syncs just Entries, Assets, and Content Types.

### Assumptions
This library assumes that:
- You have two spaces that you need to keep in sync.
- You only update the 'origin' (i.e., staging) space, and do not manually edit anything in your 'target' (i.e., production) space.
- Both spaces are set the `en-US` locale (you can manually overcome this by editing `filterAssets` in `lib/Assets.js`).

This library will sync unidirectionally -- it will sync exclusively from origin -> target. If that is not how you or your content team operates, this probably is not the tool for you.

## Usage
Add the package to your repository:
`yarn add contentful-sync` or `npm install contentful-sync --save` 

Require in the library:
```js
const contentfulSync = require('contentful-sync');
```

Create a configuration object that contains the origin space's ID, the target space's ID, and your management token. These are all required.
```js
const contentfulSync = require('contentful-sync');

const config = {
  originSpaceId: 'XXXXXXXX',
  targetSpaceId: 'YYYYYYYY',
  managementToken: 'ABCDE12345'
};
```

Invoke `contentfulSync` with the configuration object. `contentfulSync` will return a promise. 
```js
const contentfulSync = require('contentful-sync');

const config = {
  originSpaceId: 'XXXXXXXX',
  targetSpaceId: 'YYYYYYYY',
  managementToken: 'ABCDE12345'
};

contentfulSync(config)
.then(setOfDifferences => {
  console.log(setOfDifferences);
  console.log('Synced successfully!');
})
.catch(err => {
  console.log('Error!');
  console.error(err);
});
```

### `originSpaceId`
This is the space that's treated as the source of truth. `contentful-sync` will attempt to replicate this space in the target space but will not update any content in this space.

### `targetSpaceId`
This is the space that will be updated based on the content in the origin space.

## Contributing
Please feel free to create issues, make suggestions, and/or open a pull request! Any contributions are appreciated.

**Battle tested at [Common](https://www.common.com)** ![Common Living](https://www.common.com/static/images/favicons/favicon-32x32.png "Common Living")
