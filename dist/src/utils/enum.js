"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.loginType = void 0;
var loginType;
(function (loginType) {
    loginType["EMAIL"] = "email";
    loginType["GOOGLE"] = "google";
    loginType["MOBILE"] = "mobile";
})(loginType || (exports.loginType = loginType = {}));
;
var Role;
(function (Role) {
    Role["USER"] = "0";
    Role["ADMIN"] = "1";
})(Role || (exports.Role = Role = {}));
//# sourceMappingURL=enum.js.map