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
import { merge } from 'rxjs/_esm5/internal/observable/merge';
import { distinctUntilChanged } from 'rxjs/_esm5/internal/operators/distinctUntilChanged';
import { map } from 'rxjs/_esm5/internal/operators/map';
import { debounceTime } from 'rxjs/_esm5/internal/operators/debounceTime';
import { isEqual, isFunction } from '../util/minilo';
import fromOlEvent from './from-ol-event';

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
 * Creates Observable from OpenLayers change:* event
 * @param {module:ol/Observable~Observable} target
 * @param {string|string[]} [prop]
 * @param {boolean|function(a, b):boolean|undefined} [distinct] Distinct values by isEqual fn or by custom comparator
 * @param {number|undefined} [debounce] Debounce values by passed amount of ms.
 * @param {function|undefined} [selector] Custom selector
 * @return {Observable<{prop: string, value: *}>}
 */

function fromOlChangeEvent(target, prop, distinct, debounce, selector) {
  if (Array.isArray(prop)) {
    return merge.apply(void 0, _toConsumableArray(prop.map(function (p) {
      return fromOlChangeEvent(target, p);
    })));
  }

  selector = selector || function (target, prop) {
    return target.get(prop);
  };

  var event = "change:".concat(prop);
  var observable = fromOlEvent(target, event, function () {
    return selector(target, prop);
  });
  var operations = [];

  if (debounce != null) {
    operations.push(debounceTime(debounce));
  }

  if (distinct) {
    isFunction(distinct) || (distinct = isEqual);
    operations.push(distinctUntilChanged(distinct));
  }

  operations.push(map(function (value) {
    return {
      prop: prop,
      value: value
    };
  }));
  return observable.pipe.apply(observable, operations);
}

export default fromOlChangeEvent;
