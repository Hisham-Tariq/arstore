import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Platform} from "@angular/cdk/platform";
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Inject } from '@angular/core';
import {getBlob, ref} from "@firebase/storage"

// import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import {
  createDetector,
  Face,
  FaceLandmarksDetector,
  Keypoint,
  MediaPipeFaceMeshTfjsEstimationConfig,
  SupportedModels,
} from '@tensorflow-models/face-landmarks-detection';
import {ProductItem} from "../../../interfaces";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {take} from "lodash-es";
import {getStorage} from "@angular/fire/storage";


@Component({
  selector: 'app-try-on-product',
  templateUrl: './try-on-product.component.html',
  styleUrls: ['./try-on-product.component.scss']
})
export class TryOnProductComponent implements OnInit, AfterViewInit,OnDestroy {
  @ViewChild('video') public tryOnWebCam: ElementRef;
  @ViewChild('canvas') public tryOnCanvas: ElementRef;
  @ViewChild('eyesImage') public lensImage: ElementRef;
  @ViewChild("productPrice") productPriceView: any;
  @ViewChild("modelLoader") modelLoader: ElementRef;
  // model: FaceLandmarksDetector;
  model: FaceLandmarksDetector;
  renderLoop: any;
  isMobile!: boolean;
  stream: MediaStream;
  isWebcamAccessAllowed: boolean = false;
  predictedFace: Face;

  get videoHeight() {
    return this.tryOnWebCam.nativeElement.videoHeight;
  }

  get videoWidth() {
    return this.tryOnWebCam.nativeElement.videoWidth;
  }

  get video(): HTMLVideoElement {
    return this.tryOnWebCam.nativeElement;
  }

  get canvas(): HTMLCanvasElement {
    return this.tryOnCanvas.nativeElement;
  }

  get ctx(): CanvasRenderingContext2D {
    return this.canvas.getContext('2d')!;
  }

  set selectedColor(color: string) {
    this.data.selectedColor = color;
    this.updateProductPrice();
  }
  get selectedColor(): string {
    return this.data.selectedColor;
  }
  get product() {
    return this.data.product;
  }

  get modelImageUrl(): string {
    return this.product.images[this.selectedColor]['model'] as string
  }

  thumbnailUrl(color: string) {
    return this.product.images[color]['model']
  }


  get currentStockPrice(){
    return this.product;
  }

  get retailPrice() {
    return this.product.stock[this.selectedColor].retailerPrice;
  }

  get discountedPrice() {
    return this.retailPrice - ((this.retailPrice * this.product.discount) / 100);
  }

  updateProductPrice() {
    if (this.product.discount == 0) {
      this.productPriceView.nativeElement.innerText = 'RS. ' + this.discountedPrice;
    } else {
      this.productPriceView.nativeElement.innerHTML = `<del>RS. ${this.retailPrice}</del> RS. ${this.discountedPrice} `;
    }
  }



  constructor(
    private _platform: Platform,
    private http: HttpClient,
    public dialogRef: MatDialogRef<TryOnProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {product: ProductItem, selectedColor: string, addToCart: Function}
  ) {
    this.isMobile = this._platform.ANDROID || this._platform.IOS || false;

  }

  ngOnInit(): void {
  }

  public async ngAfterViewInit(): Promise<void> {
    this.updateProductPrice();
    await this.setupCamera();
    this.model = await this.loadFaceLandmarkDetectionModel();
    // let httpOptions = {
    //   headers: new HttpHeaders()
    // };
    //
    // httpOptions.headers.append('Access-Control-Allow-Origin', '*');
    // this.http.request('GET', this.modelImageUrl, httpOptions).subscribe(res => {
    //   console.log(res);
    // });
    // this.http.request('POST', this.modelImageUrl).subscribe(res => {
    //   // @ts-ignore
    //   let imagePath = res['name'];
    //   console.log(res);
    //   let imageRef = ref(getStorage(), imagePath);
    //   getBlob(imageRef).then(blob => {
    //     console.log(blob);
    //   });
    //
    // });
    this.renderPrediction();
  }



