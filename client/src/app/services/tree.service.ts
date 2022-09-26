import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GeoPoint } from '../model/geo-point';
import { Tree } from '../model/tree';

@Injectable({
  providedIn: 'root',
})
export class TreeService {
  readonly api = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getTreesByRadius$(point: GeoPoint, radius: number): Observable<Tree[]> {
    return this.http.get<Tree[]>(this.api + '/tree', {
      params: {
        lat: point.coordinates[0],
        lng: point.coordinates[1],
        radius,
      },
    });
  }
}
