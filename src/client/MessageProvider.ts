export class ErrorMessage extends Error {
    readonly message: string;

    constructor(message: string) {
        super();
        this.message = message;
    }

    toString() {
        return this.message;
    }
}

export interface MessageProvider {
    initialMessage(): Promise<string>;
    response(message: string): Promise<string>;
}