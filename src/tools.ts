import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

// Define the tools for the agent to use
const weatherTool = tool(async ({ query }) => {
    console.log(`\n\nweatherTool:\n ${query}`);
    // This is a placeholder for the actual implementation
    if (query.toLowerCase().includes("sf") || query.toLowerCase().includes("san francisco")) {
      return "It's 60 degrees and foggy."
    }
    return "It's 90 degrees and sunny."
  }, {
    name: "weather",
    description:
      "Call to get the current weather for a location.",
    schema: z.object({
      query: z.string().describe("The query to use in your search."),
    }),
  });

const wikipediaTool = new WikipediaQueryRun();


export const tools = [wikipediaTool,weatherTool];