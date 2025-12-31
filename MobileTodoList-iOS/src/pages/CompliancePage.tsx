import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { palette, spacing, radius, typography, shadow } from '../theme';

export const CompliancePage: React.FC = () => {
  const [gdprConsent, setGdprConsent] = React.useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = React.useState(true);
  const [marketingEmails, setMarketingEmails] = React.useState(false);

  const handleExportData = () => {
    Alert.alert(
      'Export Personal Data',
      'We will prepare a complete export of your data. You will receive an email when ready.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request Export',
          onPress: () =>
            Alert.alert('Success', 'Data export requested. Check your email in 24 hours.'),
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all associated data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Confirm Deletion', 'Are you absolutely sure? Type DELETE to confirm.', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Confirm',
                style: 'destructive',
                onPress: () =>
                  Alert.alert('Account Deleted', 'Your account has been permanently deleted.'),
              },
            ]);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Compliance & Privacy</Text>
        <Text style={styles.headerSubtitle}>Manage your data and privacy settings</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Controls</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>GDPR Consent</Text>
                <Text style={styles.settingDescription}>Required for EU users</Text>
              </View>
              <Switch
                value={gdprConsent}
                onValueChange={setGdprConsent}
                trackColor={{ false: palette.border, true: palette.primary }}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Analytics</Text>
                <Text style={styles.settingDescription}>Help improve the app</Text>
              </View>
              <Switch
                value={analyticsEnabled}
                onValueChange={setAnalyticsEnabled}
                trackColor={{ false: palette.border, true: palette.primary }}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Marketing Emails</Text>
                <Text style={styles.settingDescription}>Product updates and tips</Text>
              </View>
              <Switch
                value={marketingEmails}
                onValueChange={setMarketingEmails}
                trackColor={{ false: palette.border, true: palette.primary }}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Retention</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Account Data</Text>
              <Text style={styles.infoValue}>Indefinite</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Activity Logs</Text>
              <Text style={styles.infoValue}>90 days</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Deleted Items</Text>
              <Text style={styles.infoValue}>30 days</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Analytics Data</Text>
              <Text style={styles.infoValue}>24 months</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Rights</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.actionRow} onPress={handleExportData}>
              <View>
                <Text style={styles.actionLabel}>Export Personal Data</Text>
                <Text style={styles.actionDescription}>Download all your data (GDPR)</Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.actionRow}>
              <View>
                <Text style={styles.actionLabel}>Data Processing Agreement</Text>
                <Text style={styles.actionDescription}>View DPA terms</Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.actionRow}>
              <View>
                <Text style={styles.actionLabel}>Privacy Policy</Text>
                <Text style={styles.actionDescription}>Last updated Dec 1, 2025</Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.actionRow}>
              <View>
                <Text style={styles.actionLabel}>Cookie Policy</Text>
                <Text style={styles.actionDescription}>Manage cookie preferences</Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <View style={styles.card}>
            <View style={styles.securityRow}>
              <View style={styles.securityIcon}>
                <Text style={styles.securityIconText}>S</Text>
              </View>
              <View style={styles.securityInfo}>
                <Text style={styles.securityLabel}>Data Encryption</Text>
                <Text style={styles.securityDescription}>AES-256 at rest, TLS 1.3 in transit</Text>
              </View>
              <View style={styles.securityBadge}>
                <Text style={styles.securityBadgeText}>Active</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.securityRow}>
              <View style={styles.securityIcon}>
                <Text style={styles.securityIconText}>C</Text>
              </View>
              <View style={styles.securityInfo}>
                <Text style={styles.securityLabel}>Compliance</Text>
                <Text style={styles.securityDescription}>SOC 2 Type II, GDPR, CCPA</Text>
              </View>
              <View style={styles.securityBadge}>
                <Text style={styles.securityBadgeText}>Certified</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.securityRow}>
              <View style={styles.securityIcon}>
                <Text style={styles.securityIconText}>B</Text>
              </View>
              <View style={styles.securityInfo}>
                <Text style={styles.securityLabel}>Backups</Text>
                <Text style={styles.securityDescription}>Daily automated backups</Text>
              </View>
              <View style={styles.securityBadge}>
                <Text style={styles.securityBadgeText}>Enabled</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.dangerTitle]}>Danger Zone</Text>
          <View style={styles.dangerCard}>
            <TouchableOpacity style={styles.dangerRow} onPress={handleDeleteAccount}>
              <View>
                <Text style={styles.dangerLabel}>Delete Account</Text>
                <Text style={styles.dangerDescription}>
                  Permanently delete your account and all data
                </Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Data Protection Officer</Text>
            <Text style={styles.infoCardText}>
              For privacy-related inquiries, contact our DPO at privacy@example.com
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: palette.background,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  headerTitle: {
    ...typography.h3,
    color: palette.text,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing.xxl,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: palette.text,
    marginBottom: spacing.md,
  },
  dangerTitle: {
    color: palette.alertCritical,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow.light,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    ...typography.body,
    color: palette.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingDescription: {
    ...typography.secondary,
    fontSize: 12,
    color: palette.textSecondary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  infoLabel: {
    ...typography.body,
    color: palette.textSecondary,
  },
  infoValue: {
    ...typography.bodyBold,
    color: palette.text,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  actionLabel: {
    ...typography.body,
    color: palette.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  actionDescription: {
    ...typography.secondary,
    fontSize: 12,
    color: palette.textSecondary,
  },
  actionArrow: {
    ...typography.body,
    color: palette.textTertiary,
    fontSize: 20,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  securityIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.button,
    backgroundColor: palette.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityIconText: {
    ...typography.bodyBold,
    fontSize: 18,
    color: palette.primary,
  },
  securityInfo: {
    flex: 1,
  },
  securityLabel: {
    ...typography.body,
    color: palette.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  securityDescription: {
    ...typography.secondary,
    fontSize: 12,
    color: palette.textSecondary,
  },
  securityBadge: {
    backgroundColor: `${palette.alertSuccess}15`,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.badge,
  },
  securityBadgeText: {
    ...typography.label,
    fontSize: 10,
    color: palette.alertSuccess,
    fontWeight: '700',
  },
  dangerCard: {
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.alertCritical,
    ...shadow.light,
  },
  dangerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  dangerLabel: {
    ...typography.body,
    color: palette.alertCritical,
    fontWeight: '600',
    marginBottom: 2,
  },
  dangerDescription: {
    ...typography.secondary,
    fontSize: 12,
    color: palette.textSecondary,
  },
  infoCard: {
    backgroundColor: palette.surfaceElevated,
    borderRadius: radius.card,
    padding: spacing.md,
  },
  infoCardTitle: {
    ...typography.bodyBold,
    color: palette.text,
    marginBottom: spacing.xs,
  },
  infoCardText: {
    ...typography.secondary,
    color: palette.textSecondary,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: palette.border,
  },
});
