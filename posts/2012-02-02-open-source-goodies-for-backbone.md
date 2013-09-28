---
title: Open source goodies for Backbone
created_at: 2013/02/02
kind: article
tags: open source, backbone, javascript, coffeescript, mvc, software
---

Recently I've released a few small modules for [Backbone][]. Basically these are
patterns I found I use often while developing JavaScript applications.

## Backbone.Module

[Backbone.Module][] is a rip off from [Spine.Module][Spine]. It exports a single
base class `Module` with `@extend` and `@include` constructor methods which
provide a way to mixin some object properties into constructor and prototype
correspondingly.

    {Module} = require 'backbone.module'

    class MyClass extends Module
      @extend ConstructorMethods
      @include Methods

It also automatically mixins `Module` methods into `Backbone.View`,
`Backbone.Router`, `Backbone.Model` and `Backbone.Collection` constructors so
you can use `@extend` and `@include` with those classes' subclasses as well.

I found this pattern useful cause it allows to define a class as a set of
different and orthogonal tiny behaviours.

## Backbone.Record

[Backbone.Record] provides a single class `Backbone.Record` which is a little
subclass of `Backbone.Model` with a constructor method `@define` for specifiying
field names a model can store.

    Record = require 'backbone.record'

    class User extends Record
      @define 'username', 'email', 'birthday'

That way class `User` will have properties `username`, `email` and `birthday`
generated automatically which allows to use standard syntax for getting and
setting data with model instances instead of using cubersome `.get()` and
`.set()` methods.

    user = new User()

    # fires 'change:username' as if
    # I used user.set('username', 'andreypopp')
    user.username = 'andreypopp'

    console.log(user.usernmae) # prints 'andreypopp' to console

Note that you can only assign those fields to model which were defined via
`@define` call, otherwise an `Error` would be trhown.

Under the hood `@define` calls `Object.defineProperty` on a model class so this
works only with modern browsers (means doesn't work in IE < 9).

## Backbone.ViewEvents

The last one in today's open source batch is [Backbone.ViewEvents][], an alternative
events implementation for `Backbone.View` which allows events to bubble up
through a view hierarchy.

The basic example is

    {View} = require 'backbone.viewevents'

    parent = new View().render()
    child = new View().render()

    parent.$el.append(child.$el)

    # register listener on parent
    parent.on 'someevent', (msg) ->
      console.log('caught!', msg)

    # trigger event on child
    child.trigger('someevent', 'hello')

As you see there is no need to manually maintain view hierarchy. It is inferred
from views' position in the DOM — that way `child` automatically becomes a child
of `parent` because it is attached down the DOM tree of `parent`'s element.

This is implemented through the usage of custom DOM events, so `.trigger()` and
`.on()` methods actually use view's `el` DOM element to trigger and listen for
events. This allows to effectively re-use DOM events implementation for bubbling
events up through the DOM tree reaching parent views.

Views bubbling events is a very useful feature for me — it allows to write views
which don't hold references to its parents and still able to notify them. That
way entire view hierarchy can be seen (of course to some extent) as a Shadow DOM
which composed of high-level view objects instead of low-level presentation
details.

## Try it

All modules are installable via [Bower][] client-side package manager:

    bower install backbone.module backbone.record backbone.viewevents

You can use them with a CommonJS (think [Browserify][]) or an AMD loader (like
[RequireJS][]). They also export objects to browser globals (under the
`Backbone` namespace, see each module for details).

[Backbone]: http://backbonejs.org
[Spine]: http://spinejs.com
[Bower]: http://twitter.github.com/bower/
[Browserify]: http://browserify.org
[RequireJS]: http://requirejs.org

[Backbone.Module]: https://github.com/andreypopp/backbone.module
[Backbone.Record]: https://github.com/andreypopp/backbone.record
[Backbone.ViewEvents]: https://github.com/andreypopp/backbone.viewevents
