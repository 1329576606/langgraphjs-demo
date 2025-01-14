import {tool} from "@langchain/core/tools";
import {z} from "zod";
import * as fs from 'fs';

export const fileDirReadTool = tool(async ({path}) => {
    const dirOutput = fs.readdirSync(path, {withFileTypes: true});
    const dirData = dirOutput
        .map((item) => ({
            name: item.name,
            isFile: item.isFile(),
            isDirectory: item.isDirectory()
        }));
    return JSON.stringify(dirData);
}, {
    name: "file-dir-read",
    description: "Tool to read the structure of a file directory",
    schema: z.object({
        path: z.string().describe("The path of the directory to read"),
    }),
});