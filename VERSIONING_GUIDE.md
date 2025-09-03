# Role-Based Versioning System Guide

## Overview

The Job Align Project implements a comprehensive role-based versioning system that allows you to maintain separate, versioned resumes for different career roles while tracking generation history and metadata.

## System Architecture

### Core Components

1. **Role Configuration (`config/roles.json`)**
   - Defines available roles with codes, names, descriptions
   - Maps roles to their corresponding JSON resume files
   - Sets default theme and output directory

2. **Version Tracking (`config/versions.json`)**
   - Maintains version counters for each role
   - Tracks generation timestamps and totals
   - Stores system metadata

3. **Resume Generator (`scripts/generate-role-resume.js`)**
   - Main script for generating versioned resumes
   - Handles version incrementing and file naming
   - Passes role/version metadata to themes

4. **Enhanced Theme Integration**
   - Modified `jsonresume-theme-react-tailwind` to accept role/version metadata
   - Embeds versioning information as HTML comments
   - Maintains theme compatibility

## Configuration Details

### Role Configuration Structure

```json
{
  "roles": {
    "PM": {
      "code": "PM",
      "name": "Product Manager",
      "sourceFile": "data/resume/${USERNAME}_pm_resume.json",
      "description": "Strategic product management focused on user experience..."
    }
  },
  "defaultTheme": "jsonresume-theme-react-tailwind",
  "outputDir": "outputs"
}
```

### Version Tracking Structure

```json
{
  "versions": {
    "PM": {
      "current": 3,
      "lastGenerated": "2025-08-26T02:41:39.916Z",
      "totalGenerated": 3
    }
  },
  "meta": {
    "lastUpdated": "2025-08-26T02:41:39.918Z",
    "format": "${FIRST_NAME}${LAST_NAME}_[ROLE]_v[000]"
  }
}
```

## Usage Patterns

### Basic Generation
```bash
# Generate Full Stack Engineer resume (increments FSE version)
npm run build:fse

# Generate Product Manager resume (increments PM version)
npm run build:pm
```

### Advanced Generation
```bash
# Generate with specific theme
node scripts/generate-role-resume.js FSE jsonresume-theme-even

# Generate to custom directory
node scripts/generate-role-resume.js PM jsonresume-theme-react-tailwind ./custom-output

# Show available roles and current versions
node scripts/generate-role-resume.js help
```

### Batch Operations
```bash
# Generate all role resumes (increments all versions)
npm run build:all-roles
```

## Version Management

### Automatic Incrementing
- Each generation automatically increments the role's version counter
- Versions start at 1 for first generation
- No manual version management required
- Previous versions are never overwritten

### File Naming Convention
- Format: `${FIRST_NAME}${LAST_NAME}_[ROLE]_v[000].html`
- Zero-padded version numbers (001, 002, 003...)
- Consistent naming across all roles

Examples:
- `${FIRST_NAME}${LAST_NAME}_FSE_v001.html` (First Full Stack Engineer version)
- `${FIRST_NAME}${LAST_NAME}_PM_v005.html` (Fifth Product Manager version)
- `${FIRST_NAME}${LAST_NAME}_DPM_v001.html` (First Data Product Manager version)

### Version History
The system maintains comprehensive history:
- **Current version**: Latest generated version number
- **Last generated**: ISO timestamp of last generation
- **Total generated**: Running count of all generations
- **System metadata**: Last update time and filename format

## Theme Integration

### Enhanced React-Tailwind Theme
The modified theme accepts options with role and version information and includes several enhancements:

**Features:**
- **Summary Section**: Automatically displays `basics.summary` when present
- **Projects Section**: Full project support with dates, technologies, highlights, and roles
- **Conditional Rendering**: Sections only appear when data exists
- **Enhanced Styling**: Improved typography and spacing
- **Role/Version Metadata**: Embedded in HTML comments

```javascript
const themeOptions = {
  role: {
    code: 'FSE',
    name: 'Full Stack Engineer',
    description: 'Full-stack development with modern web technologies...'
  },
  version: {
    current: 2,
    lastGenerated: '2025-08-26T02:43:19.641Z',
    totalGenerated: 2
  }
};

const html = themeModule.render(resumeData, themeOptions);
```

**Supported JSON Resume Fields:**
- `basics.summary` - Displayed in About section
- `projects[]` - Full project section with:
  - Project name and URL
  - Date ranges (start/end dates)
  - Description and highlights
  - Keywords/technologies
  - Roles and entity information

### Embedded Metadata
Generated HTML includes versioning comments in the head section:

```html
<!-- Generated with jsonresume-theme-react-tailwind v2.0.0-role-based -->
<!-- Generated on: 2025-08-26T02:43:19.663Z -->
<!-- Role: Full Stack Engineer (FSE) -->
<!-- Version: v002 | Generated: 2025-08-26T02:43:19.641Z -->
```

## Development and Customization

### Adding New Roles
1. **Update role configuration**:
   ```json
   "NEWROLE": {
     "code": "NEWROLE",
     "name": "New Role Name",
     "sourceFile": "data/resume/${USERNAME}_newrole_resume.json",
     "description": "Description of the new role..."
   }
   ```

2. **Create resume JSON file**:
   - Follow JSON Resume schema
   - Place in `data/resume/${USERNAME}_newrole_resume.json`
   - Tailor content for the specific role

3. **Add npm script**:
   ```json
   "build:newrole": "node scripts/generate-role-resume.js NEWROLE"
   ```

4. **Version tracking is automatic** - no manual setup needed

### Customizing Themes
1. **Install new theme**:
   ```bash
   npm install jsonresume-theme-[name]
   ```

2. **Update default theme** in `config/roles.json` or specify when generating:
   ```bash
   node scripts/generate-role-resume.js FSE jsonresume-theme-[name]
   ```

3. **For versioning support**, themes need to:
   - Accept options parameter in render function
   - Check for `options.role` and `options.version`
   - Embed metadata as desired (HTML comments, headers, etc.)

### Version Reset (Advanced)
To reset versions for a role, manually edit `config/versions.json`:

```json
"ROLE": {
  "current": 0,
  "lastGenerated": null,
  "totalGenerated": 0
}
```

**Warning**: This doesn't delete existing generated files, only resets the counter.

## Troubleshooting

### Common Issues

1. **"Invalid role code" error**
   - Check available roles with `node scripts/generate-role-resume.js help`
   - Ensure role exists in `config/roles.json`

2. **"Resume source file not found"**
   - Verify the sourceFile path in role configuration
   - Ensure JSON resume file exists at specified location

3. **Theme not found**
   - Install theme with `npm install jsonresume-theme-[name]`
   - Check theme name spelling

4. **Version tracking issues**
   - Ensure `config/versions.json` is writable
   - Check file permissions
   - Verify JSON syntax if manually edited

### Debug Mode
For troubleshooting, you can inspect the configuration:

```bash
# Show current versions
cat config/versions.json | jq '.versions'

# Show role configurations
cat config/roles.json | jq '.roles'

# List generated files
ls -la outputs/username_*
```

## Best Practices

### Resume Management
1. **Keep role-specific content** in separate JSON files
2. **Regular generations** to test changes
3. **Descriptive commit messages** when updating resume content
4. **Backup version configurations** before major changes

### Version Control
1. **Commit configuration changes** (`config/*.json`)
2. **Don't commit generated HTML files** (add `outputs/` to `.gitignore`)
3. **Version resume JSON files** to track content changes
4. **Tag releases** when creating final versions for job applications

### File Organization
1. **Keep outputs directory clean** by periodically archiving old versions
2. **Use consistent naming** for resume JSON files
3. **Document role-specific customizations** in commit messages
4. **Maintain role descriptions** for future reference

## Migration from Previous Systems

If migrating from timestamp-based versioning:
1. **Backup existing files**
2. **Update theme** to new version (if using custom themes)
3. **Run initial generation** to establish version baselines
4. **Archive old files** with timestamp naming

The new system is designed to coexist with existing files while providing better organization and tracking going forward.
