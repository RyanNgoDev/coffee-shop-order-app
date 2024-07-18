import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';
import { OrderDetail } from 'src/models/order-detail.model';
import { Shift } from 'src/models/shift.model';
import { OrderService } from 'src/services/order.service';
import { RequestService } from 'src/services/request.service';
import { ShiftService } from 'src/services/shift.service';

@Component({
  selector: 'app-shift-control',
  templateUrl: './shift-control.component.html',
  styleUrls: ['./shift-control.component.less']
})
export class ShiftControlComponent implements OnInit, AfterViewInit {
  receiptDetails: OrderDetail[] = [];
  shift: Shift | undefined = undefined;
  total: number = 0;
  summary: number = 0;
  totalDiscount: number = 0;
  receiptDetailsDataSource: MatTableDataSource<OrderDetail> = new MatTableDataSource();
  displayedColumns: string[] = ['name', 'price', 'quantity', 'summary'];
  currentTime: string = '';
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  constructor(private readonly orderService: OrderService,
    private readonly shiftService: ShiftService,
    private readonly requestService: RequestService,
    public dialogRef: MatDialogRef<ShiftControlComponent>,) { }

  async ngOnInit() {
    this.shift = await this.shiftService.getShift();
    this.currentTime = await this.requestService.getCurrentTime();
    const orders = await this.orderService.getOrdersByShift(Number(this.shift?.id));
    const details: OrderDetail[] = [];
    _.forEach(orders, (order) => details.push(...order.receiptDetails));
    const res = Array.from(details.reduce(
      (acc, {quantity, ...r}) => {
        const key = JSON.stringify(r);
        const current = acc.get(key) || {...r, quantity: 0};
        return acc.set(key, {...current, quantity: current.quantity + quantity});
      }, new Map).values());
    this.receiptDetails = res as OrderDetail[];
    this.summary = _.sumBy(orders, (order) => order.summary);
    this.total = _.sumBy(orders, (order) => order.total);
    this.totalDiscount = this.total - this.summary;
    this.receiptDetailsDataSource = new MatTableDataSource(this.receiptDetails);
    this.shiftService.calculateTotal(orders);
  }

  ngAfterViewInit(): void {
    this.receiptDetailsDataSource.sort = this.sort;
  }

  closeShift() {
    this.dialogRef.close(true);
  }
}
