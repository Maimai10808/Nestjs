import { io } from 'socket.io-client';

const socket = io(
  'http://localhost:3000',
  {
    transports: ['websocket'],
  },
);

socket.on('connect', () => {
  console.log(
    'Socket.IO 连接成功：',
    socket.id,
  );

  socket.emit(
    'agent.start',
    {
      prompt:
        '帮我分析并修复 TypeScript 错误',
    },
    (response: unknown) => {
      console.log(
        '启动任务 ACK：',
        response,
      );
    },
  );
});

socket.on('connected', (data) => {
  console.log('服务器欢迎消息：', data);
});

socket.on('agent.started', (data) => {
  console.log('任务开始：', data);
});

socket.on('agent.progress', (data) => {
  console.log('执行进度：', data);
});

socket.on(
  'agent.approval_required',
  (data: { taskId: string }) => {
    console.log('需要批准：', data);

    setTimeout(() => {
      socket.emit(
        'agent.approve',
        {
          taskId: data.taskId,
        },
        (response: unknown) => {
          console.log(
            '批准 ACK：',
            response,
          );
        },
      );
    }, 2000);
  },
);

socket.on('agent.completed', (data) => {
  console.log('任务完成：', data);

  socket.disconnect();
});

socket.on('agent.cancelled', (data) => {
  console.log('任务取消：', data);

  socket.disconnect();
});

socket.on('agent.failed', (data) => {
  console.error('任务失败：', data);

  socket.disconnect();
});

socket.on('exception', (error) => {
  console.error('WebSocket 异常：', error);
});

socket.on('connect_error', (error) => {
  console.error('连接失败：', error.message);
});
