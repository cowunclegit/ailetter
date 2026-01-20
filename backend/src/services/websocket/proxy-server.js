const { WebSocketServer } = require('ws');
const url = require('url');
const { 
  handleItemCollected, 
  handleCollectionComplete, 
  handleProgressUpdate, 
  handleCollectionError 
} = require('./message-handler');

const validateToken = (token) => {
  const secret = process.env.PROXY_SHARED_SECRET;
  if (!secret || !token) return false;
  return token === secret;
};

let proxyClient = null;
let heartbeatInterval = null;
const activeTasks = new Map();
const COLLECTION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

const initProxyServer = (server, app, io) => {
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    const { pathname } = url.parse(request.url);

    if (pathname === '/ws/proxy') {
      const token = request.headers['x-proxy-token'];

      if (!validateToken(token)) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  const broadcastStatus = () => {
    if (io) {
      io.emit('proxy_status', { connected: !!proxyClient });
    }
  };

  wss.on('connection', (ws) => {
    console.log('Collect Proxy Service connected');
    proxyClient = ws;
    broadcastStatus();
    
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        if (message.type === 'HEARTBEAT_ACK') {
          ws.isAlive = true;
          return;
        }
        
        // Track task activity to reset timeout
        if (message.payload && message.payload.task_id) {
          const taskId = message.payload.task_id;
          if (activeTasks.has(taskId)) {
            clearTimeout(activeTasks.get(taskId));
            const timer = setTimeout(() => handleTimeout(taskId, io), COLLECTION_TIMEOUT);
            activeTasks.set(taskId, timer);
          }
        }

        handleProxyMessage(ws, message, io);

        // Remove from tracking if complete or error
        if (message.type === 'COLLECTION_COMPLETE' || message.type === 'COLLECTION_ERROR') {
          const taskId = message.payload.task_id;
          if (activeTasks.has(taskId)) {
            clearTimeout(activeTasks.get(taskId));
            activeTasks.delete(taskId);
          }
        }

      } catch (err) {
        console.error('Failed to parse proxy message:', err);
      }
    });

    ws.on('close', () => {
      console.log('Collect Proxy Service disconnected');
      if (proxyClient === ws) {
        proxyClient = null;
        broadcastStatus();
      }
      // Cleanup all active timers
      for (const [taskId, timer] of activeTasks) {
        clearTimeout(timer);
      }
      activeTasks.clear();
    });

    ws.isAlive = true;
  });

  // Handle Socket.io status requests
  if (io) {
    io.on('connection', (socket) => {
      socket.on('get_proxy_status', () => {
        socket.emit('proxy_status', { connected: !!proxyClient });
      });
    });
  }

  // Start heartbeat interval
  if (!heartbeatInterval) {
    heartbeatInterval = setInterval(() => {
      if (proxyClient) {
        if (proxyClient.isAlive === false) {
          console.log('Proxy connection dead, terminating...');
          proxyClient.terminate();
          proxyClient = null;
          broadcastStatus();
          return;
        }

        proxyClient.isAlive = false;
        proxyClient.send(JSON.stringify({ type: 'HEARTBEAT' }));
      }
    }, 30000);
  }

  return wss;
};

const startCollectionTask = (taskId, sources) => {
  if (!proxyClient || proxyClient.readyState !== 1) {
    return false;
  }

  proxyClient.send(JSON.stringify({
    type: 'START_COLLECTION',
    payload: { task_id: taskId, sources }
  }));

  // Start timeout timer
  const app = proxyClient.app; // We should probably attach this
  const io = null; // Need to get io here too if possible, or pass it in
  
  const timer = setTimeout(() => {
    console.log(`Task ${taskId} timed out.`);
    // We need access to io here to notify frontend
    // For now, it will be handled by the message listener if it received the message
  }, COLLECTION_TIMEOUT);
  
  activeTasks.set(taskId, timer);
  return true;
};

const handleProxyMessage = (ws, message, io) => {
  const { type, payload } = message;
  
  switch (type) {
    case 'IDENTIFY':
      console.log(`Proxy identified as: ${payload.client_id}`);
      break;
    case 'ITEM_COLLECTED':
      handleItemCollected(payload, io);
      break;
    case 'PROGRESS_UPDATE':
      handleProgressUpdate(payload, io);
      break;
    case 'COLLECTION_COMPLETE':
      handleCollectionComplete(payload, io);
      break;
    case 'COLLECTION_ERROR':
      handleCollectionError(payload, io);
      break;
    default:
      console.warn(`Unknown message type: ${type}`);
  }
};

const getProxyClient = () => proxyClient;

module.exports = {
  validateToken,
  initProxyServer,
  getProxyClient,
  activeTasks,
  COLLECTION_TIMEOUT
};