import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';

const NAVY = '#1e3a5f';
const GOLD = '#c9a84c';

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat'];

type Period = { subject: string; teacher: string; room: string; time: string } | null;

const SCHEDULE: Record<string, Period[]> = {
  Mon: [
    { subject: 'Mathematics', teacher: 'Dr. Gupta',   room: 'A-201', time: '7:30–8:15' },
    { subject: 'Physics',     teacher: 'Mr. Kumar',   room: 'Lab-1', time: '8:15–9:00' },
    { subject: 'English',     teacher: 'Mrs. Sharma', room: 'B-102', time: '9:00–9:45' },
    null, // Break
    { subject: 'Chemistry',   teacher: 'Mr. Kumar',   room: 'Lab-2', time: '10:05–10:50' },
    { subject: 'CS',          teacher: 'Mr. Joshi',   room: 'Lab-3', time: '10:50–11:35' },
    { subject: 'Biology',     teacher: 'Dr. Pillai',  room: 'C-301', time: '11:35–12:20' },
  ],
  Tue: [
    { subject: 'Physics',     teacher: 'Mr. Kumar',   room: 'Lab-1', time: '7:30–8:15' },
    { subject: 'Mathematics', teacher: 'Dr. Gupta',   room: 'A-201', time: '8:15–9:00' },
    { subject: 'Biology',     teacher: 'Dr. Pillai',  room: 'C-301', time: '9:00–9:45' },
    null,
    { subject: 'English',     teacher: 'Mrs. Sharma', room: 'B-102', time: '10:05–10:50' },
    { subject: 'Mathematics', teacher: 'Dr. Gupta',   room: 'A-201', time: '10:50–11:35' },
    { subject: 'Chemistry',   teacher: 'Mr. Kumar',   room: 'Lab-2', time: '11:35–12:20' },
  ],
  Wed: [
    { subject: 'English',     teacher: 'Mrs. Sharma', room: 'B-102', time: '7:30–8:15' },
    { subject: 'Chemistry',   teacher: 'Mr. Kumar',   room: 'Lab-2', time: '8:15–9:00' },
    { subject: 'Mathematics', teacher: 'Dr. Gupta',   room: 'A-201', time: '9:00–9:45' },
    null,
    { subject: 'Physics',     teacher: 'Mr. Kumar',   room: 'Lab-1', time: '10:05–10:50' },
    { subject: 'Biology',     teacher: 'Dr. Pillai',  room: 'C-301', time: '10:50–11:35' },
    { subject: 'CS',          teacher: 'Mr. Joshi',   room: 'Lab-3', time: '11:35–12:20' },
  ],
  Thu: [
    { subject: 'CS',          teacher: 'Mr. Joshi',   room: 'Lab-3', time: '7:30–8:15' },
    { subject: 'Physics',     teacher: 'Mr. Kumar',   room: 'Lab-1', time: '8:15–9:00' },
    { subject: 'Biology',     teacher: 'Dr. Pillai',  room: 'C-301', time: '9:00–9:45' },
    null,
    { subject: 'English',     teacher: 'Mrs. Sharma', room: 'B-102', time: '10:05–10:50' },
    { subject: 'Chemistry',   teacher: 'Mr. Kumar',   room: 'Lab-2', time: '10:50–11:35' },
    { subject: 'Mathematics', teacher: 'Dr. Gupta',   room: 'A-201', time: '11:35–12:20' },
  ],
  Fri: [
    { subject: 'Chemistry',   teacher: 'Mr. Kumar',   room: 'Lab-2', time: '7:30–8:15' },
    { subject: 'Biology',     teacher: 'Dr. Pillai',  room: 'C-301', time: '8:15–9:00' },
    { subject: 'CS',          teacher: 'Mr. Joshi',   room: 'Lab-3', time: '9:00–9:45' },
    null,
    { subject: 'Mathematics', teacher: 'Dr. Gupta',   room: 'A-201', time: '10:05–10:50' },
    { subject: 'English',     teacher: 'Mrs. Sharma', room: 'B-102', time: '10:50–11:35' },
    { subject: 'Physics',     teacher: 'Mr. Kumar',   room: 'Lab-1', time: '11:35–12:20' },
  ],
  Sat: [
    { subject: 'Mathematics', teacher: 'Dr. Gupta',   room: 'A-201', time: '7:30–8:15' },
    { subject: 'English',     teacher: 'Mrs. Sharma', room: 'B-102', time: '8:15–9:00' },
    { subject: 'Physics',     teacher: 'Mr. Kumar',   room: 'Lab-1', time: '9:00–9:45' },
    null,
    { subject: 'Biology',     teacher: 'Dr. Pillai',  room: 'C-301', time: '10:05–10:50' },
    null,
    null,
  ],
};

