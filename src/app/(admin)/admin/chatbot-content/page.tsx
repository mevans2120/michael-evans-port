'use client';

/**
 * Chatbot Content Admin Dashboard
 * Manage and monitor chatbot content synchronization
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Database, FileText, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface SyncStatus {
  totalDocuments: number;
  totalChunks: number;
  lastSync: string | null;
  sourcesCount: number;
  sanityDocuments: number;
  transcriptDocuments: number;
}

interface SyncResult {
  added: number;
  updated: number;
  deleted: number;
  unchanged: number;
  totalChunks: number;
  changes: Array<{
    sourceId: string;
    title: string;
    action: 'added' | 'updated' | 'deleted' | 'unchanged';
    chunkCount?: number;
  }>;
}

export default function ChatbotContentPage() {
  const [status, setStatus] = useState<SyncStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch sync status
  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/chatbot-sync');
      const data = await response.json();

      if (data.success) {
        setStatus(data.status);
      } else {
        setError(data.error || 'Failed to load status');
      }
    } catch (err) {
      setError('Failed to connect to API');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger manual sync
  const triggerSync = async () => {
    try {
      setSyncing(true);
      setError(null);

      const response = await fetch('/api/admin/chatbot-sync', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setLastSyncResult(data.result);
        // Refresh status after sync
        await fetchStatus();
      } else {
        setError(data.error || 'Sync failed');
      }
    } catch (err) {
      setError('Failed to trigger sync');
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  // Load initial status
  useEffect(() => {
    fetchStatus();
  }, []);

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';

    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Chatbot Content Management</h1>
        <p className="text-muted-foreground">
          Monitor and manage AI chatbot content synchronization from Sanity CMS
        </p>
      </div>

      {error && (
        <Card className="mb-6 border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : status?.totalDocuments || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {status?.totalChunks || 0} total chunks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Sources</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : status?.sourcesCount || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Sanity: {status?.sanityDocuments || 0} • Transcripts: {status?.transcriptDocuments || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {loading ? '...' : formatDate(status?.lastSync || null)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Auto-sync via webhooks enabled
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Manual Sync Control */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Manual Synchronization</CardTitle>
          <CardDescription>
            Manually trigger content sync from Sanity CMS. The system automatically syncs when content changes via webhooks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              onClick={triggerSync}
              disabled={syncing || loading}
              size="lg"
            >
              {syncing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sync Now
                </>
              )}
            </Button>

            <Button
              onClick={fetchStatus}
              disabled={loading || syncing}
              variant="outline"
              size="lg"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Status
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Last Sync Result */}
      {lastSyncResult && (
        <Card>
          <CardHeader>
            <CardTitle>Last Sync Result</CardTitle>
            <CardDescription>
              Summary of the most recent synchronization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Added</p>
                <p className="text-2xl font-bold text-green-600">
                  {lastSyncResult.added}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Updated</p>
                <p className="text-2xl font-bold text-blue-600">
                  {lastSyncResult.updated}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Deleted</p>
                <p className="text-2xl font-bold text-red-600">
                  {lastSyncResult.deleted}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Unchanged</p>
                <p className="text-2xl font-bold text-gray-600">
                  {lastSyncResult.unchanged}
                </p>
              </div>
            </div>

            {lastSyncResult.changes && lastSyncResult.changes.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3">Changes:</h4>
                <div className="space-y-2">
                  {lastSyncResult.changes
                    .filter(c => c.action !== 'unchanged')
                    .map((change, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm p-2 rounded bg-muted"
                      >
                        {change.action === 'added' && <span className="text-green-600">✨ Added:</span>}
                        {change.action === 'updated' && <span className="text-blue-600">🔄 Updated:</span>}
                        {change.action === 'deleted' && <span className="text-red-600">🗑️ Deleted:</span>}
                        <span className="font-medium">{change.title}</span>
                        {change.chunkCount && (
                          <span className="text-muted-foreground">
                            ({change.chunkCount} chunks)
                          </span>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {lastSyncResult.changes.filter(c => c.action !== 'unchanged').length === 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                <CheckCircle2 className="h-4 w-4" />
                <span>No changes detected - all content is up to date</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Setup Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Webhook Setup</CardTitle>
          <CardDescription>
            Configure Sanity webhook for automatic content synchronization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium mb-1">1. Webhook URL:</p>
              <code className="block p-2 bg-muted rounded">
                {typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/sanity
              </code>
            </div>

            <div>
              <p className="font-medium mb-1">2. Supported Events:</p>
              <ul className="list-disc list-inside pl-2 text-muted-foreground">
                <li>create</li>
                <li>update</li>
                <li>delete</li>
              </ul>
            </div>

            <div>
              <p className="font-medium mb-1">3. Document Types:</p>
              <ul className="list-disc list-inside pl-2 text-muted-foreground">
                <li>project</li>
                <li>profile</li>
                <li>aiProject</li>
              </ul>
            </div>

            <div>
              <p className="font-medium mb-1">4. Required Environment Variable:</p>
              <code className="block p-2 bg-muted rounded">
                SANITY_WEBHOOK_SECRET=your_secret_here
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
