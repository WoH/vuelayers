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
import { interval } from 'rxjs/_esm5/internal/observable/interval';
import { first } from 'rxjs/_esm5/internal/operators/first';
import { map } from 'rxjs/_esm5/internal/operators/map';
import { skipWhile } from 'rxjs/_esm5/internal/operators/skipWhile';

/**
 * Basic mixin for ol components that depends on map instance
 */

var useMapCmp = {
  methods: {
    /**
     * @return {Promise<void>}
     * @protected
     */
    beforeInit: function beforeInit() {
      var _this = this;

      // waits while $map service will be injected
      return interval(100).pipe(skipWhile(function () {
        return !_this.$map;
      }), first(), map(function () {
        return _this;
      })).toPromise(Promise);
    }
  }
};

export default useMapCmp;
