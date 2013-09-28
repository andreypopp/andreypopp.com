var resolve = require('url').resolve;

module.exports = function(url, cb) {
  var xhr = new global.XMLHttpRequest(),
      twoHundred = /^20\d$/;

  if (!url.match(/^https?:\/\//))
    url = resolve(location.href, url);

  xhr.onreadystatechange = function() {
    if (4 == xhr.readyState && 0 !== xhr.status) {
      if (twoHundred.test(xhr.status)) cb(null, JSON.parse(xhr.responseText));
      else cb(xhr, null);
    }
  };
  xhr.onerror = function(e) { return cb(e, null); };
  xhr.open('GET', url, true);
  xhr.send();
}
