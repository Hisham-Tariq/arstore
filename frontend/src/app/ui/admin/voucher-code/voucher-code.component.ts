import {Component, OnInit, ViewChild} from '@angular/core';
import {reflectionAnimations} from "../../../animations";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {ReflectionAlertType} from "../../../components/alert";
import {FormBuilder, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {VoucherCodeInterface} from "../../../interfaces/voucher-code.interface";
import {VoucherCodeService} from "../../../services/VoucherCode/voucher-code.service";
import {UpdateCodeDialogComponent} from "./update-code-dialog/update-code-dialog.component";

@Component({
  selector: 'app-voucher-code',
  templateUrl: './voucher-code.component.html',
  styleUrls: ['./voucher-code.component.scss'],
  animations: reflectionAnimations,
})
export class VoucherCodeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<VoucherCodeInterface>;
  alert: { type: ReflectionAlertType; message: string } = {
    type: 'success',
    message: 'Successfully Added the Voucher Code',
  };
  showAlert: boolean = false;


  @ViewChild('deleteConfirmationModal') deleteConfirmationModal: any;
  isAskingForConfirmation: boolean = false;
  currentVoucherCodeToDelete: VoucherCodeInterface;

  data: MatTableDataSource<VoucherCodeInterface>;
  searchKey: string = "";

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['voucherCode', 'discount' ,'active', 'actions'];

  form = this.fb.group({
    voucherCode: [null, Validators.required],
    discount: [null, [Validators.required, Validators.min(1), Validators.max(100)]],
  });

  itemSelectedForDelete : VoucherCodeInterface | null
//  allEvents = new EventsManager().getAll();
  selectedCode!: VoucherCodeInterface;
  isAddingCode: boolean = false;


  constructor(
    private _dialog: MatDialog,
    private fb: FormBuilder,
    private voucherCodeService: VoucherCodeService,
  ) {// this.data = new MatTableDataSource<any>(this.allEvents);
    this.data = new MatTableDataSource<VoucherCodeInterface>();
    this.voucherCodeService.data.subscribe(res => {
      this.data.data = res;
    });

  }

  ngAfterViewInit(): void {
    this.data.sort = this.sort;
    this.data.paginator = this.paginator;
    this.table.dataSource = this.data;
  }

  clearSearchField(): void {
    this.searchKey = "";
    this.applyFilter();
  }

  openUpdateModal(code: any): void {
    this._dialog.open(UpdateCodeDialogComponent, {
      data: {
        voucherCode: code,
      },
    });
  }

  applyFilter(): void {
    this.data.filter = this.searchKey.trim().toLowerCase();
  }

  add() {
    if (this.form.valid) {
      this.isAddingCode = true;
      const code: VoucherCodeInterface = {
        ...this.form.value
      };
      this.voucherCodeService.add(code).then(() => {
        this.showAlertOfWith('success', 'Successfully Added the Voucher Code');
        this.form.reset();
      }).catch((reason) => {
        console.log(reason);
        this.showAlertOfWith('error', 'Failed to Add the Voucher Code');
        this.startAlertTimeout();
      }).finally(() => {
        this.isAddingCode = false;
      });
    } else {
      this.showAlertOfWith('error', 'Please fill all the required fields', false);
    }
  }


  delete() {
    // delete the main category by id
    this.voucherCodeService.delete(this.currentVoucherCodeToDelete).then(() => {
      this.showAlertOfWith('success', 'Successfully Deleted the Voucher Code');
      this.closeDeleteModal();
    }).catch(() => {
      this.showAlertOfWith('error', 'Failed to Delete Voucher Code');
      this.closeDeleteModal();
    });
  }

  confirmForDelete(event: any) {
    console.log(event);
    this.currentVoucherCodeToDelete = event;
    this.deleteConfirmationModal.nativeElement.classList.toggle('hidden');
    this.isAskingForConfirmation = true;

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


  get voucherCode() {
    return this.form.get('voucherCode');
  }

  get discount() {
    return this.form.get('discount');
  }



  ngOnInit(): void {
  }

  setVoucherCodeStatus(row: VoucherCodeInterface, checked: boolean) {

    this.voucherCodeService.updateStatus(row, checked).then(r => {
      this.showAlertOfWith('success', 'Successfully Updated the Voucher Code');
    }).catch(() => {
      this.showAlertOfWith('error', 'Failed to Update the Voucher Code');
    });
  }
}
