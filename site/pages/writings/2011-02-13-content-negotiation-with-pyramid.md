import {Post} from '../../Post';
export default Post;
export let title = "Pyramid: content negotiation"

Хочу рассказать о том, как с помощью [Pyramid][1] организовать приложение,
которое будет возвращать одни и те же данные в различных форматах в зависимости
от некоторых параметров запроса. Я приведу пару примеров, на мой взгляд
наиболее часто встречающихся:

  1. Возвращаем данные в разных формате в зависимостри от суффикса URL --
  	например, при обращении по следующим адресам:

    * ``api/user.json`` -- приложение вернёт нам данные о пользователе в
    	формате JSON.
      	
    *	``api/user`` -- аналогичные данные мы получим в формате HTML, пригодном
    	для просмотра в браузере.

  2. Проделываем аналогичную штуку, но теперь уже определяя в каком формате нам
     нужно возвратить данные по значению HTTP заголовка *Accept*:

    * ``text/html`` -- возвращаем HTML.

    * ``application/json`` -- соответственно JSON.

    
     Таким образом, мы можем использовать один и тот же URL и при этом отдавать
     данные в двух различных форматах.

## Как бы я сделал это раньше

Конечно, мы можем сделать две аналогичные вьюшки и повесить их на два разных
URL-шаблона:

    def api_user_json(request):
        data = {"username": "andreypopp"}
        rendered = json.dumps(data)
        return Response(rendered, content_type="application/json")

    def api_user_html(request):
        data = {"username": "andreypopp"}
        rendered = template.render(data)
        return Response(rendered)

или добавить в код одной вьюшки проверку значения заголовка *Accept*:

    def api_user(request):
        data = {"username": "andreypopp"}
        if request.accept == "application/json":
            rendered = json.dumps(data)
            return Response(rendered)
        else:
            rendered = template.render(data)
            return Response(rendered)
            
но у этих решений есть недостатки:

  * Это просто не красиво и совсем не [DRY][2].

  * Такие вьюшки сложно тестировать -- на выходе мы получаем или отрендеренный
  	шаблон или строчку JSON, что очень неудобно для интроспекции.

Наверное, нам стоит поискать другое решение проблемы.

## Решение в стиле Pyramid

К счастью, вьюшка в Pyramid не должна обязательно возвращать объект типа
``Response`` -- она может возвратить просто словарик с данными, но только при
условии, что она будет использоваться в паре с *рендерером (renderer)*.

[Рендерер][3] -- это компонент, который ответственен за конвертацию результата
выполнения вьюшки -- словарика с данными -- в объект типа ``Response``. В
Pyramid есть встроенный рендерер для конвертации в JSON и, при этом, любой
шаблон нашего приложения может также выступать в роли рендерера (результат
выполнения вьюшки будет использован как контекст для рендеринга шаблона).

Что это даёт нам -- мы можем, определив всего лишь одну вьюшку, которая просто
достаёт данные из БД и возвращает их ввиде словарика:

    def api_user(request):
        data = {"username": "andreypopp"}
        return data

зарегистрировать эту вьюшку с двумя разными URL используя два разных рендерера:

    config = Configurator()
    config.add_route("api_user", "/api/user", api_user,
        renderer="templates/user.jinja2")
    config.add_route("api_user_json", "/api/user.json", api_user,
        renderer="json")

или мы можем проделать тоже самое используя один URL и два разных предиката
*accept*:

    config = Configurator()
    config.add_route("api_user", "/api/user", api_user,
        renderer="templates/user.jinja2")
    config.add_route("api_user", "/api/user", api_user, 
        renderer="json", accept="application/json")

Готово, желаемый результат достигнут. При этом, мы можем с лёгкостью
протестировать нашу вьюшку, потому что в *unit*-тестах она будет возвращать нам
словарик c данными, который подлежит интроспекции в полной мере.

[1]: http://docs.pylonsproject.org/projects/pyramid/1.0/
[2]: http://en.wikipedia.org/wiki/Don't_repeat_yourself
[3]: http://docs.pylonsproject.org/projects/pyramid/1.0/narr/renderers.html
