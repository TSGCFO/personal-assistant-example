# Personal Assistant with Mastra

This is a comprehensive personal assistant built with Mastra that provides access to 500+ applications through Rube MCP integration, with PostgreSQL-based memory and event-triggered workflows.

## Features

- **500+ App Integration**: Access to Gmail, Outlook, Google Calendar, GitHub, Notion, Slack, and more through Rube MCP
- **PostgreSQL Memory**: Persistent, resource-scoped memory with semantic recall
- **Event-Triggered Workflows**: Automated processing of urgent emails and calendar events
- **Working Memory**: Comprehensive user profile management across conversations
- **Telegram Bot**: Interactive chat interface with persistent memory
- **Weather Information**: Get current weather for any location

## Setup Instructions

### 1. Database Setup (PostgreSQL)

1. Install PostgreSQL locally or use a cloud service
2. Create a database for the personal assistant:
   ```sql
   CREATE DATABASE personal_assistant_db;
   ```
3. Update the `DATABASE_URL` in your environment variables

### 2. Rube MCP Configuration

1. Sign up for Rube at https://rube.app
2. Get your bearer token from the Rube dashboard
3. Update `RUBE_MCP_TOKEN` in your environment variables

### 3. Environment Variables

Create a `.env` file with the following variables:

```env
# PostgreSQL Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/personal_assistant_db

# Rube MCP Configuration  
RUBE_MCP_URL=https://rube.app
RUBE_MCP_TOKEN=your_rube_bearer_token

# Existing configurations
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
OPENAI_API_KEY=your_openai_api_key

# Optional: GitHub token for GitHub MCP (if needed)
GITHUB_TOKEN=your_github_token
```

### 4. Installation

```bash
npm install
```

### 5. Running the Application

```bash
npm run dev
```

## Features

### Memory System
- **PostgreSQL Storage**: Persistent memory across sessions
- **Resource-Scoped Memory**: User-specific memory that persists across conversations
- **Semantic Recall**: Intelligent retrieval of relevant past conversations
- **Working Memory**: Comprehensive user profile management

### MCP Integration
- **Rube MCP**: Access to 500+ applications through single integration
- **Email Management**: Gmail and Outlook integration
- **Calendar Management**: Google Calendar and Outlook Calendar
- **Productivity Tools**: GitHub, Notion, Slack, and more

### Event-Triggered Workflows
- **Urgent Gmail Processing**: Automatic processing of high-priority emails
- **Work Email Management**: Outlook email monitoring and summarization
- **Calendar Event Processing**: Google Calendar and work calendar management
- **Automated Notifications**: Proactive alerts and summaries

## Workflow Triggers

The system supports event-triggered workflows for:

1. **Email Triggers**:
   - Urgent emails from specific contacts (e.g., John Doe)
   - Work emails requiring immediate attention
   - Automated email categorization and prioritization

2. **Calendar Triggers**:
   - Upcoming important meetings
   - Schedule conflicts
   - Deadline reminders

3. **Manual Triggers**:
   - Telegram bot commands
   - API endpoints for external systems

## API Usage

### Triggering Workflows

```typescript
import { emailTriggerSystem } from './src/mastra/triggers/emailTriggers';

// Trigger urgent Gmail workflow
const result = await emailTriggerSystem.triggerUrgentGmailWorkflow({
  from: 'john.doe@example.com',
  subject: 'Urgent: Project Update',
  content: 'Email content here...'
});

// Trigger work email workflow
const workResult = await emailTriggerSystem.triggerWorkEmailWorkflow({
  from: 'manager@company.com',
  subject: 'Meeting Request',
  content: 'Meeting details...'
});
```

## Memory Management

The system uses resource-scoped memory, meaning:
- Each user has persistent memory across all conversations
- Memory includes personal information, preferences, and context
- Semantic recall finds relevant past conversations
- Working memory maintains comprehensive user profiles

## Architecture

- **Agents**: Personal assistant and weather agents with PostgreSQL memory
- **Tools**: 500+ applications through Rube MCP integration
- **Workflows**: Event-triggered workflows for email and calendar management
- **Memory**: PostgreSQL-based persistent memory with semantic recall
- **MCP Integration**: Single Rube MCP server for all external services

## Development

The project uses:
- TypeScript
- Mastra framework
- PostgreSQL for storage
- Rube MCP for 500+ app integrations
- Telegram Bot API
- Event-triggered workflow system

## Customization

You can customize the assistant by:

- Modifying the agent instructions in `src/mastra/agents/personalAssistantAgent.ts`
- Adding new tools in `src/mastra/tools/index.ts`
- Creating new workflows in `src/mastra/workflows/index.ts`
- Adjusting memory settings for better personalization
- Adding new event triggers in `src/mastra/triggers/emailTriggers.ts`

## Dependencies

- `@ai-sdk/openai`: For connecting to OpenAI models
- `@mastra/core`: Core Mastra functionality
- `@mastra/memory`: For conversation and working memory
- `@mastra/mcp`: For Model Context Protocol integration
- `@mastra/pg`: For PostgreSQL storage and vector operations
- `zod`: For schema validation

## Notes

This assistant uses PostgreSQL for persistent memory and can access 500+ applications through Rube MCP integration. The system is designed to be event-driven and can automatically process emails and calendar events based on configurable triggers.
