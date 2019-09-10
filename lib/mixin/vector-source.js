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
import { merge } from 'rxjs/_esm5/internal/observable/merge';
import { debounceTime } from 'rxjs/_esm5/internal/operators/debounceTime';
import { observableFromOlEvent } from '../rx-ext';
import { hasSource } from '../util/assert';
import mergeDescriptors from '../util/multi-merge-descriptors';
import { makeWatchers } from '../util/vue-helpers';
import featuresContainer from './features-container';
import projTransforms from './proj-transforms';
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

var vectorSource = {
  mixins: [source, featuresContainer, projTransforms],
  props: {
    useSpatialIndex: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    /**
     * @return {void}
     */
    clear: function clear() {
      featuresContainer.methods.clearFeatures.call(this);
    },

    /**
     * @return {Object}
     * @protected
     */
    getServices: function getServices() {
      return mergeDescriptors(source.methods.getServices.call(this), featuresContainer.methods.getServices.call(this));
    },

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
      return source.methods.mount.call(this);
    },

    /**
     * @return {void}
     * @protected
     */
    unmount: function unmount() {
      this.clear();
      return source.methods.unmount.call(this);
    },

    /**
     * @return {void}
     * @protected
     */
    subscribeAll: function subscribeAll() {
      source.methods.subscribeAll.call(this);
      subscribeToEvents.call(this);
    },

    /**
     * @param feature
     * @return {ReadonlyArray<any>}
     * @protected
     */
    writeFeatureInDataProj: function writeFeatureInDataProj(feature) {
      return projTransforms.methods.writeFeatureInDataProj.call(this, feature);
    },

    /**
     * @param feature
     * @return {ReadonlyArray<any>}
     * @protected
     */
    writeGeometryInViewProj: function writeGeometryInViewProj(feature) {
      return projTransforms.methods.writeFeatureInViewProj.call(this, feature);
    }
  },
  watch: _objectSpread({}, makeWatchers(['useSpatialIndex'], function () {
    return function () {
      return this.scheduleRecreate();
    };
  })),
  stubVNode: {
    empty: false,
    attrs: function attrs() {
      return {
        class: this.$options.name
      };
    }
  }
};

function subscribeToEvents() {
  var _this = this;

  hasSource(this);
  var add = observableFromOlEvent(this.getFeaturesCollection(), 'add');
  var remove = observableFromOlEvent(this.getFeaturesCollection(), 'remove');
  var events = merge(add, remove).pipe(debounceTime(1000 / 60)); // emit event to allow `sync` modifier

  this.subscribeTo(events, function () {
    _this.$emit('update:features', _this.featuresDataProj);
  });
}

export default vectorSource;
