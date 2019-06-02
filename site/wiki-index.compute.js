let ctx = require.context('./pages/wiki', false);
let ids = ctx.keys().sort();

module.exports = ids.map(id => {
  let name = id.substr(2).replace(/\.md$/, '');
  let m = ctx(id);
  return {
    title: m.title,
    name,
    href: `/wiki/${name}`,
  };
});
