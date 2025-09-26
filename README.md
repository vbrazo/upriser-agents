# Upriser Widget

A standalone JavaScript widget for integrating Upriser ConvAI into any website. This package provides both npm module support and raw JavaScript files for maximum flexibility.

## Installation

### Option 1: NPM Package (Recommended for React, Vue, Angular, etc.)

```bash
npm install @upriser.ai/widget
```

### Option 2: CDN / Direct Script Inclusion

```html
<!-- Include directly in your HTML -->
<script src="https://unpkg.com/@upriser.ai/widget"></script>

<!-- Or download and host yourself -->
<script src="path/to/upriser-widget.js"></script>
```

## Usage

### NPM Module Usage

#### ES Modules (Modern bundlers like Webpack, Vite, etc.)

```javascript
import UpriserWidget from "@upriser.ai/widget/dist/upriser-widget.js";

// Create and initialize the widget
const widget = new UpriserWidget({
  agentId: "your-agent-id-here",
  fontColor: "#ffffff",
  linkColor: "#007bff",
});

// Initialize the widget
widget
  .init()
  .then(() => {
    console.log("Upriser widget initialized successfully!");
  })
  .catch((error) => {
    console.error("Failed to initialize widget:", error);
  });
```

#### CommonJS (Node.js style)

```javascript
import UpriserWidget from "@upriser.ai/widget/dist/upriser-widget.js";

const widget = new UpriserWidget({
  agentId: "your-agent-id-here",
  debug: false,
});

widget.init();
```

#### TypeScript Support

The package includes full TypeScript definitions:

```typescript
import UpriserWidget, { UpriserWidgetConfig } from "@upriser.ai/widget";

const config: UpriserWidgetConfig = {
  agentId: "your-agent-id-here",
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
    <script src="https://unpkg.com/@upriser.ai/widget"></script>

    <script>
      // The widget will auto-initialize with default settings
      // Or manually initialize:

      // Option 1: Use the global instance (auto-created)
      if (window.upriserWidget) {
        console.log("Widget auto-initialized");
      }

      // Option 2: Create your own instance
      const myWidget = new UpriserWidget({
        agentId: "your-custom-agent-id",
        fontColor: "#ffffff",
        linkColor: "#007bff",
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
    agentId: "your-agent-id-here",
  };

  // Disable auto-initialization if you want full control
  // window.UPRISER_DISABLE_AUTO_INIT = true;
</script>
<script src="https://unpkg.com/@upriser.ai/widget"></script>
```

#### WordPress Integration

```php
// In your WordPress theme's functions.php
function add_upriser_widget() {
    ?>
    <script>
        window.UPRISER_WIDGET_CONFIG = {
            agentId: '<?php echo get_option('upriser_agent_id', 'agent_8401k5nnvgqpezf9fd17t3tb7t69'); ?>'
        };
    </script>
    <script src="https://unpkg.com/@upriser.ai/widget"></script>
    <?php
}
add_action('wp_footer', 'add_upriser_widget');
```

## 🚀 Modal & Client Tools (NEW!)

Upriser Widget now supports advanced modal functionality and client tools for interactive experiences like demo scheduling, vehicle browsing, and custom content display!

### Built-in Modal System

The widget includes a built-in modal system that can be triggered by the AI agent or programmatically:

```javascript
const widget = new UpriserWidget({
  agentId: "your-agent-id",
  clientTools: {
    show_demo_form: (parameters) => {
      const url = parameters?.url || "https://meetings.hubspot.com/default";
      return widget.openModal({
        url,
        title: "Schedule a Demo",
        onClose: () => console.log("Demo modal closed"),
      });
    },
  },
});
```

### Client Tools System

Client tools are JavaScript functions that the AI agent can call to perform specific actions:

