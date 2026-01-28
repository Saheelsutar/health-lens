import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { Card, IconCircle } from '../components/ui';

function SymptomRow({ label, iconName, iconColor, iconBg, isSelected, onPress }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress}>
      <Card style={{ 
        paddingVertical: 14, 
        paddingHorizontal: 14, 
        marginTop: 12,
        borderWidth: isSelected ? 2 : 0,
        borderColor: isSelected ? colors.primary : 'transparent',
        backgroundColor: isSelected ? colors.primarySoft : colors.surface
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <IconCircle bg={iconBg} size={40}>
              <Ionicons name={iconName} size={20} color={iconColor} />
            </IconCircle>
            <Text style={{ color: colors.text, fontWeight: '800' }}>{label}</Text>
          </View>
          <Ionicons 
            name={isSelected ? "checkmark-circle" : "add"} 
            size={20} 
            color={isSelected ? colors.primary : colors.text} 
          />
        </View>
      </Card>
    </Pressable>
  );
}

export function SymptomCheckerScreen({ navigation }) {
  const { colors } = useTheme();
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [definitions, setDefinitions] = useState(null);
  const [followUpQuestions, setFollowUpQuestions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptom)) {
        return prev.filter(s => s !== symptom);
      } else {
        return [...prev, symptom];
      }
    });
  };

  const analyzeSymptoms = async () => {
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom');
      return;
    }

    setLoading(true);
    setError('');
    setDefinitions(null);
    setFollowUpQuestions(null);
    setAnswers({});

    try {
      // First API call - Get WHO symptom definitions
      const response1 = await fetch('https://health-backend-az5j.onrender.com/api/whoSymptoms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms: selectedSymptoms }),
      });

      const data1 = await response1.json();

      if (!response1.ok) {
        throw new Error(data1.error || 'Failed to fetch symptom definitions');
      }

      setDefinitions(data1.definitions);

      // Second API call - Get follow-up questions
      const response2 = await fetch('https://health-backend-az5j.onrender.com/api/whoSymptoms/followUP/Qs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ definitions: data1.definitions }),
      });

      const data2 = await response2.json();

      if (!response2.ok) {
        throw new Error(data2.error || 'Failed to fetch follow-up questions');
      }

      setFollowUpQuestions(data2.followUpQuestions);

      // Navigate to follow-up questions screen
      navigation.navigate('FollowUpQuestions', {
        followUpQuestions: data2.followUpQuestions,
        definitions: data1.definitions,
        selectedSymptoms: selectedSymptoms,
      });
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
      keyboardShouldPersistTaps="always"
    >
      <Text style={[styles.title, { color: colors.text }]}>What are your symptoms?</Text>
      <Text style={[styles.sub, { color: colors.mutedText }]}>
        Select one or more symptoms from the list below that match what you're experiencing.
      </Text>

      {selectedSymptoms.length > 0 && (
        <Card style={{ marginTop: 14, backgroundColor: colors.primarySoft, borderColor: 'transparent' }}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Ionicons name="checkbox-outline" size={20} color={colors.primary} />
            <Text style={[styles.info, { color: colors.primary }]}>
              {selectedSymptoms.length} symptom{selectedSymptoms.length > 1 ? 's' : ''} selected
            </Text>
          </View>
        </Card>
      )}

      {error ? (
        <Card style={{ marginTop: 14, backgroundColor: colors.warningSoft, borderColor: 'transparent' }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Ionicons name="warning-outline" size={20} color={colors.orange} />
            <Text style={[styles.info, { color: colors.orange }]}>{error}</Text>
          </View>
        </Card>
      ) : null}

      {definitions && (
        <View style={{ marginTop: 20 }}>
          <Card style={{ backgroundColor: colors.surface }}>
            <Text style={[styles.resultTitle, { color: colors.text }]}>WHO ICD-11 Definitions</Text>
            
            {definitions.map((def, i) => (
              <View key={i} style={{ marginTop: 16, paddingTop: i > 0 ? 16 : 0, borderTopWidth: i > 0 ? 1 : 0, borderTopColor: colors.border }}>
                <Text style={[styles.label, { color: colors.mutedText }]}>{def.symptom.toUpperCase()}</Text>
                <Text style={[styles.listItem, { color: colors.text, marginTop: 6 }]}>{def.definition}</Text>
                <Text style={[styles.whoId, { color: colors.mutedText, marginTop: 4 }]}>WHO ID: {def.whoId}</Text>
              </View>
            ))}
          </Card>
        </View>
      )}



      <Text style={[styles.section, { color: colors.mutedText }]}>SELECT SYMPTOMS</Text>

      <SymptomRow 
        label="Fever" 
        iconName="thermometer-outline" 
        iconColor={colors.blue} 
        iconBg={colors.primarySoft}
        isSelected={selectedSymptoms.includes('fever')}
        onPress={() => toggleSymptom('fever')}
      />
      <SymptomRow 
        label="Sneezing" 
        iconName="water-outline" 
        iconColor="#3498DB" 
        iconBg="#E3F2FD"
        isSelected={selectedSymptoms.includes('sneezing')}
        onPress={() => toggleSymptom('sneezing')}
      />
      <SymptomRow 
        label="Headache" 
        iconName="skull-outline" 
        iconColor={colors.purple} 
        iconBg={colors.insightBg}
        isSelected={selectedSymptoms.includes('headache')}
        onPress={() => toggleSymptom('headache')}
      />
      <SymptomRow 
        label="Weakness" 
        iconName="battery-dead-outline" 
        iconColor="#95A5A6" 
        iconBg="#ECEFF1"
        isSelected={selectedSymptoms.includes('weakness')}
        onPress={() => toggleSymptom('weakness')}
      />
      <SymptomRow 
        label="Weight Loss" 
        iconName="trending-down-outline" 
        iconColor="#E74C3C" 
        iconBg="#FFEBEE"
        isSelected={selectedSymptoms.includes('weight loss')}
        onPress={() => toggleSymptom('weight loss')}
      />
      <SymptomRow 
        label="Fatigue" 
        iconName="sad-outline" 
        iconColor="#FFB020" 
        iconBg="#FFF4D6"
        isSelected={selectedSymptoms.includes('fatigue')}
        onPress={() => toggleSymptom('fatigue')}
      />
      <SymptomRow 
        label="Sore Throat" 
        iconName="ice-cream-outline" 
        iconColor="#E91E63" 
        iconBg="#FCE4EC"
        isSelected={selectedSymptoms.includes('sore throat')}
        onPress={() => toggleSymptom('sore throat')}
      />
      <SymptomRow 
        label="Fainting" 
        iconName="eye-off-outline" 
        iconColor="#9C27B0" 
        iconBg="#F3E5F5"
        isSelected={selectedSymptoms.includes('fainting')}
        onPress={() => toggleSymptom('fainting')}
      />
      <SymptomRow 
        label="Itching" 
        iconName="hand-left-outline" 
        iconColor="#FF9800" 
        iconBg="#FFF3E0"
        isSelected={selectedSymptoms.includes('itching')}
        onPress={() => toggleSymptom('itching')}
      />
      <SymptomRow 
        label="Joint Pain" 
        iconName="body-outline" 
        iconColor="#FF4D67" 
        iconBg="#FFE9EA"
        isSelected={selectedSymptoms.includes('joint pain')}
        onPress={() => toggleSymptom('joint pain')}
      />

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
  whoId: { fontSize: 10, lineHeight: 14, fontWeight: '500', fontStyle: 'italic' },
  questionText: { fontSize: 14, lineHeight: 20, fontWeight: '700' },
  answerInput: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '600',
    minHeight: 60,
    textAlignVertical: 'top',
  },
});

