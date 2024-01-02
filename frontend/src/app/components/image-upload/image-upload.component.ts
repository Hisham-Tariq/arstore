import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {

  @Output() onImageChange = new EventEmitter<File | null>();
  @Input() initialImage = '';
  dragging: boolean = false;
  imagePath: string | ArrayBuffer = "";
  imageHovered: boolean = false;
  id!: string;
  currentFile: File | null;
  fileName: string = '';

  onMouseOverImage() {
    if (!this.imageHovered) {
      this.imageHovered = true;
    }
  }

  constructor() {
    this.id = this.randomId();
  }

  ngOnInit(): void {
    if(this.initialImage !== '') {
      this.imagePath = this.initialImage;
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragging = false;
  }


  onFileChanged(event: any) {
    const files: File[] = event.target!.files;
    this.fileName = files[0].name;
    this.onImageChange.emit(files[0]);
    if (files.length === 0)
      return;
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imagePath = reader.result!;
    }
  }

  onDropped(data: DragEvent) {
    data.preventDefault();
    this.dragging = false;
    let {items} = data.dataTransfer!;
    let file: File | null = null;
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === "file") {
        file = items[i].getAsFile()!;
        break;
      }
    }

    if (file == null) return;
    this.fileName = file.name;
    this.onImageChange.emit(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.imagePath = reader.result ?? "";
    }
  }

  private randomId(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let name = '';

    for (let i = 0; i < 10; i++) {
      name += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return name;
  }

  deleteImage() {
    this.imagePath = '';
    this.onImageChange.emit(null);
  }
}
