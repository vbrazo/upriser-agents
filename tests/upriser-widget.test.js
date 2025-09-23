const fs = require('fs');
const path = require('path');

// Load the widget code
const widgetCode = fs.readFileSync(path.join(__dirname, '../src/upriser-widget.js'), 'utf8');

// Execute the widget code in the test environment
eval(widgetCode);

describe('UpriserWidget', () => {
  let widget;

  beforeEach(() => {
    // Clear the DOM
    document.body.innerHTML = '';
    
    // Reset console mocks
    jest.clearAllMocks();
    
    // Create a new widget instance
    widget = new UpriserWidget({
      debug: true,
      agentId: 'test-agent-id'
    });
  });

  afterEach(() => {
    if (widget) {
      widget.destroy();
    }
  });

  describe('Constructor', () => {
    test('should create widget with default config', () => {
      const defaultWidget = new UpriserWidget();
      
      expect(defaultWidget.config.agentId).toBe('agent_8401k5nnvgqpezf9fd17t3tb7t69');
      expect(defaultWidget.config.debug).toBe(false);
      expect(defaultWidget.config.fontColor).toBe('#ffffff');
      expect(defaultWidget.config.linkColor).toBe('#ffffff');
      expect(defaultWidget.isInitialized).toBe(false);
    });

    test('should create widget with custom config', () => {
      expect(widget.config.agentId).toBe('test-agent-id');
      expect(widget.config.debug).toBe(true);
      expect(widget.isInitialized).toBe(false);
    });

    test('should create widget with custom colors', () => {
      const colorWidget = new UpriserWidget({
        fontColor: '#ff6b6b',
        linkColor: '#4ecdc4'
      });
      
      expect(colorWidget.config.fontColor).toBe('#ff6b6b');
      expect(colorWidget.config.linkColor).toBe('#4ecdc4');
      expect(colorWidget.config.agentId).toBe('agent_8401k5nnvgqpezf9fd17t3tb7t69'); // Default
    });

    test('should initialize internal properties', () => {
      expect(widget.eventHandlers).toBeInstanceOf(Map);
      expect(widget.timeouts).toBeInstanceOf(Map);
      expect(widget.intervals).toBeInstanceOf(Map);
      expect(widget.mutationObserver).toBeNull();
      expect(widget.isRelabelingComplete).toBe(false);
    });
  });

  describe('Configuration', () => {
    test('should update config', () => {
      widget.updateConfig({ 
        debug: false, 
        newProperty: 'test' 
      });
      
      expect(widget.config.debug).toBe(false);
      expect(widget.config.newProperty).toBe('test');
      expect(widget.config.agentId).toBe('test-agent-id'); // Should preserve existing
    });
  });

  describe('Logging', () => {
    test('should log when debug is enabled', () => {
      widget.log('test message', 'additional info');
      
      expect(console.log).toHaveBeenCalledWith(
        '[Upriser Widget]', 
        'test message', 
        'additional info'
      );
    });

    test('should not log when debug is disabled', () => {
      widget.config.debug = false;
      widget.log('test message');
      
      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe('DOM Manipulation', () => {
    test('should create ConvAI element', () => {
      widget.createConvAIElement();
      
      const convaiElement = document.querySelector('elevenlabs-convai');
      expect(convaiElement).toBeTruthy();
      expect(convaiElement.getAttribute('agent-id')).toBe('test-agent-id');
    });

    test('should create Upriser ConvAI element with colors', () => {
      widget.createUpriserConvAIElement();
      
      const upriserElement = document.querySelector('upriser-convai');
      expect(upriserElement).toBeTruthy();
      expect(upriserElement.getAttribute('agent-id')).toBe('test-agent-id');
      expect(upriserElement.getAttribute('font-color')).toBe('#ffffff');
      expect(upriserElement.getAttribute('link-color')).toBe('#ffffff');
    });

    test('should replace existing ConvAI element', () => {
      widget.createConvAIElement();
      widget.createConvAIElement(); // Create second one
      
      const convaiElements = document.querySelectorAll('elevenlabs-convai');
      expect(convaiElements.length).toBe(1);
    });

    test('should replace existing Upriser ConvAI element', () => {
      widget.createUpriserConvAIElement();
      widget.createUpriserConvAIElement(); // Create second one
      
      const upriserElements = document.querySelectorAll('upriser-convai');
      expect(upriserElements.length).toBe(1);
    });

    test('should remove need help elements', () => {
      // Create a mock "Need help?" element
      const helpDiv = document.createElement('div');
      helpDiv.textContent = 'Need help?';
      helpDiv.className = 'relative inline-flex shrink-0 justify-center items-center transition- min-w-0 z-1';
      document.body.appendChild(helpDiv);
      
      const result = widget.removeNeedHelpElement(document.body);
      
      expect(result).toBe(true);
      expect(document.querySelector('div')).toBeNull();
    });
  });

  describe('Test Method', () => {
    test('should return test results', () => {
      const results = widget.test();
      
      expect(results).toHaveProperty('relabeling');
      expect(results).toHaveProperty('isInitialized');
      expect(typeof results.relabeling).toBe('boolean');
      expect(results.isInitialized).toBe(false); // Not initialized yet
    });
  });

  describe('Cleanup', () => {
    test('should destroy widget and clear resources', () => {
      // Add some timeouts and intervals
      widget.timeouts.set('test', setTimeout(() => {}, 1000));
      widget.intervals.set('test', setInterval(() => {}, 1000));
      
      // Create ConvAI element
      widget.createConvAIElement();
      
      widget.destroy();
      
      expect(widget.timeouts.size).toBe(0);
      expect(widget.intervals.size).toBe(0);
      expect(widget.isInitialized).toBe(false);
      expect(widget.mutationObserver).toBeNull();
      expect(document.querySelector('elevenlabs-convai')).toBeNull();
    });

    test('should destroy widget with upriser element and clear resources', () => {
      // Add some timeouts and intervals
      widget.timeouts.set('test', setTimeout(() => {}, 1000));
      widget.intervals.set('test', setInterval(() => {}, 1000));
      
      // Create Upriser ConvAI element
      widget.createUpriserConvAIElement();
      
      widget.destroy();
      
      expect(widget.timeouts.size).toBe(0);
      expect(widget.intervals.size).toBe(0);
      expect(widget.isInitialized).toBe(false);
      expect(widget.mutationObserver).toBeNull();
      expect(document.querySelector('upriser-convai')).toBeNull();
    });
  });

  describe('Script Loading', () => {
    test('should return existing promise when called multiple times', () => {
      // Mock window and customElements
      global.window = global.window || {};
      global.customElements.get = jest.fn().mockReturnValue('mock-element');
      
      const promise1 = widget.loadElevenLabsScript();
      const promise2 = widget.loadElevenLabsScript();
      
      // Should return same promise instance
      expect(promise1).toBe(promise2);
    });
  });

  describe('Custom Element Definition', () => {
    test('should define upriser-convai custom element when supported', () => {
      // Mock customElements API
      global.customElements.define = jest.fn();
      global.customElements.get = jest.fn().mockReturnValue(null); // Not defined yet
      
      widget.defineUpriserConvAIElement();
      
      expect(global.customElements.define).toHaveBeenCalledWith(
        'upriser-convai',
        expect.any(Function)
      );
    });

    test('should not define custom element when already defined', () => {
      // Mock customElements API
      global.customElements.define = jest.fn();
      global.customElements.get = jest.fn().mockReturnValue(function() {}); // Already defined
      
      widget.defineUpriserConvAIElement();
      
      expect(global.customElements.define).not.toHaveBeenCalled();
    });

    test('should handle missing customElements gracefully', () => {
      const originalCustomElements = global.customElements;
      global.customElements = undefined;
      
      expect(() => {
        widget.defineUpriserConvAIElement();
      }).not.toThrow();
      
      global.customElements = originalCustomElements;
    });
  });

  describe('Color Configuration', () => {
    test('should use custom colors in relabeling', () => {
      const colorWidget = new UpriserWidget({
        fontColor: '#ff6b6b',
        linkColor: '#4ecdc4'
      });
      
      // Create a mock span element with "Powered by ElevenLabs" text
      const span = document.createElement('span');
      span.textContent = 'Powered by ElevenLabs';
      span.className = 'opacity-30';
      document.body.appendChild(span);
      
      const result = colorWidget.relabelAndRewriteLinks(document.body);
      
      expect(result).toBe(true);
      expect(span.textContent).toBe('Powered by Upriser.ai');
      expect(span.style.color).toBe('rgb(255, 107, 107)'); // Converted from hex
    });

    test('should use custom link colors', () => {
      const colorWidget = new UpriserWidget({
        fontColor: '#ffffff',
        linkColor: '#007bff'
      });
      
      // Create a mock link element
      const link = document.createElement('a');
      link.href = 'https://elevenlabs.io';
      link.textContent = 'ElevenLabs';
      document.body.appendChild(link);
      
      const result = colorWidget.relabelAndRewriteLinks(document.body);
      
      expect(result).toBe(true);
      expect(link.href).toBe('https://www.upriser.ai/');
      expect(link.style.color).toBe('rgb(0, 123, 255)'); // Converted from hex
    });
  });
});

describe('Global Integration', () => {
  test('should expose UpriserWidget globally', () => {
    expect(typeof UpriserWidget).toBe('function');
  });

  test('should have initialization function', () => {
    expect(typeof initUpriserWidget).toBe('function');
  });
});
