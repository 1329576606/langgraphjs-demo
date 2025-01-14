import {z} from "zod";

require("esm-hook"); // Only for running this in TSLab. See: https://github.com/yunabe/tslab/issues/72
import {TavilySearchResults} from "@langchain/community/tools/tavily_search";
import {tool} from "@langchain/core/tools";
export const chartTool = tool(
    ({data}) => {
        try {
            console.log('\n\nshow chart:\n');
            data.forEach(console.log);
        } catch (e) {
            console.error(e);
        }
        return "Chart has been generated and displayed to the user!";
    },
    {
        name: "generate_bar_chart",
        description:
            "Generates a bar chart from an array of data points using D3.js and displays it for the user.",
        schema: z.object({
            data: z
                .object({
                    label: z.string(),
                    value: z.number(),
                })
                .array(),
        }),
    }
)

export const tavilyTool = new TavilySearchResults();