import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Star, MapPin, User, Calendar, Clock, Shield, Heart, Share, Phone, MessageCircle } from 'lucide-react-native';
import { useAppStore } from '../../store/useAppStore';

const { width } = Dimensions.get('window');

export default function EquipmentDetailScreen() {
  const { id } = useLocalSearchParams();
  const { equipment } = useAppStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState<'hour' | 'day'>('hour');

  const equipmentItem = equipment.find(item => item.id === id);

  if (!equipmentItem) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Equipment not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleBookNow = () => {
    // Navigate to booking screen or show booking modal
    console.log('Book equipment:', equipmentItem.id);
  };

  const handleContactOwner = () => {
    // Navigate to chat or show contact options
    console.log('Contact owner:', equipmentItem.owner.id);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Equipment Details</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Heart size={24} color="#1F2937" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Share size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(index);
            }}
          >
            {equipmentItem.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.equipmentImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          
          {/* Image Indicators */}
          <View style={styles.imageIndicators}>
            {equipmentItem.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  currentImageIndex === index && styles.activeIndicator
                ]}
              />
            ))}
          </View>

          {/* Availability Badge */}
          <View style={[styles.availabilityBadge, {
            backgroundColor: equipmentItem.available ? '#A4D65E' : '#EF4444'
          }]}>
            <Text style={styles.availabilityText}>
              {equipmentItem.available ? 'Available' : 'Not Available'}
            </Text>
          </View>
        </View>

        {/* Equipment Info */}
        <View style={styles.infoSection}>
          <Text style={styles.equipmentTitle}>{equipmentItem.title}</Text>
          <Text style={styles.equipmentDescription}>{equipmentItem.description}</Text>

          {/* Rating and Location */}
          <View style={styles.ratingLocationRow}>
            <View style={styles.ratingContainer}>
              <Star size={16} color="#FFC107" fill="#FFC107" />
              <Text style={styles.ratingText}>{equipmentItem.rating}</Text>
              <Text style={styles.reviewCount}>({equipmentItem.reviewCount} reviews)</Text>
            </View>
            <View style={styles.locationContainer}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.locationText}>{equipmentItem.location}</Text>
            </View>
          </View>

          {/* Owner Info */}
          <View style={styles.ownerSection}>
            <View style={styles.ownerInfo}>
              <View style={styles.ownerAvatar}>
                <User size={24} color="#6B7280" />
              </View>
              <View style={styles.ownerDetails}>
                <Text style={styles.ownerName}>{equipmentItem.owner.name}</Text>
                <View style={styles.ownerMeta}>
                  <Text style={styles.ownerRole}>Equipment Owner</Text>
                  {equipmentItem.owner.verified && (
                    <>
                      <Text style={styles.separator}>•</Text>
                      <Shield size={12} color="#A4D65E" />
                      <Text style={styles.verifiedText}>Verified</Text>
                    </>
                  )}
                </View>
              </View>
            </View>
            <View style={styles.ownerRating}>
              <Star size={14} color="#FFC107" fill="#FFC107" />
              <Text style={styles.ownerRatingText}>{equipmentItem.owner.rating}</Text>
            </View>
          </View>

          {/* Pricing */}
          <View style={styles.pricingSection}>
            <Text style={styles.sectionTitle}>Pricing</Text>
            <View style={styles.pricingOptions}>
              <TouchableOpacity
                style={[
                  styles.pricingOption,
                  selectedDuration === 'hour' && styles.selectedPricingOption
                ]}
                onPress={() => setSelectedDuration('hour')}
              >
                <Clock size={16} color={selectedDuration === 'hour' ? '#FFFFFF' : '#6B7280'} />
                <Text style={[
                  styles.pricingOptionText,
                  selectedDuration === 'hour' && styles.selectedPricingOptionText
                ]}>
                  Per Hour
                </Text>
                <Text style={[
                  styles.pricingOptionPrice,
                  selectedDuration === 'hour' && styles.selectedPricingOptionPrice
                ]}>
                  ₹{equipmentItem.pricePerHour}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.pricingOption,
                  selectedDuration === 'day' && styles.selectedPricingOption
                ]}
                onPress={() => setSelectedDuration('day')}
              >
                <Calendar size={16} color={selectedDuration === 'day' ? '#FFFFFF' : '#6B7280'} />
                <Text style={[
                  styles.pricingOptionText,
                  selectedDuration === 'day' && styles.selectedPricingOptionText
                ]}>
                  Per Day
                </Text>
                <Text style={[
                  styles.pricingOptionPrice,
                  selectedDuration === 'day' && styles.selectedPricingOptionPrice
                ]}>
                  ₹{equipmentItem.pricePerDay}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Specifications */}
          <View style={styles.specificationsSection}>
            <Text style={styles.sectionTitle}>Specifications</Text>
            <View style={styles.specGrid}>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Brand</Text>
                <Text style={styles.specValue}>{equipmentItem.specifications.brand}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Model</Text>
                <Text style={styles.specValue}>{equipmentItem.specifications.model}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Year</Text>
                <Text style={styles.specValue}>{equipmentItem.specifications.year}</Text>
              </View>
              {equipmentItem.specifications.power && (
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Power</Text>
                  <Text style={styles.specValue}>{equipmentItem.specifications.power}</Text>
                </View>
              )}
              {equipmentItem.specifications.capacity && (
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Capacity</Text>
                  <Text style={styles.specValue}>{equipmentItem.specifications.capacity}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Features */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresList}>
              {equipmentItem.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.featureDot} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.contactButton} onPress={handleContactOwner}>
          <MessageCircle size={20} color="#A4D65E" />
          <Text style={styles.contactButtonText}>Contact</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.bookButton, !equipmentItem.available && styles.disabledBookButton]}
          onPress={handleBookNow}
          disabled={!equipmentItem.available}
        >
          <Text style={styles.bookButtonText}>
            {equipmentItem.available ? 'Book Now' : 'Not Available'}
          </Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  equipmentImage: {
    width: width,
    height: 250,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeIndicator: {
    backgroundColor: '#FFFFFF',
  },
  availabilityBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  availabilityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  equipmentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  equipmentDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 16,
  },
  ratingLocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  reviewCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
  },
  ownerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ownerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  ownerDetails: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  ownerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ownerRole: {
    fontSize: 12,
    color: '#6B7280',
  },
  separator: {
    fontSize: 12,
    color: '#6B7280',
  },
  verifiedText: {
    fontSize: 12,
    color: '#A4D65E',
    fontWeight: '500',
  },
  ownerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ownerRatingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  pricingSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  pricingOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  pricingOption: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPricingOption: {
    backgroundColor: '#A4D65E',
    borderColor: '#A4D65E',
  },
  pricingOptionText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 4,
  },
  selectedPricingOptionText: {
    color: '#FFFFFF',
  },
  pricingOptionPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  selectedPricingOptionPrice: {
    color: '#FFFFFF',
  },
  specificationsSection: {
    marginBottom: 24,
  },
  specGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  specItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    width: '48%',
  },
  specLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  featuresSection: {
    marginBottom: 24,
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#A4D65E',
  },
  featureText: {
    fontSize: 14,
    color: '#1F2937',
  },
  bottomActions: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
    borderWidth: 1,
    borderColor: '#A4D65E',
  },
  contactButtonText: {
    color: '#A4D65E',
    fontSize: 16,
    fontWeight: '600',
  },
  bookButton: {
    flex: 1,
    backgroundColor: '#A4D65E',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledBookButton: {
    backgroundColor: '#D1D5DB',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#A4D65E',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});