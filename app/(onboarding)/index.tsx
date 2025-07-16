import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { User, Wrench, Users } from 'lucide-react-native';

export default function OnboardingScreen() {
  const [selectedRole, setSelectedRole] = useState<string>('');

  const roles = [
    {
      role: 'farmer',
      title: 'Farmer',
      description: 'Rent equipment, hire workers, buy inputs, and sell produce',
      icon: User,
      color: '#A4D65E',
    },
    {
      role: 'contractor',
      title: 'Contractor',
      description:
        'List equipment & services, manage bookings, and build reputation',
      icon: Wrench,
      color: '#A16207',
    },
    {
      role: 'general',
      title: 'General User',
      description: 'Hire agricultural workers and explore services',
      icon: Users,
      color: '#0EA5E9',
    },
  ];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handleContinue = () => {
    if (selectedRole) {
      router.push(`/(onboarding)/profile-setup?role=${selectedRole}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to AgriConnect</Text>
        <Text style={styles.subtitle}>Choose your role to get started</Text>
      </View>

      <View style={styles.rolesContainer}>
        {roles.map((role) => (
          <TouchableOpacity
            key={role.role}
            style={[
              styles.roleCard,
              selectedRole === role.role && {
                borderColor: role.color,
                borderWidth: 2,
              },
            ]}
            onPress={() => handleRoleSelect(role.role)}
          >
            <View
              style={[styles.roleIcon, { backgroundColor: role.color + '20' }]}
            >
              <role.icon size={32} color={role.color} />
            </View>
            <Text style={styles.roleTitle}>{role.title}</Text>
            <Text style={styles.roleDescription}>{role.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.continueButton, !selectedRole && styles.disabledButton]}
        onPress={handleContinue}
        disabled={!selectedRole}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  rolesContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roleIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: '#A4D65E',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
