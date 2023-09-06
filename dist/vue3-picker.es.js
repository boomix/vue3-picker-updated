import { ref, computed, watch, nextTick, defineComponent, openBlock, createElementBlock, Fragment, createVNode, Transition as Transition$1, withCtx, withDirectives, createElementVNode, unref, vShow, normalizeClass, normalizeStyle, toDisplayString, renderList, pushScopeId, popScopeId } from "vue";
/*!
 * better-scroll / core
 * (c) 2016-2023 ustbhuangyi
 * Released under the MIT License.
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
    d2.__proto__ = b2;
  } || function(d2, b2) {
    for (var p in b2)
      if (Object.prototype.hasOwnProperty.call(b2, p))
        d2[p] = b2[p];
  };
  return extendStatics(d, b);
};
function __extends(d, b) {
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function() {
  __assign = Object.assign || function __assign2(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++)
    s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
      r[k] = a[j];
  return r;
}
var propertiesConfig$1 = [
  {
    sourceKey: "scroller.scrollBehaviorX.currentPos",
    key: "x"
  },
  {
    sourceKey: "scroller.scrollBehaviorY.currentPos",
    key: "y"
  },
  {
    sourceKey: "scroller.scrollBehaviorX.hasScroll",
    key: "hasHorizontalScroll"
  },
  {
    sourceKey: "scroller.scrollBehaviorY.hasScroll",
    key: "hasVerticalScroll"
  },
  {
    sourceKey: "scroller.scrollBehaviorX.contentSize",
    key: "scrollerWidth"
  },
  {
    sourceKey: "scroller.scrollBehaviorY.contentSize",
    key: "scrollerHeight"
  },
  {
    sourceKey: "scroller.scrollBehaviorX.maxScrollPos",
    key: "maxScrollX"
  },
  {
    sourceKey: "scroller.scrollBehaviorY.maxScrollPos",
    key: "maxScrollY"
  },
  {
    sourceKey: "scroller.scrollBehaviorX.minScrollPos",
    key: "minScrollX"
  },
  {
    sourceKey: "scroller.scrollBehaviorY.minScrollPos",
    key: "minScrollY"
  },
  {
    sourceKey: "scroller.scrollBehaviorX.movingDirection",
    key: "movingDirectionX"
  },
  {
    sourceKey: "scroller.scrollBehaviorY.movingDirection",
    key: "movingDirectionY"
  },
  {
    sourceKey: "scroller.scrollBehaviorX.direction",
    key: "directionX"
  },
  {
    sourceKey: "scroller.scrollBehaviorY.direction",
    key: "directionY"
  },
  {
    sourceKey: "scroller.actions.enabled",
    key: "enabled"
  },
  {
    sourceKey: "scroller.animater.pending",
    key: "pending"
  },
  {
    sourceKey: "scroller.animater.stop",
    key: "stop"
  },
  {
    sourceKey: "scroller.scrollTo",
    key: "scrollTo"
  },
  {
    sourceKey: "scroller.scrollBy",
    key: "scrollBy"
  },
  {
    sourceKey: "scroller.scrollToElement",
    key: "scrollToElement"
  },
  {
    sourceKey: "scroller.resetPosition",
    key: "resetPosition"
  }
];
function warn(msg) {
  console.error("[BScroll warn]: " + msg);
}
var inBrowser$1 = typeof window !== "undefined";
var ua$1 = inBrowser$1 && navigator.userAgent.toLowerCase();
var isWeChatDevTools = !!(ua$1 && /wechatdevtools/.test(ua$1));
var isAndroid = ua$1 && ua$1.indexOf("android") > 0;
var isIOSBadVersion = function() {
  if (typeof ua$1 === "string") {
    var regex = /os (\d\d?_\d(_\d)?)/;
    var matches = regex.exec(ua$1);
    if (!matches)
      return false;
    var parts = matches[1].split("_").map(function(item) {
      return parseInt(item, 10);
    });
    return !!(parts[0] === 13 && parts[1] >= 4);
  }
  return false;
}();
var supportsPassive$1 = false;
if (inBrowser$1) {
  var EventName$1 = "test-passive";
  try {
    var opts$1 = {};
    Object.defineProperty(opts$1, "passive", {
      get: function() {
        supportsPassive$1 = true;
      }
    });
    window.addEventListener(EventName$1, function() {
    }, opts$1);
  } catch (e) {
  }
}
function getNow() {
  return window.performance && window.performance.now && window.performance.timing ? window.performance.now() + window.performance.timing.navigationStart : +new Date();
}
var extend$1 = function(target, source) {
  for (var key in source) {
    target[key] = source[key];
  }
  return target;
};
function isUndef(v) {
  return v === void 0 || v === null;
}
function between(x, min, max) {
  if (x < min) {
    return min;
  }
  if (x > max) {
    return max;
  }
  return x;
}
var elementStyle$1 = inBrowser$1 && document.createElement("div").style;
var vendor$1 = function() {
  if (!inBrowser$1) {
    return false;
  }
  var transformNames = [
    {
      key: "standard",
      value: "transform"
    },
    {
      key: "webkit",
      value: "webkitTransform"
    },
    {
      key: "Moz",
      value: "MozTransform"
    },
    {
      key: "O",
      value: "OTransform"
    },
    {
      key: "ms",
      value: "msTransform"
    }
  ];
  for (var _i = 0, transformNames_1 = transformNames; _i < transformNames_1.length; _i++) {
    var obj = transformNames_1[_i];
    if (elementStyle$1[obj.value] !== void 0) {
      return obj.key;
    }
  }
  return false;
}();
function prefixStyle$1(style2) {
  if (vendor$1 === false) {
    return style2;
  }
  if (vendor$1 === "standard") {
    if (style2 === "transitionEnd") {
      return "transitionend";
    }
    return style2;
  }
  return vendor$1 + style2.charAt(0).toUpperCase() + style2.substr(1);
}
function getElement(el) {
  return typeof el === "string" ? document.querySelector(el) : el;
}
function addEvent(el, type, fn, capture) {
  var useCapture = supportsPassive$1 ? {
    passive: false,
    capture: !!capture
  } : !!capture;
  el.addEventListener(type, fn, useCapture);
}
function removeEvent(el, type, fn, capture) {
  el.removeEventListener(type, fn, {
    capture: !!capture
  });
}
function maybePrevent(e) {
  if (e.cancelable) {
    e.preventDefault();
  }
}
function offset(el) {
  var left = 0;
  var top = 0;
  while (el) {
    left -= el.offsetLeft;
    top -= el.offsetTop;
    el = el.offsetParent;
  }
  return {
    left,
    top
  };
}
vendor$1 && vendor$1 !== "standard" ? "-" + vendor$1.toLowerCase() + "-" : "";
var transform$1 = prefixStyle$1("transform");
var transition$1 = prefixStyle$1("transition");
var hasPerspective = inBrowser$1 && prefixStyle$1("perspective") in elementStyle$1;
var hasTouch = inBrowser$1 && ("ontouchstart" in window || isWeChatDevTools);
var hasTransition = inBrowser$1 && transition$1 in elementStyle$1;
var style$1 = {
  transform: transform$1,
  transition: transition$1,
  transitionTimingFunction: prefixStyle$1("transitionTimingFunction"),
  transitionDuration: prefixStyle$1("transitionDuration"),
  transitionDelay: prefixStyle$1("transitionDelay"),
  transformOrigin: prefixStyle$1("transformOrigin"),
  transitionEnd: prefixStyle$1("transitionEnd"),
  transitionProperty: prefixStyle$1("transitionProperty")
};
var eventTypeMap = {
  touchstart: 1,
  touchmove: 1,
  touchend: 1,
  touchcancel: 1,
  mousedown: 2,
  mousemove: 2,
  mouseup: 2
};
function getRect(el) {
  if (el instanceof window.SVGElement) {
    var rect = el.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    };
  } else {
    return {
      top: el.offsetTop,
      left: el.offsetLeft,
      width: el.offsetWidth,
      height: el.offsetHeight
    };
  }
}
function preventDefaultExceptionFn(el, exceptions) {
  for (var i in exceptions) {
    if (exceptions[i].test(el[i])) {
      return true;
    }
  }
  return false;
}
var tagExceptionFn = preventDefaultExceptionFn;
function tap(e, eventName) {
  var ev = document.createEvent("Event");
  ev.initEvent(eventName, true, true);
  ev.pageX = e.pageX;
  ev.pageY = e.pageY;
  e.target.dispatchEvent(ev);
}
function click(e, event) {
  if (event === void 0) {
    event = "click";
  }
  var eventSource;
  if (e.type === "mouseup") {
    eventSource = e;
  } else if (e.type === "touchend" || e.type === "touchcancel") {
    eventSource = e.changedTouches[0];
  }
  var posSrc = {};
  if (eventSource) {
    posSrc.screenX = eventSource.screenX || 0;
    posSrc.screenY = eventSource.screenY || 0;
    posSrc.clientX = eventSource.clientX || 0;
    posSrc.clientY = eventSource.clientY || 0;
  }
  var ev;
  var bubbles = true;
  var cancelable = true;
  var ctrlKey = e.ctrlKey, shiftKey = e.shiftKey, altKey = e.altKey, metaKey = e.metaKey;
  var pressedKeysMap = {
    ctrlKey,
    shiftKey,
    altKey,
    metaKey
  };
  if (typeof MouseEvent !== "undefined") {
    try {
      ev = new MouseEvent(event, extend$1(__assign({
        bubbles,
        cancelable
      }, pressedKeysMap), posSrc));
    } catch (e2) {
      createEvent();
    }
  } else {
    createEvent();
  }
  function createEvent() {
    ev = document.createEvent("Event");
    ev.initEvent(event, bubbles, cancelable);
    extend$1(ev, posSrc);
  }
  ev.forwardedTouchEvent = true;
  ev._constructed = true;
  e.target.dispatchEvent(ev);
}
function dblclick(e) {
  click(e, "dblclick");
}
var ease$1 = {
  swipe: {
    style: "cubic-bezier(0.23, 1, 0.32, 1)",
    fn: function(t) {
      return 1 + --t * t * t * t * t;
    }
  },
  swipeBounce: {
    style: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    fn: function(t) {
      return t * (2 - t);
    }
  },
  bounce: {
    style: "cubic-bezier(0.165, 0.84, 0.44, 1)",
    fn: function(t) {
      return 1 - --t * t * t * t;
    }
  }
};
var DEFAULT_INTERVAL = 1e3 / 60;
var windowCompat = inBrowser$1 && window;
function noop$1() {
}
var requestAnimationFrame = function() {
  if (!inBrowser$1) {
    return noop$1;
  }
  return windowCompat.requestAnimationFrame || windowCompat.webkitRequestAnimationFrame || windowCompat.mozRequestAnimationFrame || windowCompat.oRequestAnimationFrame || function(callback) {
    return window.setTimeout(callback, callback.interval || DEFAULT_INTERVAL);
  };
}();
var cancelAnimationFrame = function() {
  if (!inBrowser$1) {
    return noop$1;
  }
  return windowCompat.cancelAnimationFrame || windowCompat.webkitCancelAnimationFrame || windowCompat.mozCancelAnimationFrame || windowCompat.oCancelAnimationFrame || function(id) {
    window.clearTimeout(id);
  };
}();
var noop = function(val) {
};
var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};
var getProperty = function(obj, key) {
  var keys = key.split(".");
  for (var i = 0; i < keys.length - 1; i++) {
    obj = obj[keys[i]];
    if (typeof obj !== "object" || !obj)
      return;
  }
  var lastKey = keys.pop();
  if (typeof obj[lastKey] === "function") {
    return function() {
      return obj[lastKey].apply(obj, arguments);
    };
  } else {
    return obj[lastKey];
  }
};
var setProperty = function(obj, key, value) {
  var keys = key.split(".");
  var temp;
  for (var i = 0; i < keys.length - 1; i++) {
    temp = keys[i];
    if (!obj[temp])
      obj[temp] = {};
    obj = obj[temp];
  }
  obj[keys.pop()] = value;
};
function propertiesProxy(target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return getProperty(this, sourceKey);
  };
  sharedPropertyDefinition.set = function proxySetter(val) {
    setProperty(this, sourceKey, val);
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}
var EventEmitter = function() {
  function EventEmitter2(names) {
    this.events = {};
    this.eventTypes = {};
    this.registerType(names);
  }
  EventEmitter2.prototype.on = function(type, fn, context) {
    if (context === void 0) {
      context = this;
    }
    this.hasType(type);
    if (!this.events[type]) {
      this.events[type] = [];
    }
    this.events[type].push([fn, context]);
    return this;
  };
  EventEmitter2.prototype.once = function(type, fn, context) {
    var _this = this;
    if (context === void 0) {
      context = this;
    }
    this.hasType(type);
    var magic = function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      _this.off(type, magic);
      var ret = fn.apply(context, args);
      if (ret === true) {
        return ret;
      }
    };
    magic.fn = fn;
    this.on(type, magic);
    return this;
  };
  EventEmitter2.prototype.off = function(type, fn) {
    if (!type && !fn) {
      this.events = {};
      return this;
    }
    if (type) {
      this.hasType(type);
      if (!fn) {
        this.events[type] = [];
        return this;
      }
      var events = this.events[type];
      if (!events) {
        return this;
      }
      var count = events.length;
      while (count--) {
        if (events[count][0] === fn || events[count][0] && events[count][0].fn === fn) {
          events.splice(count, 1);
        }
      }
      return this;
    }
  };
  EventEmitter2.prototype.trigger = function(type) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    this.hasType(type);
    var events = this.events[type];
    if (!events) {
      return;
    }
    var len = events.length;
    var eventsCopy = __spreadArrays(events);
    var ret;
    for (var i = 0; i < len; i++) {
      var event_1 = eventsCopy[i];
      var fn = event_1[0], context = event_1[1];
      if (fn) {
        ret = fn.apply(context, args);
        if (ret === true) {
          return ret;
        }
      }
    }
  };
  EventEmitter2.prototype.registerType = function(names) {
    var _this = this;
    names.forEach(function(type) {
      _this.eventTypes[type] = type;
    });
  };
  EventEmitter2.prototype.destroy = function() {
    this.events = {};
    this.eventTypes = {};
  };
  EventEmitter2.prototype.hasType = function(type) {
    var types = this.eventTypes;
    var isType = types[type] === type;
    if (!isType) {
      warn('EventEmitter has used unknown event type: "' + type + '", should be oneof [' + ("" + Object.keys(types).map(function(_) {
        return JSON.stringify(_);
      })) + "]");
    }
  };
  return EventEmitter2;
}();
var EventRegister = function() {
  function EventRegister2(wrapper, events) {
    this.wrapper = wrapper;
    this.events = events;
    this.addDOMEvents();
  }
  EventRegister2.prototype.destroy = function() {
    this.removeDOMEvents();
    this.events = [];
  };
  EventRegister2.prototype.addDOMEvents = function() {
    this.handleDOMEvents(addEvent);
  };
  EventRegister2.prototype.removeDOMEvents = function() {
    this.handleDOMEvents(removeEvent);
  };
  EventRegister2.prototype.handleDOMEvents = function(eventOperation) {
    var _this = this;
    var wrapper = this.wrapper;
    this.events.forEach(function(event) {
      eventOperation(wrapper, event.name, _this, !!event.capture);
    });
  };
  EventRegister2.prototype.handleEvent = function(e) {
    var eventType = e.type;
    this.events.some(function(event) {
      if (event.name === eventType) {
        event.handler(e);
        return true;
      }
      return false;
    });
  };
  return EventRegister2;
}();
var CustomOptions = function() {
  function CustomOptions2() {
  }
  return CustomOptions2;
}();
var OptionsConstructor = function(_super) {
  __extends(OptionsConstructor2, _super);
  function OptionsConstructor2() {
    var _this = _super.call(this) || this;
    _this.startX = 0;
    _this.startY = 0;
    _this.scrollX = false;
    _this.scrollY = true;
    _this.freeScroll = false;
    _this.directionLockThreshold = 0;
    _this.eventPassthrough = "";
    _this.click = false;
    _this.dblclick = false;
    _this.tap = "";
    _this.bounce = {
      top: true,
      bottom: true,
      left: true,
      right: true
    };
    _this.bounceTime = 800;
    _this.momentum = true;
    _this.momentumLimitTime = 300;
    _this.momentumLimitDistance = 15;
    _this.swipeTime = 2500;
    _this.swipeBounceTime = 500;
    _this.deceleration = 15e-4;
    _this.flickLimitTime = 200;
    _this.flickLimitDistance = 100;
    _this.resizePolling = 60;
    _this.probeType = 0;
    _this.stopPropagation = false;
    _this.preventDefault = true;
    _this.preventDefaultException = {
      tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO)$/
    };
    _this.tagException = {
      tagName: /^TEXTAREA$/
    };
    _this.HWCompositing = true;
    _this.useTransition = true;
    _this.bindToWrapper = false;
    _this.bindToTarget = false;
    _this.disableMouse = hasTouch;
    _this.disableTouch = !hasTouch;
    _this.autoBlur = true;
    _this.autoEndDistance = 5;
    _this.outOfBoundaryDampingFactor = 1 / 3;
    _this.specifiedIndexAsContent = 0;
    _this.quadrant = 1;
    return _this;
  }
  OptionsConstructor2.prototype.merge = function(options) {
    if (!options)
      return this;
    for (var key in options) {
      if (key === "bounce") {
        this.bounce = this.resolveBounce(options[key]);
        continue;
      }
      this[key] = options[key];
    }
    return this;
  };
  OptionsConstructor2.prototype.process = function() {
    this.translateZ = this.HWCompositing && hasPerspective ? " translateZ(1px)" : "";
    this.useTransition = this.useTransition && hasTransition;
    this.preventDefault = !this.eventPassthrough && this.preventDefault;
    this.scrollX = this.eventPassthrough === "horizontal" ? false : this.scrollX;
    this.scrollY = this.eventPassthrough === "vertical" ? false : this.scrollY;
    this.freeScroll = this.freeScroll && !this.eventPassthrough;
    this.scrollX = this.freeScroll ? true : this.scrollX;
    this.scrollY = this.freeScroll ? true : this.scrollY;
    this.directionLockThreshold = this.eventPassthrough ? 0 : this.directionLockThreshold;
    return this;
  };
  OptionsConstructor2.prototype.resolveBounce = function(bounceOptions) {
    var DEFAULT_BOUNCE = {
      top: true,
      right: true,
      bottom: true,
      left: true
    };
    var NEGATED_BOUNCE = {
      top: false,
      right: false,
      bottom: false,
      left: false
    };
    var ret;
    if (typeof bounceOptions === "object") {
      ret = extend$1(DEFAULT_BOUNCE, bounceOptions);
    } else {
      ret = bounceOptions ? DEFAULT_BOUNCE : NEGATED_BOUNCE;
    }
    return ret;
  };
  return OptionsConstructor2;
}(CustomOptions);
var ActionsHandler = function() {
  function ActionsHandler2(wrapper, options) {
    this.wrapper = wrapper;
    this.options = options;
    this.hooks = new EventEmitter([
      "beforeStart",
      "start",
      "move",
      "end",
      "click"
    ]);
    this.handleDOMEvents();
  }
  ActionsHandler2.prototype.handleDOMEvents = function() {
    var _a2 = this.options, bindToWrapper = _a2.bindToWrapper, disableMouse = _a2.disableMouse, disableTouch = _a2.disableTouch, click2 = _a2.click;
    var wrapper = this.wrapper;
    var target = bindToWrapper ? wrapper : window;
    var wrapperEvents = [];
    var targetEvents = [];
    var shouldRegisterTouch = !disableTouch;
    var shouldRegisterMouse = !disableMouse;
    if (click2) {
      wrapperEvents.push({
        name: "click",
        handler: this.click.bind(this),
        capture: true
      });
    }
    if (shouldRegisterTouch) {
      wrapperEvents.push({
        name: "touchstart",
        handler: this.start.bind(this)
      });
      targetEvents.push({
        name: "touchmove",
        handler: this.move.bind(this)
      }, {
        name: "touchend",
        handler: this.end.bind(this)
      }, {
        name: "touchcancel",
        handler: this.end.bind(this)
      });
    }
    if (shouldRegisterMouse) {
      wrapperEvents.push({
        name: "mousedown",
        handler: this.start.bind(this)
      });
      targetEvents.push({
        name: "mousemove",
        handler: this.move.bind(this)
      }, {
        name: "mouseup",
        handler: this.end.bind(this)
      });
    }
    this.wrapperEventRegister = new EventRegister(wrapper, wrapperEvents);
    this.targetEventRegister = new EventRegister(target, targetEvents);
  };
  ActionsHandler2.prototype.beforeHandler = function(e, type) {
    var _a2 = this.options, preventDefault = _a2.preventDefault, stopPropagation = _a2.stopPropagation, preventDefaultException = _a2.preventDefaultException;
    var preventDefaultConditions = {
      start: function() {
        return preventDefault && !preventDefaultExceptionFn(e.target, preventDefaultException);
      },
      end: function() {
        return preventDefault && !preventDefaultExceptionFn(e.target, preventDefaultException);
      },
      move: function() {
        return preventDefault;
      }
    };
    if (preventDefaultConditions[type]()) {
      e.preventDefault();
    }
    if (stopPropagation) {
      e.stopPropagation();
    }
  };
  ActionsHandler2.prototype.setInitiated = function(type) {
    if (type === void 0) {
      type = 0;
    }
    this.initiated = type;
  };
  ActionsHandler2.prototype.start = function(e) {
    var _eventType = eventTypeMap[e.type];
    if (this.initiated && this.initiated !== _eventType) {
      return;
    }
    this.setInitiated(_eventType);
    if (tagExceptionFn(e.target, this.options.tagException)) {
      this.setInitiated();
      return;
    }
    if (_eventType === 2 && e.button !== 0)
      return;
    if (this.hooks.trigger(this.hooks.eventTypes.beforeStart, e)) {
      return;
    }
    this.beforeHandler(e, "start");
    var point = e.touches ? e.touches[0] : e;
    this.pointX = point.pageX;
    this.pointY = point.pageY;
    this.hooks.trigger(this.hooks.eventTypes.start, e);
  };
  ActionsHandler2.prototype.move = function(e) {
    if (eventTypeMap[e.type] !== this.initiated) {
      return;
    }
    this.beforeHandler(e, "move");
    var point = e.touches ? e.touches[0] : e;
    var deltaX = point.pageX - this.pointX;
    var deltaY = point.pageY - this.pointY;
    this.pointX = point.pageX;
    this.pointY = point.pageY;
    if (this.hooks.trigger(this.hooks.eventTypes.move, {
      deltaX,
      deltaY,
      e
    })) {
      return;
    }
    var scrollLeft = document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft;
    var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    var pX = this.pointX - scrollLeft;
    var pY = this.pointY - scrollTop;
    var autoEndDistance = this.options.autoEndDistance;
    if (pX > document.documentElement.clientWidth - autoEndDistance || pY > document.documentElement.clientHeight - autoEndDistance || pX < autoEndDistance || pY < autoEndDistance) {
      this.end(e);
    }
  };
  ActionsHandler2.prototype.end = function(e) {
    if (eventTypeMap[e.type] !== this.initiated) {
      return;
    }
    this.setInitiated();
    this.beforeHandler(e, "end");
    this.hooks.trigger(this.hooks.eventTypes.end, e);
  };
  ActionsHandler2.prototype.click = function(e) {
    this.hooks.trigger(this.hooks.eventTypes.click, e);
  };
  ActionsHandler2.prototype.setContent = function(content) {
    if (content !== this.wrapper) {
      this.wrapper = content;
      this.rebindDOMEvents();
    }
  };
  ActionsHandler2.prototype.rebindDOMEvents = function() {
    this.wrapperEventRegister.destroy();
    this.targetEventRegister.destroy();
    this.handleDOMEvents();
  };
  ActionsHandler2.prototype.destroy = function() {
    this.wrapperEventRegister.destroy();
    this.targetEventRegister.destroy();
    this.hooks.destroy();
  };
  return ActionsHandler2;
}();
var translaterMetaData = {
  x: ["translateX", "px"],
  y: ["translateY", "px"]
};
var Translater = function() {
  function Translater2(content) {
    this.setContent(content);
    this.hooks = new EventEmitter(["beforeTranslate", "translate"]);
  }
  Translater2.prototype.getComputedPosition = function() {
    var cssStyle = window.getComputedStyle(this.content, null);
    var matrix = cssStyle[style$1.transform].split(")")[0].split(", ");
    var x = +(matrix[12] || matrix[4]) || 0;
    var y = +(matrix[13] || matrix[5]) || 0;
    return {
      x,
      y
    };
  };
  Translater2.prototype.translate = function(point) {
    var transformStyle = [];
    Object.keys(point).forEach(function(key) {
      if (!translaterMetaData[key]) {
        return;
      }
      var transformFnName = translaterMetaData[key][0];
      if (transformFnName) {
        var transformFnArgUnit = translaterMetaData[key][1];
        var transformFnArg = point[key];
        transformStyle.push(transformFnName + "(" + transformFnArg + transformFnArgUnit + ")");
      }
    });
    this.hooks.trigger(this.hooks.eventTypes.beforeTranslate, transformStyle, point);
    this.style[style$1.transform] = transformStyle.join(" ");
    this.hooks.trigger(this.hooks.eventTypes.translate, point);
  };
  Translater2.prototype.setContent = function(content) {
    if (this.content !== content) {
      this.content = content;
      this.style = content.style;
    }
  };
  Translater2.prototype.destroy = function() {
    this.hooks.destroy();
  };
  return Translater2;
}();
var Base = function() {
  function Base2(content, translater, options) {
    this.translater = translater;
    this.options = options;
    this.timer = 0;
    this.hooks = new EventEmitter([
      "move",
      "end",
      "beforeForceStop",
      "forceStop",
      "callStop",
      "time",
      "timeFunction"
    ]);
    this.setContent(content);
  }
  Base2.prototype.translate = function(endPoint) {
    this.translater.translate(endPoint);
  };
  Base2.prototype.setPending = function(pending) {
    this.pending = pending;
  };
  Base2.prototype.setForceStopped = function(forceStopped) {
    this.forceStopped = forceStopped;
  };
  Base2.prototype.setCallStop = function(called) {
    this.callStopWhenPending = called;
  };
  Base2.prototype.setContent = function(content) {
    if (this.content !== content) {
      this.content = content;
      this.style = content.style;
      this.stop();
    }
  };
  Base2.prototype.clearTimer = function() {
    if (this.timer) {
      cancelAnimationFrame(this.timer);
      this.timer = 0;
    }
  };
  Base2.prototype.destroy = function() {
    this.hooks.destroy();
    cancelAnimationFrame(this.timer);
  };
  return Base2;
}();
var isValidPostion = function(startPoint, endPoint, currentPos, prePos) {
  var computeDirection = function(endValue, startValue) {
    var delta = endValue - startValue;
    var direction = delta > 0 ? -1 : delta < 0 ? 1 : 0;
    return direction;
  };
  var directionX = computeDirection(endPoint.x, startPoint.x);
  var directionY = computeDirection(endPoint.y, startPoint.y);
  var deltaX = currentPos.x - prePos.x;
  var deltaY = currentPos.y - prePos.y;
  return directionX * deltaX <= 0 && directionY * deltaY <= 0;
};
var Transition = function(_super) {
  __extends(Transition2, _super);
  function Transition2() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  Transition2.prototype.startProbe = function(startPoint, endPoint) {
    var _this = this;
    var prePos = startPoint;
    var probe = function() {
      var pos = _this.translater.getComputedPosition();
      if (isValidPostion(startPoint, endPoint, pos, prePos)) {
        _this.hooks.trigger(_this.hooks.eventTypes.move, pos);
      }
      if (!_this.pending) {
        if (_this.callStopWhenPending) {
          _this.callStopWhenPending = false;
        } else {
          _this.hooks.trigger(_this.hooks.eventTypes.end, pos);
        }
      }
      prePos = pos;
      if (_this.pending) {
        _this.timer = requestAnimationFrame(probe);
      }
    };
    if (this.callStopWhenPending) {
      this.setCallStop(false);
    }
    cancelAnimationFrame(this.timer);
    probe();
  };
  Transition2.prototype.transitionTime = function(time) {
    if (time === void 0) {
      time = 0;
    }
    this.style[style$1.transitionDuration] = time + "ms";
    this.hooks.trigger(this.hooks.eventTypes.time, time);
  };
  Transition2.prototype.transitionTimingFunction = function(easing) {
    this.style[style$1.transitionTimingFunction] = easing;
    this.hooks.trigger(this.hooks.eventTypes.timeFunction, easing);
  };
  Transition2.prototype.transitionProperty = function() {
    this.style[style$1.transitionProperty] = style$1.transform;
  };
  Transition2.prototype.move = function(startPoint, endPoint, time, easingFn) {
    this.setPending(time > 0);
    this.transitionTimingFunction(easingFn);
    this.transitionProperty();
    this.transitionTime(time);
    this.translate(endPoint);
    var isRealtimeProbeType = this.options.probeType === 3;
    if (time && isRealtimeProbeType) {
      this.startProbe(startPoint, endPoint);
    }
    if (!time) {
      this._reflow = this.content.offsetHeight;
      if (isRealtimeProbeType) {
        this.hooks.trigger(this.hooks.eventTypes.move, endPoint);
      }
      this.hooks.trigger(this.hooks.eventTypes.end, endPoint);
    }
  };
  Transition2.prototype.doStop = function() {
    var pending = this.pending;
    this.setForceStopped(false);
    this.setCallStop(false);
    if (pending) {
      this.setPending(false);
      cancelAnimationFrame(this.timer);
      var _a2 = this.translater.getComputedPosition(), x = _a2.x, y = _a2.y;
      this.transitionTime();
      this.translate({ x, y });
      this.setForceStopped(true);
      this.setCallStop(true);
      this.hooks.trigger(this.hooks.eventTypes.forceStop, { x, y });
    }
    return pending;
  };
  Transition2.prototype.stop = function() {
    var stopFromTransition = this.doStop();
    if (stopFromTransition) {
      this.hooks.trigger(this.hooks.eventTypes.callStop);
    }
  };
  return Transition2;
}(Base);
var Animation = function(_super) {
  __extends(Animation2, _super);
  function Animation2() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  Animation2.prototype.move = function(startPoint, endPoint, time, easingFn) {
    if (!time) {
      this.translate(endPoint);
      if (this.options.probeType === 3) {
        this.hooks.trigger(this.hooks.eventTypes.move, endPoint);
      }
      this.hooks.trigger(this.hooks.eventTypes.end, endPoint);
      return;
    }
    this.animate(startPoint, endPoint, time, easingFn);
  };
  Animation2.prototype.animate = function(startPoint, endPoint, duration, easingFn) {
    var _this = this;
    var startTime = getNow();
    var destTime = startTime + duration;
    var isRealtimeProbeType = this.options.probeType === 3;
    var step = function() {
      var now = getNow();
      if (now >= destTime) {
        _this.translate(endPoint);
        if (isRealtimeProbeType) {
          _this.hooks.trigger(_this.hooks.eventTypes.move, endPoint);
        }
        _this.hooks.trigger(_this.hooks.eventTypes.end, endPoint);
        return;
      }
      now = (now - startTime) / duration;
      var easing = easingFn(now);
      var newPoint = {};
      Object.keys(endPoint).forEach(function(key) {
        var startValue = startPoint[key];
        var endValue = endPoint[key];
        newPoint[key] = (endValue - startValue) * easing + startValue;
      });
      _this.translate(newPoint);
      if (isRealtimeProbeType) {
        _this.hooks.trigger(_this.hooks.eventTypes.move, newPoint);
      }
      if (_this.pending) {
        _this.timer = requestAnimationFrame(step);
      }
      if (!_this.pending) {
        if (_this.callStopWhenPending) {
          _this.callStopWhenPending = false;
        } else {
          _this.hooks.trigger(_this.hooks.eventTypes.end, endPoint);
        }
      }
    };
    this.setPending(true);
    if (this.callStopWhenPending) {
      this.setCallStop(false);
    }
    cancelAnimationFrame(this.timer);
    step();
  };
  Animation2.prototype.doStop = function() {
    var pending = this.pending;
    this.setForceStopped(false);
    this.setCallStop(false);
    if (pending) {
      this.setPending(false);
      cancelAnimationFrame(this.timer);
      var pos = this.translater.getComputedPosition();
      this.setForceStopped(true);
      this.setCallStop(true);
      this.hooks.trigger(this.hooks.eventTypes.forceStop, pos);
    }
    return pending;
  };
  Animation2.prototype.stop = function() {
    var stopFromAnimation = this.doStop();
    if (stopFromAnimation) {
      this.hooks.trigger(this.hooks.eventTypes.callStop);
    }
  };
  return Animation2;
}(Base);
function createAnimater(element, translater, options) {
  var useTransition = options.useTransition;
  var animaterOptions = {};
  Object.defineProperty(animaterOptions, "probeType", {
    enumerable: true,
    configurable: false,
    get: function() {
      return options.probeType;
    }
  });
  if (useTransition) {
    return new Transition(element, translater, animaterOptions);
  } else {
    return new Animation(element, translater, animaterOptions);
  }
}
var Behavior = function() {
  function Behavior2(wrapper, content, options) {
    this.wrapper = wrapper;
    this.options = options;
    this.hooks = new EventEmitter([
      "beforeComputeBoundary",
      "computeBoundary",
      "momentum",
      "end",
      "ignoreHasScroll"
    ]);
    this.refresh(content);
  }
  Behavior2.prototype.start = function() {
    this.dist = 0;
    this.setMovingDirection(0);
    this.setDirection(0);
  };
  Behavior2.prototype.move = function(delta) {
    delta = this.hasScroll ? delta : 0;
    this.setMovingDirection(delta);
    return this.performDampingAlgorithm(delta, this.options.outOfBoundaryDampingFactor);
  };
  Behavior2.prototype.setMovingDirection = function(delta) {
    this.movingDirection = delta > 0 ? -1 : delta < 0 ? 1 : 0;
  };
  Behavior2.prototype.setDirection = function(delta) {
    this.direction = delta > 0 ? -1 : delta < 0 ? 1 : 0;
  };
  Behavior2.prototype.performDampingAlgorithm = function(delta, dampingFactor) {
    var newPos = this.currentPos + delta;
    if (newPos > this.minScrollPos || newPos < this.maxScrollPos) {
      if (newPos > this.minScrollPos && this.options.bounces[0] || newPos < this.maxScrollPos && this.options.bounces[1]) {
        newPos = this.currentPos + delta * dampingFactor;
      } else {
        newPos = newPos > this.minScrollPos ? this.minScrollPos : this.maxScrollPos;
      }
    }
    return newPos;
  };
  Behavior2.prototype.end = function(duration) {
    var momentumInfo = {
      duration: 0
    };
    var absDist = Math.abs(this.currentPos - this.startPos);
    if (this.options.momentum && duration < this.options.momentumLimitTime && absDist > this.options.momentumLimitDistance) {
      var wrapperSize = this.direction === -1 && this.options.bounces[0] || this.direction === 1 && this.options.bounces[1] ? this.wrapperSize : 0;
      momentumInfo = this.hasScroll ? this.momentum(this.currentPos, this.startPos, duration, this.maxScrollPos, this.minScrollPos, wrapperSize, this.options) : { destination: this.currentPos, duration: 0 };
    } else {
      this.hooks.trigger(this.hooks.eventTypes.end, momentumInfo);
    }
    return momentumInfo;
  };
  Behavior2.prototype.momentum = function(current, start, time, lowerMargin, upperMargin, wrapperSize, options) {
    if (options === void 0) {
      options = this.options;
    }
    var distance = current - start;
    var speed = Math.abs(distance) / time;
    var deceleration = options.deceleration, swipeBounceTime = options.swipeBounceTime, swipeTime = options.swipeTime;
    var duration = Math.min(swipeTime, speed * 2 / deceleration);
    var momentumData = {
      destination: current + speed * speed / deceleration * (distance < 0 ? -1 : 1),
      duration,
      rate: 15
    };
    this.hooks.trigger(this.hooks.eventTypes.momentum, momentumData, distance);
    if (momentumData.destination < lowerMargin) {
      momentumData.destination = wrapperSize ? Math.max(lowerMargin - wrapperSize / 4, lowerMargin - wrapperSize / momentumData.rate * speed) : lowerMargin;
      momentumData.duration = swipeBounceTime;
    } else if (momentumData.destination > upperMargin) {
      momentumData.destination = wrapperSize ? Math.min(upperMargin + wrapperSize / 4, upperMargin + wrapperSize / momentumData.rate * speed) : upperMargin;
      momentumData.duration = swipeBounceTime;
    }
    momentumData.destination = Math.round(momentumData.destination);
    return momentumData;
  };
  Behavior2.prototype.updateDirection = function() {
    var absDist = this.currentPos - this.absStartPos;
    this.setDirection(absDist);
  };
  Behavior2.prototype.refresh = function(content) {
    var _a2 = this.options.rect, size = _a2.size, position = _a2.position;
    var isWrapperStatic = window.getComputedStyle(this.wrapper, null).position === "static";
    var wrapperRect = getRect(this.wrapper);
    this.wrapperSize = this.wrapper[size === "width" ? "clientWidth" : "clientHeight"];
    this.setContent(content);
    var contentRect = getRect(this.content);
    this.contentSize = contentRect[size];
    this.relativeOffset = contentRect[position];
    if (isWrapperStatic) {
      this.relativeOffset -= wrapperRect[position];
    }
    this.computeBoundary();
    this.setDirection(0);
  };
  Behavior2.prototype.setContent = function(content) {
    if (content !== this.content) {
      this.content = content;
      this.resetState();
    }
  };
  Behavior2.prototype.resetState = function() {
    this.currentPos = 0;
    this.startPos = 0;
    this.dist = 0;
    this.setDirection(0);
    this.setMovingDirection(0);
    this.resetStartPos();
  };
  Behavior2.prototype.computeBoundary = function() {
    this.hooks.trigger(this.hooks.eventTypes.beforeComputeBoundary);
    var boundary = {
      minScrollPos: 0,
      maxScrollPos: this.wrapperSize - this.contentSize
    };
    if (boundary.maxScrollPos < 0) {
      boundary.maxScrollPos -= this.relativeOffset;
      if (this.options.specifiedIndexAsContent === 0) {
        boundary.minScrollPos = -this.relativeOffset;
      }
    }
    this.hooks.trigger(this.hooks.eventTypes.computeBoundary, boundary);
    this.minScrollPos = boundary.minScrollPos;
    this.maxScrollPos = boundary.maxScrollPos;
    this.hasScroll = this.options.scrollable && this.maxScrollPos < this.minScrollPos;
    if (!this.hasScroll && this.minScrollPos < this.maxScrollPos) {
      this.maxScrollPos = this.minScrollPos;
      this.contentSize = this.wrapperSize;
    }
  };
  Behavior2.prototype.updatePosition = function(pos) {
    this.currentPos = pos;
  };
  Behavior2.prototype.getCurrentPos = function() {
    return this.currentPos;
  };
  Behavior2.prototype.checkInBoundary = function() {
    var position = this.adjustPosition(this.currentPos);
    var inBoundary = position === this.getCurrentPos();
    return {
      position,
      inBoundary
    };
  };
  Behavior2.prototype.adjustPosition = function(pos) {
    if (!this.hasScroll && !this.hooks.trigger(this.hooks.eventTypes.ignoreHasScroll)) {
      pos = this.minScrollPos;
    } else if (pos > this.minScrollPos) {
      pos = this.minScrollPos;
    } else if (pos < this.maxScrollPos) {
      pos = this.maxScrollPos;
    }
    return pos;
  };
  Behavior2.prototype.updateStartPos = function() {
    this.startPos = this.currentPos;
  };
  Behavior2.prototype.updateAbsStartPos = function() {
    this.absStartPos = this.currentPos;
  };
  Behavior2.prototype.resetStartPos = function() {
    this.updateStartPos();
    this.updateAbsStartPos();
  };
  Behavior2.prototype.getAbsDist = function(delta) {
    this.dist += delta;
    return Math.abs(this.dist);
  };
  Behavior2.prototype.destroy = function() {
    this.hooks.destroy();
  };
  return Behavior2;
}();
var _a, _b, _c, _d;
var PassthroughHandlers = (_a = {}, _a["yes"] = function(e) {
  return true;
}, _a["no"] = function(e) {
  maybePrevent(e);
  return false;
}, _a);
var DirectionMap = (_b = {}, _b["horizontal"] = (_c = {}, _c["yes"] = "horizontal", _c["no"] = "vertical", _c), _b["vertical"] = (_d = {}, _d["yes"] = "vertical", _d["no"] = "horizontal", _d), _b);
var DirectionLockAction = function() {
  function DirectionLockAction2(directionLockThreshold, freeScroll, eventPassthrough) {
    this.directionLockThreshold = directionLockThreshold;
    this.freeScroll = freeScroll;
    this.eventPassthrough = eventPassthrough;
    this.reset();
  }
  DirectionLockAction2.prototype.reset = function() {
    this.directionLocked = "";
  };
  DirectionLockAction2.prototype.checkMovingDirection = function(absDistX, absDistY, e) {
    this.computeDirectionLock(absDistX, absDistY);
    return this.handleEventPassthrough(e);
  };
  DirectionLockAction2.prototype.adjustDelta = function(deltaX, deltaY) {
    if (this.directionLocked === "horizontal") {
      deltaY = 0;
    } else if (this.directionLocked === "vertical") {
      deltaX = 0;
    }
    return {
      deltaX,
      deltaY
    };
  };
  DirectionLockAction2.prototype.computeDirectionLock = function(absDistX, absDistY) {
    if (this.directionLocked === "" && !this.freeScroll) {
      if (absDistX > absDistY + this.directionLockThreshold) {
        this.directionLocked = "horizontal";
      } else if (absDistY >= absDistX + this.directionLockThreshold) {
        this.directionLocked = "vertical";
      } else {
        this.directionLocked = "none";
      }
    }
  };
  DirectionLockAction2.prototype.handleEventPassthrough = function(e) {
    var handleMap = DirectionMap[this.directionLocked];
    if (handleMap) {
      if (this.eventPassthrough === handleMap["yes"]) {
        return PassthroughHandlers["yes"](e);
      } else if (this.eventPassthrough === handleMap["no"]) {
        return PassthroughHandlers["no"](e);
      }
    }
    return false;
  };
  return DirectionLockAction2;
}();
var applyQuadrantTransformation = function(deltaX, deltaY, quadrant) {
  if (quadrant === 2) {
    return [deltaY, -deltaX];
  } else if (quadrant === 3) {
    return [-deltaX, -deltaY];
  } else if (quadrant === 4) {
    return [-deltaY, deltaX];
  } else {
    return [deltaX, deltaY];
  }
};
var ScrollerActions = function() {
  function ScrollerActions2(scrollBehaviorX, scrollBehaviorY, actionsHandler, animater, options) {
    this.hooks = new EventEmitter([
      "start",
      "beforeMove",
      "scrollStart",
      "scroll",
      "beforeEnd",
      "end",
      "scrollEnd",
      "contentNotMoved",
      "detectMovingDirection",
      "coordinateTransformation"
    ]);
    this.scrollBehaviorX = scrollBehaviorX;
    this.scrollBehaviorY = scrollBehaviorY;
    this.actionsHandler = actionsHandler;
    this.animater = animater;
    this.options = options;
    this.directionLockAction = new DirectionLockAction(options.directionLockThreshold, options.freeScroll, options.eventPassthrough);
    this.enabled = true;
    this.bindActionsHandler();
  }
  ScrollerActions2.prototype.bindActionsHandler = function() {
    var _this = this;
    this.actionsHandler.hooks.on(this.actionsHandler.hooks.eventTypes.start, function(e) {
      if (!_this.enabled)
        return true;
      return _this.handleStart(e);
    });
    this.actionsHandler.hooks.on(this.actionsHandler.hooks.eventTypes.move, function(_a2) {
      var deltaX = _a2.deltaX, deltaY = _a2.deltaY, e = _a2.e;
      if (!_this.enabled)
        return true;
      var _b2 = applyQuadrantTransformation(deltaX, deltaY, _this.options.quadrant), transformateDeltaX = _b2[0], transformateDeltaY = _b2[1];
      var transformateDeltaData = {
        deltaX: transformateDeltaX,
        deltaY: transformateDeltaY
      };
      _this.hooks.trigger(_this.hooks.eventTypes.coordinateTransformation, transformateDeltaData);
      return _this.handleMove(transformateDeltaData.deltaX, transformateDeltaData.deltaY, e);
    });
    this.actionsHandler.hooks.on(this.actionsHandler.hooks.eventTypes.end, function(e) {
      if (!_this.enabled)
        return true;
      return _this.handleEnd(e);
    });
    this.actionsHandler.hooks.on(this.actionsHandler.hooks.eventTypes.click, function(e) {
      if (_this.enabled && !e._constructed) {
        _this.handleClick(e);
      }
    });
  };
  ScrollerActions2.prototype.handleStart = function(e) {
    var timestamp = getNow();
    this.fingerMoved = false;
    this.contentMoved = false;
    this.startTime = timestamp;
    this.directionLockAction.reset();
    this.scrollBehaviorX.start();
    this.scrollBehaviorY.start();
    this.animater.doStop();
    this.scrollBehaviorX.resetStartPos();
    this.scrollBehaviorY.resetStartPos();
    this.hooks.trigger(this.hooks.eventTypes.start, e);
  };
  ScrollerActions2.prototype.handleMove = function(deltaX, deltaY, e) {
    if (this.hooks.trigger(this.hooks.eventTypes.beforeMove, e)) {
      return;
    }
    var absDistX = this.scrollBehaviorX.getAbsDist(deltaX);
    var absDistY = this.scrollBehaviorY.getAbsDist(deltaY);
    var timestamp = getNow();
    if (this.checkMomentum(absDistX, absDistY, timestamp)) {
      return true;
    }
    if (this.directionLockAction.checkMovingDirection(absDistX, absDistY, e)) {
      this.actionsHandler.setInitiated();
      return true;
    }
    var delta = this.directionLockAction.adjustDelta(deltaX, deltaY);
    var prevX = this.scrollBehaviorX.getCurrentPos();
    var newX = this.scrollBehaviorX.move(delta.deltaX);
    var prevY = this.scrollBehaviorY.getCurrentPos();
    var newY = this.scrollBehaviorY.move(delta.deltaY);
    if (this.hooks.trigger(this.hooks.eventTypes.detectMovingDirection)) {
      return;
    }
    if (!this.fingerMoved) {
      this.fingerMoved = true;
    }
    var positionChanged = newX !== prevX || newY !== prevY;
    if (!this.contentMoved && !positionChanged) {
      this.hooks.trigger(this.hooks.eventTypes.contentNotMoved);
    }
    if (!this.contentMoved && positionChanged) {
      this.contentMoved = true;
      this.hooks.trigger(this.hooks.eventTypes.scrollStart);
    }
    if (this.contentMoved && positionChanged) {
      this.animater.translate({
        x: newX,
        y: newY
      });
      this.dispatchScroll(timestamp);
    }
  };
  ScrollerActions2.prototype.dispatchScroll = function(timestamp) {
    if (timestamp - this.startTime > this.options.momentumLimitTime) {
      this.startTime = timestamp;
      this.scrollBehaviorX.updateStartPos();
      this.scrollBehaviorY.updateStartPos();
      if (this.options.probeType === 1) {
        this.hooks.trigger(this.hooks.eventTypes.scroll, this.getCurrentPos());
      }
    }
    if (this.options.probeType > 1) {
      this.hooks.trigger(this.hooks.eventTypes.scroll, this.getCurrentPos());
    }
  };
  ScrollerActions2.prototype.checkMomentum = function(absDistX, absDistY, timestamp) {
    return timestamp - this.endTime > this.options.momentumLimitTime && absDistY < this.options.momentumLimitDistance && absDistX < this.options.momentumLimitDistance;
  };
  ScrollerActions2.prototype.handleEnd = function(e) {
    if (this.hooks.trigger(this.hooks.eventTypes.beforeEnd, e)) {
      return;
    }
    var currentPos = this.getCurrentPos();
    this.scrollBehaviorX.updateDirection();
    this.scrollBehaviorY.updateDirection();
    if (this.hooks.trigger(this.hooks.eventTypes.end, e, currentPos)) {
      return true;
    }
    currentPos = this.ensureIntegerPos(currentPos);
    this.animater.translate(currentPos);
    this.endTime = getNow();
    var duration = this.endTime - this.startTime;
    this.hooks.trigger(this.hooks.eventTypes.scrollEnd, currentPos, duration);
  };
  ScrollerActions2.prototype.ensureIntegerPos = function(currentPos) {
    this.ensuringInteger = true;
    var x = currentPos.x, y = currentPos.y;
    var _a2 = this.scrollBehaviorX, minScrollPosX = _a2.minScrollPos, maxScrollPosX = _a2.maxScrollPos;
    var _b2 = this.scrollBehaviorY, minScrollPosY = _b2.minScrollPos, maxScrollPosY = _b2.maxScrollPos;
    x = x > 0 ? Math.ceil(x) : Math.floor(x);
    y = y > 0 ? Math.ceil(y) : Math.floor(y);
    x = between(x, maxScrollPosX, minScrollPosX);
    y = between(y, maxScrollPosY, minScrollPosY);
    return { x, y };
  };
  ScrollerActions2.prototype.handleClick = function(e) {
    if (!preventDefaultExceptionFn(e.target, this.options.preventDefaultException)) {
      maybePrevent(e);
      e.stopPropagation();
    }
  };
  ScrollerActions2.prototype.getCurrentPos = function() {
    return {
      x: this.scrollBehaviorX.getCurrentPos(),
      y: this.scrollBehaviorY.getCurrentPos()
    };
  };
  ScrollerActions2.prototype.refresh = function() {
    this.endTime = 0;
  };
  ScrollerActions2.prototype.destroy = function() {
    this.hooks.destroy();
  };
  return ScrollerActions2;
}();
function createActionsHandlerOptions(bsOptions) {
  var options = [
    "click",
    "bindToWrapper",
    "disableMouse",
    "disableTouch",
    "preventDefault",
    "stopPropagation",
    "tagException",
    "preventDefaultException",
    "autoEndDistance"
  ].reduce(function(prev, cur) {
    prev[cur] = bsOptions[cur];
    return prev;
  }, {});
  return options;
}
function createBehaviorOptions(bsOptions, extraProp, bounces, rect) {
  var options = [
    "momentum",
    "momentumLimitTime",
    "momentumLimitDistance",
    "deceleration",
    "swipeBounceTime",
    "swipeTime",
    "outOfBoundaryDampingFactor",
    "specifiedIndexAsContent"
  ].reduce(function(prev, cur) {
    prev[cur] = bsOptions[cur];
    return prev;
  }, {});
  options.scrollable = !!bsOptions[extraProp];
  options.bounces = bounces;
  options.rect = rect;
  return options;
}
function bubbling(source, target, events) {
  events.forEach(function(event) {
    var sourceEvent;
    var targetEvent;
    if (typeof event === "string") {
      sourceEvent = targetEvent = event;
    } else {
      sourceEvent = event.source;
      targetEvent = event.target;
    }
    source.on(sourceEvent, function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return target.trigger.apply(target, __spreadArrays([targetEvent], args));
    });
  });
}
function isSamePoint(startPoint, endPoint) {
  var keys = Object.keys(startPoint);
  for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
    var key = keys_1[_i];
    if (startPoint[key] !== endPoint[key])
      return false;
  }
  return true;
}
var MIN_SCROLL_DISTANCE = 1;
var Scroller = function() {
  function Scroller2(wrapper, content, options) {
    this.wrapper = wrapper;
    this.content = content;
    this.resizeTimeout = 0;
    this.hooks = new EventEmitter([
      "beforeStart",
      "beforeMove",
      "beforeScrollStart",
      "scrollStart",
      "scroll",
      "beforeEnd",
      "scrollEnd",
      "resize",
      "touchEnd",
      "end",
      "flick",
      "scrollCancel",
      "momentum",
      "scrollTo",
      "minDistanceScroll",
      "scrollToElement",
      "beforeRefresh"
    ]);
    this.options = options;
    var _a2 = this.options.bounce, left = _a2.left, right = _a2.right, top = _a2.top, bottom = _a2.bottom;
    this.scrollBehaviorX = new Behavior(wrapper, content, createBehaviorOptions(options, "scrollX", [left, right], {
      size: "width",
      position: "left"
    }));
    this.scrollBehaviorY = new Behavior(wrapper, content, createBehaviorOptions(options, "scrollY", [top, bottom], {
      size: "height",
      position: "top"
    }));
    this.translater = new Translater(this.content);
    this.animater = createAnimater(this.content, this.translater, this.options);
    this.actionsHandler = new ActionsHandler(this.options.bindToTarget ? this.content : wrapper, createActionsHandlerOptions(this.options));
    this.actions = new ScrollerActions(this.scrollBehaviorX, this.scrollBehaviorY, this.actionsHandler, this.animater, this.options);
    var resizeHandler = this.resize.bind(this);
    this.resizeRegister = new EventRegister(window, [
      {
        name: "orientationchange",
        handler: resizeHandler
      },
      {
        name: "resize",
        handler: resizeHandler
      }
    ]);
    this.registerTransitionEnd();
    this.init();
  }
  Scroller2.prototype.init = function() {
    var _this = this;
    this.bindTranslater();
    this.bindAnimater();
    this.bindActions();
    this.hooks.on(this.hooks.eventTypes.scrollEnd, function() {
      _this.togglePointerEvents(true);
    });
  };
  Scroller2.prototype.registerTransitionEnd = function() {
    this.transitionEndRegister = new EventRegister(this.content, [
      {
        name: style$1.transitionEnd,
        handler: this.transitionEnd.bind(this)
      }
    ]);
  };
  Scroller2.prototype.bindTranslater = function() {
    var _this = this;
    var hooks = this.translater.hooks;
    hooks.on(hooks.eventTypes.beforeTranslate, function(transformStyle) {
      if (_this.options.translateZ) {
        transformStyle.push(_this.options.translateZ);
      }
    });
    hooks.on(hooks.eventTypes.translate, function(pos) {
      var prevPos = _this.getCurrentPos();
      _this.updatePositions(pos);
      if (_this.actions.ensuringInteger === true) {
        _this.actions.ensuringInteger = false;
        return;
      }
      if (pos.x !== prevPos.x || pos.y !== prevPos.y) {
        _this.togglePointerEvents(false);
      }
    });
  };
  Scroller2.prototype.bindAnimater = function() {
    var _this = this;
    this.animater.hooks.on(this.animater.hooks.eventTypes.end, function(pos) {
      if (!_this.resetPosition(_this.options.bounceTime)) {
        _this.animater.setPending(false);
        _this.hooks.trigger(_this.hooks.eventTypes.scrollEnd, pos);
      }
    });
    bubbling(this.animater.hooks, this.hooks, [
      {
        source: this.animater.hooks.eventTypes.move,
        target: this.hooks.eventTypes.scroll
      },
      {
        source: this.animater.hooks.eventTypes.forceStop,
        target: this.hooks.eventTypes.scrollEnd
      }
    ]);
  };
  Scroller2.prototype.bindActions = function() {
    var _this = this;
    var actions = this.actions;
    bubbling(actions.hooks, this.hooks, [
      {
        source: actions.hooks.eventTypes.start,
        target: this.hooks.eventTypes.beforeStart
      },
      {
        source: actions.hooks.eventTypes.start,
        target: this.hooks.eventTypes.beforeScrollStart
      },
      {
        source: actions.hooks.eventTypes.beforeMove,
        target: this.hooks.eventTypes.beforeMove
      },
      {
        source: actions.hooks.eventTypes.scrollStart,
        target: this.hooks.eventTypes.scrollStart
      },
      {
        source: actions.hooks.eventTypes.scroll,
        target: this.hooks.eventTypes.scroll
      },
      {
        source: actions.hooks.eventTypes.beforeEnd,
        target: this.hooks.eventTypes.beforeEnd
      }
    ]);
    actions.hooks.on(actions.hooks.eventTypes.end, function(e, pos) {
      _this.hooks.trigger(_this.hooks.eventTypes.touchEnd, pos);
      if (_this.hooks.trigger(_this.hooks.eventTypes.end, pos)) {
        return true;
      }
      if (!actions.fingerMoved) {
        _this.hooks.trigger(_this.hooks.eventTypes.scrollCancel);
        if (_this.checkClick(e)) {
          return true;
        }
      }
      if (_this.resetPosition(_this.options.bounceTime, ease$1.bounce)) {
        _this.animater.setForceStopped(false);
        return true;
      }
    });
    actions.hooks.on(actions.hooks.eventTypes.scrollEnd, function(pos, duration) {
      var deltaX = Math.abs(pos.x - _this.scrollBehaviorX.startPos);
      var deltaY = Math.abs(pos.y - _this.scrollBehaviorY.startPos);
      if (_this.checkFlick(duration, deltaX, deltaY)) {
        _this.animater.setForceStopped(false);
        _this.hooks.trigger(_this.hooks.eventTypes.flick);
        return;
      }
      if (_this.momentum(pos, duration)) {
        _this.animater.setForceStopped(false);
        return;
      }
      if (actions.contentMoved) {
        _this.hooks.trigger(_this.hooks.eventTypes.scrollEnd, pos);
      }
      if (_this.animater.forceStopped) {
        _this.animater.setForceStopped(false);
      }
    });
  };
  Scroller2.prototype.checkFlick = function(duration, deltaX, deltaY) {
    var flickMinMovingDistance = 1;
    if (this.hooks.events.flick.length > 1 && duration < this.options.flickLimitTime && deltaX < this.options.flickLimitDistance && deltaY < this.options.flickLimitDistance && (deltaY > flickMinMovingDistance || deltaX > flickMinMovingDistance)) {
      return true;
    }
  };
  Scroller2.prototype.momentum = function(pos, duration) {
    var meta = {
      time: 0,
      easing: ease$1.swiper,
      newX: pos.x,
      newY: pos.y
    };
    var momentumX = this.scrollBehaviorX.end(duration);
    var momentumY = this.scrollBehaviorY.end(duration);
    meta.newX = isUndef(momentumX.destination) ? meta.newX : momentumX.destination;
    meta.newY = isUndef(momentumY.destination) ? meta.newY : momentumY.destination;
    meta.time = Math.max(momentumX.duration, momentumY.duration);
    this.hooks.trigger(this.hooks.eventTypes.momentum, meta, this);
    if (meta.newX !== pos.x || meta.newY !== pos.y) {
      if (meta.newX > this.scrollBehaviorX.minScrollPos || meta.newX < this.scrollBehaviorX.maxScrollPos || meta.newY > this.scrollBehaviorY.minScrollPos || meta.newY < this.scrollBehaviorY.maxScrollPos) {
        meta.easing = ease$1.swipeBounce;
      }
      this.scrollTo(meta.newX, meta.newY, meta.time, meta.easing);
      return true;
    }
  };
  Scroller2.prototype.checkClick = function(e) {
    var cancelable = {
      preventClick: this.animater.forceStopped
    };
    if (this.hooks.trigger(this.hooks.eventTypes.checkClick)) {
      this.animater.setForceStopped(false);
      return true;
    }
    if (!cancelable.preventClick) {
      var _dblclick = this.options.dblclick;
      var dblclickTrigged = false;
      if (_dblclick && this.lastClickTime) {
        var _a2 = _dblclick.delay, delay = _a2 === void 0 ? 300 : _a2;
        if (getNow() - this.lastClickTime < delay) {
          dblclickTrigged = true;
          dblclick(e);
        }
      }
      if (this.options.tap) {
        tap(e, this.options.tap);
      }
      if (this.options.click && !preventDefaultExceptionFn(e.target, this.options.preventDefaultException)) {
        click(e);
      }
      this.lastClickTime = dblclickTrigged ? null : getNow();
      return true;
    }
    return false;
  };
  Scroller2.prototype.resize = function() {
    var _this = this;
    if (!this.actions.enabled) {
      return;
    }
    if (isAndroid) {
      this.wrapper.scrollTop = 0;
    }
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = window.setTimeout(function() {
      _this.hooks.trigger(_this.hooks.eventTypes.resize);
    }, this.options.resizePolling);
  };
  Scroller2.prototype.transitionEnd = function(e) {
    if (e.target !== this.content || !this.animater.pending) {
      return;
    }
    var animater = this.animater;
    animater.transitionTime();
    if (!this.resetPosition(this.options.bounceTime, ease$1.bounce)) {
      this.animater.setPending(false);
      if (this.options.probeType !== 3) {
        this.hooks.trigger(this.hooks.eventTypes.scrollEnd, this.getCurrentPos());
      }
    }
  };
  Scroller2.prototype.togglePointerEvents = function(enabled) {
    if (enabled === void 0) {
      enabled = true;
    }
    var el = this.content.children.length ? this.content.children : [this.content];
    var pointerEvents = enabled ? "auto" : "none";
    for (var i = 0; i < el.length; i++) {
      var node = el[i];
      if (node.isBScrollContainer) {
        continue;
      }
      node.style.pointerEvents = pointerEvents;
    }
  };
  Scroller2.prototype.refresh = function(content) {
    var contentChanged = this.setContent(content);
    this.hooks.trigger(this.hooks.eventTypes.beforeRefresh);
    this.scrollBehaviorX.refresh(content);
    this.scrollBehaviorY.refresh(content);
    if (contentChanged) {
      this.translater.setContent(content);
      this.animater.setContent(content);
      this.transitionEndRegister.destroy();
      this.registerTransitionEnd();
      if (this.options.bindToTarget) {
        this.actionsHandler.setContent(content);
      }
    }
    this.actions.refresh();
    this.wrapperOffset = offset(this.wrapper);
  };
  Scroller2.prototype.setContent = function(content) {
    var contentChanged = content !== this.content;
    if (contentChanged) {
      this.content = content;
    }
    return contentChanged;
  };
  Scroller2.prototype.scrollBy = function(deltaX, deltaY, time, easing) {
    if (time === void 0) {
      time = 0;
    }
    var _a2 = this.getCurrentPos(), x = _a2.x, y = _a2.y;
    easing = !easing ? ease$1.bounce : easing;
    deltaX += x;
    deltaY += y;
    this.scrollTo(deltaX, deltaY, time, easing);
  };
  Scroller2.prototype.scrollTo = function(x, y, time, easing, extraTransform) {
    if (time === void 0) {
      time = 0;
    }
    if (easing === void 0) {
      easing = ease$1.bounce;
    }
    if (extraTransform === void 0) {
      extraTransform = {
        start: {},
        end: {}
      };
    }
    var easingFn = this.options.useTransition ? easing.style : easing.fn;
    var currentPos = this.getCurrentPos();
    var startPoint = __assign({ x: currentPos.x, y: currentPos.y }, extraTransform.start);
    var endPoint = __assign({
      x,
      y
    }, extraTransform.end);
    this.hooks.trigger(this.hooks.eventTypes.scrollTo, endPoint);
    if (isSamePoint(startPoint, endPoint))
      return;
    var deltaX = Math.abs(endPoint.x - startPoint.x);
    var deltaY = Math.abs(endPoint.y - startPoint.y);
    if (deltaX < MIN_SCROLL_DISTANCE && deltaY < MIN_SCROLL_DISTANCE) {
      time = 0;
      this.hooks.trigger(this.hooks.eventTypes.minDistanceScroll);
    }
    this.animater.move(startPoint, endPoint, time, easingFn);
  };
  Scroller2.prototype.scrollToElement = function(el, time, offsetX, offsetY, easing) {
    var targetEle = getElement(el);
    var pos = offset(targetEle);
    var getOffset = function(offset2, size, wrapperSize) {
      if (typeof offset2 === "number") {
        return offset2;
      }
      return offset2 ? Math.round(size / 2 - wrapperSize / 2) : 0;
    };
    offsetX = getOffset(offsetX, targetEle.offsetWidth, this.wrapper.offsetWidth);
    offsetY = getOffset(offsetY, targetEle.offsetHeight, this.wrapper.offsetHeight);
    var getPos = function(pos2, wrapperPos, offset2, scrollBehavior) {
      pos2 -= wrapperPos;
      pos2 = scrollBehavior.adjustPosition(pos2 - offset2);
      return pos2;
    };
    pos.left = getPos(pos.left, this.wrapperOffset.left, offsetX, this.scrollBehaviorX);
    pos.top = getPos(pos.top, this.wrapperOffset.top, offsetY, this.scrollBehaviorY);
    if (this.hooks.trigger(this.hooks.eventTypes.scrollToElement, targetEle, pos)) {
      return;
    }
    this.scrollTo(pos.left, pos.top, time, easing);
  };
  Scroller2.prototype.resetPosition = function(time, easing) {
    if (time === void 0) {
      time = 0;
    }
    if (easing === void 0) {
      easing = ease$1.bounce;
    }
    var _a2 = this.scrollBehaviorX.checkInBoundary(), x = _a2.position, xInBoundary = _a2.inBoundary;
    var _b2 = this.scrollBehaviorY.checkInBoundary(), y = _b2.position, yInBoundary = _b2.inBoundary;
    if (xInBoundary && yInBoundary) {
      return false;
    }
    if (isIOSBadVersion) {
      this.reflow();
    }
    this.scrollTo(x, y, time, easing);
    return true;
  };
  Scroller2.prototype.reflow = function() {
    this._reflow = this.content.offsetHeight;
  };
  Scroller2.prototype.updatePositions = function(pos) {
    this.scrollBehaviorX.updatePosition(pos.x);
    this.scrollBehaviorY.updatePosition(pos.y);
  };
  Scroller2.prototype.getCurrentPos = function() {
    return this.actions.getCurrentPos();
  };
  Scroller2.prototype.enable = function() {
    this.actions.enabled = true;
  };
  Scroller2.prototype.disable = function() {
    cancelAnimationFrame(this.animater.timer);
    this.actions.enabled = false;
  };
  Scroller2.prototype.destroy = function() {
    var _this = this;
    var keys = [
      "resizeRegister",
      "transitionEndRegister",
      "actionsHandler",
      "actions",
      "hooks",
      "animater",
      "translater",
      "scrollBehaviorX",
      "scrollBehaviorY"
    ];
    keys.forEach(function(key) {
      return _this[key].destroy();
    });
  };
  return Scroller2;
}();
var BScrollConstructor = function(_super) {
  __extends(BScrollConstructor2, _super);
  function BScrollConstructor2(el, options) {
    var _this = _super.call(this, [
      "refresh",
      "contentChanged",
      "enable",
      "disable",
      "beforeScrollStart",
      "scrollStart",
      "scroll",
      "scrollEnd",
      "scrollCancel",
      "touchEnd",
      "flick",
      "destroy"
    ]) || this;
    var wrapper = getElement(el);
    if (!wrapper) {
      warn("Can not resolve the wrapper DOM.");
      return _this;
    }
    _this.plugins = {};
    _this.options = new OptionsConstructor().merge(options).process();
    if (!_this.setContent(wrapper).valid) {
      return _this;
    }
    _this.hooks = new EventEmitter([
      "refresh",
      "enable",
      "disable",
      "destroy",
      "beforeInitialScrollTo",
      "contentChanged"
    ]);
    _this.init(wrapper);
    return _this;
  }
  BScrollConstructor2.use = function(ctor) {
    var name = ctor.pluginName;
    var installed = BScrollConstructor2.plugins.some(function(plugin) {
      return ctor === plugin.ctor;
    });
    if (installed)
      return BScrollConstructor2;
    if (isUndef(name)) {
      warn("Plugin Class must specify plugin's name in static property by 'pluginName' field.");
      return BScrollConstructor2;
    }
    BScrollConstructor2.pluginsMap[name] = true;
    BScrollConstructor2.plugins.push({
      name,
      applyOrder: ctor.applyOrder,
      ctor
    });
    return BScrollConstructor2;
  };
  BScrollConstructor2.prototype.setContent = function(wrapper) {
    var contentChanged = false;
    var valid = true;
    var content = wrapper.children[this.options.specifiedIndexAsContent];
    if (!content) {
      warn("The wrapper need at least one child element to be content element to scroll.");
      valid = false;
    } else {
      contentChanged = this.content !== content;
      if (contentChanged) {
        this.content = content;
      }
    }
    return {
      valid,
      contentChanged
    };
  };
  BScrollConstructor2.prototype.init = function(wrapper) {
    var _this = this;
    this.wrapper = wrapper;
    wrapper.isBScrollContainer = true;
    this.scroller = new Scroller(wrapper, this.content, this.options);
    this.scroller.hooks.on(this.scroller.hooks.eventTypes.resize, function() {
      _this.refresh();
    });
    this.eventBubbling();
    this.handleAutoBlur();
    this.enable();
    this.proxy(propertiesConfig$1);
    this.applyPlugins();
    this.refreshWithoutReset(this.content);
    var _a2 = this.options, startX = _a2.startX, startY = _a2.startY;
    var position = {
      x: startX,
      y: startY
    };
    if (this.hooks.trigger(this.hooks.eventTypes.beforeInitialScrollTo, position)) {
      return;
    }
    this.scroller.scrollTo(position.x, position.y);
  };
  BScrollConstructor2.prototype.applyPlugins = function() {
    var _this = this;
    var options = this.options;
    BScrollConstructor2.plugins.sort(function(a, b) {
      var _a2;
      var applyOrderMap = (_a2 = {}, _a2["pre"] = -1, _a2["post"] = 1, _a2);
      var aOrder = a.applyOrder ? applyOrderMap[a.applyOrder] : 0;
      var bOrder = b.applyOrder ? applyOrderMap[b.applyOrder] : 0;
      return aOrder - bOrder;
    }).forEach(function(item) {
      var ctor = item.ctor;
      if (options[item.name] && typeof ctor === "function") {
        _this.plugins[item.name] = new ctor(_this);
      }
    });
  };
  BScrollConstructor2.prototype.handleAutoBlur = function() {
    if (this.options.autoBlur) {
      this.on(this.eventTypes.beforeScrollStart, function() {
        var activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")) {
          activeElement.blur();
        }
      });
    }
  };
  BScrollConstructor2.prototype.eventBubbling = function() {
    bubbling(this.scroller.hooks, this, [
      this.eventTypes.beforeScrollStart,
      this.eventTypes.scrollStart,
      this.eventTypes.scroll,
      this.eventTypes.scrollEnd,
      this.eventTypes.scrollCancel,
      this.eventTypes.touchEnd,
      this.eventTypes.flick
    ]);
  };
  BScrollConstructor2.prototype.refreshWithoutReset = function(content) {
    this.scroller.refresh(content);
    this.hooks.trigger(this.hooks.eventTypes.refresh, content);
    this.trigger(this.eventTypes.refresh, content);
  };
  BScrollConstructor2.prototype.proxy = function(propertiesConfig2) {
    var _this = this;
    propertiesConfig2.forEach(function(_a2) {
      var key = _a2.key, sourceKey = _a2.sourceKey;
      propertiesProxy(_this, sourceKey, key);
    });
  };
  BScrollConstructor2.prototype.refresh = function() {
    var _a2 = this.setContent(this.wrapper), contentChanged = _a2.contentChanged, valid = _a2.valid;
    if (valid) {
      var content = this.content;
      this.refreshWithoutReset(content);
      if (contentChanged) {
        this.hooks.trigger(this.hooks.eventTypes.contentChanged, content);
        this.trigger(this.eventTypes.contentChanged, content);
      }
      this.scroller.resetPosition();
    }
  };
  BScrollConstructor2.prototype.enable = function() {
    this.scroller.enable();
    this.hooks.trigger(this.hooks.eventTypes.enable);
    this.trigger(this.eventTypes.enable);
  };
  BScrollConstructor2.prototype.disable = function() {
    this.scroller.disable();
    this.hooks.trigger(this.hooks.eventTypes.disable);
    this.trigger(this.eventTypes.disable);
  };
  BScrollConstructor2.prototype.destroy = function() {
    this.hooks.trigger(this.hooks.eventTypes.destroy);
    this.trigger(this.eventTypes.destroy);
    this.scroller.destroy();
  };
  BScrollConstructor2.prototype.eventRegister = function(names) {
    this.registerType(names);
  };
  BScrollConstructor2.plugins = [];
  BScrollConstructor2.pluginsMap = {};
  return BScrollConstructor2;
}(EventEmitter);
function createBScroll(el, options) {
  var bs = new BScrollConstructor(el, options);
  return bs;
}
createBScroll.use = BScrollConstructor.use;
createBScroll.plugins = BScrollConstructor.plugins;
createBScroll.pluginsMap = BScrollConstructor.pluginsMap;
var BScroll = createBScroll;
/*!
 * better-scroll / wheel
 * (c) 2016-2023 ustbhuangyi
 * Released under the MIT License.
 */
