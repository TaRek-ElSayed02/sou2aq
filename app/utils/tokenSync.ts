/**
 * Token synchronization across origins using postMessage API
 * This allows subdomains to get the token from main site
 */

interface TokenMessage {
  accessToken: string;
  refreshToken?: string;
}

/**
 * Listen for token messages from main site (in subdomains)
 * Usage: Call this in subdomain layout useEffect
 */
export const listenForTokenMessage = (callback: (token: TokenMessage) => void) => {
  const handleMessage = (event: MessageEvent) => {
    // تحقق من البيانات
    if (event.data?.accessToken) {
      console.log('📬 Received token message from:', event.origin);
      callback(event.data);
    }
  };
  
  window.addEventListener('message', handleMessage);
  
  return () => {
    window.removeEventListener('message', handleMessage);
  };
};

/**
 * Request token from main site (from subdomains)
 * Usage: Call this in subdomain when localStorage is empty
 */
export const requestTokenFromMainSite = () => {
  console.log('🔍 Requesting token from main site...');
  
  return new Promise<TokenMessage | null>((resolve) => {
    const timeout = setTimeout(() => {
      console.log('⏱️ Request timeout - main site didn\'t respond');
      resolve(null);
    }, 2000);
    
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.accessToken) {
        clearTimeout(timeout);
        window.removeEventListener('message', handleMessage);
        console.log('✅ Received token from main site');
        resolve(event.data);
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    // محاولة الـ request من الـ main site
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage({ action: 'REQUEST_TOKEN' }, '*');
    } else if (window.parent !== window) {
      // إذا كانت في iframe
      window.parent.postMessage({ action: 'REQUEST_TOKEN' }, '*');
    }
  });
};

/**
 * Broadcast token to all subdomains (from main site)
 * Usage: Call this in main site to share token with subdomains
 */
export const broadcastTokenToSubdomains = (token: TokenMessage) => {
  console.log('📡 Broadcasting token to all tabs/subdomains...');
  
  // Send to all windows/tabs that might be open (iframes, opened windows)
  if (window.opener && !window.opener.closed) {
    window.opener.postMessage(token, '*');
  }
};

/**
 * Handle token request in main site
 * Usage: Setup this listener in main site to respond to token requests
 */
export const setupMainSiteTokenResponder = () => {
  const handleMessage = (event: MessageEvent) => {
    if (event.data?.action === 'REQUEST_TOKEN') {
      console.log('🎯 Token request received from:', event.origin);
      
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (accessToken && event.source) {
        console.log('📤 Sending token to requester');
        (event.source as any).postMessage(
          { accessToken, refreshToken },
          '*'
        );
      }
    }
  };
  
  window.addEventListener('message', handleMessage);
  
  return () => {
    window.removeEventListener('message', handleMessage);
  };
};
