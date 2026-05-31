import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Alert,
} from 'react-native';

const NAVY = '#1e3a5f';
const GOLD = '#c9a84c';

const FEES = [
  { label: 'Tuition Fee — Q1',  amount: 11250, date: 'Apr 5, 2026',  method: 'Online', status: 'Paid'    },
  { label: 'Transport Fee',      amount: 12000, date: 'Apr 10, 2026', method: 'Online', status: 'Paid'    },
  { label: 'Activity Fee',       amount: 1500,  date: 'Apr 10, 2026', method: 'Cash',   status: 'Paid'    },
  { label: 'Lab Fee',            amount: 2500,  date: 'Apr 15, 2026', method: 'Online', status: 'Paid'    },
  { label: 'Library Fee',        amount: 800,   date: 'Apr 15, 2026', method: 'Online', status: 'Paid'    },
  { label: 'Tuition Fee — Q2',  amount: 11250, date: '—',            method: '—',      status: 'Pending' },
];

const paid    = FEES.filter(f => f.status === 'Paid').reduce((a, f) => a + f.amount, 0);
const pending = FEES.filter(f => f.status === 'Pending').reduce((a, f) => a + f.amount, 0);
const total   = paid + pending;

export default function FeesScreen() {
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={NAVY} />
      <View style={s.header}>
        <Text style={s.headerTitle}>Fee Details</Text>
        <Text style={s.headerSub}>Aarav Sharma · Class 10-A</Text>
      </View>

      <ScrollView contentContainerStyle={s.scroll}>
        {/* Progress */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Annual Fee Progress</Text>
          <View style={s.statsRow}>
            <View style={s.stat}><Text style={s.statVal}>₹{(total/1000).toFixed(1)}K</Text><Text style={s.statLbl}>Total</Text></View>
            <View style={s.stat}><Text style={[s.statVal,{color:'#16a34a'}]}>₹{(paid/1000).toFixed(1)}K</Text><Text style={s.statLbl}>Paid</Text></View>
            <View style={s.stat}><Text style={[s.statVal,{color:'#d97706'}]}>₹{(pending/1000).toFixed(1)}K</Text><Text style={s.statLbl}>Pending</Text></View>
          </View>
          <View style={s.barBg}>
            <View style={[s.barFill,{width:`${Math.round((paid/total)*100)}%`}]} />
          </View>
          <Text style={s.barPct}>{Math.round((paid/total)*100)}% paid</Text>
        </View>

        {/* Due card */}
        {pending > 0 && (
          <View style={s.dueCard}>
            <View>
              <Text style={s.dueLabel}>Payment Due</Text>
              <Text style={s.dueAmount}>₹{pending.toLocaleString()}</Text>
              <Text style={s.dueSub}>Due by July 1, 2026</Text>
            </View>
            <TouchableOpacity style={s.payBtn} onPress={() => Alert.alert('Pay Now', 'Redirecting to Razorpay payment gateway...')}>
              <Text style={s.payBtnText}>Pay Now</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* History */}
        <Text style={s.sectionTitle}>Payment History</Text>
        {FEES.map((f, i) => (
          <View key={i} style={s.row}>
            <View style={s.rowLeft}>
              <Text style={s.rowTitle}>{f.label}</Text>
              <Text style={s.rowSub}>{f.date} {f.method !== '—' ? `· ${f.method}` : ''}</Text>
            </View>
            <View style={s.rowRight}>
              <Text style={s.rowAmt}>₹{f.amount.toLocaleString()}</Text>
              <View style={[s.badge, f.status === 'Paid' ? s.badgePaid : s.badgePending]}>
                <Text style={[s.badgeText, f.status === 'Paid' ? s.badgePaidText : s.badgePendingText]}>{f.status}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: '#f9fafb' },
  header:     { backgroundColor: NAVY, paddingHorizontal: 20, paddingVertical: 16, paddingTop: 20 },
  headerTitle:{ color: '#fff', fontSize: 22, fontWeight: '700' },
  headerSub:  { color: '#93c5fd', fontSize: 13, marginTop: 2 },
  scroll:     { padding: 16, paddingBottom: 32 },
  card:       { backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  cardTitle:  { fontSize: 15, fontWeight: '700', color: '#1f2937', marginBottom: 14 },
  statsRow:   { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 14 },
  stat:       { alignItems: 'center' },
  statVal:    { fontSize: 18, fontWeight: '800', color: '#1f2937' },
  statLbl:    { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  barBg:      { height: 8, backgroundColor: '#e5e7eb', borderRadius: 4, overflow: 'hidden' },
  barFill:    { height: 8, backgroundColor: '#16a34a', borderRadius: 4 },
  barPct:     { fontSize: 12, color: '#6b7280', textAlign: 'right', marginTop: 4 },
  dueCard:    { backgroundColor: '#fffbeb', borderRadius: 16, padding: 16, marginBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#fde68a' },
  dueLabel:   { fontSize: 12, color: '#92400e', fontWeight: '600' },
  dueAmount:  { fontSize: 22, fontWeight: '800', color: '#b45309', marginTop: 2 },
  dueSub:     { fontSize: 11, color: '#d97706', marginTop: 2 },
  payBtn:     { backgroundColor: '#d97706', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 18 },
  payBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1f2937', marginBottom: 10 },
  row:        { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  rowLeft:    { flex: 1 },
  rowRight:   { alignItems: 'flex-end', marginLeft: 12 },
  rowTitle:   { fontSize: 13, fontWeight: '600', color: '#1f2937' },
  rowSub:     { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  rowAmt:     { fontSize: 14, fontWeight: '700', color: '#1f2937' },
  badge:      { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, marginTop: 4 },
  badgePaid:  { backgroundColor: '#dcfce7' },
  badgePending: { backgroundColor: '#fef3c7' },
  badgeText:  { fontSize: 10, fontWeight: '700' },
  badgePaidText: { color: '#16a34a' },
  badgePendingText: { color: '#d97706' },
});
