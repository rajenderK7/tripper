import { createClerkClient } from "@clerk/nextjs/server";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
});

export const getClerkClient = () => clerkClient;
