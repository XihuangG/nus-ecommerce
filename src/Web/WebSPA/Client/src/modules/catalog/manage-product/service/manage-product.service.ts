import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../model/manage-product.model';
import { DataService } from 'modules/shared/services/data.service';
import { ConfigurationService } from 'modules/shared/services/configuration.service';

@Injectable({
    providedIn: 'root',
})
export class ManageProductService {
    private products: Product[] = [];
    private productsSubject = new BehaviorSubject<Product[]>([]);

    private catalogUrl: string = '';

    constructor(private http: HttpClient, private service: DataService, private configurationService: ConfigurationService) {
        this.configurationService.settingsLoaded$.subscribe(x => {
            this.catalogUrl = this.configurationService.serverSettings.purchaseUrl + '/c/api/v1/catalog/items';
        });
    }

    getProducts() {
        return this.productsSubject.asObservable();
    }

    addProduct(product: Product): Observable<Product> {
        
        // API endpoint:
        const apiUrl = this.catalogUrl;

        // Send a PUT request to the API with the product data
        return this.http.put<Product>(apiUrl, product);
    }
}