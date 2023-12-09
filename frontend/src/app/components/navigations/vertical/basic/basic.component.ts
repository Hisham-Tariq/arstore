import {
  AfterContentInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {NavItem} from '../../navigation.type';
import {randomId} from "../../../../utils";
import { Router } from '@angular/router';
import {Subscription} from "rxjs";

@Component({
  selector: 'basic-vertical-nav-item',
  templateUrl: './basic.component.html',
  styleUrls: ['../style.scss'],
})
export class BasicVerticalNavItemComponent implements OnInit, AfterContentInit, OnDestroy {
  @Input() item!: NavItem;
  @Output() onItemClicked = new EventEmitter();
  id = randomId();
  @ViewChild('navigationItem') navigationItem: ElementRef<HTMLDivElement>;
  urlChangeSubscription: Subscription;

  constructor(
    private router: Router,
  ) {
    this.urlChangeSubscription = this.router.events
      .pipe(
        // filter(event => event instanceof NavigationEnd || event instanceof NavigationStart)
      )
      .subscribe((ev) => {
        // console.log(ev instanceof );
        // remove the first / from the url
        const url = this.router.url.substring(1);
        if(this.item.link == url){
          this.navigationItem.nativeElement.classList.add('v-item-active');
        } else {
          this.navigationItem.nativeElement.classList.remove('v-item-active');
        }
      });
  }

  ngOnInit(): void {
  }


  ngAfterContentInit(): void {
    document.querySelectorAll('img.svg').forEach(function(img){
      var imgID = img.id;
      var imgClass = img.className;
      var imgURL = img.getAttribute('src');
      if(imgURL == null) return;
      fetch(imgURL).then(function(response) {
        return response.text();
      }).then(function(text){

        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(text, "text/xml");

        // Get the SVG tag, ignore the rest
        var svg = xmlDoc.getElementsByTagName('svg')[0];

        // Add replaced image's ID to the new SVG
        if(typeof imgID !== 'undefined') {
          svg.setAttribute('id', imgID);
        }
        // Add replaced image's classes to the new SVG
        if(typeof imgClass !== 'undefined') {
          svg.setAttribute('class', imgClass+' replaced-svg');
        }

        // Remove any invalid XML tags as per http://validator.w3.org
        svg.removeAttribute('xmlns:a');

        // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
        if(!svg.getAttribute('viewBox') && svg.getAttribute('height') && svg.getAttribute('width')) {
          svg.setAttribute('viewBox', '0 0 ' + svg.getAttribute('height') + ' ' + svg.getAttribute('width'))
        }

        // Replace image with new SVG
        if(img.parentNode == null) return;
        img.parentNode.replaceChild(svg, img);
        svg.style.fill = 'currentColor';
      });

    });
  }

  itemClicked() {
    this.router.navigateByUrl(this.item.link as string);
    this.onItemClicked.emit()
  }

  ngOnDestroy() {
    this.urlChangeSubscription.unsubscribe();
  }
}
