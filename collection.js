var fs          = require('fs'),
    path        = require('path'),
    robotskirt  = require('robotskirt'),
    q           = require('kew'),
    utils       = require('lodash');

function Collection(opts) {
  this.opts = opts;
  this.get = utils.memoize(this.get);
  this.all = utils.memoize(this.all);
}

Collection.prototype = {
  _readFilenames: function() {
    var promise = q.defer();
    fs.readdir(this.opts.path, promise.makeNodeResolver());
    return promise.then(function(filenames) {
      filenames.reverse();
      return filenames.map(function(filename) {
        return path.join(this.opts.path, filename);
      }.bind(this));
    }.bind(this));
  },

  all: function() {
    return this._readFilenames().then(function(filenames) {
      return q.all(filenames.map(function(filename) {
        var id = path.relative(this.opts.path, filename).replace(/\.md$/, '');
        return this.get(id);
      }.bind(this)));
    }.bind(this));
  },

  map: function(func) {
    return this.all().then(function(filenames) {
      return q.all(filenames.map(func));
    });
  },

  get: function(id) {
    var filename = path.join(this.opts.path, id + '.md');
    return getPost(filename).then(function(post) {
      post.id = id;
      return post;
    });
  }
};

function renderMarkdown(markdown) {
  var renderer = new robotskirt.HtmlRenderer(),
      parser = new robotskirt.Markdown(renderer);
  return parser.render(markdown);
}

function splitMetadata(contents) {
  var parts = contents.split('---').filter(Boolean);
  if (parts.length > 1) {
    var metadata = {};
    parts[0].split('\n').filter(Boolean).forEach(function(stanza) {
      var parts = stanza.split(':');
      if (parts.length > 1) {
        metadata[parts[0].trim()] = parts.slice(1).join('').trim()
          .replace(/^"/, '')
          .replace(/"$/, '')
          .replace(/\\"/g, '"')
      }
    });
    return {metadata: metadata, contents: parts.slice(1).join('').trim()}
  } else {
    return {metadata: {}, contents: contents}
  }
}

function readFile(filename, opts) {
  var promise = q.defer();
  fs.readFile(filename, opts, promise.makeNodeResolver());
  return promise;
}

function getPost(filename) {
  return readFile(filename, {encoding: 'utf-8'}).then(function(contents) {
    var post = splitMetadata(contents);
    post.contents = renderMarkdown(post.contents);
    return post;
  });
}

module.exports = Collection;
