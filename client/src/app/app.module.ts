import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { MapLocationMarkerComponent } from './map-location-marker/map-location-marker.component';
import { MapTreeMarkerComponent } from './map-tree-marker/map-tree-marker.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MapLocationMarkerComponent,
    MapTreeMarkerComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, LeafletModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
