declare var google: any;

import { Component, AfterViewInit } from '@angular/core';

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
    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: { lat: 0.3740605, lng: 32.7256175 },
      zoom: 7,
      mapTypeId: 'roadmap',
    });

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
        console.log('GeoJSON Data:', data);

        data.features.forEach((feature: any) => {
          if (feature.geometry.type === 'Point') {
            const coordinates = feature.geometry.coordinates;
            const latLng = new google.maps.LatLng(coordinates[1], coordinates[0]);
            const name = feature.properties.name || 'No name';
            const iconUrl = feature.properties.icon || '/shell.png';

            // Scale the icon using scaledSize
            const icon = {
              url: iconUrl, // URL to the icon image
              scaledSize: new google.maps.Size(16, 16), // Adjust size here
            };

            const marker = new google.maps.Marker({
              position: latLng,
              map: this.map,
              title: name,
              icon: icon, // Use scaled icon
            });

            const infoWindow = new google.maps.InfoWindow({
              content: `<h3 class="text-danger">${name}</h3><p>${feature.properties.description || 'No description'}</p>`,
            });

            marker.addListener('click', () => {
              infoWindow.open(this.map, marker);
            });
          }
        });
      })
      .catch((error) => {
        console.error('Error fetching GeoJSON:', error);
      });
  }
}
