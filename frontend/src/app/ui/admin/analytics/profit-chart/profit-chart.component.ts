import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input, OnChanges,
  OnInit, SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
//import {
//  ApexAxisChartSeries,
//  ApexChart,
//  ChartComponent,
//  ApexDataLabels,
//  ApexPlotOptions,
//  ApexYAxis,
//  ApexLegend,
//  ApexStroke,
//  ApexXAxis,
//  ApexFill,
//  ApexTooltip
//} from "ng-apexcharts";
//
//export type ChartOptions = {
//  series: ApexAxisChartSeries;
//  chart: ApexChart;
//  dataLabels: ApexDataLabels;
//  plotOptions: ApexPlotOptions;
//  yaxis: ApexYAxis;
//  xaxis: ApexXAxis;
//  fill: ApexFill;
//  tooltip: ApexTooltip;
//  stroke: ApexStroke;
//  legend: ApexLegend;
//};



@Component({
  selector: "profit-chart",
  templateUrl: "./profit-chart.component.html",
  styleUrls: ["./profit-chart.component.scss"]
})
export class ProfitChartComponent implements OnInit,AfterViewInit, OnChanges {
  @Input() currentYearProfit: number[];
//  series: ApexAxisChartSeries;
//  @ViewChild(ChartComponent) chart: ChartComponent;
//  public chartOptions: Partial<ChartOptions> | null = null;

  constructor() {
    // @ts-ignore
//    this.chartOptions = {
//      chart: {
//        type: "bar",
//        height: 350
//      },
//      plotOptions: {
//        bar: {
//          horizontal: false,
//          columnWidth: "55%",
//          borderRadius: 4,
//        }
//      },
//      dataLabels: {
//        enabled: false
//      },
//      stroke: {
//        show: true,
//        width: 2,
//        colors: ["#F9C52F"]
//      },
//      xaxis: {
//        categories: [
//          "Jan",
//          "Feb",
//          "Mar",
//          "Apr",
//          "May",
//          "Jun",
//          "Jul",
//          "Aug",
//          "Sep",
//          "Oct",
//          "Nov",
//          "Dec"
//        ]
//      },
//      yaxis: {
//        title: {
//          text: "Profit"
//        }
//      },
//      fill: {
//        opacity: 1,
//        colors: ['#F9C52F', '#F9C52F', '#F9C52F']
//      },
//      tooltip: {
//        y: {
//          formatter: function(val:any) {
//            return "Rs. "+val;
//          }
//        }
//      }
//    };
  }

  ngAfterViewInit(){
    setTimeout(() => {
//      this.series = [{
//        name: 'Profit',
//        color: "#F9C52F",
//        data: this.currentYearProfit
//      }];
      // this.chart.autoUpdateSeries = true;

    }, 0);
  }

  updateSeries() {
//    this.series = [{
//      name: 'Profit',
//      color: "#F9C52F",
//      data: this.currentYearProfit
//    }];
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
//    if (changes["currentYearsOrders"]) {
//      this.updateSeries();
//    }
  }

}
