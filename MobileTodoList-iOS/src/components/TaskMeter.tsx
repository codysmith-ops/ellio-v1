import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { EllioColors, EllioSpacing, EllioRadius, EllioTypography } from '../theme/ellioTokens';
import { Task } from '../store';

export type TimeframeType = 'today' | 'week' | 'month' | 'all';

interface TaskMeterProps {
  tasks: Task[];
  timeframe?: TimeframeType;
  title?: string;
  onCategoryPress?: (category: string) => void;
}

// Helper function to detect task type from title
const getTaskType = (title: string): string => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('return') || lowerTitle.includes('refund')) {
    return 'returns';
  }
  if (
    lowerTitle.includes('grocery') ||
    lowerTitle.includes('groceries') ||
    lowerTitle.includes('food') ||
    lowerTitle.includes('produce')
  ) {
    return 'groceries';
  }
  if (
    lowerTitle.includes('hardware') ||
    lowerTitle.includes('tool') ||
    lowerTitle.includes('repair')
  ) {
    return 'hardware';
  }
  if (
    lowerTitle.includes('retail') ||
    lowerTitle.includes('store') ||
    lowerTitle.includes('shop')
  ) {
    return 'retail';
  }
  if (
    lowerTitle.includes('medical') ||
    lowerTitle.includes('pharmacy') ||
    lowerTitle.includes('doctor') ||
    lowerTitle.includes('prescription')
  ) {
    return 'medical';
  }
  if (
    lowerTitle.includes('home') ||
    lowerTitle.includes('house') ||
    lowerTitle.includes('cleaning')
  ) {
    return 'home';
  }
  return 'other';
};

// Task categories with colors
export const TASK_CATEGORIES = {
  groceries: { label: 'Groceries', color: '#10B981', icon: 'grocery' },
  returns: { label: 'Returns', color: '#EF4444', icon: 'iconicon' },
  hardware: { label: 'Hardware', color: '#F59E0B', icon: 'tools' },
  retail: { label: 'Retail', color: '#3B82F6', icon: 'store' },
  medical: { label: 'Medical', color: '#8B5CF6', icon: 'iconicon' },
  home: { label: 'Home', color: '#14B8A6', icon: 'home' },
  other: { label: 'Other', color: '#6B7280', icon: 'list' },
};

export const TaskMeter: React.FC<TaskMeterProps> = ({
  tasks,
  timeframe = 'all',
  title,
  onCategoryPress,
}) => {
  // Filter tasks by timeframe
  const filterByTimeframe = (task: Task): boolean => {
    if (!task.dueDate) {
      return timeframe === 'all';
    }

    const now = new Date();
    const dueDate = new Date(task.dueDate);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const taskDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

    switch (timeframe) {
      case 'today':
        return taskDate.getTime() === today.getTime();
      case 'week':
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + 7);
        return taskDate >= today && taskDate < weekEnd;
      case 'month':
        const monthEnd = new Date(today);
        monthEnd.setMonth(today.getMonth() + 1);
        return taskDate >= today && taskDate < monthEnd;
      case 'all':
      default:
        return true;
    }
  };

  // Filter out completed tasks and apply timeframe filter
  const activeTasks = tasks.filter(t => !t.completed && filterByTimeframe(t));
  const completedTasks = tasks.filter(t => t.completed && filterByTimeframe(t)).length;

  // Categorize active tasks by type
  const categorized = activeTasks.reduce((acc, task) => {
    const type = getTaskType(task.title);
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const totalTasks = activeTasks.length;

  // Calculate percentages for each category
  const percentages = Object.keys(TASK_CATEGORIES).reduce((acc, key) => {
    const count = categorized[key]?.length || 0;
    acc[key] = totalTasks > 0 ? (count / totalTasks) * 100 : 0;
    return acc;
  }, {} as Record<string, number>);

  const getTimeframeLabel = (): string => {
    switch (timeframe) {
      case 'today':
        return 'Due Today';
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'all':
        return 'All Tasks';
      default:
        return 'Tasks';
    }
  };

  if (totalTasks === 0 && timeframe !== 'all') {
    return null; // Don't show empty timeframe meters
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title || getTimeframeLabel()}</Text>
        <Text style={styles.subtitle}>
          {totalTasks} active{completedTasks > 0 ? ` • ${completedTasks} done` : ''}
        </Text>
      </View>

      {totalTasks === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            No tasks{' '}
            {timeframe !== 'all'
              ? `due ${timeframe === 'today' ? 'today' : `this ${timeframe}`}`
              : 'yet'}
          </Text>
        </View>
      ) : (
        <>
          {/* Visual meter bar */}
          <View style={styles.meterBar}>
            {Object.entries(TASK_CATEGORIES).map(([key, category]) => {
              const width = percentages[key];
              if (width === 0) {
                return null;
              }

              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.meterSegment,
                    { width: `${width}%`, backgroundColor: category.color },
                  ]}
                  onPress={() => onCategoryPress?.(key)}
                  activeOpacity={0.7}
                />
              );
            })}
          </View>

          {/* Legend with counts */}
          <View style={styles.legend}>
            {Object.entries(TASK_CATEGORIES).map(([key, category]) => {
              const count = categorized[key]?.length || 0;
              if (count === 0) {
                return null;
              }

              return (
                <TouchableOpacity
                  key={key}
                  style={styles.legendItem}
                  onPress={() => onCategoryPress?.(key)}
                  activeOpacity={0.7}
                >
                  <View style={styles.legendLeft}>
                    <View style={[styles.legendDot, { backgroundColor: category.color }]} />
                    <Text style={styles.legendIcon}>{category.icon}</Text>
                    <Text style={styles.legendLabel}>{category.label}</Text>
                  </View>
                  <View style={styles.legendRight}>
                    <Text style={styles.legendCount}>{count}</Text>
                    <Text style={styles.legendPercent}>({percentages[key].toFixed(0)}%)</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: EllioColors.surface.background,
    marginHorizontal: EllioSpacing.lg,
    marginTop: EllioSpacing.lg,
    padding: EllioSpacing.lg,
    borderRadius: EllioRadius.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: EllioSpacing.md,
  },
  title: {
    ...EllioTypography.subtitle,
    color: palette.text,
    marginBottom: 4,
  },
  subtitle: {
    ...EllioTypography.secondary,
    color: EllioColors.text.secondary,
  },
  emptyState: {
    paddingVertical: EllioSpacing.md,
    alignItems: 'center',
  },
  emptyText: {
    ...EllioTypography.body,
    color: EllioColors.text.tertiary,
    fontStyle: 'italic',
  },
  meterBar: {
    flexDirection: 'row',
    height: 24,
    borderRadius: EllioRadius.button,
    overflow: 'hidden',
    marginBottom: EllioSpacing.md,
  },
  meterSegment: {
    height: '100%',
  },
  legend: {
    gap: EllioSpacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: EllioSpacing.xs,
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: EllioSpacing.sm,
    flex: 1,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendIcon: {
    fontSize: 16,
  },
  legendLabel: {
    ...EllioTypography.body,
    color: palette.text,
  },
  legendRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: EllioSpacing.xs,
  },
  legendCount: {
    ...EllioTypography.bodyBold,
    color: palette.text,
    fontSize: 16,
  },
  legendPercent: {
    ...EllioTypography.secondary,
    color: EllioColors.text.secondary,
  },
});
