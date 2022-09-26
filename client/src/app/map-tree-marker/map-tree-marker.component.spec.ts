import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTreeMarkerComponent } from './map-tree-marker.component';

describe('MapTreeMarkerComponent', () => {
  let component: MapTreeMarkerComponent;
  let fixture: ComponentFixture<MapTreeMarkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapTreeMarkerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapTreeMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
