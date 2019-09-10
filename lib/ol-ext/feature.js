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
import Feature from 'ol/Feature';
import uuid from 'uuid/v4';
import Vue from 'vue';
import { isNumber, isPlainObject, isString } from '../util/minilo';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

/**
 * @param {Object|Vue|Feature|string|number} feature
 * @return {string|number}
 * @throws {Error}
 */

function getFeatureId(feature) {
  if (isPlainObject(feature) || feature instanceof Vue) {
    return feature.id;
  } else if (feature instanceof Feature) {
    return feature.getId();
  } else if (isString(feature) || isNumber(feature)) {
    return feature;
  }

  throw new Error('Illegal feature format');
}
/**
 * @param {Feature|Vue|Object} feature
 * @param {string} featureId
 * @returns {Feature|Vue|Object}
 */

function setFeatureId(feature, featureId) {
  if (isPlainObject(feature) || feature instanceof Vue) {
    feature.id = featureId;
    return feature;
  } else if (feature instanceof Feature) {
    feature.setId(featureId);
    return feature;
  }

  throw new Error('Illegal feature format');
}
/**
 * @param {Feature} feature
 * @param {string|undefined} defaultFeatureId
 * @returns {Feature}
 */

function initializeFeature(feature, defaultFeatureId) {
  if (getFeatureId(feature) == null) {
    setFeatureId(feature, defaultFeatureId || uuid());
  }

  return feature;
}
/**
 * @param {Feature} destFeature
 * @param {Feature} srcFeature
 * @returns {Feature}
 */

function mergeFeatures(destFeature, srcFeature) {
  destFeature.setProperties(_objectSpread({}, srcFeature.getProperties()));
  destFeature.setGeometry(srcFeature.getGeometry().clone());
  destFeature.setStyle(srcFeature.getStyle() != null ? srcFeature.getStyle().clone() : undefined);
  return destFeature;
}

export { getFeatureId, setFeatureId, initializeFeature, mergeFeatures };
