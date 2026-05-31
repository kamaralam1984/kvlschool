import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient, ENDPOINTS } from '../../config/api';
import { useAuth } from '../../context/AuthContext';

interface AttendanceRecord {
  date: string;
  day: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HOLIDAY';
}

interface AttendanceSummary {
  totalDays: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
  records: AttendanceRecord[];
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AttendanceScreen() {
  const { user } = useAuth();
  const [data, setData] = useState<AttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const fetchAttendance = async () => {
    try {
      const res = await apiClient.get(ENDPOINTS.STUDENT_ATTENDANCE, {
        params: { month: selectedMonth + 1 },
      });
      setData(res.data);
    } catch {
      // Mock data
      const records: AttendanceRecord[] = [];
      const daysInMonth = new Date(2025, selectedMonth + 1, 0).getDate();
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let d = 1; d <= Math.min(daysInMonth, 31); d++) {
        const date = new Date(2025, selectedMonth, d);
        const dayName = days[date.getDay()];
        if (date.getDay() === 0) {
          records.push({ date: `${d} ${MONTHS[selectedMonth]}`, day: dayName, status: 'HOLIDAY' });
        } else {
          const statuses: AttendanceRecord['status'][] = ['PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'ABSENT', 'LATE'];
          records.push({ date: `${d} ${MONTHS[selectedMonth]}`, day: dayName, status: statuses[d % statuses.length] });
        }
      }
      const present = records.filter((r) => r.status === 'PRESENT').length;
      const absent = records.filter((r) => r.status === 'ABSENT').length;
      const late = records.filter((r) => r.status === 'LATE').length;
      const working = records.filter((r) => r.status !== 'HOLIDAY').length;
      setData({
        totalDays: working,
        present,
        absent,
        late,
        percentage: Math.round(((present + late) / working) * 100),
        records,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchAttendance(); }, [selectedMonth]);
  const onRefresh = () => { setRefreshing(true); fetchAttendance(); };

  const statusColor = (s: AttendanceRecord['status']) => ({
    PRESENT: '#16a34a',
    ABSENT: '#dc2626',
    LATE: '#d97706',
    HOLIDAY: '#9ca3af',
  }[s]);

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={NAVY} /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topTitle}>Attendance</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Month Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthScroll}>
          {MONTHS.map((m, i) => (
            <TouchableOpacity
              key={m}
              style={[styles.monthChip, selectedMonth === i && styles.monthChipActive]}
              onPress={() => setSelectedMonth(i)}
            >
              <Text style={[styles.monthText, selectedMonth === i && styles.monthTextActive]}>{m}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { borderTopColor: '#16a34a' }]}>
            <Text style={[styles.summaryNum, { color: '#16a34a' }]}>{data?.present}</Text>
            <Text style={styles.summaryLabel}>Present</Text>
          </View>
          <View style={[styles.summaryCard, { borderTopColor: '#dc2626' }]}>
            <Text style={[styles.summaryNum, { color: '#dc2626' }]}>{data?.absent}</Text>
            <Text style={styles.summaryLabel}>Absent</Text>
          </View>
          <View style={[styles.summaryCard, { borderTopColor: '#d97706' }]}>
            <Text style={[styles.summaryNum, { color: '#d97706' }]}>{data?.late}</Text>
            <Text style={styles.summaryLabel}>Late</Text>
          </View>
          <View style={[styles.summaryCard, { borderTopColor: NAVY }]}>
            <Text style={[styles.summaryNum, { color: NAVY }]}>{data?.percentage}%</Text>
            <Text style={styles.summaryLabel}>Rate</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardLabel}>Attendance Rate</Text>
            <Text style={[styles.pctLabel, { color: (data?.percentage ?? 0) >= 75 ? '#16a34a' : '#dc2626' }]}>
              {data?.percentage}%
            </Text>
          </View>
          <View style={styles.progressBg}>
            <View style={[
              styles.progressFill,
              { width: `${data?.percentage ?? 0}%`, backgroundColor: (data?.percentage ?? 0) >= 75 ? '#16a34a' : '#dc2626' }
            ]} />
          </View>
          {(data?.percentage ?? 0) < 75 && (
            <Text style={styles.warning}>Below 75% — attendance is insufficient</Text>
          )}
        </View>

        {/* Daily Records */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Daily Records — {MONTHS[selectedMonth]} 2025</Text>
          {data?.records.map((r, i) => (
            <View key={i} style={styles.recordRow}>
              <Text style={styles.recordDay}>{r.day}</Text>
              <Text style={styles.recordDate}>{r.date}</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColor(r.status) }]}>
                <Text style={styles.statusText}>{r.status}</Text>
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

  topBar: { backgroundColor: NAVY, paddingHorizontal: 20, paddingVertical: 16 },
  topTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },

  monthScroll: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff' },
  monthChip: { marginRight: 8, paddingHorizontal: 16, paddingVertical: 7, borderRadius: 16, borderWidth: 1, borderColor: '#d1d5db', backgroundColor: '#f9fafb' },
  monthChipActive: { backgroundColor: NAVY, borderColor: NAVY },
  monthText: { fontSize: 13, fontWeight: '500', color: '#6b7280' },
  monthTextActive: { color: '#fff' },

  summaryRow: { flexDirection: 'row', marginHorizontal: 16, marginTop: 14, gap: 10 },
  summaryCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 12, alignItems: 'center', borderTopWidth: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  summaryNum: { fontSize: 22, fontWeight: '800' },
  summaryLabel: { fontSize: 11, color: '#6b7280', marginTop: 2 },

  card: { backgroundColor: '#fff', borderRadius: 14, padding: 18, marginHorizontal: 16, marginTop: 14, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  cardLabel: { fontSize: 12, color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 0.5 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pctLabel: { fontSize: 18, fontWeight: '800' },
  progressBg: { height: 10, backgroundColor: '#f1f5f9', borderRadius: 5, overflow: 'hidden', marginTop: 8 },
  progressFill: { height: '100%', borderRadius: 5 },
  warning: { color: '#dc2626', fontSize: 12, marginTop: 8, fontWeight: '500' },

  recordRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f9fafb' },
  recordDay: { width: 36, fontSize: 12, color: '#9ca3af', fontWeight: '500' },
  recordDate: { flex: 1, fontSize: 14, color: '#374151' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '700' },
});
