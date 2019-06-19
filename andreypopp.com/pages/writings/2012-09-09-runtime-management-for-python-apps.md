import {Post} from '../../Post';
export default Post;
export let title = "Runtime management for Python apps"

Using Django or almost any other Python web framework you probably noticed there
are some variables which are appeared to be global but really not — they are
tied to current request being processed and using them you are effectively in
"thread-safe" zone.

The well known example is how Django manages database connections — on each
request there's new database connection opened and maintained during all the
request processing phase; when request is processed, database connection is
closed. Note, that you don't get database connection as an argument to a view
function — you just import model classes you want and get data from there.
Another thing to note is that using the same models other threads processing
other requests will get their own database connections. That means such
connections are stored in a _thread-local_ container.

This approach to managing and exposing resources to client code is sometimes
criticized for being too error-prone and not too "clean" as opposed to just
passing resources as function arguments but I like to think of it as of an yet
another compromise — you rarely want all your view functions to have an
additional argument for each of database connection, memcache connection,
initialized Facebook API wrapper and so on...

For that reason I extracted this pattern into reusable library called
[runtime][1]. Most of the code is shamelessly borrowed from excellent
[Werkzeug][2] library.

The usage is centered around a `Context` class:

    from runtime import Context

which works like a container for a set of related resources which should be
accessible in some predefined scope.

For web applications I usually like to have two different contexts (that means
two different scopes) — one per-applicaiton and one per-request.

    app_ctx = Context('app')
    request_ctx = Context('request')

You can create proxies for resources which will be bound only in contexts'
scopes

    config = app_ctx.config # currently unbound
    request = request_ctx.request # currently unbound

That effectively means that `config` is defined in per-application and so we can
have two or more differently configured applications instances per process and
each request processing phase will have `request` variable bound to current
request which is being processed.

Now, following the example with web applicaitons, there is a WSGI application
which defines scopes for `app_ctx` and `request_ctx` contexts using
`with`-statements

    class App(object):

        def __init__(self, config):
            self.config = config

        def __call__(self, environ, start_response):
            with app_ctx(config=self.config):
                request = Request(environ)
                with request_ctx(request=request):
                    # call views

Now code which is called inside `app_ctx` and `request_ctx` contexts may access
proxies defined with corresponding contexts which will be effectively bound to
values passed to corresponding contexts.

[1]: https://github.com/andreypopp/runtime
[2]: http://werkzeug.pocoo.org
