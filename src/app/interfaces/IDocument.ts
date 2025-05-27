export interface IDocument {
    speaking_rate: number,
    thumbnail: string;
    sentence_count: number;
    id: string;
    page_count: number;
    document_source: string;
    voice: string;
    last_page_read: number;
    saved_annotations: string[];
    name: string;
}