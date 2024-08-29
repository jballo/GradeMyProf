import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import { OpenAIEmbeddings } from "@langchain/openai";

const systemPrompt = `
You are an intelligent agent that assists students in finding the best professors based on their queries. Your task is to analyze the student's question and provide the top 3 professor recommendations that match their criteria. Use the information provided from the vector database to deliver accurate and helpful results.

Make sure to use the data retrieved from the vector database exactly as provided. Your response must include:

1. **Professor's Name**: Use the name exactly as provided in the database results.
2. **Course or Subject**: Use the subject or course information from the database results.
3. **Average Rating**: Calculate the average rating based on the provided reviews.
4. **Highlighted Review**: Select a review from the provided data that best captures the professor's teaching style, strengths, or weaknesses.
5. **Recommendation Context**: Explain why the professors were chosen based on the student's query, using the information directly from the provided results.

Do not create any information not explicitly present in the database results. If the student asks for specific criteria (e.g., "best computer science professor," "most approachable history professor," "easy grading in mathematics"), tailor the recommendations to match these preferences but always use the data provided.
`;

export async function POST(req){
    const data = await req.json();
    const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    });

    const index = pc.index(process.env.PINECONE_INDEX_NAME).namespace(process.env.PINECONE_NAMESPACE_NAME);
    const openai = new OpenAI();
    const openaiEmbeddings = new OpenAIEmbeddings({
        apiKey: process.env.OPENAI_API_KEY,
        batchSize: 512,
        model: 'text-embedding-ada-002',
    });

    const text = data[data.length - 1].content
    const embedding = await openaiEmbeddings.embedQuery(text);


    const results = await index.query({
        topK: 3,
        includeMetadata: true,
        vector: embedding,
    });

    let resultString = '\n\nReturned results from vector db (done automatically): ';


    // Group reviews by professor name and calculate average rating
    const professorData = {};

    results.matches.forEach((match) => {
        const metadata = match.metadata;
        const professorName = metadata.firstName;

        if (!professorData[professorName]) {
            professorData[professorName] = {
                reviews: [],
                totalRating: 0,
                count: 0,
            };
        }

        // Aggregate data
        professorData[professorName].reviews.push(metadata);
        professorData[professorName].totalRating += parseFloat(metadata.quality);
        professorData[professorName].count += 1;
    });

    // Create a formatted response based on the grouped professor data

    Object.keys(professorData).forEach((professorName) => {
        const professor = professorData[professorName];
        const averageRating = professor.totalRating / professor.count;

        // Select the highlighted review
        const highlightedReview = professor.reviews.reduce((bestReview, review) => {
            if(parseFloat(review.quality) > parseFloat(bestReview.quality)) return review;
            return bestReview;
        }, professor.reviews[0]);

        resultString += `
        Professor: ${professorName}
        Subject: ${highlightedReview.className}
        Average Rating: ${averageRating.toFixed(1)} stars
        Highlighted Review: "${highlightedReview.comment}"
        Recommendation Context: Based on the reviews, ${professorName} is  known for ${highlightedReview.comment.split('.')[0]}.
        `;
    });

    const lastMessage = data[data.length - 1];
    // const lastMessageContent = lastMessage.content + resultString;
    const lastMessageContent = `${lastMessage.content}\n\nResults from vector database:\n${resultString}`; // Explicitly provide context

    const lastDataWithoutLastMessage = data.slice(0, data.length-1);
    const completion = await openai.chat.completions.create({
        messages: [
            { role: 'system', content: systemPrompt },
            ...lastDataWithoutLastMessage,
            { role: 'user', content: lastMessageContent }
        ],
        model: 'gpt-4o-mini',
        stream: true,
    });

    const stream = new ReadableStream({
        async start(controller){
            const encoder = new TextEncoder();
            try{
                for await (const chunk of completion){
                    const content = chunk.choices[0]?.delta?.content;
                    if (content) {
                        const text = encoder.encode(content);
                        controller.enqueue(text);
                    }
                }
            } catch (e) {
                controller.error(e);
            } finally {
                controller.close();
            }
        }
    });

    return new NextResponse(stream);

}