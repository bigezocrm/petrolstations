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
  northPolygonData: any  = null;
entireMapPolygonData: any  = null;
ugandaPolygonData:any=null;


  northPolygon =   {
    "type": "Feature",
    "properties": {
      "name": "NORTH",
      "description": "North region",
      "styleUrl": "#poly-E65100-3401-217",
      "fill-opacity": 0.6,
      "fill": "#e65100",
      "stroke-opacity": 1,
      "stroke": "#ffffff",
      "stroke-width": 2
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
      "stroke-width": 0,
      "stroke-opacity": 0,
      "fill": "#000000",
      "fill-opacity": 0.6
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

  ugandaMapPolygon= {
    "type": "Feature",
    "properties": {
      "stroke": "#ffffff",
      "stroke-width": 2,
      "stroke-opacity": 1,
      "fill": "#33cc33",
      "fill-opacity": 0.7
    },
    "geometry": {
      "coordinates": [
        [
          [30.733968396403156, -0.9987046322610098],
          [33.94409756835438, -0.99377174522931],
          [33.92698192289549, -0.46418390366360995],
          [33.986814388751554, -0.13959652669909417],
          [33.91846511365466, 0.09958864184245897],
          [34.072205450596215, 0.3302276319047053],
          [34.12346046634369, 0.5437755209200077],
          [34.251530519762724, 0.6548101779279278],
          [34.4812742446681, 0.9023235887892724],
          [34.550704476828884, 1.0775992130084546],
          [34.703871446886154, 1.1824067449789197],
          [34.85953559197449, 1.465790648034897],
          [35.033319796852254, 1.8547847044679031],
          [34.937614333183745, 2.5414895632306553],
          [34.670278471763254, 2.972769951112383],
          [34.507115520952, 3.210914755544877],
          [34.452194734046174, 3.481731409095758],
          [34.41299067794091, 3.753719588770153],
          [34.17131625962938, 3.8703551317858995],
          [34.07537019123552, 4.29497995240088],
          [33.501117148872254, 3.7525109424339718],
          [33.20156849386791, 3.779479557972053],
          [32.99283116013382, 3.878929577751677],
          [32.80250069610895, 3.788697977844805],
          [32.41246504761659, 3.7436193764661],
          [32.24916471766224, 3.644066225527027],
          [32.203808620667246, 3.5263683797518866],
          [31.98605357495586, 3.5988528923882512],
          [31.81362557757069, 3.825101271655285],
          [31.532357941630664, 3.6440638645056964],
          [31.2329327443164, 3.7979039959189578],
          [31.03332827612016, 3.734457039149163],
          [30.842816559427916, 3.5351378992598512],
          [30.94261520921188, 3.5170156843908984],
          [30.797453230535552, 3.0732165169747674],
          [30.88818074975231, 2.846694839829425],
          [30.724928370860653, 2.4478138521402997],
          [30.9063665045677, 2.366214845502114],
          [31.060559329279897, 2.302885329929083],
          [31.30552320909777, 2.1398573400621785],
          [31.05145575678722, 1.7589810089014293],
          [30.48891697496083, 1.2328795461190225],
          [30.28932249325061, 1.187524014226625],
          [30.162358786971737, 0.9244649635365647],
          [29.99909482001425, 0.8428350091894288],
          [29.96287439413689, 0.561650967046802],
          [29.726881528923315, -0.06440583906929476],
          [29.59133085567555, -1.3698722868038686],
          [29.854241724680662, -1.3700774153996917],
          [29.91773648476763, -1.46981548444451],
          [30.14436290109748, -1.3250439688654296],
          [30.325736082883623, -1.1438028994494118],
          [30.343876442778765, -1.0531091450474293],
          [30.61602379565045, -1.0712978353660247],
          [30.733968396403156, -0.9987046322610098]
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
    this.clearMap();
    console.log(`Loading North region polygon for location: ${location}`);
    this.loadEntireMapPolygon(); 
    this.loadNorthPolygon();
  } else if (location === 'all') {
    this.clearMap();
    console.log(`Loading entire map polygon for location: ${location}`);
    this.loadEntireMapPolygon(); // Example for handling another location
    this.loadUgandaMapPolygon();
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

loadUgandaMapPolygon() {
  const map = this.map;
  const ugandaMapPolygon = this.ugandaMapPolygon;

  // Create a new Data instance and store it
  const polygonData = new google.maps.Data();
  polygonData.addGeoJson(ugandaMapPolygon);
  polygonData.setStyle({
    fillColor: ugandaMapPolygon.properties.fill,
    fillOpacity: ugandaMapPolygon.properties['fill-opacity'],
    strokeColor: ugandaMapPolygon.properties.stroke,
    strokeWeight: ugandaMapPolygon.properties['stroke-width'],
    strokeOpacity: ugandaMapPolygon.properties['stroke-opacity']
  });
  polygonData.setMap(map); // Add the polygon to the map

  // Save reference for clearing later
  this.ugandaPolygonData = polygonData;
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

    if (this.ugandaPolygonData) {
      this.ugandaPolygonData.setMap(null); // Remove the polygon
      this.ugandaPolygonData = null; // Clear reference
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
