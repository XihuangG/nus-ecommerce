import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Validators and FormBuilder
import { Product } from './model/manage-product.model';
import { ManageProductService } from './service/manage-product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-manage-product',
    templateUrl: './manage-product.component.html',
    styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent {
    productForm: FormGroup; // Define a FormGroup
    product: Product = { name: '', description: '', price: 0, pictureEncoded: '', availableStock: 10000 };

    constructor(private productService: ManageProductService, private toastr: ToastrService, private formBuilder: FormBuilder) {
        this.productForm = this.formBuilder.group({
            name: [this.product.name, Validators.required],
            description: [this.product.description, Validators.required],
            price: [this.product.price, [Validators.required, Validators.min(0)]],
            pictureEncoded: [this.product.pictureEncoded, Validators.required],
            availableStock: [this.product.availableStock, [Validators.required, Validators.min(0), Validators.max(10000)]]
        });
    }

    onImageUpload(event: any) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e: any) => {
            this.productForm.get('pictureEncoded').setValue(e.target.result);
        };

        reader.readAsDataURL(file);
    }

    onSubmit() {
        if (this.productForm.valid) {
            // Update the product object based on the form values
            this.product.name = this.productForm.get('name').value;
            this.product.description = this.productForm.get('description').value;
            this.product.price = this.productForm.get('price').value;
            this.product.pictureEncoded = this.productForm.get('pictureEncoded').value;
            this.product.availableStock = this.productForm.get('availableStock').value;

            // Only submit if the form is valid
            this.productService.addProduct(this.product).subscribe(
                () => {
                    // Product added successfully
                    this.toastr.success('Product added successfully', 'Success');
                    // Reset the form controls to their initial values
                    this.productForm.reset({
                        name: '',
                        description: '',
                        price: 0,
                        pictureEncoded: '',
                        availableStock: 10000
                    });
                },
                (error) => {
                    // Handle error if necessary
                    console.error('Error adding product:', error);
                    // Show an error notification if needed
                    this.toastr.error('Failed to add product', 'Error');
                }
            );

        }
    }
}
