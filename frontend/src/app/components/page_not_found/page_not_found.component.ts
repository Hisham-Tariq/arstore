import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
@Component({
  selector: 'app-page-not-found',
  templateUrl: './page_not_found.component.html',
  styleUrls: ['./page_not_found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNotFoundComponent {
  constructor() {
    console.log('PageNotFoundComponent');
  }
}

