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
import Feature from 'ol/Feature';
import { get, isPlainObject } from '../util/minilo';
import { createGeoJsonFmt } from './format';

var geoJsonFmt = createGeoJsonFmt();
/**
 * @param {Feature} feature
 * @param {ProjectionLike|undefined} [featureProjection]
 * @param {ProjectionLike|undefined} [dataProjection]
 * @return {Object}
 */

function writeGeoJsonFeature(feature, featureProjection, dataProjection) {
  var geoJsonFeature = geoJsonFmt.writeFeatureObject(feature, {
    featureProjection: featureProjection,
    dataProjection: dataProjection
  });

  if (Array.isArray(get(geoJsonFeature, 'properties.features'))) {
    geoJsonFeature.properties.features = geoJsonFeature.properties.features.map(function (feature) {
      if (feature instanceof Feature) {
        return writeGeoJsonFeature(feature, featureProjection, dataProjection);
      }

      return feature;
    });
  }

  return geoJsonFeature;
}
/**
 * @param {Object} geoJsonFeature
 * @param {ProjectionLike|undefined} [featureProjection]
 * @param {ProjectionLike|undefined} [dataProjection]
 * @return {Feature}
 */

function readGeoJsonFeature(geoJsonFeature, featureProjection, dataProjection) {
  var feature = geoJsonFmt.readFeature(geoJsonFeature, {
    featureProjection: featureProjection,
    dataProjection: dataProjection
  });

  if (Array.isArray(feature.get('features'))) {
    feature.set('features', feature.get('features').map(function (feature) {
      if (isPlainObject(feature)) {
        return readGeoJsonFeature(feature, featureProjection, dataProjection);
      }

      return feature;
    }));
  }

  return feature;
}
/**
 * @param {Geometry} geometry
 * @param {ProjectionLike|undefined} [geometryProjection]
 * @param {ProjectionLike|undefined} [dataProjection]
 * @return {Object}
 */

function writeGeoJsonGeometry(geometry, geometryProjection, dataProjection) {
  return geoJsonFmt.writeGeometryObject(geometry, {
    featureProjection: geometryProjection,
    dataProjection: dataProjection
  });
}
/**
 * @param {Object|Object} geoJsonGeometry
 * @param {ProjectionLike|undefined} [geometryProjection]
 * @param {ProjectionLike|undefined} [dataProjection]
 * @return {Geometry}
 */

function readGeoJsonGeometry(geoJsonGeometry, geometryProjection, dataProjection) {
  dataProjection = readProjection(geoJsonGeometry, dataProjection);
  return geoJsonFmt.readGeometry(geoJsonGeometry, {
    featureProjection: geometryProjection,
    dataProjection: dataProjection
  });
}
function readProjection(geoJsonObj, defaultProjection) {
  return geoJsonFmt.readProjection(geoJsonObj) || defaultProjection;
}

export { writeGeoJsonFeature, readGeoJsonFeature, writeGeoJsonGeometry, readGeoJsonGeometry, readProjection };
