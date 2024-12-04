import { Component } from '@angular/core';
import { MapComponent } from "../map/map.component";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../superbase.service';

@Component({
    selector: 'app-dashboard',
    imports: [MapComponent,CommonModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
    showMap = false;  // Track map visibility

    constructor(private router: Router, private supabaseService: SupabaseService) {}

  logout() {
    this.supabaseService.logout()
      .then(() => {
        // Redirect the user to the login page after logging out
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Logout failed:', error);
      });
  }

    toggleMapVisibility() {

      this.showMap = !this.showMap;  // Toggle the visibility
      if(this.showMap){}
      else {}
    }

}
