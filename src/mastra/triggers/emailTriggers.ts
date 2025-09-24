import { mastra } from "../index";

export class EmailTriggerSystem {
  private static instance: EmailTriggerSystem;
  
  public static getInstance(): EmailTriggerSystem {
    if (!EmailTriggerSystem.instance) {
      EmailTriggerSystem.instance = new EmailTriggerSystem();
    }
    return EmailTriggerSystem.instance;
  }

  async triggerUrgentGmailWorkflow(triggerData: { from: string; subject: string; content: string }) {
    const workflow = mastra.getWorkflow("urgentGmailWorkflow");
    const run = await workflow.createRunAsync();
    
    const result = await run.start({
      inputData: {
        trigger: `urgent_email_from_${triggerData.from}`,
        emailData: triggerData,
      },
    });
    
    return result;
  }

  async triggerWorkEmailWorkflow(triggerData: { from: string; subject: string; content: string }) {
    const workflow = mastra.getWorkflow("workEmailWorkflow");
    const run = await workflow.createRunAsync();
    
    const result = await run.start({
      inputData: {
        trigger: `work_email_from_${triggerData.from}`,
        emailData: triggerData,
      },
    });
    
    return result;
  }

  async triggerCalendarWorkflow(triggerData: { eventType: string; eventData: any }) {
    const workflow = mastra.getWorkflow("googleCalendarWorkflow");
    const run = await workflow.createRunAsync();
    
    const result = await run.start({
      inputData: {
        trigger: `calendar_event_${triggerData.eventType}`,
        eventData: triggerData,
      },
    });
    
    return result;
  }

  async triggerWorkCalendarWorkflow(triggerData: { eventType: string; eventData: any }) {
    const workflow = mastra.getWorkflow("workCalendarWorkflow");
    const run = await workflow.createRunAsync();
    
    const result = await run.start({
      inputData: {
        trigger: `work_calendar_${triggerData.eventType}`,
        eventData: triggerData,
      },
    });
    
    return result;
  }
}

// Export singleton instance
export const emailTriggerSystem = EmailTriggerSystem.getInstance();
