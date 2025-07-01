import { NextResponse } from 'next/server';

export const runtime = 'edge';

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  checks: {
    [key: string]: {
      status: 'pass' | 'fail';
      message?: string;
    };
  };
}

export async function GET() {
  const startTime = process.env.START_TIME || Date.now();
  const uptime = Date.now() - Number(startTime);

  const health: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(uptime / 1000), // seconds
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      api: {
        status: 'pass',
      },
      environment: {
        status: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'pass' : 'fail',
        message: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Environment configured' : 'Missing required environment variables',
      },
    },
  };

  // Set overall status based on checks
  const hasFailure = Object.values(health.checks).some(check => check.status === 'fail');
  if (hasFailure) {
    health.status = 'unhealthy';
  }

  return NextResponse.json(health, {
    status: health.status === 'healthy' ? 200 : 503,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}