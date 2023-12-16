import {Component} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MainCategoryInterface, ProductInterface, SubCategoryInterface} from "src/app/interfaces";
import {ReflectionAlertType} from "src/app/components/alert";
import {reflectionAnimations} from "src/app/animations";
import {MainCategoryService} from "src/app/services/MainCategory/main-category.service";
import {SubCategoryService} from "src/app/services/SubCategory/sub-category.service";
import {ProductService} from "src/app/services/Product/product.service";
import {colors} from 'src/app/interfaces/colors';
import {randomId} from "../../../../utils";

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.scss'],
  animations: reflectionAnimations,
})
export class AddProductsComponent {
  alert: { type: ReflectionAlertType; message: string } = {
    type: "info",
    message: '',
  };
  showAlert: boolean = false;
  readonly allColors = colors;
  // Sub Category Data
  allSubCategories: SubCategoryInterface[] = [];
  subCategories: SubCategoryInterface[] = [];
  // Main Category Data
  mainCategories: MainCategoryInterface[] = [];
  // Gender Data
  readonly genders: string[] = ['Male', 'Female', 'Both'];
  private imagesName = ["model", "thumbnail", 'left', 'right']
  allImages: Map<string, ProductColorImages> = new Map<string, ProductColorImages>();

  readonly tagList = ["Newest", "Popular"];
  color: string = "#ffffff";

  selectedTags: string[] = [];
  selectedColors: string[] = [];
  imagesUploadCount: { [index: string]: number } = {};
  isProductDataUploaded = false;
  isAllImagesAreUploaded = false;
  isAddingProduct: boolean = false;
  productImagesDownloadUrls: { [index: string]: { [imageName: string]: string } } = {};
  private currentProductId: string;

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
  ) {
    mainCategoryService.data.subscribe(data => {
      this.mainCategories = data;
    });
    subCategoryService.data.subscribe(data => {
      this.allSubCategories = data;
    });
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


  addProduct() {
    let product: ProductInterface = {
      ...this.form.value,
      colors: this.selectedColors,
      isActive: true,
    };
    if (!this.form.valid) {
      this.showAlertOfWith('error', 'Please fill all the required fields');
      return;
    } else if (this.selectedColors.length == 0) {
      this.showAlertOfWith('error', 'Please add at least one color variant');
      return;
    } else if (!this.checkAllImagesAreChosen()) {
      this.showAlertOfWith('error', 'Please add all the images of the variants');
      return;
    }
    let productId = product.name.replace(" ", "") + "_" + randomId(10);
    this.currentProductId = productId;
    this.isAddingProduct = true;
    this.productService.add(product, productId).then(() => {
      this.isProductDataUploaded = true;
      this.showAlertOfWith('info', 'Product Data is Added, Now uploading the images');
      for (const selectedColor of this.selectedColors) {
        let images = this.allImages.get(selectedColor)!;
        this.imagesUploadCount[selectedColor] = 0;
        this.imagesName.forEach(name => {
          // this.productService.uploadImage(images[name as keyof ProductColorImages]!, productId, selectedColor, name).subscribe(
          //   value => this.onImageUploaded(value, selectedColor, name),
          // );
        });
      }
      this.showAlertOfWith('success', 'All Images are uploaded successfully');
    });
  }

  // async onImageUploaded(uploadSnap: UploadTaskSnapshot, selectedColor: string, type: string) {
  //   if (uploadSnap.state === "success") {
  //     this.imagesUploadCount[selectedColor]++;
  //     console.log(this.imagesUploadCount[selectedColor], selectedColor, this.imagesUploadCount)
  //     if (typeof this.productImagesDownloadUrls[selectedColor] === "undefined") {
  //       this.productImagesDownloadUrls[selectedColor] = {};
  //     }
  //     this.productImagesDownloadUrls[selectedColor][type] = await getDownloadURL(uploadSnap.ref);
  //     this.checkAllImagesAreUploaded();
  //   }
  // }

  checkAllImagesAreUploaded(): boolean {
    for (const color in this.selectedColors) {
      if (this.imagesUploadCount[color] < 4) return false;
    }
    this.isAllImagesAreUploaded = true;
    // this.productService.addImagesUrls(this.productImagesDownloadUrls, this.currentProductId).then(value => {
    //   console.log(value);
    // })

    return true;
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



  checkAllImagesAreChosen(): boolean {
    for (const selectedColor of this.selectedColors) {
      if (typeof this.allImages.get(selectedColor) == "undefined") return false;
      else {
        const variantImages = this.allImages.get(selectedColor)!;
        for (const name of this.imagesName) {
          if (typeof variantImages[name as keyof ProductColorImages] == "undefined") return false;
        }
      }
    }
    return true;
  }

  onImageChange(image: File | null, colorName: string, type: string) {
    if (typeof this.allImages.get(colorName) == "undefined")
      this.allImages.set(colorName, {
        model: null,
        thumbnail: null,
        left: null,
        right: null,
      });
    this.allImages.get(colorName)![type as keyof ProductColorImages] = image;
  }

  resetUI() {
    this.isAddingProduct = false;
    this.isProductDataUploaded = false;
    this.isAllImagesAreUploaded = false;
    this.allImages.clear();
    this.selectedColors = [];
    this.selectedTags = [];

  }

  getColorCodeByName(name: string) {
    return this.allColors.find(color => color.name == name)!.hex;
  }


  addColor() {
    if(this.selectedColors.includes(this.color)){
      this.showAlertOfWith('error', 'This color is already added');
      return;
    }
    this.selectedColors.push(this.color);
  }
}


interface ProductColorImages {
  model: File | null;
  thumbnail: File | null;
  left: File | null;
  right: File | null;
}
