import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { reflectionAnimations } from '../../animations';
import { ReflectionAlertAppearance, ReflectionAlertType } from './alert.types';
import { ReflectionAlertService } from './alert.service';

@Component({
    selector       : 'reflection-alert',
    templateUrl    : './alert.component.html',
    styleUrls      : ['./alert.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : reflectionAnimations,
    exportAs       : 'reflectionAlert'
})
export class ReflectionAlertComponent implements OnChanges, OnInit, OnDestroy
{
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_dismissible: BooleanInput;
    static ngAcceptInputType_dismissed: BooleanInput;
    static ngAcceptInputType_showIcon: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() appearance: ReflectionAlertAppearance = 'soft';
    @Input() dismissed: boolean = false;
    @Input() dismissible: boolean = false;
    @Input() name: string = this.randomId();
    @Input() showIcon: boolean = true;
    @Input() type: ReflectionAlertType = 'primary';
    @Output() readonly dismissedChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _reflectionAlertService: ReflectionAlertService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Host binding for component classes
     */
    @HostBinding('class') get classList(): any
    {
        return {
            'reflection-alert-appearance-border' : this.appearance === 'border',
            'reflection-alert-appearance-fill'   : this.appearance === 'fill',
            'reflection-alert-appearance-outline': this.appearance === 'outline',
            'reflection-alert-appearance-soft'   : this.appearance === 'soft',
            'reflection-alert-dismissed'         : this.dismissed,
            'reflection-alert-dismissible'       : this.dismissible,
            'reflection-alert-show-icon'         : this.showIcon,
            'reflection-alert-type-primary'      : this.type === 'primary',
            'reflection-alert-type-accent'       : this.type === 'accent',
            'reflection-alert-type-warn'         : this.type === 'warn',
            'reflection-alert-type-basic'        : this.type === 'basic',
            'reflection-alert-type-info'         : this.type === 'info',
            'reflection-alert-type-success'      : this.type === 'success',
            'reflection-alert-type-warning'      : this.type === 'warning',
            'reflection-alert-type-error'        : this.type === 'error'
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On changes
     *
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void
    {
        // Dismissed
        if ( 'dismissed' in changes )
        {
            // Coerce the value to a boolean
            this.dismissed = coerceBooleanProperty(changes['dismissed'].currentValue);

            // Dismiss/show the alert
            this._toggleDismiss(this.dismissed);
        }

        // Dismissible
        if ( 'dismissible' in changes )
        {
            // Coerce the value to a boolean
            this.dismissible = coerceBooleanProperty(changes['dismissible'].currentValue);
        }

        // Show icon
        if ( 'showIcon' in changes )
        {
            // Coerce the value to a boolean
            this.showIcon = coerceBooleanProperty(changes['showIcon'].currentValue);
        }
    }

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to the dismiss calls
        this._reflectionAlertService.onDismiss
            .pipe(
                filter(name => this.name === name),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {

                // Dismiss the alert
                this.dismiss();
            });

        // Subscribe to the show calls
        this._reflectionAlertService.onShow
            .pipe(
                filter(name => this.name === name),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {

                // Show the alert
                this.show();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(1);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Dismiss the alert
     */
    dismiss(): void
    {
        // Return if the alert is already dismissed
        if ( this.dismissed )
        {
            return;
        }

        // Dismiss the alert
        this._toggleDismiss(true);
    }

    /**
     * Show the dismissed alert
     */
    show(): void
    {
        // Return if the alert is already showing
        if ( !this.dismissed )
        {
            return;
        }

        // Show the alert
        this._toggleDismiss(false);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Dismiss/show the alert
     *
     * @param dismissed
     * @private
     */
    private _toggleDismiss(dismissed: boolean): void
    {
        // Return if the alert is not dismissible
        if ( !this.dismissible )
        {
            return;
        }

        // Set the dismissed
        this.dismissed = dismissed;

        // Execute the observable
        this.dismissedChanged.next(this.dismissed);

        // Notify the change detector
        this._changeDetectorRef.markForCheck();
    }
  /**
   * Generates a random id
   *
   * @param length
   */
  private randomId(length: number = 10): string
  {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let name = '';

    for ( let i = 0; i < 10; i++ )
    {
      name += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return name;
  }
}