  private async setupCamera() {
    this.stream = await navigator.mediaDevices.getUserMedia({video: true});
    this.video.srcObject = this.stream;
    return new Promise((resolve) => {
      this.video.onloadedmetadata = () => {
        this.video.width = this.videoWidth;
        this.video.height = this.videoHeight;
        this.canvas.width = this.videoWidth;
        this.canvas.height = this.videoHeight;
        resolve(this.video);
      };
    });
  }


  async loadFaceLandmarkDetectionModel(): Promise<FaceLandmarksDetector> {
    // return await mobilenet.load();
    return createDetector(
      SupportedModels.MediaPipeFaceMesh,
      {
        runtime: "mediapipe",
        maxFaces: 1,
        refineLandmarks: true,
        solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh"
      }
    )
  }


  async renderPrediction() {
    this.modelLoader.nativeElement.style.display = 'none';
    requestAnimationFrame(() => this.renderPrediction());
    const predictions = await this.model.estimateFaces(
      this.video,
      <MediaPipeFaceMeshTfjsEstimationConfig>{
        staticImageMode: false,
      }
    );
    if(predictions.length < 1) return;
    this.predictedFace = predictions[0];
    this.video.crossOrigin = 'anonymous';
    this.ctx.drawImage(this.video, 0, 0, this.video.width, this.video.height, 0, 0, this.canvas.width, this.canvas.height);

    if(this.product.mainCategoryDetail.name.toLowerCase() == "glasses"){
      this.drawGlasses()
    } else if(this.product.mainCategoryDetail.name.toLowerCase() == "lenses") {
      this.drawLens();
    } else{
      alert("Not Supported yet");
    }
  }

  drawGlasses(){
    let keyPoints = this.predictedFace.keypoints;
    let heightOfGlasses = this.distanceBetweenTwoKeyPoints(keyPoints[70], keyPoints[123]);
    let widthOfGlasses = this.distanceBetweenTwoKeyPoints(keyPoints[70], keyPoints[276]);
    // let x = keyPoints[70].x - 20;
    // let y = keyPoints[70].y;
    // this.drawPointOnCanvasAt(keyPoints[70]);
    // this.drawPointOnCanvasAt(keyPoints[123]);
    // this.drawPointOnCanvasAt(keyPoints[276]);
    // this.drawPointOnCanvasAt(keyPoints[352]);
    //
    // this.drawLineFromToKeypoint(keyPoints[70], keyPoints[123]);
    // this.drawLineFromToKeypoint(keyPoints[70], keyPoints[276]);
    // this.drawLineFromToKeypoint(keyPoints[276], keyPoints[352]);
    // this.drawLineFromToKeypoint(keyPoints[123], keyPoints[352]);


    let angle = 0;
    if(keyPoints[70].y < keyPoints[276].y){
      // find the angle of the triangle formed by b and c and c is the widthOfGlasses
      let b = this.distanceBetweenTwoKeyPoints(keyPoints[70], {x: keyPoints[70].x, y: keyPoints[276].y});
      // find angle between b and a
      angle = Math.asin(b / widthOfGlasses);
    } else {
      // find the angle of the triangle formed by the two points widthOfGlasses is the Hypotenuse
      let a = this.distanceBetweenTwoKeyPoints(keyPoints[70], {x: keyPoints[276].x, y: keyPoints[70].y});
      angle = 2*Math.PI - Math.acos(a/widthOfGlasses);
    }

    this.ctx.save();
    this.ctx.translate(keyPoints[70].x - 20, keyPoints[70].y - 10);
    this.ctx.rotate(angle);
    // this.ctx.translate(-keyPoints[70].x,-keyPoints[70].y);
    // this.ctx.drawImage(image,0,0);
    let img = this.modelImageElement;
    img.classList.add("brightness-200");
    this.ctx.drawImage(img, 0 , 0, widthOfGlasses + 40, heightOfGlasses + 10);
    this.ctx.restore();

    // draw the image from keyPoints[70].x to keyPoints[276].x and keyPoints[70].y to keyPoints[111].y
  }

