# Razorpay Payment Setup Guide

## Overview
This application uses Razorpay for processing fee payments. When students make payments, the funds are automatically transferred to the bank account linked to your Razorpay merchant account.

## How Payments Work

1. **Student initiates payment** → Creates a Razorpay order
2. **Student completes payment** → Payment is processed through Razorpay
3. **Payment captured** → Funds are automatically transferred to your bank account
4. **Webhook notification** → System receives confirmation and updates payment status

## Bank Account Configuration

### Step 1: Create Razorpay Account
1. Go to [https://razorpay.com](https://razorpay.com)
2. Sign up for a merchant account
3. Complete KYC (Know Your Customer) verification
4. Add your bank account details in the Razorpay dashboard

### Step 2: Get API Keys
1. Log in to your Razorpay Dashboard
2. Go to **Settings** → **API Keys**
3. Generate **Key ID** and **Key Secret**
4. Copy these keys to your `.env` file

### Step 3: Configure Environment Variables
Add these to your `.env` file:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here  # Optional but recommended
```

### Step 4: Configure Webhook (Recommended)
Webhooks ensure payments are tracked even if the frontend callback fails.

1. In Razorpay Dashboard, go to **Settings** → **Webhooks**
2. Click **Add New Webhook**
3. Set the webhook URL: `https://yourdomain.com/api/payments/webhook`
4. Select events to subscribe:
   - `payment.captured` (required)
   - `payment.failed` (optional but recommended)
5. Copy the **Webhook Secret** and add it to `.env` as `RAZORPAY_WEBHOOK_SECRET`

## Payment Flow

### Automatic Bank Transfer
- Payments are **automatically captured** (`payment_capture: 1`)
- Funds are transferred to your bank account according to Razorpay's settlement schedule:
  - **T+1** (Next business day) for most payments
  - **T+3** (3 business days) for some payment methods

### Settlement Schedule
- Razorpay settles payments to your bank account automatically
- You can view settlements in the Razorpay Dashboard under **Settlements**
- Settlement reports are available for download

## Testing Payments

### Test Mode
1. Use Razorpay test keys (start with `rzp_test_`)
2. Use test card numbers from [Razorpay Test Cards](https://razorpay.com/docs/payments/test-cards/)
3. Payments in test mode don't transfer real money

### Live Mode
1. Switch to live keys (start with `rzp_live_`)
2. Complete KYC verification
3. Add your bank account
4. All payments will transfer real money to your bank account

## Payment Types Supported

The system supports three types of fees, all processed through the same Razorpay account:

1. **Academic Fees** - Regular semester/year fees
2. **Exam Fees** - Examination fees
3. **Backlog Fees** - Fees for backlog subjects

All payments go to the same bank account linked to your Razorpay merchant account.

## Security

- All payment signatures are verified server-side
- Webhook signatures are validated to prevent fraud
- Payment data is encrypted in transit (HTTPS)
- Never expose your `RAZORPAY_KEY_SECRET` in client-side code

## Troubleshooting

### Payments not reaching bank account
1. Check if KYC is completed in Razorpay Dashboard
2. Verify bank account is added and verified
3. Check settlement status in Razorpay Dashboard
4. Ensure you're using live keys (not test keys) for production

### Webhook not working
1. Verify webhook URL is accessible from the internet
2. Check webhook secret matches in `.env` and Razorpay Dashboard
3. View webhook logs in Razorpay Dashboard
4. Ensure server can receive POST requests on the webhook endpoint

### Payment verification failing
1. Check Razorpay API keys are correct
2. Verify signature verification logic
3. Check server logs for detailed error messages

## Support

For Razorpay-related issues:
- Razorpay Support: [https://razorpay.com/support](https://razorpay.com/support)
- Razorpay Documentation: [https://razorpay.com/docs](https://razorpay.com/docs)

## Important Notes

⚠️ **Production Checklist:**
- [ ] Complete Razorpay KYC verification
- [ ] Add and verify bank account
- [ ] Switch to live API keys
- [ ] Configure webhook URL
- [ ] Test payment flow end-to-end
- [ ] Monitor first few settlements

✅ **Once configured, all student payments will automatically transfer to your bank account!**

