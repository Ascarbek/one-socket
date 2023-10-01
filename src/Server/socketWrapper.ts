import * as net from 'node:net';
import * as process from 'process';

export const socketWrapper = (host: string, port: number, dataCallback: (msg: string) => Promise<any>) => {
  const server = net.createServer((socket) => {
    let buffer = '';
    socket.on('data', async (data) => {
      buffer += data.toString();
      if (data.toString().substring(data.toString().length - 1) !== '\n') {
        return;
      }

      const request = buffer;
      if (!request) {
        socket.write(JSON.stringify({ success: false, error: 'Invalid request payload' }));
        return;
      }

      const response = await dataCallback(request);
      socket.write(JSON.stringify(response) + '\n');
    });

    socket.on('end', () => {});

    socket.on('error', (err) => {
      console.error('oh oh...  ', err);
      process.exit(1);
    });
  });

  if (!port) {
    console.error('port is not defined in environment variables');
    return;
  }

  server.listen(port, host, () => {
    console.log(`One Socket Server started at port ${port}`);
  });
};
