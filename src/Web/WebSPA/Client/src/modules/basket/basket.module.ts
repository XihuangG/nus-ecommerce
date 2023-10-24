import { NgModule, ModuleWithProviders }                     from '@angular/core';
import { BrowserModule  }               from '@angular/platform-browser';

import { SharedModule }                 from '../shared/shared.module';
import { BasketComponent }              from './basket.component';
import { BasketStatusComponent }        from './basket-status/basket-status.component';
import { BasketService }                from './basket.service';
import { Header }                from '../shared/components/header/header';
import { Payment } from './basket-payment/basket-payment.component';

@NgModule({
    imports: [SharedModule],
    declarations: [BasketComponent, BasketStatusComponent, Payment],
    providers: [BasketService],
    exports: [BasketStatusComponent],
    entryComponents: [Payment]
})
export class BasketModule {
    static forRoot(): ModuleWithProviders<BasketModule> {
        return {
            ngModule: BasketModule,
            providers: [
                // Providers
                BasketService
            ]
        };
    }
}
