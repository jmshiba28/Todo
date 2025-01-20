export type Priority = 'low' | 'medium' | 'high';

export type RecurrencePattern = {
  type: 'daily' | 'weekly' | 'custom';
  interval?: number;
  endDate?: Date;
  skipDates?: Date[];
};

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  priority: Priority;
  categoryId?: string;
  recurrence?: RecurrencePattern;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  userId: string;
}