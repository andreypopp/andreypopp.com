import {Post} from '../../Post';
export default Post;
export let title = "Styling Backbone views"

There's a little trick I use to style Backbone views:

    class View extends Backbone.View

      constructor: ->
        super
        this.$el.addClass(this.constructor.name)

    class Header extends View

This way `Header` instance will have class `.Header` attached to its element
automatically. This is DRY.
