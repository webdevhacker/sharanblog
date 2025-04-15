// cronJobs.js

import cron from "node-cron"
import User from "../models/user.model.js"
import transporter from '../config/nodemailer.js'
import { ACCOUNT_DELETION_WARNING, ACCOUNT_DELETED_MAIL } from "./config/emailTemplates.js";

/*
 * Cron Job 1: Warning Email
 * This job runs every day at 06:00 AM.
 * It finds unverified accounts created between 7 and 6 days ago (i.e. approximately day 6).
 * Then it sends a warning email and marks warningEmailSent as true.
 */
cron.schedule("0 6 * * *", async () => {
  try {
    const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    // Find users whose accounts are older than or equal to 14 days but not older than 15 days, not verified, and not yet warned.
    const usersToWarn = await User.find({
      isAccountVerified: false,
      warningEmailSent: { $ne: true },
      date_join: { $lte: sixDaysAgo, $gt: sevenDaysAgo },
    });
    
    for (const user of usersToWarn) {
      const warningMailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Account Deletion Warning",
        html: ACCOUNT_DELETION_WARNING.replace("{{name}}", user.name).replace("{{email}}", user.email).replace("{{date_join}}", user.date_join)
    };
      
      try {
        await transporter.sendMail(warningMailOptions);
        // Mark the account as having received the warning
        user.warningEmailSent = true;
        await user.save();
        //console.log(`Warning email sent to ${user.email}.`);
      } catch (emailError) {
        console.error(`Failed to send warning email to ${user.email}:`, emailError);
      }
    }
  } catch (error) {
    console.error("Error in warning email cron job:", error);
  }
});

/*
 * Cron Job 2: Deletion and Deletion Confirmation Email
 * This job runs every day at midnight (00:00).
 * It finds unverified accounts that are older than or equal to 7 days, deletes them,
 * and then sends an email to inform the user that their account has been deleted.
 */
cron.schedule("0 0 * * *", async () => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    // Find all unverified users created before or on the threshold of fifteen days ago.
    const usersToDelete = await User.find({
      isAccountVerified: false,
      date_join: { $lte: sevenDaysAgo },
    });
    
    // Process each user individually
    for (const user of usersToDelete) {
      try {
        // Delete the user record and then send deletion confirmation email.
        const deletedUser = await User.findByIdAndDelete(user._id);
        if (deletedUser) {
          const deletionMailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Deleted Confirmation",
            html: ACCOUNT_DELETED_MAIL.replace("{{name}}", user.name).replace("{{email}}", user.email).replace("{{date_join}}", user.date_join),
          };
          await transporter.sendMail(deletionMailOptions);
          //console.log(`Deleted account and sent confirmation email to ${user.email}`);
        } else {
          console.log(`User ${user.email} not found for deletion.`);
        }
      } catch (innerError) {
        console.error(`Error processing deletion for ${user.email}:`, innerError);
      }
    }
  } catch (error) {
    console.error("Error in deletion cron job:", error);
  }
});
