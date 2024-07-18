import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Order } from "src/models/order.model";
import { CheckOutComponent } from "./check-out.component";

@Component({
    selector: 'app-reprint-receipt',
    templateUrl: './reprint-receipt.component.html',
    styleUrls: ['./reprint-receipt.component.less']
  })
  export class ReprintReceiptComponent implements OnInit {
  
    constructor(public dialogRef: MatDialogRef<CheckOutComponent>,
      @Inject(MAT_DIALOG_DATA) public order: Order) { }
  
    ngOnInit(): void {
    }
  }
  