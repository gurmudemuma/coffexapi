/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/shared/testing/setup.ts'],
    globals: true,
    css: true,
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: [
        'text',
        'json',
        'html',
        'lcov',
        'clover',
        'cobertura'
      ],
      
      // Coverage output directory
      reportsDirectory: './coverage',
      
      // Files to include in coverage
      include: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/*.test.{ts,tsx}',
        '!src/**/*.spec.{ts,tsx}',
      ],
      
      // Files to exclude from coverage
            exclude: [
        'node_modules/**',
        'src/tests/support/**',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/main.tsx',
        'src/vite-env.d.ts',
        '**/*.d.ts',
        'src/setupTests.ts',
        'src/mocks/**',
        'src/e2e/**',
        'dist/**',
        'coverage/**',
        '.{idea,git,cache,output,temp}/**',
        '{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*'
      ],
      
      // Coverage thresholds - Quality gates
      thresholds: {
        // Global coverage thresholds
        statements: 85,
        branches: 80,
        functions: 85,
        lines: 85,
        
        // Per-file thresholds
        perFile: true,
        
        // Specific file/directory overrides
        'src/components/': {
          statements: 90,
          branches: 85,
          functions: 90,
          lines: 90
        },
        'src/store/': {
          statements: 95,
          branches: 90,
          functions: 95,
          lines: 95
        },
        'src/utils/': {
          statements: 90,
          branches: 85,
          functions: 90,
          lines: 90
        },
        'src/pages/': {
          statements: 80,
          branches: 75,
          functions: 80,
          lines: 80
        }
      },
      
      // Watermarks for coverage visualization
      watermarks: {
        statements: [80, 95],
        functions: [80, 95],
        branches: [75, 90],
        lines: [80, 95]
      },
      
      // Skip coverage for these files entirely
      skipFull: false,
      
      // Clean coverage directory before each run
      clean: true,
      cleanOnRerun: true,
      
      // Allow empty coverage files
      allowExternal: true,
      
      // Include untested files in coverage
      all: true,
    },
    
    // Test execution settings
    testTimeout: 30000,
    hookTimeout: 30000,
    teardownTimeout: 10000,
    
    // Parallel execution
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        minThreads: 1,
        maxThreads: 4,
      }
    },
    
    // Watch mode settings
    watch: {
      ignore: [
        '**/coverage/**',
        '**/dist/**',
        '**/node_modules/**',
        '**/.git/**'
      ]
    },
    
    // Reporter configuration
    reporter: [
      'verbose',
      'junit',
      'json',
      'html'
    ],
    
    // Output files for different reporters
    outputFile: {
      junit: './test-results/junit.xml',
      json: './test-results/results.json',
      html: './test-results/index.html'
    },
    
    // Mocking configuration
    unstubEnvs: true,
    unstubGlobals: true,
    
    // Include/exclude patterns
    include: [
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      '**/e2e/**'
    ],
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/store': path.resolve(__dirname, './src/store'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/types': path.resolve(__dirname, './src/types'),
    },
  },
});