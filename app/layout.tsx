import { Metadata, Viewport } from "next";
import clsx from "clsx";
import "@/styles/globals.css";
import NextAuthProvider from "./providers/next-auth-provider";
import { TanstackProvider } from "./providers/tanstack-provider";
import { ReduxProvider } from "./providers/redux-provider";
import { ToastProvider } from "./context/toast-context";
import { siteConfig } from "@/config/site";
import { outfit } from "@/config/fonts";
import { Providers } from "@/app/providers/providers";
import { ToastContainer } from "@/components/elements/react-toasted/toast-container";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  ...siteConfig,
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={clsx(
        "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500 dark:scrollbar-thumb-neutral-300"
      )}
      suppressHydrationWarning
      lang="en"
    >
      <head>
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              prerender: [{ source: "/product/*" }, { source: "/category/*" }],
              prefetch: [{ source: "/search/*" }],
            }),
          }}
        />
      </head>
      <body
        className={clsx(
          "min-h-screen font-outfit text-foreground bg-background antialiased",
          outfit.variable
        )}
        suppressHydrationWarning={true}
      >
        <main>
          <NextAuthProvider>
            <TanstackProvider>
              <Providers
                themeProps={{ attribute: "class", defaultTheme: "dark" }}
              >
                <ReduxProvider>
                  <ToastProvider>
                    {children}
                    <ToastContainer />
                  </ToastProvider>
                </ReduxProvider>
              </Providers>
            </TanstackProvider>
          </NextAuthProvider>
        </main>
      </body>
    </html>
  );
}
