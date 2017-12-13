class Assets {
  constructor(space, { updatedContent, newContent, removedContent }) {
    this.space = space;
    this.updatedAssets = updatedContent;
    this.newAssets = newContent;
    this.removedAssets = removedContent;
  }
  async upsertAndDelete() {
    try {
      await this.updateAssets();
      await this.createAssets();
      await this.removeAssets();     
    } catch(e) {
      console.error(e);
    }
  }
  async updateAssets () {
    const { updatedAssets, space } = this;
    const filteredUpdatedAssets = updatedAssets.filter( asset => !!Object.keys(asset.fields).length && !!asset.fields.file && !!(asset.fields.file && asset.fields.file['en-US'].url))
    if (!filteredUpdatedAssets.length) {
      console.log('No assets to update. Moving along...')
      return Promise.resolve();
    }
    console.log('Updating assets...');
    console.log(filteredUpdatedAssets)
    for(var i=0; i<filteredUpdatedAssets.length; i++) {
      const asset = filteredUpdatedAssets[i]
      const foundAsset = await space.getAsset(asset.sys.id);
      delete asset.sys
      const mergedAsset = Object.assign(foundAsset, asset);
      const updatedAsset = await mergedAsset.update();
      return await updatedAsset.publish();
    }
  }
  async createAssets () {
    const { newAssets, space } = this;    
    const filteredNewAssets = newAssets.filter( asset => !!Object.keys(asset.fields).length && !!asset.fields.file && !!(asset.fields.file && asset.fields.file['en-US'].url))
    if (!filteredNewAssets.length) {
      console.log('No assets to create. Moving along...')
      return Promise.resolve();
    }
    console.log('Creating assets...');
    console.log(filteredNewAssets)
    for(var i=0; i<filteredNewAssets.length; i++) {
      const asset = filteredNewAssets[i];
      const createdAsset = await space.createAssetWithId(asset.sys.id, asset)
      return await createdAsset.publish();
    }
  }
  async removeAssets () {
    const { removedAssets, space } = this;        
    if (!removedAssets.length) {
      console.log('No assets to remove. Moving along...')
      return Promise.resolve();
    }
    console.log('Removing assets...');
    console.log(removedAssets)
    for(var i=0; i<removedAssets.length; i++) {
      const asset = removedAssets[i];
      const foundAsset = await space.getAsset(asset.sys.id);
      const unpublishedAsset = await foundAsset.unpublish();
      return await unpublishedAsset.delete();
    }
  }
}

module.exports = Assets;