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

interface Period {
  id: string;
  time: string;
  subject: string;
  class: string;
  section: string;
  room: string;
  attendanceMarked: boolean;
}

interface TeacherDashboardData {
  teacherName: string;
  todayPeriods: Period[];
  pendingAttendance: number;
  pendingGrading: number;
  classStrengthToday: { class: string; present: number; total: number }[];
}

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const [data, setData] = useState<TeacherDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await apiClient.get(ENDPOINTS.TEACHER_DASHBOARD);
      setData(res.data);
    } catch {
      setData({
        teacherName: user?.name || 'Teacher',
        todayPeriods: [
          { id: '1', time: '8:00 AM', subject: 'Mathematics', class: '10', section: 'A', room: 'Room 101', attendanceMarked: true },
          { id: '2', time: '9:00 AM', subject: 'Mathematics', class: '9', section: 'B', room: 'Room 102', attendanceMarked: false },
          { id: '3', time: '11:00 AM', subject: 'Mathematics', class: '10', section: 'C', room: 'Room 201', attendanceMarked: false },
          { id: '4', time: '1:00 PM', subject: 'Mathematics', class: '8', section: 'A', room: 'Room 103', attendanceMarked: false },
        ],
        pendingAttendance: 3,
        pendingGrading: 12,
        classStrengthToday: [
          { class: '10-A', present: 38, total: 42 },
          { class: '9-B', present: 35, total: 40 },
          { class: '10-C', present: 41, total: 44 },
          { class: '8-A', present: 36, total: 38 },
        ],
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchDashboard(); };

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={NAVY} /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Teacher Portal</Text>
            <Text style={styles.userName}>{data?.teacherName}</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Pending Actions */}
        <View style={styles.pendingRow}>
          <View style={[styles.pendingCard, { borderTopColor: '#dc2626' }]}>
            <Text style={styles.pendingCount}>{data?.pendingAttendance}</Text>
            <Text style={styles.pendingLabel}>Attendance{'\n'}Pending</Text>
          </View>
          <View style={[styles.pendingCard, { borderTopColor: '#d97706' }]}>
            <Text style={styles.pendingCount}>{data?.pendingGrading}</Text>
            <Text style={styles.pendingLabel}>Assignments{'\n'}to Grade</Text>
          </View>
          <View style={[styles.pendingCard, { borderTopColor: '#2563eb' }]}>
            <Text style={styles.pendingCount}>{data?.todayPeriods.length}</Text>
            <Text style={styles.pendingLabel}>Classes{'\n'}Today</Text>
          </View>
        </View>

        {/* Today's Periods */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Today's Timetable</Text>
          {data?.todayPeriods.map((p, i) => (
            <View key={p.id} style={[styles.periodRow, i < (data.todayPeriods.length - 1) && styles.periodBorder]}>
              <View style={styles.periodTime}>
                <Text style={styles.periodTimeText}>{p.time}</Text>
              </View>
              <View style={styles.periodInfo}>
                <Text style={styles.periodSubject}>{p.subject}</Text>
                <Text style={styles.periodMeta}>Class {p.class}-{p.section} • {p.room}</Text>
              </View>
              <View style={[styles.attBadge, p.attendanceMarked ? styles.attDone : styles.attPending]}>
                <Text style={styles.attText}>{p.attendanceMarked ? 'Done' : 'Mark'}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Class Strength */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Class Strength Today</Text>
          {data?.classStrengthToday.map((c, i) => {
            const pct = Math.round((c.present / c.total) * 100);
            return (
              <View key={i} style={styles.strengthRow}>
                <Text style={styles.strengthClass}>{c.class}</Text>
                <View style={styles.strengthBar}>
                  <View style={[styles.strengthFill, { width: `${pct}%`, backgroundColor: pct >= 80 ? '#16a34a' : '#d97706' }]} />
                </View>
                <Text style={styles.strengthCount}>{c.present}/{c.total}</Text>
              </View>
            );
          })}
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

  pendingRow: { flexDirection: 'row', marginHorizontal: 16, marginTop: 14, gap: 10 },
  pendingCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderTopWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  pendingCount: { fontSize: 28, fontWeight: '800', color: NAVY },
  pendingLabel: { fontSize: 11, color: '#6b7280', textAlign: 'center', marginTop: 4 },

  card: { backgroundColor: '#fff', borderRadius: 14, padding: 18, marginHorizontal: 16, marginTop: 14, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  cardLabel: { fontSize: 12, color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', marginBottom: 14, letterSpacing: 0.5 },

  periodRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 10 },
  periodBorder: { borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  periodTime: { width: 72 },
  periodTimeText: { fontSize: 12, color: '#6b7280', fontWeight: '500' },
  periodInfo: { flex: 1 },
  periodSubject: { fontSize: 15, fontWeight: '700', color: NAVY },
  periodMeta: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  attBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8 },
  attDone: { backgroundColor: '#dcfce7' },
  attPending: { backgroundColor: '#fee2e2' },
  attText: { fontSize: 12, fontWeight: '700', color: '#374151' },

  strengthRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  strengthClass: { width: 52, fontSize: 13, fontWeight: '600', color: '#374151' },
  strengthBar: { flex: 1, height: 8, backgroundColor: '#f1f5f9', borderRadius: 4, overflow: 'hidden' },
  strengthFill: { height: '100%', borderRadius: 4 },
  strengthCount: { width: 46, fontSize: 12, color: '#6b7280', textAlign: 'right' },
});
