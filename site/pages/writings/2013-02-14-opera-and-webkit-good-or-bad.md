import {Post} from '../../Post';
export default Post;
export let title = "Opera + WebKit: good or bad?"

Opera [plans][operapress] to abandon development of their own HTML rendering
engine and JavaScript virtual machine and switch to Chromium which effectively
means WebKit for HTML rendering and V8 for JavaScript execution.

Good or bad? It depends, I think.

Given all the standartization efforts put in Web technologies it would be
natural to expect some kind of baseline reference implementation to emerge,
WebKit isn't a bad choice for that.

To rephrase that — I don't think that implementation of Web standards is the
only field for browser vendors to compete in — so sharing common codebase for
HTML rendering is a good idea.

Some people think that browser monopoly can hurt the Web ecosystem and provide
"IE6 domination" case as an example. But... there is no browser monopoly on a
horizon — that's only about browser engines — and, as I've said already, browsers
should not compete in a "best Web standards implementation" but rather in
providing best user experience.

Luckily for browser vendors — there's still a huge gap between Web and so-called
"native" applications (and vice-versa of course) — so there's a lot of work to
be done on that side.

[operapress]: http://my.opera.com/ODIN/blog/300-million-users-and-move-to-webkit
