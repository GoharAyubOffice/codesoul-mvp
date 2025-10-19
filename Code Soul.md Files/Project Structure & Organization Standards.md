Project Structure & Organization Standards
Table of Contents
Complete Folder Structure
File Naming Conventions
Import/Export Patterns
Code Organization Rules
Component Architecture
Asset Management
Configuration Files
Development Workflow

Complete Folder Structure
🏗️ Root Level Structure
MyMVPApp/
├── src/                          # All source code
├── assets/                       # Static assets
├── docs/                         # Documentation
├── __tests__/                    # Test files
├── .expo/                        # Expo configuration
├── node_modules/                 # Dependencies
├── .env                          # Environment variables
├── .gitignore                    # Git ignore rules
├── app.json                      # Expo app configuration
├── eas.json                      # EAS build configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js            # Tailwind configuration
└── README.md                     # Project documentation

📁 src/ Directory Structure
src/
├── components/                   # Reusable UI components
│   ├── ui/                       # Basic UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Loading.tsx
│   │   ├── Error.tsx
│   │   └── index.ts              # Barrel exports
│   ├── forms/                    # Form-specific components
│   │   ├── LoginForm.tsx
│   │   ├── ProfileForm.tsx
│   │   └── index.ts
│   ├── lists/                    # List-related components
│   │   ├── ItemList.tsx
│   │   ├── ListItem.tsx
│   │   └── index.ts
│   └── common/                   # Common components
│       ├── Header.tsx
│       ├── TabBar.tsx
│       └── index.ts
├── screens/                      # Screen components
│   ├── auth/                     # Authentication screens
│   │   ├── LoginScreen.tsx
│   │   ├── SignupScreen.tsx
│   │   ├── ForgotPasswordScreen.tsx
│   │   └── index.ts
│   ├── main/                     # Main app screens
│   │   ├── HomeScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── index.ts
│   ├── features/                 # Feature-specific screens
│   │   ├── posts/
│   │   │   ├── PostListScreen.tsx
│   │   │   ├── PostDetailScreen.tsx
│   │   │   ├── CreatePostScreen.tsx
│   │   │   └── index.ts
│   │   └── chat/
│   │       ├── ChatListScreen.tsx
│   │       ├── ChatScreen.tsx
│   │       └── index.ts
│   └── index.ts
├── hooks/                        # Custom React hooks
│   ├── auth/                     # Authentication hooks
│   │   ├── useAuth.ts
│   │   ├── useProfile.ts
│   │   └── index.ts
│   ├── data/                     # Data fetching hooks
│   │   ├── usePosts.ts
│   │   ├── useUsers.ts
│   │   ├── useCRUD.ts
│   │   └── index.ts
│   ├── ui/                       # UI-related hooks
│   │   ├── useKeyboard.ts
│   │   ├── useOrientation.ts
│   │   └── index.ts
│   └── index.ts
├── store/                        # State management
│   ├── slices/                   # State slices (if using Redux)
│   │   ├── authSlice.ts
│   │   ├── appSlice.ts
│   │   └── index.ts
│   ├── stores/                   # Zustand stores
│   │   ├── authStore.ts
│   │   ├── appStore.ts
│   │   └── index.ts
│   └── index.ts
├── services/                     # External services and APIs
│   ├── api/                      # API layer
│   │   ├── client.ts             # Base API client
│   │   ├── auth.ts               # Auth API calls
│   │   ├── posts.ts              # Posts API calls
│   │   └── index.ts
│   ├── storage/                  # Local storage utilities
│   │   ├── secureStorage.ts
│   │   ├── cache.ts
│   │   └── index.ts
│   ├── notifications/            # Push notifications
│   │   ├── pushNotifications.ts
│   │   └── index.ts
│   └── index.ts
├── navigation/                   # Navigation configuration
│   ├── AppNavigator.tsx          # Main navigation
│   ├── AuthNavigator.tsx         # Auth navigation
│   ├── TabNavigator.tsx          # Tab navigation
│   ├── types.ts                  # Navigation types
│   └── index.ts
├── utils/                        # Utility functions
│   ├── helpers/                  # General helpers
│   │   ├── dateUtils.ts
│   │   ├── stringUtils.ts
│   │   ├── arrayUtils.ts
│   │   └── index.ts
│   ├── validation/               # Validation schemas
│   │   ├── authValidation.ts
│   │   ├── postValidation.ts
│   │   └── index.ts
│   ├── constants/                # App constants
│   │   ├── colors.ts
│   │   ├── sizes.ts
│   │   ├── api.ts
│   │   └── index.ts
│   └── index.ts
├── types/                        # TypeScript type definitions
│   ├── api.ts                    # API response types
│   ├── database.ts               # Database types
│   ├── navigation.ts             # Navigation types
│   ├── user.ts                   # User-related types
│   └── index.ts
├── styles/                       # Style-related files
│   ├── theme/                    # Theme configuration
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── index.ts
│   ├── components/               # Component-specific styles
│   │   └── index.ts
│   └── index.ts
├── lib/                          # Third-party lib configurations
│   ├── supabase.ts               # Supabase client
│   ├── queryClient.ts            # React Query client
│   ├── analytics.ts              # Analytics setup
│   └── index.ts
└── App.tsx                       # Root app component

