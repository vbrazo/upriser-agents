/**
 * Upriser Chat Widget
 * A standalone JavaScript module for integrating the Upriser ElevenLabs ConvAI widget
 * for integrating the Upriser ElevenLabs ConvAI widget into any website.
 * 
 * @version 1.0.0
 * @author Upriser
 */

class UpriserWidget {
  constructor(config = {}) {
      this.config = {
          agentId: 'agent_8401k5nnvgqpezf9fd17t3tb7t69',
          widgetContainer: config.widgetContainer || null,
          debug: config.debug || false,
          ...config
      };
      
      this.isInitialized = false;
      this.eventHandlers = new Map();
      this.mutationObserver = null;
      this.timeouts = new Map();
      this.intervals = new Map();
      this.isRelabelingComplete = false;
  }

  /**
   * Initialize the widget
   */
  async init() {
      if (this.isInitialized) {
      this.log('Widget already initialized');
      return;
      }

      try {
      await this.loadElevenLabsScript();
      this.createConvAIElement();
      
      // Start monitoring and setup all functionality
      this.startRelabelFlow();
      this.startAutoAcceptFlow();
      
      this.isInitialized = true;
      this.log('Widget initialized successfully');
      
      } catch (error) {
      console.error('Failed to initialize Upriser Widget:', error);
      throw error;
      }
  }

  /**
   * Load the ElevenLabs ConvAI script
   */
  loadElevenLabsScript() {
      // Reuse a global promise to avoid race conditions and duplicate definitions
      if (typeof window !== 'undefined' && window.__UPRISER_ELEVENLABS_SCRIPT_PROMISE) {
      return window.__UPRISER_ELEVENLABS_SCRIPT_PROMISE;
      }

      // If the custom element is already defined, nothing to load
      if (typeof customElements !== 'undefined' && customElements.get('elevenlabs-convai')) {
      return Promise.resolve();
      }

      const existingScript = document.querySelector('script[data-upriser-agent="true"], script[src*="@elevenlabs/convai-widget-embed"]');

      const loaderPromise = new Promise((resolve, reject) => {
      // If a script tag already exists, wait for definition or load
      if (existingScript) {
          this.log('ElevenLabs script tag already present');
          if (typeof customElements !== 'undefined' && customElements.get('elevenlabs-convai')) {
          resolve();
          return;
          }
          existingScript.addEventListener && existingScript.addEventListener('load', () => resolve());
          const interval = setInterval(() => {
          if (typeof customElements !== 'undefined' && customElements.get('elevenlabs-convai')) {
              clearInterval(interval);
              resolve();
          }
          }, 50);
          setTimeout(() => {
          clearInterval(interval);
          resolve();
          }, 5000);
          return;
      }

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed@0.2.0/dist/index.js';
      script.async = true;
      script.setAttribute('data-upriser-agent', 'true');
      script.onload = () => {
          this.log('ElevenLabs script loaded successfully');
          resolve();
      };
      script.onerror = () => {
          reject(new Error('Failed to load ElevenLabs script'));
      };
      document.head.appendChild(script);
      });

      if (typeof window !== 'undefined') {
      window.__UPRISER_ELEVENLABS_SCRIPT_PROMISE = loaderPromise;
      }
      return loaderPromise;
  }

  /**
   * Create the ConvAI element
   */
  createConvAIElement() {
      const container = this.config.widgetContainer || document.body;
      
      // Remove existing widget if present
      const existingWidget = container.querySelector('elevenlabs-convai');
      if (existingWidget) {
      existingWidget.remove();
      }

      const convaiElement = document.createElement('elevenlabs-convai');
      convaiElement.setAttribute('agent-id', this.config.agentId);
      
      container.appendChild(convaiElement);
      this.log('ConvAI element created with agent ID:', this.config.agentId);
  }

  // Modal demo removed

