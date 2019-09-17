export class CountedStats {
  detectionCount = 0;
  directionUniformity = '';
  actualTemperature = 0;
  avgTemperature = 0;
  detectionDir0Count = 0;
  detectionDir1Count = 0;
  velocityAvg = 0;
  time?: string;
  humidity = 0;

  constructor(fields?: CountedStats) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
