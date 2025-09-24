import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core";
import { weatherTool } from "../tools";
import { Memory } from "@mastra/memory";
import { MCPClient } from "@mastra/mcp";
import { PostgresStore, PgVector } from "@mastra/pg";
import { 
  dailyWorkflow,
  urgentGmailWorkflow,
  workEmailWorkflow,
  googleCalendarWorkflow,
  workCalendarWorkflow,
} from "../workflows";

// Configure Rube MCP Client
const mcp = new MCPClient({
  servers: {
    rube: {
      url: new URL(process.env.RUBE_MCP_URL || ""),
      requestInit: {
        headers: {
          Authorization: `Bearer ${process.env.RUBE_MCP_TOKEN}`,
        },
      },
    },
  },
});

const mcpTools = await mcp.getTools();

// Configure PostgreSQL Memory
const memory = new Memory({
  storage: new PostgresStore({
    connectionString: process.env.DATABASE_URL!,
  }),
  vector: new PgVector({
    connectionString: process.env.DATABASE_URL!,
  }),
  embedder: openai.embedding("text-embedding-3-small"),
  options: {
    lastMessages: 20,
    semanticRecall: {
      topK: 5,
      messageRange: 3,
      scope: 'resource',
    },
    workingMemory: {
      enabled: true,
      template: `# Personal Assistant User Profile

## Personal Information
- **Name**: 
- **Email**: 
- **Location**: 
- **Timezone**: 
- **Preferred Language**: 

## Communication Preferences
- **Style**: [Formal/Casual]
- **Response Length**: [Brief/Detailed]
- **Notification Preferences**: 

## Work Information
- **Company**: 
- **Role**: 
- **Work Email**: 
- **Work Calendar**: 
- **Key Contacts**: 

## Interests & Goals
- **Current Projects**: 
- **Learning Goals**: 
- **Hobbies**: 
- **Important Deadlines**: 

## Assistant Context
- **Last Interaction**: 
- **Current Focus**: 
- **Pending Tasks**: 
- **Important Notes**: `,
    },
    threads: {
      generateTitle: true,
    },
  },
});

export const personalAssistantAgent = new Agent({
  name: "Personal Assistant",
  instructions: `
      You are a comprehensive personal assistant with access to 500+ applications through Rube MCP integration.
      
      Your capabilities include:
      
      1. **Email Management**:
         - Gmail: Read, categorize, and send emails
         - Outlook: Access work emails and calendar
         - Email prioritization and action item identification
      
      2. **Calendar Management**:
         - Google Calendar: Personal scheduling and events
         - Outlook Calendar: Work meetings and appointments
         - Schedule optimization and conflict resolution
      
      3. **Productivity Tools**:
         - GitHub: Monitor repositories, PRs, and issues
         - Notion: Access and update knowledge base
         - Slack: Team communication and updates
         - Trello/Asana: Project management
      
      4. **Communication**:
         - Typefully: Social media management
         - LinkedIn: Professional networking
         - Various messaging platforms
      
      5. **Data & Analytics**:
         - Google Sheets: Data analysis and reporting
         - Airtable: Database management
         - Various CRM systems
      
      6. **File Management**:
         - Google Drive: Document access and sharing
         - Dropbox: File storage and collaboration
         - OneDrive: Microsoft ecosystem integration
      
      7. **Weather Information**:
         - Use this tool for getting weather information for specific locations
         - It can provide details like temperature, humidity, wind conditions, and weather conditions
         - Always ask for the location or if it's not provided try to use your working memory 
           to get the user's last requested location
      
      **Memory & Context**:
      - You maintain persistent memory across all conversations
      - Remember user preferences, goals, and important information
      - Use semantic recall to reference relevant past conversations
      - Build comprehensive user profiles over time
      
      **Workflow Integration**:
      - Monitor urgent emails and provide summaries
      - Track calendar events and send reminders
      - Process GitHub activity and development updates
      - Manage social media and communication tasks
      
      Always be proactive in identifying important information and suggesting relevant actions.
  `,
  model: openai("gpt-4o"),
  tools: { ...mcpTools, weatherTool },
  workflows: {
    dailyWorkflow,
    urgentGmailWorkflow,
    workEmailWorkflow,
    googleCalendarWorkflow,
    workCalendarWorkflow,
  },
  memory,
});
