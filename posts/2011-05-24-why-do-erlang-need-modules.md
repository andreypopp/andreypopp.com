---
title: Why do Erlang need modules
created_at: 2011/05/24
kind: article
tags: erlang
---

Interesting [discussion][1] popped up on *erlang-questions* mail list — *"Why
do we need modules at all?"*. There's also [comments][2] on hacker news.

The points are:

  * Why do we have to use module structure that reflects filesystem layout?

  * Let's better have database with plain functions and query it by some
  	associated metadata fields.

This leads me think about [Smalltalk][3] programming language and how it manages
source code — runtime image is really a database with classes and associated
methods.

[1]: http://erlang.org/pipermail/erlang-questions/2011-May/058769.html
[2]: http://news.ycombinator.com/item?id=2580383
[3]: http://en.wikipedia.org/wiki/Smalltalk
