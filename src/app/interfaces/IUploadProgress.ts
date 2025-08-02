export interface IUploadProgress {
    id: string;
    total_stages: number;
    total_progress: number;
    current_progress: number;
    percentage: string;
    stage: number;
}