# Mockup-to-Code Guidelines for React Native

This document provides detailed guidelines for translating the EchoinWhispr high-fidelity mockups into React Native components, ensuring pixel-perfect implementation while maintaining mobile performance and usability.

## Component Mapping Strategy

### Screen-by-Screen Implementation

#### 1. Connect Wallet Screen
**Mockup Reference:** [Screen: Connect Wallet]

**React Native Implementation:**
```jsx
// Full-screen container with centered content
<View style={styles.container}>
  <View style={styles.content}>
    <Text style={styles.logo}>Echoin<Text style={styles.logoAccent}>Whispr</Text></Text>
    <Text style={styles.tagline}>Connect by Merit. Not by Status.</Text>
    <Text style={styles.bodyText}>Welcome. EchoinWhispr is a decentralized...</Text>
    <TouchableOpacity style={styles.primaryButton}>
      <Text style={styles.buttonText}>Connect Wallet</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.link}>
      <Text style={styles.linkText}>What is a Hedera wallet?</Text>
    </TouchableOpacity>
  </View>
</View>
```

**Key Considerations:**
- Use `SafeAreaView` for proper notch handling
- Implement WalletConnect integration
- Add loading states for connection process

#### 2. Create Persona Screen
**Mockup Reference:** [Screen: Create Persona]

**React Native Implementation:**
```jsx
<ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
  <View style={styles.content}>
    <Text style={styles.h1}>Create Your Anonymous Persona</Text>
    <Text style={styles.bodyText}>This is your on-chain profile...</Text>
    
    <View style={styles.formGroup}>
      <Text style={styles.label}>Your Career</Text>
      <TextInput style={styles.input} placeholder="e.g., Software Engineer" />
    </View>
    
    <View style={styles.formGroup}>
      <Text style={styles.label}>Your Interests</Text>
      <TagInputComponent />
    </View>
    
    <View style={styles.formGroup}>
      <Text style={styles.label}>Your Current Mood</Text>
      <MoodSelectorComponent />
    </View>
    
    <InfoBoxComponent />
    
    <TouchableOpacity style={styles.primaryButton}>
      <Text style={styles.buttonText}>Create Persona & Sign</Text>
    </TouchableOpacity>
  </View>
</ScrollView>
```

**Key Components Needed:**
- Custom TagInput with add/remove functionality
- Mood selector as horizontal ScrollView
- Info box with icon and styled text

#### 3. Main Dashboard Layout
**Mockup Reference:** [Screen: Main Dashboard / Layout]

**React Native Implementation:**
```jsx
// App.js or main navigator
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          // Return appropriate icon based on route
        },
        tabBarActiveTintColor: '#00A3FF',
        tabBarInactiveTintColor: '#A0A0A0',
        tabBarStyle: {
          backgroundColor: '#1E1E1E',
          borderTopColor: '#333333',
        },
        headerStyle: {
          backgroundColor: '#1E1E1E',
          borderBottomColor: '#333333',
        },
        headerTintColor: '#F5F5F5',
      })}
    >
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Mood Match" component={MoodMatchScreen} />
      <Tab.Screen name="Inbox" component={InboxScreen} />
      <Tab.Screen name="My Persona" component={PersonaScreen} />
    </Tab.Navigator>
  );
}
```

#### 4. Search & Filter Screen
**Mockup Reference:** [Screen: Search & Filter]

**React Native Implementation:**
```jsx
<View style={styles.container}>
  <View style={styles.header}>
    <Text style={styles.h2}>Search</Text>
    <Text style={styles.whisperCount}>Daily Whispers Left: 5</Text>
  </View>
  
  <View style={styles.filters}>
    <TextInput style={styles.filterInput} placeholder="Filter by Career" />
    <TagInputComponent placeholder="Filter by Interests" />
  </View>
  
  {loading ? (
    <LoadingStateComponent message="Syncing user directory..." />
  ) : (
    <FlatList
      data={personaData}
      renderItem={({ item }) => <PersonaCardComponent persona={item} />}
      keyExtractor={(item) => item.id}
      style={styles.resultsList}
    />
  )}
</View>
```

#### 5. Persona Card Component
**Mockup Reference:** Persona Card in Search Results

**React Native Implementation:**
```jsx
const PersonaCard = ({ persona, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.cardContent}>
      <Text style={styles.moodText}>
        Mood: <Text style={persona.mood === 'Creative' ? styles.accentText : styles.neutralText}>
          {persona.mood}
        </Text>
      </Text>
      <Text style={styles.careerText}>{persona.career}</Text>
      <View style={styles.tagsContainer}>
        {persona.interests.map((interest, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{interest}</Text>
          </View>
        ))}
      </View>
    </View>
  </TouchableOpacity>
);
```

#### 6. View Persona & Send Whisper Modal
**Mockup Reference:** [Screen: View Persona & Send Whisper]

