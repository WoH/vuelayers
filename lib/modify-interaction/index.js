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
import { altKeyOnly, always, primaryAction } from 'ol/events/condition';
import ModifyInteraction from 'ol/interaction/Modify';
import interaction from '../mixin/interaction';
import stylesContainer from '../mixin/styles-container';
import { createStyle, defaultEditStyle } from '../ol-ext/style';
import { isCollection, isVectorSource } from '../ol-ext/util';
import observableFromOlEvent from '../rx-ext/from-ol-event';
import { assert, hasInteraction } from '../util/assert';
import { mapValues, pick } from '../util/minilo';
import mergeDescriptors from '../util/multi-merge-descriptors';
import { makeWatchers } from '../util/vue-helpers';

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

/**
 * @vueProto
 * @alias module:modify-interaction/interaction
 * @title vl-interaction-modify
 */

var script = {
  name: 'vl-interaction-modify',
  mixins: [interaction, stylesContainer],
  stubVNode: {
    empty: false,
    attrs: function attrs() {
      return {
        class: this.$options.name
      };
    }
  },
  props: {
    /**
     * Source or collection identifier from IdentityMap.
     * @type {String}
     */
    source: {
      type: String,
      required: true
    },

    /**
     * A function that takes an `ol.MapBrowserEvent` and returns a boolean to indicate whether that event will be
     * considered to add or move a vertex to the sketch. Default is `ol.events.condition.primaryAction`.
     * @type {function|undefined}
     */
    condition: {
      type: Function,
      default: primaryAction
    },

    /**
     * A function that takes an `ol.MapBrowserEvent` and returns a boolean to indicate whether that event should be handled.
     * By default, `ol.events.condition.singleClick` with `ol.events.condition.altKeyOnly` results in a vertex deletion.
     * @type {function|undefined}
     */
    deleteCondition: {
      type: Function,
      default: altKeyOnly
    },

    /**
     * A function that takes an `ol.MapBrowserEvent` and returns a boolean to indicate whether a new vertex can be added
     * to the sketch features. Default is `ol.events.condition.always`.
     * @type {function|undefined}
     */
    insertVertexCondition: {
      type: Function,
      default: always
    },

    /**
     * Pixel tolerance for considering the pointer close enough to a segment or vertex for editing.
     * @type {number}
     */
    pixelTolerance: {
      type: Number,
      default: 10
    },

    /**
     * Wrap the world horizontally on the sketch overlay.
     * @type {boolean}
     */
    wrapX: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * @return {Promise<Modify>}
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
                assert(isVectorSource(source), "Source \"".concat(sourceIdent, "\" doesn't exists in the identity map."));
                assert(isCollection(source.getFeaturesCollection()), "Source \"".concat(sourceIdent, "\" doesn't provide features collection."));
                return _context.abrupt("return", new ModifyInteraction({
                  features: source.getFeaturesCollection(),
                  deleteCondition: this.deleteCondition,
                  insertVertexCondition: this.insertVertexCondition,
                  pixelTolerance: this.pixelTolerance,
                  style: this.createStyleFunc(),
                  wrapX: this.wrapX
                }));

              case 7:
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
     * @return {function(feature: Feature): Style}
     * @protected
     */
    getDefaultStyles: function getDefaultStyles() {
      var defaultStyles = mapValues(defaultEditStyle(), function (styles) {
        return styles.map(createStyle);
      });
      return function __selectDefaultStyleFunc(feature) {
        if (feature.getGeometry()) {
          return defaultStyles[feature.getGeometry().getType()];
        }
      };
    },

    /**
     * @returns {Object}
     * @protected
     */
    getServices: function getServices() {
      return mergeDescriptors(interaction.methods.getServices.call(this), stylesContainer.methods.getServices.call(this));
    },

    /**
     * @return {Interaction|undefined}
     * @protected
     */
    getStyleTarget: function getStyleTarget() {
      return this.$interaction;
    },

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
     * @param {Array<{style: Style, condition: (function|boolean|undefined)}>|function(feature: Feature): Style|Vue|undefined} styles
     * @return {void}
     * @protected
     */
    setStyle: function setStyle(styles) {
      if (styles !== this._styles) {
        this._styles = styles;
        this.scheduleRecreate();
      }
    },

    /**
     * @return {void}
     * @protected
     */
    subscribeAll: function subscribeAll() {
      interaction.methods.subscribeAll.call(this);
      subscribeToInteractionChanges.call(this);
    }
  },
  watch: _objectSpread({}, makeWatchers(['source', 'condition', 'deleteCondition', 'insertVertexCondition', 'pixelTolerance', 'wrapX'], function () {
    return function () {
      this.scheduleRecreate();
    };
  }))
  /**
   * @private
   */

};

function subscribeToInteractionChanges() {
  var _this = this;

  hasInteraction(this);
  var modifyEvents = observableFromOlEvent(this.$interaction, ['modifystart', 'modifyend']);
  this.subscribeTo(modifyEvents, function (evt) {
    ++_this.rev;

    _this.$emit(evt.type, evt);
  });
}

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
