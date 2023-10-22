/**
 * Accepts a Hex color value and converts it into an HSL value.
 *
 * e.g.
 * const [hue, sat, light] = hexToHsl('#FF0000')
 * background-color: hsla(${hue}, ${sat}%, ${light}%, 0.5);
 */
export const hexToHsl = async (hex: string) => {
  const hexRgb = await import('hex-rgb')
  let { red, green, blue } = hexRgb.default(hex)

  red /= 255
  green /= 255
  blue /= 255

  const cmin = Math.min(red, green, blue)
  const cmax = Math.max(red, green, blue)
  const delta = cmax - cmin
  let hue = 0
  let sat = 0
  let light = 0

  if (delta === 0) {
    hue = 0
  } else if (cmax === red) {
    hue = ((green - blue) / delta) % 6
  } else if (cmax === green) {
    hue = (blue - red) / delta + 2
  } else {
    hue = (red - green) / delta + 4
  }

  hue = Math.round(hue * 60)

  if (hue < 0) {
    hue += 360
  }

  light = (cmax + cmin) / 2
  sat = delta === 0 ? 0 : delta / (1 - Math.abs(2 * light - 1))
  sat = Math.round(sat * 100)
  light = Math.round(light * 100)

  return [hue, sat, light]
}

// Primary Greens
export const PG90S = '#08110A'
export const PG80S = '#112314'
export const PG70S = '#1A341F'
export const PG60S = '#224529'
export const PG50S = '#2B5733'
export const PG40S = '#33683D'
export const PG30S = '#3B7947'
export const PG20S = '#448A52'
export const PG10S = '#4D9C5C'
export const PG = '#55AD66'
export const PG10T = '#66B575'
export const PG20T = '#77BD84'
export const PG30T = '#88C593'
export const PG40T = '#99CDA3'
export const PG50T = '#AAD6B2'
export const PG60T = '#BBDEC1'
export const PG70T = '#CCE6D1'
export const PG80T = '#DDEEE0'
export const PG90T = '#EEF6EF'

// Primary Blacks
export const PB = '#000000'
export const PB10T = '#191919'
export const PB20T = '#333333'
export const PB30T = '#4C4C4C'
export const PB40T = '#666666'
export const PB50T = '#7F7F7F'
export const PB60T = '#999999'
export const PB70T = '#B2B2B2'
export const PB80T = '#CCCCCC'
export const PB90T = '#E5E5E5'
export const PB97T = '#F7F7F7'
export const DARK_MODE_FIELD = '#3B3B3B'

// Secondary Greens
export const SG90S = '#0D1300'
export const SG80S = '#1A2600'
export const SG70S = '#263800'
export const SG60S = '#334B00'
export const SG50S = '#405E00'
export const SG40S = '#4D7100'
export const SG30S = '#5A8400'
export const SG20S = '#669600'
export const SG10S = '#73A900'
export const SG = '#80BC00'
export const SG10T = '#8CC219'
export const SG20T = '#99C933'
export const SG30T = '#A6D04C'
export const SG40T = '#B2D666'
export const SG50T = '#BFDD7F'
export const SG60T = '#CCE499'
export const SG70T = '#D8EAB2'
export const SG80T = '#E5F1CC'
export const SG90T = '#F2F8E5'

// Secondary Light Blues
export const SLB90S = '#031016'
export const SLB80S = '#06212D'
export const SLB70S = '#093243'
export const SLB60S = '#0C425A'
export const SLB50S = '#0F5370'
export const SLB40S = '#116386'
export const SLB30S = '#14739D'
export const SLB20S = '#1784B3'
export const SLB10S = '#1a95ca'
export const SLB = '#1DA7E0'
export const SLB10T = '#33AEE3'
export const SLB20T = '#4AB7E6'
export const SLB30T = '#60C0E9'
export const SLB40T = '#77C9EC'
export const SLB50T = '#8ED2EF'
export const SLB60T = '#A4DBF2'
export const SLB70T = '#BBE4F5'
export const SLB80T = '#D1EDF8'
export const SLB90T = '#E8F6FB'

// Secondary Yellows
export const SY90S = '#191401'
export const SY80S = '#332702'
export const SY70S = '#4C3B03'
export const SY60S = '#654E04'
export const SY50S = '#7F6205'
export const SY40S = '#987605'
export const SY30S = '#B18906'
export const SY20S = '#CA9D07'
export const SY10S = '#E4B008'
export const SY = '#FDC409'
export const SY10T = '#FDC921'
export const SY20T = '#FDCF3A'
export const SY30T = '#FDD552'
export const SY40T = '#FDDB6B'
export const SY50T = '#FEE184'
export const SY60T = '#FEE79C'
export const SY70T = '#FEEDB5'
export const SY80T = '#FEF3CD'
export const SY90T = '#FEF9E6'

