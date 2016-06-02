const _ = require('underscore');
const cosmiconfig = require('cosmiconfig');
const path = require('path');
const lint = require('stylelint').lint;

const NO_CONFIG_FOUND_ERROR = new Error('No configuration found');

const getConfig = (file, options) =>
  Promise.resolve(options.config).then(config => {
    if (config) return {config};

    return cosmiconfig('stylelint', {
      cwd: path.dirname(file.path),
      rcExtensions: true
    }).then(result => {
      if (!result) throw NO_CONFIG_FOUND_ERROR;

      return {
        config: result.config,
        configBasedir: path.dirname(result.filepath)
      };
    });
  });

const getOptions = (file, options) =>
  getConfig(file, options).then(({config, configBasedir}) =>
    Object.assign({}, options, {
      code: file.buffer.toString(),
      codeFilename: file.path,
      config,
      configBasedir
    })
  );

module.exports = (file, options, cb) => {
  try {
    getOptions(file, options).then(lint).then(({errored, results}) => {
      if (!errored) return cb(null, {});

      throw new Error(
        `${file.path} has stylelint error(s)\n` +
        _.chain(results[0].warnings)
          .reject({severity: 'warning'})
          .map(({line, column, text}) => `  ${line}:${column} ${text}`)
          .value()
          .join('\n')
      );
    }).catch(cb);
  } catch (er) { cb(er); }
};
