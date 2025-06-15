import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from '../config/app.config';

export interface Expense {
  id: string;
  user_id: string;
  item_name: string;
  amount: string;
  date: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewExpense {
  user_id: string;
  item_name: string;
  amount: string;
  date: string;
  description?: string | null;
}

export interface UpdateExpense {
  item_name?: string | null;
  amount?: string | null;
  date?: string | null;
  description?: string | null;
  updated_at?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: AppConfigService) {
    this.apiUrl = this.configService.expensesApiUrl;
  }

  // GET /api/expenses (all expenses)
  getAllExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}`);
  }

  // GET /api/expenses/{user_id}
  getExpensesByUserId(userId: string): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/${userId}`);
  }

  // POST /api/expenses
  createExpense(expense: NewExpense): Observable<Expense> {
    return this.http.post<Expense>(`${this.apiUrl}`, expense);
  }

  // PUT /api/expenses/{expense_id}
  updateExpense(expenseId: string, update: UpdateExpense): Observable<Expense> {
    return this.http.put<Expense>(`${this.apiUrl}/${expenseId}`, update);
  }

  // DELETE /api/expenses/{expense_id}
  deleteExpense(expenseId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${expenseId}`);
  }
} 