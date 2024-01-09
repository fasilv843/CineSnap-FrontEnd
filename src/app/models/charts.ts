export interface IChartDataset {
  label: string
  data: number[]
  fill: boolean
  borderColor: string
  tension: number
}

export interface ILineGraphData {
  labels: string []
  datasets: IChartDataset []
}

export interface IRevenueData {
  labels: string[]
  data: number[]
}
