import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
}

export interface NewUser {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface UpdateUser {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  password?: string | null;
  updated_at?: string | null;
}

export interface Income {
  id: string;
  user_id: string;
  source: string;
  amount: string;
  date: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserWithIncomes extends User {
  incomes: Income[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(userId: string): Observable<UserWithIncomes> {
    return this.http.get<UserWithIncomes>(`${this.apiUrl}/${userId}`);
  }

  createUser(user: NewUser): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(userId: string, user: UpdateUser): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${userId}`, user);
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }
} 