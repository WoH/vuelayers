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
import Collection from 'ol/Collection';
import BaseLayer from 'ol/layer/Base';
import Vue from 'vue';
import { merge } from 'rxjs/_esm5/internal/observable/merge';
import { getLayerId, initializeLayer } from '../ol-ext';
import { observableFromOlEvent } from '../rx-ext';
import { instanceOf } from '../util/assert';
import rxSubs from './rx-subs';

var layersContainer = {
  mixins: [rxSubs],
  computed: {
    layerIds: function layerIds() {
      if (!this.rev) return [];
      return this.getLayers().map(getLayerId);
    }
  },
  methods: {
    /**
     * @param {BaseLayer|Vue} layer
     * @return {void}
     */
    addLayer: function addLayer(layer) {
      layer = layer instanceof Vue ? layer.$layer : layer;
      instanceOf(layer, BaseLayer);

      if (this.getLayerById(getLayerId(layer)) == null) {
        initializeLayer(layer);

        this._layersCollection.push(layer);
      }
    },

    /**
     * @param {BaseLayer|Vue} layer
     * @return {void}
     */
    removeLayer: function removeLayer(layer) {
      layer = this.getLayerById(getLayerId(layer));
      if (!layer) return;

      this._layersCollection.remove(layer);
    },

    /**
     * @return {BaseLayer[]}
     */
    getLayers: function getLayers() {
      return this._layersCollection.getArray();
    },

    /**
     * @return {module:ol/Collection~Collection<BaseLayer>}
     */
    getLayersCollection: function getLayersCollection() {
      return this._layersCollection;
    },

    /**
     * @param {string|number} layerId
     * @return {BaseLayer|undefined}
     */
    getLayerById: function getLayerById(layerId) {
      return this._layersCollection.getArray().find(function (layer) {
        return getLayerId(layer) === layerId;
      });
    },

    /**
     * @return {void}
     */
    clearLayers: function clearLayers() {
      this._layersCollection.clear();
    },

    /**
     * @returns {Object}
     * @protected
     */
    getServices: function getServices() {
      var vm = this;
      return {
        get layersContainer() {
          return vm;
        }

      };
    }
  },
  created: function created() {
    var _this = this;

    /**
     * @type {Collection<BaseLayer>}
     * @private
     */
    this._layersCollection = new Collection();
    var add = observableFromOlEvent(this._layersCollection, 'add');
    var remove = observableFromOlEvent(this._layersCollection, 'remove');
    var events = merge(add, remove);
    this.subscribeTo(events, function (_ref) {
      var type = _ref.type,
          element = _ref.element;
      ++_this.rev;

      _this.$emit(type + ':layer', element);
    });
  }
};

export default layersContainer;
