import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService, NewExpense } from '../../services/expense.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-expense.component.html'
})
export class AddExpenseComponent {
  @Output() expenseAdded = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  isOpen = false;
  isLoading = false;
  errorMessage = '';
  
  expenseCategories = [
    'Grocery',
    'Debt',
    'Transportation',
    'Utilities',
    'Entertainment',
    'Healthcare',
    'Other (specify)'
  ];
  
  selectedCategory = '';
  customCategory = '';
  
  expense: NewExpense = {
    user_id: '',
    item_name: '',
    amount: '',
    date: '',
    description: ''
  };

  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService
  ) {}

  open() {
    const currentUser = this.authService.getCurrentUserValue();
    if (currentUser) {
      this.resetForm();
      this.expense.user_id = currentUser.id;
      // Set default date to today
      this.expense.date = new Date().toISOString().split('T')[0];
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
    this.expense = {
      user_id: '',
      item_name: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    };
    this.selectedCategory = '';
    this.customCategory = '';
    this.errorMessage = '';
    this.isLoading = false;
  }

  onCategoryChange() {
    if (this.selectedCategory !== 'Other (specify)') {
      this.customCategory = '';
    }
  }

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Determine the final category
    let finalCategory = this.selectedCategory;
    if (this.selectedCategory === 'Other (specify)' && this.customCategory.trim()) {
      finalCategory = this.customCategory.trim();
    }
    
    // Validate required fields
    if (!finalCategory || !this.expense.amount || !this.expense.date) {
      this.errorMessage = 'Please fill in all required fields';
      this.isLoading = false;
      return;
    }

    const formattedExpense: NewExpense = {
      user_id: this.expense.user_id,
      item_name: finalCategory,
      amount: this.expense.amount.toString(),
      date: this.expense.date,
      description: this.expense.description?.trim() || undefined
    };

    this.expenseService.createExpense(formattedExpense).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.expenseAdded.emit();
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
          this.errorMessage = error.message || 'Failed to add expense. Please try again.';
        }
      }
    });
  }
} 