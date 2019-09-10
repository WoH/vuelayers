/**
 * VueLayers
 * Web map Vue components with the power of OpenLayers
 *
 * @package vuelayers
 * @author Vladimir Vershinin <ghettovoice@gmail.com>
 * @version 0.11.5-beta.8
 * @license MIT
 * @copyright (c) 2017-2019, Vladimir Vershinin <ghettovoice@gmail.com>
 */
import { fromEventPattern } from 'rxjs/_esm5/internal/observable/fromEventPattern';
import { merge } from 'rxjs/_esm5/internal/observable/merge';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

/**
 * Creates an Observable using OpenLayers event pattern that emits events coming from the given event target.
 *
 * @example **Subscribe on view center change events**
 * const map = ol.Map({ ... })
 * const changes = Observable.fromOlEvent(map.getView(), 'change:center')
 *
 * changes.subscribe(({ coordinate }) => console.log(coordinate))
 *
 * @param {module:ol/Observable~Observable} target OpenLayers event target.
 * @param {string|Object[]} eventName The event name of interest, being emitted by the `target`
 *                          or an array of events/selectors like `[{ event: 'event1', selector?: x => x }, ...]`.
 * @param {function(...*): *} [selector] An optional function to post-process results. It takes the arguments
 *    from the event handler and should return a single value.
 * @return {Observable<T>}
 * @memberOf {Observable}
 */

function fromOlEvent(target, eventName, selector) {
  if (Array.isArray(eventName)) {
    return merge.apply(void 0, _toConsumableArray(eventName.map(function (elem) {
      var eventName, selector;

      if (_typeof(elem) === 'object') {
        eventName = elem.event;
        selector = elem.selector;
      } else {
        eventName = elem;
      }

      return fromOlEvent(target, eventName, selector);
    })));
  }

  return fromEventPattern(function (handler) {
    return target.on(eventName, handler);
  }, function (handler) {
    return target.un(eventName, handler);
  }, selector);
}

export default fromOlEvent;
