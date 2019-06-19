import {Post} from '../../Post';
export default Post;
export let title = "Learning Python"

Python is actually a pretty good, simple and useful programming language. It has
a fairly gently learning curve, thanks to excellent documentation.

For the novice wishing to adopt Python in a least possible time and quickly
become productive I would recommend the following steps:

Tutorial
--------

[Tutorial][0] given in Python docs is very good, you should just give a brief
look at it if not reading it completely — it has many practical examples, which
help a lot to make a sense what the beast Python is.

Language reference
------------------

Sections 1 - 4 from [The Python Language Reference][1]. Section 3. [Data
Model][2] is the most important one here. It gives a broad overview of how
Python data types interact with each other. Other sections can be read as
needed — Python syntactical constructs usually make sense from their analogues
in other languages. [Yield][3] and [with][4] are the exceptions.

Standard library documentation
------------------------------

Python stdlib is the cause this language is so productive and popular. Read
sections 1-5 from [The Python Standard Library][5] docs and keep an eye on
a list of stdlib's modules.

Common tips
-----------

A list of common tips at last:

  * Use Python 2.x (where x is 2.6 or 2.7) — it's still deployed much widely
  	than Python 3.x.

  * Follow [PEP-8][8] styleguide, never step away from it!

  * Defining class always subclass from ``object`` (assuming you're using Python
  	2.x).

  * Never write ``from somemodule import *``.

  * Always use [virtualenv][7] for Python development. It's a tool for
  	creating isolated Python environments.

  * [PyPi][6], The Python Package Index helps you to find any Python library you
    wish. Just use ``easy_install`` or ``pip`` command to install from there.

The end.

[0]: http://docs.python.org/tutorial/index.html
[1]: http://docs.python.org/reference/index.html
[2]: http://docs.python.org/reference/datamodel.html
[3]: http://docs.python.org/reference/simple_stmts.html#the-yield-statement
[4]: http://docs.python.org/reference/compound_stmts.html#the-with-statement
[5]: http://docs.python.org/library/index.html
[6]: http://pypi.python.org/pypi
[7]: http://pypi.python.org/pypi/virtualenv
[8]: http://www.python.org/dev/peps/pep-0008/
