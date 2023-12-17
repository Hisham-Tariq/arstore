import {Injectable, Injector} from '@angular/core';

import {BehaviorSubject, firstValueFrom, Observable} from "rxjs";
import {MainCategoryInterface} from "../../interfaces";
import {ProductService} from "../Product/product.service";
import {ApiService} from "../ApiBaseService/api.service";

@Injectable({
  providedIn: 'root'
})
export class MainCategoryService {
  private endpoint = 'main-categories'; // Adjust the endpoint based on your API routes
  mainCategoriesSubject = new BehaviorSubject<MainCategoryInterface[]>([]);
  data = this.mainCategoriesSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.getMainCategories();
  }


  async getMainCategories(): Promise<MainCategoryInterface[]> {
    const categories = await this.apiService.get<MainCategoryInterface[]>(this.endpoint);
    this.mainCategoriesSubject.next(categories);
    return categories;
  }

  getMainCategoryById(mainCategoryId: string): Promise<MainCategoryInterface> {
    return this.apiService.get<MainCategoryInterface>(`${this.endpoint}/${mainCategoryId}`);
  }


  async createMainCategory(name: string, description: string): Promise<MainCategoryInterface> {
    const data = {name, description};
    const mc = await this.apiService.post<MainCategoryInterface>(this.endpoint, data);

    const oldData = this.mainCategoriesSubject.getValue()
    oldData.push(mc)
    this.mainCategoriesSubject.next(oldData);
    return mc;
  }


  async updateMainCategory(mainCategoryId: string, name: string, description: string): Promise<MainCategoryInterface> {
    const data = {name, description};
    const mc = await this.apiService.put<MainCategoryInterface>(`${this.endpoint}/${mainCategoryId}`, data);
    const oldData = this.mainCategoriesSubject.getValue()
    const index = oldData.findIndex(x => x.id === mainCategoryId);
    oldData[index] = mc;
    this.mainCategoriesSubject.next(oldData);
    return mc;
  }

  async deleteMainCategory(mainCategoryId: string): Promise<{ message: string }> {
    const dc = await this.apiService.delete<{ message: string }>(`${this.endpoint}/${mainCategoryId}`);
    const oldData = this.mainCategoriesSubject.getValue()
    const index = oldData.findIndex(x => x.id === mainCategoryId);
    oldData.splice(index, 1);
    this.mainCategoriesSubject.next(oldData);
    return dc;
  }
}
