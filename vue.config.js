module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  pluginOptions: {
    electronBuilder: {
        externals:["electron-edge-js"],
        builderOptions: {
            extraResources:['src/DAQmxClassLibrary.dll']
        },
      // Use this to change the entrypoint of your app's main process
      mainProcessFile: 'src/background.ts',
      // Provide an array of files that, when changed, will recompile the main process and restart Electron
      // Your main process file will be added by default
      mainProcessWatch: ['src/ipc/main.ts'],
      // Provide a list of arguments that Electron will be launched with during "electron:serve",
      // which can be accessed from the main process (src/background.js).
      // Note that it is ignored when --debug flag is used with "electron:serve", as you must launch Electron yourself
      // Command line args (excluding --debug, --dashboard, and --headless) are passed to Electron as well
      //mainProcessArgs: ['--arg-name', 'arg-value']
    }
  }
}