// node_modules/.deno/preact@10.19.2/node_modules/preact/dist/preact.module.js
var n;
var l;
var u;
var t;
var i;
var o;
var r;
var f;
var e;
var c = {};
var s = [];
var a = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
var h = Array.isArray;
function v(n2, l3) {
  for (var u4 in l3)
    n2[u4] = l3[u4];
  return n2;
}
function p(n2) {
  var l3 = n2.parentNode;
  l3 && l3.removeChild(n2);
}
function y(l3, u4, t3) {
  var i4, o3, r3, f4 = {};
  for (r3 in u4)
    "key" == r3 ? i4 = u4[r3] : "ref" == r3 ? o3 = u4[r3] : f4[r3] = u4[r3];
  if (arguments.length > 2 && (f4.children = arguments.length > 3 ? n.call(arguments, 2) : t3), "function" == typeof l3 && null != l3.defaultProps)
    for (r3 in l3.defaultProps)
      void 0 === f4[r3] && (f4[r3] = l3.defaultProps[r3]);
  return d(l3, f4, i4, o3, null);
}
function d(n2, t3, i4, o3, r3) {
  var f4 = { type: n2, props: t3, key: i4, ref: o3, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: null == r3 ? ++u : r3, __i: -1, __u: 0 };
  return null == r3 && null != l.vnode && l.vnode(f4), f4;
}
function g(n2) {
  return n2.children;
}
function b(n2, l3) {
  this.props = n2, this.context = l3;
}
function m(n2, l3) {
  if (null == l3)
    return n2.__ ? m(n2.__, n2.__i + 1) : null;
  for (var u4; l3 < n2.__k.length; l3++)
    if (null != (u4 = n2.__k[l3]) && null != u4.__e)
      return u4.__e;
  return "function" == typeof n2.type ? m(n2) : null;
}
function k(n2) {
  var l3, u4;
  if (null != (n2 = n2.__) && null != n2.__c) {
    for (n2.__e = n2.__c.base = null, l3 = 0; l3 < n2.__k.length; l3++)
      if (null != (u4 = n2.__k[l3]) && null != u4.__e) {
        n2.__e = n2.__c.base = u4.__e;
        break;
      }
    return k(n2);
  }
}
function w(n2) {
  (!n2.__d && (n2.__d = true) && i.push(n2) && !x.__r++ || o !== l.debounceRendering) && ((o = l.debounceRendering) || r)(x);
}
function x() {
  var n2, u4, t3, o3, r3, e3, c3, s3, a3;
  for (i.sort(f); n2 = i.shift(); )
    n2.__d && (u4 = i.length, o3 = void 0, e3 = (r3 = (t3 = n2).__v).__e, s3 = [], a3 = [], (c3 = t3.__P) && ((o3 = v({}, r3)).__v = r3.__v + 1, l.vnode && l.vnode(o3), L(c3, o3, r3, t3.__n, void 0 !== c3.ownerSVGElement, 32 & r3.__u ? [e3] : null, s3, null == e3 ? m(r3) : e3, !!(32 & r3.__u), a3), o3.__.__k[o3.__i] = o3, M(s3, o3, a3), o3.__e != e3 && k(o3)), i.length > u4 && i.sort(f));
  x.__r = 0;
}
function C(n2, l3, u4, t3, i4, o3, r3, f4, e3, a3, h3) {
  var v3, p3, y2, d3, _2, g3 = t3 && t3.__k || s, b3 = l3.length;
  for (u4.__d = e3, P(u4, l3, g3), e3 = u4.__d, v3 = 0; v3 < b3; v3++)
    null != (y2 = u4.__k[v3]) && "boolean" != typeof y2 && "function" != typeof y2 && (p3 = -1 === y2.__i ? c : g3[y2.__i] || c, y2.__i = v3, L(n2, y2, p3, i4, o3, r3, f4, e3, a3, h3), d3 = y2.__e, y2.ref && p3.ref != y2.ref && (p3.ref && z(p3.ref, null, y2), h3.push(y2.ref, y2.__c || d3, y2)), null == _2 && null != d3 && (_2 = d3), 65536 & y2.__u || p3.__k === y2.__k ? e3 = S(y2, e3, n2) : "function" == typeof y2.type && void 0 !== y2.__d ? e3 = y2.__d : d3 && (e3 = d3.nextSibling), y2.__d = void 0, y2.__u &= -196609);
  u4.__d = e3, u4.__e = _2;
}
function P(n2, l3, u4) {
  var t3, i4, o3, r3, f4, e3 = l3.length, c3 = u4.length, s3 = c3, a3 = 0;
  for (n2.__k = [], t3 = 0; t3 < e3; t3++)
    null != (i4 = n2.__k[t3] = null == (i4 = l3[t3]) || "boolean" == typeof i4 || "function" == typeof i4 ? null : "string" == typeof i4 || "number" == typeof i4 || "bigint" == typeof i4 || i4.constructor == String ? d(null, i4, null, null, i4) : h(i4) ? d(g, { children: i4 }, null, null, null) : i4.__b > 0 ? d(i4.type, i4.props, i4.key, i4.ref ? i4.ref : null, i4.__v) : i4) ? (i4.__ = n2, i4.__b = n2.__b + 1, f4 = H(i4, u4, r3 = t3 + a3, s3), i4.__i = f4, o3 = null, -1 !== f4 && (s3--, (o3 = u4[f4]) && (o3.__u |= 131072)), null == o3 || null === o3.__v ? (-1 == f4 && a3--, "function" != typeof i4.type && (i4.__u |= 65536)) : f4 !== r3 && (f4 === r3 + 1 ? a3++ : f4 > r3 ? s3 > e3 - r3 ? a3 += f4 - r3 : a3-- : a3 = f4 < r3 && f4 == r3 - 1 ? f4 - r3 : 0, f4 !== t3 + a3 && (i4.__u |= 65536))) : (o3 = u4[t3]) && null == o3.key && o3.__e && (o3.__e == n2.__d && (n2.__d = m(o3)), N(o3, o3, false), u4[t3] = null, s3--);
  if (s3)
    for (t3 = 0; t3 < c3; t3++)
      null != (o3 = u4[t3]) && 0 == (131072 & o3.__u) && (o3.__e == n2.__d && (n2.__d = m(o3)), N(o3, o3));
}
function S(n2, l3, u4) {
  var t3, i4;
  if ("function" == typeof n2.type) {
    for (t3 = n2.__k, i4 = 0; t3 && i4 < t3.length; i4++)
      t3[i4] && (t3[i4].__ = n2, l3 = S(t3[i4], l3, u4));
    return l3;
  }
  return n2.__e != l3 && (u4.insertBefore(n2.__e, l3 || null), l3 = n2.__e), l3 && l3.nextSibling;
}
function H(n2, l3, u4, t3) {
  var i4 = n2.key, o3 = n2.type, r3 = u4 - 1, f4 = u4 + 1, e3 = l3[u4];
  if (null === e3 || e3 && i4 == e3.key && o3 === e3.type)
    return u4;
  if (t3 > (null != e3 && 0 == (131072 & e3.__u) ? 1 : 0))
    for (; r3 >= 0 || f4 < l3.length; ) {
      if (r3 >= 0) {
        if ((e3 = l3[r3]) && 0 == (131072 & e3.__u) && i4 == e3.key && o3 === e3.type)
          return r3;
        r3--;
      }
      if (f4 < l3.length) {
        if ((e3 = l3[f4]) && 0 == (131072 & e3.__u) && i4 == e3.key && o3 === e3.type)
          return f4;
        f4++;
      }
    }
  return -1;
}
function I(n2, l3, u4) {
  "-" === l3[0] ? n2.setProperty(l3, null == u4 ? "" : u4) : n2[l3] = null == u4 ? "" : "number" != typeof u4 || a.test(l3) ? u4 : u4 + "px";
}
function T(n2, l3, u4, t3, i4) {
  var o3;
  n:
    if ("style" === l3)
      if ("string" == typeof u4)
        n2.style.cssText = u4;
      else {
        if ("string" == typeof t3 && (n2.style.cssText = t3 = ""), t3)
          for (l3 in t3)
            u4 && l3 in u4 || I(n2.style, l3, "");
        if (u4)
          for (l3 in u4)
            t3 && u4[l3] === t3[l3] || I(n2.style, l3, u4[l3]);
      }
    else if ("o" === l3[0] && "n" === l3[1])
      o3 = l3 !== (l3 = l3.replace(/(PointerCapture)$|Capture$/, "$1")), l3 = l3.toLowerCase() in n2 ? l3.toLowerCase().slice(2) : l3.slice(2), n2.l || (n2.l = {}), n2.l[l3 + o3] = u4, u4 ? t3 ? u4.u = t3.u : (u4.u = Date.now(), n2.addEventListener(l3, o3 ? D : A, o3)) : n2.removeEventListener(l3, o3 ? D : A, o3);
    else {
      if (i4)
        l3 = l3.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if ("width" !== l3 && "height" !== l3 && "href" !== l3 && "list" !== l3 && "form" !== l3 && "tabIndex" !== l3 && "download" !== l3 && "rowSpan" !== l3 && "colSpan" !== l3 && "role" !== l3 && l3 in n2)
        try {
          n2[l3] = null == u4 ? "" : u4;
          break n;
        } catch (n3) {
        }
      "function" == typeof u4 || (null == u4 || false === u4 && "-" !== l3[4] ? n2.removeAttribute(l3) : n2.setAttribute(l3, u4));
    }
}
function A(n2) {
  var u4 = this.l[n2.type + false];
  if (n2.t) {
    if (n2.t <= u4.u)
      return;
  } else
    n2.t = Date.now();
  return u4(l.event ? l.event(n2) : n2);
}
function D(n2) {
  return this.l[n2.type + true](l.event ? l.event(n2) : n2);
}
function L(n2, u4, t3, i4, o3, r3, f4, e3, c3, s3) {
  var a3, p3, y2, d3, _2, m3, k3, w3, x2, P2, S2, $, H2, I2, T2, A2 = u4.type;
  if (void 0 !== u4.constructor)
    return null;
  128 & t3.__u && (c3 = !!(32 & t3.__u), r3 = [e3 = u4.__e = t3.__e]), (a3 = l.__b) && a3(u4);
  n:
    if ("function" == typeof A2)
      try {
        if (w3 = u4.props, x2 = (a3 = A2.contextType) && i4[a3.__c], P2 = a3 ? x2 ? x2.props.value : a3.__ : i4, t3.__c ? k3 = (p3 = u4.__c = t3.__c).__ = p3.__E : ("prototype" in A2 && A2.prototype.render ? u4.__c = p3 = new A2(w3, P2) : (u4.__c = p3 = new b(w3, P2), p3.constructor = A2, p3.render = O), x2 && x2.sub(p3), p3.props = w3, p3.state || (p3.state = {}), p3.context = P2, p3.__n = i4, y2 = p3.__d = true, p3.__h = [], p3._sb = []), null == p3.__s && (p3.__s = p3.state), null != A2.getDerivedStateFromProps && (p3.__s == p3.state && (p3.__s = v({}, p3.__s)), v(p3.__s, A2.getDerivedStateFromProps(w3, p3.__s))), d3 = p3.props, _2 = p3.state, p3.__v = u4, y2)
          null == A2.getDerivedStateFromProps && null != p3.componentWillMount && p3.componentWillMount(), null != p3.componentDidMount && p3.__h.push(p3.componentDidMount);
        else {
          if (null == A2.getDerivedStateFromProps && w3 !== d3 && null != p3.componentWillReceiveProps && p3.componentWillReceiveProps(w3, P2), !p3.__e && (null != p3.shouldComponentUpdate && false === p3.shouldComponentUpdate(w3, p3.__s, P2) || u4.__v === t3.__v)) {
            for (u4.__v !== t3.__v && (p3.props = w3, p3.state = p3.__s, p3.__d = false), u4.__e = t3.__e, u4.__k = t3.__k, u4.__k.forEach(function(n3) {
              n3 && (n3.__ = u4);
            }), S2 = 0; S2 < p3._sb.length; S2++)
              p3.__h.push(p3._sb[S2]);
            p3._sb = [], p3.__h.length && f4.push(p3);
            break n;
          }
          null != p3.componentWillUpdate && p3.componentWillUpdate(w3, p3.__s, P2), null != p3.componentDidUpdate && p3.__h.push(function() {
            p3.componentDidUpdate(d3, _2, m3);
          });
        }
        if (p3.context = P2, p3.props = w3, p3.__P = n2, p3.__e = false, $ = l.__r, H2 = 0, "prototype" in A2 && A2.prototype.render) {
          for (p3.state = p3.__s, p3.__d = false, $ && $(u4), a3 = p3.render(p3.props, p3.state, p3.context), I2 = 0; I2 < p3._sb.length; I2++)
            p3.__h.push(p3._sb[I2]);
          p3._sb = [];
        } else
          do {
            p3.__d = false, $ && $(u4), a3 = p3.render(p3.props, p3.state, p3.context), p3.state = p3.__s;
          } while (p3.__d && ++H2 < 25);
        p3.state = p3.__s, null != p3.getChildContext && (i4 = v(v({}, i4), p3.getChildContext())), y2 || null == p3.getSnapshotBeforeUpdate || (m3 = p3.getSnapshotBeforeUpdate(d3, _2)), C(n2, h(T2 = null != a3 && a3.type === g && null == a3.key ? a3.props.children : a3) ? T2 : [T2], u4, t3, i4, o3, r3, f4, e3, c3, s3), p3.base = u4.__e, u4.__u &= -161, p3.__h.length && f4.push(p3), k3 && (p3.__E = p3.__ = null);
      } catch (n3) {
        u4.__v = null, c3 || null != r3 ? (u4.__e = e3, u4.__u |= c3 ? 160 : 32, r3[r3.indexOf(e3)] = null) : (u4.__e = t3.__e, u4.__k = t3.__k), l.__e(n3, u4, t3);
      }
    else
      null == r3 && u4.__v === t3.__v ? (u4.__k = t3.__k, u4.__e = t3.__e) : u4.__e = j(t3.__e, u4, t3, i4, o3, r3, f4, c3, s3);
  (a3 = l.diffed) && a3(u4);
}
function M(n2, u4, t3) {
  u4.__d = void 0;
  for (var i4 = 0; i4 < t3.length; i4++)
    z(t3[i4], t3[++i4], t3[++i4]);
  l.__c && l.__c(u4, n2), n2.some(function(u5) {
    try {
      n2 = u5.__h, u5.__h = [], n2.some(function(n3) {
        n3.call(u5);
      });
    } catch (n3) {
      l.__e(n3, u5.__v);
    }
  });
}
function j(l3, u4, t3, i4, o3, r3, f4, e3, s3) {
  var a3, v3, y2, d3, _2, g3, b3, k3 = t3.props, w3 = u4.props, x2 = u4.type;
  if ("svg" === x2 && (o3 = true), null != r3) {
    for (a3 = 0; a3 < r3.length; a3++)
      if ((_2 = r3[a3]) && "setAttribute" in _2 == !!x2 && (x2 ? _2.localName === x2 : 3 === _2.nodeType)) {
        l3 = _2, r3[a3] = null;
        break;
      }
  }
  if (null == l3) {
    if (null === x2)
      return document.createTextNode(w3);
    l3 = o3 ? document.createElementNS("http://www.w3.org/2000/svg", x2) : document.createElement(x2, w3.is && w3), r3 = null, e3 = false;
  }
  if (null === x2)
    k3 === w3 || e3 && l3.data === w3 || (l3.data = w3);
  else {
    if (r3 = r3 && n.call(l3.childNodes), k3 = t3.props || c, !e3 && null != r3)
      for (k3 = {}, a3 = 0; a3 < l3.attributes.length; a3++)
        k3[(_2 = l3.attributes[a3]).name] = _2.value;
    for (a3 in k3)
      _2 = k3[a3], "children" == a3 || ("dangerouslySetInnerHTML" == a3 ? y2 = _2 : "key" === a3 || a3 in w3 || T(l3, a3, null, _2, o3));
    for (a3 in w3)
      _2 = w3[a3], "children" == a3 ? d3 = _2 : "dangerouslySetInnerHTML" == a3 ? v3 = _2 : "value" == a3 ? g3 = _2 : "checked" == a3 ? b3 = _2 : "key" === a3 || e3 && "function" != typeof _2 || k3[a3] === _2 || T(l3, a3, _2, k3[a3], o3);
    if (v3)
      e3 || y2 && (v3.__html === y2.__html || v3.__html === l3.innerHTML) || (l3.innerHTML = v3.__html), u4.__k = [];
    else if (y2 && (l3.innerHTML = ""), C(l3, h(d3) ? d3 : [d3], u4, t3, i4, o3 && "foreignObject" !== x2, r3, f4, r3 ? r3[0] : t3.__k && m(t3, 0), e3, s3), null != r3)
      for (a3 = r3.length; a3--; )
        null != r3[a3] && p(r3[a3]);
    e3 || (a3 = "value", void 0 !== g3 && (g3 !== l3[a3] || "progress" === x2 && !g3 || "option" === x2 && g3 !== k3[a3]) && T(l3, a3, g3, k3[a3], false), a3 = "checked", void 0 !== b3 && b3 !== l3[a3] && T(l3, a3, b3, k3[a3], false));
  }
  return l3;
}
function z(n2, u4, t3) {
  try {
    "function" == typeof n2 ? n2(u4) : n2.current = u4;
  } catch (n3) {
    l.__e(n3, t3);
  }
}
function N(n2, u4, t3) {
  var i4, o3;
  if (l.unmount && l.unmount(n2), (i4 = n2.ref) && (i4.current && i4.current !== n2.__e || z(i4, null, u4)), null != (i4 = n2.__c)) {
    if (i4.componentWillUnmount)
      try {
        i4.componentWillUnmount();
      } catch (n3) {
        l.__e(n3, u4);
      }
    i4.base = i4.__P = null, n2.__c = void 0;
  }
  if (i4 = n2.__k)
    for (o3 = 0; o3 < i4.length; o3++)
      i4[o3] && N(i4[o3], u4, t3 || "function" != typeof n2.type);
  t3 || null == n2.__e || p(n2.__e), n2.__ = n2.__e = n2.__d = void 0;
}
function O(n2, l3, u4) {
  return this.constructor(n2, u4);
}
function q(u4, t3, i4) {
  var o3, r3, f4, e3;
  l.__ && l.__(u4, t3), r3 = (o3 = "function" == typeof i4) ? null : i4 && i4.__k || t3.__k, f4 = [], e3 = [], L(t3, u4 = (!o3 && i4 || t3).__k = y(g, null, [u4]), r3 || c, c, void 0 !== t3.ownerSVGElement, !o3 && i4 ? [i4] : r3 ? null : t3.firstChild ? n.call(t3.childNodes) : null, f4, !o3 && i4 ? i4 : r3 ? r3.__e : t3.firstChild, o3, e3), M(f4, u4, e3);
}
n = s.slice, l = { __e: function(n2, l3, u4, t3) {
  for (var i4, o3, r3; l3 = l3.__; )
    if ((i4 = l3.__c) && !i4.__)
      try {
        if ((o3 = i4.constructor) && null != o3.getDerivedStateFromError && (i4.setState(o3.getDerivedStateFromError(n2)), r3 = i4.__d), null != i4.componentDidCatch && (i4.componentDidCatch(n2, t3 || {}), r3 = i4.__d), r3)
          return i4.__E = i4;
      } catch (l4) {
        n2 = l4;
      }
  throw n2;
} }, u = 0, t = function(n2) {
  return null != n2 && null == n2.constructor;
}, b.prototype.setState = function(n2, l3) {
  var u4;
  u4 = null != this.__s && this.__s !== this.state ? this.__s : this.__s = v({}, this.state), "function" == typeof n2 && (n2 = n2(v({}, u4), this.props)), n2 && v(u4, n2), null != n2 && this.__v && (l3 && this._sb.push(l3), w(this));
}, b.prototype.forceUpdate = function(n2) {
  this.__v && (this.__e = true, n2 && this.__h.push(n2), w(this));
}, b.prototype.render = g, i = [], r = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, f = function(n2, l3) {
  return n2.__v.__b - l3.__v.__b;
}, x.__r = 0, e = 0;

// node_modules/.deno/preact@10.19.2/node_modules/preact/hooks/dist/hooks.module.js
var t2;
var r2;
var u2;
var i2;
var o2 = 0;
var f2 = [];
var c2 = [];
var e2 = l.__b;
var a2 = l.__r;
var v2 = l.diffed;
var l2 = l.__c;
var m2 = l.unmount;
function d2(t3, u4) {
  l.__h && l.__h(r2, t3, o2 || u4), o2 = 0;
  var i4 = r2.__H || (r2.__H = { __: [], __h: [] });
  return t3 >= i4.__.length && i4.__.push({ __V: c2 }), i4.__[t3];
}
function h2(n2) {
  return o2 = 1, s2(B, n2);
}
function s2(n2, u4, i4) {
  var o3 = d2(t2++, 2);
  if (o3.t = n2, !o3.__c && (o3.__ = [i4 ? i4(u4) : B(void 0, u4), function(n3) {
    var t3 = o3.__N ? o3.__N[0] : o3.__[0], r3 = o3.t(t3, n3);
    t3 !== r3 && (o3.__N = [r3, o3.__[1]], o3.__c.setState({}));
  }], o3.__c = r2, !r2.u)) {
    var f4 = function(n3, t3, r3) {
      if (!o3.__c.__H)
        return true;
      var u5 = o3.__c.__H.__.filter(function(n4) {
        return n4.__c;
      });
      if (u5.every(function(n4) {
        return !n4.__N;
      }))
        return !c3 || c3.call(this, n3, t3, r3);
      var i5 = false;
      return u5.forEach(function(n4) {
        if (n4.__N) {
          var t4 = n4.__[0];
          n4.__ = n4.__N, n4.__N = void 0, t4 !== n4.__[0] && (i5 = true);
        }
      }), !(!i5 && o3.__c.props === n3) && (!c3 || c3.call(this, n3, t3, r3));
    };
    r2.u = true;
    var c3 = r2.shouldComponentUpdate, e3 = r2.componentWillUpdate;
    r2.componentWillUpdate = function(n3, t3, r3) {
      if (this.__e) {
        var u5 = c3;
        c3 = void 0, f4(n3, t3, r3), c3 = u5;
      }
      e3 && e3.call(this, n3, t3, r3);
    }, r2.shouldComponentUpdate = f4;
  }
  return o3.__N || o3.__;
}
function p2(u4, i4) {
  var o3 = d2(t2++, 3);
  !l.__s && z2(o3.__H, i4) && (o3.__ = u4, o3.i = i4, r2.__H.__h.push(o3));
}
function _(n2) {
  return o2 = 5, F(function() {
    return { current: n2 };
  }, []);
}
function F(n2, r3) {
  var u4 = d2(t2++, 7);
  return z2(u4.__H, r3) ? (u4.__V = n2(), u4.i = r3, u4.__h = n2, u4.__V) : u4.__;
}
function b2() {
  for (var t3; t3 = f2.shift(); )
    if (t3.__P && t3.__H)
      try {
        t3.__H.__h.forEach(k2), t3.__H.__h.forEach(w2), t3.__H.__h = [];
      } catch (r3) {
        t3.__H.__h = [], l.__e(r3, t3.__v);
      }
}
l.__b = function(n2) {
  r2 = null, e2 && e2(n2);
}, l.__r = function(n2) {
  a2 && a2(n2), t2 = 0;
  var i4 = (r2 = n2.__c).__H;
  i4 && (u2 === r2 ? (i4.__h = [], r2.__h = [], i4.__.forEach(function(n3) {
    n3.__N && (n3.__ = n3.__N), n3.__V = c2, n3.__N = n3.i = void 0;
  })) : (i4.__h.forEach(k2), i4.__h.forEach(w2), i4.__h = [], t2 = 0)), u2 = r2;
}, l.diffed = function(t3) {
  v2 && v2(t3);
  var o3 = t3.__c;
  o3 && o3.__H && (o3.__H.__h.length && (1 !== f2.push(o3) && i2 === l.requestAnimationFrame || ((i2 = l.requestAnimationFrame) || j2)(b2)), o3.__H.__.forEach(function(n2) {
    n2.i && (n2.__H = n2.i), n2.__V !== c2 && (n2.__ = n2.__V), n2.i = void 0, n2.__V = c2;
  })), u2 = r2 = null;
}, l.__c = function(t3, r3) {
  r3.some(function(t4) {
    try {
      t4.__h.forEach(k2), t4.__h = t4.__h.filter(function(n2) {
        return !n2.__ || w2(n2);
      });
    } catch (u4) {
      r3.some(function(n2) {
        n2.__h && (n2.__h = []);
      }), r3 = [], l.__e(u4, t4.__v);
    }
  }), l2 && l2(t3, r3);
}, l.unmount = function(t3) {
  m2 && m2(t3);
  var r3, u4 = t3.__c;
  u4 && u4.__H && (u4.__H.__.forEach(function(n2) {
    try {
      k2(n2);
    } catch (n3) {
      r3 = n3;
    }
  }), u4.__H = void 0, r3 && l.__e(r3, u4.__v));
};
var g2 = "function" == typeof requestAnimationFrame;
function j2(n2) {
  var t3, r3 = function() {
    clearTimeout(u4), g2 && cancelAnimationFrame(t3), setTimeout(n2);
  }, u4 = setTimeout(r3, 100);
  g2 && (t3 = requestAnimationFrame(r3));
}
function k2(n2) {
  var t3 = r2, u4 = n2.__c;
  "function" == typeof u4 && (n2.__c = void 0, u4()), r2 = t3;
}
function w2(n2) {
  var t3 = r2;
  n2.__c = n2.__(), r2 = t3;
}
function z2(n2, t3) {
  return !n2 || n2.length !== t3.length || t3.some(function(t4, r3) {
    return t4 !== n2[r3];
  });
}
function B(n2, t3) {
  return "function" == typeof t3 ? t3(n2) : t3;
}

// node_modules/.deno/preact@10.19.2/node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js
var f3 = 0;
var i3 = Array.isArray;
function u3(e3, t3, n2, o3, i4, u4) {
  var a3, c3, p3 = {};
  for (c3 in t3)
    "ref" == c3 ? a3 = t3[c3] : p3[c3] = t3[c3];
  var l3 = { type: e3, props: p3, key: n2, ref: a3, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: --f3, __i: -1, __u: 0, __source: i4, __self: u4 };
  if ("function" == typeof e3 && (a3 = e3.defaultProps))
    for (c3 in a3)
      void 0 === p3[c3] && (p3[c3] = a3[c3]);
  return l.vnode && l.vnode(l3), l3;
}

// src/ui/components/Sidebar.tsx
function Sidebar({
  config,
  projects,
  currentProject,
  selectedLang,
  selectedPlatform,
  selectedItem,
  screenshots,
  featureGraphic,
  assets,
  onSelectLang,
  onSelectPlatform,
  onSelectItem,
  onAddScreenshot,
  onDeleteScreenshot,
  onSwitchProject,
  onShowProjectModal,
  onGenerate,
  onAddLanguage,
  onCopyPlatformConfig,
  onShowThemeEditor,
  onShowMediaManager,
  generating,
  lastGenerated,
  onViewLastGenerated
}) {
  const [confirmDeleteId, setConfirmDeleteId] = h2(null);
  const currentProjectInfo = projects.find((p3) => p3.id === currentProject);
  const languages = config.languages || [];
  const assetCount = assets ? assets.screenshots.length + assets.mascots.length + assets.icons.length : 0;
  return /* @__PURE__ */ u3("div", { class: "w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col", children: [
    /* @__PURE__ */ u3("div", { class: "p-4 border-b border-zinc-800", children: [
      /* @__PURE__ */ u3("div", { class: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ u3("h1", { class: "text-lg font-bold flex-1 truncate", children: currentProjectInfo?.name || "Screenshot Editor" }),
        /* @__PURE__ */ u3(
          "button",
          {
            onClick: onShowProjectModal,
            class: "p-2 hover:bg-zinc-800 rounded",
            title: "Manage Projects",
            children: /* @__PURE__ */ u3("i", { class: "fa-solid fa-folder text-zinc-400" })
          }
        )
      ] }),
      /* @__PURE__ */ u3(
        "select",
        {
          value: currentProject ?? "",
          onChange: (e3) => onSwitchProject(e3.target.value),
          class: "w-full px-3 py-2 rounded text-sm bg-zinc-800 border border-zinc-700",
          children: projects.map((p3) => /* @__PURE__ */ u3("option", { value: p3.id, children: p3.name }, p3.id))
        }
      )
    ] }),
    /* @__PURE__ */ u3("div", { class: "px-4 pt-3 pb-2 border-b border-zinc-800", children: /* @__PURE__ */ u3("div", { class: "flex gap-1 flex-wrap", children: [
      languages.map((lang) => /* @__PURE__ */ u3(
        "button",
        {
          onClick: () => onSelectLang(lang.language),
          class: `px-3 py-1.5 rounded text-xs uppercase font-medium ${selectedLang === lang.language ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`,
          children: lang.language
        },
        lang.language
      )),
      /* @__PURE__ */ u3(
        "button",
        {
          onClick: () => {
            const lang = prompt("Enter language code (e.g., fr, de, es):");
            if (lang) {
              const copyFrom = confirm("Copy screenshots from current language?") ? selectedLang : null;
              onAddLanguage(lang, copyFrom);
            }
          },
          class: "px-2 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 rounded",
          title: "Add Language",
          children: /* @__PURE__ */ u3("i", { class: "fa-solid fa-plus" })
        }
      )
    ] }) }),
    /* @__PURE__ */ u3("div", { class: "px-4 pt-3 pb-2 border-b border-zinc-800", children: /* @__PURE__ */ u3("div", { class: "flex gap-2", children: [
      ["android", "ios"].map((platform) => /* @__PURE__ */ u3(
        "button",
        {
          onClick: () => onSelectPlatform(platform),
          class: `flex-1 py-2 rounded text-sm font-medium flex items-center justify-center gap-2 ${selectedPlatform === platform ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`,
          children: [
            /* @__PURE__ */ u3("i", { class: `fa-brands fa-${platform === "ios" ? "apple" : "android"}` }),
            platform === "ios" ? "iOS" : "Android"
          ]
        },
        platform
      )),
      /* @__PURE__ */ u3(
        "button",
        {
          onClick: () => {
            const sourcePlatform = selectedPlatform;
            const targetPlatform = sourcePlatform === "android" ? "ios" : "android";
            if (confirm(`Copy all ${sourcePlatform} screenshots to ${targetPlatform}? This will replace existing ${targetPlatform} screenshots.`)) {
              onCopyPlatformConfig(sourcePlatform, targetPlatform);
            }
          },
          class: "px-2 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 rounded",
          title: `Copy ${selectedPlatform} screenshots to ${selectedPlatform === "android" ? "iOS" : "Android"}`,
          children: /* @__PURE__ */ u3("i", { class: "fa-solid fa-clone" })
        }
      )
    ] }) }),
    /* @__PURE__ */ u3("div", { class: "flex-1 overflow-y-auto p-4 space-y-2", children: [
      /* @__PURE__ */ u3("div", { class: "text-xs text-zinc-500 uppercase tracking-wider mb-2", children: "Screenshots" }),
      screenshots.map((screenshot, index) => /* @__PURE__ */ u3(
        "div",
        {
          class: `p-3 rounded border ${selectedItem?.type === "screenshot" && selectedItem.id === screenshot.id ? "bg-indigo-900/50 border-indigo-500" : "bg-zinc-800/50 border-transparent hover:bg-zinc-800"}`,
          children: confirmDeleteId === screenshot.id ? (
            // Inline delete confirmation
            /* @__PURE__ */ u3("div", { class: "text-center", children: [
              /* @__PURE__ */ u3("p", { class: "text-sm text-red-400 mb-2", children: "Delete this screenshot?" }),
              /* @__PURE__ */ u3("div", { class: "flex gap-2 justify-center", children: [
                /* @__PURE__ */ u3(
                  "button",
                  {
                    onClick: () => {
                      onDeleteScreenshot(screenshot.id);
                      setConfirmDeleteId(null);
                    },
                    class: "px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm",
                    children: "Delete"
                  }
                ),
                /* @__PURE__ */ u3(
                  "button",
                  {
                    onClick: () => setConfirmDeleteId(null),
                    class: "px-3 py-1 bg-zinc-600 hover:bg-zinc-500 rounded text-sm",
                    children: "Cancel"
                  }
                )
              ] })
            ] })
          ) : (
            // Normal view
            /* @__PURE__ */ u3(
              "div",
              {
                onClick: () => onSelectItem({ type: "screenshot", id: screenshot.id }),
                class: "flex justify-between items-start gap-2 cursor-pointer",
                children: [
                  /* @__PURE__ */ u3("div", { class: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ u3("div", { class: "text-xs text-zinc-500 mb-1", children: [
                      "#",
                      index + 1
                    ] }),
                    /* @__PURE__ */ u3("div", { class: "font-medium text-sm truncate", children: screenshot.headline || `Screenshot ${index + 1}` }),
                    screenshot.subtitle && /* @__PURE__ */ u3("div", { class: "text-xs text-zinc-400 truncate", children: screenshot.subtitle })
                  ] }),
                  /* @__PURE__ */ u3(
                    "button",
                    {
                      onClick: (e3) => {
                        e3.stopPropagation();
                        setConfirmDeleteId(screenshot.id);
                      },
                      class: "text-zinc-500 hover:text-red-400 text-lg flex-shrink-0",
                      children: /* @__PURE__ */ u3("i", { class: "fa-solid fa-xmark" })
                    }
                  )
                ]
              }
            )
          )
        },
        screenshot.id
      )),
      /* @__PURE__ */ u3(
        "button",
        {
          onClick: onAddScreenshot,
          class: "w-full py-2 text-xs bg-zinc-800 rounded hover:bg-zinc-700 border border-dashed border-zinc-600",
          children: [
            /* @__PURE__ */ u3("i", { class: "fa-solid fa-plus mr-1" }),
            " Add Screenshot"
          ]
        }
      ),
      selectedPlatform === "android" && /* @__PURE__ */ u3(g, { children: [
        /* @__PURE__ */ u3("div", { class: "text-xs text-zinc-500 uppercase tracking-wider mt-4 mb-2", children: "Feature Graphic" }),
        /* @__PURE__ */ u3(
          "div",
          {
            onClick: () => onSelectItem({ type: "feature-graphic" }),
            class: `p-3 rounded cursor-pointer ${selectedItem?.type === "feature-graphic" ? "bg-indigo-600/20 border border-indigo-500/50" : "bg-zinc-800/50 hover:bg-zinc-800 border border-transparent"}`,
            children: [
              /* @__PURE__ */ u3("div", { class: "text-sm font-medium", children: featureGraphic?.headline || "Feature Graphic" }),
              featureGraphic?.subtitle && /* @__PURE__ */ u3("div", { class: "text-xs text-zinc-500 truncate", children: featureGraphic.subtitle })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ u3("div", { class: "p-3 border-t border-zinc-800", children: /* @__PURE__ */ u3(
      "button",
      {
        onClick: onShowThemeEditor,
        class: "w-full p-3 rounded bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 text-left group",
        children: /* @__PURE__ */ u3("div", { class: "flex items-center justify-between", children: [
          /* @__PURE__ */ u3("div", { class: "flex items-center gap-3", children: [
            /* @__PURE__ */ u3("i", { class: "fa-solid fa-palette text-purple-400" }),
            /* @__PURE__ */ u3("div", { children: [
              /* @__PURE__ */ u3("div", { class: "text-sm font-medium", children: "Theme & Colors" }),
              /* @__PURE__ */ u3("div", { class: "text-xs text-zinc-500", children: "Palette, gradients, fonts" })
            ] })
          ] }),
          /* @__PURE__ */ u3("i", { class: "fa-solid fa-chevron-right text-zinc-600 group-hover:text-zinc-400 text-xs" })
        ] })
      }
    ) }),
    /* @__PURE__ */ u3("div", { class: "p-3 border-t border-zinc-800", children: /* @__PURE__ */ u3(
      "button",
      {
        onClick: onShowMediaManager,
        class: "w-full p-3 rounded bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 text-left group",
        children: /* @__PURE__ */ u3("div", { class: "flex items-center justify-between", children: [
          /* @__PURE__ */ u3("div", { class: "flex items-center gap-3", children: [
            /* @__PURE__ */ u3("i", { class: "fa-solid fa-images text-indigo-400" }),
            /* @__PURE__ */ u3("div", { children: [
              /* @__PURE__ */ u3("div", { class: "text-sm font-medium", children: "Media Library" }),
              /* @__PURE__ */ u3("div", { class: "text-xs text-zinc-500", children: [
                assetCount,
                " files"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ u3("i", { class: "fa-solid fa-chevron-right text-zinc-600 group-hover:text-zinc-400 text-xs" })
        ] })
      }
    ) }),
    /* @__PURE__ */ u3("div", { class: "p-4 border-t border-zinc-800 space-y-2", children: [
      /* @__PURE__ */ u3(
        "button",
        {
          onClick: onGenerate,
          disabled: generating,
          class: `w-full py-3 rounded font-medium flex items-center justify-center gap-2 ${generating ? "bg-zinc-700 text-zinc-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500 text-white"}`,
          children: generating ? /* @__PURE__ */ u3(g, { children: [
            /* @__PURE__ */ u3("i", { class: "fa-solid fa-spinner fa-spin" }),
            "Generating..."
          ] }) : /* @__PURE__ */ u3(g, { children: [
            /* @__PURE__ */ u3("i", { class: "fa-solid fa-wand-magic-sparkles" }),
            "Generate All"
          ] })
        }
      ),
      lastGenerated && onViewLastGenerated && /* @__PURE__ */ u3(
        "button",
        {
          onClick: onViewLastGenerated,
          class: "w-full py-2 bg-zinc-700 hover:bg-zinc-600 rounded text-sm font-medium flex items-center justify-center gap-2",
          children: [
            /* @__PURE__ */ u3("i", { class: "fa-solid fa-images" }),
            "View Last Results (",
            lastGenerated.results.length,
            ")"
          ]
        }
      )
    ] })
  ] });
}

// src/ui/components/Preview.tsx
function Preview({ url, type = "screenshot", version }) {
  const containerRef = _(null);
  const iframeRef = _(null);
  const [scale, setScale] = h2(0.3);
  p2(() => {
    if (!containerRef.current || !url)
      return;
    const calculateScale = () => {
      const container = containerRef.current;
      if (!container)
        return;
      const rect = container.getBoundingClientRect();
      const containerWidth = rect.width - 40;
      const containerHeight = rect.height - 40;
      if (containerWidth <= 0 || containerHeight <= 0)
        return;
      let contentWidth, contentHeight;
      if (type === "feature-graphic") {
        contentWidth = 1024;
        contentHeight = 500;
      } else {
        contentWidth = 1242;
        contentHeight = 2688;
      }
      const scaleX = containerWidth / contentWidth;
      const scaleY = containerHeight / contentHeight;
      const newScale = Math.min(scaleX, scaleY);
      setScale(Math.max(0.1, newScale));
    };
    calculateScale();
    const timeout = setTimeout(calculateScale, 100);
    const observer = new ResizeObserver(calculateScale);
    observer.observe(containerRef.current);
    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [url, type]);
  p2(() => {
    if (iframeRef.current && url) {
      iframeRef.current.src = url + "?v=" + version + "&t=" + Date.now();
    }
  }, [version, url]);
  if (!url) {
    return /* @__PURE__ */ u3("div", { class: "text-zinc-500", children: "No preview available" });
  }
  const width = type === "feature-graphic" ? 1024 : 1242;
  const height = type === "feature-graphic" ? 500 : 2688;
  return /* @__PURE__ */ u3(
    "div",
    {
      ref: containerRef,
      class: "w-full h-full flex items-center justify-center",
      children: /* @__PURE__ */ u3(
        "div",
        {
          class: "relative bg-black rounded-lg overflow-hidden shadow-2xl",
          style: {
            width: width * scale + "px",
            height: height * scale + "px"
          },
          children: /* @__PURE__ */ u3(
            "iframe",
            {
              ref: iframeRef,
              src: url + "?v=" + version + "&t=" + Date.now(),
              class: "preview-iframe",
              style: {
                width: width + "px",
                height: height + "px",
                transform: `scale(${scale})`,
                transformOrigin: "top left"
              }
            }
          )
        }
      )
    }
  );
}

// src/ui/components/inputs/NumberInput.tsx
function NumberInput({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className = ""
}) {
  const decrement = () => {
    const newVal = Math.max(min, (value || 0) - step);
    onChange(newVal);
  };
  const increment = () => {
    const newVal = Math.min(max, (value || 0) + step);
    onChange(newVal);
  };
  const handleInput = (e3) => {
    const target = e3.target;
    const newVal = Number(target.value);
    if (!isNaN(newVal)) {
      onChange(Math.max(min, Math.min(max, newVal)));
    }
  };
  return /* @__PURE__ */ u3("div", { class: `flex items-stretch h-8 ${className}`, children: [
    /* @__PURE__ */ u3(
      "button",
      {
        type: "button",
        onClick: decrement,
        class: "px-2 bg-zinc-700 hover:bg-zinc-600 rounded-l text-zinc-300 hover:text-white transition-colors flex items-center justify-center",
        children: /* @__PURE__ */ u3("i", { class: "fa-solid fa-minus text-xs" })
      }
    ),
    /* @__PURE__ */ u3(
      "input",
      {
        type: "number",
        value,
        onInput: handleInput,
        min,
        max,
        step,
        class: "w-full px-2 text-sm text-center bg-zinc-800 border-y border-zinc-700 focus:outline-none focus:border-indigo-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      }
    ),
    /* @__PURE__ */ u3(
      "button",
      {
        type: "button",
        onClick: increment,
        class: "px-2 bg-zinc-700 hover:bg-zinc-600 rounded-r text-zinc-300 hover:text-white transition-colors flex items-center justify-center",
        children: /* @__PURE__ */ u3("i", { class: "fa-solid fa-plus text-xs" })
      }
    )
  ] });
}

// src/ui/components/inputs/ColorInput.tsx
var COMMON_COLORS = [
  "#ffffff",
  "#f5f5f5",
  "#d4d4d4",
  "#a3a3a3",
  "#737373",
  "#525252",
  "#262626",
  "#000000",
  "#fef2f2",
  "#fee2e2",
  "#fecaca",
  "#f87171",
  "#ef4444",
  "#dc2626",
  "#b91c1c",
  "#7f1d1d",
  "#fef9c3",
  "#fef08a",
  "#fde047",
  "#facc15",
  "#eab308",
  "#ca8a04",
  "#a16207",
  "#713f12",
  "#dcfce7",
  "#bbf7d0",
  "#86efac",
  "#4ade80",
  "#22c55e",
  "#16a34a",
  "#15803d",
  "#14532d",
  "#e0f2fe",
  "#bae6fd",
  "#7dd3fc",
  "#38bdf8",
  "#0ea5e9",
  "#0284c7",
  "#0369a1",
  "#0c4a6e",
  "#ede9fe",
  "#ddd6fe",
  "#c4b5fd",
  "#a78bfa",
  "#8b5cf6",
  "#7c3aed",
  "#6d28d9",
  "#4c1d95",
  "#fce7f3",
  "#fbcfe8",
  "#f9a8d4",
  "#f472b6",
  "#ec4899",
  "#db2777",
  "#be185d",
  "#9d174d"
];
function ColorInput({
  value,
  onChange,
  palette = null,
  className = ""
}) {
  const [isOpen, setIsOpen] = h2(false);
  const [hexInput, setHexInput] = h2(value || "#ffffff");
  const containerRef = _(null);
  p2(() => {
    setHexInput(value || "#ffffff");
  }, [value]);
  p2(() => {
    const handleClickOutside = (e3) => {
      if (containerRef.current && !containerRef.current.contains(e3.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);
  const handleHexChange = (e3) => {
    const newValue = e3.target.value;
    setHexInput(newValue);
    if (/^#[0-9A-Fa-f]{6}$/.test(newValue)) {
      onChange(newValue);
    }
  };
  const handleHexBlur = () => {
    if (!/^#[0-9A-Fa-f]{6}$/.test(hexInput)) {
      setHexInput(value || "#ffffff");
    }
  };
  const selectColor = (color) => {
    onChange(color);
    setHexInput(color);
    setIsOpen(false);
  };
  return /* @__PURE__ */ u3("div", { ref: containerRef, class: `relative ${className}`, children: [
    /* @__PURE__ */ u3("div", { class: "flex items-stretch h-8 min-w-0", children: [
      /* @__PURE__ */ u3(
        "button",
        {
          type: "button",
          onClick: () => setIsOpen(!isOpen),
          class: "w-10 rounded-l border border-zinc-700 hover:border-zinc-500 transition-colors flex-shrink-0",
          style: { backgroundColor: value || "#ffffff" },
          title: "Click to open color picker"
        }
      ),
      /* @__PURE__ */ u3(
        "input",
        {
          type: "text",
          value: hexInput,
          onInput: handleHexChange,
          onBlur: handleHexBlur,
          maxLength: 7,
          class: "flex-1 min-w-0 px-2 text-sm bg-zinc-800 border-y border-r border-zinc-700 rounded-r focus:outline-none focus:border-indigo-500 font-mono uppercase",
          placeholder: "#ffffff"
        }
      )
    ] }),
    isOpen && /* @__PURE__ */ u3("div", { class: "absolute z-50 mt-1 p-3 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl w-64 left-0", children: [
      palette && /* @__PURE__ */ u3("div", { class: "mb-3", children: [
        /* @__PURE__ */ u3("div", { class: "text-xs text-zinc-500 mb-1.5", children: "Palette" }),
        /* @__PURE__ */ u3("div", { class: "flex gap-1.5", children: [
          /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              onClick: () => selectColor(palette.primary),
              class: "flex-1 h-8 rounded border border-zinc-600 hover:border-zinc-400 transition-colors",
              style: { backgroundColor: palette.primary },
              title: "Primary"
            }
          ),
          /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              onClick: () => selectColor(palette.secondary),
              class: "flex-1 h-8 rounded border border-zinc-600 hover:border-zinc-400 transition-colors",
              style: { backgroundColor: palette.secondary },
              title: "Secondary"
            }
          ),
          /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              onClick: () => selectColor(palette.accent),
              class: "flex-1 h-8 rounded border border-zinc-600 hover:border-zinc-400 transition-colors",
              style: { backgroundColor: palette.accent },
              title: "Accent"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ u3("div", { children: [
        /* @__PURE__ */ u3("div", { class: "text-xs text-zinc-500 mb-1.5", children: "Colors" }),
        /* @__PURE__ */ u3("div", { class: "grid grid-cols-8 gap-1", children: COMMON_COLORS.map((color) => /* @__PURE__ */ u3(
          "button",
          {
            type: "button",
            onClick: () => selectColor(color),
            class: `w-6 h-6 rounded border transition-colors ${color === value ? "border-white ring-1 ring-white" : "border-zinc-600 hover:border-zinc-400"}`,
            style: { backgroundColor: color },
            title: color
          }
        )) })
      ] })
    ] })
  ] });
}

// src/ui/components/inputs/Slider.tsx
function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "",
  showValue = true
}) {
  const displayValue = typeof value === "number" ? Number.isInteger(value) ? value : value.toFixed(step < 1 ? 2 : 0) : value;
  return /* @__PURE__ */ u3("div", { children: [
    /* @__PURE__ */ u3("div", { class: "flex justify-between items-center mb-1", children: [
      /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500", children: label }),
      showValue && /* @__PURE__ */ u3("span", { class: "text-xs text-zinc-400", children: [
        displayValue,
        unit
      ] })
    ] }),
    /* @__PURE__ */ u3(
      "input",
      {
        type: "range",
        min,
        max,
        step,
        value,
        onInput: (e3) => onChange(Number(e3.target.value)),
        class: "w-full"
      }
    )
  ] });
}

// src/ui/components/inputs/LabeledColorInput.tsx
function LabeledColorInput({
  label,
  value,
  onChange,
  placeholder = "rgba(255,255,255,0.15)"
}) {
  return /* @__PURE__ */ u3("div", { children: [
    /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: label }),
    /* @__PURE__ */ u3("div", { class: "flex gap-2", children: [
      /* @__PURE__ */ u3(
        "div",
        {
          class: "w-9 h-9 rounded border border-zinc-700 flex-shrink-0",
          style: { background: value || placeholder }
        }
      ),
      /* @__PURE__ */ u3(
        "input",
        {
          type: "text",
          value: value || "",
          onInput: (e3) => onChange(e3.target.value),
          class: "flex-1 px-3 py-2 rounded text-sm font-mono",
          placeholder
        }
      )
    ] })
  ] });
}

// src/ui/components/inputs/ImageSelect.tsx
function ImageSelect({
  value,
  onChange,
  options,
  category,
  onAssetsRefresh,
  label,
  placeholder = "Select image..."
}) {
  const fileInputRef = _(null);
  const [uploading, setUploading] = h2(false);
  const handleUpload = async (e3) => {
    const file = e3.target.files?.[0];
    if (!file)
      return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category || "screenshots");
    try {
      const res = await fetch("/api/assets/upload", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        if (onAssetsRefresh)
          await onAssetsRefresh();
        onChange(data.path);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  return /* @__PURE__ */ u3("div", { children: [
    label && /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: label }),
    /* @__PURE__ */ u3("div", { class: "flex gap-2", children: [
      /* @__PURE__ */ u3(
        "select",
        {
          value: value || "",
          onChange: (e3) => onChange(e3.target.value),
          class: "flex-1 px-3 py-2 rounded text-sm",
          children: [
            /* @__PURE__ */ u3("option", { value: "", children: placeholder }),
            options.map((p3) => /* @__PURE__ */ u3("option", { value: p3, children: p3.split("/").pop() }, p3))
          ]
        }
      ),
      /* @__PURE__ */ u3(
        "input",
        {
          ref: fileInputRef,
          type: "file",
          accept: "image/*",
          onChange: handleUpload,
          class: "hidden"
        }
      ),
      /* @__PURE__ */ u3(
        "button",
        {
          onClick: () => fileInputRef.current?.click(),
          disabled: uploading,
          class: "px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded text-sm disabled:opacity-50",
          title: "Upload new image",
          children: /* @__PURE__ */ u3("i", { class: "fa-solid fa-upload" })
        }
      )
    ] })
  ] });
}

// src/ui/components/CollapsibleSection.tsx
function CollapsibleSection({
  title,
  defaultOpen = true,
  children
}) {
  const [isOpen, setIsOpen] = h2(defaultOpen);
  return /* @__PURE__ */ u3("div", { class: "border border-zinc-800 rounded-lg overflow-hidden", children: [
    /* @__PURE__ */ u3(
      "div",
      {
        class: "section-header flex items-center justify-between px-3 py-2 bg-zinc-800/50",
        onClick: () => setIsOpen(!isOpen),
        children: [
          /* @__PURE__ */ u3("h3", { class: "text-sm font-medium text-zinc-300", children: title }),
          /* @__PURE__ */ u3(
            "i",
            {
              class: `fa-solid fa-chevron-down text-zinc-400 text-xs transition-transform ${isOpen ? "rotate-180" : ""}`
            }
          )
        ]
      }
    ),
    isOpen && /* @__PURE__ */ u3("div", { class: "p-3 space-y-3 bg-zinc-900/50", children })
  ] });
}

// src/ui/components/editors/GlowEditorInline.tsx
var GLOW_COLORS = {
  purple: "#a855f7",
  blue: "#6366f1",
  pink: "#ec4899",
  orange: "#f97316",
  green: "#22c55e",
  red: "#ef4444",
  yellow: "#eab308",
  cyan: "#06b6d4"
};
function GlowEditorInline({ glows = [], onChange, palette }) {
  const defaultPalette = { primary: "#a855f7", secondary: "#6366f1", accent: "#ec4899" };
  const p3 = palette || defaultPalette;
  const addGlow = () => {
    onChange([...glows, { color: p3.primary, size: 400, top: "20%", left: "20%" }]);
  };
  const updateGlow = (index, updates) => {
    const newGlows = [...glows];
    newGlows[index] = { ...newGlows[index], ...updates };
    onChange(newGlows);
  };
  const removeGlow = (index) => {
    onChange(glows.filter((_2, i4) => i4 !== index));
  };
  const getColorValue = (color) => {
    if (color.startsWith("#"))
      return color;
    return GLOW_COLORS[color] || "#a855f7";
  };
  return /* @__PURE__ */ u3("div", { class: "space-y-3", children: [
    glows.map((glow, i4) => /* @__PURE__ */ u3("div", { class: "p-3 bg-zinc-800/50 rounded space-y-2", children: [
      /* @__PURE__ */ u3("div", { class: "flex justify-between items-center", children: [
        /* @__PURE__ */ u3("span", { class: "text-xs text-zinc-400", children: [
          "Glow ",
          i4 + 1
        ] }),
        /* @__PURE__ */ u3(
          "button",
          {
            onClick: () => removeGlow(i4),
            class: "text-zinc-500 hover:text-red-400",
            children: /* @__PURE__ */ u3("i", { class: "fa-solid fa-xmark" })
          }
        )
      ] }),
      /* @__PURE__ */ u3("div", { class: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ u3("div", { children: [
          /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Color" }),
          /* @__PURE__ */ u3(
            ColorInput,
            {
              value: getColorValue(glow.color),
              onChange: (v3) => updateGlow(i4, { color: v3 }),
              palette: p3
            }
          )
        ] }),
        /* @__PURE__ */ u3("div", { children: [
          /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Size" }),
          /* @__PURE__ */ u3(
            NumberInput,
            {
              value: glow.size,
              onChange: (v3) => updateGlow(i4, { size: v3 }),
              min: 50,
              max: 1e3,
              step: 50
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ u3("div", { class: "grid grid-cols-4 gap-2", children: ["top", "right", "bottom", "left"].map((pos) => /* @__PURE__ */ u3("div", { children: [
        /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: pos }),
        /* @__PURE__ */ u3(
          "input",
          {
            type: "text",
            value: glow[pos] || "",
            onInput: (e3) => updateGlow(i4, { [pos]: e3.target.value || void 0 }),
            placeholder: "-",
            class: "w-full px-2 py-1 rounded text-xs"
          }
        )
      ] }, pos)) })
    ] }, i4)),
    /* @__PURE__ */ u3(
      "button",
      {
        onClick: addGlow,
        class: "w-full py-2 text-xs bg-zinc-800 rounded hover:bg-zinc-700 border border-dashed border-zinc-600",
        children: [
          /* @__PURE__ */ u3("i", { class: "fa-solid fa-plus mr-1" }),
          " Add Glow Effect"
        ]
      }
    )
  ] });
}

// src/ui/components/editors/ShapeEditorInline.tsx
var SHAPE_TYPES = [
  { value: "circle", label: "Circle", icon: "fa-circle" },
  { value: "ring", label: "Ring", icon: "fa-circle-notch" },
  { value: "rectangle", label: "Rectangle", icon: "fa-square" },
  { value: "pill", label: "Pill", icon: "fa-capsules" },
  { value: "curved-line", label: "Curved Line", icon: "fa-bezier-curve" },
  { value: "s-curve", label: "S-Curve", icon: "fa-wave-square" },
  { value: "wave-line", label: "Wave Line", icon: "fa-water" },
  { value: "chevron", label: "Chevron", icon: "fa-chevron-right" },
  { value: "double-chevron", label: "Double Chevron", icon: "fa-angles-right" },
  { value: "arrow", label: "Arrow", icon: "fa-arrow-right" },
  { value: "triangle", label: "Triangle", icon: "fa-play" },
  { value: "diamond", label: "Diamond", icon: "fa-diamond" },
  { value: "hexagon", label: "Hexagon", icon: "fa-hexagon-nodes" },
  { value: "star", label: "Star", icon: "fa-star" },
  { value: "sparkle", label: "Sparkle", icon: "fa-sparkles" },
  { value: "cross", label: "Cross", icon: "fa-plus" },
  { value: "blob", label: "Blob", icon: "fa-cloud" },
  { value: "crescent", label: "Crescent", icon: "fa-moon" },
  { value: "dots-grid", label: "Dots Grid", icon: "fa-grip" },
  { value: "scattered-dots", label: "Scattered Dots", icon: "fa-ellipsis" }
];
var SHAPE_PRESETS = [
  {
    name: "Nested Rings",
    shapes: [
      { type: "ring", size: 50, color: "#ffffff", opacity: 0.08, strokeWidth: 2, posX: 70, posY: 50, zIndex: 0 },
      { type: "ring", size: 35, color: "#ffffff", opacity: 0.12, strokeWidth: 1.5, posX: 70, posY: 50, zIndex: 0 }
    ]
  },
  {
    name: "Corner Chevron",
    shapes: [
      { type: "chevron", size: 15, color: "#ffffff", opacity: 0.2, strokeWidth: 3, direction: "right", posX: 90, posY: 20, zIndex: 5 }
    ]
  },
  {
    name: "Floating Arc",
    shapes: [
      { type: "curved-line", size: 60, color: "#ffffff", opacity: 0.15, strokeWidth: 2, orientation: "horizontal", curvature: 30, posX: 50, posY: 80, zIndex: 0 }
    ]
  },
  {
    name: "Dot Pattern",
    shapes: [
      { type: "dots-grid", size: 40, color: "#ffffff", opacity: 0.1, rows: 4, columns: 4, spacing: 8, dotSize: 1, posX: 85, posY: 15, zIndex: 0 }
    ]
  }
];
function ShapeEditorInline({ shapes = [], onChange, palette }) {
  const defaultPalette = { primary: "#a855f7", secondary: "#6366f1", accent: "#ec4899" };
  const p3 = palette || defaultPalette;
  const [showPresets, setShowPresets] = h2(false);
  const presetButtonRef = _(null);
  const presetMenuRef = _(null);
  const [presetMenuStyle, setPresetMenuStyle] = h2({});
  const addShape = (type = "ring") => {
    const newShape = {
      type,
      size: 30,
      color: p3.primary,
      opacity: 0.15,
      strokeWidth: 2,
      filled: false,
      posX: 50,
      posY: 50,
      zIndex: 5
    };
    onChange([...shapes, newShape]);
  };
  const addPreset = (preset) => {
    onChange([...shapes, ...preset.shapes.map((s3) => ({ ...s3 }))]);
    setShowPresets(false);
  };
  const updateShape = (index, updates) => {
    const newShapes = [...shapes];
    newShapes[index] = { ...newShapes[index], ...updates };
    onChange(newShapes);
  };
  const removeShape = (index) => {
    onChange(shapes.filter((_2, i4) => i4 !== index));
  };
  const duplicateShape = (index) => {
    const newShapes = [...shapes];
    const copy = { ...newShapes[index] };
    copy.posX = ((copy.posX ?? 50) + 5) % 100;
    copy.posY = ((copy.posY ?? 50) + 5) % 100;
    newShapes.splice(index + 1, 0, copy);
    onChange(newShapes);
  };
  const updatePresetMenuPosition = () => {
    if (!presetButtonRef.current)
      return;
    const rect = presetButtonRef.current.getBoundingClientRect();
    const menuWidth = Math.max(rect.width, 260);
    const horizontalPadding = 8;
    const verticalGap = 6;
    const estimatedMenuHeight = Math.min(320, 40 + SHAPE_PRESETS.length * 46);
    const spaceBelow = innerHeight - rect.bottom;
    const openUp = spaceBelow < estimatedMenuHeight && rect.top > spaceBelow;
    const left = Math.min(
      Math.max(horizontalPadding, rect.left),
      innerWidth - menuWidth - horizontalPadding
    );
    setPresetMenuStyle({
      position: "fixed",
      zIndex: "60",
      left: left + "px",
      width: menuWidth + "px",
      maxHeight: "320px",
      ...openUp ? { bottom: innerHeight - rect.top + verticalGap + "px" } : { top: rect.bottom + verticalGap + "px" }
    });
  };
  p2(() => {
    if (!showPresets)
      return;
    const handleClickOutside = (e3) => {
      if (presetButtonRef.current?.contains(e3.target))
        return;
      if (presetMenuRef.current?.contains(e3.target))
        return;
      setShowPresets(false);
    };
    const handleKeyDown = (e3) => {
      if (e3.key === "Escape")
        setShowPresets(false);
    };
    const handleViewportChange = () => updatePresetMenuPosition();
    updatePresetMenuPosition();
    addEventListener("mousedown", handleClickOutside);
    addEventListener("keydown", handleKeyDown);
    addEventListener("resize", handleViewportChange);
    addEventListener("scroll", handleViewportChange, true);
    return () => {
      removeEventListener("mousedown", handleClickOutside);
      removeEventListener("keydown", handleKeyDown);
      removeEventListener("resize", handleViewportChange);
      removeEventListener("scroll", handleViewportChange, true);
    };
  }, [showPresets]);
  const renderShapeControls = (shape, index) => {
    const type = shape.type;
    const isLine = ["curved-line", "s-curve", "wave-line"].includes(type);
    const isChevron = ["chevron", "double-chevron", "arrow"].includes(type);
    const isStar = ["star", "sparkle"].includes(type);
    const isPattern = ["dots-grid", "scattered-dots"].includes(type);
    const isBlob = type === "blob";
    const isCrescent = type === "crescent";
    const hasFill = !isLine && !isChevron;
    const hasStroke = ["ring", "rectangle", "pill", "curved-line", "s-curve", "wave-line", "chevron", "double-chevron", "arrow", "triangle", "diamond", "hexagon", "star", "sparkle", "cross"].includes(type);
    return /* @__PURE__ */ u3(g, { children: [
      /* @__PURE__ */ u3("div", { class: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ u3("div", { children: [
          /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Color" }),
          /* @__PURE__ */ u3(
            ColorInput,
            {
              value: shape.color || "#ffffff",
              onChange: (v3) => updateShape(index, { color: v3 }),
              palette: p3
            }
          )
        ] }),
        /* @__PURE__ */ u3("div", { children: [
          /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Size %" }),
          /* @__PURE__ */ u3(
            NumberInput,
            {
              value: shape.size ?? 30,
              onChange: (v3) => updateShape(index, { size: v3 }),
              min: 1,
              max: 500,
              step: 5
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ u3("div", { class: "grid grid-cols-3 gap-2", children: [
        /* @__PURE__ */ u3("div", { children: [
          /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Opacity" }),
          /* @__PURE__ */ u3(
            "input",
            {
              type: "range",
              value: (shape.opacity ?? 0.2) * 100,
              onInput: (e3) => updateShape(index, { opacity: Number(e3.target.value) / 100 }),
              min: "0",
              max: "100",
              class: "w-full"
            }
          ),
          /* @__PURE__ */ u3("div", { class: "text-xs text-zinc-500 text-center", children: [
            Math.round((shape.opacity ?? 0.2) * 100),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ u3("div", { children: [
          /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Blur" }),
          /* @__PURE__ */ u3(
            NumberInput,
            {
              value: shape.blur ?? 0,
              onChange: (v3) => updateShape(index, { blur: v3 }),
              min: 0,
              max: 50
            }
          )
        ] }),
        /* @__PURE__ */ u3("div", { children: [
          /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Z-Index" }),
          /* @__PURE__ */ u3(
            "select",
            {
              value: shape.zIndex ?? 5,
              onChange: (e3) => updateShape(index, { zIndex: Number(e3.target.value) }),
              class: "w-full h-8 px-2 rounded text-sm bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-indigo-500",
              children: [
                /* @__PURE__ */ u3("option", { value: 0, children: "Behind (0)" }),
                /* @__PURE__ */ u3("option", { value: 5, children: "Default (5)" }),
                /* @__PURE__ */ u3("option", { value: 10, children: "Front (10)" }),
                /* @__PURE__ */ u3("option", { value: 15, children: "Above All (15)" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ u3("div", { class: "space-y-2", children: [
        /* @__PURE__ */ u3("div", { children: [
          /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: [
            "X Position ",
            /* @__PURE__ */ u3("span", { class: "text-zinc-600", children: "(\u2190 0 | 50 center | 100 \u2192)" })
          ] }),
          /* @__PURE__ */ u3("div", { class: "flex items-center gap-2", children: [
            /* @__PURE__ */ u3(
              "input",
              {
                type: "range",
                value: shape.posX ?? 50,
                onInput: (e3) => updateShape(index, { posX: Number(e3.target.value) }),
                min: "0",
                max: "100",
                class: "flex-1"
              }
            ),
            /* @__PURE__ */ u3(
              "input",
              {
                type: "number",
                value: shape.posX ?? 50,
                onInput: (e3) => updateShape(index, { posX: Number(e3.target.value) }),
                min: 0,
                max: 100,
                class: "w-14 px-1 py-0.5 rounded text-xs text-center"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ u3("div", { children: [
          /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: [
            "Y Position ",
            /* @__PURE__ */ u3("span", { class: "text-zinc-600", children: "(\u2191 0 | 50 center | 100 \u2193)" })
          ] }),
          /* @__PURE__ */ u3("div", { class: "flex items-center gap-2", children: [
            /* @__PURE__ */ u3(
              "input",
              {
                type: "range",
                value: shape.posY ?? 50,
                onInput: (e3) => updateShape(index, { posY: Number(e3.target.value) }),
                min: "0",
                max: "100",
                class: "flex-1"
              }
            ),
            /* @__PURE__ */ u3(
              "input",
              {
                type: "number",
                value: shape.posY ?? 50,
                onInput: (e3) => updateShape(index, { posY: Number(e3.target.value) }),
                min: 0,
                max: 100,
                class: "w-14 px-1 py-0.5 rounded text-xs text-center"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ u3("div", { class: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ u3("div", { children: [
          /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Rotation" }),
          /* @__PURE__ */ u3("div", { class: "flex items-center gap-2", children: [
            /* @__PURE__ */ u3(
              "input",
              {
                type: "range",
                value: shape.rotation ?? 0,
                onInput: (e3) => updateShape(index, { rotation: Number(e3.target.value) }),
                min: "-180",
                max: "180",
                class: "flex-1"
              }
            ),
            /* @__PURE__ */ u3("span", { class: "text-xs text-zinc-400 w-10", children: [
              shape.rotation ?? 0,
              "\xB0"
            ] })
          ] })
        ] }),
        hasFill && /* @__PURE__ */ u3("div", { children: [
          /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Style" }),
          /* @__PURE__ */ u3("div", { class: "flex gap-1", children: [
            /* @__PURE__ */ u3(
              "button",
              {
                onClick: () => updateShape(index, { filled: false }),
                class: `flex-1 px-2 py-1 rounded text-xs ${!shape.filled ? "bg-indigo-600" : "bg-zinc-800"}`,
                children: "Outline"
              }
            ),
            /* @__PURE__ */ u3(
              "button",
              {
                onClick: () => updateShape(index, { filled: true }),
                class: `flex-1 px-2 py-1 rounded text-xs ${shape.filled ? "bg-indigo-600" : "bg-zinc-800"}`,
                children: "Filled"
              }
            )
          ] })
        ] })
      ] }),
      hasStroke && !shape.filled && /* @__PURE__ */ u3("div", { children: [
        /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Stroke Width" }),
        /* @__PURE__ */ u3(
          "input",
          {
            type: "range",
            value: shape.strokeWidth ?? 2,
            onInput: (e3) => updateShape(index, { strokeWidth: Number(e3.target.value) }),
            min: 0.25,
            max: 20,
            step: 0.25,
            class: "w-full"
          }
        ),
        /* @__PURE__ */ u3("div", { class: "text-xs text-zinc-500 text-center", children: [
          shape.strokeWidth ?? 2,
          "px"
        ] })
      ] }),
      isLine && /* @__PURE__ */ u3("div", { class: "border-t border-zinc-700 pt-2 mt-2", children: [
        /* @__PURE__ */ u3("div", { class: "text-xs text-zinc-400 mb-2", children: "Line Settings" }),
        /* @__PURE__ */ u3("div", { class: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ u3("div", { children: [
            /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Direction" }),
            /* @__PURE__ */ u3(
              "select",
              {
                value: shape.orientation ?? "horizontal",
                onChange: (e3) => updateShape(index, { orientation: e3.target.value }),
                class: "w-full px-2 py-1 rounded text-sm",
                children: [
                  /* @__PURE__ */ u3("option", { value: "horizontal", children: "\u2190 Horizontal \u2192" }),
                  /* @__PURE__ */ u3("option", { value: "vertical", children: "\u2191 Vertical \u2193" }),
                  /* @__PURE__ */ u3("option", { value: "diagonal-down", children: "\u2198 Diagonal Down" }),
                  /* @__PURE__ */ u3("option", { value: "diagonal-up", children: "\u2197 Diagonal Up" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ u3("div", { children: [
            /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Curvature" }),
            /* @__PURE__ */ u3(
              "input",
              {
                type: "range",
                value: shape.curvature ?? 30,
                min: -100,
                max: 100,
                onInput: (e3) => updateShape(index, { curvature: Number(e3.target.value) }),
                class: "w-full"
              }
            ),
            /* @__PURE__ */ u3("div", { class: "text-xs text-zinc-500 text-center", children: [
              shape.curvature ?? 30,
              " (",
              (shape.curvature ?? 30) > 0 ? "\u2191" : (shape.curvature ?? 30) < 0 ? "\u2193" : "\u2014",
              ")"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ u3("div", { class: "grid grid-cols-2 gap-2 mt-2", children: [
          /* @__PURE__ */ u3("div", { children: [
            /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Dash Style" }),
            /* @__PURE__ */ u3(
              "select",
              {
                value: shape.dashStyle ?? "solid",
                onChange: (e3) => updateShape(index, { dashStyle: e3.target.value }),
                class: "w-full px-2 py-1 rounded text-sm",
                children: [
                  /* @__PURE__ */ u3("option", { value: "solid", children: "Solid" }),
                  /* @__PURE__ */ u3("option", { value: "dashed", children: "Dashed" }),
                  /* @__PURE__ */ u3("option", { value: "dotted", children: "Dotted" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ u3("div", { children: [
            /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Line Cap" }),
            /* @__PURE__ */ u3(
              "select",
              {
                value: shape.lineCap ?? "round",
                onChange: (e3) => updateShape(index, { lineCap: e3.target.value }),
                class: "w-full px-2 py-1 rounded text-sm",
                children: [
                  /* @__PURE__ */ u3("option", { value: "round", children: "Round" }),
                  /* @__PURE__ */ u3("option", { value: "square", children: "Square" }),
                  /* @__PURE__ */ u3("option", { value: "butt", children: "Butt" })
                ]
              }
            )
          ] })
        ] }),
        type === "wave-line" && /* @__PURE__ */ u3("div", { class: "mt-2", children: [
          /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Waves Count" }),
          /* @__PURE__ */ u3(
            NumberInput,
            {
              value: shape.count ?? 3,
              onChange: (v3) => updateShape(index, { count: v3 }),
              min: 1,
              max: 10
            }
          )
        ] })
      ] }),
      isChevron && /* @__PURE__ */ u3("div", { class: "border-t border-zinc-700 pt-2 mt-2", children: [
        /* @__PURE__ */ u3("div", { class: "text-xs text-zinc-400 mb-2", children: "Chevron Settings" }),
        /* @__PURE__ */ u3("div", { class: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ u3("div", { children: [
            /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Direction" }),
            /* @__PURE__ */ u3(
              "select",
              {
                value: shape.direction ?? "right",
                onChange: (e3) => updateShape(index, { direction: e3.target.value }),
                class: "w-full px-2 py-1 rounded text-sm",
                children: [
                  /* @__PURE__ */ u3("option", { value: "right", children: "\u2192 Right" }),
                  /* @__PURE__ */ u3("option", { value: "left", children: "\u2190 Left" }),
                  /* @__PURE__ */ u3("option", { value: "up", children: "\u2191 Up" }),
                  /* @__PURE__ */ u3("option", { value: "down", children: "\u2193 Down" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ u3("div", { children: [
            /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Angle" }),
            /* @__PURE__ */ u3(
              "input",
              {
                type: "range",
                value: shape.angle ?? 60,
                min: 30,
                max: 120,
                onInput: (e3) => updateShape(index, { angle: Number(e3.target.value) }),
                class: "w-full"
              }
            ),
            /* @__PURE__ */ u3("div", { class: "text-xs text-zinc-500 text-center", children: [
              shape.angle ?? 60,
              "\xB0"
            ] })
          ] })
        ] }),
        type === "double-chevron" && /* @__PURE__ */ u3("div", { class: "mt-2", children: [
          /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Gap" }),
          /* @__PURE__ */ u3(
            "input",
            {
              type: "range",
              value: shape.gap ?? 15,
              min: 5,
              max: 40,
              onInput: (e3) => updateShape(index, { gap: Number(e3.target.value) }),
              class: "w-full"
            }
          ),
          /* @__PURE__ */ u3("div", { class: "text-xs text-zinc-500 text-center", children: [
            shape.gap ?? 15,
            "px"
          ] })
        ] })
      ] }),
      isStar && /* @__PURE__ */ u3("div", { class: "border-t border-zinc-700 pt-2 mt-2", children: [
        /* @__PURE__ */ u3("div", { class: "text-xs text-zinc-400 mb-2", children: "Star Settings" }),
        /* @__PURE__ */ u3("div", { class: "grid grid-cols-2 gap-2", children: [
          type === "star" && /* @__PURE__ */ u3("div", { children: [
            /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Points" }),
            /* @__PURE__ */ u3(
              NumberInput,
              {
                value: shape.points ?? 5,
                onChange: (v3) => updateShape(index, { points: v3 }),
                min: 4,
                max: 8
              }
            )
          ] }),
          /* @__PURE__ */ u3("div", { children: [
            /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Inner Radius" }),
            /* @__PURE__ */ u3(
              "input",
              {
                type: "range",
                value: (shape.innerRadius ?? 0.4) * 100,
                min: 20,
                max: 80,
                onInput: (e3) => updateShape(index, { innerRadius: Number(e3.target.value) / 100 }),
                class: "w-full"
              }
            ),
            /* @__PURE__ */ u3("div", { class: "text-xs text-zinc-500 text-center", children: [
              Math.round((shape.innerRadius ?? 0.4) * 100),
              "%"
            ] })
          ] })
        ] })
      ] }),
      isPattern && /* @__PURE__ */ u3("div", { class: "border-t border-zinc-700 pt-2 mt-2", children: [
        /* @__PURE__ */ u3("div", { class: "text-xs text-zinc-400 mb-2", children: "Pattern Settings" }),
        /* @__PURE__ */ u3("div", { class: "grid grid-cols-2 gap-2", children: [
          type === "dots-grid" ? /* @__PURE__ */ u3(g, { children: [
            /* @__PURE__ */ u3("div", { children: [
              /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Rows" }),
              /* @__PURE__ */ u3(
                NumberInput,
                {
                  value: shape.rows ?? 4,
                  onChange: (v3) => updateShape(index, { rows: v3 }),
                  min: 1,
                  max: 10
                }
              )
            ] }),
            /* @__PURE__ */ u3("div", { children: [
              /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Columns" }),
              /* @__PURE__ */ u3(
                NumberInput,
                {
                  value: shape.columns ?? 4,
                  onChange: (v3) => updateShape(index, { columns: v3 }),
                  min: 1,
                  max: 10
                }
              )
            ] }),
            /* @__PURE__ */ u3("div", { children: [
              /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Spacing" }),
              /* @__PURE__ */ u3(
                NumberInput,
                {
                  value: shape.spacing ?? 20,
                  onChange: (v3) => updateShape(index, { spacing: v3 }),
                  min: 5,
                  max: 50
                }
              )
            ] })
          ] }) : /* @__PURE__ */ u3(g, { children: [
            /* @__PURE__ */ u3("div", { children: [
              /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Count" }),
              /* @__PURE__ */ u3(
                NumberInput,
                {
                  value: shape.count ?? 12,
                  onChange: (v3) => updateShape(index, { count: v3 }),
                  min: 1,
                  max: 50
                }
              )
            ] }),
            /* @__PURE__ */ u3("div", { children: [
              /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Seed" }),
              /* @__PURE__ */ u3(
                NumberInput,
                {
                  value: shape.seed ?? 1,
                  onChange: (v3) => updateShape(index, { seed: v3 }),
                  min: 1,
                  max: 100
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ u3("div", { children: [
            /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Dot Size" }),
            /* @__PURE__ */ u3(
              NumberInput,
              {
                value: shape.dotSize ?? 2,
                onChange: (v3) => updateShape(index, { dotSize: v3 }),
                min: 1,
                max: 10
              }
            )
          ] })
        ] })
      ] }),
      isBlob && /* @__PURE__ */ u3("div", { class: "border-t border-zinc-700 pt-2 mt-2", children: [
        /* @__PURE__ */ u3("div", { class: "text-xs text-zinc-400 mb-2", children: "Blob Settings" }),
        /* @__PURE__ */ u3("div", { class: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ u3("div", { children: [
            /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Complexity" }),
            /* @__PURE__ */ u3(
              NumberInput,
              {
                value: shape.complexity ?? 6,
                onChange: (v3) => updateShape(index, { complexity: v3 }),
                min: 3,
                max: 8
              }
            )
          ] }),
          /* @__PURE__ */ u3("div", { children: [
            /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Seed" }),
            /* @__PURE__ */ u3(
              NumberInput,
              {
                value: shape.seed ?? 1,
                onChange: (v3) => updateShape(index, { seed: v3 }),
                min: 1,
                max: 100
              }
            )
          ] })
        ] })
      ] }),
      isCrescent && /* @__PURE__ */ u3("div", { class: "border-t border-zinc-700 pt-2 mt-2", children: [
        /* @__PURE__ */ u3("div", { class: "text-xs text-zinc-400 mb-2", children: "Crescent Settings" }),
        /* @__PURE__ */ u3("div", { children: [
          /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Arc Percentage" }),
          /* @__PURE__ */ u3(
            "input",
            {
              type: "range",
              value: shape.arcPercentage ?? 70,
              min: 10,
              max: 90,
              onInput: (e3) => updateShape(index, { arcPercentage: Number(e3.target.value) }),
              class: "w-full"
            }
          ),
          /* @__PURE__ */ u3("div", { class: "text-xs text-zinc-500 text-center", children: [
            shape.arcPercentage ?? 70,
            "%"
          ] })
        ] })
      ] })
    ] });
  };
  return /* @__PURE__ */ u3("div", { class: "space-y-3", children: [
    shapes.map((shape, i4) => /* @__PURE__ */ u3("div", { class: "p-3 bg-zinc-800/50 rounded space-y-2", children: [
      /* @__PURE__ */ u3("div", { class: "flex justify-between items-center", children: [
        /* @__PURE__ */ u3("div", { class: "flex items-center gap-2", children: [
          /* @__PURE__ */ u3("i", { class: `fa-solid ${SHAPE_TYPES.find((t3) => t3.value === shape.type)?.icon || "fa-shapes"} text-zinc-400` }),
          /* @__PURE__ */ u3(
            "select",
            {
              value: shape.type,
              onChange: (e3) => updateShape(i4, { type: e3.target.value }),
              class: "px-2 py-1 rounded text-xs bg-zinc-700",
              children: [
                /* @__PURE__ */ u3("optgroup", { label: "Basic", children: SHAPE_TYPES.slice(0, 4).map((t3) => /* @__PURE__ */ u3("option", { value: t3.value, children: t3.label })) }),
                /* @__PURE__ */ u3("optgroup", { label: "Lines & Curves", children: SHAPE_TYPES.slice(4, 7).map((t3) => /* @__PURE__ */ u3("option", { value: t3.value, children: t3.label })) }),
                /* @__PURE__ */ u3("optgroup", { label: "Arrows & Chevrons", children: SHAPE_TYPES.slice(7, 10).map((t3) => /* @__PURE__ */ u3("option", { value: t3.value, children: t3.label })) }),
                /* @__PURE__ */ u3("optgroup", { label: "Geometric", children: SHAPE_TYPES.slice(10, 16).map((t3) => /* @__PURE__ */ u3("option", { value: t3.value, children: t3.label })) }),
                /* @__PURE__ */ u3("optgroup", { label: "Organic", children: SHAPE_TYPES.slice(16, 18).map((t3) => /* @__PURE__ */ u3("option", { value: t3.value, children: t3.label })) }),
                /* @__PURE__ */ u3("optgroup", { label: "Patterns", children: SHAPE_TYPES.slice(18).map((t3) => /* @__PURE__ */ u3("option", { value: t3.value, children: t3.label })) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ u3("div", { class: "flex gap-1", children: [
          /* @__PURE__ */ u3("button", { onClick: () => duplicateShape(i4), class: "text-zinc-500 hover:text-zinc-300 px-1", title: "Duplicate", children: /* @__PURE__ */ u3("i", { class: "fa-solid fa-copy text-xs" }) }),
          /* @__PURE__ */ u3("button", { onClick: () => removeShape(i4), class: "text-zinc-500 hover:text-red-400 px-1", title: "Remove", children: /* @__PURE__ */ u3("i", { class: "fa-solid fa-xmark" }) })
        ] })
      ] }),
      renderShapeControls(shape, i4)
    ] }, i4)),
    /* @__PURE__ */ u3("div", { class: "flex gap-2", children: [
      /* @__PURE__ */ u3(
        "button",
        {
          ref: presetButtonRef,
          onClick: () => setShowPresets((v3) => !v3),
          class: "flex-1 h-8 text-xs bg-zinc-800 rounded hover:bg-zinc-700 border border-dashed border-zinc-600 flex items-center justify-center",
          children: [
            /* @__PURE__ */ u3("i", { class: "fa-solid fa-wand-magic-sparkles mr-1" }),
            " Add Preset",
            /* @__PURE__ */ u3("i", { class: `fa-solid ml-2 text-[10px] ${showPresets ? "fa-chevron-up" : "fa-chevron-down"}` })
          ]
        }
      ),
      /* @__PURE__ */ u3(
        "button",
        {
          onClick: () => addShape("ring"),
          class: "flex-1 h-8 text-xs bg-zinc-800 rounded hover:bg-zinc-700 border border-dashed border-zinc-600 flex items-center justify-center",
          children: [
            /* @__PURE__ */ u3("i", { class: "fa-solid fa-plus mr-1" }),
            " Add Shape"
          ]
        }
      )
    ] }),
    showPresets && /* @__PURE__ */ u3(
      "div",
      {
        ref: presetMenuRef,
        style: presetMenuStyle,
        class: "bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-y-auto",
        children: [
          /* @__PURE__ */ u3("div", { class: "px-3 py-2 text-[11px] uppercase tracking-wide text-zinc-400 border-b border-zinc-700", children: "Shape Presets" }),
          SHAPE_PRESETS.map((preset) => /* @__PURE__ */ u3(
            "button",
            {
              onClick: () => addPreset(preset),
              class: "w-full px-3 py-2.5 text-left hover:bg-zinc-700 border-b border-zinc-700/60 last:border-b-0",
              children: [
                /* @__PURE__ */ u3("div", { class: "text-xs text-zinc-100", children: preset.name }),
                /* @__PURE__ */ u3("div", { class: "text-[11px] text-zinc-400", children: [
                  preset.shapes.length,
                  " shape",
                  preset.shapes.length === 1 ? "" : "s"
                ] })
              ]
            }
          ))
        ]
      }
    )
  ] });
}

// src/ui/components/editors/MascotEditorInline.tsx
var POSITIONS = [
  { value: "top-left", rotation: "-45", label: "Top Left" },
  { value: "top-right", rotation: "45", label: "Top Right" },
  { value: "bottom-left", rotation: "-135", label: "Bottom Left" },
  { value: "bottom-right", rotation: "135", label: "Bottom Right" }
];
function MascotEditorInline({
  mascot,
  assets,
  config,
  onChange,
  onAssetsRefresh
}) {
  const enabled = mascot !== null && mascot !== void 0;
  const toggleMascot = () => {
    if (enabled) {
      onChange(null);
    } else {
      onChange({
        position: "bottom-right",
        imagePath: config.app?.defaultMascotPath || "",
        size: 15,
        offset: 20,
        borderRadius: 0
      });
    }
  };
  const updateMascot = (updates) => {
    if (mascot) {
      onChange({ ...mascot, ...updates });
    }
  };
  return /* @__PURE__ */ u3("div", { class: "space-y-3", children: [
    /* @__PURE__ */ u3("div", { class: "flex justify-end", children: /* @__PURE__ */ u3(
      "button",
      {
        onClick: toggleMascot,
        class: `text-xs px-3 py-1.5 rounded ${enabled ? "bg-indigo-600" : "bg-zinc-800 hover:bg-zinc-700"}`,
        children: enabled ? "Enabled" : "Add Mascot"
      }
    ) }),
    enabled && mascot && /* @__PURE__ */ u3("div", { class: "space-y-3", children: [
      /* @__PURE__ */ u3(
        ImageSelect,
        {
          label: "Image",
          value: mascot.imagePath || config.app?.defaultMascotPath || "",
          onChange: (v3) => updateMascot({ imagePath: v3 }),
          options: [...assets.mascots || [], ...assets.screenshots || []],
          category: "mascots",
          onAssetsRefresh,
          placeholder: "Default"
        }
      ),
      /* @__PURE__ */ u3("div", { children: [
        /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Position" }),
        /* @__PURE__ */ u3("div", { class: "grid grid-cols-2 gap-2", children: POSITIONS.map((pos) => /* @__PURE__ */ u3(
          "button",
          {
            onClick: () => updateMascot({ position: pos.value }),
            class: `px-2 py-1.5 rounded text-xs flex items-center gap-1.5 ${(mascot.position || "bottom-right") === pos.value ? "bg-indigo-600" : "bg-zinc-800 hover:bg-zinc-700"}`,
            children: [
              /* @__PURE__ */ u3(
                "i",
                {
                  class: "fa-solid fa-arrow-up",
                  style: { transform: `rotate(${pos.rotation}deg)` }
                }
              ),
              pos.label
            ]
          }
        )) })
      ] }),
      /* @__PURE__ */ u3("div", { class: "grid grid-cols-3 gap-3", children: [
        /* @__PURE__ */ u3(
          Slider,
          {
            label: "Size",
            value: mascot.size ?? 15,
            onChange: (v3) => updateMascot({ size: v3 }),
            min: 5,
            max: 30,
            step: 1,
            unit: "%"
          }
        ),
        /* @__PURE__ */ u3(
          Slider,
          {
            label: "Offset",
            value: mascot.offset ?? 20,
            onChange: (v3) => updateMascot({ offset: v3 }),
            min: 0,
            max: 100,
            step: 5,
            unit: "px"
          }
        ),
        /* @__PURE__ */ u3(
          Slider,
          {
            label: "Radius",
            value: mascot.borderRadius ?? 0,
            onChange: (v3) => updateMascot({ borderRadius: v3 }),
            min: 0,
            max: 50,
            step: 5,
            unit: "%"
          }
        )
      ] })
    ] })
  ] });
}

// src/ui/components/editors/ScreenshotEditor.tsx
function ScreenshotEditor({
  screenshot,
  assets,
  config,
  onUpdate,
  onUpdateConfig: _onUpdateConfig,
  onAssetsRefresh
}) {
  const isDual = Array.isArray(screenshot.imagePath);
  const typo = screenshot.typography || {};
  const updateTypography = (updates) => {
    onUpdate({ typography: { ...typo, ...updates } });
  };
  return /* @__PURE__ */ u3("div", { class: "editor-sidebar bg-zinc-900 border-l border-zinc-800 overflow-y-auto", children: /* @__PURE__ */ u3("div", { class: "p-4 space-y-3", children: [
    /* @__PURE__ */ u3("h2", { class: "font-bold text-lg mb-4", children: "Screenshot Editor" }),
    /* @__PURE__ */ u3(CollapsibleSection, { title: "Content", defaultOpen: true, children: [
      /* @__PURE__ */ u3("div", { children: [
        /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Headline" }),
        /* @__PURE__ */ u3(
          "input",
          {
            type: "text",
            value: screenshot.headline || "",
            onInput: (e3) => onUpdate({ headline: e3.target.value }),
            class: "w-full px-3 py-2 rounded text-sm",
            placeholder: "Your headline here..."
          }
        )
      ] }),
      /* @__PURE__ */ u3("div", { children: [
        /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Subtitle" }),
        /* @__PURE__ */ u3(
          "input",
          {
            type: "text",
            value: screenshot.subtitle || "",
            onInput: (e3) => onUpdate({ subtitle: e3.target.value }),
            class: "w-full px-3 py-2 rounded text-sm",
            placeholder: "A compelling subtitle..."
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ u3(CollapsibleSection, { title: "Typography", defaultOpen: false, children: [
      /* @__PURE__ */ u3("div", { class: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ u3(
          Slider,
          {
            label: "Headline Size",
            value: typo.headlineFontSize ?? 5.2,
            onChange: (v3) => updateTypography({ headlineFontSize: v3 }),
            min: 3,
            max: 8,
            step: 0.1,
            unit: "%"
          }
        ),
        /* @__PURE__ */ u3(
          Slider,
          {
            label: "Subtitle Size",
            value: typo.subtitleFontSize ?? 2.4,
            onChange: (v3) => updateTypography({ subtitleFontSize: v3 }),
            min: 1.5,
            max: 4,
            step: 0.1,
            unit: "%"
          }
        ),
        /* @__PURE__ */ u3("div", { children: [
          /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Headline Weight" }),
          /* @__PURE__ */ u3(
            "select",
            {
              value: typo.headlineFontWeight ?? 800,
              onChange: (e3) => updateTypography({ headlineFontWeight: Number(e3.target.value) }),
              class: "w-full px-3 py-2 rounded text-sm",
              children: [
                /* @__PURE__ */ u3("option", { value: "400", children: "Regular (400)" }),
                /* @__PURE__ */ u3("option", { value: "500", children: "Medium (500)" }),
                /* @__PURE__ */ u3("option", { value: "600", children: "Semibold (600)" }),
                /* @__PURE__ */ u3("option", { value: "700", children: "Bold (700)" }),
                /* @__PURE__ */ u3("option", { value: "800", children: "Extra Bold (800)" }),
                /* @__PURE__ */ u3("option", { value: "900", children: "Black (900)" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ u3("div", { children: [
          /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Subtitle Weight" }),
          /* @__PURE__ */ u3(
            "select",
            {
              value: typo.subtitleFontWeight ?? 500,
              onChange: (e3) => updateTypography({ subtitleFontWeight: Number(e3.target.value) }),
              class: "w-full px-3 py-2 rounded text-sm",
              children: [
                /* @__PURE__ */ u3("option", { value: "400", children: "Regular (400)" }),
                /* @__PURE__ */ u3("option", { value: "500", children: "Medium (500)" }),
                /* @__PURE__ */ u3("option", { value: "600", children: "Semibold (600)" }),
                /* @__PURE__ */ u3("option", { value: "700", children: "Bold (700)" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ u3("div", { class: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ u3(
          Slider,
          {
            label: "Line Height",
            value: typo.headlineLineHeight ?? 1.15,
            onChange: (v3) => updateTypography({ headlineLineHeight: v3 }),
            min: 1,
            max: 1.5,
            step: 0.05
          }
        ),
        /* @__PURE__ */ u3("div", { children: [
          /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Text Align" }),
          /* @__PURE__ */ u3("div", { class: "flex gap-1", children: ["left", "center", "right"].map((align) => /* @__PURE__ */ u3(
            "button",
            {
              onClick: () => updateTypography({ textAlign: align }),
              class: `flex-1 px-2 py-1.5 rounded text-xs ${(typo.textAlign ?? "center") === align ? "bg-indigo-600" : "bg-zinc-800 hover:bg-zinc-700"}`,
              children: align.charAt(0).toUpperCase() + align.slice(1)
            }
          )) })
        ] })
      ] }),
      /* @__PURE__ */ u3("div", { class: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ u3("div", { children: [
          /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Text Color" }),
          /* @__PURE__ */ u3(
            ColorInput,
            {
              value: typo.textColor ?? "#ffffff",
              onChange: (v3) => updateTypography({ textColor: v3 })
            }
          )
        ] }),
        /* @__PURE__ */ u3(
          Slider,
          {
            label: "Padding",
            value: typo.horizontalPadding ?? 6,
            onChange: (v3) => updateTypography({ horizontalPadding: v3 }),
            min: 2,
            max: 15,
            step: 1,
            unit: "%"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ u3(CollapsibleSection, { title: "Layout", defaultOpen: false, children: /* @__PURE__ */ u3(
      Slider,
      {
        label: "Title Offset from Top",
        value: screenshot.headlineOffset ?? 0,
        onChange: (v3) => onUpdate({ headlineOffset: v3 }),
        min: 0,
        max: 30,
        step: 1,
        unit: "%"
      }
    ) }),
    /* @__PURE__ */ u3(CollapsibleSection, { title: "Phone Screenshot", defaultOpen: true, children: [
      /* @__PURE__ */ u3("div", { class: "flex justify-end mb-2", children: /* @__PURE__ */ u3(
        "button",
        {
          onClick: () => {
            if (isDual) {
              onUpdate({ imagePath: screenshot.imagePath[0] || "" });
            } else {
              onUpdate({ imagePath: [screenshot.imagePath || "", ""] });
            }
          },
          class: "text-xs px-3 py-1.5 bg-zinc-800 rounded hover:bg-zinc-700",
          children: isDual ? "\u2190 Single Phone" : "Dual Phones \u2192"
        }
      ) }),
      isDual ? /* @__PURE__ */ u3("div", { class: "space-y-3", children: [
        /* @__PURE__ */ u3(
          ImageSelect,
          {
            label: "Left Phone",
            value: screenshot.imagePath[0] || "",
            onChange: (v3) => onUpdate({ imagePath: [v3, screenshot.imagePath[1] || ""] }),
            options: assets.screenshots || [],
            category: "screenshots",
            onAssetsRefresh
          }
        ),
        /* @__PURE__ */ u3(
          ImageSelect,
          {
            label: "Right Phone",
            value: screenshot.imagePath[1] || "",
            onChange: (v3) => onUpdate({ imagePath: [screenshot.imagePath[0] || "", v3] }),
            options: assets.screenshots || [],
            category: "screenshots",
            onAssetsRefresh
          }
        )
      ] }) : /* @__PURE__ */ u3(
        ImageSelect,
        {
          value: screenshot.imagePath || "",
          onChange: (v3) => onUpdate({ imagePath: v3 }),
          options: assets.screenshots || [],
          category: "screenshots",
          onAssetsRefresh
        }
      )
    ] }),
    /* @__PURE__ */ u3(CollapsibleSection, { title: "Phone Frame", defaultOpen: false, children: /* @__PURE__ */ u3("div", { class: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ u3(
        Slider,
        {
          label: "Scale",
          value: screenshot.phoneFrame?.scale ?? (isDual ? 42 : 70),
          onChange: (v3) => onUpdate({ phoneFrame: { ...screenshot.phoneFrame, scale: v3 } }),
          min: isDual ? 30 : 50,
          max: 100,
          step: 1,
          unit: "%"
        }
      ),
      /* @__PURE__ */ u3(
        Slider,
        {
          label: "Bottom Offset",
          value: screenshot.phoneFrame?.bottomOffset ?? 6,
          onChange: (v3) => onUpdate({ phoneFrame: { ...screenshot.phoneFrame, bottomOffset: v3 } }),
          min: 0,
          max: 100,
          step: 1,
          unit: "%"
        }
      ),
      isDual && /* @__PURE__ */ u3(g, { children: [
        /* @__PURE__ */ u3(
          Slider,
          {
            label: "Rotation",
            value: screenshot.phoneFrame?.dualRotation ?? 6,
            onChange: (v3) => onUpdate({ phoneFrame: { ...screenshot.phoneFrame, dualRotation: v3 } }),
            min: 0,
            max: 15,
            step: 1,
            unit: "\xB0"
          }
        ),
        /* @__PURE__ */ u3(
          Slider,
          {
            label: "Gap",
            value: screenshot.phoneFrame?.dualGap ?? 2,
            onChange: (v3) => onUpdate({ phoneFrame: { ...screenshot.phoneFrame, dualGap: v3 } }),
            min: 0,
            max: 10,
            step: 0.5,
            unit: "%"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ u3(CollapsibleSection, { title: "Background Glows", defaultOpen: false, children: /* @__PURE__ */ u3(
      GlowEditorInline,
      {
        glows: screenshot.glows || [],
        onChange: (glows) => onUpdate({ glows }),
        palette: config.palette
      }
    ) }),
    /* @__PURE__ */ u3(CollapsibleSection, { title: "Decorative Shapes", defaultOpen: false, children: /* @__PURE__ */ u3(
      ShapeEditorInline,
      {
        shapes: screenshot.shapes || [],
        onChange: (shapes) => onUpdate({ shapes }),
        palette: config.palette
      }
    ) }),
    /* @__PURE__ */ u3(CollapsibleSection, { title: "Mascot", defaultOpen: false, children: /* @__PURE__ */ u3(
      MascotEditorInline,
      {
        mascot: screenshot.mascot || null,
        assets,
        config,
        onChange: (mascot) => onUpdate({ mascot }),
        onAssetsRefresh
      }
    ) })
  ] }) });
}

// src/ui/components/editors/FeatureGraphicEditor.tsx
function FeatureGraphicEditor({
  featureGraphic,
  assets,
  config,
  onUpdate,
  onUpdateConfig,
  onAssetsRefresh
}) {
  const fg = featureGraphic || {};
  return /* @__PURE__ */ u3("div", { class: "editor-sidebar bg-zinc-900 border-l border-zinc-800 overflow-y-auto", children: /* @__PURE__ */ u3("div", { class: "p-4 space-y-3", children: [
    /* @__PURE__ */ u3("h2", { class: "font-bold text-lg mb-4", children: "Feature Graphic" }),
    /* @__PURE__ */ u3(CollapsibleSection, { title: "Content", defaultOpen: true, children: [
      /* @__PURE__ */ u3("div", { children: [
        /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Headline" }),
        /* @__PURE__ */ u3(
          "input",
          {
            type: "text",
            value: fg.headline || "",
            onInput: (e3) => onUpdate({ headline: e3.target.value }),
            class: "w-full px-3 py-2 rounded text-sm",
            placeholder: "Your headline here..."
          }
        )
      ] }),
      /* @__PURE__ */ u3("div", { children: [
        /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Subtitle" }),
        /* @__PURE__ */ u3(
          "input",
          {
            type: "text",
            value: fg.subtitle || "",
            onInput: (e3) => onUpdate({ subtitle: e3.target.value }),
            class: "w-full px-3 py-2 rounded text-sm",
            placeholder: "A compelling subtitle..."
          }
        )
      ] }),
      /* @__PURE__ */ u3("div", { class: "flex gap-4 pt-2", children: [
        /* @__PURE__ */ u3("label", { class: "flex items-center gap-2 text-sm cursor-pointer", children: [
          /* @__PURE__ */ u3(
            "input",
            {
              type: "checkbox",
              checked: fg.showIcon !== false,
              onChange: (e3) => onUpdate({ showIcon: e3.target.checked }),
              class: "rounded"
            }
          ),
          "Show App Icon"
        ] }),
        /* @__PURE__ */ u3("label", { class: "flex items-center gap-2 text-sm cursor-pointer", children: [
          /* @__PURE__ */ u3(
            "input",
            {
              type: "checkbox",
              checked: fg.showAppName !== false,
              onChange: (e3) => onUpdate({ showAppName: e3.target.checked }),
              class: "rounded"
            }
          ),
          "Show App Name"
        ] })
      ] }),
      fg.showIcon !== false && /* @__PURE__ */ u3(g, { children: [
        /* @__PURE__ */ u3(
          ImageSelect,
          {
            label: "App Icon",
            value: config.app?.iconPath || "",
            onChange: (v3) => onUpdateConfig({ ...config, app: { ...config.app, iconPath: v3 } }),
            options: assets.icons || [],
            category: "icons",
            onAssetsRefresh
          }
        ),
        /* @__PURE__ */ u3("div", { class: "text-xs text-zinc-400 mt-3 mb-1", children: "Icon Box" }),
        /* @__PURE__ */ u3("div", { class: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ u3(
            Slider,
            {
              label: "Size",
              value: fg.iconBoxScale ?? 100,
              onChange: (v3) => onUpdate({ iconBoxScale: v3 }),
              min: 50,
              max: 200,
              step: 5,
              unit: "%"
            }
          ),
          /* @__PURE__ */ u3(
            Slider,
            {
              label: "Radius",
              value: fg.iconBoxRadius ?? 16,
              onChange: (v3) => onUpdate({ iconBoxRadius: v3 }),
              min: 0,
              max: 50,
              step: 1,
              unit: "px"
            }
          )
        ] }),
        /* @__PURE__ */ u3(
          LabeledColorInput,
          {
            label: "Background",
            value: fg.iconBoxColor || "rgba(255,255,255,0.15)",
            onChange: (v3) => onUpdate({ iconBoxColor: v3 }),
            placeholder: "rgba(255,255,255,0.15)"
          }
        ),
        /* @__PURE__ */ u3("div", { class: "text-xs text-zinc-400 mt-3 mb-1", children: "Icon Image" }),
        /* @__PURE__ */ u3("div", { class: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ u3(
            Slider,
            {
              label: "Scale",
              value: fg.iconScale ?? 100,
              onChange: (v3) => onUpdate({ iconScale: v3 }),
              min: 50,
              max: 150,
              step: 5,
              unit: "%"
            }
          ),
          /* @__PURE__ */ u3(
            Slider,
            {
              label: "Radius",
              value: fg.iconRadius ?? 0,
              onChange: (v3) => onUpdate({ iconRadius: v3 }),
              min: 0,
              max: 50,
              step: 1,
              unit: "px"
            }
          ),
          /* @__PURE__ */ u3(
            Slider,
            {
              label: "Offset X",
              value: fg.iconOffsetX ?? 0,
              onChange: (v3) => onUpdate({ iconOffsetX: v3 }),
              min: -20,
              max: 20,
              step: 1,
              unit: "px"
            }
          ),
          /* @__PURE__ */ u3(
            Slider,
            {
              label: "Offset Y",
              value: fg.iconOffsetY ?? 0,
              onChange: (v3) => onUpdate({ iconOffsetY: v3 }),
              min: -20,
              max: 20,
              step: 1,
              unit: "px"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ u3(CollapsibleSection, { title: "Phone Screenshot", defaultOpen: true, children: [
      /* @__PURE__ */ u3(
        ImageSelect,
        {
          label: "Image",
          value: fg.imagePath || "",
          onChange: (v3) => onUpdate({ imagePath: v3 }),
          options: assets.screenshots || [],
          category: "screenshots",
          onAssetsRefresh
        }
      ),
      /* @__PURE__ */ u3("div", { class: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ u3(
          Slider,
          {
            label: "Rotation",
            value: fg.phoneRotation ?? 5,
            onChange: (v3) => onUpdate({ phoneRotation: v3 }),
            min: -15,
            max: 15,
            step: 1,
            unit: "\xB0"
          }
        ),
        /* @__PURE__ */ u3(
          Slider,
          {
            label: "Scale",
            value: fg.phoneScale ?? 100,
            onChange: (v3) => onUpdate({ phoneScale: v3 }),
            min: 50,
            max: 150,
            step: 5,
            unit: "%"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ u3(CollapsibleSection, { title: "Background Glows", defaultOpen: false, children: /* @__PURE__ */ u3(
      GlowEditorInline,
      {
        glows: fg.glows || [],
        onChange: (glows) => onUpdate({ glows }),
        palette: config.palette
      }
    ) }),
    /* @__PURE__ */ u3(CollapsibleSection, { title: "Decorative Shapes", defaultOpen: false, children: /* @__PURE__ */ u3(
      ShapeEditorInline,
      {
        shapes: fg.shapes || [],
        onChange: (shapes) => onUpdate({ shapes }),
        palette: config.palette
      }
    ) }),
    /* @__PURE__ */ u3(CollapsibleSection, { title: "Mascot", defaultOpen: false, children: /* @__PURE__ */ u3(
      MascotEditorInline,
      {
        mascot: fg.mascot || null,
        assets,
        config,
        onChange: (mascot) => onUpdate({ mascot }),
        onAssetsRefresh
      }
    ) })
  ] }) });
}

// src/ui/components/modals/ProjectModal.tsx
function ProjectModal({
  projects,
  currentProject,
  onClose,
  onCreate,
  onSwitch,
  onDelete,
  onRename
}) {
  const [newName, setNewName] = h2("");
  const [confirmDelete, setConfirmDelete] = h2(null);
  const [editingProject, setEditingProject] = h2(null);
  const [editName, setEditName] = h2("");
  const handleCreate = async () => {
    if (!newName.trim())
      return;
    await onCreate(newName.trim());
    setNewName("");
  };
  const handleDelete = async (projectId) => {
    await onDelete(projectId);
    setConfirmDelete(null);
  };
  const handleRename = async (projectId) => {
    if (editName.trim()) {
      await onRename(projectId, editName.trim());
      setEditingProject(null);
      setEditName("");
    }
  };
  const startEditing = (project) => {
    setEditingProject(project.id);
    setEditName(project.name);
  };
  return /* @__PURE__ */ u3("div", { class: "fixed inset-0 bg-black/70 flex items-center justify-center z-50", onClick: onClose, children: /* @__PURE__ */ u3(
    "div",
    {
      class: "bg-zinc-900 rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto",
      onClick: (e3) => e3.stopPropagation(),
      children: [
        /* @__PURE__ */ u3("div", { class: "flex justify-between items-center mb-4", children: [
          /* @__PURE__ */ u3("h2", { class: "font-bold text-lg", children: "Projects" }),
          /* @__PURE__ */ u3("button", { onClick: onClose, class: "text-zinc-500 hover:text-white text-xl", children: /* @__PURE__ */ u3("i", { class: "fa-solid fa-xmark" }) })
        ] }),
        /* @__PURE__ */ u3("div", { class: "mb-4 p-3 bg-zinc-800/50 rounded", children: [
          /* @__PURE__ */ u3("div", { class: "text-sm text-zinc-400 mb-2", children: "Create New Project" }),
          /* @__PURE__ */ u3("div", { class: "flex gap-2", children: [
            /* @__PURE__ */ u3(
              "input",
              {
                type: "text",
                value: newName,
                onInput: (e3) => setNewName(e3.target.value),
                onKeyDown: (e3) => e3.key === "Enter" && handleCreate(),
                placeholder: "Project name",
                class: "flex-1 px-3 py-2 rounded text-sm bg-zinc-800 border border-zinc-700"
              }
            ),
            /* @__PURE__ */ u3(
              "button",
              {
                onClick: handleCreate,
                disabled: !newName.trim(),
                class: "px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm disabled:opacity-50",
                children: "Create"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ u3("div", { class: "space-y-2", children: projects.map((p3) => /* @__PURE__ */ u3(
          "div",
          {
            class: `p-3 rounded border ${currentProject === p3.id ? "bg-indigo-900/50 border-indigo-500" : "bg-zinc-800/50 border-transparent hover:bg-zinc-800"}`,
            children: editingProject === p3.id ? (
              // Rename mode
              /* @__PURE__ */ u3("div", { class: "flex gap-2", children: [
                /* @__PURE__ */ u3(
                  "input",
                  {
                    type: "text",
                    value: editName,
                    onInput: (e3) => setEditName(e3.target.value),
                    onKeyDown: (e3) => {
                      if (e3.key === "Enter")
                        handleRename(p3.id);
                      if (e3.key === "Escape")
                        setEditingProject(null);
                    },
                    class: "flex-1 px-2 py-1 rounded text-sm bg-zinc-800 border border-zinc-700",
                    autoFocus: true
                  }
                ),
                /* @__PURE__ */ u3(
                  "button",
                  {
                    onClick: () => handleRename(p3.id),
                    class: "px-2 py-1 bg-green-600 hover:bg-green-500 rounded text-sm",
                    children: /* @__PURE__ */ u3("i", { class: "fa-solid fa-check" })
                  }
                ),
                /* @__PURE__ */ u3(
                  "button",
                  {
                    onClick: () => setEditingProject(null),
                    class: "px-2 py-1 bg-zinc-600 hover:bg-zinc-500 rounded text-sm",
                    children: /* @__PURE__ */ u3("i", { class: "fa-solid fa-xmark" })
                  }
                )
              ] })
            ) : confirmDelete === p3.id ? (
              // Delete confirmation
              /* @__PURE__ */ u3("div", { class: "text-center", children: [
                /* @__PURE__ */ u3("p", { class: "text-sm text-red-400 mb-2", children: [
                  'Delete "',
                  p3.name,
                  '"?'
                ] }),
                /* @__PURE__ */ u3("p", { class: "text-xs text-zinc-500 mb-3", children: "This will permanently delete all project data." }),
                /* @__PURE__ */ u3("div", { class: "flex gap-2 justify-center", children: [
                  /* @__PURE__ */ u3(
                    "button",
                    {
                      onClick: () => handleDelete(p3.id),
                      class: "px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm",
                      children: "Yes, Delete"
                    }
                  ),
                  /* @__PURE__ */ u3(
                    "button",
                    {
                      onClick: () => setConfirmDelete(null),
                      class: "px-3 py-1 bg-zinc-600 hover:bg-zinc-500 rounded text-sm",
                      children: "Cancel"
                    }
                  )
                ] })
              ] })
            ) : (
              // Normal view
              /* @__PURE__ */ u3("div", { class: "flex items-center justify-between", children: [
                /* @__PURE__ */ u3(
                  "div",
                  {
                    class: "cursor-pointer flex-1",
                    onClick: () => {
                      onSwitch(p3.id);
                      onClose();
                    },
                    children: [
                      /* @__PURE__ */ u3("div", { class: "font-medium", children: p3.name }),
                      /* @__PURE__ */ u3("div", { class: "text-xs text-zinc-500", children: p3.id })
                    ]
                  }
                ),
                /* @__PURE__ */ u3("div", { class: "flex gap-1 ml-2", children: [
                  /* @__PURE__ */ u3(
                    "button",
                    {
                      onClick: (e3) => {
                        e3.stopPropagation();
                        startEditing(p3);
                      },
                      class: "p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded",
                      title: "Rename",
                      children: /* @__PURE__ */ u3("i", { class: "fa-solid fa-pen text-xs" })
                    }
                  ),
                  /* @__PURE__ */ u3(
                    "button",
                    {
                      onClick: (e3) => {
                        e3.stopPropagation();
                        setConfirmDelete(p3.id);
                      },
                      class: "p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-700 rounded",
                      title: "Delete",
                      children: /* @__PURE__ */ u3("i", { class: "fa-solid fa-trash text-xs" })
                    }
                  )
                ] })
              ] })
            )
          },
          p3.id
        )) })
      ]
    }
  ) });
}

// src/ui/components/modals/GenerateModal.tsx
function GenerateModal({ progress, generating, onClose }) {
  const { current, total, item, results } = progress;
  const percent = total > 0 ? Math.round(current / total * 100) : 0;
  const isDone = !generating && results !== null;
  const successCount = results?.filter((r3) => r3.status === "success").length || 0;
  const errorCount = results?.filter((r3) => r3.status === "error").length || 0;
  const groupedResults = F(() => {
    if (!results) {
      return {
        android: { feature: null, screenshots: [] },
        ios: { feature: null, screenshots: [] }
      };
    }
    const grouped = {
      android: { feature: null, screenshots: [] },
      ios: { feature: null, screenshots: [] }
    };
    results.filter((r3) => r3.status === "success").forEach((r3) => {
      const parts = r3.relativePath.split("/");
      const platform = parts[1];
      const filename = parts[parts.length - 1];
      if (platform === "android" || platform === "ios") {
        if (filename.includes("feature-graphic")) {
          grouped[platform].feature = r3;
        } else {
          grouped[platform].screenshots.push(r3);
        }
      }
    });
    return grouped;
  }, [results]);
  const openFolder = async () => {
    await fetch("/api/open-folder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
  };
  const renderPlatformSection = (platform, label) => {
    const data = groupedResults[platform];
    if (!data.feature && data.screenshots.length === 0)
      return null;
    return /* @__PURE__ */ u3("div", { class: "mb-4", children: [
      /* @__PURE__ */ u3("div", { class: "text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2", children: [
        /* @__PURE__ */ u3("i", { class: `fa-brands ${platform === "android" ? "fa-android" : "fa-apple"}` }),
        label
      ] }),
      data.feature && /* @__PURE__ */ u3("div", { class: "mb-3", children: /* @__PURE__ */ u3("div", { class: "bg-zinc-800 rounded overflow-hidden", children: [
        /* @__PURE__ */ u3(
          "img",
          {
            src: `/output/${data.feature.relativePath}?t=${Date.now()}`,
            class: "w-full aspect-[1024/500] object-contain bg-zinc-700",
            loading: "lazy"
          }
        ),
        /* @__PURE__ */ u3("div", { class: "p-2 text-xs text-zinc-400 truncate", title: data.feature.relativePath, children: "Feature Graphic" })
      ] }) }),
      data.screenshots.length > 0 && /* @__PURE__ */ u3("div", { class: "grid grid-cols-4 gap-2", children: data.screenshots.map((r3) => /* @__PURE__ */ u3("div", { class: "bg-zinc-800 rounded overflow-hidden", children: [
        /* @__PURE__ */ u3(
          "img",
          {
            src: `/output/${r3.relativePath}?t=${Date.now()}`,
            class: "w-full aspect-[1242/2688] object-contain bg-zinc-700",
            loading: "lazy"
          }
        ),
        /* @__PURE__ */ u3("div", { class: "p-1.5 text-xs text-zinc-400 truncate", title: r3.relativePath, children: r3.relativePath.split("/").pop() })
      ] }, r3.relativePath)) })
    ] });
  };
  return /* @__PURE__ */ u3("div", { class: "fixed inset-0 bg-black/70 flex items-center justify-center z-50", children: /* @__PURE__ */ u3(
    "div",
    {
      class: "bg-zinc-900 rounded-lg p-6 w-[700px] max-h-[85vh] overflow-hidden flex flex-col",
      onClick: (e3) => e3.stopPropagation(),
      children: [
        /* @__PURE__ */ u3("div", { class: "flex justify-between items-center mb-4", children: [
          /* @__PURE__ */ u3("h2", { class: "font-bold text-lg", children: isDone ? "Generation Complete" : "Generating Screenshots..." }),
          isDone && /* @__PURE__ */ u3("button", { onClick: onClose, class: "text-zinc-500 hover:text-white text-xl", children: /* @__PURE__ */ u3("i", { class: "fa-solid fa-xmark" }) })
        ] }),
        !isDone ? (
          // Progress View
          /* @__PURE__ */ u3("div", { class: "space-y-4", children: [
            /* @__PURE__ */ u3("div", { class: "bg-zinc-800 rounded-full h-3 overflow-hidden", children: /* @__PURE__ */ u3(
              "div",
              {
                class: "bg-indigo-500 h-full transition-all duration-300",
                style: { width: `${percent}%` }
              }
            ) }),
            /* @__PURE__ */ u3("div", { class: "flex justify-between text-sm", children: [
              /* @__PURE__ */ u3("span", { class: "text-zinc-400 truncate max-w-[400px]", children: item }),
              /* @__PURE__ */ u3("span", { class: "text-zinc-500", children: [
                current,
                " / ",
                total
              ] })
            ] })
          ] })
        ) : (
          // Results View
          /* @__PURE__ */ u3("div", { class: "flex-1 overflow-hidden flex flex-col min-h-0", children: [
            /* @__PURE__ */ u3("div", { class: "flex gap-4 mb-4", children: [
              /* @__PURE__ */ u3("div", { class: "flex-1 bg-green-900/30 border border-green-800 rounded p-3 text-center", children: [
                /* @__PURE__ */ u3("div", { class: "text-2xl font-bold text-green-400", children: successCount }),
                /* @__PURE__ */ u3("div", { class: "text-xs text-green-500", children: "Successful" })
              ] }),
              errorCount > 0 && /* @__PURE__ */ u3("div", { class: "flex-1 bg-red-900/30 border border-red-800 rounded p-3 text-center", children: [
                /* @__PURE__ */ u3("div", { class: "text-2xl font-bold text-red-400", children: errorCount }),
                /* @__PURE__ */ u3("div", { class: "text-xs text-red-500", children: "Failed" })
              ] })
            ] }),
            /* @__PURE__ */ u3("div", { class: "flex-1 overflow-y-auto min-h-0 pr-2", children: [
              renderPlatformSection("android", "Android"),
              renderPlatformSection("ios", "iOS")
            ] }),
            /* @__PURE__ */ u3("div", { class: "flex gap-3 mt-4 pt-4 border-t border-zinc-800", children: [
              /* @__PURE__ */ u3(
                "button",
                {
                  onClick: openFolder,
                  class: "flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded text-sm flex items-center justify-center gap-2",
                  children: [
                    /* @__PURE__ */ u3("i", { class: "fa-solid fa-folder-open" }),
                    " Open in Explorer"
                  ]
                }
              ),
              /* @__PURE__ */ u3(
                "button",
                {
                  onClick: onClose,
                  class: "flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm",
                  children: "Done"
                }
              )
            ] })
          ] })
        )
      ]
    }
  ) });
}

// src/ui/components/modals/ThemeEditorModal.tsx
var GRADIENT_TEMPLATES = [
  { id: "solid-primary", name: "Solid Primary", template: "{primary}" },
  { id: "solid-secondary", name: "Solid Secondary", template: "{secondary}" },
  { id: "primary-dark", name: "Primary to Dark", template: "linear-gradient(135deg, {primary} 0%, #0a0a0a 100%)" },
  { id: "primary-secondary", name: "Primary to Secondary", template: "linear-gradient(135deg, {primary} 0%, {secondary} 100%)" },
  { id: "secondary-primary", name: "Secondary to Primary", template: "linear-gradient(135deg, {secondary} 0%, {primary} 100%)" },
  { id: "radial-primary", name: "Radial Primary", template: "radial-gradient(circle at 30% 30%, {primary} 0%, #0a0a0a 70%)" },
  { id: "radial-secondary", name: "Radial Secondary", template: "radial-gradient(circle at 30% 30%, {secondary} 0%, #0a0a0a 70%)" },
  { id: "mesh-primary", name: "Mesh Primary", template: "linear-gradient(135deg, {primary}22 0%, transparent 50%), linear-gradient(225deg, {secondary}22 0%, transparent 50%), #0a0a0a" },
  { id: "diagonal-split", name: "Diagonal Split", template: "linear-gradient(135deg, {primary} 0%, {primary} 50%, {secondary} 50%, {secondary} 100%)" },
  { id: "triple-gradient", name: "Triple Gradient", template: "linear-gradient(135deg, {primary} 0%, {secondary} 50%, {accent} 100%)" }
];
var DEFAULT_PALETTES = [
  { name: "Purple Night", palette: { primary: "#a855f7", secondary: "#6366f1", accent: "#ec4899" } },
  { name: "Ocean Blue", palette: { primary: "#3b82f6", secondary: "#06b6d4", accent: "#22c55e" } },
  { name: "Sunset", palette: { primary: "#f97316", secondary: "#ef4444", accent: "#f59e0b" } },
  { name: "Forest", palette: { primary: "#22c55e", secondary: "#14b8a6", accent: "#84cc16" } },
  { name: "Rose", palette: { primary: "#ec4899", secondary: "#f43f5e", accent: "#a855f7" } },
  { name: "Midnight", palette: { primary: "#6366f1", secondary: "#8b5cf6", accent: "#3b82f6" } },
  { name: "Ember", palette: { primary: "#ef4444", secondary: "#f97316", accent: "#fbbf24" } },
  { name: "Teal", palette: { primary: "#14b8a6", secondary: "#06b6d4", accent: "#22c55e" } }
];
function applyPaletteToGradient(template, palette) {
  return template.replace(/\{primary\}/g, palette.primary).replace(/\{secondary\}/g, palette.secondary).replace(/\{accent\}/g, palette.accent);
}
function ThemeEditorModal({ config, onClose, onSave }) {
  const defaultPalette = { primary: "#a855f7", secondary: "#6366f1", accent: "#ec4899" };
  const currentPalette = config.palette || defaultPalette;
  const currentGradient = config.theme?.background?.gradient || "";
  const detectSelectedGradient = () => {
    for (const t3 of GRADIENT_TEMPLATES) {
      const css = applyPaletteToGradient(t3.template, currentPalette);
      if (css === currentGradient) {
        return t3.id;
      }
    }
    return "custom";
  };
  const [palette, setPalette] = h2(currentPalette);
  const [selectedGradient, setSelectedGradient] = h2(detectSelectedGradient);
  const [customGradient, setCustomGradient] = h2(currentGradient);
  const [fontFamily, setFontFamily] = h2(config.theme?.fontFamily || "Inter, sans-serif");
  const [googleFontsUrl, setGoogleFontsUrl] = h2(config.theme?.googleFontsUrl || "");
  const gradients = GRADIENT_TEMPLATES.map((t3) => ({
    id: t3.id,
    name: t3.name,
    css: applyPaletteToGradient(t3.template, palette)
  }));
  const updatePalette = (updates) => {
    setPalette((p3) => ({ ...p3, ...updates }));
  };
  const handleSave = () => {
    const gradient = selectedGradient === "custom" ? customGradient : gradients.find((g3) => g3.id === selectedGradient)?.css || customGradient;
    onSave({
      ...config,
      palette,
      theme: {
        ...config.theme,
        background: { gradient },
        fontFamily,
        googleFontsUrl: googleFontsUrl || void 0
      }
    });
  };
  const applyPreset = (presetPalette) => {
    setPalette(presetPalette);
  };
  const currentPreviewGradient = selectedGradient === "custom" ? customGradient : gradients.find((g3) => g3.id === selectedGradient)?.css || "";
  return /* @__PURE__ */ u3(
    "div",
    {
      class: "fixed inset-0 bg-black/80 flex items-center justify-center z-50",
      onClick: (e3) => e3.target === e3.currentTarget && onClose(),
      children: /* @__PURE__ */ u3("div", { class: "bg-zinc-900 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col", children: [
        /* @__PURE__ */ u3("div", { class: "flex items-center justify-between p-4 border-b border-zinc-800", children: [
          /* @__PURE__ */ u3("h2", { class: "font-bold text-lg", children: [
            /* @__PURE__ */ u3("i", { class: "fa-solid fa-palette mr-2" }),
            "Theme & Colors"
          ] }),
          /* @__PURE__ */ u3("button", { onClick: onClose, class: "text-zinc-500 hover:text-white text-xl", children: /* @__PURE__ */ u3("i", { class: "fa-solid fa-xmark" }) })
        ] }),
        /* @__PURE__ */ u3("div", { class: "flex-1 overflow-y-auto p-4 space-y-6", children: [
          /* @__PURE__ */ u3("div", { children: [
            /* @__PURE__ */ u3("h3", { class: "text-sm font-medium mb-3", children: "Color Palette" }),
            /* @__PURE__ */ u3("div", { class: "grid grid-cols-3 gap-4", children: [
              /* @__PURE__ */ u3("div", { children: [
                /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Primary" }),
                /* @__PURE__ */ u3(ColorInput, { value: palette.primary, onChange: (v3) => updatePalette({ primary: v3 }) })
              ] }),
              /* @__PURE__ */ u3("div", { children: [
                /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Secondary" }),
                /* @__PURE__ */ u3(ColorInput, { value: palette.secondary, onChange: (v3) => updatePalette({ secondary: v3 }) })
              ] }),
              /* @__PURE__ */ u3("div", { children: [
                /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Accent" }),
                /* @__PURE__ */ u3(ColorInput, { value: palette.accent, onChange: (v3) => updatePalette({ accent: v3 }) })
              ] })
            ] }),
            /* @__PURE__ */ u3("div", { class: "mt-4", children: [
              /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-2", children: "Preset Palettes" }),
              /* @__PURE__ */ u3("div", { class: "flex flex-wrap gap-2", children: DEFAULT_PALETTES.map((preset) => /* @__PURE__ */ u3(
                "button",
                {
                  onClick: () => applyPreset(preset.palette),
                  class: "flex items-center gap-2 px-3 py-1.5 rounded text-xs bg-zinc-800 hover:bg-zinc-700",
                  title: preset.name,
                  children: [
                    /* @__PURE__ */ u3("div", { class: "flex", children: [
                      /* @__PURE__ */ u3("div", { class: "w-3 h-3 rounded-l", style: { background: preset.palette.primary } }),
                      /* @__PURE__ */ u3("div", { class: "w-3 h-3", style: { background: preset.palette.secondary } }),
                      /* @__PURE__ */ u3("div", { class: "w-3 h-3 rounded-r", style: { background: preset.palette.accent } })
                    ] }),
                    preset.name
                  ]
                },
                preset.name
              )) })
            ] })
          ] }),
          /* @__PURE__ */ u3("div", { children: [
            /* @__PURE__ */ u3("h3", { class: "text-sm font-medium mb-3", children: "Background Gradient" }),
            /* @__PURE__ */ u3("div", { class: "grid grid-cols-4 gap-2 mb-3", children: [
              gradients.map((g3) => /* @__PURE__ */ u3(
                "button",
                {
                  onClick: () => setSelectedGradient(g3.id),
                  class: `p-1 rounded border-2 ${selectedGradient === g3.id ? "border-indigo-500" : "border-transparent hover:border-zinc-600"}`,
                  children: [
                    /* @__PURE__ */ u3("div", { class: "h-12 rounded", style: { background: g3.css } }),
                    /* @__PURE__ */ u3("div", { class: "text-xs text-zinc-400 mt-1 truncate", children: g3.name })
                  ]
                },
                g3.id
              )),
              /* @__PURE__ */ u3(
                "button",
                {
                  onClick: () => setSelectedGradient("custom"),
                  class: `p-1 rounded border-2 ${selectedGradient === "custom" ? "border-indigo-500" : "border-transparent hover:border-zinc-600"}`,
                  children: [
                    /* @__PURE__ */ u3("div", { class: "h-12 rounded bg-zinc-800 flex items-center justify-center", children: /* @__PURE__ */ u3("i", { class: "fa-solid fa-code text-zinc-500" }) }),
                    /* @__PURE__ */ u3("div", { class: "text-xs text-zinc-400 mt-1", children: "Custom" })
                  ]
                }
              )
            ] }),
            selectedGradient === "custom" && /* @__PURE__ */ u3("div", { children: [
              /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Custom CSS Gradient" }),
              /* @__PURE__ */ u3(
                "input",
                {
                  type: "text",
                  value: customGradient,
                  onInput: (e3) => setCustomGradient(e3.target.value),
                  class: "w-full px-3 py-2 rounded text-sm font-mono bg-zinc-800 border border-zinc-700",
                  placeholder: "linear-gradient(135deg, #a855f7 0%, #0a0a0a 100%)"
                }
              ),
              /* @__PURE__ */ u3("div", { class: "mt-2 h-16 rounded", style: { background: customGradient } })
            ] }),
            /* @__PURE__ */ u3("div", { class: "mt-3", children: [
              /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Preview" }),
              /* @__PURE__ */ u3("div", { class: "h-20 rounded", style: { background: currentPreviewGradient } })
            ] })
          ] }),
          /* @__PURE__ */ u3("div", { children: [
            /* @__PURE__ */ u3("h3", { class: "text-sm font-medium mb-3", children: "Typography" }),
            /* @__PURE__ */ u3("div", { class: "space-y-3", children: [
              /* @__PURE__ */ u3("div", { children: [
                /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Font Family" }),
                /* @__PURE__ */ u3(
                  "input",
                  {
                    type: "text",
                    value: fontFamily,
                    onInput: (e3) => setFontFamily(e3.target.value),
                    class: "w-full px-3 py-2 rounded text-sm bg-zinc-800 border border-zinc-700",
                    placeholder: "Inter, sans-serif"
                  }
                )
              ] }),
              /* @__PURE__ */ u3("div", { children: [
                /* @__PURE__ */ u3("label", { class: "text-xs text-zinc-500 block mb-1", children: "Google Fonts URL (optional)" }),
                /* @__PURE__ */ u3(
                  "input",
                  {
                    type: "text",
                    value: googleFontsUrl,
                    onInput: (e3) => setGoogleFontsUrl(e3.target.value),
                    class: "w-full px-3 py-2 rounded text-sm font-mono bg-zinc-800 border border-zinc-700",
                    placeholder: "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');"
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ u3("div", { class: "flex gap-3 p-4 border-t border-zinc-800", children: [
          /* @__PURE__ */ u3(
            "button",
            {
              onClick: onClose,
              class: "flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ u3(
            "button",
            {
              onClick: handleSave,
              class: "flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm",
              children: [
                /* @__PURE__ */ u3("i", { class: "fa-solid fa-check mr-1" }),
                " Apply Theme"
              ]
            }
          )
        ] })
      ] })
    }
  );
}

// src/ui/components/modals/MediaManagerModal.tsx
function MediaManagerModal({ assets, onClose, onRefresh }) {
  const [activeTab, setActiveTab] = h2("screenshots");
  const [editingItem, setEditingItem] = h2(null);
  const [newName, setNewName] = h2("");
  const fileInputRef = _(null);
  const [uploading, setUploading] = h2(false);
  const allAssets = {
    screenshots: assets.screenshots || [],
    mascots: assets.mascots || [],
    icons: assets.icons || []
  };
  const currentAssets = allAssets[activeTab] || [];
  const handleUpload = async (e3) => {
    const target = e3.target;
    const files = target.files;
    if (!files?.length)
      return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", activeTab);
      try {
        await fetch("/api/assets/upload", {
          method: "POST",
          body: formData
        });
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }
    await onRefresh();
    setUploading(false);
    target.value = "";
  };
  const handleRename = async (oldPath) => {
    if (!newName.trim())
      return;
    try {
      const res = await fetch("/api/assets/rename", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPath, newName: newName.trim() })
      });
      if (res.ok) {
        await onRefresh();
        setEditingItem(null);
        setNewName("");
      }
    } catch (err) {
      console.error("Rename failed:", err);
    }
  };
  const handleDelete = async (path) => {
    if (!confirm("Delete this file? This cannot be undone."))
      return;
    try {
      const res = await fetch("/api/assets", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path })
      });
      if (res.ok) {
        await onRefresh();
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };
  const startEditing = (path) => {
    setEditingItem(path);
    const filename = path.split("/").pop() || "";
    const lastDot = filename.lastIndexOf(".");
    const nameWithoutExt = lastDot > 0 ? filename.substring(0, lastDot) : filename;
    setNewName(nameWithoutExt);
  };
  const tabs = [
    { id: "screenshots", label: "Screenshots", icon: "fa-mobile-screen" },
    { id: "mascots", label: "Mascots", icon: "fa-user-astronaut" },
    { id: "icons", label: "Icons", icon: "fa-icons" }
  ];
  return /* @__PURE__ */ u3("div", { class: "fixed inset-0 bg-black/70 flex items-center justify-center z-50", onClick: onClose, children: /* @__PURE__ */ u3(
    "div",
    {
      class: "bg-zinc-900 rounded-lg w-[600px] max-h-[80vh] overflow-hidden flex flex-col",
      onClick: (e3) => e3.stopPropagation(),
      children: [
        /* @__PURE__ */ u3("div", { class: "p-4 border-b border-zinc-800", children: /* @__PURE__ */ u3("div", { class: "flex justify-between items-center", children: [
          /* @__PURE__ */ u3("h2", { class: "font-bold text-lg", children: [
            /* @__PURE__ */ u3("i", { class: "fa-solid fa-images mr-2" }),
            "Media Manager"
          ] }),
          /* @__PURE__ */ u3("button", { onClick: onClose, class: "text-zinc-500 hover:text-white text-xl", children: /* @__PURE__ */ u3("i", { class: "fa-solid fa-xmark" }) })
        ] }) }),
        /* @__PURE__ */ u3("div", { class: "flex border-b border-zinc-800", children: tabs.map((tab) => /* @__PURE__ */ u3(
          "button",
          {
            onClick: () => setActiveTab(tab.id),
            class: `flex-1 px-4 py-3 text-sm flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === tab.id ? "border-indigo-500 text-white bg-zinc-800/50" : "border-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/30"}`,
            children: [
              /* @__PURE__ */ u3("i", { class: `fa-solid ${tab.icon}` }),
              tab.label,
              /* @__PURE__ */ u3("span", { class: "text-xs px-1.5 py-0.5 rounded bg-zinc-700", children: allAssets[tab.id].length })
            ]
          },
          tab.id
        )) }),
        /* @__PURE__ */ u3("div", { class: "flex-1 overflow-y-auto p-4", children: currentAssets.length === 0 ? /* @__PURE__ */ u3("div", { class: "text-center py-12 text-zinc-500", children: [
          /* @__PURE__ */ u3("i", { class: "fa-solid fa-folder-open text-4xl mb-3" }),
          /* @__PURE__ */ u3("div", { children: [
            "No ",
            activeTab,
            " yet"
          ] }),
          /* @__PURE__ */ u3("div", { class: "text-sm mt-1", children: "Upload some files to get started" })
        ] }) : /* @__PURE__ */ u3("div", { class: "grid grid-cols-3 gap-3", children: currentAssets.map((path) => {
          const filename = path.split("/").pop() || "";
          const isEditing = editingItem === path;
          return /* @__PURE__ */ u3("div", { class: "bg-zinc-800 rounded overflow-hidden group", children: [
            /* @__PURE__ */ u3("div", { class: "aspect-square bg-zinc-700 relative", children: [
              /* @__PURE__ */ u3(
                "img",
                {
                  src: "/assets/" + path.replace("assets/", ""),
                  class: "w-full h-full object-contain",
                  loading: "lazy"
                }
              ),
              /* @__PURE__ */ u3("div", { class: "absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2", children: [
                /* @__PURE__ */ u3(
                  "button",
                  {
                    onClick: () => startEditing(path),
                    class: "p-2 bg-zinc-700 hover:bg-zinc-600 rounded",
                    title: "Rename",
                    children: /* @__PURE__ */ u3("i", { class: "fa-solid fa-pen" })
                  }
                ),
                /* @__PURE__ */ u3(
                  "button",
                  {
                    onClick: () => handleDelete(path),
                    class: "p-2 bg-red-900/80 hover:bg-red-800 rounded",
                    title: "Delete",
                    children: /* @__PURE__ */ u3("i", { class: "fa-solid fa-trash" })
                  }
                )
              ] })
            ] }),
            isEditing ? /* @__PURE__ */ u3("div", { class: "p-2", children: [
              /* @__PURE__ */ u3(
                "input",
                {
                  type: "text",
                  value: newName,
                  onInput: (e3) => setNewName(e3.target.value),
                  onKeyDown: (e3) => {
                    if (e3.key === "Enter")
                      handleRename(path);
                    if (e3.key === "Escape") {
                      setEditingItem(null);
                      setNewName("");
                    }
                  },
                  class: "w-full px-2 py-1 text-xs rounded bg-zinc-700 border border-zinc-600",
                  autoFocus: true
                }
              ),
              /* @__PURE__ */ u3("div", { class: "flex gap-1 mt-1", children: [
                /* @__PURE__ */ u3(
                  "button",
                  {
                    onClick: () => handleRename(path),
                    class: "flex-1 px-2 py-1 text-xs bg-indigo-600 hover:bg-indigo-500 rounded",
                    children: "Save"
                  }
                ),
                /* @__PURE__ */ u3(
                  "button",
                  {
                    onClick: () => {
                      setEditingItem(null);
                      setNewName("");
                    },
                    class: "flex-1 px-2 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 rounded",
                    children: "Cancel"
                  }
                )
              ] })
            ] }) : /* @__PURE__ */ u3("div", { class: "p-2 text-xs text-zinc-400 truncate", title: filename, children: filename })
          ] }, path);
        }) }) }),
        /* @__PURE__ */ u3("div", { class: "p-4 border-t border-zinc-800", children: [
          /* @__PURE__ */ u3(
            "input",
            {
              ref: fileInputRef,
              type: "file",
              accept: "image/*",
              multiple: true,
              onChange: handleUpload,
              class: "hidden"
            }
          ),
          /* @__PURE__ */ u3(
            "button",
            {
              onClick: () => fileInputRef.current?.click(),
              disabled: uploading,
              class: `w-full py-2 rounded text-sm flex items-center justify-center gap-2 ${uploading ? "bg-zinc-700 text-zinc-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500"}`,
              children: uploading ? /* @__PURE__ */ u3(g, { children: [
                /* @__PURE__ */ u3("i", { class: "fa-solid fa-spinner fa-spin" }),
                "Uploading..."
              ] }) : /* @__PURE__ */ u3(g, { children: [
                /* @__PURE__ */ u3("i", { class: "fa-solid fa-upload" }),
                "Upload Files"
              ] })
            }
          )
        ] })
      ]
    }
  ) });
}

// src/ui/utils/routing.ts
function parseUrlParams() {
  const path = location.pathname;
  const parts = path.split("/").filter(Boolean);
  return {
    project: parts[0] || null,
    lang: parts[1] || null,
    platform: parts[2] || null,
    screenshotId: parts[3] || null
  };
}
function buildUrl(project, lang, platform, screenshotId) {
  let url = "/" + project;
  if (lang)
    url += "/" + lang;
  if (platform)
    url += "/" + platform;
  if (screenshotId)
    url += "/" + screenshotId;
  return url;
}

// src/ui/utils/api.ts
async function saveConfig(config) {
  await fetch("/api/config", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config)
  });
}
async function fetchAssets() {
  const res = await fetch("/api/assets");
  return res.json();
}
async function activateProject(projectId) {
  const res = await fetch(`/api/projects/${projectId}/activate`, { method: "PUT" });
  return res.json();
}
async function createProject(name) {
  const res = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  });
  return res.json();
}
async function deleteProject(projectId) {
  await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
}
async function renameProject(projectId, name) {
  const res = await fetch(`/api/projects/${projectId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  });
  return res.json();
}

// src/ui/components/App.tsx
function App() {
  const appData2 = __APP_DATA__;
  const urlParams = parseUrlParams();
  const validProject = appData2.projects.find((p3) => p3.id === urlParams.project);
  const initialProject = validProject ? urlParams.project : appData2.projectId;
  const [config, setConfig] = h2(appData2.config);
  const [projects, setProjects] = h2(appData2.projects);
  const [currentProject, setCurrentProject] = h2(initialProject);
  const [selectedLang, setSelectedLang] = h2(() => {
    if (urlParams.lang && config.languages?.find((l3) => l3.language === urlParams.lang)) {
      return urlParams.lang;
    }
    return config.languages?.[0]?.language || "en";
  });
  const [selectedPlatform, setSelectedPlatform] = h2(() => {
    if (urlParams.platform && ["android", "ios"].includes(urlParams.platform)) {
      return urlParams.platform;
    }
    return "android";
  });
  const [selectedItem, setSelectedItem] = h2(() => {
    if (urlParams.screenshotId === "feature-graphic") {
      return { type: "feature-graphic" };
    }
    if (urlParams.screenshotId) {
      return { type: "screenshot", id: urlParams.screenshotId };
    }
    return null;
  });
  const [assets, setAssets] = h2({ screenshots: [], icons: [], mascots: [] });
  const [generating, setGenerating] = h2(false);
  const [showProjectModal, setShowProjectModal] = h2(false);
  const [showGenerateModal, setShowGenerateModal] = h2(false);
  const [showThemeEditor, setShowThemeEditor] = h2(false);
  const [showMediaManager, setShowMediaManager] = h2(false);
  const [lastGenerated, setLastGenerated] = h2(null);
  const [generateProgress, setGenerateProgress] = h2({
    current: 0,
    total: 0,
    item: "",
    results: null,
    outputDir: ""
  });
  const [previewVersion, setPreviewVersion] = h2(0);
  const saveTimeoutRef = _(null);
  const pendingConfigRef = _(null);
  const SAVE_DEBOUNCE_MS = 50;
  const fetchLastGenerated = async () => {
    try {
      const res = await fetch("/api/generated");
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        setLastGenerated(data);
      } else {
        setLastGenerated(null);
      }
    } catch {
      setLastGenerated(null);
    }
  };
  p2(() => {
    fetchAssets().then(setAssets);
    fetchLastGenerated();
  }, [currentProject]);
  p2(() => {
    if (!currentProject)
      return;
    const screenshotId = selectedItem?.type === "feature-graphic" ? "feature-graphic" : selectedItem?.type === "screenshot" ? selectedItem.id : null;
    const newUrl = buildUrl(currentProject, selectedLang, selectedPlatform, screenshotId);
    if (location.pathname !== newUrl) {
      history.pushState({}, "", newUrl);
    }
  }, [currentProject, selectedLang, selectedPlatform, selectedItem]);
  const getLangConfig = () => config.languages?.find((l3) => l3.language === selectedLang);
  const getPlatformConfig = () => getLangConfig()?.platforms?.[selectedPlatform];
  const getScreenshots = () => getPlatformConfig()?.screenshots || [];
  const getFeatureGraphic = () => getLangConfig()?.platforms?.android?.featureGraphic ?? void 0;
  const persistConfig = async (configToPersist) => {
    await saveConfig(configToPersist);
  };
  const flushPendingSave = async (refreshPreview = true) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    if (!pendingConfigRef.current)
      return;
    const configToPersist = pendingConfigRef.current;
    pendingConfigRef.current = null;
    await persistConfig(configToPersist);
    if (refreshPreview) {
      setPreviewVersion((v3) => v3 + 1);
    }
  };
  const saveConfig2 = (newConfig) => {
    setConfig(newConfig);
    pendingConfigRef.current = newConfig;
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(async () => {
      await flushPendingSave(true);
    }, SAVE_DEBOUNCE_MS);
  };
  const updateScreenshot = (id, updates) => {
    const newConfig = { ...config };
    const langConfig = newConfig.languages?.find((l3) => l3.language === selectedLang);
    const platformConfig = langConfig?.platforms?.[selectedPlatform];
    if (platformConfig) {
      const idx = platformConfig.screenshots.findIndex((s3) => s3.id === id);
      if (idx !== -1) {
        platformConfig.screenshots[idx] = { ...platformConfig.screenshots[idx], ...updates };
        saveConfig2(newConfig);
      }
    }
  };
  const updateFeatureGraphic = (updates) => {
    const newConfig = { ...config };
    const langConfig = newConfig.languages?.find((l3) => l3.language === selectedLang);
    if (langConfig?.platforms?.android) {
      langConfig.platforms.android.featureGraphic = {
        ...langConfig.platforms.android.featureGraphic || {},
        ...updates
      };
      saveConfig2(newConfig);
    }
  };
  const addScreenshot = () => {
    const id = "screenshot-" + Date.now();
    const newScreenshot = {
      id,
      headline: "New Screenshot",
      subtitle: "Add a subtitle",
      imagePath: "",
      glows: [{ color: "purple", size: 400, top: "10%", left: "20%" }],
      phoneFrame: { scale: 70, bottomOffset: 6 }
    };
    const newConfig = { ...config };
    const langConfig = newConfig.languages?.find((l3) => l3.language === selectedLang);
    if (langConfig?.platforms?.[selectedPlatform]) {
      langConfig.platforms[selectedPlatform].screenshots.push(newScreenshot);
      saveConfig2(newConfig);
      setSelectedItem({ type: "screenshot", id });
    }
  };
  const deleteScreenshot = (id) => {
    const newConfig = { ...config };
    const langConfig = newConfig.languages?.find((l3) => l3.language === selectedLang);
    if (langConfig?.platforms?.[selectedPlatform]) {
      langConfig.platforms[selectedPlatform].screenshots = langConfig.platforms[selectedPlatform].screenshots.filter((s3) => s3.id !== id);
      saveConfig2(newConfig);
      if (selectedItem?.type === "screenshot" && selectedItem.id === id) {
        setSelectedItem(null);
      }
    }
  };
  const refreshAssets = async () => {
    const newAssets = await fetchAssets();
    setAssets(newAssets);
  };
  const switchProject = async (projectId) => {
    await flushPendingSave(false);
    const data = await activateProject(projectId);
    setCurrentProject(projectId);
    setConfig(data.config);
    setSelectedLang(data.config.languages?.[0]?.language || "en");
    setSelectedItem(null);
    const newAssets = await fetchAssets();
    setAssets(newAssets);
  };
  const addLanguage = async (language, copyFrom) => {
    const res = await fetch("/api/config/language", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, copyFrom })
    });
    if (res.ok) {
      const newLang = await res.json();
      const newConfig = { ...config };
      if (!newConfig.languages)
        newConfig.languages = [];
      newConfig.languages.push(newLang);
      setConfig(newConfig);
      setSelectedLang(language);
    }
  };
  const copyPlatformConfig = async (sourcePlatform, targetPlatform) => {
    const res = await fetch("/api/config/copy-platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: selectedLang,
        sourcePlatform,
        targetPlatform
      })
    });
    if (res.ok) {
      const updatedLang = await res.json();
      const newConfig = { ...config };
      const langIndex = newConfig.languages?.findIndex((l3) => l3.language === selectedLang) ?? -1;
      if (langIndex >= 0 && newConfig.languages) {
        newConfig.languages[langIndex] = updatedLang;
      }
      setConfig(newConfig);
      setSelectedPlatform(targetPlatform);
      setSelectedItem(null);
    }
  };
  const handleCreateProject = async (name) => {
    const project = await createProject(name);
    setProjects([...projects, project]);
    await switchProject(project.id);
    setShowProjectModal(false);
  };
  const handleDeleteProject = async (projectId) => {
    await deleteProject(projectId);
    setProjects(projects.filter((p3) => p3.id !== projectId));
    if (currentProject === projectId && projects.length > 1) {
      const remaining = projects.filter((p3) => p3.id !== projectId);
      if (remaining.length > 0) {
        await switchProject(remaining[0].id);
      }
    }
  };
  const handleRenameProject = async (projectId, newName) => {
    const updated = await renameProject(projectId, newName);
    setProjects(projects.map((p3) => p3.id === projectId ? updated : p3));
    if (currentProject === projectId) {
      const config2 = await fetch("/api/config").then((r3) => r3.json());
      setConfig(config2);
    }
  };
  const generateAll = async () => {
    await flushPendingSave();
    setShowGenerateModal(true);
    setGenerateProgress({ current: 0, total: 0, item: "Starting...", results: null, outputDir: "" });
    setGenerating(true);
    try {
      const response = await fetch("/api/generate/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
      const reader = response.body?.getReader();
      if (!reader)
        throw new Error("No response body");
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done)
          break;
        const text = decoder.decode(value);
        const lines = text.split("\n").filter((l3) => l3.startsWith("data: "));
        for (const line of lines) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === "start") {
              setGenerateProgress((prev) => ({ ...prev, total: data.total }));
            } else if (data.type === "progress") {
              setGenerateProgress((prev) => ({ ...prev, current: data.current, item: data.item }));
            } else if (data.type === "complete") {
              setGenerateProgress((prev) => ({ ...prev, results: data.results, outputDir: data.outputDir, current: prev.total }));
            }
          } catch {
          }
        }
      }
    } catch (error) {
      alert("Generation failed: " + error.message);
      setShowGenerateModal(false);
    }
    setGenerating(false);
    fetchLastGenerated();
  };
  const viewLastGenerated = () => {
    if (lastGenerated) {
      setGenerateProgress({
        current: lastGenerated.results.length,
        total: lastGenerated.results.length,
        item: "",
        results: lastGenerated.results,
        outputDir: lastGenerated.outputDir
      });
      setShowGenerateModal(true);
    }
  };
  const getSelectedScreenshot = () => {
    if (selectedItem?.type === "screenshot") {
      return getScreenshots().find((s3) => s3.id === selectedItem.id);
    }
    return void 0;
  };
  const getPreviewUrl = () => {
    if (selectedItem?.type === "screenshot" && selectedItem.id) {
      return `/preview/screenshot/${selectedLang}/${selectedPlatform}/${selectedItem.id}`;
    }
    if (selectedItem?.type === "feature-graphic") {
      return `/preview/feature-graphic/${selectedLang}`;
    }
    return null;
  };
  const selectedScreenshot = getSelectedScreenshot();
  const featureGraphic = getFeatureGraphic();
  const previewUrl = getPreviewUrl();
  return /* @__PURE__ */ u3("div", { class: "flex h-screen bg-zinc-950 text-white overflow-hidden", children: [
    /* @__PURE__ */ u3(
      Sidebar,
      {
        config,
        projects,
        currentProject,
        selectedLang,
        selectedPlatform,
        selectedItem,
        screenshots: getScreenshots(),
        featureGraphic,
        assets,
        onSelectLang: setSelectedLang,
        onSelectPlatform: setSelectedPlatform,
        onSelectItem: setSelectedItem,
        onAddScreenshot: addScreenshot,
        onDeleteScreenshot: deleteScreenshot,
        onSwitchProject: switchProject,
        onShowProjectModal: () => setShowProjectModal(true),
        onGenerate: generateAll,
        onAddLanguage: addLanguage,
        onCopyPlatformConfig: copyPlatformConfig,
        onShowThemeEditor: () => setShowThemeEditor(true),
        onShowMediaManager: () => setShowMediaManager(true),
        generating,
        lastGenerated,
        onViewLastGenerated: viewLastGenerated
      }
    ),
    /* @__PURE__ */ u3("div", { class: "flex-1 flex flex-col min-w-0", children: /* @__PURE__ */ u3("div", { class: "flex-1 flex items-center justify-center p-8 bg-zinc-900/50", children: previewUrl ? /* @__PURE__ */ u3(
      Preview,
      {
        url: previewUrl,
        type: selectedItem?.type === "feature-graphic" ? "feature-graphic" : "screenshot",
        version: previewVersion
      }
    ) : /* @__PURE__ */ u3("div", { class: "text-zinc-500", children: "Select a screenshot or feature graphic to preview" }) }) }),
    selectedScreenshot && /* @__PURE__ */ u3(
      ScreenshotEditor,
      {
        screenshot: selectedScreenshot,
        assets,
        config,
        onUpdate: (updates) => updateScreenshot(selectedScreenshot.id, updates),
        onUpdateConfig: saveConfig2,
        onAssetsRefresh: refreshAssets
      }
    ),
    selectedItem?.type === "feature-graphic" && featureGraphic && /* @__PURE__ */ u3(
      FeatureGraphicEditor,
      {
        featureGraphic,
        assets,
        config,
        onUpdate: updateFeatureGraphic,
        onUpdateConfig: saveConfig2,
        onAssetsRefresh: refreshAssets
      }
    ),
    showProjectModal && /* @__PURE__ */ u3(
      ProjectModal,
      {
        projects,
        currentProject,
        onClose: () => setShowProjectModal(false),
        onCreate: handleCreateProject,
        onSwitch: switchProject,
        onDelete: handleDeleteProject,
        onRename: handleRenameProject
      }
    ),
    showGenerateModal && /* @__PURE__ */ u3(
      GenerateModal,
      {
        progress: generateProgress,
        generating,
        onClose: () => setShowGenerateModal(false)
      }
    ),
    showThemeEditor && /* @__PURE__ */ u3(
      ThemeEditorModal,
      {
        config,
        onClose: () => setShowThemeEditor(false),
        onSave: (newConfig) => {
          saveConfig2(newConfig);
          setShowThemeEditor(false);
        }
      }
    ),
    showMediaManager && /* @__PURE__ */ u3(
      MediaManagerModal,
      {
        assets,
        onClose: () => setShowMediaManager(false),
        onRefresh: refreshAssets
      }
    )
  ] });
}

// src/ui/main.tsx
var appData = self.__APP_DATA__;
self.GRADIENT_TEMPLATES = appData.gradientTemplates || {};
self.DEFAULT_PALETTES = appData.palettes || {};
self.applyPaletteToGradient = (template, palette) => {
  return template.replace(/\{primary\}/g, palette.primary).replace(/\{secondary\}/g, palette.secondary).replace(/\{accent\}/g, palette.accent);
};
q(/* @__PURE__ */ u3(App, {}), document.getElementById("app"));
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vbm9kZV9tb2R1bGVzLy5kZW5vL3ByZWFjdEAxMC4xOS4yL25vZGVfbW9kdWxlcy9wcmVhY3Qvc3JjL2NvbnN0YW50cy5qcyIsICIuLi9ub2RlX21vZHVsZXMvLmRlbm8vcHJlYWN0QDEwLjE5LjIvbm9kZV9tb2R1bGVzL3ByZWFjdC9zcmMvdXRpbC5qcyIsICIuLi9ub2RlX21vZHVsZXMvLmRlbm8vcHJlYWN0QDEwLjE5LjIvbm9kZV9tb2R1bGVzL3ByZWFjdC9zcmMvb3B0aW9ucy5qcyIsICIuLi9ub2RlX21vZHVsZXMvLmRlbm8vcHJlYWN0QDEwLjE5LjIvbm9kZV9tb2R1bGVzL3ByZWFjdC9zcmMvY3JlYXRlLWVsZW1lbnQuanMiLCAiLi4vbm9kZV9tb2R1bGVzLy5kZW5vL3ByZWFjdEAxMC4xOS4yL25vZGVfbW9kdWxlcy9wcmVhY3Qvc3JjL2NvbXBvbmVudC5qcyIsICIuLi9ub2RlX21vZHVsZXMvLmRlbm8vcHJlYWN0QDEwLjE5LjIvbm9kZV9tb2R1bGVzL3ByZWFjdC9zcmMvY3JlYXRlLWNvbnRleHQuanMiLCAiLi4vbm9kZV9tb2R1bGVzLy5kZW5vL3ByZWFjdEAxMC4xOS4yL25vZGVfbW9kdWxlcy9wcmVhY3Qvc3JjL2RpZmYvY2hpbGRyZW4uanMiLCAiLi4vbm9kZV9tb2R1bGVzLy5kZW5vL3ByZWFjdEAxMC4xOS4yL25vZGVfbW9kdWxlcy9wcmVhY3Qvc3JjL2RpZmYvcHJvcHMuanMiLCAiLi4vbm9kZV9tb2R1bGVzLy5kZW5vL3ByZWFjdEAxMC4xOS4yL25vZGVfbW9kdWxlcy9wcmVhY3Qvc3JjL2RpZmYvaW5kZXguanMiLCAiLi4vbm9kZV9tb2R1bGVzLy5kZW5vL3ByZWFjdEAxMC4xOS4yL25vZGVfbW9kdWxlcy9wcmVhY3Qvc3JjL3JlbmRlci5qcyIsICIuLi9ub2RlX21vZHVsZXMvLmRlbm8vcHJlYWN0QDEwLjE5LjIvbm9kZV9tb2R1bGVzL3ByZWFjdC9zcmMvY2xvbmUtZWxlbWVudC5qcyIsICIuLi9ub2RlX21vZHVsZXMvLmRlbm8vcHJlYWN0QDEwLjE5LjIvbm9kZV9tb2R1bGVzL3ByZWFjdC9zcmMvZGlmZi9jYXRjaC1lcnJvci5qcyIsICIuLi9ub2RlX21vZHVsZXMvLmRlbm8vcHJlYWN0QDEwLjE5LjIvbm9kZV9tb2R1bGVzL3ByZWFjdC9ob29rcy9zcmMvaW5kZXguanMiLCAiLi4vbm9kZV9tb2R1bGVzLy5kZW5vL3ByZWFjdEAxMC4xOS4yL25vZGVfbW9kdWxlcy9wcmVhY3QvanN4LXJ1bnRpbWUvc3JjL3V0aWxzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy8uZGVuby9wcmVhY3RAMTAuMTkuMi9ub2RlX21vZHVsZXMvcHJlYWN0L3NyYy9jb25zdGFudHMuanMiLCAiLi4vbm9kZV9tb2R1bGVzLy5kZW5vL3ByZWFjdEAxMC4xOS4yL25vZGVfbW9kdWxlcy9wcmVhY3QvanN4LXJ1bnRpbWUvc3JjL2luZGV4LmpzIiwgIi4uL3NyYy91aS9jb21wb25lbnRzL1NpZGViYXIudHN4IiwgIi4uL3NyYy91aS9jb21wb25lbnRzL1ByZXZpZXcudHN4IiwgIi4uL3NyYy91aS9jb21wb25lbnRzL2lucHV0cy9OdW1iZXJJbnB1dC50c3giLCAiLi4vc3JjL3VpL2NvbXBvbmVudHMvaW5wdXRzL0NvbG9ySW5wdXQudHN4IiwgIi4uL3NyYy91aS9jb21wb25lbnRzL2lucHV0cy9TbGlkZXIudHN4IiwgIi4uL3NyYy91aS9jb21wb25lbnRzL2lucHV0cy9MYWJlbGVkQ29sb3JJbnB1dC50c3giLCAiLi4vc3JjL3VpL2NvbXBvbmVudHMvaW5wdXRzL0ltYWdlU2VsZWN0LnRzeCIsICIuLi9zcmMvdWkvY29tcG9uZW50cy9Db2xsYXBzaWJsZVNlY3Rpb24udHN4IiwgIi4uL3NyYy91aS9jb21wb25lbnRzL2VkaXRvcnMvR2xvd0VkaXRvcklubGluZS50c3giLCAiLi4vc3JjL3VpL2NvbXBvbmVudHMvZWRpdG9ycy9TaGFwZUVkaXRvcklubGluZS50c3giLCAiLi4vc3JjL3VpL2NvbXBvbmVudHMvZWRpdG9ycy9NYXNjb3RFZGl0b3JJbmxpbmUudHN4IiwgIi4uL3NyYy91aS9jb21wb25lbnRzL2VkaXRvcnMvU2NyZWVuc2hvdEVkaXRvci50c3giLCAiLi4vc3JjL3VpL2NvbXBvbmVudHMvZWRpdG9ycy9GZWF0dXJlR3JhcGhpY0VkaXRvci50c3giLCAiLi4vc3JjL3VpL2NvbXBvbmVudHMvbW9kYWxzL1Byb2plY3RNb2RhbC50c3giLCAiLi4vc3JjL3VpL2NvbXBvbmVudHMvbW9kYWxzL0dlbmVyYXRlTW9kYWwudHN4IiwgIi4uL3NyYy91aS9jb21wb25lbnRzL21vZGFscy9UaGVtZUVkaXRvck1vZGFsLnRzeCIsICIuLi9zcmMvdWkvY29tcG9uZW50cy9tb2RhbHMvTWVkaWFNYW5hZ2VyTW9kYWwudHN4IiwgIi4uL3NyYy91aS91dGlscy9yb3V0aW5nLnRzIiwgIi4uL3NyYy91aS91dGlscy9hcGkudHMiLCAiLi4vc3JjL3VpL2NvbXBvbmVudHMvQXBwLnRzeCIsICIuLi9zcmMvdWkvbWFpbi50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qKiBOb3JtYWwgaHlkcmF0aW9uIHRoYXQgYXR0YWNoZXMgdG8gYSBET00gdHJlZSBidXQgZG9lcyBub3QgZGlmZiBpdC4gKi9cbmV4cG9ydCBjb25zdCBNT0RFX0hZRFJBVEUgPSAxIDw8IDU7XG4vKiogU2lnbmlmaWVzIHRoaXMgVk5vZGUgc3VzcGVuZGVkIG9uIHRoZSBwcmV2aW91cyByZW5kZXIgKi9cbmV4cG9ydCBjb25zdCBNT0RFX1NVU1BFTkRFRCA9IDEgPDwgNztcbi8qKiBJbmRpY2F0ZXMgdGhhdCB0aGlzIG5vZGUgbmVlZHMgdG8gYmUgaW5zZXJ0ZWQgd2hpbGUgcGF0Y2hpbmcgY2hpbGRyZW4gKi9cbmV4cG9ydCBjb25zdCBJTlNFUlRfVk5PREUgPSAxIDw8IDE2O1xuLyoqIEluZGljYXRlcyBhIFZOb2RlIGhhcyBiZWVuIG1hdGNoZWQgd2l0aCBhbm90aGVyIFZOb2RlIGluIHRoZSBkaWZmICovXG5leHBvcnQgY29uc3QgTUFUQ0hFRCA9IDEgPDwgMTc7XG5cbi8qKiBSZXNldCBhbGwgbW9kZSBmbGFncyAqL1xuZXhwb3J0IGNvbnN0IFJFU0VUX01PREUgPSB+KE1PREVfSFlEUkFURSB8IE1PREVfU1VTUEVOREVEKTtcblxuZXhwb3J0IGNvbnN0IEVNUFRZX09CSiA9IC8qKiBAdHlwZSB7YW55fSAqLyAoe30pO1xuZXhwb3J0IGNvbnN0IEVNUFRZX0FSUiA9IFtdO1xuZXhwb3J0IGNvbnN0IElTX05PTl9ESU1FTlNJT05BTCA9XG5cdC9hY2l0fGV4KD86c3xnfG58cHwkKXxycGh8Z3JpZHxvd3N8bW5jfG50d3xpbmVbY2hdfHpvb3xeb3JkfGl0ZXJhL2k7XG4iLCAiaW1wb3J0IHsgRU1QVFlfQVJSIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG5leHBvcnQgY29uc3QgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbi8qKlxuICogQXNzaWduIHByb3BlcnRpZXMgZnJvbSBgcHJvcHNgIHRvIGBvYmpgXG4gKiBAdGVtcGxhdGUgTywgUCBUaGUgb2JqIGFuZCBwcm9wcyB0eXBlc1xuICogQHBhcmFtIHtPfSBvYmogVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgdG9cbiAqIEBwYXJhbSB7UH0gcHJvcHMgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbVxuICogQHJldHVybnMge08gJiBQfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYXNzaWduKG9iaiwgcHJvcHMpIHtcblx0Ly8gQHRzLWV4cGVjdC1lcnJvciBXZSBjaGFuZ2UgdGhlIHR5cGUgb2YgYG9iamAgdG8gYmUgYE8gJiBQYFxuXHRmb3IgKGxldCBpIGluIHByb3BzKSBvYmpbaV0gPSBwcm9wc1tpXTtcblx0cmV0dXJuIC8qKiBAdHlwZSB7TyAmIFB9ICovIChvYmopO1xufVxuXG4vKipcbiAqIFJlbW92ZSBhIGNoaWxkIG5vZGUgZnJvbSBpdHMgcGFyZW50IGlmIGF0dGFjaGVkLiBUaGlzIGlzIGEgd29ya2Fyb3VuZCBmb3JcbiAqIElFMTEgd2hpY2ggZG9lc24ndCBzdXBwb3J0IGBFbGVtZW50LnByb3RvdHlwZS5yZW1vdmUoKWAuIFVzaW5nIHRoaXMgZnVuY3Rpb25cbiAqIGlzIHNtYWxsZXIgdGhhbiBpbmNsdWRpbmcgYSBkZWRpY2F0ZWQgcG9seWZpbGwuXG4gKiBAcGFyYW0ge3ByZWFjdC5Db250YWluZXJOb2RlfSBub2RlIFRoZSBub2RlIHRvIHJlbW92ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlTm9kZShub2RlKSB7XG5cdGxldCBwYXJlbnROb2RlID0gbm9kZS5wYXJlbnROb2RlO1xuXHRpZiAocGFyZW50Tm9kZSkgcGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbn1cblxuZXhwb3J0IGNvbnN0IHNsaWNlID0gRU1QVFlfQVJSLnNsaWNlO1xuIiwgImltcG9ydCB7IF9jYXRjaEVycm9yIH0gZnJvbSAnLi9kaWZmL2NhdGNoLWVycm9yJztcblxuLyoqXG4gKiBUaGUgYG9wdGlvbmAgb2JqZWN0IGNhbiBwb3RlbnRpYWxseSBjb250YWluIGNhbGxiYWNrIGZ1bmN0aW9uc1xuICogdGhhdCBhcmUgY2FsbGVkIGR1cmluZyB2YXJpb3VzIHN0YWdlcyBvZiBvdXIgcmVuZGVyZXIuIFRoaXMgaXMgdGhlXG4gKiBmb3VuZGF0aW9uIG9uIHdoaWNoIGFsbCBvdXIgYWRkb25zIGxpa2UgYHByZWFjdC9kZWJ1Z2AsIGBwcmVhY3QvY29tcGF0YCxcbiAqIGFuZCBgcHJlYWN0L2hvb2tzYCBhcmUgYmFzZWQgb24uIFNlZSB0aGUgYE9wdGlvbnNgIHR5cGUgaW4gYGludGVybmFsLmQudHNgXG4gKiBmb3IgYSBmdWxsIGxpc3Qgb2YgYXZhaWxhYmxlIG9wdGlvbiBob29rcyAobW9zdCBlZGl0b3JzL0lERXMgYWxsb3cgeW91IHRvXG4gKiBjdHJsK2NsaWNrIG9yIGNtZCtjbGljayBvbiBtYWMgdGhlIHR5cGUgZGVmaW5pdGlvbiBiZWxvdykuXG4gKiBAdHlwZSB7T3B0aW9uc31cbiAqL1xuY29uc3Qgb3B0aW9ucyA9IHtcblx0X2NhdGNoRXJyb3Jcbn07XG5cbmV4cG9ydCBkZWZhdWx0IG9wdGlvbnM7XG4iLCAiaW1wb3J0IHsgc2xpY2UgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IG9wdGlvbnMgZnJvbSAnLi9vcHRpb25zJztcblxubGV0IHZub2RlSWQgPSAwO1xuXG4vKipcbiAqIENyZWF0ZSBhbiB2aXJ0dWFsIG5vZGUgKHVzZWQgZm9yIEpTWClcbiAqIEBwYXJhbSB7Vk5vZGVbXCJ0eXBlXCJdfSB0eXBlIFRoZSBub2RlIG5hbWUgb3IgQ29tcG9uZW50IGNvbnN0cnVjdG9yIGZvciB0aGlzXG4gKiB2aXJ0dWFsIG5vZGVcbiAqIEBwYXJhbSB7b2JqZWN0IHwgbnVsbCB8IHVuZGVmaW5lZH0gW3Byb3BzXSBUaGUgcHJvcGVydGllcyBvZiB0aGUgdmlydHVhbCBub2RlXG4gKiBAcGFyYW0ge0FycmF5PGltcG9ydCgnLicpLkNvbXBvbmVudENoaWxkcmVuPn0gW2NoaWxkcmVuXSBUaGUgY2hpbGRyZW4gb2YgdGhlXG4gKiB2aXJ0dWFsIG5vZGVcbiAqIEByZXR1cm5zIHtWTm9kZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodHlwZSwgcHJvcHMsIGNoaWxkcmVuKSB7XG5cdGxldCBub3JtYWxpemVkUHJvcHMgPSB7fSxcblx0XHRrZXksXG5cdFx0cmVmLFxuXHRcdGk7XG5cdGZvciAoaSBpbiBwcm9wcykge1xuXHRcdGlmIChpID09ICdrZXknKSBrZXkgPSBwcm9wc1tpXTtcblx0XHRlbHNlIGlmIChpID09ICdyZWYnKSByZWYgPSBwcm9wc1tpXTtcblx0XHRlbHNlIG5vcm1hbGl6ZWRQcm9wc1tpXSA9IHByb3BzW2ldO1xuXHR9XG5cblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyKSB7XG5cdFx0bm9ybWFsaXplZFByb3BzLmNoaWxkcmVuID1cblx0XHRcdGFyZ3VtZW50cy5sZW5ndGggPiAzID8gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpIDogY2hpbGRyZW47XG5cdH1cblxuXHQvLyBJZiBhIENvbXBvbmVudCBWTm9kZSwgY2hlY2sgZm9yIGFuZCBhcHBseSBkZWZhdWx0UHJvcHNcblx0Ly8gTm90ZTogdHlwZSBtYXkgYmUgdW5kZWZpbmVkIGluIGRldmVsb3BtZW50LCBtdXN0IG5ldmVyIGVycm9yIGhlcmUuXG5cdGlmICh0eXBlb2YgdHlwZSA9PSAnZnVuY3Rpb24nICYmIHR5cGUuZGVmYXVsdFByb3BzICE9IG51bGwpIHtcblx0XHRmb3IgKGkgaW4gdHlwZS5kZWZhdWx0UHJvcHMpIHtcblx0XHRcdGlmIChub3JtYWxpemVkUHJvcHNbaV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRub3JtYWxpemVkUHJvcHNbaV0gPSB0eXBlLmRlZmF1bHRQcm9wc1tpXTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gY3JlYXRlVk5vZGUodHlwZSwgbm9ybWFsaXplZFByb3BzLCBrZXksIHJlZiwgbnVsbCk7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgVk5vZGUgKHVzZWQgaW50ZXJuYWxseSBieSBQcmVhY3QpXG4gKiBAcGFyYW0ge1ZOb2RlW1widHlwZVwiXX0gdHlwZSBUaGUgbm9kZSBuYW1lIG9yIENvbXBvbmVudFxuICogQ29uc3RydWN0b3IgZm9yIHRoaXMgdmlydHVhbCBub2RlXG4gKiBAcGFyYW0ge29iamVjdCB8IHN0cmluZyB8IG51bWJlciB8IG51bGx9IHByb3BzIFRoZSBwcm9wZXJ0aWVzIG9mIHRoaXMgdmlydHVhbCBub2RlLlxuICogSWYgdGhpcyB2aXJ0dWFsIG5vZGUgcmVwcmVzZW50cyBhIHRleHQgbm9kZSwgdGhpcyBpcyB0aGUgdGV4dCBvZiB0aGUgbm9kZSAoc3RyaW5nIG9yIG51bWJlcikuXG4gKiBAcGFyYW0ge3N0cmluZyB8IG51bWJlciB8IG51bGx9IGtleSBUaGUga2V5IGZvciB0aGlzIHZpcnR1YWwgbm9kZSwgdXNlZCB3aGVuXG4gKiBkaWZmaW5nIGl0IGFnYWluc3QgaXRzIGNoaWxkcmVuXG4gKiBAcGFyYW0ge1ZOb2RlW1wicmVmXCJdfSByZWYgVGhlIHJlZiBwcm9wZXJ0eSB0aGF0IHdpbGxcbiAqIHJlY2VpdmUgYSByZWZlcmVuY2UgdG8gaXRzIGNyZWF0ZWQgY2hpbGRcbiAqIEByZXR1cm5zIHtWTm9kZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVZOb2RlKHR5cGUsIHByb3BzLCBrZXksIHJlZiwgb3JpZ2luYWwpIHtcblx0Ly8gVjggc2VlbXMgdG8gYmUgYmV0dGVyIGF0IGRldGVjdGluZyB0eXBlIHNoYXBlcyBpZiB0aGUgb2JqZWN0IGlzIGFsbG9jYXRlZCBmcm9tIHRoZSBzYW1lIGNhbGwgc2l0ZVxuXHQvLyBEbyBub3QgaW5saW5lIGludG8gY3JlYXRlRWxlbWVudCBhbmQgY29lcmNlVG9WTm9kZSFcblx0LyoqIEB0eXBlIHtWTm9kZX0gKi9cblx0Y29uc3Qgdm5vZGUgPSB7XG5cdFx0dHlwZSxcblx0XHRwcm9wcyxcblx0XHRrZXksXG5cdFx0cmVmLFxuXHRcdF9jaGlsZHJlbjogbnVsbCxcblx0XHRfcGFyZW50OiBudWxsLFxuXHRcdF9kZXB0aDogMCxcblx0XHRfZG9tOiBudWxsLFxuXHRcdC8vIF9uZXh0RG9tIG11c3QgYmUgaW5pdGlhbGl6ZWQgdG8gdW5kZWZpbmVkIGIvYyBpdCB3aWxsIGV2ZW50dWFsbHlcblx0XHQvLyBiZSBzZXQgdG8gZG9tLm5leHRTaWJsaW5nIHdoaWNoIGNhbiByZXR1cm4gYG51bGxgIGFuZCBpdCBpcyBpbXBvcnRhbnRcblx0XHQvLyB0byBiZSBhYmxlIHRvIGRpc3Rpbmd1aXNoIGJldHdlZW4gYW4gdW5pbml0aWFsaXplZCBfbmV4dERvbSBhbmRcblx0XHQvLyBhIF9uZXh0RG9tIHRoYXQgaGFzIGJlZW4gc2V0IHRvIGBudWxsYFxuXHRcdF9uZXh0RG9tOiB1bmRlZmluZWQsXG5cdFx0X2NvbXBvbmVudDogbnVsbCxcblx0XHRjb25zdHJ1Y3RvcjogdW5kZWZpbmVkLFxuXHRcdF9vcmlnaW5hbDogb3JpZ2luYWwgPT0gbnVsbCA/ICsrdm5vZGVJZCA6IG9yaWdpbmFsLFxuXHRcdF9pbmRleDogLTEsXG5cdFx0X2ZsYWdzOiAwXG5cdH07XG5cblx0Ly8gT25seSBpbnZva2UgdGhlIHZub2RlIGhvb2sgaWYgdGhpcyB3YXMgKm5vdCogYSBkaXJlY3QgY29weTpcblx0aWYgKG9yaWdpbmFsID09IG51bGwgJiYgb3B0aW9ucy52bm9kZSAhPSBudWxsKSBvcHRpb25zLnZub2RlKHZub2RlKTtcblxuXHRyZXR1cm4gdm5vZGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVSZWYoKSB7XG5cdHJldHVybiB7IGN1cnJlbnQ6IG51bGwgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEZyYWdtZW50KHByb3BzKSB7XG5cdHJldHVybiBwcm9wcy5jaGlsZHJlbjtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiBhIHRoZSBhcmd1bWVudCBpcyBhIHZhbGlkIFByZWFjdCBWTm9kZS5cbiAqIEBwYXJhbSB7Kn0gdm5vZGVcbiAqIEByZXR1cm5zIHt2bm9kZSBpcyBWTm9kZX1cbiAqL1xuZXhwb3J0IGNvbnN0IGlzVmFsaWRFbGVtZW50ID0gdm5vZGUgPT5cblx0dm5vZGUgIT0gbnVsbCAmJiB2bm9kZS5jb25zdHJ1Y3RvciA9PSB1bmRlZmluZWQ7XG4iLCAiaW1wb3J0IHsgYXNzaWduIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7IGRpZmYsIGNvbW1pdFJvb3QgfSBmcm9tICcuL2RpZmYvaW5kZXgnO1xuaW1wb3J0IG9wdGlvbnMgZnJvbSAnLi9vcHRpb25zJztcbmltcG9ydCB7IEZyYWdtZW50IH0gZnJvbSAnLi9jcmVhdGUtZWxlbWVudCc7XG5pbXBvcnQgeyBNT0RFX0hZRFJBVEUgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbi8qKlxuICogQmFzZSBDb21wb25lbnQgY2xhc3MuIFByb3ZpZGVzIGBzZXRTdGF0ZSgpYCBhbmQgYGZvcmNlVXBkYXRlKClgLCB3aGljaFxuICogdHJpZ2dlciByZW5kZXJpbmdcbiAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wcyBUaGUgaW5pdGlhbCBjb21wb25lbnQgcHJvcHNcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb250ZXh0IFRoZSBpbml0aWFsIGNvbnRleHQgZnJvbSBwYXJlbnQgY29tcG9uZW50cydcbiAqIGdldENoaWxkQ29udGV4dFxuICovXG5leHBvcnQgZnVuY3Rpb24gQmFzZUNvbXBvbmVudChwcm9wcywgY29udGV4dCkge1xuXHR0aGlzLnByb3BzID0gcHJvcHM7XG5cdHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG59XG5cbi8qKlxuICogVXBkYXRlIGNvbXBvbmVudCBzdGF0ZSBhbmQgc2NoZWR1bGUgYSByZS1yZW5kZXIuXG4gKiBAdGhpcyB7Q29tcG9uZW50fVxuICogQHBhcmFtIHtvYmplY3QgfCAoKHM6IG9iamVjdCwgcDogb2JqZWN0KSA9PiBvYmplY3QpfSB1cGRhdGUgQSBoYXNoIG9mIHN0YXRlXG4gKiBwcm9wZXJ0aWVzIHRvIHVwZGF0ZSB3aXRoIG5ldyB2YWx1ZXMgb3IgYSBmdW5jdGlvbiB0aGF0IGdpdmVuIHRoZSBjdXJyZW50XG4gKiBzdGF0ZSBhbmQgcHJvcHMgcmV0dXJucyBhIG5ldyBwYXJ0aWFsIHN0YXRlXG4gKiBAcGFyYW0geygpID0+IHZvaWR9IFtjYWxsYmFja10gQSBmdW5jdGlvbiB0byBiZSBjYWxsZWQgb25jZSBjb21wb25lbnQgc3RhdGUgaXNcbiAqIHVwZGF0ZWRcbiAqL1xuQmFzZUNvbXBvbmVudC5wcm90b3R5cGUuc2V0U3RhdGUgPSBmdW5jdGlvbiAodXBkYXRlLCBjYWxsYmFjaykge1xuXHQvLyBvbmx5IGNsb25lIHN0YXRlIHdoZW4gY29weWluZyB0byBuZXh0U3RhdGUgdGhlIGZpcnN0IHRpbWUuXG5cdGxldCBzO1xuXHRpZiAodGhpcy5fbmV4dFN0YXRlICE9IG51bGwgJiYgdGhpcy5fbmV4dFN0YXRlICE9PSB0aGlzLnN0YXRlKSB7XG5cdFx0cyA9IHRoaXMuX25leHRTdGF0ZTtcblx0fSBlbHNlIHtcblx0XHRzID0gdGhpcy5fbmV4dFN0YXRlID0gYXNzaWduKHt9LCB0aGlzLnN0YXRlKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgdXBkYXRlID09ICdmdW5jdGlvbicpIHtcblx0XHQvLyBTb21lIGxpYnJhcmllcyBsaWtlIGBpbW1lcmAgbWFyayB0aGUgY3VycmVudCBzdGF0ZSBhcyByZWFkb25seSxcblx0XHQvLyBwcmV2ZW50aW5nIHVzIGZyb20gbXV0YXRpbmcgaXQsIHNvIHdlIG5lZWQgdG8gY2xvbmUgaXQuIFNlZSAjMjcxNlxuXHRcdHVwZGF0ZSA9IHVwZGF0ZShhc3NpZ24oe30sIHMpLCB0aGlzLnByb3BzKTtcblx0fVxuXG5cdGlmICh1cGRhdGUpIHtcblx0XHRhc3NpZ24ocywgdXBkYXRlKTtcblx0fVxuXG5cdC8vIFNraXAgdXBkYXRlIGlmIHVwZGF0ZXIgZnVuY3Rpb24gcmV0dXJuZWQgbnVsbFxuXHRpZiAodXBkYXRlID09IG51bGwpIHJldHVybjtcblxuXHRpZiAodGhpcy5fdm5vZGUpIHtcblx0XHRpZiAoY2FsbGJhY2spIHtcblx0XHRcdHRoaXMuX3N0YXRlQ2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuXHRcdH1cblx0XHRlbnF1ZXVlUmVuZGVyKHRoaXMpO1xuXHR9XG59O1xuXG4vKipcbiAqIEltbWVkaWF0ZWx5IHBlcmZvcm0gYSBzeW5jaHJvbm91cyByZS1yZW5kZXIgb2YgdGhlIGNvbXBvbmVudFxuICogQHRoaXMge0NvbXBvbmVudH1cbiAqIEBwYXJhbSB7KCkgPT4gdm9pZH0gW2NhbGxiYWNrXSBBIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCBhZnRlciBjb21wb25lbnQgaXNcbiAqIHJlLXJlbmRlcmVkXG4gKi9cbkJhc2VDb21wb25lbnQucHJvdG90eXBlLmZvcmNlVXBkYXRlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG5cdGlmICh0aGlzLl92bm9kZSkge1xuXHRcdC8vIFNldCByZW5kZXIgbW9kZSBzbyB0aGF0IHdlIGNhbiBkaWZmZXJlbnRpYXRlIHdoZXJlIHRoZSByZW5kZXIgcmVxdWVzdFxuXHRcdC8vIGlzIGNvbWluZyBmcm9tLiBXZSBuZWVkIHRoaXMgYmVjYXVzZSBmb3JjZVVwZGF0ZSBzaG91bGQgbmV2ZXIgY2FsbFxuXHRcdC8vIHNob3VsZENvbXBvbmVudFVwZGF0ZVxuXHRcdHRoaXMuX2ZvcmNlID0gdHJ1ZTtcblx0XHRpZiAoY2FsbGJhY2spIHRoaXMuX3JlbmRlckNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcblx0XHRlbnF1ZXVlUmVuZGVyKHRoaXMpO1xuXHR9XG59O1xuXG4vKipcbiAqIEFjY2VwdHMgYHByb3BzYCBhbmQgYHN0YXRlYCwgYW5kIHJldHVybnMgYSBuZXcgVmlydHVhbCBET00gdHJlZSB0byBidWlsZC5cbiAqIFZpcnR1YWwgRE9NIGlzIGdlbmVyYWxseSBjb25zdHJ1Y3RlZCB2aWEgW0pTWF0oaHR0cDovL2phc29uZm9ybWF0LmNvbS93dGYtaXMtanN4KS5cbiAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wcyBQcm9wcyAoZWc6IEpTWCBhdHRyaWJ1dGVzKSByZWNlaXZlZCBmcm9tIHBhcmVudFxuICogZWxlbWVudC9jb21wb25lbnRcbiAqIEBwYXJhbSB7b2JqZWN0fSBzdGF0ZSBUaGUgY29tcG9uZW50J3MgY3VycmVudCBzdGF0ZVxuICogQHBhcmFtIHtvYmplY3R9IGNvbnRleHQgQ29udGV4dCBvYmplY3QsIGFzIHJldHVybmVkIGJ5IHRoZSBuZWFyZXN0XG4gKiBhbmNlc3RvcidzIGBnZXRDaGlsZENvbnRleHQoKWBcbiAqIEByZXR1cm5zIHtDb21wb25lbnRDaGlsZHJlbiB8IHZvaWR9XG4gKi9cbkJhc2VDb21wb25lbnQucHJvdG90eXBlLnJlbmRlciA9IEZyYWdtZW50O1xuXG4vKipcbiAqIEBwYXJhbSB7Vk5vZGV9IHZub2RlXG4gKiBAcGFyYW0ge251bWJlciB8IG51bGx9IFtjaGlsZEluZGV4XVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RG9tU2libGluZyh2bm9kZSwgY2hpbGRJbmRleCkge1xuXHRpZiAoY2hpbGRJbmRleCA9PSBudWxsKSB7XG5cdFx0Ly8gVXNlIGNoaWxkSW5kZXg9PW51bGwgYXMgYSBzaWduYWwgdG8gcmVzdW1lIHRoZSBzZWFyY2ggZnJvbSB0aGUgdm5vZGUncyBzaWJsaW5nXG5cdFx0cmV0dXJuIHZub2RlLl9wYXJlbnRcblx0XHRcdD8gZ2V0RG9tU2libGluZyh2bm9kZS5fcGFyZW50LCB2bm9kZS5faW5kZXggKyAxKVxuXHRcdFx0OiBudWxsO1xuXHR9XG5cblx0bGV0IHNpYmxpbmc7XG5cdGZvciAoOyBjaGlsZEluZGV4IDwgdm5vZGUuX2NoaWxkcmVuLmxlbmd0aDsgY2hpbGRJbmRleCsrKSB7XG5cdFx0c2libGluZyA9IHZub2RlLl9jaGlsZHJlbltjaGlsZEluZGV4XTtcblxuXHRcdGlmIChzaWJsaW5nICE9IG51bGwgJiYgc2libGluZy5fZG9tICE9IG51bGwpIHtcblx0XHRcdC8vIFNpbmNlIHVwZGF0ZVBhcmVudERvbVBvaW50ZXJzIGtlZXBzIF9kb20gcG9pbnRlciBjb3JyZWN0LFxuXHRcdFx0Ly8gd2UgY2FuIHJlbHkgb24gX2RvbSB0byB0ZWxsIHVzIGlmIHRoaXMgc3VidHJlZSBjb250YWlucyBhXG5cdFx0XHQvLyByZW5kZXJlZCBET00gbm9kZSwgYW5kIHdoYXQgdGhlIGZpcnN0IHJlbmRlcmVkIERPTSBub2RlIGlzXG5cdFx0XHRyZXR1cm4gc2libGluZy5fZG9tO1xuXHRcdH1cblx0fVxuXG5cdC8vIElmIHdlIGdldCBoZXJlLCB3ZSBoYXZlIG5vdCBmb3VuZCBhIERPTSBub2RlIGluIHRoaXMgdm5vZGUncyBjaGlsZHJlbi5cblx0Ly8gV2UgbXVzdCByZXN1bWUgZnJvbSB0aGlzIHZub2RlJ3Mgc2libGluZyAoaW4gaXQncyBwYXJlbnQgX2NoaWxkcmVuIGFycmF5KVxuXHQvLyBPbmx5IGNsaW1iIHVwIGFuZCBzZWFyY2ggdGhlIHBhcmVudCBpZiB3ZSBhcmVuJ3Qgc2VhcmNoaW5nIHRocm91Z2ggYSBET01cblx0Ly8gVk5vZGUgKG1lYW5pbmcgd2UgcmVhY2hlZCB0aGUgRE9NIHBhcmVudCBvZiB0aGUgb3JpZ2luYWwgdm5vZGUgdGhhdCBiZWdhblxuXHQvLyB0aGUgc2VhcmNoKVxuXHRyZXR1cm4gdHlwZW9mIHZub2RlLnR5cGUgPT0gJ2Z1bmN0aW9uJyA/IGdldERvbVNpYmxpbmcodm5vZGUpIDogbnVsbDtcbn1cblxuLyoqXG4gKiBUcmlnZ2VyIGluLXBsYWNlIHJlLXJlbmRlcmluZyBvZiBhIGNvbXBvbmVudC5cbiAqIEBwYXJhbSB7Q29tcG9uZW50fSBjb21wb25lbnQgVGhlIGNvbXBvbmVudCB0byByZXJlbmRlclxuICovXG5mdW5jdGlvbiByZW5kZXJDb21wb25lbnQoY29tcG9uZW50KSB7XG5cdGxldCBvbGRWTm9kZSA9IGNvbXBvbmVudC5fdm5vZGUsXG5cdFx0b2xkRG9tID0gb2xkVk5vZGUuX2RvbSxcblx0XHRwYXJlbnREb20gPSBjb21wb25lbnQuX3BhcmVudERvbSxcblx0XHRjb21taXRRdWV1ZSA9IFtdLFxuXHRcdHJlZlF1ZXVlID0gW107XG5cblx0aWYgKHBhcmVudERvbSkge1xuXHRcdGNvbnN0IG5ld1ZOb2RlID0gYXNzaWduKHt9LCBvbGRWTm9kZSk7XG5cdFx0bmV3Vk5vZGUuX29yaWdpbmFsID0gb2xkVk5vZGUuX29yaWdpbmFsICsgMTtcblx0XHRpZiAob3B0aW9ucy52bm9kZSkgb3B0aW9ucy52bm9kZShuZXdWTm9kZSk7XG5cblx0XHRkaWZmKFxuXHRcdFx0cGFyZW50RG9tLFxuXHRcdFx0bmV3Vk5vZGUsXG5cdFx0XHRvbGRWTm9kZSxcblx0XHRcdGNvbXBvbmVudC5fZ2xvYmFsQ29udGV4dCxcblx0XHRcdHBhcmVudERvbS5vd25lclNWR0VsZW1lbnQgIT09IHVuZGVmaW5lZCxcblx0XHRcdG9sZFZOb2RlLl9mbGFncyAmIE1PREVfSFlEUkFURSA/IFtvbGREb21dIDogbnVsbCxcblx0XHRcdGNvbW1pdFF1ZXVlLFxuXHRcdFx0b2xkRG9tID09IG51bGwgPyBnZXREb21TaWJsaW5nKG9sZFZOb2RlKSA6IG9sZERvbSxcblx0XHRcdCEhKG9sZFZOb2RlLl9mbGFncyAmIE1PREVfSFlEUkFURSksXG5cdFx0XHRyZWZRdWV1ZVxuXHRcdCk7XG5cblx0XHRuZXdWTm9kZS5fcGFyZW50Ll9jaGlsZHJlbltuZXdWTm9kZS5faW5kZXhdID0gbmV3Vk5vZGU7XG5cdFx0Y29tbWl0Um9vdChjb21taXRRdWV1ZSwgbmV3Vk5vZGUsIHJlZlF1ZXVlKTtcblxuXHRcdGlmIChuZXdWTm9kZS5fZG9tICE9IG9sZERvbSkge1xuXHRcdFx0dXBkYXRlUGFyZW50RG9tUG9pbnRlcnMobmV3Vk5vZGUpO1xuXHRcdH1cblx0fVxufVxuXG4vKipcbiAqIEBwYXJhbSB7Vk5vZGV9IHZub2RlXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZVBhcmVudERvbVBvaW50ZXJzKHZub2RlKSB7XG5cdGlmICgodm5vZGUgPSB2bm9kZS5fcGFyZW50KSAhPSBudWxsICYmIHZub2RlLl9jb21wb25lbnQgIT0gbnVsbCkge1xuXHRcdHZub2RlLl9kb20gPSB2bm9kZS5fY29tcG9uZW50LmJhc2UgPSBudWxsO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdm5vZGUuX2NoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsZXQgY2hpbGQgPSB2bm9kZS5fY2hpbGRyZW5baV07XG5cdFx0XHRpZiAoY2hpbGQgIT0gbnVsbCAmJiBjaGlsZC5fZG9tICE9IG51bGwpIHtcblx0XHRcdFx0dm5vZGUuX2RvbSA9IHZub2RlLl9jb21wb25lbnQuYmFzZSA9IGNoaWxkLl9kb207XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB1cGRhdGVQYXJlbnREb21Qb2ludGVycyh2bm9kZSk7XG5cdH1cbn1cblxuLyoqXG4gKiBUaGUgcmVuZGVyIHF1ZXVlXG4gKiBAdHlwZSB7QXJyYXk8Q29tcG9uZW50Pn1cbiAqL1xubGV0IHJlcmVuZGVyUXVldWUgPSBbXTtcblxuLypcbiAqIFRoZSB2YWx1ZSBvZiBgQ29tcG9uZW50LmRlYm91bmNlYCBtdXN0IGFzeW5jaHJvbm91c2x5IGludm9rZSB0aGUgcGFzc2VkIGluIGNhbGxiYWNrLiBJdCBpc1xuICogaW1wb3J0YW50IHRoYXQgY29udHJpYnV0b3JzIHRvIFByZWFjdCBjYW4gY29uc2lzdGVudGx5IHJlYXNvbiBhYm91dCB3aGF0IGNhbGxzIHRvIGBzZXRTdGF0ZWAsIGV0Yy5cbiAqIGRvLCBhbmQgd2hlbiB0aGVpciBlZmZlY3RzIHdpbGwgYmUgYXBwbGllZC4gU2VlIHRoZSBsaW5rcyBiZWxvdyBmb3Igc29tZSBmdXJ0aGVyIHJlYWRpbmcgb24gZGVzaWduaW5nXG4gKiBhc3luY2hyb25vdXMgQVBJcy5cbiAqICogW0Rlc2lnbmluZyBBUElzIGZvciBBc3luY2hyb255XShodHRwczovL2Jsb2cuaXpzLm1lLzIwMTMvMDgvZGVzaWduaW5nLWFwaXMtZm9yLWFzeW5jaHJvbnkpXG4gKiAqIFtDYWxsYmFja3Mgc3luY2hyb25vdXMgYW5kIGFzeW5jaHJvbm91c10oaHR0cHM6Ly9ibG9nLm9tZXRlci5jb20vMjAxMS8wNy8yNC9jYWxsYmFja3Mtc3luY2hyb25vdXMtYW5kLWFzeW5jaHJvbm91cy8pXG4gKi9cblxubGV0IHByZXZEZWJvdW5jZTtcblxuY29uc3QgZGVmZXIgPVxuXHR0eXBlb2YgUHJvbWlzZSA9PSAnZnVuY3Rpb24nXG5cdFx0PyBQcm9taXNlLnByb3RvdHlwZS50aGVuLmJpbmQoUHJvbWlzZS5yZXNvbHZlKCkpXG5cdFx0OiBzZXRUaW1lb3V0O1xuXG4vKipcbiAqIEVucXVldWUgYSByZXJlbmRlciBvZiBhIGNvbXBvbmVudFxuICogQHBhcmFtIHtDb21wb25lbnR9IGMgVGhlIGNvbXBvbmVudCB0byByZXJlbmRlclxuICovXG5leHBvcnQgZnVuY3Rpb24gZW5xdWV1ZVJlbmRlcihjKSB7XG5cdGlmIChcblx0XHQoIWMuX2RpcnR5ICYmXG5cdFx0XHQoYy5fZGlydHkgPSB0cnVlKSAmJlxuXHRcdFx0cmVyZW5kZXJRdWV1ZS5wdXNoKGMpICYmXG5cdFx0XHQhcHJvY2Vzcy5fcmVyZW5kZXJDb3VudCsrKSB8fFxuXHRcdHByZXZEZWJvdW5jZSAhPT0gb3B0aW9ucy5kZWJvdW5jZVJlbmRlcmluZ1xuXHQpIHtcblx0XHRwcmV2RGVib3VuY2UgPSBvcHRpb25zLmRlYm91bmNlUmVuZGVyaW5nO1xuXHRcdChwcmV2RGVib3VuY2UgfHwgZGVmZXIpKHByb2Nlc3MpO1xuXHR9XG59XG5cbi8qKlxuICogQHBhcmFtIHtDb21wb25lbnR9IGFcbiAqIEBwYXJhbSB7Q29tcG9uZW50fSBiXG4gKi9cbmNvbnN0IGRlcHRoU29ydCA9IChhLCBiKSA9PiBhLl92bm9kZS5fZGVwdGggLSBiLl92bm9kZS5fZGVwdGg7XG5cbi8qKiBGbHVzaCB0aGUgcmVuZGVyIHF1ZXVlIGJ5IHJlcmVuZGVyaW5nIGFsbCBxdWV1ZWQgY29tcG9uZW50cyAqL1xuZnVuY3Rpb24gcHJvY2VzcygpIHtcblx0bGV0IGM7XG5cdHJlcmVuZGVyUXVldWUuc29ydChkZXB0aFNvcnQpO1xuXHQvLyBEb24ndCB1cGRhdGUgYHJlbmRlckNvdW50YCB5ZXQuIEtlZXAgaXRzIHZhbHVlIG5vbi16ZXJvIHRvIHByZXZlbnQgdW5uZWNlc3Nhcnlcblx0Ly8gcHJvY2VzcygpIGNhbGxzIGZyb20gZ2V0dGluZyBzY2hlZHVsZWQgd2hpbGUgYHF1ZXVlYCBpcyBzdGlsbCBiZWluZyBjb25zdW1lZC5cblx0d2hpbGUgKChjID0gcmVyZW5kZXJRdWV1ZS5zaGlmdCgpKSkge1xuXHRcdGlmIChjLl9kaXJ0eSkge1xuXHRcdFx0bGV0IHJlbmRlclF1ZXVlTGVuZ3RoID0gcmVyZW5kZXJRdWV1ZS5sZW5ndGg7XG5cdFx0XHRyZW5kZXJDb21wb25lbnQoYyk7XG5cdFx0XHRpZiAocmVyZW5kZXJRdWV1ZS5sZW5ndGggPiByZW5kZXJRdWV1ZUxlbmd0aCkge1xuXHRcdFx0XHQvLyBXaGVuIGkuZS4gcmVyZW5kZXJpbmcgYSBwcm92aWRlciBhZGRpdGlvbmFsIG5ldyBpdGVtcyBjYW4gYmUgaW5qZWN0ZWQsIHdlIHdhbnQgdG9cblx0XHRcdFx0Ly8ga2VlcCB0aGUgb3JkZXIgZnJvbSB0b3AgdG8gYm90dG9tIHdpdGggdGhvc2UgbmV3IGl0ZW1zIHNvIHdlIGNhbiBoYW5kbGUgdGhlbSBpbiBhXG5cdFx0XHRcdC8vIHNpbmdsZSBwYXNzXG5cdFx0XHRcdHJlcmVuZGVyUXVldWUuc29ydChkZXB0aFNvcnQpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRwcm9jZXNzLl9yZXJlbmRlckNvdW50ID0gMDtcbn1cblxucHJvY2Vzcy5fcmVyZW5kZXJDb3VudCA9IDA7XG4iLCAiaW1wb3J0IHsgZW5xdWV1ZVJlbmRlciB9IGZyb20gJy4vY29tcG9uZW50JztcblxuZXhwb3J0IGxldCBpID0gMDtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNvbnRleHQoZGVmYXVsdFZhbHVlLCBjb250ZXh0SWQpIHtcblx0Y29udGV4dElkID0gJ19fY0MnICsgaSsrO1xuXG5cdGNvbnN0IGNvbnRleHQgPSB7XG5cdFx0X2lkOiBjb250ZXh0SWQsXG5cdFx0X2RlZmF1bHRWYWx1ZTogZGVmYXVsdFZhbHVlLFxuXHRcdC8qKiBAdHlwZSB7RnVuY3Rpb25Db21wb25lbnR9ICovXG5cdFx0Q29uc3VtZXIocHJvcHMsIGNvbnRleHRWYWx1ZSkge1xuXHRcdFx0Ly8gcmV0dXJuIHByb3BzLmNoaWxkcmVuKFxuXHRcdFx0Ly8gXHRjb250ZXh0W2NvbnRleHRJZF0gPyBjb250ZXh0W2NvbnRleHRJZF0ucHJvcHMudmFsdWUgOiBkZWZhdWx0VmFsdWVcblx0XHRcdC8vICk7XG5cdFx0XHRyZXR1cm4gcHJvcHMuY2hpbGRyZW4oY29udGV4dFZhbHVlKTtcblx0XHR9LFxuXHRcdC8qKiBAdHlwZSB7RnVuY3Rpb25Db21wb25lbnR9ICovXG5cdFx0UHJvdmlkZXIocHJvcHMpIHtcblx0XHRcdGlmICghdGhpcy5nZXRDaGlsZENvbnRleHQpIHtcblx0XHRcdFx0LyoqIEB0eXBlIHtDb21wb25lbnRbXX0gKi9cblx0XHRcdFx0bGV0IHN1YnMgPSBbXTtcblx0XHRcdFx0bGV0IGN0eCA9IHt9O1xuXHRcdFx0XHRjdHhbY29udGV4dElkXSA9IHRoaXM7XG5cblx0XHRcdFx0dGhpcy5nZXRDaGlsZENvbnRleHQgPSAoKSA9PiBjdHg7XG5cblx0XHRcdFx0dGhpcy5zaG91bGRDb21wb25lbnRVcGRhdGUgPSBmdW5jdGlvbiAoX3Byb3BzKSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMucHJvcHMudmFsdWUgIT09IF9wcm9wcy52YWx1ZSkge1xuXHRcdFx0XHRcdFx0Ly8gSSB0aGluayB0aGUgZm9yY2VkIHZhbHVlIHByb3BhZ2F0aW9uIGhlcmUgd2FzIG9ubHkgbmVlZGVkIHdoZW4gYG9wdGlvbnMuZGVib3VuY2VSZW5kZXJpbmdgIHdhcyBiZWluZyBieXBhc3NlZDpcblx0XHRcdFx0XHRcdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9wcmVhY3Rqcy9wcmVhY3QvY29tbWl0LzRkMzM5ZmI4MDNiZWEwOWU5ZjE5OGFiZjM4Y2ExYmY4ZWE0Yjc3NzEjZGlmZi01NDY4MmNlMzgwOTM1YTcxN2U0MWI4YmZjNTQ3MzdmNlIzNThcblx0XHRcdFx0XHRcdC8vIEluIHRob3NlIGNhc2VzIHRob3VnaCwgZXZlbiB3aXRoIHRoZSB2YWx1ZSBjb3JyZWN0ZWQsIHdlJ3JlIGRvdWJsZS1yZW5kZXJpbmcgYWxsIG5vZGVzLlxuXHRcdFx0XHRcdFx0Ly8gSXQgbWlnaHQgYmUgYmV0dGVyIHRvIGp1c3QgdGVsbCBmb2xrcyBub3QgdG8gdXNlIGZvcmNlLXN5bmMgbW9kZS5cblx0XHRcdFx0XHRcdC8vIEN1cnJlbnRseSwgdXNpbmcgYHVzZUNvbnRleHQoKWAgaW4gYSBjbGFzcyBjb21wb25lbnQgd2lsbCBvdmVyd3JpdGUgaXRzIGB0aGlzLmNvbnRleHRgIHZhbHVlLlxuXHRcdFx0XHRcdFx0Ly8gc3Vicy5zb21lKGMgPT4ge1xuXHRcdFx0XHRcdFx0Ly8gXHRjLmNvbnRleHQgPSBfcHJvcHMudmFsdWU7XG5cdFx0XHRcdFx0XHQvLyBcdGVucXVldWVSZW5kZXIoYyk7XG5cdFx0XHRcdFx0XHQvLyB9KTtcblxuXHRcdFx0XHRcdFx0Ly8gc3Vicy5zb21lKGMgPT4ge1xuXHRcdFx0XHRcdFx0Ly8gXHRjLmNvbnRleHRbY29udGV4dElkXSA9IF9wcm9wcy52YWx1ZTtcblx0XHRcdFx0XHRcdC8vIFx0ZW5xdWV1ZVJlbmRlcihjKTtcblx0XHRcdFx0XHRcdC8vIH0pO1xuXHRcdFx0XHRcdFx0c3Vicy5zb21lKGMgPT4ge1xuXHRcdFx0XHRcdFx0XHRjLl9mb3JjZSA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdGVucXVldWVSZW5kZXIoYyk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dGhpcy5zdWIgPSBjID0+IHtcblx0XHRcdFx0XHRzdWJzLnB1c2goYyk7XG5cdFx0XHRcdFx0bGV0IG9sZCA9IGMuY29tcG9uZW50V2lsbFVubW91bnQ7XG5cdFx0XHRcdFx0Yy5jb21wb25lbnRXaWxsVW5tb3VudCA9ICgpID0+IHtcblx0XHRcdFx0XHRcdHN1YnMuc3BsaWNlKHN1YnMuaW5kZXhPZihjKSwgMSk7XG5cdFx0XHRcdFx0XHRpZiAob2xkKSBvbGQuY2FsbChjKTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcHJvcHMuY2hpbGRyZW47XG5cdFx0fVxuXHR9O1xuXG5cdC8vIERldnRvb2xzIG5lZWRzIGFjY2VzcyB0byB0aGUgY29udGV4dCBvYmplY3Qgd2hlbiBpdFxuXHQvLyBlbmNvdW50ZXJzIGEgUHJvdmlkZXIuIFRoaXMgaXMgbmVjZXNzYXJ5IHRvIHN1cHBvcnRcblx0Ly8gc2V0dGluZyBgZGlzcGxheU5hbWVgIG9uIHRoZSBjb250ZXh0IG9iamVjdCBpbnN0ZWFkXG5cdC8vIG9mIG9uIHRoZSBjb21wb25lbnQgaXRzZWxmLiBTZWU6XG5cdC8vIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9jb250ZXh0Lmh0bWwjY29udGV4dGRpc3BsYXluYW1lXG5cblx0cmV0dXJuIChjb250ZXh0LlByb3ZpZGVyLl9jb250ZXh0UmVmID0gY29udGV4dC5Db25zdW1lci5jb250ZXh0VHlwZSA9XG5cdFx0Y29udGV4dCk7XG59XG4iLCAiaW1wb3J0IHsgZGlmZiwgdW5tb3VudCwgYXBwbHlSZWYgfSBmcm9tICcuL2luZGV4JztcbmltcG9ydCB7IGNyZWF0ZVZOb2RlLCBGcmFnbWVudCB9IGZyb20gJy4uL2NyZWF0ZS1lbGVtZW50JztcbmltcG9ydCB7IEVNUFRZX09CSiwgRU1QVFlfQVJSLCBJTlNFUlRfVk5PREUsIE1BVENIRUQgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHsgZ2V0RG9tU2libGluZyB9IGZyb20gJy4uL2NvbXBvbmVudCc7XG5cbi8qKlxuICogRGlmZiB0aGUgY2hpbGRyZW4gb2YgYSB2aXJ0dWFsIG5vZGVcbiAqIEBwYXJhbSB7UHJlYWN0RWxlbWVudH0gcGFyZW50RG9tIFRoZSBET00gZWxlbWVudCB3aG9zZSBjaGlsZHJlbiBhcmUgYmVpbmdcbiAqIGRpZmZlZFxuICogQHBhcmFtIHtDb21wb25lbnRDaGlsZHJlbltdfSByZW5kZXJSZXN1bHRcbiAqIEBwYXJhbSB7Vk5vZGV9IG5ld1BhcmVudFZOb2RlIFRoZSBuZXcgdmlydHVhbCBub2RlIHdob3NlIGNoaWxkcmVuIHNob3VsZCBiZVxuICogZGlmZidlZCBhZ2FpbnN0IG9sZFBhcmVudFZOb2RlXG4gKiBAcGFyYW0ge1ZOb2RlfSBvbGRQYXJlbnRWTm9kZSBUaGUgb2xkIHZpcnR1YWwgbm9kZSB3aG9zZSBjaGlsZHJlbiBzaG91bGQgYmVcbiAqIGRpZmYnZWQgYWdhaW5zdCBuZXdQYXJlbnRWTm9kZVxuICogQHBhcmFtIHtvYmplY3R9IGdsb2JhbENvbnRleHQgVGhlIGN1cnJlbnQgY29udGV4dCBvYmplY3QgLSBtb2RpZmllZCBieVxuICogZ2V0Q2hpbGRDb250ZXh0XG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzU3ZnIFdoZXRoZXIgb3Igbm90IHRoaXMgRE9NIG5vZGUgaXMgYW4gU1ZHIG5vZGVcbiAqIEBwYXJhbSB7QXJyYXk8UHJlYWN0RWxlbWVudD59IGV4Y2Vzc0RvbUNoaWxkcmVuXG4gKiBAcGFyYW0ge0FycmF5PENvbXBvbmVudD59IGNvbW1pdFF1ZXVlIExpc3Qgb2YgY29tcG9uZW50cyB3aGljaCBoYXZlIGNhbGxiYWNrc1xuICogdG8gaW52b2tlIGluIGNvbW1pdFJvb3RcbiAqIEBwYXJhbSB7UHJlYWN0RWxlbWVudH0gb2xkRG9tIFRoZSBjdXJyZW50IGF0dGFjaGVkIERPTSBlbGVtZW50IGFueSBuZXcgZG9tXG4gKiBlbGVtZW50cyBzaG91bGQgYmUgcGxhY2VkIGFyb3VuZC4gTGlrZWx5IGBudWxsYCBvbiBmaXJzdCByZW5kZXIgKGV4Y2VwdCB3aGVuXG4gKiBoeWRyYXRpbmcpLiBDYW4gYmUgYSBzaWJsaW5nIERPTSBlbGVtZW50IHdoZW4gZGlmZmluZyBGcmFnbWVudHMgdGhhdCBoYXZlXG4gKiBzaWJsaW5ncy4gSW4gbW9zdCBjYXNlcywgaXQgc3RhcnRzIG91dCBhcyBgb2xkQ2hpbGRyZW5bMF0uX2RvbWAuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzSHlkcmF0aW5nIFdoZXRoZXIgb3Igbm90IHdlIGFyZSBpbiBoeWRyYXRpb25cbiAqIEBwYXJhbSB7YW55W119IHJlZlF1ZXVlIGFuIGFycmF5IG9mIGVsZW1lbnRzIG5lZWRlZCB0byBpbnZva2UgcmVmc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZGlmZkNoaWxkcmVuKFxuXHRwYXJlbnREb20sXG5cdHJlbmRlclJlc3VsdCxcblx0bmV3UGFyZW50Vk5vZGUsXG5cdG9sZFBhcmVudFZOb2RlLFxuXHRnbG9iYWxDb250ZXh0LFxuXHRpc1N2Zyxcblx0ZXhjZXNzRG9tQ2hpbGRyZW4sXG5cdGNvbW1pdFF1ZXVlLFxuXHRvbGREb20sXG5cdGlzSHlkcmF0aW5nLFxuXHRyZWZRdWV1ZVxuKSB7XG5cdGxldCBpLFxuXHRcdC8qKiBAdHlwZSB7Vk5vZGV9ICovXG5cdFx0b2xkVk5vZGUsXG5cdFx0LyoqIEB0eXBlIHtWTm9kZX0gKi9cblx0XHRjaGlsZFZOb2RlLFxuXHRcdC8qKiBAdHlwZSB7UHJlYWN0RWxlbWVudH0gKi9cblx0XHRuZXdEb20sXG5cdFx0LyoqIEB0eXBlIHtQcmVhY3RFbGVtZW50fSAqL1xuXHRcdGZpcnN0Q2hpbGREb207XG5cblx0Ly8gVGhpcyBpcyBhIGNvbXByZXNzaW9uIG9mIG9sZFBhcmVudFZOb2RlIT1udWxsICYmIG9sZFBhcmVudFZOb2RlICE9IEVNUFRZX09CSiAmJiBvbGRQYXJlbnRWTm9kZS5fY2hpbGRyZW4gfHwgRU1QVFlfQVJSXG5cdC8vIGFzIEVNUFRZX09CSi5fY2hpbGRyZW4gc2hvdWxkIGJlIGB1bmRlZmluZWRgLlxuXHQvKiogQHR5cGUge1ZOb2RlW119ICovXG5cdGxldCBvbGRDaGlsZHJlbiA9IChvbGRQYXJlbnRWTm9kZSAmJiBvbGRQYXJlbnRWTm9kZS5fY2hpbGRyZW4pIHx8IEVNUFRZX0FSUjtcblxuXHRsZXQgbmV3Q2hpbGRyZW5MZW5ndGggPSByZW5kZXJSZXN1bHQubGVuZ3RoO1xuXG5cdG5ld1BhcmVudFZOb2RlLl9uZXh0RG9tID0gb2xkRG9tO1xuXHRjb25zdHJ1Y3ROZXdDaGlsZHJlbkFycmF5KG5ld1BhcmVudFZOb2RlLCByZW5kZXJSZXN1bHQsIG9sZENoaWxkcmVuKTtcblx0b2xkRG9tID0gbmV3UGFyZW50Vk5vZGUuX25leHREb207XG5cblx0Zm9yIChpID0gMDsgaSA8IG5ld0NoaWxkcmVuTGVuZ3RoOyBpKyspIHtcblx0XHRjaGlsZFZOb2RlID0gbmV3UGFyZW50Vk5vZGUuX2NoaWxkcmVuW2ldO1xuXG5cdFx0aWYgKFxuXHRcdFx0Y2hpbGRWTm9kZSA9PSBudWxsIHx8XG5cdFx0XHR0eXBlb2YgY2hpbGRWTm9kZSA9PSAnYm9vbGVhbicgfHxcblx0XHRcdHR5cGVvZiBjaGlsZFZOb2RlID09ICdmdW5jdGlvbidcblx0XHQpIHtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdC8vIEF0IHRoaXMgcG9pbnQsIGNvbnN0cnVjdE5ld0NoaWxkcmVuQXJyYXkgaGFzIGFzc2lnbmVkIF9pbmRleCB0byBiZSB0aGVcblx0XHQvLyBtYXRjaGluZ0luZGV4IGZvciB0aGlzIFZOb2RlJ3Mgb2xkVk5vZGUgKG9yIC0xIGlmIHRoZXJlIGlzIG5vIG9sZFZOb2RlKS5cblx0XHRpZiAoY2hpbGRWTm9kZS5faW5kZXggPT09IC0xKSB7XG5cdFx0XHRvbGRWTm9kZSA9IEVNUFRZX09CSjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0b2xkVk5vZGUgPSBvbGRDaGlsZHJlbltjaGlsZFZOb2RlLl9pbmRleF0gfHwgRU1QVFlfT0JKO1xuXHRcdH1cblxuXHRcdC8vIFVwZGF0ZSBjaGlsZFZOb2RlLl9pbmRleCB0byBpdHMgZmluYWwgaW5kZXhcblx0XHRjaGlsZFZOb2RlLl9pbmRleCA9IGk7XG5cblx0XHQvLyBNb3JwaCB0aGUgb2xkIGVsZW1lbnQgaW50byB0aGUgbmV3IG9uZSwgYnV0IGRvbid0IGFwcGVuZCBpdCB0byB0aGUgZG9tIHlldFxuXHRcdGRpZmYoXG5cdFx0XHRwYXJlbnREb20sXG5cdFx0XHRjaGlsZFZOb2RlLFxuXHRcdFx0b2xkVk5vZGUsXG5cdFx0XHRnbG9iYWxDb250ZXh0LFxuXHRcdFx0aXNTdmcsXG5cdFx0XHRleGNlc3NEb21DaGlsZHJlbixcblx0XHRcdGNvbW1pdFF1ZXVlLFxuXHRcdFx0b2xkRG9tLFxuXHRcdFx0aXNIeWRyYXRpbmcsXG5cdFx0XHRyZWZRdWV1ZVxuXHRcdCk7XG5cblx0XHQvLyBBZGp1c3QgRE9NIG5vZGVzXG5cdFx0bmV3RG9tID0gY2hpbGRWTm9kZS5fZG9tO1xuXHRcdGlmIChjaGlsZFZOb2RlLnJlZiAmJiBvbGRWTm9kZS5yZWYgIT0gY2hpbGRWTm9kZS5yZWYpIHtcblx0XHRcdGlmIChvbGRWTm9kZS5yZWYpIHtcblx0XHRcdFx0YXBwbHlSZWYob2xkVk5vZGUucmVmLCBudWxsLCBjaGlsZFZOb2RlKTtcblx0XHRcdH1cblx0XHRcdHJlZlF1ZXVlLnB1c2goXG5cdFx0XHRcdGNoaWxkVk5vZGUucmVmLFxuXHRcdFx0XHRjaGlsZFZOb2RlLl9jb21wb25lbnQgfHwgbmV3RG9tLFxuXHRcdFx0XHRjaGlsZFZOb2RlXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdGlmIChmaXJzdENoaWxkRG9tID09IG51bGwgJiYgbmV3RG9tICE9IG51bGwpIHtcblx0XHRcdGZpcnN0Q2hpbGREb20gPSBuZXdEb207XG5cdFx0fVxuXG5cdFx0aWYgKFxuXHRcdFx0Y2hpbGRWTm9kZS5fZmxhZ3MgJiBJTlNFUlRfVk5PREUgfHxcblx0XHRcdG9sZFZOb2RlLl9jaGlsZHJlbiA9PT0gY2hpbGRWTm9kZS5fY2hpbGRyZW5cblx0XHQpIHtcblx0XHRcdG9sZERvbSA9IGluc2VydChjaGlsZFZOb2RlLCBvbGREb20sIHBhcmVudERvbSk7XG5cdFx0fSBlbHNlIGlmIChcblx0XHRcdHR5cGVvZiBjaGlsZFZOb2RlLnR5cGUgPT0gJ2Z1bmN0aW9uJyAmJlxuXHRcdFx0Y2hpbGRWTm9kZS5fbmV4dERvbSAhPT0gdW5kZWZpbmVkXG5cdFx0KSB7XG5cdFx0XHQvLyBTaW5jZSBGcmFnbWVudHMgb3IgY29tcG9uZW50cyB0aGF0IHJldHVybiBGcmFnbWVudCBsaWtlIFZOb2RlcyBjYW5cblx0XHRcdC8vIGNvbnRhaW4gbXVsdGlwbGUgRE9NIG5vZGVzIGFzIHRoZSBzYW1lIGxldmVsLCBjb250aW51ZSB0aGUgZGlmZiBmcm9tXG5cdFx0XHQvLyB0aGUgc2libGluZyBvZiBsYXN0IERPTSBjaGlsZCBvZiB0aGlzIGNoaWxkIFZOb2RlXG5cdFx0XHRvbGREb20gPSBjaGlsZFZOb2RlLl9uZXh0RG9tO1xuXHRcdH0gZWxzZSBpZiAobmV3RG9tKSB7XG5cdFx0XHRvbGREb20gPSBuZXdEb20ubmV4dFNpYmxpbmc7XG5cdFx0fVxuXG5cdFx0Ly8gRWFnZXJseSBjbGVhbnVwIF9uZXh0RG9tLiBXZSBkb24ndCBuZWVkIHRvIHBlcnNpc3QgdGhlIHZhbHVlIGJlY2F1c2UgaXRcblx0XHQvLyBpcyBvbmx5IHVzZWQgYnkgYGRpZmZDaGlsZHJlbmAgdG8gZGV0ZXJtaW5lIHdoZXJlIHRvIHJlc3VtZSB0aGUgZGlmZlxuXHRcdC8vIGFmdGVyIGRpZmZpbmcgQ29tcG9uZW50cyBhbmQgRnJhZ21lbnRzLiBPbmNlIHdlIHN0b3JlIGl0IHRoZSBuZXh0RE9NXG5cdFx0Ly8gbG9jYWwgdmFyLCB3ZSBjYW4gY2xlYW4gdXAgdGhlIHByb3BlcnR5LiBBbHNvIHByZXZlbnRzIHVzIGhhbmdpbmcgb24gdG9cblx0XHQvLyBET00gbm9kZXMgdGhhdCBtYXkgaGF2ZSBiZWVuIHVubW91bnRlZC5cblx0XHRjaGlsZFZOb2RlLl9uZXh0RG9tID0gdW5kZWZpbmVkO1xuXG5cdFx0Ly8gVW5zZXQgZGlmZmluZyBmbGFnc1xuXHRcdGNoaWxkVk5vZGUuX2ZsYWdzICY9IH4oSU5TRVJUX1ZOT0RFIHwgTUFUQ0hFRCk7XG5cdH1cblxuXHQvLyBUT0RPOiBXaXRoIG5ldyBjaGlsZCBkaWZmaW5nIGFsZ28sIGNvbnNpZGVyIGFsdCB3YXlzIHRvIGRpZmYgRnJhZ21lbnRzLlxuXHQvLyBTdWNoIGFzIGRyb3BwaW5nIG9sZERvbSBhbmQgbW92aW5nIGZyYWdtZW50cyBpbiBwbGFjZVxuXHQvL1xuXHQvLyBCZWNhdXNlIHRoZSBuZXdQYXJlbnRWTm9kZSBpcyBGcmFnbWVudC1saWtlLCB3ZSBuZWVkIHRvIHNldCBpdCdzXG5cdC8vIF9uZXh0RG9tIHByb3BlcnR5IHRvIHRoZSBuZXh0U2libGluZyBvZiBpdHMgbGFzdCBjaGlsZCBET00gbm9kZS5cblx0Ly9cblx0Ly8gYG9sZERvbWAgY29udGFpbnMgdGhlIGNvcnJlY3QgdmFsdWUgaGVyZSBiZWNhdXNlIGlmIHRoZSBsYXN0IGNoaWxkXG5cdC8vIGlzIGEgRnJhZ21lbnQtbGlrZSwgdGhlbiBvbGREb20gaGFzIGFscmVhZHkgYmVlbiBzZXQgdG8gdGhhdCBjaGlsZCdzIF9uZXh0RG9tLlxuXHQvLyBJZiB0aGUgbGFzdCBjaGlsZCBpcyBhIERPTSBWTm9kZSwgdGhlbiBvbGREb20gd2lsbCBiZSBzZXQgdG8gdGhhdCBET01cblx0Ly8gbm9kZSdzIG5leHRTaWJsaW5nLlxuXHRuZXdQYXJlbnRWTm9kZS5fbmV4dERvbSA9IG9sZERvbTtcblx0bmV3UGFyZW50Vk5vZGUuX2RvbSA9IGZpcnN0Q2hpbGREb207XG59XG5cbi8qKlxuICogQHBhcmFtIHtWTm9kZX0gbmV3UGFyZW50Vk5vZGVcbiAqIEBwYXJhbSB7Q29tcG9uZW50Q2hpbGRyZW5bXX0gcmVuZGVyUmVzdWx0XG4gKiBAcGFyYW0ge1ZOb2RlW119IG9sZENoaWxkcmVuXG4gKi9cbmZ1bmN0aW9uIGNvbnN0cnVjdE5ld0NoaWxkcmVuQXJyYXkobmV3UGFyZW50Vk5vZGUsIHJlbmRlclJlc3VsdCwgb2xkQ2hpbGRyZW4pIHtcblx0LyoqIEB0eXBlIHtudW1iZXJ9ICovXG5cdGxldCBpO1xuXHQvKiogQHR5cGUge1ZOb2RlfSAqL1xuXHRsZXQgY2hpbGRWTm9kZTtcblx0LyoqIEB0eXBlIHtWTm9kZX0gKi9cblx0bGV0IG9sZFZOb2RlO1xuXG5cdGNvbnN0IG5ld0NoaWxkcmVuTGVuZ3RoID0gcmVuZGVyUmVzdWx0Lmxlbmd0aDtcblx0bGV0IG9sZENoaWxkcmVuTGVuZ3RoID0gb2xkQ2hpbGRyZW4ubGVuZ3RoLFxuXHRcdHJlbWFpbmluZ09sZENoaWxkcmVuID0gb2xkQ2hpbGRyZW5MZW5ndGg7XG5cblx0bGV0IHNrZXcgPSAwO1xuXG5cdG5ld1BhcmVudFZOb2RlLl9jaGlsZHJlbiA9IFtdO1xuXHRmb3IgKGkgPSAwOyBpIDwgbmV3Q2hpbGRyZW5MZW5ndGg7IGkrKykge1xuXHRcdC8vIEB0cy1leHBlY3QtZXJyb3IgV2UgYXJlIHJldXNpbmcgdGhlIGNoaWxkVk5vZGUgdmFyaWFibGUgdG8gaG9sZCBib3RoIHRoZVxuXHRcdC8vIHByZSBhbmQgcG9zdCBub3JtYWxpemVkIGNoaWxkVk5vZGVcblx0XHRjaGlsZFZOb2RlID0gcmVuZGVyUmVzdWx0W2ldO1xuXG5cdFx0aWYgKFxuXHRcdFx0Y2hpbGRWTm9kZSA9PSBudWxsIHx8XG5cdFx0XHR0eXBlb2YgY2hpbGRWTm9kZSA9PSAnYm9vbGVhbicgfHxcblx0XHRcdHR5cGVvZiBjaGlsZFZOb2RlID09ICdmdW5jdGlvbidcblx0XHQpIHtcblx0XHRcdGNoaWxkVk5vZGUgPSBuZXdQYXJlbnRWTm9kZS5fY2hpbGRyZW5baV0gPSBudWxsO1xuXHRcdH1cblx0XHQvLyBJZiB0aGlzIG5ld1ZOb2RlIGlzIGJlaW5nIHJldXNlZCAoZS5nLiA8ZGl2PntyZXVzZX17cmV1c2V9PC9kaXY+KSBpbiB0aGUgc2FtZSBkaWZmLFxuXHRcdC8vIG9yIHdlIGFyZSByZW5kZXJpbmcgYSBjb21wb25lbnQgKGUuZy4gc2V0U3RhdGUpIGNvcHkgdGhlIG9sZFZOb2RlcyBzbyBpdCBjYW4gaGF2ZVxuXHRcdC8vIGl0J3Mgb3duIERPTSAmIGV0Yy4gcG9pbnRlcnNcblx0XHRlbHNlIGlmIChcblx0XHRcdHR5cGVvZiBjaGlsZFZOb2RlID09ICdzdHJpbmcnIHx8XG5cdFx0XHR0eXBlb2YgY2hpbGRWTm9kZSA9PSAnbnVtYmVyJyB8fFxuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHZhbGlkLXR5cGVvZlxuXHRcdFx0dHlwZW9mIGNoaWxkVk5vZGUgPT0gJ2JpZ2ludCcgfHxcblx0XHRcdGNoaWxkVk5vZGUuY29uc3RydWN0b3IgPT0gU3RyaW5nXG5cdFx0KSB7XG5cdFx0XHRjaGlsZFZOb2RlID0gbmV3UGFyZW50Vk5vZGUuX2NoaWxkcmVuW2ldID0gY3JlYXRlVk5vZGUoXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdGNoaWxkVk5vZGUsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdGNoaWxkVk5vZGVcblx0XHRcdCk7XG5cdFx0fSBlbHNlIGlmIChpc0FycmF5KGNoaWxkVk5vZGUpKSB7XG5cdFx0XHRjaGlsZFZOb2RlID0gbmV3UGFyZW50Vk5vZGUuX2NoaWxkcmVuW2ldID0gY3JlYXRlVk5vZGUoXG5cdFx0XHRcdEZyYWdtZW50LFxuXHRcdFx0XHR7IGNoaWxkcmVuOiBjaGlsZFZOb2RlIH0sXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdG51bGxcblx0XHRcdCk7XG5cdFx0fSBlbHNlIGlmIChjaGlsZFZOb2RlLl9kZXB0aCA+IDApIHtcblx0XHRcdC8vIFZOb2RlIGlzIGFscmVhZHkgaW4gdXNlLCBjbG9uZSBpdC4gVGhpcyBjYW4gaGFwcGVuIGluIHRoZSBmb2xsb3dpbmdcblx0XHRcdC8vIHNjZW5hcmlvOlxuXHRcdFx0Ly8gICBjb25zdCByZXVzZSA9IDxkaXYgLz5cblx0XHRcdC8vICAgPGRpdj57cmV1c2V9PHNwYW4gLz57cmV1c2V9PC9kaXY+XG5cdFx0XHRjaGlsZFZOb2RlID0gbmV3UGFyZW50Vk5vZGUuX2NoaWxkcmVuW2ldID0gY3JlYXRlVk5vZGUoXG5cdFx0XHRcdGNoaWxkVk5vZGUudHlwZSxcblx0XHRcdFx0Y2hpbGRWTm9kZS5wcm9wcyxcblx0XHRcdFx0Y2hpbGRWTm9kZS5rZXksXG5cdFx0XHRcdGNoaWxkVk5vZGUucmVmID8gY2hpbGRWTm9kZS5yZWYgOiBudWxsLFxuXHRcdFx0XHRjaGlsZFZOb2RlLl9vcmlnaW5hbFxuXHRcdFx0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y2hpbGRWTm9kZSA9IG5ld1BhcmVudFZOb2RlLl9jaGlsZHJlbltpXSA9IGNoaWxkVk5vZGU7XG5cdFx0fVxuXG5cdFx0Ly8gSGFuZGxlIHVubW91bnRpbmcgbnVsbCBwbGFjZWhvbGRlcnMsIGkuZS4gVk5vZGUgPT4gbnVsbCBpbiB1bmtleWVkIGNoaWxkcmVuXG5cdFx0aWYgKGNoaWxkVk5vZGUgPT0gbnVsbCkge1xuXHRcdFx0b2xkVk5vZGUgPSBvbGRDaGlsZHJlbltpXTtcblx0XHRcdGlmIChvbGRWTm9kZSAmJiBvbGRWTm9kZS5rZXkgPT0gbnVsbCAmJiBvbGRWTm9kZS5fZG9tKSB7XG5cdFx0XHRcdGlmIChvbGRWTm9kZS5fZG9tID09IG5ld1BhcmVudFZOb2RlLl9uZXh0RG9tKSB7XG5cdFx0XHRcdFx0bmV3UGFyZW50Vk5vZGUuX25leHREb20gPSBnZXREb21TaWJsaW5nKG9sZFZOb2RlKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHVubW91bnQob2xkVk5vZGUsIG9sZFZOb2RlLCBmYWxzZSk7XG5cblx0XHRcdFx0Ly8gRXhwbGljaXRseSBudWxsaWZ5IHRoaXMgcG9zaXRpb24gaW4gb2xkQ2hpbGRyZW4gaW5zdGVhZCBvZiBqdXN0XG5cdFx0XHRcdC8vIHNldHRpbmcgYF9tYXRjaD10cnVlYCB0byBwcmV2ZW50IG90aGVyIHJvdXRpbmVzIChlLmcuXG5cdFx0XHRcdC8vIGBmaW5kTWF0Y2hpbmdJbmRleGAgb3IgYGdldERvbVNpYmxpbmdgKSBmcm9tIHRoaW5raW5nIFZOb2RlcyBvciBET01cblx0XHRcdFx0Ly8gbm9kZXMgaW4gdGhpcyBwb3NpdGlvbiBhcmUgc3RpbGwgYXZhaWxhYmxlIHRvIGJlIHVzZWQgaW4gZGlmZmluZyB3aGVuXG5cdFx0XHRcdC8vIHRoZXkgaGF2ZSBhY3R1YWxseSBhbHJlYWR5IGJlZW4gdW5tb3VudGVkLiBGb3IgZXhhbXBsZSwgYnkgb25seVxuXHRcdFx0XHQvLyBzZXR0aW5nIGBfbWF0Y2g9dHJ1ZWAgaGVyZSwgdGhlIHVubW91bnRpbmcgbG9vcCBsYXRlciB3b3VsZCBhdHRlbXB0XG5cdFx0XHRcdC8vIHRvIHVubW91bnQgdGhpcyBWTm9kZSBhZ2FpbiBzZWVpbmcgYF9tYXRjaD09dHJ1ZWAuICBGdXJ0aGVyLFxuXHRcdFx0XHQvLyBnZXREb21TaWJsaW5nIGRvZXNuJ3Qga25vdyBhYm91dCBfbWF0Y2ggYW5kIHNvIHdvdWxkIGluY29ycmVjdGx5XG5cdFx0XHRcdC8vIGFzc3VtZSBET00gbm9kZXMgaW4gdGhpcyBzdWJ0cmVlIGFyZSBtb3VudGVkIGFuZCB1c2FibGUuXG5cdFx0XHRcdG9sZENoaWxkcmVuW2ldID0gbnVsbDtcblx0XHRcdFx0cmVtYWluaW5nT2xkQ2hpbGRyZW4tLTtcblx0XHRcdH1cblxuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0Y2hpbGRWTm9kZS5fcGFyZW50ID0gbmV3UGFyZW50Vk5vZGU7XG5cdFx0Y2hpbGRWTm9kZS5fZGVwdGggPSBuZXdQYXJlbnRWTm9kZS5fZGVwdGggKyAxO1xuXG5cdFx0Y29uc3Qgc2tld2VkSW5kZXggPSBpICsgc2tldztcblx0XHRjb25zdCBtYXRjaGluZ0luZGV4ID0gZmluZE1hdGNoaW5nSW5kZXgoXG5cdFx0XHRjaGlsZFZOb2RlLFxuXHRcdFx0b2xkQ2hpbGRyZW4sXG5cdFx0XHRza2V3ZWRJbmRleCxcblx0XHRcdHJlbWFpbmluZ09sZENoaWxkcmVuXG5cdFx0KTtcblxuXHRcdC8vIFRlbXBvcmFyaWx5IHN0b3JlIHRoZSBtYXRjaGluZ0luZGV4IG9uIHRoZSBfaW5kZXggcHJvcGVydHkgc28gd2UgY2FuIHB1bGxcblx0XHQvLyBvdXQgdGhlIG9sZFZOb2RlIGluIGRpZmZDaGlsZHJlbi4gV2UnbGwgb3ZlcnJpZGUgdGhpcyB0byB0aGUgVk5vZGUnc1xuXHRcdC8vIGZpbmFsIGluZGV4IGFmdGVyIHVzaW5nIHRoaXMgcHJvcGVydHkgdG8gZ2V0IHRoZSBvbGRWTm9kZVxuXHRcdGNoaWxkVk5vZGUuX2luZGV4ID0gbWF0Y2hpbmdJbmRleDtcblxuXHRcdG9sZFZOb2RlID0gbnVsbDtcblx0XHRpZiAobWF0Y2hpbmdJbmRleCAhPT0gLTEpIHtcblx0XHRcdG9sZFZOb2RlID0gb2xkQ2hpbGRyZW5bbWF0Y2hpbmdJbmRleF07XG5cdFx0XHRyZW1haW5pbmdPbGRDaGlsZHJlbi0tO1xuXHRcdFx0aWYgKG9sZFZOb2RlKSB7XG5cdFx0XHRcdG9sZFZOb2RlLl9mbGFncyB8PSBNQVRDSEVEO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIEhlcmUsIHdlIGRlZmluZSBpc01vdW50aW5nIGZvciB0aGUgcHVycG9zZXMgb2YgdGhlIHNrZXcgZGlmZmluZ1xuXHRcdC8vIGFsZ29yaXRobS4gTm9kZXMgdGhhdCBhcmUgdW5zdXNwZW5kaW5nIGFyZSBjb25zaWRlcmVkIG1vdW50aW5nIGFuZCB3ZSBkZXRlY3Rcblx0XHQvLyB0aGlzIGJ5IGNoZWNraW5nIGlmIG9sZFZOb2RlLl9vcmlnaW5hbCA9PT0gbnVsbFxuXHRcdGNvbnN0IGlzTW91bnRpbmcgPSBvbGRWTm9kZSA9PSBudWxsIHx8IG9sZFZOb2RlLl9vcmlnaW5hbCA9PT0gbnVsbDtcblxuXHRcdGlmIChpc01vdW50aW5nKSB7XG5cdFx0XHRpZiAobWF0Y2hpbmdJbmRleCA9PSAtMSkge1xuXHRcdFx0XHRza2V3LS07XG5cdFx0XHR9XG5cblx0XHRcdC8vIElmIHdlIGFyZSBtb3VudGluZyBhIERPTSBWTm9kZSwgbWFyayBpdCBmb3IgaW5zZXJ0aW9uXG5cdFx0XHRpZiAodHlwZW9mIGNoaWxkVk5vZGUudHlwZSAhPSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdGNoaWxkVk5vZGUuX2ZsYWdzIHw9IElOU0VSVF9WTk9ERTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKG1hdGNoaW5nSW5kZXggIT09IHNrZXdlZEluZGV4KSB7XG5cdFx0XHRpZiAobWF0Y2hpbmdJbmRleCA9PT0gc2tld2VkSW5kZXggKyAxKSB7XG5cdFx0XHRcdHNrZXcrKztcblx0XHRcdH0gZWxzZSBpZiAobWF0Y2hpbmdJbmRleCA+IHNrZXdlZEluZGV4KSB7XG5cdFx0XHRcdGlmIChyZW1haW5pbmdPbGRDaGlsZHJlbiA+IG5ld0NoaWxkcmVuTGVuZ3RoIC0gc2tld2VkSW5kZXgpIHtcblx0XHRcdFx0XHRza2V3ICs9IG1hdGNoaW5nSW5kZXggLSBza2V3ZWRJbmRleDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyAjIyMgQ2hhbmdlIGZyb20ga2V5ZWQ6IEkgdGhpbmsgdGhpcyB3YXMgbWlzc2luZyBmcm9tIHRoZSBhbGdvLi4uXG5cdFx0XHRcdFx0c2tldy0tO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKG1hdGNoaW5nSW5kZXggPCBza2V3ZWRJbmRleCkge1xuXHRcdFx0XHRpZiAobWF0Y2hpbmdJbmRleCA9PSBza2V3ZWRJbmRleCAtIDEpIHtcblx0XHRcdFx0XHRza2V3ID0gbWF0Y2hpbmdJbmRleCAtIHNrZXdlZEluZGV4O1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNrZXcgPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRza2V3ID0gMDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gTW92ZSB0aGlzIFZOb2RlJ3MgRE9NIGlmIHRoZSBvcmlnaW5hbCBpbmRleCAobWF0Y2hpbmdJbmRleCkgZG9lc24ndFxuXHRcdFx0Ly8gbWF0Y2ggdGhlIG5ldyBza2V3IGluZGV4IChpICsgbmV3IHNrZXcpXG5cdFx0XHRpZiAobWF0Y2hpbmdJbmRleCAhPT0gaSArIHNrZXcpIHtcblx0XHRcdFx0Y2hpbGRWTm9kZS5fZmxhZ3MgfD0gSU5TRVJUX1ZOT0RFO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIFJlbW92ZSByZW1haW5pbmcgb2xkQ2hpbGRyZW4gaWYgdGhlcmUgYXJlIGFueS4gTG9vcCBmb3J3YXJkcyBzbyB0aGF0IGFzIHdlXG5cdC8vIHVubW91bnQgRE9NIGZyb20gdGhlIGJlZ2lubmluZyBvZiB0aGUgb2xkQ2hpbGRyZW4sIHdlIGNhbiBhZGp1c3Qgb2xkRG9tIHRvXG5cdC8vIHBvaW50IHRvIHRoZSBuZXh0IGNoaWxkLCB3aGljaCBuZWVkcyB0byBiZSB0aGUgZmlyc3QgRE9NIG5vZGUgdGhhdCB3b24ndCBiZVxuXHQvLyB1bm1vdW50ZWQuXG5cdGlmIChyZW1haW5pbmdPbGRDaGlsZHJlbikge1xuXHRcdGZvciAoaSA9IDA7IGkgPCBvbGRDaGlsZHJlbkxlbmd0aDsgaSsrKSB7XG5cdFx0XHRvbGRWTm9kZSA9IG9sZENoaWxkcmVuW2ldO1xuXHRcdFx0aWYgKG9sZFZOb2RlICE9IG51bGwgJiYgKG9sZFZOb2RlLl9mbGFncyAmIE1BVENIRUQpID09PSAwKSB7XG5cdFx0XHRcdGlmIChvbGRWTm9kZS5fZG9tID09IG5ld1BhcmVudFZOb2RlLl9uZXh0RG9tKSB7XG5cdFx0XHRcdFx0bmV3UGFyZW50Vk5vZGUuX25leHREb20gPSBnZXREb21TaWJsaW5nKG9sZFZOb2RlKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHVubW91bnQob2xkVk5vZGUsIG9sZFZOb2RlKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge1ZOb2RlfSBwYXJlbnRWTm9kZVxuICogQHBhcmFtIHtQcmVhY3RFbGVtZW50fSBvbGREb21cbiAqIEBwYXJhbSB7UHJlYWN0RWxlbWVudH0gcGFyZW50RG9tXG4gKiBAcmV0dXJucyB7UHJlYWN0RWxlbWVudH1cbiAqL1xuZnVuY3Rpb24gaW5zZXJ0KHBhcmVudFZOb2RlLCBvbGREb20sIHBhcmVudERvbSkge1xuXHQvLyBOb3RlOiBWTm9kZXMgaW4gbmVzdGVkIHN1c3BlbmRlZCB0cmVlcyBtYXkgYmUgbWlzc2luZyBfY2hpbGRyZW4uXG5cblx0aWYgKHR5cGVvZiBwYXJlbnRWTm9kZS50eXBlID09ICdmdW5jdGlvbicpIHtcblx0XHRsZXQgY2hpbGRyZW4gPSBwYXJlbnRWTm9kZS5fY2hpbGRyZW47XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGNoaWxkcmVuICYmIGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKGNoaWxkcmVuW2ldKSB7XG5cdFx0XHRcdC8vIElmIHdlIGVudGVyIHRoaXMgY29kZSBwYXRoIG9uIHNDVSBiYWlsb3V0LCB3aGVyZSB3ZSBjb3B5XG5cdFx0XHRcdC8vIG9sZFZOb2RlLl9jaGlsZHJlbiB0byBuZXdWTm9kZS5fY2hpbGRyZW4sIHdlIG5lZWQgdG8gdXBkYXRlIHRoZSBvbGRcblx0XHRcdFx0Ly8gY2hpbGRyZW4ncyBfcGFyZW50IHBvaW50ZXIgdG8gcG9pbnQgdG8gdGhlIG5ld1ZOb2RlIChwYXJlbnRWTm9kZVxuXHRcdFx0XHQvLyBoZXJlKS5cblx0XHRcdFx0Y2hpbGRyZW5baV0uX3BhcmVudCA9IHBhcmVudFZOb2RlO1xuXHRcdFx0XHRvbGREb20gPSBpbnNlcnQoY2hpbGRyZW5baV0sIG9sZERvbSwgcGFyZW50RG9tKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gb2xkRG9tO1xuXHR9IGVsc2UgaWYgKHBhcmVudFZOb2RlLl9kb20gIT0gb2xkRG9tKSB7XG5cdFx0cGFyZW50RG9tLmluc2VydEJlZm9yZShwYXJlbnRWTm9kZS5fZG9tLCBvbGREb20gfHwgbnVsbCk7XG5cdFx0b2xkRG9tID0gcGFyZW50Vk5vZGUuX2RvbTtcblx0fVxuXG5cdHJldHVybiBvbGREb20gJiYgb2xkRG9tLm5leHRTaWJsaW5nO1xufVxuXG4vKipcbiAqIEZsYXR0ZW4gYW5kIGxvb3AgdGhyb3VnaCB0aGUgY2hpbGRyZW4gb2YgYSB2aXJ0dWFsIG5vZGVcbiAqIEBwYXJhbSB7Q29tcG9uZW50Q2hpbGRyZW59IGNoaWxkcmVuIFRoZSB1bmZsYXR0ZW5lZCBjaGlsZHJlbiBvZiBhIHZpcnR1YWxcbiAqIG5vZGVcbiAqIEByZXR1cm5zIHtWTm9kZVtdfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9DaGlsZEFycmF5KGNoaWxkcmVuLCBvdXQpIHtcblx0b3V0ID0gb3V0IHx8IFtdO1xuXHRpZiAoY2hpbGRyZW4gPT0gbnVsbCB8fCB0eXBlb2YgY2hpbGRyZW4gPT0gJ2Jvb2xlYW4nKSB7XG5cdH0gZWxzZSBpZiAoaXNBcnJheShjaGlsZHJlbikpIHtcblx0XHRjaGlsZHJlbi5zb21lKGNoaWxkID0+IHtcblx0XHRcdHRvQ2hpbGRBcnJheShjaGlsZCwgb3V0KTtcblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHRvdXQucHVzaChjaGlsZHJlbik7XG5cdH1cblx0cmV0dXJuIG91dDtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge1ZOb2RlfSBjaGlsZFZOb2RlXG4gKiBAcGFyYW0ge1ZOb2RlW119IG9sZENoaWxkcmVuXG4gKiBAcGFyYW0ge251bWJlcn0gc2tld2VkSW5kZXhcbiAqIEBwYXJhbSB7bnVtYmVyfSByZW1haW5pbmdPbGRDaGlsZHJlblxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZnVuY3Rpb24gZmluZE1hdGNoaW5nSW5kZXgoXG5cdGNoaWxkVk5vZGUsXG5cdG9sZENoaWxkcmVuLFxuXHRza2V3ZWRJbmRleCxcblx0cmVtYWluaW5nT2xkQ2hpbGRyZW5cbikge1xuXHRjb25zdCBrZXkgPSBjaGlsZFZOb2RlLmtleTtcblx0Y29uc3QgdHlwZSA9IGNoaWxkVk5vZGUudHlwZTtcblx0bGV0IHggPSBza2V3ZWRJbmRleCAtIDE7XG5cdGxldCB5ID0gc2tld2VkSW5kZXggKyAxO1xuXHRsZXQgb2xkVk5vZGUgPSBvbGRDaGlsZHJlbltza2V3ZWRJbmRleF07XG5cblx0Ly8gV2Ugb25seSBuZWVkIHRvIHBlcmZvcm0gYSBzZWFyY2ggaWYgdGhlcmUgYXJlIG1vcmUgY2hpbGRyZW5cblx0Ly8gKHJlbWFpbmluZ09sZENoaWxkcmVuKSB0byBzZWFyY2guIEhvd2V2ZXIsIGlmIHRoZSBvbGRWTm9kZSB3ZSBqdXN0IGxvb2tlZFxuXHQvLyBhdCBza2V3ZWRJbmRleCB3YXMgbm90IGFscmVhZHkgdXNlZCBpbiB0aGlzIGRpZmYsIHRoZW4gdGhlcmUgbXVzdCBiZSBhdFxuXHQvLyBsZWFzdCAxIG90aGVyIChzbyBncmVhdGVyIHRoYW4gMSkgcmVtYWluaW5nT2xkQ2hpbGRyZW4gdG8gYXR0ZW1wdCB0byBtYXRjaFxuXHQvLyBhZ2FpbnN0LiBTbyB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbiBjaGVja3MgdGhhdCBlbnN1cmluZ1xuXHQvLyByZW1haW5pbmdPbGRDaGlsZHJlbiA+IDEgaWYgdGhlIG9sZFZOb2RlIGlzIG5vdCBhbHJlYWR5IHVzZWQvbWF0Y2hlZC4gRWxzZVxuXHQvLyBpZiB0aGUgb2xkVk5vZGUgd2FzIG51bGwgb3IgbWF0Y2hlZCwgdGhlbiB0aGVyZSBjb3VsZCBuZWVkcyB0byBiZSBhdCBsZWFzdFxuXHQvLyAxIChha2EgYHJlbWFpbmluZ09sZENoaWxkcmVuID4gMGApIGNoaWxkcmVuIHRvIGZpbmQgYW5kIGNvbXBhcmUgYWdhaW5zdC5cblx0bGV0IHNob3VsZFNlYXJjaCA9XG5cdFx0cmVtYWluaW5nT2xkQ2hpbGRyZW4gPlxuXHRcdChvbGRWTm9kZSAhPSBudWxsICYmIChvbGRWTm9kZS5fZmxhZ3MgJiBNQVRDSEVEKSA9PT0gMCA/IDEgOiAwKTtcblxuXHRpZiAoXG5cdFx0b2xkVk5vZGUgPT09IG51bGwgfHxcblx0XHQob2xkVk5vZGUgJiYga2V5ID09IG9sZFZOb2RlLmtleSAmJiB0eXBlID09PSBvbGRWTm9kZS50eXBlKVxuXHQpIHtcblx0XHRyZXR1cm4gc2tld2VkSW5kZXg7XG5cdH0gZWxzZSBpZiAoc2hvdWxkU2VhcmNoKSB7XG5cdFx0d2hpbGUgKHggPj0gMCB8fCB5IDwgb2xkQ2hpbGRyZW4ubGVuZ3RoKSB7XG5cdFx0XHRpZiAoeCA+PSAwKSB7XG5cdFx0XHRcdG9sZFZOb2RlID0gb2xkQ2hpbGRyZW5beF07XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHRvbGRWTm9kZSAmJlxuXHRcdFx0XHRcdChvbGRWTm9kZS5fZmxhZ3MgJiBNQVRDSEVEKSA9PT0gMCAmJlxuXHRcdFx0XHRcdGtleSA9PSBvbGRWTm9kZS5rZXkgJiZcblx0XHRcdFx0XHR0eXBlID09PSBvbGRWTm9kZS50eXBlXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHJldHVybiB4O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHgtLTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHkgPCBvbGRDaGlsZHJlbi5sZW5ndGgpIHtcblx0XHRcdFx0b2xkVk5vZGUgPSBvbGRDaGlsZHJlblt5XTtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdG9sZFZOb2RlICYmXG5cdFx0XHRcdFx0KG9sZFZOb2RlLl9mbGFncyAmIE1BVENIRUQpID09PSAwICYmXG5cdFx0XHRcdFx0a2V5ID09IG9sZFZOb2RlLmtleSAmJlxuXHRcdFx0XHRcdHR5cGUgPT09IG9sZFZOb2RlLnR5cGVcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHk7XG5cdFx0XHRcdH1cblx0XHRcdFx0eSsrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiAtMTtcbn1cbiIsICJpbXBvcnQgeyBJU19OT05fRElNRU5TSU9OQUwgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IG9wdGlvbnMgZnJvbSAnLi4vb3B0aW9ucyc7XG5cbmZ1bmN0aW9uIHNldFN0eWxlKHN0eWxlLCBrZXksIHZhbHVlKSB7XG5cdGlmIChrZXlbMF0gPT09ICctJykge1xuXHRcdHN0eWxlLnNldFByb3BlcnR5KGtleSwgdmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWUpO1xuXHR9IGVsc2UgaWYgKHZhbHVlID09IG51bGwpIHtcblx0XHRzdHlsZVtrZXldID0gJyc7XG5cdH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlICE9ICdudW1iZXInIHx8IElTX05PTl9ESU1FTlNJT05BTC50ZXN0KGtleSkpIHtcblx0XHRzdHlsZVtrZXldID0gdmFsdWU7XG5cdH0gZWxzZSB7XG5cdFx0c3R5bGVba2V5XSA9IHZhbHVlICsgJ3B4Jztcblx0fVxufVxuXG4vKipcbiAqIFNldCBhIHByb3BlcnR5IHZhbHVlIG9uIGEgRE9NIG5vZGVcbiAqIEBwYXJhbSB7UHJlYWN0RWxlbWVudH0gZG9tIFRoZSBET00gbm9kZSB0byBtb2RpZnlcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSB0byBzZXRcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldCB0aGUgcHJvcGVydHkgdG9cbiAqIEBwYXJhbSB7Kn0gb2xkVmFsdWUgVGhlIG9sZCB2YWx1ZSB0aGUgcHJvcGVydHkgaGFkXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzU3ZnIFdoZXRoZXIgb3Igbm90IHRoaXMgRE9NIG5vZGUgaXMgYW4gU1ZHIG5vZGUgb3Igbm90XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRQcm9wZXJ0eShkb20sIG5hbWUsIHZhbHVlLCBvbGRWYWx1ZSwgaXNTdmcpIHtcblx0bGV0IHVzZUNhcHR1cmU7XG5cblx0bzogaWYgKG5hbWUgPT09ICdzdHlsZScpIHtcblx0XHRpZiAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnKSB7XG5cdFx0XHRkb20uc3R5bGUuY3NzVGV4dCA9IHZhbHVlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAodHlwZW9mIG9sZFZhbHVlID09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdGRvbS5zdHlsZS5jc3NUZXh0ID0gb2xkVmFsdWUgPSAnJztcblx0XHRcdH1cblxuXHRcdFx0aWYgKG9sZFZhbHVlKSB7XG5cdFx0XHRcdGZvciAobmFtZSBpbiBvbGRWYWx1ZSkge1xuXHRcdFx0XHRcdGlmICghKHZhbHVlICYmIG5hbWUgaW4gdmFsdWUpKSB7XG5cdFx0XHRcdFx0XHRzZXRTdHlsZShkb20uc3R5bGUsIG5hbWUsICcnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRcdGZvciAobmFtZSBpbiB2YWx1ZSkge1xuXHRcdFx0XHRcdGlmICghb2xkVmFsdWUgfHwgdmFsdWVbbmFtZV0gIT09IG9sZFZhbHVlW25hbWVdKSB7XG5cdFx0XHRcdFx0XHRzZXRTdHlsZShkb20uc3R5bGUsIG5hbWUsIHZhbHVlW25hbWVdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblx0Ly8gQmVuY2htYXJrIGZvciBjb21wYXJpc29uOiBodHRwczovL2VzYmVuY2guY29tL2JlbmNoLzU3NGM5NTRiZGI5NjViOWEwMDk2NWFjNlxuXHRlbHNlIGlmIChuYW1lWzBdID09PSAnbycgJiYgbmFtZVsxXSA9PT0gJ24nKSB7XG5cdFx0dXNlQ2FwdHVyZSA9XG5cdFx0XHRuYW1lICE9PSAobmFtZSA9IG5hbWUucmVwbGFjZSgvKFBvaW50ZXJDYXB0dXJlKSR8Q2FwdHVyZSQvLCAnJDEnKSk7XG5cblx0XHQvLyBJbmZlciBjb3JyZWN0IGNhc2luZyBmb3IgRE9NIGJ1aWx0LWluIGV2ZW50czpcblx0XHRpZiAobmFtZS50b0xvd2VyQ2FzZSgpIGluIGRvbSkgbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKS5zbGljZSgyKTtcblx0XHRlbHNlIG5hbWUgPSBuYW1lLnNsaWNlKDIpO1xuXG5cdFx0aWYgKCFkb20uX2xpc3RlbmVycykgZG9tLl9saXN0ZW5lcnMgPSB7fTtcblx0XHRkb20uX2xpc3RlbmVyc1tuYW1lICsgdXNlQ2FwdHVyZV0gPSB2YWx1ZTtcblxuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0aWYgKCFvbGRWYWx1ZSkge1xuXHRcdFx0XHR2YWx1ZS5fYXR0YWNoZWQgPSBEYXRlLm5vdygpO1xuXHRcdFx0XHRjb25zdCBoYW5kbGVyID0gdXNlQ2FwdHVyZSA/IGV2ZW50UHJveHlDYXB0dXJlIDogZXZlbnRQcm94eTtcblx0XHRcdFx0ZG9tLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgaGFuZGxlciwgdXNlQ2FwdHVyZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YWx1ZS5fYXR0YWNoZWQgPSBvbGRWYWx1ZS5fYXR0YWNoZWQ7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGhhbmRsZXIgPSB1c2VDYXB0dXJlID8gZXZlbnRQcm94eUNhcHR1cmUgOiBldmVudFByb3h5O1xuXHRcdFx0ZG9tLnJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSwgaGFuZGxlciwgdXNlQ2FwdHVyZSk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGlmIChpc1N2Zykge1xuXHRcdFx0Ly8gTm9ybWFsaXplIGluY29ycmVjdCBwcm9wIHVzYWdlIGZvciBTVkc6XG5cdFx0XHQvLyAtIHhsaW5rOmhyZWYgLyB4bGlua0hyZWYgLS0+IGhyZWYgKHhsaW5rOmhyZWYgd2FzIHJlbW92ZWQgZnJvbSBTVkcgYW5kIGlzbid0IG5lZWRlZClcblx0XHRcdC8vIC0gY2xhc3NOYW1lIC0tPiBjbGFzc1xuXHRcdFx0bmFtZSA9IG5hbWUucmVwbGFjZSgveGxpbmsoSHw6aCkvLCAnaCcpLnJlcGxhY2UoL3NOYW1lJC8sICdzJyk7XG5cdFx0fSBlbHNlIGlmIChcblx0XHRcdG5hbWUgIT09ICd3aWR0aCcgJiZcblx0XHRcdG5hbWUgIT09ICdoZWlnaHQnICYmXG5cdFx0XHRuYW1lICE9PSAnaHJlZicgJiZcblx0XHRcdG5hbWUgIT09ICdsaXN0JyAmJlxuXHRcdFx0bmFtZSAhPT0gJ2Zvcm0nICYmXG5cdFx0XHQvLyBEZWZhdWx0IHZhbHVlIGluIGJyb3dzZXJzIGlzIGAtMWAgYW5kIGFuIGVtcHR5IHN0cmluZyBpc1xuXHRcdFx0Ly8gY2FzdCB0byBgMGAgaW5zdGVhZFxuXHRcdFx0bmFtZSAhPT0gJ3RhYkluZGV4JyAmJlxuXHRcdFx0bmFtZSAhPT0gJ2Rvd25sb2FkJyAmJlxuXHRcdFx0bmFtZSAhPT0gJ3Jvd1NwYW4nICYmXG5cdFx0XHRuYW1lICE9PSAnY29sU3BhbicgJiZcblx0XHRcdG5hbWUgIT09ICdyb2xlJyAmJlxuXHRcdFx0bmFtZSBpbiBkb21cblx0XHQpIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGRvbVtuYW1lXSA9IHZhbHVlID09IG51bGwgPyAnJyA6IHZhbHVlO1xuXHRcdFx0XHQvLyBsYWJlbGxlZCBicmVhayBpcyAxYiBzbWFsbGVyIGhlcmUgdGhhbiBhIHJldHVybiBzdGF0ZW1lbnQgKHNvcnJ5KVxuXHRcdFx0XHRicmVhayBvO1xuXHRcdFx0fSBjYXRjaCAoZSkge31cblx0XHR9XG5cblx0XHQvLyBhcmlhLSBhbmQgZGF0YS0gYXR0cmlidXRlcyBoYXZlIG5vIGJvb2xlYW4gcmVwcmVzZW50YXRpb24uXG5cdFx0Ly8gQSBgZmFsc2VgIHZhbHVlIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBhdHRyaWJ1dGUgbm90IGJlaW5nXG5cdFx0Ly8gcHJlc2VudCwgc28gd2UgY2FuJ3QgcmVtb3ZlIGl0LiBGb3Igbm9uLWJvb2xlYW4gYXJpYVxuXHRcdC8vIGF0dHJpYnV0ZXMgd2UgY291bGQgdHJlYXQgZmFsc2UgYXMgYSByZW1vdmFsLCBidXQgdGhlXG5cdFx0Ly8gYW1vdW50IG9mIGV4Y2VwdGlvbnMgd291bGQgY29zdCB0b28gbWFueSBieXRlcy4gT24gdG9wIG9mXG5cdFx0Ly8gdGhhdCBvdGhlciBmcmFtZXdvcmtzIGdlbmVyYWxseSBzdHJpbmdpZnkgYGZhbHNlYC5cblxuXHRcdGlmICh0eXBlb2YgdmFsdWUgPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0Ly8gbmV2ZXIgc2VyaWFsaXplIGZ1bmN0aW9ucyBhcyBhdHRyaWJ1dGUgdmFsdWVzXG5cdFx0fSBlbHNlIGlmICh2YWx1ZSAhPSBudWxsICYmICh2YWx1ZSAhPT0gZmFsc2UgfHwgbmFtZVs0XSA9PT0gJy0nKSkge1xuXHRcdFx0ZG9tLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGRvbS5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG5cdFx0fVxuXHR9XG59XG5cbi8qKlxuICogUHJveHkgYW4gZXZlbnQgdG8gaG9va2VkIGV2ZW50IGhhbmRsZXJzXG4gKiBAcGFyYW0ge1ByZWFjdEV2ZW50fSBlIFRoZSBldmVudCBvYmplY3QgZnJvbSB0aGUgYnJvd3NlclxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZXZlbnRQcm94eShlKSB7XG5cdGNvbnN0IGV2ZW50SGFuZGxlciA9IHRoaXMuX2xpc3RlbmVyc1tlLnR5cGUgKyBmYWxzZV07XG5cdC8qKlxuXHQgKiBUaGlzIHRyaWNrIGlzIGluc3BpcmVkIGJ5IFZ1ZSBodHRwczovL2dpdGh1Yi5jb20vdnVlanMvY29yZS9ibG9iL21haW4vcGFja2FnZXMvcnVudGltZS1kb20vc3JjL21vZHVsZXMvZXZlbnRzLnRzI0w5MC1MMTAxXG5cdCAqIHdoZW4gdGhlIGRvbSBwZXJmb3JtcyBhbiBldmVudCBpdCBsZWF2ZXMgbWljcm8tdGlja3MgaW4gYmV0d2VlbiBidWJibGluZyB1cCB3aGljaCBtZWFucyB0aGF0IGFuIGV2ZW50IGNhbiB0cmlnZ2VyIG9uIGEgbmV3bHlcblx0ICogY3JlYXRlZCBET00tbm9kZSB3aGlsZSB0aGUgZXZlbnQgYnViYmxlcyB1cCwgdGhpcyBjYW4gY2F1c2UgcXVpcmt5IGJlaGF2aW9yIGFzIHNlZW4gaW4gaHR0cHM6Ly9naXRodWIuY29tL3ByZWFjdGpzL3ByZWFjdC9pc3N1ZXMvMzkyN1xuXHQgKi9cblx0aWYgKCFlLl9kaXNwYXRjaGVkKSB7XG5cdFx0Ly8gV2hlbiBhbiBldmVudCBoYXMgbm8gX2Rpc3BhdGNoZWQgd2Uga25vdyB0aGlzIGlzIHRoZSBmaXJzdCBldmVudC10YXJnZXQgaW4gdGhlIGNoYWluXG5cdFx0Ly8gc28gd2Ugc2V0IHRoZSBpbml0aWFsIGRpc3BhdGNoZWQgdGltZS5cblx0XHRlLl9kaXNwYXRjaGVkID0gRGF0ZS5ub3coKTtcblx0XHQvLyBXaGVuIHRoZSBfZGlzcGF0Y2hlZCBpcyBzbWFsbGVyIHRoYW4gdGhlIHRpbWUgd2hlbiB0aGUgdGFyZ2V0dGVkIGV2ZW50IGhhbmRsZXIgd2FzIGF0dGFjaGVkXG5cdFx0Ly8gd2Uga25vdyB3ZSBoYXZlIGJ1YmJsZWQgdXAgdG8gYW4gZWxlbWVudCB0aGF0IHdhcyBhZGRlZCBkdXJpbmcgcGF0Y2hpbmcgdGhlIGRvbS5cblx0fSBlbHNlIGlmIChlLl9kaXNwYXRjaGVkIDw9IGV2ZW50SGFuZGxlci5fYXR0YWNoZWQpIHtcblx0XHRyZXR1cm47XG5cdH1cblx0cmV0dXJuIGV2ZW50SGFuZGxlcihvcHRpb25zLmV2ZW50ID8gb3B0aW9ucy5ldmVudChlKSA6IGUpO1xufVxuXG4vKipcbiAqIFByb3h5IGFuIGV2ZW50IHRvIGhvb2tlZCBldmVudCBoYW5kbGVyc1xuICogQHBhcmFtIHtQcmVhY3RFdmVudH0gZSBUaGUgZXZlbnQgb2JqZWN0IGZyb20gdGhlIGJyb3dzZXJcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGV2ZW50UHJveHlDYXB0dXJlKGUpIHtcblx0cmV0dXJuIHRoaXMuX2xpc3RlbmVyc1tlLnR5cGUgKyB0cnVlXShvcHRpb25zLmV2ZW50ID8gb3B0aW9ucy5ldmVudChlKSA6IGUpO1xufVxuIiwgImltcG9ydCB7XG5cdEVNUFRZX09CSixcblx0TU9ERV9IWURSQVRFLFxuXHRNT0RFX1NVU1BFTkRFRCxcblx0UkVTRVRfTU9ERVxufSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgQmFzZUNvbXBvbmVudCwgZ2V0RG9tU2libGluZyB9IGZyb20gJy4uL2NvbXBvbmVudCc7XG5pbXBvcnQgeyBGcmFnbWVudCB9IGZyb20gJy4uL2NyZWF0ZS1lbGVtZW50JztcbmltcG9ydCB7IGRpZmZDaGlsZHJlbiB9IGZyb20gJy4vY2hpbGRyZW4nO1xuaW1wb3J0IHsgc2V0UHJvcGVydHkgfSBmcm9tICcuL3Byb3BzJztcbmltcG9ydCB7IGFzc2lnbiwgaXNBcnJheSwgcmVtb3ZlTm9kZSwgc2xpY2UgfSBmcm9tICcuLi91dGlsJztcbmltcG9ydCBvcHRpb25zIGZyb20gJy4uL29wdGlvbnMnO1xuXG4vKipcbiAqIERpZmYgdHdvIHZpcnR1YWwgbm9kZXMgYW5kIGFwcGx5IHByb3BlciBjaGFuZ2VzIHRvIHRoZSBET01cbiAqIEBwYXJhbSB7UHJlYWN0RWxlbWVudH0gcGFyZW50RG9tIFRoZSBwYXJlbnQgb2YgdGhlIERPTSBlbGVtZW50XG4gKiBAcGFyYW0ge1ZOb2RlfSBuZXdWTm9kZSBUaGUgbmV3IHZpcnR1YWwgbm9kZVxuICogQHBhcmFtIHtWTm9kZX0gb2xkVk5vZGUgVGhlIG9sZCB2aXJ0dWFsIG5vZGVcbiAqIEBwYXJhbSB7b2JqZWN0fSBnbG9iYWxDb250ZXh0IFRoZSBjdXJyZW50IGNvbnRleHQgb2JqZWN0LiBNb2RpZmllZCBieVxuICogZ2V0Q2hpbGRDb250ZXh0XG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzU3ZnIFdoZXRoZXIgb3Igbm90IHRoaXMgZWxlbWVudCBpcyBhbiBTVkcgbm9kZVxuICogQHBhcmFtIHtBcnJheTxQcmVhY3RFbGVtZW50Pn0gZXhjZXNzRG9tQ2hpbGRyZW5cbiAqIEBwYXJhbSB7QXJyYXk8Q29tcG9uZW50Pn0gY29tbWl0UXVldWUgTGlzdCBvZiBjb21wb25lbnRzIHdoaWNoIGhhdmUgY2FsbGJhY2tzXG4gKiB0byBpbnZva2UgaW4gY29tbWl0Um9vdFxuICogQHBhcmFtIHtQcmVhY3RFbGVtZW50fSBvbGREb20gVGhlIGN1cnJlbnQgYXR0YWNoZWQgRE9NIGVsZW1lbnQgYW55IG5ldyBkb21cbiAqIGVsZW1lbnRzIHNob3VsZCBiZSBwbGFjZWQgYXJvdW5kLiBMaWtlbHkgYG51bGxgIG9uIGZpcnN0IHJlbmRlciAoZXhjZXB0IHdoZW5cbiAqIGh5ZHJhdGluZykuIENhbiBiZSBhIHNpYmxpbmcgRE9NIGVsZW1lbnQgd2hlbiBkaWZmaW5nIEZyYWdtZW50cyB0aGF0IGhhdmVcbiAqIHNpYmxpbmdzLiBJbiBtb3N0IGNhc2VzLCBpdCBzdGFydHMgb3V0IGFzIGBvbGRDaGlsZHJlblswXS5fZG9tYC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNIeWRyYXRpbmcgV2hldGhlciBvciBub3Qgd2UgYXJlIGluIGh5ZHJhdGlvblxuICogQHBhcmFtIHthbnlbXX0gcmVmUXVldWUgYW4gYXJyYXkgb2YgZWxlbWVudHMgbmVlZGVkIHRvIGludm9rZSByZWZzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkaWZmKFxuXHRwYXJlbnREb20sXG5cdG5ld1ZOb2RlLFxuXHRvbGRWTm9kZSxcblx0Z2xvYmFsQ29udGV4dCxcblx0aXNTdmcsXG5cdGV4Y2Vzc0RvbUNoaWxkcmVuLFxuXHRjb21taXRRdWV1ZSxcblx0b2xkRG9tLFxuXHRpc0h5ZHJhdGluZyxcblx0cmVmUXVldWVcbikge1xuXHQvKiogQHR5cGUge2FueX0gKi9cblx0bGV0IHRtcCxcblx0XHRuZXdUeXBlID0gbmV3Vk5vZGUudHlwZTtcblxuXHQvLyBXaGVuIHBhc3NpbmcgdGhyb3VnaCBjcmVhdGVFbGVtZW50IGl0IGFzc2lnbnMgdGhlIG9iamVjdFxuXHQvLyBjb25zdHJ1Y3RvciBhcyB1bmRlZmluZWQuIFRoaXMgdG8gcHJldmVudCBKU09OLWluamVjdGlvbi5cblx0aWYgKG5ld1ZOb2RlLmNvbnN0cnVjdG9yICE9PSB1bmRlZmluZWQpIHJldHVybiBudWxsO1xuXG5cdC8vIElmIHRoZSBwcmV2aW91cyBkaWZmIGJhaWxlZCBvdXQsIHJlc3VtZSBjcmVhdGluZy9oeWRyYXRpbmcuXG5cdGlmIChvbGRWTm9kZS5fZmxhZ3MgJiBNT0RFX1NVU1BFTkRFRCkge1xuXHRcdGlzSHlkcmF0aW5nID0gISEob2xkVk5vZGUuX2ZsYWdzICYgTU9ERV9IWURSQVRFKTtcblx0XHRvbGREb20gPSBuZXdWTm9kZS5fZG9tID0gb2xkVk5vZGUuX2RvbTtcblx0XHRleGNlc3NEb21DaGlsZHJlbiA9IFtvbGREb21dO1xuXHR9XG5cblx0aWYgKCh0bXAgPSBvcHRpb25zLl9kaWZmKSkgdG1wKG5ld1ZOb2RlKTtcblxuXHRvdXRlcjogaWYgKHR5cGVvZiBuZXdUeXBlID09ICdmdW5jdGlvbicpIHtcblx0XHR0cnkge1xuXHRcdFx0bGV0IGMsIGlzTmV3LCBvbGRQcm9wcywgb2xkU3RhdGUsIHNuYXBzaG90LCBjbGVhclByb2Nlc3NpbmdFeGNlcHRpb247XG5cdFx0XHRsZXQgbmV3UHJvcHMgPSBuZXdWTm9kZS5wcm9wcztcblxuXHRcdFx0Ly8gTmVjZXNzYXJ5IGZvciBjcmVhdGVDb250ZXh0IGFwaS4gU2V0dGluZyB0aGlzIHByb3BlcnR5IHdpbGwgcGFzc1xuXHRcdFx0Ly8gdGhlIGNvbnRleHQgdmFsdWUgYXMgYHRoaXMuY29udGV4dGAganVzdCBmb3IgdGhpcyBjb21wb25lbnQuXG5cdFx0XHR0bXAgPSBuZXdUeXBlLmNvbnRleHRUeXBlO1xuXHRcdFx0bGV0IHByb3ZpZGVyID0gdG1wICYmIGdsb2JhbENvbnRleHRbdG1wLl9pZF07XG5cdFx0XHRsZXQgY29tcG9uZW50Q29udGV4dCA9IHRtcFxuXHRcdFx0XHQ/IHByb3ZpZGVyXG5cdFx0XHRcdFx0PyBwcm92aWRlci5wcm9wcy52YWx1ZVxuXHRcdFx0XHRcdDogdG1wLl9kZWZhdWx0VmFsdWVcblx0XHRcdFx0OiBnbG9iYWxDb250ZXh0O1xuXG5cdFx0XHQvLyBHZXQgY29tcG9uZW50IGFuZCBzZXQgaXQgdG8gYGNgXG5cdFx0XHRpZiAob2xkVk5vZGUuX2NvbXBvbmVudCkge1xuXHRcdFx0XHRjID0gbmV3Vk5vZGUuX2NvbXBvbmVudCA9IG9sZFZOb2RlLl9jb21wb25lbnQ7XG5cdFx0XHRcdGNsZWFyUHJvY2Vzc2luZ0V4Y2VwdGlvbiA9IGMuX3Byb2Nlc3NpbmdFeGNlcHRpb24gPSBjLl9wZW5kaW5nRXJyb3I7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBJbnN0YW50aWF0ZSB0aGUgbmV3IGNvbXBvbmVudFxuXHRcdFx0XHRpZiAoJ3Byb3RvdHlwZScgaW4gbmV3VHlwZSAmJiBuZXdUeXBlLnByb3RvdHlwZS5yZW5kZXIpIHtcblx0XHRcdFx0XHQvLyBAdHMtZXhwZWN0LWVycm9yIFRoZSBjaGVjayBhYm92ZSB2ZXJpZmllcyB0aGF0IG5ld1R5cGUgaXMgc3VwcG9zZSB0byBiZSBjb25zdHJ1Y3RlZFxuXHRcdFx0XHRcdG5ld1ZOb2RlLl9jb21wb25lbnQgPSBjID0gbmV3IG5ld1R5cGUobmV3UHJvcHMsIGNvbXBvbmVudENvbnRleHQpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5ldy1jYXBcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBAdHMtZXhwZWN0LWVycm9yIFRydXN0IG1lLCBDb21wb25lbnQgaW1wbGVtZW50cyB0aGUgaW50ZXJmYWNlIHdlIHdhbnRcblx0XHRcdFx0XHRuZXdWTm9kZS5fY29tcG9uZW50ID0gYyA9IG5ldyBCYXNlQ29tcG9uZW50KFxuXHRcdFx0XHRcdFx0bmV3UHJvcHMsXG5cdFx0XHRcdFx0XHRjb21wb25lbnRDb250ZXh0XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRjLmNvbnN0cnVjdG9yID0gbmV3VHlwZTtcblx0XHRcdFx0XHRjLnJlbmRlciA9IGRvUmVuZGVyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChwcm92aWRlcikgcHJvdmlkZXIuc3ViKGMpO1xuXG5cdFx0XHRcdGMucHJvcHMgPSBuZXdQcm9wcztcblx0XHRcdFx0aWYgKCFjLnN0YXRlKSBjLnN0YXRlID0ge307XG5cdFx0XHRcdGMuY29udGV4dCA9IGNvbXBvbmVudENvbnRleHQ7XG5cdFx0XHRcdGMuX2dsb2JhbENvbnRleHQgPSBnbG9iYWxDb250ZXh0O1xuXHRcdFx0XHRpc05ldyA9IGMuX2RpcnR5ID0gdHJ1ZTtcblx0XHRcdFx0Yy5fcmVuZGVyQ2FsbGJhY2tzID0gW107XG5cdFx0XHRcdGMuX3N0YXRlQ2FsbGJhY2tzID0gW107XG5cdFx0XHR9XG5cblx0XHRcdC8vIEludm9rZSBnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHNcblx0XHRcdGlmIChjLl9uZXh0U3RhdGUgPT0gbnVsbCkge1xuXHRcdFx0XHRjLl9uZXh0U3RhdGUgPSBjLnN0YXRlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAobmV3VHlwZS5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMgIT0gbnVsbCkge1xuXHRcdFx0XHRpZiAoYy5fbmV4dFN0YXRlID09IGMuc3RhdGUpIHtcblx0XHRcdFx0XHRjLl9uZXh0U3RhdGUgPSBhc3NpZ24oe30sIGMuX25leHRTdGF0ZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhc3NpZ24oXG5cdFx0XHRcdFx0Yy5fbmV4dFN0YXRlLFxuXHRcdFx0XHRcdG5ld1R5cGUuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKG5ld1Byb3BzLCBjLl9uZXh0U3RhdGUpXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cblx0XHRcdG9sZFByb3BzID0gYy5wcm9wcztcblx0XHRcdG9sZFN0YXRlID0gYy5zdGF0ZTtcblx0XHRcdGMuX3Zub2RlID0gbmV3Vk5vZGU7XG5cblx0XHRcdC8vIEludm9rZSBwcmUtcmVuZGVyIGxpZmVjeWNsZSBtZXRob2RzXG5cdFx0XHRpZiAoaXNOZXcpIHtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdG5ld1R5cGUuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzID09IG51bGwgJiZcblx0XHRcdFx0XHRjLmNvbXBvbmVudFdpbGxNb3VudCAhPSBudWxsXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdGMuY29tcG9uZW50V2lsbE1vdW50KCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoYy5jb21wb25lbnREaWRNb3VudCAhPSBudWxsKSB7XG5cdFx0XHRcdFx0Yy5fcmVuZGVyQ2FsbGJhY2tzLnB1c2goYy5jb21wb25lbnREaWRNb3VudCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHRuZXdUeXBlLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyA9PSBudWxsICYmXG5cdFx0XHRcdFx0bmV3UHJvcHMgIT09IG9sZFByb3BzICYmXG5cdFx0XHRcdFx0Yy5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzICE9IG51bGxcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0Yy5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5ld1Byb3BzLCBjb21wb25lbnRDb250ZXh0KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHQhYy5fZm9yY2UgJiZcblx0XHRcdFx0XHQoKGMuc2hvdWxkQ29tcG9uZW50VXBkYXRlICE9IG51bGwgJiZcblx0XHRcdFx0XHRcdGMuc2hvdWxkQ29tcG9uZW50VXBkYXRlKFxuXHRcdFx0XHRcdFx0XHRuZXdQcm9wcyxcblx0XHRcdFx0XHRcdFx0Yy5fbmV4dFN0YXRlLFxuXHRcdFx0XHRcdFx0XHRjb21wb25lbnRDb250ZXh0XG5cdFx0XHRcdFx0XHQpID09PSBmYWxzZSkgfHxcblx0XHRcdFx0XHRcdG5ld1ZOb2RlLl9vcmlnaW5hbCA9PT0gb2xkVk5vZGUuX29yaWdpbmFsKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHQvLyBNb3JlIGluZm8gYWJvdXQgdGhpcyBoZXJlOiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9Kb3ZpRGVDcm9vY2svYmVjNWYyY2U5MzU0NGQyZTYwNzBlZjhlMDAzNmU0ZThcblx0XHRcdFx0XHRpZiAobmV3Vk5vZGUuX29yaWdpbmFsICE9PSBvbGRWTm9kZS5fb3JpZ2luYWwpIHtcblx0XHRcdFx0XHRcdC8vIFdoZW4gd2UgYXJlIGRlYWxpbmcgd2l0aCBhIGJhaWwgYmVjYXVzZSBvZiBzQ1Ugd2UgaGF2ZSB0byB1cGRhdGVcblx0XHRcdFx0XHRcdC8vIHRoZSBwcm9wcywgc3RhdGUgYW5kIGRpcnR5LXN0YXRlLlxuXHRcdFx0XHRcdFx0Ly8gd2hlbiB3ZSBhcmUgZGVhbGluZyB3aXRoIHN0cmljdC1lcXVhbGl0eSB3ZSBkb24ndCBhcyB0aGUgY2hpbGQgY291bGQgc3RpbGxcblx0XHRcdFx0XHRcdC8vIGJlIGRpcnRpZWQgc2VlICMzODgzXG5cdFx0XHRcdFx0XHRjLnByb3BzID0gbmV3UHJvcHM7XG5cdFx0XHRcdFx0XHRjLnN0YXRlID0gYy5fbmV4dFN0YXRlO1xuXHRcdFx0XHRcdFx0Yy5fZGlydHkgPSBmYWxzZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRuZXdWTm9kZS5fZG9tID0gb2xkVk5vZGUuX2RvbTtcblx0XHRcdFx0XHRuZXdWTm9kZS5fY2hpbGRyZW4gPSBvbGRWTm9kZS5fY2hpbGRyZW47XG5cdFx0XHRcdFx0bmV3Vk5vZGUuX2NoaWxkcmVuLmZvckVhY2godm5vZGUgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKHZub2RlKSB2bm9kZS5fcGFyZW50ID0gbmV3Vk5vZGU7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGMuX3N0YXRlQ2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRjLl9yZW5kZXJDYWxsYmFja3MucHVzaChjLl9zdGF0ZUNhbGxiYWNrc1tpXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGMuX3N0YXRlQ2FsbGJhY2tzID0gW107XG5cblx0XHRcdFx0XHRpZiAoYy5fcmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0Y29tbWl0UXVldWUucHVzaChjKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRicmVhayBvdXRlcjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChjLmNvbXBvbmVudFdpbGxVcGRhdGUgIT0gbnVsbCkge1xuXHRcdFx0XHRcdGMuY29tcG9uZW50V2lsbFVwZGF0ZShuZXdQcm9wcywgYy5fbmV4dFN0YXRlLCBjb21wb25lbnRDb250ZXh0KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChjLmNvbXBvbmVudERpZFVwZGF0ZSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0Yy5fcmVuZGVyQ2FsbGJhY2tzLnB1c2goKCkgPT4ge1xuXHRcdFx0XHRcdFx0Yy5jb21wb25lbnREaWRVcGRhdGUob2xkUHJvcHMsIG9sZFN0YXRlLCBzbmFwc2hvdCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Yy5jb250ZXh0ID0gY29tcG9uZW50Q29udGV4dDtcblx0XHRcdGMucHJvcHMgPSBuZXdQcm9wcztcblx0XHRcdGMuX3BhcmVudERvbSA9IHBhcmVudERvbTtcblx0XHRcdGMuX2ZvcmNlID0gZmFsc2U7XG5cblx0XHRcdGxldCByZW5kZXJIb29rID0gb3B0aW9ucy5fcmVuZGVyLFxuXHRcdFx0XHRjb3VudCA9IDA7XG5cdFx0XHRpZiAoJ3Byb3RvdHlwZScgaW4gbmV3VHlwZSAmJiBuZXdUeXBlLnByb3RvdHlwZS5yZW5kZXIpIHtcblx0XHRcdFx0Yy5zdGF0ZSA9IGMuX25leHRTdGF0ZTtcblx0XHRcdFx0Yy5fZGlydHkgPSBmYWxzZTtcblxuXHRcdFx0XHRpZiAocmVuZGVySG9vaykgcmVuZGVySG9vayhuZXdWTm9kZSk7XG5cblx0XHRcdFx0dG1wID0gYy5yZW5kZXIoYy5wcm9wcywgYy5zdGF0ZSwgYy5jb250ZXh0KTtcblxuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGMuX3N0YXRlQ2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0Yy5fcmVuZGVyQ2FsbGJhY2tzLnB1c2goYy5fc3RhdGVDYWxsYmFja3NbaV0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGMuX3N0YXRlQ2FsbGJhY2tzID0gW107XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkbyB7XG5cdFx0XHRcdFx0Yy5fZGlydHkgPSBmYWxzZTtcblx0XHRcdFx0XHRpZiAocmVuZGVySG9vaykgcmVuZGVySG9vayhuZXdWTm9kZSk7XG5cblx0XHRcdFx0XHR0bXAgPSBjLnJlbmRlcihjLnByb3BzLCBjLnN0YXRlLCBjLmNvbnRleHQpO1xuXG5cdFx0XHRcdFx0Ly8gSGFuZGxlIHNldFN0YXRlIGNhbGxlZCBpbiByZW5kZXIsIHNlZSAjMjU1M1xuXHRcdFx0XHRcdGMuc3RhdGUgPSBjLl9uZXh0U3RhdGU7XG5cdFx0XHRcdH0gd2hpbGUgKGMuX2RpcnR5ICYmICsrY291bnQgPCAyNSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEhhbmRsZSBzZXRTdGF0ZSBjYWxsZWQgaW4gcmVuZGVyLCBzZWUgIzI1NTNcblx0XHRcdGMuc3RhdGUgPSBjLl9uZXh0U3RhdGU7XG5cblx0XHRcdGlmIChjLmdldENoaWxkQ29udGV4dCAhPSBudWxsKSB7XG5cdFx0XHRcdGdsb2JhbENvbnRleHQgPSBhc3NpZ24oYXNzaWduKHt9LCBnbG9iYWxDb250ZXh0KSwgYy5nZXRDaGlsZENvbnRleHQoKSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICghaXNOZXcgJiYgYy5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZSAhPSBudWxsKSB7XG5cdFx0XHRcdHNuYXBzaG90ID0gYy5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZShvbGRQcm9wcywgb2xkU3RhdGUpO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgaXNUb3BMZXZlbEZyYWdtZW50ID1cblx0XHRcdFx0dG1wICE9IG51bGwgJiYgdG1wLnR5cGUgPT09IEZyYWdtZW50ICYmIHRtcC5rZXkgPT0gbnVsbDtcblx0XHRcdGxldCByZW5kZXJSZXN1bHQgPSBpc1RvcExldmVsRnJhZ21lbnQgPyB0bXAucHJvcHMuY2hpbGRyZW4gOiB0bXA7XG5cblx0XHRcdGRpZmZDaGlsZHJlbihcblx0XHRcdFx0cGFyZW50RG9tLFxuXHRcdFx0XHRpc0FycmF5KHJlbmRlclJlc3VsdCkgPyByZW5kZXJSZXN1bHQgOiBbcmVuZGVyUmVzdWx0XSxcblx0XHRcdFx0bmV3Vk5vZGUsXG5cdFx0XHRcdG9sZFZOb2RlLFxuXHRcdFx0XHRnbG9iYWxDb250ZXh0LFxuXHRcdFx0XHRpc1N2Zyxcblx0XHRcdFx0ZXhjZXNzRG9tQ2hpbGRyZW4sXG5cdFx0XHRcdGNvbW1pdFF1ZXVlLFxuXHRcdFx0XHRvbGREb20sXG5cdFx0XHRcdGlzSHlkcmF0aW5nLFxuXHRcdFx0XHRyZWZRdWV1ZVxuXHRcdFx0KTtcblxuXHRcdFx0Yy5iYXNlID0gbmV3Vk5vZGUuX2RvbTtcblxuXHRcdFx0Ly8gV2Ugc3VjY2Vzc2Z1bGx5IHJlbmRlcmVkIHRoaXMgVk5vZGUsIHVuc2V0IGFueSBzdG9yZWQgaHlkcmF0aW9uL2JhaWxvdXQgc3RhdGU6XG5cdFx0XHRuZXdWTm9kZS5fZmxhZ3MgJj0gUkVTRVRfTU9ERTtcblxuXHRcdFx0aWYgKGMuX3JlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcblx0XHRcdFx0Y29tbWl0UXVldWUucHVzaChjKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGNsZWFyUHJvY2Vzc2luZ0V4Y2VwdGlvbikge1xuXHRcdFx0XHRjLl9wZW5kaW5nRXJyb3IgPSBjLl9wcm9jZXNzaW5nRXhjZXB0aW9uID0gbnVsbDtcblx0XHRcdH1cblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRuZXdWTm9kZS5fb3JpZ2luYWwgPSBudWxsO1xuXHRcdFx0Ly8gaWYgaHlkcmF0aW5nIG9yIGNyZWF0aW5nIGluaXRpYWwgdHJlZSwgYmFpbG91dCBwcmVzZXJ2ZXMgRE9NOlxuXHRcdFx0aWYgKGlzSHlkcmF0aW5nIHx8IGV4Y2Vzc0RvbUNoaWxkcmVuICE9IG51bGwpIHtcblx0XHRcdFx0bmV3Vk5vZGUuX2RvbSA9IG9sZERvbTtcblx0XHRcdFx0bmV3Vk5vZGUuX2ZsYWdzIHw9IGlzSHlkcmF0aW5nXG5cdFx0XHRcdFx0PyBNT0RFX0hZRFJBVEUgfCBNT0RFX1NVU1BFTkRFRFxuXHRcdFx0XHRcdDogTU9ERV9IWURSQVRFO1xuXHRcdFx0XHRleGNlc3NEb21DaGlsZHJlbltleGNlc3NEb21DaGlsZHJlbi5pbmRleE9mKG9sZERvbSldID0gbnVsbDtcblx0XHRcdFx0Ly8gXiBjb3VsZCBwb3NzaWJseSBiZSBzaW1wbGlmaWVkIHRvOlxuXHRcdFx0XHQvLyBleGNlc3NEb21DaGlsZHJlbi5sZW5ndGggPSAwO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bmV3Vk5vZGUuX2RvbSA9IG9sZFZOb2RlLl9kb207XG5cdFx0XHRcdG5ld1ZOb2RlLl9jaGlsZHJlbiA9IG9sZFZOb2RlLl9jaGlsZHJlbjtcblx0XHRcdH1cblx0XHRcdG9wdGlvbnMuX2NhdGNoRXJyb3IoZSwgbmV3Vk5vZGUsIG9sZFZOb2RlKTtcblx0XHR9XG5cdH0gZWxzZSBpZiAoXG5cdFx0ZXhjZXNzRG9tQ2hpbGRyZW4gPT0gbnVsbCAmJlxuXHRcdG5ld1ZOb2RlLl9vcmlnaW5hbCA9PT0gb2xkVk5vZGUuX29yaWdpbmFsXG5cdCkge1xuXHRcdG5ld1ZOb2RlLl9jaGlsZHJlbiA9IG9sZFZOb2RlLl9jaGlsZHJlbjtcblx0XHRuZXdWTm9kZS5fZG9tID0gb2xkVk5vZGUuX2RvbTtcblx0fSBlbHNlIHtcblx0XHRuZXdWTm9kZS5fZG9tID0gZGlmZkVsZW1lbnROb2Rlcyhcblx0XHRcdG9sZFZOb2RlLl9kb20sXG5cdFx0XHRuZXdWTm9kZSxcblx0XHRcdG9sZFZOb2RlLFxuXHRcdFx0Z2xvYmFsQ29udGV4dCxcblx0XHRcdGlzU3ZnLFxuXHRcdFx0ZXhjZXNzRG9tQ2hpbGRyZW4sXG5cdFx0XHRjb21taXRRdWV1ZSxcblx0XHRcdGlzSHlkcmF0aW5nLFxuXHRcdFx0cmVmUXVldWVcblx0XHQpO1xuXHR9XG5cblx0aWYgKCh0bXAgPSBvcHRpb25zLmRpZmZlZCkpIHRtcChuZXdWTm9kZSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtBcnJheTxDb21wb25lbnQ+fSBjb21taXRRdWV1ZSBMaXN0IG9mIGNvbXBvbmVudHNcbiAqIHdoaWNoIGhhdmUgY2FsbGJhY2tzIHRvIGludm9rZSBpbiBjb21taXRSb290XG4gKiBAcGFyYW0ge1ZOb2RlfSByb290XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21taXRSb290KGNvbW1pdFF1ZXVlLCByb290LCByZWZRdWV1ZSkge1xuXHRyb290Ll9uZXh0RG9tID0gdW5kZWZpbmVkO1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgcmVmUXVldWUubGVuZ3RoOyBpKyspIHtcblx0XHRhcHBseVJlZihyZWZRdWV1ZVtpXSwgcmVmUXVldWVbKytpXSwgcmVmUXVldWVbKytpXSk7XG5cdH1cblxuXHRpZiAob3B0aW9ucy5fY29tbWl0KSBvcHRpb25zLl9jb21taXQocm9vdCwgY29tbWl0UXVldWUpO1xuXG5cdGNvbW1pdFF1ZXVlLnNvbWUoYyA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdC8vIEB0cy1leHBlY3QtZXJyb3IgUmV1c2UgdGhlIGNvbW1pdFF1ZXVlIHZhcmlhYmxlIGhlcmUgc28gdGhlIHR5cGUgY2hhbmdlc1xuXHRcdFx0Y29tbWl0UXVldWUgPSBjLl9yZW5kZXJDYWxsYmFja3M7XG5cdFx0XHRjLl9yZW5kZXJDYWxsYmFja3MgPSBbXTtcblx0XHRcdGNvbW1pdFF1ZXVlLnNvbWUoY2IgPT4ge1xuXHRcdFx0XHQvLyBAdHMtZXhwZWN0LWVycm9yIFNlZSBhYm92ZSBjb21tZW50IG9uIGNvbW1pdFF1ZXVlXG5cdFx0XHRcdGNiLmNhbGwoYyk7XG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRvcHRpb25zLl9jYXRjaEVycm9yKGUsIGMuX3Zub2RlKTtcblx0XHR9XG5cdH0pO1xufVxuXG4vKipcbiAqIERpZmYgdHdvIHZpcnR1YWwgbm9kZXMgcmVwcmVzZW50aW5nIERPTSBlbGVtZW50XG4gKiBAcGFyYW0ge1ByZWFjdEVsZW1lbnR9IGRvbSBUaGUgRE9NIGVsZW1lbnQgcmVwcmVzZW50aW5nIHRoZSB2aXJ0dWFsIG5vZGVzXG4gKiBiZWluZyBkaWZmZWRcbiAqIEBwYXJhbSB7Vk5vZGV9IG5ld1ZOb2RlIFRoZSBuZXcgdmlydHVhbCBub2RlXG4gKiBAcGFyYW0ge1ZOb2RlfSBvbGRWTm9kZSBUaGUgb2xkIHZpcnR1YWwgbm9kZVxuICogQHBhcmFtIHtvYmplY3R9IGdsb2JhbENvbnRleHQgVGhlIGN1cnJlbnQgY29udGV4dCBvYmplY3RcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNTdmcgV2hldGhlciBvciBub3QgdGhpcyBET00gbm9kZSBpcyBhbiBTVkcgbm9kZVxuICogQHBhcmFtIHtBcnJheTxQcmVhY3RFbGVtZW50Pn0gZXhjZXNzRG9tQ2hpbGRyZW5cbiAqIEBwYXJhbSB7QXJyYXk8Q29tcG9uZW50Pn0gY29tbWl0UXVldWUgTGlzdCBvZiBjb21wb25lbnRzIHdoaWNoIGhhdmUgY2FsbGJhY2tzXG4gKiB0byBpbnZva2UgaW4gY29tbWl0Um9vdFxuICogQHBhcmFtIHtib29sZWFufSBpc0h5ZHJhdGluZyBXaGV0aGVyIG9yIG5vdCB3ZSBhcmUgaW4gaHlkcmF0aW9uXG4gKiBAcGFyYW0ge2FueVtdfSByZWZRdWV1ZSBhbiBhcnJheSBvZiBlbGVtZW50cyBuZWVkZWQgdG8gaW52b2tlIHJlZnNcbiAqIEByZXR1cm5zIHtQcmVhY3RFbGVtZW50fVxuICovXG5mdW5jdGlvbiBkaWZmRWxlbWVudE5vZGVzKFxuXHRkb20sXG5cdG5ld1ZOb2RlLFxuXHRvbGRWTm9kZSxcblx0Z2xvYmFsQ29udGV4dCxcblx0aXNTdmcsXG5cdGV4Y2Vzc0RvbUNoaWxkcmVuLFxuXHRjb21taXRRdWV1ZSxcblx0aXNIeWRyYXRpbmcsXG5cdHJlZlF1ZXVlXG4pIHtcblx0bGV0IG9sZFByb3BzID0gb2xkVk5vZGUucHJvcHM7XG5cdGxldCBuZXdQcm9wcyA9IG5ld1ZOb2RlLnByb3BzO1xuXHRsZXQgbm9kZVR5cGUgPSAvKiogQHR5cGUge3N0cmluZ30gKi8gKG5ld1ZOb2RlLnR5cGUpO1xuXHQvKiogQHR5cGUge2FueX0gKi9cblx0bGV0IGk7XG5cdC8qKiBAdHlwZSB7eyBfX2h0bWw/OiBzdHJpbmcgfX0gKi9cblx0bGV0IG5ld0h0bWw7XG5cdC8qKiBAdHlwZSB7eyBfX2h0bWw/OiBzdHJpbmcgfX0gKi9cblx0bGV0IG9sZEh0bWw7XG5cdC8qKiBAdHlwZSB7Q29tcG9uZW50Q2hpbGRyZW59ICovXG5cdGxldCBuZXdDaGlsZHJlbjtcblx0bGV0IHZhbHVlO1xuXHRsZXQgaW5wdXRWYWx1ZTtcblx0bGV0IGNoZWNrZWQ7XG5cblx0Ly8gVHJhY2tzIGVudGVyaW5nIGFuZCBleGl0aW5nIFNWRyBuYW1lc3BhY2Ugd2hlbiBkZXNjZW5kaW5nIHRocm91Z2ggdGhlIHRyZWUuXG5cdGlmIChub2RlVHlwZSA9PT0gJ3N2ZycpIGlzU3ZnID0gdHJ1ZTtcblxuXHRpZiAoZXhjZXNzRG9tQ2hpbGRyZW4gIT0gbnVsbCkge1xuXHRcdGZvciAoaSA9IDA7IGkgPCBleGNlc3NEb21DaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFsdWUgPSBleGNlc3NEb21DaGlsZHJlbltpXTtcblxuXHRcdFx0Ly8gaWYgbmV3Vk5vZGUgbWF0Y2hlcyBhbiBlbGVtZW50IGluIGV4Y2Vzc0RvbUNoaWxkcmVuIG9yIHRoZSBgZG9tYFxuXHRcdFx0Ly8gYXJndW1lbnQgbWF0Y2hlcyBhbiBlbGVtZW50IGluIGV4Y2Vzc0RvbUNoaWxkcmVuLCByZW1vdmUgaXQgZnJvbVxuXHRcdFx0Ly8gZXhjZXNzRG9tQ2hpbGRyZW4gc28gaXQgaXNuJ3QgbGF0ZXIgcmVtb3ZlZCBpbiBkaWZmQ2hpbGRyZW5cblx0XHRcdGlmIChcblx0XHRcdFx0dmFsdWUgJiZcblx0XHRcdFx0J3NldEF0dHJpYnV0ZScgaW4gdmFsdWUgPT09ICEhbm9kZVR5cGUgJiZcblx0XHRcdFx0KG5vZGVUeXBlID8gdmFsdWUubG9jYWxOYW1lID09PSBub2RlVHlwZSA6IHZhbHVlLm5vZGVUeXBlID09PSAzKVxuXHRcdFx0KSB7XG5cdFx0XHRcdGRvbSA9IHZhbHVlO1xuXHRcdFx0XHRleGNlc3NEb21DaGlsZHJlbltpXSA9IG51bGw7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGlmIChkb20gPT0gbnVsbCkge1xuXHRcdGlmIChub2RlVHlwZSA9PT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG5ld1Byb3BzKTtcblx0XHR9XG5cblx0XHRpZiAoaXNTdmcpIHtcblx0XHRcdGRvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCBub2RlVHlwZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGRvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobm9kZVR5cGUsIG5ld1Byb3BzLmlzICYmIG5ld1Byb3BzKTtcblx0XHR9XG5cblx0XHQvLyB3ZSBjcmVhdGVkIGEgbmV3IHBhcmVudCwgc28gbm9uZSBvZiB0aGUgcHJldmlvdXNseSBhdHRhY2hlZCBjaGlsZHJlbiBjYW4gYmUgcmV1c2VkOlxuXHRcdGV4Y2Vzc0RvbUNoaWxkcmVuID0gbnVsbDtcblx0XHQvLyB3ZSBhcmUgY3JlYXRpbmcgYSBuZXcgbm9kZSwgc28gd2UgY2FuIGFzc3VtZSB0aGlzIGlzIGEgbmV3IHN1YnRyZWUgKGluXG5cdFx0Ly8gY2FzZSB3ZSBhcmUgaHlkcmF0aW5nKSwgdGhpcyBkZW9wdHMgdGhlIGh5ZHJhdGVcblx0XHRpc0h5ZHJhdGluZyA9IGZhbHNlO1xuXHR9XG5cblx0aWYgKG5vZGVUeXBlID09PSBudWxsKSB7XG5cdFx0Ly8gRHVyaW5nIGh5ZHJhdGlvbiwgd2Ugc3RpbGwgaGF2ZSB0byBzcGxpdCBtZXJnZWQgdGV4dCBmcm9tIFNTUidkIEhUTUwuXG5cdFx0aWYgKG9sZFByb3BzICE9PSBuZXdQcm9wcyAmJiAoIWlzSHlkcmF0aW5nIHx8IGRvbS5kYXRhICE9PSBuZXdQcm9wcykpIHtcblx0XHRcdGRvbS5kYXRhID0gbmV3UHJvcHM7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdC8vIElmIGV4Y2Vzc0RvbUNoaWxkcmVuIHdhcyBub3QgbnVsbCwgcmVwb3B1bGF0ZSBpdCB3aXRoIHRoZSBjdXJyZW50IGVsZW1lbnQncyBjaGlsZHJlbjpcblx0XHRleGNlc3NEb21DaGlsZHJlbiA9IGV4Y2Vzc0RvbUNoaWxkcmVuICYmIHNsaWNlLmNhbGwoZG9tLmNoaWxkTm9kZXMpO1xuXG5cdFx0b2xkUHJvcHMgPSBvbGRWTm9kZS5wcm9wcyB8fCBFTVBUWV9PQko7XG5cblx0XHQvLyBJZiB3ZSBhcmUgaW4gYSBzaXR1YXRpb24gd2hlcmUgd2UgYXJlIG5vdCBoeWRyYXRpbmcgYnV0IGFyZSB1c2luZ1xuXHRcdC8vIGV4aXN0aW5nIERPTSAoZS5nLiByZXBsYWNlTm9kZSkgd2Ugc2hvdWxkIHJlYWQgdGhlIGV4aXN0aW5nIERPTVxuXHRcdC8vIGF0dHJpYnV0ZXMgdG8gZGlmZiB0aGVtXG5cdFx0aWYgKCFpc0h5ZHJhdGluZyAmJiBleGNlc3NEb21DaGlsZHJlbiAhPSBudWxsKSB7XG5cdFx0XHRvbGRQcm9wcyA9IHt9O1xuXHRcdFx0Zm9yIChpID0gMDsgaSA8IGRvbS5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHZhbHVlID0gZG9tLmF0dHJpYnV0ZXNbaV07XG5cdFx0XHRcdG9sZFByb3BzW3ZhbHVlLm5hbWVdID0gdmFsdWUudmFsdWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Zm9yIChpIGluIG9sZFByb3BzKSB7XG5cdFx0XHR2YWx1ZSA9IG9sZFByb3BzW2ldO1xuXHRcdFx0aWYgKGkgPT0gJ2NoaWxkcmVuJykge1xuXHRcdFx0fSBlbHNlIGlmIChpID09ICdkYW5nZXJvdXNseVNldElubmVySFRNTCcpIHtcblx0XHRcdFx0b2xkSHRtbCA9IHZhbHVlO1xuXHRcdFx0fSBlbHNlIGlmIChpICE9PSAna2V5JyAmJiAhKGkgaW4gbmV3UHJvcHMpKSB7XG5cdFx0XHRcdHNldFByb3BlcnR5KGRvbSwgaSwgbnVsbCwgdmFsdWUsIGlzU3ZnKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBEdXJpbmcgaHlkcmF0aW9uLCBwcm9wcyBhcmUgbm90IGRpZmZlZCBhdCBhbGwgKGluY2x1ZGluZyBkYW5nZXJvdXNseVNldElubmVySFRNTClcblx0XHQvLyBAVE9ETyB3ZSBzaG91bGQgd2FybiBpbiBkZWJ1ZyBtb2RlIHdoZW4gcHJvcHMgZG9uJ3QgbWF0Y2ggaGVyZS5cblx0XHRmb3IgKGkgaW4gbmV3UHJvcHMpIHtcblx0XHRcdHZhbHVlID0gbmV3UHJvcHNbaV07XG5cdFx0XHRpZiAoaSA9PSAnY2hpbGRyZW4nKSB7XG5cdFx0XHRcdG5ld0NoaWxkcmVuID0gdmFsdWU7XG5cdFx0XHR9IGVsc2UgaWYgKGkgPT0gJ2Rhbmdlcm91c2x5U2V0SW5uZXJIVE1MJykge1xuXHRcdFx0XHRuZXdIdG1sID0gdmFsdWU7XG5cdFx0XHR9IGVsc2UgaWYgKGkgPT0gJ3ZhbHVlJykge1xuXHRcdFx0XHRpbnB1dFZhbHVlID0gdmFsdWU7XG5cdFx0XHR9IGVsc2UgaWYgKGkgPT0gJ2NoZWNrZWQnKSB7XG5cdFx0XHRcdGNoZWNrZWQgPSB2YWx1ZTtcblx0XHRcdH0gZWxzZSBpZiAoXG5cdFx0XHRcdGkgIT09ICdrZXknICYmXG5cdFx0XHRcdCghaXNIeWRyYXRpbmcgfHwgdHlwZW9mIHZhbHVlID09ICdmdW5jdGlvbicpICYmXG5cdFx0XHRcdG9sZFByb3BzW2ldICE9PSB2YWx1ZVxuXHRcdFx0KSB7XG5cdFx0XHRcdHNldFByb3BlcnR5KGRvbSwgaSwgdmFsdWUsIG9sZFByb3BzW2ldLCBpc1N2Zyk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gSWYgdGhlIG5ldyB2bm9kZSBkaWRuJ3QgaGF2ZSBkYW5nZXJvdXNseVNldElubmVySFRNTCwgZGlmZiBpdHMgY2hpbGRyZW5cblx0XHRpZiAobmV3SHRtbCkge1xuXHRcdFx0Ly8gQXZvaWQgcmUtYXBwbHlpbmcgdGhlIHNhbWUgJ19faHRtbCcgaWYgaXQgZGlkIG5vdCBjaGFuZ2VkIGJldHdlZW4gcmUtcmVuZGVyXG5cdFx0XHRpZiAoXG5cdFx0XHRcdCFpc0h5ZHJhdGluZyAmJlxuXHRcdFx0XHQoIW9sZEh0bWwgfHxcblx0XHRcdFx0XHQobmV3SHRtbC5fX2h0bWwgIT09IG9sZEh0bWwuX19odG1sICYmXG5cdFx0XHRcdFx0XHRuZXdIdG1sLl9faHRtbCAhPT0gZG9tLmlubmVySFRNTCkpXG5cdFx0XHQpIHtcblx0XHRcdFx0ZG9tLmlubmVySFRNTCA9IG5ld0h0bWwuX19odG1sO1xuXHRcdFx0fVxuXG5cdFx0XHRuZXdWTm9kZS5fY2hpbGRyZW4gPSBbXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKG9sZEh0bWwpIGRvbS5pbm5lckhUTUwgPSAnJztcblxuXHRcdFx0ZGlmZkNoaWxkcmVuKFxuXHRcdFx0XHRkb20sXG5cdFx0XHRcdGlzQXJyYXkobmV3Q2hpbGRyZW4pID8gbmV3Q2hpbGRyZW4gOiBbbmV3Q2hpbGRyZW5dLFxuXHRcdFx0XHRuZXdWTm9kZSxcblx0XHRcdFx0b2xkVk5vZGUsXG5cdFx0XHRcdGdsb2JhbENvbnRleHQsXG5cdFx0XHRcdGlzU3ZnICYmIG5vZGVUeXBlICE9PSAnZm9yZWlnbk9iamVjdCcsXG5cdFx0XHRcdGV4Y2Vzc0RvbUNoaWxkcmVuLFxuXHRcdFx0XHRjb21taXRRdWV1ZSxcblx0XHRcdFx0ZXhjZXNzRG9tQ2hpbGRyZW5cblx0XHRcdFx0XHQ/IGV4Y2Vzc0RvbUNoaWxkcmVuWzBdXG5cdFx0XHRcdFx0OiBvbGRWTm9kZS5fY2hpbGRyZW4gJiYgZ2V0RG9tU2libGluZyhvbGRWTm9kZSwgMCksXG5cdFx0XHRcdGlzSHlkcmF0aW5nLFxuXHRcdFx0XHRyZWZRdWV1ZVxuXHRcdFx0KTtcblxuXHRcdFx0Ly8gUmVtb3ZlIGNoaWxkcmVuIHRoYXQgYXJlIG5vdCBwYXJ0IG9mIGFueSB2bm9kZS5cblx0XHRcdGlmIChleGNlc3NEb21DaGlsZHJlbiAhPSBudWxsKSB7XG5cdFx0XHRcdGZvciAoaSA9IGV4Y2Vzc0RvbUNoaWxkcmVuLmxlbmd0aDsgaS0tOyApIHtcblx0XHRcdFx0XHRpZiAoZXhjZXNzRG9tQ2hpbGRyZW5baV0gIT0gbnVsbCkgcmVtb3ZlTm9kZShleGNlc3NEb21DaGlsZHJlbltpXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBBcyBhYm92ZSwgZG9uJ3QgZGlmZiBwcm9wcyBkdXJpbmcgaHlkcmF0aW9uXG5cdFx0aWYgKCFpc0h5ZHJhdGluZykge1xuXHRcdFx0aSA9ICd2YWx1ZSc7XG5cdFx0XHRpZiAoXG5cdFx0XHRcdGlucHV0VmFsdWUgIT09IHVuZGVmaW5lZCAmJlxuXHRcdFx0XHQvLyAjMjc1NiBGb3IgdGhlIDxwcm9ncmVzcz4tZWxlbWVudCB0aGUgaW5pdGlhbCB2YWx1ZSBpcyAwLFxuXHRcdFx0XHQvLyBkZXNwaXRlIHRoZSBhdHRyaWJ1dGUgbm90IGJlaW5nIHByZXNlbnQuIFdoZW4gdGhlIGF0dHJpYnV0ZVxuXHRcdFx0XHQvLyBpcyBtaXNzaW5nIHRoZSBwcm9ncmVzcyBiYXIgaXMgdHJlYXRlZCBhcyBpbmRldGVybWluYXRlLlxuXHRcdFx0XHQvLyBUbyBmaXggdGhhdCB3ZSdsbCBhbHdheXMgdXBkYXRlIGl0IHdoZW4gaXQgaXMgMCBmb3IgcHJvZ3Jlc3MgZWxlbWVudHNcblx0XHRcdFx0KGlucHV0VmFsdWUgIT09IGRvbVtpXSB8fFxuXHRcdFx0XHRcdChub2RlVHlwZSA9PT0gJ3Byb2dyZXNzJyAmJiAhaW5wdXRWYWx1ZSkgfHxcblx0XHRcdFx0XHQvLyBUaGlzIGlzIG9ubHkgZm9yIElFIDExIHRvIGZpeCA8c2VsZWN0PiB2YWx1ZSBub3QgYmVpbmcgdXBkYXRlZC5cblx0XHRcdFx0XHQvLyBUbyBhdm9pZCBhIHN0YWxlIHNlbGVjdCB2YWx1ZSB3ZSBuZWVkIHRvIHNldCB0aGUgb3B0aW9uLnZhbHVlXG5cdFx0XHRcdFx0Ly8gYWdhaW4sIHdoaWNoIHRyaWdnZXJzIElFMTEgdG8gcmUtZXZhbHVhdGUgdGhlIHNlbGVjdCB2YWx1ZVxuXHRcdFx0XHRcdChub2RlVHlwZSA9PT0gJ29wdGlvbicgJiYgaW5wdXRWYWx1ZSAhPT0gb2xkUHJvcHNbaV0pKVxuXHRcdFx0KSB7XG5cdFx0XHRcdHNldFByb3BlcnR5KGRvbSwgaSwgaW5wdXRWYWx1ZSwgb2xkUHJvcHNbaV0sIGZhbHNlKTtcblx0XHRcdH1cblxuXHRcdFx0aSA9ICdjaGVja2VkJztcblx0XHRcdGlmIChjaGVja2VkICE9PSB1bmRlZmluZWQgJiYgY2hlY2tlZCAhPT0gZG9tW2ldKSB7XG5cdFx0XHRcdHNldFByb3BlcnR5KGRvbSwgaSwgY2hlY2tlZCwgb2xkUHJvcHNbaV0sIGZhbHNlKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gZG9tO1xufVxuXG4vKipcbiAqIEludm9rZSBvciB1cGRhdGUgYSByZWYsIGRlcGVuZGluZyBvbiB3aGV0aGVyIGl0IGlzIGEgZnVuY3Rpb24gb3Igb2JqZWN0IHJlZi5cbiAqIEBwYXJhbSB7UmVmPGFueT59IHJlZlxuICogQHBhcmFtIHthbnl9IHZhbHVlXG4gKiBAcGFyYW0ge1ZOb2RlfSB2bm9kZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlSZWYocmVmLCB2YWx1ZSwgdm5vZGUpIHtcblx0dHJ5IHtcblx0XHRpZiAodHlwZW9mIHJlZiA9PSAnZnVuY3Rpb24nKSByZWYodmFsdWUpO1xuXHRcdGVsc2UgcmVmLmN1cnJlbnQgPSB2YWx1ZTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdG9wdGlvbnMuX2NhdGNoRXJyb3IoZSwgdm5vZGUpO1xuXHR9XG59XG5cbi8qKlxuICogVW5tb3VudCBhIHZpcnR1YWwgbm9kZSBmcm9tIHRoZSB0cmVlIGFuZCBhcHBseSBET00gY2hhbmdlc1xuICogQHBhcmFtIHtWTm9kZX0gdm5vZGUgVGhlIHZpcnR1YWwgbm9kZSB0byB1bm1vdW50XG4gKiBAcGFyYW0ge1ZOb2RlfSBwYXJlbnRWTm9kZSBUaGUgcGFyZW50IG9mIHRoZSBWTm9kZSB0aGF0IGluaXRpYXRlZCB0aGUgdW5tb3VudFxuICogQHBhcmFtIHtib29sZWFufSBbc2tpcFJlbW92ZV0gRmxhZyB0aGF0IGluZGljYXRlcyB0aGF0IGEgcGFyZW50IG5vZGUgb2YgdGhlXG4gKiBjdXJyZW50IGVsZW1lbnQgaXMgYWxyZWFkeSBkZXRhY2hlZCBmcm9tIHRoZSBET00uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bm1vdW50KHZub2RlLCBwYXJlbnRWTm9kZSwgc2tpcFJlbW92ZSkge1xuXHRsZXQgcjtcblx0aWYgKG9wdGlvbnMudW5tb3VudCkgb3B0aW9ucy51bm1vdW50KHZub2RlKTtcblxuXHRpZiAoKHIgPSB2bm9kZS5yZWYpKSB7XG5cdFx0aWYgKCFyLmN1cnJlbnQgfHwgci5jdXJyZW50ID09PSB2bm9kZS5fZG9tKSB7XG5cdFx0XHRhcHBseVJlZihyLCBudWxsLCBwYXJlbnRWTm9kZSk7XG5cdFx0fVxuXHR9XG5cblx0aWYgKChyID0gdm5vZGUuX2NvbXBvbmVudCkgIT0gbnVsbCkge1xuXHRcdGlmIChyLmNvbXBvbmVudFdpbGxVbm1vdW50KSB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRyLmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XG5cdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdG9wdGlvbnMuX2NhdGNoRXJyb3IoZSwgcGFyZW50Vk5vZGUpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHIuYmFzZSA9IHIuX3BhcmVudERvbSA9IG51bGw7XG5cdFx0dm5vZGUuX2NvbXBvbmVudCA9IHVuZGVmaW5lZDtcblx0fVxuXG5cdGlmICgociA9IHZub2RlLl9jaGlsZHJlbikpIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHIubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmIChyW2ldKSB7XG5cdFx0XHRcdHVubW91bnQoXG5cdFx0XHRcdFx0cltpXSxcblx0XHRcdFx0XHRwYXJlbnRWTm9kZSxcblx0XHRcdFx0XHRza2lwUmVtb3ZlIHx8IHR5cGVvZiB2bm9kZS50eXBlICE9PSAnZnVuY3Rpb24nXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aWYgKCFza2lwUmVtb3ZlICYmIHZub2RlLl9kb20gIT0gbnVsbCkge1xuXHRcdHJlbW92ZU5vZGUodm5vZGUuX2RvbSk7XG5cdH1cblxuXHQvLyBNdXN0IGJlIHNldCB0byBgdW5kZWZpbmVkYCB0byBwcm9wZXJseSBjbGVhbiB1cCBgX25leHREb21gXG5cdC8vIGZvciB3aGljaCBgbnVsbGAgaXMgYSB2YWxpZCB2YWx1ZS4gU2VlIGNvbW1lbnQgaW4gYGNyZWF0ZS1lbGVtZW50LmpzYFxuXHR2bm9kZS5fcGFyZW50ID0gdm5vZGUuX2RvbSA9IHZub2RlLl9uZXh0RG9tID0gdW5kZWZpbmVkO1xufVxuXG4vKiogVGhlIGAucmVuZGVyKClgIG1ldGhvZCBmb3IgYSBQRkMgYmFja2luZyBpbnN0YW5jZS4gKi9cbmZ1bmN0aW9uIGRvUmVuZGVyKHByb3BzLCBzdGF0ZSwgY29udGV4dCkge1xuXHRyZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCk7XG59XG4iLCAiaW1wb3J0IHsgRU1QVFlfT0JKIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgY29tbWl0Um9vdCwgZGlmZiB9IGZyb20gJy4vZGlmZi9pbmRleCc7XG5pbXBvcnQgeyBjcmVhdGVFbGVtZW50LCBGcmFnbWVudCB9IGZyb20gJy4vY3JlYXRlLWVsZW1lbnQnO1xuaW1wb3J0IG9wdGlvbnMgZnJvbSAnLi9vcHRpb25zJztcbmltcG9ydCB7IHNsaWNlIH0gZnJvbSAnLi91dGlsJztcblxuLyoqXG4gKiBSZW5kZXIgYSBQcmVhY3QgdmlydHVhbCBub2RlIGludG8gYSBET00gZWxlbWVudFxuICogQHBhcmFtIHtDb21wb25lbnRDaGlsZH0gdm5vZGUgVGhlIHZpcnR1YWwgbm9kZSB0byByZW5kZXJcbiAqIEBwYXJhbSB7UHJlYWN0RWxlbWVudH0gcGFyZW50RG9tIFRoZSBET00gZWxlbWVudCB0byByZW5kZXIgaW50b1xuICogQHBhcmFtIHtQcmVhY3RFbGVtZW50IHwgb2JqZWN0fSBbcmVwbGFjZU5vZGVdIE9wdGlvbmFsOiBBdHRlbXB0IHRvIHJlLXVzZSBhblxuICogZXhpc3RpbmcgRE9NIHRyZWUgcm9vdGVkIGF0IGByZXBsYWNlTm9kZWBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlcih2bm9kZSwgcGFyZW50RG9tLCByZXBsYWNlTm9kZSkge1xuXHRpZiAob3B0aW9ucy5fcm9vdCkgb3B0aW9ucy5fcm9vdCh2bm9kZSwgcGFyZW50RG9tKTtcblxuXHQvLyBXZSBhYnVzZSB0aGUgYHJlcGxhY2VOb2RlYCBwYXJhbWV0ZXIgaW4gYGh5ZHJhdGUoKWAgdG8gc2lnbmFsIGlmIHdlIGFyZSBpblxuXHQvLyBoeWRyYXRpb24gbW9kZSBvciBub3QgYnkgcGFzc2luZyB0aGUgYGh5ZHJhdGVgIGZ1bmN0aW9uIGluc3RlYWQgb2YgYSBET01cblx0Ly8gZWxlbWVudC4uXG5cdGxldCBpc0h5ZHJhdGluZyA9IHR5cGVvZiByZXBsYWNlTm9kZSA9PSAnZnVuY3Rpb24nO1xuXG5cdC8vIFRvIGJlIGFibGUgdG8gc3VwcG9ydCBjYWxsaW5nIGByZW5kZXIoKWAgbXVsdGlwbGUgdGltZXMgb24gdGhlIHNhbWVcblx0Ly8gRE9NIG5vZGUsIHdlIG5lZWQgdG8gb2J0YWluIGEgcmVmZXJlbmNlIHRvIHRoZSBwcmV2aW91cyB0cmVlLiBXZSBkb1xuXHQvLyB0aGlzIGJ5IGFzc2lnbmluZyBhIG5ldyBgX2NoaWxkcmVuYCBwcm9wZXJ0eSB0byBET00gbm9kZXMgd2hpY2ggcG9pbnRzXG5cdC8vIHRvIHRoZSBsYXN0IHJlbmRlcmVkIHRyZWUuIEJ5IGRlZmF1bHQgdGhpcyBwcm9wZXJ0eSBpcyBub3QgcHJlc2VudCwgd2hpY2hcblx0Ly8gbWVhbnMgdGhhdCB3ZSBhcmUgbW91bnRpbmcgYSBuZXcgdHJlZSBmb3IgdGhlIGZpcnN0IHRpbWUuXG5cdGxldCBvbGRWTm9kZSA9IGlzSHlkcmF0aW5nXG5cdFx0PyBudWxsXG5cdFx0OiAocmVwbGFjZU5vZGUgJiYgcmVwbGFjZU5vZGUuX2NoaWxkcmVuKSB8fCBwYXJlbnREb20uX2NoaWxkcmVuO1xuXG5cdHZub2RlID0gKCghaXNIeWRyYXRpbmcgJiYgcmVwbGFjZU5vZGUpIHx8IHBhcmVudERvbSkuX2NoaWxkcmVuID1cblx0XHRjcmVhdGVFbGVtZW50KEZyYWdtZW50LCBudWxsLCBbdm5vZGVdKTtcblxuXHQvLyBMaXN0IG9mIGVmZmVjdHMgdGhhdCBuZWVkIHRvIGJlIGNhbGxlZCBhZnRlciBkaWZmaW5nLlxuXHRsZXQgY29tbWl0UXVldWUgPSBbXSxcblx0XHRyZWZRdWV1ZSA9IFtdO1xuXHRkaWZmKFxuXHRcdHBhcmVudERvbSxcblx0XHQvLyBEZXRlcm1pbmUgdGhlIG5ldyB2bm9kZSB0cmVlIGFuZCBzdG9yZSBpdCBvbiB0aGUgRE9NIGVsZW1lbnQgb25cblx0XHQvLyBvdXIgY3VzdG9tIGBfY2hpbGRyZW5gIHByb3BlcnR5LlxuXHRcdHZub2RlLFxuXHRcdG9sZFZOb2RlIHx8IEVNUFRZX09CSixcblx0XHRFTVBUWV9PQkosXG5cdFx0cGFyZW50RG9tLm93bmVyU1ZHRWxlbWVudCAhPT0gdW5kZWZpbmVkLFxuXHRcdCFpc0h5ZHJhdGluZyAmJiByZXBsYWNlTm9kZVxuXHRcdFx0PyBbcmVwbGFjZU5vZGVdXG5cdFx0XHQ6IG9sZFZOb2RlXG5cdFx0XHQ/IG51bGxcblx0XHRcdDogcGFyZW50RG9tLmZpcnN0Q2hpbGRcblx0XHRcdD8gc2xpY2UuY2FsbChwYXJlbnREb20uY2hpbGROb2Rlcylcblx0XHRcdDogbnVsbCxcblx0XHRjb21taXRRdWV1ZSxcblx0XHQhaXNIeWRyYXRpbmcgJiYgcmVwbGFjZU5vZGVcblx0XHRcdD8gcmVwbGFjZU5vZGVcblx0XHRcdDogb2xkVk5vZGVcblx0XHRcdD8gb2xkVk5vZGUuX2RvbVxuXHRcdFx0OiBwYXJlbnREb20uZmlyc3RDaGlsZCxcblx0XHRpc0h5ZHJhdGluZyxcblx0XHRyZWZRdWV1ZVxuXHQpO1xuXG5cdC8vIEZsdXNoIGFsbCBxdWV1ZWQgZWZmZWN0c1xuXHRjb21taXRSb290KGNvbW1pdFF1ZXVlLCB2bm9kZSwgcmVmUXVldWUpO1xufVxuXG4vKipcbiAqIFVwZGF0ZSBhbiBleGlzdGluZyBET00gZWxlbWVudCB3aXRoIGRhdGEgZnJvbSBhIFByZWFjdCB2aXJ0dWFsIG5vZGVcbiAqIEBwYXJhbSB7Q29tcG9uZW50Q2hpbGR9IHZub2RlIFRoZSB2aXJ0dWFsIG5vZGUgdG8gcmVuZGVyXG4gKiBAcGFyYW0ge1ByZWFjdEVsZW1lbnR9IHBhcmVudERvbSBUaGUgRE9NIGVsZW1lbnQgdG8gdXBkYXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoeWRyYXRlKHZub2RlLCBwYXJlbnREb20pIHtcblx0cmVuZGVyKHZub2RlLCBwYXJlbnREb20sIGh5ZHJhdGUpO1xufVxuIiwgImltcG9ydCB7IGFzc2lnbiwgc2xpY2UgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgY3JlYXRlVk5vZGUgfSBmcm9tICcuL2NyZWF0ZS1lbGVtZW50JztcblxuLyoqXG4gKiBDbG9uZXMgdGhlIGdpdmVuIFZOb2RlLCBvcHRpb25hbGx5IGFkZGluZyBhdHRyaWJ1dGVzL3Byb3BzIGFuZCByZXBsYWNpbmcgaXRzXG4gKiBjaGlsZHJlbi5cbiAqIEBwYXJhbSB7Vk5vZGV9IHZub2RlIFRoZSB2aXJ0dWFsIERPTSBlbGVtZW50IHRvIGNsb25lXG4gKiBAcGFyYW0ge29iamVjdH0gcHJvcHMgQXR0cmlidXRlcy9wcm9wcyB0byBhZGQgd2hlbiBjbG9uaW5nXG4gKiBAcGFyYW0ge0FycmF5PENvbXBvbmVudENoaWxkcmVuPn0gcmVzdCBBbnkgYWRkaXRpb25hbCBhcmd1bWVudHMgd2lsbCBiZSB1c2VkXG4gKiBhcyByZXBsYWNlbWVudCBjaGlsZHJlbi5cbiAqIEByZXR1cm5zIHtWTm9kZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsb25lRWxlbWVudCh2bm9kZSwgcHJvcHMsIGNoaWxkcmVuKSB7XG5cdGxldCBub3JtYWxpemVkUHJvcHMgPSBhc3NpZ24oe30sIHZub2RlLnByb3BzKSxcblx0XHRrZXksXG5cdFx0cmVmLFxuXHRcdGk7XG5cblx0bGV0IGRlZmF1bHRQcm9wcztcblxuXHRpZiAodm5vZGUudHlwZSAmJiB2bm9kZS50eXBlLmRlZmF1bHRQcm9wcykge1xuXHRcdGRlZmF1bHRQcm9wcyA9IHZub2RlLnR5cGUuZGVmYXVsdFByb3BzO1xuXHR9XG5cblx0Zm9yIChpIGluIHByb3BzKSB7XG5cdFx0aWYgKGkgPT0gJ2tleScpIGtleSA9IHByb3BzW2ldO1xuXHRcdGVsc2UgaWYgKGkgPT0gJ3JlZicpIHJlZiA9IHByb3BzW2ldO1xuXHRcdGVsc2UgaWYgKHByb3BzW2ldID09PSB1bmRlZmluZWQgJiYgZGVmYXVsdFByb3BzICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdG5vcm1hbGl6ZWRQcm9wc1tpXSA9IGRlZmF1bHRQcm9wc1tpXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bm9ybWFsaXplZFByb3BzW2ldID0gcHJvcHNbaV07XG5cdFx0fVxuXHR9XG5cblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyKSB7XG5cdFx0bm9ybWFsaXplZFByb3BzLmNoaWxkcmVuID1cblx0XHRcdGFyZ3VtZW50cy5sZW5ndGggPiAzID8gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpIDogY2hpbGRyZW47XG5cdH1cblxuXHRyZXR1cm4gY3JlYXRlVk5vZGUoXG5cdFx0dm5vZGUudHlwZSxcblx0XHRub3JtYWxpemVkUHJvcHMsXG5cdFx0a2V5IHx8IHZub2RlLmtleSxcblx0XHRyZWYgfHwgdm5vZGUucmVmLFxuXHRcdG51bGxcblx0KTtcbn1cbiIsICIvKipcbiAqIEZpbmQgdGhlIGNsb3Nlc3QgZXJyb3IgYm91bmRhcnkgdG8gYSB0aHJvd24gZXJyb3IgYW5kIGNhbGwgaXRcbiAqIEBwYXJhbSB7b2JqZWN0fSBlcnJvciBUaGUgdGhyb3duIHZhbHVlXG4gKiBAcGFyYW0ge1ZOb2RlfSB2bm9kZSBUaGUgdm5vZGUgdGhhdCB0aHJldyB0aGUgZXJyb3IgdGhhdCB3YXMgY2F1Z2h0IChleGNlcHRcbiAqIGZvciB1bm1vdW50aW5nIHdoZW4gdGhpcyBwYXJhbWV0ZXIgaXMgdGhlIGhpZ2hlc3QgcGFyZW50IHRoYXQgd2FzIGJlaW5nXG4gKiB1bm1vdW50ZWQpXG4gKiBAcGFyYW0ge1ZOb2RlfSBbb2xkVk5vZGVdXG4gKiBAcGFyYW0ge0Vycm9ySW5mb30gW2Vycm9ySW5mb11cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9jYXRjaEVycm9yKGVycm9yLCB2bm9kZSwgb2xkVk5vZGUsIGVycm9ySW5mbykge1xuXHQvKiogQHR5cGUge0NvbXBvbmVudH0gKi9cblx0bGV0IGNvbXBvbmVudCxcblx0XHQvKiogQHR5cGUge0NvbXBvbmVudFR5cGV9ICovXG5cdFx0Y3Rvcixcblx0XHQvKiogQHR5cGUge2Jvb2xlYW59ICovXG5cdFx0aGFuZGxlZDtcblxuXHRmb3IgKDsgKHZub2RlID0gdm5vZGUuX3BhcmVudCk7ICkge1xuXHRcdGlmICgoY29tcG9uZW50ID0gdm5vZGUuX2NvbXBvbmVudCkgJiYgIWNvbXBvbmVudC5fcHJvY2Vzc2luZ0V4Y2VwdGlvbikge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0Y3RvciA9IGNvbXBvbmVudC5jb25zdHJ1Y3RvcjtcblxuXHRcdFx0XHRpZiAoY3RvciAmJiBjdG9yLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvciAhPSBudWxsKSB7XG5cdFx0XHRcdFx0Y29tcG9uZW50LnNldFN0YXRlKGN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yKGVycm9yKSk7XG5cdFx0XHRcdFx0aGFuZGxlZCA9IGNvbXBvbmVudC5fZGlydHk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoY29tcG9uZW50LmNvbXBvbmVudERpZENhdGNoICE9IG51bGwpIHtcblx0XHRcdFx0XHRjb21wb25lbnQuY29tcG9uZW50RGlkQ2F0Y2goZXJyb3IsIGVycm9ySW5mbyB8fCB7fSk7XG5cdFx0XHRcdFx0aGFuZGxlZCA9IGNvbXBvbmVudC5fZGlydHk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBUaGlzIGlzIGFuIGVycm9yIGJvdW5kYXJ5LiBNYXJrIGl0IGFzIGhhdmluZyBiYWlsZWQgb3V0LCBhbmQgd2hldGhlciBpdCB3YXMgbWlkLWh5ZHJhdGlvbi5cblx0XHRcdFx0aWYgKGhhbmRsZWQpIHtcblx0XHRcdFx0XHRyZXR1cm4gKGNvbXBvbmVudC5fcGVuZGluZ0Vycm9yID0gY29tcG9uZW50KTtcblx0XHRcdFx0fVxuXHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRlcnJvciA9IGU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0dGhyb3cgZXJyb3I7XG59XG4iLCAiaW1wb3J0IHsgb3B0aW9ucyB9IGZyb20gJ3ByZWFjdCc7XG5cbi8qKiBAdHlwZSB7bnVtYmVyfSAqL1xubGV0IGN1cnJlbnRJbmRleDtcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4vaW50ZXJuYWwnKS5Db21wb25lbnR9ICovXG5sZXQgY3VycmVudENvbXBvbmVudDtcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4vaW50ZXJuYWwnKS5Db21wb25lbnR9ICovXG5sZXQgcHJldmlvdXNDb21wb25lbnQ7XG5cbi8qKiBAdHlwZSB7bnVtYmVyfSAqL1xubGV0IGN1cnJlbnRIb29rID0gMDtcblxuLyoqIEB0eXBlIHtBcnJheTxpbXBvcnQoJy4vaW50ZXJuYWwnKS5Db21wb25lbnQ+fSAqL1xubGV0IGFmdGVyUGFpbnRFZmZlY3RzID0gW107XG5cbmxldCBFTVBUWSA9IFtdO1xuXG5sZXQgb2xkQmVmb3JlRGlmZiA9IG9wdGlvbnMuX2RpZmY7XG5sZXQgb2xkQmVmb3JlUmVuZGVyID0gb3B0aW9ucy5fcmVuZGVyO1xubGV0IG9sZEFmdGVyRGlmZiA9IG9wdGlvbnMuZGlmZmVkO1xubGV0IG9sZENvbW1pdCA9IG9wdGlvbnMuX2NvbW1pdDtcbmxldCBvbGRCZWZvcmVVbm1vdW50ID0gb3B0aW9ucy51bm1vdW50O1xuXG5jb25zdCBSQUZfVElNRU9VVCA9IDEwMDtcbmxldCBwcmV2UmFmO1xuXG5vcHRpb25zLl9kaWZmID0gdm5vZGUgPT4ge1xuXHRjdXJyZW50Q29tcG9uZW50ID0gbnVsbDtcblx0aWYgKG9sZEJlZm9yZURpZmYpIG9sZEJlZm9yZURpZmYodm5vZGUpO1xufTtcblxub3B0aW9ucy5fcmVuZGVyID0gdm5vZGUgPT4ge1xuXHRpZiAob2xkQmVmb3JlUmVuZGVyKSBvbGRCZWZvcmVSZW5kZXIodm5vZGUpO1xuXG5cdGN1cnJlbnRDb21wb25lbnQgPSB2bm9kZS5fY29tcG9uZW50O1xuXHRjdXJyZW50SW5kZXggPSAwO1xuXG5cdGNvbnN0IGhvb2tzID0gY3VycmVudENvbXBvbmVudC5fX2hvb2tzO1xuXHRpZiAoaG9va3MpIHtcblx0XHRpZiAocHJldmlvdXNDb21wb25lbnQgPT09IGN1cnJlbnRDb21wb25lbnQpIHtcblx0XHRcdGhvb2tzLl9wZW5kaW5nRWZmZWN0cyA9IFtdO1xuXHRcdFx0Y3VycmVudENvbXBvbmVudC5fcmVuZGVyQ2FsbGJhY2tzID0gW107XG5cdFx0XHRob29rcy5fbGlzdC5mb3JFYWNoKGhvb2tJdGVtID0+IHtcblx0XHRcdFx0aWYgKGhvb2tJdGVtLl9uZXh0VmFsdWUpIHtcblx0XHRcdFx0XHRob29rSXRlbS5fdmFsdWUgPSBob29rSXRlbS5fbmV4dFZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGhvb2tJdGVtLl9wZW5kaW5nVmFsdWUgPSBFTVBUWTtcblx0XHRcdFx0aG9va0l0ZW0uX25leHRWYWx1ZSA9IGhvb2tJdGVtLl9wZW5kaW5nQXJncyA9IHVuZGVmaW5lZDtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRob29rcy5fcGVuZGluZ0VmZmVjdHMuZm9yRWFjaChpbnZva2VDbGVhbnVwKTtcblx0XHRcdGhvb2tzLl9wZW5kaW5nRWZmZWN0cy5mb3JFYWNoKGludm9rZUVmZmVjdCk7XG5cdFx0XHRob29rcy5fcGVuZGluZ0VmZmVjdHMgPSBbXTtcblx0XHRcdGN1cnJlbnRJbmRleCA9IDA7XG5cdFx0fVxuXHR9XG5cdHByZXZpb3VzQ29tcG9uZW50ID0gY3VycmVudENvbXBvbmVudDtcbn07XG5cbm9wdGlvbnMuZGlmZmVkID0gdm5vZGUgPT4ge1xuXHRpZiAob2xkQWZ0ZXJEaWZmKSBvbGRBZnRlckRpZmYodm5vZGUpO1xuXG5cdGNvbnN0IGMgPSB2bm9kZS5fY29tcG9uZW50O1xuXHRpZiAoYyAmJiBjLl9faG9va3MpIHtcblx0XHRpZiAoYy5fX2hvb2tzLl9wZW5kaW5nRWZmZWN0cy5sZW5ndGgpIGFmdGVyUGFpbnQoYWZ0ZXJQYWludEVmZmVjdHMucHVzaChjKSk7XG5cdFx0Yy5fX2hvb2tzLl9saXN0LmZvckVhY2goaG9va0l0ZW0gPT4ge1xuXHRcdFx0aWYgKGhvb2tJdGVtLl9wZW5kaW5nQXJncykge1xuXHRcdFx0XHRob29rSXRlbS5fYXJncyA9IGhvb2tJdGVtLl9wZW5kaW5nQXJncztcblx0XHRcdH1cblx0XHRcdGlmIChob29rSXRlbS5fcGVuZGluZ1ZhbHVlICE9PSBFTVBUWSkge1xuXHRcdFx0XHRob29rSXRlbS5fdmFsdWUgPSBob29rSXRlbS5fcGVuZGluZ1ZhbHVlO1xuXHRcdFx0fVxuXHRcdFx0aG9va0l0ZW0uX3BlbmRpbmdBcmdzID0gdW5kZWZpbmVkO1xuXHRcdFx0aG9va0l0ZW0uX3BlbmRpbmdWYWx1ZSA9IEVNUFRZO1xuXHRcdH0pO1xuXHR9XG5cdHByZXZpb3VzQ29tcG9uZW50ID0gY3VycmVudENvbXBvbmVudCA9IG51bGw7XG59O1xuXG5vcHRpb25zLl9jb21taXQgPSAodm5vZGUsIGNvbW1pdFF1ZXVlKSA9PiB7XG5cdGNvbW1pdFF1ZXVlLnNvbWUoY29tcG9uZW50ID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29tcG9uZW50Ll9yZW5kZXJDYWxsYmFja3MuZm9yRWFjaChpbnZva2VDbGVhbnVwKTtcblx0XHRcdGNvbXBvbmVudC5fcmVuZGVyQ2FsbGJhY2tzID0gY29tcG9uZW50Ll9yZW5kZXJDYWxsYmFja3MuZmlsdGVyKGNiID0+XG5cdFx0XHRcdGNiLl92YWx1ZSA/IGludm9rZUVmZmVjdChjYikgOiB0cnVlXG5cdFx0XHQpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdGNvbW1pdFF1ZXVlLnNvbWUoYyA9PiB7XG5cdFx0XHRcdGlmIChjLl9yZW5kZXJDYWxsYmFja3MpIGMuX3JlbmRlckNhbGxiYWNrcyA9IFtdO1xuXHRcdFx0fSk7XG5cdFx0XHRjb21taXRRdWV1ZSA9IFtdO1xuXHRcdFx0b3B0aW9ucy5fY2F0Y2hFcnJvcihlLCBjb21wb25lbnQuX3Zub2RlKTtcblx0XHR9XG5cdH0pO1xuXG5cdGlmIChvbGRDb21taXQpIG9sZENvbW1pdCh2bm9kZSwgY29tbWl0UXVldWUpO1xufTtcblxub3B0aW9ucy51bm1vdW50ID0gdm5vZGUgPT4ge1xuXHRpZiAob2xkQmVmb3JlVW5tb3VudCkgb2xkQmVmb3JlVW5tb3VudCh2bm9kZSk7XG5cblx0Y29uc3QgYyA9IHZub2RlLl9jb21wb25lbnQ7XG5cdGlmIChjICYmIGMuX19ob29rcykge1xuXHRcdGxldCBoYXNFcnJvcmVkO1xuXHRcdGMuX19ob29rcy5fbGlzdC5mb3JFYWNoKHMgPT4ge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0aW52b2tlQ2xlYW51cChzKTtcblx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0aGFzRXJyb3JlZCA9IGU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0Yy5fX2hvb2tzID0gdW5kZWZpbmVkO1xuXHRcdGlmIChoYXNFcnJvcmVkKSBvcHRpb25zLl9jYXRjaEVycm9yKGhhc0Vycm9yZWQsIGMuX3Zub2RlKTtcblx0fVxufTtcblxuLyoqXG4gKiBHZXQgYSBob29rJ3Mgc3RhdGUgZnJvbSB0aGUgY3VycmVudENvbXBvbmVudFxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IFRoZSBpbmRleCBvZiB0aGUgaG9vayB0byBnZXRcbiAqIEBwYXJhbSB7bnVtYmVyfSB0eXBlIFRoZSBpbmRleCBvZiB0aGUgaG9vayB0byBnZXRcbiAqIEByZXR1cm5zIHthbnl9XG4gKi9cbmZ1bmN0aW9uIGdldEhvb2tTdGF0ZShpbmRleCwgdHlwZSkge1xuXHRpZiAob3B0aW9ucy5faG9vaykge1xuXHRcdG9wdGlvbnMuX2hvb2soY3VycmVudENvbXBvbmVudCwgaW5kZXgsIGN1cnJlbnRIb29rIHx8IHR5cGUpO1xuXHR9XG5cdGN1cnJlbnRIb29rID0gMDtcblxuXHQvLyBMYXJnZWx5IGluc3BpcmVkIGJ5OlxuXHQvLyAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNoYWVsLWtsZWluL2Z1bmN5LmpzL2Jsb2IvZjZiZTczNDY4ZTZlYzQ2YjBmZjVhYTNjYzRjOWJhZjcyYTI5MDI1YS9zcmMvaG9va3MvY29yZV9ob29rcy5tanNcblx0Ly8gKiBodHRwczovL2dpdGh1Yi5jb20vbWljaGFlbC1rbGVpbi9mdW5jeS5qcy9ibG9iLzY1MGJlYWE1OGM0M2MzM2E3NDgyMGEzYzk4YjNjNzA3OWNmMmUzMzMvc3JjL3JlbmRlcmVyLm1qc1xuXHQvLyBPdGhlciBpbXBsZW1lbnRhdGlvbnMgdG8gbG9vayBhdDpcblx0Ly8gKiBodHRwczovL2NvZGVzYW5kYm94LmlvL3MvbW5veDA1cXA4XG5cdGNvbnN0IGhvb2tzID1cblx0XHRjdXJyZW50Q29tcG9uZW50Ll9faG9va3MgfHxcblx0XHQoY3VycmVudENvbXBvbmVudC5fX2hvb2tzID0ge1xuXHRcdFx0X2xpc3Q6IFtdLFxuXHRcdFx0X3BlbmRpbmdFZmZlY3RzOiBbXVxuXHRcdH0pO1xuXG5cdGlmIChpbmRleCA+PSBob29rcy5fbGlzdC5sZW5ndGgpIHtcblx0XHRob29rcy5fbGlzdC5wdXNoKHsgX3BlbmRpbmdWYWx1ZTogRU1QVFkgfSk7XG5cdH1cblx0cmV0dXJuIGhvb2tzLl9saXN0W2luZGV4XTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge2ltcG9ydCgnLi9pbmRleCcpLlN0YXRlVXBkYXRlcjxhbnk+fSBbaW5pdGlhbFN0YXRlXVxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlU3RhdGUoaW5pdGlhbFN0YXRlKSB7XG5cdGN1cnJlbnRIb29rID0gMTtcblx0cmV0dXJuIHVzZVJlZHVjZXIoaW52b2tlT3JSZXR1cm4sIGluaXRpYWxTdGF0ZSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtpbXBvcnQoJy4vaW5kZXgnKS5SZWR1Y2VyPGFueSwgYW55Pn0gcmVkdWNlclxuICogQHBhcmFtIHtpbXBvcnQoJy4vaW5kZXgnKS5TdGF0ZVVwZGF0ZXI8YW55Pn0gaW5pdGlhbFN0YXRlXG4gKiBAcGFyYW0geyhpbml0aWFsU3RhdGU6IGFueSkgPT4gdm9pZH0gW2luaXRdXG4gKiBAcmV0dXJucyB7WyBhbnksIChzdGF0ZTogYW55KSA9PiB2b2lkIF19XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1c2VSZWR1Y2VyKHJlZHVjZXIsIGluaXRpYWxTdGF0ZSwgaW5pdCkge1xuXHQvKiogQHR5cGUge2ltcG9ydCgnLi9pbnRlcm5hbCcpLlJlZHVjZXJIb29rU3RhdGV9ICovXG5cdGNvbnN0IGhvb2tTdGF0ZSA9IGdldEhvb2tTdGF0ZShjdXJyZW50SW5kZXgrKywgMik7XG5cdGhvb2tTdGF0ZS5fcmVkdWNlciA9IHJlZHVjZXI7XG5cdGlmICghaG9va1N0YXRlLl9jb21wb25lbnQpIHtcblx0XHRob29rU3RhdGUuX3ZhbHVlID0gW1xuXHRcdFx0IWluaXQgPyBpbnZva2VPclJldHVybih1bmRlZmluZWQsIGluaXRpYWxTdGF0ZSkgOiBpbml0KGluaXRpYWxTdGF0ZSksXG5cblx0XHRcdGFjdGlvbiA9PiB7XG5cdFx0XHRcdGNvbnN0IGN1cnJlbnRWYWx1ZSA9IGhvb2tTdGF0ZS5fbmV4dFZhbHVlXG5cdFx0XHRcdFx0PyBob29rU3RhdGUuX25leHRWYWx1ZVswXVxuXHRcdFx0XHRcdDogaG9va1N0YXRlLl92YWx1ZVswXTtcblx0XHRcdFx0Y29uc3QgbmV4dFZhbHVlID0gaG9va1N0YXRlLl9yZWR1Y2VyKGN1cnJlbnRWYWx1ZSwgYWN0aW9uKTtcblxuXHRcdFx0XHRpZiAoY3VycmVudFZhbHVlICE9PSBuZXh0VmFsdWUpIHtcblx0XHRcdFx0XHRob29rU3RhdGUuX25leHRWYWx1ZSA9IFtuZXh0VmFsdWUsIGhvb2tTdGF0ZS5fdmFsdWVbMV1dO1xuXHRcdFx0XHRcdGhvb2tTdGF0ZS5fY29tcG9uZW50LnNldFN0YXRlKHt9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdF07XG5cblx0XHRob29rU3RhdGUuX2NvbXBvbmVudCA9IGN1cnJlbnRDb21wb25lbnQ7XG5cblx0XHRpZiAoIWN1cnJlbnRDb21wb25lbnQuX2hhc1NjdUZyb21Ib29rcykge1xuXHRcdFx0Y3VycmVudENvbXBvbmVudC5faGFzU2N1RnJvbUhvb2tzID0gdHJ1ZTtcblx0XHRcdGxldCBwcmV2U2N1ID0gY3VycmVudENvbXBvbmVudC5zaG91bGRDb21wb25lbnRVcGRhdGU7XG5cdFx0XHRjb25zdCBwcmV2Q1dVID0gY3VycmVudENvbXBvbmVudC5jb21wb25lbnRXaWxsVXBkYXRlO1xuXG5cdFx0XHQvLyBJZiB3ZSdyZSBkZWFsaW5nIHdpdGggYSBmb3JjZWQgdXBkYXRlIGBzaG91bGRDb21wb25lbnRVcGRhdGVgIHdpbGxcblx0XHRcdC8vIG5vdCBiZSBjYWxsZWQuIEJ1dCB3ZSB1c2UgdGhhdCB0byB1cGRhdGUgdGhlIGhvb2sgdmFsdWVzLCBzbyB3ZVxuXHRcdFx0Ly8gbmVlZCB0byBjYWxsIGl0LlxuXHRcdFx0Y3VycmVudENvbXBvbmVudC5jb21wb25lbnRXaWxsVXBkYXRlID0gZnVuY3Rpb24gKHAsIHMsIGMpIHtcblx0XHRcdFx0aWYgKHRoaXMuX2ZvcmNlKSB7XG5cdFx0XHRcdFx0bGV0IHRtcCA9IHByZXZTY3U7XG5cdFx0XHRcdFx0Ly8gQ2xlYXIgdG8gYXZvaWQgb3RoZXIgc0NVIGhvb2tzIGZyb20gYmVpbmcgY2FsbGVkXG5cdFx0XHRcdFx0cHJldlNjdSA9IHVuZGVmaW5lZDtcblx0XHRcdFx0XHR1cGRhdGVIb29rU3RhdGUocCwgcywgYyk7XG5cdFx0XHRcdFx0cHJldlNjdSA9IHRtcDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChwcmV2Q1dVKSBwcmV2Q1dVLmNhbGwodGhpcywgcCwgcywgYyk7XG5cdFx0XHR9O1xuXG5cdFx0XHQvLyBUaGlzIFNDVSBoYXMgdGhlIHB1cnBvc2Ugb2YgYmFpbGluZyBvdXQgYWZ0ZXIgcmVwZWF0ZWQgdXBkYXRlc1xuXHRcdFx0Ly8gdG8gc3RhdGVmdWwgaG9va3MuXG5cdFx0XHQvLyB3ZSBzdG9yZSB0aGUgbmV4dCB2YWx1ZSBpbiBfbmV4dFZhbHVlWzBdIGFuZCBrZWVwIGRvaW5nIHRoYXQgZm9yIGFsbFxuXHRcdFx0Ly8gc3RhdGUgc2V0dGVycywgaWYgd2UgaGF2ZSBuZXh0IHN0YXRlcyBhbmRcblx0XHRcdC8vIGFsbCBuZXh0IHN0YXRlcyB3aXRoaW4gYSBjb21wb25lbnQgZW5kIHVwIGJlaW5nIGVxdWFsIHRvIHRoZWlyIG9yaWdpbmFsIHN0YXRlXG5cdFx0XHQvLyB3ZSBhcmUgc2FmZSB0byBiYWlsIG91dCBmb3IgdGhpcyBzcGVjaWZpYyBjb21wb25lbnQuXG5cdFx0XHQvKipcblx0XHRcdCAqXG5cdFx0XHQgKiBAdHlwZSB7aW1wb3J0KCcuL2ludGVybmFsJykuQ29tcG9uZW50W1wic2hvdWxkQ29tcG9uZW50VXBkYXRlXCJdfVxuXHRcdFx0ICovXG5cdFx0XHQvLyBAdHMtaWdub3JlIC0gV2UgZG9uJ3QgdXNlIFRTIHRvIGRvd250cmFuc3BpbGVcblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1pbm5lci1kZWNsYXJhdGlvbnNcblx0XHRcdGZ1bmN0aW9uIHVwZGF0ZUhvb2tTdGF0ZShwLCBzLCBjKSB7XG5cdFx0XHRcdGlmICghaG9va1N0YXRlLl9jb21wb25lbnQuX19ob29rcykgcmV0dXJuIHRydWU7XG5cblx0XHRcdFx0Y29uc3Qgc3RhdGVIb29rcyA9IGhvb2tTdGF0ZS5fY29tcG9uZW50Ll9faG9va3MuX2xpc3QuZmlsdGVyKFxuXHRcdFx0XHRcdHggPT4geC5fY29tcG9uZW50XG5cdFx0XHRcdCk7XG5cdFx0XHRcdGNvbnN0IGFsbEhvb2tzRW1wdHkgPSBzdGF0ZUhvb2tzLmV2ZXJ5KHggPT4gIXguX25leHRWYWx1ZSk7XG5cdFx0XHRcdC8vIFdoZW4gd2UgaGF2ZSBubyB1cGRhdGVkIGhvb2tzIGluIHRoZSBjb21wb25lbnQgd2UgaW52b2tlIHRoZSBwcmV2aW91cyBTQ1Ugb3Jcblx0XHRcdFx0Ly8gdHJhdmVyc2UgdGhlIFZET00gdHJlZSBmdXJ0aGVyLlxuXHRcdFx0XHRpZiAoYWxsSG9va3NFbXB0eSkge1xuXHRcdFx0XHRcdHJldHVybiBwcmV2U2N1ID8gcHJldlNjdS5jYWxsKHRoaXMsIHAsIHMsIGMpIDogdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFdlIGNoZWNrIHdoZXRoZXIgd2UgaGF2ZSBjb21wb25lbnRzIHdpdGggYSBuZXh0VmFsdWUgc2V0IHRoYXRcblx0XHRcdFx0Ly8gaGF2ZSB2YWx1ZXMgdGhhdCBhcmVuJ3QgZXF1YWwgdG8gb25lIGFub3RoZXIgdGhpcyBwdXNoZXNcblx0XHRcdFx0Ly8gdXMgdG8gdXBkYXRlIGZ1cnRoZXIgZG93biB0aGUgdHJlZVxuXHRcdFx0XHRsZXQgc2hvdWxkVXBkYXRlID0gZmFsc2U7XG5cdFx0XHRcdHN0YXRlSG9va3MuZm9yRWFjaChob29rSXRlbSA9PiB7XG5cdFx0XHRcdFx0aWYgKGhvb2tJdGVtLl9uZXh0VmFsdWUpIHtcblx0XHRcdFx0XHRcdGNvbnN0IGN1cnJlbnRWYWx1ZSA9IGhvb2tJdGVtLl92YWx1ZVswXTtcblx0XHRcdFx0XHRcdGhvb2tJdGVtLl92YWx1ZSA9IGhvb2tJdGVtLl9uZXh0VmFsdWU7XG5cdFx0XHRcdFx0XHRob29rSXRlbS5fbmV4dFZhbHVlID0gdW5kZWZpbmVkO1xuXHRcdFx0XHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSAhPT0gaG9va0l0ZW0uX3ZhbHVlWzBdKSBzaG91bGRVcGRhdGUgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0cmV0dXJuIHNob3VsZFVwZGF0ZSB8fCBob29rU3RhdGUuX2NvbXBvbmVudC5wcm9wcyAhPT0gcFxuXHRcdFx0XHRcdD8gcHJldlNjdVxuXHRcdFx0XHRcdFx0PyBwcmV2U2N1LmNhbGwodGhpcywgcCwgcywgYylcblx0XHRcdFx0XHRcdDogdHJ1ZVxuXHRcdFx0XHRcdDogZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdGN1cnJlbnRDb21wb25lbnQuc2hvdWxkQ29tcG9uZW50VXBkYXRlID0gdXBkYXRlSG9va1N0YXRlO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBob29rU3RhdGUuX25leHRWYWx1ZSB8fCBob29rU3RhdGUuX3ZhbHVlO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7aW1wb3J0KCcuL2ludGVybmFsJykuRWZmZWN0fSBjYWxsYmFja1xuICogQHBhcmFtIHthbnlbXX0gYXJnc1xuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlRWZmZWN0KGNhbGxiYWNrLCBhcmdzKSB7XG5cdC8qKiBAdHlwZSB7aW1wb3J0KCcuL2ludGVybmFsJykuRWZmZWN0SG9va1N0YXRlfSAqL1xuXHRjb25zdCBzdGF0ZSA9IGdldEhvb2tTdGF0ZShjdXJyZW50SW5kZXgrKywgMyk7XG5cdGlmICghb3B0aW9ucy5fc2tpcEVmZmVjdHMgJiYgYXJnc0NoYW5nZWQoc3RhdGUuX2FyZ3MsIGFyZ3MpKSB7XG5cdFx0c3RhdGUuX3ZhbHVlID0gY2FsbGJhY2s7XG5cdFx0c3RhdGUuX3BlbmRpbmdBcmdzID0gYXJncztcblxuXHRcdGN1cnJlbnRDb21wb25lbnQuX19ob29rcy5fcGVuZGluZ0VmZmVjdHMucHVzaChzdGF0ZSk7XG5cdH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge2ltcG9ydCgnLi9pbnRlcm5hbCcpLkVmZmVjdH0gY2FsbGJhY2tcbiAqIEBwYXJhbSB7YW55W119IGFyZ3NcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUxheW91dEVmZmVjdChjYWxsYmFjaywgYXJncykge1xuXHQvKiogQHR5cGUge2ltcG9ydCgnLi9pbnRlcm5hbCcpLkVmZmVjdEhvb2tTdGF0ZX0gKi9cblx0Y29uc3Qgc3RhdGUgPSBnZXRIb29rU3RhdGUoY3VycmVudEluZGV4KyssIDQpO1xuXHRpZiAoIW9wdGlvbnMuX3NraXBFZmZlY3RzICYmIGFyZ3NDaGFuZ2VkKHN0YXRlLl9hcmdzLCBhcmdzKSkge1xuXHRcdHN0YXRlLl92YWx1ZSA9IGNhbGxiYWNrO1xuXHRcdHN0YXRlLl9wZW5kaW5nQXJncyA9IGFyZ3M7XG5cblx0XHRjdXJyZW50Q29tcG9uZW50Ll9yZW5kZXJDYWxsYmFja3MucHVzaChzdGF0ZSk7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVJlZihpbml0aWFsVmFsdWUpIHtcblx0Y3VycmVudEhvb2sgPSA1O1xuXHRyZXR1cm4gdXNlTWVtbygoKSA9PiAoeyBjdXJyZW50OiBpbml0aWFsVmFsdWUgfSksIFtdKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge29iamVjdH0gcmVmXG4gKiBAcGFyYW0geygpID0+IG9iamVjdH0gY3JlYXRlSGFuZGxlXG4gKiBAcGFyYW0ge2FueVtdfSBhcmdzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1c2VJbXBlcmF0aXZlSGFuZGxlKHJlZiwgY3JlYXRlSGFuZGxlLCBhcmdzKSB7XG5cdGN1cnJlbnRIb29rID0gNjtcblx0dXNlTGF5b3V0RWZmZWN0KFxuXHRcdCgpID0+IHtcblx0XHRcdGlmICh0eXBlb2YgcmVmID09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0cmVmKGNyZWF0ZUhhbmRsZSgpKTtcblx0XHRcdFx0cmV0dXJuICgpID0+IHJlZihudWxsKTtcblx0XHRcdH0gZWxzZSBpZiAocmVmKSB7XG5cdFx0XHRcdHJlZi5jdXJyZW50ID0gY3JlYXRlSGFuZGxlKCk7XG5cdFx0XHRcdHJldHVybiAoKSA9PiAocmVmLmN1cnJlbnQgPSBudWxsKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGFyZ3MgPT0gbnVsbCA/IGFyZ3MgOiBhcmdzLmNvbmNhdChyZWYpXG5cdCk7XG59XG5cbi8qKlxuICogQHBhcmFtIHsoKSA9PiBhbnl9IGZhY3RvcnlcbiAqIEBwYXJhbSB7YW55W119IGFyZ3NcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZU1lbW8oZmFjdG9yeSwgYXJncykge1xuXHQvKiogQHR5cGUge2ltcG9ydCgnLi9pbnRlcm5hbCcpLk1lbW9Ib29rU3RhdGV9ICovXG5cdGNvbnN0IHN0YXRlID0gZ2V0SG9va1N0YXRlKGN1cnJlbnRJbmRleCsrLCA3KTtcblx0aWYgKGFyZ3NDaGFuZ2VkKHN0YXRlLl9hcmdzLCBhcmdzKSkge1xuXHRcdHN0YXRlLl9wZW5kaW5nVmFsdWUgPSBmYWN0b3J5KCk7XG5cdFx0c3RhdGUuX3BlbmRpbmdBcmdzID0gYXJncztcblx0XHRzdGF0ZS5fZmFjdG9yeSA9IGZhY3Rvcnk7XG5cdFx0cmV0dXJuIHN0YXRlLl9wZW5kaW5nVmFsdWU7XG5cdH1cblxuXHRyZXR1cm4gc3RhdGUuX3ZhbHVlO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7KCkgPT4gdm9pZH0gY2FsbGJhY2tcbiAqIEBwYXJhbSB7YW55W119IGFyZ3NcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUNhbGxiYWNrKGNhbGxiYWNrLCBhcmdzKSB7XG5cdGN1cnJlbnRIb29rID0gODtcblx0cmV0dXJuIHVzZU1lbW8oKCkgPT4gY2FsbGJhY2ssIGFyZ3MpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7aW1wb3J0KCcuL2ludGVybmFsJykuUHJlYWN0Q29udGV4dH0gY29udGV4dFxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlQ29udGV4dChjb250ZXh0KSB7XG5cdGNvbnN0IHByb3ZpZGVyID0gY3VycmVudENvbXBvbmVudC5jb250ZXh0W2NvbnRleHQuX2lkXTtcblx0Ly8gV2UgY291bGQgc2tpcCB0aGlzIGNhbGwgaGVyZSwgYnV0IHRoYW4gd2UnZCBub3QgY2FsbFxuXHQvLyBgb3B0aW9ucy5faG9va2AuIFdlIG5lZWQgdG8gZG8gdGhhdCBpbiBvcmRlciB0byBtYWtlXG5cdC8vIHRoZSBkZXZ0b29scyBhd2FyZSBvZiB0aGlzIGhvb2suXG5cdC8qKiBAdHlwZSB7aW1wb3J0KCcuL2ludGVybmFsJykuQ29udGV4dEhvb2tTdGF0ZX0gKi9cblx0Y29uc3Qgc3RhdGUgPSBnZXRIb29rU3RhdGUoY3VycmVudEluZGV4KyssIDkpO1xuXHQvLyBUaGUgZGV2dG9vbHMgbmVlZHMgYWNjZXNzIHRvIHRoZSBjb250ZXh0IG9iamVjdCB0b1xuXHQvLyBiZSBhYmxlIHRvIHB1bGwgb2YgdGhlIGRlZmF1bHQgdmFsdWUgd2hlbiBubyBwcm92aWRlclxuXHQvLyBpcyBwcmVzZW50IGluIHRoZSB0cmVlLlxuXHRzdGF0ZS5fY29udGV4dCA9IGNvbnRleHQ7XG5cdGlmICghcHJvdmlkZXIpIHJldHVybiBjb250ZXh0Ll9kZWZhdWx0VmFsdWU7XG5cdC8vIFRoaXMgaXMgcHJvYmFibHkgbm90IHNhZmUgdG8gY29udmVydCB0byBcIiFcIlxuXHRpZiAoc3RhdGUuX3ZhbHVlID09IG51bGwpIHtcblx0XHRzdGF0ZS5fdmFsdWUgPSB0cnVlO1xuXHRcdHByb3ZpZGVyLnN1YihjdXJyZW50Q29tcG9uZW50KTtcblx0fVxuXHRyZXR1cm4gcHJvdmlkZXIucHJvcHMudmFsdWU7XG59XG5cbi8qKlxuICogRGlzcGxheSBhIGN1c3RvbSBsYWJlbCBmb3IgYSBjdXN0b20gaG9vayBmb3IgdGhlIGRldnRvb2xzIHBhbmVsXG4gKiBAdHlwZSB7PFQ+KHZhbHVlOiBULCBjYj86ICh2YWx1ZTogVCkgPT4gc3RyaW5nIHwgbnVtYmVyKSA9PiB2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlRGVidWdWYWx1ZSh2YWx1ZSwgZm9ybWF0dGVyKSB7XG5cdGlmIChvcHRpb25zLnVzZURlYnVnVmFsdWUpIHtcblx0XHRvcHRpb25zLnVzZURlYnVnVmFsdWUoZm9ybWF0dGVyID8gZm9ybWF0dGVyKHZhbHVlKSA6IHZhbHVlKTtcblx0fVxufVxuXG4vKipcbiAqIEBwYXJhbSB7KGVycm9yOiBhbnksIGVycm9ySW5mbzogaW1wb3J0KCdwcmVhY3QnKS5FcnJvckluZm8pID0+IHZvaWR9IGNiXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1c2VFcnJvckJvdW5kYXJ5KGNiKSB7XG5cdC8qKiBAdHlwZSB7aW1wb3J0KCcuL2ludGVybmFsJykuRXJyb3JCb3VuZGFyeUhvb2tTdGF0ZX0gKi9cblx0Y29uc3Qgc3RhdGUgPSBnZXRIb29rU3RhdGUoY3VycmVudEluZGV4KyssIDEwKTtcblx0Y29uc3QgZXJyU3RhdGUgPSB1c2VTdGF0ZSgpO1xuXHRzdGF0ZS5fdmFsdWUgPSBjYjtcblx0aWYgKCFjdXJyZW50Q29tcG9uZW50LmNvbXBvbmVudERpZENhdGNoKSB7XG5cdFx0Y3VycmVudENvbXBvbmVudC5jb21wb25lbnREaWRDYXRjaCA9IChlcnIsIGVycm9ySW5mbykgPT4ge1xuXHRcdFx0aWYgKHN0YXRlLl92YWx1ZSkgc3RhdGUuX3ZhbHVlKGVyciwgZXJyb3JJbmZvKTtcblx0XHRcdGVyclN0YXRlWzFdKGVycik7XG5cdFx0fTtcblx0fVxuXHRyZXR1cm4gW1xuXHRcdGVyclN0YXRlWzBdLFxuXHRcdCgpID0+IHtcblx0XHRcdGVyclN0YXRlWzFdKHVuZGVmaW5lZCk7XG5cdFx0fVxuXHRdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlSWQoKSB7XG5cdGNvbnN0IHN0YXRlID0gZ2V0SG9va1N0YXRlKGN1cnJlbnRJbmRleCsrLCAxMSk7XG5cdGlmICghc3RhdGUuX3ZhbHVlKSB7XG5cdFx0Ly8gR3JhYiBlaXRoZXIgdGhlIHJvb3Qgbm9kZSBvciB0aGUgbmVhcmVzdCBhc3luYyBib3VuZGFyeSBub2RlLlxuXHRcdC8qKiBAdHlwZSB7aW1wb3J0KCcuL2ludGVybmFsLmQnKS5WTm9kZX0gKi9cblx0XHRsZXQgcm9vdCA9IGN1cnJlbnRDb21wb25lbnQuX3Zub2RlO1xuXHRcdHdoaWxlIChyb290ICE9PSBudWxsICYmICFyb290Ll9tYXNrICYmIHJvb3QuX3BhcmVudCAhPT0gbnVsbCkge1xuXHRcdFx0cm9vdCA9IHJvb3QuX3BhcmVudDtcblx0XHR9XG5cblx0XHRsZXQgbWFzayA9IHJvb3QuX21hc2sgfHwgKHJvb3QuX21hc2sgPSBbMCwgMF0pO1xuXHRcdHN0YXRlLl92YWx1ZSA9ICdQJyArIG1hc2tbMF0gKyAnLScgKyBtYXNrWzFdKys7XG5cdH1cblxuXHRyZXR1cm4gc3RhdGUuX3ZhbHVlO1xufVxuLyoqXG4gKiBBZnRlciBwYWludCBlZmZlY3RzIGNvbnN1bWVyLlxuICovXG5mdW5jdGlvbiBmbHVzaEFmdGVyUGFpbnRFZmZlY3RzKCkge1xuXHRsZXQgY29tcG9uZW50O1xuXHR3aGlsZSAoKGNvbXBvbmVudCA9IGFmdGVyUGFpbnRFZmZlY3RzLnNoaWZ0KCkpKSB7XG5cdFx0aWYgKCFjb21wb25lbnQuX3BhcmVudERvbSB8fCAhY29tcG9uZW50Ll9faG9va3MpIGNvbnRpbnVlO1xuXHRcdHRyeSB7XG5cdFx0XHRjb21wb25lbnQuX19ob29rcy5fcGVuZGluZ0VmZmVjdHMuZm9yRWFjaChpbnZva2VDbGVhbnVwKTtcblx0XHRcdGNvbXBvbmVudC5fX2hvb2tzLl9wZW5kaW5nRWZmZWN0cy5mb3JFYWNoKGludm9rZUVmZmVjdCk7XG5cdFx0XHRjb21wb25lbnQuX19ob29rcy5fcGVuZGluZ0VmZmVjdHMgPSBbXTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRjb21wb25lbnQuX19ob29rcy5fcGVuZGluZ0VmZmVjdHMgPSBbXTtcblx0XHRcdG9wdGlvbnMuX2NhdGNoRXJyb3IoZSwgY29tcG9uZW50Ll92bm9kZSk7XG5cdFx0fVxuXHR9XG59XG5cbmxldCBIQVNfUkFGID0gdHlwZW9mIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PSAnZnVuY3Rpb24nO1xuXG4vKipcbiAqIFNjaGVkdWxlIGEgY2FsbGJhY2sgdG8gYmUgaW52b2tlZCBhZnRlciB0aGUgYnJvd3NlciBoYXMgYSBjaGFuY2UgdG8gcGFpbnQgYSBuZXcgZnJhbWUuXG4gKiBEbyB0aGlzIGJ5IGNvbWJpbmluZyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgKHJBRikgKyBzZXRUaW1lb3V0IHRvIGludm9rZSBhIGNhbGxiYWNrIGFmdGVyXG4gKiB0aGUgbmV4dCBicm93c2VyIGZyYW1lLlxuICpcbiAqIEFsc28sIHNjaGVkdWxlIGEgdGltZW91dCBpbiBwYXJhbGxlbCB0byB0aGUgdGhlIHJBRiB0byBlbnN1cmUgdGhlIGNhbGxiYWNrIGlzIGludm9rZWRcbiAqIGV2ZW4gaWYgUkFGIGRvZXNuJ3QgZmlyZSAoZm9yIGV4YW1wbGUgaWYgdGhlIGJyb3dzZXIgdGFiIGlzIG5vdCB2aXNpYmxlKVxuICpcbiAqIEBwYXJhbSB7KCkgPT4gdm9pZH0gY2FsbGJhY2tcbiAqL1xuZnVuY3Rpb24gYWZ0ZXJOZXh0RnJhbWUoY2FsbGJhY2spIHtcblx0Y29uc3QgZG9uZSA9ICgpID0+IHtcblx0XHRjbGVhclRpbWVvdXQodGltZW91dCk7XG5cdFx0aWYgKEhBU19SQUYpIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHJhZik7XG5cdFx0c2V0VGltZW91dChjYWxsYmFjayk7XG5cdH07XG5cdGNvbnN0IHRpbWVvdXQgPSBzZXRUaW1lb3V0KGRvbmUsIFJBRl9USU1FT1VUKTtcblxuXHRsZXQgcmFmO1xuXHRpZiAoSEFTX1JBRikge1xuXHRcdHJhZiA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShkb25lKTtcblx0fVxufVxuXG4vLyBOb3RlOiBpZiBzb21lb25lIHVzZWQgb3B0aW9ucy5kZWJvdW5jZVJlbmRlcmluZyA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSxcbi8vIHRoZW4gZWZmZWN0cyB3aWxsIEFMV0FZUyBydW4gb24gdGhlIE5FWFQgZnJhbWUgaW5zdGVhZCBvZiB0aGUgY3VycmVudCBvbmUsIGluY3VycmluZyBhIH4xNm1zIGRlbGF5LlxuLy8gUGVyaGFwcyB0aGlzIGlzIG5vdCBzdWNoIGEgYmlnIGRlYWwuXG4vKipcbiAqIFNjaGVkdWxlIGFmdGVyUGFpbnRFZmZlY3RzIGZsdXNoIGFmdGVyIHRoZSBicm93c2VyIHBhaW50c1xuICogQHBhcmFtIHtudW1iZXJ9IG5ld1F1ZXVlTGVuZ3RoXG4gKi9cbmZ1bmN0aW9uIGFmdGVyUGFpbnQobmV3UXVldWVMZW5ndGgpIHtcblx0aWYgKG5ld1F1ZXVlTGVuZ3RoID09PSAxIHx8IHByZXZSYWYgIT09IG9wdGlvbnMucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XG5cdFx0cHJldlJhZiA9IG9wdGlvbnMucmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuXHRcdChwcmV2UmFmIHx8IGFmdGVyTmV4dEZyYW1lKShmbHVzaEFmdGVyUGFpbnRFZmZlY3RzKTtcblx0fVxufVxuXG4vKipcbiAqIEBwYXJhbSB7aW1wb3J0KCcuL2ludGVybmFsJykuRWZmZWN0SG9va1N0YXRlfSBob29rXG4gKi9cbmZ1bmN0aW9uIGludm9rZUNsZWFudXAoaG9vaykge1xuXHQvLyBBIGhvb2sgY2xlYW51cCBjYW4gaW50cm9kdWNlIGEgY2FsbCB0byByZW5kZXIgd2hpY2ggY3JlYXRlcyBhIG5ldyByb290LCB0aGlzIHdpbGwgY2FsbCBvcHRpb25zLnZub2RlXG5cdC8vIGFuZCBtb3ZlIHRoZSBjdXJyZW50Q29tcG9uZW50IGF3YXkuXG5cdGNvbnN0IGNvbXAgPSBjdXJyZW50Q29tcG9uZW50O1xuXHRsZXQgY2xlYW51cCA9IGhvb2suX2NsZWFudXA7XG5cdGlmICh0eXBlb2YgY2xlYW51cCA9PSAnZnVuY3Rpb24nKSB7XG5cdFx0aG9vay5fY2xlYW51cCA9IHVuZGVmaW5lZDtcblx0XHRjbGVhbnVwKCk7XG5cdH1cblxuXHRjdXJyZW50Q29tcG9uZW50ID0gY29tcDtcbn1cblxuLyoqXG4gKiBJbnZva2UgYSBIb29rJ3MgZWZmZWN0XG4gKiBAcGFyYW0ge2ltcG9ydCgnLi9pbnRlcm5hbCcpLkVmZmVjdEhvb2tTdGF0ZX0gaG9va1xuICovXG5mdW5jdGlvbiBpbnZva2VFZmZlY3QoaG9vaykge1xuXHQvLyBBIGhvb2sgY2FsbCBjYW4gaW50cm9kdWNlIGEgY2FsbCB0byByZW5kZXIgd2hpY2ggY3JlYXRlcyBhIG5ldyByb290LCB0aGlzIHdpbGwgY2FsbCBvcHRpb25zLnZub2RlXG5cdC8vIGFuZCBtb3ZlIHRoZSBjdXJyZW50Q29tcG9uZW50IGF3YXkuXG5cdGNvbnN0IGNvbXAgPSBjdXJyZW50Q29tcG9uZW50O1xuXHRob29rLl9jbGVhbnVwID0gaG9vay5fdmFsdWUoKTtcblx0Y3VycmVudENvbXBvbmVudCA9IGNvbXA7XG59XG5cbi8qKlxuICogQHBhcmFtIHthbnlbXX0gb2xkQXJnc1xuICogQHBhcmFtIHthbnlbXX0gbmV3QXJnc1xuICovXG5mdW5jdGlvbiBhcmdzQ2hhbmdlZChvbGRBcmdzLCBuZXdBcmdzKSB7XG5cdHJldHVybiAoXG5cdFx0IW9sZEFyZ3MgfHxcblx0XHRvbGRBcmdzLmxlbmd0aCAhPT0gbmV3QXJncy5sZW5ndGggfHxcblx0XHRuZXdBcmdzLnNvbWUoKGFyZywgaW5kZXgpID0+IGFyZyAhPT0gb2xkQXJnc1tpbmRleF0pXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGludm9rZU9yUmV0dXJuKGFyZywgZikge1xuXHRyZXR1cm4gdHlwZW9mIGYgPT0gJ2Z1bmN0aW9uJyA/IGYoYXJnKSA6IGY7XG59XG4iLCAiY29uc3QgRU5DT0RFRF9FTlRJVElFUyA9IC9bXCImPF0vO1xuXG4vKiogQHBhcmFtIHtzdHJpbmd9IHN0ciAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVuY29kZUVudGl0aWVzKHN0cikge1xuXHQvLyBTa2lwIGFsbCB3b3JrIGZvciBzdHJpbmdzIHdpdGggbm8gZW50aXRpZXMgbmVlZGluZyBlbmNvZGluZzpcblx0aWYgKHN0ci5sZW5ndGggPT09IDAgfHwgRU5DT0RFRF9FTlRJVElFUy50ZXN0KHN0cikgPT09IGZhbHNlKSByZXR1cm4gc3RyO1xuXG5cdGxldCBsYXN0ID0gMCxcblx0XHRpID0gMCxcblx0XHRvdXQgPSAnJyxcblx0XHRjaCA9ICcnO1xuXG5cdC8vIFNlZWsgZm9yd2FyZCBpbiBzdHIgdW50aWwgdGhlIG5leHQgZW50aXR5IGNoYXI6XG5cdGZvciAoOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG5cdFx0c3dpdGNoIChzdHIuY2hhckNvZGVBdChpKSkge1xuXHRcdFx0Y2FzZSAzNDpcblx0XHRcdFx0Y2ggPSAnJnF1b3Q7Jztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDM4OlxuXHRcdFx0XHRjaCA9ICcmYW1wOyc7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA2MDpcblx0XHRcdFx0Y2ggPSAnJmx0Oyc7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0Y29udGludWU7XG5cdFx0fVxuXHRcdC8vIEFwcGVuZCBza2lwcGVkL2J1ZmZlcmVkIGNoYXJhY3RlcnMgYW5kIHRoZSBlbmNvZGVkIGVudGl0eTpcblx0XHRpZiAoaSAhPT0gbGFzdCkgb3V0ICs9IHN0ci5zbGljZShsYXN0LCBpKTtcblx0XHRvdXQgKz0gY2g7XG5cdFx0Ly8gU3RhcnQgdGhlIG5leHQgc2Vlay9idWZmZXIgYWZ0ZXIgdGhlIGVudGl0eSdzIG9mZnNldDpcblx0XHRsYXN0ID0gaSArIDE7XG5cdH1cblx0aWYgKGkgIT09IGxhc3QpIG91dCArPSBzdHIuc2xpY2UobGFzdCwgaSk7XG5cdHJldHVybiBvdXQ7XG59XG4iLCAiLyoqIE5vcm1hbCBoeWRyYXRpb24gdGhhdCBhdHRhY2hlcyB0byBhIERPTSB0cmVlIGJ1dCBkb2VzIG5vdCBkaWZmIGl0LiAqL1xuZXhwb3J0IGNvbnN0IE1PREVfSFlEUkFURSA9IDEgPDwgNTtcbi8qKiBTaWduaWZpZXMgdGhpcyBWTm9kZSBzdXNwZW5kZWQgb24gdGhlIHByZXZpb3VzIHJlbmRlciAqL1xuZXhwb3J0IGNvbnN0IE1PREVfU1VTUEVOREVEID0gMSA8PCA3O1xuLyoqIEluZGljYXRlcyB0aGF0IHRoaXMgbm9kZSBuZWVkcyB0byBiZSBpbnNlcnRlZCB3aGlsZSBwYXRjaGluZyBjaGlsZHJlbiAqL1xuZXhwb3J0IGNvbnN0IElOU0VSVF9WTk9ERSA9IDEgPDwgMTY7XG4vKiogSW5kaWNhdGVzIGEgVk5vZGUgaGFzIGJlZW4gbWF0Y2hlZCB3aXRoIGFub3RoZXIgVk5vZGUgaW4gdGhlIGRpZmYgKi9cbmV4cG9ydCBjb25zdCBNQVRDSEVEID0gMSA8PCAxNztcblxuLyoqIFJlc2V0IGFsbCBtb2RlIGZsYWdzICovXG5leHBvcnQgY29uc3QgUkVTRVRfTU9ERSA9IH4oTU9ERV9IWURSQVRFIHwgTU9ERV9TVVNQRU5ERUQpO1xuXG5leHBvcnQgY29uc3QgRU1QVFlfT0JKID0gLyoqIEB0eXBlIHthbnl9ICovICh7fSk7XG5leHBvcnQgY29uc3QgRU1QVFlfQVJSID0gW107XG5leHBvcnQgY29uc3QgSVNfTk9OX0RJTUVOU0lPTkFMID1cblx0L2FjaXR8ZXgoPzpzfGd8bnxwfCQpfHJwaHxncmlkfG93c3xtbmN8bnR3fGluZVtjaF18em9vfF5vcmR8aXRlcmEvaTtcbiIsICJpbXBvcnQgeyBvcHRpb25zLCBGcmFnbWVudCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyBlbmNvZGVFbnRpdGllcyB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgSVNfTk9OX0RJTUVOU0lPTkFMIH0gZnJvbSAnLi4vLi4vc3JjL2NvbnN0YW50cyc7XG5cbmxldCB2bm9kZUlkID0gMDtcblxuY29uc3QgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbi8qKlxuICogQGZpbGVvdmVydmlld1xuICogVGhpcyBmaWxlIGV4cG9ydHMgdmFyaW91cyBtZXRob2RzIHRoYXQgaW1wbGVtZW50IEJhYmVsJ3MgXCJhdXRvbWF0aWNcIiBKU1ggcnVudGltZSBBUEk6XG4gKiAtIGpzeCh0eXBlLCBwcm9wcywga2V5KVxuICogLSBqc3hzKHR5cGUsIHByb3BzLCBrZXkpXG4gKiAtIGpzeERFVih0eXBlLCBwcm9wcywga2V5LCBfX3NvdXJjZSwgX19zZWxmKVxuICpcbiAqIFRoZSBpbXBsZW1lbnRhdGlvbiBvZiBjcmVhdGVWTm9kZSBoZXJlIGlzIG9wdGltaXplZCBmb3IgcGVyZm9ybWFuY2UuXG4gKiBCZW5jaG1hcmtzOiBodHRwczovL2VzYmVuY2guY29tL2JlbmNoLzVmNmI1NGEwYjQ2MzIxMDBhN2RjZDJiM1xuICovXG5cbi8qKlxuICogSlNYLkVsZW1lbnQgZmFjdG9yeSB1c2VkIGJ5IEJhYmVsJ3Mge3J1bnRpbWU6XCJhdXRvbWF0aWNcIn0gSlNYIHRyYW5zZm9ybVxuICogQHBhcmFtIHtWTm9kZVsndHlwZSddfSB0eXBlXG4gKiBAcGFyYW0ge1ZOb2RlWydwcm9wcyddfSBwcm9wc1xuICogQHBhcmFtIHtWTm9kZVsna2V5J119IFtrZXldXG4gKiBAcGFyYW0ge3Vua25vd259IFtpc1N0YXRpY0NoaWxkcmVuXVxuICogQHBhcmFtIHt1bmtub3dufSBbX19zb3VyY2VdXG4gKiBAcGFyYW0ge3Vua25vd259IFtfX3NlbGZdXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVZOb2RlKHR5cGUsIHByb3BzLCBrZXksIGlzU3RhdGljQ2hpbGRyZW4sIF9fc291cmNlLCBfX3NlbGYpIHtcblx0Ly8gV2UnbGwgd2FudCB0byBwcmVzZXJ2ZSBgcmVmYCBpbiBwcm9wcyB0byBnZXQgcmlkIG9mIHRoZSBuZWVkIGZvclxuXHQvLyBmb3J3YXJkUmVmIGNvbXBvbmVudHMgaW4gdGhlIGZ1dHVyZSwgYnV0IHRoYXQgc2hvdWxkIGhhcHBlbiB2aWFcblx0Ly8gYSBzZXBhcmF0ZSBQUi5cblx0bGV0IG5vcm1hbGl6ZWRQcm9wcyA9IHt9LFxuXHRcdHJlZixcblx0XHRpO1xuXHRmb3IgKGkgaW4gcHJvcHMpIHtcblx0XHRpZiAoaSA9PSAncmVmJykge1xuXHRcdFx0cmVmID0gcHJvcHNbaV07XG5cdFx0fSBlbHNlIHtcblx0XHRcdG5vcm1hbGl6ZWRQcm9wc1tpXSA9IHByb3BzW2ldO1xuXHRcdH1cblx0fVxuXG5cdC8qKiBAdHlwZSB7Vk5vZGUgJiB7IF9fc291cmNlOiBhbnk7IF9fc2VsZjogYW55IH19ICovXG5cdGNvbnN0IHZub2RlID0ge1xuXHRcdHR5cGUsXG5cdFx0cHJvcHM6IG5vcm1hbGl6ZWRQcm9wcyxcblx0XHRrZXksXG5cdFx0cmVmLFxuXHRcdF9jaGlsZHJlbjogbnVsbCxcblx0XHRfcGFyZW50OiBudWxsLFxuXHRcdF9kZXB0aDogMCxcblx0XHRfZG9tOiBudWxsLFxuXHRcdF9uZXh0RG9tOiB1bmRlZmluZWQsXG5cdFx0X2NvbXBvbmVudDogbnVsbCxcblx0XHRjb25zdHJ1Y3RvcjogdW5kZWZpbmVkLFxuXHRcdF9vcmlnaW5hbDogLS12bm9kZUlkLFxuXHRcdF9pbmRleDogLTEsXG5cdFx0X2ZsYWdzOiAwLFxuXHRcdF9fc291cmNlLFxuXHRcdF9fc2VsZlxuXHR9O1xuXG5cdC8vIElmIGEgQ29tcG9uZW50IFZOb2RlLCBjaGVjayBmb3IgYW5kIGFwcGx5IGRlZmF1bHRQcm9wcy5cblx0Ly8gTm90ZTogYHR5cGVgIGlzIG9mdGVuIGEgU3RyaW5nLCBhbmQgY2FuIGJlIGB1bmRlZmluZWRgIGluIGRldmVsb3BtZW50LlxuXHRpZiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicgJiYgKHJlZiA9IHR5cGUuZGVmYXVsdFByb3BzKSkge1xuXHRcdGZvciAoaSBpbiByZWYpXG5cdFx0XHRpZiAodHlwZW9mIG5vcm1hbGl6ZWRQcm9wc1tpXSA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0bm9ybWFsaXplZFByb3BzW2ldID0gcmVmW2ldO1xuXHRcdFx0fVxuXHR9XG5cblx0aWYgKG9wdGlvbnMudm5vZGUpIG9wdGlvbnMudm5vZGUodm5vZGUpO1xuXHRyZXR1cm4gdm5vZGU7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgdGVtcGxhdGUgdm5vZGUuIFRoaXMgZnVuY3Rpb24gaXMgbm90IGV4cGVjdGVkIHRvIGJlXG4gKiB1c2VkIGRpcmVjdGx5LCBidXQgcmF0aGVyIHRocm91Z2ggYSBwcmVjb21waWxlIEpTWCB0cmFuc2Zvcm1cbiAqIEBwYXJhbSB7c3RyaW5nW119IHRlbXBsYXRlc1xuICogQHBhcmFtICB7QXJyYXk8c3RyaW5nIHwgbnVsbCB8IFZOb2RlPn0gZXhwcnNcbiAqIEByZXR1cm5zIHtWTm9kZX1cbiAqL1xuZnVuY3Rpb24ganN4VGVtcGxhdGUodGVtcGxhdGVzLCAuLi5leHBycykge1xuXHRjb25zdCB2bm9kZSA9IGNyZWF0ZVZOb2RlKEZyYWdtZW50LCB7IHRwbDogdGVtcGxhdGVzLCBleHBycyB9KTtcblx0Ly8gQnlwYXNzIHJlbmRlciB0byBzdHJpbmcgdG9wIGxldmVsIEZyYWdtZW50IG9wdGltaXphdGlvblxuXHR2bm9kZS5rZXkgPSB2bm9kZS5fdm5vZGU7XG5cdHJldHVybiB2bm9kZTtcbn1cblxuY29uc3QgSlNfVE9fQ1NTID0ge307XG5jb25zdCBDU1NfUkVHRVggPSAvW0EtWl0vZztcblxuLyoqXG4gKiBTZXJpYWxpemUgYW4gSFRNTCBhdHRyaWJ1dGUgdG8gYSBzdHJpbmcuIFRoaXMgZnVuY3Rpb24gaXMgbm90XG4gKiBleHBlY3RlZCB0byBiZSB1c2VkIGRpcmVjdGx5LCBidXQgcmF0aGVyIHRocm91Z2ggYSBwcmVjb21waWxlXG4gKiBKU1ggdHJhbnNmb3JtXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgYXR0cmlidXRlIG5hbWVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIGF0dHJpYnV0ZSB2YWx1ZVxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24ganN4QXR0cihuYW1lLCB2YWx1ZSkge1xuXHRpZiAob3B0aW9ucy5hdHRyKSB7XG5cdFx0Y29uc3QgcmVzdWx0ID0gb3B0aW9ucy5hdHRyKG5hbWUsIHZhbHVlKTtcblx0XHRpZiAodHlwZW9mIHJlc3VsdCA9PT0gJ3N0cmluZycpIHJldHVybiByZXN1bHQ7XG5cdH1cblxuXHRpZiAobmFtZSA9PT0gJ3JlZicgfHwgbmFtZSA9PT0gJ2tleScpIHJldHVybiAnJztcblx0aWYgKG5hbWUgPT09ICdzdHlsZScgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuXHRcdGxldCBzdHIgPSAnJztcblx0XHRmb3IgKGxldCBwcm9wIGluIHZhbHVlKSB7XG5cdFx0XHRsZXQgdmFsID0gdmFsdWVbcHJvcF07XG5cdFx0XHRpZiAodmFsICE9IG51bGwgJiYgdmFsICE9PSAnJykge1xuXHRcdFx0XHRjb25zdCBuYW1lID1cblx0XHRcdFx0XHRwcm9wWzBdID09ICctJ1xuXHRcdFx0XHRcdFx0PyBwcm9wXG5cdFx0XHRcdFx0XHQ6IEpTX1RPX0NTU1twcm9wXSB8fFxuXHRcdFx0XHRcdFx0ICAoSlNfVE9fQ1NTW3Byb3BdID0gcHJvcC5yZXBsYWNlKENTU19SRUdFWCwgJy0kJicpLnRvTG93ZXJDYXNlKCkpO1xuXG5cdFx0XHRcdGxldCBzdWZmaXggPSAnOyc7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR0eXBlb2YgdmFsID09PSAnbnVtYmVyJyAmJlxuXHRcdFx0XHRcdC8vIEV4Y2x1ZGUgY3VzdG9tLWF0dHJpYnV0ZXNcblx0XHRcdFx0XHQhbmFtZS5zdGFydHNXaXRoKCctLScpICYmXG5cdFx0XHRcdFx0IUlTX05PTl9ESU1FTlNJT05BTC50ZXN0KG5hbWUpXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHN1ZmZpeCA9ICdweDsnO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHN0ciA9IHN0ciArIG5hbWUgKyAnOicgKyB2YWwgKyBzdWZmaXg7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBuYW1lICsgJz1cIicgKyBzdHIgKyAnXCInO1xuXHR9XG5cblx0aWYgKFxuXHRcdHZhbHVlID09IG51bGwgfHxcblx0XHR2YWx1ZSA9PT0gZmFsc2UgfHxcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicgfHxcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnXG5cdCkge1xuXHRcdHJldHVybiAnJztcblx0fSBlbHNlIGlmICh2YWx1ZSA9PT0gdHJ1ZSkgcmV0dXJuIG5hbWU7XG5cblx0cmV0dXJuIG5hbWUgKyAnPVwiJyArIGVuY29kZUVudGl0aWVzKHZhbHVlKSArICdcIic7XG59XG5cbi8qKlxuICogRXNjYXBlIGEgZHluYW1pYyBjaGlsZCBwYXNzZWQgdG8gYGpzeFRlbXBsYXRlYC4gVGhpcyBmdW5jdGlvblxuICogaXMgbm90IGV4cGVjdGVkIHRvIGJlIHVzZWQgZGlyZWN0bHksIGJ1dCByYXRoZXIgdGhyb3VnaCBhXG4gKiBwcmVjb21waWxlIEpTWCB0cmFuc2Zvcm1cbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEByZXR1cm5zIHtzdHJpbmcgfCBudWxsIHwgVk5vZGUgfCBBcnJheTxzdHJpbmcgfCBudWxsIHwgVk5vZGU+fVxuICovXG5mdW5jdGlvbiBqc3hFc2NhcGUodmFsdWUpIHtcblx0aWYgKFxuXHRcdHZhbHVlID09IG51bGwgfHxcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJyB8fFxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJ1xuXHQpIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG5cdFx0Ly8gQ2hlY2sgZm9yIFZOb2RlXG5cdFx0aWYgKHZhbHVlLmNvbnN0cnVjdG9yID09PSB1bmRlZmluZWQpIHJldHVybiB2YWx1ZTtcblxuXHRcdGlmIChpc0FycmF5KHZhbHVlKSkge1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHR2YWx1ZVtpXSA9IGpzeEVzY2FwZSh2YWx1ZVtpXSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGVuY29kZUVudGl0aWVzKCcnICsgdmFsdWUpO1xufVxuXG5leHBvcnQge1xuXHRjcmVhdGVWTm9kZSBhcyBqc3gsXG5cdGNyZWF0ZVZOb2RlIGFzIGpzeHMsXG5cdGNyZWF0ZVZOb2RlIGFzIGpzeERFVixcblx0RnJhZ21lbnQsXG5cdC8vIHByZWNvbXBpbGVkIEpTWCB0cmFuc2Zvcm1cblx0anN4VGVtcGxhdGUsXG5cdGpzeEF0dHIsXG5cdGpzeEVzY2FwZVxufTtcbiIsICIvKipcclxuICogU2lkZWJhciBDb21wb25lbnRcclxuICogXHJcbiAqIExlZnQgc2lkZWJhciB3aXRoIHByb2plY3Qgc2VsZWN0aW9uLCBsYW5ndWFnZS9wbGF0Zm9ybSB0YWJzLCBhbmQgc2NyZWVuc2hvdCBsaXN0LlxyXG4gKi9cclxuXHJcbmltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHR5cGUgeyBDb25maWcsIFByb2plY3RJbmZvLCBTY3JlZW5zaG90LCBGZWF0dXJlR3JhcGhpYywgU2VsZWN0ZWRJdGVtLCBBc3NldHMgfSBmcm9tICcuLi90eXBlcy50cyc7XHJcblxyXG5pbnRlcmZhY2UgU2lkZWJhclByb3BzIHtcclxuICBjb25maWc6IENvbmZpZztcclxuICBwcm9qZWN0czogUHJvamVjdEluZm9bXTtcclxuICBjdXJyZW50UHJvamVjdDogc3RyaW5nIHwgbnVsbDtcclxuICBzZWxlY3RlZExhbmc6IHN0cmluZztcclxuICBzZWxlY3RlZFBsYXRmb3JtOiAnYW5kcm9pZCcgfCAnaW9zJztcclxuICBzZWxlY3RlZEl0ZW06IFNlbGVjdGVkSXRlbTtcclxuICBzY3JlZW5zaG90czogU2NyZWVuc2hvdFtdO1xyXG4gIGZlYXR1cmVHcmFwaGljPzogRmVhdHVyZUdyYXBoaWM7XHJcbiAgYXNzZXRzPzogQXNzZXRzO1xyXG4gIG9uU2VsZWN0TGFuZzogKGxhbmc6IHN0cmluZykgPT4gdm9pZDtcclxuICBvblNlbGVjdFBsYXRmb3JtOiAocGxhdGZvcm06ICdhbmRyb2lkJyB8ICdpb3MnKSA9PiB2b2lkO1xyXG4gIG9uU2VsZWN0SXRlbTogKGl0ZW06IFNlbGVjdGVkSXRlbSkgPT4gdm9pZDtcclxuICBvbkFkZFNjcmVlbnNob3Q6ICgpID0+IHZvaWQ7XHJcbiAgb25EZWxldGVTY3JlZW5zaG90OiAoaWQ6IHN0cmluZykgPT4gdm9pZDtcclxuICBvblN3aXRjaFByb2plY3Q6IChwcm9qZWN0SWQ6IHN0cmluZykgPT4gdm9pZDtcclxuICBvblNob3dQcm9qZWN0TW9kYWw6ICgpID0+IHZvaWQ7XHJcbiAgb25HZW5lcmF0ZTogKCkgPT4gdm9pZDtcclxuICBvbkFkZExhbmd1YWdlOiAobGFuZzogc3RyaW5nLCBjb3B5RnJvbTogc3RyaW5nIHwgbnVsbCkgPT4gdm9pZDtcclxuICBvbkNvcHlQbGF0Zm9ybUNvbmZpZzogKHNvdXJjZTogJ2FuZHJvaWQnIHwgJ2lvcycsIHRhcmdldDogJ2FuZHJvaWQnIHwgJ2lvcycpID0+IHZvaWQ7XHJcbiAgb25TaG93VGhlbWVFZGl0b3I6ICgpID0+IHZvaWQ7XHJcbiAgb25TaG93TWVkaWFNYW5hZ2VyOiAoKSA9PiB2b2lkO1xyXG4gIGdlbmVyYXRpbmc6IGJvb2xlYW47XHJcbiAgbGFzdEdlbmVyYXRlZD86IHsgcmVzdWx0czogeyByZWxhdGl2ZVBhdGg6IHN0cmluZzsgc3RhdHVzOiBzdHJpbmcgfVtdOyBvdXRwdXREaXI6IHN0cmluZyB9IHwgbnVsbDtcclxuICBvblZpZXdMYXN0R2VuZXJhdGVkPzogKCkgPT4gdm9pZDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFNpZGViYXIoe1xyXG4gIGNvbmZpZyxcclxuICBwcm9qZWN0cyxcclxuICBjdXJyZW50UHJvamVjdCxcclxuICBzZWxlY3RlZExhbmcsXHJcbiAgc2VsZWN0ZWRQbGF0Zm9ybSxcclxuICBzZWxlY3RlZEl0ZW0sXHJcbiAgc2NyZWVuc2hvdHMsXHJcbiAgZmVhdHVyZUdyYXBoaWMsXHJcbiAgYXNzZXRzLFxyXG4gIG9uU2VsZWN0TGFuZyxcclxuICBvblNlbGVjdFBsYXRmb3JtLFxyXG4gIG9uU2VsZWN0SXRlbSxcclxuICBvbkFkZFNjcmVlbnNob3QsXHJcbiAgb25EZWxldGVTY3JlZW5zaG90LFxyXG4gIG9uU3dpdGNoUHJvamVjdCxcclxuICBvblNob3dQcm9qZWN0TW9kYWwsXHJcbiAgb25HZW5lcmF0ZSxcclxuICBvbkFkZExhbmd1YWdlLFxyXG4gIG9uQ29weVBsYXRmb3JtQ29uZmlnLFxyXG4gIG9uU2hvd1RoZW1lRWRpdG9yLFxyXG4gIG9uU2hvd01lZGlhTWFuYWdlcixcclxuICBnZW5lcmF0aW5nLFxyXG4gIGxhc3RHZW5lcmF0ZWQsXHJcbiAgb25WaWV3TGFzdEdlbmVyYXRlZCxcclxufTogU2lkZWJhclByb3BzKSB7XHJcbiAgY29uc3QgW2NvbmZpcm1EZWxldGVJZCwgc2V0Q29uZmlybURlbGV0ZUlkXSA9IHVzZVN0YXRlPHN0cmluZyB8IG51bGw+KG51bGwpO1xyXG4gIGNvbnN0IGN1cnJlbnRQcm9qZWN0SW5mbyA9IHByb2plY3RzLmZpbmQocCA9PiBwLmlkID09PSBjdXJyZW50UHJvamVjdCk7XHJcbiAgY29uc3QgbGFuZ3VhZ2VzID0gY29uZmlnLmxhbmd1YWdlcyB8fCBbXTtcclxuICBjb25zdCBhc3NldENvdW50ID0gYXNzZXRzID8gYXNzZXRzLnNjcmVlbnNob3RzLmxlbmd0aCArIGFzc2V0cy5tYXNjb3RzLmxlbmd0aCArIGFzc2V0cy5pY29ucy5sZW5ndGggOiAwO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzcz1cInctNzIgYmctemluYy05MDAgYm9yZGVyLXIgYm9yZGVyLXppbmMtODAwIGZsZXggZmxleC1jb2xcIj5cclxuICAgICAgey8qIFByb2plY3QgSGVhZGVyICovfVxyXG4gICAgICA8ZGl2IGNsYXNzPVwicC00IGJvcmRlci1iIGJvcmRlci16aW5jLTgwMFwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiBtYi0zXCI+XHJcbiAgICAgICAgICA8aDEgY2xhc3M9XCJ0ZXh0LWxnIGZvbnQtYm9sZCBmbGV4LTEgdHJ1bmNhdGVcIj5cclxuICAgICAgICAgICAge2N1cnJlbnRQcm9qZWN0SW5mbz8ubmFtZSB8fCAnU2NyZWVuc2hvdCBFZGl0b3InfVxyXG4gICAgICAgICAgPC9oMT5cclxuICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgb25DbGljaz17b25TaG93UHJvamVjdE1vZGFsfVxyXG4gICAgICAgICAgICBjbGFzcz1cInAtMiBob3ZlcjpiZy16aW5jLTgwMCByb3VuZGVkXCJcclxuICAgICAgICAgICAgdGl0bGU9XCJNYW5hZ2UgUHJvamVjdHNcIlxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhLXNvbGlkIGZhLWZvbGRlciB0ZXh0LXppbmMtNDAwXCIgLz5cclxuICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICB7LyogUHJvamVjdCBTZWxlY3RvciAqL31cclxuICAgICAgICA8c2VsZWN0XHJcbiAgICAgICAgICB2YWx1ZT17Y3VycmVudFByb2plY3QgPz8gJyd9XHJcbiAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IG9uU3dpdGNoUHJvamVjdCgoZS50YXJnZXQgYXMgSFRNTFNlbGVjdEVsZW1lbnQpLnZhbHVlKX1cclxuICAgICAgICAgIGNsYXNzPVwidy1mdWxsIHB4LTMgcHktMiByb3VuZGVkIHRleHQtc20gYmctemluYy04MDAgYm9yZGVyIGJvcmRlci16aW5jLTcwMFwiXHJcbiAgICAgICAgPlxyXG4gICAgICAgICAge3Byb2plY3RzLm1hcCgocCkgPT4gKFxyXG4gICAgICAgICAgICA8b3B0aW9uIGtleT17cC5pZH0gdmFsdWU9e3AuaWR9PlxyXG4gICAgICAgICAgICAgIHtwLm5hbWV9XHJcbiAgICAgICAgICAgIDwvb3B0aW9uPlxyXG4gICAgICAgICAgKSl9XHJcbiAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgey8qIExhbmd1YWdlIFRhYnMgKi99XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJweC00IHB0LTMgcGItMiBib3JkZXItYiBib3JkZXItemluYy04MDBcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleCBnYXAtMSBmbGV4LXdyYXBcIj5cclxuICAgICAgICAgIHtsYW5ndWFnZXMubWFwKChsYW5nKSA9PiAoXHJcbiAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICBrZXk9e2xhbmcubGFuZ3VhZ2V9XHJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25TZWxlY3RMYW5nKGxhbmcubGFuZ3VhZ2UpfVxyXG4gICAgICAgICAgICAgIGNsYXNzPXtgcHgtMyBweS0xLjUgcm91bmRlZCB0ZXh0LXhzIHVwcGVyY2FzZSBmb250LW1lZGl1bSAke1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRMYW5nID09PSBsYW5nLmxhbmd1YWdlXHJcbiAgICAgICAgICAgICAgICAgID8gJ2JnLWluZGlnby02MDAgdGV4dC13aGl0ZSdcclxuICAgICAgICAgICAgICAgICAgOiAnYmctemluYy04MDAgdGV4dC16aW5jLTQwMCBob3ZlcjpiZy16aW5jLTcwMCdcclxuICAgICAgICAgICAgICB9YH1cclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIHtsYW5nLmxhbmd1YWdlfVxyXG4gICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICkpfVxyXG4gICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc3QgbGFuZyA9IHByb21wdCgnRW50ZXIgbGFuZ3VhZ2UgY29kZSAoZS5nLiwgZnIsIGRlLCBlcyk6Jyk7XHJcbiAgICAgICAgICAgICAgaWYgKGxhbmcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvcHlGcm9tID0gY29uZmlybSgnQ29weSBzY3JlZW5zaG90cyBmcm9tIGN1cnJlbnQgbGFuZ3VhZ2U/JykgPyBzZWxlY3RlZExhbmcgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgb25BZGRMYW5ndWFnZShsYW5nLCBjb3B5RnJvbSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICBjbGFzcz1cInB4LTIgcHktMS41IHRleHQteHMgYmctemluYy04MDAgaG92ZXI6YmctemluYy03MDAgcm91bmRlZFwiXHJcbiAgICAgICAgICAgIHRpdGxlPVwiQWRkIExhbmd1YWdlXCJcclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYS1zb2xpZCBmYS1wbHVzXCIgLz5cclxuICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIHsvKiBQbGF0Zm9ybSBUYWJzICovfVxyXG4gICAgICA8ZGl2IGNsYXNzPVwicHgtNCBwdC0zIHBiLTIgYm9yZGVyLWIgYm9yZGVyLXppbmMtODAwXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImZsZXggZ2FwLTJcIj5cclxuICAgICAgICAgIHsoWydhbmRyb2lkJywgJ2lvcyddIGFzIGNvbnN0KS5tYXAoKHBsYXRmb3JtKSA9PiAoXHJcbiAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICBrZXk9e3BsYXRmb3JtfVxyXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9uU2VsZWN0UGxhdGZvcm0ocGxhdGZvcm0pfVxyXG4gICAgICAgICAgICAgIGNsYXNzPXtgZmxleC0xIHB5LTIgcm91bmRlZCB0ZXh0LXNtIGZvbnQtbWVkaXVtIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGdhcC0yICR7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RlZFBsYXRmb3JtID09PSBwbGF0Zm9ybVxyXG4gICAgICAgICAgICAgICAgICA/ICdiZy1pbmRpZ28tNjAwIHRleHQtd2hpdGUnXHJcbiAgICAgICAgICAgICAgICAgIDogJ2JnLXppbmMtODAwIHRleHQtemluYy00MDAgaG92ZXI6YmctemluYy03MDAnXHJcbiAgICAgICAgICAgICAgfWB9XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICA8aSBjbGFzcz17YGZhLWJyYW5kcyBmYS0ke3BsYXRmb3JtID09PSAnaW9zJyA/ICdhcHBsZScgOiAnYW5kcm9pZCd9YH0gLz5cclxuICAgICAgICAgICAgICB7cGxhdGZvcm0gPT09ICdpb3MnID8gJ2lPUycgOiAnQW5kcm9pZCd9XHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgKSl9XHJcbiAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcclxuICAgICAgICAgICAgICBjb25zdCBzb3VyY2VQbGF0Zm9ybSA9IHNlbGVjdGVkUGxhdGZvcm07XHJcbiAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0UGxhdGZvcm0gPSBzb3VyY2VQbGF0Zm9ybSA9PT0gJ2FuZHJvaWQnID8gJ2lvcycgOiAnYW5kcm9pZCc7XHJcbiAgICAgICAgICAgICAgaWYgKGNvbmZpcm0oYENvcHkgYWxsICR7c291cmNlUGxhdGZvcm19IHNjcmVlbnNob3RzIHRvICR7dGFyZ2V0UGxhdGZvcm19PyBUaGlzIHdpbGwgcmVwbGFjZSBleGlzdGluZyAke3RhcmdldFBsYXRmb3JtfSBzY3JlZW5zaG90cy5gKSkge1xyXG4gICAgICAgICAgICAgICAgb25Db3B5UGxhdGZvcm1Db25maWcoc291cmNlUGxhdGZvcm0sIHRhcmdldFBsYXRmb3JtKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgIGNsYXNzPVwicHgtMiBweS0xIHRleHQteHMgYmctemluYy04MDAgaG92ZXI6YmctemluYy03MDAgcm91bmRlZFwiXHJcbiAgICAgICAgICAgIHRpdGxlPXtgQ29weSAke3NlbGVjdGVkUGxhdGZvcm19IHNjcmVlbnNob3RzIHRvICR7c2VsZWN0ZWRQbGF0Zm9ybSA9PT0gJ2FuZHJvaWQnID8gJ2lPUycgOiAnQW5kcm9pZCd9YH1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYS1zb2xpZCBmYS1jbG9uZVwiIC8+XHJcbiAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICB7LyogU2NyZWVuc2hvdCBMaXN0ICovfVxyXG4gICAgICA8ZGl2IGNsYXNzPVwiZmxleC0xIG92ZXJmbG93LXktYXV0byBwLTQgc3BhY2UteS0yXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInRleHQteHMgdGV4dC16aW5jLTUwMCB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXIgbWItMlwiPlNjcmVlbnNob3RzPC9kaXY+XHJcblxyXG4gICAgICAgIHtzY3JlZW5zaG90cy5tYXAoKHNjcmVlbnNob3QsIGluZGV4KSA9PiAoXHJcbiAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgIGtleT17c2NyZWVuc2hvdC5pZH1cclxuICAgICAgICAgICAgY2xhc3M9e2BwLTMgcm91bmRlZCBib3JkZXIgJHtcclxuICAgICAgICAgICAgICBzZWxlY3RlZEl0ZW0/LnR5cGUgPT09ICdzY3JlZW5zaG90JyAmJiBzZWxlY3RlZEl0ZW0uaWQgPT09IHNjcmVlbnNob3QuaWRcclxuICAgICAgICAgICAgICAgID8gJ2JnLWluZGlnby05MDAvNTAgYm9yZGVyLWluZGlnby01MDAnXHJcbiAgICAgICAgICAgICAgICA6ICdiZy16aW5jLTgwMC81MCBib3JkZXItdHJhbnNwYXJlbnQgaG92ZXI6YmctemluYy04MDAnXHJcbiAgICAgICAgICAgIH1gfVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICB7Y29uZmlybURlbGV0ZUlkID09PSBzY3JlZW5zaG90LmlkID8gKFxyXG4gICAgICAgICAgICAgIC8vIElubGluZSBkZWxldGUgY29uZmlybWF0aW9uXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cInRleHQtc20gdGV4dC1yZWQtNDAwIG1iLTJcIj5EZWxldGUgdGhpcyBzY3JlZW5zaG90PzwvcD5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4IGdhcC0yIGp1c3RpZnktY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBvbkRlbGV0ZVNjcmVlbnNob3Qoc2NyZWVuc2hvdC5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICBzZXRDb25maXJtRGVsZXRlSWQobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInB4LTMgcHktMSBiZy1yZWQtNjAwIGhvdmVyOmJnLXJlZC01MDAgcm91bmRlZCB0ZXh0LXNtXCJcclxuICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIERlbGV0ZVxyXG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldENvbmZpcm1EZWxldGVJZChudWxsKX1cclxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInB4LTMgcHktMSBiZy16aW5jLTYwMCBob3ZlcjpiZy16aW5jLTUwMCByb3VuZGVkIHRleHQtc21cIlxyXG4gICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgQ2FuY2VsXHJcbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgLy8gTm9ybWFsIHZpZXdcclxuICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvblNlbGVjdEl0ZW0oeyB0eXBlOiAnc2NyZWVuc2hvdCcsIGlkOiBzY3JlZW5zaG90LmlkIH0pfVxyXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJmbGV4IGp1c3RpZnktYmV0d2VlbiBpdGVtcy1zdGFydCBnYXAtMiBjdXJzb3ItcG9pbnRlclwiXHJcbiAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1pbi13LTAgZmxleC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtemluYy01MDAgbWItMVwiPiN7aW5kZXggKyAxfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9udC1tZWRpdW0gdGV4dC1zbSB0cnVuY2F0ZVwiPntzY3JlZW5zaG90LmhlYWRsaW5lIHx8IGBTY3JlZW5zaG90ICR7aW5kZXggKyAxfWB9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIHtzY3JlZW5zaG90LnN1YnRpdGxlICYmIChcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dC14cyB0ZXh0LXppbmMtNDAwIHRydW5jYXRlXCI+e3NjcmVlbnNob3Quc3VidGl0bGV9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldENvbmZpcm1EZWxldGVJZChzY3JlZW5zaG90LmlkKTtcclxuICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgY2xhc3M9XCJ0ZXh0LXppbmMtNTAwIGhvdmVyOnRleHQtcmVkLTQwMCB0ZXh0LWxnIGZsZXgtc2hyaW5rLTBcIlxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhLXNvbGlkIGZhLXhtYXJrXCIgLz5cclxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKSl9XHJcblxyXG4gICAgICAgIDxidXR0b25cclxuICAgICAgICAgIG9uQ2xpY2s9e29uQWRkU2NyZWVuc2hvdH1cclxuICAgICAgICAgIGNsYXNzPVwidy1mdWxsIHB5LTIgdGV4dC14cyBiZy16aW5jLTgwMCByb3VuZGVkIGhvdmVyOmJnLXppbmMtNzAwIGJvcmRlciBib3JkZXItZGFzaGVkIGJvcmRlci16aW5jLTYwMFwiXHJcbiAgICAgICAgPlxyXG4gICAgICAgICAgPGkgY2xhc3M9XCJmYS1zb2xpZCBmYS1wbHVzIG1yLTFcIiAvPiBBZGQgU2NyZWVuc2hvdFxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG5cclxuICAgICAgICB7LyogRmVhdHVyZSBHcmFwaGljIChBbmRyb2lkIG9ubHkpICovfVxyXG4gICAgICAgIHtzZWxlY3RlZFBsYXRmb3JtID09PSAnYW5kcm9pZCcgJiYgKFxyXG4gICAgICAgICAgPD5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRleHQteHMgdGV4dC16aW5jLTUwMCB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXIgbXQtNCBtYi0yXCI+RmVhdHVyZSBHcmFwaGljPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvblNlbGVjdEl0ZW0oeyB0eXBlOiAnZmVhdHVyZS1ncmFwaGljJyB9KX1cclxuICAgICAgICAgICAgICBjbGFzcz17YHAtMyByb3VuZGVkIGN1cnNvci1wb2ludGVyICR7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RlZEl0ZW0/LnR5cGUgPT09ICdmZWF0dXJlLWdyYXBoaWMnXHJcbiAgICAgICAgICAgICAgICAgID8gJ2JnLWluZGlnby02MDAvMjAgYm9yZGVyIGJvcmRlci1pbmRpZ28tNTAwLzUwJ1xyXG4gICAgICAgICAgICAgICAgICA6ICdiZy16aW5jLTgwMC81MCBob3ZlcjpiZy16aW5jLTgwMCBib3JkZXIgYm9yZGVyLXRyYW5zcGFyZW50J1xyXG4gICAgICAgICAgICAgIH1gfVxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRleHQtc20gZm9udC1tZWRpdW1cIj57ZmVhdHVyZUdyYXBoaWM/LmhlYWRsaW5lIHx8ICdGZWF0dXJlIEdyYXBoaWMnfTwvZGl2PlxyXG4gICAgICAgICAgICAgIHtmZWF0dXJlR3JhcGhpYz8uc3VidGl0bGUgJiYgKFxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRleHQteHMgdGV4dC16aW5jLTUwMCB0cnVuY2F0ZVwiPntmZWF0dXJlR3JhcGhpYy5zdWJ0aXRsZX08L2Rpdj5cclxuICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvPlxyXG4gICAgICAgICl9XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgey8qIFRoZW1lICYgQ29sb3JzICovfVxyXG4gICAgICA8ZGl2IGNsYXNzPVwicC0zIGJvcmRlci10IGJvcmRlci16aW5jLTgwMFwiPlxyXG4gICAgICAgIDxidXR0b25cclxuICAgICAgICAgIG9uQ2xpY2s9e29uU2hvd1RoZW1lRWRpdG9yfVxyXG4gICAgICAgICAgY2xhc3M9XCJ3LWZ1bGwgcC0zIHJvdW5kZWQgYmctemluYy04MDAvNTAgaG92ZXI6YmctemluYy04MDAgYm9yZGVyIGJvcmRlci16aW5jLTcwMCB0ZXh0LWxlZnQgZ3JvdXBcIlxyXG4gICAgICAgID5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW5cIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zXCI+XHJcbiAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYS1zb2xpZCBmYS1wYWxldHRlIHRleHQtcHVycGxlLTQwMFwiIC8+XHJcbiAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LXNtIGZvbnQtbWVkaXVtXCI+VGhlbWUgJiBDb2xvcnM8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtemluYy01MDBcIj5QYWxldHRlLCBncmFkaWVudHMsIGZvbnRzPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhLXNvbGlkIGZhLWNoZXZyb24tcmlnaHQgdGV4dC16aW5jLTYwMCBncm91cC1ob3Zlcjp0ZXh0LXppbmMtNDAwIHRleHQteHNcIiAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9idXR0b24+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgey8qIE1lZGlhIExpYnJhcnkgKi99XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJwLTMgYm9yZGVyLXQgYm9yZGVyLXppbmMtODAwXCI+XHJcbiAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgb25DbGljaz17b25TaG93TWVkaWFNYW5hZ2VyfVxyXG4gICAgICAgICAgY2xhc3M9XCJ3LWZ1bGwgcC0zIHJvdW5kZWQgYmctemluYy04MDAvNTAgaG92ZXI6YmctemluYy04MDAgYm9yZGVyIGJvcmRlci16aW5jLTcwMCB0ZXh0LWxlZnQgZ3JvdXBcIlxyXG4gICAgICAgID5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW5cIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zXCI+XHJcbiAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYS1zb2xpZCBmYS1pbWFnZXMgdGV4dC1pbmRpZ28tNDAwXCIgLz5cclxuICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRleHQtc20gZm9udC1tZWRpdW1cIj5NZWRpYSBMaWJyYXJ5PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dC14cyB0ZXh0LXppbmMtNTAwXCI+e2Fzc2V0Q291bnR9IGZpbGVzPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhLXNvbGlkIGZhLWNoZXZyb24tcmlnaHQgdGV4dC16aW5jLTYwMCBncm91cC1ob3Zlcjp0ZXh0LXppbmMtNDAwIHRleHQteHNcIiAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9idXR0b24+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgey8qIEdlbmVyYXRlIEJ1dHRvbiAqL31cclxuICAgICAgPGRpdiBjbGFzcz1cInAtNCBib3JkZXItdCBib3JkZXItemluYy04MDAgc3BhY2UteS0yXCI+XHJcbiAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgb25DbGljaz17b25HZW5lcmF0ZX1cclxuICAgICAgICAgIGRpc2FibGVkPXtnZW5lcmF0aW5nfVxyXG4gICAgICAgICAgY2xhc3M9e2B3LWZ1bGwgcHktMyByb3VuZGVkIGZvbnQtbWVkaXVtIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGdhcC0yICR7XHJcbiAgICAgICAgICAgIGdlbmVyYXRpbmdcclxuICAgICAgICAgICAgICA/ICdiZy16aW5jLTcwMCB0ZXh0LXppbmMtNDAwIGN1cnNvci1ub3QtYWxsb3dlZCdcclxuICAgICAgICAgICAgICA6ICdiZy1pbmRpZ28tNjAwIGhvdmVyOmJnLWluZGlnby01MDAgdGV4dC13aGl0ZSdcclxuICAgICAgICAgIH1gfVxyXG4gICAgICAgID5cclxuICAgICAgICAgIHtnZW5lcmF0aW5nID8gKFxyXG4gICAgICAgICAgICA8PlxyXG4gICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEtc29saWQgZmEtc3Bpbm5lciBmYS1zcGluXCIgLz5cclxuICAgICAgICAgICAgICBHZW5lcmF0aW5nLi4uXHJcbiAgICAgICAgICAgIDwvPlxyXG4gICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgPD5cclxuICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhLXNvbGlkIGZhLXdhbmQtbWFnaWMtc3BhcmtsZXNcIiAvPlxyXG4gICAgICAgICAgICAgIEdlbmVyYXRlIEFsbFxyXG4gICAgICAgICAgICA8Lz5cclxuICAgICAgICAgICl9XHJcbiAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAge2xhc3RHZW5lcmF0ZWQgJiYgb25WaWV3TGFzdEdlbmVyYXRlZCAmJiAoXHJcbiAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e29uVmlld0xhc3RHZW5lcmF0ZWR9XHJcbiAgICAgICAgICAgIGNsYXNzPVwidy1mdWxsIHB5LTIgYmctemluYy03MDAgaG92ZXI6YmctemluYy02MDAgcm91bmRlZCB0ZXh0LXNtIGZvbnQtbWVkaXVtIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGdhcC0yXCJcclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYS1zb2xpZCBmYS1pbWFnZXNcIiAvPlxyXG4gICAgICAgICAgICBWaWV3IExhc3QgUmVzdWx0cyAoe2xhc3RHZW5lcmF0ZWQucmVzdWx0cy5sZW5ndGh9KVxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgKX1cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsICIvKipcclxuICogUHJldmlldyBDb21wb25lbnRcclxuICogXHJcbiAqIFJlc3BvbnNpdmUgaWZyYW1lIHByZXZpZXcgb2Ygc2NyZWVuc2hvdHMgYW5kIGZlYXR1cmUgZ3JhcGhpY3MuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCwgdXNlUmVmIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuXHJcbmludGVyZmFjZSBQcmV2aWV3UHJvcHMge1xyXG4gIHVybDogc3RyaW5nIHwgbnVsbDtcclxuICB0eXBlOiAnc2NyZWVuc2hvdCcgfCAnZmVhdHVyZS1ncmFwaGljJztcclxuICB2ZXJzaW9uOiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBQcmV2aWV3KHsgdXJsLCB0eXBlID0gJ3NjcmVlbnNob3QnLCB2ZXJzaW9uIH06IFByZXZpZXdQcm9wcykge1xyXG4gIGNvbnN0IGNvbnRhaW5lclJlZiA9IHVzZVJlZjxIVE1MRGl2RWxlbWVudD4obnVsbCk7XHJcbiAgY29uc3QgaWZyYW1lUmVmID0gdXNlUmVmPEhUTUxJRnJhbWVFbGVtZW50PihudWxsKTtcclxuICBjb25zdCBbc2NhbGUsIHNldFNjYWxlXSA9IHVzZVN0YXRlKDAuMyk7XHJcblxyXG4gIC8vIENhbGN1bGF0ZSBzY2FsZSB0byBmaXQgY29udGFpbmVyIC0gdXNlIFJlc2l6ZU9ic2VydmVyIGZvciByZXNwb25zaXZlIHVwZGF0ZXNcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKCFjb250YWluZXJSZWYuY3VycmVudCB8fCAhdXJsKSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgY2FsY3VsYXRlU2NhbGUgPSAoKSA9PiB7XHJcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGNvbnRhaW5lclJlZi5jdXJyZW50O1xyXG4gICAgICBpZiAoIWNvbnRhaW5lcikgcmV0dXJuO1xyXG5cclxuICAgICAgLy8gR2V0IGNvbnRhaW5lciBkaW1lbnNpb25zXHJcbiAgICAgIGNvbnN0IHJlY3QgPSBjb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgIGNvbnN0IGNvbnRhaW5lcldpZHRoID0gcmVjdC53aWR0aCAtIDQwO1xyXG4gICAgICBjb25zdCBjb250YWluZXJIZWlnaHQgPSByZWN0LmhlaWdodCAtIDQwO1xyXG5cclxuICAgICAgLy8gU2tpcCBpZiBjb250YWluZXIgaGFzIG5vIHNpemUgeWV0XHJcbiAgICAgIGlmIChjb250YWluZXJXaWR0aCA8PSAwIHx8IGNvbnRhaW5lckhlaWdodCA8PSAwKSByZXR1cm47XHJcblxyXG4gICAgICBsZXQgY29udGVudFdpZHRoOiBudW1iZXIsIGNvbnRlbnRIZWlnaHQ6IG51bWJlcjtcclxuICAgICAgaWYgKHR5cGUgPT09ICdmZWF0dXJlLWdyYXBoaWMnKSB7XHJcbiAgICAgICAgY29udGVudFdpZHRoID0gMTAyNDtcclxuICAgICAgICBjb250ZW50SGVpZ2h0ID0gNTAwO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnRlbnRXaWR0aCA9IDEyNDI7XHJcbiAgICAgICAgY29udGVudEhlaWdodCA9IDI2ODg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHNjYWxlWCA9IGNvbnRhaW5lcldpZHRoIC8gY29udGVudFdpZHRoO1xyXG4gICAgICBjb25zdCBzY2FsZVkgPSBjb250YWluZXJIZWlnaHQgLyBjb250ZW50SGVpZ2h0O1xyXG4gICAgICAvLyBVc2Ugd2hpY2hldmVyIHNjYWxlIGZpdHMsIG5vIGFyYml0cmFyeSBjYXBcclxuICAgICAgY29uc3QgbmV3U2NhbGUgPSBNYXRoLm1pbihzY2FsZVgsIHNjYWxlWSk7XHJcbiAgICAgIHNldFNjYWxlKE1hdGgubWF4KDAuMSwgbmV3U2NhbGUpKTsgLy8gRW5zdXJlIG1pbmltdW0gdmlzaWJpbGl0eVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBDYWxjdWxhdGUgaW1tZWRpYXRlbHkgYW5kIGFsc28gYWZ0ZXIgYSBzaG9ydCBkZWxheSBmb3IgbGF5b3V0IHNldHRsaW5nXHJcbiAgICBjYWxjdWxhdGVTY2FsZSgpO1xyXG4gICAgY29uc3QgdGltZW91dCA9IHNldFRpbWVvdXQoY2FsY3VsYXRlU2NhbGUsIDEwMCk7XHJcblxyXG4gICAgLy8gUmVjYWxjdWxhdGUgb24gcmVzaXplXHJcbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBSZXNpemVPYnNlcnZlcihjYWxjdWxhdGVTY2FsZSk7XHJcbiAgICBvYnNlcnZlci5vYnNlcnZlKGNvbnRhaW5lclJlZi5jdXJyZW50KTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XHJcbiAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcclxuICAgIH07XHJcbiAgfSwgW3VybCwgdHlwZV0pO1xyXG5cclxuICAvLyBSZWZyZXNoIGlmcmFtZSB3aGVuIHZlcnNpb24gY2hhbmdlcyAoY29uZmlnIHdhcyB1cGRhdGVkKVxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoaWZyYW1lUmVmLmN1cnJlbnQgJiYgdXJsKSB7XHJcbiAgICAgIC8vIEZvcmNlIHJlbG9hZCBieSB1cGRhdGluZyBzcmMgd2l0aCBjYWNoZS1idXN0aW5nIHRpbWVzdGFtcFxyXG4gICAgICBpZnJhbWVSZWYuY3VycmVudC5zcmMgPSB1cmwgKyAnP3Y9JyArIHZlcnNpb24gKyAnJnQ9JyArIERhdGUubm93KCk7XHJcbiAgICB9XHJcbiAgfSwgW3ZlcnNpb24sIHVybF0pO1xyXG5cclxuICBpZiAoIXVybCkge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBjbGFzcz1cInRleHQtemluYy01MDBcIj5cclxuICAgICAgICBObyBwcmV2aWV3IGF2YWlsYWJsZVxyXG4gICAgICA8L2Rpdj5cclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBjb25zdCB3aWR0aCA9IHR5cGUgPT09ICdmZWF0dXJlLWdyYXBoaWMnID8gMTAyNCA6IDEyNDI7XHJcbiAgY29uc3QgaGVpZ2h0ID0gdHlwZSA9PT0gJ2ZlYXR1cmUtZ3JhcGhpYycgPyA1MDAgOiAyNjg4O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICByZWY9e2NvbnRhaW5lclJlZn1cclxuICAgICAgY2xhc3M9XCJ3LWZ1bGwgaC1mdWxsIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyXCJcclxuICAgID5cclxuICAgICAgPGRpdlxyXG4gICAgICAgIGNsYXNzPVwicmVsYXRpdmUgYmctYmxhY2sgcm91bmRlZC1sZyBvdmVyZmxvdy1oaWRkZW4gc2hhZG93LTJ4bFwiXHJcbiAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgIHdpZHRoOiB3aWR0aCAqIHNjYWxlICsgJ3B4JyxcclxuICAgICAgICAgIGhlaWdodDogaGVpZ2h0ICogc2NhbGUgKyAncHgnLFxyXG4gICAgICAgIH19XHJcbiAgICAgID5cclxuICAgICAgICA8aWZyYW1lXHJcbiAgICAgICAgICByZWY9e2lmcmFtZVJlZn1cclxuICAgICAgICAgIHNyYz17dXJsICsgJz92PScgKyB2ZXJzaW9uICsgJyZ0PScgKyBEYXRlLm5vdygpfVxyXG4gICAgICAgICAgY2xhc3M9XCJwcmV2aWV3LWlmcmFtZVwiXHJcbiAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICB3aWR0aDogd2lkdGggKyAncHgnLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCArICdweCcsXHJcbiAgICAgICAgICAgIHRyYW5zZm9ybTogYHNjYWxlKCR7c2NhbGV9KWAsXHJcbiAgICAgICAgICAgIHRyYW5zZm9ybU9yaWdpbjogJ3RvcCBsZWZ0JyxcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsICIvKipcclxuICogTnVtYmVySW5wdXQgQ29tcG9uZW50XHJcbiAqIFxyXG4gKiBOdW1iZXIgaW5wdXQgd2l0aCBpbmNyZW1lbnQvZGVjcmVtZW50IGJ1dHRvbnMuXHJcbiAqL1xyXG5cclxuaW50ZXJmYWNlIE51bWJlcklucHV0UHJvcHMge1xyXG4gIHZhbHVlOiBudW1iZXI7XHJcbiAgb25DaGFuZ2U6ICh2YWx1ZTogbnVtYmVyKSA9PiB2b2lkO1xyXG4gIG1pbj86IG51bWJlcjtcclxuICBtYXg/OiBudW1iZXI7XHJcbiAgc3RlcD86IG51bWJlcjtcclxuICBjbGFzc05hbWU/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBOdW1iZXJJbnB1dCh7XHJcbiAgdmFsdWUsXHJcbiAgb25DaGFuZ2UsXHJcbiAgbWluID0gMCxcclxuICBtYXggPSAxMDAsXHJcbiAgc3RlcCA9IDEsXHJcbiAgY2xhc3NOYW1lID0gJycsXHJcbn06IE51bWJlcklucHV0UHJvcHMpIHtcclxuICBjb25zdCBkZWNyZW1lbnQgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBuZXdWYWwgPSBNYXRoLm1heChtaW4sICh2YWx1ZSB8fCAwKSAtIHN0ZXApO1xyXG4gICAgb25DaGFuZ2UobmV3VmFsKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBpbmNyZW1lbnQgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBuZXdWYWwgPSBNYXRoLm1pbihtYXgsICh2YWx1ZSB8fCAwKSArIHN0ZXApO1xyXG4gICAgb25DaGFuZ2UobmV3VmFsKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBoYW5kbGVJbnB1dCA9IChlOiBFdmVudCkgPT4ge1xyXG4gICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgIGNvbnN0IG5ld1ZhbCA9IE51bWJlcih0YXJnZXQudmFsdWUpO1xyXG4gICAgaWYgKCFpc05hTihuZXdWYWwpKSB7XHJcbiAgICAgIG9uQ2hhbmdlKE1hdGgubWF4KG1pbiwgTWF0aC5taW4obWF4LCBuZXdWYWwpKSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3M9e2BmbGV4IGl0ZW1zLXN0cmV0Y2ggaC04ICR7Y2xhc3NOYW1lfWB9PlxyXG4gICAgICA8YnV0dG9uXHJcbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgb25DbGljaz17ZGVjcmVtZW50fVxyXG4gICAgICAgIGNsYXNzPVwicHgtMiBiZy16aW5jLTcwMCBob3ZlcjpiZy16aW5jLTYwMCByb3VuZGVkLWwgdGV4dC16aW5jLTMwMCBob3Zlcjp0ZXh0LXdoaXRlIHRyYW5zaXRpb24tY29sb3JzIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyXCJcclxuICAgICAgPlxyXG4gICAgICAgIDxpIGNsYXNzPVwiZmEtc29saWQgZmEtbWludXMgdGV4dC14c1wiIC8+XHJcbiAgICAgIDwvYnV0dG9uPlxyXG4gICAgICA8aW5wdXRcclxuICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICB2YWx1ZT17dmFsdWV9XHJcbiAgICAgICAgb25JbnB1dD17aGFuZGxlSW5wdXR9XHJcbiAgICAgICAgbWluPXttaW59XHJcbiAgICAgICAgbWF4PXttYXh9XHJcbiAgICAgICAgc3RlcD17c3RlcH1cclxuICAgICAgICBjbGFzcz1cInctZnVsbCBweC0yIHRleHQtc20gdGV4dC1jZW50ZXIgYmctemluYy04MDAgYm9yZGVyLXkgYm9yZGVyLXppbmMtNzAwIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpib3JkZXItaW5kaWdvLTUwMCBbYXBwZWFyYW5jZTp0ZXh0ZmllbGRdIFsmOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uXTphcHBlYXJhbmNlLW5vbmUgWyY6Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b25dOmFwcGVhcmFuY2Utbm9uZVwiXHJcbiAgICAgIC8+XHJcbiAgICAgIDxidXR0b25cclxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICBvbkNsaWNrPXtpbmNyZW1lbnR9XHJcbiAgICAgICAgY2xhc3M9XCJweC0yIGJnLXppbmMtNzAwIGhvdmVyOmJnLXppbmMtNjAwIHJvdW5kZWQtciB0ZXh0LXppbmMtMzAwIGhvdmVyOnRleHQtd2hpdGUgdHJhbnNpdGlvbi1jb2xvcnMgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcIlxyXG4gICAgICA+XHJcbiAgICAgICAgPGkgY2xhc3M9XCJmYS1zb2xpZCBmYS1wbHVzIHRleHQteHNcIiAvPlxyXG4gICAgICA8L2J1dHRvbj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwgIi8qKlxyXG4gKiBDb2xvcklucHV0IENvbXBvbmVudFxyXG4gKiBcclxuICogQ29sb3IgcGlja2VyIHdpdGggc3dhdGNoLCBoZXggaW5wdXQsIGFuZCBwYWxldHRlIHByZXNldHMuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCwgdXNlUmVmIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHR5cGUgeyBQYWxldHRlIH0gZnJvbSAnLi4vLi4vdHlwZXMudHMnO1xyXG5cclxuaW50ZXJmYWNlIENvbG9ySW5wdXRQcm9wcyB7XHJcbiAgdmFsdWU6IHN0cmluZztcclxuICBvbkNoYW5nZTogKHZhbHVlOiBzdHJpbmcpID0+IHZvaWQ7XHJcbiAgcGFsZXR0ZT86IFBhbGV0dGUgfCBudWxsO1xyXG4gIGNsYXNzTmFtZT86IHN0cmluZztcclxufVxyXG5cclxuY29uc3QgQ09NTU9OX0NPTE9SUyA9IFtcclxuICAnI2ZmZmZmZicsICcjZjVmNWY1JywgJyNkNGQ0ZDQnLCAnI2EzYTNhMycsICcjNzM3MzczJywgJyM1MjUyNTInLCAnIzI2MjYyNicsICcjMDAwMDAwJyxcclxuICAnI2ZlZjJmMicsICcjZmVlMmUyJywgJyNmZWNhY2EnLCAnI2Y4NzE3MScsICcjZWY0NDQ0JywgJyNkYzI2MjYnLCAnI2I5MWMxYycsICcjN2YxZDFkJyxcclxuICAnI2ZlZjljMycsICcjZmVmMDhhJywgJyNmZGUwNDcnLCAnI2ZhY2MxNScsICcjZWFiMzA4JywgJyNjYThhMDQnLCAnI2ExNjIwNycsICcjNzEzZjEyJyxcclxuICAnI2RjZmNlNycsICcjYmJmN2QwJywgJyM4NmVmYWMnLCAnIzRhZGU4MCcsICcjMjJjNTVlJywgJyMxNmEzNGEnLCAnIzE1ODAzZCcsICcjMTQ1MzJkJyxcclxuICAnI2UwZjJmZScsICcjYmFlNmZkJywgJyM3ZGQzZmMnLCAnIzM4YmRmOCcsICcjMGVhNWU5JywgJyMwMjg0YzcnLCAnIzAzNjlhMScsICcjMGM0YTZlJyxcclxuICAnI2VkZTlmZScsICcjZGRkNmZlJywgJyNjNGI1ZmQnLCAnI2E3OGJmYScsICcjOGI1Y2Y2JywgJyM3YzNhZWQnLCAnIzZkMjhkOScsICcjNGMxZDk1JyxcclxuICAnI2ZjZTdmMycsICcjZmJjZmU4JywgJyNmOWE4ZDQnLCAnI2Y0NzJiNicsICcjZWM0ODk5JywgJyNkYjI3NzcnLCAnI2JlMTg1ZCcsICcjOWQxNzRkJyxcclxuXTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBDb2xvcklucHV0KHtcclxuICB2YWx1ZSxcclxuICBvbkNoYW5nZSxcclxuICBwYWxldHRlID0gbnVsbCxcclxuICBjbGFzc05hbWUgPSAnJyxcclxufTogQ29sb3JJbnB1dFByb3BzKSB7XHJcbiAgY29uc3QgW2lzT3Blbiwgc2V0SXNPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICBjb25zdCBbaGV4SW5wdXQsIHNldEhleElucHV0XSA9IHVzZVN0YXRlKHZhbHVlIHx8ICcjZmZmZmZmJyk7XHJcbiAgY29uc3QgY29udGFpbmVyUmVmID0gdXNlUmVmPEhUTUxEaXZFbGVtZW50PihudWxsKTtcclxuXHJcbiAgLy8gVXBkYXRlIGhleElucHV0IHdoZW4gdmFsdWUgY2hhbmdlcyBleHRlcm5hbGx5XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIHNldEhleElucHV0KHZhbHVlIHx8ICcjZmZmZmZmJyk7XHJcbiAgfSwgW3ZhbHVlXSk7XHJcblxyXG4gIC8vIENsb3NlIGRyb3Bkb3duIHdoZW4gY2xpY2tpbmcgb3V0c2lkZVxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zdCBoYW5kbGVDbGlja091dHNpZGUgPSAoZTogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICBpZiAoY29udGFpbmVyUmVmLmN1cnJlbnQgJiYgIWNvbnRhaW5lclJlZi5jdXJyZW50LmNvbnRhaW5zKGUudGFyZ2V0IGFzIE5vZGUpKSB7XHJcbiAgICAgICAgc2V0SXNPcGVuKGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIGlmIChpc09wZW4pIHtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgaGFuZGxlQ2xpY2tPdXRzaWRlKTtcclxuICAgICAgcmV0dXJuICgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGhhbmRsZUNsaWNrT3V0c2lkZSk7XHJcbiAgICB9XHJcbiAgfSwgW2lzT3Blbl0pO1xyXG5cclxuICBjb25zdCBoYW5kbGVIZXhDaGFuZ2UgPSAoZTogRXZlbnQpID0+IHtcclxuICAgIGNvbnN0IG5ld1ZhbHVlID0gKGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xyXG4gICAgc2V0SGV4SW5wdXQobmV3VmFsdWUpO1xyXG4gICAgLy8gT25seSB1cGRhdGUgaWYgdmFsaWQgaGV4XHJcbiAgICBpZiAoL14jWzAtOUEtRmEtZl17Nn0kLy50ZXN0KG5ld1ZhbHVlKSkge1xyXG4gICAgICBvbkNoYW5nZShuZXdWYWx1ZSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgaGFuZGxlSGV4Qmx1ciA9ICgpID0+IHtcclxuICAgIC8vIFJlc2V0IHRvIGN1cnJlbnQgdmFsdWUgaWYgaW52YWxpZFxyXG4gICAgaWYgKCEvXiNbMC05QS1GYS1mXXs2fSQvLnRlc3QoaGV4SW5wdXQpKSB7XHJcbiAgICAgIHNldEhleElucHV0KHZhbHVlIHx8ICcjZmZmZmZmJyk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgc2VsZWN0Q29sb3IgPSAoY29sb3I6IHN0cmluZykgPT4ge1xyXG4gICAgb25DaGFuZ2UoY29sb3IpO1xyXG4gICAgc2V0SGV4SW5wdXQoY29sb3IpO1xyXG4gICAgc2V0SXNPcGVuKGZhbHNlKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiByZWY9e2NvbnRhaW5lclJlZn0gY2xhc3M9e2ByZWxhdGl2ZSAke2NsYXNzTmFtZX1gfT5cclxuICAgICAgPGRpdiBjbGFzcz1cImZsZXggaXRlbXMtc3RyZXRjaCBoLTggbWluLXctMFwiPlxyXG4gICAgICAgIDxidXR0b25cclxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SXNPcGVuKCFpc09wZW4pfVxyXG4gICAgICAgICAgY2xhc3M9XCJ3LTEwIHJvdW5kZWQtbCBib3JkZXIgYm9yZGVyLXppbmMtNzAwIGhvdmVyOmJvcmRlci16aW5jLTUwMCB0cmFuc2l0aW9uLWNvbG9ycyBmbGV4LXNocmluay0wXCJcclxuICAgICAgICAgIHN0eWxlPXt7IGJhY2tncm91bmRDb2xvcjogdmFsdWUgfHwgJyNmZmZmZmYnIH19XHJcbiAgICAgICAgICB0aXRsZT1cIkNsaWNrIHRvIG9wZW4gY29sb3IgcGlja2VyXCJcclxuICAgICAgICAvPlxyXG4gICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgdHlwZT1cInRleHRcIlxyXG4gICAgICAgICAgdmFsdWU9e2hleElucHV0fVxyXG4gICAgICAgICAgb25JbnB1dD17aGFuZGxlSGV4Q2hhbmdlfVxyXG4gICAgICAgICAgb25CbHVyPXtoYW5kbGVIZXhCbHVyfVxyXG4gICAgICAgICAgbWF4TGVuZ3RoPXs3fVxyXG4gICAgICAgICAgY2xhc3M9XCJmbGV4LTEgbWluLXctMCBweC0yIHRleHQtc20gYmctemluYy04MDAgYm9yZGVyLXkgYm9yZGVyLXIgYm9yZGVyLXppbmMtNzAwIHJvdW5kZWQtciBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6Ym9yZGVyLWluZGlnby01MDAgZm9udC1tb25vIHVwcGVyY2FzZVwiXHJcbiAgICAgICAgICBwbGFjZWhvbGRlcj1cIiNmZmZmZmZcIlxyXG4gICAgICAgIC8+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAge2lzT3BlbiAmJiAoXHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImFic29sdXRlIHotNTAgbXQtMSBwLTMgYmctemluYy04MDAgYm9yZGVyIGJvcmRlci16aW5jLTcwMCByb3VuZGVkLWxnIHNoYWRvdy14bCB3LTY0IGxlZnQtMFwiPlxyXG4gICAgICAgICAge3BhbGV0dGUgJiYgKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWItM1wiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtemluYy01MDAgbWItMS41XCI+UGFsZXR0ZTwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4IGdhcC0xLjVcIj5cclxuICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNlbGVjdENvbG9yKHBhbGV0dGUucHJpbWFyeSl9XHJcbiAgICAgICAgICAgICAgICAgIGNsYXNzPVwiZmxleC0xIGgtOCByb3VuZGVkIGJvcmRlciBib3JkZXItemluYy02MDAgaG92ZXI6Ym9yZGVyLXppbmMtNDAwIHRyYW5zaXRpb24tY29sb3JzXCJcclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgYmFja2dyb3VuZENvbG9yOiBwYWxldHRlLnByaW1hcnkgfX1cclxuICAgICAgICAgICAgICAgICAgdGl0bGU9XCJQcmltYXJ5XCJcclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZWxlY3RDb2xvcihwYWxldHRlLnNlY29uZGFyeSl9XHJcbiAgICAgICAgICAgICAgICAgIGNsYXNzPVwiZmxleC0xIGgtOCByb3VuZGVkIGJvcmRlciBib3JkZXItemluYy02MDAgaG92ZXI6Ym9yZGVyLXppbmMtNDAwIHRyYW5zaXRpb24tY29sb3JzXCJcclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgYmFja2dyb3VuZENvbG9yOiBwYWxldHRlLnNlY29uZGFyeSB9fVxyXG4gICAgICAgICAgICAgICAgICB0aXRsZT1cIlNlY29uZGFyeVwiXHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2VsZWN0Q29sb3IocGFsZXR0ZS5hY2NlbnQpfVxyXG4gICAgICAgICAgICAgICAgICBjbGFzcz1cImZsZXgtMSBoLTggcm91bmRlZCBib3JkZXIgYm9yZGVyLXppbmMtNjAwIGhvdmVyOmJvcmRlci16aW5jLTQwMCB0cmFuc2l0aW9uLWNvbG9yc1wiXHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGJhY2tncm91bmRDb2xvcjogcGFsZXR0ZS5hY2NlbnQgfX1cclxuICAgICAgICAgICAgICAgICAgdGl0bGU9XCJBY2NlbnRcIlxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICApfVxyXG5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtemluYy01MDAgbWItMS41XCI+Q29sb3JzPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJncmlkIGdyaWQtY29scy04IGdhcC0xXCI+XHJcbiAgICAgICAgICAgICAge0NPTU1PTl9DT0xPUlMubWFwKChjb2xvcikgPT4gKFxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2VsZWN0Q29sb3IoY29sb3IpfVxyXG4gICAgICAgICAgICAgICAgICBjbGFzcz17YHctNiBoLTYgcm91bmRlZCBib3JkZXIgdHJhbnNpdGlvbi1jb2xvcnMgJHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvciA9PT0gdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICAgID8gJ2JvcmRlci13aGl0ZSByaW5nLTEgcmluZy13aGl0ZSdcclxuICAgICAgICAgICAgICAgICAgICAgIDogJ2JvcmRlci16aW5jLTYwMCBob3Zlcjpib3JkZXItemluYy00MDAnXHJcbiAgICAgICAgICAgICAgICAgIH1gfVxyXG4gICAgICAgICAgICAgICAgICBzdHlsZT17eyBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yIH19XHJcbiAgICAgICAgICAgICAgICAgIHRpdGxlPXtjb2xvcn1cclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICl9XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsICIvKipcclxuICogU2xpZGVyIENvbXBvbmVudFxyXG4gKiBcclxuICogUmFuZ2Ugc2xpZGVyIHdpdGggbGFiZWwgYW5kIHZhbHVlIGRpc3BsYXkuXHJcbiAqL1xyXG5cclxuaW50ZXJmYWNlIFNsaWRlclByb3BzIHtcclxuICBsYWJlbDogc3RyaW5nO1xyXG4gIHZhbHVlOiBudW1iZXI7XHJcbiAgb25DaGFuZ2U6ICh2YWx1ZTogbnVtYmVyKSA9PiB2b2lkO1xyXG4gIG1pbjogbnVtYmVyO1xyXG4gIG1heDogbnVtYmVyO1xyXG4gIHN0ZXA/OiBudW1iZXI7XHJcbiAgdW5pdD86IHN0cmluZztcclxuICBzaG93VmFsdWU/OiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gU2xpZGVyKHtcclxuICBsYWJlbCxcclxuICB2YWx1ZSxcclxuICBvbkNoYW5nZSxcclxuICBtaW4sXHJcbiAgbWF4LFxyXG4gIHN0ZXAgPSAxLFxyXG4gIHVuaXQgPSAnJyxcclxuICBzaG93VmFsdWUgPSB0cnVlLFxyXG59OiBTbGlkZXJQcm9wcykge1xyXG4gIGNvbnN0IGRpc3BsYXlWYWx1ZSA9XHJcbiAgICB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInXHJcbiAgICAgID8gTnVtYmVyLmlzSW50ZWdlcih2YWx1ZSlcclxuICAgICAgICA/IHZhbHVlXHJcbiAgICAgICAgOiB2YWx1ZS50b0ZpeGVkKHN0ZXAgPCAxID8gMiA6IDApXHJcbiAgICAgIDogdmFsdWU7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyIG1iLTFcIj5cclxuICAgICAgICA8bGFiZWwgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtemluYy01MDBcIj57bGFiZWx9PC9sYWJlbD5cclxuICAgICAgICB7c2hvd1ZhbHVlICYmIChcclxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGV4dC14cyB0ZXh0LXppbmMtNDAwXCI+XHJcbiAgICAgICAgICAgIHtkaXNwbGF5VmFsdWV9XHJcbiAgICAgICAgICAgIHt1bml0fVxyXG4gICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICl9XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8aW5wdXRcclxuICAgICAgICB0eXBlPVwicmFuZ2VcIlxyXG4gICAgICAgIG1pbj17bWlufVxyXG4gICAgICAgIG1heD17bWF4fVxyXG4gICAgICAgIHN0ZXA9e3N0ZXB9XHJcbiAgICAgICAgdmFsdWU9e3ZhbHVlfVxyXG4gICAgICAgIG9uSW5wdXQ9eyhlKSA9PiBvbkNoYW5nZShOdW1iZXIoKGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKSl9XHJcbiAgICAgICAgY2xhc3M9XCJ3LWZ1bGxcIlxyXG4gICAgICAvPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCAiLyoqXHJcbiAqIExhYmVsZWRDb2xvcklucHV0IENvbXBvbmVudFxyXG4gKiBcclxuICogU2ltcGxlIGNvbG9yL2dyYWRpZW50IGlucHV0IHdpdGggbGFiZWwgYW5kIHByZXZpZXcgc3dhdGNoLlxyXG4gKiBTdXBwb3J0cyBhbnkgQ1NTIGNvbG9yIHZhbHVlIChpbmNsdWRpbmcgcmdiYSwgZ3JhZGllbnRzKS5cclxuICovXHJcblxyXG5pbnRlcmZhY2UgTGFiZWxlZENvbG9ySW5wdXRQcm9wcyB7XHJcbiAgbGFiZWw6IHN0cmluZztcclxuICB2YWx1ZTogc3RyaW5nO1xyXG4gIG9uQ2hhbmdlOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZDtcclxuICBwbGFjZWhvbGRlcj86IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIExhYmVsZWRDb2xvcklucHV0KHtcclxuICBsYWJlbCxcclxuICB2YWx1ZSxcclxuICBvbkNoYW5nZSxcclxuICBwbGFjZWhvbGRlciA9ICdyZ2JhKDI1NSwyNTUsMjU1LDAuMTUpJyxcclxufTogTGFiZWxlZENvbG9ySW5wdXRQcm9wcykge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2PlxyXG4gICAgICA8bGFiZWwgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtemluYy01MDAgYmxvY2sgbWItMVwiPntsYWJlbH08L2xhYmVsPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiZmxleCBnYXAtMlwiPlxyXG4gICAgICAgIDxkaXZcclxuICAgICAgICAgIGNsYXNzPVwidy05IGgtOSByb3VuZGVkIGJvcmRlciBib3JkZXItemluYy03MDAgZmxleC1zaHJpbmstMFwiXHJcbiAgICAgICAgICBzdHlsZT17eyBiYWNrZ3JvdW5kOiB2YWx1ZSB8fCBwbGFjZWhvbGRlciB9fVxyXG4gICAgICAgIC8+XHJcbiAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICB0eXBlPVwidGV4dFwiXHJcbiAgICAgICAgICB2YWx1ZT17dmFsdWUgfHwgJyd9XHJcbiAgICAgICAgICBvbklucHV0PXsoZSkgPT4gb25DaGFuZ2UoKGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKX1cclxuICAgICAgICAgIGNsYXNzPVwiZmxleC0xIHB4LTMgcHktMiByb3VuZGVkIHRleHQtc20gZm9udC1tb25vXCJcclxuICAgICAgICAgIHBsYWNlaG9sZGVyPXtwbGFjZWhvbGRlcn1cclxuICAgICAgICAvPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwgIi8qKlxyXG4gKiBJbWFnZVNlbGVjdCBDb21wb25lbnRcclxuICogXHJcbiAqIERyb3Bkb3duIHNlbGVjdG9yIHdpdGggdXBsb2FkIGJ1dHRvbiBmb3Igc2VsZWN0aW5nL3VwbG9hZGluZyBpbWFnZXMuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZVJlZiB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcblxyXG5pbnRlcmZhY2UgSW1hZ2VTZWxlY3RQcm9wcyB7XHJcbiAgdmFsdWU6IHN0cmluZztcclxuICBvbkNoYW5nZTogKHZhbHVlOiBzdHJpbmcpID0+IHZvaWQ7XHJcbiAgb3B0aW9uczogc3RyaW5nW107XHJcbiAgY2F0ZWdvcnk/OiBzdHJpbmc7XHJcbiAgb25Bc3NldHNSZWZyZXNoPzogKCkgPT4gUHJvbWlzZTx2b2lkPjtcclxuICBsYWJlbD86IHN0cmluZztcclxuICBwbGFjZWhvbGRlcj86IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEltYWdlU2VsZWN0KHtcclxuICB2YWx1ZSxcclxuICBvbkNoYW5nZSxcclxuICBvcHRpb25zLFxyXG4gIGNhdGVnb3J5LFxyXG4gIG9uQXNzZXRzUmVmcmVzaCxcclxuICBsYWJlbCxcclxuICBwbGFjZWhvbGRlciA9ICdTZWxlY3QgaW1hZ2UuLi4nLFxyXG59OiBJbWFnZVNlbGVjdFByb3BzKSB7XHJcbiAgY29uc3QgZmlsZUlucHV0UmVmID0gdXNlUmVmPEhUTUxJbnB1dEVsZW1lbnQ+KG51bGwpO1xyXG4gIGNvbnN0IFt1cGxvYWRpbmcsIHNldFVwbG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gIGNvbnN0IGhhbmRsZVVwbG9hZCA9IGFzeW5jIChlOiBFdmVudCkgPT4ge1xyXG4gICAgY29uc3QgZmlsZSA9IChlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS5maWxlcz8uWzBdO1xyXG4gICAgaWYgKCFmaWxlKSByZXR1cm47XHJcblxyXG4gICAgc2V0VXBsb2FkaW5nKHRydWUpO1xyXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpO1xyXG4gICAgZm9ybURhdGEuYXBwZW5kKCdjYXRlZ29yeScsIGNhdGVnb3J5IHx8ICdzY3JlZW5zaG90cycpO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCcvYXBpL2Fzc2V0cy91cGxvYWQnLCB7XHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgYm9keTogZm9ybURhdGEsXHJcbiAgICAgIH0pO1xyXG4gICAgICBpZiAocmVzLm9rKSB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKCk7XHJcbiAgICAgICAgLy8gUmVmcmVzaCBhc3NldHMgbGlzdCBhbmQgc2VsZWN0IHRoZSBuZXcgZmlsZVxyXG4gICAgICAgIGlmIChvbkFzc2V0c1JlZnJlc2gpIGF3YWl0IG9uQXNzZXRzUmVmcmVzaCgpO1xyXG4gICAgICAgIG9uQ2hhbmdlKGRhdGEucGF0aCk7XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdVcGxvYWQgZmFpbGVkOicsIGVycik7XHJcbiAgICB9XHJcbiAgICBzZXRVcGxvYWRpbmcoZmFsc2UpO1xyXG4gICAgaWYgKGZpbGVJbnB1dFJlZi5jdXJyZW50KSB7XHJcbiAgICAgIGZpbGVJbnB1dFJlZi5jdXJyZW50LnZhbHVlID0gJyc7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXY+XHJcbiAgICAgIHtsYWJlbCAmJiA8bGFiZWwgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtemluYy01MDAgYmxvY2sgbWItMVwiPntsYWJlbH08L2xhYmVsPn1cclxuICAgICAgPGRpdiBjbGFzcz1cImZsZXggZ2FwLTJcIj5cclxuICAgICAgICA8c2VsZWN0XHJcbiAgICAgICAgICB2YWx1ZT17dmFsdWUgfHwgJyd9XHJcbiAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IG9uQ2hhbmdlKChlLnRhcmdldCBhcyBIVE1MU2VsZWN0RWxlbWVudCkudmFsdWUpfVxyXG4gICAgICAgICAgY2xhc3M9XCJmbGV4LTEgcHgtMyBweS0yIHJvdW5kZWQgdGV4dC1zbVwiXHJcbiAgICAgICAgPlxyXG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPntwbGFjZWhvbGRlcn08L29wdGlvbj5cclxuICAgICAgICAgIHtvcHRpb25zLm1hcCgocCkgPT4gKFxyXG4gICAgICAgICAgICA8b3B0aW9uIGtleT17cH0gdmFsdWU9e3B9PlxyXG4gICAgICAgICAgICAgIHtwLnNwbGl0KCcvJykucG9wKCl9XHJcbiAgICAgICAgICAgIDwvb3B0aW9uPlxyXG4gICAgICAgICAgKSl9XHJcbiAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICByZWY9e2ZpbGVJbnB1dFJlZn1cclxuICAgICAgICAgIHR5cGU9XCJmaWxlXCJcclxuICAgICAgICAgIGFjY2VwdD1cImltYWdlLypcIlxyXG4gICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZVVwbG9hZH1cclxuICAgICAgICAgIGNsYXNzPVwiaGlkZGVuXCJcclxuICAgICAgICAvPlxyXG4gICAgICAgIDxidXR0b25cclxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGZpbGVJbnB1dFJlZi5jdXJyZW50Py5jbGljaygpfVxyXG4gICAgICAgICAgZGlzYWJsZWQ9e3VwbG9hZGluZ31cclxuICAgICAgICAgIGNsYXNzPVwicHgtMyBweS0yIGJnLXppbmMtNzAwIGhvdmVyOmJnLXppbmMtNjAwIHJvdW5kZWQgdGV4dC1zbSBkaXNhYmxlZDpvcGFjaXR5LTUwXCJcclxuICAgICAgICAgIHRpdGxlPVwiVXBsb2FkIG5ldyBpbWFnZVwiXHJcbiAgICAgICAgPlxyXG4gICAgICAgICAgPGkgY2xhc3M9XCJmYS1zb2xpZCBmYS11cGxvYWRcIiAvPlxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwgIi8qKlxyXG4gKiBDb2xsYXBzaWJsZVNlY3Rpb24gQ29tcG9uZW50XHJcbiAqIFxyXG4gKiBDb2xsYXBzaWJsZSBzZWN0aW9uIHdpdGggaGVhZGVyIGFuZCBjb250ZW50IGFyZWEuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgdHlwZSB7IENvbXBvbmVudENoaWxkcmVuIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmludGVyZmFjZSBDb2xsYXBzaWJsZVNlY3Rpb25Qcm9wcyB7XHJcbiAgdGl0bGU6IHN0cmluZztcclxuICBkZWZhdWx0T3Blbj86IGJvb2xlYW47XHJcbiAgY2hpbGRyZW46IENvbXBvbmVudENoaWxkcmVuO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQ29sbGFwc2libGVTZWN0aW9uKHtcclxuICB0aXRsZSxcclxuICBkZWZhdWx0T3BlbiA9IHRydWUsXHJcbiAgY2hpbGRyZW4sXHJcbn06IENvbGxhcHNpYmxlU2VjdGlvblByb3BzKSB7XHJcbiAgY29uc3QgW2lzT3Blbiwgc2V0SXNPcGVuXSA9IHVzZVN0YXRlKGRlZmF1bHRPcGVuKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3M9XCJib3JkZXIgYm9yZGVyLXppbmMtODAwIHJvdW5kZWQtbGcgb3ZlcmZsb3ctaGlkZGVuXCI+XHJcbiAgICAgIDxkaXZcclxuICAgICAgICBjbGFzcz1cInNlY3Rpb24taGVhZGVyIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBweC0zIHB5LTIgYmctemluYy04MDAvNTBcIlxyXG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHNldElzT3BlbighaXNPcGVuKX1cclxuICAgICAgPlxyXG4gICAgICAgIDxoMyBjbGFzcz1cInRleHQtc20gZm9udC1tZWRpdW0gdGV4dC16aW5jLTMwMFwiPnt0aXRsZX08L2gzPlxyXG4gICAgICAgIDxpXHJcbiAgICAgICAgICBjbGFzcz17YGZhLXNvbGlkIGZhLWNoZXZyb24tZG93biB0ZXh0LXppbmMtNDAwIHRleHQteHMgdHJhbnNpdGlvbi10cmFuc2Zvcm0gJHtcclxuICAgICAgICAgICAgaXNPcGVuID8gJ3JvdGF0ZS0xODAnIDogJydcclxuICAgICAgICAgIH1gfVxyXG4gICAgICAgIC8+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICB7aXNPcGVuICYmIDxkaXYgY2xhc3M9XCJwLTMgc3BhY2UteS0zIGJnLXppbmMtOTAwLzUwXCI+e2NoaWxkcmVufTwvZGl2Pn1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwgIi8qKlxyXG4gKiBHbG93RWRpdG9ySW5saW5lIENvbXBvbmVudFxyXG4gKiBcclxuICogSW5saW5lIGVkaXRvciBmb3IgbWFuYWdpbmcgYmFja2dyb3VuZCBnbG93cy5cclxuICovXHJcblxyXG5pbXBvcnQgeyBOdW1iZXJJbnB1dCwgQ29sb3JJbnB1dCB9IGZyb20gJy4uL2lucHV0cy9pbmRleC50cyc7XHJcbmltcG9ydCB0eXBlIHsgR2xvdywgUGFsZXR0ZSB9IGZyb20gJy4uLy4uL3R5cGVzLnRzJztcclxuXHJcbmludGVyZmFjZSBHbG93RWRpdG9ySW5saW5lUHJvcHMge1xyXG4gIGdsb3dzOiBHbG93W107XHJcbiAgb25DaGFuZ2U6IChnbG93czogR2xvd1tdKSA9PiB2b2lkO1xyXG4gIHBhbGV0dGU/OiBQYWxldHRlO1xyXG59XHJcblxyXG4vLyBHbG93IGNvbG9yIGNvbnN0YW50cyBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcclxuY29uc3QgR0xPV19DT0xPUlM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XHJcbiAgcHVycGxlOiAnI2E4NTVmNycsXHJcbiAgYmx1ZTogJyM2MzY2ZjEnLFxyXG4gIHBpbms6ICcjZWM0ODk5JyxcclxuICBvcmFuZ2U6ICcjZjk3MzE2JyxcclxuICBncmVlbjogJyMyMmM1NWUnLFxyXG4gIHJlZDogJyNlZjQ0NDQnLFxyXG4gIHllbGxvdzogJyNlYWIzMDgnLFxyXG4gIGN5YW46ICcjMDZiNmQ0JyxcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBHbG93RWRpdG9ySW5saW5lKHsgZ2xvd3MgPSBbXSwgb25DaGFuZ2UsIHBhbGV0dGUgfTogR2xvd0VkaXRvcklubGluZVByb3BzKSB7XHJcbiAgY29uc3QgZGVmYXVsdFBhbGV0dGUgPSB7IHByaW1hcnk6ICcjYTg1NWY3Jywgc2Vjb25kYXJ5OiAnIzYzNjZmMScsIGFjY2VudDogJyNlYzQ4OTknIH07XHJcbiAgY29uc3QgcCA9IHBhbGV0dGUgfHwgZGVmYXVsdFBhbGV0dGU7XHJcblxyXG4gIGNvbnN0IGFkZEdsb3cgPSAoKSA9PiB7XHJcbiAgICAvLyBVc2UgcGFsZXR0ZSBwcmltYXJ5IGNvbG9yIGFzIGRlZmF1bHRcclxuICAgIG9uQ2hhbmdlKFsuLi5nbG93cywgeyBjb2xvcjogcC5wcmltYXJ5LCBzaXplOiA0MDAsIHRvcDogJzIwJScsIGxlZnQ6ICcyMCUnIH1dKTtcclxuICB9O1xyXG5cclxuICBjb25zdCB1cGRhdGVHbG93ID0gKGluZGV4OiBudW1iZXIsIHVwZGF0ZXM6IFBhcnRpYWw8R2xvdz4pID0+IHtcclxuICAgIGNvbnN0IG5ld0dsb3dzID0gWy4uLmdsb3dzXTtcclxuICAgIG5ld0dsb3dzW2luZGV4XSA9IHsgLi4ubmV3R2xvd3NbaW5kZXhdLCAuLi51cGRhdGVzIH07XHJcbiAgICBvbkNoYW5nZShuZXdHbG93cyk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgcmVtb3ZlR2xvdyA9IChpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICBvbkNoYW5nZShnbG93cy5maWx0ZXIoKF8sIGkpID0+IGkgIT09IGluZGV4KSk7XHJcbiAgfTtcclxuXHJcbiAgLy8gR2V0IGN1cnJlbnQgY29sb3IgdmFsdWUgKGZvciBjb2xvciBwaWNrZXIpXHJcbiAgY29uc3QgZ2V0Q29sb3JWYWx1ZSA9IChjb2xvcjogc3RyaW5nKSA9PiB7XHJcbiAgICBpZiAoY29sb3Iuc3RhcnRzV2l0aCgnIycpKSByZXR1cm4gY29sb3I7XHJcbiAgICByZXR1cm4gR0xPV19DT0xPUlNbY29sb3JdIHx8ICcjYTg1NWY3JztcclxuICB9O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzcz1cInNwYWNlLXktM1wiPlxyXG4gICAgICB7Z2xvd3MubWFwKChnbG93LCBpKSA9PiAoXHJcbiAgICAgICAgPGRpdiBrZXk9e2l9IGNsYXNzPVwicC0zIGJnLXppbmMtODAwLzUwIHJvdW5kZWQgc3BhY2UteS0yXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGV4dC14cyB0ZXh0LXppbmMtNDAwXCI+R2xvdyB7aSArIDF9PC9zcGFuPlxyXG4gICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gcmVtb3ZlR2xvdyhpKX1cclxuICAgICAgICAgICAgICBjbGFzcz1cInRleHQtemluYy01MDAgaG92ZXI6dGV4dC1yZWQtNDAwXCJcclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEtc29saWQgZmEteG1hcmtcIiAvPlxyXG4gICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJncmlkIGdyaWQtY29scy0yIGdhcC0yXCI+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwidGV4dC14cyB0ZXh0LXppbmMtNTAwIGJsb2NrIG1iLTFcIj5Db2xvcjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgPENvbG9ySW5wdXRcclxuICAgICAgICAgICAgICAgIHZhbHVlPXtnZXRDb2xvclZhbHVlKGdsb3cuY29sb3IpfVxyXG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyh2KSA9PiB1cGRhdGVHbG93KGksIHsgY29sb3I6IHYgfSl9XHJcbiAgICAgICAgICAgICAgICBwYWxldHRlPXtwfVxyXG4gICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInRleHQteHMgdGV4dC16aW5jLTUwMCBibG9jayBtYi0xXCI+U2l6ZTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgPE51bWJlcklucHV0XHJcbiAgICAgICAgICAgICAgICB2YWx1ZT17Z2xvdy5zaXplfVxyXG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyh2KSA9PiB1cGRhdGVHbG93KGksIHsgc2l6ZTogdiB9KX1cclxuICAgICAgICAgICAgICAgIG1pbj17NTB9XHJcbiAgICAgICAgICAgICAgICBtYXg9ezEwMDB9XHJcbiAgICAgICAgICAgICAgICBzdGVwPXs1MH1cclxuICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJncmlkIGdyaWQtY29scy00IGdhcC0yXCI+XHJcbiAgICAgICAgICAgIHsoWyd0b3AnLCAncmlnaHQnLCAnYm90dG9tJywgJ2xlZnQnXSBhcyBjb25zdCkubWFwKChwb3MpID0+IChcclxuICAgICAgICAgICAgICA8ZGl2IGtleT17cG9zfT5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInRleHQteHMgdGV4dC16aW5jLTUwMCBibG9jayBtYi0xXCI+e3Bvc308L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgICAgdmFsdWU9e2dsb3dbcG9zXSB8fCAnJ31cclxuICAgICAgICAgICAgICAgICAgb25JbnB1dD17KGUpID0+IHVwZGF0ZUdsb3coaSwgeyBbcG9zXTogKGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlIHx8IHVuZGVmaW5lZCB9KX1cclxuICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCItXCJcclxuICAgICAgICAgICAgICAgICAgY2xhc3M9XCJ3LWZ1bGwgcHgtMiBweS0xIHJvdW5kZWQgdGV4dC14c1wiXHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApKX1cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApKX1cclxuICAgICAgXHJcbiAgICAgIDxidXR0b25cclxuICAgICAgICBvbkNsaWNrPXthZGRHbG93fVxyXG4gICAgICAgIGNsYXNzPVwidy1mdWxsIHB5LTIgdGV4dC14cyBiZy16aW5jLTgwMCByb3VuZGVkIGhvdmVyOmJnLXppbmMtNzAwIGJvcmRlciBib3JkZXItZGFzaGVkIGJvcmRlci16aW5jLTYwMFwiXHJcbiAgICAgID5cclxuICAgICAgICA8aSBjbGFzcz1cImZhLXNvbGlkIGZhLXBsdXMgbXItMVwiIC8+IEFkZCBHbG93IEVmZmVjdFxyXG4gICAgICA8L2J1dHRvbj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwgIi8qKlxyXG4gKiBTaGFwZUVkaXRvcklubGluZSBDb21wb25lbnRcclxuICogXHJcbiAqIElubGluZSBlZGl0b3IgZm9yIG1hbmFnaW5nIGRlY29yYXRpdmUgc2hhcGVzIHdpdGggcHJlc2V0cy5cclxuICovXHJcblxyXG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlUmVmLCB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBOdW1iZXJJbnB1dCwgQ29sb3JJbnB1dCB9IGZyb20gJy4uL2lucHV0cy9pbmRleC50cyc7XHJcbmltcG9ydCB0eXBlIHsgU2hhcGUsIFBhbGV0dGUsIFNoYXBlVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzLnRzJztcclxuXHJcbmludGVyZmFjZSBTaGFwZUVkaXRvcklubGluZVByb3BzIHtcclxuICBzaGFwZXM6IFNoYXBlW107XHJcbiAgb25DaGFuZ2U6IChzaGFwZXM6IFNoYXBlW10pID0+IHZvaWQ7XHJcbiAgcGFsZXR0ZT86IFBhbGV0dGU7XHJcbn1cclxuXHJcbmNvbnN0IFNIQVBFX1RZUEVTID0gW1xyXG4gIHsgdmFsdWU6ICdjaXJjbGUnLCBsYWJlbDogJ0NpcmNsZScsIGljb246ICdmYS1jaXJjbGUnIH0sXHJcbiAgeyB2YWx1ZTogJ3JpbmcnLCBsYWJlbDogJ1JpbmcnLCBpY29uOiAnZmEtY2lyY2xlLW5vdGNoJyB9LFxyXG4gIHsgdmFsdWU6ICdyZWN0YW5nbGUnLCBsYWJlbDogJ1JlY3RhbmdsZScsIGljb246ICdmYS1zcXVhcmUnIH0sXHJcbiAgeyB2YWx1ZTogJ3BpbGwnLCBsYWJlbDogJ1BpbGwnLCBpY29uOiAnZmEtY2Fwc3VsZXMnIH0sXHJcbiAgeyB2YWx1ZTogJ2N1cnZlZC1saW5lJywgbGFiZWw6ICdDdXJ2ZWQgTGluZScsIGljb246ICdmYS1iZXppZXItY3VydmUnIH0sXHJcbiAgeyB2YWx1ZTogJ3MtY3VydmUnLCBsYWJlbDogJ1MtQ3VydmUnLCBpY29uOiAnZmEtd2F2ZS1zcXVhcmUnIH0sXHJcbiAgeyB2YWx1ZTogJ3dhdmUtbGluZScsIGxhYmVsOiAnV2F2ZSBMaW5lJywgaWNvbjogJ2ZhLXdhdGVyJyB9LFxyXG4gIHsgdmFsdWU6ICdjaGV2cm9uJywgbGFiZWw6ICdDaGV2cm9uJywgaWNvbjogJ2ZhLWNoZXZyb24tcmlnaHQnIH0sXHJcbiAgeyB2YWx1ZTogJ2RvdWJsZS1jaGV2cm9uJywgbGFiZWw6ICdEb3VibGUgQ2hldnJvbicsIGljb246ICdmYS1hbmdsZXMtcmlnaHQnIH0sXHJcbiAgeyB2YWx1ZTogJ2Fycm93JywgbGFiZWw6ICdBcnJvdycsIGljb246ICdmYS1hcnJvdy1yaWdodCcgfSxcclxuICB7IHZhbHVlOiAndHJpYW5nbGUnLCBsYWJlbDogJ1RyaWFuZ2xlJywgaWNvbjogJ2ZhLXBsYXknIH0sXHJcbiAgeyB2YWx1ZTogJ2RpYW1vbmQnLCBsYWJlbDogJ0RpYW1vbmQnLCBpY29uOiAnZmEtZGlhbW9uZCcgfSxcclxuICB7IHZhbHVlOiAnaGV4YWdvbicsIGxhYmVsOiAnSGV4YWdvbicsIGljb246ICdmYS1oZXhhZ29uLW5vZGVzJyB9LFxyXG4gIHsgdmFsdWU6ICdzdGFyJywgbGFiZWw6ICdTdGFyJywgaWNvbjogJ2ZhLXN0YXInIH0sXHJcbiAgeyB2YWx1ZTogJ3NwYXJrbGUnLCBsYWJlbDogJ1NwYXJrbGUnLCBpY29uOiAnZmEtc3BhcmtsZXMnIH0sXHJcbiAgeyB2YWx1ZTogJ2Nyb3NzJywgbGFiZWw6ICdDcm9zcycsIGljb246ICdmYS1wbHVzJyB9LFxyXG4gIHsgdmFsdWU6ICdibG9iJywgbGFiZWw6ICdCbG9iJywgaWNvbjogJ2ZhLWNsb3VkJyB9LFxyXG4gIHsgdmFsdWU6ICdjcmVzY2VudCcsIGxhYmVsOiAnQ3Jlc2NlbnQnLCBpY29uOiAnZmEtbW9vbicgfSxcclxuICB7IHZhbHVlOiAnZG90cy1ncmlkJywgbGFiZWw6ICdEb3RzIEdyaWQnLCBpY29uOiAnZmEtZ3JpcCcgfSxcclxuICB7IHZhbHVlOiAnc2NhdHRlcmVkLWRvdHMnLCBsYWJlbDogJ1NjYXR0ZXJlZCBEb3RzJywgaWNvbjogJ2ZhLWVsbGlwc2lzJyB9LFxyXG5dO1xyXG5cclxuY29uc3QgU0hBUEVfUFJFU0VUUyA9IFtcclxuICB7XHJcbiAgICBuYW1lOiAnTmVzdGVkIFJpbmdzJyxcclxuICAgIHNoYXBlczogW1xyXG4gICAgICB7IHR5cGU6ICdyaW5nJywgc2l6ZTogNTAsIGNvbG9yOiAnI2ZmZmZmZicsIG9wYWNpdHk6IDAuMDgsIHN0cm9rZVdpZHRoOiAyLCBwb3NYOiA3MCwgcG9zWTogNTAsIHpJbmRleDogMCB9LFxyXG4gICAgICB7IHR5cGU6ICdyaW5nJywgc2l6ZTogMzUsIGNvbG9yOiAnI2ZmZmZmZicsIG9wYWNpdHk6IDAuMTIsIHN0cm9rZVdpZHRoOiAxLjUsIHBvc1g6IDcwLCBwb3NZOiA1MCwgekluZGV4OiAwIH0sXHJcbiAgICBdLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgbmFtZTogJ0Nvcm5lciBDaGV2cm9uJyxcclxuICAgIHNoYXBlczogW1xyXG4gICAgICB7IHR5cGU6ICdjaGV2cm9uJywgc2l6ZTogMTUsIGNvbG9yOiAnI2ZmZmZmZicsIG9wYWNpdHk6IDAuMiwgc3Ryb2tlV2lkdGg6IDMsIGRpcmVjdGlvbjogJ3JpZ2h0JywgcG9zWDogOTAsIHBvc1k6IDIwLCB6SW5kZXg6IDUgfSxcclxuICAgIF0sXHJcbiAgfSxcclxuICB7XHJcbiAgICBuYW1lOiAnRmxvYXRpbmcgQXJjJyxcclxuICAgIHNoYXBlczogW1xyXG4gICAgICB7IHR5cGU6ICdjdXJ2ZWQtbGluZScsIHNpemU6IDYwLCBjb2xvcjogJyNmZmZmZmYnLCBvcGFjaXR5OiAwLjE1LCBzdHJva2VXaWR0aDogMiwgb3JpZW50YXRpb246ICdob3Jpem9udGFsJywgY3VydmF0dXJlOiAzMCwgcG9zWDogNTAsIHBvc1k6IDgwLCB6SW5kZXg6IDAgfSxcclxuICAgIF0sXHJcbiAgfSxcclxuICB7XHJcbiAgICBuYW1lOiAnRG90IFBhdHRlcm4nLFxyXG4gICAgc2hhcGVzOiBbXHJcbiAgICAgIHsgdHlwZTogJ2RvdHMtZ3JpZCcsIHNpemU6IDQwLCBjb2xvcjogJyNmZmZmZmYnLCBvcGFjaXR5OiAwLjEsIHJvd3M6IDQsIGNvbHVtbnM6IDQsIHNwYWNpbmc6IDgsIGRvdFNpemU6IDEsIHBvc1g6IDg1LCBwb3NZOiAxNSwgekluZGV4OiAwIH0sXHJcbiAgICBdLFxyXG4gIH0sXHJcbl07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gU2hhcGVFZGl0b3JJbmxpbmUoeyBzaGFwZXMgPSBbXSwgb25DaGFuZ2UsIHBhbGV0dGUgfTogU2hhcGVFZGl0b3JJbmxpbmVQcm9wcykge1xyXG4gIGNvbnN0IGRlZmF1bHRQYWxldHRlID0geyBwcmltYXJ5OiAnI2E4NTVmNycsIHNlY29uZGFyeTogJyM2MzY2ZjEnLCBhY2NlbnQ6ICcjZWM0ODk5JyB9O1xyXG4gIGNvbnN0IHAgPSBwYWxldHRlIHx8IGRlZmF1bHRQYWxldHRlO1xyXG4gIGNvbnN0IFtzaG93UHJlc2V0cywgc2V0U2hvd1ByZXNldHNdID0gdXNlU3RhdGUoZmFsc2UpO1xyXG4gIGNvbnN0IHByZXNldEJ1dHRvblJlZiA9IHVzZVJlZjxIVE1MQnV0dG9uRWxlbWVudD4obnVsbCk7XHJcbiAgY29uc3QgcHJlc2V0TWVudVJlZiA9IHVzZVJlZjxIVE1MRGl2RWxlbWVudD4obnVsbCk7XHJcbiAgY29uc3QgW3ByZXNldE1lbnVTdHlsZSwgc2V0UHJlc2V0TWVudVN0eWxlXSA9IHVzZVN0YXRlPFJlY29yZDxzdHJpbmcsIHN0cmluZz4+KHt9KTtcclxuXHJcbiAgY29uc3QgYWRkU2hhcGUgPSAodHlwZTogU2hhcGVUeXBlID0gJ3JpbmcnKSA9PiB7XHJcbiAgICBjb25zdCBuZXdTaGFwZTogU2hhcGUgPSB7XHJcbiAgICAgIHR5cGUsXHJcbiAgICAgIHNpemU6IDMwLFxyXG4gICAgICBjb2xvcjogcC5wcmltYXJ5LFxyXG4gICAgICBvcGFjaXR5OiAwLjE1LFxyXG4gICAgICBzdHJva2VXaWR0aDogMixcclxuICAgICAgZmlsbGVkOiBmYWxzZSxcclxuICAgICAgcG9zWDogNTAsXHJcbiAgICAgIHBvc1k6IDUwLFxyXG4gICAgICB6SW5kZXg6IDUsXHJcbiAgICB9O1xyXG4gICAgb25DaGFuZ2UoWy4uLnNoYXBlcywgbmV3U2hhcGVdKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBhZGRQcmVzZXQgPSAocHJlc2V0OiB0eXBlb2YgU0hBUEVfUFJFU0VUU1swXSkgPT4ge1xyXG4gICAgb25DaGFuZ2UoWy4uLnNoYXBlcywgLi4ucHJlc2V0LnNoYXBlcy5tYXAoKHMpID0+ICh7IC4uLnMgfSBhcyBTaGFwZSkpXSk7XHJcbiAgICBzZXRTaG93UHJlc2V0cyhmYWxzZSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgdXBkYXRlU2hhcGUgPSAoaW5kZXg6IG51bWJlciwgdXBkYXRlczogUGFydGlhbDxTaGFwZT4pID0+IHtcclxuICAgIGNvbnN0IG5ld1NoYXBlcyA9IFsuLi5zaGFwZXNdO1xyXG4gICAgbmV3U2hhcGVzW2luZGV4XSA9IHsgLi4ubmV3U2hhcGVzW2luZGV4XSwgLi4udXBkYXRlcyB9O1xyXG4gICAgb25DaGFuZ2UobmV3U2hhcGVzKTtcclxuICB9O1xyXG5cclxuICBjb25zdCByZW1vdmVTaGFwZSA9IChpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICBvbkNoYW5nZShzaGFwZXMuZmlsdGVyKChfLCBpKSA9PiBpICE9PSBpbmRleCkpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGR1cGxpY2F0ZVNoYXBlID0gKGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgIGNvbnN0IG5ld1NoYXBlcyA9IFsuLi5zaGFwZXNdO1xyXG4gICAgY29uc3QgY29weSA9IHsgLi4ubmV3U2hhcGVzW2luZGV4XSB9O1xyXG4gICAgY29weS5wb3NYID0gKChjb3B5LnBvc1ggPz8gNTApICsgNSkgJSAxMDA7XHJcbiAgICBjb3B5LnBvc1kgPSAoKGNvcHkucG9zWSA/PyA1MCkgKyA1KSAlIDEwMDtcclxuICAgIG5ld1NoYXBlcy5zcGxpY2UoaW5kZXggKyAxLCAwLCBjb3B5KTtcclxuICAgIG9uQ2hhbmdlKG5ld1NoYXBlcyk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgdXBkYXRlUHJlc2V0TWVudVBvc2l0aW9uID0gKCkgPT4ge1xyXG4gICAgaWYgKCFwcmVzZXRCdXR0b25SZWYuY3VycmVudCkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IHJlY3QgPSBwcmVzZXRCdXR0b25SZWYuY3VycmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIGNvbnN0IG1lbnVXaWR0aCA9IE1hdGgubWF4KHJlY3Qud2lkdGgsIDI2MCk7XHJcbiAgICBjb25zdCBob3Jpem9udGFsUGFkZGluZyA9IDg7XHJcbiAgICBjb25zdCB2ZXJ0aWNhbEdhcCA9IDY7XHJcbiAgICBjb25zdCBlc3RpbWF0ZWRNZW51SGVpZ2h0ID0gTWF0aC5taW4oMzIwLCA0MCArIFNIQVBFX1BSRVNFVFMubGVuZ3RoICogNDYpO1xyXG4gICAgY29uc3Qgc3BhY2VCZWxvdyA9IGlubmVySGVpZ2h0IC0gcmVjdC5ib3R0b207XHJcbiAgICBjb25zdCBvcGVuVXAgPSBzcGFjZUJlbG93IDwgZXN0aW1hdGVkTWVudUhlaWdodCAmJiByZWN0LnRvcCA+IHNwYWNlQmVsb3c7XHJcblxyXG4gICAgY29uc3QgbGVmdCA9IE1hdGgubWluKFxyXG4gICAgICBNYXRoLm1heChob3Jpem9udGFsUGFkZGluZywgcmVjdC5sZWZ0KSxcclxuICAgICAgaW5uZXJXaWR0aCAtIG1lbnVXaWR0aCAtIGhvcml6b250YWxQYWRkaW5nXHJcbiAgICApO1xyXG5cclxuICAgIHNldFByZXNldE1lbnVTdHlsZSh7XHJcbiAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxyXG4gICAgICB6SW5kZXg6ICc2MCcsXHJcbiAgICAgIGxlZnQ6IGxlZnQgKyAncHgnLFxyXG4gICAgICB3aWR0aDogbWVudVdpZHRoICsgJ3B4JyxcclxuICAgICAgbWF4SGVpZ2h0OiAnMzIwcHgnLFxyXG4gICAgICAuLi4ob3BlblVwXHJcbiAgICAgICAgPyB7IGJvdHRvbTogKGlubmVySGVpZ2h0IC0gcmVjdC50b3AgKyB2ZXJ0aWNhbEdhcCkgKyAncHgnIH1cclxuICAgICAgICA6IHsgdG9wOiAocmVjdC5ib3R0b20gKyB2ZXJ0aWNhbEdhcCkgKyAncHgnIH0pLFxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICghc2hvd1ByZXNldHMpIHJldHVybjtcclxuXHJcbiAgICBjb25zdCBoYW5kbGVDbGlja091dHNpZGUgPSAoZTogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICBpZiAocHJlc2V0QnV0dG9uUmVmLmN1cnJlbnQ/LmNvbnRhaW5zKGUudGFyZ2V0IGFzIE5vZGUpKSByZXR1cm47XHJcbiAgICAgIGlmIChwcmVzZXRNZW51UmVmLmN1cnJlbnQ/LmNvbnRhaW5zKGUudGFyZ2V0IGFzIE5vZGUpKSByZXR1cm47XHJcbiAgICAgIHNldFNob3dQcmVzZXRzKGZhbHNlKTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgaGFuZGxlS2V5RG93biA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XHJcbiAgICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHNldFNob3dQcmVzZXRzKGZhbHNlKTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgaGFuZGxlVmlld3BvcnRDaGFuZ2UgPSAoKSA9PiB1cGRhdGVQcmVzZXRNZW51UG9zaXRpb24oKTtcclxuXHJcbiAgICB1cGRhdGVQcmVzZXRNZW51UG9zaXRpb24oKTtcclxuICAgIGFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGhhbmRsZUNsaWNrT3V0c2lkZSk7XHJcbiAgICBhZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XHJcbiAgICBhZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBoYW5kbGVWaWV3cG9ydENoYW5nZSk7XHJcbiAgICBhZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBoYW5kbGVWaWV3cG9ydENoYW5nZSwgdHJ1ZSk7XHJcblxyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgaGFuZGxlQ2xpY2tPdXRzaWRlKTtcclxuICAgICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xyXG4gICAgICByZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBoYW5kbGVWaWV3cG9ydENoYW5nZSk7XHJcbiAgICAgIHJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGhhbmRsZVZpZXdwb3J0Q2hhbmdlLCB0cnVlKTtcclxuICAgIH07XHJcbiAgfSwgW3Nob3dQcmVzZXRzXSk7XHJcblxyXG4gIGNvbnN0IHJlbmRlclNoYXBlQ29udHJvbHMgPSAoc2hhcGU6IFNoYXBlLCBpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICBjb25zdCB0eXBlID0gc2hhcGUudHlwZTtcclxuICAgIGNvbnN0IGlzTGluZSA9IFsnY3VydmVkLWxpbmUnLCAncy1jdXJ2ZScsICd3YXZlLWxpbmUnXS5pbmNsdWRlcyh0eXBlKTtcclxuICAgIGNvbnN0IGlzQ2hldnJvbiA9IFsnY2hldnJvbicsICdkb3VibGUtY2hldnJvbicsICdhcnJvdyddLmluY2x1ZGVzKHR5cGUpO1xyXG4gICAgY29uc3QgaXNTdGFyID0gWydzdGFyJywgJ3NwYXJrbGUnXS5pbmNsdWRlcyh0eXBlKTtcclxuICAgIGNvbnN0IGlzUGF0dGVybiA9IFsnZG90cy1ncmlkJywgJ3NjYXR0ZXJlZC1kb3RzJ10uaW5jbHVkZXModHlwZSk7XHJcbiAgICBjb25zdCBpc0Jsb2IgPSB0eXBlID09PSAnYmxvYic7XHJcbiAgICBjb25zdCBpc0NyZXNjZW50ID0gdHlwZSA9PT0gJ2NyZXNjZW50JztcclxuICAgIGNvbnN0IGhhc0ZpbGwgPSAhaXNMaW5lICYmICFpc0NoZXZyb247XHJcbiAgICBjb25zdCBoYXNTdHJva2UgPSBbJ3JpbmcnLCAncmVjdGFuZ2xlJywgJ3BpbGwnLCAnY3VydmVkLWxpbmUnLCAncy1jdXJ2ZScsICd3YXZlLWxpbmUnLCAnY2hldnJvbicsICdkb3VibGUtY2hldnJvbicsICdhcnJvdycsICd0cmlhbmdsZScsICdkaWFtb25kJywgJ2hleGFnb24nLCAnc3RhcicsICdzcGFya2xlJywgJ2Nyb3NzJ10uaW5jbHVkZXModHlwZSk7XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgPD5cclxuICAgICAgICB7LyogQmFzaWMgQ29udHJvbHMgKi99XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTJcIj5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInRleHQteHMgdGV4dC16aW5jLTUwMCBibG9jayBtYi0xXCI+Q29sb3I8L2xhYmVsPlxyXG4gICAgICAgICAgICA8Q29sb3JJbnB1dFxyXG4gICAgICAgICAgICAgIHZhbHVlPXtzaGFwZS5jb2xvciB8fCAnI2ZmZmZmZid9XHJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyh2KSA9PiB1cGRhdGVTaGFwZShpbmRleCwgeyBjb2xvcjogdiB9KX1cclxuICAgICAgICAgICAgICBwYWxldHRlPXtwfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtemluYy01MDAgYmxvY2sgbWItMVwiPlNpemUgJTwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxOdW1iZXJJbnB1dFxyXG4gICAgICAgICAgICAgIHZhbHVlPXtzaGFwZS5zaXplID8/IDMwfVxyXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsodikgPT4gdXBkYXRlU2hhcGUoaW5kZXgsIHsgc2l6ZTogdiB9KX1cclxuICAgICAgICAgICAgICBtaW49ezF9XHJcbiAgICAgICAgICAgICAgbWF4PXs1MDB9XHJcbiAgICAgICAgICAgICAgc3RlcD17NX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZ3JpZCBncmlkLWNvbHMtMyBnYXAtMlwiPlxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwidGV4dC14cyB0ZXh0LXppbmMtNTAwIGJsb2NrIG1iLTFcIj5PcGFjaXR5PC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgdHlwZT1cInJhbmdlXCJcclxuICAgICAgICAgICAgICB2YWx1ZT17KHNoYXBlLm9wYWNpdHkgPz8gMC4yKSAqIDEwMH1cclxuICAgICAgICAgICAgICBvbklucHV0PXsoZSkgPT4gdXBkYXRlU2hhcGUoaW5kZXgsIHsgb3BhY2l0eTogTnVtYmVyKChlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSkgLyAxMDAgfSl9XHJcbiAgICAgICAgICAgICAgbWluPVwiMFwiXHJcbiAgICAgICAgICAgICAgbWF4PVwiMTAwXCJcclxuICAgICAgICAgICAgICBjbGFzcz1cInctZnVsbFwiXHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtemluYy01MDAgdGV4dC1jZW50ZXJcIj57TWF0aC5yb3VuZCgoc2hhcGUub3BhY2l0eSA/PyAwLjIpICogMTAwKX0lPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInRleHQteHMgdGV4dC16aW5jLTUwMCBibG9jayBtYi0xXCI+Qmx1cjwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxOdW1iZXJJbnB1dFxyXG4gICAgICAgICAgICAgIHZhbHVlPXtzaGFwZS5ibHVyID8/IDB9XHJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyh2KSA9PiB1cGRhdGVTaGFwZShpbmRleCwgeyBibHVyOiB2IH0pfVxyXG4gICAgICAgICAgICAgIG1pbj17MH1cclxuICAgICAgICAgICAgICBtYXg9ezUwfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtemluYy01MDAgYmxvY2sgbWItMVwiPlotSW5kZXg8L2xhYmVsPlxyXG4gICAgICAgICAgICA8c2VsZWN0XHJcbiAgICAgICAgICAgICAgdmFsdWU9e3NoYXBlLnpJbmRleCA/PyA1fVxyXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlU2hhcGUoaW5kZXgsIHsgekluZGV4OiBOdW1iZXIoKGUudGFyZ2V0IGFzIEhUTUxTZWxlY3RFbGVtZW50KS52YWx1ZSkgfSl9XHJcbiAgICAgICAgICAgICAgY2xhc3M9XCJ3LWZ1bGwgaC04IHB4LTIgcm91bmRlZCB0ZXh0LXNtIGJnLXppbmMtODAwIGJvcmRlciBib3JkZXItemluYy03MDAgZm9jdXM6b3V0bGluZS1ub25lIGZvY3VzOmJvcmRlci1pbmRpZ28tNTAwXCJcclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9ezB9PkJlaGluZCAoMCk8L29wdGlvbj5cclxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXs1fT5EZWZhdWx0ICg1KTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9ezEwfT5Gcm9udCAoMTApPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT17MTV9PkFib3ZlIEFsbCAoMTUpPC9vcHRpb24+XHJcbiAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIHsvKiBQb3NpdGlvbiBDb250cm9scyAqL31cclxuICAgICAgICA8ZGl2IGNsYXNzPVwic3BhY2UteS0yXCI+XHJcbiAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtemluYy01MDAgYmxvY2sgbWItMVwiPlxyXG4gICAgICAgICAgICAgIFggUG9zaXRpb24gPHNwYW4gY2xhc3M9XCJ0ZXh0LXppbmMtNjAwXCI+KFx1MjE5MCAwIHwgNTAgY2VudGVyIHwgMTAwIFx1MjE5Mik8L3NwYW4+XHJcbiAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxyXG4gICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgdHlwZT1cInJhbmdlXCJcclxuICAgICAgICAgICAgICAgIHZhbHVlPXtzaGFwZS5wb3NYID8/IDUwfVxyXG4gICAgICAgICAgICAgICAgb25JbnB1dD17KGUpID0+IHVwZGF0ZVNoYXBlKGluZGV4LCB7IHBvc1g6IE51bWJlcigoZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUpIH0pfVxyXG4gICAgICAgICAgICAgICAgbWluPVwiMFwiXHJcbiAgICAgICAgICAgICAgICBtYXg9XCIxMDBcIlxyXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJmbGV4LTFcIlxyXG4gICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgICAgIHZhbHVlPXtzaGFwZS5wb3NYID8/IDUwfVxyXG4gICAgICAgICAgICAgICAgb25JbnB1dD17KGUpID0+IHVwZGF0ZVNoYXBlKGluZGV4LCB7IHBvc1g6IE51bWJlcigoZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUpIH0pfVxyXG4gICAgICAgICAgICAgICAgbWluPXswfVxyXG4gICAgICAgICAgICAgICAgbWF4PXsxMDB9XHJcbiAgICAgICAgICAgICAgICBjbGFzcz1cInctMTQgcHgtMSBweS0wLjUgcm91bmRlZCB0ZXh0LXhzIHRleHQtY2VudGVyXCJcclxuICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwidGV4dC14cyB0ZXh0LXppbmMtNTAwIGJsb2NrIG1iLTFcIj5cclxuICAgICAgICAgICAgICBZIFBvc2l0aW9uIDxzcGFuIGNsYXNzPVwidGV4dC16aW5jLTYwMFwiPihcdTIxOTEgMCB8IDUwIGNlbnRlciB8IDEwMCBcdTIxOTMpPC9zcGFuPlxyXG4gICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cclxuICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgIHR5cGU9XCJyYW5nZVwiXHJcbiAgICAgICAgICAgICAgICB2YWx1ZT17c2hhcGUucG9zWSA/PyA1MH1cclxuICAgICAgICAgICAgICAgIG9uSW5wdXQ9eyhlKSA9PiB1cGRhdGVTaGFwZShpbmRleCwgeyBwb3NZOiBOdW1iZXIoKGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKSB9KX1cclxuICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxyXG4gICAgICAgICAgICAgICAgbWF4PVwiMTAwXCJcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwiZmxleC0xXCJcclxuICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXHJcbiAgICAgICAgICAgICAgICB2YWx1ZT17c2hhcGUucG9zWSA/PyA1MH1cclxuICAgICAgICAgICAgICAgIG9uSW5wdXQ9eyhlKSA9PiB1cGRhdGVTaGFwZShpbmRleCwgeyBwb3NZOiBOdW1iZXIoKGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKSB9KX1cclxuICAgICAgICAgICAgICAgIG1pbj17MH1cclxuICAgICAgICAgICAgICAgIG1heD17MTAwfVxyXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJ3LTE0IHB4LTEgcHktMC41IHJvdW5kZWQgdGV4dC14cyB0ZXh0LWNlbnRlclwiXHJcbiAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTJcIj5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInRleHQteHMgdGV4dC16aW5jLTUwMCBibG9jayBtYi0xXCI+Um90YXRpb248L2xhYmVsPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cclxuICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgIHR5cGU9XCJyYW5nZVwiXHJcbiAgICAgICAgICAgICAgICB2YWx1ZT17c2hhcGUucm90YXRpb24gPz8gMH1cclxuICAgICAgICAgICAgICAgIG9uSW5wdXQ9eyhlKSA9PiB1cGRhdGVTaGFwZShpbmRleCwgeyByb3RhdGlvbjogTnVtYmVyKChlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSkgfSl9XHJcbiAgICAgICAgICAgICAgICBtaW49XCItMTgwXCJcclxuICAgICAgICAgICAgICAgIG1heD1cIjE4MFwiXHJcbiAgICAgICAgICAgICAgICBjbGFzcz1cImZsZXgtMVwiXHJcbiAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRleHQteHMgdGV4dC16aW5jLTQwMCB3LTEwXCI+e3NoYXBlLnJvdGF0aW9uID8/IDB9XHUwMEIwPC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAge2hhc0ZpbGwgJiYgKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInRleHQteHMgdGV4dC16aW5jLTUwMCBibG9jayBtYi0xXCI+U3R5bGU8L2xhYmVsPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4IGdhcC0xXCI+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHVwZGF0ZVNoYXBlKGluZGV4LCB7IGZpbGxlZDogZmFsc2UgfSl9XHJcbiAgICAgICAgICAgICAgICAgIGNsYXNzPXtgZmxleC0xIHB4LTIgcHktMSByb3VuZGVkIHRleHQteHMgJHshc2hhcGUuZmlsbGVkID8gJ2JnLWluZGlnby02MDAnIDogJ2JnLXppbmMtODAwJ31gfVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICBPdXRsaW5lXHJcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdXBkYXRlU2hhcGUoaW5kZXgsIHsgZmlsbGVkOiB0cnVlIH0pfVxyXG4gICAgICAgICAgICAgICAgICBjbGFzcz17YGZsZXgtMSBweC0yIHB5LTEgcm91bmRlZCB0ZXh0LXhzICR7c2hhcGUuZmlsbGVkID8gJ2JnLWluZGlnby02MDAnIDogJ2JnLXppbmMtODAwJ31gfVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICBGaWxsZWRcclxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICl9XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIHtoYXNTdHJva2UgJiYgIXNoYXBlLmZpbGxlZCAmJiAoXHJcbiAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtemluYy01MDAgYmxvY2sgbWItMVwiPlN0cm9rZSBXaWR0aDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgIHR5cGU9XCJyYW5nZVwiXHJcbiAgICAgICAgICAgICAgdmFsdWU9e3NoYXBlLnN0cm9rZVdpZHRoID8/IDJ9XHJcbiAgICAgICAgICAgICAgb25JbnB1dD17KGUpID0+IHVwZGF0ZVNoYXBlKGluZGV4LCB7IHN0cm9rZVdpZHRoOiBOdW1iZXIoKGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKSB9KX1cclxuICAgICAgICAgICAgICBtaW49ezAuMjV9XHJcbiAgICAgICAgICAgICAgbWF4PXsyMH1cclxuICAgICAgICAgICAgICBzdGVwPXswLjI1fVxyXG4gICAgICAgICAgICAgIGNsYXNzPVwidy1mdWxsXCJcclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRleHQteHMgdGV4dC16aW5jLTUwMCB0ZXh0LWNlbnRlclwiPntzaGFwZS5zdHJva2VXaWR0aCA/PyAyfXB4PC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApfVxyXG5cclxuICAgICAgICB7LyogTGluZS1zcGVjaWZpYyBjb250cm9scyAqL31cclxuICAgICAgICB7aXNMaW5lICYmIChcclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJib3JkZXItdCBib3JkZXItemluYy03MDAgcHQtMiBtdC0yXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtemluYy00MDAgbWItMlwiPkxpbmUgU2V0dGluZ3M8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTJcIj5cclxuICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwidGV4dC14cyB0ZXh0LXppbmMtNTAwIGJsb2NrIG1iLTFcIj5EaXJlY3Rpb248L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPHNlbGVjdFxyXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17c2hhcGUub3JpZW50YXRpb24gPz8gJ2hvcml6b250YWwnfVxyXG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZVNoYXBlKGluZGV4LCB7IG9yaWVudGF0aW9uOiAoZS50YXJnZXQgYXMgSFRNTFNlbGVjdEVsZW1lbnQpLnZhbHVlIGFzIFNoYXBlWydvcmllbnRhdGlvbiddIH0pfVxyXG4gICAgICAgICAgICAgICAgICBjbGFzcz1cInctZnVsbCBweC0yIHB5LTEgcm91bmRlZCB0ZXh0LXNtXCJcclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImhvcml6b250YWxcIj5cdTIxOTAgSG9yaXpvbnRhbCBcdTIxOTI8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInZlcnRpY2FsXCI+XHUyMTkxIFZlcnRpY2FsIFx1MjE5Mzwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiZGlhZ29uYWwtZG93blwiPlx1MjE5OCBEaWFnb25hbCBEb3duPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJkaWFnb25hbC11cFwiPlx1MjE5NyBEaWFnb25hbCBVcDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInRleHQteHMgdGV4dC16aW5jLTUwMCBibG9jayBtYi0xXCI+Q3VydmF0dXJlPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICB0eXBlPVwicmFuZ2VcIlxyXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17c2hhcGUuY3VydmF0dXJlID8/IDMwfVxyXG4gICAgICAgICAgICAgICAgICBtaW49ey0xMDB9XHJcbiAgICAgICAgICAgICAgICAgIG1heD17MTAwfVxyXG4gICAgICAgICAgICAgICAgICBvbklucHV0PXsoZSkgPT4gdXBkYXRlU2hhcGUoaW5kZXgsIHsgY3VydmF0dXJlOiBOdW1iZXIoKGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKSB9KX1cclxuICAgICAgICAgICAgICAgICAgY2xhc3M9XCJ3LWZ1bGxcIlxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtemluYy01MDAgdGV4dC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgICAge3NoYXBlLmN1cnZhdHVyZSA/PyAzMH0gKHsoc2hhcGUuY3VydmF0dXJlID8/IDMwKSA+IDAgPyAnXHUyMTkxJyA6IChzaGFwZS5jdXJ2YXR1cmUgPz8gMzApIDwgMCA/ICdcdTIxOTMnIDogJ1x1MjAxNCd9KVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtMiBtdC0yXCI+XHJcbiAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInRleHQteHMgdGV4dC16aW5jLTUwMCBibG9jayBtYi0xXCI+RGFzaCBTdHlsZTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8c2VsZWN0XHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtzaGFwZS5kYXNoU3R5bGUgPz8gJ3NvbGlkJ31cclxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGVTaGFwZShpbmRleCwgeyBkYXNoU3R5bGU6IChlLnRhcmdldCBhcyBIVE1MU2VsZWN0RWxlbWVudCkudmFsdWUgYXMgU2hhcGVbJ2Rhc2hTdHlsZSddIH0pfVxyXG4gICAgICAgICAgICAgICAgICBjbGFzcz1cInctZnVsbCBweC0yIHB5LTEgcm91bmRlZCB0ZXh0LXNtXCJcclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInNvbGlkXCI+U29saWQ8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImRhc2hlZFwiPkRhc2hlZDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiZG90dGVkXCI+RG90dGVkPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwidGV4dC14cyB0ZXh0LXppbmMtNTAwIGJsb2NrIG1iLTFcIj5MaW5lIENhcDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8c2VsZWN0XHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtzaGFwZS5saW5lQ2FwID8/ICdyb3VuZCd9XHJcbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlU2hhcGUoaW5kZXgsIHsgbGluZUNhcDogKGUudGFyZ2V0IGFzIEhUTUxTZWxlY3RFbGVtZW50KS52YWx1ZSBhcyBTaGFwZVsnbGluZUNhcCddIH0pfVxyXG4gICAgICAgICAgICAgICAgICBjbGFzcz1cInctZnVsbCBweC0yIHB5LTEgcm91bmRlZCB0ZXh0LXNtXCJcclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInJvdW5kXCI+Um91bmQ8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInNxdWFyZVwiPlNxdWFyZTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiYnV0dFwiPkJ1dHQ8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAge3R5cGUgPT09ICd3YXZlLWxpbmUnICYmIChcclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibXQtMlwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwidGV4dC14cyB0ZXh0LXppbmMtNTAwIGJsb2NrIG1iLTFcIj5XYXZlcyBDb3VudDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8TnVtYmVySW5wdXRcclxuICAgICAgICAgICAgICAgICAgdmFsdWU9e3NoYXBlLmNvdW50ID8/IDN9XHJcbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodikgPT4gdXBkYXRlU2hhcGUoaW5kZXgsIHsgY291bnQ6IHYgfSl9XHJcbiAgICAgICAgICAgICAgICAgIG1pbj17MX1cclxuICAgICAgICAgICAgICAgICAgbWF4PXsxMH1cclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApfVxyXG5cclxuICAgICAgICB7LyogQ2hldnJvbi1zcGVjaWZpYyBjb250cm9scyAqL31cclxuICAgICAgICB7aXNDaGV2cm9uICYmIChcclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJib3JkZXItdCBib3JkZXItemluYy03MDAgcHQtMiBtdC0yXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtemluYy00MDAgbWItMlwiPkNoZXZyb24gU2V0dGluZ3M8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTJcIj5cclxuICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwidGV4dC14cyB0ZXh0LXppbmMtNTAwIGJsb2NrIG1iLTFcIj5EaXJlY3Rpb248L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPHNlbGVjdFxyXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17c2hhcGUuZGlyZWN0aW9uID8/ICdyaWdodCd9XHJcbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlU2hhcGUoaW5kZXgsIHsgZGlyZWN0aW9uOiAoZS50YXJnZXQgYXMgSFRNTFNlbGVjdEVsZW1lbnQpLnZhbHVlIGFzIFNoYXBlWydkaXJlY3Rpb24nXSB9KX1cclxuICAgICAgICAgICAgICAgICAgY2xhc3M9XCJ3LWZ1bGwgcHgtMiBweS0xIHJvdW5kZWQgdGV4dC1zbVwiXHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJyaWdodFwiPlx1MjE5MiBSaWdodDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwibGVmdFwiPlx1MjE5MCBMZWZ0PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJ1cFwiPlx1MjE5MSBVcDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiZG93blwiPlx1MjE5MyBEb3duPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwidGV4dC14cyB0ZXh0LXppbmMtNTAwIGJsb2NrIG1iLTFcIj5BbmdsZTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgdHlwZT1cInJhbmdlXCJcclxuICAgICAgICAgICAgICAgICAgdmFsdWU9e3NoYXBlLmFuZ2xlID8/IDYwfVxyXG4gICAgICAgICAgICAgICAgICBtaW49ezMwfVxyXG4gICAgICAgICAgICAgICAgICBtYXg9ezEyMH1cclxuICAgICAgICAgICAgICAgICAgb25JbnB1dD17KGUpID0+IHVwZGF0ZVNoYXBlKGluZGV4LCB7IGFuZ2xlOiBOdW1iZXIoKGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKSB9KX1cclxuICAgICAgICAgICAgICAgICAgY2xhc3M9XCJ3LWZ1bGxcIlxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtemluYy01MDAgdGV4dC1jZW50ZXJcIj57c2hhcGUuYW5nbGUgPz8gNjB9XHUwMEIwPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICB7dHlwZSA9PT0gJ2RvdWJsZS1jaGV2cm9uJyAmJiAoXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm10LTJcIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInRleHQteHMgdGV4dC16aW5jLTUwMCBibG9jayBtYi0xXCI+R2FwPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICB0eXBlPVwicmFuZ2VcIlxyXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17c2hhcGUuZ2FwID8/IDE1fVxyXG4gICAgICAgICAgICAgICAgICBtaW49ezV9XHJcbiAgICAgICAgICAgICAgICAgIG1heD17NDB9XHJcbiAgICAgICAgICAgICAgICAgIG9uSW5wdXQ9eyhlKSA9PiB1cGRhdGVTaGFwZShpbmRleCwgeyBnYXA6IE51bWJlcigoZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUpIH0pfVxyXG4gICAgICAgICAgICAgICAgICBjbGFzcz1cInctZnVsbFwiXHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRleHQteHMgdGV4dC16aW5jLTUwMCB0ZXh0LWNlbnRlclwiPntzaGFwZS5nYXAgPz8gMTV9cHg8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICl9XHJcblxyXG4gICAgICAgIHsvKiBTdGFyL1NwYXJrbGUgY29udHJvbHMgKi99XHJcbiAgICAgICAge2lzU3RhciAmJiAoXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiYm9yZGVyLXQgYm9yZGVyLXppbmMtNzAwIHB0LTIgbXQtMlwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dC14cyB0ZXh0LXppbmMtNDAwIG1iLTJcIj5TdGFyIFNldHRpbmdzPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJncmlkIGdyaWQtY29scy0yIGdhcC0yXCI+XHJcbiAgICAgICAgICAgICAge3R5cGUgPT09ICdzdGFyJyAmJiAoXHJcbiAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtemluYy01MDAgYmxvY2sgbWItMVwiPlBvaW50czwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgIDxOdW1iZXJJbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtzaGFwZS5wb2ludHMgPz8gNX1cclxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHYpID0+IHVwZGF0ZVNoYXBlKGluZGV4LCB7IHBvaW50czogdiB9KX1cclxuICAgICAgICAgICAgICAgICAgICBtaW49ezR9XHJcbiAgICAgICAgICAgICAgICAgICAgbWF4PXs4fVxyXG4gICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwidGV4dC14cyB0ZXh0LXppbmMtNTAwIGJsb2NrIG1iLTFcIj5Jbm5lciBSYWRpdXM8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJyYW5nZVwiXHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXsoc2hhcGUuaW5uZXJSYWRpdXMgPz8gMC40KSAqIDEwMH1cclxuICAgICAgICAgICAgICAgICAgbWluPXsyMH1cclxuICAgICAgICAgICAgICAgICAgbWF4PXs4MH1cclxuICAgICAgICAgICAgICAgICAgb25JbnB1dD17KGUpID0+IHVwZGF0ZVNoYXBlKGluZGV4LCB7IGlubmVyUmFkaXVzOiBOdW1iZXIoKGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKSAvIDEwMCB9KX1cclxuICAgICAgICAgICAgICAgICAgY2xhc3M9XCJ3LWZ1bGxcIlxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtemluYy01MDAgdGV4dC1jZW50ZXJcIj57TWF0aC5yb3VuZCgoc2hhcGUuaW5uZXJSYWRpdXMgPz8gMC40KSAqIDEwMCl9JTwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICl9XHJcblxyXG4gICAgICAgIHsvKiBQYXR0ZXJuIGNvbnRyb2xzICovfVxyXG4gICAgICAgIHtpc1BhdHRlcm4gJiYgKFxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImJvcmRlci10IGJvcmRlci16aW5jLTcwMCBwdC0yIG10LTJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRleHQteHMgdGV4dC16aW5jLTQwMCBtYi0yXCI+UGF0dGVybiBTZXR0aW5nczwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtMlwiPlxyXG4gICAgICAgICAgICAgIHt0eXBlID09PSAnZG90cy1ncmlkJyA/IChcclxuICAgICAgICAgICAgICAgIDw+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwidGV4dC14cyB0ZXh0LXppbmMtNTAwIGJsb2NrIG1iLTFcIj5Sb3dzPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICA8TnVtYmVySW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtzaGFwZS5yb3dzID8/IDR9XHJcbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHYpID0+IHVwZGF0ZVNoYXBlKGluZGV4LCB7IHJvd3M6IHYgfSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICBtaW49ezF9XHJcbiAgICAgICAgICAgICAgICAgICAgICBtYXg9ezEwfVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInRleHQteHMgdGV4dC16aW5jLTUwMCBibG9jayBtYi0xXCI+Q29sdW1uczwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPE51bWJlcklucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17c2hhcGUuY29sdW1ucyA/PyA0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyh2KSA9PiB1cGRhdGVTaGFwZShpbmRleCwgeyBjb2x1bW5zOiB2IH0pfVxyXG4gICAgICAgICAgICAgICAgICAgICAgbWluPXsxfVxyXG4gICAgICAgICAgICAgICAgICAgICAgbWF4PXsxMH1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtemluYy01MDAgYmxvY2sgbWItMVwiPlNwYWNpbmc8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgIDxOdW1iZXJJbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3NoYXBlLnNwYWNpbmcgPz8gMjB9XHJcbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHYpID0+IHVwZGF0ZVNoYXBlKGluZGV4LCB7IHNwYWNpbmc6IHYgfSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICBtaW49ezV9XHJcbiAgICAgICAgICAgICAgICAgICAgICBtYXg9ezUwfVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC8+XHJcbiAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgIDw+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwidGV4dC14cyB0ZXh0LXppbmMtNTAwIGJsb2NrIG1iLTFcIj5Db3VudDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPE51bWJlcklucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17c2hhcGUuY291bnQgPz8gMTJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHYpID0+IHVwZGF0ZVNoYXBlKGluZGV4LCB7IGNvdW50OiB2IH0pfVxyXG4gICAgICAgICAgICAgICAgICAgICAgbWluPXsxfVxyXG4gICAgICAgICAgICAgICAgICAgICAgbWF4PXs1MH1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtemluYy01MDAgYmxvY2sgbWItMVwiPlNlZWQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgIDxOdW1iZXJJbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3NoYXBlLnNlZWQgPz8gMX1cclxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodikgPT4gdXBkYXRlU2hhcGUoaW5kZXgsIHsgc2VlZDogdiB9KX1cclxuICAgICAgICAgICAgICAgICAgICAgIG1pbj17MX1cclxuICAgICAgICAgICAgICAgICAgICAgIG1heD17MTAwfVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC8+XHJcbiAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwidGV4dC14cyB0ZXh0LXppbmMtNTAwIGJsb2NrIG1iLTFcIj5Eb3QgU2l6ZTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8TnVtYmVySW5wdXRcclxuICAgICAgICAgICAgICAgICAgdmFsdWU9e3NoYXBlLmRvdFNpemUgPz8gMn1cclxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyh2KSA9PiB1cGRhdGVTaGFwZShpbmRleCwgeyBkb3RTaXplOiB2IH0pfVxyXG4gICAgICAgICAgICAgICAgICBtaW49ezF9XHJcbiAgICAgICAgICAgICAgICAgIG1heD17MTB9XHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICl9XHJcblxyXG4gICAgICAgIHsvKiBCbG9iIGNvbnRyb2xzICovfVxyXG4gICAgICAgIHtpc0Jsb2IgJiYgKFxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImJvcmRlci10IGJvcmRlci16aW5jLTcwMCBwdC0yIG10LTJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRleHQteHMgdGV4dC16aW5jLTQwMCBtYi0yXCI+QmxvYiBTZXR0aW5nczwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtMlwiPlxyXG4gICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtemluYy01MDAgYmxvY2sgbWItMVwiPkNvbXBsZXhpdHk8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPE51bWJlcklucHV0XHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtzaGFwZS5jb21wbGV4aXR5ID8/IDZ9XHJcbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodikgPT4gdXBkYXRlU2hhcGUoaW5kZXgsIHsgY29tcGxleGl0eTogdiB9KX1cclxuICAgICAgICAgICAgICAgICAgbWluPXszfVxyXG4gICAgICAgICAgICAgICAgICBtYXg9ezh9XHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtemluYy01MDAgYmxvY2sgbWItMVwiPlNlZWQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPE51bWJlcklucHV0XHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtzaGFwZS5zZWVkID8/IDF9XHJcbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodikgPT4gdXBkYXRlU2hhcGUoaW5kZXgsIHsgc2VlZDogdiB9KX1cclxuICAgICAgICAgICAgICAgICAgbWluPXsxfVxyXG4gICAgICAgICAgICAgICAgICBtYXg9ezEwMH1cclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKX1cclxuXHJcbiAgICAgICAgey8qIENyZXNjZW50IGNvbnRyb2xzICovfVxyXG4gICAgICAgIHtpc0NyZXNjZW50ICYmIChcclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJib3JkZXItdCBib3JkZXItemluYy03MDAgcHQtMiBtdC0yXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtemluYy00MDAgbWItMlwiPkNyZXNjZW50IFNldHRpbmdzPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwidGV4dC14cyB0ZXh0LXppbmMtNTAwIGJsb2NrIG1iLTFcIj5BcmMgUGVyY2VudGFnZTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICB0eXBlPVwicmFuZ2VcIlxyXG4gICAgICAgICAgICAgICAgdmFsdWU9e3NoYXBlLmFyY1BlcmNlbnRhZ2UgPz8gNzB9XHJcbiAgICAgICAgICAgICAgICBtaW49ezEwfVxyXG4gICAgICAgICAgICAgICAgbWF4PXs5MH1cclxuICAgICAgICAgICAgICAgIG9uSW5wdXQ9eyhlKSA9PiB1cGRhdGVTaGFwZShpbmRleCwgeyBhcmNQZXJjZW50YWdlOiBOdW1iZXIoKGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKSB9KX1cclxuICAgICAgICAgICAgICAgIGNsYXNzPVwidy1mdWxsXCJcclxuICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtemluYy01MDAgdGV4dC1jZW50ZXJcIj57c2hhcGUuYXJjUGVyY2VudGFnZSA/PyA3MH0lPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKX1cclxuICAgICAgPC8+XHJcbiAgICApO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzPVwic3BhY2UteS0zXCI+XHJcbiAgICAgIHtzaGFwZXMubWFwKChzaGFwZSwgaSkgPT4gKFxyXG4gICAgICAgIDxkaXYga2V5PXtpfSBjbGFzcz1cInAtMyBiZy16aW5jLTgwMC81MCByb3VuZGVkIHNwYWNlLXktMlwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXgganVzdGlmeS1iZXR3ZWVuIGl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cclxuICAgICAgICAgICAgICA8aSBjbGFzcz17YGZhLXNvbGlkICR7U0hBUEVfVFlQRVMuZmluZCgodCkgPT4gdC52YWx1ZSA9PT0gc2hhcGUudHlwZSk/Lmljb24gfHwgJ2ZhLXNoYXBlcyd9IHRleHQtemluYy00MDBgfSAvPlxyXG4gICAgICAgICAgICAgIDxzZWxlY3RcclxuICAgICAgICAgICAgICAgIHZhbHVlPXtzaGFwZS50eXBlfVxyXG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGVTaGFwZShpLCB7IHR5cGU6IChlLnRhcmdldCBhcyBIVE1MU2VsZWN0RWxlbWVudCkudmFsdWUgYXMgU2hhcGVUeXBlIH0pfVxyXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJweC0yIHB5LTEgcm91bmRlZCB0ZXh0LXhzIGJnLXppbmMtNzAwXCJcclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICA8b3B0Z3JvdXAgbGFiZWw9XCJCYXNpY1wiPlxyXG4gICAgICAgICAgICAgICAgICB7U0hBUEVfVFlQRVMuc2xpY2UoMCwgNCkubWFwKCh0KSA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT17dC52YWx1ZX0+e3QubGFiZWx9PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgICAgPC9vcHRncm91cD5cclxuICAgICAgICAgICAgICAgIDxvcHRncm91cCBsYWJlbD1cIkxpbmVzICYgQ3VydmVzXCI+XHJcbiAgICAgICAgICAgICAgICAgIHtTSEFQRV9UWVBFUy5zbGljZSg0LCA3KS5tYXAoKHQpID0+IChcclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXt0LnZhbHVlfT57dC5sYWJlbH08L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICA8L29wdGdyb3VwPlxyXG4gICAgICAgICAgICAgICAgPG9wdGdyb3VwIGxhYmVsPVwiQXJyb3dzICYgQ2hldnJvbnNcIj5cclxuICAgICAgICAgICAgICAgICAge1NIQVBFX1RZUEVTLnNsaWNlKDcsIDEwKS5tYXAoKHQpID0+IChcclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXt0LnZhbHVlfT57dC5sYWJlbH08L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICA8L29wdGdyb3VwPlxyXG4gICAgICAgICAgICAgICAgPG9wdGdyb3VwIGxhYmVsPVwiR2VvbWV0cmljXCI+XHJcbiAgICAgICAgICAgICAgICAgIHtTSEFQRV9UWVBFUy5zbGljZSgxMCwgMTYpLm1hcCgodCkgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e3QudmFsdWV9Pnt0LmxhYmVsfTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgIDwvb3B0Z3JvdXA+XHJcbiAgICAgICAgICAgICAgICA8b3B0Z3JvdXAgbGFiZWw9XCJPcmdhbmljXCI+XHJcbiAgICAgICAgICAgICAgICAgIHtTSEFQRV9UWVBFUy5zbGljZSgxNiwgMTgpLm1hcCgodCkgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e3QudmFsdWV9Pnt0LmxhYmVsfTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgIDwvb3B0Z3JvdXA+XHJcbiAgICAgICAgICAgICAgICA8b3B0Z3JvdXAgbGFiZWw9XCJQYXR0ZXJuc1wiPlxyXG4gICAgICAgICAgICAgICAgICB7U0hBUEVfVFlQRVMuc2xpY2UoMTgpLm1hcCgodCkgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e3QudmFsdWV9Pnt0LmxhYmVsfTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgIDwvb3B0Z3JvdXA+XHJcbiAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleCBnYXAtMVwiPlxyXG4gICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gZHVwbGljYXRlU2hhcGUoaSl9IGNsYXNzPVwidGV4dC16aW5jLTUwMCBob3Zlcjp0ZXh0LXppbmMtMzAwIHB4LTFcIiB0aXRsZT1cIkR1cGxpY2F0ZVwiPlxyXG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYS1zb2xpZCBmYS1jb3B5IHRleHQteHNcIiAvPlxyXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gcmVtb3ZlU2hhcGUoaSl9IGNsYXNzPVwidGV4dC16aW5jLTUwMCBob3Zlcjp0ZXh0LXJlZC00MDAgcHgtMVwiIHRpdGxlPVwiUmVtb3ZlXCI+XHJcbiAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhLXNvbGlkIGZhLXhtYXJrXCIgLz5cclxuICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIHtyZW5kZXJTaGFwZUNvbnRyb2xzKHNoYXBlLCBpKX1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKSl9XHJcblxyXG4gICAgICB7LyogQWRkIFNoYXBlIEJ1dHRvbnMgKi99XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJmbGV4IGdhcC0yXCI+XHJcbiAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgcmVmPXtwcmVzZXRCdXR0b25SZWZ9XHJcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRTaG93UHJlc2V0cygodikgPT4gIXYpfVxyXG4gICAgICAgICAgY2xhc3M9XCJmbGV4LTEgaC04IHRleHQteHMgYmctemluYy04MDAgcm91bmRlZCBob3ZlcjpiZy16aW5jLTcwMCBib3JkZXIgYm9yZGVyLWRhc2hlZCBib3JkZXItemluYy02MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcIlxyXG4gICAgICAgID5cclxuICAgICAgICAgIDxpIGNsYXNzPVwiZmEtc29saWQgZmEtd2FuZC1tYWdpYy1zcGFya2xlcyBtci0xXCIgLz4gQWRkIFByZXNldFxyXG4gICAgICAgICAgPGkgY2xhc3M9e2BmYS1zb2xpZCBtbC0yIHRleHQtWzEwcHhdICR7c2hvd1ByZXNldHMgPyAnZmEtY2hldnJvbi11cCcgOiAnZmEtY2hldnJvbi1kb3duJ31gfSAvPlxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDxidXR0b25cclxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGFkZFNoYXBlKCdyaW5nJyl9XHJcbiAgICAgICAgICBjbGFzcz1cImZsZXgtMSBoLTggdGV4dC14cyBiZy16aW5jLTgwMCByb3VuZGVkIGhvdmVyOmJnLXppbmMtNzAwIGJvcmRlciBib3JkZXItZGFzaGVkIGJvcmRlci16aW5jLTYwMCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiXHJcbiAgICAgICAgPlxyXG4gICAgICAgICAgPGkgY2xhc3M9XCJmYS1zb2xpZCBmYS1wbHVzIG1yLTFcIiAvPiBBZGQgU2hhcGVcclxuICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICB7c2hvd1ByZXNldHMgJiYgKFxyXG4gICAgICAgIDxkaXZcclxuICAgICAgICAgIHJlZj17cHJlc2V0TWVudVJlZn1cclxuICAgICAgICAgIHN0eWxlPXtwcmVzZXRNZW51U3R5bGV9XHJcbiAgICAgICAgICBjbGFzcz1cImJnLXppbmMtODAwIGJvcmRlciBib3JkZXItemluYy03MDAgcm91bmRlZC1sZyBzaGFkb3cteGwgb3ZlcmZsb3cteS1hdXRvXCJcclxuICAgICAgICA+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicHgtMyBweS0yIHRleHQtWzExcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlIHRleHQtemluYy00MDAgYm9yZGVyLWIgYm9yZGVyLXppbmMtNzAwXCI+XHJcbiAgICAgICAgICAgIFNoYXBlIFByZXNldHNcclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAge1NIQVBFX1BSRVNFVFMubWFwKChwcmVzZXQpID0+IChcclxuICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGFkZFByZXNldChwcmVzZXQpfVxyXG4gICAgICAgICAgICAgIGNsYXNzPVwidy1mdWxsIHB4LTMgcHktMi41IHRleHQtbGVmdCBob3ZlcjpiZy16aW5jLTcwMCBib3JkZXItYiBib3JkZXItemluYy03MDAvNjAgbGFzdDpib3JkZXItYi0wXCJcclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtemluYy0xMDBcIj57cHJlc2V0Lm5hbWV9PC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRleHQtWzExcHhdIHRleHQtemluYy00MDBcIj5cclxuICAgICAgICAgICAgICAgIHtwcmVzZXQuc2hhcGVzLmxlbmd0aH0gc2hhcGV7cHJlc2V0LnNoYXBlcy5sZW5ndGggPT09IDEgPyAnJyA6ICdzJ31cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICApKX1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKX1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwgIi8qKlxyXG4gKiBNYXNjb3RFZGl0b3JJbmxpbmUgQ29tcG9uZW50XHJcbiAqIFxyXG4gKiBJbmxpbmUgZWRpdG9yIGZvciBtYW5hZ2luZyBtYXNjb3QgaW1hZ2VzIG9uIHNjcmVlbnNob3RzLlxyXG4gKi9cclxuXHJcbmltcG9ydCB7IFNsaWRlciwgSW1hZ2VTZWxlY3QgfSBmcm9tICcuLi9pbnB1dHMvaW5kZXgudHMnO1xyXG5pbXBvcnQgdHlwZSB7IE1hc2NvdCwgQXNzZXRzLCBDb25maWcgfSBmcm9tICcuLi8uLi90eXBlcy50cyc7XHJcblxyXG5pbnRlcmZhY2UgTWFzY290RWRpdG9ySW5saW5lUHJvcHMge1xyXG4gIG1hc2NvdDogTWFzY290IHwgbnVsbDtcclxuICBhc3NldHM6IEFzc2V0cztcclxuICBjb25maWc6IENvbmZpZztcclxuICBvbkNoYW5nZTogKG1hc2NvdDogTWFzY290IHwgbnVsbCkgPT4gdm9pZDtcclxuICBvbkFzc2V0c1JlZnJlc2g6ICgpID0+IFByb21pc2U8dm9pZD47XHJcbn1cclxuXHJcbmNvbnN0IFBPU0lUSU9OUyA9IFtcclxuICB7IHZhbHVlOiAndG9wLWxlZnQnLCByb3RhdGlvbjogJy00NScsIGxhYmVsOiAnVG9wIExlZnQnIH0sXHJcbiAgeyB2YWx1ZTogJ3RvcC1yaWdodCcsIHJvdGF0aW9uOiAnNDUnLCBsYWJlbDogJ1RvcCBSaWdodCcgfSxcclxuICB7IHZhbHVlOiAnYm90dG9tLWxlZnQnLCByb3RhdGlvbjogJy0xMzUnLCBsYWJlbDogJ0JvdHRvbSBMZWZ0JyB9LFxyXG4gIHsgdmFsdWU6ICdib3R0b20tcmlnaHQnLCByb3RhdGlvbjogJzEzNScsIGxhYmVsOiAnQm90dG9tIFJpZ2h0JyB9LFxyXG5dIGFzIGNvbnN0O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIE1hc2NvdEVkaXRvcklubGluZSh7XHJcbiAgbWFzY290LFxyXG4gIGFzc2V0cyxcclxuICBjb25maWcsXHJcbiAgb25DaGFuZ2UsXHJcbiAgb25Bc3NldHNSZWZyZXNoLFxyXG59OiBNYXNjb3RFZGl0b3JJbmxpbmVQcm9wcykge1xyXG4gIGNvbnN0IGVuYWJsZWQgPSBtYXNjb3QgIT09IG51bGwgJiYgbWFzY290ICE9PSB1bmRlZmluZWQ7XHJcblxyXG4gIGNvbnN0IHRvZ2dsZU1hc2NvdCA9ICgpID0+IHtcclxuICAgIGlmIChlbmFibGVkKSB7XHJcbiAgICAgIG9uQ2hhbmdlKG51bGwpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgb25DaGFuZ2Uoe1xyXG4gICAgICAgIHBvc2l0aW9uOiAnYm90dG9tLXJpZ2h0JyxcclxuICAgICAgICBpbWFnZVBhdGg6IGNvbmZpZy5hcHA/LmRlZmF1bHRNYXNjb3RQYXRoIHx8ICcnLFxyXG4gICAgICAgIHNpemU6IDE1LFxyXG4gICAgICAgIG9mZnNldDogMjAsXHJcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAwLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCB1cGRhdGVNYXNjb3QgPSAodXBkYXRlczogUGFydGlhbDxNYXNjb3Q+KSA9PiB7XHJcbiAgICBpZiAobWFzY290KSB7XHJcbiAgICAgIG9uQ2hhbmdlKHsgLi4ubWFzY290LCAuLi51cGRhdGVzIH0pO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzPVwic3BhY2UteS0zXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJmbGV4IGp1c3RpZnktZW5kXCI+XHJcbiAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgb25DbGljaz17dG9nZ2xlTWFzY290fVxyXG4gICAgICAgICAgY2xhc3M9e2B0ZXh0LXhzIHB4LTMgcHktMS41IHJvdW5kZWQgJHtlbmFibGVkID8gJ2JnLWluZGlnby02MDAnIDogJ2JnLXppbmMtODAwIGhvdmVyOmJnLXppbmMtNzAwJ31gfVxyXG4gICAgICAgID5cclxuICAgICAgICAgIHtlbmFibGVkID8gJ0VuYWJsZWQnIDogJ0FkZCBNYXNjb3QnfVxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIHtlbmFibGVkICYmIG1hc2NvdCAmJiAoXHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInNwYWNlLXktM1wiPlxyXG4gICAgICAgICAgPEltYWdlU2VsZWN0XHJcbiAgICAgICAgICAgIGxhYmVsPVwiSW1hZ2VcIlxyXG4gICAgICAgICAgICB2YWx1ZT17bWFzY290LmltYWdlUGF0aCB8fCBjb25maWcuYXBwPy5kZWZhdWx0TWFzY290UGF0aCB8fCAnJ31cclxuICAgICAgICAgICAgb25DaGFuZ2U9eyh2KSA9PiB1cGRhdGVNYXNjb3QoeyBpbWFnZVBhdGg6IHYgfSl9XHJcbiAgICAgICAgICAgIG9wdGlvbnM9e1suLi4oYXNzZXRzLm1hc2NvdHMgfHwgW10pLCAuLi4oYXNzZXRzLnNjcmVlbnNob3RzIHx8IFtdKV19XHJcbiAgICAgICAgICAgIGNhdGVnb3J5PVwibWFzY290c1wiXHJcbiAgICAgICAgICAgIG9uQXNzZXRzUmVmcmVzaD17b25Bc3NldHNSZWZyZXNofVxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkRlZmF1bHRcIlxyXG4gICAgICAgICAgLz5cclxuXHJcbiAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtemluYy01MDAgYmxvY2sgbWItMVwiPlBvc2l0aW9uPC9sYWJlbD5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTJcIj5cclxuICAgICAgICAgICAgICB7UE9TSVRJT05TLm1hcCgocG9zKSA9PiAoXHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHVwZGF0ZU1hc2NvdCh7IHBvc2l0aW9uOiBwb3MudmFsdWUgfSl9XHJcbiAgICAgICAgICAgICAgICAgIGNsYXNzPXtgcHgtMiBweS0xLjUgcm91bmRlZCB0ZXh0LXhzIGZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjUgJHtcclxuICAgICAgICAgICAgICAgICAgICAobWFzY290LnBvc2l0aW9uIHx8ICdib3R0b20tcmlnaHQnKSA9PT0gcG9zLnZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1pbmRpZ28tNjAwJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgOiAnYmctemluYy04MDAgaG92ZXI6YmctemluYy03MDAnXHJcbiAgICAgICAgICAgICAgICAgIH1gfVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICA8aVxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiZmEtc29saWQgZmEtYXJyb3ctdXBcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHRyYW5zZm9ybTogYHJvdGF0ZSgke3Bvcy5yb3RhdGlvbn1kZWcpYCB9fVxyXG4gICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICB7cG9zLmxhYmVsfVxyXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImdyaWQgZ3JpZC1jb2xzLTMgZ2FwLTNcIj5cclxuICAgICAgICAgICAgPFNsaWRlclxyXG4gICAgICAgICAgICAgIGxhYmVsPVwiU2l6ZVwiXHJcbiAgICAgICAgICAgICAgdmFsdWU9e21hc2NvdC5zaXplID8/IDE1fVxyXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsodikgPT4gdXBkYXRlTWFzY290KHsgc2l6ZTogdiB9KX1cclxuICAgICAgICAgICAgICBtaW49ezV9XHJcbiAgICAgICAgICAgICAgbWF4PXszMH1cclxuICAgICAgICAgICAgICBzdGVwPXsxfVxyXG4gICAgICAgICAgICAgIHVuaXQ9XCIlXCJcclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgPFNsaWRlclxyXG4gICAgICAgICAgICAgIGxhYmVsPVwiT2Zmc2V0XCJcclxuICAgICAgICAgICAgICB2YWx1ZT17bWFzY290Lm9mZnNldCA/PyAyMH1cclxuICAgICAgICAgICAgICBvbkNoYW5nZT17KHYpID0+IHVwZGF0ZU1hc2NvdCh7IG9mZnNldDogdiB9KX1cclxuICAgICAgICAgICAgICBtaW49ezB9XHJcbiAgICAgICAgICAgICAgbWF4PXsxMDB9XHJcbiAgICAgICAgICAgICAgc3RlcD17NX1cclxuICAgICAgICAgICAgICB1bml0PVwicHhcIlxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8U2xpZGVyXHJcbiAgICAgICAgICAgICAgbGFiZWw9XCJSYWRpdXNcIlxyXG4gICAgICAgICAgICAgIHZhbHVlPXttYXNjb3QuYm9yZGVyUmFkaXVzID8/IDB9XHJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyh2KSA9PiB1cGRhdGVNYXNjb3QoeyBib3JkZXJSYWRpdXM6IHYgfSl9XHJcbiAgICAgICAgICAgICAgbWluPXswfVxyXG4gICAgICAgICAgICAgIG1heD17NTB9XHJcbiAgICAgICAgICAgICAgc3RlcD17NX1cclxuICAgICAgICAgICAgICB1bml0PVwiJVwiXHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKX1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwgIi8qKlxyXG4gKiBTY3JlZW5zaG90RWRpdG9yIENvbXBvbmVudFxyXG4gKiBcclxuICogRnVsbCBlZGl0b3IgcGFuZWwgZm9yIGNvbmZpZ3VyaW5nIHNjcmVlbnNob3Qgc2V0dGluZ3MgaW5jbHVkaW5nXHJcbiAqIGNvbnRlbnQsIHR5cG9ncmFwaHksIGxheW91dCwgcGhvbmUgZnJhbWUsIGdsb3dzLCBzaGFwZXMsIGFuZCBtYXNjb3QuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgU2xpZGVyLCBDb2xvcklucHV0LCBJbWFnZVNlbGVjdCB9IGZyb20gJy4uL2lucHV0cy9pbmRleC50cyc7XHJcbmltcG9ydCB7IENvbGxhcHNpYmxlU2VjdGlvbiB9IGZyb20gJy4uL0NvbGxhcHNpYmxlU2VjdGlvbi50c3gnO1xyXG5pbXBvcnQgeyBHbG93RWRpdG9ySW5saW5lIH0gZnJvbSAnLi9HbG93RWRpdG9ySW5saW5lLnRzeCc7XHJcbmltcG9ydCB7IFNoYXBlRWRpdG9ySW5saW5lIH0gZnJvbSAnLi9TaGFwZUVkaXRvcklubGluZS50c3gnO1xyXG5pbXBvcnQgeyBNYXNjb3RFZGl0b3JJbmxpbmUgfSBmcm9tICcuL01hc2NvdEVkaXRvcklubGluZS50c3gnO1xyXG5pbXBvcnQgdHlwZSB7IFNjcmVlbnNob3QsIEFzc2V0cywgQ29uZmlnIH0gZnJvbSAnLi4vLi4vdHlwZXMudHMnO1xyXG5cclxuaW50ZXJmYWNlIFNjcmVlbnNob3RFZGl0b3JQcm9wcyB7XHJcbiAgc2NyZWVuc2hvdDogU2NyZWVuc2hvdDtcclxuICBhc3NldHM6IEFzc2V0cztcclxuICBjb25maWc6IENvbmZpZztcclxuICBvblVwZGF0ZTogKHVwZGF0ZXM6IFBhcnRpYWw8U2NyZWVuc2hvdD4pID0+IHZvaWQ7XHJcbiAgb25VcGRhdGVDb25maWc6IChjb25maWc6IENvbmZpZykgPT4gdm9pZDtcclxuICBvbkFzc2V0c1JlZnJlc2g6ICgpID0+IFByb21pc2U8dm9pZD47XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBTY3JlZW5zaG90RWRpdG9yKHtcclxuICBzY3JlZW5zaG90LFxyXG4gIGFzc2V0cyxcclxuICBjb25maWcsXHJcbiAgb25VcGRhdGUsXHJcbiAgb25VcGRhdGVDb25maWc6IF9vblVwZGF0ZUNvbmZpZyxcclxuICBvbkFzc2V0c1JlZnJlc2gsXHJcbn06IFNjcmVlbnNob3RFZGl0b3JQcm9wcykge1xyXG4gIGNvbnN0IGlzRHVhbCA9IEFycmF5LmlzQXJyYXkoc2NyZWVuc2hvdC5pbWFnZVBhdGgpO1xyXG4gIGNvbnN0IHR5cG8gPSBzY3JlZW5zaG90LnR5cG9ncmFwaHkgfHwge307XHJcblxyXG4gIGNvbnN0IHVwZGF0ZVR5cG9ncmFwaHkgPSAodXBkYXRlczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pID0+IHtcclxuICAgIG9uVXBkYXRlKHsgdHlwb2dyYXBoeTogeyAuLi50eXBvLCAuLi51cGRhdGVzIH0gfSk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3M9XCJlZGl0b3Itc2lkZWJhciBiZy16aW5jLTkwMCBib3JkZXItbCBib3JkZXItemluYy04MDAgb3ZlcmZsb3cteS1hdXRvXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJwLTQgc3BhY2UteS0zXCI+XHJcbiAgICAgICAgPGgyIGNsYXNzPVwiZm9udC1ib2xkIHRleHQtbGcgbWItNFwiPlNjcmVlbnNob3QgRWRpdG9yPC9oMj5cclxuXHJcbiAgICAgICAgey8qIENvbnRlbnQgU2VjdGlvbiAqL31cclxuICAgICAgICA8Q29sbGFwc2libGVTZWN0aW9uIHRpdGxlPVwiQ29udGVudFwiIGRlZmF1bHRPcGVuPXt0cnVlfT5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInRleHQteHMgdGV4dC16aW5jLTUwMCBibG9jayBtYi0xXCI+SGVhZGxpbmU8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXHJcbiAgICAgICAgICAgICAgdmFsdWU9e3NjcmVlbnNob3QuaGVhZGxpbmUgfHwgJyd9XHJcbiAgICAgICAgICAgICAgb25JbnB1dD17KGUpID0+IG9uVXBkYXRlKHsgaGVhZGxpbmU6IChlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSB9KX1cclxuICAgICAgICAgICAgICBjbGFzcz1cInctZnVsbCBweC0zIHB5LTIgcm91bmRlZCB0ZXh0LXNtXCJcclxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIllvdXIgaGVhZGxpbmUgaGVyZS4uLlwiXHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInRleHQteHMgdGV4dC16aW5jLTUwMCBibG9jayBtYi0xXCI+U3VidGl0bGU8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXHJcbiAgICAgICAgICAgICAgdmFsdWU9e3NjcmVlbnNob3Quc3VidGl0bGUgfHwgJyd9XHJcbiAgICAgICAgICAgICAgb25JbnB1dD17KGUpID0+IG9uVXBkYXRlKHsgc3VidGl0bGU6IChlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSB9KX1cclxuICAgICAgICAgICAgICBjbGFzcz1cInctZnVsbCBweC0zIHB5LTIgcm91bmRlZCB0ZXh0LXNtXCJcclxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkEgY29tcGVsbGluZyBzdWJ0aXRsZS4uLlwiXHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L0NvbGxhcHNpYmxlU2VjdGlvbj5cclxuXHJcbiAgICAgICAgey8qIFR5cG9ncmFwaHkgU2VjdGlvbiAqL31cclxuICAgICAgICA8Q29sbGFwc2libGVTZWN0aW9uIHRpdGxlPVwiVHlwb2dyYXBoeVwiIGRlZmF1bHRPcGVuPXtmYWxzZX0+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtM1wiPlxyXG4gICAgICAgICAgICA8U2xpZGVyXHJcbiAgICAgICAgICAgICAgbGFiZWw9XCJIZWFkbGluZSBTaXplXCJcclxuICAgICAgICAgICAgICB2YWx1ZT17dHlwby5oZWFkbGluZUZvbnRTaXplID8/IDUuMn1cclxuICAgICAgICAgICAgICBvbkNoYW5nZT17KHYpID0+IHVwZGF0ZVR5cG9ncmFwaHkoeyBoZWFkbGluZUZvbnRTaXplOiB2IH0pfVxyXG4gICAgICAgICAgICAgIG1pbj17M31cclxuICAgICAgICAgICAgICBtYXg9ezh9XHJcbiAgICAgICAgICAgICAgc3RlcD17MC4xfVxyXG4gICAgICAgICAgICAgIHVuaXQ9XCIlXCJcclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgPFNsaWRlclxyXG4gICAgICAgICAgICAgIGxhYmVsPVwiU3VidGl0bGUgU2l6ZVwiXHJcbiAgICAgICAgICAgICAgdmFsdWU9e3R5cG8uc3VidGl0bGVGb250U2l6ZSA/PyAyLjR9XHJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyh2KSA9PiB1cGRhdGVUeXBvZ3JhcGh5KHsgc3VidGl0bGVGb250U2l6ZTogdiB9KX1cclxuICAgICAgICAgICAgICBtaW49ezEuNX1cclxuICAgICAgICAgICAgICBtYXg9ezR9XHJcbiAgICAgICAgICAgICAgc3RlcD17MC4xfVxyXG4gICAgICAgICAgICAgIHVuaXQ9XCIlXCJcclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtemluYy01MDAgYmxvY2sgbWItMVwiPkhlYWRsaW5lIFdlaWdodDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgPHNlbGVjdFxyXG4gICAgICAgICAgICAgICAgdmFsdWU9e3R5cG8uaGVhZGxpbmVGb250V2VpZ2h0ID8/IDgwMH1cclxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlVHlwb2dyYXBoeSh7IGhlYWRsaW5lRm9udFdlaWdodDogTnVtYmVyKChlLnRhcmdldCBhcyBIVE1MU2VsZWN0RWxlbWVudCkudmFsdWUpIH0pfVxyXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJ3LWZ1bGwgcHgtMyBweS0yIHJvdW5kZWQgdGV4dC1zbVwiXHJcbiAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIjQwMFwiPlJlZ3VsYXIgKDQwMCk8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCI1MDBcIj5NZWRpdW0gKDUwMCk8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCI2MDBcIj5TZW1pYm9sZCAoNjAwKTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIjcwMFwiPkJvbGQgKDcwMCk8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCI4MDBcIj5FeHRyYSBCb2xkICg4MDApPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiOTAwXCI+QmxhY2sgKDkwMCk8L29wdGlvbj5cclxuICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwidGV4dC14cyB0ZXh0LXppbmMtNTAwIGJsb2NrIG1iLTFcIj5TdWJ0aXRsZSBXZWlnaHQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgIDxzZWxlY3RcclxuICAgICAgICAgICAgICAgIHZhbHVlPXt0eXBvLnN1YnRpdGxlRm9udFdlaWdodCA/PyA1MDB9XHJcbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZVR5cG9ncmFwaHkoeyBzdWJ0aXRsZUZvbnRXZWlnaHQ6IE51bWJlcigoZS50YXJnZXQgYXMgSFRNTFNlbGVjdEVsZW1lbnQpLnZhbHVlKSB9KX1cclxuICAgICAgICAgICAgICAgIGNsYXNzPVwidy1mdWxsIHB4LTMgcHktMiByb3VuZGVkIHRleHQtc21cIlxyXG4gICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCI0MDBcIj5SZWd1bGFyICg0MDApPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiNTAwXCI+TWVkaXVtICg1MDApPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiNjAwXCI+U2VtaWJvbGQgKDYwMCk8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCI3MDBcIj5Cb2xkICg3MDApPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtM1wiPlxyXG4gICAgICAgICAgICA8U2xpZGVyXHJcbiAgICAgICAgICAgICAgbGFiZWw9XCJMaW5lIEhlaWdodFwiXHJcbiAgICAgICAgICAgICAgdmFsdWU9e3R5cG8uaGVhZGxpbmVMaW5lSGVpZ2h0ID8/IDEuMTV9XHJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyh2KSA9PiB1cGRhdGVUeXBvZ3JhcGh5KHsgaGVhZGxpbmVMaW5lSGVpZ2h0OiB2IH0pfVxyXG4gICAgICAgICAgICAgIG1pbj17MX1cclxuICAgICAgICAgICAgICBtYXg9ezEuNX1cclxuICAgICAgICAgICAgICBzdGVwPXswLjA1fVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInRleHQteHMgdGV4dC16aW5jLTUwMCBibG9jayBtYi0xXCI+VGV4dCBBbGlnbjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXggZ2FwLTFcIj5cclxuICAgICAgICAgICAgICAgIHsoWydsZWZ0JywgJ2NlbnRlcicsICdyaWdodCddIGFzIGNvbnN0KS5tYXAoKGFsaWduKSA9PiAoXHJcbiAgICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB1cGRhdGVUeXBvZ3JhcGh5KHsgdGV4dEFsaWduOiBhbGlnbiB9KX1cclxuICAgICAgICAgICAgICAgICAgICBjbGFzcz17YGZsZXgtMSBweC0yIHB5LTEuNSByb3VuZGVkIHRleHQteHMgJHtcclxuICAgICAgICAgICAgICAgICAgICAgICh0eXBvLnRleHRBbGlnbiA/PyAnY2VudGVyJykgPT09IGFsaWduID8gJ2JnLWluZGlnby02MDAnIDogJ2JnLXppbmMtODAwIGhvdmVyOmJnLXppbmMtNzAwJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1gfVxyXG4gICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAge2FsaWduLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgYWxpZ24uc2xpY2UoMSl9XHJcbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtM1wiPlxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInRleHQteHMgdGV4dC16aW5jLTUwMCBibG9jayBtYi0xXCI+VGV4dCBDb2xvcjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgPENvbG9ySW5wdXRcclxuICAgICAgICAgICAgICAgIHZhbHVlPXt0eXBvLnRleHRDb2xvciA/PyAnI2ZmZmZmZid9XHJcbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHYpID0+IHVwZGF0ZVR5cG9ncmFwaHkoeyB0ZXh0Q29sb3I6IHYgfSl9XHJcbiAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxTbGlkZXJcclxuICAgICAgICAgICAgICBsYWJlbD1cIlBhZGRpbmdcIlxyXG4gICAgICAgICAgICAgIHZhbHVlPXt0eXBvLmhvcml6b250YWxQYWRkaW5nID8/IDZ9XHJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyh2KSA9PiB1cGRhdGVUeXBvZ3JhcGh5KHsgaG9yaXpvbnRhbFBhZGRpbmc6IHYgfSl9XHJcbiAgICAgICAgICAgICAgbWluPXsyfVxyXG4gICAgICAgICAgICAgIG1heD17MTV9XHJcbiAgICAgICAgICAgICAgc3RlcD17MX1cclxuICAgICAgICAgICAgICB1bml0PVwiJVwiXHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L0NvbGxhcHNpYmxlU2VjdGlvbj5cclxuXHJcbiAgICAgICAgey8qIExheW91dCBTZWN0aW9uICovfVxyXG4gICAgICAgIDxDb2xsYXBzaWJsZVNlY3Rpb24gdGl0bGU9XCJMYXlvdXRcIiBkZWZhdWx0T3Blbj17ZmFsc2V9PlxyXG4gICAgICAgICAgPFNsaWRlclxyXG4gICAgICAgICAgICBsYWJlbD1cIlRpdGxlIE9mZnNldCBmcm9tIFRvcFwiXHJcbiAgICAgICAgICAgIHZhbHVlPXtzY3JlZW5zaG90LmhlYWRsaW5lT2Zmc2V0ID8/IDB9XHJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXsodikgPT4gb25VcGRhdGUoeyBoZWFkbGluZU9mZnNldDogdiB9KX1cclxuICAgICAgICAgICAgbWluPXswfVxyXG4gICAgICAgICAgICBtYXg9ezMwfVxyXG4gICAgICAgICAgICBzdGVwPXsxfVxyXG4gICAgICAgICAgICB1bml0PVwiJVwiXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvQ29sbGFwc2libGVTZWN0aW9uPlxyXG5cclxuICAgICAgICB7LyogSW1hZ2VzIFNlY3Rpb24gKi99XHJcbiAgICAgICAgPENvbGxhcHNpYmxlU2VjdGlvbiB0aXRsZT1cIlBob25lIFNjcmVlbnNob3RcIiBkZWZhdWx0T3Blbj17dHJ1ZX0+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleCBqdXN0aWZ5LWVuZCBtYi0yXCI+XHJcbiAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNEdWFsKSB7XHJcbiAgICAgICAgICAgICAgICAgIG9uVXBkYXRlKHsgaW1hZ2VQYXRoOiAoc2NyZWVuc2hvdC5pbWFnZVBhdGggYXMgc3RyaW5nW10pWzBdIHx8ICcnIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgb25VcGRhdGUoeyBpbWFnZVBhdGg6IFsoc2NyZWVuc2hvdC5pbWFnZVBhdGggYXMgc3RyaW5nKSB8fCAnJywgJyddIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgY2xhc3M9XCJ0ZXh0LXhzIHB4LTMgcHktMS41IGJnLXppbmMtODAwIHJvdW5kZWQgaG92ZXI6YmctemluYy03MDBcIlxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAge2lzRHVhbCA/ICdcdTIxOTAgU2luZ2xlIFBob25lJyA6ICdEdWFsIFBob25lcyBcdTIxOTInfVxyXG4gICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIHtpc0R1YWwgPyAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzcGFjZS15LTNcIj5cclxuICAgICAgICAgICAgICA8SW1hZ2VTZWxlY3RcclxuICAgICAgICAgICAgICAgIGxhYmVsPVwiTGVmdCBQaG9uZVwiXHJcbiAgICAgICAgICAgICAgICB2YWx1ZT17KHNjcmVlbnNob3QuaW1hZ2VQYXRoIGFzIHN0cmluZ1tdKVswXSB8fCAnJ31cclxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodikgPT4gb25VcGRhdGUoeyBpbWFnZVBhdGg6IFt2LCAoc2NyZWVuc2hvdC5pbWFnZVBhdGggYXMgc3RyaW5nW10pWzFdIHx8ICcnXSB9KX1cclxuICAgICAgICAgICAgICAgIG9wdGlvbnM9e2Fzc2V0cy5zY3JlZW5zaG90cyB8fCBbXX1cclxuICAgICAgICAgICAgICAgIGNhdGVnb3J5PVwic2NyZWVuc2hvdHNcIlxyXG4gICAgICAgICAgICAgICAgb25Bc3NldHNSZWZyZXNoPXtvbkFzc2V0c1JlZnJlc2h9XHJcbiAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICA8SW1hZ2VTZWxlY3RcclxuICAgICAgICAgICAgICAgIGxhYmVsPVwiUmlnaHQgUGhvbmVcIlxyXG4gICAgICAgICAgICAgICAgdmFsdWU9eyhzY3JlZW5zaG90LmltYWdlUGF0aCBhcyBzdHJpbmdbXSlbMV0gfHwgJyd9XHJcbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHYpID0+IG9uVXBkYXRlKHsgaW1hZ2VQYXRoOiBbKHNjcmVlbnNob3QuaW1hZ2VQYXRoIGFzIHN0cmluZ1tdKVswXSB8fCAnJywgdl0gfSl9XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zPXthc3NldHMuc2NyZWVuc2hvdHMgfHwgW119XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeT1cInNjcmVlbnNob3RzXCJcclxuICAgICAgICAgICAgICAgIG9uQXNzZXRzUmVmcmVzaD17b25Bc3NldHNSZWZyZXNofVxyXG4gICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgPEltYWdlU2VsZWN0XHJcbiAgICAgICAgICAgICAgdmFsdWU9eyhzY3JlZW5zaG90LmltYWdlUGF0aCBhcyBzdHJpbmcpIHx8ICcnfVxyXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsodikgPT4gb25VcGRhdGUoeyBpbWFnZVBhdGg6IHYgfSl9XHJcbiAgICAgICAgICAgICAgb3B0aW9ucz17YXNzZXRzLnNjcmVlbnNob3RzIHx8IFtdfVxyXG4gICAgICAgICAgICAgIGNhdGVnb3J5PVwic2NyZWVuc2hvdHNcIlxyXG4gICAgICAgICAgICAgIG9uQXNzZXRzUmVmcmVzaD17b25Bc3NldHNSZWZyZXNofVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgKX1cclxuICAgICAgICA8L0NvbGxhcHNpYmxlU2VjdGlvbj5cclxuXHJcbiAgICAgICAgey8qIFBob25lIEZyYW1lIFNlY3Rpb24gKi99XHJcbiAgICAgICAgPENvbGxhcHNpYmxlU2VjdGlvbiB0aXRsZT1cIlBob25lIEZyYW1lXCIgZGVmYXVsdE9wZW49e2ZhbHNlfT5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJncmlkIGdyaWQtY29scy0yIGdhcC0zXCI+XHJcbiAgICAgICAgICAgIDxTbGlkZXJcclxuICAgICAgICAgICAgICBsYWJlbD1cIlNjYWxlXCJcclxuICAgICAgICAgICAgICB2YWx1ZT17c2NyZWVuc2hvdC5waG9uZUZyYW1lPy5zY2FsZSA/PyAoaXNEdWFsID8gNDIgOiA3MCl9XHJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyh2KSA9PiBvblVwZGF0ZSh7IHBob25lRnJhbWU6IHsgLi4uc2NyZWVuc2hvdC5waG9uZUZyYW1lLCBzY2FsZTogdiB9IH0pfVxyXG4gICAgICAgICAgICAgIG1pbj17aXNEdWFsID8gMzAgOiA1MH1cclxuICAgICAgICAgICAgICBtYXg9ezEwMH1cclxuICAgICAgICAgICAgICBzdGVwPXsxfVxyXG4gICAgICAgICAgICAgIHVuaXQ9XCIlXCJcclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgPFNsaWRlclxyXG4gICAgICAgICAgICAgIGxhYmVsPVwiQm90dG9tIE9mZnNldFwiXHJcbiAgICAgICAgICAgICAgdmFsdWU9e3NjcmVlbnNob3QucGhvbmVGcmFtZT8uYm90dG9tT2Zmc2V0ID8/IDZ9XHJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyh2KSA9PiBvblVwZGF0ZSh7IHBob25lRnJhbWU6IHsgLi4uc2NyZWVuc2hvdC5waG9uZUZyYW1lLCBib3R0b21PZmZzZXQ6IHYgfSB9KX1cclxuICAgICAgICAgICAgICBtaW49ezB9XHJcbiAgICAgICAgICAgICAgbWF4PXsxMDB9XHJcbiAgICAgICAgICAgICAgc3RlcD17MX1cclxuICAgICAgICAgICAgICB1bml0PVwiJVwiXHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIHtpc0R1YWwgJiYgKFxyXG4gICAgICAgICAgICAgIDw+XHJcbiAgICAgICAgICAgICAgICA8U2xpZGVyXHJcbiAgICAgICAgICAgICAgICAgIGxhYmVsPVwiUm90YXRpb25cIlxyXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17c2NyZWVuc2hvdC5waG9uZUZyYW1lPy5kdWFsUm90YXRpb24gPz8gNn1cclxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyh2KSA9PiBvblVwZGF0ZSh7IHBob25lRnJhbWU6IHsgLi4uc2NyZWVuc2hvdC5waG9uZUZyYW1lLCBkdWFsUm90YXRpb246IHYgfSB9KX1cclxuICAgICAgICAgICAgICAgICAgbWluPXswfVxyXG4gICAgICAgICAgICAgICAgICBtYXg9ezE1fVxyXG4gICAgICAgICAgICAgICAgICBzdGVwPXsxfVxyXG4gICAgICAgICAgICAgICAgICB1bml0PVwiXHUwMEIwXCJcclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8U2xpZGVyXHJcbiAgICAgICAgICAgICAgICAgIGxhYmVsPVwiR2FwXCJcclxuICAgICAgICAgICAgICAgICAgdmFsdWU9e3NjcmVlbnNob3QucGhvbmVGcmFtZT8uZHVhbEdhcCA/PyAyfVxyXG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHYpID0+IG9uVXBkYXRlKHsgcGhvbmVGcmFtZTogeyAuLi5zY3JlZW5zaG90LnBob25lRnJhbWUsIGR1YWxHYXA6IHYgfSB9KX1cclxuICAgICAgICAgICAgICAgICAgbWluPXswfVxyXG4gICAgICAgICAgICAgICAgICBtYXg9ezEwfVxyXG4gICAgICAgICAgICAgICAgICBzdGVwPXswLjV9XHJcbiAgICAgICAgICAgICAgICAgIHVuaXQ9XCIlXCJcclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgPC8+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L0NvbGxhcHNpYmxlU2VjdGlvbj5cclxuXHJcbiAgICAgICAgey8qIEdsb3dzIFNlY3Rpb24gKi99XHJcbiAgICAgICAgPENvbGxhcHNpYmxlU2VjdGlvbiB0aXRsZT1cIkJhY2tncm91bmQgR2xvd3NcIiBkZWZhdWx0T3Blbj17ZmFsc2V9PlxyXG4gICAgICAgICAgPEdsb3dFZGl0b3JJbmxpbmVcclxuICAgICAgICAgICAgZ2xvd3M9e3NjcmVlbnNob3QuZ2xvd3MgfHwgW119XHJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZ2xvd3MpID0+IG9uVXBkYXRlKHsgZ2xvd3MgfSl9XHJcbiAgICAgICAgICAgIHBhbGV0dGU9e2NvbmZpZy5wYWxldHRlfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L0NvbGxhcHNpYmxlU2VjdGlvbj5cclxuXHJcbiAgICAgICAgey8qIFNoYXBlcyBTZWN0aW9uICovfVxyXG4gICAgICAgIDxDb2xsYXBzaWJsZVNlY3Rpb24gdGl0bGU9XCJEZWNvcmF0aXZlIFNoYXBlc1wiIGRlZmF1bHRPcGVuPXtmYWxzZX0+XHJcbiAgICAgICAgICA8U2hhcGVFZGl0b3JJbmxpbmVcclxuICAgICAgICAgICAgc2hhcGVzPXtzY3JlZW5zaG90LnNoYXBlcyB8fCBbXX1cclxuICAgICAgICAgICAgb25DaGFuZ2U9eyhzaGFwZXMpID0+IG9uVXBkYXRlKHsgc2hhcGVzIH0pfVxyXG4gICAgICAgICAgICBwYWxldHRlPXtjb25maWcucGFsZXR0ZX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9Db2xsYXBzaWJsZVNlY3Rpb24+XHJcblxyXG4gICAgICAgIHsvKiBNYXNjb3QgU2VjdGlvbiAqL31cclxuICAgICAgICA8Q29sbGFwc2libGVTZWN0aW9uIHRpdGxlPVwiTWFzY290XCIgZGVmYXVsdE9wZW49e2ZhbHNlfT5cclxuICAgICAgICAgIDxNYXNjb3RFZGl0b3JJbmxpbmVcclxuICAgICAgICAgICAgbWFzY290PXtzY3JlZW5zaG90Lm1hc2NvdCB8fCBudWxsfVxyXG4gICAgICAgICAgICBhc3NldHM9e2Fzc2V0c31cclxuICAgICAgICAgICAgY29uZmlnPXtjb25maWd9XHJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXsobWFzY290KSA9PiBvblVwZGF0ZSh7IG1hc2NvdCB9KX1cclxuICAgICAgICAgICAgb25Bc3NldHNSZWZyZXNoPXtvbkFzc2V0c1JlZnJlc2h9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvQ29sbGFwc2libGVTZWN0aW9uPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwgIi8qKlxyXG4gKiBGZWF0dXJlR3JhcGhpY0VkaXRvciBDb21wb25lbnRcclxuICogXHJcbiAqIEZ1bGwgZWRpdG9yIHBhbmVsIGZvciBjb25maWd1cmluZyBmZWF0dXJlIGdyYXBoaWMgc2V0dGluZ3MgaW5jbHVkaW5nXHJcbiAqIGNvbnRlbnQsIGljb24sIHBob25lIHNjcmVlbnNob3QsIGdsb3dzLCBzaGFwZXMsIGFuZCBtYXNjb3QuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgU2xpZGVyLCBMYWJlbGVkQ29sb3JJbnB1dCwgSW1hZ2VTZWxlY3QgfSBmcm9tICcuLi9pbnB1dHMvaW5kZXgudHMnO1xyXG5pbXBvcnQgeyBDb2xsYXBzaWJsZVNlY3Rpb24gfSBmcm9tICcuLi9Db2xsYXBzaWJsZVNlY3Rpb24udHN4JztcclxuaW1wb3J0IHsgR2xvd0VkaXRvcklubGluZSB9IGZyb20gJy4vR2xvd0VkaXRvcklubGluZS50c3gnO1xyXG5pbXBvcnQgeyBTaGFwZUVkaXRvcklubGluZSB9IGZyb20gJy4vU2hhcGVFZGl0b3JJbmxpbmUudHN4JztcclxuaW1wb3J0IHsgTWFzY290RWRpdG9ySW5saW5lIH0gZnJvbSAnLi9NYXNjb3RFZGl0b3JJbmxpbmUudHN4JztcclxuaW1wb3J0IHR5cGUgeyBGZWF0dXJlR3JhcGhpYywgQXNzZXRzLCBDb25maWcgfSBmcm9tICcuLi8uLi90eXBlcy50cyc7XHJcblxyXG5pbnRlcmZhY2UgRmVhdHVyZUdyYXBoaWNFZGl0b3JQcm9wcyB7XHJcbiAgZmVhdHVyZUdyYXBoaWM6IEZlYXR1cmVHcmFwaGljO1xyXG4gIGFzc2V0czogQXNzZXRzO1xyXG4gIGNvbmZpZzogQ29uZmlnO1xyXG4gIG9uVXBkYXRlOiAodXBkYXRlczogUGFydGlhbDxGZWF0dXJlR3JhcGhpYz4pID0+IHZvaWQ7XHJcbiAgb25VcGRhdGVDb25maWc6IChjb25maWc6IENvbmZpZykgPT4gdm9pZDtcclxuICBvbkFzc2V0c1JlZnJlc2g6ICgpID0+IFByb21pc2U8dm9pZD47XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBGZWF0dXJlR3JhcGhpY0VkaXRvcih7XHJcbiAgZmVhdHVyZUdyYXBoaWMsXHJcbiAgYXNzZXRzLFxyXG4gIGNvbmZpZyxcclxuICBvblVwZGF0ZSxcclxuICBvblVwZGF0ZUNvbmZpZyxcclxuICBvbkFzc2V0c1JlZnJlc2gsXHJcbn06IEZlYXR1cmVHcmFwaGljRWRpdG9yUHJvcHMpIHtcclxuICBjb25zdCBmZyA9IGZlYXR1cmVHcmFwaGljIHx8ICh7fSBhcyBGZWF0dXJlR3JhcGhpYyk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzPVwiZWRpdG9yLXNpZGViYXIgYmctemluYy05MDAgYm9yZGVyLWwgYm9yZGVyLXppbmMtODAwIG92ZXJmbG93LXktYXV0b1wiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicC00IHNwYWNlLXktM1wiPlxyXG4gICAgICAgIDxoMiBjbGFzcz1cImZvbnQtYm9sZCB0ZXh0LWxnIG1iLTRcIj5GZWF0dXJlIEdyYXBoaWM8L2gyPlxyXG5cclxuICAgICAgICB7LyogQ29udGVudCBTZWN0aW9uICovfVxyXG4gICAgICAgIDxDb2xsYXBzaWJsZVNlY3Rpb24gdGl0bGU9XCJDb250ZW50XCIgZGVmYXVsdE9wZW49e3RydWV9PlxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwidGV4dC14cyB0ZXh0LXppbmMtNTAwIGJsb2NrIG1iLTFcIj5IZWFkbGluZTwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgICAgICB2YWx1ZT17ZmcuaGVhZGxpbmUgfHwgJyd9XHJcbiAgICAgICAgICAgICAgb25JbnB1dD17KGUpID0+IG9uVXBkYXRlKHsgaGVhZGxpbmU6IChlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSB9KX1cclxuICAgICAgICAgICAgICBjbGFzcz1cInctZnVsbCBweC0zIHB5LTIgcm91bmRlZCB0ZXh0LXNtXCJcclxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIllvdXIgaGVhZGxpbmUgaGVyZS4uLlwiXHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInRleHQteHMgdGV4dC16aW5jLTUwMCBibG9jayBtYi0xXCI+U3VidGl0bGU8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXHJcbiAgICAgICAgICAgICAgdmFsdWU9e2ZnLnN1YnRpdGxlIHx8ICcnfVxyXG4gICAgICAgICAgICAgIG9uSW5wdXQ9eyhlKSA9PiBvblVwZGF0ZSh7IHN1YnRpdGxlOiAoZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgfSl9XHJcbiAgICAgICAgICAgICAgY2xhc3M9XCJ3LWZ1bGwgcHgtMyBweS0yIHJvdW5kZWQgdGV4dC1zbVwiXHJcbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJBIGNvbXBlbGxpbmcgc3VidGl0bGUuLi5cIlxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleCBnYXAtNCBwdC0yXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHRleHQtc20gY3Vyc29yLXBvaW50ZXJcIj5cclxuICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXHJcbiAgICAgICAgICAgICAgICBjaGVja2VkPXtmZy5zaG93SWNvbiAhPT0gZmFsc2V9XHJcbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IG9uVXBkYXRlKHsgc2hvd0ljb246IChlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkIH0pfVxyXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJyb3VuZGVkXCJcclxuICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgIFNob3cgQXBwIEljb25cclxuICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgdGV4dC1zbSBjdXJzb3ItcG9pbnRlclwiPlxyXG4gICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcclxuICAgICAgICAgICAgICAgIGNoZWNrZWQ9e2ZnLnNob3dBcHBOYW1lICE9PSBmYWxzZX1cclxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gb25VcGRhdGUoeyBzaG93QXBwTmFtZTogKGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQgfSl9XHJcbiAgICAgICAgICAgICAgICBjbGFzcz1cInJvdW5kZWRcIlxyXG4gICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgU2hvdyBBcHAgTmFtZVxyXG4gICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIHtmZy5zaG93SWNvbiAhPT0gZmFsc2UgJiYgKFxyXG4gICAgICAgICAgICA8PlxyXG4gICAgICAgICAgICAgIDxJbWFnZVNlbGVjdFxyXG4gICAgICAgICAgICAgICAgbGFiZWw9XCJBcHAgSWNvblwiXHJcbiAgICAgICAgICAgICAgICB2YWx1ZT17Y29uZmlnLmFwcD8uaWNvblBhdGggfHwgJyd9XHJcbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHYpID0+IG9uVXBkYXRlQ29uZmlnKHsgLi4uY29uZmlnLCBhcHA6IHsgLi4uY29uZmlnLmFwcCwgaWNvblBhdGg6IHYgfSB9KX1cclxuICAgICAgICAgICAgICAgIG9wdGlvbnM9e2Fzc2V0cy5pY29ucyB8fCBbXX1cclxuICAgICAgICAgICAgICAgIGNhdGVnb3J5PVwiaWNvbnNcIlxyXG4gICAgICAgICAgICAgICAgb25Bc3NldHNSZWZyZXNoPXtvbkFzc2V0c1JlZnJlc2h9XHJcbiAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dC14cyB0ZXh0LXppbmMtNDAwIG10LTMgbWItMVwiPkljb24gQm94PC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTNcIj5cclxuICAgICAgICAgICAgICAgIDxTbGlkZXJcclxuICAgICAgICAgICAgICAgICAgbGFiZWw9XCJTaXplXCJcclxuICAgICAgICAgICAgICAgICAgdmFsdWU9e2ZnLmljb25Cb3hTY2FsZSA/PyAxMDB9XHJcbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodikgPT4gb25VcGRhdGUoeyBpY29uQm94U2NhbGU6IHYgfSl9XHJcbiAgICAgICAgICAgICAgICAgIG1pbj17NTB9XHJcbiAgICAgICAgICAgICAgICAgIG1heD17MjAwfVxyXG4gICAgICAgICAgICAgICAgICBzdGVwPXs1fVxyXG4gICAgICAgICAgICAgICAgICB1bml0PVwiJVwiXHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPFNsaWRlclxyXG4gICAgICAgICAgICAgICAgICBsYWJlbD1cIlJhZGl1c1wiXHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtmZy5pY29uQm94UmFkaXVzID8/IDE2fVxyXG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHYpID0+IG9uVXBkYXRlKHsgaWNvbkJveFJhZGl1czogdiB9KX1cclxuICAgICAgICAgICAgICAgICAgbWluPXswfVxyXG4gICAgICAgICAgICAgICAgICBtYXg9ezUwfVxyXG4gICAgICAgICAgICAgICAgICBzdGVwPXsxfVxyXG4gICAgICAgICAgICAgICAgICB1bml0PVwicHhcIlxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8TGFiZWxlZENvbG9ySW5wdXRcclxuICAgICAgICAgICAgICAgIGxhYmVsPVwiQmFja2dyb3VuZFwiXHJcbiAgICAgICAgICAgICAgICB2YWx1ZT17ZmcuaWNvbkJveENvbG9yIHx8ICdyZ2JhKDI1NSwyNTUsMjU1LDAuMTUpJ31cclxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodikgPT4gb25VcGRhdGUoeyBpY29uQm94Q29sb3I6IHYgfSl9XHJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cInJnYmEoMjU1LDI1NSwyNTUsMC4xNSlcIlxyXG4gICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRleHQteHMgdGV4dC16aW5jLTQwMCBtdC0zIG1iLTFcIj5JY29uIEltYWdlPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTNcIj5cclxuICAgICAgICAgICAgICAgIDxTbGlkZXJcclxuICAgICAgICAgICAgICAgICAgbGFiZWw9XCJTY2FsZVwiXHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtmZy5pY29uU2NhbGUgPz8gMTAwfVxyXG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHYpID0+IG9uVXBkYXRlKHsgaWNvblNjYWxlOiB2IH0pfVxyXG4gICAgICAgICAgICAgICAgICBtaW49ezUwfVxyXG4gICAgICAgICAgICAgICAgICBtYXg9ezE1MH1cclxuICAgICAgICAgICAgICAgICAgc3RlcD17NX1cclxuICAgICAgICAgICAgICAgICAgdW5pdD1cIiVcIlxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDxTbGlkZXJcclxuICAgICAgICAgICAgICAgICAgbGFiZWw9XCJSYWRpdXNcIlxyXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17ZmcuaWNvblJhZGl1cyA/PyAwfVxyXG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHYpID0+IG9uVXBkYXRlKHsgaWNvblJhZGl1czogdiB9KX1cclxuICAgICAgICAgICAgICAgICAgbWluPXswfVxyXG4gICAgICAgICAgICAgICAgICBtYXg9ezUwfVxyXG4gICAgICAgICAgICAgICAgICBzdGVwPXsxfVxyXG4gICAgICAgICAgICAgICAgICB1bml0PVwicHhcIlxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDxTbGlkZXJcclxuICAgICAgICAgICAgICAgICAgbGFiZWw9XCJPZmZzZXQgWFwiXHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtmZy5pY29uT2Zmc2V0WCA/PyAwfVxyXG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHYpID0+IG9uVXBkYXRlKHsgaWNvbk9mZnNldFg6IHYgfSl9XHJcbiAgICAgICAgICAgICAgICAgIG1pbj17LTIwfVxyXG4gICAgICAgICAgICAgICAgICBtYXg9ezIwfVxyXG4gICAgICAgICAgICAgICAgICBzdGVwPXsxfVxyXG4gICAgICAgICAgICAgICAgICB1bml0PVwicHhcIlxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDxTbGlkZXJcclxuICAgICAgICAgICAgICAgICAgbGFiZWw9XCJPZmZzZXQgWVwiXHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtmZy5pY29uT2Zmc2V0WSA/PyAwfVxyXG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHYpID0+IG9uVXBkYXRlKHsgaWNvbk9mZnNldFk6IHYgfSl9XHJcbiAgICAgICAgICAgICAgICAgIG1pbj17LTIwfVxyXG4gICAgICAgICAgICAgICAgICBtYXg9ezIwfVxyXG4gICAgICAgICAgICAgICAgICBzdGVwPXsxfVxyXG4gICAgICAgICAgICAgICAgICB1bml0PVwicHhcIlxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC8+XHJcbiAgICAgICAgICApfVxyXG4gICAgICAgIDwvQ29sbGFwc2libGVTZWN0aW9uPlxyXG5cclxuICAgICAgICB7LyogUGhvbmUgU2NyZWVuc2hvdCBTZWN0aW9uICovfVxyXG4gICAgICAgIDxDb2xsYXBzaWJsZVNlY3Rpb24gdGl0bGU9XCJQaG9uZSBTY3JlZW5zaG90XCIgZGVmYXVsdE9wZW49e3RydWV9PlxyXG4gICAgICAgICAgPEltYWdlU2VsZWN0XHJcbiAgICAgICAgICAgIGxhYmVsPVwiSW1hZ2VcIlxyXG4gICAgICAgICAgICB2YWx1ZT17ZmcuaW1hZ2VQYXRoIHx8ICcnfVxyXG4gICAgICAgICAgICBvbkNoYW5nZT17KHYpID0+IG9uVXBkYXRlKHsgaW1hZ2VQYXRoOiB2IH0pfVxyXG4gICAgICAgICAgICBvcHRpb25zPXthc3NldHMuc2NyZWVuc2hvdHMgfHwgW119XHJcbiAgICAgICAgICAgIGNhdGVnb3J5PVwic2NyZWVuc2hvdHNcIlxyXG4gICAgICAgICAgICBvbkFzc2V0c1JlZnJlc2g9e29uQXNzZXRzUmVmcmVzaH1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtM1wiPlxyXG4gICAgICAgICAgICA8U2xpZGVyXHJcbiAgICAgICAgICAgICAgbGFiZWw9XCJSb3RhdGlvblwiXHJcbiAgICAgICAgICAgICAgdmFsdWU9e2ZnLnBob25lUm90YXRpb24gPz8gNX1cclxuICAgICAgICAgICAgICBvbkNoYW5nZT17KHYpID0+IG9uVXBkYXRlKHsgcGhvbmVSb3RhdGlvbjogdiB9KX1cclxuICAgICAgICAgICAgICBtaW49ey0xNX1cclxuICAgICAgICAgICAgICBtYXg9ezE1fVxyXG4gICAgICAgICAgICAgIHN0ZXA9ezF9XHJcbiAgICAgICAgICAgICAgdW5pdD1cIlx1MDBCMFwiXHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDxTbGlkZXJcclxuICAgICAgICAgICAgICBsYWJlbD1cIlNjYWxlXCJcclxuICAgICAgICAgICAgICB2YWx1ZT17ZmcucGhvbmVTY2FsZSA/PyAxMDB9XHJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyh2KSA9PiBvblVwZGF0ZSh7IHBob25lU2NhbGU6IHYgfSl9XHJcbiAgICAgICAgICAgICAgbWluPXs1MH1cclxuICAgICAgICAgICAgICBtYXg9ezE1MH1cclxuICAgICAgICAgICAgICBzdGVwPXs1fVxyXG4gICAgICAgICAgICAgIHVuaXQ9XCIlXCJcclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvQ29sbGFwc2libGVTZWN0aW9uPlxyXG5cclxuICAgICAgICB7LyogR2xvd3MgU2VjdGlvbiAqL31cclxuICAgICAgICA8Q29sbGFwc2libGVTZWN0aW9uIHRpdGxlPVwiQmFja2dyb3VuZCBHbG93c1wiIGRlZmF1bHRPcGVuPXtmYWxzZX0+XHJcbiAgICAgICAgICA8R2xvd0VkaXRvcklubGluZVxyXG4gICAgICAgICAgICBnbG93cz17ZmcuZ2xvd3MgfHwgW119XHJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZ2xvd3MpID0+IG9uVXBkYXRlKHsgZ2xvd3MgfSl9XHJcbiAgICAgICAgICAgIHBhbGV0dGU9e2NvbmZpZy5wYWxldHRlfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L0NvbGxhcHNpYmxlU2VjdGlvbj5cclxuXHJcbiAgICAgICAgey8qIFNoYXBlcyBTZWN0aW9uICovfVxyXG4gICAgICAgIDxDb2xsYXBzaWJsZVNlY3Rpb24gdGl0bGU9XCJEZWNvcmF0aXZlIFNoYXBlc1wiIGRlZmF1bHRPcGVuPXtmYWxzZX0+XHJcbiAgICAgICAgICA8U2hhcGVFZGl0b3JJbmxpbmVcclxuICAgICAgICAgICAgc2hhcGVzPXtmZy5zaGFwZXMgfHwgW119XHJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoc2hhcGVzKSA9PiBvblVwZGF0ZSh7IHNoYXBlcyB9KX1cclxuICAgICAgICAgICAgcGFsZXR0ZT17Y29uZmlnLnBhbGV0dGV9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvQ29sbGFwc2libGVTZWN0aW9uPlxyXG5cclxuICAgICAgICB7LyogTWFzY290IFNlY3Rpb24gKi99XHJcbiAgICAgICAgPENvbGxhcHNpYmxlU2VjdGlvbiB0aXRsZT1cIk1hc2NvdFwiIGRlZmF1bHRPcGVuPXtmYWxzZX0+XHJcbiAgICAgICAgICA8TWFzY290RWRpdG9ySW5saW5lXHJcbiAgICAgICAgICAgIG1hc2NvdD17ZmcubWFzY290IHx8IG51bGx9XHJcbiAgICAgICAgICAgIGFzc2V0cz17YXNzZXRzfVxyXG4gICAgICAgICAgICBjb25maWc9e2NvbmZpZ31cclxuICAgICAgICAgICAgb25DaGFuZ2U9eyhtYXNjb3QpID0+IG9uVXBkYXRlKHsgbWFzY290IH0pfVxyXG4gICAgICAgICAgICBvbkFzc2V0c1JlZnJlc2g9e29uQXNzZXRzUmVmcmVzaH1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9Db2xsYXBzaWJsZVNlY3Rpb24+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCAiLyoqXHJcbiAqIFByb2plY3RNb2RhbCBDb21wb25lbnRcclxuICogXHJcbiAqIE1vZGFsIGZvciBtYW5hZ2luZyBwcm9qZWN0cyAoY3JlYXRlLCBzd2l0Y2gsIHJlbmFtZSwgZGVsZXRlKS5cclxuICovXHJcblxyXG5pbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB0eXBlIHsgUHJvamVjdEluZm8gfSBmcm9tICcuLi8uLi90eXBlcy50cyc7XHJcblxyXG5pbnRlcmZhY2UgUHJvamVjdE1vZGFsUHJvcHMge1xyXG4gIHByb2plY3RzOiBQcm9qZWN0SW5mb1tdO1xyXG4gIGN1cnJlbnRQcm9qZWN0OiBzdHJpbmcgfCBudWxsO1xyXG4gIG9uQ2xvc2U6ICgpID0+IHZvaWQ7XHJcbiAgb25DcmVhdGU6IChuYW1lOiBzdHJpbmcpID0+IFByb21pc2U8dm9pZD47XHJcbiAgb25Td2l0Y2g6IChwcm9qZWN0SWQ6IHN0cmluZykgPT4gdm9pZDtcclxuICBvbkRlbGV0ZTogKHByb2plY3RJZDogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+O1xyXG4gIG9uUmVuYW1lOiAocHJvamVjdElkOiBzdHJpbmcsIG5ld05hbWU6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFByb2plY3RNb2RhbCh7XHJcbiAgcHJvamVjdHMsXHJcbiAgY3VycmVudFByb2plY3QsXHJcbiAgb25DbG9zZSxcclxuICBvbkNyZWF0ZSxcclxuICBvblN3aXRjaCxcclxuICBvbkRlbGV0ZSxcclxuICBvblJlbmFtZSxcclxufTogUHJvamVjdE1vZGFsUHJvcHMpIHtcclxuICBjb25zdCBbbmV3TmFtZSwgc2V0TmV3TmFtZV0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgY29uc3QgW2NvbmZpcm1EZWxldGUsIHNldENvbmZpcm1EZWxldGVdID0gdXNlU3RhdGU8c3RyaW5nIHwgbnVsbD4obnVsbCk7XHJcbiAgY29uc3QgW2VkaXRpbmdQcm9qZWN0LCBzZXRFZGl0aW5nUHJvamVjdF0gPSB1c2VTdGF0ZTxzdHJpbmcgfCBudWxsPihudWxsKTtcclxuICBjb25zdCBbZWRpdE5hbWUsIHNldEVkaXROYW1lXSA9IHVzZVN0YXRlKCcnKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlQ3JlYXRlID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgaWYgKCFuZXdOYW1lLnRyaW0oKSkgcmV0dXJuO1xyXG4gICAgYXdhaXQgb25DcmVhdGUobmV3TmFtZS50cmltKCkpO1xyXG4gICAgc2V0TmV3TmFtZSgnJyk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgaGFuZGxlRGVsZXRlID0gYXN5bmMgKHByb2plY3RJZDogc3RyaW5nKSA9PiB7XHJcbiAgICBhd2FpdCBvbkRlbGV0ZShwcm9qZWN0SWQpO1xyXG4gICAgc2V0Q29uZmlybURlbGV0ZShudWxsKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBoYW5kbGVSZW5hbWUgPSBhc3luYyAocHJvamVjdElkOiBzdHJpbmcpID0+IHtcclxuICAgIGlmIChlZGl0TmFtZS50cmltKCkpIHtcclxuICAgICAgYXdhaXQgb25SZW5hbWUocHJvamVjdElkLCBlZGl0TmFtZS50cmltKCkpO1xyXG4gICAgICBzZXRFZGl0aW5nUHJvamVjdChudWxsKTtcclxuICAgICAgc2V0RWRpdE5hbWUoJycpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IHN0YXJ0RWRpdGluZyA9IChwcm9qZWN0OiBQcm9qZWN0SW5mbykgPT4ge1xyXG4gICAgc2V0RWRpdGluZ1Byb2plY3QocHJvamVjdC5pZCk7XHJcbiAgICBzZXRFZGl0TmFtZShwcm9qZWN0Lm5hbWUpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzPVwiZml4ZWQgaW5zZXQtMCBiZy1ibGFjay83MCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciB6LTUwXCIgb25DbGljaz17b25DbG9zZX0+XHJcbiAgICAgIDxkaXZcclxuICAgICAgICBjbGFzcz1cImJnLXppbmMtOTAwIHJvdW5kZWQtbGcgcC02IHctOTYgbWF4LWgtWzgwdmhdIG92ZXJmbG93LXktYXV0b1wiXHJcbiAgICAgICAgb25DbGljaz17KGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCl9XHJcbiAgICAgID5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyIG1iLTRcIj5cclxuICAgICAgICAgIDxoMiBjbGFzcz1cImZvbnQtYm9sZCB0ZXh0LWxnXCI+UHJvamVjdHM8L2gyPlxyXG4gICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkNsb3NlfSBjbGFzcz1cInRleHQtemluYy01MDAgaG92ZXI6dGV4dC13aGl0ZSB0ZXh0LXhsXCI+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEtc29saWQgZmEteG1hcmtcIiAvPlxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIHsvKiBDcmVhdGUgbmV3ICovfVxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtYi00IHAtMyBiZy16aW5jLTgwMC81MCByb3VuZGVkXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dC1zbSB0ZXh0LXppbmMtNDAwIG1iLTJcIj5DcmVhdGUgTmV3IFByb2plY3Q8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4IGdhcC0yXCI+XHJcbiAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgICAgICB2YWx1ZT17bmV3TmFtZX1cclxuICAgICAgICAgICAgICBvbklucHV0PXsoZSkgPT4gc2V0TmV3TmFtZSgoZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUpfVxyXG4gICAgICAgICAgICAgIG9uS2V5RG93bj17KGUpID0+IGUua2V5ID09PSAnRW50ZXInICYmIGhhbmRsZUNyZWF0ZSgpfVxyXG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiUHJvamVjdCBuYW1lXCJcclxuICAgICAgICAgICAgICBjbGFzcz1cImZsZXgtMSBweC0zIHB5LTIgcm91bmRlZCB0ZXh0LXNtIGJnLXppbmMtODAwIGJvcmRlciBib3JkZXItemluYy03MDBcIlxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlQ3JlYXRlfVxyXG4gICAgICAgICAgICAgIGRpc2FibGVkPXshbmV3TmFtZS50cmltKCl9XHJcbiAgICAgICAgICAgICAgY2xhc3M9XCJweC00IHB5LTIgYmctaW5kaWdvLTYwMCBob3ZlcjpiZy1pbmRpZ28tNTAwIHJvdW5kZWQgdGV4dC1zbSBkaXNhYmxlZDpvcGFjaXR5LTUwXCJcclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIENyZWF0ZVxyXG4gICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICB7LyogUHJvamVjdCBsaXN0ICovfVxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzcGFjZS15LTJcIj5cclxuICAgICAgICAgIHtwcm9qZWN0cy5tYXAoKHApID0+IChcclxuICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgIGtleT17cC5pZH1cclxuICAgICAgICAgICAgICBjbGFzcz17YHAtMyByb3VuZGVkIGJvcmRlciAke1xyXG4gICAgICAgICAgICAgICAgY3VycmVudFByb2plY3QgPT09IHAuaWRcclxuICAgICAgICAgICAgICAgICAgPyAnYmctaW5kaWdvLTkwMC81MCBib3JkZXItaW5kaWdvLTUwMCdcclxuICAgICAgICAgICAgICAgICAgOiAnYmctemluYy04MDAvNTAgYm9yZGVyLXRyYW5zcGFyZW50IGhvdmVyOmJnLXppbmMtODAwJ1xyXG4gICAgICAgICAgICAgIH1gfVxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAge2VkaXRpbmdQcm9qZWN0ID09PSBwLmlkID8gKFxyXG4gICAgICAgICAgICAgICAgLy8gUmVuYW1lIG1vZGVcclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4IGdhcC0yXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17ZWRpdE5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgb25JbnB1dD17KGUpID0+IHNldEVkaXROYW1lKChlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSl9XHJcbiAgICAgICAgICAgICAgICAgICAgb25LZXlEb3duPXsoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgaWYgKGUua2V5ID09PSAnRW50ZXInKSBoYW5kbGVSZW5hbWUocC5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSBzZXRFZGl0aW5nUHJvamVjdChudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiZmxleC0xIHB4LTIgcHktMSByb3VuZGVkIHRleHQtc20gYmctemluYy04MDAgYm9yZGVyIGJvcmRlci16aW5jLTcwMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgYXV0b0ZvY3VzXHJcbiAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVSZW5hbWUocC5pZCl9XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJweC0yIHB5LTEgYmctZ3JlZW4tNjAwIGhvdmVyOmJnLWdyZWVuLTUwMCByb3VuZGVkIHRleHQtc21cIlxyXG4gICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYS1zb2xpZCBmYS1jaGVja1wiIC8+XHJcbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RWRpdGluZ1Byb2plY3QobnVsbCl9XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJweC0yIHB5LTEgYmctemluYy02MDAgaG92ZXI6YmctemluYy01MDAgcm91bmRlZCB0ZXh0LXNtXCJcclxuICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEtc29saWQgZmEteG1hcmtcIiAvPlxyXG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICkgOiBjb25maXJtRGVsZXRlID09PSBwLmlkID8gKFxyXG4gICAgICAgICAgICAgICAgLy8gRGVsZXRlIGNvbmZpcm1hdGlvblxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwidGV4dC1zbSB0ZXh0LXJlZC00MDAgbWItMlwiPkRlbGV0ZSBcIntwLm5hbWV9XCI/PC9wPlxyXG4gICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cInRleHQteHMgdGV4dC16aW5jLTUwMCBtYi0zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgVGhpcyB3aWxsIHBlcm1hbmVudGx5IGRlbGV0ZSBhbGwgcHJvamVjdCBkYXRhLlxyXG4gICAgICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4IGdhcC0yIGp1c3RpZnktY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gaGFuZGxlRGVsZXRlKHAuaWQpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJweC0zIHB5LTEgYmctcmVkLTYwMCBob3ZlcjpiZy1yZWQtNTAwIHJvdW5kZWQgdGV4dC1zbVwiXHJcbiAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgWWVzLCBEZWxldGVcclxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRDb25maXJtRGVsZXRlKG51bGwpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJweC0zIHB5LTEgYmctemluYy02MDAgaG92ZXI6YmctemluYy01MDAgcm91bmRlZCB0ZXh0LXNtXCJcclxuICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICBDYW5jZWxcclxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgLy8gTm9ybWFsIHZpZXdcclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW5cIj5cclxuICAgICAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiY3Vyc29yLXBvaW50ZXIgZmxleC0xXCJcclxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBvblN3aXRjaChwLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvbnQtbWVkaXVtXCI+e3AubmFtZX08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dC14cyB0ZXh0LXppbmMtNTAwXCI+e3AuaWR9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleCBnYXAtMSBtbC0yXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRFZGl0aW5nKHApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwicC0xLjUgdGV4dC16aW5jLTQwMCBob3Zlcjp0ZXh0LXdoaXRlIGhvdmVyOmJnLXppbmMtNzAwIHJvdW5kZWRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJSZW5hbWVcIlxyXG4gICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEtc29saWQgZmEtcGVuIHRleHQteHNcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldENvbmZpcm1EZWxldGUocC5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJwLTEuNSB0ZXh0LXppbmMtNDAwIGhvdmVyOnRleHQtcmVkLTQwMCBob3ZlcjpiZy16aW5jLTcwMCByb3VuZGVkXCJcclxuICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwiRGVsZXRlXCJcclxuICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhLXNvbGlkIGZhLXRyYXNoIHRleHQteHNcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgKSl9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCAiLyoqXHJcbiAqIEdlbmVyYXRlTW9kYWwgQ29tcG9uZW50XHJcbiAqIFxyXG4gKiBNb2RhbCBzaG93aW5nIGdlbmVyYXRpb24gcHJvZ3Jlc3MgYW5kIHJlc3VsdHMgd2l0aCBpbWFnZSBwcmV2aWV3cy5cclxuICovXHJcblxyXG5pbXBvcnQgeyB1c2VNZW1vIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHR5cGUgeyBHZW5lcmF0ZVByb2dyZXNzLCBHZW5lcmF0ZVJlc3VsdCB9IGZyb20gJy4uLy4uL3R5cGVzLnRzJztcclxuXHJcbmludGVyZmFjZSBHZW5lcmF0ZU1vZGFsUHJvcHMge1xyXG4gIHByb2dyZXNzOiBHZW5lcmF0ZVByb2dyZXNzO1xyXG4gIGdlbmVyYXRpbmc6IGJvb2xlYW47XHJcbiAgb25DbG9zZTogKCkgPT4gdm9pZDtcclxufVxyXG5cclxuaW50ZXJmYWNlIEdyb3VwZWRSZXN1bHRzIHtcclxuICBhbmRyb2lkOiB7IGZlYXR1cmU6IEdlbmVyYXRlUmVzdWx0IHwgbnVsbDsgc2NyZWVuc2hvdHM6IEdlbmVyYXRlUmVzdWx0W10gfTtcclxuICBpb3M6IHsgZmVhdHVyZTogR2VuZXJhdGVSZXN1bHQgfCBudWxsOyBzY3JlZW5zaG90czogR2VuZXJhdGVSZXN1bHRbXSB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gR2VuZXJhdGVNb2RhbCh7IHByb2dyZXNzLCBnZW5lcmF0aW5nLCBvbkNsb3NlIH06IEdlbmVyYXRlTW9kYWxQcm9wcykge1xyXG4gIGNvbnN0IHsgY3VycmVudCwgdG90YWwsIGl0ZW0sIHJlc3VsdHMgfSA9IHByb2dyZXNzO1xyXG4gIGNvbnN0IHBlcmNlbnQgPSB0b3RhbCA+IDAgPyBNYXRoLnJvdW5kKChjdXJyZW50IC8gdG90YWwpICogMTAwKSA6IDA7XHJcbiAgY29uc3QgaXNEb25lID0gIWdlbmVyYXRpbmcgJiYgcmVzdWx0cyAhPT0gbnVsbDtcclxuICBcclxuICBjb25zdCBzdWNjZXNzQ291bnQgPSByZXN1bHRzPy5maWx0ZXIoKHIpID0+IHIuc3RhdHVzID09PSAnc3VjY2VzcycpLmxlbmd0aCB8fCAwO1xyXG4gIGNvbnN0IGVycm9yQ291bnQgPSByZXN1bHRzPy5maWx0ZXIoKHIpID0+IHIuc3RhdHVzID09PSAnZXJyb3InKS5sZW5ndGggfHwgMDtcclxuXHJcbiAgLy8gR3JvdXAgcmVzdWx0cyBieSBwbGF0Zm9ybSBhbmQgdHlwZVxyXG4gIGNvbnN0IGdyb3VwZWRSZXN1bHRzID0gdXNlTWVtbzxHcm91cGVkUmVzdWx0cz4oKCkgPT4ge1xyXG4gICAgaWYgKCFyZXN1bHRzKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgYW5kcm9pZDogeyBmZWF0dXJlOiBudWxsLCBzY3JlZW5zaG90czogW10gfSxcclxuICAgICAgICBpb3M6IHsgZmVhdHVyZTogbnVsbCwgc2NyZWVuc2hvdHM6IFtdIH0sXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZ3JvdXBlZDogR3JvdXBlZFJlc3VsdHMgPSB7XHJcbiAgICAgIGFuZHJvaWQ6IHsgZmVhdHVyZTogbnVsbCwgc2NyZWVuc2hvdHM6IFtdIH0sXHJcbiAgICAgIGlvczogeyBmZWF0dXJlOiBudWxsLCBzY3JlZW5zaG90czogW10gfSxcclxuICAgIH07XHJcblxyXG4gICAgcmVzdWx0c1xyXG4gICAgICAuZmlsdGVyKChyKSA9PiByLnN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKVxyXG4gICAgICAuZm9yRWFjaCgocikgPT4ge1xyXG4gICAgICAgIGNvbnN0IHBhcnRzID0gci5yZWxhdGl2ZVBhdGguc3BsaXQoJy8nKTtcclxuICAgICAgICBjb25zdCBwbGF0Zm9ybSA9IHBhcnRzWzFdOyAvLyBsYW5nL3BsYXRmb3JtL2ZpbGVuYW1lXHJcbiAgICAgICAgY29uc3QgZmlsZW5hbWUgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXTtcclxuXHJcbiAgICAgICAgaWYgKHBsYXRmb3JtID09PSAnYW5kcm9pZCcgfHwgcGxhdGZvcm0gPT09ICdpb3MnKSB7XHJcbiAgICAgICAgICBpZiAoZmlsZW5hbWUuaW5jbHVkZXMoJ2ZlYXR1cmUtZ3JhcGhpYycpKSB7XHJcbiAgICAgICAgICAgIGdyb3VwZWRbcGxhdGZvcm1dLmZlYXR1cmUgPSByO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZ3JvdXBlZFtwbGF0Zm9ybV0uc2NyZWVuc2hvdHMucHVzaChyKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBncm91cGVkO1xyXG4gIH0sIFtyZXN1bHRzXSk7XHJcblxyXG4gIGNvbnN0IG9wZW5Gb2xkZXIgPSBhc3luYyAoKSA9PiB7XHJcbiAgICBhd2FpdCBmZXRjaCgnL2FwaS9vcGVuLWZvbGRlcicsIHtcclxuICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxyXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7fSksXHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBjb25zdCByZW5kZXJQbGF0Zm9ybVNlY3Rpb24gPSAocGxhdGZvcm06ICdhbmRyb2lkJyB8ICdpb3MnLCBsYWJlbDogc3RyaW5nKSA9PiB7XHJcbiAgICBjb25zdCBkYXRhID0gZ3JvdXBlZFJlc3VsdHNbcGxhdGZvcm1dO1xyXG4gICAgaWYgKCFkYXRhLmZlYXR1cmUgJiYgZGF0YS5zY3JlZW5zaG90cy5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXYgY2xhc3M9XCJtYi00XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInRleHQtc20gZm9udC1tZWRpdW0gdGV4dC16aW5jLTMwMCBtYi0yIGZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XHJcbiAgICAgICAgICA8aSBjbGFzcz17YGZhLWJyYW5kcyAke3BsYXRmb3JtID09PSAnYW5kcm9pZCcgPyAnZmEtYW5kcm9pZCcgOiAnZmEtYXBwbGUnfWB9IC8+XHJcbiAgICAgICAgICB7bGFiZWx9XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIHtkYXRhLmZlYXR1cmUgJiYgKFxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1iLTNcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJnLXppbmMtODAwIHJvdW5kZWQgb3ZlcmZsb3ctaGlkZGVuXCI+XHJcbiAgICAgICAgICAgICAgPGltZ1xyXG4gICAgICAgICAgICAgICAgc3JjPXtgL291dHB1dC8ke2RhdGEuZmVhdHVyZS5yZWxhdGl2ZVBhdGh9P3Q9JHtEYXRlLm5vdygpfWB9XHJcbiAgICAgICAgICAgICAgICBjbGFzcz1cInctZnVsbCBhc3BlY3QtWzEwMjQvNTAwXSBvYmplY3QtY29udGFpbiBiZy16aW5jLTcwMFwiXHJcbiAgICAgICAgICAgICAgICBsb2FkaW5nPVwibGF6eVwiXHJcbiAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC0yIHRleHQteHMgdGV4dC16aW5jLTQwMCB0cnVuY2F0ZVwiIHRpdGxlPXtkYXRhLmZlYXR1cmUucmVsYXRpdmVQYXRofT5cclxuICAgICAgICAgICAgICAgIEZlYXR1cmUgR3JhcGhpY1xyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICl9XHJcblxyXG4gICAgICAgIHtkYXRhLnNjcmVlbnNob3RzLmxlbmd0aCA+IDAgJiYgKFxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImdyaWQgZ3JpZC1jb2xzLTQgZ2FwLTJcIj5cclxuICAgICAgICAgICAge2RhdGEuc2NyZWVuc2hvdHMubWFwKChyKSA9PiAoXHJcbiAgICAgICAgICAgICAgPGRpdiBrZXk9e3IucmVsYXRpdmVQYXRofSBjbGFzcz1cImJnLXppbmMtODAwIHJvdW5kZWQgb3ZlcmZsb3ctaGlkZGVuXCI+XHJcbiAgICAgICAgICAgICAgICA8aW1nXHJcbiAgICAgICAgICAgICAgICAgIHNyYz17YC9vdXRwdXQvJHtyLnJlbGF0aXZlUGF0aH0/dD0ke0RhdGUubm93KCl9YH1cclxuICAgICAgICAgICAgICAgICAgY2xhc3M9XCJ3LWZ1bGwgYXNwZWN0LVsxMjQyLzI2ODhdIG9iamVjdC1jb250YWluIGJnLXppbmMtNzAwXCJcclxuICAgICAgICAgICAgICAgICAgbG9hZGluZz1cImxhenlcIlxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLTEuNSB0ZXh0LXhzIHRleHQtemluYy00MDAgdHJ1bmNhdGVcIiB0aXRsZT17ci5yZWxhdGl2ZVBhdGh9PlxyXG4gICAgICAgICAgICAgICAgICB7ci5yZWxhdGl2ZVBhdGguc3BsaXQoJy8nKS5wb3AoKX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApKX1cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICl9XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzcz1cImZpeGVkIGluc2V0LTAgYmctYmxhY2svNzAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgei01MFwiPlxyXG4gICAgICA8ZGl2XHJcbiAgICAgICAgY2xhc3M9XCJiZy16aW5jLTkwMCByb3VuZGVkLWxnIHAtNiB3LVs3MDBweF0gbWF4LWgtWzg1dmhdIG92ZXJmbG93LWhpZGRlbiBmbGV4IGZsZXgtY29sXCJcclxuICAgICAgICBvbkNsaWNrPXsoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX1cclxuICAgICAgPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4IGp1c3RpZnktYmV0d2VlbiBpdGVtcy1jZW50ZXIgbWItNFwiPlxyXG4gICAgICAgICAgPGgyIGNsYXNzPVwiZm9udC1ib2xkIHRleHQtbGdcIj5cclxuICAgICAgICAgICAge2lzRG9uZSA/ICdHZW5lcmF0aW9uIENvbXBsZXRlJyA6ICdHZW5lcmF0aW5nIFNjcmVlbnNob3RzLi4uJ31cclxuICAgICAgICAgIDwvaDI+XHJcbiAgICAgICAgICB7aXNEb25lICYmIChcclxuICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkNsb3NlfSBjbGFzcz1cInRleHQtemluYy01MDAgaG92ZXI6dGV4dC13aGl0ZSB0ZXh0LXhsXCI+XHJcbiAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYS1zb2xpZCBmYS14bWFya1wiIC8+XHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgKX1cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgeyFpc0RvbmUgPyAoXHJcbiAgICAgICAgICAvLyBQcm9ncmVzcyBWaWV3XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwic3BhY2UteS00XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJiZy16aW5jLTgwMCByb3VuZGVkLWZ1bGwgaC0zIG92ZXJmbG93LWhpZGRlblwiPlxyXG4gICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwiYmctaW5kaWdvLTUwMCBoLWZ1bGwgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tMzAwXCJcclxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiBgJHtwZXJjZW50fSVgIH19XHJcbiAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4IGp1c3RpZnktYmV0d2VlbiB0ZXh0LXNtXCI+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0ZXh0LXppbmMtNDAwIHRydW5jYXRlIG1heC13LVs0MDBweF1cIj57aXRlbX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0ZXh0LXppbmMtNTAwXCI+XHJcbiAgICAgICAgICAgICAgICB7Y3VycmVudH0gLyB7dG90YWx9XHJcbiAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICkgOiAoXHJcbiAgICAgICAgICAvLyBSZXN1bHRzIFZpZXdcclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4LTEgb3ZlcmZsb3ctaGlkZGVuIGZsZXggZmxleC1jb2wgbWluLWgtMFwiPlxyXG4gICAgICAgICAgICB7LyogU3VtbWFyeSAqL31cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXggZ2FwLTQgbWItNFwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4LTEgYmctZ3JlZW4tOTAwLzMwIGJvcmRlciBib3JkZXItZ3JlZW4tODAwIHJvdW5kZWQgcC0zIHRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dC0yeGwgZm9udC1ib2xkIHRleHQtZ3JlZW4tNDAwXCI+e3N1Y2Nlc3NDb3VudH08L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtZ3JlZW4tNTAwXCI+U3VjY2Vzc2Z1bDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIHtlcnJvckNvdW50ID4gMCAmJiAoXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleC0xIGJnLXJlZC05MDAvMzAgYm9yZGVyIGJvcmRlci1yZWQtODAwIHJvdW5kZWQgcC0zIHRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LTJ4bCBmb250LWJvbGQgdGV4dC1yZWQtNDAwXCI+e2Vycm9yQ291bnR9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtcmVkLTUwMFwiPkZhaWxlZDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICB7LyogSW1hZ2UgUHJldmlld3MgYnkgUGxhdGZvcm0gKi99XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4LTEgb3ZlcmZsb3cteS1hdXRvIG1pbi1oLTAgcHItMlwiPlxyXG4gICAgICAgICAgICAgIHtyZW5kZXJQbGF0Zm9ybVNlY3Rpb24oJ2FuZHJvaWQnLCAnQW5kcm9pZCcpfVxyXG4gICAgICAgICAgICAgIHtyZW5kZXJQbGF0Zm9ybVNlY3Rpb24oJ2lvcycsICdpT1MnKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICB7LyogQWN0aW9ucyAqL31cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXggZ2FwLTMgbXQtNCBwdC00IGJvcmRlci10IGJvcmRlci16aW5jLTgwMFwiPlxyXG4gICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e29wZW5Gb2xkZXJ9XHJcbiAgICAgICAgICAgICAgICBjbGFzcz1cImZsZXgtMSBweC00IHB5LTIgYmctemluYy03MDAgaG92ZXI6YmctemluYy02MDAgcm91bmRlZCB0ZXh0LXNtIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGdhcC0yXCJcclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhLXNvbGlkIGZhLWZvbGRlci1vcGVuXCIgLz4gT3BlbiBpbiBFeHBsb3JlclxyXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e29uQ2xvc2V9XHJcbiAgICAgICAgICAgICAgICBjbGFzcz1cImZsZXgtMSBweC00IHB5LTIgYmctaW5kaWdvLTYwMCBob3ZlcjpiZy1pbmRpZ28tNTAwIHJvdW5kZWQgdGV4dC1zbVwiXHJcbiAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgRG9uZVxyXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICl9XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCAiLyoqXHJcbiAqIFRoZW1lRWRpdG9yIE1vZGFsIENvbXBvbmVudFxyXG4gKiBcclxuICogTW9kYWwgZm9yIGVkaXRpbmcgdGhlbWUgY29sb3JzLCBncmFkaWVudHMsIGFuZCB0eXBvZ3JhcGh5LlxyXG4gKi9cclxuXHJcbmltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgQ29sb3JJbnB1dCB9IGZyb20gJy4uL2lucHV0cy9Db2xvcklucHV0LnRzeCc7XHJcbmltcG9ydCB0eXBlIHsgQ29uZmlnIH0gZnJvbSAnLi4vLi4vdHlwZXMudHMnO1xyXG5cclxuLy8gQ29uc3RhbnRzIGltcG9ydGVkIGZyb20gbGliXHJcbmNvbnN0IEdSQURJRU5UX1RFTVBMQVRFUyA9IFtcclxuICB7IGlkOiAnc29saWQtcHJpbWFyeScsIG5hbWU6ICdTb2xpZCBQcmltYXJ5JywgdGVtcGxhdGU6ICd7cHJpbWFyeX0nIH0sXHJcbiAgeyBpZDogJ3NvbGlkLXNlY29uZGFyeScsIG5hbWU6ICdTb2xpZCBTZWNvbmRhcnknLCB0ZW1wbGF0ZTogJ3tzZWNvbmRhcnl9JyB9LFxyXG4gIHsgaWQ6ICdwcmltYXJ5LWRhcmsnLCBuYW1lOiAnUHJpbWFyeSB0byBEYXJrJywgdGVtcGxhdGU6ICdsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCB7cHJpbWFyeX0gMCUsICMwYTBhMGEgMTAwJSknIH0sXHJcbiAgeyBpZDogJ3ByaW1hcnktc2Vjb25kYXJ5JywgbmFtZTogJ1ByaW1hcnkgdG8gU2Vjb25kYXJ5JywgdGVtcGxhdGU6ICdsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCB7cHJpbWFyeX0gMCUsIHtzZWNvbmRhcnl9IDEwMCUpJyB9LFxyXG4gIHsgaWQ6ICdzZWNvbmRhcnktcHJpbWFyeScsIG5hbWU6ICdTZWNvbmRhcnkgdG8gUHJpbWFyeScsIHRlbXBsYXRlOiAnbGluZWFyLWdyYWRpZW50KDEzNWRlZywge3NlY29uZGFyeX0gMCUsIHtwcmltYXJ5fSAxMDAlKScgfSxcclxuICB7IGlkOiAncmFkaWFsLXByaW1hcnknLCBuYW1lOiAnUmFkaWFsIFByaW1hcnknLCB0ZW1wbGF0ZTogJ3JhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgMzAlIDMwJSwge3ByaW1hcnl9IDAlLCAjMGEwYTBhIDcwJSknIH0sXHJcbiAgeyBpZDogJ3JhZGlhbC1zZWNvbmRhcnknLCBuYW1lOiAnUmFkaWFsIFNlY29uZGFyeScsIHRlbXBsYXRlOiAncmFkaWFsLWdyYWRpZW50KGNpcmNsZSBhdCAzMCUgMzAlLCB7c2Vjb25kYXJ5fSAwJSwgIzBhMGEwYSA3MCUpJyB9LFxyXG4gIHsgaWQ6ICdtZXNoLXByaW1hcnknLCBuYW1lOiAnTWVzaCBQcmltYXJ5JywgdGVtcGxhdGU6ICdsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCB7cHJpbWFyeX0yMiAwJSwgdHJhbnNwYXJlbnQgNTAlKSwgbGluZWFyLWdyYWRpZW50KDIyNWRlZywge3NlY29uZGFyeX0yMiAwJSwgdHJhbnNwYXJlbnQgNTAlKSwgIzBhMGEwYScgfSxcclxuICB7IGlkOiAnZGlhZ29uYWwtc3BsaXQnLCBuYW1lOiAnRGlhZ29uYWwgU3BsaXQnLCB0ZW1wbGF0ZTogJ2xpbmVhci1ncmFkaWVudCgxMzVkZWcsIHtwcmltYXJ5fSAwJSwge3ByaW1hcnl9IDUwJSwge3NlY29uZGFyeX0gNTAlLCB7c2Vjb25kYXJ5fSAxMDAlKScgfSxcclxuICB7IGlkOiAndHJpcGxlLWdyYWRpZW50JywgbmFtZTogJ1RyaXBsZSBHcmFkaWVudCcsIHRlbXBsYXRlOiAnbGluZWFyLWdyYWRpZW50KDEzNWRlZywge3ByaW1hcnl9IDAlLCB7c2Vjb25kYXJ5fSA1MCUsIHthY2NlbnR9IDEwMCUpJyB9LFxyXG5dO1xyXG5cclxuY29uc3QgREVGQVVMVF9QQUxFVFRFUyA9IFtcclxuICB7IG5hbWU6ICdQdXJwbGUgTmlnaHQnLCBwYWxldHRlOiB7IHByaW1hcnk6ICcjYTg1NWY3Jywgc2Vjb25kYXJ5OiAnIzYzNjZmMScsIGFjY2VudDogJyNlYzQ4OTknIH0gfSxcclxuICB7IG5hbWU6ICdPY2VhbiBCbHVlJywgcGFsZXR0ZTogeyBwcmltYXJ5OiAnIzNiODJmNicsIHNlY29uZGFyeTogJyMwNmI2ZDQnLCBhY2NlbnQ6ICcjMjJjNTVlJyB9IH0sXHJcbiAgeyBuYW1lOiAnU3Vuc2V0JywgcGFsZXR0ZTogeyBwcmltYXJ5OiAnI2Y5NzMxNicsIHNlY29uZGFyeTogJyNlZjQ0NDQnLCBhY2NlbnQ6ICcjZjU5ZTBiJyB9IH0sXHJcbiAgeyBuYW1lOiAnRm9yZXN0JywgcGFsZXR0ZTogeyBwcmltYXJ5OiAnIzIyYzU1ZScsIHNlY29uZGFyeTogJyMxNGI4YTYnLCBhY2NlbnQ6ICcjODRjYzE2JyB9IH0sXHJcbiAgeyBuYW1lOiAnUm9zZScsIHBhbGV0dGU6IHsgcHJpbWFyeTogJyNlYzQ4OTknLCBzZWNvbmRhcnk6ICcjZjQzZjVlJywgYWNjZW50OiAnI2E4NTVmNycgfSB9LFxyXG4gIHsgbmFtZTogJ01pZG5pZ2h0JywgcGFsZXR0ZTogeyBwcmltYXJ5OiAnIzYzNjZmMScsIHNlY29uZGFyeTogJyM4YjVjZjYnLCBhY2NlbnQ6ICcjM2I4MmY2JyB9IH0sXHJcbiAgeyBuYW1lOiAnRW1iZXInLCBwYWxldHRlOiB7IHByaW1hcnk6ICcjZWY0NDQ0Jywgc2Vjb25kYXJ5OiAnI2Y5NzMxNicsIGFjY2VudDogJyNmYmJmMjQnIH0gfSxcclxuICB7IG5hbWU6ICdUZWFsJywgcGFsZXR0ZTogeyBwcmltYXJ5OiAnIzE0YjhhNicsIHNlY29uZGFyeTogJyMwNmI2ZDQnLCBhY2NlbnQ6ICcjMjJjNTVlJyB9IH0sXHJcbl07XHJcblxyXG5mdW5jdGlvbiBhcHBseVBhbGV0dGVUb0dyYWRpZW50KHRlbXBsYXRlOiBzdHJpbmcsIHBhbGV0dGU6IHsgcHJpbWFyeTogc3RyaW5nOyBzZWNvbmRhcnk6IHN0cmluZzsgYWNjZW50OiBzdHJpbmcgfSk6IHN0cmluZyB7XHJcbiAgcmV0dXJuIHRlbXBsYXRlXHJcbiAgICAucmVwbGFjZSgvXFx7cHJpbWFyeVxcfS9nLCBwYWxldHRlLnByaW1hcnkpXHJcbiAgICAucmVwbGFjZSgvXFx7c2Vjb25kYXJ5XFx9L2csIHBhbGV0dGUuc2Vjb25kYXJ5KVxyXG4gICAgLnJlcGxhY2UoL1xce2FjY2VudFxcfS9nLCBwYWxldHRlLmFjY2VudCk7XHJcbn1cclxuXHJcbmludGVyZmFjZSBUaGVtZUVkaXRvck1vZGFsUHJvcHMge1xyXG4gIGNvbmZpZzogQ29uZmlnO1xyXG4gIG9uQ2xvc2U6ICgpID0+IHZvaWQ7XHJcbiAgb25TYXZlOiAobmV3Q29uZmlnOiBDb25maWcpID0+IHZvaWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBUaGVtZUVkaXRvck1vZGFsKHsgY29uZmlnLCBvbkNsb3NlLCBvblNhdmUgfTogVGhlbWVFZGl0b3JNb2RhbFByb3BzKSB7XHJcbiAgY29uc3QgZGVmYXVsdFBhbGV0dGUgPSB7IHByaW1hcnk6ICcjYTg1NWY3Jywgc2Vjb25kYXJ5OiAnIzYzNjZmMScsIGFjY2VudDogJyNlYzQ4OTknIH07XHJcbiAgY29uc3QgY3VycmVudFBhbGV0dGUgPSBjb25maWcucGFsZXR0ZSB8fCBkZWZhdWx0UGFsZXR0ZTtcclxuICBjb25zdCBjdXJyZW50R3JhZGllbnQgPSBjb25maWcudGhlbWU/LmJhY2tncm91bmQ/LmdyYWRpZW50IHx8ICcnO1xyXG5cclxuICAvLyBEZXRlY3Qgd2hpY2ggZ3JhZGllbnQgdGVtcGxhdGUgbWF0Y2hlcyBjdXJyZW50IGdyYWRpZW50XHJcbiAgY29uc3QgZGV0ZWN0U2VsZWN0ZWRHcmFkaWVudCA9ICgpID0+IHtcclxuICAgIGZvciAoY29uc3QgdCBvZiBHUkFESUVOVF9URU1QTEFURVMpIHtcclxuICAgICAgY29uc3QgY3NzID0gYXBwbHlQYWxldHRlVG9HcmFkaWVudCh0LnRlbXBsYXRlLCBjdXJyZW50UGFsZXR0ZSk7XHJcbiAgICAgIGlmIChjc3MgPT09IGN1cnJlbnRHcmFkaWVudCkge1xyXG4gICAgICAgIHJldHVybiB0LmlkO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gJ2N1c3RvbSc7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgW3BhbGV0dGUsIHNldFBhbGV0dGVdID0gdXNlU3RhdGUoY3VycmVudFBhbGV0dGUpO1xyXG4gIGNvbnN0IFtzZWxlY3RlZEdyYWRpZW50LCBzZXRTZWxlY3RlZEdyYWRpZW50XSA9IHVzZVN0YXRlKGRldGVjdFNlbGVjdGVkR3JhZGllbnQpO1xyXG4gIGNvbnN0IFtjdXN0b21HcmFkaWVudCwgc2V0Q3VzdG9tR3JhZGllbnRdID0gdXNlU3RhdGUoY3VycmVudEdyYWRpZW50KTtcclxuICBjb25zdCBbZm9udEZhbWlseSwgc2V0Rm9udEZhbWlseV0gPSB1c2VTdGF0ZShjb25maWcudGhlbWU/LmZvbnRGYW1pbHkgfHwgJ0ludGVyLCBzYW5zLXNlcmlmJyk7XHJcbiAgY29uc3QgW2dvb2dsZUZvbnRzVXJsLCBzZXRHb29nbGVGb250c1VybF0gPSB1c2VTdGF0ZShjb25maWcudGhlbWU/Lmdvb2dsZUZvbnRzVXJsIHx8ICcnKTtcclxuXHJcbiAgLy8gR2VuZXJhdGUgZ3JhZGllbnRzIGZyb20gcGFsZXR0ZVxyXG4gIGNvbnN0IGdyYWRpZW50cyA9IEdSQURJRU5UX1RFTVBMQVRFUy5tYXAoKHQpID0+ICh7XHJcbiAgICBpZDogdC5pZCxcclxuICAgIG5hbWU6IHQubmFtZSxcclxuICAgIGNzczogYXBwbHlQYWxldHRlVG9HcmFkaWVudCh0LnRlbXBsYXRlLCBwYWxldHRlKSxcclxuICB9KSk7XHJcblxyXG4gIGNvbnN0IHVwZGF0ZVBhbGV0dGUgPSAodXBkYXRlczogUGFydGlhbDx0eXBlb2YgcGFsZXR0ZT4pID0+IHtcclxuICAgIHNldFBhbGV0dGUoKHApID0+ICh7IC4uLnAsIC4uLnVwZGF0ZXMgfSkpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGhhbmRsZVNhdmUgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBncmFkaWVudCA9XHJcbiAgICAgIHNlbGVjdGVkR3JhZGllbnQgPT09ICdjdXN0b20nXHJcbiAgICAgICAgPyBjdXN0b21HcmFkaWVudFxyXG4gICAgICAgIDogZ3JhZGllbnRzLmZpbmQoKGcpID0+IGcuaWQgPT09IHNlbGVjdGVkR3JhZGllbnQpPy5jc3MgfHwgY3VzdG9tR3JhZGllbnQ7XHJcblxyXG4gICAgb25TYXZlKHtcclxuICAgICAgLi4uY29uZmlnLFxyXG4gICAgICBwYWxldHRlLFxyXG4gICAgICB0aGVtZToge1xyXG4gICAgICAgIC4uLmNvbmZpZy50aGVtZSxcclxuICAgICAgICBiYWNrZ3JvdW5kOiB7IGdyYWRpZW50IH0sXHJcbiAgICAgICAgZm9udEZhbWlseSxcclxuICAgICAgICBnb29nbGVGb250c1VybDogZ29vZ2xlRm9udHNVcmwgfHwgdW5kZWZpbmVkLFxyXG4gICAgICB9LFxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgYXBwbHlQcmVzZXQgPSAocHJlc2V0UGFsZXR0ZTogdHlwZW9mIHBhbGV0dGUpID0+IHtcclxuICAgIHNldFBhbGV0dGUocHJlc2V0UGFsZXR0ZSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgY3VycmVudFByZXZpZXdHcmFkaWVudCA9XHJcbiAgICBzZWxlY3RlZEdyYWRpZW50ID09PSAnY3VzdG9tJ1xyXG4gICAgICA/IGN1c3RvbUdyYWRpZW50XHJcbiAgICAgIDogZ3JhZGllbnRzLmZpbmQoKGcpID0+IGcuaWQgPT09IHNlbGVjdGVkR3JhZGllbnQpPy5jc3MgfHwgJyc7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIGNsYXNzPVwiZml4ZWQgaW5zZXQtMCBiZy1ibGFjay84MCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciB6LTUwXCJcclxuICAgICAgb25DbGljaz17KGUpID0+IGUudGFyZ2V0ID09PSBlLmN1cnJlbnRUYXJnZXQgJiYgb25DbG9zZSgpfVxyXG4gICAgPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiYmctemluYy05MDAgcm91bmRlZC1sZyB3LWZ1bGwgbWF4LXctMnhsIG1heC1oLVs5MHZoXSBmbGV4IGZsZXgtY29sXCI+XHJcbiAgICAgICAgey8qIEhlYWRlciAqL31cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHAtNCBib3JkZXItYiBib3JkZXItemluYy04MDBcIj5cclxuICAgICAgICAgIDxoMiBjbGFzcz1cImZvbnQtYm9sZCB0ZXh0LWxnXCI+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEtc29saWQgZmEtcGFsZXR0ZSBtci0yXCIgLz5cclxuICAgICAgICAgICAgVGhlbWUgJiBDb2xvcnNcclxuICAgICAgICAgIDwvaDI+XHJcbiAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQ2xvc2V9IGNsYXNzPVwidGV4dC16aW5jLTUwMCBob3Zlcjp0ZXh0LXdoaXRlIHRleHQteGxcIj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYS1zb2xpZCBmYS14bWFya1wiIC8+XHJcbiAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgey8qIENvbnRlbnQgKi99XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImZsZXgtMSBvdmVyZmxvdy15LWF1dG8gcC00IHNwYWNlLXktNlwiPlxyXG4gICAgICAgICAgey8qIENvbG9yIFBhbGV0dGUgU2VjdGlvbiAqL31cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxoMyBjbGFzcz1cInRleHQtc20gZm9udC1tZWRpdW0gbWItM1wiPkNvbG9yIFBhbGV0dGU8L2gzPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ3JpZCBncmlkLWNvbHMtMyBnYXAtNFwiPlxyXG4gICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtemluYy01MDAgYmxvY2sgbWItMVwiPlByaW1hcnk8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPENvbG9ySW5wdXQgdmFsdWU9e3BhbGV0dGUucHJpbWFyeX0gb25DaGFuZ2U9eyh2KSA9PiB1cGRhdGVQYWxldHRlKHsgcHJpbWFyeTogdiB9KX0gLz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwidGV4dC14cyB0ZXh0LXppbmMtNTAwIGJsb2NrIG1iLTFcIj5TZWNvbmRhcnk8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPENvbG9ySW5wdXQgdmFsdWU9e3BhbGV0dGUuc2Vjb25kYXJ5fSBvbkNoYW5nZT17KHYpID0+IHVwZGF0ZVBhbGV0dGUoeyBzZWNvbmRhcnk6IHYgfSl9IC8+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInRleHQteHMgdGV4dC16aW5jLTUwMCBibG9jayBtYi0xXCI+QWNjZW50PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxDb2xvcklucHV0IHZhbHVlPXtwYWxldHRlLmFjY2VudH0gb25DaGFuZ2U9eyh2KSA9PiB1cGRhdGVQYWxldHRlKHsgYWNjZW50OiB2IH0pfSAvPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIHsvKiBQcmVzZXQgUGFsZXR0ZXMgKi99XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtdC00XCI+XHJcbiAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwidGV4dC14cyB0ZXh0LXppbmMtNTAwIGJsb2NrIG1iLTJcIj5QcmVzZXQgUGFsZXR0ZXM8L2xhYmVsPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4IGZsZXgtd3JhcCBnYXAtMlwiPlxyXG4gICAgICAgICAgICAgICAge0RFRkFVTFRfUEFMRVRURVMubWFwKChwcmVzZXQpID0+IChcclxuICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgIGtleT17cHJlc2V0Lm5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gYXBwbHlQcmVzZXQocHJlc2V0LnBhbGV0dGUpfVxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgcHgtMyBweS0xLjUgcm91bmRlZCB0ZXh0LXhzIGJnLXppbmMtODAwIGhvdmVyOmJnLXppbmMtNzAwXCJcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZT17cHJlc2V0Lm5hbWV9XHJcbiAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInctMyBoLTMgcm91bmRlZC1sXCIgc3R5bGU9e3sgYmFja2dyb3VuZDogcHJlc2V0LnBhbGV0dGUucHJpbWFyeSB9fSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInctMyBoLTNcIiBzdHlsZT17eyBiYWNrZ3JvdW5kOiBwcmVzZXQucGFsZXR0ZS5zZWNvbmRhcnkgfX0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3LTMgaC0zIHJvdW5kZWQtclwiIHN0eWxlPXt7IGJhY2tncm91bmQ6IHByZXNldC5wYWxldHRlLmFjY2VudCB9fSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIHtwcmVzZXQubmFtZX1cclxuICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICB7LyogQmFja2dyb3VuZCBHcmFkaWVudCBTZWN0aW9uICovfVxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPGgzIGNsYXNzPVwidGV4dC1zbSBmb250LW1lZGl1bSBtYi0zXCI+QmFja2dyb3VuZCBHcmFkaWVudDwvaDM+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJncmlkIGdyaWQtY29scy00IGdhcC0yIG1iLTNcIj5cclxuICAgICAgICAgICAgICB7Z3JhZGllbnRzLm1hcCgoZykgPT4gKFxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICBrZXk9e2cuaWR9XHJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFNlbGVjdGVkR3JhZGllbnQoZy5pZCl9XHJcbiAgICAgICAgICAgICAgICAgIGNsYXNzPXtgcC0xIHJvdW5kZWQgYm9yZGVyLTIgJHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEdyYWRpZW50ID09PSBnLmlkXHJcbiAgICAgICAgICAgICAgICAgICAgICA/ICdib3JkZXItaW5kaWdvLTUwMCdcclxuICAgICAgICAgICAgICAgICAgICAgIDogJ2JvcmRlci10cmFuc3BhcmVudCBob3Zlcjpib3JkZXItemluYy02MDAnXHJcbiAgICAgICAgICAgICAgICAgIH1gfVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaC0xMiByb3VuZGVkXCIgc3R5bGU9e3sgYmFja2dyb3VuZDogZy5jc3MgfX0gLz5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRleHQteHMgdGV4dC16aW5jLTQwMCBtdC0xIHRydW5jYXRlXCI+e2cubmFtZX08L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFNlbGVjdGVkR3JhZGllbnQoJ2N1c3RvbScpfVxyXG4gICAgICAgICAgICAgICAgY2xhc3M9e2BwLTEgcm91bmRlZCBib3JkZXItMiAke1xyXG4gICAgICAgICAgICAgICAgICBzZWxlY3RlZEdyYWRpZW50ID09PSAnY3VzdG9tJ1xyXG4gICAgICAgICAgICAgICAgICAgID8gJ2JvcmRlci1pbmRpZ28tNTAwJ1xyXG4gICAgICAgICAgICAgICAgICAgIDogJ2JvcmRlci10cmFuc3BhcmVudCBob3Zlcjpib3JkZXItemluYy02MDAnXHJcbiAgICAgICAgICAgICAgICB9YH1cclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaC0xMiByb3VuZGVkIGJnLXppbmMtODAwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEtc29saWQgZmEtY29kZSB0ZXh0LXppbmMtNTAwXCIgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRleHQteHMgdGV4dC16aW5jLTQwMCBtdC0xXCI+Q3VzdG9tPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAge3NlbGVjdGVkR3JhZGllbnQgPT09ICdjdXN0b20nICYmIChcclxuICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwidGV4dC14cyB0ZXh0LXppbmMtNTAwIGJsb2NrIG1iLTFcIj5DdXN0b20gQ1NTIEdyYWRpZW50PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtjdXN0b21HcmFkaWVudH1cclxuICAgICAgICAgICAgICAgICAgb25JbnB1dD17KGUpID0+IHNldEN1c3RvbUdyYWRpZW50KChlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSl9XHJcbiAgICAgICAgICAgICAgICAgIGNsYXNzPVwidy1mdWxsIHB4LTMgcHktMiByb3VuZGVkIHRleHQtc20gZm9udC1tb25vIGJnLXppbmMtODAwIGJvcmRlciBib3JkZXItemluYy03MDBcIlxyXG4gICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImxpbmVhci1ncmFkaWVudCgxMzVkZWcsICNhODU1ZjcgMCUsICMwYTBhMGEgMTAwJSlcIlxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtdC0yIGgtMTYgcm91bmRlZFwiIHN0eWxlPXt7IGJhY2tncm91bmQ6IGN1c3RvbUdyYWRpZW50IH19IC8+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICl9XHJcblxyXG4gICAgICAgICAgICB7LyogUHJldmlldyAqL31cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm10LTNcIj5cclxuICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJ0ZXh0LXhzIHRleHQtemluYy01MDAgYmxvY2sgbWItMVwiPlByZXZpZXc8L2xhYmVsPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJoLTIwIHJvdW5kZWRcIiBzdHlsZT17eyBiYWNrZ3JvdW5kOiBjdXJyZW50UHJldmlld0dyYWRpZW50IH19IC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgey8qIFR5cG9ncmFwaHkgU2VjdGlvbiAqL31cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxoMyBjbGFzcz1cInRleHQtc20gZm9udC1tZWRpdW0gbWItM1wiPlR5cG9ncmFwaHk8L2gzPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwic3BhY2UteS0zXCI+XHJcbiAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInRleHQteHMgdGV4dC16aW5jLTUwMCBibG9jayBtYi0xXCI+Rm9udCBGYW1pbHk8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgICAgdmFsdWU9e2ZvbnRGYW1pbHl9XHJcbiAgICAgICAgICAgICAgICAgIG9uSW5wdXQ9eyhlKSA9PiBzZXRGb250RmFtaWx5KChlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSl9XHJcbiAgICAgICAgICAgICAgICAgIGNsYXNzPVwidy1mdWxsIHB4LTMgcHktMiByb3VuZGVkIHRleHQtc20gYmctemluYy04MDAgYm9yZGVyIGJvcmRlci16aW5jLTcwMFwiXHJcbiAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiSW50ZXIsIHNhbnMtc2VyaWZcIlxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwidGV4dC14cyB0ZXh0LXppbmMtNTAwIGJsb2NrIG1iLTFcIj5Hb29nbGUgRm9udHMgVVJMIChvcHRpb25hbCk8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgICAgdmFsdWU9e2dvb2dsZUZvbnRzVXJsfVxyXG4gICAgICAgICAgICAgICAgICBvbklucHV0PXsoZSkgPT4gc2V0R29vZ2xlRm9udHNVcmwoKGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKX1cclxuICAgICAgICAgICAgICAgICAgY2xhc3M9XCJ3LWZ1bGwgcHgtMyBweS0yIHJvdW5kZWQgdGV4dC1zbSBmb250LW1vbm8gYmctemluYy04MDAgYm9yZGVyIGJvcmRlci16aW5jLTcwMFwiXHJcbiAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQGltcG9ydCB1cmwoJ2h0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9SW50ZXI6d2dodEA0MDA7NjAwOzcwMCZkaXNwbGF5PXN3YXAnKTtcIlxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgey8qIEZvb3RlciAqL31cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleCBnYXAtMyBwLTQgYm9yZGVyLXQgYm9yZGVyLXppbmMtODAwXCI+XHJcbiAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e29uQ2xvc2V9XHJcbiAgICAgICAgICAgIGNsYXNzPVwiZmxleC0xIHB4LTQgcHktMiBiZy16aW5jLTgwMCBob3ZlcjpiZy16aW5jLTcwMCByb3VuZGVkIHRleHQtc21cIlxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICBDYW5jZWxcclxuICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVTYXZlfVxyXG4gICAgICAgICAgICBjbGFzcz1cImZsZXgtMSBweC00IHB5LTIgYmctaW5kaWdvLTYwMCBob3ZlcjpiZy1pbmRpZ28tNTAwIHJvdW5kZWQgdGV4dC1zbVwiXHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEtc29saWQgZmEtY2hlY2sgbXItMVwiIC8+IEFwcGx5IFRoZW1lXHJcbiAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsICIvKipcclxuICogTWVkaWFNYW5hZ2VyIE1vZGFsIENvbXBvbmVudFxyXG4gKiBcclxuICogTW9kYWwgZm9yIG1hbmFnaW5nIG1lZGlhIGFzc2V0cyAoc2NyZWVuc2hvdHMsIG1hc2NvdHMsIGljb25zKS5cclxuICovXHJcblxyXG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlUmVmIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHR5cGUgeyBBc3NldHMgfSBmcm9tICcuLi8uLi90eXBlcy50cyc7XHJcblxyXG5pbnRlcmZhY2UgTWVkaWFNYW5hZ2VyTW9kYWxQcm9wcyB7XHJcbiAgYXNzZXRzOiBBc3NldHM7XHJcbiAgb25DbG9zZTogKCkgPT4gdm9pZDtcclxuICBvblJlZnJlc2g6ICgpID0+IFByb21pc2U8dm9pZD47XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBNZWRpYU1hbmFnZXJNb2RhbCh7IGFzc2V0cywgb25DbG9zZSwgb25SZWZyZXNoIH06IE1lZGlhTWFuYWdlck1vZGFsUHJvcHMpIHtcclxuICBjb25zdCBbYWN0aXZlVGFiLCBzZXRBY3RpdmVUYWJdID0gdXNlU3RhdGU8J3NjcmVlbnNob3RzJyB8ICdtYXNjb3RzJyB8ICdpY29ucyc+KCdzY3JlZW5zaG90cycpO1xyXG4gIGNvbnN0IFtlZGl0aW5nSXRlbSwgc2V0RWRpdGluZ0l0ZW1dID0gdXNlU3RhdGU8c3RyaW5nIHwgbnVsbD4obnVsbCk7XHJcbiAgY29uc3QgW25ld05hbWUsIHNldE5ld05hbWVdID0gdXNlU3RhdGUoJycpO1xyXG4gIGNvbnN0IGZpbGVJbnB1dFJlZiA9IHVzZVJlZjxIVE1MSW5wdXRFbGVtZW50PihudWxsKTtcclxuICBjb25zdCBbdXBsb2FkaW5nLCBzZXRVcGxvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xyXG5cclxuICBjb25zdCBhbGxBc3NldHMgPSB7XHJcbiAgICBzY3JlZW5zaG90czogYXNzZXRzLnNjcmVlbnNob3RzIHx8IFtdLFxyXG4gICAgbWFzY290czogYXNzZXRzLm1hc2NvdHMgfHwgW10sXHJcbiAgICBpY29uczogYXNzZXRzLmljb25zIHx8IFtdLFxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGN1cnJlbnRBc3NldHMgPSBhbGxBc3NldHNbYWN0aXZlVGFiXSB8fCBbXTtcclxuXHJcbiAgY29uc3QgaGFuZGxlVXBsb2FkID0gYXN5bmMgKGU6IEV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgY29uc3QgZmlsZXMgPSB0YXJnZXQuZmlsZXM7XHJcbiAgICBpZiAoIWZpbGVzPy5sZW5ndGgpIHJldHVybjtcclxuXHJcbiAgICBzZXRVcGxvYWRpbmcodHJ1ZSk7XHJcbiAgICBmb3IgKGNvbnN0IGZpbGUgb2YgQXJyYXkuZnJvbShmaWxlcykpIHtcclxuICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSk7XHJcbiAgICAgIGZvcm1EYXRhLmFwcGVuZCgnY2F0ZWdvcnknLCBhY3RpdmVUYWIpO1xyXG5cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBhd2FpdCBmZXRjaCgnL2FwaS9hc3NldHMvdXBsb2FkJywge1xyXG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICBib2R5OiBmb3JtRGF0YSxcclxuICAgICAgICB9KTtcclxuICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignVXBsb2FkIGZhaWxlZDonLCBlcnIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBhd2FpdCBvblJlZnJlc2goKTtcclxuICAgIHNldFVwbG9hZGluZyhmYWxzZSk7XHJcbiAgICB0YXJnZXQudmFsdWUgPSAnJztcclxuICB9O1xyXG5cclxuICBjb25zdCBoYW5kbGVSZW5hbWUgPSBhc3luYyAob2xkUGF0aDogc3RyaW5nKSA9PiB7XHJcbiAgICBpZiAoIW5ld05hbWUudHJpbSgpKSByZXR1cm47XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goJy9hcGkvYXNzZXRzL3JlbmFtZScsIHtcclxuICAgICAgICBtZXRob2Q6ICdQQVRDSCcsXHJcbiAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXHJcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBvbGRQYXRoLCBuZXdOYW1lOiBuZXdOYW1lLnRyaW0oKSB9KSxcclxuICAgICAgfSk7XHJcbiAgICAgIGlmIChyZXMub2spIHtcclxuICAgICAgICBhd2FpdCBvblJlZnJlc2goKTtcclxuICAgICAgICBzZXRFZGl0aW5nSXRlbShudWxsKTtcclxuICAgICAgICBzZXROZXdOYW1lKCcnKTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1JlbmFtZSBmYWlsZWQ6JywgZXJyKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBoYW5kbGVEZWxldGUgPSBhc3luYyAocGF0aDogc3RyaW5nKSA9PiB7XHJcbiAgICBpZiAoIWNvbmZpcm0oJ0RlbGV0ZSB0aGlzIGZpbGU/IFRoaXMgY2Fubm90IGJlIHVuZG9uZS4nKSkgcmV0dXJuO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCcvYXBpL2Fzc2V0cycsIHtcclxuICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxyXG4gICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgcGF0aCB9KSxcclxuICAgICAgfSk7XHJcbiAgICAgIGlmIChyZXMub2spIHtcclxuICAgICAgICBhd2FpdCBvblJlZnJlc2goKTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0RlbGV0ZSBmYWlsZWQ6JywgZXJyKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBzdGFydEVkaXRpbmcgPSAocGF0aDogc3RyaW5nKSA9PiB7XHJcbiAgICBzZXRFZGl0aW5nSXRlbShwYXRoKTtcclxuICAgIGNvbnN0IGZpbGVuYW1lID0gcGF0aC5zcGxpdCgnLycpLnBvcCgpIHx8ICcnO1xyXG4gICAgY29uc3QgbGFzdERvdCA9IGZpbGVuYW1lLmxhc3RJbmRleE9mKCcuJyk7XHJcbiAgICBjb25zdCBuYW1lV2l0aG91dEV4dCA9IGxhc3REb3QgPiAwID8gZmlsZW5hbWUuc3Vic3RyaW5nKDAsIGxhc3REb3QpIDogZmlsZW5hbWU7XHJcbiAgICBzZXROZXdOYW1lKG5hbWVXaXRob3V0RXh0KTtcclxuICB9O1xyXG5cclxuICBjb25zdCB0YWJzID0gW1xyXG4gICAgeyBpZDogJ3NjcmVlbnNob3RzJyBhcyBjb25zdCwgbGFiZWw6ICdTY3JlZW5zaG90cycsIGljb246ICdmYS1tb2JpbGUtc2NyZWVuJyB9LFxyXG4gICAgeyBpZDogJ21hc2NvdHMnIGFzIGNvbnN0LCBsYWJlbDogJ01hc2NvdHMnLCBpY29uOiAnZmEtdXNlci1hc3Ryb25hdXQnIH0sXHJcbiAgICB7IGlkOiAnaWNvbnMnIGFzIGNvbnN0LCBsYWJlbDogJ0ljb25zJywgaWNvbjogJ2ZhLWljb25zJyB9LFxyXG4gIF07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzPVwiZml4ZWQgaW5zZXQtMCBiZy1ibGFjay83MCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciB6LTUwXCIgb25DbGljaz17b25DbG9zZX0+XHJcbiAgICAgIDxkaXZcclxuICAgICAgICBjbGFzcz1cImJnLXppbmMtOTAwIHJvdW5kZWQtbGcgdy1bNjAwcHhdIG1heC1oLVs4MHZoXSBvdmVyZmxvdy1oaWRkZW4gZmxleCBmbGV4LWNvbFwiXHJcbiAgICAgICAgb25DbGljaz17KGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCl9XHJcbiAgICAgID5cclxuICAgICAgICB7LyogSGVhZGVyICovfVxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwLTQgYm9yZGVyLWIgYm9yZGVyLXppbmMtODAwXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxoMiBjbGFzcz1cImZvbnQtYm9sZCB0ZXh0LWxnXCI+XHJcbiAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYS1zb2xpZCBmYS1pbWFnZXMgbXItMlwiIC8+XHJcbiAgICAgICAgICAgICAgTWVkaWEgTWFuYWdlclxyXG4gICAgICAgICAgICA8L2gyPlxyXG4gICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQ2xvc2V9IGNsYXNzPVwidGV4dC16aW5jLTUwMCBob3Zlcjp0ZXh0LXdoaXRlIHRleHQteGxcIj5cclxuICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhLXNvbGlkIGZhLXhtYXJrXCIgLz5cclxuICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgey8qIFRhYnMgKi99XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImZsZXggYm9yZGVyLWIgYm9yZGVyLXppbmMtODAwXCI+XHJcbiAgICAgICAgICB7dGFicy5tYXAoKHRhYikgPT4gKFxyXG4gICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAga2V5PXt0YWIuaWR9XHJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0QWN0aXZlVGFiKHRhYi5pZCl9XHJcbiAgICAgICAgICAgICAgY2xhc3M9e2BmbGV4LTEgcHgtNCBweS0zIHRleHQtc20gZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgZ2FwLTIgYm9yZGVyLWItMiB0cmFuc2l0aW9uLWNvbG9ycyAke1xyXG4gICAgICAgICAgICAgICAgYWN0aXZlVGFiID09PSB0YWIuaWRcclxuICAgICAgICAgICAgICAgICAgPyAnYm9yZGVyLWluZGlnby01MDAgdGV4dC13aGl0ZSBiZy16aW5jLTgwMC81MCdcclxuICAgICAgICAgICAgICAgICAgOiAnYm9yZGVyLXRyYW5zcGFyZW50IHRleHQtemluYy00MDAgaG92ZXI6dGV4dC13aGl0ZSBob3ZlcjpiZy16aW5jLTgwMC8zMCdcclxuICAgICAgICAgICAgICB9YH1cclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIDxpIGNsYXNzPXtgZmEtc29saWQgJHt0YWIuaWNvbn1gfSAvPlxyXG4gICAgICAgICAgICAgIHt0YWIubGFiZWx9XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0ZXh0LXhzIHB4LTEuNSBweS0wLjUgcm91bmRlZCBiZy16aW5jLTcwMFwiPlxyXG4gICAgICAgICAgICAgICAge2FsbEFzc2V0c1t0YWIuaWRdLmxlbmd0aH1cclxuICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgKSl9XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIHsvKiBDb250ZW50ICovfVxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4LTEgb3ZlcmZsb3cteS1hdXRvIHAtNFwiPlxyXG4gICAgICAgICAge2N1cnJlbnRBc3NldHMubGVuZ3RoID09PSAwID8gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXIgcHktMTIgdGV4dC16aW5jLTUwMFwiPlxyXG4gICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEtc29saWQgZmEtZm9sZGVyLW9wZW4gdGV4dC00eGwgbWItM1wiIC8+XHJcbiAgICAgICAgICAgICAgPGRpdj5ObyB7YWN0aXZlVGFifSB5ZXQ8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dC1zbSBtdC0xXCI+VXBsb2FkIHNvbWUgZmlsZXMgdG8gZ2V0IHN0YXJ0ZWQ8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ3JpZCBncmlkLWNvbHMtMyBnYXAtM1wiPlxyXG4gICAgICAgICAgICAgIHtjdXJyZW50QXNzZXRzLm1hcCgocGF0aCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZmlsZW5hbWUgPSBwYXRoLnNwbGl0KCcvJykucG9wKCkgfHwgJyc7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpc0VkaXRpbmcgPSBlZGl0aW5nSXRlbSA9PT0gcGF0aDtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGtleT17cGF0aH0gY2xhc3M9XCJiZy16aW5jLTgwMCByb3VuZGVkIG92ZXJmbG93LWhpZGRlbiBncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhc3BlY3Qtc3F1YXJlIGJnLXppbmMtNzAwIHJlbGF0aXZlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8aW1nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyYz17Jy9hc3NldHMvJyArIHBhdGgucmVwbGFjZSgnYXNzZXRzLycsICcnKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJ3LWZ1bGwgaC1mdWxsIG9iamVjdC1jb250YWluXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9hZGluZz1cImxhenlcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgIHsvKiBPdmVybGF5IGFjdGlvbnMgKi99XHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWJzb2x1dGUgaW5zZXQtMCBiZy1ibGFjay82MCBvcGFjaXR5LTAgZ3JvdXAtaG92ZXI6b3BhY2l0eS0xMDAgdHJhbnNpdGlvbi1vcGFjaXR5IGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGdhcC0yXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzdGFydEVkaXRpbmcocGF0aCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJwLTIgYmctemluYy03MDAgaG92ZXI6YmctemluYy02MDAgcm91bmRlZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJSZW5hbWVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYS1zb2xpZCBmYS1wZW5cIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhhbmRsZURlbGV0ZShwYXRoKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInAtMiBiZy1yZWQtOTAwLzgwIGhvdmVyOmJnLXJlZC04MDAgcm91bmRlZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJEZWxldGVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYS1zb2xpZCBmYS10cmFzaFwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHtpc0VkaXRpbmcgPyAoXHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC0yXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17bmV3TmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbklucHV0PXsoZSkgPT4gc2V0TmV3TmFtZSgoZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uS2V5RG93bj17KGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJykgaGFuZGxlUmVuYW1lKHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRFZGl0aW5nSXRlbShudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0TmV3TmFtZSgnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInctZnVsbCBweC0yIHB5LTEgdGV4dC14cyByb3VuZGVkIGJnLXppbmMtNzAwIGJvcmRlciBib3JkZXItemluYy02MDBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9Gb2N1c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleCBnYXAtMSBtdC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gaGFuZGxlUmVuYW1lKHBhdGgpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJmbGV4LTEgcHgtMiBweS0xIHRleHQteHMgYmctaW5kaWdvLTYwMCBob3ZlcjpiZy1pbmRpZ28tNTAwIHJvdW5kZWRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNhdmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEVkaXRpbmdJdGVtKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXROZXdOYW1lKCcnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImZsZXgtMSBweC0yIHB5LTEgdGV4dC14cyBiZy16aW5jLTcwMCBob3ZlcjpiZy16aW5jLTYwMCByb3VuZGVkXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDYW5jZWxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtMiB0ZXh0LXhzIHRleHQtemluYy00MDAgdHJ1bmNhdGVcIiB0aXRsZT17ZmlsZW5hbWV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7ZmlsZW5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgKX1cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgey8qIEZvb3RlciB3aXRoIHVwbG9hZCAqL31cclxuICAgICAgICA8ZGl2IGNsYXNzPVwicC00IGJvcmRlci10IGJvcmRlci16aW5jLTgwMFwiPlxyXG4gICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgIHJlZj17ZmlsZUlucHV0UmVmfVxyXG4gICAgICAgICAgICB0eXBlPVwiZmlsZVwiXHJcbiAgICAgICAgICAgIGFjY2VwdD1cImltYWdlLypcIlxyXG4gICAgICAgICAgICBtdWx0aXBsZVxyXG4gICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlVXBsb2FkfVxyXG4gICAgICAgICAgICBjbGFzcz1cImhpZGRlblwiXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBmaWxlSW5wdXRSZWYuY3VycmVudD8uY2xpY2soKX1cclxuICAgICAgICAgICAgZGlzYWJsZWQ9e3VwbG9hZGluZ31cclxuICAgICAgICAgICAgY2xhc3M9e2B3LWZ1bGwgcHktMiByb3VuZGVkIHRleHQtc20gZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgZ2FwLTIgJHtcclxuICAgICAgICAgICAgICB1cGxvYWRpbmdcclxuICAgICAgICAgICAgICAgID8gJ2JnLXppbmMtNzAwIHRleHQtemluYy00MDAgY3Vyc29yLW5vdC1hbGxvd2VkJ1xyXG4gICAgICAgICAgICAgICAgOiAnYmctaW5kaWdvLTYwMCBob3ZlcjpiZy1pbmRpZ28tNTAwJ1xyXG4gICAgICAgICAgICB9YH1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAge3VwbG9hZGluZyA/IChcclxuICAgICAgICAgICAgICA8PlxyXG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYS1zb2xpZCBmYS1zcGlubmVyIGZhLXNwaW5cIiAvPlxyXG4gICAgICAgICAgICAgICAgVXBsb2FkaW5nLi4uXHJcbiAgICAgICAgICAgICAgPC8+XHJcbiAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgPD5cclxuICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEtc29saWQgZmEtdXBsb2FkXCIgLz5cclxuICAgICAgICAgICAgICAgIFVwbG9hZCBGaWxlc1xyXG4gICAgICAgICAgICAgIDwvPlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCAiLyoqXHJcbiAqIFVSTCBSb3V0aW5nIFV0aWxpdGllc1xyXG4gKi9cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVXJsUGFyYW1zIHtcclxuICBwcm9qZWN0OiBzdHJpbmcgfCBudWxsO1xyXG4gIGxhbmc6IHN0cmluZyB8IG51bGw7XHJcbiAgcGxhdGZvcm06IHN0cmluZyB8IG51bGw7XHJcbiAgc2NyZWVuc2hvdElkOiBzdHJpbmcgfCBudWxsO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VVcmxQYXJhbXMoKTogVXJsUGFyYW1zIHtcclxuICBjb25zdCBwYXRoID0gbG9jYXRpb24ucGF0aG5hbWU7XHJcbiAgY29uc3QgcGFydHMgPSBwYXRoLnNwbGl0KCcvJykuZmlsdGVyKEJvb2xlYW4pO1xyXG4gIHJldHVybiB7XHJcbiAgICBwcm9qZWN0OiBwYXJ0c1swXSB8fCBudWxsLFxyXG4gICAgbGFuZzogcGFydHNbMV0gfHwgbnVsbCxcclxuICAgIHBsYXRmb3JtOiBwYXJ0c1syXSB8fCBudWxsLFxyXG4gICAgc2NyZWVuc2hvdElkOiBwYXJ0c1szXSB8fCBudWxsLFxyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBidWlsZFVybChcclxuICBwcm9qZWN0OiBzdHJpbmcsXHJcbiAgbGFuZzogc3RyaW5nIHwgbnVsbCxcclxuICBwbGF0Zm9ybTogc3RyaW5nIHwgbnVsbCxcclxuICBzY3JlZW5zaG90SWQ6IHN0cmluZyB8IG51bGxcclxuKTogc3RyaW5nIHtcclxuICBsZXQgdXJsID0gJy8nICsgcHJvamVjdDtcclxuICBpZiAobGFuZykgdXJsICs9ICcvJyArIGxhbmc7XHJcbiAgaWYgKHBsYXRmb3JtKSB1cmwgKz0gJy8nICsgcGxhdGZvcm07XHJcbiAgaWYgKHNjcmVlbnNob3RJZCkgdXJsICs9ICcvJyArIHNjcmVlbnNob3RJZDtcclxuICByZXR1cm4gdXJsO1xyXG59XHJcbiIsICIvKipcclxuICogQVBJIENsaWVudCBVdGlsaXRpZXNcclxuICovXHJcblxyXG5pbXBvcnQgdHlwZSB7IFByb2plY3RDb25maWcsIFByb2plY3RJbmZvLCBBc3NldHMgfSBmcm9tICcuLi90eXBlcy50cyc7XHJcblxyXG4vKipcclxuICogU2F2ZSBjb25maWcgdG8gc2VydmVyXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2F2ZUNvbmZpZyhjb25maWc6IFByb2plY3RDb25maWcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICBhd2FpdCBmZXRjaCgnL2FwaS9jb25maWcnLCB7XHJcbiAgICBtZXRob2Q6ICdQVVQnLFxyXG4gICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXHJcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeShjb25maWcpLFxyXG4gIH0pO1xyXG59XHJcblxyXG4vKipcclxuICogRmV0Y2ggYXNzZXRzIGxpc3RcclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEFzc2V0cygpOiBQcm9taXNlPEFzc2V0cz4ge1xyXG4gIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCcvYXBpL2Fzc2V0cycpO1xyXG4gIHJldHVybiByZXMuanNvbigpO1xyXG59XHJcblxyXG4vKipcclxuICogU3dpdGNoIHRvIGEgcHJvamVjdFxyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFjdGl2YXRlUHJvamVjdChwcm9qZWN0SWQ6IHN0cmluZyk6IFByb21pc2U8eyBwcm9qZWN0SWQ6IHN0cmluZzsgY29uZmlnOiBQcm9qZWN0Q29uZmlnIH0+IHtcclxuICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChgL2FwaS9wcm9qZWN0cy8ke3Byb2plY3RJZH0vYWN0aXZhdGVgLCB7IG1ldGhvZDogJ1BVVCcgfSk7XHJcbiAgcmV0dXJuIHJlcy5qc29uKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgbmV3IHByb2plY3RcclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVQcm9qZWN0KG5hbWU6IHN0cmluZyk6IFByb21pc2U8UHJvamVjdEluZm8+IHtcclxuICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCgnL2FwaS9wcm9qZWN0cycsIHtcclxuICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXHJcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IG5hbWUgfSksXHJcbiAgfSk7XHJcbiAgcmV0dXJuIHJlcy5qc29uKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBEZWxldGUgcHJvamVjdFxyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVByb2plY3QocHJvamVjdElkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICBhd2FpdCBmZXRjaChgL2FwaS9wcm9qZWN0cy8ke3Byb2plY3RJZH1gLCB7IG1ldGhvZDogJ0RFTEVURScgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZW5hbWUgcHJvamVjdFxyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbmFtZVByb2plY3QocHJvamVjdElkOiBzdHJpbmcsIG5hbWU6IHN0cmluZyk6IFByb21pc2U8UHJvamVjdEluZm8+IHtcclxuICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChgL2FwaS9wcm9qZWN0cy8ke3Byb2plY3RJZH1gLCB7XHJcbiAgICBtZXRob2Q6ICdQQVRDSCcsXHJcbiAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcclxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgbmFtZSB9KSxcclxuICB9KTtcclxuICByZXR1cm4gcmVzLmpzb24oKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEFkZCBsYW5ndWFnZVxyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZExhbmd1YWdlKGxhbmd1YWdlOiBzdHJpbmcsIGNvcHlGcm9tOiBzdHJpbmcgfCBudWxsKTogUHJvbWlzZTx1bmtub3duPiB7XHJcbiAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goJy9hcGkvY29uZmlnL2xhbmd1YWdlJywge1xyXG4gICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcclxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgbGFuZ3VhZ2UsIGNvcHlGcm9tIH0pLFxyXG4gIH0pO1xyXG4gIHJldHVybiByZXMuanNvbigpO1xyXG59XHJcblxyXG4vKipcclxuICogRGVsZXRlIGxhbmd1YWdlXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlTGFuZ3VhZ2UobGFuZzogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgYXdhaXQgZmV0Y2goYC9hcGkvY29uZmlnL2xhbmd1YWdlLyR7bGFuZ31gLCB7IG1ldGhvZDogJ0RFTEVURScgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb3B5IHBsYXRmb3JtIHNjcmVlbnNob3RzXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29weVBsYXRmb3JtKFxyXG4gIGxhbmd1YWdlOiBzdHJpbmcsXHJcbiAgc291cmNlUGxhdGZvcm06IHN0cmluZyxcclxuICB0YXJnZXRQbGF0Zm9ybTogc3RyaW5nXHJcbik6IFByb21pc2U8dW5rbm93bj4ge1xyXG4gIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCcvYXBpL2NvbmZpZy9jb3B5LXBsYXRmb3JtJywge1xyXG4gICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcclxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgbGFuZ3VhZ2UsIHNvdXJjZVBsYXRmb3JtLCB0YXJnZXRQbGF0Zm9ybSB9KSxcclxuICB9KTtcclxuICByZXR1cm4gcmVzLmpzb24oKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEZldGNoIHByZXZpb3VzbHkgZ2VuZXJhdGVkIGltYWdlc1xyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoR2VuZXJhdGVkKCk6IFByb21pc2U8eyByZXN1bHRzOiB1bmtub3duW107IG91dHB1dERpcjogc3RyaW5nIH0gfCBudWxsPiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCcvYXBpL2dlbmVyYXRlZCcpO1xyXG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKCk7XHJcbiAgICBpZiAoZGF0YS5yZXN1bHRzICYmIGRhdGEucmVzdWx0cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfSBjYXRjaCB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBPcGVuIG91dHB1dCBmb2xkZXIgaW4gZmlsZSBleHBsb3JlclxyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG9wZW5PdXRwdXRGb2xkZXIoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgYXdhaXQgZmV0Y2goJy9hcGkvb3Blbi1mb2xkZXInLCB7XHJcbiAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxyXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe30pLFxyXG4gIH0pO1xyXG59XHJcbiIsICIvKipcclxuICogQXBwIENvbXBvbmVudFxyXG4gKiBcclxuICogTWFpbiBhcHBsaWNhdGlvbiBjb21wb25lbnQgZm9yIHRoZSBzY3JlZW5zaG90IGVkaXRvci5cclxuICogTWFuYWdlcyB0aGUgYXBwbGljYXRpb24gc3RhdGUgYW5kIGNvb3JkaW5hdGVzIGJldHdlZW4gc2lkZWJhciwgcHJldmlldywgYW5kIGVkaXRvcnMuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCwgdXNlUmVmIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgU2lkZWJhciB9IGZyb20gJy4vU2lkZWJhci50c3gnO1xyXG5pbXBvcnQgeyBQcmV2aWV3IH0gZnJvbSAnLi9QcmV2aWV3LnRzeCc7XHJcbmltcG9ydCB7IFNjcmVlbnNob3RFZGl0b3IsIEZlYXR1cmVHcmFwaGljRWRpdG9yIH0gZnJvbSAnLi9lZGl0b3JzL2luZGV4LnRzJztcclxuaW1wb3J0IHsgUHJvamVjdE1vZGFsIH0gZnJvbSAnLi9tb2RhbHMvUHJvamVjdE1vZGFsLnRzeCc7XHJcbmltcG9ydCB7IEdlbmVyYXRlTW9kYWwgfSBmcm9tICcuL21vZGFscy9HZW5lcmF0ZU1vZGFsLnRzeCc7XHJcbmltcG9ydCB7IFRoZW1lRWRpdG9yTW9kYWwgfSBmcm9tICcuL21vZGFscy9UaGVtZUVkaXRvck1vZGFsLnRzeCc7XHJcbmltcG9ydCB7IE1lZGlhTWFuYWdlck1vZGFsIH0gZnJvbSAnLi9tb2RhbHMvTWVkaWFNYW5hZ2VyTW9kYWwudHN4JztcclxuaW1wb3J0IHsgcGFyc2VVcmxQYXJhbXMsIGJ1aWxkVXJsIH0gZnJvbSAnLi4vdXRpbHMvcm91dGluZy50cyc7XHJcbmltcG9ydCB7IHNhdmVDb25maWcgYXMgYXBpU2F2ZUNvbmZpZywgZmV0Y2hBc3NldHMsIGFjdGl2YXRlUHJvamVjdCwgY3JlYXRlUHJvamVjdCwgZGVsZXRlUHJvamVjdCwgcmVuYW1lUHJvamVjdCB9IGZyb20gJy4uL3V0aWxzL2FwaS50cyc7XHJcbmltcG9ydCB0eXBlIHsgQXBwRGF0YSwgQXNzZXRzLCBTZWxlY3RlZEl0ZW0sIENvbmZpZywgU2NyZWVuc2hvdCwgRmVhdHVyZUdyYXBoaWMsIEdlbmVyYXRlUHJvZ3Jlc3MsIEdlbmVyYXRlUmVzdWx0IH0gZnJvbSAnLi4vdHlwZXMudHMnO1xyXG5cclxuZGVjbGFyZSBjb25zdCBfX0FQUF9EQVRBX186IEFwcERhdGE7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXBwKCkge1xyXG4gIGNvbnN0IGFwcERhdGEgPSBfX0FQUF9EQVRBX187XHJcbiAgXHJcbiAgLy8gUGFyc2UgVVJMIGZvciBpbml0aWFsIHN0YXRlXHJcbiAgY29uc3QgdXJsUGFyYW1zID0gcGFyc2VVcmxQYXJhbXMoKTtcclxuICBjb25zdCB2YWxpZFByb2plY3QgPSBhcHBEYXRhLnByb2plY3RzLmZpbmQocCA9PiBwLmlkID09PSB1cmxQYXJhbXMucHJvamVjdCk7XHJcbiAgY29uc3QgaW5pdGlhbFByb2plY3QgPSB2YWxpZFByb2plY3QgPyB1cmxQYXJhbXMucHJvamVjdCA6IGFwcERhdGEucHJvamVjdElkO1xyXG4gIFxyXG4gIC8vIFN0YXRlXHJcbiAgY29uc3QgW2NvbmZpZywgc2V0Q29uZmlnXSA9IHVzZVN0YXRlPENvbmZpZz4oYXBwRGF0YS5jb25maWcpO1xyXG4gIGNvbnN0IFtwcm9qZWN0cywgc2V0UHJvamVjdHNdID0gdXNlU3RhdGUoYXBwRGF0YS5wcm9qZWN0cyk7XHJcbiAgY29uc3QgW2N1cnJlbnRQcm9qZWN0LCBzZXRDdXJyZW50UHJvamVjdF0gPSB1c2VTdGF0ZShpbml0aWFsUHJvamVjdCk7XHJcbiAgY29uc3QgW3NlbGVjdGVkTGFuZywgc2V0U2VsZWN0ZWRMYW5nXSA9IHVzZVN0YXRlKCgpID0+IHtcclxuICAgIGlmICh1cmxQYXJhbXMubGFuZyAmJiBjb25maWcubGFuZ3VhZ2VzPy5maW5kKGwgPT4gbC5sYW5ndWFnZSA9PT0gdXJsUGFyYW1zLmxhbmcpKSB7XHJcbiAgICAgIHJldHVybiB1cmxQYXJhbXMubGFuZztcclxuICAgIH1cclxuICAgIHJldHVybiBjb25maWcubGFuZ3VhZ2VzPy5bMF0/Lmxhbmd1YWdlIHx8ICdlbic7XHJcbiAgfSk7XHJcbiAgY29uc3QgW3NlbGVjdGVkUGxhdGZvcm0sIHNldFNlbGVjdGVkUGxhdGZvcm1dID0gdXNlU3RhdGU8J2FuZHJvaWQnIHwgJ2lvcyc+KCgpID0+IHtcclxuICAgIGlmICh1cmxQYXJhbXMucGxhdGZvcm0gJiYgWydhbmRyb2lkJywgJ2lvcyddLmluY2x1ZGVzKHVybFBhcmFtcy5wbGF0Zm9ybSkpIHtcclxuICAgICAgcmV0dXJuIHVybFBhcmFtcy5wbGF0Zm9ybSBhcyAnYW5kcm9pZCcgfCAnaW9zJztcclxuICAgIH1cclxuICAgIHJldHVybiAnYW5kcm9pZCc7XHJcbiAgfSk7XHJcbiAgY29uc3QgW3NlbGVjdGVkSXRlbSwgc2V0U2VsZWN0ZWRJdGVtXSA9IHVzZVN0YXRlPFNlbGVjdGVkSXRlbT4oKCkgPT4ge1xyXG4gICAgaWYgKHVybFBhcmFtcy5zY3JlZW5zaG90SWQgPT09ICdmZWF0dXJlLWdyYXBoaWMnKSB7XHJcbiAgICAgIHJldHVybiB7IHR5cGU6ICdmZWF0dXJlLWdyYXBoaWMnIH07XHJcbiAgICB9XHJcbiAgICBpZiAodXJsUGFyYW1zLnNjcmVlbnNob3RJZCkge1xyXG4gICAgICByZXR1cm4geyB0eXBlOiAnc2NyZWVuc2hvdCcsIGlkOiB1cmxQYXJhbXMuc2NyZWVuc2hvdElkIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9KTtcclxuICBjb25zdCBbYXNzZXRzLCBzZXRBc3NldHNdID0gdXNlU3RhdGU8QXNzZXRzPih7IHNjcmVlbnNob3RzOiBbXSwgaWNvbnM6IFtdLCBtYXNjb3RzOiBbXSB9KTtcclxuICBjb25zdCBbZ2VuZXJhdGluZywgc2V0R2VuZXJhdGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XHJcbiAgY29uc3QgW3Nob3dQcm9qZWN0TW9kYWwsIHNldFNob3dQcm9qZWN0TW9kYWxdID0gdXNlU3RhdGUoZmFsc2UpO1xyXG4gIGNvbnN0IFtzaG93R2VuZXJhdGVNb2RhbCwgc2V0U2hvd0dlbmVyYXRlTW9kYWxdID0gdXNlU3RhdGUoZmFsc2UpO1xyXG4gIGNvbnN0IFtzaG93VGhlbWVFZGl0b3IsIHNldFNob3dUaGVtZUVkaXRvcl0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcbiAgY29uc3QgW3Nob3dNZWRpYU1hbmFnZXIsIHNldFNob3dNZWRpYU1hbmFnZXJdID0gdXNlU3RhdGUoZmFsc2UpO1xyXG4gIGNvbnN0IFtsYXN0R2VuZXJhdGVkLCBzZXRMYXN0R2VuZXJhdGVkXSA9IHVzZVN0YXRlPHsgcmVzdWx0czogR2VuZXJhdGVSZXN1bHRbXTsgb3V0cHV0RGlyOiBzdHJpbmcgfSB8IG51bGw+KG51bGwpO1xyXG4gIGNvbnN0IFtnZW5lcmF0ZVByb2dyZXNzLCBzZXRHZW5lcmF0ZVByb2dyZXNzXSA9IHVzZVN0YXRlPEdlbmVyYXRlUHJvZ3Jlc3M+KHtcclxuICAgIGN1cnJlbnQ6IDAsXHJcbiAgICB0b3RhbDogMCxcclxuICAgIGl0ZW06ICcnLFxyXG4gICAgcmVzdWx0czogbnVsbCxcclxuICAgIG91dHB1dERpcjogJycsXHJcbiAgfSk7XHJcbiAgY29uc3QgW3ByZXZpZXdWZXJzaW9uLCBzZXRQcmV2aWV3VmVyc2lvbl0gPSB1c2VTdGF0ZSgwKTtcclxuXHJcbiAgY29uc3Qgc2F2ZVRpbWVvdXRSZWYgPSB1c2VSZWY8bnVtYmVyIHwgbnVsbD4obnVsbCk7XHJcbiAgY29uc3QgcGVuZGluZ0NvbmZpZ1JlZiA9IHVzZVJlZjxDb25maWcgfCBudWxsPihudWxsKTtcclxuICBjb25zdCBTQVZFX0RFQk9VTkNFX01TID0gNTA7XHJcblxyXG4gIC8vIEZldGNoIHByZXZpb3VzbHkgZ2VuZXJhdGVkIGltYWdlc1xyXG4gIGNvbnN0IGZldGNoTGFzdEdlbmVyYXRlZCA9IGFzeW5jICgpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCcvYXBpL2dlbmVyYXRlZCcpO1xyXG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKTtcclxuICAgICAgaWYgKGRhdGEucmVzdWx0cyAmJiBkYXRhLnJlc3VsdHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHNldExhc3RHZW5lcmF0ZWQoZGF0YSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2V0TGFzdEdlbmVyYXRlZChudWxsKTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCB7XHJcbiAgICAgIHNldExhc3RHZW5lcmF0ZWQobnVsbCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgLy8gTG9hZCBhc3NldHMgYW5kIGxhc3QgZ2VuZXJhdGVkIG9uIG1vdW50XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGZldGNoQXNzZXRzKCkudGhlbihzZXRBc3NldHMpO1xyXG4gICAgZmV0Y2hMYXN0R2VuZXJhdGVkKCk7XHJcbiAgfSwgW2N1cnJlbnRQcm9qZWN0XSk7XHJcblxyXG4gIC8vIFVwZGF0ZSBVUkwgd2hlbiBzZWxlY3Rpb25zIGNoYW5nZVxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoIWN1cnJlbnRQcm9qZWN0KSByZXR1cm47XHJcbiAgICBjb25zdCBzY3JlZW5zaG90SWQgPSBzZWxlY3RlZEl0ZW0/LnR5cGUgPT09ICdmZWF0dXJlLWdyYXBoaWMnXHJcbiAgICAgID8gJ2ZlYXR1cmUtZ3JhcGhpYydcclxuICAgICAgOiBzZWxlY3RlZEl0ZW0/LnR5cGUgPT09ICdzY3JlZW5zaG90JyA/IHNlbGVjdGVkSXRlbS5pZCA6IG51bGw7XHJcbiAgICBjb25zdCBuZXdVcmwgPSBidWlsZFVybChjdXJyZW50UHJvamVjdCwgc2VsZWN0ZWRMYW5nLCBzZWxlY3RlZFBsYXRmb3JtLCBzY3JlZW5zaG90SWQpO1xyXG4gICAgaWYgKGxvY2F0aW9uLnBhdGhuYW1lICE9PSBuZXdVcmwpIHtcclxuICAgICAgaGlzdG9yeS5wdXNoU3RhdGUoe30sICcnLCBuZXdVcmwpO1xyXG4gICAgfVxyXG4gIH0sIFtjdXJyZW50UHJvamVjdCwgc2VsZWN0ZWRMYW5nLCBzZWxlY3RlZFBsYXRmb3JtLCBzZWxlY3RlZEl0ZW1dKTtcclxuXHJcbiAgLy8gSGVscGVyc1xyXG4gIGNvbnN0IGdldExhbmdDb25maWcgPSAoKSA9PiBjb25maWcubGFuZ3VhZ2VzPy5maW5kKGwgPT4gbC5sYW5ndWFnZSA9PT0gc2VsZWN0ZWRMYW5nKTtcclxuICBjb25zdCBnZXRQbGF0Zm9ybUNvbmZpZyA9ICgpID0+IGdldExhbmdDb25maWcoKT8ucGxhdGZvcm1zPy5bc2VsZWN0ZWRQbGF0Zm9ybV07XHJcbiAgY29uc3QgZ2V0U2NyZWVuc2hvdHMgPSAoKTogU2NyZWVuc2hvdFtdID0+IGdldFBsYXRmb3JtQ29uZmlnKCk/LnNjcmVlbnNob3RzIHx8IFtdO1xyXG4gIGNvbnN0IGdldEZlYXR1cmVHcmFwaGljID0gKCk6IEZlYXR1cmVHcmFwaGljIHwgdW5kZWZpbmVkID0+IGdldExhbmdDb25maWcoKT8ucGxhdGZvcm1zPy5hbmRyb2lkPy5mZWF0dXJlR3JhcGhpYyA/PyB1bmRlZmluZWQ7XHJcblxyXG4gIGNvbnN0IHBlcnNpc3RDb25maWcgPSBhc3luYyAoY29uZmlnVG9QZXJzaXN0OiBDb25maWcpID0+IHtcclxuICAgIGF3YWl0IGFwaVNhdmVDb25maWcoY29uZmlnVG9QZXJzaXN0KTtcclxuICB9O1xyXG5cclxuICBjb25zdCBmbHVzaFBlbmRpbmdTYXZlID0gYXN5bmMgKHJlZnJlc2hQcmV2aWV3ID0gdHJ1ZSkgPT4ge1xyXG4gICAgaWYgKHNhdmVUaW1lb3V0UmVmLmN1cnJlbnQpIHtcclxuICAgICAgY2xlYXJUaW1lb3V0KHNhdmVUaW1lb3V0UmVmLmN1cnJlbnQpO1xyXG4gICAgICBzYXZlVGltZW91dFJlZi5jdXJyZW50ID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXBlbmRpbmdDb25maWdSZWYuY3VycmVudCkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IGNvbmZpZ1RvUGVyc2lzdCA9IHBlbmRpbmdDb25maWdSZWYuY3VycmVudDtcclxuICAgIHBlbmRpbmdDb25maWdSZWYuY3VycmVudCA9IG51bGw7XHJcbiAgICBhd2FpdCBwZXJzaXN0Q29uZmlnKGNvbmZpZ1RvUGVyc2lzdCk7XHJcbiAgICBpZiAocmVmcmVzaFByZXZpZXcpIHtcclxuICAgICAgc2V0UHJldmlld1ZlcnNpb24odiA9PiB2ICsgMSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgc2F2ZUNvbmZpZyA9IChuZXdDb25maWc6IENvbmZpZykgPT4ge1xyXG4gICAgc2V0Q29uZmlnKG5ld0NvbmZpZyk7XHJcbiAgICBwZW5kaW5nQ29uZmlnUmVmLmN1cnJlbnQgPSBuZXdDb25maWc7XHJcblxyXG4gICAgaWYgKHNhdmVUaW1lb3V0UmVmLmN1cnJlbnQpIHtcclxuICAgICAgY2xlYXJUaW1lb3V0KHNhdmVUaW1lb3V0UmVmLmN1cnJlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFNhdmUgaW1tZWRpYXRlbHkgYW5kIHJlZnJlc2ggcHJldmlldyBhZnRlciBzYXZlIGNvbXBsZXRlc1xyXG4gICAgc2F2ZVRpbWVvdXRSZWYuY3VycmVudCA9IHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xyXG4gICAgICBhd2FpdCBmbHVzaFBlbmRpbmdTYXZlKHRydWUpO1xyXG4gICAgfSwgU0FWRV9ERUJPVU5DRV9NUyk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgdXBkYXRlU2NyZWVuc2hvdCA9IChpZDogc3RyaW5nLCB1cGRhdGVzOiBQYXJ0aWFsPFNjcmVlbnNob3Q+KSA9PiB7XHJcbiAgICBjb25zdCBuZXdDb25maWcgPSB7IC4uLmNvbmZpZyB9O1xyXG4gICAgY29uc3QgbGFuZ0NvbmZpZyA9IG5ld0NvbmZpZy5sYW5ndWFnZXM/LmZpbmQobCA9PiBsLmxhbmd1YWdlID09PSBzZWxlY3RlZExhbmcpO1xyXG4gICAgY29uc3QgcGxhdGZvcm1Db25maWcgPSBsYW5nQ29uZmlnPy5wbGF0Zm9ybXM/LltzZWxlY3RlZFBsYXRmb3JtXTtcclxuICAgIGlmIChwbGF0Zm9ybUNvbmZpZykge1xyXG4gICAgICBjb25zdCBpZHggPSBwbGF0Zm9ybUNvbmZpZy5zY3JlZW5zaG90cy5maW5kSW5kZXgocyA9PiBzLmlkID09PSBpZCk7XHJcbiAgICAgIGlmIChpZHggIT09IC0xKSB7XHJcbiAgICAgICAgcGxhdGZvcm1Db25maWcuc2NyZWVuc2hvdHNbaWR4XSA9IHsgLi4ucGxhdGZvcm1Db25maWcuc2NyZWVuc2hvdHNbaWR4XSwgLi4udXBkYXRlcyB9O1xyXG4gICAgICAgIHNhdmVDb25maWcobmV3Q29uZmlnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IHVwZGF0ZUZlYXR1cmVHcmFwaGljID0gKHVwZGF0ZXM6IFBhcnRpYWw8RmVhdHVyZUdyYXBoaWM+KSA9PiB7XHJcbiAgICBjb25zdCBuZXdDb25maWcgPSB7IC4uLmNvbmZpZyB9O1xyXG4gICAgY29uc3QgbGFuZ0NvbmZpZyA9IG5ld0NvbmZpZy5sYW5ndWFnZXM/LmZpbmQobCA9PiBsLmxhbmd1YWdlID09PSBzZWxlY3RlZExhbmcpO1xyXG4gICAgaWYgKGxhbmdDb25maWc/LnBsYXRmb3Jtcz8uYW5kcm9pZCkge1xyXG4gICAgICBsYW5nQ29uZmlnLnBsYXRmb3Jtcy5hbmRyb2lkLmZlYXR1cmVHcmFwaGljID0ge1xyXG4gICAgICAgIC4uLihsYW5nQ29uZmlnLnBsYXRmb3Jtcy5hbmRyb2lkLmZlYXR1cmVHcmFwaGljIHx8IHt9IGFzIEZlYXR1cmVHcmFwaGljKSxcclxuICAgICAgICAuLi51cGRhdGVzLFxyXG4gICAgICB9O1xyXG4gICAgICBzYXZlQ29uZmlnKG5ld0NvbmZpZyk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgYWRkU2NyZWVuc2hvdCA9ICgpID0+IHtcclxuICAgIGNvbnN0IGlkID0gJ3NjcmVlbnNob3QtJyArIERhdGUubm93KCk7XHJcbiAgICBjb25zdCBuZXdTY3JlZW5zaG90OiBTY3JlZW5zaG90ID0ge1xyXG4gICAgICBpZCxcclxuICAgICAgaGVhZGxpbmU6ICdOZXcgU2NyZWVuc2hvdCcsXHJcbiAgICAgIHN1YnRpdGxlOiAnQWRkIGEgc3VidGl0bGUnLFxyXG4gICAgICBpbWFnZVBhdGg6ICcnLFxyXG4gICAgICBnbG93czogW3sgY29sb3I6ICdwdXJwbGUnLCBzaXplOiA0MDAsIHRvcDogJzEwJScsIGxlZnQ6ICcyMCUnIH1dLFxyXG4gICAgICBwaG9uZUZyYW1lOiB7IHNjYWxlOiA3MCwgYm90dG9tT2Zmc2V0OiA2IH0sXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IG5ld0NvbmZpZyA9IHsgLi4uY29uZmlnIH07XHJcbiAgICBjb25zdCBsYW5nQ29uZmlnID0gbmV3Q29uZmlnLmxhbmd1YWdlcz8uZmluZChsID0+IGwubGFuZ3VhZ2UgPT09IHNlbGVjdGVkTGFuZyk7XHJcbiAgICBpZiAobGFuZ0NvbmZpZz8ucGxhdGZvcm1zPy5bc2VsZWN0ZWRQbGF0Zm9ybV0pIHtcclxuICAgICAgbGFuZ0NvbmZpZy5wbGF0Zm9ybXNbc2VsZWN0ZWRQbGF0Zm9ybV0uc2NyZWVuc2hvdHMucHVzaChuZXdTY3JlZW5zaG90KTtcclxuICAgICAgc2F2ZUNvbmZpZyhuZXdDb25maWcpO1xyXG4gICAgICBzZXRTZWxlY3RlZEl0ZW0oeyB0eXBlOiAnc2NyZWVuc2hvdCcsIGlkIH0pO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGRlbGV0ZVNjcmVlbnNob3QgPSAoaWQ6IHN0cmluZykgPT4ge1xyXG4gICAgY29uc3QgbmV3Q29uZmlnID0geyAuLi5jb25maWcgfTtcclxuICAgIGNvbnN0IGxhbmdDb25maWcgPSBuZXdDb25maWcubGFuZ3VhZ2VzPy5maW5kKGwgPT4gbC5sYW5ndWFnZSA9PT0gc2VsZWN0ZWRMYW5nKTtcclxuICAgIGlmIChsYW5nQ29uZmlnPy5wbGF0Zm9ybXM/LltzZWxlY3RlZFBsYXRmb3JtXSkge1xyXG4gICAgICBsYW5nQ29uZmlnLnBsYXRmb3Jtc1tzZWxlY3RlZFBsYXRmb3JtXS5zY3JlZW5zaG90cyA9XHJcbiAgICAgICAgbGFuZ0NvbmZpZy5wbGF0Zm9ybXNbc2VsZWN0ZWRQbGF0Zm9ybV0uc2NyZWVuc2hvdHMuZmlsdGVyKHMgPT4gcy5pZCAhPT0gaWQpO1xyXG4gICAgICBzYXZlQ29uZmlnKG5ld0NvbmZpZyk7XHJcbiAgICAgIGlmIChzZWxlY3RlZEl0ZW0/LnR5cGUgPT09ICdzY3JlZW5zaG90JyAmJiBzZWxlY3RlZEl0ZW0uaWQgPT09IGlkKSB7XHJcbiAgICAgICAgc2V0U2VsZWN0ZWRJdGVtKG51bGwpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgcmVmcmVzaEFzc2V0cyA9IGFzeW5jICgpID0+IHtcclxuICAgIGNvbnN0IG5ld0Fzc2V0cyA9IGF3YWl0IGZldGNoQXNzZXRzKCk7XHJcbiAgICBzZXRBc3NldHMobmV3QXNzZXRzKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBzd2l0Y2hQcm9qZWN0ID0gYXN5bmMgKHByb2plY3RJZDogc3RyaW5nKSA9PiB7XHJcbiAgICBhd2FpdCBmbHVzaFBlbmRpbmdTYXZlKGZhbHNlKTtcclxuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBhY3RpdmF0ZVByb2plY3QocHJvamVjdElkKTtcclxuICAgIHNldEN1cnJlbnRQcm9qZWN0KHByb2plY3RJZCk7XHJcbiAgICBzZXRDb25maWcoZGF0YS5jb25maWcpO1xyXG4gICAgc2V0U2VsZWN0ZWRMYW5nKGRhdGEuY29uZmlnLmxhbmd1YWdlcz8uWzBdPy5sYW5ndWFnZSB8fCAnZW4nKTtcclxuICAgIHNldFNlbGVjdGVkSXRlbShudWxsKTtcclxuICAgIGNvbnN0IG5ld0Fzc2V0cyA9IGF3YWl0IGZldGNoQXNzZXRzKCk7XHJcbiAgICBzZXRBc3NldHMobmV3QXNzZXRzKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBhZGRMYW5ndWFnZSA9IGFzeW5jIChsYW5ndWFnZTogc3RyaW5nLCBjb3B5RnJvbTogc3RyaW5nIHwgbnVsbCkgPT4ge1xyXG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goJy9hcGkvY29uZmlnL2xhbmd1YWdlJywge1xyXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXHJcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgbGFuZ3VhZ2UsIGNvcHlGcm9tIH0pLFxyXG4gICAgfSk7XHJcbiAgICBpZiAocmVzLm9rKSB7XHJcbiAgICAgIGNvbnN0IG5ld0xhbmcgPSBhd2FpdCByZXMuanNvbigpO1xyXG4gICAgICBjb25zdCBuZXdDb25maWcgPSB7IC4uLmNvbmZpZyB9O1xyXG4gICAgICBpZiAoIW5ld0NvbmZpZy5sYW5ndWFnZXMpIG5ld0NvbmZpZy5sYW5ndWFnZXMgPSBbXTtcclxuICAgICAgbmV3Q29uZmlnLmxhbmd1YWdlcy5wdXNoKG5ld0xhbmcpO1xyXG4gICAgICBzZXRDb25maWcobmV3Q29uZmlnKTtcclxuICAgICAgc2V0U2VsZWN0ZWRMYW5nKGxhbmd1YWdlKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBjb3B5UGxhdGZvcm1Db25maWcgPSBhc3luYyAoc291cmNlUGxhdGZvcm06ICdhbmRyb2lkJyB8ICdpb3MnLCB0YXJnZXRQbGF0Zm9ybTogJ2FuZHJvaWQnIHwgJ2lvcycpID0+IHtcclxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCcvYXBpL2NvbmZpZy9jb3B5LXBsYXRmb3JtJywge1xyXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXHJcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICBsYW5ndWFnZTogc2VsZWN0ZWRMYW5nLFxyXG4gICAgICAgIHNvdXJjZVBsYXRmb3JtLFxyXG4gICAgICAgIHRhcmdldFBsYXRmb3JtLFxyXG4gICAgICB9KSxcclxuICAgIH0pO1xyXG4gICAgaWYgKHJlcy5vaykge1xyXG4gICAgICBjb25zdCB1cGRhdGVkTGFuZyA9IGF3YWl0IHJlcy5qc29uKCk7XHJcbiAgICAgIGNvbnN0IG5ld0NvbmZpZyA9IHsgLi4uY29uZmlnIH07XHJcbiAgICAgIGNvbnN0IGxhbmdJbmRleCA9IG5ld0NvbmZpZy5sYW5ndWFnZXM/LmZpbmRJbmRleChsID0+IGwubGFuZ3VhZ2UgPT09IHNlbGVjdGVkTGFuZykgPz8gLTE7XHJcbiAgICAgIGlmIChsYW5nSW5kZXggPj0gMCAmJiBuZXdDb25maWcubGFuZ3VhZ2VzKSB7XHJcbiAgICAgICAgbmV3Q29uZmlnLmxhbmd1YWdlc1tsYW5nSW5kZXhdID0gdXBkYXRlZExhbmc7XHJcbiAgICAgIH1cclxuICAgICAgc2V0Q29uZmlnKG5ld0NvbmZpZyk7XHJcbiAgICAgIHNldFNlbGVjdGVkUGxhdGZvcm0odGFyZ2V0UGxhdGZvcm0pO1xyXG4gICAgICBzZXRTZWxlY3RlZEl0ZW0obnVsbCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgaGFuZGxlQ3JlYXRlUHJvamVjdCA9IGFzeW5jIChuYW1lOiBzdHJpbmcpID0+IHtcclxuICAgIGNvbnN0IHByb2plY3QgPSBhd2FpdCBjcmVhdGVQcm9qZWN0KG5hbWUpO1xyXG4gICAgc2V0UHJvamVjdHMoWy4uLnByb2plY3RzLCBwcm9qZWN0XSk7XHJcbiAgICBhd2FpdCBzd2l0Y2hQcm9qZWN0KHByb2plY3QuaWQpO1xyXG4gICAgc2V0U2hvd1Byb2plY3RNb2RhbChmYWxzZSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgaGFuZGxlRGVsZXRlUHJvamVjdCA9IGFzeW5jIChwcm9qZWN0SWQ6IHN0cmluZykgPT4ge1xyXG4gICAgYXdhaXQgZGVsZXRlUHJvamVjdChwcm9qZWN0SWQpO1xyXG4gICAgc2V0UHJvamVjdHMocHJvamVjdHMuZmlsdGVyKHAgPT4gcC5pZCAhPT0gcHJvamVjdElkKSk7XHJcbiAgICAvLyBJZiBkZWxldGVkIHRoZSBjdXJyZW50IHByb2plY3QsIHN3aXRjaCB0byBkZWZhdWx0XHJcbiAgICBpZiAoY3VycmVudFByb2plY3QgPT09IHByb2plY3RJZCAmJiBwcm9qZWN0cy5sZW5ndGggPiAxKSB7XHJcbiAgICAgIGNvbnN0IHJlbWFpbmluZyA9IHByb2plY3RzLmZpbHRlcihwID0+IHAuaWQgIT09IHByb2plY3RJZCk7XHJcbiAgICAgIGlmIChyZW1haW5pbmcubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGF3YWl0IHN3aXRjaFByb2plY3QocmVtYWluaW5nWzBdLmlkKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGhhbmRsZVJlbmFtZVByb2plY3QgPSBhc3luYyAocHJvamVjdElkOiBzdHJpbmcsIG5ld05hbWU6IHN0cmluZykgPT4ge1xyXG4gICAgY29uc3QgdXBkYXRlZCA9IGF3YWl0IHJlbmFtZVByb2plY3QocHJvamVjdElkLCBuZXdOYW1lKTtcclxuICAgIHNldFByb2plY3RzKHByb2plY3RzLm1hcChwID0+IHAuaWQgPT09IHByb2plY3RJZCA/IHVwZGF0ZWQgOiBwKSk7XHJcbiAgICAvLyBJZiByZW5hbWVkIGN1cnJlbnQgcHJvamVjdCwgcmVsb2FkIGNvbmZpZ1xyXG4gICAgaWYgKGN1cnJlbnRQcm9qZWN0ID09PSBwcm9qZWN0SWQpIHtcclxuICAgICAgY29uc3QgY29uZmlnID0gYXdhaXQgZmV0Y2goJy9hcGkvY29uZmlnJykudGhlbihyID0+IHIuanNvbigpKTtcclxuICAgICAgc2V0Q29uZmlnKGNvbmZpZyk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgZ2VuZXJhdGVBbGwgPSBhc3luYyAoKSA9PiB7XHJcbiAgICBhd2FpdCBmbHVzaFBlbmRpbmdTYXZlKCk7XHJcbiAgICBzZXRTaG93R2VuZXJhdGVNb2RhbCh0cnVlKTtcclxuICAgIHNldEdlbmVyYXRlUHJvZ3Jlc3MoeyBjdXJyZW50OiAwLCB0b3RhbDogMCwgaXRlbTogJ1N0YXJ0aW5nLi4uJywgcmVzdWx0czogbnVsbCwgb3V0cHV0RGlyOiAnJyB9KTtcclxuICAgIHNldEdlbmVyYXRpbmcodHJ1ZSk7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnL2FwaS9nZW5lcmF0ZS9zdHJlYW0nLCB7XHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXHJcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe30pLFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGNvbnN0IHJlYWRlciA9IHJlc3BvbnNlLmJvZHk/LmdldFJlYWRlcigpO1xyXG4gICAgICBpZiAoIXJlYWRlcikgdGhyb3cgbmV3IEVycm9yKCdObyByZXNwb25zZSBib2R5Jyk7XHJcblxyXG4gICAgICBjb25zdCBkZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKCk7XHJcblxyXG4gICAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IHsgZG9uZSwgdmFsdWUgfSA9IGF3YWl0IHJlYWRlci5yZWFkKCk7XHJcbiAgICAgICAgaWYgKGRvbmUpIGJyZWFrO1xyXG5cclxuICAgICAgICBjb25zdCB0ZXh0ID0gZGVjb2Rlci5kZWNvZGUodmFsdWUpO1xyXG4gICAgICAgIGNvbnN0IGxpbmVzID0gdGV4dC5zcGxpdCgnXFxuJykuZmlsdGVyKGwgPT4gbC5zdGFydHNXaXRoKCdkYXRhOiAnKSk7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgbGluZSBvZiBsaW5lcykge1xyXG4gICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UobGluZS5zbGljZSg2KSk7XHJcbiAgICAgICAgICAgIGlmIChkYXRhLnR5cGUgPT09ICdzdGFydCcpIHtcclxuICAgICAgICAgICAgICBzZXRHZW5lcmF0ZVByb2dyZXNzKHByZXYgPT4gKHsgLi4ucHJldiwgdG90YWw6IGRhdGEudG90YWwgfSkpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEudHlwZSA9PT0gJ3Byb2dyZXNzJykge1xyXG4gICAgICAgICAgICAgIHNldEdlbmVyYXRlUHJvZ3Jlc3MocHJldiA9PiAoeyAuLi5wcmV2LCBjdXJyZW50OiBkYXRhLmN1cnJlbnQsIGl0ZW06IGRhdGEuaXRlbSB9KSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS50eXBlID09PSAnY29tcGxldGUnKSB7XHJcbiAgICAgICAgICAgICAgc2V0R2VuZXJhdGVQcm9ncmVzcyhwcmV2ID0+ICh7IC4uLnByZXYsIHJlc3VsdHM6IGRhdGEucmVzdWx0cywgb3V0cHV0RGlyOiBkYXRhLm91dHB1dERpciwgY3VycmVudDogcHJldi50b3RhbCB9KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gY2F0Y2gge1xyXG4gICAgICAgICAgICAvLyBJZ25vcmUgcGFyc2UgZXJyb3JzXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBhbGVydCgnR2VuZXJhdGlvbiBmYWlsZWQ6ICcgKyAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UpO1xyXG4gICAgICBzZXRTaG93R2VuZXJhdGVNb2RhbChmYWxzZSk7XHJcbiAgICB9XHJcbiAgICBzZXRHZW5lcmF0aW5nKGZhbHNlKTtcclxuICAgIGZldGNoTGFzdEdlbmVyYXRlZCgpOyAvLyBSZWZyZXNoIGxhc3QgZ2VuZXJhdGVkIGxpc3RcclxuICB9O1xyXG5cclxuICAvLyBWaWV3IHByZXZpb3VzbHkgZ2VuZXJhdGVkIGltYWdlc1xyXG4gIGNvbnN0IHZpZXdMYXN0R2VuZXJhdGVkID0gKCkgPT4ge1xyXG4gICAgaWYgKGxhc3RHZW5lcmF0ZWQpIHtcclxuICAgICAgc2V0R2VuZXJhdGVQcm9ncmVzcyh7XHJcbiAgICAgICAgY3VycmVudDogbGFzdEdlbmVyYXRlZC5yZXN1bHRzLmxlbmd0aCxcclxuICAgICAgICB0b3RhbDogbGFzdEdlbmVyYXRlZC5yZXN1bHRzLmxlbmd0aCxcclxuICAgICAgICBpdGVtOiAnJyxcclxuICAgICAgICByZXN1bHRzOiBsYXN0R2VuZXJhdGVkLnJlc3VsdHMsXHJcbiAgICAgICAgb3V0cHV0RGlyOiBsYXN0R2VuZXJhdGVkLm91dHB1dERpcixcclxuICAgICAgfSk7XHJcbiAgICAgIHNldFNob3dHZW5lcmF0ZU1vZGFsKHRydWUpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIC8vIEdldCBzZWxlY3RlZCBzY3JlZW5zaG90XHJcbiAgY29uc3QgZ2V0U2VsZWN0ZWRTY3JlZW5zaG90ID0gKCk6IFNjcmVlbnNob3QgfCB1bmRlZmluZWQgPT4ge1xyXG4gICAgaWYgKHNlbGVjdGVkSXRlbT8udHlwZSA9PT0gJ3NjcmVlbnNob3QnKSB7XHJcbiAgICAgIHJldHVybiBnZXRTY3JlZW5zaG90cygpLmZpbmQocyA9PiBzLmlkID09PSBzZWxlY3RlZEl0ZW0uaWQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICB9O1xyXG5cclxuICAvLyBHZXQgcHJldmlldyBVUkxcclxuICBjb25zdCBnZXRQcmV2aWV3VXJsID0gKCk6IHN0cmluZyB8IG51bGwgPT4ge1xyXG4gICAgaWYgKHNlbGVjdGVkSXRlbT8udHlwZSA9PT0gJ3NjcmVlbnNob3QnICYmIHNlbGVjdGVkSXRlbS5pZCkge1xyXG4gICAgICByZXR1cm4gYC9wcmV2aWV3L3NjcmVlbnNob3QvJHtzZWxlY3RlZExhbmd9LyR7c2VsZWN0ZWRQbGF0Zm9ybX0vJHtzZWxlY3RlZEl0ZW0uaWR9YDtcclxuICAgIH1cclxuICAgIGlmIChzZWxlY3RlZEl0ZW0/LnR5cGUgPT09ICdmZWF0dXJlLWdyYXBoaWMnKSB7XHJcbiAgICAgIHJldHVybiBgL3ByZXZpZXcvZmVhdHVyZS1ncmFwaGljLyR7c2VsZWN0ZWRMYW5nfWA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9O1xyXG5cclxuICBjb25zdCBzZWxlY3RlZFNjcmVlbnNob3QgPSBnZXRTZWxlY3RlZFNjcmVlbnNob3QoKTtcclxuICBjb25zdCBmZWF0dXJlR3JhcGhpYyA9IGdldEZlYXR1cmVHcmFwaGljKCk7XHJcbiAgY29uc3QgcHJldmlld1VybCA9IGdldFByZXZpZXdVcmwoKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3M9XCJmbGV4IGgtc2NyZWVuIGJnLXppbmMtOTUwIHRleHQtd2hpdGUgb3ZlcmZsb3ctaGlkZGVuXCI+XHJcbiAgICAgIHsvKiBMZWZ0IFNpZGViYXIgKi99XHJcbiAgICAgIDxTaWRlYmFyXHJcbiAgICAgICAgY29uZmlnPXtjb25maWd9XHJcbiAgICAgICAgcHJvamVjdHM9e3Byb2plY3RzfVxyXG4gICAgICAgIGN1cnJlbnRQcm9qZWN0PXtjdXJyZW50UHJvamVjdH1cclxuICAgICAgICBzZWxlY3RlZExhbmc9e3NlbGVjdGVkTGFuZ31cclxuICAgICAgICBzZWxlY3RlZFBsYXRmb3JtPXtzZWxlY3RlZFBsYXRmb3JtfVxyXG4gICAgICAgIHNlbGVjdGVkSXRlbT17c2VsZWN0ZWRJdGVtfVxyXG4gICAgICAgIHNjcmVlbnNob3RzPXtnZXRTY3JlZW5zaG90cygpfVxyXG4gICAgICAgIGZlYXR1cmVHcmFwaGljPXtmZWF0dXJlR3JhcGhpY31cclxuICAgICAgICBhc3NldHM9e2Fzc2V0c31cclxuICAgICAgICBvblNlbGVjdExhbmc9e3NldFNlbGVjdGVkTGFuZ31cclxuICAgICAgICBvblNlbGVjdFBsYXRmb3JtPXtzZXRTZWxlY3RlZFBsYXRmb3JtfVxyXG4gICAgICAgIG9uU2VsZWN0SXRlbT17c2V0U2VsZWN0ZWRJdGVtfVxyXG4gICAgICAgIG9uQWRkU2NyZWVuc2hvdD17YWRkU2NyZWVuc2hvdH1cclxuICAgICAgICBvbkRlbGV0ZVNjcmVlbnNob3Q9e2RlbGV0ZVNjcmVlbnNob3R9XHJcbiAgICAgICAgb25Td2l0Y2hQcm9qZWN0PXtzd2l0Y2hQcm9qZWN0fVxyXG4gICAgICAgIG9uU2hvd1Byb2plY3RNb2RhbD17KCkgPT4gc2V0U2hvd1Byb2plY3RNb2RhbCh0cnVlKX1cclxuICAgICAgICBvbkdlbmVyYXRlPXtnZW5lcmF0ZUFsbH1cclxuICAgICAgICBvbkFkZExhbmd1YWdlPXthZGRMYW5ndWFnZX1cclxuICAgICAgICBvbkNvcHlQbGF0Zm9ybUNvbmZpZz17Y29weVBsYXRmb3JtQ29uZmlnfVxyXG4gICAgICAgIG9uU2hvd1RoZW1lRWRpdG9yPXsoKSA9PiBzZXRTaG93VGhlbWVFZGl0b3IodHJ1ZSl9XHJcbiAgICAgICAgb25TaG93TWVkaWFNYW5hZ2VyPXsoKSA9PiBzZXRTaG93TWVkaWFNYW5hZ2VyKHRydWUpfVxyXG4gICAgICAgIGdlbmVyYXRpbmc9e2dlbmVyYXRpbmd9XHJcbiAgICAgICAgbGFzdEdlbmVyYXRlZD17bGFzdEdlbmVyYXRlZH1cclxuICAgICAgICBvblZpZXdMYXN0R2VuZXJhdGVkPXt2aWV3TGFzdEdlbmVyYXRlZH1cclxuICAgICAgLz5cclxuXHJcbiAgICAgIHsvKiBQcmV2aWV3IEFyZWEgKi99XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJmbGV4LTEgZmxleCBmbGV4LWNvbCBtaW4tdy0wXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImZsZXgtMSBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBwLTggYmctemluYy05MDAvNTBcIj5cclxuICAgICAgICAgIHtwcmV2aWV3VXJsID8gKFxyXG4gICAgICAgICAgICA8UHJldmlld1xyXG4gICAgICAgICAgICAgIHVybD17cHJldmlld1VybH1cclxuICAgICAgICAgICAgICB0eXBlPXtzZWxlY3RlZEl0ZW0/LnR5cGUgPT09ICdmZWF0dXJlLWdyYXBoaWMnID8gJ2ZlYXR1cmUtZ3JhcGhpYycgOiAnc2NyZWVuc2hvdCd9XHJcbiAgICAgICAgICAgICAgdmVyc2lvbj17cHJldmlld1ZlcnNpb259XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dC16aW5jLTUwMFwiPlxyXG4gICAgICAgICAgICAgIFNlbGVjdCBhIHNjcmVlbnNob3Qgb3IgZmVhdHVyZSBncmFwaGljIHRvIHByZXZpZXdcclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIHsvKiBSaWdodCBFZGl0b3IgUGFuZWwgKi99XHJcbiAgICAgIHtzZWxlY3RlZFNjcmVlbnNob3QgJiYgKFxyXG4gICAgICAgIDxTY3JlZW5zaG90RWRpdG9yXHJcbiAgICAgICAgICBzY3JlZW5zaG90PXtzZWxlY3RlZFNjcmVlbnNob3R9XHJcbiAgICAgICAgICBhc3NldHM9e2Fzc2V0c31cclxuICAgICAgICAgIGNvbmZpZz17Y29uZmlnfVxyXG4gICAgICAgICAgb25VcGRhdGU9eyh1cGRhdGVzKSA9PiB1cGRhdGVTY3JlZW5zaG90KHNlbGVjdGVkU2NyZWVuc2hvdC5pZCwgdXBkYXRlcyl9XHJcbiAgICAgICAgICBvblVwZGF0ZUNvbmZpZz17c2F2ZUNvbmZpZ31cclxuICAgICAgICAgIG9uQXNzZXRzUmVmcmVzaD17cmVmcmVzaEFzc2V0c31cclxuICAgICAgICAvPlxyXG4gICAgICApfVxyXG5cclxuICAgICAge3NlbGVjdGVkSXRlbT8udHlwZSA9PT0gJ2ZlYXR1cmUtZ3JhcGhpYycgJiYgZmVhdHVyZUdyYXBoaWMgJiYgKFxyXG4gICAgICAgIDxGZWF0dXJlR3JhcGhpY0VkaXRvclxyXG4gICAgICAgICAgZmVhdHVyZUdyYXBoaWM9e2ZlYXR1cmVHcmFwaGljfVxyXG4gICAgICAgICAgYXNzZXRzPXthc3NldHN9XHJcbiAgICAgICAgICBjb25maWc9e2NvbmZpZ31cclxuICAgICAgICAgIG9uVXBkYXRlPXt1cGRhdGVGZWF0dXJlR3JhcGhpY31cclxuICAgICAgICAgIG9uVXBkYXRlQ29uZmlnPXtzYXZlQ29uZmlnfVxyXG4gICAgICAgICAgb25Bc3NldHNSZWZyZXNoPXtyZWZyZXNoQXNzZXRzfVxyXG4gICAgICAgIC8+XHJcbiAgICAgICl9XHJcblxyXG4gICAgICB7LyogTW9kYWxzICovfVxyXG4gICAgICB7c2hvd1Byb2plY3RNb2RhbCAmJiAoXHJcbiAgICAgICAgPFByb2plY3RNb2RhbFxyXG4gICAgICAgICAgcHJvamVjdHM9e3Byb2plY3RzfVxyXG4gICAgICAgICAgY3VycmVudFByb2plY3Q9e2N1cnJlbnRQcm9qZWN0fVxyXG4gICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0U2hvd1Byb2plY3RNb2RhbChmYWxzZSl9XHJcbiAgICAgICAgICBvbkNyZWF0ZT17aGFuZGxlQ3JlYXRlUHJvamVjdH1cclxuICAgICAgICAgIG9uU3dpdGNoPXtzd2l0Y2hQcm9qZWN0fVxyXG4gICAgICAgICAgb25EZWxldGU9e2hhbmRsZURlbGV0ZVByb2plY3R9XHJcbiAgICAgICAgICBvblJlbmFtZT17aGFuZGxlUmVuYW1lUHJvamVjdH1cclxuICAgICAgICAvPlxyXG4gICAgICApfVxyXG5cclxuICAgICAge3Nob3dHZW5lcmF0ZU1vZGFsICYmIChcclxuICAgICAgICA8R2VuZXJhdGVNb2RhbFxyXG4gICAgICAgICAgcHJvZ3Jlc3M9e2dlbmVyYXRlUHJvZ3Jlc3N9XHJcbiAgICAgICAgICBnZW5lcmF0aW5nPXtnZW5lcmF0aW5nfVxyXG4gICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0U2hvd0dlbmVyYXRlTW9kYWwoZmFsc2UpfVxyXG4gICAgICAgIC8+XHJcbiAgICAgICl9XHJcblxyXG4gICAgICB7c2hvd1RoZW1lRWRpdG9yICYmIChcclxuICAgICAgICA8VGhlbWVFZGl0b3JNb2RhbFxyXG4gICAgICAgICAgY29uZmlnPXtjb25maWd9XHJcbiAgICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRTaG93VGhlbWVFZGl0b3IoZmFsc2UpfVxyXG4gICAgICAgICAgb25TYXZlPXsobmV3Q29uZmlnKSA9PiB7XHJcbiAgICAgICAgICAgIHNhdmVDb25maWcobmV3Q29uZmlnKTtcclxuICAgICAgICAgICAgc2V0U2hvd1RoZW1lRWRpdG9yKGZhbHNlKTtcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgLz5cclxuICAgICAgKX1cclxuXHJcbiAgICAgIHtzaG93TWVkaWFNYW5hZ2VyICYmIChcclxuICAgICAgICA8TWVkaWFNYW5hZ2VyTW9kYWxcclxuICAgICAgICAgIGFzc2V0cz17YXNzZXRzfVxyXG4gICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0U2hvd01lZGlhTWFuYWdlcihmYWxzZSl9XHJcbiAgICAgICAgICBvblJlZnJlc2g9e3JlZnJlc2hBc3NldHN9XHJcbiAgICAgICAgLz5cclxuICAgICAgKX1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwgIi8qKlxyXG4gKiBVSSBFbnRyeSBQb2ludFxyXG4gKiBcclxuICogSW5pdGlhbGl6ZXMgdGhlIFByZWFjdCBhcHBsaWNhdGlvbiB3aXRoIGRhdGEgaW5qZWN0ZWQgYnkgdGhlIHNlcnZlci5cclxuICovXHJcblxyXG5pbXBvcnQgeyByZW5kZXIgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyBBcHAgfSBmcm9tICcuL2NvbXBvbmVudHMvQXBwLnRzeCc7XHJcblxyXG4vLyBBdWdtZW50IHdpbmRvdyB0eXBlIGZvciBnbG9iYWwgdXRpbGl0aWVzXHJcbmRlY2xhcmUgZ2xvYmFsIHtcclxuICBpbnRlcmZhY2UgV2luZG93IHtcclxuICAgIF9fQVBQX0RBVEFfXzogdW5rbm93bjtcclxuICAgIEdSQURJRU5UX1RFTVBMQVRFUzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcclxuICAgIERFRkFVTFRfUEFMRVRURVM6IFJlY29yZDxzdHJpbmcsIHsgcHJpbWFyeTogc3RyaW5nOyBzZWNvbmRhcnk6IHN0cmluZzsgYWNjZW50OiBzdHJpbmcgfT47XHJcbiAgICBhcHBseVBhbGV0dGVUb0dyYWRpZW50OiAodGVtcGxhdGU6IHN0cmluZywgcGFsZXR0ZTogeyBwcmltYXJ5OiBzdHJpbmc7IHNlY29uZGFyeTogc3RyaW5nOyBhY2NlbnQ6IHN0cmluZyB9KSA9PiBzdHJpbmc7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBTdG9yZSBnbG9iYWwgdXRpbGl0aWVzIGZvciBwYWxldHRlIHN5c3RlbVxyXG5jb25zdCBhcHBEYXRhID0gKHNlbGYgYXMgdW5rbm93biBhcyBXaW5kb3cpLl9fQVBQX0RBVEFfXyBhcyB7IGdyYWRpZW50VGVtcGxhdGVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+OyBwYWxldHRlczogUmVjb3JkPHN0cmluZywgeyBwcmltYXJ5OiBzdHJpbmc7IHNlY29uZGFyeTogc3RyaW5nOyBhY2NlbnQ6IHN0cmluZyB9PiB9O1xyXG4oc2VsZiBhcyB1bmtub3duIGFzIFdpbmRvdykuR1JBRElFTlRfVEVNUExBVEVTID0gYXBwRGF0YS5ncmFkaWVudFRlbXBsYXRlcyB8fCB7fTtcclxuKHNlbGYgYXMgdW5rbm93biBhcyBXaW5kb3cpLkRFRkFVTFRfUEFMRVRURVMgPSBhcHBEYXRhLnBhbGV0dGVzIHx8IHt9O1xyXG4oc2VsZiBhcyB1bmtub3duIGFzIFdpbmRvdykuYXBwbHlQYWxldHRlVG9HcmFkaWVudCA9ICh0ZW1wbGF0ZTogc3RyaW5nLCBwYWxldHRlOiB7IHByaW1hcnk6IHN0cmluZzsgc2Vjb25kYXJ5OiBzdHJpbmc7IGFjY2VudDogc3RyaW5nIH0pID0+IHtcclxuICByZXR1cm4gdGVtcGxhdGVcclxuICAgIC5yZXBsYWNlKC9cXHtwcmltYXJ5XFx9L2csIHBhbGV0dGUucHJpbWFyeSlcclxuICAgIC5yZXBsYWNlKC9cXHtzZWNvbmRhcnlcXH0vZywgcGFsZXR0ZS5zZWNvbmRhcnkpXHJcbiAgICAucmVwbGFjZSgvXFx7YWNjZW50XFx9L2csIHBhbGV0dGUuYWNjZW50KTtcclxufTtcclxuXHJcbi8vIE1vdW50IGFwcGxpY2F0aW9uXHJcbnJlbmRlcig8QXBwIC8+LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJykhKTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNhQSxJQzJCQUM7QUQzQkFELElFVVBFO0FGVk9GLElHRVRHO0FIRlNILElHa0dBSTtBSGxHQUosSUlpTFRLO0FKakxTTCxJSTRMVE07QUo1TFNOLElJOExQTztBSjlMT1AsSUl3TlBRO0FKeE5PUixJS0NGUztBTERFVCxJQVdBVSxJQUFnQyxDQUFBO0FBWGhDVixJQVlBVyxJQUFZLENBQUE7QUFaWlgsSUFhQVksSUFDWjtBQWRZWixJQ0NBYSxJQUFVQyxNQUFNRDtBQVN0QixTQUFTRSxFQUFPQyxJQUFLQyxJQUFBQTtBQUUzQixXQUFTUixNQUFLUTtBQUFPRCxJQUFBQSxHQUFJUCxFQUFBQSxJQUFLUSxHQUFNUixFQUFBQTtBQUNwQyxTQUE2Qk87QUFDN0I7QUFBQSxTQVFlRSxFQUFXQyxJQUFBQTtBQUMxQixNQUFJQyxLQUFhRCxHQUFLQztBQUNsQkEsRUFBQUEsTUFBWUEsR0FBV0Ms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O0FBQUEsUUFDeEMsVUFBVTtBQUFBLFFBQ1YsVUFBVTtBQUFBLFFBQ1YsVUFBVTtBQUFBLFFBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDWjtBQUFBLElBR0QscUJBQ0MsZ0JBQUFBO0FBQUEsTUFBQztBQUFBO0FBQUEsUUFDQyxVQUFVO0FBQUEsUUFDVjtBQUFBLFFBQ0EsU0FBUyxNQUFNLHFCQUFxQixLQUFLO0FBQUE7QUFBQSxJQUMzQztBQUFBLElBR0QsbUJBQ0MsZ0JBQUFBO0FBQUEsTUFBQztBQUFBO0FBQUEsUUFDQztBQUFBLFFBQ0EsU0FBUyxNQUFNLG1CQUFtQixLQUFLO0FBQUEsUUFDdkMsUUFBUSxDQUFDLGNBQWM7QUFDckIsVUFBQUosWUFBVyxTQUFTO0FBQ3BCLDZCQUFtQixLQUFLO0FBQUEsUUFDMUI7QUFBQTtBQUFBLElBQ0Y7QUFBQSxJQUdELG9CQUNDLGdCQUFBSTtBQUFBLE1BQUM7QUFBQTtBQUFBLFFBQ0M7QUFBQSxRQUNBLFNBQVMsTUFBTSxvQkFBb0IsS0FBSztBQUFBLFFBQ3hDLFdBQVc7QUFBQTtBQUFBLElBQ2I7QUFBQSxLQUVKO0FBRUo7OztBQ2pkQSxJQUFNLFVBQVcsS0FBMkI7QUFDM0MsS0FBMkIscUJBQXFCLFFBQVEscUJBQXFCLENBQUM7QUFDOUUsS0FBMkIsbUJBQW1CLFFBQVEsWUFBWSxDQUFDO0FBQ25FLEtBQTJCLHlCQUF5QixDQUFDLFVBQWtCLFlBQW9FO0FBQzFJLFNBQU8sU0FDSixRQUFRLGdCQUFnQixRQUFRLE9BQU8sRUFDdkMsUUFBUSxrQkFBa0IsUUFBUSxTQUFTLEVBQzNDLFFBQVEsZUFBZSxRQUFRLE1BQU07QUFDMUM7QUFHQSxFQUFPLGdCQUFBQyxHQUFDLE9BQUksR0FBSSxTQUFTLGVBQWUsS0FBSyxDQUFFOyIsCiAgIm5hbWVzIjogWyJNT0RFX0hZRFJBVEUiLCAic2xpY2UiLCAib3B0aW9ucyIsICJ2bm9kZUlkIiwgImlzVmFsaWRFbGVtZW50IiwgInJlcmVuZGVyUXVldWUiLCAicHJldkRlYm91bmNlIiwgImRlZmVyIiwgImRlcHRoU29ydCIsICJpIiwgIkVNUFRZX09CSiIsICJFTVBUWV9BUlIiLCAiSVNfTk9OX0RJTUVOU0lPTkFMIiwgImlzQXJyYXkiLCAiQXJyYXkiLCAiYXNzaWduIiwgIm9iaiIsICJwcm9wcyIsICJyZW1vdmVOb2RlIiwgIm5vZGUiLCAicGFyZW50Tm9kZSIsICJyZW1vdmVDaGlsZCIsICJjcmVhdGVFbGVtZW50IiwgInR5cGUiLCAiY2hpbGRyZW4iLCAia2V5IiwgInJlZiIsICJub3JtYWxpemVkUHJvcHMiLCAiYXJndW1lbnRzIiwgImxlbmd0aCIsICJjYWxsIiwgImRlZmF1bHRQcm9wcyIsICJjcmVhdGVWTm9kZSIsICJvcmlnaW5hbCIsICJ2bm9kZSIsICJfX2siLCAiX18iLCAiX19iIiwgIl9fZSIsICJfX2QiLCAiX19jIiwgImNvbnN0cnVjdG9yIiwgIl9fdiIsICJfX2kiLCAiX191IiwgIkZyYWdtZW50IiwgInByb3BzIiwgImNoaWxkcmVuIiwgIkJhc2VDb21wb25lbnQiLCAiY29udGV4dCIsICJ0aGlzIiwgImdldERvbVNpYmxpbmciLCAidm5vZGUiLCAiY2hpbGRJbmRleCIsICJfXyIsICJzaWJsaW5nIiwgIl9fayIsICJsZW5ndGgiLCAiX19lIiwgInR5cGUiLCAidXBkYXRlUGFyZW50RG9tUG9pbnRlcnMiLCAiaSIsICJjaGlsZCIsICJfX2MiLCAiYmFzZSIsICJlbnF1ZXVlUmVuZGVyIiwgImMiLCAiX19kIiwgInJlcmVuZGVyUXVldWUiLCAicHVzaCIsICJwcm9jZXNzIiwgInByZXZEZWJvdW5jZSIsICJvcHRpb25zIiwgImRlYm91bmNlUmVuZGVyaW5nIiwgImRlZmVyIiwgInJlbmRlclF1ZXVlTGVuZ3RoIiwgImNvbXBvbmVudCIsICJuZXdWTm9kZSIsICJvbGRWTm9kZSIsICJvbGREb20iLCAicGFyZW50RG9tIiwgImNvbW1pdFF1ZXVlIiwgInJlZlF1ZXVlIiwgInNvcnQiLCAiZGVwdGhTb3J0IiwgInNoaWZ0IiwgIl9fdiIsICJfX1AiLCAiYXNzaWduIiwgImRpZmYiLCAiX19uIiwgIm93bmVyU1ZHRWxlbWVudCIsICJfX3UiLCAiX19pIiwgImNvbW1pdFJvb3QiLCAiZGlmZkNoaWxkcmVuIiwgInJlbmRlclJlc3VsdCIsICJuZXdQYXJlbnRWTm9kZSIsICJvbGRQYXJlbnRWTm9kZSIsICJnbG9iYWxDb250ZXh0IiwgImlzU3ZnIiwgImV4Y2Vzc0RvbUNoaWxkcmVuIiwgImlzSHlkcmF0aW5nIiwgImNoaWxkVk5vZGUiLCAibmV3RG9tIiwgImZpcnN0Q2hpbGREb20iLCAib2xkQ2hpbGRyZW4iLCAiRU1QVFlfQVJSIiwgIm5ld0NoaWxkcmVuTGVuZ3RoIiwgImNvbnN0cnVjdE5ld0NoaWxkcmVuQXJyYXkiLCAiRU1QVFlfT0JKIiwgInJlZiIsICJhcHBseVJlZiIsICJpbnNlcnQiLCAibmV4dFNpYmxpbmciLCAic2tld2VkSW5kZXgiLCAibWF0Y2hpbmdJbmRleCIsICJvbGRDaGlsZHJlbkxlbmd0aCIsICJyZW1haW5pbmdPbGRDaGlsZHJlbiIsICJza2V3IiwgImNvbnN0cnVjdG9yIiwgIlN0cmluZyIsICJjcmVhdGVWTm9kZSIsICJpc0FycmF5IiwgIl9fYiIsICJrZXkiLCAiZmluZE1hdGNoaW5nSW5kZXgiLCAidW5tb3VudCIsICJwYXJlbnRWTm9kZSIsICJpbnNlcnRCZWZvcmUiLCAiZmluZE1hdGNoaW5nSW5kZXgiLCAiY2hpbGRWTm9kZSIsICJvbGRDaGlsZHJlbiIsICJza2V3ZWRJbmRleCIsICJyZW1haW5pbmdPbGRDaGlsZHJlbiIsICJrZXkiLCAidHlwZSIsICJ4IiwgInkiLCAib2xkVk5vZGUiLCAibGVuZ3RoIiwgIl9fdSIsICJzZXRTdHlsZSIsICJzdHlsZSIsICJ2YWx1ZSIsICJzZXRQcm9wZXJ0eSIsICJJU19OT05fRElNRU5TSU9OQUwiLCAidGVzdCIsICJkb20iLCAibmFtZSIsICJvbGRWYWx1ZSIsICJpc1N2ZyIsICJ1c2VDYXB0dXJlIiwgIm8iLCAiY3NzVGV4dCIsICJyZXBsYWNlIiwgInRvTG93ZXJDYXNlIiwgInNsaWNlIiwgImwiLCAiX2F0dGFjaGVkIiwgIkRhdGUiLCAibm93IiwgImFkZEV2ZW50TGlzdGVuZXIiLCAiZXZlbnRQcm94eUNhcHR1cmUiLCAiZXZlbnRQcm94eSIsICJyZW1vdmVFdmVudExpc3RlbmVyIiwgImUiLCAicmVtb3ZlQXR0cmlidXRlIiwgInNldEF0dHJpYnV0ZSIsICJldmVudEhhbmRsZXIiLCAidGhpcyIsICJfZGlzcGF0Y2hlZCIsICJvcHRpb25zIiwgImV2ZW50IiwgImRpZmYiLCAicGFyZW50RG9tIiwgIm5ld1ZOb2RlIiwgImdsb2JhbENvbnRleHQiLCAiZXhjZXNzRG9tQ2hpbGRyZW4iLCAiY29tbWl0UXVldWUiLCAib2xkRG9tIiwgImlzSHlkcmF0aW5nIiwgInJlZlF1ZXVlIiwgInRtcCIsICJjIiwgImlzTmV3IiwgIm9sZFByb3BzIiwgIm9sZFN0YXRlIiwgInNuYXBzaG90IiwgImNsZWFyUHJvY2Vzc2luZ0V4Y2VwdGlvbiIsICJuZXdQcm9wcyIsICJwcm92aWRlciIsICJjb21wb25lbnRDb250ZXh0IiwgImkiLCAicmVuZGVySG9vayIsICJjb3VudCIsICJyZW5kZXJSZXN1bHQiLCAibmV3VHlwZSIsICJjb25zdHJ1Y3RvciIsICJfX2UiLCAiX19iIiwgIm91dGVyIiwgInByb3BzIiwgImNvbnRleHRUeXBlIiwgIl9fYyIsICJfXyIsICJfX0UiLCAicHJvdG90eXBlIiwgInJlbmRlciIsICJCYXNlQ29tcG9uZW50IiwgImRvUmVuZGVyIiwgInN1YiIsICJzdGF0ZSIsICJjb250ZXh0IiwgIl9fbiIsICJfX2QiLCAiX19oIiwgIl9zYiIsICJfX3MiLCAiZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzIiwgImFzc2lnbiIsICJfX3YiLCAiY29tcG9uZW50V2lsbE1vdW50IiwgImNvbXBvbmVudERpZE1vdW50IiwgInB1c2giLCAiY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyIsICJzaG91bGRDb21wb25lbnRVcGRhdGUiLCAiX19rIiwgImZvckVhY2giLCAidm5vZGUiLCAiY29tcG9uZW50V2lsbFVwZGF0ZSIsICJjb21wb25lbnREaWRVcGRhdGUiLCAiX19QIiwgIl9fciIsICJnZXRDaGlsZENvbnRleHQiLCAiZ2V0U25hcHNob3RCZWZvcmVVcGRhdGUiLCAiZGlmZkNoaWxkcmVuIiwgImlzQXJyYXkiLCAiRnJhZ21lbnQiLCAiY2hpbGRyZW4iLCAiYmFzZSIsICJNT0RFX0hZRFJBVEUiLCAiaW5kZXhPZiIsICJkaWZmRWxlbWVudE5vZGVzIiwgImRpZmZlZCIsICJjb21taXRSb290IiwgInJvb3QiLCAiYXBwbHlSZWYiLCAic29tZSIsICJjYiIsICJjYWxsIiwgIm5ld0h0bWwiLCAib2xkSHRtbCIsICJuZXdDaGlsZHJlbiIsICJpbnB1dFZhbHVlIiwgImNoZWNrZWQiLCAibm9kZVR5cGUiLCAibG9jYWxOYW1lIiwgImRvY3VtZW50IiwgImNyZWF0ZVRleHROb2RlIiwgImNyZWF0ZUVsZW1lbnROUyIsICJjcmVhdGVFbGVtZW50IiwgImlzIiwgImRhdGEiLCAiY2hpbGROb2RlcyIsICJFTVBUWV9PQkoiLCAiYXR0cmlidXRlcyIsICJfX2h0bWwiLCAiaW5uZXJIVE1MIiwgImdldERvbVNpYmxpbmciLCAicmVtb3ZlTm9kZSIsICJyZWYiLCAiY3VycmVudCIsICJ1bm1vdW50IiwgInBhcmVudFZOb2RlIiwgInNraXBSZW1vdmUiLCAiciIsICJjb21wb25lbnRXaWxsVW5tb3VudCIsICJyZXBsYWNlTm9kZSIsICJvd25lclNWR0VsZW1lbnQiLCAiZmlyc3RDaGlsZCIsICJzbGljZSIsICJFTVBUWV9BUlIiLCAib3B0aW9ucyIsICJfX2UiLCAiZXJyb3IiLCAidm5vZGUiLCAib2xkVk5vZGUiLCAiZXJyb3JJbmZvIiwgImNvbXBvbmVudCIsICJjdG9yIiwgImhhbmRsZWQiLCAiX18iLCAiX19jIiwgImNvbnN0cnVjdG9yIiwgImdldERlcml2ZWRTdGF0ZUZyb21FcnJvciIsICJzZXRTdGF0ZSIsICJfX2QiLCAiY29tcG9uZW50RGlkQ2F0Y2giLCAiX19FIiwgImUiLCAidm5vZGVJZCIsICJpc1ZhbGlkRWxlbWVudCIsICJ1bmRlZmluZWQiLCAiQmFzZUNvbXBvbmVudCIsICJwcm90b3R5cGUiLCAidXBkYXRlIiwgImNhbGxiYWNrIiwgInMiLCAidGhpcyIsICJfX3MiLCAic3RhdGUiLCAiYXNzaWduIiwgInByb3BzIiwgIl9fdiIsICJfc2IiLCAicHVzaCIsICJlbnF1ZXVlUmVuZGVyIiwgImZvcmNlVXBkYXRlIiwgIl9faCIsICJyZW5kZXIiLCAiRnJhZ21lbnQiLCAicmVyZW5kZXJRdWV1ZSIsICJkZWZlciIsICJQcm9taXNlIiwgInRoZW4iLCAiYmluZCIsICJyZXNvbHZlIiwgInNldFRpbWVvdXQiLCAiZGVwdGhTb3J0IiwgImEiLCAiYiIsICJfX2IiLCAicHJvY2VzcyIsICJfX3IiLCAiaSIsICJjdXJyZW50SW5kZXgiLCAiY3VycmVudENvbXBvbmVudCIsICJwcmV2aW91c0NvbXBvbmVudCIsICJwcmV2UmFmIiwgImN1cnJlbnRIb29rIiwgImFmdGVyUGFpbnRFZmZlY3RzIiwgIkVNUFRZIiwgIm9sZEJlZm9yZURpZmYiLCAib3B0aW9ucyIsICJfX2IiLCAib2xkQmVmb3JlUmVuZGVyIiwgIl9fciIsICJvbGRBZnRlckRpZmYiLCAiZGlmZmVkIiwgIm9sZENvbW1pdCIsICJfX2MiLCAib2xkQmVmb3JlVW5tb3VudCIsICJ1bm1vdW50IiwgImdldEhvb2tTdGF0ZSIsICJpbmRleCIsICJ0eXBlIiwgIl9faCIsICJob29rcyIsICJfX0giLCAiX18iLCAibGVuZ3RoIiwgInB1c2giLCAiX19WIiwgInVzZVN0YXRlIiwgImluaXRpYWxTdGF0ZSIsICJ1c2VSZWR1Y2VyIiwgImludm9rZU9yUmV0dXJuIiwgInJlZHVjZXIiLCAiaW5pdCIsICJob29rU3RhdGUiLCAiX3JlZHVjZXIiLCAiYWN0aW9uIiwgImN1cnJlbnRWYWx1ZSIsICJfX04iLCAibmV4dFZhbHVlIiwgInNldFN0YXRlIiwgIl9oYXNTY3VGcm9tSG9va3MiLCAidXBkYXRlSG9va1N0YXRlIiwgInAiLCAicyIsICJjIiwgInN0YXRlSG9va3MiLCAiZmlsdGVyIiwgIngiLCAiZXZlcnkiLCAicHJldlNjdSIsICJjYWxsIiwgInRoaXMiLCAic2hvdWxkVXBkYXRlIiwgImZvckVhY2giLCAiaG9va0l0ZW0iLCAicHJvcHMiLCAic2hvdWxkQ29tcG9uZW50VXBkYXRlIiwgInByZXZDV1UiLCAiY29tcG9uZW50V2lsbFVwZGF0ZSIsICJfX2UiLCAidG1wIiwgInVzZUVmZmVjdCIsICJjYWxsYmFjayIsICJhcmdzIiwgInN0YXRlIiwgIl9fcyIsICJhcmdzQ2hhbmdlZCIsICJfcGVuZGluZ0FyZ3MiLCAidXNlUmVmIiwgImluaXRpYWxWYWx1ZSIsICJjdXJyZW50SG9vayIsICJ1c2VNZW1vIiwgImN1cnJlbnQiLCAidXNlTWVtbyIsICJmYWN0b3J5IiwgImFyZ3MiLCAic3RhdGUiLCAiZ2V0SG9va1N0YXRlIiwgImN1cnJlbnRJbmRleCIsICJhcmdzQ2hhbmdlZCIsICJfX1YiLCAiX3BlbmRpbmdBcmdzIiwgIl9faCIsICJfXyIsICJmbHVzaEFmdGVyUGFpbnRFZmZlY3RzIiwgImNvbXBvbmVudCIsICJhZnRlclBhaW50RWZmZWN0cyIsICJzaGlmdCIsICJfX1AiLCAiX19IIiwgIl9faCIsICJmb3JFYWNoIiwgImludm9rZUNsZWFudXAiLCAiaW52b2tlRWZmZWN0IiwgImUiLCAib3B0aW9ucyIsICJfX2UiLCAiX192IiwgIl9fYiIsICJ2bm9kZSIsICJjdXJyZW50Q29tcG9uZW50IiwgIm9sZEJlZm9yZURpZmYiLCAiX19yIiwgIm9sZEJlZm9yZVJlbmRlciIsICJjdXJyZW50SW5kZXgiLCAiaG9va3MiLCAiX19jIiwgInByZXZpb3VzQ29tcG9uZW50IiwgIl9fIiwgImhvb2tJdGVtIiwgIl9fTiIsICJFTVBUWSIsICJfcGVuZGluZ0FyZ3MiLCAiZGlmZmVkIiwgIm9sZEFmdGVyRGlmZiIsICJjIiwgImxlbmd0aCIsICJwdXNoIiwgInByZXZSYWYiLCAicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwgImFmdGVyTmV4dEZyYW1lIiwgIl9fViIsICJjb21taXRRdWV1ZSIsICJzb21lIiwgImZpbHRlciIsICJjYiIsICJvbGRDb21taXQiLCAidW5tb3VudCIsICJvbGRCZWZvcmVVbm1vdW50IiwgImhhc0Vycm9yZWQiLCAicyIsICJIQVNfUkFGIiwgImNhbGxiYWNrIiwgInJhZiIsICJkb25lIiwgImNsZWFyVGltZW91dCIsICJ0aW1lb3V0IiwgImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwgInNldFRpbWVvdXQiLCAiaG9vayIsICJjb21wIiwgImNsZWFudXAiLCAiYXJnc0NoYW5nZWQiLCAib2xkQXJncyIsICJuZXdBcmdzIiwgImFyZyIsICJpbmRleCIsICJpbnZva2VPclJldHVybiIsICJmIiwgInZub2RlSWQiLCAiaXNBcnJheSIsICJBcnJheSIsICJjcmVhdGVWTm9kZSIsICJ0eXBlIiwgInByb3BzIiwgImtleSIsICJpc1N0YXRpY0NoaWxkcmVuIiwgIl9fc291cmNlIiwgIl9fc2VsZiIsICJyZWYiLCAiaSIsICJub3JtYWxpemVkUHJvcHMiLCAidm5vZGUiLCAiX19rIiwgIl9fIiwgIl9fYiIsICJfX2UiLCAiX19kIiwgIl9fYyIsICJjb25zdHJ1Y3RvciIsICJfX3YiLCAiX19pIiwgIl9fdSIsICJkZWZhdWx0UHJvcHMiLCAib3B0aW9ucyIsICJoIiwgInAiLCAidSIsICJlIiwgImgiLCAicCIsICJ1IiwgImUiLCAidSIsICJoIiwgInAiLCAiZSIsICJ1IiwgInUiLCAiZSIsICJ1IiwgImUiLCAiaCIsICJlIiwgInUiLCAicCIsICJoIiwgInUiLCAicCIsICJfIiwgImkiLCAidSIsICJ2IiwgImUiLCAicCIsICJoIiwgInMiLCAiXyIsICJpIiwgImUiLCAidSIsICJ2IiwgInQiLCAidSIsICJ2IiwgInUiLCAiZSIsICJ2IiwgInUiLCAiZSIsICJ2IiwgImgiLCAidSIsICJlIiwgInAiLCAiciIsICJ1IiwgImUiLCAidCIsICJoIiwgInAiLCAiZyIsICJ1IiwgImUiLCAidiIsICJoIiwgImUiLCAidSIsICJhcHBEYXRhIiwgInAiLCAiaCIsICJsIiwgInYiLCAic2F2ZUNvbmZpZyIsICJzIiwgImNvbmZpZyIsICJyIiwgInUiLCAidSJdCn0K
