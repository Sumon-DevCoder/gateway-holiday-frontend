import { IPolicyPage } from "@/types/policy";

export const policyMockData: IPolicyPage[] = [
    {
        _id: "1",
        slug: "terms",
        content: `
## 1. Introduction
Welcome to **Gateway Holidays Ltd**! These terms and conditions outline the rules and regulations for the use of our services.

By using our services, you agree to the terms outlined in this document.

## 2. Booking Policy
Our booking process is designed to ensure the best experience for our customers:

- All bookings must be confirmed with advance payment
- Cancellation charges apply as per our policy
- Booking confirmation is subject to availability
- Group bookings require special arrangements

## 3. Payment Terms
We accept various payment methods to make your booking convenient:

- **50% advance payment** required for booking confirmation
- Full payment must be completed **7 days before travel**
- Payment can be made via bank transfer, card, or mobile banking
- All payments are processed securely through our verified payment partners

## 4. Cancellation Policy
Our cancellation policy is structured as follows:

- **Cancellation before 30 days**: 25% service charge
- **Cancellation 15-30 days**: 50% cancellation charge
- **Cancellation within 15 days**: 75% cancellation charge
- **No refund** for same-day cancellation

## 5. Travel Insurance
We strongly recommend purchasing comprehensive travel insurance to cover unforeseen circumstances including:

- Medical emergencies
- Trip cancellations
- Lost or delayed baggage
- Flight delays and cancellations

## 6. Liability
**Gateway Holidays Ltd** acts as an agent for airlines, hotels, and other service providers. We are not liable for their acts, omissions, or any incidents during travel.
        `,
        createdAt: "2024-01-15T10:30:00.000Z",
        updatedAt: "2024-01-15T10:30:00.000Z"
    },
    {
        _id: "2",
        slug: "privacy",
        content: `
## 1. Introduction
Welcome to **Gateway Holidays Ltd**! Your privacy is our top priority. This document explains how we collect, use, and protect your information while ensuring transparency and trust.

By using our services, you agree to the terms outlined in this Privacy Policy.

## 2. Information We Collect
We collect information you provide directly to us, such as when you:

- **Account Information**: Name, email address, phone number, profile details
- **Booking Information**: Travel preferences, passenger details, payment information
- **Communication Data**: Messages, support requests, feedback
- **Automatically Collected Data**: Device information, IP address, usage data

## 3. How We Use Your Information
Your data is used to provide and improve our services:

- Process your bookings and transactions
- Provide customer support and assistance
- Send important updates about your travel
- Personalize your experience with us
- Ensure security and prevent fraud

## 4. Data Sharing and Third-Party Access
We do not sell your personal data. However, we may share it with:

- **Service Providers**: Airlines, hotels, payment processors for booking completion
- **Legal Authorities**: As required by law or to protect our rights
- **Business Partners**: With your consent for promotional offers

## 5. Data Security
We implement appropriate security measures to protect your personal information:

- Encrypted data transmission
- Secure payment processing
- Regular security audits
- Limited access controls

## 6. Your Rights
You have the right to:

- Access your personal data
- Correct inaccurate information
- Request data deletion
- Opt-out of marketing communications
        `,
        createdAt: "2024-01-10T14:20:00.000Z",
        updatedAt: "2024-01-10T14:20:00.000Z"
    },
    {
        _id: "3",
        slug: "refund",
        content: `
## 1. Refund Eligibility
Refunds are processed according to the following conditions and our commitment to customer satisfaction.

Please review your booking type and our refund terms before requesting a refund.

## 2. Flight Bookings
Flight refund policies vary based on ticket type:

- **Refundable Tickets**: Subject to airline terms and conditions
- **Non-refundable Tickets**: Service charges and airline penalties apply
- **Flight Cancellations by Airline**: Full refund processed within 7-14 working days
- **Schedule Changes**: Options for free rebooking or full refund

## 3. Hotel Bookings
Hotel refund policies depend on booking terms:

- **Free Cancellation Period**: Full refund with no charges
- **Within Cancellation Period**: Charges as per hotel policy
- **No-Show**: No refund applicable

## 4. Tour Packages
Our tour package refund structure:

- **Cancellation 30+ days before**: 10% service charge
- **Cancellation 15-30 days**: 25% cancellation charge
- **Cancellation 7-15 days**: 50% cancellation charge
- **Cancellation within 7 days**: 75% cancellation charge

## 5. Refund Process
To request a refund, follow these steps:

1. **Submit Request**: Through our website or email with booking reference
2. **Provide Documentation**: Booking details and reason for refund
3. **Review Process**: Our team reviews within 3-5 working days
4. **Processing**: Approved refunds processed within 7-14 working days

## 6. Processing Time and Methods
Refund processing times vary by method:

- **Bank Transfers**: 7-14 working days
- **Credit Card Refunds**: 5-10 working days
- **Mobile Banking**: 3-7 working days
        `,
        createdAt: "2024-01-05T09:15:00.000Z",
        updatedAt: "2024-01-05T09:15:00.000Z"
    }
];

export const getPolicyBySlug = (slug: string): IPolicyPage | null => {
    return policyMockData.find(policy => policy.slug === slug) || null;
};
