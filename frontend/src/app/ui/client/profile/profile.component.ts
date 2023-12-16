import {Component, OnDestroy, OnInit} from '@angular/core';
import {navItems} from "./profile.navigations";
import {AuthService} from "../../../services/Authentication";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  navItems = navItems;
  isUserVerified: boolean = false;

  constructor(
    private authService: AuthService,
  ) {

  }

  ngOnInit(): void {
    document.body.classList.add('bg-gray-50');
  }

  ngOnDestroy() {
    document.body.classList.remove('bg-gray-50');
  }

  logOut() {
  }
}
