/**
 * Token Manager for Microsoft Graph API Authentication
 * Handles token storage, refresh, and validation
 */

const fs = require('fs');
const path = require('path');
const { HttpClient } = require('../../utils');
const config = require('../../config');

class TokenManager {
  constructor() {
    this.httpClient = new HttpClient();
    this.tokenPath = path.join(process.cwd(), '.outlook-tokens.json');
    this.tokens = this.loadTokens();
  }

  /**
   * Load tokens from file
   */
  loadTokens() {
    try {
      if (fs.existsSync(this.tokenPath)) {
        const data = fs.readFileSync(this.tokenPath, 'utf8');
        const tokens = JSON.parse(data);
        
        // Handle both expires_at (from auth server) and expiry (internal format)
        if (tokens.expires_at && !tokens.expiry) {
          tokens.expiry = tokens.expires_at;
        }
        
        return tokens;
      }
    } catch (error) {
      console.error('Error loading tokens:', error.message);
    }
    return {};
  }

  /**
   * Save tokens to file
   */
  saveTokens(tokens) {
    try {
      this.tokens = { ...this.tokens, ...tokens };
      fs.writeFileSync(this.tokenPath, JSON.stringify(this.tokens, null, 2));
      console.error('✅ Tokens saved successfully');
    } catch (error) {
      console.error('❌ Error saving tokens:', error.message);
      throw error;
    }
  }

  /**
   * Create test tokens for development mode
   */
  createTestTokens() {
    const testTokens = {
      access_token: 'test-access-token-' + Date.now(),
      refresh_token: 'test-refresh-token-' + Date.now(),
      expires_in: 3600,
      token_type: 'Bearer',
      scope: config.OUTLOOK_CONFIG.scopes.join(' '),
      expiry: Date.now() + (3600 * 1000) // 1 hour from now
    };

    this.saveTokens(testTokens);
    console.error('🧪 Test tokens created');
  }

  /**
   * Check if we have valid tokens
   */
  hasValidTokens() {
    if (!this.tokens.access_token || !this.tokens.expiry) {
      return false;
    }

    // Check if token is not expired (with 5 minute buffer)
    const now = Date.now();
    const buffer = 5 * 60 * 1000; // 5 minutes
    return now < (this.tokens.expiry - buffer);
  }

  /**
   * Get current token status
   */
  getTokenStatus() {
    return {
      accessToken: !!this.tokens.access_token,
      refreshToken: !!this.tokens.refresh_token,
      expiry: this.tokens.expiry ? new Date(this.tokens.expiry).toISOString() : null,
      isValid: this.hasValidTokens()
    };
  }

  /**
   * Get access token for API calls
   */
  getAccessToken() {
    if (config.USE_TEST_MODE) {
      return this.tokens.access_token || 'test-access-token';
    }

    if (!this.hasValidTokens()) {
      throw new Error('No valid access token available. Please authenticate first.');
    }

    return this.tokens.access_token;
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code) {
    if (config.USE_TEST_MODE) {
      this.createTestTokens();
      return this.tokens;
    }

    const tokenUrl = `https://login.microsoftonline.com/consumers/oauth2/v2.0/token`;
    
    const body = new URLSearchParams({
      client_id: config.OUTLOOK_CONFIG.clientId,
      client_secret: config.OUTLOOK_CONFIG.clientSecret,
      code: code,
      redirect_uri: config.OUTLOOK_CONFIG.redirectUri,
      grant_type: 'authorization_code',
      scope: config.OUTLOOK_CONFIG.scopes.join(' ')
    });

    try {
      const response = await this.httpClient.post(tokenUrl, body.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const tokens = response.data;
      tokens.expiry = Date.now() + (tokens.expires_in * 1000);
      
      this.saveTokens(tokens);
      return tokens;
    } catch (error) {
      console.error('❌ Token exchange error:', error.message);
      throw new Error(`Failed to exchange code for tokens: ${error.message}`);
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshTokens() {
    if (config.USE_TEST_MODE) {
      this.createTestTokens();
      return this.tokens;
    }

    if (!this.tokens.refresh_token) {
      throw new Error('No refresh token available. Please re-authenticate.');
    }

    const tokenUrl = `https://login.microsoftonline.com/consumers/oauth2/v2.0/token`;
    
    const body = new URLSearchParams({
      client_id: config.OUTLOOK_CONFIG.clientId,
      client_secret: config.OUTLOOK_CONFIG.clientSecret,
      refresh_token: this.tokens.refresh_token,
      grant_type: 'refresh_token',
      scope: config.OUTLOOK_CONFIG.scopes.join(' ')
    });

    try {
      const response = await this.httpClient.post(tokenUrl, body.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const newTokens = response.data;
      newTokens.expiry = Date.now() + (newTokens.expires_in * 1000);
      
      // Keep the refresh token if not provided in response
      if (!newTokens.refresh_token && this.tokens.refresh_token) {
        newTokens.refresh_token = this.tokens.refresh_token;
      }
      
      this.saveTokens(newTokens);
      console.error('✅ Tokens refreshed successfully');
      
      return newTokens;
    } catch (error) {
      console.error('❌ Token refresh error:', error.message);
      throw new Error(`Failed to refresh tokens: ${error.message}`);
    }
  }

  /**
   * Clear all tokens
   */
  clearTokens() {
    this.tokens = {};
    if (fs.existsSync(this.tokenPath)) {
      fs.unlinkSync(this.tokenPath);
    }
    console.error('🗑️ Tokens cleared');
  }

  /**
   * Auto-refresh tokens if needed
   */
  async ensureValidToken() {
    if (config.USE_TEST_MODE) {
      if (!this.hasValidTokens()) {
        this.createTestTokens();
      }
      return this.getAccessToken();
    }

    if (!this.hasValidTokens()) {
      if (this.tokens.refresh_token) {
        await this.refreshTokens();
      } else {
        throw new Error('Authentication required. Please call outlook_authenticate first.');
      }
    }

    return this.getAccessToken();
  }
}

module.exports = { TokenManager };