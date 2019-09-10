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
import { createTileUrlFunction } from 'ol-tilecache';
import { observableFromOlEvent } from '../rx-ext';
import { CACHE_SIZE, EPSG_3857, MAX_ZOOM, MIN_ZOOM, PIXEL_RATIO, REPROJ_ERR_THRESHOLD, TILE_SIZE } from '../ol-ext/consts';
import { createExtentFromProjection } from '../ol-ext/extent';
import { createXyzGrid } from '../ol-ext/tile-grid';
import { hasSource } from '../util/assert';
import { isEqual, isString, pick, replaceTokens } from '../util/minilo';
import { makeWatchers } from '../util/vue-helpers';
import source from './source';
import withUrl from './with-url';

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
    var source$$1 = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source$$1);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source$$1).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source$$1, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source$$1[key]);
    });
  }

  return target;
}

var tileSource = {
  mixins: [source, withUrl],
  props: {
    cacheSize: {
      type: Number,
      default: CACHE_SIZE
    },
    crossOrigin: String,
    maxZoom: {
      type: Number,
      default: MAX_ZOOM
    },
    minZoom: {
      type: Number,
      default: MIN_ZOOM
    },
    opaque: Boolean,
    projection: {
      type: String,
      default: EPSG_3857
    },
    reprojectionErrorThreshold: {
      type: Number,
      default: REPROJ_ERR_THRESHOLD
    },
    tilePixelRatio: {
      type: Number,
      default: PIXEL_RATIO
    },
    tileSize: {
      type: Array,
      default: function _default() {
        return [TILE_SIZE, TILE_SIZE];
      },
      validator: function validator(value) {
        return value.length === 2;
      }
    },

    /**
     * @type {module:ol/Tile~LoadFunction}
     */
    tileLoadFunction: Function,
    tileKey: String,

    /**
     * URL template or custom tile URL function.
     * @type {string|module:ol/Tile~UrlFunction}
     */
    url: {
      type: [String, Function],
      required: true
    },

    /**
     * Duration of the opacity transition for rendering. To disable the opacity transition, pass `0`.
     * @type {number}
     */
    transition: Number
  },
  computed: {
    /**
     * @type {string|undefined}
     */
    urlTmpl: function urlTmpl() {
      if (!isString(this.url)) {
        return;
      }

      return replaceTokens(this.url, pick(this, this.urlTokens));
    },

    /**
     * @returns {function}
     */
    urlFunc: function urlFunc() {
      if (!this.url) {
        return;
      }

      var url;

      if (this.urlTmpl != null) {
        var extent = createExtentFromProjection(this.projection);
        url = createTileUrlFunction(this.urlTmpl, this._tileGrid, extent);
      } else {
        url = this.url;
      }

      return url;
    }
  },
  methods: {
    /**
     * @return {Promise}
     * @protected
     */
    init: function init() {
      /**
       * @type {module:ol/Tile~UrlFunction}
       * @protected
       */
      this._tileGrid = createXyzGrid({
        extent: createExtentFromProjection(this.projection),
        maxZoom: this.maxZoom,
        minZoom: this.minZoom,
        tileSize: this.tileSize
      });
      return source.methods.init.call(this);
    },

    /**
     * @return {void|Promise<void>}
     * @protected
     */
    deinit: function deinit() {
      return source.methods.deinit.call(this);
    },

    /**
     * @return {void}
     * @protected
     */
    mount: function mount() {
      source.methods.mount.call(this);
    },

    /**
     * @return {void}
     * @protected
     */
    unmount: function unmount() {
      source.methods.unmount.call(this);
    },
    subscribeAll: function subscribeAll() {
      source.methods.subscribeAll.call(this);
      subscribeToSourceEvents.call(this);
    }
  },
  watch: _objectSpread({
    opaque: function opaque(value) {
      if (!this.$source || value === this.$source.getOpaque()) {
        return;
      }

      this.scheduleRecreate();
    },
    tilePixelRatio: function tilePixelRatio(value) {
      if (!this.$source || value === this.$source.getOpaque()) {
        return;
      }

      this.scheduleRecreate();
    },
    tileKey: function tileKey(value) {
      if (!this.$source || value === this.$source.getKey()) {
        return;
      }

      this.$source.setKey(value);
    },
    tileLoadFunction: function tileLoadFunction(value, prevValue) {
      if (!this.$source || isEqual(value, prevValue)) return;
      this.$source.setTileLoadFunction(value);
    },
    url: function url() {
      if (!this.$source) return;
      this.$source.setTileUrlFunction(this.createUrlFunc());
      this.scheduleRefresh();
    }
  }, makeWatchers(['cacheSize', 'crossOrigin', 'reprojectionErrorThreshold', 'transition', 'maxZoom', 'minZoom', 'tileSize'], function () {
    return function (value, prevValue) {
      if (isEqual(value, prevValue)) return;
      this.scheduleRecreate();
    };
  }))
};

function subscribeToSourceEvents() {
  var _this = this;

  hasSource(this);
  var events = observableFromOlEvent(this.$source, ['tileloadstart', 'tileloadend', 'tileloaderror']);
  this.subscribeTo(events, function (evt) {
    return _this.$emit(evt.type, evt);
  });
}

export default tileSource;
