# Authentication API

The Waffle Authentication API provides secure user authentication using Web3 wallet signatures and Twitter OAuth integration.

## Base URL

```
Production: https://api.waffle.food
Development: http://localhost:3001
```

## Authentication Flow

### 1. Wallet Authentication

#### Get Nonce

Get a unique nonce for wallet signature verification.

```http
GET /auth/nonce/:address
```

**Parameters:**

| Parameter | Type   | Description             |
| --------- | ------ | ----------------------- |
| address   | string | Ethereum wallet address |

**Response:**

```json
{
  "nonce": "12345678-1234-1234-1234-123456789abc",
  "message": "Sign this message to authenticate with Waffle.\n\nNonce: 12345678-1234-1234-1234-123456789abc"
}
```

#### Verify Signature

Verify wallet signature and authenticate user.

```http
POST /auth/verify
```

**Request Body:**

```json
{
  "address": "0x742d35Cc6639C0532fEb03B9c12b36a2d95eDe7F",
  "message": "Sign this message to authenticate with Waffle.\n\nNonce: 12345678-1234-1234-1234-123456789abc",
  "signature": "0x1234567890abcdef..."
}
```

**Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "address": "0x742d35Cc6639C0532fEb03B9c12b36a2d95eDe7F",
    "username": "0x742d...De7F",
    "isRegistered": true,
    "reputationScore": 1000
  },
  "needsTwitterRegistration": false
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "Invalid signature",
  "needsTwitterRegistration": true
}
```

### 2. Twitter Authentication

#### Twitter OAuth Login

Initiate Twitter OAuth flow.

```http
GET /auth/twitter
```

**Response:**
Redirects to Twitter OAuth authorization page.

#### Twitter OAuth Callback

Handle Twitter OAuth callback.

```http
GET /auth/twitter/callback?code=...&state=...
```

**Response:**
Redirects to frontend with authentication result.

### 3. Check Authentication Status

Check user authentication and registration status.

```http
POST /auth/status
```

**Request Body:**

```json
{
  "address": "0x742d35Cc6639C0532fEb03B9c12b36a2d95eDe7F"
}
```

**Response:**

```json
{
  "canLoginWithWallet": true,
  "needsTwitterRegistration": false,
  "username": "example_user",
  "isRegistered": true,
  "hasTwitter": true,
  "reputationScore": 1500
}
```

### 4. Logout

Logout user and invalidate session.

```http
POST /auth/logout
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## JWT Token Structure

### Header

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Payload

```json
{
  "userId": "user_123",
  "address": "0x742d35Cc6639C0532fEb03B9c12b36a2d95eDe7F",
  "username": "example_user",
  "iat": 1640995200,
  "exp": 1641081600
}
```

## Error Codes

### Authentication Errors

| Code     | Status | Description                      |
| -------- | ------ | -------------------------------- |
| AUTH_001 | 401    | Invalid or expired token         |
| AUTH_002 | 401    | Invalid signature                |
| AUTH_003 | 401    | Nonce expired or invalid         |
| AUTH_004 | 400    | Missing required parameters      |
| AUTH_005 | 429    | Too many authentication attempts |
| AUTH_006 | 403    | User not registered              |
| AUTH_007 | 400    | Invalid wallet address format    |

### Twitter Integration Errors

| Code        | Status | Description                    |
| ----------- | ------ | ------------------------------ |
| TWITTER_001 | 400    | Twitter OAuth failed           |
| TWITTER_002 | 400    | Invalid Twitter callback       |
| TWITTER_003 | 409    | Twitter account already linked |
| TWITTER_004 | 400    | Twitter account required       |

## Security Considerations

### Nonce Management

- Nonces expire after 5 minutes
- Each nonce can only be used once
- Nonces are cryptographically random

### Signature Verification

- Messages include timestamp for replay protection
- Signatures are verified using elliptic curve cryptography
- Invalid signatures are logged for security monitoring

### JWT Security

- Tokens expire after 24 hours
- Tokens are signed with a secret key
- Refresh tokens are available for longer sessions

### Rate Limiting

- Authentication endpoints are rate-limited
- Excessive failed attempts trigger temporary blocks
- IP-based and user-based rate limiting

## Example Usage

### Frontend Integration

```typescript
// Get nonce and sign message
async function authenticateWallet(address: string, signMessage: Function) {
  try {
    // Get nonce
    const nonceResponse = await fetch(`/auth/nonce/${address}`);
    const { nonce, message } = await nonceResponse.json();
    
    // Sign message
    const signature = await signMessage({ message });
    
    // Verify signature
    const authResponse = await fetch('/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, message, signature })
    });
    
    const result = await authResponse.json();
    
    if (result.success) {
      // Store token
      localStorage.setItem('waffle_auth_token', result.token);
      return result.user;
    } else if (result.needsTwitterRegistration) {
      // Redirect to Twitter auth
      window.location.href = '/auth/twitter';
    }
  } catch (error) {
    console.error('Authentication failed:', error);
    throw error;
  }
}
```

### Backend Integration

```typescript
// Middleware to verify JWT token
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
}

// Protected route example
app.get('/api/user/profile', authenticateToken, (req: Request, res: Response) => {
  // User is authenticated, access req.user
  res.json({ user: req.user });
});
```

## Best Practices

### Client-Side

1. **Store tokens securely** in httpOnly cookies or secure localStorage
2. **Handle token expiration** gracefully with refresh logic
3. **Clear tokens on logout** and wallet disconnection
4. **Validate addresses** before sending authentication requests

### Server-Side

1. **Use HTTPS** for all authentication endpoints
2. **Implement proper CORS** policies
3. **Log authentication events** for security monitoring
4. **Use environment variables** for secrets
5. **Implement rate limiting** on auth endpoints

### Security

1. **Never log** private keys or signatures
2. **Validate all inputs** on the server side
3. **Use secure random** nonce generation
4. **Implement replay protection** with timestamps
5. **Monitor for** suspicious authentication patterns

---

The Authentication API provides a robust foundation for secure user authentication in the Waffle ecosystem, supporting both Web3 wallet signatures and traditional OAuth flows.
