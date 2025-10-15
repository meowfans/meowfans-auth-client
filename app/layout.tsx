import { fetchRequest } from '@/hooks/useAPI';
import { AppConfig } from '@/lib/app.config';
import { authCookieKey, FetchMethods, JwtUser, UserRoles } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { configService } from '@/util/config';
import { buildSafeUrl } from '@/util/helpers';
import { Theme } from '@radix-ui/themes';
import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Toaster } from 'sonner';
import './globals.css';

export async function generateMetadata() {
  const headersList = headers();
  const pathname = (await headersList).get('x-pathname');

  const metadata = {
    metadataBase: new URL(AppConfig.siteUrl),
    title: {
      template: AppConfig.template,
      default: `${AppConfig.title} | ${pathname?.substring(1)}`
    },
    alternates: {
      canonical: AppConfig.canonical
    },
    manifest: AppConfig.manifest,
    applicationName: AppConfig.applicationName,
    description: AppConfig.description,
    openGraph: {
      siteName: AppConfig.site_name,
      title: AppConfig.title,
      description: AppConfig.description,
      type: AppConfig.type as 'website',
      locale: AppConfig.locale,
      url: AppConfig.siteUrl
    },
    generator: 'Next.js',
    keywords: AppConfig.keywords,
    icons: AppConfig.icons
  } satisfies Metadata;
  return metadata;
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--primary-font',
  style: 'normal'
});
export const viewport: Viewport = {
  themeColor: '#FFFFFF'
};

export const verifyAccessToken = async (token?: string) => {
  const data = await fetchRequest({
    fetchMethod: FetchMethods.POST,
    pathName: '/auth/verify',
    init: {
      credentials: 'include',
      body: JSON.stringify({ token }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  });
  return data as JwtUser;
};

export const handleValidateAndRedirect = async () => {
  try {
    const cookiesList = await cookies();
    const accessToken = cookiesList.get(authCookieKey)?.value;
    const jwtUser = await verifyAccessToken(accessToken);
    if (jwtUser) return await redirectToApp(jwtUser);
  } catch {
    return;
  }
};

export const redirectToApp = async (jwtUser: JwtUser) => {
  switch (jwtUser.roles[0]) {
    case UserRoles.CREATOR:
      return redirect(buildSafeUrl({ host: configService.NEXT_PUBLIC_CREATOR_URL, pathname: '/profile' }));
    case UserRoles.FAN:
      return redirect(buildSafeUrl({ host: configService.NEXT_PUBLIC_FAN_URL, pathname: '/newest' }));
  }
};

interface Props {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: Props) {
  await handleValidateAndRedirect();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="rating" content="adult" />
        <meta name="robots" content="index, follow" />
        <meta name="classification" content="Adult" />
        <meta name="rating" content="RTA-5042-1996-1400-1577-RTA" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/icons/app_icon_20x20.svg" />
        {AppConfig.icons.map(({ rel, url }, idx) => (
          <link key={idx} rel={rel} href={url} />
        ))}
      </head>
      <body className={cn(inter.variable, 'overscroll-none')}>
        <Toaster position="top-center" richColors />
        <Theme>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            value={{ light: 'light', dark: 'dark' }}
          >
            <main className="w-full">{children}</main>
          </ThemeProvider>
        </Theme>
      </body>
    </html>
  );
}
