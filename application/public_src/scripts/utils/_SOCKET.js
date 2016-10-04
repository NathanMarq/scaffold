const SOCKET = io.connect('',
  {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 20
  });
