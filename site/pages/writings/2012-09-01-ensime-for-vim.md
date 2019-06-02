import {Post} from '../../Post';
export default Post;
export let title = "Ensime for Vim"

Just a small note on a project I'm working on in my spare time (unfortunately
that means only 2-3 hours per week) — Ensime integration for Vim, see my GitHub
[fork][1] of Ensime.

Installation is as easy as:

    git clone https://github.com/andreypopp/ensime.git
    cd ensime
    sbt stage
    ln -s dist_SCALAVERSION dist

After that you will be able to start Ensime with `:Ensime` Vim command and use
omnicompletion functionality as well as `:EnsimeTypecheckFile` command for
type checking current file (integrated with Vim's quickfix). Besides these I
haven't yet implemented other features of Ensime — the first ones on my todo
list is *type at point*, *call arguments completion*, *rename refactoring*.

[1]: https://github.com/andreypopp/ensime
