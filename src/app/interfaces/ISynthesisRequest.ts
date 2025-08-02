import { IPageSentence } from "./IPageReadAnnotations";

export interface ISynthesisRequest extends IPageSentence {
    pageNumber: number;
    isForceRestart?: boolean;
}