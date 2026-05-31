import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { apiClient, ENDPOINTS } from '../../config/api';

interface Child {
  id: string;
  name: string;
  class: string;
  section: string;
}

interface ParentDashboardData {
  children: Child[];
  attendanceToday: 'PRESENT' | 'ABSENT' | 'NOT_MARKED';
  feeDue: number;
  feeLastPaid: string;
  todaySchedule: { time: string; subject: string }[];
  homeworkPending: number;
  recentNotices: { title: string; date: string; type: string }[];
}

export default function ParentDashboard() {
  const { user, logout } = useAuth();
  const [data, setData] = useState<ParentDashboardData | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await apiClient.get(ENDPOINTS.PARENT_DASHBOARD, {
        params: { childId: selectedChildId },
      });
      setData(res.data);
      if (!selectedChildId && res.data.children?.length) {
        setSelectedChildId(res.data.children[0].id);
      }
    } catch {
      const mockChildren = [
        { id: 'c1', name: 'Arjun Sharma', class: '10', section: 'A' },
        { id: 'c2', name: 'Priya Sharma', class: '7', section: 'B' },
      ];
      setData({
        children: mockChildren,
        attendanceToday: 'PRESENT',
        feeDue: 18500,
        feeLastPaid: '15 Apr 2025',
        todaySchedule: [
          { time: '8:00 AM', subject: 'Mathematics' },
          { time: '9:00 AM', subject: 'English' },
          { time: '10:00 AM', subject: 'Science' },
          { time: '11:00 AM', subject: 'Hindi' },
        ],
        homeworkPending: 3,
        recentNotices: [
          { title: 'Annual Sports Day on 10th June', date: '28 May', type: 'EVENT' },
          { title: 'PTM scheduled for 5th June', date: '25 May', type: 'MEETING' },
          { title: 'Exam timetable released', date: '20 May', type: 'EXAM' },
        ],
      });
      if (!selectedChildId) setSelectedChildId('c1');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, [selectedChildId]);
  const onRefresh = () => { setRefreshing(true); fetchDashboard(); };

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={NAVY} /></View>;
  }

  const selectedChild = data?.children.find((c) => c.id === selectedChildId);
  const attendanceColor =
    data?.attendanceToday === 'PRESENT' ? '#16a34a' :
    data?.attendanceToday === 'ABSENT' ? '#dc2626' : '#d97706';

  const noticeTypeColor = (type: string) =>
    type === 'EXAM' ? '#dc2626' : type === 'MEETING' ? '#2563eb' : '#16a34a';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Parent Portal</Text>
            <Text style={styles.userName}>{user?.name}</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Child Selector */}
        {(data?.children?.length ?? 0) > 1 && (
          <View style={styles.childSelector}>
            <Text style={styles.sectionLabel}>Select Child</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {data!.children.map((child) => (
                <TouchableOpacity
                  key={child.id}
                  style={[styles.childChip, selectedChildId === child.id && styles.childChipActive]}
                  onPress={() => setSelectedChildId(child.id)}
                >
                  <Text style={[styles.childChipText, selectedChildId === child.id && styles.childChipTextActive]}>
                    {child.name}
                  </Text>
                  <Text style={[styles.childClass, selectedChildId === child.id && { color: '#93b4d4' }]}>
                    Class {child.class}-{child.section}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Attendance Big Card */}
        <View style={[styles.card, { borderLeftWidth: 5, borderLeftColor: attendanceColor }]}>
          <Text style={styles.cardLabel}>Today's Attendance — {selectedChild?.name}</Text>
          <Text style={[styles.attendanceBig, { color: attendanceColor }]}>
            {data?.attendanceToday ?? 'NOT MARKED'}
          </Text>
        </View>

        {/* Fee Due */}
        {data?.feeDue && data.feeDue > 0 ? (
          <View style={[styles.card, styles.feeCard]}>
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.feeLabel}>Fee Due</Text>
                <Text style={styles.feeAmount}>₹{data.feeDue.toLocaleString('en-IN')}</Text>
                <Text style={styles.feeLastPaid}>Last paid: {data.feeLastPaid}</Text>
              </View>
              <TouchableOpacity style={styles.payBtn}>
                <Text style={styles.payBtnText}>Pay Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={[styles.card, { borderLeftWidth: 5, borderLeftColor: '#16a34a' }]}>
            <Text style={styles.cardLabel}>Fees</Text>
            <Text style={{ color: '#16a34a', fontWeight: '700', fontSize: 16 }}>All fees paid!</Text>
          </View>
        )}

        {/* Today's Schedule */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Today's Schedule</Text>
          {data?.todaySchedule.map((s, i) => (
            <View key={i} style={styles.scheduleRow}>
              <Text style={styles.scheduleTime}>{s.time}</Text>
              <Text style={styles.scheduleSubject}>{s.subject}</Text>
            </View>
          ))}
        </View>

        {/* Homework Pending */}
        <View style={[styles.card, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
          <Text style={styles.cardLabel}>Homework Pending</Text>
          <View style={styles.hwBadge}>
            <Text style={styles.hwCount}>{data?.homeworkPending ?? 0}</Text>
          </View>
        </View>

        {/* Recent Notices */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Recent School Notices</Text>
          {data?.recentNotices.map((n, i) => (
            <View key={i} style={styles.noticeRow}>
              <View style={[styles.noticeTypeBadge, { backgroundColor: noticeTypeColor(n.type) }]}>
                <Text style={styles.noticeTypeText}>{n.type}</Text>
              </View>
              <View style={styles.noticeInfo}>
                <Text style={styles.noticeTitle}>{n.title}</Text>
                <Text style={styles.noticeDate}>{n.date}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const NAVY = '#1e3a5f';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: NAVY,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  greeting: { color: '#93b4d4', fontSize: 13 },
  userName: { color: '#fff', fontSize: 20, fontWeight: '700' },
  logoutBtn: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8 },
  logoutText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  childSelector: { backgroundColor: '#fff', padding: 16, marginTop: 0 },
  sectionLabel: { fontSize: 12, fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: 10 },
  childChip: { marginRight: 10, borderRadius: 12, borderWidth: 1.5, borderColor: '#d1d5db', padding: 10, minWidth: 120, backgroundColor: '#f9fafb' },
  childChipActive: { borderColor: NAVY, backgroundColor: NAVY },
  childChipText: { fontSize: 14, fontWeight: '600', color: '#374151' },
  childChipTextActive: { color: '#fff' },
  childClass: { fontSize: 12, color: '#9ca3af', marginTop: 2 },

  card: { backgroundColor: '#fff', borderRadius: 14, padding: 18, marginHorizontal: 16, marginTop: 14, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  cardLabel: { fontSize: 12, color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', marginBottom: 10, letterSpacing: 0.5 },

  attendanceBig: { fontSize: 30, fontWeight: '800' },

  feeCard: { borderLeftWidth: 5, borderLeftColor: '#dc2626' },
  feeLabel: { fontSize: 12, color: '#dc2626', fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  feeAmount: { fontSize: 26, fontWeight: '800', color: '#dc2626' },
  feeLastPaid: { fontSize: 12, color: '#9ca3af', marginTop: 4 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  payBtn: { backgroundColor: NAVY, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 12 },
  payBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  scheduleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  scheduleTime: { width: 90, fontSize: 13, color: '#6b7280', fontWeight: '500' },
  scheduleSubject: { fontSize: 15, color: '#1f2937', fontWeight: '600' },

  hwBadge: { backgroundColor: NAVY, borderRadius: 24, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  hwCount: { color: '#fff', fontSize: 22, fontWeight: '800' },

  noticeRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', gap: 10 },
  noticeTypeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  noticeTypeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  noticeInfo: { flex: 1 },
  noticeTitle: { fontSize: 14, color: '#1f2937', fontWeight: '500' },
  noticeDate: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
});
