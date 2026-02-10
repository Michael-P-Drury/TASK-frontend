import Sidebar from "./components/sidebar";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          
          <Sidebar />

          <main className="main-content">
            {children}
          </main>
          
        </div>
      </body>
    </html>
  );
}