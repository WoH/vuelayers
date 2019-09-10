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
import BaseGeoJSON from 'ol/format/GeoJSON';
import MVT from 'ol/format/MVT';
import TopoJSON from 'ol/format/TopoJSON';
import { isEmpty } from '../util/minilo';
import { EPSG_4326 } from './consts';
import { createCircularPolygon } from './geom';
import { transformPoint } from './proj';
import { isCircle } from './util';
import LineString from 'ol/geom/LineString';
import { getLength } from 'ol/sphere';

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

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

/**
 * @param {Object} [options]
 * @return {GeoJSON}
 */

function createGeoJsonFmt(options) {
  return new GeoJSON(options);
}
/**
 * @param {Object} [options]
 * @return {TopoJSON}
 */

function createTopoJsonFmt(options) {
  return new TopoJSON(options);
}
/**
 * @param [options]
 * @return {MVT}
 */

function createMvtFmt(options) {
  return new MVT(options);
}

var GeoJSON =
/*#__PURE__*/
function (_BaseGeoJSON) {
  _inherits(GeoJSON, _BaseGeoJSON);

  function GeoJSON() {
    _classCallCheck(this, GeoJSON);

    return _possibleConstructorReturn(this, _getPrototypeOf(GeoJSON).apply(this, arguments));
  }

  _createClass(GeoJSON, [{
    key: "writeGeometryObject",
    value: function writeGeometryObject(geometry, options) {
      if (isCircle(geometry)) {
        var start = geometry.getCenter();
        var end = [start[0] + geometry.getRadius(), start[1]];
        var radius = getLength(new LineString([start, end]), options.featureProjection || this.defaultFeatureProjection);
        geometry = createCircularPolygon(transformPoint(geometry.getCenter(), options.featureProjection || this.defaultFeatureProjection, EPSG_4326), radius);
        options.featureProjection = EPSG_4326;
      }

      return _get(_getPrototypeOf(GeoJSON.prototype), "writeGeometryObject", this).call(this, geometry, options);
    }
  }, {
    key: "writeFeatureObject",
    value: function writeFeatureObject(feature, options) {
      var object =
      /** @type {Object} */
      {
        'type': 'Feature'
      };
      var id = feature.getId();

      if (id !== undefined) {
        object.id = id;
      }

      var geometry = feature.getGeometry();

      if (geometry) {
        object.geometry = this.writeGeometryObject(geometry, options);
      } else {
        object.geometry = null;
      }

      var properties = feature.getProperties();
      delete properties[feature.getGeometryName()];

      if (!isEmpty(properties)) {
        object.properties = properties;
      } else {
        object.properties = null;
      }

      return object;
    }
  }]);

  return GeoJSON;
}(BaseGeoJSON);

export { createGeoJsonFmt, createTopoJsonFmt, createMvtFmt };
