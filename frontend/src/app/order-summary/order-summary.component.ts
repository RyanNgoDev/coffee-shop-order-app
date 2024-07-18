import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Order } from 'src/models/order.model';
import { OrderService } from 'src/services/order.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatSort} from '@angular/material/sort';
import * as _ from 'lodash';
import { ShiftService } from 'src/services/shift.service';
import { MatDialog } from '@angular/material/dialog';
import { ReprintReceiptComponent } from '../check-out/reprint-receipt.component';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.less'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OrderSummaryComponent implements OnInit, AfterViewInit {
  public orders: Order[] = [];
  public turnover: number = 0;
  orderDataSource: MatTableDataSource<Order> = new MatTableDataSource();
  displayedColumns: string[] = ['orderId', 'table', 'time', 'total'];
  expandedOrder: Order | null = null;
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  constructor(private readonly orderService: OrderService,
    private readonly shiftService: ShiftService,
    private readonly dialog: MatDialog,) {}

  async ngOnInit() {
    const shift = await this.shiftService.getShift();
    this.orders = await this.orderService.getOrdersByShift(Number(shift?.id));
    this.orderDataSource = new MatTableDataSource(this.orders);
    this.turnover = _.sumBy(this.orders, order => order.summary);
  }

  ngAfterViewInit() {
    this.orderDataSource.sort = this.sort;
  }

  viewReceipt(row: Order) {
    this.dialog.open(ReprintReceiptComponent, {
      width: '400px',
      data: row
    });
  }
}
