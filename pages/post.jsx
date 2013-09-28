require('./style.css');

var React       = require('react-tools/build/modules/React'),
    Page        = require('react-app/page'),
    request     = require('../request'),
    Footer      = require('./footer.jsx');

var Sidebar = React.createClass({
  render: function() {
    return (
      <aside>
        <p class="go-back"><a href="/">← go back</a></p>
        <p class="small shadow">
          published on <time>{this.props.metadata.created_at}</time>
          tagged with {this.props.metadata.tags}
        </p>
        <p class="small shadow">
          watch for updates with the <a href="/rss.xml">atom</a> feed
        </p>
        <p class="small shadow">
          have a feedback? you can send me a
          <a target="_blank" href="https://twitter.com/share?related=andreypopp&amp;text=@andreypopp" class="twitter-share-button" data-lang="en">tweet</a> or an
          <a href="mailto:8mayday@gmail.com">email</a>
          message
        </p>
      </aside>
    );
  }
});


var Post = React.createClass({
  render: function() {
    var title = this.props.metadata.title + ' — ' + this.props.options.title;
    return this.transferPropsTo(
      <Page>
        <head>
          <title>{title}</title>
        </head>
        <body>
          <div class="layout-post">
            <article>
              <header>
                <h1>{this.props.metadata.title}</h1>
              </header>
              <article dangerouslySetInnerHTML={{__html: this.props.contents}}>
              </article>
            </article>
            <Sidebar metadata={this.props.metadata} />
            <Footer />
          </div>
        </body>
      </Page>
    );
  }
});

module.exports = {
  Component: Post,
  getData: function(props, callback) {
    request('/api/posts/' + props.params.id, callback);
  }
};
