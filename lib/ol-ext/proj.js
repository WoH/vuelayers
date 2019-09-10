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
import { addProjection, fromLonLat, get, toLonLat, transform, transformExtent } from 'ol/proj';
export { transform, transformExtent, get as getProj, addProjection as addProj } from 'ol/proj';
import Projection from 'ol/proj/Projection';
import { EPSG_3857, EPSG_4326, GEOMETRY_TYPE } from './consts';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var _transforms;
/**
 * @param {Object} options
 * @return {Projection}
 */

function createProj(options) {
  return new Projection(options);
}
/**
 * @param {number[]} coordinate
 * @param {ProjectionLike} [projection]
 * @return {Coordinate|number[]}
 */

function pointToLonLat(coordinate) {
  var projection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EPSG_3857;
  return toLonLat(coordinate, projection);
}
/**
 * @param {number[]} coordinate
 * @param {ProjectionLike} [projection]
 * @return {number[]}
 */

function pointFromLonLat(coordinate) {
  var projection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EPSG_3857;
  return fromLonLat(coordinate, projection);
}
function transformPoint(coordinate, sourceProjection, destProjection) {
  return transform(coordinate, sourceProjection, destProjection);
}
/**
 * @param {Array<number[]>} coordinates
 * @param {ProjectionLike} [projection]
 * @return {Array<number[]>}
 */

function lineToLonLat(coordinates) {
  var projection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EPSG_3857;
  return coordinates.map(function (point) {
    return pointToLonLat(point, projection);
  });
}
/**
 * @param {Array<number[]>} coordinates
 * @param {ProjectionLike} [projection]
 * @return {Array<number[]>}
 */

function lineFromLonLat(coordinates) {
  var projection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EPSG_3857;
  return coordinates.map(function (point) {
    return pointFromLonLat(point, projection);
  });
}
function transformLine(coordinates, sourceProjection, destProjection) {
  return coordinates.map(function (point) {
    return transform(point, sourceProjection, destProjection);
  });
}
/**
 * @param {Array<Array<number[]>>} coordinates
 * @param {ProjectionLike} [projection]
 * @return {Array<Array<number[]>>}
 */

function polygonToLonLat(coordinates) {
  var projection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EPSG_3857;
  return coordinates.map(function (line) {
    return lineToLonLat(line, projection);
  });
}
/**
 * @param {Array<Array<number[]>>} coordinates
 * @param {ProjectionLike} [projection]
 * @return {Array<Array<number[]>>}
 */

function polygonFromLonLat(coordinates) {
  var projection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EPSG_3857;
  return coordinates.map(function (line) {
    return lineFromLonLat(line, projection);
  });
}
function transformPolygon(coordinates, sourceProjection, destProjection) {
  return coordinates.map(function (line) {
    return transformLine(line, sourceProjection, destProjection);
  });
}
/**
 * @param {Array<number[]>} coordinates
 * @param {ProjectionLike} [projection]
 * @return {Array<number[]>}
 */

function multiPointToLonLat(coordinates) {
  var projection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EPSG_3857;
  return coordinates.map(function (point) {
    return pointToLonLat(point, projection);
  });
}
/**
 * @param {Array<number[]>} coordinates
 * @param {ProjectionLike} [projection]
 * @return {Array<number[]>}
 */

function multiPointFromLonLat(coordinates) {
  var projection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EPSG_3857;
  return coordinates.map(function (point) {
    return pointFromLonLat(point, projection);
  });
}
function transformMultiPoint(coordinates, sourceProjection, destProjection) {
  return coordinates.map(function (point) {
    return transformPoint(point, sourceProjection, destProjection);
  });
}
/**
 * @param {Array<Array<number[]>>} coordinates
 * @param {ProjectionLike} [projection]
 * @return {Array<Array<number[]>>}
 */

