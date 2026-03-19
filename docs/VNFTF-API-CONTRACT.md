# VNFTF API Contract
## Living Faith Tabernacle ↔ Voice Notes From The Father Integration

**Version:** 1.0.0
**Date:** 2026-03-18
**Status:** Draft for Implementation

---

## Overview

This document defines the API contract between LFTCM ChurchOS and the independent VNFTF platform. The integration follows a "Sacred Bridge" pattern where both platforms maintain independence while sharing essential data.

---

## Authentication

### Method: API Key + JWT

```http
Authorization: Bearer {jwt_token}
X-API-Key: {platform_api_key}
X-Platform-Origin: lftcm|vnftf
```

### Token Exchange

```typescript
// POST /auth/exchange
// Exchange LFTCM user token for VNFTF access token

Request:
{
  "lftcmToken": "string",
  "requestedScopes": ["read:chapters", "read:notes"]
}

Response:
{
  "vnftfToken": "string",
  "expiresAt": "2026-03-19T00:00:00Z",
  "scopes": ["read:chapters", "read:notes"]
}
```

---

## Endpoints

### 1. Chapters (Shared Registry)

#### GET /api/v1/chapters

**Description:** Retrieve all active chapters (shared between platforms)

**Request:**
```http
GET /api/v1/chapters
Authorization: Bearer {token}
X-API-Key: {key}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "chapters": [
      {
        "id": "uuid",
        "name": "Yaoundé Chapter",
        "city": "Yaoundé",
        "country": "Cameroon",
        "coordinates": {
          "lat": 3.8480,
          "lng": 11.5021
        },
        "shepherd": {
          "id": "uuid",
          "name": "John Doe",
          "email": "shepherd@example.com",
          "phone": "+237..."
        },
        "meetingSchedule": {
          "day": "Saturday",
          "time": "16:00",
          "timezone": "Africa/Douala"
        },
        "memberCount": 45,
        "isActive": true,
        "platforms": ["lftcm", "vnftf"],
        "createdAt": "2025-01-15T00:00:00Z",
        "updatedAt": "2026-03-18T00:00:00Z"
      }
    ],
    "total": 25,
    "page": 1,
    "perPage": 20
  }
}
```

#### POST /api/v1/chapters

**Description:** Create new chapter (syncs to both platforms)

**Request:**
```json
{
  "name": "Douala Chapter",
  "city": "Douala",
  "country": "Cameroon",
  "coordinates": {
    "lat": 4.0511,
    "lng": 9.7679
  },
  "shepherd": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+237..."
  },
  "meetingSchedule": {
    "day": "Saturday",
    "time": "17:00",
    "timezone": "Africa/Douala"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Douala Chapter",
    "status": "pending_approval",
    "syncStatus": {
      "lftcm": "synced",
      "vnftf": "synced"
    }
  }
}
```

---

### 2. Voice Notes

#### GET /api/v1/notes/latest

**Description:** Get latest voice note for LFTCM homepage preview

**Request:**
```http
GET /api/v1/notes/latest?limit=3
```

**Response:**
```json
{
  "success": true,
  "data": {
    "notes": [
      {
        "id": "uuid",
        "title": "Walking by Faith",
        "slug": "walking-by-faith-2026-03-18",
        "excerpt": "Faith is the substance of things hoped for...",
        "scripture": "Hebrews 11:1",
        "theme": "Faith",
        "duration": 420, // seconds
        "audioUrl": "https://cdn.vnftf.org/notes/uuid.mp3",
        "thumbnailUrl": "https://cdn.vnftf.org/thumbnails/uuid.jpg",
        "isLiveRecording": false,
        "publishedAt": "2026-03-18T06:00:00Z",
        "stats": {
          "plays": 1250,
          "downloads": 340,
          "shares": 89
        }
      }
    ]
  }
}
```

#### GET /api/v1/notes/{id}

**Description:** Get full voice note details

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Walking by Faith",
    "content": "Full transcript...",
    "audioUrl": "https://cdn.vnftf.org/notes/uuid.mp3",
    "transcript": "Full text transcript...",
    "duration": 420,
    "scripture": ["Hebrews 11:1", "Hebrews 11:6"],
    "themes": ["Faith", "Trust", "Obedience"],
    "emotionalTone": "Encouraging",
    "series": {
      "id": "uuid",
      "name": "Faith Foundations",
      "position": 3
    },
    "isLiveRecording": false,
    "publishedAt": "2026-03-18T06:00:00Z",
    "relatedNotes": [
      {
        "id": "uuid",
        "title": "Faith in Action",
        "thumbnailUrl": "..."
      }
    ]
  }
}
```

---

### 3. Giving Projects (Cross-Platform)

#### GET /api/v1/projects

**Description:** Get VNFTF giving projects for LFTCM integration

**Response:**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "uuid",
        "name": "Voice Notes Global Expansion",
        "description": "Expanding VNFTF to French-speaking Africa",
        "goal": 5000000, // XAF
        "raised": 3250000,
        "currency": "XAF",
        "imageUrl": "https://cdn.vnftf.org/projects/uuid.jpg",
        "progress": 65,
        "donors": 234,
        "endDate": "2026-12-31",
        "isActive": true,
        "platform": "vnftf",
        "lftcmProjectId": "uuid-or-null" // If linked to LFTCM project
      }
    ]
  }
}
```

#### POST /api/v1/projects/sync

**Description:** Sync giving project between platforms

**Request:**
```json
{
  "lftcmProjectId": "uuid",
  "vnftfProjectId": "uuid-or-null",
  "action": "create|update|unlink",
  "projectData": {
    "name": "Building Fund",
    "description": "New sanctuary construction",
    "goal": 100000000,
    "currency": "XAF",
    "imageUrl": "...",
    "endDate": "2027-12-31"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "syncId": "uuid",
    "lftcmProjectId": "uuid",
    "vnftfProjectId": "uuid",
    "status": "synced",
    "lastSyncedAt": "2026-03-18T10:30:00Z"
  }
}
```

