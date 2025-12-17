const { snap } = require('../config/midtrans');
const { supabaseAdmin } = require('../config/supabase');

// Pricing configuration
const PRICING = {
    basic: { duration: 1, price: 15500, name: 'Basic (1 Bulan)' },
    standard: { duration: 3, price: 39000, name: 'Standard (3 Bulan)' },
    premium: { duration: 6, price: 62500, name: 'Premium (6 Bulan)' },
    ultimate: { duration: 12, price: 94000, name: 'Ultimate (12 Bulan)' },
};

/**
 * Create a new payment transaction
 * POST /api/payment/create
 */
exports.createTransaction = async (req, res) => {
    const { plan_type } = req.body;
    const user = req.user;

    try {
        // Validate plan type
        if (!PRICING[plan_type]) {
            return res.status(400).json({ error: 'Invalid plan type' });
        }

        const plan = PRICING[plan_type];
        const orderId = `FITMATE-${Date.now()}-${user.id.substring(0, 8)}`;

        // Create transaction parameters for Midtrans Snap
        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: plan.price,
            },
            item_details: [
                {
                    id: plan_type,
                    price: plan.price,
                    quantity: 1,
                    name: `Fitmate GO ${plan.name}`,
                },
            ],
            customer_details: {
                email: user.email,
                first_name: user.user_metadata?.full_name || user.email.split('@')[0],
            },
            callbacks: {
                finish: 'fitmate://payment/finish',
                error: 'fitmate://payment/error',
                pending: 'fitmate://payment/pending',
            },
        };

        // Create Snap transaction token
        const transaction = await snap.createTransaction(parameter);

        // Save transaction to database
        const { error: dbError } = await supabaseAdmin
            .from('transactions')
            .insert({
                user_id: user.id,
                order_id: orderId,
                plan_type: plan_type,
                duration_months: plan.duration,
                amount: plan.price,
                status: 'pending',
                snap_token: transaction.token,
                snap_redirect_url: transaction.redirect_url,
            });

        if (dbError) {
            console.error('Database error:', dbError);
            return res.status(500).json({ error: 'Failed to save transaction' });
        }

        res.json({
            success: true,
            token: transaction.token,
            redirect_url: transaction.redirect_url,
            order_id: orderId,
        });
    } catch (err) {
        console.error('Payment error:', err);
        res.status(500).json({ error: err.message });
    }
};

/**
 * Handle Midtrans webhook notification
 * POST /api/payment/notification
 */
exports.handleNotification = async (req, res) => {
    try {
        const notification = req.body;
        const orderId = notification.order_id;
        const transactionStatus = notification.transaction_status;
        const fraudStatus = notification.fraud_status;

        console.log('Payment notification:', { orderId, transactionStatus, fraudStatus });

        let status = 'pending';

        if (transactionStatus === 'capture') {
            status = fraudStatus === 'accept' ? 'success' : 'failed';
        } else if (transactionStatus === 'settlement') {
            status = 'success';
        } else if (['cancel', 'deny', 'expire'].includes(transactionStatus)) {
            status = transactionStatus === 'expire' ? 'expired' : 'failed';
        } else if (transactionStatus === 'pending') {
            status = 'pending';
        }

        // Update transaction status
        const { data: transaction, error: txError } = await supabaseAdmin
            .from('transactions')
            .update({
                status: status,
                payment_type: notification.payment_type,
                midtrans_response: notification,
                updated_at: new Date().toISOString(),
            })
            .eq('order_id', orderId)
            .select()
            .single();

        if (txError) {
            console.error('Failed to update transaction:', txError);
            return res.status(500).json({ error: 'Failed to update transaction' });
        }

        // If payment successful, update subscription
        if (status === 'success' && transaction) {
            const startDate = new Date();
            const expiresAt = new Date();
            expiresAt.setMonth(expiresAt.getMonth() + transaction.duration_months);

            // Upsert subscription
            const { error: subError } = await supabaseAdmin
                .from('subscriptions')
                .upsert({
                    user_id: transaction.user_id,
                    plan_type: transaction.plan_type,
                    duration_months: transaction.duration_months,
                    status: 'active',
                    started_at: startDate.toISOString(),
                    expires_at: expiresAt.toISOString(),
                    updated_at: new Date().toISOString(),
                }, {
                    onConflict: 'user_id',
                });

            if (subError) {
                console.error('Failed to update subscription:', subError);
            }
        }

        res.status(200).json({ status: 'OK' });
    } catch (err) {
        console.error('Notification error:', err);
        res.status(500).json({ error: err.message });
    }
};

/**
 * Get pricing information
 * GET /api/payment/pricing
 */
exports.getPricing = async (req, res) => {
    const plans = Object.entries(PRICING).map(([key, value]) => ({
        id: key,
        name: value.name,
        duration_months: value.duration,
        price: value.price,
        price_formatted: `Rp ${value.price.toLocaleString('id-ID')}`,
    }));

    res.json({ plans });
};
