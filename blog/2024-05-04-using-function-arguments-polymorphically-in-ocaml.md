---
published: true
---

# Using function arguments polymorphically in OCaml

There's a rarely used feature in OCaml called polymorphic record fields. Let's
see when and why one might want to use it.

Suppose you have a type of values which can carry a differently typed payload,
surfacing the type of the payload as a type parameter (in other terms, a GADT):
```ocaml
type 'a t =
  | I : int -> int t
  | S : string -> string t
```

Now let's say we have some such values constructed and we want to process these
value by applying a function passed as an argument:
```ocaml
let process : ('a -> unit) -> unit = fun f ->
  let i = I 42 in
  let s = S "hello" in
  f i;
  f s
    ^
This expression has type string t but an expression was expected of type int t
Type string is not compatible with type int
```

Note how `f` was specialized to to be `int -> unit` after the first application
so the second application fails with a type error.

This is because only the `let` bindings are polymorphic in OCaml, the
arguments passed to functions are not.

This is where the polymorphic record fields are useful. We can define a record
type like this:
```ocaml
type f = { f : 'a. 'a t -> unit }
```

Then we can make an argument not a function but of the record type:
```ocaml
let process { f } =
  let i = I 42 in
  let s = S "hello" in
  f i;
  f s
```

This typechecks nicely and works as expected. The downside is that on the
application side it's a bit more verbose:
```ocaml
let () = 
  let f _ = print_endline "hello" in
  process { f }
```

Note OCaml's manual has [another example][1] of using polymorphic record
fields.

[1]: https://ocaml.org/manual/5.1/polymorphism.html#s%3Ahigher-rank-poly
