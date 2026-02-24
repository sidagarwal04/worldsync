<template>
  <div class="timezone-converter">
    <div class="converter-header">
      <h2>Timezone Converter</h2>
      <p class="subtitle">With Daylight Savings Support</p>
    </div>

    <div class="converters-row">
      <!-- Source Timezone -->
      <div class="timezone-section">
        <label class="label">From</label>
        <div class="timezone-input-group">
          <input
            v-model="sourceTime"
            type="time"
            class="time-input"
            @change="convertTimezone"
            aria-label="Source time"
          />
          <input
            v-model="sourceDate"
            type="date"
            class="date-input"
            @change="convertTimezone"
            aria-label="Source date"
          />
        </div>

        <div class="timezone-select">
          <div class="timezone-select-wrapper">
            <input
              v-model="sourceTimezoneSearch"
              type="text"
              placeholder="Search by name, abbr, or country..."
              class="search-input"
              aria-label="Search source timezone"
            />
            <select 
              v-model="sourceTimezone" 
              @change="convertTimezone"
              class="timezone-dropdown"
              aria-label="Select source timezone"
            >
              <option v-for="tz in sourceSuggestions" :key="tz" :value="tz">
                {{ getFormattedTimezone(tz) }} — {{ getCountry(tz) }}
              </option>
            </select>
          </div>
        </div>

        <div v-if="sourceInfo" class="timezone-info">
          <div class="info-row">
            <span class="info-label">{{ sourceInfo.abbreviation }}</span>
            <span class="info-value">{{ sourceInfo.offset }}</span>
          </div>
          <div v-if="sourceInfo.isDST" class="dst-badge">📍 DST</div>
        </div>
      </div>

      <!-- Swap Toggle Button -->
      <div class="swap-section">
        <button
          @click="swapTimezones"
          class="swap-button"
          aria-label="Swap timezones"
          title="Swap source and target timezones"
        >
          <span class="swap-icon">⇄</span>
        </button>
      </div>

      <!-- Target Timezone -->
      <div class="timezone-section">
        <label class="label">To</label>
        <div class="timezone-input-group">
          <input
            v-model="targetTime"
            type="time"
            disabled
            class="time-input disabled"
            aria-label="Target time (auto-calculated)"
          />
          <input
            v-model="targetDate"
            type="date"
            disabled
            class="date-input disabled"
            aria-label="Target date (auto-calculated)"
          />
        </div>

        <div class="timezone-select">
          <div class="timezone-select-wrapper">
            <input
              v-model="targetTimezoneSearch"
              type="text"
              placeholder="Search by name, abbr, or country..."
              class="search-input"
              aria-label="Search target timezone"
            />
            <select 
              v-model="targetTimezone" 
              @change="convertTimezone"
              class="timezone-dropdown"
              aria-label="Select target timezone"
            >
              <option v-for="tz in targetSuggestions" :key="tz" :value="tz">
                {{ getFormattedTimezone(tz) }} — {{ getCountry(tz) }}
              </option>
            </select>
          </div>
        </div>

        <div v-if="targetInfo" class="timezone-info">
          <div class="info-row">
            <span class="info-label">{{ targetInfo.abbreviation }}</span>
            <span class="info-value">{{ targetInfo.offset }}</span>
          </div>
          <div v-if="targetInfo.isDST" class="dst-badge">📍 DST</div>
        </div>
      </div>
    </div>

    <!-- Quick Links to Common Timezone Pairs -->
    <div class="quick-pairs">
      <h3>Popular Timezone Pairs</h3>
      <div class="pairs-grid">
        <button
          v-for="pair in commonPairs"
          :key="`${pair[0]}-${pair[1]}`"
          @click="selectPair(pair[0], pair[1])"
          class="pair-button"
        >
          <p class="pair-abbr">{{ getAbbreviation(pair[0]) }} → {{ getAbbreviation(pair[1]) }}</p>
          <p class="pair-location">{{ pair[0].split('/')[1] }} to {{ pair[1].split('/')[1] }}</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useTimezone } from '~/composables/useTimezone'
import type { TimezoneInfo } from '~/composables/useTimezone'

const {
  TIMEZONES_DATA,
  getAbbreviation,
  getCountry,
  getTimezoneInfo,
  convertTime,
  searchTimezones,
  getFormattedTimezone,
  getAllTimezones,
} = useTimezone()

const sourceTime = ref('12:00')
const sourceDate = ref(new Date().toISOString().split('T')[0])
const sourceTimezone = ref('America/New_York')
const sourceTimezoneSearch = ref('')
const sourceInfo = ref<TimezoneInfo | null>(null)

const targetTime = ref('00:00')
const targetDate = ref(new Date().toISOString().split('T')[0])
const targetTimezone = ref('Asia/Kolkata')
const targetTimezoneSearch = ref('')
const targetInfo = ref<TimezoneInfo | null>(null)

const sourceSuggestions = computed(() => {
  if (!sourceTimezoneSearch.value) return getAllTimezones()
  return searchTimezones(sourceTimezoneSearch.value)
})

