import "neo4j-driver";
import {getLLm} from "../contract-revewer/impl/multi-agent/llm";
import {HumanMessage} from "@langchain/core/messages";
import {Document} from "@langchain/core/documents";
import "../env";
import {Neo4jGraph} from "@langchain/community/graphs/neo4j_graph";
import {LLMGraphTransformer} from "@langchain/community/experimental/graph_transformers/llm";

let text = `
{
    "data": {
        "heat": "10",
        "description": "Headquartered in Hong Kong, Everest Ventures Group (EVG) is a web3 operating group driving mass adoption of web3.  With a global team of 300, it has built and launched a diverse portfolio of products for the future of digital interaction across use cases, such as Aspen Digital, Mugen Interactive, Kiki, LiveArt, Blocktempo, Cassava Network, and Adaverse. As an early investor and lead advisor it has contributed to unicorns, and 150+ defining projects such as Celestia, Wormhole, Berachain, Dapper Labs (Flow), Animoca Brands, Immutable, The Sandbox, Yuga Labs, Kraken, Lukka and Dunamu.",
        "active": true,
        "rootdataurl": "https://www.rootdata.com/Investors/detail/Everest Ventures Group?k=MjAw",
        "investments": [
            {
                "name": "Celestia",
                "logo": "https://public.rootdata.com/images/b13/1666968123193.jpg"
            },
            {
                "name": "Alex",
                "logo": "https://public.rootdata.com/images/b6/1729766226136.jpg"
            },
            {
                "name": "Animoca Brands",
                "logo": "https://public.rootdata.com/images/b16/1666877617742.jpg"
            },
            {
                "name": "Kraken",
                "logo": "https://public.rootdata.com/images/b16/1666937757956.jpg"
            },
            {
                "name": "GAMEE",
                "logo": "https://public.rootdata.com/images/b15/1666346479556.jpg"
            },
            {
                "name": "The Sandbox",
                "logo": "https://public.rootdata.com/images/b15/1666342114906.jpg"
            },
            {
                "name": "Berachain",
                "logo": "https://public.rootdata.com/images/b16/1666660510953.jpg"
            },
            {
                "name": "Meson Network",
                "logo": "https://public.rootdata.com/images/b26/1666700023280.jpg"
            },
            {
                "name": "Eclipse",
                "logo": "https://public.rootdata.com/images/b39/1722237933856.jpg"
            },
            {
                "name": "Immutable",
                "logo": "https://public.rootdata.com/images/b6/1669355055298.jpg"
            },
            {
                "name": "Aligned",
                "logo": "https://public.rootdata.com/images/b6/1736498767502.jpg"
            },
            {
                "name": "Lumoz",
                "logo": "https://public.rootdata.com/images/b6/1696950125653.jpg"
            },
            {
                "name": "Gabby World",
                "logo": "https://public.rootdata.com/images/b6/1678792745612.jpg"
            },
            {
                "name": "Infinex",
                "logo": "https://public.rootdata.com/images/b6/1703392414827.png"
            },
            {
                "name": "Abstract",
                "logo": "https://public.rootdata.com/images/b39/1722320236744.jpg"
            },
            {
                "name": "Rome Protocol",
                "logo": "https://public.rootdata.com/images/b6/1721083721160.jpg"
            },
            {
                "name": "Holdstation",
                "logo": "https://public.rootdata.com/images/b6/1698382085046.jpg"
            },
            {
                "name": "Anichess",
                "logo": "https://public.rootdata.com/images/b13/1666622734293.jpg"
            },
            {
                "name": "Saakuru",
                "logo": "https://public.rootdata.com/images/b6/1712663831681.jpg"
            },
            {
                "name": "Planet Mojo",
                "logo": "https://public.rootdata.com/images/b6/1712820622358.jpg"
            },
            {
                "name": "Mocaverse",
                "logo": "https://public.rootdata.com/images/b12/1694399193399.jpg"
            },
            {
                "name": "ZTX",
                "logo": "https://public.rootdata.com/images/b6/1697505563726.jpg"
            },
            {
                "name": "iZUMi Finance",
                "logo": "https://public.rootdata.com/images/b18/1666508607670.jpg"
            },
            {
                "name": "WORLD3",
                "logo": "https://public.rootdata.com/images/b6/1717584456392.jpg"
            },
            {
                "name": "DeSyn Protocol",
                "logo": "https://public.rootdata.com/images/b39/1724764959052.jpg"
            },
            {
                "name": "Polarise",
                "logo": "https://public.rootdata.com/images/b39/1722238077229.jpg"
            },
            {
                "name": "rct AI",
                "logo": "https://public.rootdata.com/images/b16/1666859980934.jpg"
            },
            {
                "name": "Highstreet",
                "logo": "https://public.rootdata.com/images/b16/1666426710057.jpg"
            },
            {
                "name": "Thetan Arena",
                "logo": "https://public.rootdata.com/images/b18/1666902433796.jpg"
            },
            {
                "name": "Flow",
                "logo": "https://public.rootdata.com/images/b16/1666538820954.jpg"
            },
            {
                "name": "YIN Finance",
                "logo": "https://public.rootdata.com/images/b17/1666496791827.jpg"
            },
            {
                "name": "Puffpaw",
                "logo": "https://public.rootdata.com/images/b6/1721284113341.jpg"
            },
            {
                "name": "Asterix",
                "logo": "https://public.rootdata.com/images/b6/1710337383832.jpg"
            },
            {
                "name": "Galactic Holdings",
                "logo": "https://public.rootdata.com/images/b6/1681715025181.jpg"
            },
            {
                "name": "Lightnet",
                "logo": "https://public.rootdata.com/images/b6/1670734783116.jpg"
            },
            {
                "name": "Soulbound",
                "logo": "https://public.rootdata.com/images/b12/1724126384163.jpg"
            },
            {
                "name": "Blocklords",
                "logo": "https://public.rootdata.com/images/b6/1671384658772.jpg"
            },
            {
                "name": "MetaEstate",
                "logo": "https://public.rootdata.com/images/b6/1676022474871.jpg"
            },
            {
                "name": "Metakey",
                "logo": "https://public.rootdata.com/images/b16/1666620951352.jpg"
            },
            {
                "name": "LiveArt",
                "logo": "https://public.rootdata.com/images/b26/1668499654685.jpg"
            },
            {
                "name": "Tiny World",
                "logo": "https://public.rootdata.com/images/b16/1666623330595.jpg"
            },
            {
                "name": "StarSharks",
                "logo": "https://public.rootdata.com/images/b18/1666902136185.jpg"
            },
            {
                "name": "Hawksight",
                "logo": "https://public.rootdata.com/images/b17/1668435724262.jpg"
            },
            {
                "name": "TooRichCity",
                "logo": "https://public.rootdata.com/images/b12/1688554006182.jpg"
            },
            {
                "name": "OP Games",
                "logo": "https://public.rootdata.com/images/b26/1666795713067.jpg"
            },
            {
                "name": "XCarnival",
                "logo": "https://public.rootdata.com/images/b6/1670396784244.jpg"
            },
            {
                "name": "AstroX",
                "logo": "https://public.rootdata.com/images/b19/1668943424108.jpg"
            },
            {
                "name": "GM Network",
                "logo": "https://public.rootdata.com/images/b6/1709878727463.jpg"
            },
            {
                "name": "SoMon",
                "logo": "https://public.rootdata.com/images/p10116/1713280919285.png"
            },
            {
                "name": "Reap",
                "logo": "https://public.rootdata.com/images/b17/1668171287122.jpg"
            },
            {
                "name": "GM Labs",
                "logo": "https://public.rootdata.com/images/b6/1705304941572.jpg"
            },
            {
                "name": "Ezek",
                "logo": "https://public.rootdata.com/images/b6/1671776940432.jpg"
            },
            {
                "name": "MiL.k",
                "logo": "https://public.rootdata.com/images/b19/1668006378710.jpg"
            },
            {
                "name": "Conductive",
                "logo": "https://public.rootdata.com/images/b19/1669543547199.jpg"
            },
            {
                "name": "May.Social",
                "logo": "https://public.rootdata.com/images/b6/1677766079811.png"
            },
            {
                "name": "Crema Finance",
                "logo": "https://public.rootdata.com/images/b16/1666684274449.jpg"
            },
            {
                "name": "Superpower Squad",
                "logo": "https://public.rootdata.com/images/b17/1668173589385.jpg"
            },
            {
                "name": "myNFT",
                "logo": "https://public.rootdata.com/images/b16/1668149163034.jpg"
            },
            {
                "name": "FreshCut",
                "logo": "https://public.rootdata.com/images/b26/1666705136641.jpg"
            },
            {
                "name": "Ark Rivals",
                "logo": "https://public.rootdata.com/images/b6/1671186935622.jpg"
            },
            {
                "name": "Duet Protocol",
                "logo": "https://public.rootdata.com/images/b16/1668151709860.jpg"
            },
            {
                "name": "DeHorizon",
                "logo": "https://public.rootdata.com/images/b17/1668172421092.jpg"
            },
            {
                "name": "CoPuppy",
                "logo": "https://public.rootdata.com/images/b6/1705069168368.jpg"
            },
            {
                "name": "SIL Finance",
                "logo": "https://public.rootdata.com/images/b19/1668745993144.jpg"
            },
            {
                "name": "Endless Battlefield",
                "logo": "https://public.rootdata.com/images/b6/1670217527889.jpg"
            }
        ],
        "establishment_date": "2018",
        "influence": "290",
        "top_followers": 70,
        "followers": 84835,
        "org_id": 200,
        "following": 124,
        "team_members": [
            {
                "people_id": 13828,
                "head_img": "https://public.rootdata.com/images/b30/1675399434668.jpg",
                "name": "Allen Ng",
                "position": "Co-founder and CEO"
            },
            {
                "people_id": 16247,
                "head_img": "https://public.rootdata.com/images/b6/1697081201141.jpg",
                "name": "Ruby Cheng",
                "position": "Co-Founder & COO"
            },
            {
                "people_id": 13823,
                "head_img": "https://public.rootdata.com/images/b30/1675398597631.jpg",
                "name": "Jerome Wong",
                "position": "Co-Founder & CBO"
            },
            {
                "people_id": 16246,
                "head_img": "https://public.rootdata.com/images/b6/1697080995506.jpg",
                "name": "Sean Tao",
                "position": "Partner"
            },
            {
                "people_id": 21391,
                "head_img": "https://public.rootdata.com/images/b6/1725117747447.jpg",
                "name": "Andy P. Lee",
                "position": "Partner, Head of GameFi"
            },
            {
                "people_id": 21030,
                "head_img": "https://public.rootdata.com/images/b6/1722586423308.jpg",
                "name": "Gemma Lo",
                "position": "CMO"
            },
            {
                "people_id": 21029,
                "head_img": "https://public.rootdata.com/images/b6/1722586256585.jpg",
                "name": "Lei (Holly) Hao",
                "position": "CTO"
            },
            {
                "people_id": 18473,
                "head_img": "https://public.rootdata.com/images/b39/1709198578451.jpg",
                "name": "Joyce Yim",
                "position": "COO"
            },
            {
                "people_id": 18475,
                "head_img": "https://public.rootdata.com/images/b39/1709198993763.jpg",
                "name": "Sunny C.",
                "position": "Head of Product"
            }
        ],
        "logo": "https://public.rootdata.com/images/b6/1721884848227.jpg",
        "heat_rank": 171,
        "org_name": "Everest Ventures Group",
        "category": [
            "Gather"
        ],
        "influence_rank": 170,
        "social_media": {
            "website": "https://www.evg.co/",
            "twitter": "https://x.com/EVGHQ",
            "X": "https://x.com/EVGHQ",
            "linkedin": "",
            "linkedln": ""
        }
    },
    "result": 200
}
`;

const url = process.env.NEO4J_URI;
const username = process.env.NEO4J_USER;
const password = process.env.NEO4J_PASSWORD;

const message = ``;

const llm = getLLm();

const llmGraphTransformer = new LLMGraphTransformer({
    llm: llm,
});

(async function main() {
    const graph = await Neo4jGraph.initialize({url, username, password});

    try {
        await graph.query("MATCH (n) DETACH DELETE n;")
        // const result = await llmGraphTransformer.convertToGraphDocuments([
        //     new Document({pageContent: text}),
        // ]);
        // console.log(`Nodes: ${result[0].nodes.length}`);
        // console.log(`Relationships:${result[0].relationships.length}`);
        // await graph.addGraphDocuments(result);
    } catch (e) {
        throw e;
    } finally {
        await graph.close();
    }
})();