📱 assets/ Directory Structure
assets/
├── images/                       # Image assets
│   ├── icons/                    # App icons
│   │   ├── icon.png              # App icon
│   │   ├── adaptive-icon.png     # Android adaptive icon
│   │   └── favicon.png           # Web favicon
│   ├── splash/                   # Splash screens
│   │   └── splash.png
│   ├── illustrations/            # Illustrations
│   │   ├── onboarding-1.png
│   │   ├── onboarding-2.png
│   │   └── empty-state.png
│   └── placeholders/             # Placeholder images
│       ├── avatar-placeholder.png
│       └── image-placeholder.png
├── fonts/                        # Custom fonts
│   ├── Inter-Regular.ttf
│   ├── Inter-Bold.ttf
│   └── Inter-SemiBold.ttf
└── data/                         # Static data files
    ├── countries.json
    └── sample-data.json


File Naming Conventions
📝 File Naming Rules
const namingConventions = {
  // Component files
  components: {
    format: 'PascalCase.tsx',
    examples: [
      'Button.tsx',
      'UserProfile.tsx',
      'PostListItem.tsx',
      'NavigationHeader.tsx'
    ],
    rule: 'Match the component name exactly'
  },
  
  // Screen files
  screens: {
    format: 'PascalCaseScreen.tsx',
    examples: [
      'HomeScreen.tsx',
      'LoginScreen.tsx',
      'PostDetailScreen.tsx',
      'UserProfileScreen.tsx'
    ],
    rule: 'Always end with "Screen"'
  },
  
  // Hook files
  hooks: {
    format: 'useCamelCase.ts',
    examples: [
      'useAuth.ts',
      'useLocalStorage.ts',
      'useApiCall.ts',
      'useKeyboardHeight.ts'
    ],
    rule: 'Always start with "use"'
  },
  
  // Utility files
  utils: {
    format: 'camelCase.ts',
    examples: [
      'dateUtils.ts',
      'apiHelpers.ts',
      'stringFormatter.ts',
      'validationRules.ts'
    ],
    rule: 'Descriptive camelCase'
  },
  
  // Type files
  types: {
    format: 'camelCase.ts',
    examples: [
      'api.ts',
      'user.ts',
      'database.ts',
      'navigation.ts'
    ],
    rule: 'Domain-based naming'
  },
  
  // Constant files
  constants: {
    format: 'UPPER_CASE.ts or camelCase.ts',
    examples: [
      'API_ENDPOINTS.ts',
      'colors.ts',
      'dimensions.ts',
      'appConfig.ts'
    ],
    rule: 'UPPER_CASE for pure constants, camelCase for objects'
  },
  
  // Test files
  tests: {
    format: 'ComponentName.test.tsx',
    examples: [
      'Button.test.tsx',
      'useAuth.test.ts',
      'apiHelpers.test.ts',
      'LoginScreen.test.tsx'
    ],
    rule: 'Mirror the source file name + .test'
  }
}

