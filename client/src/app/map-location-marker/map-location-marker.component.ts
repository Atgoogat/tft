import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { circle, latLng, Layer } from 'leaflet';
import { map, Observable, tap } from 'rxjs';
import { GeoPoint } from '../model/geo-point';
import { LocationService } from '../services/location.service';
import { tapOnce } from '../util/tap-once';

@Component({
  selector: 'app-map-location-marker',
  templateUrl: './map-location-marker.component.html',
  styleUrls: ['./map-location-marker.component.sass'],
})
export class MapLocationMarkerComponent implements OnInit {
  position$!: Observable<Layer>;

  constructor(private readonly locationService: LocationService) {}

  ngOnInit(): void {
    this.position$ = this.locationService
      .getCurrentLocation$()
      .pipe(
        map((p) =>
          circle(latLng(p.coordinates[1], p.coordinates[0]), { radius: 10 })
        )
      );
  }
}
