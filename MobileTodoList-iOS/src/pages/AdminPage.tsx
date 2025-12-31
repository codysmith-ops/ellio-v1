import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { palette, spacing, radius, typography, shadow } from '../theme';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  status: 'active' | 'inactive';
  lastActive: Date;
}

export const AdminPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'users' | 'roles' | 'settings'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [featureFlags, setFeatureFlags] = useState({
    newUI: true,
    aiAssistant: false,
    advancedAnalytics: true,
  });

  const users: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      status: 'active',
      lastActive: new Date('2025-12-29T10:30:00'),
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'manager',
      status: 'active',
      lastActive: new Date('2025-12-29T09:15:00'),
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike@example.com',
      role: 'user',
      status: 'active',
      lastActive: new Date('2025-12-28T16:20:00'),
    },
    {
      id: '4',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'user',
      status: 'inactive',
      lastActive: new Date('2025-12-15T12:00:00'),
    },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return palette.alertCritical;
      case 'manager':
        return palette.alertWarning;
      case 'user':
        return palette.primary;
      default:
        return palette.textSecondary;
    }
  };

  const getRoleLabel = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) {
      return 'Just now';
    }
    if (hours < 24) {
      return `${hours}h ago`;
    }
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleEditUser = (user: User) => {
    Alert.alert('Edit User', `Edit ${user.name}?`);
  };

  const _handleDeleteUser = (user: User) => {
    Alert.alert('Delete User', `Remove ${user.name} from the system?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => Alert.alert('Success', 'User removed'),
      },
    ]);
  };

  const filteredUsers = users.filter(user => {
    if (
      searchQuery &&
      !user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !user.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <Text style={styles.headerSubtitle}>System configuration and user management</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'users' && styles.tabActive]}
          onPress={() => setSelectedTab('users')}
        >
          <Text style={[styles.tabText, selectedTab === 'users' && styles.tabTextActive]}>
            Users
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'roles' && styles.tabActive]}
          onPress={() => setSelectedTab('roles')}
        >
          <Text style={[styles.tabText, selectedTab === 'roles' && styles.tabTextActive]}>
            Roles
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'settings' && styles.tabActive]}
          onPress={() => setSelectedTab('settings')}
        >
          <Text style={[styles.tabText, selectedTab === 'settings' && styles.tabTextActive]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {selectedTab === 'users' && (
          <>
            <View style={styles.searchSection}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search users..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={palette.textTertiary}
              />
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>All Users ({users.length})</Text>
                <TouchableOpacity>
                  <Text style={styles.addButton}>Add User</Text>
                </TouchableOpacity>
              </View>

              {filteredUsers.map((user, index) => (
                <View key={user.id}>
                  <View style={styles.userCard}>
                    <View style={styles.userLeft}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                          {user.name
                            .split(' ')
                            .map(n => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)}
                        </Text>
                      </View>
                      <View style={styles.userContent}>
                        <View style={styles.userNameRow}>
                          <Text style={styles.userName}>{user.name}</Text>
                          <View
                            style={[
                              styles.roleBadge,
                              { backgroundColor: `${getRoleColor(user.role)}15` },
                            ]}
                          >
                            <Text
                              style={[styles.roleBadgeText, { color: getRoleColor(user.role) }]}
                            >
                              {getRoleLabel(user.role)}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.userEmail}>{user.email}</Text>
                        <Text style={styles.userLastActive}>
                          {user.status === 'active' ? 'Active' : 'Inactive'} | Last seen{' '}
                          {formatLastActive(user.lastActive)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.userActions}>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleEditUser(user)}
                      >
                        <Text style={styles.editButtonText}>Edit</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {index < filteredUsers.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </>
        )}

        {selectedTab === 'roles' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Role Permissions</Text>
            <View style={styles.card}>
              <View style={styles.roleRow}>
                <View style={styles.roleInfo}>
                  <View
                    style={[styles.roleIcon, { backgroundColor: `${palette.alertCritical}15` }]}
                  >
                    <Text style={[styles.roleIconText, { color: palette.alertCritical }]}>A</Text>
                  </View>
                  <View>
                    <Text style={styles.roleName}>Admin</Text>
                    <Text style={styles.roleDescription}>Full system access</Text>
                  </View>
                </View>
                <TouchableOpacity>
                  <Text style={styles.configureText}>Configure</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.divider} />
              <View style={styles.roleRow}>
                <View style={styles.roleInfo}>
                  <View style={[styles.roleIcon, { backgroundColor: `${palette.alertWarning}15` }]}>
                    <Text style={[styles.roleIconText, { color: palette.alertWarning }]}>M</Text>
                  </View>
                  <View>
                    <Text style={styles.roleName}>Manager</Text>
                    <Text style={styles.roleDescription}>Team and approval management</Text>
                  </View>
                </View>
                <TouchableOpacity>
                  <Text style={styles.configureText}>Configure</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.divider} />
              <View style={styles.roleRow}>
                <View style={styles.roleInfo}>
                  <View style={[styles.roleIcon, { backgroundColor: `${palette.primary}15` }]}>
                    <Text style={[styles.roleIconText, { color: palette.primary }]}>U</Text>
                  </View>
                  <View>
                    <Text style={styles.roleName}>User</Text>
                    <Text style={styles.roleDescription}>Standard user access</Text>
                  </View>
                </View>
                <TouchableOpacity>
                  <Text style={styles.configureText}>Configure</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {selectedTab === 'settings' && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Feature Flags</Text>
              <View style={styles.card}>
                <View style={styles.settingRow}>
                  <View>
                    <Text style={styles.settingLabel}>New UI Design</Text>
                    <Text style={styles.settingDescription}>Enable updated interface</Text>
                  </View>
                  <Switch
                    value={featureFlags.newUI}
                    onValueChange={value => setFeatureFlags({ ...featureFlags, newUI: value })}
                    trackColor={{ false: palette.border, true: palette.primary }}
                  />
                </View>
                <View style={styles.divider} />
                <View style={styles.settingRow}>
                  <View>
                    <Text style={styles.settingLabel}>AI Assistant</Text>
                    <Text style={styles.settingDescription}>Beta feature</Text>
                  </View>
                  <Switch
                    value={featureFlags.aiAssistant}
                    onValueChange={value =>
                      setFeatureFlags({ ...featureFlags, aiAssistant: value })
                    }
                    trackColor={{ false: palette.border, true: palette.primary }}
                  />
                </View>
                <View style={styles.divider} />
                <View style={styles.settingRow}>
                  <View>
                    <Text style={styles.settingLabel}>Advanced Analytics</Text>
                    <Text style={styles.settingDescription}>Detailed reporting</Text>
                  </View>
                  <Switch
                    value={featureFlags.advancedAnalytics}
                    onValueChange={value =>
                      setFeatureFlags({ ...featureFlags, advancedAnalytics: value })
                    }
                    trackColor={{ false: palette.border, true: palette.primary }}
                  />
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>System Info</Text>
              <View style={styles.card}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>App Version</Text>
                  <Text style={styles.infoValue}>2.0.0</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Database Status</Text>
                  <Text style={[styles.infoValue, { color: palette.alertSuccess }]}>Healthy</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Last Backup</Text>
                  <Text style={styles.infoValue}>Dec 29, 10:00 AM</Text>
                </View>
              </View>
            </View>
          </>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {users.filter(u => u.status === 'active').length}
              </Text>
              <Text style={styles.statLabel}>Active Users</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>User Roles</Text>
            </View>
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
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
    backgroundColor: palette.background,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: palette.primary,
  },
  tabText: {
    ...typography.body,
    color: palette.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: palette.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing.xxl,
  },
  searchSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  searchInput: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    ...typography.body,
    color: palette.text,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: palette.text,
    marginBottom: spacing.md,
  },
  addButton: {
    ...typography.secondary,
    color: palette.primary,
    fontWeight: '600',
  },
  userCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  userLeft: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.bodyBold,
    color: palette.textInverse,
    fontSize: 16,
  },
  userContent: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 2,
  },
  userName: {
    ...typography.body,
    color: palette.text,
    fontWeight: '600',
  },
  roleBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.badge,
  },
  roleBadgeText: {
    ...typography.label,
    fontSize: 9,
    fontWeight: '700',
  },
  userEmail: {
    ...typography.secondary,
    fontSize: 12,
    color: palette.textSecondary,
    marginBottom: 2,
  },
  userLastActive: {
    ...typography.secondary,
    fontSize: 11,
    color: palette.textTertiary,
  },
  userActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  editButton: {
    paddingVertical: spacing.sm - 2,
    paddingHorizontal: spacing.md,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.button,
  },
  editButtonText: {
    ...typography.secondary,
    fontSize: 12,
    color: palette.primary,
    fontWeight: '600',
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow.light,
  },
  roleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  roleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  roleIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleIconText: {
    ...typography.bodyBold,
    fontSize: 18,
  },
  roleName: {
    ...typography.body,
    color: palette.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  roleDescription: {
    ...typography.secondary,
    fontSize: 12,
    color: palette.textSecondary,
  },
  configureText: {
    ...typography.secondary,
    color: palette.primary,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
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
  divider: {
    height: 1,
    backgroundColor: palette.border,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadow.light,
  },
  statValue: {
    ...typography.h3,
    color: palette.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.secondary,
    color: palette.textSecondary,
    textAlign: 'center',
  },
});