🏷️ Variable and Function Naming
const codingConventions = {
  // Variables
  variables: {
    format: 'camelCase',
    examples: {
      good: ['userName', 'isLoading', 'userProfileData', 'apiResponse'],
      bad: ['username', 'IsLoading', 'user_profile_data', 'api_response']
    }
  },
  
  // Functions
  functions: {
    format: 'camelCase with verb',
    examples: {
      good: ['handleSubmit', 'fetchUserData', 'validateEmail', 'calculateTotal'],
      bad: ['submit', 'userData', 'email', 'total']
    }
  },
  
  // Component props
  props: {
    format: 'camelCase',
    examples: {
      good: ['onPress', 'isVisible', 'defaultValue', 'errorMessage'],
      bad: ['onClick', 'visible', 'value', 'error']
    }
  },
  
  // Event handlers
  eventHandlers: {
    format: 'handle + Action',
    examples: {
      good: ['handlePress', 'handleSubmit', 'handleTextChange', 'handleModalClose'],
      bad: ['onPress', 'submit', 'textChange', 'close']
    }
  },
  
  // Boolean variables
  booleans: {
    format: 'is/has/should/can + Description',
    examples: {
      good: ['isLoading', 'hasError', 'shouldRender', 'canEdit'],
      bad: ['loading', 'error', 'render', 'edit']
    }
  },
  
  // Constants
  constants: {
    format: 'UPPER_SNAKE_CASE',
    examples: {
      good: ['API_BASE_URL', 'MAX_RETRY_ATTEMPTS', 'DEFAULT_TIMEOUT'],
      bad: ['apiBaseUrl', 'maxRetryAttempts', 'defaultTimeout']
    }
  }
}


Import/Export Patterns
📥 Import Organization
// ✅ CORRECT: Import order and grouping
// 1. React and React Native core
import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, ScrollView, Alert } from 'react-native'

// 2. Third-party libraries (alphabetical)
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { SafeAreaView } from 'react-native-safe-area-context'

// 3. Internal utilities and configuration
import { supabase } from '@/lib/supabase'
import { queryClient } from '@/lib/queryClient'

// 4. Stores and state management
import { useAuthStore } from '@/store/authStore'
import { useAppStore } from '@/store/appStore'

// 5. Hooks (custom hooks)
import { useAuth } from '@/hooks/auth/useAuth'
import { usePosts } from '@/hooks/data/usePosts'

// 6. Components (from most generic to most specific)
import { Button, Input, Card } from '@/components/ui'
import { PostList } from '@/components/lists'
import { Header } from '@/components/common'

// 7. Types
import type { User, Post, ApiResponse } from '@/types'

// 8. Constants and utilities
import { colors, spacing } from '@/styles/theme'
import { validateEmail, formatDate } from '@/utils/helpers'

// ❌ INCORRECT: Mixed imports, no grouping
import { formatDate } from '@/utils/helpers'
import React, { useState } from 'react'
import { Button } from '@/components/ui'
import { View } from 'react-native'
import type { User } from '@/types'
import { useAuth } from '@/hooks/auth/useAuth'

📤 Export Patterns
// ✅ CORRECT: Default export for main component
// components/ui/Button.tsx
import React from 'react'
import { TouchableOpacity, Text } from 'react-native'

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary'
}

const Button = ({ title, onPress, variant = 'primary' }: ButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  )
}

export default Button

// ✅ CORRECT: Named exports for utilities
// utils/helpers/dateUtils.ts
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString()
}

export const isToday = (date: Date): boolean => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// ✅ CORRECT: Barrel exports for clean imports
// components/ui/index.ts
export { default as Button } from './Button'
export { default as Input } from './Input'
export { default as Card } from './Card'
export { default as Loading } from './Loading'
export { default as Error } from './Error'

// This allows: import { Button, Input, Card } from '@/components/ui'

// ✅ CORRECT: Type-only exports
// types/user.ts
export interface User {
  id: string
  email: string
  name: string
}

export interface UserProfile extends User {
  avatar?: string
  bio?: string
}

export type UserRole = 'admin' | 'user' | 'guest'

🔄 Re-export Patterns
// ✅ CORRECT: Clean re-exports for external libraries
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// Re-export commonly used types
export type { 
  User,
  Session,
  AuthError
} from '@supabase/supabase-js'

// ✅ CORRECT: Component re-exports
// components/index.ts
// UI Components
export * from './ui'

// Form Components  
export * from './forms'

// List Components
export * from './lists'

