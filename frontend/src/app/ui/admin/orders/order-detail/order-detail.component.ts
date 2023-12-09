import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {IOrder, IOrderProduct, IOrderWithProducts} from "../../../../interfaces/i-order";
import {OrderService} from "../../../../services/order/order.service";
import { HttpClient } from '@angular/common/http';
//
// declare var require: any;
// import * as pdfMake from "pdfmake/build/pdfmake";
// import * as pdfFonts from "pdfmake/build/vfs_fonts";
// import * as jsPDF from "jspdf";
// import html2canvas, {Options} from "html2canvas";
// const htmlToPdfmake = require("html-to-pdfmake");
// (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  encapsulation  : ViewEncapsulation.None,
})
export class OrderDetailComponent implements OnInit {
  @ViewChild('invoice') invoiceElement : ElementRef;
  @ViewChild('invoiceLogo') invoiceLogoElement : ElementRef;

  order: IOrderWithProducts;
  // products: IOrderProduct[] = [];
  constructor(
    private orderService: OrderService,
    public activatedRoute: ActivatedRoute,
    private http: HttpClient
  ) {
    this.handleParameters();
  }



  ngOnInit() {
    this.http.get('/assets/images/logo/R-Logo.png', { responseType: 'blob' })
      .subscribe(res => {
        const reader = new FileReader();
        reader.onloadend = () => {
          var base64data = reader.result;
          console.log(base64data);
        }

        reader.readAsDataURL(res);
        reader.onload = (_event) => {
          this.invoiceLogoElement.nativeElement.src = reader.result!;
        }
        console.log(res);
      });
  }

  private handleParameters() {
    this.activatedRoute.paramMap.subscribe(async (params) => {
      const orderId =  params.get('id')!;
      if(history.state.hasOwnProperty('order')) {
        this.order = {
          ...history.state.order,
          products: [],
        }
        this.order = history.state.order;
      }
      // get the products of the order
      (await this.orderService.getOrderDetail(orderId)).subscribe(order => {
        this.order = order;

      });

    });
  }

  printInvoice() {
    window.print();
  }

  // downloadInvoice(){
  //   html2canvas(this.invoiceElement.nativeElement).then(canvas => {
  //     const imgData = canvas.toDataURL('image/png');
  //     console.log(imgData);
  //     const pdf = new jsPDF.jsPDF('p', 'mm', 'a4');
  //     pdf.addImage(imgData, 'JPEG', 0, 0, 211, 298);
  //     pdf.save('invoice.pdf');
  //   });
  //   // const invoice = this.invoiceElement.nativeElement;
  //   // // let html = htmlToPdfmake(invoice.innerHTML);
  //   // // const documentDefinition = { content: html };
  //   // // pdfMake.createPdf(documentDefinition).download();
  //   // let doc = new jsPDF.jsPDF();
  //   // doc.html(invoice, {
  //   //   callback: (doc) => {
  //   //     doc.save('invoice.pdf');
  //   //   }
  //   // });
  // }

}
