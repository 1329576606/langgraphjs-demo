import { HumanMessage } from '@langchain/core/messages';
import { Annotation, StateGraph } from "@langchain/langgraph";
import { getLLm } from '../contract-revewer/impl/multi-agent/llm';
import '../env';

const llm = getLLm();

const SubgraphStateAnnotation = Annotation.Root({
  foo: Annotation<string>, // note that this key is shared with the parent graph state
  bar: Annotation<string>,
});

const subgraphNode1 = async (state: typeof SubgraphStateAnnotation.State) => {
  await llm.invoke([new HumanMessage('hi im subgraphNode1')]);
  return { bar: "bar" };
};

const subgraphNode2 = async (state: typeof SubgraphStateAnnotation.State) => {
  // note that this node is using a state key ('bar') that is only available in the subgraph
  // and is sending update on the shared state key ('foo')
  await llm.invoke([new HumanMessage('hi im subgraphNode2')]);
  console.log('next step');
  console.log(state);
  
  
  await llm.invoke([new HumanMessage('hi im subgraphNode222')]);
  return { foo: state.foo + state.bar };
};

const subgraphBuilder = new StateGraph(SubgraphStateAnnotation)
  .addNode("subgraphNode1", subgraphNode1)
  .addNode("subgraphNode2", subgraphNode2)
  .addEdge("__start__", "subgraphNode1")
  .addEdge("subgraphNode1", "subgraphNode2")

const subgraph = subgraphBuilder.compile();

// Define parent graph
const ParentStateAnnotation = Annotation.Root({
  foo: Annotation<string>,
});

const node1 = async (state: typeof ParentStateAnnotation.State) => {
  await llm.invoke([new HumanMessage('hi im node1')]);
  return {
    foo: "hi! " + state.foo,
  };
}

const builder = new StateGraph(ParentStateAnnotation)
  .addNode("node1", node1)
  // note that we're adding the compiled subgraph as a node to the parent graph
  .addNode("node2", subgraph)
  .addEdge("__start__", "node1")
  .addEdge("node1", "node2")

const graph = builder.compile();

(async () => {
  // const stream = await graph.stream({ foo: "foo" });

  // for await (const chunk of stream) {
  //   console.log(chunk);
  // }

  const response = await graph.stream(
    { foo: "foo" },
    {
      streamMode: 'messages' as const,
    },
  );

  for await (const chunk of response) {
    if (chunk[1].langgraph_node == 'subgraphNode2') {
      console.log(chunk[0]);
      console.log(chunk[1]);

    }

  }
})()