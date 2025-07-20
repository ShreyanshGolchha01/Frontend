import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

interface Notification {
  id: string;
  type: 'health' | 'camp' | 'reminder' | 'report' | 'system';
  title: string;
  message: string;
  time: string;
  date: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  actionRequired?: boolean;
}

// Empty notification data - Connect to your backend
const notificationsData: Notification[] = [];

interface NotificationScreenProps {
  onBack: () => void;
}

const NotificationScreen: React.FC<NotificationScreenProps> = ({ onBack }) => {
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'important'>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'health':
        return { icon: 'medical-services', colors: ['#27ae60', '#16a085'] as const };
      case 'camp':
        return { icon: 'event', colors: ['#3498db', '#2980b9'] as const };
      case 'reminder':
        return { icon: 'notifications', colors: ['#f39c12', '#e67e22'] as const };
      case 'report':
        return { icon: 'description', colors: ['#9b59b6', '#8e44ad'] as const };
      case 'system':
        return { icon: 'system-update', colors: ['#34495e', '#2c3e50'] as const };
      default:
        return { icon: 'info', colors: ['#3498db', '#2980b9'] as const };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return COLORS.error;
      case 'medium':
        return COLORS.warning;
      case 'low':
        return COLORS.info;
      default:
        return COLORS.gray[400];
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    Alert.alert(
      'सूचना हटाएं',
      'क्या आप इस सूचना को हटाना चाहते हैं?',
      [
        { text: 'रद्द करें', style: 'cancel' },
        {
          text: 'हटाएं',
          style: 'destructive',
          onPress: () => {
            setNotifications(prev => prev.filter(notification => notification.id !== id));
          }
        }
      ]
    );
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (selectedFilter) {
      case 'unread':
        return !notification.isRead;
      case 'important':
        return notification.priority === 'high' || notification.actionRequired;
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderNotificationCard = ({ item }: { item: Notification }) => {
    const { icon, colors } = getNotificationIcon(item.type);
    
    return (
      <TouchableOpacity
        style={styles.notificationCard}
        activeOpacity={0.8}
        onPress={() => markAsRead(item.id)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={colors}
              style={styles.iconGradient}
            >
              <MaterialIcons name={icon as any} size={24} color="white" />
            </LinearGradient>
            <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(item.priority) }]} />
          </View>
          
          <View style={styles.cardContent}>
            <View style={styles.headerRow}>
              <Text style={styles.notificationTitle}>
                {item.title}
              </Text>
              <TouchableOpacity
                onPress={() => deleteNotification(item.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="close" size={18} color={COLORS.gray[400]} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.notificationMessage} numberOfLines={3}>
              {item.message}
            </Text>
            
            <View style={styles.footerRow}>
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterButton = (filter: typeof selectedFilter, label: string, count?: number) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.activeFilterButton
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={[
        styles.filterText,
        selectedFilter === filter && styles.activeFilterText
      ]}>
        {label}
        {count !== undefined && count > 0 && ` (${count})`}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {renderFilterButton('all', 'सभी', notifications.length)}
          {renderFilterButton('unread', 'अपठित', unreadCount)}
          {renderFilterButton('important', 'महत्वपूर्ण', notifications.filter(n => n.priority === 'high' || n.actionRequired).length)}
        </ScrollView>
      </View>

      {/* Notifications List */}
      <View style={styles.content}>
        {filteredNotifications.length > 0 ? (
          <FlatList
            data={filteredNotifications}
            renderItem={renderNotificationCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>कोई सूचना नहीं</Text>
            <Text style={styles.emptyMessage}>
              {selectedFilter === 'unread' && 'कोई अपठित सूचना नहीं है'}
              {selectedFilter === 'important' && 'कोई महत्वपूर्ण सूचना नहीं है'}
              {selectedFilter === 'all' && 'अभी तक कोई सूचना नहीं आई है'}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filterContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  filterScroll: {
    paddingHorizontal: SPACING.lg,
  },
  filterButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.gray[100],
    marginRight: SPACING.sm,
    ...SHADOWS.small,
  },
  activeFilterButton: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.medium,
  },
  filterText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: FONTS.weights.medium,
  },
  activeFilterText: {
    color: COLORS.white,
    fontWeight: FONTS.weights.semibold,
  },
  content: {
    flex: 1,
  },
  listContainer: {
    padding: SPACING.lg,
  },
  notificationCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    position: 'relative',
    marginRight: SPACING.md,
  },
  iconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  priorityDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  cardContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  notificationTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: SPACING.sm,
  },
  deleteButton: {
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  notificationMessage: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    ...SHADOWS.small,
  },
  emptyTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptyMessage: {
    fontSize: FONTS.sizes.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default NotificationScreen;
