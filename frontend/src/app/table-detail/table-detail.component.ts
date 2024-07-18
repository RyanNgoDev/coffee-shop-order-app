import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'src/models/table.model';
import { TablesService } from '../../services/tables.service';
import { Location } from '@angular/common';
import { RequestService } from 'src/services/request.service';
import { Product } from 'src/models/product.model';
import { Order } from 'src/models/order.model';
import { OrderDetail } from 'src/models/order-detail.model';
import * as _ from 'lodash';
import { BrowserWindow } from 'electron';
import { NameErrorStateMatcher } from '../core/name-error-state';
import { FormControl, Validators } from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import { ConfirmationService } from 'src/services/confirmation.service';
import { DialogData } from 'src/models/dialog-data.model';
import { ProductFilter } from 'src/models/product-filter.model';
import { CategoryStatic } from 'src/models/category';
import { MatDialog } from '@angular/material/dialog';
import { CheckOutComponent } from '../check-out/check-out.component';
import { OrderService } from 'src/services/order.service';
import { ShiftService } from 'src/services/shift.service';
import { CouponComponent } from './coupon.component';
import { Coupon } from 'src/models/coupon.model';

@Component({
  selector: 'app-table-detail',
  templateUrl: './table-detail.component.html',
  styleUrls: ['./table-detail.component.less']
})
export class TableDetailComponent implements OnInit, AfterViewInit {
  public table: Table | undefined;
  public products: Product[] = [];
  public hasChanges = false;
  tableName = new FormControl('', [Validators.required]);
  matcher = new NameErrorStateMatcher();
  productsDataSource: MatTableDataSource<Product> = new MatTableDataSource();
  displayedColumns: string[] = ['name', 'price'];
  readonly categoryList = CategoryStatic;
  categoryFilter: number[] = [];
  nameFilter: string = '';
  isLoading = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly tablesService: TablesService,
    private readonly location: Location,
    private readonly requestService: RequestService,
    private readonly cdr: ChangeDetectorRef,
    private readonly confirmationService: ConfirmationService,
    private readonly dialog: MatDialog,
    private readonly orderService: OrderService,
    private readonly shiftService: ShiftService,
    private router: Router,) { }

  ngOnInit(): void {
    this.getTable();
    this.getProducts();
  }

  ngAfterViewInit(): void {
    document.getElementById('table-name-input')?.focus();
    this.cdr.detectChanges();
  }

  testFilter() {
    console.log(this.categoryFilter);
  }

  getTable(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.table = this.tablesService.getTable(id);
  }

  getProducts() {
    this.requestService.getProducts().then((products) => {
      this.products = products;
      this.products.forEach(product => product.pureName = this.removeAccents(product.name));
      this.productsDataSource = new MatTableDataSource(this.products);
      this.productsDataSource.filterPredicate = this.productFilter();
      this.isLoading = false;
    });
  }

  addTable() {
    if (this.table && !_.isEmpty(this.table.name)) {
      this.tablesService.addTable(this.table).then(() => this.goBack());
    }
  }

  async removeTable() {
    if (this.table) {
      const dialogContent = {
        title: "Warning!",
        message: "Chắc chắn muốn xóa bàn hiện tại?"
      } as DialogData;

      if (await this.confirmationService.confirm(dialogContent)) {
        this.tablesService.removeTable(this.table);
        this.goBack();
      }
    }
  }

  removeOrderDetail(orderDetail: OrderDetail) {
    _.remove(this.table?.order?.receiptDetails as OrderDetail[], detail => detail === orderDetail);
    this.calculateTotalCost();
  }

  goBack() {
    if (this.table?.id) {
      this.tablesService.saveChanges();
      this.router.navigate(['/'])
    } else {
      this.router.navigate(['/'])
    }
  }

  async checkOut() {
    if (this.dialog.openDialogs && this.dialog.openDialogs.length > 0) {
      return;
    }

    if (this.table?.name && this.table?.order && this.table.order.receiptDetails.length > 0) {
      this.table.order.table = this.table.name;
      const shift = await this.shiftService.getShift();
      this.table.order.shiftId = Number(shift?.id);
      this.table.order.orderId = await this.orderService.generateOrderId(Number(shift?.id));
      this.table.order.time = _.isEmpty(this.table.time) ? await this.requestService.getCurrentTime() : this.table.time;
      this.dialog.open(CheckOutComponent, {
        width: '800px',
        data: this.table.order
      }).afterClosed().subscribe((result) => {
        if (result) {
          if (this.table?.id) {
            this.goBack();
          } else {
            this.addTable();
          }
        }
      });
    }
  }

  closeTable() {
    if (this.table?.id) {
      if (!this.table.order?.printCount || this.table.order?.printCount < 1) {
        return;
      }

      this.tablesService.removeTable(this.table as Table);
      this.goBack();
    } else {
      this.hasChanges = false;
      this.goBack();
    }
  }

  selectProduct(product: Product) {
    if (this.table) {
      if (this.table.order) {
        if (this.table.order.printCount === 1) {
          return;
        }

        if (this.table.order.receiptDetails?.length > 0) {
          const existedProduct = _.find(this.table.order.receiptDetails, (orderDetail) => orderDetail.product.id === product.id);
          if (existedProduct) {
            existedProduct.quantity++;
          } else {
            this.table.order.receiptDetails.push({
              product,
              price: product.price,
              quantity: 1
            } as OrderDetail);
          }
        } else {
          this.table.order.receiptDetails = [
            {
              product,
              price: product.price,
              quantity: 1
            } as OrderDetail
          ];
          this.table.order.total = product.price;
        }
      } else {
        this.table.order = {
          total: product.price,
          receiptDetails: [
            {
              product,
              price: product.price,
              quantity: 1,
            } as OrderDetail
          ],
        } as Order;
      }

      this.calculateTotalCost();
    }
  }

  increaseQuantity(orderDetail: OrderDetail) {
    orderDetail.quantity++;
    this.calculateTotalCost();
  }

  decreaseQuantity(orderDetail: OrderDetail) {
    if (this.table && this.table.order) {
      if (orderDetail.quantity === 1) {
        _.remove(this.table.order.receiptDetails, (detail) => detail === orderDetail);
      } else {
        orderDetail.quantity--;
      }
      
      this.calculateTotalCost();
    }
  }

  public calculateTotalCost() {
    if (this.table && this.table.order) {
      if (this.table.order.receiptDetails.length > 0) {
        this.table.order.total = _.sumBy(this.table.order.receiptDetails, (detail) => detail.price * detail.quantity);
      } else {
        this.table.order.total = 0;
      }

      this.table.order.discountAmount = this.table.order.isDiscountApplied ? this.calculatePromotion(this.table.order) : 0;
      this.table.order.summary = this.table.order.total - this.table.order.discountAmount;
    }
  }

  private calculatePromotion(order: Order) {
    return _.sumBy(order.receiptDetails, (detail) => detail.product.categoryId === 4 ? 0 : detail.price * detail.quantity * order.discount / 100);
  }

  applyFilter() {
    const filterValue = { name: this.nameFilter, categories: this.categoryFilter } as ProductFilter;
    this.productsDataSource.filter = JSON.stringify(filterValue);
  }

  productFilter(): (data: any, filter: string) => boolean {
    return (data, filter): boolean => {
      const searchTerms = JSON.parse(filter) as ProductFilter;
      if (searchTerms.categories.length > 0) {
        return (data.name.toLowerCase().indexOf(searchTerms.name) !== -1
          || data.pureName.toLowerCase().indexOf(searchTerms.name) !== -1)
          && searchTerms.categories.includes(data.categoryId);
      } else {
        return data.name.toLowerCase().indexOf(searchTerms.name) !== -1
          || data.pureName.toLowerCase().indexOf(searchTerms.name) !== -1
      }
    }
  }

  private removeAccents(name: string) {
    let pureName = name;
    var AccentsMap = [
      "aàảãáạăằẳẵắặâầẩẫấậ",
      "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
      "dđ", "DĐ",
      "eèẻẽéẹêềểễếệ",
      "EÈẺẼÉẸÊỀỂỄẾỆ",
      "iìỉĩíị",
      "IÌỈĨÍỊ",
      "oòỏõóọôồổỗốộơờởỡớợ",
      "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
      "uùủũúụưừửữứự",
      "UÙỦŨÚỤƯỪỬỮỨỰ",
      "yỳỷỹýỵ",
      "YỲỶỸÝỴ"    
    ];
    for (var i=0; i<AccentsMap.length; i++) {
      var re = new RegExp('[' + AccentsMap[i].slice(1) + ']', 'g');
      var char = AccentsMap[i][0];
      pureName = pureName.replace(re, char);
    }
    return pureName;
  }

  addCoupon() {
    this.dialog.open(CouponComponent, { width: '300px'}).afterClosed().subscribe((coupon: Coupon) => {
      if (coupon && this.table) {
        if (this.table.order) {
          this.table.order.isDiscountApplied = true;
          this.table.order.coupon = coupon.code;
          this.table.order.discount = coupon.discountPercent;
        } else {
          this.table.order = {
            isDiscountApplied: true,
            coupon: coupon.code,
            discount: coupon.discountPercent,
            receiptDetails: [] as OrderDetail[]
          } as Order;
        }

        this.calculateTotalCost();
      }
    });
  }

  removeCoupon() {
    if (this.table) {
      this.table.order.isDiscountApplied = false;
      this.table.order.coupon = "";
      this.table.order.discount = 0;
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === "F8") {
      this.checkOut();
      event.preventDefault();
    }

    if (event.key === "F10") {
      this.closeTable();
      event.preventDefault();
    }
  }
}
