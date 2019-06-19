import {Post} from '../../Post';
export default Post;
export let title = "routr: intro"

Common web application written in Python has view/controller layer (I will use a
term *view* further) which is almost entirely consist of code which:

  1. deserializes a request object into some data structures

  2. does some work with the deserialized data structures and produces some
     result

  3. serializes the produced result into a response object

Note, that only point 3. here represents some meaningful work done by a view —
others are just a *boilerplate*.

The other common problem you can find in view functions — they are all take some
*magical object* called a request as an argument. That means you cannot reason
about what data this function needs to be passed just by looking at its
signature. Even more, sometimes views depend on request object which was
previously processed by some pipeline of middlewares or something like that.
These all make view functions *difficult to compose* — it's just not safe to
call view from another view.

## Solution

The solution I see is simple — *you don't need to write views at all* — no views
means no boilerplate and no problem composing them.

How is that? Ok, you still have to do serialization/deserialization stuff
and execute some application specific code somewhere but let's...

  * Refactor serialization/deserialization code into reusable declarative
    pieces.

  * Define an API as a set of simple Python functions not "fancy" views.

  * Configure how a WSGI request should map on an API.

As an implementation of these I have a library — [routr][]. It depends on
[WebOb][] for providing request/response abstractions over WSGI.

## Defining routes

First you need to define routes, for that routr have a set of combinators:

    from routr import GET, POST, route
    from routr.schema import qs, form
    from myapp import api

    routes = route(
        GET('/', qs(page=int), api.get_news),
        GET('/latest_comments', api.get_latest_comments)
        GET('/{slug}', qs(fulltext=bool), api.get_news_item),
        POST('/{slug}/comments', form(comment=str), api.new_comment))

This structures now can be used to map WSGI requests to API functions defined in
`myapp.api` module; `qs` and `form` are called guards — they extract data from
request and pass it further so then it can be used to call API functions.

## WSGI application

Routr is a library — it means you should call it and not vice-versa. For that
you need to define a WSGI application yourself — thanks to WebOb's request and
response objects it's not that difficult.

<pre>from routr import GET, POST, routr
from myapp import api
from webob import Request, Response

def application(environ, start_response):
    request = Request
    <span class="line">trace = routes(request)</span>
    <span class="line">response = trace.target(*trace.args, **trace.kwargs)</span>
    if not isinstance(response, Response):
        <span class="line">response = Response(json=response)</span>
    return response(environ, start_response)</pre>

The line <span class="lineref">1</span> shows how to route a `request` using
previously defined `routes` structure — the result is a *trace* object which
keeps information and extracted data from WSGI request needed for currently
matched route.

Then goes actual call <span class="lineref">2</span> to an API function which is
provided via `target` attribute of a trace object using arguments extracted from
a request during routing. For example `GET /twitter-goes-down?fulltext=true`
will trigger a call to `api.get_news_item('twitter-goes-down', fulltext=True)`
and so on.

Finally if you return from your API function object which is not a response —
and usually it is so — it will be converted <span class="lineref">3</span> to
JSON and served with `application/json` mime type to a client. Of course you can
define more sophisticated rules here — that one is just for the example.

This simple schema allows you to build your application from small reusable
pieces of code — both for request deserialization/validation and for application
logic itself.

[routr]: http://routr.rtfd.org
[WebOb]: http://webob.org
