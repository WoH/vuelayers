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
import { distinctUntilChanged } from 'rxjs/_esm5/internal/operators/distinctUntilChanged';
import { map } from 'rxjs/_esm5/internal/operators/map';
import { throttleTime } from 'rxjs/_esm5/internal/operators/throttleTime';
import { boundingExtent, findPointOnSurface, transforms } from '../ol-ext';
import { observableFromOlEvent } from '../rx-ext';
import { hasGeometry } from '../util/assert';
import { isEqual } from '../util/minilo';
import mergeDescriptors from '../util/multi-merge-descriptors';
import cmp from './ol-virt-cmp';
import projTransforms from './proj-transforms';
import useMapCmp from './use-map-cmp';

var geometry = {
  mixins: [cmp, useMapCmp, projTransforms],
  props: {
    /**
     * Coordinates in the map view projection.
     * @type {number[]}
     */
    coordinates: {
      type: Array,
      required: true,
      validator: function validator(val) {
        return val.length;
      }
    }
  },
  computed: {
    /**
     * @type {string}
     * @abstract
     * @readonly
     */
    type: function type() {
      throw new Error('Not implemented computed property');
    },

    /**
     * @type {number[]|undefined}
     */
    extent: function extent() {
      if (this.extentViewProj && this.resolvedDataProjection) {
        return this.extentToDataProj(this.extentViewProj);
      }
    },

    /**
     * @type {number[]|undefined}
     */
    extentViewProj: function extentViewProj() {
      if (this.rev && this.$geometry) {
        return this.$geometry.getExtent();
      }
    },

    /**
     * @type {number[]|undefined}
     */
    point: function point() {
      if (this.pointViewProj && this.resolvedDataProjection) {
        return this.pointToDataProj(this.pointViewProj);
      }
    },

    /**
     * @type {number[]}
     */
    pointViewProj: function pointViewProj() {
      if (this.rev && this.$geometry) {
        return findPointOnSurface(this.$geometry);
      }
    },

    /**
     * @type {number[]|undefined}
     */
    coordinatesViewProj: function coordinatesViewProj() {
      if (this.rev && this.$geometry) {
        return this.$geometry.getCoordinates();
      }
    }
  },
  methods: {
    /**
     * @return {module:ol/geom/Geometry~Geometry|Promise<module:ol/geom/Geometry~Geometry>}
     * @protected
     */
    createOlObject: function createOlObject() {
      return this.createGeometry();
    },

    /**
     * @return {module:ol/geom/Geometry~Geometry|Promise<module:ol/geom/Geometry~Geometry>}
     * @protected
     * @abstract
     */
    createGeometry: function createGeometry() {
      throw new Error('Not implemented method');
    },

    /**
     * @return {number[]}
     */
    getCoordinates: function getCoordinates() {
      hasGeometry(this);
      return this.toDataProj(this.$geometry.getCoordinates());
    },

    /**
     * @param {number[]} coordinates
     */
    setCoordinates: function setCoordinates(coordinates) {
      hasGeometry(this);
      this.$geometry.setCoordinates(this.toViewProj(coordinates));
    },

    /**
     * @return {Promise}
     * @throws {AssertionError}
     * @protected
     */
    init: function init() {
      this.setupTransformFunctions();
      return cmp.methods.init.call(this);
    },

    /**
     * @protected
     */
    setupTransformFunctions: function setupTransformFunctions() {
      var _this = this;

      // define helper methods based on geometry type
      var transform = transforms[this.type].transform;
      /**
       * @method
       * @param {number[]} coordinates
       * @return {number[]}
       * @protected
       */

      this.toDataProj = function (coordinates) {
        return transform(coordinates, _this.viewProjection, _this.resolvedDataProjection);
      };
      /**
       * @method
       * @param {number[]} coordinates
       * @return {number[]}
       * @protected
       */


      this.toViewProj = function (coordinates) {
        return transform(coordinates, _this.resolvedDataProjection, _this.viewProjection);
      };
    },

    /**
     * @return {void|Promise}
     * @protected
     */
    deinit: function deinit() {
      return cmp.methods.deinit.call(this);
    },

    /**
     * @return {Promise}
     */
    refresh: function refresh() {
      return cmp.methods.refresh.call(this);
    },

    /**
     * @return {Object}
     * @protected
     */
    getServices: function getServices() {
      var vm = this;
      return mergeDescriptors(cmp.methods.getServices.call(this), {
        get geometry() {
          return vm.$geometry;
        }

      });
    },

    /**
     * @return {void}
     * @protected
     */
    mount: function mount() {
      this.$geometryContainer && this.$geometryContainer.setGeometry(this);
      this.subscribeAll();
    },

    /**
     * @return {void}
     * @protected
     */
    unmount: function unmount() {
      this.unsubscribeAll();
      this.$geometryContainer && this.$geometryContainer.setGeometry(undefined);
    },

    /**
     * @return {void}
     * @protected
     */
    subscribeAll: function subscribeAll() {
      subscribeToGeomChanges.call(this);
    }
  },
  watch: {
    coordinates: function coordinates(value) {
      if (!this.$geometry || !this.$view) return; // compares in data projection

      var isEq = isEqualGeom({
        coordinates: value,
        extent: boundingExtent(value)
      }, {
        coordinates: this.getCoordinates(),
        extent: this.extent
      });
      if (isEq) return;
      this.setCoordinates(value);
    },
    resolvedDataProjection: function resolvedDataProjection() {
      if (!this.$geometry) return;
      this.setupTransformFunctions();
      this.setCoordinates(this.coordinates);
    }
  },
  stubVNode: {
    empty: function empty() {
      return this.$options.name;
    }
  },
  created: function created() {
    defineServices.call(this);
  }
};

