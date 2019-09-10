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
import Vue from 'vue';
import { isPlainObject } from '../util/minilo';
import projTransforms from './proj-transforms';

var geometryContainer = {
  mixins: [projTransforms],
  methods: {
    /**
     * @return {{
     *     getGeometry: function(): module:ol/geom/Geometry~Geometry|undefined,
     *     setGeometry: function(module:ol/geom/Geometry~Geometry|undefined)
     *   }|undefined}
     * @protected
     */
    getGeometryTarget: function getGeometryTarget() {
      throw new Error('Not implemented method');
    },

    /**
     * @return {module:ol/geom/Geometry~Geometry|undefined}
     */
    getGeometry: function getGeometry() {
      return this._geometry;
    },

    /**
     * @return {Object}
     * @protected
     */
    getServices: function getServices() {
      var vm = this;
      return {
        get geometryContainer() {
          return vm;
        }

      };
    },

    /**
     * @param {module:ol/geom/Geometry~Geometry|Vue|Object|undefined} geom
     * @return {void}
     * @throws {AssertionError}
     */
    setGeometry: function setGeometry(geom) {
      if (geom instanceof Vue) {
        geom = geom.$geometry;
      } else if (isPlainObject(geom)) {
        geom = this.readGeometryInDataProj(geom);
      }

      if (geom !== this._geometry) {
        this._geometry = geom;
      }

      var geomTarget = this.getGeometryTarget();

      if (geomTarget && geom !== geomTarget.getGeometry()) {
        geomTarget.setGeometry(geom);
      }
    }
  },
  created: function created() {
    /**
     * @type {module:ol/geom/Geometry~Geometry|undefined}
     * @private
     */
    this._geometry = undefined;
    Object.defineProperties(this, {
      $geometry: {
        enumerable: true,
        get: this.getGeometry
      }
    });
  }
};

export default geometryContainer;
