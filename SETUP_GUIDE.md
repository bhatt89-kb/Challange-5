# 🚀 Setup Guide - GenAI Event Planner

## Quick Setup (Windows)

### Method 1: Using Setup Scripts (EASIEST)

```bash
# 1. Run the setup script
setup.bat

# 2. Edit .env file and add your API key
# Open .env in notepad and add:
# GEMINI_API_KEY=your_actual_key_here

# 3. Start the development server
run-dev.bat

# 4. Open your browser
# Go to: http://localhost:3000
```

### Method 2: Manual Setup

```bash
# 1. Clean install
npm install

# 2. Create environment file
copy .env.example .env

# 3. Edit .env and add your GEMINI_API_KEY
notepad .env

# 4. Run development server
npm run dev

# 5. Open browser to http://localhost:3000
```

## 🔑 Getting Your API Key

1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key
5. Paste it in your `.env` file:
   ```
   GEMINI_API_KEY=your_key_here
   ```

## 🐛 Troubleshooting

### Issue: "npm install" is slow or hanging

**Solution 1: Clear npm cache**
```bash
npm cache clean --force
npm install
```

**Solution 2: Use a different registry**
```bash
npm config set registry https://registry.npmjs.org/
npm install
```

**Solution 3: Install without optional dependencies**
```bash
npm install --no-optional
```

### Issue: "'next' is not recognized"

**Cause:** Installation incomplete or corrupted

**Solution:**
```bash
# Clean and reinstall
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Issue: Port 3000 already in use

**Solution 1: Use different port**
```bash
set PORT=3001
npm run dev
```

**Solution 2: Kill process on port 3000**
```bash
netstat -ano | findstr :3000
# Find the PID (last column)
taskkill /F /PID [PID_NUMBER]
```

### Issue: "Cannot find module 'next'"

**Solution:**
```bash
# Reinstall Next.js specifically
npm install next@14.2.18 --save
```

### Issue: TypeScript errors

**Solution:**
```bash
# Check TypeScript
npm run type-check

# If errors, reinstall TypeScript
npm install typescript@5.6.3 --save-dev
```

### Issue: Build fails

**Solution:**
```bash
# Run checks to find the issue
npm run lint        # Check for linting errors
npm run type-check  # Check for TypeScript errors
npm test            # Run tests

# Then build again
npm run build
```

## ✅ Verify Installation

After setup, verify everything works:

```bash
# Run all checks
npm run ci

# This will run:
# ✓ ESLint
# ✓ TypeScript check
# ✓ Tests (85 tests)
# ✓ Build
```

## 📦 What Gets Installed

The project installs these main packages:
- **next** (14.2.18) - Framework
- **react** (18.3.1) - UI library
- **typescript** (5.6.3) - Language
- **@google/generative-ai** (0.21.0) - Gemini AI
- **zod** (3.23.8) - Validation
- **vitest** (2.1.5) - Testing

Total install size: ~500MB in node_modules

## 🚀 Running the Project

### Development Mode
```bash
npm run dev
```
- Hot reload enabled
- Opens on http://localhost:3000
- Detailed error messages

### Production Mode
```bash
# Build first
npm run build

# Then start
npm start
```
- Optimized performance
- Minified code
- Production ready

### Testing
```bash
# Run all tests
npm test

# Run in watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

### Linting & Type Checking
```bash
# Check code quality
npm run lint

# Check types
npm run type-check

# Run all checks
npm run ci
```

## 🌐 Accessing the Application

Once running:
1. **Open browser** to http://localhost:3000
2. **Choose event type** (Wedding, Birthday, or Community)
3. **Fill in details** (name, date, location, budget, guests)
4. **Generate plan** with AI
5. **Refine with chat** if needed
6. **Switch language** (English ⇄ Hindi) anytime

## 📁 Important Files

```
.env                    # Your API key (NEVER commit this!)
.env.example           # Template for .env
package.json           # Dependencies and scripts
next.config.js         # Next.js configuration
tsconfig.json          # TypeScript configuration
```

## 🔒 Security Note

**NEVER commit your `.env` file!**

Your `.env` contains sensitive API keys. The file is already in `.gitignore`.

## 📚 Additional Help

- **README.md** - Full documentation
- **QUICK_REFERENCE.md** - Quick commands
- **COMPLETE_SUMMARY.md** - Project overview
- **FINAL_SCORE.md** - Quality metrics

## 💡 Tips

1. **First time?** Use `setup.bat` - it's the easiest
2. **API Key** is required - get it from Google AI Studio
3. **Port 3000** must be available
4. **Internet required** for AI features (has offline fallback)
5. **Node.js 18+** is required

## 🎉 Success!

If you see:
```
✓ Ready in 3.2s
○ Local: http://localhost:3000
```

Congratulations! The project is running successfully! 🚀

Open http://localhost:3000 in your browser and start planning events with AI!
