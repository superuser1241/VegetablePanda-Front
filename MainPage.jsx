import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    BarController,
    LineController
} from 'chart.js';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    BarController,
    LineController
);

const weeklyChartData = {
    labels: weeklyStats.map(item => {
        const date = new Date(item.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
        {
            type: 'bar',
            label: '일별 판매금액',
            data: weeklyStats.map(item => item.totalAmount),
            // ... 나머지 스타일 속성들
        },
        {
            type: 'line',
            label: '일별 판매수량',
            data: weeklyStats.map(item => item.totalQuantity),
            // ... 나머지 스타일 속성들
        }
    ]
};

<Chart 
    type="bar"
    data={weeklyChartData} 
    options={weeklyChartOptions}
/> 