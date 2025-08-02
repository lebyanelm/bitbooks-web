import { AfterContentInit, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDocumentData } from 'src/app/interfaces/IDocumentData';
import { AudioService } from 'src/app/services/audio.service';
import { DocumentService } from 'src/app/services/document.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-viewer-controller',
  templateUrl: './viewer-controller.component.html',
  styleUrls: ['./viewer-controller.component.scss'],
  standalone: false
})
export class ViewerControllerComponent  implements OnInit {
  @Input() docData!: IDocumentData;
  
  // Element refs
  @ViewChild("VoicesContainer") voicesContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChild("ProgressRateSlider") progressRateSliderRef!: ElementRef<HTMLInputElement>;

  // Flags
  isVoicesPanelOpen = false;
  isSpeakingRatePanelOpen = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private docService: DocumentService,
    public audio: AudioService
  ) {
  }

  ngOnInit() {}

  toggleVoicesPanel(forcedState: boolean | undefined = undefined) {
    if (forcedState !== undefined) {
      this.isVoicesPanelOpen = forcedState;
      return this.isVoicesPanelOpen;
    }
    this.isVoicesPanelOpen = !this.isVoicesPanelOpen;
    return this.isVoicesPanelOpen;
  }

  toggleSpeakingRatePanel(forcedState: boolean | undefined = undefined) {
    if (forcedState !== undefined) {
      this.isSpeakingRatePanelOpen = forcedState;
      return this.isSpeakingRatePanelOpen;
    }
    this.isSpeakingRatePanelOpen = !this.isSpeakingRatePanelOpen;
    return this.isSpeakingRatePanelOpen;
  }
}
