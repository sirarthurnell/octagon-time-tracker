import { Component, ViewChild, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PAGES_LIST, PageData } from '../../app/pages-list';

@Component({
  selector: 'page-menu',
  templateUrl: 'page-menu.component.html'
})
export class PageMenuComponent {
  @ViewChild('navigation') nav: NavController;
  @Input() currentPage: string;
  title = '';
  pages = PAGES_LIST;

  ionViewDidLoad() {
    this.pages.find(page => page.name === this.currentPage);
    this.nav.setRoot(this.currentPage);
  }

  /**
   * Navigates to the specified page.
   * @param pageData Page data.
   */
  navigateTo(pageData: PageData): void {
    this.nav.setRoot(pageData.name);
  }
}
