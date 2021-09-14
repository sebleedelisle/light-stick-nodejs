//
// Manages an individual light stick
// Opens a port to it
// When it gets a valid message from it, it emits the event
// Allows for messages to be sent to the stick
// Periodically checks the connection is still good
//

import Utils from './utils.mjs';
import SerialPort from 'serialport';
import EventEmitter from 'events';

export default class LightStick extends EventEmitter {
    constructor(portname) { 
        super(); 
        this.portName = portname; 

        // open the port
        this.serialPort = new SerialPort(this.portName, {baudRate:115200});

        this.serialPort.on('error', (err)=> {
            Utils.logError('Error: ', err.message);
            // when does this fire? should we call serialport.close ? 
          })

        this.serialPort.on('open', ()=> {
            Utils.logNotice('Serialport opened', this.portName);
            // send request for info
          });

        this.serialPort.on('data', (data)=> { 
            Utils.logNotice(this.portName, "-> ", data.toString());

            this.emit("message", data); 
            // Perhaps in future : 
            // Check to see if it's a light stick confirmation message

            // check if it's a command... 
            // if yes then emit an event (i think you can just emit whatever you want)
            // this.emit(messageType.name, client, messageType, data); 
          });




    }


}