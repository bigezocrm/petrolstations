import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SupabaseService } from './superbase.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RouterModule, CommonModule, FormsModule],
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
