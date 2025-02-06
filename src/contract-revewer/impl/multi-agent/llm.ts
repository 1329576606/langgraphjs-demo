import {ChatOpenAI} from "@langchain/openai";

export function getLLm() {
    return new ChatOpenAI({
        model: process.env["MODEL"],
        temperature: 0,
        verbose: process.env["VERBOSE"] == "true",
        maxTokens:8192,
        timeout: 10000000,
        configuration: process.env["LOG_FETCH"] != "true" ? {}: {
            fetch: (url: string, init: RequestInit) => {
                console.log('\n=== OpenAI HTTP Request ===');
                console.log('URL:', url);
                console.log('Method:', init.method);
                console.log('Headers:', JSON.stringify(init.headers, null, 2));
                console.log('Body:', init.body ? JSON.stringify(JSON.parse(init.body as string), null, 2) : null);

                return fetch(url, init).then(async response => {
                    const data = await response.json();
                    console.log('\n=== OpenAI HTTP Response ===');
                    console.log('Status:', response.status);
                    console.log('Data:', JSON.stringify(data, null, 2));

                    return new Response(JSON.stringify(data), {
                        status: response.status,
                        headers: response.headers
                    });
                });
            }
        }
    }, {
        apiKey: process.env['OPENAI_API_KEY'],
        baseURL: process.env["OPENAI_URL"],
    });
}