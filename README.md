# Upriser Widget

A standalone JavaScript widget for integrating Upriser ElevenLabs ConvAI into any website. This package provides both npm module support and raw JavaScript files for maximum flexibility.

## Installation

### Option 1: NPM Package (Recommended for React, Vue, Angular, etc.)

```bash
npm install @upriser/widget
```

### Option 2: CDN / Direct Script Inclusion

```html
<!-- Include directly in your HTML -->
<script src="https://unpkg.com/@upriser/widget/upriser-widget.js"></script>

<!-- Or download and host yourself -->
<script src="path/to/upriser-widget.js"></script>
```

## Usage

### NPM Module Usage

#### ES Modules (Modern bundlers like Webpack, Vite, etc.)

```javascript
import UpriserWidget from '@upriser/widget';

// Create and initialize the widget
const widget = new UpriserWidget({
  agentId: 'your-agent-id-here', // Optional: defaults to Upriser's agent
  debug: true, // Optional: enable debug logging
  widgetContainer: document.getElementById('chat-container') // Optional: specify container
});

// Initialize the widget
widget.init().then(() => {
  console.log('Upriser widget initialized successfully!');
}).catch(error => {
  console.error('Failed to initialize widget:', error);
});
```

#### CommonJS (Node.js style)

```javascript
const UpriserWidget = require('@upriser/widget');

const widget = new UpriserWidget({
  agentId: 'your-agent-id-here',
  debug: false
});

widget.init();
```

#### TypeScript Support

The package includes full TypeScript definitions:

```typescript
import UpriserWidget, { UpriserWidgetConfig } from '@upriser/widget';

const config: UpriserWidgetConfig = {
  agentId: 'your-agent-id-here',
  debug: true,
  widgetContainer: document.getElementById('chat-container')
};

const widget = new UpriserWidget(config);
widget.init();
```

### Raw JavaScript Usage

#### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>
<body>
    <!-- Your website content -->
    
    <!-- Include the Upriser widget script -->
    <script src="https://unpkg.com/@upriser/widget/upriser-widget.js"></script>
    
    <script>
        // The widget will auto-initialize with default settings
        // Or manually initialize:
        
        // Option 1: Use the global instance (auto-created)
        if (window.upriserWidget) {
            console.log('Widget auto-initialized');
        }
        
        // Option 2: Create your own instance
        const myWidget = new UpriserWidget({
            agentId: 'your-custom-agent-id',
            debug: true
        });
        myWidget.init();
    </script>
</body>
</html>
```

#### Custom Configuration

```html
<script>
    // Configure before the script loads (for auto-initialization)
    window.UPRISER_WIDGET_CONFIG = {
        agentId: 'your-agent-id-here',
        debug: true
    };
    
    // Disable auto-initialization if you want full control
    // window.UPRISER_DISABLE_AUTO_INIT = true;
</script>
<script src="https://unpkg.com/@upriser/widget/upriser-widget.js"></script>
```

#### WordPress Integration

```php
// In your WordPress theme's functions.php
function add_upriser_widget() {
    ?>
    <script>
        window.UPRISER_WIDGET_CONFIG = {
            agentId: '<?php echo get_option('upriser_agent_id', 'agent_8401k5nnvgqpezf9fd17t3tb7t69'); ?>',
            debug: <?php echo WP_DEBUG ? 'true' : 'false'; ?>
        };
    </script>
    <script src="https://unpkg.com/@upriser/widget/upriser-widget.js"></script>
    <?php
}
add_action('wp_footer', 'add_upriser_widget');
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `agentId` | string | `'agent_8401k5nnvgqpezf9fd17t3tb7t69'` | ElevenLabs agent ID to use |
| `widgetContainer` | HTMLElement \| null | `null` | Container to append widget to (defaults to document.body) |
| `debug` | boolean | `false` | Enable debug logging |

## API Methods

### `widget.init()`
Initializes the widget. Returns a Promise.

```javascript
await widget.init();
```

### `widget.updateConfig(newConfig)`
Updates the widget configuration.

```javascript
widget.updateConfig({ debug: true, agentId: 'new-agent-id' });
```

### `widget.test()`
Tests widget functionality and returns status.

```javascript
const status = widget.test();
console.log('Widget status:', status);
```

### `widget.destroy()`
Destroys the widget and cleans up all resources.

```javascript
widget.destroy();
```

## React Integration Example

```jsx
import React, { useEffect, useRef } from 'react';
import UpriserWidget from '@upriser/widget';

function ChatWidget({ agentId, debug = false }) {
  const widgetRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const widget = new UpriserWidget({
        agentId,
        debug,
        widgetContainer: containerRef.current
      });

      widget.init().catch(console.error);
      widgetRef.current = widget;

      return () => {
        if (widgetRef.current) {
          widgetRef.current.destroy();
        }
      };
    }
  }, [agentId, debug]);

  return <div ref={containerRef} className="upriser-chat-container" />;
}

export default ChatWidget;
```

## Vue Integration Example

```vue
<template>
  <div ref="chatContainer" class="upriser-chat-container"></div>
</template>

<script>
import UpriserWidget from '@upriser/widget';

export default {
  name: 'UpriserChat',
  props: {
    agentId: {
      type: String,
      default: 'agent_8401k5nnvgqpezf9fd17t3tb7t69'
    },
    debug: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      widget: null
    };
  },
  async mounted() {
    this.widget = new UpriserWidget({
      agentId: this.agentId,
      debug: this.debug,
      widgetContainer: this.$refs.chatContainer
    });
    
    try {
      await this.widget.init();
    } catch (error) {
      console.error('Failed to initialize Upriser widget:', error);
    }
  },
  beforeUnmount() {
    if (this.widget) {
      this.widget.destroy();
    }
  }
};
</script>
```

## Browser Support

- Modern browsers (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- Supports both ES modules and UMD
- Works with or without build tools
- No external dependencies

## Features

- 🚀 **Zero dependencies** - Works standalone
- 📦 **Multiple formats** - UMD, ESM, and raw JavaScript
- 🎯 **TypeScript support** - Full type definitions included
- 🔧 **Auto-initialization** - Works out of the box
- 🎨 **Customizable** - Override default agent and styling
- 🧪 **Well tested** - Comprehensive test suite
- 📱 **Responsive** - Works on desktop and mobile

## Development

```bash
# Install dependencies
npm install

# Build all formats
npm run build

# Run tests
npm test

# Watch tests
npm test:watch
```

## File Structure

```
@upriser/widget/
├── dist/                      # Built files for npm
│   ├── upriser-widget.js      # UMD build
│   ├── upriser-widget.esm.js  # ES module build
│   └── upriser-widget.d.ts    # TypeScript definitions
├── upriser-widget.js          # Raw JavaScript file (for CDN/direct use)
├── src/                       # Source files
└── package.json
```

## License

MIT

## Support

For support, please visit [https://www.upriser.ai](https://www.upriser.ai) or create an issue in the repository.
