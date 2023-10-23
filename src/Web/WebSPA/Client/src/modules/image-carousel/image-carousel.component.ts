import { Component, OnInit, Input } from '@angular/core';
import { ICarouselImage } from 'modules/shared/models/carouselImage';

@Component({
    selector:'app-carousel-image',
    templateUrl:'./image-carousel.component.html',
    styleUrls: ['./image-carousel.component.scss']
})

export class ImageCarouselComponent implements OnInit{
    @Input() images: ICarouselImage [] = [];
    currentIndex = 0;
   
    constructor(){}
    ngOnInit():void{

    }
    goToPrevious(): void {
        const isFirstSlide = this.currentIndex === 0;
        const newIndex = isFirstSlide
          ? this.images.length - 1
          : this.currentIndex - 1;
      
        this.currentIndex = newIndex;
      }
      
      goToNext(): void {
        const isLastSlide = this.currentIndex === this.images.length - 1;
        const newIndex = isLastSlide ? 0 : this.currentIndex + 1;
      
        this.currentIndex = newIndex;
      }

    getCurrentSlideUrl() {
        return `url('${this.images[this.currentIndex].src}')`;
      }
    goToSlide(slideIndex: number): void {
        this.currentIndex = slideIndex;
    }
}