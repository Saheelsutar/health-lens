import React from 'react';
import { Modal, ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { Card } from './ui';

export function AIAnalysisModal({ visible, onClose, analysis, loading }) {
  const { colors } = useTheme();

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View style={{
          paddingTop: 50,
          paddingHorizontal: 18,
          paddingBottom: 16,
          backgroundColor: colors.purple,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '900' }}>
              AI Health Analysis
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4 }}>
              Personalized insights based on community trends
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.purple} />
            <Text style={{ color: colors.mutedText, marginTop: 16, fontSize: 14 }}>
              Analyzing your health data...
            </Text>
          </View>
        ) : analysis ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 18, paddingBottom: 40 }}
          >
            {/* Risk Assessment */}
            <Card style={{ 
              backgroundColor: analysis.riskAssessment.level === 'High' ? '#FFF3F0' : 
                              analysis.riskAssessment.level === 'Moderate' ? '#FFF8E6' : '#F0FFF4',
              borderColor: 'transparent'
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: analysis.riskAssessment.level === 'High' ? '#FF4D67' :
                                  analysis.riskAssessment.level === 'Moderate' ? '#FF934D' : '#00D68F',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Ionicons 
                    name={analysis.riskAssessment.level === 'High' ? 'alert-circle' : 
                          analysis.riskAssessment.level === 'Moderate' ? 'warning' : 'checkmark-circle'}
                    size={24}
                    color="#FFFFFF"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '900', color: colors.text }}>
                    {analysis.riskAssessment.level} Risk Level
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.mutedText, marginTop: 4 }}>
                    Based on current health patterns
                  </Text>
                </View>
              </View>
              {analysis.riskAssessment.factors.length > 0 && (
                <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: colors.mutedText, marginBottom: 6 }}>
                    Key Factors:
                  </Text>
                  {analysis.riskAssessment.factors.map((factor, idx) => (
                    <Text key={idx} style={{ fontSize: 12, color: colors.text, marginTop: 4 }}>
                      • {factor}
                    </Text>
                  ))}
                </View>
              )}
            </Card>

            {/* Precautionary Steps */}
            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>
              Recommended Actions
            </Text>
            {analysis.precautionarySteps.map((step, idx) => (
              <Card key={idx} style={{ marginTop: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: step.priority === 'High' ? '#FFE6EA' :
                                    step.priority === 'Medium' ? '#FFF3E6' : '#E6F4FF',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Text style={{ 
                      fontSize: 14, 
                      fontWeight: '900',
                      color: step.priority === 'High' ? '#FF4D67' :
                             step.priority === 'Medium' ? '#FF934D' : '#4D9FFF'
                    }}>
                      {idx + 1}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={{ fontSize: 13, fontWeight: '900', color: colors.text }}>
                        {step.category}
                      </Text>
                      <View style={{
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 4,
                        backgroundColor: step.priority === 'High' ? '#FFE6EA' :
                                        step.priority === 'Medium' ? '#FFF3E6' : '#E6F4FF'
                      }}>
                        <Text style={{
                          fontSize: 9,
                          fontWeight: '900',
                          color: step.priority === 'High' ? '#FF4D67' :
                                 step.priority === 'Medium' ? '#FF934D' : '#4D9FFF'
                        }}>
                          {step.priority}
                        </Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: 13, color: colors.text, marginTop: 6, fontWeight: '600' }}>
                      {step.action}
                    </Text>
                    <Text style={{ fontSize: 11, color: colors.mutedText, marginTop: 6, lineHeight: 16 }}>
                      {step.reason}
                    </Text>
                  </View>
                </View>
              </Card>
            ))}

            {/* Local Health Context */}
            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>
              Local Health Context
            </Text>
            <Card style={{ marginTop: 12 }}>
              <Text style={{ fontSize: 13, fontWeight: '900', color: colors.text, marginBottom: 8 }}>
                Relevant Trends
              </Text>
              {analysis.localHealthContext.relevantTrends.map((trend, idx) => (
                <Text key={idx} style={{ fontSize: 12, color: colors.text, marginTop: 4, lineHeight: 18 }}>
                  • {trend}
                </Text>
              ))}
              
              {analysis.localHealthContext.exposureRisks.length > 0 && (
                <>
                  <Text style={{ fontSize: 13, fontWeight: '900', color: colors.text, marginTop: 16, marginBottom: 8 }}>
                    Exposure Risks
                  </Text>
                  {analysis.localHealthContext.exposureRisks.map((risk, idx) => (
                    <Text key={idx} style={{ fontSize: 12, color: colors.text, marginTop: 4, lineHeight: 18 }}>
                      • {risk}
                    </Text>
                  ))}
                </>
              )}
            </Card>

            {/* Lifestyle Recommendations */}
            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>
              Lifestyle Improvements
            </Text>
            {analysis.lifestyleRecommendations.map((rec, idx) => (
              <Card key={idx} style={{ marginTop: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Ionicons 
                    name={rec.area === 'Sleep' ? 'moon' : 
                          rec.area === 'Diet' ? 'nutrition' :
                          rec.area === 'Exercise' ? 'fitness' : 'heart'}
                    size={20}
                    color={colors.purple}
                  />
                  <Text style={{ fontSize: 13, fontWeight: '900', color: colors.text }}>
                    {rec.area}
                  </Text>
                </View>
                <Text style={{ fontSize: 12, color: colors.text, marginTop: 8, fontWeight: '600' }}>
                  {rec.suggestion}
                </Text>
                <Text style={{ fontSize: 11, color: colors.mutedText, marginTop: 6, lineHeight: 16 }}>
                  Benefit: {rec.benefit}
                </Text>
              </Card>
            ))}

            {/* When to Seek Help */}
            <Card style={{ marginTop: 20, backgroundColor: '#FFF3F0', borderColor: 'transparent' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name="medical" size={20} color="#FF4D67" />
                <Text style={{ fontSize: 14, fontWeight: '900', color: colors.text }}>
                  When to Seek Medical Help
                </Text>
              </View>
              <View style={{ marginTop: 10 }}>
                {analysis.whenToSeekHelp.map((item, idx) => (
                  <Text key={idx} style={{ fontSize: 12, color: colors.text, marginTop: 4, lineHeight: 18 }}>
                    • {item}
                  </Text>
                ))}
              </View>
            </Card>

            {/* Disclaimer */}
            <View style={{ 
              marginTop: 20, 
              padding: 14, 
              backgroundColor: colors.border, 
              borderRadius: 12 
            }}>
              <Text style={{ fontSize: 11, color: colors.mutedText, lineHeight: 16, textAlign: 'center' }}>
                {analysis.disclaimer}
              </Text>
            </View>
          </ScrollView>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Ionicons name="alert-circle-outline" size={48} color={colors.mutedText} />
            <Text style={{ color: colors.text, marginTop: 16, fontSize: 14, textAlign: 'center' }}>
              Unable to generate analysis
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 16, fontWeight: '900' }
});
