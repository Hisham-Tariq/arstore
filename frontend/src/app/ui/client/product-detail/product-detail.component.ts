import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {Product} from "../../../interfaces";
import {ProductService} from "../../../services/Product/product.service";
import {StockService} from "../../../services/Stock/stock.service";
import {CartService, Cart, AddToCartData, CartItem} from "../../../services/Cart/cart.service";
import {GlobalService} from "../../../services/global/global.service";
import {MainCategoryService} from "../../../services/MainCategory/main-category.service";
import {SubCategoryService} from "../../../services/SubCategory/sub-category.service";
import {TryOnProductComponent} from "../../modals/try-on-product/try-on-product.component";
import {AuthService} from "../../../services/Authentication";
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

  isViewInit: boolean = false;
  product: Product;
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
  isUserVerified: boolean = true;
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
    private cartService: CartService,
    private globalService: GlobalService,
    private navigationService: ReflectionNavigationService,
  ) {
    this.activatedRoute.paramMap.subscribe(params => {
      this.currentProductId = params.get('pid')!;
      this.fetchCurrentProduct(params.get('pid')!);
      // if (!this.isDetailSet) {
      //   this.isDetailSet = false;
      //   this.setProductDetail();
      // }
    });
    this.authService.isAuthenticated().subscribe(data => {
      this.isUserLoggedIn = data;
      if (this.isUserLoggedIn) {
        this.authService.authState$.subscribe(data => this.isUserAdmin = data?.type === 'admin');
      } else {
        this.isUserAdmin = false;
      }

    });
    // this.auth.onAuthStateChanged(user => {
    //   if (user) {
    //     this.isUserVerified = user.emailVerified;
    //   }
    // });
  }


  async fetchCurrentProduct(productId: string) {
    if (history.state.hasOwnProperty('product')) {
      this.product = history.state.product;
    } else {
      this.product = await this.productService.getProductById(productId);
    }
    this.selectedColor = this.product.colors[0];
    this.updateProductColorImages();
    this.currentProductColors = this.product.colors;
    this.productDataFetched = true;
    this.setProductDetail();
  }

  setProductDetail() {
    if (!this.isViewInit) return;
    if (typeof this.product === 'undefined' || this.product.variants.length < 1 || this.isDetailSet) return;
    console.log("Setting Product Detail");
    this.selectedColor = this.product.colors[0];
    this.updateProductColorImages();
    this.currentProductColors = this.product.colors;
    this.productNameView.nativeElement.innerText = this.product.name;

    this.updateProductPrice();
    this.productDescriptionView.nativeElement.innerText = this.product.description;
    this.isDetailSet = true;
  }

  get retailPrice() {
    return this.product.variants.find((value) => value.colorCode == this.selectedColor)!.price;
    // return this.product.stock[this.selectedColor].retailerPrice;
  }

  get discountedPrice() {
    return this.retailPrice;
  }

  updateProductPrice() {
    this.productPriceView.nativeElement.innerText = 'RS. ' + this.discountedPrice;
    console.log(this.productPriceView.nativeElement.innerText);
    // if (this.product.discount == 0) {
    //   this.productPriceView.nativeElement.innerText = 'RS. ' + this.discountedPrice;
    // } else {
    //   this.productPriceView.nativeElement.innerHTML = `<del>RS. ${this.retailPrice}</del> RS. ${this.discountedPrice} `;
    // }
  }


  get currentVariantInStock(): number {
    return this.product.variants.find((value) => value.colorCode == this.selectedColor)!.stock;
    // return this.product.stock[this.selectedColor].totalQuantity;
  }

  updateProductColorImages() {
    // @ts-ignore
    this.currentColorImages = this.product.images[this.selectedColor];
    this.selectedImageKey = 'thumbnail';
  }


  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.isViewInit = true;
    console.log("After View Init");
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
    }
    // else if (this.isUserLoggedIn && !this.authService.isUserVerified) {
    //   this.showNotEligibleModal("You are not verified. Please verify your account to continue shopping.");
    //   return;
    // }
    const variant = this.product.variants.find((value) => value.colorCode == this.selectedColor)!;
    let item = <AddToCartData>{
      productId: this.product.id,
      variantName: variant.name,
      quantity: this.quantity
    };
    this.isAddingInCart = true;
    this.cartService.addToCart(item).then((value) => {
      this.globalService.openCartDrawer();
      this.quantity = 1;
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
    return this.product.rating.avgRating
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
