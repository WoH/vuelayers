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
import { boundingExtent, getBottomLeft, getBottomRight, getCenter, getHeight, getTopLeft, getTopRight, getWidth } from 'ol/extent';
export { getCenter as getExtentCenter, getWidth as getExtentWidth, getHeight as getExtentHeight, boundingExtent } from 'ol/extent';
import { get } from 'ol/proj';
import { METERS_PER_UNIT } from 'ol/proj/Units';
import { EXTENT_CORNER, PROJ_UNIT } from './consts';

/**
 * Extent extensions
 */
/**
 * Create a new extent or update the provided extent.
 * @param {number} minX Minimum X.
 * @param {number} minY Minimum Y.
 * @param {number} maxX Maximum X.
 * @param {number} maxY Maximum Y.
 * @param {Extent=} extent Destination extent.
 * @return {Extent} Extent.
 * @see https://github.com/openlayers/openlayers/blob/master/src/ol/extent.js#L208
 */

function createOrUpdateExtent(minX, minY, maxX, maxY, extent) {
  if (extent) {
    extent[0] = minX;
    extent[1] = minY;
    extent[2] = maxX;
    extent[3] = maxY;
    return extent;
  } else {
    return [minX, minY, maxX, maxY];
  }
}
/**
 * Get a corner coordinate of an extent.
 * @param {Extent|number[]} extent Extent.
 * @param {string} corner Corner.
 * @return {Coordinate} Corner coordinate.
 * @see https://github.com/openlayers/openlayers/blob/master/src/ol/extent.js#L482
 */

function getExtentCorner(extent, corner) {
  var coordinate;

  if (corner === EXTENT_CORNER.BOTTOM_LEFT) {
    coordinate = getBottomLeft(extent);
  } else if (corner === EXTENT_CORNER.BOTTOM_RIGHT) {
    coordinate = getBottomRight(extent);
  } else if (corner === EXTENT_CORNER.TOP_LEFT) {
    coordinate = getTopLeft(extent);
  } else if (corner === EXTENT_CORNER.TOP_RIGHT) {
    coordinate = getTopRight(extent);
  } else {
    throw new Error('Invalid corner');
  }

  return coordinate;
}
/**
 * Generate a tile grid extent from a projection.  If the projection has an
 * extent, it is used.  If not, a global extent is assumed.
 * @param {Projection} projection Projection.
 * @return {Extent} Extent.
 * @see https://github.com/openlayers/openlayers/blob/master/src/ol/tilegrid.js#L148
 */

function createExtentFromProjection(projection) {
  projection = get(projection);
  var extent = projection.getExtent();

  if (!extent) {
    var half = 180 * METERS_PER_UNIT[PROJ_UNIT.DEGREES] / projection.getMetersPerUnit();
    extent = createOrUpdateExtent(-half, -half, half, half);
  }

  return extent;
}

export { createOrUpdateExtent, getExtentCorner, createExtentFromProjection };
