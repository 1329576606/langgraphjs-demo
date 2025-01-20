import {AIMessage, HumanMessage} from "@langchain/core/messages";
import type {Runnable, RunnableConfig} from "@langchain/core/runnables";
import {AgentState} from "./state";
import {chartTool, tavilyTool} from "./tools";
import {ChatOpenAI} from "@langchain/openai";
import {createAgent} from "./create-agent";
import {ToolNode} from "@langchain/langgraph/prebuilt";

// Helper function to run a node for a given agent
async function runAgentNode(props: {
    state: typeof AgentState.State;
    agent: Runnable;
    name: string;
    config?: RunnableConfig;
}) {
    const {state, agent, name, config} = props;
    let result = await agent.invoke(state, config);
    // We convert the agent output into a format that is suitable
    // to append to the global state
    if (!result?.tool_calls || result.tool_calls.length === 0) {
        // If the agent is NOT calling a tool, we want it to
        // look like a human message.
        result = new HumanMessage({...result, name: name});
    }
    return {
        messages: [result],
        // Since we have a strict workflow, we can
        // track the sender so we know who to pass to next.
        sender: name,
    };
}

const llm = new ChatOpenAI({
    model: process.env["MODEL"],
    temperature: 0,
}, {
    apiKey: process.env['OPENAI_API_KEY'],
    baseURL: process.env["OPENAI_URL"],
});

export async function researchNode(
    state: typeof AgentState.State,
    config?: RunnableConfig,
) {
    return await runAgentNode({
        state: state,
        agent: await createAgent({
            llm,
            tools: [tavilyTool],
            systemMessage:
                "You should provide accurate data for the chart generator to use.",
        }),
        name: "Researcher",
        config,
    });
}

export async function chartNode(state: typeof AgentState.State) {
    return await runAgentNode({
        state: state,
        agent: await createAgent({
            llm,
            tools: [chartTool],
            systemMessage: "Any charts you display will be visible by the user.",
        }),
        name: "ChartGenerator",
    });
}

const tools = [tavilyTool, chartTool];
export const toolNode = new ToolNode<typeof AgentState.State>(tools);

export function router(state: typeof AgentState.State) {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1] as AIMessage;
    if (lastMessage?.tool_calls && lastMessage.tool_calls.length > 0) {
        // The previous agent is invoking a tool
        return "call_tool";
    }
    if (
        typeof lastMessage.content === "string" &&
        lastMessage.content.includes("FINAL ANSWER")
    ) {
        // Any agent decided the work is done
        return "end";
    }
    return "continue";
}