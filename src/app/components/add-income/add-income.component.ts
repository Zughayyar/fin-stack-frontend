import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncomeService, NewIncome } from '../../services/income.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-income',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-income.component.html'
})
export class AddIncomeComponent {
  @Output() incomeAdded = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  isOpen = false;
  isLoading = false;
  errorMessage = '';
  income: NewIncome = {
    user_id: '',
    source: '',
    amount: '',
    date: '',
    description: ''
  };

  constructor(
    private incomeService: IncomeService,
    private authService: AuthService
  ) {}

  open() {
    const currentUser = this.authService.getCurrentUserValue();
    if (currentUser) {
      this.resetForm();
      this.income.user_id = currentUser.id;
      // Set default date to today
      this.income.date = new Date().toISOString().split('T')[0];
      this.isOpen = true;
    } else {
      this.errorMessage = 'User not authenticated';
    }
  }

  close() {
    this.isOpen = false;
    this.resetForm();
    this.closed.emit();
  }

  private resetForm() {
    this.income = {
      user_id: '',
      source: '',
      amount: '',
      date: '',
      description: ''
    };
    this.errorMessage = '';
    this.isLoading = false;
  }

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Validate required fields
    if (!this.income.source || !this.income.amount || !this.income.date) {
      this.errorMessage = 'Please fill in all required fields';
      this.isLoading = false;
      return;
    }

    // Format the data according to backend requirements
    const formattedIncome: NewIncome = {
      user_id: this.income.user_id,
      source: this.income.source.trim(),
      amount: this.income.amount.toString(),
      date: this.income.date,
      description: this.income.description?.trim() || undefined
    };

    this.incomeService.createIncome(formattedIncome).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.incomeAdded.emit();
        this.close();
      },
      error: (error) => {
        this.isLoading = false;
        
        if (error.status === 401) {
          this.errorMessage = 'Authentication failed. Please log in again.';
          this.authService.clearAuthData();
        } else if (error.status === 400) {
          this.errorMessage = 'Invalid data. Please check your inputs.';
        } else {
          this.errorMessage = error.message || 'Failed to add income. Please try again.';
        }
      }
    });
  }
} 