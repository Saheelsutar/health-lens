import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../context/AuthContext';
import { Card, IconCircle, ProgressBar, SmallButton } from '../components/ui';

function MiniHabitCard({ iconName, iconColor, iconBg, title, subtitle, progress }) {
  const { colors } = useTheme();
  return (
    <Card style={{ flex: 1, alignItems: 'center', paddingVertical: 18 }}>
      <View style={styles.ring}>
        <View style={[styles.ringInner, { borderColor: colors.border }]} />
        <View style={[styles.ringArc, { borderColor: iconColor, transform: [{ rotate: '-90deg' }] }]} />
        <IconCircle bg={iconBg} size={40}>
          <Ionicons name={iconName} size={20} color={iconColor} />
        </IconCircle>
      </View>
      <Text style={[styles.miniTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.miniSub, { color: colors.mutedText }]}>{subtitle}</Text>
    </Card>
  );
}

export function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const { auth } = useAuth();

  // Get user's first name or fallback to 'User'
  const userName = auth?.user?.name?.split(' ')[0] || 'User';
  
  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  const userInitials = getInitials(auth?.user?.name);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 18, paddingBottom: 28 }}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.dateText, { color: colors.mutedText }]}>Monday, June 12</Text>
          <Text style={[styles.helloText, { color: colors.text }]}>Hello, {userName}</Text>
        </View>

        <View style={{ position: 'relative' }}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{userInitials}</Text>
          </View>
          <View style={styles.badgeDot} />
        </View>
      </View>

      <View style={[styles.heroCard, { backgroundColor: colors.primary, shadowColor: colors.shadow }]}>
        <Text style={styles.heroTitle}>Feeling unwell?</Text>
        <Text style={styles.heroSub}>
          Get instant guidance based{'\n'}on verified symptom{'\n'}databases.
        </Text>

        <View style={{ marginTop: 14, flexDirection: 'row', alignItems: 'center' }}>
          <SmallButton
            label="Symptom Checker  →"
            onPress={() => navigation.navigate('SymptomChecker')}
            style={{ backgroundColor: '#FFFFFF', borderColor: 'transparent', paddingHorizontal: 16, paddingVertical: 10 }}
            textStyle={{ color: colors.primary, fontSize: 13 }}
          />
          <View style={{ flex: 1 }} />
          <View style={[styles.heroShield, { backgroundColor: 'rgba(255,255,255,0.14)' }]}>
            <Ionicons name="shield-checkmark-outline" size={26} color="rgba(255,255,255,0.55)" />
          </View>
        </View>
      </View>

      <View style={styles.sectionRow}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Daily Habits</Text>
        <Pressable hitSlop={10}>
          <Text style={[styles.sectionLink, { color: colors.primary }]}>View All</Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
        <MiniHabitCard
          iconName="water-outline"
          iconColor={colors.blue}
          iconBg={colors.primarySoft}
          title="Water"
          subtitle="1.2L / 2.0L"
          progress={0.6}
        />
        <MiniHabitCard
          iconName="moon-outline"
          iconColor={colors.purple}
          iconBg={colors.insightBg}
          title="Sleep"
          subtitle="6h 45m / 8h"
          progress={0.84}
        />
      </View>

      <Card style={{ marginTop: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <IconCircle bg={colors.warningSoft}>
            <Ionicons name="walk-outline" size={20} color={colors.orange} />
          </IconCircle>
          <View style={{ flex: 1 }}>
            <Text style={[styles.stepsTitle, { color: colors.mutedText }]}>Steps Today</Text>
            <Text style={[styles.stepsValue, { color: colors.text }]}>
              8,432 <Text style={[styles.stepsGoal, { color: colors.mutedText }]}>/ 10k</Text>
            </Text>
            <ProgressBar progress={0.84} color={colors.orange} style={{ marginTop: 10, height: 8, borderWidth: 0 }} />
          </View>
        </View>
      </Card>

      <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 18 }]}>Community Insights</Text>

      <Card style={{ marginTop: 12 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <IconCircle bg="#FFE9EA">
            <Ionicons name="trending-up-outline" size={20} color="#FF4D67" />
          </IconCircle>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Local Flu Alert</Text>
            <Text style={[styles.cardSub, { color: colors.mutedText }]}>
              Symptom reports have increased by 15% in your area over the last 48 hours.
            </Text>
          </View>
        </View>

        <View style={styles.trendFooter}>
          <Text style={[styles.trendLabel, { color: colors.primary }]}>HEALTH TREND</Text>
          <Text style={[styles.trendUpdated, { color: colors.mutedText }]}>Updated 2h ago</Text>
        </View>
      </Card>

      <Card style={{ marginTop: 12, paddingVertical: 14, paddingHorizontal: 14, backgroundColor: colors.surface, borderColor: colors.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons name="document-text-outline" size={18} color={colors.text} />
            <Text style={{ color: colors.text, fontWeight: '800' }}>Medical Reports & Records</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.text} />
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateText: { fontSize: 12, fontWeight: '700' },
  helloText: { fontSize: 26, fontWeight: '900', marginTop: 2 },
  avatar: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
  badgeDot: { position: 'absolute', right: 1, top: 1, width: 9, height: 9, borderRadius: 4.5, backgroundColor: '#FF4D4D' },
  heroCard: {
    marginTop: 16,
    borderRadius: 18,
    padding: 18,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  heroTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '900' },
  heroSub: { color: 'rgba(255,255,255,0.82)', marginTop: 8, fontSize: 13, lineHeight: 18, fontWeight: '600' },
  heroShield: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  sectionRow: { marginTop: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '900' },
  sectionLink: { fontSize: 13, fontWeight: '800' },
  ring: { width: 70, height: 70, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  ringInner: { position: 'absolute', width: 60, height: 60, borderRadius: 30, borderWidth: 6, opacity: 0.35 },
  ringArc: { position: 'absolute', width: 60, height: 60, borderRadius: 30, borderWidth: 6, borderRightColor: 'transparent', borderBottomColor: 'transparent' },
  miniTitle: { fontSize: 14, fontWeight: '900' },
  miniSub: { fontSize: 11, fontWeight: '700', marginTop: 4 },
  stepsTitle: { fontSize: 12, fontWeight: '800' },
  stepsValue: { marginTop: 2, fontSize: 22, fontWeight: '900' },
  stepsGoal: { fontSize: 12, fontWeight: '800' },
  cardTitle: { fontSize: 15, fontWeight: '900' },
  cardSub: { marginTop: 4, fontSize: 12, lineHeight: 17, fontWeight: '600' },
  trendFooter: { marginTop: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  trendLabel: { fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },
  trendUpdated: { fontSize: 11, fontStyle: 'italic', fontWeight: '600' },
});