  /**
   * Relabels and rewrites widget elements to use Upriser branding
   */
  relabelAndRewriteLinks(root) {
      try {
          if (!root) return false;
          let replaced = false;

          // Inject custom styles for chat widget layout
          if (!document.querySelector('#upriser-chat-styles')) {
              const styleSheet = document.createElement('style');
              styleSheet.id = 'upriser-chat-styles';
              styleSheet.textContent = `
                  .bg-base.shrink-0.flex.gap-2.p-4.items-start {
                      align-items: center !important;
                  }
                  .bg-base.shrink-0[class*="items-start"] {
                      align-items: center !important;
                  }
                  .bg-base.items-start {
                      align-items: center !important;
                  }
              `;
              
              if (root.appendChild) {
                  try {
                      root.appendChild(styleSheet);
                      replaced = true;
                  } catch {
                      if (!document.head.querySelector('#upriser-chat-styles')) {
                          document.head.appendChild(styleSheet);
                          replaced = true;
                      }
                  }
              } else if (!document.head.querySelector('#upriser-chat-styles')) {
                  document.head.appendChild(styleSheet);
                  replaced = true;
              }
          }

          // Replace images with upriser logo
          const images = root.querySelectorAll ? root.querySelectorAll('img') : [];
          images.forEach((img) => {
              const src = img.src || img.getAttribute('src') || '';
              
              if (img.getAttribute('data-upriser-protected') === 'true' || 
                  img.getAttribute('data-upriser-conversation-logo') === 'true') {
                  return;
              }
              
              if (src.includes('data:image') && !src.includes('/upriser-logo.svg')) {
                  img.src = '/upriser-logo.svg';
                  img.setAttribute('alt', 'Upriser AI Assistant');
                  img.setAttribute('data-upriser-replaced', 'true');
                  replaced = true;
              }
          });

          // Replace background images
          const elementsWithBgImage = root.querySelectorAll ? root.querySelectorAll('*') : [];
          elementsWithBgImage.forEach((el) => {
              const bgImage = getComputedStyle(el).backgroundImage || el.style.backgroundImage || '';
              
              if (bgImage.includes('data:image') && !bgImage.includes('/upriser-logo.svg')) {
                  el.style.backgroundImage = 'url(/upriser-logo.svg)';
                  el.style.backgroundSize = 'contain';
                  el.style.backgroundPosition = 'center';
                  el.style.backgroundRepeat = 'no-repeat';
                  el.setAttribute('data-upriser-bg-replaced', 'true');
                  replaced = true;
              }
          });

          // Check conversation state
          let conversationStarted = false;
          try {
              conversationStarted = sessionStorage.getItem('upriser-conversation-started') === 'true';
          } catch {
              conversationStarted = window.upriserConversationStarted === true;
          }

          // Handle large avatars
          const largeAvatarContainers = root.querySelectorAll ? root.querySelectorAll(
              '.relative.shrink-0.w-48.h-48, [class*="relative"][class*="w-48"][class*="h-48"]'
          ) : [];
          largeAvatarContainers.forEach((container) => {
              // Hide animated containers
              const animatedContainers = container.querySelectorAll(
                  '.absolute.inset-0.rounded-full.overflow-hidden.bg-base.bg-cover, [class*="absolute"][class*="inset-0"][class*="rounded-full"][class*="bg-cover"]'
              );
              animatedContainers.forEach((animatedContainer) => {
                  animatedContainer.style.display = 'none';
              });
              
              const waveOverlays = container.querySelectorAll('.el-wave-overlay, canvas, [class*="wave"]');
              waveOverlays.forEach((overlay) => {
                  overlay.style.display = 'none';
              });
              
              const borderDiv = container.querySelector('.absolute.inset-0.rounded-full.bg-base-border');
              const isHiddenByConversation = container.getAttribute('data-upriser-hidden-conversation');
              const isVisible = container.style.display !== 'none';
              
              if (borderDiv && !isHiddenByConversation && isVisible && !container.getAttribute('data-upriser-logo-added')) {
                  const logoImg = document.createElement('img');
                  logoImg.src = '/upriser-logo.svg';
                  logoImg.alt = 'Upriser AI Assistant';
                  logoImg.style.cssText = `
                      position: absolute;
                      inset: 0;
                      width: 100%;
                      height: 100%;
                      object-fit: contain;
                      padding: 20%;
                      z-index: 100;
                  `;
                  logoImg.setAttribute('data-upriser-logo', 'true');
                  logoImg.setAttribute('data-upriser-protected', 'true');
                  
                  container.appendChild(logoImg);
                  container.setAttribute('data-upriser-logo-added', 'true');
                  replaced = true;
              }
          });

          // Check for user messages
          const justifyEndMessages = root.querySelectorAll ? root.querySelectorAll('[class*="justify-end"]') : [];
          const accentMessages = root.querySelectorAll ? root.querySelectorAll('[class*="bg-accent"]') : [];
          const paddedMessages = root.querySelectorAll ? root.querySelectorAll('[class*="pl-16"]') : [];
          const accentTextMessages = root.querySelectorAll ? root.querySelectorAll('[class*="text-accent-primary"]') : [];
          
          const hasUserMessage = justifyEndMessages.length > 0 || 
                               accentMessages.length > 0 || 
                               paddedMessages.length > 0 || 
                               accentTextMessages.length > 0;

          // Hide "Chatting with AI Agent" message when user sends first message
          if (hasUserMessage) {
              const chattingMessages = root.querySelectorAll ? root.querySelectorAll('.bg-base.shrink-0.flex.gap-2.p-4') : [];
              chattingMessages.forEach((messageElement) => {
                  const textElement = messageElement.querySelector('.animate-text');
                  if (textElement && textElement.textContent && textElement.textContent.includes('Chatting with AI Agent')) {
                      if (!messageElement.getAttribute('data-upriser-hidden')) {
                          messageElement.style.transition = 'opacity 0.3s ease-out';
                          messageElement.style.opacity = '0';
                          
                          setTimeout(() => {
                              messageElement.style.display = 'none';
                          }, 300);
                          
                          messageElement.setAttribute('data-upriser-hidden', 'true');
                          replaced = true;
                          
                          // Hide large avatars
                          const largeAvatars = root.querySelectorAll ? root.querySelectorAll(
                              '.relative.shrink-0.w-48.h-48, [class*="relative"][class*="w-48"][class*="h-48"]'
                          ) : [];
                          largeAvatars.forEach((avatar) => {
                              avatar.style.display = 'none';
                              avatar.setAttribute('data-upriser-hidden-conversation', 'true');
                          });
                          
                          // Set conversation started flag
                          try {
                              sessionStorage.setItem('upriser-conversation-started', 'true');
                          } catch {
                              window.upriserConversationStarted = true;
                          }
                      }
                  }
              });

              // Add padding to chat containers
              const chatContainers = root.querySelectorAll ? root.querySelectorAll(
                  '.px-4.pb-3.grow.flex.flex-col.gap-3, [class*="px-4"][class*="pb-3"][class*="grow"][class*="flex-col"]'
              ) : [];
              chatContainers.forEach((container) => {
                  if (!container.getAttribute('data-upriser-padded')) {
                      container.style.paddingTop = '15px';
                      container.setAttribute('data-upriser-padded', 'true');
                      replaced = true;
                  }
              });
          }

          // Center chat elements
          const chatElements = root.querySelectorAll ? root.querySelectorAll('.bg-base.shrink-0, .bg-base.items-start, [class*="bg-base"][class*="items-start"]') : [];
          chatElements.forEach((el) => {
              if (el.classList.contains('items-start') && !el.getAttribute('data-upriser-centered')) {
                  el.style.setProperty('align-items', 'center', 'important');
                  el.setAttribute('data-upriser-centered', 'true');
                  replaced = true;
              }
          });

          // Replace "Powered by ElevenLabs" text
          const spans = root.querySelectorAll ? root.querySelectorAll('span.opacity-30, .opacity-30') : [];
          spans.forEach((s) => {
              const txt = s.textContent ? s.textContent.trim() : '';
              if (txt === 'Powered by ElevenLabs') {
                  if (s.getAttribute('data-upriser-branded') === 'true') {
                      return;
                  }
                  
                  s.textContent = 'Powered by Upriser.ai';
                  s.style.fontFamily = 'Plus Jakarta Sans, sans-serif';
                  s.classList.remove('opacity-30', 'opacity-50', 'opacity-70');
                  s.classList.add('upriser-white');
                  s.setAttribute('data-upriser-branded', 'true');
                  s.style.setProperty('color', '#ffffff', 'important');
                  s.style.setProperty('opacity', '1', 'important');
                  replaced = true;
              }
          });

          // Update links
          const anchors = root.querySelectorAll ? root.querySelectorAll('a[href]') : [];
          anchors.forEach((a) => {
              const href = a.getAttribute('href') || '';
              const text = (a.textContent || '').trim();
              if (href.includes('elevenlabs') || text === 'Conversational AI' || text.includes('ElevenLabs')) {
                  if (a.getAttribute('data-upriser-processed') === 'true') {
                      return;
                  }
                  
                  a.style.fontFamily = 'Plus Jakarta Sans, sans-serif';
                  a.setAttribute('href', 'https://www.upriser.ai');
                  a.setAttribute('target', '_blank');
                  a.setAttribute('rel', 'noopener noreferrer');
                  a.setAttribute('data-upriser-processed', 'true');
                  a.style.setProperty('color', '#ffffff', 'important');
                  
                  const newEl = a.cloneNode(true);
                  a.parentNode.replaceChild(newEl, a);
                  
                  newEl.addEventListener('click', (e) => {
                      try { e.preventDefault(); } catch {}
                      try { 
                          window.open('https://www.upriser.ai', '_blank', 'noopener,noreferrer');
                      } catch {
                          window.location.href = 'https://www.upriser.ai';
                      }
                  }, { once: true });
                  
                  if (text.includes('ElevenLabs')) newEl.textContent = text.replace(/ElevenLabs/g, 'Upriser.ai');
                  replaced = true;
              }
          });

          return replaced;
      } catch {
          return false;
      }
  }

