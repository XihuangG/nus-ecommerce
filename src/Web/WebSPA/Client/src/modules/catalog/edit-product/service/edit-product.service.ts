import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../model/edit-product.model';
import { DataService } from 'modules/shared/services/data.service';
import { ConfigurationService } from 'modules/shared/services/configuration.service';
import { tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';


@Injectable({
    providedIn: 'root',
})
export class EditProductService {
    private products: Product[] = [];
    private productsSubject = new BehaviorSubject<Product[]>([]);

    private catalogUrl: string = '';
    private settingsLoadedSubject: Subject<boolean> = new Subject<boolean>();

    constructor(private http: HttpClient, private service: DataService, private configurationService: ConfigurationService) {
        this.configurationService.settingsLoaded$.subscribe(x => {
            this.catalogUrl = this.configurationService.serverSettings.purchaseUrl + '/c/api/v1/catalog/items';
            this.settingsLoadedSubject.next(true); // Notify subscribers that settings have been loaded
        });
    }

    getProducts() {
        return this.productsSubject.asObservable();
    }

    getProductById(productId: string): Observable<Product> {
        return this.settingsLoadedSubject.pipe(
            filter(loaded => loaded), // Wait until settings are loaded
            take(1), // Ensure it only gets the value once
            switchMap(() => {
                const apiUrl = `${this.catalogUrl}/${productId}`;
                // Send a GET request to the API to fetch the product
                return this.http.get<Product>(apiUrl).pipe(
                    catchError((error) => {
                        console.error('Error fetching product:', error); // Log the error for debugging purposes
                        return throwError('Failed to fetch product'); // Return a custom error message or handle the error as needed
                    })
                );
            })
        );
    }

    getProduct(id: string): Observable<Product> {
        return this.service.get(this.catalogUrl + "/" + id).pipe<Product>(tap((response: any) => {
            return response;
        }))
    }

    updateProduct(product: Product): Observable<Product> {

        // API endpoint:
        const apiUrl = this.catalogUrl;

        // Send a POST request to the API with the product data
        return this.http.post<Product>(apiUrl, product);
    }

}