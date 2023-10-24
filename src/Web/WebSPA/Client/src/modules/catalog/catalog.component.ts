import { Component, OnInit } from '@angular/core';
import { Observable, Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CatalogService } from './catalog.service';
import { ConfigurationService } from '../shared/services/configuration.service';
import { ICatalog } from '../shared/models/catalog.model';
import { ICatalogItem } from '../shared/models/catalogItem.model';
import { ICatalogType } from '../shared/models/catalogType.model';
import { ICatalogBrand } from '../shared/models/catalogBrand.model';
import { IPager } from '../shared/models/pager.model';
import { BasketWrapperService } from '../shared/services/basket.wrapper.service';
import { SecurityService } from '../shared/services/security.service';
import { ICarouselImage } from 'modules/shared/models/carouselImage';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewProduct } from './view-product/view-product.component';
import { Router } from '@angular/router';

@Component({
    selector: 'esh-catalog .esh-catalog .mb-5',
    styleUrls: ['./catalog.component.scss'],
    templateUrl: './catalog.component.html'
})
export class CatalogComponent implements OnInit {
    brands: ICatalogBrand[];
    types: ICatalogType[];
    catalog: ICatalog;
    brandSelected: number;
    typeSelected: number;
    paginationInfo: IPager;
    authenticated: boolean = false;
    authSubscription: Subscription;
    errorReceived: boolean;
    recommended: string[];
    filteredCatalogsItem: ICatalogItem[] = [];
    recommendedItems: ICatalogItem[] = [];

    parentImages: ICarouselImage[] = [
        {
            src: '/assets/images/header.jpg',
            caption: 'Standard digital clock',
            alt: ''
        },
        {
            src: '/assets/images/logo.svg',
            caption: 'Digital clock with date, weather, and steps',
            alt: ''
        },
        {
            src: '/assets/images/smart-ecommerce.jpg',
            caption: 'Pokemon themed watch face',
            alt: '',
        }
    ];


    constructor(private service: CatalogService, private basketService: BasketWrapperService, private configurationService: ConfigurationService,
        private securityService: SecurityService, private modalService: NgbModal, private router: Router) {
        this.authenticated = securityService.IsAuthorized;
    }

    ngOnInit() {
        // Configuration Settings:
        if (this.configurationService.isReady)
            this.loadData();
        else
            this.configurationService.settingsLoaded$.subscribe(x => {
                this.loadData();
            });

        // Subscribe to login and logout observable
        this.authSubscription = this.securityService.authenticationChallenge$.subscribe(res => {
            this.authenticated = res;
            if (this.authenticated) {
                console.log(1);
                console.log(this.getRecommendedItems(1));
            }
            else {
                console.log(0);
                console.log(this.getRecommendedItems(0));
            }
        });
    }

    loadData() {
        this.getBrands();
        this.getCatalog(12, 0);
        this.getTypes();
        this.getRecommendedItems(1);
    }

    onFilterApplied(event: any) {
        event.preventDefault();
        this.brandSelected = this.brandSelected && this.brandSelected.toString() != "null" ? this.brandSelected : null;
        this.typeSelected = this.typeSelected && this.typeSelected.toString() != "null" ? this.typeSelected : null;
        this.paginationInfo.actualPage = 0;
        this.getCatalog(this.paginationInfo.itemsPage, this.paginationInfo.actualPage, this.brandSelected, this.typeSelected);
    }

    onPageChanged(value: any) {
        console.log('catalog pager event fired' + value);
        event.preventDefault();
        this.paginationInfo.actualPage = value;
        this.getCatalog(this.paginationInfo.itemsPage, value);
    }

    addToCart(item: ICatalogItem) {
        if (!this.authenticated) {
            return;
        }
        this.basketService.addItemToBasket(item);
    }

    getRecommendedItems(id: number) {
        this.service.getRecommendItems(id).subscribe((recommended: string[]) => {
            this.recommended = recommended;
            this.initializeFilter(this.recommended);
        });
    }

    initializeFilter(arr: string[]): ICatalogItem[] {
        for (let i = 0; i < 12; i++) {
            this.service.getProduct(parseInt(arr[i])).subscribe(res => {
                this.recommendedItems.push(res);
                this.filteredCatalogsItem.push(res);
                console.log(res);
            })
        }
        return this.filteredCatalogsItem;
    }

    search(searchText) {
        ("Initializing....")
        console.log(searchText.value);
        this.router.navigate(['search/', searchText.value],
            {
                queryParams: {
                    pageSize: 15,
                    pageIndex: 0
                }
            });
    }

    getCatalog(pageSize: number, pageIndex: number, brand?: number, type?: number) {
        this.errorReceived = false;
        this.service.getCatalog(pageIndex, pageSize, brand, type)
            .pipe(catchError((err) => this.handleError(err)))
            .subscribe(catalog => {
                this.catalog = catalog;
                this.paginationInfo = {
                    actualPage: catalog.pageIndex,
                    itemsPage: catalog.pageSize,
                    totalItems: catalog.count,
                    totalPages: Math.ceil(catalog.count / catalog.pageSize),
                    items: catalog.pageSize
                };
            });

    }

    open(item: ICatalogItem) {
        const modal = this.modalService.open(ViewProduct, { size: 'md', backdrop: 'static', centered: true });
        modal.componentInstance.fromParent = item;
        modal.result.then((result) => {
            console.log(result);
        })
    }

    getTypes() {
        this.service.getTypes().subscribe(types => {
            this.types = types;
            let alltypes = { id: null, type: 'All' };
            this.types.unshift(alltypes);
        });
    }


    getBrands() {
        this.service.getBrands().subscribe(brands => {
            this.brands = brands;
            let allBrands = { id: null, brand: 'All' };
            this.brands.unshift(allBrands);
        });
    }

    private handleError(error: any) {
        this.errorReceived = true;
        return throwError(() => error);
    }
}

