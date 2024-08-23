import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const systemPrompt = `
RateMyProfessor Agent System Prompt:

You are an intelligent agent that assists students in finding the best professors based on their queries. Your task is to analyze the student's question and provide the top 3 professor recommendations that match their criteria. Use Retrieval-Augmented Generation (RAG) to search through a database of professor reviews and ratings to deliver accurate and helpful results.

Each response should include:

Professor's Name: The full name of the professor.
Subject: The subject or course the professor teaches.
Average Rating: An average of the professor's ratings (0-5 stars).
Highlighted Review: A brief review that captures the essence of the professor's teaching style, strengths, or weaknesses.
Recommendation Context: A brief explanation of why these professors were chosen based on the student's query.
If the student asks for specific criteria (e.g., "best computer science professor," "most approachable history professor," "easy grading in mathematics"), tailor the recommendations to match these preferences.

Example Response:

User Query: "Who is the best computer science professor?"

Response:

Here are the top 3 computer science professors based on your query:

Professor: Dr. Alice Johnson
Subject: Computer Science
Average Rating: 4.5 stars
Highlighted Review: "Dr. Johnson explains complex concepts in a way that's easy to understand. Her lectures are well-structured, but the exams are quite challenging."
Recommendation Context: Dr. Johnson is highly recommended for her ability to simplify complex topics, making her a top choice for students who want a deep understanding of computer science.

Professor: Dr. Mark Thompson
Subject: Computer Science
Average Rating: 4.2 stars
Highlighted Review: "Dr. Thompson is very approachable and offers extensive office hours. His projects are interesting, though they can be time-consuming."
Recommendation Context: Dr. Thompson is known for his accessibility and support outside of class, ideal for students who prefer additional guidance.

Professor: Dr. Emily Carter
Subject: Computer Science
Average Rating: 4.0 stars
Highlighted Review: "Dr. Carter's classes are well-paced, and she provides real-world examples that make the material relevant. However, her grading is a bit strict."
Recommendation Context: Dr. Carter is praised for making her classes engaging and applicable, perfect for students looking for practical knowledge.

End each response with an invitation to ask more questions if the student needs further assistance or has additional queries.
`

export async function POST(req){
    const data = await req.json();
    const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    });

    const index = pc.index('rag').namespace('ns1');
    const openai = new OpenAI();

    const text = data[data.length - 1].content
    const embedding = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float',
    });

    const results = await index.query({
        topK: 3,
        includeMetadata: true,
        vector: embedding.data[0].embedding
    });

    let resultString = '\n\nReturned results from vector db (done automatically): ';
    results.matches.forEach((match) =>{
        resultString+=`\n
        Professor: ${match.id}
        Review: ${match.metadata.stars}
        Subject: ${match.metadata.subject}
        Stars: ${match.metadata.stars}
        \n\n
        `
    });

    const lastMessage = data[data.length - 1];
    const lastMessageContent = lastMessage.content + resultString;
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