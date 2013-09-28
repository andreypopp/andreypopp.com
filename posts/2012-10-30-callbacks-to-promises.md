---
title: "\"callbacks to promises\" with javascript"
created_at: 2012/10/30
kind: article
tags: js coffeescript programming async callbacks promises
---

I prefer to use promises instead of callbacks for structuring async code in JS.
The main reason is *composability* — callbacks do not compose well but promises
do.

The simple case when you need to synchronize on two or more parallel async
operations becomes a nightmare with callbacks but can be easily done with
promises just with a simple combinator.

Compare callback based-solution

    googleSearched = undefined
    bingSearched = undefined

    search = (engine, q, cb) ->
      $.ajax(url: engine, success: cb)

    search 'bing', 'js', (r) ->
      if googleSearched
        processResults(r, googleSearched)
      else
        bingSearched = r

    search 'google', 'js', (r) ->
      if bingSearched
        processResults(bingSearched, r)
      else
        googleSearched = r

    processResults(bingResults, googleResults) ->
      ...

with one that uses promises

    search = (engine, q, cb) ->
      $.ajax(url: engine)

    $.when(search('bing', 'js'), search('google', 'js')).done (r) ->
      [bingResults, googleResults] = r
      ...

Here I used `$.when(promises)` function from jQuery which returns promise value
which resolves only when every of the passed promises are resolved.

It won't be difficult to think of any other case where transformation of the
code from callback-based "pyramids" to promises' combination would yield a huge
simplifications to code.

But the problem is that a lot of code is already written using callbacks so how
to take the advantage of it and still use clean and simple promises' combinators
like `$.when()`? The solution I use is a simple function

    cont = (func) ->
      ->
        deferred = $.Deferred()
        args = $.makeArray(arguments)
        args.splice 0, 0, (result, error) ->
          if error != undefined
            deferred.reject(error)
          else
            deferred.resolve(result)
        func.apply(this, args)
        deferred

It wraps function `func` into anonymous function which returns promise and adds
additional argument I usually call `next` which aims to resolve or reject
returned promise. I use it like

    $.fn.promiseFadeIn = cont (next, duration) ->
      this.fadeIn(duration, next)

    $.fn.promiseFadeOut = cont (next, duration) ->
      this.fadeOut(duration, next)

Here I extended jQuery with `promiseFadeIn` and `promiseFadeOut` methods which
are similar to original `fadeIn` and `fadeOut` but instead return promises which
will be resolved on completion instead of firing callbacks.

Now you can synchronize on several animations which execute in parallel like
this

    fadeIn = $('.left').promiseFadeIn(500)
    fadeout = $('.right').promiseFadeOut(500)
    $.when(fadeIn, fadeOut).done ->
      # animations are done, do something else

Another interesting example is how to construct a promise which resolves after
some delay, the so-called `setTimeout()` twin

    delay = cont (next, timeout) ->
      setTimeout(next, timeout)

or just simply

    delay = cont setTimeout

The usage is straightforward

    delay(500).done ->
      ...

In this case it differs just a little from raw `setTimeout()` usage but you
really can use it in any existent promises' combinators like `$.when()`.
