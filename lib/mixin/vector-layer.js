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
import { isEqual } from '../util/minilo';
import mergeDescriptors from '../util/multi-merge-descriptors';
import layer from './layer';
import stylesContainer from './styles-container';

var vectorLayer = {
  mixins: [layer, stylesContainer],
  props: {
    /**
     * When set to `true`, feature batches will be recreated during animations.
     * @type {boolean}
     * @default false
     */
    updateWhileAnimating: Boolean,

    /**
     * When set to `true`, feature batches will be recreated during interactions.
     * @type {boolean}
     * @default false
     */
    updateWhileInteracting: Boolean,

    /**
     * @type {number|undefined}
     */
    renderBuffer: {
      type: Number,
      default: 100
    },
    renderOrder: Function,
    renderMode: {
      type: String,
      default: 'vector',
      validator: function validator(value) {
        return ['vector', 'image'].includes(value);
      }
    },

    /**
     * @type {boolean}
     */
    declutter: Boolean
  },
  methods: {
    /**
     * @return {Promise<Vue<Layer>>}
     * @protected
     */
    init: function init() {
      return layer.methods.init.call(this);
    },

    /**
     * @return {void|Promise<void>}
     * @protected
     */
    deinit: function deinit() {
      return layer.methods.deinit.call(this);
    },

    /**
     * @returns {Object}
     * @protected
     */
    getServices: function getServices() {
      return mergeDescriptors(layer.methods.getServices.call(this), stylesContainer.methods.getServices.call(this));
    },

    /**
     * @return {Vector|undefined}
     * @protected
     */
    getStyleTarget: function getStyleTarget() {
      return this.$layer;
    },

    /**
     * @return {Promise|void}
     * @protected
     */
    mount: function mount() {
      return layer.methods.mount.call(this);
    },

    /**
     * @return {Promise|void}
     * @protected
     */
    unmount: function unmount() {
      return layer.methods.unmount.call(this);
    },

    /**
     * Updates layer state
     * @return {Promise}
     */
    refresh: function refresh() {
      return layer.methods.refresh.call(this);
    },

    /**
     * Internal usage only in components that doesn't support refreshing.
     * @return {Promise<void>}
     * @protected
     */
    remount: function remount() {
      return layer.methods.remount.call(this);
    },

    /**
     * Internal usage only in components that doesn't support refreshing.
     * @return {Promise<void>}
     * @protected
     */
    recreate: function recreate() {
      return layer.methods.remount.call(this);
    },

    /**
     * @protected
     */
    subscribeAll: function subscribeAll() {
      layer.methods.subscribeAll.call(this);
    }
  },
  watch: {
    updateWhileAnimating: function updateWhileAnimating(value) {
      if (!this.$layer || value === this.$layer.getUpdateWhileAnimating()) {
        return;
      }

      this.scheduleRecreate();
    },
    updateWhileInteracting: function updateWhileInteracting(value) {
      if (!this.$layer || value === this.$layer.getUpdateWhileInteracting()) {
        return;
      }

      this.scheduleRecreate();
    },
    renderBuffer: function renderBuffer(value) {
      if (!this.$layer || value === this.$layer.getRenderBuffer()) {
        return;
      }

      this.scheduleRecreate();
    },
    renderOrder: function renderOrder(value) {
      if (!this.$layer || isEqual(value, this.$layer.getRenderOrder())) {
        return;
      }

      this.$layer.setRenderOrder(value);
    },
    declutter: function declutter(value) {
      if (!this.$layer || value === this.$layer.getDeclutter()) {
        return;
      }

      this.$layer.setDeclutter(value);
    }
  }
};

export default vectorLayer;
