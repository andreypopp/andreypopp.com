---
title: Development environments with pip
created_at: 2012/11/04
kind: article
tags: python, software development, dependencies
---

There's a way to get development environments for Python projects up and running
very quickly — just include this piece of code into your project's `Makefile`:

    SDIST_CACHE=lib

    requirements.txt: requirements.src.txt
      pip install \
        --no-install \
        --download-dir $(SDIST_CACHE) \
        -r $<
      find $(SDIST_CACHE) -type file > $@

    requirements: requirements.txt
      pip install \
        --no-index \
        --no-deps \
        --find-links $(SDIST_CACHE) \
        -r $<

and then use `requirements.src.txt` to specify dependencies for your project.
After changing it you should run `make requirements.txt` to download all source
tarballs into `lib` directory and regenerate `requirements.txt` to list all
tarballs inside `lib`.

You would want to commit `lib` directory into your VCS repo — that way you guard
yourself and other developers against unavailable package indexes and/or
download locations and also provide more faster bootstrapping process.

Basically, running `make requirements` would install all packages inside `lib`
without touching network.

P.S. This still requires from us to build dependencies from sources (when
needed), the other way is to cache binary packages, but pip currently lacks that
feature — I hope [wheel][wheel] would help us regarding this in the future.

P.P.S. Know any other way to do this more effectively? Please share in comments!

[pip]: http://www.pip-installer.org/en/latest/
[wheel]: http://pypi.python.org/pypi/wheel
