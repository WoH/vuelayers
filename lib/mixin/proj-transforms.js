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
import { EPSG_3857, getMapDataProjection, readGeoJsonFeature, readGeoJsonGeometry, transformExtent, transformLine, transformMultiLine, transformMultiPoint, transformMultiPolygon, transformPoint, transformPolygon, writeGeoJsonFeature, writeGeoJsonGeometry } from '../ol-ext';
import { coalesce } from '../util/minilo';

/**
 * Mixin with helpers for projection transforms between current view projection and global defined projection.
 */

var projTransforms = {
  computed: {
    /**
     * @return {module:ol/proj~ProjectionLike}
     */
    viewProjection: function viewProjection() {
      if (this.rev && this.$view) {
        return this.$view.getProjection().getCode();
      }

      return this.projection || EPSG_3857;
    },

    /**
     * @return {module:ol/proj~ProjectionLike}
     */
    resolvedDataProjection: function resolvedDataProjection() {
      return coalesce(this.dataProjection, // may or may not be present
      this.projection, // may or may not be present
      this.$map && getMapDataProjection(this.$map), this.$options.dataProjection, this.viewProjection);
    }
  },
  methods: {
    pointToViewProj: function pointToViewProj(point) {
      return transformPoint(point, this.resolvedDataProjection, this.viewProjection);
    },
    pointToDataProj: function pointToDataProj(point) {
      return transformPoint(point, this.viewProjection, this.resolvedDataProjection);
    },
    lineToViewProj: function lineToViewProj(line) {
      return transformLine(line, this.resolvedDataProjection, this.viewProjection);
    },
    lineToDataProj: function lineToDataProj(line) {
      return transformLine(line, this.viewProjection, this.resolvedDataProjection);
    },
    polygonToViewProj: function polygonToViewProj(polygon) {
      return transformPolygon(polygon, this.resolvedDataProjection, this.viewProjection);
    },
    polygonToDataProj: function polygonToDataProj(polygon) {
      return transformPolygon(polygon, this.viewProjection, this.resolvedDataProjection);
    },
    multiPointToViewProj: function multiPointToViewProj(multiPoint) {
      return transformMultiPoint(multiPoint, this.resolvedDataProjection, this.viewProjection);
    },
    multiPointToDataProj: function multiPointToDataProj(multiPoint) {
      return transformMultiPoint(multiPoint, this.viewProjection, this.resolvedDataProjection);
    },
    multiLineToViewProj: function multiLineToViewProj(multiLine) {
      return transformMultiLine(multiLine, this.resolvedDataProjection, this.viewProjection);
    },
    multiLineToDataProj: function multiLineToDataProj(multiLine) {
      return transformMultiLine(multiLine, this.viewProjection, this.resolvedDataProjection);
    },
    multiPolygonToViewProj: function multiPolygonToViewProj(multiPolygon) {
      return transformMultiPolygon(multiPolygon, this.resolvedDataProjection, this.viewProjection);
    },
    multiPolygonToDataProj: function multiPolygonToDataProj(multiPolygon) {
      return transformMultiPolygon(multiPolygon, this.viewProjection, this.resolvedDataProjection);
    },
    extentToViewProj: function extentToViewProj(extent) {
      return transformExtent(extent, this.resolvedDataProjection, this.viewProjection);
    },
    extentToDataProj: function extentToDataProj(extent) {
      return transformExtent(extent, this.viewProjection, this.resolvedDataProjection);
    },
    writeGeometryInDataProj: function writeGeometryInDataProj(geometry) {
      return writeGeoJsonGeometry(geometry, this.viewProjection, this.resolvedDataProjection);
    },
    writeGeometryInViewProj: function writeGeometryInViewProj(geometry) {
      return writeGeoJsonGeometry(geometry);
    },
    readGeometryInDataProj: function readGeometryInDataProj(geometry) {
      return readGeoJsonGeometry(geometry, this.viewProjection, this.resolvedDataProjection);
    },
    writeFeatureInDataProj: function writeFeatureInDataProj(feature) {
      return writeGeoJsonFeature(feature, this.viewProjection, this.resolvedDataProjection);
    },
    writeFeatureInViewProj: function writeFeatureInViewProj(feature) {
      return writeGeoJsonFeature(feature);
    },
    readFeatureInDataProj: function readFeatureInDataProj(feature) {
      return readGeoJsonFeature(feature, this.viewProjection, this.resolvedDataProjection);
    }
  }
};

export default projTransforms;
