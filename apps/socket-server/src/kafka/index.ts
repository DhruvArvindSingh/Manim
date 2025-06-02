import { Kafka } from 'kafkajs'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

const __dirname = path.resolve()

dotenv.config()


const kafka = new Kafka({
    clientId: 'LLM-response',
    brokers: [`${process.env.KAFKA_BROKER_LIST}`],
    ssl: {
        ca: [fs.readFileSync(path.join(__dirname, 'ca.pem'), 'utf-8')],
    },
    sasl: {
        username: process.env.KAFKA_USERNAME!,
        password: process.env.KAFKA_PASSWORD!,
        mechanism: 'plain'
    }
})

const consumer = kafka.consumer({ groupId: 'socket-server-group' })


export default consumer