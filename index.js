var fs          = require('fs'),
    path        = require('path'),
    q           = require('kew'),
    express     = require('express'),
    pages       = require('react-app'),
    utils       = require('lodash'),
    Feed        = require('feed'),
    Collection  = require('./collection');

function promise(func) {
  return function(req, res, next) {
    return func(req)
      .then(function(response) { res.send(response) })
      .fail(next);
  }
}

function createApp(opts) {
  opts = opts || {};

  var app = express(),
      posts = new Collection({path: './posts'});

  app.use(pages({
    '/':            './pages/index.jsx',
    '/posts/:id':   './pages/post.jsx'
  }, {debug: opts.debug}));

  app.get('/api/posts', promise(function(req) {
    return posts
      .map(function(post) {
        if (!post.metadata.draft)
          return utils.pick(post, ['id', 'metadata']);
      })
      .then(function(posts) { return {posts: posts.filter(Boolean)} });
  }));

  app.get('/api/posts/:id', promise(function(req) {
    return posts.get(req.params.id);
  }));

  app.get('/rss.xml', promise(function(req) {
    return posts.all().then(function(posts) {
      var feed = new Feed({
        title: '@andreypopp',
        link: 'http://andreypopp.com',
        author: {
          name: 'Andrey Popp',
          email: '8mayday@gmail.com'
        }
      });
      posts.slice(0, 10).forEach(function(post) {
        feed.item({
          title: post.metadata.title,
          link: 'http://andreypopp.com/posts/' + post.id,
          date: new Date(post.metadata.created_at),
          content: post.contents
        });
      });
      return feed.render('atom-1.0');
    });
  }));

  return app;
}

createApp({debug: true}).listen(3000);
