import {tool} from "@langchain/core/tools";
import {z} from "zod";
import * as fs from 'fs';

export const fileReadTool = tool(async ({path}) => {
    return fs.readFileSync(path, 'utf-8');
}, {
    name: "file-read",
    description: "Tool to read the contents of a file",
    schema: z.object({
        path: z.string().describe("The path of the file to read"),
    }),
});