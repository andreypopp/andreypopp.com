import {Post} from '../../Post';
export default Post;
export let title = "Fighting Node callback hell with PureScript"

Recently [TJ Holowaychuk][tj], one of the most active persons in Node.js
ecosystem said [good bye to Node.js][farewell-nodejs]. He switched to Go.

As one of the reasons he mentions:

> In the past week I’ve rewritten a relatively large distributed system in Go, and
> it’s robust, performs better, it’s easier to maintain, and has better test
> coverage since synchronous code is generally nicer and simpler to work with.

The Go programming language has the notion of goroutines, a lightweight
threading mechanism which allows to express program logic in a synchronous
control flow even if underneath it uses non-blocking I/O.

This is in contrast to Node.js where you need to control an asynchronous
execution of I/O explicitly by passing callbacks around:

    function readWriteFile(filenameIn, filenameOut, cb) {
      fs.readFile(filenameIn, function(err, contents) {
        if (err) {
          return cb(err)
        }
        fs.writeFile(filenameOut, contents, function(err) {
          if (err) {
            return cb(err)
          }
          cb(null)
        })
      })
    }

Function above reads contents of `filenameIn` and writes it into `filenameOut`.
Silly example, but it illustrates well how such a simple task can become
unreasonably complex when expressing with callbacks.

But callback-based programming is even worse at scale because it forces you to
structure and decompose your code around how you do an I/O and not how your
application domain requires.

What if instead of using callbacks to express program we would do it using
synchronous-looking code and then some source transformation would compile it
back to callback-based code?

An example:

    readWriteFile filenameIn filenameOut = do
      contents <- readFile filenameIn
      writeFile contents

Code above is not JavaScript, it's [PureScript][purescript]. The point is
that it looks as simple as the task it performs.

PureScript is a strictly typed programming language which compiles to
JavaScript. It looks like and inspired by Haskell.

If you don't know Haskell, don't worry, the code in the blog post is simple
enough to understand without any background in Haskell. Though if you know it
you'd probably find my explanations to be naive.

This blog post isn't meant to be an introduction to PureScript. What we going to
do instead is to show how to build a library which would allow to interface with
asynchronous Node.js code. Instead of callback-based interface we are going to
provide a way to write synchronous-looking code, like `readWriteFile` function
above.

An example which defines an interface for Node's `fs.readFile` and
`fs.writeFile` functions:

    import Node.Thunk

    foreign import fs "var fs = require('fs');" :: {
      readFile :: ThunkFn2 String String,
      writeFile :: ThunkFn3 String String String,
      }

    readFile = runThunkFn2 fs.readFile
    writeFile = runThunkFn3 fs.writeFile

An interesting point to note is that PureScript offers nothing designed
specifically to deal with async operations. Yet all the features we are going to
use are general enough to so we can express asynchronous computations in a
concise manner.

[tj]: https://github.com/visionmedia
[farewell-nodejs]: https://medium.com/code-adventures/farewell-node-js-4ba9e7f3e52b
[purescript]: http://purescript.org

## Implementation

We are going to use a couple of predefined PureScript modules. Some of them are
part of the standard library but some should be installed via [bower][] package
manager:

    % bower install purescript-global purescript-either

Let's start with some imports:

    module Node.Thunk where

    import Control.Monad.Eff
    import Data.Either
    import Global

`Control.Monad.Eff` provides `Eff` data type which PureScript uses to represent
an effectful computation. This is similar to `IO` in Haskell but actually more
powerful and typesafe. You can read more on `Eff` in a [blog post][eff] on
PureScript blog.

`Data.Either` provides `Either` data type which represent either a value or an
error. It is similar to Haskell's `Either`.

`Global` provides `Error` data type which maps to JavaScript `Error`.

[eff]: http://www.purescript.org/posts/Eff-Monad/
[bower]: http://bower.io

### Representing Node async functions

We want a way to represent values (or errors) which will be available after some
async I/O is done. We want them to be typed by the type of the result:

    foreign import data Thunk :: * -> *

The `* -> *` means that `Thunk` is not a simple data type, but a data type which
can be parametrized by another data type.

For example, `Thunk Number` is a data type which represents a number which will
be available at some moment in the future.

Note that implementation of `Thunk` is opaque to PureScript compiler. We are
going to define a couple of FFI functions which will represent primitive
operations a programmer can perform on `Thunk` values.

We should still define how `Thunk` will be represented at runtime.

Let's define values of `Thunk` to be functions which take a single argument, a
callback of the shape `cb(err, result)`. That way thunks are perfectly valid
Node.js asynchronous functions, like `process.nextTick(cb)`.

