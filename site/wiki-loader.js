// @flow

module.exports = function(src /*: string */) {
  let cb = this.async();
  this.cacheable(true);
  this.resolve(this.rootContext, './Wiki', (err, mod) => {
    if (err) return cb(err);
    cb(
      null,
      `
import {Wiki} from "${mod}";
export default Wiki;
${src}
      `.trim(),
    );
  });
};
