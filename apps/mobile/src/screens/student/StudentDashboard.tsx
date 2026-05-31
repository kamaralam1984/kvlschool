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

interface DashboardData {
  attendanceToday: 'PRESENT' | 'ABSENT' | 'NOT_MARKED';
  attendancePercent: number;
  nextClass: { subject: string; time: string; room: string } | null;
  feeDue: number;
  recentMarks: { subject: string; marks: number; total: number; grade: string }[];
  studentName: string;
}

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await apiClient.get(ENDPOINTS.STUDENT_DASHBOARD);
      setData(res.data);
    } catch {
      // Use mock data if API unavailable
      setData({
        attendanceToday: 'PRESENT',
        attendancePercent: 87,
        nextClass: { subject: 'Mathematics', time: '10:30 AM', room: 'Room 204' },
        feeDue: 12500,
        recentMarks: [
          { subject: 'Mathematics', marks: 88, total: 100, grade: 'A' },
          { subject: 'Science', marks: 76, total: 100, grade: 'B+' },
          { subject: 'English', marks: 92, total: 100, grade: 'A+' },
        ],
        studentName: user?.name || 'Student',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchDashboard(); };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={NAVY} />
      </View>
    );
  }

  const attendanceColor =
    data?.attendanceToday === 'PRESENT' ? '#16a34a' :
    data?.attendanceToday === 'ABSENT' ? '#dc2626' : '#d97706';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>{data?.studentName}</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Attendance Card */}
        <View style={[styles.card, { borderLeftColor: attendanceColor, borderLeftWidth: 5 }]}>
          <Text style={styles.cardLabel}>Today's Attendance</Text>
          <Text style={[styles.attendanceBig, { color: attendanceColor }]}>
            {data?.attendanceToday ?? 'NOT MARKED'}
          </Text>
          <Text style={styles.attendancePct}>
            Overall: {data?.attendancePercent}% this term
          </Text>
        </View>

        {/* Next Class */}
        {data?.nextClass && (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Next Class</Text>
            <Text style={styles.nextSubject}>{data.nextClass.subject}</Text>
            <View style={styles.rowBetween}>
              <Text style={styles.nextMeta}>{data.nextClass.time}</Text>
              <Text style={styles.nextMeta}>{data.nextClass.room}</Text>
            </View>
          </View>
        )}

        {/* Fee Due Alert */}
        {data?.feeDue && data.feeDue > 0 ? (
          <View style={[styles.card, styles.feeCard]}>
            <Text style={styles.feeLabel}>Fee Due</Text>
            <Text style={styles.feeAmount}>₹{data.feeDue.toLocaleString('en-IN')}</Text>
            <TouchableOpacity style={styles.payBtn}>
              <Text style={styles.payBtnText}>View Details</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Recent Marks */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Recent Marks</Text>
          {data?.recentMarks.map((m, i) => (
            <View key={i} style={styles.markRow}>
              <Text style={styles.markSubject}>{m.subject}</Text>
              <View style={styles.markRight}>
                <Text style={styles.markScore}>{m.marks}/{m.total}</Text>
                <View style={[styles.gradeBadge, { backgroundColor: gradeColor(m.grade) }]}>
                  <Text style={styles.gradeText}>{m.grade}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const gradeColor = (g: string) => {
  if (g.startsWith('A')) return '#16a34a';
  if (g.startsWith('B')) return '#2563eb';
  if (g.startsWith('C')) return '#d97706';
  return '#dc2626';
};

const NAVY = '#1e3a5f';
const GOLD = '#c9a84c';

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
  greeting: { color: '#93b4d4', fontSize: 14 },
  userName: { color: '#fff', fontSize: 20, fontWeight: '700' },
  logoutBtn: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8 },
  logoutText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardLabel: { fontSize: 12, color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 },

  attendanceBig: { fontSize: 28, fontWeight: '800', marginBottom: 4 },
  attendancePct: { fontSize: 13, color: '#6b7280' },

  nextSubject: { fontSize: 20, fontWeight: '700', color: NAVY, marginBottom: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  nextMeta: { fontSize: 14, color: '#6b7280' },

  feeCard: { borderLeftWidth: 5, borderLeftColor: '#dc2626' },
  feeLabel: { fontSize: 12, color: '#dc2626', fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  feeAmount: { fontSize: 26, fontWeight: '800', color: '#dc2626', marginBottom: 12 },
  payBtn: { backgroundColor: NAVY, borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  payBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  markRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  markSubject: { fontSize: 15, color: '#1f2937', fontWeight: '500' },
  markRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  markScore: { fontSize: 14, color: '#6b7280' },
  gradeBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  gradeText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
