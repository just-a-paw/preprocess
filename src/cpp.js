const proc = require('node:child_process');
const path = require('node:path');
const constants = require('./constants');

class CommandLineError extends Error {
  constructor({ stderr, status, signal }) {
    super(
      stderr?.toString() ||
      (signal ? `Process was terminated with signal ${signal}` :
        status ? `Process was terminated with status code ${status}` :
          `Process was terminated with unknown circumstances`)
    );

    this.stderr = stderr?.toString();
    this.status = status;
    this.signal = signal;
  }
}

function spawn(args) {
  const { status, error, stderr, stdout, signal } = proc.spawnSync(args, { timeout: 1e4, shell: true });
  if (status !== 0) throw error || new CommandLineError({ stderr, status, signal });

  return stdout.toString();
}

exports.isSupportedPlatform = ['win32', 'linux'].includes(process.platform);
/** @type {constants.options} */
exports.options = constants.options[process.platform];

exports.cliPath = null
exports.version = null;
let cliArgPrepend;

if (process.platform === 'win32') {

  cliArgPrepend = '/P ';
  try {
    const result = spawn(`pwsh.exe ${path.resolve(__dirname, '..', 'get-vc.ps1')}`);
    const [version, cliPath] = result.split('\n');
    exports.version = `VC++ ${version}`;
    exports.cliPath = `"${cliPath}"`;
  } catch (e) {
    if (!(e instanceof CommandLineError) || e.signal) throw e;
  }

} else {

  cliArgPrepend = '';
  try {
    const result = spawn('cpp --version');
    exports.version = `cpp ${result.match(constants.VERSION_PATTERN)[0]}`;
    exports.cliPath = 'cpp';
  } catch (e) {
    if (!(e instanceof CommandLineError) || e.signal) throw e;
  }

}

exports.preprocess = function preprocessFile(filePath, outDir, opts) {
  return spawn(`\
${exports.cliPath} \
${cliArgPrepend}\
${opts.map(o => exports.options[o]).join(' ')} \
${exports.options.includeDirectory}. \
${filePath} \
${exports.options.output}\
${outDir}\
`);
}

exports.CommandLineError = CommandLineError;