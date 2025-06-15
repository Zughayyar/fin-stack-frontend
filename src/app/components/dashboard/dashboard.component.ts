import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ExpenseService, Expense, NewExpense, UpdateExpense } from '../../services/expense.service';
import { IncomeService, Income, NewIncome, UpdateIncome } from '../../services/income.service';
import { AuthService, UserInfo } from '../../services/auth.service';
import { AddIncomeComponent } from '../add-income/add-income.component';
import { AddExpenseComponent } from '../add-expense/add-expense.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AddIncomeComponent, AddExpenseComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  currentUser: UserInfo | null = null;
  expenses: Expense[] = [];
  incomes: Income[] = [];
  filteredIncomes: Income[] = [];
  filteredExpenses: Expense[] = [];
  selectedMonth: Date = new Date();
  totalExpenses: number = 0;
  totalIncome: number = 0;
  balance: number = 0;
  isLoading = true;

  // Edit state
  editingExpense: Expense | null = null;
  editingIncome: Income | null = null;
  showEditExpenseModal = false;
  showEditIncomeModal = false;
  editExpenseForm: Partial<Expense> = {};
  editIncomeForm: Partial<Income> = {};

  constructor(
    private expenseService: ExpenseService,
    private incomeService: IncomeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to current user
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.loadUserData();
      } else {
        // No user logged in, redirect to login
        this.router.navigate(['/login']);
      }
    });
  }

  loadUserData() {
    if (!this.currentUser) return;
    
    this.isLoading = true;
    // Load expenses and incomes for the current user
    this.loadExpenses();
    this.loadIncomes();
  }

  loadExpenses() {
    if (!this.currentUser) return;
    
    this.expenseService.getExpensesByUserId(this.currentUser.id).subscribe({
      next: (expenses) => {
        this.expenses = expenses;
        this.calculateTotals();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading expenses:', error);
        this.isLoading = false;
      }
    });
  }

  loadIncomes() {
    if (!this.currentUser) return;
    
    this.incomeService.getIncomesByUserId(this.currentUser.id).subscribe({
      next: (incomes) => {
        this.incomes = incomes;
        this.calculateTotals();
      },
      error: (error) => {
        console.error('Error loading incomes:', error);
      }
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        // Even if logout request fails, clear local data and redirect
        this.authService.clearAuthData();
        this.router.navigate(['/login']);
      }
    });
  }

  calculateTotals() {
    // Filter incomes and expenses by selectedMonth
    const month = this.selectedMonth.getMonth();
    const year = this.selectedMonth.getFullYear();
    this.filteredIncomes = this.incomes.filter(income => {
      const d = new Date(income.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
    this.filteredExpenses = this.expenses.filter(expense => {
      const d = new Date(expense.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
    this.totalExpenses = this.filteredExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    this.totalIncome = this.filteredIncomes.reduce((sum, income) => sum + Number(income.amount), 0);
    this.balance = this.totalIncome - this.totalExpenses;
  }

  changeMonth(delta: number) {
    this.selectedMonth = new Date(
      this.selectedMonth.getFullYear(),
      this.selectedMonth.getMonth() + delta,
      1
    );
    this.calculateTotals();
  }

  onIncomeAdded() {
    this.loadIncomes();
  }

  onExpenseAdded() {
    this.loadExpenses();
  }

  // Edit Expense
  startEditExpense(expense: Expense) {
    this.editingExpense = { ...expense };
    this.editExpenseForm = { ...expense };
    this.showEditExpenseModal = true;
  }

  saveEditExpense() {
    if (!this.editingExpense) return;
    const update: UpdateExpense = {
      item_name: this.editExpenseForm.item_name,
      amount: this.editExpenseForm.amount,
      date: this.editExpenseForm.date,
      description: this.editExpenseForm.description
    };
    this.expenseService.updateExpense(this.editingExpense.id, update).subscribe({
      next: () => {
        this.loadExpenses();
        this.cancelEditExpense();
      },
      error: (error) => {
        console.error('Error updating expense:', error);
      }
    });
  }

  cancelEditExpense() {
    this.editingExpense = null;
    this.editExpenseForm = {};
    this.showEditExpenseModal = false;
  }

  deleteExpense(expense: Expense) {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenseService.deleteExpense(expense.id).subscribe({
        next: () => {
          this.loadExpenses();
        },
        error: (error) => {
          console.error('Error deleting expense:', error);
        }
      });
    }
  }

  // Edit Income
  startEditIncome(income: Income) {
    this.editingIncome = { ...income };
    this.editIncomeForm = { ...income };
    this.showEditIncomeModal = true;
  }

  saveEditIncome() {
    if (!this.editingIncome) return;
    const update: UpdateIncome = {
      source: this.editIncomeForm.source,
      amount: this.editIncomeForm.amount,
      date: this.editIncomeForm.date,
      description: this.editIncomeForm.description
    };
    this.incomeService.updateIncome(this.editingIncome.id, update).subscribe({
      next: () => {
        this.loadIncomes();
        this.cancelEditIncome();
      },
      error: (error) => {
        console.error('Error updating income:', error);
      }
    });
  }

  cancelEditIncome() {
    this.editingIncome = null;
    this.editIncomeForm = {};
    this.showEditIncomeModal = false;
  }

  deleteIncome(income: Income) {
    if (confirm('Are you sure you want to delete this income?')) {
      this.incomeService.deleteIncome(income.id).subscribe({
        next: () => {
          this.loadIncomes();
        },
        error: (error) => {
          console.error('Error deleting income:', error);
        }
      });
    }
  }
} 