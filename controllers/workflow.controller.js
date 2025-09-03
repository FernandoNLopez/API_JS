import dayjs from 'dayjs';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import Subscription from '../models/subscription.model';

const { serve } = require('@upstash/workflow/express');


//create reminders
const REMINDERS = [7, 5, 2, 1];


export const sendReminders = serve(async (context) => {

    const { subscriptionId } = context.requestPayload;   //extract subscription ID from a specific workflow, to pass the ID of the subscription that workflow is for
    const subscription = await fetchSubscription(context, subscriptionId); //fetch details about that subscription


    //check subscription
    if (!subscription || subscription.status !== 'active') return;

    const renewalDate = dayjs(subscription.renewalDate);

    //check if renewaldate is in the future
    if (renewalDate.isBefore(dayjs())) {
        console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
        return;
    }

    //compare dates to use de aproppiate number of days to send reminders
    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');

        if(reminderDate.isAfter(dayjs())) {
            //we send to sleep our function
            await sleepUntilReminder(context, `Reminder ${daysBefore} days before.`, reminderDate);

        }

        await triggerReminder(context, `Reminder ${daysBefore} days before`);
    };

});


const fetchSubscription = async (context, subscriptionId) => {

    return await context.run('get subscription', () => { //starting the context for get subscription with the data of specific user (email and name)
        return Subscription.findById(subscriptionId).populate('user', 'name email');
    })
};


const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label) => {

    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder.`);

        //Send Email / SMS
        

    })
};