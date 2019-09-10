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
import Graticule from 'ol/Graticule';
import { throttleTime } from 'rxjs/_esm5/internal/operators/throttleTime';
import { observableFromOlEvent } from '../rx-ext';
import { olCmp, useMapCmp, projTransforms } from '../mixin';
import { hasGraticule, hasMap } from '../util/assert';
import { firstEl, map, pick } from '../util/minilo';
import mergeDescriptors from '../util/multi-merge-descriptors';
import { makeWatchers } from '../util/vue-helpers';

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

var script = {
  name: 'vl-graticule',
  mixins: [olCmp, useMapCmp, projTransforms],
  props: {
    maxLines: {
      type: Number,
      default: 100
    },
    targetSize: {
      type: Number,
      default: 100
    },
    showLabels: {
      type: Boolean,
      default: false
    },
    lonLabelFormatter: Function,
    latLabelFormatter: Function,
    lonLabelPosition: {
      type: Number,
      default: 0
    },
    latLabelPosition: {
      type: Number,
      default: 1
    },
    intervals: {
      type: Array,
      default: function _default() {
        return [90, 45, 30, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.01, 0.005, 0.002, 0.001];
      }
    }
  },
  computed: {
    meridians: function meridians() {
      var _this = this;

      if (this.$graticule && this.rev) {
        return map(this.getMeridians(), function (meridian) {
          return _this.lineToDataProj(meridian.getCoordinates());
        });
      }

      return [];
    },
    parallels: function parallels() {
      var _this2 = this;

      if (this.$graticule && this.rev) {
        return map(this.getParallels(), function (parallel) {
          return _this2.lineToDataProj(parallel.getCoordinates());
        });
      }

      return [];
    }
  },
  methods: {
    createOlObject: function createOlObject() {
      return new Graticule({
        maxLines: this.maxLines,
        targetSize: this.targetSize,
        showLabels: this.showLabels,
        strokeStyle: this._strokeStyle,
        lonLabelFormatter: this.lonLabelFormatter,
        latLabelFormatter: this.latLabelFormatter,
        lonLabelPosition: this.lonLabelPosition,
        latLabelPosition: this.latLabelPosition,
        lonLabelStyle: this._lonLabelStyle,
        latLabelStyle: this._latLabelStyle,
        intervals: this.intervals
      });
    },

    /**
     * @return {Promise} Resolves when initialization completes
     * @protected
     */
    init: function init() {
      return olCmp.methods.init.call(this);
    },

    /**
     * @return {void|Promise<void>}
     * @protected
     */
    deinit: function deinit() {
      return olCmp.methods.deinit.call(this);
    },

    /**
     * @return {void}
     * @protected
     */
    mount: function mount() {
      this.$map && this.$graticule.setMap(this.$map);
      this.subscribeAll();
    },

    /**
     * @return {void}
     * @protected
     */
    unmount: function unmount() {
      this.unsubscribeAll();
      this.$graticule.setMap(undefined);
    },
    getMeridians: function getMeridians() {
      hasGraticule(this);
      return this.$graticule.getMeridians();
    },
    getParallels: function getParallels() {
      hasGraticule(this);
      return this.$graticule.getParallels();
    },
    setStroke: function setStroke(stroke) {
      stroke = stroke instanceof Vue ? stroke.$style : stroke;

      if (stroke !== this._strokeStyle) {
        this._strokeStyle = stroke;
        this.scheduleRefresh();
      }
    },
    setText: function setText(text) {
      text = text instanceof Vue ? text.$style : text;
      var vm;

      if (text) {
        vm = firstEl(text[this.$options.VM_PROP]);
      }

      var vmMatcher = function vmMatcher(vnode) {
        return vnode.componentInstance && vnode.componentInstance === vm;
      };

      if (text == null && this.$slots.lon == null || Array.isArray(this.$slots.lon) && this.$slots.lon.some(vmMatcher)) {
        if (text !== this._lonLabelStyle) {
          this._lonLabelStyle = text;
          this.scheduleRefresh();
        }
      } else if (text == null && this.$slots.lat == null || Array.isArray(this.$slots.lat) && this.$slots.lat.some(vmMatcher)) {
        if (text !== this._latLabelStyle) {
          this._latLabelStyle = text;
          this.scheduleRefresh();
        }
      }
    },
    getServices: function getServices() {
      var vm = this;
      return mergeDescriptors(olCmp.methods.getServices.call(this), {
        get stylesContainer() {
          return vm;
        }

      });
    },

    /**
     * @return {Promise}
     */
    refresh: function refresh() {
      return this.recreate();
    },
    subscribeAll: function subscribeAll() {
      subscribeToEvents.call(this);
    }
  },
  watch: _objectSpread({}, makeWatchers(['maxLines', 'targetSize', 'showLabels', 'lonLabelFormatter', 'latLabelFormatter', 'lonLabelPosition', 'latLabelPosition', 'intervals'], function () {
    return function () {
      this.scheduleRefresh();
    };
  })),
  stubVNode: {
    empty: false,
    attrs: function attrs() {
      return {
        class: this.$options.name
      };
    }
  },
  created: function created() {
    defineServices.call(this);
  }
};

function defineServices() {
  var _this3 = this;

  Object.defineProperties(this, {
    $graticule: {
      enumerable: true,
      get: function get() {
        return _this3.$olObject;
      }
    },
    $map: {
      enumerable: true,
      get: function get() {
        return _this3.$services && _this3.$services.map;
      }
    },
    $view: {
      enumerable: true,
      get: function get() {
        return _this3.$services && _this3.$services.view;
      }
    }
  });
}

function subscribeToEvents() {
  var _this4 = this;

  hasMap(this);
  var ft = 1000 / 60;
  var postcompose = observableFromOlEvent(this.$map, 'postcompose').pipe(throttleTime(ft));
  this.subscribeTo(postcompose, function () {
    ++_this4.rev;
  });
}

/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('i', {
    class: _vm.$options.name,
    staticStyle: {
      "display": "none !important"
    }
  }, [_vm._t("lon"), _vm._v(" "), _vm._t("lat"), _vm._v(" "), _vm._t("stroke")], 2);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = undefined;
/* scoped */

var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = undefined;
/* functional template */

var __vue_is_functional_template__ = false;
/* component normalizer */

function __vue_normalize__(template, style, script$$1, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script$$1 === 'function' ? script$$1.options : script$$1) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "graticule.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  return component;
}
/* style inject */

/* style inject SSR */


var Graticule$1 = __vue_normalize__({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, undefined, undefined);

function plugin(Vue$$1) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (plugin.installed) {
    return;
  }

  plugin.installed = true;
  options = pick(options, 'dataProjection');
  Object.assign(Graticule$1, options);
  Vue$$1.component(Graticule$1.name, Graticule$1);
}

export default plugin;
export { Graticule$1 as Graticule, plugin as install };
