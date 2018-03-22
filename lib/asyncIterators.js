module.exports = {
  asyncForEach: async (array, callback) => {
    for (var index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  },
  asyncMap: async (array, callback) => {
    const resolvedPromises = [];
    for (var index = 0; index < array.length; index++) {
      resolvedPromises.push(await callback(array[index], index, array));
    };
    return resolvedPromises;
  }
}