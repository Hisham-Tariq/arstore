import {Component, OnDestroy, OnInit} from '@angular/core';
import {navItems} from "./profile.navigations";
import {AuthService} from "../../../services/Authentication";
import {Auth} from "@angular/fire/auth";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  navItems = navItems;
  isUserVerified: boolean = false;

  constructor(
    private auth: Auth,
    private authService: AuthService,
  ) {
    this.auth.onAuthStateChanged(value => {
      if (value) {
        this.isUserVerified = value.emailVerified;
      }
    });
  }

  ngOnInit(): void {
    document.body.classList.add('bg-gray-50');
  }

  ngOnDestroy() {
    document.body.classList.remove('bg-gray-50');
  }

  logOut() {
    this.authService.logout();
  }
}
