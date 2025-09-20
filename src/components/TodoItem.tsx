import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Calendar, AlertTriangle, Circle, CheckCircle2 } from 'lucide-react';
import { useAppDispatch } from '../hooks/redux';
import { updateTodo, deleteTodo } from '../store/slices/todoSlice';
import { Todo } from '../types/todo';
import toast from 'react-hot-toast';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit }) => {
  const dispatch = useAppDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50';
      case 'medium': return 'text-yellow-500 bg-yellow-50';
      case 'low': return 'text-green-500 bg-green-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'high') {
      return <AlertTriangle className="w-4 h-4" />;
    }
    return <Circle className="w-4 h-4" />;
  };

  const handleToggleComplete = async () => {
    setIsToggling(true);
    try {
      await dispatch(updateTodo({
        id: todo.id,
        completed: !todo.completed
      })).unwrap();
      toast.success(todo.completed ? 'Todo marked as pending' : 'Todo completed!');
    } catch (error) {
      toast.error(error as string);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      setIsDeleting(true);
      try {
        await dispatch(deleteTodo(todo.id)).unwrap();
        toast.success('Todo deleted successfully');
      } catch (error) {
        toast.error(error as string);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all duration-200 hover:shadow-md ${
        todo.completed ? 'opacity-75' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={handleToggleComplete}
          disabled={isToggling}
          className={`flex-shrink-0 mt-1 transition-colors ${
            isToggling ? 'opacity-50' : 'hover:scale-110'
          }`}
        >
          {todo.completed ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400 hover:text-blue-500" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-gray-900 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                {todo.title}
              </h3>
              {todo.description && (
                <p className={`text-sm text-gray-600 mt-1 ${todo.completed ? 'line-through' : ''}`}>
                  {todo.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => onEdit(todo)}
                className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Edit className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-gray-400 hover:text-red-500 transition-colors p-1 disabled:opacity-50"
                whileHover={{ scale: isDeleting ? 1 : 1.1 }}
                whileTap={{ scale: isDeleting ? 1 : 0.9 }}
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Meta information */}
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Created {formatDate(todo.createdAt)}</span>
            </div>
            
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${getPriorityColor(todo.priority)}`}>
              {getPriorityIcon(todo.priority)}
              <span className="font-medium capitalize">{todo.priority}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TodoItem;