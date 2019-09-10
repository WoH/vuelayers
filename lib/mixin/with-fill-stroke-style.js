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

var methods = {
  /**
   * @param {Fill|Vue|undefined} fill
   * @return {void}
   * @protected
   */
  setFill: function setFill(fill) {
    fill = fill instanceof Vue ? fill.$style : fill;

    if (fill !== this._fill) {
      this._fill = fill;
    }

    if (this.$style && fill !== this.$style.getFill()) {
      this.$style.setFill(fill);
      this.scheduleRefresh();
    }
  },

  /**
   * @param {Stroke|Vue|undefined} stroke
   * @return {void}
   * @protected
   */
  setStroke: function setStroke(stroke) {
    stroke = stroke instanceof Vue ? stroke.$style : stroke;

    if (stroke !== this._stroke) {
      this._stroke = stroke;
    }

    if (this.$style && stroke !== this.$style.getStroke()) {
      this.$style.setStroke(stroke);
      this.scheduleRefresh();
    }
  }
};
var withFillStrokeStyle = {
  methods: methods,
  stubVNode: {
    empty: false,
    attrs: function attrs() {
      return {
        class: this.$options.name
      };
    }
  },
  created: function created() {
    /**
     * @type {Fill|undefined}
     * @private
     */
    this._fill = undefined;
    /**
     * @type {Stroke|undefined}
     * @private
     */

    this._stroke = undefined;
  }
};

export default withFillStrokeStyle;
