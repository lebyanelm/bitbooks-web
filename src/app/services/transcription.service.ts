import { Injectable } from '@angular/core';
import IText from '../interfaces/ITexts';
import IPageInfo from '../interfaces/IPageInfo';
import IBackendResponseData from '../interfaces/IBackendResponse';
import ISynthesisResponse from '../interfaces/ISynthesisResponse';

@Injectable({
  providedIn: 'root'
})
export class TranscriptionService {
  audioPlayer: HTMLAudioElement = document.createElement("audio");
  timeupdateId!: null | number;
  transcript!: ISynthesisResponse | undefined;

  constructor() {
    // Assign audio event listeners
    document.body.appendChild(this.audioPlayer)
    this.audioPlayer.addEventListener("pause", () => this.cancelTimeupdater.bind(this));
    this.audioPlayer.addEventListener("ended", () => this.cancelTimeupdater.bind(this));
  }

  startTranscription(texts: IText[], pageInfo: IPageInfo): Promise<void | ISynthesisResponse> {
    const payload = { texts, ...pageInfo };
    console.log(payload)
    return new Promise((resolve, reject) => {
      fetch("http://localhost:5000/api/synthesize_page",
         { method: "POST",
           body: JSON.stringify( payload ),
           headers: {
             "Content-Type": "application/json"
           }})
         .then((response) => {
           if (response.status === 202) {
             response.json().then((json: IBackendResponseData<ISynthesisResponse>) => {
                this.transcript = json.data;
                resolve(this.transcript);
             });
           } else {
             reject({ code: response.status, message: response.statusText });
           }
         }).catch((reason) => {
           reject({ code: 0, message: reason })
         });
    })
  }

  startReader(callback: (hId: number) => void) {
    if (!this.transcript) return;
    this.audioPlayer = new Audio(this.transcript.source);
    document.body.appendChild(this.audioPlayer);

    this.audioPlayer.src = this.transcript.source;
    this.audioPlayer.addEventListener("play", () => {
      this.timeupdateId = setInterval(() => {
        this.timeUpdate(callback)
      }, 100) });
    this.audioPlayer.addEventListener("canplaythrough", () => {
      this.audioPlayer.play();
    });
  }

  cancelTimeupdater() {
    if (this.timeupdateId !== null) {
      clearInterval(this.timeupdateId);
      this.timeupdateId = null;
    }
  }

  timeUpdate(callback: (hId: number) => void) {
    if (!this.transcript) return;
    const currentTime = this.audioPlayer.currentTime;
    for (let timeIndex = 0; timeIndex < this.transcript.timestamps.length; timeIndex++) {
      const timestamp = this.transcript.timestamps[timeIndex];
      if (currentTime >= timestamp.start && currentTime <= timestamp.end) {
        callback(timestamp.text_pos)
        break;
      }
    }
  }
}
