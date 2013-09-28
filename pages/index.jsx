require('./style.css');

var React       = require('react-tools/build/modules/React'),
    Page        = require('react-app/page'),
    request     = require('../request'),
    Footer      = require('./footer.jsx');

var Post = React.createClass({
  render: function() {
    var href = '/posts/' + this.props.id;
    return (
      <li>
        <h5><a href={href}>{this.props.metadata.title}</a></h5>
        <time datetime={this.props.metadata.created_at} class="float shadow x-small">
          {this.props.metadata.created_at}
        </time>
        <div />
      </li>
    );
  }
});

var Sidebar = React.createClass({
  render: function() {
    var a = this.props.options.author;
    var statements = [
      (a.twitter && 
          "follow me on <a href='http://twitter.com/"+a.twutter+"'>twitter</a>"),
      (a.github && 
          "see my projects on <a href='https://github.com/"+a.github+"'>github</a>"),
      "watch for updates with the <a href='/rss.xml'>atom</a> feed",
      (a.email &&
          "write me an <a href='mailto:"+a.email+"'>email</a> message")
    ].filter(Boolean).join(', ');
    return (
      <aside>
        <h1><a href="/">{this.props.options.title}</a></h1>
        <p class="small" dangerouslySetInnerHTML={{__html: statements}} />
      </aside>
    );
  }
});

var Index = React.createClass({
  render: function() {
    var posts = [], year = null;
    this.props.posts.forEach(function(post) {
      var postYear = post.metadata.created_at.split('/')[0];
      if (postYear !== year) {
        posts.push(<li class="year">{postYear}</li>);
        year = postYear;
      }
      posts.push(Post(post));
    });
    return this.transferPropsTo(
      <Page>
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <title>{this.props.options.title}</title>
          <link rel="data" href="/api/posts" />
        </head>
        <body>
          <div class="layout-default">
            <article>
              <ul class="postlist">{posts}</ul>
            </article>
            <Sidebar options={this.props.options} />
            <Footer />
          </div>
        </body>
      </Page>
    );
  }
});

module.exports = {
  Component: Index,
  getData: function(props, callback) {
    request('/api/posts', callback);
  }
};
