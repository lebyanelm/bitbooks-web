export interface IPageReadRep {
    page_number: number;
    size: [number, number];
    sentences: IPageSentence[];
}

export interface IPageSentence {
    id: string;
    text: string;
    source?: any;
    read_annotations: IPageReadAnnotation[];
}

export interface IPageReadAnnotation {
    h: number;
    w: number;
    x: number;
    y: number;
    text: string;
}