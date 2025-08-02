import { IPageSentence } from "./IPageReadAnnotations";

export interface IFakeStream {
    source: string;
    pageNumber: number;
    sentenceId: string;
}