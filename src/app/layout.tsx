import "~/styles/globals.css";

import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs";
import ReduxProvider from "./StoreProvider";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "BoilerGram",
  description: "Your new favorite social media platform.",
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
        <body className="bg-white">
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
