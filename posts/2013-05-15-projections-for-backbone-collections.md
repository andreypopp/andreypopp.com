---
title: Projections for Backbone.Collection
created_at: 2013/05/15
kind: article
tags: web, backbone, javascript
---

<script src="/js/projections-for-backbone-collections.js"></script>

Backbone provides an efficient abstraction to manage a collection of objects,
the [Backbone.Collection][] class. It does exactly two things: syncs data with a
server and triggers events on every modification made. The last thing makes it
very useful for constructing UIs which visualize a set of objects which changes
in time, be it a collection of email messages or a list of friends.

When it comes to a real world scenario, those two use cases usually never go
into a single collection — you almost certainly would want to sync one
collection and use another for a UI.

Some use cases are:

  * You use one collection as an extensive cache and sync it to a server but
    want to visualize just a part of it to prevent information overload

  * You want to treat some objects in a collection as "dirty" and do not sync
    them to a server, note that you still want to show them in a UI

  * You want to present additional views which features just "latest" or
    "top-scored" items from a collection

  * You want to present several variants of ordering of objects in a collection

These are just of top of my head, but I'm sure there can be a lot more such use
cases.

Now the interesting part — how to implement such behaviours with
Backbone.Collection? As it is usually done with such a modular and rich
ecosystem like Backbone's one there should be a plugin for that —
[Backbone.Projections][].

Backbone.Projections is a set of composable projections for Backbone.Collection.
What is projection of a collection? It's an another collection which stays in sync with an
underlying collection but do it in its own way, like presenting elements in a
different order or presenting just a subset of elements.

Let's see how Backbone.Projections helps us capture UI patternts we identified
above.

[Backbone.Collection]: http://backbonejs.org/#Collection
[Backbone.Projections]: https://github.com/andreypopp/backbone.projections

## Sorted and reversed projections

The first and the most simplest one of the projections is `Sorted` projection.
It allows to redefine an order of elements in an underlying collection:

    {Collection} = require 'backbone'
    {Sorted} = require 'backbone.projections'

    a = new Model(ord: 2)
    b = new Model(ord: 1)
    c = new Model(ord: 3)

    underlying = new Collection [a, b, c]

    sorted = new Sorted(underlying,
      comparator: (model) -> model.get('ord'))

This way `sorted` contains all the models which `underlying` contains but in an
order defined by `ord` key of a model. But what's more important, `sorted` will
maintain itself in sync with `underlying` collection.

<div class="pane" id="sorted">
  <div class="pane2">
    <div class="left underlying">
      <div class="label">
        <em>underlying</em> collection
      </div>
    </div>
    <div class="right sorted">
      <div class="label">
        <em>sorted</em> projection
      </div>
    </div>
  </div>
</div>

You can experiment with <a class="button sorted-add-at-1">adding an element to
<em>underlying</em> at position 1</a> or <a class="button
sorted-add-at-end">adding to <em>underlying</em> at the end</a>. Both
`underlying` and `sorted` collections will receive new elements but those
elements will be inserted at different positions.

There's also a special case of `Sorted` projection — `Reversed` which maintains
reversed order relative to an underlying collection.

    {Reversed} = require 'backbone.projections'
    underlying = new Collection([a, b, c],
      comparator: (model) -> model.get('ord'))

    reversed = new Reversed(underlying)

A little demo follows

<div class="pane" id="reversed">
  <div class="pane2">
    <div class="left underlying">
      <div class="label">
        <em>underlying</em> collection
      </div>
    </div>
    <div class="right reversed">
      <div class="label">
        <em>reversed</em> projection
      </div>
    </div>
  </div>
</div>

Again, you can experimenting with <a class="button reversed-add-at-end">adding an
element to <em>underlying</em> at the end</a> and see how `reversed` inserts
this element in front.

## Capped projection

There's `Capped` projection which represents a capped (limited by number of
elements) subset of an underlying collection. You will find this useful for
doing pagination or just for presenting "last" or "most liked" items.

Note that `Capped` also accepts a custom `comparator` as an option so you can
maintain a different order inside a projection. By default, order used in
an underlying collection is used.

    {Capped} = require 'backbone.projections'

    underlying = new Collection([a, b, c],
      comparator: (model) -> model.get('ord'))

    capped = new Capped(underlying,
      cap: 2,
      comparator: (model) -> - model.get('ord'))

