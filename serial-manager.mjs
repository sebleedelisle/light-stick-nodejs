// SerialManager
// Opens all ports with a particular name fragment
// Makes a LightStick object for each serial
// Periodically checks 
//      for new ports that haven't been opened
//      for LightSticks that have become unresponsive, and disconnects
//
// When a message is received (in the main app) it's sent to all LightSticks
// When a message is received from a LightStick
//    - if it's in command format, then fire an event that tells the 
//      main app to pass it on to TCP clients


import Utils from './utils.mjs';
import SerialPort from 'serialport';
import LightStick from './light-stick.mjs'; 
import EventEmitter from 'events';

export default class SerialManager extends EventEmitter{
  constructor() {
    super();
    
    this.lightSticks = []; 

    this.checkForNewSerialDevices(); 

    setInterval(()=>{this.update()}, 1000); // update every second

  }

  update() { 
    this.checkForNewSerialDevices(); 

  }

  checkForNewSerialDevices() { 

    // TODO - potentially check for missing devices on sticks already attached ?

    SerialPort.list().then((result) => {

      // result is an array of port data objects such as : 
      // {
      //   path: '/dev/tty.usbmodem11201',
      //   manufacturer: 'Adafruit',
      //   serialNumber: 'F3D409AF50525231392E3120FF171223',
      //   pnpId: undefined,
      //   locationId: '00112000',
      //   vendorId: '239a',
      //   productId: '800b'
      // }


      for (let portData of result) {

        Utils.logNotice("portData : ", portData.path);

        //MacOS they tend to have the name tty.usbmodemxxxx, on Linux ttyACMx
        let portname = portData.path; 

        if((portname.indexOf('usbmodem') > -1) || (portname.indexOf('ttyACM')>-1)) { 
          
          if(!this.lightStickPortAlreadyConnected(portname)) {
            Utils.logNotice("Adding light stick at : ", portname); 
            let lightStick = new LightStick(portname); 
            this.lightSticks.push(lightStick); 
            // if we get a message, pass it up the chain!
            lightStick.on("message", (data)=> { 
              this.emit("message", data); 
            });

          }

          // // then we have a candidate!
          // let serialport = new SerialPort(portData.path, {baudRate:115200});

          // serialport.on('error', function(err) {
          //   Utils.logError('Error: ', err.message);
          // })

          // serialport.on('open', function() {
          //   Utils.logNotice('Serialport opened', portData.path);
          // });

          // serialport.on('data', function(data) { 
          //   Utils.logNotice(portData.path, "-> ", data.toString());
          //   this.emit("message", data.toString()); 
          // });
        }

      }

    });
  }

    // const port = result.find(port => port.comName.indexOf('modem') > -1);

    // if (!port) {
    //   //this.logError('No port found, retrying');
    //   //TODO send this to the controller!
    //   return this.connect(callback);
    // }

    // //const portName = port.comName;
   
          // try {
          //   this.port = new SerialPort(portName, { baudRate: 9600 }, (err) => {
          //     if (err) {
          //       this.logError('Retrying connection', err.message);
          //       return this.connect(callback);
          //     } else {
          //       console.log('ShoeManager connnnnnnected!!!!');
          //       this.connected = true;
          //     }
    
          //     this.port.on('error', (err) => {
          //       if (err) {
          //         this.logError(err.message);
          //         setTimeout(() => {
          //           this.connect(callback);
          //         }, 1000);
          //       }
          //     });
    
          //     if (typeof callback === 'function') callback(this.port);
          //   });
          // } catch (err) {
          //   if (err) {
          //     this.logError('Retrying connection', err.message);
          //     return this.connect(callback);
          //   }
          // }


  lightStickPortAlreadyConnected(portname) { 
    for(let lightStick of this.lightSticks) { 
      if(lightStick.portName == portname) return true; 
    }
    return false; 
  }

  broadcast(message) {
    for(let lightstick of this.lightSticks) { 
      lightstick.send(message); 

    }
    
  }

  // // _connect(callback) {
  // //   SerialPort.list().then((result) => {
  // //     const port = result.find(port => port.comName.indexOf('modem') > -1);

  // //     if (!port) {
  // //       //this.logError('No port found, retrying');
  // //       //TODO send this to the controller!
  // //       return this.connect(callback);
  // //     }

  // //     const portName = port.comName;

  // //     try {
  // //       this.port = new SerialPort(portName, { baudRate: 9600 }, (err) => {
  // //         if (err) {
  // //           this.logError('Retrying connection', err.message);
  // //           return this.connect(callback);
  // //         } else {
  // //           console.log('ShoeManager connnnnnnected!!!!');
  // //           this.connected = true;
  // //         }

  // //         this.port.on('error', (err) => {
  // //           if (err) {
  // //             this.logError(err.message);
  // //             setTimeout(() => {
  // //               this.connect(callback);
  // //             }, 1000);
  // //           }
  // //         });

  // //         if (typeof callback === 'function') callback(this.port);
  // //       });
  // //     } catch (err) {
  // //       if (err) {
  // //         this.logError('Retrying connection', err.message);
  // //         return this.connect(callback);
  // //       }
  // //     }
  // //   }).catch((err) => {
  // //     if (err) {
  // //       this.logError('Retrying connection', err.message);
  // //       return this.connect(callback);
  // //     }
  // //   });
  // // }

  // // connect(callback, auto) {
  // //   if (typeof auto !== 'undefined') this.autoConnect = auto;

  // //   if (this.autoConnect) {
  // //     setTimeout(() => {
  // //       this._connect(callback);
  // //     }, 1000);
  // //   } else {
  // //     this._connect(callback);
  // //   }
  // // }

  // // disconnect(callback) {
  // //   this.autoConnect = false;
  // //   this.port.close(() => {
  // //     this.connected = false;

  // //     if (typeof callback === 'function') callback(this.connected);
  // //   });
  // // }

  // logError(message) {
  //   console.error.apply(null, ['ShoeManager:'].concat([].slice.call(arguments)));
  // }

  hasChanged() {
    const returnValue = Boolean(this.hasChangedState);
    this.hasChangedState = false;

    return returnValue;
  }

  isConnected() {
    return this.connected;
  }
}

