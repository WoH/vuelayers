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
import Overlay from 'ol/Overlay';
import Vue from 'vue';
import { merge } from 'rxjs/_esm5/internal/observable/merge';
import { getOverlayId, initializeOverlay } from '../ol-ext';
import { observableFromOlEvent } from '../rx-ext';
import { instanceOf } from '../util/assert';
import rxSubs from './rx-subs';

var overlaysContainer = {
  mixins: [rxSubs],
  computed: {
    overlayIds: function overlayIds() {
      if (!this.rev) return [];
      return this.getOverlays().map(getOverlayId);
    }
  },
  methods: {
    /**
     * @param {Overlay|Vue} overlay
     * @return {void}
     */
    addOverlay: function addOverlay(overlay) {
      overlay = overlay instanceof Vue ? overlay.$overlay : overlay;
      instanceOf(overlay, Overlay);

      if (this.getOverlayById(getOverlayId(overlay)) == null) {
        initializeOverlay(overlay);

        this._overlaysCollection.push(overlay);
      }
    },

    /**
     * @param {Overlay|Vue} overlay
     * @return {void}
     */
    removeOverlay: function removeOverlay(overlay) {
      overlay = this.getOverlayById(getOverlayId(overlay));
      if (!overlay) return;

      this._overlaysCollection.remove(overlay);
    },

    /**
     * @return {Overlay[]}
     */
    getOverlays: function getOverlays() {
      return this._overlaysCollection.getArray();
    },

    /**
     * @return {Collection<Overlay>}
     */
    getOverlaysCollection: function getOverlaysCollection() {
      return this._overlaysCollection;
    },

    /**
     * @param {string|number} overlayId
     * @return {Overlay|undefined}
     */
    getOverlayById: function getOverlayById(overlayId) {
      return this._overlaysCollection.getArray().find(function (overlay) {
        return getOverlayId(overlay) === overlayId;
      });
    },

    /**
     * @return {void}
     */
    clearOverlays: function clearOverlays() {
      this._overlaysCollection.clear();
    },

    /**
     * @returns {Object}
     * @protected
     */
    getServices: function getServices() {
      var vm = this;
      return {
        get overlaysContainer() {
          return vm;
        }

      };
    }
  },
  created: function created() {
    var _this = this;

    /**
     * @type {Collection<Overlay>}
     * @private
     */
    this._overlaysCollection = new Collection();
    var add = observableFromOlEvent(this._overlaysCollection, 'add');
    var remove = observableFromOlEvent(this._overlaysCollection, 'remove');
    var events = merge(add, remove);
    this.subscribeTo(events, function (_ref) {
      var type = _ref.type,
          element = _ref.element;
      ++_this.rev;

      _this.$emit(type + ':overlay', element);
    });
  }
};

export default overlaysContainer;
