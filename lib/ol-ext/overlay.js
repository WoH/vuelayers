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
import Overlay from 'ol/Overlay';
import uuid from 'uuid/v4';
import Vue from 'vue';

function getOverlayId(overlay) {
  if (overlay instanceof Vue) {
    return overlay.id;
  } else if (overlay instanceof Overlay) {
    return overlay.get('id');
  }

  throw new Error('Illegal overlay argument');
}
function setOverlayId(overlay, overlayId) {
  if (overlay instanceof Vue && overlay) {
    overlay.id = overlayId;
    return overlay;
  } else if (overlay instanceof Overlay) {
    overlay.set('id', overlayId);
    return overlay;
  }

  throw new Error('Illegal overlay argument');
}
function initializeOverlay(overlay, defaultOverlay) {
  if (getOverlayId(overlay) == null) {
    setOverlayId(overlay, defaultOverlay || uuid());
  }

  return overlay;
}

export { getOverlayId, setOverlayId, initializeOverlay };
