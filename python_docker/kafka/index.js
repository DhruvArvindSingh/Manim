import { Kafka } from 'kafkajs'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

const __dirname = path.resolve()

dotenv.config()

const kafka = new Kafka({
    clientId: 'LLM-response',
    brokers: [`${process.env.KAFKA_BROKER_LIST}`],
    ssl: {
        ca: [fs.readFileSync(path.join(__dirname, 'kafka_auth/ca.pem'), 'utf-8')],
    },
    sasl: {
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
        mechanism: 'plain'
    }
})

const producer = kafka.producer()
try {
    producer.connect()
} catch (error) {
    console.error('Error connecting to Kafka:', error)
}
async function sendResponse(response, slug, chunkNo) {

    await producer.send({
        topic: 'llm-response',
        messages: [{
            key: slug,
            value: JSON.stringify({ response, slug, chunkNo })
        }]
    })
}

export default sendResponse






