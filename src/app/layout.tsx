
import './globals.css';
import Providers from '@/app/providers/providers'; 

export const metadata = {
  title: 'My App',
  description: '...',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
