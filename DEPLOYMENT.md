# Deployment Guide — Personal Research Portfolio Platform

## Prerequisites

Before deploying, ensure you have:

1. **PostgreSQL Database**
   - Managed PostgreSQL instance (recommended: Supabase, Neon, Railway, or AWS RDS)
   - Database URL with connection pooling enabled

2. **S3-Compatible Object Storage**
   - AWS S3, Supabase Storage, Cloudflare R2, or compatible service
   - Bucket created with public read access for public assets
   - Access credentials (Access Key ID + Secret Access Key)

3. **Vercel Account** (or alternative Next.js host)

---

## 1. Database Setup

### Option A: Supabase (Recommended)

1. Create project at [supabase.com](https://supabase.com)
2. Navigate to Project Settings → Database
3. Copy the "Connection pooling" URI (Transaction mode)
4. Note: Supabase provides both PostgreSQL AND object storage

### Option B: Neon

1. Create project at [neon.tech](https://neon.tech)
2. Copy the connection string
3. Append `?pgbouncer=true` for pooling

### Option C: Railway

1. Create project at [railway.app](https://railway.app)
2. Add PostgreSQL service
3. Copy the DATABASE_URL from environment variables

---

## 2. Object Storage Setup

### Option A: Supabase Storage (If using Supabase for DB)

1. Navigate to Storage in Supabase dashboard
2. Create new bucket: `portfolio-media`
3. Set bucket to public or use signed URLs
4. Get credentials:
   ```
   S3_ENDPOINT: https://<project-ref>.supabase.co/storage/v1/s3
   S3_REGION: auto
   S3_BUCKET: portfolio-media
   S3_ACCESS_KEY: <from API settings>
   S3_SECRET_KEY: <from API settings>
   ```

### Option B: AWS S3

1. Create S3 bucket in AWS Console
2. Configure CORS policy:
   ```json
   [
     {
       "AllowedOrigins": ["https://yourdomain.com"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedHeaders": ["*"]
     }
   ]
   ```
3. Create IAM user with S3 access
4. Get credentials:
   ```
   S3_ENDPOINT: (leave empty for AWS default)
   S3_REGION: us-east-1 (or your region)
   S3_BUCKET: your-bucket-name
   S3_ACCESS_KEY: <IAM access key>
   S3_SECRET_KEY: <IAM secret key>
   ```

### Option C: Cloudflare R2

1. Create R2 bucket in Cloudflare dashboard
2. Generate API token
3. Get credentials:
   ```
   S3_ENDPOINT: https://<account-id>.r2.cloudflarestorage.com
   S3_REGION: auto
   S3_BUCKET: your-bucket-name
   S3_ACCESS_KEY: <R2 access key>
   S3_SECRET_KEY: <R2 secret key>
   ```

---

## 3. Environment Variables

Create a `.env` file (or configure in Vercel dashboard):

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname?pgbouncer=true"

# NextAuth
NEXTAUTH_SECRET="<generate-with: openssl rand -base64 32>"
NEXTAUTH_URL="https://yourdomain.com"

# Object Storage
S3_ENDPOINT="https://your-endpoint"
S3_REGION="auto"
S3_BUCKET="your-bucket-name"
S3_ACCESS_KEY="your-access-key"
S3_SECRET_KEY="your-secret-key"
S3_PUBLIC_URL="https://your-public-cdn-url"  # Optional

# Admin Credentials (for initial setup only)
ADMIN_EMAIL="your-email@example.com"
ADMIN_PASSWORD="secure-password-here"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

## 4. Deploy to Vercel

### Initial Deployment

1. **Install Vercel CLI** (optional but recommended):
   ```bash
   npm i -g vercel
   ```

2. **Connect Repository:**
   - Push code to GitHub/GitLab/Bitbucket
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository

3. **Configure Environment Variables:**
   - In Vercel dashboard: Project Settings → Environment Variables
   - Add all variables from `.env` above
   - Mark `NEXTAUTH_SECRET`, `S3_SECRET_KEY`, `ADMIN_PASSWORD` as "Sensitive"

4. **Deploy:**
   - Vercel auto-deploys on every push to main branch
   - Or manually: `vercel --prod`

### Database Migration

**IMPORTANT:** Run migrations BEFORE first deployment or immediately after:

```bash
# Option 1: From local machine
DATABASE_URL="your-production-db-url" npx prisma migrate deploy

# Option 2: Via Vercel CLI
vercel env pull .env.production
npx prisma migrate deploy
```

---

## 5. Initial Setup

### Create Admin User

After first deployment:

```bash
# Option 1: Use the seed script (create one)
npm run seed:user

# Option 2: Manually via Prisma Studio
npx prisma studio
# Add User with hashed password (use bcryptjs)

# Option 3: Via SQL
# Connect to database and run:
INSERT INTO "User" (id, email, password, name, "createdAt", "updatedAt")
VALUES (
  'admin-user-id',
  'your-email@example.com',
  '<bcrypt-hashed-password>',
  'Your Name',
  NOW(),
  NOW()
);
```

**Generate bcrypt hash locally:**
```javascript
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('your-password', 10);
console.log(hash);
```

### Create Profile

Login to `/admin` and create your profile, or via Prisma Studio:

```sql
INSERT INTO "Profile" (
  id, name, tagline, bio, "currentRole", "currentFocus",
  location, "linkedinUrl", email, "createdAt", "updatedAt"
)
VALUES (
  'profile-id',
  'Your Name',
  'Your tagline',
  'Your bio',
  'Your Current Role',
  ARRAY['Focus Area 1', 'Focus Area 2'],
  'Your Location',
  'https://linkedin.com/in/yourprofile',
  'your-email@example.com',
  NOW(),
  NOW()
);
```

---

## 6. Post-Deployment Checklist

- [ ] Database migrations applied successfully
- [ ] Admin user created and can login at `/login`
- [ ] Profile created (check homepage displays correctly)
- [ ] Object storage working (upload test file in `/admin/media`)
- [ ] Public pages load correctly (homepage, /work, /journal, /about)
- [ ] Private content NOT visible to unauthenticated users
- [ ] Mobile responsive design working
- [ ] Dark mode toggle working
- [ ] Search functionality working (Cmd+K)

---

## 7. Domain Configuration

### Custom Domain

1. In Vercel dashboard: Project Settings → Domains
2. Add your domain
3. Configure DNS:
   ```
   Type: CNAME
   Name: @ (or subdomain)
   Value: cname.vercel-dns.com
   ```
4. Update `NEXTAUTH_URL` environment variable to your domain

### SSL Certificate

Vercel handles SSL automatically via Let's Encrypt.

---

## 8. Maintenance

### Database Backups

- **Supabase:** Automatic daily backups (Point-in-Time Recovery available)
- **Neon:** Automatic continuous backup
- **Railway:** Manual backup via dashboard
- **AWS RDS:** Configure automated backups

### Media Storage Costs

Monitor storage usage:
- Supabase: Free tier 1GB, then $0.021/GB
- AWS S3: ~$0.023/GB/month
- Cloudflare R2: Free tier 10GB, then $0.015/GB

### Analytics (Optional)

Consider adding:
- Vercel Analytics (built-in)
- Plausible Analytics (privacy-focused)
- Google Analytics

---

## 9. Troubleshooting

### Database Connection Errors

```
Error: P1001: Can't reach database server
```
**Solution:** Ensure DATABASE_URL includes `?pgbouncer=true` for connection pooling

### Media Upload Fails

```
Error: S3_BUCKET environment variable not configured
```
**Solution:** Verify all S3_* environment variables are set in Vercel

### Build Fails on Vercel

```
Error: Cannot find module '@prisma/client'
```
**Solution:** Ensure `postinstall` script runs Prisma generate:
```json
"scripts": {
  "postinstall": "prisma generate"
}
```

### NextAuth Session Issues

```
Error: [next-auth][error][JWT_SESSION_ERROR]
```
**Solution:** 
1. Verify `NEXTAUTH_SECRET` is set
2. Ensure `NEXTAUTH_URL` matches your domain
3. Clear browser cookies and try again

---

## 10. Security Checklist

Before going live:

- [ ] Change default admin password
- [ ] Remove `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars after initial setup
- [ ] Enable HTTPS only (Vercel does this automatically)
- [ ] Configure S3 bucket policies (restrict public write access)
- [ ] Set up database connection limits
- [ ] Review Prisma query logs (remove in production)
- [ ] Enable rate limiting (consider Vercel Edge Config)
- [ ] Set up monitoring and alerts

---

## Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Prisma Production Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
- [NextAuth.js Deployment Guide](https://next-auth.js.org/deployment)
- [Vercel Documentation](https://vercel.com/docs)

---

**Questions?** Check `ARCHITECTURE.md` for technical details about the system design.
