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
  northPolygonData: any = null;
entireMapPolygonData: any = null;


  northPolygon =   {
    "type": "Feature",
    "properties": {
      "name": "NORTH",
      "description": "North region",
      "styleUrl": "#poly-E65100-3401-217",
      "fill-opacity": 0.6,
      "fill": "#e65100",
      "stroke-opacity": 1,
      "stroke": "#e65100",
      "stroke-width": 3
    },
    "geometry": {
      "coordinates": [
        [
          [31.2815037, 2.182163, 0],
          [31.4023533, 2.4126903, 0],
          [31.6110935, 2.5553783, 0],
          [31.8088474, 2.577329, 0],
          [32.2922458, 2.2150977, 0],
          [32.5778904, 2.2919426, 0],
          [32.8305759, 2.2699873, 0],
          [32.9953708, 1.9955196, 0],
          [33.5007419, 1.8088551, 0],
          [34.137949, 2.0174788, 0],
          [34.4895115, 2.4126903, 0],
          [34.874033, 2.6102542, 0],
          [34.6652927, 2.8845964, 0],
          [34.4126072, 3.3892086, 0],
          [34.4895115, 3.6304543, 0],
          [34.3137302, 3.6962376, 0],
          [33.9621677, 4.1894507, 0],
          [33.5337009, 3.7729786, 0],
          [33.2810154, 3.762016, 0],
          [33.0832615, 3.9374005, 0],
          [32.8964939, 3.8058655, 0],
          [32.4790134, 3.762016, 0],
          [32.2153415, 3.5427358, 0],
          [31.995615, 3.5427358, 0],
          [31.8418064, 3.8168275, 0],
          [31.5341892, 3.6523826, 0],
          [31.2815037, 3.783941, 0],
          [30.8859958, 3.6304543, 0],
          [30.9299412, 3.4221094, 0],
          [30.7651462, 3.0601411, 0],
          [30.8859958, 2.8626514, 0],
          [30.7431736, 2.4785482, 0],
          [31.2815037, 2.182163, 0]
        ]
      ],
      "type": "Polygon"
    }
  };

  entiremapPolygon= {
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
    //this.loadStationsGeoJSON('/uganda.geojson', 'north', 'shell');

    this.mapInitialized = true;
  }

  // Function to load stations and the polygon based on location and station type
loadStationsGeoJSON(url: string, location: string, stationType: string) {
  const map = this.map;

  // Dynamically handle different locations
  if (location === 'north') {
    console.log(`Loading North region polygon for location: ${location}`);
    this.loadNorthPolygon();
  } else if (location === 'entiremap') {
    console.log(`Loading entire map polygon for location: ${location}`);
    this.loadEntireMapPolygon(); // Example for handling another location
  } else {
    console.log(`No polygon defined for location: ${location}`);
  }

  // Load GeoJSON data
  map.data.loadGeoJson(url, { location: location, stationType: stationType }, (data: any) => {
    if (!data) {
      console.error('Error loading GeoJSON data');
      return;
    }
    console.log('GeoJSON data loaded successfully for:', location);
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

loadNorthPolygon() {
  const map = this.map;
  const northPolygon = this.northPolygon;

  // Create a new Data instance and store it
  const polygonData = new google.maps.Data();
  polygonData.addGeoJson(northPolygon);
  polygonData.setStyle({
    fillColor: northPolygon.properties.fill,
    fillOpacity: northPolygon.properties['fill-opacity'],
    strokeColor: northPolygon.properties.stroke,
    strokeWeight: northPolygon.properties['stroke-width'],
    strokeOpacity: northPolygon.properties['stroke-opacity']
  });
  polygonData.setMap(map); // Add the polygon to the map

  // Save reference for clearing later
  this.northPolygonData = polygonData;
}

loadEntireMapPolygon() {
  const map = this.map;
  const entiremapPolygon = this.entiremapPolygon;

  // Create a new Data instance and store it
  const polygonData = new google.maps.Data();
  polygonData.addGeoJson(entiremapPolygon);
  polygonData.setStyle({
    fillColor: entiremapPolygon.properties.fill,
    fillOpacity: entiremapPolygon.properties['fill-opacity'],
    strokeColor: entiremapPolygon.properties.stroke,
    strokeWeight: entiremapPolygon.properties['stroke-width'],
    strokeOpacity: entiremapPolygon.properties['stroke-opacity']
  });
  polygonData.setMap(map); // Add the polygon to the map

  // Save reference for clearing later
  this.entireMapPolygonData = polygonData;
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
  
    // Clear all GeoJSON data from map.data
    if (map.data) {
      map.data.forEach((feature: any) => {
        map.data.remove(feature); // Remove all features
      });
    }
  
    // Clear North region polygon
    if (this.northPolygonData) {
      this.northPolygonData.setMap(null); // Remove the polygon
      this.northPolygonData = null; // Clear reference
    }
  
    // Clear entire map polygon
    if (this.entireMapPolygonData) {
      this.entireMapPolygonData.setMap(null); // Remove the polygon
      this.entireMapPolygonData = null; // Clear reference
    }
  
    // Remove any custom markers
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
