import IBackendResponse from "./IBackendResponse";

export default interface ITranscription extends IBackendResponse {
    data: {
        source: string;
        timestamps: ITimestamp[];
    }
}

export interface ITimestamp {
    start: number;
    end: number;
    text_pos: number;
    text_content: string;
}