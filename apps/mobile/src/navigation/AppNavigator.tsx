import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/auth/LoginScreen';
import StudentDashboard from '../screens/student/StudentDashboard';
import MarksScreen from '../screens/student/MarksScreen';
import FeesScreen from '../screens/student/FeesScreen';
import AssignmentsScreen from '../screens/student/AssignmentsScreen';
import ParentDashboard from '../screens/parent/ParentDashboard';
import TeacherDashboard from '../screens/teacher/TeacherDashboard';
import AttendanceScreen from '../screens/shared/AttendanceScreen';
import TimetableScreen from '../screens/shared/TimetableScreen';
import NotificationsScreen from '../screens/shared/NotificationsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const NAVY = '#1e3a5f';
const GOLD = '#c9a84c';

// ─── Tab bar icon (text-based) ────────────────────────────────────────────────
function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{label}</Text>
  );
}

// ─── Placeholder screen for unbuilt tabs ────────────────────────────────────
function PlaceholderScreen({ name }: { name: string }) {
  return (
    <View style={placeholder.container}>
      <Text style={placeholder.text}>{name}</Text>
      <Text style={placeholder.sub}>Coming soon</Text>
    </View>
  );
}
const placeholder = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f5f9' },
  text: { fontSize: 22, fontWeight: '700', color: NAVY },
  sub: { fontSize: 14, color: '#9ca3af', marginTop: 6 },
});

// ─── Student Tabs ─────────────────────────────────────────────────────────────
function StudentTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: NAVY,
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: { borderTopColor: '#e5e7eb', paddingBottom: 4, height: 60 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={StudentDashboard}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="🏠" focused={focused} /> }}
      />
      <Tab.Screen
        name="Timetable"
        component={TimetableScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="📅" focused={focused} /> }}
      />
      <Tab.Screen
        name="Marks"
        component={MarksScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="📊" focused={focused} /> }}
      />
      <Tab.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="✅" focused={focused} /> }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="🔔" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

// ─── Parent Tabs ──────────────────────────────────────────────────────────────
function ParentTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: NAVY,
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: { borderTopColor: '#e5e7eb', paddingBottom: 4, height: 60 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={ParentDashboard}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="🏠" focused={focused} /> }}
      />
      <Tab.Screen
        name="Fees"
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="💳" focused={focused} /> }}
      >
        {() => <PlaceholderScreen name="Fee Details" />}
      </Tab.Screen>
      <Tab.Screen
        name="Progress"
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="📈" focused={focused} /> }}
      >
        {() => <PlaceholderScreen name="Academic Progress" />}
      </Tab.Screen>
      <Tab.Screen
        name="Notices"
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="📢" focused={focused} /> }}
      >
        {() => <PlaceholderScreen name="School Notices" />}
      </Tab.Screen>
      <Tab.Screen
        name="Alerts"
        component={NotificationsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="🔔" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

// ─── Teacher Tabs ─────────────────────────────────────────────────────────────
function TeacherTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: NAVY,
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: { borderTopColor: '#e5e7eb', paddingBottom: 4, height: 60 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={TeacherDashboard}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="🏠" focused={focused} /> }}
      />
      <Tab.Screen
        name="Classes"
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="🏫" focused={focused} /> }}
      >
        {() => <PlaceholderScreen name="My Classes" />}
      </Tab.Screen>
      <Tab.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="✅" focused={focused} /> }}
      />
      <Tab.Screen
        name="Grades"
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="📝" focused={focused} /> }}
      >
        {() => <PlaceholderScreen name="Grade Entry" />}
      </Tab.Screen>
      <Tab.Screen
        name="Leave"
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="📋" focused={focused} /> }}
      >
        {() => <PlaceholderScreen name="Leave Applications" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// ─── Admin Tabs ───────────────────────────────────────────────────────────────
function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: NAVY,
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: { borderTopColor: '#e5e7eb', paddingBottom: 4, height: 60 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="📊" focused={focused} /> }}
      >
        {() => <PlaceholderScreen name="Admin Dashboard" />}
      </Tab.Screen>
      <Tab.Screen
        name="Students"
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="👩‍🎓" focused={focused} /> }}
      >
        {() => <PlaceholderScreen name="Students" />}
      </Tab.Screen>
      <Tab.Screen
        name="Staff"
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="👨‍🏫" focused={focused} /> }}
      >
        {() => <PlaceholderScreen name="Staff" />}
      </Tab.Screen>
      <Tab.Screen
        name="Fees"
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="💰" focused={focused} /> }}
      >
        {() => <PlaceholderScreen name="Fee Management" />}
      </Tab.Screen>
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="🔔" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

// ─── Root Navigator ───────────────────────────────────────────────────────────
export default function AppNavigator() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: NAVY }}>
        <Text style={{ color: '#c9a84c', fontSize: 28, fontWeight: '800', marginBottom: 20 }}>KVL</Text>
        <ActivityIndicator size="large" color={GOLD} />
      </View>
    );
  }

  const renderRoleTabs = () => {
    switch (user?.role) {
      case 'student': return <StudentTabs />;
      case 'parent': return <ParentTabs />;
      case 'teacher': return <TeacherTabs />;
      case 'admin': return <AdminTabs />;
      default: return <StudentTabs />;
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="Main">{() => renderRoleTabs()}</Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
