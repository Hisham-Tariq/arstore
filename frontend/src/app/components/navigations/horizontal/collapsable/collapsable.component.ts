import {Component, Input, OnInit} from '@angular/core';
import {NavItem} from "../../navigation.type";
import {Router} from "@angular/router";
import * as $ from 'jquery'
import {EventHandlerVars} from "@angular/compiler/src/compiler_util/expression_converter";
@Component({
  selector: 'collapsable-horizontal-nav-item',
  templateUrl: './collapsable.component.html',
  styleUrls: ['../style.scss']
})
export class CollapsableHorizontalNavItemComponent implements OnInit {
  @Input() item!: NavItem;


  constructor(
    private _router:Router,
  ) {
  }

  onItemClicked(link: String){
    this._router.navigateByUrl(link.toString());
  }

  ngOnInit(): void {

  }

}
