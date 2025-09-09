import NextAuth, {
  type NextAuthOptions,
  type User,
  type Session,
  type DefaultSession,
} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Extend the User type with our custom properties
interface ApiUser extends User {
  accessToken: string;
  id: string;
  email: string;
}

// Extend the Session type with our custom properties
interface ApiSession extends Session {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name?: string | null;
  } & DefaultSession['user'];
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        otp: { label: 'OTP', type: 'text' },
        recaptchaToken: { label: 'Recaptcha', type: 'text' },
      },
      async authorize(credentials) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/v1/auth/customer/verifyOtpAndLogin`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: credentials?.email,
                otp: credentials?.otp,
                recaptchaToken: credentials?.recaptchaToken,
              }),
            },
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || `HTTP error! Status: ${response.status}`,
            );
          }

          const fullToken = response.headers.get('authorization');

          if (!fullToken || !fullToken.startsWith('Bearer ')) {
            throw new Error('Authorization token missing or invalid format');
          }

          const accessToken = fullToken.replace('Bearer ', '');

          const userResponse = await response.json();
          const userData = userResponse?.user || {};

          // Ensure email is always a string
          const email = credentials?.email || userData.email || '';

          return {
            id: userData.id ? String(userData.id) : 'unknown',
            email,
            name: userData.name || '',
            accessToken,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          throw new Error('Authentication failed');
        }
      },
    }),

    CredentialsProvider({
      id: 'google-callback',
      name: 'Google Callback',
      credentials: {
        accessToken: { label: 'Access Token', type: 'text' },
        userData: { label: 'User Data', type: 'text' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.accessToken) {
            throw new Error('No access token provided');
          }

          // Parse user data if provided
          let userData = {
            id: '',
            email: '',
            name: null,
          };
          if (credentials.userData) {
            userData = JSON.parse(credentials.userData);
          }

          const userId = userData.id || `google-${Date.now()}`;

          return {
            id: userId,
            email: userData.email || '',
            name: userData.name || '',
            accessToken: credentials.accessToken,
          };
        } catch (error) {
          console.error('Google callback authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      const tokenExpiration = 23 * 60 * 60 * 1000 + 50 * 60 * 1000;

      if (user && account) {
        token.accessToken = (user as ApiUser).accessToken;
        token.id = user.id;
        token.email = user.email;
        token.expiresAt = Date.now() + tokenExpiration;
        return token;
      }

      if (trigger === 'update' && session?.accessToken) {
        token.accessToken = session.accessToken;
        token.expiresAt = Date.now() + tokenExpiration;
        return token;
      }

      if (token.expiresAt && Date.now() < token.expiresAt - 300000) {
        return token;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh-token`,
          {
            method: 'POST',
            credentials: 'include',
          },
        );

        if (response.ok) {
          const data = await response.json();
          token.accessToken = data.accessToken;
          token.expiresAt = Date.now() + tokenExpiration;
        } else {
          throw new Error('Token refresh failed');
        }
      } catch (error) {
        console.error('Token refresh error:', error);
        return { ...token, error: 'RefreshAccessTokenError' };
      }

      return token;
    },

    async session({ session, token }) {
      // Create a typed session object
      const typedSession: ApiSession = {
        ...session,
        accessToken: token.accessToken as string,
        user: {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
        },
      };

      if (token.error) {
        typedSession.error = token.error as string;
      }

      return typedSession;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Augment NextAuth types to include our custom properties
declare module 'next-auth' {
  interface User {
    accessToken: string;
    id: string;
    email: string;
  }

  interface Session {
    accessToken: string;
    user: {
      id: string;
      email: string;
      name?: string | null;
    } & DefaultSession['user'];
    error?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    id: string;
    email: string;
    expiresAt?: number;
    error?: string;
  }
}

export default NextAuth(authOptions);
