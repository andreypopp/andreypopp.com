import {Post} from '../../Post';
export default Post;
export let title = "Мультидиспетчеризация с generic"

Сегодня выпустил версию 0.1 библиотеки для обобщённого программирования
(generic programming) на языке Python с оригинальным названием *generic*.

Одно из возможных применений этой библиотеки -- создание
[мультиметодов][multimethods_wikipedia].

Мультиметод -- это такая функция, которая меняет своё поведение в зависимости
от типов переданных ей аргументов, то есть, действует примерно следующим
образом:

    def show(arg):
        if isinstance(arg, str):
            return show_str(arg)
        elif isinstance(arg, int):
            return show_int(arg)

    def show_str(arg):
        return "str: %s" % arg

    def show_int(arg):
        return "int: %d" % arg

С использование generic это делается так:

    from generic.multidispatch import multifunction

    @multifunction(str)
    def show(arg):
        return "str: %s" % arg

    @show.when(int)
    def show(arg):
        return "int: %d" % arg

    show(1)     # returns 'int: 1'
    show("s")   # returns 'str: s'
    show([])    # raises TypeError

На мой взгляд, получается более элегантно. К тому же, мы всегда можем расширить
наш мультиметод другими реализациями для других типов аргумента, чего не
сделаешь с функцией из первого примера.

Также можно определять мультиметоды с диспетчеризацией по нескольким аргументам:

    @multifunction(int, int)
    def add(x, y):
        return x + y

    @add.when(str, str)
    def add(x, y):
        return add(int(x), int(y))

К сожалению, пока библиотека может создавать мультиметоды только из обычных
функций (не методов), такие вот получаются "мультифункции". В дальнейшем эту
ситуацию планируется исправить.

Установить generic можно с помощью ``easy_install`` обычным образом:

    easy_install generic

Репозиторий с исходным кодом и багтрекер находится на [github][generic_github].
Пока там около 200 строк кода вместе с докстрингами и примерно такое же
количество тестов.

[multimethods_wikipedia]: http://en.wikipedia.org/wiki/Multiple_dispatch
[generic_github]: http://github.com/andreypopp/generic
