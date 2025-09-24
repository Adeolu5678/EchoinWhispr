/**
 * User Search Service
 *
 * Handles user search operations with proper error handling and validation.
 * Integrates with Convex backend for secure user discovery functionality.
 */

import type {
  UserSearchResult,
  SearchFilters,
  SearchResponse,
  SearchError,
  SearchServiceConfig
} from '../types';
import { SearchErrorType } from '../types';

/**
 * Default configuration for the user search service
 */
const DEFAULT_CONFIG: SearchServiceConfig = {
  defaultLimit: 20,
  maxLimit: 50,
  minQueryLength: 2,
  debounceDelay: 300,
};

/**
 * User Search Service Class
 *
 * Provides methods for searching users with comprehensive error handling,
 * caching, and validation. Integrates with Convex backend for secure queries.
 */
export class UserSearchService {
  private config: SearchServiceConfig;
  private searchCache = new Map<string, { results: UserSearchResult[]; timestamp: number }>();
  private readonly CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

  constructor(config: Partial<SearchServiceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Searches for users based on the provided query and filters
   *
   * @param query - The search query string (username or email)
   * @param filters - Optional search filters
   * @returns Promise resolving to search results
   * @throws SearchError if validation fails or search operation encounters an error
   */
  async searchUsers(
    query: string,
    filters: SearchFilters = { query: '' }
  ): Promise<SearchResponse> {
    try {
      // Validate input
      this.validateSearchInput(query);

      // Check cache first
      const cacheKey = this.generateCacheKey(query, filters);
      const cachedResult = this.getCachedResult(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      // Perform search with retry logic
      const results = await this.performSearchWithRetry(query, filters);

      // Cache successful results
      this.setCacheResult(cacheKey, results);

      return {
        results,
        totalCount: results.length,
        hasMore: results.length >= (filters.limit || this.config.defaultLimit),
      };
    } catch (error) {
      console.error('User search error:', error);
      throw this.handleSearchError(error, query);
    }
  }

  /**
   * Clears the search cache
   */
  clearCache(): void {
    this.searchCache.clear();
  }

  /**
   * Gets the current service configuration
   */
  getConfig(): SearchServiceConfig {
    return { ...this.config };
  }

  /**
   * Updates the service configuration
   */
  updateConfig(newConfig: Partial<SearchServiceConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Validates the search input
   */
  private validateSearchInput(query: string): void {
    if (!query || typeof query !== 'string') {
      throw new Error('Search query must be a non-empty string');
    }

    if (query.trim().length < this.config.minQueryLength) {
      throw new Error(
        `Search query must be at least ${this.config.minQueryLength} characters long`
      );
    }

    if (query.length > 100) {
      throw new Error('Search query must be less than 100 characters long');
    }
  }

  /**
   * Performs the actual search with retry logic
   */
  private async performSearchWithRetry(
    query: string,
    filters: SearchFilters
  ): Promise<UserSearchResult[]> {
    let lastError: Error;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        return await this.performSearch(query, filters);
      } catch (error) {
        lastError = error as Error;
        console.warn(`Search attempt ${attempt} failed:`, error);

        if (attempt < 3) {
          await this.delay(1000 * attempt);
        }
      }
    }

    throw lastError!;
  }

  /**
   * Performs the actual search operation
   */
  private async performSearch(
    query: string,
    filters: SearchFilters
  ): Promise<UserSearchResult[]> {
    const searchQuery = query.trim();

    // Call Convex search function
    const results = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: searchQuery,
        limit: filters.limit || this.config.defaultLimit,
        offset: filters.offset || 0,
      }),
    }).then(res => res.json());

    // Transform results to match our interface
    return results.map((user: {
      _id: string;
      clerkId?: string;
      username: string;
      email: string;
      firstName?: string;
      lastName?: string;
      _creationTime?: number;
    }): UserSearchResult => ({
      _id: user._id,
      clerkId: user.clerkId || '',
      username: user.username,
      email: user.email,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      createdAt: user._creationTime || Date.now(),
      updatedAt: user._creationTime || Date.now(),
    }));
  }

  /**
   * Generates a cache key for the search query and filters
   */
  private generateCacheKey(query: string, filters: SearchFilters): string {
    return `${query.trim().toLowerCase()}-${JSON.stringify(filters)}`;
  }

  /**
   * Gets cached search results if still valid
   */
  private getCachedResult(cacheKey: string): SearchResponse | null {
    const cached = this.searchCache.get(cacheKey);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.CACHE_DURATION_MS) {
      this.searchCache.delete(cacheKey);
      return null;
    }

    return {
      results: cached.results,
      totalCount: cached.results.length,
      hasMore: false,
    };
  }

  /**
   * Caches search results
   */
  private setCacheResult(cacheKey: string, results: UserSearchResult[]): void {
    // Limit cache size to prevent memory issues
    if (this.searchCache.size >= 100) {
      const firstKey = this.searchCache.keys().next().value;
      if (firstKey) {
        this.searchCache.delete(firstKey);
      }
    }

    this.searchCache.set(cacheKey, {
      results,
      timestamp: Date.now(),
    });
  }

  /**
   * Handles search errors and converts them to SearchError
   */
  private handleSearchError(error: unknown, query: string): SearchError {
    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes('must be at least')) {
        return {
          type: SearchErrorType.INVALID_QUERY,
          message: error.message,
          context: { query },
        };
      }

      if (error.message.includes('network') || error.message.includes('fetch')) {
        return {
          type: SearchErrorType.SERVER_ERROR,
          message: 'Network error occurred. Please check your connection and try again.',
          context: { query },
        };
      }

      // Generic error
      return {
        type: SearchErrorType.SERVER_ERROR,
        message: 'An error occurred while searching. Please try again.',
        context: { query },
      };
    }

    // Unknown error type
    return {
      type: SearchErrorType.SERVER_ERROR,
      message: 'An unexpected error occurred. Please try again.',
      context: { query },
    };
  }

  /**
   * Utility method for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Default instance of the user search service
 */
export const userSearchService = new UserSearchService();

/**
 * Hook-friendly search function for React components
 */
export const searchUsers = async (
  query: string,
  filters: SearchFilters = { query: '' },
  config?: Partial<SearchServiceConfig>
): Promise<SearchResponse> => {
  const service = config ? new UserSearchService(config) : userSearchService;
  return service.searchUsers(query, filters);
};

/**
 * Utility function to create a custom search service instance
 */
export const createUserSearchService = (
  config: Partial<SearchServiceConfig> = {}
): UserSearchService => {
  return new UserSearchService(config);
};