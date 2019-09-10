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
import { toSize } from 'ol/size';
import { createXYZ } from 'ol/tilegrid';
export { createXYZ as createXyzGrid } from 'ol/tilegrid';
import TileGrid from 'ol/tilegrid/TileGrid';
import { EXTENT_CORNER, MAX_ZOOM, TILE_SIZE } from './consts';
import { createExtentFromProjection, getExtentCorner, getExtentHeight, getExtentWidth } from './extent';

/**
 * Create a resolutions array from an extent.  A zoom factor of 2 is assumed.
 * @param {Extent} extent Extent.
 * @param {number=} maxZoom Maximum zoom level (default is
 *     ol.DEFAULT_MAX_ZOOM).
 * @param {number|Size=} tileSize Tile size (default uses
 *     ol.DEFAULT_TILE_SIZE).
 * @return {!Array.<number>} Resolutions array.
 * @see https://github.com/openlayers/openlayers/blob/master/src/ol/tilegrid.js#L104
 */

function resolutionsFromExtent(extent) {
  var maxZoom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : MAX_ZOOM;
  var tileSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : TILE_SIZE;
  tileSize = toSize(tileSize);
  var height = getExtentHeight(extent);
  var width = getExtentWidth(extent);
  var maxResolution = Math.max(width / tileSize[0], height / tileSize[1]);
  var length = maxZoom + 1;
  var resolutions = new Array(length);

  for (var z = 0; z < length; ++z) {
    resolutions[z] = maxResolution / Math.pow(2, z);
  }

  return resolutions;
}
/**
 * @param {Extent} extent Extent.
 * @param {number=} maxZoom Maximum zoom level (default is MAX_ZOOM).
 * @param {number|Size=} tileSize Tile size (default uses TILE_SIZE).
 * @param {string} [corner] Extent corner (default is EXTENT_CORNER.TOP_LEFT).
 * @return {TileGrid} TileGrid instance.
 * @see https://github.com/openlayers/openlayers/blob/master/src/ol/tilegrid.js#L58
 */

function createGridForExtent(extent) {
  var maxZoom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : MAX_ZOOM;
  var tileSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : TILE_SIZE;
  var corner = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EXTENT_CORNER.TOP_LEFT;
  var resolutions = resolutionsFromExtent(extent, maxZoom, tileSize);
  return new TileGrid({
    extent: extent,
    origin: getExtentCorner(extent, corner),
    resolutions: resolutions,
    tileSize: tileSize
  });
}
/**
 * @param {ProjectionLike} projection Projection.
 * @param {number=} maxZoom Maximum zoom level (default is
 *     ol.DEFAULT_MAX_ZOOM).
 * @param {number|Size=} tileSize Tile size (default uses ol.DEFAULT_TILE_SIZE).
 * @param {string} corner Extent corner (default is
 *     ol.extent.Corner.BOTTOM_LEFT).
 * @return {TileGrid} TileGrid instance.
 * @see https://github.com/openlayers/openlayers/blob/master/src/ol/tilegrid.js#L135
 */

function createGridForProjection(projection) {
  var maxZoom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : MAX_ZOOM;
  var tileSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : TILE_SIZE;
  var corner = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EXTENT_CORNER.BOTTOM_LEFT;
  return createGridForExtent(createExtentFromProjection(projection), maxZoom, tileSize, corner);
}

export { resolutionsFromExtent, createGridForExtent, createGridForProjection };
