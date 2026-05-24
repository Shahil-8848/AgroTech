import { router } from 'expo-router';
import { BadgeCheck, Heart, MapPin, Star, Tractor } from 'lucide-react-native';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';
import type { ResourceDisplay } from '@/types/api';

const PLACEHOLDER_IMAGE =
  'https://images.pexels.com/photos/96715/pexels-photo-96715.jpeg?auto=compress&cs=tinysrgb&w=800';

interface ResourceCardProps {
  item: ResourceDisplay;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

export function ResourceCard({
  item,
  isFavorite,
  onToggleFavorite,
}: ResourceCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => router.push(`/equipment/${item.id}`)}
    >
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: PLACEHOLDER_IMAGE }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.imageOverlay}>
          <Tractor size={32} color="rgba(255,255,255,0.9)" />
        </View>
        <View style={styles.imageTopRow}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>Resource</Text>
          </View>
          <Pressable
            style={styles.favoriteBtn}
            onPress={() => onToggleFavorite(item.id)}
            hitSlop={8}
          >
            <Heart
              size={18}
              color={isFavorite ? colors.danger : '#FFFFFF'}
              fill={isFavorite ? colors.danger : 'transparent'}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {item.name}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.ownerRow}>
          <View style={styles.ownerAvatar}>
            <Text style={styles.ownerInitial}>
              {item.ownerName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.ownerName} numberOfLines={1}>
            {item.ownerName}
          </Text>
          <BadgeCheck size={16} color={colors.primary} />
        </View>

        <View style={styles.footer}>
          <View style={styles.metaCol}>
            <View style={styles.locationRow}>
              <MapPin size={14} color={colors.textSecondary} />
              <Text style={styles.metaText}>Listed on AgroTech</Text>
            </View>
          </View>
          {item.averageRating != null ? (
            <View style={styles.ratingWrap}>
              <Star size={14} color={colors.warning} fill={colors.warning} />
              <Text style={styles.rating}>{item.averageRating.toFixed(1)}</Text>
              <Text style={styles.reviews}>({item.reviewCount})</Text>
            </View>
          ) : (
            <Text style={styles.noReviews}>No reviews yet</Text>
          )}
        </View>

        <Pressable
          style={styles.bookBtn}
          onPress={() => router.push(`/equipment/${item.id}`)}
        >
          <Text style={styles.bookBtnText}>View & reserve</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.96,
  },
  imageWrap: {
    height: 168,
    backgroundColor: colors.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 50, 20, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageTopRow: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryPill: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.earth,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  favoriteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  ownerAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownerInitial: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  ownerName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  metaCol: { flex: 1 },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  ratingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  reviews: {
    fontSize: 12,
    color: colors.textMuted,
  },
  noReviews: {
    fontSize: 12,
    color: colors.textMuted,
  },
  bookBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
  },
  bookBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
