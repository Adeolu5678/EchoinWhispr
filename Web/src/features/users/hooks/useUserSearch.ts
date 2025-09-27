'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { searchUsers, userSearchService } from '../services/userSearchService';
import type { UserSearchResult, SearchFilters } from '../types';

/**
 * Configuration options for the useUserSearch hook
 */
interface UseUserSearchConfig {
  /** Minimum query length before triggering search */
  minQueryLength?: number;
  /** Debounce delay in milliseconds */
  debounceDelay?: number;
  /** Default search limit */
  defaultLimit?: number;
  /** Whether to enable search caching */
  enableCache?: boolean;
}

/**
 * Return type for the useUserSearch hook
 */
interface UseUserSearchReturn {
  /** Current search query */
  query: string;
  /** Search results */
  results: UserSearchResult[];
  /** Whether a search is currently in progress */
  isLoading: boolean;
  /** Current error state */
  error: string | null;
  /** Whether there are more results available */
  hasMore: boolean;
  /** Total number of matching results */
  totalCount: number;
  /** Set the search query and trigger search */
  setQuery: (query: string) => void;
  /** Manually trigger a search */
  search: (searchQuery: string) => Promise<void>;
  /** Clear search results */
  clearResults: () => void;
  /** Load more results */
  loadMore: () => Promise<void>;
}

/**
 * Internal search state interface
 */
interface InternalSearchState {
  /** Current search query */
  query: string;
  /** Search results */
  results: UserSearchResult[];
  /** Whether a search is currently in progress */
  isLoading: boolean;
  /** Current error state (null if no error) */
  error: string | null;
  /** Whether there are more results available */
  hasMore: boolean;
  /** Total number of matching results */
  totalCount: number;
}

/**
 * Custom hook for user search functionality with debouncing and state management
 *
 * Provides a clean interface for searching users with built-in debouncing,
 * error handling, and loading states. Integrates with the user search service
 * for backend communication.
 *
 * @param config - Configuration options for the search behavior
 * @returns Object containing search state and control functions
 *
 * @example
 * ```tsx
 * const {
 *   query,
 *   results,
 *   isLoading,
 *   error,
 *   setQuery,
 *   search,
 *   clearResults
 * } = useUserSearch({ minQueryLength: 2, debounceDelay: 300 })
 *
 * return (
 *   <div>
 *     <input
 *       value={query}
 *       onChange={(e) => setQuery(e.target.value)}
 *       placeholder="Search users..."
 *     />
 *     {isLoading && <div>Searching...</div>}
 *     {error && <div>Error: {error}</div>}
 *     {results.map(user => (
 *       <div key={user._id}>{user.username}</div>
 *     ))}
 *   </div>
 * )
 * ```
 */
export const useUserSearch = (
  config: UseUserSearchConfig = {}
): UseUserSearchReturn => {
  const { toast } = useToast();

  // Configuration with defaults
  const {
    minQueryLength = 2,
    debounceDelay = 300,
    defaultLimit = 20,
    enableCache = true,
  } = config;

  // Internal state
  const [searchState, setSearchState] = useState<InternalSearchState>({
    query: '',
    results: [],
    isLoading: false,
    error: null,
    hasMore: false,
    totalCount: 0,
  });

  // Debounce timer reference
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  /**
   * Updates the search state
   */
  const updateSearchState = useCallback(
    (updates: Partial<InternalSearchState>) => {
      setSearchState(prev => ({ ...prev, ...updates }));
    },
    []
  );

  /**
   * Performs the actual search operation
   */
  const performSearch = useCallback(
    async (searchQuery: string, filters: SearchFilters = { query: '' }) => {
      if (!searchQuery.trim()) {
        updateSearchState({
          results: [],
          error: null,
          hasMore: false,
          totalCount: 0,
        });
        return;
      }

      updateSearchState({ isLoading: true, error: null });

      try {
        const response = await searchUsers(searchQuery, {
          ...filters,
          limit: filters.limit || defaultLimit,
        });

        updateSearchState({
          results: response.results,
          hasMore: response.hasMore,
          totalCount: response.totalCount,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error('Search error:', error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An error occurred while searching';

        updateSearchState({
          isLoading: false,
          error: errorMessage,
          results: [],
          hasMore: false,
          totalCount: 0,
        });

        // Show toast notification for errors
        toast({
          title: 'Search Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    },
    [defaultLimit, updateSearchState, toast]
  );

  /**
   * Debounced search function
   */
  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      // Clear existing timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      // Set new timer
      const timer = setTimeout(() => {
        performSearch(searchQuery);
      }, debounceDelay);

      setDebounceTimer(timer);

      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    },
    [debounceTimer, debounceDelay, performSearch]
  );

  /**
   * Sets the search query and triggers debounced search
   */
  const setQuery = useCallback(
    (newQuery: string) => {
      updateSearchState({ query: newQuery });

      // Only search if query meets minimum length
      if (newQuery.trim().length >= minQueryLength) {
        debouncedSearch(newQuery);
      } else {
        // Clear results for short queries
        updateSearchState({
          results: [],
          error: null,
          hasMore: false,
          totalCount: 0,
        });
      }
    },
    [minQueryLength, debouncedSearch, updateSearchState]
  );

  /**
   * Manually trigger a search (immediate, no debouncing)
   */
  const search = useCallback(
    async (searchQuery: string) => {
      // Clear any pending debounced search
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        setDebounceTimer(null);
      }

      await performSearch(searchQuery);
    },
    [debounceTimer, performSearch]
  );

  /**
   * Clears search results and state
   */
  const clearResults = useCallback(() => {
    // Clear any pending debounced search
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      setDebounceTimer(null);
    }

    updateSearchState({
      query: '',
      results: [],
      isLoading: false,
      error: null,
      hasMore: false,
      totalCount: 0,
    });
  }, [debounceTimer, updateSearchState]);

  /**
   * Loads more search results
   */
  const loadMore = useCallback(async () => {
    if (!searchState.hasMore || searchState.isLoading) {
      return;
    }

    updateSearchState({ isLoading: true });

    try {
      const response = await searchUsers(searchState.query, {
        query: searchState.query,
        limit: defaultLimit,
        offset: searchState.results.length,
      });

      updateSearchState({
        results: [...searchState.results, ...response.results],
        hasMore: response.hasMore,
        totalCount: response.totalCount,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Load more error:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load more results';

      updateSearchState({
        isLoading: false,
        error: errorMessage,
      });

      toast({
        title: 'Load More Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [searchState, defaultLimit, updateSearchState, toast]);

  /**
   * Cleanup effect to clear debounce timer on unmount
   */
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  /**
   * Configure search service based on props
   */
  useEffect(() => {
    if (!enableCache) {
      userSearchService.clearCache();
    }
  }, [enableCache]);

  // Memoized return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      query: searchState.query,
      results: searchState.results,
      isLoading: searchState.isLoading,
      error: searchState.error,
      hasMore: searchState.hasMore,
      totalCount: searchState.totalCount,
      setQuery,
      search,
      clearResults,
      loadMore,
    }),
    [
      searchState.query,
      searchState.results,
      searchState.isLoading,
      searchState.error,
      searchState.hasMore,
      searchState.totalCount,
      setQuery,
      search,
      clearResults,
      loadMore,
    ]
  );
};
