import { Component, Input, OnInit, SimpleChanges }    from '@angular/core';
import { CatalogService } from '../catalog.service';
import { ICatalog } from 'modules/shared/models/catalog.model';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router';
import { ConfigurationService } from 'modules/shared/services/configuration.service';


@Component({
    selector: 'app-search-product',
    templateUrl: './search-product.component.html',
    styleUrls: ['./search-product.component.scss']
})

export class SearchProductComponent implements OnInit{

    catalog:ICatalog;
    id: string = '';
    errorReceived: boolean;

    constructor(private route: ActivatedRoute, private service:CatalogService, private router:Router, private configurationService:ConfigurationService){
    }
    ngOnInit() {
        this.route.paramMap.subscribe( paramMap => {
            this.id = paramMap.get('text');
            console.log(this.id);
        })
        this.getCatalog();
    }

    search(searchText){
        ("Initializing....")
        console.log(searchText.value);
        this.router.navigate(['search/',searchText.value],
        {queryParams: {pageSize:15,
                    pageIndex:0}});

        this.ngOnInit();
    }

    getCatalog() {
        this.errorReceived = false;
        this.service.getSearch(this.id)
            .subscribe(catalog => {
                this.catalog = catalog;
                console.log(catalog);
        });
    }
}