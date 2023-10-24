import { Component, OnInit, Input } from '@angular/core';
import { ICatalogItem } from 'modules/shared/models/catalogItem.model';
import { CatalogService } from '../catalog.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SecurityService } from 'modules/shared/services/security.service';
import { BasketWrapperService } from 'modules/shared/services/basket.wrapper.service';
import { BasketService } from 'modules/basket/basket.service';
import { IBasket } from 'modules/shared/models/basket.model';
import { IBasketItem } from 'modules/shared/models/basketItem.model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'view-product-info',
    styleUrls: ['./view-product.component.scss'],
    templateUrl: './view-product.component.html'
})

export class ViewProduct implements OnInit {
    @Input() fromParent;

    item: ICatalogItem;
    authenticated: boolean = false;
    basket: IBasket;
    basketItems: IBasketItem[];
    itemCount: number = 0;
    itemCountBefore: number = 0;
    imageSrc: string = '';

    constructor(private service: CatalogService, public activeModal: NgbActiveModal, private securityService: SecurityService, private basketWrapperService: BasketWrapperService,
        private basketService: BasketService, private toastr: ToastrService) {
        this.authenticated = securityService.IsAuthorized;
    }

    ngOnInit(): void {
        console.log(this.fromParent);
        this.item = this.fromParent;
        this.basketService.getBasket().subscribe(basket => {
            this.basket = basket;

            for (let i = 0; i < basket.items.length; i++) {
                if (basket.items[i].productId === this.fromParent.id) {
                    this.itemCount = this.basket.items[i].quantity;
                    this.itemCountBefore = this.basket.items[i].quantity;
                }
            }
        });
    }

    addToCart(count) {
        if (!this.authenticated) {
            return;
        }

        //add Product to cart
        console.log(count.value);
        const x = count.value;
        for (let i = 0; i < x; i++) {
            this.basketWrapperService.addItemToBasket(this.item);
        }

        // Show success message
        this.toastr.success('Product added to cart', 'Success');

        // Close the view-product modal
        this.closeModal(true);
    }

    closeModal(sendData) {
        this.activeModal.close(sendData);
    }

}