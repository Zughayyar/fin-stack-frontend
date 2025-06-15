import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from '../config/app.config';

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

export interface NewIncome {
  user_id: string;
  source: string;
  amount: string;
  date: string;
  description?: string | null;
}

export interface UpdateIncome {
  source?: string | null;
  amount?: string | null;
  date?: string | null;
  description?: string | null;
  updated_at?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class IncomeService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: AppConfigService) {
    this.apiUrl = this.configService.incomesApiUrl;
  }

  // GET /api/incomes (all incomes)
  getAllIncomes(): Observable<Income[]> {
    return this.http.get<Income[]>(`${this.apiUrl}`);
  }

  // GET /api/incomes/{user_id}
  getIncomesByUserId(userId: string): Observable<Income[]> {
    return this.http.get<Income[]>(`${this.apiUrl}/${userId}`);
  }

  // POST /api/incomes
  createIncome(income: NewIncome): Observable<Income> {
    return this.http.post<Income>(`${this.apiUrl}`, income);
  }

  // PUT /api/incomes/{income_id}
  updateIncome(incomeId: string, update: UpdateIncome): Observable<Income> {
    return this.http.put<Income>(`${this.apiUrl}/${incomeId}`, update);
  }

  // DELETE /api/incomes/{income_id}
  deleteIncome(incomeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${incomeId}`);
  }
} 