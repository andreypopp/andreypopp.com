---
title: API for accessing SQL databases
created_at: 2011/02/23
kind: article
tags: database, sql, api
---

In this post I want to discuss database access layers for SQL databases. This is driven by my experience of working with MySQL and PostgreSQL database
engines both for online and offline applications.

## No ORM

I don't need ORM to access SQL databases. At the beginning of my professional
career as a software developer I was very excited about ORM frameworks and what
kind of things I can achieve with its help like managing lazy loading data
from database or some other fancy tricks. Now I'm completely sure — ORM is
just another [leaky abstraction][1] that doesn't work well or scale for
complex applications.

There are many reasons I've said so, some of them are:

  * I don't like my application code intermix with persistence-managing code,
    but this is a kind of things ORM is forcing me to do by providing lazy
    loading relationships mappings or etc.

  * Huge feature disbalance between an ORM and a database engine.

Maybe I am wrong about ORMs or I just shouldn't use its advanced features,
but I feel completely comfortable writing plain SQL and converting results
to stateless domain models by hand.

But what I really need from an API for accessing SQL database is...

## Support for database specific features

This is the most disturbing issue for me. I like to use good-designed API with
support for database specific features per-database engine, not something like
Python DB-API or JDBC or even SQLAlchemy or Hibernate that fits every
relational database engine in the world.

I don't usually develop database agnostic applications in a sense of "swapping
database engine without writing single line of code". I'm sure, a good-designed
and scalable application should benefit from features, that are specific for a
chosen database engine.

The responsibility for all of this should be taken by SQL database vendors in
the manner NoSQL vendors do — for example, MongoDB has a [set of officially
supported][2] database drivers for many programming languages (including even
languages that don't hit mainstream yet, like Scala, Haskell or Erlang),
which are kept in sync with progress made by MongoDB engine itself.

## What would be ideal for me right now

Keeping all these thoughts in mind, I think the best option for me is to:

  1. Use the database connectivity layer of SQLAlchemy, this gives me
     connection pooling and other goodness.

  2. Write plain SQL queries.

  3. Design simple and slick (and of course reusable) mapping layer from
     database objects to domain model objects.

Let's see:

    from imagination.orm import *

    def extract_user(row):
        return User(row["username"], row["password"])

    def extract_profile(row):
        return Profile(row["username"], row["email"])

    users = (connection
      .execute("select username, password, email, data from users")
      .map([extract_user, extract_profile]))

    assert users == [(User(..), Profile(..)), ...]

Oh no, I've just designed yet another poor man's ORM. :-)

[1]: http://en.wikipedia.org/wiki/Leaky_abstraction
[2]: http://www.mongodb.org/display/DOCS/Drivers
