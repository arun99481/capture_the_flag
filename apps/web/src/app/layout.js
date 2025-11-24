"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const google_1 = require("next/font/google");
require("./globals.css");
const providers_1 = require("@/components/providers");
const inter = (0, google_1.Inter)({ subsets: ["latin"] });
exports.metadata = {
    title: "TartanCTF",
    description: "CMU Capture the Flag Platform",
};
function RootLayout({ children, }) {
    return (<html lang="en">
            <body className={inter.className}>
                <providers_1.Providers>{children}</providers_1.Providers>
            </body>
        </html>);
}
