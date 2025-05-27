import { Component, Input, OnInit } from '@angular/core';
import { IDocument } from 'src/app/interfaces/IDocument';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent  implements OnInit {
  @Input() mode: "reader" | "normal" = "normal";
  @Input() docRef!: IDocument | undefined;
  
  constructor() { }
  ngOnInit() {}
}
