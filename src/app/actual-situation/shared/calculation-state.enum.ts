export enum CalculationState {
  Orig = 'orig', // original measured data
  Fill = 'fill', // complet data replace
  Postp = 'postp', // postprocesing calculation
  Manu = 'manu' // manual data correction (disabled save change with loading)
}
