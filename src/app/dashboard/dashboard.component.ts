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
showAllMogas() {
throw new Error('Method not implemented.');
}
showAllStabex() {
throw new Error('Method not implemented.');
}
showAllIndependent() {
throw new Error('Method not implemented.');
}
loadNorthMogas() {
throw new Error('Method not implemented.');
}
loadNorthStabex() {
throw new Error('Method not implemented.');
}
loadNorthIndependent() {
throw new Error('Method not implemented.');
}

  showMap = false; // Track map visibility
  showNorthShellMap = false; // North Shell map visibility flag
  title: string = 'All Petrol Stations in Uganda';
  map: any; // Declare the map variable
  northShellMap: any; // North Shell map variable

  mapInitialized = false; // Track if the map has been initialized
  currentMapType = ''; // Track the current map type (e.g., 'general', 'northShell')

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
   
    if (this.showNorthShellMap && !this.mapInitialized && this.currentMapType !== 'northShell') {
      this.initMap('northShell'); // Initialize the North Shell map
          }
          if (this.showMap && !this.mapInitialized && this.currentMapType !== 'general') {
            this.initMap('general'); // Initialize the general map
          }
  }

  // Method to initialize the map
  initMap(mapType: string) {
    const mapElement = document.getElementById(mapType === 'general' ? 'map' : 'northshellmap');
    if (!mapElement) {
      console.error('Map element not found');
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

    // Load GeoJSON based on map type
    if (mapType === 'general') {
      this.title='All petrol stations in Uganda';
      this.loadAllStationsGeoJSON('/map.geojson');
    } else if (mapType === 'northShell') {
      this.title='Shell petrol stations in Northern Uganda';
      this.loadNorthShellStationsGeoJSON('/north.geojson');
    }

    this.mapInitialized = true;
    this.currentMapType = mapType; // Update current map type
  }

  // Function to show all stations
  showAllStations() {
    this.currentMapType = 'general'; // Set current map type to 'general'
    alert('Displaying all Petrol stations in Uganda...');
    this.toggleShowMaps();
    this.showMap = true; // Toggle visibility

  }

  showAllShell() {
    this.currentMapType = 'northShell'; // Set current map type to 'northShell'
    alert('Displaying All Shell stations...');
    this.toggleShowMaps();
    this.showNorthShellMap = true; // Toggle visibility

  }

  showAllNorthShell() {
    this.currentMapType = 'northShell'; // Set current map type to 'northShell'
    alert('Displaying North Shell stations...');
    this.toggleShowMaps();
    this.showNorthShellMap = true; // Toggle visibility
   
  }

  // Function to clear the map data and reload GeoJSON data
  clearMapData() {
    if (this.map) {
      this.map.data.forEach((feature: any) => this.map.data.remove(feature)); // Clear existing layers
    }
  }

  // Function to load Shell stations for the general map
  loadAllStationsGeoJSON(url: string) {
    this.clearMapData(); // Clear existing map data before loading new data
    const map = this.map;

    // Load GeoJSON data
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

  // Function to load North Shell stations for the North Shell map
  loadNorthShellStationsGeoJSON(url: string) {
    this.clearMapData(); // Clear existing map data before loading new data
    const map = this.map;

    // Load GeoJSON data
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

  // Helper function to toggle map visibility
  toggleShowMaps() {
    this.showMap = false;
    this.showNorthShellMap = false;
    this.mapInitialized = false; // Reset initialization status
    this.clearMapData(); // Clear map data
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

loadStation(direction:string,station:string) {
  alert(`Loading *****************...${direction} , ${station}`);
  this.showMap = false;
  this.showNorthShellMap = true;
  if (this.showNorthShellMap && !this.mapInitialized) {
    this.initMap('northShell'); // Initialize the North Shell map
 // Initialize the map after DOM is ready
  }
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
