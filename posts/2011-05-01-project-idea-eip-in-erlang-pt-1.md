---
title: "Implementation of EIP in Erlang, part 1: Idea"
created_at: 2011/05/01
kind: article
tags: idea, erlang
---

The idea of [EIP][2] (enterprise integration patterns) is pretty simple and
useful — it's just a list of recipes and common behaviours for messaging with a
strong bias towards integration needs.

There're primitive patterns (they act as building blocks), some of them are:

  * *Exchange* — encapsulates a single piece of communication, it can has
  	synchronous or asynchronous semantics.

  * *Message* — a piece of data which represents some event or command.

  * *Channel* — a route for *exchanges*.

  * *Message processor* — its name says all about what it does.

  * *Filter* — filters messages by some predicate.

Some more complex ones are:

  * *Message router* — routes different messages to different channels.

  * *Aggregator* — aggregates a some (defined via predicate) set of messages
  	and processes it as a single message.

  * *Recipient list* — provides multicast mechanism.

If you're interested in full list of patterns, please see EIP [reference][3] or
read the dedicated [book][4] on these.

The one implementation of EIP I was working with is excellent [Apache Camel][1]
Java library. There're many so-called "components" for Apache Camel, which
provides adapters from/to various persistence mechanisms (relational databases,
file systems, ...), messaging solutions (AMQP, beanstalkd, ...), web services
and so on. Using such components you can compose them in different ways with
help of internal fluent DSL. Better visit [examples][5] page for seeing how it
works.

But I think that Erlang/OTP fits much better for this kind of things:

  * Parallel runtime with preemptive lightweight processes with N-M scheduler (N
  	number of processes maps to M number of OS-level threads).

  * Isolated processes helps localize failures of independent exchanges.

  * Process linking allows build sophisticated error handling and recovery
  	strategies.

  * Pattern matching on message structure makes code more clear and concise in
  	comparison to dynamic type casting and nested *if-statements* in Java.

  * OTP framework provides a solid foundation as a set of behaviours --
  	process supervising tree, finite state machine, event listener and etc.

  * Hot code reloading makes updates easy — while in-fly exchanges can use old
  	code for processing, new ones can be processed by updated version of code.

In future posts I'll try to provide implementation sketch and architectural
overview of such a system. Stay tuned.

#### Update

Yes, I'm aware of [Scala DSL][6] for Camel (which seems abandoned for now) and
more strong [scalaz-camel][7] library, moreover I've used Scala with Apache
Camel and I should say — Scala makes my application's code suck much less. But
I'm also expect much more from applicaton written in such expressive and
powerful language as Scala — *(a)* type safe routes, *(b)* redesigned core
based on Scala concurrency primitives (maybe [Akka][8] actors) allowing to get
rid of all this Java boilerplate and garbage.

While I understand I cannot gain *(a)* by designing such a library in Erlang --
dynamically typed language — it makes more sense not to expect statical type
checks in Erlang than to see runtime cast errors in such a language like Java or
Scala beeing statically typed from the ground up.

[1]: http://camel.apache.org/
[2]: http://www.eaipatterns.com/
[3]: http://www.eaipatterns.com/toc.html
[4]: http://www.amazon.com/dp/0321200683
[5]: http://camel.apache.org/examples.html
[6]: http://camel.apache.org/scala-dsl.html
[7]: https://github.com/krasserm/scalaz-camel/wiki
[8]: http://akka.io/
