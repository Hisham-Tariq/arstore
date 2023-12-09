import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, Input, OnChanges, SimpleChanges} from "@angular/core";
//import {
//  ApexAxisChartSeries,
//  ApexChart,
//  ChartComponent,
//  ApexDataLabels,
//  ApexXAxis,
//  ApexPlotOptions, ApexYAxis, ApexFill, ApexTooltip, ApexStroke, ApexLegend
//} from "ng-apexcharts";

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
  selector: 'orders-chart',
  templateUrl: './orders-chart.component.html',
  styleUrls: ['./orders-chart.component.scss'],
})
export class OrdersChartComponent implements OnInit,AfterViewInit, OnChanges {
  @Input() currentYearsOrders: number[];
//  series: ApexAxisChartSeries;
//  @ViewChild(ChartComponent) chart: ChartComponent;
//  public chartOptions: Partial<ChartOptions> | null = null;

  constructor() {
//    this.chartOptions = {
//      fill: {
//        opacity: 1,
//        colors: ['#F9C52F', '#F9C52F', '#F9C52F']
//      },
//      chart: {
//        type: "bar",
//        height: 350,
//      },
//      plotOptions: {
//        bar: {
//          horizontal: true
//        }
//      },
//      dataLabels: {
//        enabled: false
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
//      }
//    }
  }

  ngAfterViewInit(){
    setTimeout(() => {
//      this.series = [{
//        name: 'customers',
//        color: "#F9C52F",
//        data: this.currentYearsOrders
//      }];
      // this.chart.autoUpdateSeries = true;

    }, 0);
  }

  updateSeries() {
//    this.series = [{
//      name: 'orders',
//      color: "#F9C52F",
//      data: this.currentYearsOrders
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
