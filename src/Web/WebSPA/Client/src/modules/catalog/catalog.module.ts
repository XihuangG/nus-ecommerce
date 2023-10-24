import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CatalogComponent } from './catalog.component';
import { CatalogService } from './catalog.service';
import { Pager } from '../shared/components/pager/pager';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { SearchProductComponent } from './search-product/search-product.component';
import { ViewProduct } from './view-product/view-product.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [BrowserModule, SharedModule, CommonModule, NgbModule],
    declarations: [CatalogComponent, ManageProductComponent, EditProductComponent, SearchProductComponent, ViewProduct],
    providers: [CatalogService],
    entryComponents: [ViewProduct]
})
export class CatalogModule { }
