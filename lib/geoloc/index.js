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
import Geolocation from 'ol/Geolocation';
import { merge } from 'rxjs/_esm5/internal/observable/merge';
import { olCmp, useMapCmp, projTransforms } from '../mixin';
import { observableFromOlChangeEvent } from '../rx-ext';
import { hasGeolocation } from '../util/assert';
import { isEqual, pick } from '../util/minilo';

//
var script = {
  name: 'vl-geoloc',
  mixins: [olCmp, useMapCmp, projTransforms],
  props: {
    tracking: {
      type: Boolean,
      default: true
    },
    trackingOptions: Object,

    /**
     * @type {string}
     */
    projection: String
  },
  computed: {
    accuracy: function accuracy() {
      if (this.rev && this.$geolocation) {
        return this.$geolocation.getAccuracy();
      }
    },
    altitude: function altitude() {
      if (this.rev && this.$geolocation) {
        return this.$geolocation.getAltitude();
      }
    },
    altitudeAccuracy: function altitudeAccuracy() {
      if (this.rev && this.$geolocation) {
        return this.$geolocation.getAltitudeAccuracy();
      }
    },
    heading: function heading() {
      if (this.rev && this.$geolocation) {
        return this.$geolocation.getHeading();
      }
    },
    speed: function speed() {
      if (this.rev && this.$geolocation) {
        return this.$geolocation.getSpeed();
      }
    },
    position: function position() {
      if (this.rev && this.$geolocation) {
        return this.$geolocation.getPosition();
      }
    },
    positionViewProj: function positionViewProj() {
      if (this.position && this.viewProjection) {
        return this.pointToViewProj(this.position);
      }
    }
  },
  methods: {
    /**
     * @return {ol/Geolocation~Geolocation}
     * @private
     */
    createOlObject: function createOlObject() {
      return new Geolocation({
        tracking: this.tracking,
        trackingOptions: this.trackingOptions,
        projection: this.resolvedDataProjection
      });
    },

    /**
     * @return {void}
     * @private
     */
    mount: function mount() {
      this.subscribeAll();
    },

    /**
     * @return {void}
     * @private
     */
    unmount: function unmount() {
      hasGeolocation(this);
      this.unsubscribeAll();
      this.$geolocation.setTracking(false);
    },

    /**
     * @return {void}
     * @protected
     */
    subscribeAll: function subscribeAll() {
      subscribeToGeolocation.call(this);
    }
  },
  watch: {
    /**
     * @param {boolean} value
     */
    tracking: function tracking(value) {
      if (!this.$geolocation && value === this.$geolocation.getTracking()) {
        return;
      }

      this.$geolocation.setTracking(value);
    },
    tracingOptions: function tracingOptions(value, prevValue) {
      if (isEqual(value, prevValue) || !this.$geolocation) return;
      this.$geolocation.setTrackingOptions(value);
    },
    resolvedDataProjection: function resolvedDataProjection(value) {
      if (!this.$geolocation) return;
      this.$geolocation.setProjection(value);
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
  var _this = this;

  Object.defineProperties(this, {
    /**
     * @type {ol/Geolocation~Geolocation|undefined}
     */
    $geolocation: {
      enumerable: true,
      get: function get() {
        return _this.$olObject;
      }
    },
    $map: {
      enumerable: true,
      get: function get() {
        return _this.$services && _this.$services.map;
      }
    },

    /**
     * Reference to `ol.View` instance.
     * @type {module:ol/View~View|undefined}
     */
    $view: {
      enumerable: true,
      get: function get() {
        return _this.$services && _this.$services.view;
      }
    }
  });
}
/**
 * @return {void}
 * @private
 */


function subscribeToGeolocation() {
  var _this2 = this;

  hasGeolocation(this);
  var ft = 1000 / 60;
  var changes = merge(observableFromOlChangeEvent(this.$geolocation, ['accuracy', 'altitude', 'altitudeaccuracy', 'heading', 'speed'], true, ft), observableFromOlChangeEvent(this.$geolocation, 'position', true, ft));
  this.subscribeTo(changes, function (_ref) {
    var prop = _ref.prop,
        value = _ref.value;
    ++_this2.rev;

    _this2.$emit("update:".concat(prop), value);
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
    class: [_vm.$options.name],
    staticStyle: {
      "display": "none !important"
    }
  }, [_vm._t("default", null, {
    accuracy: _vm.accuracy,
    altitude: _vm.altitude,
    altitudeAccuracy: _vm.altitudeAccuracy,
    heading: _vm.heading,
    position: _vm.position,
    speed: _vm.speed
  })], 2);
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

  component.__file = "geoloc.vue";

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


var Geoloc = __vue_normalize__({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, undefined, undefined);

function plugin(Vue) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (plugin.installed) {
    return;
  }

  plugin.installed = true;
  options = pick(options, 'dataProjection');
  Object.assign(Geoloc, options);
  Vue.component(Geoloc.name, Geoloc);
}

export default plugin;
export { Geoloc, plugin as install };
