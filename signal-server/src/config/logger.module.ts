import { DynamicModule, Module } from "@nestjs/common"
import { LoggerModule as BaseLoggerModule } from "nestjs-pino"
import { ConfigService } from "@nestjs/config"
import { LoggerConfig } from "./index"

@Module({})
export class LoggerModule {
    static register(): DynamicModule {
        return BaseLoggerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const { level } = config.getOrThrow<LoggerConfig>("logger")
                return {
                    pinoHttp: {
                        level: level,
                        autoLogging: false,
                        quietReqLogger: true,
                        transport:
                            process.env.NODE_ENV !== "production"
                                ? { target: "pino-pretty" }
                                : undefined,
                        formatters: {},
                    },
                }
            },
        })
    }
}
