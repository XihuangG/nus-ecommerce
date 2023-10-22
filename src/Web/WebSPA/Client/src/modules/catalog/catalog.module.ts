import { NgModule }             from '@angular/core';
import { BrowserModule  }       from '@angular/platform-browser';
import { CommonModule }         from '@angular/common'
import { SharedModule }         from '../shared/shared.module';
import { CatalogComponent }     from './catalog.component';
import { CatalogService }       from './catalog.service';
import { Pager }                from '../shared/components/pager/pager';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { SearchProductComponent } from './search-product/search-product.component';
import { ViewProduct } from './view-product/view-product.component';

@NgModule({
    imports: [BrowserModule, SharedModule, CommonModule],
    declarations: [CatalogComponent, ManageProductComponent, EditProductComponent, SearchProductComponent, ViewProduct],
    providers: [CatalogService]
})
export class CatalogModule { }
