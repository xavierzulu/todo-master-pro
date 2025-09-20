import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '../hooks/redux';
import TodoItem from './TodoItem';
import EditTodoModal from './EditTodoModal';
import { Todo } from '../types/todo';

const TodoList: React.FC = () => {
  const { todos, filter, searchQuery } = useAppSelector(state => state.todos);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const filteredTodos = useMemo(() => {
    let filtered = todos;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    switch (filter) {
      case 'active':
        filtered = filtered.filter(todo => !todo.completed);
        break;
      case 'completed':
        filtered = filtered.filter(todo => todo.completed);
        break;
    }

    // Sort by completion status, then by priority, then by creation date
    return [...filtered].sort((a, b) => {
      // Completed items go to bottom
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      // Priority sorting (high > medium > low)
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }

      // Most recent first
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [todos, filter, searchQuery]);

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const handleCloseEditModal = () => {
    setEditingTodo(null);
  };

  if (filteredTodos.length === 0) {
    const getEmptyMessage = () => {
      if (searchQuery.trim()) {
        return `No todos found matching "${searchQuery}"`;
      }
      
      switch (filter) {
        case 'active':
          return 'No active todos. Great job!';
        case 'completed':
          return 'No completed todos yet.';
        default:
          return 'No todos yet. Create your first todo above!';
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 text-gray-500"
      >
        <div className="text-4xl mb-4">📝</div>
        <p className="text-lg font-medium mb-2">
          {getEmptyMessage()}
        </p>
        {!searchQuery.trim() && filter === 'all' && (
          <p className="text-sm">
            Start organizing your tasks by adding a new todo.
          </p>
        )}
      </motion.div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <AnimatePresence>
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onEdit={handleEditTodo}
            />
          ))}
        </AnimatePresence>
      </div>

      <EditTodoModal
        todo={editingTodo}
        isOpen={!!editingTodo}
        onClose={handleCloseEditModal}
      />
    </>
  );
};

export default TodoList;