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
import cmp from './ol-cmp';
import stubVNode from './stub-vnode';

/**
 * Basic ol component with stub VNode, i.e. virtual component
 */

var olVirtCmp = {
  mixins: [stubVNode, cmp],
  methods: {
    /**
     * @return {Promise}
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
     * @return {*}
     * @protected
     * @abstract
     */
    createOlObject: function createOlObject() {
      throw new Error('Not implemented method');
    },

    /**
     * @return {void|Promise<void>}
     * @protected
     */
    mount: function mount() {
      return cmp.methods.mount.call(this);
    },

    /**
     * @return {void|Promise<void>}
     * @protected
     */
    unmount: function unmount() {
      return cmp.methods.unmount.call(this);
    },

    /**
     * Redefine for easy call in child components
     * @returns {Object}
     * @protected
     */
    getServices: function getServices() {
      return cmp.methods.getServices.call(this);
    },

    /**
     * Refresh internal ol objects
     * @return {Promise}
     */
    refresh: function refresh() {
      return cmp.methods.refresh.call(this);
    },

    /**
     * Internal usage only in components that doesn't support refreshing.
     * @return {Promise<void>}
     * @protected
     */
    remount: function remount() {
      return cmp.methods.remount.call(this);
    },

    /**
     * Internal usage only in components that doesn't support refreshing.
     * @return {Promise<void>}
     * @protected
     */
    recreate: function recreate() {
      return cmp.methods.recreate.call(this);
    },

    /**
     * @protected
     */
    subscribeAll: function subscribeAll() {
      cmp.methods.subscribeAll.call(this);
    }
  }
};

export default olVirtCmp;
