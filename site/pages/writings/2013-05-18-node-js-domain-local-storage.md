import {Post} from '../../Post';
export default Post;
export let title = 'Node.js: "domain-local" storage'

One of the recent additions to the Node.js is [domains][].

Basically domains provide a way to define a common error handling context for a
group of operations — if some error deep inside a nested callback is thrown then
corresponding domain will receive it and perform needed cleanup operations.

It eliminates a lot of burden from an usual error handling routine by allowing
not to passthrough every error returned from an async operation but simply
to throw it:

    var domain = require('domain').create();
    var fs = require('fs');

    domain.run(function() {
      fs.readFile('non-existent-file', function(err, data) {
        if (err) throw err;
        // process data
      });
    });

    domain.on('error', function() {
      // do some cleanup
      process.exit(1);
    });

But for what kind of "group of operations" you should create a new domain?
Usually such a group represents some kind of a logically sound "transaction"
such as a handling of a single HTTP request in a server process or an actual
database transaction.

What's also usual for such "groups of operations" is that they usually have to
access some specific data — inside a database transaction you certainly would
like to do all database interactions through the single connection. An obvious
way to handle this is to pass such data as function arguments but, for my taste,
it's a lot of boilerplate.

## Domain context

Enter [domain-context][], an npm package which provides a way to associate some
data with a given domain and then manage its cleanup, error handling and access.

The basic example would be:

    var context = require('domain-context');

    var lifecycle = {
      context: function() {
        // provide a context for this domain
        return {connection: new pg.Client(...)};
      },
      cleanup: function(context) {
        // commit the transaction on success
        context.connection.query('commit');
        context.connection.end();
      },
      onError: function(err, context) {
        // rollback the transaction on erro
        context.connection.query('rollback');
        context.connection.end();
      }
    };

    // run a function in a new domain with a given lifecycle
    var domain = context.runInNewDomain(lifecycle, function() {

      createUser('andreypopp' function(err, user) {
        if (err) throw err

        confirmUserEmail('andreypopp', function(err, confirmed) {
          if (err) throw err
          // ...
        });
      });
    });

Now if we would like to `createUser` and `confirmUserEmail` to participate in a
single transaction we should use a single database connection to perform those
actions. The way we do this is we query the connection from the current context:

    var createUser = function(name, cb) {
      // will use a connection from a context
      context.get('connection').query('insert into ...', cb);
    };

    var confirmUserEmail = function(name, cb) {
      // will use a connection from a context
      context.get('connection').query('update users ...', cb);
    };

Now if one of those `if (err) throw err` lines throw an error then the
transaction will be rolled back otherwise it will be commited after we dispose
the current domain with a `domain.dispose()` call — the only we thing we should
not forget to execute.

## Connect middleware

The package also provides a middleware for a [Connect][] application:

    ...
    app.use(require('connect-domain')())
    app.use(context.middleware(lifecycle));
    ... // any other middlewares goes here
    app.use(context.middlewareOnError(lifecycle));
    ...

Which with the help of [connect-domain][] creates a new domain for each request
and manages its context.

## About modularity

Note that using [domain-context][] hurts modularity of your code — it will be
usable only with the presence of domain with some specific context. It means
that this pattern isn't suitable for developing libraries. But, I think, it is
quite useful for developing final applications to reduce boilerplate and so the
number of possible bugs.

[domains]: http://nodejs.org/api/domain.html
[domain-context]: https://github.com/andreypopp/domain-context
[Connect]: http://www.senchalabs.org/connect/
[connect-domain]: https://github.com/baryshev/connect-domain
