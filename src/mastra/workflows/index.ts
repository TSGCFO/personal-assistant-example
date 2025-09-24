import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

// Gmail Urgent Email Workflow
const processUrgentGmail = createStep({
  id: "processUrgentGmail",
  description: "Process urgent emails from Gmail",
  inputSchema: z.object({
    trigger: z.string().describe("Event trigger (e.g., 'urgent_email_from_john_doe')"),
    emailData: z.object({
      from: z.string(),
      subject: z.string(),
      content: z.string(),
    }).optional(),
  }),
  outputSchema: z.object({
    summary: z.string(),
    actionRequired: z.boolean(),
    priority: z.enum(["low", "medium", "high", "urgent"]),
  }),
  execute: async ({ mastra, inputData }) => {
    const agent = mastra.getAgent("personalAssistantAgent");
    const prompt = `
      Check Gmail for urgent emails, particularly from John Doe or other high-priority contacts.
      ${inputData.emailData ? `
      Email Details:
      - From: ${inputData.emailData.from}
      - Subject: ${inputData.emailData.subject}
      - Content: ${inputData.emailData.content}
      ` : ''}
      
      Analyze the email content and provide:
      1. A concise summary of the email
      2. Whether action is required
      3. Priority level (low, medium, high, urgent)
      
      Focus on emails that require immediate attention or response.
    `;
    
    const response = await agent.generate(
      [{ role: "user", content: prompt }],
      { maxSteps: 3 }
    );
    
    return {
      summary: response.text,
      actionRequired: true,
      priority: "urgent" as const,
    };
  },
});

// Outlook Work Email Workflow
const processWorkEmails = createStep({
  id: "processWorkEmails", 
  description: "Process work emails from Outlook",
  inputSchema: z.object({
    trigger: z.string().describe("Event trigger for work emails"),
    emailData: z.object({
      from: z.string(),
      subject: z.string(),
      content: z.string(),
    }).optional(),
  }),
  outputSchema: z.object({
    summary: z.string(),
    actionRequired: z.boolean(),
    priority: z.enum(["low", "medium", "high", "urgent"]),
  }),
  execute: async ({ mastra, inputData }) => {
    const agent = mastra.getAgent("personalAssistantAgent");
    const prompt = `
      Check Outlook for work-related emails that need attention.
      ${inputData.emailData ? `
      Email Details:
      - From: ${inputData.emailData.from}
      - Subject: ${inputData.emailData.subject}
      - Content: ${inputData.emailData.content}
      ` : ''}
      
      Analyze and provide:
      1. Summary of important work emails
      2. Action items or responses needed
      3. Priority assessment
      
      Focus on emails from colleagues, clients, or management.
    `;
    
    const response = await agent.generate(
      [{ role: "user", content: prompt }],
      { maxSteps: 3 }
    );
    
    return {
      summary: response.text,
      actionRequired: true,
      priority: "high" as const,
    };
  },
});

// Google Calendar Workflow
const processGoogleCalendar = createStep({
  id: "processGoogleCalendar",
  description: "Process Google Calendar events",
  inputSchema: z.object({
    trigger: z.string().describe("Event trigger for calendar events"),
    eventData: z.object({
      eventType: z.string(),
      title: z.string(),
      startTime: z.string(),
      endTime: z.string(),
    }).optional(),
  }),
  outputSchema: z.object({
    summary: z.string(),
    upcomingEvents: z.array(z.string()),
    conflicts: z.array(z.string()),
  }),
  execute: async ({ mastra, inputData }) => {
    const agent = mastra.getAgent("personalAssistantAgent");
    const prompt = `
      Check Google Calendar for upcoming events and potential conflicts.
      ${inputData.eventData ? `
      Event Details:
      - Type: ${inputData.eventData.eventType}
      - Title: ${inputData.eventData.title}
      - Start: ${inputData.eventData.startTime}
      - End: ${inputData.eventData.endTime}
      ` : ''}
      
      Provide:
      1. Summary of today's and tomorrow's events
      2. List of upcoming important meetings
      3. Any scheduling conflicts or issues
      
      Focus on events that require preparation or have high importance.
    `;
    
    const response = await agent.generate(
      [{ role: "user", content: prompt }],
      { maxSteps: 3 }
    );
    
    return {
      summary: response.text,
      upcomingEvents: [],
      conflicts: [],
    };
  },
});

