

export interface BudgetTierInfo {
  id: string;
  title: string;
  description: string;
  accentColor: string; // Tailwind text color class
  iconColor: string; // Hex for custom styling
  iconName: string;
}

export interface CatalogItem {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string; // Matches BudgetTierInfo.id
  image: string;
}

export interface CatalogCategory {
  id: string;
  title: string;
  description: string;
  image?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

// Keeping these for backward compatibility if needed
export enum BudgetCategoryType {
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  EVENTS = 'Events',
  SAVINGS = 'Savings',
}

export interface BudgetCategory {
  id: string;
  name: string;
  type: BudgetCategoryType;
  allocated: number;
  spent: number;
  color: string;
  icon: string;
  description?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  categoryId: string;
  date: string; // ISO string
  isExpense: boolean; // true for expense, false for income adding to budget
}

export interface UserProfile {
  name: string;
  email: string;
  picture: string;
}
