import {Post} from '../../Post';
export default Post;
export let title = "Polyplatformic software stacks"

Today I'm up for the next big thing — *polyplatformic software stacks*,
inventing a new word by the way which is fun unless you realize how ugly the
result is. Let me start we a brief definition and a ton of marketing bullshit.

Polyplatformic software stack is a one which have multiple languages, platforms
or frameworks used. This is opposed to software stacks which rely on a single
solution for solving every possible problem.

I believe the thing is useful because:

  * It forces software to be built on top better abstractions which are not
    biased by particular language or platform choosen. They are about to
    describe domain models and not particular language features. They are
    orthogonal, clean and intuitive.

  * It keeps us off using libraries/frameworks which do not compose well — in
    fact it saves our codebases of being "poisoned" by such things.

  * It allows choosing right tool for the job

This feels similar when you start learning new language (natural language —
english, french or russian, you geek!) and then at some point you starting to
realize you could think in that language as well as in your native one. Actually
I think it's much more than that — now your mind operates on abstract concepts
and not some rough and weak constructions you called thoughts before. I'm sure
there are a lot of research about how language influences of how we think and
behave. I'm to lazy to cite such works right now, sorry, but I hope you've
already catched the main point of these.

Ok, now back to a software. There are a lot of benefits follow from these points
above like smaller codebase, easiness of performing changes even at the
architectural level, speed of development, ... and the one I want to emphasize
on — a lack of software frameworks, I mean you wouldn't use one if you are with
polyplatformic state of mind.
