import { io } from 'socket.io-client';

const port = Number(
  process.env.PORT ?? 3000,
);

const taskId =
  process.env.TASK_ID ??
  'research-1001';

const mode =
  process.env.MODE ??
  'subscribe';

const socket = io(
  `http://localhost:${port}`,
  {
    transports: ['websocket'],
  },
);

socket.on('connect', () => {
  console.log(
    `Connected to port ${port}`,
  );

  socket.emit(
    'agent.subscribe',
    {
      taskId,
    },
    (response: unknown) => {
      console.log(
        'Subscribe ACK:',
        response,
      );

      if (mode === 'start') {
        socket.emit(
          'agent.start',
          {
            taskId,
          },
          (result: unknown) => {
            console.log(
              'Start ACK:',
              result,
            );
          },
        );
      }
    },
  );
});

socket.on('agent.progress', (data) => {
  console.log(
    'Agent Progress:',
    data,
  );

  if (data.progress === 100) {
    socket.disconnect();
  }
});

socket.on('connect_error', (error) => {
  console.error(
    'Connection error:',
    error.message,
  );
});
