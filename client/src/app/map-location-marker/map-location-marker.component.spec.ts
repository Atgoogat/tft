import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapLocationMarkerComponent } from './map-location-marker.component';

describe('MapLocationMarkerComponent', () => {
  let component: MapLocationMarkerComponent;
  let fixture: ComponentFixture<MapLocationMarkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapLocationMarkerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapLocationMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
