// src/screens/Dashboard.js

import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Pressable
} from 'react-native'
import { useNavigation } from '@react-navigation/native'

export default function Dashboard() {
  const navigation = useNavigation()
  const [checked, setChecked] = useState({})

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const projects = [
    {
      id: 1,
      status: 'In Progress',
      title: 'Linen Summer Dress',
      progress: '65% complete'
    },
    {
      id: 2,
      status: 'Next Up',
      title: 'Silk Evening Skirt',
      progress: 'Planning phase'
    }
  ]

  const fabrics = [
    {
      name: 'Floral Cotton',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCOsYAxg_FFIX_i5NzCmR-jbG6-9B-SZC6hwqR9-ctISOXfPNMrZ_mXen37TlaOj31DdBffRxnz1hj0eOxHSSm9axgcw6mCjMmc7H_xoyPzwopwJoHmqZ-JWF8PlJwlUh0dCrKQ7ncXfy-qhm6WPxb4fKsJz8CP81jAb2DR2NrmCknxYsYRqDH5C0gc9QUa-heYKwU8U47HKXp7jDL9LBD3cdSTNZaZpK3fY24sMN48scmDHTcxVUmcqEwEag8Jgf_jqgxkJ7qOpGQ'
    },
    {
      name: 'Raw Denim',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAU9SegfinhUUGdmwmNtBz3ds8SCn3F_dsMq0h8ouZEikQO45BCPK96ZD7i9UzoGwyujPOSiipG1rOjzZBBjWQ-g02-vZ9yzvEVBopGNMza1jxm6eTsp_aCJ1bweo_i40E9Gj13kno0ATHDvSi_EvxVyYu-nH-xAZs_qIJJQXO_GRTEryZQjm7qb_pUhpSaO2DtGeQoGbhIoXgz4T-ZekE81nmBS8vW7iQYi9lpm1ZjitjY4JdwSge0uuavKXNqFI97Izmhpvcp-4s'
    }
  ]

  const toBuyItems = [
    { id: 1, text: 'Matching Silk Thread' },
    { id: 2, text: 'Fabric Scissors (Upgrade)' },
    { id: 3, text: 'Eyelash Hooks & Eyes' }
  ]
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>{getGreeting()}</Text>
          <Text style={styles.subtitle}>
            Ready for your next creation?
          </Text>
        </View>

        {/* Project Overview */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionLabel}>PROJECT OVERVIEW</Text>
            <Pressable onPress={() => navigation.navigate('Projects')}>
              <Text style={styles.link}>View All</Text>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {projects.map(project => (
              <View key={project.id} style={styles.projectCard}>
                <Text style={styles.badge}>{project.status}</Text>
                <Text style={styles.projectTitle}>{project.title}</Text>
                <Text style={styles.projectProgress}>
                  {project.progress}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Fabric Library */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionLabel}>FABRIC LIBRARY</Text>
            <Pressable onPress={() => navigation.navigate('Library')}>
              <Text style={styles.link}>Browse</Text>
            </Pressable>
          </View>

          <FlatList
            data={fabrics}
            keyExtractor={item => item.name}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
            renderItem={({ item }) => (
              <View style={styles.fabricCard}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.fabricImage}
                />
                <Text style={styles.fabricLabel}>{item.name}</Text>
              </View>
            )}
          />
        </View>

        {/* To Buy List */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionLabel}>TO BUY LIST</Text>
            <Text style={styles.link}>Add Item</Text>
          </View>

          <View style={styles.listBox}>
            {toBuyItems.map(item => (
              <Pressable
                key={item.id}
                style={styles.listItem}
                onPress={() =>
                  setChecked(prev => ({
                    ...prev,
                    [item.id]: !prev[item.id]
                  }))
                }
              >
                <View
                  style={[
                    styles.checkbox,
                    checked[item.id] && styles.checkboxChecked
                  ]}
                />
                <Text style={styles.listText}>{item.text}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF5'
  },
  scroll: {
    paddingTop: 50,
    paddingBottom: 120
  },
  header: {
    padding: 24
  },
  title: {
    fontSize: 34,
    fontWeight: '700'
  },
  subtitle: {
    marginTop: 4,
    color: '#1E293B'
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 1,
    color: '#94A3B8',
    fontWeight: '600'
  },
  link: {
    color: '#1E293B',
    fontWeight: '600'
  },
  projectCard: {
    width: 260,
    height: 150,
    backgroundColor: '#E2D6CC',
    borderRadius: 24,
    padding: 16,
    marginRight: 16,
    justifyContent: 'space-between'
  },
  badge: {
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: '#FFD7E6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start'
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: '600'
  },
  projectProgress: {
    fontSize: 14,
    color: '#475569'
  },
  gridRow: {
    justifyContent: 'space-between'
  },
  fabricCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16
  },
  fabricImage: {
    width: '100%',
    height: '100%'
  },
  fabricLabel: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12
  },
  listBox: {
    backgroundColor: '#DADBDE',
    borderRadius: 24,
    padding: 8
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#8F949D'
  },
  checkboxChecked: {
    backgroundColor: '#ffafcc'
  },
  listText: {
    marginLeft: 16,
    fontWeight: '500'
  }
})
