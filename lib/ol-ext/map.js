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
import PluggableMap from 'ol/PluggableMap';
import Vue from 'vue';

function getMapDataProjection(map) {
  if (map instanceof Vue) {
    return map.dataProjection;
  } else if (map instanceof PluggableMap) {
    return map.get('dataProjection');
  }

  throw new Error('Illegal map argument');
}
function setMapDataProjection(map, dataProjection) {
  if (map instanceof Vue) {
    map.dataProjection = dataProjection;
    return map;
  } else if (map instanceof PluggableMap) {
    map.set('dataProjection', dataProjection);
    return map;
  }

  throw new Error('Illegal map argument');
}

export { getMapDataProjection, setMapDataProjection };
