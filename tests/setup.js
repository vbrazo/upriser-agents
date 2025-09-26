// Jest setup file for DOM environment
global.MutationObserver = class {
  constructor() {}
  observe() {}
  disconnect() {}
};

global.ResizeObserver = class {
  constructor() {}
  observe() {}
  disconnect() {}
};

// Mock console methods to avoid noise in tests unless explicitly testing them
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Setup document body
document.body.innerHTML = "";

// Mock customElements for web components
global.customElements = {
  define: jest.fn(),
  get: jest.fn(),
  whenDefined: jest.fn(() => Promise.resolve())
};
