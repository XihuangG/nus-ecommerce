import { Routes, RouterModule } from '@angular/router';

import { BasketComponent } from './basket/basket.component';
import { CatalogComponent } from './catalog/catalog.component';
import { OrdersComponent } from './orders/orders.component';
import { OrdersDetailComponent } from './orders/orders-detail/orders-detail.component';
import { OrdersNewComponent } from './orders/orders-new/orders-new.component';
import { ManageProductComponent } from './catalog/manage-product/manage-product.component';
import { EditProductComponent } from './catalog/edit-product/edit-product.component';
import { SearchProductComponent } from './catalog/search-product/search-product.component';

export const routes: Routes = [
    { path: '', redirectTo: 'catalog', pathMatch: 'full' },
    { path: 'basket', component: BasketComponent },
    { path: 'catalog', component: CatalogComponent },
    { path: 'orders', component: OrdersComponent },
    { path: 'orders/:id', component: OrdersDetailComponent },
    { path: 'order', component: OrdersNewComponent },
    { path: 'manage-product', component: ManageProductComponent },
    { path: 'edit-product/:id', component: EditProductComponent },
    { path: 'manage-product', component: ManageProductComponent },
    { path: 'search/:text', component: SearchProductComponent}
];

export const routing = RouterModule.forRoot(routes, {});