import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { StudentDB } from "./db/students.js";
import { PaymentDB } from "./db/payments.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(__dirname);

function createWindow() {
  const preloadPath = path.resolve(__dirname, "preload.js");

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: preloadPath,
    },
  });

  win.loadFile(path.join(__dirname, "../../dist-react/index.html"));
}

// --- Students IPC ---
ipcMain.handle("students:getAll", () => StudentDB.getAll());
ipcMain.handle("students:getById", (_event, id: number) =>
  StudentDB.getById(id)
);
ipcMain.handle("students:add", (_event, student) => StudentDB.add(student));
ipcMain.handle("students:update", (_event, student) =>
  StudentDB.update(student)
);
ipcMain.handle("students:delete", (_event, id: number) => StudentDB.delete(id));

// --- Payments IPC ---
ipcMain.handle("payments:getAll", () => PaymentDB.getAll());
ipcMain.handle("payments:getById", (_event, id: number) =>
  PaymentDB.getById(id)
);
ipcMain.handle("payments:add", (_event, payment) => PaymentDB.add(payment));
ipcMain.handle("payments:update", (_event, payment) =>
  PaymentDB.update(payment)
);
ipcMain.handle("payments:delete", (_event, id: number) => PaymentDB.delete(id));

app.whenReady().then(createWindow);
