/**
 * Configuration options for the Upriser Widget
 */
export interface UpriserWidgetConfig {
  /** The Upriser agent ID to use */
  agentId?: string;
  /** Container element to append the widget to */
  widgetContainer?: HTMLElement | null;
  /** Enable debug logging */
  debug?: boolean;
  /** Primary text colour applied within the widget */
  fontColor?: string;
  /** Link colour applied within the widget */
  linkColor?: string;
  /** Client tool functions exposed to the ElevenLabs widget */
  clientTools?: Record<string, (parameters: any) => any>;
  /** Additional configuration options */
  [key: string]: any;
}

/**
 * Test results from the widget functionality test
 */
export interface UpriserWidgetTestResult {
  /** Whether relabeling is working */
  relabeling: boolean;
  /** Whether the widget is initialized */
  isInitialized: boolean;
}

/**
 * Main Upriser Widget class for integrating Upriser ConvAI
 */
export declare class UpriserWidget {
  /** Widget configuration */
  config: UpriserWidgetConfig;

  /** Whether the widget has been initialized */
  isInitialized: boolean;

  /** Map of event handlers */
  eventHandlers: Map<string, Function>;

  /** Mutation observer for DOM changes */
  mutationObserver: MutationObserver | null;

  /** Map of active timeouts */
  timeouts: Map<string, number>;

  /** Map of active intervals */
  intervals: Map<string, number>;

  /** Whether relabeling process is complete */
  isRelabelingComplete: boolean;

  /**
   * Create a new Upriser Widget instance
   * @param config Configuration options for the widget
   */
  constructor(config?: UpriserWidgetConfig);

  /**
   * Initialize the widget
   * @returns Promise that resolves when initialization is complete
   */
  init(): Promise<void>;

  /**
   * Load the Upriser ConvAI script
   * @returns Promise that resolves when script is loaded
   */
  loadElevenLabsScript(): Promise<void>;

  /**
   * Create the Upriser ConvAI element in the DOM
   */
  createConvAIElement(): void;

  /**
   * Create and display a generic iframe modal
   * @param options Modal configuration
   */
  openModal(options: { url: string; title?: string; onClose?: () => void }): {
    success: boolean;
    message: string;
  };

  /**
   * Combine default tools with configured client tools
   */
  getClientTools(): Record<string, (parameters: any) => any>;

  /**
   * Wire client tools into the embedded ElevenLabs element
   */
  setupClientTools(): void;

  /**
   * Replace current client tools and re-wire
   */
  setClientTools(clientTools: Record<string, (parameters: any) => any>): void;

  /**
   * Relabel and rewrite widget elements to use Upriser branding
   * @param root Root element to process
   * @returns Whether any changes were made
   */
  relabelAndRewriteLinks(root: Document | ShadowRoot | HTMLElement): boolean;

  /**
   * Attempt relabeling across all widget elements
   * @returns Whether any changes were made
   */
  attemptRelabelEverywhere(): boolean;

  /**
   * Set up shadow root observer for monitoring changes
   * @param shadowRoot Shadow root to observe
   */
  setupShadowRootObserver(shadowRoot: ShadowRoot): void;

  /**
   * Start the relabel flow with monitoring
   */
  startRelabelFlow(): void;

  /**
   * Set up mutation observer for relabel monitoring
   */
  setupMutationObserver(): void;

  /**
   * Start the auto-accept flow implementation
   */
  startAutoAcceptFlow(): void;

  /**
   * Hide widget initially when detected
   */
  hideWidgetInitially(): void;

  /**
   * Show widget after specified delay
   * @param ms Delay in milliseconds (default: 500)
   */
  showWidgetAfterDelay(ms?: number): void;

  /**
   * Hide widget temporarily with timeout management
   * @param ms Duration to hide in milliseconds (default: 500)
   */
  hideWidgetTemporarily(ms?: number): void;

  /**
   * Cancel the hide timeout
   */
  cancelHideTimeout(): void;

  /**
   * Remove "Need help?" element from the widget
   * @param root Root element to process
   * @returns Whether any elements were removed
   */
  removeNeedHelpElement(root: Document | ShadowRoot | HTMLElement): boolean;

  /**
   * Wire start call buttons to hide widget temporarily
   * @param root Root element to process
   */
  wireStartCallHide(root: Document | ShadowRoot | HTMLElement): void;

  /**
   * Reset widget to initial state
   */
  resetWidgetToInitialState(): void;

  /**
   * Clear widget wiring
   * @param root Root element to process
   */
  clearWidgetWiring(root: Document | ShadowRoot | HTMLElement): void;

  /**
   * Update widget configuration
   * @param newConfig New configuration options to merge
   */
  updateConfig(newConfig: Partial<UpriserWidgetConfig>): void;

  /**
   * Destroy the widget and clean up all resources
   */
  destroy(): void;

  /**
   * Test method to verify all functionality is working
   * @returns Test results object
   */
  test(): UpriserWidgetTestResult;

  /**
   * Log messages if debug mode is enabled
   * @param args Arguments to log
   */
  log(...args: any[]): void;
}

/**
 * Global widget configuration interface
 */
export interface GlobalUpriserConfig extends UpriserWidgetConfig {
  /** Agent ID for the widget */
  agentId: string;
  /** Debug mode flag */
  debug: boolean;
}

/**
 * Initialize the Upriser widget manually
 * @returns The initialized widget instance or null if failed
 */
export declare function initUpriserWidget(): UpriserWidget | null;

// Global declarations for browser environment
declare global {
  interface Window {
    /** Global Upriser Widget class */
    UpriserWidget: typeof UpriserWidget;
    /** Global widget configuration */
    UPRISER_WIDGET_CONFIG?: GlobalUpriserConfig;
    /** Flag to disable auto initialization */
    UPRISER_DISABLE_AUTO_INIT?: boolean;
    /** Global widget instance */
    upriserWidget?: UpriserWidget;
    /** Alternate global widget instance name used by some apps */
    upriserWidgetInstance?: UpriserWidget;
    /** Backup global map of client tool functions */
    UPRISER_CLIENT_TOOLS?: Record<string, (parameters: any) => any>;
    /** Manual initialization function */
    initUpriserWidget: typeof initUpriserWidget;
    /** Internal script loading promise */
    __UPRISER_ELEVENLABS_SCRIPT_PROMISE?: Promise<void>;
    /** Conversation state flag */
    upriserConversationStarted?: boolean;
  }
}

export default UpriserWidget;
