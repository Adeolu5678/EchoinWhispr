'use client'

import { memo, useCallback } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check, User } from 'lucide-react'
import type { UserSearchResult as UserSearchResultType } from '../types'

/**
 * Props for the UserSearchResult component
 */
interface UserSearchResultProps {
  /** User data to display */
  user: UserSearchResultType
  /** Whether this user is currently selected */
  isSelected?: boolean
  /** Whether this user can be selected */
  isSelectable?: boolean
  /** Callback when user is selected/deselected */
  onToggleSelection?: (user: UserSearchResultType) => void
  /** Additional CSS classes */
  className?: string
}

/**
 * Individual user search result component
 *
 * Displays user information in a card format with optional selection functionality.
 * Used within search result lists to show individual users that can be selected
 * as whisper recipients.
 *
 * @param props - Component props
 * @returns JSX element representing a user search result
 *
 * @example
 * ```tsx
 * <UserSearchResult
 *   user={userData}
 *   isSelected={selectedUsers.includes(userData._id)}
 *   onToggleSelection={(user) => toggleUserSelection(user)}
 * />
 * ```
 */
export const UserSearchResult = memo<UserSearchResultProps>(({
  user,
  isSelected = false,
  isSelectable = true,
  onToggleSelection,
  className = '',
}) => {
  /**
   * Handles user selection toggle
   */
  const handleToggleSelection = useCallback(() => {
    if (isSelectable && onToggleSelection) {
      onToggleSelection(user)
    }
  }, [isSelectable, onToggleSelection, user])

  /**
   * Generates user initials for avatar fallback
   */
  const getUserInitials = useCallback((
    username: string,
    firstName?: string,
    lastName?: string
  ) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }
    return username.charAt(0).toUpperCase()
  }, [])

  /**
   * Formats the user's display name
   */
  const getDisplayName = useCallback((
    username: string,
    firstName?: string,
    lastName?: string
  ) => {
    if (firstName && lastName) {
      return `${firstName} ${lastName}`
    }
    return username
  }, [])

  const displayName = getDisplayName(user.username, user.firstName, user.lastName)
  const initials = getUserInitials(user.username, user.firstName, user.lastName)

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
      } ${className}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          {/* User Info Section */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
                alt={`${displayName}'s avatar`}
              />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm text-foreground truncate">
                  {displayName}
                </h3>
                {isSelected && (
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                )}
              </div>

              <div className="flex items-center gap-2 mt-1">
                <User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <p className="text-xs text-muted-foreground truncate">
                  @{user.username}
                </p>
              </div>

              {user.email && (
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {user.email}
                </p>
              )}
            </div>
          </div>

          {/* Selection Button */}
          {isSelectable && onToggleSelection && (
            <Button
              type="button"
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              onClick={handleToggleSelection}
              className="flex-shrink-0"
              aria-label={isSelected ? `Deselect ${displayName}` : `Select ${displayName}`}
            >
              {isSelected ? 'Selected' : 'Select'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
})

UserSearchResult.displayName = 'UserSearchResult'