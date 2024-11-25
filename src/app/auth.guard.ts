import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SupabaseService } from './superbase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private supabaseService: SupabaseService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const { data } = await this.supabaseService.getUser();
    if (!data.user) {
      this.router.navigateByUrl('');
      return false;
    }
    return true;
  }
}
