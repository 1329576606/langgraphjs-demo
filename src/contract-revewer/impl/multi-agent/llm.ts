import {ChatOpenAI} from "@langchain/openai";

export const llm = new ChatOpenAI({
    model: process.env["MODULE"],
    temperature: 0,
    verbose: process.env["VERBOSE"] == "true"
}, {
    apiKey: process.env['OPENAI_API_KEY'],
    baseURL: process.env["OPENAPI_URL"],
});