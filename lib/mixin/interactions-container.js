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
import Interaction from 'ol/interaction/Interaction';
import Vue from 'vue';
import { merge } from 'rxjs/_esm5/internal/observable/merge';
import { getInteractionId, getInteractionPriority, initializeInteraction } from '../ol-ext';
import { instanceOf } from '../util/assert';
import rxSubs from './rx-subs';
import { observableFromOlEvent } from '../rx-ext';

var interactionsContainer = {
  mixins: [rxSubs],
  computed: {
    interactionIds: function interactionIds() {
      if (!this.rev) return [];
      return this.getInteractions().map(getInteractionId);
    }
  },
  methods: {
    /**
     * @param {Interaction|Vue} interaction
     * @return {void}
     */
    addInteraction: function addInteraction(interaction) {
      interaction = interaction instanceof Vue ? interaction.$interaction : interaction;
      instanceOf(interaction, Interaction);

      if (this.getInteractionById(getInteractionId(interaction)) == null) {
        initializeInteraction(interaction);

        this._interactionsCollection.push(interaction);

        this.sortInteractions();
      }
    },

    /**
     * @param {Interaction|Vue} interaction
     * @return {void}
     */
    removeInteraction: function removeInteraction(interaction) {
      interaction = this.getInteractionById(getInteractionId(interaction));
      if (!interaction) return;

      this._interactionsCollection.remove(interaction);

      this.sortInteractions();
    },

    /**
     * @return {Interaction[]}
     */
    getInteractions: function getInteractions() {
      return this._interactionsCollection.getArray();
    },

    /**
     * @return {Collection<Interaction>>}
     */
    getInteractionsCollection: function getInteractionsCollection() {
      return this._interactionsCollection;
    },

    /**
     * @param {string|number} interactionId
     * @return {Interaction|undefined}
     */
    getInteractionById: function getInteractionById(interactionId) {
      return this._interactionsCollection.getArray().find(function (interaction) {
        return getInteractionId(interaction) === interactionId;
      });
    },

    /**
     * @return {void}
     */
    sortInteractions: function sortInteractions(sorter) {
      sorter || (sorter = this.getDefaultInteractionsSorter());

      this._interactionsCollection.getArray().sort(sorter);
    },

    /**
     * @return {function}
     * @protected
     */
    getDefaultInteractionsSorter: function getDefaultInteractionsSorter() {
      // sort interactions by priority in asc order
      // the higher the priority, the earlier the interaction handles the event
      return function (a, b) {
        var ap = getInteractionPriority(a) || 0;
        var bp = getInteractionPriority(b) || 0;
        return ap === bp ? 0 : ap - bp;
      };
    },

    /**
     * @return {void}
     */
    clearInteractions: function clearInteractions() {
      this._interactionsCollection.clear();
    },

    /**
     * @returns {Object}
     * @protected
     */
    getServices: function getServices() {
      var vm = this;
      return {
        get interactionsContainer() {
          return vm;
        }

      };
    }
  },
  created: function created() {
    var _this = this;

    /**
     * @type {Collection<Interaction>>}
     * @private
     */
    this._interactionsCollection = new Collection();
    var add = observableFromOlEvent(this._interactionsCollection, 'add');
    var remove = observableFromOlEvent(this._interactionsCollection, 'remove');
    var events = merge(add, remove);
    this.subscribeTo(events, function (_ref) {
      var type = _ref.type,
          element = _ref.element;
      ++_this.rev;

      _this.$emit(type + ':interaction', element);
    });
  }
};

export default interactionsContainer;
