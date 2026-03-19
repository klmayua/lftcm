# LFTCM ChurchOS
## Living Faith Tabernacle Cameroon - Church Operating System

**Version:** 1.0.0
**Status:** Foundation + Admin Dashboard Complete

---

## Project Overview

A comprehensive Church ERP system built for Living Faith Tabernacle Cameroon, featuring:

- **Public Website:** Mobile-first design with sacred visual identity
- **Admin Dashboard:** Complete church management interface
- **VNFTF Integration:** Bridge to Voice Notes From The Father ministry
- **Multi-Branch Support:** Architecture for 7 branches with Yaoundé as main
- **School Module:** Living Bilingual Nursery and Primary School management
- **Full ERP:** Accounting (OHADA), HR, Payroll, Inventory, Facilities

---

## Architecture

```
LFTCM/
├── apps/
│   ├── web/                    # Next.js 15 public website (Port 3000)
│   └── admin/                  # Next.js 15 admin dashboard (Port 3001)
├── packages/
│   ├── design-system/          # Sacred colors, typography, tokens
│   └── database/               # Prisma schema (complete ERP)
└── docs/
    └── VNFTF-API-CONTRACT.md   # Integration specification
```

---

## Applications

### 1. Public Website (`apps/web/`)

**Features:**
- Mobile-first responsive design
- Bottom navigation for mobile users
- Hero section with Altar Glow effect
- Welcome/About section
- Service times display
- Latest sermons preview
- Upcoming events
- VNFTF integration preview
- Give section with MTN/Orange Money
- Footer with social links

**Pages:**
- `/` - Homepage
- `/about` - About Us
- `/sermons` - Sermon archive
- `/events` - Events calendar
- `/give` - Online giving
- `/branches` - Branch locations
- `/contact` - Contact form

### 2. Admin Dashboard (`apps/admin/`)

**Features:**
- Sidebar navigation with module organization
- Dashboard with stats overview
- Quick actions for common tasks
- Recent activity feed
- Member management (CRUD)
- Responsive design for tablet/desktop

**Pages:**
- `/` - Dashboard overview
- `/people` - Member management
- `/services` - Service planning
- `/sermons` - Sermon management
- `/events` - Event management
- `/giving` - Donation tracking
- `/prayer` - Prayer requests
- `/hr` - HR & Payroll
- `/accounting` - Financial management
- `/school` - School management
- `/facilities` - Room & asset management
- `/inventory` - Stock management
- `/vnftf` - VNFTF integration
- `/settings` - System settings

---

## Design System

### Sacred Colors (from official logo)
- **Gold Divine:** `#D4AF37` - Primary authority color
- **Gold Light:** `#F5D77A` - Highlights
- **Gold Deep:** `#A67C00` - Depth
- **Cross Red:** `#8B0000` - Emphasis
- **Flame Orange:** `#FF8C00` - Energy
- **Holy Green:** `#0B6623` - Stability
- **Authority Black:** `#0A0A0A` - Foundation

### Typography
- **Headings:** Playfair Display (serif) - Proclamations
- **Body:** Inter (sans-serif) - Readability
- **Accent:** Cinzel - Scripture, banners

### Mobile-First
- Bottom navigation for mobile users
- Touch targets minimum 48px
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

---

## Database Modules

### Implemented
1. **Core** - Organizations, Users, Auth, Audit
2. **People** - Members, Families, Groups, Attendance
3. **Worship** - Services, Songs, Teams
4. **Word** - Sermons, Series
5. **Give** - Donations, Projects (MTN/Orange Money)
6. **Events** - Event management, Registration
7. **Prayer** - Prayer requests, Prayer team
8. **HR** - Employees, Leave, Cameroon payroll
9. **Accounting** - OHADA-compliant chart of accounts
10. **Inventory** - Stock management
11. **Facilities** - Rooms, Assets, Maintenance
12. **School** - Living Bilingual School (Students, Fees, Grades)

### Cameroon-Specific Features
- **Payroll:** CNPS contributions, CRTV tax, IRPP
- **Accounting:** OHADA chart of accounts (Classes 1-9)
- **Payments:** MTN Mobile Money, Orange Money integration
- **Language:** English/French support ready

---

## VNFTF Integration

The Voice Notes From The Father platform is an independent ministry arm with:

- **Shared Chapter Registry:** Both platforms use same chapter data
- **Bidirectional Sync:** Real-time webhooks for updates
- **Cross-Promotion:** LFTCM shows VNFTF content, VNFTF shows LFTCM events
- **Unified Giving:** Projects can be linked across platforms

See `docs/VNFTF-API-CONTRACT.md` for complete API specification.

---

## ID Card System

ID number generation implemented with format: `LFT-YYYY-XXXX`

- Member IDs
- Employee IDs
- Student IDs (for school)

Printer integration prepared but not implemented (per requirements).

---

## Branch Architecture

### Main Branch (Yaoundé)
- Full implementation
- Central hub for all operations

### Other Branches (Placeholders)
- Ebolowa (Head Church)
- Mfou
- Kribi
- Ambam
- Mengong
- Mbanga

Each branch can have:
- Subdomain: `branchname.lftcm.org`
- Local admin access
- Synchronized data with central

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL (Supabase recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
cd LFTCM

# Install dependencies
npm install

# Set up environment variables
cp apps/web/.env.example apps/web/.env
cp apps/admin/.env.example apps/admin/.env

# Configure your environment variables
# - Database URL
# - Supabase credentials
# - API keys

# Generate Prisma client
cd packages/database && npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed
```

### Development

```bash
# Run both apps simultaneously
npm run dev

# Or run individually:
# Public website
cd apps/web && npm run dev

# Admin dashboard
cd apps/admin && npm run dev
```

### Building for Production

```bash
# Build all apps
npm run build

# Build individual apps:
cd apps/web && npm run build
cd apps/admin && npm run build
```

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS 4, Framer Motion |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Auth | Supabase Auth |
| Payments | Flutterwave (MTN/Orange) |
| Hosting | Vercel |

---

## Project Status

### ✅ Completed
- [x] Design system with sacred colors
- [x] Database schema (all modules)
- [x] Public website (mobile-first)
- [x] Admin dashboard foundation
- [x] VNFTF API contract
- [x] Member management UI
- [x] Responsive layouts

### 🚧 In Progress
- [ ] Authentication implementation
- [ ] API routes
- [ ] Database connection
- [ ] Payment integration

### 📋 Planned
- [ ] Sermon upload/management
- [ ] Event creation workflow
- [ ] Payroll processing
- [ ] Accounting reports
- [ ] School portal
- [ ] VNFTF bridge implementation
- [ ] Mobile app (PWA)

---

## Environment Variables

### Web App (`apps/web/.env`)
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=
```

### Admin App (`apps/admin/.env`)
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
```

---

## Scripts

```bash
# Development
npm run dev          # Start all apps
npm run build        # Build all apps
npm run lint         # Lint all apps

# Database
cd packages/database
npx prisma generate  # Generate Prisma client
npx prisma migrate dev    # Run migrations
npx prisma studio         # Open Prisma Studio
npx prisma db seed        # Seed database
```

---

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

---

## Support

**Living Faith Tabernacle Cameroon**
- Pastor: Kaben Vincent
- Location: Yaoundé, Cameroon
- Branches: 7 locations

---

*Soli Deo Gloria*
