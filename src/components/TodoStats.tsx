import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useAppSelector } from '../hooks/redux';

const TodoStats: React.FC = () => {
  const todos = useAppSelector(state => state.todos.todos);
  
  const stats = {
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    pending: todos.filter(todo => !todo.completed).length,
    high: todos.filter(todo => todo.priority === 'high' && !todo.completed).length
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const statItems = [
    {
      icon: CheckCircle,
      label: 'Completed',
      value: stats.completed,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Clock,
      label: 'Pending',
      value: stats.pending,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: AlertTriangle,
      label: 'High Priority',
      value: stats.high,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Overview</h3>
        <div className="text-sm text-gray-500">
          {completionRate}% Complete
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`${item.bgColor} rounded-lg p-3 text-center`}
          >
            <item.icon className={`w-6 h-6 ${item.color} mx-auto mb-2`} />
            <div className={`text-2xl font-bold ${item.color} mb-1`}>
              {item.value}
            </div>
            <div className="text-xs text-gray-600">{item.label}</div>
          </motion.div>
        ))}
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${completionRate}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
};

export default TodoStats;