```javascript
// Option 1: Global client tools
window.UPRISER_CLIENT_TOOLS = {
  show_demo_form: (parameters) => {
    const url = parameters?.url || "https://meetings.hubspot.com/default";
    // Open your custom modal or use the built-in one
    return { success: true, message: "Demo form opened" };
  },

  show_vehicle_page: (parameters) => {
    if (!parameters?.url) {
      return { success: false, message: "URL required" };
    }
    // Open vehicle details modal
    return { success: true, message: "Vehicle page opened" };
  },
};

// Option 2: Widget configuration
const widget = new UpriserWidget({
  agentId: "your-agent-id",
  clientTools: {
    // Your client tools here
  },
});
```

## 🎨 Whitelabel Features

Upriser Widget supports complete whitelabeling with custom branding and colors!

### Custom HTML Element

```html
<upriser-convai
  agent-id="agent_8401k5nnvgqpezf9fd17t3tb7t69"
  font-color="#ffffff"
  link-color="#007bff"
>
</upriser-convai>

<script src="https://unpkg.com/@upriser.ai/widget"></script>
```

### Custom Element Attributes

| Attribute    | Type   | Default   | Description                            |
| ------------ | ------ | --------- | -------------------------------------- |
| `agent-id`   | string | Required  | Upriser agent ID                       |
| `font-color` | string | `#ffffff` | Color for "Powered by Upriser.ai" text |
| `link-color` | string | `#ffffff` | Color for links to Upriser.ai          |

### Dynamic Color Changes

You can change colors dynamically using JavaScript:

```javascript
// Get the widget element
const widget = document.querySelector("upriser-convai");

// Change colors
widget.setAttribute("font-color", "#ff6b6b");
widget.setAttribute("link-color", "#4ecdc4");
```

### JavaScript Class with Colors

Use the UpriserWidget class with custom colors:

```javascript
const widget = new UpriserWidget({
  agentId: "agent_8401k5nnvgqpezf9fd17t3tb7t69",
  fontColor: "#ffffff",
  linkColor: "#007bff",
});

widget.init();
```

### Color Examples

```html
<!-- Blue Theme -->
<upriser-convai
  agent-id="agent_8401k5nnvgqpezf9fd17t3tb7t69"
  font-color="#ffffff"
  link-color="#007bff"
>
</upriser-convai>

<!-- Green Theme -->
<upriser-convai
  agent-id="agent_8401k5nnvgqpezf9fd17t3tb7t69"
  font-color="#ffffff"
  link-color="#28a745"
>
</upriser-convai>

<!-- Purple Theme -->
<upriser-convai
  agent-id="agent_8401k5nnvgqpezf9fd17t3tb7t69"
  font-color="#f8f9fa"
  link-color="#6f42c1"
>
</upriser-convai>
```

### Benefits of Whitelabel Version

- ✅ **Custom Colors** - Match your brand colors exactly
- ✅ **Dynamic Updates** - Change colors on the fly
- ✅ **Better Events** - Enhanced event handling and API

## Configuration Options

| Option            | Type                     | Default                                | Description                                               |
| ----------------- | ------------------------ | -------------------------------------- | --------------------------------------------------------- |
| `agentId`         | string                   | `'agent_8401k5nnvgqpezf9fd17t3tb7t69'` | Upriser agent ID to use                                   |
| `widgetContainer` | HTMLElement \| null      | `null`                                 | Container to append widget to (defaults to document.body) |
| `debug`           | boolean                  | `false`                                | Enable debug logging                                      |
| `fontColor`       | string                   | `'#ffffff'`                            | Custom color for "Powered by Upriser.ai" text             |
| `linkColor`       | string                   | `'#ffffff'`                            | Custom color for links to Upriser.ai                      |
| `clientTools`     | Record<string, Function> | `{}`                                   | **NEW!** Custom functions that the AI agent can call      |

## API Methods

### `widget.init()`

Initializes the widget. Returns a Promise.

```javascript
await widget.init();
```

### `widget.updateConfig(newConfig)`

Updates the widget configuration.

```javascript
widget.updateConfig({ debug: true, agentId: "new-agent-id" });
```

### `widget.test()`

Tests widget functionality and returns status.

```javascript
const status = widget.test();
console.log("Widget status:", status);
```

### `widget.openModal(options)`

**NEW!** Opens a modal with the specified URL and options.

