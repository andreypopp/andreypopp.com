import {Post} from '../../Post';
export default Post;
export let title = "Recreating core.async tutorial with ES6 generators"

[David Nolen][1] publishes excellent [ClojureScript][2] tutorials on his
[blog][3].

ClojureScript is a Clojure compiler which targets JavaScript runtimes and thus
allows running Clojure code in a browser. One of its main selling points is
[core.async][5] library which hugely simplifies working with async operations.

The last published tutorial by David named ["ClojureScript 101"][4] is about how
to use core.async to make a little web app to search Wikipedia.

Use of core.async makes working with async values and operations (events and XHR
calls) a joy — clean code and no callback spaghettis.

In this blog post I'll try to replicate the tutorial by using pure JavaScript
with ES6 generators instead.

While ES6 generators are not yet available in browsers we are going to use
[regenerator][6] transpiler developed by Facebook. It transforms each generator
found in the source code into a  state machine while preserving the semantics of
the former.

So let's start with creating an `index.html` HTML page which will host our application:

    <!doctype html>
    <input id="query" type="text"></input>
    <button id="search">Search</button>
    <div id="results"></div>
    <script src="bundle.js"></script>

As you can see, the app is going to be pretty simple — when user clicks on a
button with the `search` id, app reads current query from the `query` input, calls
Wikipedia API and renders results in to the `results` container.

## Initial setup

While ClojureScript makes entire Google Closure library available for use in
your application, we are going to use some libraries from npm instead.

The obvious way to use npm packages to develop a browser app is to use
[browserify][7]. We also need a browserify transform which would process our
sources through regenerator transpiler. Such transform is called
[regeneratorify][8] and could be also installed through npm:

    % npm install browserify regeneratorify

We are going to put our code in `index.js` file and have it compiled with
browserify into `bundle.js` which will be picked up `index.html` page.

To bundle our code you run the following command:

    % ./node_modules/.bin/browserify -t regeneratorify ./index.js > bundle.js

Instead of running this command manually every time we change some code, let's
write a simple Makefile instead:

    watch:
      watch -n0.5 $(MAKE) bundle.js

    bundle.js: index.js
      ./node_modules/.bin/browserify -t regeneratorify $< > $@

This just tells that `bundle.js` depends on `index.js` (it allow `make` to know
that we should rebuild `bundle.js` only if `index.js` was modified by comparing
mtimes of both).

Now just open `index.html` in a browser, run

    % make watch

forget about it — `bundle.js` will always contain the latest version of code.

It it doesn't work, you probably doesn't have `watch` utility installed, install
it via `brew install watch` if you are running Mac OS X. I think most Linux
distributions have this utility installed out of the box, if not, consult your
package manager.

## Events as infinite generators

We are going to listen for events in an unusual way.

We create a generator function which would create for us infinite generators of
events of type `evType` occurred on DOM element `el`:

    function *listen(el, evType) {
      while (true)
        yield function(cb) {
          var fire = function(ev) {
            el.removeEventListener(evType, fire);
            cb(null, ev);
          }
          el.addEventListener(evType, fire);
        }
    }

Note that created generators will yield functions which take a single `cb`
(callback) argument. We call such functions continuables, they represent some
value which will be available in the future.

We need a special way to run such generators, let's talk shortly about that.

Note also that we're using the `while(true)` loop. This won't cause any
difficulties for us like hogging our CPU on meaningless computations. Generators
suspend on `yield` and the way we are going to run them does guarantee that we
will resume a generator only when its consumer is ready to handle another event.

For running async generators there's excellent [gens][9] library which supports
the notion of continuables out of the box. Install it via npm:

    % npm install gens

Let's do some demo code which will consume `click` events from a generator
created with `listen` and log them to browser's console:

    var gens = require('gens');

    function go(gen) {
      gens(gen)(function(err) { if (err) throw err; });
    }

    go(function*() {
      var clicks = listen(document.getElementById('search'), 'click');

      while (true) {
        // wait for click event and log it
        console.log(yield clicks.next().value);
      }
    });

After refreshing page in the browser you should see `MouseEvent`s logged in the
console when clicking on the button.

## Fetching search results

Now that we can listen for events let's write a final piece of code to search
and render results.

We are going to use `jsonp` library from npm to call Wikipedia API:

    % npm install jsonp

Now we write a `fetch` function which partially applies `jsonp` to search query
and so returns a function which accepts just a single callback argument — that
way we create continuables to use later with generators.

    var jsonp = require('jsonp');

    function fetch(url) {
      return jsonp.bind(null, url);
    }

We also need a function to render an array of results into DOM:

    function render(el, items) {
      var items = items.map(function(item) {
        return '<li>' + item + '</li>';
      });
      el.innerHTML = '<ul>' + items.join('');  + '</ul>';
    }

For this tutorial we just stick with basic `innerHTML` manipulation and string
concatenation.  For the real application I recommend using excellent [React][11]
library, also developed by Facebook.

Now the final part is just to glue these functions inside the `go` block we
wrote earlier:

    go(function*() {
      var results = document.getElementById('results');
      var query = document.getElementById('query');
      var clicks = listen(document.getElementById('search'), 'click');

      while (true) {
        yield clicks.next().value; // wait for 'click' event

        var url = 'http://en.wikipedia.org/w/api.php' +
          '?action=opensearch&format=json&search=' +
          encodeURIComponent(query.value);

        var data = yield fetch(url);
        render(results, data[1]);
      }
    });

That's all! Refresh the page in the browser, enter some query into the input
element and click on the button — after some time (needed to call Wikipedia
API) results will appear on the page.

Note that we didn't use any callbacks to specify the behaviour of our
application. Furthermore, I believe, this approach scales well on more complex
apps.

## Complete code

The complete code listing which is also available as a [gist][10]:

    var jsonp = require('jsonp');
    var gens = require('gens');

    function *listen(el, evType) {
      while (true)
        yield function(cb) {
          var fire = function(ev) {
            el.removeEventListener(evType, fire);
            cb(null, ev);
          }
          el.addEventListener(evType, fire);
        }
    }

    function fetch(url) {
      return jsonp.bind(null, url);
    }

    function render(el, items) {
      var items = items.map(function(item) {
        return '<li>' + item + '</li>';
      });
      el.innerHTML = '<ul>' + items.join('');  + '</ul>';
    }

    function go(gen) {
      gens(gen)(function(err) { if (err) throw err; });
    }

    go(function*() {
      var results = document.getElementById('results');
      var query = document.getElementById('query');
      var clicks = listen(document.getElementById('search'), 'click');

      while (true) {
        yield clicks.next().value; // wait for 'click' event

        var url = 'http://en.wikipedia.org/w/api.php' +
          '?action=opensearch&format=json&search=' +
          encodeURIComponent(query.value);

        var data = yield fetch(url);
        render(results, data[1]);
      }
    });

It's even comparable in LOC to the original core.async tutorial code, which is
surprising, given the expressiveness of Clojure.

[1]: https://twitter.com/swannodette
[2]: https://github.com/clojure/clojurescript
[3]: http://swannodette.github.io/
[4]: http://swannodette.github.io/2013/11/07/clojurescript-101/
[5]: http://clojure.github.io/core.async/
[6]: http://facebook.github.io/regenerator/
[7]: http://browserify.org
[8]: https://github.com/amiorin/regeneratorify
[9]: https://github.com/Raynos/gens
[10]: https://gist.github.com/andreypopp/7385755
[11]: http://reactjs.org
