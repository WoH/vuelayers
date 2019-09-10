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
var EPSG_4326 = 'EPSG:4326';
var EPSG_3857 = 'EPSG:3857';
/**
 * @type {number} Default map max zoom
 */

var MAX_ZOOM = 28;
/**
 * @type {number} Default map min zoom
 */

var MIN_ZOOM = 0;
/**
 * @type {number} Default tile size
 */

var TILE_SIZE = 256;
/**
 * @type {string}
 */

var TILE_FORMAT = 'png';
/**
 * @type {number} Default zoom factor
 */

var ZOOM_FACTOR = 2;
/**
 * @type {number}
 */

var CACHE_SIZE = 2048;
/**
 * @type {number}
 */

var PIXEL_RATIO = 1;
/**
 * @type {string}
 */

var CROSS_ORIGIN = 'anonymous';
/**
 * @type {number}
 */

var REPROJ_ERR_THRESHOLD = 0.5;
/**
 * @type {number} Earth radius in meters
 */

var EARTH_RADIUS = 6378137;
var RENDERER_TYPE = {
  CANVAS: 'canvas',
  WEBGL: 'webgl'
};
var GEOMETRY_TYPE = {
  POINT: 'Point',
  LINE_STRING: 'LineString',
  POLYGON: 'Polygon',
  MULTI_POINT: 'MultiPoint',
  MULTI_LINE_STRING: 'MultiLineString',
  MULTI_POLYGON: 'MultiPolygon',
  GEOMETRY_COLLECTION: 'GeometryCollection',
  CIRCLE: 'Circle'
};
var EXTENT_CORNER = {
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_RIGHT: 'bottom-right',
  TOP_LEFT: 'top-left',
  TOP_RIGHT: 'top-right'
};
var PROJ_UNIT = {
  DEGREES: 'degrees',
  FEET: 'ft',
  METERS: 'm',
  PIXELS: 'pixels',
  TILE_PIXELS: 'tile-pixels',
  USFEET: 'us-ft'
};
var OVERLAY_POSITIONING = {
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_CENTER: 'bottom-center',
  BOTTOM_RIGHT: 'bottom-right',
  CENTER_LEFT: 'center-left',
  CENTER_CENTER: 'center-center',
  CENTER_RIGHT: 'center-right',
  TOP_LEFT: 'top-left',
  TOP_CENTER: 'top-center',
  TOP_RIGHT: 'top-right'
  /**
   * @type {string} Default WMS version
   */

};
var WMS_VERSION = '1.3.0';
var WMTS_VERSION = '1.0.0';
var WMTS_REQUEST_ENCODING = 'KVP';
var WMTS_FORMAT = 'image/jpeg';
var LAYER_PROP = 'layer';
var ARCGIS_EXTRA_PARAMS = ['FORMAT', 'F', 'LAYERS', 'LAYERDEFS', 'DYNAMICLAYERS', 'DPI', 'TRANSPARENT', 'TIME', 'LAYERTIMEOPTIONS', 'GDBVERSION', 'MAPSCALE', 'ROTATION', 'DATUMTRANSFORMATIONS', 'MAPRANGEVALUES', 'LAYERRANGEVALUES', 'LAYERPARAMETERVALUES', 'HISTORICMOMENT'];

export { EPSG_4326, EPSG_3857, MAX_ZOOM, MIN_ZOOM, TILE_SIZE, TILE_FORMAT, ZOOM_FACTOR, CACHE_SIZE, PIXEL_RATIO, CROSS_ORIGIN, REPROJ_ERR_THRESHOLD, EARTH_RADIUS, RENDERER_TYPE, GEOMETRY_TYPE, EXTENT_CORNER, PROJ_UNIT, OVERLAY_POSITIONING, WMS_VERSION, WMTS_VERSION, WMTS_REQUEST_ENCODING, WMTS_FORMAT, LAYER_PROP, ARCGIS_EXTRA_PARAMS };
