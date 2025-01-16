import {AgentState, NodeName} from "../state";
import {AIMessage} from "@langchain/core/messages";
import {END} from "@langchain/langgraph";

export function Router(state: typeof AgentState.State) {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1] as AIMessage;
    if (lastMessage?.tool_calls && lastMessage.tool_calls.length > 0) {
        // The previous agent is invoking a tool
        return NodeName.CALL_TOOL;
    }
    if (
        state.sender == NodeName.CODE_AUDITOR
    ) {
        if (!state.auditOutput) {
            console.log('need retry');
            return NodeName.CODE_AUDITOR;
        }

        if(!state.criticOutput) {
            console.log('need critic');
            return NodeName.CODE_CRITIC;
        }
        return END;
    }

    if (
        state.sender == NodeName.CODE_CRITIC
    ) {
        if (!state.criticOutput) {
            console.log('need retry');
            return NodeName.CODE_CRITIC;
        }

        if (state.multiLanguage.length != 0 && Object.keys(state.multiLanguageCriticOutput).length == 0) {
            console.log('need translate');
            return NodeName.MULTI_LANGUAGE_AGENT;
        }
        // Any agent decided the work is done
        return END;
    }

    if (state.sender == NodeName.MULTI_LANGUAGE_AGENT) {
        return END;
    }
    return END;
}