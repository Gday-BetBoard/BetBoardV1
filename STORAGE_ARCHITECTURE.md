# BetBoard Data Storage Architecture & Uplift Plan

## Current State Analysis

### Local Development (Current Issues)
- ❌ **No Persistence**: All data lost on page refresh
- ❌ **Static Data**: Initial data loaded from `src/data/bets.json`
- ❌ **React Context Only**: No localStorage or proper state management
- ❌ **No Offline Support**: No handling of network failures
- ❌ **Mock API**: API service exists but not implemented

### Production (Current Issues)
- ❌ **Same as Local**: No backend database
- ❌ **Static Build**: Served from `build/` directory only
- ❌ **No Multi-user Support**: No user authentication/authorization
- ❌ **No Real-time Updates**: No synchronization between users

## Recommended Uplift Strategy

### Phase 1: Client-Side Improvements (Immediate - 1-2 days)

#### ✅ Local Storage Persistence
- **Implemented**: Zustand store with localStorage persistence
- **File**: `src/store/betStore.ts`
- **Benefits**: Data survives page refresh, better performance
- **Impact**: Solves immediate data loss issue

#### ✅ Enhanced API Service
- **Implemented**: Offline-first API service with queue management
- **Files**: `src/services/enhancedApiService.ts`, `src/services/apiConfig.ts`
- **Features**:
  - Offline mode with action queuing
  - Automatic sync when back online
  - Environment-specific configuration
  - Proper error handling

#### 🔄 State Management Migration
- **Action Required**: Update components to use new Zustand store
- **Files to Update**: 
  - `src/App.tsx`
  - `src/components/BetEditor.tsx`
  - `src/hooks/useBets.ts`

### Phase 2: Backend Infrastructure (1-2 weeks)

#### 🎯 Database Setup
```sql
-- PostgreSQL Schema
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id),
  what TEXT NOT NULL,
  why TEXT NOT NULL,
  how TEXT NOT NULL,
  when_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'Open',
  priority VARCHAR(50) DEFAULT 'Medium',
  tags TEXT[],
  assignee_ids UUID[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bet_id UUID REFERENCES bets(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id),
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 🎯 API Endpoints
```typescript
// Backend API Structure
GET    /api/bets              // List all bets
POST   /api/bets              // Create new bet
GET    /api/bets/:id          // Get specific bet
PUT    /api/bets/:id          // Update bet
DELETE /api/bets/:id          // Delete bet
POST   /api/bets/:id/comments // Add comment

GET    /api/users             // List users
POST   /api/users             // Create user
GET    /api/users/me          // Current user profile

POST   /api/auth/login        // User authentication
POST   /api/auth/logout       // User logout
POST   /api/auth/refresh      // Refresh token
```

### Phase 3: Real-time & Advanced Features (2-3 weeks)

#### 🎯 WebSocket Integration
- Real-time updates when other users edit bets
- Live comment notifications
- Status change broadcasts

#### 🎯 Advanced Persistence
- Optimistic updates with conflict resolution
- Data versioning and history
- Backup and restore functionality

## Environment Configuration

### Local Development
```bash
# .env.local
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENABLE_OFFLINE_MODE=true
NODE_ENV=development
```

### Production
```bash
# .env.production
REACT_APP_API_URL=https://api.betboard.com/api
REACT_APP_ENABLE_REAL_TIME_SYNC=true
REACT_APP_ENABLE_ANALYTICS=true
NODE_ENV=production
```

## Migration Steps

### Step 1: Update Components (Today)
1. Replace React Context with Zustand store
2. Update import statements
3. Test localStorage persistence

### Step 2: API Integration (This Week)
1. Configure environment variables
2. Update API service calls
3. Implement error handling

### Step 3: Backend Development (Next 1-2 Weeks)
1. Set up Node.js/Express backend
2. Configure PostgreSQL database
3. Implement authentication
4. Deploy to production

## Benefits After Uplift

### Immediate (Phase 1)
- ✅ Data persistence across sessions
- ✅ Offline editing capability
- ✅ Better error handling
- ✅ Performance improvements

### Medium-term (Phase 2)
- ✅ Multi-user collaboration
- ✅ Proper data backup
- ✅ Scalable architecture
- ✅ User authentication

### Long-term (Phase 3)
- ✅ Real-time collaboration
- ✅ Advanced analytics
- ✅ Mobile app support
- ✅ Enterprise features

## Risk Mitigation

1. **Data Loss Prevention**: Automatic backups and versioning
2. **Offline Reliability**: Robust queue management and sync
3. **Scalability**: Database indexing and caching strategies
4. **Security**: JWT authentication and input validation

## Next Actions

1. **Immediate**: Test new localStorage implementation
2. **This Week**: Set up environment variables and backend skeleton
3. **Next Week**: Implement full API endpoints
4. **Following Week**: Deploy and test production environment 