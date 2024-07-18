import { Pipe, PipeTransform } from '@angular/core';
import { CategoryStatic } from 'src/models/category';

@Pipe({ name: 'category' })
export class CategoryPipe implements PipeTransform {
    public transform(categoryId: number) {
        const currentCategory = CategoryStatic.find(category => category.id === categoryId);
        return currentCategory?.name;
    }
}