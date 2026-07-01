import "~/styles/globals.css";
import "~/styles/components.css";

import ReduxProvider from "./StoreProvider";
import { Toaster } from "react-hot-toast";
import { PostHogProvider } from "./providers";
import { FirebaseAuthBridge } from "~/components/providers/FirebaseAuthBridge";

export const metadata = {
  title: "CMU Study",
  description: "Totally novel way to support your grade",
  icons: [{ rel: "icon", url: "/CMUStudy.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <PostHogProvider>
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
                    } catch (e) {
                      console.error("Theme loading error:", e);
                    }
                  })();
                `,
              }}
            />
            <meta
              name="google-site-verification"
              content="Lf_uD2-tHPEfZOIdYWrILlDTmOXS_8G5g1z82ZXhTFk"
            />
          </head>
          <body className="bg">
            <main>
              <FirebaseAuthBridge>{children}</FirebaseAuthBridge>
              <Toaster />
            </main>
          </body>
        </html>
      </PostHogProvider>
    </ReduxProvider>
  );
}
