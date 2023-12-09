// import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
// import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
// import {
//     FuseNavigationService,
//     FuseVerticalNavigationComponent,
// } from '@fuse/components/navigation';
// import { Navigation } from 'app/core/navigation/navigation.types';
// import { NavigationService } from 'app/core/navigation/navigation.service';
// import {
//     MatDialog,
//     MatDialogRef,
//     MAT_DIALOG_DATA,
// } from '@angular/material/dialog';
// import { AuthSignInComponent } from 'app/modules/pages/sign-in/sign-in.component';
//
// @Component({
//     selector: 'modern-layout',
//     templateUrl: './modern.component.html',
//     encapsulation: ViewEncapsulation.None,
//     styleUrls: ['./modern.component.scss'],
// })
// export class ModernLayoutComponent implements OnInit, OnDestroy {
//     isScreenSmall: boolean;
//     navigation: Navigation;
//     private _unsubscribeAll: Subject<any> = new Subject<any>();
//     isScreenLarge: boolean;
//
//     /**
//      * Constructor
//      */
//     constructor(
//         private _activatedRoute: ActivatedRoute,
//         private _router: Router,
//         private _navigationService: NavigationService,
//         private _fuseMediaWatcherService: FuseMediaWatcherService,
//         private _fuseNavigationService: FuseNavigationService,
//         public dialog: MatDialog
//     ) {}
//
//     openDialog(): void {
//         const dialogRef = this.dialog.open(AuthSignInComponent, {
//             // width: '250px',
//             // data: { name: this.name, animal: this.animal },
//         });
//
//         dialogRef.afterClosed().subscribe((result) => {
//             console.log('The dialog was closed');
//             // this.animal = result;
//         });
//     }
//
//     // -----------------------------------------------------------------------------------------------------
//     // @ Accessors
//     // -----------------------------------------------------------------------------------------------------
//
//     /**
//      * Getter for current year
//      */
//     get currentYear(): number {
//         return new Date().getFullYear();
//     }
//
//     // -----------------------------------------------------------------------------------------------------
//     // @ Lifecycle hooks
//     // -----------------------------------------------------------------------------------------------------
//
//     /**
//      * On init
//      */
//     ngOnInit(): void {
//         // Subscribe to navigation data
//         this._navigationService.navigation$
//             .pipe(takeUntil(this._unsubscribeAll))
//             .subscribe((navigation: Navigation) => {
//                 this.navigation = navigation;
//             });
//
//         // Subscribe to media changes
//         this._fuseMediaWatcherService.onMediaChange$
//             .pipe(takeUntil(this._unsubscribeAll))
//             .subscribe(({ matchingAliases }) => {
//                 // Check if the screen is small
//                 this.isScreenSmall = !matchingAliases.includes('md');
//                 this.isScreenLarge = !matchingAliases.includes('lg');
//             });
//     }
//
//     /**
//      * On destroy
//      */
//     ngOnDestroy(): void {
//         // Unsubscribe from all subscriptions
//         this._unsubscribeAll.next();
//         this._unsubscribeAll.complete();
//     }
//
//     // -----------------------------------------------------------------------------------------------------
//     // @ Public methods
//     // -----------------------------------------------------------------------------------------------------
//
//     /**
//      * Toggle navigation
//      *
//      * @param name
//      */
//     toggleNavigation(name: string): void {
//         // Get the navigation
//         const navigation =
//             this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
//                 name
//             );
//
//         if (navigation) {
//             // Toggle the opened status
//             navigation.toggle();
//         }
//     }
//     //video
//     onCartClicked(drawer): void {
//         // 3 Scenarios
//         // 1. If Small Screen Navigate to Cart Checkout/Cart Screen
//         // 2. on Large Screen if Distinct Products Count < 4 then show CartDrawer
//         // 3. on Large Screen if Distinct Products Count >= 4 Navigate to Cart Checkout/Cart Screen
//         const distinctProductCount = 4;
//         if (this.isScreenSmall || distinctProductCount >= 4) {
//             // Navigate to Checkout Page
//             this._router.navigateByUrl('/cart');
//         } else{
//             drawer.toggle();
//         }
//     }
//
// }
