import { Component } from '@angular/core';
import { MapComponent } from "../map/map.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    imports: [MapComponent,CommonModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
    showMap = false;  // Track map visibility

    toggleMapVisibility() {
      this.showMap = !this.showMap;  // Toggle the visibility
    }
}