  /**
   * Attempts relabeling across all widget elements
   */
  attemptRelabelEverywhere() {
      try {
          let done = this.relabelAndRewriteLinks(document.body);
          const host = document.querySelector('elevenlabs-convai');
          
          if (host && host.shadowRoot) {
              done = this.relabelAndRewriteLinks(host.shadowRoot) || done;
              
              if (!host._upriserObserverSetup) {
                  this.setupShadowRootObserver(host.shadowRoot);
                  host._upriserObserverSetup = true;
              }
          }
          
          try {
              document.querySelectorAll('*').forEach((el) => {
                  const sr = el.shadowRoot;
                  if (sr) {
                      done = this.relabelAndRewriteLinks(sr) || done;
                  }
              });
          } catch {}
          
          return done;
      } catch (error) {
          this.log('Error in attemptRelabelEverywhere:', error);
          return false;
      }
  }

  /**
   * Sets up shadow root observer for specific monitoring
   */
  setupShadowRootObserver(shadowRoot) {
      const shadowObserver = new MutationObserver((mutations) => {
          let hasImageChanges = false;
          
          mutations.forEach((mutation) => {
              if (mutation.type === 'childList') {
                  mutation.addedNodes.forEach((node) => {
                      if (node.nodeType === Node.ELEMENT_NODE) {
                          const element = node;
                          if (element.tagName === 'IMG' || (element.querySelector && element.querySelector('img'))) {
                              hasImageChanges = true;
                          }
                      }
                  });
              } else if (mutation.type === 'attributes' && mutation.target instanceof HTMLImageElement) {
                  if (mutation.attributeName === 'src') {
                      const src = mutation.target.src;
                      if (src.includes('data:image')) {
                          hasImageChanges = true;
                      }
                  }
              }
          });
          
          if (hasImageChanges) {
              setTimeout(() => {
                  this.relabelAndRewriteLinks(shadowRoot);
              }, 50);
          }
      });
      
      shadowObserver.observe(shadowRoot, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['src']
      });
  }

  /**
   * Starts the relabel flow with monitoring
   */
  startRelabelFlow() {
      // Start mutation observer immediately
      this.setupMutationObserver();
      this.attemptRelabelEverywhere();

      const retryInterval = setInterval(() => {
          const host = document.querySelector('elevenlabs-convai');
          if (host && host.shadowRoot) {
              this.log('Widget loaded, attempting relabeling...');
              if (this.attemptRelabelEverywhere()) {
                  this.log('Relabeling successful, stopping retry interval');
                  clearInterval(retryInterval);
                  this.intervals.delete('relabel-retry');
                  this.isRelabelingComplete = true;
              }
          }
      }, 1000);
      this.intervals.set('relabel-retry', retryInterval);

      const timeout = setTimeout(() => {
          const interval = this.intervals.get('relabel-retry');
          if (interval) {
              clearInterval(interval);
              this.intervals.delete('relabel-retry');
          }
          this.log('Stopped retrying relabeling after 30 seconds');
      }, 30000);
      this.timeouts.set('relabel-timeout', timeout);
  }

  /**
   * Sets up mutation observer for relabel monitoring
   */
  setupMutationObserver() {
      if (this.mutationObserver) {
          this.mutationObserver.disconnect();
      }

      let debounceTimer = null;
      
      this.mutationObserver = new MutationObserver((mutations) => {
          let shouldProcess = false;
          
          mutations.forEach((mutation) => {
              if (mutation.type === 'childList') {
                  mutation.addedNodes.forEach((node) => {
                      if (node.nodeType === Node.ELEMENT_NODE) {
                          const element = node;
                          if (element.tagName === 'IMG' || (element.querySelector && element.querySelector('img'))) {
                              shouldProcess = true;
                          }
                      }
                  });
              } else if (mutation.type === 'attributes') {
                  if (mutation.target instanceof HTMLImageElement && mutation.attributeName === 'src') {
                      const src = mutation.target.src;
                      if (src.includes('data:image')) {
                          shouldProcess = true;
                      }
                  }
              }
          });
          
          if (debounceTimer) {
              clearTimeout(debounceTimer);
          }
          
          debounceTimer = setTimeout(() => {
              this.attemptRelabelEverywhere();
          }, 100);
      });
      
      this.mutationObserver.observe(document.documentElement, { 
          childList: true, 
          subtree: true, 
          attributes: true, 
          attributeFilter: ['src', 'style', 'class'] 
      });
  }

  /**
   * Auto-accept flow implementation
   */
  startAutoAcceptFlow() {
      let accepted = false;
      let widgetInitiallyProcessed = false;

      const clickAccept = (root) => {
          if (!root || accepted) return false;
          const candidates = root.querySelectorAll ? root.querySelectorAll('button, [role="button"], span, div') : [];
          for (let i = 0; i < candidates.length; i++) {
              const el = candidates[i];
              const text = (el.textContent || '').trim();
              if (text === 'Accept') {
                  try { 
                      el.dispatchEvent(new MouseEvent('click', { bubbles: true })); 
                  } catch { 
                      if (el.click) el.click(); 
                  }
                  accepted = true;
                  return true;
              }
              const sr = el.shadowRoot;
              if (sr && clickAccept(sr)) return true;
          }
          return false;
      };

      const processWidget = (showAfterDelay = false) => {
          try {
              this.wireStartCallHide(document.body);
              this.removeNeedHelpElement(document.body);
              const host = document.querySelector('elevenlabs-convai');
              if (host && host.shadowRoot) {
                  this.wireStartCallHide(host.shadowRoot);
                  this.removeNeedHelpElement(host.shadowRoot);
              }
              
              if (showAfterDelay) {
                  this.showWidgetAfterDelay(500);
              }
          } catch {}
      };

      const attempt = () => {
          try {
              const host = document.querySelector('elevenlabs-convai');
              
              if (host && !widgetInitiallyProcessed) {
                  this.hideWidgetInitially();
                  widgetInitiallyProcessed = true;
                  
                  setTimeout(() => {
                      processWidget(true);
                  }, 100);
              } else {
                  processWidget(false);
              }
          } catch {}
          
          let done = clickAccept(document.body);
          const host = document.querySelector('elevenlabs-convai');
          if (host && host.shadowRoot) {
              done = clickAccept(host.shadowRoot) || done;
          }
          return done;
      };

      let tries = 0;
      const maxTries = 120;
      const intervalId = setInterval(() => {
          if (attempt() || ++tries >= maxTries) {
              clearInterval(intervalId);
              this.intervals.delete('auto-accept');
          }
      }, 500);
      this.intervals.set('auto-accept', intervalId);

      const observer = new MutationObserver((mutations) => {
          const host = document.querySelector('elevenlabs-convai');
          let shouldProcess = false;
          let widgetStateChanged = false;
          
          if (host && !widgetInitiallyProcessed) {
              this.hideWidgetInitially();
              widgetInitiallyProcessed = true;
              
              setTimeout(() => {
                  processWidget(true);
              }, 100);
              return;
          }
          
          mutations.forEach((mutation) => {
              if (mutation.type === 'childList') {
                  mutation.addedNodes.forEach((node) => {
                      if (node.nodeType === Node.ELEMENT_NODE) {
                          const element = node;
                          if (element.textContent && element.textContent.includes('Need help?') || 
                              (element.querySelector && element.querySelector('[text*="Need help?"]'))) {
                              shouldProcess = true;
                          }
                          const text = element.textContent ? element.textContent.toLowerCase() : '';
                          if (text.includes('start a call') || text.includes('send message')) {
                              widgetStateChanged = true;
                          }
                      }
                  });
                  
                  mutation.removedNodes.forEach((node) => {
                      if (node.nodeType === Node.ELEMENT_NODE) {
                          const element = node;
                          const text = element.textContent ? element.textContent.toLowerCase() : '';
                          if (text.includes('calling') || text.includes('connected') || text.includes('recording')) {
                              widgetStateChanged = true;
                          }
                      }
                  });
              }
          });
          
          if (widgetStateChanged) {
              setTimeout(() => {
                  try {
                      this.resetWidgetToInitialState();
                  } catch {}
              }, 100);
          }
          
          processWidget(false);
          attempt();
      });
      
      observer.observe(document.documentElement, { childList: true, subtree: true });

      // Additional observer for shadow DOM changes
      const shadowObserver = new MutationObserver(() => {
          processWidget(false);
      });

      const checkShadowRoots = () => {
          const host = document.querySelector('elevenlabs-convai');
          if (host && host.shadowRoot) {
              try {
                  shadowObserver.observe(host.shadowRoot, { 
                      childList: true, 
                      subtree: true,
                      attributes: true,
                      attributeOldValue: true
                  });
              } catch {}
          }
      };

      const intervalId2 = setInterval(checkShadowRoots, 1000);
      this.intervals.set('shadow-check', intervalId2);
      checkShadowRoots();

      // Add global click listener for input protection
      document.addEventListener('click', (e) => {
          const target = e.target;
          if (target && (
              target.tagName === 'INPUT' ||
              target.tagName === 'TEXTAREA' ||
              target.contentEditable === 'true' ||
              target.closest('input, textarea, [contenteditable]') ||
              target.getAttribute('role') === 'textbox'
          )) {
              this.cancelHideTimeout();
          }
      }, { capture: true });
  }

  /**
   * Hides widget initially when detected
   */
  hideWidgetInitially() {
      const host = document.querySelector('elevenlabs-convai');
      if (!host) return;
      host.style.setProperty('visibility', 'hidden', 'important');
      host.style.setProperty('opacity', '0', 'important');
  }

  /**
   * Shows widget after delay
   */
  showWidgetAfterDelay(ms = 500) {
      const timeoutId = setTimeout(() => {
          const host = document.querySelector('elevenlabs-convai');
          if (!host) return;
          try {
              host.style.removeProperty('visibility');
              host.style.removeProperty('opacity');
          } catch {}
      }, ms);
      this.timeouts.set('show-widget', timeoutId);
  }

  /**
   * Hides widget temporarily with timeout management
   */
  hideWidgetTemporarily(ms = 500) {
      const host = document.querySelector('elevenlabs-convai');
      if (!host) return;
      
      // Clear any existing timeout
      const existingTimeout = this.timeouts.get('hide-widget');
      if (existingTimeout) {
          clearTimeout(existingTimeout);
      }
      
host.style.setProperty('visibility', 'hidden', 'important');
      host.style.setProperty('opacity', '0', 'important');
      
      const timeoutId = setTimeout(() => {
          try {
              host.style.removeProperty('visibility');
              host.style.removeProperty('opacity');
              this.timeouts.delete('hide-widget');
          } catch {}
      }, ms);
      this.timeouts.set('hide-widget', timeoutId);
  }

  /**
   * Cancels hide timeout
   */
  cancelHideTimeout() {
      const hideTimeout = this.timeouts.get('hide-widget');
      if (hideTimeout) {
          clearTimeout(hideTimeout);
          this.timeouts.delete('hide-widget');
          
          const host = document.querySelector('elevenlabs-convai');
          if (host) {
              try {
                  host.style.removeProperty('visibility');
                  host.style.removeProperty('opacity');
              } catch {}
          }
      }
  }

  /**
   * Removes "Need help?" element
   */
  removeNeedHelpElement(root) {
      try {
          if (!root) return false;
          let removed = false;
          
          const candidates = root.querySelectorAll ? root.querySelectorAll('div') : [];
          candidates.forEach((el) => {
              const text = (el.textContent || '').trim();
              if (text === 'Need help?') {
                  let targetElement = el;
                  let current = el.parentElement;
                  
                  while (current) {
                      const classes = current.className || '';
                      if (classes.includes('relative') && 
                          classes.includes('inline-flex') && 
                          classes.includes('shrink-0') &&
                          classes.includes('justify-center') &&
                          classes.includes('items-center') &&
                          classes.includes('transition-') &&
                          classes.includes('min-w-0') &&
                          classes.includes('z-1')) {
                          targetElement = current;
                          break;
                      }
                      current = current.parentElement;
                  }
                  
                  try {
                      targetElement.remove();
                      removed = true;
                  } catch (e) {
                      targetElement.style.setProperty('display', 'none', 'important');
                      removed = true;
                  }
              }
          });
          
          return removed;
      } catch {
          return false;
      }
  }

  /**
   * Wires start call buttons to hide widget temporarily
   */
  wireStartCallHide(root) {
      const candidates = root.querySelectorAll ? root.querySelectorAll('button, [role="button"]') : [];
      candidates.forEach((el) => {
          if (el.dataset && el.dataset.upriserWired === '1') return;
          const text = (el.textContent || '').trim();
          
          if ((text === 'Start a call' || text === 'Send message' || text.includes('Call')) && 
              !el.closest('input, textarea, [contenteditable]') &&
              !el.querySelector('input, textarea, [contenteditable]')) {
              if (el.dataset) el.dataset.upriserWired = '1';
              el.addEventListener('click', (e) => {
                  const target = e.target;
                  if (target && (
                      target.tagName === 'INPUT' || 
                      target.tagName === 'TEXTAREA' ||
                      target.contentEditable === 'true' ||
                      target.closest('input, textarea, [contenteditable]')
                  )) {
                      return;
                  }
                  this.hideWidgetTemporarily(500);
              }, { capture: true });
          }
          const sr = el.shadowRoot;
          if (sr) this.wireStartCallHide(sr);
      });
  }

  /**
   * Resets widget to initial state
   */
  resetWidgetToInitialState() {
      try {
          const host = document.querySelector('elevenlabs-convai');
          if (!host) return;
          
          this.clearWidgetWiring(document.body);
          if (host.shadowRoot) {
              this.clearWidgetWiring(host.shadowRoot);
          }
          
          if (host.shadowRoot) {
              const shadowRoot = host.shadowRoot;
              
              const endButtons = shadowRoot.querySelectorAll('button, [role="button"]');
              endButtons.forEach((button) => {
                  const text = (button.textContent || '').trim().toLowerCase();
                  if (text.includes('end') || text.includes('close') || text.includes('hang up') || text === '×') {
                      try {
                          button.click();
                      } catch {}
                  }
              });
              
              setTimeout(() => {
                  try {
                      this.removeNeedHelpElement(shadowRoot);
                      this.wireStartCallHide(shadowRoot);
                      this.removeNeedHelpElement(document.body);
                      this.wireStartCallHide(document.body);
                  } catch {}
              }, 500);
          }
      } catch (error) {
          this.log('Error resetting widget state:', error);
      }
  }

  /**
   * Clears widget wiring
   */
  clearWidgetWiring(root) {
      try {
          const candidates = root.querySelectorAll ? root.querySelectorAll('button, [role="button"]') : [];
          candidates.forEach((el) => {
              if (el.dataset) {
                  delete el.dataset.upriserWired;
              }
          });
      } catch {}
  }


  /**
   * Update widget configuration
   */
  updateConfig(newConfig) {
      this.config = { ...this.config, ...newConfig };
      this.log('Configuration updated:', newConfig);
  }

  /**
   * Destroy the widget and clean up
   */
  destroy() {
      // Clear all timeouts
      this.timeouts.forEach((timeoutId) => {
          clearTimeout(timeoutId);
      });
      this.timeouts.clear();
      
      // Clear all intervals
      this.intervals.forEach((intervalId) => {
          clearInterval(intervalId);
      });
      this.intervals.clear();
      
      // Disconnect mutation observers
      if (this.mutationObserver) {
          this.mutationObserver.disconnect();
          this.mutationObserver = null;
      }
      
      
      // Remove ConvAI element
      const widget = document.querySelector('elevenlabs-convai');
      if (widget) {
          widget.remove();
      }
      
      // Clear widget wiring
      this.clearWidgetWiring(document.body);
      
      // Remove injected styles
      const styles = document.querySelector('#upriser-chat-styles');
      if (styles) {
          styles.remove();
      }

      this.isInitialized = false;
      this.isRelabelingComplete = false;
      this.eventHandlers.clear();
      this.log('Widget destroyed and cleaned up');
  }

  /**
   * Test method to verify all functionality is working
   */
  test() {
      this.log('Testing Upriser Widget functionality...');
      
      // Test relabeling
      const relabelResult = this.attemptRelabelEverywhere();
      this.log('Relabel test result:', relabelResult);
      
      this.log('Widget test completed');
      return {
          relabeling: relabelResult,
          isInitialized: this.isInitialized
      };
  }

  /**
   * Logging utility
   */
  log(...args) {
      if (this.config.debug) {
      console.log('[Upriser Widget]', ...args);
      }
  }
  }

  // Export for both CommonJS and ES modules
  if (typeof module !== 'undefined' && module.exports) {
  module.exports = UpriserWidget;
  }

  // WordPress-compatible initialization
  (function() {
  'use strict';

  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
  }

  // Make UpriserWidget available globally
  window.UpriserWidget = UpriserWidget;

  // Default configuration - can be overridden by WordPress themes/plugins
  if (!window.UPRISER_WIDGET_CONFIG) {
      window.UPRISER_WIDGET_CONFIG = {
          agentId: 'agent_8401k5nnvgqpezf9fd17t3tb7t69',
          debug: false
      };
  }

  // Function to initialize the widget
  function initializeUpriserWidget() {
      try {
          if (window.upriserWidget && window.upriserWidget.isInitialized) {
              console.log('[Upriser Widget] Already initialized');
              return window.upriserWidget;
          }

          const widget = new UpriserWidget(window.UPRISER_WIDGET_CONFIG);
          widget.init().catch(function(error) {
              console.error('[Upriser Widget] Initialization failed:', error);
          });
          window.upriserWidget = widget;
          return widget;
      } catch (error) {
          console.error('[Upriser Widget] Failed to create widget:', error);
          return null;
      }
  }

  // WordPress-compatible initialization strategies
  function setupInitialization() {
      // Strategy 1: DOM already loaded
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
          initializeUpriserWidget();
          return;
      }

      // Strategy 2: Wait for DOMContentLoaded
      if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initializeUpriserWidget);
      }

      // Strategy 3: Fallback for WordPress - wait for window.load
      window.addEventListener('load', function() {
          if (!window.upriserWidget || !window.upriserWidget.isInitialized) {
              initializeUpriserWidget();
          }
      });

      // Strategy 4: jQuery ready (common in WordPress)
      if (typeof jQuery !== 'undefined') {
          jQuery(document).ready(function() {
              if (!window.upriserWidget || !window.upriserWidget.isInitialized) {
                  initializeUpriserWidget();
              }
          });
      }
  }

  // Only auto-initialize if not using custom elements
  if (!window.UPRISER_DISABLE_AUTO_INIT) {
      setupInitialization();
  }

  // Expose manual initialization function
  window.initUpriserWidget = initializeUpriserWidget;
})();
