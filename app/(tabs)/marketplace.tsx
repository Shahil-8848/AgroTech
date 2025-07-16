import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Search,
  Filter,
  Tractor,
  Users,
  ShoppingCart,
  Star,
  MapPin,
  User,
  Heart,
} from 'lucide-react-native';
import { useAppStore } from '../../store/useAppStore';

export default function MarketplaceScreen() {
  const {
    equipment,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = useAppStore();
  const [activeCategory, setActiveCategory] = useState('equipment');

  const categories = [
    { id: 'equipment', title: 'Equipment', icon: Tractor },
    { id: 'workers', title: 'Workers', icon: Users },
    { id: 'inputs', title: 'Inputs', icon: ShoppingCart },
  ];

  const equipmentCategories = [
    { id: 'all', title: 'All' },
    { id: 'tractor', title: 'Tractors' },
    { id: 'harvester', title: 'Harvesters' },
    { id: 'irrigation', title: 'Irrigation' },
    { id: 'tools', title: 'Tools' },
    { id: 'drone', title: 'Drones' },
  ];

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEquipmentPress = (equipmentId: string) => {
    router.push(`/equipment/${equipmentId}`);
  };

  const renderEquipmentCard = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.equipmentCard}
      onPress={() => handleEquipmentPress(item.id)}
    >
      <View style={styles.cardImageContainer}>
        <Image
          source={{ uri: item.images[0] }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.favoriteButton}>
          <Heart size={16} color="#FFFFFF" />
        </TouchableOpacity>
        <View
          style={[
            styles.availabilityBadge,
            {
              backgroundColor: item.available ? '#A4D65E' : '#EF4444',
            },
          ]}
        >
          <Text style={styles.availabilityText}>
            {item.available ? 'Available' : 'Busy'}
          </Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.equipmentTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.equipmentDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.ownerInfo}>
          <View style={styles.ownerAvatar}>
            <User size={16} color="#6B7280" />
          </View>
          <Text style={styles.ownerName}>{item.owner.name}</Text>
          {item.owner.verified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓</Text>
            </View>
          )}
        </View>

        <View style={styles.locationRow}>
          <MapPin size={14} color="#6B7280" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.priceContainer}>
            <Text style={styles.pricePerHour}>₹{item.pricePerHour}/hr</Text>
            <Text style={styles.pricePerDay}>₹{item.pricePerDay}/day</Text>
          </View>

          <View style={styles.ratingContainer}>
            <Star size={14} color="#FFC107" fill="#FFC107" />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.reviewCount}>({item.reviewCount})</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.bookButton, !item.available && styles.disabledButton]}
          disabled={!item.available}
        >
          <Text style={styles.bookButtonText}>
            {item.available ? 'Book Now' : 'Not Available'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Marketplace</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search equipment, workers, or inputs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Main Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              activeCategory === category.id && styles.activeCategoryButton,
            ]}
            onPress={() => setActiveCategory(category.id)}
          >
            <category.icon
              size={20}
              color={activeCategory === category.id ? '#FFFFFF' : '#6B7280'}
            />
            <Text
              style={[
                styles.categoryText,
                activeCategory === category.id && styles.activeCategoryText,
              ]}
            >
              {category.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Equipment Sub-categories */}
      {activeCategory === 'equipment' && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.subCategoriesContainer}
        >
          {equipmentCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.subCategoryButton,
                selectedCategory === category.id &&
                  styles.activeSubCategoryButton,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text
                style={[
                  styles.subCategoryText,
                  selectedCategory === category.id &&
                    styles.activeSubCategoryText,
                ]}
              >
                {category.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Equipment Grid */}
      {activeCategory === 'equipment' && (
        <ScrollView
          style={styles.equipmentGrid}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.gridContainer}>
            {filteredEquipment.map(renderEquipmentCard)}
          </View>
        </ScrollView>
      )}

      {/* Other categories placeholder */}
      {activeCategory !== 'equipment' && (
        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonText}>
            {activeCategory === 'workers' ? 'Workers' : 'Inputs'} section coming
            soon!
          </Text>
        </View>
      )}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    // paddingHorizontal: 20,
    // marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  categoriesContainer: {
    // paddingHorizontal: 5,
    // marginBottom: 3,
    height: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 30,
    marginRight: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeCategoryButton: {
    backgroundColor: '#A4D65E',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  subCategoriesContainer: {
    backgroundColor: 'blue',
    // paddingHorizontal: 5,
    // marginBottom: 1,
  },
  subCategoryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeSubCategoryButton: {
    backgroundColor: '#A4D65E',
    borderColor: '#A4D65E',
  },
  subCategoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeSubCategoryText: {
    color: '#FFFFFF',
  },
  equipmentGrid: {
    flex: 1,
    paddingHorizontal: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    // paddingBottom: 20,
  },
  equipmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardImageContainer: {
    position: 'relative',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  availabilityBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  availabilityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  cardContent: {
    padding: 3,
    backgroundColor: 'red',
  },
  equipmentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  equipmentDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 16,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ownerAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  ownerName: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '500',
    flex: 1,
  },
  verifiedBadge: {
    backgroundColor: '#A4D65E',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 11,
    color: '#6B7280',
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceContainer: {
    flex: 1,
  },
  pricePerHour: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#A4D65E',
  },
  pricePerDay: {
    fontSize: 11,
    color: '#6B7280',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '500',
  },
  reviewCount: {
    fontSize: 11,
    color: '#6B7280',
  },
  bookButton: {
    backgroundColor: '#A4D65E',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  comingSoon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoonText: {
    fontSize: 16,
    color: '#6B7280',
  },
});
