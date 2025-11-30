"use strict";
const token = jwt.sign({ id: 7, role: "captain" }, "YOUR_SECRET");
return res
    .cookie("access_toekn", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
})
    .status(200)
    .json({ message: "Logged in. Nice work.}); });
//# sourceMappingURL=token.js.map