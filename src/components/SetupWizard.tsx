import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { palette, spacing, radius, typography } from '../theme';

interface SetupWizardProps {
  onComplete: (userData: UserSetupData) => void;
}

export type UserGoal = 'save-money' | 'credit-points' | 'budget' | 'collaborate' | 'organize' | 'efficiency';

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
}

export const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [defaultView, setDefaultView] = useState<'list' | 'grid'>('list');
  const [authProvider, setAuthProvider] = useState<'apple' | 'google' | 'email' | undefined>();
  const [selectedGoals, setSelectedGoals] = useState<UserGoal[]>([]);
  const [budgetAmount, setBudgetAmount] = useState('');
  const [budgetPeriod, setBudgetPeriod] = useState<'weekly' | 'monthly'>('monthly');
  const [creditCardName, setCreditCardName] = useState('');
  const [rewardsType, setRewardsType] = useState('');
  const [showCardSuggestions, setShowCardSuggestions] = useState(false);
  const [showRewardsSuggestions, setShowRewardsSuggestions] = useState(false);

  // Popular credit cards
  const popularCards = [
    'Chase Sapphire Preferred',
    'Chase Sapphire Reserve',
    'Chase Freedom Unlimited',
    'Chase Freedom Flex',
    'American Express Gold',
    'American Express Platinum',
    'Capital One Venture',
    'Capital One Venture X',
    'Citi Double Cash',
    'Discover it Cash Back',
    'Wells Fargo Active Cash',
    'Bank of America Premium Rewards',
    'Apple Card',
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
    ? popularCards.filter(card =>
        card.toLowerCase().includes(creditCardName.toLowerCase())
      )
    : popularCards;

  const filteredRewards = rewardsType
    ? rewardsTypes.filter(reward =>
        reward.toLowerCase().includes(rewardsType.toLowerCase())
      )
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

  const steps = [
    {
      title: 'Welcome to Task Manager',
      subtitle: "Let's get you set up in just a few steps",
      content: (
        <View style={styles.welcomeContent}>
          <Text style={styles.sectionTitle}>Sign in to get started</Text>
          
          <TouchableOpacity style={styles.appleSignInButton} onPress={handleAppleSignIn}>
            <Text style={styles.appleIcon}></Text>
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
            <Text style={styles.welcomeText}>📋 Manage your tasks efficiently</Text>
            <Text style={styles.welcomeText}>📷 Scan barcodes or take photos</Text>
            <Text style={styles.welcomeText}>🔔 Get timely reminders</Text>
            <Text style={styles.welcomeText}>⚙️ Customize to your workflow</Text>
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
              placeholderTextColor={palette.textTertiary}
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
              placeholderTextColor={palette.textTertiary}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Company (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Your company name"
              value={company}
              onChangeText={setCompany}
              placeholderTextColor={palette.textTertiary}
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
              <Text
                style={[
                  styles.viewOptionText,
                  defaultView === 'list' && styles.viewOptionTextActive,
                ]}
              >
                📋 List View
              </Text>
              <Text style={styles.viewOptionDescription}>
                Tasks in a vertical list
              </Text>
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
              <Text
                style={[
                  styles.viewOptionText,
                  defaultView === 'grid' && styles.viewOptionTextActive,
                ]}
              >
                ⊞ Grid View
              </Text>
              <Text style={styles.viewOptionDescription}>
                Tasks in a card grid
              </Text>
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
            Choose one or more goals. We'll configure the app with AI-powered features to help you achieve them.
          </Text>

          <TouchableOpacity
            style={[styles.goalCard, selectedGoals.includes('save-money') && styles.goalCardSelected]}
            onPress={() => toggleGoal('save-money')}
          >
            <View style={styles.goalHeader}>
              <Text style={styles.goalIcon}>💰</Text>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Save Money</Text>
                <Text style={styles.goalDescription}>Find deals, compare prices, track savings</Text>
              </View>
              <View style={[styles.checkbox, selectedGoals.includes('save-money') && styles.checkboxSelected]}>
                {selectedGoals.includes('save-money') && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.goalCard, selectedGoals.includes('credit-points') && styles.goalCardSelected]}
            onPress={() => toggleGoal('credit-points')}
          >
            <View style={styles.goalHeader}>
              <Text style={styles.goalIcon}>💳</Text>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Maximize Credit Card Points</Text>
                <Text style={styles.goalDescription}>Earn rewards on every purchase</Text>
              </View>
              <View style={[styles.checkbox, selectedGoals.includes('credit-points') && styles.checkboxSelected]}>
                {selectedGoals.includes('credit-points') && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.goalCard, selectedGoals.includes('budget') && styles.goalCardSelected]}
            onPress={() => toggleGoal('budget')}
          >
            <View style={styles.goalHeader}>
              <Text style={styles.goalIcon}>📊</Text>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Stay Within Budget</Text>
                <Text style={styles.goalDescription}>Track spending, set limits, get alerts</Text>
              </View>
              <View style={[styles.checkbox, selectedGoals.includes('budget') && styles.checkboxSelected]}>
                {selectedGoals.includes('budget') && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.goalCard, selectedGoals.includes('collaborate') && styles.goalCardSelected]}
            onPress={() => toggleGoal('collaborate')}
          >
            <View style={styles.goalHeader}>
              <Text style={styles.goalIcon}>👥</Text>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Collaborate with Others</Text>
                <Text style={styles.goalDescription}>Share lists, assign tasks, work together</Text>
              </View>
              <View style={[styles.checkbox, selectedGoals.includes('collaborate') && styles.checkboxSelected]}>
                {selectedGoals.includes('collaborate') && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.goalCard, selectedGoals.includes('organize') && styles.goalCardSelected]}
            onPress={() => toggleGoal('organize')}
          >
            <View style={styles.goalHeader}>
              <Text style={styles.goalIcon}>📋</Text>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Stay Organized</Text>
                <Text style={styles.goalDescription}>Categories, reminders, prioritization</Text>
              </View>
              <View style={[styles.checkbox, selectedGoals.includes('organize') && styles.checkboxSelected]}>
                {selectedGoals.includes('organize') && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.goalCard, selectedGoals.includes('efficiency') && styles.goalCardSelected]}
            onPress={() => toggleGoal('efficiency')}
          >
            <View style={styles.goalHeader}>
              <Text style={styles.goalIcon}>⚡</Text>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Maximize Efficiency</Text>
                <Text style={styles.goalDescription}>Smart routing, batch tasks, time optimization</Text>
              </View>
              <View style={[styles.checkbox, selectedGoals.includes('efficiency') && styles.checkboxSelected]}>
                {selectedGoals.includes('efficiency') && <Text style={styles.checkmark}>✓</Text>}
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
                  Set a spending limit and we'll track your purchases, alert you when you're approaching the limit, and provide insights to help you save.
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
                      placeholderTextColor={palette.textTertiary}
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
                  <Text style={styles.aiFeatureIcon}>🤖</Text>
                  <View style={styles.aiFeatureContent}>
                    <Text style={styles.aiFeatureTitle}>AI-Powered Budget Assistant</Text>
                    <Text style={styles.aiFeatureText}>
                      Get smart spending recommendations, category breakdowns, and early warnings when you're likely to exceed your budget.
                    </Text>
                  </View>
                </View>
              </View>
            ),
          },
        ]
      : []),
    ...(selectedGoals.includes('credit-points')
      ? [
          {
            title: 'Maximize Your Rewards',
            subtitle: 'Tell us about your credit cards',
            content: (
              <View style={styles.creditCardContent}>
                <Text style={styles.configIntro}>
                  Add your credit cards and we'll suggest which card to use for each purchase to maximize your points and cashback.
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Card Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Start typing..."
                    value={creditCardName}
                    onChangeText={(text) => {
                      setCreditCardName(text);
                      setShowCardSuggestions(text.length > 0);
                    }}
                    onFocus={() => setShowCardSuggestions(creditCardName.length > 0)}
                    onBlur={() => setTimeout(() => setShowCardSuggestions(false), 200)}
                    placeholderTextColor={palette.textTertiary}
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
                          }}
                        >
                          <Text style={styles.suggestionText}>{card}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Rewards Type</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Start typing..."
                    value={rewardsType}
                    onChangeText={(text) => {
                      setRewardsType(text);
                      setShowRewardsSuggestions(text.length > 0);
                    }}
                    onFocus={() => setShowRewardsSuggestions(rewardsType.length > 0)}
                    onBlur={() => setTimeout(() => setShowRewardsSuggestions(false), 200)}
                    placeholderTextColor={palette.textTertiary}
                  />
                  {showRewardsSuggestions && filteredRewards.length > 0 && (
                    <ScrollView style={styles.suggestionsContainer} nestedScrollEnabled>
                      {filteredRewards.slice(0, 5).map((reward, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.suggestionItem}
                          onPress={() => {
                            setRewardsType(reward);
                            setShowRewardsSuggestions(false);
                          }}
                        >
                          <Text style={styles.suggestionText}>{reward}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}
                </View>

                <View style={styles.aiFeatureBox}>
                  <Text style={styles.aiFeatureIcon}>💡</Text>
                  <View style={styles.aiFeatureContent}>
                    <Text style={styles.aiFeatureTitle}>Smart Card Recommendations</Text>
                    <Text style={styles.aiFeatureText}>
                      Our AI analyzes category bonuses, rotating rewards, and special offers to recommend the best card for each purchase.
                    </Text>
                  </View>
                </View>

                <Text style={styles.skipHint}>You can add more cards later in settings</Text>
              </View>
            ),
          },
        ]
      : []),
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
        Alert.alert('Select at least one goal', 'Choose what matters most to you so we can personalize your experience');
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
        <Text style={styles.title}>{currentStep.title}</Text>
        <Text style={styles.subtitle}>{currentStep.subtitle}</Text>
        {currentStep.content}
      </ScrollView>

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
    backgroundColor: palette.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  progressDot: {
    width: 32,
    height: 6,
    backgroundColor: palette.border,
    borderRadius: radius.badge,
  },
  progressDotActive: {
    backgroundColor: palette.primary,
  },
  progressDotComplete: {
    backgroundColor: palette.success,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: palette.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: palette.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  welcomeContent: {
    gap: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: palette.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  appleSignInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.button,
    gap: spacing.sm,
  },
  appleIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  appleSignInText: {
    ...typography.bodyBold,
    color: '#FFFFFF',
  },
  googleSignInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: palette.border,
    gap: spacing.sm,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4285F4',
  },
  googleSignInText: {
    ...typography.bodyBold,
    color: palette.text,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginVertical: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: palette.border,
  },
  dividerText: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
  emailSignInButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: palette.primary,
    backgroundColor: palette.infoLight,
    alignItems: 'center',
  },
  emailSignInText: {
    ...typography.bodyBold,
    color: palette.primary,
  },
  featuresContainer: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  featuresTitle: {
    ...typography.bodyBold,
    color: palette.text,
    marginBottom: spacing.sm,
  },
  welcomeText: {
    ...typography.body,
    color: palette.text,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
  },
  formContent: {
    gap: spacing.lg,
  },
  inputGroup: {
    gap: spacing.sm,
  },
  label: {
    ...typography.bodyBold,
    color: palette.text,
  },
  input: {
    ...typography.body,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.button,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: palette.text,
  },
  preferencesContent: {
    gap: spacing.xl,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: palette.surface,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
  },
  preferenceInfo: {
    flex: 1,
  },
  preferenceTitle: {
    ...typography.bodyBold,
    color: palette.text,
    marginBottom: 4,
  },
  preferenceSubtitle: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: palette.border,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: palette.primary,
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: palette.surface,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  viewOptions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  viewOption: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radius.card,
    borderWidth: 2,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    alignItems: 'center',
    gap: spacing.md,
  },
  viewOptionActive: {
    borderColor: palette.primary,
    backgroundColor: palette.infoLight,
  },
  viewPreview: {
    width: '100%',
    height: 80,
    marginBottom: spacing.sm,
  },
  listPreviewItem: {
    height: 20,
    backgroundColor: palette.border,
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
    backgroundColor: palette.border,
    borderRadius: 4,
  },
  viewOptionText: {
    ...typography.bodyBold,
    color: palette.textSecondary,
  },
  viewOptionTextActive: {
    color: palette.primary,
  },
  viewOptionDescription: {
    ...typography.secondary,
    color: palette.textTertiary,
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: palette.border,
    backgroundColor: palette.surface,
  },
  backButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: palette.border,
  },
  backButtonText: {
    ...typography.bodyBold,
    color: palette.textSecondary,
  },
  nextButton: {
    flex: 2,
    paddingVertical: spacing.md,
    alignItems: 'center',
    backgroundColor: palette.primary,
    borderRadius: radius.button,
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonText: {
    ...typography.bodyBold,
    color: palette.surface,
  },
  goalsContent: {
    gap: spacing.md,
  },
  goalsIntro: {
    ...typography.body,
    color: palette.textSecondary,
    marginBottom: spacing.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  goalCard: {
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderColor: palette.border,
    borderRadius: radius.large,
    padding: spacing.md,
  },
  goalCardSelected: {
    borderColor: palette.primary,
    backgroundColor: palette.primaryLight || '#EBF5FF',
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  goalIcon: {
    fontSize: 32,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    ...typography.bodyBold,
    color: palette.text,
    marginBottom: 4,
  },
  goalDescription: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  budgetContent: {
    gap: spacing.lg,
  },
  creditCardContent: {
    gap: spacing.lg,
  },
  configIntro: {
    ...typography.body,
    color: palette.textSecondary,
    lineHeight: 22,
  },
  budgetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.medium,
    paddingHorizontal: spacing.md,
    backgroundColor: palette.surface,
  },
  currencySymbol: {
    ...typography.h3,
    color: palette.textSecondary,
    marginRight: spacing.sm,
  },
  budgetInput: {
    flex: 1,
    ...typography.h3,
    color: palette.text,
    paddingVertical: spacing.md,
  },
  periodSelector: {
    gap: spacing.sm,
  },
  periodButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  periodButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: palette.border,
    borderRadius: radius.button,
    backgroundColor: palette.surface,
  },
  periodButtonActive: {
    borderColor: palette.primary,
    backgroundColor: palette.primaryLight || '#EBF5FF',
  },
  periodButtonText: {
    ...typography.bodyBold,
    color: palette.textSecondary,
  },
  periodButtonTextActive: {
    color: palette.primary,
  },
  aiFeatureBox: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: palette.primaryLight || '#EBF5FF',
    padding: spacing.md,
    borderRadius: radius.medium,
    borderWidth: 1,
    borderColor: palette.primary + '30',
  },
  aiFeatureIcon: {
    fontSize: 24,
  },
  aiFeatureContent: {
    flex: 1,
    gap: 4,
  },
  aiFeatureTitle: {
    ...typography.bodyBold,
    color: palette.text,
  },
  aiFeatureText: {
    ...typography.secondary,
    color: palette.textSecondary,
    lineHeight: 18,
  },
  skipHint: {
    ...typography.secondary,
    color: palette.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  suggestionsContainer: {
    maxHeight: 180,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.medium,
    backgroundColor: palette.surface,
    marginTop: spacing.xs,
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
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  suggestionText: {
    ...typography.body,
    color: palette.text,
  },
});
