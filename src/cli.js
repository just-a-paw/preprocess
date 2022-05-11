#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const glob = require('glob');
const options = require('./options');
const cpp = require('./cpp');

function execute(args) {
  let ops;
  try {
    ops = options.parse(args);
  } catch (e) {
    console.error(e.message);
    return 2;
  }

  if (ops.help) {
    console.info(ops.generateHelp());
    return 0;
  }

  if (ops.version) {
    console.info(`preprocess ${require('../package.json').version}`);
    console.info(`${cpp.version || 'cpp not found'}`);
    return 0;
  }

  if (!cpp.cliPath) {
    console.error(`cpp could not be found.${process.platform === 'win32' ? '\nVisual Studio 2017 or newer is required.' : ''}`);
    return 2;
  }

  /** @type {string[]} */
  const files = ops._;

  if (!files.length) {
    console.error('files are required');
    return 2;
  }

  if (!ops.output) {
    console.error('--output is required');
    return 2;
  }

  if (!fs.existsSync(ops.output))
    fs.mkdirSync(ops.output, { recursive: true });

  const ppOptions = [];
  if (!ops.defaultMacros) ppOptions.push('undef');
  ppOptions.push('noStdInc');
  ppOptions.push('noLineDir');

  const baseDirParts = files.slice(1).reduce((lastParts, file) => {
    const parts = file.split('/').slice(0, -1);
    for (var i = 0; lastParts[i] === parts[i] && i < Math.min(lastParts.length, parts.length); i++);
    return parts.slice(0, i);
  }, files[0].split('/').slice(0, -1));
  const baseDir = baseDirParts.join('/');

  for (const fileGlob of files) {
    for (const file of glob.sync(fileGlob, { nodir: true })) {
      const relative = path.relative(baseDir, file);
      const base = path.join(ops.output, relative.substring(0, Math.max(relative.lastIndexOf('/'), relative.lastIndexOf('\\'))));
      if (base && !fs.existsSync(base)) fs.mkdirSync(base, { recursive: true });
      cpp.preprocess(file, path.join(ops.output, relative), ppOptions);
    }
  }
}

process.exitCode = execute(process.argv);