import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogData } from 'src/models/dialog-data.model';
import { Shift } from 'src/models/shift.model';
import { Table } from 'src/models/table.model';
import { ConfirmationService } from 'src/services/confirmation.service';
import { ShiftService } from 'src/services/shift.service';
import { TablesService } from '../../services/tables.service';
import { ShiftControlComponent } from '../shift-control/shift-control.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  providers: [TablesService]
})
export class DashboardComponent implements OnInit {
  public tables: Table[] = [];
  public shift: Shift | undefined = undefined;
  public isShiftLoaded = false;
  constructor(private readonly tablesService: TablesService,
    private readonly shiftService: ShiftService,
    private readonly confirmationService: ConfirmationService, 
    private readonly dialog: MatDialog,) {
      
  }

  async ngOnInit() {
    this.shift = await this.shiftService.getShift();
    this.isShiftLoaded = true;
    if (this.shift && this.shift.isActive) {
      this.tables = this.tablesService.getTables();
    }
  }

  clear() {
    this.tablesService.clearTables();
    this.tables = this.tablesService.getTables();
  }

  openShift() {
    this.shiftService.newShift().then((shift) => this.shift = shift);
    this.tables = this.tablesService.getTables();
  }

  async closeShift() {
    if (this.shift) {
      let confirmCloseShift = false;
      if (this.shift.isActive && this.tables.length > 0) {
        const message = "Còn bàn chưa thanh toán, bạn chắc chắn muốn kết ca?";
        const dialogContent = {
          title: "Warning!",
          message
        } as DialogData;

        if (await this.confirmationService.confirm(dialogContent)) {
          confirmCloseShift = true;
        }
      } else {
        confirmCloseShift = true;
      }

      if (confirmCloseShift) {
        this.dialog.closeAll();
        this.dialog.open(ShiftControlComponent, {
          width: '800px',
        }).afterClosed().subscribe((result: boolean) => {
          if (result) {
            this.shiftService.closeShift();
            this.shift = undefined;
            this.tables = [];
            this.tablesService.clearTables();
          }
        });
      }
    }
  }
}
