
import { Request, Response, NextFunction } from 'express';
import { ClerkExpressRequireAuth, clerkClient } from '@clerk/clerk-sdk-node';
import User from '../models/User.js';

// Extend the Express Request interface
declare global {
    namespace Express {
        interface Request {
            user?: any;
            auth?: {
                userId: string;
                sessionId: string;
                getToken: () => Promise<string>;
            };
        }
    }
}

// Custom Middleware to sync Mongo User with Clerk User
const syncUser = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth || !req.auth.userId) {
        return res.status(401).json({ msg: 'Unauthorized: No Clerk User' });
    }

    try {
        const clerkId = req.auth.userId;
        // 1. Try to find user by Clerk ID (Fast)
        let user = await User.findOne({ clerkId });

        // 2. If not found, fetch details from Clerk to match by Email (Slow, only once)
        if (!user) {
            try {
                const clerkUser = await clerkClient.users.getUser(clerkId);
                const email = clerkUser.emailAddresses.find(e => e.id === clerkUser.primaryEmailAddressId)?.emailAddress;

                if (email) {
                    user = await User.findOne({ email });
                    if (user) {
                        // Link existing user
                        user.clerkId = clerkId;
                        await user.save();
                    } else {
                        // Create new user
                        user = new User({ clerkId, email });
                        await user.save();
                    }
                }
            } catch (clerkErr: any) {
                console.error("Error fetching user from Clerk:", clerkErr);
                return res.status(500).json({ msg: `Error syncing user profile: ${clerkErr.message || 'Unknown Clerk Error'}` });
            }
        }

        if (user) {
            // Attached Mongo ID for existing routes that use req.user.id
            req.user = { id: user._id };
            next();
        } else {
            res.status(401).json({ msg: 'User sync failed' });
        }
    } catch (err: any) {
        console.error("Auth Middleware Error:", err);
        res.status(500).json({
            msg: `Auth Middleware Failed: ${err.message}`,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};

// Export an array of middleware: Validate Clerk Token -> Sync Mongo User
export default [ClerkExpressRequireAuth(), syncUser];
