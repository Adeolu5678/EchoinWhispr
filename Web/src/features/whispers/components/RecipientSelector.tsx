'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useFriendsList } from '../hooks/useFriendsList'
import type { Doc } from '../../../../../Convex/convex/_generated/dataModel'

interface RecipientSelectorProps {
  selectedRecipient: Doc<'users'> | null
  onRecipientSelect: (recipient: Doc<'users'>) => void
}

export const RecipientSelector = ({
  selectedRecipient,
  onRecipientSelect,
}: RecipientSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { friends, isLoading } = useFriendsList()

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleSelectRecipient = (friend: Doc<'users'>) => {
    onRecipientSelect(friend)
    setIsOpen(false)
  }

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
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>

      {/* Dropdown Popup */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border-purple-200 shadow-lg">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center text-purple-600">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-2"></div>
                Loading friends...
              </div>
            ) : friends.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                No friends found
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto">
                {friends.map((friend) => (
                  <button
                    key={friend._id}
                    onClick={() => handleSelectRecipient(friend)}
                    className="w-full px-4 py-3 text-left hover:bg-purple-50 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-purple-600 font-medium text-sm">
                          {friend.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-gray-900">{friend.username}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}