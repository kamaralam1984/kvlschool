import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';

const NAVY = '#1e3a5f';

const ASSIGNMENTS = [
  { subject: 'Mathematics', title: 'Quadratic Equations — Practice Set 5', due: 'Jun 3', status: 'Pending',  score: null  },
  { subject: 'Physics',     title: "Newton's Laws — Problem Set 4",         due: 'Jun 5', status: 'Submitted',score: null  },
  { subject: 'English',     title: 'Character Analysis — Macbeth Act III', due: 'May 31',status: 'Overdue',  score: null  },
  { subject: 'Chemistry',   title: 'Organic Nomenclature Exercise',         due: 'Jun 7', status: 'Pending',  score: null  },
  { subject: 'CS',          title: 'Python OOP — Class Design Project',     due: 'May 28',status: 'Graded',   score: '28/30'},
  { subject: 'Biology',     title: 'Cell Division — Diagram Labelling',     due: 'Jun 6', status: 'Pending',  score: null  },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Pending:   { bg: '#fef3c7', text: '#d97706' },
  Submitted: { bg: '#dbeafe', text: '#2563eb' },
  Graded:    { bg: '#dcfce7', text: '#16a34a' },
  Overdue:   { bg: '#fee2e2', text: '#dc2626' },
};

const SUBJ_COLORS: Record<string, string> = {
  Mathematics: '#3b82f6', Physics: '#10b981', Chemistry: '#f97316',
  English: '#8b5cf6', Biology: '#06b6d4', CS: '#6366f1',
};

export default function AssignmentsScreen() {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Pending', 'Overdue', 'Submitted', 'Graded'];
  const visible = filter === 'All' ? ASSIGNMENTS : ASSIGNMENTS.filter(a => a.status === filter);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={NAVY} />
      <View style={s.header}>
        <Text style={s.headerTitle}>Assignments</Text>
        <Text style={s.headerSub}>Track and submit your work</Text>
      </View>

      {/* Filter tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterBar} contentContainerStyle={s.filterContent}>
        {filters.map(f => (
          <TouchableOpacity key={f} style={[s.filterChip, filter === f && s.filterChipActive]} onPress={() => setFilter(f)}>
            <Text style={[s.filterText, filter === f && s.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={s.scroll}>
        {visible.map((a, i) => {
          const sc = STATUS_COLORS[a.status];
          return (
            <View key={i} style={s.card}>
              <View style={s.cardTop}>
                <View style={[s.subjectDot, { backgroundColor: SUBJ_COLORS[a.subject] || '#6b7280' }]} />
                <Text style={s.subject}>{a.subject}</Text>
                <View style={[s.badge, { backgroundColor: sc.bg }]}>
                  <Text style={[s.badgeText, { color: sc.text }]}>{a.status}</Text>
                </View>
              </View>
              <Text style={s.title}>{a.title}</Text>
              <View style={s.cardBottom}>
                <Text style={s.due}>Due: {a.due}</Text>
                {a.score && <Text style={s.scored}>Score: {a.score}</Text>}
                {(a.status === 'Pending' || a.status === 'Overdue') && (
                  <TouchableOpacity style={s.submitBtn}>
                    <Text style={s.submitBtnText}>Submit</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: '#f9fafb' },
  header:          { backgroundColor: NAVY, paddingHorizontal: 20, paddingVertical: 16, paddingTop: 20 },
  headerTitle:     { color: '#fff', fontSize: 22, fontWeight: '700' },
  headerSub:       { color: '#93c5fd', fontSize: 13, marginTop: 2 },
  filterBar:       { maxHeight: 52 },
  filterContent:   { paddingHorizontal: 16, paddingVertical: 10, gap: 8, flexDirection: 'row' },
  filterChip:      { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#e5e7eb' },
  filterChipActive:{ backgroundColor: NAVY },
  filterText:      { fontSize: 12, fontWeight: '600', color: '#6b7280' },
  filterTextActive:{ color: '#fff' },
  scroll:          { padding: 16, paddingBottom: 32 },
  card:            { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardTop:         { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  subjectDot:      { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  subject:         { flex: 1, fontSize: 12, fontWeight: '600', color: '#6b7280' },
  badge:           { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeText:       { fontSize: 10, fontWeight: '700' },
  title:           { fontSize: 14, fontWeight: '700', color: '#111827', lineHeight: 20, marginBottom: 10 },
  cardBottom:      { flexDirection: 'row', alignItems: 'center', gap: 12 },
  due:             { fontSize: 12, color: '#9ca3af' },
  scored:          { fontSize: 12, color: '#16a34a', fontWeight: '700' },
  submitBtn:       { marginLeft: 'auto', backgroundColor: NAVY, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  submitBtnText:   { color: '#fff', fontSize: 12, fontWeight: '700' },
});