```javascript
const result = widget.openModal({
  url: "https://meetings.hubspot.com/demo",
  title: "Schedule a Demo",
  onClose: () => console.log("Modal closed"),
});
console.log(result);
// { success: true, message: "Modal opened successfully" }
```

### `widget.setClientTools(clientTools)`

**NEW!** Updates the client tools available to the AI agent.

```javascript
widget.setClientTools({
  show_demo_form: (parameters) => {
    const url = parameters?.url || "https://meetings.hubspot.com/default";
    return widget.openModal({ url, title: "Schedule Demo" });
  },
  show_vehicle_page: (parameters) => {
    if (!parameters?.url) {
      return { success: false, message: "URL required" };
    }
    return widget.openModal({
      url: parameters.url,
      title: parameters.title || "Vehicle Details",
    });
  },
});
```

### `widget.getClientTools()`

**NEW!** Returns the current client tools configuration.

```javascript
const tools = widget.getClientTools();
console.log("Available tools:", Object.keys(tools));
```

### `widget.destroy()`

Destroys the widget and cleans up all resources.

```javascript
widget.destroy();
```

## React Integration Example

```jsx
import React, { useEffect, useRef } from "react";
import UpriserWidget from "@upriser.ai/widget/dist/upriser-widget.js";

function ChatWidget({ agentId, debug = false }) {
  const widgetRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const widget = new UpriserWidget({
        agentId,
        debug,
        widgetContainer: containerRef.current,
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

## 🎯 Client Tools Use Cases

### Demo Scheduling Integration

Perfect for sales teams and lead generation websites:

```javascript
// Setup demo scheduling client tools
window.UPRISER_CLIENT_TOOLS = {
  show_demo_form: (parameters) => {
    const url = parameters?.url || "https://meetings.hubspot.com/default";

    // Use the built-in modal system
    if (window.upriserWidgetInstance) {
      return window.upriserWidgetInstance.openModal({
        url,
        title: "Schedule a Demo",
        onClose: () => {
          console.log("Demo modal closed");
          // Track analytics
        },
      });
    }

    // Fallback to custom implementation
    openCustomDemoModal(url);
    return { success: true, message: "Demo form opened" };
  },
};

// The AI agent can now call: "Let me show you our demo scheduling form"
// This will trigger the show_demo_form client tool
```

### Vehicle Browsing Integration

Ideal for automotive dealerships:

```javascript
// Setup vehicle browsing client tools
window.UPRISER_CLIENT_TOOLS = {
  show_vehicle_page: (parameters) => {
    const url = parameters?.url;
    const title = parameters?.title || "Vehicle Details";

    // Validate required parameters
    if (!url || typeof url !== "string") {
      console.warn("show_vehicle_page requires a valid URL");
      return { success: false, message: "Missing or invalid URL parameter" };
    }

    // Use the built-in modal system
    if (window.upriserWidgetInstance) {
      return window.upriserWidgetInstance.openModal({
        url,
        title,
        onClose: () => {
          console.log("Vehicle modal closed");
        },
      });
    }

    // Fallback to new tab
    window.open(url, "_blank", "noopener,noreferrer");
    return {
      success: true,
      message: "Opened vehicle page in new tab (fallback)",
    };
  },
};

// The AI agent can now call: "Let me show you this vehicle"
// This will trigger the show_vehicle_page client tool with the vehicle URL
```

### Custom Modal Content

You can also create completely custom modals:

```javascript
window.UPRISER_CLIENT_TOOLS = {
  show_product_catalog: (parameters) => {
    const category = parameters?.category || "all";
    const searchTerm = parameters?.search || "";

    // Create custom modal content
    const modalContent = document.createElement("div");
    modalContent.innerHTML = `
      <div class="product-catalog">
        <h2>Product Catalog</h2>
        <div class="search-bar">
          <input type="text" placeholder="Search products..." value="${searchTerm}">
        </div>
        <div class="category-filter">
          <select>
            <option value="all">All Categories</option>
            <option value="electronics" ${category === "electronics" ? "selected" : ""}>Electronics</option>
            <option value="clothing" ${category === "clothing" ? "selected" : ""}>Clothing</option>
          </select>
        </div>
        <div class="products-grid">
          <!-- Your products here -->
        </div>
      </div>
    `;

    // Use built-in modal with custom content
    if (window.upriserWidgetInstance) {
      const modal = window.upriserWidgetInstance.createModal({
        title: "Product Catalog",
        content: modalContent,
        className: "product-catalog-modal",
      });

      if (modal) {
        return { success: true, message: "Product catalog opened" };
      }
    }

    return { success: false, message: "Failed to open catalog" };
  },
};
```

## Vue Integration Example

```vue
<template>
  <div ref="chatContainer" class="upriser-chat-container"></div>