// Common Components
export * from './common'

// This allows: import { Button, LoginForm, PostList, Header } from '@/components'


Code Organization Rules
🏗️ Component Structure Template
// ✅ CORRECT: Standard component structure
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button } from '@/components/ui'
import { useAuth } from '@/hooks/auth'
import type { User } from '@/types'

// 1. TYPES AND INTERFACES (at top)
interface Props {
  user: User
  onUpdate: (user: User) => void
  isEditable?: boolean
}

interface FormData {
  name: string
  email: string
}

// 2. COMPONENT DEFINITION
const UserProfile = ({ user, onUpdate, isEditable = false }: Props) => {
  // 3. STATE HOOKS (grouped together)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: user.name,
    email: user.email,
  })
  const [loading, setLoading] = useState(false)

  // 4. CONTEXT/STORE HOOKS
  const { currentUser, updateUser } = useAuth()

  // 5. MEMOIZED VALUES
  const isCurrentUser = useMemo(() => 
    currentUser?.id === user.id, 
    [currentUser, user.id]
  )

  // 6. CALLBACK FUNCTIONS (grouped by purpose)
  const handleEdit = useCallback(() => {
    setIsEditing(true)
  }, [])

  const handleSave = useCallback(async () => {
    try {
      setLoading(true)
      await updateUser(user.id, formData)
      onUpdate({ ...user, ...formData })
      setIsEditing(false)
    } catch (error) {
      console.error('Update failed:', error)
    } finally {
      setLoading(false)
    }
  }, [user.id, formData, onUpdate, updateUser])

  const handleCancel = useCallback(() => {
    setFormData({ name: user.name, email: user.email })
    setIsEditing(false)
  }, [user.name, user.email])

  // 7. EFFECT HOOKS (at the end)
  useEffect(() => {
    // Update form data when user prop changes
    setFormData({ name: user.name, email: user.email })
  }, [user.name, user.email])

  // 8. EARLY RETURNS (if any)
  if (!user) {
    return <Text>No user data</Text>
  }

  // 9. RENDER
  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      
      {isEditing ? (
        // Edit mode UI
        <View style={styles.editContainer}>
          {/* Form inputs */}
          <Button 
            title={loading ? 'Saving...' : 'Save'} 
            onPress={handleSave}
            disabled={loading}
          />
          <Button title="Cancel" onPress={handleCancel} />
        </View>
      ) : (
        // View mode UI
        <View style={styles.viewContainer}>
          <Text>{user.name}</Text>
          <Text>{user.email}</Text>
          {isCurrentUser && isEditable && (
            <Button title="Edit" onPress={handleEdit} />
          )}
        </View>
      )}
    </View>
  )
}

// 10. STYLES (at bottom)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  editContainer: {
    // edit styles
  },
  viewContainer: {
    // view styles
  },
})

// 11. DEFAULT EXPORT
export default UserProfile

🔧 Hook Structure Template
// ✅ CORRECT: Custom hook structure
import { useState, useEffect, useCallback } from 'react'
import { Alert } from 'react-native'
import { supabase } from '@/lib/supabase'
import type { User, ApiError } from '@/types'

// 1. TYPES
interface UseAuthReturn {
  user: User | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

// 2. HOOK DEFINITION
export const useAuth = (): UseAuthReturn => {
  // 3. STATE
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 4. HELPER FUNCTIONS
  const handleError = useCallback((error: ApiError | Error) => {
    const message = error instanceof Error ? error.message : error.message
    setError(message)
    Alert.alert('Error', message)
  }, [])

  // 5. MAIN FUNCTIONS
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      setUser(data.user)
    } catch (err) {
      handleError(err as ApiError)
    } finally {
      setLoading(false)
    }
  }, [handleError])

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) throw error
      
      Alert.alert('Success', 'Check your email for verification')
    } catch (err) {
      handleError(err as ApiError)
    } finally {
      setLoading(false)
    }
  }, [handleError])

  const signOut = useCallback(async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
    } catch (err) {
      handleError(err as ApiError)
    } finally {
      setLoading(false)
    }
  }, [handleError])

  // 6. EFFECTS
  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (err) {
        handleError(err as ApiError)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [handleError])

  // 7. RETURN
  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
  }
}

