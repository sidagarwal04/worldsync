<template>
  <div class="metrics-converter">
    <div class="converter-header">
      <h2>Metrics Converter</h2>
      <p class="subtitle">Length, Weight, Volume & More</p>
    </div>

    <div class="converters-row">
      <!-- Category Selection -->
      <div class="category-section">
        <label class="label">Category</label>
        <div class="category-grid">
          <button
            v-for="category in categories"
            :key="category"
            :class="{ active: selectedCategory === category }"
            @click="selectCategory(category)"
            class="category-button"
          >
            {{ getCategoryIcon(category) }} {{ formatCategoryName(category) }}
          </button>
        </div>
      </div>

      <!-- Source Value -->
      <div class="converter-section">
        <label class="label">From</label>
        <div class="input-group">
          <input
            v-model.number="sourceValue"
            type="number"
            placeholder="Enter value"
            class="number-input"
            @input="convertMetric"
            aria-label="Source value"
          />
          <select v-model="sourceUnit" @change="convertMetric" class="unit-select" aria-label="Source unit">
            <option v-for="unit in sourceUnits" :key="unit" :value="unit">
              {{ unit }}
            </option>
          </select>
        </div>
      </div>

      <!-- Swap Toggle Button -->
      <div class="swap-section">
        <button
          @click="swapUnits"
          class="swap-button"
          aria-label="Swap units"
          title="Swap source and target units"
        >
          <span class="swap-icon">⇄</span>
        </button>
      </div>

      <!-- Target Value -->
      <div class="converter-section">
        <label class="label">To</label>
        <div class="input-group">
          <input
            v-model.number="targetValue"
            type="number"
            placeholder="Result"
            disabled
            class="number-input disabled"
            aria-label="Target value (auto-calculated)"
          />
          <select v-model="targetUnit" @change="convertMetric" class="unit-select" aria-label="Target unit">
            <option v-for="unit in targetUnits" :key="unit" :value="unit">
              {{ unit }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Common Conversions -->
    <div class="common-conversions">
      <h3>Quick Conversions</h3>
      <div class="conversions-grid">
        <div
          v-for="(pair, idx) in commonConversions"
          :key="idx"
          @click="quickConvert(pair[0], pair[1])"
          class="conversion-card"
        >
          <p class="conversion-label">{{ pair[0] }} to {{ pair[1] }}</p>
          <p class="conversion-example">e.g., 1 {{ pair[0] }} = {{ formatConversion(1, pair[0], pair[1]) }} {{ pair[1] }}</p>
        </div>
      </div>
    </div>

    <!-- Conversion Table -->
    <div class="conversion-table-section">
      <h3>{{ formatCategoryName(selectedCategory) }} Conversions</h3>
      <div class="table-wrapper">
        <table class="conversion-table">
          <thead>
            <tr>
              <th class="unit-col">Unit</th>
              <th class="conversion-col">Conversion</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="unit in allUnitsInCategory" :key="unit">
              <td class="unit-col">{{ unit }}</td>
              <td class="conversion-col">
                {{ sourceValue }} {{ sourceUnit }} = {{ getConvertedValue(unit) }} {{ unit }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMetrics } from '~/composables/useMetrics'

const { getCategories, getUnitsInCategory, convert, getCommonPairs } = useMetrics()

const sourceValue = ref(1)
const sourceUnit = ref('m')
const targetValue = ref(1)
const targetUnit = ref('ft')
const selectedCategory = ref('length')

const categories = computed(() => getCategories())
const sourceUnits = computed(() => getUnitsInCategory(selectedCategory.value))
const targetUnits = computed(() => getUnitsInCategory(selectedCategory.value))
const allUnitsInCategory = computed(() => getUnitsInCategory(selectedCategory.value))
const commonConversions = computed(() => getCommonPairs(selectedCategory.value))

const formatCategoryName = (category: string) => {
  return category.charAt(0).toUpperCase() + category.slice(1)
}

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    length: '📏',
    weight: '⚖️',
    volume: '🥤',
    temperature: '🌡️',
    speed: '⚡',
  }
  return icons[category] || '🔄'
}

