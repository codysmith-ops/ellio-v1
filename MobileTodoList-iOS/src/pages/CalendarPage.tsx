import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { palette, spacing, radius, typography, shadow } from '../theme';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: 'task' | 'meeting' | 'deadline';
  priority: 'high' | 'medium' | 'low';
}

export const CalendarPage: React.FC = () => {
  const [selectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Review Q4 Report',
      date: new Date('2025-12-31'),
      time: '10:00 AM',
      type: 'deadline',
      priority: 'high',
    },
    {
      id: '2',
      title: 'Team Standup',
      date: new Date('2025-12-29'),
      time: '9:00 AM',
      type: 'meeting',
      priority: 'medium',
    },
    {
      id: '3',
      title: 'Submit Budget Proposal',
      date: new Date('2025-12-30'),
      time: '3:00 PM',
      type: 'task',
      priority: 'high',
    },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getEventForDate = (day: number) => {
    const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return palette.alertCritical;
      case 'medium':
        return palette.alertWarning;
      case 'low':
        return palette.alertSuccess;
      default:
        return palette.textSecondary;
    }
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const todayEvents = events.filter(event => {
    const today = new Date();
    const eventDate = new Date(event.date);
    return (
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear()
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
        <Text style={styles.headerSubtitle}>{getMonthName(selectedDate)}</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.viewModeSection}>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'month' && styles.viewModeButtonActive]}
            onPress={() => setViewMode('month')}
          >
            <Text style={[styles.viewModeText, viewMode === 'month' && styles.viewModeTextActive]}>
              Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'week' && styles.viewModeButtonActive]}
            onPress={() => setViewMode('week')}
          >
            <Text style={[styles.viewModeText, viewMode === 'week' && styles.viewModeTextActive]}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'day' && styles.viewModeButtonActive]}
            onPress={() => setViewMode('day')}
          >
            <Text style={[styles.viewModeText, viewMode === 'day' && styles.viewModeTextActive]}>
              Day
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.calendarCard}>
          <View style={styles.weekDays}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <View key={index} style={styles.weekDayCell}>
                <Text style={styles.weekDayText}>{day}</Text>
              </View>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {getDaysInMonth(selectedDate).map((day, index) => {
              const dayEvents = day ? getEventForDate(day) : [];
              const isToday =
                day &&
                day === new Date().getDate() &&
                selectedDate.getMonth() === new Date().getMonth() &&
                selectedDate.getFullYear() === new Date().getFullYear();

              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.dayCell, isToday ? styles.dayCellToday : null]}
                  disabled={!day}
                >
                  {day && (
                    <>
                      <Text style={[styles.dayText, isToday ? styles.dayTextToday : null]}>
                        {day}
                      </Text>
                      {dayEvents.length > 0 && (
                        <View style={styles.eventDots}>
                          {dayEvents.slice(0, 3).map((event, i) => (
                            <View
                              key={i}
                              style={[
                                styles.eventDot,
                                { backgroundColor: getPriorityColor(event.priority) },
                              ]}
                            />
                          ))}
                        </View>
                      )}
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Events</Text>
          {todayEvents.length > 0 ? (
            todayEvents.map((event, index) => (
              <View key={event.id}>
                <TouchableOpacity style={styles.eventCard}>
                  <View style={styles.eventLeft}>
                    <View
                      style={[
                        styles.eventIndicator,
                        { backgroundColor: getPriorityColor(event.priority) },
                      ]}
                    />
                    <View style={styles.eventContent}>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                      <View style={styles.eventMeta}>
                        <Text style={styles.eventTime}>{event.time}</Text>
                        <Text style={styles.eventDivider}>|</Text>
                        <Text style={styles.eventType}>{getTypeLabel(event.type)}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
                {index < todayEvents.length - 1 && <View style={styles.divider} />}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No events today</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Deadlines</Text>
          {events
            .filter(event => event.type === 'deadline')
            .map((event, index) => (
              <View key={event.id}>
                <TouchableOpacity style={styles.eventCard}>
                  <View style={styles.eventLeft}>
                    <View
                      style={[
                        styles.eventIndicator,
                        { backgroundColor: getPriorityColor(event.priority) },
                      ]}
                    />
                    <View style={styles.eventContent}>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                      <View style={styles.eventMeta}>
                        <Text style={styles.eventTime}>
                          {event.date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Text>
                        <Text style={styles.eventDivider}>|</Text>
                        <Text style={styles.eventTime}>{event.time}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
                {index < events.filter(e => e.type === 'deadline').length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}
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
  viewModeSection: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.button,
    alignItems: 'center',
  },
  viewModeButtonActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  viewModeText: {
    ...typography.secondary,
    color: palette.textSecondary,
    fontWeight: '600',
  },
  viewModeTextActive: {
    color: palette.textInverse,
  },
  calendarCard: {
    marginHorizontal: spacing.lg,
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.md,
    ...shadow.light,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  weekDayText: {
    ...typography.label,
    color: palette.textSecondary,
    fontWeight: '700',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
  },
  dayCellToday: {
    backgroundColor: palette.primary,
    borderRadius: radius.button,
  },
  dayText: {
    ...typography.secondary,
    color: palette.text,
  },
  dayTextToday: {
    color: palette.textInverse,
    fontWeight: '700',
  },
  eventDots: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
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
  eventCard: {
    paddingVertical: spacing.md,
  },
  eventLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  eventIndicator: {
    width: 4,
    height: 48,
    borderRadius: 2,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    ...typography.body,
    color: palette.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  eventTime: {
    ...typography.secondary,
    fontSize: 12,
    color: palette.textSecondary,
  },
  eventDivider: {
    ...typography.secondary,
    fontSize: 12,
    color: palette.border,
  },
  eventType: {
    ...typography.label,
    fontSize: 10,
    color: palette.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: palette.border,
  },
  emptyState: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
});
