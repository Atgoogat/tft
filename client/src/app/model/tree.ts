import { GeoPoint } from './geo-point';

export type Tree = Readonly<{
  treefamily: string;
  location: GeoPoint;
}>;
