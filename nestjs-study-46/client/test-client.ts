import { io } from 'socket.io-client';

const socket = io(
  'http://localhost:3000',
  {
    transports: ['websocket'],

    auth: {
      token: 'demo-robin-token',
    },
  },
);

socket.on('connect', () => {
  console.log(
    '连接成功：',
    socket.id,
  );

  socket.emit(
    'agent.execute',
    {
      prompt:
        '帮我分析 TypeScript 类型错误',
      model: 'gpt-4.1',
    },
    (ack: unknown) => {
      console.log('ACK：', ack);
    },
  );
});

socket.on('agent.result', (result) => {
  console.log('Agent 执行结果：', result);

  socket.emit(
    'agent.status',
    undefined,
    (tasks: unknown) => {
      console.log('当前用户任务：', tasks);

      socket.disconnect();
    },
  );
});

socket.on('exception', (error) => {
  console.error(
    'WebSocket 异常：',
    error,
  );
});

socket.on('connect_error', (error) => {
  console.error(
    '连接失败：',
    error.message,
  );
});
