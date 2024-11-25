import { Component } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
    selector: 'app-map',
    imports: [GoogleMapsModule],
    templateUrl: './map.component.html',
    styleUrl: './map.component.css'
})
export class MapComponent {
  // Coordinates of Uganda's center (latitude, longitude)
  center: google.maps.LatLngLiteral = { lat: 1.3733, lng: 32.2903 };
  zoom: number = 7;  // Zoom level for Uganda

  constructor() {}

}
