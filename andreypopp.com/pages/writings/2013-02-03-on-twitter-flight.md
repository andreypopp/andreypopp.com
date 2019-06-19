import {Post} from '../../Post';
export default Post;
export let title = "On Twitter Flight"

Twitter relecently released a new piece of open source software — [Twitter
Flight][], "a lightweight, component-based JavaScript framework" as it's stated on
its page.

The framework aims to organize the part of an application code which maps
behaviour to DOM, so it loosely corresponds to what Backbone.View does. Flight
components are plain objects which wraps DOM nodes and provide some logic to
them.

Now the interesting part — Flight doesn't allow components to hold references to
each other and thus the only way to communicate between them is by using events.
The intent behind this design decision is to force developers to create highly
reusable components.

While the idea of building loosely coupled UI components feels right, I don't
think that pushing it to that maxima is a good thing.

First, it is hard debug such systems — if there are events instead of method
calls then there will be no proper stacktraces in case of errors. Even if events are
synchronous you will get stacktraces which interweave Flight's code with you own
application's code so it is much harder to deal with.

Second, evented code is hard to read and follow — instead of method calls you
see events being triggered into nowhere.

The right balance I think would be to have separate communication methods for
"parent-child" and "child-parent" component relationships.

Parent components should communicate with its children via direct methods calls.
It does make sense to me because parent components already know about their
children — they created them during instantiation phase of got them through the
constructor arguments. So it doesn't harm "loosly-coupled" architecture at all.

Children shouldn't be aware of its parents so "child-parent" communication
strategy is the point where using events is acceptable and useful for
components' reusability. That means you shouldn't hold references to a parent
component and only trigger events so other components up through a component
hierarchy could react on them.

Speaking of Backbone, I recently released [Backbone.ViewEvents][] module which
helps building up "child-parent" evented communication without maintaining view
hierarchy manually and setting up event propagation between views. This is done
through the swapping of Backbone.Events to a schema where events are DOM events
and are triggered on a view's element. That way we get event bubbling for free
and a view hierarchy inferred from views' positions in the DOM tree.

[Twitter Flight]: http://twitter.github.com/flight/
[Backbone.ViewEvents]: https://github.com/andreypopp/backbone.viewevents
