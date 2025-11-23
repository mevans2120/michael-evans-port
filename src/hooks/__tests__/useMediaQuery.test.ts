import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMediaQuery, useIsDesktop } from '../useMediaQuery';

// Mock matchMedia
const createMatchMediaMock = (matches: boolean) => {
  const listeners: Array<(event: MediaQueryListEvent) => void> = [];

  return {
    matches,
    media: '',
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn((event: string, listener: (e: MediaQueryListEvent) => void) => {
      if (event === 'change') {
        listeners.push(listener);
      }
    }),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    // Helper to trigger change events
    triggerChange: (newMatches: boolean) => {
      listeners.forEach(listener => {
        listener({ matches: newMatches } as MediaQueryListEvent);
      });
    },
    listeners, // Expose for testing
  };
};

describe('useMediaQuery', () => {
  let matchMediaMock: ReturnType<typeof createMatchMediaMock>;

  beforeEach(() => {
    matchMediaMock = createMatchMediaMock(false);
    window.matchMedia = vi.fn(() => matchMediaMock as unknown as MediaQueryList);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns initial value based on media query match', () => {
    matchMediaMock.matches = true;
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    // Note: Initial state is false, then updates in useEffect
    // So we need to wait for the hook to update
    expect(result.current).toBe(true);
  });

  it('returns false when media query does not match', () => {
    matchMediaMock.matches = false;
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(false);
  });

  it('calls window.matchMedia with correct query', () => {
    const query = '(min-width: 1024px)';
    renderHook(() => useMediaQuery(query));

    expect(window.matchMedia).toHaveBeenCalledWith(query);
  });

  it('registers change event listener', () => {
    renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(matchMediaMock.addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });

  it('updates when media query match changes', () => {
    matchMediaMock.matches = false;
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(false);

    // Simulate media query change
    act(() => {
      matchMediaMock.matches = true;
      matchMediaMock.triggerChange(true);
    });

    expect(result.current).toBe(true);
  });

  it('cleans up event listener on unmount', () => {
    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    unmount();

    expect(matchMediaMock.removeEventListener).toHaveBeenCalled();
  });

  it('handles query changes', () => {
    const { result: _result, rerender } = renderHook(
      ({ query }) => useMediaQuery(query),
      {
        initialProps: { query: '(min-width: 768px)' },
      }
    );

    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 768px)');

    // Change query
    rerender({ query: '(min-width: 1024px)' });

    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 1024px)');
  });
});

describe('useIsDesktop', () => {
  let matchMediaMock: ReturnType<typeof createMatchMediaMock>;

  beforeEach(() => {
    matchMediaMock = createMatchMediaMock(false);
    window.matchMedia = vi.fn(() => matchMediaMock as unknown as MediaQueryList);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('uses min-width: 1024px breakpoint', () => {
    renderHook(() => useIsDesktop());

    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 1024px)');
  });

  it('returns true for desktop viewport', () => {
    matchMediaMock.matches = true;
    const { result } = renderHook(() => useIsDesktop());

    expect(result.current).toBe(true);
  });

  it('returns false for mobile viewport', () => {
    matchMediaMock.matches = false;
    const { result } = renderHook(() => useIsDesktop());

    expect(result.current).toBe(false);
  });

  it('updates when viewport crosses 1024px threshold', () => {
    matchMediaMock.matches = false;
    const { result } = renderHook(() => useIsDesktop());

    expect(result.current).toBe(false);

    // Simulate viewport resize to desktop
    act(() => {
      matchMediaMock.matches = true;
      matchMediaMock.triggerChange(true);
    });

    expect(result.current).toBe(true);
  });
});
