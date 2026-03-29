declare module 'crypto-js';
declare module 'sanitize-html';

// H3 helpers used as globals in routes
declare function eventHandler(handler: (event: any) => any | Promise<any>): any;
declare function defineEventHandler(handler: (event: any) => any | Promise<any>): any;
declare function readBody(event: any): Promise<any>;
declare function getQuery(event: any): any;
declare function setResponseHeader(event: any, name: string, value: string): void;
declare function send(event: any, data: any): any;

// Nitro helpers used as globals
declare function defineNitroErrorHandler(handler: (error: any, event: any) => any): any;
declare function defineNitroPlugin(handler: (nitroApp: any) => any): any;
