var helper = require('cogs-test-helper');

helper.run({
  'test/config.json': {
    'test/clean.css': {
      path: 'test/clean.css',
      buffer: helper.getFileBuffer('test/clean.css'),
      hash: helper.getFileHash('test/clean.css'),
      requires: [{
        path: 'test/clean.css',
        hash: helper.getFileHash('test/clean.css')
      }],
      links: [],
      globs: []
    },
    'test/warn.css': {
      path: 'test/warn.css',
      buffer: helper.getFileBuffer('test/warn.css'),
      hash: helper.getFileHash('test/warn.css'),
      requires: [{
        path: 'test/warn.css',
        hash: helper.getFileHash('test/warn.css')
      }],
      links: [],
      globs: []
    },
    'test/error.css': Error,
    'test/error2.css': Error
  }
});
