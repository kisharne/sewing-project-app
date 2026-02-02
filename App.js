import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import Dashboard from './src/screens/Dashboard';
import FabricLibraryScreen from './src/screens/FabricLibraryScreen';
import BodyMeasurementsTracker from './src/screens/BodyMeasurementsTracker';
import { Ionicons } from '@expo/vector-icons';

function PlaceholderScreen({ label }) {
  return (
    <>
      <StatusBar style="dark" />
      <Text style={{ marginTop: 80, textAlign: 'center', fontSize: 18 }}>
        {label} screen coming soon
      </Text>
    </>
  );
}

// Plus icon component
function Plus({ color, size }) {
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Ionicons name="camera" size={size} color={color} />
    </View>
  );
}

// Custom middle tab button component
function MiddleTabButton({ onPress, accessibilityState }) {
  const focused = accessibilityState?.selected || false;
  
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.middleButton}
      activeOpacity={0.8}
    >
      <View style={[styles.middleButtonCircle, focused && styles.middleButtonFocused]}>
        <Plus color="#0F172A" size={28} />
      </View>
    </TouchableOpacity>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#1E293B',
            height: 80,
            paddingTop: 8,
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
            position: 'absolute',
          },
          tabBarActiveTintColor: '#ffafcc',
          tabBarInactiveTintColor: '#94A3B8',
        }}
      >
        <Tab.Screen
          name="Home"
          component={Dashboard}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Projects"
          children={() => <PlaceholderScreen label="Projects" />}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="build" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Camera"
          children={() => <PlaceholderScreen label="Camera" />}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, size }) => (
              // <Ionicons name="build" size={size} color={color} />
              <Plus color="#0F172A" size={28} />
            ),
            tabBarButton: (props) => <MiddleTabButton {...props} />,
          }}
        /> 
        <Tab.Screen
          name="Library"
          component={FabricLibraryScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="book" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Measurements"
          children={BodyMeasurementsTracker}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calculator" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  middleButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  middleButtonCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffafcc',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  middleButtonFocused: {
    backgroundColor: '#ff8fab',
  },
});