// Work Calendar Workflow
const processWorkCalendar = createStep({
  id: "processWorkCalendar",
  description: "Process work calendar events",
  inputSchema: z.object({
    trigger: z.string().describe("Event trigger for work calendar"),
    eventData: z.object({
      eventType: z.string(),
      title: z.string(),
      startTime: z.string(),
      endTime: z.string(),
    }).optional(),
  }),
  outputSchema: z.object({
    summary: z.string(),
    upcomingMeetings: z.array(z.string()),
    deadlines: z.array(z.string()),
  }),
  execute: async ({ mastra, inputData }) => {
    const agent = mastra.getAgent("personalAssistantAgent");
    const prompt = `
      Check work calendar (Outlook) for professional meetings and deadlines.
      ${inputData.eventData ? `
      Event Details:
      - Type: ${inputData.eventData.eventType}
      - Title: ${inputData.eventData.title}
      - Start: ${inputData.eventData.startTime}
      - End: ${inputData.eventData.endTime}
      ` : ''}
      
      Provide:
      1. Summary of work schedule
      2. Upcoming meetings and their importance
      3. Project deadlines and milestones
      
      Focus on work-related commitments and deadlines.
    `;
    
    const response = await agent.generate(
      [{ role: "user", content: prompt }],
      { maxSteps: 3 }
    );
    
    return {
      summary: response.text,
      upcomingMeetings: [],
      deadlines: [],
    };
  },
});

// Create individual workflows for each service
export const urgentGmailWorkflow = createWorkflow({
  id: "urgent-gmail-workflow",
  description: "Process urgent Gmail emails with event triggers",
  inputSchema: z.object({
    trigger: z.string(),
    emailData: z.object({
      from: z.string(),
      subject: z.string(),
      content: z.string(),
    }).optional(),
  }),
  outputSchema: z.object({
    summary: z.string(),
    actionRequired: z.boolean(),
    priority: z.enum(["low", "medium", "high", "urgent"]),
  }),
})
  .then(processUrgentGmail)
  .commit();

export const workEmailWorkflow = createWorkflow({
  id: "work-email-workflow", 
  description: "Process work emails from Outlook",
  inputSchema: z.object({
    trigger: z.string(),
    emailData: z.object({
      from: z.string(),
      subject: z.string(),
      content: z.string(),
    }).optional(),
  }),
  outputSchema: z.object({
    summary: z.string(),
    actionRequired: z.boolean(),
    priority: z.enum(["low", "medium", "high", "urgent"]),
  }),
})
  .then(processWorkEmails)
  .commit();

export const googleCalendarWorkflow = createWorkflow({
  id: "google-calendar-workflow",
  description: "Process Google Calendar events",
  inputSchema: z.object({
    trigger: z.string(),
    eventData: z.object({
      eventType: z.string(),
      title: z.string(),
      startTime: z.string(),
      endTime: z.string(),
    }).optional(),
  }),
  outputSchema: z.object({
    summary: z.string(),
    upcomingEvents: z.array(z.string()),
    conflicts: z.array(z.string()),
  }),
})
  .then(processGoogleCalendar)
  .commit();

export const workCalendarWorkflow = createWorkflow({
  id: "work-calendar-workflow",
  description: "Process work calendar events",
  inputSchema: z.object({
    trigger: z.string(),
    eventData: z.object({
      eventType: z.string(),
      title: z.string(),
      startTime: z.string(),
      endTime: z.string(),
    }).optional(),
  }),
  outputSchema: z.object({
    summary: z.string(),
    upcomingMeetings: z.array(z.string()),
    deadlines: z.array(z.string()),
  }),
})
  .then(processWorkCalendar)
  .commit();

// Legacy daily workflow for backward compatibility
export const dailyWorkflow = createWorkflow({
  id: "daily-workflow",
  description: "Daily summary workflow",
  inputSchema: z.object({}),
  outputSchema: z.object({
    message: z.string(),
  }),
})
  .then(processUrgentGmail)
  .commit();
