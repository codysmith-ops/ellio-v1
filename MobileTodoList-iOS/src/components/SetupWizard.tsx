import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { EllioColors, EllioSpacing, EllioRadius, EllioTypography } from '../theme/ellioTokens';
import { getCreditCardData } from '../services/creditCardData';
import {
  CameraIcon,
  BellIcon,
  CheckmarkIcon,
  DollarIcon,
  CreditCardIcon,
  ChartIcon,
  UsersIcon,
  LightbulbIcon,
  ClockIcon,
  CalendarIcon,
  LocationIcon,
  TargetIcon,
} from './Icons';
import { ChatAssistant } from './ChatAssistant';
import { ContextualTip } from './ContextualTip';
import { getTipsForPage } from '../content/pageTips';

interface SetupWizardProps {
  onComplete: (userData: UserSetupData) => void;
}

export type UserGoal =
  | 'save-money'
  | 'credit-points'
  | 'budget'
  | 'collaborate'
  | 'organize'
  | 'efficiency';
export type Category = 
  | 'groceries' 
  | 'hardware' 
  | 'errands' 
  | 'medical' 
  | 'shopping' 
  | 'returns'
  | 'dental'
  | 'chiropractic'
  | 'automotive'
  | 'home-maintenance'
  | 'pet-care'
  | 'fitness'
  | 'pharmacy'
  | 'beauty';

export interface UserSetupData {
  name: string;
  email: string;
  company?: string;
  notificationsEnabled: boolean;
  defaultView: 'list' | 'grid';
  authProvider?: 'apple' | 'google' | 'email';
  goals: UserGoal[];
  budgetAmount?: number;
  budgetPeriod?: 'weekly' | 'monthly';
  creditCards?: Array<{ name: string; rewardsType: string }>;
  debitCard?: { name: string; rewardsInfo: string };
  locationPermissionGranted?: boolean;
  selectedCategories?: Category[];
  displayName?: string;
  collaborators?: string[];
  autoReceiptUpload?: boolean;
  cameraPreference?: 'camera' | 'library';
}

