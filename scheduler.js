// scheduler.js
const cron = require('node-cron');
const Post = require('./models/postModel');
const User = require('./models/userModel');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // or whatever provider you're using
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const runScheduler = () => {
  cron.schedule('* * * * *', async () => {
    console.log('⏰ Checking for scheduled posts...');

    const now = new Date();
    try {
      const posts = await Post.find({
        scheduledTime: { $lte: now },
        status: 'pending',
      }).populate('userId');

      for (let post of posts) {
        const { userId, title, content, mediaUrls } = post;
        const toEmail = userId.email;

        // Construct email
        let html = `<h3>${title}</h3><p>${content}</p>`;
        if (mediaUrls && mediaUrls.length > 0) {
          html += `<h4>Media:</h4>`;
          mediaUrls.forEach(url => {
            html += `<img src="${url}" style="max-width:400px; margin:10px;" /><br/>`;
          });
        }

        // Send email
        await transporter.sendMail({
          from: `"Post Scheduler" <${process.env.MAIL_USER}>`,
          to: toEmail,
          subject: `Scheduled Post: ${title}`,
          html: html,
        });

        // Update post status
        post.status = 'sent';
        await post.save();

        console.log(`📬 Email sent to ${toEmail} for post "${title}"`);
      }

    } catch (error) {
      console.error('❌ Error in scheduler:', error.message);
    }
  });
};

module.exports = {runScheduler};



/*
TO SEND EMAIL 5 MIN BEFORE
const now = new Date();
const bufferTime = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes ahead

const posts = await Post.find({
  scheduledTime: { $lte: bufferTime },
  status: 'pending',
}).populate('userId');

 */