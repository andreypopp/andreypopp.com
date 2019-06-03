let ctx = require.context('./pages/wiki', false);
let ids = ctx.keys().sort();

let pagesByCategory = {};
let pagesByName = {};
let pages = [];

for (let id of ids) {
  let name = id.substr(2).replace(/\.md$/, '');
  let m = ctx(id);
  let page = {
    title: m.title,
    name,
    href: `/wiki/${name}`,
  }
  pages.push(name);
  pagesByName[name] = page;
  if (m.category) {
    for (let category of m.category) {
      pagesByCategory[category] = pagesByCategory[category] || [];
      pagesByCategory[category].push(name);
    }
  }
}

module.exports = {
  pagesByCategory,
  pagesByName,
  pages,
};
