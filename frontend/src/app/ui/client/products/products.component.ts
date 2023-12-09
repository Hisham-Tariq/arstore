import {Component, OnInit} from '@angular/core';
import {ProductItem} from "../../../interfaces";
import {ProductService} from '../../../services/Product/product.service';
import {StockService} from "../../../services/Stock/stock.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MainCategoryService} from "../../../services/MainCategory/main-category.service";
import {SubCategoryService} from "../../../services/SubCategory/sub-category.service";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {FormGroup, FormBuilder} from "@angular/forms";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: ProductItem[] = [];
  itemsPerPageOptions: number[] = [10, 25, 50];
  filteredProducts: ProductItem[];
  productCategory = "all"
  priceSort: "asc" | "desc" = "asc";
  sortBy: "price" | "name" | "newest" | "oldest" | "popular" = "newest";
  itemsPerPage = 12;
  currentPage = 1;
  maxPage = 0;
  form: FormGroup;
  categories = {
    "glasses": true,
    "lenses": true
  }


  constructor(
    private productsService: ProductService,
    private stocksService: StockService,
    private activatedRoute: ActivatedRoute,
    private mainCategoryService: MainCategoryService,
    private subCategoryService: SubCategoryService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {
    this.form = this.formBuilder.group({
      maxPrice: [999999],
      minPrice: [0],
      lenses: [false],
      glasses: [false],
      female: [false],
      male: [false],
    })
    this.handleQueryParam()
    this.fetchProducts();

  }

  get isCategoryAll() {
    return (this.form.get('glasses')!.value && this.form.get('lenses')!.value) || (!this.form.get('glasses')!.value && !this.form.get('lenses')!.value)
  }

  get isCategoryGlasses() {
    return this.form.get('glasses')!.value
  }

  get isCategoryLenses() {
    return this.form.get('lenses')!.value
  }


  get getCurrentPageIndexes(): number[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    let currentRange = this.range(startIndex, endIndex);
    // filter all which are not in the range of filtered products length
    return currentRange.filter(index => this.filteredProducts.length > index);
  }

  handleQueryParam() {
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.productCategory = params.get("category") || "all";
      let isLenses = this.productCategory == "lenses" || this.productCategory == "all";
      let isGlasses = this.productCategory == "glasses" || this.productCategory == "all";
      this.form.get("lenses")!.setValue(isLenses);
      this.form.get("glasses")!.setValue(isGlasses);
      this.applyFilter();
    });
  }

  fetchProducts() {
    this.productsService.getAllProductsDetails.pipe(
      map(products => {
        return products.filter(product => product.status == 'active');
      })
    ).subscribe(value => {
      this.products = value;
      // calculate total pages
      this.applyFilter();
    })
  }

  applyFilter() {
    let data = this.products;
    if (this.searchKey != '' && this.searchKey != null && typeof this.searchKey != 'undefined') {
      data = data.filter(product => product.name.toLowerCase().includes(this.searchKey.toLowerCase()))
    }
    if (this.isCategoryAll) {
      this.productCategory = 'all';
    } else {
      this.productCategory = this.isCategoryGlasses ? "glasses" : "lenses";
    }
    if (this.productCategory !== 'all') {
      data = data.filter(value => value.mainCategoryDetail.name.toLowerCase().includes(this.productCategory));
    }
    // filter by gender
    const isMale = this.form.get('male')?.value;
    const isFemale = this.form.get('female')?.value;
    if (isMale && !isFemale) {
      data = data.filter(value => value.gender == 'Male' || value.gender == 'Both');
    }
    if(!isMale && isFemale){
      data = data.filter(value => value.gender == 'Female' || value.gender == 'Both');
    }

    // filter by price
    const maxPrice = this.form.get('maxPrice')!.value;
    const minPrice = this.form.get('minPrice')!.value;

    data = data.filter(value => {
      let lowerPrice = value.stock[value.colors[0]].retailerPrice;
      lowerPrice = lowerPrice - ((value.discount * lowerPrice) / 100);
      let higherPrice = value.stock[value.colors[value.colors.length - 1]].retailerPrice;
      higherPrice = higherPrice - ((value.discount * higherPrice) / 100);
      let lowestPriceResult = lowerPrice >= minPrice && lowerPrice <= maxPrice
      let highestPriceResult = higherPrice >= minPrice && higherPrice <= maxPrice
      return lowestPriceResult || highestPriceResult
    });
    this.filteredProducts = data;
    this.applySorting();
    this.maxPage = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  getFirstColorPrice(a: ProductItem) {
    return a.stock[a.colors[0]].retailerPrice;
  }

  applySorting() {
    if (this.sortBy == "price") {
      this.filteredProducts = this.sortByPrice(this.filteredProducts);
    } else if (this.sortBy == "newest") {
      this.filteredProducts = this.sortByDate(this.filteredProducts, 'desc');
    } else if (this.sortBy == "oldest") {
      this.filteredProducts = this.sortByDate(this.filteredProducts, 'asc');
    } else if (this.sortBy == "popular") {
      this.filteredProducts = this.sortByPopularity(this.filteredProducts);
    }
  }

  sortByDate(items: ProductItem[], order: 'asc' | 'desc' = 'desc'): ProductItem[] {
    return items.sort((a, b) => {
      return order == 'asc' ? a.createdAt!.getTime() - b.createdAt!.getTime() : b.createdAt!.getTime() - a.createdAt!.getTime();
    });
  }

  sortByPrice(items: ProductItem[]): ProductItem[] {
    return items.sort((a, b) => {
      const itemAPrice = this.getFirstColorPrice(a);
      const itemBPrice = this.getFirstColorPrice(b);
      if (itemAPrice < itemBPrice) {
        if (this.priceSort == "desc") {
          return 1
        } else {
          return -1;
        }
      } else if (itemAPrice == itemBPrice) return 0;
      else {
        if (this.priceSort == "asc") {
          return 1
        } else {
          return -1;
        }
      }
    })
  }

  // sort the products based on the views
  sortByPopularity(item: ProductItem[]) {
    return item.sort((a, b) => {
      return b.views - a.views;
    })
  }

  ngOnInit(): void {
  }

  categorySelectionChange($event: MatCheckboxChange) {
    if ($event.checked) {
      this.productCategory = $event.source.value;
    } else {
      this.productCategory = "all";
    }
    console.log("categorySelectionChange", $event.checked, $event.source.value, $event.source.id);
  }

  range(start: number, stop: number, step = 1) {
    return Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)
  }

  // total pages 10
  // if current page is among 1,2,3 then show prev 1 2 3 4 5 next
  // if current page is 4 then show prev 2 3 4 5 6 next
  // if current page is among last 3 pages then show prev 5 6 7 8 10 next(disable)
  searchKey: string;

  get getPaginationNumbers(): number[] {

    const totalPages = this.maxPage;
    const currentPage = this.currentPage;
    const pageNumbers = [];
    if (currentPage <= 3) {
      pageNumbers.push(1, 2, 3, 4, 5);
    } else if (currentPage >= totalPages - 2) {
      pageNumbers.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pageNumbers.push(currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2);
    }
    // filter all greater than maxPage or less than 1
    return pageNumbers.filter(value => value <= totalPages && value >= 1);
  }

  goToPrev() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  goToNext() {
    if (this.currentPage < this.maxPage) {
      this.currentPage++;
    }
  }


  resetPriceFilter() {
    this.form.get('minPrice')?.setValue(0);
    this.form.get('maxPrice')?.setValue(999999);
  }

  onItemsPerPageChange(value: string) {
    this.itemsPerPage = parseInt(value)
    this.goToPage(1)
  }
}




