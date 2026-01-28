export const analyzeHealthData = (data) => {
  return {
    alerts: generateAlerts(data),
    regionalTrends: getRegionalTrends(data),
    symptomTrends: getSymptomTrendsOverTime(data),
    topSymptoms: getTopSymptoms(data),
    demographicInsights: getDemographicInsights(data),
    hotspots: detectHotspots(data)
  };
};

function generateAlerts(data) {
  const alerts = [];
  const recentData = data.filter(d => {
    const daysSince = (new Date() - new Date(d.timestamp)) / (1000 * 60 * 60 * 24);
    return daysSince <= 7;
  });
  
  // Alert 1: Flu-like symptoms spike
  const fluSymptoms = recentData.filter(d => 
    d.symptoms.some(s => s.type === 'fever' || s.type === 'cough')
  );
  const fluPercentage = (fluSymptoms.length / recentData.length * 100).toFixed(1);
  
  if (fluPercentage > 15) {
    alerts.push({
      id: 'flu_alert',
      type: 'outbreak',
      severity: fluPercentage > 25 ? 'high' : 'moderate',
      title: 'Flu Season Alert',
      message: `Cases of flu-like symptoms have increased by ${fluPercentage}% in Goa this week. Consider preventive measures.`,
      icon: 'notifications-outline',
      color: '#FF6B35'
    });
  }
  
  // Alert 2: Stress epidemic
  const highStress = recentData.filter(d => d.lifestyle.stress_level > 7);
  const stressPercentage = (highStress.length / recentData.length * 100).toFixed(1);
  
  if (stressPercentage > 20) {
    alerts.push({
      id: 'stress_alert',
      type: 'lifestyle',
      severity: 'moderate',
      title: 'High Stress Levels Detected',
      message: `${stressPercentage}% of users report elevated stress. Mental health resources available.`,
      icon: 'heart-outline',
      color: '#9B59B6'
    });
  }
  
  // Alert 3: Monsoon diseases
  const waterborne = recentData.filter(d =>
    d.symptoms.some(s => s.type === 'diarrhea' || s.type === 'nausea')
  );
  
  if (waterborne.length > recentData.length * 0.1) {
    alerts.push({
      id: 'waterborne_alert',
      type: 'seasonal',
      severity: 'moderate',
      title: 'Waterborne Disease Alert',
      message: 'Increase in digestive issues. Ensure water purification and food hygiene.',
      icon: 'water-outline',
      color: '#3498DB'
    });
  }
  
  return alerts;
}

function getRegionalTrends(data) {
  const regions = {};
  
  data.forEach(entry => {
    if (!regions[entry.region]) {
      regions[entry.region] = {
        total: 0,
        symptoms: {},
        avgHealthScore: 0,
        coordinates: { lat: entry.lat, long: entry.long }
      };
    }
    
    regions[entry.region].total++;
    regions[entry.region].avgHealthScore += parseFloat(entry.health_score);
    
    entry.symptoms.forEach(s => {
      regions[entry.region].symptoms[s.type] = 
        (regions[entry.region].symptoms[s.type] || 0) + 1;
    });
  });
  
  // Calculate averages
  Object.keys(regions).forEach(region => {
    regions[region].avgHealthScore = 
      (regions[region].avgHealthScore / regions[region].total).toFixed(1);
  });
  
  return regions;
}

function getSymptomTrendsOverTime(data) {
  const last30Days = data.filter(d => {
    const daysSince = (new Date() - new Date(d.timestamp)) / (1000 * 60 * 60 * 24);
    return daysSince <= 30;
  });
  
  const timeline = {};
  
  last30Days.forEach(entry => {
    const date = entry.timestamp.split('T')[0];
    
    if (!timeline[date]) {
      timeline[date] = { fever: 0, cough: 0, headache: 0, total: 0 };
    }
    
    timeline[date].total++;
    entry.symptoms.forEach(s => {
      if (['fever', 'cough', 'headache'].includes(s.type)) {
        timeline[date][s.type]++;
      }
    });
  });
  
  return Object.keys(timeline).sort().map(date => ({
    date,
    fever: timeline[date].fever,
    cough: timeline[date].cough,
    headache: timeline[date].headache
  }));
}

