import {tool} from "@langchain/core/tools";
import {z} from "zod";
import * as fs from 'fs';
import {Dirent} from "node:fs";

export const dirReadTool = tool(async ({path}) => {
    const dirOutput = fs.readdirSync(path, {withFileTypes: true});
    const getType = function (dirent: Dirent): string {
        if (dirent.isFile()) return 'file';
        if (dirent.isDirectory()) return 'directory';
        if (dirent.isFIFO()) return 'fifo';
        if (dirent.isSocket()) return 'socket';
        if (dirent.isBlockDevice()) return 'block device';
        if (dirent.isCharacterDevice()) return 'character device';
        if (dirent.isSymbolicLink()) return 'symbolic link';
        return 'unknown';
    }
    const dirData = dirOutput
        .map((item) => ({
            name: item.name,
            type: getType(item)
        }));
    return JSON.stringify(dirData);
}, {
    name: "dir-read",
    description: "Tool to read the structure of a file directory",
    schema: z.object({
        path: z.string().describe("The path of the directory to read"),
    }),
});