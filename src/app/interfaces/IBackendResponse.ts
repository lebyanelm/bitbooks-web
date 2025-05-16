// export default interface IBackendResponse<T> extends Response {
//     json(): Promise<T>;
// }

export default interface IBackendResponseData<T> {
    message: string;
    code: number;
    data?: T;
}