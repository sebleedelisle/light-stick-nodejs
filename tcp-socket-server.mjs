import net  from 'net';
import EventEmitter from 'events';

import Utils from './utils.mjs'; 

export default class TcpSocketServer extends EventEmitter{ 

    constructor() {
        super(); 
        this.clients = []; 
        this.messageTypes = []; 

        this.tcpServer = null; 
        this.packetBuffer = "";
    }

    initialiseServer(port) { 
        this.tcpServer = net.createServer();
        this.tcpServer.on('connection', (client) => {this.handleNewConnection(client)}); 

        Utils.logNotice("TcpSocketServer::listening on port ", port); 
        this.tcpServer.listen(port); 
    }

    handleNewConnection(client) { 

        // if not on safe list, destroy
        if(this.isClientAuthorised(client)) { // always true in this
            Utils.logNotice("TcpSocketServer : client on safe list : ", client.remoteAddress); 
            this.clients.push(client); 
            
            // add listeners : 
            client.on('data', (data) =>{
                this.handleData(client, data); 
            });
            client.on('close', (hadError) => { 
                // remove client from list
                this.clients.splice(this.clients.indexOf(client), 1); 
            });
            client.on('end', () => { 
                // not sure what 'end' means
            });
            client.on('error', (err) => {
                // handle error
            });

            return true; 

        } else {
            Utils.logError("TcpSocketServer : client not authorised : ", client.remoteAddress); 
            client.destroy();
            return false;  
        } 

    }
 
    handleData(client, data) { 

        //Utils.logNotice("TCPSocket.handleData"+ data.toString()); 
        // System for carrying over half packets
        let packetstring = this.packetBuffer+data.toString(); 
       
        this.emit("message", packetstring); 


    }
    
    broadcast(data) { 
        Utils.logNotice("TcpSocketServer.broadcast", data); 
        for(let client of this.clients) { 
            client.write(data);//+Utils.delimiter); 
        }
    }
    isClientAuthorised(client) { 
        return true; 
    
    }
    disconnectClient(client) { 
        client.destroy();
    }
   
}