import { HttpException, HttpStatus } from "@nestjs/common"

export enum HttpErrorCode {
    // 400 - The request body does not match the schema for the expected parameters
    VALIDATION_ERROR = "validation_erro",
    // 401 - The bearer token is not valid.
    UNAUTHORIZED = "unauthorized",
    // 401 - Given the bearer token used, the client doesn't have permission to perform this operation.
    UNAUTHORIZED_SHARE = "unauthorized_share",
    // 403 - Given the bearer token used, the client doesn't have permission to perform this operation.
    RESTRICTED_RESOURCE = "restricted_resource",
    // 404 - Given the bearer token used, the resource does not exist. This error can also indicate that the resource has not been shared with owner of the bearer token.
    NOT_FOUND = "not_found",
    CONFLICT = "conflict",
    // 500 - An unexpected error occurred.
    INTERNAL_SERVER_ERROR = "internal_server_error",
    // 503 - database is unavailable or is not in a state that can be queried. Please try again later.
    DATABASE_CONNECTION_UNAVAILABLE = "database_connection_unavailable",
    // 504 - The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server it needed to access in order to complete the request.
    GATEWAY_TIMEOUT = "gateway_timeout",
    // Unknown error code
    UNKNOWN_ERROR_CODE = "unknown_error_code",
    // 400 - Account Not Found.
    ACCOUNT_NOT_FOUND = "account_not_found",
    ACCOUNT_PASSWORD_NOT_MATCH = "account_passwrod_not_match"
}

export const ErrorCodeToStatusMap: Record<HttpErrorCode, number> = {
    [HttpErrorCode.ACCOUNT_NOT_FOUND]: 400,
    [HttpErrorCode.ACCOUNT_PASSWORD_NOT_MATCH]: 400,
    [HttpErrorCode.VALIDATION_ERROR]: 400,
    [HttpErrorCode.UNAUTHORIZED]: 401,
    [HttpErrorCode.RESTRICTED_RESOURCE]: 403,
    [HttpErrorCode.UNAUTHORIZED_SHARE]: 403,
    [HttpErrorCode.NOT_FOUND]: 404,
    [HttpErrorCode.CONFLICT]: 409,
    [HttpErrorCode.INTERNAL_SERVER_ERROR]: 500,
    [HttpErrorCode.DATABASE_CONNECTION_UNAVAILABLE]: 503,
    [HttpErrorCode.GATEWAY_TIMEOUT]: 504,
    [HttpErrorCode.UNKNOWN_ERROR_CODE]: 500,
}

export class CustomHttpException extends HttpException {
    code: string

    constructor(message: string, code: HttpErrorCode) {
        super(message, ErrorCodeToStatusMap[code])
        this.code = code
    }
}

export const getDefaultCodeByStatus = (status: HttpStatus) => {
    switch (status) {
        case HttpStatus.BAD_REQUEST:
            return HttpErrorCode.VALIDATION_ERROR
        case HttpStatus.UNAUTHORIZED:
            return HttpErrorCode.UNAUTHORIZED
        case HttpStatus.FORBIDDEN:
            return HttpErrorCode.RESTRICTED_RESOURCE
        case HttpStatus.NOT_FOUND:
            return HttpErrorCode.NOT_FOUND
        case HttpStatus.CONFLICT:
            return HttpErrorCode.CONFLICT
        case HttpStatus.INTERNAL_SERVER_ERROR:
            return HttpErrorCode.INTERNAL_SERVER_ERROR
        case HttpStatus.SERVICE_UNAVAILABLE:
            return HttpErrorCode.DATABASE_CONNECTION_UNAVAILABLE
        default:
            return HttpErrorCode.UNKNOWN_ERROR_CODE
    }
}
export const exceptionParse = (
    exception: Error | HttpException | CustomHttpException,
): CustomHttpException => {
    if (exception instanceof CustomHttpException) {
        return exception
    }

    if (exception instanceof HttpException) {
        const status = exception.getStatus()
        return new CustomHttpException(
            exception.message,
            getDefaultCodeByStatus(status),
        )
    }

    return new CustomHttpException(
        "Internal Server Error",
        HttpErrorCode.INTERNAL_SERVER_ERROR,
    )
}