export const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Contextual tip state
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState<any>(null);

  // New onboarding state
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [displayName, setDisplayName] = useState('');
  const [collaborators, setCollaborators] = useState<string[]>(['']);
  const [autoReceiptUpload, setAutoReceiptUpload] = useState(true);
  const [cameraPreference, setCameraPreference] = useState<'camera' | 'library'>('camera');
  const [defaultView, setDefaultView] = useState<'list' | 'grid'>('list');
  const [authProvider, setAuthProvider] = useState<'apple' | 'google' | 'email' | undefined>();
  const [selectedGoals, setSelectedGoals] = useState<UserGoal[]>([]);
  const [budgetAmount, setBudgetAmount] = useState('');
  const [budgetPeriod, setBudgetPeriod] = useState<'weekly' | 'monthly'>('monthly');
  const [creditCardName, setCreditCardName] = useState('');
  const [rewardsType, setRewardsType] = useState('');
  const [showCardSuggestions, setShowCardSuggestions] = useState(false);
  const [showRewardsSuggestions, setShowRewardsSuggestions] = useState(false);
  const [useDebitCard, setUseDebitCard] = useState(false);
  const [debitCardName, setDebitCardName] = useState('');
  const [debitRewardsInfo, setDebitRewardsInfo] = useState('');

  // Show tip when step changes
  useEffect(() => {
    const stepToPage: { [key: number]: string } = {
      0: 'setup_welcome',
      1: 'setup_goals',
      2: 'setup_credit',
      3: 'setup_categories',
      4: 'setup_permissions',
      5: 'setup_voice',
    };
    
    const pageName = stepToPage[step];
    if (pageName) {
      const tips = getTipsForPage(pageName);
      if (tips.length > 0) {
        setCurrentTip(tips[0]);
        setShowTip(true);
      }
    }
  }, [step]);

  // Popular credit cards
  const popularCards = [
    'Visa Signature',
    'Visa Infinite',
    'Visa Platinum',
    'American Express Gold',
    'American Express Platinum',
    'American Express Green',
    'American Express Blue Cash Preferred',
    'American Express Blue Cash Everyday',
    'Chase Sapphire Preferred',
    'Chase Sapphire Reserve',
    'Chase Freedom Unlimited',
    'Chase Freedom Flex',
    'Capital One Venture',
    'Capital One Venture X',
    'Citi Double Cash',
    'Discover it Cash Back',
    'Wells Fargo Active Cash',
    'Bank of America Premium Rewards',
    'Apple Card',
    'Other (I will enter manually)',
  ];

  // Common rewards types
  const rewardsTypes = [
    'Travel Points',
    'Cashback',
    'Airline Miles',
    'Hotel Points',
    'Flex Points',
    'Membership Rewards',
    'Ultimate Rewards',
    'ThankYou Points',
  ];

  const filteredCards = creditCardName
    ? popularCards.filter(card => card.toLowerCase().includes(creditCardName.toLowerCase()))
    : popularCards;

  const filteredRewards = rewardsType
    ? rewardsTypes.filter(reward => reward.toLowerCase().includes(rewardsType.toLowerCase()))
    : rewardsTypes;

  const toggleGoal = (goal: UserGoal) => {
    setSelectedGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const handleAppleSignIn = () => {
    // Simulate Apple Sign In
    Alert.alert('Apple Sign In', 'Would you like to sign in with Apple ID?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign In',
        onPress: () => {
          setAuthProvider('apple');
          setName('Apple User');
          setEmail('user@privaterelay.appleid.com');
          setStep(2); // Skip to preferences
        },
      },
    ]);
  };

  const handleGoogleSignIn = () => {
    // Simulate Google Sign In
    Alert.alert('Google Sign In', 'Would you like to sign in with Google?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign In',
        onPress: () => {
          setAuthProvider('google');
          setName('Google User');
          setEmail('user@gmail.com');
          setStep(2); // Skip to preferences
        },
      },
    ]);
  };

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        // iOS: Request location permission (would use react-native-permissions in production)
        Alert.alert(
          'Location Permission',
          'This app needs location access for automatic task completion when you leave stores.',
          [
            { text: 'Not Now', onPress: () => setLocationPermissionGranted(false) },
            { text: 'Allow', onPress: () => setLocationPermissionGranted(true) },
          ]
        );
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        setLocationPermissionGranted(granted === PermissionsAndroid.RESULTS.GRANTED);
      }
    } catch (err) {
      console.warn(err);
      setLocationPermissionGranted(false);
    }
  };

  const requestNotificationPermission = async () => {
    if (Platform.OS === 'ios') {
      Alert.alert(
        'Notification Permission',
        'Allow notifications for task reminders and completion alerts?',
        [
          { text: 'Not Now', onPress: () => setNotificationsEnabled(false) },
          { text: 'Allow', onPress: () => setNotificationsEnabled(true) },
        ]
      );
    } else {
      setNotificationsEnabled(true); // Android handles this differently
    }
  };

  const toggleCategory = (category: Category) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const addCollaborator = () => {
    setCollaborators(prev => [...prev, '']);
  };

  const updateCollaborator = (index: number, value: string) => {
    setCollaborators(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const removeCollaborator = (index: number) => {
    setCollaborators(prev => prev.filter((_, i) => i !== index));
  };

  const steps = [
    {
      title: 'Welcome to Task Manager',
      subtitle: "Let's get you set up in just a few steps",
      content: (
        <View style={styles.welcomeContent}>
          <Text style={styles.sectionTitle}>Sign in to get started</Text>

          <TouchableOpacity style={styles.appleSignInButton} onPress={handleAppleSignIn}>
            <Text style={styles.appleIcon} />
            <Text style={styles.appleSignInText}>Sign in with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.googleSignInButton} onPress={handleGoogleSignIn}>
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleSignInText}>Sign in with Google</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.emailSignInButton}
            onPress={() => {
              setAuthProvider('email');
              setStep(1);
            }}
          >
            <Text style={styles.emailSignInText}>Continue with Email</Text>
          </TouchableOpacity>

          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>What you'll get:</Text>
            <View style={styles.featureRow}>
              <CheckmarkIcon size={20} color={EllioColors.primary.main} />
              <Text style={styles.featureText}>Manage your tasks efficiently</Text>
            </View>
            <View style={styles.featureRow}>
              <CameraIcon size={20} color={EllioColors.primary.main} />
              <Text style={styles.featureText}>Scan barcodes or take photos</Text>
            </View>
            <View style={styles.featureRow}>
              <BellIcon size={20} color={EllioColors.primary.main} />
              <Text style={styles.featureText}>Get timely reminders</Text>
            </View>
            <View style={styles.featureRow}>
              <CheckmarkIcon size={20} color={EllioColors.primary.main} />
              <Text style={styles.featureText}>Customize to your workflow</Text>
            </View>
          </View>
        </View>
      ),
    },
    {
      title: 'Your Information',
      subtitle: 'Tell us a bit about yourself',
      content: (
        <View style={styles.formContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              placeholderTextColor={EllioColors.text.tertiary}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={EllioColors.text.tertiary}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Company (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Your company name"
              value={company}
              onChangeText={setCompany}
              placeholderTextColor={EllioColors.text.tertiary}
            />
          </View>
        </View>
      ),
    },
    {
      title: 'Preferences',
      subtitle: 'Customize your experience',
      content: (
        <View style={styles.preferencesContent}>
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceTitle}>Enable Notifications</Text>
              <Text style={styles.preferenceSubtitle}>Get reminders for due tasks</Text>
            </View>
            <TouchableOpacity
              style={[styles.toggle, notificationsEnabled && styles.toggleActive]}
              onPress={() => setNotificationsEnabled(!notificationsEnabled)}
            >
              <View
                style={[styles.toggleThumb, notificationsEnabled && styles.toggleThumbActive]}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.preferenceRow}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceTitle}>Default View</Text>
              <Text style={styles.preferenceSubtitle}>Choose how tasks are displayed</Text>
            </View>
          </View>

          <View style={styles.viewOptions}>
            <TouchableOpacity
              style={[styles.viewOption, defaultView === 'list' && styles.viewOptionActive]}
              onPress={() => setDefaultView('list')}
            >
              <View style={styles.viewPreview}>
                <View style={styles.listPreviewItem} />
                <View style={styles.listPreviewItem} />
                <View style={styles.listPreviewItem} />
              </View>
              <View style={styles.viewOptionHeader}>
                <CheckmarkIcon
                  size={16}
                  color={defaultView === 'list' ? EllioColors.primary.main : EllioColors.text.secondary}
                />
                <Text
                  style={[
                    styles.viewOptionText,
                    defaultView === 'list' && styles.viewOptionTextActive,
                  ]}
                >
                  List View
                </Text>
              </View>
              <Text style={styles.viewOptionDescription}>Tasks in a vertical list</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.viewOption, defaultView === 'grid' && styles.viewOptionActive]}
              onPress={() => setDefaultView('grid')}
            >
              <View style={styles.viewPreview}>
                <View style={styles.gridPreviewRow}>
                  <View style={styles.gridPreviewItem} />
                  <View style={styles.gridPreviewItem} />
                </View>
                <View style={styles.gridPreviewRow}>
                  <View style={styles.gridPreviewItem} />
                  <View style={styles.gridPreviewItem} />
                </View>
              </View>
              <View style={styles.viewOptionHeader}>
                <ChartIcon
                  size={16}
                  color={defaultView === 'grid' ? EllioColors.primary.main : EllioColors.text.secondary}
                />
                <Text
                  style={[
                    styles.viewOptionText,
                    defaultView === 'grid' && styles.viewOptionTextActive,
                  ]}
                >
                  Grid View
                </Text>
              </View>
              <Text style={styles.viewOptionDescription}>Tasks in a card grid</Text>
            </TouchableOpacity>
          </View>
        </View>
      ),
    },
    {
      title: 'What matters most to you?',
      subtitle: 'Select your goals so we can personalize your experience',
      content: (
        <View style={styles.goalsContent}>
          <Text style={styles.goalsIntro}>
            Choose one or more goals. We'll configure the app with AI-powered features to help you
            achieve them.
          </Text>

          <TouchableOpacity
            style={[
              styles.goalCard,
              selectedGoals.includes('save-money') && styles.goalCardSelected,
            ]}
            onPress={() => toggleGoal('save-money')}
          >
            <View style={styles.goalHeader}>
              <View style={styles.goalIconContainer}>
                <DollarIcon size={32} color={EllioColors.primary.main} />
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Save Money</Text>
                <Text style={styles.goalDescription}>
                  Find deals, compare prices, track savings
                </Text>
              </View>
              <View
                style={[
                  styles.checkbox,
                  selectedGoals.includes('save-money') && styles.checkboxSelected,
                ]}
              >
                {selectedGoals.includes('save-money') && (
                  <CheckmarkIcon size={16} color={EllioColors.surface.background} />
                )}
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.goalCard,
              selectedGoals.includes('credit-points') && styles.goalCardSelected,
            ]}
            onPress={() => toggleGoal('credit-points')}
          >
            <View style={styles.goalHeader}>
              <View style={styles.goalIconContainer}>
                <CreditCardIcon size={32} color={EllioColors.primary.main} />
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Maximize Credit Card Points</Text>
                <Text style={styles.goalDescription}>Earn rewards on every purchase</Text>
              </View>
              <View
                style={[
                  styles.checkbox,
                  selectedGoals.includes('credit-points') && styles.checkboxSelected,
                ]}
              >
                {selectedGoals.includes('credit-points') && (
                  <CheckmarkIcon size={16} color={EllioColors.surface.background} />
                )}
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.goalCard, selectedGoals.includes('budget') && styles.goalCardSelected]}
            onPress={() => toggleGoal('budget')}
          >
            <View style={styles.goalHeader}>
              <View style={styles.goalIconContainer}>
                <ChartIcon size={32} color={EllioColors.primary.main} />
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Stay Within Budget</Text>
                <Text style={styles.goalDescription}>Track spending, set limits, get alerts</Text>
              </View>
              <View
                style={[
                  styles.checkbox,
                  selectedGoals.includes('budget') && styles.checkboxSelected,
                ]}
              >
                {selectedGoals.includes('budget') && (
                  <CheckmarkIcon size={16} color={EllioColors.surface.background} />
                )}
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.goalCard,
              selectedGoals.includes('collaborate') && styles.goalCardSelected,
            ]}
            onPress={() => toggleGoal('collaborate')}
          >
            <View style={styles.goalHeader}>
              <View style={styles.goalIconContainer}>
                <UsersIcon size={32} color={EllioColors.primary.main} />
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Collaborate with Others</Text>
                <Text style={styles.goalDescription}>Share lists, assign tasks, work together</Text>
              </View>
              <View
                style={[
                  styles.checkbox,
                  selectedGoals.includes('collaborate') && styles.checkboxSelected,
                ]}
              >
                {selectedGoals.includes('collaborate') && (
                  <CheckmarkIcon size={16} color={EllioColors.surface.background} />
                )}
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.goalCard, selectedGoals.includes('organize') && styles.goalCardSelected]}
            onPress={() => toggleGoal('organize')}
          >
            <View style={styles.goalHeader}>
              <View style={styles.goalIconContainer}>
                <CheckmarkIcon size={32} color={EllioColors.primary.main} />
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Stay Organized</Text>
                <Text style={styles.goalDescription}>Categories, reminders, prioritization</Text>
              </View>
              <View
                style={[
                  styles.checkbox,
                  selectedGoals.includes('organize') && styles.checkboxSelected,
                ]}
              >
                {selectedGoals.includes('organize') && (
                  <CheckmarkIcon size={16} color={EllioColors.surface.background} />
                )}
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.goalCard,
              selectedGoals.includes('efficiency') && styles.goalCardSelected,
            ]}
            onPress={() => toggleGoal('efficiency')}
          >
            <View style={styles.goalHeader}>
              <View style={styles.goalIconContainer}>
                <ClockIcon size={32} color={EllioColors.primary.main} />
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Maximize Efficiency</Text>
                <Text style={styles.goalDescription}>
                  Smart routing, batch tasks, time optimization
                </Text>
              </View>
              <View
                style={[
                  styles.checkbox,
                  selectedGoals.includes('efficiency') && styles.checkboxSelected,
                ]}
              >
                {selectedGoals.includes('efficiency') && (
                  <CheckmarkIcon size={16} color={EllioColors.surface.background} />
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      ),
    },
    // Conditional goal-specific configuration steps
    ...(selectedGoals.includes('budget')
      ? [
          {
            title: 'Set Your Budget',
            subtitle: "We'll help you stay on track",
            content: (
              <View style={styles.budgetContent}>
                <Text style={styles.configIntro}>
                  Set a spending limit and we'll track your purchases, alert you when you're
                  approaching the limit, and provide insights to help you save.
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Budget Amount</Text>
                  <View style={styles.budgetInputContainer}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                      style={styles.budgetInput}
                      placeholder="500"
                      value={budgetAmount}
                      onChangeText={setBudgetAmount}
                      keyboardType="decimal-pad"
                      placeholderTextColor={EllioColors.text.tertiary}
                    />
                  </View>
                </View>

                <View style={styles.periodSelector}>
                  <Text style={styles.label}>Budget Period</Text>
                  <View style={styles.periodButtons}>
                    <TouchableOpacity
                      style={[
                        styles.periodButton,
                        budgetPeriod === 'weekly' && styles.periodButtonActive,
                      ]}
                      onPress={() => setBudgetPeriod('weekly')}
                    >
                      <Text
                        style={[
                          styles.periodButtonText,
                          budgetPeriod === 'weekly' && styles.periodButtonTextActive,
                        ]}
                      >
                        Weekly
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.periodButton,
                        budgetPeriod === 'monthly' && styles.periodButtonActive,
                      ]}
                      onPress={() => setBudgetPeriod('monthly')}
                    >
                      <Text
                        style={[
                          styles.periodButtonText,
                          budgetPeriod === 'monthly' && styles.periodButtonTextActive,
                        ]}
                      >
                        Monthly
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.aiFeatureBox}>
                  <View style={styles.aiIconContainer}>
                    <LightbulbIcon size={24} color={EllioColors.primary.main} />
                  </View>
                  <View style={styles.aiFeatureContent}>
                    <Text style={styles.aiFeatureTitle}>AI-Powered Budget Assistant</Text>
                    <Text style={styles.aiFeatureText}>
                      Get smart spending recommendations, category breakdowns, and early warnings
                      when you're likely to exceed your budget.
                    </Text>
                  </View>
                </View>
              </View>
            ),
          },
        ]
      : []),
    // Step 6: Credit Cards (AUTOMATIC FOR ALL USERS)
    {
      title: 'Maximize Your Rewards',
      subtitle: 'Tell us about your credit cards (optional)',
      content: (
        <View style={styles.creditCardContent}>
          <Text style={styles.configIntro}>
            Add your credit cards and we'll suggest which card to use for each purchase to
            maximize your points and cashback.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Card Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Start typing..."
              value={creditCardName}
              onChangeText={text => {
                setCreditCardName(text);
                setShowCardSuggestions(text.length > 0);
              }}
              onFocus={() => setShowCardSuggestions(creditCardName.length > 0)}
              onBlur={() => setTimeout(() => setShowCardSuggestions(false), 200)}
              placeholderTextColor={EllioColors.text.tertiary}
            />
            {showCardSuggestions && filteredCards.length > 0 && (
              <ScrollView style={styles.suggestionsContainer} nestedScrollEnabled>
                {filteredCards.slice(0, 5).map((card, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => {
                      setCreditCardName(card);
                      setShowCardSuggestions(false);
                      // Auto-fill rewards from official data
                      const cardData = getCreditCardData(card);
                      if (cardData) {
                        const rewardsText =
                          cardData.bonusCategories.length > 0
                            ? cardData.bonusCategories
                                .map(bc => `${bc.rate}% ${bc.category}`)
                                .join(', ')
                            : `${cardData.baseRate}% on everything`;
                        setRewardsType(rewardsText);
                        // Show user the auto-filled data
                        Alert.alert(
                          'Card Details Loaded',
                          `${cardData.name}\n\nRewards:\n${rewardsText}\n\nAnnual Fee: $${
                            cardData.annualFee
                          }${
                            cardData.signUpBonus
                              ? '\n\nSign-up Bonus: ' + cardData.signUpBonus
                              : ''
                          }`,
                          [{ text: 'Got it!' }]
                        );
                      }
                    }}
                  >
                    <Text style={styles.suggestionText}>{card}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Rewards (Auto-filled from official website)</Text>
            <View style={[styles.input, styles.readOnlyInput]}>
              <Text style={rewardsType ? styles.rewardsText : styles.rewardsPlaceholder}>
                {rewardsType || 'Select a card above to see rewards'}
              </Text>
            </View>
            {rewardsType && (
              <Text style={styles.helpText}>
                ✓ Accurate data from {creditCardName} official website
              </Text>
            )}
          </View>

          {/* Debit Card Option */}
          <View style={styles.debitDivider} />
          <TouchableOpacity
            style={styles.debitToggle}
            onPress={() => setUseDebitCard(!useDebitCard)}
          >
            <View style={[styles.debitCheckbox, useDebitCard && styles.checkboxChecked]}>
              {useDebitCard && <Text style={styles.debitCheckmark}>✓</Text>}
            </View>
            <Text style={styles.debitToggleText}>I use a debit card (optional)</Text>
          </TouchableOpacity>

          {useDebitCard && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Debit Card Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Chase Checking"
                  value={debitCardName}
                  onChangeText={setDebitCardName}
                  placeholderTextColor={EllioColors.text.tertiary}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Debit Card Rewards/Cashback (if any)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 1% cashback on all purchases"
                  value={debitRewardsInfo}
                  onChangeText={setDebitRewardsInfo}
                  placeholderTextColor={EllioColors.text.tertiary}
                />
                <Text style={styles.helpText}>
                  Enter any cashback or rewards your debit card offers
                </Text>
              </View>
            </>
          )}

          <View style={styles.aiFeatureBox}>
            <View style={styles.aiIconContainer}>
              <LightbulbIcon size={24} color={EllioColors.primary.main} />
            </View>
            <View style={styles.aiFeatureContent}>
              <Text style={styles.aiFeatureTitle}>Smart Card Recommendations</Text>
              <Text style={styles.aiFeatureText}>
                Our AI analyzes category bonuses, rotating rewards, and special offers to
                recommend the best card for each purchase.
              </Text>
            </View>
          </View>

          <Text style={styles.skipHint}>You can skip this step or add more cards later in settings</Text>
        </View>
      ),
    },
    // Step 7: Location Permission (MUST HAVE)
    {
      title: 'Enable Location Services',
      subtitle: 'Automatic task completion when you leave stores',
      content: (
        <View style={styles.permissionContent}>
          <View style={styles.permissionIconContainer}>
            <LocationIcon size={64} color={EllioColors.primary.main} />
          </View>
          <Text style={styles.permissionTitle}>Geofencing Magic</Text>
          <Text style={styles.permissionDescription}>
            When you leave a store like Home Depot, we'll automatically ask if you completed your
            task "Buy screws". No more forgetting!
          </Text>
          <TouchableOpacity
            style={[
              styles.permissionButton,
              locationPermissionGranted && styles.permissionButtonActive,
            ]}
            onPress={requestLocationPermission}
          >
            <LocationIcon
              size={20}
              color={locationPermissionGranted ? EllioColors.surface.background : EllioColors.primary.main}
            />
            <Text
              style={[
                styles.permissionButtonText,
                locationPermissionGranted && styles.permissionButtonTextActive,
              ]}
            >
              {locationPermissionGranted ? 'Location Enabled' : 'Enable Location'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.permissionHint}>You can change this later in Settings</Text>
        </View>
      ),
    },
    // Step 8: Category Selection (MUST HAVE)
    {
      title: 'Choose Your Categories',
      subtitle: 'Select 2-5 categories you shop for most',
      content: (
        <View style={styles.categoryContent}>
          <Text style={styles.categoryIntro}>
            We'll pre-populate store preferences and optimize your experience for these categories.
          </Text>
          <View style={styles.categoryGrid}>
            {(
              [
                'groceries', 
                'hardware', 
                'errands', 
                'medical', 
                'shopping', 
                'returns',
                'dental',
                'chiropractic',
                'automotive',
                'home-maintenance',
                'pet-care',
                'fitness',
                'pharmacy',
                'beauty'
              ] as Category[]
            ).map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryCard,
                  selectedCategories.includes(category) && styles.categoryCardSelected,
                ]}
                onPress={() => toggleCategory(category)}
              >
                <View style={styles.categoryIconContainer}>
                  {category === 'groceries' && (
                    <ChartIcon
                      size={32}
                      color={
                        selectedCategories.includes(category)
                          ? EllioColors.primary.main
                          : EllioColors.text.secondary
                      }
                    />
                  )}
                  {category === 'hardware' && (
                    <CheckmarkIcon
                      size={32}
                      color={
                        selectedCategories.includes(category)
                          ? EllioColors.primary.main
                          : EllioColors.text.secondary
                      }
                    />
                  )}
                  {category === 'errands' && (
                    <LocationIcon
                      size={32}
                      color={
                        selectedCategories.includes(category)
                          ? EllioColors.primary.main
                          : EllioColors.text.secondary
                      }
                    />
                  )}
                  {category === 'medical' && (
                    <CalendarIcon
                      size={32}
                      color={
                        selectedCategories.includes(category)
                          ? EllioColors.primary.main
                          : EllioColors.text.secondary
                      }
                    />
                  )}
                  {category === 'shopping' && (
                    <CreditCardIcon
                      size={32}
                      color={
                        selectedCategories.includes(category)
                          ? EllioColors.primary.main
                          : EllioColors.text.secondary
                      }
                    />
                  )}
                  {category === 'returns' && (
                    <TargetIcon
                      size={32}
                      color={
                        selectedCategories.includes(category)
                          ? EllioColors.primary.main
                          : EllioColors.text.secondary
                      }
                    />
                  )}
                  {category === 'dental' && (
                    <CalendarIcon
                      size={32}
                      color={
                        selectedCategories.includes(category)
                          ? EllioColors.primary.main
                          : EllioColors.text.secondary
                      }
                    />
                  )}
                  {category === 'chiropractic' && (
                    <CheckmarkIcon
                      size={32}
                      color={
                        selectedCategories.includes(category)
                          ? EllioColors.primary.main
                          : EllioColors.text.secondary
                      }
                    />
                  )}
                  {category === 'automotive' && (
                    <LocationIcon
                      size={32}
                      color={
                        selectedCategories.includes(category)
                          ? EllioColors.primary.main
                          : EllioColors.text.secondary
                      }
                    />
                  )}
                  {category === 'home-maintenance' && (
                    <TargetIcon
                      size={32}
                      color={
                        selectedCategories.includes(category)
                          ? EllioColors.primary.main
                          : EllioColors.text.secondary
                      }
                    />
                  )}
                  {category === 'pet-care' && (
                    <ChartIcon
                      size={32}
                      color={
                        selectedCategories.includes(category)
                          ? EllioColors.primary.main
                          : EllioColors.text.secondary
                      }
                    />
                  )}
                  {category === 'fitness' && (
                    <DollarIcon
                      size={32}
                      color={
                        selectedCategories.includes(category)
                          ? EllioColors.primary.main
                          : EllioColors.text.secondary
                      }
                    />
                  )}
                  {category === 'pharmacy' && (
                    <CalendarIcon
                      size={32}
                      color={
                        selectedCategories.includes(category)
                          ? EllioColors.primary.main
                          : EllioColors.text.secondary
                      }
                    />
                  )}
                  {category === 'beauty' && (
                    <CameraIcon
                      size={32}
                      color={
                        selectedCategories.includes(category)
                          ? EllioColors.primary.main
                          : EllioColors.text.secondary
                      }
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.categoryLabel,
                    selectedCategories.includes(category) && styles.categoryLabelActive,
                  ]}
                >
                  {category === 'home-maintenance' 
                    ? 'Home Maintenance' 
                    : category === 'pet-care'
                    ? 'Pet Care'
                    : category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
                {selectedCategories.includes(category) && (
                  <View style={styles.categoryCheckmark}>
                    <CheckmarkIcon size={16} color={EllioColors.surface.background} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
          {selectedCategories.length > 0 && selectedCategories.length < 2 && (
            <Text style={styles.categoryWarning}>Select at least 2 categories</Text>
          )}
        </View>
      ),
    },
    // Step 9: Notification Permission (SHOULD HAVE)
    {
      title: 'Stay in the Loop',
      subtitle: 'Get reminders and completion alerts',
      content: (
        <View style={styles.permissionContent}>
          <View style={styles.permissionIconContainer}>
            <BellIcon size={64} color={EllioColors.primary.main} />
          </View>
          <Text style={styles.permissionTitle}>Never Miss a Task</Text>
          <Text style={styles.permissionDescription}>
            Get timely reminders for due tasks and alerts when you complete items near stores.
          </Text>
          <TouchableOpacity
            style={[styles.permissionButton, notificationsEnabled && styles.permissionButtonActive]}
            onPress={requestNotificationPermission}
          >
            <BellIcon size={20} color={notificationsEnabled ? EllioColors.surface.background : EllioColors.primary.main} />
            <Text
              style={[
                styles.permissionButtonText,
                notificationsEnabled && styles.permissionButtonTextActive,
              ]}
            >
              {notificationsEnabled ? 'Notifications Enabled' : 'Enable Notifications'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.permissionHint}>You can customize notification types later</Text>
        </View>
      ),
    },
    // Step 10: Collaboration Setup (SHOULD HAVE, conditional)
    ...(selectedGoals.includes('collaborate')
      ? [
          {
            title: 'Set Up Collaboration',
            subtitle: 'Share lists with family and team',
            content: (
              <View style={styles.collaborationContent}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Display Name for Sharing</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your display name"
                    value={displayName}
                    onChangeText={setDisplayName}
                    placeholderTextColor={EllioColors.text.tertiary}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Invite Collaborators (Optional)</Text>
                  {collaborators.map((collab, index) => (
                    <View key={index} style={styles.collaboratorRow}>
                      <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="email@example.com"
                        value={collab}
                        onChangeText={text => updateCollaborator(index, text)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor={EllioColors.text.tertiary}
                      />
                      {collaborators.length > 1 && (
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => removeCollaborator(index)}
                        >
                          <Text style={styles.removeButtonText}>×</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                  <TouchableOpacity style={styles.addButton} onPress={addCollaborator}>
                    <Text style={styles.addButtonText}>+ Add Another</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.permissionRow}>
                  <UsersIcon size={20} color={EllioColors.primary.main} />
                  <Text style={styles.permissionInfo}>
                    Collaborators can view and edit shared lists
                  </Text>
                </View>
              </View>
            ),
          },
        ]
      : []),
    // Step 11: Receipt Preferences (SHOULD HAVE)
    {
      title: 'Receipt Management',
      subtitle: 'How should we handle receipts?',
      content: (
        <View style={styles.receiptContent}>
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceTitle}>Auto-Upload Receipts</Text>
              <Text style={styles.preferenceSubtitle}>
                Automatically save receipts when tasks are completed
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.toggle, autoReceiptUpload && styles.toggleActive]}
              onPress={() => setAutoReceiptUpload(!autoReceiptUpload)}
            >
              <View style={[styles.toggleThumb, autoReceiptUpload && styles.toggleThumbActive]} />
            </TouchableOpacity>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Preferred Method</Text>
            <View style={styles.receiptOptions}>
              <TouchableOpacity
                style={[
                  styles.receiptOption,
                  cameraPreference === 'camera' && styles.receiptOptionActive,
                ]}
                onPress={() => setCameraPreference('camera')}
              >
                <CameraIcon
                  size={32}
                  color={cameraPreference === 'camera' ? EllioColors.primary.main : EllioColors.text.secondary}
                />
                <Text
                  style={[
                    styles.receiptOptionText,
                    cameraPreference === 'camera' && styles.receiptOptionTextActive,
                  ]}
                >
                  Take Photo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.receiptOption,
                  cameraPreference === 'library' && styles.receiptOptionActive,
                ]}
                onPress={() => setCameraPreference('library')}
              >
                <CheckmarkIcon
                  size={32}
                  color={cameraPreference === 'library' ? EllioColors.primary.main : EllioColors.text.secondary}
                />
                <Text
                  style={[
                    styles.receiptOptionText,
                    cameraPreference === 'library' && styles.receiptOptionTextActive,
                  ]}
                >
                  Choose from Library
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ),
    },
    // Step 12: Quick Tips (NICE TO HAVE)
    {
      title: 'Quick Tips',
      subtitle: 'Get the most out of your experience',
      content: (
        <View style={styles.tipsContent}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator
            style={styles.tipsCarousel}
          >
            <View style={styles.tipSlide}>
              <TargetIcon size={48} color={EllioColors.primary.main} />
              <Text style={styles.tipTitle}>Smart Task Completion</Text>
              <Text style={styles.tipDescription}>
                Tap a task near its store location to automatically mark it complete with receipt
                capture.
              </Text>
            </View>
            <View style={styles.tipSlide}>
              <ChartIcon size={48} color={EllioColors.primary.main} />
              <Text style={styles.tipTitle}>Track Your Savings</Text>
              <Text style={styles.tipDescription}>
                View dashboards showing how much you've saved compared to average spending.
              </Text>
            </View>
            <View style={styles.tipSlide}>
              <CreditCardIcon size={48} color={EllioColors.primary.main} />
              <Text style={styles.tipTitle}>Maximize Rewards</Text>
              <Text style={styles.tipDescription}>
                AI recommends the best credit card for each purchase to maximize points and
                cashback.
              </Text>
            </View>
          </ScrollView>
          <View style={styles.tipIndicators}>
            <View style={[styles.tipIndicator, styles.tipIndicatorActive]} />
            <View style={styles.tipIndicator} />
            <View style={styles.tipIndicator} />
          </View>
        </View>
      ),
    },
    // Step 13: Sample Task Offer (NICE TO HAVE)
    {
      title: 'Try It Out!',
      subtitle: 'See how it works with a sample task',
      content: (
        <View style={styles.sampleContent}>
          <View style={styles.sampleIconContainer}>
            <CheckmarkIcon size={64} color={EllioColors.primary.main} />
          </View>
          <Text style={styles.sampleTitle}>Ready to Get Started?</Text>
          <Text style={styles.sampleDescription}>
            Want to see how it works? We can add a sample task to help you get familiar with the
            features.
          </Text>
          <View style={styles.samplePreview}>
            <View style={styles.sampleTaskCard}>
              <CheckmarkIcon size={24} color={EllioColors.primary.main} />
              <View style={styles.sampleTaskInfo}>
                <Text style={styles.sampleTaskTitle}>Buy groceries</Text>
                <Text style={styles.sampleTaskDetails}>Whole Foods • $50 budget</Text>
              </View>
              <DollarIcon size={20} color={EllioColors.states.success.main} />
            </View>
          </View>
          <View style={styles.sampleActions}>
            <TouchableOpacity style={styles.sampleButtonSecondary}>
              <Text style={styles.sampleButtonSecondaryText}>Skip - I'll Create My Own</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sampleButtonPrimary}>
              <Text style={styles.sampleButtonPrimaryText}>Add Sample Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      ),
    },
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step === 1) {
      if (!name.trim() || !email.trim()) {
        Alert.alert('Required Fields', 'Please enter your name and email');
        return;
      }
      if (!email.includes('@')) {
        Alert.alert('Invalid Email', 'Please enter a valid email address');
        return;
      }
    }

    if (step === 3) {
      if (selectedGoals.length === 0) {
        Alert.alert(
          'Select at least one goal',
          'Choose what matters most to you so we can personalize your experience'
        );
        return;
      }
    }

    // Step 8 validation: Category selection
    if (currentStep.title === 'Choose Your Categories') {
      if (selectedCategories.length < 2) {
        Alert.alert('Select Categories', 'Please select at least 2 categories to continue');
        return;
      }
    }

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Prepare credit cards array
      const creditCards = creditCardName.trim()
        ? [{ name: creditCardName, rewardsType: rewardsType || 'cashback' }]
        : undefined;

      // Prepare debit card data
      const debitCard =
        useDebitCard && debitCardName.trim()
          ? { name: debitCardName, rewardsInfo: debitRewardsInfo }
          : undefined;

      onComplete({
        name,
        email,
        company,
        notificationsEnabled,
        defaultView,
        authProvider,
        goals: selectedGoals,
        budgetAmount: budgetAmount ? parseFloat(budgetAmount) : undefined,
        budgetPeriod,
        creditCards,
        debitCard,
        locationPermissionGranted,
        selectedCategories,
        displayName: displayName || name,
        collaborators: collaborators.filter(c => c.trim() !== ''),
        autoReceiptUpload,
        cameraPreference,
      });
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === step && styles.progressDotActive,
                index < step && styles.progressDotComplete,
              ]}
            />
          ))}
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Contextual Tip - shown at top of content */}
        {showTip && currentTip && (
          <ContextualTip
            page={currentTip.page}
            tipId={currentTip.tipId}
            message={currentTip.message}
            position={currentTip.position || 'top'}
            onDismiss={() => setShowTip(false)}
          />
        )}
        
        <Text style={styles.title}>{currentStep.title}</Text>
        <Text style={styles.subtitle}>{currentStep.subtitle}</Text>
        {currentStep.content}
      </ScrollView>

      {/* Chat Assistant for Onboarding Guidance */}
      <ChatAssistant
        context={{
          currentPage: 'Onboarding',
          setupStep: step,
          userName: name,
        }}
        tasks={[]}
      />

      <View style={styles.footer}>
        {step > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextButton, step === 0 && styles.nextButtonFull]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {step === steps.length - 1 ? 'Get Started' : 'Next →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: EllioColors.surface.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: EllioSpacing.lg,
    paddingBottom: EllioSpacing.md,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: EllioSpacing.sm,
  },
  progressDot: {
    width: 32,
    height: 6,
    backgroundColor: EllioColors.border.standard,
    borderRadius: EllioRadius.badge,
  },
  progressDotActive: {
    backgroundColor: EllioColors.primary.main,
  },
  progressDotComplete: {
    backgroundColor: EllioColors.states.success.main,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: EllioSpacing.lg,
    paddingTop: EllioSpacing.xl,
  },
  title: {
    ...EllioTypography.h2,
    color: palette.text,
    marginBottom: EllioSpacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...EllioTypography.body,
    color: EllioColors.text.secondary,
    marginBottom: EllioSpacing.xl,
    textAlign: 'center',
  },
  welcomeContent: {
    gap: EllioSpacing.lg,
  },
  sectionTitle: {
    ...EllioTypography.h3,
    color: palette.text,
    marginBottom: EllioSpacing.md,
    textAlign: 'center',
  },
  appleSignInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    paddingVertical: EllioSpacing.md,
    paddingHorizontal: EllioSpacing.lg,
    borderRadius: EllioRadius.button,
    gap: EllioSpacing.sm,
  },
  appleIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  appleSignInText: {
    ...EllioTypography.bodyBold,
    color: '#FFFFFF',
  },
  googleSignInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: EllioSpacing.md,
    paddingHorizontal: EllioSpacing.lg,
    borderRadius: EllioRadius.button,
    borderWidth: 1,
    borderColor: EllioColors.border.standard,
    gap: EllioSpacing.sm,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4285F4',
  },
  googleSignInText: {
    ...EllioTypography.bodyBold,
    color: palette.text,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: EllioSpacing.md,
    marginVertical: EllioSpacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: EllioColors.border.standard,
  },
  dividerText: {
    ...EllioTypography.secondary,
    color: EllioColors.text.secondary,
  },
  emailSignInButton: {
    paddingVertical: EllioSpacing.md,
    paddingHorizontal: EllioSpacing.lg,
    borderRadius: EllioRadius.button,
    borderWidth: 1,
    borderColor: EllioColors.primary.main,
    backgroundColor: palette.infoLight,
    alignItems: 'center',
  },
  emailSignInText: {
    ...EllioTypography.bodyBold,
    color: EllioColors.primary.main,
  },
  featuresContainer: {
    marginTop: EllioSpacing.xl,
    gap: EllioSpacing.md,
  },
  featuresTitle: {
    ...EllioTypography.bodyBold,
    color: palette.text,
    marginBottom: EllioSpacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: EllioSpacing.sm,
    paddingVertical: EllioSpacing.sm,
    paddingHorizontal: EllioSpacing.md,
    backgroundColor: EllioColors.surface.background,
    borderRadius: EllioRadius.card,
    borderWidth: 1,
    borderColor: EllioColors.border.standard,
  },
  featureText: {
    ...EllioTypography.body,
    color: palette.text,
    flex: 1,
  },
  formContent: {
    gap: EllioSpacing.lg,
  },
  inputGroup: {
    gap: EllioSpacing.sm,
  },
  label: {
    ...EllioTypography.bodyBold,
    color: palette.text,
  },
  input: {
    ...EllioTypography.body,
    backgroundColor: EllioColors.surface.background,
    borderWidth: 1,
    borderColor: EllioColors.border.standard,
    borderRadius: EllioRadius.button,
    paddingHorizontal: EllioSpacing.md,
    paddingVertical: EllioSpacing.md,
    color: palette.text,
  },
  preferencesContent: {
    gap: EllioSpacing.xl,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: EllioColors.surface.background,
    padding: EllioSpacing.md,
    borderRadius: EllioRadius.card,
    borderWidth: 1,
    borderColor: EllioColors.border.standard,
  },
  preferenceInfo: {
    flex: 1,
  },
  preferenceTitle: {
    ...EllioTypography.bodyBold,
    color: palette.text,
    marginBottom: 4,
  },
  preferenceSubtitle: {
    ...EllioTypography.secondary,
    color: EllioColors.text.secondary,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: EllioColors.border.standard,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: EllioColors.primary.main,
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: EllioColors.surface.background,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  viewOptions: {
    flexDirection: 'row',
    gap: EllioSpacing.md,
  },
  viewOption: {
    flex: 1,
    padding: EllioSpacing.lg,
    borderRadius: EllioRadius.card,
    borderWidth: 2,
    borderColor: EllioColors.border.standard,
    backgroundColor: EllioColors.surface.background,
    alignItems: 'center',
    gap: EllioSpacing.md,
  },
  viewOptionActive: {
    borderColor: EllioColors.primary.main,
    backgroundColor: palette.infoLight,
  },
  viewPreview: {
    width: '100%',
    height: 80,
    marginBottom: EllioSpacing.sm,
  },
  listPreviewItem: {
    height: 20,
    backgroundColor: EllioColors.border.standard,
    borderRadius: 4,
    marginBottom: 6,
  },
  gridPreviewRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  gridPreviewItem: {
    flex: 1,
    height: 35,
    backgroundColor: EllioColors.border.standard,
    borderRadius: 4,
  },
  viewOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: EllioSpacing.sm,
    justifyContent: 'center',
  },
  viewOptionText: {
    ...EllioTypography.bodyBold,
    color: EllioColors.text.secondary,
  },
  viewOptionTextActive: {
    color: EllioColors.primary.main,
  },
  viewOptionDescription: {
    ...EllioTypography.secondary,
    color: EllioColors.text.tertiary,
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    padding: EllioSpacing.lg,
    gap: EllioSpacing.md,
    borderTopWidth: 1,
    borderTopColor: EllioColors.border.standard,
    backgroundColor: EllioColors.surface.background,
  },
  backButton: {
    flex: 1,
    paddingVertical: EllioSpacing.md,
    alignItems: 'center',
    borderRadius: EllioRadius.button,
    borderWidth: 1,
    borderColor: EllioColors.border.standard,
  },
  backButtonText: {
    ...EllioTypography.bodyBold,
    color: EllioColors.text.secondary,
  },
  nextButton: {
    flex: 2,
    paddingVertical: EllioSpacing.md,
    alignItems: 'center',
    backgroundColor: EllioColors.primary.main,
    borderRadius: EllioRadius.button,
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonText: {
    ...EllioTypography.bodyBold,
    color: EllioColors.surface.background,
  },
  goalsContent: {
    gap: EllioSpacing.md,
  },
  goalsIntro: {
    ...EllioTypography.body,
    color: EllioColors.text.secondary,
    marginBottom: EllioSpacing.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  goalCard: {
    backgroundColor: EllioColors.surface.background,
    borderWidth: 2,
    borderColor: EllioColors.border.standard,
    borderRadius: EllioRadius.large,
    padding: EllioSpacing.md,
  },
  goalCardSelected: {
    borderColor: EllioColors.primary.main,
    backgroundColor: EllioColors.primary.mainLight || '#EBF5FF',
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: EllioSpacing.md,
  },
  goalIconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: EllioRadius.medium,
    backgroundColor: '#FFFFFF',
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    ...EllioTypography.bodyBold,
    color: palette.text,
    marginBottom: 4,
  },
  goalDescription: {
    ...EllioTypography.secondary,
    color: EllioColors.text.secondary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: EllioColors.border.standard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: EllioColors.primary.main,
    borderColor: EllioColors.primary.main,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  budgetContent: {
    gap: EllioSpacing.lg,
  },
  creditCardContent: {
    gap: EllioSpacing.lg,
  },
  configIntro: {
    ...EllioTypography.body,
    color: EllioColors.text.secondary,
    lineHeight: 22,
  },
  budgetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: EllioColors.border.standard,
    borderRadius: EllioRadius.medium,
    paddingHorizontal: EllioSpacing.md,
    backgroundColor: EllioColors.surface.background,
  },
  currencySymbol: {
    ...EllioTypography.h3,
    color: EllioColors.text.secondary,
    marginRight: EllioSpacing.sm,
  },
  budgetInput: {
    flex: 1,
    ...EllioTypography.h3,
    color: palette.text,
    paddingVertical: EllioSpacing.md,
  },
  periodSelector: {
    gap: EllioSpacing.sm,
  },
  periodButtons: {
    flexDirection: 'row',
    gap: EllioSpacing.sm,
  },
  periodButton: {
    flex: 1,
    paddingVertical: EllioSpacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: EllioColors.border.standard,
    borderRadius: EllioRadius.button,
    backgroundColor: EllioColors.surface.background,
  },
  periodButtonActive: {
    borderColor: EllioColors.primary.main,
    backgroundColor: EllioColors.primary.mainLight || '#EBF5FF',
  },
  periodButtonText: {
    ...EllioTypography.bodyBold,
    color: EllioColors.text.secondary,
  },
  periodButtonTextActive: {
    color: EllioColors.primary.main,
  },
  aiFeatureBox: {
    flexDirection: 'row',
    gap: EllioSpacing.md,
    backgroundColor: EllioColors.primary.mainLight || '#EBF5FF',
    padding: EllioSpacing.md,
    borderRadius: EllioRadius.medium,
    borderWidth: 1,
    borderColor: EllioColors.primary.main + '30',
  },
  aiIconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: EllioRadius.small,
    backgroundColor: '#FFFFFF',
  },
  aiFeatureContent: {
    flex: 1,
    gap: 4,
  },
  aiFeatureTitle: {
    ...EllioTypography.bodyBold,
    color: palette.text,
  },
  aiFeatureText: {
    ...EllioTypography.secondary,
    color: EllioColors.text.secondary,
    lineHeight: 18,
  },
  skipHint: {
    ...EllioTypography.secondary,
    color: EllioColors.text.tertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  suggestionsContainer: {
    maxHeight: 180,
    borderWidth: 1,
    borderColor: EllioColors.border.standard,
    borderRadius: EllioRadius.medium,
    backgroundColor: EllioColors.surface.background,
    marginTop: EllioSpacing.xs,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  suggestionItem: {
    paddingVertical: EllioSpacing.md,
    paddingHorizontal: EllioSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: EllioColors.border.standard,
  },
  suggestionText: {
    ...EllioTypography.body,
    color: palette.text,
  },
  // New onboarding step styles
  permissionContent: {
    alignItems: 'center',
    gap: EllioSpacing.lg,
    paddingVertical: EllioSpacing.xl,
  },
  permissionIconContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
    backgroundColor: palette.infoLight,
  },
  permissionTitle: {
    ...EllioTypography.h2,
    color: palette.text,
    textAlign: 'center',
  },
  permissionDescription: {
    ...EllioTypography.body,
    color: EllioColors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: EllioSpacing.md,
  },
  permissionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: EllioSpacing.sm,
    paddingVertical: EllioSpacing.md,
    paddingHorizontal: EllioSpacing.lg,
    borderRadius: EllioRadius.button,
    borderWidth: 2,
    borderColor: EllioColors.primary.main,
    backgroundColor: EllioColors.surface.background,
  },
  permissionButtonActive: {
    backgroundColor: EllioColors.primary.main,
  },
  permissionButtonText: {
    ...EllioTypography.bodyBold,
    color: EllioColors.primary.main,
  },
  permissionButtonTextActive: {
    color: EllioColors.surface.background,
  },
  permissionHint: {
    ...EllioTypography.secondary,
    color: EllioColors.text.tertiary,
    textAlign: 'center',
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: EllioSpacing.sm,
    padding: EllioSpacing.md,
    backgroundColor: palette.infoLight,
    borderRadius: EllioRadius.medium,
  },
  permissionInfo: {
    ...EllioTypography.body,
    color: palette.text,
    flex: 1,
  },
  categoryContent: {
    gap: EllioSpacing.lg,
  },
  categoryIntro: {
    ...EllioTypography.body,
    color: EllioColors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: EllioSpacing.md,
  },
  categoryCard: {
    width: '30%',
    aspectRatio: 1,
    padding: EllioSpacing.md,
    borderRadius: EllioRadius.card,
    borderWidth: 2,
    borderColor: EllioColors.border.standard,
    backgroundColor: EllioColors.surface.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: EllioSpacing.sm,
    position: 'relative',
  },
  categoryCardSelected: {
    borderColor: EllioColors.primary.main,
    backgroundColor: palette.infoLight,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    ...EllioTypography.secondary,
    color: EllioColors.text.secondary,
    textAlign: 'center',
  },
  categoryLabelActive: {
    ...EllioTypography.bodyBold,
    color: EllioColors.primary.main,
  },
  categoryCheckmark: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: EllioColors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryWarning: {
    ...EllioTypography.secondary,
    color: EllioColors.states.error.main,
    textAlign: 'center',
  },
  collaborationContent: {
    gap: EllioSpacing.lg,
  },
  collaboratorRow: {
    flexDirection: 'row',
    gap: EllioSpacing.sm,
    alignItems: 'center',
    marginBottom: EllioSpacing.sm,
  },
  removeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: EllioColors.states.error.main,
  },
  removeButtonText: {
    fontSize: 24,
    color: EllioColors.surface.background,
    lineHeight: 24,
  },
  addButton: {
    paddingVertical: EllioSpacing.sm,
    alignItems: 'center',
  },
  addButtonText: {
    ...EllioTypography.bodyBold,
    color: EllioColors.primary.main,
  },
  receiptContent: {
    gap: EllioSpacing.lg,
  },
  receiptOptions: {
    flexDirection: 'row',
    gap: EllioSpacing.md,
  },
  receiptOption: {
    flex: 1,
    padding: EllioSpacing.lg,
    borderRadius: EllioRadius.card,
    borderWidth: 2,
    borderColor: EllioColors.border.standard,
    backgroundColor: EllioColors.surface.background,
    alignItems: 'center',
    gap: EllioSpacing.md,
  },
  receiptOptionActive: {
    borderColor: EllioColors.primary.main,
    backgroundColor: palette.infoLight,
  },
  receiptOptionText: {
    ...EllioTypography.bodyBold,
    color: EllioColors.text.secondary,
  },
  receiptOptionTextActive: {
    color: EllioColors.primary.main,
  },
  tipsContent: {
    gap: EllioSpacing.lg,
  },
  tipsCarousel: {
    height: 300,
  },
  tipSlide: {
    width: 300,
    padding: EllioSpacing.xl,
    alignItems: 'center',
    gap: EllioSpacing.md,
  },
  tipTitle: {
    ...EllioTypography.h3,
    color: palette.text,
    textAlign: 'center',
  },
  tipDescription: {
    ...EllioTypography.body,
    color: EllioColors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  tipIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: EllioSpacing.sm,
  },
  tipIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: EllioColors.border.standard,
  },
  tipIndicatorActive: {
    backgroundColor: EllioColors.primary.main,
  },
  sampleContent: {
    alignItems: 'center',
    gap: EllioSpacing.lg,
    paddingVertical: EllioSpacing.xl,
  },
  sampleIconContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: palette.infoLight,
  },
  sampleTitle: {
    ...EllioTypography.h2,
    color: palette.text,
    textAlign: 'center',
  },
  sampleDescription: {
    ...EllioTypography.body,
    color: EllioColors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: EllioSpacing.md,
  },
  samplePreview: {
    width: '100%',
    paddingHorizontal: EllioSpacing.md,
  },
  sampleTaskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: EllioSpacing.md,
    padding: EllioSpacing.md,
    borderRadius: EllioRadius.card,
    borderWidth: 1,
    borderColor: EllioColors.border.standard,
    backgroundColor: EllioColors.surface.background,
  },
  sampleTaskInfo: {
    flex: 1,
  },
  sampleTaskTitle: {
    ...EllioTypography.bodyBold,
    color: palette.text,
  },
  sampleTaskDetails: {
    ...EllioTypography.secondary,
    color: EllioColors.text.secondary,
  },
  sampleActions: {
    width: '100%',
    gap: EllioSpacing.sm,
    paddingHorizontal: EllioSpacing.md,
  },
  sampleButtonPrimary: {
    paddingVertical: EllioSpacing.md,
    paddingHorizontal: EllioSpacing.lg,
    borderRadius: EllioRadius.button,
    backgroundColor: EllioColors.primary.main,
    alignItems: 'center',
  },
  sampleButtonPrimaryText: {
    ...EllioTypography.bodyBold,
    color: EllioColors.surface.background,
  },
  sampleButtonSecondary: {
    paddingVertical: EllioSpacing.md,
    paddingHorizontal: EllioSpacing.lg,
    borderRadius: EllioRadius.button,
    borderWidth: 1,
    borderColor: EllioColors.border.standard,
    backgroundColor: EllioColors.surface.background,
    alignItems: 'center',
  },
  sampleButtonSecondaryText: {
    ...EllioTypography.bodyBold,
    color: EllioColors.text.secondary,
  },
  readOnlyInput: {
    backgroundColor: EllioColors.surface.backgroundSecondary,
    justifyContent: 'center',
    paddingHorizontal: EllioSpacing.md,
    paddingVertical: EllioSpacing.md,
  },
  rewardsText: {
    ...EllioTypography.body,
    color: palette.text,
  },
  rewardsPlaceholder: {
    ...EllioTypography.body,
    color: EllioColors.text.tertiary,
  },
  helpText: {
    ...EllioTypography.caption,
    color: EllioColors.states.success.main,
    marginTop: EllioSpacing.xs,
  },
  debitDivider: {
    height: 1,
    backgroundColor: EllioColors.border.standard,
    marginVertical: EllioSpacing.lg,
  },
  debitToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: EllioSpacing.md,
    paddingVertical: EllioSpacing.md,
  },
  debitCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: EllioColors.border.standard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: EllioColors.primary.main,
    borderColor: EllioColors.primary.main,
  },
  debitCheckmark: {
    color: EllioColors.surface.background,
    fontSize: 16,
    fontWeight: '700',
  },
  debitToggleText: {
    ...EllioTypography.body,
    color: palette.text,
  },
});
