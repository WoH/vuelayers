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
import { observableFromOlEvent } from '../rx-ext';
import { EPSG_3857 } from '../ol-ext/consts';
import { hasSource } from '../util/assert';
import { isEqual } from '../util/minilo';
import { makeWatchers } from '../util/vue-helpers';
import source from './source';

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

var imageSource = {
  mixins: [source],
  props: {
    crossOrigin: String,
    projection: {
      type: String,
      default: EPSG_3857
    }
  },
  methods: {
    /**
     * @return {Promise}
     * @protected
     */
    init: function init() {
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
  watch: _objectSpread({}, makeWatchers(['crossOrigin'], function () {
    return function (value, prevValue) {
      if (isEqual(value, prevValue)) return;
      this.scheduleRecreate();
    };
  }))
};

function subscribeToSourceEvents() {
  var _this = this;

  hasSource(this);
  var events = observableFromOlEvent(this.$source, ['imageloadend', 'imageloaderror', 'imageloadstart']);
  this.subscribeTo(events, function (evt) {
    return _this.$emit(evt.type, evt);
  });
}

export default imageSource;
