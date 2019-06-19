import {Post} from '../../Post';
export default Post;
export let title = "PostgreSQL's composite types"

PostgreSQL has quite a decent type system although it isn't as expressive as the type systems modern programming languages (Haskell, Scala, ...) have.

One of its features is *composite types* — it basically allows to group related
columns into a single type declaration like this:

    create type complex as (
      r double,
      i double,
    );

Now you can use type `complex` in functions, column definitions and
anywhere else. But the interesting thing is how composite types relate to table
declarations — the [documentation][1] states — "whenever you create a table, a
composite type is also automatically created, with the same name as the table,
to represent the table's row type". So, you can use table's composite type in
functions too and that's great for encapsulation, whoa!

A small example follows — suppose we're Spotify or rdio and we like PostgreSQL and store music metadata there like this:

    create table album (
      id int,
      title text,
      can_stream bool,
      can_sell bool,
      ...
    );

Now we have a rule "if we can't stream or sell album we shouldn't show it to a
user". We can tediously write `where can_sell or can_stream` all over the code
or just define a function

    create function can_show(album) returns bool
      language sql
      immutable strict
    as $$ select $1.can_stream or $1.can_sell; $$;

Nice, now to select first 10 albums we can show to a user we can write SQL query
like this

    select * from album where can_show(album) limit 10

and if we will want to change our rule of "when to show album to a user" — we
just need to change `can_show` function definition.

Naturally, there are downsides. For one, suppose we also have musical tracks' metadata stored in PostgreSQL in the similar fashion

    create table track (
      id int,
      album_id int,
      can_stream bool,
      can_sell bool,
      ...
    );

and have exactly the same rule "if we can't stream or sell track we shouldn't show
it to a user". The problem is we can't use the same function `can_show` because it
only operates on arguments which have `album` type. We can only copy-and-paste
function declaration and change its argument type from `album` to `track`. it
isn't a clean solution, it is?

    create function can_show(track) returns bool
      language sql
      immutable strict
    as $$ select $1.can_stream or $1.can_sell; $$;

Of course it isn't a problem if we have different rules for albums and tracks
but what if we don't?

One solution I see is to add [structural types][2] to PostgreSQL's type system,
so you can declare `can_show` function in the following manner

    create function can_show(row(can_sell bool, can_stream bool, ...))
      returns bool
      language sql
      immutable strict
    as $$ select $1.can_stream or $1.can_sell; $$;

You see, there's fancy type declaration `row(can_sell bool, can_stream bool,
...)` which means *any row which has can_sell and can_stream columns*.

[1]: http://www.postgresql.org/docs/9.1/static/rowtypes.html
[2]: http://en.wikipedia.org/wiki/Structural_type_system
