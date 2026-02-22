import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MaintenanceRequestsService } from 'app/services/maintenance-requests.service';
import * as Chartist from 'chartist';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  MaintenanceIntroCounts: any;
  MonthlyIntroCounts: any;
  today: Date = new Date();

  constructor(private requests: MaintenanceRequestsService, private titleService: Title) { }


  startAnimationForLineChart(chart) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;

    chart.on('draw', function (data) {
      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        // Display the point's Y value as a label
        const label = data.value.y.toString(); // Customize the label as needed
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });

        // Add the label as a text element to the chart
        data.group.elem('text', {
          x: data.x,
          y: data.y - 10, // Adjust the Y position to display above the point
          dx: 4, // Adjust horizontal position
          'text-anchor': 'middle' // Text alignment
        }, 'ct-label').text(label);
      }
    });

    seq = 0;
  }

  ngOnInit() {
    // to change the tab Title name .
    this.titleService.setTitle('الصفحة الرئيسية');


    this.GetMaintenanceIntroCounts();

    this.GetMonthlyIntroCounts().subscribe((data) => {
      if (data) {
        this.MonthlyIntroCounts = data;

        const labels = this.MonthlyIntroCounts.map((item) => item.month);
        const series = this.MonthlyIntroCounts.map((item) => item.intro_count);

        // Add a zero value at the beginning of the series
        series.unshift(0);

        const chartData = {
          labels,
          series: [series],
        };

        const optionsmonthlyIntroChart: any = {
          lineSmooth: Chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: Math.max(...series) + 1, // Set high value based on the maximum value in series
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
        };

        var monthlyIntroChart = new Chartist.Line('#monthlyIntroChart', chartData, optionsmonthlyIntroChart);

        this.startAnimationForLineChart(monthlyIntroChart);
      }
    });
  }


  GetMaintenanceIntroCounts() {
    this.requests.GetMaintenanceIntroCounts().subscribe((data) => {
      if (data) {
        this.MaintenanceIntroCounts = data;
      }
    });
  }

  GetMonthlyIntroCounts() {
    return this.requests.GetMonthlyIntroCounts();
  }



}
