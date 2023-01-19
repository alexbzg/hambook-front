export const BANDS = Object.freeze({
    '160M': {
        limits: [1800, 2000]
    },
    '80M': {
        limits: [3500, 4000]
    },
    '40M': {
        limits: [7000, 7300]
    },
    '30M': {
        limits: [10000, 10150]
    },
    '20M': {
        limits: [14000, 14350]
    },
    '17M': {
        limits: [18068, 18168]
    },
    '15M': {
        limits: [21000, 21450]
    },
    '12M': {
        limits: [24890, 24990]
    },
    '10M': {
        limits: [28000, 29700]
    }
})

export const QSO_MODES = Object.freeze({
    'CW': {
        rst: 599
    },
    'SSB': {
        rst: 59
    },
    'FT4': {
        rst: -10,
        defFreqs: {
            '160M': 1800,
            '80M': 3575,
            '40M': 7047.5,
            '30M': 10140,
            '20M': 14080,
            '17M': 18104,
            '15M': 21140,
            '12M': 24919,
            '10M': 28180,
        }
    },
    'FT8': {
        rst: -10,
        defFreqs: {
            '160M': 1840,
            '80M': 3573,
            '40M': 7074,
            '30M': 10136,
            '20M': 14074,
            '17M': 18100,
            '15M': 21074,
            '12M': 24915,
            '10M': 28076,
        }
    }
})

export function stripCallsign(value) {
  return value.match(/\d*[A-Za-z]+\d+[A-Za-z]+/)?.[0]
}