const selectCategory = (category: string) => {
  selectedCategory.value = category
  sourceUnit.value = getUnitsInCategory(category)[0]
  targetUnit.value = getUnitsInCategory(category)[1] || getUnitsInCategory(category)[0]
  sourceValue.value = 1
  convertMetric()
}

const convertMetric = () => {
  if (sourceValue.value === null || sourceValue.value === undefined || sourceValue.value === '') {
    targetValue.value = 0
    return
  }
  const result = convert(sourceValue.value, sourceUnit.value, targetUnit.value, selectedCategory.value)
  targetValue.value = parseFloat(result.formatted)
}

const swapUnits = () => {
  const tempUnit = sourceUnit.value
  sourceUnit.value = targetUnit.value
  targetUnit.value = tempUnit

  const tempValue = sourceValue.value
  sourceValue.value = targetValue.value
  targetValue.value = tempValue

  convertMetric()
}

const quickConvert = (fromUnit: string, toUnit: string) => {
  sourceUnit.value = fromUnit
  targetUnit.value = toUnit
  sourceValue.value = 1
  convertMetric()
}

const formatConversion = (value: number, fromUnit: string, toUnit: string) => {
  try {
    const result = convert(value, fromUnit, toUnit, selectedCategory.value)
    return result.formatted
  } catch {
    return '—'
  }
}

const getConvertedValue = (unit: string) => {
  if (sourceValue.value === null || sourceValue.value === undefined || sourceValue.value === '') {
    return '0'
  }
  try {
    const result = convert(sourceValue.value, sourceUnit.value, unit, selectedCategory.value)
    return result.formatted
  } catch {
    return '—'
  }
}

convertMetric()
</script>

<style scoped>
.metrics-converter {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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

.category-section {
  margin-bottom: 32px;
}

.label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.category-button {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-button:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: white;
}

.category-button.active {
  background: rgba(255, 255, 255, 0.3);
  border-color: white;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.2);
}

.converters-row {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.converter-section {
  flex: 1;
  min-width: 240px;
}

.input-group {
  display: flex;
  gap: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 8px;
  backdrop-filter: blur(10px);
}

.number-input,
.unit-select {
  padding: 12px 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.number-input {
  flex: 1;
  min-width: 100px;
}

.number-input::placeholder {
  color: #999;
}

.number-input:focus,
.unit-select:focus {
  outline: none;
  border-color: white;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.2);
}

.number-input.disabled {
  background: rgba(255, 255, 255, 0.05);
  cursor: not-allowed;
  color: rgba(255, 255, 255, 0.6);
  border-color: rgba(255, 255, 255, 0.2);
}

.unit-select {
  min-width: 100px;
}

.swap-section {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 34px;
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
}

.swap-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1) rotate(180deg);
}

.swap-button:active {
  transform: scale(0.95);
}

.common-conversions {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  margin-bottom: 32px;
}

.common-conversions h3 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.conversions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.conversion-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.conversion-card:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: white;
  transform: translateY(-2px);
}

.conversion-label {
  margin: 0 0 6px 0;
  font-size: 13px;
  font-weight: 600;
}

.conversion-example {
  margin: 0;
  font-size: 12px;
  opacity: 0.8;
}

.conversion-table-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.conversion-table-section h3 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-wrapper {
  overflow-x: auto;
}

.conversion-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.conversion-table thead {
  background: rgba(0, 0, 0, 0.2);
}

.conversion-table th,
.conversion-table td {
  padding: 12px;
  text-align: left;
}

.conversion-table th {
  font-weight: 600;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
}

.conversion-table tbody tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.conversion-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.1);
}

.unit-col {
  width: 80px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .metrics-converter {
    padding: 24px;
  }

  .converters-row {
    flex-direction: column;
  }

  .category-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }

  .conversion-table {
    font-size: 12px;
  }

  .conversion-table th,
  .conversion-table td {
    padding: 10px 8px;
  }
}
</style>
