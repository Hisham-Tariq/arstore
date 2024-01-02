import {Component, OnInit} from '@angular/core';
import {reflectionAnimations} from "../../../../animations";
import {ReflectionAlertType} from "../../../../components/alert";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Product} from "../../../../interfaces";
import {IStock} from "../../../../interfaces/i-stock";
import {ProductService} from "../../../../services/Product/product.service";
import {StockService} from "../../../../services/Stock/stock.service";

function toDateInputValue() {
  let local = new Date();
  return local.toJSON().slice(0,10);
}

@Component({
  selector: 'app-manage-stock',
  templateUrl: './manage-stock.component.html',
  styleUrls: ['./manage-stock.component.scss'],
  animations: reflectionAnimations,
})
export class ManageStockComponent implements OnInit {

  alert: { type: ReflectionAlertType; message: string } = {
    type: 'success',
    message: 'Successfully Added the Stock',
  };
  showAlert: boolean = false;
  currentProductColors: string[] = [];
  existingStockId: string = "";
  itemSelectedForDelete: any | null

  allProducts: Product[] = [];
  allStocks: IStock[] = [];

  form : FormGroup

  // generate form controls gette
  get product() {
    return this.form.get('product');
  }

  get color() {
    return this.form.get('color');
  }

  get consumerPrice() {
    return this.form.get('consumerPrice');
  }

  get retailerPrice() {
    return this.form.get('retailerPrice');
  }

  get remainingQuantity() {
    return this.form.get('remainingQuantity');
  }

  get newQuantity() {
    return this.form.get('newQuantity');
  }

  get totalQuantity() {
    return this.form.get('totalQuantity');
  }

  get date() {
    return this.form.get('date');
  }

  constructor(
    private fb: FormBuilder,
    private manageStockService: StockService,
    private productService: ProductService,
  ) {
    this.form = this.fb.group({
      product: [null, Validators.required],
      color: [null, Validators.required],
      consumerPrice: [0, [Validators.required, Validators.min(0)]],
      retailerPrice: [0, [Validators.required, Validators.min(0)]],
      remainingQuantity: [0, [Validators.required, Validators.min(0)]],
      newQuantity: [0, [Validators.required, Validators.min(0)]],
      totalQuantity: [0, [Validators.required, Validators.min(0)]],
      date: [toDateInputValue(), Validators.required],
    });
    this.productService.data.subscribe(data => {
      // filter all the active products
      this.allProducts = data.filter(product => product.status === 'active');
    });
    this.manageStockService.observableData.subscribe(data => {
      this.allStocks = data;
    });
  }


  ngAfterViewInit(): void {

  }


  save() {
    if (this.form.valid) {
      const item: IStock = {
        ...this.form.value,
        previousQuantity: this.form.value.remainingQuantity,
      };
      if(this.existingStockId === ""){
        this.addStock(item);
      } else {
        item.id = this.existingStockId;
        this.updateStock(item);
      }
    } else {
      this.showAlertOfWith('error', 'Please fill all the required fields');
    }
  }


  private addStock(item: IStock){
    this.manageStockService.add(item).then(() => {
      this.showAlertOfWith('success', 'Successfully Added the Stock');
    })
  }

  private updateStock(item: IStock){
    this.manageStockService.update(item).then(() => {
      this.showAlertOfWith('success', 'Successfully Updated the Stock');
    })
  }


  showAlertOfWith(type: ReflectionAlertType, message: string, withTimeout: boolean = true) {
    this.alert.type = type;
    this.alert.message = message;
    this.showAlert = true;
    if (withTimeout) {
      this.startAlertTimeout();
    }
  }

  startAlertTimeout(time: number = 5000) {
    setTimeout(() => {
      this.showAlert = false;
    }, time);
  }

  onProductSelect() {
    // get the product from products by product id
    const product = this.allProducts.find(value => value.id === this.product?.value);
    this.currentProductColors = [];
    this.color?.reset()
    this.remainingQuantity?.setValue(0);
    this.onQuantityChange();
    this.existingStockId = "";
    if (typeof product !== "undefined") this.currentProductColors = product.colors;
  }

  onColorSelect() {
    if (this.color?.value == "" || this.color?.value == null) return;
    const stock = this.allStocks.find(value => value.product === this.product?.value && value.color === this.color?.value);
    if(typeof stock !== "undefined") {
      this.existingStockId = stock.id ?? "";
      this.remainingQuantity?.setValue(stock.totalQuantity);
      this.consumerPrice?.setValue(stock.consumerPrice);
      this.retailerPrice?.setValue(stock.retailerPrice);
    } else {
      this.existingStockId = "";
      this.remainingQuantity?.setValue(0);
      this.consumerPrice?.setValue(0);
      this.retailerPrice?.setValue(0);
    }
    this.onQuantityChange();
  }

  ngOnInit(): void {
  }

  onQuantityChange() {
    this.totalQuantity?.setValue(parseInt(this.remainingQuantity?.value) + parseInt(this.newQuantity?.value));
  }
}



