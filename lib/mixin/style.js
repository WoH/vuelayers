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
import { first } from 'rxjs/_esm5/internal/operators/first';
import mergeDescriptors from '../util/multi-merge-descriptors';
import { observableFromOlEvent } from '../rx-ext';
import cmp from './ol-virt-cmp';
import useMapCmp from './use-map-cmp';

/**
 * Basic style mixin.
 */

var style = {
  mixins: [cmp, useMapCmp],
  methods: {
    /**
     * @return {OlStyle|Promise<OlStyle>}
     * @protected
     */
    createOlObject: function createOlObject() {
      return this.createStyle();
    },

    /**
     * @return {OlStyle|Promise<OlStyle>}
     * @protected
     * @abstract
     */
    createStyle: function createStyle() {
      throw new Error('Not implemented method');
    },

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
     * @return {Object}
     * @protected
     */
    getServices: function getServices() {
      var vm = this;
      return mergeDescriptors(cmp.methods.getServices.call(this), {
        get style() {
          return vm.$style;
        }

      });
    },

    /**
     * @return {Promise}
     */
    refresh: function refresh() {
      var _this = this;

      if (this.$olObject == null) return Promise.resolve();
      return this.remount().then(function () {
        if (!_this.$map) {
          return;
        }

        _this.$map.render();

        return observableFromOlEvent(_this.$map, 'postcompose').pipe(first()).toPromise();
      });
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
  var _this2 = this;

  Object.defineProperties(this, {
    $style: {
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
    $stylesContainer: {
      enumerable: true,
      get: function get() {
        return _this2.$services && _this2.$services.stylesContainer;
      }
    }
  });
}

export default style;
