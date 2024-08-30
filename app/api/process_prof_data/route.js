import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from '@langchain/openai'
import fetch from 'node-fetch';

// import langchain from "langchain";

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

async function createIndex(){
    // create index
    await pc.createIndex({
        name: 'professor-index',
        dimension: 1536, // change dimension in accordance with the model
        metric: 'cosine',
        spec: {
            serverless: {
                cloud: 'aws',
                region: 'us-east-1',
            }
        },
    });
    // wait 60 seconds for index to be created
    await new Promise((resolve) => setTimeout(resolve, 60000));

}

async function updatedPinecone(data){
    try{
        // log current state of functions
        console.log('Starting update...');
        // check if index exists
        const indexes = (await pc.listIndexes()).indexes;
        console.log(indexes);
        // retrieve specific index
        const index = indexes.filter((index) => index.name === process.env.PINECONE_INDEX_NAME);
    
        console.log('index: ', index);
        // check if index exists
        if (index.length === 0){
            // log current state of function
            console.log('Index not found...');
            // create index
            await createIndex();
            // log current state of function
            console.log('Index created...');
        } else {
            // log current state of function
            console.log('Index found...');
        }
        
        let processedData = [];
        // process data
        const embeddings = new OpenAIEmbeddings({
            apiKey: process.env.OPENAI_API_KEY,
            batchSize: 512, // Default value if omitted is 512. Max is 2048
            model: 'text-embedding-ada-002',
            // fetch // Explicitly pass fetch to the constructor
        });
    
        
        processedData = await Promise.all(data.reviews.map(async (review) => ({
            id: `${data.firstName}-${review.className}-${review.date}`,
            values: await embeddings.embedQuery(`${data.firstName} | Rating: ${data.rating} | Class: ${review.className} | Date: ${review.date} | Quality: ${review.quality} | Difficulty: ${review.difficulty} | Review: ${review.comment}`),
            metadata: {
                firstName: data.firstName,
                rating: data.rating,
                className: review.className,
                date: review.date,
                quality: review.quality,
                difficulty: review.difficulty,
                comment: review.comment
            }
        })));
    
        // log processed data
        console.log('Processed data: ', processedData);
    
        // log current state of function
        console.log('Data processed...');
        // upsert data
        const indexToUpsert = await pc.index(process.env.PINECONE_INDEX_NAME);
        const nameSpaceToUpsert = await indexToUpsert.namespace(process.env.PINECONE_NAMESPACE_NAME);
        await nameSpaceToUpsert.upsert(processedData);
        // await pc.index(process.env.PINECONE_INDEX_NAME).namespace(process.env.PINECONE_NAMESPACE_NAME).upsert(processedData);
    
        // log current state of function
        console.log('Data upserted...');

    } catch (error) {
        console.error('Error in updatedPinecone: ', error);
    }

}



export async function POST(req) {
    const data = await req.json();
    console.log("Received data: ", data);
    await updatedPinecone(data);
    return NextResponse.json({temp: 'temp'});
}