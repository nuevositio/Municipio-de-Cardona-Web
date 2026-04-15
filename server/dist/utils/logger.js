function log(level, message, extra) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase().padEnd(5)}]`;
    if (level === 'error') {
        console.error(prefix, message, extra !== undefined ? extra : '');
    }
    else if (level === 'warn') {
        console.warn(prefix, message, extra !== undefined ? extra : '');
    }
    else {
        console.log(prefix, message, extra !== undefined ? extra : '');
    }
}
export const logger = {
    info: (message, extra) => log('info', message, extra),
    warn: (message, extra) => log('warn', message, extra),
    error: (message, extra) => log('error', message, extra),
};
//# sourceMappingURL=logger.js.map