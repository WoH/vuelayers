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
import Vue from 'vue';

var sourceContainer = {
  methods: {
    /**
     * @return {{
     *     setSource: function(module:ol/source/Source~Source): void,
     *     getSource: function(): module:ol/source/Source~Source
     *   }|undefined}
     * @protected
     */
    getSourceTarget: function getSourceTarget() {
      throw new Error('Not implemented method');
    },

    /**
     * @return {module:ol/source/Source~Source|undefined}
     */
    getSource: function getSource() {
      return this._source;
    },

    /**
     * @returns {Object}
     * @protected
     */
    getServices: function getServices() {
      var vm = this;
      return {
        get sourceContainer() {
          return vm;
        }

      };
    },

    /**
     * @param {module:ol/source/Source~Source|Vue|undefined} source
     * @return {void}
     */
    setSource: function setSource(source) {
      source = source instanceof Vue ? source.$source : source;

      if (source !== this._source) {
        this._source = source;
      }
      /**
       * @type {module:ol/layer/Layer~Layer|Builder}
       */


      var sourceTarget = this.getSourceTarget();

      if (sourceTarget && source !== sourceTarget.getSource()) {
        sourceTarget.setSource(source);
      }
    }
  }
};

export default sourceContainer;
