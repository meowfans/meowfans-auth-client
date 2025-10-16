import { AgeConfirmation } from '@/app/(legal)/components/AgeConfirmation';
import { CookieBanner } from '@/app/(legal)/components/CookieBanner';
import { AppBottomNav } from '@/components/AppBottomNav';
import { AppSidebar } from '@/components/AppSideBar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { UserContextWrapper } from '@/hooks/context/UserContextWrapper';
import { fetchRequest } from '@/hooks/useAPI';
import { AppConfig } from '@/lib/app.config';
import { authCookieKey, FetchMethods, UserRoles } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { getClient } from '@/packages/gql/ApolloClient';
import { ApolloWrapper } from '@/packages/gql/ApolloWrapper';
import { GET_FAN_PROFILE_QUERY } from '@/packages/gql/api/fanAPI';
import { FanProfilesEntity } from '@/packages/gql/generated/graphql';
import { configService } from '@/util/config';
import { buildSafeUrl, decodeJwtToken } from '@/util/helpers';
import { Theme } from '@radix-ui/themes';
import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const headerList = headers();
  const pathname = (await headerList).get('x-pathname') ?? '';

  return {
    metadataBase: new URL(AppConfig.siteUrl),
    title: {
      template: AppConfig.template,
      default: `${AppConfig.title} | ${pathname.substring(1) || 'Home'}`
    },
    description: AppConfig.description,
    keywords: AppConfig.keywords,
    openGraph: {
      siteName: AppConfig.site_name,
      title: `${AppConfig.title} | 18+`,
      description: AppConfig.subDescription,
      type: 'website',
      locale: AppConfig.locale,
      url: AppConfig.siteUrl,
      images: AppConfig.images
    },
    alternates: { canonical: AppConfig.canonical },
    manifest: AppConfig.manifest,
    applicationName: AppConfig.applicationName,
    generator: 'Next.js',
    icons: AppConfig.icons
  };
}

export const viewport: Viewport = {
  themeColor: AppConfig.themeColor
};

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--primary-font' });

const verifyAccessToken = async (token: string) => {
  return fetchRequest({
    fetchMethod: FetchMethods.POST,
    pathName: '/auth/verify',
    init: {
      body: JSON.stringify({ token }),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    }
  });
};

const getStatus = async () => {
  try {
    const client = await getClient();
    const { data } = await client.query({ query: GET_FAN_PROFILE_QUERY });
    return data?.getFanProfile as FanProfilesEntity;
  } catch {
    return null;
  }
};

const handleValidateAuth = async () => {
  const cookiesList = await cookies();
  const accessToken = cookiesList.get(authCookieKey)?.value;
  const decodedToken = decodeJwtToken(accessToken);

  if (!accessToken || !decodedToken) return null;

  try {
    await verifyAccessToken(accessToken);

    switch (decodedToken.roles?.[0]) {
      case UserRoles.ADMIN:
        return redirect(buildSafeUrl({ host: configService.NEXT_PUBLIC_ADMIN_URL }));
      case UserRoles.CREATOR:
        return redirect(buildSafeUrl({ host: configService.NEXT_PUBLIC_CREATOR_URL }));
    }

    return await getStatus();
  } catch {
    return null;
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await handleValidateAuth();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="robots" content="index, follow" />
        <meta name="rating" content="RTA-5042-1996-1400-1577-RTA" />
        <meta name="classification" content="Adult" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/icons/logo_192.png" />
        <link rel="apple-touch-icon" href="/icons/logo_512.png" />
      </head>
      <body className={cn(inter.variable, 'overscroll-none')}>
        <ApolloWrapper>
          <UserContextWrapper user={user}>
            <Theme>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <AgeConfirmation />
                <SidebarProvider>
                  <AppSidebar />
                  <SidebarInset>
                    <Toaster position="top-center" richColors />
                    <main className="w-full">{children}</main>
                  </SidebarInset>
                </SidebarProvider>
                <AppBottomNav />
                <CookieBanner />
              </ThemeProvider>
            </Theme>
          </UserContextWrapper>
        </ApolloWrapper>
      </body>
    </html>
  );
}
