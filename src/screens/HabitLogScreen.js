import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { Card, IconCircle, ProgressBar } from '../components/ui';

function DayPill({ day, date, active }) {
  const { colors } = useTheme();
  return (
    <View style={styles.dayPill}>
      <Text style={[styles.dayLabel, { color: colors.mutedText }]}>{day}</Text>
      <View
        style={[
          styles.dayCircle,
          active && { backgroundColor: colors.purple, shadowColor: colors.shadow },
        ]}
      >
        <Text style={[styles.dayDate, { color: active ? '#fff' : colors.text }]}>{date}</Text>
      </View>
    </View>
  );
}

function GoalCard({ title, target, currentLabel, progress, accent, iconName, iconBg }) {
  const { colors } = useTheme();
  return (
    <Card style={{ marginTop: 14 }}>
      <View style={styles.goalTopRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
          <IconCircle bg={iconBg}>
            <Ionicons name={iconName} size={20} color={accent} />
          </IconCircle>
          <View style={{ flex: 1 }}>
            <Text style={[styles.goalTitle, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.goalSub, { color: colors.mutedText }]}>Target: {target}</Text>
          </View>
        </View>

        <View style={[styles.plusPill, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Ionicons name="add" size={18} color={colors.text} />
        </View>
      </View>

      <View style={styles.goalMidRow}>
        <Text style={[styles.goalCurrent, { color: colors.text }]}>{currentLabel}</Text>
        <Text style={[styles.goalPct, { color: colors.mutedText }]}>{Math.round(progress * 100)}%</Text>
      </View>

      <ProgressBar progress={progress} color={accent} style={{ marginTop: 10, borderWidth: 0 }} />
    </Card>
  );
}

export function HabitLogScreen() {
  const { colors } = useTheme();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 18, paddingBottom: 28 }}
    >
      <Card style={{ paddingVertical: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <DayPill day="MON" date="12" />
          <DayPill day="TUE" date="13" />
          <DayPill day="WED" date="14" active />
          <DayPill day="THU" date="15" />
          <DayPill day="FRI" date="16" />
          <DayPill day="SAT" date="17" />
          <DayPill day="SUN" date="18" />
        </View>
      </Card>

      <View style={styles.sectionRow}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Goals</Text>
        <Pressable hitSlop={10}>
          <Text style={[styles.sectionLink, { color: colors.purple }]}>View Insights</Text>
        </Pressable>
      </View>

      <GoalCard
        title="Nutrition"
        target="2,100 kcal"
        currentLabel="Current: 1,450 kcal"
        progress={0.69}
        accent={colors.orange}
        iconName="restaurant-outline"
        iconBg={colors.warningSoft}
      />
      <GoalCard
        title="Physical Activity"
        target="45 min"
        currentLabel="Current: 30 min"
        progress={0.66}
        accent={colors.blue}
        iconName="walk-outline"
        iconBg={colors.primarySoft}
      />
      <GoalCard
        title="Sleep"
        target="8h 00m"
        currentLabel="Current: 7h 20m"
        progress={0.92}
        accent={colors.purple}
        iconName="moon-outline"
        iconBg={colors.insightBg}
      />

      <Card style={{ marginTop: 16, backgroundColor: colors.insightBg, borderColor: 'transparent' }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Ionicons name="bulb-outline" size={22} color={colors.purple} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.insightTitle, { color: colors.purple }]}>Preventive Insight</Text>
            <Text style={[styles.insightText, { color: colors.mutedText }]}>
              Increasing your activity by 15 minutes today will help maintain your cardiovascular health trends.
            </Text>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  dayPill: { alignItems: 'center', gap: 8 },
  dayLabel: { fontSize: 11, fontWeight: '700' },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDate: { fontWeight: '800', fontSize: 14 },
  sectionRow: { marginTop: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 22, fontWeight: '800' },
  sectionLink: { fontSize: 13, fontWeight: '700' },
  goalTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  goalTitle: { fontSize: 16, fontWeight: '800' },
  goalSub: { marginTop: 2, fontSize: 12, fontWeight: '600' },
  plusPill: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalMidRow: { marginTop: 14, flexDirection: 'row', justifyContent: 'space-between' },
  goalCurrent: { fontSize: 12, fontWeight: '700' },
  goalPct: { fontSize: 12, fontWeight: '800' },
  insightTitle: { fontSize: 16, fontWeight: '900' },
  insightText: { marginTop: 8, fontSize: 13, lineHeight: 18, fontWeight: '600' },
});

