import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { ConfigurationService } from '../shared/services/configuration.service';
import { ICatalog } from '../shared/models/catalog.model';
import { ICatalogBrand } from '../shared/models/catalogBrand.model';
import { ICatalogType } from '../shared/models/catalogType.model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ICatalogItem } from 'modules/shared/models/catalogItem.model';

@Injectable()
export class CatalogService {
    private catalogUrl: string = '';
    private brandUrl: string = '';
    private typesUrl: string = '';
    private productUrl: string = '';

    constructor(private service: DataService, private configurationService: ConfigurationService) {
        this.configurationService.settingsLoaded$.subscribe(x => {
            this.catalogUrl = this.configurationService.serverSettings.purchaseUrl + '/c/api/v1/catalog/items';
            this.brandUrl = this.configurationService.serverSettings.purchaseUrl + '/c/api/v1/catalog/catalogbrands';
            this.typesUrl = this.configurationService.serverSettings.purchaseUrl + '/c/api/v1/catalog/catalogtypes';
            this.productUrl = this.configurationService.serverSettings.purchaseUrl + 'c/api/v1/Catalog/items/search/';
        });
    }

    getCatalog(pageIndex: number, pageSize: number, brand: number, type: number): Observable<ICatalog> {
        let url = this.catalogUrl;

        if (type) {
            url = this.catalogUrl + '/type/' + type.toString() + '/brand/' + ((brand) ? brand.toString() : '');
        }
        else if (brand) {
            url = this.catalogUrl + '/type/all' + '/brand/' + ((brand) ? brand.toString() : '');
        }

        url = url + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize;

        return this.service.get(url).pipe<ICatalog>(tap((response: any) => {
            return response;
        }));
    }

    getRecommendItems(id: number): Observable<string[]> {
        let url = " http://127.0.0.1:5000";
        if (id == null) {
            url = url + "/recommend/null";
        }
        else {
            url = url + "/recommend/" + id;
        }

        return this.service.getRecommendedItems(url).pipe<string[]>(tap((response: string[]) => {
            return response;
        }))
    }

    getSearch(text: string): Observable<ICatalog> {
        let url = this.catalogUrl;
        url = url + '/search/' + text + '?pageSize=15&pageIndex=0';
        return this.service.getSearchText(url).pipe<ICatalog>(tap((response: any) => {
            return response;
        }))
    }

    getBrands(): Observable<ICatalogBrand[]> {
        return this.service.get(this.brandUrl).pipe<ICatalogBrand[]>(tap((response: any) => {
            return response;
        }));
    }

    getTypes(): Observable<ICatalogType[]> {
        return this.service.get(this.typesUrl).pipe<ICatalogType[]>(tap((response: any) => {
            return response;
        }));
    };

    getProduct(id: number): Observable<ICatalogItem> {
        return this.service.get(this.catalogUrl + "/" + id).pipe<ICatalogItem>(tap((response: any) => {
            return response;
        }))
    }
}