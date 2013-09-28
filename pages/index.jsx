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
    return (
      <aside>
        <h1><a href="/">@andreypopp</a></h1>
        <p class="small">
          follow me on <a href="http://twitter.com/andreypopp">twitter</a>,
          see my projects on <a href="https://github.com/andreypopp">github</a>,
          watch for updates with the <a href="/rss.xml">atom</a> feed
          or write me an <a href="mailto:8mayday@gmail.com">email</a> message
        </p>
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
          <title>andreypopp.com</title>
        </head>
        <body>
          <div class="layout-default">
            <article>
              <ul class="postlist">{posts}</ul>
            </article>
            <Sidebar />
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
    request('http://localhost:3000/api/posts', callback);
  }
};
