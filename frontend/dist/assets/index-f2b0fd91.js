var Kt = Object.defineProperty;
var Xt = (e, o, a) =>
  o in e
    ? Kt(e, o, { enumerable: !0, configurable: !0, writable: !0, value: a })
    : (e[o] = a);
var pt = (e, o, a) => (Xt(e, typeof o != 'symbol' ? o + '' : o, a), a),
  qt = (e, o, a) => {
    if (!o.has(e)) throw TypeError('Cannot ' + a);
  };
var Nt = (e, o, a) => (
    qt(e, o, 'read from private field'),
    a ? a.call(e) : o.get(e)
  ),
  Ht = (e, o, a) => {
    if (o.has(e))
      throw TypeError('Cannot add the same private member more than once');
    o instanceof WeakSet ? o.add(e) : o.set(e, a);
  },
  Gt = (e, o, a, s) => (
    qt(e, o, 'write to private field'),
    s ? s.call(e, a) : o.set(e, a),
    a
  );
function _mergeNamespaces(e, o) {
  for (var a = 0; a < o.length; a++) {
    const s = o[a];
    if (typeof s != 'string' && !Array.isArray(s)) {
      for (const i in s)
        if (i !== 'default' && !(i in e)) {
          const c = Object.getOwnPropertyDescriptor(s, i);
          c &&
            Object.defineProperty(
              e,
              i,
              c.get ? c : { enumerable: !0, get: () => s[i] }
            );
        }
    }
  }
  return Object.freeze(
    Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' })
  );
}
(function () {
  const o = document.createElement('link').relList;
  if (o && o.supports && o.supports('modulepreload')) return;
  for (const i of document.querySelectorAll('link[rel="modulepreload"]')) s(i);
  new MutationObserver((i) => {
    for (const c of i)
      if (c.type === 'childList')
        for (const d of c.addedNodes)
          d.tagName === 'LINK' && d.rel === 'modulepreload' && s(d);
  }).observe(document, { childList: !0, subtree: !0 });
  function a(i) {
    const c = {};
    return (
      i.integrity && (c.integrity = i.integrity),
      i.referrerPolicy && (c.referrerPolicy = i.referrerPolicy),
      i.crossOrigin === 'use-credentials'
        ? (c.credentials = 'include')
        : i.crossOrigin === 'anonymous'
          ? (c.credentials = 'omit')
          : (c.credentials = 'same-origin'),
      c
    );
  }
  function s(i) {
    if (i.ep) return;
    i.ep = !0;
    const c = a(i);
    fetch(i.href, c);
  }
})();
var commonjsGlobal =
  typeof globalThis < 'u'
    ? globalThis
    : typeof window < 'u'
      ? window
      : typeof global < 'u'
        ? global
        : typeof self < 'u'
          ? self
          : {};
function getDefaultExportFromCjs(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, 'default')
    ? e.default
    : e;
}
var jsxRuntime = { exports: {} },
  reactJsxRuntime_production_min = {},
  react = { exports: {} },
  react_production_min = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var l$1 = Symbol.for('react.element'),
  n$1 = Symbol.for('react.portal'),
  p$2 = Symbol.for('react.fragment'),
  q$1 = Symbol.for('react.strict_mode'),
  r$1 = Symbol.for('react.profiler'),
  t = Symbol.for('react.provider'),
  u = Symbol.for('react.context'),
  v$1 = Symbol.for('react.forward_ref'),
  w = Symbol.for('react.suspense'),
  x = Symbol.for('react.memo'),
  y = Symbol.for('react.lazy'),
  z$1 = Symbol.iterator;
function A$1(e) {
  return e === null || typeof e != 'object'
    ? null
    : ((e = (z$1 && e[z$1]) || e['@@iterator']),
      typeof e == 'function' ? e : null);
}
var B$1 = {
    isMounted: function () {
      return !1;
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {},
  },
  C$1 = Object.assign,
  D$1 = {};
function E$1(e, o, a) {
  ((this.props = e),
    (this.context = o),
    (this.refs = D$1),
    (this.updater = a || B$1));
}
E$1.prototype.isReactComponent = {};
E$1.prototype.setState = function (e, o) {
  if (typeof e != 'object' && typeof e != 'function' && e != null)
    throw Error(
      'setState(...): takes an object of state variables to update or a function which returns an object of state variables.'
    );
  this.updater.enqueueSetState(this, e, o, 'setState');
};
E$1.prototype.forceUpdate = function (e) {
  this.updater.enqueueForceUpdate(this, e, 'forceUpdate');
};
function F() {}
F.prototype = E$1.prototype;
function G$1(e, o, a) {
  ((this.props = e),
    (this.context = o),
    (this.refs = D$1),
    (this.updater = a || B$1));
}
var H$1 = (G$1.prototype = new F());
H$1.constructor = G$1;
C$1(H$1, E$1.prototype);
H$1.isPureReactComponent = !0;
var I$1 = Array.isArray,
  J = Object.prototype.hasOwnProperty,
  K$1 = { current: null },
  L$1 = { key: !0, ref: !0, __self: !0, __source: !0 };
function M$1(e, o, a) {
  var s,
    i = {},
    c = null,
    d = null;
  if (o != null)
    for (s in (o.ref !== void 0 && (d = o.ref),
    o.key !== void 0 && (c = '' + o.key),
    o))
      J.call(o, s) && !L$1.hasOwnProperty(s) && (i[s] = o[s]);
  var h = arguments.length - 2;
  if (h === 1) i.children = a;
  else if (1 < h) {
    for (var b = Array(h), g = 0; g < h; g++) b[g] = arguments[g + 2];
    i.children = b;
  }
  if (e && e.defaultProps)
    for (s in ((h = e.defaultProps), h)) i[s] === void 0 && (i[s] = h[s]);
  return {
    $$typeof: l$1,
    type: e,
    key: c,
    ref: d,
    props: i,
    _owner: K$1.current,
  };
}
function N$1(e, o) {
  return {
    $$typeof: l$1,
    type: e.type,
    key: o,
    ref: e.ref,
    props: e.props,
    _owner: e._owner,
  };
}
function O$1(e) {
  return typeof e == 'object' && e !== null && e.$$typeof === l$1;
}
function escape(e) {
  var o = { '=': '=0', ':': '=2' };
  return (
    '$' +
    e.replace(/[=:]/g, function (a) {
      return o[a];
    })
  );
}
var P$1 = /\/+/g;
function Q$1(e, o) {
  return typeof e == 'object' && e !== null && e.key != null
    ? escape('' + e.key)
    : o.toString(36);
}
function R$1(e, o, a, s, i) {
  var c = typeof e;
  (c === 'undefined' || c === 'boolean') && (e = null);
  var d = !1;
  if (e === null) d = !0;
  else
    switch (c) {
      case 'string':
      case 'number':
        d = !0;
        break;
      case 'object':
        switch (e.$$typeof) {
          case l$1:
          case n$1:
            d = !0;
        }
    }
  if (d)
    return (
      (d = e),
      (i = i(d)),
      (e = s === '' ? '.' + Q$1(d, 0) : s),
      I$1(i)
        ? ((a = ''),
          e != null && (a = e.replace(P$1, '$&/') + '/'),
          R$1(i, o, a, '', function (g) {
            return g;
          }))
        : i != null &&
          (O$1(i) &&
            (i = N$1(
              i,
              a +
                (!i.key || (d && d.key === i.key)
                  ? ''
                  : ('' + i.key).replace(P$1, '$&/') + '/') +
                e
            )),
          o.push(i)),
      1
    );
  if (((d = 0), (s = s === '' ? '.' : s + ':'), I$1(e)))
    for (var h = 0; h < e.length; h++) {
      c = e[h];
      var b = s + Q$1(c, h);
      d += R$1(c, o, a, b, i);
    }
  else if (((b = A$1(e)), typeof b == 'function'))
    for (e = b.call(e), h = 0; !(c = e.next()).done; )
      ((c = c.value), (b = s + Q$1(c, h++)), (d += R$1(c, o, a, b, i)));
  else if (c === 'object')
    throw (
      (o = String(e)),
      Error(
        'Objects are not valid as a React child (found: ' +
          (o === '[object Object]'
            ? 'object with keys {' + Object.keys(e).join(', ') + '}'
            : o) +
          '). If you meant to render a collection of children, use an array instead.'
      )
    );
  return d;
}
function S$1(e, o, a) {
  if (e == null) return e;
  var s = [],
    i = 0;
  return (
    R$1(e, s, '', '', function (c) {
      return o.call(a, c, i++);
    }),
    s
  );
}
function T$1(e) {
  if (e._status === -1) {
    var o = e._result;
    ((o = o()),
      o.then(
        function (a) {
          (e._status === 0 || e._status === -1) &&
            ((e._status = 1), (e._result = a));
        },
        function (a) {
          (e._status === 0 || e._status === -1) &&
            ((e._status = 2), (e._result = a));
        }
      ),
      e._status === -1 && ((e._status = 0), (e._result = o)));
  }
  if (e._status === 1) return e._result.default;
  throw e._result;
}
var U$1 = { current: null },
  V$3 = { transition: null },
  W$1 = {
    ReactCurrentDispatcher: U$1,
    ReactCurrentBatchConfig: V$3,
    ReactCurrentOwner: K$1,
  };
function X$1() {
  throw Error('act(...) is not supported in production builds of React.');
}
react_production_min.Children = {
  map: S$1,
  forEach: function (e, o, a) {
    S$1(
      e,
      function () {
        o.apply(this, arguments);
      },
      a
    );
  },
  count: function (e) {
    var o = 0;
    return (
      S$1(e, function () {
        o++;
      }),
      o
    );
  },
  toArray: function (e) {
    return (
      S$1(e, function (o) {
        return o;
      }) || []
    );
  },
  only: function (e) {
    if (!O$1(e))
      throw Error(
        'React.Children.only expected to receive a single React element child.'
      );
    return e;
  },
};
react_production_min.Component = E$1;
react_production_min.Fragment = p$2;
react_production_min.Profiler = r$1;
react_production_min.PureComponent = G$1;
react_production_min.StrictMode = q$1;
react_production_min.Suspense = w;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$1;
react_production_min.act = X$1;
react_production_min.cloneElement = function (e, o, a) {
  if (e == null)
    throw Error(
      'React.cloneElement(...): The argument must be a React element, but you passed ' +
        e +
        '.'
    );
  var s = C$1({}, e.props),
    i = e.key,
    c = e.ref,
    d = e._owner;
  if (o != null) {
    if (
      (o.ref !== void 0 && ((c = o.ref), (d = K$1.current)),
      o.key !== void 0 && (i = '' + o.key),
      e.type && e.type.defaultProps)
    )
      var h = e.type.defaultProps;
    for (b in o)
      J.call(o, b) &&
        !L$1.hasOwnProperty(b) &&
        (s[b] = o[b] === void 0 && h !== void 0 ? h[b] : o[b]);
  }
  var b = arguments.length - 2;
  if (b === 1) s.children = a;
  else if (1 < b) {
    h = Array(b);
    for (var g = 0; g < b; g++) h[g] = arguments[g + 2];
    s.children = h;
  }
  return { $$typeof: l$1, type: e.type, key: i, ref: c, props: s, _owner: d };
};
react_production_min.createContext = function (e) {
  return (
    (e = {
      $$typeof: u,
      _currentValue: e,
      _currentValue2: e,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null,
    }),
    (e.Provider = { $$typeof: t, _context: e }),
    (e.Consumer = e)
  );
};
react_production_min.createElement = M$1;
react_production_min.createFactory = function (e) {
  var o = M$1.bind(null, e);
  return ((o.type = e), o);
};
react_production_min.createRef = function () {
  return { current: null };
};
react_production_min.forwardRef = function (e) {
  return { $$typeof: v$1, render: e };
};
react_production_min.isValidElement = O$1;
react_production_min.lazy = function (e) {
  return { $$typeof: y, _payload: { _status: -1, _result: e }, _init: T$1 };
};
react_production_min.memo = function (e, o) {
  return { $$typeof: x, type: e, compare: o === void 0 ? null : o };
};
react_production_min.startTransition = function (e) {
  var o = V$3.transition;
  V$3.transition = {};
  try {
    e();
  } finally {
    V$3.transition = o;
  }
};
react_production_min.unstable_act = X$1;
react_production_min.useCallback = function (e, o) {
  return U$1.current.useCallback(e, o);
};
react_production_min.useContext = function (e) {
  return U$1.current.useContext(e);
};
react_production_min.useDebugValue = function () {};
react_production_min.useDeferredValue = function (e) {
  return U$1.current.useDeferredValue(e);
};
react_production_min.useEffect = function (e, o) {
  return U$1.current.useEffect(e, o);
};
react_production_min.useId = function () {
  return U$1.current.useId();
};
react_production_min.useImperativeHandle = function (e, o, a) {
  return U$1.current.useImperativeHandle(e, o, a);
};
react_production_min.useInsertionEffect = function (e, o) {
  return U$1.current.useInsertionEffect(e, o);
};
react_production_min.useLayoutEffect = function (e, o) {
  return U$1.current.useLayoutEffect(e, o);
};
react_production_min.useMemo = function (e, o) {
  return U$1.current.useMemo(e, o);
};
react_production_min.useReducer = function (e, o, a) {
  return U$1.current.useReducer(e, o, a);
};
react_production_min.useRef = function (e) {
  return U$1.current.useRef(e);
};
react_production_min.useState = function (e) {
  return U$1.current.useState(e);
};
react_production_min.useSyncExternalStore = function (e, o, a) {
  return U$1.current.useSyncExternalStore(e, o, a);
};
react_production_min.useTransition = function () {
  return U$1.current.useTransition();
};
react_production_min.version = '18.3.1';
react.exports = react_production_min;
var reactExports = react.exports;
const React = getDefaultExportFromCjs(reactExports),
  React$1 = _mergeNamespaces({ __proto__: null, default: React }, [
    reactExports,
  ]);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var f = reactExports,
  k = Symbol.for('react.element'),
  l = Symbol.for('react.fragment'),
  m$1 = Object.prototype.hasOwnProperty,
  n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
  p$1 = { key: !0, ref: !0, __self: !0, __source: !0 };
function q(e, o, a) {
  var s,
    i = {},
    c = null,
    d = null;
  (a !== void 0 && (c = '' + a),
    o.key !== void 0 && (c = '' + o.key),
    o.ref !== void 0 && (d = o.ref));
  for (s in o) m$1.call(o, s) && !p$1.hasOwnProperty(s) && (i[s] = o[s]);
  if (e && e.defaultProps)
    for (s in ((o = e.defaultProps), o)) i[s] === void 0 && (i[s] = o[s]);
  return { $$typeof: k, type: e, key: c, ref: d, props: i, _owner: n.current };
}
reactJsxRuntime_production_min.Fragment = l;
reactJsxRuntime_production_min.jsx = q;
reactJsxRuntime_production_min.jsxs = q;
jsxRuntime.exports = reactJsxRuntime_production_min;
var jsxRuntimeExports = jsxRuntime.exports,
  client = {},
  reactDom = { exports: {} },
  reactDom_production_min = {},
  scheduler = { exports: {} },
  scheduler_production_min = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ (function (e) {
  function o(xt, vt) {
    var $t = xt.length;
    xt.push(vt);
    e: for (; 0 < $t; ) {
      var it = ($t - 1) >>> 1,
        ft = xt[it];
      if (0 < i(ft, vt)) ((xt[it] = vt), (xt[$t] = ft), ($t = it));
      else break e;
    }
  }
  function a(xt) {
    return xt.length === 0 ? null : xt[0];
  }
  function s(xt) {
    if (xt.length === 0) return null;
    var vt = xt[0],
      $t = xt.pop();
    if ($t !== vt) {
      xt[0] = $t;
      e: for (var it = 0, ft = xt.length, bt = ft >>> 1; it < bt; ) {
        var mt = 2 * (it + 1) - 1,
          ht = xt[mt],
          Tt = mt + 1,
          Et = xt[Tt];
        if (0 > i(ht, $t))
          Tt < ft && 0 > i(Et, ht)
            ? ((xt[it] = Et), (xt[Tt] = $t), (it = Tt))
            : ((xt[it] = ht), (xt[mt] = $t), (it = mt));
        else if (Tt < ft && 0 > i(Et, $t))
          ((xt[it] = Et), (xt[Tt] = $t), (it = Tt));
        else break e;
      }
    }
    return vt;
  }
  function i(xt, vt) {
    var $t = xt.sortIndex - vt.sortIndex;
    return $t !== 0 ? $t : xt.id - vt.id;
  }
  if (typeof performance == 'object' && typeof performance.now == 'function') {
    var c = performance;
    e.unstable_now = function () {
      return c.now();
    };
  } else {
    var d = Date,
      h = d.now();
    e.unstable_now = function () {
      return d.now() - h;
    };
  }
  var b = [],
    g = [],
    $ = 1,
    _ = null,
    _e = 3,
    ot = !1,
    j = !1,
    nt = !1,
    lt = typeof setTimeout == 'function' ? setTimeout : null,
    tt = typeof clearTimeout == 'function' ? clearTimeout : null,
    et = typeof setImmediate < 'u' ? setImmediate : null;
  typeof navigator < 'u' &&
    navigator.scheduling !== void 0 &&
    navigator.scheduling.isInputPending !== void 0 &&
    navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function rt(xt) {
    for (var vt = a(g); vt !== null; ) {
      if (vt.callback === null) s(g);
      else if (vt.startTime <= xt)
        (s(g), (vt.sortIndex = vt.expirationTime), o(b, vt));
      else break;
      vt = a(g);
    }
  }
  function at(xt) {
    if (((nt = !1), rt(xt), !j))
      if (a(b) !== null) ((j = !0), St(ct));
      else {
        var vt = a(g);
        vt !== null && Pt(at, vt.startTime - xt);
      }
  }
  function ct(xt, vt) {
    ((j = !1), nt && ((nt = !1), tt(st), (st = -1)), (ot = !0));
    var $t = _e;
    try {
      for (
        rt(vt), _ = a(b);
        _ !== null && (!(_.expirationTime > vt) || (xt && !Ct()));

      ) {
        var it = _.callback;
        if (typeof it == 'function') {
          ((_.callback = null), (_e = _.priorityLevel));
          var ft = it(_.expirationTime <= vt);
          ((vt = e.unstable_now()),
            typeof ft == 'function' ? (_.callback = ft) : _ === a(b) && s(b),
            rt(vt));
        } else s(b);
        _ = a(b);
      }
      if (_ !== null) var bt = !0;
      else {
        var mt = a(g);
        (mt !== null && Pt(at, mt.startTime - vt), (bt = !1));
      }
      return bt;
    } finally {
      ((_ = null), (_e = $t), (ot = !1));
    }
  }
  var dt = !1,
    ut = null,
    st = -1,
    gt = 5,
    yt = -1;
  function Ct() {
    return !(e.unstable_now() - yt < gt);
  }
  function At() {
    if (ut !== null) {
      var xt = e.unstable_now();
      yt = xt;
      var vt = !0;
      try {
        vt = ut(!0, xt);
      } finally {
        vt ? wt() : ((dt = !1), (ut = null));
      }
    } else dt = !1;
  }
  var wt;
  if (typeof et == 'function')
    wt = function () {
      et(At);
    };
  else if (typeof MessageChannel < 'u') {
    var _t = new MessageChannel(),
      kt = _t.port2;
    ((_t.port1.onmessage = At),
      (wt = function () {
        kt.postMessage(null);
      }));
  } else
    wt = function () {
      lt(At, 0);
    };
  function St(xt) {
    ((ut = xt), dt || ((dt = !0), wt()));
  }
  function Pt(xt, vt) {
    st = lt(function () {
      xt(e.unstable_now());
    }, vt);
  }
  ((e.unstable_IdlePriority = 5),
    (e.unstable_ImmediatePriority = 1),
    (e.unstable_LowPriority = 4),
    (e.unstable_NormalPriority = 3),
    (e.unstable_Profiling = null),
    (e.unstable_UserBlockingPriority = 2),
    (e.unstable_cancelCallback = function (xt) {
      xt.callback = null;
    }),
    (e.unstable_continueExecution = function () {
      j || ot || ((j = !0), St(ct));
    }),
    (e.unstable_forceFrameRate = function (xt) {
      0 > xt || 125 < xt
        ? console.error(
            'forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported'
          )
        : (gt = 0 < xt ? Math.floor(1e3 / xt) : 5);
    }),
    (e.unstable_getCurrentPriorityLevel = function () {
      return _e;
    }),
    (e.unstable_getFirstCallbackNode = function () {
      return a(b);
    }),
    (e.unstable_next = function (xt) {
      switch (_e) {
        case 1:
        case 2:
        case 3:
          var vt = 3;
          break;
        default:
          vt = _e;
      }
      var $t = _e;
      _e = vt;
      try {
        return xt();
      } finally {
        _e = $t;
      }
    }),
    (e.unstable_pauseExecution = function () {}),
    (e.unstable_requestPaint = function () {}),
    (e.unstable_runWithPriority = function (xt, vt) {
      switch (xt) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          xt = 3;
      }
      var $t = _e;
      _e = xt;
      try {
        return vt();
      } finally {
        _e = $t;
      }
    }),
    (e.unstable_scheduleCallback = function (xt, vt, $t) {
      var it = e.unstable_now();
      switch (
        (typeof $t == 'object' && $t !== null
          ? (($t = $t.delay),
            ($t = typeof $t == 'number' && 0 < $t ? it + $t : it))
          : ($t = it),
        xt)
      ) {
        case 1:
          var ft = -1;
          break;
        case 2:
          ft = 250;
          break;
        case 5:
          ft = 1073741823;
          break;
        case 4:
          ft = 1e4;
          break;
        default:
          ft = 5e3;
      }
      return (
        (ft = $t + ft),
        (xt = {
          id: $++,
          callback: vt,
          priorityLevel: xt,
          startTime: $t,
          expirationTime: ft,
          sortIndex: -1,
        }),
        $t > it
          ? ((xt.sortIndex = $t),
            o(g, xt),
            a(b) === null &&
              xt === a(g) &&
              (nt ? (tt(st), (st = -1)) : (nt = !0), Pt(at, $t - it)))
          : ((xt.sortIndex = ft), o(b, xt), j || ot || ((j = !0), St(ct))),
        xt
      );
    }),
    (e.unstable_shouldYield = Ct),
    (e.unstable_wrapCallback = function (xt) {
      var vt = _e;
      return function () {
        var $t = _e;
        _e = vt;
        try {
          return xt.apply(this, arguments);
        } finally {
          _e = $t;
        }
      };
    }));
})(scheduler_production_min);
scheduler.exports = scheduler_production_min;
var schedulerExports = scheduler.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var aa = reactExports,
  ca = schedulerExports;
function p(e) {
  for (
    var o = 'https://reactjs.org/docs/error-decoder.html?invariant=' + e, a = 1;
    a < arguments.length;
    a++
  )
    o += '&args[]=' + encodeURIComponent(arguments[a]);
  return (
    'Minified React error #' +
    e +
    '; visit ' +
    o +
    ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
  );
}
var da = new Set(),
  ea = {};
function fa(e, o) {
  (ha(e, o), ha(e + 'Capture', o));
}
function ha(e, o) {
  for (ea[e] = o, e = 0; e < o.length; e++) da.add(o[e]);
}
var ia = !(
    typeof window > 'u' ||
    typeof window.document > 'u' ||
    typeof window.document.createElement > 'u'
  ),
  ja = Object.prototype.hasOwnProperty,
  ka =
    /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
  la = {},
  ma = {};
function oa(e) {
  return ja.call(ma, e)
    ? !0
    : ja.call(la, e)
      ? !1
      : ka.test(e)
        ? (ma[e] = !0)
        : ((la[e] = !0), !1);
}
function pa(e, o, a, s) {
  if (a !== null && a.type === 0) return !1;
  switch (typeof o) {
    case 'function':
    case 'symbol':
      return !0;
    case 'boolean':
      return s
        ? !1
        : a !== null
          ? !a.acceptsBooleans
          : ((e = e.toLowerCase().slice(0, 5)), e !== 'data-' && e !== 'aria-');
    default:
      return !1;
  }
}
function qa(e, o, a, s) {
  if (o === null || typeof o > 'u' || pa(e, o, a, s)) return !0;
  if (s) return !1;
  if (a !== null)
    switch (a.type) {
      case 3:
        return !o;
      case 4:
        return o === !1;
      case 5:
        return isNaN(o);
      case 6:
        return isNaN(o) || 1 > o;
    }
  return !1;
}
function v(e, o, a, s, i, c, d) {
  ((this.acceptsBooleans = o === 2 || o === 3 || o === 4),
    (this.attributeName = s),
    (this.attributeNamespace = i),
    (this.mustUseProperty = a),
    (this.propertyName = e),
    (this.type = o),
    (this.sanitizeURL = c),
    (this.removeEmptyString = d));
}
var z = {};
'children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style'
  .split(' ')
  .forEach(function (e) {
    z[e] = new v(e, 0, !1, e, null, !1, !1);
  });
[
  ['acceptCharset', 'accept-charset'],
  ['className', 'class'],
  ['htmlFor', 'for'],
  ['httpEquiv', 'http-equiv'],
].forEach(function (e) {
  var o = e[0];
  z[o] = new v(o, 1, !1, e[1], null, !1, !1);
});
['contentEditable', 'draggable', 'spellCheck', 'value'].forEach(function (e) {
  z[e] = new v(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
[
  'autoReverse',
  'externalResourcesRequired',
  'focusable',
  'preserveAlpha',
].forEach(function (e) {
  z[e] = new v(e, 2, !1, e, null, !1, !1);
});
'allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope'
  .split(' ')
  .forEach(function (e) {
    z[e] = new v(e, 3, !1, e.toLowerCase(), null, !1, !1);
  });
['checked', 'multiple', 'muted', 'selected'].forEach(function (e) {
  z[e] = new v(e, 3, !0, e, null, !1, !1);
});
['capture', 'download'].forEach(function (e) {
  z[e] = new v(e, 4, !1, e, null, !1, !1);
});
['cols', 'rows', 'size', 'span'].forEach(function (e) {
  z[e] = new v(e, 6, !1, e, null, !1, !1);
});
['rowSpan', 'start'].forEach(function (e) {
  z[e] = new v(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var ra = /[\-:]([a-z])/g;
function sa(e) {
  return e[1].toUpperCase();
}
'accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height'
  .split(' ')
  .forEach(function (e) {
    var o = e.replace(ra, sa);
    z[o] = new v(o, 1, !1, e, null, !1, !1);
  });
'xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type'
  .split(' ')
  .forEach(function (e) {
    var o = e.replace(ra, sa);
    z[o] = new v(o, 1, !1, e, 'http://www.w3.org/1999/xlink', !1, !1);
  });
['xml:base', 'xml:lang', 'xml:space'].forEach(function (e) {
  var o = e.replace(ra, sa);
  z[o] = new v(o, 1, !1, e, 'http://www.w3.org/XML/1998/namespace', !1, !1);
});
['tabIndex', 'crossOrigin'].forEach(function (e) {
  z[e] = new v(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
z.xlinkHref = new v(
  'xlinkHref',
  1,
  !1,
  'xlink:href',
  'http://www.w3.org/1999/xlink',
  !0,
  !1
);
['src', 'href', 'action', 'formAction'].forEach(function (e) {
  z[e] = new v(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function ta(e, o, a, s) {
  var i = z.hasOwnProperty(o) ? z[o] : null;
  (i !== null
    ? i.type !== 0
    : s ||
      !(2 < o.length) ||
      (o[0] !== 'o' && o[0] !== 'O') ||
      (o[1] !== 'n' && o[1] !== 'N')) &&
    (qa(o, a, i, s) && (a = null),
    s || i === null
      ? oa(o) && (a === null ? e.removeAttribute(o) : e.setAttribute(o, '' + a))
      : i.mustUseProperty
        ? (e[i.propertyName] = a === null ? (i.type === 3 ? !1 : '') : a)
        : ((o = i.attributeName),
          (s = i.attributeNamespace),
          a === null
            ? e.removeAttribute(o)
            : ((i = i.type),
              (a = i === 3 || (i === 4 && a === !0) ? '' : '' + a),
              s ? e.setAttributeNS(s, o, a) : e.setAttribute(o, a))));
}
var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  va = Symbol.for('react.element'),
  wa = Symbol.for('react.portal'),
  ya = Symbol.for('react.fragment'),
  za = Symbol.for('react.strict_mode'),
  Aa = Symbol.for('react.profiler'),
  Ba = Symbol.for('react.provider'),
  Ca = Symbol.for('react.context'),
  Da = Symbol.for('react.forward_ref'),
  Ea = Symbol.for('react.suspense'),
  Fa = Symbol.for('react.suspense_list'),
  Ga = Symbol.for('react.memo'),
  Ha = Symbol.for('react.lazy'),
  Ia = Symbol.for('react.offscreen'),
  Ja = Symbol.iterator;
function Ka(e) {
  return e === null || typeof e != 'object'
    ? null
    : ((e = (Ja && e[Ja]) || e['@@iterator']),
      typeof e == 'function' ? e : null);
}
var A = Object.assign,
  La;
function Ma(e) {
  if (La === void 0)
    try {
      throw Error();
    } catch (a) {
      var o = a.stack.trim().match(/\n( *(at )?)/);
      La = (o && o[1]) || '';
    }
  return (
    `
` +
    La +
    e
  );
}
var Na = !1;
function Oa(e, o) {
  if (!e || Na) return '';
  Na = !0;
  var a = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (o)
      if (
        ((o = function () {
          throw Error();
        }),
        Object.defineProperty(o.prototype, 'props', {
          set: function () {
            throw Error();
          },
        }),
        typeof Reflect == 'object' && Reflect.construct)
      ) {
        try {
          Reflect.construct(o, []);
        } catch (g) {
          var s = g;
        }
        Reflect.construct(e, [], o);
      } else {
        try {
          o.call();
        } catch (g) {
          s = g;
        }
        e.call(o.prototype);
      }
    else {
      try {
        throw Error();
      } catch (g) {
        s = g;
      }
      e();
    }
  } catch (g) {
    if (g && s && typeof g.stack == 'string') {
      for (
        var i = g.stack.split(`
`),
          c = s.stack.split(`
`),
          d = i.length - 1,
          h = c.length - 1;
        1 <= d && 0 <= h && i[d] !== c[h];

      )
        h--;
      for (; 1 <= d && 0 <= h; d--, h--)
        if (i[d] !== c[h]) {
          if (d !== 1 || h !== 1)
            do
              if ((d--, h--, 0 > h || i[d] !== c[h])) {
                var b =
                  `
` + i[d].replace(' at new ', ' at ');
                return (
                  e.displayName &&
                    b.includes('<anonymous>') &&
                    (b = b.replace('<anonymous>', e.displayName)),
                  b
                );
              }
            while (1 <= d && 0 <= h);
          break;
        }
    }
  } finally {
    ((Na = !1), (Error.prepareStackTrace = a));
  }
  return (e = e ? e.displayName || e.name : '') ? Ma(e) : '';
}
function Pa(e) {
  switch (e.tag) {
    case 5:
      return Ma(e.type);
    case 16:
      return Ma('Lazy');
    case 13:
      return Ma('Suspense');
    case 19:
      return Ma('SuspenseList');
    case 0:
    case 2:
    case 15:
      return ((e = Oa(e.type, !1)), e);
    case 11:
      return ((e = Oa(e.type.render, !1)), e);
    case 1:
      return ((e = Oa(e.type, !0)), e);
    default:
      return '';
  }
}
function Qa(e) {
  if (e == null) return null;
  if (typeof e == 'function') return e.displayName || e.name || null;
  if (typeof e == 'string') return e;
  switch (e) {
    case ya:
      return 'Fragment';
    case wa:
      return 'Portal';
    case Aa:
      return 'Profiler';
    case za:
      return 'StrictMode';
    case Ea:
      return 'Suspense';
    case Fa:
      return 'SuspenseList';
  }
  if (typeof e == 'object')
    switch (e.$$typeof) {
      case Ca:
        return (e.displayName || 'Context') + '.Consumer';
      case Ba:
        return (e._context.displayName || 'Context') + '.Provider';
      case Da:
        var o = e.render;
        return (
          (e = e.displayName),
          e ||
            ((e = o.displayName || o.name || ''),
            (e = e !== '' ? 'ForwardRef(' + e + ')' : 'ForwardRef')),
          e
        );
      case Ga:
        return (
          (o = e.displayName || null),
          o !== null ? o : Qa(e.type) || 'Memo'
        );
      case Ha:
        ((o = e._payload), (e = e._init));
        try {
          return Qa(e(o));
        } catch {}
    }
  return null;
}
function Ra(e) {
  var o = e.type;
  switch (e.tag) {
    case 24:
      return 'Cache';
    case 9:
      return (o.displayName || 'Context') + '.Consumer';
    case 10:
      return (o._context.displayName || 'Context') + '.Provider';
    case 18:
      return 'DehydratedFragment';
    case 11:
      return (
        (e = o.render),
        (e = e.displayName || e.name || ''),
        o.displayName || (e !== '' ? 'ForwardRef(' + e + ')' : 'ForwardRef')
      );
    case 7:
      return 'Fragment';
    case 5:
      return o;
    case 4:
      return 'Portal';
    case 3:
      return 'Root';
    case 6:
      return 'Text';
    case 16:
      return Qa(o);
    case 8:
      return o === za ? 'StrictMode' : 'Mode';
    case 22:
      return 'Offscreen';
    case 12:
      return 'Profiler';
    case 21:
      return 'Scope';
    case 13:
      return 'Suspense';
    case 19:
      return 'SuspenseList';
    case 25:
      return 'TracingMarker';
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof o == 'function') return o.displayName || o.name || null;
      if (typeof o == 'string') return o;
  }
  return null;
}
function Sa(e) {
  switch (typeof e) {
    case 'boolean':
    case 'number':
    case 'string':
    case 'undefined':
      return e;
    case 'object':
      return e;
    default:
      return '';
  }
}
function Ta(e) {
  var o = e.type;
  return (
    (e = e.nodeName) &&
    e.toLowerCase() === 'input' &&
    (o === 'checkbox' || o === 'radio')
  );
}
function Ua(e) {
  var o = Ta(e) ? 'checked' : 'value',
    a = Object.getOwnPropertyDescriptor(e.constructor.prototype, o),
    s = '' + e[o];
  if (
    !e.hasOwnProperty(o) &&
    typeof a < 'u' &&
    typeof a.get == 'function' &&
    typeof a.set == 'function'
  ) {
    var i = a.get,
      c = a.set;
    return (
      Object.defineProperty(e, o, {
        configurable: !0,
        get: function () {
          return i.call(this);
        },
        set: function (d) {
          ((s = '' + d), c.call(this, d));
        },
      }),
      Object.defineProperty(e, o, { enumerable: a.enumerable }),
      {
        getValue: function () {
          return s;
        },
        setValue: function (d) {
          s = '' + d;
        },
        stopTracking: function () {
          ((e._valueTracker = null), delete e[o]);
        },
      }
    );
  }
}
function Va(e) {
  e._valueTracker || (e._valueTracker = Ua(e));
}
function Wa(e) {
  if (!e) return !1;
  var o = e._valueTracker;
  if (!o) return !0;
  var a = o.getValue(),
    s = '';
  return (
    e && (s = Ta(e) ? (e.checked ? 'true' : 'false') : e.value),
    (e = s),
    e !== a ? (o.setValue(e), !0) : !1
  );
}
function Xa(e) {
  if (((e = e || (typeof document < 'u' ? document : void 0)), typeof e > 'u'))
    return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function Ya(e, o) {
  var a = o.checked;
  return A({}, o, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: a ?? e._wrapperState.initialChecked,
  });
}
function Za(e, o) {
  var a = o.defaultValue == null ? '' : o.defaultValue,
    s = o.checked != null ? o.checked : o.defaultChecked;
  ((a = Sa(o.value != null ? o.value : a)),
    (e._wrapperState = {
      initialChecked: s,
      initialValue: a,
      controlled:
        o.type === 'checkbox' || o.type === 'radio'
          ? o.checked != null
          : o.value != null,
    }));
}
function ab(e, o) {
  ((o = o.checked), o != null && ta(e, 'checked', o, !1));
}
function bb(e, o) {
  ab(e, o);
  var a = Sa(o.value),
    s = o.type;
  if (a != null)
    s === 'number'
      ? ((a === 0 && e.value === '') || e.value != a) && (e.value = '' + a)
      : e.value !== '' + a && (e.value = '' + a);
  else if (s === 'submit' || s === 'reset') {
    e.removeAttribute('value');
    return;
  }
  (o.hasOwnProperty('value')
    ? cb(e, o.type, a)
    : o.hasOwnProperty('defaultValue') && cb(e, o.type, Sa(o.defaultValue)),
    o.checked == null &&
      o.defaultChecked != null &&
      (e.defaultChecked = !!o.defaultChecked));
}
function db(e, o, a) {
  if (o.hasOwnProperty('value') || o.hasOwnProperty('defaultValue')) {
    var s = o.type;
    if (
      !(
        (s !== 'submit' && s !== 'reset') ||
        (o.value !== void 0 && o.value !== null)
      )
    )
      return;
    ((o = '' + e._wrapperState.initialValue),
      a || o === e.value || (e.value = o),
      (e.defaultValue = o));
  }
  ((a = e.name),
    a !== '' && (e.name = ''),
    (e.defaultChecked = !!e._wrapperState.initialChecked),
    a !== '' && (e.name = a));
}
function cb(e, o, a) {
  (o !== 'number' || Xa(e.ownerDocument) !== e) &&
    (a == null
      ? (e.defaultValue = '' + e._wrapperState.initialValue)
      : e.defaultValue !== '' + a && (e.defaultValue = '' + a));
}
var eb = Array.isArray;
function fb(e, o, a, s) {
  if (((e = e.options), o)) {
    o = {};
    for (var i = 0; i < a.length; i++) o['$' + a[i]] = !0;
    for (a = 0; a < e.length; a++)
      ((i = o.hasOwnProperty('$' + e[a].value)),
        e[a].selected !== i && (e[a].selected = i),
        i && s && (e[a].defaultSelected = !0));
  } else {
    for (a = '' + Sa(a), o = null, i = 0; i < e.length; i++) {
      if (e[i].value === a) {
        ((e[i].selected = !0), s && (e[i].defaultSelected = !0));
        return;
      }
      o !== null || e[i].disabled || (o = e[i]);
    }
    o !== null && (o.selected = !0);
  }
}
function gb(e, o) {
  if (o.dangerouslySetInnerHTML != null) throw Error(p(91));
  return A({}, o, {
    value: void 0,
    defaultValue: void 0,
    children: '' + e._wrapperState.initialValue,
  });
}
function hb(e, o) {
  var a = o.value;
  if (a == null) {
    if (((a = o.children), (o = o.defaultValue), a != null)) {
      if (o != null) throw Error(p(92));
      if (eb(a)) {
        if (1 < a.length) throw Error(p(93));
        a = a[0];
      }
      o = a;
    }
    (o == null && (o = ''), (a = o));
  }
  e._wrapperState = { initialValue: Sa(a) };
}
function ib(e, o) {
  var a = Sa(o.value),
    s = Sa(o.defaultValue);
  (a != null &&
    ((a = '' + a),
    a !== e.value && (e.value = a),
    o.defaultValue == null && e.defaultValue !== a && (e.defaultValue = a)),
    s != null && (e.defaultValue = '' + s));
}
function jb(e) {
  var o = e.textContent;
  o === e._wrapperState.initialValue && o !== '' && o !== null && (e.value = o);
}
function kb(e) {
  switch (e) {
    case 'svg':
      return 'http://www.w3.org/2000/svg';
    case 'math':
      return 'http://www.w3.org/1998/Math/MathML';
    default:
      return 'http://www.w3.org/1999/xhtml';
  }
}
function lb(e, o) {
  return e == null || e === 'http://www.w3.org/1999/xhtml'
    ? kb(o)
    : e === 'http://www.w3.org/2000/svg' && o === 'foreignObject'
      ? 'http://www.w3.org/1999/xhtml'
      : e;
}
var mb,
  nb = (function (e) {
    return typeof MSApp < 'u' && MSApp.execUnsafeLocalFunction
      ? function (o, a, s, i) {
          MSApp.execUnsafeLocalFunction(function () {
            return e(o, a, s, i);
          });
        }
      : e;
  })(function (e, o) {
    if (e.namespaceURI !== 'http://www.w3.org/2000/svg' || 'innerHTML' in e)
      e.innerHTML = o;
    else {
      for (
        mb = mb || document.createElement('div'),
          mb.innerHTML = '<svg>' + o.valueOf().toString() + '</svg>',
          o = mb.firstChild;
        e.firstChild;

      )
        e.removeChild(e.firstChild);
      for (; o.firstChild; ) e.appendChild(o.firstChild);
    }
  });
function ob(e, o) {
  if (o) {
    var a = e.firstChild;
    if (a && a === e.lastChild && a.nodeType === 3) {
      a.nodeValue = o;
      return;
    }
  }
  e.textContent = o;
}
var pb = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0,
  },
  qb = ['Webkit', 'ms', 'Moz', 'O'];
Object.keys(pb).forEach(function (e) {
  qb.forEach(function (o) {
    ((o = o + e.charAt(0).toUpperCase() + e.substring(1)), (pb[o] = pb[e]));
  });
});
function rb(e, o, a) {
  return o == null || typeof o == 'boolean' || o === ''
    ? ''
    : a || typeof o != 'number' || o === 0 || (pb.hasOwnProperty(e) && pb[e])
      ? ('' + o).trim()
      : o + 'px';
}
function sb(e, o) {
  e = e.style;
  for (var a in o)
    if (o.hasOwnProperty(a)) {
      var s = a.indexOf('--') === 0,
        i = rb(a, o[a], s);
      (a === 'float' && (a = 'cssFloat'), s ? e.setProperty(a, i) : (e[a] = i));
    }
}
var tb = A(
  { menuitem: !0 },
  {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0,
  }
);
function ub(e, o) {
  if (o) {
    if (tb[e] && (o.children != null || o.dangerouslySetInnerHTML != null))
      throw Error(p(137, e));
    if (o.dangerouslySetInnerHTML != null) {
      if (o.children != null) throw Error(p(60));
      if (
        typeof o.dangerouslySetInnerHTML != 'object' ||
        !('__html' in o.dangerouslySetInnerHTML)
      )
        throw Error(p(61));
    }
    if (o.style != null && typeof o.style != 'object') throw Error(p(62));
  }
}
function vb(e, o) {
  if (e.indexOf('-') === -1) return typeof o.is == 'string';
  switch (e) {
    case 'annotation-xml':
    case 'color-profile':
    case 'font-face':
    case 'font-face-src':
    case 'font-face-uri':
    case 'font-face-format':
    case 'font-face-name':
    case 'missing-glyph':
      return !1;
    default:
      return !0;
  }
}
var wb = null;
function xb(e) {
  return (
    (e = e.target || e.srcElement || window),
    e.correspondingUseElement && (e = e.correspondingUseElement),
    e.nodeType === 3 ? e.parentNode : e
  );
}
var yb = null,
  zb = null,
  Ab = null;
function Bb(e) {
  if ((e = Cb(e))) {
    if (typeof yb != 'function') throw Error(p(280));
    var o = e.stateNode;
    o && ((o = Db(o)), yb(e.stateNode, e.type, o));
  }
}
function Eb(e) {
  zb ? (Ab ? Ab.push(e) : (Ab = [e])) : (zb = e);
}
function Fb() {
  if (zb) {
    var e = zb,
      o = Ab;
    if (((Ab = zb = null), Bb(e), o)) for (e = 0; e < o.length; e++) Bb(o[e]);
  }
}
function Gb(e, o) {
  return e(o);
}
function Hb() {}
var Ib = !1;
function Jb(e, o, a) {
  if (Ib) return e(o, a);
  Ib = !0;
  try {
    return Gb(e, o, a);
  } finally {
    ((Ib = !1), (zb !== null || Ab !== null) && (Hb(), Fb()));
  }
}
function Kb(e, o) {
  var a = e.stateNode;
  if (a === null) return null;
  var s = Db(a);
  if (s === null) return null;
  a = s[o];
  e: switch (o) {
    case 'onClick':
    case 'onClickCapture':
    case 'onDoubleClick':
    case 'onDoubleClickCapture':
    case 'onMouseDown':
    case 'onMouseDownCapture':
    case 'onMouseMove':
    case 'onMouseMoveCapture':
    case 'onMouseUp':
    case 'onMouseUpCapture':
    case 'onMouseEnter':
      ((s = !s.disabled) ||
        ((e = e.type),
        (s = !(
          e === 'button' ||
          e === 'input' ||
          e === 'select' ||
          e === 'textarea'
        ))),
        (e = !s));
      break e;
    default:
      e = !1;
  }
  if (e) return null;
  if (a && typeof a != 'function') throw Error(p(231, o, typeof a));
  return a;
}
var Lb = !1;
if (ia)
  try {
    var Mb = {};
    (Object.defineProperty(Mb, 'passive', {
      get: function () {
        Lb = !0;
      },
    }),
      window.addEventListener('test', Mb, Mb),
      window.removeEventListener('test', Mb, Mb));
  } catch {
    Lb = !1;
  }
function Nb(e, o, a, s, i, c, d, h, b) {
  var g = Array.prototype.slice.call(arguments, 3);
  try {
    o.apply(a, g);
  } catch ($) {
    this.onError($);
  }
}
var Ob = !1,
  Pb = null,
  Qb = !1,
  Rb = null,
  Sb = {
    onError: function (e) {
      ((Ob = !0), (Pb = e));
    },
  };
function Tb(e, o, a, s, i, c, d, h, b) {
  ((Ob = !1), (Pb = null), Nb.apply(Sb, arguments));
}
function Ub(e, o, a, s, i, c, d, h, b) {
  if ((Tb.apply(this, arguments), Ob)) {
    if (Ob) {
      var g = Pb;
      ((Ob = !1), (Pb = null));
    } else throw Error(p(198));
    Qb || ((Qb = !0), (Rb = g));
  }
}
function Vb(e) {
  var o = e,
    a = e;
  if (e.alternate) for (; o.return; ) o = o.return;
  else {
    e = o;
    do ((o = e), o.flags & 4098 && (a = o.return), (e = o.return));
    while (e);
  }
  return o.tag === 3 ? a : null;
}
function Wb(e) {
  if (e.tag === 13) {
    var o = e.memoizedState;
    if (
      (o === null && ((e = e.alternate), e !== null && (o = e.memoizedState)),
      o !== null)
    )
      return o.dehydrated;
  }
  return null;
}
function Xb(e) {
  if (Vb(e) !== e) throw Error(p(188));
}
function Yb(e) {
  var o = e.alternate;
  if (!o) {
    if (((o = Vb(e)), o === null)) throw Error(p(188));
    return o !== e ? null : e;
  }
  for (var a = e, s = o; ; ) {
    var i = a.return;
    if (i === null) break;
    var c = i.alternate;
    if (c === null) {
      if (((s = i.return), s !== null)) {
        a = s;
        continue;
      }
      break;
    }
    if (i.child === c.child) {
      for (c = i.child; c; ) {
        if (c === a) return (Xb(i), e);
        if (c === s) return (Xb(i), o);
        c = c.sibling;
      }
      throw Error(p(188));
    }
    if (a.return !== s.return) ((a = i), (s = c));
    else {
      for (var d = !1, h = i.child; h; ) {
        if (h === a) {
          ((d = !0), (a = i), (s = c));
          break;
        }
        if (h === s) {
          ((d = !0), (s = i), (a = c));
          break;
        }
        h = h.sibling;
      }
      if (!d) {
        for (h = c.child; h; ) {
          if (h === a) {
            ((d = !0), (a = c), (s = i));
            break;
          }
          if (h === s) {
            ((d = !0), (s = c), (a = i));
            break;
          }
          h = h.sibling;
        }
        if (!d) throw Error(p(189));
      }
    }
    if (a.alternate !== s) throw Error(p(190));
  }
  if (a.tag !== 3) throw Error(p(188));
  return a.stateNode.current === a ? e : o;
}
function Zb(e) {
  return ((e = Yb(e)), e !== null ? $b(e) : null);
}
function $b(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null; ) {
    var o = $b(e);
    if (o !== null) return o;
    e = e.sibling;
  }
  return null;
}
var ac = ca.unstable_scheduleCallback,
  bc = ca.unstable_cancelCallback,
  cc = ca.unstable_shouldYield,
  dc = ca.unstable_requestPaint,
  B = ca.unstable_now,
  ec = ca.unstable_getCurrentPriorityLevel,
  fc = ca.unstable_ImmediatePriority,
  gc = ca.unstable_UserBlockingPriority,
  hc = ca.unstable_NormalPriority,
  ic = ca.unstable_LowPriority,
  jc = ca.unstable_IdlePriority,
  kc = null,
  lc = null;
function mc(e) {
  if (lc && typeof lc.onCommitFiberRoot == 'function')
    try {
      lc.onCommitFiberRoot(kc, e, void 0, (e.current.flags & 128) === 128);
    } catch {}
}
var oc = Math.clz32 ? Math.clz32 : nc,
  pc = Math.log,
  qc = Math.LN2;
function nc(e) {
  return ((e >>>= 0), e === 0 ? 32 : (31 - ((pc(e) / qc) | 0)) | 0);
}
var rc = 64,
  sc = 4194304;
function tc(e) {
  switch (e & -e) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return e & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return e & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return e;
  }
}
function uc(e, o) {
  var a = e.pendingLanes;
  if (a === 0) return 0;
  var s = 0,
    i = e.suspendedLanes,
    c = e.pingedLanes,
    d = a & 268435455;
  if (d !== 0) {
    var h = d & ~i;
    h !== 0 ? (s = tc(h)) : ((c &= d), c !== 0 && (s = tc(c)));
  } else ((d = a & ~i), d !== 0 ? (s = tc(d)) : c !== 0 && (s = tc(c)));
  if (s === 0) return 0;
  if (
    o !== 0 &&
    o !== s &&
    !(o & i) &&
    ((i = s & -s), (c = o & -o), i >= c || (i === 16 && (c & 4194240) !== 0))
  )
    return o;
  if ((s & 4 && (s |= a & 16), (o = e.entangledLanes), o !== 0))
    for (e = e.entanglements, o &= s; 0 < o; )
      ((a = 31 - oc(o)), (i = 1 << a), (s |= e[a]), (o &= ~i));
  return s;
}
function vc(e, o) {
  switch (e) {
    case 1:
    case 2:
    case 4:
      return o + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return o + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function wc(e, o) {
  for (
    var a = e.suspendedLanes,
      s = e.pingedLanes,
      i = e.expirationTimes,
      c = e.pendingLanes;
    0 < c;

  ) {
    var d = 31 - oc(c),
      h = 1 << d,
      b = i[d];
    (b === -1
      ? (!(h & a) || h & s) && (i[d] = vc(h, o))
      : b <= o && (e.expiredLanes |= h),
      (c &= ~h));
  }
}
function xc(e) {
  return (
    (e = e.pendingLanes & -1073741825),
    e !== 0 ? e : e & 1073741824 ? 1073741824 : 0
  );
}
function yc() {
  var e = rc;
  return ((rc <<= 1), !(rc & 4194240) && (rc = 64), e);
}
function zc(e) {
  for (var o = [], a = 0; 31 > a; a++) o.push(e);
  return o;
}
function Ac(e, o, a) {
  ((e.pendingLanes |= o),
    o !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
    (e = e.eventTimes),
    (o = 31 - oc(o)),
    (e[o] = a));
}
function Bc(e, o) {
  var a = e.pendingLanes & ~o;
  ((e.pendingLanes = o),
    (e.suspendedLanes = 0),
    (e.pingedLanes = 0),
    (e.expiredLanes &= o),
    (e.mutableReadLanes &= o),
    (e.entangledLanes &= o),
    (o = e.entanglements));
  var s = e.eventTimes;
  for (e = e.expirationTimes; 0 < a; ) {
    var i = 31 - oc(a),
      c = 1 << i;
    ((o[i] = 0), (s[i] = -1), (e[i] = -1), (a &= ~c));
  }
}
function Cc(e, o) {
  var a = (e.entangledLanes |= o);
  for (e = e.entanglements; a; ) {
    var s = 31 - oc(a),
      i = 1 << s;
    ((i & o) | (e[s] & o) && (e[s] |= o), (a &= ~i));
  }
}
var C = 0;
function Dc(e) {
  return (
    (e &= -e),
    1 < e ? (4 < e ? (e & 268435455 ? 16 : 536870912) : 4) : 1
  );
}
var Ec,
  Fc,
  Gc,
  Hc,
  Ic,
  Jc = !1,
  Kc = [],
  Lc = null,
  Mc = null,
  Nc = null,
  Oc = new Map(),
  Pc = new Map(),
  Qc = [],
  Rc =
    'mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit'.split(
      ' '
    );
function Sc(e, o) {
  switch (e) {
    case 'focusin':
    case 'focusout':
      Lc = null;
      break;
    case 'dragenter':
    case 'dragleave':
      Mc = null;
      break;
    case 'mouseover':
    case 'mouseout':
      Nc = null;
      break;
    case 'pointerover':
    case 'pointerout':
      Oc.delete(o.pointerId);
      break;
    case 'gotpointercapture':
    case 'lostpointercapture':
      Pc.delete(o.pointerId);
  }
}
function Tc(e, o, a, s, i, c) {
  return e === null || e.nativeEvent !== c
    ? ((e = {
        blockedOn: o,
        domEventName: a,
        eventSystemFlags: s,
        nativeEvent: c,
        targetContainers: [i],
      }),
      o !== null && ((o = Cb(o)), o !== null && Fc(o)),
      e)
    : ((e.eventSystemFlags |= s),
      (o = e.targetContainers),
      i !== null && o.indexOf(i) === -1 && o.push(i),
      e);
}
function Uc(e, o, a, s, i) {
  switch (o) {
    case 'focusin':
      return ((Lc = Tc(Lc, e, o, a, s, i)), !0);
    case 'dragenter':
      return ((Mc = Tc(Mc, e, o, a, s, i)), !0);
    case 'mouseover':
      return ((Nc = Tc(Nc, e, o, a, s, i)), !0);
    case 'pointerover':
      var c = i.pointerId;
      return (Oc.set(c, Tc(Oc.get(c) || null, e, o, a, s, i)), !0);
    case 'gotpointercapture':
      return (
        (c = i.pointerId),
        Pc.set(c, Tc(Pc.get(c) || null, e, o, a, s, i)),
        !0
      );
  }
  return !1;
}
function Vc(e) {
  var o = Wc(e.target);
  if (o !== null) {
    var a = Vb(o);
    if (a !== null) {
      if (((o = a.tag), o === 13)) {
        if (((o = Wb(a)), o !== null)) {
          ((e.blockedOn = o),
            Ic(e.priority, function () {
              Gc(a);
            }));
          return;
        }
      } else if (o === 3 && a.stateNode.current.memoizedState.isDehydrated) {
        e.blockedOn = a.tag === 3 ? a.stateNode.containerInfo : null;
        return;
      }
    }
  }
  e.blockedOn = null;
}
function Xc(e) {
  if (e.blockedOn !== null) return !1;
  for (var o = e.targetContainers; 0 < o.length; ) {
    var a = Yc(e.domEventName, e.eventSystemFlags, o[0], e.nativeEvent);
    if (a === null) {
      a = e.nativeEvent;
      var s = new a.constructor(a.type, a);
      ((wb = s), a.target.dispatchEvent(s), (wb = null));
    } else return ((o = Cb(a)), o !== null && Fc(o), (e.blockedOn = a), !1);
    o.shift();
  }
  return !0;
}
function Zc(e, o, a) {
  Xc(e) && a.delete(o);
}
function $c() {
  ((Jc = !1),
    Lc !== null && Xc(Lc) && (Lc = null),
    Mc !== null && Xc(Mc) && (Mc = null),
    Nc !== null && Xc(Nc) && (Nc = null),
    Oc.forEach(Zc),
    Pc.forEach(Zc));
}
function ad(e, o) {
  e.blockedOn === o &&
    ((e.blockedOn = null),
    Jc ||
      ((Jc = !0),
      ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
}
function bd(e) {
  function o(i) {
    return ad(i, e);
  }
  if (0 < Kc.length) {
    ad(Kc[0], e);
    for (var a = 1; a < Kc.length; a++) {
      var s = Kc[a];
      s.blockedOn === e && (s.blockedOn = null);
    }
  }
  for (
    Lc !== null && ad(Lc, e),
      Mc !== null && ad(Mc, e),
      Nc !== null && ad(Nc, e),
      Oc.forEach(o),
      Pc.forEach(o),
      a = 0;
    a < Qc.length;
    a++
  )
    ((s = Qc[a]), s.blockedOn === e && (s.blockedOn = null));
  for (; 0 < Qc.length && ((a = Qc[0]), a.blockedOn === null); )
    (Vc(a), a.blockedOn === null && Qc.shift());
}
var cd = ua.ReactCurrentBatchConfig,
  dd = !0;
function ed(e, o, a, s) {
  var i = C,
    c = cd.transition;
  cd.transition = null;
  try {
    ((C = 1), fd(e, o, a, s));
  } finally {
    ((C = i), (cd.transition = c));
  }
}
function gd(e, o, a, s) {
  var i = C,
    c = cd.transition;
  cd.transition = null;
  try {
    ((C = 4), fd(e, o, a, s));
  } finally {
    ((C = i), (cd.transition = c));
  }
}
function fd(e, o, a, s) {
  if (dd) {
    var i = Yc(e, o, a, s);
    if (i === null) (hd(e, o, s, id, a), Sc(e, s));
    else if (Uc(i, e, o, a, s)) s.stopPropagation();
    else if ((Sc(e, s), o & 4 && -1 < Rc.indexOf(e))) {
      for (; i !== null; ) {
        var c = Cb(i);
        if (
          (c !== null && Ec(c),
          (c = Yc(e, o, a, s)),
          c === null && hd(e, o, s, id, a),
          c === i)
        )
          break;
        i = c;
      }
      i !== null && s.stopPropagation();
    } else hd(e, o, s, null, a);
  }
}
var id = null;
function Yc(e, o, a, s) {
  if (((id = null), (e = xb(s)), (e = Wc(e)), e !== null))
    if (((o = Vb(e)), o === null)) e = null;
    else if (((a = o.tag), a === 13)) {
      if (((e = Wb(o)), e !== null)) return e;
      e = null;
    } else if (a === 3) {
      if (o.stateNode.current.memoizedState.isDehydrated)
        return o.tag === 3 ? o.stateNode.containerInfo : null;
      e = null;
    } else o !== e && (e = null);
  return ((id = e), null);
}
function jd(e) {
  switch (e) {
    case 'cancel':
    case 'click':
    case 'close':
    case 'contextmenu':
    case 'copy':
    case 'cut':
    case 'auxclick':
    case 'dblclick':
    case 'dragend':
    case 'dragstart':
    case 'drop':
    case 'focusin':
    case 'focusout':
    case 'input':
    case 'invalid':
    case 'keydown':
    case 'keypress':
    case 'keyup':
    case 'mousedown':
    case 'mouseup':
    case 'paste':
    case 'pause':
    case 'play':
    case 'pointercancel':
    case 'pointerdown':
    case 'pointerup':
    case 'ratechange':
    case 'reset':
    case 'resize':
    case 'seeked':
    case 'submit':
    case 'touchcancel':
    case 'touchend':
    case 'touchstart':
    case 'volumechange':
    case 'change':
    case 'selectionchange':
    case 'textInput':
    case 'compositionstart':
    case 'compositionend':
    case 'compositionupdate':
    case 'beforeblur':
    case 'afterblur':
    case 'beforeinput':
    case 'blur':
    case 'fullscreenchange':
    case 'focus':
    case 'hashchange':
    case 'popstate':
    case 'select':
    case 'selectstart':
      return 1;
    case 'drag':
    case 'dragenter':
    case 'dragexit':
    case 'dragleave':
    case 'dragover':
    case 'mousemove':
    case 'mouseout':
    case 'mouseover':
    case 'pointermove':
    case 'pointerout':
    case 'pointerover':
    case 'scroll':
    case 'toggle':
    case 'touchmove':
    case 'wheel':
    case 'mouseenter':
    case 'mouseleave':
    case 'pointerenter':
    case 'pointerleave':
      return 4;
    case 'message':
      switch (ec()) {
        case fc:
          return 1;
        case gc:
          return 4;
        case hc:
        case ic:
          return 16;
        case jc:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var kd = null,
  ld = null,
  md = null;
function nd() {
  if (md) return md;
  var e,
    o = ld,
    a = o.length,
    s,
    i = 'value' in kd ? kd.value : kd.textContent,
    c = i.length;
  for (e = 0; e < a && o[e] === i[e]; e++);
  var d = a - e;
  for (s = 1; s <= d && o[a - s] === i[c - s]; s++);
  return (md = i.slice(e, 1 < s ? 1 - s : void 0));
}
function od(e) {
  var o = e.keyCode;
  return (
    'charCode' in e
      ? ((e = e.charCode), e === 0 && o === 13 && (e = 13))
      : (e = o),
    e === 10 && (e = 13),
    32 <= e || e === 13 ? e : 0
  );
}
function pd() {
  return !0;
}
function qd() {
  return !1;
}
function rd(e) {
  function o(a, s, i, c, d) {
    ((this._reactName = a),
      (this._targetInst = i),
      (this.type = s),
      (this.nativeEvent = c),
      (this.target = d),
      (this.currentTarget = null));
    for (var h in e)
      e.hasOwnProperty(h) && ((a = e[h]), (this[h] = a ? a(c) : c[h]));
    return (
      (this.isDefaultPrevented = (
        c.defaultPrevented != null ? c.defaultPrevented : c.returnValue === !1
      )
        ? pd
        : qd),
      (this.isPropagationStopped = qd),
      this
    );
  }
  return (
    A(o.prototype, {
      preventDefault: function () {
        this.defaultPrevented = !0;
        var a = this.nativeEvent;
        a &&
          (a.preventDefault
            ? a.preventDefault()
            : typeof a.returnValue != 'unknown' && (a.returnValue = !1),
          (this.isDefaultPrevented = pd));
      },
      stopPropagation: function () {
        var a = this.nativeEvent;
        a &&
          (a.stopPropagation
            ? a.stopPropagation()
            : typeof a.cancelBubble != 'unknown' && (a.cancelBubble = !0),
          (this.isPropagationStopped = pd));
      },
      persist: function () {},
      isPersistent: pd,
    }),
    o
  );
}
var sd = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function (e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0,
  },
  td = rd(sd),
  ud = A({}, sd, { view: 0, detail: 0 }),
  vd = rd(ud),
  wd,
  xd,
  yd,
  Ad = A({}, ud, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: zd,
    button: 0,
    buttons: 0,
    relatedTarget: function (e) {
      return e.relatedTarget === void 0
        ? e.fromElement === e.srcElement
          ? e.toElement
          : e.fromElement
        : e.relatedTarget;
    },
    movementX: function (e) {
      return 'movementX' in e
        ? e.movementX
        : (e !== yd &&
            (yd && e.type === 'mousemove'
              ? ((wd = e.screenX - yd.screenX), (xd = e.screenY - yd.screenY))
              : (xd = wd = 0),
            (yd = e)),
          wd);
    },
    movementY: function (e) {
      return 'movementY' in e ? e.movementY : xd;
    },
  }),
  Bd = rd(Ad),
  Cd = A({}, Ad, { dataTransfer: 0 }),
  Dd = rd(Cd),
  Ed = A({}, ud, { relatedTarget: 0 }),
  Fd = rd(Ed),
  Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
  Hd = rd(Gd),
  Id = A({}, sd, {
    clipboardData: function (e) {
      return 'clipboardData' in e ? e.clipboardData : window.clipboardData;
    },
  }),
  Jd = rd(Id),
  Kd = A({}, sd, { data: 0 }),
  Ld = rd(Kd),
  Md = {
    Esc: 'Escape',
    Spacebar: ' ',
    Left: 'ArrowLeft',
    Up: 'ArrowUp',
    Right: 'ArrowRight',
    Down: 'ArrowDown',
    Del: 'Delete',
    Win: 'OS',
    Menu: 'ContextMenu',
    Apps: 'ContextMenu',
    Scroll: 'ScrollLock',
    MozPrintableKey: 'Unidentified',
  },
  Nd = {
    8: 'Backspace',
    9: 'Tab',
    12: 'Clear',
    13: 'Enter',
    16: 'Shift',
    17: 'Control',
    18: 'Alt',
    19: 'Pause',
    20: 'CapsLock',
    27: 'Escape',
    32: ' ',
    33: 'PageUp',
    34: 'PageDown',
    35: 'End',
    36: 'Home',
    37: 'ArrowLeft',
    38: 'ArrowUp',
    39: 'ArrowRight',
    40: 'ArrowDown',
    45: 'Insert',
    46: 'Delete',
    112: 'F1',
    113: 'F2',
    114: 'F3',
    115: 'F4',
    116: 'F5',
    117: 'F6',
    118: 'F7',
    119: 'F8',
    120: 'F9',
    121: 'F10',
    122: 'F11',
    123: 'F12',
    144: 'NumLock',
    145: 'ScrollLock',
    224: 'Meta',
  },
  Od = {
    Alt: 'altKey',
    Control: 'ctrlKey',
    Meta: 'metaKey',
    Shift: 'shiftKey',
  };
function Pd(e) {
  var o = this.nativeEvent;
  return o.getModifierState ? o.getModifierState(e) : (e = Od[e]) ? !!o[e] : !1;
}
function zd() {
  return Pd;
}
var Qd = A({}, ud, {
    key: function (e) {
      if (e.key) {
        var o = Md[e.key] || e.key;
        if (o !== 'Unidentified') return o;
      }
      return e.type === 'keypress'
        ? ((e = od(e)), e === 13 ? 'Enter' : String.fromCharCode(e))
        : e.type === 'keydown' || e.type === 'keyup'
          ? Nd[e.keyCode] || 'Unidentified'
          : '';
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: zd,
    charCode: function (e) {
      return e.type === 'keypress' ? od(e) : 0;
    },
    keyCode: function (e) {
      return e.type === 'keydown' || e.type === 'keyup' ? e.keyCode : 0;
    },
    which: function (e) {
      return e.type === 'keypress'
        ? od(e)
        : e.type === 'keydown' || e.type === 'keyup'
          ? e.keyCode
          : 0;
    },
  }),
  Rd = rd(Qd),
  Sd = A({}, Ad, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0,
  }),
  Td = rd(Sd),
  Ud = A({}, ud, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: zd,
  }),
  Vd = rd(Ud),
  Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
  Xd = rd(Wd),
  Yd = A({}, Ad, {
    deltaX: function (e) {
      return 'deltaX' in e ? e.deltaX : 'wheelDeltaX' in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function (e) {
      return 'deltaY' in e
        ? e.deltaY
        : 'wheelDeltaY' in e
          ? -e.wheelDeltaY
          : 'wheelDelta' in e
            ? -e.wheelDelta
            : 0;
    },
    deltaZ: 0,
    deltaMode: 0,
  }),
  Zd = rd(Yd),
  $d = [9, 13, 27, 32],
  ae = ia && 'CompositionEvent' in window,
  be = null;
ia && 'documentMode' in document && (be = document.documentMode);
var ce = ia && 'TextEvent' in window && !be,
  de = ia && (!ae || (be && 8 < be && 11 >= be)),
  ee = String.fromCharCode(32),
  fe = !1;
function ge(e, o) {
  switch (e) {
    case 'keyup':
      return $d.indexOf(o.keyCode) !== -1;
    case 'keydown':
      return o.keyCode !== 229;
    case 'keypress':
    case 'mousedown':
    case 'focusout':
      return !0;
    default:
      return !1;
  }
}
function he(e) {
  return ((e = e.detail), typeof e == 'object' && 'data' in e ? e.data : null);
}
var ie = !1;
function je(e, o) {
  switch (e) {
    case 'compositionend':
      return he(o);
    case 'keypress':
      return o.which !== 32 ? null : ((fe = !0), ee);
    case 'textInput':
      return ((e = o.data), e === ee && fe ? null : e);
    default:
      return null;
  }
}
function ke(e, o) {
  if (ie)
    return e === 'compositionend' || (!ae && ge(e, o))
      ? ((e = nd()), (md = ld = kd = null), (ie = !1), e)
      : null;
  switch (e) {
    case 'paste':
      return null;
    case 'keypress':
      if (!(o.ctrlKey || o.altKey || o.metaKey) || (o.ctrlKey && o.altKey)) {
        if (o.char && 1 < o.char.length) return o.char;
        if (o.which) return String.fromCharCode(o.which);
      }
      return null;
    case 'compositionend':
      return de && o.locale !== 'ko' ? null : o.data;
    default:
      return null;
  }
}
var le = {
  color: !0,
  date: !0,
  datetime: !0,
  'datetime-local': !0,
  email: !0,
  month: !0,
  number: !0,
  password: !0,
  range: !0,
  search: !0,
  tel: !0,
  text: !0,
  time: !0,
  url: !0,
  week: !0,
};
function me(e) {
  var o = e && e.nodeName && e.nodeName.toLowerCase();
  return o === 'input' ? !!le[e.type] : o === 'textarea';
}
function ne(e, o, a, s) {
  (Eb(s),
    (o = oe(o, 'onChange')),
    0 < o.length &&
      ((a = new td('onChange', 'change', null, a, s)),
      e.push({ event: a, listeners: o })));
}
var pe = null,
  qe = null;
function re(e) {
  se(e, 0);
}
function te(e) {
  var o = ue(e);
  if (Wa(o)) return e;
}
function ve(e, o) {
  if (e === 'change') return o;
}
var we = !1;
if (ia) {
  var xe;
  if (ia) {
    var ye = 'oninput' in document;
    if (!ye) {
      var ze = document.createElement('div');
      (ze.setAttribute('oninput', 'return;'),
        (ye = typeof ze.oninput == 'function'));
    }
    xe = ye;
  } else xe = !1;
  we = xe && (!document.documentMode || 9 < document.documentMode);
}
function Ae() {
  pe && (pe.detachEvent('onpropertychange', Be), (qe = pe = null));
}
function Be(e) {
  if (e.propertyName === 'value' && te(qe)) {
    var o = [];
    (ne(o, qe, e, xb(e)), Jb(re, o));
  }
}
function Ce(e, o, a) {
  e === 'focusin'
    ? (Ae(), (pe = o), (qe = a), pe.attachEvent('onpropertychange', Be))
    : e === 'focusout' && Ae();
}
function De(e) {
  if (e === 'selectionchange' || e === 'keyup' || e === 'keydown')
    return te(qe);
}
function Ee(e, o) {
  if (e === 'click') return te(o);
}
function Fe(e, o) {
  if (e === 'input' || e === 'change') return te(o);
}
function Ge(e, o) {
  return (e === o && (e !== 0 || 1 / e === 1 / o)) || (e !== e && o !== o);
}
var He = typeof Object.is == 'function' ? Object.is : Ge;
function Ie(e, o) {
  if (He(e, o)) return !0;
  if (typeof e != 'object' || e === null || typeof o != 'object' || o === null)
    return !1;
  var a = Object.keys(e),
    s = Object.keys(o);
  if (a.length !== s.length) return !1;
  for (s = 0; s < a.length; s++) {
    var i = a[s];
    if (!ja.call(o, i) || !He(e[i], o[i])) return !1;
  }
  return !0;
}
function Je(e) {
  for (; e && e.firstChild; ) e = e.firstChild;
  return e;
}
function Ke(e, o) {
  var a = Je(e);
  e = 0;
  for (var s; a; ) {
    if (a.nodeType === 3) {
      if (((s = e + a.textContent.length), e <= o && s >= o))
        return { node: a, offset: o - e };
      e = s;
    }
    e: {
      for (; a; ) {
        if (a.nextSibling) {
          a = a.nextSibling;
          break e;
        }
        a = a.parentNode;
      }
      a = void 0;
    }
    a = Je(a);
  }
}
function Le(e, o) {
  return e && o
    ? e === o
      ? !0
      : e && e.nodeType === 3
        ? !1
        : o && o.nodeType === 3
          ? Le(e, o.parentNode)
          : 'contains' in e
            ? e.contains(o)
            : e.compareDocumentPosition
              ? !!(e.compareDocumentPosition(o) & 16)
              : !1
    : !1;
}
function Me() {
  for (var e = window, o = Xa(); o instanceof e.HTMLIFrameElement; ) {
    try {
      var a = typeof o.contentWindow.location.href == 'string';
    } catch {
      a = !1;
    }
    if (a) e = o.contentWindow;
    else break;
    o = Xa(e.document);
  }
  return o;
}
function Ne(e) {
  var o = e && e.nodeName && e.nodeName.toLowerCase();
  return (
    o &&
    ((o === 'input' &&
      (e.type === 'text' ||
        e.type === 'search' ||
        e.type === 'tel' ||
        e.type === 'url' ||
        e.type === 'password')) ||
      o === 'textarea' ||
      e.contentEditable === 'true')
  );
}
function Oe(e) {
  var o = Me(),
    a = e.focusedElem,
    s = e.selectionRange;
  if (
    o !== a &&
    a &&
    a.ownerDocument &&
    Le(a.ownerDocument.documentElement, a)
  ) {
    if (s !== null && Ne(a)) {
      if (
        ((o = s.start),
        (e = s.end),
        e === void 0 && (e = o),
        'selectionStart' in a)
      )
        ((a.selectionStart = o),
          (a.selectionEnd = Math.min(e, a.value.length)));
      else if (
        ((e = ((o = a.ownerDocument || document) && o.defaultView) || window),
        e.getSelection)
      ) {
        e = e.getSelection();
        var i = a.textContent.length,
          c = Math.min(s.start, i);
        ((s = s.end === void 0 ? c : Math.min(s.end, i)),
          !e.extend && c > s && ((i = s), (s = c), (c = i)),
          (i = Ke(a, c)));
        var d = Ke(a, s);
        i &&
          d &&
          (e.rangeCount !== 1 ||
            e.anchorNode !== i.node ||
            e.anchorOffset !== i.offset ||
            e.focusNode !== d.node ||
            e.focusOffset !== d.offset) &&
          ((o = o.createRange()),
          o.setStart(i.node, i.offset),
          e.removeAllRanges(),
          c > s
            ? (e.addRange(o), e.extend(d.node, d.offset))
            : (o.setEnd(d.node, d.offset), e.addRange(o)));
      }
    }
    for (o = [], e = a; (e = e.parentNode); )
      e.nodeType === 1 &&
        o.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
    for (typeof a.focus == 'function' && a.focus(), a = 0; a < o.length; a++)
      ((e = o[a]),
        (e.element.scrollLeft = e.left),
        (e.element.scrollTop = e.top));
  }
}
var Pe = ia && 'documentMode' in document && 11 >= document.documentMode,
  Qe = null,
  Re = null,
  Se = null,
  Te = !1;
function Ue(e, o, a) {
  var s = a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument;
  Te ||
    Qe == null ||
    Qe !== Xa(s) ||
    ((s = Qe),
    'selectionStart' in s && Ne(s)
      ? (s = { start: s.selectionStart, end: s.selectionEnd })
      : ((s = (
          (s.ownerDocument && s.ownerDocument.defaultView) ||
          window
        ).getSelection()),
        (s = {
          anchorNode: s.anchorNode,
          anchorOffset: s.anchorOffset,
          focusNode: s.focusNode,
          focusOffset: s.focusOffset,
        })),
    (Se && Ie(Se, s)) ||
      ((Se = s),
      (s = oe(Re, 'onSelect')),
      0 < s.length &&
        ((o = new td('onSelect', 'select', null, o, a)),
        e.push({ event: o, listeners: s }),
        (o.target = Qe))));
}
function Ve(e, o) {
  var a = {};
  return (
    (a[e.toLowerCase()] = o.toLowerCase()),
    (a['Webkit' + e] = 'webkit' + o),
    (a['Moz' + e] = 'moz' + o),
    a
  );
}
var We = {
    animationend: Ve('Animation', 'AnimationEnd'),
    animationiteration: Ve('Animation', 'AnimationIteration'),
    animationstart: Ve('Animation', 'AnimationStart'),
    transitionend: Ve('Transition', 'TransitionEnd'),
  },
  Xe = {},
  Ye = {};
ia &&
  ((Ye = document.createElement('div').style),
  'AnimationEvent' in window ||
    (delete We.animationend.animation,
    delete We.animationiteration.animation,
    delete We.animationstart.animation),
  'TransitionEvent' in window || delete We.transitionend.transition);
function Ze(e) {
  if (Xe[e]) return Xe[e];
  if (!We[e]) return e;
  var o = We[e],
    a;
  for (a in o) if (o.hasOwnProperty(a) && a in Ye) return (Xe[e] = o[a]);
  return e;
}
var $e = Ze('animationend'),
  af = Ze('animationiteration'),
  bf = Ze('animationstart'),
  cf = Ze('transitionend'),
  df = new Map(),
  ef =
    'abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel'.split(
      ' '
    );
function ff(e, o) {
  (df.set(e, o), fa(o, [e]));
}
for (var gf = 0; gf < ef.length; gf++) {
  var hf = ef[gf],
    jf = hf.toLowerCase(),
    kf = hf[0].toUpperCase() + hf.slice(1);
  ff(jf, 'on' + kf);
}
ff($e, 'onAnimationEnd');
ff(af, 'onAnimationIteration');
ff(bf, 'onAnimationStart');
ff('dblclick', 'onDoubleClick');
ff('focusin', 'onFocus');
ff('focusout', 'onBlur');
ff(cf, 'onTransitionEnd');
ha('onMouseEnter', ['mouseout', 'mouseover']);
ha('onMouseLeave', ['mouseout', 'mouseover']);
ha('onPointerEnter', ['pointerout', 'pointerover']);
ha('onPointerLeave', ['pointerout', 'pointerover']);
fa(
  'onChange',
  'change click focusin focusout input keydown keyup selectionchange'.split(' ')
);
fa(
  'onSelect',
  'focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange'.split(
    ' '
  )
);
fa('onBeforeInput', ['compositionend', 'keypress', 'textInput', 'paste']);
fa(
  'onCompositionEnd',
  'compositionend focusout keydown keypress keyup mousedown'.split(' ')
);
fa(
  'onCompositionStart',
  'compositionstart focusout keydown keypress keyup mousedown'.split(' ')
);
fa(
  'onCompositionUpdate',
  'compositionupdate focusout keydown keypress keyup mousedown'.split(' ')
);
var lf =
    'abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting'.split(
      ' '
    ),
  mf = new Set('cancel close invalid load scroll toggle'.split(' ').concat(lf));
function nf(e, o, a) {
  var s = e.type || 'unknown-event';
  ((e.currentTarget = a), Ub(s, o, void 0, e), (e.currentTarget = null));
}
function se(e, o) {
  o = (o & 4) !== 0;
  for (var a = 0; a < e.length; a++) {
    var s = e[a],
      i = s.event;
    s = s.listeners;
    e: {
      var c = void 0;
      if (o)
        for (var d = s.length - 1; 0 <= d; d--) {
          var h = s[d],
            b = h.instance,
            g = h.currentTarget;
          if (((h = h.listener), b !== c && i.isPropagationStopped())) break e;
          (nf(i, h, g), (c = b));
        }
      else
        for (d = 0; d < s.length; d++) {
          if (
            ((h = s[d]),
            (b = h.instance),
            (g = h.currentTarget),
            (h = h.listener),
            b !== c && i.isPropagationStopped())
          )
            break e;
          (nf(i, h, g), (c = b));
        }
    }
  }
  if (Qb) throw ((e = Rb), (Qb = !1), (Rb = null), e);
}
function D(e, o) {
  var a = o[of];
  a === void 0 && (a = o[of] = new Set());
  var s = e + '__bubble';
  a.has(s) || (pf(o, e, 2, !1), a.add(s));
}
function qf(e, o, a) {
  var s = 0;
  (o && (s |= 4), pf(a, e, s, o));
}
var rf = '_reactListening' + Math.random().toString(36).slice(2);
function sf(e) {
  if (!e[rf]) {
    ((e[rf] = !0),
      da.forEach(function (a) {
        a !== 'selectionchange' && (mf.has(a) || qf(a, !1, e), qf(a, !0, e));
      }));
    var o = e.nodeType === 9 ? e : e.ownerDocument;
    o === null || o[rf] || ((o[rf] = !0), qf('selectionchange', !1, o));
  }
}
function pf(e, o, a, s) {
  switch (jd(o)) {
    case 1:
      var i = ed;
      break;
    case 4:
      i = gd;
      break;
    default:
      i = fd;
  }
  ((a = i.bind(null, o, a, e)),
    (i = void 0),
    !Lb ||
      (o !== 'touchstart' && o !== 'touchmove' && o !== 'wheel') ||
      (i = !0),
    s
      ? i !== void 0
        ? e.addEventListener(o, a, { capture: !0, passive: i })
        : e.addEventListener(o, a, !0)
      : i !== void 0
        ? e.addEventListener(o, a, { passive: i })
        : e.addEventListener(o, a, !1));
}
function hd(e, o, a, s, i) {
  var c = s;
  if (!(o & 1) && !(o & 2) && s !== null)
    e: for (;;) {
      if (s === null) return;
      var d = s.tag;
      if (d === 3 || d === 4) {
        var h = s.stateNode.containerInfo;
        if (h === i || (h.nodeType === 8 && h.parentNode === i)) break;
        if (d === 4)
          for (d = s.return; d !== null; ) {
            var b = d.tag;
            if (
              (b === 3 || b === 4) &&
              ((b = d.stateNode.containerInfo),
              b === i || (b.nodeType === 8 && b.parentNode === i))
            )
              return;
            d = d.return;
          }
        for (; h !== null; ) {
          if (((d = Wc(h)), d === null)) return;
          if (((b = d.tag), b === 5 || b === 6)) {
            s = c = d;
            continue e;
          }
          h = h.parentNode;
        }
      }
      s = s.return;
    }
  Jb(function () {
    var g = c,
      $ = xb(a),
      _ = [];
    e: {
      var _e = df.get(e);
      if (_e !== void 0) {
        var ot = td,
          j = e;
        switch (e) {
          case 'keypress':
            if (od(a) === 0) break e;
          case 'keydown':
          case 'keyup':
            ot = Rd;
            break;
          case 'focusin':
            ((j = 'focus'), (ot = Fd));
            break;
          case 'focusout':
            ((j = 'blur'), (ot = Fd));
            break;
          case 'beforeblur':
          case 'afterblur':
            ot = Fd;
            break;
          case 'click':
            if (a.button === 2) break e;
          case 'auxclick':
          case 'dblclick':
          case 'mousedown':
          case 'mousemove':
          case 'mouseup':
          case 'mouseout':
          case 'mouseover':
          case 'contextmenu':
            ot = Bd;
            break;
          case 'drag':
          case 'dragend':
          case 'dragenter':
          case 'dragexit':
          case 'dragleave':
          case 'dragover':
          case 'dragstart':
          case 'drop':
            ot = Dd;
            break;
          case 'touchcancel':
          case 'touchend':
          case 'touchmove':
          case 'touchstart':
            ot = Vd;
            break;
          case $e:
          case af:
          case bf:
            ot = Hd;
            break;
          case cf:
            ot = Xd;
            break;
          case 'scroll':
            ot = vd;
            break;
          case 'wheel':
            ot = Zd;
            break;
          case 'copy':
          case 'cut':
          case 'paste':
            ot = Jd;
            break;
          case 'gotpointercapture':
          case 'lostpointercapture':
          case 'pointercancel':
          case 'pointerdown':
          case 'pointermove':
          case 'pointerout':
          case 'pointerover':
          case 'pointerup':
            ot = Td;
        }
        var nt = (o & 4) !== 0,
          lt = !nt && e === 'scroll',
          tt = nt ? (_e !== null ? _e + 'Capture' : null) : _e;
        nt = [];
        for (var et = g, rt; et !== null; ) {
          rt = et;
          var at = rt.stateNode;
          if (
            (rt.tag === 5 &&
              at !== null &&
              ((rt = at),
              tt !== null &&
                ((at = Kb(et, tt)), at != null && nt.push(tf(et, at, rt)))),
            lt)
          )
            break;
          et = et.return;
        }
        0 < nt.length &&
          ((_e = new ot(_e, j, null, a, $)),
          _.push({ event: _e, listeners: nt }));
      }
    }
    if (!(o & 7)) {
      e: {
        if (
          ((_e = e === 'mouseover' || e === 'pointerover'),
          (ot = e === 'mouseout' || e === 'pointerout'),
          _e &&
            a !== wb &&
            (j = a.relatedTarget || a.fromElement) &&
            (Wc(j) || j[uf]))
        )
          break e;
        if (
          (ot || _e) &&
          ((_e =
            $.window === $
              ? $
              : (_e = $.ownerDocument)
                ? _e.defaultView || _e.parentWindow
                : window),
          ot
            ? ((j = a.relatedTarget || a.toElement),
              (ot = g),
              (j = j ? Wc(j) : null),
              j !== null &&
                ((lt = Vb(j)), j !== lt || (j.tag !== 5 && j.tag !== 6)) &&
                (j = null))
            : ((ot = null), (j = g)),
          ot !== j)
        ) {
          if (
            ((nt = Bd),
            (at = 'onMouseLeave'),
            (tt = 'onMouseEnter'),
            (et = 'mouse'),
            (e === 'pointerout' || e === 'pointerover') &&
              ((nt = Td),
              (at = 'onPointerLeave'),
              (tt = 'onPointerEnter'),
              (et = 'pointer')),
            (lt = ot == null ? _e : ue(ot)),
            (rt = j == null ? _e : ue(j)),
            (_e = new nt(at, et + 'leave', ot, a, $)),
            (_e.target = lt),
            (_e.relatedTarget = rt),
            (at = null),
            Wc($) === g &&
              ((nt = new nt(tt, et + 'enter', j, a, $)),
              (nt.target = rt),
              (nt.relatedTarget = lt),
              (at = nt)),
            (lt = at),
            ot && j)
          )
            t: {
              for (nt = ot, tt = j, et = 0, rt = nt; rt; rt = vf(rt)) et++;
              for (rt = 0, at = tt; at; at = vf(at)) rt++;
              for (; 0 < et - rt; ) ((nt = vf(nt)), et--);
              for (; 0 < rt - et; ) ((tt = vf(tt)), rt--);
              for (; et--; ) {
                if (nt === tt || (tt !== null && nt === tt.alternate)) break t;
                ((nt = vf(nt)), (tt = vf(tt)));
              }
              nt = null;
            }
          else nt = null;
          (ot !== null && wf(_, _e, ot, nt, !1),
            j !== null && lt !== null && wf(_, lt, j, nt, !0));
        }
      }
      e: {
        if (
          ((_e = g ? ue(g) : window),
          (ot = _e.nodeName && _e.nodeName.toLowerCase()),
          ot === 'select' || (ot === 'input' && _e.type === 'file'))
        )
          var ct = ve;
        else if (me(_e))
          if (we) ct = Fe;
          else {
            ct = De;
            var dt = Ce;
          }
        else
          (ot = _e.nodeName) &&
            ot.toLowerCase() === 'input' &&
            (_e.type === 'checkbox' || _e.type === 'radio') &&
            (ct = Ee);
        if (ct && (ct = ct(e, g))) {
          ne(_, ct, a, $);
          break e;
        }
        (dt && dt(e, _e, g),
          e === 'focusout' &&
            (dt = _e._wrapperState) &&
            dt.controlled &&
            _e.type === 'number' &&
            cb(_e, 'number', _e.value));
      }
      switch (((dt = g ? ue(g) : window), e)) {
        case 'focusin':
          (me(dt) || dt.contentEditable === 'true') &&
            ((Qe = dt), (Re = g), (Se = null));
          break;
        case 'focusout':
          Se = Re = Qe = null;
          break;
        case 'mousedown':
          Te = !0;
          break;
        case 'contextmenu':
        case 'mouseup':
        case 'dragend':
          ((Te = !1), Ue(_, a, $));
          break;
        case 'selectionchange':
          if (Pe) break;
        case 'keydown':
        case 'keyup':
          Ue(_, a, $);
      }
      var ut;
      if (ae)
        e: {
          switch (e) {
            case 'compositionstart':
              var st = 'onCompositionStart';
              break e;
            case 'compositionend':
              st = 'onCompositionEnd';
              break e;
            case 'compositionupdate':
              st = 'onCompositionUpdate';
              break e;
          }
          st = void 0;
        }
      else
        ie
          ? ge(e, a) && (st = 'onCompositionEnd')
          : e === 'keydown' && a.keyCode === 229 && (st = 'onCompositionStart');
      (st &&
        (de &&
          a.locale !== 'ko' &&
          (ie || st !== 'onCompositionStart'
            ? st === 'onCompositionEnd' && ie && (ut = nd())
            : ((kd = $),
              (ld = 'value' in kd ? kd.value : kd.textContent),
              (ie = !0))),
        (dt = oe(g, st)),
        0 < dt.length &&
          ((st = new Ld(st, e, null, a, $)),
          _.push({ event: st, listeners: dt }),
          ut ? (st.data = ut) : ((ut = he(a)), ut !== null && (st.data = ut)))),
        (ut = ce ? je(e, a) : ke(e, a)) &&
          ((g = oe(g, 'onBeforeInput')),
          0 < g.length &&
            (($ = new Ld('onBeforeInput', 'beforeinput', null, a, $)),
            _.push({ event: $, listeners: g }),
            ($.data = ut))));
    }
    se(_, o);
  });
}
function tf(e, o, a) {
  return { instance: e, listener: o, currentTarget: a };
}
function oe(e, o) {
  for (var a = o + 'Capture', s = []; e !== null; ) {
    var i = e,
      c = i.stateNode;
    (i.tag === 5 &&
      c !== null &&
      ((i = c),
      (c = Kb(e, a)),
      c != null && s.unshift(tf(e, c, i)),
      (c = Kb(e, o)),
      c != null && s.push(tf(e, c, i))),
      (e = e.return));
  }
  return s;
}
function vf(e) {
  if (e === null) return null;
  do e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function wf(e, o, a, s, i) {
  for (var c = o._reactName, d = []; a !== null && a !== s; ) {
    var h = a,
      b = h.alternate,
      g = h.stateNode;
    if (b !== null && b === s) break;
    (h.tag === 5 &&
      g !== null &&
      ((h = g),
      i
        ? ((b = Kb(a, c)), b != null && d.unshift(tf(a, b, h)))
        : i || ((b = Kb(a, c)), b != null && d.push(tf(a, b, h)))),
      (a = a.return));
  }
  d.length !== 0 && e.push({ event: o, listeners: d });
}
var xf = /\r\n?/g,
  yf = /\u0000|\uFFFD/g;
function zf(e) {
  return (typeof e == 'string' ? e : '' + e)
    .replace(
      xf,
      `
`
    )
    .replace(yf, '');
}
function Af(e, o, a) {
  if (((o = zf(o)), zf(e) !== o && a)) throw Error(p(425));
}
function Bf() {}
var Cf = null,
  Df = null;
function Ef(e, o) {
  return (
    e === 'textarea' ||
    e === 'noscript' ||
    typeof o.children == 'string' ||
    typeof o.children == 'number' ||
    (typeof o.dangerouslySetInnerHTML == 'object' &&
      o.dangerouslySetInnerHTML !== null &&
      o.dangerouslySetInnerHTML.__html != null)
  );
}
var Ff = typeof setTimeout == 'function' ? setTimeout : void 0,
  Gf = typeof clearTimeout == 'function' ? clearTimeout : void 0,
  Hf = typeof Promise == 'function' ? Promise : void 0,
  Jf =
    typeof queueMicrotask == 'function'
      ? queueMicrotask
      : typeof Hf < 'u'
        ? function (e) {
            return Hf.resolve(null).then(e).catch(If);
          }
        : Ff;
function If(e) {
  setTimeout(function () {
    throw e;
  });
}
function Kf(e, o) {
  var a = o,
    s = 0;
  do {
    var i = a.nextSibling;
    if ((e.removeChild(a), i && i.nodeType === 8))
      if (((a = i.data), a === '/$')) {
        if (s === 0) {
          (e.removeChild(i), bd(o));
          return;
        }
        s--;
      } else (a !== '$' && a !== '$?' && a !== '$!') || s++;
    a = i;
  } while (a);
  bd(o);
}
function Lf(e) {
  for (; e != null; e = e.nextSibling) {
    var o = e.nodeType;
    if (o === 1 || o === 3) break;
    if (o === 8) {
      if (((o = e.data), o === '$' || o === '$!' || o === '$?')) break;
      if (o === '/$') return null;
    }
  }
  return e;
}
function Mf(e) {
  e = e.previousSibling;
  for (var o = 0; e; ) {
    if (e.nodeType === 8) {
      var a = e.data;
      if (a === '$' || a === '$!' || a === '$?') {
        if (o === 0) return e;
        o--;
      } else a === '/$' && o++;
    }
    e = e.previousSibling;
  }
  return null;
}
var Nf = Math.random().toString(36).slice(2),
  Of = '__reactFiber$' + Nf,
  Pf = '__reactProps$' + Nf,
  uf = '__reactContainer$' + Nf,
  of = '__reactEvents$' + Nf,
  Qf = '__reactListeners$' + Nf,
  Rf = '__reactHandles$' + Nf;
function Wc(e) {
  var o = e[Of];
  if (o) return o;
  for (var a = e.parentNode; a; ) {
    if ((o = a[uf] || a[Of])) {
      if (
        ((a = o.alternate),
        o.child !== null || (a !== null && a.child !== null))
      )
        for (e = Mf(e); e !== null; ) {
          if ((a = e[Of])) return a;
          e = Mf(e);
        }
      return o;
    }
    ((e = a), (a = e.parentNode));
  }
  return null;
}
function Cb(e) {
  return (
    (e = e[Of] || e[uf]),
    !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3) ? null : e
  );
}
function ue(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(p(33));
}
function Db(e) {
  return e[Pf] || null;
}
var Sf = [],
  Tf = -1;
function Uf(e) {
  return { current: e };
}
function E(e) {
  0 > Tf || ((e.current = Sf[Tf]), (Sf[Tf] = null), Tf--);
}
function G(e, o) {
  (Tf++, (Sf[Tf] = e.current), (e.current = o));
}
var Vf = {},
  H = Uf(Vf),
  Wf = Uf(!1),
  Xf = Vf;
function Yf(e, o) {
  var a = e.type.contextTypes;
  if (!a) return Vf;
  var s = e.stateNode;
  if (s && s.__reactInternalMemoizedUnmaskedChildContext === o)
    return s.__reactInternalMemoizedMaskedChildContext;
  var i = {},
    c;
  for (c in a) i[c] = o[c];
  return (
    s &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = o),
      (e.__reactInternalMemoizedMaskedChildContext = i)),
    i
  );
}
function Zf(e) {
  return ((e = e.childContextTypes), e != null);
}
function $f() {
  (E(Wf), E(H));
}
function ag(e, o, a) {
  if (H.current !== Vf) throw Error(p(168));
  (G(H, o), G(Wf, a));
}
function bg(e, o, a) {
  var s = e.stateNode;
  if (((o = o.childContextTypes), typeof s.getChildContext != 'function'))
    return a;
  s = s.getChildContext();
  for (var i in s) if (!(i in o)) throw Error(p(108, Ra(e) || 'Unknown', i));
  return A({}, a, s);
}
function cg(e) {
  return (
    (e =
      ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) || Vf),
    (Xf = H.current),
    G(H, e),
    G(Wf, Wf.current),
    !0
  );
}
function dg(e, o, a) {
  var s = e.stateNode;
  if (!s) throw Error(p(169));
  (a
    ? ((e = bg(e, o, Xf)),
      (s.__reactInternalMemoizedMergedChildContext = e),
      E(Wf),
      E(H),
      G(H, e))
    : E(Wf),
    G(Wf, a));
}
var eg = null,
  fg = !1,
  gg = !1;
function hg(e) {
  eg === null ? (eg = [e]) : eg.push(e);
}
function ig(e) {
  ((fg = !0), hg(e));
}
function jg() {
  if (!gg && eg !== null) {
    gg = !0;
    var e = 0,
      o = C;
    try {
      var a = eg;
      for (C = 1; e < a.length; e++) {
        var s = a[e];
        do s = s(!0);
        while (s !== null);
      }
      ((eg = null), (fg = !1));
    } catch (i) {
      throw (eg !== null && (eg = eg.slice(e + 1)), ac(fc, jg), i);
    } finally {
      ((C = o), (gg = !1));
    }
  }
  return null;
}
var kg = [],
  lg = 0,
  mg = null,
  ng = 0,
  og = [],
  pg = 0,
  qg = null,
  rg = 1,
  sg = '';
function tg(e, o) {
  ((kg[lg++] = ng), (kg[lg++] = mg), (mg = e), (ng = o));
}
function ug(e, o, a) {
  ((og[pg++] = rg), (og[pg++] = sg), (og[pg++] = qg), (qg = e));
  var s = rg;
  e = sg;
  var i = 32 - oc(s) - 1;
  ((s &= ~(1 << i)), (a += 1));
  var c = 32 - oc(o) + i;
  if (30 < c) {
    var d = i - (i % 5);
    ((c = (s & ((1 << d) - 1)).toString(32)),
      (s >>= d),
      (i -= d),
      (rg = (1 << (32 - oc(o) + i)) | (a << i) | s),
      (sg = c + e));
  } else ((rg = (1 << c) | (a << i) | s), (sg = e));
}
function vg(e) {
  e.return !== null && (tg(e, 1), ug(e, 1, 0));
}
function wg(e) {
  for (; e === mg; )
    ((mg = kg[--lg]), (kg[lg] = null), (ng = kg[--lg]), (kg[lg] = null));
  for (; e === qg; )
    ((qg = og[--pg]),
      (og[pg] = null),
      (sg = og[--pg]),
      (og[pg] = null),
      (rg = og[--pg]),
      (og[pg] = null));
}
var xg = null,
  yg = null,
  I = !1,
  zg = null;
function Ag(e, o) {
  var a = Bg(5, null, null, 0);
  ((a.elementType = 'DELETED'),
    (a.stateNode = o),
    (a.return = e),
    (o = e.deletions),
    o === null ? ((e.deletions = [a]), (e.flags |= 16)) : o.push(a));
}
function Cg(e, o) {
  switch (e.tag) {
    case 5:
      var a = e.type;
      return (
        (o =
          o.nodeType !== 1 || a.toLowerCase() !== o.nodeName.toLowerCase()
            ? null
            : o),
        o !== null
          ? ((e.stateNode = o), (xg = e), (yg = Lf(o.firstChild)), !0)
          : !1
      );
    case 6:
      return (
        (o = e.pendingProps === '' || o.nodeType !== 3 ? null : o),
        o !== null ? ((e.stateNode = o), (xg = e), (yg = null), !0) : !1
      );
    case 13:
      return (
        (o = o.nodeType !== 8 ? null : o),
        o !== null
          ? ((a = qg !== null ? { id: rg, overflow: sg } : null),
            (e.memoizedState = {
              dehydrated: o,
              treeContext: a,
              retryLane: 1073741824,
            }),
            (a = Bg(18, null, null, 0)),
            (a.stateNode = o),
            (a.return = e),
            (e.child = a),
            (xg = e),
            (yg = null),
            !0)
          : !1
      );
    default:
      return !1;
  }
}
function Dg(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function Eg(e) {
  if (I) {
    var o = yg;
    if (o) {
      var a = o;
      if (!Cg(e, o)) {
        if (Dg(e)) throw Error(p(418));
        o = Lf(a.nextSibling);
        var s = xg;
        o && Cg(e, o)
          ? Ag(s, a)
          : ((e.flags = (e.flags & -4097) | 2), (I = !1), (xg = e));
      }
    } else {
      if (Dg(e)) throw Error(p(418));
      ((e.flags = (e.flags & -4097) | 2), (I = !1), (xg = e));
    }
  }
}
function Fg(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; )
    e = e.return;
  xg = e;
}
function Gg(e) {
  if (e !== xg) return !1;
  if (!I) return (Fg(e), (I = !0), !1);
  var o;
  if (
    ((o = e.tag !== 3) &&
      !(o = e.tag !== 5) &&
      ((o = e.type),
      (o = o !== 'head' && o !== 'body' && !Ef(e.type, e.memoizedProps))),
    o && (o = yg))
  ) {
    if (Dg(e)) throw (Hg(), Error(p(418)));
    for (; o; ) (Ag(e, o), (o = Lf(o.nextSibling)));
  }
  if ((Fg(e), e.tag === 13)) {
    if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
      throw Error(p(317));
    e: {
      for (e = e.nextSibling, o = 0; e; ) {
        if (e.nodeType === 8) {
          var a = e.data;
          if (a === '/$') {
            if (o === 0) {
              yg = Lf(e.nextSibling);
              break e;
            }
            o--;
          } else (a !== '$' && a !== '$!' && a !== '$?') || o++;
        }
        e = e.nextSibling;
      }
      yg = null;
    }
  } else yg = xg ? Lf(e.stateNode.nextSibling) : null;
  return !0;
}
function Hg() {
  for (var e = yg; e; ) e = Lf(e.nextSibling);
}
function Ig() {
  ((yg = xg = null), (I = !1));
}
function Jg(e) {
  zg === null ? (zg = [e]) : zg.push(e);
}
var Kg = ua.ReactCurrentBatchConfig;
function Lg(e, o, a) {
  if (
    ((e = a.ref), e !== null && typeof e != 'function' && typeof e != 'object')
  ) {
    if (a._owner) {
      if (((a = a._owner), a)) {
        if (a.tag !== 1) throw Error(p(309));
        var s = a.stateNode;
      }
      if (!s) throw Error(p(147, e));
      var i = s,
        c = '' + e;
      return o !== null &&
        o.ref !== null &&
        typeof o.ref == 'function' &&
        o.ref._stringRef === c
        ? o.ref
        : ((o = function (d) {
            var h = i.refs;
            d === null ? delete h[c] : (h[c] = d);
          }),
          (o._stringRef = c),
          o);
    }
    if (typeof e != 'string') throw Error(p(284));
    if (!a._owner) throw Error(p(290, e));
  }
  return e;
}
function Mg(e, o) {
  throw (
    (e = Object.prototype.toString.call(o)),
    Error(
      p(
        31,
        e === '[object Object]'
          ? 'object with keys {' + Object.keys(o).join(', ') + '}'
          : e
      )
    )
  );
}
function Ng(e) {
  var o = e._init;
  return o(e._payload);
}
function Og(e) {
  function o(tt, et) {
    if (e) {
      var rt = tt.deletions;
      rt === null ? ((tt.deletions = [et]), (tt.flags |= 16)) : rt.push(et);
    }
  }
  function a(tt, et) {
    if (!e) return null;
    for (; et !== null; ) (o(tt, et), (et = et.sibling));
    return null;
  }
  function s(tt, et) {
    for (tt = new Map(); et !== null; )
      (et.key !== null ? tt.set(et.key, et) : tt.set(et.index, et),
        (et = et.sibling));
    return tt;
  }
  function i(tt, et) {
    return ((tt = Pg(tt, et)), (tt.index = 0), (tt.sibling = null), tt);
  }
  function c(tt, et, rt) {
    return (
      (tt.index = rt),
      e
        ? ((rt = tt.alternate),
          rt !== null
            ? ((rt = rt.index), rt < et ? ((tt.flags |= 2), et) : rt)
            : ((tt.flags |= 2), et))
        : ((tt.flags |= 1048576), et)
    );
  }
  function d(tt) {
    return (e && tt.alternate === null && (tt.flags |= 2), tt);
  }
  function h(tt, et, rt, at) {
    return et === null || et.tag !== 6
      ? ((et = Qg(rt, tt.mode, at)), (et.return = tt), et)
      : ((et = i(et, rt)), (et.return = tt), et);
  }
  function b(tt, et, rt, at) {
    var ct = rt.type;
    return ct === ya
      ? $(tt, et, rt.props.children, at, rt.key)
      : et !== null &&
          (et.elementType === ct ||
            (typeof ct == 'object' &&
              ct !== null &&
              ct.$$typeof === Ha &&
              Ng(ct) === et.type))
        ? ((at = i(et, rt.props)),
          (at.ref = Lg(tt, et, rt)),
          (at.return = tt),
          at)
        : ((at = Rg(rt.type, rt.key, rt.props, null, tt.mode, at)),
          (at.ref = Lg(tt, et, rt)),
          (at.return = tt),
          at);
  }
  function g(tt, et, rt, at) {
    return et === null ||
      et.tag !== 4 ||
      et.stateNode.containerInfo !== rt.containerInfo ||
      et.stateNode.implementation !== rt.implementation
      ? ((et = Sg(rt, tt.mode, at)), (et.return = tt), et)
      : ((et = i(et, rt.children || [])), (et.return = tt), et);
  }
  function $(tt, et, rt, at, ct) {
    return et === null || et.tag !== 7
      ? ((et = Tg(rt, tt.mode, at, ct)), (et.return = tt), et)
      : ((et = i(et, rt)), (et.return = tt), et);
  }
  function _(tt, et, rt) {
    if ((typeof et == 'string' && et !== '') || typeof et == 'number')
      return ((et = Qg('' + et, tt.mode, rt)), (et.return = tt), et);
    if (typeof et == 'object' && et !== null) {
      switch (et.$$typeof) {
        case va:
          return (
            (rt = Rg(et.type, et.key, et.props, null, tt.mode, rt)),
            (rt.ref = Lg(tt, null, et)),
            (rt.return = tt),
            rt
          );
        case wa:
          return ((et = Sg(et, tt.mode, rt)), (et.return = tt), et);
        case Ha:
          var at = et._init;
          return _(tt, at(et._payload), rt);
      }
      if (eb(et) || Ka(et))
        return ((et = Tg(et, tt.mode, rt, null)), (et.return = tt), et);
      Mg(tt, et);
    }
    return null;
  }
  function _e(tt, et, rt, at) {
    var ct = et !== null ? et.key : null;
    if ((typeof rt == 'string' && rt !== '') || typeof rt == 'number')
      return ct !== null ? null : h(tt, et, '' + rt, at);
    if (typeof rt == 'object' && rt !== null) {
      switch (rt.$$typeof) {
        case va:
          return rt.key === ct ? b(tt, et, rt, at) : null;
        case wa:
          return rt.key === ct ? g(tt, et, rt, at) : null;
        case Ha:
          return ((ct = rt._init), _e(tt, et, ct(rt._payload), at));
      }
      if (eb(rt) || Ka(rt)) return ct !== null ? null : $(tt, et, rt, at, null);
      Mg(tt, rt);
    }
    return null;
  }
  function ot(tt, et, rt, at, ct) {
    if ((typeof at == 'string' && at !== '') || typeof at == 'number')
      return ((tt = tt.get(rt) || null), h(et, tt, '' + at, ct));
    if (typeof at == 'object' && at !== null) {
      switch (at.$$typeof) {
        case va:
          return (
            (tt = tt.get(at.key === null ? rt : at.key) || null),
            b(et, tt, at, ct)
          );
        case wa:
          return (
            (tt = tt.get(at.key === null ? rt : at.key) || null),
            g(et, tt, at, ct)
          );
        case Ha:
          var dt = at._init;
          return ot(tt, et, rt, dt(at._payload), ct);
      }
      if (eb(at) || Ka(at))
        return ((tt = tt.get(rt) || null), $(et, tt, at, ct, null));
      Mg(et, at);
    }
    return null;
  }
  function j(tt, et, rt, at) {
    for (
      var ct = null, dt = null, ut = et, st = (et = 0), gt = null;
      ut !== null && st < rt.length;
      st++
    ) {
      ut.index > st ? ((gt = ut), (ut = null)) : (gt = ut.sibling);
      var yt = _e(tt, ut, rt[st], at);
      if (yt === null) {
        ut === null && (ut = gt);
        break;
      }
      (e && ut && yt.alternate === null && o(tt, ut),
        (et = c(yt, et, st)),
        dt === null ? (ct = yt) : (dt.sibling = yt),
        (dt = yt),
        (ut = gt));
    }
    if (st === rt.length) return (a(tt, ut), I && tg(tt, st), ct);
    if (ut === null) {
      for (; st < rt.length; st++)
        ((ut = _(tt, rt[st], at)),
          ut !== null &&
            ((et = c(ut, et, st)),
            dt === null ? (ct = ut) : (dt.sibling = ut),
            (dt = ut)));
      return (I && tg(tt, st), ct);
    }
    for (ut = s(tt, ut); st < rt.length; st++)
      ((gt = ot(ut, tt, st, rt[st], at)),
        gt !== null &&
          (e &&
            gt.alternate !== null &&
            ut.delete(gt.key === null ? st : gt.key),
          (et = c(gt, et, st)),
          dt === null ? (ct = gt) : (dt.sibling = gt),
          (dt = gt)));
    return (
      e &&
        ut.forEach(function (Ct) {
          return o(tt, Ct);
        }),
      I && tg(tt, st),
      ct
    );
  }
  function nt(tt, et, rt, at) {
    var ct = Ka(rt);
    if (typeof ct != 'function') throw Error(p(150));
    if (((rt = ct.call(rt)), rt == null)) throw Error(p(151));
    for (
      var dt = (ct = null), ut = et, st = (et = 0), gt = null, yt = rt.next();
      ut !== null && !yt.done;
      st++, yt = rt.next()
    ) {
      ut.index > st ? ((gt = ut), (ut = null)) : (gt = ut.sibling);
      var Ct = _e(tt, ut, yt.value, at);
      if (Ct === null) {
        ut === null && (ut = gt);
        break;
      }
      (e && ut && Ct.alternate === null && o(tt, ut),
        (et = c(Ct, et, st)),
        dt === null ? (ct = Ct) : (dt.sibling = Ct),
        (dt = Ct),
        (ut = gt));
    }
    if (yt.done) return (a(tt, ut), I && tg(tt, st), ct);
    if (ut === null) {
      for (; !yt.done; st++, yt = rt.next())
        ((yt = _(tt, yt.value, at)),
          yt !== null &&
            ((et = c(yt, et, st)),
            dt === null ? (ct = yt) : (dt.sibling = yt),
            (dt = yt)));
      return (I && tg(tt, st), ct);
    }
    for (ut = s(tt, ut); !yt.done; st++, yt = rt.next())
      ((yt = ot(ut, tt, st, yt.value, at)),
        yt !== null &&
          (e &&
            yt.alternate !== null &&
            ut.delete(yt.key === null ? st : yt.key),
          (et = c(yt, et, st)),
          dt === null ? (ct = yt) : (dt.sibling = yt),
          (dt = yt)));
    return (
      e &&
        ut.forEach(function (At) {
          return o(tt, At);
        }),
      I && tg(tt, st),
      ct
    );
  }
  function lt(tt, et, rt, at) {
    if (
      (typeof rt == 'object' &&
        rt !== null &&
        rt.type === ya &&
        rt.key === null &&
        (rt = rt.props.children),
      typeof rt == 'object' && rt !== null)
    ) {
      switch (rt.$$typeof) {
        case va:
          e: {
            for (var ct = rt.key, dt = et; dt !== null; ) {
              if (dt.key === ct) {
                if (((ct = rt.type), ct === ya)) {
                  if (dt.tag === 7) {
                    (a(tt, dt.sibling),
                      (et = i(dt, rt.props.children)),
                      (et.return = tt),
                      (tt = et));
                    break e;
                  }
                } else if (
                  dt.elementType === ct ||
                  (typeof ct == 'object' &&
                    ct !== null &&
                    ct.$$typeof === Ha &&
                    Ng(ct) === dt.type)
                ) {
                  (a(tt, dt.sibling),
                    (et = i(dt, rt.props)),
                    (et.ref = Lg(tt, dt, rt)),
                    (et.return = tt),
                    (tt = et));
                  break e;
                }
                a(tt, dt);
                break;
              } else o(tt, dt);
              dt = dt.sibling;
            }
            rt.type === ya
              ? ((et = Tg(rt.props.children, tt.mode, at, rt.key)),
                (et.return = tt),
                (tt = et))
              : ((at = Rg(rt.type, rt.key, rt.props, null, tt.mode, at)),
                (at.ref = Lg(tt, et, rt)),
                (at.return = tt),
                (tt = at));
          }
          return d(tt);
        case wa:
          e: {
            for (dt = rt.key; et !== null; ) {
              if (et.key === dt)
                if (
                  et.tag === 4 &&
                  et.stateNode.containerInfo === rt.containerInfo &&
                  et.stateNode.implementation === rt.implementation
                ) {
                  (a(tt, et.sibling),
                    (et = i(et, rt.children || [])),
                    (et.return = tt),
                    (tt = et));
                  break e;
                } else {
                  a(tt, et);
                  break;
                }
              else o(tt, et);
              et = et.sibling;
            }
            ((et = Sg(rt, tt.mode, at)), (et.return = tt), (tt = et));
          }
          return d(tt);
        case Ha:
          return ((dt = rt._init), lt(tt, et, dt(rt._payload), at));
      }
      if (eb(rt)) return j(tt, et, rt, at);
      if (Ka(rt)) return nt(tt, et, rt, at);
      Mg(tt, rt);
    }
    return (typeof rt == 'string' && rt !== '') || typeof rt == 'number'
      ? ((rt = '' + rt),
        et !== null && et.tag === 6
          ? (a(tt, et.sibling), (et = i(et, rt)), (et.return = tt), (tt = et))
          : (a(tt, et),
            (et = Qg(rt, tt.mode, at)),
            (et.return = tt),
            (tt = et)),
        d(tt))
      : a(tt, et);
  }
  return lt;
}
var Ug = Og(!0),
  Vg = Og(!1),
  Wg = Uf(null),
  Xg = null,
  Yg = null,
  Zg = null;
function $g() {
  Zg = Yg = Xg = null;
}
function ah(e) {
  var o = Wg.current;
  (E(Wg), (e._currentValue = o));
}
function bh(e, o, a) {
  for (; e !== null; ) {
    var s = e.alternate;
    if (
      ((e.childLanes & o) !== o
        ? ((e.childLanes |= o), s !== null && (s.childLanes |= o))
        : s !== null && (s.childLanes & o) !== o && (s.childLanes |= o),
      e === a)
    )
      break;
    e = e.return;
  }
}
function ch(e, o) {
  ((Xg = e),
    (Zg = Yg = null),
    (e = e.dependencies),
    e !== null &&
      e.firstContext !== null &&
      (e.lanes & o && (dh = !0), (e.firstContext = null)));
}
function eh(e) {
  var o = e._currentValue;
  if (Zg !== e)
    if (((e = { context: e, memoizedValue: o, next: null }), Yg === null)) {
      if (Xg === null) throw Error(p(308));
      ((Yg = e), (Xg.dependencies = { lanes: 0, firstContext: e }));
    } else Yg = Yg.next = e;
  return o;
}
var fh = null;
function gh(e) {
  fh === null ? (fh = [e]) : fh.push(e);
}
function hh(e, o, a, s) {
  var i = o.interleaved;
  return (
    i === null ? ((a.next = a), gh(o)) : ((a.next = i.next), (i.next = a)),
    (o.interleaved = a),
    ih(e, s)
  );
}
function ih(e, o) {
  e.lanes |= o;
  var a = e.alternate;
  for (a !== null && (a.lanes |= o), a = e, e = e.return; e !== null; )
    ((e.childLanes |= o),
      (a = e.alternate),
      a !== null && (a.childLanes |= o),
      (a = e),
      (e = e.return));
  return a.tag === 3 ? a.stateNode : null;
}
var jh = !1;
function kh(e) {
  e.updateQueue = {
    baseState: e.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: { pending: null, interleaved: null, lanes: 0 },
    effects: null,
  };
}
function lh(e, o) {
  ((e = e.updateQueue),
    o.updateQueue === e &&
      (o.updateQueue = {
        baseState: e.baseState,
        firstBaseUpdate: e.firstBaseUpdate,
        lastBaseUpdate: e.lastBaseUpdate,
        shared: e.shared,
        effects: e.effects,
      }));
}
function mh(e, o) {
  return {
    eventTime: e,
    lane: o,
    tag: 0,
    payload: null,
    callback: null,
    next: null,
  };
}
function nh(e, o, a) {
  var s = e.updateQueue;
  if (s === null) return null;
  if (((s = s.shared), K & 2)) {
    var i = s.pending;
    return (
      i === null ? (o.next = o) : ((o.next = i.next), (i.next = o)),
      (s.pending = o),
      ih(e, a)
    );
  }
  return (
    (i = s.interleaved),
    i === null ? ((o.next = o), gh(s)) : ((o.next = i.next), (i.next = o)),
    (s.interleaved = o),
    ih(e, a)
  );
}
function oh(e, o, a) {
  if (
    ((o = o.updateQueue), o !== null && ((o = o.shared), (a & 4194240) !== 0))
  ) {
    var s = o.lanes;
    ((s &= e.pendingLanes), (a |= s), (o.lanes = a), Cc(e, a));
  }
}
function ph(e, o) {
  var a = e.updateQueue,
    s = e.alternate;
  if (s !== null && ((s = s.updateQueue), a === s)) {
    var i = null,
      c = null;
    if (((a = a.firstBaseUpdate), a !== null)) {
      do {
        var d = {
          eventTime: a.eventTime,
          lane: a.lane,
          tag: a.tag,
          payload: a.payload,
          callback: a.callback,
          next: null,
        };
        (c === null ? (i = c = d) : (c = c.next = d), (a = a.next));
      } while (a !== null);
      c === null ? (i = c = o) : (c = c.next = o);
    } else i = c = o;
    ((a = {
      baseState: s.baseState,
      firstBaseUpdate: i,
      lastBaseUpdate: c,
      shared: s.shared,
      effects: s.effects,
    }),
      (e.updateQueue = a));
    return;
  }
  ((e = a.lastBaseUpdate),
    e === null ? (a.firstBaseUpdate = o) : (e.next = o),
    (a.lastBaseUpdate = o));
}
function qh(e, o, a, s) {
  var i = e.updateQueue;
  jh = !1;
  var c = i.firstBaseUpdate,
    d = i.lastBaseUpdate,
    h = i.shared.pending;
  if (h !== null) {
    i.shared.pending = null;
    var b = h,
      g = b.next;
    ((b.next = null), d === null ? (c = g) : (d.next = g), (d = b));
    var $ = e.alternate;
    $ !== null &&
      (($ = $.updateQueue),
      (h = $.lastBaseUpdate),
      h !== d &&
        (h === null ? ($.firstBaseUpdate = g) : (h.next = g),
        ($.lastBaseUpdate = b)));
  }
  if (c !== null) {
    var _ = i.baseState;
    ((d = 0), ($ = g = b = null), (h = c));
    do {
      var _e = h.lane,
        ot = h.eventTime;
      if ((s & _e) === _e) {
        $ !== null &&
          ($ = $.next =
            {
              eventTime: ot,
              lane: 0,
              tag: h.tag,
              payload: h.payload,
              callback: h.callback,
              next: null,
            });
        e: {
          var j = e,
            nt = h;
          switch (((_e = o), (ot = a), nt.tag)) {
            case 1:
              if (((j = nt.payload), typeof j == 'function')) {
                _ = j.call(ot, _, _e);
                break e;
              }
              _ = j;
              break e;
            case 3:
              j.flags = (j.flags & -65537) | 128;
            case 0:
              if (
                ((j = nt.payload),
                (_e = typeof j == 'function' ? j.call(ot, _, _e) : j),
                _e == null)
              )
                break e;
              _ = A({}, _, _e);
              break e;
            case 2:
              jh = !0;
          }
        }
        h.callback !== null &&
          h.lane !== 0 &&
          ((e.flags |= 64),
          (_e = i.effects),
          _e === null ? (i.effects = [h]) : _e.push(h));
      } else
        ((ot = {
          eventTime: ot,
          lane: _e,
          tag: h.tag,
          payload: h.payload,
          callback: h.callback,
          next: null,
        }),
          $ === null ? ((g = $ = ot), (b = _)) : ($ = $.next = ot),
          (d |= _e));
      if (((h = h.next), h === null)) {
        if (((h = i.shared.pending), h === null)) break;
        ((_e = h),
          (h = _e.next),
          (_e.next = null),
          (i.lastBaseUpdate = _e),
          (i.shared.pending = null));
      }
    } while (1);
    if (
      ($ === null && (b = _),
      (i.baseState = b),
      (i.firstBaseUpdate = g),
      (i.lastBaseUpdate = $),
      (o = i.shared.interleaved),
      o !== null)
    ) {
      i = o;
      do ((d |= i.lane), (i = i.next));
      while (i !== o);
    } else c === null && (i.shared.lanes = 0);
    ((rh |= d), (e.lanes = d), (e.memoizedState = _));
  }
}
function sh(e, o, a) {
  if (((e = o.effects), (o.effects = null), e !== null))
    for (o = 0; o < e.length; o++) {
      var s = e[o],
        i = s.callback;
      if (i !== null) {
        if (((s.callback = null), (s = a), typeof i != 'function'))
          throw Error(p(191, i));
        i.call(s);
      }
    }
}
var th = {},
  uh = Uf(th),
  vh = Uf(th),
  wh = Uf(th);
function xh(e) {
  if (e === th) throw Error(p(174));
  return e;
}
function yh(e, o) {
  switch ((G(wh, o), G(vh, e), G(uh, th), (e = o.nodeType), e)) {
    case 9:
    case 11:
      o = (o = o.documentElement) ? o.namespaceURI : lb(null, '');
      break;
    default:
      ((e = e === 8 ? o.parentNode : o),
        (o = e.namespaceURI || null),
        (e = e.tagName),
        (o = lb(o, e)));
  }
  (E(uh), G(uh, o));
}
function zh() {
  (E(uh), E(vh), E(wh));
}
function Ah(e) {
  xh(wh.current);
  var o = xh(uh.current),
    a = lb(o, e.type);
  o !== a && (G(vh, e), G(uh, a));
}
function Bh(e) {
  vh.current === e && (E(uh), E(vh));
}
var L = Uf(0);
function Ch(e) {
  for (var o = e; o !== null; ) {
    if (o.tag === 13) {
      var a = o.memoizedState;
      if (
        a !== null &&
        ((a = a.dehydrated), a === null || a.data === '$?' || a.data === '$!')
      )
        return o;
    } else if (o.tag === 19 && o.memoizedProps.revealOrder !== void 0) {
      if (o.flags & 128) return o;
    } else if (o.child !== null) {
      ((o.child.return = o), (o = o.child));
      continue;
    }
    if (o === e) break;
    for (; o.sibling === null; ) {
      if (o.return === null || o.return === e) return null;
      o = o.return;
    }
    ((o.sibling.return = o.return), (o = o.sibling));
  }
  return null;
}
var Dh = [];
function Eh() {
  for (var e = 0; e < Dh.length; e++)
    Dh[e]._workInProgressVersionPrimary = null;
  Dh.length = 0;
}
var Fh = ua.ReactCurrentDispatcher,
  Gh = ua.ReactCurrentBatchConfig,
  Hh = 0,
  M = null,
  N = null,
  O = null,
  Ih = !1,
  Jh = !1,
  Kh = 0,
  Lh = 0;
function P() {
  throw Error(p(321));
}
function Mh(e, o) {
  if (o === null) return !1;
  for (var a = 0; a < o.length && a < e.length; a++)
    if (!He(e[a], o[a])) return !1;
  return !0;
}
function Nh(e, o, a, s, i, c) {
  if (
    ((Hh = c),
    (M = o),
    (o.memoizedState = null),
    (o.updateQueue = null),
    (o.lanes = 0),
    (Fh.current = e === null || e.memoizedState === null ? Oh : Ph),
    (e = a(s, i)),
    Jh)
  ) {
    c = 0;
    do {
      if (((Jh = !1), (Kh = 0), 25 <= c)) throw Error(p(301));
      ((c += 1),
        (O = N = null),
        (o.updateQueue = null),
        (Fh.current = Qh),
        (e = a(s, i)));
    } while (Jh);
  }
  if (
    ((Fh.current = Rh),
    (o = N !== null && N.next !== null),
    (Hh = 0),
    (O = N = M = null),
    (Ih = !1),
    o)
  )
    throw Error(p(300));
  return e;
}
function Sh() {
  var e = Kh !== 0;
  return ((Kh = 0), e);
}
function Th() {
  var e = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };
  return (O === null ? (M.memoizedState = O = e) : (O = O.next = e), O);
}
function Uh() {
  if (N === null) {
    var e = M.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = N.next;
  var o = O === null ? M.memoizedState : O.next;
  if (o !== null) ((O = o), (N = e));
  else {
    if (e === null) throw Error(p(310));
    ((N = e),
      (e = {
        memoizedState: N.memoizedState,
        baseState: N.baseState,
        baseQueue: N.baseQueue,
        queue: N.queue,
        next: null,
      }),
      O === null ? (M.memoizedState = O = e) : (O = O.next = e));
  }
  return O;
}
function Vh(e, o) {
  return typeof o == 'function' ? o(e) : o;
}
function Wh(e) {
  var o = Uh(),
    a = o.queue;
  if (a === null) throw Error(p(311));
  a.lastRenderedReducer = e;
  var s = N,
    i = s.baseQueue,
    c = a.pending;
  if (c !== null) {
    if (i !== null) {
      var d = i.next;
      ((i.next = c.next), (c.next = d));
    }
    ((s.baseQueue = i = c), (a.pending = null));
  }
  if (i !== null) {
    ((c = i.next), (s = s.baseState));
    var h = (d = null),
      b = null,
      g = c;
    do {
      var $ = g.lane;
      if ((Hh & $) === $)
        (b !== null &&
          (b = b.next =
            {
              lane: 0,
              action: g.action,
              hasEagerState: g.hasEagerState,
              eagerState: g.eagerState,
              next: null,
            }),
          (s = g.hasEagerState ? g.eagerState : e(s, g.action)));
      else {
        var _ = {
          lane: $,
          action: g.action,
          hasEagerState: g.hasEagerState,
          eagerState: g.eagerState,
          next: null,
        };
        (b === null ? ((h = b = _), (d = s)) : (b = b.next = _),
          (M.lanes |= $),
          (rh |= $));
      }
      g = g.next;
    } while (g !== null && g !== c);
    (b === null ? (d = s) : (b.next = h),
      He(s, o.memoizedState) || (dh = !0),
      (o.memoizedState = s),
      (o.baseState = d),
      (o.baseQueue = b),
      (a.lastRenderedState = s));
  }
  if (((e = a.interleaved), e !== null)) {
    i = e;
    do ((c = i.lane), (M.lanes |= c), (rh |= c), (i = i.next));
    while (i !== e);
  } else i === null && (a.lanes = 0);
  return [o.memoizedState, a.dispatch];
}
function Xh(e) {
  var o = Uh(),
    a = o.queue;
  if (a === null) throw Error(p(311));
  a.lastRenderedReducer = e;
  var s = a.dispatch,
    i = a.pending,
    c = o.memoizedState;
  if (i !== null) {
    a.pending = null;
    var d = (i = i.next);
    do ((c = e(c, d.action)), (d = d.next));
    while (d !== i);
    (He(c, o.memoizedState) || (dh = !0),
      (o.memoizedState = c),
      o.baseQueue === null && (o.baseState = c),
      (a.lastRenderedState = c));
  }
  return [c, s];
}
function Yh() {}
function Zh(e, o) {
  var a = M,
    s = Uh(),
    i = o(),
    c = !He(s.memoizedState, i);
  if (
    (c && ((s.memoizedState = i), (dh = !0)),
    (s = s.queue),
    $h(ai.bind(null, a, s, e), [e]),
    s.getSnapshot !== o || c || (O !== null && O.memoizedState.tag & 1))
  ) {
    if (
      ((a.flags |= 2048),
      bi(9, ci.bind(null, a, s, i, o), void 0, null),
      Q === null)
    )
      throw Error(p(349));
    Hh & 30 || di(a, o, i);
  }
  return i;
}
function di(e, o, a) {
  ((e.flags |= 16384),
    (e = { getSnapshot: o, value: a }),
    (o = M.updateQueue),
    o === null
      ? ((o = { lastEffect: null, stores: null }),
        (M.updateQueue = o),
        (o.stores = [e]))
      : ((a = o.stores), a === null ? (o.stores = [e]) : a.push(e)));
}
function ci(e, o, a, s) {
  ((o.value = a), (o.getSnapshot = s), ei(o) && fi(e));
}
function ai(e, o, a) {
  return a(function () {
    ei(o) && fi(e);
  });
}
function ei(e) {
  var o = e.getSnapshot;
  e = e.value;
  try {
    var a = o();
    return !He(e, a);
  } catch {
    return !0;
  }
}
function fi(e) {
  var o = ih(e, 1);
  o !== null && gi(o, e, 1, -1);
}
function hi(e) {
  var o = Th();
  return (
    typeof e == 'function' && (e = e()),
    (o.memoizedState = o.baseState = e),
    (e = {
      pending: null,
      interleaved: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Vh,
      lastRenderedState: e,
    }),
    (o.queue = e),
    (e = e.dispatch = ii.bind(null, M, e)),
    [o.memoizedState, e]
  );
}
function bi(e, o, a, s) {
  return (
    (e = { tag: e, create: o, destroy: a, deps: s, next: null }),
    (o = M.updateQueue),
    o === null
      ? ((o = { lastEffect: null, stores: null }),
        (M.updateQueue = o),
        (o.lastEffect = e.next = e))
      : ((a = o.lastEffect),
        a === null
          ? (o.lastEffect = e.next = e)
          : ((s = a.next), (a.next = e), (e.next = s), (o.lastEffect = e))),
    e
  );
}
function ji() {
  return Uh().memoizedState;
}
function ki(e, o, a, s) {
  var i = Th();
  ((M.flags |= e),
    (i.memoizedState = bi(1 | o, a, void 0, s === void 0 ? null : s)));
}
function li(e, o, a, s) {
  var i = Uh();
  s = s === void 0 ? null : s;
  var c = void 0;
  if (N !== null) {
    var d = N.memoizedState;
    if (((c = d.destroy), s !== null && Mh(s, d.deps))) {
      i.memoizedState = bi(o, a, c, s);
      return;
    }
  }
  ((M.flags |= e), (i.memoizedState = bi(1 | o, a, c, s)));
}
function mi(e, o) {
  return ki(8390656, 8, e, o);
}
function $h(e, o) {
  return li(2048, 8, e, o);
}
function ni(e, o) {
  return li(4, 2, e, o);
}
function oi(e, o) {
  return li(4, 4, e, o);
}
function pi(e, o) {
  if (typeof o == 'function')
    return (
      (e = e()),
      o(e),
      function () {
        o(null);
      }
    );
  if (o != null)
    return (
      (e = e()),
      (o.current = e),
      function () {
        o.current = null;
      }
    );
}
function qi(e, o, a) {
  return (
    (a = a != null ? a.concat([e]) : null),
    li(4, 4, pi.bind(null, o, e), a)
  );
}
function ri() {}
function si(e, o) {
  var a = Uh();
  o = o === void 0 ? null : o;
  var s = a.memoizedState;
  return s !== null && o !== null && Mh(o, s[1])
    ? s[0]
    : ((a.memoizedState = [e, o]), e);
}
function ti(e, o) {
  var a = Uh();
  o = o === void 0 ? null : o;
  var s = a.memoizedState;
  return s !== null && o !== null && Mh(o, s[1])
    ? s[0]
    : ((e = e()), (a.memoizedState = [e, o]), e);
}
function ui(e, o, a) {
  return Hh & 21
    ? (He(a, o) || ((a = yc()), (M.lanes |= a), (rh |= a), (e.baseState = !0)),
      o)
    : (e.baseState && ((e.baseState = !1), (dh = !0)), (e.memoizedState = a));
}
function vi(e, o) {
  var a = C;
  ((C = a !== 0 && 4 > a ? a : 4), e(!0));
  var s = Gh.transition;
  Gh.transition = {};
  try {
    (e(!1), o());
  } finally {
    ((C = a), (Gh.transition = s));
  }
}
function wi() {
  return Uh().memoizedState;
}
function xi(e, o, a) {
  var s = yi(e);
  if (
    ((a = {
      lane: s,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
    zi(e))
  )
    Ai(o, a);
  else if (((a = hh(e, o, a, s)), a !== null)) {
    var i = R();
    (gi(a, e, s, i), Bi(a, o, s));
  }
}
function ii(e, o, a) {
  var s = yi(e),
    i = { lane: s, action: a, hasEagerState: !1, eagerState: null, next: null };
  if (zi(e)) Ai(o, i);
  else {
    var c = e.alternate;
    if (
      e.lanes === 0 &&
      (c === null || c.lanes === 0) &&
      ((c = o.lastRenderedReducer), c !== null)
    )
      try {
        var d = o.lastRenderedState,
          h = c(d, a);
        if (((i.hasEagerState = !0), (i.eagerState = h), He(h, d))) {
          var b = o.interleaved;
          (b === null
            ? ((i.next = i), gh(o))
            : ((i.next = b.next), (b.next = i)),
            (o.interleaved = i));
          return;
        }
      } catch {
      } finally {
      }
    ((a = hh(e, o, i, s)),
      a !== null && ((i = R()), gi(a, e, s, i), Bi(a, o, s)));
  }
}
function zi(e) {
  var o = e.alternate;
  return e === M || (o !== null && o === M);
}
function Ai(e, o) {
  Jh = Ih = !0;
  var a = e.pending;
  (a === null ? (o.next = o) : ((o.next = a.next), (a.next = o)),
    (e.pending = o));
}
function Bi(e, o, a) {
  if (a & 4194240) {
    var s = o.lanes;
    ((s &= e.pendingLanes), (a |= s), (o.lanes = a), Cc(e, a));
  }
}
var Rh = {
    readContext: eh,
    useCallback: P,
    useContext: P,
    useEffect: P,
    useImperativeHandle: P,
    useInsertionEffect: P,
    useLayoutEffect: P,
    useMemo: P,
    useReducer: P,
    useRef: P,
    useState: P,
    useDebugValue: P,
    useDeferredValue: P,
    useTransition: P,
    useMutableSource: P,
    useSyncExternalStore: P,
    useId: P,
    unstable_isNewReconciler: !1,
  },
  Oh = {
    readContext: eh,
    useCallback: function (e, o) {
      return ((Th().memoizedState = [e, o === void 0 ? null : o]), e);
    },
    useContext: eh,
    useEffect: mi,
    useImperativeHandle: function (e, o, a) {
      return (
        (a = a != null ? a.concat([e]) : null),
        ki(4194308, 4, pi.bind(null, o, e), a)
      );
    },
    useLayoutEffect: function (e, o) {
      return ki(4194308, 4, e, o);
    },
    useInsertionEffect: function (e, o) {
      return ki(4, 2, e, o);
    },
    useMemo: function (e, o) {
      var a = Th();
      return (
        (o = o === void 0 ? null : o),
        (e = e()),
        (a.memoizedState = [e, o]),
        e
      );
    },
    useReducer: function (e, o, a) {
      var s = Th();
      return (
        (o = a !== void 0 ? a(o) : o),
        (s.memoizedState = s.baseState = o),
        (e = {
          pending: null,
          interleaved: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: e,
          lastRenderedState: o,
        }),
        (s.queue = e),
        (e = e.dispatch = xi.bind(null, M, e)),
        [s.memoizedState, e]
      );
    },
    useRef: function (e) {
      var o = Th();
      return ((e = { current: e }), (o.memoizedState = e));
    },
    useState: hi,
    useDebugValue: ri,
    useDeferredValue: function (e) {
      return (Th().memoizedState = e);
    },
    useTransition: function () {
      var e = hi(!1),
        o = e[0];
      return ((e = vi.bind(null, e[1])), (Th().memoizedState = e), [o, e]);
    },
    useMutableSource: function () {},
    useSyncExternalStore: function (e, o, a) {
      var s = M,
        i = Th();
      if (I) {
        if (a === void 0) throw Error(p(407));
        a = a();
      } else {
        if (((a = o()), Q === null)) throw Error(p(349));
        Hh & 30 || di(s, o, a);
      }
      i.memoizedState = a;
      var c = { value: a, getSnapshot: o };
      return (
        (i.queue = c),
        mi(ai.bind(null, s, c, e), [e]),
        (s.flags |= 2048),
        bi(9, ci.bind(null, s, c, a, o), void 0, null),
        a
      );
    },
    useId: function () {
      var e = Th(),
        o = Q.identifierPrefix;
      if (I) {
        var a = sg,
          s = rg;
        ((a = (s & ~(1 << (32 - oc(s) - 1))).toString(32) + a),
          (o = ':' + o + 'R' + a),
          (a = Kh++),
          0 < a && (o += 'H' + a.toString(32)),
          (o += ':'));
      } else ((a = Lh++), (o = ':' + o + 'r' + a.toString(32) + ':'));
      return (e.memoizedState = o);
    },
    unstable_isNewReconciler: !1,
  },
  Ph = {
    readContext: eh,
    useCallback: si,
    useContext: eh,
    useEffect: $h,
    useImperativeHandle: qi,
    useInsertionEffect: ni,
    useLayoutEffect: oi,
    useMemo: ti,
    useReducer: Wh,
    useRef: ji,
    useState: function () {
      return Wh(Vh);
    },
    useDebugValue: ri,
    useDeferredValue: function (e) {
      var o = Uh();
      return ui(o, N.memoizedState, e);
    },
    useTransition: function () {
      var e = Wh(Vh)[0],
        o = Uh().memoizedState;
      return [e, o];
    },
    useMutableSource: Yh,
    useSyncExternalStore: Zh,
    useId: wi,
    unstable_isNewReconciler: !1,
  },
  Qh = {
    readContext: eh,
    useCallback: si,
    useContext: eh,
    useEffect: $h,
    useImperativeHandle: qi,
    useInsertionEffect: ni,
    useLayoutEffect: oi,
    useMemo: ti,
    useReducer: Xh,
    useRef: ji,
    useState: function () {
      return Xh(Vh);
    },
    useDebugValue: ri,
    useDeferredValue: function (e) {
      var o = Uh();
      return N === null ? (o.memoizedState = e) : ui(o, N.memoizedState, e);
    },
    useTransition: function () {
      var e = Xh(Vh)[0],
        o = Uh().memoizedState;
      return [e, o];
    },
    useMutableSource: Yh,
    useSyncExternalStore: Zh,
    useId: wi,
    unstable_isNewReconciler: !1,
  };
function Ci(e, o) {
  if (e && e.defaultProps) {
    ((o = A({}, o)), (e = e.defaultProps));
    for (var a in e) o[a] === void 0 && (o[a] = e[a]);
    return o;
  }
  return o;
}
function Di(e, o, a, s) {
  ((o = e.memoizedState),
    (a = a(s, o)),
    (a = a == null ? o : A({}, o, a)),
    (e.memoizedState = a),
    e.lanes === 0 && (e.updateQueue.baseState = a));
}
var Ei = {
  isMounted: function (e) {
    return (e = e._reactInternals) ? Vb(e) === e : !1;
  },
  enqueueSetState: function (e, o, a) {
    e = e._reactInternals;
    var s = R(),
      i = yi(e),
      c = mh(s, i);
    ((c.payload = o),
      a != null && (c.callback = a),
      (o = nh(e, c, i)),
      o !== null && (gi(o, e, i, s), oh(o, e, i)));
  },
  enqueueReplaceState: function (e, o, a) {
    e = e._reactInternals;
    var s = R(),
      i = yi(e),
      c = mh(s, i);
    ((c.tag = 1),
      (c.payload = o),
      a != null && (c.callback = a),
      (o = nh(e, c, i)),
      o !== null && (gi(o, e, i, s), oh(o, e, i)));
  },
  enqueueForceUpdate: function (e, o) {
    e = e._reactInternals;
    var a = R(),
      s = yi(e),
      i = mh(a, s);
    ((i.tag = 2),
      o != null && (i.callback = o),
      (o = nh(e, i, s)),
      o !== null && (gi(o, e, s, a), oh(o, e, s)));
  },
};
function Fi(e, o, a, s, i, c, d) {
  return (
    (e = e.stateNode),
    typeof e.shouldComponentUpdate == 'function'
      ? e.shouldComponentUpdate(s, c, d)
      : o.prototype && o.prototype.isPureReactComponent
        ? !Ie(a, s) || !Ie(i, c)
        : !0
  );
}
function Gi(e, o, a) {
  var s = !1,
    i = Vf,
    c = o.contextType;
  return (
    typeof c == 'object' && c !== null
      ? (c = eh(c))
      : ((i = Zf(o) ? Xf : H.current),
        (s = o.contextTypes),
        (c = (s = s != null) ? Yf(e, i) : Vf)),
    (o = new o(a, c)),
    (e.memoizedState = o.state !== null && o.state !== void 0 ? o.state : null),
    (o.updater = Ei),
    (e.stateNode = o),
    (o._reactInternals = e),
    s &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = i),
      (e.__reactInternalMemoizedMaskedChildContext = c)),
    o
  );
}
function Hi(e, o, a, s) {
  ((e = o.state),
    typeof o.componentWillReceiveProps == 'function' &&
      o.componentWillReceiveProps(a, s),
    typeof o.UNSAFE_componentWillReceiveProps == 'function' &&
      o.UNSAFE_componentWillReceiveProps(a, s),
    o.state !== e && Ei.enqueueReplaceState(o, o.state, null));
}
function Ii(e, o, a, s) {
  var i = e.stateNode;
  ((i.props = a), (i.state = e.memoizedState), (i.refs = {}), kh(e));
  var c = o.contextType;
  (typeof c == 'object' && c !== null
    ? (i.context = eh(c))
    : ((c = Zf(o) ? Xf : H.current), (i.context = Yf(e, c))),
    (i.state = e.memoizedState),
    (c = o.getDerivedStateFromProps),
    typeof c == 'function' && (Di(e, o, c, a), (i.state = e.memoizedState)),
    typeof o.getDerivedStateFromProps == 'function' ||
      typeof i.getSnapshotBeforeUpdate == 'function' ||
      (typeof i.UNSAFE_componentWillMount != 'function' &&
        typeof i.componentWillMount != 'function') ||
      ((o = i.state),
      typeof i.componentWillMount == 'function' && i.componentWillMount(),
      typeof i.UNSAFE_componentWillMount == 'function' &&
        i.UNSAFE_componentWillMount(),
      o !== i.state && Ei.enqueueReplaceState(i, i.state, null),
      qh(e, a, i, s),
      (i.state = e.memoizedState)),
    typeof i.componentDidMount == 'function' && (e.flags |= 4194308));
}
function Ji(e, o) {
  try {
    var a = '',
      s = o;
    do ((a += Pa(s)), (s = s.return));
    while (s);
    var i = a;
  } catch (c) {
    i =
      `
Error generating stack: ` +
      c.message +
      `
` +
      c.stack;
  }
  return { value: e, source: o, stack: i, digest: null };
}
function Ki(e, o, a) {
  return { value: e, source: null, stack: a ?? null, digest: o ?? null };
}
function Li(e, o) {
  try {
    console.error(o.value);
  } catch (a) {
    setTimeout(function () {
      throw a;
    });
  }
}
var Mi = typeof WeakMap == 'function' ? WeakMap : Map;
function Ni(e, o, a) {
  ((a = mh(-1, a)), (a.tag = 3), (a.payload = { element: null }));
  var s = o.value;
  return (
    (a.callback = function () {
      (Oi || ((Oi = !0), (Pi = s)), Li(e, o));
    }),
    a
  );
}
function Qi(e, o, a) {
  ((a = mh(-1, a)), (a.tag = 3));
  var s = e.type.getDerivedStateFromError;
  if (typeof s == 'function') {
    var i = o.value;
    ((a.payload = function () {
      return s(i);
    }),
      (a.callback = function () {
        Li(e, o);
      }));
  }
  var c = e.stateNode;
  return (
    c !== null &&
      typeof c.componentDidCatch == 'function' &&
      (a.callback = function () {
        (Li(e, o),
          typeof s != 'function' &&
            (Ri === null ? (Ri = new Set([this])) : Ri.add(this)));
        var d = o.stack;
        this.componentDidCatch(o.value, {
          componentStack: d !== null ? d : '',
        });
      }),
    a
  );
}
function Si(e, o, a) {
  var s = e.pingCache;
  if (s === null) {
    s = e.pingCache = new Mi();
    var i = new Set();
    s.set(o, i);
  } else ((i = s.get(o)), i === void 0 && ((i = new Set()), s.set(o, i)));
  i.has(a) || (i.add(a), (e = Ti.bind(null, e, o, a)), o.then(e, e));
}
function Ui(e) {
  do {
    var o;
    if (
      ((o = e.tag === 13) &&
        ((o = e.memoizedState), (o = o !== null ? o.dehydrated !== null : !0)),
      o)
    )
      return e;
    e = e.return;
  } while (e !== null);
  return null;
}
function Vi(e, o, a, s, i) {
  return e.mode & 1
    ? ((e.flags |= 65536), (e.lanes = i), e)
    : (e === o
        ? (e.flags |= 65536)
        : ((e.flags |= 128),
          (a.flags |= 131072),
          (a.flags &= -52805),
          a.tag === 1 &&
            (a.alternate === null
              ? (a.tag = 17)
              : ((o = mh(-1, 1)), (o.tag = 2), nh(a, o, 1))),
          (a.lanes |= 1)),
      e);
}
var Wi = ua.ReactCurrentOwner,
  dh = !1;
function Xi(e, o, a, s) {
  o.child = e === null ? Vg(o, null, a, s) : Ug(o, e.child, a, s);
}
function Yi(e, o, a, s, i) {
  a = a.render;
  var c = o.ref;
  return (
    ch(o, i),
    (s = Nh(e, o, a, s, c, i)),
    (a = Sh()),
    e !== null && !dh
      ? ((o.updateQueue = e.updateQueue),
        (o.flags &= -2053),
        (e.lanes &= ~i),
        Zi(e, o, i))
      : (I && a && vg(o), (o.flags |= 1), Xi(e, o, s, i), o.child)
  );
}
function $i(e, o, a, s, i) {
  if (e === null) {
    var c = a.type;
    return typeof c == 'function' &&
      !aj(c) &&
      c.defaultProps === void 0 &&
      a.compare === null &&
      a.defaultProps === void 0
      ? ((o.tag = 15), (o.type = c), bj(e, o, c, s, i))
      : ((e = Rg(a.type, null, s, o, o.mode, i)),
        (e.ref = o.ref),
        (e.return = o),
        (o.child = e));
  }
  if (((c = e.child), !(e.lanes & i))) {
    var d = c.memoizedProps;
    if (
      ((a = a.compare), (a = a !== null ? a : Ie), a(d, s) && e.ref === o.ref)
    )
      return Zi(e, o, i);
  }
  return (
    (o.flags |= 1),
    (e = Pg(c, s)),
    (e.ref = o.ref),
    (e.return = o),
    (o.child = e)
  );
}
function bj(e, o, a, s, i) {
  if (e !== null) {
    var c = e.memoizedProps;
    if (Ie(c, s) && e.ref === o.ref)
      if (((dh = !1), (o.pendingProps = s = c), (e.lanes & i) !== 0))
        e.flags & 131072 && (dh = !0);
      else return ((o.lanes = e.lanes), Zi(e, o, i));
  }
  return cj(e, o, a, s, i);
}
function dj(e, o, a) {
  var s = o.pendingProps,
    i = s.children,
    c = e !== null ? e.memoizedState : null;
  if (s.mode === 'hidden')
    if (!(o.mode & 1))
      ((o.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        G(ej, fj),
        (fj |= a));
    else {
      if (!(a & 1073741824))
        return (
          (e = c !== null ? c.baseLanes | a : a),
          (o.lanes = o.childLanes = 1073741824),
          (o.memoizedState = {
            baseLanes: e,
            cachePool: null,
            transitions: null,
          }),
          (o.updateQueue = null),
          G(ej, fj),
          (fj |= e),
          null
        );
      ((o.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        (s = c !== null ? c.baseLanes : a),
        G(ej, fj),
        (fj |= s));
    }
  else
    (c !== null ? ((s = c.baseLanes | a), (o.memoizedState = null)) : (s = a),
      G(ej, fj),
      (fj |= s));
  return (Xi(e, o, i, a), o.child);
}
function gj(e, o) {
  var a = o.ref;
  ((e === null && a !== null) || (e !== null && e.ref !== a)) &&
    ((o.flags |= 512), (o.flags |= 2097152));
}
function cj(e, o, a, s, i) {
  var c = Zf(a) ? Xf : H.current;
  return (
    (c = Yf(o, c)),
    ch(o, i),
    (a = Nh(e, o, a, s, c, i)),
    (s = Sh()),
    e !== null && !dh
      ? ((o.updateQueue = e.updateQueue),
        (o.flags &= -2053),
        (e.lanes &= ~i),
        Zi(e, o, i))
      : (I && s && vg(o), (o.flags |= 1), Xi(e, o, a, i), o.child)
  );
}
function hj(e, o, a, s, i) {
  if (Zf(a)) {
    var c = !0;
    cg(o);
  } else c = !1;
  if ((ch(o, i), o.stateNode === null))
    (ij(e, o), Gi(o, a, s), Ii(o, a, s, i), (s = !0));
  else if (e === null) {
    var d = o.stateNode,
      h = o.memoizedProps;
    d.props = h;
    var b = d.context,
      g = a.contextType;
    typeof g == 'object' && g !== null
      ? (g = eh(g))
      : ((g = Zf(a) ? Xf : H.current), (g = Yf(o, g)));
    var $ = a.getDerivedStateFromProps,
      _ =
        typeof $ == 'function' ||
        typeof d.getSnapshotBeforeUpdate == 'function';
    (_ ||
      (typeof d.UNSAFE_componentWillReceiveProps != 'function' &&
        typeof d.componentWillReceiveProps != 'function') ||
      ((h !== s || b !== g) && Hi(o, d, s, g)),
      (jh = !1));
    var _e = o.memoizedState;
    ((d.state = _e),
      qh(o, s, d, i),
      (b = o.memoizedState),
      h !== s || _e !== b || Wf.current || jh
        ? (typeof $ == 'function' && (Di(o, a, $, s), (b = o.memoizedState)),
          (h = jh || Fi(o, a, h, s, _e, b, g))
            ? (_ ||
                (typeof d.UNSAFE_componentWillMount != 'function' &&
                  typeof d.componentWillMount != 'function') ||
                (typeof d.componentWillMount == 'function' &&
                  d.componentWillMount(),
                typeof d.UNSAFE_componentWillMount == 'function' &&
                  d.UNSAFE_componentWillMount()),
              typeof d.componentDidMount == 'function' && (o.flags |= 4194308))
            : (typeof d.componentDidMount == 'function' && (o.flags |= 4194308),
              (o.memoizedProps = s),
              (o.memoizedState = b)),
          (d.props = s),
          (d.state = b),
          (d.context = g),
          (s = h))
        : (typeof d.componentDidMount == 'function' && (o.flags |= 4194308),
          (s = !1)));
  } else {
    ((d = o.stateNode),
      lh(e, o),
      (h = o.memoizedProps),
      (g = o.type === o.elementType ? h : Ci(o.type, h)),
      (d.props = g),
      (_ = o.pendingProps),
      (_e = d.context),
      (b = a.contextType),
      typeof b == 'object' && b !== null
        ? (b = eh(b))
        : ((b = Zf(a) ? Xf : H.current), (b = Yf(o, b))));
    var ot = a.getDerivedStateFromProps;
    (($ =
      typeof ot == 'function' ||
      typeof d.getSnapshotBeforeUpdate == 'function') ||
      (typeof d.UNSAFE_componentWillReceiveProps != 'function' &&
        typeof d.componentWillReceiveProps != 'function') ||
      ((h !== _ || _e !== b) && Hi(o, d, s, b)),
      (jh = !1),
      (_e = o.memoizedState),
      (d.state = _e),
      qh(o, s, d, i));
    var j = o.memoizedState;
    h !== _ || _e !== j || Wf.current || jh
      ? (typeof ot == 'function' && (Di(o, a, ot, s), (j = o.memoizedState)),
        (g = jh || Fi(o, a, g, s, _e, j, b) || !1)
          ? ($ ||
              (typeof d.UNSAFE_componentWillUpdate != 'function' &&
                typeof d.componentWillUpdate != 'function') ||
              (typeof d.componentWillUpdate == 'function' &&
                d.componentWillUpdate(s, j, b),
              typeof d.UNSAFE_componentWillUpdate == 'function' &&
                d.UNSAFE_componentWillUpdate(s, j, b)),
            typeof d.componentDidUpdate == 'function' && (o.flags |= 4),
            typeof d.getSnapshotBeforeUpdate == 'function' && (o.flags |= 1024))
          : (typeof d.componentDidUpdate != 'function' ||
              (h === e.memoizedProps && _e === e.memoizedState) ||
              (o.flags |= 4),
            typeof d.getSnapshotBeforeUpdate != 'function' ||
              (h === e.memoizedProps && _e === e.memoizedState) ||
              (o.flags |= 1024),
            (o.memoizedProps = s),
            (o.memoizedState = j)),
        (d.props = s),
        (d.state = j),
        (d.context = b),
        (s = g))
      : (typeof d.componentDidUpdate != 'function' ||
          (h === e.memoizedProps && _e === e.memoizedState) ||
          (o.flags |= 4),
        typeof d.getSnapshotBeforeUpdate != 'function' ||
          (h === e.memoizedProps && _e === e.memoizedState) ||
          (o.flags |= 1024),
        (s = !1));
  }
  return jj(e, o, a, s, c, i);
}
function jj(e, o, a, s, i, c) {
  gj(e, o);
  var d = (o.flags & 128) !== 0;
  if (!s && !d) return (i && dg(o, a, !1), Zi(e, o, c));
  ((s = o.stateNode), (Wi.current = o));
  var h =
    d && typeof a.getDerivedStateFromError != 'function' ? null : s.render();
  return (
    (o.flags |= 1),
    e !== null && d
      ? ((o.child = Ug(o, e.child, null, c)), (o.child = Ug(o, null, h, c)))
      : Xi(e, o, h, c),
    (o.memoizedState = s.state),
    i && dg(o, a, !0),
    o.child
  );
}
function kj(e) {
  var o = e.stateNode;
  (o.pendingContext
    ? ag(e, o.pendingContext, o.pendingContext !== o.context)
    : o.context && ag(e, o.context, !1),
    yh(e, o.containerInfo));
}
function lj(e, o, a, s, i) {
  return (Ig(), Jg(i), (o.flags |= 256), Xi(e, o, a, s), o.child);
}
var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
function nj(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function oj(e, o, a) {
  var s = o.pendingProps,
    i = L.current,
    c = !1,
    d = (o.flags & 128) !== 0,
    h;
  if (
    ((h = d) ||
      (h = e !== null && e.memoizedState === null ? !1 : (i & 2) !== 0),
    h
      ? ((c = !0), (o.flags &= -129))
      : (e === null || e.memoizedState !== null) && (i |= 1),
    G(L, i & 1),
    e === null)
  )
    return (
      Eg(o),
      (e = o.memoizedState),
      e !== null && ((e = e.dehydrated), e !== null)
        ? (o.mode & 1
            ? e.data === '$!'
              ? (o.lanes = 8)
              : (o.lanes = 1073741824)
            : (o.lanes = 1),
          null)
        : ((d = s.children),
          (e = s.fallback),
          c
            ? ((s = o.mode),
              (c = o.child),
              (d = { mode: 'hidden', children: d }),
              !(s & 1) && c !== null
                ? ((c.childLanes = 0), (c.pendingProps = d))
                : (c = pj(d, s, 0, null)),
              (e = Tg(e, s, a, null)),
              (c.return = o),
              (e.return = o),
              (c.sibling = e),
              (o.child = c),
              (o.child.memoizedState = nj(a)),
              (o.memoizedState = mj),
              e)
            : qj(o, d))
    );
  if (((i = e.memoizedState), i !== null && ((h = i.dehydrated), h !== null)))
    return rj(e, o, d, s, h, i, a);
  if (c) {
    ((c = s.fallback), (d = o.mode), (i = e.child), (h = i.sibling));
    var b = { mode: 'hidden', children: s.children };
    return (
      !(d & 1) && o.child !== i
        ? ((s = o.child),
          (s.childLanes = 0),
          (s.pendingProps = b),
          (o.deletions = null))
        : ((s = Pg(i, b)), (s.subtreeFlags = i.subtreeFlags & 14680064)),
      h !== null ? (c = Pg(h, c)) : ((c = Tg(c, d, a, null)), (c.flags |= 2)),
      (c.return = o),
      (s.return = o),
      (s.sibling = c),
      (o.child = s),
      (s = c),
      (c = o.child),
      (d = e.child.memoizedState),
      (d =
        d === null
          ? nj(a)
          : {
              baseLanes: d.baseLanes | a,
              cachePool: null,
              transitions: d.transitions,
            }),
      (c.memoizedState = d),
      (c.childLanes = e.childLanes & ~a),
      (o.memoizedState = mj),
      s
    );
  }
  return (
    (c = e.child),
    (e = c.sibling),
    (s = Pg(c, { mode: 'visible', children: s.children })),
    !(o.mode & 1) && (s.lanes = a),
    (s.return = o),
    (s.sibling = null),
    e !== null &&
      ((a = o.deletions),
      a === null ? ((o.deletions = [e]), (o.flags |= 16)) : a.push(e)),
    (o.child = s),
    (o.memoizedState = null),
    s
  );
}
function qj(e, o) {
  return (
    (o = pj({ mode: 'visible', children: o }, e.mode, 0, null)),
    (o.return = e),
    (e.child = o)
  );
}
function sj(e, o, a, s) {
  return (
    s !== null && Jg(s),
    Ug(o, e.child, null, a),
    (e = qj(o, o.pendingProps.children)),
    (e.flags |= 2),
    (o.memoizedState = null),
    e
  );
}
function rj(e, o, a, s, i, c, d) {
  if (a)
    return o.flags & 256
      ? ((o.flags &= -257), (s = Ki(Error(p(422)))), sj(e, o, d, s))
      : o.memoizedState !== null
        ? ((o.child = e.child), (o.flags |= 128), null)
        : ((c = s.fallback),
          (i = o.mode),
          (s = pj({ mode: 'visible', children: s.children }, i, 0, null)),
          (c = Tg(c, i, d, null)),
          (c.flags |= 2),
          (s.return = o),
          (c.return = o),
          (s.sibling = c),
          (o.child = s),
          o.mode & 1 && Ug(o, e.child, null, d),
          (o.child.memoizedState = nj(d)),
          (o.memoizedState = mj),
          c);
  if (!(o.mode & 1)) return sj(e, o, d, null);
  if (i.data === '$!') {
    if (((s = i.nextSibling && i.nextSibling.dataset), s)) var h = s.dgst;
    return (
      (s = h),
      (c = Error(p(419))),
      (s = Ki(c, s, void 0)),
      sj(e, o, d, s)
    );
  }
  if (((h = (d & e.childLanes) !== 0), dh || h)) {
    if (((s = Q), s !== null)) {
      switch (d & -d) {
        case 4:
          i = 2;
          break;
        case 16:
          i = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          i = 32;
          break;
        case 536870912:
          i = 268435456;
          break;
        default:
          i = 0;
      }
      ((i = i & (s.suspendedLanes | d) ? 0 : i),
        i !== 0 &&
          i !== c.retryLane &&
          ((c.retryLane = i), ih(e, i), gi(s, e, i, -1)));
    }
    return (tj(), (s = Ki(Error(p(421)))), sj(e, o, d, s));
  }
  return i.data === '$?'
    ? ((o.flags |= 128),
      (o.child = e.child),
      (o = uj.bind(null, e)),
      (i._reactRetry = o),
      null)
    : ((e = c.treeContext),
      (yg = Lf(i.nextSibling)),
      (xg = o),
      (I = !0),
      (zg = null),
      e !== null &&
        ((og[pg++] = rg),
        (og[pg++] = sg),
        (og[pg++] = qg),
        (rg = e.id),
        (sg = e.overflow),
        (qg = o)),
      (o = qj(o, s.children)),
      (o.flags |= 4096),
      o);
}
function vj(e, o, a) {
  e.lanes |= o;
  var s = e.alternate;
  (s !== null && (s.lanes |= o), bh(e.return, o, a));
}
function wj(e, o, a, s, i) {
  var c = e.memoizedState;
  c === null
    ? (e.memoizedState = {
        isBackwards: o,
        rendering: null,
        renderingStartTime: 0,
        last: s,
        tail: a,
        tailMode: i,
      })
    : ((c.isBackwards = o),
      (c.rendering = null),
      (c.renderingStartTime = 0),
      (c.last = s),
      (c.tail = a),
      (c.tailMode = i));
}
function xj(e, o, a) {
  var s = o.pendingProps,
    i = s.revealOrder,
    c = s.tail;
  if ((Xi(e, o, s.children, a), (s = L.current), s & 2))
    ((s = (s & 1) | 2), (o.flags |= 128));
  else {
    if (e !== null && e.flags & 128)
      e: for (e = o.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && vj(e, a, o);
        else if (e.tag === 19) vj(e, a, o);
        else if (e.child !== null) {
          ((e.child.return = e), (e = e.child));
          continue;
        }
        if (e === o) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === o) break e;
          e = e.return;
        }
        ((e.sibling.return = e.return), (e = e.sibling));
      }
    s &= 1;
  }
  if ((G(L, s), !(o.mode & 1))) o.memoizedState = null;
  else
    switch (i) {
      case 'forwards':
        for (a = o.child, i = null; a !== null; )
          ((e = a.alternate),
            e !== null && Ch(e) === null && (i = a),
            (a = a.sibling));
        ((a = i),
          a === null
            ? ((i = o.child), (o.child = null))
            : ((i = a.sibling), (a.sibling = null)),
          wj(o, !1, i, a, c));
        break;
      case 'backwards':
        for (a = null, i = o.child, o.child = null; i !== null; ) {
          if (((e = i.alternate), e !== null && Ch(e) === null)) {
            o.child = i;
            break;
          }
          ((e = i.sibling), (i.sibling = a), (a = i), (i = e));
        }
        wj(o, !0, a, null, c);
        break;
      case 'together':
        wj(o, !1, null, null, void 0);
        break;
      default:
        o.memoizedState = null;
    }
  return o.child;
}
function ij(e, o) {
  !(o.mode & 1) &&
    e !== null &&
    ((e.alternate = null), (o.alternate = null), (o.flags |= 2));
}
function Zi(e, o, a) {
  if (
    (e !== null && (o.dependencies = e.dependencies),
    (rh |= o.lanes),
    !(a & o.childLanes))
  )
    return null;
  if (e !== null && o.child !== e.child) throw Error(p(153));
  if (o.child !== null) {
    for (
      e = o.child, a = Pg(e, e.pendingProps), o.child = a, a.return = o;
      e.sibling !== null;

    )
      ((e = e.sibling),
        (a = a.sibling = Pg(e, e.pendingProps)),
        (a.return = o));
    a.sibling = null;
  }
  return o.child;
}
function yj(e, o, a) {
  switch (o.tag) {
    case 3:
      (kj(o), Ig());
      break;
    case 5:
      Ah(o);
      break;
    case 1:
      Zf(o.type) && cg(o);
      break;
    case 4:
      yh(o, o.stateNode.containerInfo);
      break;
    case 10:
      var s = o.type._context,
        i = o.memoizedProps.value;
      (G(Wg, s._currentValue), (s._currentValue = i));
      break;
    case 13:
      if (((s = o.memoizedState), s !== null))
        return s.dehydrated !== null
          ? (G(L, L.current & 1), (o.flags |= 128), null)
          : a & o.child.childLanes
            ? oj(e, o, a)
            : (G(L, L.current & 1),
              (e = Zi(e, o, a)),
              e !== null ? e.sibling : null);
      G(L, L.current & 1);
      break;
    case 19:
      if (((s = (a & o.childLanes) !== 0), e.flags & 128)) {
        if (s) return xj(e, o, a);
        o.flags |= 128;
      }
      if (
        ((i = o.memoizedState),
        i !== null &&
          ((i.rendering = null), (i.tail = null), (i.lastEffect = null)),
        G(L, L.current),
        s)
      )
        break;
      return null;
    case 22:
    case 23:
      return ((o.lanes = 0), dj(e, o, a));
  }
  return Zi(e, o, a);
}
var zj, Aj, Bj, Cj;
zj = function (e, o) {
  for (var a = o.child; a !== null; ) {
    if (a.tag === 5 || a.tag === 6) e.appendChild(a.stateNode);
    else if (a.tag !== 4 && a.child !== null) {
      ((a.child.return = a), (a = a.child));
      continue;
    }
    if (a === o) break;
    for (; a.sibling === null; ) {
      if (a.return === null || a.return === o) return;
      a = a.return;
    }
    ((a.sibling.return = a.return), (a = a.sibling));
  }
};
Aj = function () {};
Bj = function (e, o, a, s) {
  var i = e.memoizedProps;
  if (i !== s) {
    ((e = o.stateNode), xh(uh.current));
    var c = null;
    switch (a) {
      case 'input':
        ((i = Ya(e, i)), (s = Ya(e, s)), (c = []));
        break;
      case 'select':
        ((i = A({}, i, { value: void 0 })),
          (s = A({}, s, { value: void 0 })),
          (c = []));
        break;
      case 'textarea':
        ((i = gb(e, i)), (s = gb(e, s)), (c = []));
        break;
      default:
        typeof i.onClick != 'function' &&
          typeof s.onClick == 'function' &&
          (e.onclick = Bf);
    }
    ub(a, s);
    var d;
    a = null;
    for (g in i)
      if (!s.hasOwnProperty(g) && i.hasOwnProperty(g) && i[g] != null)
        if (g === 'style') {
          var h = i[g];
          for (d in h) h.hasOwnProperty(d) && (a || (a = {}), (a[d] = ''));
        } else
          g !== 'dangerouslySetInnerHTML' &&
            g !== 'children' &&
            g !== 'suppressContentEditableWarning' &&
            g !== 'suppressHydrationWarning' &&
            g !== 'autoFocus' &&
            (ea.hasOwnProperty(g)
              ? c || (c = [])
              : (c = c || []).push(g, null));
    for (g in s) {
      var b = s[g];
      if (
        ((h = i != null ? i[g] : void 0),
        s.hasOwnProperty(g) && b !== h && (b != null || h != null))
      )
        if (g === 'style')
          if (h) {
            for (d in h)
              !h.hasOwnProperty(d) ||
                (b && b.hasOwnProperty(d)) ||
                (a || (a = {}), (a[d] = ''));
            for (d in b)
              b.hasOwnProperty(d) &&
                h[d] !== b[d] &&
                (a || (a = {}), (a[d] = b[d]));
          } else (a || (c || (c = []), c.push(g, a)), (a = b));
        else
          g === 'dangerouslySetInnerHTML'
            ? ((b = b ? b.__html : void 0),
              (h = h ? h.__html : void 0),
              b != null && h !== b && (c = c || []).push(g, b))
            : g === 'children'
              ? (typeof b != 'string' && typeof b != 'number') ||
                (c = c || []).push(g, '' + b)
              : g !== 'suppressContentEditableWarning' &&
                g !== 'suppressHydrationWarning' &&
                (ea.hasOwnProperty(g)
                  ? (b != null && g === 'onScroll' && D('scroll', e),
                    c || h === b || (c = []))
                  : (c = c || []).push(g, b));
    }
    a && (c = c || []).push('style', a);
    var g = c;
    (o.updateQueue = g) && (o.flags |= 4);
  }
};
Cj = function (e, o, a, s) {
  a !== s && (o.flags |= 4);
};
function Dj(e, o) {
  if (!I)
    switch (e.tailMode) {
      case 'hidden':
        o = e.tail;
        for (var a = null; o !== null; )
          (o.alternate !== null && (a = o), (o = o.sibling));
        a === null ? (e.tail = null) : (a.sibling = null);
        break;
      case 'collapsed':
        a = e.tail;
        for (var s = null; a !== null; )
          (a.alternate !== null && (s = a), (a = a.sibling));
        s === null
          ? o || e.tail === null
            ? (e.tail = null)
            : (e.tail.sibling = null)
          : (s.sibling = null);
    }
}
function S(e) {
  var o = e.alternate !== null && e.alternate.child === e.child,
    a = 0,
    s = 0;
  if (o)
    for (var i = e.child; i !== null; )
      ((a |= i.lanes | i.childLanes),
        (s |= i.subtreeFlags & 14680064),
        (s |= i.flags & 14680064),
        (i.return = e),
        (i = i.sibling));
  else
    for (i = e.child; i !== null; )
      ((a |= i.lanes | i.childLanes),
        (s |= i.subtreeFlags),
        (s |= i.flags),
        (i.return = e),
        (i = i.sibling));
  return ((e.subtreeFlags |= s), (e.childLanes = a), o);
}
function Ej(e, o, a) {
  var s = o.pendingProps;
  switch ((wg(o), o.tag)) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return (S(o), null);
    case 1:
      return (Zf(o.type) && $f(), S(o), null);
    case 3:
      return (
        (s = o.stateNode),
        zh(),
        E(Wf),
        E(H),
        Eh(),
        s.pendingContext &&
          ((s.context = s.pendingContext), (s.pendingContext = null)),
        (e === null || e.child === null) &&
          (Gg(o)
            ? (o.flags |= 4)
            : e === null ||
              (e.memoizedState.isDehydrated && !(o.flags & 256)) ||
              ((o.flags |= 1024), zg !== null && (Fj(zg), (zg = null)))),
        Aj(e, o),
        S(o),
        null
      );
    case 5:
      Bh(o);
      var i = xh(wh.current);
      if (((a = o.type), e !== null && o.stateNode != null))
        (Bj(e, o, a, s, i),
          e.ref !== o.ref && ((o.flags |= 512), (o.flags |= 2097152)));
      else {
        if (!s) {
          if (o.stateNode === null) throw Error(p(166));
          return (S(o), null);
        }
        if (((e = xh(uh.current)), Gg(o))) {
          ((s = o.stateNode), (a = o.type));
          var c = o.memoizedProps;
          switch (((s[Of] = o), (s[Pf] = c), (e = (o.mode & 1) !== 0), a)) {
            case 'dialog':
              (D('cancel', s), D('close', s));
              break;
            case 'iframe':
            case 'object':
            case 'embed':
              D('load', s);
              break;
            case 'video':
            case 'audio':
              for (i = 0; i < lf.length; i++) D(lf[i], s);
              break;
            case 'source':
              D('error', s);
              break;
            case 'img':
            case 'image':
            case 'link':
              (D('error', s), D('load', s));
              break;
            case 'details':
              D('toggle', s);
              break;
            case 'input':
              (Za(s, c), D('invalid', s));
              break;
            case 'select':
              ((s._wrapperState = { wasMultiple: !!c.multiple }),
                D('invalid', s));
              break;
            case 'textarea':
              (hb(s, c), D('invalid', s));
          }
          (ub(a, c), (i = null));
          for (var d in c)
            if (c.hasOwnProperty(d)) {
              var h = c[d];
              d === 'children'
                ? typeof h == 'string'
                  ? s.textContent !== h &&
                    (c.suppressHydrationWarning !== !0 &&
                      Af(s.textContent, h, e),
                    (i = ['children', h]))
                  : typeof h == 'number' &&
                    s.textContent !== '' + h &&
                    (c.suppressHydrationWarning !== !0 &&
                      Af(s.textContent, h, e),
                    (i = ['children', '' + h]))
                : ea.hasOwnProperty(d) &&
                  h != null &&
                  d === 'onScroll' &&
                  D('scroll', s);
            }
          switch (a) {
            case 'input':
              (Va(s), db(s, c, !0));
              break;
            case 'textarea':
              (Va(s), jb(s));
              break;
            case 'select':
            case 'option':
              break;
            default:
              typeof c.onClick == 'function' && (s.onclick = Bf);
          }
          ((s = i), (o.updateQueue = s), s !== null && (o.flags |= 4));
        } else {
          ((d = i.nodeType === 9 ? i : i.ownerDocument),
            e === 'http://www.w3.org/1999/xhtml' && (e = kb(a)),
            e === 'http://www.w3.org/1999/xhtml'
              ? a === 'script'
                ? ((e = d.createElement('div')),
                  (e.innerHTML = '<script><\/script>'),
                  (e = e.removeChild(e.firstChild)))
                : typeof s.is == 'string'
                  ? (e = d.createElement(a, { is: s.is }))
                  : ((e = d.createElement(a)),
                    a === 'select' &&
                      ((d = e),
                      s.multiple
                        ? (d.multiple = !0)
                        : s.size && (d.size = s.size)))
              : (e = d.createElementNS(e, a)),
            (e[Of] = o),
            (e[Pf] = s),
            zj(e, o, !1, !1),
            (o.stateNode = e));
          e: {
            switch (((d = vb(a, s)), a)) {
              case 'dialog':
                (D('cancel', e), D('close', e), (i = s));
                break;
              case 'iframe':
              case 'object':
              case 'embed':
                (D('load', e), (i = s));
                break;
              case 'video':
              case 'audio':
                for (i = 0; i < lf.length; i++) D(lf[i], e);
                i = s;
                break;
              case 'source':
                (D('error', e), (i = s));
                break;
              case 'img':
              case 'image':
              case 'link':
                (D('error', e), D('load', e), (i = s));
                break;
              case 'details':
                (D('toggle', e), (i = s));
                break;
              case 'input':
                (Za(e, s), (i = Ya(e, s)), D('invalid', e));
                break;
              case 'option':
                i = s;
                break;
              case 'select':
                ((e._wrapperState = { wasMultiple: !!s.multiple }),
                  (i = A({}, s, { value: void 0 })),
                  D('invalid', e));
                break;
              case 'textarea':
                (hb(e, s), (i = gb(e, s)), D('invalid', e));
                break;
              default:
                i = s;
            }
            (ub(a, i), (h = i));
            for (c in h)
              if (h.hasOwnProperty(c)) {
                var b = h[c];
                c === 'style'
                  ? sb(e, b)
                  : c === 'dangerouslySetInnerHTML'
                    ? ((b = b ? b.__html : void 0), b != null && nb(e, b))
                    : c === 'children'
                      ? typeof b == 'string'
                        ? (a !== 'textarea' || b !== '') && ob(e, b)
                        : typeof b == 'number' && ob(e, '' + b)
                      : c !== 'suppressContentEditableWarning' &&
                        c !== 'suppressHydrationWarning' &&
                        c !== 'autoFocus' &&
                        (ea.hasOwnProperty(c)
                          ? b != null && c === 'onScroll' && D('scroll', e)
                          : b != null && ta(e, c, b, d));
              }
            switch (a) {
              case 'input':
                (Va(e), db(e, s, !1));
                break;
              case 'textarea':
                (Va(e), jb(e));
                break;
              case 'option':
                s.value != null && e.setAttribute('value', '' + Sa(s.value));
                break;
              case 'select':
                ((e.multiple = !!s.multiple),
                  (c = s.value),
                  c != null
                    ? fb(e, !!s.multiple, c, !1)
                    : s.defaultValue != null &&
                      fb(e, !!s.multiple, s.defaultValue, !0));
                break;
              default:
                typeof i.onClick == 'function' && (e.onclick = Bf);
            }
            switch (a) {
              case 'button':
              case 'input':
              case 'select':
              case 'textarea':
                s = !!s.autoFocus;
                break e;
              case 'img':
                s = !0;
                break e;
              default:
                s = !1;
            }
          }
          s && (o.flags |= 4);
        }
        o.ref !== null && ((o.flags |= 512), (o.flags |= 2097152));
      }
      return (S(o), null);
    case 6:
      if (e && o.stateNode != null) Cj(e, o, e.memoizedProps, s);
      else {
        if (typeof s != 'string' && o.stateNode === null) throw Error(p(166));
        if (((a = xh(wh.current)), xh(uh.current), Gg(o))) {
          if (
            ((s = o.stateNode),
            (a = o.memoizedProps),
            (s[Of] = o),
            (c = s.nodeValue !== a) && ((e = xg), e !== null))
          )
            switch (e.tag) {
              case 3:
                Af(s.nodeValue, a, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 &&
                  Af(s.nodeValue, a, (e.mode & 1) !== 0);
            }
          c && (o.flags |= 4);
        } else
          ((s = (a.nodeType === 9 ? a : a.ownerDocument).createTextNode(s)),
            (s[Of] = o),
            (o.stateNode = s));
      }
      return (S(o), null);
    case 13:
      if (
        (E(L),
        (s = o.memoizedState),
        e === null ||
          (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
      ) {
        if (I && yg !== null && o.mode & 1 && !(o.flags & 128))
          (Hg(), Ig(), (o.flags |= 98560), (c = !1));
        else if (((c = Gg(o)), s !== null && s.dehydrated !== null)) {
          if (e === null) {
            if (!c) throw Error(p(318));
            if (
              ((c = o.memoizedState),
              (c = c !== null ? c.dehydrated : null),
              !c)
            )
              throw Error(p(317));
            c[Of] = o;
          } else
            (Ig(),
              !(o.flags & 128) && (o.memoizedState = null),
              (o.flags |= 4));
          (S(o), (c = !1));
        } else (zg !== null && (Fj(zg), (zg = null)), (c = !0));
        if (!c) return o.flags & 65536 ? o : null;
      }
      return o.flags & 128
        ? ((o.lanes = a), o)
        : ((s = s !== null),
          s !== (e !== null && e.memoizedState !== null) &&
            s &&
            ((o.child.flags |= 8192),
            o.mode & 1 &&
              (e === null || L.current & 1 ? T === 0 && (T = 3) : tj())),
          o.updateQueue !== null && (o.flags |= 4),
          S(o),
          null);
    case 4:
      return (
        zh(),
        Aj(e, o),
        e === null && sf(o.stateNode.containerInfo),
        S(o),
        null
      );
    case 10:
      return (ah(o.type._context), S(o), null);
    case 17:
      return (Zf(o.type) && $f(), S(o), null);
    case 19:
      if ((E(L), (c = o.memoizedState), c === null)) return (S(o), null);
      if (((s = (o.flags & 128) !== 0), (d = c.rendering), d === null))
        if (s) Dj(c, !1);
        else {
          if (T !== 0 || (e !== null && e.flags & 128))
            for (e = o.child; e !== null; ) {
              if (((d = Ch(e)), d !== null)) {
                for (
                  o.flags |= 128,
                    Dj(c, !1),
                    s = d.updateQueue,
                    s !== null && ((o.updateQueue = s), (o.flags |= 4)),
                    o.subtreeFlags = 0,
                    s = a,
                    a = o.child;
                  a !== null;

                )
                  ((c = a),
                    (e = s),
                    (c.flags &= 14680066),
                    (d = c.alternate),
                    d === null
                      ? ((c.childLanes = 0),
                        (c.lanes = e),
                        (c.child = null),
                        (c.subtreeFlags = 0),
                        (c.memoizedProps = null),
                        (c.memoizedState = null),
                        (c.updateQueue = null),
                        (c.dependencies = null),
                        (c.stateNode = null))
                      : ((c.childLanes = d.childLanes),
                        (c.lanes = d.lanes),
                        (c.child = d.child),
                        (c.subtreeFlags = 0),
                        (c.deletions = null),
                        (c.memoizedProps = d.memoizedProps),
                        (c.memoizedState = d.memoizedState),
                        (c.updateQueue = d.updateQueue),
                        (c.type = d.type),
                        (e = d.dependencies),
                        (c.dependencies =
                          e === null
                            ? null
                            : {
                                lanes: e.lanes,
                                firstContext: e.firstContext,
                              })),
                    (a = a.sibling));
                return (G(L, (L.current & 1) | 2), o.child);
              }
              e = e.sibling;
            }
          c.tail !== null &&
            B() > Gj &&
            ((o.flags |= 128), (s = !0), Dj(c, !1), (o.lanes = 4194304));
        }
      else {
        if (!s)
          if (((e = Ch(d)), e !== null)) {
            if (
              ((o.flags |= 128),
              (s = !0),
              (a = e.updateQueue),
              a !== null && ((o.updateQueue = a), (o.flags |= 4)),
              Dj(c, !0),
              c.tail === null && c.tailMode === 'hidden' && !d.alternate && !I)
            )
              return (S(o), null);
          } else
            2 * B() - c.renderingStartTime > Gj &&
              a !== 1073741824 &&
              ((o.flags |= 128), (s = !0), Dj(c, !1), (o.lanes = 4194304));
        c.isBackwards
          ? ((d.sibling = o.child), (o.child = d))
          : ((a = c.last),
            a !== null ? (a.sibling = d) : (o.child = d),
            (c.last = d));
      }
      return c.tail !== null
        ? ((o = c.tail),
          (c.rendering = o),
          (c.tail = o.sibling),
          (c.renderingStartTime = B()),
          (o.sibling = null),
          (a = L.current),
          G(L, s ? (a & 1) | 2 : a & 1),
          o)
        : (S(o), null);
    case 22:
    case 23:
      return (
        Hj(),
        (s = o.memoizedState !== null),
        e !== null && (e.memoizedState !== null) !== s && (o.flags |= 8192),
        s && o.mode & 1
          ? fj & 1073741824 && (S(o), o.subtreeFlags & 6 && (o.flags |= 8192))
          : S(o),
        null
      );
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(p(156, o.tag));
}
function Ij(e, o) {
  switch ((wg(o), o.tag)) {
    case 1:
      return (
        Zf(o.type) && $f(),
        (e = o.flags),
        e & 65536 ? ((o.flags = (e & -65537) | 128), o) : null
      );
    case 3:
      return (
        zh(),
        E(Wf),
        E(H),
        Eh(),
        (e = o.flags),
        e & 65536 && !(e & 128) ? ((o.flags = (e & -65537) | 128), o) : null
      );
    case 5:
      return (Bh(o), null);
    case 13:
      if ((E(L), (e = o.memoizedState), e !== null && e.dehydrated !== null)) {
        if (o.alternate === null) throw Error(p(340));
        Ig();
      }
      return (
        (e = o.flags),
        e & 65536 ? ((o.flags = (e & -65537) | 128), o) : null
      );
    case 19:
      return (E(L), null);
    case 4:
      return (zh(), null);
    case 10:
      return (ah(o.type._context), null);
    case 22:
    case 23:
      return (Hj(), null);
    case 24:
      return null;
    default:
      return null;
  }
}
var Jj = !1,
  U = !1,
  Kj = typeof WeakSet == 'function' ? WeakSet : Set,
  V$2 = null;
function Lj(e, o) {
  var a = e.ref;
  if (a !== null)
    if (typeof a == 'function')
      try {
        a(null);
      } catch (s) {
        W(e, o, s);
      }
    else a.current = null;
}
function Mj(e, o, a) {
  try {
    a();
  } catch (s) {
    W(e, o, s);
  }
}
var Nj = !1;
function Oj(e, o) {
  if (((Cf = dd), (e = Me()), Ne(e))) {
    if ('selectionStart' in e)
      var a = { start: e.selectionStart, end: e.selectionEnd };
    else
      e: {
        a = ((a = e.ownerDocument) && a.defaultView) || window;
        var s = a.getSelection && a.getSelection();
        if (s && s.rangeCount !== 0) {
          a = s.anchorNode;
          var i = s.anchorOffset,
            c = s.focusNode;
          s = s.focusOffset;
          try {
            (a.nodeType, c.nodeType);
          } catch {
            a = null;
            break e;
          }
          var d = 0,
            h = -1,
            b = -1,
            g = 0,
            $ = 0,
            _ = e,
            _e = null;
          t: for (;;) {
            for (
              var ot;
              _ !== a || (i !== 0 && _.nodeType !== 3) || (h = d + i),
                _ !== c || (s !== 0 && _.nodeType !== 3) || (b = d + s),
                _.nodeType === 3 && (d += _.nodeValue.length),
                (ot = _.firstChild) !== null;

            )
              ((_e = _), (_ = ot));
            for (;;) {
              if (_ === e) break t;
              if (
                (_e === a && ++g === i && (h = d),
                _e === c && ++$ === s && (b = d),
                (ot = _.nextSibling) !== null)
              )
                break;
              ((_ = _e), (_e = _.parentNode));
            }
            _ = ot;
          }
          a = h === -1 || b === -1 ? null : { start: h, end: b };
        } else a = null;
      }
    a = a || { start: 0, end: 0 };
  } else a = null;
  for (
    Df = { focusedElem: e, selectionRange: a }, dd = !1, V$2 = o;
    V$2 !== null;

  )
    if (((o = V$2), (e = o.child), (o.subtreeFlags & 1028) !== 0 && e !== null))
      ((e.return = o), (V$2 = e));
    else
      for (; V$2 !== null; ) {
        o = V$2;
        try {
          var j = o.alternate;
          if (o.flags & 1024)
            switch (o.tag) {
              case 0:
              case 11:
              case 15:
                break;
              case 1:
                if (j !== null) {
                  var nt = j.memoizedProps,
                    lt = j.memoizedState,
                    tt = o.stateNode,
                    et = tt.getSnapshotBeforeUpdate(
                      o.elementType === o.type ? nt : Ci(o.type, nt),
                      lt
                    );
                  tt.__reactInternalSnapshotBeforeUpdate = et;
                }
                break;
              case 3:
                var rt = o.stateNode.containerInfo;
                rt.nodeType === 1
                  ? (rt.textContent = '')
                  : rt.nodeType === 9 &&
                    rt.documentElement &&
                    rt.removeChild(rt.documentElement);
                break;
              case 5:
              case 6:
              case 4:
              case 17:
                break;
              default:
                throw Error(p(163));
            }
        } catch (at) {
          W(o, o.return, at);
        }
        if (((e = o.sibling), e !== null)) {
          ((e.return = o.return), (V$2 = e));
          break;
        }
        V$2 = o.return;
      }
  return ((j = Nj), (Nj = !1), j);
}
function Pj(e, o, a) {
  var s = o.updateQueue;
  if (((s = s !== null ? s.lastEffect : null), s !== null)) {
    var i = (s = s.next);
    do {
      if ((i.tag & e) === e) {
        var c = i.destroy;
        ((i.destroy = void 0), c !== void 0 && Mj(o, a, c));
      }
      i = i.next;
    } while (i !== s);
  }
}
function Qj(e, o) {
  if (
    ((o = o.updateQueue), (o = o !== null ? o.lastEffect : null), o !== null)
  ) {
    var a = (o = o.next);
    do {
      if ((a.tag & e) === e) {
        var s = a.create;
        a.destroy = s();
      }
      a = a.next;
    } while (a !== o);
  }
}
function Rj(e) {
  var o = e.ref;
  if (o !== null) {
    var a = e.stateNode;
    switch (e.tag) {
      case 5:
        e = a;
        break;
      default:
        e = a;
    }
    typeof o == 'function' ? o(e) : (o.current = e);
  }
}
function Sj(e) {
  var o = e.alternate;
  (o !== null && ((e.alternate = null), Sj(o)),
    (e.child = null),
    (e.deletions = null),
    (e.sibling = null),
    e.tag === 5 &&
      ((o = e.stateNode),
      o !== null &&
        (delete o[Of], delete o[Pf], delete o[of], delete o[Qf], delete o[Rf])),
    (e.stateNode = null),
    (e.return = null),
    (e.dependencies = null),
    (e.memoizedProps = null),
    (e.memoizedState = null),
    (e.pendingProps = null),
    (e.stateNode = null),
    (e.updateQueue = null));
}
function Tj(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function Uj(e) {
  e: for (;;) {
    for (; e.sibling === null; ) {
      if (e.return === null || Tj(e.return)) return null;
      e = e.return;
    }
    for (
      e.sibling.return = e.return, e = e.sibling;
      e.tag !== 5 && e.tag !== 6 && e.tag !== 18;

    ) {
      if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
      ((e.child.return = e), (e = e.child));
    }
    if (!(e.flags & 2)) return e.stateNode;
  }
}
function Vj(e, o, a) {
  var s = e.tag;
  if (s === 5 || s === 6)
    ((e = e.stateNode),
      o
        ? a.nodeType === 8
          ? a.parentNode.insertBefore(e, o)
          : a.insertBefore(e, o)
        : (a.nodeType === 8
            ? ((o = a.parentNode), o.insertBefore(e, a))
            : ((o = a), o.appendChild(e)),
          (a = a._reactRootContainer),
          a != null || o.onclick !== null || (o.onclick = Bf)));
  else if (s !== 4 && ((e = e.child), e !== null))
    for (Vj(e, o, a), e = e.sibling; e !== null; )
      (Vj(e, o, a), (e = e.sibling));
}
function Wj(e, o, a) {
  var s = e.tag;
  if (s === 5 || s === 6)
    ((e = e.stateNode), o ? a.insertBefore(e, o) : a.appendChild(e));
  else if (s !== 4 && ((e = e.child), e !== null))
    for (Wj(e, o, a), e = e.sibling; e !== null; )
      (Wj(e, o, a), (e = e.sibling));
}
var X = null,
  Xj = !1;
function Yj(e, o, a) {
  for (a = a.child; a !== null; ) (Zj(e, o, a), (a = a.sibling));
}
function Zj(e, o, a) {
  if (lc && typeof lc.onCommitFiberUnmount == 'function')
    try {
      lc.onCommitFiberUnmount(kc, a);
    } catch {}
  switch (a.tag) {
    case 5:
      U || Lj(a, o);
    case 6:
      var s = X,
        i = Xj;
      ((X = null),
        Yj(e, o, a),
        (X = s),
        (Xj = i),
        X !== null &&
          (Xj
            ? ((e = X),
              (a = a.stateNode),
              e.nodeType === 8 ? e.parentNode.removeChild(a) : e.removeChild(a))
            : X.removeChild(a.stateNode)));
      break;
    case 18:
      X !== null &&
        (Xj
          ? ((e = X),
            (a = a.stateNode),
            e.nodeType === 8
              ? Kf(e.parentNode, a)
              : e.nodeType === 1 && Kf(e, a),
            bd(e))
          : Kf(X, a.stateNode));
      break;
    case 4:
      ((s = X),
        (i = Xj),
        (X = a.stateNode.containerInfo),
        (Xj = !0),
        Yj(e, o, a),
        (X = s),
        (Xj = i));
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (
        !U &&
        ((s = a.updateQueue), s !== null && ((s = s.lastEffect), s !== null))
      ) {
        i = s = s.next;
        do {
          var c = i,
            d = c.destroy;
          ((c = c.tag),
            d !== void 0 && (c & 2 || c & 4) && Mj(a, o, d),
            (i = i.next));
        } while (i !== s);
      }
      Yj(e, o, a);
      break;
    case 1:
      if (
        !U &&
        (Lj(a, o),
        (s = a.stateNode),
        typeof s.componentWillUnmount == 'function')
      )
        try {
          ((s.props = a.memoizedProps),
            (s.state = a.memoizedState),
            s.componentWillUnmount());
        } catch (h) {
          W(a, o, h);
        }
      Yj(e, o, a);
      break;
    case 21:
      Yj(e, o, a);
      break;
    case 22:
      a.mode & 1
        ? ((U = (s = U) || a.memoizedState !== null), Yj(e, o, a), (U = s))
        : Yj(e, o, a);
      break;
    default:
      Yj(e, o, a);
  }
}
function ak(e) {
  var o = e.updateQueue;
  if (o !== null) {
    e.updateQueue = null;
    var a = e.stateNode;
    (a === null && (a = e.stateNode = new Kj()),
      o.forEach(function (s) {
        var i = bk.bind(null, e, s);
        a.has(s) || (a.add(s), s.then(i, i));
      }));
  }
}
function ck(e, o) {
  var a = o.deletions;
  if (a !== null)
    for (var s = 0; s < a.length; s++) {
      var i = a[s];
      try {
        var c = e,
          d = o,
          h = d;
        e: for (; h !== null; ) {
          switch (h.tag) {
            case 5:
              ((X = h.stateNode), (Xj = !1));
              break e;
            case 3:
              ((X = h.stateNode.containerInfo), (Xj = !0));
              break e;
            case 4:
              ((X = h.stateNode.containerInfo), (Xj = !0));
              break e;
          }
          h = h.return;
        }
        if (X === null) throw Error(p(160));
        (Zj(c, d, i), (X = null), (Xj = !1));
        var b = i.alternate;
        (b !== null && (b.return = null), (i.return = null));
      } catch (g) {
        W(i, o, g);
      }
    }
  if (o.subtreeFlags & 12854)
    for (o = o.child; o !== null; ) (dk(o, e), (o = o.sibling));
}
function dk(e, o) {
  var a = e.alternate,
    s = e.flags;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if ((ck(o, e), ek(e), s & 4)) {
        try {
          (Pj(3, e, e.return), Qj(3, e));
        } catch (nt) {
          W(e, e.return, nt);
        }
        try {
          Pj(5, e, e.return);
        } catch (nt) {
          W(e, e.return, nt);
        }
      }
      break;
    case 1:
      (ck(o, e), ek(e), s & 512 && a !== null && Lj(a, a.return));
      break;
    case 5:
      if (
        (ck(o, e),
        ek(e),
        s & 512 && a !== null && Lj(a, a.return),
        e.flags & 32)
      ) {
        var i = e.stateNode;
        try {
          ob(i, '');
        } catch (nt) {
          W(e, e.return, nt);
        }
      }
      if (s & 4 && ((i = e.stateNode), i != null)) {
        var c = e.memoizedProps,
          d = a !== null ? a.memoizedProps : c,
          h = e.type,
          b = e.updateQueue;
        if (((e.updateQueue = null), b !== null))
          try {
            (h === 'input' && c.type === 'radio' && c.name != null && ab(i, c),
              vb(h, d));
            var g = vb(h, c);
            for (d = 0; d < b.length; d += 2) {
              var $ = b[d],
                _ = b[d + 1];
              $ === 'style'
                ? sb(i, _)
                : $ === 'dangerouslySetInnerHTML'
                  ? nb(i, _)
                  : $ === 'children'
                    ? ob(i, _)
                    : ta(i, $, _, g);
            }
            switch (h) {
              case 'input':
                bb(i, c);
                break;
              case 'textarea':
                ib(i, c);
                break;
              case 'select':
                var _e = i._wrapperState.wasMultiple;
                i._wrapperState.wasMultiple = !!c.multiple;
                var ot = c.value;
                ot != null
                  ? fb(i, !!c.multiple, ot, !1)
                  : _e !== !!c.multiple &&
                    (c.defaultValue != null
                      ? fb(i, !!c.multiple, c.defaultValue, !0)
                      : fb(i, !!c.multiple, c.multiple ? [] : '', !1));
            }
            i[Pf] = c;
          } catch (nt) {
            W(e, e.return, nt);
          }
      }
      break;
    case 6:
      if ((ck(o, e), ek(e), s & 4)) {
        if (e.stateNode === null) throw Error(p(162));
        ((i = e.stateNode), (c = e.memoizedProps));
        try {
          i.nodeValue = c;
        } catch (nt) {
          W(e, e.return, nt);
        }
      }
      break;
    case 3:
      if (
        (ck(o, e), ek(e), s & 4 && a !== null && a.memoizedState.isDehydrated)
      )
        try {
          bd(o.containerInfo);
        } catch (nt) {
          W(e, e.return, nt);
        }
      break;
    case 4:
      (ck(o, e), ek(e));
      break;
    case 13:
      (ck(o, e),
        ek(e),
        (i = e.child),
        i.flags & 8192 &&
          ((c = i.memoizedState !== null),
          (i.stateNode.isHidden = c),
          !c ||
            (i.alternate !== null && i.alternate.memoizedState !== null) ||
            (fk = B())),
        s & 4 && ak(e));
      break;
    case 22:
      if (
        (($ = a !== null && a.memoizedState !== null),
        e.mode & 1 ? ((U = (g = U) || $), ck(o, e), (U = g)) : ck(o, e),
        ek(e),
        s & 8192)
      ) {
        if (
          ((g = e.memoizedState !== null),
          (e.stateNode.isHidden = g) && !$ && e.mode & 1)
        )
          for (V$2 = e, $ = e.child; $ !== null; ) {
            for (_ = V$2 = $; V$2 !== null; ) {
              switch (((_e = V$2), (ot = _e.child), _e.tag)) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Pj(4, _e, _e.return);
                  break;
                case 1:
                  Lj(_e, _e.return);
                  var j = _e.stateNode;
                  if (typeof j.componentWillUnmount == 'function') {
                    ((s = _e), (a = _e.return));
                    try {
                      ((o = s),
                        (j.props = o.memoizedProps),
                        (j.state = o.memoizedState),
                        j.componentWillUnmount());
                    } catch (nt) {
                      W(s, a, nt);
                    }
                  }
                  break;
                case 5:
                  Lj(_e, _e.return);
                  break;
                case 22:
                  if (_e.memoizedState !== null) {
                    gk(_);
                    continue;
                  }
              }
              ot !== null ? ((ot.return = _e), (V$2 = ot)) : gk(_);
            }
            $ = $.sibling;
          }
        e: for ($ = null, _ = e; ; ) {
          if (_.tag === 5) {
            if ($ === null) {
              $ = _;
              try {
                ((i = _.stateNode),
                  g
                    ? ((c = i.style),
                      typeof c.setProperty == 'function'
                        ? c.setProperty('display', 'none', 'important')
                        : (c.display = 'none'))
                    : ((h = _.stateNode),
                      (b = _.memoizedProps.style),
                      (d =
                        b != null && b.hasOwnProperty('display')
                          ? b.display
                          : null),
                      (h.style.display = rb('display', d))));
              } catch (nt) {
                W(e, e.return, nt);
              }
            }
          } else if (_.tag === 6) {
            if ($ === null)
              try {
                _.stateNode.nodeValue = g ? '' : _.memoizedProps;
              } catch (nt) {
                W(e, e.return, nt);
              }
          } else if (
            ((_.tag !== 22 && _.tag !== 23) ||
              _.memoizedState === null ||
              _ === e) &&
            _.child !== null
          ) {
            ((_.child.return = _), (_ = _.child));
            continue;
          }
          if (_ === e) break e;
          for (; _.sibling === null; ) {
            if (_.return === null || _.return === e) break e;
            ($ === _ && ($ = null), (_ = _.return));
          }
          ($ === _ && ($ = null),
            (_.sibling.return = _.return),
            (_ = _.sibling));
        }
      }
      break;
    case 19:
      (ck(o, e), ek(e), s & 4 && ak(e));
      break;
    case 21:
      break;
    default:
      (ck(o, e), ek(e));
  }
}
function ek(e) {
  var o = e.flags;
  if (o & 2) {
    try {
      e: {
        for (var a = e.return; a !== null; ) {
          if (Tj(a)) {
            var s = a;
            break e;
          }
          a = a.return;
        }
        throw Error(p(160));
      }
      switch (s.tag) {
        case 5:
          var i = s.stateNode;
          s.flags & 32 && (ob(i, ''), (s.flags &= -33));
          var c = Uj(e);
          Wj(e, c, i);
          break;
        case 3:
        case 4:
          var d = s.stateNode.containerInfo,
            h = Uj(e);
          Vj(e, h, d);
          break;
        default:
          throw Error(p(161));
      }
    } catch (b) {
      W(e, e.return, b);
    }
    e.flags &= -3;
  }
  o & 4096 && (e.flags &= -4097);
}
function hk(e, o, a) {
  ((V$2 = e), ik(e));
}
function ik(e, o, a) {
  for (var s = (e.mode & 1) !== 0; V$2 !== null; ) {
    var i = V$2,
      c = i.child;
    if (i.tag === 22 && s) {
      var d = i.memoizedState !== null || Jj;
      if (!d) {
        var h = i.alternate,
          b = (h !== null && h.memoizedState !== null) || U;
        h = Jj;
        var g = U;
        if (((Jj = d), (U = b) && !g))
          for (V$2 = i; V$2 !== null; )
            ((d = V$2),
              (b = d.child),
              d.tag === 22 && d.memoizedState !== null
                ? jk(i)
                : b !== null
                  ? ((b.return = d), (V$2 = b))
                  : jk(i));
        for (; c !== null; ) ((V$2 = c), ik(c), (c = c.sibling));
        ((V$2 = i), (Jj = h), (U = g));
      }
      kk(e);
    } else
      i.subtreeFlags & 8772 && c !== null ? ((c.return = i), (V$2 = c)) : kk(e);
  }
}
function kk(e) {
  for (; V$2 !== null; ) {
    var o = V$2;
    if (o.flags & 8772) {
      var a = o.alternate;
      try {
        if (o.flags & 8772)
          switch (o.tag) {
            case 0:
            case 11:
            case 15:
              U || Qj(5, o);
              break;
            case 1:
              var s = o.stateNode;
              if (o.flags & 4 && !U)
                if (a === null) s.componentDidMount();
                else {
                  var i =
                    o.elementType === o.type
                      ? a.memoizedProps
                      : Ci(o.type, a.memoizedProps);
                  s.componentDidUpdate(
                    i,
                    a.memoizedState,
                    s.__reactInternalSnapshotBeforeUpdate
                  );
                }
              var c = o.updateQueue;
              c !== null && sh(o, c, s);
              break;
            case 3:
              var d = o.updateQueue;
              if (d !== null) {
                if (((a = null), o.child !== null))
                  switch (o.child.tag) {
                    case 5:
                      a = o.child.stateNode;
                      break;
                    case 1:
                      a = o.child.stateNode;
                  }
                sh(o, d, a);
              }
              break;
            case 5:
              var h = o.stateNode;
              if (a === null && o.flags & 4) {
                a = h;
                var b = o.memoizedProps;
                switch (o.type) {
                  case 'button':
                  case 'input':
                  case 'select':
                  case 'textarea':
                    b.autoFocus && a.focus();
                    break;
                  case 'img':
                    b.src && (a.src = b.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (o.memoizedState === null) {
                var g = o.alternate;
                if (g !== null) {
                  var $ = g.memoizedState;
                  if ($ !== null) {
                    var _ = $.dehydrated;
                    _ !== null && bd(_);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(p(163));
          }
        U || (o.flags & 512 && Rj(o));
      } catch (_e) {
        W(o, o.return, _e);
      }
    }
    if (o === e) {
      V$2 = null;
      break;
    }
    if (((a = o.sibling), a !== null)) {
      ((a.return = o.return), (V$2 = a));
      break;
    }
    V$2 = o.return;
  }
}
function gk(e) {
  for (; V$2 !== null; ) {
    var o = V$2;
    if (o === e) {
      V$2 = null;
      break;
    }
    var a = o.sibling;
    if (a !== null) {
      ((a.return = o.return), (V$2 = a));
      break;
    }
    V$2 = o.return;
  }
}
function jk(e) {
  for (; V$2 !== null; ) {
    var o = V$2;
    try {
      switch (o.tag) {
        case 0:
        case 11:
        case 15:
          var a = o.return;
          try {
            Qj(4, o);
          } catch (b) {
            W(o, a, b);
          }
          break;
        case 1:
          var s = o.stateNode;
          if (typeof s.componentDidMount == 'function') {
            var i = o.return;
            try {
              s.componentDidMount();
            } catch (b) {
              W(o, i, b);
            }
          }
          var c = o.return;
          try {
            Rj(o);
          } catch (b) {
            W(o, c, b);
          }
          break;
        case 5:
          var d = o.return;
          try {
            Rj(o);
          } catch (b) {
            W(o, d, b);
          }
      }
    } catch (b) {
      W(o, o.return, b);
    }
    if (o === e) {
      V$2 = null;
      break;
    }
    var h = o.sibling;
    if (h !== null) {
      ((h.return = o.return), (V$2 = h));
      break;
    }
    V$2 = o.return;
  }
}
var lk = Math.ceil,
  mk = ua.ReactCurrentDispatcher,
  nk = ua.ReactCurrentOwner,
  ok = ua.ReactCurrentBatchConfig,
  K = 0,
  Q = null,
  Y = null,
  Z = 0,
  fj = 0,
  ej = Uf(0),
  T = 0,
  pk = null,
  rh = 0,
  qk = 0,
  rk = 0,
  sk = null,
  tk = null,
  fk = 0,
  Gj = 1 / 0,
  uk = null,
  Oi = !1,
  Pi = null,
  Ri = null,
  vk = !1,
  wk = null,
  xk = 0,
  yk = 0,
  zk = null,
  Ak = -1,
  Bk = 0;
function R() {
  return K & 6 ? B() : Ak !== -1 ? Ak : (Ak = B());
}
function yi(e) {
  return e.mode & 1
    ? K & 2 && Z !== 0
      ? Z & -Z
      : Kg.transition !== null
        ? (Bk === 0 && (Bk = yc()), Bk)
        : ((e = C),
          e !== 0 || ((e = window.event), (e = e === void 0 ? 16 : jd(e.type))),
          e)
    : 1;
}
function gi(e, o, a, s) {
  if (50 < yk) throw ((yk = 0), (zk = null), Error(p(185)));
  (Ac(e, a, s),
    (!(K & 2) || e !== Q) &&
      (e === Q && (!(K & 2) && (qk |= a), T === 4 && Ck(e, Z)),
      Dk(e, s),
      a === 1 && K === 0 && !(o.mode & 1) && ((Gj = B() + 500), fg && jg())));
}
function Dk(e, o) {
  var a = e.callbackNode;
  wc(e, o);
  var s = uc(e, e === Q ? Z : 0);
  if (s === 0)
    (a !== null && bc(a), (e.callbackNode = null), (e.callbackPriority = 0));
  else if (((o = s & -s), e.callbackPriority !== o)) {
    if ((a != null && bc(a), o === 1))
      (e.tag === 0 ? ig(Ek.bind(null, e)) : hg(Ek.bind(null, e)),
        Jf(function () {
          !(K & 6) && jg();
        }),
        (a = null));
    else {
      switch (Dc(s)) {
        case 1:
          a = fc;
          break;
        case 4:
          a = gc;
          break;
        case 16:
          a = hc;
          break;
        case 536870912:
          a = jc;
          break;
        default:
          a = hc;
      }
      a = Fk(a, Gk.bind(null, e));
    }
    ((e.callbackPriority = o), (e.callbackNode = a));
  }
}
function Gk(e, o) {
  if (((Ak = -1), (Bk = 0), K & 6)) throw Error(p(327));
  var a = e.callbackNode;
  if (Hk() && e.callbackNode !== a) return null;
  var s = uc(e, e === Q ? Z : 0);
  if (s === 0) return null;
  if (s & 30 || s & e.expiredLanes || o) o = Ik(e, s);
  else {
    o = s;
    var i = K;
    K |= 2;
    var c = Jk();
    (Q !== e || Z !== o) && ((uk = null), (Gj = B() + 500), Kk(e, o));
    do
      try {
        Lk();
        break;
      } catch (h) {
        Mk(e, h);
      }
    while (1);
    ($g(),
      (mk.current = c),
      (K = i),
      Y !== null ? (o = 0) : ((Q = null), (Z = 0), (o = T)));
  }
  if (o !== 0) {
    if (
      (o === 2 && ((i = xc(e)), i !== 0 && ((s = i), (o = Nk(e, i)))), o === 1)
    )
      throw ((a = pk), Kk(e, 0), Ck(e, s), Dk(e, B()), a);
    if (o === 6) Ck(e, s);
    else {
      if (
        ((i = e.current.alternate),
        !(s & 30) &&
          !Ok(i) &&
          ((o = Ik(e, s)),
          o === 2 && ((c = xc(e)), c !== 0 && ((s = c), (o = Nk(e, c)))),
          o === 1))
      )
        throw ((a = pk), Kk(e, 0), Ck(e, s), Dk(e, B()), a);
      switch (((e.finishedWork = i), (e.finishedLanes = s), o)) {
        case 0:
        case 1:
          throw Error(p(345));
        case 2:
          Pk(e, tk, uk);
          break;
        case 3:
          if (
            (Ck(e, s), (s & 130023424) === s && ((o = fk + 500 - B()), 10 < o))
          ) {
            if (uc(e, 0) !== 0) break;
            if (((i = e.suspendedLanes), (i & s) !== s)) {
              (R(), (e.pingedLanes |= e.suspendedLanes & i));
              break;
            }
            e.timeoutHandle = Ff(Pk.bind(null, e, tk, uk), o);
            break;
          }
          Pk(e, tk, uk);
          break;
        case 4:
          if ((Ck(e, s), (s & 4194240) === s)) break;
          for (o = e.eventTimes, i = -1; 0 < s; ) {
            var d = 31 - oc(s);
            ((c = 1 << d), (d = o[d]), d > i && (i = d), (s &= ~c));
          }
          if (
            ((s = i),
            (s = B() - s),
            (s =
              (120 > s
                ? 120
                : 480 > s
                  ? 480
                  : 1080 > s
                    ? 1080
                    : 1920 > s
                      ? 1920
                      : 3e3 > s
                        ? 3e3
                        : 4320 > s
                          ? 4320
                          : 1960 * lk(s / 1960)) - s),
            10 < s)
          ) {
            e.timeoutHandle = Ff(Pk.bind(null, e, tk, uk), s);
            break;
          }
          Pk(e, tk, uk);
          break;
        case 5:
          Pk(e, tk, uk);
          break;
        default:
          throw Error(p(329));
      }
    }
  }
  return (Dk(e, B()), e.callbackNode === a ? Gk.bind(null, e) : null);
}
function Nk(e, o) {
  var a = sk;
  return (
    e.current.memoizedState.isDehydrated && (Kk(e, o).flags |= 256),
    (e = Ik(e, o)),
    e !== 2 && ((o = tk), (tk = a), o !== null && Fj(o)),
    e
  );
}
function Fj(e) {
  tk === null ? (tk = e) : tk.push.apply(tk, e);
}
function Ok(e) {
  for (var o = e; ; ) {
    if (o.flags & 16384) {
      var a = o.updateQueue;
      if (a !== null && ((a = a.stores), a !== null))
        for (var s = 0; s < a.length; s++) {
          var i = a[s],
            c = i.getSnapshot;
          i = i.value;
          try {
            if (!He(c(), i)) return !1;
          } catch {
            return !1;
          }
        }
    }
    if (((a = o.child), o.subtreeFlags & 16384 && a !== null))
      ((a.return = o), (o = a));
    else {
      if (o === e) break;
      for (; o.sibling === null; ) {
        if (o.return === null || o.return === e) return !0;
        o = o.return;
      }
      ((o.sibling.return = o.return), (o = o.sibling));
    }
  }
  return !0;
}
function Ck(e, o) {
  for (
    o &= ~rk,
      o &= ~qk,
      e.suspendedLanes |= o,
      e.pingedLanes &= ~o,
      e = e.expirationTimes;
    0 < o;

  ) {
    var a = 31 - oc(o),
      s = 1 << a;
    ((e[a] = -1), (o &= ~s));
  }
}
function Ek(e) {
  if (K & 6) throw Error(p(327));
  Hk();
  var o = uc(e, 0);
  if (!(o & 1)) return (Dk(e, B()), null);
  var a = Ik(e, o);
  if (e.tag !== 0 && a === 2) {
    var s = xc(e);
    s !== 0 && ((o = s), (a = Nk(e, s)));
  }
  if (a === 1) throw ((a = pk), Kk(e, 0), Ck(e, o), Dk(e, B()), a);
  if (a === 6) throw Error(p(345));
  return (
    (e.finishedWork = e.current.alternate),
    (e.finishedLanes = o),
    Pk(e, tk, uk),
    Dk(e, B()),
    null
  );
}
function Qk(e, o) {
  var a = K;
  K |= 1;
  try {
    return e(o);
  } finally {
    ((K = a), K === 0 && ((Gj = B() + 500), fg && jg()));
  }
}
function Rk(e) {
  wk !== null && wk.tag === 0 && !(K & 6) && Hk();
  var o = K;
  K |= 1;
  var a = ok.transition,
    s = C;
  try {
    if (((ok.transition = null), (C = 1), e)) return e();
  } finally {
    ((C = s), (ok.transition = a), (K = o), !(K & 6) && jg());
  }
}
function Hj() {
  ((fj = ej.current), E(ej));
}
function Kk(e, o) {
  ((e.finishedWork = null), (e.finishedLanes = 0));
  var a = e.timeoutHandle;
  if ((a !== -1 && ((e.timeoutHandle = -1), Gf(a)), Y !== null))
    for (a = Y.return; a !== null; ) {
      var s = a;
      switch ((wg(s), s.tag)) {
        case 1:
          ((s = s.type.childContextTypes), s != null && $f());
          break;
        case 3:
          (zh(), E(Wf), E(H), Eh());
          break;
        case 5:
          Bh(s);
          break;
        case 4:
          zh();
          break;
        case 13:
          E(L);
          break;
        case 19:
          E(L);
          break;
        case 10:
          ah(s.type._context);
          break;
        case 22:
        case 23:
          Hj();
      }
      a = a.return;
    }
  if (
    ((Q = e),
    (Y = e = Pg(e.current, null)),
    (Z = fj = o),
    (T = 0),
    (pk = null),
    (rk = qk = rh = 0),
    (tk = sk = null),
    fh !== null)
  ) {
    for (o = 0; o < fh.length; o++)
      if (((a = fh[o]), (s = a.interleaved), s !== null)) {
        a.interleaved = null;
        var i = s.next,
          c = a.pending;
        if (c !== null) {
          var d = c.next;
          ((c.next = i), (s.next = d));
        }
        a.pending = s;
      }
    fh = null;
  }
  return e;
}
function Mk(e, o) {
  do {
    var a = Y;
    try {
      if (($g(), (Fh.current = Rh), Ih)) {
        for (var s = M.memoizedState; s !== null; ) {
          var i = s.queue;
          (i !== null && (i.pending = null), (s = s.next));
        }
        Ih = !1;
      }
      if (
        ((Hh = 0),
        (O = N = M = null),
        (Jh = !1),
        (Kh = 0),
        (nk.current = null),
        a === null || a.return === null)
      ) {
        ((T = 1), (pk = o), (Y = null));
        break;
      }
      e: {
        var c = e,
          d = a.return,
          h = a,
          b = o;
        if (
          ((o = Z),
          (h.flags |= 32768),
          b !== null && typeof b == 'object' && typeof b.then == 'function')
        ) {
          var g = b,
            $ = h,
            _ = $.tag;
          if (!($.mode & 1) && (_ === 0 || _ === 11 || _ === 15)) {
            var _e = $.alternate;
            _e
              ? (($.updateQueue = _e.updateQueue),
                ($.memoizedState = _e.memoizedState),
                ($.lanes = _e.lanes))
              : (($.updateQueue = null), ($.memoizedState = null));
          }
          var ot = Ui(d);
          if (ot !== null) {
            ((ot.flags &= -257),
              Vi(ot, d, h, c, o),
              ot.mode & 1 && Si(c, g, o),
              (o = ot),
              (b = g));
            var j = o.updateQueue;
            if (j === null) {
              var nt = new Set();
              (nt.add(b), (o.updateQueue = nt));
            } else j.add(b);
            break e;
          } else {
            if (!(o & 1)) {
              (Si(c, g, o), tj());
              break e;
            }
            b = Error(p(426));
          }
        } else if (I && h.mode & 1) {
          var lt = Ui(d);
          if (lt !== null) {
            (!(lt.flags & 65536) && (lt.flags |= 256),
              Vi(lt, d, h, c, o),
              Jg(Ji(b, h)));
            break e;
          }
        }
        ((c = b = Ji(b, h)),
          T !== 4 && (T = 2),
          sk === null ? (sk = [c]) : sk.push(c),
          (c = d));
        do {
          switch (c.tag) {
            case 3:
              ((c.flags |= 65536), (o &= -o), (c.lanes |= o));
              var tt = Ni(c, b, o);
              ph(c, tt);
              break e;
            case 1:
              h = b;
              var et = c.type,
                rt = c.stateNode;
              if (
                !(c.flags & 128) &&
                (typeof et.getDerivedStateFromError == 'function' ||
                  (rt !== null &&
                    typeof rt.componentDidCatch == 'function' &&
                    (Ri === null || !Ri.has(rt))))
              ) {
                ((c.flags |= 65536), (o &= -o), (c.lanes |= o));
                var at = Qi(c, h, o);
                ph(c, at);
                break e;
              }
          }
          c = c.return;
        } while (c !== null);
      }
      Sk(a);
    } catch (ct) {
      ((o = ct), Y === a && a !== null && (Y = a = a.return));
      continue;
    }
    break;
  } while (1);
}
function Jk() {
  var e = mk.current;
  return ((mk.current = Rh), e === null ? Rh : e);
}
function tj() {
  ((T === 0 || T === 3 || T === 2) && (T = 4),
    Q === null || (!(rh & 268435455) && !(qk & 268435455)) || Ck(Q, Z));
}
function Ik(e, o) {
  var a = K;
  K |= 2;
  var s = Jk();
  (Q !== e || Z !== o) && ((uk = null), Kk(e, o));
  do
    try {
      Tk();
      break;
    } catch (i) {
      Mk(e, i);
    }
  while (1);
  if (($g(), (K = a), (mk.current = s), Y !== null)) throw Error(p(261));
  return ((Q = null), (Z = 0), T);
}
function Tk() {
  for (; Y !== null; ) Uk(Y);
}
function Lk() {
  for (; Y !== null && !cc(); ) Uk(Y);
}
function Uk(e) {
  var o = Vk(e.alternate, e, fj);
  ((e.memoizedProps = e.pendingProps),
    o === null ? Sk(e) : (Y = o),
    (nk.current = null));
}
function Sk(e) {
  var o = e;
  do {
    var a = o.alternate;
    if (((e = o.return), o.flags & 32768)) {
      if (((a = Ij(a, o)), a !== null)) {
        ((a.flags &= 32767), (Y = a));
        return;
      }
      if (e !== null)
        ((e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null));
      else {
        ((T = 6), (Y = null));
        return;
      }
    } else if (((a = Ej(a, o, fj)), a !== null)) {
      Y = a;
      return;
    }
    if (((o = o.sibling), o !== null)) {
      Y = o;
      return;
    }
    Y = o = e;
  } while (o !== null);
  T === 0 && (T = 5);
}
function Pk(e, o, a) {
  var s = C,
    i = ok.transition;
  try {
    ((ok.transition = null), (C = 1), Wk(e, o, a, s));
  } finally {
    ((ok.transition = i), (C = s));
  }
  return null;
}
function Wk(e, o, a, s) {
  do Hk();
  while (wk !== null);
  if (K & 6) throw Error(p(327));
  a = e.finishedWork;
  var i = e.finishedLanes;
  if (a === null) return null;
  if (((e.finishedWork = null), (e.finishedLanes = 0), a === e.current))
    throw Error(p(177));
  ((e.callbackNode = null), (e.callbackPriority = 0));
  var c = a.lanes | a.childLanes;
  if (
    (Bc(e, c),
    e === Q && ((Y = Q = null), (Z = 0)),
    (!(a.subtreeFlags & 2064) && !(a.flags & 2064)) ||
      vk ||
      ((vk = !0),
      Fk(hc, function () {
        return (Hk(), null);
      })),
    (c = (a.flags & 15990) !== 0),
    a.subtreeFlags & 15990 || c)
  ) {
    ((c = ok.transition), (ok.transition = null));
    var d = C;
    C = 1;
    var h = K;
    ((K |= 4),
      (nk.current = null),
      Oj(e, a),
      dk(a, e),
      Oe(Df),
      (dd = !!Cf),
      (Df = Cf = null),
      (e.current = a),
      hk(a),
      dc(),
      (K = h),
      (C = d),
      (ok.transition = c));
  } else e.current = a;
  if (
    (vk && ((vk = !1), (wk = e), (xk = i)),
    (c = e.pendingLanes),
    c === 0 && (Ri = null),
    mc(a.stateNode),
    Dk(e, B()),
    o !== null)
  )
    for (s = e.onRecoverableError, a = 0; a < o.length; a++)
      ((i = o[a]), s(i.value, { componentStack: i.stack, digest: i.digest }));
  if (Oi) throw ((Oi = !1), (e = Pi), (Pi = null), e);
  return (
    xk & 1 && e.tag !== 0 && Hk(),
    (c = e.pendingLanes),
    c & 1 ? (e === zk ? yk++ : ((yk = 0), (zk = e))) : (yk = 0),
    jg(),
    null
  );
}
function Hk() {
  if (wk !== null) {
    var e = Dc(xk),
      o = ok.transition,
      a = C;
    try {
      if (((ok.transition = null), (C = 16 > e ? 16 : e), wk === null))
        var s = !1;
      else {
        if (((e = wk), (wk = null), (xk = 0), K & 6)) throw Error(p(331));
        var i = K;
        for (K |= 4, V$2 = e.current; V$2 !== null; ) {
          var c = V$2,
            d = c.child;
          if (V$2.flags & 16) {
            var h = c.deletions;
            if (h !== null) {
              for (var b = 0; b < h.length; b++) {
                var g = h[b];
                for (V$2 = g; V$2 !== null; ) {
                  var $ = V$2;
                  switch ($.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Pj(8, $, c);
                  }
                  var _ = $.child;
                  if (_ !== null) ((_.return = $), (V$2 = _));
                  else
                    for (; V$2 !== null; ) {
                      $ = V$2;
                      var _e = $.sibling,
                        ot = $.return;
                      if ((Sj($), $ === g)) {
                        V$2 = null;
                        break;
                      }
                      if (_e !== null) {
                        ((_e.return = ot), (V$2 = _e));
                        break;
                      }
                      V$2 = ot;
                    }
                }
              }
              var j = c.alternate;
              if (j !== null) {
                var nt = j.child;
                if (nt !== null) {
                  j.child = null;
                  do {
                    var lt = nt.sibling;
                    ((nt.sibling = null), (nt = lt));
                  } while (nt !== null);
                }
              }
              V$2 = c;
            }
          }
          if (c.subtreeFlags & 2064 && d !== null) ((d.return = c), (V$2 = d));
          else
            e: for (; V$2 !== null; ) {
              if (((c = V$2), c.flags & 2048))
                switch (c.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Pj(9, c, c.return);
                }
              var tt = c.sibling;
              if (tt !== null) {
                ((tt.return = c.return), (V$2 = tt));
                break e;
              }
              V$2 = c.return;
            }
        }
        var et = e.current;
        for (V$2 = et; V$2 !== null; ) {
          d = V$2;
          var rt = d.child;
          if (d.subtreeFlags & 2064 && rt !== null)
            ((rt.return = d), (V$2 = rt));
          else
            e: for (d = et; V$2 !== null; ) {
              if (((h = V$2), h.flags & 2048))
                try {
                  switch (h.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Qj(9, h);
                  }
                } catch (ct) {
                  W(h, h.return, ct);
                }
              if (h === d) {
                V$2 = null;
                break e;
              }
              var at = h.sibling;
              if (at !== null) {
                ((at.return = h.return), (V$2 = at));
                break e;
              }
              V$2 = h.return;
            }
        }
        if (
          ((K = i), jg(), lc && typeof lc.onPostCommitFiberRoot == 'function')
        )
          try {
            lc.onPostCommitFiberRoot(kc, e);
          } catch {}
        s = !0;
      }
      return s;
    } finally {
      ((C = a), (ok.transition = o));
    }
  }
  return !1;
}
function Xk(e, o, a) {
  ((o = Ji(a, o)),
    (o = Ni(e, o, 1)),
    (e = nh(e, o, 1)),
    (o = R()),
    e !== null && (Ac(e, 1, o), Dk(e, o)));
}
function W(e, o, a) {
  if (e.tag === 3) Xk(e, e, a);
  else
    for (; o !== null; ) {
      if (o.tag === 3) {
        Xk(o, e, a);
        break;
      } else if (o.tag === 1) {
        var s = o.stateNode;
        if (
          typeof o.type.getDerivedStateFromError == 'function' ||
          (typeof s.componentDidCatch == 'function' &&
            (Ri === null || !Ri.has(s)))
        ) {
          ((e = Ji(a, e)),
            (e = Qi(o, e, 1)),
            (o = nh(o, e, 1)),
            (e = R()),
            o !== null && (Ac(o, 1, e), Dk(o, e)));
          break;
        }
      }
      o = o.return;
    }
}
function Ti(e, o, a) {
  var s = e.pingCache;
  (s !== null && s.delete(o),
    (o = R()),
    (e.pingedLanes |= e.suspendedLanes & a),
    Q === e &&
      (Z & a) === a &&
      (T === 4 || (T === 3 && (Z & 130023424) === Z && 500 > B() - fk)
        ? Kk(e, 0)
        : (rk |= a)),
    Dk(e, o));
}
function Yk(e, o) {
  o === 0 &&
    (e.mode & 1
      ? ((o = sc), (sc <<= 1), !(sc & 130023424) && (sc = 4194304))
      : (o = 1));
  var a = R();
  ((e = ih(e, o)), e !== null && (Ac(e, o, a), Dk(e, a)));
}
function uj(e) {
  var o = e.memoizedState,
    a = 0;
  (o !== null && (a = o.retryLane), Yk(e, a));
}
function bk(e, o) {
  var a = 0;
  switch (e.tag) {
    case 13:
      var s = e.stateNode,
        i = e.memoizedState;
      i !== null && (a = i.retryLane);
      break;
    case 19:
      s = e.stateNode;
      break;
    default:
      throw Error(p(314));
  }
  (s !== null && s.delete(o), Yk(e, a));
}
var Vk;
Vk = function (e, o, a) {
  if (e !== null)
    if (e.memoizedProps !== o.pendingProps || Wf.current) dh = !0;
    else {
      if (!(e.lanes & a) && !(o.flags & 128)) return ((dh = !1), yj(e, o, a));
      dh = !!(e.flags & 131072);
    }
  else ((dh = !1), I && o.flags & 1048576 && ug(o, ng, o.index));
  switch (((o.lanes = 0), o.tag)) {
    case 2:
      var s = o.type;
      (ij(e, o), (e = o.pendingProps));
      var i = Yf(o, H.current);
      (ch(o, a), (i = Nh(null, o, s, e, i, a)));
      var c = Sh();
      return (
        (o.flags |= 1),
        typeof i == 'object' &&
        i !== null &&
        typeof i.render == 'function' &&
        i.$$typeof === void 0
          ? ((o.tag = 1),
            (o.memoizedState = null),
            (o.updateQueue = null),
            Zf(s) ? ((c = !0), cg(o)) : (c = !1),
            (o.memoizedState =
              i.state !== null && i.state !== void 0 ? i.state : null),
            kh(o),
            (i.updater = Ei),
            (o.stateNode = i),
            (i._reactInternals = o),
            Ii(o, s, e, a),
            (o = jj(null, o, s, !0, c, a)))
          : ((o.tag = 0), I && c && vg(o), Xi(null, o, i, a), (o = o.child)),
        o
      );
    case 16:
      s = o.elementType;
      e: {
        switch (
          (ij(e, o),
          (e = o.pendingProps),
          (i = s._init),
          (s = i(s._payload)),
          (o.type = s),
          (i = o.tag = Zk(s)),
          (e = Ci(s, e)),
          i)
        ) {
          case 0:
            o = cj(null, o, s, e, a);
            break e;
          case 1:
            o = hj(null, o, s, e, a);
            break e;
          case 11:
            o = Yi(null, o, s, e, a);
            break e;
          case 14:
            o = $i(null, o, s, Ci(s.type, e), a);
            break e;
        }
        throw Error(p(306, s, ''));
      }
      return o;
    case 0:
      return (
        (s = o.type),
        (i = o.pendingProps),
        (i = o.elementType === s ? i : Ci(s, i)),
        cj(e, o, s, i, a)
      );
    case 1:
      return (
        (s = o.type),
        (i = o.pendingProps),
        (i = o.elementType === s ? i : Ci(s, i)),
        hj(e, o, s, i, a)
      );
    case 3:
      e: {
        if ((kj(o), e === null)) throw Error(p(387));
        ((s = o.pendingProps),
          (c = o.memoizedState),
          (i = c.element),
          lh(e, o),
          qh(o, s, null, a));
        var d = o.memoizedState;
        if (((s = d.element), c.isDehydrated))
          if (
            ((c = {
              element: s,
              isDehydrated: !1,
              cache: d.cache,
              pendingSuspenseBoundaries: d.pendingSuspenseBoundaries,
              transitions: d.transitions,
            }),
            (o.updateQueue.baseState = c),
            (o.memoizedState = c),
            o.flags & 256)
          ) {
            ((i = Ji(Error(p(423)), o)), (o = lj(e, o, s, a, i)));
            break e;
          } else if (s !== i) {
            ((i = Ji(Error(p(424)), o)), (o = lj(e, o, s, a, i)));
            break e;
          } else
            for (
              yg = Lf(o.stateNode.containerInfo.firstChild),
                xg = o,
                I = !0,
                zg = null,
                a = Vg(o, null, s, a),
                o.child = a;
              a;

            )
              ((a.flags = (a.flags & -3) | 4096), (a = a.sibling));
        else {
          if ((Ig(), s === i)) {
            o = Zi(e, o, a);
            break e;
          }
          Xi(e, o, s, a);
        }
        o = o.child;
      }
      return o;
    case 5:
      return (
        Ah(o),
        e === null && Eg(o),
        (s = o.type),
        (i = o.pendingProps),
        (c = e !== null ? e.memoizedProps : null),
        (d = i.children),
        Ef(s, i) ? (d = null) : c !== null && Ef(s, c) && (o.flags |= 32),
        gj(e, o),
        Xi(e, o, d, a),
        o.child
      );
    case 6:
      return (e === null && Eg(o), null);
    case 13:
      return oj(e, o, a);
    case 4:
      return (
        yh(o, o.stateNode.containerInfo),
        (s = o.pendingProps),
        e === null ? (o.child = Ug(o, null, s, a)) : Xi(e, o, s, a),
        o.child
      );
    case 11:
      return (
        (s = o.type),
        (i = o.pendingProps),
        (i = o.elementType === s ? i : Ci(s, i)),
        Yi(e, o, s, i, a)
      );
    case 7:
      return (Xi(e, o, o.pendingProps, a), o.child);
    case 8:
      return (Xi(e, o, o.pendingProps.children, a), o.child);
    case 12:
      return (Xi(e, o, o.pendingProps.children, a), o.child);
    case 10:
      e: {
        if (
          ((s = o.type._context),
          (i = o.pendingProps),
          (c = o.memoizedProps),
          (d = i.value),
          G(Wg, s._currentValue),
          (s._currentValue = d),
          c !== null)
        )
          if (He(c.value, d)) {
            if (c.children === i.children && !Wf.current) {
              o = Zi(e, o, a);
              break e;
            }
          } else
            for (c = o.child, c !== null && (c.return = o); c !== null; ) {
              var h = c.dependencies;
              if (h !== null) {
                d = c.child;
                for (var b = h.firstContext; b !== null; ) {
                  if (b.context === s) {
                    if (c.tag === 1) {
                      ((b = mh(-1, a & -a)), (b.tag = 2));
                      var g = c.updateQueue;
                      if (g !== null) {
                        g = g.shared;
                        var $ = g.pending;
                        ($ === null
                          ? (b.next = b)
                          : ((b.next = $.next), ($.next = b)),
                          (g.pending = b));
                      }
                    }
                    ((c.lanes |= a),
                      (b = c.alternate),
                      b !== null && (b.lanes |= a),
                      bh(c.return, a, o),
                      (h.lanes |= a));
                    break;
                  }
                  b = b.next;
                }
              } else if (c.tag === 10) d = c.type === o.type ? null : c.child;
              else if (c.tag === 18) {
                if (((d = c.return), d === null)) throw Error(p(341));
                ((d.lanes |= a),
                  (h = d.alternate),
                  h !== null && (h.lanes |= a),
                  bh(d, a, o),
                  (d = c.sibling));
              } else d = c.child;
              if (d !== null) d.return = c;
              else
                for (d = c; d !== null; ) {
                  if (d === o) {
                    d = null;
                    break;
                  }
                  if (((c = d.sibling), c !== null)) {
                    ((c.return = d.return), (d = c));
                    break;
                  }
                  d = d.return;
                }
              c = d;
            }
        (Xi(e, o, i.children, a), (o = o.child));
      }
      return o;
    case 9:
      return (
        (i = o.type),
        (s = o.pendingProps.children),
        ch(o, a),
        (i = eh(i)),
        (s = s(i)),
        (o.flags |= 1),
        Xi(e, o, s, a),
        o.child
      );
    case 14:
      return (
        (s = o.type),
        (i = Ci(s, o.pendingProps)),
        (i = Ci(s.type, i)),
        $i(e, o, s, i, a)
      );
    case 15:
      return bj(e, o, o.type, o.pendingProps, a);
    case 17:
      return (
        (s = o.type),
        (i = o.pendingProps),
        (i = o.elementType === s ? i : Ci(s, i)),
        ij(e, o),
        (o.tag = 1),
        Zf(s) ? ((e = !0), cg(o)) : (e = !1),
        ch(o, a),
        Gi(o, s, i),
        Ii(o, s, i, a),
        jj(null, o, s, !0, e, a)
      );
    case 19:
      return xj(e, o, a);
    case 22:
      return dj(e, o, a);
  }
  throw Error(p(156, o.tag));
};
function Fk(e, o) {
  return ac(e, o);
}
function $k(e, o, a, s) {
  ((this.tag = e),
    (this.key = a),
    (this.sibling =
      this.child =
      this.return =
      this.stateNode =
      this.type =
      this.elementType =
        null),
    (this.index = 0),
    (this.ref = null),
    (this.pendingProps = o),
    (this.dependencies =
      this.memoizedState =
      this.updateQueue =
      this.memoizedProps =
        null),
    (this.mode = s),
    (this.subtreeFlags = this.flags = 0),
    (this.deletions = null),
    (this.childLanes = this.lanes = 0),
    (this.alternate = null));
}
function Bg(e, o, a, s) {
  return new $k(e, o, a, s);
}
function aj(e) {
  return ((e = e.prototype), !(!e || !e.isReactComponent));
}
function Zk(e) {
  if (typeof e == 'function') return aj(e) ? 1 : 0;
  if (e != null) {
    if (((e = e.$$typeof), e === Da)) return 11;
    if (e === Ga) return 14;
  }
  return 2;
}
function Pg(e, o) {
  var a = e.alternate;
  return (
    a === null
      ? ((a = Bg(e.tag, o, e.key, e.mode)),
        (a.elementType = e.elementType),
        (a.type = e.type),
        (a.stateNode = e.stateNode),
        (a.alternate = e),
        (e.alternate = a))
      : ((a.pendingProps = o),
        (a.type = e.type),
        (a.flags = 0),
        (a.subtreeFlags = 0),
        (a.deletions = null)),
    (a.flags = e.flags & 14680064),
    (a.childLanes = e.childLanes),
    (a.lanes = e.lanes),
    (a.child = e.child),
    (a.memoizedProps = e.memoizedProps),
    (a.memoizedState = e.memoizedState),
    (a.updateQueue = e.updateQueue),
    (o = e.dependencies),
    (a.dependencies =
      o === null ? null : { lanes: o.lanes, firstContext: o.firstContext }),
    (a.sibling = e.sibling),
    (a.index = e.index),
    (a.ref = e.ref),
    a
  );
}
function Rg(e, o, a, s, i, c) {
  var d = 2;
  if (((s = e), typeof e == 'function')) aj(e) && (d = 1);
  else if (typeof e == 'string') d = 5;
  else
    e: switch (e) {
      case ya:
        return Tg(a.children, i, c, o);
      case za:
        ((d = 8), (i |= 8));
        break;
      case Aa:
        return (
          (e = Bg(12, a, o, i | 2)),
          (e.elementType = Aa),
          (e.lanes = c),
          e
        );
      case Ea:
        return ((e = Bg(13, a, o, i)), (e.elementType = Ea), (e.lanes = c), e);
      case Fa:
        return ((e = Bg(19, a, o, i)), (e.elementType = Fa), (e.lanes = c), e);
      case Ia:
        return pj(a, i, c, o);
      default:
        if (typeof e == 'object' && e !== null)
          switch (e.$$typeof) {
            case Ba:
              d = 10;
              break e;
            case Ca:
              d = 9;
              break e;
            case Da:
              d = 11;
              break e;
            case Ga:
              d = 14;
              break e;
            case Ha:
              ((d = 16), (s = null));
              break e;
          }
        throw Error(p(130, e == null ? e : typeof e, ''));
    }
  return (
    (o = Bg(d, a, o, i)),
    (o.elementType = e),
    (o.type = s),
    (o.lanes = c),
    o
  );
}
function Tg(e, o, a, s) {
  return ((e = Bg(7, e, s, o)), (e.lanes = a), e);
}
function pj(e, o, a, s) {
  return (
    (e = Bg(22, e, s, o)),
    (e.elementType = Ia),
    (e.lanes = a),
    (e.stateNode = { isHidden: !1 }),
    e
  );
}
function Qg(e, o, a) {
  return ((e = Bg(6, e, null, o)), (e.lanes = a), e);
}
function Sg(e, o, a) {
  return (
    (o = Bg(4, e.children !== null ? e.children : [], e.key, o)),
    (o.lanes = a),
    (o.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation,
    }),
    o
  );
}
function al(e, o, a, s, i) {
  ((this.tag = o),
    (this.containerInfo = e),
    (this.finishedWork =
      this.pingCache =
      this.current =
      this.pendingChildren =
        null),
    (this.timeoutHandle = -1),
    (this.callbackNode = this.pendingContext = this.context = null),
    (this.callbackPriority = 0),
    (this.eventTimes = zc(0)),
    (this.expirationTimes = zc(-1)),
    (this.entangledLanes =
      this.finishedLanes =
      this.mutableReadLanes =
      this.expiredLanes =
      this.pingedLanes =
      this.suspendedLanes =
      this.pendingLanes =
        0),
    (this.entanglements = zc(0)),
    (this.identifierPrefix = s),
    (this.onRecoverableError = i),
    (this.mutableSourceEagerHydrationData = null));
}
function bl(e, o, a, s, i, c, d, h, b) {
  return (
    (e = new al(e, o, a, h, b)),
    o === 1 ? ((o = 1), c === !0 && (o |= 8)) : (o = 0),
    (c = Bg(3, null, null, o)),
    (e.current = c),
    (c.stateNode = e),
    (c.memoizedState = {
      element: s,
      isDehydrated: a,
      cache: null,
      transitions: null,
      pendingSuspenseBoundaries: null,
    }),
    kh(c),
    e
  );
}
function cl(e, o, a) {
  var s = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: wa,
    key: s == null ? null : '' + s,
    children: e,
    containerInfo: o,
    implementation: a,
  };
}
function dl(e) {
  if (!e) return Vf;
  e = e._reactInternals;
  e: {
    if (Vb(e) !== e || e.tag !== 1) throw Error(p(170));
    var o = e;
    do {
      switch (o.tag) {
        case 3:
          o = o.stateNode.context;
          break e;
        case 1:
          if (Zf(o.type)) {
            o = o.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      o = o.return;
    } while (o !== null);
    throw Error(p(171));
  }
  if (e.tag === 1) {
    var a = e.type;
    if (Zf(a)) return bg(e, a, o);
  }
  return o;
}
function el(e, o, a, s, i, c, d, h, b) {
  return (
    (e = bl(a, s, !0, e, i, c, d, h, b)),
    (e.context = dl(null)),
    (a = e.current),
    (s = R()),
    (i = yi(a)),
    (c = mh(s, i)),
    (c.callback = o ?? null),
    nh(a, c, i),
    (e.current.lanes = i),
    Ac(e, i, s),
    Dk(e, s),
    e
  );
}
function fl(e, o, a, s) {
  var i = o.current,
    c = R(),
    d = yi(i);
  return (
    (a = dl(a)),
    o.context === null ? (o.context = a) : (o.pendingContext = a),
    (o = mh(c, d)),
    (o.payload = { element: e }),
    (s = s === void 0 ? null : s),
    s !== null && (o.callback = s),
    (e = nh(i, o, d)),
    e !== null && (gi(e, i, d, c), oh(e, i, d)),
    d
  );
}
function gl(e) {
  if (((e = e.current), !e.child)) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function hl(e, o) {
  if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
    var a = e.retryLane;
    e.retryLane = a !== 0 && a < o ? a : o;
  }
}
function il(e, o) {
  (hl(e, o), (e = e.alternate) && hl(e, o));
}
function jl() {
  return null;
}
var kl =
  typeof reportError == 'function'
    ? reportError
    : function (e) {
        console.error(e);
      };
function ll(e) {
  this._internalRoot = e;
}
ml.prototype.render = ll.prototype.render = function (e) {
  var o = this._internalRoot;
  if (o === null) throw Error(p(409));
  fl(e, o, null, null);
};
ml.prototype.unmount = ll.prototype.unmount = function () {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var o = e.containerInfo;
    (Rk(function () {
      fl(null, e, null, null);
    }),
      (o[uf] = null));
  }
};
function ml(e) {
  this._internalRoot = e;
}
ml.prototype.unstable_scheduleHydration = function (e) {
  if (e) {
    var o = Hc();
    e = { blockedOn: null, target: e, priority: o };
    for (var a = 0; a < Qc.length && o !== 0 && o < Qc[a].priority; a++);
    (Qc.splice(a, 0, e), a === 0 && Vc(e));
  }
};
function nl(e) {
  return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
}
function ol(e) {
  return !(
    !e ||
    (e.nodeType !== 1 &&
      e.nodeType !== 9 &&
      e.nodeType !== 11 &&
      (e.nodeType !== 8 || e.nodeValue !== ' react-mount-point-unstable '))
  );
}
function pl() {}
function ql(e, o, a, s, i) {
  if (i) {
    if (typeof s == 'function') {
      var c = s;
      s = function () {
        var g = gl(d);
        c.call(g);
      };
    }
    var d = el(o, s, e, 0, null, !1, !1, '', pl);
    return (
      (e._reactRootContainer = d),
      (e[uf] = d.current),
      sf(e.nodeType === 8 ? e.parentNode : e),
      Rk(),
      d
    );
  }
  for (; (i = e.lastChild); ) e.removeChild(i);
  if (typeof s == 'function') {
    var h = s;
    s = function () {
      var g = gl(b);
      h.call(g);
    };
  }
  var b = bl(e, 0, !1, null, null, !1, !1, '', pl);
  return (
    (e._reactRootContainer = b),
    (e[uf] = b.current),
    sf(e.nodeType === 8 ? e.parentNode : e),
    Rk(function () {
      fl(o, b, a, s);
    }),
    b
  );
}
function rl(e, o, a, s, i) {
  var c = a._reactRootContainer;
  if (c) {
    var d = c;
    if (typeof i == 'function') {
      var h = i;
      i = function () {
        var b = gl(d);
        h.call(b);
      };
    }
    fl(o, d, e, i);
  } else d = ql(a, o, e, i, s);
  return gl(d);
}
Ec = function (e) {
  switch (e.tag) {
    case 3:
      var o = e.stateNode;
      if (o.current.memoizedState.isDehydrated) {
        var a = tc(o.pendingLanes);
        a !== 0 &&
          (Cc(o, a | 1), Dk(o, B()), !(K & 6) && ((Gj = B() + 500), jg()));
      }
      break;
    case 13:
      (Rk(function () {
        var s = ih(e, 1);
        if (s !== null) {
          var i = R();
          gi(s, e, 1, i);
        }
      }),
        il(e, 1));
  }
};
Fc = function (e) {
  if (e.tag === 13) {
    var o = ih(e, 134217728);
    if (o !== null) {
      var a = R();
      gi(o, e, 134217728, a);
    }
    il(e, 134217728);
  }
};
Gc = function (e) {
  if (e.tag === 13) {
    var o = yi(e),
      a = ih(e, o);
    if (a !== null) {
      var s = R();
      gi(a, e, o, s);
    }
    il(e, o);
  }
};
Hc = function () {
  return C;
};
Ic = function (e, o) {
  var a = C;
  try {
    return ((C = e), o());
  } finally {
    C = a;
  }
};
yb = function (e, o, a) {
  switch (o) {
    case 'input':
      if ((bb(e, a), (o = a.name), a.type === 'radio' && o != null)) {
        for (a = e; a.parentNode; ) a = a.parentNode;
        for (
          a = a.querySelectorAll(
            'input[name=' + JSON.stringify('' + o) + '][type="radio"]'
          ),
            o = 0;
          o < a.length;
          o++
        ) {
          var s = a[o];
          if (s !== e && s.form === e.form) {
            var i = Db(s);
            if (!i) throw Error(p(90));
            (Wa(s), bb(s, i));
          }
        }
      }
      break;
    case 'textarea':
      ib(e, a);
      break;
    case 'select':
      ((o = a.value), o != null && fb(e, !!a.multiple, o, !1));
  }
};
Gb = Qk;
Hb = Rk;
var sl = { usingClientEntryPoint: !1, Events: [Cb, ue, Db, Eb, Fb, Qk] },
  tl = {
    findFiberByHostInstance: Wc,
    bundleType: 0,
    version: '18.3.1',
    rendererPackageName: 'react-dom',
  },
  ul = {
    bundleType: tl.bundleType,
    version: tl.version,
    rendererPackageName: tl.rendererPackageName,
    rendererConfig: tl.rendererConfig,
    overrideHookState: null,
    overrideHookStateDeletePath: null,
    overrideHookStateRenamePath: null,
    overrideProps: null,
    overridePropsDeletePath: null,
    overridePropsRenamePath: null,
    setErrorHandler: null,
    setSuspenseHandler: null,
    scheduleUpdate: null,
    currentDispatcherRef: ua.ReactCurrentDispatcher,
    findHostInstanceByFiber: function (e) {
      return ((e = Zb(e)), e === null ? null : e.stateNode);
    },
    findFiberByHostInstance: tl.findFiberByHostInstance || jl,
    findHostInstancesForRefresh: null,
    scheduleRefresh: null,
    scheduleRoot: null,
    setRefreshHandler: null,
    getCurrentFiber: null,
    reconcilerVersion: '18.3.1-next-f1338f8080-20240426',
  };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < 'u') {
  var vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!vl.isDisabled && vl.supportsFiber)
    try {
      ((kc = vl.inject(ul)), (lc = vl));
    } catch {}
}
reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
reactDom_production_min.createPortal = function (e, o) {
  var a = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!nl(o)) throw Error(p(200));
  return cl(e, o, null, a);
};
reactDom_production_min.createRoot = function (e, o) {
  if (!nl(e)) throw Error(p(299));
  var a = !1,
    s = '',
    i = kl;
  return (
    o != null &&
      (o.unstable_strictMode === !0 && (a = !0),
      o.identifierPrefix !== void 0 && (s = o.identifierPrefix),
      o.onRecoverableError !== void 0 && (i = o.onRecoverableError)),
    (o = bl(e, 1, !1, null, null, a, !1, s, i)),
    (e[uf] = o.current),
    sf(e.nodeType === 8 ? e.parentNode : e),
    new ll(o)
  );
};
reactDom_production_min.findDOMNode = function (e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var o = e._reactInternals;
  if (o === void 0)
    throw typeof e.render == 'function'
      ? Error(p(188))
      : ((e = Object.keys(e).join(',')), Error(p(268, e)));
  return ((e = Zb(o)), (e = e === null ? null : e.stateNode), e);
};
reactDom_production_min.flushSync = function (e) {
  return Rk(e);
};
reactDom_production_min.hydrate = function (e, o, a) {
  if (!ol(o)) throw Error(p(200));
  return rl(null, e, o, !0, a);
};
reactDom_production_min.hydrateRoot = function (e, o, a) {
  if (!nl(e)) throw Error(p(405));
  var s = (a != null && a.hydratedSources) || null,
    i = !1,
    c = '',
    d = kl;
  if (
    (a != null &&
      (a.unstable_strictMode === !0 && (i = !0),
      a.identifierPrefix !== void 0 && (c = a.identifierPrefix),
      a.onRecoverableError !== void 0 && (d = a.onRecoverableError)),
    (o = el(o, null, e, 1, a ?? null, i, !1, c, d)),
    (e[uf] = o.current),
    sf(e),
    s)
  )
    for (e = 0; e < s.length; e++)
      ((a = s[e]),
        (i = a._getVersion),
        (i = i(a._source)),
        o.mutableSourceEagerHydrationData == null
          ? (o.mutableSourceEagerHydrationData = [a, i])
          : o.mutableSourceEagerHydrationData.push(a, i));
  return new ml(o);
};
reactDom_production_min.render = function (e, o, a) {
  if (!ol(o)) throw Error(p(200));
  return rl(null, e, o, !1, a);
};
reactDom_production_min.unmountComponentAtNode = function (e) {
  if (!ol(e)) throw Error(p(40));
  return e._reactRootContainer
    ? (Rk(function () {
        rl(null, null, e, !1, function () {
          ((e._reactRootContainer = null), (e[uf] = null));
        });
      }),
      !0)
    : !1;
};
reactDom_production_min.unstable_batchedUpdates = Qk;
reactDom_production_min.unstable_renderSubtreeIntoContainer = function (
  e,
  o,
  a,
  s
) {
  if (!ol(a)) throw Error(p(200));
  if (e == null || e._reactInternals === void 0) throw Error(p(38));
  return rl(e, o, a, !1, s);
};
reactDom_production_min.version = '18.3.1-next-f1338f8080-20240426';
function checkDCE() {
  if (
    !(
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' ||
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'
    )
  )
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
    } catch (e) {
      console.error(e);
    }
}
(checkDCE(), (reactDom.exports = reactDom_production_min));
var reactDomExports = reactDom.exports,
  m = reactDomExports;
((client.createRoot = m.createRoot), (client.hydrateRoot = m.hydrateRoot));
const scriptRel = 'modulepreload',
  assetsURL = function (e) {
    return '/' + e;
  },
  seen = {},
  __vitePreload = function (o, a, s) {
    if (!a || a.length === 0) return o();
    const i = document.getElementsByTagName('link');
    return Promise.all(
      a.map((c) => {
        if (((c = assetsURL(c)), c in seen)) return;
        seen[c] = !0;
        const d = c.endsWith('.css'),
          h = d ? '[rel="stylesheet"]' : '';
        if (!!s)
          for (let $ = i.length - 1; $ >= 0; $--) {
            const _ = i[$];
            if (_.href === c && (!d || _.rel === 'stylesheet')) return;
          }
        else if (document.querySelector(`link[href="${c}"]${h}`)) return;
        const g = document.createElement('link');
        if (
          ((g.rel = d ? 'stylesheet' : scriptRel),
          d || ((g.as = 'script'), (g.crossOrigin = '')),
          (g.href = c),
          document.head.appendChild(g),
          d)
        )
          return new Promise(($, _) => {
            (g.addEventListener('load', $),
              g.addEventListener('error', () =>
                _(new Error(`Unable to preload CSS for ${c}`))
              ));
          });
      })
    )
      .then(() => o())
      .catch((c) => {
        const d = new Event('vite:preloadError', { cancelable: !0 });
        if (((d.payload = c), window.dispatchEvent(d), !d.defaultPrevented))
          throw c;
      });
  };
class MockFabricContract {
  async submit(o, ...a) {
    (console.log(`Mock Fabric: Submitting transaction ${o} with args:`, a),
      await new Promise((i) => setTimeout(i, 1e3)));
    const s = `tx-${Date.now()}`;
    return {
      getTransactionID: () => s,
      transactionId: s,
      status: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }
  async evaluate(o, ...a) {
    switch (
      (console.log(`Mock Fabric: Evaluating transaction ${o} with args:`, a),
      await new Promise((s) => setTimeout(s, 500)),
      o)
    ) {
      case 'GetExportStatus':
        return {
          exportId: a[0],
          status: 'PENDING',
          validations: {
            LICENSE: { valid: !0, timestamp: new Date().toISOString() },
            INVOICE: { valid: !0, timestamp: new Date().toISOString() },
            QUALITY: { valid: !1, timestamp: new Date().toISOString() },
            SHIPPING: { valid: !0, timestamp: new Date().toISOString() },
          },
        };
      default:
        return { status: 'SUCCESS', data: 'Mock response' };
    }
  }
}
class FabricContractWrapper {
  constructor() {
    pt(this, 'mockContract');
    this.mockContract = new MockFabricContract();
  }
  async submit(o, ...a) {
    return this.mockContract.submit(o, ...a);
  }
  async evaluate(o, ...a) {
    return this.mockContract.evaluate(o, ...a);
  }
  async submitExport(o) {
    return (
      await this.submit(
        'SubmitExport',
        JSON.stringify({ ...o, timestamp: Date.now(), status: 'SUBMITTED' })
      )
    ).transactionId;
  }
  async getDocument(o, a) {
    return await this.evaluate('GetDocument', o, a);
  }
  async verifyDocument(o, a) {
    return await this.evaluate('VerifyDocument', o, a);
  }
  async updateDocumentStatus(o, a, s) {
    await this.submit('UpdateDocumentStatus', o, a, s);
  }
  async getExportRequest(o) {
    return await this.evaluate('GetExportRequest', o);
  }
  async listExportDocuments(o) {
    return await this.evaluate('ListExportDocuments', o);
  }
}
const contract = new FabricContractWrapper(),
  LOAD_BASE = (e) => Promise.reject(new Error(`No base found for "${e}"`));
class Multibases {
  constructor(o) {
    ((this._basesByName = {}),
      (this._basesByPrefix = {}),
      (this._loadBase = o.loadBase || LOAD_BASE));
    for (const a of o.bases) this.addBase(a);
  }
  addBase(o) {
    if (this._basesByName[o.name] || this._basesByPrefix[o.prefix])
      throw new Error(`Codec already exists for codec "${o.name}"`);
    ((this._basesByName[o.name] = o), (this._basesByPrefix[o.prefix] = o));
  }
  removeBase(o) {
    (delete this._basesByName[o.name], delete this._basesByPrefix[o.prefix]);
  }
  async getBase(o) {
    if (this._basesByName[o]) return this._basesByName[o];
    if (this._basesByPrefix[o]) return this._basesByPrefix[o];
    const a = await this._loadBase(o);
    return (
      this._basesByName[a.name] == null &&
        this._basesByPrefix[a.prefix] == null &&
        this.addBase(a),
      a
    );
  }
  listBases() {
    return Object.values(this._basesByName);
  }
}
const LOAD_CODEC = (e) =>
  Promise.reject(new Error(`No codec found for "${e}"`));
class Multicodecs {
  constructor(o) {
    ((this._codecsByName = {}),
      (this._codecsByCode = {}),
      (this._loadCodec = o.loadCodec || LOAD_CODEC));
    for (const a of o.codecs) this.addCodec(a);
  }
  addCodec(o) {
    if (this._codecsByName[o.name] || this._codecsByCode[o.code])
      throw new Error(`Resolver already exists for codec "${o.name}"`);
    ((this._codecsByName[o.name] = o), (this._codecsByCode[o.code] = o));
  }
  removeCodec(o) {
    (delete this._codecsByName[o.name], delete this._codecsByCode[o.code]);
  }
  async getCodec(o) {
    const a = typeof o == 'string' ? this._codecsByName : this._codecsByCode;
    if (a[o]) return a[o];
    const s = await this._loadCodec(o);
    return (a[o] == null && this.addCodec(s), s);
  }
  listCodecs() {
    return Object.values(this._codecsByName);
  }
}
const LOAD_HASHER = (e) =>
  Promise.reject(new Error(`No hasher found for "${e}"`));
class Multihashes {
  constructor(o) {
    ((this._hashersByName = {}),
      (this._hashersByCode = {}),
      (this._loadHasher = o.loadHasher || LOAD_HASHER));
    for (const a of o.hashers) this.addHasher(a);
  }
  addHasher(o) {
    if (this._hashersByName[o.name] || this._hashersByCode[o.code])
      throw new Error(`Resolver already exists for codec "${o.name}"`);
    ((this._hashersByName[o.name] = o), (this._hashersByCode[o.code] = o));
  }
  removeHasher(o) {
    (delete this._hashersByName[o.name], delete this._hashersByCode[o.code]);
  }
  async getHasher(o) {
    const a = typeof o == 'string' ? this._hashersByName : this._hashersByCode;
    if (a[o]) return a[o];
    const s = await this._loadHasher(o);
    return (a[o] == null && this.addHasher(s), s);
  }
  listHashers() {
    return Object.values(this._hashersByName);
  }
}
function equals$b(e, o) {
  if (e === o) return !0;
  if (e.byteLength !== o.byteLength) return !1;
  for (let a = 0; a < e.byteLength; a++) if (e[a] !== o[a]) return !1;
  return !0;
}
function coerce$5(e) {
  if (e instanceof Uint8Array && e.constructor.name === 'Uint8Array') return e;
  if (e instanceof ArrayBuffer) return new Uint8Array(e);
  if (ArrayBuffer.isView(e))
    return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
  throw new Error('Unknown type, must be binary type');
}
function base$5(e, o) {
  if (e.length >= 255) throw new TypeError('Alphabet too long');
  for (var a = new Uint8Array(256), s = 0; s < a.length; s++) a[s] = 255;
  for (var i = 0; i < e.length; i++) {
    var c = e.charAt(i),
      d = c.charCodeAt(0);
    if (a[d] !== 255) throw new TypeError(c + ' is ambiguous');
    a[d] = i;
  }
  var h = e.length,
    b = e.charAt(0),
    g = Math.log(h) / Math.log(256),
    $ = Math.log(256) / Math.log(h);
  function _(j) {
    if (
      (j instanceof Uint8Array ||
        (ArrayBuffer.isView(j)
          ? (j = new Uint8Array(j.buffer, j.byteOffset, j.byteLength))
          : Array.isArray(j) && (j = Uint8Array.from(j))),
      !(j instanceof Uint8Array))
    )
      throw new TypeError('Expected Uint8Array');
    if (j.length === 0) return '';
    for (var nt = 0, lt = 0, tt = 0, et = j.length; tt !== et && j[tt] === 0; )
      (tt++, nt++);
    for (
      var rt = ((et - tt) * $ + 1) >>> 0, at = new Uint8Array(rt);
      tt !== et;

    ) {
      for (
        var ct = j[tt], dt = 0, ut = rt - 1;
        (ct !== 0 || dt < lt) && ut !== -1;
        ut--, dt++
      )
        ((ct += (256 * at[ut]) >>> 0),
          (at[ut] = ct % h >>> 0),
          (ct = (ct / h) >>> 0));
      if (ct !== 0) throw new Error('Non-zero carry');
      ((lt = dt), tt++);
    }
    for (var st = rt - lt; st !== rt && at[st] === 0; ) st++;
    for (var gt = b.repeat(nt); st < rt; ++st) gt += e.charAt(at[st]);
    return gt;
  }
  function _e(j) {
    if (typeof j != 'string') throw new TypeError('Expected String');
    if (j.length === 0) return new Uint8Array();
    var nt = 0;
    if (j[nt] !== ' ') {
      for (var lt = 0, tt = 0; j[nt] === b; ) (lt++, nt++);
      for (
        var et = ((j.length - nt) * g + 1) >>> 0, rt = new Uint8Array(et);
        j[nt];

      ) {
        var at = a[j.charCodeAt(nt)];
        if (at === 255) return;
        for (
          var ct = 0, dt = et - 1;
          (at !== 0 || ct < tt) && dt !== -1;
          dt--, ct++
        )
          ((at += (h * rt[dt]) >>> 0),
            (rt[dt] = at % 256 >>> 0),
            (at = (at / 256) >>> 0));
        if (at !== 0) throw new Error('Non-zero carry');
        ((tt = ct), nt++);
      }
      if (j[nt] !== ' ') {
        for (var ut = et - tt; ut !== et && rt[ut] === 0; ) ut++;
        for (var st = new Uint8Array(lt + (et - ut)), gt = lt; ut !== et; )
          st[gt++] = rt[ut++];
        return st;
      }
    }
  }
  function ot(j) {
    var nt = _e(j);
    if (nt) return nt;
    throw new Error(`Non-${o} character`);
  }
  return { encode: _, decodeUnsafe: _e, decode: ot };
}
var src$6 = base$5,
  _brrp__multiformats_scope_baseX$5 = src$6;
let Encoder$5 = class {
    constructor(o, a, s) {
      pt(this, 'name');
      pt(this, 'prefix');
      pt(this, 'baseEncode');
      ((this.name = o), (this.prefix = a), (this.baseEncode = s));
    }
    encode(o) {
      if (o instanceof Uint8Array) return `${this.prefix}${this.baseEncode(o)}`;
      throw Error('Unknown type, must be binary type');
    }
  },
  Decoder$5 = class {
    constructor(o, a, s) {
      pt(this, 'name');
      pt(this, 'prefix');
      pt(this, 'baseDecode');
      pt(this, 'prefixCodePoint');
      ((this.name = o), (this.prefix = a));
      const i = a.codePointAt(0);
      if (i === void 0) throw new Error('Invalid prefix character');
      ((this.prefixCodePoint = i), (this.baseDecode = s));
    }
    decode(o) {
      if (typeof o == 'string') {
        if (o.codePointAt(0) !== this.prefixCodePoint)
          throw Error(
            `Unable to decode multibase string ${JSON.stringify(o)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`
          );
        return this.baseDecode(o.slice(this.prefix.length));
      } else throw Error('Can only multibase decode strings');
    }
    or(o) {
      return or$5(this, o);
    }
  },
  ComposedDecoder$5 = class {
    constructor(o) {
      pt(this, 'decoders');
      this.decoders = o;
    }
    or(o) {
      return or$5(this, o);
    }
    decode(o) {
      const a = o[0],
        s = this.decoders[a];
      if (s != null) return s.decode(o);
      throw RangeError(
        `Unable to decode multibase string ${JSON.stringify(o)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`
      );
    }
  };
function or$5(e, o) {
  return new ComposedDecoder$5({
    ...(e.decoders ?? { [e.prefix]: e }),
    ...(o.decoders ?? { [o.prefix]: o }),
  });
}
let Codec$5 = class {
  constructor(o, a, s, i) {
    pt(this, 'name');
    pt(this, 'prefix');
    pt(this, 'baseEncode');
    pt(this, 'baseDecode');
    pt(this, 'encoder');
    pt(this, 'decoder');
    ((this.name = o),
      (this.prefix = a),
      (this.baseEncode = s),
      (this.baseDecode = i),
      (this.encoder = new Encoder$5(o, a, s)),
      (this.decoder = new Decoder$5(o, a, i)));
  }
  encode(o) {
    return this.encoder.encode(o);
  }
  decode(o) {
    return this.decoder.decode(o);
  }
};
function from$6({ name: e, prefix: o, encode: a, decode: s }) {
  return new Codec$5(e, o, a, s);
}
function baseX$5({ name: e, prefix: o, alphabet: a }) {
  const { encode: s, decode: i } = _brrp__multiformats_scope_baseX$5(a, e);
  return from$6({
    prefix: o,
    name: e,
    encode: s,
    decode: (c) => coerce$5(i(c)),
  });
}
function decode$z(e, o, a, s) {
  let i = e.length;
  for (; e[i - 1] === '='; ) --i;
  const c = new Uint8Array(((i * a) / 8) | 0);
  let d = 0,
    h = 0,
    b = 0;
  for (let g = 0; g < i; ++g) {
    const $ = o[e[g]];
    if ($ === void 0) throw new SyntaxError(`Non-${s} character`);
    ((h = (h << a) | $),
      (d += a),
      d >= 8 && ((d -= 8), (c[b++] = 255 & (h >> d))));
  }
  if (d >= a || 255 & (h << (8 - d)))
    throw new SyntaxError('Unexpected end of data');
  return c;
}
function encode$p(e, o, a) {
  const s = o[o.length - 1] === '=',
    i = (1 << a) - 1;
  let c = '',
    d = 0,
    h = 0;
  for (let b = 0; b < e.length; ++b)
    for (h = (h << 8) | e[b], d += 8; d > a; )
      ((d -= a), (c += o[i & (h >> d)]));
  if ((d !== 0 && (c += o[i & (h << (a - d))]), s))
    for (; (c.length * a) & 7; ) c += '=';
  return c;
}
function createAlphabetIdx$3(e) {
  const o = {};
  for (let a = 0; a < e.length; ++a) o[e[a]] = a;
  return o;
}
function rfc4648$5({ name: e, prefix: o, bitsPerChar: a, alphabet: s }) {
  const i = createAlphabetIdx$3(s);
  return from$6({
    prefix: o,
    name: e,
    encode(c) {
      return encode$p(c, s, a);
    },
    decode(c) {
      return decode$z(c, i, a, e);
    },
  });
}
const base32$8 = rfc4648$5({
  prefix: 'b',
  name: 'base32',
  alphabet: 'abcdefghijklmnopqrstuvwxyz234567',
  bitsPerChar: 5,
});
rfc4648$5({
  prefix: 'B',
  name: 'base32upper',
  alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
  bitsPerChar: 5,
});
rfc4648$5({
  prefix: 'c',
  name: 'base32pad',
  alphabet: 'abcdefghijklmnopqrstuvwxyz234567=',
  bitsPerChar: 5,
});
rfc4648$5({
  prefix: 'C',
  name: 'base32padupper',
  alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=',
  bitsPerChar: 5,
});
rfc4648$5({
  prefix: 'v',
  name: 'base32hex',
  alphabet: '0123456789abcdefghijklmnopqrstuv',
  bitsPerChar: 5,
});
rfc4648$5({
  prefix: 'V',
  name: 'base32hexupper',
  alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUV',
  bitsPerChar: 5,
});
rfc4648$5({
  prefix: 't',
  name: 'base32hexpad',
  alphabet: '0123456789abcdefghijklmnopqrstuv=',
  bitsPerChar: 5,
});
rfc4648$5({
  prefix: 'T',
  name: 'base32hexpadupper',
  alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUV=',
  bitsPerChar: 5,
});
rfc4648$5({
  prefix: 'h',
  name: 'base32z',
  alphabet: 'ybndrfg8ejkmcpqxot1uwisza345h769',
  bitsPerChar: 5,
});
const base36$8 = baseX$5({
  prefix: 'k',
  name: 'base36',
  alphabet: '0123456789abcdefghijklmnopqrstuvwxyz',
});
baseX$5({
  prefix: 'K',
  name: 'base36upper',
  alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
});
const base58btc$5 = baseX$5({
  name: 'base58btc',
  prefix: 'z',
  alphabet: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
});
baseX$5({
  name: 'base58flickr',
  prefix: 'Z',
  alphabet: '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ',
});
var encode_1$5 = encode$o,
  MSB$7 = 128,
  REST$7 = 127,
  MSBALL$5 = ~REST$7,
  INT$5 = Math.pow(2, 31);
function encode$o(e, o, a) {
  ((o = o || []), (a = a || 0));
  for (var s = a; e >= INT$5; ) ((o[a++] = (e & 255) | MSB$7), (e /= 128));
  for (; e & MSBALL$5; ) ((o[a++] = (e & 255) | MSB$7), (e >>>= 7));
  return ((o[a] = e | 0), (encode$o.bytes = a - s + 1), o);
}
var decode$y = read$5,
  MSB$1$5 = 128,
  REST$1$5 = 127;
function read$5(e, s) {
  var a = 0,
    s = s || 0,
    i = 0,
    c = s,
    d,
    h = e.length;
  do {
    if (c >= h)
      throw ((read$5.bytes = 0), new RangeError('Could not decode varint'));
    ((d = e[c++]),
      (a += i < 28 ? (d & REST$1$5) << i : (d & REST$1$5) * Math.pow(2, i)),
      (i += 7));
  } while (d >= MSB$1$5);
  return ((read$5.bytes = c - s), a);
}
var N1$6 = Math.pow(2, 7),
  N2$6 = Math.pow(2, 14),
  N3$6 = Math.pow(2, 21),
  N4$6 = Math.pow(2, 28),
  N5$6 = Math.pow(2, 35),
  N6$6 = Math.pow(2, 42),
  N7$6 = Math.pow(2, 49),
  N8$5 = Math.pow(2, 56),
  N9$5 = Math.pow(2, 63),
  length$5 = function (e) {
    return e < N1$6
      ? 1
      : e < N2$6
        ? 2
        : e < N3$6
          ? 3
          : e < N4$6
            ? 4
            : e < N5$6
              ? 5
              : e < N6$6
                ? 6
                : e < N7$6
                  ? 7
                  : e < N8$5
                    ? 8
                    : e < N9$5
                      ? 9
                      : 10;
  },
  varint$6 = { encode: encode_1$5, decode: decode$y, encodingLength: length$5 },
  _brrp_varint$4 = varint$6;
function decode$x(e, o = 0) {
  return [_brrp_varint$4.decode(e, o), _brrp_varint$4.decode.bytes];
}
function encodeTo$4(e, o, a = 0) {
  return (_brrp_varint$4.encode(e, o, a), o);
}
function encodingLength$5(e) {
  return _brrp_varint$4.encodingLength(e);
}
function create$7(e, o) {
  const a = o.byteLength,
    s = encodingLength$5(e),
    i = s + encodingLength$5(a),
    c = new Uint8Array(i + a);
  return (
    encodeTo$4(e, c, 0),
    encodeTo$4(a, c, s),
    c.set(o, i),
    new Digest$4(e, a, o, c)
  );
}
function decode$w(e) {
  const o = coerce$5(e),
    [a, s] = decode$x(o),
    [i, c] = decode$x(o.subarray(s)),
    d = o.subarray(s + c);
  if (d.byteLength !== i) throw new Error('Incorrect length');
  return new Digest$4(a, i, d, o);
}
function equals$a(e, o) {
  if (e === o) return !0;
  {
    const a = o;
    return (
      e.code === a.code &&
      e.size === a.size &&
      a.bytes instanceof Uint8Array &&
      equals$b(e.bytes, a.bytes)
    );
  }
}
let Digest$4 = class {
  constructor(o, a, s, i) {
    pt(this, 'code');
    pt(this, 'size');
    pt(this, 'digest');
    pt(this, 'bytes');
    ((this.code = o), (this.size = a), (this.digest = s), (this.bytes = i));
  }
};
function format$9(e, o) {
  const { bytes: a, version: s } = e;
  switch (s) {
    case 0:
      return toStringV0$4(a, baseCache$4(e), o ?? base58btc$5.encoder);
    default:
      return toStringV1$4(a, baseCache$4(e), o ?? base32$8.encoder);
  }
}
const cache$4 = new WeakMap();
function baseCache$4(e) {
  const o = cache$4.get(e);
  if (o == null) {
    const a = new Map();
    return (cache$4.set(e, a), a);
  }
  return o;
}
var Yt;
let CID$4 = class Ot {
  constructor(o, a, s, i) {
    pt(this, 'code');
    pt(this, 'version');
    pt(this, 'multihash');
    pt(this, 'bytes');
    pt(this, '/');
    pt(this, Yt, 'CID');
    ((this.code = a),
      (this.version = o),
      (this.multihash = s),
      (this.bytes = i),
      (this['/'] = i));
  }
  get asCID() {
    return this;
  }
  get byteOffset() {
    return this.bytes.byteOffset;
  }
  get byteLength() {
    return this.bytes.byteLength;
  }
  toV0() {
    switch (this.version) {
      case 0:
        return this;
      case 1: {
        const { code: o, multihash: a } = this;
        if (o !== DAG_PB_CODE$4)
          throw new Error('Cannot convert a non dag-pb CID to CIDv0');
        if (a.code !== SHA_256_CODE$4)
          throw new Error('Cannot convert non sha2-256 multihash CID to CIDv0');
        return Ot.createV0(a);
      }
      default:
        throw Error(
          `Can not convert CID version ${this.version} to version 0. This is a bug please report`
        );
    }
  }
  toV1() {
    switch (this.version) {
      case 0: {
        const { code: o, digest: a } = this.multihash,
          s = create$7(o, a);
        return Ot.createV1(this.code, s);
      }
      case 1:
        return this;
      default:
        throw Error(
          `Can not convert CID version ${this.version} to version 1. This is a bug please report`
        );
    }
  }
  equals(o) {
    return Ot.equals(this, o);
  }
  static equals(o, a) {
    const s = a;
    return (
      s != null &&
      o.code === s.code &&
      o.version === s.version &&
      equals$a(o.multihash, s.multihash)
    );
  }
  toString(o) {
    return format$9(this, o);
  }
  toJSON() {
    return { '/': format$9(this) };
  }
  link() {
    return this;
  }
  [((Yt = Symbol.toStringTag), Symbol.for('nodejs.util.inspect.custom'))]() {
    return `CID(${this.toString()})`;
  }
  static asCID(o) {
    if (o == null) return null;
    const a = o;
    if (a instanceof Ot) return a;
    if ((a['/'] != null && a['/'] === a.bytes) || a.asCID === a) {
      const { version: s, code: i, multihash: c, bytes: d } = a;
      return new Ot(s, i, c, d ?? encodeCID$5(s, i, c.bytes));
    } else if (a[cidSymbol$4] === !0) {
      const { version: s, multihash: i, code: c } = a,
        d = decode$w(i);
      return Ot.create(s, c, d);
    } else return null;
  }
  static create(o, a, s) {
    if (typeof a != 'number')
      throw new Error('String codecs are no longer supported');
    if (!(s.bytes instanceof Uint8Array)) throw new Error('Invalid digest');
    switch (o) {
      case 0: {
        if (a !== DAG_PB_CODE$4)
          throw new Error(
            `Version 0 CID must use dag-pb (code: ${DAG_PB_CODE$4}) block encoding`
          );
        return new Ot(o, a, s, s.bytes);
      }
      case 1: {
        const i = encodeCID$5(o, a, s.bytes);
        return new Ot(o, a, s, i);
      }
      default:
        throw new Error('Invalid version');
    }
  }
  static createV0(o) {
    return Ot.create(0, DAG_PB_CODE$4, o);
  }
  static createV1(o, a) {
    return Ot.create(1, o, a);
  }
  static decode(o) {
    const [a, s] = Ot.decodeFirst(o);
    if (s.length !== 0) throw new Error('Incorrect length');
    return a;
  }
  static decodeFirst(o) {
    const a = Ot.inspectBytes(o),
      s = a.size - a.multihashSize,
      i = coerce$5(o.subarray(s, s + a.multihashSize));
    if (i.byteLength !== a.multihashSize) throw new Error('Incorrect length');
    const c = i.subarray(a.multihashSize - a.digestSize),
      d = new Digest$4(a.multihashCode, a.digestSize, c, i);
    return [
      a.version === 0 ? Ot.createV0(d) : Ot.createV1(a.codec, d),
      o.subarray(a.size),
    ];
  }
  static inspectBytes(o) {
    let a = 0;
    const s = () => {
      const [_, _e] = decode$x(o.subarray(a));
      return ((a += _e), _);
    };
    let i = s(),
      c = DAG_PB_CODE$4;
    if ((i === 18 ? ((i = 0), (a = 0)) : (c = s()), i !== 0 && i !== 1))
      throw new RangeError(`Invalid CID version ${i}`);
    const d = a,
      h = s(),
      b = s(),
      g = a + b,
      $ = g - d;
    return {
      version: i,
      codec: c,
      multihashCode: h,
      digestSize: b,
      multihashSize: $,
      size: g,
    };
  }
  static parse(o, a) {
    const [s, i] = parseCIDtoBytes$4(o, a),
      c = Ot.decode(i);
    if (c.version === 0 && o[0] !== 'Q')
      throw Error('Version 0 CID string must not include multibase prefix');
    return (baseCache$4(c).set(s, o), c);
  }
};
function parseCIDtoBytes$4(e, o) {
  switch (e[0]) {
    case 'Q': {
      const a = o ?? base58btc$5;
      return [base58btc$5.prefix, a.decode(`${base58btc$5.prefix}${e}`)];
    }
    case base58btc$5.prefix: {
      const a = o ?? base58btc$5;
      return [base58btc$5.prefix, a.decode(e)];
    }
    case base32$8.prefix: {
      const a = o ?? base32$8;
      return [base32$8.prefix, a.decode(e)];
    }
    case base36$8.prefix: {
      const a = o ?? base36$8;
      return [base36$8.prefix, a.decode(e)];
    }
    default: {
      if (o == null)
        throw Error(
          'To parse non base32, base36 or base58btc encoded CID multibase decoder must be provided'
        );
      return [e[0], o.decode(e)];
    }
  }
}
function toStringV0$4(e, o, a) {
  const { prefix: s } = a;
  if (s !== base58btc$5.prefix)
    throw Error(`Cannot string encode V0 in ${a.name} encoding`);
  const i = o.get(s);
  if (i == null) {
    const c = a.encode(e).slice(1);
    return (o.set(s, c), c);
  } else return i;
}
function toStringV1$4(e, o, a) {
  const { prefix: s } = a,
    i = o.get(s);
  if (i == null) {
    const c = a.encode(e);
    return (o.set(s, c), c);
  } else return i;
}
const DAG_PB_CODE$4 = 112,
  SHA_256_CODE$4 = 18;
function encodeCID$5(e, o, a) {
  const s = encodingLength$5(e),
    i = s + encodingLength$5(o),
    c = new Uint8Array(i + a.byteLength);
  return (encodeTo$4(e, c, 0), encodeTo$4(o, c, s), c.set(a, i), c);
}
const cidSymbol$4 = Symbol.for('@ipld/js-cid/CID'),
  textDecoder$2 = new TextDecoder();
function decodeVarint(e, o) {
  let a = 0;
  for (let s = 0; ; s += 7) {
    if (s >= 64) throw new Error('protobuf: varint overflow');
    if (o >= e.length) throw new Error('protobuf: unexpected end of data');
    const i = e[o++];
    if (((a += s < 28 ? (i & 127) << s : (i & 127) * 2 ** s), i < 128)) break;
  }
  return [a, o];
}
function decodeBytes(e, o) {
  let a;
  [a, o] = decodeVarint(e, o);
  const s = o + a;
  if (a < 0 || s < 0) throw new Error('protobuf: invalid length');
  if (s > e.length) throw new Error('protobuf: unexpected end of data');
  return [e.subarray(o, s), s];
}
function decodeKey(e, o) {
  let a;
  return (([a, o] = decodeVarint(e, o)), [a & 7, a >> 3, o]);
}
function decodeLink(e) {
  const o = {},
    a = e.length;
  let s = 0;
  for (; s < a; ) {
    let i, c;
    if ((([i, c, s] = decodeKey(e, s)), c === 1)) {
      if (o.Hash) throw new Error('protobuf: (PBLink) duplicate Hash section');
      if (i !== 2)
        throw new Error(`protobuf: (PBLink) wrong wireType (${i}) for Hash`);
      if (o.Name !== void 0)
        throw new Error(
          'protobuf: (PBLink) invalid order, found Name before Hash'
        );
      if (o.Tsize !== void 0)
        throw new Error(
          'protobuf: (PBLink) invalid order, found Tsize before Hash'
        );
      [o.Hash, s] = decodeBytes(e, s);
    } else if (c === 2) {
      if (o.Name !== void 0)
        throw new Error('protobuf: (PBLink) duplicate Name section');
      if (i !== 2)
        throw new Error(`protobuf: (PBLink) wrong wireType (${i}) for Name`);
      if (o.Tsize !== void 0)
        throw new Error(
          'protobuf: (PBLink) invalid order, found Tsize before Name'
        );
      let d;
      (([d, s] = decodeBytes(e, s)), (o.Name = textDecoder$2.decode(d)));
    } else if (c === 3) {
      if (o.Tsize !== void 0)
        throw new Error('protobuf: (PBLink) duplicate Tsize section');
      if (i !== 0)
        throw new Error(`protobuf: (PBLink) wrong wireType (${i}) for Tsize`);
      [o.Tsize, s] = decodeVarint(e, s);
    } else
      throw new Error(
        `protobuf: (PBLink) invalid fieldNumber, expected 1, 2 or 3, got ${c}`
      );
  }
  if (s > a) throw new Error('protobuf: (PBLink) unexpected end of data');
  return o;
}
function decodeNode(e) {
  const o = e.length;
  let a = 0,
    s,
    i = !1,
    c;
  for (; a < o; ) {
    let h, b;
    if ((([h, b, a] = decodeKey(e, a)), h !== 2))
      throw new Error(
        `protobuf: (PBNode) invalid wireType, expected 2, got ${h}`
      );
    if (b === 1) {
      if (c) throw new Error('protobuf: (PBNode) duplicate Data section');
      (([c, a] = decodeBytes(e, a)), s && (i = !0));
    } else if (b === 2) {
      if (i) throw new Error('protobuf: (PBNode) duplicate Links section');
      s || (s = []);
      let g;
      (([g, a] = decodeBytes(e, a)), s.push(decodeLink(g)));
    } else
      throw new Error(
        `protobuf: (PBNode) invalid fieldNumber, expected 1 or 2, got ${b}`
      );
  }
  if (a > o) throw new Error('protobuf: (PBNode) unexpected end of data');
  const d = {};
  return (c && (d.Data = c), (d.Links = s || []), d);
}
const textEncoder$3 = new TextEncoder(),
  maxInt32 = 2 ** 32,
  maxUInt32 = 2 ** 31;
function encodeLink(e, o) {
  let a = o.length;
  if (typeof e.Tsize == 'number') {
    if (e.Tsize < 0) throw new Error('Tsize cannot be negative');
    if (!Number.isSafeInteger(e.Tsize))
      throw new Error('Tsize too large for encoding');
    ((a = encodeVarint(o, a, e.Tsize) - 1), (o[a] = 24));
  }
  if (typeof e.Name == 'string') {
    const s = textEncoder$3.encode(e.Name);
    ((a -= s.length),
      o.set(s, a),
      (a = encodeVarint(o, a, s.length) - 1),
      (o[a] = 18));
  }
  return (
    e.Hash &&
      ((a -= e.Hash.length),
      o.set(e.Hash, a),
      (a = encodeVarint(o, a, e.Hash.length) - 1),
      (o[a] = 10)),
    o.length - a
  );
}
function encodeNode(e) {
  const o = sizeNode(e),
    a = new Uint8Array(o);
  let s = o;
  if (
    (e.Data &&
      ((s -= e.Data.length),
      a.set(e.Data, s),
      (s = encodeVarint(a, s, e.Data.length) - 1),
      (a[s] = 10)),
    e.Links)
  )
    for (let i = e.Links.length - 1; i >= 0; i--) {
      const c = encodeLink(e.Links[i], a.subarray(0, s));
      ((s -= c), (s = encodeVarint(a, s, c) - 1), (a[s] = 18));
    }
  return a;
}
function sizeLink(e) {
  let o = 0;
  if (e.Hash) {
    const a = e.Hash.length;
    o += 1 + a + sov(a);
  }
  if (typeof e.Name == 'string') {
    const a = textEncoder$3.encode(e.Name).length;
    o += 1 + a + sov(a);
  }
  return (typeof e.Tsize == 'number' && (o += 1 + sov(e.Tsize)), o);
}
function sizeNode(e) {
  let o = 0;
  if (e.Data) {
    const a = e.Data.length;
    o += 1 + a + sov(a);
  }
  if (e.Links)
    for (const a of e.Links) {
      const s = sizeLink(a);
      o += 1 + s + sov(s);
    }
  return o;
}
function encodeVarint(e, o, a) {
  o -= sov(a);
  const s = o;
  for (; a >= maxUInt32; ) ((e[o++] = (a & 127) | 128), (a /= 128));
  for (; a >= 128; ) ((e[o++] = (a & 127) | 128), (a >>>= 7));
  return ((e[o] = a), s);
}
function sov(e) {
  return (e % 2 === 0 && e++, Math.floor((len64(e) + 6) / 7));
}
function len64(e) {
  let o = 0;
  return (
    e >= maxInt32 && ((e = Math.floor(e / maxInt32)), (o = 32)),
    e >= 65536 && ((e >>>= 16), (o += 16)),
    e >= 256 && ((e >>>= 8), (o += 8)),
    o + len8tab[e]
  );
}
const len8tab = [
    0, 1, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5,
    5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
    6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
    8, 8, 8, 8, 8, 8,
  ],
  pbNodeProperties = ['Data', 'Links'],
  pbLinkProperties = ['Hash', 'Name', 'Tsize'],
  textEncoder$2 = new TextEncoder();
function linkComparator(e, o) {
  if (e === o) return 0;
  const a = e.Name ? textEncoder$2.encode(e.Name) : [],
    s = o.Name ? textEncoder$2.encode(o.Name) : [];
  let i = a.length,
    c = s.length;
  for (let d = 0, h = Math.min(i, c); d < h; ++d)
    if (a[d] !== s[d]) {
      ((i = a[d]), (c = s[d]));
      break;
    }
  return i < c ? -1 : c < i ? 1 : 0;
}
function hasOnlyProperties(e, o) {
  return !Object.keys(e).some((a) => !o.includes(a));
}
function asLink(e) {
  if (typeof e.asCID == 'object') {
    const a = CID$4.asCID(e);
    if (!a) throw new TypeError('Invalid DAG-PB form');
    return { Hash: a };
  }
  if (typeof e != 'object' || Array.isArray(e))
    throw new TypeError('Invalid DAG-PB form');
  const o = {};
  if (e.Hash) {
    let a = CID$4.asCID(e.Hash);
    try {
      a ||
        (typeof e.Hash == 'string'
          ? (a = CID$4.parse(e.Hash))
          : e.Hash instanceof Uint8Array && (a = CID$4.decode(e.Hash)));
    } catch (s) {
      throw new TypeError(`Invalid DAG-PB form: ${s.message}`);
    }
    a && (o.Hash = a);
  }
  if (!o.Hash) throw new TypeError('Invalid DAG-PB form');
  return (
    typeof e.Name == 'string' && (o.Name = e.Name),
    typeof e.Tsize == 'number' && (o.Tsize = e.Tsize),
    o
  );
}
function prepare(e) {
  if (
    ((e instanceof Uint8Array || typeof e == 'string') && (e = { Data: e }),
    typeof e != 'object' || Array.isArray(e))
  )
    throw new TypeError('Invalid DAG-PB form');
  const o = {};
  if (e.Data !== void 0)
    if (typeof e.Data == 'string') o.Data = textEncoder$2.encode(e.Data);
    else if (e.Data instanceof Uint8Array) o.Data = e.Data;
    else throw new TypeError('Invalid DAG-PB form');
  if (e.Links !== void 0)
    if (Array.isArray(e.Links))
      ((o.Links = e.Links.map(asLink)), o.Links.sort(linkComparator));
    else throw new TypeError('Invalid DAG-PB form');
  else o.Links = [];
  return o;
}
function validate$2(e) {
  if (
    !e ||
    typeof e != 'object' ||
    Array.isArray(e) ||
    e instanceof Uint8Array ||
    (e['/'] && e['/'] === e.bytes)
  )
    throw new TypeError('Invalid DAG-PB form');
  if (!hasOnlyProperties(e, pbNodeProperties))
    throw new TypeError('Invalid DAG-PB form (extraneous properties)');
  if (e.Data !== void 0 && !(e.Data instanceof Uint8Array))
    throw new TypeError('Invalid DAG-PB form (Data must be bytes)');
  if (!Array.isArray(e.Links))
    throw new TypeError('Invalid DAG-PB form (Links must be a list)');
  for (let o = 0; o < e.Links.length; o++) {
    const a = e.Links[o];
    if (
      !a ||
      typeof a != 'object' ||
      Array.isArray(a) ||
      a instanceof Uint8Array ||
      (a['/'] && a['/'] === a.bytes)
    )
      throw new TypeError('Invalid DAG-PB form (bad link)');
    if (!hasOnlyProperties(a, pbLinkProperties))
      throw new TypeError(
        'Invalid DAG-PB form (extraneous properties on link)'
      );
    if (a.Hash === void 0)
      throw new TypeError('Invalid DAG-PB form (link must have a Hash)');
    if (a.Hash == null || !a.Hash['/'] || a.Hash['/'] !== a.Hash.bytes)
      throw new TypeError('Invalid DAG-PB form (link Hash must be a CID)');
    if (a.Name !== void 0 && typeof a.Name != 'string')
      throw new TypeError('Invalid DAG-PB form (link Name must be a string)');
    if (a.Tsize !== void 0) {
      if (typeof a.Tsize != 'number' || a.Tsize % 1 !== 0)
        throw new TypeError(
          'Invalid DAG-PB form (link Tsize must be an integer)'
        );
      if (a.Tsize < 0)
        throw new TypeError(
          'Invalid DAG-PB form (link Tsize cannot be negative)'
        );
    }
    if (o > 0 && linkComparator(a, e.Links[o - 1]) === -1)
      throw new TypeError(
        'Invalid DAG-PB form (links must be sorted by Name bytes)'
      );
  }
}
function createNode(e, o = []) {
  return prepare({ Data: e, Links: o });
}
function createLink(e, o, a) {
  return asLink({ Hash: a, Name: e, Tsize: o });
}
function toByteView$2(e) {
  return e instanceof ArrayBuffer ? new Uint8Array(e, 0, e.byteLength) : e;
}
const name$6 = 'dag-pb',
  code$6 = 112;
function encode$n(e) {
  validate$2(e);
  const o = {};
  return (
    e.Links &&
      (o.Links = e.Links.map((a) => {
        const s = {};
        return (
          a.Hash && (s.Hash = a.Hash.bytes),
          a.Name !== void 0 && (s.Name = a.Name),
          a.Tsize !== void 0 && (s.Tsize = a.Tsize),
          s
        );
      })),
    e.Data && (o.Data = e.Data),
    encodeNode(o)
  );
}
function decode$v(e) {
  const o = toByteView$2(e),
    a = decodeNode(o),
    s = {};
  return (
    a.Data && (s.Data = a.Data),
    a.Links &&
      (s.Links = a.Links.map((i) => {
        const c = {};
        try {
          c.Hash = CID$4.decode(i.Hash);
        } catch {}
        if (!c.Hash)
          throw new Error('Invalid Hash field found in link, expected CID');
        return (
          i.Name !== void 0 && (c.Name = i.Name),
          i.Tsize !== void 0 && (c.Tsize = i.Tsize),
          c
        );
      })),
    s
  );
}
const dagPB = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        code: code$6,
        createLink,
        createNode,
        decode: decode$v,
        encode: encode$n,
        name: name$6,
        prepare,
        validate: validate$2,
      },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  typeofs = ['string', 'number', 'bigint', 'symbol'],
  objectTypeNames = [
    'Function',
    'Generator',
    'AsyncGenerator',
    'GeneratorFunction',
    'AsyncGeneratorFunction',
    'AsyncFunction',
    'Observable',
    'Array',
    'Buffer',
    'Object',
    'RegExp',
    'Date',
    'Error',
    'Map',
    'Set',
    'WeakMap',
    'WeakSet',
    'ArrayBuffer',
    'SharedArrayBuffer',
    'DataView',
    'Promise',
    'URL',
    'HTMLElement',
    'Int8Array',
    'Uint8Array',
    'Uint8ClampedArray',
    'Int16Array',
    'Uint16Array',
    'Int32Array',
    'Uint32Array',
    'Float32Array',
    'Float64Array',
    'BigInt64Array',
    'BigUint64Array',
  ];
function is(e) {
  if (e === null) return 'null';
  if (e === void 0) return 'undefined';
  if (e === !0 || e === !1) return 'boolean';
  const o = typeof e;
  if (typeofs.includes(o)) return o;
  if (o === 'function') return 'Function';
  if (Array.isArray(e)) return 'Array';
  if (isBuffer$1(e)) return 'Buffer';
  const a = getObjectType(e);
  return a || 'Object';
}
function isBuffer$1(e) {
  return (
    e &&
    e.constructor &&
    e.constructor.isBuffer &&
    e.constructor.isBuffer.call(null, e)
  );
}
function getObjectType(e) {
  const o = Object.prototype.toString.call(e).slice(8, -1);
  if (objectTypeNames.includes(o)) return o;
}
class Type {
  constructor(o, a, s) {
    ((this.major = o),
      (this.majorEncoded = o << 5),
      (this.name = a),
      (this.terminal = s));
  }
  toString() {
    return `Type[${this.major}].${this.name}`;
  }
  compare(o) {
    return this.major < o.major ? -1 : this.major > o.major ? 1 : 0;
  }
}
Type.uint = new Type(0, 'uint', !0);
Type.negint = new Type(1, 'negint', !0);
Type.bytes = new Type(2, 'bytes', !0);
Type.string = new Type(3, 'string', !0);
Type.array = new Type(4, 'array', !1);
Type.map = new Type(5, 'map', !1);
Type.tag = new Type(6, 'tag', !1);
Type.float = new Type(7, 'float', !0);
Type.false = new Type(7, 'false', !0);
Type.true = new Type(7, 'true', !0);
Type.null = new Type(7, 'null', !0);
Type.undefined = new Type(7, 'undefined', !0);
Type.break = new Type(7, 'break', !0);
class Token {
  constructor(o, a, s) {
    ((this.type = o),
      (this.value = a),
      (this.encodedLength = s),
      (this.encodedBytes = void 0),
      (this.byteValue = void 0));
  }
  toString() {
    return `Token[${this.type}].${this.value}`;
  }
}
const useBuffer =
    globalThis.process &&
    !globalThis.process.browser &&
    globalThis.Buffer &&
    typeof globalThis.Buffer.isBuffer == 'function',
  textDecoder$1 = new TextDecoder(),
  textEncoder$1 = new TextEncoder();
function isBuffer(e) {
  return useBuffer && globalThis.Buffer.isBuffer(e);
}
function asU8A(e) {
  return e instanceof Uint8Array
    ? isBuffer(e)
      ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength)
      : e
    : Uint8Array.from(e);
}
const toString$6 = useBuffer
    ? (e, o, a) =>
        a - o > 64
          ? globalThis.Buffer.from(e.subarray(o, a)).toString('utf8')
          : utf8Slice(e, o, a)
    : (e, o, a) =>
        a - o > 64
          ? textDecoder$1.decode(e.subarray(o, a))
          : utf8Slice(e, o, a),
  fromString$6 = useBuffer
    ? (e) => (e.length > 64 ? globalThis.Buffer.from(e) : utf8ToBytes(e))
    : (e) => (e.length > 64 ? textEncoder$1.encode(e) : utf8ToBytes(e)),
  fromArray = (e) => Uint8Array.from(e),
  slice = useBuffer
    ? (e, o, a) =>
        isBuffer(e) ? new Uint8Array(e.subarray(o, a)) : e.slice(o, a)
    : (e, o, a) => e.slice(o, a),
  concat$2 = useBuffer
    ? (e, o) => (
        (e = e.map((a) =>
          a instanceof Uint8Array ? a : globalThis.Buffer.from(a)
        )),
        asU8A(globalThis.Buffer.concat(e, o))
      )
    : (e, o) => {
        const a = new Uint8Array(o);
        let s = 0;
        for (let i of e)
          (s + i.length > a.length && (i = i.subarray(0, a.length - s)),
            a.set(i, s),
            (s += i.length));
        return a;
      },
  alloc = useBuffer
    ? (e) => globalThis.Buffer.allocUnsafe(e)
    : (e) => new Uint8Array(e);
function compare(e, o) {
  if (isBuffer(e) && isBuffer(o)) return e.compare(o);
  for (let a = 0; a < e.length; a++)
    if (e[a] !== o[a]) return e[a] < o[a] ? -1 : 1;
  return 0;
}
function utf8ToBytes(e) {
  const o = [];
  let a = 0;
  for (let s = 0; s < e.length; s++) {
    let i = e.charCodeAt(s);
    i < 128
      ? (o[a++] = i)
      : i < 2048
        ? ((o[a++] = (i >> 6) | 192), (o[a++] = (i & 63) | 128))
        : (i & 64512) === 55296 &&
            s + 1 < e.length &&
            (e.charCodeAt(s + 1) & 64512) === 56320
          ? ((i = 65536 + ((i & 1023) << 10) + (e.charCodeAt(++s) & 1023)),
            (o[a++] = (i >> 18) | 240),
            (o[a++] = ((i >> 12) & 63) | 128),
            (o[a++] = ((i >> 6) & 63) | 128),
            (o[a++] = (i & 63) | 128))
          : ((o[a++] = (i >> 12) | 224),
            (o[a++] = ((i >> 6) & 63) | 128),
            (o[a++] = (i & 63) | 128));
  }
  return o;
}
function utf8Slice(e, o, a) {
  const s = [];
  for (; o < a; ) {
    const i = e[o];
    let c = null,
      d = i > 239 ? 4 : i > 223 ? 3 : i > 191 ? 2 : 1;
    if (o + d <= a) {
      let h, b, g, $;
      switch (d) {
        case 1:
          i < 128 && (c = i);
          break;
        case 2:
          ((h = e[o + 1]),
            (h & 192) === 128 &&
              (($ = ((i & 31) << 6) | (h & 63)), $ > 127 && (c = $)));
          break;
        case 3:
          ((h = e[o + 1]),
            (b = e[o + 2]),
            (h & 192) === 128 &&
              (b & 192) === 128 &&
              (($ = ((i & 15) << 12) | ((h & 63) << 6) | (b & 63)),
              $ > 2047 && ($ < 55296 || $ > 57343) && (c = $)));
          break;
        case 4:
          ((h = e[o + 1]),
            (b = e[o + 2]),
            (g = e[o + 3]),
            (h & 192) === 128 &&
              (b & 192) === 128 &&
              (g & 192) === 128 &&
              (($ =
                ((i & 15) << 18) |
                ((h & 63) << 12) |
                ((b & 63) << 6) |
                (g & 63)),
              $ > 65535 && $ < 1114112 && (c = $)));
      }
    }
    (c === null
      ? ((c = 65533), (d = 1))
      : c > 65535 &&
        ((c -= 65536),
        s.push(((c >>> 10) & 1023) | 55296),
        (c = 56320 | (c & 1023))),
      s.push(c),
      (o += d));
  }
  return decodeCodePointsArray(s);
}
const MAX_ARGUMENTS_LENGTH = 4096;
function decodeCodePointsArray(e) {
  const o = e.length;
  if (o <= MAX_ARGUMENTS_LENGTH) return String.fromCharCode.apply(String, e);
  let a = '',
    s = 0;
  for (; s < o; )
    a += String.fromCharCode.apply(
      String,
      e.slice(s, (s += MAX_ARGUMENTS_LENGTH))
    );
  return a;
}
const defaultChunkSize = 256;
class Bl {
  constructor(o = defaultChunkSize) {
    ((this.chunkSize = o),
      (this.cursor = 0),
      (this.maxCursor = -1),
      (this.chunks = []),
      (this._initReuseChunk = null));
  }
  reset() {
    ((this.cursor = 0),
      (this.maxCursor = -1),
      this.chunks.length && (this.chunks = []),
      this._initReuseChunk !== null &&
        (this.chunks.push(this._initReuseChunk),
        (this.maxCursor = this._initReuseChunk.length - 1)));
  }
  push(o) {
    let a = this.chunks[this.chunks.length - 1];
    if (this.cursor + o.length <= this.maxCursor + 1) {
      const i = a.length - (this.maxCursor - this.cursor) - 1;
      a.set(o, i);
    } else {
      if (a) {
        const i = a.length - (this.maxCursor - this.cursor) - 1;
        i < a.length &&
          ((this.chunks[this.chunks.length - 1] = a.subarray(0, i)),
          (this.maxCursor = this.cursor - 1));
      }
      o.length < 64 && o.length < this.chunkSize
        ? ((a = alloc(this.chunkSize)),
          this.chunks.push(a),
          (this.maxCursor += a.length),
          this._initReuseChunk === null && (this._initReuseChunk = a),
          a.set(o, 0))
        : (this.chunks.push(o), (this.maxCursor += o.length));
    }
    this.cursor += o.length;
  }
  toBytes(o = !1) {
    let a;
    if (this.chunks.length === 1) {
      const s = this.chunks[0];
      o && this.cursor > s.length / 2
        ? ((a = this.cursor === s.length ? s : s.subarray(0, this.cursor)),
          (this._initReuseChunk = null),
          (this.chunks = []))
        : (a = slice(s, 0, this.cursor));
    } else a = concat$2(this.chunks, this.cursor);
    return (o && this.reset(), a);
  }
}
const decodeErrPrefix = 'CBOR decode error:',
  encodeErrPrefix = 'CBOR encode error:';
function assertEnoughData(e, o, a) {
  if (e.length - o < a)
    throw new Error(`${decodeErrPrefix} not enough data for type`);
}
const uintBoundaries = [
  24,
  256,
  65536,
  4294967296,
  BigInt('18446744073709551616'),
];
function readUint8(e, o, a) {
  assertEnoughData(e, o, 1);
  const s = e[o];
  if (a.strict === !0 && s < uintBoundaries[0])
    throw new Error(
      `${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`
    );
  return s;
}
function readUint16(e, o, a) {
  assertEnoughData(e, o, 2);
  const s = (e[o] << 8) | e[o + 1];
  if (a.strict === !0 && s < uintBoundaries[1])
    throw new Error(
      `${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`
    );
  return s;
}
function readUint32(e, o, a) {
  assertEnoughData(e, o, 4);
  const s = e[o] * 16777216 + (e[o + 1] << 16) + (e[o + 2] << 8) + e[o + 3];
  if (a.strict === !0 && s < uintBoundaries[2])
    throw new Error(
      `${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`
    );
  return s;
}
function readUint64(e, o, a) {
  assertEnoughData(e, o, 8);
  const s = e[o] * 16777216 + (e[o + 1] << 16) + (e[o + 2] << 8) + e[o + 3],
    i = e[o + 4] * 16777216 + (e[o + 5] << 16) + (e[o + 6] << 8) + e[o + 7],
    c = (BigInt(s) << BigInt(32)) + BigInt(i);
  if (a.strict === !0 && c < uintBoundaries[3])
    throw new Error(
      `${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`
    );
  if (c <= Number.MAX_SAFE_INTEGER) return Number(c);
  if (a.allowBigInt === !0) return c;
  throw new Error(
    `${decodeErrPrefix} integers outside of the safe integer range are not supported`
  );
}
function decodeUint8(e, o, a, s) {
  return new Token(Type.uint, readUint8(e, o + 1, s), 2);
}
function decodeUint16(e, o, a, s) {
  return new Token(Type.uint, readUint16(e, o + 1, s), 3);
}
function decodeUint32(e, o, a, s) {
  return new Token(Type.uint, readUint32(e, o + 1, s), 5);
}
function decodeUint64(e, o, a, s) {
  return new Token(Type.uint, readUint64(e, o + 1, s), 9);
}
function encodeUint(e, o) {
  return encodeUintValue(e, 0, o.value);
}
function encodeUintValue(e, o, a) {
  if (a < uintBoundaries[0]) {
    const s = Number(a);
    e.push([o | s]);
  } else if (a < uintBoundaries[1]) {
    const s = Number(a);
    e.push([o | 24, s]);
  } else if (a < uintBoundaries[2]) {
    const s = Number(a);
    e.push([o | 25, s >>> 8, s & 255]);
  } else if (a < uintBoundaries[3]) {
    const s = Number(a);
    e.push([
      o | 26,
      (s >>> 24) & 255,
      (s >>> 16) & 255,
      (s >>> 8) & 255,
      s & 255,
    ]);
  } else {
    const s = BigInt(a);
    if (s < uintBoundaries[4]) {
      const i = [o | 27, 0, 0, 0, 0, 0, 0, 0];
      let c = Number(s & BigInt(4294967295)),
        d = Number((s >> BigInt(32)) & BigInt(4294967295));
      ((i[8] = c & 255),
        (c = c >> 8),
        (i[7] = c & 255),
        (c = c >> 8),
        (i[6] = c & 255),
        (c = c >> 8),
        (i[5] = c & 255),
        (i[4] = d & 255),
        (d = d >> 8),
        (i[3] = d & 255),
        (d = d >> 8),
        (i[2] = d & 255),
        (d = d >> 8),
        (i[1] = d & 255),
        e.push(i));
    } else
      throw new Error(
        `${decodeErrPrefix} encountered BigInt larger than allowable range`
      );
  }
}
encodeUint.encodedSize = function (o) {
  return encodeUintValue.encodedSize(o.value);
};
encodeUintValue.encodedSize = function (o) {
  return o < uintBoundaries[0]
    ? 1
    : o < uintBoundaries[1]
      ? 2
      : o < uintBoundaries[2]
        ? 3
        : o < uintBoundaries[3]
          ? 5
          : 9;
};
encodeUint.compareTokens = function (o, a) {
  return o.value < a.value ? -1 : o.value > a.value ? 1 : 0;
};
function decodeNegint8(e, o, a, s) {
  return new Token(Type.negint, -1 - readUint8(e, o + 1, s), 2);
}
function decodeNegint16(e, o, a, s) {
  return new Token(Type.negint, -1 - readUint16(e, o + 1, s), 3);
}
function decodeNegint32(e, o, a, s) {
  return new Token(Type.negint, -1 - readUint32(e, o + 1, s), 5);
}
const neg1b = BigInt(-1),
  pos1b = BigInt(1);
function decodeNegint64(e, o, a, s) {
  const i = readUint64(e, o + 1, s);
  if (typeof i != 'bigint') {
    const c = -1 - i;
    if (c >= Number.MIN_SAFE_INTEGER) return new Token(Type.negint, c, 9);
  }
  if (s.allowBigInt !== !0)
    throw new Error(
      `${decodeErrPrefix} integers outside of the safe integer range are not supported`
    );
  return new Token(Type.negint, neg1b - BigInt(i), 9);
}
function encodeNegint(e, o) {
  const a = o.value,
    s = typeof a == 'bigint' ? a * neg1b - pos1b : a * -1 - 1;
  encodeUintValue(e, o.type.majorEncoded, s);
}
encodeNegint.encodedSize = function (o) {
  const a = o.value,
    s = typeof a == 'bigint' ? a * neg1b - pos1b : a * -1 - 1;
  return s < uintBoundaries[0]
    ? 1
    : s < uintBoundaries[1]
      ? 2
      : s < uintBoundaries[2]
        ? 3
        : s < uintBoundaries[3]
          ? 5
          : 9;
};
encodeNegint.compareTokens = function (o, a) {
  return o.value < a.value ? 1 : o.value > a.value ? -1 : 0;
};
function toToken$3(e, o, a, s) {
  assertEnoughData(e, o, a + s);
  const i = slice(e, o + a, o + a + s);
  return new Token(Type.bytes, i, a + s);
}
function decodeBytesCompact(e, o, a, s) {
  return toToken$3(e, o, 1, a);
}
function decodeBytes8(e, o, a, s) {
  return toToken$3(e, o, 2, readUint8(e, o + 1, s));
}
function decodeBytes16(e, o, a, s) {
  return toToken$3(e, o, 3, readUint16(e, o + 1, s));
}
function decodeBytes32(e, o, a, s) {
  return toToken$3(e, o, 5, readUint32(e, o + 1, s));
}
function decodeBytes64(e, o, a, s) {
  const i = readUint64(e, o + 1, s);
  if (typeof i == 'bigint')
    throw new Error(
      `${decodeErrPrefix} 64-bit integer bytes lengths not supported`
    );
  return toToken$3(e, o, 9, i);
}
function tokenBytes(e) {
  return (
    e.encodedBytes === void 0 &&
      (e.encodedBytes =
        e.type === Type.string ? fromString$6(e.value) : e.value),
    e.encodedBytes
  );
}
function encodeBytes(e, o) {
  const a = tokenBytes(o);
  (encodeUintValue(e, o.type.majorEncoded, a.length), e.push(a));
}
encodeBytes.encodedSize = function (o) {
  const a = tokenBytes(o);
  return encodeUintValue.encodedSize(a.length) + a.length;
};
encodeBytes.compareTokens = function (o, a) {
  return compareBytes(tokenBytes(o), tokenBytes(a));
};
function compareBytes(e, o) {
  return e.length < o.length ? -1 : e.length > o.length ? 1 : compare(e, o);
}
function toToken$2(e, o, a, s, i) {
  const c = a + s;
  assertEnoughData(e, o, c);
  const d = new Token(Type.string, toString$6(e, o + a, o + c), c);
  return (
    i.retainStringBytes === !0 && (d.byteValue = slice(e, o + a, o + c)),
    d
  );
}
function decodeStringCompact(e, o, a, s) {
  return toToken$2(e, o, 1, a, s);
}
function decodeString8(e, o, a, s) {
  return toToken$2(e, o, 2, readUint8(e, o + 1, s), s);
}
function decodeString16(e, o, a, s) {
  return toToken$2(e, o, 3, readUint16(e, o + 1, s), s);
}
function decodeString32(e, o, a, s) {
  return toToken$2(e, o, 5, readUint32(e, o + 1, s), s);
}
function decodeString64(e, o, a, s) {
  const i = readUint64(e, o + 1, s);
  if (typeof i == 'bigint')
    throw new Error(
      `${decodeErrPrefix} 64-bit integer string lengths not supported`
    );
  return toToken$2(e, o, 9, i, s);
}
const encodeString = encodeBytes;
function toToken$1(e, o, a, s) {
  return new Token(Type.array, s, a);
}
function decodeArrayCompact(e, o, a, s) {
  return toToken$1(e, o, 1, a);
}
function decodeArray8(e, o, a, s) {
  return toToken$1(e, o, 2, readUint8(e, o + 1, s));
}
function decodeArray16(e, o, a, s) {
  return toToken$1(e, o, 3, readUint16(e, o + 1, s));
}
function decodeArray32(e, o, a, s) {
  return toToken$1(e, o, 5, readUint32(e, o + 1, s));
}
function decodeArray64(e, o, a, s) {
  const i = readUint64(e, o + 1, s);
  if (typeof i == 'bigint')
    throw new Error(
      `${decodeErrPrefix} 64-bit integer array lengths not supported`
    );
  return toToken$1(e, o, 9, i);
}
function decodeArrayIndefinite(e, o, a, s) {
  if (s.allowIndefinite === !1)
    throw new Error(`${decodeErrPrefix} indefinite length items not allowed`);
  return toToken$1(e, o, 1, 1 / 0);
}
function encodeArray(e, o) {
  encodeUintValue(e, Type.array.majorEncoded, o.value);
}
encodeArray.compareTokens = encodeUint.compareTokens;
encodeArray.encodedSize = function (o) {
  return encodeUintValue.encodedSize(o.value);
};
function toToken(e, o, a, s) {
  return new Token(Type.map, s, a);
}
function decodeMapCompact(e, o, a, s) {
  return toToken(e, o, 1, a);
}
function decodeMap8(e, o, a, s) {
  return toToken(e, o, 2, readUint8(e, o + 1, s));
}
function decodeMap16(e, o, a, s) {
  return toToken(e, o, 3, readUint16(e, o + 1, s));
}
function decodeMap32(e, o, a, s) {
  return toToken(e, o, 5, readUint32(e, o + 1, s));
}
function decodeMap64(e, o, a, s) {
  const i = readUint64(e, o + 1, s);
  if (typeof i == 'bigint')
    throw new Error(
      `${decodeErrPrefix} 64-bit integer map lengths not supported`
    );
  return toToken(e, o, 9, i);
}
function decodeMapIndefinite(e, o, a, s) {
  if (s.allowIndefinite === !1)
    throw new Error(`${decodeErrPrefix} indefinite length items not allowed`);
  return toToken(e, o, 1, 1 / 0);
}
function encodeMap(e, o) {
  encodeUintValue(e, Type.map.majorEncoded, o.value);
}
encodeMap.compareTokens = encodeUint.compareTokens;
encodeMap.encodedSize = function (o) {
  return encodeUintValue.encodedSize(o.value);
};
function decodeTagCompact(e, o, a, s) {
  return new Token(Type.tag, a, 1);
}
function decodeTag8(e, o, a, s) {
  return new Token(Type.tag, readUint8(e, o + 1, s), 2);
}
function decodeTag16(e, o, a, s) {
  return new Token(Type.tag, readUint16(e, o + 1, s), 3);
}
function decodeTag32(e, o, a, s) {
  return new Token(Type.tag, readUint32(e, o + 1, s), 5);
}
function decodeTag64(e, o, a, s) {
  return new Token(Type.tag, readUint64(e, o + 1, s), 9);
}
function encodeTag(e, o) {
  encodeUintValue(e, Type.tag.majorEncoded, o.value);
}
encodeTag.compareTokens = encodeUint.compareTokens;
encodeTag.encodedSize = function (o) {
  return encodeUintValue.encodedSize(o.value);
};
const MINOR_FALSE = 20,
  MINOR_TRUE = 21,
  MINOR_NULL = 22,
  MINOR_UNDEFINED = 23;
function decodeUndefined(e, o, a, s) {
  if (s.allowUndefined === !1)
    throw new Error(`${decodeErrPrefix} undefined values are not supported`);
  return s.coerceUndefinedToNull === !0
    ? new Token(Type.null, null, 1)
    : new Token(Type.undefined, void 0, 1);
}
function decodeBreak(e, o, a, s) {
  if (s.allowIndefinite === !1)
    throw new Error(`${decodeErrPrefix} indefinite length items not allowed`);
  return new Token(Type.break, void 0, 1);
}
function createToken(e, o, a) {
  if (a) {
    if (a.allowNaN === !1 && Number.isNaN(e))
      throw new Error(`${decodeErrPrefix} NaN values are not supported`);
    if (a.allowInfinity === !1 && (e === 1 / 0 || e === -1 / 0))
      throw new Error(`${decodeErrPrefix} Infinity values are not supported`);
  }
  return new Token(Type.float, e, o);
}
function decodeFloat16(e, o, a, s) {
  return createToken(readFloat16(e, o + 1), 3, s);
}
function decodeFloat32(e, o, a, s) {
  return createToken(readFloat32(e, o + 1), 5, s);
}
function decodeFloat64(e, o, a, s) {
  return createToken(readFloat64(e, o + 1), 9, s);
}
function encodeFloat(e, o, a) {
  const s = o.value;
  if (s === !1) e.push([Type.float.majorEncoded | MINOR_FALSE]);
  else if (s === !0) e.push([Type.float.majorEncoded | MINOR_TRUE]);
  else if (s === null) e.push([Type.float.majorEncoded | MINOR_NULL]);
  else if (s === void 0) e.push([Type.float.majorEncoded | MINOR_UNDEFINED]);
  else {
    let i,
      c = !1;
    ((!a || a.float64 !== !0) &&
      (encodeFloat16(s),
      (i = readFloat16(ui8a, 1)),
      s === i || Number.isNaN(s)
        ? ((ui8a[0] = 249), e.push(ui8a.slice(0, 3)), (c = !0))
        : (encodeFloat32(s),
          (i = readFloat32(ui8a, 1)),
          s === i && ((ui8a[0] = 250), e.push(ui8a.slice(0, 5)), (c = !0)))),
      c ||
        (encodeFloat64(s),
        (i = readFloat64(ui8a, 1)),
        (ui8a[0] = 251),
        e.push(ui8a.slice(0, 9))));
  }
}
encodeFloat.encodedSize = function (o, a) {
  const s = o.value;
  if (s === !1 || s === !0 || s === null || s === void 0) return 1;
  if (!a || a.float64 !== !0) {
    encodeFloat16(s);
    let i = readFloat16(ui8a, 1);
    if (s === i || Number.isNaN(s)) return 3;
    if ((encodeFloat32(s), (i = readFloat32(ui8a, 1)), s === i)) return 5;
  }
  return 9;
};
const buffer = new ArrayBuffer(9),
  dataView = new DataView(buffer, 1),
  ui8a = new Uint8Array(buffer, 0);
function encodeFloat16(e) {
  if (e === 1 / 0) dataView.setUint16(0, 31744, !1);
  else if (e === -1 / 0) dataView.setUint16(0, 64512, !1);
  else if (Number.isNaN(e)) dataView.setUint16(0, 32256, !1);
  else {
    dataView.setFloat32(0, e);
    const o = dataView.getUint32(0),
      a = (o & 2139095040) >> 23,
      s = o & 8388607;
    if (a === 255) dataView.setUint16(0, 31744, !1);
    else if (a === 0)
      dataView.setUint16(0, ((e & 2147483648) >> 16) | (s >> 13), !1);
    else {
      const i = a - 127;
      i < -24
        ? dataView.setUint16(0, 0)
        : i < -14
          ? dataView.setUint16(
              0,
              ((o & 2147483648) >> 16) | (1 << (24 + i)),
              !1
            )
          : dataView.setUint16(
              0,
              ((o & 2147483648) >> 16) | ((i + 15) << 10) | (s >> 13),
              !1
            );
    }
  }
}
function readFloat16(e, o) {
  if (e.length - o < 2)
    throw new Error(`${decodeErrPrefix} not enough data for float16`);
  const a = (e[o] << 8) + e[o + 1];
  if (a === 31744) return 1 / 0;
  if (a === 64512) return -1 / 0;
  if (a === 32256) return NaN;
  const s = (a >> 10) & 31,
    i = a & 1023;
  let c;
  return (
    s === 0
      ? (c = i * 2 ** -24)
      : s !== 31
        ? (c = (i + 1024) * 2 ** (s - 25))
        : (c = i === 0 ? 1 / 0 : NaN),
    a & 32768 ? -c : c
  );
}
function encodeFloat32(e) {
  dataView.setFloat32(0, e, !1);
}
function readFloat32(e, o) {
  if (e.length - o < 4)
    throw new Error(`${decodeErrPrefix} not enough data for float32`);
  const a = (e.byteOffset || 0) + o;
  return new DataView(e.buffer, a, 4).getFloat32(0, !1);
}
function encodeFloat64(e) {
  dataView.setFloat64(0, e, !1);
}
function readFloat64(e, o) {
  if (e.length - o < 8)
    throw new Error(`${decodeErrPrefix} not enough data for float64`);
  const a = (e.byteOffset || 0) + o;
  return new DataView(e.buffer, a, 8).getFloat64(0, !1);
}
encodeFloat.compareTokens = encodeUint.compareTokens;
function invalidMinor(e, o, a) {
  throw new Error(
    `${decodeErrPrefix} encountered invalid minor (${a}) for major ${e[o] >>> 5}`
  );
}
function errorer(e) {
  return () => {
    throw new Error(`${decodeErrPrefix} ${e}`);
  };
}
const jump = [];
for (let e = 0; e <= 23; e++) jump[e] = invalidMinor;
jump[24] = decodeUint8;
jump[25] = decodeUint16;
jump[26] = decodeUint32;
jump[27] = decodeUint64;
jump[28] = invalidMinor;
jump[29] = invalidMinor;
jump[30] = invalidMinor;
jump[31] = invalidMinor;
for (let e = 32; e <= 55; e++) jump[e] = invalidMinor;
jump[56] = decodeNegint8;
jump[57] = decodeNegint16;
jump[58] = decodeNegint32;
jump[59] = decodeNegint64;
jump[60] = invalidMinor;
jump[61] = invalidMinor;
jump[62] = invalidMinor;
jump[63] = invalidMinor;
for (let e = 64; e <= 87; e++) jump[e] = decodeBytesCompact;
jump[88] = decodeBytes8;
jump[89] = decodeBytes16;
jump[90] = decodeBytes32;
jump[91] = decodeBytes64;
jump[92] = invalidMinor;
jump[93] = invalidMinor;
jump[94] = invalidMinor;
jump[95] = errorer('indefinite length bytes/strings are not supported');
for (let e = 96; e <= 119; e++) jump[e] = decodeStringCompact;
jump[120] = decodeString8;
jump[121] = decodeString16;
jump[122] = decodeString32;
jump[123] = decodeString64;
jump[124] = invalidMinor;
jump[125] = invalidMinor;
jump[126] = invalidMinor;
jump[127] = errorer('indefinite length bytes/strings are not supported');
for (let e = 128; e <= 151; e++) jump[e] = decodeArrayCompact;
jump[152] = decodeArray8;
jump[153] = decodeArray16;
jump[154] = decodeArray32;
jump[155] = decodeArray64;
jump[156] = invalidMinor;
jump[157] = invalidMinor;
jump[158] = invalidMinor;
jump[159] = decodeArrayIndefinite;
for (let e = 160; e <= 183; e++) jump[e] = decodeMapCompact;
jump[184] = decodeMap8;
jump[185] = decodeMap16;
jump[186] = decodeMap32;
jump[187] = decodeMap64;
jump[188] = invalidMinor;
jump[189] = invalidMinor;
jump[190] = invalidMinor;
jump[191] = decodeMapIndefinite;
for (let e = 192; e <= 215; e++) jump[e] = decodeTagCompact;
jump[216] = decodeTag8;
jump[217] = decodeTag16;
jump[218] = decodeTag32;
jump[219] = decodeTag64;
jump[220] = invalidMinor;
jump[221] = invalidMinor;
jump[222] = invalidMinor;
jump[223] = invalidMinor;
for (let e = 224; e <= 243; e++)
  jump[e] = errorer('simple values are not supported');
jump[244] = invalidMinor;
jump[245] = invalidMinor;
jump[246] = invalidMinor;
jump[247] = decodeUndefined;
jump[248] = errorer('simple values are not supported');
jump[249] = decodeFloat16;
jump[250] = decodeFloat32;
jump[251] = decodeFloat64;
jump[252] = invalidMinor;
jump[253] = invalidMinor;
jump[254] = invalidMinor;
jump[255] = decodeBreak;
const quick = [];
for (let e = 0; e < 24; e++) quick[e] = new Token(Type.uint, e, 1);
for (let e = -1; e >= -24; e--) quick[31 - e] = new Token(Type.negint, e, 1);
quick[64] = new Token(Type.bytes, new Uint8Array(0), 1);
quick[96] = new Token(Type.string, '', 1);
quick[128] = new Token(Type.array, 0, 1);
quick[160] = new Token(Type.map, 0, 1);
quick[244] = new Token(Type.false, !1, 1);
quick[245] = new Token(Type.true, !0, 1);
quick[246] = new Token(Type.null, null, 1);
function quickEncodeToken(e) {
  switch (e.type) {
    case Type.false:
      return fromArray([244]);
    case Type.true:
      return fromArray([245]);
    case Type.null:
      return fromArray([246]);
    case Type.bytes:
      return e.value.length ? void 0 : fromArray([64]);
    case Type.string:
      return e.value === '' ? fromArray([96]) : void 0;
    case Type.array:
      return e.value === 0 ? fromArray([128]) : void 0;
    case Type.map:
      return e.value === 0 ? fromArray([160]) : void 0;
    case Type.uint:
      return e.value < 24 ? fromArray([Number(e.value)]) : void 0;
    case Type.negint:
      if (e.value >= -24) return fromArray([31 - Number(e.value)]);
  }
}
const defaultEncodeOptions$1 = {
  float64: !1,
  mapSorter: mapSorter$1,
  quickEncodeToken,
};
function makeCborEncoders() {
  const e = [];
  return (
    (e[Type.uint.major] = encodeUint),
    (e[Type.negint.major] = encodeNegint),
    (e[Type.bytes.major] = encodeBytes),
    (e[Type.string.major] = encodeString),
    (e[Type.array.major] = encodeArray),
    (e[Type.map.major] = encodeMap),
    (e[Type.tag.major] = encodeTag),
    (e[Type.float.major] = encodeFloat),
    e
  );
}
const cborEncoders = makeCborEncoders(),
  buf = new Bl();
class Ref {
  constructor(o, a) {
    ((this.obj = o), (this.parent = a));
  }
  includes(o) {
    let a = this;
    do if (a.obj === o) return !0;
    while ((a = a.parent));
    return !1;
  }
  static createCheck(o, a) {
    if (o && o.includes(a))
      throw new Error(`${encodeErrPrefix} object contains circular references`);
    return new Ref(a, o);
  }
}
const simpleTokens = {
    null: new Token(Type.null, null),
    undefined: new Token(Type.undefined, void 0),
    true: new Token(Type.true, !0),
    false: new Token(Type.false, !1),
    emptyArray: new Token(Type.array, 0),
    emptyMap: new Token(Type.map, 0),
  },
  typeEncoders = {
    number(e, o, a, s) {
      return !Number.isInteger(e) || !Number.isSafeInteger(e)
        ? new Token(Type.float, e)
        : e >= 0
          ? new Token(Type.uint, e)
          : new Token(Type.negint, e);
    },
    bigint(e, o, a, s) {
      return e >= BigInt(0)
        ? new Token(Type.uint, e)
        : new Token(Type.negint, e);
    },
    Uint8Array(e, o, a, s) {
      return new Token(Type.bytes, e);
    },
    string(e, o, a, s) {
      return new Token(Type.string, e);
    },
    boolean(e, o, a, s) {
      return e ? simpleTokens.true : simpleTokens.false;
    },
    null(e, o, a, s) {
      return simpleTokens.null;
    },
    undefined(e, o, a, s) {
      return simpleTokens.undefined;
    },
    ArrayBuffer(e, o, a, s) {
      return new Token(Type.bytes, new Uint8Array(e));
    },
    DataView(e, o, a, s) {
      return new Token(
        Type.bytes,
        new Uint8Array(e.buffer, e.byteOffset, e.byteLength)
      );
    },
    Array(e, o, a, s) {
      if (!e.length)
        return a.addBreakTokens === !0
          ? [simpleTokens.emptyArray, new Token(Type.break)]
          : simpleTokens.emptyArray;
      s = Ref.createCheck(s, e);
      const i = [];
      let c = 0;
      for (const d of e) i[c++] = objectToTokens(d, a, s);
      return a.addBreakTokens
        ? [new Token(Type.array, e.length), i, new Token(Type.break)]
        : [new Token(Type.array, e.length), i];
    },
    Object(e, o, a, s) {
      const i = o !== 'Object',
        c = i ? e.keys() : Object.keys(e),
        d = i ? e.size : c.length;
      if (!d)
        return a.addBreakTokens === !0
          ? [simpleTokens.emptyMap, new Token(Type.break)]
          : simpleTokens.emptyMap;
      s = Ref.createCheck(s, e);
      const h = [];
      let b = 0;
      for (const g of c)
        h[b++] = [
          objectToTokens(g, a, s),
          objectToTokens(i ? e.get(g) : e[g], a, s),
        ];
      return (
        sortMapEntries(h, a),
        a.addBreakTokens
          ? [new Token(Type.map, d), h, new Token(Type.break)]
          : [new Token(Type.map, d), h]
      );
    },
  };
typeEncoders.Map = typeEncoders.Object;
typeEncoders.Buffer = typeEncoders.Uint8Array;
for (const e of 'Uint8Clamped Uint16 Uint32 Int8 Int16 Int32 BigUint64 BigInt64 Float32 Float64'.split(
  ' '
))
  typeEncoders[`${e}Array`] = typeEncoders.DataView;
function objectToTokens(e, o = {}, a) {
  const s = is(e),
    i = (o && o.typeEncoders && o.typeEncoders[s]) || typeEncoders[s];
  if (typeof i == 'function') {
    const d = i(e, s, o, a);
    if (d != null) return d;
  }
  const c = typeEncoders[s];
  if (!c) throw new Error(`${encodeErrPrefix} unsupported type: ${s}`);
  return c(e, s, o, a);
}
function sortMapEntries(e, o) {
  o.mapSorter && e.sort(o.mapSorter);
}
function mapSorter$1(e, o) {
  const a = Array.isArray(e[0]) ? e[0][0] : e[0],
    s = Array.isArray(o[0]) ? o[0][0] : o[0];
  if (a.type !== s.type) return a.type.compare(s.type);
  const i = a.type.major,
    c = cborEncoders[i].compareTokens(a, s);
  return (
    c === 0 &&
      console.warn(
        'WARNING: complex key types used, CBOR key sorting guarantees are gone'
      ),
    c
  );
}
function tokensToEncoded(e, o, a, s) {
  if (Array.isArray(o)) for (const i of o) tokensToEncoded(e, i, a, s);
  else a[o.type.major](e, o, s);
}
function encodeCustom(e, o, a) {
  const s = objectToTokens(e, a);
  if (!Array.isArray(s) && a.quickEncodeToken) {
    const i = a.quickEncodeToken(s);
    if (i) return i;
    const c = o[s.type.major];
    if (c.encodedSize) {
      const d = c.encodedSize(s, a),
        h = new Bl(d);
      if ((c(h, s, a), h.chunks.length !== 1))
        throw new Error(
          `Unexpected error: pre-calculated length for ${s} was wrong`
        );
      return asU8A(h.chunks[0]);
    }
  }
  return (buf.reset(), tokensToEncoded(buf, s, o, a), buf.toBytes(!0));
}
function encode$m(e, o) {
  return (
    (o = Object.assign({}, defaultEncodeOptions$1, o)),
    encodeCustom(e, cborEncoders, o)
  );
}
const defaultDecodeOptions = {
  strict: !1,
  allowIndefinite: !0,
  allowUndefined: !0,
  allowBigInt: !0,
};
class Tokeniser {
  constructor(o, a = {}) {
    ((this._pos = 0), (this.data = o), (this.options = a));
  }
  pos() {
    return this._pos;
  }
  done() {
    return this._pos >= this.data.length;
  }
  next() {
    const o = this.data[this._pos];
    let a = quick[o];
    if (a === void 0) {
      const s = jump[o];
      if (!s)
        throw new Error(
          `${decodeErrPrefix} no decoder for major type ${o >>> 5} (byte 0x${o.toString(16).padStart(2, '0')})`
        );
      const i = o & 31;
      a = s(this.data, this._pos, i, this.options);
    }
    return ((this._pos += a.encodedLength), a);
  }
}
const DONE = Symbol.for('DONE'),
  BREAK = Symbol.for('BREAK');
function tokenToArray(e, o, a) {
  const s = [];
  for (let i = 0; i < e.value; i++) {
    const c = tokensToObject(o, a);
    if (c === BREAK) {
      if (e.value === 1 / 0) break;
      throw new Error(
        `${decodeErrPrefix} got unexpected break to lengthed array`
      );
    }
    if (c === DONE)
      throw new Error(
        `${decodeErrPrefix} found array but not enough entries (got ${i}, expected ${e.value})`
      );
    s[i] = c;
  }
  return s;
}
function tokenToMap(e, o, a) {
  const s = a.useMaps === !0,
    i = s ? void 0 : {},
    c = s ? new Map() : void 0;
  for (let d = 0; d < e.value; d++) {
    const h = tokensToObject(o, a);
    if (h === BREAK) {
      if (e.value === 1 / 0) break;
      throw new Error(
        `${decodeErrPrefix} got unexpected break to lengthed map`
      );
    }
    if (h === DONE)
      throw new Error(
        `${decodeErrPrefix} found map but not enough entries (got ${d} [no key], expected ${e.value})`
      );
    if (s !== !0 && typeof h != 'string')
      throw new Error(
        `${decodeErrPrefix} non-string keys not supported (got ${typeof h})`
      );
    if (a.rejectDuplicateMapKeys === !0 && ((s && c.has(h)) || (!s && h in i)))
      throw new Error(`${decodeErrPrefix} found repeat map key "${h}"`);
    const b = tokensToObject(o, a);
    if (b === DONE)
      throw new Error(
        `${decodeErrPrefix} found map but not enough entries (got ${d} [no value], expected ${e.value})`
      );
    s ? c.set(h, b) : (i[h] = b);
  }
  return s ? c : i;
}
function tokensToObject(e, o) {
  if (e.done()) return DONE;
  const a = e.next();
  if (a.type === Type.break) return BREAK;
  if (a.type.terminal) return a.value;
  if (a.type === Type.array) return tokenToArray(a, e, o);
  if (a.type === Type.map) return tokenToMap(a, e, o);
  if (a.type === Type.tag) {
    if (o.tags && typeof o.tags[a.value] == 'function') {
      const s = tokensToObject(e, o);
      return o.tags[a.value](s);
    }
    throw new Error(`${decodeErrPrefix} tag not supported (${a.value})`);
  }
  throw new Error('unsupported');
}
function decodeFirst(e, o) {
  if (!(e instanceof Uint8Array))
    throw new Error(`${decodeErrPrefix} data to decode must be a Uint8Array`);
  o = Object.assign({}, defaultDecodeOptions, o);
  const a = o.tokenizer || new Tokeniser(e, o),
    s = tokensToObject(a, o);
  if (s === DONE)
    throw new Error(`${decodeErrPrefix} did not find any content to decode`);
  if (s === BREAK) throw new Error(`${decodeErrPrefix} got unexpected break`);
  return [s, e.subarray(a.pos())];
}
function decode$u(e, o) {
  const [a, s] = decodeFirst(e, o);
  if (s.length > 0)
    throw new Error(
      `${decodeErrPrefix} too many terminals, data makes no sense`
    );
  return a;
}
function equals$9(e, o) {
  if (e === o) return !0;
  if (e.byteLength !== o.byteLength) return !1;
  for (let a = 0; a < e.byteLength; a++) if (e[a] !== o[a]) return !1;
  return !0;
}
function coerce$4(e) {
  if (e instanceof Uint8Array && e.constructor.name === 'Uint8Array') return e;
  if (e instanceof ArrayBuffer) return new Uint8Array(e);
  if (ArrayBuffer.isView(e))
    return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
  throw new Error('Unknown type, must be binary type');
}
function base$4(e, o) {
  if (e.length >= 255) throw new TypeError('Alphabet too long');
  for (var a = new Uint8Array(256), s = 0; s < a.length; s++) a[s] = 255;
  for (var i = 0; i < e.length; i++) {
    var c = e.charAt(i),
      d = c.charCodeAt(0);
    if (a[d] !== 255) throw new TypeError(c + ' is ambiguous');
    a[d] = i;
  }
  var h = e.length,
    b = e.charAt(0),
    g = Math.log(h) / Math.log(256),
    $ = Math.log(256) / Math.log(h);
  function _(j) {
    if (
      (j instanceof Uint8Array ||
        (ArrayBuffer.isView(j)
          ? (j = new Uint8Array(j.buffer, j.byteOffset, j.byteLength))
          : Array.isArray(j) && (j = Uint8Array.from(j))),
      !(j instanceof Uint8Array))
    )
      throw new TypeError('Expected Uint8Array');
    if (j.length === 0) return '';
    for (var nt = 0, lt = 0, tt = 0, et = j.length; tt !== et && j[tt] === 0; )
      (tt++, nt++);
    for (
      var rt = ((et - tt) * $ + 1) >>> 0, at = new Uint8Array(rt);
      tt !== et;

    ) {
      for (
        var ct = j[tt], dt = 0, ut = rt - 1;
        (ct !== 0 || dt < lt) && ut !== -1;
        ut--, dt++
      )
        ((ct += (256 * at[ut]) >>> 0),
          (at[ut] = ct % h >>> 0),
          (ct = (ct / h) >>> 0));
      if (ct !== 0) throw new Error('Non-zero carry');
      ((lt = dt), tt++);
    }
    for (var st = rt - lt; st !== rt && at[st] === 0; ) st++;
    for (var gt = b.repeat(nt); st < rt; ++st) gt += e.charAt(at[st]);
    return gt;
  }
  function _e(j) {
    if (typeof j != 'string') throw new TypeError('Expected String');
    if (j.length === 0) return new Uint8Array();
    var nt = 0;
    if (j[nt] !== ' ') {
      for (var lt = 0, tt = 0; j[nt] === b; ) (lt++, nt++);
      for (
        var et = ((j.length - nt) * g + 1) >>> 0, rt = new Uint8Array(et);
        j[nt];

      ) {
        var at = a[j.charCodeAt(nt)];
        if (at === 255) return;
        for (
          var ct = 0, dt = et - 1;
          (at !== 0 || ct < tt) && dt !== -1;
          dt--, ct++
        )
          ((at += (h * rt[dt]) >>> 0),
            (rt[dt] = at % 256 >>> 0),
            (at = (at / 256) >>> 0));
        if (at !== 0) throw new Error('Non-zero carry');
        ((tt = ct), nt++);
      }
      if (j[nt] !== ' ') {
        for (var ut = et - tt; ut !== et && rt[ut] === 0; ) ut++;
        for (var st = new Uint8Array(lt + (et - ut)), gt = lt; ut !== et; )
          st[gt++] = rt[ut++];
        return st;
      }
    }
  }
  function ot(j) {
    var nt = _e(j);
    if (nt) return nt;
    throw new Error(`Non-${o} character`);
  }
  return { encode: _, decodeUnsafe: _e, decode: ot };
}
var src$5 = base$4,
  _brrp__multiformats_scope_baseX$4 = src$5;
let Encoder$4 = class {
    constructor(o, a, s) {
      pt(this, 'name');
      pt(this, 'prefix');
      pt(this, 'baseEncode');
      ((this.name = o), (this.prefix = a), (this.baseEncode = s));
    }
    encode(o) {
      if (o instanceof Uint8Array) return `${this.prefix}${this.baseEncode(o)}`;
      throw Error('Unknown type, must be binary type');
    }
  },
  Decoder$4 = class {
    constructor(o, a, s) {
      pt(this, 'name');
      pt(this, 'prefix');
      pt(this, 'baseDecode');
      pt(this, 'prefixCodePoint');
      ((this.name = o), (this.prefix = a));
      const i = a.codePointAt(0);
      if (i === void 0) throw new Error('Invalid prefix character');
      ((this.prefixCodePoint = i), (this.baseDecode = s));
    }
    decode(o) {
      if (typeof o == 'string') {
        if (o.codePointAt(0) !== this.prefixCodePoint)
          throw Error(
            `Unable to decode multibase string ${JSON.stringify(o)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`
          );
        return this.baseDecode(o.slice(this.prefix.length));
      } else throw Error('Can only multibase decode strings');
    }
    or(o) {
      return or$4(this, o);
    }
  },
  ComposedDecoder$4 = class {
    constructor(o) {
      pt(this, 'decoders');
      this.decoders = o;
    }
    or(o) {
      return or$4(this, o);
    }
    decode(o) {
      const a = o[0],
        s = this.decoders[a];
      if (s != null) return s.decode(o);
      throw RangeError(
        `Unable to decode multibase string ${JSON.stringify(o)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`
      );
    }
  };
function or$4(e, o) {
  return new ComposedDecoder$4({
    ...(e.decoders ?? { [e.prefix]: e }),
    ...(o.decoders ?? { [o.prefix]: o }),
  });
}
let Codec$4 = class {
  constructor(o, a, s, i) {
    pt(this, 'name');
    pt(this, 'prefix');
    pt(this, 'baseEncode');
    pt(this, 'baseDecode');
    pt(this, 'encoder');
    pt(this, 'decoder');
    ((this.name = o),
      (this.prefix = a),
      (this.baseEncode = s),
      (this.baseDecode = i),
      (this.encoder = new Encoder$4(o, a, s)),
      (this.decoder = new Decoder$4(o, a, i)));
  }
  encode(o) {
    return this.encoder.encode(o);
  }
  decode(o) {
    return this.decoder.decode(o);
  }
};
function from$5({ name: e, prefix: o, encode: a, decode: s }) {
  return new Codec$4(e, o, a, s);
}
function baseX$4({ name: e, prefix: o, alphabet: a }) {
  const { encode: s, decode: i } = _brrp__multiformats_scope_baseX$4(a, e);
  return from$5({
    prefix: o,
    name: e,
    encode: s,
    decode: (c) => coerce$4(i(c)),
  });
}
function decode$t(e, o, a, s) {
  let i = e.length;
  for (; e[i - 1] === '='; ) --i;
  const c = new Uint8Array(((i * a) / 8) | 0);
  let d = 0,
    h = 0,
    b = 0;
  for (let g = 0; g < i; ++g) {
    const $ = o[e[g]];
    if ($ === void 0) throw new SyntaxError(`Non-${s} character`);
    ((h = (h << a) | $),
      (d += a),
      d >= 8 && ((d -= 8), (c[b++] = 255 & (h >> d))));
  }
  if (d >= a || 255 & (h << (8 - d)))
    throw new SyntaxError('Unexpected end of data');
  return c;
}
function encode$l(e, o, a) {
  const s = o[o.length - 1] === '=',
    i = (1 << a) - 1;
  let c = '',
    d = 0,
    h = 0;
  for (let b = 0; b < e.length; ++b)
    for (h = (h << 8) | e[b], d += 8; d > a; )
      ((d -= a), (c += o[i & (h >> d)]));
  if ((d !== 0 && (c += o[i & (h << (a - d))]), s))
    for (; (c.length * a) & 7; ) c += '=';
  return c;
}
function createAlphabetIdx$2(e) {
  const o = {};
  for (let a = 0; a < e.length; ++a) o[e[a]] = a;
  return o;
}
function rfc4648$4({ name: e, prefix: o, bitsPerChar: a, alphabet: s }) {
  const i = createAlphabetIdx$2(s);
  return from$5({
    prefix: o,
    name: e,
    encode(c) {
      return encode$l(c, s, a);
    },
    decode(c) {
      return decode$t(c, i, a, e);
    },
  });
}
const base32$7 = rfc4648$4({
  prefix: 'b',
  name: 'base32',
  alphabet: 'abcdefghijklmnopqrstuvwxyz234567',
  bitsPerChar: 5,
});
rfc4648$4({
  prefix: 'B',
  name: 'base32upper',
  alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
  bitsPerChar: 5,
});
rfc4648$4({
  prefix: 'c',
  name: 'base32pad',
  alphabet: 'abcdefghijklmnopqrstuvwxyz234567=',
  bitsPerChar: 5,
});
rfc4648$4({
  prefix: 'C',
  name: 'base32padupper',
  alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=',
  bitsPerChar: 5,
});
rfc4648$4({
  prefix: 'v',
  name: 'base32hex',
  alphabet: '0123456789abcdefghijklmnopqrstuv',
  bitsPerChar: 5,
});
rfc4648$4({
  prefix: 'V',
  name: 'base32hexupper',
  alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUV',
  bitsPerChar: 5,
});
rfc4648$4({
  prefix: 't',
  name: 'base32hexpad',
  alphabet: '0123456789abcdefghijklmnopqrstuv=',
  bitsPerChar: 5,
});
rfc4648$4({
  prefix: 'T',
  name: 'base32hexpadupper',
  alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUV=',
  bitsPerChar: 5,
});
rfc4648$4({
  prefix: 'h',
  name: 'base32z',
  alphabet: 'ybndrfg8ejkmcpqxot1uwisza345h769',
  bitsPerChar: 5,
});
const base36$7 = baseX$4({
  prefix: 'k',
  name: 'base36',
  alphabet: '0123456789abcdefghijklmnopqrstuvwxyz',
});
baseX$4({
  prefix: 'K',
  name: 'base36upper',
  alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
});
const base58btc$4 = baseX$4({
  name: 'base58btc',
  prefix: 'z',
  alphabet: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
});
baseX$4({
  name: 'base58flickr',
  prefix: 'Z',
  alphabet: '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ',
});
var encode_1$4 = encode$k,
  MSB$6 = 128,
  REST$6 = 127,
  MSBALL$4 = ~REST$6,
  INT$4 = Math.pow(2, 31);
function encode$k(e, o, a) {
  ((o = o || []), (a = a || 0));
  for (var s = a; e >= INT$4; ) ((o[a++] = (e & 255) | MSB$6), (e /= 128));
  for (; e & MSBALL$4; ) ((o[a++] = (e & 255) | MSB$6), (e >>>= 7));
  return ((o[a] = e | 0), (encode$k.bytes = a - s + 1), o);
}
var decode$s = read$4,
  MSB$1$4 = 128,
  REST$1$4 = 127;
function read$4(e, s) {
  var a = 0,
    s = s || 0,
    i = 0,
    c = s,
    d,
    h = e.length;
  do {
    if (c >= h)
      throw ((read$4.bytes = 0), new RangeError('Could not decode varint'));
    ((d = e[c++]),
      (a += i < 28 ? (d & REST$1$4) << i : (d & REST$1$4) * Math.pow(2, i)),
      (i += 7));
  } while (d >= MSB$1$4);
  return ((read$4.bytes = c - s), a);
}
var N1$5 = Math.pow(2, 7),
  N2$5 = Math.pow(2, 14),
  N3$5 = Math.pow(2, 21),
  N4$5 = Math.pow(2, 28),
  N5$5 = Math.pow(2, 35),
  N6$5 = Math.pow(2, 42),
  N7$5 = Math.pow(2, 49),
  N8$4 = Math.pow(2, 56),
  N9$4 = Math.pow(2, 63),
  length$4 = function (e) {
    return e < N1$5
      ? 1
      : e < N2$5
        ? 2
        : e < N3$5
          ? 3
          : e < N4$5
            ? 4
            : e < N5$5
              ? 5
              : e < N6$5
                ? 6
                : e < N7$5
                  ? 7
                  : e < N8$4
                    ? 8
                    : e < N9$4
                      ? 9
                      : 10;
  },
  varint$5 = { encode: encode_1$4, decode: decode$s, encodingLength: length$4 },
  _brrp_varint$3 = varint$5;
function decode$r(e, o = 0) {
  return [_brrp_varint$3.decode(e, o), _brrp_varint$3.decode.bytes];
}
function encodeTo$3(e, o, a = 0) {
  return (_brrp_varint$3.encode(e, o, a), o);
}
function encodingLength$4(e) {
  return _brrp_varint$3.encodingLength(e);
}
function create$6(e, o) {
  const a = o.byteLength,
    s = encodingLength$4(e),
    i = s + encodingLength$4(a),
    c = new Uint8Array(i + a);
  return (
    encodeTo$3(e, c, 0),
    encodeTo$3(a, c, s),
    c.set(o, i),
    new Digest$3(e, a, o, c)
  );
}
function decode$q(e) {
  const o = coerce$4(e),
    [a, s] = decode$r(o),
    [i, c] = decode$r(o.subarray(s)),
    d = o.subarray(s + c);
  if (d.byteLength !== i) throw new Error('Incorrect length');
  return new Digest$3(a, i, d, o);
}
function equals$8(e, o) {
  if (e === o) return !0;
  {
    const a = o;
    return (
      e.code === a.code &&
      e.size === a.size &&
      a.bytes instanceof Uint8Array &&
      equals$9(e.bytes, a.bytes)
    );
  }
}
let Digest$3 = class {
  constructor(o, a, s, i) {
    pt(this, 'code');
    pt(this, 'size');
    pt(this, 'digest');
    pt(this, 'bytes');
    ((this.code = o), (this.size = a), (this.digest = s), (this.bytes = i));
  }
};
function format$8(e, o) {
  const { bytes: a, version: s } = e;
  switch (s) {
    case 0:
      return toStringV0$3(a, baseCache$3(e), o ?? base58btc$4.encoder);
    default:
      return toStringV1$3(a, baseCache$3(e), o ?? base32$7.encoder);
  }
}
const cache$3 = new WeakMap();
function baseCache$3(e) {
  const o = cache$3.get(e);
  if (o == null) {
    const a = new Map();
    return (cache$3.set(e, a), a);
  }
  return o;
}
var Qt;
let CID$3 = class jt {
  constructor(o, a, s, i) {
    pt(this, 'code');
    pt(this, 'version');
    pt(this, 'multihash');
    pt(this, 'bytes');
    pt(this, '/');
    pt(this, Qt, 'CID');
    ((this.code = a),
      (this.version = o),
      (this.multihash = s),
      (this.bytes = i),
      (this['/'] = i));
  }
  get asCID() {
    return this;
  }
  get byteOffset() {
    return this.bytes.byteOffset;
  }
  get byteLength() {
    return this.bytes.byteLength;
  }
  toV0() {
    switch (this.version) {
      case 0:
        return this;
      case 1: {
        const { code: o, multihash: a } = this;
        if (o !== DAG_PB_CODE$3)
          throw new Error('Cannot convert a non dag-pb CID to CIDv0');
        if (a.code !== SHA_256_CODE$3)
          throw new Error('Cannot convert non sha2-256 multihash CID to CIDv0');
        return jt.createV0(a);
      }
      default:
        throw Error(
          `Can not convert CID version ${this.version} to version 0. This is a bug please report`
        );
    }
  }
  toV1() {
    switch (this.version) {
      case 0: {
        const { code: o, digest: a } = this.multihash,
          s = create$6(o, a);
        return jt.createV1(this.code, s);
      }
      case 1:
        return this;
      default:
        throw Error(
          `Can not convert CID version ${this.version} to version 1. This is a bug please report`
        );
    }
  }
  equals(o) {
    return jt.equals(this, o);
  }
  static equals(o, a) {
    const s = a;
    return (
      s != null &&
      o.code === s.code &&
      o.version === s.version &&
      equals$8(o.multihash, s.multihash)
    );
  }
  toString(o) {
    return format$8(this, o);
  }
  toJSON() {
    return { '/': format$8(this) };
  }
  link() {
    return this;
  }
  [((Qt = Symbol.toStringTag), Symbol.for('nodejs.util.inspect.custom'))]() {
    return `CID(${this.toString()})`;
  }
  static asCID(o) {
    if (o == null) return null;
    const a = o;
    if (a instanceof jt) return a;
    if ((a['/'] != null && a['/'] === a.bytes) || a.asCID === a) {
      const { version: s, code: i, multihash: c, bytes: d } = a;
      return new jt(s, i, c, d ?? encodeCID$4(s, i, c.bytes));
    } else if (a[cidSymbol$3] === !0) {
      const { version: s, multihash: i, code: c } = a,
        d = decode$q(i);
      return jt.create(s, c, d);
    } else return null;
  }
  static create(o, a, s) {
    if (typeof a != 'number')
      throw new Error('String codecs are no longer supported');
    if (!(s.bytes instanceof Uint8Array)) throw new Error('Invalid digest');
    switch (o) {
      case 0: {
        if (a !== DAG_PB_CODE$3)
          throw new Error(
            `Version 0 CID must use dag-pb (code: ${DAG_PB_CODE$3}) block encoding`
          );
        return new jt(o, a, s, s.bytes);
      }
      case 1: {
        const i = encodeCID$4(o, a, s.bytes);
        return new jt(o, a, s, i);
      }
      default:
        throw new Error('Invalid version');
    }
  }
  static createV0(o) {
    return jt.create(0, DAG_PB_CODE$3, o);
  }
  static createV1(o, a) {
    return jt.create(1, o, a);
  }
  static decode(o) {
    const [a, s] = jt.decodeFirst(o);
    if (s.length !== 0) throw new Error('Incorrect length');
    return a;
  }
  static decodeFirst(o) {
    const a = jt.inspectBytes(o),
      s = a.size - a.multihashSize,
      i = coerce$4(o.subarray(s, s + a.multihashSize));
    if (i.byteLength !== a.multihashSize) throw new Error('Incorrect length');
    const c = i.subarray(a.multihashSize - a.digestSize),
      d = new Digest$3(a.multihashCode, a.digestSize, c, i);
    return [
      a.version === 0 ? jt.createV0(d) : jt.createV1(a.codec, d),
      o.subarray(a.size),
    ];
  }
  static inspectBytes(o) {
    let a = 0;
    const s = () => {
      const [_, _e] = decode$r(o.subarray(a));
      return ((a += _e), _);
    };
    let i = s(),
      c = DAG_PB_CODE$3;
    if ((i === 18 ? ((i = 0), (a = 0)) : (c = s()), i !== 0 && i !== 1))
      throw new RangeError(`Invalid CID version ${i}`);
    const d = a,
      h = s(),
      b = s(),
      g = a + b,
      $ = g - d;
    return {
      version: i,
      codec: c,
      multihashCode: h,
      digestSize: b,
      multihashSize: $,
      size: g,
    };
  }
  static parse(o, a) {
    const [s, i] = parseCIDtoBytes$3(o, a),
      c = jt.decode(i);
    if (c.version === 0 && o[0] !== 'Q')
      throw Error('Version 0 CID string must not include multibase prefix');
    return (baseCache$3(c).set(s, o), c);
  }
};
function parseCIDtoBytes$3(e, o) {
  switch (e[0]) {
    case 'Q': {
      const a = o ?? base58btc$4;
      return [base58btc$4.prefix, a.decode(`${base58btc$4.prefix}${e}`)];
    }
    case base58btc$4.prefix: {
      const a = o ?? base58btc$4;
      return [base58btc$4.prefix, a.decode(e)];
    }
    case base32$7.prefix: {
      const a = o ?? base32$7;
      return [base32$7.prefix, a.decode(e)];
    }
    case base36$7.prefix: {
      const a = o ?? base36$7;
      return [base36$7.prefix, a.decode(e)];
    }
    default: {
      if (o == null)
        throw Error(
          'To parse non base32, base36 or base58btc encoded CID multibase decoder must be provided'
        );
      return [e[0], o.decode(e)];
    }
  }
}
function toStringV0$3(e, o, a) {
  const { prefix: s } = a;
  if (s !== base58btc$4.prefix)
    throw Error(`Cannot string encode V0 in ${a.name} encoding`);
  const i = o.get(s);
  if (i == null) {
    const c = a.encode(e).slice(1);
    return (o.set(s, c), c);
  } else return i;
}
function toStringV1$3(e, o, a) {
  const { prefix: s } = a,
    i = o.get(s);
  if (i == null) {
    const c = a.encode(e);
    return (o.set(s, c), c);
  } else return i;
}
const DAG_PB_CODE$3 = 112,
  SHA_256_CODE$3 = 18;
function encodeCID$4(e, o, a) {
  const s = encodingLength$4(e),
    i = s + encodingLength$4(o),
    c = new Uint8Array(i + a.byteLength);
  return (encodeTo$3(e, c, 0), encodeTo$3(o, c, s), c.set(a, i), c);
}
const cidSymbol$3 = Symbol.for('@ipld/js-cid/CID'),
  CID_CBOR_TAG = 42;
function toByteView$1(e) {
  return e instanceof ArrayBuffer ? new Uint8Array(e, 0, e.byteLength) : e;
}
function cidEncoder$1(e) {
  if (e.asCID !== e && e['/'] !== e.bytes) return null;
  const o = CID$3.asCID(e);
  if (!o) return null;
  const a = new Uint8Array(o.bytes.byteLength + 1);
  return (
    a.set(o.bytes, 1),
    [new Token(Type.tag, CID_CBOR_TAG), new Token(Type.bytes, a)]
  );
}
function undefinedEncoder$1() {
  throw new Error(
    '`undefined` is not supported by the IPLD Data Model and cannot be encoded'
  );
}
function numberEncoder$1(e) {
  if (Number.isNaN(e))
    throw new Error(
      '`NaN` is not supported by the IPLD Data Model and cannot be encoded'
    );
  if (e === 1 / 0 || e === -1 / 0)
    throw new Error(
      '`Infinity` and `-Infinity` is not supported by the IPLD Data Model and cannot be encoded'
    );
  return null;
}
const _encodeOptions = {
    float64: !0,
    typeEncoders: {
      Object: cidEncoder$1,
      undefined: undefinedEncoder$1,
      number: numberEncoder$1,
    },
  },
  encodeOptions$1 = {
    ..._encodeOptions,
    typeEncoders: { ..._encodeOptions.typeEncoders },
  };
function cidDecoder(e) {
  if (e[0] !== 0)
    throw new Error('Invalid CID for CBOR tag 42; expected leading 0x00');
  return CID$3.decode(e.subarray(1));
}
const _decodeOptions = {
  allowIndefinite: !1,
  coerceUndefinedToNull: !0,
  allowNaN: !1,
  allowInfinity: !1,
  allowBigInt: !0,
  strict: !0,
  useMaps: !1,
  rejectDuplicateMapKeys: !0,
  tags: [],
};
_decodeOptions.tags[CID_CBOR_TAG] = cidDecoder;
const decodeOptions$1 = {
    ..._decodeOptions,
    tags: _decodeOptions.tags.slice(),
  },
  name$5 = 'dag-cbor',
  code$5 = 113,
  encode$j = (e) => encode$m(e, _encodeOptions),
  decode$p = (e) => decode$u(toByteView$1(e), _decodeOptions),
  dagCBOR = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        code: code$5,
        decode: decode$p,
        decodeOptions: decodeOptions$1,
        encode: encode$j,
        encodeOptions: encodeOptions$1,
        name: name$5,
        toByteView: toByteView$1,
      },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  );
class JSONEncoder extends Array {
  constructor() {
    (super(), (this.inRecursive = []));
  }
  prefix(o) {
    const a = this.inRecursive[this.inRecursive.length - 1];
    a &&
      (a.type === Type.array &&
        (a.elements++, a.elements !== 1 && o.push([44])),
      a.type === Type.map &&
        (a.elements++,
        a.elements !== 1 &&
          (a.elements % 2 === 1 ? o.push([44]) : o.push([58]))));
  }
  [Type.uint.major](o, a) {
    this.prefix(o);
    const s = String(a.value),
      i = [];
    for (let c = 0; c < s.length; c++) i[c] = s.charCodeAt(c);
    o.push(i);
  }
  [Type.negint.major](o, a) {
    this[Type.uint.major](o, a);
  }
  [Type.bytes.major](o, a) {
    throw new Error(`${encodeErrPrefix} unsupported type: Uint8Array`);
  }
  [Type.string.major](o, a) {
    this.prefix(o);
    const s = fromString$6(JSON.stringify(a.value));
    o.push(s.length > 32 ? asU8A(s) : s);
  }
  [Type.array.major](o, a) {
    (this.prefix(o),
      this.inRecursive.push({ type: Type.array, elements: 0 }),
      o.push([91]));
  }
  [Type.map.major](o, a) {
    (this.prefix(o),
      this.inRecursive.push({ type: Type.map, elements: 0 }),
      o.push([123]));
  }
  [Type.tag.major](o, a) {}
  [Type.float.major](o, a) {
    if (a.type.name === 'break') {
      const d = this.inRecursive.pop();
      if (d) {
        if (d.type === Type.array) o.push([93]);
        else if (d.type === Type.map) o.push([125]);
        else
          throw new Error('Unexpected recursive type; this should not happen!');
        return;
      }
      throw new Error('Unexpected break; this should not happen!');
    }
    if (a.value === void 0)
      throw new Error(`${encodeErrPrefix} unsupported type: undefined`);
    if ((this.prefix(o), a.type.name === 'true')) {
      o.push([116, 114, 117, 101]);
      return;
    } else if (a.type.name === 'false') {
      o.push([102, 97, 108, 115, 101]);
      return;
    } else if (a.type.name === 'null') {
      o.push([110, 117, 108, 108]);
      return;
    }
    const s = String(a.value),
      i = [];
    let c = !1;
    for (let d = 0; d < s.length; d++)
      ((i[d] = s.charCodeAt(d)),
        !c && (i[d] === 46 || i[d] === 101 || i[d] === 69) && (c = !0));
    (c || (i.push(46), i.push(48)), o.push(i));
  }
}
function mapSorter(e, o) {
  if (Array.isArray(e[0]) || Array.isArray(o[0]))
    throw new Error(`${encodeErrPrefix} complex map keys are not supported`);
  const a = e[0],
    s = o[0];
  if (a.type !== Type.string || s.type !== Type.string)
    throw new Error(`${encodeErrPrefix} non-string map keys are not supported`);
  if (a < s) return -1;
  if (a > s) return 1;
  throw new Error(
    `${encodeErrPrefix} unexpected duplicate map keys, this is not supported`
  );
}
const defaultEncodeOptions = { addBreakTokens: !0, mapSorter };
function encode$i(e, o) {
  return (
    (o = Object.assign({}, defaultEncodeOptions, o)),
    encodeCustom(e, new JSONEncoder(), o)
  );
}
class Tokenizer {
  constructor(o, a = {}) {
    ((this._pos = 0),
      (this.data = o),
      (this.options = a),
      (this.modeStack = ['value']),
      (this.lastToken = ''));
  }
  pos() {
    return this._pos;
  }
  done() {
    return this._pos >= this.data.length;
  }
  ch() {
    return this.data[this._pos];
  }
  currentMode() {
    return this.modeStack[this.modeStack.length - 1];
  }
  skipWhitespace() {
    let o = this.ch();
    for (; o === 32 || o === 9 || o === 13 || o === 10; )
      o = this.data[++this._pos];
  }
  expect(o) {
    if (this.data.length - this._pos < o.length)
      throw new Error(
        `${decodeErrPrefix} unexpected end of input at position ${this._pos}`
      );
    for (let a = 0; a < o.length; a++)
      if (this.data[this._pos++] !== o[a])
        throw new Error(
          `${decodeErrPrefix} unexpected token at position ${this._pos}, expected to find '${String.fromCharCode(...o)}'`
        );
  }
  parseNumber() {
    const o = this._pos;
    let a = !1,
      s = !1;
    const i = (h) => {
      for (; !this.done(); ) {
        const b = this.ch();
        if (h.includes(b)) this._pos++;
        else break;
      }
    };
    if ((this.ch() === 45 && ((a = !0), this._pos++), this.ch() === 48))
      if ((this._pos++, this.ch() === 46)) (this._pos++, (s = !0));
      else return new Token(Type.uint, 0, this._pos - o);
    if ((i([48, 49, 50, 51, 52, 53, 54, 55, 56, 57]), a && this._pos === o + 1))
      throw new Error(
        `${decodeErrPrefix} unexpected token at position ${this._pos}`
      );
    if (!this.done() && this.ch() === 46) {
      if (s)
        throw new Error(
          `${decodeErrPrefix} unexpected token at position ${this._pos}`
        );
      ((s = !0), this._pos++, i([48, 49, 50, 51, 52, 53, 54, 55, 56, 57]));
    }
    !this.done() &&
      (this.ch() === 101 || this.ch() === 69) &&
      ((s = !0),
      this._pos++,
      !this.done() && (this.ch() === 43 || this.ch() === 45) && this._pos++,
      i([48, 49, 50, 51, 52, 53, 54, 55, 56, 57]));
    const c = String.fromCharCode.apply(null, this.data.subarray(o, this._pos)),
      d = parseFloat(c);
    return s
      ? new Token(Type.float, d, this._pos - o)
      : this.options.allowBigInt !== !0 || Number.isSafeInteger(d)
        ? new Token(d >= 0 ? Type.uint : Type.negint, d, this._pos - o)
        : new Token(d >= 0 ? Type.uint : Type.negint, BigInt(c), this._pos - o);
  }
  parseString() {
    if (this.ch() !== 34)
      throw new Error(
        `${decodeErrPrefix} unexpected character at position ${this._pos}; this shouldn't happen`
      );
    this._pos++;
    for (
      let c = this._pos, d = 0;
      c < this.data.length && d < 65536;
      c++, d++
    ) {
      const h = this.data[c];
      if (h === 92 || h < 32 || h >= 128) break;
      if (h === 34) {
        const b = String.fromCharCode.apply(
          null,
          this.data.subarray(this._pos, c)
        );
        return ((this._pos = c + 1), new Token(Type.string, b, d));
      }
    }
    const o = this._pos,
      a = [],
      s = () => {
        if (this._pos + 4 >= this.data.length)
          throw new Error(
            `${decodeErrPrefix} unexpected end of unicode escape sequence at position ${this._pos}`
          );
        let c = 0;
        for (let d = 0; d < 4; d++) {
          let h = this.ch();
          if (h >= 48 && h <= 57) h -= 48;
          else if (h >= 97 && h <= 102) h = h - 97 + 10;
          else if (h >= 65 && h <= 70) h = h - 65 + 10;
          else
            throw new Error(
              `${decodeErrPrefix} unexpected unicode escape character at position ${this._pos}`
            );
          ((c = c * 16 + h), this._pos++);
        }
        return c;
      },
      i = () => {
        const c = this.ch();
        let d = null,
          h = c > 239 ? 4 : c > 223 ? 3 : c > 191 ? 2 : 1;
        if (this._pos + h > this.data.length)
          throw new Error(
            `${decodeErrPrefix} unexpected unicode sequence at position ${this._pos}`
          );
        let b, g, $, _;
        switch (h) {
          case 1:
            c < 128 && (d = c);
            break;
          case 2:
            ((b = this.data[this._pos + 1]),
              (b & 192) === 128 &&
                ((_ = ((c & 31) << 6) | (b & 63)), _ > 127 && (d = _)));
            break;
          case 3:
            ((b = this.data[this._pos + 1]),
              (g = this.data[this._pos + 2]),
              (b & 192) === 128 &&
                (g & 192) === 128 &&
                ((_ = ((c & 15) << 12) | ((b & 63) << 6) | (g & 63)),
                _ > 2047 && (_ < 55296 || _ > 57343) && (d = _)));
            break;
          case 4:
            ((b = this.data[this._pos + 1]),
              (g = this.data[this._pos + 2]),
              ($ = this.data[this._pos + 3]),
              (b & 192) === 128 &&
                (g & 192) === 128 &&
                ($ & 192) === 128 &&
                ((_ =
                  ((c & 15) << 18) |
                  ((b & 63) << 12) |
                  ((g & 63) << 6) |
                  ($ & 63)),
                _ > 65535 && _ < 1114112 && (d = _)));
        }
        (d === null
          ? ((d = 65533), (h = 1))
          : d > 65535 &&
            ((d -= 65536),
            a.push(((d >>> 10) & 1023) | 55296),
            (d = 56320 | (d & 1023))),
          a.push(d),
          (this._pos += h));
      };
    for (; !this.done(); ) {
      const c = this.ch();
      let d;
      switch (c) {
        case 92:
          if ((this._pos++, this.done()))
            throw new Error(
              `${decodeErrPrefix} unexpected string termination at position ${this._pos}`
            );
          switch (((d = this.ch()), this._pos++, d)) {
            case 34:
            case 39:
            case 92:
            case 47:
              a.push(d);
              break;
            case 98:
              a.push(8);
              break;
            case 116:
              a.push(9);
              break;
            case 110:
              a.push(10);
              break;
            case 102:
              a.push(12);
              break;
            case 114:
              a.push(13);
              break;
            case 117:
              a.push(s());
              break;
            default:
              throw new Error(
                `${decodeErrPrefix} unexpected string escape character at position ${this._pos}`
              );
          }
          break;
        case 34:
          return (
            this._pos++,
            new Token(Type.string, decodeCodePointsArray(a), this._pos - o)
          );
        default:
          if (c < 32)
            throw new Error(
              `${decodeErrPrefix} invalid control character at position ${this._pos}`
            );
          c < 128 ? (a.push(c), this._pos++) : i();
      }
    }
    throw new Error(
      `${decodeErrPrefix} unexpected end of string at position ${this._pos}`
    );
  }
  parseValue() {
    switch (this.ch()) {
      case 123:
        return (
          this.modeStack.push('obj-start'),
          this._pos++,
          new Token(Type.map, 1 / 0, 1)
        );
      case 91:
        return (
          this.modeStack.push('array-start'),
          this._pos++,
          new Token(Type.array, 1 / 0, 1)
        );
      case 34:
        return this.parseString();
      case 110:
        return (
          this.expect([110, 117, 108, 108]),
          new Token(Type.null, null, 4)
        );
      case 102:
        return (
          this.expect([102, 97, 108, 115, 101]),
          new Token(Type.false, !1, 5)
        );
      case 116:
        return (this.expect([116, 114, 117, 101]), new Token(Type.true, !0, 4));
      case 45:
      case 48:
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        return this.parseNumber();
      default:
        throw new Error(
          `${decodeErrPrefix} unexpected character at position ${this._pos}`
        );
    }
  }
  next() {
    switch ((this.skipWhitespace(), this.currentMode())) {
      case 'value':
        return (this.modeStack.pop(), this.parseValue());
      case 'array-value': {
        if ((this.modeStack.pop(), this.ch() === 93))
          return (
            this._pos++,
            this.skipWhitespace(),
            new Token(Type.break, void 0, 1)
          );
        if (this.ch() !== 44)
          throw new Error(
            `${decodeErrPrefix} unexpected character at position ${this._pos}, was expecting array delimiter but found '${String.fromCharCode(this.ch())}'`
          );
        return (
          this._pos++,
          this.modeStack.push('array-value'),
          this.skipWhitespace(),
          this.parseValue()
        );
      }
      case 'array-start':
        return (
          this.modeStack.pop(),
          this.ch() === 93
            ? (this._pos++,
              this.skipWhitespace(),
              new Token(Type.break, void 0, 1))
            : (this.modeStack.push('array-value'),
              this.skipWhitespace(),
              this.parseValue())
        );
      case 'obj-key':
        if (this.ch() === 125)
          return (
            this.modeStack.pop(),
            this._pos++,
            this.skipWhitespace(),
            new Token(Type.break, void 0, 1)
          );
        if (this.ch() !== 44)
          throw new Error(
            `${decodeErrPrefix} unexpected character at position ${this._pos}, was expecting object delimiter but found '${String.fromCharCode(this.ch())}'`
          );
        (this._pos++, this.skipWhitespace());
      case 'obj-start': {
        if ((this.modeStack.pop(), this.ch() === 125))
          return (
            this._pos++,
            this.skipWhitespace(),
            new Token(Type.break, void 0, 1)
          );
        const o = this.parseString();
        if ((this.skipWhitespace(), this.ch() !== 58))
          throw new Error(
            `${decodeErrPrefix} unexpected character at position ${this._pos}, was expecting key/value delimiter ':' but found '${String.fromCharCode(this.ch())}'`
          );
        return (this._pos++, this.modeStack.push('obj-value'), o);
      }
      case 'obj-value':
        return (
          this.modeStack.pop(),
          this.modeStack.push('obj-key'),
          this.skipWhitespace(),
          this.parseValue()
        );
      default:
        throw new Error(
          `${decodeErrPrefix} unexpected parse state at position ${this._pos}; this shouldn't happen`
        );
    }
  }
}
function decode$o(e, o) {
  return (
    (o = Object.assign({ tokenizer: new Tokenizer(e, o) }, o)),
    decode$u(e, o)
  );
}
function equals$7(e, o) {
  if (e === o) return !0;
  if (e.byteLength !== o.byteLength) return !1;
  for (let a = 0; a < e.byteLength; a++) if (e[a] !== o[a]) return !1;
  return !0;
}
function coerce$3(e) {
  if (e instanceof Uint8Array && e.constructor.name === 'Uint8Array') return e;
  if (e instanceof ArrayBuffer) return new Uint8Array(e);
  if (ArrayBuffer.isView(e))
    return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
  throw new Error('Unknown type, must be binary type');
}
function base$3(e, o) {
  if (e.length >= 255) throw new TypeError('Alphabet too long');
  for (var a = new Uint8Array(256), s = 0; s < a.length; s++) a[s] = 255;
  for (var i = 0; i < e.length; i++) {
    var c = e.charAt(i),
      d = c.charCodeAt(0);
    if (a[d] !== 255) throw new TypeError(c + ' is ambiguous');
    a[d] = i;
  }
  var h = e.length,
    b = e.charAt(0),
    g = Math.log(h) / Math.log(256),
    $ = Math.log(256) / Math.log(h);
  function _(j) {
    if (
      (j instanceof Uint8Array ||
        (ArrayBuffer.isView(j)
          ? (j = new Uint8Array(j.buffer, j.byteOffset, j.byteLength))
          : Array.isArray(j) && (j = Uint8Array.from(j))),
      !(j instanceof Uint8Array))
    )
      throw new TypeError('Expected Uint8Array');
    if (j.length === 0) return '';
    for (var nt = 0, lt = 0, tt = 0, et = j.length; tt !== et && j[tt] === 0; )
      (tt++, nt++);
    for (
      var rt = ((et - tt) * $ + 1) >>> 0, at = new Uint8Array(rt);
      tt !== et;

    ) {
      for (
        var ct = j[tt], dt = 0, ut = rt - 1;
        (ct !== 0 || dt < lt) && ut !== -1;
        ut--, dt++
      )
        ((ct += (256 * at[ut]) >>> 0),
          (at[ut] = ct % h >>> 0),
          (ct = (ct / h) >>> 0));
      if (ct !== 0) throw new Error('Non-zero carry');
      ((lt = dt), tt++);
    }
    for (var st = rt - lt; st !== rt && at[st] === 0; ) st++;
    for (var gt = b.repeat(nt); st < rt; ++st) gt += e.charAt(at[st]);
    return gt;
  }
  function _e(j) {
    if (typeof j != 'string') throw new TypeError('Expected String');
    if (j.length === 0) return new Uint8Array();
    var nt = 0;
    if (j[nt] !== ' ') {
      for (var lt = 0, tt = 0; j[nt] === b; ) (lt++, nt++);
      for (
        var et = ((j.length - nt) * g + 1) >>> 0, rt = new Uint8Array(et);
        j[nt];

      ) {
        var at = a[j.charCodeAt(nt)];
        if (at === 255) return;
        for (
          var ct = 0, dt = et - 1;
          (at !== 0 || ct < tt) && dt !== -1;
          dt--, ct++
        )
          ((at += (h * rt[dt]) >>> 0),
            (rt[dt] = at % 256 >>> 0),
            (at = (at / 256) >>> 0));
        if (at !== 0) throw new Error('Non-zero carry');
        ((tt = ct), nt++);
      }
      if (j[nt] !== ' ') {
        for (var ut = et - tt; ut !== et && rt[ut] === 0; ) ut++;
        for (var st = new Uint8Array(lt + (et - ut)), gt = lt; ut !== et; )
          st[gt++] = rt[ut++];
        return st;
      }
    }
  }
  function ot(j) {
    var nt = _e(j);
    if (nt) return nt;
    throw new Error(`Non-${o} character`);
  }
  return { encode: _, decodeUnsafe: _e, decode: ot };
}
var src$4 = base$3,
  _brrp__multiformats_scope_baseX$3 = src$4;
let Encoder$3 = class {
    constructor(o, a, s) {
      pt(this, 'name');
      pt(this, 'prefix');
      pt(this, 'baseEncode');
      ((this.name = o), (this.prefix = a), (this.baseEncode = s));
    }
    encode(o) {
      if (o instanceof Uint8Array) return `${this.prefix}${this.baseEncode(o)}`;
      throw Error('Unknown type, must be binary type');
    }
  },
  Decoder$3 = class {
    constructor(o, a, s) {
      pt(this, 'name');
      pt(this, 'prefix');
      pt(this, 'baseDecode');
      pt(this, 'prefixCodePoint');
      ((this.name = o), (this.prefix = a));
      const i = a.codePointAt(0);
      if (i === void 0) throw new Error('Invalid prefix character');
      ((this.prefixCodePoint = i), (this.baseDecode = s));
    }
    decode(o) {
      if (typeof o == 'string') {
        if (o.codePointAt(0) !== this.prefixCodePoint)
          throw Error(
            `Unable to decode multibase string ${JSON.stringify(o)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`
          );
        return this.baseDecode(o.slice(this.prefix.length));
      } else throw Error('Can only multibase decode strings');
    }
    or(o) {
      return or$3(this, o);
    }
  },
  ComposedDecoder$3 = class {
    constructor(o) {
      pt(this, 'decoders');
      this.decoders = o;
    }
    or(o) {
      return or$3(this, o);
    }
    decode(o) {
      const a = o[0],
        s = this.decoders[a];
      if (s != null) return s.decode(o);
      throw RangeError(
        `Unable to decode multibase string ${JSON.stringify(o)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`
      );
    }
  };
function or$3(e, o) {
  return new ComposedDecoder$3({
    ...(e.decoders ?? { [e.prefix]: e }),
    ...(o.decoders ?? { [o.prefix]: o }),
  });
}
let Codec$3 = class {
  constructor(o, a, s, i) {
    pt(this, 'name');
    pt(this, 'prefix');
    pt(this, 'baseEncode');
    pt(this, 'baseDecode');
    pt(this, 'encoder');
    pt(this, 'decoder');
    ((this.name = o),
      (this.prefix = a),
      (this.baseEncode = s),
      (this.baseDecode = i),
      (this.encoder = new Encoder$3(o, a, s)),
      (this.decoder = new Decoder$3(o, a, i)));
  }
  encode(o) {
    return this.encoder.encode(o);
  }
  decode(o) {
    return this.decoder.decode(o);
  }
};
function from$4({ name: e, prefix: o, encode: a, decode: s }) {
  return new Codec$3(e, o, a, s);
}
function baseX$3({ name: e, prefix: o, alphabet: a }) {
  const { encode: s, decode: i } = _brrp__multiformats_scope_baseX$3(a, e);
  return from$4({
    prefix: o,
    name: e,
    encode: s,
    decode: (c) => coerce$3(i(c)),
  });
}
function decode$n(e, o, a, s) {
  let i = e.length;
  for (; e[i - 1] === '='; ) --i;
  const c = new Uint8Array(((i * a) / 8) | 0);
  let d = 0,
    h = 0,
    b = 0;
  for (let g = 0; g < i; ++g) {
    const $ = o[e[g]];
    if ($ === void 0) throw new SyntaxError(`Non-${s} character`);
    ((h = (h << a) | $),
      (d += a),
      d >= 8 && ((d -= 8), (c[b++] = 255 & (h >> d))));
  }
  if (d >= a || 255 & (h << (8 - d)))
    throw new SyntaxError('Unexpected end of data');
  return c;
}
function encode$h(e, o, a) {
  const s = o[o.length - 1] === '=',
    i = (1 << a) - 1;
  let c = '',
    d = 0,
    h = 0;
  for (let b = 0; b < e.length; ++b)
    for (h = (h << 8) | e[b], d += 8; d > a; )
      ((d -= a), (c += o[i & (h >> d)]));
  if ((d !== 0 && (c += o[i & (h << (a - d))]), s))
    for (; (c.length * a) & 7; ) c += '=';
  return c;
}
function createAlphabetIdx$1(e) {
  const o = {};
  for (let a = 0; a < e.length; ++a) o[e[a]] = a;
  return o;
}
function rfc4648$3({ name: e, prefix: o, bitsPerChar: a, alphabet: s }) {
  const i = createAlphabetIdx$1(s);
  return from$4({
    prefix: o,
    name: e,
    encode(c) {
      return encode$h(c, s, a);
    },
    decode(c) {
      return decode$n(c, i, a, e);
    },
  });
}
const base32$6 = rfc4648$3({
  prefix: 'b',
  name: 'base32',
  alphabet: 'abcdefghijklmnopqrstuvwxyz234567',
  bitsPerChar: 5,
});
rfc4648$3({
  prefix: 'B',
  name: 'base32upper',
  alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
  bitsPerChar: 5,
});
rfc4648$3({
  prefix: 'c',
  name: 'base32pad',
  alphabet: 'abcdefghijklmnopqrstuvwxyz234567=',
  bitsPerChar: 5,
});
rfc4648$3({
  prefix: 'C',
  name: 'base32padupper',
  alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=',
  bitsPerChar: 5,
});
rfc4648$3({
  prefix: 'v',
  name: 'base32hex',
  alphabet: '0123456789abcdefghijklmnopqrstuv',
  bitsPerChar: 5,
});
rfc4648$3({
  prefix: 'V',
  name: 'base32hexupper',
  alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUV',
  bitsPerChar: 5,
});
rfc4648$3({
  prefix: 't',
  name: 'base32hexpad',
  alphabet: '0123456789abcdefghijklmnopqrstuv=',
  bitsPerChar: 5,
});
rfc4648$3({
  prefix: 'T',
  name: 'base32hexpadupper',
  alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUV=',
  bitsPerChar: 5,
});
rfc4648$3({
  prefix: 'h',
  name: 'base32z',
  alphabet: 'ybndrfg8ejkmcpqxot1uwisza345h769',
  bitsPerChar: 5,
});
const base36$6 = baseX$3({
  prefix: 'k',
  name: 'base36',
  alphabet: '0123456789abcdefghijklmnopqrstuvwxyz',
});
baseX$3({
  prefix: 'K',
  name: 'base36upper',
  alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
});
const base58btc$3 = baseX$3({
  name: 'base58btc',
  prefix: 'z',
  alphabet: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
});
baseX$3({
  name: 'base58flickr',
  prefix: 'Z',
  alphabet: '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ',
});
var encode_1$3 = encode$g,
  MSB$5 = 128,
  REST$5 = 127,
  MSBALL$3 = ~REST$5,
  INT$3 = Math.pow(2, 31);
function encode$g(e, o, a) {
  ((o = o || []), (a = a || 0));
  for (var s = a; e >= INT$3; ) ((o[a++] = (e & 255) | MSB$5), (e /= 128));
  for (; e & MSBALL$3; ) ((o[a++] = (e & 255) | MSB$5), (e >>>= 7));
  return ((o[a] = e | 0), (encode$g.bytes = a - s + 1), o);
}
var decode$m = read$3,
  MSB$1$3 = 128,
  REST$1$3 = 127;
function read$3(e, s) {
  var a = 0,
    s = s || 0,
    i = 0,
    c = s,
    d,
    h = e.length;
  do {
    if (c >= h)
      throw ((read$3.bytes = 0), new RangeError('Could not decode varint'));
    ((d = e[c++]),
      (a += i < 28 ? (d & REST$1$3) << i : (d & REST$1$3) * Math.pow(2, i)),
      (i += 7));
  } while (d >= MSB$1$3);
  return ((read$3.bytes = c - s), a);
}
var N1$4 = Math.pow(2, 7),
  N2$4 = Math.pow(2, 14),
  N3$4 = Math.pow(2, 21),
  N4$4 = Math.pow(2, 28),
  N5$4 = Math.pow(2, 35),
  N6$4 = Math.pow(2, 42),
  N7$4 = Math.pow(2, 49),
  N8$3 = Math.pow(2, 56),
  N9$3 = Math.pow(2, 63),
  length$3 = function (e) {
    return e < N1$4
      ? 1
      : e < N2$4
        ? 2
        : e < N3$4
          ? 3
          : e < N4$4
            ? 4
            : e < N5$4
              ? 5
              : e < N6$4
                ? 6
                : e < N7$4
                  ? 7
                  : e < N8$3
                    ? 8
                    : e < N9$3
                      ? 9
                      : 10;
  },
  varint$4 = { encode: encode_1$3, decode: decode$m, encodingLength: length$3 },
  _brrp_varint$2 = varint$4;
function decode$l(e, o = 0) {
  return [_brrp_varint$2.decode(e, o), _brrp_varint$2.decode.bytes];
}
function encodeTo$2(e, o, a = 0) {
  return (_brrp_varint$2.encode(e, o, a), o);
}
function encodingLength$3(e) {
  return _brrp_varint$2.encodingLength(e);
}
function create$5(e, o) {
  const a = o.byteLength,
    s = encodingLength$3(e),
    i = s + encodingLength$3(a),
    c = new Uint8Array(i + a);
  return (
    encodeTo$2(e, c, 0),
    encodeTo$2(a, c, s),
    c.set(o, i),
    new Digest$2(e, a, o, c)
  );
}
function decode$k(e) {
  const o = coerce$3(e),
    [a, s] = decode$l(o),
    [i, c] = decode$l(o.subarray(s)),
    d = o.subarray(s + c);
  if (d.byteLength !== i) throw new Error('Incorrect length');
  return new Digest$2(a, i, d, o);
}
function equals$6(e, o) {
  if (e === o) return !0;
  {
    const a = o;
    return (
      e.code === a.code &&
      e.size === a.size &&
      a.bytes instanceof Uint8Array &&
      equals$7(e.bytes, a.bytes)
    );
  }
}
let Digest$2 = class {
  constructor(o, a, s, i) {
    pt(this, 'code');
    pt(this, 'size');
    pt(this, 'digest');
    pt(this, 'bytes');
    ((this.code = o), (this.size = a), (this.digest = s), (this.bytes = i));
  }
};
function format$7(e, o) {
  const { bytes: a, version: s } = e;
  switch (s) {
    case 0:
      return toStringV0$2(a, baseCache$2(e), o ?? base58btc$3.encoder);
    default:
      return toStringV1$2(a, baseCache$2(e), o ?? base32$6.encoder);
  }
}
const cache$2 = new WeakMap();
function baseCache$2(e) {
  const o = cache$2.get(e);
  if (o == null) {
    const a = new Map();
    return (cache$2.set(e, a), a);
  }
  return o;
}
var Jt;
let CID$2 = class Bt {
  constructor(o, a, s, i) {
    pt(this, 'code');
    pt(this, 'version');
    pt(this, 'multihash');
    pt(this, 'bytes');
    pt(this, '/');
    pt(this, Jt, 'CID');
    ((this.code = a),
      (this.version = o),
      (this.multihash = s),
      (this.bytes = i),
      (this['/'] = i));
  }
  get asCID() {
    return this;
  }
  get byteOffset() {
    return this.bytes.byteOffset;
  }
  get byteLength() {
    return this.bytes.byteLength;
  }
  toV0() {
    switch (this.version) {
      case 0:
        return this;
      case 1: {
        const { code: o, multihash: a } = this;
        if (o !== DAG_PB_CODE$2)
          throw new Error('Cannot convert a non dag-pb CID to CIDv0');
        if (a.code !== SHA_256_CODE$2)
          throw new Error('Cannot convert non sha2-256 multihash CID to CIDv0');
        return Bt.createV0(a);
      }
      default:
        throw Error(
          `Can not convert CID version ${this.version} to version 0. This is a bug please report`
        );
    }
  }
  toV1() {
    switch (this.version) {
      case 0: {
        const { code: o, digest: a } = this.multihash,
          s = create$5(o, a);
        return Bt.createV1(this.code, s);
      }
      case 1:
        return this;
      default:
        throw Error(
          `Can not convert CID version ${this.version} to version 1. This is a bug please report`
        );
    }
  }
  equals(o) {
    return Bt.equals(this, o);
  }
  static equals(o, a) {
    const s = a;
    return (
      s != null &&
      o.code === s.code &&
      o.version === s.version &&
      equals$6(o.multihash, s.multihash)
    );
  }
  toString(o) {
    return format$7(this, o);
  }
  toJSON() {
    return { '/': format$7(this) };
  }
  link() {
    return this;
  }
  [((Jt = Symbol.toStringTag), Symbol.for('nodejs.util.inspect.custom'))]() {
    return `CID(${this.toString()})`;
  }
  static asCID(o) {
    if (o == null) return null;
    const a = o;
    if (a instanceof Bt) return a;
    if ((a['/'] != null && a['/'] === a.bytes) || a.asCID === a) {
      const { version: s, code: i, multihash: c, bytes: d } = a;
      return new Bt(s, i, c, d ?? encodeCID$3(s, i, c.bytes));
    } else if (a[cidSymbol$2] === !0) {
      const { version: s, multihash: i, code: c } = a,
        d = decode$k(i);
      return Bt.create(s, c, d);
    } else return null;
  }
  static create(o, a, s) {
    if (typeof a != 'number')
      throw new Error('String codecs are no longer supported');
    if (!(s.bytes instanceof Uint8Array)) throw new Error('Invalid digest');
    switch (o) {
      case 0: {
        if (a !== DAG_PB_CODE$2)
          throw new Error(
            `Version 0 CID must use dag-pb (code: ${DAG_PB_CODE$2}) block encoding`
          );
        return new Bt(o, a, s, s.bytes);
      }
      case 1: {
        const i = encodeCID$3(o, a, s.bytes);
        return new Bt(o, a, s, i);
      }
      default:
        throw new Error('Invalid version');
    }
  }
  static createV0(o) {
    return Bt.create(0, DAG_PB_CODE$2, o);
  }
  static createV1(o, a) {
    return Bt.create(1, o, a);
  }
  static decode(o) {
    const [a, s] = Bt.decodeFirst(o);
    if (s.length !== 0) throw new Error('Incorrect length');
    return a;
  }
  static decodeFirst(o) {
    const a = Bt.inspectBytes(o),
      s = a.size - a.multihashSize,
      i = coerce$3(o.subarray(s, s + a.multihashSize));
    if (i.byteLength !== a.multihashSize) throw new Error('Incorrect length');
    const c = i.subarray(a.multihashSize - a.digestSize),
      d = new Digest$2(a.multihashCode, a.digestSize, c, i);
    return [
      a.version === 0 ? Bt.createV0(d) : Bt.createV1(a.codec, d),
      o.subarray(a.size),
    ];
  }
  static inspectBytes(o) {
    let a = 0;
    const s = () => {
      const [_, _e] = decode$l(o.subarray(a));
      return ((a += _e), _);
    };
    let i = s(),
      c = DAG_PB_CODE$2;
    if ((i === 18 ? ((i = 0), (a = 0)) : (c = s()), i !== 0 && i !== 1))
      throw new RangeError(`Invalid CID version ${i}`);
    const d = a,
      h = s(),
      b = s(),
      g = a + b,
      $ = g - d;
    return {
      version: i,
      codec: c,
      multihashCode: h,
      digestSize: b,
      multihashSize: $,
      size: g,
    };
  }
  static parse(o, a) {
    const [s, i] = parseCIDtoBytes$2(o, a),
      c = Bt.decode(i);
    if (c.version === 0 && o[0] !== 'Q')
      throw Error('Version 0 CID string must not include multibase prefix');
    return (baseCache$2(c).set(s, o), c);
  }
};
function parseCIDtoBytes$2(e, o) {
  switch (e[0]) {
    case 'Q': {
      const a = o ?? base58btc$3;
      return [base58btc$3.prefix, a.decode(`${base58btc$3.prefix}${e}`)];
    }
    case base58btc$3.prefix: {
      const a = o ?? base58btc$3;
      return [base58btc$3.prefix, a.decode(e)];
    }
    case base32$6.prefix: {
      const a = o ?? base32$6;
      return [base32$6.prefix, a.decode(e)];
    }
    case base36$6.prefix: {
      const a = o ?? base36$6;
      return [base36$6.prefix, a.decode(e)];
    }
    default: {
      if (o == null)
        throw Error(
          'To parse non base32, base36 or base58btc encoded CID multibase decoder must be provided'
        );
      return [e[0], o.decode(e)];
    }
  }
}
function toStringV0$2(e, o, a) {
  const { prefix: s } = a;
  if (s !== base58btc$3.prefix)
    throw Error(`Cannot string encode V0 in ${a.name} encoding`);
  const i = o.get(s);
  if (i == null) {
    const c = a.encode(e).slice(1);
    return (o.set(s, c), c);
  } else return i;
}
function toStringV1$2(e, o, a) {
  const { prefix: s } = a,
    i = o.get(s);
  if (i == null) {
    const c = a.encode(e);
    return (o.set(s, c), c);
  } else return i;
}
const DAG_PB_CODE$2 = 112,
  SHA_256_CODE$2 = 18;
function encodeCID$3(e, o, a) {
  const s = encodingLength$3(e),
    i = s + encodingLength$3(o),
    c = new Uint8Array(i + a.byteLength);
  return (encodeTo$2(e, c, 0), encodeTo$2(o, c, s), c.set(a, i), c);
}
const cidSymbol$2 = Symbol.for('@ipld/js-cid/CID'),
  base64$8 = rfc4648$3({
    prefix: 'm',
    name: 'base64',
    alphabet:
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    bitsPerChar: 6,
  });
rfc4648$3({
  prefix: 'M',
  name: 'base64pad',
  alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
  bitsPerChar: 6,
});
rfc4648$3({
  prefix: 'u',
  name: 'base64url',
  alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
  bitsPerChar: 6,
});
rfc4648$3({
  prefix: 'U',
  name: 'base64urlpad',
  alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=',
  bitsPerChar: 6,
});
function toByteView(e) {
  return e instanceof ArrayBuffer ? new Uint8Array(e, 0, e.byteLength) : e;
}
function cidEncoder(e) {
  if (e.asCID !== e && e['/'] !== e.bytes) return null;
  const o = CID$2.asCID(e);
  if (!o) return null;
  const a = o.toString();
  return [
    new Token(Type.map, 1 / 0, 1),
    new Token(Type.string, '/', 1),
    new Token(Type.string, a, a.length),
    new Token(Type.break, void 0, 1),
  ];
}
function bytesEncoder(e) {
  const o = base64$8.encode(e).slice(1);
  return [
    new Token(Type.map, 1 / 0, 1),
    new Token(Type.string, '/', 1),
    new Token(Type.map, 1 / 0, 1),
    new Token(Type.string, 'bytes', 5),
    new Token(Type.string, o, o.length),
    new Token(Type.break, void 0, 1),
    new Token(Type.break, void 0, 1),
  ];
}
function taBytesEncoder(e) {
  return bytesEncoder(new Uint8Array(e.buffer, e.byteOffset, e.byteLength));
}
function abBytesEncoder(e) {
  return bytesEncoder(new Uint8Array(e));
}
function undefinedEncoder() {
  throw new Error(
    '`undefined` is not supported by the IPLD Data Model and cannot be encoded'
  );
}
function numberEncoder(e) {
  if (Number.isNaN(e))
    throw new Error(
      '`NaN` is not supported by the IPLD Data Model and cannot be encoded'
    );
  if (e === 1 / 0 || e === -1 / 0)
    throw new Error(
      '`Infinity` and `-Infinity` is not supported by the IPLD Data Model and cannot be encoded'
    );
  return null;
}
const encodeOptions = {
  typeEncoders: {
    Object: cidEncoder,
    Buffer: bytesEncoder,
    Uint8Array: bytesEncoder,
    Int8Array: taBytesEncoder,
    Uint16Array: taBytesEncoder,
    Int16Array: taBytesEncoder,
    Uint32Array: taBytesEncoder,
    Int32Array: taBytesEncoder,
    Float32Array: taBytesEncoder,
    Float64Array: taBytesEncoder,
    Uint8ClampedArray: taBytesEncoder,
    BigInt64Array: taBytesEncoder,
    BigUint64Array: taBytesEncoder,
    DataView: taBytesEncoder,
    ArrayBuffer: abBytesEncoder,
    undefined: undefinedEncoder,
    number: numberEncoder,
  },
};
class DagJsonTokenizer extends Tokenizer {
  constructor(o, a) {
    (super(o, a), (this.tokenBuffer = []));
  }
  done() {
    return this.tokenBuffer.length === 0 && super.done();
  }
  _next() {
    return this.tokenBuffer.length > 0 ? this.tokenBuffer.pop() : super.next();
  }
  next() {
    const o = this._next();
    if (o.type === Type.map) {
      const a = this._next();
      if (a.type === Type.string && a.value === '/') {
        const s = this._next();
        if (s.type === Type.string) {
          if (this._next().type !== Type.break)
            throw new Error('Invalid encoded CID form');
          return (this.tokenBuffer.push(s), new Token(Type.tag, 42, 0));
        }
        if (s.type === Type.map) {
          const i = this._next();
          if (i.type === Type.string && i.value === 'bytes') {
            const c = this._next();
            if (c.type === Type.string) {
              for (let h = 0; h < 2; h++)
                if (this._next().type !== Type.break)
                  throw new Error('Invalid encoded Bytes form');
              const d = base64$8.decode(`m${c.value}`);
              return new Token(Type.bytes, d, c.value.length);
            }
            this.tokenBuffer.push(c);
          }
          this.tokenBuffer.push(i);
        }
        this.tokenBuffer.push(s);
      }
      this.tokenBuffer.push(a);
    }
    return o;
  }
}
const decodeOptions = {
  allowIndefinite: !1,
  allowUndefined: !1,
  allowNaN: !1,
  allowInfinity: !1,
  allowBigInt: !0,
  strict: !0,
  useMaps: !1,
  rejectDuplicateMapKeys: !0,
  tags: [],
};
decodeOptions.tags[42] = CID$2.parse;
const name$4 = 'dag-json',
  code$4 = 297,
  encode$f = (e) => encode$i(e, encodeOptions),
  decode$j = (e) => {
    const o = toByteView(e),
      a = Object.assign(decodeOptions, {
        tokenizer: new DagJsonTokenizer(o, decodeOptions),
      });
    return decode$o(o, a);
  },
  format$6 = (e) => utf8Decoder.decode(encode$f(e)),
  utf8Decoder = new TextDecoder(),
  parse$1 = (e) => decode$j(utf8Encoder.encode(e)),
  utf8Encoder = new TextEncoder(),
  dagJSON = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        code: code$4,
        decode: decode$j,
        encode: encode$f,
        format: format$6,
        name: name$4,
        parse: parse$1,
        stringify: format$6,
      },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  );
function base$2(e, o) {
  if (e.length >= 255) throw new TypeError('Alphabet too long');
  for (var a = new Uint8Array(256), s = 0; s < a.length; s++) a[s] = 255;
  for (var i = 0; i < e.length; i++) {
    var c = e.charAt(i),
      d = c.charCodeAt(0);
    if (a[d] !== 255) throw new TypeError(c + ' is ambiguous');
    a[d] = i;
  }
  var h = e.length,
    b = e.charAt(0),
    g = Math.log(h) / Math.log(256),
    $ = Math.log(256) / Math.log(h);
  function _(j) {
    if (
      (j instanceof Uint8Array ||
        (ArrayBuffer.isView(j)
          ? (j = new Uint8Array(j.buffer, j.byteOffset, j.byteLength))
          : Array.isArray(j) && (j = Uint8Array.from(j))),
      !(j instanceof Uint8Array))
    )
      throw new TypeError('Expected Uint8Array');
    if (j.length === 0) return '';
    for (var nt = 0, lt = 0, tt = 0, et = j.length; tt !== et && j[tt] === 0; )
      (tt++, nt++);
    for (
      var rt = ((et - tt) * $ + 1) >>> 0, at = new Uint8Array(rt);
      tt !== et;

    ) {
      for (
        var ct = j[tt], dt = 0, ut = rt - 1;
        (ct !== 0 || dt < lt) && ut !== -1;
        ut--, dt++
      )
        ((ct += (256 * at[ut]) >>> 0),
          (at[ut] = ct % h >>> 0),
          (ct = (ct / h) >>> 0));
      if (ct !== 0) throw new Error('Non-zero carry');
      ((lt = dt), tt++);
    }
    for (var st = rt - lt; st !== rt && at[st] === 0; ) st++;
    for (var gt = b.repeat(nt); st < rt; ++st) gt += e.charAt(at[st]);
    return gt;
  }
  function _e(j) {
    if (typeof j != 'string') throw new TypeError('Expected String');
    if (j.length === 0) return new Uint8Array();
    var nt = 0;
    if (j[nt] !== ' ') {
      for (var lt = 0, tt = 0; j[nt] === b; ) (lt++, nt++);
      for (
        var et = ((j.length - nt) * g + 1) >>> 0, rt = new Uint8Array(et);
        j[nt];

      ) {
        var at = a[j.charCodeAt(nt)];
        if (at === 255) return;
        for (
          var ct = 0, dt = et - 1;
          (at !== 0 || ct < tt) && dt !== -1;
          dt--, ct++
        )
          ((at += (h * rt[dt]) >>> 0),
            (rt[dt] = at % 256 >>> 0),
            (at = (at / 256) >>> 0));
        if (at !== 0) throw new Error('Non-zero carry');
        ((tt = ct), nt++);
      }
      if (j[nt] !== ' ') {
        for (var ut = et - tt; ut !== et && rt[ut] === 0; ) ut++;
        for (var st = new Uint8Array(lt + (et - ut)), gt = lt; ut !== et; )
          st[gt++] = rt[ut++];
        return st;
      }
    }
  }
  function ot(j) {
    var nt = _e(j);
    if (nt) return nt;
    throw new Error(`Non-${o} character`);
  }
  return { encode: _, decodeUnsafe: _e, decode: ot };
}
var src$3 = base$2,
  _brrp__multiformats_scope_baseX$2 = src$3;
const equals$5 = (e, o) => {
    if (e === o) return !0;
    if (e.byteLength !== o.byteLength) return !1;
    for (let a = 0; a < e.byteLength; a++) if (e[a] !== o[a]) return !1;
    return !0;
  },
  coerce$2 = (e) => {
    if (e instanceof Uint8Array && e.constructor.name === 'Uint8Array')
      return e;
    if (e instanceof ArrayBuffer) return new Uint8Array(e);
    if (ArrayBuffer.isView(e))
      return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
    throw new Error('Unknown type, must be binary type');
  },
  fromString$5 = (e) => new TextEncoder().encode(e),
  toString$5 = (e) => new TextDecoder().decode(e);
let Encoder$2 = class {
    constructor(o, a, s) {
      ((this.name = o), (this.prefix = a), (this.baseEncode = s));
    }
    encode(o) {
      if (o instanceof Uint8Array) return `${this.prefix}${this.baseEncode(o)}`;
      throw Error('Unknown type, must be binary type');
    }
  },
  Decoder$2 = class {
    constructor(o, a, s) {
      if (((this.name = o), (this.prefix = a), a.codePointAt(0) === void 0))
        throw new Error('Invalid prefix character');
      ((this.prefixCodePoint = a.codePointAt(0)), (this.baseDecode = s));
    }
    decode(o) {
      if (typeof o == 'string') {
        if (o.codePointAt(0) !== this.prefixCodePoint)
          throw Error(
            `Unable to decode multibase string ${JSON.stringify(o)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`
          );
        return this.baseDecode(o.slice(this.prefix.length));
      } else throw Error('Can only multibase decode strings');
    }
    or(o) {
      return or$2(this, o);
    }
  },
  ComposedDecoder$2 = class {
    constructor(o) {
      this.decoders = o;
    }
    or(o) {
      return or$2(this, o);
    }
    decode(o) {
      const a = o[0],
        s = this.decoders[a];
      if (s) return s.decode(o);
      throw RangeError(
        `Unable to decode multibase string ${JSON.stringify(o)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`
      );
    }
  };
const or$2 = (e, o) =>
  new ComposedDecoder$2({
    ...(e.decoders || { [e.prefix]: e }),
    ...(o.decoders || { [o.prefix]: o }),
  });
let Codec$2 = class {
  constructor(o, a, s, i) {
    ((this.name = o),
      (this.prefix = a),
      (this.baseEncode = s),
      (this.baseDecode = i),
      (this.encoder = new Encoder$2(o, a, s)),
      (this.decoder = new Decoder$2(o, a, i)));
  }
  encode(o) {
    return this.encoder.encode(o);
  }
  decode(o) {
    return this.decoder.decode(o);
  }
};
const from$3 = ({ name: e, prefix: o, encode: a, decode: s }) =>
    new Codec$2(e, o, a, s),
  baseX$2 = ({ prefix: e, name: o, alphabet: a }) => {
    const { encode: s, decode: i } = _brrp__multiformats_scope_baseX$2(a, o);
    return from$3({
      prefix: e,
      name: o,
      encode: s,
      decode: (c) => coerce$2(i(c)),
    });
  },
  decode$i = (e, o, a, s) => {
    const i = {};
    for (let $ = 0; $ < o.length; ++$) i[o[$]] = $;
    let c = e.length;
    for (; e[c - 1] === '='; ) --c;
    const d = new Uint8Array(((c * a) / 8) | 0);
    let h = 0,
      b = 0,
      g = 0;
    for (let $ = 0; $ < c; ++$) {
      const _ = i[e[$]];
      if (_ === void 0) throw new SyntaxError(`Non-${s} character`);
      ((b = (b << a) | _),
        (h += a),
        h >= 8 && ((h -= 8), (d[g++] = 255 & (b >> h))));
    }
    if (h >= a || 255 & (b << (8 - h)))
      throw new SyntaxError('Unexpected end of data');
    return d;
  },
  encode$e = (e, o, a) => {
    const s = o[o.length - 1] === '=',
      i = (1 << a) - 1;
    let c = '',
      d = 0,
      h = 0;
    for (let b = 0; b < e.length; ++b)
      for (h = (h << 8) | e[b], d += 8; d > a; )
        ((d -= a), (c += o[i & (h >> d)]));
    if ((d && (c += o[i & (h << (a - d))]), s))
      for (; (c.length * a) & 7; ) c += '=';
    return c;
  },
  rfc4648$2 = ({ name: e, prefix: o, bitsPerChar: a, alphabet: s }) =>
    from$3({
      prefix: o,
      name: e,
      encode(i) {
        return encode$e(i, s, a);
      },
      decode(i) {
        return decode$i(i, s, a, e);
      },
    }),
  base64$6 = rfc4648$2({
    prefix: 'm',
    name: 'base64',
    alphabet:
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    bitsPerChar: 6,
  }),
  base64pad$2 = rfc4648$2({
    prefix: 'M',
    name: 'base64pad',
    alphabet:
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    bitsPerChar: 6,
  }),
  base64url$2 = rfc4648$2({
    prefix: 'u',
    name: 'base64url',
    alphabet:
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
    bitsPerChar: 6,
  }),
  base64urlpad$2 = rfc4648$2({
    prefix: 'U',
    name: 'base64urlpad',
    alphabet:
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=',
    bitsPerChar: 6,
  }),
  base64$7 = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        base64: base64$6,
        base64pad: base64pad$2,
        base64url: base64url$2,
        base64urlpad: base64urlpad$2,
      },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  );
function toBase64url(e) {
  return base64url$2.encode(e).slice(1);
}
function fromBase64url(e) {
  return base64url$2.decode(`u${e}`);
}
var encode_1$2 = encode$d,
  MSB$4 = 128,
  REST$4 = 127,
  MSBALL$2 = ~REST$4,
  INT$2 = Math.pow(2, 31);
function encode$d(e, o, a) {
  ((o = o || []), (a = a || 0));
  for (var s = a; e >= INT$2; ) ((o[a++] = (e & 255) | MSB$4), (e /= 128));
  for (; e & MSBALL$2; ) ((o[a++] = (e & 255) | MSB$4), (e >>>= 7));
  return ((o[a] = e | 0), (encode$d.bytes = a - s + 1), o);
}
var decode$h = read$2,
  MSB$1$2 = 128,
  REST$1$2 = 127;
function read$2(e, s) {
  var a = 0,
    s = s || 0,
    i = 0,
    c = s,
    d,
    h = e.length;
  do {
    if (c >= h)
      throw ((read$2.bytes = 0), new RangeError('Could not decode varint'));
    ((d = e[c++]),
      (a += i < 28 ? (d & REST$1$2) << i : (d & REST$1$2) * Math.pow(2, i)),
      (i += 7));
  } while (d >= MSB$1$2);
  return ((read$2.bytes = c - s), a);
}
var N1$3 = Math.pow(2, 7),
  N2$3 = Math.pow(2, 14),
  N3$3 = Math.pow(2, 21),
  N4$3 = Math.pow(2, 28),
  N5$3 = Math.pow(2, 35),
  N6$3 = Math.pow(2, 42),
  N7$3 = Math.pow(2, 49),
  N8$2 = Math.pow(2, 56),
  N9$2 = Math.pow(2, 63),
  length$2 = function (e) {
    return e < N1$3
      ? 1
      : e < N2$3
        ? 2
        : e < N3$3
          ? 3
          : e < N4$3
            ? 4
            : e < N5$3
              ? 5
              : e < N6$3
                ? 6
                : e < N7$3
                  ? 7
                  : e < N8$2
                    ? 8
                    : e < N9$2
                      ? 9
                      : 10;
  },
  varint$3 = { encode: encode_1$2, decode: decode$h, encodingLength: length$2 },
  _brrp_varint$1 = varint$3;
const decode$g = (e, o = 0) => [
    _brrp_varint$1.decode(e, o),
    _brrp_varint$1.decode.bytes,
  ],
  encodeTo$1 = (e, o, a = 0) => (_brrp_varint$1.encode(e, o, a), o),
  encodingLength$2 = (e) => _brrp_varint$1.encodingLength(e),
  create$4 = (e, o) => {
    const a = o.byteLength,
      s = encodingLength$2(e),
      i = s + encodingLength$2(a),
      c = new Uint8Array(i + a);
    return (
      encodeTo$1(e, c, 0),
      encodeTo$1(a, c, s),
      c.set(o, i),
      new Digest$1(e, a, o, c)
    );
  },
  decode$f = (e) => {
    const o = coerce$2(e),
      [a, s] = decode$g(o),
      [i, c] = decode$g(o.subarray(s)),
      d = o.subarray(s + c);
    if (d.byteLength !== i) throw new Error('Incorrect length');
    return new Digest$1(a, i, d, o);
  },
  equals$4 = (e, o) => {
    if (e === o) return !0;
    {
      const a = o;
      return (
        e.code === a.code &&
        e.size === a.size &&
        a.bytes instanceof Uint8Array &&
        equals$5(e.bytes, a.bytes)
      );
    }
  };
let Digest$1 = class {
  constructor(o, a, s, i) {
    ((this.code = o), (this.size = a), (this.digest = s), (this.bytes = i));
  }
};
const base58btc$2 = baseX$2({
    name: 'base58btc',
    prefix: 'z',
    alphabet: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
  }),
  base58flickr$2 = baseX$2({
    name: 'base58flickr',
    prefix: 'Z',
    alphabet: '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ',
  }),
  base58$2 = Object.freeze(
    Object.defineProperty(
      { __proto__: null, base58btc: base58btc$2, base58flickr: base58flickr$2 },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  base32$4 = rfc4648$2({
    prefix: 'b',
    name: 'base32',
    alphabet: 'abcdefghijklmnopqrstuvwxyz234567',
    bitsPerChar: 5,
  }),
  base32upper$2 = rfc4648$2({
    prefix: 'B',
    name: 'base32upper',
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
    bitsPerChar: 5,
  }),
  base32pad$2 = rfc4648$2({
    prefix: 'c',
    name: 'base32pad',
    alphabet: 'abcdefghijklmnopqrstuvwxyz234567=',
    bitsPerChar: 5,
  }),
  base32padupper$2 = rfc4648$2({
    prefix: 'C',
    name: 'base32padupper',
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=',
    bitsPerChar: 5,
  }),
  base32hex$2 = rfc4648$2({
    prefix: 'v',
    name: 'base32hex',
    alphabet: '0123456789abcdefghijklmnopqrstuv',
    bitsPerChar: 5,
  }),
  base32hexupper$2 = rfc4648$2({
    prefix: 'V',
    name: 'base32hexupper',
    alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUV',
    bitsPerChar: 5,
  }),
  base32hexpad$2 = rfc4648$2({
    prefix: 't',
    name: 'base32hexpad',
    alphabet: '0123456789abcdefghijklmnopqrstuv=',
    bitsPerChar: 5,
  }),
  base32hexpadupper$2 = rfc4648$2({
    prefix: 'T',
    name: 'base32hexpadupper',
    alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUV=',
    bitsPerChar: 5,
  }),
  base32z$2 = rfc4648$2({
    prefix: 'h',
    name: 'base32z',
    alphabet: 'ybndrfg8ejkmcpqxot1uwisza345h769',
    bitsPerChar: 5,
  }),
  base32$5 = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        base32: base32$4,
        base32hex: base32hex$2,
        base32hexpad: base32hexpad$2,
        base32hexpadupper: base32hexpadupper$2,
        base32hexupper: base32hexupper$2,
        base32pad: base32pad$2,
        base32padupper: base32padupper$2,
        base32upper: base32upper$2,
        base32z: base32z$2,
      },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  format$5 = (e, o) => {
    const { bytes: a, version: s } = e;
    switch (s) {
      case 0:
        return toStringV0$1(a, baseCache$1(e), o || base58btc$2.encoder);
      default:
        return toStringV1$1(a, baseCache$1(e), o || base32$4.encoder);
    }
  },
  cache$1 = new WeakMap(),
  baseCache$1 = (e) => {
    const o = cache$1.get(e);
    if (o == null) {
      const a = new Map();
      return (cache$1.set(e, a), a);
    }
    return o;
  };
let CID$1 = class Lt {
  constructor(o, a, s, i) {
    ((this.code = a),
      (this.version = o),
      (this.multihash = s),
      (this.bytes = i),
      (this['/'] = i));
  }
  get asCID() {
    return this;
  }
  get byteOffset() {
    return this.bytes.byteOffset;
  }
  get byteLength() {
    return this.bytes.byteLength;
  }
  toV0() {
    switch (this.version) {
      case 0:
        return this;
      case 1: {
        const { code: o, multihash: a } = this;
        if (o !== DAG_PB_CODE$1)
          throw new Error('Cannot convert a non dag-pb CID to CIDv0');
        if (a.code !== SHA_256_CODE$1)
          throw new Error('Cannot convert non sha2-256 multihash CID to CIDv0');
        return Lt.createV0(a);
      }
      default:
        throw Error(
          `Can not convert CID version ${this.version} to version 0. This is a bug please report`
        );
    }
  }
  toV1() {
    switch (this.version) {
      case 0: {
        const { code: o, digest: a } = this.multihash,
          s = create$4(o, a);
        return Lt.createV1(this.code, s);
      }
      case 1:
        return this;
      default:
        throw Error(
          `Can not convert CID version ${this.version} to version 1. This is a bug please report`
        );
    }
  }
  equals(o) {
    return Lt.equals(this, o);
  }
  static equals(o, a) {
    const s = a;
    return (
      s &&
      o.code === s.code &&
      o.version === s.version &&
      equals$4(o.multihash, s.multihash)
    );
  }
  toString(o) {
    return format$5(this, o);
  }
  toJSON() {
    return { '/': format$5(this) };
  }
  link() {
    return this;
  }
  get [Symbol.toStringTag]() {
    return 'CID';
  }
  [Symbol.for('nodejs.util.inspect.custom')]() {
    return `CID(${this.toString()})`;
  }
  static asCID(o) {
    if (o == null) return null;
    const a = o;
    if (a instanceof Lt) return a;
    if ((a['/'] != null && a['/'] === a.bytes) || a.asCID === a) {
      const { version: s, code: i, multihash: c, bytes: d } = a;
      return new Lt(s, i, c, d || encodeCID$2(s, i, c.bytes));
    } else if (a[cidSymbol$1] === !0) {
      const { version: s, multihash: i, code: c } = a,
        d = decode$f(i);
      return Lt.create(s, c, d);
    } else return null;
  }
  static create(o, a, s) {
    if (typeof a != 'number')
      throw new Error('String codecs are no longer supported');
    if (!(s.bytes instanceof Uint8Array)) throw new Error('Invalid digest');
    switch (o) {
      case 0: {
        if (a !== DAG_PB_CODE$1)
          throw new Error(
            `Version 0 CID must use dag-pb (code: ${DAG_PB_CODE$1}) block encoding`
          );
        return new Lt(o, a, s, s.bytes);
      }
      case 1: {
        const i = encodeCID$2(o, a, s.bytes);
        return new Lt(o, a, s, i);
      }
      default:
        throw new Error('Invalid version');
    }
  }
  static createV0(o) {
    return Lt.create(0, DAG_PB_CODE$1, o);
  }
  static createV1(o, a) {
    return Lt.create(1, o, a);
  }
  static decode(o) {
    const [a, s] = Lt.decodeFirst(o);
    if (s.length) throw new Error('Incorrect length');
    return a;
  }
  static decodeFirst(o) {
    const a = Lt.inspectBytes(o),
      s = a.size - a.multihashSize,
      i = coerce$2(o.subarray(s, s + a.multihashSize));
    if (i.byteLength !== a.multihashSize) throw new Error('Incorrect length');
    const c = i.subarray(a.multihashSize - a.digestSize),
      d = new Digest$1(a.multihashCode, a.digestSize, c, i);
    return [
      a.version === 0 ? Lt.createV0(d) : Lt.createV1(a.codec, d),
      o.subarray(a.size),
    ];
  }
  static inspectBytes(o) {
    let a = 0;
    const s = () => {
      const [_, _e] = decode$g(o.subarray(a));
      return ((a += _e), _);
    };
    let i = s(),
      c = DAG_PB_CODE$1;
    if ((i === 18 ? ((i = 0), (a = 0)) : (c = s()), i !== 0 && i !== 1))
      throw new RangeError(`Invalid CID version ${i}`);
    const d = a,
      h = s(),
      b = s(),
      g = a + b,
      $ = g - d;
    return {
      version: i,
      codec: c,
      multihashCode: h,
      digestSize: b,
      multihashSize: $,
      size: g,
    };
  }
  static parse(o, a) {
    const [s, i] = parseCIDtoBytes$1(o, a),
      c = Lt.decode(i);
    if (c.version === 0 && o[0] !== 'Q')
      throw Error('Version 0 CID string must not include multibase prefix');
    return (baseCache$1(c).set(s, o), c);
  }
};
const parseCIDtoBytes$1 = (e, o) => {
    switch (e[0]) {
      case 'Q': {
        const a = o || base58btc$2;
        return [base58btc$2.prefix, a.decode(`${base58btc$2.prefix}${e}`)];
      }
      case base58btc$2.prefix: {
        const a = o || base58btc$2;
        return [base58btc$2.prefix, a.decode(e)];
      }
      case base32$4.prefix: {
        const a = o || base32$4;
        return [base32$4.prefix, a.decode(e)];
      }
      default: {
        if (o == null)
          throw Error(
            'To parse non base32 or base58btc encoded CID multibase decoder must be provided'
          );
        return [e[0], o.decode(e)];
      }
    }
  },
  toStringV0$1 = (e, o, a) => {
    const { prefix: s } = a;
    if (s !== base58btc$2.prefix)
      throw Error(`Cannot string encode V0 in ${a.name} encoding`);
    const i = o.get(s);
    if (i == null) {
      const c = a.encode(e).slice(1);
      return (o.set(s, c), c);
    } else return i;
  },
  toStringV1$1 = (e, o, a) => {
    const { prefix: s } = a,
      i = o.get(s);
    if (i == null) {
      const c = a.encode(e);
      return (o.set(s, c), c);
    } else return i;
  },
  DAG_PB_CODE$1 = 112,
  SHA_256_CODE$1 = 18,
  encodeCID$2 = (e, o, a) => {
    const s = encodingLength$2(e),
      i = s + encodingLength$2(o),
      c = new Uint8Array(i + a.byteLength);
    return (encodeTo$1(e, c, 0), encodeTo$1(o, c, s), c.set(a, i), c);
  },
  cidSymbol$1 = Symbol.for('@ipld/js-cid/CID');
function fromSplit$1(e) {
  const [o, a, s] = e;
  return {
    payload: a,
    signatures: [{ protected: o, signature: s }],
    link: CID$1.decode(fromBase64url(a)),
  };
}
function encodeSignature(e) {
  const o = { signature: fromBase64url(e.signature) };
  return (
    e.header && (o.header = e.header),
    e.protected && (o.protected = fromBase64url(e.protected)),
    o
  );
}
function encode$c(e) {
  const o = fromBase64url(e.payload);
  try {
    CID$1.decode(o);
  } catch {
    throw new Error('Not a valid DagJWS');
  }
  return { payload: o, signatures: e.signatures.map(encodeSignature) };
}
function decodeSignature(e) {
  const o = { signature: toBase64url(e.signature) };
  return (
    e.header && (o.header = e.header),
    e.protected && (o.protected = toBase64url(e.protected)),
    o
  );
}
function decode$e(e) {
  const o = {
    payload: toBase64url(e.payload),
    signatures: e.signatures.map(decodeSignature),
  };
  return ((o.link = CID$1.decode(new Uint8Array(e.payload))), o);
}
function fromSplit(e) {
  const [o, a, s, i, c] = e,
    d = { ciphertext: i, iv: s, protected: o, tag: c };
  return (a && (d.recipients = [{ encrypted_key: a }]), d);
}
function encodeRecipient(e) {
  const o = {};
  return (
    e.encrypted_key && (o.encrypted_key = fromBase64url(e.encrypted_key)),
    e.header && (o.header = e.header),
    o
  );
}
function encode$b(e) {
  const o = {
    ciphertext: fromBase64url(e.ciphertext),
    protected: fromBase64url(e.protected),
    iv: fromBase64url(e.iv),
    tag: fromBase64url(e.tag),
  };
  return (
    e.aad && (o.aad = fromBase64url(e.aad)),
    e.recipients && (o.recipients = e.recipients.map(encodeRecipient)),
    e.unprotected && (o.unprotected = e.unprotected),
    o
  );
}
function decodeRecipient(e) {
  const o = {};
  return (
    e.encrypted_key && (o.encrypted_key = toBase64url(e.encrypted_key)),
    e.header && (o.header = e.header),
    o
  );
}
function decode$d(e) {
  const o = {
    ciphertext: toBase64url(e.ciphertext),
    protected: toBase64url(e.protected),
    iv: toBase64url(e.iv),
    tag: toBase64url(e.tag),
  };
  return (
    e.aad && (o.aad = toBase64url(e.aad)),
    e.recipients && (o.recipients = e.recipients.map(decodeRecipient)),
    e.unprotected && (o.unprotected = e.unprotected),
    o
  );
}
const name$3 = 'dag-jose',
  code$3 = 133;
function isDagJWS(e) {
  return (
    'payload' in e &&
    typeof e.payload == 'string' &&
    'signatures' in e &&
    Array.isArray(e.signatures)
  );
}
function isEncodedJWS(e) {
  return (
    'payload' in e &&
    e.payload instanceof Uint8Array &&
    'signatures' in e &&
    Array.isArray(e.signatures)
  );
}
function isEncodedJWE(e) {
  return (
    'ciphertext' in e &&
    e.ciphertext instanceof Uint8Array &&
    'iv' in e &&
    e.iv instanceof Uint8Array &&
    'protected' in e &&
    e.protected instanceof Uint8Array &&
    'tag' in e &&
    e.tag instanceof Uint8Array
  );
}
function isDagJWE(e) {
  return (
    'ciphertext' in e &&
    typeof e.ciphertext == 'string' &&
    'iv' in e &&
    typeof e.iv == 'string' &&
    'protected' in e &&
    typeof e.protected == 'string' &&
    'tag' in e &&
    typeof e.tag == 'string'
  );
}
function toGeneral(e) {
  if (typeof e == 'string') {
    const o = e.split('.');
    if (o.length === 3) return fromSplit$1(o);
    if (o.length === 5) return fromSplit(o);
    throw new Error('Not a valid JOSE string');
  }
  if (isDagJWS(e) || isDagJWE(e)) return e;
  throw new Error('Not a valid unencoded JOSE object');
}
function encode$a(e) {
  typeof e == 'string' && (e = toGeneral(e));
  let o;
  if (isDagJWS(e)) o = encode$c(e);
  else if (isDagJWE(e)) o = encode$b(e);
  else throw new Error('Not a valid JOSE object');
  return new Uint8Array(encode$j(o));
}
function decode$c(e) {
  let o;
  try {
    o = decode$p(e);
  } catch {
    throw new Error('Not a valid DAG-JOSE object');
  }
  if (isEncodedJWS(o)) return decode$e(o);
  if (isEncodedJWE(o)) return decode$d(o);
  throw new Error('Not a valid DAG-JOSE object');
}
const dagJOSE = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        code: code$3,
        decode: decode$c,
        encode: encode$a,
        name: name$3,
        toGeneral,
      },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  code$2 = 0,
  name$2 = 'identity',
  encode$9 = coerce$2,
  digest = (e) => create$4(code$2, encode$9(e)),
  identity$3 = { code: code$2, name: name$2, encode: encode$9, digest },
  identity$4 = Object.freeze(
    Object.defineProperty(
      { __proto__: null, identity: identity$3 },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  identity$2 = from$3({
    prefix: '\0',
    name: 'identity',
    encode: (e) => toString$5(e),
    decode: (e) => fromString$5(e),
  }),
  identityBase$2 = Object.freeze(
    Object.defineProperty(
      { __proto__: null, identity: identity$2 },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  base2$4 = rfc4648$2({
    prefix: '0',
    name: 'base2',
    alphabet: '01',
    bitsPerChar: 1,
  }),
  base2$5 = Object.freeze(
    Object.defineProperty(
      { __proto__: null, base2: base2$4 },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  base8$4 = rfc4648$2({
    prefix: '7',
    name: 'base8',
    alphabet: '01234567',
    bitsPerChar: 3,
  }),
  base8$5 = Object.freeze(
    Object.defineProperty(
      { __proto__: null, base8: base8$4 },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  base10$4 = baseX$2({ prefix: '9', name: 'base10', alphabet: '0123456789' }),
  base10$5 = Object.freeze(
    Object.defineProperty(
      { __proto__: null, base10: base10$4 },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  base16$4 = rfc4648$2({
    prefix: 'f',
    name: 'base16',
    alphabet: '0123456789abcdef',
    bitsPerChar: 4,
  }),
  base16upper$2 = rfc4648$2({
    prefix: 'F',
    name: 'base16upper',
    alphabet: '0123456789ABCDEF',
    bitsPerChar: 4,
  }),
  base16$5 = Object.freeze(
    Object.defineProperty(
      { __proto__: null, base16: base16$4, base16upper: base16upper$2 },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  base36$4 = baseX$2({
    prefix: 'k',
    name: 'base36',
    alphabet: '0123456789abcdefghijklmnopqrstuvwxyz',
  }),
  base36upper$2 = baseX$2({
    prefix: 'K',
    name: 'base36upper',
    alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  }),
  base36$5 = Object.freeze(
    Object.defineProperty(
      { __proto__: null, base36: base36$4, base36upper: base36upper$2 },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  alphabet$2 = Array.from(
    '🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂'
  ),
  alphabetBytesToChars$2 = alphabet$2.reduce((e, o, a) => ((e[a] = o), e), []),
  alphabetCharsToBytes$2 = alphabet$2.reduce(
    (e, o, a) => ((e[o.codePointAt(0)] = a), e),
    []
  );
function encode$8(e) {
  return e.reduce((o, a) => ((o += alphabetBytesToChars$2[a]), o), '');
}
function decode$b(e) {
  const o = [];
  for (const a of e) {
    const s = alphabetCharsToBytes$2[a.codePointAt(0)];
    if (s === void 0) throw new Error(`Non-base256emoji character: ${a}`);
    o.push(s);
  }
  return new Uint8Array(o);
}
const base256emoji$4 = from$3({
    prefix: '🚀',
    name: 'base256emoji',
    encode: encode$8,
    decode: decode$b,
  }),
  base256emoji$5 = Object.freeze(
    Object.defineProperty(
      { __proto__: null, base256emoji: base256emoji$4 },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  from$2 = ({ name: e, code: o, encode: a }) => new Hasher(e, o, a);
class Hasher {
  constructor(o, a, s) {
    ((this.name = o), (this.code = a), (this.encode = s));
  }
  digest(o) {
    if (o instanceof Uint8Array) {
      const a = this.encode(o);
      return a instanceof Uint8Array
        ? create$4(this.code, a)
        : a.then((s) => create$4(this.code, s));
    } else throw Error('Unknown type, must be binary type');
  }
}
const sha = (e) => async (o) =>
    new Uint8Array(await crypto.subtle.digest(e, o)),
  sha256 = from$2({ name: 'sha2-256', code: 18, encode: sha('SHA-256') }),
  sha512 = from$2({ name: 'sha2-512', code: 19, encode: sha('SHA-512') }),
  sha2 = Object.freeze(
    Object.defineProperty(
      { __proto__: null, sha256, sha512 },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  name$1 = 'raw',
  code$1 = 85,
  encode$7 = (e) => coerce$2(e),
  decode$a = (e) => coerce$2(e),
  raw = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        code: code$1,
        decode: decode$a,
        encode: encode$7,
        name: name$1,
      },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  textEncoder = new TextEncoder(),
  textDecoder = new TextDecoder(),
  name = 'json',
  code = 512,
  encode$6 = (e) => textEncoder.encode(JSON.stringify(e)),
  decode$9 = (e) => JSON.parse(textDecoder.decode(e)),
  json = Object.freeze(
    Object.defineProperty(
      { __proto__: null, code, decode: decode$9, encode: encode$6, name },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  bases$2 = {
    ...identityBase$2,
    ...base2$5,
    ...base8$5,
    ...base10$5,
    ...base16$5,
    ...base32$5,
    ...base36$5,
    ...base58$2,
    ...base64$7,
    ...base256emoji$5,
  },
  hashes = { ...sha2, ...identity$4 },
  codecs$1 = { raw, json };
class Parser {
  constructor() {
    pt(this, 'index', 0);
    pt(this, 'input', '');
  }
  new(o) {
    return ((this.index = 0), (this.input = o), this);
  }
  readAtomically(o) {
    const a = this.index,
      s = o();
    return (s === void 0 && (this.index = a), s);
  }
  parseWith(o) {
    const a = o();
    if (this.index === this.input.length) return a;
  }
  peekChar() {
    if (!(this.index >= this.input.length)) return this.input[this.index];
  }
  readChar() {
    if (!(this.index >= this.input.length)) return this.input[this.index++];
  }
  readGivenChar(o) {
    return this.readAtomically(() => {
      const a = this.readChar();
      if (a === o) return a;
    });
  }
  readSeparator(o, a, s) {
    return this.readAtomically(() => {
      if (!(a > 0 && this.readGivenChar(o) === void 0)) return s();
    });
  }
  readNumber(o, a, s, i) {
    return this.readAtomically(() => {
      let c = 0,
        d = 0;
      const h = this.peekChar();
      if (h === void 0) return;
      const b = h === '0',
        g = 2 ** (8 * i) - 1;
      for (;;) {
        const $ = this.readAtomically(() => {
          const _ = this.readChar();
          if (_ === void 0) return;
          const _e = Number.parseInt(_, o);
          if (!Number.isNaN(_e)) return _e;
        });
        if ($ === void 0) break;
        if (((c *= o), (c += $), c > g || ((d += 1), a !== void 0 && d > a)))
          return;
      }
      if (d !== 0) return !s && b && d > 1 ? void 0 : c;
    });
  }
  readIPv4Addr() {
    return this.readAtomically(() => {
      const o = new Uint8Array(4);
      for (let a = 0; a < o.length; a++) {
        const s = this.readSeparator('.', a, () =>
          this.readNumber(10, 3, !1, 1)
        );
        if (s === void 0) return;
        o[a] = s;
      }
      return o;
    });
  }
  readIPv6Addr() {
    const o = (a) => {
      for (let s = 0; s < a.length / 2; s++) {
        const i = s * 2;
        if (s < a.length - 3) {
          const d = this.readSeparator(':', s, () => this.readIPv4Addr());
          if (d !== void 0)
            return (
              (a[i] = d[0]),
              (a[i + 1] = d[1]),
              (a[i + 2] = d[2]),
              (a[i + 3] = d[3]),
              [i + 4, !0]
            );
        }
        const c = this.readSeparator(':', s, () =>
          this.readNumber(16, 4, !0, 2)
        );
        if (c === void 0) return [i, !1];
        ((a[i] = c >> 8), (a[i + 1] = c & 255));
      }
      return [a.length, !1];
    };
    return this.readAtomically(() => {
      const a = new Uint8Array(16),
        [s, i] = o(a);
      if (s === 16) return a;
      if (
        i ||
        this.readGivenChar(':') === void 0 ||
        this.readGivenChar(':') === void 0
      )
        return;
      const c = new Uint8Array(14),
        d = 16 - (s + 2),
        [h] = o(c.subarray(0, d));
      return (a.set(c.subarray(0, h), 16 - h), a);
    });
  }
  readIPAddr() {
    return this.readIPv4Addr() ?? this.readIPv6Addr();
  }
}
const MAX_IPV6_LENGTH = 45,
  MAX_IPV4_LENGTH = 15,
  parser = new Parser();
function parseIPv4(e) {
  if (!(e.length > MAX_IPV4_LENGTH))
    return parser.new(e).parseWith(() => parser.readIPv4Addr());
}
function parseIPv6(e) {
  if ((e.includes('%') && (e = e.split('%')[0]), !(e.length > MAX_IPV6_LENGTH)))
    return parser.new(e).parseWith(() => parser.readIPv6Addr());
}
function parseIP(e, o = !1) {
  if ((e.includes('%') && (e = e.split('%')[0]), e.length > MAX_IPV6_LENGTH))
    return;
  const a = parser.new(e).parseWith(() => parser.readIPAddr());
  if (a)
    return o && a.length === 4
      ? Uint8Array.from([
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          255,
          255,
          a[0],
          a[1],
          a[2],
          a[3],
        ])
      : a;
}
function isIPv4(e) {
  return !!parseIPv4(e);
}
function isIPv6(e) {
  return !!parseIPv6(e);
}
function isIP(e) {
  return !!parseIP(e);
}
function base$1(e, o) {
  if (e.length >= 255) throw new TypeError('Alphabet too long');
  for (var a = new Uint8Array(256), s = 0; s < a.length; s++) a[s] = 255;
  for (var i = 0; i < e.length; i++) {
    var c = e.charAt(i),
      d = c.charCodeAt(0);
    if (a[d] !== 255) throw new TypeError(c + ' is ambiguous');
    a[d] = i;
  }
  var h = e.length,
    b = e.charAt(0),
    g = Math.log(h) / Math.log(256),
    $ = Math.log(256) / Math.log(h);
  function _(j) {
    if (
      (j instanceof Uint8Array ||
        (ArrayBuffer.isView(j)
          ? (j = new Uint8Array(j.buffer, j.byteOffset, j.byteLength))
          : Array.isArray(j) && (j = Uint8Array.from(j))),
      !(j instanceof Uint8Array))
    )
      throw new TypeError('Expected Uint8Array');
    if (j.length === 0) return '';
    for (var nt = 0, lt = 0, tt = 0, et = j.length; tt !== et && j[tt] === 0; )
      (tt++, nt++);
    for (
      var rt = ((et - tt) * $ + 1) >>> 0, at = new Uint8Array(rt);
      tt !== et;

    ) {
      for (
        var ct = j[tt], dt = 0, ut = rt - 1;
        (ct !== 0 || dt < lt) && ut !== -1;
        ut--, dt++
      )
        ((ct += (256 * at[ut]) >>> 0),
          (at[ut] = ct % h >>> 0),
          (ct = (ct / h) >>> 0));
      if (ct !== 0) throw new Error('Non-zero carry');
      ((lt = dt), tt++);
    }
    for (var st = rt - lt; st !== rt && at[st] === 0; ) st++;
    for (var gt = b.repeat(nt); st < rt; ++st) gt += e.charAt(at[st]);
    return gt;
  }
  function _e(j) {
    if (typeof j != 'string') throw new TypeError('Expected String');
    if (j.length === 0) return new Uint8Array();
    var nt = 0;
    if (j[nt] !== ' ') {
      for (var lt = 0, tt = 0; j[nt] === b; ) (lt++, nt++);
      for (
        var et = ((j.length - nt) * g + 1) >>> 0, rt = new Uint8Array(et);
        j[nt];

      ) {
        var at = a[j.charCodeAt(nt)];
        if (at === 255) return;
        for (
          var ct = 0, dt = et - 1;
          (at !== 0 || ct < tt) && dt !== -1;
          dt--, ct++
        )
          ((at += (h * rt[dt]) >>> 0),
            (rt[dt] = at % 256 >>> 0),
            (at = (at / 256) >>> 0));
        if (at !== 0) throw new Error('Non-zero carry');
        ((tt = ct), nt++);
      }
      if (j[nt] !== ' ') {
        for (var ut = et - tt; ut !== et && rt[ut] === 0; ) ut++;
        for (var st = new Uint8Array(lt + (et - ut)), gt = lt; ut !== et; )
          st[gt++] = rt[ut++];
        return st;
      }
    }
  }
  function ot(j) {
    var nt = _e(j);
    if (nt) return nt;
    throw new Error(`Non-${o} character`);
  }
  return { encode: _, decodeUnsafe: _e, decode: ot };
}
var src$2 = base$1,
  _brrp__multiformats_scope_baseX$1 = src$2;
const coerce$1 = (e) => {
    if (e instanceof Uint8Array && e.constructor.name === 'Uint8Array')
      return e;
    if (e instanceof ArrayBuffer) return new Uint8Array(e);
    if (ArrayBuffer.isView(e))
      return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
    throw new Error('Unknown type, must be binary type');
  },
  fromString$4 = (e) => new TextEncoder().encode(e),
  toString$4 = (e) => new TextDecoder().decode(e);
let Encoder$1 = class {
    constructor(o, a, s) {
      ((this.name = o), (this.prefix = a), (this.baseEncode = s));
    }
    encode(o) {
      if (o instanceof Uint8Array) return `${this.prefix}${this.baseEncode(o)}`;
      throw Error('Unknown type, must be binary type');
    }
  },
  Decoder$1 = class {
    constructor(o, a, s) {
      if (((this.name = o), (this.prefix = a), a.codePointAt(0) === void 0))
        throw new Error('Invalid prefix character');
      ((this.prefixCodePoint = a.codePointAt(0)), (this.baseDecode = s));
    }
    decode(o) {
      if (typeof o == 'string') {
        if (o.codePointAt(0) !== this.prefixCodePoint)
          throw Error(
            `Unable to decode multibase string ${JSON.stringify(o)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`
          );
        return this.baseDecode(o.slice(this.prefix.length));
      } else throw Error('Can only multibase decode strings');
    }
    or(o) {
      return or$1(this, o);
    }
  },
  ComposedDecoder$1 = class {
    constructor(o) {
      this.decoders = o;
    }
    or(o) {
      return or$1(this, o);
    }
    decode(o) {
      const a = o[0],
        s = this.decoders[a];
      if (s) return s.decode(o);
      throw RangeError(
        `Unable to decode multibase string ${JSON.stringify(o)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`
      );
    }
  };
const or$1 = (e, o) =>
  new ComposedDecoder$1({
    ...(e.decoders || { [e.prefix]: e }),
    ...(o.decoders || { [o.prefix]: o }),
  });
let Codec$1 = class {
  constructor(o, a, s, i) {
    ((this.name = o),
      (this.prefix = a),
      (this.baseEncode = s),
      (this.baseDecode = i),
      (this.encoder = new Encoder$1(o, a, s)),
      (this.decoder = new Decoder$1(o, a, i)));
  }
  encode(o) {
    return this.encoder.encode(o);
  }
  decode(o) {
    return this.decoder.decode(o);
  }
};
const from$1 = ({ name: e, prefix: o, encode: a, decode: s }) =>
    new Codec$1(e, o, a, s),
  baseX$1 = ({ prefix: e, name: o, alphabet: a }) => {
    const { encode: s, decode: i } = _brrp__multiformats_scope_baseX$1(a, o);
    return from$1({
      prefix: e,
      name: o,
      encode: s,
      decode: (c) => coerce$1(i(c)),
    });
  },
  decode$8 = (e, o, a, s) => {
    const i = {};
    for (let $ = 0; $ < o.length; ++$) i[o[$]] = $;
    let c = e.length;
    for (; e[c - 1] === '='; ) --c;
    const d = new Uint8Array(((c * a) / 8) | 0);
    let h = 0,
      b = 0,
      g = 0;
    for (let $ = 0; $ < c; ++$) {
      const _ = i[e[$]];
      if (_ === void 0) throw new SyntaxError(`Non-${s} character`);
      ((b = (b << a) | _),
        (h += a),
        h >= 8 && ((h -= 8), (d[g++] = 255 & (b >> h))));
    }
    if (h >= a || 255 & (b << (8 - h)))
      throw new SyntaxError('Unexpected end of data');
    return d;
  },
  encode$5 = (e, o, a) => {
    const s = o[o.length - 1] === '=',
      i = (1 << a) - 1;
    let c = '',
      d = 0,
      h = 0;
    for (let b = 0; b < e.length; ++b)
      for (h = (h << 8) | e[b], d += 8; d > a; )
        ((d -= a), (c += o[i & (h >> d)]));
    if ((d && (c += o[i & (h << (a - d))]), s))
      for (; (c.length * a) & 7; ) c += '=';
    return c;
  },
  rfc4648$1 = ({ name: e, prefix: o, bitsPerChar: a, alphabet: s }) =>
    from$1({
      prefix: o,
      name: e,
      encode(i) {
        return encode$5(i, s, a);
      },
      decode(i) {
        return decode$8(i, s, a, e);
      },
    }),
  base10$2 = baseX$1({ prefix: '9', name: 'base10', alphabet: '0123456789' }),
  base10$3 = Object.freeze(
    Object.defineProperty(
      { __proto__: null, base10: base10$2 },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  base16$2 = rfc4648$1({
    prefix: 'f',
    name: 'base16',
    alphabet: '0123456789abcdef',
    bitsPerChar: 4,
  }),
  base16upper$1 = rfc4648$1({
    prefix: 'F',
    name: 'base16upper',
    alphabet: '0123456789ABCDEF',
    bitsPerChar: 4,
  }),
  base16$3 = Object.freeze(
    Object.defineProperty(
      { __proto__: null, base16: base16$2, base16upper: base16upper$1 },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  base2$2 = rfc4648$1({
    prefix: '0',
    name: 'base2',
    alphabet: '01',
    bitsPerChar: 1,
  }),
  base2$3 = Object.freeze(
    Object.defineProperty(
      { __proto__: null, base2: base2$2 },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  alphabet$1 = Array.from(
    '🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂'
  ),
  alphabetBytesToChars$1 = alphabet$1.reduce((e, o, a) => ((e[a] = o), e), []),
  alphabetCharsToBytes$1 = alphabet$1.reduce(
    (e, o, a) => ((e[o.codePointAt(0)] = a), e),
    []
  );
function encode$4(e) {
  return e.reduce((o, a) => ((o += alphabetBytesToChars$1[a]), o), '');
}
function decode$7(e) {
  const o = [];
  for (const a of e) {
    const s = alphabetCharsToBytes$1[a.codePointAt(0)];
    if (s === void 0) throw new Error(`Non-base256emoji character: ${a}`);
    o.push(s);
  }
  return new Uint8Array(o);
}
const base256emoji$2 = from$1({
    prefix: '🚀',
    name: 'base256emoji',
    encode: encode$4,
    decode: decode$7,
  }),
  base256emoji$3 = Object.freeze(
    Object.defineProperty(
      { __proto__: null, base256emoji: base256emoji$2 },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  base32$2 = rfc4648$1({
    prefix: 'b',
    name: 'base32',
    alphabet: 'abcdefghijklmnopqrstuvwxyz234567',
    bitsPerChar: 5,
  }),
  base32upper$1 = rfc4648$1({
    prefix: 'B',
    name: 'base32upper',
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
    bitsPerChar: 5,
  }),
  base32pad$1 = rfc4648$1({
    prefix: 'c',
    name: 'base32pad',
    alphabet: 'abcdefghijklmnopqrstuvwxyz234567=',
    bitsPerChar: 5,
  }),
  base32padupper$1 = rfc4648$1({
    prefix: 'C',
    name: 'base32padupper',
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=',
    bitsPerChar: 5,
  }),
  base32hex$1 = rfc4648$1({
    prefix: 'v',
    name: 'base32hex',
    alphabet: '0123456789abcdefghijklmnopqrstuv',
    bitsPerChar: 5,
  }),
  base32hexupper$1 = rfc4648$1({
    prefix: 'V',
    name: 'base32hexupper',
    alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUV',
    bitsPerChar: 5,
  }),
  base32hexpad$1 = rfc4648$1({
    prefix: 't',
    name: 'base32hexpad',
    alphabet: '0123456789abcdefghijklmnopqrstuv=',
    bitsPerChar: 5,
  }),
  base32hexpadupper$1 = rfc4648$1({
    prefix: 'T',
    name: 'base32hexpadupper',
    alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUV=',
    bitsPerChar: 5,
  }),
  base32z$1 = rfc4648$1({
    prefix: 'h',
    name: 'base32z',
    alphabet: 'ybndrfg8ejkmcpqxot1uwisza345h769',
    bitsPerChar: 5,
  }),
  base32$3 = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        base32: base32$2,
        base32hex: base32hex$1,
        base32hexpad: base32hexpad$1,
        base32hexpadupper: base32hexpadupper$1,
        base32hexupper: base32hexupper$1,
        base32pad: base32pad$1,
        base32padupper: base32padupper$1,
        base32upper: base32upper$1,
        base32z: base32z$1,
      },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  base36$2 = baseX$1({
    prefix: 'k',
    name: 'base36',
    alphabet: '0123456789abcdefghijklmnopqrstuvwxyz',
  }),
  base36upper$1 = baseX$1({
    prefix: 'K',
    name: 'base36upper',
    alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  }),
  base36$3 = Object.freeze(
    Object.defineProperty(
      { __proto__: null, base36: base36$2, base36upper: base36upper$1 },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  base58btc$1 = baseX$1({
    name: 'base58btc',
    prefix: 'z',
    alphabet: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
  }),
  base58flickr$1 = baseX$1({
    name: 'base58flickr',
    prefix: 'Z',
    alphabet: '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ',
  }),
  base58$1 = Object.freeze(
    Object.defineProperty(
      { __proto__: null, base58btc: base58btc$1, base58flickr: base58flickr$1 },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  base64$4 = rfc4648$1({
    prefix: 'm',
    name: 'base64',
    alphabet:
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    bitsPerChar: 6,
  }),
  base64pad$1 = rfc4648$1({
    prefix: 'M',
    name: 'base64pad',
    alphabet:
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    bitsPerChar: 6,
  }),
  base64url$1 = rfc4648$1({
    prefix: 'u',
    name: 'base64url',
    alphabet:
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
    bitsPerChar: 6,
  }),
  base64urlpad$1 = rfc4648$1({
    prefix: 'U',
    name: 'base64urlpad',
    alphabet:
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=',
    bitsPerChar: 6,
  }),
  base64$5 = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        base64: base64$4,
        base64pad: base64pad$1,
        base64url: base64url$1,
        base64urlpad: base64urlpad$1,
      },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  base8$2 = rfc4648$1({
    prefix: '7',
    name: 'base8',
    alphabet: '01234567',
    bitsPerChar: 3,
  }),
  base8$3 = Object.freeze(
    Object.defineProperty(
      { __proto__: null, base8: base8$2 },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  identity$1 = from$1({
    prefix: '\0',
    name: 'identity',
    encode: (e) => toString$4(e),
    decode: (e) => fromString$4(e),
  }),
  identityBase$1 = Object.freeze(
    Object.defineProperty(
      { __proto__: null, identity: identity$1 },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  );
new TextEncoder();
new TextDecoder();
const bases$1 = {
  ...identityBase$1,
  ...base2$3,
  ...base8$3,
  ...base10$3,
  ...base16$3,
  ...base32$3,
  ...base36$3,
  ...base58$1,
  ...base64$5,
  ...base256emoji$3,
};
function asUint8Array$1(e) {
  return globalThis.Buffer != null
    ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength)
    : e;
}
function allocUnsafe$1(e = 0) {
  var o;
  return ((o = globalThis.Buffer) == null ? void 0 : o.allocUnsafe) != null
    ? asUint8Array$1(globalThis.Buffer.allocUnsafe(e))
    : new Uint8Array(e);
}
function createCodec$1(e, o, a, s) {
  return {
    name: e,
    prefix: o,
    encoder: { name: e, prefix: o, encode: a },
    decoder: { decode: s },
  };
}
const string$1 = createCodec$1(
    'utf8',
    'u',
    (e) => 'u' + new TextDecoder('utf8').decode(e),
    (e) => new TextEncoder().encode(e.substring(1))
  ),
  ascii$1 = createCodec$1(
    'ascii',
    'a',
    (e) => {
      let o = 'a';
      for (let a = 0; a < e.length; a++) o += String.fromCharCode(e[a]);
      return o;
    },
    (e) => {
      e = e.substring(1);
      const o = allocUnsafe$1(e.length);
      for (let a = 0; a < e.length; a++) o[a] = e.charCodeAt(a);
      return o;
    }
  ),
  BASES$1 = {
    utf8: string$1,
    'utf-8': string$1,
    hex: bases$1.base16,
    latin1: ascii$1,
    ascii: ascii$1,
    binary: ascii$1,
    ...bases$1,
  };
function toString$3(e, o = 'utf8') {
  const a = BASES$1[o];
  if (a == null) throw new Error(`Unsupported encoding "${o}"`);
  return (o === 'utf8' || o === 'utf-8') &&
    globalThis.Buffer != null &&
    globalThis.Buffer.from != null
    ? globalThis.Buffer.from(e.buffer, e.byteOffset, e.byteLength).toString(
        'utf8'
      )
    : a.encoder.encode(e).substring(1);
}
const isV4 = isIPv4,
  isV6 = isIPv6,
  toBytes$1 = function (e) {
    let o = 0;
    if (((e = e.toString().trim()), isV4(e))) {
      const a = new Uint8Array(o + 4);
      return (
        e.split(/\./g).forEach((s) => {
          a[o++] = parseInt(s, 10) & 255;
        }),
        a
      );
    }
    if (isV6(e)) {
      const a = e.split(':', 8);
      let s;
      for (s = 0; s < a.length; s++) {
        const c = isV4(a[s]);
        let d;
        (c &&
          ((d = toBytes$1(a[s])), (a[s] = toString$3(d.slice(0, 2), 'base16'))),
          d != null &&
            ++s < 8 &&
            a.splice(s, 0, toString$3(d.slice(2, 4), 'base16')));
      }
      if (a[0] === '') for (; a.length < 8; ) a.unshift('0');
      else if (a[a.length - 1] === '') for (; a.length < 8; ) a.push('0');
      else if (a.length < 8) {
        for (s = 0; s < a.length && a[s] !== ''; s++);
        const c = [s, 1];
        for (s = 9 - a.length; s > 0; s--) c.push('0');
        a.splice.apply(a, c);
      }
      const i = new Uint8Array(o + 16);
      for (s = 0; s < a.length; s++) {
        const c = parseInt(a[s], 16);
        ((i[o++] = (c >> 8) & 255), (i[o++] = c & 255));
      }
      return i;
    }
    throw new Error('invalid ip address');
  },
  toString$2 = function (e, o = 0, a) {
    ((o = ~~o), (a = a ?? e.length - o));
    const s = new DataView(e.buffer);
    if (a === 4) {
      const i = [];
      for (let c = 0; c < a; c++) i.push(e[o + c]);
      return i.join('.');
    }
    if (a === 16) {
      const i = [];
      for (let c = 0; c < a; c += 2) i.push(s.getUint16(o + c).toString(16));
      return i
        .join(':')
        .replace(/(^|:)0(:0)*:0(:|$)/, '$1::$3')
        .replace(/:{3,4}/, '::');
    }
    return '';
  },
  V$1 = -1,
  names = {},
  codes = {},
  table = [
    [4, 32, 'ip4'],
    [6, 16, 'tcp'],
    [33, 16, 'dccp'],
    [41, 128, 'ip6'],
    [42, V$1, 'ip6zone'],
    [43, 8, 'ipcidr'],
    [53, V$1, 'dns', !0],
    [54, V$1, 'dns4', !0],
    [55, V$1, 'dns6', !0],
    [56, V$1, 'dnsaddr', !0],
    [132, 16, 'sctp'],
    [273, 16, 'udp'],
    [275, 0, 'p2p-webrtc-star'],
    [276, 0, 'p2p-webrtc-direct'],
    [277, 0, 'p2p-stardust'],
    [280, 0, 'webrtc'],
    [281, 0, 'webrtc-w3c'],
    [290, 0, 'p2p-circuit'],
    [301, 0, 'udt'],
    [302, 0, 'utp'],
    [400, V$1, 'unix', !1, !0],
    [421, V$1, 'ipfs'],
    [421, V$1, 'p2p'],
    [443, 0, 'https'],
    [444, 96, 'onion'],
    [445, 296, 'onion3'],
    [446, V$1, 'garlic64'],
    [448, 0, 'tls'],
    [449, V$1, 'sni'],
    [460, 0, 'quic'],
    [461, 0, 'quic-v1'],
    [465, 0, 'webtransport'],
    [466, V$1, 'certhash'],
    [477, 0, 'ws'],
    [478, 0, 'wss'],
    [479, 0, 'p2p-websocket-star'],
    [480, 0, 'http'],
    [777, V$1, 'memory'],
  ];
table.forEach((e) => {
  const o = createProtocol(...e);
  ((codes[o.code] = o), (names[o.name] = o));
});
function createProtocol(e, o, a, s, i) {
  return { code: e, size: o, name: a, resolvable: !!s, path: !!i };
}
function getProtocol(e) {
  if (typeof e == 'number') {
    if (codes[e] != null) return codes[e];
    throw new Error(`no protocol with code: ${e}`);
  } else if (typeof e == 'string') {
    if (names[e] != null) return names[e];
    throw new Error(`no protocol with name: ${e}`);
  }
  throw new Error(`invalid protocol id type: ${typeof e}`);
}
var encode_1$1 = encode$3,
  MSB$3 = 128,
  REST$3 = 127,
  MSBALL$1 = ~REST$3,
  INT$1 = Math.pow(2, 31);
function encode$3(e, o, a) {
  if (Number.MAX_SAFE_INTEGER && e > Number.MAX_SAFE_INTEGER)
    throw ((encode$3.bytes = 0), new RangeError('Could not encode varint'));
  ((o = o || []), (a = a || 0));
  for (var s = a; e >= INT$1; ) ((o[a++] = (e & 255) | MSB$3), (e /= 128));
  for (; e & MSBALL$1; ) ((o[a++] = (e & 255) | MSB$3), (e >>>= 7));
  return ((o[a] = e | 0), (encode$3.bytes = a - s + 1), o);
}
var decode$6 = read$1,
  MSB$2 = 128,
  REST$2 = 127;
function read$1(e, s) {
  var a = 0,
    s = s || 0,
    i = 0,
    c = s,
    d,
    h = e.length;
  do {
    if (c >= h || i > 49)
      throw ((read$1.bytes = 0), new RangeError('Could not decode varint'));
    ((d = e[c++]),
      (a += i < 28 ? (d & REST$2) << i : (d & REST$2) * Math.pow(2, i)),
      (i += 7));
  } while (d >= MSB$2);
  return ((read$1.bytes = c - s), a);
}
var N1$2 = Math.pow(2, 7),
  N2$2 = Math.pow(2, 14),
  N3$2 = Math.pow(2, 21),
  N4$2 = Math.pow(2, 28),
  N5$2 = Math.pow(2, 35),
  N6$2 = Math.pow(2, 42),
  N7$2 = Math.pow(2, 49),
  N8$1 = Math.pow(2, 56),
  N9$1 = Math.pow(2, 63),
  length$1 = function (e) {
    return e < N1$2
      ? 1
      : e < N2$2
        ? 2
        : e < N3$2
          ? 3
          : e < N4$2
            ? 4
            : e < N5$2
              ? 5
              : e < N6$2
                ? 6
                : e < N7$2
                  ? 7
                  : e < N8$1
                    ? 8
                    : e < N9$1
                      ? 9
                      : 10;
  },
  varint$1 = { encode: encode_1$1, decode: decode$6, encodingLength: length$1 };
const varint$2 = getDefaultExportFromCjs(varint$1);
function fromString$3(e, o = 'utf8') {
  const a = BASES$1[o];
  if (a == null) throw new Error(`Unsupported encoding "${o}"`);
  return (o === 'utf8' || o === 'utf-8') &&
    globalThis.Buffer != null &&
    globalThis.Buffer.from != null
    ? asUint8Array$1(globalThis.Buffer.from(e, 'utf-8'))
    : a.decoder.decode(`${a.prefix}${e}`);
}
function concat$1(e, o) {
  o == null && (o = e.reduce((i, c) => i + c.length, 0));
  const a = allocUnsafe$1(o);
  let s = 0;
  for (const i of e) (a.set(i, s), (s += i.length));
  return asUint8Array$1(a);
}
function convertToString(e, o) {
  switch (getProtocol(e).code) {
    case 4:
    case 41:
      return bytes2ip(o);
    case 42:
      return bytes2str(o);
    case 6:
    case 273:
    case 33:
    case 132:
      return bytes2port$1(o).toString();
    case 53:
    case 54:
    case 55:
    case 56:
    case 400:
    case 449:
    case 777:
      return bytes2str(o);
    case 421:
      return bytes2mh(o);
    case 444:
      return bytes2onion$1(o);
    case 445:
      return bytes2onion$1(o);
    case 466:
      return bytes2mb$1(o);
    default:
      return toString$3(o, 'base16');
  }
}
function convertToBytes(e, o) {
  switch (getProtocol(e).code) {
    case 4:
      return ip2bytes(o);
    case 41:
      return ip2bytes(o);
    case 42:
      return str2bytes(o);
    case 6:
    case 273:
    case 33:
    case 132:
      return port2bytes$1(parseInt(o, 10));
    case 53:
    case 54:
    case 55:
    case 56:
    case 400:
    case 449:
    case 777:
      return str2bytes(o);
    case 421:
      return mh2bytes(o);
    case 444:
      return onion2bytes$1(o);
    case 445:
      return onion32bytes$1(o);
    case 466:
      return mb2bytes$1(o);
    default:
      return fromString$3(o, 'base16');
  }
}
const decoders$1 = Object.values(bases$2).map((e) => e.decoder),
  anybaseDecoder$1 = (function () {
    let e = decoders$1[0].or(decoders$1[1]);
    return (decoders$1.slice(2).forEach((o) => (e = e.or(o))), e);
  })();
function ip2bytes(e) {
  if (!isIP(e)) throw new Error('invalid ip address');
  return toBytes$1(e);
}
function bytes2ip(e) {
  const o = toString$2(e, 0, e.length);
  if (o == null) throw new Error('ipBuff is required');
  if (!isIP(o)) throw new Error('invalid ip address');
  return o;
}
function port2bytes$1(e) {
  const o = new ArrayBuffer(2);
  return (new DataView(o).setUint16(0, e), new Uint8Array(o));
}
function bytes2port$1(e) {
  return new DataView(e.buffer).getUint16(e.byteOffset);
}
function str2bytes(e) {
  const o = fromString$3(e),
    a = Uint8Array.from(varint$2.encode(o.length));
  return concat$1([a, o], a.length + o.length);
}
function bytes2str(e) {
  const o = varint$2.decode(e);
  if (((e = e.slice(varint$2.decode.bytes)), e.length !== o))
    throw new Error('inconsistent lengths');
  return toString$3(e);
}
function mh2bytes(e) {
  let o;
  e[0] === 'Q' || e[0] === '1'
    ? (o = decode$f(base58btc$2.decode(`z${e}`)).bytes)
    : (o = CID$1.parse(e).multihash.bytes);
  const a = Uint8Array.from(varint$2.encode(o.length));
  return concat$1([a, o], a.length + o.length);
}
function mb2bytes$1(e) {
  const o = anybaseDecoder$1.decode(e),
    a = Uint8Array.from(varint$2.encode(o.length));
  return concat$1([a, o], a.length + o.length);
}
function bytes2mb$1(e) {
  const o = varint$2.decode(e),
    a = e.slice(varint$2.decode.bytes);
  if (a.length !== o) throw new Error('inconsistent lengths');
  return 'u' + toString$3(a, 'base64url');
}
function bytes2mh(e) {
  const o = varint$2.decode(e),
    a = e.slice(varint$2.decode.bytes);
  if (a.length !== o) throw new Error('inconsistent lengths');
  return toString$3(a, 'base58btc');
}
function onion2bytes$1(e) {
  const o = e.split(':');
  if (o.length !== 2)
    throw new Error(
      `failed to parse onion addr: ["'${o.join('", "')}'"]' does not contain a port number`
    );
  if (o[0].length !== 16)
    throw new Error(
      `failed to parse onion addr: ${o[0]} not a Tor onion address.`
    );
  const a = base32$4.decode('b' + o[0]),
    s = parseInt(o[1], 10);
  if (s < 1 || s > 65536)
    throw new Error('Port number is not in range(1, 65536)');
  const i = port2bytes$1(s);
  return concat$1([a, i], a.length + i.length);
}
function onion32bytes$1(e) {
  const o = e.split(':');
  if (o.length !== 2)
    throw new Error(
      `failed to parse onion addr: ["'${o.join('", "')}'"]' does not contain a port number`
    );
  if (o[0].length !== 56)
    throw new Error(
      `failed to parse onion addr: ${o[0]} not a Tor onion3 address.`
    );
  const a = base32$4.decode(`b${o[0]}`),
    s = parseInt(o[1], 10);
  if (s < 1 || s > 65536)
    throw new Error('Port number is not in range(1, 65536)');
  const i = port2bytes$1(s);
  return concat$1([a, i], a.length + i.length);
}
function bytes2onion$1(e) {
  const o = e.slice(0, e.length - 2),
    a = e.slice(e.length - 2),
    s = toString$3(o, 'base32'),
    i = bytes2port$1(a);
  return `${s}:${i}`;
}
function stringToStringTuples(e) {
  const o = [],
    a = e.split('/').slice(1);
  if (a.length === 1 && a[0] === '') return [];
  for (let s = 0; s < a.length; s++) {
    const i = a[s],
      c = getProtocol(i);
    if (c.size === 0) {
      o.push([i]);
      continue;
    }
    if ((s++, s >= a.length)) throw ParseError('invalid address: ' + e);
    if (c.path === !0) {
      o.push([i, cleanPath(a.slice(s).join('/'))]);
      break;
    }
    o.push([i, a[s]]);
  }
  return o;
}
function stringTuplesToString(e) {
  const o = [];
  return (
    e.map((a) => {
      const s = protoFromTuple(a);
      return (
        o.push(s.name),
        a.length > 1 && a[1] != null && o.push(a[1]),
        null
      );
    }),
    cleanPath(o.join('/'))
  );
}
function stringTuplesToTuples(e) {
  return e.map((o) => {
    Array.isArray(o) || (o = [o]);
    const a = protoFromTuple(o);
    return o.length > 1 ? [a.code, convertToBytes(a.code, o[1])] : [a.code];
  });
}
function tuplesToStringTuples(e) {
  return e.map((o) => {
    const a = protoFromTuple(o);
    return o[1] != null ? [a.code, convertToString(a.code, o[1])] : [a.code];
  });
}
function tuplesToBytes(e) {
  return fromBytes(
    concat$1(
      e.map((o) => {
        const a = protoFromTuple(o);
        let s = Uint8Array.from(varint$2.encode(a.code));
        return (o.length > 1 && o[1] != null && (s = concat$1([s, o[1]])), s);
      })
    )
  );
}
function sizeForAddr$1(e, o) {
  return e.size > 0
    ? e.size / 8
    : e.size === 0
      ? 0
      : varint$2.decode(o) + (varint$2.decode.bytes ?? 0);
}
function bytesToTuples(e) {
  const o = [];
  let a = 0;
  for (; a < e.length; ) {
    const s = varint$2.decode(e, a),
      i = varint$2.decode.bytes ?? 0,
      c = getProtocol(s),
      d = sizeForAddr$1(c, e.slice(a + i));
    if (d === 0) {
      (o.push([s]), (a += i));
      continue;
    }
    const h = e.slice(a + i, a + i + d);
    if (((a += d + i), a > e.length))
      throw ParseError(
        'Invalid address Uint8Array: ' + toString$3(e, 'base16')
      );
    o.push([s, h]);
  }
  return o;
}
function bytesToString$1(e) {
  const o = bytesToTuples(e),
    a = tuplesToStringTuples(o);
  return stringTuplesToString(a);
}
function stringToBytes$1(e) {
  e = cleanPath(e);
  const o = stringToStringTuples(e),
    a = stringTuplesToTuples(o);
  return tuplesToBytes(a);
}
function fromString$2(e) {
  return stringToBytes$1(e);
}
function fromBytes(e) {
  const o = validateBytes(e);
  if (o != null) throw o;
  return Uint8Array.from(e);
}
function validateBytes(e) {
  try {
    bytesToTuples(e);
  } catch (o) {
    return o;
  }
}
function cleanPath(e) {
  return (
    '/' +
    e
      .trim()
      .split('/')
      .filter((o) => o)
      .join('/')
  );
}
function ParseError(e) {
  return new Error('Error parsing address: ' + e);
}
function protoFromTuple(e) {
  return getProtocol(e[0]);
}
function assign(e, o) {
  for (const a in o)
    Object.defineProperty(e, a, {
      value: o[a],
      enumerable: !0,
      configurable: !0,
    });
  return e;
}
function createError(e, o, a) {
  if (!e || typeof e == 'string')
    throw new TypeError('Please pass an Error to err-code');
  (a || (a = {}),
    typeof o == 'object' && ((a = o), (o = '')),
    o && (a.code = o));
  try {
    return assign(e, a);
  } catch {
    ((a.message = e.message), (a.stack = e.stack));
    const i = function () {};
    return (
      (i.prototype = Object.create(Object.getPrototypeOf(e))),
      assign(new i(), a)
    );
  }
}
var errCode = createError;
const errCode$1 = getDefaultExportFromCjs(errCode);
function equals$3(e, o) {
  if (e === o) return !0;
  if (e.byteLength !== o.byteLength) return !1;
  for (let a = 0; a < e.byteLength; a++) if (e[a] !== o[a]) return !1;
  return !0;
}
var __classPrivateFieldGet =
    (globalThis && globalThis.__classPrivateFieldGet) ||
    function (e, o, a, s) {
      if (a === 'a' && !s)
        throw new TypeError('Private accessor was defined without a getter');
      if (typeof o == 'function' ? e !== o || !s : !o.has(e))
        throw new TypeError(
          'Cannot read private member from an object whose class did not declare it'
        );
      return a === 'm' ? s : a === 'a' ? s.call(e) : s ? s.value : o.get(e);
    },
  __classPrivateFieldSet =
    (globalThis && globalThis.__classPrivateFieldSet) ||
    function (e, o, a, s, i) {
      if (s === 'm') throw new TypeError('Private method is not writable');
      if (s === 'a' && !i)
        throw new TypeError('Private accessor was defined without a setter');
      if (typeof o == 'function' ? e !== o || !i : !o.has(e))
        throw new TypeError(
          'Cannot write private member to an object whose class did not declare it'
        );
      return (s === 'a' ? i.call(e, a) : i ? (i.value = a) : o.set(e, a), a);
    },
  _DefaultMultiaddr_string,
  _DefaultMultiaddr_tuples,
  _DefaultMultiaddr_stringTuples,
  _a;
const inspect$2 = Symbol.for('nodejs.util.inspect.custom'),
  DNS_CODES$1 = [
    getProtocol('dns').code,
    getProtocol('dns4').code,
    getProtocol('dns6').code,
    getProtocol('dnsaddr').code,
  ],
  resolvers$1 = new Map(),
  symbol$2 = Symbol.for('@multiformats/js-multiaddr/multiaddr');
function isMultiaddr$1(e) {
  return !!(e != null && e[symbol$2]);
}
class DefaultMultiaddr {
  constructor(o) {
    if (
      (_DefaultMultiaddr_string.set(this, void 0),
      _DefaultMultiaddr_tuples.set(this, void 0),
      _DefaultMultiaddr_stringTuples.set(this, void 0),
      (this[_a] = !0),
      o == null && (o = ''),
      o instanceof Uint8Array)
    )
      this.bytes = fromBytes(o);
    else if (typeof o == 'string') {
      if (o.length > 0 && o.charAt(0) !== '/')
        throw new Error(`multiaddr "${o}" must start with a "/"`);
      this.bytes = fromString$2(o);
    } else if (isMultiaddr$1(o)) this.bytes = fromBytes(o.bytes);
    else throw new Error('addr must be a string, Buffer, or another Multiaddr');
  }
  toString() {
    return (
      __classPrivateFieldGet(this, _DefaultMultiaddr_string, 'f') == null &&
        __classPrivateFieldSet(
          this,
          _DefaultMultiaddr_string,
          bytesToString$1(this.bytes),
          'f'
        ),
      __classPrivateFieldGet(this, _DefaultMultiaddr_string, 'f')
    );
  }
  toJSON() {
    return this.toString();
  }
  toOptions() {
    let o,
      a,
      s,
      i,
      c = '';
    const d = getProtocol('tcp'),
      h = getProtocol('udp'),
      b = getProtocol('ip4'),
      g = getProtocol('ip6'),
      $ = getProtocol('dns6'),
      _ = getProtocol('ip6zone');
    for (const [ot, j] of this.stringTuples())
      (ot === _.code && (c = `%${j ?? ''}`),
        DNS_CODES$1.includes(ot) &&
          ((a = d.name),
          (i = 443),
          (s = `${j ?? ''}${c}`),
          (o = ot === $.code ? 6 : 4)),
        (ot === d.code || ot === h.code) &&
          ((a = getProtocol(ot).name), (i = parseInt(j ?? ''))),
        (ot === b.code || ot === g.code) &&
          ((a = getProtocol(ot).name),
          (s = `${j ?? ''}${c}`),
          (o = ot === g.code ? 6 : 4)));
    if (o == null || a == null || s == null || i == null)
      throw new Error(
        'multiaddr must have a valid format: "/{ip4, ip6, dns4, dns6, dnsaddr}/{address}/{tcp, udp}/{port}".'
      );
    return { family: o, host: s, transport: a, port: i };
  }
  protos() {
    return this.protoCodes().map((o) => Object.assign({}, getProtocol(o)));
  }
  protoCodes() {
    const o = [],
      a = this.bytes;
    let s = 0;
    for (; s < a.length; ) {
      const i = varint$2.decode(a, s),
        c = varint$2.decode.bytes ?? 0,
        d = getProtocol(i),
        h = sizeForAddr$1(d, a.slice(s + c));
      ((s += h + c), o.push(i));
    }
    return o;
  }
  protoNames() {
    return this.protos().map((o) => o.name);
  }
  tuples() {
    return (
      __classPrivateFieldGet(this, _DefaultMultiaddr_tuples, 'f') == null &&
        __classPrivateFieldSet(
          this,
          _DefaultMultiaddr_tuples,
          bytesToTuples(this.bytes),
          'f'
        ),
      __classPrivateFieldGet(this, _DefaultMultiaddr_tuples, 'f')
    );
  }
  stringTuples() {
    return (
      __classPrivateFieldGet(this, _DefaultMultiaddr_stringTuples, 'f') ==
        null &&
        __classPrivateFieldSet(
          this,
          _DefaultMultiaddr_stringTuples,
          tuplesToStringTuples(this.tuples()),
          'f'
        ),
      __classPrivateFieldGet(this, _DefaultMultiaddr_stringTuples, 'f')
    );
  }
  encapsulate(o) {
    return (
      (o = new DefaultMultiaddr(o)),
      new DefaultMultiaddr(this.toString() + o.toString())
    );
  }
  decapsulate(o) {
    const a = o.toString(),
      s = this.toString(),
      i = s.lastIndexOf(a);
    if (i < 0)
      throw new Error(
        `Address ${this.toString()} does not contain subaddress: ${o.toString()}`
      );
    return new DefaultMultiaddr(s.slice(0, i));
  }
  decapsulateCode(o) {
    const a = this.tuples();
    for (let s = a.length - 1; s >= 0; s--)
      if (a[s][0] === o)
        return new DefaultMultiaddr(tuplesToBytes(a.slice(0, s)));
    return this;
  }
  getPeerId() {
    try {
      const a = this.stringTuples()
        .filter((s) => s[0] === names.ipfs.code)
        .pop();
      if ((a == null ? void 0 : a[1]) != null) {
        const s = a[1];
        return s[0] === 'Q' || s[0] === '1'
          ? toString$3(base58btc$2.decode(`z${s}`), 'base58btc')
          : toString$3(CID$1.parse(s).multihash.bytes, 'base58btc');
      }
      return null;
    } catch {
      return null;
    }
  }
  getPath() {
    let o = null;
    try {
      ((o = this.stringTuples().filter(
        (a) => getProtocol(a[0]).path === !0
      )[0][1]),
        o == null && (o = null));
    } catch {
      o = null;
    }
    return o;
  }
  equals(o) {
    return equals$3(this.bytes, o.bytes);
  }
  async resolve(o) {
    const a = this.protos().find((c) => c.resolvable);
    if (a == null) return [this];
    const s = resolvers$1.get(a.name);
    if (s == null)
      throw errCode$1(
        new Error(`no available resolver for ${a.name}`),
        'ERR_NO_AVAILABLE_RESOLVER'
      );
    return (await s(this, o)).map((c) => new DefaultMultiaddr(c));
  }
  nodeAddress() {
    const o = this.toOptions();
    if (o.transport !== 'tcp' && o.transport !== 'udp')
      throw new Error(
        `multiaddr must have a valid format - no protocol with name: "${o.transport}". Must have a valid transport protocol: "{tcp, udp}"`
      );
    return { family: o.family, address: o.host, port: o.port };
  }
  isThinWaistAddress(o) {
    const a = (o ?? this).protos();
    return !(
      a.length !== 2 ||
      (a[0].code !== 4 && a[0].code !== 41) ||
      (a[1].code !== 6 && a[1].code !== 273)
    );
  }
  [((_DefaultMultiaddr_string = new WeakMap()),
  (_DefaultMultiaddr_tuples = new WeakMap()),
  (_DefaultMultiaddr_stringTuples = new WeakMap()),
  (_a = symbol$2),
  inspect$2)]() {
    return `Multiaddr(${bytesToString$1(this.bytes)})`;
  }
}
function multiaddr$1(e) {
  return new DefaultMultiaddr(e);
}
function commonjsRequire(e) {
  throw new Error(
    'Could not dynamically require "' +
      e +
      '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.'
  );
}
function isElectron$1() {
  return !!(
    (typeof window < 'u' &&
      typeof window.process == 'object' &&
      window.process.type === 'renderer') ||
    (typeof process < 'u' &&
      typeof process.versions == 'object' &&
      process.versions.electron) ||
    (typeof navigator == 'object' &&
      typeof navigator.userAgent == 'string' &&
      navigator.userAgent.indexOf('Electron') >= 0)
  );
}
var isElectron_1 = isElectron$1;
const isElectron = isElectron_1,
  IS_ENV_WITH_DOM =
    typeof window == 'object' &&
    typeof document == 'object' &&
    document.nodeType === 9,
  IS_ELECTRON = isElectron(),
  IS_BROWSER = IS_ENV_WITH_DOM && !IS_ELECTRON,
  IS_ELECTRON_MAIN = IS_ELECTRON && !IS_ENV_WITH_DOM,
  IS_ELECTRON_RENDERER = IS_ELECTRON && IS_ENV_WITH_DOM,
  IS_NODE =
    typeof commonjsRequire == 'function' &&
    typeof process < 'u' &&
    typeof process.release < 'u' &&
    process.release.name === 'node' &&
    !IS_ELECTRON,
  IS_WEBWORKER =
    typeof importScripts == 'function' &&
    typeof self < 'u' &&
    typeof WorkerGlobalScope < 'u' &&
    self instanceof WorkerGlobalScope,
  IS_TEST = typeof process < 'u' && typeof process.env < 'u' && !1,
  IS_REACT_NATIVE =
    typeof navigator < 'u' && navigator.product === 'ReactNative';
var env = {
  isTest: IS_TEST,
  isElectron: IS_ELECTRON,
  isElectronMain: IS_ELECTRON_MAIN,
  isElectronRenderer: IS_ELECTRON_RENDERER,
  isNode: IS_NODE,
  isBrowser: IS_BROWSER,
  isWebWorker: IS_WEBWORKER,
  isEnvWithDom: IS_ENV_WITH_DOM,
  isReactNative: IS_REACT_NATIVE,
};
let durationRE = /(-?(?:\d+\.?\d*|\d*\.?\d+)(?:e[-+]?\d+)?)\s*([\p{L}]*)/giu;
parse.year = parse.yr = parse.y = 6e4 * 60 * 24 * 365.25;
parse.month = parse.b = 6e4 * 60 * 24 * (365.25 / 12);
parse.week = parse.wk = parse.w = 6e4 * 60 * 24 * 7;
parse.day = parse.d = 6e4 * 60 * 24;
parse.hour = parse.hr = parse.h = 6e4 * 60;
parse.minute = parse.min = parse.m = 6e4;
parse.second = parse.sec = parse.s = 1e3;
parse.millisecond = parse.millisec = parse.ms = 1;
parse.µs = parse.μs = parse.us = parse.microsecond = 1 / 1e3;
parse.nanosecond = parse.ns = 1 / 1e6;
function parse(e = '', o = 'ms') {
  var a = null,
    s;
  return (
    (e = (e + '').replace(/(\d)[,_](\d)/g, '$1$2')),
    e.replace(durationRE, function (i, c, d) {
      if (d) d = d.toLowerCase();
      else if (s) {
        for (var h in parse)
          if (parse[h] < s) {
            d = h;
            break;
          }
      } else d = o;
      (Object.prototype.hasOwnProperty.call(parse, d)
        ? (d = parse[d])
        : Object.prototype.hasOwnProperty.call(parse, d.replace(/s$/, ''))
          ? (d = parse[d.replace(/s$/, '')])
          : (d = null),
        d && ((a = (a || 0) + Math.abs(parseFloat(c, 10)) * d), (s = d)));
    }),
    a && (a / (parse[o] || 1)) * (e[0] === '-' ? -1 : 1)
  );
}
var browser$1 = { exports: {} },
  ms,
  hasRequiredMs;
function requireMs() {
  if (hasRequiredMs) return ms;
  hasRequiredMs = 1;
  var e = 1e3,
    o = e * 60,
    a = o * 60,
    s = a * 24,
    i = s * 7,
    c = s * 365.25;
  ms = function ($, _) {
    _ = _ || {};
    var _e = typeof $;
    if (_e === 'string' && $.length > 0) return d($);
    if (_e === 'number' && isFinite($)) return _.long ? b($) : h($);
    throw new Error(
      'val is not a non-empty string or a valid number. val=' +
        JSON.stringify($)
    );
  };
  function d($) {
    if ((($ = String($)), !($.length > 100))) {
      var _ =
        /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
          $
        );
      if (_) {
        var _e = parseFloat(_[1]),
          ot = (_[2] || 'ms').toLowerCase();
        switch (ot) {
          case 'years':
          case 'year':
          case 'yrs':
          case 'yr':
          case 'y':
            return _e * c;
          case 'weeks':
          case 'week':
          case 'w':
            return _e * i;
          case 'days':
          case 'day':
          case 'd':
            return _e * s;
          case 'hours':
          case 'hour':
          case 'hrs':
          case 'hr':
          case 'h':
            return _e * a;
          case 'minutes':
          case 'minute':
          case 'mins':
          case 'min':
          case 'm':
            return _e * o;
          case 'seconds':
          case 'second':
          case 'secs':
          case 'sec':
          case 's':
            return _e * e;
          case 'milliseconds':
          case 'millisecond':
          case 'msecs':
          case 'msec':
          case 'ms':
            return _e;
          default:
            return;
        }
      }
    }
  }
  function h($) {
    var _ = Math.abs($);
    return _ >= s
      ? Math.round($ / s) + 'd'
      : _ >= a
        ? Math.round($ / a) + 'h'
        : _ >= o
          ? Math.round($ / o) + 'm'
          : _ >= e
            ? Math.round($ / e) + 's'
            : $ + 'ms';
  }
  function b($) {
    var _ = Math.abs($);
    return _ >= s
      ? g($, _, s, 'day')
      : _ >= a
        ? g($, _, a, 'hour')
        : _ >= o
          ? g($, _, o, 'minute')
          : _ >= e
            ? g($, _, e, 'second')
            : $ + ' ms';
  }
  function g($, _, _e, ot) {
    var j = _ >= _e * 1.5;
    return Math.round($ / _e) + ' ' + ot + (j ? 's' : '');
  }
  return ms;
}
function setup(e) {
  ((a.debug = a),
    (a.default = a),
    (a.coerce = b),
    (a.disable = d),
    (a.enable = i),
    (a.enabled = h),
    (a.humanize = requireMs()),
    (a.destroy = g),
    Object.keys(e).forEach(($) => {
      a[$] = e[$];
    }),
    (a.names = []),
    (a.skips = []),
    (a.formatters = {}));
  function o($) {
    let _ = 0;
    for (let _e = 0; _e < $.length; _e++)
      ((_ = (_ << 5) - _ + $.charCodeAt(_e)), (_ |= 0));
    return a.colors[Math.abs(_) % a.colors.length];
  }
  a.selectColor = o;
  function a($) {
    let _,
      _e = null,
      ot,
      j;
    function nt(...lt) {
      if (!nt.enabled) return;
      const tt = nt,
        et = Number(new Date()),
        rt = et - (_ || et);
      ((tt.diff = rt),
        (tt.prev = _),
        (tt.curr = et),
        (_ = et),
        (lt[0] = a.coerce(lt[0])),
        typeof lt[0] != 'string' && lt.unshift('%O'));
      let at = 0;
      ((lt[0] = lt[0].replace(/%([a-zA-Z%])/g, (dt, ut) => {
        if (dt === '%%') return '%';
        at++;
        const st = a.formatters[ut];
        if (typeof st == 'function') {
          const gt = lt[at];
          ((dt = st.call(tt, gt)), lt.splice(at, 1), at--);
        }
        return dt;
      })),
        a.formatArgs.call(tt, lt),
        (tt.log || a.log).apply(tt, lt));
    }
    return (
      (nt.namespace = $),
      (nt.useColors = a.useColors()),
      (nt.color = a.selectColor($)),
      (nt.extend = s),
      (nt.destroy = a.destroy),
      Object.defineProperty(nt, 'enabled', {
        enumerable: !0,
        configurable: !1,
        get: () =>
          _e !== null
            ? _e
            : (ot !== a.namespaces && ((ot = a.namespaces), (j = a.enabled($))),
              j),
        set: (lt) => {
          _e = lt;
        },
      }),
      typeof a.init == 'function' && a.init(nt),
      nt
    );
  }
  function s($, _) {
    const _e = a(this.namespace + (typeof _ > 'u' ? ':' : _) + $);
    return ((_e.log = this.log), _e);
  }
  function i($) {
    (a.save($), (a.namespaces = $), (a.names = []), (a.skips = []));
    const _ = (typeof $ == 'string' ? $ : '')
      .trim()
      .replace(/\s+/g, ',')
      .split(',')
      .filter(Boolean);
    for (const _e of _)
      _e[0] === '-' ? a.skips.push(_e.slice(1)) : a.names.push(_e);
  }
  function c($, _) {
    let _e = 0,
      ot = 0,
      j = -1,
      nt = 0;
    for (; _e < $.length; )
      if (ot < _.length && (_[ot] === $[_e] || _[ot] === '*'))
        _[ot] === '*' ? ((j = ot), (nt = _e), ot++) : (_e++, ot++);
      else if (j !== -1) ((ot = j + 1), nt++, (_e = nt));
      else return !1;
    for (; ot < _.length && _[ot] === '*'; ) ot++;
    return ot === _.length;
  }
  function d() {
    const $ = [...a.names, ...a.skips.map((_) => '-' + _)].join(',');
    return (a.enable(''), $);
  }
  function h($) {
    for (const _ of a.skips) if (c($, _)) return !1;
    for (const _ of a.names) if (c($, _)) return !0;
    return !1;
  }
  function b($) {
    return $ instanceof Error ? $.stack || $.message : $;
  }
  function g() {
    console.warn(
      'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
    );
  }
  return (a.enable(a.load()), a);
}
var common = setup;
(function (e, o) {
  ((o.formatArgs = s),
    (o.save = i),
    (o.load = c),
    (o.useColors = a),
    (o.storage = d()),
    (o.destroy = (() => {
      let b = !1;
      return () => {
        b ||
          ((b = !0),
          console.warn(
            'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
          ));
      };
    })()),
    (o.colors = [
      '#0000CC',
      '#0000FF',
      '#0033CC',
      '#0033FF',
      '#0066CC',
      '#0066FF',
      '#0099CC',
      '#0099FF',
      '#00CC00',
      '#00CC33',
      '#00CC66',
      '#00CC99',
      '#00CCCC',
      '#00CCFF',
      '#3300CC',
      '#3300FF',
      '#3333CC',
      '#3333FF',
      '#3366CC',
      '#3366FF',
      '#3399CC',
      '#3399FF',
      '#33CC00',
      '#33CC33',
      '#33CC66',
      '#33CC99',
      '#33CCCC',
      '#33CCFF',
      '#6600CC',
      '#6600FF',
      '#6633CC',
      '#6633FF',
      '#66CC00',
      '#66CC33',
      '#9900CC',
      '#9900FF',
      '#9933CC',
      '#9933FF',
      '#99CC00',
      '#99CC33',
      '#CC0000',
      '#CC0033',
      '#CC0066',
      '#CC0099',
      '#CC00CC',
      '#CC00FF',
      '#CC3300',
      '#CC3333',
      '#CC3366',
      '#CC3399',
      '#CC33CC',
      '#CC33FF',
      '#CC6600',
      '#CC6633',
      '#CC9900',
      '#CC9933',
      '#CCCC00',
      '#CCCC33',
      '#FF0000',
      '#FF0033',
      '#FF0066',
      '#FF0099',
      '#FF00CC',
      '#FF00FF',
      '#FF3300',
      '#FF3333',
      '#FF3366',
      '#FF3399',
      '#FF33CC',
      '#FF33FF',
      '#FF6600',
      '#FF6633',
      '#FF9900',
      '#FF9933',
      '#FFCC00',
      '#FFCC33',
    ]));
  function a() {
    if (
      typeof window < 'u' &&
      window.process &&
      (window.process.type === 'renderer' || window.process.__nwjs)
    )
      return !0;
    if (
      typeof navigator < 'u' &&
      navigator.userAgent &&
      navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)
    )
      return !1;
    let b;
    return (
      (typeof document < 'u' &&
        document.documentElement &&
        document.documentElement.style &&
        document.documentElement.style.WebkitAppearance) ||
      (typeof window < 'u' &&
        window.console &&
        (window.console.firebug ||
          (window.console.exception && window.console.table))) ||
      (typeof navigator < 'u' &&
        navigator.userAgent &&
        (b = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) &&
        parseInt(b[1], 10) >= 31) ||
      (typeof navigator < 'u' &&
        navigator.userAgent &&
        navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))
    );
  }
  function s(b) {
    if (
      ((b[0] =
        (this.useColors ? '%c' : '') +
        this.namespace +
        (this.useColors ? ' %c' : ' ') +
        b[0] +
        (this.useColors ? '%c ' : ' ') +
        '+' +
        e.exports.humanize(this.diff)),
      !this.useColors)
    )
      return;
    const g = 'color: ' + this.color;
    b.splice(1, 0, g, 'color: inherit');
    let $ = 0,
      _ = 0;
    (b[0].replace(/%[a-zA-Z%]/g, (_e) => {
      _e !== '%%' && ($++, _e === '%c' && (_ = $));
    }),
      b.splice(_, 0, g));
  }
  o.log = console.debug || console.log || (() => {});
  function i(b) {
    try {
      b ? o.storage.setItem('debug', b) : o.storage.removeItem('debug');
    } catch {}
  }
  function c() {
    let b;
    try {
      b = o.storage.getItem('debug') || o.storage.getItem('DEBUG');
    } catch {}
    return (
      !b && typeof process < 'u' && 'env' in process && (b = {}.DEBUG),
      b
    );
  }
  function d() {
    try {
      return localStorage;
    } catch {}
  }
  e.exports = common(o);
  const { formatters: h } = e.exports;
  h.j = function (b) {
    try {
      return JSON.stringify(b);
    } catch (g) {
      return '[UnexpectedJSONParseError]: ' + g.message;
    }
  };
})(browser$1, browser$1.exports);
var browserExports = browser$1.exports;
const debug = getDefaultExportFromCjs(browserExports);
debug.formatters.b = (e) =>
  e == null ? 'undefined' : base58btc$2.baseEncode(e);
debug.formatters.t = (e) => (e == null ? 'undefined' : base32$4.baseEncode(e));
debug.formatters.m = (e) => (e == null ? 'undefined' : base64$6.baseEncode(e));
debug.formatters.p = (e) => (e == null ? 'undefined' : e.toString());
debug.formatters.c = (e) => (e == null ? 'undefined' : e.toString());
debug.formatters.k = (e) => (e == null ? 'undefined' : e.toString());
debug.formatters.a = (e) => (e == null ? 'undefined' : e.toString());
function createDisabledLogger(e) {
  const o = () => {};
  return (
    (o.enabled = !1),
    (o.color = ''),
    (o.diff = 0),
    (o.log = () => {}),
    (o.namespace = e),
    (o.destroy = () => !0),
    (o.extend = () => o),
    o
  );
}
function logger(e) {
  let o = createDisabledLogger(`${e}:trace`);
  return (
    debug.enabled(`${e}:trace`) &&
      debug.names.map((a) => a.toString()).find((a) => a.includes(':trace')) !=
        null &&
      (o = debug(`${e}:trace`)),
    Object.assign(debug(e), { error: debug(`${e}:error`), trace: o })
  );
}
var error = {};
let TimeoutError$2 = class extends Error {
  constructor(o = 'Request timed out') {
    (super(o), (this.name = 'TimeoutError'));
  }
};
error.TimeoutError = TimeoutError$2;
let AbortError$1 = class extends Error {
  constructor(o = 'The operation was aborted.') {
    (super(o), (this.name = 'AbortError'));
  }
};
error.AbortError = AbortError$1;
let HTTPError$1 = class extends Error {
  constructor(o) {
    (super(o.statusText), (this.name = 'HTTPError'), (this.response = o));
  }
};
error.HTTPError = HTTPError$1;
var src$1 = { exports: {} },
  browser = { exports: {} },
  hasRequiredBrowser;
function requireBrowser() {
  return (
    hasRequiredBrowser ||
      ((hasRequiredBrowser = 1),
      (function (e, o) {
        var a = function () {
            if (typeof self < 'u') return self;
            if (typeof window < 'u') return window;
            if (typeof commonjsGlobal < 'u') return commonjsGlobal;
            throw new Error('unable to locate global object');
          },
          s = a();
        ((e.exports = o = s.fetch),
          s.fetch && (o.default = s.fetch.bind(s)),
          (o.Headers = s.Headers),
          (o.Request = s.Request),
          (o.Response = s.Response));
      })(browser, browser.exports)),
    browser.exports
  );
}
globalThis.fetch &&
globalThis.Headers &&
globalThis.Request &&
globalThis.Response
  ? (src$1.exports = {
      default: globalThis.fetch,
      Headers: globalThis.Headers,
      Request: globalThis.Request,
      Response: globalThis.Response,
    })
  : (src$1.exports = {
      default: requireBrowser().default,
      Headers: requireBrowser().Headers,
      Request: requireBrowser().Request,
      Response: requireBrowser().Response,
    });
var srcExports = src$1.exports,
  fetch_browser$1 = srcExports;
const { TimeoutError: TimeoutError$1, AbortError } = error,
  {
    Response: Response$1,
    Request: Request$1,
    Headers: Headers$1,
    default: fetch$2,
  } = fetch_browser$1,
  fetchWithProgress = (e, o = {}) => {
    const a = new XMLHttpRequest();
    a.open(o.method || 'GET', e.toString(), !0);
    const { timeout: s, headers: i } = o;
    if (
      (s && s > 0 && s < 1 / 0 && (a.timeout = s),
      o.overrideMimeType != null && a.overrideMimeType(o.overrideMimeType),
      i)
    )
      for (const [c, d] of new Headers$1(i)) a.setRequestHeader(c, d);
    return (
      o.signal && (o.signal.onabort = () => a.abort()),
      o.onUploadProgress && (a.upload.onprogress = o.onUploadProgress),
      (a.responseType = 'arraybuffer'),
      new Promise((c, d) => {
        const h = (b) => {
          switch (b.type) {
            case 'error': {
              c(Response$1.error());
              break;
            }
            case 'load': {
              c(
                new ResponseWithURL(a.responseURL, a.response, {
                  status: a.status,
                  statusText: a.statusText,
                  headers: parseHeaders(a.getAllResponseHeaders()),
                })
              );
              break;
            }
            case 'timeout': {
              d(new TimeoutError$1());
              break;
            }
            case 'abort': {
              d(new AbortError());
              break;
            }
          }
        };
        ((a.onerror = h),
          (a.onload = h),
          (a.ontimeout = h),
          (a.onabort = h),
          a.send(o.body));
      })
    );
  },
  fetchWithStreaming = fetch$2,
  fetchWith = (e, o = {}) =>
    o.onUploadProgress != null
      ? fetchWithProgress(e, o)
      : fetchWithStreaming(e, o),
  parseHeaders = (e) => {
    const o = new Headers$1();
    for (const a of e.trim().split(/[\r\n]+/)) {
      const s = a.indexOf(': ');
      s > 0 && o.set(a.slice(0, s), a.slice(s + 1));
    }
    return o;
  };
class ResponseWithURL extends Response$1 {
  constructor(o, a, s) {
    (super(a, s), Object.defineProperty(this, 'url', { value: o }));
  }
}
var fetch_browser = {
    fetch: fetchWith,
    Request: Request$1,
    Headers: Headers$1,
  },
  isPlainObj = (e) => {
    if (Object.prototype.toString.call(e) !== '[object Object]') return !1;
    const o = Object.getPrototypeOf(e);
    return o === null || o === Object.prototype;
  };
const isOptionObject = isPlainObj,
  { hasOwnProperty } = Object.prototype,
  { propertyIsEnumerable } = Object,
  defineProperty = (e, o, a) =>
    Object.defineProperty(e, o, {
      value: a,
      writable: !0,
      enumerable: !0,
      configurable: !0,
    }),
  globalThis$1 = commonjsGlobal,
  defaultMergeOptions = { concatArrays: !1, ignoreUndefined: !1 },
  getEnumerableOwnPropertyKeys = (e) => {
    const o = [];
    for (const a in e) hasOwnProperty.call(e, a) && o.push(a);
    if (Object.getOwnPropertySymbols) {
      const a = Object.getOwnPropertySymbols(e);
      for (const s of a) propertyIsEnumerable.call(e, s) && o.push(s);
    }
    return o;
  };
function clone(e) {
  return Array.isArray(e)
    ? cloneArray(e)
    : isOptionObject(e)
      ? cloneOptionObject(e)
      : e;
}
function cloneArray(e) {
  const o = e.slice(0, 0);
  return (
    getEnumerableOwnPropertyKeys(e).forEach((a) => {
      defineProperty(o, a, clone(e[a]));
    }),
    o
  );
}
function cloneOptionObject(e) {
  const o = Object.getPrototypeOf(e) === null ? Object.create(null) : {};
  return (
    getEnumerableOwnPropertyKeys(e).forEach((a) => {
      defineProperty(o, a, clone(e[a]));
    }),
    o
  );
}
const mergeKeys = (e, o, a, s) => (
    a.forEach((i) => {
      (typeof o[i] > 'u' && s.ignoreUndefined) ||
        (i in e && e[i] !== Object.getPrototypeOf(e)
          ? defineProperty(e, i, merge$2(e[i], o[i], s))
          : defineProperty(e, i, clone(o[i])));
    }),
    e
  ),
  concatArrays = (e, o, a) => {
    let s = e.slice(0, 0),
      i = 0;
    return (
      [e, o].forEach((c) => {
        const d = [];
        for (let h = 0; h < c.length; h++)
          hasOwnProperty.call(c, h) &&
            (d.push(String(h)),
            c === e
              ? defineProperty(s, i++, c[h])
              : defineProperty(s, i++, clone(c[h])));
        s = mergeKeys(
          s,
          c,
          getEnumerableOwnPropertyKeys(c).filter((h) => !d.includes(h)),
          a
        );
      }),
      s
    );
  };
function merge$2(e, o, a) {
  return a.concatArrays && Array.isArray(e) && Array.isArray(o)
    ? concatArrays(e, o, a)
    : !isOptionObject(o) || !isOptionObject(e)
      ? clone(o)
      : mergeKeys(e, o, getEnumerableOwnPropertyKeys(o), a);
}
var mergeOptions = function (...e) {
  const o = merge$2(
    clone(defaultMergeOptions),
    (this !== globalThis$1 && this) || {},
    defaultMergeOptions
  );
  let a = { _: {} };
  for (const s of e)
    if (s !== void 0) {
      if (!isOptionObject(s))
        throw new TypeError('`' + s + '` is not an Option Object');
      a = merge$2(a, { _: s }, o);
    }
  return a._;
};
const mergeOpts = getDefaultExportFromCjs(mergeOptions),
  isReactNative = typeof navigator < 'u' && navigator.product === 'ReactNative';
function getDefaultBase() {
  return isReactNative
    ? 'http://localhost'
    : self.location
      ? self.location.protocol + '//' + self.location.host
      : '';
}
const URL$2 = self.URL,
  defaultBase$1 = getDefaultBase();
let URLWithLegacySupport$2 = class {
  constructor(o = '', a = defaultBase$1) {
    ((this.super = new URL$2(o, a)),
      (this.path = this.pathname + this.search),
      (this.auth =
        this.username && this.password
          ? this.username + ':' + this.password
          : null),
      (this.query =
        this.search && this.search.startsWith('?')
          ? this.search.slice(1)
          : null));
  }
  get hash() {
    return this.super.hash;
  }
  get host() {
    return this.super.host;
  }
  get hostname() {
    return this.super.hostname;
  }
  get href() {
    return this.super.href;
  }
  get origin() {
    return this.super.origin;
  }
  get password() {
    return this.super.password;
  }
  get pathname() {
    return this.super.pathname;
  }
  get port() {
    return this.super.port;
  }
  get protocol() {
    return this.super.protocol;
  }
  get search() {
    return this.super.search;
  }
  get searchParams() {
    return this.super.searchParams;
  }
  get username() {
    return this.super.username;
  }
  set hash(o) {
    this.super.hash = o;
  }
  set host(o) {
    this.super.host = o;
  }
  set hostname(o) {
    this.super.hostname = o;
  }
  set href(o) {
    this.super.href = o;
  }
  set password(o) {
    this.super.password = o;
  }
  set pathname(o) {
    this.super.pathname = o;
  }
  set port(o) {
    this.super.port = o;
  }
  set protocol(o) {
    this.super.protocol = o;
  }
  set search(o) {
    this.super.search = o;
  }
  set username(o) {
    this.super.username = o;
  }
  static createObjectURL(o) {
    return URL$2.createObjectURL(o);
  }
  static revokeObjectURL(o) {
    URL$2.revokeObjectURL(o);
  }
  toJSON() {
    return this.super.toJSON();
  }
  toString() {
    return this.super.toString();
  }
  format() {
    return this.toString();
  }
};
function format$4(e) {
  if (typeof e == 'string') return new URL$2(e).toString();
  if (!(e instanceof URL$2)) {
    const o = e.username && e.password ? `${e.username}:${e.password}@` : '',
      a = e.auth ? e.auth + '@' : '',
      s = e.port ? ':' + e.port : '',
      i = e.protocol ? e.protocol + '//' : '',
      c = e.host || '',
      d = e.hostname || '',
      h = e.search || (e.query ? '?' + e.query : ''),
      b = e.hash || '',
      g = e.pathname || '',
      $ = e.path || g + h;
    return `${i}${o || a}${c || d + s}${$}${b}`;
  }
}
var urlBrowser = {
  URLWithLegacySupport: URLWithLegacySupport$2,
  URLSearchParams: self.URLSearchParams,
  defaultBase: defaultBase$1,
  format: format$4,
};
const { URLWithLegacySupport: URLWithLegacySupport$1, format: format$3 } =
  urlBrowser;
var relative$1 = (e, o = {}, a = {}, s) => {
  let i = o.protocol ? o.protocol.replace(':', '') : 'http';
  i = (a[i] || s || i) + ':';
  let c;
  try {
    c = new URLWithLegacySupport$1(e);
  } catch {
    c = {};
  }
  const d = Object.assign({}, o, {
    protocol: i || c.protocol,
    host: o.host || c.host,
  });
  return new URLWithLegacySupport$1(e, format$3(d)).toString();
};
const {
    URLWithLegacySupport,
    format: format$2,
    URLSearchParams: URLSearchParams$2,
    defaultBase,
  } = urlBrowser,
  relative = relative$1;
var isoUrl = {
    URL: URLWithLegacySupport,
    URLSearchParams: URLSearchParams$2,
    format: format$2,
    relative,
    defaultBase,
  },
  anySignal$2 = { exports: {} };
function anySignal$1(e) {
  const o = new globalThis.AbortController();
  function a() {
    o.abort();
    for (const s of e)
      !s || !s.removeEventListener || s.removeEventListener('abort', a);
  }
  for (const s of e)
    if (!(!s || !s.addEventListener)) {
      if (s.aborted) {
        a();
        break;
      }
      s.addEventListener('abort', a);
    }
  return o.signal;
}
anySignal$2.exports = anySignal$1;
var anySignal_2 = (anySignal$2.exports.anySignal = anySignal$1),
  anySignalExports = anySignal$2.exports;
async function* browserReadableStreamToIt$1(e, o = {}) {
  const a = e.getReader();
  try {
    for (;;) {
      const s = await a.read();
      if (s.done) return;
      yield s.value;
    }
  } finally {
    (o.preventCancel !== !0 && a.cancel(), a.releaseLock());
  }
}
var browserReadablestreamToIt = browserReadableStreamToIt$1;
const all$2 = async (e) => {
  const o = [];
  for await (const a of e) o.push(a);
  return o;
};
var itAll = all$2;
const { fetch: fetch$1, Request, Headers } = fetch_browser,
  { TimeoutError, HTTPError } = error,
  merge$1 = mergeOptions.bind({ ignoreUndefined: !0 }),
  { URL: URL$1, URLSearchParams: URLSearchParams$1 } = isoUrl,
  anySignal = anySignalExports,
  browserReableStreamToIt = browserReadablestreamToIt,
  { isBrowser, isWebWorker } = env,
  all$1 = itAll,
  timeout = (e, o, a) => {
    if (o === void 0) return e;
    const s = Date.now(),
      i = () => Date.now() - s >= o;
    return new Promise((c, d) => {
      const h = setTimeout(() => {
          i() && (d(new TimeoutError()), a.abort());
        }, o),
        b = (g) => (_) => {
          if ((clearTimeout(h), i())) {
            d(new TimeoutError());
            return;
          }
          g(_);
        };
      e.then(b(c), b(d));
    });
  },
  defaults = { throwHttpErrors: !0, credentials: 'same-origin' };
class HTTP {
  constructor(o = {}) {
    this.opts = merge$1(defaults, o);
  }
  async fetch(o, a = {}) {
    const s = merge$1(this.opts, a),
      i = new Headers(s.headers);
    if (typeof o != 'string' && !(o instanceof URL$1 || o instanceof Request))
      throw new TypeError('`resource` must be a string, URL, or Request');
    const c = new URL$1(o.toString(), s.base),
      { searchParams: d, transformSearchParams: h, json: b } = s;
    (d &&
      (typeof h == 'function'
        ? (c.search = h(new URLSearchParams$1(s.searchParams)))
        : (c.search = new URLSearchParams$1(s.searchParams))),
      b &&
        ((s.body = JSON.stringify(s.json)),
        i.set('content-type', 'application/json')));
    const g = new AbortController(),
      $ = anySignal([g.signal, s.signal]);
    globalThis.ReadableStream != null &&
      s.body instanceof globalThis.ReadableStream &&
      (isBrowser || isWebWorker) &&
      (s.body = new Blob(await all$1(browserReableStreamToIt(s.body))));
    const _ = await timeout(
      fetch$1(c.toString(), {
        ...s,
        signal: $,
        timeout: void 0,
        headers: i,
        duplex: 'half',
      }),
      s.timeout,
      g
    );
    if (!_.ok && s.throwHttpErrors)
      throw (s.handleError && (await s.handleError(_)), new HTTPError(_));
    return (
      (_.iterator = async function* () {
        yield* fromStream(_.body);
      }),
      (_.ndjson = async function* () {
        for await (const _e of ndjson(_.iterator()))
          a.transform ? yield a.transform(_e) : yield _e;
      }),
      _
    );
  }
  post(o, a = {}) {
    return this.fetch(o, { ...a, method: 'POST' });
  }
  get(o, a = {}) {
    return this.fetch(o, { ...a, method: 'GET' });
  }
  put(o, a = {}) {
    return this.fetch(o, { ...a, method: 'PUT' });
  }
  delete(o, a = {}) {
    return this.fetch(o, { ...a, method: 'DELETE' });
  }
  options(o, a = {}) {
    return this.fetch(o, { ...a, method: 'OPTIONS' });
  }
}
const ndjson = async function* (e) {
    const o = new TextDecoder();
    let a = '';
    for await (const s of e) {
      a += o.decode(s, { stream: !0 });
      const i = a.split(/\r?\n/);
      for (let c = 0; c < i.length - 1; c++) {
        const d = i[c].trim();
        d.length > 0 && (yield JSON.parse(d));
      }
      a = i[i.length - 1];
    }
    ((a += o.decode()),
      (a = a.trim()),
      a.length !== 0 && (yield JSON.parse(a)));
  },
  fromStream = (e) => {
    if (isAsyncIterable$1(e)) return e;
    if (isNodeReadableStream(e)) {
      const o = e[Symbol.asyncIterator]();
      return {
        [Symbol.asyncIterator]() {
          return {
            next: o.next.bind(o),
            return(a) {
              return (
                e.destroy(),
                typeof o.return == 'function'
                  ? o.return()
                  : Promise.resolve({ done: !0, value: a })
              );
            },
          };
        },
      };
    }
    if (isWebReadableStream(e)) {
      const o = e.getReader();
      return (async function* () {
        try {
          for (;;) {
            const { done: a, value: s } = await o.read();
            if (a) return;
            s && (yield s);
          }
        } finally {
          o.releaseLock();
        }
      })();
    }
    throw new TypeError("Body can't be converted to AsyncIterable");
  },
  isAsyncIterable$1 = (e) =>
    typeof e == 'object' &&
    e !== null &&
    typeof e[Symbol.asyncIterator] == 'function',
  isWebReadableStream = (e) => e && typeof e.getReader == 'function',
  isNodeReadableStream = (e) =>
    Object.prototype.hasOwnProperty.call(e, 'readable') &&
    Object.prototype.hasOwnProperty.call(e, 'writable');
HTTP.HTTPError = HTTPError;
HTTP.TimeoutError = TimeoutError;
HTTP.streamToAsyncIterator = fromStream;
HTTP.post = (e, o) => new HTTP(o).post(e, o);
HTTP.get = (e, o) => new HTTP(o).get(e, o);
HTTP.put = (e, o) => new HTTP(o).put(e, o);
HTTP.delete = (e, o) => new HTTP(o).delete(e, o);
HTTP.options = (e, o) => new HTTP(o).options(e, o);
var http = HTTP;
const HTTP$1 = getDefaultExportFromCjs(http);
function equals$2(e, o) {
  if (e === o) return !0;
  if (e.byteLength !== o.byteLength) return !1;
  for (let a = 0; a < e.byteLength; a++) if (e[a] !== o[a]) return !1;
  return !0;
}
function coerce(e) {
  if (e instanceof Uint8Array && e.constructor.name === 'Uint8Array') return e;
  if (e instanceof ArrayBuffer) return new Uint8Array(e);
  if (ArrayBuffer.isView(e))
    return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
  throw new Error('Unknown type, must be binary type');
}
function fromString$1(e) {
  return new TextEncoder().encode(e);
}
function toString$1(e) {
  return new TextDecoder().decode(e);
}
function base(e, o) {
  if (e.length >= 255) throw new TypeError('Alphabet too long');
  for (var a = new Uint8Array(256), s = 0; s < a.length; s++) a[s] = 255;
  for (var i = 0; i < e.length; i++) {
    var c = e.charAt(i),
      d = c.charCodeAt(0);
    if (a[d] !== 255) throw new TypeError(c + ' is ambiguous');
    a[d] = i;
  }
  var h = e.length,
    b = e.charAt(0),
    g = Math.log(h) / Math.log(256),
    $ = Math.log(256) / Math.log(h);
  function _(j) {
    if (
      (j instanceof Uint8Array ||
        (ArrayBuffer.isView(j)
          ? (j = new Uint8Array(j.buffer, j.byteOffset, j.byteLength))
          : Array.isArray(j) && (j = Uint8Array.from(j))),
      !(j instanceof Uint8Array))
    )
      throw new TypeError('Expected Uint8Array');
    if (j.length === 0) return '';
    for (var nt = 0, lt = 0, tt = 0, et = j.length; tt !== et && j[tt] === 0; )
      (tt++, nt++);
    for (
      var rt = ((et - tt) * $ + 1) >>> 0, at = new Uint8Array(rt);
      tt !== et;

    ) {
      for (
        var ct = j[tt], dt = 0, ut = rt - 1;
        (ct !== 0 || dt < lt) && ut !== -1;
        ut--, dt++
      )
        ((ct += (256 * at[ut]) >>> 0),
          (at[ut] = ct % h >>> 0),
          (ct = (ct / h) >>> 0));
      if (ct !== 0) throw new Error('Non-zero carry');
      ((lt = dt), tt++);
    }
    for (var st = rt - lt; st !== rt && at[st] === 0; ) st++;
    for (var gt = b.repeat(nt); st < rt; ++st) gt += e.charAt(at[st]);
    return gt;
  }
  function _e(j) {
    if (typeof j != 'string') throw new TypeError('Expected String');
    if (j.length === 0) return new Uint8Array();
    var nt = 0;
    if (j[nt] !== ' ') {
      for (var lt = 0, tt = 0; j[nt] === b; ) (lt++, nt++);
      for (
        var et = ((j.length - nt) * g + 1) >>> 0, rt = new Uint8Array(et);
        j[nt];

      ) {
        var at = a[j.charCodeAt(nt)];
        if (at === 255) return;
        for (
          var ct = 0, dt = et - 1;
          (at !== 0 || ct < tt) && dt !== -1;
          dt--, ct++
        )
          ((at += (h * rt[dt]) >>> 0),
            (rt[dt] = at % 256 >>> 0),
            (at = (at / 256) >>> 0));
        if (at !== 0) throw new Error('Non-zero carry');
        ((tt = ct), nt++);
      }
      if (j[nt] !== ' ') {
        for (var ut = et - tt; ut !== et && rt[ut] === 0; ) ut++;
        for (var st = new Uint8Array(lt + (et - ut)), gt = lt; ut !== et; )
          st[gt++] = rt[ut++];
        return st;
      }
    }
  }
  function ot(j) {
    var nt = _e(j);
    if (nt) return nt;
    throw new Error(`Non-${o} character`);
  }
  return { encode: _, decodeUnsafe: _e, decode: ot };
}
var src = base,
  _brrp__multiformats_scope_baseX = src;
class Encoder {
  constructor(o, a, s) {
    pt(this, 'name');
    pt(this, 'prefix');
    pt(this, 'baseEncode');
    ((this.name = o), (this.prefix = a), (this.baseEncode = s));
  }
  encode(o) {
    if (o instanceof Uint8Array) return `${this.prefix}${this.baseEncode(o)}`;
    throw Error('Unknown type, must be binary type');
  }
}
class Decoder {
  constructor(o, a, s) {
    pt(this, 'name');
    pt(this, 'prefix');
    pt(this, 'baseDecode');
    pt(this, 'prefixCodePoint');
    ((this.name = o), (this.prefix = a));
    const i = a.codePointAt(0);
    if (i === void 0) throw new Error('Invalid prefix character');
    ((this.prefixCodePoint = i), (this.baseDecode = s));
  }
  decode(o) {
    if (typeof o == 'string') {
      if (o.codePointAt(0) !== this.prefixCodePoint)
        throw Error(
          `Unable to decode multibase string ${JSON.stringify(o)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`
        );
      return this.baseDecode(o.slice(this.prefix.length));
    } else throw Error('Can only multibase decode strings');
  }
  or(o) {
    return or(this, o);
  }
}
class ComposedDecoder {
  constructor(o) {
    pt(this, 'decoders');
    this.decoders = o;
  }
  or(o) {
    return or(this, o);
  }
  decode(o) {
    const a = o[0],
      s = this.decoders[a];
    if (s != null) return s.decode(o);
    throw RangeError(
      `Unable to decode multibase string ${JSON.stringify(o)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`
    );
  }
}
function or(e, o) {
  return new ComposedDecoder({
    ...(e.decoders ?? { [e.prefix]: e }),
    ...(o.decoders ?? { [o.prefix]: o }),
  });
}
class Codec {
  constructor(o, a, s, i) {
    pt(this, 'name');
    pt(this, 'prefix');
    pt(this, 'baseEncode');
    pt(this, 'baseDecode');
    pt(this, 'encoder');
    pt(this, 'decoder');
    ((this.name = o),
      (this.prefix = a),
      (this.baseEncode = s),
      (this.baseDecode = i),
      (this.encoder = new Encoder(o, a, s)),
      (this.decoder = new Decoder(o, a, i)));
  }
  encode(o) {
    return this.encoder.encode(o);
  }
  decode(o) {
    return this.decoder.decode(o);
  }
}
function from({ name: e, prefix: o, encode: a, decode: s }) {
  return new Codec(e, o, a, s);
}
function baseX({ name: e, prefix: o, alphabet: a }) {
  const { encode: s, decode: i } = _brrp__multiformats_scope_baseX(a, e);
  return from({ prefix: o, name: e, encode: s, decode: (c) => coerce(i(c)) });
}
function decode$5(e, o, a, s) {
  let i = e.length;
  for (; e[i - 1] === '='; ) --i;
  const c = new Uint8Array(((i * a) / 8) | 0);
  let d = 0,
    h = 0,
    b = 0;
  for (let g = 0; g < i; ++g) {
    const $ = o[e[g]];
    if ($ === void 0) throw new SyntaxError(`Non-${s} character`);
    ((h = (h << a) | $),
      (d += a),
      d >= 8 && ((d -= 8), (c[b++] = 255 & (h >> d))));
  }
  if (d >= a || 255 & (h << (8 - d)))
    throw new SyntaxError('Unexpected end of data');
  return c;
}
function encode$2(e, o, a) {
  const s = o[o.length - 1] === '=',
    i = (1 << a) - 1;
  let c = '',
    d = 0,
    h = 0;
  for (let b = 0; b < e.length; ++b)
    for (h = (h << 8) | e[b], d += 8; d > a; )
      ((d -= a), (c += o[i & (h >> d)]));
  if ((d !== 0 && (c += o[i & (h << (a - d))]), s))
    for (; (c.length * a) & 7; ) c += '=';
  return c;
}
function createAlphabetIdx(e) {
  const o = {};
  for (let a = 0; a < e.length; ++a) o[e[a]] = a;
  return o;
}
function rfc4648({ name: e, prefix: o, bitsPerChar: a, alphabet: s }) {
  const i = createAlphabetIdx(s);
  return from({
    prefix: o,
    name: e,
    encode(c) {
      return encode$2(c, s, a);
    },
    decode(c) {
      return decode$5(c, i, a, e);
    },
  });
}
const base10 = baseX({ prefix: '9', name: 'base10', alphabet: '0123456789' }),
  base10$1 = Object.freeze(
    Object.defineProperty({ __proto__: null, base10 }, Symbol.toStringTag, {
      value: 'Module',
    })
  ),
  base16 = rfc4648({
    prefix: 'f',
    name: 'base16',
    alphabet: '0123456789abcdef',
    bitsPerChar: 4,
  }),
  base16upper = rfc4648({
    prefix: 'F',
    name: 'base16upper',
    alphabet: '0123456789ABCDEF',
    bitsPerChar: 4,
  }),
  base16$1 = Object.freeze(
    Object.defineProperty(
      { __proto__: null, base16, base16upper },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  base2 = rfc4648({
    prefix: '0',
    name: 'base2',
    alphabet: '01',
    bitsPerChar: 1,
  }),
  base2$1 = Object.freeze(
    Object.defineProperty({ __proto__: null, base2 }, Symbol.toStringTag, {
      value: 'Module',
    })
  ),
  alphabet = Array.from(
    '🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂'
  ),
  alphabetBytesToChars = alphabet.reduce((e, o, a) => ((e[a] = o), e), []),
  alphabetCharsToBytes = alphabet.reduce((e, o, a) => {
    const s = o.codePointAt(0);
    if (s == null) throw new Error(`Invalid character: ${o}`);
    return ((e[s] = a), e);
  }, []);
function encode$1(e) {
  return e.reduce((o, a) => ((o += alphabetBytesToChars[a]), o), '');
}
function decode$4(e) {
  const o = [];
  for (const a of e) {
    const s = a.codePointAt(0);
    if (s == null) throw new Error(`Invalid character: ${a}`);
    const i = alphabetCharsToBytes[s];
    if (i == null) throw new Error(`Non-base256emoji character: ${a}`);
    o.push(i);
  }
  return new Uint8Array(o);
}
const base256emoji = from({
    prefix: '🚀',
    name: 'base256emoji',
    encode: encode$1,
    decode: decode$4,
  }),
  base256emoji$1 = Object.freeze(
    Object.defineProperty(
      { __proto__: null, base256emoji },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  base32 = rfc4648({
    prefix: 'b',
    name: 'base32',
    alphabet: 'abcdefghijklmnopqrstuvwxyz234567',
    bitsPerChar: 5,
  }),
  base32upper = rfc4648({
    prefix: 'B',
    name: 'base32upper',
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
    bitsPerChar: 5,
  }),
  base32pad = rfc4648({
    prefix: 'c',
    name: 'base32pad',
    alphabet: 'abcdefghijklmnopqrstuvwxyz234567=',
    bitsPerChar: 5,
  }),
  base32padupper = rfc4648({
    prefix: 'C',
    name: 'base32padupper',
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=',
    bitsPerChar: 5,
  }),
  base32hex = rfc4648({
    prefix: 'v',
    name: 'base32hex',
    alphabet: '0123456789abcdefghijklmnopqrstuv',
    bitsPerChar: 5,
  }),
  base32hexupper = rfc4648({
    prefix: 'V',
    name: 'base32hexupper',
    alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUV',
    bitsPerChar: 5,
  }),
  base32hexpad = rfc4648({
    prefix: 't',
    name: 'base32hexpad',
    alphabet: '0123456789abcdefghijklmnopqrstuv=',
    bitsPerChar: 5,
  }),
  base32hexpadupper = rfc4648({
    prefix: 'T',
    name: 'base32hexpadupper',
    alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUV=',
    bitsPerChar: 5,
  }),
  base32z = rfc4648({
    prefix: 'h',
    name: 'base32z',
    alphabet: 'ybndrfg8ejkmcpqxot1uwisza345h769',
    bitsPerChar: 5,
  }),
  base32$1 = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        base32,
        base32hex,
        base32hexpad,
        base32hexpadupper,
        base32hexupper,
        base32pad,
        base32padupper,
        base32upper,
        base32z,
      },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  base36 = baseX({
    prefix: 'k',
    name: 'base36',
    alphabet: '0123456789abcdefghijklmnopqrstuvwxyz',
  }),
  base36upper = baseX({
    prefix: 'K',
    name: 'base36upper',
    alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  }),
  base36$1 = Object.freeze(
    Object.defineProperty(
      { __proto__: null, base36, base36upper },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  base58btc = baseX({
    name: 'base58btc',
    prefix: 'z',
    alphabet: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
  }),
  base58flickr = baseX({
    name: 'base58flickr',
    prefix: 'Z',
    alphabet: '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ',
  }),
  base58 = Object.freeze(
    Object.defineProperty(
      { __proto__: null, base58btc, base58flickr },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  base64$2 = rfc4648({
    prefix: 'm',
    name: 'base64',
    alphabet:
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    bitsPerChar: 6,
  }),
  base64pad = rfc4648({
    prefix: 'M',
    name: 'base64pad',
    alphabet:
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    bitsPerChar: 6,
  }),
  base64url = rfc4648({
    prefix: 'u',
    name: 'base64url',
    alphabet:
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
    bitsPerChar: 6,
  }),
  base64urlpad = rfc4648({
    prefix: 'U',
    name: 'base64urlpad',
    alphabet:
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=',
    bitsPerChar: 6,
  }),
  base64$3 = Object.freeze(
    Object.defineProperty(
      { __proto__: null, base64: base64$2, base64pad, base64url, base64urlpad },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  base8 = rfc4648({
    prefix: '7',
    name: 'base8',
    alphabet: '01234567',
    bitsPerChar: 3,
  }),
  base8$1 = Object.freeze(
    Object.defineProperty({ __proto__: null, base8 }, Symbol.toStringTag, {
      value: 'Module',
    })
  ),
  identity = from({
    prefix: '\0',
    name: 'identity',
    encode: (e) => toString$1(e),
    decode: (e) => fromString$1(e),
  }),
  identityBase = Object.freeze(
    Object.defineProperty({ __proto__: null, identity }, Symbol.toStringTag, {
      value: 'Module',
    })
  );
new TextEncoder();
new TextDecoder();
var encode_1 = encode,
  MSB$1 = 128,
  REST$1 = 127,
  MSBALL = ~REST$1,
  INT = Math.pow(2, 31);
function encode(e, o, a) {
  ((o = o || []), (a = a || 0));
  for (var s = a; e >= INT; ) ((o[a++] = (e & 255) | MSB$1), (e /= 128));
  for (; e & MSBALL; ) ((o[a++] = (e & 255) | MSB$1), (e >>>= 7));
  return ((o[a] = e | 0), (encode.bytes = a - s + 1), o);
}
var decode$3 = read,
  MSB$1$1 = 128,
  REST$1$1 = 127;
function read(e, s) {
  var a = 0,
    s = s || 0,
    i = 0,
    c = s,
    d,
    h = e.length;
  do {
    if (c >= h)
      throw ((read.bytes = 0), new RangeError('Could not decode varint'));
    ((d = e[c++]),
      (a += i < 28 ? (d & REST$1$1) << i : (d & REST$1$1) * Math.pow(2, i)),
      (i += 7));
  } while (d >= MSB$1$1);
  return ((read.bytes = c - s), a);
}
var N1$1 = Math.pow(2, 7),
  N2$1 = Math.pow(2, 14),
  N3$1 = Math.pow(2, 21),
  N4$1 = Math.pow(2, 28),
  N5$1 = Math.pow(2, 35),
  N6$1 = Math.pow(2, 42),
  N7$1 = Math.pow(2, 49),
  N8 = Math.pow(2, 56),
  N9 = Math.pow(2, 63),
  length = function (e) {
    return e < N1$1
      ? 1
      : e < N2$1
        ? 2
        : e < N3$1
          ? 3
          : e < N4$1
            ? 4
            : e < N5$1
              ? 5
              : e < N6$1
                ? 6
                : e < N7$1
                  ? 7
                  : e < N8
                    ? 8
                    : e < N9
                      ? 9
                      : 10;
  },
  varint = { encode: encode_1, decode: decode$3, encodingLength: length },
  _brrp_varint = varint;
function decode$2(e, o = 0) {
  return [_brrp_varint.decode(e, o), _brrp_varint.decode.bytes];
}
function encodeTo(e, o, a = 0) {
  return (_brrp_varint.encode(e, o, a), o);
}
function encodingLength$1(e) {
  return _brrp_varint.encodingLength(e);
}
function create$3(e, o) {
  const a = o.byteLength,
    s = encodingLength$1(e),
    i = s + encodingLength$1(a),
    c = new Uint8Array(i + a);
  return (
    encodeTo(e, c, 0),
    encodeTo(a, c, s),
    c.set(o, i),
    new Digest(e, a, o, c)
  );
}
function decode$1(e) {
  const o = coerce(e),
    [a, s] = decode$2(o),
    [i, c] = decode$2(o.subarray(s)),
    d = o.subarray(s + c);
  if (d.byteLength !== i) throw new Error('Incorrect length');
  return new Digest(a, i, d, o);
}
function equals$1(e, o) {
  if (e === o) return !0;
  {
    const a = o;
    return (
      e.code === a.code &&
      e.size === a.size &&
      a.bytes instanceof Uint8Array &&
      equals$2(e.bytes, a.bytes)
    );
  }
}
class Digest {
  constructor(o, a, s, i) {
    pt(this, 'code');
    pt(this, 'size');
    pt(this, 'digest');
    pt(this, 'bytes');
    ((this.code = o), (this.size = a), (this.digest = s), (this.bytes = i));
  }
}
function format$1(e, o) {
  const { bytes: a, version: s } = e;
  switch (s) {
    case 0:
      return toStringV0(a, baseCache(e), o ?? base58btc.encoder);
    default:
      return toStringV1(a, baseCache(e), o ?? base32.encoder);
  }
}
const cache = new WeakMap();
function baseCache(e) {
  const o = cache.get(e);
  if (o == null) {
    const a = new Map();
    return (cache.set(e, a), a);
  }
  return o;
}
var Zt;
class CID {
  constructor(o, a, s, i) {
    pt(this, 'code');
    pt(this, 'version');
    pt(this, 'multihash');
    pt(this, 'bytes');
    pt(this, '/');
    pt(this, Zt, 'CID');
    ((this.code = a),
      (this.version = o),
      (this.multihash = s),
      (this.bytes = i),
      (this['/'] = i));
  }
  get asCID() {
    return this;
  }
  get byteOffset() {
    return this.bytes.byteOffset;
  }
  get byteLength() {
    return this.bytes.byteLength;
  }
  toV0() {
    switch (this.version) {
      case 0:
        return this;
      case 1: {
        const { code: o, multihash: a } = this;
        if (o !== DAG_PB_CODE)
          throw new Error('Cannot convert a non dag-pb CID to CIDv0');
        if (a.code !== SHA_256_CODE)
          throw new Error('Cannot convert non sha2-256 multihash CID to CIDv0');
        return CID.createV0(a);
      }
      default:
        throw Error(
          `Can not convert CID version ${this.version} to version 0. This is a bug please report`
        );
    }
  }
  toV1() {
    switch (this.version) {
      case 0: {
        const { code: o, digest: a } = this.multihash,
          s = create$3(o, a);
        return CID.createV1(this.code, s);
      }
      case 1:
        return this;
      default:
        throw Error(
          `Can not convert CID version ${this.version} to version 1. This is a bug please report`
        );
    }
  }
  equals(o) {
    return CID.equals(this, o);
  }
  static equals(o, a) {
    const s = a;
    return (
      s != null &&
      o.code === s.code &&
      o.version === s.version &&
      equals$1(o.multihash, s.multihash)
    );
  }
  toString(o) {
    return format$1(this, o);
  }
  toJSON() {
    return { '/': format$1(this) };
  }
  link() {
    return this;
  }
  [((Zt = Symbol.toStringTag), Symbol.for('nodejs.util.inspect.custom'))]() {
    return `CID(${this.toString()})`;
  }
  static asCID(o) {
    if (o == null) return null;
    const a = o;
    if (a instanceof CID) return a;
    if ((a['/'] != null && a['/'] === a.bytes) || a.asCID === a) {
      const { version: s, code: i, multihash: c, bytes: d } = a;
      return new CID(s, i, c, d ?? encodeCID$1(s, i, c.bytes));
    } else if (a[cidSymbol] === !0) {
      const { version: s, multihash: i, code: c } = a,
        d = decode$1(i);
      return CID.create(s, c, d);
    } else return null;
  }
  static create(o, a, s) {
    if (typeof a != 'number')
      throw new Error('String codecs are no longer supported');
    if (!(s.bytes instanceof Uint8Array)) throw new Error('Invalid digest');
    switch (o) {
      case 0: {
        if (a !== DAG_PB_CODE)
          throw new Error(
            `Version 0 CID must use dag-pb (code: ${DAG_PB_CODE}) block encoding`
          );
        return new CID(o, a, s, s.bytes);
      }
      case 1: {
        const i = encodeCID$1(o, a, s.bytes);
        return new CID(o, a, s, i);
      }
      default:
        throw new Error('Invalid version');
    }
  }
  static createV0(o) {
    return CID.create(0, DAG_PB_CODE, o);
  }
  static createV1(o, a) {
    return CID.create(1, o, a);
  }
  static decode(o) {
    const [a, s] = CID.decodeFirst(o);
    if (s.length !== 0) throw new Error('Incorrect length');
    return a;
  }
  static decodeFirst(o) {
    const a = CID.inspectBytes(o),
      s = a.size - a.multihashSize,
      i = coerce(o.subarray(s, s + a.multihashSize));
    if (i.byteLength !== a.multihashSize) throw new Error('Incorrect length');
    const c = i.subarray(a.multihashSize - a.digestSize),
      d = new Digest(a.multihashCode, a.digestSize, c, i);
    return [
      a.version === 0 ? CID.createV0(d) : CID.createV1(a.codec, d),
      o.subarray(a.size),
    ];
  }
  static inspectBytes(o) {
    let a = 0;
    const s = () => {
      const [_, _e] = decode$2(o.subarray(a));
      return ((a += _e), _);
    };
    let i = s(),
      c = DAG_PB_CODE;
    if ((i === 18 ? ((i = 0), (a = 0)) : (c = s()), i !== 0 && i !== 1))
      throw new RangeError(`Invalid CID version ${i}`);
    const d = a,
      h = s(),
      b = s(),
      g = a + b,
      $ = g - d;
    return {
      version: i,
      codec: c,
      multihashCode: h,
      digestSize: b,
      multihashSize: $,
      size: g,
    };
  }
  static parse(o, a) {
    const [s, i] = parseCIDtoBytes(o, a),
      c = CID.decode(i);
    if (c.version === 0 && o[0] !== 'Q')
      throw Error('Version 0 CID string must not include multibase prefix');
    return (baseCache(c).set(s, o), c);
  }
}
function parseCIDtoBytes(e, o) {
  switch (e[0]) {
    case 'Q': {
      const a = o ?? base58btc;
      return [base58btc.prefix, a.decode(`${base58btc.prefix}${e}`)];
    }
    case base58btc.prefix: {
      const a = o ?? base58btc;
      return [base58btc.prefix, a.decode(e)];
    }
    case base32.prefix: {
      const a = o ?? base32;
      return [base32.prefix, a.decode(e)];
    }
    case base36.prefix: {
      const a = o ?? base36;
      return [base36.prefix, a.decode(e)];
    }
    default: {
      if (o == null)
        throw Error(
          'To parse non base32, base36 or base58btc encoded CID multibase decoder must be provided'
        );
      return [e[0], o.decode(e)];
    }
  }
}
function toStringV0(e, o, a) {
  const { prefix: s } = a;
  if (s !== base58btc.prefix)
    throw Error(`Cannot string encode V0 in ${a.name} encoding`);
  const i = o.get(s);
  if (i == null) {
    const c = a.encode(e).slice(1);
    return (o.set(s, c), c);
  } else return i;
}
function toStringV1(e, o, a) {
  const { prefix: s } = a,
    i = o.get(s);
  if (i == null) {
    const c = a.encode(e);
    return (o.set(s, c), c);
  } else return i;
}
const DAG_PB_CODE = 112,
  SHA_256_CODE = 18;
function encodeCID$1(e, o, a) {
  const s = encodingLength$1(e),
    i = s + encodingLength$1(o),
    c = new Uint8Array(i + a.byteLength);
  return (encodeTo(e, c, 0), encodeTo(o, c, s), c.set(a, i), c);
}
const cidSymbol = Symbol.for('@ipld/js-cid/CID'),
  bases = {
    ...identityBase,
    ...base2$1,
    ...base8$1,
    ...base10$1,
    ...base16$1,
    ...base32$1,
    ...base36$1,
    ...base58,
    ...base64$3,
    ...base256emoji$1,
  };
function allocUnsafe(e = 0) {
  return new Uint8Array(e);
}
function createCodec(e, o, a, s) {
  return {
    name: e,
    prefix: o,
    encoder: { name: e, prefix: o, encode: a },
    decoder: { decode: s },
  };
}
const string = createCodec(
    'utf8',
    'u',
    (e) => 'u' + new TextDecoder('utf8').decode(e),
    (e) => new TextEncoder().encode(e.substring(1))
  ),
  ascii = createCodec(
    'ascii',
    'a',
    (e) => {
      let o = 'a';
      for (let a = 0; a < e.length; a++) o += String.fromCharCode(e[a]);
      return o;
    },
    (e) => {
      e = e.substring(1);
      const o = allocUnsafe(e.length);
      for (let a = 0; a < e.length; a++) o[a] = e.charCodeAt(a);
      return o;
    }
  ),
  BASES = {
    utf8: string,
    'utf-8': string,
    hex: bases.base16,
    latin1: ascii,
    ascii,
    binary: ascii,
    ...bases,
  };
function toString(e, o = 'utf8') {
  const a = BASES[o];
  if (a == null) throw new Error(`Unsupported encoding "${o}"`);
  return a.encoder.encode(e).substring(1);
}
class InvalidMultiaddrError extends Error {
  constructor() {
    super(...arguments);
    pt(this, 'name', 'InvalidMultiaddrError');
  }
}
pt(InvalidMultiaddrError, 'name', 'InvalidMultiaddrError');
class ValidationError extends Error {
  constructor() {
    super(...arguments);
    pt(this, 'name', 'ValidationError');
  }
}
pt(ValidationError, 'name', 'ValidationError');
class InvalidParametersError extends Error {
  constructor() {
    super(...arguments);
    pt(this, 'name', 'InvalidParametersError');
  }
}
pt(InvalidParametersError, 'name', 'InvalidParametersError');
class UnknownProtocolError extends Error {
  constructor() {
    super(...arguments);
    pt(this, 'name', 'UnknownProtocolError');
  }
}
pt(UnknownProtocolError, 'name', 'UnknownProtocolError');
function equals(e, o) {
  if (e === o) return !0;
  if (e.byteLength !== o.byteLength) return !1;
  for (let a = 0; a < e.byteLength; a++) if (e[a] !== o[a]) return !1;
  return !0;
}
function fromString(e, o = 'utf8') {
  const a = BASES[o];
  if (a == null) throw new Error(`Unsupported encoding "${o}"`);
  return a.decoder.decode(`${a.prefix}${e}`);
}
const N1 = Math.pow(2, 7),
  N2 = Math.pow(2, 14),
  N3 = Math.pow(2, 21),
  N4 = Math.pow(2, 28),
  N5 = Math.pow(2, 35),
  N6 = Math.pow(2, 42),
  N7 = Math.pow(2, 49),
  MSB = 128,
  REST = 127;
function encodingLength(e) {
  if (e < N1) return 1;
  if (e < N2) return 2;
  if (e < N3) return 3;
  if (e < N4) return 4;
  if (e < N5) return 5;
  if (e < N6) return 6;
  if (e < N7) return 7;
  if (Number.MAX_SAFE_INTEGER != null && e > Number.MAX_SAFE_INTEGER)
    throw new RangeError('Could not encode varint');
  return 8;
}
function encodeUint8Array(e, o, a = 0) {
  switch (encodingLength(e)) {
    case 8:
      ((o[a++] = (e & 255) | MSB), (e /= 128));
    case 7:
      ((o[a++] = (e & 255) | MSB), (e /= 128));
    case 6:
      ((o[a++] = (e & 255) | MSB), (e /= 128));
    case 5:
      ((o[a++] = (e & 255) | MSB), (e /= 128));
    case 4:
      ((o[a++] = (e & 255) | MSB), (e >>>= 7));
    case 3:
      ((o[a++] = (e & 255) | MSB), (e >>>= 7));
    case 2:
      ((o[a++] = (e & 255) | MSB), (e >>>= 7));
    case 1: {
      ((o[a++] = e & 255), (e >>>= 7));
      break;
    }
    default:
      throw new Error('unreachable');
  }
  return o;
}
function decodeUint8Array(e, o) {
  let a = e[o],
    s = 0;
  if (
    ((s += a & REST),
    a < MSB ||
      ((a = e[o + 1]), (s += (a & REST) << 7), a < MSB) ||
      ((a = e[o + 2]), (s += (a & REST) << 14), a < MSB) ||
      ((a = e[o + 3]), (s += (a & REST) << 21), a < MSB) ||
      ((a = e[o + 4]), (s += (a & REST) * N4), a < MSB) ||
      ((a = e[o + 5]), (s += (a & REST) * N5), a < MSB) ||
      ((a = e[o + 6]), (s += (a & REST) * N6), a < MSB) ||
      ((a = e[o + 7]), (s += (a & REST) * N7), a < MSB))
  )
    return s;
  throw new RangeError('Could not decode varint');
}
function decodeUint8ArrayList(e, o) {
  let a = e.get(o),
    s = 0;
  if (
    ((s += a & REST),
    a < MSB ||
      ((a = e.get(o + 1)), (s += (a & REST) << 7), a < MSB) ||
      ((a = e.get(o + 2)), (s += (a & REST) << 14), a < MSB) ||
      ((a = e.get(o + 3)), (s += (a & REST) << 21), a < MSB) ||
      ((a = e.get(o + 4)), (s += (a & REST) * N4), a < MSB) ||
      ((a = e.get(o + 5)), (s += (a & REST) * N5), a < MSB) ||
      ((a = e.get(o + 6)), (s += (a & REST) * N6), a < MSB) ||
      ((a = e.get(o + 7)), (s += (a & REST) * N7), a < MSB))
  )
    return s;
  throw new RangeError('Could not decode varint');
}
function decode(e, o = 0) {
  return e instanceof Uint8Array
    ? decodeUint8Array(e, o)
    : decodeUint8ArrayList(e, o);
}
function asUint8Array(e) {
  return e;
}
function concat(e, o) {
  o == null && (o = e.reduce((i, c) => i + c.length, 0));
  const a = allocUnsafe(o);
  let s = 0;
  for (const i of e) (a.set(i, s), (s += i.length));
  return a;
}
const CODE_IP4 = 4,
  CODE_TCP = 6,
  CODE_UDP = 273,
  CODE_DCCP = 33,
  CODE_IP6 = 41,
  CODE_IP6ZONE = 42,
  CODE_IPCIDR = 43,
  CODE_DNS = 53,
  CODE_DNS4 = 54,
  CODE_DNS6 = 55,
  CODE_DNSADDR = 56,
  CODE_SCTP = 132,
  CODE_UDT = 301,
  CODE_UTP = 302,
  CODE_UNIX = 400,
  CODE_P2P = 421,
  CODE_ONION = 444,
  CODE_ONION3 = 445,
  CODE_GARLIC64 = 446,
  CODE_GARLIC32 = 447,
  CODE_TLS = 448,
  CODE_SNI = 449,
  CODE_NOISE = 454,
  CODE_QUIC = 460,
  CODE_QUIC_V1 = 461,
  CODE_WEBTRANSPORT = 465,
  CODE_CERTHASH = 466,
  CODE_HTTP = 480,
  CODE_HTTP_PATH = 481,
  CODE_HTTPS = 443,
  CODE_WS = 477,
  CODE_WSS = 478,
  CODE_P2P_WEBSOCKET_STAR = 479,
  CODE_P2P_STARDUST = 277,
  CODE_P2P_WEBRTC_STAR = 275,
  CODE_P2P_WEBRTC_DIRECT = 276,
  CODE_WEBRTC_DIRECT = 280,
  CODE_WEBRTC = 281,
  CODE_P2P_CIRCUIT = 290,
  CODE_MEMORY = 777;
function bytesToString(e) {
  return (o) => toString(o, e);
}
function stringToBytes(e) {
  return (o) => fromString(o, e);
}
function bytes2port(e) {
  return new DataView(e.buffer).getUint16(e.byteOffset).toString();
}
function port2bytes(e) {
  const o = new ArrayBuffer(2);
  return (
    new DataView(o).setUint16(0, typeof e == 'string' ? parseInt(e) : e),
    new Uint8Array(o)
  );
}
function onion2bytes(e) {
  const o = e.split(':');
  if (o.length !== 2)
    throw new Error(
      `failed to parse onion addr: ["'${o.join('", "')}'"]' does not contain a port number`
    );
  if (o[0].length !== 16)
    throw new Error(
      `failed to parse onion addr: ${o[0]} not a Tor onion address.`
    );
  const a = fromString(o[0], 'base32'),
    s = parseInt(o[1], 10);
  if (s < 1 || s > 65536)
    throw new Error('Port number is not in range(1, 65536)');
  const i = port2bytes(s);
  return concat([a, i], a.length + i.length);
}
function onion32bytes(e) {
  const o = e.split(':');
  if (o.length !== 2)
    throw new Error(
      `failed to parse onion addr: ["'${o.join('", "')}'"]' does not contain a port number`
    );
  if (o[0].length !== 56)
    throw new Error(
      `failed to parse onion addr: ${o[0]} not a Tor onion3 address.`
    );
  const a = base32.decode(`b${o[0]}`),
    s = parseInt(o[1], 10);
  if (s < 1 || s > 65536)
    throw new Error('Port number is not in range(1, 65536)');
  const i = port2bytes(s);
  return concat([a, i], a.length + i.length);
}
function bytes2onion(e) {
  const o = e.subarray(0, e.length - 2),
    a = e.subarray(e.length - 2),
    s = toString(o, 'base32'),
    i = bytes2port(a);
  return `${s}:${i}`;
}
const ip4ToBytes = function (e) {
    e = e.toString().trim();
    const o = new Uint8Array(4);
    return (
      e.split(/\./g).forEach((a, s) => {
        const i = parseInt(a, 10);
        if (isNaN(i) || i < 0 || i > 255)
          throw new InvalidMultiaddrError('Invalid byte value in IP address');
        o[s] = i;
      }),
      o
    );
  },
  ip6ToBytes = function (e) {
    let o = 0;
    e = e.toString().trim();
    const a = e.split(':', 8);
    let s;
    for (s = 0; s < a.length; s++) {
      const c = isIPv4(a[s]);
      let d;
      (c &&
        ((d = ip4ToBytes(a[s])), (a[s] = toString(d.subarray(0, 2), 'base16'))),
        d != null &&
          ++s < 8 &&
          a.splice(s, 0, toString(d.subarray(2, 4), 'base16')));
    }
    if (a[0] === '') for (; a.length < 8; ) a.unshift('0');
    else if (a[a.length - 1] === '') for (; a.length < 8; ) a.push('0');
    else if (a.length < 8) {
      for (s = 0; s < a.length && a[s] !== ''; s++);
      const c = [s, 1];
      for (s = 9 - a.length; s > 0; s--) c.push('0');
      a.splice.apply(a, c);
    }
    const i = new Uint8Array(o + 16);
    for (s = 0; s < a.length; s++) {
      a[s] === '' && (a[s] = '0');
      const c = parseInt(a[s], 16);
      if (isNaN(c) || c < 0 || c > 65535)
        throw new InvalidMultiaddrError('Invalid byte value in IP address');
      ((i[o++] = (c >> 8) & 255), (i[o++] = c & 255));
    }
    return i;
  },
  ip4ToString = function (e) {
    if (e.byteLength !== 4)
      throw new InvalidMultiaddrError('IPv4 address was incorrect length');
    const o = [];
    for (let a = 0; a < e.byteLength; a++) o.push(e[a]);
    return o.join('.');
  },
  ip6ToString = function (e) {
    if (e.byteLength !== 16)
      throw new InvalidMultiaddrError('IPv6 address was incorrect length');
    const o = [];
    for (let s = 0; s < e.byteLength; s += 2) {
      const i = e[s],
        c = e[s + 1],
        d = `${i.toString(16).padStart(2, '0')}${c.toString(16).padStart(2, '0')}`;
      o.push(d);
    }
    const a = o.join(':');
    try {
      const s = new URL(`http://[${a}]`);
      return s.hostname.substring(1, s.hostname.length - 1);
    } catch {
      throw new InvalidMultiaddrError(`Invalid IPv6 address "${a}"`);
    }
  };
function ip6StringToValue(e) {
  try {
    const o = new URL(`http://[${e}]`);
    return o.hostname.substring(1, o.hostname.length - 1);
  } catch {
    throw new InvalidMultiaddrError(`Invalid IPv6 address "${e}"`);
  }
}
const decoders = Object.values(bases).map((e) => e.decoder),
  anybaseDecoder = (function () {
    let e = decoders[0].or(decoders[1]);
    return (decoders.slice(2).forEach((o) => (e = e.or(o))), e);
  })();
function mb2bytes(e) {
  return anybaseDecoder.decode(e);
}
function bytes2mb(e) {
  return (o) => e.encoder.encode(o);
}
function integer(e) {
  if (parseInt(e).toString() !== e)
    throw new ValidationError('Value must be an integer');
}
function positive(e) {
  if (e < 0)
    throw new ValidationError('Value must be a positive integer, or zero');
}
function maxValue(e) {
  return (o) => {
    if (o > e)
      throw new ValidationError(`Value must be smaller than or equal to ${e}`);
  };
}
function validate$1(...e) {
  return (o) => {
    for (const a of e) a(o);
  };
}
const validatePort = validate$1(integer, positive, maxValue(65535)),
  V = -1;
class Registry {
  constructor() {
    pt(this, 'protocolsByCode', new Map());
    pt(this, 'protocolsByName', new Map());
  }
  getProtocol(o) {
    let a;
    if (
      (typeof o == 'string'
        ? (a = this.protocolsByName.get(o))
        : (a = this.protocolsByCode.get(o)),
      a == null)
    )
      throw new UnknownProtocolError(`Protocol ${o} was unknown`);
    return a;
  }
  addProtocol(o) {
    var a;
    (this.protocolsByCode.set(o.code, o),
      this.protocolsByName.set(o.name, o),
      (a = o.aliases) == null ||
        a.forEach((s) => {
          this.protocolsByName.set(s, o);
        }));
  }
  removeProtocol(o) {
    var s;
    const a = this.protocolsByCode.get(o);
    a != null &&
      (this.protocolsByCode.delete(a.code),
      this.protocolsByName.delete(a.name),
      (s = a.aliases) == null ||
        s.forEach((i) => {
          this.protocolsByName.delete(i);
        }));
  }
}
const registry = new Registry(),
  codecs = [
    {
      code: CODE_IP4,
      name: 'ip4',
      size: 32,
      valueToBytes: ip4ToBytes,
      bytesToValue: ip4ToString,
      validate: (e) => {
        if (!isIPv4(e))
          throw new ValidationError(`Invalid IPv4 address "${e}"`);
      },
    },
    {
      code: CODE_TCP,
      name: 'tcp',
      size: 16,
      valueToBytes: port2bytes,
      bytesToValue: bytes2port,
      validate: validatePort,
    },
    {
      code: CODE_UDP,
      name: 'udp',
      size: 16,
      valueToBytes: port2bytes,
      bytesToValue: bytes2port,
      validate: validatePort,
    },
    {
      code: CODE_DCCP,
      name: 'dccp',
      size: 16,
      valueToBytes: port2bytes,
      bytesToValue: bytes2port,
      validate: validatePort,
    },
    {
      code: CODE_IP6,
      name: 'ip6',
      size: 128,
      valueToBytes: ip6ToBytes,
      bytesToValue: ip6ToString,
      stringToValue: ip6StringToValue,
      validate: (e) => {
        if (!isIPv6(e))
          throw new ValidationError(`Invalid IPv6 address "${e}"`);
      },
    },
    { code: CODE_IP6ZONE, name: 'ip6zone', size: V },
    {
      code: CODE_IPCIDR,
      name: 'ipcidr',
      size: 8,
      bytesToValue: bytesToString('base10'),
      valueToBytes: stringToBytes('base10'),
    },
    { code: CODE_DNS, name: 'dns', size: V, resolvable: !0 },
    { code: CODE_DNS4, name: 'dns4', size: V, resolvable: !0 },
    { code: CODE_DNS6, name: 'dns6', size: V, resolvable: !0 },
    { code: CODE_DNSADDR, name: 'dnsaddr', size: V, resolvable: !0 },
    {
      code: CODE_SCTP,
      name: 'sctp',
      size: 16,
      valueToBytes: port2bytes,
      bytesToValue: bytes2port,
      validate: validatePort,
    },
    { code: CODE_UDT, name: 'udt' },
    { code: CODE_UTP, name: 'utp' },
    {
      code: CODE_UNIX,
      name: 'unix',
      size: V,
      path: !0,
      stringToValue: (e) => decodeURIComponent(e),
      valueToString: (e) => encodeURIComponent(e),
    },
    {
      code: CODE_P2P,
      name: 'p2p',
      aliases: ['ipfs'],
      size: V,
      bytesToValue: bytesToString('base58btc'),
      valueToBytes: (e) =>
        e.startsWith('Q') || e.startsWith('1')
          ? stringToBytes('base58btc')(e)
          : CID.parse(e).multihash.bytes,
    },
    {
      code: CODE_ONION,
      name: 'onion',
      size: 96,
      bytesToValue: bytes2onion,
      valueToBytes: onion2bytes,
    },
    {
      code: CODE_ONION3,
      name: 'onion3',
      size: 296,
      bytesToValue: bytes2onion,
      valueToBytes: onion32bytes,
    },
    { code: CODE_GARLIC64, name: 'garlic64', size: V },
    { code: CODE_GARLIC32, name: 'garlic32', size: V },
    { code: CODE_TLS, name: 'tls' },
    { code: CODE_SNI, name: 'sni', size: V },
    { code: CODE_NOISE, name: 'noise' },
    { code: CODE_QUIC, name: 'quic' },
    { code: CODE_QUIC_V1, name: 'quic-v1' },
    { code: CODE_WEBTRANSPORT, name: 'webtransport' },
    {
      code: CODE_CERTHASH,
      name: 'certhash',
      size: V,
      bytesToValue: bytes2mb(base64url),
      valueToBytes: mb2bytes,
    },
    { code: CODE_HTTP, name: 'http' },
    {
      code: CODE_HTTP_PATH,
      name: 'http-path',
      size: V,
      stringToValue: (e) => `/${decodeURIComponent(e)}`,
      valueToString: (e) => encodeURIComponent(e.substring(1)),
    },
    { code: CODE_HTTPS, name: 'https' },
    { code: CODE_WS, name: 'ws' },
    { code: CODE_WSS, name: 'wss' },
    { code: CODE_P2P_WEBSOCKET_STAR, name: 'p2p-websocket-star' },
    { code: CODE_P2P_STARDUST, name: 'p2p-stardust' },
    { code: CODE_P2P_WEBRTC_STAR, name: 'p2p-webrtc-star' },
    { code: CODE_P2P_WEBRTC_DIRECT, name: 'p2p-webrtc-direct' },
    { code: CODE_WEBRTC_DIRECT, name: 'webrtc-direct' },
    { code: CODE_WEBRTC, name: 'webrtc' },
    { code: CODE_P2P_CIRCUIT, name: 'p2p-circuit' },
    { code: CODE_MEMORY, name: 'memory', size: V },
  ];
codecs.forEach((e) => {
  registry.addProtocol(e);
});
function bytesToComponents(e) {
  var s;
  const o = [];
  let a = 0;
  for (; a < e.length; ) {
    const i = decode(e, a),
      c = registry.getProtocol(i),
      d = encodingLength(i),
      h = sizeForAddr(c, e, a + d);
    let b = 0;
    h > 0 && c.size === V && (b = encodingLength(h));
    const g = d + b + h,
      $ = { code: i, name: c.name, bytes: e.subarray(a, a + g) };
    if (h > 0) {
      const _ = a + d + b,
        _e = e.subarray(_, _ + h);
      $.value =
        ((s = c.bytesToValue) == null ? void 0 : s.call(c, _e)) ?? toString(_e);
    }
    (o.push($), (a += g));
  }
  return o;
}
function componentsToBytes(e) {
  var s;
  let o = 0;
  const a = [];
  for (const i of e) {
    if (i.bytes == null) {
      const c = registry.getProtocol(i.code),
        d = encodingLength(i.code);
      let h,
        b = 0,
        g = 0;
      i.value != null &&
        ((h =
          ((s = c.valueToBytes) == null ? void 0 : s.call(c, i.value)) ??
          fromString(i.value)),
        (b = h.byteLength),
        c.size === V && (g = encodingLength(b)));
      const $ = new Uint8Array(d + g + b);
      let _ = 0;
      (encodeUint8Array(i.code, $, _),
        (_ += d),
        h != null &&
          (c.size === V && (encodeUint8Array(b, $, _), (_ += g)), $.set(h, _)),
        (i.bytes = $));
    }
    (a.push(i.bytes), (o += i.bytes.byteLength));
  }
  return concat(a, o);
}
function stringToComponents(e) {
  var c;
  if (e.charAt(0) !== '/')
    throw new InvalidMultiaddrError('String multiaddr must start with "/"');
  const o = [];
  let a = 'protocol',
    s = '',
    i = '';
  for (let d = 1; d < e.length; d++) {
    const h = e.charAt(d);
    h !== '/' && (a === 'protocol' ? (i += e.charAt(d)) : (s += e.charAt(d)));
    const b = d === e.length - 1;
    if (h === '/' || b) {
      const g = registry.getProtocol(i);
      if (a === 'protocol') {
        if (g.size == null || g.size === 0) {
          (o.push({ code: g.code, name: g.name }),
            (s = ''),
            (i = ''),
            (a = 'protocol'));
          continue;
        } else if (b)
          throw new InvalidMultiaddrError(`Component ${i} was missing value`);
        a = 'value';
      } else if (a === 'value') {
        const $ = { code: g.code, name: g.name };
        if (g.size != null && g.size !== 0) {
          if (s === '')
            throw new InvalidMultiaddrError(`Component ${i} was missing value`);
          $.value =
            ((c = g.stringToValue) == null ? void 0 : c.call(g, s)) ?? s;
        }
        (o.push($), (s = ''), (i = ''), (a = 'protocol'));
      }
    }
  }
  if (i !== '' && s !== '')
    throw new InvalidMultiaddrError('Incomplete multiaddr');
  return o;
}
function componentsToString(e) {
  return `/${e
    .flatMap((o) => {
      var s;
      if (o.value == null) return o.name;
      const a = registry.getProtocol(o.code);
      if (a == null)
        throw new InvalidMultiaddrError(`Unknown protocol code ${o.code}`);
      return [
        o.name,
        ((s = a.valueToString) == null ? void 0 : s.call(a, o.value)) ??
          o.value,
      ];
    })
    .join('/')}`;
}
function sizeForAddr(e, o, a) {
  return e.size == null || e.size === 0
    ? 0
    : e.size > 0
      ? e.size / 8
      : decode(o, a);
}
const inspect$1 = Symbol.for('nodejs.util.inspect.custom'),
  symbol$1 = Symbol.for('@multiformats/multiaddr'),
  DNS_CODES = [CODE_DNS, CODE_DNS4, CODE_DNS6, CODE_DNSADDR];
class NoAvailableResolverError extends Error {
  constructor(o = 'No available resolver') {
    (super(o), (this.name = 'NoAvailableResolverError'));
  }
}
function toComponents(e) {
  if ((e == null && (e = '/'), isMultiaddr(e))) return e.getComponents();
  if (e instanceof Uint8Array) return bytesToComponents(e);
  if (typeof e == 'string')
    return (
      (e = e.replace(/\/(\/)+/, '/').replace(/(\/)+$/, '')),
      e === '' && (e = '/'),
      stringToComponents(e)
    );
  if (Array.isArray(e)) return e;
  throw new InvalidMultiaddrError(
    'Must be a string, Uint8Array, Component[], or another Multiaddr'
  );
}
var er, It, Ft, Vt;
const zt = class zt {
  constructor(o = '/', a = {}) {
    pt(this, er, !0);
    Ht(this, It, void 0);
    Ht(this, Ft, void 0);
    Ht(this, Vt, void 0);
    (Gt(this, It, toComponents(o)), a.validate !== !1 && validate(this));
  }
  get bytes() {
    return (
      Nt(this, Vt) == null && Gt(this, Vt, componentsToBytes(Nt(this, It))),
      Nt(this, Vt)
    );
  }
  toString() {
    return (
      Nt(this, Ft) == null && Gt(this, Ft, componentsToString(Nt(this, It))),
      Nt(this, Ft)
    );
  }
  toJSON() {
    return this.toString();
  }
  toOptions() {
    let o,
      a,
      s,
      i,
      c = '';
    for (const { code: h, name: b, value: g } of Nt(this, It))
      (h === CODE_IP6ZONE && (c = `%${g ?? ''}`),
        DNS_CODES.includes(h) &&
          ((a = 'tcp'),
          (i = 443),
          (s = `${g ?? ''}${c}`),
          (o = h === CODE_DNS6 ? 6 : 4)),
        (h === CODE_TCP || h === CODE_UDP) &&
          ((a = b === 'tcp' ? 'tcp' : 'udp'), (i = parseInt(g ?? ''))),
        (h === CODE_IP4 || h === CODE_IP6) &&
          ((a = 'tcp'), (s = `${g ?? ''}${c}`), (o = h === CODE_IP6 ? 6 : 4)));
    if (o == null || a == null || s == null || i == null)
      throw new Error(
        'multiaddr must have a valid format: "/{ip4, ip6, dns4, dns6, dnsaddr}/{address}/{tcp, udp}/{port}".'
      );
    return { family: o, host: s, transport: a, port: i };
  }
  getComponents() {
    return [...Nt(this, It)];
  }
  protos() {
    return Nt(this, It).map(({ code: o, value: a }) => {
      const s = registry.getProtocol(o);
      return {
        code: o,
        size: s.size ?? 0,
        name: s.name,
        resolvable: !!s.resolvable,
        path: !!s.path,
      };
    });
  }
  protoCodes() {
    return Nt(this, It).map(({ code: o }) => o);
  }
  protoNames() {
    return Nt(this, It).map(({ name: o }) => o);
  }
  tuples() {
    return Nt(this, It).map(({ code: o, value: a }) => {
      var c;
      if (a == null) return [o];
      const s = registry.getProtocol(o),
        i = [o];
      return (
        a != null &&
          i.push(
            ((c = s.valueToBytes) == null ? void 0 : c.call(s, a)) ??
              fromString(a)
          ),
        i
      );
    });
  }
  stringTuples() {
    return Nt(this, It).map(({ code: o, value: a }) =>
      a == null ? [o] : [o, a]
    );
  }
  encapsulate(o) {
    const a = new zt(o);
    return new zt([...Nt(this, It), ...a.getComponents()], { validate: !1 });
  }
  decapsulate(o) {
    const a = o.toString(),
      s = this.toString(),
      i = s.lastIndexOf(a);
    if (i < 0)
      throw new InvalidParametersError(
        `Address ${this.toString()} does not contain subaddress: ${o.toString()}`
      );
    return new zt(s.slice(0, i), { validate: !1 });
  }
  decapsulateCode(o) {
    let a;
    for (let s = Nt(this, It).length - 1; s > -1; s--)
      if (Nt(this, It)[s].code === o) {
        a = s;
        break;
      }
    return new zt(Nt(this, It).slice(0, a), { validate: !1 });
  }
  getPeerId() {
    try {
      let o = [];
      Nt(this, It).forEach(({ code: s, value: i }) => {
        (s === CODE_P2P && o.push([s, i]), s === CODE_P2P_CIRCUIT && (o = []));
      });
      const a = o.pop();
      if ((a == null ? void 0 : a[1]) != null) {
        const s = a[1];
        return s[0] === 'Q' || s[0] === '1'
          ? toString(base58btc.decode(`z${s}`), 'base58btc')
          : toString(CID.parse(s).multihash.bytes, 'base58btc');
      }
      return null;
    } catch {
      return null;
    }
  }
  getPath() {
    for (const o of Nt(this, It))
      if (registry.getProtocol(o.code).path) return o.value ?? null;
    return null;
  }
  equals(o) {
    return equals(this.bytes, o.bytes);
  }
  async resolve(o) {
    const a = this.protos().find((c) => c.resolvable);
    if (a == null) return [this];
    const s = resolvers.get(a.name);
    if (s == null)
      throw new NoAvailableResolverError(`no available resolver for ${a.name}`);
    return (await s(this, o)).map((c) => multiaddr(c));
  }
  nodeAddress() {
    const o = this.toOptions();
    if (o.transport !== 'tcp' && o.transport !== 'udp')
      throw new Error(
        `multiaddr must have a valid format - no protocol with name: "${o.transport}". Must have a valid transport protocol: "{tcp, udp}"`
      );
    return { family: o.family, address: o.host, port: o.port };
  }
  isThinWaistAddress() {
    return !(
      Nt(this, It).length !== 2 ||
      (Nt(this, It)[0].code !== CODE_IP4 &&
        Nt(this, It)[0].code !== CODE_IP6) ||
      (Nt(this, It)[1].code !== CODE_TCP && Nt(this, It)[1].code !== CODE_UDP)
    );
  }
  [((er = symbol$1), inspect$1)]() {
    return `Multiaddr(${this.toString()})`;
  }
};
((It = new WeakMap()), (Ft = new WeakMap()), (Vt = new WeakMap()));
let Multiaddr = zt;
function validate(e) {
  e.getComponents().forEach((o) => {
    var s;
    const a = registry.getProtocol(o.code);
    o.value != null && ((s = a.validate) == null || s.call(a, o.value));
  });
}
const resolvers = new Map();
function isMultiaddr(e) {
  return !!(e != null && e[symbol$1]);
}
function multiaddr(e) {
  return new Multiaddr(e);
}
function protocols(e) {
  const o = registry.getProtocol(e);
  return {
    code: o.code,
    size: o.size ?? 0,
    name: o.name,
    resolvable: !!o.resolvable,
    path: !!o.path,
  };
}
function extractSNI(e) {
  let o;
  try {
    o = protocols('sni').code;
  } catch {
    return null;
  }
  for (const [a, s] of e) if (a === o && s !== void 0) return s;
  return null;
}
function hasTLS(e) {
  return e.some(([o, a]) => o === protocols('tls').code);
}
function interpretNext(e, o, a) {
  const s = interpreters[protocols(e).name];
  if (s === void 0)
    throw new Error(`Can't interpret protocol ${protocols(e).name}`);
  const i = s(o, a);
  return e === protocols('ip6').code ? `[${i}]` : i;
}
const interpreters = {
  ip4: (e, o) => e,
  ip6: (e, o) => (o.length === 0 ? e : `[${e}]`),
  tcp: (e, o) => {
    const a = o.pop();
    if (a === void 0) throw new Error('Unexpected end of multiaddr');
    return `tcp://${interpretNext(a[0], a[1] ?? '', o)}:${e}`;
  },
  udp: (e, o) => {
    const a = o.pop();
    if (a === void 0) throw new Error('Unexpected end of multiaddr');
    return `udp://${interpretNext(a[0], a[1] ?? '', o)}:${e}`;
  },
  dnsaddr: (e, o) => e,
  dns4: (e, o) => e,
  dns6: (e, o) => e,
  dns: (e, o) => e,
  ipfs: (e, o) => {
    const a = o.pop();
    if (a === void 0) throw new Error('Unexpected end of multiaddr');
    return `${interpretNext(a[0], a[1] ?? '', o)}/ipfs/${e}`;
  },
  p2p: (e, o) => {
    const a = o.pop();
    if (a === void 0) throw new Error('Unexpected end of multiaddr');
    return `${interpretNext(a[0], a[1] ?? '', o)}/p2p/${e}`;
  },
  http: (e, o) => {
    const a = hasTLS(o),
      s = extractSNI(o);
    if (a && s !== null) return `https://${s}`;
    const i = a ? 'https://' : 'http://',
      c = o.pop();
    if (c === void 0) throw new Error('Unexpected end of multiaddr');
    let d = interpretNext(c[0], c[1] ?? '', o);
    return ((d = d.replace('tcp://', '')), `${i}${d}`);
  },
  tls: (e, o) => {
    const a = o.pop();
    if (a === void 0) throw new Error('Unexpected end of multiaddr');
    return interpretNext(a[0], a[1] ?? '', o);
  },
  sni: (e, o) => {
    const a = o.pop();
    if (a === void 0) throw new Error('Unexpected end of multiaddr');
    return interpretNext(a[0], a[1] ?? '', o);
  },
  https: (e, o) => {
    const a = o.pop();
    if (a === void 0) throw new Error('Unexpected end of multiaddr');
    let s = interpretNext(a[0], a[1] ?? '', o);
    return ((s = s.replace('tcp://', '')), `https://${s}`);
  },
  ws: (e, o) => {
    const a = hasTLS(o),
      s = extractSNI(o);
    if (a && s !== null) return `wss://${s}`;
    const i = a ? 'wss://' : 'ws://',
      c = o.pop();
    if (c === void 0) throw new Error('Unexpected end of multiaddr');
    let d = interpretNext(c[0], c[1] ?? '', o);
    return ((d = d.replace('tcp://', '')), `${i}${d}`);
  },
  wss: (e, o) => {
    const a = o.pop();
    if (a === void 0) throw new Error('Unexpected end of multiaddr');
    let s = interpretNext(a[0], a[1] ?? '', o);
    return ((s = s.replace('tcp://', '')), `wss://${s}`);
  },
  'p2p-websocket-star': (e, o) => {
    const a = o.pop();
    if (a === void 0) throw new Error('Unexpected end of multiaddr');
    return `${interpretNext(a[0], a[1] ?? '', o)}/p2p-websocket-star`;
  },
  'p2p-webrtc-star': (e, o) => {
    const a = o.pop();
    if (a === void 0) throw new Error('Unexpected end of multiaddr');
    return `${interpretNext(a[0], a[1] ?? '', o)}/p2p-webrtc-star`;
  },
  'p2p-webrtc-direct': (e, o) => {
    const a = o.pop();
    if (a === void 0) throw new Error('Unexpected end of multiaddr');
    return `${interpretNext(a[0], a[1] ?? '', o)}/p2p-webrtc-direct`;
  },
};
function multiaddrToUri(e, o) {
  const s = multiaddr(e).stringTuples(),
    i = s.pop();
  if (i === void 0) throw new Error('Unexpected end of multiaddr');
  const c = protocols(i[0]),
    d = interpreters[c.name];
  if (d == null) throw new Error(`No interpreter found for ${c.name}`);
  let h = d(i[1] ?? '', s);
  return (
    (o == null ? void 0 : o.assumeHttp) !== !1 &&
      i[0] === protocols('tcp').code &&
      ((h = h.replace('tcp://', 'http://')),
      (i[1] === '443' || i[1] === '80') &&
        (i[1] === '443' && (h = h.replace('http://', 'https://')),
        (h = h.substring(0, h.lastIndexOf(':'))))),
    h
  );
}
function toUrlString(e) {
  try {
    e = multiaddrToUri(multiaddr$1(e));
  } catch {}
  return ((e = e.toString()), e);
}
const getAgent = () => {},
  log$1 = logger('ipfs-http-client:lib:error-handler'),
  merge = mergeOpts.bind({ ignoreUndefined: !0 }),
  DEFAULT_PROTOCOL =
    env.isBrowser || env.isWebWorker ? location.protocol : 'http',
  DEFAULT_HOST =
    env.isBrowser || env.isWebWorker ? location.hostname : 'localhost',
  DEFAULT_PORT = env.isBrowser || env.isWebWorker ? location.port : '5001',
  normalizeOptions = (e = {}) => {
    let o,
      a = {},
      s;
    if (typeof e == 'string' || isMultiaddr$1(e)) o = new URL(toUrlString(e));
    else if (e instanceof URL) o = e;
    else if (typeof e.url == 'string' || isMultiaddr$1(e.url))
      ((o = new URL(toUrlString(e.url))), (a = e));
    else if (e.url instanceof URL) ((o = e.url), (a = e));
    else {
      a = e || {};
      const i = (a.protocol || DEFAULT_PROTOCOL).replace(':', ''),
        c = (a.host || DEFAULT_HOST).split(':')[0],
        d = a.port || DEFAULT_PORT;
      o = new URL(`${i}://${c}:${d}`);
    }
    if (
      (a.apiPath
        ? (o.pathname = a.apiPath)
        : (o.pathname === '/' || o.pathname === void 0) &&
          (o.pathname = 'api/v0'),
      env.isNode)
    ) {
      const i = getAgent();
      s = a.agent || new i({ keepAlive: !0, maxSockets: 6 });
    }
    return {
      ...a,
      host: o.host,
      protocol: o.protocol.replace(':', ''),
      port: Number(o.port),
      apiPath: o.pathname,
      url: o,
      agent: s,
    };
  },
  errorHandler = async (e) => {
    let o;
    try {
      if (
        (e.headers.get('Content-Type') || '').startsWith('application/json')
      ) {
        const s = await e.json();
        (log$1(s), (o = s.Message || s.message));
      } else o = await e.text();
    } catch (s) {
      (log$1('Failed to parse error response', s), (o = s.message));
    }
    let a = new HTTP$1.HTTPError(e);
    throw (
      o &&
        (o.includes('deadline has elapsed') && (a = new HTTP$1.TimeoutError()),
        o &&
          o.includes('context deadline exceeded') &&
          (a = new HTTP$1.TimeoutError())),
      o && o.includes('request timed out') && (a = new HTTP$1.TimeoutError()),
      o && (a.message = o),
      a
    );
  },
  KEBAB_REGEX = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g,
  kebabCase = (e) =>
    e.replace(KEBAB_REGEX, function (o) {
      return '-' + o.toLowerCase();
    }),
  parseTimeout = (e) => (typeof e == 'string' ? parse(e) : e);
class Client extends HTTP$1 {
  constructor(o = {}) {
    const a = normalizeOptions(o);
    (super({
      timeout: parseTimeout(a.timeout || 0) || void 0,
      headers: a.headers,
      base: `${a.url}`,
      handleError: errorHandler,
      transformSearchParams: (i) => {
        const c = new URLSearchParams();
        for (const [d, h] of i)
          (h !== 'undefined' &&
            h !== 'null' &&
            d !== 'signal' &&
            c.append(kebabCase(d), h),
            d === 'timeout' && !isNaN(h) && c.append(kebabCase(d), h));
        return c;
      },
      agent: a.agent,
    }),
      delete this.get,
      delete this.put,
      delete this.delete,
      delete this.options);
    const s = this.fetch;
    this.fetch = (i, c = {}) => (
      typeof i == 'string' && !i.startsWith('/') && (i = `${a.url}/${i}`),
      s.call(this, i, merge(c, { method: 'POST' }))
    );
  }
}
HTTP$1.HTTPError;
const configure = (e) => (o) => e(new Client(o), o);
function modeToString$1(e) {
  if (e != null)
    return typeof e == 'string' ? e : e.toString(8).padStart(4, '0');
}
function parseMtime$1(e) {
  if (e == null) return;
  let o;
  if (
    (e.secs != null && (o = { secs: e.secs, nsecs: e.nsecs }),
    e.Seconds != null &&
      (o = { secs: e.Seconds, nsecs: e.FractionalNanoseconds }),
    Array.isArray(e) && (o = { secs: e[0], nsecs: e[1] }),
    e instanceof Date)
  ) {
    const a = e.getTime(),
      s = Math.floor(a / 1e3);
    o = { secs: s, nsecs: (a - s * 1e3) * 1e3 };
  }
  if (Object.prototype.hasOwnProperty.call(o, 'secs')) {
    if (o != null && o.nsecs != null && (o.nsecs < 0 || o.nsecs > 999999999))
      throw errCode$1(
        new Error('mtime-nsecs must be within the range [0,999999999]'),
        'ERR_INVALID_MTIME_NSECS'
      );
    return o;
  }
}
function toUrlSearchParams({
  arg: e,
  searchParams: o,
  hashAlg: a,
  mtime: s,
  mode: i,
  ...c
} = {}) {
  (o && (c = { ...c, ...o }),
    a && (c.hash = a),
    s != null &&
      ((s = parseMtime$1(s)), (c.mtime = s.secs), (c.mtimeNsecs = s.nsecs)),
    i != null && (c.mode = modeToString$1(i)),
    c.timeout && !isNaN(c.timeout) && (c.timeout = `${c.timeout}ms`),
    e == null ? (e = []) : Array.isArray(e) || (e = [e]));
  const d = new URLSearchParams(c);
  return (e.forEach((h) => d.append('arg', h)), d);
}
const createWantlist = configure((e) => {
    async function o(a = {}) {
      return (
        (
          await (
            await e.post('bitswap/wantlist', {
              signal: a.signal,
              searchParams: toUrlSearchParams(a),
              headers: a.headers,
            })
          ).json()
        ).Keys || []
      ).map((i) => CID$1.parse(i['/']));
    }
    return o;
  }),
  createWantlistForPeer = configure((e) => {
    async function o(a, s = {}) {
      return (
        (
          await (
            await e.post('bitswap/wantlist', {
              signal: s.signal,
              searchParams: toUrlSearchParams({ ...s, peer: a.toString() }),
              headers: s.headers,
            })
          ).json()
        ).Keys || []
      ).map((c) => CID$1.parse(c['/']));
    }
    return o;
  }),
  symbol = Symbol.for('@libp2p/peer-id'),
  inspect = Symbol.for('nodejs.util.inspect.custom'),
  baseDecoder = Object.values(bases$2)
    .map((e) => e.decoder)
    .reduce((e, o) => e.or(o), bases$2.identity.decoder),
  LIBP2P_KEY_CODE = 114,
  MARSHALLED_ED225519_PUBLIC_KEY_LENGTH = 36,
  MARSHALLED_SECP256K1_PUBLIC_KEY_LENGTH = 37;
var tr;
class PeerIdImpl {
  constructor(o) {
    pt(this, 'type');
    pt(this, 'multihash');
    pt(this, 'privateKey');
    pt(this, 'publicKey');
    pt(this, 'string');
    pt(this, tr, !0);
    ((this.type = o.type),
      (this.multihash = o.multihash),
      (this.privateKey = o.privateKey),
      Object.defineProperty(this, 'string', { enumerable: !1, writable: !0 }));
  }
  get [Symbol.toStringTag]() {
    return `PeerId(${this.toString()})`;
  }
  toString() {
    return (
      this.string == null &&
        (this.string = base58btc$2.encode(this.multihash.bytes).slice(1)),
      this.string
    );
  }
  toCID() {
    return CID$1.createV1(LIBP2P_KEY_CODE, this.multihash);
  }
  toBytes() {
    return this.multihash.bytes;
  }
  toJSON() {
    return this.toString();
  }
  equals(o) {
    var a;
    if (o instanceof Uint8Array) return equals$3(this.multihash.bytes, o);
    if (typeof o == 'string') return peerIdFromString(o).equals(this);
    if (
      ((a = o == null ? void 0 : o.multihash) == null ? void 0 : a.bytes) !=
      null
    )
      return equals$3(this.multihash.bytes, o.multihash.bytes);
    throw new Error('not valid Id');
  }
  [((tr = symbol), inspect)]() {
    return `PeerId(${this.toString()})`;
  }
}
class RSAPeerIdImpl extends PeerIdImpl {
  constructor(a) {
    super({ ...a, type: 'RSA' });
    pt(this, 'type', 'RSA');
    pt(this, 'publicKey');
    this.publicKey = a.publicKey;
  }
}
class Ed25519PeerIdImpl extends PeerIdImpl {
  constructor(a) {
    super({ ...a, type: 'Ed25519' });
    pt(this, 'type', 'Ed25519');
    pt(this, 'publicKey');
    this.publicKey = a.multihash.digest;
  }
}
class Secp256k1PeerIdImpl extends PeerIdImpl {
  constructor(a) {
    super({ ...a, type: 'secp256k1' });
    pt(this, 'type', 'secp256k1');
    pt(this, 'publicKey');
    this.publicKey = a.multihash.digest;
  }
}
function peerIdFromString(e, o) {
  if (e.charAt(0) === '1' || e.charAt(0) === 'Q') {
    const a = decode$f(base58btc$2.decode(`z${e}`));
    return e.startsWith('12D')
      ? new Ed25519PeerIdImpl({ multihash: a })
      : e.startsWith('16U')
        ? new Secp256k1PeerIdImpl({ multihash: a })
        : new RSAPeerIdImpl({ multihash: a });
  }
  return peerIdFromBytes(baseDecoder.decode(e));
}
function peerIdFromBytes(e) {
  try {
    const o = decode$f(e);
    if (o.code === identity$3.code) {
      if (o.digest.length === MARSHALLED_ED225519_PUBLIC_KEY_LENGTH)
        return new Ed25519PeerIdImpl({ multihash: o });
      if (o.digest.length === MARSHALLED_SECP256K1_PUBLIC_KEY_LENGTH)
        return new Secp256k1PeerIdImpl({ multihash: o });
    }
    if (o.code === sha256.code) return new RSAPeerIdImpl({ multihash: o });
  } catch {
    return peerIdFromCID(CID$1.decode(e));
  }
  throw new Error('Supplied PeerID CID is invalid');
}
function peerIdFromCID(e) {
  if (
    e == null ||
    e.multihash == null ||
    e.version == null ||
    (e.version === 1 && e.code !== LIBP2P_KEY_CODE)
  )
    throw new Error('Supplied PeerID CID is invalid');
  const o = e.multihash;
  if (o.code === sha256.code)
    return new RSAPeerIdImpl({ multihash: e.multihash });
  if (o.code === identity$3.code) {
    if (o.digest.length === MARSHALLED_ED225519_PUBLIC_KEY_LENGTH)
      return new Ed25519PeerIdImpl({ multihash: e.multihash });
    if (o.digest.length === MARSHALLED_SECP256K1_PUBLIC_KEY_LENGTH)
      return new Secp256k1PeerIdImpl({ multihash: e.multihash });
  }
  throw new Error('Supplied PeerID CID is invalid');
}
const createStat$4 = configure((e) => {
  async function o(a = {}) {
    const s = await e.post('bitswap/stat', {
      searchParams: toUrlSearchParams(a),
      signal: a.signal,
      headers: a.headers,
    });
    return toCoreInterface$4(await s.json());
  }
  return o;
});
function toCoreInterface$4(e) {
  return {
    provideBufLen: e.ProvideBufLen,
    wantlist: (e.Wantlist || []).map((o) => CID$1.parse(o['/'])),
    peers: (e.Peers || []).map((o) => peerIdFromString(o)),
    blocksReceived: BigInt(e.BlocksReceived),
    dataReceived: BigInt(e.DataReceived),
    blocksSent: BigInt(e.BlocksSent),
    dataSent: BigInt(e.DataSent),
    dupBlksReceived: BigInt(e.DupBlksReceived),
    dupDataReceived: BigInt(e.DupDataReceived),
  };
}
const createUnwant = configure((e) => {
  async function o(a, s = {}) {
    return (
      await e.post('bitswap/unwant', {
        signal: s.signal,
        searchParams: toUrlSearchParams({ arg: a.toString(), ...s }),
        headers: s.headers,
      })
    ).json();
  }
  return o;
});
function createBitswap(e) {
  return {
    wantlist: createWantlist(e),
    wantlistForPeer: createWantlistForPeer(e),
    unwant: createUnwant(e),
    stat: createStat$4(e),
  };
}
const createGet$5 = configure((e) => {
  async function o(a, s = {}) {
    const i = await e.post('block/get', {
      signal: s.signal,
      searchParams: toUrlSearchParams({ arg: a.toString(), ...s }),
      headers: s.headers,
    });
    return new Uint8Array(await i.arrayBuffer());
  }
  return o;
});
function peekableIterator(e) {
  const [o, a] =
      e[Symbol.asyncIterator] != null
        ? [e[Symbol.asyncIterator](), Symbol.asyncIterator]
        : [e[Symbol.iterator](), Symbol.iterator],
    s = [];
  return {
    peek: () => o.next(),
    push: (i) => {
      s.push(i);
    },
    next: () => (s.length > 0 ? { done: !1, value: s.shift() } : o.next()),
    [a]() {
      return this;
    },
  };
}
async function* browserReadableStreamToIt(e, o = {}) {
  const a = e.getReader();
  try {
    for (;;) {
      const s = await a.read();
      if (s.done) return;
      yield s.value;
    }
  } finally {
    (o.preventCancel !== !0 && (await a.cancel()), a.releaseLock());
  }
}
async function all(e) {
  const o = [];
  for await (const a of e) o.push(a);
  return o;
}
function isBytes(e) {
  return ArrayBuffer.isView(e) || e instanceof ArrayBuffer;
}
function isBlob(e) {
  return (
    e.constructor &&
    (e.constructor.name === 'Blob' || e.constructor.name === 'File') &&
    typeof e.stream == 'function'
  );
}
function isFileObject(e) {
  return typeof e == 'object' && (e.path || e.content);
}
const isReadableStream = (e) => e && typeof e.getReader == 'function';
async function normaliseContent$1(e) {
  if (isBytes(e)) return new Blob([e]);
  if (typeof e == 'string' || e instanceof String)
    return new Blob([e.toString()]);
  if (isBlob(e)) return e;
  if (
    (isReadableStream(e) && (e = browserReadableStreamToIt(e)),
    Symbol.iterator in e || Symbol.asyncIterator in e)
  ) {
    const o = peekableIterator(e),
      { value: a, done: s } = await o.peek();
    if (s) return itToBlob(o);
    if ((o.push(a), Number.isInteger(a)))
      return new Blob([Uint8Array.from(await all(o))]);
    if (isBytes(a) || typeof a == 'string' || a instanceof String)
      return itToBlob(o);
  }
  throw errCode$1(new Error(`Unexpected input: ${e}`), 'ERR_UNEXPECTED_INPUT');
}
async function itToBlob(e) {
  const o = [];
  for await (const a of e) o.push(a);
  return new Blob(o);
}
async function* map(e, o) {
  for await (const a of e) yield o(a);
}
var indexMinimal = {},
  minimal$1 = {},
  aspromise = asPromise;
function asPromise(e, o) {
  for (
    var a = new Array(arguments.length - 1), s = 0, i = 2, c = !0;
    i < arguments.length;

  )
    a[s++] = arguments[i++];
  return new Promise(function (h, b) {
    a[s] = function ($) {
      if (c)
        if (((c = !1), $)) b($);
        else {
          for (var _ = new Array(arguments.length - 1), _e = 0; _e < _.length; )
            _[_e++] = arguments[_e];
          h.apply(null, _);
        }
    };
    try {
      e.apply(o || null, a);
    } catch (g) {
      c && ((c = !1), b(g));
    }
  });
}
var base64$1 = {};
(function (e) {
  var o = e;
  o.length = function (h) {
    var b = h.length;
    if (!b) return 0;
    for (var g = 0; --b % 4 > 1 && h.charAt(b) === '='; ) ++g;
    return Math.ceil(h.length * 3) / 4 - g;
  };
  for (var a = new Array(64), s = new Array(123), i = 0; i < 64; )
    s[
      (a[i] =
        i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : (i - 59) | 43)
    ] = i++;
  o.encode = function (h, b, g) {
    for (var $ = null, _ = [], _e = 0, ot = 0, j; b < g; ) {
      var nt = h[b++];
      switch (ot) {
        case 0:
          ((_[_e++] = a[nt >> 2]), (j = (nt & 3) << 4), (ot = 1));
          break;
        case 1:
          ((_[_e++] = a[j | (nt >> 4)]), (j = (nt & 15) << 2), (ot = 2));
          break;
        case 2:
          ((_[_e++] = a[j | (nt >> 6)]), (_[_e++] = a[nt & 63]), (ot = 0));
          break;
      }
      _e > 8191 &&
        (($ || ($ = [])).push(String.fromCharCode.apply(String, _)), (_e = 0));
    }
    return (
      ot && ((_[_e++] = a[j]), (_[_e++] = 61), ot === 1 && (_[_e++] = 61)),
      $
        ? (_e && $.push(String.fromCharCode.apply(String, _.slice(0, _e))),
          $.join(''))
        : String.fromCharCode.apply(String, _.slice(0, _e))
    );
  };
  var c = 'invalid encoding';
  ((o.decode = function (h, b, g) {
    for (var $ = g, _ = 0, _e, ot = 0; ot < h.length; ) {
      var j = h.charCodeAt(ot++);
      if (j === 61 && _ > 1) break;
      if ((j = s[j]) === void 0) throw Error(c);
      switch (_) {
        case 0:
          ((_e = j), (_ = 1));
          break;
        case 1:
          ((b[g++] = (_e << 2) | ((j & 48) >> 4)), (_e = j), (_ = 2));
          break;
        case 2:
          ((b[g++] = ((_e & 15) << 4) | ((j & 60) >> 2)), (_e = j), (_ = 3));
          break;
        case 3:
          ((b[g++] = ((_e & 3) << 6) | j), (_ = 0));
          break;
      }
    }
    if (_ === 1) throw Error(c);
    return g - $;
  }),
    (o.test = function (h) {
      return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
        h
      );
    }));
})(base64$1);
var eventemitter = EventEmitter;
function EventEmitter() {
  this._listeners = {};
}
EventEmitter.prototype.on = function (o, a, s) {
  return (
    (this._listeners[o] || (this._listeners[o] = [])).push({
      fn: a,
      ctx: s || this,
    }),
    this
  );
};
EventEmitter.prototype.off = function (o, a) {
  if (o === void 0) this._listeners = {};
  else if (a === void 0) this._listeners[o] = [];
  else
    for (var s = this._listeners[o], i = 0; i < s.length; )
      s[i].fn === a ? s.splice(i, 1) : ++i;
  return this;
};
EventEmitter.prototype.emit = function (o) {
  var a = this._listeners[o];
  if (a) {
    for (var s = [], i = 1; i < arguments.length; ) s.push(arguments[i++]);
    for (i = 0; i < a.length; ) a[i].fn.apply(a[i++].ctx, s);
  }
  return this;
};
var float = factory(factory);
function factory(e) {
  return (
    typeof Float32Array < 'u'
      ? (function () {
          var o = new Float32Array([-0]),
            a = new Uint8Array(o.buffer),
            s = a[3] === 128;
          function i(b, g, $) {
            ((o[0] = b),
              (g[$] = a[0]),
              (g[$ + 1] = a[1]),
              (g[$ + 2] = a[2]),
              (g[$ + 3] = a[3]));
          }
          function c(b, g, $) {
            ((o[0] = b),
              (g[$] = a[3]),
              (g[$ + 1] = a[2]),
              (g[$ + 2] = a[1]),
              (g[$ + 3] = a[0]));
          }
          ((e.writeFloatLE = s ? i : c), (e.writeFloatBE = s ? c : i));
          function d(b, g) {
            return (
              (a[0] = b[g]),
              (a[1] = b[g + 1]),
              (a[2] = b[g + 2]),
              (a[3] = b[g + 3]),
              o[0]
            );
          }
          function h(b, g) {
            return (
              (a[3] = b[g]),
              (a[2] = b[g + 1]),
              (a[1] = b[g + 2]),
              (a[0] = b[g + 3]),
              o[0]
            );
          }
          ((e.readFloatLE = s ? d : h), (e.readFloatBE = s ? h : d));
        })()
      : (function () {
          function o(s, i, c, d) {
            var h = i < 0 ? 1 : 0;
            if ((h && (i = -i), i === 0)) s(1 / i > 0 ? 0 : 2147483648, c, d);
            else if (isNaN(i)) s(2143289344, c, d);
            else if (i > 34028234663852886e22)
              s(((h << 31) | 2139095040) >>> 0, c, d);
            else if (i < 11754943508222875e-54)
              s(((h << 31) | Math.round(i / 1401298464324817e-60)) >>> 0, c, d);
            else {
              var b = Math.floor(Math.log(i) / Math.LN2),
                g = Math.round(i * Math.pow(2, -b) * 8388608) & 8388607;
              s(((h << 31) | ((b + 127) << 23) | g) >>> 0, c, d);
            }
          }
          ((e.writeFloatLE = o.bind(null, writeUintLE)),
            (e.writeFloatBE = o.bind(null, writeUintBE)));
          function a(s, i, c) {
            var d = s(i, c),
              h = (d >> 31) * 2 + 1,
              b = (d >>> 23) & 255,
              g = d & 8388607;
            return b === 255
              ? g
                ? NaN
                : h * (1 / 0)
              : b === 0
                ? h * 1401298464324817e-60 * g
                : h * Math.pow(2, b - 150) * (g + 8388608);
          }
          ((e.readFloatLE = a.bind(null, readUintLE)),
            (e.readFloatBE = a.bind(null, readUintBE)));
        })(),
    typeof Float64Array < 'u'
      ? (function () {
          var o = new Float64Array([-0]),
            a = new Uint8Array(o.buffer),
            s = a[7] === 128;
          function i(b, g, $) {
            ((o[0] = b),
              (g[$] = a[0]),
              (g[$ + 1] = a[1]),
              (g[$ + 2] = a[2]),
              (g[$ + 3] = a[3]),
              (g[$ + 4] = a[4]),
              (g[$ + 5] = a[5]),
              (g[$ + 6] = a[6]),
              (g[$ + 7] = a[7]));
          }
          function c(b, g, $) {
            ((o[0] = b),
              (g[$] = a[7]),
              (g[$ + 1] = a[6]),
              (g[$ + 2] = a[5]),
              (g[$ + 3] = a[4]),
              (g[$ + 4] = a[3]),
              (g[$ + 5] = a[2]),
              (g[$ + 6] = a[1]),
              (g[$ + 7] = a[0]));
          }
          ((e.writeDoubleLE = s ? i : c), (e.writeDoubleBE = s ? c : i));
          function d(b, g) {
            return (
              (a[0] = b[g]),
              (a[1] = b[g + 1]),
              (a[2] = b[g + 2]),
              (a[3] = b[g + 3]),
              (a[4] = b[g + 4]),
              (a[5] = b[g + 5]),
              (a[6] = b[g + 6]),
              (a[7] = b[g + 7]),
              o[0]
            );
          }
          function h(b, g) {
            return (
              (a[7] = b[g]),
              (a[6] = b[g + 1]),
              (a[5] = b[g + 2]),
              (a[4] = b[g + 3]),
              (a[3] = b[g + 4]),
              (a[2] = b[g + 5]),
              (a[1] = b[g + 6]),
              (a[0] = b[g + 7]),
              o[0]
            );
          }
          ((e.readDoubleLE = s ? d : h), (e.readDoubleBE = s ? h : d));
        })()
      : (function () {
          function o(s, i, c, d, h, b) {
            var g = d < 0 ? 1 : 0;
            if ((g && (d = -d), d === 0))
              (s(0, h, b + i), s(1 / d > 0 ? 0 : 2147483648, h, b + c));
            else if (isNaN(d)) (s(0, h, b + i), s(2146959360, h, b + c));
            else if (d > 17976931348623157e292)
              (s(0, h, b + i), s(((g << 31) | 2146435072) >>> 0, h, b + c));
            else {
              var $;
              if (d < 22250738585072014e-324)
                (($ = d / 5e-324),
                  s($ >>> 0, h, b + i),
                  s(((g << 31) | ($ / 4294967296)) >>> 0, h, b + c));
              else {
                var _ = Math.floor(Math.log(d) / Math.LN2);
                (_ === 1024 && (_ = 1023),
                  ($ = d * Math.pow(2, -_)),
                  s(($ * 4503599627370496) >>> 0, h, b + i),
                  s(
                    ((g << 31) |
                      ((_ + 1023) << 20) |
                      (($ * 1048576) & 1048575)) >>>
                      0,
                    h,
                    b + c
                  ));
              }
            }
          }
          ((e.writeDoubleLE = o.bind(null, writeUintLE, 0, 4)),
            (e.writeDoubleBE = o.bind(null, writeUintBE, 4, 0)));
          function a(s, i, c, d, h) {
            var b = s(d, h + i),
              g = s(d, h + c),
              $ = (g >> 31) * 2 + 1,
              _ = (g >>> 20) & 2047,
              _e = 4294967296 * (g & 1048575) + b;
            return _ === 2047
              ? _e
                ? NaN
                : $ * (1 / 0)
              : _ === 0
                ? $ * 5e-324 * _e
                : $ * Math.pow(2, _ - 1075) * (_e + 4503599627370496);
          }
          ((e.readDoubleLE = a.bind(null, readUintLE, 0, 4)),
            (e.readDoubleBE = a.bind(null, readUintBE, 4, 0)));
        })(),
    e
  );
}
function writeUintLE(e, o, a) {
  ((o[a] = e & 255),
    (o[a + 1] = (e >>> 8) & 255),
    (o[a + 2] = (e >>> 16) & 255),
    (o[a + 3] = e >>> 24));
}
function writeUintBE(e, o, a) {
  ((o[a] = e >>> 24),
    (o[a + 1] = (e >>> 16) & 255),
    (o[a + 2] = (e >>> 8) & 255),
    (o[a + 3] = e & 255));
}
function readUintLE(e, o) {
  return (e[o] | (e[o + 1] << 8) | (e[o + 2] << 16) | (e[o + 3] << 24)) >>> 0;
}
function readUintBE(e, o) {
  return ((e[o] << 24) | (e[o + 1] << 16) | (e[o + 2] << 8) | e[o + 3]) >>> 0;
}
var inquire_1 = inquire;
function inquire(moduleName) {
  try {
    var mod = eval('quire'.replace(/^/, 're'))(moduleName);
    if (mod && (mod.length || Object.keys(mod).length)) return mod;
  } catch (e) {}
  return null;
}
var utf8$2 = {};
(function (e) {
  var o = e;
  ((o.length = function (s) {
    for (var i = 0, c = 0, d = 0; d < s.length; ++d)
      ((c = s.charCodeAt(d)),
        c < 128
          ? (i += 1)
          : c < 2048
            ? (i += 2)
            : (c & 64512) === 55296 && (s.charCodeAt(d + 1) & 64512) === 56320
              ? (++d, (i += 4))
              : (i += 3));
    return i;
  }),
    (o.read = function (s, i, c) {
      var d = c - i;
      if (d < 1) return '';
      for (var h = null, b = [], g = 0, $; i < c; )
        (($ = s[i++]),
          $ < 128
            ? (b[g++] = $)
            : $ > 191 && $ < 224
              ? (b[g++] = (($ & 31) << 6) | (s[i++] & 63))
              : $ > 239 && $ < 365
                ? (($ =
                    ((($ & 7) << 18) |
                      ((s[i++] & 63) << 12) |
                      ((s[i++] & 63) << 6) |
                      (s[i++] & 63)) -
                    65536),
                  (b[g++] = 55296 + ($ >> 10)),
                  (b[g++] = 56320 + ($ & 1023)))
                : (b[g++] =
                    (($ & 15) << 12) | ((s[i++] & 63) << 6) | (s[i++] & 63)),
          g > 8191 &&
            ((h || (h = [])).push(String.fromCharCode.apply(String, b)),
            (g = 0)));
      return h
        ? (g && h.push(String.fromCharCode.apply(String, b.slice(0, g))),
          h.join(''))
        : String.fromCharCode.apply(String, b.slice(0, g));
    }),
    (o.write = function (s, i, c) {
      for (var d = c, h, b, g = 0; g < s.length; ++g)
        ((h = s.charCodeAt(g)),
          h < 128
            ? (i[c++] = h)
            : h < 2048
              ? ((i[c++] = (h >> 6) | 192), (i[c++] = (h & 63) | 128))
              : (h & 64512) === 55296 &&
                  ((b = s.charCodeAt(g + 1)) & 64512) === 56320
                ? ((h = 65536 + ((h & 1023) << 10) + (b & 1023)),
                  ++g,
                  (i[c++] = (h >> 18) | 240),
                  (i[c++] = ((h >> 12) & 63) | 128),
                  (i[c++] = ((h >> 6) & 63) | 128),
                  (i[c++] = (h & 63) | 128))
                : ((i[c++] = (h >> 12) | 224),
                  (i[c++] = ((h >> 6) & 63) | 128),
                  (i[c++] = (h & 63) | 128)));
      return c - d;
    }));
})(utf8$2);
var pool_1 = pool;
function pool(e, o, a) {
  var s = a || 8192,
    i = s >>> 1,
    c = null,
    d = s;
  return function (b) {
    if (b < 1 || b > i) return e(b);
    d + b > s && ((c = e(s)), (d = 0));
    var g = o.call(c, d, (d += b));
    return (d & 7 && (d = (d | 7) + 1), g);
  };
}
var longbits, hasRequiredLongbits;
function requireLongbits() {
  if (hasRequiredLongbits) return longbits;
  ((hasRequiredLongbits = 1), (longbits = o));
  var e = requireMinimal();
  function o(c, d) {
    ((this.lo = c >>> 0), (this.hi = d >>> 0));
  }
  var a = (o.zero = new o(0, 0));
  ((a.toNumber = function () {
    return 0;
  }),
    (a.zzEncode = a.zzDecode =
      function () {
        return this;
      }),
    (a.length = function () {
      return 1;
    }));
  var s = (o.zeroHash = '\0\0\0\0\0\0\0\0');
  ((o.fromNumber = function (d) {
    if (d === 0) return a;
    var h = d < 0;
    h && (d = -d);
    var b = d >>> 0,
      g = ((d - b) / 4294967296) >>> 0;
    return (
      h &&
        ((g = ~g >>> 0),
        (b = ~b >>> 0),
        ++b > 4294967295 && ((b = 0), ++g > 4294967295 && (g = 0))),
      new o(b, g)
    );
  }),
    (o.from = function (d) {
      if (typeof d == 'number') return o.fromNumber(d);
      if (e.isString(d))
        if (e.Long) d = e.Long.fromString(d);
        else return o.fromNumber(parseInt(d, 10));
      return d.low || d.high ? new o(d.low >>> 0, d.high >>> 0) : a;
    }),
    (o.prototype.toNumber = function (d) {
      if (!d && this.hi >>> 31) {
        var h = (~this.lo + 1) >>> 0,
          b = ~this.hi >>> 0;
        return (h || (b = (b + 1) >>> 0), -(h + b * 4294967296));
      }
      return this.lo + this.hi * 4294967296;
    }),
    (o.prototype.toLong = function (d) {
      return e.Long
        ? new e.Long(this.lo | 0, this.hi | 0, !!d)
        : { low: this.lo | 0, high: this.hi | 0, unsigned: !!d };
    }));
  var i = String.prototype.charCodeAt;
  return (
    (o.fromHash = function (d) {
      return d === s
        ? a
        : new o(
            (i.call(d, 0) |
              (i.call(d, 1) << 8) |
              (i.call(d, 2) << 16) |
              (i.call(d, 3) << 24)) >>>
              0,
            (i.call(d, 4) |
              (i.call(d, 5) << 8) |
              (i.call(d, 6) << 16) |
              (i.call(d, 7) << 24)) >>>
              0
          );
    }),
    (o.prototype.toHash = function () {
      return String.fromCharCode(
        this.lo & 255,
        (this.lo >>> 8) & 255,
        (this.lo >>> 16) & 255,
        this.lo >>> 24,
        this.hi & 255,
        (this.hi >>> 8) & 255,
        (this.hi >>> 16) & 255,
        this.hi >>> 24
      );
    }),
    (o.prototype.zzEncode = function () {
      var d = this.hi >> 31;
      return (
        (this.hi = (((this.hi << 1) | (this.lo >>> 31)) ^ d) >>> 0),
        (this.lo = ((this.lo << 1) ^ d) >>> 0),
        this
      );
    }),
    (o.prototype.zzDecode = function () {
      var d = -(this.lo & 1);
      return (
        (this.lo = (((this.lo >>> 1) | (this.hi << 31)) ^ d) >>> 0),
        (this.hi = ((this.hi >>> 1) ^ d) >>> 0),
        this
      );
    }),
    (o.prototype.length = function () {
      var d = this.lo,
        h = ((this.lo >>> 28) | (this.hi << 4)) >>> 0,
        b = this.hi >>> 24;
      return b === 0
        ? h === 0
          ? d < 16384
            ? d < 128
              ? 1
              : 2
            : d < 2097152
              ? 3
              : 4
          : h < 16384
            ? h < 128
              ? 5
              : 6
            : h < 2097152
              ? 7
              : 8
        : b < 128
          ? 9
          : 10;
    }),
    longbits
  );
}
var hasRequiredMinimal;
function requireMinimal() {
  return (
    hasRequiredMinimal ||
      ((hasRequiredMinimal = 1),
      (function (e) {
        var o = e;
        ((o.asPromise = aspromise),
          (o.base64 = base64$1),
          (o.EventEmitter = eventemitter),
          (o.float = float),
          (o.inquire = inquire_1),
          (o.utf8 = utf8$2),
          (o.pool = pool_1),
          (o.LongBits = requireLongbits()),
          (o.isNode = !!(
            typeof commonjsGlobal < 'u' &&
            commonjsGlobal &&
            commonjsGlobal.process &&
            commonjsGlobal.process.versions &&
            commonjsGlobal.process.versions.node
          )),
          (o.global =
            (o.isNode && commonjsGlobal) ||
            (typeof window < 'u' && window) ||
            (typeof self < 'u' && self) ||
            commonjsGlobal),
          (o.emptyArray = Object.freeze ? Object.freeze([]) : []),
          (o.emptyObject = Object.freeze ? Object.freeze({}) : {}),
          (o.isInteger =
            Number.isInteger ||
            function (c) {
              return typeof c == 'number' && isFinite(c) && Math.floor(c) === c;
            }),
          (o.isString = function (c) {
            return typeof c == 'string' || c instanceof String;
          }),
          (o.isObject = function (c) {
            return c && typeof c == 'object';
          }),
          (o.isset = o.isSet =
            function (c, d) {
              var h = c[d];
              return h != null && c.hasOwnProperty(d)
                ? typeof h != 'object' ||
                    (Array.isArray(h) ? h.length : Object.keys(h).length) > 0
                : !1;
            }),
          (o.Buffer = (function () {
            try {
              var i = o.inquire('buffer').Buffer;
              return i.prototype.utf8Write ? i : null;
            } catch {
              return null;
            }
          })()),
          (o._Buffer_from = null),
          (o._Buffer_allocUnsafe = null),
          (o.newBuffer = function (c) {
            return typeof c == 'number'
              ? o.Buffer
                ? o._Buffer_allocUnsafe(c)
                : new o.Array(c)
              : o.Buffer
                ? o._Buffer_from(c)
                : typeof Uint8Array > 'u'
                  ? c
                  : new Uint8Array(c);
          }),
          (o.Array = typeof Uint8Array < 'u' ? Uint8Array : Array),
          (o.Long =
            (o.global.dcodeIO && o.global.dcodeIO.Long) ||
            o.global.Long ||
            o.inquire('long')),
          (o.key2Re = /^true|false|0|1$/),
          (o.key32Re = /^-?(?:0|[1-9][0-9]*)$/),
          (o.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/),
          (o.longToHash = function (c) {
            return c ? o.LongBits.from(c).toHash() : o.LongBits.zeroHash;
          }),
          (o.longFromHash = function (c, d) {
            var h = o.LongBits.fromHash(c);
            return o.Long ? o.Long.fromBits(h.lo, h.hi, d) : h.toNumber(!!d);
          }));
        function a(i, c, d) {
          for (var h = Object.keys(c), b = 0; b < h.length; ++b)
            (i[h[b]] === void 0 || !d) && (i[h[b]] = c[h[b]]);
          return i;
        }
        ((o.merge = a),
          (o.lcFirst = function (c) {
            return c.charAt(0).toLowerCase() + c.substring(1);
          }));
        function s(i) {
          function c(d, h) {
            if (!(this instanceof c)) return new c(d, h);
            (Object.defineProperty(this, 'message', {
              get: function () {
                return d;
              },
            }),
              Error.captureStackTrace
                ? Error.captureStackTrace(this, c)
                : Object.defineProperty(this, 'stack', {
                    value: new Error().stack || '',
                  }),
              h && a(this, h));
          }
          return (
            (c.prototype = Object.create(Error.prototype, {
              constructor: {
                value: c,
                writable: !0,
                enumerable: !1,
                configurable: !0,
              },
              name: {
                get: function () {
                  return i;
                },
                set: void 0,
                enumerable: !1,
                configurable: !0,
              },
              toString: {
                value: function () {
                  return this.name + ': ' + this.message;
                },
                writable: !0,
                enumerable: !1,
                configurable: !0,
              },
            })),
            c
          );
        }
        ((o.newError = s),
          (o.ProtocolError = s('ProtocolError')),
          (o.oneOfGetter = function (c) {
            for (var d = {}, h = 0; h < c.length; ++h) d[c[h]] = 1;
            return function () {
              for (var b = Object.keys(this), g = b.length - 1; g > -1; --g)
                if (
                  d[b[g]] === 1 &&
                  this[b[g]] !== void 0 &&
                  this[b[g]] !== null
                )
                  return b[g];
            };
          }),
          (o.oneOfSetter = function (c) {
            return function (d) {
              for (var h = 0; h < c.length; ++h)
                c[h] !== d && delete this[c[h]];
            };
          }),
          (o.toJSONOptions = {
            longs: String,
            enums: String,
            bytes: String,
            json: !0,
          }),
          (o._configure = function () {
            var i = o.Buffer;
            if (!i) {
              o._Buffer_from = o._Buffer_allocUnsafe = null;
              return;
            }
            ((o._Buffer_from =
              (i.from !== Uint8Array.from && i.from) ||
              function (d, h) {
                return new i(d, h);
              }),
              (o._Buffer_allocUnsafe =
                i.allocUnsafe ||
                function (d) {
                  return new i(d);
                }));
          }));
      })(minimal$1)),
    minimal$1
  );
}
var writer = Writer$1,
  util$4 = requireMinimal(),
  BufferWriter$1,
  LongBits$1 = util$4.LongBits,
  base64 = util$4.base64,
  utf8$1 = util$4.utf8;
function Op(e, o, a) {
  ((this.fn = e), (this.len = o), (this.next = void 0), (this.val = a));
}
function noop() {}
function State(e) {
  ((this.head = e.head),
    (this.tail = e.tail),
    (this.len = e.len),
    (this.next = e.states));
}
function Writer$1() {
  ((this.len = 0),
    (this.head = new Op(noop, 0, 0)),
    (this.tail = this.head),
    (this.states = null));
}
var create$2 = function e() {
  return util$4.Buffer
    ? function () {
        return (Writer$1.create = function () {
          return new BufferWriter$1();
        })();
      }
    : function () {
        return new Writer$1();
      };
};
Writer$1.create = create$2();
Writer$1.alloc = function e(o) {
  return new util$4.Array(o);
};
util$4.Array !== Array &&
  (Writer$1.alloc = util$4.pool(
    Writer$1.alloc,
    util$4.Array.prototype.subarray
  ));
Writer$1.prototype._push = function e(o, a, s) {
  return (
    (this.tail = this.tail.next = new Op(o, a, s)),
    (this.len += a),
    this
  );
};
function writeByte(e, o, a) {
  o[a] = e & 255;
}
function writeVarint32(e, o, a) {
  for (; e > 127; ) ((o[a++] = (e & 127) | 128), (e >>>= 7));
  o[a] = e;
}
function VarintOp(e, o) {
  ((this.len = e), (this.next = void 0), (this.val = o));
}
VarintOp.prototype = Object.create(Op.prototype);
VarintOp.prototype.fn = writeVarint32;
Writer$1.prototype.uint32 = function e(o) {
  return (
    (this.len += (this.tail = this.tail.next =
      new VarintOp(
        (o = o >>> 0) < 128
          ? 1
          : o < 16384
            ? 2
            : o < 2097152
              ? 3
              : o < 268435456
                ? 4
                : 5,
        o
      )).len),
    this
  );
};
Writer$1.prototype.int32 = function e(o) {
  return o < 0
    ? this._push(writeVarint64, 10, LongBits$1.fromNumber(o))
    : this.uint32(o);
};
Writer$1.prototype.sint32 = function e(o) {
  return this.uint32(((o << 1) ^ (o >> 31)) >>> 0);
};
function writeVarint64(e, o, a) {
  for (; e.hi; )
    ((o[a++] = (e.lo & 127) | 128),
      (e.lo = ((e.lo >>> 7) | (e.hi << 25)) >>> 0),
      (e.hi >>>= 7));
  for (; e.lo > 127; ) ((o[a++] = (e.lo & 127) | 128), (e.lo = e.lo >>> 7));
  o[a++] = e.lo;
}
Writer$1.prototype.uint64 = function e(o) {
  var a = LongBits$1.from(o);
  return this._push(writeVarint64, a.length(), a);
};
Writer$1.prototype.int64 = Writer$1.prototype.uint64;
Writer$1.prototype.sint64 = function e(o) {
  var a = LongBits$1.from(o).zzEncode();
  return this._push(writeVarint64, a.length(), a);
};
Writer$1.prototype.bool = function e(o) {
  return this._push(writeByte, 1, o ? 1 : 0);
};
function writeFixed32(e, o, a) {
  ((o[a] = e & 255),
    (o[a + 1] = (e >>> 8) & 255),
    (o[a + 2] = (e >>> 16) & 255),
    (o[a + 3] = e >>> 24));
}
Writer$1.prototype.fixed32 = function e(o) {
  return this._push(writeFixed32, 4, o >>> 0);
};
Writer$1.prototype.sfixed32 = Writer$1.prototype.fixed32;
Writer$1.prototype.fixed64 = function e(o) {
  var a = LongBits$1.from(o);
  return this._push(writeFixed32, 4, a.lo)._push(writeFixed32, 4, a.hi);
};
Writer$1.prototype.sfixed64 = Writer$1.prototype.fixed64;
Writer$1.prototype.float = function e(o) {
  return this._push(util$4.float.writeFloatLE, 4, o);
};
Writer$1.prototype.double = function e(o) {
  return this._push(util$4.float.writeDoubleLE, 8, o);
};
var writeBytes = util$4.Array.prototype.set
  ? function e(o, a, s) {
      a.set(o, s);
    }
  : function e(o, a, s) {
      for (var i = 0; i < o.length; ++i) a[s + i] = o[i];
    };
Writer$1.prototype.bytes = function e(o) {
  var a = o.length >>> 0;
  if (!a) return this._push(writeByte, 1, 0);
  if (util$4.isString(o)) {
    var s = Writer$1.alloc((a = base64.length(o)));
    (base64.decode(o, s, 0), (o = s));
  }
  return this.uint32(a)._push(writeBytes, a, o);
};
Writer$1.prototype.string = function e(o) {
  var a = utf8$1.length(o);
  return a
    ? this.uint32(a)._push(utf8$1.write, a, o)
    : this._push(writeByte, 1, 0);
};
Writer$1.prototype.fork = function e() {
  return (
    (this.states = new State(this)),
    (this.head = this.tail = new Op(noop, 0, 0)),
    (this.len = 0),
    this
  );
};
Writer$1.prototype.reset = function e() {
  return (
    this.states
      ? ((this.head = this.states.head),
        (this.tail = this.states.tail),
        (this.len = this.states.len),
        (this.states = this.states.next))
      : ((this.head = this.tail = new Op(noop, 0, 0)), (this.len = 0)),
    this
  );
};
Writer$1.prototype.ldelim = function e() {
  var o = this.head,
    a = this.tail,
    s = this.len;
  return (
    this.reset().uint32(s),
    s && ((this.tail.next = o.next), (this.tail = a), (this.len += s)),
    this
  );
};
Writer$1.prototype.finish = function e() {
  for (var o = this.head.next, a = this.constructor.alloc(this.len), s = 0; o; )
    (o.fn(o.val, a, s), (s += o.len), (o = o.next));
  return a;
};
Writer$1._configure = function (e) {
  ((BufferWriter$1 = e),
    (Writer$1.create = create$2()),
    BufferWriter$1._configure());
};
var writer_buffer = BufferWriter,
  Writer = writer;
(BufferWriter.prototype = Object.create(Writer.prototype)).constructor =
  BufferWriter;
var util$3 = requireMinimal();
function BufferWriter() {
  Writer.call(this);
}
BufferWriter._configure = function () {
  ((BufferWriter.alloc = util$3._Buffer_allocUnsafe),
    (BufferWriter.writeBytesBuffer =
      util$3.Buffer &&
      util$3.Buffer.prototype instanceof Uint8Array &&
      util$3.Buffer.prototype.set.name === 'set'
        ? function (o, a, s) {
            a.set(o, s);
          }
        : function (o, a, s) {
            if (o.copy) o.copy(a, s, 0, o.length);
            else for (var i = 0; i < o.length; ) a[s++] = o[i++];
          }));
};
BufferWriter.prototype.bytes = function e(o) {
  util$3.isString(o) && (o = util$3._Buffer_from(o, 'base64'));
  var a = o.length >>> 0;
  return (
    this.uint32(a),
    a && this._push(BufferWriter.writeBytesBuffer, a, o),
    this
  );
};
function writeStringBuffer(e, o, a) {
  e.length < 40
    ? util$3.utf8.write(e, o, a)
    : o.utf8Write
      ? o.utf8Write(e, a)
      : o.write(e, a);
}
BufferWriter.prototype.string = function e(o) {
  var a = util$3.Buffer.byteLength(o);
  return (this.uint32(a), a && this._push(writeStringBuffer, a, o), this);
};
BufferWriter._configure();
var reader = Reader$1,
  util$2 = requireMinimal(),
  BufferReader$1,
  LongBits = util$2.LongBits,
  utf8 = util$2.utf8;
function indexOutOfRange(e, o) {
  return RangeError(
    'index out of range: ' + e.pos + ' + ' + (o || 1) + ' > ' + e.len
  );
}
function Reader$1(e) {
  ((this.buf = e), (this.pos = 0), (this.len = e.length));
}
var create_array =
    typeof Uint8Array < 'u'
      ? function e(o) {
          if (o instanceof Uint8Array || Array.isArray(o))
            return new Reader$1(o);
          throw Error('illegal buffer');
        }
      : function e(o) {
          if (Array.isArray(o)) return new Reader$1(o);
          throw Error('illegal buffer');
        },
  create$1 = function e() {
    return util$2.Buffer
      ? function (a) {
          return (Reader$1.create = function (i) {
            return util$2.Buffer.isBuffer(i)
              ? new BufferReader$1(i)
              : create_array(i);
          })(a);
        }
      : create_array;
  };
Reader$1.create = create$1();
Reader$1.prototype._slice =
  util$2.Array.prototype.subarray || util$2.Array.prototype.slice;
Reader$1.prototype.uint32 = (function e() {
  var o = 4294967295;
  return function () {
    if (
      ((o = (this.buf[this.pos] & 127) >>> 0),
      this.buf[this.pos++] < 128 ||
        ((o = (o | ((this.buf[this.pos] & 127) << 7)) >>> 0),
        this.buf[this.pos++] < 128) ||
        ((o = (o | ((this.buf[this.pos] & 127) << 14)) >>> 0),
        this.buf[this.pos++] < 128) ||
        ((o = (o | ((this.buf[this.pos] & 127) << 21)) >>> 0),
        this.buf[this.pos++] < 128) ||
        ((o = (o | ((this.buf[this.pos] & 15) << 28)) >>> 0),
        this.buf[this.pos++] < 128))
    )
      return o;
    if ((this.pos += 5) > this.len)
      throw ((this.pos = this.len), indexOutOfRange(this, 10));
    return o;
  };
})();
Reader$1.prototype.int32 = function e() {
  return this.uint32() | 0;
};
Reader$1.prototype.sint32 = function e() {
  var o = this.uint32();
  return ((o >>> 1) ^ -(o & 1)) | 0;
};
function readLongVarint() {
  var e = new LongBits(0, 0),
    o = 0;
  if (this.len - this.pos > 4) {
    for (; o < 4; ++o)
      if (
        ((e.lo = (e.lo | ((this.buf[this.pos] & 127) << (o * 7))) >>> 0),
        this.buf[this.pos++] < 128)
      )
        return e;
    if (
      ((e.lo = (e.lo | ((this.buf[this.pos] & 127) << 28)) >>> 0),
      (e.hi = (e.hi | ((this.buf[this.pos] & 127) >> 4)) >>> 0),
      this.buf[this.pos++] < 128)
    )
      return e;
    o = 0;
  } else {
    for (; o < 3; ++o) {
      if (this.pos >= this.len) throw indexOutOfRange(this);
      if (
        ((e.lo = (e.lo | ((this.buf[this.pos] & 127) << (o * 7))) >>> 0),
        this.buf[this.pos++] < 128)
      )
        return e;
    }
    return (
      (e.lo = (e.lo | ((this.buf[this.pos++] & 127) << (o * 7))) >>> 0),
      e
    );
  }
  if (this.len - this.pos > 4) {
    for (; o < 5; ++o)
      if (
        ((e.hi = (e.hi | ((this.buf[this.pos] & 127) << (o * 7 + 3))) >>> 0),
        this.buf[this.pos++] < 128)
      )
        return e;
  } else
    for (; o < 5; ++o) {
      if (this.pos >= this.len) throw indexOutOfRange(this);
      if (
        ((e.hi = (e.hi | ((this.buf[this.pos] & 127) << (o * 7 + 3))) >>> 0),
        this.buf[this.pos++] < 128)
      )
        return e;
    }
  throw Error('invalid varint encoding');
}
Reader$1.prototype.bool = function e() {
  return this.uint32() !== 0;
};
function readFixed32_end(e, o) {
  return (
    (e[o - 4] | (e[o - 3] << 8) | (e[o - 2] << 16) | (e[o - 1] << 24)) >>> 0
  );
}
Reader$1.prototype.fixed32 = function e() {
  if (this.pos + 4 > this.len) throw indexOutOfRange(this, 4);
  return readFixed32_end(this.buf, (this.pos += 4));
};
Reader$1.prototype.sfixed32 = function e() {
  if (this.pos + 4 > this.len) throw indexOutOfRange(this, 4);
  return readFixed32_end(this.buf, (this.pos += 4)) | 0;
};
function readFixed64() {
  if (this.pos + 8 > this.len) throw indexOutOfRange(this, 8);
  return new LongBits(
    readFixed32_end(this.buf, (this.pos += 4)),
    readFixed32_end(this.buf, (this.pos += 4))
  );
}
Reader$1.prototype.float = function e() {
  if (this.pos + 4 > this.len) throw indexOutOfRange(this, 4);
  var o = util$2.float.readFloatLE(this.buf, this.pos);
  return ((this.pos += 4), o);
};
Reader$1.prototype.double = function e() {
  if (this.pos + 8 > this.len) throw indexOutOfRange(this, 4);
  var o = util$2.float.readDoubleLE(this.buf, this.pos);
  return ((this.pos += 8), o);
};
Reader$1.prototype.bytes = function e() {
  var o = this.uint32(),
    a = this.pos,
    s = this.pos + o;
  if (s > this.len) throw indexOutOfRange(this, o);
  if (((this.pos += o), Array.isArray(this.buf))) return this.buf.slice(a, s);
  if (a === s) {
    var i = util$2.Buffer;
    return i ? i.alloc(0) : new this.buf.constructor(0);
  }
  return this._slice.call(this.buf, a, s);
};
Reader$1.prototype.string = function e() {
  var o = this.bytes();
  return utf8.read(o, 0, o.length);
};
Reader$1.prototype.skip = function e(o) {
  if (typeof o == 'number') {
    if (this.pos + o > this.len) throw indexOutOfRange(this, o);
    this.pos += o;
  } else
    do if (this.pos >= this.len) throw indexOutOfRange(this);
    while (this.buf[this.pos++] & 128);
  return this;
};
Reader$1.prototype.skipType = function (e) {
  switch (e) {
    case 0:
      this.skip();
      break;
    case 1:
      this.skip(8);
      break;
    case 2:
      this.skip(this.uint32());
      break;
    case 3:
      for (; (e = this.uint32() & 7) !== 4; ) this.skipType(e);
      break;
    case 5:
      this.skip(4);
      break;
    default:
      throw Error('invalid wire type ' + e + ' at offset ' + this.pos);
  }
  return this;
};
Reader$1._configure = function (e) {
  ((BufferReader$1 = e),
    (Reader$1.create = create$1()),
    BufferReader$1._configure());
  var o = util$2.Long ? 'toLong' : 'toNumber';
  util$2.merge(Reader$1.prototype, {
    int64: function () {
      return readLongVarint.call(this)[o](!1);
    },
    uint64: function () {
      return readLongVarint.call(this)[o](!0);
    },
    sint64: function () {
      return readLongVarint.call(this).zzDecode()[o](!1);
    },
    fixed64: function () {
      return readFixed64.call(this)[o](!0);
    },
    sfixed64: function () {
      return readFixed64.call(this)[o](!1);
    },
  });
};
var reader_buffer = BufferReader,
  Reader = reader;
(BufferReader.prototype = Object.create(Reader.prototype)).constructor =
  BufferReader;
var util$1 = requireMinimal();
function BufferReader(e) {
  Reader.call(this, e);
}
BufferReader._configure = function () {
  util$1.Buffer &&
    (BufferReader.prototype._slice = util$1.Buffer.prototype.slice);
};
BufferReader.prototype.string = function e() {
  var o = this.uint32();
  return this.buf.utf8Slice
    ? this.buf.utf8Slice(
        this.pos,
        (this.pos = Math.min(this.pos + o, this.len))
      )
    : this.buf.toString(
        'utf-8',
        this.pos,
        (this.pos = Math.min(this.pos + o, this.len))
      );
};
BufferReader._configure();
var rpc = {},
  service = Service,
  util = requireMinimal();
(Service.prototype = Object.create(util.EventEmitter.prototype)).constructor =
  Service;
function Service(e, o, a) {
  if (typeof e != 'function') throw TypeError('rpcImpl must be a function');
  (util.EventEmitter.call(this),
    (this.rpcImpl = e),
    (this.requestDelimited = !!o),
    (this.responseDelimited = !!a));
}
Service.prototype.rpcCall = function e(o, a, s, i, c) {
  if (!i) throw TypeError('request must be specified');
  var d = this;
  if (!c) return util.asPromise(e, d, o, a, s, i);
  if (!d.rpcImpl) {
    setTimeout(function () {
      c(Error('already ended'));
    }, 0);
    return;
  }
  try {
    return d.rpcImpl(
      o,
      a[d.requestDelimited ? 'encodeDelimited' : 'encode'](i).finish(),
      function (b, g) {
        if (b) return (d.emit('error', b, o), c(b));
        if (g === null) {
          d.end(!0);
          return;
        }
        if (!(g instanceof s))
          try {
            g = s[d.responseDelimited ? 'decodeDelimited' : 'decode'](g);
          } catch ($) {
            return (d.emit('error', $, o), c($));
          }
        return (d.emit('data', g, o), c(null, g));
      }
    );
  } catch (h) {
    (d.emit('error', h, o),
      setTimeout(function () {
        c(h);
      }, 0));
    return;
  }
};
Service.prototype.end = function e(o) {
  return (
    this.rpcImpl &&
      (o || this.rpcImpl(null, null, null),
      (this.rpcImpl = null),
      this.emit('end').off()),
    this
  );
};
(function (e) {
  var o = e;
  o.Service = service;
})(rpc);
var roots = {};
(function (e) {
  var o = e;
  ((o.build = 'minimal'),
    (o.Writer = writer),
    (o.BufferWriter = writer_buffer),
    (o.Reader = reader),
    (o.BufferReader = reader_buffer),
    (o.util = requireMinimal()),
    (o.rpc = rpc),
    (o.roots = roots),
    (o.configure = a));
  function a() {
    (o.util._configure(),
      o.Writer._configure(o.BufferWriter),
      o.Reader._configure(o.BufferReader));
  }
  a();
})(indexMinimal);
var minimal = indexMinimal;
const $protobuf = getDefaultExportFromCjs(minimal),
  $Reader = $protobuf.Reader,
  $Writer = $protobuf.Writer,
  $util = $protobuf.util,
  $root =
    $protobuf.roots['ipfs-unixfs'] || ($protobuf.roots['ipfs-unixfs'] = {});
$root.Data = (() => {
  function e(o) {
    if (((this.blocksizes = []), o))
      for (var a = Object.keys(o), s = 0; s < a.length; ++s)
        o[a[s]] != null && (this[a[s]] = o[a[s]]);
  }
  return (
    (e.prototype.Type = 0),
    (e.prototype.Data = $util.newBuffer([])),
    (e.prototype.filesize = $util.Long ? $util.Long.fromBits(0, 0, !0) : 0),
    (e.prototype.blocksizes = $util.emptyArray),
    (e.prototype.hashType = $util.Long ? $util.Long.fromBits(0, 0, !0) : 0),
    (e.prototype.fanout = $util.Long ? $util.Long.fromBits(0, 0, !0) : 0),
    (e.prototype.mode = 0),
    (e.prototype.mtime = null),
    (e.encode = function (a, s) {
      if (
        (s || (s = $Writer.create()),
        s.uint32(8).int32(a.Type),
        a.Data != null &&
          Object.hasOwnProperty.call(a, 'Data') &&
          s.uint32(18).bytes(a.Data),
        a.filesize != null &&
          Object.hasOwnProperty.call(a, 'filesize') &&
          s.uint32(24).uint64(a.filesize),
        a.blocksizes != null && a.blocksizes.length)
      )
        for (var i = 0; i < a.blocksizes.length; ++i)
          s.uint32(32).uint64(a.blocksizes[i]);
      return (
        a.hashType != null &&
          Object.hasOwnProperty.call(a, 'hashType') &&
          s.uint32(40).uint64(a.hashType),
        a.fanout != null &&
          Object.hasOwnProperty.call(a, 'fanout') &&
          s.uint32(48).uint64(a.fanout),
        a.mode != null &&
          Object.hasOwnProperty.call(a, 'mode') &&
          s.uint32(56).uint32(a.mode),
        a.mtime != null &&
          Object.hasOwnProperty.call(a, 'mtime') &&
          $root.UnixTime.encode(a.mtime, s.uint32(66).fork()).ldelim(),
        s
      );
    }),
    (e.decode = function (a, s) {
      a instanceof $Reader || (a = $Reader.create(a));
      for (
        var i = s === void 0 ? a.len : a.pos + s, c = new $root.Data();
        a.pos < i;

      ) {
        var d = a.uint32();
        switch (d >>> 3) {
          case 1:
            c.Type = a.int32();
            break;
          case 2:
            c.Data = a.bytes();
            break;
          case 3:
            c.filesize = a.uint64();
            break;
          case 4:
            if (
              ((c.blocksizes && c.blocksizes.length) || (c.blocksizes = []),
              (d & 7) === 2)
            )
              for (var h = a.uint32() + a.pos; a.pos < h; )
                c.blocksizes.push(a.uint64());
            else c.blocksizes.push(a.uint64());
            break;
          case 5:
            c.hashType = a.uint64();
            break;
          case 6:
            c.fanout = a.uint64();
            break;
          case 7:
            c.mode = a.uint32();
            break;
          case 8:
            c.mtime = $root.UnixTime.decode(a, a.uint32());
            break;
          default:
            a.skipType(d & 7);
            break;
        }
      }
      if (!c.hasOwnProperty('Type'))
        throw $util.ProtocolError("missing required 'Type'", { instance: c });
      return c;
    }),
    (e.fromObject = function (a) {
      if (a instanceof $root.Data) return a;
      var s = new $root.Data();
      switch (a.Type) {
        case 'Raw':
        case 0:
          s.Type = 0;
          break;
        case 'Directory':
        case 1:
          s.Type = 1;
          break;
        case 'File':
        case 2:
          s.Type = 2;
          break;
        case 'Metadata':
        case 3:
          s.Type = 3;
          break;
        case 'Symlink':
        case 4:
          s.Type = 4;
          break;
        case 'HAMTShard':
        case 5:
          s.Type = 5;
          break;
      }
      if (
        (a.Data != null &&
          (typeof a.Data == 'string'
            ? $util.base64.decode(
                a.Data,
                (s.Data = $util.newBuffer($util.base64.length(a.Data))),
                0
              )
            : a.Data.length && (s.Data = a.Data)),
        a.filesize != null &&
          ($util.Long
            ? ((s.filesize = $util.Long.fromValue(a.filesize)).unsigned = !0)
            : typeof a.filesize == 'string'
              ? (s.filesize = parseInt(a.filesize, 10))
              : typeof a.filesize == 'number'
                ? (s.filesize = a.filesize)
                : typeof a.filesize == 'object' &&
                  (s.filesize = new $util.LongBits(
                    a.filesize.low >>> 0,
                    a.filesize.high >>> 0
                  ).toNumber(!0))),
        a.blocksizes)
      ) {
        if (!Array.isArray(a.blocksizes))
          throw TypeError('.Data.blocksizes: array expected');
        s.blocksizes = [];
        for (var i = 0; i < a.blocksizes.length; ++i)
          $util.Long
            ? ((s.blocksizes[i] = $util.Long.fromValue(
                a.blocksizes[i]
              )).unsigned = !0)
            : typeof a.blocksizes[i] == 'string'
              ? (s.blocksizes[i] = parseInt(a.blocksizes[i], 10))
              : typeof a.blocksizes[i] == 'number'
                ? (s.blocksizes[i] = a.blocksizes[i])
                : typeof a.blocksizes[i] == 'object' &&
                  (s.blocksizes[i] = new $util.LongBits(
                    a.blocksizes[i].low >>> 0,
                    a.blocksizes[i].high >>> 0
                  ).toNumber(!0));
      }
      if (
        (a.hashType != null &&
          ($util.Long
            ? ((s.hashType = $util.Long.fromValue(a.hashType)).unsigned = !0)
            : typeof a.hashType == 'string'
              ? (s.hashType = parseInt(a.hashType, 10))
              : typeof a.hashType == 'number'
                ? (s.hashType = a.hashType)
                : typeof a.hashType == 'object' &&
                  (s.hashType = new $util.LongBits(
                    a.hashType.low >>> 0,
                    a.hashType.high >>> 0
                  ).toNumber(!0))),
        a.fanout != null &&
          ($util.Long
            ? ((s.fanout = $util.Long.fromValue(a.fanout)).unsigned = !0)
            : typeof a.fanout == 'string'
              ? (s.fanout = parseInt(a.fanout, 10))
              : typeof a.fanout == 'number'
                ? (s.fanout = a.fanout)
                : typeof a.fanout == 'object' &&
                  (s.fanout = new $util.LongBits(
                    a.fanout.low >>> 0,
                    a.fanout.high >>> 0
                  ).toNumber(!0))),
        a.mode != null && (s.mode = a.mode >>> 0),
        a.mtime != null)
      ) {
        if (typeof a.mtime != 'object')
          throw TypeError('.Data.mtime: object expected');
        s.mtime = $root.UnixTime.fromObject(a.mtime);
      }
      return s;
    }),
    (e.toObject = function (a, s) {
      s || (s = {});
      var i = {};
      if (((s.arrays || s.defaults) && (i.blocksizes = []), s.defaults)) {
        if (
          ((i.Type = s.enums === String ? 'Raw' : 0),
          s.bytes === String
            ? (i.Data = '')
            : ((i.Data = []),
              s.bytes !== Array && (i.Data = $util.newBuffer(i.Data))),
          $util.Long)
        ) {
          var c = new $util.Long(0, 0, !0);
          i.filesize =
            s.longs === String
              ? c.toString()
              : s.longs === Number
                ? c.toNumber()
                : c;
        } else i.filesize = s.longs === String ? '0' : 0;
        if ($util.Long) {
          var c = new $util.Long(0, 0, !0);
          i.hashType =
            s.longs === String
              ? c.toString()
              : s.longs === Number
                ? c.toNumber()
                : c;
        } else i.hashType = s.longs === String ? '0' : 0;
        if ($util.Long) {
          var c = new $util.Long(0, 0, !0);
          i.fanout =
            s.longs === String
              ? c.toString()
              : s.longs === Number
                ? c.toNumber()
                : c;
        } else i.fanout = s.longs === String ? '0' : 0;
        ((i.mode = 0), (i.mtime = null));
      }
      if (
        (a.Type != null &&
          a.hasOwnProperty('Type') &&
          (i.Type = s.enums === String ? $root.Data.DataType[a.Type] : a.Type),
        a.Data != null &&
          a.hasOwnProperty('Data') &&
          (i.Data =
            s.bytes === String
              ? $util.base64.encode(a.Data, 0, a.Data.length)
              : s.bytes === Array
                ? Array.prototype.slice.call(a.Data)
                : a.Data),
        a.filesize != null &&
          a.hasOwnProperty('filesize') &&
          (typeof a.filesize == 'number'
            ? (i.filesize =
                s.longs === String ? String(a.filesize) : a.filesize)
            : (i.filesize =
                s.longs === String
                  ? $util.Long.prototype.toString.call(a.filesize)
                  : s.longs === Number
                    ? new $util.LongBits(
                        a.filesize.low >>> 0,
                        a.filesize.high >>> 0
                      ).toNumber(!0)
                    : a.filesize)),
        a.blocksizes && a.blocksizes.length)
      ) {
        i.blocksizes = [];
        for (var d = 0; d < a.blocksizes.length; ++d)
          typeof a.blocksizes[d] == 'number'
            ? (i.blocksizes[d] =
                s.longs === String ? String(a.blocksizes[d]) : a.blocksizes[d])
            : (i.blocksizes[d] =
                s.longs === String
                  ? $util.Long.prototype.toString.call(a.blocksizes[d])
                  : s.longs === Number
                    ? new $util.LongBits(
                        a.blocksizes[d].low >>> 0,
                        a.blocksizes[d].high >>> 0
                      ).toNumber(!0)
                    : a.blocksizes[d]);
      }
      return (
        a.hashType != null &&
          a.hasOwnProperty('hashType') &&
          (typeof a.hashType == 'number'
            ? (i.hashType =
                s.longs === String ? String(a.hashType) : a.hashType)
            : (i.hashType =
                s.longs === String
                  ? $util.Long.prototype.toString.call(a.hashType)
                  : s.longs === Number
                    ? new $util.LongBits(
                        a.hashType.low >>> 0,
                        a.hashType.high >>> 0
                      ).toNumber(!0)
                    : a.hashType)),
        a.fanout != null &&
          a.hasOwnProperty('fanout') &&
          (typeof a.fanout == 'number'
            ? (i.fanout = s.longs === String ? String(a.fanout) : a.fanout)
            : (i.fanout =
                s.longs === String
                  ? $util.Long.prototype.toString.call(a.fanout)
                  : s.longs === Number
                    ? new $util.LongBits(
                        a.fanout.low >>> 0,
                        a.fanout.high >>> 0
                      ).toNumber(!0)
                    : a.fanout)),
        a.mode != null && a.hasOwnProperty('mode') && (i.mode = a.mode),
        a.mtime != null &&
          a.hasOwnProperty('mtime') &&
          (i.mtime = $root.UnixTime.toObject(a.mtime, s)),
        i
      );
    }),
    (e.prototype.toJSON = function () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    }),
    (e.DataType = (function () {
      const o = {},
        a = Object.create(o);
      return (
        (a[(o[0] = 'Raw')] = 0),
        (a[(o[1] = 'Directory')] = 1),
        (a[(o[2] = 'File')] = 2),
        (a[(o[3] = 'Metadata')] = 3),
        (a[(o[4] = 'Symlink')] = 4),
        (a[(o[5] = 'HAMTShard')] = 5),
        a
      );
    })()),
    e
  );
})();
$root.UnixTime = (() => {
  function e(o) {
    if (o)
      for (var a = Object.keys(o), s = 0; s < a.length; ++s)
        o[a[s]] != null && (this[a[s]] = o[a[s]]);
  }
  return (
    (e.prototype.Seconds = $util.Long ? $util.Long.fromBits(0, 0, !1) : 0),
    (e.prototype.FractionalNanoseconds = 0),
    (e.encode = function (a, s) {
      return (
        s || (s = $Writer.create()),
        s.uint32(8).int64(a.Seconds),
        a.FractionalNanoseconds != null &&
          Object.hasOwnProperty.call(a, 'FractionalNanoseconds') &&
          s.uint32(21).fixed32(a.FractionalNanoseconds),
        s
      );
    }),
    (e.decode = function (a, s) {
      a instanceof $Reader || (a = $Reader.create(a));
      for (
        var i = s === void 0 ? a.len : a.pos + s, c = new $root.UnixTime();
        a.pos < i;

      ) {
        var d = a.uint32();
        switch (d >>> 3) {
          case 1:
            c.Seconds = a.int64();
            break;
          case 2:
            c.FractionalNanoseconds = a.fixed32();
            break;
          default:
            a.skipType(d & 7);
            break;
        }
      }
      if (!c.hasOwnProperty('Seconds'))
        throw $util.ProtocolError("missing required 'Seconds'", {
          instance: c,
        });
      return c;
    }),
    (e.fromObject = function (a) {
      if (a instanceof $root.UnixTime) return a;
      var s = new $root.UnixTime();
      return (
        a.Seconds != null &&
          ($util.Long
            ? ((s.Seconds = $util.Long.fromValue(a.Seconds)).unsigned = !1)
            : typeof a.Seconds == 'string'
              ? (s.Seconds = parseInt(a.Seconds, 10))
              : typeof a.Seconds == 'number'
                ? (s.Seconds = a.Seconds)
                : typeof a.Seconds == 'object' &&
                  (s.Seconds = new $util.LongBits(
                    a.Seconds.low >>> 0,
                    a.Seconds.high >>> 0
                  ).toNumber())),
        a.FractionalNanoseconds != null &&
          (s.FractionalNanoseconds = a.FractionalNanoseconds >>> 0),
        s
      );
    }),
    (e.toObject = function (a, s) {
      s || (s = {});
      var i = {};
      if (s.defaults) {
        if ($util.Long) {
          var c = new $util.Long(0, 0, !1);
          i.Seconds =
            s.longs === String
              ? c.toString()
              : s.longs === Number
                ? c.toNumber()
                : c;
        } else i.Seconds = s.longs === String ? '0' : 0;
        i.FractionalNanoseconds = 0;
      }
      return (
        a.Seconds != null &&
          a.hasOwnProperty('Seconds') &&
          (typeof a.Seconds == 'number'
            ? (i.Seconds = s.longs === String ? String(a.Seconds) : a.Seconds)
            : (i.Seconds =
                s.longs === String
                  ? $util.Long.prototype.toString.call(a.Seconds)
                  : s.longs === Number
                    ? new $util.LongBits(
                        a.Seconds.low >>> 0,
                        a.Seconds.high >>> 0
                      ).toNumber()
                    : a.Seconds)),
        a.FractionalNanoseconds != null &&
          a.hasOwnProperty('FractionalNanoseconds') &&
          (i.FractionalNanoseconds = a.FractionalNanoseconds),
        i
      );
    }),
    (e.prototype.toJSON = function () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    }),
    e
  );
})();
$root.Metadata = (() => {
  function e(o) {
    if (o)
      for (var a = Object.keys(o), s = 0; s < a.length; ++s)
        o[a[s]] != null && (this[a[s]] = o[a[s]]);
  }
  return (
    (e.prototype.MimeType = ''),
    (e.encode = function (a, s) {
      return (
        s || (s = $Writer.create()),
        a.MimeType != null &&
          Object.hasOwnProperty.call(a, 'MimeType') &&
          s.uint32(10).string(a.MimeType),
        s
      );
    }),
    (e.decode = function (a, s) {
      a instanceof $Reader || (a = $Reader.create(a));
      for (
        var i = s === void 0 ? a.len : a.pos + s, c = new $root.Metadata();
        a.pos < i;

      ) {
        var d = a.uint32();
        switch (d >>> 3) {
          case 1:
            c.MimeType = a.string();
            break;
          default:
            a.skipType(d & 7);
            break;
        }
      }
      return c;
    }),
    (e.fromObject = function (a) {
      if (a instanceof $root.Metadata) return a;
      var s = new $root.Metadata();
      return (a.MimeType != null && (s.MimeType = String(a.MimeType)), s);
    }),
    (e.toObject = function (a, s) {
      s || (s = {});
      var i = {};
      return (
        s.defaults && (i.MimeType = ''),
        a.MimeType != null &&
          a.hasOwnProperty('MimeType') &&
          (i.MimeType = a.MimeType),
        i
      );
    }),
    (e.prototype.toJSON = function () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    }),
    e
  );
})();
function parseMode(e) {
  if (e != null)
    return typeof e == 'number'
      ? e & 4095
      : ((e = e.toString()),
        e.substring(0, 1) === '0'
          ? parseInt(e, 8) & 4095
          : parseInt(e, 10) & 4095);
}
function parseMtime(e) {
  if (e == null) return;
  let o;
  if (
    (e.secs != null && (o = { secs: e.secs, nsecs: e.nsecs }),
    e.Seconds != null &&
      (o = { secs: e.Seconds, nsecs: e.FractionalNanoseconds }),
    Array.isArray(e) && (o = { secs: e[0], nsecs: e[1] }),
    e instanceof Date)
  ) {
    const a = e.getTime(),
      s = Math.floor(a / 1e3);
    o = { secs: s, nsecs: (a - s * 1e3) * 1e3 };
  }
  if (Object.prototype.hasOwnProperty.call(o, 'secs')) {
    if (o != null && o.nsecs != null && (o.nsecs < 0 || o.nsecs > 999999999))
      throw errCode$1(
        new Error('mtime-nsecs must be within the range [0,999999999]'),
        'ERR_INVALID_MTIME_NSECS'
      );
    return o;
  }
}
async function* normaliseCandidateMultiple(e, o) {
  if (
    typeof e == 'string' ||
    e instanceof String ||
    isBytes(e) ||
    isBlob(e) ||
    e._readableState
  )
    throw errCode$1(
      new Error(
        'Unexpected input: single item passed - if you are using ipfs.addAll, please use ipfs.add instead'
      ),
      'ERR_UNEXPECTED_INPUT'
    );
  if (
    (isReadableStream(e) && (e = browserReadableStreamToIt(e)),
    Symbol.iterator in e || Symbol.asyncIterator in e)
  ) {
    const a = peekableIterator(e),
      { value: s, done: i } = await a.peek();
    if (i) {
      yield* [];
      return;
    }
    if ((a.push(s), Number.isInteger(s)))
      throw errCode$1(
        new Error(
          'Unexpected input: single item passed - if you are using ipfs.addAll, please use ipfs.add instead'
        ),
        'ERR_UNEXPECTED_INPUT'
      );
    if (s._readableState) {
      yield* map(a, (c) => toFileObject$1({ content: c }, o));
      return;
    }
    if (isBytes(s)) {
      yield toFileObject$1({ content: a }, o);
      return;
    }
    if (
      isFileObject(s) ||
      s[Symbol.iterator] ||
      s[Symbol.asyncIterator] ||
      isReadableStream(s) ||
      isBlob(s)
    ) {
      yield* map(a, (c) => toFileObject$1(c, o));
      return;
    }
  }
  throw isFileObject(e)
    ? errCode$1(
        new Error(
          'Unexpected input: single item passed - if you are using ipfs.addAll, please use ipfs.add instead'
        ),
        'ERR_UNEXPECTED_INPUT'
      )
    : errCode$1(
        new Error('Unexpected input: ' + typeof e),
        'ERR_UNEXPECTED_INPUT'
      );
}
async function toFileObject$1(e, o) {
  const { path: a, mode: s, mtime: i, content: c } = e,
    d = { path: a || '', mode: parseMode(s), mtime: parseMtime(i) };
  return (c ? (d.content = await o(c)) : a || (d.content = await o(e)), d);
}
function normaliseInput$2(e) {
  return normaliseCandidateMultiple(e, normaliseContent$1);
}
function modeToString(e) {
  if (e != null)
    return typeof e == 'string' ? e : e.toString(8).padStart(4, '0');
}
async function multipartRequest(e, o, a = {}) {
  const s = [],
    i = new FormData();
  let c = 0,
    d = 0;
  for await (const {
    content: h,
    path: b,
    mode: g,
    mtime: $,
  } of normaliseInput$2(e)) {
    let _ = '';
    const _e = h ? 'file' : 'dir';
    c > 0 && (_ = `-${c}`);
    let ot = _e + _;
    const j = [];
    if ((g != null && j.push(`mode=${modeToString(g)}`), $ != null)) {
      const { secs: nt, nsecs: lt } = $;
      (j.push(`mtime=${nt}`), lt != null && j.push(`mtime-nsecs=${lt}`));
    }
    if ((j.length && (ot = `${ot}?${j.join('&')}`), h)) {
      i.set(ot, h, b != null ? encodeURIComponent(b) : void 0);
      const nt = d + h.size;
      (s.push({ name: b, start: d, end: nt }), (d = nt));
    } else if (b != null)
      i.set(
        ot,
        new File([''], encodeURIComponent(b), {
          type: 'application/x-directory',
        })
      );
    else throw new Error('path or content or both must be set');
    c++;
  }
  return { total: d, parts: s, headers: a, body: i };
}
function filter(e) {
  return e.filter(Boolean);
}
function abortSignal(...e) {
  return anySignal_2(filter(e));
}
const createPut$3 = configure((e) => {
    async function o(a, s = {}) {
      const i = new AbortController(),
        c = abortSignal(i.signal, s.signal);
      let d;
      try {
        d = await (
          await e.post('block/put', {
            signal: c,
            searchParams: toUrlSearchParams(s),
            ...(await multipartRequest([a], i, s.headers)),
          })
        ).json();
      } catch (h) {
        if (s.format === 'dag-pb') return o(a, { ...s, format: 'protobuf' });
        if (s.format === 'dag-cbor') return o(a, { ...s, format: 'cbor' });
        throw h;
      }
      return CID$1.parse(d.Key);
    }
    return o;
  }),
  createRm$6 = configure((e) => {
    async function* o(a, s = {}) {
      Array.isArray(a) || (a = [a]);
      const i = await e.post('block/rm', {
        signal: s.signal,
        searchParams: toUrlSearchParams({
          arg: a.map((c) => c.toString()),
          'stream-channels': !0,
          ...s,
        }),
        headers: s.headers,
      });
      for await (const c of i.ndjson()) yield toCoreInterface$3(c);
    }
    return o;
  });
function toCoreInterface$3(e) {
  const o = { cid: CID$1.parse(e.Hash) };
  return (e.Error && (o.error = new Error(e.Error)), o);
}
const createStat$3 = configure((e) => {
  async function o(a, s = {}) {
    const c = await (
      await e.post('block/stat', {
        signal: s.signal,
        searchParams: toUrlSearchParams({ arg: a.toString(), ...s }),
        headers: s.headers,
      })
    ).json();
    return { cid: CID$1.parse(c.Key), size: c.Size };
  }
  return o;
});
function createBlock(e) {
  return {
    get: createGet$5(e),
    put: createPut$3(e),
    rm: createRm$6(e),
    stat: createStat$3(e),
  };
}
const createAdd$4 = configure((e) => {
    async function o(a, s = {}) {
      const i = await e.post('bootstrap/add', {
          signal: s.signal,
          searchParams: toUrlSearchParams({ arg: a, ...s }),
          headers: s.headers,
        }),
        { Peers: c } = await i.json();
      return { Peers: c.map((d) => multiaddr$1(d)) };
    }
    return o;
  }),
  createClear = configure((e) => {
    async function o(a = {}) {
      const s = await e.post('bootstrap/rm', {
          signal: a.signal,
          searchParams: toUrlSearchParams({ ...a, all: !0 }),
          headers: a.headers,
        }),
        { Peers: i } = await s.json();
      return { Peers: i.map((c) => multiaddr$1(c)) };
    }
    return o;
  }),
  createList$2 = configure((e) => {
    async function o(a = {}) {
      const s = await e.post('bootstrap/list', {
          signal: a.signal,
          searchParams: toUrlSearchParams(a),
          headers: a.headers,
        }),
        { Peers: i } = await s.json();
      return { Peers: i.map((c) => multiaddr$1(c)) };
    }
    return o;
  }),
  createReset = configure((e) => {
    async function o(a = {}) {
      const s = await e.post('bootstrap/add', {
          signal: a.signal,
          searchParams: toUrlSearchParams({ ...a, default: !0 }),
          headers: a.headers,
        }),
        { Peers: i } = await s.json();
      return { Peers: i.map((c) => multiaddr$1(c)) };
    }
    return o;
  }),
  createRm$5 = configure((e) => {
    async function o(a, s = {}) {
      const i = await e.post('bootstrap/rm', {
          signal: s.signal,
          searchParams: toUrlSearchParams({ arg: a, ...s }),
          headers: s.headers,
        }),
        { Peers: c } = await i.json();
      return { Peers: c.map((d) => multiaddr$1(d)) };
    }
    return o;
  });
function createBootstrap(e) {
  return {
    add: createAdd$4(e),
    clear: createClear(e),
    list: createList$2(e),
    reset: createReset(e),
    rm: createRm$5(e),
  };
}
const createApply = configure((e) => {
  async function o(a, s = {}) {
    const c = await (
      await e.post('config/profile/apply', {
        signal: s.signal,
        searchParams: toUrlSearchParams({ arg: a, ...s }),
        headers: s.headers,
      })
    ).json();
    return { original: c.OldCfg, updated: c.NewCfg };
  }
  return o;
});
function objectToCamel(e) {
  if (e == null) return e;
  const o = /^[A-Z]+$/,
    a = {};
  return Object.keys(e).reduce(
    (s, i) => (
      o.test(i)
        ? (s[i.toLowerCase()] = e[i])
        : o.test(i[0])
          ? (s[i[0].toLowerCase() + i.slice(1)] = e[i])
          : (s[i] = e[i]),
      s
    ),
    a
  );
}
const createList$1 = configure((e) => {
  async function o(a = {}) {
    return (
      await (
        await e.post('config/profile/list', {
          signal: a.signal,
          searchParams: toUrlSearchParams(a),
          headers: a.headers,
        })
      ).json()
    ).map((c) => objectToCamel(c));
  }
  return o;
});
function createProfiles(e) {
  return { apply: createApply(e), list: createList$1(e) };
}
const createGet$4 = configure((e) => async (a, s = {}) => {
    if (!a) throw new Error('key argument is required');
    return (
      await (
        await e.post('config', {
          signal: s.signal,
          searchParams: toUrlSearchParams({ arg: a, ...s }),
          headers: s.headers,
        })
      ).json()
    ).Value;
  }),
  createGetAll = configure(
    (e) =>
      async (a = {}) =>
        await (
          await e.post('config/show', {
            signal: a.signal,
            searchParams: toUrlSearchParams({ ...a }),
            headers: a.headers,
          })
        ).json()
  ),
  createReplace = configure((e) => async (a, s = {}) => {
    const i = new AbortController(),
      c = abortSignal(i.signal, s.signal);
    await (
      await e.post('config/replace', {
        signal: c,
        searchParams: toUrlSearchParams(s),
        ...(await multipartRequest(
          [fromString$3(JSON.stringify(a))],
          i,
          s.headers
        )),
      })
    ).text();
  }),
  createSet = configure((e) => async (a, s, i = {}) => {
    if (typeof a != 'string') throw new Error('Invalid key type');
    const c = { ...i, ...encodeParam(a, s) };
    await (
      await e.post('config', {
        signal: i.signal,
        searchParams: toUrlSearchParams(c),
        headers: i.headers,
      })
    ).text();
  }),
  encodeParam = (e, o) => {
    switch (typeof o) {
      case 'boolean':
        return { arg: [e, o.toString()], bool: !0 };
      case 'string':
        return { arg: [e, o] };
      default:
        return { arg: [e, JSON.stringify(o)], json: !0 };
    }
  };
function createConfig(e) {
  return {
    getAll: createGetAll(e),
    get: createGet$4(e),
    set: createSet(e),
    replace: createReplace(e),
    profiles: createProfiles(e),
  };
}
const createExport$1 = configure((e) => {
  async function* o(a, s = {}) {
    yield* (
      await e.post('dag/export', {
        signal: s.signal,
        searchParams: toUrlSearchParams({ arg: a.toString() }),
        headers: s.headers,
      })
    ).iterator();
  }
  return o;
});
async function* resolve(e, o, a, s, i) {
  const c = async (g) => {
      const $ = await a.getCodec(g.code),
        _ = await s(g, i);
      return $.decode(_);
    },
    d = o.split('/').filter(Boolean);
  let h = await c(e),
    b = e;
  for (; d.length; ) {
    const g = d.shift();
    if (!g)
      throw errCode$1(
        new Error(`Could not resolve path "${o}"`),
        'ERR_INVALID_PATH'
      );
    if (Object.prototype.hasOwnProperty.call(h, g))
      ((h = h[g]), yield { value: h, remainderPath: d.join('/') });
    else
      throw errCode$1(
        new Error(`no link named "${g}" under ${b}`),
        'ERR_NO_LINK'
      );
    const $ = CID$1.asCID(h);
    $ && ((b = $), (h = await c(h)));
  }
  yield { value: h, remainderPath: '' };
}
async function first(e) {
  for await (const o of e) return o;
}
async function last(e) {
  let o;
  for await (const a of e) o = a;
  return o;
}
const createGet$3 = (e, o) =>
    configure((s, i) => {
      const c = createGet$5(i);
      return async (h, b = {}) => {
        if (b.path) {
          const ot = b.localResolve
            ? await first(resolve(h, b.path, e, c, b))
            : await last(resolve(h, b.path, e, c, b));
          if (!ot) throw errCode$1(new Error('Not found'), 'ERR_NOT_FOUND');
          return ot;
        }
        const g = await e.getCodec(h.code),
          $ = await c(h, b);
        return { value: g.decode($), remainderPath: '' };
      };
    })(o),
  createImport$1 = configure((e) => {
    async function* o(a, s = {}) {
      const i = new AbortController(),
        c = abortSignal(i.signal, s.signal),
        { headers: d, body: h } = await multipartRequest(a, i, s.headers),
        b = await e.post('dag/import', {
          signal: c,
          headers: d,
          body: h,
          searchParams: toUrlSearchParams({ 'pin-roots': s.pinRoots }),
        });
      for await (const { Root: g } of b.ndjson())
        if (g !== void 0) {
          const {
            Cid: { '/': $ },
            PinErrorMsg: _,
          } = g;
          yield { root: { cid: CID$1.parse($), pinErrorMsg: _ } };
        }
    }
    return o;
  }),
  createPut$2 = (e, o) =>
    configure((s) => async (c, d = {}) => {
      const h = { storeCodec: 'dag-cbor', hashAlg: 'sha2-256', ...d };
      let b;
      if (h.inputCodec) {
        if (!(c instanceof Uint8Array))
          throw new Error(
            'Can only inputCodec on raw bytes that can be decoded'
          );
        b = c;
      } else
        ((b = (await e.getCodec(h.storeCodec)).encode(c)),
          (h.inputCodec = h.storeCodec));
      const g = new AbortController(),
        $ = abortSignal(g.signal, h.signal),
        _e = await (
          await s.post('dag/put', {
            timeout: h.timeout,
            signal: $,
            searchParams: toUrlSearchParams(h),
            ...(await multipartRequest([b], g, h.headers)),
          })
        ).json();
      return CID$1.parse(_e.Cid['/']);
    })(o),
  createResolve$2 = configure((e) => async (a, s = {}) => {
    const c = await (
      await e.post('dag/resolve', {
        signal: s.signal,
        searchParams: toUrlSearchParams({
          arg: `${a}${s.path ? `/${s.path}`.replace(/\/[/]+/g, '/') : ''}`,
          ...s,
        }),
        headers: s.headers,
      })
    ).json();
    return { cid: CID$1.parse(c.Cid['/']), remainderPath: c.RemPath };
  });
function createDag(e, o) {
  return {
    export: createExport$1(o),
    get: createGet$3(e, o),
    import: createImport$1(o),
    put: createPut$2(e, o),
    resolve: createResolve$2(o),
  };
}
const SendingQuery = 0,
  PeerResponse = 1,
  FinalPeer = 2,
  QueryError = 3,
  Provider = 4,
  Value = 5,
  AddingPeer = 6,
  DialingPeer = 7,
  mapEvent = (e) => {
    if (e.Type === SendingQuery) return { name: 'SENDING_QUERY', type: e.Type };
    if (e.Type === PeerResponse)
      return {
        from: peerIdFromString(e.ID),
        name: 'PEER_RESPONSE',
        type: e.Type,
        messageType: 0,
        messageName: 'PUT_VALUE',
        closer: (e.Responses || []).map(({ ID: o, Addrs: a }) => ({
          id: peerIdFromString(o),
          multiaddrs: a.map((s) => multiaddr$1(s)),
          protocols: [],
        })),
        providers: (e.Responses || []).map(({ ID: o, Addrs: a }) => ({
          id: peerIdFromString(o),
          multiaddrs: a.map((s) => multiaddr$1(s)),
          protocols: [],
        })),
      };
    if (e.Type === FinalPeer) {
      let o = {
        id: e.ID ?? peerIdFromString(e.ID),
        multiaddrs: [],
        protocols: [],
      };
      return (
        e.Responses &&
          e.Responses.length &&
          (o = {
            id: peerIdFromString(e.Responses[0].ID),
            multiaddrs: e.Responses[0].Addrs.map((a) => multiaddr$1(a)),
            protocols: [],
          }),
        { name: 'FINAL_PEER', type: e.Type, peer: o }
      );
    }
    if (e.Type === QueryError)
      return { name: 'QUERY_ERROR', type: e.Type, error: new Error(e.Extra) };
    if (e.Type === Provider)
      return {
        name: 'PROVIDER',
        type: e.Type,
        providers: e.Responses.map(({ ID: o, Addrs: a }) => ({
          id: peerIdFromString(o),
          multiaddrs: a.map((s) => multiaddr$1(s)),
          protocols: [],
        })),
      };
    if (e.Type === Value)
      return {
        name: 'VALUE',
        type: e.Type,
        value: fromString$3(e.Extra, 'base64pad'),
      };
    if (e.Type === AddingPeer) {
      const o = e.Responses.map(({ ID: a }) => peerIdFromString(a));
      if (!o.length) throw new Error('No peer found');
      return { name: 'ADDING_PEER', type: e.Type, peer: o[0] };
    }
    if (e.Type === DialingPeer)
      return {
        name: 'DIALING_PEER',
        type: e.Type,
        peer: peerIdFromString(e.ID),
      };
    throw new Error('Unknown DHT event type');
  },
  createFindPeer = configure((e) => {
    async function* o(a, s = {}) {
      const i = await e.post('dht/findpeer', {
        signal: s.signal,
        searchParams: toUrlSearchParams({ arg: a, ...s }),
        headers: s.headers,
      });
      for await (const c of i.ndjson()) yield mapEvent(c);
    }
    return o;
  }),
  createFindProvs = configure((e) => {
    async function* o(a, s = {}) {
      const i = await e.post('dht/findprovs', {
        signal: s.signal,
        searchParams: toUrlSearchParams({ arg: a.toString(), ...s }),
        headers: s.headers,
      });
      for await (const c of i.ndjson()) yield mapEvent(c);
    }
    return o;
  }),
  createGet$2 = configure((e) => {
    async function* o(a, s = {}) {
      const i = await e.post('dht/get', {
        signal: s.signal,
        searchParams: toUrlSearchParams({
          arg: a instanceof Uint8Array ? toString$3(a) : a.toString(),
          ...s,
        }),
        headers: s.headers,
      });
      for await (const c of i.ndjson()) yield mapEvent(c);
    }
    return o;
  }),
  createProvide = configure((e) => {
    async function* o(a, s = { recursive: !1 }) {
      const i = Array.isArray(a) ? a : [a],
        c = await e.post('dht/provide', {
          signal: s.signal,
          searchParams: toUrlSearchParams({
            arg: i.map((d) => d.toString()),
            ...s,
          }),
          headers: s.headers,
        });
      for await (const d of c.ndjson()) yield mapEvent(d);
    }
    return o;
  }),
  createPut$1 = configure((e) => {
    async function* o(a, s, i = {}) {
      const c = new AbortController(),
        d = abortSignal(c.signal, i.signal),
        h = await e.post('dht/put', {
          signal: d,
          searchParams: toUrlSearchParams({
            arg: a instanceof Uint8Array ? toString$3(a) : a.toString(),
            ...i,
          }),
          ...(await multipartRequest([s], c, i.headers)),
        });
      for await (const b of h.ndjson()) yield mapEvent(b);
    }
    return o;
  }),
  createQuery = configure((e) => {
    async function* o(a, s = {}) {
      const i = await e.post('dht/query', {
        signal: s.signal,
        searchParams: toUrlSearchParams({ arg: a.toString(), ...s }),
        headers: s.headers,
      });
      for await (const c of i.ndjson()) yield mapEvent(c);
    }
    return o;
  });
function createDht(e) {
  return {
    findPeer: createFindPeer(e),
    findProvs: createFindProvs(e),
    get: createGet$2(e),
    provide: createProvide(e),
    put: createPut$1(e),
    query: createQuery(e),
  };
}
const createCmds = configure((e) => {
    async function o(a = {}) {
      return (
        await e.post('diag/cmds', {
          signal: a.signal,
          searchParams: toUrlSearchParams(a),
          headers: a.headers,
        })
      ).json();
    }
    return o;
  }),
  createNet = configure((e) => {
    async function o(a = {}) {
      return (
        await e.post('diag/net', {
          signal: a.signal,
          searchParams: toUrlSearchParams(a),
          headers: a.headers,
        })
      ).json();
    }
    return o;
  }),
  createSys = configure((e) => {
    async function o(a = {}) {
      return (
        await e.post('diag/sys', {
          signal: a.signal,
          searchParams: toUrlSearchParams(a),
          headers: a.headers,
        })
      ).json();
    }
    return o;
  });
function createDiag(e) {
  return { cmds: createCmds(e), net: createNet(e), sys: createSys(e) };
}
const createChmod = configure((e) => {
    async function o(a, s, i = {}) {
      await (
        await e.post('files/chmod', {
          signal: i.signal,
          searchParams: toUrlSearchParams({ arg: a, mode: s, ...i }),
          headers: i.headers,
        })
      ).text();
    }
    return o;
  }),
  createCp = configure((e) => {
    async function o(a, s, i = {}) {
      const c = Array.isArray(a) ? a : [a];
      await (
        await e.post('files/cp', {
          signal: i.signal,
          searchParams: toUrlSearchParams({
            arg: c.concat(s).map((h) => (CID$1.asCID(h) ? `/ipfs/${h}` : h)),
            ...i,
          }),
          headers: i.headers,
        })
      ).text();
    }
    return o;
  }),
  createFlush = configure((e) => {
    async function o(a, s = {}) {
      if (!a || typeof a != 'string')
        throw new Error('ipfs.files.flush requires a path');
      const c = await (
        await e.post('files/flush', {
          signal: s.signal,
          searchParams: toUrlSearchParams({ arg: a, ...s }),
          headers: s.headers,
        })
      ).json();
      return CID$1.parse(c.Cid);
    }
    return o;
  });
function objectToCamelWithMetadata(e) {
  const o = objectToCamel(e);
  return (
    Object.prototype.hasOwnProperty.call(o, 'mode') &&
      (o.mode = parseInt(o.mode, 8)),
    Object.prototype.hasOwnProperty.call(o, 'mtime') &&
      ((o.mtime = { secs: o.mtime, nsecs: o.mtimeNsecs || 0 }),
      delete o.mtimeNsecs),
    o
  );
}
const createLs$6 = configure((e) => {
  async function* o(a, s = {}) {
    if (!a) throw new Error('ipfs.files.ls requires a path');
    const i = await e.post('files/ls', {
      signal: s.signal,
      searchParams: toUrlSearchParams({
        arg: CID$1.asCID(a) ? `/ipfs/${a}` : a,
        long: !0,
        ...s,
        stream: !0,
      }),
      headers: s.headers,
    });
    for await (const c of i.ndjson())
      if ('Entries' in c)
        for (const d of c.Entries || [])
          yield toCoreInterface$2(objectToCamelWithMetadata(d));
      else yield toCoreInterface$2(objectToCamelWithMetadata(c));
  }
  return o;
});
function toCoreInterface$2(e) {
  return (
    e.hash && (e.cid = CID$1.parse(e.hash)),
    delete e.hash,
    (e.type = e.type === 1 ? 'directory' : 'file'),
    e
  );
}
const createMkdir = configure((e) => {
    async function o(a, s = {}) {
      await (
        await e.post('files/mkdir', {
          signal: s.signal,
          searchParams: toUrlSearchParams({ arg: a, ...s }),
          headers: s.headers,
        })
      ).text();
    }
    return o;
  }),
  createMv = configure((e) => {
    async function o(a, s, i = {}) {
      (Array.isArray(a) || (a = [a]),
        await (
          await e.post('files/mv', {
            signal: i.signal,
            searchParams: toUrlSearchParams({ arg: a.concat(s), ...i }),
            headers: i.headers,
          })
        ).text());
    }
    return o;
  });
var source = (e) => {
  if (e[Symbol.asyncIterator]) return e;
  if (e.getReader)
    return (async function* () {
      const o = e.getReader();
      try {
        for (;;) {
          const { done: a, value: s } = await o.read();
          if (a) return;
          yield s;
        }
      } finally {
        o.releaseLock();
      }
    })();
  throw new Error('unknown stream');
};
const toIterable = getDefaultExportFromCjs(source),
  createRead = configure((e) => {
    async function* o(a, s = {}) {
      const i = await e.post('files/read', {
        signal: s.signal,
        searchParams: toUrlSearchParams({ arg: a, count: s.length, ...s }),
        headers: s.headers,
      });
      yield* toIterable(i.body);
    }
    return o;
  }),
  createRm$4 = configure((e) => {
    async function o(a, s = {}) {
      const i = await e.post('files/rm', {
          signal: s.signal,
          searchParams: toUrlSearchParams({ arg: a, ...s }),
          headers: s.headers,
        }),
        c = await i.text();
      if (c !== '') {
        const d = new HTTP$1.HTTPError(i);
        throw ((d.message = c), d);
      }
    }
    return o;
  }),
  createStat$2 = configure((e) => {
    async function o(a, s = {}) {
      const c = await (
        await e.post('files/stat', {
          signal: s.signal,
          searchParams: toUrlSearchParams({ arg: a, ...s }),
          headers: s.headers,
        })
      ).json();
      return (
        (c.WithLocality = c.WithLocality || !1),
        toCoreInterface$1(objectToCamelWithMetadata(c))
      );
    }
    return o;
  });
function toCoreInterface$1(e) {
  return ((e.cid = CID$1.parse(e.hash)), delete e.hash, e);
}
const createTouch = configure((e) => {
    async function o(a, s = {}) {
      await (
        await e.post('files/touch', {
          signal: s.signal,
          searchParams: toUrlSearchParams({ arg: a, ...s }),
          headers: s.headers,
        })
      ).text();
    }
    return o;
  }),
  createWrite = configure((e) => {
    async function o(a, s, i = {}) {
      const c = new AbortController(),
        d = abortSignal(c.signal, i.signal);
      await (
        await e.post('files/write', {
          signal: d,
          searchParams: toUrlSearchParams({
            arg: a,
            streamChannels: !0,
            count: i.length,
            ...i,
          }),
          ...(await multipartRequest(
            [
              {
                content: s,
                path: 'arg',
                mode: modeToString$1(i.mode),
                mtime: parseMtime$1(i.mtime),
              },
            ],
            c,
            i.headers
          )),
        })
      ).text();
    }
    return o;
  });
function createFiles(e) {
  return {
    chmod: createChmod(e),
    cp: createCp(e),
    flush: createFlush(e),
    ls: createLs$6(e),
    mkdir: createMkdir(e),
    mv: createMv(e),
    read: createRead(e),
    rm: createRm$4(e),
    stat: createStat$2(e),
    touch: createTouch(e),
    write: createWrite(e),
  };
}
const createExport = configure((e) => async (a, s, i = {}) => {
    throw errCode$1(new Error('Not implemented'), 'ERR_NOT_IMPLEMENTED');
  }),
  createGen = configure((e) => {
    async function o(a, s) {
      const i = s ?? { type: 'Ed25519' },
        d = await (
          await e.post('key/gen', {
            signal: i.signal,
            searchParams: toUrlSearchParams({ arg: a, ...i }),
            headers: i.headers,
          })
        ).json();
      return objectToCamel(d);
    }
    return o;
  }),
  createImport = configure((e) => {
    async function o(a, s, i, c = {}) {
      const h = await (
        await e.post('key/import', {
          signal: c.signal,
          searchParams: toUrlSearchParams({
            arg: a,
            pem: s,
            password: i,
            ...c,
          }),
          headers: c.headers,
        })
      ).json();
      return objectToCamel(h);
    }
    return o;
  }),
  createInfo = configure((e) => async (a, s = {}) => {
    throw errCode$1(new Error('Not implemented'), 'ERR_NOT_IMPLEMENTED');
  }),
  createList = configure((e) => {
    async function o(a = {}) {
      return (
        (
          await (
            await e.post('key/list', {
              signal: a.signal,
              searchParams: toUrlSearchParams(a),
              headers: a.headers,
            })
          ).json()
        ).Keys || []
      ).map((c) => objectToCamel(c));
    }
    return o;
  }),
  createRename = configure((e) => {
    async function o(a, s, i = {}) {
      const c = await e.post('key/rename', {
        signal: i.signal,
        searchParams: toUrlSearchParams({ arg: [a, s], ...i }),
        headers: i.headers,
      });
      return objectToCamel(await c.json());
    }
    return o;
  }),
  createRm$3 = configure((e) => {
    async function o(a, s = {}) {
      const c = await (
        await e.post('key/rm', {
          signal: s.signal,
          searchParams: toUrlSearchParams({ arg: a, ...s }),
          headers: s.headers,
        })
      ).json();
      return objectToCamel(c.Keys[0]);
    }
    return o;
  });
function createKey(e) {
  return {
    export: createExport(e),
    gen: createGen(e),
    import: createImport(e),
    info: createInfo(e),
    list: createList(e),
    rename: createRename(e),
    rm: createRm$3(e),
  };
}
const createLevel = configure((e) => {
    async function o(a, s, i = {}) {
      const c = await e.post('log/level', {
        signal: i.signal,
        searchParams: toUrlSearchParams({ arg: [a, s], ...i }),
        headers: i.headers,
      });
      return objectToCamel(await c.json());
    }
    return o;
  }),
  createLs$5 = configure((e) => {
    async function o(a = {}) {
      return (
        await (
          await e.post('log/ls', {
            signal: a.signal,
            searchParams: toUrlSearchParams(a),
            headers: a.headers,
          })
        ).json()
      ).Strings;
    }
    return o;
  }),
  createTail = configure((e) => {
    async function* o(a = {}) {
      yield* (
        await e.post('log/tail', {
          signal: a.signal,
          searchParams: toUrlSearchParams(a),
          headers: a.headers,
        })
      ).ndjson();
    }
    return o;
  });
function createLog(e) {
  return { level: createLevel(e), ls: createLs$5(e), tail: createTail(e) };
}
const createPublish$1 = configure((e) => {
    async function o(a, s = {}) {
      const i = await e.post('name/publish', {
        signal: s.signal,
        searchParams: toUrlSearchParams({ arg: `${a}`, ...s }),
        headers: s.headers,
      });
      return objectToCamel(await i.json());
    }
    return o;
  }),
  createResolve$1 = configure((e) => {
    async function* o(a, s = {}) {
      const i = await e.post('name/resolve', {
        signal: s.signal,
        searchParams: toUrlSearchParams({ arg: a, stream: !0, ...s }),
        headers: s.headers,
      });
      for await (const c of i.ndjson()) yield c.Path;
    }
    return o;
  }),
  createCancel = configure((e) => {
    async function o(a, s = {}) {
      const i = await e.post('name/pubsub/cancel', {
        signal: s.signal,
        searchParams: toUrlSearchParams({ arg: a, ...s }),
        headers: s.headers,
      });
      return objectToCamel(await i.json());
    }
    return o;
  }),
  createState = configure((e) => {
    async function o(a = {}) {
      const s = await e.post('name/pubsub/state', {
        signal: a.signal,
        searchParams: toUrlSearchParams(a),
        headers: a.headers,
      });
      return objectToCamel(await s.json());
    }
    return o;
  }),
  createSubs = configure((e) => {
    async function o(a = {}) {
      return (
        (
          await (
            await e.post('name/pubsub/subs', {
              signal: a.signal,
              searchParams: toUrlSearchParams(a),
              headers: a.headers,
            })
          ).json()
        ).Strings || []
      );
    }
    return o;
  });
function createPubsub$1(e) {
  return {
    cancel: createCancel(e),
    state: createState(e),
    subs: createSubs(e),
  };
}
function createName(e) {
  return {
    publish: createPublish$1(e),
    resolve: createResolve$1(e),
    pubsub: createPubsub$1(e),
  };
}
const createData = configure((e) => {
    async function o(a, s = {}) {
      const c = await (
        await e.post('object/data', {
          signal: s.signal,
          searchParams: toUrlSearchParams({
            arg: `${a instanceof Uint8Array ? CID$1.decode(a) : a}`,
            ...s,
          }),
          headers: s.headers,
        })
      ).arrayBuffer();
      return new Uint8Array(c, 0, c.byteLength);
    }
    return o;
  }),
  createGet$1 = configure((e) => {
    async function o(a, s = {}) {
      const c = await (
        await e.post('object/get', {
          signal: s.signal,
          searchParams: toUrlSearchParams({
            arg: `${a instanceof Uint8Array ? CID$1.decode(a) : a}`,
            dataEncoding: 'base64',
            ...s,
          }),
          headers: s.headers,
        })
      ).json();
      return {
        Data: fromString$3(c.Data, 'base64pad'),
        Links: (c.Links || []).map((d) => ({
          Name: d.Name,
          Hash: CID$1.parse(d.Hash),
          Tsize: d.Size,
        })),
      };
    }
    return o;
  }),
  createLinks = configure((e) => {
    async function o(a, s = {}) {
      return (
        (
          await (
            await e.post('object/links', {
              signal: s.signal,
              searchParams: toUrlSearchParams({
                arg: `${a instanceof Uint8Array ? CID$1.decode(a) : a}`,
                ...s,
              }),
              headers: s.headers,
            })
          ).json()
        ).Links || []
      ).map((d) => ({
        Name: d.Name,
        Tsize: d.Size,
        Hash: CID$1.parse(d.Hash),
      }));
    }
    return o;
  }),
  createNew = configure((e) => {
    async function o(a = {}) {
      const s = await e.post('object/new', {
          signal: a.signal,
          searchParams: toUrlSearchParams({ arg: a.template, ...a }),
          headers: a.headers,
        }),
        { Hash: i } = await s.json();
      return CID$1.parse(i);
    }
    return o;
  }),
  createPut = (e, o) =>
    configure((s) => {
      const i = createPut$2(e, o);
      async function c(d, h = {}) {
        return i(d, {
          ...h,
          storeCodec: 'dag-pb',
          hashAlg: 'sha2-256',
          version: 1,
        });
      }
      return c;
    })(o),
  createStat$1 = configure((e) => {
    async function o(a, s = {}) {
      const c = await (
        await e.post('object/stat', {
          signal: s.signal,
          searchParams: toUrlSearchParams({ arg: `${a}`, ...s }),
          headers: s.headers,
        })
      ).json();
      return { ...c, Hash: CID$1.parse(c.Hash) };
    }
    return o;
  }),
  createAddLink = configure((e) => {
    async function o(a, s, i = {}) {
      const c = await e.post('object/patch/add-link', {
          signal: i.signal,
          searchParams: toUrlSearchParams({
            arg: [
              `${a}`,
              s.Name || s.name || '',
              (s.Hash || s.cid || '').toString() || null,
            ],
            ...i,
          }),
          headers: i.headers,
        }),
        { Hash: d } = await c.json();
      return CID$1.parse(d);
    }
    return o;
  }),
  createAppendData = configure((e) => {
    async function o(a, s, i = {}) {
      const c = new AbortController(),
        d = abortSignal(c.signal, i.signal),
        h = await e.post('object/patch/append-data', {
          signal: d,
          searchParams: toUrlSearchParams({ arg: `${a}`, ...i }),
          ...(await multipartRequest([s], c, i.headers)),
        }),
        { Hash: b } = await h.json();
      return CID$1.parse(b);
    }
    return o;
  }),
  createRmLink = configure((e) => {
    async function o(a, s, i = {}) {
      const c = await e.post('object/patch/rm-link', {
          signal: i.signal,
          searchParams: toUrlSearchParams({
            arg: [`${a}`, s.Name || s.name || null],
            ...i,
          }),
          headers: i.headers,
        }),
        { Hash: d } = await c.json();
      return CID$1.parse(d);
    }
    return o;
  }),
  createSetData = configure((e) => {
    async function o(a, s, i = {}) {
      const c = new AbortController(),
        d = abortSignal(c.signal, i.signal),
        h = await e.post('object/patch/set-data', {
          signal: d,
          searchParams: toUrlSearchParams({ arg: [`${a}`], ...i }),
          ...(await multipartRequest([s], c, i.headers)),
        }),
        { Hash: b } = await h.json();
      return CID$1.parse(b);
    }
    return o;
  });
function createPatch(e) {
  return {
    addLink: createAddLink(e),
    appendData: createAppendData(e),
    rmLink: createRmLink(e),
    setData: createSetData(e),
  };
}
function createObject(e, o) {
  return {
    data: createData(o),
    get: createGet$1(o),
    links: createLinks(o),
    new: createNew(o),
    put: createPut(e, o),
    stat: createStat$1(o),
    patch: createPatch(o),
  };
}
function isIterable(e) {
  return Symbol.iterator in e;
}
function isAsyncIterable(e) {
  return Symbol.asyncIterator in e;
}
function isCID(e) {
  return CID$1.asCID(e) != null;
}
async function* normaliseInput$1(e) {
  if (e == null)
    throw errCode$1(
      new Error(`Unexpected input: ${e}`),
      'ERR_UNEXPECTED_INPUT'
    );
  const o = CID$1.asCID(e);
  if (o) {
    yield toPin$1({ cid: o });
    return;
  }
  if (e instanceof String || typeof e == 'string') {
    yield toPin$1({ path: e });
    return;
  }
  if (e.cid != null || e.path != null) return yield toPin$1(e);
  if (isIterable(e)) {
    const a = e[Symbol.iterator](),
      s = a.next();
    if (s.done) return a;
    if (isCID(s.value)) {
      yield toPin$1({ cid: s.value });
      for (const i of a) yield toPin$1({ cid: i });
      return;
    }
    if (s.value instanceof String || typeof s.value == 'string') {
      yield toPin$1({ path: s.value });
      for (const i of a) yield toPin$1({ path: i });
      return;
    }
    if (s.value.cid != null || s.value.path != null) {
      yield toPin$1(s.value);
      for (const i of a) yield toPin$1(i);
      return;
    }
    throw errCode$1(
      new Error('Unexpected input: ' + typeof e),
      'ERR_UNEXPECTED_INPUT'
    );
  }
  if (isAsyncIterable(e)) {
    const a = e[Symbol.asyncIterator](),
      s = await a.next();
    if (s.done) return a;
    if (isCID(s.value)) {
      yield toPin$1({ cid: s.value });
      for await (const i of a) yield toPin$1({ cid: i });
      return;
    }
    if (s.value instanceof String || typeof s.value == 'string') {
      yield toPin$1({ path: s.value });
      for await (const i of a) yield toPin$1({ path: i });
      return;
    }
    if (s.value.cid != null || s.value.path != null) {
      yield toPin$1(s.value);
      for await (const i of a) yield toPin$1(i);
      return;
    }
    throw errCode$1(
      new Error('Unexpected input: ' + typeof e),
      'ERR_UNEXPECTED_INPUT'
    );
  }
  throw errCode$1(
    new Error('Unexpected input: ' + typeof e),
    'ERR_UNEXPECTED_INPUT'
  );
}
function toPin$1(e) {
  const o = e.cid || `${e.path}`;
  if (!o)
    throw errCode$1(
      new Error('Unexpected input: Please path either a CID or an IPFS path'),
      'ERR_UNEXPECTED_INPUT'
    );
  const a = { path: o, recursive: e.recursive !== !1 };
  return (e.metadata != null && (a.metadata = e.metadata), a);
}
const createAddAll$1 = configure((e) => {
  async function* o(a, s = {}) {
    for await (const { path: i, recursive: c, metadata: d } of normaliseInput$1(
      a
    )) {
      const h = await e.post('pin/add', {
        signal: s.signal,
        searchParams: toUrlSearchParams({
          ...s,
          arg: i,
          recursive: c,
          metadata: d ? JSON.stringify(d) : void 0,
          stream: !0,
        }),
        headers: s.headers,
      });
      for await (const b of h.ndjson()) {
        if (b.Pins) {
          for (const g of b.Pins) yield CID$1.parse(g);
          continue;
        }
        yield CID$1.parse(b);
      }
    }
  }
  return o;
});
function createAdd$3(e) {
  const o = createAddAll$1(e);
  return configure(() => {
    async function a(s, i = {}) {
      return last(o([{ path: s, ...i }], i));
    }
    return a;
  })(e);
}
function toPin(e, o, a) {
  const s = { type: e, cid: CID$1.parse(o) };
  return (a && (s.metadata = a), s);
}
const createLs$4 = configure((e) => {
    async function* o(a = {}) {
      let s = [];
      a.paths && (s = Array.isArray(a.paths) ? a.paths : [a.paths]);
      const i = await e.post('pin/ls', {
        signal: a.signal,
        searchParams: toUrlSearchParams({
          ...a,
          arg: s.map((c) => `${c}`),
          stream: !0,
        }),
        headers: a.headers,
      });
      for await (const c of i.ndjson()) {
        if (c.Keys) {
          for (const d of Object.keys(c.Keys))
            yield toPin(c.Keys[d].Type, d, c.Keys[d].Metadata);
          return;
        }
        yield toPin(c.Type, c.Cid, c.Metadata);
      }
    }
    return o;
  }),
  createRmAll$1 = configure((e) => {
    async function* o(a, s = {}) {
      for await (const { path: i, recursive: c } of normaliseInput$1(a)) {
        const d = new URLSearchParams(s.searchParams);
        (d.append('arg', `${i}`), c != null && d.set('recursive', String(c)));
        const h = await e.post('pin/rm', {
          signal: s.signal,
          headers: s.headers,
          searchParams: toUrlSearchParams({ ...s, arg: `${i}`, recursive: c }),
        });
        for await (const b of h.ndjson()) {
          if (b.Pins) {
            yield* b.Pins.map((g) => CID$1.parse(g));
            continue;
          }
          yield CID$1.parse(b);
        }
      }
    }
    return o;
  }),
  createRm$2 = (e) => {
    const o = createRmAll$1(e);
    return configure(() => {
      async function a(s, i = {}) {
        return last(o([{ path: s, ...i }], i));
      }
      return a;
    })(e);
  },
  decodePin = ({ Name: e, Status: o, Cid: a }) => ({
    cid: CID$1.parse(a),
    name: e,
    status: o,
  }),
  encodeService = (e) => {
    if (typeof e == 'string' && e !== '') return e;
    throw new TypeError('service name must be passed');
  },
  encodeCID = (e) => {
    if (CID$1.asCID(e)) return e.toString();
    throw new TypeError(`CID instance expected instead of ${typeof e}`);
  },
  encodeQuery = ({ service: e, cid: o, name: a, status: s, all: i }) => {
    const c = toUrlSearchParams({
      service: encodeService(e),
      name: a,
      force: i ? !0 : void 0,
    });
    if (o) for (const d of o) c.append('cid', encodeCID(d));
    if (s) for (const d of s) c.append('status', d);
    return c;
  },
  encodeAddParams = ({
    cid: e,
    service: o,
    background: a,
    name: s,
    origins: i,
  }) => {
    const c = toUrlSearchParams({
      arg: encodeCID(e),
      service: encodeService(o),
      name: s,
      background: a ? !0 : void 0,
    });
    if (i) for (const d of i) c.append('origin', d.toString());
    return c;
  };
function createAdd$2(e) {
  async function o(a, { timeout: s, signal: i, headers: c, ...d }) {
    const h = await e.post('pin/remote/add', {
      timeout: s,
      signal: i,
      headers: c,
      searchParams: encodeAddParams({ cid: a, ...d }),
    });
    return decodePin(await h.json());
  }
  return o;
}
function createLs$3(e) {
  async function* o({ timeout: a, signal: s, headers: i, ...c }) {
    const d = await e.post('pin/remote/ls', {
      timeout: a,
      signal: s,
      headers: i,
      searchParams: encodeQuery(c),
    });
    for await (const h of d.ndjson()) yield decodePin(h);
  }
  return o;
}
function createRm$1(e) {
  async function o({ timeout: a, signal: s, headers: i, ...c }) {
    await e.post('pin/remote/rm', {
      timeout: a,
      signal: s,
      headers: i,
      searchParams: encodeQuery({ ...c, all: !1 }),
    });
  }
  return o;
}
function createRmAll(e) {
  async function o({ timeout: a, signal: s, headers: i, ...c }) {
    await e.post('pin/remote/rm', {
      timeout: a,
      signal: s,
      headers: i,
      searchParams: encodeQuery({ ...c, all: !0 }),
    });
  }
  return o;
}
function encodeEndpoint(e) {
  const o = String(e);
  if (o === 'undefined') throw Error('endpoint is required');
  return o[o.length - 1] === '/' ? o.slice(0, -1) : o;
}
function decodeRemoteService(e) {
  return {
    service: e.Service,
    endpoint: new URL(e.ApiEndpoint),
    ...(e.Stat && { stat: decodeStat(e.Stat) }),
  };
}
function decodeStat(e) {
  switch (e.Status) {
    case 'valid': {
      const { Pinning: o, Pinned: a, Queued: s, Failed: i } = e.PinCount;
      return {
        status: 'valid',
        pinCount: { queued: s, pinning: o, pinned: a, failed: i },
      };
    }
    case 'invalid':
      return { status: 'invalid' };
    default:
      return { status: e.Status };
  }
}
function createAdd$1(e) {
  async function o(a, s) {
    const { endpoint: i, key: c, headers: d, timeout: h, signal: b } = s;
    await e.post('pin/remote/service/add', {
      timeout: h,
      signal: b,
      searchParams: toUrlSearchParams({ arg: [a, encodeEndpoint(i), c] }),
      headers: d,
    });
  }
  return o;
}
function createLs$2(e) {
  async function o(a = {}) {
    const { stat: s, headers: i, timeout: c, signal: d } = a,
      h = await e.post('pin/remote/service/ls', {
        timeout: c,
        signal: d,
        headers: i,
        searchParams: s === !0 ? toUrlSearchParams({ stat: s }) : void 0,
      }),
      { RemoteServices: b } = await h.json();
    return b.map(decodeRemoteService);
  }
  return o;
}
function createRm(e) {
  async function o(a, s = {}) {
    await e.post('pin/remote/service/rm', {
      signal: s.signal,
      headers: s.headers,
      searchParams: toUrlSearchParams({ arg: a }),
    });
  }
  return o;
}
function createService(e) {
  const o = new Client(e);
  return { add: createAdd$1(o), ls: createLs$2(o), rm: createRm(o) };
}
function createRemote(e) {
  const o = new Client(e);
  return {
    add: createAdd$2(o),
    ls: createLs$3(o),
    rm: createRm$1(o),
    rmAll: createRmAll(o),
    service: createService(e),
  };
}
function createPin(e) {
  return {
    addAll: createAddAll$1(e),
    add: createAdd$3(e),
    ls: createLs$4(e),
    rmAll: createRmAll$1(e),
    rm: createRm$2(e),
    remote: createRemote(e),
  };
}
const rpcArrayToTextArray = (e) => (Array.isArray(e) ? e.map(rpcToText) : e),
  rpcToText = (e) => toString$3(rpcToBytes(e)),
  rpcToBytes = (e) => base64url$2.decode(e),
  rpcToBigInt = (e) =>
    BigInt(`0x${toString$3(base64url$2.decode(e), 'base16')}`),
  textToUrlSafeRpc = (e) => base64url$2.encode(fromString$3(e)),
  createLs$1 = configure((e) => {
    async function o(a = {}) {
      const { Strings: s } = await (
        await e.post('pubsub/ls', {
          signal: a.signal,
          searchParams: toUrlSearchParams(a),
          headers: a.headers,
        })
      ).json();
      return rpcArrayToTextArray(s) || [];
    }
    return o;
  }),
  createPeers$1 = configure((e) => {
    async function o(a, s = {}) {
      const i = await e.post('pubsub/peers', {
          signal: s.signal,
          searchParams: toUrlSearchParams({ arg: textToUrlSafeRpc(a), ...s }),
          headers: s.headers,
        }),
        { Strings: c } = await i.json();
      return c || [];
    }
    return o;
  }),
  createPublish = configure((e) => {
    async function o(a, s, i = {}) {
      const c = toUrlSearchParams({ arg: textToUrlSafeRpc(a), ...i }),
        d = new AbortController(),
        h = abortSignal(d.signal, i.signal);
      await (
        await e.post('pubsub/pub', {
          signal: h,
          searchParams: c,
          ...(await multipartRequest([s], d, i.headers)),
        })
      ).text();
    }
    return o;
  }),
  log = logger('ipfs-http-client:pubsub:subscribe'),
  createSubscribe = (e, o) =>
    configure((a) => {
      async function s(i, c, d = {}) {
        d.signal = o.subscribe(i, c, d.signal);
        let h, b;
        const g = new Promise((_, _e) => {
            ((h = _), (b = _e));
          }),
          $ = setTimeout(() => h(), 1e3);
        return (
          a
            .post('pubsub/sub', {
              signal: d.signal,
              searchParams: toUrlSearchParams({
                arg: textToUrlSafeRpc(i),
                ...d,
              }),
              headers: d.headers,
            })
            .catch((_) => {
              (o.unsubscribe(i, c), b(_));
            })
            .then((_) => {
              (clearTimeout($),
                _ &&
                  (readMessages(_, {
                    onMessage: (_e) => {
                      if (c) {
                        if (typeof c == 'function') {
                          c(_e);
                          return;
                        }
                        typeof c.handleEvent == 'function' && c.handleEvent(_e);
                      }
                    },
                    onEnd: () => o.unsubscribe(i, c),
                    onError: d.onError,
                  }),
                  h()));
            }),
          g
        );
      }
      return s;
    })(e);
async function readMessages(e, { onMessage: o, onEnd: a, onError: s }) {
  s = s || log;
  try {
    for await (const i of e.ndjson())
      try {
        if (!i.from) continue;
        i.from != null && i.seqno != null
          ? o({
              type: 'signed',
              from: peerIdFromString(i.from),
              data: rpcToBytes(i.data),
              sequenceNumber: rpcToBigInt(i.seqno),
              topic: rpcToText(i.topicIDs[0]),
              key: rpcToBytes(i.key ?? 'u'),
              signature: rpcToBytes(i.signature ?? 'u'),
            })
          : o({
              type: 'unsigned',
              data: rpcToBytes(i.data),
              topic: rpcToText(i.topicIDs[0]),
            });
      } catch (c) {
        ((c.message = `Failed to parse pubsub message: ${c.message}`),
          s(c, !1, i));
      }
  } catch (i) {
    isAbortError(i) || s(i, !0);
  } finally {
    a();
  }
}
const isAbortError = (e) => {
    switch (e.type) {
      case 'aborted':
        return !0;
      case 'abort':
        return !0;
      default:
        return e.name === 'AbortError';
    }
  },
  createUnsubscribe = (e, o) => {
    async function a(s, i) {
      o.unsubscribe(s, i);
    }
    return a;
  };
class SubscriptionTracker {
  constructor() {
    this._subs = new Map();
  }
  subscribe(o, a, s) {
    const i = this._subs.get(o) || [];
    if (i.find((d) => d.handler === a))
      throw new Error(`Already subscribed to ${o} with this handler`);
    const c = new AbortController();
    return (
      this._subs.set(o, [{ handler: a, controller: c }].concat(i)),
      s && s.addEventListener('abort', () => this.unsubscribe(o, a)),
      c.signal
    );
  }
  unsubscribe(o, a) {
    const s = this._subs.get(o) || [];
    let i;
    (a
      ? (this._subs.set(
          o,
          s.filter((c) => c.handler !== a)
        ),
        (i = s.filter((c) => c.handler === a)))
      : (this._subs.set(o, []), (i = s)),
      (this._subs.get(o) || []).length || this._subs.delete(o),
      i.forEach((c) => c.controller.abort()));
  }
}
function createPubsub(e) {
  const o = new SubscriptionTracker();
  return {
    ls: createLs$1(e),
    peers: createPeers$1(e),
    publish: createPublish(e),
    subscribe: createSubscribe(e, o),
    unsubscribe: createUnsubscribe(e, o),
  };
}
const createLocal = configure((e) => {
    async function* o(a = {}) {
      yield* (
        await e.post('refs/local', {
          signal: a.signal,
          transform: objectToCamel,
          searchParams: toUrlSearchParams(a),
          headers: a.headers,
        })
      ).ndjson();
    }
    return o;
  }),
  createRefs = configure((e, o) =>
    Object.assign(
      async function* (s, i = {}) {
        const c = Array.isArray(s) ? s : [s];
        yield* (
          await e.post('refs', {
            signal: i.signal,
            searchParams: toUrlSearchParams({
              arg: c.map(
                (h) => `${h instanceof Uint8Array ? CID$1.decode(h) : h}`
              ),
              ...i,
            }),
            headers: i.headers,
            transform: objectToCamel,
          })
        ).ndjson();
      },
      { local: createLocal(o) }
    )
  ),
  createGc = configure((e) => {
    async function* o(a = {}) {
      yield* (
        await e.post('repo/gc', {
          signal: a.signal,
          searchParams: toUrlSearchParams(a),
          headers: a.headers,
          transform: (i) => ({
            err: i.Error ? new Error(i.Error) : null,
            cid: (i.Key || {})['/'] ? CID$1.parse(i.Key['/']) : null,
          }),
        })
      ).ndjson();
    }
    return o;
  }),
  createStat = configure((e) => {
    async function o(a = {}) {
      const i = await (
        await e.post('repo/stat', {
          signal: a.signal,
          searchParams: toUrlSearchParams(a),
          headers: a.headers,
        })
      ).json();
      return {
        numObjects: BigInt(i.NumObjects),
        repoSize: BigInt(i.RepoSize),
        repoPath: i.RepoPath,
        version: i.Version,
        storageMax: BigInt(i.StorageMax),
      };
    }
    return o;
  }),
  createVersion$1 = configure((e) => {
    async function o(a = {}) {
      return (
        await (
          await e.post('repo/version', {
            signal: a.signal,
            searchParams: toUrlSearchParams(a),
            headers: a.headers,
          })
        ).json()
      ).Version;
    }
    return o;
  });
function createRepo(e) {
  return { gc: createGc(e), stat: createStat(e), version: createVersion$1(e) };
}
const createBw = configure((e) => {
  async function* o(a = {}) {
    yield* (
      await e.post('stats/bw', {
        signal: a.signal,
        searchParams: toUrlSearchParams(a),
        headers: a.headers,
        transform: (i) => ({
          totalIn: BigInt(i.TotalIn),
          totalOut: BigInt(i.TotalOut),
          rateIn: parseFloat(i.RateIn),
          rateOut: parseFloat(i.RateOut),
        }),
      })
    ).ndjson();
  }
  return o;
});
function createStats(e) {
  return { bitswap: createStat$4(e), repo: createStat(e), bw: createBw(e) };
}
const createAddrs = configure((e) => {
    async function o(a = {}) {
      const s = await e.post('swarm/addrs', {
          signal: a.signal,
          searchParams: toUrlSearchParams(a),
          headers: a.headers,
        }),
        { Addrs: i } = await s.json();
      return Object.keys(i).map((c) => ({
        id: peerIdFromString(c),
        addrs: (i[c] || []).map((d) => multiaddr$1(d)),
      }));
    }
    return o;
  }),
  createConnect = configure((e) => {
    async function o(a, s = {}) {
      const i = await e.post('swarm/connect', {
          signal: s.signal,
          searchParams: toUrlSearchParams({ arg: a, ...s }),
          headers: s.headers,
        }),
        { Strings: c } = await i.json();
      return c || [];
    }
    return o;
  }),
  createDisconnect = configure((e) => {
    async function o(a, s = {}) {
      const i = await e.post('swarm/disconnect', {
          signal: s.signal,
          searchParams: toUrlSearchParams({ arg: a, ...s }),
          headers: s.headers,
        }),
        { Strings: c } = await i.json();
      return c || [];
    }
    return o;
  }),
  createLocalAddrs = configure((e) => {
    async function o(a = {}) {
      const s = await e.post('swarm/addrs/local', {
          signal: a.signal,
          searchParams: toUrlSearchParams(a),
          headers: a.headers,
        }),
        { Strings: i } = await s.json();
      return (i || []).map((c) => multiaddr$1(c));
    }
    return o;
  }),
  createPeers = configure((e) => {
    async function o(a = {}) {
      const s = await e.post('swarm/peers', {
          signal: a.signal,
          searchParams: toUrlSearchParams(a),
          headers: a.headers,
        }),
        { Peers: i } = await s.json();
      return (i || []).map((c) => ({
        addr: multiaddr$1(c.Addr),
        peer: peerIdFromString(c.Peer),
        muxer: c.Muxer,
        latency: c.Latency,
        streams: c.Streams,
        direction:
          c.Direction == null
            ? void 0
            : c.Direction === 0
              ? 'inbound'
              : 'outbound',
      }));
    }
    return o;
  });
function createSwarm(e) {
  return {
    addrs: createAddrs(e),
    connect: createConnect(e),
    disconnect: createDisconnect(e),
    localAddrs: createLocalAddrs(e),
    peers: createPeers(e),
  };
}
const createAddAll = configure((e) => {
    async function* o(a, s = {}) {
      const i = new AbortController(),
        c = abortSignal(i.signal, s.signal),
        {
          headers: d,
          body: h,
          total: b,
          parts: g,
        } = await multipartRequest(a, i, s.headers),
        [$, _] =
          typeof s.progress == 'function'
            ? createProgressHandler(b, g, s.progress)
            : [void 0, void 0],
        _e = await e.post('add', {
          searchParams: toUrlSearchParams({
            'stream-channels': !0,
            ...s,
            progress: !!$,
          }),
          onUploadProgress: _,
          signal: c,
          headers: d,
          body: h,
        });
      for await (let ot of _e.ndjson())
        ((ot = objectToCamel(ot)),
          ot.hash !== void 0
            ? yield toCoreInterface(ot)
            : $ && $(ot.bytes || 0, ot.name));
    }
    return o;
  }),
  createProgressHandler = (e, o, a) =>
    o ? [void 0, createOnUploadProgress(e, o, a)] : [a, void 0],
  createOnUploadProgress = (e, o, a) => {
    let s = 0;
    const i = o.length;
    return ({ loaded: c, total: d }) => {
      const h = Math.floor((c / d) * e);
      for (; s < i; ) {
        const { start: b, end: g, name: $ } = o[s];
        if (h < g) {
          a(h - b, $);
          break;
        } else (a(g - b, $), (s += 1));
      }
    };
  };
function toCoreInterface({
  name: e,
  hash: o,
  size: a,
  mode: s,
  mtime: i,
  mtimeNsecs: c,
}) {
  const d = { path: e, cid: CID$1.parse(o), size: parseInt(a) };
  return (
    s != null && (d.mode = parseInt(s, 8)),
    i != null && (d.mtime = { secs: i, nsecs: c || 0 }),
    d
  );
}
function blobToIt(e) {
  return typeof e.stream == 'function'
    ? browserReadableStreamToIt(e.stream())
    : browserReadableStreamToIt(new Response(e).body);
}
async function* toAsyncIterable(e) {
  yield e;
}
async function normaliseContent(e) {
  if (isBytes(e)) return toAsyncIterable(toBytes(e));
  if (typeof e == 'string' || e instanceof String)
    return toAsyncIterable(toBytes(e.toString()));
  if (isBlob(e)) return blobToIt(e);
  if (
    (isReadableStream(e) && (e = browserReadableStreamToIt(e)),
    Symbol.iterator in e || Symbol.asyncIterator in e)
  ) {
    const o = peekableIterator(e),
      { value: a, done: s } = await o.peek();
    if (s) return toAsyncIterable(new Uint8Array(0));
    if ((o.push(a), Number.isInteger(a)))
      return toAsyncIterable(Uint8Array.from(await all(o)));
    if (isBytes(a) || typeof a == 'string' || a instanceof String)
      return map(o, toBytes);
  }
  throw errCode$1(new Error(`Unexpected input: ${e}`), 'ERR_UNEXPECTED_INPUT');
}
function toBytes(e) {
  return e instanceof Uint8Array
    ? e
    : ArrayBuffer.isView(e)
      ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength)
      : e instanceof ArrayBuffer
        ? new Uint8Array(e)
        : Array.isArray(e)
          ? Uint8Array.from(e)
          : fromString$3(e.toString());
}
async function* normaliseCandidateSingle(e, o) {
  if (e == null)
    throw errCode$1(
      new Error(`Unexpected input: ${e}`),
      'ERR_UNEXPECTED_INPUT'
    );
  if (typeof e == 'string' || e instanceof String) {
    yield toFileObject(e.toString(), o);
    return;
  }
  if (isBytes(e) || isBlob(e)) {
    yield toFileObject(e, o);
    return;
  }
  if (
    (isReadableStream(e) && (e = browserReadableStreamToIt(e)),
    Symbol.iterator in e || Symbol.asyncIterator in e)
  ) {
    const a = peekableIterator(e),
      { value: s, done: i } = await a.peek();
    if (i) {
      yield { content: [] };
      return;
    }
    if (
      (a.push(s),
      Number.isInteger(s) ||
        isBytes(s) ||
        typeof s == 'string' ||
        s instanceof String)
    ) {
      yield toFileObject(a, o);
      return;
    }
    throw errCode$1(
      new Error(
        'Unexpected input: multiple items passed - if you are using ipfs.add, please use ipfs.addAll instead'
      ),
      'ERR_UNEXPECTED_INPUT'
    );
  }
  if (isFileObject(e)) {
    yield toFileObject(e, o);
    return;
  }
  throw errCode$1(
    new Error(
      'Unexpected input: cannot convert "' + typeof e + '" into ImportCandidate'
    ),
    'ERR_UNEXPECTED_INPUT'
  );
}
async function toFileObject(e, o) {
  const { path: a, mode: s, mtime: i, content: c } = e,
    d = { path: a || '', mode: parseMode(s), mtime: parseMtime(i) };
  return (c ? (d.content = await o(c)) : a || (d.content = await o(e)), d);
}
function normaliseInput(e) {
  return normaliseCandidateSingle(e, normaliseContent);
}
function createAdd(e) {
  const o = createAddAll(e);
  return configure(() => {
    async function a(s, i = {}) {
      return await last(o(normaliseInput(s), i));
    }
    return a;
  })(e);
}
const createCat = configure((e) => {
    async function* o(a, s = {}) {
      yield* (
        await e.post('cat', {
          signal: s.signal,
          searchParams: toUrlSearchParams({ arg: a.toString(), ...s }),
          headers: s.headers,
        })
      ).iterator();
    }
    return o;
  }),
  createCommands = configure(
    (e) =>
      async (a = {}) =>
        (
          await e.post('commands', {
            signal: a.signal,
            searchParams: toUrlSearchParams(a),
            headers: a.headers,
          })
        ).json()
  ),
  createDns = configure(
    (e) =>
      async (a, s = {}) =>
        (
          await (
            await e.post('dns', {
              signal: s.signal,
              searchParams: toUrlSearchParams({ arg: a, ...s }),
              headers: s.headers,
            })
          ).json()
        ).Path
  ),
  createGetEndpointConfig = configure((e) => () => {
    const o = new URL(e.opts.base || '');
    return {
      host: o.hostname,
      port: o.port,
      protocol: o.protocol,
      pathname: o.pathname,
      'api-path': o.pathname,
    };
  }),
  createGet = configure((e) => {
    async function* o(a, s = {}) {
      const i = {
        arg: `${a instanceof Uint8Array ? CID$1.decode(a) : a}`,
        ...s,
      };
      (i.compressionLevel &&
        ((i['compression-level'] = i.compressionLevel),
        delete i.compressionLevel),
        yield* (
          await e.post('get', {
            signal: s.signal,
            searchParams: toUrlSearchParams(i),
            headers: s.headers,
          })
        ).iterator());
    }
    return o;
  }),
  createId = configure((e) => {
    async function o(a = {}) {
      const i = await (
          await e.post('id', {
            signal: a.signal,
            searchParams: toUrlSearchParams({
              arg: a.peerId ? a.peerId.toString() : void 0,
              ...a,
            }),
            headers: a.headers,
          })
        ).json(),
        c = { ...objectToCamel(i) };
      return (
        (c.id = peerIdFromString(c.id)),
        c.addresses && (c.addresses = c.addresses.map((d) => multiaddr$1(d))),
        c
      );
    }
    return o;
  }),
  createIsOnline = (e) => {
    const o = createId(e);
    async function a(s = {}) {
      const i = await o(s);
      return !!(i && i.addresses && i.addresses.length);
    }
    return a;
  },
  createLs = configure((e, o) => {
    async function* a(s, i = {}) {
      const c = `${s instanceof Uint8Array ? CID$1.decode(s) : s}`;
      async function d(b) {
        let g = b.Hash;
        if (g.includes('/')) {
          const _ = g.startsWith('/ipfs/') ? g : `/ipfs/${g}`;
          g = (await createStat$2(o)(_)).cid;
        } else g = CID$1.parse(g);
        const $ = {
          name: b.Name,
          path: c + (b.Name ? `/${b.Name}` : ''),
          size: b.Size,
          cid: g,
          type: typeOf(b),
        };
        return (
          b.Mode && ($.mode = parseInt(b.Mode, 8)),
          b.Mtime !== void 0 &&
            b.Mtime !== null &&
            (($.mtime = { secs: b.Mtime }),
            b.MtimeNsecs !== void 0 &&
              b.MtimeNsecs !== null &&
              ($.mtime.nsecs = b.MtimeNsecs)),
          $
        );
      }
      const h = await e.post('ls', {
        signal: i.signal,
        searchParams: toUrlSearchParams({ arg: c, ...i }),
        headers: i.headers,
      });
      for await (let b of h.ndjson()) {
        if (((b = b.Objects), !b))
          throw new Error('expected .Objects in results');
        if (((b = b[0]), !b))
          throw new Error('expected one array in results.Objects');
        const g = b.Links;
        if (!Array.isArray(g))
          throw new Error('expected one array in results.Objects[0].Links');
        if (!g.length) {
          yield d(b);
          return;
        }
        yield* g.map(d);
      }
    }
    return a;
  });
function typeOf(e) {
  switch (e.Type) {
    case 1:
    case 5:
      return 'dir';
    case 2:
      return 'file';
    default:
      return 'file';
  }
}
const createMount = configure((e) => {
    async function o(a = {}) {
      const s = await e.post('dns', {
        signal: a.signal,
        searchParams: toUrlSearchParams(a),
        headers: a.headers,
      });
      return objectToCamel(await s.json());
    }
    return o;
  }),
  createPing = configure((e) => {
    async function* o(a, s = {}) {
      yield* (
        await e.post('ping', {
          signal: s.signal,
          searchParams: toUrlSearchParams({ arg: `${a}`, ...s }),
          headers: s.headers,
          transform: objectToCamel,
        })
      ).ndjson();
    }
    return o;
  }),
  createResolve = configure((e) => {
    async function o(a, s = {}) {
      const i = await e.post('resolve', {
          signal: s.signal,
          searchParams: toUrlSearchParams({ arg: a, ...s }),
          headers: s.headers,
        }),
        { Path: c } = await i.json();
      return c;
    }
    return o;
  }),
  createStart = configure((e) => async (a = {}) => {
    throw errCode$1(new Error('Not implemented'), 'ERR_NOT_IMPLEMENTED');
  }),
  createStop = configure((e) => {
    async function o(a = {}) {
      await (
        await e.post('shutdown', {
          signal: a.signal,
          searchParams: toUrlSearchParams(a),
          headers: a.headers,
        })
      ).text();
    }
    return o;
  }),
  createVersion = configure((e) => {
    async function o(a = {}) {
      const s = await e.post('version', {
        signal: a.signal,
        searchParams: toUrlSearchParams(a),
        headers: a.headers,
      });
      return { ...objectToCamel(await s.json()), 'ipfs-http-client': '1.0.0' };
    }
    return o;
  });
function create(e = {}) {
  const o = {
      name: identity$3.name,
      code: identity$3.code,
      encode: (g) => g,
      decode: (g) => g,
    },
    a = Object.values(bases$2);
  (e.ipld && e.ipld.bases ? e.ipld.bases : []).forEach((g) => a.push(g));
  const s = new Multibases({ bases: a, loadBase: e.ipld && e.ipld.loadBase }),
    i = Object.values(codecs$1);
  [dagPB, dagCBOR, dagJSON, dagJOSE, o]
    .concat((e.ipld && e.ipld.codecs) || [])
    .forEach((g) => i.push(g));
  const c = new Multicodecs({
      codecs: i,
      loadCodec: e.ipld && e.ipld.loadCodec,
    }),
    d = Object.values(hashes);
  (e.ipld && e.ipld.hashers ? e.ipld.hashers : []).forEach((g) => d.push(g));
  const h = new Multihashes({
    hashers: d,
    loadHasher: e.ipld && e.ipld.loadHasher,
  });
  return {
    add: createAdd(e),
    addAll: createAddAll(e),
    bitswap: createBitswap(e),
    block: createBlock(e),
    bootstrap: createBootstrap(e),
    cat: createCat(e),
    commands: createCommands(e),
    config: createConfig(e),
    dag: createDag(c, e),
    dht: createDht(e),
    diag: createDiag(e),
    dns: createDns(e),
    files: createFiles(e),
    get: createGet(e),
    getEndpointConfig: createGetEndpointConfig(e),
    id: createId(e),
    isOnline: createIsOnline(e),
    key: createKey(e),
    log: createLog(e),
    ls: createLs(e),
    mount: createMount(e),
    name: createName(e),
    object: createObject(c, e),
    pin: createPin(e),
    ping: createPing(e),
    pubsub: createPubsub(e),
    refs: createRefs(e),
    repo: createRepo(e),
    resolve: createResolve(e),
    start: createStart(e),
    stats: createStats(e),
    stop: createStop(e),
    swarm: createSwarm(e),
    version: createVersion(e),
    bases: s,
    codecs: c,
    hashers: h,
  };
}
var aesJs = { exports: {} };
/*! MIT License. Copyright 2015-2018 Richard Moore <me@ricmoo.com>. See LICENSE.txt. */ (function (
  e,
  o
) {
  (function (a) {
    function s(it) {
      return parseInt(it) === it;
    }
    function i(it) {
      if (!s(it.length)) return !1;
      for (var ft = 0; ft < it.length; ft++)
        if (!s(it[ft]) || it[ft] < 0 || it[ft] > 255) return !1;
      return !0;
    }
    function c(it, ft) {
      if (it.buffer && it.name === 'Uint8Array')
        return (
          ft &&
            (it.slice
              ? (it = it.slice())
              : (it = Array.prototype.slice.call(it))),
          it
        );
      if (Array.isArray(it)) {
        if (!i(it)) throw new Error('Array contains invalid value: ' + it);
        return new Uint8Array(it);
      }
      if (s(it.length) && i(it)) return new Uint8Array(it);
      throw new Error('unsupported array-like object');
    }
    function d(it) {
      return new Uint8Array(it);
    }
    function h(it, ft, bt, mt, ht) {
      ((mt != null || ht != null) &&
        (it.slice
          ? (it = it.slice(mt, ht))
          : (it = Array.prototype.slice.call(it, mt, ht))),
        ft.set(it, bt));
    }
    var b = (function () {
        function it(bt) {
          var mt = [],
            ht = 0;
          for (bt = encodeURI(bt); ht < bt.length; ) {
            var Tt = bt.charCodeAt(ht++);
            Tt === 37
              ? (mt.push(parseInt(bt.substr(ht, 2), 16)), (ht += 2))
              : mt.push(Tt);
          }
          return c(mt);
        }
        function ft(bt) {
          for (var mt = [], ht = 0; ht < bt.length; ) {
            var Tt = bt[ht];
            Tt < 128
              ? (mt.push(String.fromCharCode(Tt)), ht++)
              : Tt > 191 && Tt < 224
                ? (mt.push(
                    String.fromCharCode(((Tt & 31) << 6) | (bt[ht + 1] & 63))
                  ),
                  (ht += 2))
                : (mt.push(
                    String.fromCharCode(
                      ((Tt & 15) << 12) |
                        ((bt[ht + 1] & 63) << 6) |
                        (bt[ht + 2] & 63)
                    )
                  ),
                  (ht += 3));
          }
          return mt.join('');
        }
        return { toBytes: it, fromBytes: ft };
      })(),
      g = (function () {
        function it(mt) {
          for (var ht = [], Tt = 0; Tt < mt.length; Tt += 2)
            ht.push(parseInt(mt.substr(Tt, 2), 16));
          return ht;
        }
        var ft = '0123456789abcdef';
        function bt(mt) {
          for (var ht = [], Tt = 0; Tt < mt.length; Tt++) {
            var Et = mt[Tt];
            ht.push(ft[(Et & 240) >> 4] + ft[Et & 15]);
          }
          return ht.join('');
        }
        return { toBytes: it, fromBytes: bt };
      })(),
      $ = { 16: 10, 24: 12, 32: 14 },
      _ = [
        1, 2, 4, 8, 16, 32, 64, 128, 27, 54, 108, 216, 171, 77, 154, 47, 94,
        188, 99, 198, 151, 53, 106, 212, 179, 125, 250, 239, 197, 145,
      ],
      _e = [
        99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171,
        118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164,
        114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113,
        216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39,
        178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227,
        47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76,
        88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60,
        159, 168, 81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16,
        255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61,
        100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20,
        222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98,
        145, 149, 228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244,
        234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221,
        116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53,
        87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155,
        30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104,
        65, 153, 45, 15, 176, 84, 187, 22,
      ],
      ot = [
        82, 9, 106, 213, 48, 54, 165, 56, 191, 64, 163, 158, 129, 243, 215, 251,
        124, 227, 57, 130, 155, 47, 255, 135, 52, 142, 67, 68, 196, 222, 233,
        203, 84, 123, 148, 50, 166, 194, 35, 61, 238, 76, 149, 11, 66, 250, 195,
        78, 8, 46, 161, 102, 40, 217, 36, 178, 118, 91, 162, 73, 109, 139, 209,
        37, 114, 248, 246, 100, 134, 104, 152, 22, 212, 164, 92, 204, 93, 101,
        182, 146, 108, 112, 72, 80, 253, 237, 185, 218, 94, 21, 70, 87, 167,
        141, 157, 132, 144, 216, 171, 0, 140, 188, 211, 10, 247, 228, 88, 5,
        184, 179, 69, 6, 208, 44, 30, 143, 202, 63, 15, 2, 193, 175, 189, 3, 1,
        19, 138, 107, 58, 145, 17, 65, 79, 103, 220, 234, 151, 242, 207, 206,
        240, 180, 230, 115, 150, 172, 116, 34, 231, 173, 53, 133, 226, 249, 55,
        232, 28, 117, 223, 110, 71, 241, 26, 113, 29, 41, 197, 137, 111, 183,
        98, 14, 170, 24, 190, 27, 252, 86, 62, 75, 198, 210, 121, 32, 154, 219,
        192, 254, 120, 205, 90, 244, 31, 221, 168, 51, 136, 7, 199, 49, 177, 18,
        16, 89, 39, 128, 236, 95, 96, 81, 127, 169, 25, 181, 74, 13, 45, 229,
        122, 159, 147, 201, 156, 239, 160, 224, 59, 77, 174, 42, 245, 176, 200,
        235, 187, 60, 131, 83, 153, 97, 23, 43, 4, 126, 186, 119, 214, 38, 225,
        105, 20, 99, 85, 33, 12, 125,
      ],
      j = [
        3328402341, 4168907908, 4000806809, 4135287693, 4294111757, 3597364157,
        3731845041, 2445657428, 1613770832, 33620227, 3462883241, 1445669757,
        3892248089, 3050821474, 1303096294, 3967186586, 2412431941, 528646813,
        2311702848, 4202528135, 4026202645, 2992200171, 2387036105, 4226871307,
        1101901292, 3017069671, 1604494077, 1169141738, 597466303, 1403299063,
        3832705686, 2613100635, 1974974402, 3791519004, 1033081774, 1277568618,
        1815492186, 2118074177, 4126668546, 2211236943, 1748251740, 1369810420,
        3521504564, 4193382664, 3799085459, 2883115123, 1647391059, 706024767,
        134480908, 2512897874, 1176707941, 2646852446, 806885416, 932615841,
        168101135, 798661301, 235341577, 605164086, 461406363, 3756188221,
        3454790438, 1311188841, 2142417613, 3933566367, 302582043, 495158174,
        1479289972, 874125870, 907746093, 3698224818, 3025820398, 1537253627,
        2756858614, 1983593293, 3084310113, 2108928974, 1378429307, 3722699582,
        1580150641, 327451799, 2790478837, 3117535592, 0, 3253595436,
        1075847264, 3825007647, 2041688520, 3059440621, 3563743934, 2378943302,
        1740553945, 1916352843, 2487896798, 2555137236, 2958579944, 2244988746,
        3151024235, 3320835882, 1336584933, 3992714006, 2252555205, 2588757463,
        1714631509, 293963156, 2319795663, 3925473552, 67240454, 4269768577,
        2689618160, 2017213508, 631218106, 1269344483, 2723238387, 1571005438,
        2151694528, 93294474, 1066570413, 563977660, 1882732616, 4059428100,
        1673313503, 2008463041, 2950355573, 1109467491, 537923632, 3858759450,
        4260623118, 3218264685, 2177748300, 403442708, 638784309, 3287084079,
        3193921505, 899127202, 2286175436, 773265209, 2479146071, 1437050866,
        4236148354, 2050833735, 3362022572, 3126681063, 840505643, 3866325909,
        3227541664, 427917720, 2655997905, 2749160575, 1143087718, 1412049534,
        999329963, 193497219, 2353415882, 3354324521, 1807268051, 672404540,
        2816401017, 3160301282, 369822493, 2916866934, 3688947771, 1681011286,
        1949973070, 336202270, 2454276571, 201721354, 1210328172, 3093060836,
        2680341085, 3184776046, 1135389935, 3294782118, 965841320, 831886756,
        3554993207, 4068047243, 3588745010, 2345191491, 1849112409, 3664604599,
        26054028, 2983581028, 2622377682, 1235855840, 3630984372, 2891339514,
        4092916743, 3488279077, 3395642799, 4101667470, 1202630377, 268961816,
        1874508501, 4034427016, 1243948399, 1546530418, 941366308, 1470539505,
        1941222599, 2546386513, 3421038627, 2715671932, 3899946140, 1042226977,
        2521517021, 1639824860, 227249030, 260737669, 3765465232, 2084453954,
        1907733956, 3429263018, 2420656344, 100860677, 4160157185, 470683154,
        3261161891, 1781871967, 2924959737, 1773779408, 394692241, 2579611992,
        974986535, 664706745, 3655459128, 3958962195, 731420851, 571543859,
        3530123707, 2849626480, 126783113, 865375399, 765172662, 1008606754,
        361203602, 3387549984, 2278477385, 2857719295, 1344809080, 2782912378,
        59542671, 1503764984, 160008576, 437062935, 1707065306, 3622233649,
        2218934982, 3496503480, 2185314755, 697932208, 1512910199, 504303377,
        2075177163, 2824099068, 1841019862, 739644986,
      ],
      nt = [
        2781242211, 2230877308, 2582542199, 2381740923, 234877682, 3184946027,
        2984144751, 1418839493, 1348481072, 50462977, 2848876391, 2102799147,
        434634494, 1656084439, 3863849899, 2599188086, 1167051466, 2636087938,
        1082771913, 2281340285, 368048890, 3954334041, 3381544775, 201060592,
        3963727277, 1739838676, 4250903202, 3930435503, 3206782108, 4149453988,
        2531553906, 1536934080, 3262494647, 484572669, 2923271059, 1783375398,
        1517041206, 1098792767, 49674231, 1334037708, 1550332980, 4098991525,
        886171109, 150598129, 2481090929, 1940642008, 1398944049, 1059722517,
        201851908, 1385547719, 1699095331, 1587397571, 674240536, 2704774806,
        252314885, 3039795866, 151914247, 908333586, 2602270848, 1038082786,
        651029483, 1766729511, 3447698098, 2682942837, 454166793, 2652734339,
        1951935532, 775166490, 758520603, 3000790638, 4004797018, 4217086112,
        4137964114, 1299594043, 1639438038, 3464344499, 2068982057, 1054729187,
        1901997871, 2534638724, 4121318227, 1757008337, 0, 750906861,
        1614815264, 535035132, 3363418545, 3988151131, 3201591914, 1183697867,
        3647454910, 1265776953, 3734260298, 3566750796, 3903871064, 1250283471,
        1807470800, 717615087, 3847203498, 384695291, 3313910595, 3617213773,
        1432761139, 2484176261, 3481945413, 283769337, 100925954, 2180939647,
        4037038160, 1148730428, 3123027871, 3813386408, 4087501137, 4267549603,
        3229630528, 2315620239, 2906624658, 3156319645, 1215313976, 82966005,
        3747855548, 3245848246, 1974459098, 1665278241, 807407632, 451280895,
        251524083, 1841287890, 1283575245, 337120268, 891687699, 801369324,
        3787349855, 2721421207, 3431482436, 959321879, 1469301956, 4065699751,
        2197585534, 1199193405, 2898814052, 3887750493, 724703513, 2514908019,
        2696962144, 2551808385, 3516813135, 2141445340, 1715741218, 2119445034,
        2872807568, 2198571144, 3398190662, 700968686, 3547052216, 1009259540,
        2041044702, 3803995742, 487983883, 1991105499, 1004265696, 1449407026,
        1316239930, 504629770, 3683797321, 168560134, 1816667172, 3837287516,
        1570751170, 1857934291, 4014189740, 2797888098, 2822345105, 2754712981,
        936633572, 2347923833, 852879335, 1133234376, 1500395319, 3084545389,
        2348912013, 1689376213, 3533459022, 3762923945, 3034082412, 4205598294,
        133428468, 634383082, 2949277029, 2398386810, 3913789102, 403703816,
        3580869306, 2297460856, 1867130149, 1918643758, 607656988, 4049053350,
        3346248884, 1368901318, 600565992, 2090982877, 2632479860, 557719327,
        3717614411, 3697393085, 2249034635, 2232388234, 2430627952, 1115438654,
        3295786421, 2865522278, 3633334344, 84280067, 33027830, 303828494,
        2747425121, 1600795957, 4188952407, 3496589753, 2434238086, 1486471617,
        658119965, 3106381470, 953803233, 334231800, 3005978776, 857870609,
        3151128937, 1890179545, 2298973838, 2805175444, 3056442267, 574365214,
        2450884487, 550103529, 1233637070, 4289353045, 2018519080, 2057691103,
        2399374476, 4166623649, 2148108681, 387583245, 3664101311, 836232934,
        3330556482, 3100665960, 3280093505, 2955516313, 2002398509, 287182607,
        3413881008, 4238890068, 3597515707, 975967766,
      ],
      lt = [
        1671808611, 2089089148, 2006576759, 2072901243, 4061003762, 1807603307,
        1873927791, 3310653893, 810573872, 16974337, 1739181671, 729634347,
        4263110654, 3613570519, 2883997099, 1989864566, 3393556426, 2191335298,
        3376449993, 2106063485, 4195741690, 1508618841, 1204391495, 4027317232,
        2917941677, 3563566036, 2734514082, 2951366063, 2629772188, 2767672228,
        1922491506, 3227229120, 3082974647, 4246528509, 2477669779, 644500518,
        911895606, 1061256767, 4144166391, 3427763148, 878471220, 2784252325,
        3845444069, 4043897329, 1905517169, 3631459288, 827548209, 356461077,
        67897348, 3344078279, 593839651, 3277757891, 405286936, 2527147926,
        84871685, 2595565466, 118033927, 305538066, 2157648768, 3795705826,
        3945188843, 661212711, 2999812018, 1973414517, 152769033, 2208177539,
        745822252, 439235610, 455947803, 1857215598, 1525593178, 2700827552,
        1391895634, 994932283, 3596728278, 3016654259, 695947817, 3812548067,
        795958831, 2224493444, 1408607827, 3513301457, 0, 3979133421, 543178784,
        4229948412, 2982705585, 1542305371, 1790891114, 3410398667, 3201918910,
        961245753, 1256100938, 1289001036, 1491644504, 3477767631, 3496721360,
        4012557807, 2867154858, 4212583931, 1137018435, 1305975373, 861234739,
        2241073541, 1171229253, 4178635257, 33948674, 2139225727, 1357946960,
        1011120188, 2679776671, 2833468328, 1374921297, 2751356323, 1086357568,
        2408187279, 2460827538, 2646352285, 944271416, 4110742005, 3168756668,
        3066132406, 3665145818, 560153121, 271589392, 4279952895, 4077846003,
        3530407890, 3444343245, 202643468, 322250259, 3962553324, 1608629855,
        2543990167, 1154254916, 389623319, 3294073796, 2817676711, 2122513534,
        1028094525, 1689045092, 1575467613, 422261273, 1939203699, 1621147744,
        2174228865, 1339137615, 3699352540, 577127458, 712922154, 2427141008,
        2290289544, 1187679302, 3995715566, 3100863416, 339486740, 3732514782,
        1591917662, 186455563, 3681988059, 3762019296, 844522546, 978220090,
        169743370, 1239126601, 101321734, 611076132, 1558493276, 3260915650,
        3547250131, 2901361580, 1655096418, 2443721105, 2510565781, 3828863972,
        2039214713, 3878868455, 3359869896, 928607799, 1840765549, 2374762893,
        3580146133, 1322425422, 2850048425, 1823791212, 1459268694, 4094161908,
        3928346602, 1706019429, 2056189050, 2934523822, 135794696, 3134549946,
        2022240376, 628050469, 779246638, 472135708, 2800834470, 3032970164,
        3327236038, 3894660072, 3715932637, 1956440180, 522272287, 1272813131,
        3185336765, 2340818315, 2323976074, 1888542832, 1044544574, 3049550261,
        1722469478, 1222152264, 50660867, 4127324150, 236067854, 1638122081,
        895445557, 1475980887, 3117443513, 2257655686, 3243809217, 489110045,
        2662934430, 3778599393, 4162055160, 2561878936, 288563729, 1773916777,
        3648039385, 2391345038, 2493985684, 2612407707, 505560094, 2274497927,
        3911240169, 3460925390, 1442818645, 678973480, 3749357023, 2358182796,
        2717407649, 2306869641, 219617805, 3218761151, 3862026214, 1120306242,
        1756942440, 1103331905, 2578459033, 762796589, 252780047, 2966125488,
        1425844308, 3151392187, 372911126,
      ],
      tt = [
        1667474886, 2088535288, 2004326894, 2071694838, 4075949567, 1802223062,
        1869591006, 3318043793, 808472672, 16843522, 1734846926, 724270422,
        4278065639, 3621216949, 2880169549, 1987484396, 3402253711, 2189597983,
        3385409673, 2105378810, 4210693615, 1499065266, 1195886990, 4042263547,
        2913856577, 3570689971, 2728590687, 2947541573, 2627518243, 2762274643,
        1920112356, 3233831835, 3082273397, 4261223649, 2475929149, 640051788,
        909531756, 1061110142, 4160160501, 3435941763, 875846760, 2779116625,
        3857003729, 4059105529, 1903268834, 3638064043, 825316194, 353713962,
        67374088, 3351728789, 589522246, 3284360861, 404236336, 2526454071,
        84217610, 2593830191, 117901582, 303183396, 2155911963, 3806477791,
        3958056653, 656894286, 2998062463, 1970642922, 151591698, 2206440989,
        741110872, 437923380, 454765878, 1852748508, 1515908788, 2694904667,
        1381168804, 993742198, 3604373943, 3014905469, 690584402, 3823320797,
        791638366, 2223281939, 1398011302, 3520161977, 0, 3991743681, 538992704,
        4244381667, 2981218425, 1532751286, 1785380564, 3419096717, 3200178535,
        960056178, 1246420628, 1280103576, 1482221744, 3486468741, 3503319995,
        4025428677, 2863326543, 4227536621, 1128514950, 1296947098, 859002214,
        2240123921, 1162203018, 4193849577, 33687044, 2139062782, 1347481760,
        1010582648, 2678045221, 2829640523, 1364325282, 2745433693, 1077985408,
        2408548869, 2459086143, 2644360225, 943212656, 4126475505, 3166494563,
        3065430391, 3671750063, 555836226, 269496352, 4294908645, 4092792573,
        3537006015, 3452783745, 202118168, 320025894, 3974901699, 1600119230,
        2543297077, 1145359496, 387397934, 3301201811, 2812801621, 2122220284,
        1027426170, 1684319432, 1566435258, 421079858, 1936954854, 1616945344,
        2172753945, 1330631070, 3705438115, 572679748, 707427924, 2425400123,
        2290647819, 1179044492, 4008585671, 3099120491, 336870440, 3739122087,
        1583276732, 185277718, 3688593069, 3772791771, 842159716, 976899700,
        168435220, 1229577106, 101059084, 606366792, 1549591736, 3267517855,
        3553849021, 2897014595, 1650632388, 2442242105, 2509612081, 3840161747,
        2038008818, 3890688725, 3368567691, 926374254, 1835907034, 2374863873,
        3587531953, 1313788572, 2846482505, 1819063512, 1448540844, 4109633523,
        3941213647, 1701162954, 2054852340, 2930698567, 134748176, 3132806511,
        2021165296, 623210314, 774795868, 471606328, 2795958615, 3031746419,
        3334885783, 3907527627, 3722280097, 1953799400, 522133822, 1263263126,
        3183336545, 2341176845, 2324333839, 1886425312, 1044267644, 3048588401,
        1718004428, 1212733584, 50529542, 4143317495, 235803164, 1633788866,
        892690282, 1465383342, 3115962473, 2256965911, 3250673817, 488449850,
        2661202215, 3789633753, 4177007595, 2560144171, 286339874, 1768537042,
        3654906025, 2391705863, 2492770099, 2610673197, 505291324, 2273808917,
        3924369609, 3469625735, 1431699370, 673740880, 3755965093, 2358021891,
        2711746649, 2307489801, 218961690, 3217021541, 3873845719, 1111672452,
        1751693520, 1094828930, 2576986153, 757954394, 252645662, 2964376443,
        1414855848, 3149649517, 370555436,
      ],
      et = [
        1374988112, 2118214995, 437757123, 975658646, 1001089995, 530400753,
        2902087851, 1273168787, 540080725, 2910219766, 2295101073, 4110568485,
        1340463100, 3307916247, 641025152, 3043140495, 3736164937, 632953703,
        1172967064, 1576976609, 3274667266, 2169303058, 2370213795, 1809054150,
        59727847, 361929877, 3211623147, 2505202138, 3569255213, 1484005843,
        1239443753, 2395588676, 1975683434, 4102977912, 2572697195, 666464733,
        3202437046, 4035489047, 3374361702, 2110667444, 1675577880, 3843699074,
        2538681184, 1649639237, 2976151520, 3144396420, 4269907996, 4178062228,
        1883793496, 2403728665, 2497604743, 1383856311, 2876494627, 1917518562,
        3810496343, 1716890410, 3001755655, 800440835, 2261089178, 3543599269,
        807962610, 599762354, 33778362, 3977675356, 2328828971, 2809771154,
        4077384432, 1315562145, 1708848333, 101039829, 3509871135, 3299278474,
        875451293, 2733856160, 92987698, 2767645557, 193195065, 1080094634,
        1584504582, 3178106961, 1042385657, 2531067453, 3711829422, 1306967366,
        2438237621, 1908694277, 67556463, 1615861247, 429456164, 3602770327,
        2302690252, 1742315127, 2968011453, 126454664, 3877198648, 2043211483,
        2709260871, 2084704233, 4169408201, 0, 159417987, 841739592, 504459436,
        1817866830, 4245618683, 260388950, 1034867998, 908933415, 168810852,
        1750902305, 2606453969, 607530554, 202008497, 2472011535, 3035535058,
        463180190, 2160117071, 1641816226, 1517767529, 470948374, 3801332234,
        3231722213, 1008918595, 303765277, 235474187, 4069246893, 766945465,
        337553864, 1475418501, 2943682380, 4003061179, 2743034109, 4144047775,
        1551037884, 1147550661, 1543208500, 2336434550, 3408119516, 3069049960,
        3102011747, 3610369226, 1113818384, 328671808, 2227573024, 2236228733,
        3535486456, 2935566865, 3341394285, 496906059, 3702665459, 226906860,
        2009195472, 733156972, 2842737049, 294930682, 1206477858, 2835123396,
        2700099354, 1451044056, 573804783, 2269728455, 3644379585, 2362090238,
        2564033334, 2801107407, 2776292904, 3669462566, 1068351396, 742039012,
        1350078989, 1784663195, 1417561698, 4136440770, 2430122216, 775550814,
        2193862645, 2673705150, 1775276924, 1876241833, 3475313331, 3366754619,
        270040487, 3902563182, 3678124923, 3441850377, 1851332852, 3969562369,
        2203032232, 3868552805, 2868897406, 566021896, 4011190502, 3135740889,
        1248802510, 3936291284, 699432150, 832877231, 708780849, 3332740144,
        899835584, 1951317047, 4236429990, 3767586992, 866637845, 4043610186,
        1106041591, 2144161806, 395441711, 1984812685, 1139781709, 3433712980,
        3835036895, 2664543715, 1282050075, 3240894392, 1181045119, 2640243204,
        25965917, 4203181171, 4211818798, 3009879386, 2463879762, 3910161971,
        1842759443, 2597806476, 933301370, 1509430414, 3943906441, 3467192302,
        3076639029, 3776767469, 2051518780, 2631065433, 1441952575, 404016761,
        1942435775, 1408749034, 1610459739, 3745345300, 2017778566, 3400528769,
        3110650942, 941896748, 3265478751, 371049330, 3168937228, 675039627,
        4279080257, 967311729, 135050206, 3635733660, 1683407248, 2076935265,
        3576870512, 1215061108, 3501741890,
      ],
      rt = [
        1347548327, 1400783205, 3273267108, 2520393566, 3409685355, 4045380933,
        2880240216, 2471224067, 1428173050, 4138563181, 2441661558, 636813900,
        4233094615, 3620022987, 2149987652, 2411029155, 1239331162, 1730525723,
        2554718734, 3781033664, 46346101, 310463728, 2743944855, 3328955385,
        3875770207, 2501218972, 3955191162, 3667219033, 768917123, 3545789473,
        692707433, 1150208456, 1786102409, 2029293177, 1805211710, 3710368113,
        3065962831, 401639597, 1724457132, 3028143674, 409198410, 2196052529,
        1620529459, 1164071807, 3769721975, 2226875310, 486441376, 2499348523,
        1483753576, 428819965, 2274680428, 3075636216, 598438867, 3799141122,
        1474502543, 711349675, 129166120, 53458370, 2592523643, 2782082824,
        4063242375, 2988687269, 3120694122, 1559041666, 730517276, 2460449204,
        4042459122, 2706270690, 3446004468, 3573941694, 533804130, 2328143614,
        2637442643, 2695033685, 839224033, 1973745387, 957055980, 2856345839,
        106852767, 1371368976, 4181598602, 1033297158, 2933734917, 1179510461,
        3046200461, 91341917, 1862534868, 4284502037, 605657339, 2547432937,
        3431546947, 2003294622, 3182487618, 2282195339, 954669403, 3682191598,
        1201765386, 3917234703, 3388507166, 0, 2198438022, 1211247597,
        2887651696, 1315723890, 4227665663, 1443857720, 507358933, 657861945,
        1678381017, 560487590, 3516619604, 975451694, 2970356327, 261314535,
        3535072918, 2652609425, 1333838021, 2724322336, 1767536459, 370938394,
        182621114, 3854606378, 1128014560, 487725847, 185469197, 2918353863,
        3106780840, 3356761769, 2237133081, 1286567175, 3152976349, 4255350624,
        2683765030, 3160175349, 3309594171, 878443390, 1988838185, 3704300486,
        1756818940, 1673061617, 3403100636, 272786309, 1075025698, 545572369,
        2105887268, 4174560061, 296679730, 1841768865, 1260232239, 4091327024,
        3960309330, 3497509347, 1814803222, 2578018489, 4195456072, 575138148,
        3299409036, 446754879, 3629546796, 4011996048, 3347532110, 3252238545,
        4270639778, 915985419, 3483825537, 681933534, 651868046, 2755636671,
        3828103837, 223377554, 2607439820, 1649704518, 3270937875, 3901806776,
        1580087799, 4118987695, 3198115200, 2087309459, 2842678573, 3016697106,
        1003007129, 2802849917, 1860738147, 2077965243, 164439672, 4100872472,
        32283319, 2827177882, 1709610350, 2125135846, 136428751, 3874428392,
        3652904859, 3460984630, 3572145929, 3593056380, 2939266226, 824852259,
        818324884, 3224740454, 930369212, 2801566410, 2967507152, 355706840,
        1257309336, 4148292826, 243256656, 790073846, 2373340630, 1296297904,
        1422699085, 3756299780, 3818836405, 457992840, 3099667487, 2135319889,
        77422314, 1560382517, 1945798516, 788204353, 1521706781, 1385356242,
        870912086, 325965383, 2358957921, 2050466060, 2388260884, 2313884476,
        4006521127, 901210569, 3990953189, 1014646705, 1503449823, 1062597235,
        2031621326, 3212035895, 3931371469, 1533017514, 350174575, 2256028891,
        2177544179, 1052338372, 741876788, 1606591296, 1914052035, 213705253,
        2334669897, 1107234197, 1899603969, 3725069491, 2631447780, 2422494913,
        1635502980, 1893020342, 1950903388, 1120974935,
      ],
      at = [
        2807058932, 1699970625, 2764249623, 1586903591, 1808481195, 1173430173,
        1487645946, 59984867, 4199882800, 1844882806, 1989249228, 1277555970,
        3623636965, 3419915562, 1149249077, 2744104290, 1514790577, 459744698,
        244860394, 3235995134, 1963115311, 4027744588, 2544078150, 4190530515,
        1608975247, 2627016082, 2062270317, 1507497298, 2200818878, 567498868,
        1764313568, 3359936201, 2305455554, 2037970062, 1047239e3, 1910319033,
        1337376481, 2904027272, 2892417312, 984907214, 1243112415, 830661914,
        861968209, 2135253587, 2011214180, 2927934315, 2686254721, 731183368,
        1750626376, 4246310725, 1820824798, 4172763771, 3542330227, 48394827,
        2404901663, 2871682645, 671593195, 3254988725, 2073724613, 145085239,
        2280796200, 2779915199, 1790575107, 2187128086, 472615631, 3029510009,
        4075877127, 3802222185, 4107101658, 3201631749, 1646252340, 4270507174,
        1402811438, 1436590835, 3778151818, 3950355702, 3963161475, 4020912224,
        2667994737, 273792366, 2331590177, 104699613, 95345982, 3175501286,
        2377486676, 1560637892, 3564045318, 369057872, 4213447064, 3919042237,
        1137477952, 2658625497, 1119727848, 2340947849, 1530455833, 4007360968,
        172466556, 266959938, 516552836, 0, 2256734592, 3980931627, 1890328081,
        1917742170, 4294704398, 945164165, 3575528878, 958871085, 3647212047,
        2787207260, 1423022939, 775562294, 1739656202, 3876557655, 2530391278,
        2443058075, 3310321856, 547512796, 1265195639, 437656594, 3121275539,
        719700128, 3762502690, 387781147, 218828297, 3350065803, 2830708150,
        2848461854, 428169201, 122466165, 3720081049, 1627235199, 648017665,
        4122762354, 1002783846, 2117360635, 695634755, 3336358691, 4234721005,
        4049844452, 3704280881, 2232435299, 574624663, 287343814, 612205898,
        1039717051, 840019705, 2708326185, 793451934, 821288114, 1391201670,
        3822090177, 376187827, 3113855344, 1224348052, 1679968233, 2361698556,
        1058709744, 752375421, 2431590963, 1321699145, 3519142200, 2734591178,
        188127444, 2177869557, 3727205754, 2384911031, 3215212461, 2648976442,
        2450346104, 3432737375, 1180849278, 331544205, 3102249176, 4150144569,
        2952102595, 2159976285, 2474404304, 766078933, 313773861, 2570832044,
        2108100632, 1668212892, 3145456443, 2013908262, 418672217, 3070356634,
        2594734927, 1852171925, 3867060991, 3473416636, 3907448597, 2614737639,
        919489135, 164948639, 2094410160, 2997825956, 590424639, 2486224549,
        1723872674, 3157750862, 3399941250, 3501252752, 3625268135, 2555048196,
        3673637356, 1343127501, 4130281361, 3599595085, 2957853679, 1297403050,
        81781910, 3051593425, 2283490410, 532201772, 1367295589, 3926170974,
        895287692, 1953757831, 1093597963, 492483431, 3528626907, 1446242576,
        1192455638, 1636604631, 209336225, 344873464, 1015671571, 669961897,
        3375740769, 3857572124, 2973530695, 3747192018, 1933530610, 3464042516,
        935293895, 3454686199, 2858115069, 1863638845, 3683022916, 4085369519,
        3292445032, 875313188, 1080017571, 3279033885, 621591778, 1233856572,
        2504130317, 24197544, 3017672716, 3835484340, 3247465558, 2220981195,
        3060847922, 1551124588, 1463996600,
      ],
      ct = [
        4104605777, 1097159550, 396673818, 660510266, 2875968315, 2638606623,
        4200115116, 3808662347, 821712160, 1986918061, 3430322568, 38544885,
        3856137295, 718002117, 893681702, 1654886325, 2975484382, 3122358053,
        3926825029, 4274053469, 796197571, 1290801793, 1184342925, 3556361835,
        2405426947, 2459735317, 1836772287, 1381620373, 3196267988, 1948373848,
        3764988233, 3385345166, 3263785589, 2390325492, 1480485785, 3111247143,
        3780097726, 2293045232, 548169417, 3459953789, 3746175075, 439452389,
        1362321559, 1400849762, 1685577905, 1806599355, 2174754046, 137073913,
        1214797936, 1174215055, 3731654548, 2079897426, 1943217067, 1258480242,
        529487843, 1437280870, 3945269170, 3049390895, 3313212038, 923313619,
        679998e3, 3215307299, 57326082, 377642221, 3474729866, 2041877159,
        133361907, 1776460110, 3673476453, 96392454, 878845905, 2801699524,
        777231668, 4082475170, 2330014213, 4142626212, 2213296395, 1626319424,
        1906247262, 1846563261, 562755902, 3708173718, 1040559837, 3871163981,
        1418573201, 3294430577, 114585348, 1343618912, 2566595609, 3186202582,
        1078185097, 3651041127, 3896688048, 2307622919, 425408743, 3371096953,
        2081048481, 1108339068, 2216610296, 0, 2156299017, 736970802, 292596766,
        1517440620, 251657213, 2235061775, 2933202493, 758720310, 265905162,
        1554391400, 1532285339, 908999204, 174567692, 1474760595, 4002861748,
        2610011675, 3234156416, 3693126241, 2001430874, 303699484, 2478443234,
        2687165888, 585122620, 454499602, 151849742, 2345119218, 3064510765,
        514443284, 4044981591, 1963412655, 2581445614, 2137062819, 19308535,
        1928707164, 1715193156, 4219352155, 1126790795, 600235211, 3992742070,
        3841024952, 836553431, 1669664834, 2535604243, 3323011204, 1243905413,
        3141400786, 4180808110, 698445255, 2653899549, 2989552604, 2253581325,
        3252932727, 3004591147, 1891211689, 2487810577, 3915653703, 4237083816,
        4030667424, 2100090966, 865136418, 1229899655, 953270745, 3399679628,
        3557504664, 4118925222, 2061379749, 3079546586, 2915017791, 983426092,
        2022837584, 1607244650, 2118541908, 2366882550, 3635996816, 972512814,
        3283088770, 1568718495, 3499326569, 3576539503, 621982671, 2895723464,
        410887952, 2623762152, 1002142683, 645401037, 1494807662, 2595684844,
        1335535747, 2507040230, 4293295786, 3167684641, 367585007, 3885750714,
        1865862730, 2668221674, 2960971305, 2763173681, 1059270954, 2777952454,
        2724642869, 1320957812, 2194319100, 2429595872, 2815956275, 77089521,
        3973773121, 3444575871, 2448830231, 1305906550, 4021308739, 2857194700,
        2516901860, 3518358430, 1787304780, 740276417, 1699839814, 1592394909,
        2352307457, 2272556026, 188821243, 1729977011, 3687994002, 274084841,
        3594982253, 3613494426, 2701949495, 4162096729, 322734571, 2837966542,
        1640576439, 484830689, 1202797690, 3537852828, 4067639125, 349075736,
        3342319475, 4157467219, 4255800159, 1030690015, 1155237496, 2951971274,
        1757691577, 607398968, 2738905026, 499347990, 3794078908, 1011452712,
        227885567, 2818666809, 213114376, 3034881240, 1455525988, 3414450555,
        850817237, 1817998408, 3092726480,
      ],
      dt = [
        0, 235474187, 470948374, 303765277, 941896748, 908933415, 607530554,
        708780849, 1883793496, 2118214995, 1817866830, 1649639237, 1215061108,
        1181045119, 1417561698, 1517767529, 3767586992, 4003061179, 4236429990,
        4069246893, 3635733660, 3602770327, 3299278474, 3400528769, 2430122216,
        2664543715, 2362090238, 2193862645, 2835123396, 2801107407, 3035535058,
        3135740889, 3678124923, 3576870512, 3341394285, 3374361702, 3810496343,
        3977675356, 4279080257, 4043610186, 2876494627, 2776292904, 3076639029,
        3110650942, 2472011535, 2640243204, 2403728665, 2169303058, 1001089995,
        899835584, 666464733, 699432150, 59727847, 226906860, 530400753,
        294930682, 1273168787, 1172967064, 1475418501, 1509430414, 1942435775,
        2110667444, 1876241833, 1641816226, 2910219766, 2743034109, 2976151520,
        3211623147, 2505202138, 2606453969, 2302690252, 2269728455, 3711829422,
        3543599269, 3240894392, 3475313331, 3843699074, 3943906441, 4178062228,
        4144047775, 1306967366, 1139781709, 1374988112, 1610459739, 1975683434,
        2076935265, 1775276924, 1742315127, 1034867998, 866637845, 566021896,
        800440835, 92987698, 193195065, 429456164, 395441711, 1984812685,
        2017778566, 1784663195, 1683407248, 1315562145, 1080094634, 1383856311,
        1551037884, 101039829, 135050206, 437757123, 337553864, 1042385657,
        807962610, 573804783, 742039012, 2531067453, 2564033334, 2328828971,
        2227573024, 2935566865, 2700099354, 3001755655, 3168937228, 3868552805,
        3902563182, 4203181171, 4102977912, 3736164937, 3501741890, 3265478751,
        3433712980, 1106041591, 1340463100, 1576976609, 1408749034, 2043211483,
        2009195472, 1708848333, 1809054150, 832877231, 1068351396, 766945465,
        599762354, 159417987, 126454664, 361929877, 463180190, 2709260871,
        2943682380, 3178106961, 3009879386, 2572697195, 2538681184, 2236228733,
        2336434550, 3509871135, 3745345300, 3441850377, 3274667266, 3910161971,
        3877198648, 4110568485, 4211818798, 2597806476, 2497604743, 2261089178,
        2295101073, 2733856160, 2902087851, 3202437046, 2968011453, 3936291284,
        3835036895, 4136440770, 4169408201, 3535486456, 3702665459, 3467192302,
        3231722213, 2051518780, 1951317047, 1716890410, 1750902305, 1113818384,
        1282050075, 1584504582, 1350078989, 168810852, 67556463, 371049330,
        404016761, 841739592, 1008918595, 775550814, 540080725, 3969562369,
        3801332234, 4035489047, 4269907996, 3569255213, 3669462566, 3366754619,
        3332740144, 2631065433, 2463879762, 2160117071, 2395588676, 2767645557,
        2868897406, 3102011747, 3069049960, 202008497, 33778362, 270040487,
        504459436, 875451293, 975658646, 675039627, 641025152, 2084704233,
        1917518562, 1615861247, 1851332852, 1147550661, 1248802510, 1484005843,
        1451044056, 933301370, 967311729, 733156972, 632953703, 260388950,
        25965917, 328671808, 496906059, 1206477858, 1239443753, 1543208500,
        1441952575, 2144161806, 1908694277, 1675577880, 1842759443, 3610369226,
        3644379585, 3408119516, 3307916247, 4011190502, 3776767469, 4077384432,
        4245618683, 2809771154, 2842737049, 3144396420, 3043140495, 2673705150,
        2438237621, 2203032232, 2370213795,
      ],
      ut = [
        0, 185469197, 370938394, 487725847, 741876788, 657861945, 975451694,
        824852259, 1483753576, 1400783205, 1315723890, 1164071807, 1950903388,
        2135319889, 1649704518, 1767536459, 2967507152, 3152976349, 2801566410,
        2918353863, 2631447780, 2547432937, 2328143614, 2177544179, 3901806776,
        3818836405, 4270639778, 4118987695, 3299409036, 3483825537, 3535072918,
        3652904859, 2077965243, 1893020342, 1841768865, 1724457132, 1474502543,
        1559041666, 1107234197, 1257309336, 598438867, 681933534, 901210569,
        1052338372, 261314535, 77422314, 428819965, 310463728, 3409685355,
        3224740454, 3710368113, 3593056380, 3875770207, 3960309330, 4045380933,
        4195456072, 2471224067, 2554718734, 2237133081, 2388260884, 3212035895,
        3028143674, 2842678573, 2724322336, 4138563181, 4255350624, 3769721975,
        3955191162, 3667219033, 3516619604, 3431546947, 3347532110, 2933734917,
        2782082824, 3099667487, 3016697106, 2196052529, 2313884476, 2499348523,
        2683765030, 1179510461, 1296297904, 1347548327, 1533017514, 1786102409,
        1635502980, 2087309459, 2003294622, 507358933, 355706840, 136428751,
        53458370, 839224033, 957055980, 605657339, 790073846, 2373340630,
        2256028891, 2607439820, 2422494913, 2706270690, 2856345839, 3075636216,
        3160175349, 3573941694, 3725069491, 3273267108, 3356761769, 4181598602,
        4063242375, 4011996048, 3828103837, 1033297158, 915985419, 730517276,
        545572369, 296679730, 446754879, 129166120, 213705253, 1709610350,
        1860738147, 1945798516, 2029293177, 1239331162, 1120974935, 1606591296,
        1422699085, 4148292826, 4233094615, 3781033664, 3931371469, 3682191598,
        3497509347, 3446004468, 3328955385, 2939266226, 2755636671, 3106780840,
        2988687269, 2198438022, 2282195339, 2501218972, 2652609425, 1201765386,
        1286567175, 1371368976, 1521706781, 1805211710, 1620529459, 2105887268,
        1988838185, 533804130, 350174575, 164439672, 46346101, 870912086,
        954669403, 636813900, 788204353, 2358957921, 2274680428, 2592523643,
        2441661558, 2695033685, 2880240216, 3065962831, 3182487618, 3572145929,
        3756299780, 3270937875, 3388507166, 4174560061, 4091327024, 4006521127,
        3854606378, 1014646705, 930369212, 711349675, 560487590, 272786309,
        457992840, 106852767, 223377554, 1678381017, 1862534868, 1914052035,
        2031621326, 1211247597, 1128014560, 1580087799, 1428173050, 32283319,
        182621114, 401639597, 486441376, 768917123, 651868046, 1003007129,
        818324884, 1503449823, 1385356242, 1333838021, 1150208456, 1973745387,
        2125135846, 1673061617, 1756818940, 2970356327, 3120694122, 2802849917,
        2887651696, 2637442643, 2520393566, 2334669897, 2149987652, 3917234703,
        3799141122, 4284502037, 4100872472, 3309594171, 3460984630, 3545789473,
        3629546796, 2050466060, 1899603969, 1814803222, 1730525723, 1443857720,
        1560382517, 1075025698, 1260232239, 575138148, 692707433, 878443390,
        1062597235, 243256656, 91341917, 409198410, 325965383, 3403100636,
        3252238545, 3704300486, 3620022987, 3874428392, 3990953189, 4042459122,
        4227665663, 2460449204, 2578018489, 2226875310, 2411029155, 3198115200,
        3046200461, 2827177882, 2743944855,
      ],
      st = [
        0, 218828297, 437656594, 387781147, 875313188, 958871085, 775562294,
        590424639, 1750626376, 1699970625, 1917742170, 2135253587, 1551124588,
        1367295589, 1180849278, 1265195639, 3501252752, 3720081049, 3399941250,
        3350065803, 3835484340, 3919042237, 4270507174, 4085369519, 3102249176,
        3051593425, 2734591178, 2952102595, 2361698556, 2177869557, 2530391278,
        2614737639, 3145456443, 3060847922, 2708326185, 2892417312, 2404901663,
        2187128086, 2504130317, 2555048196, 3542330227, 3727205754, 3375740769,
        3292445032, 3876557655, 3926170974, 4246310725, 4027744588, 1808481195,
        1723872674, 1910319033, 2094410160, 1608975247, 1391201670, 1173430173,
        1224348052, 59984867, 244860394, 428169201, 344873464, 935293895,
        984907214, 766078933, 547512796, 1844882806, 1627235199, 2011214180,
        2062270317, 1507497298, 1423022939, 1137477952, 1321699145, 95345982,
        145085239, 532201772, 313773861, 830661914, 1015671571, 731183368,
        648017665, 3175501286, 2957853679, 2807058932, 2858115069, 2305455554,
        2220981195, 2474404304, 2658625497, 3575528878, 3625268135, 3473416636,
        3254988725, 3778151818, 3963161475, 4213447064, 4130281361, 3599595085,
        3683022916, 3432737375, 3247465558, 3802222185, 4020912224, 4172763771,
        4122762354, 3201631749, 3017672716, 2764249623, 2848461854, 2331590177,
        2280796200, 2431590963, 2648976442, 104699613, 188127444, 472615631,
        287343814, 840019705, 1058709744, 671593195, 621591778, 1852171925,
        1668212892, 1953757831, 2037970062, 1514790577, 1463996600, 1080017571,
        1297403050, 3673637356, 3623636965, 3235995134, 3454686199, 4007360968,
        3822090177, 4107101658, 4190530515, 2997825956, 3215212461, 2830708150,
        2779915199, 2256734592, 2340947849, 2627016082, 2443058075, 172466556,
        122466165, 273792366, 492483431, 1047239e3, 861968209, 612205898,
        695634755, 1646252340, 1863638845, 2013908262, 1963115311, 1446242576,
        1530455833, 1277555970, 1093597963, 1636604631, 1820824798, 2073724613,
        1989249228, 1436590835, 1487645946, 1337376481, 1119727848, 164948639,
        81781910, 331544205, 516552836, 1039717051, 821288114, 669961897,
        719700128, 2973530695, 3157750862, 2871682645, 2787207260, 2232435299,
        2283490410, 2667994737, 2450346104, 3647212047, 3564045318, 3279033885,
        3464042516, 3980931627, 3762502690, 4150144569, 4199882800, 3070356634,
        3121275539, 2904027272, 2686254721, 2200818878, 2384911031, 2570832044,
        2486224549, 3747192018, 3528626907, 3310321856, 3359936201, 3950355702,
        3867060991, 4049844452, 4234721005, 1739656202, 1790575107, 2108100632,
        1890328081, 1402811438, 1586903591, 1233856572, 1149249077, 266959938,
        48394827, 369057872, 418672217, 1002783846, 919489135, 567498868,
        752375421, 209336225, 24197544, 376187827, 459744698, 945164165,
        895287692, 574624663, 793451934, 1679968233, 1764313568, 2117360635,
        1933530610, 1343127501, 1560637892, 1243112415, 1192455638, 3704280881,
        3519142200, 3336358691, 3419915562, 3907448597, 3857572124, 4075877127,
        4294704398, 3029510009, 3113855344, 2927934315, 2744104290, 2159976285,
        2377486676, 2594734927, 2544078150,
      ],
      gt = [
        0, 151849742, 303699484, 454499602, 607398968, 758720310, 908999204,
        1059270954, 1214797936, 1097159550, 1517440620, 1400849762, 1817998408,
        1699839814, 2118541908, 2001430874, 2429595872, 2581445614, 2194319100,
        2345119218, 3034881240, 3186202582, 2801699524, 2951971274, 3635996816,
        3518358430, 3399679628, 3283088770, 4237083816, 4118925222, 4002861748,
        3885750714, 1002142683, 850817237, 698445255, 548169417, 529487843,
        377642221, 227885567, 77089521, 1943217067, 2061379749, 1640576439,
        1757691577, 1474760595, 1592394909, 1174215055, 1290801793, 2875968315,
        2724642869, 3111247143, 2960971305, 2405426947, 2253581325, 2638606623,
        2487810577, 3808662347, 3926825029, 4044981591, 4162096729, 3342319475,
        3459953789, 3576539503, 3693126241, 1986918061, 2137062819, 1685577905,
        1836772287, 1381620373, 1532285339, 1078185097, 1229899655, 1040559837,
        923313619, 740276417, 621982671, 439452389, 322734571, 137073913,
        19308535, 3871163981, 4021308739, 4104605777, 4255800159, 3263785589,
        3414450555, 3499326569, 3651041127, 2933202493, 2815956275, 3167684641,
        3049390895, 2330014213, 2213296395, 2566595609, 2448830231, 1305906550,
        1155237496, 1607244650, 1455525988, 1776460110, 1626319424, 2079897426,
        1928707164, 96392454, 213114376, 396673818, 514443284, 562755902,
        679998e3, 865136418, 983426092, 3708173718, 3557504664, 3474729866,
        3323011204, 4180808110, 4030667424, 3945269170, 3794078908, 2507040230,
        2623762152, 2272556026, 2390325492, 2975484382, 3092726480, 2738905026,
        2857194700, 3973773121, 3856137295, 4274053469, 4157467219, 3371096953,
        3252932727, 3673476453, 3556361835, 2763173681, 2915017791, 3064510765,
        3215307299, 2156299017, 2307622919, 2459735317, 2610011675, 2081048481,
        1963412655, 1846563261, 1729977011, 1480485785, 1362321559, 1243905413,
        1126790795, 878845905, 1030690015, 645401037, 796197571, 274084841,
        425408743, 38544885, 188821243, 3613494426, 3731654548, 3313212038,
        3430322568, 4082475170, 4200115116, 3780097726, 3896688048, 2668221674,
        2516901860, 2366882550, 2216610296, 3141400786, 2989552604, 2837966542,
        2687165888, 1202797690, 1320957812, 1437280870, 1554391400, 1669664834,
        1787304780, 1906247262, 2022837584, 265905162, 114585348, 499347990,
        349075736, 736970802, 585122620, 972512814, 821712160, 2595684844,
        2478443234, 2293045232, 2174754046, 3196267988, 3079546586, 2895723464,
        2777952454, 3537852828, 3687994002, 3234156416, 3385345166, 4142626212,
        4293295786, 3841024952, 3992742070, 174567692, 57326082, 410887952,
        292596766, 777231668, 660510266, 1011452712, 893681702, 1108339068,
        1258480242, 1343618912, 1494807662, 1715193156, 1865862730, 1948373848,
        2100090966, 2701949495, 2818666809, 3004591147, 3122358053, 2235061775,
        2352307457, 2535604243, 2653899549, 3915653703, 3764988233, 4219352155,
        4067639125, 3444575871, 3294430577, 3746175075, 3594982253, 836553431,
        953270745, 600235211, 718002117, 367585007, 484830689, 133361907,
        251657213, 2041877159, 1891211689, 1806599355, 1654886325, 1568718495,
        1418573201, 1335535747, 1184342925,
      ];
    function yt(it) {
      for (var ft = [], bt = 0; bt < it.length; bt += 4)
        ft.push(
          (it[bt] << 24) | (it[bt + 1] << 16) | (it[bt + 2] << 8) | it[bt + 3]
        );
      return ft;
    }
    var Ct = function (it) {
      if (!(this instanceof Ct))
        throw Error('AES must be instanitated with `new`');
      (Object.defineProperty(this, 'key', { value: c(it, !0) }),
        this._prepare());
    };
    ((Ct.prototype._prepare = function () {
      var it = $[this.key.length];
      if (it == null)
        throw new Error('invalid key size (must be 16, 24 or 32 bytes)');
      ((this._Ke = []), (this._Kd = []));
      for (var ft = 0; ft <= it; ft++)
        (this._Ke.push([0, 0, 0, 0]), this._Kd.push([0, 0, 0, 0]));
      for (
        var bt = (it + 1) * 4,
          mt = this.key.length / 4,
          ht = yt(this.key),
          Tt,
          ft = 0;
        ft < mt;
        ft++
      )
        ((Tt = ft >> 2),
          (this._Ke[Tt][ft % 4] = ht[ft]),
          (this._Kd[it - Tt][ft % 4] = ht[ft]));
      for (var Et = 0, Rt = mt, Dt; Rt < bt; ) {
        if (
          ((Dt = ht[mt - 1]),
          (ht[0] ^=
            (_e[(Dt >> 16) & 255] << 24) ^
            (_e[(Dt >> 8) & 255] << 16) ^
            (_e[Dt & 255] << 8) ^
            _e[(Dt >> 24) & 255] ^
            (_[Et] << 24)),
          (Et += 1),
          mt != 8)
        )
          for (var ft = 1; ft < mt; ft++) ht[ft] ^= ht[ft - 1];
        else {
          for (var ft = 1; ft < mt / 2; ft++) ht[ft] ^= ht[ft - 1];
          ((Dt = ht[mt / 2 - 1]),
            (ht[mt / 2] ^=
              _e[Dt & 255] ^
              (_e[(Dt >> 8) & 255] << 8) ^
              (_e[(Dt >> 16) & 255] << 16) ^
              (_e[(Dt >> 24) & 255] << 24)));
          for (var ft = mt / 2 + 1; ft < mt; ft++) ht[ft] ^= ht[ft - 1];
        }
        for (var ft = 0, Mt, Ut; ft < mt && Rt < bt; )
          ((Mt = Rt >> 2),
            (Ut = Rt % 4),
            (this._Ke[Mt][Ut] = ht[ft]),
            (this._Kd[it - Mt][Ut] = ht[ft++]),
            Rt++);
      }
      for (var Mt = 1; Mt < it; Mt++)
        for (var Ut = 0; Ut < 4; Ut++)
          ((Dt = this._Kd[Mt][Ut]),
            (this._Kd[Mt][Ut] =
              dt[(Dt >> 24) & 255] ^
              ut[(Dt >> 16) & 255] ^
              st[(Dt >> 8) & 255] ^
              gt[Dt & 255]));
    }),
      (Ct.prototype.encrypt = function (it) {
        if (it.length != 16)
          throw new Error('invalid plaintext size (must be 16 bytes)');
        for (
          var ft = this._Ke.length - 1, bt = [0, 0, 0, 0], mt = yt(it), ht = 0;
          ht < 4;
          ht++
        )
          mt[ht] ^= this._Ke[0][ht];
        for (var Tt = 1; Tt < ft; Tt++) {
          for (var ht = 0; ht < 4; ht++)
            bt[ht] =
              j[(mt[ht] >> 24) & 255] ^
              nt[(mt[(ht + 1) % 4] >> 16) & 255] ^
              lt[(mt[(ht + 2) % 4] >> 8) & 255] ^
              tt[mt[(ht + 3) % 4] & 255] ^
              this._Ke[Tt][ht];
          mt = bt.slice();
        }
        for (var Et = d(16), Rt, ht = 0; ht < 4; ht++)
          ((Rt = this._Ke[ft][ht]),
            (Et[4 * ht] = (_e[(mt[ht] >> 24) & 255] ^ (Rt >> 24)) & 255),
            (Et[4 * ht + 1] =
              (_e[(mt[(ht + 1) % 4] >> 16) & 255] ^ (Rt >> 16)) & 255),
            (Et[4 * ht + 2] =
              (_e[(mt[(ht + 2) % 4] >> 8) & 255] ^ (Rt >> 8)) & 255),
            (Et[4 * ht + 3] = (_e[mt[(ht + 3) % 4] & 255] ^ Rt) & 255));
        return Et;
      }),
      (Ct.prototype.decrypt = function (it) {
        if (it.length != 16)
          throw new Error('invalid ciphertext size (must be 16 bytes)');
        for (
          var ft = this._Kd.length - 1, bt = [0, 0, 0, 0], mt = yt(it), ht = 0;
          ht < 4;
          ht++
        )
          mt[ht] ^= this._Kd[0][ht];
        for (var Tt = 1; Tt < ft; Tt++) {
          for (var ht = 0; ht < 4; ht++)
            bt[ht] =
              et[(mt[ht] >> 24) & 255] ^
              rt[(mt[(ht + 3) % 4] >> 16) & 255] ^
              at[(mt[(ht + 2) % 4] >> 8) & 255] ^
              ct[mt[(ht + 1) % 4] & 255] ^
              this._Kd[Tt][ht];
          mt = bt.slice();
        }
        for (var Et = d(16), Rt, ht = 0; ht < 4; ht++)
          ((Rt = this._Kd[ft][ht]),
            (Et[4 * ht] = (ot[(mt[ht] >> 24) & 255] ^ (Rt >> 24)) & 255),
            (Et[4 * ht + 1] =
              (ot[(mt[(ht + 3) % 4] >> 16) & 255] ^ (Rt >> 16)) & 255),
            (Et[4 * ht + 2] =
              (ot[(mt[(ht + 2) % 4] >> 8) & 255] ^ (Rt >> 8)) & 255),
            (Et[4 * ht + 3] = (ot[mt[(ht + 1) % 4] & 255] ^ Rt) & 255));
        return Et;
      }));
    var At = function (it) {
      if (!(this instanceof At))
        throw Error('AES must be instanitated with `new`');
      ((this.description = 'Electronic Code Block'),
        (this.name = 'ecb'),
        (this._aes = new Ct(it)));
    };
    ((At.prototype.encrypt = function (it) {
      if (((it = c(it)), it.length % 16 !== 0))
        throw new Error(
          'invalid plaintext size (must be multiple of 16 bytes)'
        );
      for (var ft = d(it.length), bt = d(16), mt = 0; mt < it.length; mt += 16)
        (h(it, bt, 0, mt, mt + 16),
          (bt = this._aes.encrypt(bt)),
          h(bt, ft, mt));
      return ft;
    }),
      (At.prototype.decrypt = function (it) {
        if (((it = c(it)), it.length % 16 !== 0))
          throw new Error(
            'invalid ciphertext size (must be multiple of 16 bytes)'
          );
        for (
          var ft = d(it.length), bt = d(16), mt = 0;
          mt < it.length;
          mt += 16
        )
          (h(it, bt, 0, mt, mt + 16),
            (bt = this._aes.decrypt(bt)),
            h(bt, ft, mt));
        return ft;
      }));
    var wt = function (it, ft) {
      if (!(this instanceof wt))
        throw Error('AES must be instanitated with `new`');
      if (
        ((this.description = 'Cipher Block Chaining'), (this.name = 'cbc'), !ft)
      )
        ft = d(16);
      else if (ft.length != 16)
        throw new Error('invalid initialation vector size (must be 16 bytes)');
      ((this._lastCipherblock = c(ft, !0)), (this._aes = new Ct(it)));
    };
    ((wt.prototype.encrypt = function (it) {
      if (((it = c(it)), it.length % 16 !== 0))
        throw new Error(
          'invalid plaintext size (must be multiple of 16 bytes)'
        );
      for (
        var ft = d(it.length), bt = d(16), mt = 0;
        mt < it.length;
        mt += 16
      ) {
        h(it, bt, 0, mt, mt + 16);
        for (var ht = 0; ht < 16; ht++) bt[ht] ^= this._lastCipherblock[ht];
        ((this._lastCipherblock = this._aes.encrypt(bt)),
          h(this._lastCipherblock, ft, mt));
      }
      return ft;
    }),
      (wt.prototype.decrypt = function (it) {
        if (((it = c(it)), it.length % 16 !== 0))
          throw new Error(
            'invalid ciphertext size (must be multiple of 16 bytes)'
          );
        for (
          var ft = d(it.length), bt = d(16), mt = 0;
          mt < it.length;
          mt += 16
        ) {
          (h(it, bt, 0, mt, mt + 16), (bt = this._aes.decrypt(bt)));
          for (var ht = 0; ht < 16; ht++)
            ft[mt + ht] = bt[ht] ^ this._lastCipherblock[ht];
          h(it, this._lastCipherblock, 0, mt, mt + 16);
        }
        return ft;
      }));
    var _t = function (it, ft, bt) {
      if (!(this instanceof _t))
        throw Error('AES must be instanitated with `new`');
      if (((this.description = 'Cipher Feedback'), (this.name = 'cfb'), !ft))
        ft = d(16);
      else if (ft.length != 16)
        throw new Error('invalid initialation vector size (must be 16 size)');
      (bt || (bt = 1),
        (this.segmentSize = bt),
        (this._shiftRegister = c(ft, !0)),
        (this._aes = new Ct(it)));
    };
    ((_t.prototype.encrypt = function (it) {
      if (it.length % this.segmentSize != 0)
        throw new Error('invalid plaintext size (must be segmentSize bytes)');
      for (
        var ft = c(it, !0), bt, mt = 0;
        mt < ft.length;
        mt += this.segmentSize
      ) {
        bt = this._aes.encrypt(this._shiftRegister);
        for (var ht = 0; ht < this.segmentSize; ht++) ft[mt + ht] ^= bt[ht];
        (h(this._shiftRegister, this._shiftRegister, 0, this.segmentSize),
          h(
            ft,
            this._shiftRegister,
            16 - this.segmentSize,
            mt,
            mt + this.segmentSize
          ));
      }
      return ft;
    }),
      (_t.prototype.decrypt = function (it) {
        if (it.length % this.segmentSize != 0)
          throw new Error(
            'invalid ciphertext size (must be segmentSize bytes)'
          );
        for (
          var ft = c(it, !0), bt, mt = 0;
          mt < ft.length;
          mt += this.segmentSize
        ) {
          bt = this._aes.encrypt(this._shiftRegister);
          for (var ht = 0; ht < this.segmentSize; ht++) ft[mt + ht] ^= bt[ht];
          (h(this._shiftRegister, this._shiftRegister, 0, this.segmentSize),
            h(
              it,
              this._shiftRegister,
              16 - this.segmentSize,
              mt,
              mt + this.segmentSize
            ));
        }
        return ft;
      }));
    var kt = function (it, ft) {
      if (!(this instanceof kt))
        throw Error('AES must be instanitated with `new`');
      if (((this.description = 'Output Feedback'), (this.name = 'ofb'), !ft))
        ft = d(16);
      else if (ft.length != 16)
        throw new Error('invalid initialation vector size (must be 16 bytes)');
      ((this._lastPrecipher = c(ft, !0)),
        (this._lastPrecipherIndex = 16),
        (this._aes = new Ct(it)));
    };
    ((kt.prototype.encrypt = function (it) {
      for (var ft = c(it, !0), bt = 0; bt < ft.length; bt++)
        (this._lastPrecipherIndex === 16 &&
          ((this._lastPrecipher = this._aes.encrypt(this._lastPrecipher)),
          (this._lastPrecipherIndex = 0)),
          (ft[bt] ^= this._lastPrecipher[this._lastPrecipherIndex++]));
      return ft;
    }),
      (kt.prototype.decrypt = kt.prototype.encrypt));
    var St = function (it) {
      if (!(this instanceof St))
        throw Error('Counter must be instanitated with `new`');
      (it !== 0 && !it && (it = 1),
        typeof it == 'number'
          ? ((this._counter = d(16)), this.setValue(it))
          : this.setBytes(it));
    };
    ((St.prototype.setValue = function (it) {
      if (typeof it != 'number' || parseInt(it) != it)
        throw new Error('invalid counter value (must be an integer)');
      if (it > Number.MAX_SAFE_INTEGER)
        throw new Error('integer value out of safe range');
      for (var ft = 15; ft >= 0; --ft)
        ((this._counter[ft] = it % 256), (it = parseInt(it / 256)));
    }),
      (St.prototype.setBytes = function (it) {
        if (((it = c(it, !0)), it.length != 16))
          throw new Error('invalid counter bytes size (must be 16 bytes)');
        this._counter = it;
      }),
      (St.prototype.increment = function () {
        for (var it = 15; it >= 0; it--)
          if (this._counter[it] === 255) this._counter[it] = 0;
          else {
            this._counter[it]++;
            break;
          }
      }));
    var Pt = function (it, ft) {
      if (!(this instanceof Pt))
        throw Error('AES must be instanitated with `new`');
      ((this.description = 'Counter'),
        (this.name = 'ctr'),
        ft instanceof St || (ft = new St(ft)),
        (this._counter = ft),
        (this._remainingCounter = null),
        (this._remainingCounterIndex = 16),
        (this._aes = new Ct(it)));
    };
    ((Pt.prototype.encrypt = function (it) {
      for (var ft = c(it, !0), bt = 0; bt < ft.length; bt++)
        (this._remainingCounterIndex === 16 &&
          ((this._remainingCounter = this._aes.encrypt(this._counter._counter)),
          (this._remainingCounterIndex = 0),
          this._counter.increment()),
          (ft[bt] ^= this._remainingCounter[this._remainingCounterIndex++]));
      return ft;
    }),
      (Pt.prototype.decrypt = Pt.prototype.encrypt));
    function xt(it) {
      it = c(it, !0);
      var ft = 16 - (it.length % 16),
        bt = d(it.length + ft);
      h(it, bt);
      for (var mt = it.length; mt < bt.length; mt++) bt[mt] = ft;
      return bt;
    }
    function vt(it) {
      if (((it = c(it, !0)), it.length < 16))
        throw new Error('PKCS#7 invalid length');
      var ft = it[it.length - 1];
      if (ft > 16) throw new Error('PKCS#7 padding byte out of range');
      for (var bt = it.length - ft, mt = 0; mt < ft; mt++)
        if (it[bt + mt] !== ft) throw new Error('PKCS#7 invalid padding byte');
      var ht = d(bt);
      return (h(it, ht, 0, 0, bt), ht);
    }
    var $t = {
      AES: Ct,
      Counter: St,
      ModeOfOperation: { ecb: At, cbc: wt, cfb: _t, ofb: kt, ctr: Pt },
      utils: { hex: g, utf8: b },
      padding: { pkcs7: { pad: xt, strip: vt } },
      _arrayTest: { coerceArray: c, createArray: d, copyArray: h },
    };
    e.exports = $t;
  })();
})(aesJs);
var aesJsExports = aesJs.exports;
const IPFS_CONFIG = {
    PROJECT_ID: {}.REACT_APP_INFURA_PROJECT_ID || 'YOUR_INFURA_PROJECT_ID',
    PROJECT_SECRET:
      {}.REACT_APP_INFURA_PROJECT_SECRET || 'YOUR_INFURA_PROJECT_SECRET',
    GATEWAY_URL: 'https://ipfs.io/ipfs',
  },
  auth =
    'Basic ' +
    Buffer.from(
      IPFS_CONFIG.PROJECT_ID + ':' + IPFS_CONFIG.PROJECT_SECRET
    ).toString('base64'),
  ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: { authorization: auth },
  }),
  encryptFile = async (e, o) => {
    const a = await e.arrayBuffer(),
      s = new Uint8Array(a),
      i = window.crypto.getRandomValues(new Uint8Array(16)),
      c = new TextEncoder().encode(o.padEnd(32, '0').slice(0, 32)),
      d = new aesJsExports.ModeOfOperation.cbc(c, i),
      h = aesJsExports.padding.pkcs7.pad(s),
      b = d.encrypt(h);
    return { iv: Buffer.from(i).toString('hex'), ciphertext: b };
  },
  uploadToIPFS = async (e, o = { encrypt: !0 }) => {
    try {
      let a = e,
        s = e.size,
        i = '',
        c = '';
      if (o.encrypt) {
        i = generateEncryptionKey();
        const g = await encryptFile(e, i),
          $ = new Blob([new Uint8Array(g.ciphertext)], {
            type: 'application/octet-stream',
          });
        ((a = $), (s = $.size), (c = Buffer.from(g.iv).toString('hex')));
      }
      let d = 0;
      const { cid: h } = await ipfs.add(
          { content: a },
          {
            progress: (g) => {
              if (o.onProgress) {
                d += g;
                const $ = Math.round((d / s) * 100);
                o.onProgress($);
              }
            },
          }
        ),
        b = `${IPFS_CONFIG.GATEWAY_URL}/${h.toString()}`;
      return {
        cid: h.toString(),
        url: b,
        iv: c,
        key: i,
        name: e.name,
        size: e.size,
        type: e.type,
      };
    } catch (a) {
      throw (console.error('Error uploading to IPFS:', a), a);
    }
  };
async function downloadFromIPFS(e, o = {}) {
  var a;
  try {
    const s = await fetch(`${IPFS_CONFIG.GATEWAY_URL}/${e}`);
    if (!s.ok)
      throw new Error(`Failed to fetch file from IPFS: ${s.statusText}`);
    const i = s.headers.get('content-length'),
      c = i ? parseInt(i, 10) : 0,
      d = (a = s.body) == null ? void 0 : a.getReader();
    if (!d) throw new Error('Failed to read response body');
    let h = 0;
    const b = [];
    for (;;) {
      const { done: $, value: _ } = await d.read();
      if ($) break;
      if ((b.push(_), (h += _.length), o.onProgress && c > 0)) {
        const _e = Math.round((h / c) * 100);
        o.onProgress(_e);
      }
    }
    const g = new Blob(b.map(($) => new Uint8Array($)));
    return (o.key && o.iv && console.warn('Decryption not yet implemented'), g);
  } catch (s) {
    throw (console.error('Error downloading from IPFS:', s), s);
  }
}
const generateEncryptionKey = () => {
    const e = new Uint8Array(32);
    return (
      window.crypto.getRandomValues(e),
      Array.from(e, (o) => o.toString(16).padStart(2, '0')).join('')
    );
  },
  validateFile = (e) => {
    const o = {
      'application/pdf': 10485760,
      'application/msword': 5242880,
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 5242880,
      'image/jpeg': 5242880,
      'image/png': 5242880,
    };
    if (!o[e.type]) return { valid: !1, error: 'Unsupported file type' };
    const a = o[e.type];
    return e.size > a
      ? {
          valid: !1,
          error: `File too large. Maximum size is ${Math.round(a / 1048576)}MB`,
        }
      : { valid: !0 };
  },
  useExport = () => {
    const [e, o] = reactExports.useState('idle'),
      [a, s] = reactExports.useState(null),
      [i, c] = reactExports.useState(null),
      d = reactExports.useCallback(async (_) => {
        (o('uploading'), s(null));
        const _e = {};
        try {
          for (let ot = 0; ot < _.length; ot++) {
            const { file: j, type: nt, metadata: lt } = _[ot];
            c({
              current: ot + 1,
              total: _.length,
              message: `Uploading ${nt} document...`,
            });
            const {
              cid: tt,
              url: et,
              iv: rt,
              key: at,
            } = await uploadToIPFS(j, {
              encrypt: lt.encrypted,
              onProgress: (ct) => {
                c((dt) => ({
                  ...dt,
                  message: `Uploading ${nt} document (${Math.round(ct * 100)}%)...`,
                }));
              },
            });
            _e[nt] = {
              ...lt,
              ipfsCid: tt,
              ipfsUrl: et,
              iv: rt || '',
              encrypted: lt.encrypted,
              uploadedAt: Date.now(),
              contentType: j.type,
              size: j.size,
            };
          }
          return (c(null), _e);
        } catch (ot) {
          const j =
            ot instanceof Error
              ? ot
              : new Error('Failed to upload documents to IPFS');
          throw (o('error'), s(j), j);
        }
      }, []),
      h = reactExports.useCallback(
        async (_, _e) => {
          try {
            const ot = await d(_);
            (o('submitting'),
              c({
                current: 1,
                total: 1,
                message: 'Submitting to blockchain...',
              }));
            const j = `EXP-${Date.now()}`,
              nt = Date.now(),
              lt = { exportId: j, documents: ot, exporter: _e, timestamp: nt },
              tt = await contract.submitExport(lt);
            return (o('success'), c(null), { txHash: tt, exportId: j });
          } catch (ot) {
            const j =
              ot instanceof Error ? ot : new Error('Failed to submit export');
            throw (o('error'), s(j), j);
          }
        },
        [d]
      ),
      b = reactExports.useCallback(async (_, _e) => {
        try {
          return await contract.verifyDocument(_, _e);
        } catch (ot) {
          const j =
            ot instanceof Error ? ot : new Error('Failed to verify document');
          throw (s(j), j);
        }
      }, []),
      g = reactExports.useCallback(async (_, _e) => {
        try {
          return await contract.getDocument(_, _e);
        } catch (ot) {
          const j =
            ot instanceof Error ? ot : new Error('Failed to get document');
          throw (s(j), j);
        }
      }, []),
      $ = reactExports.useCallback(async (_) => {
        try {
          return await contract.getExportRequest(_);
        } catch (_e) {
          const ot =
            _e instanceof Error
              ? _e
              : new Error('Failed to get export request');
          throw (s(ot), ot);
        }
      }, []);
    return {
      submitExport: h,
      verifyDocument: b,
      getDocument: g,
      getExportRequest: $,
      status: e,
      error: a,
      progress: i,
    };
  },
  ORGANIZATION_ROLES = {
    'national-bank': 'Regulator',
    'exporter-bank': 'Bank',
    'coffee-authority': 'Quality Inspector',
    customs: 'Customs',
  },
  useExportApprovals = (e) => {
    const [o, a] = reactExports.useState([]),
      [s, i] = reactExports.useState(!1),
      [c, d] = reactExports.useState(null),
      h = async () => {
        if (e) {
          (i(!0), d(null));
          try {
            const b = [
              {
                name: 'Ministry of Trade',
                role: ORGANIZATION_ROLES['national-bank'],
                status: 'PENDING',
              },
              {
                name: 'Exporter Bank',
                role: ORGANIZATION_ROLES['exporter-bank'],
                status: 'PENDING',
              },
              {
                name: 'Coffee Quality Authority',
                role: ORGANIZATION_ROLES['coffee-authority'],
                status: 'PENDING',
              },
              {
                name: 'Customs Department',
                role: ORGANIZATION_ROLES.customs,
                status: 'PENDING',
              },
            ];
            a(b);
          } catch (b) {
            (console.error('Error fetching approvals:', b),
              d(
                b instanceof Error ? b : new Error('Failed to fetch approvals')
              ));
          } finally {
            i(!1);
          }
        }
      };
    return (
      reactExports.useEffect(() => {
        h();
        const b = setInterval(h, 15e3);
        return () => clearInterval(b);
      }, [e]),
      { approvals: o, loading: s, error: c, refresh: h }
    );
  };
function composeEventHandlers(e, o, { checkForDefaultPrevented: a = !0 } = {}) {
  return function (i) {
    if ((e == null || e(i), a === !1 || !i.defaultPrevented))
      return o == null ? void 0 : o(i);
  };
}
function createContextScope(e, o = []) {
  let a = [];
  function s(c, d) {
    const h = reactExports.createContext(d),
      b = a.length;
    a = [...a, d];
    const g = (_) => {
      var tt;
      const { scope: _e, children: ot, ...j } = _,
        nt = ((tt = _e == null ? void 0 : _e[e]) == null ? void 0 : tt[b]) || h,
        lt = reactExports.useMemo(() => j, Object.values(j));
      return jsxRuntimeExports.jsx(nt.Provider, { value: lt, children: ot });
    };
    g.displayName = c + 'Provider';
    function $(_, _e) {
      var nt;
      const ot =
          ((nt = _e == null ? void 0 : _e[e]) == null ? void 0 : nt[b]) || h,
        j = reactExports.useContext(ot);
      if (j) return j;
      if (d !== void 0) return d;
      throw new Error(`\`${_}\` must be used within \`${c}\``);
    }
    return [g, $];
  }
  const i = () => {
    const c = a.map((d) => reactExports.createContext(d));
    return function (h) {
      const b = (h == null ? void 0 : h[e]) || c;
      return reactExports.useMemo(
        () => ({ [`__scope${e}`]: { ...h, [e]: b } }),
        [h, b]
      );
    };
  };
  return ((i.scopeName = e), [s, composeContextScopes(i, ...o)]);
}
function composeContextScopes(...e) {
  const o = e[0];
  if (e.length === 1) return o;
  const a = () => {
    const s = e.map((i) => ({ useScope: i(), scopeName: i.scopeName }));
    return function (c) {
      const d = s.reduce((h, { useScope: b, scopeName: g }) => {
        const _ = b(c)[`__scope${g}`];
        return { ...h, ..._ };
      }, {});
      return reactExports.useMemo(
        () => ({ [`__scope${o.scopeName}`]: d }),
        [d]
      );
    };
  };
  return ((a.scopeName = o.scopeName), a);
}
function setRef(e, o) {
  if (typeof e == 'function') return e(o);
  e != null && (e.current = o);
}
function composeRefs(...e) {
  return (o) => {
    let a = !1;
    const s = e.map((i) => {
      const c = setRef(i, o);
      return (!a && typeof c == 'function' && (a = !0), c);
    });
    if (a)
      return () => {
        for (let i = 0; i < s.length; i++) {
          const c = s[i];
          typeof c == 'function' ? c() : setRef(e[i], null);
        }
      };
  };
}
function useComposedRefs(...e) {
  return reactExports.useCallback(composeRefs(...e), e);
}
function createSlot(e) {
  const o = createSlotClone(e),
    a = reactExports.forwardRef((s, i) => {
      const { children: c, ...d } = s,
        h = reactExports.Children.toArray(c),
        b = h.find(isSlottable);
      if (b) {
        const g = b.props.children,
          $ = h.map((_) =>
            _ === b
              ? reactExports.Children.count(g) > 1
                ? reactExports.Children.only(null)
                : reactExports.isValidElement(g)
                  ? g.props.children
                  : null
              : _
          );
        return jsxRuntimeExports.jsx(o, {
          ...d,
          ref: i,
          children: reactExports.isValidElement(g)
            ? reactExports.cloneElement(g, void 0, $)
            : null,
        });
      }
      return jsxRuntimeExports.jsx(o, { ...d, ref: i, children: c });
    });
  return ((a.displayName = `${e}.Slot`), a);
}
var Slot = createSlot('Slot');
function createSlotClone(e) {
  const o = reactExports.forwardRef((a, s) => {
    const { children: i, ...c } = a;
    if (reactExports.isValidElement(i)) {
      const d = getElementRef$1(i),
        h = mergeProps(c, i.props);
      return (
        i.type !== reactExports.Fragment && (h.ref = s ? composeRefs(s, d) : d),
        reactExports.cloneElement(i, h)
      );
    }
    return reactExports.Children.count(i) > 1
      ? reactExports.Children.only(null)
      : null;
  });
  return ((o.displayName = `${e}.SlotClone`), o);
}
var SLOTTABLE_IDENTIFIER = Symbol('radix.slottable');
function isSlottable(e) {
  return (
    reactExports.isValidElement(e) &&
    typeof e.type == 'function' &&
    '__radixId' in e.type &&
    e.type.__radixId === SLOTTABLE_IDENTIFIER
  );
}
function mergeProps(e, o) {
  const a = { ...o };
  for (const s in o) {
    const i = e[s],
      c = o[s];
    /^on[A-Z]/.test(s)
      ? i && c
        ? (a[s] = (...h) => {
            const b = c(...h);
            return (i(...h), b);
          })
        : i && (a[s] = i)
      : s === 'style'
        ? (a[s] = { ...i, ...c })
        : s === 'className' && (a[s] = [i, c].filter(Boolean).join(' '));
  }
  return { ...e, ...a };
}
function getElementRef$1(e) {
  var s, i;
  let o =
      (s = Object.getOwnPropertyDescriptor(e.props, 'ref')) == null
        ? void 0
        : s.get,
    a = o && 'isReactWarning' in o && o.isReactWarning;
  return a
    ? e.ref
    : ((o =
        (i = Object.getOwnPropertyDescriptor(e, 'ref')) == null
          ? void 0
          : i.get),
      (a = o && 'isReactWarning' in o && o.isReactWarning),
      a ? e.props.ref : e.props.ref || e.ref);
}
function createCollection(e) {
  const o = e + 'CollectionProvider',
    [a, s] = createContextScope(o),
    [i, c] = a(o, { collectionRef: { current: null }, itemMap: new Map() }),
    d = (nt) => {
      const { scope: lt, children: tt } = nt,
        et = React.useRef(null),
        rt = React.useRef(new Map()).current;
      return jsxRuntimeExports.jsx(i, {
        scope: lt,
        itemMap: rt,
        collectionRef: et,
        children: tt,
      });
    };
  d.displayName = o;
  const h = e + 'CollectionSlot',
    b = createSlot(h),
    g = React.forwardRef((nt, lt) => {
      const { scope: tt, children: et } = nt,
        rt = c(h, tt),
        at = useComposedRefs(lt, rt.collectionRef);
      return jsxRuntimeExports.jsx(b, { ref: at, children: et });
    });
  g.displayName = h;
  const $ = e + 'CollectionItemSlot',
    _ = 'data-radix-collection-item',
    _e = createSlot($),
    ot = React.forwardRef((nt, lt) => {
      const { scope: tt, children: et, ...rt } = nt,
        at = React.useRef(null),
        ct = useComposedRefs(lt, at),
        dt = c($, tt);
      return (
        React.useEffect(
          () => (
            dt.itemMap.set(at, { ref: at, ...rt }),
            () => void dt.itemMap.delete(at)
          )
        ),
        jsxRuntimeExports.jsx(_e, { [_]: '', ref: ct, children: et })
      );
    });
  ot.displayName = $;
  function j(nt) {
    const lt = c(e + 'CollectionConsumer', nt);
    return React.useCallback(() => {
      const et = lt.collectionRef.current;
      if (!et) return [];
      const rt = Array.from(et.querySelectorAll(`[${_}]`));
      return Array.from(lt.itemMap.values()).sort(
        (dt, ut) => rt.indexOf(dt.ref.current) - rt.indexOf(ut.ref.current)
      );
    }, [lt.collectionRef, lt.itemMap]);
  }
  return [{ Provider: d, Slot: g, ItemSlot: ot }, j, s];
}
var useLayoutEffect2 =
    globalThis != null && globalThis.document
      ? reactExports.useLayoutEffect
      : () => {},
  useReactId = React$1[' useId '.trim().toString()] || (() => {}),
  count = 0;
function useId(e) {
  const [o, a] = reactExports.useState(useReactId());
  return (
    useLayoutEffect2(() => {
      e || a((s) => s ?? String(count++));
    }, [e]),
    e || (o ? `radix-${o}` : '')
  );
}
var NODES = [
    'a',
    'button',
    'div',
    'form',
    'h2',
    'h3',
    'img',
    'input',
    'label',
    'li',
    'nav',
    'ol',
    'p',
    'select',
    'span',
    'svg',
    'ul',
  ],
  Primitive = NODES.reduce((e, o) => {
    const a = createSlot(`Primitive.${o}`),
      s = reactExports.forwardRef((i, c) => {
        const { asChild: d, ...h } = i,
          b = d ? a : o;
        return (
          typeof window < 'u' && (window[Symbol.for('radix-ui')] = !0),
          jsxRuntimeExports.jsx(b, { ...h, ref: c })
        );
      });
    return ((s.displayName = `Primitive.${o}`), { ...e, [o]: s });
  }, {});
function useCallbackRef(e) {
  const o = reactExports.useRef(e);
  return (
    reactExports.useEffect(() => {
      o.current = e;
    }),
    reactExports.useMemo(
      () =>
        (...a) => {
          var s;
          return (s = o.current) == null ? void 0 : s.call(o, ...a);
        },
      []
    )
  );
}
var useInsertionEffect =
  React$1[' useInsertionEffect '.trim().toString()] || useLayoutEffect2;
function useControllableState({
  prop: e,
  defaultProp: o,
  onChange: a = () => {},
  caller: s,
}) {
  const [i, c, d] = useUncontrolledState({ defaultProp: o, onChange: a }),
    h = e !== void 0,
    b = h ? e : i;
  {
    const $ = reactExports.useRef(e !== void 0);
    reactExports.useEffect(() => {
      const _ = $.current;
      (_ !== h &&
        console.warn(
          `${s} is changing from ${_ ? 'controlled' : 'uncontrolled'} to ${h ? 'controlled' : 'uncontrolled'}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
        ),
        ($.current = h));
    }, [h, s]);
  }
  const g = reactExports.useCallback(
    ($) => {
      var _;
      if (h) {
        const _e = isFunction($) ? $(e) : $;
        _e !== e && ((_ = d.current) == null || _.call(d, _e));
      } else c($);
    },
    [h, e, c, d]
  );
  return [b, g];
}
function useUncontrolledState({ defaultProp: e, onChange: o }) {
  const [a, s] = reactExports.useState(e),
    i = reactExports.useRef(a),
    c = reactExports.useRef(o);
  return (
    useInsertionEffect(() => {
      c.current = o;
    }, [o]),
    reactExports.useEffect(() => {
      var d;
      i.current !== a &&
        ((d = c.current) == null || d.call(c, a), (i.current = a));
    }, [a, i]),
    [a, s, c]
  );
}
function isFunction(e) {
  return typeof e == 'function';
}
var DirectionContext = reactExports.createContext(void 0);
function useDirection(e) {
  const o = reactExports.useContext(DirectionContext);
  return e || o || 'ltr';
}
var ENTRY_FOCUS = 'rovingFocusGroup.onEntryFocus',
  EVENT_OPTIONS = { bubbles: !1, cancelable: !0 },
  GROUP_NAME = 'RovingFocusGroup',
  [Collection, useCollection, createCollectionScope] =
    createCollection(GROUP_NAME),
  [createRovingFocusGroupContext, createRovingFocusGroupScope] =
    createContextScope(GROUP_NAME, [createCollectionScope]),
  [RovingFocusProvider, useRovingFocusContext] =
    createRovingFocusGroupContext(GROUP_NAME),
  RovingFocusGroup = reactExports.forwardRef((e, o) =>
    jsxRuntimeExports.jsx(Collection.Provider, {
      scope: e.__scopeRovingFocusGroup,
      children: jsxRuntimeExports.jsx(Collection.Slot, {
        scope: e.__scopeRovingFocusGroup,
        children: jsxRuntimeExports.jsx(RovingFocusGroupImpl, { ...e, ref: o }),
      }),
    })
  );
RovingFocusGroup.displayName = GROUP_NAME;
var RovingFocusGroupImpl = reactExports.forwardRef((e, o) => {
    const {
        __scopeRovingFocusGroup: a,
        orientation: s,
        loop: i = !1,
        dir: c,
        currentTabStopId: d,
        defaultCurrentTabStopId: h,
        onCurrentTabStopIdChange: b,
        onEntryFocus: g,
        preventScrollOnEntryFocus: $ = !1,
        ..._
      } = e,
      _e = reactExports.useRef(null),
      ot = useComposedRefs(o, _e),
      j = useDirection(c),
      [nt, lt] = useControllableState({
        prop: d,
        defaultProp: h ?? null,
        onChange: b,
        caller: GROUP_NAME,
      }),
      [tt, et] = reactExports.useState(!1),
      rt = useCallbackRef(g),
      at = useCollection(a),
      ct = reactExports.useRef(!1),
      [dt, ut] = reactExports.useState(0);
    return (
      reactExports.useEffect(() => {
        const st = _e.current;
        if (st)
          return (
            st.addEventListener(ENTRY_FOCUS, rt),
            () => st.removeEventListener(ENTRY_FOCUS, rt)
          );
      }, [rt]),
      jsxRuntimeExports.jsx(RovingFocusProvider, {
        scope: a,
        orientation: s,
        dir: j,
        loop: i,
        currentTabStopId: nt,
        onItemFocus: reactExports.useCallback((st) => lt(st), [lt]),
        onItemShiftTab: reactExports.useCallback(() => et(!0), []),
        onFocusableItemAdd: reactExports.useCallback(
          () => ut((st) => st + 1),
          []
        ),
        onFocusableItemRemove: reactExports.useCallback(
          () => ut((st) => st - 1),
          []
        ),
        children: jsxRuntimeExports.jsx(Primitive.div, {
          tabIndex: tt || dt === 0 ? -1 : 0,
          'data-orientation': s,
          ..._,
          ref: ot,
          style: { outline: 'none', ...e.style },
          onMouseDown: composeEventHandlers(e.onMouseDown, () => {
            ct.current = !0;
          }),
          onFocus: composeEventHandlers(e.onFocus, (st) => {
            const gt = !ct.current;
            if (st.target === st.currentTarget && gt && !tt) {
              const yt = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
              if ((st.currentTarget.dispatchEvent(yt), !yt.defaultPrevented)) {
                const Ct = at().filter((St) => St.focusable),
                  At = Ct.find((St) => St.active),
                  wt = Ct.find((St) => St.id === nt),
                  kt = [At, wt, ...Ct]
                    .filter(Boolean)
                    .map((St) => St.ref.current);
                focusFirst(kt, $);
              }
            }
            ct.current = !1;
          }),
          onBlur: composeEventHandlers(e.onBlur, () => et(!1)),
        }),
      })
    );
  }),
  ITEM_NAME = 'RovingFocusGroupItem',
  RovingFocusGroupItem = reactExports.forwardRef((e, o) => {
    const {
        __scopeRovingFocusGroup: a,
        focusable: s = !0,
        active: i = !1,
        tabStopId: c,
        children: d,
        ...h
      } = e,
      b = useId(),
      g = c || b,
      $ = useRovingFocusContext(ITEM_NAME, a),
      _ = $.currentTabStopId === g,
      _e = useCollection(a),
      {
        onFocusableItemAdd: ot,
        onFocusableItemRemove: j,
        currentTabStopId: nt,
      } = $;
    return (
      reactExports.useEffect(() => {
        if (s) return (ot(), () => j());
      }, [s, ot, j]),
      jsxRuntimeExports.jsx(Collection.ItemSlot, {
        scope: a,
        id: g,
        focusable: s,
        active: i,
        children: jsxRuntimeExports.jsx(Primitive.span, {
          tabIndex: _ ? 0 : -1,
          'data-orientation': $.orientation,
          ...h,
          ref: o,
          onMouseDown: composeEventHandlers(e.onMouseDown, (lt) => {
            s ? $.onItemFocus(g) : lt.preventDefault();
          }),
          onFocus: composeEventHandlers(e.onFocus, () => $.onItemFocus(g)),
          onKeyDown: composeEventHandlers(e.onKeyDown, (lt) => {
            if (lt.key === 'Tab' && lt.shiftKey) {
              $.onItemShiftTab();
              return;
            }
            if (lt.target !== lt.currentTarget) return;
            const tt = getFocusIntent(lt, $.orientation, $.dir);
            if (tt !== void 0) {
              if (lt.metaKey || lt.ctrlKey || lt.altKey || lt.shiftKey) return;
              lt.preventDefault();
              let rt = _e()
                .filter((at) => at.focusable)
                .map((at) => at.ref.current);
              if (tt === 'last') rt.reverse();
              else if (tt === 'prev' || tt === 'next') {
                tt === 'prev' && rt.reverse();
                const at = rt.indexOf(lt.currentTarget);
                rt = $.loop ? wrapArray(rt, at + 1) : rt.slice(at + 1);
              }
              setTimeout(() => focusFirst(rt));
            }
          }),
          children:
            typeof d == 'function'
              ? d({ isCurrentTabStop: _, hasTabStop: nt != null })
              : d,
        }),
      })
    );
  });
RovingFocusGroupItem.displayName = ITEM_NAME;
var MAP_KEY_TO_FOCUS_INTENT = {
  ArrowLeft: 'prev',
  ArrowUp: 'prev',
  ArrowRight: 'next',
  ArrowDown: 'next',
  PageUp: 'first',
  Home: 'first',
  PageDown: 'last',
  End: 'last',
};
function getDirectionAwareKey(e, o) {
  return o !== 'rtl'
    ? e
    : e === 'ArrowLeft'
      ? 'ArrowRight'
      : e === 'ArrowRight'
        ? 'ArrowLeft'
        : e;
}
function getFocusIntent(e, o, a) {
  const s = getDirectionAwareKey(e.key, a);
  if (
    !(o === 'vertical' && ['ArrowLeft', 'ArrowRight'].includes(s)) &&
    !(o === 'horizontal' && ['ArrowUp', 'ArrowDown'].includes(s))
  )
    return MAP_KEY_TO_FOCUS_INTENT[s];
}
function focusFirst(e, o = !1) {
  const a = document.activeElement;
  for (const s of e)
    if (
      s === a ||
      (s.focus({ preventScroll: o }), document.activeElement !== a)
    )
      return;
}
function wrapArray(e, o) {
  return e.map((a, s) => e[(o + s) % e.length]);
}
var Root$1 = RovingFocusGroup,
  Item = RovingFocusGroupItem;
function useStateMachine(e, o) {
  return reactExports.useReducer((a, s) => o[a][s] ?? a, e);
}
var Presence = (e) => {
  const { present: o, children: a } = e,
    s = usePresence(o),
    i =
      typeof a == 'function'
        ? a({ present: s.isPresent })
        : reactExports.Children.only(a),
    c = useComposedRefs(s.ref, getElementRef(i));
  return typeof a == 'function' || s.isPresent
    ? reactExports.cloneElement(i, { ref: c })
    : null;
};
Presence.displayName = 'Presence';
function usePresence(e) {
  const [o, a] = reactExports.useState(),
    s = reactExports.useRef(null),
    i = reactExports.useRef(e),
    c = reactExports.useRef('none'),
    d = e ? 'mounted' : 'unmounted',
    [h, b] = useStateMachine(d, {
      mounted: { UNMOUNT: 'unmounted', ANIMATION_OUT: 'unmountSuspended' },
      unmountSuspended: { MOUNT: 'mounted', ANIMATION_END: 'unmounted' },
      unmounted: { MOUNT: 'mounted' },
    });
  return (
    reactExports.useEffect(() => {
      const g = getAnimationName(s.current);
      c.current = h === 'mounted' ? g : 'none';
    }, [h]),
    useLayoutEffect2(() => {
      const g = s.current,
        $ = i.current;
      if ($ !== e) {
        const _e = c.current,
          ot = getAnimationName(g);
        (e
          ? b('MOUNT')
          : ot === 'none' || (g == null ? void 0 : g.display) === 'none'
            ? b('UNMOUNT')
            : b($ && _e !== ot ? 'ANIMATION_OUT' : 'UNMOUNT'),
          (i.current = e));
      }
    }, [e, b]),
    useLayoutEffect2(() => {
      if (o) {
        let g;
        const $ = o.ownerDocument.defaultView ?? window,
          _ = (ot) => {
            const nt = getAnimationName(s.current).includes(
              CSS.escape(ot.animationName)
            );
            if (ot.target === o && nt && (b('ANIMATION_END'), !i.current)) {
              const lt = o.style.animationFillMode;
              ((o.style.animationFillMode = 'forwards'),
                (g = $.setTimeout(() => {
                  o.style.animationFillMode === 'forwards' &&
                    (o.style.animationFillMode = lt);
                })));
            }
          },
          _e = (ot) => {
            ot.target === o && (c.current = getAnimationName(s.current));
          };
        return (
          o.addEventListener('animationstart', _e),
          o.addEventListener('animationcancel', _),
          o.addEventListener('animationend', _),
          () => {
            ($.clearTimeout(g),
              o.removeEventListener('animationstart', _e),
              o.removeEventListener('animationcancel', _),
              o.removeEventListener('animationend', _));
          }
        );
      } else b('ANIMATION_END');
    }, [o, b]),
    {
      isPresent: ['mounted', 'unmountSuspended'].includes(h),
      ref: reactExports.useCallback((g) => {
        ((s.current = g ? getComputedStyle(g) : null), a(g));
      }, []),
    }
  );
}
function getAnimationName(e) {
  return (e == null ? void 0 : e.animationName) || 'none';
}
function getElementRef(e) {
  var s, i;
  let o =
      (s = Object.getOwnPropertyDescriptor(e.props, 'ref')) == null
        ? void 0
        : s.get,
    a = o && 'isReactWarning' in o && o.isReactWarning;
  return a
    ? e.ref
    : ((o =
        (i = Object.getOwnPropertyDescriptor(e, 'ref')) == null
          ? void 0
          : i.get),
      (a = o && 'isReactWarning' in o && o.isReactWarning),
      a ? e.props.ref : e.props.ref || e.ref);
}
var TABS_NAME = 'Tabs',
  [createTabsContext, createTabsScope] = createContextScope(TABS_NAME, [
    createRovingFocusGroupScope,
  ]),
  useRovingFocusGroupScope = createRovingFocusGroupScope(),
  [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME),
  Tabs$1 = reactExports.forwardRef((e, o) => {
    const {
        __scopeTabs: a,
        value: s,
        onValueChange: i,
        defaultValue: c,
        orientation: d = 'horizontal',
        dir: h,
        activationMode: b = 'automatic',
        ...g
      } = e,
      $ = useDirection(h),
      [_, _e] = useControllableState({
        prop: s,
        onChange: i,
        defaultProp: c ?? '',
        caller: TABS_NAME,
      });
    return jsxRuntimeExports.jsx(TabsProvider, {
      scope: a,
      baseId: useId(),
      value: _,
      onValueChange: _e,
      orientation: d,
      dir: $,
      activationMode: b,
      children: jsxRuntimeExports.jsx(Primitive.div, {
        dir: $,
        'data-orientation': d,
        ...g,
        ref: o,
      }),
    });
  });
Tabs$1.displayName = TABS_NAME;
var TAB_LIST_NAME = 'TabsList',
  TabsList$1 = reactExports.forwardRef((e, o) => {
    const { __scopeTabs: a, loop: s = !0, ...i } = e,
      c = useTabsContext(TAB_LIST_NAME, a),
      d = useRovingFocusGroupScope(a);
    return jsxRuntimeExports.jsx(Root$1, {
      asChild: !0,
      ...d,
      orientation: c.orientation,
      dir: c.dir,
      loop: s,
      children: jsxRuntimeExports.jsx(Primitive.div, {
        role: 'tablist',
        'aria-orientation': c.orientation,
        ...i,
        ref: o,
      }),
    });
  });
TabsList$1.displayName = TAB_LIST_NAME;
var TRIGGER_NAME = 'TabsTrigger',
  TabsTrigger$1 = reactExports.forwardRef((e, o) => {
    const { __scopeTabs: a, value: s, disabled: i = !1, ...c } = e,
      d = useTabsContext(TRIGGER_NAME, a),
      h = useRovingFocusGroupScope(a),
      b = makeTriggerId(d.baseId, s),
      g = makeContentId(d.baseId, s),
      $ = s === d.value;
    return jsxRuntimeExports.jsx(Item, {
      asChild: !0,
      ...h,
      focusable: !i,
      active: $,
      children: jsxRuntimeExports.jsx(Primitive.button, {
        type: 'button',
        role: 'tab',
        'aria-selected': $,
        'aria-controls': g,
        'data-state': $ ? 'active' : 'inactive',
        'data-disabled': i ? '' : void 0,
        disabled: i,
        id: b,
        ...c,
        ref: o,
        onMouseDown: composeEventHandlers(e.onMouseDown, (_) => {
          !i && _.button === 0 && _.ctrlKey === !1
            ? d.onValueChange(s)
            : _.preventDefault();
        }),
        onKeyDown: composeEventHandlers(e.onKeyDown, (_) => {
          [' ', 'Enter'].includes(_.key) && d.onValueChange(s);
        }),
        onFocus: composeEventHandlers(e.onFocus, () => {
          const _ = d.activationMode !== 'manual';
          !$ && !i && _ && d.onValueChange(s);
        }),
      }),
    });
  });
TabsTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = 'TabsContent',
  TabsContent$1 = reactExports.forwardRef((e, o) => {
    const { __scopeTabs: a, value: s, forceMount: i, children: c, ...d } = e,
      h = useTabsContext(CONTENT_NAME, a),
      b = makeTriggerId(h.baseId, s),
      g = makeContentId(h.baseId, s),
      $ = s === h.value,
      _ = reactExports.useRef($);
    return (
      reactExports.useEffect(() => {
        const _e = requestAnimationFrame(() => (_.current = !1));
        return () => cancelAnimationFrame(_e);
      }, []),
      jsxRuntimeExports.jsx(Presence, {
        present: i || $,
        children: ({ present: _e }) =>
          jsxRuntimeExports.jsx(Primitive.div, {
            'data-state': $ ? 'active' : 'inactive',
            'data-orientation': h.orientation,
            role: 'tabpanel',
            'aria-labelledby': b,
            hidden: !_e,
            id: g,
            tabIndex: 0,
            ...d,
            ref: o,
            style: { ...e.style, animationDuration: _.current ? '0s' : void 0 },
            children: _e && c,
          }),
      })
    );
  });
TabsContent$1.displayName = CONTENT_NAME;
function makeTriggerId(e, o) {
  return `${e}-trigger-${o}`;
}
function makeContentId(e, o) {
  return `${e}-content-${o}`;
}
var Root2 = Tabs$1,
  List = TabsList$1,
  Trigger = TabsTrigger$1,
  Content = TabsContent$1;
function r(e) {
  var o,
    a,
    s = '';
  if (typeof e == 'string' || typeof e == 'number') s += e;
  else if (typeof e == 'object')
    if (Array.isArray(e)) {
      var i = e.length;
      for (o = 0; o < i; o++)
        e[o] && (a = r(e[o])) && (s && (s += ' '), (s += a));
    } else for (a in e) e[a] && (s && (s += ' '), (s += a));
  return s;
}
function clsx() {
  for (var e, o, a = 0, s = '', i = arguments.length; a < i; a++)
    (e = arguments[a]) && (o = r(e)) && (s && (s += ' '), (s += o));
  return s;
}
const CLASS_PART_SEPARATOR = '-',
  createClassGroupUtils = (e) => {
    const o = createClassMap(e),
      { conflictingClassGroups: a, conflictingClassGroupModifiers: s } = e;
    return {
      getClassGroupId: (d) => {
        const h = d.split(CLASS_PART_SEPARATOR);
        return (
          h[0] === '' && h.length !== 1 && h.shift(),
          getGroupRecursive(h, o) || getGroupIdForArbitraryProperty(d)
        );
      },
      getConflictingClassGroupIds: (d, h) => {
        const b = a[d] || [];
        return h && s[d] ? [...b, ...s[d]] : b;
      },
    };
  },
  getGroupRecursive = (e, o) => {
    var d;
    if (e.length === 0) return o.classGroupId;
    const a = e[0],
      s = o.nextPart.get(a),
      i = s ? getGroupRecursive(e.slice(1), s) : void 0;
    if (i) return i;
    if (o.validators.length === 0) return;
    const c = e.join(CLASS_PART_SEPARATOR);
    return (d = o.validators.find(({ validator: h }) => h(c))) == null
      ? void 0
      : d.classGroupId;
  },
  arbitraryPropertyRegex = /^\[(.+)\]$/,
  getGroupIdForArbitraryProperty = (e) => {
    if (arbitraryPropertyRegex.test(e)) {
      const o = arbitraryPropertyRegex.exec(e)[1],
        a = o == null ? void 0 : o.substring(0, o.indexOf(':'));
      if (a) return 'arbitrary..' + a;
    }
  },
  createClassMap = (e) => {
    const { theme: o, classGroups: a } = e,
      s = { nextPart: new Map(), validators: [] };
    for (const i in a) processClassesRecursively(a[i], s, i, o);
    return s;
  },
  processClassesRecursively = (e, o, a, s) => {
    e.forEach((i) => {
      if (typeof i == 'string') {
        const c = i === '' ? o : getPart(o, i);
        c.classGroupId = a;
        return;
      }
      if (typeof i == 'function') {
        if (isThemeGetter(i)) {
          processClassesRecursively(i(s), o, a, s);
          return;
        }
        o.validators.push({ validator: i, classGroupId: a });
        return;
      }
      Object.entries(i).forEach(([c, d]) => {
        processClassesRecursively(d, getPart(o, c), a, s);
      });
    });
  },
  getPart = (e, o) => {
    let a = e;
    return (
      o.split(CLASS_PART_SEPARATOR).forEach((s) => {
        (a.nextPart.has(s) ||
          a.nextPart.set(s, { nextPart: new Map(), validators: [] }),
          (a = a.nextPart.get(s)));
      }),
      a
    );
  },
  isThemeGetter = (e) => e.isThemeGetter,
  createLruCache = (e) => {
    if (e < 1) return { get: () => {}, set: () => {} };
    let o = 0,
      a = new Map(),
      s = new Map();
    const i = (c, d) => {
      (a.set(c, d), o++, o > e && ((o = 0), (s = a), (a = new Map())));
    };
    return {
      get(c) {
        let d = a.get(c);
        if (d !== void 0) return d;
        if ((d = s.get(c)) !== void 0) return (i(c, d), d);
      },
      set(c, d) {
        a.has(c) ? a.set(c, d) : i(c, d);
      },
    };
  },
  IMPORTANT_MODIFIER = '!',
  MODIFIER_SEPARATOR = ':',
  MODIFIER_SEPARATOR_LENGTH = MODIFIER_SEPARATOR.length,
  createParseClassName = (e) => {
    const { prefix: o, experimentalParseClassName: a } = e;
    let s = (i) => {
      const c = [];
      let d = 0,
        h = 0,
        b = 0,
        g;
      for (let j = 0; j < i.length; j++) {
        let nt = i[j];
        if (d === 0 && h === 0) {
          if (nt === MODIFIER_SEPARATOR) {
            (c.push(i.slice(b, j)), (b = j + MODIFIER_SEPARATOR_LENGTH));
            continue;
          }
          if (nt === '/') {
            g = j;
            continue;
          }
        }
        nt === '['
          ? d++
          : nt === ']'
            ? d--
            : nt === '('
              ? h++
              : nt === ')' && h--;
      }
      const $ = c.length === 0 ? i : i.substring(b),
        _ = stripImportantModifier($),
        _e = _ !== $,
        ot = g && g > b ? g - b : void 0;
      return {
        modifiers: c,
        hasImportantModifier: _e,
        baseClassName: _,
        maybePostfixModifierPosition: ot,
      };
    };
    if (o) {
      const i = o + MODIFIER_SEPARATOR,
        c = s;
      s = (d) =>
        d.startsWith(i)
          ? c(d.substring(i.length))
          : {
              isExternal: !0,
              modifiers: [],
              hasImportantModifier: !1,
              baseClassName: d,
              maybePostfixModifierPosition: void 0,
            };
    }
    if (a) {
      const i = s;
      s = (c) => a({ className: c, parseClassName: i });
    }
    return s;
  },
  stripImportantModifier = (e) =>
    e.endsWith(IMPORTANT_MODIFIER)
      ? e.substring(0, e.length - 1)
      : e.startsWith(IMPORTANT_MODIFIER)
        ? e.substring(1)
        : e,
  createSortModifiers = (e) => {
    const o = Object.fromEntries(e.orderSensitiveModifiers.map((s) => [s, !0]));
    return (s) => {
      if (s.length <= 1) return s;
      const i = [];
      let c = [];
      return (
        s.forEach((d) => {
          d[0] === '[' || o[d] ? (i.push(...c.sort(), d), (c = [])) : c.push(d);
        }),
        i.push(...c.sort()),
        i
      );
    };
  },
  createConfigUtils = (e) => ({
    cache: createLruCache(e.cacheSize),
    parseClassName: createParseClassName(e),
    sortModifiers: createSortModifiers(e),
    ...createClassGroupUtils(e),
  }),
  SPLIT_CLASSES_REGEX = /\s+/,
  mergeClassList = (e, o) => {
    const {
        parseClassName: a,
        getClassGroupId: s,
        getConflictingClassGroupIds: i,
        sortModifiers: c,
      } = o,
      d = [],
      h = e.trim().split(SPLIT_CLASSES_REGEX);
    let b = '';
    for (let g = h.length - 1; g >= 0; g -= 1) {
      const $ = h[g],
        {
          isExternal: _,
          modifiers: _e,
          hasImportantModifier: ot,
          baseClassName: j,
          maybePostfixModifierPosition: nt,
        } = a($);
      if (_) {
        b = $ + (b.length > 0 ? ' ' + b : b);
        continue;
      }
      let lt = !!nt,
        tt = s(lt ? j.substring(0, nt) : j);
      if (!tt) {
        if (!lt) {
          b = $ + (b.length > 0 ? ' ' + b : b);
          continue;
        }
        if (((tt = s(j)), !tt)) {
          b = $ + (b.length > 0 ? ' ' + b : b);
          continue;
        }
        lt = !1;
      }
      const et = c(_e).join(':'),
        rt = ot ? et + IMPORTANT_MODIFIER : et,
        at = rt + tt;
      if (d.includes(at)) continue;
      d.push(at);
      const ct = i(tt, lt);
      for (let dt = 0; dt < ct.length; ++dt) {
        const ut = ct[dt];
        d.push(rt + ut);
      }
      b = $ + (b.length > 0 ? ' ' + b : b);
    }
    return b;
  };
function twJoin() {
  let e = 0,
    o,
    a,
    s = '';
  for (; e < arguments.length; )
    (o = arguments[e++]) && (a = toValue(o)) && (s && (s += ' '), (s += a));
  return s;
}
const toValue = (e) => {
  if (typeof e == 'string') return e;
  let o,
    a = '';
  for (let s = 0; s < e.length; s++)
    e[s] && (o = toValue(e[s])) && (a && (a += ' '), (a += o));
  return a;
};
function createTailwindMerge(e, ...o) {
  let a,
    s,
    i,
    c = d;
  function d(b) {
    const g = o.reduce(($, _) => _($), e());
    return (
      (a = createConfigUtils(g)),
      (s = a.cache.get),
      (i = a.cache.set),
      (c = h),
      h(b)
    );
  }
  function h(b) {
    const g = s(b);
    if (g) return g;
    const $ = mergeClassList(b, a);
    return (i(b, $), $);
  }
  return function () {
    return c(twJoin.apply(null, arguments));
  };
}
const fromTheme = (e) => {
    const o = (a) => a[e] || [];
    return ((o.isThemeGetter = !0), o);
  },
  arbitraryValueRegex = /^\[(?:(\w[\w-]*):)?(.+)\]$/i,
  arbitraryVariableRegex = /^\((?:(\w[\w-]*):)?(.+)\)$/i,
  fractionRegex = /^\d+\/\d+$/,
  tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
  lengthUnitRegex =
    /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
  colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,
  shadowRegex =
    /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
  imageRegex =
    /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
  isFraction = (e) => fractionRegex.test(e),
  isNumber$1 = (e) => !!e && !Number.isNaN(Number(e)),
  isInteger = (e) => !!e && Number.isInteger(Number(e)),
  isPercent = (e) => e.endsWith('%') && isNumber$1(e.slice(0, -1)),
  isTshirtSize = (e) => tshirtUnitRegex.test(e),
  isAny = () => !0,
  isLengthOnly = (e) => lengthUnitRegex.test(e) && !colorFunctionRegex.test(e),
  isNever = () => !1,
  isShadow = (e) => shadowRegex.test(e),
  isImage = (e) => imageRegex.test(e),
  isAnyNonArbitrary = (e) => !isArbitraryValue(e) && !isArbitraryVariable(e),
  isArbitrarySize = (e) => getIsArbitraryValue(e, isLabelSize, isNever),
  isArbitraryValue = (e) => arbitraryValueRegex.test(e),
  isArbitraryLength = (e) =>
    getIsArbitraryValue(e, isLabelLength, isLengthOnly),
  isArbitraryNumber = (e) => getIsArbitraryValue(e, isLabelNumber, isNumber$1),
  isArbitraryPosition = (e) => getIsArbitraryValue(e, isLabelPosition, isNever),
  isArbitraryImage = (e) => getIsArbitraryValue(e, isLabelImage, isImage),
  isArbitraryShadow = (e) => getIsArbitraryValue(e, isLabelShadow, isShadow),
  isArbitraryVariable = (e) => arbitraryVariableRegex.test(e),
  isArbitraryVariableLength = (e) => getIsArbitraryVariable(e, isLabelLength),
  isArbitraryVariableFamilyName = (e) =>
    getIsArbitraryVariable(e, isLabelFamilyName),
  isArbitraryVariablePosition = (e) =>
    getIsArbitraryVariable(e, isLabelPosition),
  isArbitraryVariableSize = (e) => getIsArbitraryVariable(e, isLabelSize),
  isArbitraryVariableImage = (e) => getIsArbitraryVariable(e, isLabelImage),
  isArbitraryVariableShadow = (e) =>
    getIsArbitraryVariable(e, isLabelShadow, !0),
  getIsArbitraryValue = (e, o, a) => {
    const s = arbitraryValueRegex.exec(e);
    return s ? (s[1] ? o(s[1]) : a(s[2])) : !1;
  },
  getIsArbitraryVariable = (e, o, a = !1) => {
    const s = arbitraryVariableRegex.exec(e);
    return s ? (s[1] ? o(s[1]) : a) : !1;
  },
  isLabelPosition = (e) => e === 'position' || e === 'percentage',
  isLabelImage = (e) => e === 'image' || e === 'url',
  isLabelSize = (e) => e === 'length' || e === 'size' || e === 'bg-size',
  isLabelLength = (e) => e === 'length',
  isLabelNumber = (e) => e === 'number',
  isLabelFamilyName = (e) => e === 'family-name',
  isLabelShadow = (e) => e === 'shadow',
  getDefaultConfig = () => {
    const e = fromTheme('color'),
      o = fromTheme('font'),
      a = fromTheme('text'),
      s = fromTheme('font-weight'),
      i = fromTheme('tracking'),
      c = fromTheme('leading'),
      d = fromTheme('breakpoint'),
      h = fromTheme('container'),
      b = fromTheme('spacing'),
      g = fromTheme('radius'),
      $ = fromTheme('shadow'),
      _ = fromTheme('inset-shadow'),
      _e = fromTheme('text-shadow'),
      ot = fromTheme('drop-shadow'),
      j = fromTheme('blur'),
      nt = fromTheme('perspective'),
      lt = fromTheme('aspect'),
      tt = fromTheme('ease'),
      et = fromTheme('animate'),
      rt = () => [
        'auto',
        'avoid',
        'all',
        'avoid-page',
        'page',
        'left',
        'right',
        'column',
      ],
      at = () => [
        'center',
        'top',
        'bottom',
        'left',
        'right',
        'top-left',
        'left-top',
        'top-right',
        'right-top',
        'bottom-right',
        'right-bottom',
        'bottom-left',
        'left-bottom',
      ],
      ct = () => [...at(), isArbitraryVariable, isArbitraryValue],
      dt = () => ['auto', 'hidden', 'clip', 'visible', 'scroll'],
      ut = () => ['auto', 'contain', 'none'],
      st = () => [isArbitraryVariable, isArbitraryValue, b],
      gt = () => [isFraction, 'full', 'auto', ...st()],
      yt = () => [
        isInteger,
        'none',
        'subgrid',
        isArbitraryVariable,
        isArbitraryValue,
      ],
      Ct = () => [
        'auto',
        { span: ['full', isInteger, isArbitraryVariable, isArbitraryValue] },
        isInteger,
        isArbitraryVariable,
        isArbitraryValue,
      ],
      At = () => [isInteger, 'auto', isArbitraryVariable, isArbitraryValue],
      wt = () => [
        'auto',
        'min',
        'max',
        'fr',
        isArbitraryVariable,
        isArbitraryValue,
      ],
      _t = () => [
        'start',
        'end',
        'center',
        'between',
        'around',
        'evenly',
        'stretch',
        'baseline',
        'center-safe',
        'end-safe',
      ],
      kt = () => [
        'start',
        'end',
        'center',
        'stretch',
        'center-safe',
        'end-safe',
      ],
      St = () => ['auto', ...st()],
      Pt = () => [
        isFraction,
        'auto',
        'full',
        'dvw',
        'dvh',
        'lvw',
        'lvh',
        'svw',
        'svh',
        'min',
        'max',
        'fit',
        ...st(),
      ],
      xt = () => [e, isArbitraryVariable, isArbitraryValue],
      vt = () => [
        ...at(),
        isArbitraryVariablePosition,
        isArbitraryPosition,
        { position: [isArbitraryVariable, isArbitraryValue] },
      ],
      $t = () => ['no-repeat', { repeat: ['', 'x', 'y', 'space', 'round'] }],
      it = () => [
        'auto',
        'cover',
        'contain',
        isArbitraryVariableSize,
        isArbitrarySize,
        { size: [isArbitraryVariable, isArbitraryValue] },
      ],
      ft = () => [isPercent, isArbitraryVariableLength, isArbitraryLength],
      bt = () => ['', 'none', 'full', g, isArbitraryVariable, isArbitraryValue],
      mt = () => ['', isNumber$1, isArbitraryVariableLength, isArbitraryLength],
      ht = () => ['solid', 'dashed', 'dotted', 'double'],
      Tt = () => [
        'normal',
        'multiply',
        'screen',
        'overlay',
        'darken',
        'lighten',
        'color-dodge',
        'color-burn',
        'hard-light',
        'soft-light',
        'difference',
        'exclusion',
        'hue',
        'saturation',
        'color',
        'luminosity',
      ],
      Et = () => [
        isNumber$1,
        isPercent,
        isArbitraryVariablePosition,
        isArbitraryPosition,
      ],
      Rt = () => ['', 'none', j, isArbitraryVariable, isArbitraryValue],
      Dt = () => ['none', isNumber$1, isArbitraryVariable, isArbitraryValue],
      Mt = () => ['none', isNumber$1, isArbitraryVariable, isArbitraryValue],
      Ut = () => [isNumber$1, isArbitraryVariable, isArbitraryValue],
      Wt = () => [isFraction, 'full', ...st()];
    return {
      cacheSize: 500,
      theme: {
        animate: ['spin', 'ping', 'pulse', 'bounce'],
        aspect: ['video'],
        blur: [isTshirtSize],
        breakpoint: [isTshirtSize],
        color: [isAny],
        container: [isTshirtSize],
        'drop-shadow': [isTshirtSize],
        ease: ['in', 'out', 'in-out'],
        font: [isAnyNonArbitrary],
        'font-weight': [
          'thin',
          'extralight',
          'light',
          'normal',
          'medium',
          'semibold',
          'bold',
          'extrabold',
          'black',
        ],
        'inset-shadow': [isTshirtSize],
        leading: ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose'],
        perspective: [
          'dramatic',
          'near',
          'normal',
          'midrange',
          'distant',
          'none',
        ],
        radius: [isTshirtSize],
        shadow: [isTshirtSize],
        spacing: ['px', isNumber$1],
        text: [isTshirtSize],
        'text-shadow': [isTshirtSize],
        tracking: ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest'],
      },
      classGroups: {
        aspect: [
          {
            aspect: [
              'auto',
              'square',
              isFraction,
              isArbitraryValue,
              isArbitraryVariable,
              lt,
            ],
          },
        ],
        container: ['container'],
        columns: [
          { columns: [isNumber$1, isArbitraryValue, isArbitraryVariable, h] },
        ],
        'break-after': [{ 'break-after': rt() }],
        'break-before': [{ 'break-before': rt() }],
        'break-inside': [
          { 'break-inside': ['auto', 'avoid', 'avoid-page', 'avoid-column'] },
        ],
        'box-decoration': [{ 'box-decoration': ['slice', 'clone'] }],
        box: [{ box: ['border', 'content'] }],
        display: [
          'block',
          'inline-block',
          'inline',
          'flex',
          'inline-flex',
          'table',
          'inline-table',
          'table-caption',
          'table-cell',
          'table-column',
          'table-column-group',
          'table-footer-group',
          'table-header-group',
          'table-row-group',
          'table-row',
          'flow-root',
          'grid',
          'inline-grid',
          'contents',
          'list-item',
          'hidden',
        ],
        sr: ['sr-only', 'not-sr-only'],
        float: [{ float: ['right', 'left', 'none', 'start', 'end'] }],
        clear: [{ clear: ['left', 'right', 'both', 'none', 'start', 'end'] }],
        isolation: ['isolate', 'isolation-auto'],
        'object-fit': [
          { object: ['contain', 'cover', 'fill', 'none', 'scale-down'] },
        ],
        'object-position': [{ object: ct() }],
        overflow: [{ overflow: dt() }],
        'overflow-x': [{ 'overflow-x': dt() }],
        'overflow-y': [{ 'overflow-y': dt() }],
        overscroll: [{ overscroll: ut() }],
        'overscroll-x': [{ 'overscroll-x': ut() }],
        'overscroll-y': [{ 'overscroll-y': ut() }],
        position: ['static', 'fixed', 'absolute', 'relative', 'sticky'],
        inset: [{ inset: gt() }],
        'inset-x': [{ 'inset-x': gt() }],
        'inset-y': [{ 'inset-y': gt() }],
        start: [{ start: gt() }],
        end: [{ end: gt() }],
        top: [{ top: gt() }],
        right: [{ right: gt() }],
        bottom: [{ bottom: gt() }],
        left: [{ left: gt() }],
        visibility: ['visible', 'invisible', 'collapse'],
        z: [{ z: [isInteger, 'auto', isArbitraryVariable, isArbitraryValue] }],
        basis: [{ basis: [isFraction, 'full', 'auto', h, ...st()] }],
        'flex-direction': [
          { flex: ['row', 'row-reverse', 'col', 'col-reverse'] },
        ],
        'flex-wrap': [{ flex: ['nowrap', 'wrap', 'wrap-reverse'] }],
        flex: [
          {
            flex: [
              isNumber$1,
              isFraction,
              'auto',
              'initial',
              'none',
              isArbitraryValue,
            ],
          },
        ],
        grow: [
          { grow: ['', isNumber$1, isArbitraryVariable, isArbitraryValue] },
        ],
        shrink: [
          { shrink: ['', isNumber$1, isArbitraryVariable, isArbitraryValue] },
        ],
        order: [
          {
            order: [
              isInteger,
              'first',
              'last',
              'none',
              isArbitraryVariable,
              isArbitraryValue,
            ],
          },
        ],
        'grid-cols': [{ 'grid-cols': yt() }],
        'col-start-end': [{ col: Ct() }],
        'col-start': [{ 'col-start': At() }],
        'col-end': [{ 'col-end': At() }],
        'grid-rows': [{ 'grid-rows': yt() }],
        'row-start-end': [{ row: Ct() }],
        'row-start': [{ 'row-start': At() }],
        'row-end': [{ 'row-end': At() }],
        'grid-flow': [
          { 'grid-flow': ['row', 'col', 'dense', 'row-dense', 'col-dense'] },
        ],
        'auto-cols': [{ 'auto-cols': wt() }],
        'auto-rows': [{ 'auto-rows': wt() }],
        gap: [{ gap: st() }],
        'gap-x': [{ 'gap-x': st() }],
        'gap-y': [{ 'gap-y': st() }],
        'justify-content': [{ justify: [..._t(), 'normal'] }],
        'justify-items': [{ 'justify-items': [...kt(), 'normal'] }],
        'justify-self': [{ 'justify-self': ['auto', ...kt()] }],
        'align-content': [{ content: ['normal', ..._t()] }],
        'align-items': [{ items: [...kt(), { baseline: ['', 'last'] }] }],
        'align-self': [{ self: ['auto', ...kt(), { baseline: ['', 'last'] }] }],
        'place-content': [{ 'place-content': _t() }],
        'place-items': [{ 'place-items': [...kt(), 'baseline'] }],
        'place-self': [{ 'place-self': ['auto', ...kt()] }],
        p: [{ p: st() }],
        px: [{ px: st() }],
        py: [{ py: st() }],
        ps: [{ ps: st() }],
        pe: [{ pe: st() }],
        pt: [{ pt: st() }],
        pr: [{ pr: st() }],
        pb: [{ pb: st() }],
        pl: [{ pl: st() }],
        m: [{ m: St() }],
        mx: [{ mx: St() }],
        my: [{ my: St() }],
        ms: [{ ms: St() }],
        me: [{ me: St() }],
        mt: [{ mt: St() }],
        mr: [{ mr: St() }],
        mb: [{ mb: St() }],
        ml: [{ ml: St() }],
        'space-x': [{ 'space-x': st() }],
        'space-x-reverse': ['space-x-reverse'],
        'space-y': [{ 'space-y': st() }],
        'space-y-reverse': ['space-y-reverse'],
        size: [{ size: Pt() }],
        w: [{ w: [h, 'screen', ...Pt()] }],
        'min-w': [{ 'min-w': [h, 'screen', 'none', ...Pt()] }],
        'max-w': [
          { 'max-w': [h, 'screen', 'none', 'prose', { screen: [d] }, ...Pt()] },
        ],
        h: [{ h: ['screen', 'lh', ...Pt()] }],
        'min-h': [{ 'min-h': ['screen', 'lh', 'none', ...Pt()] }],
        'max-h': [{ 'max-h': ['screen', 'lh', ...Pt()] }],
        'font-size': [
          { text: ['base', a, isArbitraryVariableLength, isArbitraryLength] },
        ],
        'font-smoothing': ['antialiased', 'subpixel-antialiased'],
        'font-style': ['italic', 'not-italic'],
        'font-weight': [{ font: [s, isArbitraryVariable, isArbitraryNumber] }],
        'font-stretch': [
          {
            'font-stretch': [
              'ultra-condensed',
              'extra-condensed',
              'condensed',
              'semi-condensed',
              'normal',
              'semi-expanded',
              'expanded',
              'extra-expanded',
              'ultra-expanded',
              isPercent,
              isArbitraryValue,
            ],
          },
        ],
        'font-family': [
          { font: [isArbitraryVariableFamilyName, isArbitraryValue, o] },
        ],
        'fvn-normal': ['normal-nums'],
        'fvn-ordinal': ['ordinal'],
        'fvn-slashed-zero': ['slashed-zero'],
        'fvn-figure': ['lining-nums', 'oldstyle-nums'],
        'fvn-spacing': ['proportional-nums', 'tabular-nums'],
        'fvn-fraction': ['diagonal-fractions', 'stacked-fractions'],
        tracking: [{ tracking: [i, isArbitraryVariable, isArbitraryValue] }],
        'line-clamp': [
          {
            'line-clamp': [
              isNumber$1,
              'none',
              isArbitraryVariable,
              isArbitraryNumber,
            ],
          },
        ],
        leading: [{ leading: [c, ...st()] }],
        'list-image': [
          { 'list-image': ['none', isArbitraryVariable, isArbitraryValue] },
        ],
        'list-style-position': [{ list: ['inside', 'outside'] }],
        'list-style-type': [
          {
            list: [
              'disc',
              'decimal',
              'none',
              isArbitraryVariable,
              isArbitraryValue,
            ],
          },
        ],
        'text-alignment': [
          { text: ['left', 'center', 'right', 'justify', 'start', 'end'] },
        ],
        'placeholder-color': [{ placeholder: xt() }],
        'text-color': [{ text: xt() }],
        'text-decoration': [
          'underline',
          'overline',
          'line-through',
          'no-underline',
        ],
        'text-decoration-style': [{ decoration: [...ht(), 'wavy'] }],
        'text-decoration-thickness': [
          {
            decoration: [
              isNumber$1,
              'from-font',
              'auto',
              isArbitraryVariable,
              isArbitraryLength,
            ],
          },
        ],
        'text-decoration-color': [{ decoration: xt() }],
        'underline-offset': [
          {
            'underline-offset': [
              isNumber$1,
              'auto',
              isArbitraryVariable,
              isArbitraryValue,
            ],
          },
        ],
        'text-transform': [
          'uppercase',
          'lowercase',
          'capitalize',
          'normal-case',
        ],
        'text-overflow': ['truncate', 'text-ellipsis', 'text-clip'],
        'text-wrap': [{ text: ['wrap', 'nowrap', 'balance', 'pretty'] }],
        indent: [{ indent: st() }],
        'vertical-align': [
          {
            align: [
              'baseline',
              'top',
              'middle',
              'bottom',
              'text-top',
              'text-bottom',
              'sub',
              'super',
              isArbitraryVariable,
              isArbitraryValue,
            ],
          },
        ],
        whitespace: [
          {
            whitespace: [
              'normal',
              'nowrap',
              'pre',
              'pre-line',
              'pre-wrap',
              'break-spaces',
            ],
          },
        ],
        break: [{ break: ['normal', 'words', 'all', 'keep'] }],
        wrap: [{ wrap: ['break-word', 'anywhere', 'normal'] }],
        hyphens: [{ hyphens: ['none', 'manual', 'auto'] }],
        content: [{ content: ['none', isArbitraryVariable, isArbitraryValue] }],
        'bg-attachment': [{ bg: ['fixed', 'local', 'scroll'] }],
        'bg-clip': [{ 'bg-clip': ['border', 'padding', 'content', 'text'] }],
        'bg-origin': [{ 'bg-origin': ['border', 'padding', 'content'] }],
        'bg-position': [{ bg: vt() }],
        'bg-repeat': [{ bg: $t() }],
        'bg-size': [{ bg: it() }],
        'bg-image': [
          {
            bg: [
              'none',
              {
                linear: [
                  { to: ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl'] },
                  isInteger,
                  isArbitraryVariable,
                  isArbitraryValue,
                ],
                radial: ['', isArbitraryVariable, isArbitraryValue],
                conic: [isInteger, isArbitraryVariable, isArbitraryValue],
              },
              isArbitraryVariableImage,
              isArbitraryImage,
            ],
          },
        ],
        'bg-color': [{ bg: xt() }],
        'gradient-from-pos': [{ from: ft() }],
        'gradient-via-pos': [{ via: ft() }],
        'gradient-to-pos': [{ to: ft() }],
        'gradient-from': [{ from: xt() }],
        'gradient-via': [{ via: xt() }],
        'gradient-to': [{ to: xt() }],
        rounded: [{ rounded: bt() }],
        'rounded-s': [{ 'rounded-s': bt() }],
        'rounded-e': [{ 'rounded-e': bt() }],
        'rounded-t': [{ 'rounded-t': bt() }],
        'rounded-r': [{ 'rounded-r': bt() }],
        'rounded-b': [{ 'rounded-b': bt() }],
        'rounded-l': [{ 'rounded-l': bt() }],
        'rounded-ss': [{ 'rounded-ss': bt() }],
        'rounded-se': [{ 'rounded-se': bt() }],
        'rounded-ee': [{ 'rounded-ee': bt() }],
        'rounded-es': [{ 'rounded-es': bt() }],
        'rounded-tl': [{ 'rounded-tl': bt() }],
        'rounded-tr': [{ 'rounded-tr': bt() }],
        'rounded-br': [{ 'rounded-br': bt() }],
        'rounded-bl': [{ 'rounded-bl': bt() }],
        'border-w': [{ border: mt() }],
        'border-w-x': [{ 'border-x': mt() }],
        'border-w-y': [{ 'border-y': mt() }],
        'border-w-s': [{ 'border-s': mt() }],
        'border-w-e': [{ 'border-e': mt() }],
        'border-w-t': [{ 'border-t': mt() }],
        'border-w-r': [{ 'border-r': mt() }],
        'border-w-b': [{ 'border-b': mt() }],
        'border-w-l': [{ 'border-l': mt() }],
        'divide-x': [{ 'divide-x': mt() }],
        'divide-x-reverse': ['divide-x-reverse'],
        'divide-y': [{ 'divide-y': mt() }],
        'divide-y-reverse': ['divide-y-reverse'],
        'border-style': [{ border: [...ht(), 'hidden', 'none'] }],
        'divide-style': [{ divide: [...ht(), 'hidden', 'none'] }],
        'border-color': [{ border: xt() }],
        'border-color-x': [{ 'border-x': xt() }],
        'border-color-y': [{ 'border-y': xt() }],
        'border-color-s': [{ 'border-s': xt() }],
        'border-color-e': [{ 'border-e': xt() }],
        'border-color-t': [{ 'border-t': xt() }],
        'border-color-r': [{ 'border-r': xt() }],
        'border-color-b': [{ 'border-b': xt() }],
        'border-color-l': [{ 'border-l': xt() }],
        'divide-color': [{ divide: xt() }],
        'outline-style': [{ outline: [...ht(), 'none', 'hidden'] }],
        'outline-offset': [
          {
            'outline-offset': [
              isNumber$1,
              isArbitraryVariable,
              isArbitraryValue,
            ],
          },
        ],
        'outline-w': [
          {
            outline: [
              '',
              isNumber$1,
              isArbitraryVariableLength,
              isArbitraryLength,
            ],
          },
        ],
        'outline-color': [{ outline: xt() }],
        shadow: [
          {
            shadow: [
              '',
              'none',
              $,
              isArbitraryVariableShadow,
              isArbitraryShadow,
            ],
          },
        ],
        'shadow-color': [{ shadow: xt() }],
        'inset-shadow': [
          {
            'inset-shadow': [
              'none',
              _,
              isArbitraryVariableShadow,
              isArbitraryShadow,
            ],
          },
        ],
        'inset-shadow-color': [{ 'inset-shadow': xt() }],
        'ring-w': [{ ring: mt() }],
        'ring-w-inset': ['ring-inset'],
        'ring-color': [{ ring: xt() }],
        'ring-offset-w': [{ 'ring-offset': [isNumber$1, isArbitraryLength] }],
        'ring-offset-color': [{ 'ring-offset': xt() }],
        'inset-ring-w': [{ 'inset-ring': mt() }],
        'inset-ring-color': [{ 'inset-ring': xt() }],
        'text-shadow': [
          {
            'text-shadow': [
              'none',
              _e,
              isArbitraryVariableShadow,
              isArbitraryShadow,
            ],
          },
        ],
        'text-shadow-color': [{ 'text-shadow': xt() }],
        opacity: [
          { opacity: [isNumber$1, isArbitraryVariable, isArbitraryValue] },
        ],
        'mix-blend': [
          { 'mix-blend': [...Tt(), 'plus-darker', 'plus-lighter'] },
        ],
        'bg-blend': [{ 'bg-blend': Tt() }],
        'mask-clip': [
          {
            'mask-clip': [
              'border',
              'padding',
              'content',
              'fill',
              'stroke',
              'view',
            ],
          },
          'mask-no-clip',
        ],
        'mask-composite': [
          { mask: ['add', 'subtract', 'intersect', 'exclude'] },
        ],
        'mask-image-linear-pos': [{ 'mask-linear': [isNumber$1] }],
        'mask-image-linear-from-pos': [{ 'mask-linear-from': Et() }],
        'mask-image-linear-to-pos': [{ 'mask-linear-to': Et() }],
        'mask-image-linear-from-color': [{ 'mask-linear-from': xt() }],
        'mask-image-linear-to-color': [{ 'mask-linear-to': xt() }],
        'mask-image-t-from-pos': [{ 'mask-t-from': Et() }],
        'mask-image-t-to-pos': [{ 'mask-t-to': Et() }],
        'mask-image-t-from-color': [{ 'mask-t-from': xt() }],
        'mask-image-t-to-color': [{ 'mask-t-to': xt() }],
        'mask-image-r-from-pos': [{ 'mask-r-from': Et() }],
        'mask-image-r-to-pos': [{ 'mask-r-to': Et() }],
        'mask-image-r-from-color': [{ 'mask-r-from': xt() }],
        'mask-image-r-to-color': [{ 'mask-r-to': xt() }],
        'mask-image-b-from-pos': [{ 'mask-b-from': Et() }],
        'mask-image-b-to-pos': [{ 'mask-b-to': Et() }],
        'mask-image-b-from-color': [{ 'mask-b-from': xt() }],
        'mask-image-b-to-color': [{ 'mask-b-to': xt() }],
        'mask-image-l-from-pos': [{ 'mask-l-from': Et() }],
        'mask-image-l-to-pos': [{ 'mask-l-to': Et() }],
        'mask-image-l-from-color': [{ 'mask-l-from': xt() }],
        'mask-image-l-to-color': [{ 'mask-l-to': xt() }],
        'mask-image-x-from-pos': [{ 'mask-x-from': Et() }],
        'mask-image-x-to-pos': [{ 'mask-x-to': Et() }],
        'mask-image-x-from-color': [{ 'mask-x-from': xt() }],
        'mask-image-x-to-color': [{ 'mask-x-to': xt() }],
        'mask-image-y-from-pos': [{ 'mask-y-from': Et() }],
        'mask-image-y-to-pos': [{ 'mask-y-to': Et() }],
        'mask-image-y-from-color': [{ 'mask-y-from': xt() }],
        'mask-image-y-to-color': [{ 'mask-y-to': xt() }],
        'mask-image-radial': [
          { 'mask-radial': [isArbitraryVariable, isArbitraryValue] },
        ],
        'mask-image-radial-from-pos': [{ 'mask-radial-from': Et() }],
        'mask-image-radial-to-pos': [{ 'mask-radial-to': Et() }],
        'mask-image-radial-from-color': [{ 'mask-radial-from': xt() }],
        'mask-image-radial-to-color': [{ 'mask-radial-to': xt() }],
        'mask-image-radial-shape': [{ 'mask-radial': ['circle', 'ellipse'] }],
        'mask-image-radial-size': [
          {
            'mask-radial': [
              { closest: ['side', 'corner'], farthest: ['side', 'corner'] },
            ],
          },
        ],
        'mask-image-radial-pos': [{ 'mask-radial-at': at() }],
        'mask-image-conic-pos': [{ 'mask-conic': [isNumber$1] }],
        'mask-image-conic-from-pos': [{ 'mask-conic-from': Et() }],
        'mask-image-conic-to-pos': [{ 'mask-conic-to': Et() }],
        'mask-image-conic-from-color': [{ 'mask-conic-from': xt() }],
        'mask-image-conic-to-color': [{ 'mask-conic-to': xt() }],
        'mask-mode': [{ mask: ['alpha', 'luminance', 'match'] }],
        'mask-origin': [
          {
            'mask-origin': [
              'border',
              'padding',
              'content',
              'fill',
              'stroke',
              'view',
            ],
          },
        ],
        'mask-position': [{ mask: vt() }],
        'mask-repeat': [{ mask: $t() }],
        'mask-size': [{ mask: it() }],
        'mask-type': [{ 'mask-type': ['alpha', 'luminance'] }],
        'mask-image': [
          { mask: ['none', isArbitraryVariable, isArbitraryValue] },
        ],
        filter: [
          { filter: ['', 'none', isArbitraryVariable, isArbitraryValue] },
        ],
        blur: [{ blur: Rt() }],
        brightness: [
          { brightness: [isNumber$1, isArbitraryVariable, isArbitraryValue] },
        ],
        contrast: [
          { contrast: [isNumber$1, isArbitraryVariable, isArbitraryValue] },
        ],
        'drop-shadow': [
          {
            'drop-shadow': [
              '',
              'none',
              ot,
              isArbitraryVariableShadow,
              isArbitraryShadow,
            ],
          },
        ],
        'drop-shadow-color': [{ 'drop-shadow': xt() }],
        grayscale: [
          {
            grayscale: ['', isNumber$1, isArbitraryVariable, isArbitraryValue],
          },
        ],
        'hue-rotate': [
          { 'hue-rotate': [isNumber$1, isArbitraryVariable, isArbitraryValue] },
        ],
        invert: [
          { invert: ['', isNumber$1, isArbitraryVariable, isArbitraryValue] },
        ],
        saturate: [
          { saturate: [isNumber$1, isArbitraryVariable, isArbitraryValue] },
        ],
        sepia: [
          { sepia: ['', isNumber$1, isArbitraryVariable, isArbitraryValue] },
        ],
        'backdrop-filter': [
          {
            'backdrop-filter': [
              '',
              'none',
              isArbitraryVariable,
              isArbitraryValue,
            ],
          },
        ],
        'backdrop-blur': [{ 'backdrop-blur': Rt() }],
        'backdrop-brightness': [
          {
            'backdrop-brightness': [
              isNumber$1,
              isArbitraryVariable,
              isArbitraryValue,
            ],
          },
        ],
        'backdrop-contrast': [
          {
            'backdrop-contrast': [
              isNumber$1,
              isArbitraryVariable,
              isArbitraryValue,
            ],
          },
        ],
        'backdrop-grayscale': [
          {
            'backdrop-grayscale': [
              '',
              isNumber$1,
              isArbitraryVariable,
              isArbitraryValue,
            ],
          },
        ],
        'backdrop-hue-rotate': [
          {
            'backdrop-hue-rotate': [
              isNumber$1,
              isArbitraryVariable,
              isArbitraryValue,
            ],
          },
        ],
        'backdrop-invert': [
          {
            'backdrop-invert': [
              '',
              isNumber$1,
              isArbitraryVariable,
              isArbitraryValue,
            ],
          },
        ],
        'backdrop-opacity': [
          {
            'backdrop-opacity': [
              isNumber$1,
              isArbitraryVariable,
              isArbitraryValue,
            ],
          },
        ],
        'backdrop-saturate': [
          {
            'backdrop-saturate': [
              isNumber$1,
              isArbitraryVariable,
              isArbitraryValue,
            ],
          },
        ],
        'backdrop-sepia': [
          {
            'backdrop-sepia': [
              '',
              isNumber$1,
              isArbitraryVariable,
              isArbitraryValue,
            ],
          },
        ],
        'border-collapse': [{ border: ['collapse', 'separate'] }],
        'border-spacing': [{ 'border-spacing': st() }],
        'border-spacing-x': [{ 'border-spacing-x': st() }],
        'border-spacing-y': [{ 'border-spacing-y': st() }],
        'table-layout': [{ table: ['auto', 'fixed'] }],
        caption: [{ caption: ['top', 'bottom'] }],
        transition: [
          {
            transition: [
              '',
              'all',
              'colors',
              'opacity',
              'shadow',
              'transform',
              'none',
              isArbitraryVariable,
              isArbitraryValue,
            ],
          },
        ],
        'transition-behavior': [{ transition: ['normal', 'discrete'] }],
        duration: [
          {
            duration: [
              isNumber$1,
              'initial',
              isArbitraryVariable,
              isArbitraryValue,
            ],
          },
        ],
        ease: [
          {
            ease: [
              'linear',
              'initial',
              tt,
              isArbitraryVariable,
              isArbitraryValue,
            ],
          },
        ],
        delay: [{ delay: [isNumber$1, isArbitraryVariable, isArbitraryValue] }],
        animate: [
          { animate: ['none', et, isArbitraryVariable, isArbitraryValue] },
        ],
        backface: [{ backface: ['hidden', 'visible'] }],
        perspective: [
          { perspective: [nt, isArbitraryVariable, isArbitraryValue] },
        ],
        'perspective-origin': [{ 'perspective-origin': ct() }],
        rotate: [{ rotate: Dt() }],
        'rotate-x': [{ 'rotate-x': Dt() }],
        'rotate-y': [{ 'rotate-y': Dt() }],
        'rotate-z': [{ 'rotate-z': Dt() }],
        scale: [{ scale: Mt() }],
        'scale-x': [{ 'scale-x': Mt() }],
        'scale-y': [{ 'scale-y': Mt() }],
        'scale-z': [{ 'scale-z': Mt() }],
        'scale-3d': ['scale-3d'],
        skew: [{ skew: Ut() }],
        'skew-x': [{ 'skew-x': Ut() }],
        'skew-y': [{ 'skew-y': Ut() }],
        transform: [
          {
            transform: [
              isArbitraryVariable,
              isArbitraryValue,
              '',
              'none',
              'gpu',
              'cpu',
            ],
          },
        ],
        'transform-origin': [{ origin: ct() }],
        'transform-style': [{ transform: ['3d', 'flat'] }],
        translate: [{ translate: Wt() }],
        'translate-x': [{ 'translate-x': Wt() }],
        'translate-y': [{ 'translate-y': Wt() }],
        'translate-z': [{ 'translate-z': Wt() }],
        'translate-none': ['translate-none'],
        accent: [{ accent: xt() }],
        appearance: [{ appearance: ['none', 'auto'] }],
        'caret-color': [{ caret: xt() }],
        'color-scheme': [
          {
            scheme: [
              'normal',
              'dark',
              'light',
              'light-dark',
              'only-dark',
              'only-light',
            ],
          },
        ],
        cursor: [
          {
            cursor: [
              'auto',
              'default',
              'pointer',
              'wait',
              'text',
              'move',
              'help',
              'not-allowed',
              'none',
              'context-menu',
              'progress',
              'cell',
              'crosshair',
              'vertical-text',
              'alias',
              'copy',
              'no-drop',
              'grab',
              'grabbing',
              'all-scroll',
              'col-resize',
              'row-resize',
              'n-resize',
              'e-resize',
              's-resize',
              'w-resize',
              'ne-resize',
              'nw-resize',
              'se-resize',
              'sw-resize',
              'ew-resize',
              'ns-resize',
              'nesw-resize',
              'nwse-resize',
              'zoom-in',
              'zoom-out',
              isArbitraryVariable,
              isArbitraryValue,
            ],
          },
        ],
        'field-sizing': [{ 'field-sizing': ['fixed', 'content'] }],
        'pointer-events': [{ 'pointer-events': ['auto', 'none'] }],
        resize: [{ resize: ['none', '', 'y', 'x'] }],
        'scroll-behavior': [{ scroll: ['auto', 'smooth'] }],
        'scroll-m': [{ 'scroll-m': st() }],
        'scroll-mx': [{ 'scroll-mx': st() }],
        'scroll-my': [{ 'scroll-my': st() }],
        'scroll-ms': [{ 'scroll-ms': st() }],
        'scroll-me': [{ 'scroll-me': st() }],
        'scroll-mt': [{ 'scroll-mt': st() }],
        'scroll-mr': [{ 'scroll-mr': st() }],
        'scroll-mb': [{ 'scroll-mb': st() }],
        'scroll-ml': [{ 'scroll-ml': st() }],
        'scroll-p': [{ 'scroll-p': st() }],
        'scroll-px': [{ 'scroll-px': st() }],
        'scroll-py': [{ 'scroll-py': st() }],
        'scroll-ps': [{ 'scroll-ps': st() }],
        'scroll-pe': [{ 'scroll-pe': st() }],
        'scroll-pt': [{ 'scroll-pt': st() }],
        'scroll-pr': [{ 'scroll-pr': st() }],
        'scroll-pb': [{ 'scroll-pb': st() }],
        'scroll-pl': [{ 'scroll-pl': st() }],
        'snap-align': [{ snap: ['start', 'end', 'center', 'align-none'] }],
        'snap-stop': [{ snap: ['normal', 'always'] }],
        'snap-type': [{ snap: ['none', 'x', 'y', 'both'] }],
        'snap-strictness': [{ snap: ['mandatory', 'proximity'] }],
        touch: [{ touch: ['auto', 'none', 'manipulation'] }],
        'touch-x': [{ 'touch-pan': ['x', 'left', 'right'] }],
        'touch-y': [{ 'touch-pan': ['y', 'up', 'down'] }],
        'touch-pz': ['touch-pinch-zoom'],
        select: [{ select: ['none', 'text', 'all', 'auto'] }],
        'will-change': [
          {
            'will-change': [
              'auto',
              'scroll',
              'contents',
              'transform',
              isArbitraryVariable,
              isArbitraryValue,
            ],
          },
        ],
        fill: [{ fill: ['none', ...xt()] }],
        'stroke-w': [
          {
            stroke: [
              isNumber$1,
              isArbitraryVariableLength,
              isArbitraryLength,
              isArbitraryNumber,
            ],
          },
        ],
        stroke: [{ stroke: ['none', ...xt()] }],
        'forced-color-adjust': [{ 'forced-color-adjust': ['auto', 'none'] }],
      },
      conflictingClassGroups: {
        overflow: ['overflow-x', 'overflow-y'],
        overscroll: ['overscroll-x', 'overscroll-y'],
        inset: [
          'inset-x',
          'inset-y',
          'start',
          'end',
          'top',
          'right',
          'bottom',
          'left',
        ],
        'inset-x': ['right', 'left'],
        'inset-y': ['top', 'bottom'],
        flex: ['basis', 'grow', 'shrink'],
        gap: ['gap-x', 'gap-y'],
        p: ['px', 'py', 'ps', 'pe', 'pt', 'pr', 'pb', 'pl'],
        px: ['pr', 'pl'],
        py: ['pt', 'pb'],
        m: ['mx', 'my', 'ms', 'me', 'mt', 'mr', 'mb', 'ml'],
        mx: ['mr', 'ml'],
        my: ['mt', 'mb'],
        size: ['w', 'h'],
        'font-size': ['leading'],
        'fvn-normal': [
          'fvn-ordinal',
          'fvn-slashed-zero',
          'fvn-figure',
          'fvn-spacing',
          'fvn-fraction',
        ],
        'fvn-ordinal': ['fvn-normal'],
        'fvn-slashed-zero': ['fvn-normal'],
        'fvn-figure': ['fvn-normal'],
        'fvn-spacing': ['fvn-normal'],
        'fvn-fraction': ['fvn-normal'],
        'line-clamp': ['display', 'overflow'],
        rounded: [
          'rounded-s',
          'rounded-e',
          'rounded-t',
          'rounded-r',
          'rounded-b',
          'rounded-l',
          'rounded-ss',
          'rounded-se',
          'rounded-ee',
          'rounded-es',
          'rounded-tl',
          'rounded-tr',
          'rounded-br',
          'rounded-bl',
        ],
        'rounded-s': ['rounded-ss', 'rounded-es'],
        'rounded-e': ['rounded-se', 'rounded-ee'],
        'rounded-t': ['rounded-tl', 'rounded-tr'],
        'rounded-r': ['rounded-tr', 'rounded-br'],
        'rounded-b': ['rounded-br', 'rounded-bl'],
        'rounded-l': ['rounded-tl', 'rounded-bl'],
        'border-spacing': ['border-spacing-x', 'border-spacing-y'],
        'border-w': [
          'border-w-x',
          'border-w-y',
          'border-w-s',
          'border-w-e',
          'border-w-t',
          'border-w-r',
          'border-w-b',
          'border-w-l',
        ],
        'border-w-x': ['border-w-r', 'border-w-l'],
        'border-w-y': ['border-w-t', 'border-w-b'],
        'border-color': [
          'border-color-x',
          'border-color-y',
          'border-color-s',
          'border-color-e',
          'border-color-t',
          'border-color-r',
          'border-color-b',
          'border-color-l',
        ],
        'border-color-x': ['border-color-r', 'border-color-l'],
        'border-color-y': ['border-color-t', 'border-color-b'],
        translate: ['translate-x', 'translate-y', 'translate-none'],
        'translate-none': [
          'translate',
          'translate-x',
          'translate-y',
          'translate-z',
        ],
        'scroll-m': [
          'scroll-mx',
          'scroll-my',
          'scroll-ms',
          'scroll-me',
          'scroll-mt',
          'scroll-mr',
          'scroll-mb',
          'scroll-ml',
        ],
        'scroll-mx': ['scroll-mr', 'scroll-ml'],
        'scroll-my': ['scroll-mt', 'scroll-mb'],
        'scroll-p': [
          'scroll-px',
          'scroll-py',
          'scroll-ps',
          'scroll-pe',
          'scroll-pt',
          'scroll-pr',
          'scroll-pb',
          'scroll-pl',
        ],
        'scroll-px': ['scroll-pr', 'scroll-pl'],
        'scroll-py': ['scroll-pt', 'scroll-pb'],
        touch: ['touch-x', 'touch-y', 'touch-pz'],
        'touch-x': ['touch'],
        'touch-y': ['touch'],
        'touch-pz': ['touch'],
      },
      conflictingClassGroupModifiers: { 'font-size': ['leading'] },
      orderSensitiveModifiers: [
        '*',
        '**',
        'after',
        'backdrop',
        'before',
        'details-content',
        'file',
        'first-letter',
        'first-line',
        'marker',
        'placeholder',
        'selection',
      ],
    };
  },
  twMerge = createTailwindMerge(getDefaultConfig);
function cn(...e) {
  return twMerge(clsx(e));
}
const Tabs = Root2,
  TabsList = reactExports.forwardRef(({ className: e, ...o }, a) =>
    jsxRuntimeExports.jsx(List, {
      ref: a,
      className: cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
        e
      ),
      ...o,
    })
  );
TabsList.displayName = List.displayName;
const TabsTrigger = reactExports.forwardRef(({ className: e, ...o }, a) =>
  jsxRuntimeExports.jsx(Trigger, {
    ref: a,
    className: cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
      e
    ),
    ...o,
  })
);
TabsTrigger.displayName = Trigger.displayName;
const TabsContent = reactExports.forwardRef(({ className: e, ...o }, a) =>
  jsxRuntimeExports.jsx(Content, {
    ref: a,
    className: cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      e
    ),
    ...o,
  })
);
TabsContent.displayName = Content.displayName;
const falsyToString = (e) =>
    typeof e == 'boolean' ? `${e}` : e === 0 ? '0' : e,
  cx = clsx,
  cva = (e, o) => (a) => {
    var s;
    if ((o == null ? void 0 : o.variants) == null)
      return cx(
        e,
        a == null ? void 0 : a.class,
        a == null ? void 0 : a.className
      );
    const { variants: i, defaultVariants: c } = o,
      d = Object.keys(i).map((g) => {
        const $ = a == null ? void 0 : a[g],
          _ = c == null ? void 0 : c[g];
        if ($ === null) return null;
        const _e = falsyToString($) || falsyToString(_);
        return i[g][_e];
      }),
      h =
        a &&
        Object.entries(a).reduce((g, $) => {
          let [_, _e] = $;
          return (_e === void 0 || (g[_] = _e), g);
        }, {}),
      b =
        o == null || (s = o.compoundVariants) === null || s === void 0
          ? void 0
          : s.reduce((g, $) => {
              let { class: _, className: _e, ...ot } = $;
              return Object.entries(ot).every((j) => {
                let [nt, lt] = j;
                return Array.isArray(lt)
                  ? lt.includes({ ...c, ...h }[nt])
                  : { ...c, ...h }[nt] === lt;
              })
                ? [...g, _, _e]
                : g;
            }, []);
    return cx(
      e,
      d,
      b,
      a == null ? void 0 : a.class,
      a == null ? void 0 : a.className
    );
  },
  buttonVariants = cva(
    'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
      variants: {
        variant: {
          default: 'bg-primary text-primary-foreground hover:bg-primary/90',
          destructive:
            'bg-destructive text-destructive-foreground hover:bg-destructive/90',
          outline:
            'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
          secondary:
            'bg-secondary text-secondary-foreground hover:bg-secondary/80',
          ghost: 'hover:bg-accent hover:text-accent-foreground',
          link: 'text-primary underline-offset-4 hover:underline',
        },
        size: {
          default: 'h-10 px-4 py-2',
          sm: 'h-9 rounded-md px-3',
          lg: 'h-11 rounded-md px-8',
          icon: 'h-10 w-10',
        },
      },
      defaultVariants: { variant: 'default', size: 'default' },
    }
  ),
  Button = reactExports.forwardRef(
    ({ className: e, variant: o, size: a, asChild: s = !1, ...i }, c) => {
      const d = s ? Slot : 'button';
      return jsxRuntimeExports.jsx(d, {
        className: cn(buttonVariants({ variant: o, size: a, className: e })),
        ref: c,
        ...i,
      });
    }
  );
Button.displayName = 'Button';
const millisecondsInWeek = 6048e5,
  millisecondsInDay = 864e5,
  constructFromSymbol = Symbol.for('constructDateFrom');
function constructFrom(e, o) {
  return typeof e == 'function'
    ? e(o)
    : e && typeof e == 'object' && constructFromSymbol in e
      ? e[constructFromSymbol](o)
      : e instanceof Date
        ? new e.constructor(o)
        : new Date(o);
}
function toDate(e, o) {
  return constructFrom(o || e, e);
}
let defaultOptions = {};
function getDefaultOptions() {
  return defaultOptions;
}
function startOfWeek(e, o) {
  var h, b, g, $;
  const a = getDefaultOptions(),
    s =
      (o == null ? void 0 : o.weekStartsOn) ??
      ((b = (h = o == null ? void 0 : o.locale) == null ? void 0 : h.options) ==
      null
        ? void 0
        : b.weekStartsOn) ??
      a.weekStartsOn ??
      (($ = (g = a.locale) == null ? void 0 : g.options) == null
        ? void 0
        : $.weekStartsOn) ??
      0,
    i = toDate(e, o == null ? void 0 : o.in),
    c = i.getDay(),
    d = (c < s ? 7 : 0) + c - s;
  return (i.setDate(i.getDate() - d), i.setHours(0, 0, 0, 0), i);
}
function startOfISOWeek(e, o) {
  return startOfWeek(e, { ...o, weekStartsOn: 1 });
}
function getISOWeekYear(e, o) {
  const a = toDate(e, o == null ? void 0 : o.in),
    s = a.getFullYear(),
    i = constructFrom(a, 0);
  (i.setFullYear(s + 1, 0, 4), i.setHours(0, 0, 0, 0));
  const c = startOfISOWeek(i),
    d = constructFrom(a, 0);
  (d.setFullYear(s, 0, 4), d.setHours(0, 0, 0, 0));
  const h = startOfISOWeek(d);
  return a.getTime() >= c.getTime()
    ? s + 1
    : a.getTime() >= h.getTime()
      ? s
      : s - 1;
}
function getTimezoneOffsetInMilliseconds(e) {
  const o = toDate(e),
    a = new Date(
      Date.UTC(
        o.getFullYear(),
        o.getMonth(),
        o.getDate(),
        o.getHours(),
        o.getMinutes(),
        o.getSeconds(),
        o.getMilliseconds()
      )
    );
  return (a.setUTCFullYear(o.getFullYear()), +e - +a);
}
function normalizeDates(e, ...o) {
  const a = constructFrom.bind(null, e || o.find((s) => typeof s == 'object'));
  return o.map(a);
}
function startOfDay(e, o) {
  const a = toDate(e, o == null ? void 0 : o.in);
  return (a.setHours(0, 0, 0, 0), a);
}
function differenceInCalendarDays(e, o, a) {
  const [s, i] = normalizeDates(a == null ? void 0 : a.in, e, o),
    c = startOfDay(s),
    d = startOfDay(i),
    h = +c - getTimezoneOffsetInMilliseconds(c),
    b = +d - getTimezoneOffsetInMilliseconds(d);
  return Math.round((h - b) / millisecondsInDay);
}
function startOfISOWeekYear(e, o) {
  const a = getISOWeekYear(e, o),
    s = constructFrom((o == null ? void 0 : o.in) || e, 0);
  return (s.setFullYear(a, 0, 4), s.setHours(0, 0, 0, 0), startOfISOWeek(s));
}
function isDate(e) {
  return (
    e instanceof Date ||
    (typeof e == 'object' &&
      Object.prototype.toString.call(e) === '[object Date]')
  );
}
function isValid(e) {
  return !((!isDate(e) && typeof e != 'number') || isNaN(+toDate(e)));
}
function startOfYear(e, o) {
  const a = toDate(e, o == null ? void 0 : o.in);
  return (a.setFullYear(a.getFullYear(), 0, 1), a.setHours(0, 0, 0, 0), a);
}
const formatDistanceLocale = {
    lessThanXSeconds: {
      one: 'less than a second',
      other: 'less than {{count}} seconds',
    },
    xSeconds: { one: '1 second', other: '{{count}} seconds' },
    halfAMinute: 'half a minute',
    lessThanXMinutes: {
      one: 'less than a minute',
      other: 'less than {{count}} minutes',
    },
    xMinutes: { one: '1 minute', other: '{{count}} minutes' },
    aboutXHours: { one: 'about 1 hour', other: 'about {{count}} hours' },
    xHours: { one: '1 hour', other: '{{count}} hours' },
    xDays: { one: '1 day', other: '{{count}} days' },
    aboutXWeeks: { one: 'about 1 week', other: 'about {{count}} weeks' },
    xWeeks: { one: '1 week', other: '{{count}} weeks' },
    aboutXMonths: { one: 'about 1 month', other: 'about {{count}} months' },
    xMonths: { one: '1 month', other: '{{count}} months' },
    aboutXYears: { one: 'about 1 year', other: 'about {{count}} years' },
    xYears: { one: '1 year', other: '{{count}} years' },
    overXYears: { one: 'over 1 year', other: 'over {{count}} years' },
    almostXYears: { one: 'almost 1 year', other: 'almost {{count}} years' },
  },
  formatDistance = (e, o, a) => {
    let s;
    const i = formatDistanceLocale[e];
    return (
      typeof i == 'string'
        ? (s = i)
        : o === 1
          ? (s = i.one)
          : (s = i.other.replace('{{count}}', o.toString())),
      a != null && a.addSuffix
        ? a.comparison && a.comparison > 0
          ? 'in ' + s
          : s + ' ago'
        : s
    );
  };
function buildFormatLongFn(e) {
  return (o = {}) => {
    const a = o.width ? String(o.width) : e.defaultWidth;
    return e.formats[a] || e.formats[e.defaultWidth];
  };
}
const dateFormats = {
    full: 'EEEE, MMMM do, y',
    long: 'MMMM do, y',
    medium: 'MMM d, y',
    short: 'MM/dd/yyyy',
  },
  timeFormats = {
    full: 'h:mm:ss a zzzz',
    long: 'h:mm:ss a z',
    medium: 'h:mm:ss a',
    short: 'h:mm a',
  },
  dateTimeFormats = {
    full: "{{date}} 'at' {{time}}",
    long: "{{date}} 'at' {{time}}",
    medium: '{{date}}, {{time}}',
    short: '{{date}}, {{time}}',
  },
  formatLong = {
    date: buildFormatLongFn({ formats: dateFormats, defaultWidth: 'full' }),
    time: buildFormatLongFn({ formats: timeFormats, defaultWidth: 'full' }),
    dateTime: buildFormatLongFn({
      formats: dateTimeFormats,
      defaultWidth: 'full',
    }),
  },
  formatRelativeLocale = {
    lastWeek: "'last' eeee 'at' p",
    yesterday: "'yesterday at' p",
    today: "'today at' p",
    tomorrow: "'tomorrow at' p",
    nextWeek: "eeee 'at' p",
    other: 'P',
  },
  formatRelative = (e, o, a, s) => formatRelativeLocale[e];
function buildLocalizeFn(e) {
  return (o, a) => {
    const s = a != null && a.context ? String(a.context) : 'standalone';
    let i;
    if (s === 'formatting' && e.formattingValues) {
      const d = e.defaultFormattingWidth || e.defaultWidth,
        h = a != null && a.width ? String(a.width) : d;
      i = e.formattingValues[h] || e.formattingValues[d];
    } else {
      const d = e.defaultWidth,
        h = a != null && a.width ? String(a.width) : e.defaultWidth;
      i = e.values[h] || e.values[d];
    }
    const c = e.argumentCallback ? e.argumentCallback(o) : o;
    return i[c];
  };
}
const eraValues = {
    narrow: ['B', 'A'],
    abbreviated: ['BC', 'AD'],
    wide: ['Before Christ', 'Anno Domini'],
  },
  quarterValues = {
    narrow: ['1', '2', '3', '4'],
    abbreviated: ['Q1', 'Q2', 'Q3', 'Q4'],
    wide: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  },
  monthValues = {
    narrow: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    abbreviated: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    wide: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
  },
  dayValues = {
    narrow: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    short: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    abbreviated: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    wide: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
  },
  dayPeriodValues = {
    narrow: {
      am: 'a',
      pm: 'p',
      midnight: 'mi',
      noon: 'n',
      morning: 'morning',
      afternoon: 'afternoon',
      evening: 'evening',
      night: 'night',
    },
    abbreviated: {
      am: 'AM',
      pm: 'PM',
      midnight: 'midnight',
      noon: 'noon',
      morning: 'morning',
      afternoon: 'afternoon',
      evening: 'evening',
      night: 'night',
    },
    wide: {
      am: 'a.m.',
      pm: 'p.m.',
      midnight: 'midnight',
      noon: 'noon',
      morning: 'morning',
      afternoon: 'afternoon',
      evening: 'evening',
      night: 'night',
    },
  },
  formattingDayPeriodValues = {
    narrow: {
      am: 'a',
      pm: 'p',
      midnight: 'mi',
      noon: 'n',
      morning: 'in the morning',
      afternoon: 'in the afternoon',
      evening: 'in the evening',
      night: 'at night',
    },
    abbreviated: {
      am: 'AM',
      pm: 'PM',
      midnight: 'midnight',
      noon: 'noon',
      morning: 'in the morning',
      afternoon: 'in the afternoon',
      evening: 'in the evening',
      night: 'at night',
    },
    wide: {
      am: 'a.m.',
      pm: 'p.m.',
      midnight: 'midnight',
      noon: 'noon',
      morning: 'in the morning',
      afternoon: 'in the afternoon',
      evening: 'in the evening',
      night: 'at night',
    },
  },
  ordinalNumber = (e, o) => {
    const a = Number(e),
      s = a % 100;
    if (s > 20 || s < 10)
      switch (s % 10) {
        case 1:
          return a + 'st';
        case 2:
          return a + 'nd';
        case 3:
          return a + 'rd';
      }
    return a + 'th';
  },
  localize = {
    ordinalNumber,
    era: buildLocalizeFn({ values: eraValues, defaultWidth: 'wide' }),
    quarter: buildLocalizeFn({
      values: quarterValues,
      defaultWidth: 'wide',
      argumentCallback: (e) => e - 1,
    }),
    month: buildLocalizeFn({ values: monthValues, defaultWidth: 'wide' }),
    day: buildLocalizeFn({ values: dayValues, defaultWidth: 'wide' }),
    dayPeriod: buildLocalizeFn({
      values: dayPeriodValues,
      defaultWidth: 'wide',
      formattingValues: formattingDayPeriodValues,
      defaultFormattingWidth: 'wide',
    }),
  };
function buildMatchFn(e) {
  return (o, a = {}) => {
    const s = a.width,
      i = (s && e.matchPatterns[s]) || e.matchPatterns[e.defaultMatchWidth],
      c = o.match(i);
    if (!c) return null;
    const d = c[0],
      h = (s && e.parsePatterns[s]) || e.parsePatterns[e.defaultParseWidth],
      b = Array.isArray(h)
        ? findIndex(h, (_) => _.test(d))
        : findKey(h, (_) => _.test(d));
    let g;
    ((g = e.valueCallback ? e.valueCallback(b) : b),
      (g = a.valueCallback ? a.valueCallback(g) : g));
    const $ = o.slice(d.length);
    return { value: g, rest: $ };
  };
}
function findKey(e, o) {
  for (const a in e)
    if (Object.prototype.hasOwnProperty.call(e, a) && o(e[a])) return a;
}
function findIndex(e, o) {
  for (let a = 0; a < e.length; a++) if (o(e[a])) return a;
}
function buildMatchPatternFn(e) {
  return (o, a = {}) => {
    const s = o.match(e.matchPattern);
    if (!s) return null;
    const i = s[0],
      c = o.match(e.parsePattern);
    if (!c) return null;
    let d = e.valueCallback ? e.valueCallback(c[0]) : c[0];
    d = a.valueCallback ? a.valueCallback(d) : d;
    const h = o.slice(i.length);
    return { value: d, rest: h };
  };
}
const matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i,
  parseOrdinalNumberPattern = /\d+/i,
  matchEraPatterns = {
    narrow: /^(b|a)/i,
    abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
    wide: /^(before christ|before common era|anno domini|common era)/i,
  },
  parseEraPatterns = { any: [/^b/i, /^(a|c)/i] },
  matchQuarterPatterns = {
    narrow: /^[1234]/i,
    abbreviated: /^q[1234]/i,
    wide: /^[1234](th|st|nd|rd)? quarter/i,
  },
  parseQuarterPatterns = { any: [/1/i, /2/i, /3/i, /4/i] },
  matchMonthPatterns = {
    narrow: /^[jfmasond]/i,
    abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
    wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i,
  },
  parseMonthPatterns = {
    narrow: [
      /^j/i,
      /^f/i,
      /^m/i,
      /^a/i,
      /^m/i,
      /^j/i,
      /^j/i,
      /^a/i,
      /^s/i,
      /^o/i,
      /^n/i,
      /^d/i,
    ],
    any: [
      /^ja/i,
      /^f/i,
      /^mar/i,
      /^ap/i,
      /^may/i,
      /^jun/i,
      /^jul/i,
      /^au/i,
      /^s/i,
      /^o/i,
      /^n/i,
      /^d/i,
    ],
  },
  matchDayPatterns = {
    narrow: /^[smtwf]/i,
    short: /^(su|mo|tu|we|th|fr|sa)/i,
    abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
    wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i,
  },
  parseDayPatterns = {
    narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
    any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i],
  },
  matchDayPeriodPatterns = {
    narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
    any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i,
  },
  parseDayPeriodPatterns = {
    any: {
      am: /^a/i,
      pm: /^p/i,
      midnight: /^mi/i,
      noon: /^no/i,
      morning: /morning/i,
      afternoon: /afternoon/i,
      evening: /evening/i,
      night: /night/i,
    },
  },
  match = {
    ordinalNumber: buildMatchPatternFn({
      matchPattern: matchOrdinalNumberPattern,
      parsePattern: parseOrdinalNumberPattern,
      valueCallback: (e) => parseInt(e, 10),
    }),
    era: buildMatchFn({
      matchPatterns: matchEraPatterns,
      defaultMatchWidth: 'wide',
      parsePatterns: parseEraPatterns,
      defaultParseWidth: 'any',
    }),
    quarter: buildMatchFn({
      matchPatterns: matchQuarterPatterns,
      defaultMatchWidth: 'wide',
      parsePatterns: parseQuarterPatterns,
      defaultParseWidth: 'any',
      valueCallback: (e) => e + 1,
    }),
    month: buildMatchFn({
      matchPatterns: matchMonthPatterns,
      defaultMatchWidth: 'wide',
      parsePatterns: parseMonthPatterns,
      defaultParseWidth: 'any',
    }),
    day: buildMatchFn({
      matchPatterns: matchDayPatterns,
      defaultMatchWidth: 'wide',
      parsePatterns: parseDayPatterns,
      defaultParseWidth: 'any',
    }),
    dayPeriod: buildMatchFn({
      matchPatterns: matchDayPeriodPatterns,
      defaultMatchWidth: 'any',
      parsePatterns: parseDayPeriodPatterns,
      defaultParseWidth: 'any',
    }),
  },
  enUS = {
    code: 'en-US',
    formatDistance,
    formatLong,
    formatRelative,
    localize,
    match,
    options: { weekStartsOn: 0, firstWeekContainsDate: 1 },
  };
function getDayOfYear(e, o) {
  const a = toDate(e, o == null ? void 0 : o.in);
  return differenceInCalendarDays(a, startOfYear(a)) + 1;
}
function getISOWeek(e, o) {
  const a = toDate(e, o == null ? void 0 : o.in),
    s = +startOfISOWeek(a) - +startOfISOWeekYear(a);
  return Math.round(s / millisecondsInWeek) + 1;
}
function getWeekYear(e, o) {
  var $, _, _e, ot;
  const a = toDate(e, o == null ? void 0 : o.in),
    s = a.getFullYear(),
    i = getDefaultOptions(),
    c =
      (o == null ? void 0 : o.firstWeekContainsDate) ??
      ((_ = ($ = o == null ? void 0 : o.locale) == null ? void 0 : $.options) ==
      null
        ? void 0
        : _.firstWeekContainsDate) ??
      i.firstWeekContainsDate ??
      ((ot = (_e = i.locale) == null ? void 0 : _e.options) == null
        ? void 0
        : ot.firstWeekContainsDate) ??
      1,
    d = constructFrom((o == null ? void 0 : o.in) || e, 0);
  (d.setFullYear(s + 1, 0, c), d.setHours(0, 0, 0, 0));
  const h = startOfWeek(d, o),
    b = constructFrom((o == null ? void 0 : o.in) || e, 0);
  (b.setFullYear(s, 0, c), b.setHours(0, 0, 0, 0));
  const g = startOfWeek(b, o);
  return +a >= +h ? s + 1 : +a >= +g ? s : s - 1;
}
function startOfWeekYear(e, o) {
  var h, b, g, $;
  const a = getDefaultOptions(),
    s =
      (o == null ? void 0 : o.firstWeekContainsDate) ??
      ((b = (h = o == null ? void 0 : o.locale) == null ? void 0 : h.options) ==
      null
        ? void 0
        : b.firstWeekContainsDate) ??
      a.firstWeekContainsDate ??
      (($ = (g = a.locale) == null ? void 0 : g.options) == null
        ? void 0
        : $.firstWeekContainsDate) ??
      1,
    i = getWeekYear(e, o),
    c = constructFrom((o == null ? void 0 : o.in) || e, 0);
  return (c.setFullYear(i, 0, s), c.setHours(0, 0, 0, 0), startOfWeek(c, o));
}
function getWeek(e, o) {
  const a = toDate(e, o == null ? void 0 : o.in),
    s = +startOfWeek(a, o) - +startOfWeekYear(a, o);
  return Math.round(s / millisecondsInWeek) + 1;
}
function addLeadingZeros(e, o) {
  const a = e < 0 ? '-' : '',
    s = Math.abs(e).toString().padStart(o, '0');
  return a + s;
}
const lightFormatters = {
    y(e, o) {
      const a = e.getFullYear(),
        s = a > 0 ? a : 1 - a;
      return addLeadingZeros(o === 'yy' ? s % 100 : s, o.length);
    },
    M(e, o) {
      const a = e.getMonth();
      return o === 'M' ? String(a + 1) : addLeadingZeros(a + 1, 2);
    },
    d(e, o) {
      return addLeadingZeros(e.getDate(), o.length);
    },
    a(e, o) {
      const a = e.getHours() / 12 >= 1 ? 'pm' : 'am';
      switch (o) {
        case 'a':
        case 'aa':
          return a.toUpperCase();
        case 'aaa':
          return a;
        case 'aaaaa':
          return a[0];
        case 'aaaa':
        default:
          return a === 'am' ? 'a.m.' : 'p.m.';
      }
    },
    h(e, o) {
      return addLeadingZeros(e.getHours() % 12 || 12, o.length);
    },
    H(e, o) {
      return addLeadingZeros(e.getHours(), o.length);
    },
    m(e, o) {
      return addLeadingZeros(e.getMinutes(), o.length);
    },
    s(e, o) {
      return addLeadingZeros(e.getSeconds(), o.length);
    },
    S(e, o) {
      const a = o.length,
        s = e.getMilliseconds(),
        i = Math.trunc(s * Math.pow(10, a - 3));
      return addLeadingZeros(i, o.length);
    },
  },
  dayPeriodEnum = {
    am: 'am',
    pm: 'pm',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    night: 'night',
  },
  formatters = {
    G: function (e, o, a) {
      const s = e.getFullYear() > 0 ? 1 : 0;
      switch (o) {
        case 'G':
        case 'GG':
        case 'GGG':
          return a.era(s, { width: 'abbreviated' });
        case 'GGGGG':
          return a.era(s, { width: 'narrow' });
        case 'GGGG':
        default:
          return a.era(s, { width: 'wide' });
      }
    },
    y: function (e, o, a) {
      if (o === 'yo') {
        const s = e.getFullYear(),
          i = s > 0 ? s : 1 - s;
        return a.ordinalNumber(i, { unit: 'year' });
      }
      return lightFormatters.y(e, o);
    },
    Y: function (e, o, a, s) {
      const i = getWeekYear(e, s),
        c = i > 0 ? i : 1 - i;
      if (o === 'YY') {
        const d = c % 100;
        return addLeadingZeros(d, 2);
      }
      return o === 'Yo'
        ? a.ordinalNumber(c, { unit: 'year' })
        : addLeadingZeros(c, o.length);
    },
    R: function (e, o) {
      const a = getISOWeekYear(e);
      return addLeadingZeros(a, o.length);
    },
    u: function (e, o) {
      const a = e.getFullYear();
      return addLeadingZeros(a, o.length);
    },
    Q: function (e, o, a) {
      const s = Math.ceil((e.getMonth() + 1) / 3);
      switch (o) {
        case 'Q':
          return String(s);
        case 'QQ':
          return addLeadingZeros(s, 2);
        case 'Qo':
          return a.ordinalNumber(s, { unit: 'quarter' });
        case 'QQQ':
          return a.quarter(s, { width: 'abbreviated', context: 'formatting' });
        case 'QQQQQ':
          return a.quarter(s, { width: 'narrow', context: 'formatting' });
        case 'QQQQ':
        default:
          return a.quarter(s, { width: 'wide', context: 'formatting' });
      }
    },
    q: function (e, o, a) {
      const s = Math.ceil((e.getMonth() + 1) / 3);
      switch (o) {
        case 'q':
          return String(s);
        case 'qq':
          return addLeadingZeros(s, 2);
        case 'qo':
          return a.ordinalNumber(s, { unit: 'quarter' });
        case 'qqq':
          return a.quarter(s, { width: 'abbreviated', context: 'standalone' });
        case 'qqqqq':
          return a.quarter(s, { width: 'narrow', context: 'standalone' });
        case 'qqqq':
        default:
          return a.quarter(s, { width: 'wide', context: 'standalone' });
      }
    },
    M: function (e, o, a) {
      const s = e.getMonth();
      switch (o) {
        case 'M':
        case 'MM':
          return lightFormatters.M(e, o);
        case 'Mo':
          return a.ordinalNumber(s + 1, { unit: 'month' });
        case 'MMM':
          return a.month(s, { width: 'abbreviated', context: 'formatting' });
        case 'MMMMM':
          return a.month(s, { width: 'narrow', context: 'formatting' });
        case 'MMMM':
        default:
          return a.month(s, { width: 'wide', context: 'formatting' });
      }
    },
    L: function (e, o, a) {
      const s = e.getMonth();
      switch (o) {
        case 'L':
          return String(s + 1);
        case 'LL':
          return addLeadingZeros(s + 1, 2);
        case 'Lo':
          return a.ordinalNumber(s + 1, { unit: 'month' });
        case 'LLL':
          return a.month(s, { width: 'abbreviated', context: 'standalone' });
        case 'LLLLL':
          return a.month(s, { width: 'narrow', context: 'standalone' });
        case 'LLLL':
        default:
          return a.month(s, { width: 'wide', context: 'standalone' });
      }
    },
    w: function (e, o, a, s) {
      const i = getWeek(e, s);
      return o === 'wo'
        ? a.ordinalNumber(i, { unit: 'week' })
        : addLeadingZeros(i, o.length);
    },
    I: function (e, o, a) {
      const s = getISOWeek(e);
      return o === 'Io'
        ? a.ordinalNumber(s, { unit: 'week' })
        : addLeadingZeros(s, o.length);
    },
    d: function (e, o, a) {
      return o === 'do'
        ? a.ordinalNumber(e.getDate(), { unit: 'date' })
        : lightFormatters.d(e, o);
    },
    D: function (e, o, a) {
      const s = getDayOfYear(e);
      return o === 'Do'
        ? a.ordinalNumber(s, { unit: 'dayOfYear' })
        : addLeadingZeros(s, o.length);
    },
    E: function (e, o, a) {
      const s = e.getDay();
      switch (o) {
        case 'E':
        case 'EE':
        case 'EEE':
          return a.day(s, { width: 'abbreviated', context: 'formatting' });
        case 'EEEEE':
          return a.day(s, { width: 'narrow', context: 'formatting' });
        case 'EEEEEE':
          return a.day(s, { width: 'short', context: 'formatting' });
        case 'EEEE':
        default:
          return a.day(s, { width: 'wide', context: 'formatting' });
      }
    },
    e: function (e, o, a, s) {
      const i = e.getDay(),
        c = (i - s.weekStartsOn + 8) % 7 || 7;
      switch (o) {
        case 'e':
          return String(c);
        case 'ee':
          return addLeadingZeros(c, 2);
        case 'eo':
          return a.ordinalNumber(c, { unit: 'day' });
        case 'eee':
          return a.day(i, { width: 'abbreviated', context: 'formatting' });
        case 'eeeee':
          return a.day(i, { width: 'narrow', context: 'formatting' });
        case 'eeeeee':
          return a.day(i, { width: 'short', context: 'formatting' });
        case 'eeee':
        default:
          return a.day(i, { width: 'wide', context: 'formatting' });
      }
    },
    c: function (e, o, a, s) {
      const i = e.getDay(),
        c = (i - s.weekStartsOn + 8) % 7 || 7;
      switch (o) {
        case 'c':
          return String(c);
        case 'cc':
          return addLeadingZeros(c, o.length);
        case 'co':
          return a.ordinalNumber(c, { unit: 'day' });
        case 'ccc':
          return a.day(i, { width: 'abbreviated', context: 'standalone' });
        case 'ccccc':
          return a.day(i, { width: 'narrow', context: 'standalone' });
        case 'cccccc':
          return a.day(i, { width: 'short', context: 'standalone' });
        case 'cccc':
        default:
          return a.day(i, { width: 'wide', context: 'standalone' });
      }
    },
    i: function (e, o, a) {
      const s = e.getDay(),
        i = s === 0 ? 7 : s;
      switch (o) {
        case 'i':
          return String(i);
        case 'ii':
          return addLeadingZeros(i, o.length);
        case 'io':
          return a.ordinalNumber(i, { unit: 'day' });
        case 'iii':
          return a.day(s, { width: 'abbreviated', context: 'formatting' });
        case 'iiiii':
          return a.day(s, { width: 'narrow', context: 'formatting' });
        case 'iiiiii':
          return a.day(s, { width: 'short', context: 'formatting' });
        case 'iiii':
        default:
          return a.day(s, { width: 'wide', context: 'formatting' });
      }
    },
    a: function (e, o, a) {
      const i = e.getHours() / 12 >= 1 ? 'pm' : 'am';
      switch (o) {
        case 'a':
        case 'aa':
          return a.dayPeriod(i, {
            width: 'abbreviated',
            context: 'formatting',
          });
        case 'aaa':
          return a
            .dayPeriod(i, { width: 'abbreviated', context: 'formatting' })
            .toLowerCase();
        case 'aaaaa':
          return a.dayPeriod(i, { width: 'narrow', context: 'formatting' });
        case 'aaaa':
        default:
          return a.dayPeriod(i, { width: 'wide', context: 'formatting' });
      }
    },
    b: function (e, o, a) {
      const s = e.getHours();
      let i;
      switch (
        (s === 12
          ? (i = dayPeriodEnum.noon)
          : s === 0
            ? (i = dayPeriodEnum.midnight)
            : (i = s / 12 >= 1 ? 'pm' : 'am'),
        o)
      ) {
        case 'b':
        case 'bb':
          return a.dayPeriod(i, {
            width: 'abbreviated',
            context: 'formatting',
          });
        case 'bbb':
          return a
            .dayPeriod(i, { width: 'abbreviated', context: 'formatting' })
            .toLowerCase();
        case 'bbbbb':
          return a.dayPeriod(i, { width: 'narrow', context: 'formatting' });
        case 'bbbb':
        default:
          return a.dayPeriod(i, { width: 'wide', context: 'formatting' });
      }
    },
    B: function (e, o, a) {
      const s = e.getHours();
      let i;
      switch (
        (s >= 17
          ? (i = dayPeriodEnum.evening)
          : s >= 12
            ? (i = dayPeriodEnum.afternoon)
            : s >= 4
              ? (i = dayPeriodEnum.morning)
              : (i = dayPeriodEnum.night),
        o)
      ) {
        case 'B':
        case 'BB':
        case 'BBB':
          return a.dayPeriod(i, {
            width: 'abbreviated',
            context: 'formatting',
          });
        case 'BBBBB':
          return a.dayPeriod(i, { width: 'narrow', context: 'formatting' });
        case 'BBBB':
        default:
          return a.dayPeriod(i, { width: 'wide', context: 'formatting' });
      }
    },
    h: function (e, o, a) {
      if (o === 'ho') {
        let s = e.getHours() % 12;
        return (s === 0 && (s = 12), a.ordinalNumber(s, { unit: 'hour' }));
      }
      return lightFormatters.h(e, o);
    },
    H: function (e, o, a) {
      return o === 'Ho'
        ? a.ordinalNumber(e.getHours(), { unit: 'hour' })
        : lightFormatters.H(e, o);
    },
    K: function (e, o, a) {
      const s = e.getHours() % 12;
      return o === 'Ko'
        ? a.ordinalNumber(s, { unit: 'hour' })
        : addLeadingZeros(s, o.length);
    },
    k: function (e, o, a) {
      let s = e.getHours();
      return (
        s === 0 && (s = 24),
        o === 'ko'
          ? a.ordinalNumber(s, { unit: 'hour' })
          : addLeadingZeros(s, o.length)
      );
    },
    m: function (e, o, a) {
      return o === 'mo'
        ? a.ordinalNumber(e.getMinutes(), { unit: 'minute' })
        : lightFormatters.m(e, o);
    },
    s: function (e, o, a) {
      return o === 'so'
        ? a.ordinalNumber(e.getSeconds(), { unit: 'second' })
        : lightFormatters.s(e, o);
    },
    S: function (e, o) {
      return lightFormatters.S(e, o);
    },
    X: function (e, o, a) {
      const s = e.getTimezoneOffset();
      if (s === 0) return 'Z';
      switch (o) {
        case 'X':
          return formatTimezoneWithOptionalMinutes(s);
        case 'XXXX':
        case 'XX':
          return formatTimezone(s);
        case 'XXXXX':
        case 'XXX':
        default:
          return formatTimezone(s, ':');
      }
    },
    x: function (e, o, a) {
      const s = e.getTimezoneOffset();
      switch (o) {
        case 'x':
          return formatTimezoneWithOptionalMinutes(s);
        case 'xxxx':
        case 'xx':
          return formatTimezone(s);
        case 'xxxxx':
        case 'xxx':
        default:
          return formatTimezone(s, ':');
      }
    },
    O: function (e, o, a) {
      const s = e.getTimezoneOffset();
      switch (o) {
        case 'O':
        case 'OO':
        case 'OOO':
          return 'GMT' + formatTimezoneShort(s, ':');
        case 'OOOO':
        default:
          return 'GMT' + formatTimezone(s, ':');
      }
    },
    z: function (e, o, a) {
      const s = e.getTimezoneOffset();
      switch (o) {
        case 'z':
        case 'zz':
        case 'zzz':
          return 'GMT' + formatTimezoneShort(s, ':');
        case 'zzzz':
        default:
          return 'GMT' + formatTimezone(s, ':');
      }
    },
    t: function (e, o, a) {
      const s = Math.trunc(+e / 1e3);
      return addLeadingZeros(s, o.length);
    },
    T: function (e, o, a) {
      return addLeadingZeros(+e, o.length);
    },
  };
function formatTimezoneShort(e, o = '') {
  const a = e > 0 ? '-' : '+',
    s = Math.abs(e),
    i = Math.trunc(s / 60),
    c = s % 60;
  return c === 0 ? a + String(i) : a + String(i) + o + addLeadingZeros(c, 2);
}
function formatTimezoneWithOptionalMinutes(e, o) {
  return e % 60 === 0
    ? (e > 0 ? '-' : '+') + addLeadingZeros(Math.abs(e) / 60, 2)
    : formatTimezone(e, o);
}
function formatTimezone(e, o = '') {
  const a = e > 0 ? '-' : '+',
    s = Math.abs(e),
    i = addLeadingZeros(Math.trunc(s / 60), 2),
    c = addLeadingZeros(s % 60, 2);
  return a + i + o + c;
}
const dateLongFormatter = (e, o) => {
    switch (e) {
      case 'P':
        return o.date({ width: 'short' });
      case 'PP':
        return o.date({ width: 'medium' });
      case 'PPP':
        return o.date({ width: 'long' });
      case 'PPPP':
      default:
        return o.date({ width: 'full' });
    }
  },
  timeLongFormatter = (e, o) => {
    switch (e) {
      case 'p':
        return o.time({ width: 'short' });
      case 'pp':
        return o.time({ width: 'medium' });
      case 'ppp':
        return o.time({ width: 'long' });
      case 'pppp':
      default:
        return o.time({ width: 'full' });
    }
  },
  dateTimeLongFormatter = (e, o) => {
    const a = e.match(/(P+)(p+)?/) || [],
      s = a[1],
      i = a[2];
    if (!i) return dateLongFormatter(e, o);
    let c;
    switch (s) {
      case 'P':
        c = o.dateTime({ width: 'short' });
        break;
      case 'PP':
        c = o.dateTime({ width: 'medium' });
        break;
      case 'PPP':
        c = o.dateTime({ width: 'long' });
        break;
      case 'PPPP':
      default:
        c = o.dateTime({ width: 'full' });
        break;
    }
    return c
      .replace('{{date}}', dateLongFormatter(s, o))
      .replace('{{time}}', timeLongFormatter(i, o));
  },
  longFormatters = { p: timeLongFormatter, P: dateTimeLongFormatter },
  dayOfYearTokenRE = /^D+$/,
  weekYearTokenRE = /^Y+$/,
  throwTokens = ['D', 'DD', 'YY', 'YYYY'];
function isProtectedDayOfYearToken(e) {
  return dayOfYearTokenRE.test(e);
}
function isProtectedWeekYearToken(e) {
  return weekYearTokenRE.test(e);
}
function warnOrThrowProtectedError(e, o, a) {
  const s = message(e, o, a);
  if ((console.warn(s), throwTokens.includes(e))) throw new RangeError(s);
}
function message(e, o, a) {
  const s = e[0] === 'Y' ? 'years' : 'days of the month';
  return `Use \`${e.toLowerCase()}\` instead of \`${e}\` (in \`${o}\`) for formatting ${s} to the input \`${a}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const formattingTokensRegExp =
    /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g,
  longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g,
  escapedStringRegExp = /^'([^]*?)'?$/,
  doubleQuoteRegExp = /''/g,
  unescapedLatinCharacterRegExp = /[a-zA-Z]/;
function format(e, o, a) {
  var $, _, _e, ot, j, nt, lt, tt;
  const s = getDefaultOptions(),
    i = (a == null ? void 0 : a.locale) ?? s.locale ?? enUS,
    c =
      (a == null ? void 0 : a.firstWeekContainsDate) ??
      ((_ = ($ = a == null ? void 0 : a.locale) == null ? void 0 : $.options) ==
      null
        ? void 0
        : _.firstWeekContainsDate) ??
      s.firstWeekContainsDate ??
      ((ot = (_e = s.locale) == null ? void 0 : _e.options) == null
        ? void 0
        : ot.firstWeekContainsDate) ??
      1,
    d =
      (a == null ? void 0 : a.weekStartsOn) ??
      ((nt =
        (j = a == null ? void 0 : a.locale) == null ? void 0 : j.options) ==
      null
        ? void 0
        : nt.weekStartsOn) ??
      s.weekStartsOn ??
      ((tt = (lt = s.locale) == null ? void 0 : lt.options) == null
        ? void 0
        : tt.weekStartsOn) ??
      0,
    h = toDate(e, a == null ? void 0 : a.in);
  if (!isValid(h)) throw new RangeError('Invalid time value');
  let b = o
    .match(longFormattingTokensRegExp)
    .map((et) => {
      const rt = et[0];
      if (rt === 'p' || rt === 'P') {
        const at = longFormatters[rt];
        return at(et, i.formatLong);
      }
      return et;
    })
    .join('')
    .match(formattingTokensRegExp)
    .map((et) => {
      if (et === "''") return { isToken: !1, value: "'" };
      const rt = et[0];
      if (rt === "'") return { isToken: !1, value: cleanEscapedString(et) };
      if (formatters[rt]) return { isToken: !0, value: et };
      if (rt.match(unescapedLatinCharacterRegExp))
        throw new RangeError(
          'Format string contains an unescaped latin alphabet character `' +
            rt +
            '`'
        );
      return { isToken: !1, value: et };
    });
  i.localize.preprocessor && (b = i.localize.preprocessor(h, b));
  const g = { firstWeekContainsDate: c, weekStartsOn: d, locale: i };
  return b
    .map((et) => {
      if (!et.isToken) return et.value;
      const rt = et.value;
      ((!(a != null && a.useAdditionalWeekYearTokens) &&
        isProtectedWeekYearToken(rt)) ||
        (!(a != null && a.useAdditionalDayOfYearTokens) &&
          isProtectedDayOfYearToken(rt))) &&
        warnOrThrowProtectedError(rt, o, String(e));
      const at = formatters[rt[0]];
      return at(h, rt, i.localize, g);
    })
    .join('');
}
function cleanEscapedString(e) {
  const o = e.match(escapedStringRegExp);
  return o ? o[1].replace(doubleQuoteRegExp, "'") : e;
}
/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const toKebabCase = (e) =>
    e.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(),
  toCamelCase = (e) =>
    e.replace(/^([A-Z])|[\s-_]+(\w)/g, (o, a, s) =>
      s ? s.toUpperCase() : a.toLowerCase()
    ),
  toPascalCase = (e) => {
    const o = toCamelCase(e);
    return o.charAt(0).toUpperCase() + o.slice(1);
  },
  mergeClasses = (...e) =>
    e
      .filter((o, a, s) => !!o && o.trim() !== '' && s.indexOf(o) === a)
      .join(' ')
      .trim(),
  hasA11yProp = (e) => {
    for (const o in e)
      if (o.startsWith('aria-') || o === 'role' || o === 'title') return !0;
  };
/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var defaultAttributes = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};
/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Icon = reactExports.forwardRef(
  (
    {
      color: e = 'currentColor',
      size: o = 24,
      strokeWidth: a = 2,
      absoluteStrokeWidth: s,
      className: i = '',
      children: c,
      iconNode: d,
      ...h
    },
    b
  ) =>
    reactExports.createElement(
      'svg',
      {
        ref: b,
        ...defaultAttributes,
        width: o,
        height: o,
        stroke: e,
        strokeWidth: s ? (Number(a) * 24) / Number(o) : a,
        className: mergeClasses('lucide', i),
        ...(!c && !hasA11yProp(h) && { 'aria-hidden': 'true' }),
        ...h,
      },
      [
        ...d.map(([g, $]) => reactExports.createElement(g, $)),
        ...(Array.isArray(c) ? c : [c]),
      ]
    )
);
/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const createLucideIcon = (e, o) => {
  const a = reactExports.forwardRef(({ className: s, ...i }, c) =>
    reactExports.createElement(Icon, {
      ref: c,
      iconNode: o,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(e))}`,
        `lucide-${e}`,
        s
      ),
      ...i,
    })
  );
  return ((a.displayName = toPascalCase(e)), a);
};
/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const __iconNode$9 = [
    ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
    ['line', { x1: '12', x2: '12', y1: '8', y2: '12', key: '1pkeuh' }],
    ['line', { x1: '12', x2: '12.01', y1: '16', y2: '16', key: '4dfq90' }],
  ],
  CircleAlert = createLucideIcon('circle-alert', __iconNode$9);
/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const __iconNode$8 = [
    ['path', { d: 'M21.801 10A10 10 0 1 1 17 3.335', key: 'yps3ct' }],
    ['path', { d: 'm9 11 3 3L22 4', key: '1pflzl' }],
  ],
  CircleCheckBig = createLucideIcon('circle-check-big', __iconNode$8);
/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const __iconNode$7 = [
    ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
    ['path', { d: 'm15 9-6 6', key: '1uzhvr' }],
    ['path', { d: 'm9 9 6 6', key: 'z0biqf' }],
  ],
  CircleX = createLucideIcon('circle-x', __iconNode$7);
/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const __iconNode$6 = [
    ['path', { d: 'M12 15V3', key: 'm9g1x1' }],
    ['path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', key: 'ih7n3h' }],
    ['path', { d: 'm7 10 5 5 5-5', key: 'brsn70' }],
  ],
  Download = createLucideIcon('download', __iconNode$6);
/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const __iconNode$5 = [
    [
      'path',
      {
        d: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z',
        key: '1rqfz7',
      },
    ],
    ['path', { d: 'M14 2v4a2 2 0 0 0 2 2h4', key: 'tnqrlb' }],
    ['circle', { cx: '10', cy: '12', r: '2', key: '737tya' }],
    [
      'path',
      { d: 'm20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22', key: 'wt3hpn' },
    ],
  ],
  FileImage = createLucideIcon('file-image', __iconNode$5);
/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const __iconNode$4 = [
    [
      'path',
      {
        d: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z',
        key: '1rqfz7',
      },
    ],
    ['path', { d: 'M14 2v4a2 2 0 0 0 2 2h4', key: 'tnqrlb' }],
    ['path', { d: 'M10 9H8', key: 'b1mrlr' }],
    ['path', { d: 'M16 13H8', key: 't4e002' }],
    ['path', { d: 'M16 17H8', key: 'z1uh3a' }],
  ],
  FileText = createLucideIcon('file-text', __iconNode$4);
/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const __iconNode$3 = [
    [
      'path',
      {
        d: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z',
        key: '1rqfz7',
      },
    ],
    ['path', { d: 'M14 2v4a2 2 0 0 0 2 2h4', key: 'tnqrlb' }],
  ],
  File$1 = createLucideIcon('file', __iconNode$3);
/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const __iconNode$2 = [
    ['path', { d: 'M21 12a9 9 0 1 1-6.219-8.56', key: '13zald' }],
  ],
  LoaderCircle = createLucideIcon('loader-circle', __iconNode$2);
/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const __iconNode$1 = [
    [
      'path',
      {
        d: 'M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8',
        key: 'v9h5vc',
      },
    ],
    ['path', { d: 'M21 3v5h-5', key: '1q7to0' }],
    [
      'path',
      {
        d: 'M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16',
        key: '3uifl3',
      },
    ],
    ['path', { d: 'M8 16H3v5', key: '1cv678' }],
  ],
  RefreshCw = createLucideIcon('refresh-cw', __iconNode$1);
/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const __iconNode = [
    [
      'path',
      {
        d: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
        key: 'oel41y',
      },
    ],
  ],
  Shield = createLucideIcon('shield', __iconNode);
function __insertCSS(e) {
  if (!e || typeof document > 'u') return;
  let o = document.head || document.getElementsByTagName('head')[0],
    a = document.createElement('style');
  ((a.type = 'text/css'),
    o.appendChild(a),
    a.styleSheet
      ? (a.styleSheet.cssText = e)
      : a.appendChild(document.createTextNode(e)));
}
Array(12).fill(0);
let toastsCounter = 1;
class Observer {
  constructor() {
    ((this.subscribe = (o) => (
      this.subscribers.push(o),
      () => {
        const a = this.subscribers.indexOf(o);
        this.subscribers.splice(a, 1);
      }
    )),
      (this.publish = (o) => {
        this.subscribers.forEach((a) => a(o));
      }),
      (this.addToast = (o) => {
        (this.publish(o), (this.toasts = [...this.toasts, o]));
      }),
      (this.create = (o) => {
        var a;
        const { message: s, ...i } = o,
          c =
            typeof (o == null ? void 0 : o.id) == 'number' ||
            ((a = o.id) == null ? void 0 : a.length) > 0
              ? o.id
              : toastsCounter++,
          d = this.toasts.find((b) => b.id === c),
          h = o.dismissible === void 0 ? !0 : o.dismissible;
        return (
          this.dismissedToasts.has(c) && this.dismissedToasts.delete(c),
          d
            ? (this.toasts = this.toasts.map((b) =>
                b.id === c
                  ? (this.publish({ ...b, ...o, id: c, title: s }),
                    { ...b, ...o, id: c, dismissible: h, title: s })
                  : b
              ))
            : this.addToast({ title: s, ...i, dismissible: h, id: c }),
          c
        );
      }),
      (this.dismiss = (o) => (
        o
          ? (this.dismissedToasts.add(o),
            requestAnimationFrame(() =>
              this.subscribers.forEach((a) => a({ id: o, dismiss: !0 }))
            ))
          : this.toasts.forEach((a) => {
              this.subscribers.forEach((s) => s({ id: a.id, dismiss: !0 }));
            }),
        o
      )),
      (this.message = (o, a) => this.create({ ...a, message: o })),
      (this.error = (o, a) => this.create({ ...a, message: o, type: 'error' })),
      (this.success = (o, a) =>
        this.create({ ...a, type: 'success', message: o })),
      (this.info = (o, a) => this.create({ ...a, type: 'info', message: o })),
      (this.warning = (o, a) =>
        this.create({ ...a, type: 'warning', message: o })),
      (this.loading = (o, a) =>
        this.create({ ...a, type: 'loading', message: o })),
      (this.promise = (o, a) => {
        if (!a) return;
        let s;
        a.loading !== void 0 &&
          (s = this.create({
            ...a,
            promise: o,
            type: 'loading',
            message: a.loading,
            description:
              typeof a.description != 'function' ? a.description : void 0,
          }));
        const i = Promise.resolve(o instanceof Function ? o() : o);
        let c = s !== void 0,
          d;
        const h = i
            .then(async (g) => {
              if (((d = ['resolve', g]), React.isValidElement(g)))
                ((c = !1), this.create({ id: s, type: 'default', message: g }));
              else if (isHttpResponse(g) && !g.ok) {
                c = !1;
                const _ =
                    typeof a.error == 'function'
                      ? await a.error(`HTTP error! status: ${g.status}`)
                      : a.error,
                  _e =
                    typeof a.description == 'function'
                      ? await a.description(`HTTP error! status: ${g.status}`)
                      : a.description,
                  j =
                    typeof _ == 'object' && !React.isValidElement(_)
                      ? _
                      : { message: _ };
                this.create({ id: s, type: 'error', description: _e, ...j });
              } else if (g instanceof Error) {
                c = !1;
                const _ =
                    typeof a.error == 'function' ? await a.error(g) : a.error,
                  _e =
                    typeof a.description == 'function'
                      ? await a.description(g)
                      : a.description,
                  j =
                    typeof _ == 'object' && !React.isValidElement(_)
                      ? _
                      : { message: _ };
                this.create({ id: s, type: 'error', description: _e, ...j });
              } else if (a.success !== void 0) {
                c = !1;
                const _ =
                    typeof a.success == 'function'
                      ? await a.success(g)
                      : a.success,
                  _e =
                    typeof a.description == 'function'
                      ? await a.description(g)
                      : a.description,
                  j =
                    typeof _ == 'object' && !React.isValidElement(_)
                      ? _
                      : { message: _ };
                this.create({ id: s, type: 'success', description: _e, ...j });
              }
            })
            .catch(async (g) => {
              if (((d = ['reject', g]), a.error !== void 0)) {
                c = !1;
                const $ =
                    typeof a.error == 'function' ? await a.error(g) : a.error,
                  _ =
                    typeof a.description == 'function'
                      ? await a.description(g)
                      : a.description,
                  ot =
                    typeof $ == 'object' && !React.isValidElement($)
                      ? $
                      : { message: $ };
                this.create({ id: s, type: 'error', description: _, ...ot });
              }
            })
            .finally(() => {
              (c && (this.dismiss(s), (s = void 0)),
                a.finally == null || a.finally.call(a));
            }),
          b = () =>
            new Promise((g, $) =>
              h.then(() => (d[0] === 'reject' ? $(d[1]) : g(d[1]))).catch($)
            );
        return typeof s != 'string' && typeof s != 'number'
          ? { unwrap: b }
          : Object.assign(s, { unwrap: b });
      }),
      (this.custom = (o, a) => {
        const s = (a == null ? void 0 : a.id) || toastsCounter++;
        return (this.create({ jsx: o(s), id: s, ...a }), s);
      }),
      (this.getActiveToasts = () =>
        this.toasts.filter((o) => !this.dismissedToasts.has(o.id))),
      (this.subscribers = []),
      (this.toasts = []),
      (this.dismissedToasts = new Set()));
  }
}
const ToastState = new Observer(),
  toastFunction = (e, o) => {
    const a = (o == null ? void 0 : o.id) || toastsCounter++;
    return (ToastState.addToast({ title: e, ...o, id: a }), a);
  },
  isHttpResponse = (e) =>
    e &&
    typeof e == 'object' &&
    'ok' in e &&
    typeof e.ok == 'boolean' &&
    'status' in e &&
    typeof e.status == 'number',
  basicToast = toastFunction,
  getHistory = () => ToastState.toasts,
  getToasts = () => ToastState.getActiveToasts(),
  toast = Object.assign(
    basicToast,
    {
      success: ToastState.success,
      info: ToastState.info,
      warning: ToastState.warning,
      error: ToastState.error,
      custom: ToastState.custom,
      message: ToastState.message,
      promise: ToastState.promise,
      dismiss: ToastState.dismiss,
      loading: ToastState.loading,
    },
    { getHistory, getToasts }
  );
__insertCSS(
  "[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}"
);
var PROGRESS_NAME = 'Progress',
  DEFAULT_MAX = 100,
  [createProgressContext, createProgressScope] =
    createContextScope(PROGRESS_NAME),
  [ProgressProvider, useProgressContext] = createProgressContext(PROGRESS_NAME),
  Progress$1 = reactExports.forwardRef((e, o) => {
    const {
      __scopeProgress: a,
      value: s = null,
      max: i,
      getValueLabel: c = defaultGetValueLabel,
      ...d
    } = e;
    (i || i === 0) &&
      !isValidMaxNumber(i) &&
      console.error(getInvalidMaxError(`${i}`, 'Progress'));
    const h = isValidMaxNumber(i) ? i : DEFAULT_MAX;
    s !== null &&
      !isValidValueNumber(s, h) &&
      console.error(getInvalidValueError(`${s}`, 'Progress'));
    const b = isValidValueNumber(s, h) ? s : null,
      g = isNumber(b) ? c(b, h) : void 0;
    return jsxRuntimeExports.jsx(ProgressProvider, {
      scope: a,
      value: b,
      max: h,
      children: jsxRuntimeExports.jsx(Primitive.div, {
        'aria-valuemax': h,
        'aria-valuemin': 0,
        'aria-valuenow': isNumber(b) ? b : void 0,
        'aria-valuetext': g,
        role: 'progressbar',
        'data-state': getProgressState(b, h),
        'data-value': b ?? void 0,
        'data-max': h,
        ...d,
        ref: o,
      }),
    });
  });
Progress$1.displayName = PROGRESS_NAME;
var INDICATOR_NAME = 'ProgressIndicator',
  ProgressIndicator = reactExports.forwardRef((e, o) => {
    const { __scopeProgress: a, ...s } = e,
      i = useProgressContext(INDICATOR_NAME, a);
    return jsxRuntimeExports.jsx(Primitive.div, {
      'data-state': getProgressState(i.value, i.max),
      'data-value': i.value ?? void 0,
      'data-max': i.max,
      ...s,
      ref: o,
    });
  });
ProgressIndicator.displayName = INDICATOR_NAME;
function defaultGetValueLabel(e, o) {
  return `${Math.round((e / o) * 100)}%`;
}
function getProgressState(e, o) {
  return e == null ? 'indeterminate' : e === o ? 'complete' : 'loading';
}
function isNumber(e) {
  return typeof e == 'number';
}
function isValidMaxNumber(e) {
  return isNumber(e) && !isNaN(e) && e > 0;
}
function isValidValueNumber(e, o) {
  return isNumber(e) && !isNaN(e) && e <= o && e >= 0;
}
function getInvalidMaxError(e, o) {
  return `Invalid prop \`max\` of value \`${e}\` supplied to \`${o}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${DEFAULT_MAX}\`.`;
}
function getInvalidValueError(e, o) {
  return `Invalid prop \`value\` of value \`${e}\` supplied to \`${o}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${DEFAULT_MAX} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`;
}
var Root = Progress$1,
  Indicator = ProgressIndicator;
const Progress = reactExports.forwardRef(
  ({ className: e, value: o, ...a }, s) =>
    jsxRuntimeExports.jsx(Root, {
      ref: s,
      className: cn(
        'relative h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800',
        e
      ),
      ...a,
      children: jsxRuntimeExports.jsx(Indicator, {
        className:
          'h-full w-full flex-1 bg-primary transition-all duration-300 ease-in-out',
        style: { transform: `translateX(-${100 - (o || 0)}%)` },
      }),
    })
);
Progress.displayName = Root.displayName;
const DocumentViewer = ({
    exportId: e,
    documentType: o,
    documentMetadata: a,
    className: s,
    onVerificationComplete: i,
  }) => {
    const [c, d] = reactExports.useState('idle'),
      [h, b] = reactExports.useState(null),
      [g, $] = reactExports.useState(null),
      [_, _e] = reactExports.useState(!1),
      [ot, j] = reactExports.useState(!1),
      [nt, lt] = reactExports.useState(0),
      [tt, et] = reactExports.useState(null);
    (reactExports.useEffect(() => {
      rt();
    }, [a]),
      reactExports.useEffect(
        () => () => {
          tt && URL.revokeObjectURL(tt);
        },
        [tt]
      ));
    const rt = async () => {
        if (!(!(a != null && a.cid) || !(a != null && a.hash))) {
          (d('verifying'), $(null));
          try {
            const gt = toast.loading('Verifying document...'),
              yt = {
                isValid: !0,
                timestamp: new Date().toISOString(),
                verifiedBy: 'Blockchain',
                documentHash: a.hash,
                blockHash:
                  '0x' +
                  Array(64)
                    .fill(0)
                    .map(() => Math.floor(Math.random() * 16).toString(16))
                    .join(''),
              };
            (b(yt),
              d('verified'),
              toast.success('Document verified successfully', { id: gt }),
              i == null || i(yt));
          } catch (gt) {
            (console.error('Verification error:', gt),
              d('error'),
              $(gt instanceof Error ? gt.message : 'Verification failed'),
              toast.error('Failed to verify document'));
          }
        }
      },
      at = async () => {
        if (a != null && a.cid) {
          (j(!0), lt(0));
          try {
            const gt = toast.loading('Preparing download...'),
              yt = (_t) => {
                lt(_t);
              },
              Ct = await downloadFromIPFS(a.cid, {
                onProgress: yt,
                ...(a.encrypted && { iv: a.iv, key: a.key }),
              }),
              At = URL.createObjectURL(Ct),
              wt = document.createElement('a');
            ((wt.href = At),
              (wt.download =
                a.originalName || `document-${a.cid.substring(0, 8)}`),
              document.body.appendChild(wt),
              wt.click(),
              document.body.removeChild(wt),
              URL.revokeObjectURL(At),
              toast.success('Download started', { id: gt }));
          } catch (gt) {
            (console.error('Download error:', gt),
              toast.error('Failed to download document'));
          } finally {
            (j(!1), lt(0));
          }
        }
      },
      ct = async () => {
        var gt;
        if (a != null && a.cid) {
          if (tt) {
            window.open(tt, '_blank');
            return;
          }
          _e(!0);
          try {
            const yt = toast.loading('Loading preview...'),
              Ct = await downloadFromIPFS(
                a.cid,
                a.encrypted ? { iv: a.iv, key: a.key } : void 0
              ),
              At = URL.createObjectURL(Ct);
            et(At);
            const wt = window.open('', '_blank');
            (wt &&
              wt.document &&
              (wt.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${a.name || 'Document Preview'}</title>
              <style>
                body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f5f5f5; }
                img, iframe { max-width: 100%; max-height: 90vh; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              </style>
            </head>
            <body>
              ${(gt = a.contentType) != null && gt.startsWith('image/') ? `<img src="${At}" alt="${a.name || 'Document'}" />` : `<iframe src="${At}" width="100%" height="100%" style="border: none;"></iframe>`}
            </body>
          </html>
        `),
              wt.document.close()),
              toast.dismiss(yt));
          } catch (yt) {
            (console.error('Preview error:', yt),
              toast.error('Failed to load preview'));
          } finally {
            _e(!1);
          }
        }
      },
      dt = (gt) => {
        if (!gt) return jsxRuntimeExports.jsx(File$1, { className: 'h-4 w-4' });
        if (gt.startsWith('image/'))
          return jsxRuntimeExports.jsx(FileImage, { className: 'h-4 w-4' });
        switch (gt) {
          case 'application/pdf':
            return jsxRuntimeExports.jsx(FileText, { className: 'h-4 w-4' });
          case 'text/plain':
          case 'text/csv':
            return jsxRuntimeExports.jsx(FileText, { className: 'h-4 w-4' });
          default:
            return jsxRuntimeExports.jsx(File$1, { className: 'h-4 w-4' });
        }
      },
      ut = (gt = 0) =>
        gt < 1024
          ? `${gt} B`
          : gt < 1024 * 1024
            ? `${(gt / 1024).toFixed(1)} KB`
            : gt < 1024 * 1024 * 1024
              ? `${(gt / (1024 * 1024)).toFixed(1)} MB`
              : `${(gt / (1024 * 1024 * 1024)).toFixed(1)} GB`,
      st = () => {
        switch (c) {
          case 'verifying':
            return jsxRuntimeExports.jsxs('div', {
              className: 'flex items-center text-yellow-600',
              children: [
                jsxRuntimeExports.jsx(LoaderCircle, {
                  className: 'h-4 w-4 animate-spin mr-2',
                }),
                jsxRuntimeExports.jsx('span', { children: 'Verifying...' }),
              ],
            });
          case 'verified':
            return jsxRuntimeExports.jsxs('div', {
              className: 'flex items-center text-green-600',
              children: [
                jsxRuntimeExports.jsx(CircleCheckBig, {
                  className: 'h-4 w-4 mr-2',
                }),
                jsxRuntimeExports.jsx('span', { children: 'Verified' }),
              ],
            });
          case 'verification_failed':
            return jsxRuntimeExports.jsxs('div', {
              className: 'flex items-center text-red-600',
              children: [
                jsxRuntimeExports.jsx(CircleX, { className: 'h-4 w-4 mr-2' }),
                jsxRuntimeExports.jsx('span', {
                  children: 'Verification Failed',
                }),
              ],
            });
          case 'error':
            return jsxRuntimeExports.jsxs('div', {
              className: 'flex items-center text-red-600',
              children: [
                jsxRuntimeExports.jsx(CircleAlert, {
                  className: 'h-4 w-4 mr-2',
                }),
                jsxRuntimeExports.jsx('span', { children: 'Error' }),
              ],
            });
          default:
            return jsxRuntimeExports.jsxs('div', {
              className: 'flex items-center text-gray-500',
              children: [
                jsxRuntimeExports.jsx(Shield, { className: 'h-4 w-4 mr-2' }),
                jsxRuntimeExports.jsx('span', { children: 'Not Verified' }),
              ],
            });
        }
      };
    return jsxRuntimeExports.jsxs('div', {
      className: cn('border rounded-lg p-6 bg-white shadow-sm', s),
      children: [
        jsxRuntimeExports.jsxs('div', {
          className: 'flex items-start justify-between mb-6',
          children: [
            jsxRuntimeExports.jsxs('div', {
              className: 'flex items-start space-x-4',
              children: [
                jsxRuntimeExports.jsx('div', {
                  className: 'p-3 bg-blue-50 rounded-lg',
                  children: dt((a == null ? void 0 : a.contentType) || ''),
                }),
                jsxRuntimeExports.jsxs('div', {
                  children: [
                    jsxRuntimeExports.jsx('h3', {
                      className: 'font-medium text-gray-900',
                      children:
                        (a == null ? void 0 : a.originalName) || 'Document',
                    }),
                    jsxRuntimeExports.jsxs('div', {
                      className: 'text-sm text-gray-500 mt-1',
                      children: [
                        (a == null ? void 0 : a.contentType) || 'Unknown type',
                        (a == null ? void 0 : a.size) && ` • ${ut(a.size)}`,
                      ],
                    }),
                    jsxRuntimeExports.jsx('div', {
                      className: 'mt-2',
                      children: st(),
                    }),
                  ],
                }),
              ],
            }),
            jsxRuntimeExports.jsxs('div', {
              className: 'flex space-x-2',
              children: [
                jsxRuntimeExports.jsx(Button, {
                  variant: 'outline',
                  size: 'sm',
                  onClick: ct,
                  disabled: _,
                  children: _
                    ? jsxRuntimeExports.jsx(LoaderCircle, {
                        className: 'h-4 w-4 animate-spin',
                      })
                    : 'Preview',
                }),
                jsxRuntimeExports.jsxs(Button, {
                  variant: 'default',
                  size: 'sm',
                  onClick: at,
                  disabled: ot,
                  children: [
                    ot
                      ? jsxRuntimeExports.jsx(LoaderCircle, {
                          className: 'h-4 w-4 animate-spin mr-2',
                        })
                      : jsxRuntimeExports.jsx(Download, {
                          className: 'h-4 w-4 mr-2',
                        }),
                    'Download',
                  ],
                }),
              ],
            }),
          ],
        }),
        ot &&
          jsxRuntimeExports.jsxs('div', {
            className: 'mt-4',
            children: [
              jsxRuntimeExports.jsx(Progress, { value: nt, className: 'h-2' }),
              jsxRuntimeExports.jsxs('div', {
                className: 'text-xs text-right text-gray-500 mt-1',
                children: [Math.round(nt), '% downloaded'],
              }),
            ],
          }),
        h &&
          jsxRuntimeExports.jsxs('div', {
            className: 'mt-6 pt-6 border-t',
            children: [
              jsxRuntimeExports.jsx('h4', {
                className: 'font-medium text-gray-900 mb-3',
                children: 'Verification Details',
              }),
              jsxRuntimeExports.jsxs('div', {
                className: 'grid grid-cols-2 gap-4 text-sm',
                children: [
                  jsxRuntimeExports.jsxs('div', {
                    children: [
                      jsxRuntimeExports.jsx('div', {
                        className: 'text-gray-500',
                        children: 'Status',
                      }),
                      jsxRuntimeExports.jsx('div', {
                        className: 'font-medium',
                        children: h.isValid ? 'Valid' : 'Invalid',
                      }),
                    ],
                  }),
                  jsxRuntimeExports.jsxs('div', {
                    children: [
                      jsxRuntimeExports.jsx('div', {
                        className: 'text-gray-500',
                        children: 'Verified By',
                      }),
                      jsxRuntimeExports.jsx('div', {
                        className: 'font-medium',
                        children: h.verifiedBy,
                      }),
                    ],
                  }),
                  jsxRuntimeExports.jsxs('div', {
                    children: [
                      jsxRuntimeExports.jsx('div', {
                        className: 'text-gray-500',
                        children: 'Document Hash',
                      }),
                      jsxRuntimeExports.jsx('div', {
                        className: 'font-mono text-xs truncate',
                        children: h.documentHash,
                      }),
                    ],
                  }),
                  jsxRuntimeExports.jsxs('div', {
                    children: [
                      jsxRuntimeExports.jsx('div', {
                        className: 'text-gray-500',
                        children: 'Block Hash',
                      }),
                      jsxRuntimeExports.jsx('div', {
                        className: 'font-mono text-xs truncate',
                        children: h.blockHash,
                      }),
                    ],
                  }),
                  jsxRuntimeExports.jsxs('div', {
                    children: [
                      jsxRuntimeExports.jsx('div', {
                        className: 'text-gray-500',
                        children: 'Timestamp',
                      }),
                      jsxRuntimeExports.jsx('div', {
                        className: 'font-medium',
                        children: h.timestamp
                          ? format(new Date(h.timestamp), 'PPpp')
                          : 'N/A',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        g &&
          jsxRuntimeExports.jsxs('div', {
            className: 'mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-md',
            children: [
              jsxRuntimeExports.jsxs('div', {
                className: 'flex items-center',
                children: [
                  jsxRuntimeExports.jsx(CircleAlert, {
                    className: 'h-4 w-4 mr-2 flex-shrink-0',
                  }),
                  jsxRuntimeExports.jsx('span', { children: g }),
                ],
              }),
              jsxRuntimeExports.jsxs('button', {
                onClick: rt,
                className:
                  'mt-2 text-sm text-red-700 hover:underline flex items-center',
                children: [
                  jsxRuntimeExports.jsx(RefreshCw, {
                    className: 'h-3 w-3 mr-1',
                  }),
                  'Retry Verification',
                ],
              }),
            ],
          }),
      ],
    });
  },
  ExportStatus = ({
    exportId: e,
    txHash: o,
    documents: a,
    approvals: s,
    isLoading: i = !1,
  }) => {
    const [c, d] = reactExports.useState('status'),
      h = Object.entries(a),
      b = (g) => {
        switch (g) {
          case 'APPROVED':
            return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
          case 'REJECTED':
            return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
          case 'VERIFIED':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
          default:
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
        }
      };
    return i
      ? jsxRuntimeExports.jsxs('div', {
          className: 'flex justify-center items-center p-8',
          children: [
            jsxRuntimeExports.jsx('div', {
              className:
                'animate-spin rounded-full h-12 w-12 border-b-2 border-primary',
            }),
            jsxRuntimeExports.jsx('span', {
              className: 'ml-3 text-lg',
              children: 'Loading export status...',
            }),
          ],
        })
      : jsxRuntimeExports.jsx('div', {
          className: 'space-y-6',
          children: jsxRuntimeExports.jsxs(Tabs, {
            value: c,
            onValueChange: (g) => d(g),
            className: 'space-y-6',
            children: [
              jsxRuntimeExports.jsxs(TabsList, {
                className: 'grid w-full grid-cols-2 max-w-md',
                children: [
                  jsxRuntimeExports.jsx(TabsTrigger, {
                    value: 'status',
                    children: 'Status',
                  }),
                  jsxRuntimeExports.jsx(TabsTrigger, {
                    value: 'documents',
                    children: 'Documents',
                  }),
                ],
              }),
              jsxRuntimeExports.jsxs(TabsContent, {
                value: 'status',
                className: 'space-y-6',
                children: [
                  jsxRuntimeExports.jsxs('div', {
                    className:
                      'bg-white dark:bg-gray-800 rounded-lg shadow p-6',
                    children: [
                      jsxRuntimeExports.jsx('h2', {
                        className: 'text-xl font-semibold mb-4',
                        children: 'Export Request Status',
                      }),
                      jsxRuntimeExports.jsxs('div', {
                        className: 'grid grid-cols-1 md:grid-cols-2 gap-4',
                        children: [
                          jsxRuntimeExports.jsxs('div', {
                            children: [
                              jsxRuntimeExports.jsx('h3', {
                                className:
                                  'text-sm font-medium text-gray-500 dark:text-gray-400',
                                children: 'Export ID',
                              }),
                              jsxRuntimeExports.jsx('p', {
                                className:
                                  'mt-1 text-sm text-gray-900 dark:text-gray-100',
                                children: e,
                              }),
                            ],
                          }),
                          jsxRuntimeExports.jsxs('div', {
                            children: [
                              jsxRuntimeExports.jsx('h3', {
                                className:
                                  'text-sm font-medium text-gray-500 dark:text-gray-400',
                                children: 'Transaction Hash',
                              }),
                              jsxRuntimeExports.jsx('p', {
                                className:
                                  'mt-1 text-sm font-mono text-gray-900 dark:text-gray-100 truncate',
                                children: o,
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  jsxRuntimeExports.jsxs('div', {
                    className:
                      'bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden',
                    children: [
                      jsxRuntimeExports.jsx('div', {
                        className:
                          'px-6 py-4 border-b border-gray-200 dark:border-gray-700',
                        children: jsxRuntimeExports.jsx('h3', {
                          className: 'text-lg font-medium',
                          children: 'Approval Status',
                        }),
                      }),
                      jsxRuntimeExports.jsx('div', {
                        className:
                          'divide-y divide-gray-200 dark:divide-gray-700',
                        children: s.map((g, $) =>
                          jsxRuntimeExports.jsxs(
                            'div',
                            {
                              className:
                                'px-6 py-4 flex items-center justify-between',
                              children: [
                                jsxRuntimeExports.jsxs('div', {
                                  children: [
                                    jsxRuntimeExports.jsx('h4', {
                                      className: 'text-sm font-medium',
                                      children: g.name,
                                    }),
                                    jsxRuntimeExports.jsx('p', {
                                      className:
                                        'text-sm text-muted-foreground',
                                      children: g.role,
                                    }),
                                    g.comment &&
                                      jsxRuntimeExports.jsxs('p', {
                                        className:
                                          'text-sm mt-1 text-muted-foreground',
                                        children: ['Note: ', g.comment],
                                      }),
                                  ],
                                }),
                                jsxRuntimeExports.jsxs('div', {
                                  className: 'flex flex-col items-end',
                                  children: [
                                    jsxRuntimeExports.jsx('span', {
                                      className: cn(
                                        'px-3 py-1 rounded-full text-xs font-medium',
                                        b(g.status)
                                      ),
                                      children: g.status,
                                    }),
                                    g.timestamp &&
                                      jsxRuntimeExports.jsx('span', {
                                        className:
                                          'mt-1 text-xs text-gray-500 dark:text-gray-400',
                                        children: new Date(
                                          g.timestamp
                                        ).toLocaleString(),
                                      }),
                                  ],
                                }),
                              ],
                            },
                            $
                          )
                        ),
                      }),
                    ],
                  }),
                ],
              }),
              jsxRuntimeExports.jsx(TabsContent, {
                value: 'documents',
                className: 'space-y-6',
                children: jsxRuntimeExports.jsxs('div', {
                  className: 'bg-white dark:bg-gray-800 rounded-lg shadow p-6',
                  children: [
                    jsxRuntimeExports.jsx('h2', {
                      className: 'text-xl font-semibold mb-6',
                      children: 'Export Documents',
                    }),
                    jsxRuntimeExports.jsx('div', {
                      className: 'space-y-4',
                      children: h.map(([g, $]) =>
                        jsxRuntimeExports.jsx(
                          DocumentViewer,
                          {
                            exportId: e,
                            documentType: g,
                            documentMetadata: {
                              cid: $.cid || '',
                              url: $.url || `https://ipfs.io/ipfs/${$.cid}`,
                              iv: $.iv || '',
                              key: $.key || '',
                              encrypted: !!$.encrypted,
                              contentType:
                                $.contentType || 'application/octet-stream',
                            },
                            className: 'w-full',
                          },
                          g
                        )
                      ),
                    }),
                  ],
                }),
              }),
            ],
          }),
        });
  },
  ExporterDetailsTab = reactExports.lazy(() =>
    __vitePreload(() => import('./ExporterDetailsTab-ee00adf9.js'), [])
  ),
  TradeDetailsTab = reactExports.lazy(() =>
    __vitePreload(() => import('./TradeDetailsTab-bb7141f4.js'), [])
  ),
  DocumentsTab = reactExports.lazy(() =>
    __vitePreload(() => import('./DocumentsTab-45b6eddb.js'), [])
  );
function ExportForm() {
  const [e, o] = reactExports.useState('exporter'),
    [a, s] = reactExports.useState({
      companyName: '',
      registrationNumber: '',
      taxId: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
    }),
    [i, c] = reactExports.useState({
      productName: '',
      productDescription: '',
      quantity: 0,
      unit: 'kg',
      unitPrice: 0,
      totalValue: 0,
      currency: 'USD',
      countryOfOrigin: '',
      destinationCountry: '',
      incoterms: 'FOB',
      shippingDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: '',
      paymentTerms: '30 days',
      paymentMethod: 'Bank Transfer',
      specialInstructions: '',
    }),
    [d, h] = reactExports.useState({
      license: {
        file: null,
        cid: null,
        url: null,
        iv: null,
        key: null,
        error: null,
        loading: !1,
        name: void 0,
        size: void 0,
        type: void 0,
      },
      invoice: {
        file: null,
        cid: null,
        url: null,
        iv: null,
        key: null,
        error: null,
        loading: !1,
        name: void 0,
        size: void 0,
        type: void 0,
      },
      qualityCert: {
        file: null,
        cid: null,
        url: null,
        iv: null,
        key: null,
        error: null,
        loading: !1,
        name: void 0,
        size: void 0,
        type: void 0,
      },
      other: {
        file: null,
        cid: null,
        url: null,
        iv: null,
        key: null,
        error: null,
        loading: !1,
        name: void 0,
        size: void 0,
        type: void 0,
      },
    }),
    [b, g] = reactExports.useState(null),
    [$, _] = reactExports.useState(null),
    { submitExport: _e, status: ot } = useExport(),
    j = (wt) => {
      const { name: _t, value: kt } = wt.target;
      s((St) => ({ ...St, [_t]: kt }));
    },
    nt = (wt) => {
      const { name: _t, value: kt, type: St } = wt.target;
      c((Pt) => {
        const xt = St === 'number' ? (kt === '' ? 0 : Number(kt)) : kt,
          vt = { ...Pt, [_t]: xt };
        return (
          (_t === 'quantity' || _t === 'unitPrice') &&
            (vt.totalValue = vt.quantity * vt.unitPrice),
          vt
        );
      });
    },
    lt = () =>
      a.companyName &&
      a.registrationNumber &&
      a.contactPerson &&
      a.email &&
      a.phone &&
      a.address &&
      a.city &&
      a.country &&
      a.postalCode,
    tt = () =>
      i.productName &&
      i.quantity > 0 &&
      i.unitPrice > 0 &&
      i.countryOfOrigin &&
      i.destinationCountry &&
      i.shippingDate &&
      i.expectedDeliveryDate,
    et = () => {
      e === 'exporter' && lt()
        ? o('trade')
        : e === 'trade' && tt() && o('documents');
    },
    rt = () => {
      e === 'trade' ? o('exporter') : e === 'documents' && o('trade');
    },
    at = (wt, _t) => {
      h((kt) => ({ ...kt, [wt]: { ...kt[wt], ..._t, loading: !1 } }));
    },
    ct = reactExports.useCallback((wt, _t) => {
      h((kt) => ({
        ...kt,
        [wt]: {
          ...kt[wt],
          file: null,
          cid: null,
          url: null,
          iv: null,
          key: null,
          error: _t,
        },
      }));
    }, []),
    { approvals: dt, loading: ut } = useExportApprovals(
      ($ == null ? void 0 : $.exportId) || null
    ),
    st = Object.values(d).every((wt) => wt.cid !== null),
    gt = async (wt) => {
      if ((wt.preventDefault(), g(null), !st)) {
        g('Please complete all required fields');
        return;
      }
      try {
        const _t = Object.entries(d)
            .filter(([, St]) => St.file)
            .map(([St, Pt]) => ({
              file: Pt.file,
              type: St,
              metadata: {
                hash: '',
                ipfsCid: Pt.cid,
                ipfsUrl: Pt.url,
                iv: Pt.iv,
                encrypted: !!Pt.key,
                contentType: Pt.file.type,
                size: Pt.file.size,
              },
            })),
          kt = await _e(_t, a.registrationNumber);
        (console.log('Export submitted successfully:', kt),
          _({
            exportId: kt.exportId,
            txHash: kt.txHash,
            documents: Object.entries(d).reduce(
              (St, [Pt, xt]) => (
                xt.cid && (St[Pt] = { name: xt.name || At(Pt), hash: xt.cid }),
                St
              ),
              {}
            ),
          }));
      } catch (_t) {
        (console.error('Error submitting export:', _t),
          g(_t instanceof Error ? _t.message : 'Failed to submit export'));
      }
    },
    yt = () => {
      (h({
        license: {
          file: null,
          cid: null,
          url: null,
          iv: null,
          key: null,
          error: null,
          loading: !1,
          name: void 0,
          size: void 0,
          type: void 0,
        },
        invoice: {
          file: null,
          cid: null,
          url: null,
          iv: null,
          key: null,
          error: null,
          loading: !1,
          name: void 0,
          size: void 0,
          type: void 0,
        },
        qualityCert: {
          file: null,
          cid: null,
          url: null,
          iv: null,
          key: null,
          error: null,
          loading: !1,
          name: void 0,
          size: void 0,
          type: void 0,
        },
        other: {
          file: null,
          cid: null,
          url: null,
          iv: null,
          key: null,
          error: null,
          loading: !1,
          name: void 0,
          size: void 0,
          type: void 0,
        },
      }),
        g(null));
    },
    Ct = () => {
      (_(null),
        g(null),
        h({
          license: {
            file: null,
            cid: null,
            url: null,
            iv: null,
            key: null,
            error: null,
            loading: !1,
            name: void 0,
            size: void 0,
            type: void 0,
          },
          invoice: {
            file: null,
            cid: null,
            url: null,
            iv: null,
            key: null,
            error: null,
            loading: !1,
            name: void 0,
            size: void 0,
            type: void 0,
          },
          qualityCert: {
            file: null,
            cid: null,
            url: null,
            iv: null,
            key: null,
            error: null,
            loading: !1,
            name: void 0,
            size: void 0,
            type: void 0,
          },
          other: {
            file: null,
            cid: null,
            url: null,
            iv: null,
            key: null,
            error: null,
            loading: !1,
            name: void 0,
            size: void 0,
            type: void 0,
          },
        }));
    },
    At = (wt) =>
      ({
        license: 'Export License',
        invoice: 'Commercial Invoice',
        qualityCert: 'Quality Certificate',
        other: 'Other Documents',
      })[wt] || wt;
  return $
    ? jsxRuntimeExports.jsxs('div', {
        className: 'max-w-3xl mx-auto p-6',
        children: [
          jsxRuntimeExports.jsxs('div', {
            className:
              'mb-6 p-4 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg border border-green-200 dark:border-green-800',
            children: [
              jsxRuntimeExports.jsx('p', {
                className: 'font-medium',
                children: 'Export submitted successfully!',
              }),
              jsxRuntimeExports.jsxs('p', {
                className: 'text-sm mt-1',
                children: ['Transaction: ', $.txHash],
              }),
              ($ == null ? void 0 : $.txHash) &&
                jsxRuntimeExports.jsxs('div', {
                  className: 'mt-4 text-sm text-gray-500 dark:text-gray-400',
                  children: [
                    'Transaction: ',
                    jsxRuntimeExports.jsx('span', {
                      className:
                        'font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded',
                      children: $.txHash,
                    }),
                    jsxRuntimeExports.jsx('button', {
                      onClick: () =>
                        navigator.clipboard.writeText($.txHash || ''),
                      className:
                        'ml-2 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300',
                      title: 'Copy to clipboard',
                      children: '📋',
                    }),
                  ],
                }),
            ],
          }),
          jsxRuntimeExports.jsx(ExportStatus, {
            exportId: $.exportId,
            txHash: $.txHash,
            documents: $.documents,
            approvals: dt,
            isLoading: ut,
          }),
          jsxRuntimeExports.jsx('div', {
            className: 'mt-6 flex justify-end',
            children: jsxRuntimeExports.jsx('button', {
              onClick: Ct,
              className:
                'px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors',
              children: 'Submit Another Export',
            }),
          }),
        ],
      })
    : jsxRuntimeExports.jsxs('div', {
        className:
          'max-w-4xl mx-auto p-6 bg-card text-card-foreground rounded-lg shadow',
        children: [
          jsxRuntimeExports.jsxs('div', {
            className: 'space-y-4 mb-8 text-center',
            children: [
              jsxRuntimeExports.jsx('h1', {
                className: 'text-3xl font-bold text-foreground',
                children: 'Export Documentation',
              }),
              jsxRuntimeExports.jsx('p', {
                className: 'text-muted-foreground',
                children:
                  'Complete all required information for your export process',
              }),
            ],
          }),
          jsxRuntimeExports.jsxs('div', {
            className: 'mb-8',
            children: [
              jsxRuntimeExports.jsx('div', {
                className: 'flex justify-between mb-2',
                children: ['exporter', 'trade', 'documents'].map((wt, _t) => {
                  const kt =
                    wt === 'exporter' ||
                    (wt === 'trade' && lt()) ||
                    (wt === 'documents' && lt() && tt());
                  return jsxRuntimeExports.jsxs(
                    'div',
                    {
                      className: 'flex flex-col items-center flex-1',
                      children: [
                        jsxRuntimeExports.jsx('button', {
                          type: 'button',
                          onClick: () => {
                            kt && o(wt);
                          },
                          className: `w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${e === wt ? 'bg-primary text-white' : kt ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'bg-muted text-muted-foreground cursor-not-allowed'}`,
                          children: _t + 1,
                        }),
                        jsxRuntimeExports.jsx('span', {
                          className: `mt-2 text-sm font-medium ${e === wt ? 'text-foreground' : 'text-muted-foreground'}`,
                          children: wt.charAt(0).toUpperCase() + wt.slice(1),
                        }),
                      ],
                    },
                    wt
                  );
                }),
              }),
              jsxRuntimeExports.jsx('div', {
                className: 'h-1 bg-muted rounded-full',
                children: jsxRuntimeExports.jsx('div', {
                  className:
                    'h-full bg-primary rounded-full transition-all duration-300',
                  style: {
                    width:
                      e === 'exporter'
                        ? '16.66%'
                        : e === 'trade'
                          ? '50%'
                          : '83.33%',
                  },
                }),
              }),
            ],
          }),
          jsxRuntimeExports.jsxs('form', {
            onSubmit: gt,
            className: 'space-y-6',
            children: [
              b &&
                jsxRuntimeExports.jsx('div', {
                  className:
                    'p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500',
                  children: jsxRuntimeExports.jsx('p', {
                    className: 'text-red-700 dark:text-red-300',
                    children: b,
                  }),
                }),
              jsxRuntimeExports.jsxs(reactExports.Suspense, {
                fallback: jsxRuntimeExports.jsx('div', {
                  children: 'Loading...',
                }),
                children: [
                  e === 'exporter' &&
                    jsxRuntimeExports.jsx(ExporterDetailsTab, {
                      exporterDetails: a,
                      handleExporterDetailsChange: j,
                    }),
                  e === 'trade' &&
                    jsxRuntimeExports.jsx(TradeDetailsTab, {
                      tradeDetails: i,
                      handleTradeDetailsChange: nt,
                    }),
                  e === 'documents' &&
                    jsxRuntimeExports.jsx(DocumentsTab, {
                      documents: d,
                      handleDocumentChange: at,
                      handleDocumentError: ct,
                      getDocumentLabel: At,
                    }),
                ],
              }),
              jsxRuntimeExports.jsxs('div', {
                className: 'flex justify-between mt-8',
                children: [
                  jsxRuntimeExports.jsx('div', {
                    children:
                      e === 'trade' || e === 'documents'
                        ? jsxRuntimeExports.jsx('button', {
                            type: 'button',
                            onClick: rt,
                            className:
                              'px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50',
                            children: 'Previous',
                          })
                        : null,
                  }),
                  jsxRuntimeExports.jsxs('div', {
                    className: 'space-x-4',
                    children: [
                      jsxRuntimeExports.jsx('button', {
                        type: 'button',
                        onClick: yt,
                        className:
                          'px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50',
                        children: 'Reset',
                      }),
                      e === 'exporter' || e === 'trade'
                        ? jsxRuntimeExports.jsx('button', {
                            type: 'button',
                            onClick: et,
                            disabled:
                              (e === 'exporter' && !lt()) ||
                              (e === 'trade' && !tt()),
                            className: `px-4 py-2 rounded-md text-white ${(e === 'exporter' && lt()) || (e === 'trade' && tt()) ? 'bg-primary hover:bg-primary/90' : 'bg-gray-400 cursor-not-allowed'}`,
                            children: 'Next',
                          })
                        : jsxRuntimeExports.jsx('button', {
                            type: 'submit',
                            disabled: !st || ot === 'submitting',
                            className: `px-4 py-2 rounded-md text-white ${st && ot !== 'submitting' ? 'bg-primary hover:bg-primary/90' : 'bg-gray-400 cursor-not-allowed'}`,
                            children:
                              ot === 'submitting'
                                ? 'Submitting...'
                                : 'Submit Export',
                          }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      });
}
function App() {
  return jsxRuntimeExports.jsx('div', {
    className:
      'min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-dark-900 dark:to-dark-800 py-12 px-4 sm:px-6 lg:px-8',
    children: jsxRuntimeExports.jsxs('div', {
      className: 'max-w-4xl mx-auto',
      children: [
        jsxRuntimeExports.jsxs('header', {
          className: 'text-center mb-12',
          children: [
            jsxRuntimeExports.jsx('div', {
              className:
                'inline-block px-6 py-2 bg-gold-100 dark:bg-gold-900/20 rounded-full mb-4',
              children: jsxRuntimeExports.jsx('span', {
                className:
                  'text-sm font-semibold text-gold-800 dark:text-gold-400',
                children: 'BLOCKCHAIN SECURED',
              }),
            }),
            jsxRuntimeExports.jsx('h1', {
              className:
                'text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-gold-600 mb-4',
              children: 'Coffee Export Platform',
            }),
            jsxRuntimeExports.jsx('p', {
              className: 'text-lg text-muted-foreground max-w-2xl mx-auto',
              children:
                'Securely submit and validate your coffee export documents on the blockchain',
            }),
          ],
        }),
        jsxRuntimeExports.jsx('div', {
          className:
            'bg-white dark:bg-dark-800 rounded-2xl shadow-xl overflow-hidden border border-border',
          children: jsxRuntimeExports.jsxs('div', {
            className: 'p-6 sm:p-8',
            children: [
              jsxRuntimeExports.jsxs('div', {
                className: 'flex items-center justify-between mb-6',
                children: [
                  jsxRuntimeExports.jsx('h2', {
                    className: 'text-2xl font-bold text-foreground',
                    children: 'Document Submission',
                  }),
                  jsxRuntimeExports.jsxs('div', {
                    className: 'flex space-x-2',
                    children: [
                      jsxRuntimeExports.jsx('span', {
                        className: 'h-3 w-3 rounded-full bg-primary-500',
                      }),
                      jsxRuntimeExports.jsx('span', {
                        className: 'h-3 w-3 rounded-full bg-gold-500',
                      }),
                      jsxRuntimeExports.jsx('span', {
                        className: 'h-3 w-3 rounded-full bg-dark-500',
                      }),
                    ],
                  }),
                ],
              }),
              jsxRuntimeExports.jsx(ExportForm, {}),
            ],
          }),
        }),
        jsxRuntimeExports.jsxs('footer', {
          className: 'mt-12 text-center text-sm text-muted-foreground',
          children: [
            jsxRuntimeExports.jsxs('p', {
              children: [
                '© ',
                new Date().getFullYear(),
                ' Coffee Export Platform. All rights reserved.',
              ],
            }),
            jsxRuntimeExports.jsx('p', {
              className: 'mt-1',
              children: 'Powered by Hyperledger Fabric',
            }),
          ],
        }),
      ],
    }),
  });
}
const index = '';
client
  .createRoot(document.getElementById('root'))
  .render(
    jsxRuntimeExports.jsx(React.StrictMode, {
      children: jsxRuntimeExports.jsx(App, {}),
    })
  );
export {
  Button as B,
  FileText as F,
  LoaderCircle as L,
  createLucideIcon as c,
  generateEncryptionKey as g,
  jsxRuntimeExports as j,
  reactExports as r,
  uploadToIPFS as u,
  validateFile as v,
};
