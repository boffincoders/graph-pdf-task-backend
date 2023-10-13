export interface IBaseResponse {
    success: boolean;
    statusCode: number;
    data?: any;
    message?: string;
}