function getTopSymptoms(data) {
  const symptomCounts = {};
  let totalUsers = data.length;
  
  data.forEach(entry => {
    entry.symptoms.forEach(s => {
      symptomCounts[s.type] = (symptomCounts[s.type] || 0) + 1;
    });
  });
  
  return Object.entries(symptomCounts)
    .map(([symptom, count]) => ({
      symptom,
      count,
      percentage: ((count / totalUsers) * 100).toFixed(1)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function getDemographicInsights(data) {
  const ageGroups = {};
  
  data.forEach(entry => {
    if (!ageGroups[entry.age_range]) {
      ageGroups[entry.age_range] = {
        count: 0,
        avgStress: 0,
        avgSleep: 0,
        avgExercise: 0
      };
    }
    
    const group = ageGroups[entry.age_range];
    group.count++;
    group.avgStress += entry.lifestyle.stress_level;
    group.avgSleep += entry.lifestyle.sleep_hours;
    group.avgExercise += entry.lifestyle.exercise_minutes;
  });
  
  Object.keys(ageGroups).forEach(age => {
    const g = ageGroups[age];
    g.avgStress = (g.avgStress / g.count).toFixed(1);
    g.avgSleep = (g.avgSleep / g.count).toFixed(1);
    g.avgExercise = Math.round(g.avgExercise / g.count);
  });
  
  return ageGroups;
}

function detectHotspots(data) {
  // Group by actual coordinates (rounded to 3 decimals to cluster nearby points)
  const locationClusters = {};
  
  data.forEach(entry => {
    const latKey = entry.lat.toFixed(3);
    const longKey = entry.long.toFixed(3);
    const key = `${latKey},${longKey}`;
    
    if (!locationClusters[key]) {
      locationClusters[key] = {
        region: entry.region,
        coordinates: { lat: entry.lat, long: entry.long },
        total: 0,
        symptoms: {},
        highRisk: 0
      };
    }
    
    locationClusters[key].total++;
    
    // Count high-risk users
    if (entry.risk_level === 'high') {
      locationClusters[key].highRisk++;
    }
    
    // Count symptoms
    entry.symptoms.forEach(s => {
      locationClusters[key].symptoms[s.type] = 
        (locationClusters[key].symptoms[s.type] || 0) + 1;
    });
  });
  
  // Convert to hotspots array
  const hotspots = Object.values(locationClusters).map(cluster => {
    const totalSymptoms = Object.values(cluster.symptoms).reduce((sum, count) => sum + count, 0);
    const avgSymptomsPerUser = totalSymptoms / cluster.total;
    const highRiskPercentage = (cluster.highRisk / cluster.total) * 100;
    
    // Determine severity based on symptoms and risk
    let severity = 'low';
    if (avgSymptomsPerUser > 2 || highRiskPercentage > 30) {
      severity = 'high';
    } else if (avgSymptomsPerUser > 1 || highRiskPercentage > 15) {
      severity = 'moderate';
    }
    
    return {
      region: cluster.region,
      coordinates: cluster.coordinates,
      severity,
      totalCases: cluster.total,
      highRiskPercentage: highRiskPercentage.toFixed(1),
      topSymptom: Object.keys(cluster.symptoms).sort((a, b) => 
        cluster.symptoms[b] - cluster.symptoms[a]
      )[0]
    };
  });
  
  // Filter out low-density areas and sort by severity
  return hotspots
    .filter(h => h.totalCases >= 5)
    .sort((a, b) => {
      if (a.severity === 'high' && b.severity !== 'high') return -1;
      if (a.severity !== 'high' && b.severity === 'high') return 1;
      return b.totalCases - a.totalCases;
    });
}