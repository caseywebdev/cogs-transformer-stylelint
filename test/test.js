var helper = require('cogs-test-helper');

helper.run({
  'test/config.json': {
    'test/clean.css': helper.getFileBuffer('test/clean.css'),
    'test/warn.css': helper.getFileBuffer('test/warn.css'),
    'test/error.css': Error,
    'test/error2.css': Error
  }
});
