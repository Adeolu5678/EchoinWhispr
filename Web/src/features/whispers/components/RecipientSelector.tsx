'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Users, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useUserSearch } from '@/features/users/hooks/useUserSearch';
import { UserSearchResult } from '@/features/users/types';

interface RecipientSelectorProps {
  selectedRecipient: UserSearchResult | null;
  onRecipientSelect: (recipient: UserSearchResult) => void;
}

export const RecipientSelector = ({
  selectedRecipient,
  onRecipientSelect,
}: RecipientSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { query, results, isLoading, setQuery } = useUserSearch();

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectRecipient = (user: UserSearchResult) => {
    onRecipientSelect(user);
    setIsOpen(false);
    setQuery(''); // Clear search
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="relative w-full">
      {/* Main Button Container */}
      <div className="flex gap-2">
        {/* Non-clickable recipient display button */}
        <Button
          type="button"
          variant="outline"
          className="flex-1 justify-start bg-purple-50 border-purple-200 text-purple-900 hover:bg-purple-100 cursor-default"
          disabled
        >
          <Users className="w-4 h-4 mr-2" />
          {selectedRecipient ? selectedRecipient.username : 'Select Recipient'}
        </Button>

        {/* Dropdown toggle button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleToggleDropdown}
          className="px-3 bg-purple-600 border-purple-600 text-white hover:bg-purple-700"
        >
          {isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Dropdown Popup */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border-purple-200 shadow-lg">
          <CardContent className="p-4">
            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search users by username..."
                value={query}
                onChange={handleSearchChange}
                className="pl-10"
                autoFocus
              />
            </div>

            {/* Results */}
            {isLoading ? (
              <div className="text-center text-purple-600 py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-2"></div>
                Searching users...
              </div>
            ) : results.length === 0 && query.trim() ? (
              <div className="text-center text-gray-500 py-4">
                <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                No users found
              </div>
            ) : results.length > 0 ? (
              <div className="max-h-48 overflow-y-auto">
                {results.map(user => (
                  <button
                    key={user._id}
                    onClick={() => handleSelectRecipient(user)}
                    className="w-full px-3 py-2 text-left hover:bg-purple-50 border-b border-gray-100 last:border-b-0 transition-colors rounded"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-purple-600 font-medium text-sm">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-gray-900">{user.username}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : query.trim() === '' ? (
              <div className="text-center text-gray-500 py-4">
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                Start typing to search users
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};
