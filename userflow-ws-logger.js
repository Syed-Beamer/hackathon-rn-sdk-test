const NativeWebSocket = global.WebSocket;

function pretty(data) {
  try {
    return JSON.stringify(JSON.parse(data), null, 2);
  } catch {
    return String(data);
  }
}

function LoggingWebSocket(url, protocols) {
  const socket = new NativeWebSocket(url, protocols);
  console.log("[WS] open ->", url);

  const send = socket.send.bind(socket);
  socket.send = (data) => {
    console.log("[WS] >>>", pretty(data));
    return send(data);
  };

  socket.addEventListener("message", (event) => {
    console.log("[WS] <<<", pretty(event.data));
  });
  socket.addEventListener("error", (event) => {
    console.log("[WS] error", event?.message ?? event);
  });
  socket.addEventListener("close", (event) => {
    console.log("[WS] close", event?.code, event?.reason);
  });

  return socket;
}

LoggingWebSocket.prototype = NativeWebSocket.prototype;
LoggingWebSocket.CONNECTING = NativeWebSocket.CONNECTING;
LoggingWebSocket.OPEN = NativeWebSocket.OPEN;
LoggingWebSocket.CLOSING = NativeWebSocket.CLOSING;
LoggingWebSocket.CLOSED = NativeWebSocket.CLOSED;

global.WebSocket = LoggingWebSocket;
