import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {ReflectionNavigationService} from "../../../services/ReflectionNavigation";
import {ContactUsService} from "../../../services/ContactUs/contact-us.service";
import {ReflectionAlertType} from "../../../components/alert";
import {ContactusInterface} from "../../../interfaces/contactusInterface";
import {reflectionAnimations} from "../../../animations";
import {IEvents} from "../../../interfaces/IEvents";

@Component({
  selector: 'app-customers',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss'],
  animations: reflectionAnimations,
})
export class ContactusComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ContactusInterface>;
  alert: { type: ReflectionAlertType; message: string } = {
    type: 'success',
    message: 'Successfully Added the Product',
  };
  showAlert: boolean = false;
  dataSource!: MatTableDataSource<ContactusInterface>;
  searchKey: string = "";

  @ViewChild('deleteConfirmationModal') deleteConfirmationModal: any;
  isAskingForConfirmation: boolean = false;

  currentCustomerForDelete: ContactusInterface;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'email', 'phone', 'message', 'actions'];

  itemSelectedForDelete : any | null
  selectedEvent!: IEvents;
  constructor(
    private _dialog: MatDialog,
    private _router: Router,
    private service: ReflectionNavigationService,
    private contactUsService: ContactUsService
  ) {
    this.dataSource = new MatTableDataSource<ContactusInterface>();

    contactUsService.data.subscribe(value => {
      this.dataSource.data = value;
    })
    // this.data.filter = "300";
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


  openConfirmDeleteDialog(data: any){
    this.itemSelectedForDelete = data;
  }

  hideDeleteDialog(){
    this.itemSelectedForDelete = null;
  }
  delete() {
    // delete the main category by id
    this.contactUsService.delete(this.currentCustomerForDelete).then(() => {
      this.showAlertOfWith('success', 'Successfully Deleted the Customer Query');
      this.closeDeleteModal();
    }).catch(() => {
      this.showAlertOfWith('error', 'Failed to Delete the customer query');
      this.closeDeleteModal();
    });
  }
  applyFilter(): void {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }


  onDismissedChanged(e: any) {
    this.showAlert = !e;
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
  confirmForDelete(customer: ContactusInterface) {
    this.currentCustomerForDelete = customer;
    this.deleteConfirmationModal.nativeElement.classList.toggle('hidden');
    this.isAskingForConfirmation = true;
  }

  closeDeleteModal() {
    this.isAskingForConfirmation = false;
    setTimeout(() => {
      this.deleteConfirmationModal.nativeElement.classList.toggle('hidden');
    }, 200);
  }
}
