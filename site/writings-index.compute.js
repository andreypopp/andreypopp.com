let ctx = require.context('./pages/writings', false);
let ids = ctx.keys().sort().reverse();

let extractDateRe = /^(\d\d\d\d)-(\d\d)-(\d\d)/;

module.exports = ids.map(id => {
  let slug = id.substr(2).replace(/\.md$/, '');
  let m = ctx(id);
  let date = extractDateRe.exec(slug);
  let [_, year, month, day] = date;
  return {
    title: m.title,
    href: `/writings/${slug}`,
    date: {year, month, day},
  };
})
