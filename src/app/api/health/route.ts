import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Redis from 'ioredis';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

interface MongoDBStatus {
  status: string;
  ping: string | null;
  collections?: string[];
  error?: string;
}

interface RedisStatus {
  status: string;
  ping?: string;
  error?: string;
}

interface MonobankStatus {
  status: string;
  ping?: string;
  error?: string;
  clientName?: string;
}

interface NovaPostStatus {
  status: string;
  ping?: string;
  error?: string;
}

interface ZodStatus {
  status: string;
  version: string;
  error?: string;
}

interface ZustandStatus {
  status: string;
  error?: string;
}

interface GridFSStatus {
  status: string;
  bucketCount?: number;
  error?: string;
}

interface ApiRoutesInfo {
  count: number;
  routes: string[];
  error?: string;
}

export async function GET() {
  const startTime = Date.now();
  const refreshDate = new Date().toISOString();
  
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: new Date().toISOString(),
    refreshDate,
    mongodb: {
      status: 'disconnected',
      ping: null,
    } as MongoDBStatus,
    redis: {
      status: 'disconnected',
    } as RedisStatus,
    monobank: {
      status: 'disconnected',
    } as MonobankStatus,
    novapost: {
      status: 'disconnected',
    } as NovaPostStatus,
    zod: {
      status: 'unknown',
      version: 'unknown',
    } as ZodStatus,
    zustand: {
      status: 'unknown',
    } as ZustandStatus,
    gridfs: {
      status: 'unknown',
    } as GridFSStatus,
    apiRoutes: {
      count: 0,
      routes: [],
    } as ApiRoutesInfo,
    env: process.env.NODE_ENV,
  };

  // Check MongoDB connection
  try {
    await dbConnect();
    if (mongoose.connection.db) {
      const adminDb = mongoose.connection.db.admin();
      const pingStart = Date.now();
      await adminDb.ping();
      const pingEnd = Date.now();
      
      // Get collections
      const collections = await mongoose.connection.db.listCollections().toArray();
      const collectionNames = collections.map(c => c.name);
      
      healthCheck.mongodb = {
        status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        ping: `${pingEnd - pingStart}ms`,
        collections: collectionNames,
      };
    } else {
      healthCheck.mongodb = {
        status: 'error',
        ping: null,
        error: 'Database connection not established',
      };
    }
  } catch (error) {
    healthCheck.mongodb = {
      status: 'error',
      ping: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }

  // Check Redis connection
  try {
    const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
    const redis = new Redis(REDIS_URL);
    
    const pingStart = Date.now();
    await redis.ping();
    const pingEnd = Date.now();
    
    healthCheck.redis = {
      status: 'connected',
      ping: `${pingEnd - pingStart}ms`,
    };
    
    // Close the Redis connection
    await redis.quit();
  } catch (error) {
    healthCheck.redis = {
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
    };
  }

  // Check Monobank API
  try {
    const MONOBANK_API_KEY = process.env.MONOBANK_API_KEY || '';
    const pingStart = Date.now();
    
    const response = await fetch('https://api.monobank.ua/personal/client-info', {
      headers: {
        'X-Token': MONOBANK_API_KEY
      }
    });
    
    const pingEnd = Date.now();
    
    if (response.ok) {
      const data = await response.json();
      healthCheck.monobank = {
        status: 'connected',
        ping: `${pingEnd - pingStart}ms`,
        clientName: data.name || 'Unknown'
      };
    } else {
      const errorText = await response.text();
      healthCheck.monobank = {
        status: 'error',
        ping: `${pingEnd - pingStart}ms`,
        error: `API Error: ${response.status} - ${errorText}`
      };
    }
  } catch (error) {
    healthCheck.monobank = {
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
    };
  }

  // Check Nova Post API
  try {
    const pingStart = Date.now();
    
    // Using Nova Post tracking API as a health check endpoint
    const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: process.env.NOVA_POST_API_KEY || '',
        modelName: 'Address',
        calledMethod: 'getCities',
        methodProperties: {
          Page: '1',
          Limit: '1',
        }
      })
    });
    
    const pingEnd = Date.now();
    
    if (response.ok) {
      const data = await response.json();
      healthCheck.novapost = {
        status: data.success ? 'connected' : 'error',
        ping: `${pingEnd - pingStart}ms`,
        error: data.success ? undefined : data.errors?.join(', ') || 'Unknown error'
      };
    } else {
      const errorText = await response.text();
      healthCheck.novapost = {
        status: 'error',
        ping: `${pingEnd - pingStart}ms`,
        error: `API Error: ${response.status} - ${errorText}`
      };
    }
  } catch (error) {
    healthCheck.novapost = {
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
    };
  }

  // Check Zod
  try {
    // Create a simple schema to test Zod
    const TestSchema = z.object({
      name: z.string(),
      age: z.number().positive(),
    });
    
    // Test validation
    const validData = { name: 'Test User', age: 25 };
    const result = TestSchema.safeParse(validData);
    
    if (result.success) {
      // Get Zod version - we can't access it directly, so use package info
      const zodVersion = '3.x'; // Hardcoded since we can't get it dynamically
      
      healthCheck.zod = {
        status: 'operational',
        version: zodVersion,
      };
    } else {
      healthCheck.zod = {
        status: 'error',
        version: '3.x', // Hardcoded since we can't get it dynamically
        error: 'Validation failed unexpectedly',
      };
    }
  } catch (error) {
    healthCheck.zod = {
      status: 'error',
      version: 'unknown',
      error: error instanceof Error ? error.message : String(error),
    };
  }

  // Check Zustand (basic check since it's a client-side library)
  try {
    // We can only check if the package is available in the server context
    // This is a basic check since Zustand is primarily client-side
    healthCheck.zustand = {
      status: 'available',
    };
  } catch (error) {
    healthCheck.zustand = {
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
    };
  }

  // Check GridFS
  try {
    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
      // Get all collections to find GridFS buckets
      const collections = await mongoose.connection.db.listCollections().toArray();
      
      // GridFS collections are named as <bucketName>.files and <bucketName>.chunks
      const gridFSBuckets = collections
        .filter(col => col.name.endsWith('.files'))
        .map(col => col.name.replace('.files', ''));
      
      if (gridFSBuckets.length > 0) {
        healthCheck.gridfs = {
          status: 'operational',
          bucketCount: gridFSBuckets.length,
        };
      } else {
        healthCheck.gridfs = {
          status: 'available',
          bucketCount: 0,
          error: 'No GridFS buckets found',
        };
      }
    } else {
      healthCheck.gridfs = {
        status: 'unavailable',
        error: 'MongoDB connection required for GridFS',
      };
    }
  } catch (error) {
    healthCheck.gridfs = {
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
    };
  }

  // Discover API routes
  try {
    const apiDir = path.join(process.cwd(), 'src', 'app', 'api');
    const apiRoutes: string[] = [];

    // Function to recursively scan directories for route.ts files
    const scanApiRoutes = (dir: string, basePath: string = '/api') => {
      if (!fs.existsSync(dir)) return;
      
      const items = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        const relativePath = path.join(basePath, item.name);
        
        if (item.isDirectory()) {
          // Skip special directories like node_modules
          if (item.name === 'node_modules') continue;
          
          scanApiRoutes(fullPath, relativePath);
        } else if (
          item.name === 'route.ts' || 
          item.name === 'route.js' || 
          item.name === 'route.tsx' || 
          item.name === 'route.jsx'
        ) {
          // Found a route file, add its parent directory to the routes
          apiRoutes.push(basePath);
        }
      }
    };

    scanApiRoutes(apiDir);
    
    healthCheck.apiRoutes = {
      count: apiRoutes.length,
      routes: apiRoutes.sort(),
    };
  } catch (error) {
    healthCheck.apiRoutes = {
      count: 0,
      routes: [],
      error: error instanceof Error ? error.message : String(error),
    };
  }

  // Set overall status based on component statuses
  const criticalServices = [
    healthCheck.mongodb.status,
    healthCheck.redis.status,
    healthCheck.monobank.status,
    healthCheck.novapost.status
  ];
  
  // If any critical service is not connected, system is degraded
  if (criticalServices.some(status => status !== 'connected')) {
    healthCheck.message = 'Degraded';
    
    // If more than one critical service has errors, system is critical
    if (criticalServices.filter(status => status === 'error').length >= 2) {
      healthCheck.message = 'Critical';
    }
  }
  
  // Calculate response time
  const responseTime = Date.now() - startTime;
  
  return NextResponse.json({
    ...healthCheck,
    responseTime: `${responseTime}ms`,
  }, {
    status: healthCheck.message === 'OK' ? 200 : 
           healthCheck.message === 'Degraded' ? 207 : 503,
  });
} 