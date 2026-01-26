import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { Card, IconCircle, ProgressBar, SmallButton } from '../components/ui';

export function CommunityScreen() {
  const { colors } = useTheme();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 18, paddingBottom: 28 }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Ionicons name="location-outline" size={14} color={colors.mutedText} />
        <Text style={{ color: colors.mutedText, fontWeight: '700', fontSize: 12 }}>Greater San Francisco Area</Text>
      </View>

      <Card style={{ marginTop: 12, backgroundColor: colors.warningSoft, borderColor: 'transparent' }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <IconCircle bg={colors.orange} size={40}>
            <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
          </IconCircle>
          <View style={{ flex: 1 }}>
            <Text style={[styles.alertTitle, { color: colors.text }]}>Flu Season Alert</Text>
            <Text style={[styles.alertText, { color: colors.mutedText }]}>
              Cases of Influenza A have increased by 24% in your zip code this week. Consider a booster.
            </Text>
          </View>
        </View>
      </Card>

      <View style={styles.sectionRow}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Local Health Trends</Text>
        <Text style={{ color: colors.purple, fontWeight: '800', fontSize: 12 }}>Weekly</Text>
      </View>

      <Card style={{ marginTop: 12, paddingVertical: 20 }}>
        <View style={{ height: 110, borderRadius: 14, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border }} />

        <View style={{ marginTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.purple }} />
            <Text style={{ color: colors.mutedText, fontWeight: '700', fontSize: 12 }}>Current Incidence</Text>
          </View>
          <Text style={{ color: colors.text, fontWeight: '900', fontSize: 12 }}>+12% vs last week</Text>
        </View>
      </Card>

      <View style={styles.sectionRow}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Medical Reports</Text>
        <Text style={{ color: colors.purple, fontWeight: '800' }}>+ Upload</Text>
      </View>

      <Card style={{ marginTop: 12 }}>
        <View style={styles.reportRow}>
          <IconCircle bg={colors.primarySoft} size={40}>
            <Ionicons name="document-text-outline" size={18} color={colors.primary} />
          </IconCircle>
          <View style={{ flex: 1 }}>
            <Text style={[styles.reportTitle, { color: colors.text }]}>Blood Work Analysis</Text>
            <Text style={[styles.reportSub, { color: colors.mutedText }]}>Analyzed Oct 12, 2023</Text>
          </View>
          <Ionicons name="ellipsis-vertical" size={16} color={colors.mutedText} />
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.reportRow}>
          <IconCircle bg="#E8FFF2" size={40}>
            <Ionicons name="checkmark-circle-outline" size={18} color={colors.success} />
          </IconCircle>
          <View style={{ flex: 1 }}>
            <Text style={[styles.reportTitle, { color: colors.text }]}>General Health Screen</Text>
            <Text style={[styles.reportSub, { color: colors.mutedText }]}>Analyzed Sep 05, 2023</Text>
          </View>
          <Ionicons name="ellipsis-vertical" size={16} color={colors.mutedText} />
        </View>
      </Card>

      <View style={[styles.aiCard, { backgroundColor: colors.purple, shadowColor: colors.shadow }]}>
        <Text style={styles.aiTitle}>Get AI Data Analysis</Text>
        <Text style={styles.aiSub}>
          Our engine compares your medical reports with community trends for personalized preventive insights.
        </Text>
        <SmallButton
          label="Start New Analysis"
          onPress={() => {}}
          style={{ marginTop: 14, backgroundColor: '#FFFFFF', borderColor: 'transparent', paddingVertical: 12 }}
          textStyle={{ color: colors.purple, fontSize: 13, fontWeight: '900' }}
        />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 18 }]}>Health Density Map</Text>
      <Card style={{ marginTop: 12, padding: 0, overflow: 'hidden' }}>
        <View style={{ height: 210, backgroundColor: '#8BA5A8' }}>
          <View style={{ position: 'absolute', left: 18, bottom: 16, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 }}>
            <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 11 }}>High Activity Near You</Text>
          </View>
          <View style={{ position: 'absolute', left: '42%', top: '44%', width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF4D67' }} />
          <View style={{ position: 'absolute', left: '62%', top: '52%', width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF934D' }} />
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  alertTitle: { fontSize: 15, fontWeight: '900' },
  alertText: { marginTop: 4, fontSize: 12, lineHeight: 17, fontWeight: '600' },
  sectionRow: { marginTop: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '900' },
  reportRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  reportTitle: { fontSize: 14, fontWeight: '900' },
  reportSub: { marginTop: 2, fontSize: 12, fontWeight: '600' },
  divider: { height: 1, width: '100%' },
  aiCard: {
    marginTop: 14,
    borderRadius: 18,
    padding: 18,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  aiTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
  aiSub: { color: 'rgba(255,255,255,0.82)', marginTop: 8, fontSize: 12, lineHeight: 17, fontWeight: '600' },
});

