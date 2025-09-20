import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { CheckSquare, RefreshCw } from 'lucide-react';
import { store } from './store/store';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { fetchTodos, clearError } from './store/slices/todoSlice';
import TodoStats from './components/TodoStats';
import SearchAndFilter from './components/SearchAndFilter';
import AddTodoForm from './components/AddTodoForm';
import TodoList from './components/TodoList';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMesage';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.todos);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(fetchTodos());
  };

  const handleDismissError = () => {
    dispatch(clearError());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl">
              <CheckSquare className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              TodoMaster Pro
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Professional task management for productive teams
          </p>
        </motion.div>

        {/* Error handling */}
        {error && (
          <ErrorMessage 
            message={error} 
            onDismiss={handleDismissError}
          />
        )}

        {/* Loading state for initial fetch */}
        {loading && !error ? (
          <LoadingSpinner size="lg" text="Loading your todos..." />
        ) : (
          <>
            {/* Statistics Dashboard */}
            <TodoStats />

            {/* Search and Filter */}
            <SearchAndFilter />

            {/* Add Todo Form */}
            <AddTodoForm />

            {/* Todo List */}
            <TodoList />

            {/* Retry button for errors */}
            {error && (
              <motion.div 
                className="text-center mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry Loading Todos
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Toast notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '10px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;