Let's define FFI primitives which help us create `Thunk` values:


    foreign import resolve
      "function resolve(a) { return function(cb) { cb(null, a); } }"
      :: forall a. a -> Thunk a

    foreign import reject
      "function resolve(err) { return function(cb) { cb(err); } }"
      :: forall a. Error -> Thunk Unit

As you see `resolve` and `reject` return a thunk, a `function(cb) {...}` value,
as we agreed.

We also need a function which would allow to get the wrapped value out of
`Thunk`:

    foreign import runThunk
      "function runThunk(a) {                                          \
      \  return function(handler) {                                    \
      \    return function() {                                         \
      \      return a(function(err, result) {                          \
      \        if (err) {                                              \
      \          handler(PS.Data_Either.Left(err))();                  \
      \        } else {                                                \
      \          handler(PS.Data_Either.Right(result))();              \
      \        }                                                       \
      \      });                                                       \
      \    };                                                          \
      \  };                                                            \
      \}"
      :: forall a b eff eff2.
      Thunk a
      -> (Either Error a -> Eff (eff) b)
      -> Eff (eff2) Unit

The type signature may seems a little complex for novice PureScripters but it is
actually quite simple. What it says is that `runThunk` gets a thunk and a
function which accepts either an error or a thunk's value and executes an
action.

`runThunk` being a PureScript function of two arguments is represented in
JavaScript as a function of a single argument which returns another function
which takes the second argument. This is because functions in PureScript are
curried.

Another interesting point to note is that PureScript represents values of `Eff`
as functions with no arguments: `function() {...}`. This is what `runThunk`
returns when it receives its two arguments.

We already can define a super simple program which operates on thunks:

    main = do
      let value = resolve 1
      runThunk value handle
        where
      handle (Left err) = print ("Error: " ++ (show err))
      handle (Right result) = print ("Result: " ++ (show result))

This is not yet useful though. We need to define more primitve FFI operations on
thunks before we can write real world programs with them.

### Transforming thunks

Another useful primitive operation on thunks is `fmap`. It defines how to
transform a thunk by producing another thunk with a transformed value.

    foreign import fmap
      "function fmap(f) {                                              \
      \  return function(a) {                                          \
      \    return function(cb) {                                       \
      \      a(function(err, result) {                                 \
      \        if (err) return cb(err);                                \
      \        try {                                                   \
      \          result = f(result);                                   \
      \        } catch (err) {                                         \
      \          return cb(err);                                       \
      \        }                                                       \
      \        cb(null, result);                                       \
      \      });                                                       \
      \    };                                                          \
      \  };                                                            \
      \}"
      :: forall a b. (a -> b) -> Thunk a -> Thunk b

Its type reads as "given a function and a thunk we can get another thunk with
this function applied to a result of the former thunk".

Again, a not yet so useful example:

    two = resolve 2
    four = fmap (\n -> n * 2) two

### Chaining computations on thunks

Next thing is to define an operation of chaining computations on thunks:

    foreign import bind
      "function bind(a) {                                              \
      \  return function(f) {                                          \
      \    return function(cb) {                                       \
      \      a(function(err, a) {                                      \
      \        if(err) return cb(err);                                 \
      \        try {                                                   \
      \          f(a)(cb);                                             \
      \        } catch(err) {                                          \
      \          return cb(err);                                       \
      \        }                                                       \
      \      });                                                       \
      \    }                                                           \
      \  }                                                             \
      \}"
      :: forall a b. Thunk a -> (a -> Thunk b) -> Thunk b

The type of signature of `bind` is similar to `fmap` in a sense that both take a
thunk and a transformation function as arguments and produce another thunk. The
difference is that the transformation produces a thunk value too.

That effectively means that we can define async computations based on the
results of previous async computations.

Now we finally can write some meaningful code with thunks:

    readWriteFile filenameIn filenameOut =
      let contentThunk = readFile filenameIn in
      bind contentThunk (\contents -> writeFile filenameOut contents)

OK, we can't compile it yet because we don't know what `readFile` and
`writeFile` means but this example illustrates the point of `bind` — we can
execute `writeFile` only after the result of `contentThunk` becomes available.

### Running thunks in parallel

Given that all Node.js I/O is non-blocking we can start execution of two or more
actions in parallel and the collect the result eventually.

