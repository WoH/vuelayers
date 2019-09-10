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
import Feature from 'ol/Feature';
import Vue from 'vue';
import { merge } from 'rxjs/_esm5/internal/observable/merge';
import { tap } from 'rxjs/_esm5/internal/operators/tap';
import { debounceTime } from 'rxjs/_esm5/internal/operators/debounceTime';
import { getFeatureId, getObjectUid, initializeFeature, mergeFeatures } from '../ol-ext';
import { instanceOf } from '../util/assert';
import { forEach, isPlainObject } from '../util/minilo';
import projTransforms from './proj-transforms';
import rxSubs from './rx-subs';
import { observableFromOlEvent } from '../rx-ext';

var featuresContainer = {
  mixins: [rxSubs, projTransforms],
  computed: {
    featureIds: function featureIds() {
      if (!this.rev) return [];
      return this.getFeatures().map(getFeatureId);
    },
    featuresViewProj: function featuresViewProj() {
      if (!this.rev) return [];
      return this.getFeatures().map(this.writeFeatureInViewProj.bind(this));
    },
    featuresDataProj: function featuresDataProj() {
      if (!this.rev) return [];
      return this.getFeatures().map(this.writeFeatureInDataProj.bind(this));
    }
  },
  methods: {
    /**
     * @param {Array<(Feature|Vue|Object)>} features
     * @return {void}
     */
    addFeatures: function addFeatures(features) {
      forEach(features, this.addFeature.bind(this));
    },

    /**
     * @param {Feature|Vue|Object} feature
     * @return {void}
     */
    addFeature: function addFeature(feature) {
      if (feature instanceof Vue) {
        feature = feature.$feature;
      } else if (isPlainObject(feature)) {
        feature = this.readFeatureInDataProj(feature);
      }

      instanceOf(feature, Feature);
      initializeFeature(feature);
      var foundFeature = this.getFeatureById(getFeatureId(feature));

      if (foundFeature == null) {
        this._featuresCollection.push(feature);
      } else {
        mergeFeatures(foundFeature, feature);
      }
    },

    /**
     * @param {Array<(Feature|Vue|Object)>} features
     * @return {void}
     */
    removeFeatures: function removeFeatures(features) {
      forEach(features, this.removeFeature.bind(this));
    },

    /**
     * @param {Feature|Vue|Object} feature
     * @return {void}
     */
    removeFeature: function removeFeature(feature) {
      feature = this.getFeatureById(getFeatureId(feature));
      if (!feature) return;
      initializeFeature(feature);

      this._featuresCollection.remove(feature);
    },

    /**
     * @return {void}
     */
    clearFeatures: function clearFeatures() {
      this._featuresCollection.clear();
    },

    /**
     * @param {string|number} featureId
     * @return {Feature|undefined}
     */
    getFeatureById: function getFeatureById(featureId) {
      // todo add hash {featureId => featureIdx, ....}
      return this._featuresCollection.getArray().find(function (feature) {
        return getFeatureId(feature) === featureId;
      });
    },

    /**
     * @return {Feature[]}
     */
    getFeatures: function getFeatures() {
      return this._featuresCollection.getArray();
    },

    /**
     * @return {Collection<Feature>>}
     */
    getFeaturesCollection: function getFeaturesCollection() {
      return this._featuresCollection;
    },

    /**
     * @returns {Object}
     * @protected
     */
    getServices: function getServices() {
      var vm = this;
      return {
        get featuresContainer() {
          return vm;
        }

      };
    }
  },
  created: function created() {
    var _this = this;

    /**
     * @type {Collection<Feature>>}
     * @private
     */
    this._featuresCollection = new Collection();
    this._featureSubs = {};
    var add = observableFromOlEvent(this._featuresCollection, 'add').pipe(tap(function (_ref) {
      var element = _ref.element;
      var elementUid = getObjectUid(element);
      var propChanges = observableFromOlEvent(element, 'propertychange');
      var otherChanges = observableFromOlEvent(element, 'change');
      var featureChanges = merge(propChanges, otherChanges).pipe(debounceTime(1000 / 60));
      _this._featureSubs[elementUid] = _this.subscribeTo(featureChanges, function () {
        ++_this.rev;
      });
    }));
    var remove = observableFromOlEvent(this._featuresCollection, 'remove').pipe(tap(function (_ref2) {
      var element = _ref2.element;
      var elementUid = getObjectUid(element);

      if (!_this._featureSubs[elementUid]) {
        return;
      }

      _this.unsubscribe(_this._featureSubs[elementUid]);

      delete _this._featureSubs[elementUid];
    }));
    var events = merge(add, remove);
    this.subscribeTo(events, function (_ref3) {
      var type = _ref3.type,
          element = _ref3.element;
      ++_this.rev;

      _this.$emit(type + ':feature', element);
    });
  }
};

export default featuresContainer;
