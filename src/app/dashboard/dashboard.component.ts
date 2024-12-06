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

  
  showAllShell() {
    alert('Displaying all Shell stations...');
  }
  
  showAllMogas() {
    alert('Displaying all Mogas stations...');
  }
  
  showAllStabex() {
    alert('Displaying all Stabex stations...');
  }
  
  showAllIndependent() {
    alert('Displaying all Independent stations...');
  }
  
  showMap = false; // Track map visibility
  title: string = 'All Petrol Stations in Uganda';
  map: any; // Declare the map variable
  mapInitialized = false; // Track if the map has been initialized

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

  // Function to show all stations
  showAllStations() {
    this.showMap = true; // Toggle visibility
    if (this.showMap && !this.mapInitialized) {
      this.initMap(); // Initialize the map after DOM is ready
    }
  }

  ngAfterViewInit() {
    // Initialize map when the view has been initialized, but rely on ngAfterViewChecked to ensure it initializes once.
  }

  ngAfterViewChecked() {
    if (this.showMap && !this.mapInitialized) {
      this.initMap(); // Initialize the map after DOM updates
      this.mapInitialized = true; // Ensure map is only initialized once
    }
  }

  // Method to initialize the map
  initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('Map element not found');
      return;
    }

    this.map = new google.maps.Map(mapElement, {
      center: { lat: 0.3740605, lng: 32.7256175 },
      zoom: 7,
      mapTypeId: 'roadmap',
      minZoom: 3,
    });

    this.loadShellStationsGeoJSON('/map.geojson');
  }

  // Function to load Shell stations
  loadShellStations() {
    alert('Loading Shell Stations...');
    this.loadShellStationsGeoJSON('/map.geojson');
  }

  loadShellStationsGeoJSON(url: string) {
    const map = this.map;
  
    // Clear existing layers (if any)
    map.data.forEach((feature: any) => map.data.remove(feature));
  
    // Load GeoJSON
    map.data.loadGeoJson(url, null, (data: any) => {
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
  
      // Ensure the properties are correctly accessed
      const properties = feature.getProperty ? feature.getProperty('properties') : feature.getProperties();
      if (!properties) {
        console.error('No properties found for this feature');
        return;
      }
  
      // Create the content for the InfoWindow
      const contentString = `
        <div>
          <h3>${properties.Code || 'N/A'}</h3>
          <p><strong>Location:</strong> ${properties.location || 'N/A'}</p>
          <p><strong>Volume:</strong> ${properties.Vol || 'N/A'}</p>
          <p><strong>Description:</strong> ${properties.description?.value || 'N/A'}</p>
        </div>
      `;
  
      // Create a new InfoWindow
      const infoWindow = new google.maps.InfoWindow({
        content: contentString,
        position: event.latLng, // Position of the marker
      });
  
      // Open the InfoWindow
      infoWindow.open(map);
      console.log('InfoWindow opened with details for:', properties.Code);
    });
  }
  

  // Dummy function for loading North stations
  loadNorthStations() {
    alert('Loading North Stations...');
    // For now, we can just show an alert
  }

  // Dummy function for loading East stations
  loadEastStations() {
    alert('Loading East Stations...');
    // For now, we can just show an alert
  }

  // Dummy function for loading West stations
  loadWestStations() {
    alert('Loading West Stations...');
    // For now, we can just show an alert
  }

  // Dummy function for loading Central stations
  loadCentralStations() {
    alert('Loading Central Stations...');
    // For now, you can add your logic to load the Central stations here
  }

  // Dummy function for loading Sub Region A in Central
  loadSubRegionA() {
    alert('Loading Sub Region A...');
  }

  // Dummy function for loading Sub Region B in Central
  loadSubRegionB() {
    alert('Loading Sub Region B...');
  }

  // Dummy function for loading Sub Region C in Central
  loadSubRegionC() {
    alert('Loading Sub Region C...');
  }

  // Dummy function for loading Sub Region D in Central
  loadSubRegionD() {
    alert('Loading Sub Region D...');
  }

  // Dummy function for loading Sub Region E in Central
  loadSubRegionE() {
    alert('Loading Sub Region E...');
  }

  // Function to load Total stations (dummy)
  loadTotalStations() {
    alert('Loading Total Stations...');
    // For now, you can add your logic to load the Total stations here
  }

  // Function to load Mogas stations (dummy)
  loadMogasStations() {
    alert('Loading Mogas Stations...');
    // For now, you can add your logic to load the Mogas stations here
  }

  // Function to load Stabex stations (dummy)
  loadStabexStations() {
    alert('Loading Stabex Stations...');
    // For now, you can add your logic to load the Stabex stations here
  }

  // Function to load Independent stations (dummy)
  loadIndependentStations() {
    alert('Loading Independent Stations...');
    // For now, you can add your logic to load the Independent stations here
  }

  // Shell stations in North (dummy function)
  loadNorthShell() {
    alert('Loading North Shell stations...');
    // Add logic here
  }

  loadNorthMogas() {
    alert('Loading North Mogas stations...');
    // Add logic here
  }

  loadNorthStabex() {
    alert('Loading North Stabex stations...');
    // Add logic here
  }

  loadNorthIndependent() {
    alert('Loading North Independent stations...');
    // Add logic here
  }

  // Shell stations in East (dummy function)
  loadEastShell() {
    alert('Loading East Shell stations...');
    // Add logic here
  }

  loadEastMogas() {
    alert('Loading East Mogas stations...');
    // Add logic here
  }

  loadEastStabex() {
    alert('Loading East Stabex stations...');
    // Add logic here
  }

  loadEastIndependent() {
    alert('Loading East Independent stations...');
    // Add logic here
  }

  // Shell stations in West (dummy function)
  loadWestShell() {
    alert('Loading West Shell stations...');
    // Add logic here
  }

  loadWestMogas() {
    alert('Loading West Mogas stations...');
    // Add logic here
  }

  loadWestStabex() {
    alert('Loading West Stabex stations...');
    // Add logic here
  }

  loadWestIndependent() {
    alert('Loading West Independent stations...');
    // Add logic here
  }

  // Shell stations in Central (dummy function)
  loadCentralShell() {
    alert('Loading Central Shell stations...');
    // Add logic here
  }

  loadCentralMogas() {
    alert('Loading Central Mogas stations...');
    // Add logic here
  }

  loadCentralStabex() {
    alert('Loading Central Stabex stations...');
    // Add logic here
  }

  loadCentralIndependent() {
    alert('Loading Central Independent stations...');
    // Add logic here
  }
}
