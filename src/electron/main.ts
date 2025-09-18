import { app, BrowserWindow } from "electron";
import path from "path";
import { isDev } from "./utils/env.js";
import { getPreloadPath } from "./pathResolver.js";
import { DatabaseManager } from "./config/database.js";
import { MigrationManager } from "./db/migrations.js";
import { IPCController } from "./controllers/ipcController.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Application {
  private mainWindow: BrowserWindow | null = null;

  async initialize(): Promise<void> {
    await app.whenReady();
    await this.initializeDatabase();
    this.registerEventHandlers();
    IPCController.registerHandlers();
    this.createWindow();
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await MigrationManager.initialize();
      console.log("Database initialized successfully");
    } catch (error) {
      console.error("Failed to initialize database:", error);
      app.quit();
    }
  }

  private createWindow(): void {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      icon: path.join(__dirname, "../../public/logo.png"),
      webPreferences: {
        preload: getPreloadPath(),
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    if (isDev()) {
      this.mainWindow.loadURL("http://localhost:5123");
      this.mainWindow.webContents.openDevTools();
    } else {
      this.mainWindow.loadFile(path.join(app.getAppPath(), "dist-react/index.html"));
    }
  }

  private registerEventHandlers(): void {
    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        DatabaseManager.close();
        app.quit();
      }
    });

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow();
      }
    });

    app.on("before-quit", () => {
      DatabaseManager.close();
    });
  }
}

const application = new Application();
application.initialize().catch(console.error);