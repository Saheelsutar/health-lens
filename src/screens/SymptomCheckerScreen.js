import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { Card, IconCircle } from '../components/ui';

function SymptomRow({ label, iconName, iconColor, iconBg }) {
  const { colors } = useTheme();
  return (
    <Card style={{ paddingVertical: 14, paddingHorizontal: 14, marginTop: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <IconCircle bg={iconBg} size={40}>
            <Ionicons name={iconName} size={20} color={iconColor} />
          </IconCircle>
          <Text style={{ color: colors.text, fontWeight: '800' }}>{label}</Text>
        </View>
        <Ionicons name="add" size={20} color={colors.text} />
      </View>
    </Card>
  );
}

export function SymptomCheckerScreen() {
  const { colors } = useTheme();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 18, paddingBottom: 28 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, { color: colors.text }]}>What are your symptoms?</Text>
      <Text style={[styles.sub, { color: colors.mutedText }]}>
        Enter what you're feeling and we'll match it with our verified symptom database.
      </Text>

      <View style={[styles.search, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Ionicons name="search-outline" size={18} color={colors.mutedText} />
        <TextInput
          placeholder="Search symptoms (e.g. Headache)"
          placeholderTextColor={colors.mutedText}
          style={[styles.searchInput, { color: colors.text }]}
        />
      </View>

      <Text style={[styles.section, { color: colors.mutedText }]}>COMMON SYMPTOMS</Text>

      <SymptomRow label="Fever" iconName="thermometer-outline" iconColor={colors.blue} iconBg={colors.primarySoft} />
      <SymptomRow label="Headache" iconName="skull-outline" iconColor={colors.purple} iconBg={colors.insightBg} />
      <SymptomRow label="Shortness of breath" iconName="leaf-outline" iconColor="#2ECC71" iconBg="#E8FFF2" />
      <SymptomRow label="Cough" iconName="bug-outline" iconColor={colors.orange} iconBg={colors.warningSoft} />
      <SymptomRow label="Muscle Aches" iconName="flash-outline" iconColor="#FF4D67" iconBg="#FFE9EA" />
      <SymptomRow label="Fatigue" iconName="sad-outline" iconColor="#FFB020" iconBg="#FFF4D6" />

      <Card style={{ marginTop: 14, backgroundColor: colors.infoSoft, borderColor: 'transparent' }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
          <Text style={[styles.info, { color: colors.primary }]}>
            Our AI analysis provides general guidance based on common trends. For emergency situations, please contact
            your local medical services immediately.
          </Text>
        </View>
      </Card>

      <Pressable style={[styles.cta, { backgroundColor: colors.primary }]} onPress={() => {}}>
        <Text style={styles.ctaText}>Continue to Analysis  →</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '900', marginTop: 6 },
  sub: { marginTop: 8, fontSize: 13, lineHeight: 18, fontWeight: '600' },
  search: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  searchInput: { flex: 1, fontWeight: '600' },
  section: { marginTop: 18, fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  info: { flex: 1, fontSize: 12, lineHeight: 17, fontWeight: '700' },
  cta: {
    marginTop: 16,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaText: { color: '#FFFFFF', fontWeight: '900' },
});

