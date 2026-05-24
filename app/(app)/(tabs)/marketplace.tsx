import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowDownUp,
  Search,
  SlidersHorizontal,
  Tractor,
  Users,
  ShoppingCart,
  X,
} from 'lucide-react-native';
import { ComingSoonPanel } from '@/components/marketplace/ComingSoonPanel';
import { ResourceCard } from '@/components/marketplace/ResourceCard';
import { colors, radius, spacing } from '@/constants/theme';
import { useResourceStore } from '@/store/resourceStore';
import type { ResourceDisplay } from '@/types/api';

type MarketTab = 'equipment' | 'workers' | 'inputs';
type SortOption = 'name' | 'rating';

const MARKET_TABS: {
  id: MarketTab;
  title: string;
  icon: typeof Tractor;
}[] = [
  { id: 'equipment', title: 'Equipment', icon: Tractor },
  { id: 'workers', title: 'Workers', icon: Users },
  { id: 'inputs', title: 'Inputs', icon: ShoppingCart },
];

export default function MarketplaceScreen() {
  const resources = useResourceStore((s) => s.resources);
  const isLoading = useResourceStore((s) => s.isLoading);
  const error = useResourceStore((s) => s.error);
  const fetchResources = useResourceStore((s) => s.fetchResources);

  const [activeTab, setActiveTab] = useState<MarketTab>('equipment');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const filteredResources = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let list = resources.filter((item) => {
      if (!query) return true;
      return (
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.ownerName.toLowerCase().includes(query)
      );
    });

    if (sortBy === 'rating') {
      list = [...list].sort((a, b) => {
        const ar = a.averageRating ?? 0;
        const br = b.averageRating ?? 0;
        return br - ar;
      });
    } else {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [resources, searchQuery, sortBy]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const sortLabel = sortBy === 'rating' ? 'Top rated' : 'Name A–Z';

  const renderHeader = () => (
    <>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.heroEyebrow}>AgroTech Marketplace</Text>
        <Text style={styles.heroTitle}>Rent equipment near you</Text>
        <Text style={styles.heroSubtitle}>
          {isLoading
            ? 'Loading from server…'
            : `${resources.length} resources · live API`}
        </Text>
      </LinearGradient>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, owner…"
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <X size={18} color={colors.textSecondary} />
            </Pressable>
          )}
        </View>
        <Pressable
          style={styles.filterIconBtn}
          onPress={() => fetchResources(true)}
        >
          <SlidersHorizontal size={20} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.tabsRow}>
        {MARKET_TABS.map((tab) => {
          const active = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <Pressable
              key={tab.id}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Icon
                size={18}
                color={active ? '#FFFFFF' : colors.textSecondary}
              />
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {tab.title}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {activeTab === 'equipment' && (
        <>
          <View style={styles.resultsBar}>
            <Text style={styles.resultsCount}>
              {filteredResources.length}{' '}
              {filteredResources.length === 1 ? 'result' : 'results'}
            </Text>
            <Pressable
              style={styles.sortBtn}
              onPress={() => setShowSortMenu((v) => !v)}
            >
              <ArrowDownUp size={16} color={colors.text} />
              <Text style={styles.sortBtnText}>{sortLabel}</Text>
            </Pressable>
          </View>

          {showSortMenu && (
            <View style={styles.sortMenu}>
              {(
                [
                  ['name', 'Name A–Z'],
                  ['rating', 'Top rated'],
                ] as const
              ).map(([value, label]) => (
                <Pressable
                  key={value}
                  style={[
                    styles.sortOption,
                    sortBy === value && styles.sortOptionActive,
                  ]}
                  onPress={() => {
                    setSortBy(value);
                    setShowSortMenu(false);
                  }}
                >
                  <Text
                    style={[
                      styles.sortOptionText,
                      sortBy === value && styles.sortOptionTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable
                style={styles.retryBtn}
                onPress={() => fetchResources(true)}
              >
                <Text style={styles.retryText}>Retry</Text>
              </Pressable>
            </View>
          ) : null}
        </>
      )}
    </>
  );

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <ActivityIndicator
          style={styles.loader}
          size="large"
          color={colors.primary}
        />
      );
    }
    return (
      <View style={styles.empty}>
        <Tractor size={48} color={colors.textMuted} />
        <Text style={styles.emptyTitle}>No resources found</Text>
        <Text style={styles.emptyBody}>
          {searchQuery
            ? 'Try a different search term.'
            : 'No equipment is listed yet. Check back soon.'}
        </Text>
      </View>
    );
  };

  if (activeTab !== 'equipment') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {renderHeader()}
        <ComingSoonPanel type={activeTab} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList<ResourceDisplay>
        data={filteredResources}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ResourceCard
            item={item}
            isFavorite={favorites.has(item.id)}
            onToggleFavorite={toggleFavorite}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshing={isLoading}
        onRefresh={() => fetchResources(true)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hero: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    padding: spacing.xl,
    borderRadius: radius.lg,
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)' },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, fontSize: 16, color: colors.text, paddingVertical: 0 },
  filterIconBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: { backgroundColor: colors.earth, borderColor: colors.earth },
  tabText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  tabTextActive: { color: '#FFFFFF' },
  resultsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  resultsCount: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortBtnText: { fontSize: 13, fontWeight: '600', color: colors.text },
  sortMenu: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  sortOption: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sortOptionActive: { backgroundColor: colors.primaryMuted },
  sortOptionText: { fontSize: 14, color: colors.text },
  sortOptionTextActive: { fontWeight: '700', color: colors.primaryDark },
  errorBox: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    backgroundColor: '#FEE2E2',
    borderRadius: radius.md,
  },
  errorText: { color: '#B91C1C', fontSize: 14, marginBottom: spacing.sm },
  retryBtn: { alignSelf: 'flex-start' },
  retryText: { color: '#B91C1C', fontWeight: '700' },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl + 16,
  },
  loader: { marginVertical: 48 },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: spacing.xxl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyBody: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