function defineServices() {
  var _this2 = this;

  Object.defineProperties(this, {
    /**
     * @type {module:ol/geom/Geometry~Geometry|undefined}
     */
    $geometry: {
      enumerable: true,
      get: function get() {
        return _this2.$olObject;
      }
    },

    /**
     * @type {module:ol/PluggableMap~PluggableMap|undefined}
     */
    $map: {
      enumerable: true,
      get: function get() {
        return _this2.$services && _this2.$services.map;
      }
    },

    /**
     * @type {module:ol/View~View|undefined}
     */
    $view: {
      enumerable: true,
      get: function get() {
        return _this2.$services && _this2.$services.view;
      }
    },

    /**
     * @type {Object|undefined}
     */
    $geometryContainer: {
      enumerable: true,
      get: function get() {
        return _this2.$services && _this2.$services.geometryContainer;
      }
    }
  });
}
/**
 * @return {void}
 * @private
 */


function subscribeToGeomChanges() {
  var _this3 = this;

  hasGeometry(this);
  var ft = 100;
  var changes = observableFromOlEvent(this.$geometry, 'change', function () {
    return {
      coordinates: _this3.getCoordinates(),
      extent: _this3.extent
    };
  }).pipe(throttleTime(ft), distinctUntilChanged(isEqualGeom), map(function (_ref) {
    var coordinates = _ref.coordinates;
    return {
      prop: 'coordinates',
      value: coordinates
    };
  }));
  this.subscribeTo(changes, function (_ref2) {
    var prop = _ref2.prop,
        value = _ref2.value;
    ++_this3.rev;

    _this3.$emit("update:".concat(prop), value);
  });
}
/**
 * @param {{coordinates: number[], extent: number[]}} a
 * @param {{coordinates: number[], extent: number[]}} b
 * @returns {boolean}
 */


function isEqualGeom(a, b) {
  return isEqual(a.extent, b.extent) ? isEqual(a.coordinates, b.coordinates) : false;
}

export default geometry;
