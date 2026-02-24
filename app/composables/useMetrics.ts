export interface ConversionResult {
  value: number
  unit: string
  formatted: string
}

export interface MetricCategory {
  name: string
  units: Record<string, number> // unit name to base unit conversion factor
}

export const useMetrics = () => {
  // Conversion factors to base units
  const METRICS: Record<string, MetricCategory> = {
    length: {
      name: 'Length',
      units: {
        'mm': 0.001,
        'cm': 0.01,
        'm': 1,
        'km': 1000,
        'in': 0.0254,
        'ft': 0.3048,
        'yd': 0.9144,
        'mi': 1609.34,
      },
    },
    weight: {
      name: 'Weight',
      units: {
        'mg': 0.000001,
        'g': 0.001,
        'kg': 1,
        'oz': 0.0283495,
        'lb': 0.453592,
        'ton': 1000,
      },
    },
    volume: {
      name: 'Volume',
      units: {
        'ml': 0.001,
        'l': 1,
        'gal': 3.78541,
        'oz (fl)': 0.0295735,
        'cup': 0.236588,
        'pint': 0.473176,
      },
    },
    temperature: {
      name: 'Temperature',
      units: {
        'C': 1, // special handling required
        'F': 1, // special handling required
        'K': 1, // special handling required
      },
    },
    speed: {
      name: 'Speed',
      units: {
        'm/s': 1,
        'km/h': 0.277778,
        'mph': 0.44704,
        'knot': 0.51444,
      },
    },
  }

  /**
   * Get all metric categories
   */
  const getCategories = (): string[] => Object.keys(METRICS)

  /**
   * Get all units in a category
   */
  const getUnitsInCategory = (category: string): string[] =>
    Object.keys(METRICS[category]?.units || {})

  /**
   * Convert between two units
   */
  const convert = (
    value: number,
    fromUnit: string,
    toUnit: string,
    category: string
  ): ConversionResult => {
    if (!METRICS[category]) {
      throw new Error(`Unknown category: ${category}`)
    }

    const units = METRICS[category].units
    if (!units[fromUnit] || !units[toUnit]) {
      throw new Error(`Unknown unit in category ${category}`)
    }

    // Special handling for temperature
    if (category === 'temperature') {
      return convertTemperature(value, fromUnit, toUnit)
    }

    // Standard conversion
    const baseValue = value * units[fromUnit]
    const result = baseValue / units[toUnit]

    return {
      value: result,
      unit: toUnit,
      formatted: result.toFixed(4).replace(/\.?0+$/, ''),
    }
  }

  /**
   * Convert temperature
   */
  const convertTemperature = (value: number, fromUnit: string, toUnit: string): ConversionResult => {
    let celsius: number

    // Convert to Celsius first
    if (fromUnit === 'C') {
      celsius = value
    } else if (fromUnit === 'F') {
      celsius = (value - 32) * (5 / 9)
    } else if (fromUnit === 'K') {
      celsius = value - 273.15
    } else {
      throw new Error(`Unknown temperature unit: ${fromUnit}`)
    }

    // Convert from Celsius to target
    let result: number
    if (toUnit === 'C') {
      result = celsius
    } else if (toUnit === 'F') {
      result = celsius * (9 / 5) + 32
    } else if (toUnit === 'K') {
      result = celsius + 273.15
    } else {
      throw new Error(`Unknown temperature unit: ${toUnit}`)
    }

    return {
      value: result,
      unit: toUnit,
      formatted: result.toFixed(2),
    }
  }

  /**
   * Batch convert a value to multiple target units
   */
  const convertToAll = (value: number, fromUnit: string, category: string): ConversionResult[] => {
    const targetUnits = getUnitsInCategory(category)
    return targetUnits.map(toUnit => convert(value, fromUnit, toUnit, category))
  }

  /**
   * Get commonly used unit pairs for a category
   */
  const getCommonPairs = (category: string): Array<[string, string]> => {
    const commonPairs: Record<string, Array<[string, string]>> = {
      length: [
        ['m', 'ft'],
        ['km', 'mi'],
        ['cm', 'in'],
      ],
      weight: [
        ['kg', 'lb'],
        ['g', 'oz'],
      ],
      volume: [
        ['l', 'gal'],
        ['ml', 'oz (fl)'],
      ],
      temperature: [
        ['C', 'F'],
        ['C', 'K'],
      ],
      speed: [
        ['km/h', 'mph'],
        ['m/s', 'km/h'],
      ],
    }

    return commonPairs[category] || []
  }

  return {
    METRICS,
    getCategories,
    getUnitsInCategory,
    convert,
    convertTemperature,
    convertToAll,
    getCommonPairs,
  }
}
