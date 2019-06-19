import {Post} from '../../Post';
export default Post;
export let title = "RPC over WebSockets"

Wouldn't be cool to use WebSockets as a transport for an RPC mechanism? Imagine
if you can make any request to a server in your application not only through XHR
but also through persistent WebSocket connection.

Let's see how we compose a solution almost in a minute by using ready made
reusable tiny libraries. How do we achieve that? Using [streams][].

A stream is an amazingly efficient and composable abstraction for I/O. Below you
will see how we glue together several stream-based libraries to provide an RPC
on top of WebSockets.

## RPC on top of Streams

The first library we need is [stream-rpc][] which provides an RPC mechanism on
top of arbitrary streams:

    var rpc = require('stream-rpc');

    var client = rpc()
    var server = rpc({
      handle: function(request, done) {
        // process request
        done(null, {msg: 'hello, ' + request.name + '!'});
      });

    client.pipe(server).pipe(client);

    client.call({name: 'world'}, function(err, response) {
      console.log(response.msg); // 'hello, world!'
    });

As you can see we created `client` and `server` streams and connected them
directly to each other. But we are not required to connect them that way, we can
place `client` and `server` in different processes and even on different
physical machines and connect them through network.

## JSON over streams

So we figured out how to do RPC over streams. Now if we want to put `client` and
`server` in different processes and interface over WebSockets then we need to
serialize and deserialize data inside streams.

Let's choose JSON as a serialization format and provide streams which can handle
the mechanics:

    var through = require('through');

    var serialize = function() {
      return through(function(data) {
        this.push(JSON.stringify(data));
      });
    };

    var deserialize = function() {
      return through(function(data) {
        this.push(JSON.parse(data));
      });
    };

As you can see we used a tiny [through][] library which allows to define streams
which transform values inside.

## RPC on top of WebSockets

The final step is to find a way to represent a WebSocket connection as a stream
and connect our `client` and `server` streams together by the means of it.

Luckily for us, there is [websocket-stream][] library which provides exactly
what we need — a WebSocket interaction modelled as a stream, suitable both for
Node.js and in browser usage.

On server we have:

    var websocket = require('websocket-stream'),
        rpc = require('stream-rpc'),
        ws = require('ws'),
        wss = new ws.Server({port: 3000}),
        handle = function(request, done) {
          // process request
          done(null, {msg: 'hello, ' + request.name + '!'});
        };

    wss.on('connection', function(ws) {
      var sock = websocket(ws),
          server = rpc({handle: handle});
      server
        .pipe(serialize())
        .pipe(sock)
        .pipe(deserialize())
        .pipe(server);
    });

Now the client part which uses exactly the same libraries:

    var websocket = require('websocket-stream'),
        rpc = require('stream-rpc'),
        sock = websocket('ws://localhost:3000'),
        client = rpc();

    client
      .pipe(serialize())
      .pipe(sock)
      .pipe(deserialize())
      .pipe(client);

    sock.on('open', function() {
      client.call({name: 'andrey'}, function(err, response) {
        console.log(response.msg); // 'hello, andrey!'
      });
    });

These are the complete examples, you can try them and see how it works.

As you can see, we can create a working solution using just a minimum amount of
code and sharing almost all of it between the server and the client.

If you want to know more about streams in Node.js I can recommend you reading a
[stream handbook].

[streams]: http://nodejs.org/api/stream.html
[stream-rpc]: https://github.com/andreypopp/stream-rpc
[websocket-stream]: https://github.com/maxogden/websocket-stream
[through]: https://github.com/dominictarr/through
[stream handbook]: https://github.com/substack/stream-handbook
