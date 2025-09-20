import { Todo, CreateTodoRequest, UpdateTodoRequest, ApiResponse } from '../types/todo';

// Mock data
const INITIAL_TODOS: Todo[] = [
  {
    id: '1',
    title: 'Design system architecture',
    description: 'Create a comprehensive design system for the new project including components, colors, and typography.',
    completed: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    priority: 'high'
  },
  {
    id: '2',
    title: 'Implement authentication',
    description: 'Set up user authentication with JWT tokens and secure routes.',
    completed: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    priority: 'high'
  },
  {
    id: '3',
    title: 'Write unit tests',
    description: 'Create comprehensive unit tests for all components and utilities.',
    completed: false,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
    priority: 'medium'
  }
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate random failures (5% chance)
const shouldFail = () => Math.random() < 0.05;

let todos = [...INITIAL_TODOS];

export const mockTodoApi = {
  async fetchTodos(): Promise<ApiResponse<Todo[]>> {
    await delay(800); // Simulate network latency
    
    if (shouldFail()) {
      throw new Error('Failed to fetch todos. Please try again.');
    }
    
    return {
      data: [...todos],
      message: 'Todos fetched successfully',
      success: true
    };
  },

  async createTodo(todoData: CreateTodoRequest): Promise<ApiResponse<Todo>> {
    await delay(600);
    
    if (shouldFail()) {
      throw new Error('Failed to create todo. Please try again.');
    }

    const newTodo: Todo = {
      id: Date.now().toString(),
      ...todoData,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    todos.push(newTodo);
    
    return {
      data: newTodo,
      message: 'Todo created successfully',
      success: true
    };
  },

  async updateTodo(updateData: UpdateTodoRequest): Promise<ApiResponse<Todo>> {
    await delay(500);
    
    if (shouldFail()) {
      throw new Error('Failed to update todo. Please try again.');
    }

    const todoIndex = todos.findIndex(todo => todo.id === updateData.id);
    
    if (todoIndex === -1) {
      throw new Error('Todo not found');
    }

    const updatedTodo = {
      ...todos[todoIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    todos[todoIndex] = updatedTodo;
    
    return {
      data: updatedTodo,
      message: 'Todo updated successfully',
      success: true
    };
  },

  async deleteTodo(id: string): Promise<ApiResponse<string>> {
    await delay(400);
    
    if (shouldFail()) {
      throw new Error('Failed to delete todo. Please try again.');
    }

    const todoIndex = todos.findIndex(todo => todo.id === id);
    
    if (todoIndex === -1) {
      throw new Error('Todo not found');
    }

    todos.splice(todoIndex, 1);
    
    return {
      data: id,
      message: 'Todo deleted successfully',
      success: true
    };
  }
};