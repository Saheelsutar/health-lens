import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import MapView, { Marker, Circle } from 'react-native-maps';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../context/AuthContext';
import { Card, IconCircle, ProgressBar, SmallButton } from '../components/ui';
import { AIAnalysisModal } from '../components/AIAnalysisModal';
import demoData from '../../demo_data.json';
import { analyzeHealthData } from '../utils/healthAnalytics';

export function CommunityScreen() {
  const { colors } = useTheme();
  const { auth } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  useEffect(() => {
    // Use demo data from JSON file
    const analysis = analyzeHealthData(demoData);
    setAnalytics(analysis);
    setLoading(false);
  }, []);

  const handleStartAnalysis = async () => {
    console.log('🩺 AI Health Analysis button clicked');
    
    if (!auth?.token) {
      console.log('❌ No auth token found');
      Alert.alert('Authentication Required', 'Please log in to use AI analysis');
      return;
    }

    console.log('✅ User authenticated, starting analysis...');
    setShowAnalysisModal(true);
    setAnalysisLoading(true);

    try {
      // Prepare user data
      const userData = {
        name: auth.user?.name || 'User',
        age: auth.user?.age || 'Unknown',
        recentActivity: 'Tracked habits regularly',
        recentGoals: 'Working on nutrition and exercise goals'
      };

      // Prepare community data - summarized insights only
      const communityData = {
        topSymptoms: analytics.topSymptoms.slice(0, 5).map(s => ({
          name: s.symptom.replace('_', ' '),
          percentage: s.percentage
        })),
        trendChange: analytics.trendChange,
        activeAlerts: analytics.alerts.map(a => a.title),
        activeHotspots: analytics.hotspots.length,
        demographicInsights: analytics.demographicInsights
      };

      console.log('📊 Sending data to AI:');
      console.log('User Data:', JSON.stringify(userData, null, 2));
      console.log('Community Data:', JSON.stringify(communityData, null, 2));

      const response = await fetch('https://health-backend-az5j.onrender.com/api/ai/health-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({ userData, communityData })
      });

      console.log('📡 Response status:', response.status, response.statusText);
      
      const data = await response.json();
      console.log('🤖 AI Response:', JSON.stringify(data, null, 2));

      if (data.success) {
        console.log('✅ Analysis successful!');
        setAiAnalysis(data.analysis);
      } else {
        console.log('❌ Analysis failed:', data.error);
        Alert.alert('Analysis Failed', data.error || 'Unable to generate analysis');
      }
    } catch (error) {
      console.error('❌ AI Analysis Error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      Alert.alert('Error', 'Failed to connect to AI service. Check console for details.');
    } finally {
      console.log('🏁 Analysis process completed');
      setAnalysisLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.text }}>Loading community data...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 18, paddingBottom: 28 }}
    >
      {/* Location Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Ionicons name="location-outline" size={14} color={colors.mutedText} />
        <Text style={{ color: colors.mutedText, fontWeight: '700', fontSize: 12 }}>
          Goa, India
        </Text>
      </View>

      {/* DYNAMIC ALERTS - Replace static alert with real data */}
      {analytics.alerts.map((alert) => (
        <Card 
          key={alert.id} 
          style={{ 
            marginTop: 12, 
            backgroundColor: colors.warningSoft, 
            borderColor: 'transparent' 
          }}
        >
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <IconCircle bg={alert.color} size={40}>
              <Ionicons name={alert.icon} size={20} color="#FFFFFF" />
            </IconCircle>
            <View style={{ flex: 1 }}>
              <Text style={[styles.alertTitle, { color: colors.text }]}>
                {alert.title}
              </Text>
              <Text style={[styles.alertText, { color: colors.mutedText }]}>
                {alert.message}
              </Text>
            </View>
          </View>
        </Card>
      ))}

      {/* SYMPTOM TRENDS CHART */}
      <View style={styles.sectionRow}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Local Health Trends
        </Text>
        <Text style={{ color: colors.purple, fontWeight: '800', fontSize: 12 }}>
          Last 30 Days
        </Text>
      </View>

      <Card style={{ marginTop: 12, paddingVertical: 20 }}>
        <LineChart
          data={{
            labels: analytics.symptomTrends.labels || ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
              data: analytics.symptomTrends.data || [20, 45, 28, 80]
            }]
          }}
          width={Dimensions.get('window').width - 72}
          height={110}
          chartConfig={{
            backgroundColor: colors.background,
            backgroundGradientFrom: colors.background,
            backgroundGradientTo: colors.background,
            decimalPlaces: 0,
            color: (opacity = 1) => colors.purple,
            labelColor: (opacity = 1) => colors.mutedText,
            style: { borderRadius: 14 },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: colors.purple
            }
          }}
          bezier
          style={{ borderRadius: 14 }}
        />

        <View style={{ marginTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.purple }} />
            <Text style={{ color: colors.mutedText, fontWeight: '700', fontSize: 12 }}>Current Incidence</Text>
          </View>
          <Text style={{ color: colors.text, fontWeight: '900', fontSize: 12 }}>
            {analytics.trendChange}% vs last week
          </Text>
        </View>
      </Card>

      {/* TOP SYMPTOMS THIS WEEK */}
      <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 18 }]}>
        Most Reported Symptoms
      </Text>
      
      <Card style={{ marginTop: 12 }}>
        {analytics.topSymptoms.slice(0, 5).map((item, idx) => (
          <View key={idx}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 }}>
              <Text style={{ color: colors.text, fontWeight: '700', fontSize: 14 }}>
                {idx + 1}. {item.symptom.replace('_', ' ').toUpperCase()}
              </Text>
              <Text style={{ color: colors.mutedText, fontWeight: '600', fontSize: 12 }}>
                {item.percentage}%
              </Text>
            </View>
            {idx < 4 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
          </View>
        ))}
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

      {/* DEMOGRAPHIC INSIGHTS */}
      <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 18 }]}>
        Health by Age Group
      </Text>

      <Card style={{ marginTop: 12 }}>
        {Object.entries(analytics.demographicInsights).map(([age, data], idx) => (
          <View key={age}>
            <View style={{ paddingVertical: 12 }}>
              <Text style={{ color: colors.text, fontWeight: '900', fontSize: 14 }}>
                {age} years
              </Text>
              <View style={{ marginTop: 8, gap: 6 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: colors.mutedText, fontSize: 12 }}>Avg Sleep</Text>
                  <Text style={{ color: colors.text, fontWeight: '700', fontSize: 12 }}>
                    {data.avgSleep} hrs
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: colors.mutedText, fontSize: 12 }}>Avg Stress</Text>
                  <Text style={{ color: colors.text, fontWeight: '700', fontSize: 12 }}>
                    {data.avgStress}/10
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: colors.mutedText, fontSize: 12 }}>Exercise</Text>
                  <Text style={{ color: colors.text, fontWeight: '700', fontSize: 12 }}>
                    {data.avgExercise} min/day
                  </Text>
                </View>
              </View>
            </View>
            {idx < Object.keys(analytics.demographicInsights).length - 1 && 
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
            }
          </View>
        ))}
      </Card>

      <View style={[styles.aiCard, { backgroundColor: colors.purple, shadowColor: colors.shadow }]}>
        <Text style={styles.aiTitle}>Get AI Data Analysis</Text>
        <Text style={styles.aiSub}>
          Our engine compares your medical reports with community trends for personalized preventive insights.
        </Text>
        <SmallButton
          label="Start New Analysis"
          onPress={handleStartAnalysis}
          style={{ marginTop: 14, backgroundColor: '#FFFFFF', borderColor: 'transparent', paddingVertical: 12 }}
          textStyle={{ color: colors.purple, fontSize: 13, fontWeight: '900' }}
        />
      </View>

      {/* AI Analysis Modal */}
      <AIAnalysisModal
        visible={showAnalysisModal}
        onClose={() => setShowAnalysisModal(false)}
        analysis={aiAnalysis}
        loading={analysisLoading}
      />

      {/* HEALTH DENSITY MAP - Replace static with dynamic hotspots */}
      <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 18 }]}>
        Health Density Map
      </Text>
      
      <Card style={{ marginTop: 12, padding: 0, overflow: 'hidden' }}>
        <MapView
          style={{ height: 210, width: '100%' }}
          initialRegion={{
            latitude: 15.4,
            longitude: 73.85,
            latitudeDelta: 0.45,
            longitudeDelta: 0.45,
          }}
          scrollEnabled={true}
          zoomEnabled={true}
          rotateEnabled={true}
        >
          {/* Plot health density hotspots */}
          {analytics.hotspots.map((spot, idx) => (
            <React.Fragment key={idx}>
              {/* Circle to show density area */}
              <Circle
                center={{
                  latitude: spot.coordinates.lat,
                  longitude: spot.coordinates.long,
                }}
                radius={spot.severity === 'high' ? 30 : 20}
                fillColor={spot.severity === 'high' ? 'rgba(255, 77, 103, 0.4)' : 'rgba(255, 147, 77, 0.4)'}
                strokeColor={spot.severity === 'high' ? '#FF4D67' : '#FF934D'}
                strokeWidth={1}
              />
              {/* Marker at center */}
              <Marker
                coordinate={{
                  latitude: spot.coordinates.lat,
                  longitude: spot.coordinates.long,
                }}
              >
                <View style={{
                  width: spot.severity === 'high' ? 12 : 8,
                  height: spot.severity === 'high' ? 12 : 8,
                  borderRadius: 999,
                  backgroundColor: spot.severity === 'high' ? '#FF4D67' : '#FF934D',
                  borderWidth: 2,
                  borderColor: '#FFFFFF'
                }} />
              </Marker>
            </React.Fragment>
          ))}
        </MapView>
        
        <View style={{
          position: 'absolute',
          left: 18,
          bottom: 16,
          backgroundColor: 'rgba(0,0,0,0.7)',
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 999
        }}>
          <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 11 }}>
            {analytics.hotspots.length} Active Hotspots
          </Text>
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

