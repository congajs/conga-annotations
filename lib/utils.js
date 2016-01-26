'ues strict'

module.exports = {
  /**
   * Find the line number of a given position within the
   * given file source string
   *
   * @param {String} src
   * @param {Number} position
   * @returns {Number}
   */
  findLineNumberOfPosition: (src, position) => {
    const str = src.substring(0, position)
    try {
      return ((str.match(/[^\n]*\n[^\n]*/gi).length) + 1)
    }
    catch (e) {
      return 1
    }
  }
}
