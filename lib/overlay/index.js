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
import Overlay from 'ol/Overlay';
import { merge } from 'rxjs/_esm5/internal/observable/merge';
import uuid from 'uuid/v4';
import { olCmp, projTransforms, useMapCmp } from '../mixin';
import { initializeOverlay, OVERLAY_POSITIONING, setOverlayId } from '../ol-ext';
import { observableFromOlChangeEvent } from '../rx-ext';
import { hasOverlay } from '../util/assert';
import { isEqual, identity, pick } from '../util/minilo';

//
var props = {
  id: {
    type: [String, Number],
    default: function _default() {
      return uuid();
    }
  },
  offset: {
    type: Array,
    default: function _default() {
      return [0, 0];
    },
    validator: function validator(value) {
      return value.length === 2;
    }
  },

  /**
   * Coordinates in the map view projection.
   * @type {number[]}
   */
  position: {
    type: Array,
    validator: function validator(value) {
      return value.length === 2;
    },
    required: true
  },
  positioning: {
    type: String,
    default: OVERLAY_POSITIONING.TOP_LEFT,
    validator: function validator(value) {
      return Object.values(OVERLAY_POSITIONING).includes(value);
    }
  },
  stopEvent: {
    type: Boolean,
    default: true
  },
  insertFirst: {
    type: Boolean,
    default: true
  },
  autoPan: {
    type: Boolean,
    default: false
  },
  autoPanMargin: {
    type: Number,
    default: 20
  },
  autoPanAnimation: Object,
  className: String
};
var computed = {
  positionViewProj: function positionViewProj() {
    if (this.rev && this.$overlay) {
      return this.$overlay.getPosition();
    }
  },
  positionDataProj: function positionDataProj() {
    if (this.rev && this.$overlay) {
      return this.pointToDataProj(this.$overlay.getPosition());
    }
  },
  classes: function classes() {
    return [this.$options.name, this.visible ? 'visible' : undefined].filter(identity);
  }
};
var methods = {
  /**
   * @return {module:ol/Overlay~Overlay}
   * @protected
   */
  createOlObject: function createOlObject() {
    var overlay = new Overlay({
      id: this.id,
      offset: this.offset,
      position: this.pointToViewProj(this.position),
      positioning: this.positioning,
      stopEvent: this.stopEvent,
      insertFirst: this.insertFirst,
      autoPan: this.autoPan,
      autoPanMargin: this.autoPanMargin,
      autoPanAnimation: this.autoPanAnimation,
      className: this.className
    });
    initializeOverlay(overlay, this.id);
    return overlay;
  },

  /**
   * @return {void}
   * @protected
   */
  mount: function mount() {
    var _this = this;

    hasOverlay(this);
    this.$overlay.setElement(this.$el);
    this.$overlaysContainer && this.$overlaysContainer.addOverlay(this.$overlay); // reset position to trigger panIntoView

    this.$nextTick(function () {
      _this.$overlay.setPosition(_this.positionViewProj.slice());

      _this.visible = true;
    });
    this.subscribeAll();
  },

  /**
   * @return {void}
   * @protected
   */
  unmount: function unmount() {
    hasOverlay(this);
    this.unsubscribeAll();
    this.$overlay.setElement(undefined);
    this.$overlaysContainer && this.$overlaysContainer.removeOverlay(this.$overlay);
    this.visible = false;
  },

  /**
   * @return {void}
   * @protected
   */
  subscribeAll: function subscribeAll() {
    subscribeToOverlayChanges.call(this);
  }
};
var watch = {
  id: function id(value) {
    if (!this.$overlay) return;
    setOverlayId(this.$overlay, value);
  },
  offset: function offset(value) {
    if (this.$overlay && !isEqual(value, this.$overlay.getOffset())) {
      this.$overlay.setOffset(value);
    }
  },
  position: function position(value) {
    value = this.pointToViewProj(value);

    if (this.$overlay && !isEqual(value, this.$overlay.getPosition())) {
      this.$overlay.setPosition(value);
    }
  },
  positioning: function positioning(value) {
    if (this.$overlay && value !== this.$overlay.getPositioning()) {
      this.$overlay.setPositioning(value);
    }
  },
  resolvedDataProjection: function resolvedDataProjection() {
    if (this.$overlay) {
      this.$overlay.setPosition(this.pointToViewProj(this.position));
    }
  }
};
var script = {
  name: 'vl-overlay',
  mixins: [olCmp, useMapCmp, projTransforms],
  props: props,
  computed: computed,
  methods: methods,
  watch: watch,
  created: function created() {
    var _this2 = this;

    Object.defineProperties(this, {
      /**
       * @type {module:ol/Overlay~Overlay|undefined}
       */
      $overlay: {
        enumerable: true,
        get: function get() {
          return _this2.$olObject;
        }
      },
      $map: {
        enumerable: true,
        get: function get() {
          return _this2.$services && _this2.$services.map;
        }
      },
      $view: {
        enumerable: true,
        get: function get() {
          return _this2.$services && _this2.$services.view;
        }
      },
      $overlaysContainer: {
        enumerable: true,
        get: function get() {
          return _this2.$services && _this2.$services.overlaysContainer;
        }
      }
    });
  },
  data: function data() {
    return {
      visible: false
    };
  }
};
/**
 * @return {void}
 * @private
 */

function subscribeToOverlayChanges() {
  var _this3 = this;

  hasOverlay(this);
  var changes = merge(observableFromOlChangeEvent(this.$overlay, 'position', true, undefined, function () {
    return _this3.pointToDataProj(_this3.$overlay.getPosition());
  }), observableFromOlChangeEvent(this.$overlay, ['offset', 'positioning'], true));
  this.subscribeTo(changes, function (_ref) {
    var prop = _ref.prop,
        value = _ref.value;
    ++_this3.rev;

    _this3.$emit("update:".concat(prop), value);
  });
}

/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    class: _vm.classes,
    attrs: {
      "id": [_vm.$options.name, _vm.id].join('-')
    }
  }, [_vm._t("default", null, {
    id: _vm.id,
    position: _vm.position,
    offset: _vm.offset,
    positioning: _vm.positioning
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

  component.__file = "overlay.vue";

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


var Overlay$1 = __vue_normalize__({
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
  Object.assign(Overlay$1, options);
  Vue.component(Overlay$1.name, Overlay$1);
}

export default plugin;
export { Overlay$1 as Overlay, plugin as install };
