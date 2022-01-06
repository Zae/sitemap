var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
var _namespace, _namespaceXsi, _namespaceXsiSchemaLocation, _urls, _build, build_fn, _loc, _lastmod, _changefreq, _priority, _defaults;
import xml from "xml";
var ChangeFrequencies;
(function(ChangeFrequencies2) {
  ChangeFrequencies2["ALWAYS"] = "always";
  ChangeFrequencies2["HOURLY"] = "hourly";
  ChangeFrequencies2["DAILY"] = "daily";
  ChangeFrequencies2["WEEKLY"] = "weekly";
  ChangeFrequencies2["MONTHLY"] = "monthly";
  ChangeFrequencies2["YEARLY"] = "yearly";
  ChangeFrequencies2["NEVER"] = "never";
})(ChangeFrequencies || (ChangeFrequencies = {}));
class Sitemap {
  constructor(urls = []) {
    __privateAdd(this, _build);
    __privateAdd(this, _namespace, "http://www.sitemaps.org/schemas/sitemap/0.9");
    __privateAdd(this, _namespaceXsi, "http://www.w3.org/2001/XMLSchema-instance");
    __privateAdd(this, _namespaceXsiSchemaLocation, "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd");
    __privateAdd(this, _urls, void 0);
    __privateSet(this, _urls, urls);
  }
  add(url) {
    var _a, _b, _c, _d;
    if (url instanceof Url) {
      __privateGet(this, _urls).push(url);
      return;
    }
    __privateGet(this, _urls).push(new Url((_a = url.loc) != null ? _a : "", (_b = url.lastmod) != null ? _b : null, (_c = url.changefreq) != null ? _c : Url.defaults.changefreq, (_d = url.priority) != null ? _d : Url.defaults.priority));
  }
  stream() {
    return __privateMethod(this, _build, build_fn).call(this, true);
  }
  toString() {
    return __privateMethod(this, _build, build_fn).call(this, false);
  }
}
_namespace = new WeakMap();
_namespaceXsi = new WeakMap();
_namespaceXsiSchemaLocation = new WeakMap();
_urls = new WeakMap();
_build = new WeakSet();
build_fn = function(stream = false) {
  return xml({
    urlset: [
      {
        _attr: {
          xmlns: __privateGet(this, _namespace),
          "xmlns:xsi": __privateGet(this, _namespaceXsi),
          "xsi:schemaLocation": __privateGet(this, _namespaceXsiSchemaLocation)
        }
      },
      ...__privateGet(this, _urls).map((url) => {
        return {
          url: Object.entries(url.build()).map(([key, value]) => {
            if (value instanceof URL) {
              return { [key]: value.toString() };
            }
            return { [key]: value };
          })
        };
      })
    ]
  }, {
    indent: "",
    stream,
    declaration: true
  });
};
const _Url = class {
  constructor(location, lastModificationDate, changefrequency = __privateGet(_Url, _defaults).changefreq, priority = __privateGet(_Url, _defaults).priority) {
    __privateAdd(this, _loc, void 0);
    __privateAdd(this, _lastmod, void 0);
    __privateAdd(this, _changefreq, void 0);
    __privateAdd(this, _priority, void 0);
    if (!_Url.validPriority(priority)) {
      throw new Error("Invalid priority passed");
    }
    __privateSet(this, _loc, location);
    __privateSet(this, _lastmod, lastModificationDate != null ? lastModificationDate : new Date());
    __privateSet(this, _changefreq, changefrequency != null ? changefrequency : _Url.defaults.changefreq);
    __privateSet(this, _priority, priority != null ? priority : _Url.defaults.priority);
  }
  static get defaults() {
    return __privateGet(_Url, _defaults);
  }
  get defaults() {
    return __privateGet(_Url, _defaults);
  }
  static set defaultChangeFreq(value) {
    __privateGet(_Url, _defaults).changefreq = value;
  }
  set defaultChangeFreq(value) {
    _Url.defaultChangeFreq = value;
  }
  static set defaultPriority(value) {
    if (!_Url.validPriority(value)) {
      throw new Error("Invalid priority passed");
    }
    __privateGet(_Url, _defaults).priority = value;
  }
  defaultPriority(value) {
    _Url.defaultPriority = value;
  }
  get loc() {
    return __privateGet(this, _loc);
  }
  get lastmod() {
    return __privateGet(this, _lastmod);
  }
  get changefreq() {
    return __privateGet(this, _changefreq);
  }
  get priority() {
    return __privateGet(this, _priority);
  }
  static validPriority(priority) {
    return priority >= 0 && priority <= 1;
  }
  build() {
    return {
      loc: __privateGet(this, _loc),
      lastmod: __privateGet(this, _lastmod),
      changefreq: __privateGet(this, _changefreq),
      priority: __privateGet(this, _priority)
    };
  }
};
let Url = _Url;
_loc = new WeakMap();
_lastmod = new WeakMap();
_changefreq = new WeakMap();
_priority = new WeakMap();
_defaults = new WeakMap();
__privateAdd(Url, _defaults, {
  changefreq: ChangeFrequencies.ALWAYS,
  priority: 0.5
});
export { ChangeFrequencies, Sitemap, Url };
