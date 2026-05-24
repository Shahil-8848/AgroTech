import { Sprout, Users, ShoppingCart } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';

const PANEL_CONFIG = {
  workers: {
    icon: Users,
    title: 'Hire skilled workers',
    description:
      'Browse verified farm hands, operators, and seasonal labor near your fields.',
  },
  inputs: {
    icon: ShoppingCart,
    title: 'Farm inputs marketplace',
    description:
      'Seeds, fertilizers, and supplies from trusted suppliers — launching soon.',
  },
} as const;

interface ComingSoonPanelProps {
  type: 'workers' | 'inputs';
}

export function ComingSoonPanel({ type }: ComingSoonPanelProps) {
  const config = PANEL_CONFIG[type];
  const Icon = config.icon;

  return (
    <View style={styles.wrap}>
      <View style={styles.iconRing}>
        <Icon size={40} color={colors.primaryDark} />
      </View>
      <View style={styles.badge}>
        <Sprout size={14} color={colors.earth} />
        <Text style={styles.badgeText}>Coming soon</Text>
      </View>
      <Text style={styles.title}>{config.title}</Text>
      <Text style={styles.description}>{config.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl + 8,
    paddingBottom: 80,
  },
  iconRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.earthMuted,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    marginBottom: spacing.lg,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.earth,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
