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
import { extractChildren } from '../util/vue-helpers';

/**
 * Renders stub VNode for component.
 */

var stubVnode = {
  /**
   * @param {function} h
   * @returns {VNode}
   */
  render: function render(h) {
    var options = this.$options.stubVNode || {}; // render as HTML comment

    if (options.empty) {
      var vnode = h();

      if (typeof options.empty === 'string') {
        vnode.text = options.empty;
      } else if (typeof options.empty === 'function') {
        vnode.text = options.empty.call(this);
      }

      return vnode;
    }

    var children;

    if (options.slots === false) {
      children = undefined;
    } else {
      children = extractChildren(this.$slots, options.slots);
    }

    var attrs = typeof options.attrs === 'function' ? options.attrs.call(this) : options.attrs;
    var data = {
      attrs: attrs,
      style: {
        display: 'none !important'
      }
    };
    return h(options.tag || 'i', data, children);
  }
};

export default stubVnode;