As you can see we use `capped` collection to represent just 2 elements using a
descending order by an `ord` attribute.

<div class="pane" id="capped">
  <div class="pane2">
    <div class="left underlying">
      <div class="label">
        <em>underlying</em> collection
      </div>
    </div>
    <div class="right capped">
      <div class="label">
        <em>capped</em> projection of size <span class="capped-size">2</span>
      </div>
    </div>
  </div>
</div>

Try <a class="button capped-add-at-end">adding an element to <em>underlying</em>
at the end</a> and see how `capped` maintains its state.

There's also a `.resize(newSize)` method which allows you to specify a new size
for a `Capped` projection: try <a class="button capped-upsize">upsize</a> or <a
class="button capped-downsize">downsize</a> the example above.

## Filtered projection

Sometimes you want to limit a collection by some predicate, for that use case
there's `Filtered` collection.

    {Filtered} = require 'backbone.projections'

    underlying = new Collection([a, b, c],
      comparator: (model) -> model.get('ord'))

    filtered = new Filtered(underlying,
      filter: (model) -> model.get('ord') % 2 == 0)

In this example we constructs a `filtered` projection which only contains
elements from an underlying collection with even `ord` attribute.

<div class="pane" id="filtered">
  <div class="pane2">
    <div class="left underlying">
      <div class="label">
        <em>underlying</em> collection
      </div>
    </div>
    <div class="right filtered">
      <div class="label">
        <em>filtered</em> projection
      </div>
    </div>
  </div>
</div>

Try <a class="button filtered-add">adding an element to <em>underlying</em> at
the end</a> and see how `filtered` collects only models with even numbers.

## Filtered projections with complex predicates

Filtered projection can be a useful building block for very sophisticated
structures — we will try to implement a projection which represents a
*difference* between two given collections.

    class Difference extends Filtered

      constructor: (underlying, subtrahend, options = {}) ->
        options.filter = (model) ->
          not subtrahend.contains(model)
        super(underlying, options)

        this.listenTo subtrahend,
          add: (model) =>
            this.remove(model) if this.contains(model)
          remove: (model) =>
            this.add(model) if this.underlying.contains(model)
          reset: this.update

As you can see there's just 9 lines of code required to do that. Let's see a
demo

    collA = new Collection [a, b, c]
    collB = new Collection [b]
    diff = new Difference(collA, collB)

Now `diff` represents a projection which contains elements from `collA` those
are not contained in `collB`.

<div class="pane" id="diff">
  <div class="pane3">
    <div class="left underlying">
      <div class="label">
        <em>collA</em> collection
      </div>
    </div>
    <div class="middle underlying">
      <div class="label">
        <em>collB</em> collection
      </div>
    </div>
    <div class="right filtered">
      <div class="label">
        <em>diff</em> projection
      </div>
    </div>
  </div>
</div>


Try <a class="button diff-add-collA">adding an element to <em>collA</em></a> or
<a class="button diff-add-collB">adding an element to <em>collB</em></a> and see
how `diff` updates itself according to a formula `elements(collA) -
elements(collB)`.

## Composing projections

But the nicest thing about projections is what they are composable. That means
you can easily compose complex projections from primitives like `Capped` or
`Filtered` as building blocks.

As an example consider a projection which represents "10 most liked today's
posts from Facebook timeline":

    timeline = getFacebookTimeline "andrey.popp"

    todays = new Filtered(timeline,
      filter: (post) -> post.get('date').isToday())

    mostLiked = new Capped(todays,
      comparator: (post) -> - post.get('likes').length)

Now `mostLiked` contains exactly needed subset of elements from `timeline`.

## Getting started with the library

As you can see from the examples the library exposes itself as a CommonJS module
(using `require()` calls to get dependencies). This became possible because of
excellent [Browserify][] library which bundles CommonJS modules into a single
file.

That also means that [Backbone.Projections][] being a CommonJS module is also
installable via [npm][] with a

    % npm install backbone.projections

After that you should be able to use it in a CommonJS environment in Node.js or
in browser (via Browserify) by simply calling `require('backbone.projections')`
as seen in the examples.

Development takes place at the [andreypopp/backbone.projections][] GitHub repo
so you can submit you feedback (bugs or feature proposals) or contributions
there.


[Browserify]: http://browserify.org
[npm]: http://npmjs.org/package/backbone.projections
[andreypopp/backbone.projections]: https://github.com/andreypopp/backbone.projections
