import {Post} from '../../Post';
export default Post;
export let title = "Testing Node.js apps with Mocha and Fibers"

While [node-fibers][1] seems not to be a popular way to develop software in
Node-land (which is unfortunate), I think, it is quite handy and useful and you
should at least try to use it for writing tests for your apps.

First, what's [node-fibers][1]? It's a library which brings coroutines for
Node.js. It is for Node.js as Fibers for Ruby, greenlets for Python, processes
for Erlang and goroutines for Go.

In practice that means that you can write synchronously looking code which
executes in an async way underneath. The library is pretty low-level and is not
meant to be used directly but rather through higher-level abstractions,
[fibrous][2] is one of those I like best. The example of an async reading from
filesystem using fibrous synchronous API:

    var fibrous = require('fibrous');
    var fs = require('fs');

    fibrous.run(function() {
      var content = fs.sync.readFile('README', 'utf8');
      console.log(content); // outputs the content of README
    });

Note, that this is not like `fs.readFileSync`, it is completely non-blocking
call in a way that this doesn't block event loop but rather a single fiber which
is created by `fibrous.run` function. So a lot of such calls can be executed
concurrently with almost no overhead on top of callbacks.

Yes, it patches `Object` and `Function` to add `.sync` property but that's
worthwhile the easiness you get when adapting Node-style callback API to fiber
based API. In fact, you can use Node callbacks everywhere you like and only use
fibers where necessary. Just use `.sync` property on functions and objects to
get a fiber API which fully reflects the original one.

These all make fibrous (and fibers) very useful for writing tests for Node.js
apps. You don't usually want your apps/libs (especially open source) to depend
on such a "magical" thing as fibers but using it just for tests doesn't make so
much pressure on you.

I use fibers in combination with [mocha][3]. For that you would need a version
of mocha which is greater or equal to 1.14.0 otherwise you are not allowed to
use custom mocha UIs except for the bundled ones. You also need to install a
[mocha-fibers][4] UI for mocha which wraps `it`, `before`, `beforeEach`, ...
blocks into fibers. It isn't yet on npm so you can install it from my [fork][5]
which has the latest fixes. You also need fibrous package installed.

    % npm install fibrous
    % npm install 'mocha@>=1.14.0'
    % npm install https://github.com/andreypopp/mocha-fibers.git

Then use the following command to run your test cases:

    % mocha --ui mocha-fibers --require fibrous ./tests.js

Now you can use fibrous API inside you test cases:

    var fs = require('fs');

    describe('my app', function() {

      it('works', function() {
        var contentA = fs.sync.readFile('./a');
        var contentB = fs.sync.readFile('./b');
        // ... do some assertions
      });

    });

Of course, examples with `fs` are not quite interesting because `fs` module has
synchronous API which is suitable for use when writing tests. But you got the
idea — you can execute synchronously any async function which accepts callback
as it last argument by simply preprending `.sync` suffix before.

[1]: https://github.com/laverdet/node-fibers
[2]: https://github.com/goodeggs/fibrous
[3]: https://github.com/visionmedia/mocha
[4]: https://github.com/pulseio/mocha-fibers
[5]: https://github.com/andreypopp/mocha-fibers
