import TcpSocketServer from './tcp-socket-server.mjs';
import SerialManager from './serial-manager.mjs'; 
import SerialPort from 'serialport';

let tcpSocketServer = new TcpSocketServer();
let tcpPort = process.env.PORT || 80;


let serialManager = new SerialManager(); 

tcpSocketServer.initialiseServer(tcpPort);

serialManager.on('message', (data)=>{
    // check it's a valid message... or not? 
    tcpSocketServer.broadcast(data); 
});

tcpSocketServer.on('message', (data)=> { 
    // check if it's a valid message... or not? 
    serialManager.broadcast(data); 

});