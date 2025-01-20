import { Exclude, Expose } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"

export class ResponseBuilder<T, P> {
    @Exclude() private readonly _data: T
    @Exclude() private readonly _message: string
    @Exclude() private readonly _code: string
    @Exclude() private readonly _meta: P

    private constructor(data: T, message: string, code: string, meta: P) {
        this._data = data
        this._message = message
        this._code = code
        this._meta = meta
    }

    static OK(): ResponseBuilder<string, string> {
        return new ResponseBuilder<string, string>("", "", "SUCCESS", "")
    }

    static OK_WITH<T, P>(data?: T, meta?: P): ResponseBuilder<T, P> {
        return new ResponseBuilder(data, "", "SUCCESS", meta)
    }

    static ERROR(message: string, code: string) {
        return new ResponseBuilder("", message, code, null)
    }

    @Expose()
    get code(): string {
        return this._code
    }

    @ApiProperty()
    @Expose()
    get message(): string {
        return this._message
    }

    @ApiProperty()
    @Expose()
    get data(): T {
        return this._data
    }

    @ApiProperty()
    @Expose()
    get meta(): P {
        return this._meta
    }
}