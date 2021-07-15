import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import {  NbSidebarModule, NbSidebarService, NbMenuItem } from '@nebular/theme';
import { MENU_ITEMS } from './pages-menu';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  constructor(private readonly sidebarService: NbSidebarService) {
  }
  
  toggleSidebar(): boolean {
    this.sidebarService.toggle(true);
    return false;
  }

  items= MENU_ITEMS;

}
