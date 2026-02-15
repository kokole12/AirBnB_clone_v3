import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { WebhookEvent } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are missing headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  // Get body
  const body = await req.text();

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;
  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, unsafe_metadata } = evt.data;

    const email = email_addresses[0]?.email_address;

    if (!email || !id) {
      return new Response('Missing email or user ID', {
        status: 400,
      });
    }

    try {
      // Get the role from unsafe_metadata (set during signup)
      const role = (unsafe_metadata?.role as 'TENANT' | 'LANDLORD') || 'TENANT';

      const user = await prisma.user.upsert({
        where: { clerkId: id },
        update: {
          email,
          firstName: first_name || undefined,
          lastName: last_name || undefined,
          role,
        },
        create: {
          clerkId: id,
          email,
          firstName: first_name || '',
          lastName: last_name || '',
          role,
        },
      });

      console.log('User synced to database:', user.id);
      return new Response(JSON.stringify({ success: true, userId: user.id }), {
        status: 200,
      });
    } catch (error) {
      console.error('Error syncing user to database:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to sync user' }),
        { status: 500 }
      );
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    try {
      await prisma.user.delete({
        where: { clerkId: id },
      });

      console.log('User deleted from database:', id);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
      });
    } catch (error) {
      console.error('Error deleting user from database:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to delete user' }),
        { status: 500 }
      );
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
  });
}
