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
│       ├── [username]_pm_resume.json      # Product Manager
│       ├── [username]_fse_resume.json     # Full Stack Engineer
│       ├── [username]_dpm_resume.json     # Data Product Manager
│       ├── [username]_tpm_resume.json     # Technical Product Manager
│       ├── [username]_proj_resume.json    # Project Manager
│       ├── [username]_sys_resume.json     # Systems Engineer
│       ├── [username]_plat_resume.json    # Platform Engineer
│       ├── [username]_sale_resume.json    # Sales Engineer
│       ├── [username]_cs_resume.json      # Customer Success Manager
│       └── [username]_da_resume.json      # Data Analyst
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
- **Generates consistent filenames**: Format is `[FIRST_NAME][LAST_NAME]_[ROLE]_v[000].html`
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

## Setup

### Environment Configuration

**Important**: Before using this project, you must configure your personal information using environment variables.

1. **Copy the example environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit the .env file** with your personal information:
   ```bash
   # Your personal information for filename generation
   FIRST_NAME=YourFirstName
   LAST_NAME=YourLastName
   USERNAME=yourusername
   ```

3. **Create your resume files** in the `data/resume/` directory following the pattern:
   ```
   data/resume/[USERNAME]_[role]_resume.json
   ```
   
   For example, if `USERNAME=johndoe`:
   - `data/resume/johndoe_pm_resume.json`
   - `data/resume/johndoe_fse_resume.json`
   - `data/resume/johndoe_dpm_resume.json`

4. **Install dependencies**:
   ```bash
   npm install
   ```

### Resume File Format

Each resume file should follow the [JSON Resume Schema](https://jsonresume.org/schema/). Here's a basic template:

```json
{
  "basics": {
    "name": "Your Name",
    "label": "Role Title",
    "email": "your.email@example.com",
    "summary": "Brief professional summary tailored for this role"
  },
  "work": [
    {
      "company": "Company Name",
      "position": "Your Position",
      "startDate": "2020-01-01",
      "highlights": [
        "Achievement 1",
        "Achievement 2"
      ]
    }
  ],
  "skills": [
    {
      "name": "Technical Skills",
      "keywords": ["Skill 1", "Skill 2"]
    }
  ]
}
```

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
Generated files follow the pattern: `[FIRST_NAME][LAST_NAME]_[ROLE]_v[000].html`

Examples:
- `[FIRST_NAME][LAST_NAME]_FSE_v001.html`
- `[FIRST_NAME][LAST_NAME]_PM_v003.html`
- `[FIRST_NAME][LAST_NAME]_DPM_v001.html`

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
1. **Update `config/roles.json`**:
   ```json
   {
     "YOUR_CODE": {
       "code": "YOUR_CODE",
       "name": "Your Role Name",
       "sourceFile": "data/resume/[username]_your_code_resume.json",
       "description": "Description of this role"
     }
   }
   ```

2. **Create corresponding resume JSON** in `data/resume/[username]_your_code_resume.json`
   - Follow the [JSON Resume Schema](https://jsonresume.org/schema/)
   - Base it on an existing role file for consistency
   - Customize content, skills, and experience for the new role

3. **Add npm script** to `package.json`:
   ```json
   {
     "scripts": {
       "build:your_code": "node scripts/generate-role-resume.js YOUR_CODE"
     }
   }
   ```

4. **Version tracking is automatic** - no additional configuration needed

### Removing Roles
1. **Remove from `config/roles.json`**
2. **Delete the resume JSON file** from `data/resume/`
3. **Remove npm script** from `package.json`
4. **Optionally clean up `config/versions.json`** (or leave for historical tracking)

### Customizing Role Templates
You can customize the filename format and output structure by modifying:
- **Filename format**: Update the `generateFilename()` function in `scripts/generate-role-resume.js`
- **Version format**: Modify the `meta.format` field in `config/versions.json`
- **Source file naming**: Update `sourceFile` paths in `config/roles.json`

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
