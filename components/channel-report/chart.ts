import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Colors,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js"

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  Colors,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
)

export default Chart
