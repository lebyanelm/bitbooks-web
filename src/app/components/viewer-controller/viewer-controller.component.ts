import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import IVoice from 'src/app/interfaces/IVoice';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-viewer-controller',
  templateUrl: './viewer-controller.component.html',
  styleUrls: ['./viewer-controller.component.scss'],
  standalone: false
})
export class ViewerControllerComponent  implements OnInit, AfterViewInit {
  // Element refs
  @ViewChild("VoicesContainer") voicesContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChild("ProgressRateSlider") progressRateSliderRef!: ElementRef<HTMLInputElement>;

  // Flags
  isVoicesPanelOpen = false;
  isSpeakingRatePanelOpen = false;
  isDragging = false;
  isPlaying = false;

  // Attributes
  voices: IVoice[] = [];
  currentMood!: string;
  currentSpeakingRate!: number;

  // User actions controlled
  temporaryPlayer: HTMLAudioElement = new Audio();
  temporaryPreviewMood!: string;

  constructor() {
    this.getAvailableVoices();

    // Load user preferences
    const userSpeakerMood = window.localStorage.getItem("default-mood-voice") || "friendly",
          userSpeakingRate = window.localStorage.getItem("default-speaking-rate") || "1";
    this.setCurrentMood(userSpeakerMood);
    this.currentSpeakingRate = this.parseFloat(userSpeakingRate);
  }

  ngOnInit() {}

  toggleVoicesPanel(forcedState: boolean | undefined = undefined) {
    if (forcedState !== undefined) {
      this.isVoicesPanelOpen = forcedState;
      return this.isVoicesPanelOpen;
    }
    this.isVoicesPanelOpen = !this.isVoicesPanelOpen;
    this.temporaryPlayer.pause();
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

  getAvailableVoices() {
    return fetch([environment.backend, 'assets', 'voices.json'].join('/'), { method: "GET" })
      .then((response) => {
        if (response.status === 200) {
          response.json().then((body) => {
            this.voices = body;
            setTimeout(() => this.activateSpeakerPreview(), 500);
          });
        }
      })
  }

  setCurrentMood(mood: string) {
    this.currentMood = mood.toLowerCase();
    this.toggleVoicesPanel(false);
    window.localStorage.setItem("default-mood-voice", mood);
  }

  activateSpeakerPreview() {
    const voicePreviews = document.querySelectorAll(".voice-preview");
    voicePreviews.forEach((voicePreviewElement) => {
      voicePreviewElement.addEventListener("mouseenter", () => {
        const voicePreviewMood = voicePreviewElement.getAttribute("data-mood");
        if (voicePreviewMood) {
          if (this.temporaryPreviewMood !== voicePreviewMood) {
            this.temporaryPreviewMood = voicePreviewMood;
            voicePreviewElement.setAttribute("data-is-preview", "true");
            this.playPreview(this.temporaryPreviewMood);
          }
        }
      });
    })
  }

  playPreview(mood: string) {
    const source = [environment.backend, 'assets', 'audios', 'voice_samples', `${mood}.wav`].join("/");
    this.temporaryPlayer.src = source;
    this.temporaryPlayer.load();
    this.temporaryPlayer.volume = 1;
    this.temporaryPlayer.play();
  }

  updateSpeakingRate(): void {
    // const value = this.parseFloat(this.speakRateSliderRef.nativeElement.value);
    // if (value < 0.5) {
    //   this.speakRateSliderRef.nativeElement.value = "0.5";
    // } else {
    //   this.currentSpeakingRate = value;
    //   window.localStorage.setItem("default-speaking-rate", value.toFixed(2));
    // }
  }

  updateRangeValue(rangeInput: HTMLInputElement) {
    const inputValue = this.parseFloat(rangeInput.value),
          inputMax = this.parseFloat(rangeInput.max),
          progress = (inputValue/inputMax) * 100;
    rangeInput.style.setProperty("--progress", progress + "%")
  }

  toggleTranscriptPlay(forcedState: boolean | undefined = undefined) {
    if (forcedState !== undefined) {
      this.isPlaying = forcedState;
    } else {
      this.isPlaying = !this.isPlaying;
    }
  }

  parseFloat(n: string) {
    return parseFloat(n);
  }
  
  ngAfterViewInit(): void {}
}
