const _ = require('underscore');
const cosmiconfig = require('cosmiconfig');
const path = require('path');
const lint = require('stylelint').lint;

const NO_CONFIG_FOUND_ERROR = new Error('No configuration found');

const getConfig = (file, options) =>
  Promise.resolve(options.config).then(config => {
    if (config) return {config};

    return cosmiconfig('stylelint', {
      rcExtensions: true
    }).load(path.dirname(file.path)).then(result => {
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

module.exports = ({file, options}) =>
  getOptions(file, options).then(lint).then(({results: {0: {warnings}}}) => {
    const errors = _.reject(warnings, {severity: 'warning'});
    if (!errors.length) return;

    throw new Error(
      `${file.path} has stylelint error(s)` +
      _.map(errors, ({line, column, text}) => `\n  ${line}:${column} ${text}`)
        .join('')
    );
  });
