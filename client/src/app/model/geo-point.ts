import { latLng } from 'leaflet';

export type GeoPoint = Readonly<{
  type: 'point';
  coordinates: number[];
}>;

export const geoPointToLatLng = (point: GeoPoint) =>
  latLng(point.coordinates[1], point.coordinates[0]);
