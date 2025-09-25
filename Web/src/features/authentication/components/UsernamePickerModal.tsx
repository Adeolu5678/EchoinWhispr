'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useMutation } from 'convex/react'
import { api } from '@/lib/convex'
import { useToast } from '@/hooks/use-toast'
import { useUsernameValidation } from '../hooks/useUsernameValidation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { CheckCircle, XCircle, Loader2, User } from 'lucide-react'

/**
 * Interface representing the props for the UsernamePickerModal component
 */
export interface UsernamePickerModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean
  /**
   * Callback function called when the modal should be closed
   */
  onClose: () => void
  /**
   * Callback function called when username selection is successful
   */
  onSuccess?: () => void
}

/**
 * UsernamePickerModal component for selecting a unique username after account creation
 *
 * Features:
 * - Real-time username validation with visual feedback
 * - Debounced validation to prevent excessive API calls
 * - Purple theme styling consistent with the app design
 * - Responsive design with proper accessibility
 * - Loading states and error handling
 *
 * @param props - The component props
 * @returns JSX.Element
 */
export function UsernamePickerModal({ isOpen, onClose, onSuccess }: UsernamePickerModalProps): JSX.Element | null {
  // Clerk user data
  const { user } = useUser()
  const { toast } = useToast()

  // Username validation hook
  const {
    status,
    errorMessage,
    isValid,
    isAvailable,
    validateUsername,
    clearValidation,
    debouncedUsername,
    isDebouncing,
  } = useUsernameValidation()

  // Local state for form handling
  const [username, setUsername] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Convex mutation for updating user profile
  const updateUserProfile = useMutation(api.users.updateUserProfile)
  const updateUsername = useMutation(api.users.updateUsername)

  /**
   * Handle username input changes
   * Updates local state and triggers validation
   */
  const handleUsernameChange = (value: string) => {
    setUsername(value)
    validateUsername(value)
  }

  /**
   * Handle form submission
   * Updates the user's username in the database
   */
  const handleSubmit = async () => {
    if (!isValid || !user || !username.trim()) {
      return
    }

    try {
      setIsSubmitting(true)

      // Update user username
      await updateUsername({
        username: username.trim(),
      })

      toast({
        title: 'Username set successfully!',
        description: `Welcome to EchoinWhispr, @${username}!`,
      })

      // Call success callback if provided
      onSuccess?.()

      // Close modal
      handleClose()
    } catch (error) {
      console.error('Error updating username:', error)
      toast({
        title: 'Error setting username',
        description: 'There was an issue setting your username. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Handle modal close
   * Clears validation state and calls onClose callback
   */
  const handleClose = () => {
    clearValidation()
    setUsername('')
    onClose()
  }

  /**
   * Get validation icon based on current status
   */
  const getValidationIcon = () => {
    if (isDebouncing || status === 'validating') {
      return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
    }

    if (status === 'available' && isValid) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }

    if (status === 'unavailable' || status === 'invalid') {
      return <XCircle className="h-4 w-4 text-red-500" />
    }

    return null
  }

  /**
   * Get validation message based on current status
   */
  const getValidationMessage = () => {
    if (isDebouncing || status === 'validating') {
      return 'Checking availability...'
    }

    if (errorMessage) {
      return errorMessage
    }

    if (status === 'available' && isValid) {
      return 'Username is available!'
    }

    if (status === 'unavailable') {
      return 'Username is already taken'
    }

    return ''
  }

  /**
   * Get input styling based on validation status
   */
  const getInputStyling = () => {
    const baseClasses = 'pr-10 transition-colors'

    if (status === 'available' && isValid) {
      return `${baseClasses} border-green-500 focus:border-green-500`
    }

    if (status === 'unavailable' || status === 'invalid') {
      return `${baseClasses} border-red-500 focus:border-red-500`
    }

    return baseClasses
  }

  /**
   * Get submit button styling and disabled state
   */
  const getSubmitButtonProps = () => {
    const isDisabled = !isValid || isSubmitting || isDebouncing || !username.trim()

    return {
      disabled: isDisabled,
      className: isDisabled
        ? 'bg-muted text-muted-foreground cursor-not-allowed'
        : 'bg-primary hover:bg-primary/90 text-primary-foreground',
    }
  }

  // Don't render if modal is not open
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <Card className="relative w-full max-w-md mx-4 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">
                Choose your username
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Pick a unique username for your EchoinWhispr account
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Username Input */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              Username
            </Label>
            <div className="relative">
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                className={getInputStyling()}
                maxLength={20}
                autoComplete="username"
                aria-describedby="username-validation"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {getValidationIcon()}
              </div>
            </div>

            {/* Validation Message */}
            <div
              id="username-validation"
              className={`text-sm transition-colors ${
                status === 'available' && isValid
                  ? 'text-green-600'
                  : status === 'unavailable' || status === 'invalid'
                  ? 'text-red-600'
                  : 'text-muted-foreground'
              }`}
            >
              {getValidationMessage()}
            </div>
          </div>

          {/* Username Rules */}
          <div className="rounded-lg bg-muted/50 p-3">
            <h4 className="text-sm font-medium mb-2">Username rules:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• 3-20 characters long</li>
              <li>• Only lowercase letters, numbers, and underscores</li>
              <li>• Must be unique across all users</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Skip for now
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={getSubmitButtonProps().disabled}
              className={`flex-1 ${getSubmitButtonProps().className}`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting...
                </>
              ) : (
                'Set username'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}