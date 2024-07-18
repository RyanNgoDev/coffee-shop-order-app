import { Component, Input } from "@angular/core";
import { Order } from "src/models/order.model";

@Component({
    selector: 'app-bar-paper',
    templateUrl: './bar-paper.component.html',
    styleUrls: ['./bar-paper.component.less']
  })
  export class BarPaperComponent  {
    @Input() order: Order | undefined;
    constructor() { }
  
}