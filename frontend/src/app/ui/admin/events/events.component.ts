import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {ReflectionAlertType} from "../../../components/alert";
import {FormBuilder, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {UpdateEventDialogComponent} from "./update-event-dialog/update-event-dialog.component";
import {ManageEventService} from "../../../services/ManageEvent/manage-event.service";
import {reflectionAnimations} from "../../../animations";
import {IEvents} from "../../../interfaces/IEvents";
import {ProductService} from "../../../services/Product/product.service";
import {filter} from "rxjs";
import {map} from "rxjs/operators";
import {ProductInterface} from "../../../interfaces";
import {randomId} from "../../../utils";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  animations: reflectionAnimations,
})
export class EventsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<IEvents>;
  alert: { type: ReflectionAlertType; message: string } = {
    type: 'success',
    message: 'Successfully Added the Product',
  };
  showAlert: boolean = false;

  products: ProductInterface[] = [];

  @ViewChild('deleteConfirmationModal') deleteConfirmationModal: any;
  isAskingForConfirmation: boolean = false;
  currentEventToDelete: IEvents;

  dataSource: MatTableDataSource<IEvents>;
  searchKey: string = "";

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'discount', 'total', 'validUpTo', 'actions'];

  form = this.fb.group({
    name: [null, Validators.required],
    products: [null, Validators.required],
    discount: [null, [Validators.required, Validators.min(1), Validators.max(100)]],
    validUpTo: [null, Validators.required],
  });

  itemSelectedForDelete : any | null
//  allEvents = new EventsManager().getAll();
  selectedEvent!: IEvents;
  isAddingEvent: boolean = false;

  constructor(
    private _dialog: MatDialog,
    private fb: FormBuilder,
    private manageEventService: ManageEventService,
    private productService: ProductService,
  ) {
   // this.data = new MatTableDataSource<any>(this.allEvents);
    this.dataSource = new MatTableDataSource<IEvents>();
    this.productService.data.pipe(map(value => {
      // return all who have no discount
      return value.filter(product => product.discount === 0);
    })).subscribe(data => {
      this.products = data;
    });

    manageEventService.data.subscribe(value => {
      this.dataSource.data = value;
    })

  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  clearSearchField(): void {
    this.searchKey = "";
    this.applyFilter();
  }

  openUpdateModal(event: any): void {
    this._dialog.open(UpdateEventDialogComponent, {
      data: {
        event: event,
      },
    });
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  add() {
    if (this.form.valid) {
      this.isAddingEvent = true;
      const event: IEvents = {
        id: randomId(40),
        ...this.form.value
      };
      this.manageEventService.add(event).then(() => {
        this.showAlertOfWith('success', 'Successfully Added the Event');
        this.form.reset();
      }).catch(() => {
        this.showAlertOfWith('error', 'Failed to Add the Event');
        this.startAlertTimeout();
      }).finally(() => {
        this.isAddingEvent = false;
      });
    } else {
      this.showAlertOfWith('error', 'Please fill all the required fields', false);
    }
  }

  hideDeleteDialog(){
    this.itemSelectedForDelete = null;
  }

  delete() {
    // delete the main category by id
    this.manageEventService.delete(this.currentEventToDelete).then(() => {
      this.showAlertOfWith('success', 'Successfully Deleted the Event');
      this.closeDeleteModal();
    }).catch(() => {
      this.showAlertOfWith('error', 'Failed to Delete Event');
      this.closeDeleteModal();
    });
  }

  confirmForDelete(event: any) {
    this.currentEventToDelete = event;
    this.deleteConfirmationModal.nativeElement.classList.toggle('hidden');
    this.isAskingForConfirmation = true;

  }

  onEventsFilterIntervalChange() {

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

  closeDeleteModal() {
    this.isAskingForConfirmation = false;
    setTimeout(() => {
      this.deleteConfirmationModal.nativeElement.classList.toggle('hidden');
    }, 200);
  }


  get name() {
    return this.form.get('name');
  }

  get discount() {
    return this.form.get('discount');
  }

  get product() {
    return this.form.get('products');
  }

  get validUpTo() {
    return this.form.get('validUpTo');
  }

}
