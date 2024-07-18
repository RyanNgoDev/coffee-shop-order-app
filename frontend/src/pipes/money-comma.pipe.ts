import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'comma' })
export class MoneyCommaPipe implements PipeTransform {
    public transform(money: number | undefined) {
        return money?.toLocaleString();
    }
}