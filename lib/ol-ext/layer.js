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
import BaseLayer from 'ol/layer/Base';
import uuid from 'uuid/v4';
import Vue from 'vue';

function getLayerId(layer) {
  if (layer instanceof Vue) {
    return layer.id;
  } else if (layer instanceof BaseLayer) {
    return layer.get('id');
  }

  throw new Error('Illegal layer argument');
}
function setLayerId(layer, layerId) {
  if (layer instanceof Vue) {
    layer.id = layerId;
    return layer;
  } else if (layer instanceof BaseLayer) {
    layer.set('id', layerId);
    return layer;
  }

  throw new Error('Illegal layer argument');
}
function initializeLayer(layer, defaultLayerId) {
  if (getLayerId(layer) == null) {
    setLayerId(layer, defaultLayerId || uuid());
  }

  return layer;
}

export { getLayerId, setLayerId, initializeLayer };
