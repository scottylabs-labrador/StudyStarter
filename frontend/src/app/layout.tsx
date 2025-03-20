import "~/styles/globals.css";

import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs";
import ReduxProvider from "./StoreProvider";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Study Group Finder",
  description:"Totally novel way to support your grade",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <ReduxProvider>
      <html lang="en">
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function () {
                  try {
                    let theme = localStorage.getItem("theme") || "light";
                    if (theme === "dark") {
                      document.documentElement.classList.add("dark");
                    }
                      console.log("idk");
                  } catch (e) {
                    //console.error("Theme loading error:", e);
                  }
                })();
              `,
            }}
          />
        </head>
        <body className="bg">
          <main>
            {children}
            <Toaster />
          </main>
        </body>
      </html>
      </ReduxProvider>
    </ClerkProvider>
  );
}