function multiLineToLonLat(coordinates) {
  var projection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EPSG_3857;
  return coordinates.map(function (line) {
    return lineToLonLat(line, projection);
  });
}
/**
 * @param {Array<Array<number[]>>} coordinates
 * @param {ProjectionLike} [projection]
 * @return {Array<Array<number[]>>}
 */

function multiLineFromLonLat(coordinates) {
  var projection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EPSG_3857;
  return coordinates.map(function (line) {
    return lineFromLonLat(line, projection);
  });
}
function transformMultiLine(coordinates, sourceProjection, destProjection) {
  return coordinates.map(function (line) {
    return transformLine(line, sourceProjection, destProjection);
  });
}
/**
 * @param {Array<Array<Array<number[]>>>} coordinates
 * @param {ProjectionLike} projection
 * @return {Array<Array<Array<number[]>>>}
 */

function multiPolygonToLonLat(coordinates) {
  var projection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EPSG_3857;
  return coordinates.map(function (polygon) {
    return polygonToLonLat(polygon, projection);
  });
}
/**
 * @param {Array<Array<Array<number[]>>>} coordinates
 * @param {ProjectionLike} projection
 * @return {Array<Array<Array<number[]>>>}
 */

function multiPolygonFromLonLat(coordinates) {
  var projection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EPSG_3857;
  return coordinates.map(function (polygon) {
    return polygonFromLonLat(polygon, projection);
  });
}
function transformMultiPolygon(coordinates, sourceProjection, destProjection) {
  return coordinates.map(function (polygon) {
    return transformPolygon(polygon, sourceProjection, destProjection);
  });
}
/**
 * Transforms by geom type
 * @type {Object<string, function>}
 */

var transforms = (_transforms = {}, _defineProperty(_transforms, GEOMETRY_TYPE.POINT, {
  toLonLat: pointToLonLat,
  fromLonLat: pointFromLonLat,
  transform: transformPoint
}), _defineProperty(_transforms, GEOMETRY_TYPE.LINE_STRING, {
  toLonLat: lineToLonLat,
  fromLonLat: lineFromLonLat,
  transform: transformLine
}), _defineProperty(_transforms, GEOMETRY_TYPE.POLYGON, {
  toLonLat: polygonToLonLat,
  fromLonLat: polygonFromLonLat,
  transform: transformPolygon
}), _defineProperty(_transforms, GEOMETRY_TYPE.MULTI_POINT, {
  toLonLat: multiPointToLonLat,
  fromLonLat: multiPointFromLonLat,
  transform: transformMultiPoint
}), _defineProperty(_transforms, GEOMETRY_TYPE.MULTI_LINE_STRING, {
  toLonLat: multiLineToLonLat,
  fromLonLat: multiLineFromLonLat,
  transform: transformMultiLine
}), _defineProperty(_transforms, GEOMETRY_TYPE.MULTI_POLYGON, {
  toLonLat: multiPolygonToLonLat,
  fromLonLat: multiPolygonFromLonLat,
  transform: transformMultiPolygon
}), _transforms);
/**
 * @param {Extent} extent
 * @param {ProjectionLike} [projection=EPSG:3857]
 * @return {Extent}
 */

function extentFromLonLat(extent) {
  var projection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EPSG_3857;
  return transformExtent(extent, EPSG_4326, projection);
}
/**
 * @param {Extent} extent
 * @param {ProjectionLike} [projection=EPSG:3857]
 * @return {Extent}
 */

function extentToLonLat(extent) {
  var projection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EPSG_3857;
  return transformExtent(extent, projection, EPSG_4326);
}

export { createProj, pointToLonLat, pointFromLonLat, transformPoint, lineToLonLat, lineFromLonLat, transformLine, polygonToLonLat, polygonFromLonLat, transformPolygon, multiPointToLonLat, multiPointFromLonLat, transformMultiPoint, multiLineToLonLat, multiLineFromLonLat, transformMultiLine, multiPolygonToLonLat, multiPolygonFromLonLat, transformMultiPolygon, transforms, extentFromLonLat, extentToLonLat };