📊 Utility Function Organization
// ✅ CORRECT: Utility file structure
// utils/helpers/dateUtils.ts

// 1. IMPORTS
import { format, parseISO, isValid } from 'date-fns'

// 2. TYPES
type DateFormat = 'short' | 'medium' | 'long' | 'full'

// 3. CONSTANTS
const DATE_FORMATS = {
  short: 'MM/dd/yyyy',
  medium: 'MMM dd, yyyy',
  long: 'MMMM dd, yyyy',
  full: 'EEEE, MMMM dd, yyyy',
} as const

// 4. PURE FUNCTIONS (no dependencies)
export const isValidDate = (date: unknown): date is Date => {
  return date instanceof Date && isValid(date)
}

export const parseDate = (dateString: string): Date | null => {
  try {
    const date = parseISO(dateString)
    return isValid(date) ? date : null
  } catch {
    return null
  }
}

// 5. HELPER FUNCTIONS (may use other functions)
export const formatDate = (
  date: Date | string,
  formatType: DateFormat = 'medium'
): string => {
  const dateObj = typeof date === 'string' ? parseDate(date) : date
  
  if (!dateObj || !isValidDate(dateObj)) {
    return 'Invalid date'
  }
  
  return format(dateObj, DATE_FORMATS[formatType])
}

// 6. COMPLEX FUNCTIONS
export const getRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseDate(date) : date
  
  if (!dateObj || !isValidDate(dateObj)) {
    return 'Invalid date'
  }
  
  const now = new Date()
  const diffInMs = now.getTime() - dateObj.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  return formatDate(dateObj, 'short')
}


Component Architecture
🏗️ Component Hierarchy Patterns
// ✅ CORRECT: Screen > Section > Component hierarchy

// 1. SCREEN LEVEL (Top level, manages navigation and overall state)
const PostListScreen = () => {
  const { posts, loading, error, refetch } = usePosts()
  const navigation = useNavigation()

  return (
    <SafeAreaView style={styles.container}>
      <PostListHeader onAdd={() => navigation.navigate('CreatePost')} />
      <PostListContent 
        posts={posts} 
        loading={loading} 
        error={error}
        onRefresh={refetch}
        onPostPress={(post) => navigation.navigate('PostDetail', { id: post.id })}
      />
    </SafeAreaView>
  )
}

// 2. SECTION LEVEL (Handles specific UI sections)
const PostListContent = ({ posts, loading, error, onRefresh, onPostPress }) => {
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} onRetry={onRefresh} />
  if (posts.length === 0) return <EmptyState />

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => (
        <PostListItem post={item} onPress={() => onPostPress(item)} />
      )}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
    />
  )
}

// 3. COMPONENT LEVEL (Reusable, focused components)
const PostListItem = ({ post, onPress }) => {
  return (
    <Card onPress={onPress}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.excerpt}>{post.excerpt}</Text>
      <Text style={styles.date}>{formatDate(post.created_at)}</Text>
    </Card>
  )
}

🔄 Container vs Presentation Pattern
// ✅ CORRECT: Separate business logic from presentation

// CONTAINER (Business logic)
const PostListContainer = () => {
  // All business logic here
  const { posts, loading, error, create, update, delete } = usePosts()
  const { user } = useAuth()
  const navigation = useNavigation()

  const handleCreatePost = useCallback(async (postData) => {
    try {
      await create({ ...postData, user_id: user.id })
      navigation.navigate('PostDetail', { id: result.id })
    } catch (error) {
      Alert.alert('Error', 'Failed to create post')
    }
  }, [create, user.id, navigation])

  const handlePostPress = useCallback((post) => {
    navigation.navigate('PostDetail', { id: post.id })
  }, [navigation])

  // Pass everything to presentation component
  return (
    <PostListPresentation
      posts={posts}
      loading={loading}
      error={error}
      onCreatePost={handleCreatePost}
      onPostPress={handlePostPress}
      canCreatePost={!!user}
    />
  )
}

// PRESENTATION (UI only)
const PostListPresentation = ({
  posts,
  loading,
  error,
  onCreatePost,
  onPostPress,
  canCreatePost,
}) => {
  // Only UI logic here
  return (
    <View style={styles.container}>
      <PostListHeader 
        onAdd={canCreatePost ? onCreatePost : undefined}
        showAddButton={canCreatePost}
      />
      
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {posts.length === 0 && !loading && <EmptyState />}
      
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <PostListItem post={item} onPress={() => onPostPress(item)} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  )
}

