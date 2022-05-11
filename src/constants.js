/**
 * @typedef options
 * @property {string} undef
 * @property {string} includeDirectory
 * @property {string} noStdInc
 * @property {string} noLineDir
 * @property {string} output
 */

exports.options = {};

/** @type {options} */
exports.options.win32 = {
  undef: '/u',
  includeDirectory: '/I',
  noStdInc: '/X',
  noLineDir: '/EP',
  output: '/Fi',
};

/** @type {options} */
exports.options.linux = {
  undef: '-undef',
  includeDirectory: '-I',
  noStdInc: '-nostdinc',
  noLineDir: '-P',
  output: '-o ',
};

exports.VERSION_PATTERN = /\d+\.\d+\.\d+/;