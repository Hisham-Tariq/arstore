import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from "../../../services/Authentication";
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ReflectionUser} from "../../../interfaces";

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent implements OnInit {
  isUserVerified: boolean = false;
  @Output() onImageChange = new EventEmitter<File>();
  dragging: boolean = false;
  user: ReflectionUser | null = null;

  imagePath: string | ArrayBuffer = "";
  imageHovered: boolean = false;
  id!: string;
  currentFile: File | null;

  form = this.fb.group({
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    userName:[null, Validators.required],
    image: [null, Validators.required],
    description: [null, Validators.required],
    email: [null, Validators.required],
    password: [null, Validators.required],
    confirmPassword: [null, Validators.required],

  });


  onMouseOverImage() {
    if (!this.imageHovered) {
      this.imageHovered = true;
    }
  }

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.authService.authState$.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit(): void {
  }


  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragging = false;
  }

  goToAnaytics() {
    this.router.navigateByUrl('/admin/dashboard');
  }


  onFileChanged(event: any) {
    const files: File[] = event.target!.files;
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
    this.onImageChange.emit(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.imagePath = reader.result ?? "";
    }
  }
}
