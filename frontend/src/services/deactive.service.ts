import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";
import { TableDetailComponent } from "src/app/table-detail/table-detail.component";
import { DialogData } from "src/models/dialog-data.model";
import { ConfirmationService } from "./confirmation.service";

@Injectable({providedIn: 'root'})
export class DeactiveService implements CanDeactivate<TableDetailComponent> {
    constructor(private readonly confirmationService: ConfirmationService) {}

    async canDeactivate(target: TableDetailComponent) {
        if (target.hasChanges && !target.table?.id) {
            const dialogContent = {
                title: "Warning!",
                message: "Bàn chưa được lưu. Hủy bỏ thay đổi?"
            } as DialogData;

            return await this.confirmationService.confirm(dialogContent);
        }

        return true;
    }
}