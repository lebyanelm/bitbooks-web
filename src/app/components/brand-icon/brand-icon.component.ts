import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-brand-icon',
  templateUrl: './brand-icon.component.html',
  styleUrls: ['./brand-icon.component.scss'],
  standalone: false
})
export class BrandIconComponent  implements AfterViewInit {
  @ViewChild("brandIcon") brandIcon!: ElementRef<SVGAElement>;
  @Input("size") size!: string;
  @Input("color") color!: string;

  constructor() {}

  ngAfterViewInit() {
    if (this.size) {
      this.brandIcon.nativeElement.style.width = this.size;
    } if (this.color) {
      this.brandIcon.nativeElement.style.fill = this.color;
    }
  }
}
