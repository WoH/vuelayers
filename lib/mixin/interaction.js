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
import uuid from 'uuid/v4';
import { getInteractionId, getInteractionPriority, initializeInteraction, setInteractionId, setInteractionPriority } from '../ol-ext';
import { isEqual } from '../util/minilo';
import mergeDescriptors from '../util/multi-merge-descriptors';
import cmp from './ol-virt-cmp';
import useMapCmp from './use-map-cmp';

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

var interaction = {
  mixins: [cmp, useMapCmp],
  props: {
    id: {
      type: [String, Number],
      default: function _default() {
        return uuid();
      }
    },
    active: {
      type: Boolean,
      default: true
    },

    /**
     * Priority of interactions in the event handling stream.
     * The higher the value, the sooner it will handle map event.
     * @type {number}
     */
    priority: {
      type: Number,
      default: 0
    }
  },
  methods: {
    /**
     * @return {Promise<module:ol/interaction/Interaction~Interaction>}
     * @protected
     */
    createOlObject: function () {
      var _createOlObject = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var interaction;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.createInteraction();

              case 2:
                interaction = _context.sent;
                initializeInteraction(interaction, this.id, this.priority);
                interaction.setActive(this.active);
                return _context.abrupt("return", interaction);

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function createOlObject() {
        return _createOlObject.apply(this, arguments);
      };
    }(),

    /**
     * @return {module:ol/interaction/Interaction~Interaction|Promise<module:ol/interaction/Interaction~Interaction>}
     * @protected
     * @abstract
     */
    createInteraction: function createInteraction() {
      throw new Error('Not implemented method');
    },

    /**
     * @returns {Object}
     * @protected
     */
    getServices: function getServices() {
      var vm = this;
      return mergeDescriptors(cmp.methods.getServices.call(this), {
        get interaction() {
          return vm.$interaction;
        }

      });
    },

    /**
     * @return {Promise} Resolves when initialization completes
     * @protected
     */
    init: function init() {
      return cmp.methods.init.call(this);
    },

    /**
     * @return {void|Promise<void>}
     * @protected
     */
    deinit: function deinit() {
      return cmp.methods.deinit.call(this);
    },

    /**
     * @return {void}
     * @protected
     */
    mount: function mount() {
      this.$interactionsContainer && this.$interactionsContainer.addInteraction(this);
      this.subscribeAll();
    },

    /**
     * @return {void}
     * @protected
     */
    unmount: function unmount() {
      this.unsubscribeAll();
      this.$interactionsContainer && this.$interactionsContainer.removeInteraction(this);
    },

    /**
     * @return {Promise}
     */
    refresh: function refresh() {
      return cmp.methods.refresh.call(this);
    },

    /**
     * @return {Promise}
     */
    recreate: function recreate() {
      return cmp.methods.recreate.call(this);
    },

    /**
     * @return {Promise}
     */
    remount: function remount() {
      return cmp.methods.remount.call(this);
    },

    /**
     * @protected
     */
    subscribeAll: function subscribeAll() {}
  },
  watch: {
    id: function id(value) {
      if (!this.$interaction || isEqual(value, getInteractionId(value))) {
        return;
      }

      setInteractionId(this.$interaction, value);
    },
    active: function active(value) {
      if (!this.$interaction || value === this.$interaction.getActive()) {
        return;
      }

      this.$interaction.setActive(value);
    },
    priority: function priority(value) {
      if (!this.$interaction || !this.$interactionsContainer || value === getInteractionPriority(this.$interaction)) {
        return;
      }

      setInteractionPriority(this.$interaction, value); // todo replace with event

      this.$interactionsContainer.sortInteractions();
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
     * @type {module:ol/interaction/Interaction~Interaction|undefined}
     */
    $interaction: {
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
    $view: {
      enumerable: true,
      get: function get() {
        return _this.$services && _this.$services.view;
      }
    },
    $interactionsContainer: {
      enumerable: true,
      get: function get() {
        return _this.$services && _this.$services.interactionsContainer;
      }
    }
  });
}

export default interaction;
