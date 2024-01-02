import { Injectable } from '@angular/core';

import {Product, SubCategoryInterface} from "src/app/interfaces";
import {BehaviorSubject, firstValueFrom, Observable} from "rxjs";
import {ApiService} from "../ApiBaseService/api.service";

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {
  private endpoint = 'sub-categories';
  subCategoriesSubject = new BehaviorSubject<SubCategoryInterface[]>([]);
  data = this.subCategoriesSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.getSubCategories();
  }

  async getSubCategories(): Promise<SubCategoryInterface[]> {
    const subCategories = await this.apiService.get<SubCategoryInterface[]>(this.endpoint);
    this.subCategoriesSubject.next(subCategories);
    return subCategories;
  }

  getSubCategoryById(subCategoryId: string): Promise<SubCategoryInterface> {
    return this.apiService.get<SubCategoryInterface>(`${this.endpoint}/${subCategoryId}`);
  }

  async createSubCategory(name: string, description: string, mainCategoryId: string): Promise<SubCategoryInterface> {
    const data = { name, description, mainCategoryId };
    const subCategory = await this.apiService.post<SubCategoryInterface>(this.endpoint, data);
    const oldData = this.subCategoriesSubject.getValue();
    oldData.push(subCategory);
    this.subCategoriesSubject.next(oldData);
    return subCategory;
  }

  async updateSubCategory(subCategoryId: string, name: string, description: string, mainCategoryId: string): Promise<SubCategoryInterface> {
    const data = { name, description, mainCategoryId };
    const subCategory = await this.apiService.put<SubCategoryInterface>(`${this.endpoint}/${subCategoryId}`, data);
    const oldData = this.subCategoriesSubject.getValue();
    const index = oldData.findIndex(x => x.id === subCategoryId);
    oldData[index] = subCategory;
    this.subCategoriesSubject.next(oldData);
    return subCategory;
  }

  async deleteSubCategory(subCategoryId: string): Promise<{ message: string }> {
    const deleteResponse = await this.apiService.delete<{ message: string }>(`${this.endpoint}/${subCategoryId}`);
    const oldData = this.subCategoriesSubject.getValue();
    const index = oldData.findIndex(x => x.id === subCategoryId);
    oldData.splice(index, 1);
    this.subCategoriesSubject.next(oldData);
    return deleteResponse;
  }

  deleteFromMainCategory(mainCategoryId: string) {
    // collectionData(query(this.collectionReference, where('mainCategoryId', '==', mainCategoryId)))
    //   .subscribe(data => {
    //     data.forEach(item => {
    //       this.delete(item.id!);
    //     });
    //   });
  }
}
