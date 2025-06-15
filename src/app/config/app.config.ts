import { Injectable } from '@angular/core';

export interface AppConfiguration {
  apiUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private config: AppConfiguration;

  constructor() {
    // Use build-time environment variable replacement or fall back to default
    const apiUrl = this.getApiUrl();
    
    this.config = {
      apiUrl: apiUrl
    };
  }

  get apiUrl(): string {
    return this.config.apiUrl;
  }

  get authApiUrl(): string {
    return `${this.config.apiUrl}/api/auth`;
  }

  get expensesApiUrl(): string {
    return `${this.config.apiUrl}/api/expenses`;
  }

  get incomesApiUrl(): string {
    return `${this.config.apiUrl}/api/incomes`;
  }

  private getApiUrl(): string {
    // This placeholder will be replaced at build time by the actual environment variable
    const placeholder = 'FRONTEND_API_URL_PLACEHOLDER';
    const defaultUrl = 'http://localhost:8080';
    
    // If placeholder wasn't replaced, use default
    return placeholder.startsWith('FRONTEND_API_URL_') ? defaultUrl : placeholder;
  }
} 