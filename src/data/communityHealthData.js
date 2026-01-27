// Generate 500-1000 fake users with realistic Verna-specific data
export const generateCommunityData = () => {
  const vernaAreas = [
    { name: "Verna Industrial Estate", lat: 15.354, long: 73.934, weight: 30 },
    { name: "Verna Village", lat: 15.356, long: 73.937, weight: 25 },
    { name: "Verna Housing Colony", lat: 15.351, long: 73.931, weight: 20 },
    { name: "Verna Market Area", lat: 15.358, long: 73.935, weight: 15 },
    { name: "Verna Outskirts", lat: 15.350, long: 73.940, weight: 10 }
  ];

  const data = [];
  const today = new Date();
  
  // Generate data for last 30 days
  for (let day = 0; day < 30; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() - day);
    
    // 20-30 entries per day
    const dailyEntries = Math.floor(Math.random() * 11) + 20;
    
    for (let i = 0; i < dailyEntries; i++) {
      data.push(generateUser(date, vernaAreas));
    }
  }
  
  return data;
};

function generateUser(date, regions) {
  const region = pickWeightedRegion(regions);
  const ageRange = ["18-25", "25-35", "35-45", "45-55", "55-65"][Math.floor(Math.random() * 5)];
  const gender = ["M", "F", "Other"][Math.floor(Math.random() * 3)];
  
  // Seasonal factor (monsoon diseases in Goa)
  const isMonsooon = [6, 7, 8, 9].includes(date.getMonth());
  const diseaseMultiplier = isMonsooon ? 2.0 : 1.2;
  
  const symptoms = generateSymptoms(diseaseMultiplier);
  const lifestyle = generateLifestyle(ageRange, region.name);
  
  return {
    user_id: `anon_user_${Math.random().toString(36).substr(2, 9)}`,
    region: region.name,
    state: "Goa",
    lat: region.lat + (Math.random() * 0.02 - 0.01), // Small variance
    long: region.long + (Math.random() * 0.02 - 0.01),
    age_range: ageRange,
    gender: gender,
    timestamp: date.toISOString(),
    symptoms: symptoms,
    lifestyle: lifestyle,
    health_score: calculateHealthScore(lifestyle, symptoms),
    risk_level: calculateRiskLevel(lifestyle, symptoms)
  };
}

function generateSymptoms(multiplier) {
  const possibleSymptoms = [
    { type: "fever", baseChance: 0.08 * multiplier },
    { type: "cough", baseChance: 0.12 * multiplier },
    { type: "headache", baseChance: 0.15 },
    { type: "fatigue", baseChance: 0.20 },
    { type: "body_aches", baseChance: 0.10 },
    { type: "sore_throat", baseChance: 0.10 * multiplier },
    { type: "runny_nose", baseChance: 0.08 },
    { type: "nausea", baseChance: 0.06 },
    { type: "diarrhea", baseChance: 0.05 * multiplier }, // Common in monsoon
    { type: "skin_rash", baseChance: 0.04 }
  ];
  
  const symptoms = [];
  for (let symptom of possibleSymptoms) {
    if (Math.random() < symptom.baseChance) {
      symptoms.push({
        type: symptom.type,
        severity: Math.floor(Math.random() * 6) + 3,
        duration_days: Math.floor(Math.random() * 7) + 1
      });
    }
  }
  return symptoms;
}

function generateLifestyle(ageRange, region) {
  const profiles = {
    "18-25": { baseSleep: 6.5, baseExercise: 35, baseStress: 6 },
    "25-35": { baseSleep: 6.0, baseExercise: 25, baseStress: 7 },
    "35-45": { baseSleep: 6.5, baseExercise: 20, baseStress: 6 },
    "45-55": { baseSleep: 7.0, baseExercise: 25, baseStress: 5 },
    "55-65": { baseSleep: 7.0, baseExercise: 30, baseStress: 4 }
  };
  
  const profile = profiles[ageRange];
  const urbanBonus = ["Verna Industrial Estate", "Verna Market Area"].includes(region) ? 1 : 0;
  
  return {
    sleep_hours: Math.max(4, Math.min(10, profile.baseSleep + (Math.random() * 2 - 1))),
    exercise_minutes: Math.max(0, profile.baseExercise + (Math.random() * 30 - 15)),
    stress_level: Math.min(10, profile.baseStress + urbanBonus + (Math.random() * 2 - 1)),
    diet_quality: ["poor", "moderate", "healthy"][Math.floor(Math.random() * 3)],
    hydration_glasses: Math.floor(Math.random() * 6) + 4
  };
}

function calculateHealthScore(lifestyle, symptoms) {
  let score = 7.0;
  
  // Deduct for poor lifestyle
  if (lifestyle.sleep_hours < 6) score -= 1.0;
  if (lifestyle.exercise_minutes < 20) score -= 0.5;
  if (lifestyle.stress_level > 7) score -= 0.8;
  if (lifestyle.diet_quality === "poor") score -= 0.7;
  
  // Deduct for symptoms
  score -= symptoms.length * 0.3;
  symptoms.forEach(s => {
    if (s.severity > 7) score -= 0.5;
  });
  
  return Math.max(1, Math.min(10, score)).toFixed(1);
}

function calculateRiskLevel(lifestyle, symptoms) {
  const score = parseFloat(calculateHealthScore(lifestyle, symptoms));
  if (score >= 7) return "low";
  if (score >= 5) return "moderate";
  return "high";
}

function pickWeightedRegion(regions) {
  const total = regions.reduce((sum, r) => sum + r.weight, 0);
  let random = Math.random() * total;
  
  for (let region of regions) {
    random -= region.weight;
    if (random <= 0) return region;
  }
  return regions[0];
}