import { Component, AfterViewInit, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../superbase.service';

declare var google: any; // Declare Google Maps for TypeScript

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements AfterViewInit, AfterViewChecked {
  showMap = true; // Track map visibility
  title: string = 'Petrol Stations in Uganda';
  map: any; // Declare the map variable
  mapInitialized = false; // Track if the map has been initialized
  markers: any;
  overlay: any;

  northPolygon = {
    "type": "Feature",
    "properties": {
      "stroke": "#555555",
      "stroke-width": 2,
      "stroke-opacity": 1,
      "fill": "#ffffff",
      "fill-opacity": 0.9
    },
    "geometry": {
      "coordinates": [
        [
          [-8.082438444104156, 49.02965503015514],
          [-34.10130792669378, 16.580900015937132],
          [-40.88417914266006, -50.32121032982951],
          [81.74863939828613, -65.64716462009923],
          [103.1874780781283, -36.04828534768893],
          [86.60966418612, 35.829399043344395],
          [-8.082438444104156, 49.02965503015514]
        ]
      ],
      "type": "Polygon"
    },
    "id": 1
  };

  constructor(private router: Router, private supabaseService: SupabaseService) {}

  // Logout function
  logout() {
    this.supabaseService
      .logout()
      .then(() => {
        this.router.navigate(['/login']); // Redirect after logout
      })
      .catch((error) => {
        console.error('Logout failed:', error);
      });
  }

  ngAfterViewInit() {
    // Initialize map only once when the view is ready
  }

  ngAfterViewChecked() {
    if (this.showMap && !this.mapInitialized) {
      this.initMap();
    }
  }

  // Method to initialize the map
  initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('ERROR ------------- Map element not found');
      return;
    }

    // Reuse the map instance if already initialized
    if (!this.map) {
      this.map = new google.maps.Map(mapElement, {
        center: { lat: 0.3740605, lng: 32.7256175 },
        zoom: 7,
        mapTypeId: 'roadmap',
        minZoom: 5,
      });
    } else {
      this.map.setCenter({ lat: 0.3740605, lng: 32.7256175 }); // Reset center
      this.map.setZoom(7); // Reset zoom
    }

    // Initialize map with Shell stations
    this.loadStationsGeoJSON('/uganda.geojson', 'north', 'shell');

    this.mapInitialized = true;
  }

  // Function to load stations and the polygon based on location and station type
  loadStationsGeoJSON(url: string, location: string, stationType: string) {
    const map = this.map;

    // If the location is 'north', load the polygon
    if (location === 'north') {
      this.loadNorthPolygon();
    }

    // Load GeoJSON data
    map.data.loadGeoJson(url, { location: location, stationType: stationType }, (data: any) => {
      if (!data) {
        console.error('Error loading GeoJSON data');
        return;
      }
      console.log('GeoJSON data loaded successfully');
    });

    // Set the style for markers
    map.data.setStyle({
      icon: {
        url: 'shell.png',
        scaledSize: new google.maps.Size(16, 16),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 16),
      },
    });

    // Add click listener to display popup with details
    map.data.addListener('click', (event: any) => {
      const feature = event.feature;
      if (!feature) {
        console.error('No feature found on click event');
        return;
      }

      const properties = feature.getProperties();
      if (!properties) {
        console.error('No properties found for this feature');
        return;
      }

      const contentString = `
        <div>
          <h3>${properties.Code || 'N/A'}</h3>
          <p><strong>Location:</strong> ${properties.location || 'N/A'}</p>
          <p><strong>Volume:</strong> ${properties.Vol || 'N/A'}</p>
          <p><strong>Description:</strong> ${properties.description?.value || 'N/A'}</p>
        </div>
      `;

      const infoWindow = new google.maps.InfoWindow({
        content: contentString,
        position: event.latLng,
      });

      infoWindow.open(map);
      console.log('InfoWindow opened with details for:', properties.Code);
    });
  }

  // Function to load the North region polygon
  loadNorthPolygon() {
    const map = this.map;
    const northPolygon = this.northPolygon;

    const polygon = new google.maps.Data();
    polygon.addGeoJson(northPolygon);
    polygon.setStyle({
      fillColor: northPolygon.properties.fill,
      fillOpacity: northPolygon.properties['fill-opacity'],
      strokeColor: northPolygon.properties.stroke,
      strokeWeight: northPolygon.properties['stroke-width'],
      strokeOpacity: northPolygon.properties['stroke-opacity']
    });
    polygon.setMap(map); // Add the polygon to the map
  }

  // Method to handle station selection (region and station type)
  loadStation(region: string, station: string) {
    alert(`Loading ---------->  ${station} stations in ${region} region...`);

    if (!this.mapInitialized) {
      this.initMap(); // Initialize the North Shell map
    }

    // Update map based on region and station type
    this.loadStationsGeoJSON('/uganda.geojson', region, station);
    this.showMap = true;
  }

  clearMap() {
    const map = this.map;

    // Clear all GeoJSON data by checking if map.data exists
    if (map.data) {
      map.data.forEach((feature: any) => {
        map.data.remove(feature); // Remove all features
      });
    }

    // Remove any custom markers if they exist
    if (this.markers) {
      for (let i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null); // Remove each marker from the map
      }
      this.markers = []; // Reset markers array after clearing
    }

    // Clear any additional overlays (InfoWindows, custom overlays)
    if (this.overlay) {
      this.overlay.setMap(null); // Remove the overlay from the map
      this.overlay = null; // Reset the overlay
    }

    console.log('Map cleared.');
  }
}