// Export the container as default
export default PostListContainer

🔧 Custom Hook Patterns
// ✅ CORRECT: Hook composition patterns

// 1. DATA HOOK (Pure data operations)
const usePostsData = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('posts').select('*')
      if (error) throw error
      return data
    },
  })
}

// 2. MUTATIONS HOOK (State-changing operations)
const usePostsMutations = () => {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: async (newPost) => {
      const { data, error } = await supabase
        .from('posts')
        .insert([newPost])
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  return {
    create: createMutation.mutate,
    isCreating: createMutation.isPending,
  }
}

// 3. COMPOSITE HOOK (Combines data + mutations)
export const usePosts = () => {
  const { data: posts = [], isLoading, error } = usePostsData()
  const { create, isCreating } = usePostsMutations()

  return {
    posts,
    loading: isLoading,
    error: error?.message,
    create,
    isCreating,
  }
}

// 4. UI STATE HOOK (UI-specific state management)
export const usePostListUI = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date')
  const [filterBy, setFilterBy] = useState<'all' | 'my-posts'>('all')

  const filteredPosts = useMemo(() => {
    // Filter and sort logic
  }, [posts, searchQuery, sortBy, filterBy])

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    filteredPosts,
  }
}


Asset Management
🖼️ Image Organization
// ✅ CORRECT: Centralized image index
// assets/images/index.ts

// App Icons
export const appIcons = {
  icon: require('./icons/icon.png'),
  adaptiveIcon: require('./icons/adaptive-icon.png'),
  favicon: require('./icons/favicon.png'),
} as const

// Splash Screens
export const splashImages = {
  splash: require('./splash/splash.png'),
} as const

// Illustrations
export const illustrations = {
  onboarding1: require('./illustrations/onboarding-1.png'),
  onboarding2: require('./illustrations/onboarding-2.png'),
  emptyState: require('./illustrations/empty-state.png'),
} as const

// Placeholders
export const placeholders = {
  avatar: require('./placeholders/avatar-placeholder.png'),
  image: require('./placeholders/image-placeholder.png'),
} as const

// All images
export const images = {
  ...appIcons,
  ...splashImages,
  ...illustrations,
  ...placeholders,
} as const

// Type for image keys
export type ImageKey = keyof typeof images

// ✅ CORRECT: Usage in components
import { images } from '@/assets/images'

const Avatar = ({ source, fallback = 'avatar' }) => {
  return (
    <Image
      source={source || images[fallback]}
      style={styles.avatar}
    />
  )
}

🎨 Icon Management
// ✅ CORRECT: Icon system with react-native-vector-icons
// components/ui/Icon.tsx

import React from 'react'
import VectorIcon from 'react-native-vector-icons/MaterialIcons'

// Define available icons
export type IconName = 
  | 'home'
  | 'user'
  | 'settings'
  | 'search'
  | 'add'
  | 'edit'
  | 'delete'
  | 'heart'
  | 'star'
  | 'menu'
  | 'back'
  | 'close'

interface IconProps {
  name: IconName
  size?: number
  color?: string
  style?: any
}

const Icon = ({ name, size = 24, color = '#000', style }: IconProps) => {
  return (
    <VectorIcon 
      name={name} 
      size={size} 
      color={color} 
      style={style}
    />
  )
}

export default Icon

// ✅ CORRECT: Usage with type safety
import { Icon } from '@/components/ui'

const HomeButton = () => (
  <TouchableOpacity>
    <Icon name="home" size={24} color="#007AFF" />
  </TouchableOpacity>
)

📁 Static Data Management
// ✅ CORRECT: Typed static data
// assets/data/countries.ts

export interface Country {
  code: string
  name: string
  flag: string
  dialCode: string
}

export const countries: Country[] = [
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    dialCode: '+1',
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    dialCode: '+44',
  },
  // ... more countries
]

export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find(country => country.code === code)
}

// assets/data/index.ts
export * from './countries'
export * from './sampleData'


