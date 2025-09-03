# Job Align Project

A structured approach to managing your resume data and generating job-aligned outputs using JSON Resume format with role-based versioning system.

## Project Structure

```
job-align-project/
├── config/
│   ├── roles.json        # Role definitions and configurations
│   └── versions.json     # Version tracking for each role
├── data/
│   └── resume/           # Role-specific resume data
│       ├── jimmy_pm_resume.json      # Product Manager
│       ├── jimmy_fse_resume.json     # Full Stack Engineer
│       ├── jimmy_dpm_resume.json     # Data Product Manager
│       ├── jimmy_tpm_resume.json     # Technical Product Manager
│       ├── jimmy_proj_resume.json    # Project Manager
│       ├── jimmy_sys_resume.json     # Systems Engineer
│       ├── jimmy_plat_resume.json    # Platform Engineer
│       ├── jimmy_sale_resume.json    # Sales Engineer
│       ├── jimmy_cs_resume.json      # Customer Success Manager
│       └── jimmy_da_resume.json      # Data Analyst
├── scripts/
│   ├── generate-role-resume.js       # Main generator script
│   └── generate-missing-resumes.js   # Utility to create missing variants
├── outputs/              # Generated versioned resumes
├── node_modules/         # Installed packages
└── package.json          # Project dependencies and scripts
```

## Role-Based Versioning System

This project implements a sophisticated role-based versioning system that:

- **Tracks versions per role**: Each role (PM, FSE, DPM, etc.) has its own version counter
- **Generates consistent filenames**: Format is `JimmyLauChoy_[ROLE]_v[000].html`
- **Embeds metadata**: HTML includes role, version, and generation timestamp comments
- **Maintains history**: Tracks total generations and last modified dates

### Available Roles

| Code | Role Name | Description |
|------|-----------|-------------|
| PM | Product Manager | Strategic product management focused on user experience |
| DPM | Data Product Manager | Data-driven product management with analytics expertise |
| TPM | Technical Product Manager | Technical PM bridging engineering and business |
| PROJ | Project Manager | Project management with delivery excellence focus |
| FSE | Full Stack Engineer | Full-stack development with modern web technologies |
| SYS | Systems Engineer | Systems engineering for infrastructure and reliability |
| PLAT | Platform Engineer | Platform engineering for developer experience |
| SALE | Sales Engineer | Technical sales with engineering expertise |
| CS | Customer Success Manager | Customer success through technical solutions |
| DA | Data Analyst | Data analysis with business intelligence expertise |

## Available Commands

### Individual Role Building
- `npm run build:pm` - Generate Product Manager resume
- `npm run build:dpm` - Generate Data Product Manager resume
- `npm run build:tpm` - Generate Technical Product Manager resume
- `npm run build:proj` - Generate Project Manager resume
- `npm run build:fse` - Generate Full Stack Engineer resume
- `npm run build:sys` - Generate Systems Engineer resume
- `npm run build:plat` - Generate Platform Engineer resume
- `npm run build:sale` - Generate Sales Engineer resume
- `npm run build:cs` - Generate Customer Success Manager resume
- `npm run build:da` - Generate Data Analyst resume

### Batch Operations
- `npm run build:all-roles` - Generate resumes for all roles
- `npm run validate` - Validate resume JSON format

### Direct Script Usage
- `node scripts/generate-role-resume.js <ROLE_CODE>` - Generate specific role
- `node scripts/generate-role-resume.js help` - Show available roles

## Usage

### Quick Start
1. **Generate a specific role resume**:
   ```bash
   npm run build:fse    # Full Stack Engineer
   npm run build:pm     # Product Manager
   ```

2. **Generate all role resumes**:
   ```bash
   npm run build:all-roles
   ```

3. **Check available roles**:
   ```bash
   node scripts/generate-role-resume.js help
   ```

### Advanced Usage
1. **Generate with specific theme**:
   ```bash
   node scripts/generate-role-resume.js FSE jsonresume-theme-even
   ```

2. **Generate to custom output directory**:
   ```bash
   node scripts/generate-role-resume.js PM jsonresume-theme-react-tailwind ./custom-output
   ```

### Customizing Role Data
1. Edit role-specific JSON files in `data/resume/`
2. Each file follows the JSON Resume schema
3. Tailor content, skills, and experience for each role
4. Version tracking is automatic upon generation

## Versioning System Details

### Version Tracking
- **Automatic incrementing**: Each generation increases the role's version counter
- **Persistent storage**: Version data stored in `config/versions.json`
- **Metadata tracking**: Timestamps, generation counts, and history

### Filename Format
Generated files follow the pattern: `JimmyLauChoy_[ROLE]_v[000].html`

Examples:
- `JimmyLauChoy_FSE_v001.html`
- `JimmyLauChoy_PM_v003.html`
- `JimmyLauChoy_DPM_v001.html`

### HTML Metadata
Each generated resume includes HTML comments with:
```html
<!-- Generated with jsonresume-theme-react-tailwind v2.0.0-role-based -->
<!-- Generated on: 2025-08-26T02:43:19.663Z -->
<!-- Role: Full Stack Engineer (FSE) -->
<!-- Version: v002 | Generated: 2025-08-26T02:43:19.641Z -->
```

## Theme

Currently using `jsonresume-theme-react-tailwind` with comprehensive enhancements:
- **Role-based versioning**: Automatic role and version metadata embedding
- **Summary section**: Displays `basics.summary` field when present
- **Projects section**: Full project support with dates, keywords, highlights, and roles
- **Professional styling**: Clean, print-friendly design with improved typography
- **Conditional rendering**: Sections only appear when data is present
- **Enhanced metadata**: Automatic version comments in HTML output

## Configuration Files

### `config/roles.json`
Defines available roles, their codes, names, descriptions, and source files.

### `config/versions.json`
Tracks version history for each role including:
- Current version number
- Last generation timestamp
- Total number of generations
- Metadata about the versioning format

## Development

### Adding New Roles
1. Add role definition to `config/roles.json`
2. Create corresponding resume JSON in `data/resume/`
3. Add npm script to `package.json`
4. Version tracking is automatic

### Customizing Themes
1. Install new theme: `npm install jsonresume-theme-[name]`
2. Update `config/roles.json` defaultTheme or specify in generation command
3. Themes that support versioning will include metadata automatically

## Output Management

- **Organized by version**: Each generation creates a new versioned file
- **No overwrites**: Previous versions are preserved
- **Easy identification**: Filenames clearly indicate role and version
- **Timestamp tracking**: Generation history available in version config

## Additional Documentation

- **[Versioning Guide](VERSIONING_GUIDE.md)**: Comprehensive guide to the role-based versioning system
- **[Theme Modifications](THEME_MODIFICATIONS.md)**: Documentation of theme customizations and enhancements
