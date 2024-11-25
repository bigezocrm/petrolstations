import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})

export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    // Initialize Supabase client
    this.supabase = createClient(
      'https://xxgqkuyepvuhgwcooerh.supabase.co', // Replace with your Supabase URL
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4Z3FrdXllcHZ1aGd3Y29vZXJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzODg2MTQsImV4cCI6MjA0Nzk2NDYxNH0.PKmLZGCU3YU5xJY5qMxcmqRXqVfUtpEQsUWHno8WIA8' // Replace with your Supabase anon key
    );
  }

  async login(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
   
  }

  // Check if user is logged in
  async getUser() {
    return this.supabase.auth.getUser();
  }

  // Logout method
  async logout() {
    return this.supabase.auth.signOut();
  }

  async testGetUser() {
    try {
      const response = await this.getUser();
      console.log('User data:', response.data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

  async testLoginAndGetUser() {
    try {
      // Replace with valid credentials
      const loginResponse = await this.login('ochalfie@gmail.com', '1234567');
      console.log('Login response:', loginResponse);
  
      if (loginResponse.error) {
        console.error('Login failed:', loginResponse.error.message);
        return;
      }
  
      // Fetch user after login
      const userResponse = await this.getUser();
      console.log('User after login:', userResponse.data.user);
    } catch (error) {
      console.error('Error during login or fetching user:', error);
    }
  }
  
}