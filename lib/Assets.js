const asyncForEach = require('./asyncForEach.js')

class Assets {
  constructor(space, { updatedContent, newContent, removedContent }) {
    this.space = space;
    this.updatedAssets = this.filterAssets(updatedContent);
    this.newAssets = this.filterAssets(newContent);
    this.removedAssets = removedContent;
  }
  filterAssets(assets) {
    return assets.filter( asset => Object.keys(asset.fields).length && asset.fields.file && (asset.fields.file && asset.fields.file['en-US'].url));
  }
  async upsertAndDelete() {
    const { updatedAssets, newAssets, removedAssets, space } = this;
    if (updatedAssets.length) {
      console.log('Updating assets...');
      console.log(JSON.stringify(updatedAssets));
      await this.updateAssets(updatedAssets, space);
      console.log('Successfully updated assets');
    } else {
      console.log('No assets to update');
    }

    if (newAssets.length) {
      console.log('Creating assets...');
      console.log(JSON.stringify(newAssets));
      await this.createAssets(newAssets, space);
      console.log('Successfully created assets');
    } else {
      console.log('No assets to create');
    }

    if (removedAssets.length) {
      console.log('Removing assets...');
      console.log(JSON.stringify(removedAssets));
      await this.removeAssets(removedAssets, space);
      console.log('Successfully removed assets');
    } else {
      console.log('No assets to remove');
    }
  }
  async updateAssets (updatedAssets, space) {
    return await asyncForEach(updatedAssets, async (asset) => {
      try {
        const foundAsset = await space.getAsset(asset.sys.id);
        delete asset.sys;
        const mergedAsset = Object.assign(foundAsset, asset);
        const updatedAsset = await mergedAsset.update();
        await updatedAsset.publish();
      } catch (e) {
        console.error('Error updating asset. Asset was:');
        console.log(JSON.stringify(asset));
        throw e;
      }
    });
  }
  async createAssets (newAssets, space) {
    return await asyncForEach(newAssets, async (asset) => {
      try {
        const createdAsset = await space.createAssetWithId(asset.sys.id, asset)
        return await createdAsset.publish();
      } catch (e) {
        console.error('Error creating asset. Asset was:');
        console.log(JSON.stringify(asset));
        throw e;
      }
    });
  }
  async removeAssets (removedAssets, space) {
    return await asyncForEach(removedAssets, async (asset) => {
      try {
        const foundAsset = await space.getAsset(asset.sys.id);
        const unpublishedAsset = await foundAsset.unpublish();
        return await unpublishedAsset.delete();
      } catch (e) {
        console.error('Error removing asset. Asset was:');
        console.log(JSON.stringify(asset));
        throw e;
      }
    });
  }
}

module.exports = Assets;