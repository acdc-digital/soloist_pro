// electron/index.js

const { app, BrowserWindow, net } = require("electron");
const path = require("path");
const fs = require("fs");

// Check if the renderer server is running on a specific port
function isRendererServerRunning(port, callback) {
  const request = net.request({
    method: 'HEAD',
    url: `http://localhost:${port}`
  });
  
  request.on('response', (response) => {
    callback(response.statusCode === 200);
  });
  
  request.on('error', () => {
    callback(false);
  });
  
  request.end();
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Define ports to try (ordered by priority)
  const ports = [3000, 3001, 3002, 3003];
  
  // Try each port sequentially
  function tryNextPort(index) {
    if (index >= ports.length) {
      // If all ports failed, load the fallback HTML
      loadFallbackHTML(win);
      return;
    }
    
    const port = ports[index];
    isRendererServerRunning(port, (isRunning) => {
      if (isRunning) {
        // Renderer found at this port
        win.loadURL(`http://localhost:${port}`);
        console.log(`Loaded from development server at http://localhost:${port}`);
      } else {
        // Try the next port
        tryNextPort(index + 1);
      }
    });
  }
  
  // Start trying ports
  tryNextPort(0);
}

function loadFallbackHTML(win) {
  // Create a simple HTML file for testing
  const htmlPath = path.join(__dirname, "index.html");
  if (!fs.existsSync(htmlPath)) {
    fs.writeFileSync(htmlPath, `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Soloist Pro</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 20px; }
            h1 { margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <h1>Soloist Pro</h1>
          <p>Welcome to Soloist Pro! The Next.js renderer is not running.</p>
          <p>Start the renderer with: <code>pnpm --filter soloist_pro-renderer dev</code></p>
        </body>
      </html>
    `);
  }
  win.loadFile(htmlPath);
  console.log("Loaded from local file:", htmlPath);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});