import React, { useState, useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { Card, IconCircle, ProgressBar } from '../components/ui';
import { useAuth } from '../context/AuthContext';

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

const DAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function buildLast30Days() {
  const today = new Date();
  const timeline = [];
  const todayKey = today.toISOString().slice(0, 10);

  for (let offset = 29; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    const key = date.toISOString().slice(0, 10);
    timeline.push({
      key,
      day: DAY_LABELS[date.getDay()],
      date: date.getDate(),
      dateObj: new Date(date),
      isToday: key === todayKey,
    });
  }

  return timeline;
}

function GoalCard({ title, target, currentLabel, progress, accent, iconName, iconBg, onAddPress, isTimer, timerActive }) {
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

        <Pressable onPress={onAddPress} style={[styles.plusPill, { backgroundColor: colors.background, borderColor: colors.border }]}>
          {isTimer && timerActive ? (
            <Ionicons name="pause" size={18} color={colors.text} />
          ) : (
            <Ionicons name={isTimer ? 'play' : 'add'} size={18} color={colors.text} />
          )}
        </Pressable>
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
  const [activityTimer, setActivityTimer] = useState(0);
  const [activityActive, setActivityActive] = useState(false);
  const [sleepTimer, setSleepTimer] = useState(0);
  const [sleepActive, setSleepActive] = useState(false);
  const [showClock, setShowClock] = useState(false);
  const [savingLog, setSavingLog] = useState(false);
  const [logs, setLogs] = useState([]);
  const dayTimeline = useMemo(() => buildLast30Days(), []);
  const [selectedDate, setSelectedDate] = useState(() => dayTimeline[dayTimeline.length - 1].key);
  const [currentCalories, setCurrentCalories] = useState('');
  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [foodName, setFoodName] = useState('');
  const [foodWeight, setFoodWeight] = useState('');
  const [loadingCalories, setLoadingCalories] = useState(false);
  const { auth } = useAuth();

  // Activity timer effect
  useEffect(() => {
    let interval;
    if (activityActive) {
      interval = setInterval(() => {
        setActivityTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activityActive]);

  // Sleep timer effect
  useEffect(() => {
    let interval;
    if (sleepActive) {
      interval = setInterval(() => {
        setSleepTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sleepActive]);

  const formatClock = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleActivityToggle = () => {
    setActivityActive((prev) => {
      const next = !prev;
      setShowClock(next);
      return next;
    });
  };

  const handleSleepToggle = () => {
    setSleepActive(!sleepActive);
  };
  const handleNutritionAdd = () => {
    setShowNutritionModal(true);
    setFoodName('');
    setFoodWeight('');
  };
 const handleAddFood = async () => {
    if (!foodName.trim()) {
      Alert.alert('Missing Information', 'Please enter the food name.');
      return;
    }
    if (!foodWeight.trim() || isNaN(parseFloat(foodWeight))) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight in grams.');
      return;
    }

    setLoadingCalories(true);
    try {
      const response = await fetch('https://health-backend-az5j.onrender.com/api/getCalories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ food: foodName.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch calorie information');
      }

      // Calculate calories consumed based on weight
      const caloriesPer100g = data.calories_per_100g;
      const weight = parseFloat(foodWeight);
      const caloriesConsumed = Math.round((caloriesPer100g * weight) / 100);

      // Update current calories
      setCurrentCalories(prev => prev + caloriesConsumed);

      Alert.alert(
        'Food Added!',
        `${foodName}: ${caloriesConsumed} kcal added\n(${caloriesPer100g} kcal per 100g × ${weight}g)`
      );

      setShowNutritionModal(false);
      setFoodName('');
      setFoodWeight('');
    } catch (err) {
      console.error('Error:', err);
      Alert.alert('Error', err.message || 'Failed to get calorie information. Please try again.');
    } finally {
      setLoadingCalories(false);
    }
  };


  const activityRecordedMinutes = Math.round(activityTimer / 60);
  const sleepRecordedMinutes = Math.round(sleepTimer / 60);
  const ACTIVITY_TARGET_MINUTES = 45;
  const SLEEP_TARGET_MINUTES = 8 * 60;
  const LOG_ENDPOINT = 'https://health-backend-az5j.onrender.com/api/goals/log';
  const todayKey = dayTimeline[dayTimeline.length - 1].key;
  const selectedLog = logs.find((entry) => entry.date === selectedDate);
  const todayLog = logs.find((entry) => entry.date === todayKey);
  const todayActivityMinutes = todayLog?.activityMinutes ?? 0;
  const todaySleepMinutes = todayLog?.sleepMinutes ?? 0;
  const activityForPost = Math.max(activityRecordedMinutes, todayActivityMinutes);
  const sleepForPost = Math.max(sleepRecordedMinutes, todaySleepMinutes);
  const isTodaySelected = selectedDate === todayKey;
  const activityMinutes = selectedDate === todayKey
    ? activityForPost
    : selectedLog?.activityMinutes ?? 0;
  const sleepMinutes = selectedDate === todayKey
    ? sleepForPost
    : selectedLog?.sleepMinutes ?? 0;
  const todayNutritionCalories = Math.max(currentCalories, todayLog?.nutritionCalories ?? 0);
  const nutritionCalories = selectedDate === todayKey
    ? todayNutritionCalories
    : selectedLog?.nutritionCalories ?? 0;
  const activityProgress = activityMinutes > 0 ? Math.min(1, activityMinutes / ACTIVITY_TARGET_MINUTES) : 0;
  const sleepProgress = sleepMinutes > 0 ? Math.min(1, sleepMinutes / SLEEP_TARGET_MINUTES) : 0;
  const activityDisplay = activityMinutes > 0 ? `${activityMinutes} min` : 'No data logged';
  const sleepDisplay = sleepMinutes > 0 ? formatClock(sleepMinutes * 60) : 'No data logged';
  const nutritionDisplay = nutritionCalories > 0 ? `Current: ${nutritionCalories} kcal` : 'No data logged';
  const nutritionProgress = nutritionCalories > 0 ? Math.min(1, nutritionCalories / 2100) : 0;
  const saveButtonLabel = isTodaySelected ? "Save today's progress" : 'Select today to save';

  const token = auth?.token;

  useEffect(() => {
    if (!token) {
      setLogs([]);
      return undefined;
    }

    let isMounted = true;
    const fetchLogs = async () => {
      try {
        const response = await fetch(LOG_ENDPOINT, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Unable to load progress');
        }
        const data = await response.json();
        if (!isMounted) return;
        setLogs(data);
        const todayEntry = data.find((entry) => entry.date === todayKey);
        if (todayEntry) {
          setCurrentCalories(todayEntry.nutritionCalories ?? 1450);
        }
      } catch (err) {
        console.warn('Unable to load daily log', err);
      }
    };

    fetchLogs();
    return () => {
      isMounted = false;
    };
  }, [token]);

  useEffect(() => {
    if (!isTodaySelected || activityActive) return;
    const requiredSeconds = todayActivityMinutes * 60;
    setActivityTimer((prev) => (prev < requiredSeconds ? requiredSeconds : prev));
  }, [isTodaySelected, activityActive, todayActivityMinutes]);

  useEffect(() => {
    if (!isTodaySelected || sleepActive) return;
    const requiredSeconds = todaySleepMinutes * 60;
    setSleepTimer((prev) => (prev < requiredSeconds ? requiredSeconds : prev));
  }, [isTodaySelected, sleepActive, todaySleepMinutes]);

  const handleLogToday = async () => {
    if (!auth?.token) {
      Alert.alert('Sign in required', 'Log in to save your daily goals.');
      return;
    }

    if (!isTodaySelected) {
      Alert.alert('Save unavailable', 'You can only save progress for today.');
      return;
    }

    setSavingLog(true);
    try {
      const response = await fetch(LOG_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          nutritionCalories: currentCalories,
          activityMinutes: activityForPost,
          sleepMinutes: sleepForPost,
          date: new Date().toISOString(),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Unable to log today');
      }
      Alert.alert('Success', 'Your daily goals were stored.');
      const todayKeyUpdate = todayKey;
      setLogs((prev) => {
        const filtered = prev.filter((log) => log.date !== todayKeyUpdate);
        return [...filtered, {
          date: todayKeyUpdate,
          nutritionCalories: currentCalories,
          activityMinutes: activityForPost,
          sleepMinutes: sleepForPost,
        }].sort((a, b) => a.date.localeCompare(b.date));
      });
    } catch (err) {
      Alert.alert('Saving failed', err.message);
    } finally {
      setSavingLog(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 18, paddingBottom: 28 }}
    >
      <Card style={{ paddingVertical: 14 }}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysScroll}
        >
          {dayTimeline.map((dayInfo, index) => {
            const { key, ...dayProps } = dayInfo;
            return (
              <Pressable
                key={key}
                onPress={() => setSelectedDate(key)}
                style={[
                  styles.dayWrapper,
                  index === dayTimeline.length - 1 && styles.lastDayWrapper,
                ]}
              >
                <DayPill {...dayProps} active={key === selectedDate} />
              </Pressable>
            );
          })}
        </ScrollView>
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
        currentLabel={nutritionDisplay}
        progress={nutritionProgress}
        accent={colors.orange}
        iconName="restaurant-outline"
        iconBg={colors.warningSoft}
         onAddPress={handleNutritionAdd}
      />
      <GoalCard
        title="Physical Activity"
        target="45 min"
        currentLabel={activityDisplay}
        progress={activityProgress}
        accent={colors.blue}
        iconName="walk-outline"
        iconBg={colors.primarySoft}
        onAddPress={handleActivityToggle}
        isTimer={true}
        timerActive={activityActive}
      />
      <GoalCard
        title="Sleep"
        target="8h 00m"
        currentLabel={sleepDisplay}
        progress={sleepProgress}
        accent={colors.purple}
        iconName="moon-outline"
        iconBg={colors.insightBg}
        onAddPress={handleSleepToggle}
        isTimer={true}
        timerActive={sleepActive}
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
        <Pressable
          onPress={handleLogToday}
          disabled={savingLog || !isTodaySelected}
          style={({ pressed }) => [
            styles.actionButton,
            {
              marginTop: 16,
              backgroundColor: colors.primary,
              opacity: pressed || savingLog ? 0.7 : 1,
              alignSelf: 'stretch',
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
        >
          {savingLog ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[styles.actionText, { color: '#fff' }]}>{saveButtonLabel}</Text>
          )}
        </Pressable>
      <Modal visible={showClock} transparent animationType="slide">
        <View style={styles.clockOverlay}>
          <View style={[styles.clockCard, { backgroundColor: colors.background, shadowColor: colors.shadow }]}>
            <Text style={[styles.clockTitle, { color: colors.text }]}>Activity Clock</Text>
            <Text style={[styles.clockTime, { color: colors.text }]}>{formatClock(activityTimer)}</Text>
            <Pressable
              onPress={() => {
                if (activityActive) {
                  handleActivityToggle();
                }
                setShowClock(false);
              }}
              style={styles.clockClose}
            >
              <Ionicons name="pause" size={22} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '700' }}>Pause</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
       <Modal visible={showNutritionModal} transparent animationType="slide">
        <View style={styles.clockOverlay}>
          <View style={[styles.nutritionCard, { backgroundColor: colors.background, shadowColor: colors.shadow }]}>
            <Text style={[styles.clockTitle, { color: colors.text }]}>Add Food</Text>
            
            <View style={{ width: '100%', gap: 12 }}>
              <View>
                <Text style={[styles.inputLabel, { color: colors.mutedText }]}>Food Name</Text>
                <TextInput
                  value={foodName}
                  onChangeText={setFoodName}
                  placeholder="e.g., Chapati, Rice, Apple"
                  placeholderTextColor={colors.mutedText}
                  style={[styles.nutritionInput, { 
                    backgroundColor: colors.surface, 
                    borderColor: colors.border, 
                    color: colors.text 
                  }]}
                />
              </View>

              <View>
                <Text style={[styles.inputLabel, { color: colors.mutedText }]}>Weight (grams)</Text>
                <TextInput
                  value={foodWeight}
                  onChangeText={setFoodWeight}
                  placeholder="e.g., 100"
                  placeholderTextColor={colors.mutedText}
                  keyboardType="numeric"
                  style={[styles.nutritionInput, { 
                    backgroundColor: colors.surface, 
                    borderColor: colors.border, 
                    color: colors.text 
                  }]}
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 10, width: '100%', marginTop: 8 }}>
              <Pressable
                onPress={() => {
                  setShowNutritionModal(false);
                  setFoodName('');
                  setFoodWeight('');
                }}
                style={[styles.nutritionButton, { backgroundColor: colors.surface, borderColor: colors.border, flex: 1 }]}
                disabled={loadingCalories}
              >
                <Text style={{ color: colors.text, fontWeight: '700' }}>Cancel</Text>
              </Pressable>
              
              <Pressable
                onPress={handleAddFood}
                style={[styles.nutritionButton, { backgroundColor: colors.orange, borderColor: 'transparent', flex: 1 }]}
                disabled={loadingCalories}
              >
                {loadingCalories ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={{ color: '#fff', fontWeight: '700' }}>Add Food</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
   nutritionCard: {
    width: '85%',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    gap: 16,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  nutritionInput: {
    height: 44,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '600',
  },
  nutritionButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  daysScroll: { flexDirection: 'row', paddingHorizontal: 8 },
  dayWrapper: { marginRight: 10 },
  lastDayWrapper: { marginRight: 0 },
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
  clockOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  clockCard: {
    width: '85%',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    gap: 16,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 16,
  },
  clockTitle: { fontSize: 20, fontWeight: '900' },
  clockTime: { fontSize: 46, fontWeight: '900' },
  clockClose: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#5A6CFF',
  },
  actionButton: {
    height: 48,
    borderRadius: 16,
    paddingHorizontal: 22,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});

