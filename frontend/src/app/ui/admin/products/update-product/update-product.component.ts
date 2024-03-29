import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ReflectionAlertType} from "../../../../components/alert";
import {reflectionAnimations} from "../../../../animations";
import {MainCategoryInterface, Product, SubCategoryInterface} from "../../../../interfaces";
import {colors} from "../../../../interfaces/colors";
import {MainCategoryService} from "../../../../services/MainCategory/main-category.service";
import {SubCategoryService} from "../../../../services/SubCategory/sub-category.service";
import {ProductColorImages, ProductService, UpdateVariantData} from "../../../../services/Product/product.service";
import {ActivatedRoute} from "@angular/router";
import {prod} from "@tensorflow/tfjs-core";

@Component({
  selector: 'app-update-product-dialog',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss'],
  animations: reflectionAnimations,
})
export class UpdateProductComponent {
  alert: { type: ReflectionAlertType; message: string } = {
    type: "info",
    message: '',
  };
  showAlert: boolean = false;
  readonly allColors = colors;
  product: Product;
  // Sub Category Data
  allSubCategories: SubCategoryInterface[] = [];
  subCategories: SubCategoryInterface[] = [];
  // Main Category Data
  mainCategories: MainCategoryInterface[] = [];
  // Gender Data
  readonly genders: string[] = ['Male', 'Female', 'Both'];
  private imagesName = ["model", "thumbnail", 'left', 'right']
  allImages: { [color: string]: { [imageName: string]: File | null } } = {};
  color: string = "#ffffff";
  selectedColors: string[] = [];
  imagesUploadCount = 0;
  isUpdatingProduct: boolean = false;
  newColors: string[] = [];
  deleteColors: string[] = [];
  variantsData: UpdateVariantData[] = [];
  productImagesDownloadUrls: { [index: string]: { [imageName: string]: string } } = {};

