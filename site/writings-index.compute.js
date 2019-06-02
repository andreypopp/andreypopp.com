let ctx = require.context('./pages/writings', false);
let ids = ctx.keys().sort().reverse();

module.exports = ids.map(id => {
  let slug = id.substr(2).replace(/\.md$/, '');
  let m = ctx(id);
  return {
    title: m.title,
    href: `/writings/${slug}`,
  };
})
