const { supabaseAdmin } = require('../config/supabase');

/**
 * Get user subscription status
 * GET /api/subscription/status
 */
exports.getSubscriptionStatus = async (req, res) => {
    const userId = req.user.id;

    try {
        const { data: subscription, error } = await supabaseAdmin
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') {
            // PGRST116 = no rows returned
            console.error('Subscription fetch error:', error);
            return res.status(500).json({ error: 'Failed to fetch subscription' });
        }

        // If no subscription found, user is on free plan
        if (!subscription) {
            return res.json({
                is_premium: false,
                plan_type: 'free',
                status: 'inactive',
                expires_at: null,
                days_remaining: 0,
            });
        }

        // Check if subscription is expired
        const now = new Date();
        const expiresAt = new Date(subscription.expires_at);
        const isExpired = expiresAt < now;

        // Update status if expired
        if (isExpired && subscription.status === 'active') {
            await supabaseAdmin
                .from('subscriptions')
                .update({ status: 'expired', updated_at: new Date().toISOString() })
                .eq('id', subscription.id);

            subscription.status = 'expired';
        }

        const isPremium = subscription.status === 'active' && !isExpired;
        const daysRemaining = isPremium
            ? Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24))
            : 0;

        res.json({
            is_premium: isPremium,
            plan_type: subscription.plan_type,
            status: subscription.status,
            started_at: subscription.started_at,
            expires_at: subscription.expires_at,
            days_remaining: daysRemaining,
        });
    } catch (err) {
        console.error('Subscription error:', err);
        res.status(500).json({ error: err.message });
    }
};

/**
 * Get user transaction history
 * GET /api/subscription/transactions
 */
exports.getTransactionHistory = async (req, res) => {
    const userId = req.user.id;

    try {
        const { data: transactions, error } = await supabaseAdmin
            .from('transactions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) {
            console.error('Transaction fetch error:', error);
            return res.status(500).json({ error: 'Failed to fetch transactions' });
        }

        res.json({ transactions: transactions || [] });
    } catch (err) {
        console.error('Transaction history error:', err);
        res.status(500).json({ error: err.message });
    }
};
