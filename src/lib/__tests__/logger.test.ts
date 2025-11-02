import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from '../logger';

describe('logger', () => {
  beforeEach(() => {
    // Spy on console methods
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console methods
    vi.restoreAllMocks();
  });

  describe('logger methods', () => {
    it('logger.critical always calls console.error with CRITICAL prefix', () => {
      logger.critical('critical error');
      expect(console.error).toHaveBeenCalledWith('[CRITICAL]', 'critical error');
    });

    it('logger.critical supports multiple arguments', () => {
      logger.critical('error', { data: 'test' }, 123);
      expect(console.error).toHaveBeenCalledWith('[CRITICAL]', 'error', { data: 'test' }, 123);
    });

    it('logger methods exist and are callable', () => {
      // Test that methods exist and can be called without errors
      expect(() => logger.log('test')).not.toThrow();
      expect(() => logger.error('test')).not.toThrow();
      expect(() => logger.warn('test')).not.toThrow();
      expect(() => logger.info('test')).not.toThrow();
      expect(() => logger.critical('test')).not.toThrow();
    });

    it('logger methods handle Error objects', () => {
      const error = new Error('Test error');
      expect(() => logger.critical('Error:', error)).not.toThrow();
      expect(console.error).toHaveBeenCalledWith('[CRITICAL]', 'Error:', error);
    });

    it('logger methods handle empty calls', () => {
      expect(() => logger.critical()).not.toThrow();
      expect(console.error).toHaveBeenCalledWith('[CRITICAL]');
    });

    it('logger methods handle complex objects', () => {
      const complexObj = {
        nested: {
          data: [1, 2, 3],
          func: () => {},
        }
      };
      expect(() => logger.critical('Complex:', complexObj)).not.toThrow();
      expect(console.error).toHaveBeenCalledWith('[CRITICAL]', 'Complex:', complexObj);
    });
  });

  describe('logger structure', () => {
    it('has all expected methods', () => {
      expect(logger).toHaveProperty('log');
      expect(logger).toHaveProperty('error');
      expect(logger).toHaveProperty('warn');
      expect(logger).toHaveProperty('info');
      expect(logger).toHaveProperty('critical');
    });

    it('all methods are functions', () => {
      expect(typeof logger.log).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.critical).toBe('function');
    });
  });
});