  drawLens() {
    let keyPoints = this.predictedFace.keypoints;
    let eyeRadius = this.distanceBetweenTwoKeyPoints(keyPoints[468], keyPoints[470]);
    let isLeftEyeClosed = this.distanceBetweenTwoKeyPoints(keyPoints[159], keyPoints[145]) < 9;
    let isRightEyeClosed = this.distanceBetweenTwoKeyPoints(keyPoints[386], keyPoints[374]) < 9;

    if (!isLeftEyeClosed) this.putLens(keyPoints[468].x, keyPoints[468].y, eyeRadius);
    if (!isRightEyeClosed) this.putLens(keyPoints[473].x, keyPoints[473].y, eyeRadius);
  }

  putLens(x: number, y: number, radius: number) {
    let eyeSize = (radius * 2);
    this.ctx.globalAlpha = 0.4;
    this.ctx.drawImage(this.modelImageElement, x - radius, y - radius, eyeSize, eyeSize);
    this.ctx.globalAlpha = 1;
  }

  // get glassesImageEl(): HTMLImageElement{
  //   let img = document.createElement("img");
  //   img.src = "assets/glasses1.png";
  //   return img;
  // }

  get modelImageElement(): HTMLImageElement {
    let img = document.createElement("img");
    // get the image using https://www.flaticon.com/free-icon/glasses_16087
    img.src=this.modelImageUrl;
    img.crossOrigin = "anonymous";
    // let httpOptions = {
    //   headers: new HttpHeaders()
    // };
    //
    // httpOptions.headers.append('Access-Control-Allow-Origin', '*');
    // this.http.request('POST', this.modelImageUrl, httpOptions).subscribe(res => {
    //   console.log(res);
    // });
    return img;
  }

  // get glassesImageEl(): HTMLImageElement{
  //   let img = document.createElement("img");
  //   img.src = "assets/glasses1.png";
  //   img.height = h;
  //   img.width = w;
  //   return img;
  // }
  //
  // get lensImageEl(): HTMLImageElement {
  //   let img = document.createElement("img");
  //   img.src = this.modelImageUrl.toString();
  //   return img;
  // }



  distanceBetweenTwoKeyPoints(pointA: Keypoint, pointB: Keypoint): number {
    const a = pointA.x - pointB.x;
    const b = pointA.y - pointB.y;
    return Math.sqrt(a * a + b * b);
  }

  distanceBetweenTwoKeyPointsXAxis(pointA: Keypoint, pointB: Keypoint): number {
    const a = pointA.x - pointB.x;
    return a;
    const b = pointA.y - pointB.y;
    return Math.sqrt(a * a + b * b);
  }

  drawPointOnCanvasAt(keyPoint: Keypoint){
    this.ctx.beginPath();
    this.ctx.arc(keyPoint.x, keyPoint.y, 5, 0, 2 * Math.PI);
    this.ctx.fillStyle = 'red';
    this.ctx.fill();
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = '#003300';
    this.ctx.stroke();
  }

  drawLineFromToKeypoint(pointA: Keypoint, pointB: Keypoint){
    this.ctx.beginPath();
    this.ctx.moveTo(pointA.x, pointA.y);
    this.ctx.lineTo(pointB.x, pointB.y);
    this.ctx.stroke();
  }



  ngOnDestroy() {
    if(this.renderLoop){
      clearInterval(this.renderLoop);
    }
    if(this.stream){
      this.stream.getTracks().forEach(track => track.stop());
    }
  }

  saveImage() {
    // save the canvas image
    this.canvas.toBlob(function(blob) {
      TryOnProductComponent.saveAs(blob, "my-image.png");
    });
    // this.saveAs();
  }

  private static saveAs(image: Blob | null, imageName: string) {
    if (!image) {
      console.error('Cannot download image that doesn\'t exist!');
      return;
    }
    const link = document.createElement('a');
    link.download = imageName;
    link.href = URL.createObjectURL(image);
    link.click();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}

const ImageDataToBlob = function(imageData: ImageData) {
  let w = imageData.width;
  let h = imageData.height;
  let canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  let ctx = canvas.getContext("2d")!;
  ctx.putImageData(imageData, 0, 0);        // synchronous

  return new Promise((resolve, reject) => {
    canvas.toBlob(resolve); // implied image/png format
  })
}


