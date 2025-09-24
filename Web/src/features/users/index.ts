/**
 * Users Feature Module
 *
 * Exports all user-related functionality including search capabilities,
 * types, services, components, and hooks for user discovery and management.
 */

// Export all types
export type {
  SearchFilters,
  SearchResponse,
  SearchError,
  SearchServiceConfig,
  SearchState,
} from './types';

export { SearchErrorType } from './types';

// Export search service and utilities
export {
  UserSearchService,
  userSearchService,
  searchUsers,
  createUserSearchService,
} from './services/userSearchService';

// Export custom hooks
export { useUserSearch } from './hooks/useUserSearch';

// Export components
export { UserSearch } from './components/UserSearch';
export { UserSearchResult } from './components/UserSearchResult';

// Re-export commonly used types for convenience
export type { UserSearchResult as User } from './types';