'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/lib/convex';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function MysterySettings() {
  const settings = useQuery(api.mysteryWhispers.getMysterySettings);
  const toggleOptOut = useMutation(api.mysteryWhispers.toggleMysteryOptOut);
  const { toast } = useToast();

  const handleToggle = async (checked: boolean) => {
    try {
      // The switch is for "Enable Mystery Whispers", so checked means optOut = false
      // If checked is true (Enabled), optOut should be false.
      // If checked is false (Disabled), optOut should be true.
      await toggleOptOut({ optOut: !checked });
      toast({
        title: checked ? "Mystery Whispers Enabled" : "Mystery Whispers Disabled",
        description: checked 
          ? "You can now send and receive mystery whispers." 
          : "You will no longer receive mystery whispers.",
      });
    } catch (error) {
      console.error("Failed to update mystery settings:", error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (settings === undefined) {
    return (
      <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            Mystery Whispers
          </CardTitle>
          <CardDescription>Loading settings...</CardDescription>
        </CardHeader>
        <CardContent>
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // If settings is null, it means user record might not exist or something, but we can assume default is opted-in (optOut: false)
  // or we can treat null as "not opted out" (false).
  const isEnabled = !settings?.optOut;

  return (
    <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" />
          Mystery Whispers
        </CardTitle>
        <CardDescription>
          Allow receiving anonymous whispers from random users.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="mystery-mode-settings" className="text-base">
            Enable Mystery Whispers
          </Label>
          <p className="text-sm text-muted-foreground">
            If disabled, you won&apos;t receive random whispers.
          </p>
        </div>
        <Switch
          id="mystery-mode-settings"
          checked={isEnabled}
          onCheckedChange={handleToggle}
        />
      </CardContent>
    </Card>
  );
}
