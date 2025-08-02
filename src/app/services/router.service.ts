import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { INavigation } from '../interfaces/INavigation';

@Injectable({
  providedIn: 'root'
})
export class RouterService {
  navList: INavigation[] = [];
  NAV_HISTORY_MAX = 10;
  constructor(private router: Router) { }
  goto(url: string[], params: {} | undefined = undefined, data: any = undefined) {
    this.addToNavList({ url, params, data });
    this.router.navigate(url, { state: {data}, queryParams: params });
  }
  addToNavList(nav: INavigation) {
    this.navList.push(nav);
    if (this.navList.length > this.NAV_HISTORY_MAX) {
      this.navList = this.navList.splice(0, 1);
    }
  }
}
