(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{

/***/ "./node_modules/intersection-observer/intersection-observer.js":
/*!*********************************************************************!*\
  !*** ./node_modules/intersection-observer/intersection-observer.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Copyright 2016 Google Inc. All Rights Reserved.\n *\n * Licensed under the W3C SOFTWARE AND DOCUMENT NOTICE AND LICENSE.\n *\n *  https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document\n *\n */\n(function() {\n'use strict';\n\n// Exit early if we're not running in a browser.\nif (typeof window !== 'object') {\n  return;\n}\n\n// Exit early if all IntersectionObserver and IntersectionObserverEntry\n// features are natively supported.\nif ('IntersectionObserver' in window &&\n    'IntersectionObserverEntry' in window &&\n    'intersectionRatio' in window.IntersectionObserverEntry.prototype) {\n\n  // Minimal polyfill for Edge 15's lack of `isIntersecting`\n  // See: https://github.com/w3c/IntersectionObserver/issues/211\n  if (!('isIntersecting' in window.IntersectionObserverEntry.prototype)) {\n    Object.defineProperty(window.IntersectionObserverEntry.prototype,\n      'isIntersecting', {\n      get: function () {\n        return this.intersectionRatio > 0;\n      }\n    });\n  }\n  return;\n}\n\n\n/**\n * A local reference to the document.\n */\nvar document = window.document;\n\n\n/**\n * An IntersectionObserver registry. This registry exists to hold a strong\n * reference to IntersectionObserver instances currently observing a target\n * element. Without this registry, instances without another reference may be\n * garbage collected.\n */\nvar registry = [];\n\n/**\n * The signal updater for cross-origin intersection. When not null, it means\n * that the polyfill is configured to work in a cross-origin mode.\n * @type {function(DOMRect, DOMRect)}\n */\nvar crossOriginUpdater = null;\n\n/**\n * The current cross-origin intersection. Only used in the cross-origin mode.\n * @type {DOMRect}\n */\nvar crossOriginRect = null;\n\n\n/**\n * Creates the global IntersectionObserverEntry constructor.\n * https://w3c.github.io/IntersectionObserver/#intersection-observer-entry\n * @param {Object} entry A dictionary of instance properties.\n * @constructor\n */\nfunction IntersectionObserverEntry(entry) {\n  this.time = entry.time;\n  this.target = entry.target;\n  this.rootBounds = entry.rootBounds;\n  this.boundingClientRect = entry.boundingClientRect;\n  this.intersectionRect = entry.intersectionRect || getEmptyRect();\n  this.isIntersecting = !!entry.intersectionRect;\n\n  // Calculates the intersection ratio.\n  var targetRect = this.boundingClientRect;\n  var targetArea = targetRect.width * targetRect.height;\n  var intersectionRect = this.intersectionRect;\n  var intersectionArea = intersectionRect.width * intersectionRect.height;\n\n  // Sets intersection ratio.\n  if (targetArea) {\n    // Round the intersection ratio to avoid floating point math issues:\n    // https://github.com/w3c/IntersectionObserver/issues/324\n    this.intersectionRatio = Number((intersectionArea / targetArea).toFixed(4));\n  } else {\n    // If area is zero and is intersecting, sets to 1, otherwise to 0\n    this.intersectionRatio = this.isIntersecting ? 1 : 0;\n  }\n}\n\n\n/**\n * Creates the global IntersectionObserver constructor.\n * https://w3c.github.io/IntersectionObserver/#intersection-observer-interface\n * @param {Function} callback The function to be invoked after intersection\n *     changes have queued. The function is not invoked if the queue has\n *     been emptied by calling the `takeRecords` method.\n * @param {Object=} opt_options Optional configuration options.\n * @constructor\n */\nfunction IntersectionObserver(callback, opt_options) {\n\n  var options = opt_options || {};\n\n  if (typeof callback != 'function') {\n    throw new Error('callback must be a function');\n  }\n\n  if (options.root && options.root.nodeType != 1) {\n    throw new Error('root must be an Element');\n  }\n\n  // Binds and throttles `this._checkForIntersections`.\n  this._checkForIntersections = throttle(\n      this._checkForIntersections.bind(this), this.THROTTLE_TIMEOUT);\n\n  // Private properties.\n  this._callback = callback;\n  this._observationTargets = [];\n  this._queuedEntries = [];\n  this._rootMarginValues = this._parseRootMargin(options.rootMargin);\n\n  // Public properties.\n  this.thresholds = this._initThresholds(options.threshold);\n  this.root = options.root || null;\n  this.rootMargin = this._rootMarginValues.map(function(margin) {\n    return margin.value + margin.unit;\n  }).join(' ');\n\n  /** @private @const {!Array<!Document>} */\n  this._monitoringDocuments = [];\n  /** @private @const {!Array<function()>} */\n  this._monitoringUnsubscribes = [];\n}\n\n\n/**\n * The minimum interval within which the document will be checked for\n * intersection changes.\n */\nIntersectionObserver.prototype.THROTTLE_TIMEOUT = 100;\n\n\n/**\n * The frequency in which the polyfill polls for intersection changes.\n * this can be updated on a per instance basis and must be set prior to\n * calling `observe` on the first target.\n */\nIntersectionObserver.prototype.POLL_INTERVAL = null;\n\n/**\n * Use a mutation observer on the root element\n * to detect intersection changes.\n */\nIntersectionObserver.prototype.USE_MUTATION_OBSERVER = true;\n\n\n/**\n * Sets up the polyfill in the cross-origin mode. The result is the\n * updater function that accepts two arguments: `boundingClientRect` and\n * `intersectionRect` - just as these fields would be available to the\n * parent via `IntersectionObserverEntry`. This function should be called\n * each time the iframe receives intersection information from the parent\n * window, e.g. via messaging.\n * @return {function(DOMRect, DOMRect)}\n */\nIntersectionObserver._setupCrossOriginUpdater = function() {\n  if (!crossOriginUpdater) {\n    /**\n     * @param {DOMRect} boundingClientRect\n     * @param {DOMRect} intersectionRect\n     */\n    crossOriginUpdater = function(boundingClientRect, intersectionRect) {\n      if (!boundingClientRect || !intersectionRect) {\n        crossOriginRect = getEmptyRect();\n      } else {\n        crossOriginRect = convertFromParentRect(boundingClientRect, intersectionRect);\n      }\n      registry.forEach(function(observer) {\n        observer._checkForIntersections();\n      });\n    };\n  }\n  return crossOriginUpdater;\n};\n\n\n/**\n * Resets the cross-origin mode.\n */\nIntersectionObserver._resetCrossOriginUpdater = function() {\n  crossOriginUpdater = null;\n  crossOriginRect = null;\n};\n\n\n/**\n * Starts observing a target element for intersection changes based on\n * the thresholds values.\n * @param {Element} target The DOM element to observe.\n */\nIntersectionObserver.prototype.observe = function(target) {\n  var isTargetAlreadyObserved = this._observationTargets.some(function(item) {\n    return item.element == target;\n  });\n\n  if (isTargetAlreadyObserved) {\n    return;\n  }\n\n  if (!(target && target.nodeType == 1)) {\n    throw new Error('target must be an Element');\n  }\n\n  this._registerInstance();\n  this._observationTargets.push({element: target, entry: null});\n  this._monitorIntersections(target.ownerDocument);\n  this._checkForIntersections();\n};\n\n\n/**\n * Stops observing a target element for intersection changes.\n * @param {Element} target The DOM element to observe.\n */\nIntersectionObserver.prototype.unobserve = function(target) {\n  this._observationTargets =\n      this._observationTargets.filter(function(item) {\n        return item.element != target;\n      });\n  this._unmonitorIntersections(target.ownerDocument);\n  if (this._observationTargets.length == 0) {\n    this._unregisterInstance();\n  }\n};\n\n\n/**\n * Stops observing all target elements for intersection changes.\n */\nIntersectionObserver.prototype.disconnect = function() {\n  this._observationTargets = [];\n  this._unmonitorAllIntersections();\n  this._unregisterInstance();\n};\n\n\n/**\n * Returns any queue entries that have not yet been reported to the\n * callback and clears the queue. This can be used in conjunction with the\n * callback to obtain the absolute most up-to-date intersection information.\n * @return {Array} The currently queued entries.\n */\nIntersectionObserver.prototype.takeRecords = function() {\n  var records = this._queuedEntries.slice();\n  this._queuedEntries = [];\n  return records;\n};\n\n\n/**\n * Accepts the threshold value from the user configuration object and\n * returns a sorted array of unique threshold values. If a value is not\n * between 0 and 1 and error is thrown.\n * @private\n * @param {Array|number=} opt_threshold An optional threshold value or\n *     a list of threshold values, defaulting to [0].\n * @return {Array} A sorted list of unique and valid threshold values.\n */\nIntersectionObserver.prototype._initThresholds = function(opt_threshold) {\n  var threshold = opt_threshold || [0];\n  if (!Array.isArray(threshold)) threshold = [threshold];\n\n  return threshold.sort().filter(function(t, i, a) {\n    if (typeof t != 'number' || isNaN(t) || t < 0 || t > 1) {\n      throw new Error('threshold must be a number between 0 and 1 inclusively');\n    }\n    return t !== a[i - 1];\n  });\n};\n\n\n/**\n * Accepts the rootMargin value from the user configuration object\n * and returns an array of the four margin values as an object containing\n * the value and unit properties. If any of the values are not properly\n * formatted or use a unit other than px or %, and error is thrown.\n * @private\n * @param {string=} opt_rootMargin An optional rootMargin value,\n *     defaulting to '0px'.\n * @return {Array<Object>} An array of margin objects with the keys\n *     value and unit.\n */\nIntersectionObserver.prototype._parseRootMargin = function(opt_rootMargin) {\n  var marginString = opt_rootMargin || '0px';\n  var margins = marginString.split(/\\s+/).map(function(margin) {\n    var parts = /^(-?\\d*\\.?\\d+)(px|%)$/.exec(margin);\n    if (!parts) {\n      throw new Error('rootMargin must be specified in pixels or percent');\n    }\n    return {value: parseFloat(parts[1]), unit: parts[2]};\n  });\n\n  // Handles shorthand.\n  margins[1] = margins[1] || margins[0];\n  margins[2] = margins[2] || margins[0];\n  margins[3] = margins[3] || margins[1];\n\n  return margins;\n};\n\n\n/**\n * Starts polling for intersection changes if the polling is not already\n * happening, and if the page's visibility state is visible.\n * @param {!Document} doc\n * @private\n */\nIntersectionObserver.prototype._monitorIntersections = function(doc) {\n  var win = doc.defaultView;\n  if (!win) {\n    // Already destroyed.\n    return;\n  }\n  if (this._monitoringDocuments.indexOf(doc) != -1) {\n    // Already monitoring.\n    return;\n  }\n\n  // Private state for monitoring.\n  var callback = this._checkForIntersections;\n  var monitoringInterval = null;\n  var domObserver = null;\n\n  // If a poll interval is set, use polling instead of listening to\n  // resize and scroll events or DOM mutations.\n  if (this.POLL_INTERVAL) {\n    monitoringInterval = win.setInterval(callback, this.POLL_INTERVAL);\n  } else {\n    addEvent(win, 'resize', callback, true);\n    addEvent(doc, 'scroll', callback, true);\n    if (this.USE_MUTATION_OBSERVER && 'MutationObserver' in win) {\n      domObserver = new win.MutationObserver(callback);\n      domObserver.observe(doc, {\n        attributes: true,\n        childList: true,\n        characterData: true,\n        subtree: true\n      });\n    }\n  }\n\n  this._monitoringDocuments.push(doc);\n  this._monitoringUnsubscribes.push(function() {\n    // Get the window object again. When a friendly iframe is destroyed, it\n    // will be null.\n    var win = doc.defaultView;\n\n    if (win) {\n      if (monitoringInterval) {\n        win.clearInterval(monitoringInterval);\n      }\n      removeEvent(win, 'resize', callback, true);\n    }\n\n    removeEvent(doc, 'scroll', callback, true);\n    if (domObserver) {\n      domObserver.disconnect();\n    }\n  });\n\n  // Also monitor the parent.\n  if (doc != (this.root && this.root.ownerDocument || document)) {\n    var frame = getFrameElement(doc);\n    if (frame) {\n      this._monitorIntersections(frame.ownerDocument);\n    }\n  }\n};\n\n\n/**\n * Stops polling for intersection changes.\n * @param {!Document} doc\n * @private\n */\nIntersectionObserver.prototype._unmonitorIntersections = function(doc) {\n  var index = this._monitoringDocuments.indexOf(doc);\n  if (index == -1) {\n    return;\n  }\n\n  var rootDoc = (this.root && this.root.ownerDocument || document);\n\n  // Check if any dependent targets are still remaining.\n  var hasDependentTargets =\n      this._observationTargets.some(function(item) {\n        var itemDoc = item.element.ownerDocument;\n        // Target is in this context.\n        if (itemDoc == doc) {\n          return true;\n        }\n        // Target is nested in this context.\n        while (itemDoc && itemDoc != rootDoc) {\n          var frame = getFrameElement(itemDoc);\n          itemDoc = frame && frame.ownerDocument;\n          if (itemDoc == doc) {\n            return true;\n          }\n        }\n        return false;\n      });\n  if (hasDependentTargets) {\n    return;\n  }\n\n  // Unsubscribe.\n  var unsubscribe = this._monitoringUnsubscribes[index];\n  this._monitoringDocuments.splice(index, 1);\n  this._monitoringUnsubscribes.splice(index, 1);\n  unsubscribe();\n\n  // Also unmonitor the parent.\n  if (doc != rootDoc) {\n    var frame = getFrameElement(doc);\n    if (frame) {\n      this._unmonitorIntersections(frame.ownerDocument);\n    }\n  }\n};\n\n\n/**\n * Stops polling for intersection changes.\n * @param {!Document} doc\n * @private\n */\nIntersectionObserver.prototype._unmonitorAllIntersections = function() {\n  var unsubscribes = this._monitoringUnsubscribes.slice(0);\n  this._monitoringDocuments.length = 0;\n  this._monitoringUnsubscribes.length = 0;\n  for (var i = 0; i < unsubscribes.length; i++) {\n    unsubscribes[i]();\n  }\n};\n\n\n/**\n * Scans each observation target for intersection changes and adds them\n * to the internal entries queue. If new entries are found, it\n * schedules the callback to be invoked.\n * @private\n */\nIntersectionObserver.prototype._checkForIntersections = function() {\n  if (!this.root && crossOriginUpdater && !crossOriginRect) {\n    // Cross origin monitoring, but no initial data available yet.\n    return;\n  }\n\n  var rootIsInDom = this._rootIsInDom();\n  var rootRect = rootIsInDom ? this._getRootRect() : getEmptyRect();\n\n  this._observationTargets.forEach(function(item) {\n    var target = item.element;\n    var targetRect = getBoundingClientRect(target);\n    var rootContainsTarget = this._rootContainsTarget(target);\n    var oldEntry = item.entry;\n    var intersectionRect = rootIsInDom && rootContainsTarget &&\n        this._computeTargetAndRootIntersection(target, targetRect, rootRect);\n\n    var newEntry = item.entry = new IntersectionObserverEntry({\n      time: now(),\n      target: target,\n      boundingClientRect: targetRect,\n      rootBounds: crossOriginUpdater && !this.root ? null : rootRect,\n      intersectionRect: intersectionRect\n    });\n\n    if (!oldEntry) {\n      this._queuedEntries.push(newEntry);\n    } else if (rootIsInDom && rootContainsTarget) {\n      // If the new entry intersection ratio has crossed any of the\n      // thresholds, add a new entry.\n      if (this._hasCrossedThreshold(oldEntry, newEntry)) {\n        this._queuedEntries.push(newEntry);\n      }\n    } else {\n      // If the root is not in the DOM or target is not contained within\n      // root but the previous entry for this target had an intersection,\n      // add a new record indicating removal.\n      if (oldEntry && oldEntry.isIntersecting) {\n        this._queuedEntries.push(newEntry);\n      }\n    }\n  }, this);\n\n  if (this._queuedEntries.length) {\n    this._callback(this.takeRecords(), this);\n  }\n};\n\n\n/**\n * Accepts a target and root rect computes the intersection between then\n * following the algorithm in the spec.\n * TODO(philipwalton): at this time clip-path is not considered.\n * https://w3c.github.io/IntersectionObserver/#calculate-intersection-rect-algo\n * @param {Element} target The target DOM element\n * @param {Object} targetRect The bounding rect of the target.\n * @param {Object} rootRect The bounding rect of the root after being\n *     expanded by the rootMargin value.\n * @return {?Object} The final intersection rect object or undefined if no\n *     intersection is found.\n * @private\n */\nIntersectionObserver.prototype._computeTargetAndRootIntersection =\n    function(target, targetRect, rootRect) {\n  // If the element isn't displayed, an intersection can't happen.\n  if (window.getComputedStyle(target).display == 'none') return;\n\n  var intersectionRect = targetRect;\n  var parent = getParentNode(target);\n  var atRoot = false;\n\n  while (!atRoot && parent) {\n    var parentRect = null;\n    var parentComputedStyle = parent.nodeType == 1 ?\n        window.getComputedStyle(parent) : {};\n\n    // If the parent isn't displayed, an intersection can't happen.\n    if (parentComputedStyle.display == 'none') return null;\n\n    if (parent == this.root || parent.nodeType == /* DOCUMENT */ 9) {\n      atRoot = true;\n      if (parent == this.root || parent == document) {\n        if (crossOriginUpdater && !this.root) {\n          if (!crossOriginRect ||\n              crossOriginRect.width == 0 && crossOriginRect.height == 0) {\n            // A 0-size cross-origin intersection means no-intersection.\n            parent = null;\n            parentRect = null;\n            intersectionRect = null;\n          } else {\n            parentRect = crossOriginRect;\n          }\n        } else {\n          parentRect = rootRect;\n        }\n      } else {\n        // Check if there's a frame that can be navigated to.\n        var frame = getParentNode(parent);\n        var frameRect = frame && getBoundingClientRect(frame);\n        var frameIntersect =\n            frame &&\n            this._computeTargetAndRootIntersection(frame, frameRect, rootRect);\n        if (frameRect && frameIntersect) {\n          parent = frame;\n          parentRect = convertFromParentRect(frameRect, frameIntersect);\n        } else {\n          parent = null;\n          intersectionRect = null;\n        }\n      }\n    } else {\n      // If the element has a non-visible overflow, and it's not the <body>\n      // or <html> element, update the intersection rect.\n      // Note: <body> and <html> cannot be clipped to a rect that's not also\n      // the document rect, so no need to compute a new intersection.\n      var doc = parent.ownerDocument;\n      if (parent != doc.body &&\n          parent != doc.documentElement &&\n          parentComputedStyle.overflow != 'visible') {\n        parentRect = getBoundingClientRect(parent);\n      }\n    }\n\n    // If either of the above conditionals set a new parentRect,\n    // calculate new intersection data.\n    if (parentRect) {\n      intersectionRect = computeRectIntersection(parentRect, intersectionRect);\n    }\n    if (!intersectionRect) break;\n    parent = parent && getParentNode(parent);\n  }\n  return intersectionRect;\n};\n\n\n/**\n * Returns the root rect after being expanded by the rootMargin value.\n * @return {Object} The expanded root rect.\n * @private\n */\nIntersectionObserver.prototype._getRootRect = function() {\n  var rootRect;\n  if (this.root) {\n    rootRect = getBoundingClientRect(this.root);\n  } else {\n    // Use <html>/<body> instead of window since scroll bars affect size.\n    var html = document.documentElement;\n    var body = document.body;\n    rootRect = {\n      top: 0,\n      left: 0,\n      right: html.clientWidth || body.clientWidth,\n      width: html.clientWidth || body.clientWidth,\n      bottom: html.clientHeight || body.clientHeight,\n      height: html.clientHeight || body.clientHeight\n    };\n  }\n  return this._expandRectByRootMargin(rootRect);\n};\n\n\n/**\n * Accepts a rect and expands it by the rootMargin value.\n * @param {Object} rect The rect object to expand.\n * @return {Object} The expanded rect.\n * @private\n */\nIntersectionObserver.prototype._expandRectByRootMargin = function(rect) {\n  var margins = this._rootMarginValues.map(function(margin, i) {\n    return margin.unit == 'px' ? margin.value :\n        margin.value * (i % 2 ? rect.width : rect.height) / 100;\n  });\n  var newRect = {\n    top: rect.top - margins[0],\n    right: rect.right + margins[1],\n    bottom: rect.bottom + margins[2],\n    left: rect.left - margins[3]\n  };\n  newRect.width = newRect.right - newRect.left;\n  newRect.height = newRect.bottom - newRect.top;\n\n  return newRect;\n};\n\n\n/**\n * Accepts an old and new entry and returns true if at least one of the\n * threshold values has been crossed.\n * @param {?IntersectionObserverEntry} oldEntry The previous entry for a\n *    particular target element or null if no previous entry exists.\n * @param {IntersectionObserverEntry} newEntry The current entry for a\n *    particular target element.\n * @return {boolean} Returns true if a any threshold has been crossed.\n * @private\n */\nIntersectionObserver.prototype._hasCrossedThreshold =\n    function(oldEntry, newEntry) {\n\n  // To make comparing easier, an entry that has a ratio of 0\n  // but does not actually intersect is given a value of -1\n  var oldRatio = oldEntry && oldEntry.isIntersecting ?\n      oldEntry.intersectionRatio || 0 : -1;\n  var newRatio = newEntry.isIntersecting ?\n      newEntry.intersectionRatio || 0 : -1;\n\n  // Ignore unchanged ratios\n  if (oldRatio === newRatio) return;\n\n  for (var i = 0; i < this.thresholds.length; i++) {\n    var threshold = this.thresholds[i];\n\n    // Return true if an entry matches a threshold or if the new ratio\n    // and the old ratio are on the opposite sides of a threshold.\n    if (threshold == oldRatio || threshold == newRatio ||\n        threshold < oldRatio !== threshold < newRatio) {\n      return true;\n    }\n  }\n};\n\n\n/**\n * Returns whether or not the root element is an element and is in the DOM.\n * @return {boolean} True if the root element is an element and is in the DOM.\n * @private\n */\nIntersectionObserver.prototype._rootIsInDom = function() {\n  return !this.root || containsDeep(document, this.root);\n};\n\n\n/**\n * Returns whether or not the target element is a child of root.\n * @param {Element} target The target element to check.\n * @return {boolean} True if the target element is a child of root.\n * @private\n */\nIntersectionObserver.prototype._rootContainsTarget = function(target) {\n  return containsDeep(this.root || document, target) &&\n    (!this.root || this.root.ownerDocument == target.ownerDocument);\n};\n\n\n/**\n * Adds the instance to the global IntersectionObserver registry if it isn't\n * already present.\n * @private\n */\nIntersectionObserver.prototype._registerInstance = function() {\n  if (registry.indexOf(this) < 0) {\n    registry.push(this);\n  }\n};\n\n\n/**\n * Removes the instance from the global IntersectionObserver registry.\n * @private\n */\nIntersectionObserver.prototype._unregisterInstance = function() {\n  var index = registry.indexOf(this);\n  if (index != -1) registry.splice(index, 1);\n};\n\n\n/**\n * Returns the result of the performance.now() method or null in browsers\n * that don't support the API.\n * @return {number} The elapsed time since the page was requested.\n */\nfunction now() {\n  return window.performance && performance.now && performance.now();\n}\n\n\n/**\n * Throttles a function and delays its execution, so it's only called at most\n * once within a given time period.\n * @param {Function} fn The function to throttle.\n * @param {number} timeout The amount of time that must pass before the\n *     function can be called again.\n * @return {Function} The throttled function.\n */\nfunction throttle(fn, timeout) {\n  var timer = null;\n  return function () {\n    if (!timer) {\n      timer = setTimeout(function() {\n        fn();\n        timer = null;\n      }, timeout);\n    }\n  };\n}\n\n\n/**\n * Adds an event handler to a DOM node ensuring cross-browser compatibility.\n * @param {Node} node The DOM node to add the event handler to.\n * @param {string} event The event name.\n * @param {Function} fn The event handler to add.\n * @param {boolean} opt_useCapture Optionally adds the even to the capture\n *     phase. Note: this only works in modern browsers.\n */\nfunction addEvent(node, event, fn, opt_useCapture) {\n  if (typeof node.addEventListener == 'function') {\n    node.addEventListener(event, fn, opt_useCapture || false);\n  }\n  else if (typeof node.attachEvent == 'function') {\n    node.attachEvent('on' + event, fn);\n  }\n}\n\n\n/**\n * Removes a previously added event handler from a DOM node.\n * @param {Node} node The DOM node to remove the event handler from.\n * @param {string} event The event name.\n * @param {Function} fn The event handler to remove.\n * @param {boolean} opt_useCapture If the event handler was added with this\n *     flag set to true, it should be set to true here in order to remove it.\n */\nfunction removeEvent(node, event, fn, opt_useCapture) {\n  if (typeof node.removeEventListener == 'function') {\n    node.removeEventListener(event, fn, opt_useCapture || false);\n  }\n  else if (typeof node.detatchEvent == 'function') {\n    node.detatchEvent('on' + event, fn);\n  }\n}\n\n\n/**\n * Returns the intersection between two rect objects.\n * @param {Object} rect1 The first rect.\n * @param {Object} rect2 The second rect.\n * @return {?Object} The intersection rect or undefined if no intersection\n *     is found.\n */\nfunction computeRectIntersection(rect1, rect2) {\n  var top = Math.max(rect1.top, rect2.top);\n  var bottom = Math.min(rect1.bottom, rect2.bottom);\n  var left = Math.max(rect1.left, rect2.left);\n  var right = Math.min(rect1.right, rect2.right);\n  var width = right - left;\n  var height = bottom - top;\n\n  return (width >= 0 && height >= 0) && {\n    top: top,\n    bottom: bottom,\n    left: left,\n    right: right,\n    width: width,\n    height: height\n  } || null;\n}\n\n\n/**\n * Shims the native getBoundingClientRect for compatibility with older IE.\n * @param {Element} el The element whose bounding rect to get.\n * @return {Object} The (possibly shimmed) rect of the element.\n */\nfunction getBoundingClientRect(el) {\n  var rect;\n\n  try {\n    rect = el.getBoundingClientRect();\n  } catch (err) {\n    // Ignore Windows 7 IE11 \"Unspecified error\"\n    // https://github.com/w3c/IntersectionObserver/pull/205\n  }\n\n  if (!rect) return getEmptyRect();\n\n  // Older IE\n  if (!(rect.width && rect.height)) {\n    rect = {\n      top: rect.top,\n      right: rect.right,\n      bottom: rect.bottom,\n      left: rect.left,\n      width: rect.right - rect.left,\n      height: rect.bottom - rect.top\n    };\n  }\n  return rect;\n}\n\n\n/**\n * Returns an empty rect object. An empty rect is returned when an element\n * is not in the DOM.\n * @return {Object} The empty rect.\n */\nfunction getEmptyRect() {\n  return {\n    top: 0,\n    bottom: 0,\n    left: 0,\n    right: 0,\n    width: 0,\n    height: 0\n  };\n}\n\n\n/**\n * Inverts the intersection and bounding rect from the parent (frame) BCR to\n * the local BCR space.\n * @param {Object} parentBoundingRect The parent's bound client rect.\n * @param {Object} parentIntersectionRect The parent's own intersection rect.\n * @return {Object} The local root bounding rect for the parent's children.\n */\nfunction convertFromParentRect(parentBoundingRect, parentIntersectionRect) {\n  var top = parentIntersectionRect.top - parentBoundingRect.top;\n  var left = parentIntersectionRect.left - parentBoundingRect.left;\n  return {\n    top: top,\n    left: left,\n    height: parentIntersectionRect.height,\n    width: parentIntersectionRect.width,\n    bottom: top + parentIntersectionRect.height,\n    right: left + parentIntersectionRect.width\n  };\n}\n\n\n/**\n * Checks to see if a parent element contains a child element (including inside\n * shadow DOM).\n * @param {Node} parent The parent element.\n * @param {Node} child The child element.\n * @return {boolean} True if the parent node contains the child node.\n */\nfunction containsDeep(parent, child) {\n  var node = child;\n  while (node) {\n    if (node == parent) return true;\n\n    node = getParentNode(node);\n  }\n  return false;\n}\n\n\n/**\n * Gets the parent node of an element or its host element if the parent node\n * is a shadow root.\n * @param {Node} node The node whose parent to get.\n * @return {Node|null} The parent node or null if no parent exists.\n */\nfunction getParentNode(node) {\n  var parent = node.parentNode;\n\n  if (node.nodeType == /* DOCUMENT */ 9 && node != document) {\n    // If this node is a document node, look for the embedding frame.\n    return getFrameElement(node);\n  }\n\n  if (parent && parent.nodeType == 11 && parent.host) {\n    // If the parent is a shadow root, return the host element.\n    return parent.host;\n  }\n\n  if (parent && parent.assignedSlot) {\n    // If the parent is distributed in a <slot>, return the parent of a slot.\n    return parent.assignedSlot.parentNode;\n  }\n\n  return parent;\n}\n\n\n/**\n * Returns the embedding frame element, if any.\n * @param {!Document} doc\n * @return {!Element}\n */\nfunction getFrameElement(doc) {\n  try {\n    return doc.defaultView && doc.defaultView.frameElement || null;\n  } catch (e) {\n    // Ignore the error.\n    return null;\n  }\n}\n\n\n// Exposes the constructors globally.\nwindow.IntersectionObserver = IntersectionObserver;\nwindow.IntersectionObserverEntry = IntersectionObserverEntry;\n\n}());\n\n\n//# sourceURL=webpack:///./node_modules/intersection-observer/intersection-observer.js?");

/***/ })

}]);