import { Injectable } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from "rxjs";
import { AlertDialogComponent } from "src/app/core/alert-dialog/alert-dialog.component";
import { ConfirmationDialogComponent } from "src/app/core/confirmation-dialog/confirmation-dialog.component";
import { DialogData } from "src/models/dialog-data.model";

@Injectable({providedIn: 'root'})
export class ConfirmationService {
    constructor(public dialog: MatDialog) {}

    async confirm(content: DialogData) {
        this.dialog.closeAll();
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '500px',
            data: content
        })

        return await firstValueFrom(dialogRef.afterClosed())
        .then((result: boolean) => {
          return Promise.resolve(result);
        });
    }

    async alert(content: DialogData) {
        this.dialog.open(AlertDialogComponent, {
            width: '500px',
            data: content
        });
    }
}