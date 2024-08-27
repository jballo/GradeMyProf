import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
// import langchain from "langchain";

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});


// Response from .listIndexes():
// {
//    "indexes": [
//       {
//          "name": "example-index1",
//          "dimension": 1536,
//          "metric": "cosine",
//          "host": "example-index1-4mkljsz.svc.aped-4627-b74a.pinecone.io",
//          "deletionProtection": "disabled",
//          "spec": {
//             "serverless": {
//                "cloud": "aws",
//                "region": "us-east-1"
//             }
//          },
//          "status": {
//             "ready": true,
//             "state": "Ready"
//          }
//       },
//       {
//          "name": "example-index2",
//          "dimension": 1536,
//          "metric": "cosine",
//          "host": "example-index2-4mkljsz.svc.us-east-1-aws.pinecone.io",
//          "spec": {
//             "pod": {
//                "environment": "us-east-1-aws",
//                "replicas": 1,
//                "shards": 1,
//                "podType": "p1.x1",
//                "pods": 1
//             }
//          },
//          "status": {
//             "ready": true,
//             "state": "Ready"
//          }
//       }
//    ]
// }

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
    // check if namespace exists in our index
    // log current state of function
    // create namespace

    // check if our professor exists in namespace in our index
    // log current state of function
    // create professor
    
    // if professor exists, update professor
    // log current state of function
    // update professor



}



export async function POST(req) {
    const data = await req.json();
    console.log("Received data: ", data);
    await updatedPinecone(data);
    return NextResponse.json({temp: 'temp'});
}