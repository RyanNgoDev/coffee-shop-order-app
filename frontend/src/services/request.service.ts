import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { HttpRequestService } from "src/app/core/services/http-request.service";
import { Coupon } from "src/models/coupon.model";
import { GetOrdersRequest } from "src/models/get-orders-request.model";
import { Order } from "src/models/order.model";
import { Product } from "src/models/product.model";
import { Shift } from "src/models/shift.model";

@Injectable({
    providedIn: 'root',
})
export class RequestService {
    public products: Product[] = []; //remove later
    private readonly productsStorageKey = 'products'; //remove later
    private readonly apiUrl = 'http://chiu.com/server';
    constructor(private readonly httpRequestService: HttpRequestService) {
        // const localProducts = localStorage.getItem(this.productsStorageKey); //remove later
        // if (localProducts) { //remove later
        //     this.products = JSON.parse(localProducts) as Product[]; //remove later
        // } //remove later
    }


    //PRODUCT
    public async addProduct(product: Product) { //edit later
        await firstValueFrom(this.httpRequestService.postJson(product, `${this.apiUrl}/api/Product`)).then(
            (addedProduct) => addedProduct ? console.log('success') : console.log('fail')
        );
    }

    public getProducts(): Promise<Product[]> {
        return firstValueFrom(this.httpRequestService.getJson(`${this.apiUrl}/api/Product`));
    }

    genId() { //remove later
        return this.products.length > 0 ? Math.max(...this.products.map(product => product.id)) + 1 : 1;  //remove later
    }

    public saveProducts(product: Product) {
        firstValueFrom(this.httpRequestService.putJson(product, `${this.apiUrl}/api/Product/${product.id}`));
    }

    public deleteProduct(product: Product) {
        firstValueFrom(this.httpRequestService.delete(`${this.apiUrl}/api/Product/${product.id}`));
    }


    //SHIFT
    public openShift(shift: Shift) : Promise<Shift | never[]> {
        return firstValueFrom(this.httpRequestService.postJson(shift, `${this.apiUrl}/api/Shift`));
    }

    public getCurrentShift() : Promise<Shift> {
        return firstValueFrom(this.httpRequestService.getJson(`${this.apiUrl}/api/Shift`));
    }

    public closeShift(shift: Shift) {
        firstValueFrom(this.httpRequestService.putJson(shift, `${this.apiUrl}/api/Shift/${shift.id}`));
    }

    //ORDER
    public addOrder(order: Order) {
        firstValueFrom(this.httpRequestService.postJson(order, `${this.apiUrl}/api/order/add-order`));
    }

    public getOrderByShift(shiftId: number): Promise<Order[]> {
        return firstValueFrom(this.httpRequestService.getJson(`${this.apiUrl}/api/order/${shiftId}`));
    }

    public getLastestOrderByShift(shiftId: number): Promise<Order> {
        return firstValueFrom(this.httpRequestService.getJson(`${this.apiUrl}/api/order/lastest/${shiftId}`));
    }

    public getOrderByDate(request: GetOrdersRequest): Promise<Order[]> {
        return firstValueFrom(this.httpRequestService.postJson(request, `${this.apiUrl}/api/order/Get-order-by-date`));
    }

    public getCurrentTime(): Promise<string> {
        return firstValueFrom(this.httpRequestService.getJson(`${this.apiUrl}/api/order/get-current-time`));
    }

    //Coupon
    public getAllCoupons(): Promise<Coupon[]> {
        return firstValueFrom(this.httpRequestService.getJson(`${this.apiUrl}/api/coupon`));
    }
}