var inBrowser = typeof window !== "undefined";
var ua = inBrowser && navigator.userAgent.toLowerCase();
!!(ua && /wechatdevtools/.test(ua));
ua && ua.indexOf("android") > 0;
(function() {
  if (typeof ua === "string") {
    var regex = /os (\d\d?_\d(_\d)?)/;
    var matches = regex.exec(ua);
    if (!matches)
      return false;
    var parts = matches[1].split("_").map(function(item) {
      return parseInt(item, 10);
    });
    return !!(parts[0] === 13 && parts[1] >= 4);
  }
  return false;
})();
var supportsPassive = false;
if (inBrowser) {
  var EventName = "test-passive";
  try {
    var opts = {};
    Object.defineProperty(opts, "passive", {
      get: function() {
        supportsPassive = true;
      }
    });
    window.addEventListener(EventName, function() {
    }, opts);
  } catch (e) {
  }
}
var extend = function(target, source) {
  for (var key in source) {
    target[key] = source[key];
  }
  return target;
};
var elementStyle = inBrowser && document.createElement("div").style;
var vendor = function() {
  if (!inBrowser) {
    return false;
  }
  var transformNames = [
    {
      key: "standard",
      value: "transform"
    },
    {
      key: "webkit",
      value: "webkitTransform"
    },
    {
      key: "Moz",
      value: "MozTransform"
    },
    {
      key: "O",
      value: "OTransform"
    },
    {
      key: "ms",
      value: "msTransform"
    }
  ];
  for (var _i = 0, transformNames_1 = transformNames; _i < transformNames_1.length; _i++) {
    var obj = transformNames_1[_i];
    if (elementStyle[obj.value] !== void 0) {
      return obj.key;
    }
  }
  return false;
}();
function prefixStyle(style2) {
  if (vendor === false) {
    return style2;
  }
  if (vendor === "standard") {
    if (style2 === "transitionEnd") {
      return "transitionend";
    }
    return style2;
  }
  return vendor + style2.charAt(0).toUpperCase() + style2.substr(1);
}
vendor && vendor !== "standard" ? "-" + vendor.toLowerCase() + "-" : "";
var transform = prefixStyle("transform");
var transition = prefixStyle("transition");
inBrowser && prefixStyle("perspective") in elementStyle;
var style = {
  transform,
  transition,
  transitionTimingFunction: prefixStyle("transitionTimingFunction"),
  transitionDuration: prefixStyle("transitionDuration"),
  transitionDelay: prefixStyle("transitionDelay"),
  transformOrigin: prefixStyle("transformOrigin"),
  transitionEnd: prefixStyle("transitionEnd"),
  transitionProperty: prefixStyle("transitionProperty")
};
function hasClass(el, className) {
  var reg = new RegExp("(^|\\s)" + className + "(\\s|$)");
  return reg.test(el.className);
}
function HTMLCollectionToArray(el) {
  return Array.prototype.slice.call(el, 0);
}
var ease = {
  swipe: {
    style: "cubic-bezier(0.23, 1, 0.32, 1)",
    fn: function(t) {
      return 1 + --t * t * t * t * t;
    }
  },
  swipeBounce: {
    style: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    fn: function(t) {
      return t * (2 - t);
    }
  },
  bounce: {
    style: "cubic-bezier(0.165, 0.84, 0.44, 1)",
    fn: function(t) {
      return 1 - --t * t * t * t;
    }
  }
};
var sourcePrefix = "plugins.wheel";
var propertiesMap = [
  {
    key: "wheelTo",
    name: "wheelTo"
  },
  {
    key: "getSelectedIndex",
    name: "getSelectedIndex"
  },
  {
    key: "restorePosition",
    name: "restorePosition"
  }
];
var propertiesConfig = propertiesMap.map(function(item) {
  return {
    key: item.key,
    sourceKey: sourcePrefix + "." + item.name
  };
});
var WHEEL_INDEX_CHANGED_EVENT_NAME = "wheelIndexChanged";
var CONSTANTS = {
  rate: 4
};
var Wheel = function() {
  function Wheel2(scroll) {
    this.scroll = scroll;
    this.init();
  }
  Wheel2.prototype.init = function() {
    this.handleBScroll();
    this.handleOptions();
    this.handleHooks();
    this.refreshBoundary();
    this.setSelectedIndex(this.options.selectedIndex);
  };
  Wheel2.prototype.handleBScroll = function() {
    this.scroll.proxy(propertiesConfig);
    this.scroll.registerType([WHEEL_INDEX_CHANGED_EVENT_NAME]);
  };
  Wheel2.prototype.handleOptions = function() {
    var userOptions = this.scroll.options.wheel === true ? {} : this.scroll.options.wheel;
    var defaultOptions = {
      wheelWrapperClass: "wheel-scroll",
      wheelItemClass: "wheel-item",
      rotate: 25,
      adjustTime: 400,
      selectedIndex: 0,
      wheelDisabledItemClass: "wheel-disabled-item"
    };
    this.options = extend(defaultOptions, userOptions);
  };
  Wheel2.prototype.handleHooks = function() {
    var _this = this;
    var scroll = this.scroll;
    var scroller = this.scroll.scroller;
    var actionsHandler = scroller.actionsHandler, scrollBehaviorX = scroller.scrollBehaviorX, scrollBehaviorY = scroller.scrollBehaviorY, animater = scroller.animater;
    var prevContent = scroller.content;
    scroll.on(scroll.eventTypes.scrollEnd, function(position) {
      var index = _this.findNearestValidWheel(position.y).index;
      if (scroller.animater.forceStopped && !_this.isAdjustingPosition) {
        _this.target = _this.items[index];
        return true;
      } else {
        _this.setSelectedIndex(index);
        if (_this.isAdjustingPosition) {
          _this.isAdjustingPosition = false;
        }
      }
    });
    this.scroll.hooks.on(this.scroll.hooks.eventTypes.refresh, function(content) {
      if (content !== prevContent) {
        prevContent = content;
        _this.setSelectedIndex(_this.options.selectedIndex, true);
      }
      _this.rotateX(_this.scroll.y);
      _this.wheelTo(_this.selectedIndex, 0);
    });
    this.scroll.hooks.on(this.scroll.hooks.eventTypes.beforeInitialScrollTo, function(position) {
      position.x = 0;
      position.y = -(_this.selectedIndex * _this.itemHeight);
    });
    scroller.hooks.on(scroller.hooks.eventTypes.checkClick, function() {
      var index = HTMLCollectionToArray(_this.items).indexOf(_this.target);
      if (index === -1)
        return true;
      _this.wheelTo(index, _this.options.adjustTime, ease.swipe);
      return true;
    });
    scroller.hooks.on(scroller.hooks.eventTypes.scrollTo, function(endPoint) {
      endPoint.y = _this.findNearestValidWheel(endPoint.y).y;
    });
    scroller.hooks.on(scroller.hooks.eventTypes.minDistanceScroll, function() {
      var animater2 = scroller.animater;
      if (animater2.forceStopped === true) {
        animater2.forceStopped = false;
      }
    });
    scroller.hooks.on(scroller.hooks.eventTypes.scrollToElement, function(el, pos) {
      if (!hasClass(el, _this.options.wheelItemClass)) {
        return true;
      } else {
        pos.top = _this.findNearestValidWheel(pos.top).y;
      }
    });
    actionsHandler.hooks.on(actionsHandler.hooks.eventTypes.beforeStart, function(e) {
      _this.target = e.target;
    });
    scrollBehaviorX.hooks.on(scrollBehaviorX.hooks.eventTypes.computeBoundary, function(boundary) {
      boundary.maxScrollPos = 0;
      boundary.minScrollPos = 0;
    });
    scrollBehaviorY.hooks.on(scrollBehaviorY.hooks.eventTypes.computeBoundary, function(boundary) {
      _this.items = _this.scroll.scroller.content.children;
      _this.checkWheelAllDisabled();
      _this.itemHeight = _this.items.length > 0 ? scrollBehaviorY.contentSize / _this.items.length : 0;
      boundary.maxScrollPos = -_this.itemHeight * (_this.items.length - 1);
      boundary.minScrollPos = 0;
    });
    scrollBehaviorY.hooks.on(scrollBehaviorY.hooks.eventTypes.momentum, function(momentumInfo) {
      momentumInfo.rate = CONSTANTS.rate;
      momentumInfo.destination = _this.findNearestValidWheel(momentumInfo.destination).y;
    });
    scrollBehaviorY.hooks.on(scrollBehaviorY.hooks.eventTypes.end, function(momentumInfo) {
      var validWheel = _this.findNearestValidWheel(scrollBehaviorY.currentPos);
      momentumInfo.destination = validWheel.y;
      momentumInfo.duration = _this.options.adjustTime;
    });
    animater.hooks.on(animater.hooks.eventTypes.time, function(time) {
      _this.transitionDuration(time);
    });
    animater.hooks.on(animater.hooks.eventTypes.timeFunction, function(easing) {
      _this.timeFunction(easing);
    });
    animater.hooks.on(animater.hooks.eventTypes.callStop, function() {
      var index = _this.findNearestValidWheel(_this.scroll.y).index;
      _this.isAdjustingPosition = true;
      _this.wheelTo(index, 0);
    });
    animater.translater.hooks.on(animater.translater.hooks.eventTypes.translate, function(endPoint) {
      _this.rotateX(endPoint.y);
    });
  };
  Wheel2.prototype.refreshBoundary = function() {
    var _a2 = this.scroll.scroller, scrollBehaviorX = _a2.scrollBehaviorX, scrollBehaviorY = _a2.scrollBehaviorY, content = _a2.content;
    scrollBehaviorX.refresh(content);
    scrollBehaviorY.refresh(content);
  };
  Wheel2.prototype.setSelectedIndex = function(index, contentChanged) {
    if (contentChanged === void 0) {
      contentChanged = false;
    }
    var prevSelectedIndex = this.selectedIndex;
    this.selectedIndex = index;
    if (prevSelectedIndex !== index && !contentChanged) {
      this.scroll.trigger(WHEEL_INDEX_CHANGED_EVENT_NAME, index);
    }
  };
  Wheel2.prototype.getSelectedIndex = function() {
    return this.selectedIndex;
  };
  Wheel2.prototype.wheelTo = function(index, time, ease2) {
    if (index === void 0) {
      index = 0;
    }
    if (time === void 0) {
      time = 0;
    }
    var y = -index * this.itemHeight;
    this.scroll.scrollTo(0, y, time, ease2);
  };
  Wheel2.prototype.restorePosition = function() {
    var isPending = this.scroll.pending;
    if (isPending) {
      var selectedIndex = this.getSelectedIndex();
      this.scroll.scroller.animater.clearTimer();
      this.wheelTo(selectedIndex, 0);
    }
  };
  Wheel2.prototype.transitionDuration = function(time) {
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].style[style.transitionDuration] = time + "ms";
    }
  };
  Wheel2.prototype.timeFunction = function(easing) {
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].style[style.transitionTimingFunction] = easing;
    }
  };
  Wheel2.prototype.rotateX = function(y) {
    var _a2 = this.options.rotate, rotate = _a2 === void 0 ? 25 : _a2;
    for (var i = 0; i < this.items.length; i++) {
      var deg = rotate * (y / this.itemHeight + i);
      var SafeDeg = deg.toFixed(3);
      this.items[i].style[style.transform] = "rotateX(" + SafeDeg + "deg)";
    }
  };
  Wheel2.prototype.findNearestValidWheel = function(y) {
    y = y > 0 ? 0 : y < this.scroll.maxScrollY ? this.scroll.maxScrollY : y;
    var currentIndex = Math.abs(Math.round(-y / this.itemHeight));
    var cacheIndex = currentIndex;
    var items = this.items;
    var wheelDisabledItemClassName = this.options.wheelDisabledItemClass;
    while (currentIndex >= 0) {
      if (!hasClass(items[currentIndex], wheelDisabledItemClassName)) {
        break;
      }
      currentIndex--;
    }
    if (currentIndex < 0) {
      currentIndex = cacheIndex;
      while (currentIndex <= items.length - 1) {
        if (!hasClass(items[currentIndex], wheelDisabledItemClassName)) {
          break;
        }
        currentIndex++;
      }
    }
    if (currentIndex === items.length) {
      currentIndex = cacheIndex;
    }
    return {
      index: this.wheelItemsAllDisabled ? -1 : currentIndex,
      y: -currentIndex * this.itemHeight
    };
  };
  Wheel2.prototype.checkWheelAllDisabled = function() {
    var wheelDisabledItemClassName = this.options.wheelDisabledItemClass;
    var items = this.items;
    this.wheelItemsAllDisabled = true;
    for (var i = 0; i < items.length; i++) {
      if (!hasClass(items[i], wheelDisabledItemClassName)) {
        this.wheelItemsAllDisabled = false;
        break;
      }
    }
  };
  Wheel2.pluginName = "wheel";
  return Wheel2;
}();
const isArray = Array.isArray;
const isObject = (value) => typeof value === "object" && value !== null;
function isHaveValue(value) {
  return isArray(value) && value.length === 3;
}
var useDate = (isDate) => {
  if (!isDate)
    return {};
  const START_YEAR = 1900;
  const END_YEAR = 2100;
  const date = new Date();
  const defaultYear = date.getFullYear();
  const defaultMonth = date.getMonth() + 1;
  const defaultDay = date.getDate();
  const selectYear = ref(defaultYear);
  const selectMonth = ref(defaultMonth);
  const yearList = generateList(START_YEAR, END_YEAR);
  const monthList = generateList(1, 12);
  const dayList = computed(() => {
    const thirty = [4, 6, 9, 11];
    const thirtyOne = [1, 3, 5, 7, 8, 10, 12];
    const days = thirty.includes(selectMonth.value) ? 30 : thirtyOne.includes(selectMonth.value) ? 31 : isLeapYear(selectYear.value) ? 29 : 28;
    return generateList(1, days);
  });
  const dateList = computed(() => {
    return [yearList, monthList, dayList.value];
  });
  function isLeapYear(year) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  }
  function generateList(start, end) {
    const result = [];
    for (let index = start; index <= end; index++) {
      result.push(index);
    }
    return result;
  }
  function getDateAnchors(anchor) {
    const anchors = isHaveValue(anchor) ? anchor : [defaultYear, defaultMonth, defaultDay];
    return anchors.map((target, index) => {
      const pos = dateList.value[index].indexOf(target);
      return pos > -1 ? pos : 0;
    });
  }
  function updateDateSelect(pickerAnchors) {
    const [year, month] = pickerAnchors;
    selectYear.value = dateList.value[0][year];
    selectMonth.value = dateList.value[1][month];
  }
  return {
    selectYear,
    selectMonth,
    dateList,
    updateDateSelect,
    getDateAnchors
  };
};
var useTime = (isTime) => {
  if (!isTime)
    return {};
  const hours = generateTime(0, 23);
  const minutes = generateTime(0, 59);
  const seconds = generateTime(0, 59);
  const defaultTime = ref([]);
  updateDefaultTime();
  function generateTime(start, end) {
    const result = [];
    for (let index = start; index <= end; index++) {
      result.push(`${index}`.padStart(2, "0"));
    }
    return result;
  }
  function updateDefaultTime() {
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const seconds2 = date.getSeconds();
    defaultTime.value = [hour, minute, seconds2];
  }
  function getTimeAnchors(anchor) {
    const anchors = isHaveValue(anchor) ? anchor : defaultTime.value;
    return anchors.map((target) => +target);
  }
  return {
    timeList: [hours, minutes, seconds],
    updateDefaultTime,
    getTimeAnchors
  };
};
BScroll.use(Wheel);
var usePicker = (props, emit) => {
  const pickerData = ref([]);
  const wheelWrapper = ref();
  const wheels = ref([]);
  const isCascadeData = computed(() => isArray(props.data[0]));
  const isDate = computed(() => props.type === "date");
  const isTime = computed(() => props.type === "time");
  const { selectYear, selectMonth, dateList, updateDateSelect, getDateAnchors } = useDate(isDate.value);
  const { timeList, updateDefaultTime, getTimeAnchors } = useTime(isTime.value);
  const pickerAnchors = computed(() => {
    if (isDate.value)
      return getDateAnchors(props.anchor);
    if (isTime.value)
      return getTimeAnchors(props.anchor);
    return isArray(props.anchor) ? props.anchor : [props.anchor];
  });
  const clickAllowed = ref(true);
  async function setPickerData(isUpdate = false) {
    isUpdate ? updatePickerData() : updateSelect();
    await nextTick();
    pickerData.value.forEach((_, index) => createWheel(index));
    !isUpdate && scrollToAnchor();
    checkWheels();
  }
  function updatePickerData() {
    var _a2;
    const builtIn = {
      date: dateList == null ? void 0 : dateList.value,
      time: timeList
    };
    const type = props.type;
    pickerData.value = (_a2 = builtIn[type]) != null ? _a2 : isCascadeData.value ? [...props.data] : [props.data];
  }
  function updateSelect() {
    isDate.value && updateDateSelect(pickerAnchors.value);
    isTime.value && !isHaveValue(props.anchor) && updateDefaultTime();
  }
  function createWheel(index) {
    var _a2;
    const node = (_a2 = wheelWrapper.value) == null ? void 0 : _a2.children[index];
    if (!node)
      throw new Error("It's not find wheelWrapper");
    let wheel = wheels.value[index];
    if (wheel) {
      wheel.refresh();
    } else {
      wheel = wheels.value[index] = new BScroll(node, {
        wheel: {
          selectedIndex: 0,
          rotate: 0
        },
        swipeTime: props.swipeTime
      });
      wheel.on("scrollStart", () => handleScroll());
      wheel.on("scrollEnd", () => handleScrollEnd(index));
    }
    return wheel;
  }
  function handleScroll(index) {
    clickAllowed.value = false;
  }
  function handleScrollEnd(index) {
    setTimeout(() => {
      clickAllowed.value = true;
    }, 10);
    if (!isDate.value || index === 2)
      return;
    const position = wheels.value[index].getSelectedIndex();
    const value = dateList.value[index][position];
    if (index === 0)
      selectYear.value = value;
    if (index === 1)
      selectMonth.value = value;
    setPickerData(true);
  }
  function scrollToAnchor() {
    wheels.value.forEach((wheel, index) => {
      var _a2;
      const targetPos = (_a2 = pickerAnchors.value) == null ? void 0 : _a2[index];
      wheel.wheelTo(targetPos != null ? targetPos : 0);
    });
  }
  function checkWheels() {
    const DATA_LENGTH = pickerData.value.length;
    if (wheels.value.length <= DATA_LENGTH)
      return;
    const extraWheels = wheels.value.splice(DATA_LENGTH);
    extraWheels.forEach((wheel) => wheel.destroy());
  }
  function cancel() {
    emit("cancel");
    closePicker();
  }
  function confirm() {
    const isInTransition = wheels.value.some((wheel) => wheel.isInTransition);
    isInTransition && stopWheels();
    const { item, anchor } = getSelectedItem();
    emit("confirm", item);
    emit("update:anchor", anchor);
    closePicker();
  }
  function closePicker() {
    emit("update:isShowPicker", false);
  }
  function stopWheels() {
    wheels.value.forEach((wheel) => wheel.stop());
  }
  function allowedClick() {
    return clickAllowed.value;
  }
  function getSelectedItem() {
    const { item, anchor } = wheels.value.reduce((result, wheel, index) => {
      const position = wheel.getSelectedIndex();
      const item2 = pickerData.value[index][position];
      result.item.push(isTime.value ? +item2 : item2);
      result.anchor.push(isDate.value ? item2 : position);
      return result;
    }, { item: [], anchor: [] });
    return item.length > 1 ? { item, anchor } : { item: item[0], anchor: anchor[0] };
  }
  watch(() => props.data, () => setPickerData(true), { immediate: true });
  watch(() => props.isShowPicker, (isShow) => isShow && setPickerData());
  return {
    wheels,
    pickerData,
    wheelWrapper,
    cancel,
    confirm,
    closePicker,
    allowedClick,
    getSelectedItem
  };
};
var Picker_vue_vue_type_style_index_0_scoped_true_lang = "";
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _withScopeId = (n) => (pushScopeId("data-v-5630c937"), n = n(), popScopeId(), n);
const _hoisted_1 = { class: "picker" };
const _hoisted_2 = { class: "picker_title" };
const _hoisted_3 = { class: "picker_panel" };
const _hoisted_4 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode("div", { class: "picker_mask_top" }, null, -1));
const _hoisted_5 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode("div", { class: "picker_mask_bottom" }, null, -1));
const _hoisted_6 = { class: "picker_wheel_scroll" };
const _hoisted_7 = ["onTouchend"];
const _sfc_main = defineComponent({
  __name: "Picker",
  props: {
    data: { default: () => [] },
    isShowPicker: { type: Boolean, default: false },
    options: { default: () => ({}) },
    anchor: {},
    showKey: {},
    swipeTime: { default: 500 },
    type: { default: "" }
  },
  emits: ["update:isShowPicker", "update:anchor", "cancel", "confirm"],
  setup(__props, { emit }) {
    const props = __props;
    const options = computed(() => ({
      cancelClass: "",
      confirmClass: "",
      titleClass: "",
      cancelColor: "#999",
      confirmColor: "#42b983",
      titleColor: "",
      cancelText: "Cancel",
      confirmText: "Confirm",
      titleText: "",
      ...props.options
    }));
    const cancelColor = computed(() => options.value.cancelColor);
    const confirmColor = computed(() => options.value.confirmColor);
    const titleColor = computed(() => options.value.titleColor);
    const showKeys = computed(
      () => isArray(props.showKey) ? props.showKey : [props.showKey]
    );
    function confirmItem(index2) {
      const { anchor } = getSelectedItem();
      if (index2 === anchor && allowedClick()) {
        confirm();
      }
    }
    const {
      pickerData,
      wheelWrapper,
      cancel,
      confirm,
      closePicker,
      allowedClick,
      getSelectedItem
    } = usePicker(props, emit);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createVNode(Transition$1, { name: "fade" }, {
          default: withCtx(() => [
            withDirectives(createElementVNode("div", {
              class: "mask",
              onClick: _cache[0] || (_cache[0] = (...args) => unref(closePicker) && unref(closePicker)(...args))
            }, null, 512), [
              [vShow, _ctx.isShowPicker]
            ])
          ]),
          _: 1
        }),
        createVNode(Transition$1, { name: "slide" }, {
          default: withCtx(() => [
            withDirectives(createElementVNode("div", _hoisted_1, [
              createElementVNode("div", _hoisted_2, [
                createElementVNode("button", {
                  class: normalizeClass(["picker_cancel", options.value.cancelClass]),
                  style: normalizeStyle({ color: cancelColor.value }),
                  onClick: _cache[1] || (_cache[1] = (...args) => unref(cancel) && unref(cancel)(...args))
                }, toDisplayString(options.value.cancelText), 7),
                createElementVNode("button", {
                  class: normalizeClass(["picker_confirm", options.value.confirmClass]),
                  style: normalizeStyle({ color: confirmColor.value }),
                  onClick: _cache[2] || (_cache[2] = (...args) => unref(confirm) && unref(confirm)(...args))
                }, toDisplayString(options.value.confirmText), 7),
                createElementVNode("h4", {
                  class: normalizeClass([options.value.titleClass]),
                  style: normalizeStyle({ color: titleColor.value })
                }, toDisplayString(options.value.titleText), 7)
              ]),
              createElementVNode("div", _hoisted_3, [
                _hoisted_4,
                _hoisted_5,
                createElementVNode("div", {
                  class: "picker_wheel_wrapper",
                  ref_key: "wheelWrapper",
                  ref: wheelWrapper
                }, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(unref(pickerData), (wheel, wheelIndex) => {
                    return openBlock(), createElementBlock("div", {
                      class: "picker_wheel",
                      key: wheelIndex
                    }, [
                      createElementVNode("ul", _hoisted_6, [
                        (openBlock(true), createElementBlock(Fragment, null, renderList(wheel, (item, index) => {
                          var _a2;
                          return openBlock(), createElementBlock("li", {
                            class: "picker_wheel_item",
                            key: index,
                            onTouchend: ($event) => confirmItem(index)
                          }, toDisplayString(((_a2 = showKeys.value) == null ? void 0 : _a2[wheelIndex]) && unref(isObject)(item) ? item[showKeys.value[wheelIndex]] : item), 41, _hoisted_7);
                        }), 128))
                      ])
                    ]);
                  }), 128))
                ], 512)
              ])
            ], 512), [
              [vShow, _ctx.isShowPicker]
            ])
          ]),
          _: 1
        })
      ], 64);
    };
  }
});
var Picker = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5630c937"]]);
Picker.install = function(Vue) {
  Vue.component("Picker", Picker);
};
export { Picker };