**React Native Implementation:**
```jsx
// Using react-native-modal or similar
<Modal
  isVisible={isVisible}
  style={styles.bottomModal}
  onBackdropPress={onClose}
  onSwipeComplete={onClose}
  swipeDirection="down"
>
  <View style={styles.modalContent}>
    <View style={styles.modalHeader}>
      <Text style={styles.h2}>Anonymous Persona</Text>
    </View>
    
    <View style={styles.personaInfo}>
      <Text style={styles.moodText}>
        Mood: <Text style={styles.accentText}>{persona.mood}</Text>
      </Text>
      <Text style={styles.careerText}>{persona.career}</Text>
      <View style={styles.tagsContainer}>
        {/* Tags */}
      </View>
    </View>
    
    <View style={styles.divider} />
    
    <Text style={styles.h3}>Send your Whisper</Text>
    <TextInput
      style={styles.messageInput}
      placeholder="Send an anonymous, encrypted message..."
      multiline
      value={message}
      onChangeText={setMessage}
    />
    <Text style={styles.helperText}>... (5 left today)</Text>
    
    <View style={styles.buttonRow}>
      <TouchableOpacity style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>Attach Image</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.buttonText}>Send Whisper</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
```

#### 7. Inbox Screen with Tabs
**Mockup Reference:** [Screen: Inbox]

**React Native Implementation:**
```jsx
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const InboxTab = createMaterialTopTabNavigator();

function InboxTabs() {
  return (
    <InboxTab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: 'transparent' },
        tabBarIndicatorStyle: { backgroundColor: '#00A3FF' },
        tabBarActiveTintColor: '#00A3FF',
        tabBarInactiveTintColor: '#A0A0A0',
      }}
    >
      <InboxTab.Screen name="Chats" component={ChatsScreen} />
      <InboxTab.Screen 
        name="Requests" 
        component={RequestsScreen}
        options={{
          tabBarBadge: () => requestCount > 0 ? requestCount : null,
          tabBarBadgeStyle: { backgroundColor: '#E000FF' }
        }}
      />
    </InboxTab.Navigator>
  );
}
```

#### 8. Conversation View
**Mockup Reference:** [Screen: Conversation View]

**React Native Implementation:**
```jsx
<View style={styles.container}>
  <View style={styles.header}>
    <TouchableOpacity onPress={goBack}>
      <Icon name="arrow-left" size={24} color="#00A3FF" />
    </TouchableOpacity>
    <Text style={styles.h3}>Chat with 'Solidity Developer'</Text>
  </View>
  
  <FlatList
    data={messages}
    renderItem={({ item }) => (
      <MessageBubble 
        message={item} 
        isOwn={item.sender === currentUser} 
      />
    )}
    keyExtractor={(item) => item.id}
    style={styles.messagesList}
    inverted // For chat-like scrolling
  />
  
  <View style={styles.inputBar}>
    <TouchableOpacity style={styles.attachButton}>
      <Icon name="paperclip" size={20} color="#00A3FF" />
    </TouchableOpacity>
    <TextInput
      style={styles.messageInput}
      placeholder="Type your encrypted reply..."
      value={newMessage}
      onChangeText={setNewMessage}
    />
    <TouchableOpacity style={styles.sendButton}>
      <Icon name="send" size={20} color="#00A3FF" />
    </TouchableOpacity>
  </View>
</View>
```

#### 9. Daily Limit Reached Modal
**Mockup Reference:** [Screen: Daily Limit Reached]

**React Native Implementation:**
```jsx
<Modal isVisible={isVisible} style={styles.centeredModal}>
  <View style={styles.paywallCard}>
    <View style={styles.paywallHeader}>
      <Icon name="clock" size={48} color="#FFC700" />
      <Text style={styles.h2}>Daily Whisper Limit Reached</Text>
    </View>
    
    <Text style={styles.bodyText}>
      You have used your 5 free Whispers for today...
    </Text>
    
    <View style={styles.subscriptionOption}>
      <Text style={styles.h3}>[X] HBAR (30 Days)</Text>
      <TouchableOpacity style={styles.accentButton}>
        <Text style={styles.buttonText}>Subscribe with HBAR</Text>
      </TouchableOpacity>
    </View>
    
    <View style={styles.subscriptionOption}>
      <Text style={styles.h3}>[X] HTS (30 Days)</Text>
      <TouchableOpacity style={styles.accentButton}>
        <Text style={styles.buttonText}>Subscribe with HTS</Text>
      </TouchableOpacity>
    </View>
    
    <TouchableOpacity style={styles.link}>
      <Text style={styles.linkText}>No thanks, I'll wait.</Text>
    </TouchableOpacity>
  </View>
</Modal>
```

## Implementation Best Practices

### Performance Optimization
- Use `FlatList` for scrollable content
- Implement proper `keyExtractor` functions
- Use `memo` for expensive components
- Optimize image loading with proper sizing

### State Management
- Use React Context or Redux for global state
- Implement proper loading and error states
- Handle offline scenarios gracefully

### Accessibility
- Add `accessibilityLabel` to interactive elements
- Ensure proper color contrast
- Support dynamic type scaling
- Implement proper focus management

### Platform-Specific Code
- Use `Platform.select()` for platform differences
- Handle safe areas properly
- Respect platform design guidelines

### Testing
- Unit test components with React Native Testing Library
- Integration test navigation flows
- Test on multiple device sizes

This implementation guide ensures the React Native app maintains the exact visual design and user experience specified in the mockups while leveraging mobile platform capabilities.