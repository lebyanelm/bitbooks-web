export default interface ISynthesisResponse {
    source: string;
    timestamps: ISynthesisResponseTimestamp[]
}

interface ISynthesisResponseTimestamp {
    start: number;
    end: number;
    text_pos: number;
    text_content: string;
}