import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

function BarChart() {
    const [workingHours, setWorkingHours] = useState({ 
        series: [
          {
            name: 'Actual',
            data: [
                {
                x: 'January',
                y: 100,
                goals: [{name: 'Expected',
                        value: 80,
                        strokeHeight: 5,
                        strokeColor: '#775DD0'}]
                },
                {
                x: 'Febuary',
                y: 160,
                goals: [{name: 'Expected',
                        value: 140,
                        strokeHeight: 5,
                        strokeColor: '#775DD0'}]
                },
                {
                x: 'March',
                y: 165,
                goals: [{name: 'Expected',
                        value: 150,
                        strokeHeight: 5,
                        strokeColor: '#775DD0'}]
                },
                {
                x: 'April',
                y: 140,
                goals: [{name: 'Expected',
                        value: 100,
                        strokeHeight: 5,
                        strokeColor: '#775DD0'}]
                },
                {
                x: 'May',
                y: 40,
                goals: [{name: 'Expected',
                        value: 60,
                        strokeHeight: 5,
                        strokeColor: '#775DD0'}]
                },
                {
                x: 'June',
                y: 30,
                goals: [{name: 'Expected',
                        value: 10,
                        strokeHeight: 5,
                        strokeColor: '#775DD0'}]
                },
                {
                x: 'July',
                y: 145,
                goals: [{name: 'Expected',
                        value: 160,
                        strokeHeight: 5,
                        strokeColor: '#775DD0'}]
                },
                {
                x: 'August',
                y: 150,
                goals: [{name: 'Expected',
                        value: 130,
                        strokeHeight: 5,
                        strokeColor: '#775DD0'}]
                },
                {
                x: 'September',
                y: 200,
                goals: [{name: 'Expected',
                        value: 180,
                        strokeHeight: 5,
                        strokeColor: '#775DD0'}]
                },
                {
                x: 'October',
                y: 190,
                goals: [{name: 'Expected',
                        value: 200,
                        strokeHeight: 5,
                        strokeColor: '#775DD0'}]
                },
                {
                x: 'November',
                y: 220,
                goals: [{name: 'Expected',
                        value: 200,
                        strokeHeight: 5,
                        strokeColor: '#775DD0'}]
                },
                {
                x: 'December',
                y: 150,
                goals: [{name: 'Expected',
                        value: 140,
                        strokeHeight: 5,
                        strokeColor: '#775DD0'}]
                },
            ]
        }
    ],
        options: {
          chart: {height: 350, type: 'bar'},
          plotOptions: {bar: {columnWidth: '50%'}},
          colors: ['#00E396'],
          dataLabels: {enabled: false},
          legend: {show: true,
            showForSingleSeries: true,
            customLegendItems: ['Worked Hours', 'Expected Hours'],
            markers: {fillColors: ['#00E396', '#775DD0']}
          }
        },
      
    });

    return (
        <div className='App'>
            <div className='row'></div>
            <div id="chart">
                <ReactApexChart 
                    options={workingHours.options} 
                    series={workingHours.series} 
                    type="bar" 
                    height={600} 
                />
            </div>
        </div>

    );
  }
  
  export default BarChart;
  
  