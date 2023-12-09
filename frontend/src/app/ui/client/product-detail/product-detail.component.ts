import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductItem} from "../../../interfaces";
import {ProductService} from "../../../services/Product/product.service";
import {StockService} from "../../../services/Stock/stock.service";
import {CartService} from "../../../services/Cart/cart.service";
import {ICartItem} from "../../../interfaces/i-cart-item";
import {GlobalService} from "../../../services/global/global.service";
import {MainCategoryService} from "../../../services/MainCategory/main-category.service";
import {SubCategoryService} from "../../../services/SubCategory/sub-category.service";
import {TryOnProductComponent} from "../../modals/try-on-product/try-on-product.component";
import {AuthService} from "../../../services/Authentication";
import {Auth} from "@angular/fire/auth";
import {ReviewSectionComponent} from "./review-section/review-section.component";
import {ReflectionNavigationService} from "../../../services/ReflectionNavigation";
import {StateChange} from "ng-lazyload-image";

// import {VideoCapture} from 'camera-capture'

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, AfterViewInit {
  @ViewChild("productPrice") productPriceView: any;
  @ViewChild("productName") productNameView: any;
  @ViewChild("productDescription") productDescriptionView: any;
  @ViewChild("addedInCartMessage") addedInCartMessage: any;
  @ViewChild('eligibleToAddToCartModal') notEligibleModel: any;
  @ViewChild('eligibleModalMessage') eligibleModalMessage: any;
  @ViewChild(ReviewSectionComponent) reviewSectionComponent: ReviewSectionComponent;

  product: ProductItem;
  currentProductColors: string[] = []
  selectedColor: string = "";
  imagesKey: string[] = [
    "thumbnail",
    "left",
    "right",
  ];
  currentColorImages: { [key: string]: string } = {
    "thumbnail": "assets/svg/dark-loading-white.svg",
    "left": "assets/svg/dark-loading-white.svg",
    "right": "assets/svg/dark-loading-white.svg",
    "model": "assets/svg/dark-loading-white.svg",
  };
  selectedImageKey: string = "thumbnail";
  isDetailSet = false;
  isUserLoggedIn: boolean = false;
  isUserAdmin: boolean = false;
  isUserVerified: boolean = false;
  productDataFetched: boolean = false;
  currentProductId: string | null = null;

  isAddingInCart = false;
  // width: number = 1920;
  // height: number = 400;
  constraints: MediaTrackConstraints = {
    frameRate: 120,
    width: 99999,
    height: 1000,
  };
  quantity: number = 1;
  isShowingNotEligibleModal: boolean = false;


  constructor(
    public dialog: MatDialog,
    private _dialog: MatDialog,
    private router: Router,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private stockService: StockService,
    private cartService: CartService,
    private globalService: GlobalService,
    private mainCategoryService: MainCategoryService,
    private subCategoryService: SubCategoryService,
    private auth: Auth,
    private navigationService: ReflectionNavigationService,
  ) {
    this.activatedRoute.paramMap.subscribe(params => {
      this.productService.incrementProductView(params.get('pid')!)
      this.currentProductId = params.get('pid')!;
      this.fetchCurrentProduct(params.get('pid')!);
      if (this.isDetailSet) {
        this.isDetailSet = false;
        console.log(typeof this.product === 'undefined' || Object.keys(this.product.stock).length < 1 || this.isDetailSet)
        this.setProductDetail();
        this.reviewSectionComponent.fetchReviews(params.get('pid')!);
      }
    });
    this.authService.isUserLoggedIn.subscribe(data => this.isUserLoggedIn = data);
    this.authService.isUserAdmin.subscribe(data => this.isUserAdmin = data);
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.isUserVerified = user.emailVerified;
      }
    });
  }


  fetchCurrentProduct(productId: string) {
    if (history.state.hasOwnProperty('product')) {
      this.product = history.state.product;
      this.selectedColor = this.product.colors[0];
      this.updateProductColorImages();
      this.currentProductColors = this.product.colors;
      this.productDataFetched = true;
    } else {
      this.productService.getProductById(productId).then(async (product) => {
        let mainCategory = (await this.mainCategoryService.getById(product.data()!.mainCategory)).data()!;
        let subCategory = (await this.subCategoryService.getById(product.data()!.subCategory)).data()!;
        this.product = {
          ...product.data()!,
          stock: {},
          subCategoryDetail: subCategory,
          mainCategoryDetail: mainCategory,
          thumbnail: this.productService.getFirstColorsThumbnail(product.data()!)
        }
        this.stockService.getProductStock(productId).subscribe((stock) => {
          stock.forEach((item) => {
            this.product.stock[item.color] = item;
          });

          let stockColors = Object.keys(this.product.stock);
          for(let color of stockColors){
            if(!this.product.colors.includes(color)){
              delete this.product.stock[color];
            }
          }

          this.product.colors = Object.keys(this.product.stock).sort((a, b) => {
            return this.product.stock[a].retailerPrice - this.product.stock[b].retailerPrice;
          });
          this.setProductDetail();
        });
        this.productDataFetched = true;
      });
    }

  }

  setProductDetail() {
    if (typeof this.product === 'undefined' || Object.keys(this.product.stock).length < 1 || this.isDetailSet) return;
    this.selectedColor = this.product.colors[0];
    this.updateProductColorImages();
    this.currentProductColors = this.product.colors;
    this.productNameView.nativeElement.innerText = this.product.name;
    this.updateProductPrice();
    this.productDescriptionView.nativeElement.innerText = this.product.description;
    this.isDetailSet = true;
  }

  get retailPrice() {
    return this.product.stock[this.selectedColor].retailerPrice;
  }

  get discountedPrice() {
    return this.retailPrice - ((this.retailPrice * this.product.discount) / 100);
  }

  updateProductPrice() {
    if (this.product.discount == 0) {
      this.productPriceView.nativeElement.innerText = 'RS. ' + this.discountedPrice;
    } else {
      this.productPriceView.nativeElement.innerHTML = `<del>RS. ${this.retailPrice}</del> RS. ${this.discountedPrice} `;
    }
  }


  get currentVariantInStock(): number {
    return this.product.stock[this.selectedColor].totalQuantity;
  }

  updateProductColorImages() {
    // @ts-ignore
    this.currentColorImages = this.product.images[this.selectedColor];
    this.selectedImageKey = 'thumbnail';
  }


  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.setProductDetail();
    // this.c.startCapture()
    // this.c.captureFrame().then(f => {
    //   console.log(f)
    // })
  }


  onTryProduct(): void {
    // this.navigationService.navigationData = {
    //   product: this.product,
    //   selectedColor: this.selectedColor,
    // }
    let dialogRef = this._dialog.open(TryOnProductComponent, {
      data: {
        product: this.product,
        selectedColor: this.selectedColor,
        addToCart: (color: string) => {
          dialogRef.close();
          this.selectedColor = color;
          this.addProductToCart()
        }
      }

    });
  }

  changeSelectedColor(color: string): void {
    if (color === this.selectedColor) return;
    this.selectedColor = color;
    this.updateProductPrice();
    this.quantity = 1;
    this.updateProductColorImages();
  }

  changeSelectedImage(key: string) {
    this.selectedImageKey = key;
  }

  incrementQuantity() {
    if (this.quantity < this.currentVariantInStock) {
      this.quantity++;
    } else {
      alert("We don't have enough stock for this product");
    }
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    } else {
      alert("You can't have less than 1 item");
    }
  }

  onQuantityChange() {
    if (this.quantity > this.currentVariantInStock) {
      setTimeout(() => {
        this.quantity = this.currentVariantInStock;
      }, 50);
      alert("We don't have enough stock for this product");
    } else if (this.quantity < 1) {
      setTimeout(() => {
        this.quantity = 1;
      }, 50);
      alert("You can't have less than 1 item");
    }
  }

  addProductToCart() {
    if (!this.isUserLoggedIn) {
      this.showNotEligibleModal("You are not logged in. Login to your account to continue shopping.");
      return;
    } else if (this.isUserLoggedIn && this.isUserAdmin) {
      this.showNotEligibleModal("Admin cannot add product to cart.");
      return;
    } else if (this.isUserLoggedIn && !this.authService.isUserVerified) {
      this.showNotEligibleModal("You are not verified. Please verify your account to continue shopping.");
      return;
    }
    let item = <ICartItem>{
      color: this.selectedColor,
      quantity: this.quantity,
      productId: this.product.id,
      stockId: this.product.stock[this.selectedColor].id,
    };
    this.isAddingInCart = true;
    this.cartService.add(item).then((value) => {
      if (value.status == 400) {
        this.showNotEligibleModal(value.message);
      } else {
        this.globalService.openCartDrawer();
        this.quantity = 1;
      }
      this.isAddingInCart = false;
    });
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  showNotEligibleModal(message: string) {
    this.notEligibleModel.nativeElement.classList.toggle('hidden');
    this.eligibleModalMessage.nativeElement.innerText = message;
    this.isShowingNotEligibleModal = true;
  }

  closeEligibleModal() {
    this.isShowingNotEligibleModal = false;
    setTimeout(() => {
      this.notEligibleModel.nativeElement.classList.toggle('hidden');
    }, 200);
  }

  getAverageRating() {
    if (typeof this.product == 'undefined') return 0;
    return this.product.totalRating / this.product.ratedBy
  }
  imageLoadingState(event: StateChange, img: HTMLImageElement, loading: HTMLDivElement) {
    switch (event.reason) {
      case 'setup':
        img.classList.add("invisible");
        loading.classList.remove('invisible');
        break;
      case 'observer-emit':
        break;
      case 'start-loading':
        break;
      case 'mount-image':
        break;
      case 'loading-succeeded':
        img.classList.remove("invisible");
        loading.classList.add('invisible');
        break;
      case 'loading-failed':
        break;
      case 'finally':
        break;
    }
  }
}
