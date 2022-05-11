module.exports = require('optionator')({
  prepend: 'preprocess [options] file.js [file.py] [src/**.js] -o out',
  options: [
    {
      option: 'help',
      alias: 'h',
      type: 'Boolean',
      description: 'Show help',
    },
    {
      option: 'version',
      alias: 'v',
      type: 'Boolean',
      description: 'Show version',
    },
    {
      option: 'output',
      alias: 'o',
      type: 'String',
      description: 'Output directory',
    },
    {
      option: 'default-macros',
      alias: 'd',
      type: 'Boolean',
      default: false,
      description: 'Allow default macros, such as __FILE__',
    }
  ],
})