Configuration Files
⚙️ Environment Configuration
// ✅ CORRECT: Environment setup
// .env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_API_BASE_URL=https://api.example.com
EXPO_PUBLIC_ENVIRONMENT=development

# .env.production
EXPO_PUBLIC_SUPABASE_URL=https://your-production-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
EXPO_PUBLIC_API_BASE_URL=https://api-production.example.com
EXPO_PUBLIC_ENVIRONMENT=production

// lib/config.ts
interface Config {
  supabase: {
    url: string
    anonKey: string
  }
  api: {
    baseUrl: string
  }
  app: {
    environment: 'development' | 'staging' | 'production'
    version: string
  }
}

const config: Config = {
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  },
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL!,
  },
  app: {
    environment: process.env.EXPO_PUBLIC_ENVIRONMENT as Config['app']['environment'],
    version: '1.0.0',
  },
}

export default config

📱 App Configuration
// ✅ CORRECT: app.json structure
{
  "expo": {
    "name": "My MVP App",
    "slug": "my-mvp-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icons/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/images/splash/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.mymvpapp",
      "buildNumber": "1"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/icons/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.yourcompany.mymvpapp",
      "versionCode": 1
    },
    "web": {
      "favicon": "./assets/images/icons/favicon.png",
      "bundler": "metro"
    },
    "plugins": [
      [
        "expo-router",
        {
          "root": "./src/app"
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "eas": {
        "projectId": "your-eas-project-id"
      }
    }
  }
}

🔧 TypeScript Configuration
// ✅ CORRECT: tsconfig.json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/screens/*": ["src/screens/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/utils/*": ["src/utils/*"],
      "@/types/*": ["src/types/*"],
      "@/store/*": ["src/store/*"],
      "@/lib/*": ["src/lib/*"],
      "@/assets/*": ["assets/*"]
    },
    "skipLibCheck": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "allowJs": true,
    "isolatedModules": true
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}

🎨 Tailwind Configuration
// ✅ CORRECT: tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          500: '#6b7280',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}


Development Workflow
🔄 Git Workflow
# ✅ CORRECT: Git branch naming
main                    # Production branch
develop                 # Development branch
feature/user-auth       # Feature branches
bugfix/login-error      # Bug fix branches
hotfix/critical-fix     # Hotfix branches
release/v1.0.0          # Release branches

# ✅ CORRECT: Commit message format
feat: add user authentication
fix: resolve login validation error
docs: update README with setup instructions
style: fix code formatting in Button component
refactor: extract auth logic to custom hook
test: add tests for user registration
chore: update dependencies

📝 Code Review Checklist
## Code Review Checklist

### Code Quality ✓
- [ ] Follows naming conventions
- [ ] Proper TypeScript types
- [ ] No console.log statements
- [ ] Error handling implemented
- [ ] Performance considerations

### Architecture ✓
- [ ] Follows folder structure
- [ ] Proper component organization
- [ ] Clean import/export patterns
- [ ] Appropriate abstraction level

### Functionality ✓
- [ ] Feature works as expected
- [ ] Edge cases handled
- [ ] User experience considered
- [ ] Accessibility implemented

### Security ✓
- [ ] Input validation present
- [ ] No sensitive data exposed
- [ ] Proper authentication checks
- [ ] Safe data handling

### Testing ✓
- [ ] Unit tests (if required)
- [ ] Manual testing completed
- [ ] Works on both platforms
- [ ] Performance tested

🚀 Development Scripts
// ✅ CORRECT: package.json scripts
{
  "scripts": {
    // Development
    "start": "expo start",
    "start:clear": "expo start --clear",
    "android": "expo start --android",
    "ios": "expo start --ios",
    
    // Building
    "build:preview:android": "eas build -p android --profile preview",
    "build:preview:ios": "eas build -p ios --profile preview",
    "build:production": "eas build --platform all --profile production",
    
    // Testing
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "type-check": "tsc --noEmit",
    
    // Linting
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,md}\"",
    
    // Utilities
    "clean": "rm -rf node_modules && npm install",
    "reset": "expo r -c",
    "update-types": "supabase gen types typescript --project-id YOUR_PROJECT_ID --schema public > src/types/database.ts"
  }
}

