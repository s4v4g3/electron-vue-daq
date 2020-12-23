import { ipcMain } from "electron";
import edge from "electron-edge-js";
import path from "path";

declare const __static: string;

export class IpcHandlers {

  driver: edge.Func<string, Buffer>
  constructor() {
    this.driver = edge.func({
      assemblyFile: path.join(__static, "../src/DAQmxClassLibrary.dll"),
      typeName: "DAQmxClassLibrary.DAQAcquire",
      methodName: "Acquire", // This must be Func<object,Task<object>>
    });
  }

  public init() {
    ipcMain.handle("get-data", (_event, args) => {
      return this.getData(args);
    });
  }

  private async getData(args: any) {
    return await new Promise((resolve, reject) => {
      this.driver(args, (error, result) => {
        if (error) reject(error);
        let len = result.length / 8;
        let daqdata = new Array(len);
        for (let i = 0; i < len; ++i) {
          daqdata[i] = result.readDoubleLE(i * 8);
        }
        resolve(daqdata);
      });
    });
  }
}
