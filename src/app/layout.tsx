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
