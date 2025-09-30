'use client';

import { memo, useCallback, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, X, Users, Loader2 } from 'lucide-react';
import { useUserSearch } from '../hooks/useUserSearch';
import { UserSearchResult } from './UserSearchResult';
import type { UserSearchResult as UserSearchResultType } from '../types';

/**
 * Props for the UserSearch component
 */
interface UserSearchProps {
  /** Placeholder text for the search input */
  placeholder?: string;
  /** Maximum number of results to show */
  maxResults?: number;
  /** Whether to show "load more" functionality */
  showLoadMore?: boolean;
  /** Callback when users are selected */
  onUserSelect?: (users: UserSearchResultType[]) => void;
  /** Callback when a single user is selected */
  onUserToggle?: (user: UserSearchResultType) => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether the component is disabled */
  disabled?: boolean;
}

/**
 * Main user search component
 *
 * Provides a complete search interface with input field, results display,
 * and user selection functionality. Integrates with the useUserSearch hook
 * and displays results using UserSearchResult components.
 *
 * @param props - Component props
 * @returns JSX element representing the complete user search interface
 *
 * @example
 * ```tsx
 * <UserSearch
 *   placeholder="Search for users to whisper..."
 *   maxResults={10}
 *   onUserSelect={(users) => console.log('Selected users:', users)}
 * />
 * ```
 */
export const UserSearch = memo<UserSearchProps>(
  ({
    placeholder = 'Search for users...',
    maxResults = 50,
    showLoadMore = true,
    onUserSelect,
    onUserToggle,
    className = '',
    disabled = false,
  }) => {
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

    const {
      query,
      results,
      isLoading,
      error,
      hasMore,
      totalCount,
      setQuery,
      search,
      clearResults,
      loadMore,
    } = useUserSearch({
      minQueryLength: 2,
      debounceDelay: 300,
      defaultLimit: 20,
    });

    /**
     * Handles user selection toggle
     */
    const handleUserToggle = useCallback(
      (user: UserSearchResultType) => {
        if (disabled) return;

        setSelectedUsers(prev => {
          const newSet = new Set(prev);
          if (newSet.has(user._id)) {
            newSet.delete(user._id);
          } else {
            newSet.add(user._id);
          }
          return newSet;
        });
        onUserToggle?.(user);
      },
      [disabled, onUserToggle]
    );

    /**
     * Handles clearing the search
     */
    const handleClearSearch = useCallback(() => {
      setQuery('');
      clearResults();
      setSelectedUsers(new Set());
    }, [setQuery, clearResults]);

    /**
     * Handles manual search trigger
     */
    const handleSearch = useCallback(() => {
      if (query.trim()) {
        search(query);
      }
    }, [query, search]);

    /**
     * Handles "Select All" functionality
     */
    const handleSelectAll = useCallback(() => {
      if (disabled) return;

      const allUserIds = new Set(results.map(user => user._id));
      setSelectedUsers(allUserIds);
      onUserSelect?.(results);
    }, [disabled, results, onUserSelect]);

    /**
     * Handles "Clear Selection" functionality
     */
    const handleClearSelection = useCallback(() => {
      if (disabled) return;

      setSelectedUsers(new Set());
      onUserSelect?.([]);
    }, [disabled, onUserSelect]);

    /**
     * Handles Enter key press in search input
     */
    const handleKeyPress = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSearch();
        }
      },
      [handleSearch]
    );

    const displayResults = showLoadMore || typeof maxResults !== 'number' ? results : results.slice(0, maxResults);
    const hasSelection = selectedUsers.size > 0;

    return (
      <Card className={`w-full ${className}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5" />
              Search Users
            </CardTitle>
            {hasSelection && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{selectedUsers.size} selected</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                  disabled={disabled}
                  className="h-auto p-1"
                >
                  Clear
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={disabled}
                className="pl-10 pr-10"
              />
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSearch}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-auto p-1"
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button
              onClick={handleSearch}
              disabled={disabled || !query.trim()}
              className="flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Search'
              )}
            </Button>
          </div>

          {/* Results Summary */}
          {query && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {totalCount > 0
                  ? `Found ${totalCount} user${totalCount !== 1 ? 's' : ''}`
                  : 'No users found'}
              </span>
              {results.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  disabled={disabled}
                  className="h-auto p-1 text-xs"
                >
                  Select All
                </Button>
              )}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Results List */}
          {displayResults.length > 0 && (
            <div className="max-h-96 overflow-y-auto space-y-2">
              {displayResults.map(user => (
                <UserSearchResult
                  key={user._id}
                  user={user}
                  isSelected={selectedUsers.has(user._id)}
                  isSelectable={!disabled}
                  onToggleSelection={handleUserToggle}
                />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {showLoadMore && hasMore && displayResults.length > 0 && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={disabled || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  `Load More Users`
                )}
              </Button>
            </div>
          )}

          {/* Empty State */}
          {query && !isLoading && displayResults.length === 0 && !error && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">
                No users found matching &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs mt-1">Try adjusting your search terms</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

UserSearch.displayName = 'UserSearch';
