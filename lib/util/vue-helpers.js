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
/**
 * Constructs watch hash for multiple properties.
 * @param {string[]} props
 * @param {function|Object} watcherFactory
 */
function makeWatchers(props, watcherFactory) {
  return props.reduce(function (hash, prop) {
    hash[prop] = watcherFactory(prop);
    return hash;
  }, {});
}
function extractChildren(slots) {
  var slotNames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return Object.keys(slots).reduce(function (all, name) {
    if (!slotNames.length || slotNames.includes(name)) {
      all = all.concat(slots[name]);
    }

    return all;
  }, []);
}

export { makeWatchers, extractChildren };
