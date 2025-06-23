# Create Feature Specification

Create a detailed specification for a new feature or change.

## Process

### 1. Requirement Gathering & Analysis
Ask comprehensive questions to identify and understand each component. Do not proceed until you are 95% confident you understand all aspects.

**High-Level Objective**
- What problem are you trying to solve?
- What is the main goal or purpose of this feature?
- How will success be measured?

**Requirements (Functional & User)**
- What are the core features and functionality?
- What specific actions should users be able to perform?
- What are the expected inputs and outputs?
- Are there any business rules or workflows to follow?

**Technical Requirements**
- How does this fit into the existing system architecture?
- Are there any performance or scalability requirements?
- What integrations or dependencies are needed?
- Are there any security considerations?
- What data needs to be stored or processed?
- Are there any third-party services involved?

**Implementation Plan**
- What's the high-level technical approach?
- What are the main components or modules needed?
- How will different parts of the system interact?
- What's the expected data flow?

**Files to Create or Modify**
- Which existing files will need changes?
- What new files will need to be created?
- Are there any database schema changes needed?
- What configuration files might be affected?

**Testing Strategy**
- What are the edge cases to consider?
- How should the feature be tested?
- What are the acceptance criteria?
- Are there any specific test scenarios to cover?
- What could go wrong and how should it be handled?

**Additional Context**
- What's the expected timeline or priority?
- Are there any constraints or limitations?
- Are there any assumptions being made?
- Is there existing code or patterns to follow?

### 2. Confirmation and File Creation
- Show the complete specification to the user
- Ask for confirmation before creating any files
- Only after approval, create `.claude/specs/<featureName>.md`
- Do NOT implement code or modify any existing files
- Do NOT suggest moving to implementation until explicitly requested

## Important Notes
- This command only creates specification documents
- No code implementation will occur
- No existing files will be modified
- The spec file will be saved to `.claude/specs/` directory
- Thoroughly question the user before proceeding to ensure complete understanding