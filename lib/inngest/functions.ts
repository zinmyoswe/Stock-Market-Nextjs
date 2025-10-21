import { inngest } from "./client";
import {PERSONALIZED_WELCOME_EMAIL_PROMPT} from "@/lib/inngest/prompts";
import {sendWelcomeEmail} from "@/lib/nodemailer";

export const sendSignUpEmail = inngest.createFunction(
    { id: "sign-up-email" },
    { event: "app/user.created" },
    async ({ event, step }) => {
        const userProfile = `
            - Country: ${event.data.country}
            - Investment goals: ${event.data.investmentGoals}
            - Risk tolerance: ${event.data.riskTolerance}
            - Preferred industry: ${event.data.preferredIndustry}
        `
        const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{userProfile}}', userProfile)

        const response = await step.ai.infer('generate-welcome', {
            model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
            body:{
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: prompt }
                        ]
                    }
                ]
            }
        })

        await step.run('send-welcome-email', async () => {
            const part = response.candidates?.[0]?.content?.parts?.[0];
            const introText = (part && 'text' in part ? part.text : null) || 'Thank for joining Stockmarketpeach. You now have the tools to track markets and make smater moves.'

            const {data:{email,name}} = event;

            // For NodeMailer
            return await sendWelcomeEmail({email,name, intro:introText});
        })

        return{
            success: true,
            message: 'Welcome email send successfully'
        };
    },
);

export const sendDailyNewsSummary = inngest.createFunction(
    { id: "daily-news-summary" },
    [{ event: "app/daily.news.summary" }, { cron: "0 12 * * *" }],
    async ({ step }) => {
        // step #1: Geat all users for news delivery
        // step #2: Fetch personalized news for each user
        // step #3: Summarize news via AI for each user
        // step #4: Send emails
    }
)