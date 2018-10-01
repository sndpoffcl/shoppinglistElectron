const electron  = require('electron');
const url = require('url');
const path = require('path');
const { app, BrowserWindow , Menu , ipcMain} = electron ;

//SET ENV
process.env.NODE_ENV === 'production';

let mainWindow = null ;
let addWindow = null ;

//create menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [{
            label: 'Add Item',
            click : _=>{
                createAddWindow();
            }
        },
            {
                label : 'Clear All',
                click:_=>{
                    mainWindow.webContents.send('item:clear');
                }

            },
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command + Q ' : ' Ctrl + Q',
                click:_=>{ app.quit();
                }
            }


        ]
    }
];


//listen for the app to be ready
app.on('ready' , _ =>{
    //create new window
   mainWindow = new BrowserWindow({});
   //load html in window
   mainWindow.loadURL(`file://${__dirname}/mainWindow.html`);

   //create menu from menu template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //insert the menu
    Menu.setApplicationMenu(mainMenu);
    //after closing mainwindow
    mainWindow.on('close',_ =>{
        app.quit();
        mainWindow= null;
    });
});




//create add item -> createAddWindow()
function createAddWindow() {
    addWindow = new BrowserWindow({
        width:300,
        height : 400,
        title: 'Add shopping list item'


    });

//after closing addWindow

    addWindow.on('close',_=>{
        addWindow = null;
    });
    addWindow.loadURL(`file://${__dirname}/addWindow.html`);

}

//catch item add from ipcRenderer
ipcMain.on('item:add' , function (e,item) {
    console.log(item + "is recieved ");
   mainWindow.webContents.send('item:add', item);
   addWindow.close();
});



//add developer tools if not in production
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
       label: 'Developer tools',
        submenu:[
            {
                label: 'Toggle Dev Tools',
                accelerator: process.platform === 'darwin' ? 'Command + I' : 'Ctrl + I',
                click(item,focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role : 'reload'
            }
        ]
    });
}
//if mac add empty object
if(process.platform === 'darwin'){
    mainMenuTemplate.unshift({});
}