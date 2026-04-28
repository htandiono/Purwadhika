import { useMemo } from 'react';
import { useStore } from 'zustand';
import { appStore } from '../store';

export function useFilteredTodos() {
  const todos = useStore(appStore, state => state.todos) || [];
  const filter = useStore(appStore, state => state.filter);
  const searchQuery = useStore(appStore, state => state.searchQuery);
  const sortOrder = useStore(appStore, state => state.sortOrder);

  const filteredTodos = useMemo(() => {
    return todos
      .filter((todo) => {
        if (filter === 'Active' && todo.completed) return false;
        if (filter === 'Completed' && !todo.completed) return false;

        const textToSearch = todo.text || '';
        if (searchQuery && !textToSearch.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Backendless provides 'created' timestamp instead of 'createdAt' sometimes.
        const dateA = a.created || a.createdAt || 0;
        const dateB = b.created || b.createdAt || 0;

        if (sortOrder === 'newest') {
          return dateB - dateA;
        } else {
          return dateA - dateB;
        }
      });
  }, [todos, filter, searchQuery, sortOrder]);

  const activeCount = useMemo(() => {
    return todos.filter((t) => !t.completed).length;
  }, [todos]);

  return { filteredTodos, activeCount, filter, sortOrder, searchQuery };
}
