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
import * as ArcgisRestSource from './arcgis-rest-source';
export { ArcgisRestSource };
import * as BingmapsSource from './bingmaps-source';
export { BingmapsSource };
import * as CircleGeom from './circle-geom';
export { CircleGeom };
import * as CircleStyle from './circle-style';
export { CircleStyle };
import * as ClusterSource from './cluster-source';
export { ClusterSource };
import * as DrawInteraction from './draw-interaction';
export { DrawInteraction };
import * as Feature from './feature';
export { Feature };
import * as FillStyle from './fill-style';
export { FillStyle };
import * as Geoloc from './geoloc';
export { Geoloc };
import * as Graticule from './graticule';
export { Graticule };
import * as GroupLayer from './group-layer';
export { GroupLayer };
import * as HeatmapLayer from './heatmap-layer';
export { HeatmapLayer };
import * as IconStyle from './icon-style';
export { IconStyle };
import * as ImageLayer from './image-layer';
export { ImageLayer };
import * as ImageStaticSource from './image-static-source';
export { ImageStaticSource };
import * as ImageWmsSource from './image-wms-source';
export { ImageWmsSource };
import * as LineStringGeom from './line-string-geom';
export { LineStringGeom };
import * as Map from './map';
export { Map };
import * as MapboxSource from './mapbox-source';
export { MapboxSource };
import * as ModifyInteraction from './modify-interaction';
export { ModifyInteraction };
import * as MultiLineStringGeom from './multi-line-string-geom';
export { MultiLineStringGeom };
import * as MultiPointGeom from './multi-point-geom';
export { MultiPointGeom };
import * as MultiPolygonGeom from './multi-polygon-geom';
export { MultiPolygonGeom };
import * as OsmSource from './osm-source';
export { OsmSource };
import * as Overlay from './overlay';
export { Overlay };
import * as PointGeom from './point-geom';
export { PointGeom };
import * as PolygonGeom from './polygon-geom';
export { PolygonGeom };
import * as RegShapeStyle from './reg-shape-style';
export { RegShapeStyle };
import * as SelectInteraction from './select-interaction';
export { SelectInteraction };
import * as SnapInteraction from './snap-interaction';
export { SnapInteraction };
import * as SputnikSource from './sputnik-source';
export { SputnikSource };
import * as StamenSource from './stamen-source';
export { StamenSource };
import * as StrokeStyle from './stroke-style';
export { StrokeStyle };
import * as StyleBox from './style-box';
export { StyleBox };
import * as StyleFunc from './style-func';
export { StyleFunc };
import * as TextStyle from './text-style';
export { TextStyle };
import * as TileLayer from './tile-layer';
export { TileLayer };
import * as VectorLayer from './vector-layer';
export { VectorLayer };
import * as VectorSource from './vector-source';
export { VectorSource };
import * as VectorTileLayer from './vector-tile-layer';
export { VectorTileLayer };
import * as VectorTileSource from './vector-tile-source';
export { VectorTileSource };
import * as WmsSource from './wms-source';
export { WmsSource };
import * as WmtsSource from './wmts-source';
export { WmtsSource };
import * as XyzSource from './xyz-source';
export { XyzSource };

/**
 * @const {string} VueLayers version.
 */

var VERSION = '0.11.5-beta.8';
/**
 * Registers all VueLayers components.
 * @param {Vue|VueConstructor} Vue
 * @param {VueLayersOptions} [options]
 */

function plugin(Vue) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (plugin.installed) {
    return;
  }

  plugin.installed = true; // install components

  Vue.use(ArcgisRestSource, options);
  Vue.use(BingmapsSource, options);
  Vue.use(CircleGeom, options);
  Vue.use(CircleStyle, options);
  Vue.use(ClusterSource, options);
  Vue.use(DrawInteraction, options);
  Vue.use(Feature, options);
  Vue.use(FillStyle, options);
  Vue.use(Geoloc, options);
  Vue.use(Graticule, options);
  Vue.use(GroupLayer, options);
  Vue.use(HeatmapLayer, options);
  Vue.use(IconStyle, options);
  Vue.use(ImageLayer, options);
  Vue.use(ImageStaticSource, options);
  Vue.use(ImageWmsSource, options);
  Vue.use(LineStringGeom, options);
  Vue.use(Map, options);
  Vue.use(MapboxSource, options);
  Vue.use(ModifyInteraction, options);
  Vue.use(MultiLineStringGeom, options);
  Vue.use(MultiPointGeom, options);
  Vue.use(MultiPolygonGeom, options);
  Vue.use(OsmSource, options);
  Vue.use(Overlay, options);
  Vue.use(PointGeom, options);
  Vue.use(PolygonGeom, options);
  Vue.use(RegShapeStyle, options);
  Vue.use(SelectInteraction, options);
  Vue.use(SnapInteraction, options);
  Vue.use(SputnikSource, options);
  Vue.use(StamenSource, options);
  Vue.use(StrokeStyle, options);
  Vue.use(StyleBox, options);
  Vue.use(StyleFunc, options);
  Vue.use(TextStyle, options);
  Vue.use(TileLayer, options);
  Vue.use(VectorLayer, options);
  Vue.use(VectorSource, options);
  Vue.use(VectorTileLayer, options);
  Vue.use(VectorTileSource, options);
  Vue.use(WmsSource, options);
  Vue.use(WmtsSource, options);
  Vue.use(XyzSource, options);
}
/**
 * @typedef {Object} VueLayersOptions
 * @property {string} [dataProjection] Projection for all properties, events and other plain values.
 */

export default plugin;
export { VERSION, plugin as install };
