import { erstelleLineChartAusDatei } from './LineChart.js';
import { erstelleBarchartAusDatei } from './BarChart.js';

await erstelleBarchartAusDatei('stackedBarChart', 'line_data.json');
await erstelleLineChartAusDatei('lineChart', 'line_data.json');