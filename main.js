const { app, BrowserWindow, Menu, globalShortcut, ipcMain } = require('electron')
const path = require('path')



const { GoogleTranslator } = require('@translate-tools/core/translators/GoogleTranslator');
const translator = new GoogleTranslator({
	headers: {
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
	},
});


process.env.NODE_ENV = 'development'

const isDev = process.env.NODE_ENV !== 'production' ? true: false

let win

function translate(text, from = {}, to = {}) {
	translator
		.translate(text, 'en', 'ru')
		.then((translate) => {
			win.webContents.send('onUpdateTranslateResult', translate)
		});
}

function globalShortcuts() {
	let hideToggle = false;
	globalShortcut.register('CommandOrControl+Q', () => {
		console.log('CommandOrControl+X is pressed')
		if (!hideToggle) {
			hideToggle = true;
			win.hide()
			return;
		}

		if (hideToggle) {
			hideToggle = false;
			win.show()
		}
	})

	globalShortcut.register('f5', function() {
		console.log('f5 is pressed')
		win.reload()
	})
}

const createWindow = () => {
	win = new BrowserWindow({
		width: 800,
		height: 600,
		icon: './assets/icon.png',
		webPreferences: {
			preload: path.join(__dirname, './preload.js'),
		},
		resizable: true,
		autoHideMenuBar: true,
		frame: false,
		transparent: true,

	})
	win.loadFile('./index.html')
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})

app.whenReady().then(() => {
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})

	ipcMain.on('textToTranslate', (event, textToTranslate) => {
		translate(textToTranslate)
	})

	globalShortcuts()

	createWindow()

	win.webContents.openDevTools()

	win.setAlwaysOnTop(true, 'screen');
})


