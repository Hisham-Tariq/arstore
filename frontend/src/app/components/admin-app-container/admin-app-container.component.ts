import {Component, OnInit} from '@angular/core';
import {adminNavItems} from './data';
import {NavItem} from '../navigations/navigation.type';
import {reflectionAnimations} from '../../animations/index';
import {AuthService} from "../../services/Authentication";
import {ReflectionUser} from "../../interfaces";

@Component({
  selector: 'app-admin-app-container',
  templateUrl: './admin-app-container.component.html',
  styleUrls: ['./admin-app-container.component.scss'],
  animations: reflectionAnimations,
})
export class AdminAppContainerComponent implements OnInit {
  navigations: NavItem[] = adminNavItems;
  isCollapsed = false;
  user: ReflectionUser | null;

  constructor(
    public authService: AuthService,
  ) {
    this.authService.authState$.subscribe((user) => {
      this.user = user;
    })
  }

  ngOnInit(): void {
  }

  toggleExpand() {
    this.isCollapsed = !this.isCollapsed;
  }
}
