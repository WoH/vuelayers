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
import style from './style';

var imageStyle = {
  mixins: [style],
  methods: {
    /**
     * @return {Promise}
     * @protected
     */
    init: function init() {
      return style.methods.init.call(this);
    },

    /**
     * @return {void|Promise<void>}
     * @protected
     */
    deinit: function deinit() {
      return style.methods.deinit.call(this);
    },

    /**
     * @return {void}
     * @protected
     */
    mount: function mount() {
      this.$stylesContainer && this.$stylesContainer.setImage(this);
    },

    /**
     * @return {void}
     * @protected
     */
    unmount: function unmount() {
      this.$stylesContainer && this.$stylesContainer.setImage(undefined);
    },

    /**
     * @return {Object}
     * @protected
     */
    getServices: function getServices() {
      return style.methods.getServices.call(this);
    },

    /**
     * @return {Promise}
     */
    refresh: function refresh() {
      // recreate style
      return this.recreate();
    }
  },
  stubVNode: {
    empty: false,
    attrs: function attrs() {
      return {
        class: this.$options.name
      };
    }
  }
};

export default imageStyle;
