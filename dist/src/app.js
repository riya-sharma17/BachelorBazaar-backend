"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const routev1_1 = __importDefault(require("./routes/routev1"));
class App {
    app;
    port;
    base_url;
    constructor(port, base_url) {
        this.app = (0, express_1.default)();
        this.port = port;
        this.base_url = base_url;
    }
    async initialize() {
        try {
            this.initializeMiddlewares();
            this.initializeRoutes();
            // console.log("Express app initialized");
        }
        catch (error) {
            console.log("Server Initialization error:", error);
            // process.exit(1);
        }
    }
    initializeMiddlewares() {
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use("/uploads", express_1.default.static("uploads"));
    }
    initializeRoutes() {
        this.app.use("/api/v1", routev1_1.default);
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map