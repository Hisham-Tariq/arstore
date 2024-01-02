import { Component } from '@angular/core';
import { ApiService } from './services/ApiBaseService/api.service';
import { StorageService } from './services/StorageService/Storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'reflection_store';

  constructor(
    private apiService: ApiService,
    private storageService: StorageService
  ) {
    this.apiService.get<CSRFResponse>('csrf-token').then((data) => {
      this.storageService.sessionStorage.setData('csrf-token', data.csrfToken);
    });
  }

  ngAfterViewInit() {}
}

interface CSRFResponse {
  csrfToken: string;
}
