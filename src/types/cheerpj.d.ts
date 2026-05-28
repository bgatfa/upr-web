declare function cheerpjInit(options?: { version?: number; javaProperties?: string[]; enableDebug?: boolean }): Promise<void>;
declare function cheerpOSAddStringFile(path: string, data: Uint8Array): void;
declare function cheerpjRunJar(jarPath: string, ...args: string[]): Promise<number>;
declare function cjFileBlob(path: string): Promise<Blob>;
