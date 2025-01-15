import {AgentState, NodeName} from "./state";
import {Runnable, RunnableConfig} from "@langchain/core/runnables";
import {AIMessage, HumanMessage, SystemMessage} from "@langchain/core/messages";
import {llm} from "./llm";
import {ToolNode} from "@langchain/langgraph/prebuilt";
import {auditor_agent_prompt} from "./prompts";
import {END} from "@langchain/langgraph";
import {MessagesPlaceholder} from "@langchain/core/prompts";

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


export async function codeAuditorNode(
    state: typeof AgentState.State,
    config?: RunnableConfig,
) {
    const name = NodeName.CODE_AUDITOR;
    let result: any;

    if (state.sender == NodeName.USER) {
        const code = state.code;
        result =await llm.invoke([
            new SystemMessage({content:auditor_agent_prompt.replace('{topk}', '20').replace('{code}', code)})
        ], config)
        console.log('llm')
        console.log(JSON.stringify(result));
        if (!result?.tool_calls || result.tool_calls.length === 0) {
            // If the agent is NOT calling a tool, we want it to
            // look like a human message.
            result = new HumanMessage({...result, name: name});
        }
    }
    return {
        messages: [result],
        // Since we have a strict workflow, we can
        // track the sender so we know who to pass to next.
        sender: name,
    };
}

export const toolNode = new ToolNode<typeof AgentState.State>([]);

export function router(state: typeof AgentState.State) {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1] as AIMessage;
    if (lastMessage?.tool_calls && lastMessage.tool_calls.length > 0) {
        // The previous agent is invoking a tool
        return NodeName.CALL_TOOL;
    }
    if (
        state.sender == NodeName.CODE_AUDITOR
    ) {
        // Any agent decided the work is done
        return END;
    }
    return END;
}