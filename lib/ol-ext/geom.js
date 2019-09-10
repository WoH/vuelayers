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
import pointOnFeature from '@turf/point-on-feature';
import Circle from 'ol/geom/Circle';
import GeometryCollection from 'ol/geom/GeometryCollection';
import LineString from 'ol/geom/LineString';
import MultiLineString from 'ol/geom/MultiLineString';
import MultiPoint from 'ol/geom/MultiPoint';
import MultiPolygon from 'ol/geom/MultiPolygon';
import Point from 'ol/geom/Point';
import Polygon, { circular } from 'ol/geom/Polygon';
import { GEOMETRY_TYPE } from './consts';

/**
 * @param {number|number[]} lonOrCoordinates
 * @param {number} [lat]
 * @return {Point}
 */

function createPointGeom(lonOrCoordinates, lat) {
  var coordinates = Array.isArray(lonOrCoordinates) ? lonOrCoordinates : [lonOrCoordinates, lat];
  return new Point(coordinates);
}
/**
 * @param {Array<number[]>} points
 * @returns {LineString}
 */

function createLineGeom(points) {
  return new LineString(points);
}
/**
 * @param {Array<Array<number[]>>} rings
 * @returns {Polygon}
 */

function createPolygonGeom(rings) {
  return new Polygon(rings);
}
/**
 * @param {Array<number[]>} points
 * @returns {MultiPoint}
 */

function createMultiPointGeom(points) {
  return new MultiPoint(points);
}
/**
 * @param {Array<Array<number[]>>} lines
 * @returns {MultiLineString}
 */

function createMultiLineGeom(lines) {
  return new MultiLineString(lines);
}
/**
 * @param {Array<Array<Array<number[]>>>} polygons
 * @returns {MultiPolygon}
 */

function createMultiPolygonGeom(polygons) {
  return new MultiPolygon(polygons);
}
/**
 * @param {Geometry[]} geoms
 * @returns {GeometryCollection}
 */

function createGeomCollection(geoms) {
  return new GeometryCollection(geoms);
}
/**
 * @param {Coordinate|number[]} center
 * @param {number} radius
 * @return {Polygon}
 */

function createCircularPolygon(center, radius) {
  return circular(center, radius);
}
/**
 * @param {Geometry|Object} geom
 * @return {boolean}
 * @throws {Error}
 */

function isMultiGeom(geom) {
  var multiTypes = [GEOMETRY_TYPE.MULTI_POINT, GEOMETRY_TYPE.MULTI_LINE_STRING, GEOMETRY_TYPE.MULTI_POLYGON, GEOMETRY_TYPE.GEOMETRY_COLLECTION];
  return multiTypes.includes(geom.type || geom.getType());
}
/**
 * @param {Geometry|Object} geom
 * @return {SimpleGeometry|Object}
 * @throws {Error}
 */

function toSimpleGeom(geom) {
  if (geom instanceof Circle) {
    geom = createPointGeom(geom.getCenter());
  }

  var type = geom.type || geom.getType();
  var complexTypes = [GEOMETRY_TYPE.GEOMETRY_COLLECTION];

  if (complexTypes.includes(type) === false) {
    return geom;
  }

  return (geom.geometries || geom.getGeometries())[0];
}
/**
 * @param {Geometry|Object} geom
 * @return {Coordinate|undefined}
 */

function findPointOnSurface(geom) {
  var simpleGeom = toSimpleGeom(geom);
  var pointFeature = pointOnFeature({
    type: simpleGeom.type || simpleGeom.getType(),
    coordinates: simpleGeom.coordinates || simpleGeom.getCoordinates()
  });

  if (pointFeature && pointFeature.geometry) {
    return pointFeature.geometry.coordinates;
  }
}

export { createPointGeom, createLineGeom, createPolygonGeom, createMultiPointGeom, createMultiLineGeom, createMultiPolygonGeom, createGeomCollection, createCircularPolygon, isMultiGeom, toSimpleGeom, findPointOnSurface };
