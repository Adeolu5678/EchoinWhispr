/**
 * User search result interface
 * Represents a user that can be returned from search operations
 */
export interface UserSearchResult {
  /** Unique user identifier */
  _id: string;
  /** Clerk authentication identifier */
  clerkId: string;
  /** User's display username */
  username: string;
  /** User's email address */
  email: string;
  /** User's first name (optional) */
  firstName?: string;
  /** User's last name (optional) */
  lastName?: string;
  /** Account creation timestamp */
  createdAt: number;
  /** Last update timestamp */
  updatedAt: number;
}

/**
 * Search filters for user discovery
 * Defines criteria for filtering search results
 */
export interface SearchFilters {
  /** Search query string (username or email) */
  query: string;
  /** Maximum number of results to return */
  limit?: number;
  /** Number of results to skip for pagination */
  offset?: number;
}

/**
 * Search response interface
 * Contains search results and metadata
 */
export interface SearchResponse {
  /** Array of user search results */
  results: UserSearchResult[];
  /** Total number of matching users (before pagination) */
  totalCount: number;
  /** Whether there are more results available */
  hasMore: boolean;
}

/**
 * Search error types
 * Defines possible error conditions during search operations
 */
export enum SearchErrorType {
  /** User is not authenticated */
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  /** Search query is invalid or malformed */
  INVALID_QUERY = 'INVALID_QUERY',
  /** Search operation failed due to server error */
  SERVER_ERROR = 'SERVER_ERROR',
  /** No users found matching the search criteria */
  NO_RESULTS = 'NO_RESULTS',
}

/**
 * Search error interface
 * Contains error information for failed search operations
 */
export interface SearchError {
  /** Error type classification */
  type: SearchErrorType;
  /** Human-readable error message */
  message: string;
  /** Additional error context (optional) */
  context?: Record<string, unknown>;
}

/**
 * Search service configuration
 * Configuration options for the search service
 */
export interface SearchServiceConfig {
  /** Default search result limit */
  defaultLimit: number;
  /** Maximum allowed search result limit */
  maxLimit: number;
  /** Minimum query length for search */
  minQueryLength: number;
  /** Search debounce delay in milliseconds */
  debounceDelay: number;
}

/**
 * Search state for UI components
 * Tracks the current state of search operations
 */
export interface SearchState {
  /** Current search query */
  query: string;
  /** Search results */
  results: UserSearchResult[];
  /** Whether a search is currently in progress */
  isLoading: boolean;
  /** Current error state (null if no error) */
  error: SearchError | null;
  /** Whether there are more results available */
  hasMore: boolean;
  /** Total number of matching results */
  totalCount: number;
}
