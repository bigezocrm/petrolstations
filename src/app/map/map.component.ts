import { Component } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  title: string = 'All Petrol Stations in Uganda';

  // Coordinates for Uganda (Center of the map)
  center: google.maps.LatLngLiteral = { lat: 1.3733, lng: 32.2903 };
  zoom = 6;

  // The mapId used to reference the styles
  mapId: string = '9921d5aa4e4ee104'; // Replace with your actual map ID

  // Optional: Custom marker or other configurations
  
  markers: google.maps.MarkerOptions[] = [
    {
      position: { lat: 1.3733, lng: 32.2903 },
      title: "Uganda",
      icon: {
        url: "/assets/shell.png",
        scaledSize: new google.maps.Size(32, 32) // Adjust size if necessary
      }
    }
  ];
  
}
