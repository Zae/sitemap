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
function getAugmentedNamespace(n) {
  if (n.__esModule)
    return n;
  var a = Object.defineProperty({}, "__esModule", { value: true });
  Object.keys(n).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n, k);
    Object.defineProperty(a, k, d.get ? d : {
      enumerable: true,
      get: function() {
        return n[k];
      }
    });
  });
  return a;
}
var xml$2 = { exports: {} };
var XML_CHARACTER_MAP = {
  "&": "&amp;",
  '"': "&quot;",
  "'": "&apos;",
  "<": "&lt;",
  ">": "&gt;"
};
function escapeForXML$1(string) {
  return string && string.replace ? string.replace(/([&"<>'])/g, function(str, item) {
    return XML_CHARACTER_MAP[item];
  }) : string;
}
var escapeForXML_1 = escapeForXML$1;
var __viteBrowserExternal = {};
var __viteBrowserExternal$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": __viteBrowserExternal
});
var require$$1 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal$1);
var escapeForXML = escapeForXML_1;
var Stream = require$$1.Stream;
var DEFAULT_INDENT = "    ";
function xml(input, options) {
  if (typeof options !== "object") {
    options = {
      indent: options
    };
  }
  var stream = options.stream ? new Stream() : null, output = "", interrupted = false, indent = !options.indent ? "" : options.indent === true ? DEFAULT_INDENT : options.indent, instant = true;
  function delay(func) {
    if (!instant) {
      func();
    } else {
      process.nextTick(func);
    }
  }
  function append(interrupt, out) {
    if (out !== void 0) {
      output += out;
    }
    if (interrupt && !interrupted) {
      stream = stream || new Stream();
      interrupted = true;
    }
    if (interrupt && interrupted) {
      var data = output;
      delay(function() {
        stream.emit("data", data);
      });
      output = "";
    }
  }
  function add(value, last) {
    format(append, resolve(value, indent, indent ? 1 : 0), last);
  }
  function end() {
    if (stream) {
      var data = output;
      delay(function() {
        stream.emit("data", data);
        stream.emit("end");
        stream.readable = false;
        stream.emit("close");
      });
    }
  }
  function addXmlDeclaration(declaration) {
    var encoding = declaration.encoding || "UTF-8", attr = { version: "1.0", encoding };
    if (declaration.standalone) {
      attr.standalone = declaration.standalone;
    }
    add({ "?xml": { _attr: attr } });
    output = output.replace("/>", "?>");
  }
  delay(function() {
    instant = false;
  });
  if (options.declaration) {
    addXmlDeclaration(options.declaration);
  }
  if (input && input.forEach) {
    input.forEach(function(value, i) {
      var last;
      if (i + 1 === input.length)
        last = end;
      add(value, last);
    });
  } else {
    add(input, end);
  }
  if (stream) {
    stream.readable = true;
    return stream;
  }
  return output;
}
function element() {
  var input = Array.prototype.slice.call(arguments), self = {
    _elem: resolve(input)
  };
  self.push = function(input2) {
    if (!this.append) {
      throw new Error("not assigned to a parent!");
    }
    var that = this;
    var indent = this._elem.indent;
    format(this.append, resolve(input2, indent, this._elem.icount + (indent ? 1 : 0)), function() {
      that.append(true);
    });
  };
  self.close = function(input2) {
    if (input2 !== void 0) {
      this.push(input2);
    }
    if (this.end) {
      this.end();
    }
  };
  return self;
}
function create_indent(character, count) {
  return new Array(count || 0).join(character || "");
}
function resolve(data, indent, indent_count) {
  indent_count = indent_count || 0;
  var indent_spaces = create_indent(indent, indent_count);
  var name;
  var values = data;
  var interrupt = false;
  if (typeof data === "object") {
    var keys = Object.keys(data);
    name = keys[0];
    values = data[name];
    if (values && values._elem) {
      values._elem.name = name;
      values._elem.icount = indent_count;
      values._elem.indent = indent;
      values._elem.indents = indent_spaces;
      values._elem.interrupt = values;
      return values._elem;
    }
  }
  var attributes = [], content = [];
  var isStringContent;
  function get_attributes(obj) {
    var keys2 = Object.keys(obj);
    keys2.forEach(function(key) {
      attributes.push(attribute(key, obj[key]));
    });
  }
  switch (typeof values) {
    case "object":
      if (values === null)
        break;
      if (values._attr) {
        get_attributes(values._attr);
      }
      if (values._cdata) {
        content.push(("<![CDATA[" + values._cdata).replace(/\]\]>/g, "]]]]><![CDATA[>") + "]]>");
      }
      if (values.forEach) {
        isStringContent = false;
        content.push("");
        values.forEach(function(value) {
          if (typeof value == "object") {
            var _name = Object.keys(value)[0];
            if (_name == "_attr") {
              get_attributes(value._attr);
            } else {
              content.push(resolve(value, indent, indent_count + 1));
            }
          } else {
            content.pop();
            isStringContent = true;
            content.push(escapeForXML(value));
          }
        });
        if (!isStringContent) {
          content.push("");
        }
      }
      break;
    default:
      content.push(escapeForXML(values));
  }
  return {
    name,
    interrupt,
    attributes,
    content,
    icount: indent_count,
    indents: indent_spaces,
    indent
  };
}
function format(append, elem, end) {
  if (typeof elem != "object") {
    return append(false, elem);
  }
  var len = elem.interrupt ? 1 : elem.content.length;
  function proceed() {
    while (elem.content.length) {
      var value = elem.content.shift();
      if (value === void 0)
        continue;
      if (interrupt(value))
        return;
      format(append, value);
    }
    append(false, (len > 1 ? elem.indents : "") + (elem.name ? "</" + elem.name + ">" : "") + (elem.indent && !end ? "\n" : ""));
    if (end) {
      end();
    }
  }
  function interrupt(value) {
    if (value.interrupt) {
      value.interrupt.append = append;
      value.interrupt.end = proceed;
      value.interrupt = false;
      append(true);
      return true;
    }
    return false;
  }
  append(false, elem.indents + (elem.name ? "<" + elem.name : "") + (elem.attributes.length ? " " + elem.attributes.join(" ") : "") + (len ? elem.name ? ">" : "" : elem.name ? "/>" : "") + (elem.indent && len > 1 ? "\n" : ""));
  if (!len) {
    return append(false, elem.indent ? "\n" : "");
  }
  if (!interrupt(elem)) {
    proceed();
  }
}
function attribute(key, value) {
  return key + '="' + escapeForXML(value) + '"';
}
xml$2.exports = xml;
xml$2.exports.element = xml$2.exports.Element = element;
var xml$1 = xml$2.exports;
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
  return xml$1({
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
