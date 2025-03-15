"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RefreshCw, Copy, Check } from "lucide-react";

interface HealthStatus {
  uptime: number;
  message: string;
  timestamp: string;
  refreshDate: string;
  mongodb: {
    status: string;
    ping: string | null;
    collections?: string[];
    error?: string;
  };
  redis: {
    status: string;
    ping?: string;
    error?: string;
  };
  monobank: {
    status: string;
    ping?: string;
    error?: string;
    clientName?: string;
  };
  novapost: {
    status: string;
    ping?: string;
    error?: string;
  };
  zod: {
    status: string;
    version: string;
    error?: string;
  };
  zustand: {
    status: string;
    error?: string;
  };
  gridfs: {
    status: string;
    bucketCount?: number;
    error?: string;
  };
  apiRoutes: {
    count: number;
    routes: string[];
    error?: string;
  };
  env: string;
  responseTime: string;
}

export default function HealthPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const fetchHealthStatus = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/health");
      const data = await response.json();
      setHealth(data);
      setLastRefreshed(new Date());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch health status"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthStatus();

    // Refresh every 30 seconds
    const interval = setInterval(fetchHealthStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  // Clear copied text notification after 2 seconds
  useEffect(() => {
    if (copiedText) {
      const timeout = setTimeout(() => {
        setCopiedText(null);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [copiedText]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
      case "OK":
      case "operational":
      case "available":
        return "bg-green-500";
      case "disconnected":
      case "unavailable":
        return "bg-red-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  const getStatusExplanation = (status: string) => {
    switch (status) {
      case "connected":
      case "OK":
      case "operational":
      case "available":
        return "Service is functioning normally";
      case "disconnected":
        return "Service is not connected. Check connection settings and ensure the service is running.";
      case "unavailable":
        return "Service is currently unavailable. This may be temporary or require intervention.";
      case "error":
        return "An error occurred with this service. Check the error details for more information.";
      default:
        return "Service status is unknown or in a transitional state.";
    }
  };

  const copyToClipboard = (text: string, label: string = "text") => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopiedText(label);
      },
      (err) => {
        console.error("Could not copy text: ", err);
        setCopiedText("Failed to copy");
      }
    );
  };

  const StatusBadgeWithTooltip = ({ status }: { status: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={getStatusColor(status)}>{status}</Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{getStatusExplanation(status)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const ErrorDisplay = ({
    errorText,
    id,
  }: {
    errorText: string;
    id: string;
  }) => (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      <div className="flex justify-between items-start">
        <p className="text-sm">{errorText}</p>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs flex items-center gap-1"
          onClick={() => copyToClipboard(errorText, id)}
        >
          {copiedText === id ? (
            <>
              <Check className="h-3 w-3" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">System Health</h1>
        <Button
          onClick={fetchHealthStatus}
          disabled={loading}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Refreshing..." : "Refresh"}</span>
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {lastRefreshed && (
        <div className="text-sm text-muted-foreground mb-6">
          Last refreshed: {lastRefreshed.toLocaleTimeString()}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>
              General system information and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Status</span>
                {health && <StatusBadgeWithTooltip status={health.message} />}
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Environment</span>
                <span>{health?.env || "Unknown"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Uptime</span>
                <span>
                  {health
                    ? `${Math.floor(health.uptime / 60)} minutes`
                    : "Unknown"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Response Time</span>
                <span>{health?.responseTime || "Unknown"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Refresh Date</span>
                <span>
                  {health?.refreshDate
                    ? new Date(health.refreshDate).toLocaleString()
                    : "Unknown"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MongoDB */}
        <Card>
          <CardHeader>
            <CardTitle>MongoDB</CardTitle>
            <CardDescription>MongoDB connection status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Status</span>
                {health && (
                  <StatusBadgeWithTooltip status={health.mongodb.status} />
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Ping</span>
                <span>{health?.mongodb.ping || "N/A"}</span>
              </div>

              {health?.mongodb.collections &&
                health.mongodb.collections.length > 0 && (
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="collections">
                      <AccordionTrigger className="text-sm font-medium">
                        Collections ({health.mongodb.collections.length})
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="bg-muted p-2 rounded-md max-h-[150px] overflow-y-auto">
                          <ul className="text-xs space-y-1">
                            {health.mongodb.collections.map(
                              (collection, index) => (
                                <li
                                  key={index}
                                  className="py-1 px-2 hover:bg-accent rounded"
                                >
                                  {collection}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}

              {health?.mongodb.error && (
                <ErrorDisplay
                  errorText={health.mongodb.error}
                  id="mongodb-error"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Redis */}
        <Card>
          <CardHeader>
            <CardTitle>Redis</CardTitle>
            <CardDescription>Redis connection status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Status</span>
                {health && (
                  <StatusBadgeWithTooltip status={health.redis.status} />
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Ping</span>
                <span>{health?.redis.ping || "N/A"}</span>
              </div>
              {health?.redis.error && (
                <ErrorDisplay errorText={health.redis.error} id="redis-error" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Monobank API */}
        <Card>
          <CardHeader>
            <CardTitle>Monobank API</CardTitle>
            <CardDescription>Monobank API connection status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Status</span>
                {health && (
                  <StatusBadgeWithTooltip status={health.monobank.status} />
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Ping</span>
                <span>{health?.monobank.ping || "N/A"}</span>
              </div>
              {health?.monobank.clientName && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Client Name</span>
                  <span>{health.monobank.clientName}</span>
                </div>
              )}
              {health?.monobank.error && (
                <ErrorDisplay
                  errorText={health.monobank.error}
                  id="monobank-error"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Nova Post API */}
        <Card>
          <CardHeader>
            <CardTitle>Nova Post API</CardTitle>
            <CardDescription>Nova Post API connection status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Status</span>
                {health && (
                  <StatusBadgeWithTooltip status={health.novapost.status} />
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Ping</span>
                <span>{health?.novapost.ping || "N/A"}</span>
              </div>
              {health?.novapost.error && (
                <ErrorDisplay
                  errorText={health.novapost.error}
                  id="novapost-error"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* API Routes */}
        <Card>
          <CardHeader>
            <CardTitle>API Routes</CardTitle>
            <CardDescription>Available API endpoints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Routes</span>
                <span>{health?.apiRoutes?.count || 0}</span>
              </div>

              {health?.apiRoutes?.routes &&
                health.apiRoutes.routes.length > 0 && (
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="routes">
                      <AccordionTrigger className="text-sm font-medium">
                        View All Routes
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="bg-muted p-2 rounded-md max-h-[150px] overflow-y-auto">
                          <ul className="text-xs space-y-1">
                            {health.apiRoutes.routes.map((route, index) => (
                              <li
                                key={index}
                                className="py-1 px-2 hover:bg-accent rounded font-mono"
                              >
                                {route}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}

              {health?.apiRoutes?.error && (
                <ErrorDisplay
                  errorText={health.apiRoutes.error}
                  id="api-routes-error"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Zod */}
        <Card>
          <CardHeader>
            <CardTitle>Zod</CardTitle>
            <CardDescription>Zod validation library status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Status</span>
                {health && (
                  <StatusBadgeWithTooltip status={health.zod.status} />
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Version</span>
                <span>{health?.zod.version || "N/A"}</span>
              </div>
              {health?.zod.error && (
                <ErrorDisplay errorText={health.zod.error} id="zod-error" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Zustand */}
        <Card>
          <CardHeader>
            <CardTitle>Zustand</CardTitle>
            <CardDescription>Zustand state management status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Status</span>
                {health && (
                  <StatusBadgeWithTooltip status={health.zustand.status} />
                )}
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-700">
                  Zustand is primarily a client-side library. This check only
                  verifies its availability.
                </p>
              </div>
              {health?.zustand.error && (
                <ErrorDisplay
                  errorText={health.zustand.error}
                  id="zustand-error"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* GridFS */}
        <Card>
          <CardHeader>
            <CardTitle>GridFS</CardTitle>
            <CardDescription>
              MongoDB GridFS file storage status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Status</span>
                {health && (
                  <StatusBadgeWithTooltip status={health.gridfs.status} />
                )}
              </div>
              {health?.gridfs.bucketCount !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Buckets</span>
                  <span>{health.gridfs.bucketCount}</span>
                </div>
              )}
              {health?.gridfs.error && (
                <ErrorDisplay
                  errorText={health.gridfs.error}
                  id="gridfs-error"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Raw Data */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Raw Health Data</CardTitle>
            <CardDescription>
              Raw JSON response from health endpoint
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  health &&
                  copyToClipboard(JSON.stringify(health, null, 2), "raw-data")
                }
                disabled={!health}
                className="flex items-center gap-1"
              >
                {copiedText === "raw-data" ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy All</span>
                  </>
                )}
              </Button>
            </div>
            <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[200px] text-xs">
              {health ? JSON.stringify(health, null, 2) : "Loading..."}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
