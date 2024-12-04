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
      zoom: 7,
      mapTypeId: 'roadmap',
    });

    // Load the GeoJSON data
    this.loadGeoJSON();
  }

  loadGeoJSON() {
    const geoJSONPath = 'north.geojson';

    fetch(geoJSONPath)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log('GeoJSON Data:', data); // Log GeoJSON data

        // Iterate through each feature in the GeoJSON data
        data.features.forEach((feature: any) => {
          // Get coordinates from the GeoJSON feature
          const coordinates = feature.geometry.coordinates;
          const latLng = new google.maps.LatLng(coordinates[1], coordinates[0]);

          // Get properties like name and icon from the feature
          const name = feature.properties.name || 'No name';
          const icon = feature.properties.icon || '/shell.png'; // Use icon from GeoJSON

          // Create the marker for each location with the correct icon
          const marker = new google.maps.Marker({
            position: latLng,
            map: this.map,
            title: name,
            icon: icon, // Use the icon defined in the GeoJSON file
          });

          // Add info window for each marker
          const infoWindow = new google.maps.InfoWindow({
            content: `<h3 class="text-danger">${name}</h3><p>${feature.properties.description || 'No description'}</p>`,
          });

          marker.addListener('click', () => {
            infoWindow.open(this.map, marker);
          });
        });
      })
      .catch((error) => {
        console.error('Error fetching GeoJSON:', error);
      });
  }
}
