import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { Card } from '../components/ui';

export function FollowUpQuestionsScreen({ route, navigation }) {
  const { colors } = useTheme();
  const { followUpQuestions, definitions, selectedSymptoms } = route.params;
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    // Validate that all questions are answered
    const unansweredQuestions = followUpQuestions.filter((_, i) => !answers[i] || answers[i].trim() === '');
    
    if (unansweredQuestions.length > 0) {
      setError('Please answer all questions before submitting');
      return;
    }

    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      // Format answers as question-answer pairs
      const formattedAnswers = followUpQuestions.map((question, i) => ({
        question: question,
        answer: answers[i]
      }));

      const requestBody = {
        symptoms: selectedSymptoms,
        answers: formattedAnswers
      };

      console.log('Submitting to predictDisease API:', requestBody);

      const response = await fetch('https://health-backend-az5j.onrender.com/api/whoSymptoms/predictDisease', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to predict disease');
      }

      setPrediction(data.result);
      console.log('Disease prediction result:', data.result);
    } catch (err) {
      console.error('Error predicting disease:', err);
      setError(err.message || 'Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 18, paddingBottom: 28 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, { color: colors.text }]}>Follow-up Questions</Text>
      <Text style={[styles.sub, { color: colors.mutedText }]}>
        Please answer the following questions to help us better understand your condition.
      </Text>

      {/* Display selected symptoms */}
      <Card style={{ marginTop: 14, backgroundColor: colors.primarySoft, borderColor: 'transparent' }}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <Ionicons name="medical-outline" size={20} color={colors.primary} />
          <Text style={[styles.info, { color: colors.primary, flex: 1 }]}>
            Selected: {selectedSymptoms.join(', ')}
          </Text>
        </View>
      </Card>

      {/* WHO Definitions */}
      <View style={{ marginTop: 20 }}>
        <Card style={{ backgroundColor: colors.surface }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>WHO ICD-11 Definitions</Text>
          
          {definitions.map((def, i) => (
            <View key={i} style={{ marginTop: 16, paddingTop: i > 0 ? 16 : 0, borderTopWidth: i > 0 ? 1 : 0, borderTopColor: colors.border }}>
              <Text style={[styles.label, { color: colors.mutedText }]}>{def.symptom.toUpperCase()}</Text>
              <Text style={[styles.listItem, { color: colors.text, marginTop: 6 }]}>{def.definition}</Text>
              <Text style={[styles.whoId, { color: colors.mutedText, marginTop: 4 }]}>WHO ID: {def.whoId}</Text>
            </View>
          ))}
        </Card>
      </View>

      {/* Follow-up Questions */}
      <View style={{ marginTop: 20 }}>
        <Card style={{ backgroundColor: colors.surface }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Questions</Text>
          
          {followUpQuestions.map((question, i) => (
            <View key={i} style={{ marginTop: 16 }}>
              <Text style={[styles.questionText, { color: colors.text }]}>
                {i + 1}. {question}
              </Text>
              <TextInput
                style={[
                  styles.answerInput,
                  { 
                    backgroundColor: colors.background, 
                    borderColor: colors.border, 
                    color: colors.text 
                  }
                ]}
                placeholder="Type your answer here..."
                placeholderTextColor={colors.mutedText}
                value={answers[i] || ''}
                onChangeText={(text) => setAnswers({ ...answers, [i]: text })}
                multiline
                numberOfLines={3}
              />
            </View>
          ))}

          <Card style={{ marginTop: 16, backgroundColor: colors.infoSoft, borderColor: 'transparent' }}>
            <Text style={[styles.disclaimer, { color: colors.primary }]}>This is not a medical diagnosis.</Text>
          </Card>
        </Card>
      </View>

      <Card style={{ marginTop: 14, backgroundColor: colors.infoSoft, borderColor: 'transparent' }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
          <Text style={[styles.info, { color: colors.primary }]}>
            For emergency situations, please contact your local medical services immediately.
          </Text>
        </View>
      </Card>

      {error && (
        <Card style={{ marginTop: 14, backgroundColor: colors.warningSoft, borderColor: 'transparent' }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Ionicons name="warning-outline" size={20} color={colors.orange} />
            <Text style={[styles.info, { color: colors.orange }]}>{error}</Text>
          </View>
        </Card>
      )}

      {/* Display prediction results */}
      {prediction && (
        <View style={{ marginTop: 20 }}>
          <Card style={{ backgroundColor: colors.surface }}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Disease Prediction Results</Text>
            
            {/* Possible Conditions */}
            <View style={{ marginTop: 16 }}>
              <Text style={[styles.label, { color: colors.mutedText }]}>POSSIBLE CONDITIONS</Text>
              {prediction.possibleConditions.map((condition, i) => (
                <Card key={i} style={{ 
                  marginTop: 10, 
                  backgroundColor: condition.likelihood === 'high' ? colors.warningSoft : colors.primarySoft,
                  borderColor: 'transparent' 
                }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <Text style={[styles.conditionName, { color: colors.text, flex: 1 }]}>
                      {condition.name}
                    </Text>
                    <View style={{ 
                      backgroundColor: condition.likelihood === 'high' ? colors.orange : colors.primary,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 12
                    }}>
                      <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' }}>
                        {condition.likelihood}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.reasoning, { color: colors.mutedText }]}>
                    {condition.reasoning}
                  </Text>
                </Card>
              ))}
            </View>

            {/* Red Flags */}
            <View style={{ marginTop: 16 }}>
              <Text style={[styles.label, { color: colors.mutedText }]}>⚠️ WARNING SIGNS - SEEK IMMEDIATE CARE IF:</Text>
              <Card style={{ marginTop: 10, backgroundColor: colors.warningSoft, borderColor: 'transparent' }}>
                {prediction.redFlags.map((flag, i) => (
                  <View key={i} style={{ flexDirection: 'row', gap: 8, marginTop: i > 0 ? 10 : 0 }}>
                    <Ionicons name="alert-circle" size={16} color={colors.orange} style={{ marginTop: 2 }} />
                    <Text style={[styles.listItem, { color: colors.text, flex: 1 }]}>{flag}</Text>
                  </View>
                ))}
              </Card>
            </View>

            {/* Advice */}
            <View style={{ marginTop: 16 }}>
              <Text style={[styles.label, { color: colors.mutedText }]}>RECOMMENDED ACTION</Text>
              <Card style={{ marginTop: 10, backgroundColor: colors.infoSoft, borderColor: 'transparent' }}>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <Ionicons name="medical-outline" size={20} color={colors.primary} />
                  <Text style={[styles.listItem, { color: colors.primary, flex: 1 }]}>{prediction.advice}</Text>
                </View>
              </Card>
            </View>

            <Card style={{ marginTop: 16, backgroundColor: colors.background, borderColor: colors.border }}>
              <Text style={[styles.disclaimer, { color: colors.mutedText }]}>
                {prediction.disclaimer || "This information is not a medical diagnosis and should not replace professional medical advice."}
              </Text>
            </Card>
          </Card>
        </View>
      )}

      <Pressable 
        style={[styles.cta, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]} 
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.ctaText}>{prediction ? 'Done' : 'Submit Answers  →'}</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '900', marginTop: 6 },
  sub: { marginTop: 8, fontSize: 13, lineHeight: 18, fontWeight: '600' },
  sectionTitle: { fontSize: 20, fontWeight: '800' },
  label: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  listItem: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
  info: { fontSize: 12, lineHeight: 17, fontWeight: '700' },
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
  disclaimer: { fontSize: 11, lineHeight: 16, fontWeight: '600' },
  conditionName: { fontSize: 15, fontWeight: '800', lineHeight: 20 },
  reasoning: { fontSize: 13, lineHeight: 18, fontWeight: '600', marginTop: 6 },
  cta: {
    marginTop: 16,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaText: { color: '#FFFFFF', fontWeight: '900' },
});
