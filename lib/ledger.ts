import {
  addMonths,
  endOfMonth,
  format,
  isSameMonth,
  parseISO,
  startOfMonth,
  subMonths
} from "date-fns";

export type EntryType = "income" | "expense";

export type Category = {
  id: string;
  name: string;
  kind: EntryType;
  color: string;
};

export type BudgetRow = {
  id: string;
  category_id: string;
  amount: number;
  month_start: string;
};

export type TransactionRow = {
  id: string;
  amount: number;
  entry_type: EntryType;
  occurred_on: string;
  note: string | null;
  category_id: string;
  category?: Category | null;
};

export type MonthlySummary = {
  income: number;
  expense: number;
  balance: number;
  budget: number;
  remaining: number;
};

export const defaultCategories: Array<Pick<Category, "name" | "kind" | "color">> = [
  { name: "식비", kind: "expense", color: "#ff9a62" },
  { name: "생활", kind: "expense", color: "#f16c6c" },
  { name: "교통", kind: "expense", color: "#6f93ff" },
  { name: "구독", kind: "expense", color: "#9b6ef3" },
  { name: "쇼핑", kind: "expense", color: "#ff7aa2" },
  { name: "급여", kind: "income", color: "#11a37f" },
  { name: "부수입", kind: "income", color: "#1ba3c4" }
];

export function getMonthStart(value: Date) {
  return format(startOfMonth(value), "yyyy-MM-dd");
}

export function getMonthLabel(value: Date) {
  return format(value, "yyyy년 M월");
}

export function getMonthWindow(value: Date) {
  return {
    start: format(startOfMonth(value), "yyyy-MM-dd"),
    end: format(endOfMonth(value), "yyyy-MM-dd")
  };
}

export function parseLedgerDate(value: string) {
  return parseISO(value);
}

export function moveMonth(value: Date, direction: "prev" | "next") {
  return direction === "prev" ? subMonths(value, 1) : addMonths(value, 1);
}

export function sumMonth(
  transactions: TransactionRow[],
  budgets: BudgetRow[],
  currentMonth: Date
): MonthlySummary {
  const currentMonthTransactions = transactions.filter((transaction) =>
    isSameMonth(parseLedgerDate(transaction.occurred_on), currentMonth)
  );

  const income = currentMonthTransactions
    .filter((transaction) => transaction.entry_type === "income")
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  const expense = currentMonthTransactions
    .filter((transaction) => transaction.entry_type === "expense")
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  const budget = budgets.reduce((sum, row) => sum + Number(row.amount), 0);

  return {
    income,
    expense,
    balance: income - expense,
    budget,
    remaining: budget - expense
  };
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0
  }).format(value);
}