// Secondary Oranges
export const SO90S = '#190D00'
export const SO80S = '#331A00'
export const SO70S = '#4d2800'
export const SO60S = '#663500'
export const SO50S = '#804200'
export const SO40S = '#994F00'
export const SO30S = '#B35C00'
export const SO20S = '#CC6A00'
export const SO10S = '#E67700'
export const SO = '#FF8400'
export const SO10T = '#FF9019'
export const SO20T = '#FF9C33'
export const SO30T = '#FFA84C'
export const SO40T = '#FFB566'
export const SO50T = '#FFC17F'
export const SO60T = '#FFCD99'
export const SO70T = '#FFDAB2'
export const SO80T = '#FFE6CC'
export const SO90T = '#FFF2E5'

// Secondary Light Reds
export const SLR90S = '#150404'
export const SLR80S = '#2B0809'
export const SLR70S = '#410C0E'
export const SLR60S = '#561012'
export const SLR50S = '#6C1417'
export const SLR40S = '#81181B'
export const SLR30S = '#971C1F'
export const SLR20S = '#AC2024'
export const SLR10S = '#C22429'
export const SLR = '#D7282F'
export const SLR10T = '#DB3D42'
export const SLR20T = '#DF5357'
export const SLR30T = '#E3686C'
export const SLR40T = '#E77E81'
export const SLR50T = '#EB9396'
export const SLR60T = '#EFA9AB'
export const SLR70T = '#F3BEC0'
export const SLR80T = '#F7D4D5'
export const SLR90T = '#FBE9EA'

// Secondary Purples
export const SP90S = '#0A0509'
export const SP80S = '#150A11'
export const SP70S = '#200F1A'
export const SP60S = '#2A1423'
export const SP50S = '#351A2C'
export const SP40S = '#3F1F34'
export const SP30S = '#4A243D'
export const SP20S = '#542946'
export const SP10S = '#5F2E4E'
export const SP = '#693357'
export const SP10T = '#784768'
export const SP20T = '#875C79'
export const SP30T = '#967089'
export const SP40T = '#A5859A'
export const SP50T = '#B499AB'
export const SP60T = '#C3ADBC'
export const SP70T = '#D2C2CD'
export const SP80T = '#E1D6DD'
export const SP90T = '#F0EBEE'

// Seconary Dark Reds
export const SDR90S = '#0F0505'
export const SDR80S = '#1D0A0B'
export const SDR70S = '#2C0F10'
export const SDR60S = '#3B1416'
export const SDR50S = '#4A1A1B'
export const SDR40S = '#581F20'
export const SDR30S = '#672426'
export const SDR20S = '#76292B'
export const SDR10S = '#842E31'
export const SDR = '#933336'
export const SDR10T = '#9E474A'
export const SDR20T = '#A95C5E'
export const SDR30T = '#B37072'
export const SDR40T = '#BE8586'
export const SDR50T = '#C9999B'
export const SDR60T = '#D4ADAF'
export const SDR70T = '#DFC2C3'
export const SDR80T = '#E9D6D7'
export const SDR90T = '#F4EBEB'

// Secondary Pinks
export const SPK90S = '#15050E'
export const SPK80S = '#2A091C'
export const SPK70S = '#3E0E29'
export const SPK60S = '#531337'
export const SPK50S = '#681845'
export const SPK40S = '#7D1C53'
export const SPK30S = '#922161'
export const SPK20S = '#A6266E'
export const SPK10S = '#BB2A7C'
export const SPK = '#D02F89'
export const SPK10T = '#D54496'
export const SPK20T = '#D959A1'
export const SPK30T = '#DE6DAD'
export const SPK40T = '#E382B9'
export const SPK50T = '#E897C5'
export const SPK60T = '#ECACD0'
export const SPK70T = '#F1C1DC'
export const SPK80T = '#F6D5E8'
export const SPK90T = '#FAEAF3'

// Secondary Dark Blues
export const SDB90S = '#04090D'
export const SDB80S = '#08121B'
export const SDB70S = '#0B1B29'
export const SDB60S = '#0F2436'
export const SDB50S = '#132D44'
export const SDB40S = '#173651'
export const SDB30S = '#1B3F5F'
export const SDB20S = '#1E486C'
export const SDB10S = '#22517A'
export const SDB = '#265A87'
export const SDB10T = '#3C6B93'
export const SDB20T = '#517B9F'
export const SDB30T = '#678CAB'
export const SDB40T = '#7D9CB7'
export const SDB50T = '#93ADC3'
export const SDB60T = '#A8BDCF'
export const SDB70T = '#BECEDB'
export const SDB80T = '#D4DEE7'
export const SDB90T = '#E9EFF3'

// Miscellaneous
export const WHITE = '#FFFFFF'
export const BLACK = '#000000'
export const BODY = PB97T