</template>

<script>
import UpriserWidget from "@upriser.ai/widget/dist/upriser-widget.js";

export default {
  name: "UpriserChat",
  props: {
    agentId: {
      type: String,
      default: "agent_8401k5nnvgqpezf9fd17t3tb7t69",
    },
    debug: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      widget: null,
    };
  },
  async mounted() {
    this.widget = new UpriserWidget({
      agentId: this.agentId,
      debug: this.debug,
      widgetContainer: this.$refs.chatContainer,
    });

    try {
      await this.widget.init();
    } catch (error) {
      console.error("Failed to initialize Upriser widget:", error);
    }
  },
  beforeUnmount() {
    if (this.widget) {
      this.widget.destroy();
    }
  },
};
</script>
```

## 📡 Event Handling

The widget dispatches custom events that you can listen for:

### Modal Events

```javascript
// Listen for modal opened events
window.addEventListener("upriser:modal-opened", (event) => {
  console.log("Modal opened:", event.detail);

  // Track analytics based on modal type
  if (event.detail.type === "demo") {
    // ...
  } else if (event.detail.type === "vehicle") {
    // ...
  }
});

// Listen for modal closed events
window.addEventListener("upriser:modal-closed", (event) => {
  console.log("Modal closed:", event.detail);

  // you could track analytics here
});
```

### Widget Events

```javascript
// Listen for widget initialization
window.addEventListener("upriser:initialized", (event) => {
  console.log("Widget initialized:", event.detail);

  // Widget is ready, you can now safely call client tools
  const tools = event.detail.element.getClientTools();
  console.log("Available client tools:", Object.keys(tools));
});

// Listen for widget errors
window.addEventListener("upriser:error", (event) => {
  console.error("Widget error:", event.detail.error);

  // Handle errors gracefully
  showErrorMessage(
    "Chat widget encountered an error. Please refresh the page.",
  );
});
```

### Client Tool Response Handling

```javascript
// Example of handling client tool responses
window.UPRISER_CLIENT_TOOLS = {
  show_demo_form: (parameters) => {
    try {
      const url = parameters?.url || "https://meetings.hubspot.com/default";

      // Attempt to open modal
      if (window.upriserWidgetInstance) {
        const result = window.upriserWidgetInstance.openModal({
          url,
          title: "Schedule a Demo",
        });

        if (result.success) {
          // Dispatch custom success event
          window.dispatchEvent(
            new CustomEvent("upriser:demo-opened", {
              detail: { url, timestamp: Date.now() },
            }),
          );
        }

        return result;
      }

      return { success: false, message: "Widget not available" };
    } catch (error) {
      console.error("Error in show_demo_form:", error);

      // Dispatch error event
      window.dispatchEvent(
        new CustomEvent("upriser:client-tool-error", {
          detail: { tool: "show_demo_form", error: error.message },
        }),
      );

      return { success: false, message: "Failed to open demo form" };
    }
  },
};
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
- 🪟 **Built-in modals** - **NEW!** Integrated modal system for seamless user experiences
- 🛠️ **Client tools** - **NEW!** Custom functions that AI agents can call
- 📡 **Event system** - **NEW!** Rich event handling for modal and widget interactions
- 🎯 **Use case ready** - **NEW!** Pre-built patterns for demos, vehicle browsing, and more

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
