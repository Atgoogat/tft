import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { circle, latLng, Layer } from 'leaflet';
import { geoPointToLatLng } from '../model/geo-point';
import { Tree } from '../model/tree';

@Component({
  selector: 'app-map-tree-marker',
  templateUrl: './map-tree-marker.component.html',
  styleUrls: ['./map-tree-marker.component.sass'],
})
export class MapTreeMarkerComponent implements OnInit {
  @Input() trees!: Tree[];

  layers!: Layer[];

  constructor() {}

  ngOnInit(): void {
    this.layers = this.trees.map((t) => {
      return circle(latLng(geoPointToLatLng(t.location)), {
        radius: 1,
        color: 'green',
      }).bindPopup(t.treefamily);
    });
  }
}
