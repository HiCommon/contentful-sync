## Overview

This is a tool for doing in-memory diffing of two [Contentful](https://www.contentful.com) spaces.

Rather than using the [contentful-import](https://github.com/contentful/contentful-import) tool, which (as far as I understand) clones down the 'original' space and then makes an API request for each asset, entry, content type, etc., in the 'target' space to deduce which pieces of data need creating/updating, this tool clones _both_ the original and target spaces and performs the diff in-memory. It then takes the result from the diff and performs an upsert request for those records. **It does not yet perform a deletion for the files removed in the original space.**

As it currently stands, this tool does not API rate limiting well and should thus not be used to clone spaces within Contentful, rather this should be used for spaces that have smaller differences.

## How to use
- Either add a `.env` file with the following keys or pass them in as environment variables via the command line:
  - ORIGIN_SPACE_ID
  - TARGET_SPACE_ID
  - MANAGEMENT_TOKEN
- `yarn` or `npm install`
- `yarn run start` or `npm run start`

## Contributing
Please feel free to create issues, make suggestions, and/or open a pull request! Any contributions are appreciated.
  
