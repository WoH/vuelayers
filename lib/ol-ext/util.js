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
import { getUid } from 'ol';
import { isFunction, reduce } from '../util/minilo';

function getObjectUid(object) {
  return getUid(object);
}
/**
 * heuristic check that value is ol collection
 * @param value
 * @return {boolean}
 */

function isCollection(value) {
  return value && isFunction(value.getArray);
}
/**
 * heuristic check that value is ol vector source
 * @param value
 * @return {*}
 */

function isVectorSource(value) {
  return value && isFunction(value.getAttributions) && isFunction(value.getFeatureById);
}
/**
 * @param value
 * @return {*}
 */

function isCircle(value) {
  return isFunction(value.getCenter) && isFunction(value.getRadius);
}
function cleanSourceExtraParams(params, filterKeys) {
  return reduce(params, function (params, value, key) {
    key = key.toUpperCase();

    if (filterKeys.includes(key)) {
      return params;
    }

    params[key] = value;
    return params;
  }, {});
}

export { getObjectUid, isCollection, isVectorSource, isCircle, cleanSourceExtraParams };