---

### 4. Events

#### GET /api/v1/events

**Description:** Get VNFTF events for LFTCM calendar integration

**Response:**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "uuid",
        "title": "The Pilgrimage 2026",
        "description": "Annual gathering in Cameroon",
        "type": "CONFERENCE",
        "startDate": "2026-12-27T00:00:00Z",
        "endDate": "2026-12-30T23:59:59Z",
        "location": "Living Faith Tabernacle, Yaoundé",
        "isVirtual": false,
        "registrationUrl": "https://vnftf.org/events/pilgrimage-2026",
        "imageUrl": "https://cdn.vnftf.org/events/uuid.jpg",
        "platform": "vnftf",
        "lftcmEventId": "uuid-or-null"
      }
    ]
  }
}
```

---

### 5. User Data

#### GET /api/v1/users/{id}/profile

**Description:** Get VNFTF user profile (for LFTCM members who also use VNFTF)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "vnftfUserId": "uuid",
    "lftcmMemberId": "uuid",
    "subscriptionStatus": "active",
    "subscriptionType": "daily",
    "deliveryChannels": ["whatsapp", "email"],
    "joinedAt": "2025-06-15T00:00:00Z",
    "stats": {
      "notesReceived": 285,
      "notesOpened": 240,
      "prayerRequestsSent": 12,
      "givingHistory": [
        {
          "date": "2026-03-01",
          "amount": 50000,
          "currency": "XAF",
          "project": "General Support"
        }
      ]
    },
    "chapter": {
      "id": "uuid",
      "name": "Yaoundé Chapter",
      "role": "member"
    }
  }
}
```

---

### 6. Webhooks

#### VNFTF → LFTCM Webhooks

```typescript
// VNFTF sends webhooks to LFTCM for real-time updates

interface WebhookPayload {
  event: 'note.published' | 'note.updated' | 'chapter.created' | 'chapter.updated' |
         'project.updated' | 'user.joined' | 'user.left';
  timestamp: string;
  data: object;
  signature: string; // HMAC-SHA256
}

// Events:

// note.published
{
  "event": "note.published",
  "timestamp": "2026-03-18T06:00:00Z",
  "data": {
    "noteId": "uuid",
    "title": "Walking by Faith",
    "publishedAt": "2026-03-18T06:00:00Z",
    "isLiveRecording": false
  }
}

// chapter.created
{
  "event": "chapter.created",
  "timestamp": "2026-03-18T10:00:00Z",
  "data": {
    "chapterId": "uuid",
    "name": "Douala Chapter",
    "city": "Douala",
    "shepherd": { ... }
  }
}

// project.updated
{
  "event": "project.updated",
  "timestamp": "2026-03-18T12:00:00Z",
  "data": {
    "projectId": "uuid",
    "raised": 3500000,
    "newDonation": {
      "amount": 250000,
      "donor": "anonymous"
    }
  }
}
```

#### LFTCM → VNFTF Webhooks

```typescript
// LFTCM sends webhooks to VNFTF

// member.joined
{
  "event": "member.joined",
  "timestamp": "2026-03-18T14:00:00Z",
  "data": {
    "memberId": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "city": "Yaoundé",
    "interestedInVnftf": true
  }
}

// donation.received
{
  "event": "donation.received",
  "timestamp": "2026-03-18T15:00:00Z",
  "data": {
    "donationId": "uuid",
    "projectId": "uuid", // If linked to VNFTF project
    "amount": 100000,
    "currency": "XAF",
    "isAnonymous": false,
    "donorName": "Jane Smith"
  }
}
```

---

## Error Handling

### Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "specific field if applicable",
      "reason": "validation reason"
    }
  },
  "requestId": "uuid-for-tracing"
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or expired token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Invalid request data |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SYNC_FAILED` | 502 | Cross-platform sync failed |

---

## Rate Limits

- **Public endpoints:** 100 requests/minute
- **Authenticated endpoints:** 1000 requests/minute
- **Webhook endpoints:** 10,000 requests/minute

---

## Data Sync Strategy

### Real-time Sync (Webhooks)
- Chapter updates
- New voice note published
- Project progress updates
- User joins/leaves

### Scheduled Sync (Every 15 minutes)
- Chapter member counts
- Project totals
- Event updates

### Manual Sync (On-demand)
- Full chapter registry
- Historical giving data
- User profile linking

---

## Security

### Requirements
1. **HTTPS only** for all endpoints
2. **API Keys** stored securely (environment variables)
3. **JWT tokens** with short expiry (15 minutes)
4. **Webhook signatures** verified with HMAC-SHA256
5. **Rate limiting** enforced
6. **CORS** restricted to known origins

### Webhook Verification

```typescript
// Verify webhook signature
const verifyWebhook = (payload: string, signature: string, secret: string): boolean => {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
};
```

---

## Implementation Checklist

### LFTCM Side
- [ ] API client with retry logic
- [ ] Webhook endpoint with signature verification
- [ ] Token refresh mechanism
- [ ] Cache layer for frequently accessed data
- [ ] Error handling and fallback UI

### VNFTF Side
- [ ] API endpoints implementation
- [ ] Webhook delivery system
- [ ] Rate limiting
- [ ] Authentication middleware
- [ ] Documentation

---

## Contact

**LFTCM Technical Team:** tech@lftcm.org
**VNFTF Technical Team:** tech@vnftf.org

---

*This contract is a living document. Changes require mutual agreement and version bump.*
