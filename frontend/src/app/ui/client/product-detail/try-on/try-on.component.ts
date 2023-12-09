import {Component, getPlatform, OnInit} from '@angular/core';
import {WebcamInitError, WebcamMirrorProperties} from "ngx-webcam";
import {MatDialogRef} from "@angular/material/dialog";
import {Platform} from "@angular/cdk/platform";

@Component({
  selector: 'app-try-on',
  templateUrl: './try-on.component.html',
  styleUrls: ['./try-on.component.scss']
})
export class TryOnComponent implements OnInit {
  isMobile!: boolean;

  width = 1440;
  height = 640;
  aspectRatio = 0.3333;
  videoOptions: MediaTrackConstraints = {
    aspectRatio: this.aspectRatio,
  };

  constructor(
    private _dialogRef: MatDialogRef<TryOnComponent>,
    private _platform: Platform,
    ) {
    this.isMobile = this._platform.ANDROID || this._platform.IOS || false;
    console.log(this.isMobile);
  }

  ngOnInit(): void {
  }

  public handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      console.warn("Camera access was not allowed by user!");
    }
  }
}
