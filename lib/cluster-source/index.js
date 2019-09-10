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
import Cluster from 'ol/source/Cluster';
import { interval } from 'rxjs/_esm5/internal/observable/interval';
import { first } from 'rxjs/_esm5/internal/operators/first';
import { map } from 'rxjs/_esm5/internal/operators/map';
import { skipWhile } from 'rxjs/_esm5/internal/operators/skipWhile';
import { ok } from '../util/assert';
import sourceContainer from '../mixin/source-container';
import vectorSource from '../mixin/vector-source';
import { createPointGeom, findPointOnSurface } from '../ol-ext/geom';
import mergeDescriptors from '../util/multi-merge-descriptors';
import { pick } from '../util/minilo';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var Builder =
/*#__PURE__*/
function () {
  function Builder() {
    _classCallCheck(this, Builder);
  }

  _createClass(Builder, [{
    key: "getSource",
    value: function getSource() {
      return this.source;
    }
    /**
     * @param {Vector|undefined} value
     * @returns {Builder}
     */

  }, {
    key: "setSource",
    value: function setSource(value) {
      this.source = value;
      return this;
    }
    /**
     * @param value
     * @returns {Builder}
     */

  }, {
    key: "setAttributions",
    value: function setAttributions(value) {
      this.attributions = value;
      return this;
    }
    /**
     * @param value
     * @returns {Builder}
     */

  }, {
    key: "setDistance",
    value: function setDistance(value) {
      this.distance = value;
      return this;
    }
    /**
     * @param value
     * @returns {Builder}
     */

  }, {
    key: "setGeometryFunction",
    value: function setGeometryFunction(value) {
      this.geometryFunction = value;
      return this;
    }
    /**
     * @param value
     * @returns {Builder}
     */

  }, {
    key: "setLogo",
    value: function setLogo(value) {
      this.logo = value;
      return this;
    }
    /**
     * @param value
     * @returns {Builder}
     */

  }, {
    key: "setProjection",
    value: function setProjection(value) {
      this.projection = value;
      return this;
    }
    /**
     * @param value
     * @returns {Builder}
     */

  }, {
    key: "setWrapX",
    value: function setWrapX(value) {
      this.wrapX = value;
      return this;
    }
    /**
     * @param key
     * @param value
     * @return {void}
     */

  }, {
    key: "set",
    value: function set(key, value) {
      this.values || (this.values = {});
      this.values[key] = value;
    }
    /**
     * @return {Cluster}
     */

  }, {
    key: "build",
    value: function build() {
      ok(this.source, 'source is provided');
      var source = new Cluster({
        attributions: this.attributions,
        distance: this.distance,
        geometryFunction: this.geometryFunction,
        logo: this.logo,
        projection: this.projection,
        source: this.source,
        wrapX: this.wrapX
      });
      source.setProperties(this.values);
      return source;
    }
    /**
     * @return {Promise<Cluster>}
     */

  }, {
    key: "promise",
    value: function promise() {
      var _this = this;

      return interval(100).pipe(skipWhile(function () {
        return !_this.source;
      }), first(), map(this.build.bind(this))).toPromise(Promise);
    }
  }]);

  return Builder;
}();

var props = {
  distance: {
    type: Number,
    default: 20
  },

  /**
   * Geometry function factory
   * @type {function(): (function(f: ol.Feature): ol.geom.SimpleGeometry|undefined)} geomFuncFactory
   */
  geomFuncFactory: {
    type: Function,
    default: defaultGeomFuncFactory
  }
};
var computed = {
  geomFunc: function geomFunc() {
    return this.geomFuncFactory();
  }
};
var methods = {
  /**
   * @return {Promise<ol.source.Cluster>}
   * @protected
   */
  createSource: function createSource() {
    // partial setup of ol.source.Cluster with the help of SourceBuilder class

    /**
     * @type {SourceBuilder}
     * @private
     */
    this._sourceBuilder = new Builder().setAttributions(this.attributions).setDistance(this.distance).setGeometryFunction(this.geomFunc).setLogo(this.logo).setProjection(this.projection).setWrapX(this.wrapX);
    return this._sourceBuilder.promise();
  },

  /**
   * @return {Object}
   * @protected
   */
  getServices: function getServices() {
    return mergeDescriptors(vectorSource.methods.getServices.call(this), sourceContainer.methods.getServices.call(this));
  },

  /**
   * @return {{
   *     setSource: function(ol.source.Source): void,
   *     getSource: function(): ol.source.Source
   *   }|undefined}
   * @protected
   */
  getSourceTarget: function getSourceTarget() {
    return this._sourceBuilder;
  }
};
var watch = {
  distance: function distance(value) {
    if (this.$source && value !== this.$source.getDistance()) {
      this.$source.setDistance(value);
    }
  }
};
var script = {
  name: 'vl-source-cluster',
  mixins: [vectorSource, sourceContainer],
  props: props,
  computed: computed,
  methods: methods,
  watch: watch
  /**
   * @returns {function(f: ol.Feature): ol.geom.SimpleGeometry|undefined}
   */

};

function defaultGeomFuncFactory() {
  return function (feature) {
    var geometry = feature.getGeometry();
    if (!geometry) return;
    var coordinate = findPointOnSurface(geometry);

    if (coordinate) {
      return createPointGeom(coordinate);
    }
  };
}

/* script */
var __vue_script__ = script;
/* template */

/* style */

var __vue_inject_styles__ = undefined;
/* scoped */

var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = undefined;
/* functional template */

var __vue_is_functional_template__ = undefined;
/* component normalizer */

function __vue_normalize__(template, style, script$$1, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script$$1 === 'function' ? script$$1.options : script$$1) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "source.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  return component;
}
/* style inject */

/* style inject SSR */


var Source = __vue_normalize__({}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, undefined, undefined);

function plugin(Vue) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (plugin.installed) {
    return;
  }

  plugin.installed = true;
  options = pick(options, 'dataProjection');
  Object.assign(Source, options);
  Vue.component(Source.name, Source);
}

export default plugin;
export { Source, plugin as install };
