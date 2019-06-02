import {Post} from '../../Post';
export default Post;
export let title = "There is no standard for OAuth"

As an article, ["OAuth - A great way to cripple your API"][1], states:

> Now above, I said OAuth is generally implemented in this fashion. I say
> generally, because unlike standard HTTP authentication schemes (Basic, Digest,
> and others), OAuth is a big grab bag of ideas which can be mixed and matched
> in an infinite amount of ways, and also allows for developers to make their
> own unique tweaks to their personal implementations.

But I don't really see that standartized HTTP auth protocols — Basic and Digest
— allow developers to customize authentication to the needed extent.  Otherwise
we would see its adoption — but I hardly saw a single site or service on the Web
using HTTP Basic or Digest auth schemas.

[1]: http://insanecoding.blogspot.ru/2013/03/oauth-great-way-to-cripple-your-api.html
