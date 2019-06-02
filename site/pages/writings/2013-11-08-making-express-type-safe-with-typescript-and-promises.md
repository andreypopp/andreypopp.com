import {Post} from '../../Post';
export default Post;
export let title = "Making express type safe with TypeScript and promises"

Recently I've tried to evaluate TypeScript for use in a project which is
a simple REST API I was going to implement with Node.js and Express.

In this blog post I want to share my observations regarding TypeScript and how
it can (or cannot) help you develop applications targeting JavaScript runtimes.

## Shortly on what TypeScript is about

TypeScript is a language from Microsoft which compiles to JavaScript. That means
you can write code in TypeScript which then can be executed in a browser or in
Node.js or any other JavaScript runtime.

While there are other languages which target JavaScript, TypeScript is
interesting because it is optionally statically typed, its type system supports
structural typing and its compiler can infer types in a number of common cases.

All these properties promise very little or no boilerplate when compared to such
mainstream statically typed languages like Java, C++ and the likes.

In addition to that, TypeScript syntax is a superset of JavaScript syntax with
addition of type annotations and a couple of other ES6 (the next standard for
JavaScript) features which in the near future will hit mainstream browsers. We
can say that TypeScript and JavaScript syntaxes converge to each other for the
exception of type annotations which will never be the part of JavaScript.

The basic example of TypeScript code looks like that:

    var a: Number = 1;

    var showNumber = function(num: Number): String {
      return 'Number is: ' + num.toString();
    }

    var b: String = showNumber(a);

I think, it looks friendly to anyone who has experience with JavaScript.

Note the type annotations, while they are absolutely optional in this case (as I
said TypeScript compiler can infer them for you) they show precisely what types
variables and a function have.

I advice to describe types for top level functions and variable. Even if this is
unnecessary it helps a lot for other people to reason about what program is
doing.

Think of it as of writing jsdoc comments which are less verbose and checked by
the compiler so they can't be wrong or outdated.

## How types can improve my Express app

So we are going to use TypeScript to write an Express application.

As you know an Express app consist of a number of middlewares configured to work
together. Some of them can depend on others being present up in a stack.

I think it would be useful to have type system validate our middleware and
handler stacks configurations.

For example, a handler for POST method probably would require JSON body to be
parsed by some middleware like `express.json()`. If the latter isn't present in
the right place in the stack — handler will fail at runtime.

It turns out we can express dependencies between middlewares in Express
application in type system and with the help of TypeScript compiler prove
configuration to be correct before even running an application.

## Designing type-friendly APIs

There a little care needed to design APIs which are friendly to type systems.
Fortunately this also means those APIs will be much more intuitive and easy to
reason about.

This is the case even without any type system.  But if you're lucky and have a
proper type system in place then it can help you catch mistakes and even say
what's wrong with you code.

So what's this all about, type friendly APIs?

There are two obvious things you should remember when you are working with
types:

  1. Types are attached to values
  2. You cannot change the type of a value but only apply a function to the
     value and get another value of another type

The first thing is super obvious — can you imagine type without a value? How
useful is that?

The second point is just as obvious — if you have a value of type `A` and a
function with an argument of type `A` and a returned value of type `B` then you can
apply this function to a value you will get another value of type `B`

That second point makes express handlers/middlewares are not best suited for our
purposes — they mutate a request but don't return it.

    function middleware(req, res, next) {
      db.connect(function(err, conn) {
        if (err)
          return next(err);
        req.conn = conn;
        next()
      });
    }

This is an example of middleware which connects to a database and calls the next
middleware in chain. Unfortunately type system can't know if this function
transforms request or not and so can't provide us with statically verifiable
guarantees.

To workaround the limitation we are going to define a new API for express which
is based on promises.

## Typing promises

For promises I'm going to use [kew][] library.

It's written in JavaScript and so we should provide TypeScript compiler with
description of types of the library. This should be done once for any JavaScript
library you are going to use in the project. Fortunately there's DefinitelyTyped
project which provides type definitions for most of the popular JavaScript
libraries.

Promises are containers for values so we are going to describe it as a generic
type, e.g. a type which can be parametrized by other type.

This is the contents of file `kew.d.ts`:

    declate module "kew" {
      export function defer<A>(): Promise<A>;
      export function resolve<A>(value: A): Promise<A>;
      export function reject<A>(err: Error): Promise<A>;
      export interface Promise;
    }

    interface Promise<A> {
      then<B>(
          onResult: (value: A) => Promise<B>,
          onFailure?: (err: Error) => any): Promise<B>
      then<B>(
          onResult: (value: A) => B,
          onFailure?: (err: Error) => any): Promise<B>
      resolve(value: A): void
      reject(err: Error): void
    }

So the following code would compile and run:

    kew.resolve(1).then(function(x) { return x + 1; });

but this won't even compile:

    kew.resolve(1).then(function(x) { return x.substring(1); });

because the function passed to `then` expects an argument of type `Number`.

## Type friendly express API
