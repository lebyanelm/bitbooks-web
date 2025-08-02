import { Injectable } from '@angular/core';
import { IPageReadRep, IPageSentence } from '../interfaces/IPageReadAnnotations';
import { Subject } from 'rxjs';
import { IFakeStream } from '../interfaces/IFakeStream';
import * as superagent from "superagent";
import { ISynthesisRequest } from '../interfaces/ISynthesisRequest';
import { environment } from 'src/environments/environment';
import { EventBus } from 'pdfjs-dist/web/pdf_viewer.mjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  audioChannel = new Audio();
  pageAnnotations: {[key: number]: IPageSentence[]} = {};
  audioSources: IFakeStream[] = [];

  currentSource: number = -1;
  currentPage = 1;
  totalPages = 0

  speakingRate = 1.01; // Reading at 1% faster by default.
  isPlayerReady = false;

  // EVENTS
  onnext = new Subject<[number, string]>();
  eventBus = new EventBus()

  constructor() {
    this.audioChannel.onended = this.onEnded.bind(this);
    this.eventBus.on("ready", () => {
      alert("Player is ready");
    })
  }

  addPageAnnotations(pageAnnots: IPageReadRep) {
    const pageNumber = pageAnnots.page_number;
    let sourcesCount = 0;
    this.pageAnnotations[pageNumber] = pageAnnots.sentences;
    this.pageAnnotations[pageNumber].forEach(async (pageSentence, sentenceIndex) => {
      const speechSource = await this.getSpeechSynthesis({pageNumber, ...pageSentence});
      this.pageAnnotations[pageNumber][sentenceIndex].source = speechSource;

      // Checks if the enough sources have been loaded.
      sourcesCount += 1;
      if (pageNumber === this.currentPage) {
        if (sourcesCount/this.pageAnnotations[pageNumber].length === 1 ) { // 10% has been loaded
          // this.isPlayerReady = true;
          this.eventBus.dispatch("ready", [this.currentPage]);
        }
      }
    });
  }

  getSpeechSynthesis(synthesisRequest: ISynthesisRequest): Promise<string> {
    return new Promise((resolve, _) => {
      superagent.post([environment.backend, "tts"].join("/"))
        .send({ text: synthesisRequest.text, speed: this.speakingRate })
        .end((_, response) => {
          if (response.statusCode === 200) {
            resolve(response.body.data.audio_source);
          }
        });
    });
  }

  nextSource() {
    if (this.currentSource+1 <= this.pageAnnotations[this.currentPage].length-1) {
      this.currentSource += 1;
      const sourceId = this.pageAnnotations[this.currentPage][this.currentSource].id
      // this.onnext.next([this.currentPage, sourceId])
      this.eventBus.dispatch("newsource", [this.currentPage, sourceId])
      this.play();
    } else {
      // Attempt to go to the next page if it exists
      if (this.currentPage+1 <= this.totalPages) {
        this.currentPage += 1;
        this.eventBus.dispatch("pagechange", [this.currentPage])
        
        this.currentSource = 0;
        const sourceId = this.pageAnnotations[this.currentPage][this.currentSource].id;
        this.play();
        this.eventBus.dispatch("newsource", [this.currentPage, sourceId])
      }
    }
  }

  previousSource() {
    if (this.currentSource-1 >= 0) {
      this.currentSource -= 1;
      this.play();
      const sourceId = this.pageAnnotations[this.currentPage][this.currentSource].id;
      this.eventBus.dispatch("newsource", [this.currentPage, sourceId])
    } else {
      if (this.currentPage-1 >= 0) {
        this.currentPage -= 1;
        this.currentSource = 0;
        this.play();
        const sourceId = this.pageAnnotations[this.currentPage][this.currentSource].id;
        this.eventBus.dispatch("newsource", [this.currentPage, sourceId])
      }
    }
  }

  play() {
    const annotation = this.pageAnnotations[this.currentPage][this.currentSource];
    if (this.audioChannel.src !== annotation.source) {
      this.audioChannel.src = annotation.source;
      this.audioChannel.load();
    }
    this.audioChannel.play();
    this.eventBus.dispatch("playing", [this.currentPage, annotation])
  }

  pause() {
    if (!this.audioChannel.paused) {
      this.audioChannel.pause();
      this.eventBus.dispatch("paused", [this.currentPage]);
    }
  }

  onEnded() {
    this.nextSource();
    this.eventBus.dispatch("ended", [this.currentPage])
  }

  setCurrentPage(pageNum: number) {
    this.currentPage = pageNum;
  }

  setTotalPages(totalPages: number) {
    this.totalPages = totalPages;
  }

  startReaderFrom(pageNum: number, sentenceId: string) {
    this.currentPage = pageNum;
    for (let i = 0; i < this.pageAnnotations[this.currentPage].length; i++) {
      if (this.pageAnnotations[this.currentPage][i].id === sentenceId) {
        this.currentSource = i;
        this.play();
        break;
      }
    }
  }
}
