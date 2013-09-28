---
title: "nginx as a development tool: not here yet"
created_at: 2013/05/23
draft: true
tags: tool, nginx, development, web
---

Nginx is an incredible piece of software.

use it for:

  * serving static files
  * proxying APIs to be CORS and turn JSON into JSONP for old browsers
  * caching API responses
  * composing several web apps into one
  * https, mangle headers
  * it still extremely fast after all

<blockquote class="twitter-tweet"><p>@<a href="https://twitter.com/andreypopp">andreypopp</a> can get it to log requests to error.log with debug level set on Mac OS X</p>&mdash; Sevan Janiyan (@sevanjaniyan) <a href="https://twitter.com/sevanjaniyan/status/337290880849440768">May 22, 2013</a></blockquote>

things I wish it has:

  * auto reload on config changes
  * logging to stdout/stderr when in no daemon mode
  * simple upstream process management module (not required)
