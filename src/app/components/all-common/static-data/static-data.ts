export interface StaticData {
  key: string;
  value: string;
}

export interface NumericStaticData {
  key: string;
  value: number;
}

export interface NumericKeyStaticData {
  key: number;
  value: string;
}

export interface BooleanStaticData {
  key: boolean;
  value: string;
}

export const DATA_TYPES: StaticData[] = [
  {key: 'BINARY', value: 'Binary'},
  {key: 'MULTISTATE', value: 'Multistate'},
  {key: 'NUMERIC', value: 'Numeric'},
  {key: 'ALPHANUMERIC', value: 'Alphanumeric'},
];

export const TIME_PERIOD_TYPES: StaticData[] = [
  {key: 'Milliseconds', value: 'MILLISECONDS'},
  {key: 'Seconds', value: 'SECONDS'},
  {key: 'Minutes', value: 'MINUTES'},
  {key: 'Hours', value: 'HOURS'},
  {key: 'Days', value: 'DAYS'},
  {key: 'Weeks', value: 'WEEKS'},
  {key: 'Months', value: 'MONTHS'},
  {key: 'Years', value: 'YEARS'},
];

export const BAUD_RATES: NumericStaticData[] = [
  {key: '1', value: 110},
  {key: '2', value: 300},
  {key: '3', value: 1200},
  {key: '4', value: 2400},
  {key: '5', value: 4800},
  {key: '6', value: 9600},
  {key: '7', value: 19200},
  {key: '8', value: 38400},
  {key: '9', value: 57600},
  {key: '10', value: 115200},
  {key: '11', value: 230400},
  {key: '12', value: 460800},
  {key: '13', value: 921600},
];

export const COMMENT_TYPES: StaticData[] = [
  {key: 'Point', value: 'POINT'},
  {key: 'Event', value: 'EVENT'},
  {key: 'Json Data', value: 'JSON_DATA'}
];
