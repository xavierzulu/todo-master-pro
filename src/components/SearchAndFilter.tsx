import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setFilter, setSearchQuery } from '../store/slices/todoSlice';

const SearchAndFilter: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filter, searchQuery } = useAppSelector(state => state.todos);

  const filterOptions = [
    { value: 'all' as const, label: 'All Tasks', count: 'total' },
    { value: 'active' as const, label: 'Active', count: 'pending' },
    { value: 'completed' as const, label: 'Completed', count: 'completed' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search todos..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400 w-5 h-5" />
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            {filterOptions.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => dispatch(setFilter(option.value))}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  filter === option.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchAndFilter;