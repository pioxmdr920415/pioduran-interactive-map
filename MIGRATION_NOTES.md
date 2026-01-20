# Project Restructuring - Migration Notes

**Date:** January 20, 2025 (Updated: Current)

## Changes Made

### Directory Structure
- **Structure:** Files are in `/app/frontend/` subdirectory (required by supervisor configuration)
- **Status:** Frontend application fully operational

### Files in /app/frontend/
- `src/` - Source code directory
- `public/` - Static assets
- `node_modules/` - Dependencies
- `package.json` - Project dependencies
- `yarn.lock` - Dependency lock file
- `.env` - Environment variables
- Configuration files:
  - `craco.config.js`
  - `tailwind.config.js`
  - `postcss.config.js`
  - `jsconfig.json`
  - `components.json`
- `plugins/` - Plugin directory

### Service Status
✅ Frontend: Running on port 3000 from `/app/frontend`
❌ Backend: Not used (removed per project requirements)
✅ MongoDB: Running (not currently used)

## Current Project Structure

```
/app/
├── frontend/              # Frontend application
│   ├── src/              # React source code
│   ├── public/           # Static files
│   ├── plugins/          # Plugins
│   ├── node_modules/     # Dependencies
│   ├── package.json      # Dependencies
│   ├── yarn.lock         # Lock file
│   ├── .env              # Environment config
│   ├── craco.config.js   # Build config
│   ├── tailwind.config.js # Tailwind config
│   ├── postcss.config.js # PostCSS config
│   ├── jsconfig.json     # JS config
│   └── components.json   # Components config
├── test_reports/         # Test results
├── tests/                # Test files
├── README.md             # Documentation
├── STYLE_FEATURES.md     # Style documentation
└── test_result.md        # Test results
```

## Commands
All commands run from `/app/frontend` directory:
- `cd /app/frontend && yarn install` - Install dependencies
- `cd /app/frontend && yarn start` - Start development server
- `cd /app/frontend && yarn build` - Build for production

Or use supervisor:
- `sudo supervisorctl restart frontend` - Restart frontend service
- `sudo supervisorctl status` - Check service status
