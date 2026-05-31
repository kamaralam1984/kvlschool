import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';

const NAVY = '#1e3a5f';
const GOLD = '#c9a84c';

const EXAMS = [
  {
    name: 'Unit Test 3',
    date: 'May 20, 2026',
    subjects: [
      { name: 'Mathematics', scored: 47, max: 50, grade: 'A+' },
      { name: 'Physics',     scored: 43, max: 50, grade: 'A'  },
      { name: 'Chemistry',   scored: 40, max: 50, grade: 'B+' },
      { name: 'English',     scored: 45, max: 50, grade: 'A+' },
      { name: 'Biology',     scored: 42, max: 50, grade: 'A'  },
      { name: 'CS',          scored: 48, max: 50, grade: 'A+' },
    ],
  },
  {
    name: 'Mid-Term Exam',
    date: 'March 15, 2026',
    subjects: [
      { name: 'Mathematics', scored: 88, max: 100, grade: 'A'  },
      { name: 'Physics',     scored: 82, max: 100, grade: 'A'  },
      { name: 'Chemistry',   scored: 79, max: 100, grade: 'B+' },
      { name: 'English',     scored: 91, max: 100, grade: 'A+' },
      { name: 'Biology',     scored: 85, max: 100, grade: 'A'  },
      { name: 'CS',          scored: 94, max: 100, grade: 'A+' },
    ],
  },
];

const gradeColors: Record<string, string> = {
  'A+': '#16a34a', 'A': '#2563eb', 'B+': '#d97706', 'B': '#f97316', 'C': '#ef4444',
};

export default function MarksScreen() {
  const [selectedExam, setSelectedExam] = useState(0);
  const exam  = EXAMS[selectedExam];
  const total = exam.subjects.reduce((a, s) => a + s.scored, 0);
  const max   = exam.subjects.reduce((a, s) => a + s.max, 0);
  const pct   = ((total / max) * 100).toFixed(1);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={NAVY} />
      <View style={s.header}>
        <Text style={s.headerTitle}>Exam Results</Text>
        <Text style={s.headerSub}>Aarav Sharma · Class 10-A</Text>
      </View>

      {/* Overall score card */}
      <View style={s.scoreCard}>
        <Text style={s.scoreLabel}>Overall Score</Text>
        <Text style={s.scoreBig}>{total}/{max}</Text>
        <Text style={s.scorePct}>{pct}% · Class Rank #3</Text>
      </View>

      {/* Exam selector */}
      <View style={s.tabs}>
        {EXAMS.map((e, i) => (
          <TouchableOpacity key={i} style={[s.tab, selectedExam === i && s.tabActive]} onPress={() => setSelectedExam(i)}>
            <Text style={[s.tabText, selectedExam === i && s.tabTextActive]}>{e.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.examDate}>{exam.date}</Text>
        {exam.subjects.map((sub, i) => {
          const p = Math.round((sub.scored / sub.max) * 100);
          return (
            <View key={i} style={s.row}>
              <View style={s.rowLeft}>
                <Text style={s.subName}>{sub.name}</Text>
                <View style={s.barBg}>
                  <View style={[s.barFill, { width: `${p}%`, backgroundColor: p >= 85 ? '#16a34a' : p >= 70 ? '#2563eb' : '#d97706' }]} />
                </View>
              </View>
              <View style={s.rowRight}>
                <Text style={s.score}>{sub.scored}/{sub.max}</Text>
                <Text style={[s.grade, { color: gradeColors[sub.grade] || '#374151' }]}>{sub.grade}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: '#f9fafb' },
  header:     { backgroundColor: NAVY, paddingHorizontal: 20, paddingVertical: 16, paddingTop: 20 },
  headerTitle:{ color: '#fff', fontSize: 22, fontWeight: '700' },
  headerSub:  { color: '#93c5fd', fontSize: 13, marginTop: 2 },
  scoreCard:  { margin: 16, backgroundColor: NAVY, borderRadius: 16, padding: 20, alignItems: 'center' },
  scoreLabel: { color: '#93c5fd', fontSize: 13 },
  scoreBig:   { color: '#fff', fontSize: 36, fontWeight: '800', marginTop: 4 },
  scorePct:   { color: GOLD, fontSize: 14, fontWeight: '600', marginTop: 4 },
  tabs:       { flexDirection: 'row', marginHorizontal: 16, gap: 8, marginBottom: 8 },
  tab:        { flex: 1, paddingVertical: 8, backgroundColor: '#e5e7eb', borderRadius: 10, alignItems: 'center' },
  tabActive:  { backgroundColor: NAVY },
  tabText:    { fontSize: 12, color: '#6b7280', fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  scroll:     { paddingHorizontal: 16, paddingBottom: 32 },
  examDate:   { fontSize: 12, color: '#9ca3af', marginBottom: 12 },
  row:        { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  rowLeft:    { flex: 1 },
  rowRight:   { alignItems: 'flex-end', marginLeft: 12 },
  subName:    { fontSize: 14, fontWeight: '600', color: '#1f2937', marginBottom: 6 },
  barBg:      { height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, overflow: 'hidden' },
  barFill:    { height: 4, borderRadius: 2 },
  score:      { fontSize: 15, fontWeight: '700', color: '#1f2937' },
  grade:      { fontSize: 12, fontWeight: '700', marginTop: 2 },
});
