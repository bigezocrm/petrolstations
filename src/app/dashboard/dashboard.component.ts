import { Component } from '@angular/core';
import { MapComponent } from "../map/map.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MapComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
