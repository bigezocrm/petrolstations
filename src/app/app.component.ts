import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from "./login/login.component";
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { SupabaseService } from './superbase.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, FormsModule,  DashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private supabaseService: SupabaseService) {}

  ngOnInit() {
    this.supabaseService.testLoginAndGetUser();
    this.supabaseService.testGetUser();
  }

}
