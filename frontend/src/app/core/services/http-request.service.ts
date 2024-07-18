import { BlockUIService } from './block-ui.service';
import { catchError, map } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators'
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfirmationService } from 'src/services/confirmation.service';
import { DialogData } from 'src/models/dialog-data.model';

@Injectable(
    {providedIn: 'root'}
)
export class HttpRequestService {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly blockUIService: BlockUIService,
        private readonly confirmationService: ConfirmationService) {
    }

    public postJson<T>(object: object, url: string, blockUI = true): Observable<T | never[]> {
        this.blockUIService.startBlock(blockUI);
        const body = JSON.stringify(object);
        const headers = new HttpHeaders ({
            'Content-Type': 'application/json'
        });
        const option = {headers};

        return this.httpClient.post(url, body, option)
            .pipe(map((response) => blockUI ? this.parseResponse(response) : response),
                catchError((error) => blockUI ? this.handleError(error) : of([])));
    }

    public getJson<T>(url: string): Observable<T> {
        return this.httpClient.get(url)
            .pipe(map((response) => this.parseResponse(response)),
                catchError((error) => this.handleError(error)));
    }

    public putJson<T>(object: object, url: string, blockUI = true): Observable<T | never[]> {
        this.blockUIService.startBlock(blockUI);
        const body = JSON.stringify(object,);
        const headers = new HttpHeaders ({
            'Content-Type': 'application/json'
        });
        const option = {headers};

        return this.httpClient.put(url, body, option)
            .pipe(map((response) => blockUI ? this.parseResponse(response) : response),
                catchError((error) => blockUI ? this.handleError(error) : of([])));
    }

    public delete<T>(url: string, blockUI = true): Observable<T | never[]> {
        this.blockUIService.startBlock(blockUI);

        return this.httpClient.delete(url)
            .pipe(map((response) => blockUI ? this.parseResponse(response) : response),
                catchError((error) => blockUI ? this.handleError(error) : of([])));
    }

    private parseResponse(response: any) {
        this.blockUIService.stopBlock();
        return response;
    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 403 || error.status === 401) {
            alert(error.error);
            window.parent.location.href = "Auth/LogOut";
        }
        else {
            const dialogMessage = {
                title: 'Xảy ra Lỗi',
                message: 'Đã xảy ra lỗi, vui lòng liên hệ người quản trị'
            } as DialogData;
            this.confirmationService.alert(dialogMessage);
        }

        return throwError(() => error);
    }

   
}