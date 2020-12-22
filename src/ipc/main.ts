import { ipcMain } from "electron";
import edge from "electron-edge-js";
import path from "path";

export class IpcHandlers {
  driver: any;
  constructor() {
    //this.driver = __dirname
    this.driver = edge.func({
      //assemblyFile: path.resolve('DAQmxClassLibrary.dll'),
      assemblyFile: path.join(__dirname, "DAQmxClassLibrary.dll"),
      typeName: "DAQmxClassLibrary.DAQAcquire",
      methodName: "Acquire", // This must be Func<object,Task<object>>
    });
    /*
       this.driver = edge.func(`
    async (input) => {
        return (int)input + 7;
    }
`);
*/
  }

  public init() {
    ipcMain.handle("get-data", (_event, args) => {
      return this.getData(args);
    });
  }

  private async getData(args: any) {
    //console.log(this.driver)
    /*
        var foopy = edge.func({
            assemblyFile: path.join(__dirname, 'DAQmxClassLibrary.dll'),
            typeName: 'DAQmxClassLibrary.DAQAcquire',
            methodName: 'Acquire'
        });
        */
    return await new Promise((resolve, reject) => {
      this.driver("", (error, result) => {
        if (error) reject(error);
        //console.log(result)
        let len = result.length / 8;
        let daqdata = new Array(len);
        for (let i = 0; i < len; ++i) {
          daqdata[i] = result.readDoubleLE(i * 8);
        }
        resolve(daqdata);
      });
    });
    /*
        let data = []
        for(let i=0; i<100; ++i) {
            data[i] = (Math.random() * 10);
        }
        return data;
        */
  }
}
