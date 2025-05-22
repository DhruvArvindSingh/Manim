# Socket.IO Server for Kafka Integration

This server connects to Kafka to receive LLM responses and broadcasts them to connected Socket.IO clients.

## Prerequisites

- Node.js v14+
- npm or yarn
- Kafka broker with authentication set up

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   SOCKET_SERVER_PORT=3002
   KAFKA_BROKER_LIST=your-kafka-broker:9092
   KAFKA_USERNAME=your-username
   KAFKA_PASSWORD=your-password
   ```
4. Make sure you have the Kafka authentication files in the `kafka_auth` directory:
   - `ca.pem`: CA certificate for SSL authentication

## Running the Server

Build and start the server:
```
npm run build
npm start
```

Or use the development mode (build and start in one command):
```
npm run dev
```

For development with auto-recompilation:
```
npm run watch
```

## Socket.IO Events

### Client to Server:
- `get_response_history`: Request response history for a specific slug
  ```javascript
  socket.emit('get_response_history', { slug: 'your-slug' });
  ```

- `llm_response`: Send an LLM response (for manual testing)
  ```javascript
  socket.emit('llm_response', { 
    slug: 'your-slug',
    response: 'Your response text',
    chunkNo: 1
  });
  ```

### Server to Client:
- `llm_response`: Receive LLM responses from Kafka
  ```javascript
  socket.on('llm_response', (data) => {
    console.log(data);
  });
  ```

- `response_history`: Receive response history for a specific slug
  ```javascript
  socket.on('response_history', (data) => {
    console.log(data.responses);
  });
  ```

- `response_history_error`: Receive error when retrieving response history
  ```javascript
  socket.on('response_history_error', (error) => {
    console.error(error);
  });
  ```

## Troubleshooting

If you encounter issues:

1. Check that Kafka is running and accessible
2. Verify your authentication credentials in the `.env` file
3. Make sure the SSL certificate is in the correct location
4. Check the console logs for error messages

## License

ISC 