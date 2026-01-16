# Weather API Night-Time Fix

## Problem
The footer displays "Made in sunny Portland, OR" even at night when it should say something like "Made in clear Portland, OR" instead.

**Screenshot evidence:** At 7:57 PM (night), the footer shows "Made in sunny Portland, OR. It is 7:57 pm here and its night."

## Root Cause

In `/src/app/api/weather/route.ts`, the weather condition mapping always returns "sunny" for clear weather:

```typescript
const weatherConditionToWord = (condition: string): string => {
  const mapping: Record<string, string> = {
    'Clear': 'sunny',  // <-- Always "sunny", even at night
    'Clouds': 'cloudy',
    // ...
  };
  return mapping[condition] || 'beautiful';
};
```

The API has no awareness of time of day - it just maps OpenWeatherMap conditions to adjectives.

## Solution Options

### Option 1: Handle in Footer Component (Recommended)
The Footer already knows if it's day or night via `actualTimePeriod`. Simply adjust the weather word there:

```typescript
// In Footer.tsx
const weatherWord = data.weatherEnabled && weatherData?.weather
  ? (weatherData.weather === 'sunny' && actualTimePeriod === 'night'
      ? 'clear'
      : weatherData.weather)
  : '';
```

**Pros:**
- Minimal change (1 line)
- Footer already has time-of-day context
- No API changes needed

**Cons:**
- Logic split between API and component

### Option 2: Add Time Awareness to API
Modify the weather API to accept or calculate time of day:

```typescript
// In route.ts
const weatherConditionToWord = (condition: string, isNight: boolean): string => {
  if (condition === 'Clear') {
    return isNight ? 'clear' : 'sunny';
  }
  // ... rest of mapping
};
```

Would need to either:
- Calculate sunrise/sunset in the API using SunCalc
- Accept `isNight` as a query parameter from the client

**Pros:**
- All weather logic in one place

**Cons:**
- More complex change
- Either duplicates SunCalc logic or requires client to pass time info

### Option 3: Return Raw Condition, Format in Client
Have API return the raw condition ("Clear") and let client format it:

```typescript
// API returns: { condition: 'Clear', ... }
// Footer formats based on time of day
```

**Pros:**
- Clean separation of concerns

**Cons:**
- More refactoring needed
- Mapping logic moves to client

## Recommendation

**Option 1** is the simplest and most practical fix. The Footer component already has all the context needed (weather data + time of day), so adding one conditional is the cleanest approach.

## Affected Files
- `/src/components/Footer.tsx` - Add night-time weather word adjustment
- `/src/app/api/weather/route.ts` - No changes needed for Option 1

## Weather Word Mappings for Night

If implementing Option 1, consider these night-time alternatives:

| Day Word | Night Alternative | Condition |
|----------|------------------|-----------|
| sunny | clear | Clear |
| (all others stay the same) | | |

Most other conditions (cloudy, rainy, foggy, etc.) are valid both day and night.
