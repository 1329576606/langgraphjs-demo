import {getLLm} from "../contract-revewer/impl/multi-agent/llm";
import {HumanMessage} from "@langchain/core/messages";
import "../env";
import * as fs from "node:fs";
const message = `1. Search for Project/VC/People
URL: https://api.rootdata.com/open/ser_inv
Method: POST
Description: Search project/VC/people brief information according to keywords, unlimited times.
Supported versions: Basic, Plus, Pro
Request header
Parameters
Type
Required
Description
apikey\tstring\ttrue\tThe API key you applied for.
language\tstring\tfalse\tRequired language version (for example: 'en' for English, 'cn' for Chinese, default is 'en')
Request parameters
Parameters
Type
Required
Description
query\tstring\ttrue\tSearch keywords, which can be project/institution names, tokens, or other related terms.
Response field
Parameters
Type
Description
id\tint\t
Unique Identifier
type\tint\t
1 Project; 2 Organization; 3 Person
name\tstring\t
Name
logo\tstring\t
URL of the logo
introduce\tstring\t
Introduction
rootdataurl\tstring\t
Corresponding RootData link.
Request example
curl -X POST -H "apikey: Your APIKEY" -H "language: en" -H "Content-Type: application/json" -d '{"query": "ETH" }' https://api.rootdata.com/open/ser_inv
Successful request example
{
  "data": [
    {
      "introduce": "Ethereum is the first decentralized...",
      "name": "Ethereum",
      "logo": "https://api.rootdata.com/uploads/public/b15/1666341829033.jpg",
      "rootdataurl": "https://api.rootdata.com/Projects/detail/Ethereum?k=MTI=",
      "id": 12,
      "type": 1
    }
  ],
  "result": 200
}
Example of a failed request
{
  "data": {},
  "result": 404,
  "message": "error message"
}
2. Get projects
URL: https://api.rootdata.com/open/get_item
Method: POST
Description: Obtain project details according to the project ID, 2 Credits/times.
Supported versions: Basic, Plus, Pro
Request header
Parameters
Type
Required
Description
apikey\tstring\ttrue\tThe APIKEY you applied for
Request parameters
Parameters
Type
Required
Description
project_id\tint\tfalse\tThe unique identifier for the project. If both \`project_id\` and \`contract_address\` are provided, \`project_id\` takes precedence.
include_team\tbool\tfalse\tWhether to include team member information, default is false.
include_investors\tbool\tfalse\tWhether to include investor information, default is false.
contract_address\tstring\tfalse\tEthereum chain contract address, optional parameter. If the \`project_id\` parameter exists at the same time, the \`project_id\` parameter takes precedence.
Response field
Parameters
Type
Description
project_id\tint\t
Project ID
project_name\tstring\t
Project Name
logo\tstring\t
The URL of the project logo.
token_symbol\tstring\t
Token symbol
establishment_date\tstring\t
Establishment date
one_liner\tstring\t
A brief introduction.
description\tstring\t
Detailed introduction
active\tboolean\t
true: Operating; false: Stopped operating
total_funding\tdecimal\t
Total financing amount
tags\tarray\t
Project tags (array of tag names)
rootdataurl\tstring\t
The RootData link corresponding to the project.
investors \tarray\t
Investor Information
social_media \tarray\t
Social media link
similar_project \tarray\t
Similar projects
ecosystem\tarray\t
Project's associated ecosystem (array, ecosystem name, not distinguishing between testnet and mainnet) PRO
on_main_net\tarray\t
Actually, online network (array, ecological name) PRO
plan_to_launch\tarray\t
Plan to launch the network (array, ecological name) PRO
on_test_net\tarray\t
Launch the test network (array, ecosystem name) PRO
contract_address\tstring\t
Token contract address PRO
fully_diluted_market_cap\tstring\t
Fully diluted market capitalizationPRO
market_cap\tstring\t
Market capitalization PRO
price\tstring\t
Price PRO
event \tarray\t
Major Project Events PRO
reports \tarray\t
News dynamic data PRO
team_members \tarray\t
Team Member Information PRO
token_launch_time\tstring\t
Token issuance time yyyy-MMPRO
support_exchanges\tarray\t
Supported exchanges include (exchange name, exchange logo) PRO
heat\tstring\t
X Hotness Value PRO
heat_rank\tint\t
X Popularity Ranking PRO
influence\tstring\t
X Influence PRO
influence_rank\tint\t
X Influence Ranking PRO
followers\tint\t
X number of fans PRO
following\tint\t
X followers PRO
Request example
curl -X POST -H "apikey: Your APIKEY" -H "language: en" -H "Content-Type: application/json" -d '{"project_id":8719, "include_team":true,"include_investors":true }' https://api.rootdata.com/open/get_item
Successful request example
{
  "data": {
    "ecosystem": [],
    "one_liner": "Building hardware for cryptography",
    "description": "Fabric Cryptography is a start-up company focusing on developing advanced crypto algorithm hardware, especially building special computer chips for Zero-knowledge proof technology.",
    "rootdataurl": "https://api.rootdata.com/Projects/detail/Fabric Cryptography?k=ODcxOQ==",
    "total_funding": 87033106304,
    "project_name": "Fabric Cryptography",
    "investors": [
      {
        "name": "Inflection",
        "logo": "https://api.rootdata.com/uploads/public/b17/1666870085112.jpg"
      }
    ],
    "establishment_date": "2022",
    "tags": [
      "Infra",
      "zk"
    ],
    "project_id": 8719,
    "team_members": [
      {
        "medium": "",
        "website": "https://www.fabriccryptography.com/",
        "twitter": "",
        "discord": "",
        "linkedin": "https://www.linkedin.com/company/fabriccryptography/"
      }
    ],
    "logo": "https://api.rootdata.com/uploads/public/b6/1690306559722.jpg",
    "social_media": {
      "medium": "",
      "website": "https://llama.xyz/",
      "twitter": "https://twitter.com/llama",
      "discord": "",
      "linkedin": ""
    },
    "contract_address": "0x00aU9GoIGOKahBostrD",
    "fully_diluted_market_cap": "1000000",
    "market_cap": "1000000",
    "price": "1000000",
    "reports": []
  },
  "result": 200
}
Example of a failed request
{
  "data": {},
  "result": 404,
  "message": "error message"
}
3. Get VC
URL: https://api.rootdata.com/open/get_org
Method: POST
Description: Obtain VC details according to VC ID, 2 Credits/times.
Supported versions: Basic, Plus, Pro
Request header
Parameters
Type
Required
Description
apikey\tstring\ttrue\tThe APIKEY you applied for
Request parameters
Parameters
Type
Required
Description
org_id\tint\ttrue\tInstitution ID
include_team\tbool\tfalse\tWhether to include team member information, default is false.
include_investments\tbool\tfalse\tWhether it includes investment project information, default is false.
Response field
Parameters
Type
Description
org_id\tint\t
Organization ID
org_name\tstring\t
Organization Name
logo\tstring\t
URL of the organization logo
establishment_date\tstring\t
Establishment time
description\tstring\t
Detailed introduction
active\tboolean\t
true: Operating; false: Stopped operating
category\tstring\t
Type
social_media\tarray\t
Social media links (official website, Twitter, LinkedIn)
investments\tarray\t
Investment projects (array, including name, logo)
rootdataurl\tstring\t
The RootData link corresponding to the institution.
team_members\tarray\t
Team member information (array, including name and position) PRO
heat\tstring\t
X Heat Value PRO
heat_rank\tint\t
X Popularity Ranking PRO
influence\tstring\t
X Influence PRO
influence_rank\tint\t
X Influence Ranking PRO
followers\tint\t
X number of fans PRO
following\tint\t
X followersPRO
Request example
curl -X POST -H "apikey: Your APIKEY" -H "language: en" -H "Content-Type: application/json" -d '{"org_id":219,"include_team":true,"include_investments":true }' https://api.rootdata.com/open/get_org
Successful request example
{
  "data": {
    "org_id": 219,
    "team_members": [
      {
        "name": "Shan Aggarwal",
        "position": "Head"
      },
      {
        "name": "Jonathan King",
        "position": "Principal"
      }
    ],
    "logo": "https://rdbk.rootdata.com/uploads/public/b17/1666777683240.jpg",
    "description": "Coinbase Ventures is an investment arm of Coinbase that aims to invest in early-stage cryptocurrency and blockchain startups.",
    "rootdataurl": "https://api.rootdata.com/Investors/detail/Coinbase Ventures?k=MjE5",
    "org_name": "Coinbase Ventures",
    "category": [
      "Seed Plus"
    ],
    "investments": [
      {
        "name": "zkSync / Matter Labs",
        "logo": "https://public.rootdata.com/uploads/public/b16/1666624791085.jpg"
      }
    ],
    "establishment_date": "2018",
    "social_media": {
      "website": "https://www.coinbase.com/ventures",
      "twitter": "https://twitter.com/cbventures",
      "linkedin": ""
    }
  },
  "result": 200
}
Example of a failed request
{
  "data": {},
  "result": 404,
  "message": "error message"
}
4. Get People (Pro)
URL: https://api.rootdata.com/open/get_people
Method: POST
Description: Obtain the people details according to the people ID, 2 credits/times.
Supported versions: Pro
Request header
Parameters
Type
Required
Description
apikey\tstring\ttrue\tThe API KEY you applied for.
language\tstring\tfalse\tRequired language version (for example: 'en' for English, 'cn' for Chinese, default is 'en')
Request parameters
Parameters
Type
Required
Description
people_id\tlong\ttrue\tCharacter ID
Response field
Parameters
Type
Description
people_id\tlong\t
ID
introduce\tstring\t
Character Introduction
head_img\tstring\t
Avatar
one_liner\tstring\t
Introduction
X\tstring\t
X link
people_name\tstring\t
Character name
linkedin\tstring\t
LinkedIn
Request example
curl -X POST -H "apikey: Your APIKEY" -H "language: en" -H "Content-Type: application/json" -d '{"people_id":12972, "include_team":true,"include_investors":true }' https://api.rootdata.com/open/get_people
Successful request example
{
  "data": {
    "people_id": 12972,
    "introduce": "Cai Wensheng, also known as Mike Cai, is the founder and chairman of Meitu.",
    "head_img": "https://public.rootdata.com/images/b30/1687197351918.jpg",
    "one_liner": "",
    "X": "",
    "people_name": "Cai Wensheng",
    "linkedin": ""
  },
  "result": 200
}
Example of a failed request
{
  "data": {},
  "result": 404,
  "message": "error message"
}
5. Get Invetsor info in batches (Plus, Pro)
URL: https://api.rootdata.com/open/get_invest
Method: POST
Description: Get detailed VC information (portfolio, data analysis, etc.) in batches, 2 Credits/times.
Supported versions: Plus, Pro
Request header
Parameters
Type
Required
Description
apikey\tstring\ttrue\tThe API key you applied for.
language\tstring\tfalse\tRequired language version (for example: 'en' for English, 'cn' for Chinese, default is 'en')
Request parameters
Parameters
Type
Required
Description
page\tint\tfalse\tPage number, default 1
page_size\tint\tfalse\tNumber of items per page, default is 10, maximum is 100.
Response field
Parameters
Type
Description
area\tarray\t
List of regions
last_fac_date\tstring\t
Recent investment time
last_invest_num\tint\t
Number of investments in the past year
invest_range \tarray\t
Investment scale
description\tstring\t
Investor Introduction
invest_overview \tobject\t
Investment Overview
type\tint\t
Type: 1 Project 2 Organization 3 Person
investments \tarray\t
Foreign investment projects
establishment_date\tstring\t
Establishment date
invest_num\tint\t
Number of investments
invest_stics \tarray\t
Investment Landscape
invest_id\tint\t
Investor ID
team_members \tarray\t
Team member information
logo\tstring\t
Investor Logo
invest_name\tstring\t
Investor Name
Request example
curl -X POST -H "apikey: Your APIKEY" -H "language: en" -H "Content-Type: application/json" -d '{"page":1,"page_size":10}' https://api.rootdata.com/open/get_invest
Successful request example
{
  "data": {
    "items": [
      {
        "area": [
          "Singapore",
          "United Arab Emirates"
        ],
        "last_fac_date": "2023-10-12 00:00:00",
        "last_invest_num": 25,
        "description": "Binance Labs is the...",
        "invest_overview": {
          "lead_invest_num": 38,
          "last_invest_round": 25,
          "his_invest_round": 141,
          "invest_num": 171
        },
        "type": 2,
        "investments": [
          {
            "name": "zkSync / Matter Labs",
            "logo": "https://public.rootdata.com/uploads/public/b16/1666624791085.jpg"
          }
        ],
        "establishment_date": "2017",
        "invest_num": 171,
        "invest_stics": [
          {
            "track": "Infrastructure",
            "invest_num": 69
          }
        ],
        "invest_id": 229,
        "invest_range": [
          {
            "lead_invest_num": 11,
            "amount_range": "1-3M",
            "lead_not_invest_num": 17,
            "invest_num": 28
          }
        ],
        "team_members": [
          {
            "head_img": "https://public.rootdata.com/uploads/public/b12/1669630219503.jpg",
            "name": "Yi He",
            "X": "https://twitter.com/heyibinance",
            "position": "Head"
          }
        ],
        "logo": "https://public.rootdata.com/uploads/public/b11/1666594924745.jpg",
        "invest_name": "Binance Labs"
      }
    ],
    "total": 1
  },
  "result": 200
}
Example of a failed request
{
  "data": {},
  "result": 404,
  "message": "error message"
}
6. Get Fundraising rounds in batches (Plus, Pro)
URL: https://api.rootdata.com/open/get_fac
Method: POST
Description: Get fundraising rounds (only supports 2022 to present) in batches, 2 Credits/times.
Supported versions: Plus, Pro
Request header
Parameters
Type
Required
Description
apikey\tstring\ttrue\tThe API key you applied for.
language\tstring\tfalse\tRequired language version (for example: 'en' for English, 'cn' for Chinese, default is 'en')
Request parameters
Parameters
Type
Required
Description
page\tint\tfalse\tPage number, default 1.
page_size\tint\tfalse\tNumber of items per page, default is 10, maximum is 200.
start_time\tstring\tfalse\tFinancing announcement date (start) yyyy-MM
end_time\tstring\tfalse\tFinancing announcement date (end) yyyy-MM
min_amount\tint\tfalse\tMinimum financing amount (in USD)
max_amount\tint\tfalse\tMaximum financing amount (USD)
project_id\tint\tfalse\tProject ID
Response field
Parameters
Type
Description
logo\tstring\t
The URL of the project logo.
name\tstring\t
Project Name
rounds\tstring\t
Round Name
published_time\tstring\t
Financing announcement date
amount\tlong\t
Funding amount (USD)
project_id\tint\t
Project ID
valuation\tlong\t
Valuation (USD)
invests \tarray\t
Investment entity information array, including Logo and Name.
Request example
curl -X POST -H "apikey: Your APIKEY" -H "language: en" -H "Content-Type: application/json" -d '{ }' https://api.rootdata.com/open/get_fac
Successful request example
{
  "data": {
    "total": 2870,
    "items": [
      {
        "amount": 2500000,
        "valuation": 30000000,
        "published_time": "2023-10",
        "name": "Convergence",
        "logo": "https://public.rootdata.com/uploads/public/b6/1671983908027.jpg",
        "rounds": "Pre-Seed",
        "invests": [
          {
            "name": "C² Ventures",
            "logo": "https://public.rootdata.com/uploads/public/b17/1666777874118.jpg"
          }
        ]
      }
    ]
  },
  "result": 200
}
Example of a failed request
{
  "data": {},
  "result": 404,
  "message": "error message"
}
7. Synchronous Update (Pro)
URL: https://api.rootdata.com/open/ser_change
Method: POST
Description: Obtain a list of projects updated with data within a unit time, 2 credits/times.
Supported versions: Pro
Request header
Parameters
Type
Required
Description
apikey\tstring\ttrue\tThe API key you applied for.
language\tstring\tfalse\tRequired language version (for example: 'en' for English, 'cn' for Chinese, default is 'en')
Request parameters
Parameters
Type
Required
Description
begin_time\tlong\ttrue\tStart time, timestamp
end_time\tlong\tfalse\tEnd time, timestamp
Response field
Parameters
Type
Description
id\tint\t
ID
type\tint\t
1: Project; 2: Institution
name\tstring\t
Data names corresponding to Type types.
update_time\tlong\t
Update time, timestamp
Request example
curl -X POST -H "apikey: Your APIKEY" -H "language: en" -H "Content-Type: application/json" -d '{"begin_time":1693974909261,"end_time":1694476800000,}' https://api.rootdata.com/open/ser_change
Successful request example
{
  "data": [
    {
      "update_time": 1693974909261,
      "name": "Ethereum",
      "id": 12,
      "type": 1
    }
  ],
  "result": 200
}
Example of a failed request
{
  "data": {},
  "result": 404,
  "message": "error message"
}
8. Top 100 Popular Projects (Pro)
URL: https://api.rootdata.com/open/hot_index
Method: POST
Description: Get the list of Top100 hot projects and their basic information, 10 credits/times.
Supported versions: Pro
Request header
Parameters
Type
Required
Description
apikey\tstring\ttrue\tThe API key you applied for.
language\tstring\tfalse\tRequired language version (for example: 'en' for English, 'cn' for Chinese, default is 'en')
Request parameters
Parameters
Type
Required
Description
days\tint\ttrue\tOnly supports querying data for the past 1 day/7 days, 1 or 7.
Response field
Parameters
Type
Description
project_id\tlong\t
Project ID
eval\tdouble\t
Heat value
rank\tint\t
Ranking
logo\tstring\t
Project Logo
one_liner\tstring\t
Introduction
token_symbol\tstring\t
Token
project_name\tstring\t
Project Name
tags\tarray\t
Project tags (array of tag names)
Request example
curl -X POST -H "apikey: Your APIKEY" -H "language: en" -H "Content-Type: application/json" -d '{"days":1}' https://api.rootdata.com/open/hot_index
Successful request example
{
  "data": [
    {
      "eval": 907.936508,
      "project_id": 13671,
      "one_liner": "Hemi Network is a modular Layer...",
      "logo": "https://public.rootdata.com/images/b6/1721840384466.png",
      "rank": 1,
      "token_symbol": "",
      "project_name": "Hemi Network",
      "tags": [
        "Infra"
      ]
    }
  ],
  "result": 200
}
Example of a failed request
{
  "data": {},
  "result": 404,
  "message": "error message"
}
9. X Hot Projects (Pro)
URL: https://api.rootdata.com/open/hot_project_on_x
Method: POST
Description: Get the current list of X hot projects, 10 credits/times.
Supported versions: Pro
Request header
Parameters
Type
Required
Description
apikey\tstring\ttrue\tThe API key you applied for.
language\tstring\tfalse\tRequired language version (for example: 'en' for English, 'cn' for Chinese, default is 'en')
Request parameters
Parameters
Type
Required
Description
heat\tboolean\ttrue\tX Trending Chart
influence\tboolean\ttrue\tX Influence Ranking List
followers\tboolean\ttrue\tX Fan Count Rankings
Response field
Parameters
Type
Description
heat \tarray\t
Popularity Ranking
influence \tarray\t
Influence Ranking
followers \tarray\t
Fan Ranking
Request example
curl -X POST -H "apikey: Your APIKEY" -H "language: en" -H "Content-Type: application/json" -d '{"heat":false,"influence":true,"followers":false}' https://api.rootdata.com/open/hot_project_on_x
Successful request example
{
  "data": {
    "influence": [
      {
        "score": "5615",
        "project_id": 3875,
        "one_liner": "Cryptocurrency exchange",
        "logo": "https://public.rootdata.com/images/b16/1666878846006.jpg",
        "project_name": "Coinbase"
      }
    ]
  },
  "result": 200
}
Example of a failed request
{
  "data": {},
  "result": 404,
  "message": "error message"
}
10. X Popular Figures (Pro)
URL: https://api.rootdata.com/open/leading_figures_on_crypto_x
Method: POST
Description: Get the current list of hot people in X, 10 credits/time.
Supported versions: Pro
Request header
Parameters
Type
Required
Description
apikey\tstring\ttrue\tThe API key you applied for.
language\tstring\tfalse\tRequired language version (for example: 'en' for English, 'cn' for Chinese, default is 'en')
Request parameters
Parameters
Type
Required
Description
page\tint\tfalse\tPage number, default 1
page_size\tint\tfalse\tNumber of items per page, default 10, maximum 100.
rank_type\tstring\ttrue\t"Ranking type 'heat' or 'influence'"
Response field
Parameters
Type
Description
people_id\tlong\t
ID
score\tstring\t
Popularity value / Influence index
head_img\tstring\t
Avatar
one_liner\tstring\t
Introduction
people_name\tstring\t
Character name
Request example
curl -X POST -H "apikey: Your APIKEY" -H "language: en" -H "Content-Type: application/json" -d '{"page":1, "page_size":100,"rank_type":"heat" }' https://api.rootdata.com/open/leading_figures_on_crypto_x
Successful request example
{
  "data": {
    "total": 1000,
    "items": [
      {
        "people_id": 13994,
        "score": "86",
        "head_img": "https://public.rootdata.com/images/b12/1676887718722.jpg",
        "one_liner": "",
        "people_name": "Jieyi Long"
      },
      {
        "people_id": 13185,
        "score": "66",
        "head_img": "https://public.rootdata.com/images/b12/1669175527817.jpg",
        "one_liner": "",
        "people_name": "Katie Biber"
      }
    ]
  },
  "result": 200
}
Example of a failed request
{
  "data": {},
  "result": 404,
  "message": "error message"
}
11. People Position Dynamics (Pro)
URL: https://api.rootdata.com/open/job_changes
Method: POST
Description: Get dynamic data on prople positions, 10 credits/times.
Supported versions: Pro
Request header
Parameters
Type
Required
Description
apikey\tstring\ttrue\tThe API key you applied for.
language\tstring\tfalse\tRequired language version (for example: 'en' for English, 'cn' for Chinese, default is 'en')
Request parameters
Parameters
Type
Required
Description
recent_joinees\tboolean\ttrue\tRecently joined the company.
recent_resignations\tboolean\ttrue\tRecent resignation.
Response field
Parameters
Type
Description
recent_joinees \tarray\t
Recently joined.
recent_joinees \tarray\t
Recently joined.
Request example
curl -X POST -H "apikey: Your APIKEY" -H "language: en" -H "Content-Type: application/json" -d '{"recent_joinees":true, "recent_resignations":true }' https://api.rootdata.com/open/job_changes
Successful request example
{
  "data": {
    "recent_resignations": [
      {
        "people_id": 17262,
        "head_img": "https://public.rootdata.com/images/b6/1702801244037.jpg",
        "company": "Kraken",
        "people_name": "Curtis Ting",
        "position": "VP & Head of Global Operations"
      }
    ],
    "recent_joinees": [
      {
        "people_id": 17316,
        "head_img": "https://public.rootdata.xyz/images/b35/1717668332921.jpg",
        "company": "HTX",
        "people_name": "Test",
        "position": "CTO"
      }
    ]
  },
  "result": 200
}
Example of a failed request
{
  "data": {},
  "result": 404,
  "message": "error message"
}
12. Newly issued tokens (Pro)
URL: https://api.rootdata.com/open/new_tokens
Method: POST
Description: Get a list of newly issued tokens in the past three months, 10 credits/times.
Supported versions: Pro
Request header
Parameters
Type
Required
Description
apikey\tstring\ttrue\tThe API key you applied for
language\tstring\tfalse\tRequired language version (for example: 'en' for English, 'cn' for Chinese, default is 'en')
Request parameters
Parameters
Type
Required
Description
No Data
Response field
Parameters
Type
Description
project_id\tlong\t
Project ID
project_name\tstring\t
Project Name
logo\tstring\t
Project Logo
one_liner\tstring\t
Introduction
token_symbol\tstring\t
Token symbol
hap_date\tstring\t
Time of the incident
market_cap\tstring\t
Market capitalization
fully_diluted_market_cap\tstring\t
Fully diluted market capitalization
exchanges\tstring\t
Exchange
Request example
curl -X POST -H "apikey: Your APIKEY" -H "language: en" -H "Content-Type: application/json"  https://api.rootdata.com/open/new_tokens
Successful request example
{
  "data": [
    {
      "fully_diluted_market_cap": "23372320.99",
      "market_cap": "0",
      "project_id": 12062,
      "one_liner": "Decentralized AI Agent Public Chain",
      "exchanges": "Gate.io,KCEX",
      "logo": "https://public.rootdata.com/images/b12/1711444046699.jpg",
      "hap_date": "2024-09-18",
      "token_symbol": "AGENT",
      "project_name": "AgentLayer"
    }
  ],
  "result": 200
}
Example of a failed request
{
  "data": {},
  "result": 404,
  "message": "error message"
}
13. Ecosystem Map (Pro)
URL: https://api.rootdata.com/open/ecosystem_map
Method: POST
Description: Get ecosystem map list, 50 credits/time.
Supported versions: Pro
Request header
Parameters
Type
Required
Description
apikey\tstring\ttrue\tThe API key you applied for.
language\tstring\tfalse\tThe required language version (for example: 'en' for English, 'cn' for Chinese, default is 'en')
Request parameters
Parameters
Type
Required
Description
No Data
Response field
Parameters
Type
Description
ecosystem_id\tlong\t
Ecological ID
ecosystem_name\tstring\t
Ecological Name
project_num\tint\t
Number of projects
Request example
curl -X POST -H "apikey: Your APIKEY" -H "language: en" -H "Content-Type: application/json"  https://api.rootdata.com/open/open/ecosystem_map
Successful request example
{
  "data": [
    {
      "ecosystem_name": "Ethereum",
      "ecosystem_id": 52,
      "project_num": 2158
    }
  ],
  "result": 200
}
Example of a failed request
{
  "data": {},
  "result": 404,
  "message": "error message"
}
14. Tag Map (Pro)
URL: https://api.rootdata.com/open/tag_map
Method: POST
Description: Get tags map list, 50 credits/time.
Supported versions: Pro
Request header
Parameters
Type
Required
Description
apikey\tstring\ttrue\tThe API key you applied for.
language\tstring\tfalse\tRequired language version (for example: 'en' for English, 'cn' for Chinese, default is 'en')
Request parameters
Parameters
Type
Required
Description
No Data
Response field
Parameters
Type
Description
tag_id\tlong\t
Tag ID
tag_name\tstring\t
Label name
Request example
curl -X POST -H "apikey: Your APIKEY" -H "language: en" -H "Content-Type: application/json"  https://api.rootdata.com/open/open/tag_map
Successful request example
{
  "data": [
    {
      "tag_name": "Bug Bounty",
      "tag_id": 52
    }
  ],
  "result": 200
}
Example of a failed request
{
  "data": {},
  "result": 404,
  "message": "error message"
}
15. Get Projects based on Ecosystem (Pro)
URL: https://api.rootdata.com/open/projects_by_ecosystems
Method: POST
Description: Obtain project information in bulk based on ecosystem, 20 credits/times.
Supported versions: Pro
Request header
Parameters
Type
Required
Description
apikey\tstring\ttrue\tThe API key you applied for
language\tstring\tfalse\tRequired language version (for example: 'en' for English, 'cn' for Chinese, default is 'en')
Request parameters
Parameters
Type
Required
Description
ecosystem_ids\tstring\ttrue\tEcological ID, multiple ecologies separated by commas.
Response field
Parameters
Type
Description
project_id\tlong\t
Project ID
project_name\tstring\t
Project Name
logo\tstring\t
Project Logo
one_liner\tstring\t
Introduction
Request example
curl -X POST -H "apikey: Your APIKEY" -H "language: en" -H "Content-Type: application/json" -d '{"ecosystem_ids":"52,54"}'  https://api.rootdata.com/open/projects_by_ecosystems
Successful request example
{
  "data": [
    {
      "project_id": 2297,
      "one_liner": "Crypto bug bounty platform",
      "logo": "https://public.rootdata.com/images/b26/1666654548967.jpg",
      "project_name": "Immunefi"
    }
  ],
  "result": 200
}
Example of a failed request
{
  "data": {},
  "result": 404,
  "message": "error message"
}
16. Get Projects based on Tag (Pro)
URL: https://api.rootdata.com/open/projects_by_tags
Method: POST
Description: Obtain project information in bulk based on tag, 20 credits/times.
Supported versions: Pro
Request header
Parameters
Type
Required
Description
apikey\tstring\ttrue\tThe API key you applied for.
language\tstring\tfalse\tRequired language version (for example: 'en' for English, 'cn' for Chinese, defaults to 'en')
Request parameters
Parameters
Type
Required
Description
tag_ids\tstring\ttrue\tTag ID, multiple ecosystems separated by commas.
Response field
Parameters
Type
Description
project_id\tlong\t
Project ID
project_name\tstring\t
Project Name
logo\tstring\t
Project Logo
one_liner\tstring\t
Introduction
Request example
curl -X POST -H "apikey: Your APIKEY" -H "language: en" -H "Content-Type: application/json" -d '{"tag_ids":"100,101"}'  https://api.rootdata.com/open/projects_by_tags
Successful request example
{
  "data": [
    {
      "project_id": 2297,
      "one_liner": "Crypto bug bounty platform",
      "logo": "https://public.rootdata.com/images/b26/1666654548967.jpg",
      "project_name": "Immunefi"
    }
  ],
  "result": 200
}
Example of a failed request
{
  "data": {},
  "result": 404,
  "message": "error message"
}
根据以上内容生成openapi文档`;

const llm = getLLm();

(async function main() {
    let res = '';
    const stream = await llm.stream([new HumanMessage(message)]);
    for await (const chunk of stream) {
        console.log(chunk.content);
        res+=chunk.content;
    }

    // const aiMessageChunk = await llm.invoke([new HumanMessage(message)]);
    // console.log(aiMessageChunk.content);
    fs.writeFileSync('result.json', res, {encoding: 'utf-8'});
})();