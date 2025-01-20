import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    Logger,
} from "@nestjs/common"
import { Response } from "express"
import { instanceToPlain } from "class-transformer"
import { exceptionParse } from "./util"
import { ResponseBuilder } from "../response/response-builder"

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private logger = new Logger(GlobalExceptionFilter.name)
    
    catch(exception: Error | HttpException, host: ArgumentsHost): any {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()

        const customHttpException = exceptionParse(exception)
        this.logger.error(customHttpException.message, exception.stack)
        response
            .status(customHttpException.getStatus())
            .json(
                instanceToPlain(
                    ResponseBuilder.ERROR(
                        customHttpException.message,
                        customHttpException.code,
                    ),
                ),
            )
    }
}
