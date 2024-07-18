import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { NameErrorStateMatcher } from '../core/name-error-state';
import { Product } from 'src/models/product.model';
import { CategoryStatic } from 'src/models/category';
import { RequestService } from 'src/services/request.service';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.less']
})
export class ProductManagementComponent implements OnInit {
  form: FormGroup = this.resetForm();

  matcher = new NameErrorStateMatcher();
  selectedProduct = {} as Product;
  products = [] as Product[];
  productsDataSource: MatTableDataSource<Product> = new MatTableDataSource();
  displayedColumns: string[] = ['name', 'price', 'category'];
  readonly categoryList = CategoryStatic;

  constructor(private readonly requestService: RequestService) {

  }

  ngOnInit(): void {
    this.requestService.getProducts().then((products) => {
      this.products = products;
      this.products.forEach(product => product.pureName = this.removeAccents(product.name));
      this.productsDataSource = new MatTableDataSource(this.products);
    });
  }

  submit(formDirective: FormGroupDirective) {
    if (this.form.valid) {
      if (!this.selectedProduct.id) {
        const product = _.cloneDeep(this.selectedProduct);
        this.requestService.addProduct(product).then(() => this.productsDataSource._updateChangeSubscription());
      } else {
        this.requestService.saveProducts(this.selectedProduct);
      }

      this.selectedProduct = {} as Product;
      formDirective.resetForm();
      this.form.reset();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.productsDataSource.filter = filterValue.trim().toLowerCase();
  }

  selectProduct(product: Product) {
    this.selectedProduct = product;
  }

  private resetForm() {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
    });
  }

  private removeAccents(name: string) {
    let pureName = name;
    var AccentsMap = [
      "aàảãáạăằẳẵắặâầẩẫấậ",
      "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
      "dđ", "DĐ",
      "eèẻẽéẹêềểễếệ",
      "EÈẺẼÉẸÊỀỂỄẾỆ",
      "iìỉĩíị",
      "IÌỈĨÍỊ",
      "oòỏõóọôồổỗốộơờởỡớợ",
      "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
      "uùủũúụưừửữứự",
      "UÙỦŨÚỤƯỪỬỮỨỰ",
      "yỳỷỹýỵ",
      "YỲỶỸÝỴ"    
    ];
    for (var i=0; i<AccentsMap.length; i++) {
      var re = new RegExp('[' + AccentsMap[i].slice(1) + ']', 'g');
      var char = AccentsMap[i][0];
      pureName = pureName.replace(re, char);
    }
    return pureName;
  }
}
