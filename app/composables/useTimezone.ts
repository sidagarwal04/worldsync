import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export interface TimezoneInfo {
  name: string
  abbreviation: string
  offset: string
  isDST: boolean
  displayName: string
  country?: string
}

export const useTimezone = () => {
  // Comprehensive timezone list with abbreviations and country info
  const TIMEZONES_DATA = [
    // North America
    { tz: 'America/Vancouver', abbr: 'PST/PDT', country: '🇨🇦 Canada (Pacific)' },
    { tz: 'America/Los_Angeles', abbr: 'PST/PDT', country: '🇺🇸 USA (Pacific)' },
    { tz: 'America/Phoenix', abbr: 'MST', country: '🇺🇸 USA (Mountain)' },
    { tz: 'America/Denver', abbr: 'MST/MDT', country: '🇺🇸 USA (Mountain)' },
    { tz: 'America/Chicago', abbr: 'CST/CDT', country: '🇺🇸 USA (Central)' },
    { tz: 'America/Toronto', abbr: 'EST/EDT', country: '🇨🇦 Canada (Eastern)' },
    { tz: 'America/New_York', abbr: 'EST/EDT', country: '🇺🇸 USA (Eastern)' },
    { tz: 'America/Anchorage', abbr: 'AKST/AKDT', country: '🇺🇸 USA (Alaska)' },
    { tz: 'Pacific/Honolulu', abbr: 'HST', country: '🇺🇸 USA (Hawaii)' },
    { tz: 'America/Mexico_City', abbr: 'CST/CDT', country: '🇲🇽 Mexico' },
    { tz: 'America/Bogota', abbr: 'COT', country: '🇨🇴 Colombia' },
    { tz: 'America/Lima', abbr: 'PET', country: '🇵🇪 Peru' },
    { tz: 'America/Sao_Paulo', abbr: 'BRT/BRST', country: '🇧🇷 Brazil' },
    { tz: 'America/Buenos_Aires', abbr: 'ART', country: '🇦🇷 Argentina' },
    
    // Atlantic & Caribbean
    { tz: 'Atlantic/St_Johns', abbr: 'NST/NDT', country: '🇨🇦 Canada (Newfoundland)' },
    { tz: 'Atlantic/Halifax', abbr: 'AST/ADT', country: '🇨🇦 Canada (Atlantic)' },
    { tz: 'America/Puerto_Rico', abbr: 'AST', country: '🇵🇷 Puerto Rico' },
    { tz: 'America/Virgin', abbr: 'AST', country: '🇺🇸 US Virgin Islands' },
    { tz: 'Atlantic/Bermuda', abbr: 'AST/ADT', country: '🇧🇲 Bermuda' },
    
    // Europe
    { tz: 'Atlantic/Reykjavik', abbr: 'GMT', country: '🇮🇸 Iceland' },
    { tz: 'Europe/London', abbr: 'GMT/BST', country: '🇬🇧 UK (London)' },
    { tz: 'Europe/Dublin', abbr: 'GMT/IST', country: '🇮🇪 Ireland' },
    { tz: 'Europe/Lisbon', abbr: 'WET/WEST', country: '🇵🇹 Portugal' },
    { tz: 'Africa/Casablanca', abbr: 'WET/WEST', country: '🇲🇦 Morocco' },
    { tz: 'Europe/Paris', abbr: 'CET/CEST', country: '🇫🇷 France' },
    { tz: 'Europe/Berlin', abbr: 'CET/CEST', country: '🇩🇪 Germany' },
    { tz: 'Europe/Amsterdam', abbr: 'CET/CEST', country: '🇳🇱 Netherlands' },
    { tz: 'Europe/Brussels', abbr: 'CET/CEST', country: '🇧🇪 Belgium' },
    { tz: 'Europe/Vienna', abbr: 'CET/CEST', country: '🇦🇹 Austria' },
    { tz: 'Europe/Prague', abbr: 'CET/CEST', country: '🇨🇿 Czech Republic' },
    { tz: 'Europe/Budapest', abbr: 'CET/CEST', country: '🇭🇺 Hungary' },
    { tz: 'Europe/Warsaw', abbr: 'CET/CEST', country: '🇵🇱 Poland' },
    { tz: 'Europe/Rome', abbr: 'CET/CEST', country: '🇮🇹 Italy' },
    { tz: 'Europe/Madrid', abbr: 'CET/CEST', country: '🇪🇸 Spain' },
    { tz: 'Europe/Athens', abbr: 'EET/EEST', country: '🇬🇷 Greece' },
    { tz: 'Europe/Helsinki', abbr: 'EET/EEST', country: '🇫🇮 Finland' },
    { tz: 'Europe/Moscow', abbr: 'MSK', country: '🇷🇺 Russia (Moscow)' },
    { tz: 'Europe/Istanbul', abbr: 'EET', country: '🇹🇷 Turkey' },
    { tz: 'Europe/Bucharest', abbr: 'EET/EEST', country: '🇷🇴 Romania' },
    { tz: 'Europe/Sofia', abbr: 'EET/EEST', country: '🇧🇬 Bulgaria' },
    { tz: 'Europe/Kiev', abbr: 'EET/EEST', country: '🇺🇦 Ukraine' },
    
    // Middle East & Africa
    { tz: 'Africa/Cairo', abbr: 'EET', country: '🇪🇬 Egypt' },
    { tz: 'Africa/Johannesburg', abbr: 'SAST', country: '🇿🇦 South Africa' },
    { tz: 'Africa/Nairobi', abbr: 'EAT', country: '🇰🇪 Kenya' },
    { tz: 'Africa/Lagos', abbr: 'WAT', country: '🇳🇬 Nigeria' },
    { tz: 'Asia/Dubai', abbr: 'GST', country: '🇦🇪 UAE (Dubai)' },
    { tz: 'Asia/Beirut', abbr: 'EET/EEST', country: '🇱🇧 Lebanon' },
    { tz: 'Asia/Jerusalem', abbr: 'IST/IDT', country: '🇮🇱 Israel' },
    { tz: 'Asia/Baghdad', abbr: 'AST', country: '🇮🇶 Iraq' },
    { tz: 'Asia/Tehran', abbr: 'IRST/IRDT', country: '🇮🇷 Iran' },
    { tz: 'Asia/Bahrain', abbr: 'AST', country: '🇧🇭 Bahrain' },
    { tz: 'Asia/Kuwait', abbr: 'AST', country: '🇰🇼 Kuwait' },
    { tz: 'Asia/Riyadh', abbr: 'AST', country: '🇸🇦 Saudi Arabia' },
    { tz: 'Asia/Aden', abbr: 'AST', country: '🇾🇪 Yemen' },
    { tz: 'Asia/Muscat', abbr: 'GST', country: '🇴🇲 Oman' },
    { tz: 'Asia/Karachi', abbr: 'PKT', country: '🇵🇰 Pakistan' },
    
    // South Asia
    { tz: 'Asia/Kolkata', abbr: 'IST', country: '🇮🇳 India' },
    { tz: 'Asia/Dhaka', abbr: 'BDT', country: '🇧🇩 Bangladesh' },
    { tz: 'Asia/Kathmandu', abbr: 'NPT', country: '🇳🇵 Nepal' },
    { tz: 'Asia/Sri_Jayawardenepura', abbr: 'MVT', country: '🇱🇰 Sri Lanka' },
    
    // Southeast Asia
    { tz: 'Asia/Bangkok', abbr: 'ICT', country: '🇹🇭 Thailand' },
    { tz: 'Asia/Ho_Chi_Minh', abbr: 'ICT', country: '🇻🇳 Vietnam' },
    { tz: 'Asia/Phnom_Penh', abbr: 'ICT', country: '🇰🇭 Cambodia' },
    { tz: 'Asia/Vientiane', abbr: 'ICT', country: '🇱🇦 Laos' },
    { tz: 'Asia/Singapore', abbr: 'SGT', country: '🇸🇬 Singapore' },
    { tz: 'Asia/Kuala_Lumpur', abbr: 'MYT', country: '🇲🇾 Malaysia' },
    { tz: 'Asia/Manila', abbr: 'PHT', country: '🇵🇭 Philippines' },
    { tz: 'Asia/Jakarta', abbr: 'WIB', country: '🇮🇩 Indonesia (Jakarta)' },
    { tz: 'Asia/Brunei', abbr: 'BNT', country: '🇧🇳 Brunei' },
    { tz: 'Asia/Yangon', abbr: 'MMT', country: '🇲🇲 Myanmar' },
    
    // East Asia
    { tz: 'Asia/Hong_Kong', abbr: 'HKT', country: '🇭🇰 Hong Kong' },
    { tz: 'Asia/Taipei', abbr: 'CST', country: '🇹🇼 Taiwan' },
    { tz: 'Asia/Shanghai', abbr: 'CST', country: '🇨🇳 China' },
    { tz: 'Asia/Tokyo', abbr: 'JST', country: '🇯🇵 Japan' },
    { tz: 'Asia/Seoul', abbr: 'KST', country: '🇰🇷 South Korea' },
    { tz: 'Asia/Pyongyang', abbr: 'KST', country: '🇰🇵 North Korea' },
    { tz: 'Asia/Ulaanbaatar', abbr: 'ULAT/ULAST', country: '🇲🇳 Mongolia' },
    
    // Central Asia
    { tz: 'Asia/Almaty', abbr: 'ALMT', country: '🇰🇿 Kazakhstan' },
    { tz: 'Asia/Bishkek', abbr: 'KGT', country: '🇰🇬 Kyrgyzstan' },
    { tz: 'Asia/Tashkent', abbr: 'UZT', country: '🇺🇿 Uzbekistan' },
    { tz: 'Asia/Dushanbe', abbr: 'TJT', country: '🇹🇯 Tajikistan' },
    { tz: 'Asia/Ashgabat', abbr: 'TMT', country: '🇹🇲 Turkmenistan' },
    
    // Pacific
    { tz: 'Australia/Perth', abbr: 'AWST', country: '🇦🇺 Australia (Perth)' },
    { tz: 'Australia/Adelaide', abbr: 'ACST/ACDT', country: '🇦🇺 Australia (Adelaide)' },
    { tz: 'Australia/Brisbane', abbr: 'AEST', country: '🇦🇺 Australia (Brisbane)' },
    { tz: 'Australia/Sydney', abbr: 'AEST/AEDT', country: '🇦🇺 Australia (Sydney)' },
    { tz: 'Australia/Hobart', abbr: 'AEST/AEDT', country: '🇦🇺 Australia (Hobart)' },
    { tz: 'Australia/Darwin', abbr: 'ACST', country: '🇦🇺 Australia (Darwin)' },
    { tz: 'Pacific/Apia', abbr: 'SST/SDT', country: '🇼🇸 Samoa' },
    { tz: 'Pacific/Fiji', abbr: 'FJT/FJST', country: '🇫🇯 Fiji' },
    { tz: 'Pacific/Tongatapu', abbr: 'TOT', country: '🇹🇴 Tonga' },
    { tz: 'Pacific/Nadi', abbr: 'FJT', country: '🇫🇯 Fiji (Nadi)' },
    { tz: 'Pacific/Port_Moresby', abbr: 'PGT', country: '🇵🇬 Papua New Guinea' },
    { tz: 'Pacific/Guadalcanal', abbr: 'SBT', country: '🇸🇧 Solomon Islands' },
    { tz: 'Pacific/Nauru', abbr: 'NRT', country: '🇳🇷 Nauru' },
    { tz: 'Pacific/Kiritimati', abbr: 'LINT', country: '🇰🇮 Kiribati' },
    { tz: 'Pacific/Auckland', abbr: 'NZST/NZDT', country: '🇳🇿 New Zealand' },
    { tz: 'Pacific/Chatham', abbr: 'CHAST/CHADT', country: '🇳🇿 Chatham Islands' },
    
    // UTC
    { tz: 'UTC', abbr: 'UTC', country: '🌍 Coordinated Universal Time' },
  ]

  const TIMEZONES = TIMEZONES_DATA.map(t => t.tz)

  /**
   * Get timezone abbreviation
   */
  const getAbbreviation = (tz: string): string => {
    const data = TIMEZONES_DATA.find(t => t.tz === tz)
    return data?.abbr || 'UTC'
  }

  /**
   * Get country/region info
   */
  const getCountry = (tz: string): string => {
    const data = TIMEZONES_DATA.find(t => t.tz === tz)
    return data?.country || ''
  }

  /**
   * Get timezone offset and DST information
   */
  const getTimezoneInfo = (tz: string, date: dayjs.Dayjs = dayjs()): TimezoneInfo => {
    const tzDate = date.tz(tz)
    const utcDate = tzDate.utc()
    const offsetMinutes = tzDate.utcOffset()
    const offsetHours = Math.floor(offsetMinutes / 60)
    const offsetMins = Math.abs(offsetMinutes % 60)
    const offsetStr = `UTC ${offsetHours >= 0 ? '+' : ''}${offsetHours}:${String(offsetMins).padStart(2, '0')}`

    // Check if DST is active by comparing winter and summer offsets
    const year = tzDate.year()
    const jan = dayjs(`${year}-01-15`).tz(tz)
    const jul = dayjs(`${year}-07-15`).tz(tz)
    const hasDSTTransition = jan.utcOffset() !== jul.utcOffset()
    const isDST = hasDSTTransition && tzDate.utcOffset() === jul.utcOffset()

    return {
      name: tz,
      abbreviation: getAbbreviation(tz),
      offset: offsetStr,
      isDST,
      displayName: tz.split('/').pop() || tz,
      country: getCountry(tz),
    }
  }

  /**
   * Convert time from one timezone to another
   */
  const convertTime = (
    sourceTime: string,
    sourceTimezone: string,
    targetTimezone: string,
    sourceDate: string = dayjs().format('YYYY-MM-DD')
  ): { time: string; date: string; info: TimezoneInfo } => {
    const fullDateTime = `${sourceDate} ${sourceTime}`
    const sourceDateObj = dayjs.tz(fullDateTime, 'YYYY-MM-DD HH:mm', sourceTimezone)
    const targetDateObj = sourceDateObj.tz(targetTimezone)

    return {
      time: targetDateObj.format('HH:mm'),
      date: targetDateObj.format('YYYY-MM-DD'),
      info: getTimezoneInfo(targetTimezone, targetDateObj),
    }
  }

  /**
   * Get current time in a timezone
   */
  const getCurrentTime = (tz: string): { time: string; date: string; info: TimezoneInfo } => {
    const now = dayjs().tz(tz)
    return {
      time: now.format('HH:mm'),
      date: now.format('YYYY-MM-DD'),
      info: getTimezoneInfo(tz, now),
    }
  }

  /**
   * Get all available timezones
   */
  const getAllTimezones = (): string[] => TIMEZONES

  /**
   * Search timezones by name, abbreviation, or country
   */
  const searchTimezones = (query: string): string[] => {
    const lowerQuery = query.toLowerCase()
    return TIMEZONES.filter((tz) => {
      const tzData = TIMEZONES_DATA.find(t => t.tz === tz)
      return (
        tz.toLowerCase().includes(lowerQuery) ||
        tzData?.abbr.toLowerCase().includes(lowerQuery) ||
        tzData?.country?.toLowerCase().includes(lowerQuery) ||
        getTimezoneInfo(tz).offset.includes(query)
      )
    })
  }

  /**
   * Check if DST applies to a timezone on a given date
   */
  const hasDST = (tz: string, date: dayjs.Dayjs = dayjs()): boolean => {
    return getTimezoneInfo(tz, date).isDST
  }

  /**
   * Get DST transition dates for a timezone in a given year
   */
  const getDSTTransitions = (tz: string, year: number): { spring: string; fall: string } | null => {
    const jan = dayjs(`${year}-01-15`).tz(tz).utcOffset()
    const jul = dayjs(`${year}-07-15`).tz(tz).utcOffset()

    if (jan !== jul) {
      return {
        spring: `Around March ${year}`,
        fall: `Around November ${year}`,
      }
    }

    return null
  }

  /**
   * Get formatted timezone display string with abbreviation
   */
  const getFormattedTimezone = (tz: string): string => {
    const abbreviation = getAbbreviation(tz)
    const displayName = tz.split('/').pop() || tz
    return `${displayName} (${abbreviation})`
  }

  return {
    TIMEZONES,
    TIMEZONES_DATA,
    getAbbreviation,
    getCountry,
    getTimezoneInfo,
    convertTime,
    getCurrentTime,
    getAllTimezones,
    searchTimezones,
    hasDST,
    getDSTTransitions,
    getFormattedTimezone,
  }
}

