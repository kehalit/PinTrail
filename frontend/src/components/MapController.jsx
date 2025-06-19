import { useMap } from "react-leaflet";
import { useEffect } from "react";

const MapController = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);

  return null;
};

export default MapController;
