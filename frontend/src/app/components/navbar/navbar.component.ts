import {Component, HostListener, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AuthSignUpComponent} from '../../ui/modals/sign-up/sign-up.component';
import {NavItem} from '../navigations/navigation.type';
import {navItems} from './data';
import {ReflectionDrawerComponent} from "../drawer";
import {Router} from "@angular/router";
import {AuthService} from "src/app/services/Authentication/auth.service";
import {AuthSignInComponent} from "../../ui/modals/sign-in/sign-in.component";
import {CartItem, CartService} from "../../services/Cart/cart.service";
import {GlobalService} from "../../services/global/global.service";
import {SearchPaletteComponent} from "../../ui/modals/search-palette/search-palette.component";
import {Product} from "../../interfaces";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, AfterViewInit {
  @ViewChild('cartDrawer') cartDrawer: any;
  @ViewChild('myHeader') myHeader: any;
  navigations!: NavItem[];
  activeItem?: NavItem;
  isHomePage: boolean = false;
  cartProducts: CartItem[] = [];
  cartTotal: number = 0;
  totalCartPrice: number = 0;
  isCartOpen: boolean = false;
  isUserLoggedIn: boolean = false;
  isUserAdmin: boolean = false;
  isCartProductsValid: boolean = false;
  currentUserName: string = "";
  headerOffset: number = 0;

  constructor(
    public dialog: MatDialog,
    private _router: Router,
    public authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private globalService: GlobalService,
  ) {
    this.globalService.currentCartDrawerState().subscribe(state => {
      this.isCartOpen = state;
    });
    this.cartService.data.subscribe(data => {
      this.cartProducts = data?.items ?? [];
    });
    this.cartService.totalCartPrice().subscribe(data => {
      this.totalCartPrice = data;
    });
    this.cartService.totalItems().subscribe(data => {
      this.cartTotal = data;
      this.isCartProductsValid = this.isAllCartItemsStateValid();
    });
    // check if the user is logged in
    this.router.events.subscribe(_ => {
      this.isHomePage = this.router.url.includes("home");
    })
    this.currentUserName = 'Random'
    // TODO: Firebase
    this.authService.isAuthenticated().subscribe(authenticated => {
      this.isUserLoggedIn = authenticated
      if (this.isUserLoggedIn) {
        console.log("User is logged in");
        this.authService.authState$.subscribe(user => {
          this.currentUserName = user?.firstName!;
          // this.currentUserName = this.currentUserName.charAt(0).toUpperCase() + this.currentUserName.slice(1);
          this.isUserAdmin = user?.type === "admin";
        });
      }
    });
  }

  ngOnInit(): void {
    this.navigations = navItems;
  }

  ngAfterViewInit() {
    this.headerOffset = this.myHeader.nativeElement!.offsetTop;
  }


  findVariant(p: Product, variantName: string) {
    return p.variants.find(value => value.name === variantName)!
  }

  isAllCartItemsStateValid(): boolean {
    for (let cartItem of this.cartProducts) {
      const currentVariant = this.findVariant(cartItem.product, cartItem.variantName);
      if (cartItem.product.status != "active") {
        return false;
      } else if (
        currentVariant.stock <= 0
      ) {
        return false;
      } else if (currentVariant.stock > 0 && cartItem.quantity > currentVariant.stock) {
        return false;
      }
    }
    return true;
  }

  openSignInDialog(): void {
    this.dialog.open(AuthSignInComponent);
  }

  openSignUpDialog(): void {
    this.dialog.open(AuthSignUpComponent);
  }


  openSearchDialog(): void {
    this.dialog.open(SearchPaletteComponent);
  }

  onCheckoutClicked(cartDrawer: ReflectionDrawerComponent): void {
    cartDrawer.close();
    this._router.navigateByUrl('check-out');
  }

  onCartClicked() {
    this.globalService.openCartDrawer();
  }

  goToDashboard() {
    this._router.navigateByUrl("admin");
  }

  closeCartDrawer() {
    this.globalService.closeCartDrawer()
  }

  gotToProducts() {
    this.closeCartDrawer();
    this._router.navigateByUrl("products");
  }

  gotToCheckout() {
    this.closeCartDrawer();
    this._router.navigateByUrl("check-out");
  }

  goToProfile() {
    this._router.navigateByUrl("profile");
  }

  checkCartState() {
    this.isCartProductsValid = this.isAllCartItemsStateValid();
  }

  logout() {
    this.authService.logout();
  }

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event: any) {
    if (window.pageYOffset > this.headerOffset) {
      if (this.isHomePage) {
        this.myHeader.nativeElement.classList.add('bg-black');
        this.myHeader.nativeElement.classList.add('bg-opacity-100');
        this.myHeader.nativeElement.classList.remove('bg-opacity-10');
        this.myHeader.nativeElement.classList.remove('bg-white');
      }
      this.myHeader.nativeElement.classList.add('sticky-header');
    } else {
      if (this.isHomePage) {
        this.myHeader.nativeElement.classList.remove('bg-black');
        this.myHeader.nativeElement.classList.remove('bg-opacity-100');
        this.myHeader.nativeElement.classList.add('bg-opacity-10');
        this.myHeader.nativeElement.classList.add('bg-white');
      }
      this.myHeader.nativeElement.classList.remove('sticky-header');
    }
  }
}
