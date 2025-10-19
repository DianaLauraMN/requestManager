import { pino, Logger } from "pino";

// const logger = pino({
//     level: 'trace',
//     transport: {
//         target: "pino-pretty",
//         options: {
//             translateTime: "SYS:dd-mm-yyyy HH:MM:ss  ",
//             ignore: "pid,hostname"
//         }
//     }
// })


class AppLogger {
    private logger: Logger<never, boolean>;
    constructor() {
        this.logger = pino({
            level: 'trace',
            transport: {
                target: "pino-pretty",
                options: {
                    translateTime: "SYS:dd-mm-yyyy HH:MM:ss  ",
                    ignore: "pid,hostname"
                }
            }
        })
    }

    /**
     * @param {string} msg this is the message for the log
     * @param {string} context this is the file or class name
     * @param {string} subContext this is method or step name
     * 
     */
    public log(msg: string, context: string, subContext: string) {
        this.logger.trace({ msg, context, subContext });
    }

    /**
     * @param {string} msg this is the message for the log
     * @param {string|number} errorCode this is the error code for the exception
     * @param {string} context this is the file or class name
     * @param {string} subContext this is method or step name
     * 
     */
    public error(msg: string,errorCode:string|number, context: string, subContext: string) {
        this.logger.error({ msg,errorCode, context, subContext });
    }
}


export { AppLogger };


        // logger.info('Prod');
        // logger.error('');
        // logger.warn('');
        // logger.fatal('');
        // logger.debug('Debug');
        // logger.trace('Dev');