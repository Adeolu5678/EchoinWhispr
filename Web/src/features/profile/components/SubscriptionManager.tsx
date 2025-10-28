'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FEATURE_FLAGS } from '@/config/featureFlags';

/**
 * SubscriptionManager component provides a placeholder UI for subscription tiers and Hedera payment integration.
 * This component is disabled by default via feature flag and serves as foundation for future subscription features.
 *
 * Foundation elements:
 * - Placeholder subscription tiers (Basic, Premium, Pro)
 * - Disabled Hedera payment buttons
 * - Current subscription status display
 */
export const SubscriptionManager: React.FC = () => {
  if (!FEATURE_FLAGS.SUBSCRIPTION_MODEL_ENHANCED_ACCESS) {
    return null;
  }

  const subscriptionTiers = [
    {
      name: 'Basic',
      price: 'Free',
      features: ['Limited messages', 'Limited matches', 'Basic support'],
      current: true,
    },
    {
      name: 'Premium',
      price: '$9.99/month',
      features: ['Unlimited messages', 'Unlimited matches', 'Priority support'],
      current: false,
    },
    {
      name: 'Pro',
      price: '$19.99/month',
      features: ['All Premium features', 'Advanced analytics', 'Custom integrations'],
      current: false,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Subscription Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Subscription Status */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Current Plan</h3>
            <Badge variant="secondary" className="text-sm">
              Basic (Free)
            </Badge>
            <p className="text-sm text-muted-foreground mt-2">
              Expires: Never (Free tier)
            </p>
          </div>

          {/* Subscription Tiers */}
          <div className="grid md:grid-cols-3 gap-4">
            {subscriptionTiers.map((tier) => (
              <Card key={tier.name} className={`relative ${tier.current ? 'border-primary' : ''}`}>
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  <div className="text-2xl font-bold">{tier.price}</div>
                  {tier.current && (
                    <Badge variant="default" className="absolute top-2 right-2">
                      Current
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={tier.current ? "outline" : "default"}
                    disabled={tier.current}
                  >
                    {tier.current ? 'Current Plan' : 'Upgrade with Hedera'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Hedera Integration Notice */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Payments are processed securely through Hedera network.
              Subscription features will be activated upon successful payment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};