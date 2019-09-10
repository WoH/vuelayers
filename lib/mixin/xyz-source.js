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
import XYZSource from 'ol/source/XYZ';
import tileSource from './tile-source';

var xyzSource = {
  mixins: [tileSource],
  methods: {
    /**
     * @return {XYZ}
     * @protected
     */
    createSource: function createSource() {
      return new XYZSource({
        attributions: this.attributions,
        attributionsCollapsible: this.attributionsCollapsible,
        cacheSize: this.cacheSize,
        crossOrigin: this.crossOrigin,
        maxZoom: this.maxZoom,
        minZoom: this.minZoom,
        opaque: this.opaque,
        projection: this.projection,
        reprojectionErrorThreshold: this.reprojectionErrorThreshold,
        tileGrid: this._tileGrid,
        tilePixelRatio: this.tilePixelRatio,
        tileUrlFunction: this.urlFunc,
        tileLoadFunction: this.tileLoadFunction,
        wrapX: this.wrapX,
        transition: this.transition
      });
    }
  }
};

export default xyzSource;
