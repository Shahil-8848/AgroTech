import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  Tractor, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  CloudRain, 
  Calendar,
  Star,
  MapPin,
  Plus
} from 'lucide-react-native';
import { useAppStore } from '../../store/useAppStore';
import { demoEquipment, demoServices, demoPosts, demoUsers } from '../../data/demoData';

export default function DashboardScreen() {
  const { user, equipment, setEquipment, setServices, setPosts } = useAppStore();

  useEffect(() => {
    // Initialize demo data
    setEquipment(demoEquipment);
    setServices(demoServices);
    setPosts(demoPosts);
  }, []);

  const quickActions = [
    { 
      id: 1, 
      title: 'Rent Equipment', 
      icon: Tractor, 
      color: '#A4D65E',
      route: '/equipment'
    },
    { 
      id: 2, 
      title: 'Hire Workers', 
      icon: Users, 
      color: '#8B5A2B',
      route: '/services'
    },
    { 
      id: 3, 
      title: 'Buy Inputs', 
      icon: ShoppingCart, 
      color: '#4A90E2',
      route: '/marketplace'
    },
    { 
      id: 4, 
      title: 'Sell Produce', 
      icon: TrendingUp, 
      color: '#F39C12',
      route: '/sell'
    },
  ];

  const weatherData = {
    temperature: '28°C',
    condition: 'Partly Cloudy',
    humidity: '74%',
    precipitation: '5mm',
    pressure: '1019 hPa',
    wind: '18 km/h'
  };

  const recentActivity = [
    { id: 1, title: 'Tractor booking confirmed', time: '2 hours ago', status: 'success' },
    { id: 2, title: 'Worker hired for harvesting', time: '1 day ago', status: 'pending' },
    { id: 3, title: 'Fertilizer order delivered', time: '3 days ago', status: 'completed' },
  ];

  const featuredEquipment = equipment.slice(0, 3);

  const handleQuickAction = (route: string) => {
    if (route === '/equipment') {
      router.push('/(tabs)/marketplace');
    } else {
      // Handle other routes
      console.log('Navigate to:', route);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning!</Text>
            <Text style={styles.userName}>John Farmer</Text>
          </View>
          <View style={styles.locationContainer}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.location}>Pune, Maharashtra</Text>
          </View>
        </View>

        {/* Weather Card */}
        <View style={styles.weatherCard}>
          <View style={styles.weatherHeader}>
            <View style={styles.temperatureSection}>
              <Text style={styles.temperature}>+16°</Text>
              <View style={styles.temperatureDetails}>
                <Text style={styles.tempDetail}>H: +19°</Text>
                <Text style={styles.tempDetail}>L: +10°</Text>
              </View>
            </View>
            <View style={styles.weatherIcon}>
              <CloudRain size={32} color="#A4D65E" />
            </View>
          </View>
          
          <View style={styles.weatherStats}>
            <View style={styles.weatherStat}>
              <Text style={styles.weatherLabel}>Humidity</Text>
              <Text style={styles.weatherValue}>{weatherData.humidity}</Text>
            </View>
            <View style={styles.weatherStat}>
              <Text style={styles.weatherLabel}>Precipitation</Text>
              <Text style={styles.weatherValue}>{weatherData.precipitation}</Text>
            </View>
            <View style={styles.weatherStat}>
              <Text style={styles.weatherLabel}>Pressure</Text>
              <Text style={styles.weatherValue}>{weatherData.pressure}</Text>
            </View>
            <View style={styles.weatherStat}>
              <Text style={styles.weatherLabel}>Wind</Text>
              <Text style={styles.weatherValue}>{weatherData.wind}</Text>
            </View>
          </View>
        </View>

        {/* Farm Health Stats */}
        <View style={styles.farmHealthCard}>
          <View style={styles.farmHealthStats}>
            <View style={styles.healthStat}>
              <Text style={styles.healthPercentage}>93%</Text>
              <Text style={styles.healthLabel}>Plant's health</Text>
              <Text style={styles.healthSubtext}>of reference value</Text>
            </View>
            <View style={styles.healthStat}>
              <Text style={styles.healthPercentage}>85%</Text>
              <Text style={styles.healthLabel}>Water depth</Text>
              <Text style={styles.healthSubtext}>of reference value</Text>
            </View>
            <View style={styles.healthStat}>
              <Text style={styles.healthPercentage}>74%</Text>
              <Text style={styles.healthLabel}>Soil</Text>
              <Text style={styles.healthSubtext}>of reference value</Text>
            </View>
          </View>
          
          <View style={styles.harvestInfo}>
            <Text style={styles.harvestText}>10 days to harvest</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '64%' }]} />
            </View>
            <Text style={styles.progressText}>64/74</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity 
                key={action.id} 
                style={styles.quickActionCard}
                onPress={() => handleQuickAction(action.route)}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
                  <action.icon size={24} color={action.color} />
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Equipment */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Equipment</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/marketplace')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
            {featuredEquipment.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.featuredCard}
                onPress={() => router.push(`/equipment/${item.id}`)}
              >
                <View style={styles.featuredImage}>
                  <Tractor size={32} color="#A4D65E" />
                </View>
                <Text style={styles.featuredTitle}>{item.title}</Text>
                <Text style={styles.featuredPrice}>₹{item.pricePerHour}/hr</Text>
                <View style={styles.featuredRating}>
                  <Star size={12} color="#FFC107" fill="#FFC107" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityContainer}>
            {recentActivity.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={[styles.activityDot, { 
                  backgroundColor: activity.status === 'success' ? '#A4D65E' : 
                                 activity.status === 'pending' ? '#F39C12' : '#6B7280' 
                }]} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Add Equipment Button (for contractors) */}
        {user?.role === 'contractor' && (
          <TouchableOpacity 
            style={styles.addEquipmentButton}
            onPress={() => router.push('/add-equipment')}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addEquipmentText}>Add Equipment</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
  },
  weatherCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  temperatureSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  temperatureDetails: {
    gap: 2,
  },
  tempDetail: {
    fontSize: 14,
    color: '#6B7280',
  },
  weatherIcon: {
    padding: 8,
  },
  weatherStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weatherStat: {
    alignItems: 'center',
  },
  weatherLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  weatherValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  farmHealthCard: {
    backgroundColor: 'rgba(45, 55, 35, 0.9)',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  farmHealthStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  healthStat: {
    alignItems: 'center',
  },
  healthPercentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  healthLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  healthSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  harvestInfo: {
    alignItems: 'center',
  },
  harvestText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#A4D65E',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 14,
    color: '#A4D65E',
    fontWeight: '500',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  featuredScroll: {
    marginTop: 8,
  },
  featuredCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredImage: {
    width: '100%',
    height: 80,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featuredTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  featuredPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A4D65E',
    marginBottom: 4,
  },
  featuredRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#6B7280',
  },
  activityContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  addEquipmentButton: {
    backgroundColor: '#A4D65E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addEquipmentText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});