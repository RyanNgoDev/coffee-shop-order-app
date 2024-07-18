import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Order } from 'src/models/order.model';
import { Table } from 'src/models/table.model';
import { OrderService } from 'src/services/order.service';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.less']
})
export class CheckOutComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CheckOutComponent>,
    @Inject(MAT_DIALOG_DATA) public order: Order,
    private orderService: OrderService) { }

  ngOnInit(): void {
  }

  checkOut() {
    if (!this.order.printCount || this.order.printCount < 1) {
      this.orderService.addOrder(this.order);
    }
    this.dialogRef.close(true);
  }

  bar() {
    this.dialogRef.close(true);
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === "F8") {
      document.getElementById("button-bar")!.click();
      event.preventDefault();
    } else if (event.key === "F9") {
      document.getElementById("button-check-out")!.click();
      event.preventDefault();
    }
  }
}
