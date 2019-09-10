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
import { pick, replaceTokens } from '../util/minilo';

var withUrl = {
  props: {
    url: {
      type: String
    }
  },
  computed: {
    /**
     * @type {string}
     */
    urlTmpl: function urlTmpl() {
      return replaceTokens(this.url, pick(this, this.urlTokens));
    },

    /**
     * @type {string[]}
     */
    urlTokens: function urlTokens() {
      return [];
    }
  }
};

export default withUrl;
