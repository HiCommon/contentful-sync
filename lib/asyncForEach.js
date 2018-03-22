module.exports = async (array, callback) => {
  for (var index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
};