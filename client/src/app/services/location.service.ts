import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeoPoint } from '../model/geo-point';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor() {}

  getCurrentLocation$(): Observable<GeoPoint> {
    return new Observable((s) => {
      navigator.geolocation.watchPosition(
        (point) => {
          s.next({
            type: 'point',
            coordinates: [point.coords.longitude, point.coords.latitude],
          });
        },
        (err) => {
          s.error(err);
        }
      );
    });
  }
}
