import {Post} from '../../Post';
export default Post;
export let title = "Emerging Languages: Bandicoot, Roy and Elm"

This year I've been attending [Stangeloop][1] conference along with Emerging
Languages Camp which was collocated to it. [Emerging languages camp][2] is "an
annual gathering of programming language innovators" and this is not about some
experimental academic things — all of the talks were about languages you can
already use to solve real-world problems.

## Bandicoot

One of the most interesting things there was [Bandicoot][3], a set-based
programming language. The idea is to provide a language plus a runtime with a
persistence mechanism which can facilitate managing and processing relational
data. Given that the obvious leader in this domain is SQL which was designed in
late 80s, I think there are a lot of possible areas of improvement.

SQL isn't composable and so doesn't provide means to build reusable abstractions
while it's quite good for writing ad-hoc queries — Bandicoot tries to improve
the situation by providing composable and consistent abstractions from the
ground up so you don't have to recourse to string concatenation then you want
just to parametrize some query over relations you want to use in.

In some sense Bandicoot can be seen as a more low-level language than SQL because
there's no query planner which builds execution plan for you and you have to do
it by yourself using language constructs. This is more important for building
reusable software because you can use provided runtime more efficiently though
for ad-hoc queries SQL's approach is still better, I think.

Another interesting aspect is that Bandicoot uses HTTP protocol as an interface
— `GET` requests for querying relations and `POST` requests to mutating them.

Language feels pretty interesting but I'd rather like it to be implemented on
top of PostgreSQL which is now becomes a really huge ecosystem for data-driven
applications.

## Elm and Roy

Both languages are functional, statically typed (with type inference) and both
are... using JavaScript as their platform. For those tired of *undefined is not
a function* these languages can provide an escape path towards better and
statically typed future.

Judging from the talk [Elm][4] looks totally like Haskell dialect and it seems
it targeted directly for writing apps with huge need for interactive graphics —
games for example.

[Roy][5] seems closer to development of traditional apps. Though it's also
functional so there's paradigm gap for those started with
JavaScript/CoffeeScript but I don't think that's a problem now when almost any
new language have some "functional" taste and almost any new library aims to
bring "functional" features to a language.

Type inference surely helps to avoid boilerplate by not writing type annotations
to every declaration but what really helps is that Roy have [*structural
typing*][6] for objects — that's the way to tell the compiler to infer not just
type declarations for given objects but also objects' types themselves based on
how you use objects in your functions.

For example consider a basic function to sum complex numbers which are
represented as objects

    let sumComplex a b = {x: a.x + b.x, y: a.y + b.y}

In this case structural typing helps identify types of `a` and `b` not as just
arbitrary objects but as *objects which have `x` and `y` properties which are
numbers* by the way (because of `+` operator).

I'd love to play with Roy some more in the future.

[1]: http://thestrangeloop.com
[2]: http://emerginglangs.com
[3]: http://bandilab.org
[4]: http://elm-lang.org
[5]: http://roy.brianmckenna.org
[6]: http://en.wikipedia.org/wiki/Structural_type_system