const SUBJ_COLORS: Record<string, string> = {
  Mathematics: '#3b82f6', Physics: '#10b981', Chemistry: '#f97316',
  English: '#8b5cf6', Biology: '#06b6d4', CS: '#6366f1', PE: '#ef4444',
};

const todayIndex = new Date().getDay(); // 0=Sun
const todayKey = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][todayIndex];

export default function TimetableScreen() {
  const [day, setDay] = useState(DAYS.includes(todayKey) ? todayKey : 'Mon');
  const periods = SCHEDULE[day] || [];

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={NAVY} />
      <View style={s.header}>
        <Text style={s.headerTitle}>Timetable</Text>
        <Text style={s.headerSub}>Class 10-A · 2025-26</Text>
      </View>

      {/* Day selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.dayBar} contentContainerStyle={s.dayContent}>
        {DAYS.map(d => (
          <TouchableOpacity key={d} style={[s.dayChip, day === d && s.dayChipActive, d === todayKey && day !== d && s.dayChipToday]}
            onPress={() => setDay(d)}>
            <Text style={[s.dayText, day === d && s.dayTextActive]}>{d}</Text>
            {d === todayKey && <Text style={[s.todayDot, day === d && { color: '#fff' }]}>•</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={s.scroll}>
        {periods.map((p, i) => {
          if (!p) return (
            <View key={i} style={s.break}>
              <Text style={s.breakText}>Break · 9:45–10:05</Text>
            </View>
          );
          const color = SUBJ_COLORS[p.subject] || '#6b7280';
          return (
            <View key={i} style={[s.card, { borderLeftColor: color }]}>
              <View style={s.cardLeft}>
                <Text style={s.time}>{p.time}</Text>
                <View style={[s.subjectBadge, { backgroundColor: `${color}20` }]}>
                  <Text style={[s.subjectText, { color }]}>{p.subject}</Text>
                </View>
              </View>
              <View style={s.cardRight}>
                <Text style={s.teacher}>{p.teacher}</Text>
                <Text style={s.room}>Room {p.room}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: '#f9fafb' },
  header:        { backgroundColor: NAVY, paddingHorizontal: 20, paddingVertical: 16, paddingTop: 20 },
  headerTitle:   { color: '#fff', fontSize: 22, fontWeight: '700' },
  headerSub:     { color: '#93c5fd', fontSize: 13, marginTop: 2 },
  dayBar:        { maxHeight: 56, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  dayContent:    { paddingHorizontal: 16, paddingVertical: 10, gap: 8, flexDirection: 'row' },
  dayChip:       { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: '#e5e7eb', alignItems: 'center' },
  dayChipActive: { backgroundColor: NAVY },
  dayChipToday:  { borderWidth: 2, borderColor: NAVY, backgroundColor: '#fff' },
  dayText:       { fontSize: 13, fontWeight: '700', color: '#6b7280' },
  dayTextActive: { color: '#fff' },
  todayDot:      { fontSize: 8, color: NAVY, marginTop: -2 },
  scroll:        { padding: 16, paddingBottom: 32 },
  card:          { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderLeftWidth: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardLeft:      { flex: 1 },
  cardRight:     { alignItems: 'flex-end' },
  time:          { fontSize: 11, color: '#9ca3af', fontWeight: '600', marginBottom: 6 },
  subjectBadge:  { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  subjectText:   { fontSize: 13, fontWeight: '800' },
  teacher:       { fontSize: 13, fontWeight: '600', color: '#374151' },
  room:          { fontSize: 11, color: '#9ca3af', marginTop: 3 },
  break:         { backgroundColor: '#f3f4f6', borderRadius: 10, padding: 10, marginBottom: 10, alignItems: 'center' },
  breakText:     { fontSize: 12, color: '#9ca3af', fontWeight: '600' },
});
