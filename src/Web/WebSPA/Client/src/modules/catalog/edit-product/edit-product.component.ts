import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Product } from './model/edit-product.model';
import { EditProductService } from './service/edit-product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  productForm: FormGroup;
  product: Product;
  productId: string; // Hold the product ID from the route parameter

  constructor(
    private productService: EditProductService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute // Inject ActivatedRoute
  ) { }

  ngOnInit() {
    // Get the product ID from the route parameter
    this.productId = this.route.snapshot.paramMap.get('id');

    // Retrieve the product details for the given product ID and populate the form
    this.productService.getProductById(this.productId).subscribe(
      (product) => {
        console.log('Fetched product:', product);
        this.product = product;

        this.productForm = this.formBuilder.group({
          productId: [this.product.id],
          name: [this.product.name, Validators.required],
          description: [this.product.description, Validators.required],
          price: [this.product.price, [Validators.required, Validators.min(0)]],
          pictureEncoded: [this.product.pictureEncoded, Validators.required],
          availableStock: [
            this.product.availableStock,
            [Validators.required, Validators.min(0), Validators.max(10000)]
          ]
        });
      },
      (error) => {
        console.error('Error fetching product:', error);
        this.toastr.error('Failed to fetch product details', 'Error');
      }
    );
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      // Update the productForm with the new value
      this.productForm.get('pictureEncoded').setValue(e.target.result);
      // Update the product object with the new image data
      this.product.pictureEncoded = e.target.result;
    };

    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.productForm.valid) {
      // Update the product object based on the form values
      this.product.name = this.productForm.get('name').value;
      this.product.description = this.productForm.get('description').value;
      this.product.price = this.productForm.get('price').value;
      this.product.availableStock = this.productForm.get('availableStock').value;

      // Only submit if the form is valid
      this.productService.updateProduct(this.product).subscribe(
        () => {
          // Product updated successfully
          this.toastr.success('Product details updated successfully', 'Success');
        },
        (error) => {
          // Handle error if necessary
          console.error('Error updating product details:', error);
          // Show an error notification if needed
          this.toastr.error('Failed to update product details', 'Error');
        }
      );
    }
  }

}
