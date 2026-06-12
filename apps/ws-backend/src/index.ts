import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
const wss = new WebSocketServer({ port: 8080 });
import { JWT_SECRET } from './config';
wss.on('connection', function connection(ws , request) {
  
  const url = request.url;
    if (!url) {
    ws.close();
    return;
    }

  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || '';
  const decoded = jwt.verify(token,JWT_SECRET);
  ///@ts-ignore
       if (!decoded|| !decoded.userId) {
    ws.close();
    return;
  }
  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

});


//think wss as a whole server of websocket layer and ws is a single connection to a client. Each time a client connects, a new ws object is created for that connection, allowing you to handle messages and events specific to that client. The wss object manages all the connections and can broadcast messages to all clients if needed.



//Browser WebSocket clients cannot send custom Authorization headers, so JWT authentication is commonly implemented either through query parameters during the handshake or by sending an authentication message immediately after the connection is established. Node.js clients can use custom headers because they have low-level control over the HTTP handshake.