const targetSuggestions = computed(() => {
  if (!targetTimezoneSearch.value) return getAllTimezones()
  return searchTimezones(targetTimezoneSearch.value)
})

const commonPairs = computed(() => [
  ['America/New_York', 'Europe/London'],
  ['America/New_York', 'Asia/Tokyo'],
  ['America/Los_Angeles', 'Asia/Kolkata'],
  ['Europe/London', 'Asia/Dubai'],
  ['America/Los_Angeles', 'Australia/Sydney'],
])

const formatTimezoneOption = (tz: string) => {
  return `${getFormattedTimezone(tz)} — ${getCountry(tz)}`
}

const convertTimezone = () => {
  const result = convertTime(sourceTime.value, sourceTimezone.value, targetTimezone.value, sourceDate.value)
  targetTime.value = result.time
  targetDate.value = result.date
  targetInfo.value = result.info
  sourceInfo.value = getTimezoneInfo(sourceTimezone.value)
}

const swapTimezones = () => {
  const tempTz = sourceTimezone.value
  sourceTimezone.value = targetTimezone.value
  targetTimezone.value = tempTz

  const tempSearch = sourceTimezoneSearch.value
  sourceTimezoneSearch.value = targetTimezoneSearch.value
  targetTimezoneSearch.value = tempSearch

  const tempTime = sourceTime.value
  sourceTime.value = targetTime.value
  targetTime.value = tempTime

  const tempDate = sourceDate.value
  sourceDate.value = targetDate.value
  targetDate.value = tempDate

  convertTimezone()
}

const selectPair = (fromTz: string, toTz: string) => {
  sourceTimezone.value = fromTz
  targetTimezone.value = toTz
  sourceTimezoneSearch.value = ''
  targetTimezoneSearch.value = ''
  sourceTime.value = '12:00'
  sourceDate.value = new Date().toISOString().split('T')[0]
  convertTimezone()
}

// Watch for timezone changes
watch(sourceTimezone, () => {
  convertTimezone()
})

watch(targetTimezone, () => {
  convertTimezone()
})

// Initialize
sourceInfo.value = getTimezoneInfo(sourceTimezone.value)
targetInfo.value = getTimezoneInfo(targetTimezone.value)
convertTimezone()
</script>

<style scoped>
.timezone-converter {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  color: white;
  max-width: 1000px;
}

.converter-header {
  text-align: center;
  margin-bottom: 32px;
}

.converter-header h2 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
}

.converters-row {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.timezone-section {
  flex: 1;
  min-width: 280px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.timezone-input-group {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.time-input,
.date-input {
  flex: 1;
  padding: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.time-input:focus,
.date-input:focus {
  outline: none;
  border-color: white;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.2);
}

.time-input.disabled,
.date-input.disabled {
  background: rgba(255, 255, 255, 0.05);
  cursor: not-allowed;
  color: rgba(255, 255, 255, 0.6);
}

.timezone-select {
  position: relative;
  margin-bottom: 16px;
}

.timezone-select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.search-input {
  width: 100%;
  padding: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px 8px 0 0;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 13px;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: #999;
}

.search-input:focus {
  outline: none;
  border-color: white;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.2);
}

.timezone-dropdown {
  width: 100%;
  padding: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: none;
  border-radius: 0 0 8px 8px;
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  font-size: 14px;
  transition: all 0.3s ease;
  min-height: auto;
  max-height: none;
  overflow-y: visible;
}

.timezone-dropdown:focus {
  outline: none;
  border-color: white;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.2);
}

.timezone-dropdown option {
  padding: 8px;
  background: white;
  color: #333;
}

.timezone-info {
  font-size: 12px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 8px 12px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
}

.info-label {
  opacity: 0.8;
  font-weight: 600;
  font-size: 11px;
}

.info-value {
  font-weight: 700;
  color: #fff;
  font-size: 12px;
}

.dst-badge {
  display: inline-block;
  background: rgba(255, 193, 7, 0.3);
  border: 1px solid rgba(255, 193, 7, 0.6);
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 600;
  color: #ffc107;
  margin-top: 8px;
}

.swap-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 24px;
}

.swap-button {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
  font-size: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  z-index: 5;
}

.swap-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1) rotate(180deg);
}

.swap-button:active {
  transform: scale(0.95);
}

.swap-icon {
  display: block;
}

.quick-pairs {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.quick-pairs h3 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.pairs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.pair-button {
  padding: 12px;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.pair-button:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: white;
  transform: translateY(-2px);
}

.pair-abbr {
  margin: 0 0 4px 0;
  font-size: 12px;
  font-weight: 700;
}

.pair-location {
  margin: 0;
  font-size: 11px;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .timezone-converter {
    padding: 24px;
  }

  .converters-row {
    flex-direction: column;
  }

  .timezone-section {
    min-width: 100%;
  }

  .swap-section {
    padding: 16px 0;
  }

  .swap-button {
    width: 48px;
    height: 48px;
    font-size: 24px;
  }

  .pairs-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
}
</style>
