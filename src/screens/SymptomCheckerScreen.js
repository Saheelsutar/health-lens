import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native';
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
  const [symptomsText, setSymptomsText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const analyzeSymptoms = async () => {
    if (!symptomsText.trim()) {
      setError('Please enter your symptoms');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('https://health-backend-az5j.onrender.com/api/symptom-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptomsText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze symptoms');
      }

      if (data.success) {
        setResult(data.data);
      } else {
        setError('Analysis failed');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 18, paddingBottom: 28 }}
      keyboardShouldPersistTaps={true}
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
          value={symptomsText}
          onChangeText={setSymptomsText}
          multiline
        />
      </View>

      {error ? (
        <Card style={{ marginTop: 14, backgroundColor: colors.warningSoft, borderColor: 'transparent' }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Ionicons name="warning-outline" size={20} color={colors.orange} />
            <Text style={[styles.info, { color: colors.orange }]}>{error}</Text>
          </View>
        </Card>
      ) : null}

      {result ? (
        <View style={{ marginTop: 20 }}>
          <Card style={{ backgroundColor: colors.surface }}>
            <Text style={[styles.resultTitle, { color: colors.text }]}>Analysis Results</Text>
            
            <View style={{ marginTop: 16 }}>
              <Text style={[styles.label, { color: colors.mutedText }]}>SYMPTOMS DETECTED</Text>
              {result.extractedSymptoms.map((symptom, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                  <Text style={[styles.listItem, { color: colors.text }]}>{symptom}</Text>
                </View>
              ))}
            </View>

            <View style={{ marginTop: 16 }}>
              <Text style={[styles.label, { color: colors.mutedText }]}>SEVERITY</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <IconCircle bg={result.severity.includes('Severe') ? colors.warningSoft : colors.primarySoft} size={32}>
                  <Ionicons 
                    name={result.severity.includes('Severe') ? "alert-circle" : "information-circle"} 
                    size={16} 
                    color={result.severity.includes('Severe') ? colors.orange : colors.primary} 
                  />
                </IconCircle>
                <Text style={[styles.listItem, { color: colors.text, fontWeight: '700' }]}>{result.severity}</Text>
              </View>
            </View>

            <View style={{ marginTop: 16 }}>
              <Text style={[styles.label, { color: colors.mutedText }]}>POSSIBLE CAUSES</Text>
              {result.possibleCauses.map((cause, i) => (
                <Text key={i} style={[styles.listItem, { color: colors.text, marginTop: 6 }]}>• {cause}</Text>
              ))}
            </View>

            <View style={{ marginTop: 16 }}>
              <Text style={[styles.label, { color: colors.mutedText }]}>RELIEF SUGGESTIONS</Text>
              {result.reliefSuggestions.map((suggestion, i) => (
                <Text key={i} style={[styles.listItem, { color: colors.text, marginTop: 6 }]}>• {suggestion}</Text>
              ))}
            </View>

            <View style={{ marginTop: 16 }}>
              <Text style={[styles.label, { color: colors.mutedText }]}>WARNING SIGNS</Text>
              {result.warningSigns.map((sign, i) => (
                <View key={i} style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                  <Ionicons name="warning" size={16} color={colors.orange} style={{ marginTop: 2 }} />
                  <Text style={[styles.listItem, { color: colors.text, flex: 1 }]}>{sign}</Text>
                </View>
              ))}
            </View>

            <Card style={{ marginTop: 16, backgroundColor: colors.infoSoft, borderColor: 'transparent' }}>
              <Text style={[styles.disclaimer, { color: colors.primary }]}>{result.disclaimer}</Text>
            </Card>
          </Card>
        </View>
      ) : null}

      <Text style={[styles.section, { color: colors.mutedText }]}>COMMON SYMPTOMS</Text>

      {!result ? (
        <>
          <SymptomRow label="Fever" iconName="thermometer-outline" iconColor={colors.blue} iconBg={colors.primarySoft} />
          <SymptomRow label="Headache" iconName="skull-outline" iconColor={colors.purple} iconBg={colors.insightBg} />
          <SymptomRow label="Shortness of breath" iconName="leaf-outline" iconColor="#2ECC71" iconBg="#E8FFF2" />
          <SymptomRow label="Cough" iconName="bug-outline" iconColor={colors.orange} iconBg={colors.warningSoft} />
          <SymptomRow label="Muscle Aches" iconName="flash-outline" iconColor="#FF4D67" iconBg="#FFE9EA" />
          <SymptomRow label="Fatigue" iconName="sad-outline" iconColor="#FFB020" iconBg="#FFF4D6" />
        </>
      ) : null}

      <Card style={{ marginTop: 14, backgroundColor: colors.infoSoft, borderColor: 'transparent' }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
          <Text style={[styles.info, { color: colors.primary }]}>
            Our AI analysis provides general guidance based on common trends. For emergency situations, please contact
            your local medical services immediately.
          </Text>
        </View>
      </Card>

      <Pressable 
        style={[styles.cta, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]} 
        onPress={analyzeSymptoms}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.ctaText}>Continue to Analysis  →</Text>
        )}
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
  resultTitle: { fontSize: 20, fontWeight: '800' },
  label: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  listItem: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
  disclaimer: { fontSize: 11, lineHeight: 16, fontWeight: '600' },
});

