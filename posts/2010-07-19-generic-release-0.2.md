---
title: Generic 0.2
created_at: 2010/07/19
tags: python, generic
kind: article
---

Выпустил версию [0.2][generic_0.2] библиотеки [generic][generic_github].

Во-первых, написал хоть какую-то [документацию][generic_docs] по библиотеке.

Во-вторых, теперь появилась возможность создавать методы с
мультидиспетчеризацией. Об этом чуточку подробнее.

Методы с мультидиспетчеризацией мало отличаются от функций с оной, о которых я
уже рассказывал в предыдущем [посте][prev_post]. Самое главное и единственное
различие между ними -- неявная диспетчеризация последних по типу (классу)
метода.

Продемонстрирую это на следующем примере:

    from generic.multidispatch import multimethod
    from generic.multidispatch import has_multimethods

    @has_multimethods
    class A(object):
        
        @multimethod(int)
        def foo(self, x):
            return x + 1

    @has_multimethods
    class B(A):
    
        @A.foo.when(str)
        def foo(self, x):
            return x + "1"

    A().foo(1)      # 2
    A().foo("str")  # raises TypeError
    B().foo(1)      # 2
    B().foo("str")  # "str1"

Что из этого следует:

- При наследовании, реализации мультиметодов также наследуются от базовых
  классов -- ``B().foo(1)`` работает и возвращает ``2``.

- Наследники базового класса могут расширять определения мультиметодов новыми
  реализациями -- ``B().foo("str")``. При этом, эти реализации не будут
  доступны в базовом классе -- вызывается ``TypeError``.

Последние утверждение и означает диспетчеризацию по классу метода. Кстати,
именно поэтому необходим декоратор для класса ``has_multimethods`` -- во время
декларации метода сам класс ещё не сконструирован и нам нечего использовать для
определения мультиметода.


[generic_github]: http://github.com/andreypopp/generic
[generic_0.2]: http://pypi.python.org/pypi/generic/0.2
[generic_docs]: http://packages.python.org/generic
[prev_post]: http://braintrace.ru/posts/2010-07-16-generic-multidispatching.html
