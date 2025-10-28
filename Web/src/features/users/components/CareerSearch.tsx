import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * Placeholder CareerSearch component for career-focused user search and whispers.
 *
 * This component provides disabled UI placeholders for:
 * - Career-based search filters
 * - Search results display
 * - Whisper sending functionality
 *
 * The feature is controlled by the CAREER_FOCUSED_SEARCH_WHISPERS feature flag.
 * When enabled, this component will integrate with Hedera verifiable searches.
 */
export const CareerSearch: React.FC = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Career Search
          <Badge variant="secondary">Coming Soon</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Filters Placeholder */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Career Field</label>
          <Input
            placeholder="e.g., Software Engineering, Marketing, Finance"
            disabled
            className="opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Skills</label>
          <Input
            placeholder="e.g., React, Python, Project Management"
            disabled
            className="opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Experience Level</label>
          <Input
            placeholder="e.g., Junior, Senior, Executive"
            disabled
            className="opacity-50"
          />
        </div>

        <Button disabled className="w-full opacity-50">
          Search Professionals
        </Button>

        {/* Results Placeholder */}
        <div className="mt-6 space-y-2">
          <h3 className="text-lg font-semibold">Search Results</h3>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="opacity-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Professional {i}</p>
                      <p className="text-sm text-muted-foreground">
                        Career field • Skills • Experience
                      </p>
                    </div>
                    <Button size="sm" disabled>
                      Send Whisper
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};