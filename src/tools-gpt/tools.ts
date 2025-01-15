import {RunnableToolLike} from "@langchain/core/runnables";
import {StructuredToolInterface} from "@langchain/core/tools";
import {fileReadTool} from "../../tools/file/file-read";
import {dirReadTool} from "../../tools";

const tools: Array<StructuredToolInterface | RunnableToolLike> = [];

// Define the tools for the agent to use
// const weatherTool = tool(async ({ query }) => {
//     console.log(`\n\nweatherTool:\n ${query}`);
//     // This is a placeholder for the actual implementation
//     if (query.toLowerCase().includes("sf") || query.toLowerCase().includes("san francisco")) {
//         return "It's 60 degrees and foggy."
//     }
//     return "It's 90 degrees and sunny."
// }, {
//     name: "weather",
//     description:
//         "Call to get the current weather for a location.",
//     schema: z.object({
//         query: z.string().describe("The query to use in your search."),
//     }),
// });
// tools.push(weatherTool)

// const wikipediaTool = new WikipediaQueryRun();
tools.push(fileReadTool, dirReadTool);


export {tools};
