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
          const geometryType = feature.geometry.type;

          if (geometryType === 'Point') {
            console.log('Processing Point feature:', feature);
            const coordinates = feature.geometry.coordinates;
            const latLng = new google.maps.LatLng(coordinates[1], coordinates[0]);
            const name = feature.properties.name || 'No name';
            const iconUrl = feature.properties.icon || '/shell.png';

            const icon = {
              url: iconUrl,
              scaledSize: new google.maps.Size(16, 16),
            };

            const marker = new google.maps.Marker({
              position: latLng,
              map: this.map,
              title: name,
              icon: icon,
            });

            const infoWindow = new google.maps.InfoWindow({
              content: `<h3 class="text-danger">${name}</h3><p>${feature.properties.description || 'No description'}</p>`,
            });

            marker.addListener('click', () => {
              infoWindow.open(this.map, marker);
            });

          } else if (geometryType === 'Polygon') {
            console.log('Processing Polygon feature:', feature);
            const paths = feature.geometry.coordinates[0].map((coords: number[]) => ({
              lat: coords[1],
              lng: coords[0],
            }));

            // Define the polygon
            const polygon = new google.maps.Polygon({
              paths: paths,
              strokeColor: feature.properties.stroke || '#000000',
              strokeOpacity: feature.properties['stroke-opacity'] || 1.0,
              strokeWeight: feature.properties['stroke-width'] || 2,
              fillColor: feature.properties.fill || '#FF0000',
              fillOpacity: feature.properties['fill-opacity'] || 0.35,
            });

            polygon.setMap(this.map);

            // Add the white overlay outside the polygon
            this.addWhiteOverlayOutsidePolygon(polygon);
          } else {
            console.log('Unhandled geometry type:', geometryType);
          }
        });
      })
      .catch((error) => {
        console.error('Error fetching GeoJSON:', error);
      });
  }

  private addWhiteOverlayOutsidePolygon(polygon: any) {
    // Create an overlay to cover the map with a white layer
    const overlay = new google.maps.OverlayView();

    overlay.onAdd = () => {
      const layer = this.createWhiteOverlayLayer(polygon, overlay);
      const panes = overlay.getPanes();
      panes.overlayLayer.appendChild(layer);
    };

    overlay.draw = function () {};
    overlay.setMap(this.map);
  }

  private createWhiteOverlayLayer(polygon: any, overlay: any): HTMLElement {
    const bounds = polygon.getBounds();
    const topLeft = bounds.getNorthEast();
    const bottomRight = bounds.getSouthWest();

    const projection = overlay.getProjection();
    const topLeftPixel = projection.fromLatLngToDivPixel(topLeft);
    const bottomRightPixel = projection.fromLatLngToDivPixel(bottomRight);

    // Create a div element for the overlay
    const layer = document.createElement('div');
    layer.style.position = 'absolute';
    layer.style.top = `${topLeftPixel.y}px`;
    layer.style.left = `${topLeftPixel.x}px`;
    layer.style.width = `${bottomRightPixel.x - topLeftPixel.x}px`;
    layer.style.height = `${bottomRightPixel.y - topLeftPixel.y}px`;
    layer.style.backgroundColor = 'white';
    layer.style.zIndex = '0';
    layer.style.pointerEvents = 'none'; // Ensures it doesn't block interactions

    return layer;
  }
}
