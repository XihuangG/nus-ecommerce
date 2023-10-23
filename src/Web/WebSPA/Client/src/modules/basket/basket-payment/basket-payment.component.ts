import { Component, OnInit, Input }    from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { SecurityService } from 'modules/shared/services/security.service';
import { BasketWrapperService } from 'modules/shared/services/basket.wrapper.service';
import { BasketService } from 'modules/basket/basket.service';
import { IBasket } from 'modules/shared/models/basket.model';
import { IBasketItem } from 'modules/shared/models/basketItem.model';

@Component({
    selector: 'payment-qr',
    styleUrls: ['./basket-payment.component.scss'],
    templateUrl: './basket-payment.component.html'
})

export class Payment implements OnInit{
    @Input() fromParent;

    totalPrice: number = 0;

    constructor(public activeModal:NgbActiveModal){

    }

    ngOnInit(): void {
        console.log(this.fromParent);
         this.totalPrice = this.fromParent;
       
    }

    closeModal(sendData){
        this.activeModal.close(sendData);
    }

}