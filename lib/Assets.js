class Assets {
  constructor(space, { updatedContent, newContent, removedContent }) {
    this.space = space;
    this.updatedAssets = updatedContent;
    this.newAssets = newContent;
    this.removedAssets = removedContent;
  }
  upsertAndDelete() {
    return this.updateAssets()
    .then(() => this.createAssets())
    .then(() => this.removeAssets())
    .catch((err) => console.error(err));
  }
  updateAssets () {
    const { updatedAssets, space } = this;
    if (!updatedAssets.length) {
      console.log('No assets to update. Moving along...')
      return Promise.resolve();
    }
    console.log('Updating assets...');
    const filteredUpdatedAssets = updatedAssets.filter( asset => !!Object.keys(asset.fields).length && !!asset.fields.file && !!(asset.fields.file && asset.fields.file['en-US'].url))
    return Promise.all(filteredUpdatedAssets.map( (asset) => {
      return space.getAsset(asset.sys.id)
      .then( (foundAsset) => {
        delete asset.sys
        foundAsset = Object.assign(foundAsset, asset);
        return foundAsset.update();
      })
      .then( (updatedAsset) => {
        return updatedAsset.publish();
      })
      .catch( (err) => {
        console.error('Issue updating asset!');
        console.log(asset)
        console.error(err);
        throw new Error(err);
      })
    }))
    .catch( (err) => {
      console.error(err);
      throw new Error(err);
    })
  }
  createAssets () {
    const { newAssets, space } = this;    
    if (!newAssets.length) {
      console.log('No assets to create. Moving along...')
      return Promise.resolve();
    }
    console.log('Creating assets...');
    const filteredNewAssets = newAssets.filter( asset => !!Object.keys(asset.fields).length && !!asset.fields.file && !!(asset.fields.file && asset.fields.file['en-US'].url))
    return Promise.all(filteredNewAssets.map( (asset) => {
      return space.createAssetWithId(asset.sys.id, asset)
      .then( (createdAsset) => {
        return createdAsset.publish();
      })
      .catch( err => {
        console.error('Issue creating asset!')
        console.log(asset)
        console.error(err);
        throw new Error(err)
      })
    }))
    .catch( (err) => {
      console.error(err);
      throw new Error(err);
    });
  }
  removeAssets () {
    const { removedAssets, space } = this;        
    if (!removedAssets.length) {
      console.log('No assets to remove. Moving along...')
      return Promise.resolve();
    }
    console.log('Removing assets...');  
    return Promise.all(removedAssets.map( (asset) => {
      return space.getAsset(asset.sys.id)
      .then( (foundAsset) => {      
        return foundAsset.unpublish();
      })
      .then( (unpublishedAsset) => {
        return unpublishedAsset.delete();
      })
      .catch( (err) => {
        console.error('Error deleting asset!');
        console.log(asset);
        console.error(err);
        throw new Error(err);
      });
    }))
    .catch( (err) => {
      console.error(err);
      throw new Error(err);
    });
  }
}

module.exports = Assets;