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
import { error } from '../util/log';
import { noop } from '../util/minilo';

/**
 * RxJS subscriptions manager.
 */

var rxSubs = {
  methods: {
    /**
     * @return {void}
     * @protected
     */
    subscribeAll: function subscribeAll() {},

    /**
     * @return {void}
     * @protected
     */
    unsubscribeAll: function unsubscribeAll() {
      this._rxSubs.forEach(function (x) {
        return x.unsubscribe();
      });

      this._rxSubs = [];
    },

    /**
     * @param {Observable<T>} observable
     * @param {function} [next] Next handler or Observer object.
     * @param {function} [error] Error handler.
     * @param {function} [complete] Complete handler.
     * @return {Subscription}
     * @protected
     */
    subscribeTo: function subscribeTo(observable) {
      var next = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

      var _error = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;

      var complete = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : noop;

      _error = function error$$1(err) {
        if (process.env.NODE_ENV !== 'production') {
          error(err.stack);
        }

        _error(err);
      };

      var subs = observable.subscribe(next, _error, complete);

      this._rxSubs.push(subs);

      return subs;
    },
    unsubscribe: function unsubscribe(subs) {
      var idx = this._rxSubs.indexOf(subs);

      if (idx === -1) return;
      subs.unsubscribe();

      this._rxSubs.splice(idx, 1);
    }
  },
  beforeCreate: function beforeCreate() {
    /**
     * @type {Subscription[]}
     * @private
     */
    this._rxSubs = [];
  },
  destroyed: function destroyed() {
    this.unsubscribeAll();
  }
};

export default rxSubs;