🧪 Testing Structure
__tests__/
├── components/               # Component tests
│   ├── ui/
│   │   ├── Button.test.tsx
│   │   ├── Input.test.tsx
│   │   └── Card.test.tsx
│   └── forms/
│       └── LoginForm.test.tsx
├── hooks/                    # Hook tests
│   ├── useAuth.test.ts
│   └── usePosts.test.ts
├── utils/                    # Utility tests
│   ├── dateUtils.test.ts
│   └── validation.test.ts
├── screens/                  # Screen tests
│   └── LoginScreen.test.tsx
├── setup.ts                  # Test setup
└── mocks/                    # Mock files
    ├── supabase.ts
    └── navigation.ts


Quick Reference Checklists
✅ New Component Checklist
Creating a new component:

- [ ] Create in appropriate folder (ui/forms/lists/common)
- [ ] Use PascalCase naming
- [ ] Add TypeScript interface for props
- [ ] Follow component structure template
- [ ] Add to index.ts for barrel export
- [ ] Add basic prop validation
- [ ] Consider if needs memo optimization
- [ ] Add accessibility props if needed

🗂️ New Feature Checklist
Adding a new feature:

- [ ] Create feature folder in screens/
- [ ] Create necessary hooks in hooks/
- [ ] Add types in types/
- [ ] Create API functions in services/
- [ ] Add validation schemas if needed
- [ ] Update navigation if needed
- [ ] Add to main index exports
- [ ] Test on both platforms

📱 New Screen Checklist
Creating a new screen:

- [ ] Create in appropriate screens/ subfolder
- [ ] Use ScreenName.tsx naming pattern
- [ ] Add to navigation types
- [ ] Implement proper navigation
- [ ] Add loading and error states
- [ ] Add proper TypeScript types
- [ ] Test navigation flow
- [ ] Add accessibility labels


File Templates
📄 Screen Template
// ✅ TEMPLATE: New screen template
import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Loading, Error } from '@/components/ui'
import { useNavigation } from '@expo/router'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

interface Props {
  // Add screen-specific props
}

const TemplateScreen = ({}: Props) => {
  // State
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Navigation
  const navigation = useNavigation<NativeStackNavigationProp<any>>()
  
  // Effects
  useEffect(() => {
    // Initialize screen
  }, [])
  
  // Handlers
  const handleAction = async () => {
    try {
      setLoading(true)
      setError(null)
      // Implement action
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }
  
  // Render loading state
  if (loading) {
    return <Loading message="Loading..." />
  }
  
  // Render error state
  if (error) {
    return <Error message={error} onRetry={handleAction} />
  }
  
  // Main render
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Template Screen</Text>
      <Button title="Action" onPress={handleAction} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
})

export default TemplateScreen

🔧 Hook Template
// ✅ TEMPLATE: Custom hook template
import { useState, useEffect, useCallback } from 'react'
import { Alert } from 'react-native'

interface UseTemplateOptions {
  // Add options interface
}

interface UseTemplateReturn {
  // Add return type interface
  data: any
  loading: boolean
  error: string | null
  action: () => Promise<void>
}

export const useTemplate = (options: UseTemplateOptions = {}): UseTemplateReturn => {
  // State
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Functions
  const action = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Implement action
      const result = await someAsyncOperation()
      setData(result)
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
      Alert.alert('Error', message)
    } finally {
      setLoading(false)
    }
  }, [])
  
  // Effects
  useEffect(() => {
    // Initialize hook
    action()
  }, [action])
  
  return {
    data,
    loading,
    error,
    action,
  }
}


Conclusion
This Project Structure & Organization Standards document provides:
✅ Complete Folder Structure - Exact hierarchy for any MVP project ✅ Naming Conventions - Consistent naming for all files and code ✅ Import/Export Patterns - Clean, organized code imports ✅ Component Architecture - Proven patterns for scalable components ✅ Asset Management - Organized approach to images, icons, and data ✅ Configuration Setup - All necessary config files ✅ Development Workflow - Git, testing, and deployment processes
Key Benefits:
Instant Setup - Copy-paste folder structure
Consistent Naming - No decisions needed on file names
Scalable Architecture - Grows from MVP to production
Team Collaboration - Everyone follows same patterns
Fast Development - Know exactly where everything goes
This ensures Claude Code will create well-organized, maintainable projects that follow industry best practices from day one.

