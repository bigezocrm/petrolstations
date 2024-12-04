import { Component, AfterViewInit } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  title: string = 'All Petrol Stations in Uganda';
  map: any;

  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    // Initialize the map
    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: { lat: 0.3740605, lng: 32.7256175 }, // Center point in Uganda
      zoom: 6,
      mapTypeId: 'roadmap',
    });

    // Load the GeoJSON data
    this.loadGeoJSON();
  }

  loadGeoJSON() {
    const geoJSONPath = '/uganda.json'; // Path to the GeoJSON file in the public folder
    this.map.data.loadGeoJson(geoJSONPath);

    // Apply custom styles to the GeoJSON data
    this.map.data.setStyle({
      icon: (feature: any) => ({
        url: feature.getProperty('icon'), // Use icon from GeoJSON properties
        scaledSize: new google.maps.Size(32, 32), // Adjust size as needed
      }),
      fillColor: 'green',
      strokeWeight: 2,
      strokeColor: 'blue',
    });

    // Add info windows (optional)
    this.map.data.addListener('click', (event: any) => {
      const name = event.feature.getProperty('name');
      const description = event.feature.getProperty('description');
      const infoWindow = new google.maps.InfoWindow({
        content: `<h3>${name}</h3><p>${description}</p>`,
        position: event.latLng,
      });
      infoWindow.open(this.map);
    });
  }
}
