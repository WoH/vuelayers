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
import SnapInteraction from 'ol/interaction/Snap';
import interaction from '../mixin/interaction';
import { makeWatchers } from '../util/vue-helpers';
import { pick } from '../util/minilo';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

/**
 * @vueProps
 */

var props = {
  /**
   * Target source identifier from IdentityMap.
   * @type {string}
   */
  source: {
    type: String,
    required: true
  },

  /**
   * Snap to edges
   * @type {boolean}
   */
  edge: {
    type: Boolean,
    default: true
  },

  /**
   * Snap to vertices.
   * @type {boolean}
   */
  vertex: {
    type: Boolean,
    default: true
  },

  /**
   * Pixel tolerance for considering the pointer close enough to a segment or vertex for snapping.
   * @type {number}
   */
  pixelTolerance: {
    type: Number,
    default: 10
  }
  /**
   * @vueMethods
   */

};
var methods = {
  /**
   * @return {Promise<Snap>}
   * @protected
   */
  createInteraction: function () {
    var _createInteraction = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var sourceIdent, source;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              sourceIdent = this.makeIdent(this.source);
              _context.next = 3;
              return this.$identityMap.get(sourceIdent, this.$options.INSTANCE_PROMISE_POOL);

            case 3:
              source = _context.sent;
              return _context.abrupt("return", new SnapInteraction({
                source: source
              }));

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function createInteraction() {
      return _createInteraction.apply(this, arguments);
    };
  }(),

  /**
   * @return {void}
   * @protected
   */
  mount: function mount() {
    interaction.methods.mount.call(this);
  },

  /**
   * @return {void}
   * @protected
   */
  unmount: function unmount() {
    interaction.methods.unmount.call(this);
  },

  /**
   * @return {void}
   * @protected
   */
  subscribeAll: function subscribeAll() {}
};
var watch = makeWatchers(['source'], function () {
  return function () {
    this.scheduleRecreate();
  };
});
/**
 * @alias module:snap-interaction/interaction
 * @title vl-interaction-snap
 * @vueProto
 */

var script = {
  name: 'vl-interaction-snap',
  mixins: [interaction],
  props: props,
  methods: methods,
  watch: watch
};

/* script */
var __vue_script__ = script;
/* template */

/* style */

var __vue_inject_styles__ = undefined;
/* scoped */

var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = undefined;
/* functional template */

var __vue_is_functional_template__ = undefined;
/* component normalizer */

function __vue_normalize__(template, style, script$$1, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script$$1 === 'function' ? script$$1.options : script$$1) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "interaction.vue";

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


var Interaction = __vue_normalize__({}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, undefined, undefined);

function plugin(Vue) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (plugin.installed) {
    return;
  }

  plugin.installed = true;
  options = pick(options, 'dataProjection');
  Object.assign(Interaction, options);
  Vue.component(Interaction.name, Interaction);
}

export default plugin;
export { Interaction, plugin as install };
