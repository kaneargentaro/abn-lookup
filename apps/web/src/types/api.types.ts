export interface ABNEntity {
    abn: string;
    name: string;
    entityType: string;
    status: 'Active' | 'Cancelled' | 'Inactive';
    registrationDate: string;
    gst?: {
        registered: boolean;
        registrationDate?: string;
    };
    address?: {
        state: string;
        postcode: string;
    };
}

export interface ABNSearchResponse {
    results: ABNEntity[];
    query: string;
    count: number;
}

export interface APIError {
    error: string;
    message: string;
    statusCode: number;
}
