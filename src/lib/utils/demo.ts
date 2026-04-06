/**
 * Helper to detect if the current session is in demo mode.
 * This checks the URL search parameters for `mode=demo`.
 */
export const isDemoMode = (searchParams?: URLSearchParams) => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') === 'demo';
  }
  return searchParams?.get('mode') === 'demo';
};

/**
 * Helper to append the demo flag to any URL if we are currently in demo mode.
 */
export const getDemoUrl = (href: string, demoMode: boolean) => {
  if (!demoMode) return href;
  const url = new URL(href, 'http://localhost'); // Base doesn't matter for relative paths
  url.searchParams.set('mode', 'demo');
  return url.pathname + url.search;
};

/**
 * Mock data for the dashboard to show when in demo mode.
 */
export const MOCK_DASHBOARD_DATA = {
  success: true,
  data: [
    {
      id: 'demo-1',
      title: 'Global Infrastructure Expansion',
      category: 'DEVOPS',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      createdAt: new Date().toISOString(),
      _count: { messages: 12 }
    },
    {
      id: 'demo-2',
      title: 'Security Audit & Penetration Test',
      category: 'SECURITY',
      priority: 'CRITICAL',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      _count: { messages: 5 }
    },
    {
      id: 'demo-3',
      title: 'Frontend Rebranding (Tailwind Transition)',
      category: 'DESIGN',
      priority: 'MEDIUM',
      status: 'COMPLETED',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      _count: { messages: 28 }
    },
    {
      id: 'demo-4',
      title: 'Database Sharding Strategy',
      category: 'DATABASE',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      _count: { messages: 8 }
    }
  ]
};
