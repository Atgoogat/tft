import { ReadVarExpr } from '@angular/compiler';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  LeafletControlLayersConfig,
  LeafletDirective,
} from '@asymmetrik/ngx-leaflet';
import { LatLng, latLng, MapOptions, tileLayer } from 'leaflet';
import { control } from 'leaflet';
import { EMPTY, Observable, of, take, tap } from 'rxjs';
import { geoPointToLatLng } from '../model/geo-point';
import { Tree } from '../model/tree';
import { LocationService } from '../services/location.service';
import { TreeService } from '../services/tree.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.sass'],
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild(LeafletDirective)
  map!: LeafletDirective;

  options: MapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: 'Datenquelle: Stadt Münster',
      }),
    ],
    zoom: 16,
    center: latLng(51.95746517356643, 7.618807140214108),
  };

  trees$!: Observable<Tree[]>;

  constructor(
    private readonly locationService: LocationService,
    private readonly treeService: TreeService
  ) {}

  ngOnInit(): void {
    this.locationService
      .getCurrentLocation$()
      .pipe(take(1))
      .subscribe((p) => this.map.getMap().panTo(geoPointToLatLng(p)));
  }

  ngAfterViewInit(): void {
    this.map.getMap().addControl(control.scale({ imperial: false }));
  }

  updateTrees() {
    if (this.map.getMap().getZoom() < 16) {
      this.trees$ = EMPTY;
      return;
    }

    const map = this.map.getMap();
    const center = map.getCenter();
    const ne = this.map.getMap().getBounds().getNorthEast();
    const radiusInKm = this.measure(ne.lat, ne.lng, center.lat, center.lng);

    this.trees$ = this.treeService.getTreesByRadius$(
      { type: 'point', coordinates: [center.lat, center.lng] },
      radiusInKm
    );
    this.map.getMap().getBounds();
  }

  // source: https://stackoverflow.com/questions/639695/how-to-convert-latitude-or-longitude-to-meters
  private measure(lat1: number, lon1: number, lat2: number, lon2: number) {
    // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = (lat2 * Math.PI) / 180 - (lat1 * Math.PI) / 180;
    var dLon = (lon2 * Math.PI) / 180 - (lon1 * Math.PI) / 180;
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // km
  }
}
