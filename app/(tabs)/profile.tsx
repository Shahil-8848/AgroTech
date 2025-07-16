import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, MapPin, Phone, Mail, Star, Settings, CircleHelp as HelpCircle, Shield, Bell, Globe, CreditCard, LogOut, ChevronRight, Badge, TrendingUp, Calendar } from 'lucide-react-native';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const userStats = [
    { label: 'Total Bookings', value: '24', icon: Calendar },
    { label: 'Rating', value: '4.8', icon: Star },
    { label: 'Earnings', value: '₹1,25,000', icon: TrendingUp },
  ];

  const menuItems = [
    { id: 1, title: 'Account Settings', icon: Settings, hasArrow: true },
    { id: 2, title: 'Payment Methods', icon: CreditCard, hasArrow: true },
    { id: 3, title: 'Verification', icon: Shield, hasArrow: true, badge: 'Verified' },
    { id: 4, title: 'Language', icon: Globe, hasArrow: true, subtitle: 'English' },
    { id: 5, title: 'Help & Support', icon: HelpCircle, hasArrow: true },
    { id: 6, title: 'Privacy Policy', icon: Shield, hasArrow: true },
    { id: 7, title: 'Logout', icon: LogOut, hasArrow: false, isDestructive: true },
  ];

  const achievements = [
    { id: 1, title: 'Trusted Farmer', description: 'Verified account with 50+ bookings', earned: true },
    { id: 2, title: 'Community Helper', description: 'Helped 20+ farmers with advice', earned: true },
    { id: 3, title: 'Early Adopter', description: 'Joined AgriConnect in first month', earned: false },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={40} color="#6B7280" />
            </View>
            <View style={styles.verificationBadge}>
              <Badge size={16} color="#22C55E" />
            </View>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>John Farmer</Text>
            <Text style={styles.userRole}>Farmer</Text>
            <View style={styles.locationContainer}>
              <MapPin size={14} color="#6B7280" />
              <Text style={styles.location}>Pune, Maharashtra</Text>
            </View>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.contactInfo}>
          <View style={styles.contactItem}>
            <Phone size={16} color="#6B7280" />
            <Text style={styles.contactText}>+91 9876543210</Text>
          </View>
          <View style={styles.contactItem}>
            <Mail size={16} color="#6B7280" />
            <Text style={styles.contactText}>john.farmer@gmail.com</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsContainer}>
            {userStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={styles.statIcon}>
                  <stat.icon size={20} color="#22C55E" />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsContainer}>
            {achievements.map((achievement) => (
              <View key={achievement.id} style={[styles.achievementCard, !achievement.earned && styles.lockedAchievement]}>
                <View style={styles.achievementIcon}>
                  <Badge size={20} color={achievement.earned ? '#22C55E' : '#D1D5DB'} />
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={[styles.achievementTitle, !achievement.earned && styles.lockedText]}>
                    {achievement.title}
                  </Text>
                  <Text style={[styles.achievementDescription, !achievement.earned && styles.lockedText]}>
                    {achievement.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          {/* Notifications Toggle */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={20} color="#6B7280" />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#D1D5DB', true: '#22C55E' }}
              thumbColor={'#FFFFFF'}
            />
          </View>

          {/* Menu Items */}
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <item.icon 
                  size={20} 
                  color={item.isDestructive ? '#EF4444' : '#6B7280'} 
                />
                <View style={styles.menuTextContainer}>
                  <Text style={[styles.menuText, item.isDestructive && styles.destructiveText]}>
                    {item.title}
                  </Text>
                  {item.subtitle && (
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  )}
                </View>
              </View>
              
              <View style={styles.menuRight}>
                {item.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
                {item.hasArrow && (
                  <ChevronRight size={16} color="#6B7280" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>AgriConnect v1.0.0</Text>
          <Text style={styles.appDescription}>
            Connecting farmers, contractors, and agricultural services
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  profileHeader: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verificationBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: '#A4D65E',
    fontWeight: '600',
    marginBottom: 8,
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
  contactInfo: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 16,
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactText: {
    fontSize: 16,
    color: '#1F2937',
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  achievementsSection: {
    padding: 20,
  },
  achievementsContainer: {
    gap: 12,
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lockedAchievement: {
    opacity: 0.5,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  lockedText: {
    color: '#9CA3AF',
  },
  settingsSection: {
    padding: 20,
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#1F2937',
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    color: '#1F2937',
  },
  destructiveText: {
    color: '#EF4444',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: '#22C55E',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  appInfo: {
    padding: 20,
    alignItems: 'center',
  },
  appVersion: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  appDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});