We should provide the same feature in PureScript. For that we would need another
FFI primitive:

    foreign import app
      "function app(f) {                                               \
      \  return function(a) {                                          \
      \    return function(cb) {                                       \
      \      var latch = 2;                                            \
      \      var fVal, aVal, val;                                      \
      \                                                                \
      \      f(function(err, f) {                                      \
      \        if (err && latch !== 0) {                               \
      \          latch = 0;                                            \
      \          return cb(err);                                       \
      \        }                                                       \
      \        latch = latch - 1;                                      \
      \        fVal = f;                                               \
      \        if (latch === 0) {                                      \
      \          try {                                                 \
      \            val = fVal(aVal);                                   \
      \          } catch(err) {                                        \
      \            return cb(err);                                     \
      \          }                                                     \
      \          cb(null, val);                                        \
      \        }                                                       \
      \      });                                                       \
      \                                                                \
      \      a(function(err, a) {                                      \
      \        if (err && latch !== 0) {                               \
      \          latch = 0;                                            \
      \          return cb(err);                                       \
      \        }                                                       \
      \        latch = latch - 1;                                      \
      \        aVal = a;                                               \
      \        if (latch === 0) {                                      \
      \          try {                                                 \
      \            val = fVal(aVal);                                   \
      \          } catch(err) {                                        \
      \            return cb(err);                                     \
      \          }                                                     \
      \          cb(null, val);                                        \
      \        }                                                       \
      \      });                                                       \
      \    };                                                          \
      \  };                                                            \
      \}"
      :: forall a b. Thunk (a -> b) -> Thunk a -> Thunk b

Again, the type signature is similar to `fmap` but now the function itself is a
thunk.

How to use `app` to execute thunks in parallel? Let's define a simple combinator
`par` which builds up on `app`:

    par :: forall a b. Thunk a -> Thunk b -> Thunk {a :: a, b :: b}
    par a b =
      app (app (resolve \a -> \b -> {a: a, b: b}) a) b

I think it's useful to think of the first argument of the `app` as a function
which eventually collects the result. If this function returns another function,
we can compose it further via `app`. That's what `par` combinator essentially does.

The `par` combinator can be use now to read two files concurrently:

    readTwoFiles filenameA filenameB =
      par (readFile filenameA) (readFile filenameB)

The result of this computation would be the record with fields `a` and `b` which
hold the contents of `filenameA` and `filenameB` correspondingly.

### Type classes

Now that we have a powerful set of primitive operations on top of thunks we can
use them to compose useful programs.

But the way `bind`, the main combinator for computations, works now doesn't
really much differ from what we have in JavaScript — we are still programming by
passing functions-callbacks around.

To fix this PureScript suggest that we can use *do-notation*, a way to write
sequential computations. The example at the start of the blog post uses `do`
keyword and so it uses do-notation:

    readWriteFile filenameIn filenameOut = do
      contents <- readFile filenameIn
      writeFile contents

But to make this happen we need our `Thunk` data type to be a monad.

If you don't know what monad is, just don't worry. In this context it means that
we need a way to sequentially compose computations on thunks. We already can do
this via `bind` combinator.

If you want a thoughtful introduction into what monads, I suggest reading
[Typeclassopedia][monad].

Anyway, let's proceed and define instances for `Thunk` data type.

    instance thunkFunctor :: Functor Thunk where
      (<$>) = fmap

    instance thunkApply :: Apply Thunk where
      (<*>) = app

    instance thunkApplication :: Applicative Thunk where
      pure = resolve

    instance thunkBind :: Bind Thunk where
      (>>=) = bind

    instance thunkMonad :: Monad Thunk

What we did above is we simply assigned new names to `resolve`, `fmap`, `bind`
and `app` functions and nothing more.

This finally enables do-notation for computations on thunks, so we can write
them with synchronous-looking code:

    download url filename = do
      contents <- getURL url
      writeFile filename contents

Of course the fact that `Thunk` is a monad automatically makes every function
which deals with monads compatible with thunks. The same holds for functors and
applicatives.

Given the new name for `app` we can rewrite our `par` combinator above can be
defined in a more concise way:

    par a b =
      let collect a b = {a: a, b: b} in
      pure collect <*> a <*> b

[monad]: http://www.haskell.org/haskellwiki/Typeclassopedia#Monad

### Epilogue

The library described here is [available on GitHub][thunk].

The point of this blog post is not to convince you that PureScript offers an
exclusive solution to callback hell in Node.js. This is not true.

The next specification of JavaScript, ES6, bring [generators][] into the
language which would allow to write synchronous-looking code for async
computations. ES7, the next iteration is even considering adding
[async/await][async-await] mechanism which targeted specifically to solve the
problem of writing asynchronous code in JavaScript.

Instead, I wanted to highlight that well-designed language such as PureScript,
which provides a set of general orthogonal abstractions, can be used to attack
such non-trivial problems as expressing async computations.

I think, another feature of PureScript I highlighted in this blog post is the
simple and powerful FFI. As you can see PureScript isn't the thing in itself. It
can interface with any JavaScript code and such an interface can be made
idiomatically close to the PureScript without much boilerplate.

Besides that PureScript has other great features. I especially enjoy extensible
records and effect system.

[thunk]: https://github.com/andreypopp/purescript-node-thunk
[async-await]: https://github.com/lukehoban/ecmascript-asyncawait
[generators]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
