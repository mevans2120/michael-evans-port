'use client';

/**
 * Admin Dashboard for Chat Logs
 * View and analyze all chatbot conversations
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Download, MessageSquare, Clock, TrendingUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface ChatLog {
  id: string;
  session_id: string;
  messages: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
  metadata: {
    ip_hash?: string;
    user_agent?: string;
    start_time: string;
    end_time?: string;
    duration_seconds?: number;
  };
  metrics: {
    total_messages: number;
    user_messages_count: number;
    assistant_messages_count: number;
    off_topic_redirects_count?: number;
  };
  created_at: string;
}

export default function ChatLogsPage() {
  const [logs, setLogs] = useState<ChatLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<ChatLog | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/chat-logs');
      if (!response.ok) throw new Error('Failed to fetch logs');
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const csv = [
      ['Session ID', 'Created At', 'Duration (s)', 'Total Messages', 'User Messages', 'Assistant Messages', 'Off-Topic Redirects', 'User Agent'].join(','),
      ...logs.map(log => [
        log.session_id,
        new Date(log.created_at).toLocaleString(),
        log.metadata.duration_seconds || 'N/A',
        log.metrics.total_messages,
        log.metrics.user_messages_count,
        log.metrics.assistant_messages_count,
        log.metrics.off_topic_redirects_count || 0,
        log.metadata.user_agent || 'Unknown',
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const calculateStats = () => {
    if (logs.length === 0) return { totalConversations: 0, totalMessages: 0, avgDuration: 0, avgMessages: 0 };

    const totalMessages = logs.reduce((sum, log) => sum + log.metrics.total_messages, 0);
    const totalDuration = logs.reduce((sum, log) => sum + (log.metadata.duration_seconds || 0), 0);
    const conversationsWithDuration = logs.filter(log => log.metadata.duration_seconds).length;

    return {
      totalConversations: logs.length,
      totalMessages,
      avgDuration: conversationsWithDuration > 0 ? Math.round(totalDuration / conversationsWithDuration) : 0,
      avgMessages: Math.round(totalMessages / logs.length),
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading chat logs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={fetchLogs} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Chat Logs</h1>
            <p className="text-muted-foreground">Monitor and analyze chatbot conversations</p>
          </div>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Conversations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{stats.totalConversations}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{stats.totalMessages}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{stats.avgDuration}s</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Messages/Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{stats.avgMessages}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Logs List and Detail View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Logs List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {logs.map((log) => (
                    <button
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors hover:bg-accent ${
                        selectedLog?.id === log.id ? 'bg-accent border-primary' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-sm font-mono text-muted-foreground">
                          {log.session_id.slice(0, 8)}...
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {log.metrics.total_messages} msgs
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                      {log.metrics.off_topic_redirects_count! > 0 && (
                        <Badge variant="destructive" className="mt-1 text-xs">
                          {log.metrics.off_topic_redirects_count} redirects
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Conversation Detail */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedLog ? 'Conversation Detail' : 'Select a conversation'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedLog ? (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {/* Metadata */}
                    <div className="pb-4 border-b space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Session ID: </span>
                        <span className="font-mono text-muted-foreground">{selectedLog.session_id}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Duration: </span>
                        <span className="text-muted-foreground">
                          {selectedLog.metadata.duration_seconds
                            ? `${selectedLog.metadata.duration_seconds}s`
                            : 'In progress'}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">User Agent: </span>
                        <span className="text-muted-foreground text-xs">
                          {selectedLog.metadata.user_agent || 'Unknown'}
                        </span>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="space-y-3">
                      {selectedLog.messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg ${
                            msg.role === 'user'
                              ? 'bg-primary/10 ml-4'
                              : 'bg-muted mr-4'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={msg.role === 'user' ? 'default' : 'secondary'} className="text-xs">
                              {msg.role}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              ) : (
                <div className="h-[600px] flex items-center justify-center text-muted-foreground">
                  <p className="text-sm">Select a conversation to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
