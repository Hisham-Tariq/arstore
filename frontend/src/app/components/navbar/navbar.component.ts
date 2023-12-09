import {Component, HostListener, OnInit, ViewChild,} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AuthSignUpComponent} from '../../ui/modals/sign-up/sign-up.component';
import {NavItem} from '../navigations/navigation.type';
import {navItems} from './data';
import {ReflectionDrawerComponent} from "../drawer";
import {Router} from "@angular/router";
import {Auth} from '@angular/fire/auth';
import {AuthService} from "src/app/services/Authentication/auth.service";
import {AuthSignInComponent} from "../../ui/modals/sign-in/sign-in.component";
import {CartService} from "../../services/Cart/cart.service";
import {ICartItemWithDetails} from "../../interfaces/i-cart-item";
import {GlobalService} from "../../services/global/global.service";
import {SearchPaletteComponent} from "../../ui/modals/search-palette/search-palette.component";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @ViewChild('cartDrawer') cartDrawer: any;
  @ViewChild('myHeader') myHeader: any;
  navigations!: NavItem[];
  activeItem?: NavItem;
  isHomePage: boolean = false;
  cartProducts!: ICartItemWithDetails[];
  cartTotal: number = 0;
  totalCartPrice: number = 0;
  isCartOpen: boolean = false;
  isUserLoggedIn :boolean = false;
  isUserAdmin :boolean = false;
  isCartProductsValid: boolean = false;
  currentUserName: string = "";
  headerOffset: number = 0;

  constructor(
    public dialog: MatDialog,
    private _router: Router,
    public auth: Auth,
    public authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private globalService: GlobalService,
  ) {
    this.globalService.currentCartDrawerState().subscribe(state => {
      this.isCartOpen = state;
    });
    this.cartService.observableDataWithDetails.subscribe(data => {
      this.cartProducts = data;
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
    this.authService.isUserLoggedIn.subscribe(data => {
      this.isUserLoggedIn = data
      if(this.isUserLoggedIn){
        this.currentUserName = this.authService.user?.firstName!;
        this.currentUserName = this.currentUserName.charAt(0).toUpperCase() + this.currentUserName.slice(1);
      }
    });
    this.authService.isUserAdmin.subscribe(data => this.isUserAdmin = data);
  }

  ngOnInit(): void {
    this.navigations = navItems;
    this.headerOffset = this.myHeader.nativeElement!.offsetTop;
  }


  isAllCartItemsStateValid(): boolean {
    for(let product of this.cartProducts){
      if(product.status != "active"){
        return false;
      } else if(product.inStockQuantity <= 0){
        return false;
      } else if(product.inStockQuantity > 0 && product.quantity > product.inStockQuantity){
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
      if(this.isHomePage){
        this.myHeader.nativeElement.classList.add('bg-black');
        this.myHeader.nativeElement.classList.add('bg-opacity-100');
        this.myHeader.nativeElement.classList.remove('bg-opacity-10');
        this.myHeader.nativeElement.classList.remove('bg-white');
      }
      this.myHeader.nativeElement.classList.add('sticky-header');
    } else {
      if(this.isHomePage){
        this.myHeader.nativeElement.classList.remove('bg-black');
        this.myHeader.nativeElement.classList.remove('bg-opacity-100');
        this.myHeader.nativeElement.classList.add('bg-opacity-10');
        this.myHeader.nativeElement.classList.add('bg-white');
      }
      this.myHeader.nativeElement.classList.remove('sticky-header');
    }
  }
}
