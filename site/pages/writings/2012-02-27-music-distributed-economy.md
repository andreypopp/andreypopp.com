import {Post} from '../../Post';
export default Post;
export let title = "Music, The distributed economy"

I am an [Rdio][] premium subscriber (recently switched from [Spotify][]), I also
use [SoundCloud][] a lot and... I still have to buy music from iTunes. It's not
that I like to own stuff but just sometimes it's the only way to listen to what
I want, like the recent release of [Ludovico Einaudi][], ["In a Time Lapse"][]
(which I highly recommend by the way).

Yes, "In a Time Lapse" is available on Spotify, still there are a lot of stuff
which is not on Spotify but, for example, on SoundCloud. But that makes me think
that there is some cool music which doesn't hit SoundCloud and so on...

I think we all have to agree that music streaming services like Spotify,
[Deezer][], [MOG][] or Rdio can't solve the problem of music availability. Even
more — it's just plain impossible for them to do that.

Actually, the problem is even worse — if one uses Spotify and their friend is
hooked up on Rdio then there's no sane way for them to share music between each
other. It's a vendor lock-in!

Let's imagine a world where we have no such problems at all — let's call it
*"distributed music"*.

[SoundCloud]: http://en.wikipedia.org/wiki/SoundCloud
[Rdio]: http://en.wikipedia.org/wiki/Rdio
[Spotify]: http://en.wikipedia.org/wiki/Spotify
[Ludovico Einaudi]: http://en.wikipedia.org/wiki/Ludovico_Einaudi
["In a Time Lapse"]: http://en.wikipedia.org/wiki/In_a_Time_Lapse
[MOG]: http://en.wikipedia.org/wiki/MOG_(online_music)
[Deezer]: http://en.wikipedia.org/wiki/Deezer

## Music distribution protocol

Centralized systems are always inefficient, rephrasing that, I think, there will
be no single music streaming service capable of providing users with sufficient
amount of music. Ever. Period.

For "distributed music" to happen we need to have a distributed system instead. Let
all interested parties stream music and use for that some kind of a standardized
protocol — let's call it *music distribution protocol* for now. Yes,
artists and labels should stream music to you directly not through Spotify or
Rdio or... you name it.

Of course it's not like every artist or label would want to have all the
infrastructure to distribute music streams to their fans, for some it's simply
not possible. I think, that's exactly the niche for current streaming services
to move on — be service providers for artists and labels, *music-delivery
networks* if you will.

## Who controls the experience?

But why artists and labels would want to do that after all?

Simply because it allows them to control music experience, how their fans
experience music they produce. Actually I think, that's important aspect which
is completely overlooked by the current model of music distribution over the Web
— Spotify and friends completely lock music experience in on themselves thus now
we feel music through the prism of "Excel-like" spreadsheets and "iTunes-like"
grids.

But it's not just about user interfaces. Having artists and labels control the
music experience also makes the experience itself more immersive and interesting
— from artist's sharing demo recordings (like they do now on SoundCloud but not
on Spotify) to label's providing proper discount for tickets for gigs or
merchandise (for long-term subscribers for example). Maybe there are also some
other interesting forms of interaction between artists and their fans which
currently are not possible, not effective or simply not invented yet.

So we decided that people transact directly with artists and labels, not through
aggregators like Spotify. Doesn't it become a lot more difficult for someone to
listen to a particular song? Yes, but only if music as audio streams is behind
the pay-wall and I don't think it is the way to go — music as audio should be
globally and freely accessible.

A song as a file isn't a valuable product, the so-called "piracy" thing already
proved that and not in way that files are easy to copy but in a way that files
are not sufficient to experience music as art.  That's why most of so-called
"pirates" [spend a lot of money on music][] and I think even more spent by them
on merchandise, concert tickets and donations towards artists.

Again, having the ecosystem where artists have transactions directly with their
fans can do much more than selling files and delivering audio streams to people.
That way there's no reason to keep audio behind the pay-wall.

[spend a lot of money on music]: http://piracy.americanassembly.org/where-do-music-collections-come-from/

## Music players

Let's pretend our so much desired "distributed music" model finally happened.
Spotify and Rdio turned out to be music-delivery networks and there's no reason
for them to have such amazing desktop, web or mobile apps like they do now.

Someone have to build music players and the fact that we have a standardized
"music distribution protocol" helps a lot there because such music players can
stream music from anywhere supporting this protocol.

Actually I expect that there will be an *entire market of such music players*
which is focused on music experience and not on music content itself. Remember
those shiny times when everyone was able to create a Twitter client? I think
that's possible to do on a much larger scale with music.

## Music discovery

There's another interesting question — how to find music if it comes from
different sources which are dynamic and decentralized?

First, music metadata should be available to everyone. Initiatives such as
[MusicBrainz][] or [Discogs][] already do a great deal of work in that
direction, but labels and artists should collaborate with them.

In that place I imagine a BitTorrent-like technology for distributing metadata
in some standardized format which allows further resolution of metadata into
audio streams or some other experiences respecting all the transactions between
an artist and a consumer.

Second, we need music discovery engines which can work with that "globally
accessible metadata" and produce some guides for users through the music world.

There's already a market of music discovery engines but now they either are
locked-in to use with some music streaming service or simply work in B2B area
and power recommendation systems for Spotify or Rdio (think [The Echonest][]).

It would be natural for them to switch to consumer-facing business models and
develop plug-ins for "new music players" which work with "music distribution
protocol" and use "globally accessible metadata".

## Conclusion

I believe that the future of music is in the "distributed music" model.

Shift from big and sluggish monopolies to small and responsive parties could
only be a good thing, especially given the life we have now with the
"web-everywhere" paradigm.

That way we can have entirely new markets spawned — like for music UIs or modern
and efficient discovery engines which can actually work with the global massive
of music in the world.

Music as audio should be freely and globally accessible. Additional music
experiences which are not dictated by commercial based opinions (think big
labels and intermediaries like Spotify or YouTube) could be provided by artists
and small labels on artistic and high quality basis.

[MusicBrainz]: http://en.wikipedia.org/wiki/Musicbrainz
[Discogs]: http://en.wikipedia.org/wiki/Discogs
[The Echonest]: http://echonest.com