  form = this.fb.group({
    name: ['', Validators.required],
    gender: [null, Validators.required],
    mainCategory: [null, Validators.required],
    subCategory: [null, Validators.required],
    // tags: [null, Validators.required],
    description: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private mainCategoryService: MainCategoryService,
    private subCategoryService: SubCategoryService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
  ) {
    if (history.state.hasOwnProperty('product')) {
      this.product = history.state.product;
      this.variantsData = this.product.variants;
      this.setProductInitialValues();
      mainCategoryService.data.subscribe(data => {
        this.mainCategories = data;
      });
      subCategoryService.data.subscribe(data => {
        this.allSubCategories = data;
        this.onMainCategoryChange();
        this.subCategory?.setValue(this.product.subCategory.id);
      });
    } else {
      this.activatedRoute.paramMap.subscribe(params => {
        productService.getProductById(params.get('pid')!).then((product) => {
          this.product = product;
          this.variantsData = product.variants;
          console.log(this.variantsData)
          this.setProductInitialValues();
          mainCategoryService.data.subscribe(data => {
            this.mainCategories = data;
          });
          subCategoryService.data.subscribe(data => {
            this.allSubCategories = data;
            this.onMainCategoryChange();
            this.subCategory?.setValue(this.product.subCategory.id);
          });
        });
      });
    }

  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  setProductInitialValues() {
    this.name?.setValue(this.product.name);
    this.gender?.setValue(this.product.genders);
    this.mainCategory?.setValue(this.product.mainCategory.id);
    this.subCategory?.setValue(this.product.subCategory.id);
    // this.tags?.setValue(this.product.tags);
    this.onMainCategoryChange();
    this.description?.setValue(this.product.description);
    this.selectedColors = this.product.colors;
  }

  get name() {
    return this.form.get('name');
  }

  get gender() {
    return this.form.get('gender');
  }

  get mainCategory() {
    return this.form.get('mainCategory');
  }

  get subCategory() {
    return this.form.get('subCategory');
  }

  get description() {
    return this.form.get('description');
  }

  //
  // get tags() {
  //   return this.form.get('tags');
  // }

  get hexColors(): string[] {
    return this.allColors.map(color => color.hex);
  }

  onMainCategoryChange() {
    const {mainCategory} = this.form.value;
    this.subCategories = this.allSubCategories.filter(value => value.mainCategoryId == mainCategory);
    this.form.get('subCategory')!.setValue(null);
  }


  updateProduct() {
    if (!this.form.valid) {
      this.showAlertOfWith('error', 'Please fill all the required fields');
      return;
    } else if (this.selectedColors.length == 0) {
      this.showAlertOfWith('error', 'Please add at least one color variant');
      return;
    } else if (!this.validVariantData()) {
      this.showAlertOfWith('error', 'Please fill all the variant data, price, name and quantity also variant name must be unique as well');
      return;
    } else if (!this.checkAllImagesAreChosen()) {
      this.showAlertOfWith('error', 'Please add all the images of the variants');
      return;
    }
    this.isUpdatingProduct = true;
    this.imagesUploadCount = 0;
    this.productService.updateProduct(this.product.id, {
      ...this.form.value,
      genders: this.gender?.value,
      variants: this.variantsData,
    }).then(async () => {
      for (const color in this.allImages) {
        const variantName = this.variantsData.find(value => value.colorCode == color)!.name;
        for (const imageType in this.allImages[color]) {
          await this.productService.uploadProductImage(
            this.product.id,
            variantName,
            imageType,
            this.allImages[color][imageType as keyof ProductColorImages]!
          )
          this.imagesUploadCount++;
        }
      }
      this.showAlertOfWith('success', 'Product is updated successfully');
      this.isUpdatingProduct = false;
    })
  }

  // async onImageUploaded(uploadSnap: UploadTaskSnapshot, selectedColor: string, type: string) {
  //   if (uploadSnap.state === "success") {
  //     // @ts-ignore
  //     if (this.newColors.includes(selectedColor) && typeof this.product.images[selectedColor] == 'undefined') {
  //       this.product.images[selectedColor] = {};
  //     }
  //     this.product.images[selectedColor][type] = await getDownloadURL(uploadSnap.ref);
  //     this.imagesUploadCount++;
  //     this.product.colors = this.selectedColors;
  //     if (this.imagesUploadCount == this.totalImagesChanged) {
  //       console.log(this.totalImagesChanged, this.product.images);
  //       this.productService.update({
  //         ...this.product,
  //         ...this.form.value,
  //       }, this.deleteColors).then(() => {
  //         this.showAlertOfWith('success', 'All Images are uploaded successfully');
  //         this.isUpdatingProduct = false;
  //       });
  //     }
  //   }
  // }


  checkAllImagesAreChosen(): boolean {
    for (const color of this.selectedColors) {
      if (this.newColors.includes(color)) {
        // then all 4 images must be chosen specified in imagesName
        for (const name of this.imagesName) {
          if (typeof this.allImages[color] == 'undefined' || !(name in this.allImages[color])) return false;
          else if (this.allImages[color][name] == null) return false;
        }
      } else {
        for (const name in this.allImages[color]) if (this.allImages[color][name] == null) return false;
      }
    }
    return true;
  }

  onImageChange(image: File | null, colorName: string, type: string) {
    if (!(colorName in this.allImages)) this.allImages[colorName] = {};
    this.allImages[colorName][type] = image;
  }

  get totalImagesChanged(): number {
    let total = 0;
    for (const color in this.allImages) for (const name in this.allImages[color]) total++;
    return total;
  }


  addColor() {
    if (this.selectedColors.includes(this.color)) {
      this.showAlertOfWith('error', 'This color is already added');
      return;
    }
    this.selectedColors.push(this.color);
    this.variantsData.push({
      name: '',
      colorCode: this.color,
      price: 0,
      stock: 0,
      images: {},
    })
    if (this.deleteColors.includes(this.color)) {
      this.deleteColors.splice(this.deleteColors.indexOf(this.color), 1);
    } else {
      this.newColors.push(this.color);
    }
  }

  getInitialImage(color: string, name: string) {
    // if color is in newColors then return empty
    if (this.newColors.includes(color)) return '';
    const variant = this.product.variants.find(value => value.colorCode == color)!;
    return variant.images[name as keyof typeof variant.images];
    // for (const variant of this.product.variants) {
    //   if (variant.colorCode == color) {
    //     return variant.images[name as keyof typeof variant.images];
    //   }
    // }
    // return this.product.variants[color][name]
  }


  showAlertOfWith(type: ReflectionAlertType, message: string, withTimeout: boolean = true) {
    this.alert.type = type;
    this.alert.message = message;
    this.showAlert = true;
    if (withTimeout) {
      this.startAlertTimeout();
    }
  }

  startAlertTimeout(time: number = 5000) {
    setTimeout(() => {
      this.showAlert = false;
    }, time);
  }

  onDismissedChanged(e: any) {
    this.showAlert = !e;
  }

  deleteColor(item: any) {
    this.selectedColors.splice(this.selectedColors.indexOf(item), 1);
    this.variantsData.splice(this.variantsData.findIndex(value => value.colorCode == item), 1);
    if (this.newColors.includes(item)) {
      this.newColors.splice(this.selectedColors.indexOf(item), 1)
    } else {
      this.deleteColors.push(item);
    }
  }

  indexOfVariant(colorCode: string) {
    return this.variantsData.findIndex(value => value.colorCode == colorCode);
  }

  onColorNameChange(event: any, colorCode: string) {
    const colorName = event.target.value;
    let variantIndex = this.indexOfVariant(colorCode)
    if (variantIndex == -1) {
      this.variantsData.push({
        colorCode: colorCode,
        name: colorName,
        price: 0,
        stock: 0,
        images: {},
      });
    } else {
      this.variantsData[variantIndex].name = colorName;
    }
  }

  onColorPriceChange(event: any, colorCode: string) {
    const price = event.target.value;
    let variantIndex = this.indexOfVariant(colorCode)
    if (variantIndex == -1) {
      this.variantsData.push({
        colorCode: colorCode,
        name: '',
        price: price,
        stock: 0,
        images: {},
      });
    } else {
      this.variantsData[variantIndex].price = price;
    }
  }

  onColorQtyChange(event: any, colorCode: string) {
    const qty = event.target.value;
    let variantIndex = this.indexOfVariant(colorCode)
    if (variantIndex == -1) {
      this.variantsData.push({
        colorCode: colorCode,
        name: '',
        price: 0,
        stock: qty,
        images: {},
      });
    } else {
      this.variantsData[variantIndex].stock = qty;
    }
  }

  getVariantName(item: string) {
    return this.variantsData.find(value => value.colorCode == item)?.name
  }

  getVariantPrice(item: string) {
    return this.variantsData.find(value => value.colorCode == item)?.price
  }

  getVariantQty(item: string) {
    return this.variantsData.find(value => value.colorCode == item)?.stock
  }

  validVariantData(): boolean {
    for (const variant of this.variantsData) {
      if (variant.name == '' || variant.price == 0 || variant.stock == 0) return false;
    }
    // also check if the variant name is unique
    const variantNames = this.variantsData.map(value => value.name);
    const uniqueVariantNames = new Set(variantNames);
    return variantNames.length == uniqueVariantNames.size;
  }
}

