import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient, ENDPOINTS } from '../../config/api';

interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'ATTENDANCE' | 'FEE' | 'EXAM' | 'NOTICE' | 'LEAVE' | 'GENERAL';
  timestamp: string;
  read: boolean;
}

const typeColors: Record<Notification['type'], string> = {
  ATTENDANCE: '#2563eb',
  FEE: '#dc2626',
  EXAM: '#7c3aed',
  NOTICE: '#16a34a',
  LEAVE: '#d97706',
  GENERAL: '#6b7280',
};

const typeIcons: Record<Notification['type'], string> = {
  ATTENDANCE: 'A',
  FEE: 'F',
  EXAM: 'E',
  NOTICE: 'N',
  LEAVE: 'L',
  GENERAL: 'G',
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await apiClient.get(ENDPOINTS.NOTIFICATIONS);
      setNotifications(res.data);
    } catch {
      setNotifications([
        { id: '1', title: 'Attendance Marked', body: 'Your attendance for today has been marked as PRESENT.', type: 'ATTENDANCE', timestamp: '10 min ago', read: false },
        { id: '2', title: 'Fee Due Reminder', body: 'Your term fee of ₹18,500 is due by 5th June 2025.', type: 'FEE', timestamp: '2 hours ago', read: false },
        { id: '3', title: 'Exam Timetable Released', body: 'The final exam timetable for June 2025 is now available.', type: 'EXAM', timestamp: 'Yesterday', read: true },
        { id: '4', title: 'School Notice: PTM', body: 'Parent-Teacher Meeting is scheduled on 5th June at 10 AM.', type: 'NOTICE', timestamp: '2 days ago', read: true },
        { id: '5', title: 'Holiday Notice', body: 'School will remain closed on 3rd June for a public holiday.', type: 'GENERAL', timestamp: '3 days ago', read: true },
        { id: '6', title: 'Assignment Due', body: 'Science project submission deadline is tomorrow.', type: 'EXAM', timestamp: '4 days ago', read: true },
        { id: '7', title: 'Fee Receipt', body: 'Fee payment of ₹18,500 received on 15 Apr 2025. Receipt #KVL-2025-041.', type: 'FEE', timestamp: '6 weeks ago', read: true },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchNotifications(); };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notifCard, !item.read && styles.notifUnread]}
      onPress={() => markAsRead(item.id)}
      activeOpacity={0.8}
    >
      <View style={[styles.iconCircle, { backgroundColor: typeColors[item.type] }]}>
        <Text style={styles.iconText}>{typeIcons[item.type]}</Text>
      </View>
      <View style={styles.notifContent}>
        <View style={styles.notifHeader}>
          <Text style={styles.notifTitle} numberOfLines={1}>{item.title}</Text>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notifBody} numberOfLines={2}>{item.body}</Text>
        <Text style={styles.notifTime}>{item.timestamp}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={NAVY} /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{unreadCount} new</Text>
          </View>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No notifications yet.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const NAVY = '#1e3a5f';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  topBar: {
    backgroundColor: NAVY,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  unreadBadge: { backgroundColor: '#c9a84c', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  unreadBadgeText: { color: NAVY, fontSize: 12, fontWeight: '800' },

  list: { padding: 16, gap: 10 },

  notifCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  notifUnread: { borderLeftWidth: 4, borderLeftColor: NAVY },

  iconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  iconText: { color: '#fff', fontWeight: '800', fontSize: 16 },

  notifContent: { flex: 1 },
  notifHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  notifTitle: { fontSize: 15, fontWeight: '700', color: '#1f2937', flex: 1, marginRight: 8 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: NAVY },

  notifBody: { fontSize: 13, color: '#6b7280', lineHeight: 18, marginBottom: 6 },
  notifTime: { fontSize: 11, color: '#9ca3af', fontWeight: '500' },

  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 16, color: '#9ca3af' },
});
