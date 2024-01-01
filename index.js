const express = require('express');
const app = express();
const port = 8000;
const path = require('path');
const fs = require("fs").promises;
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis"); // This package is imported from the googleapis module and provides the necessary functionality to interact with various Google APIs, including the Gmail API.

// Adding scope of gmail api
const SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.labels",
    "https://mail.google.com/",
];

app.get('/', async (req, res) => {
    // Authorizing Google account by implementing sign in with google
    const auth = await authenticate({
        keyfilePath: path.join(__dirname, "credentials.json"),
        scopes: SCOPES,
    });

    const LABEL_NAME = "On Vacation";

    // Load credentials from file
    // async function loadCredentials() {
    //     const filePath = path.join(process.cwd(), 'credentials.json');
    //     const content = await fs.readFile(filePath, { encoding: 'utf8' });
    //     return JSON.parse(content);
    // }

    // Get messages that have no prior replies
    async function getUnrepliedMessages(auth) {
        const gmail = google.gmail({ version: "v1", auth });
        const res = await gmail.users.messages.list({
            userId: "me",
            q: '-in:chats -from:me -has:userlabels',
        });
        return res.data.messages || [];
    }

    // Send reply to a message
    async function sendReply(auth, message) {
        const gmail = google.gmail({ version: 'v1', auth });

        // Get the details of the original message (subject, sender, etc.)
        const res = await gmail.users.messages.get({
            userId: 'me',
            id: message.id,
            format: 'metadata',
            metadataHeaders: ['Subject', 'From'],
        });

        // Extract subject and sender details from the original message
        const subject = res.data.payload.headers.find(
            (header) => header.name === 'Subject'
        ).value;

        const from = res.data.payload.headers.find(
            (header) => header.name === 'From'
        ).value;

        // Extract the email address to which the reply will be sent
        const replyToMatch = from.match(/<(.*)>/);
        const replyTo = replyToMatch ? replyToMatch[1] : null;

        if (replyTo) {
            // Generate the subject for the reply
            const replySubject = subject.startsWith('Re:') ? subject : `Re: ${subject}`;

            // Compose the reply body
            const replyBody = `Hi, \n\n On vacation, will get back to you soon.\n\n Best, \nShesh`;

            // Construct the raw email message
            const rawMessage = [
                `From: me`,
                `To: ${replyTo}`,
                `Subject: ${replySubject}`,
                `In-Reply-To: ${message.id}`,
                `References: ${message.id}`,
                '',
                replyBody,
            ].join('\n');

            // Encode the raw message to base64 for Gmail API
            const encodedMessage = Buffer.from(rawMessage).toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');

            // Send the encoded message as a reply
            await gmail.users.messages.send({
                userId: 'me',
                requestBody: {
                    raw: encodedMessage,
                },
            });
        } else {
            console.error('Failed to extract replyTo from the "From" header.');
        }
    }

    // Create a label
    async function createLabel(auth) {
        const gmail = google.gmail({ version: "v1", auth });
        try {
            // Attempt to create a new label
            const response = await gmail.users.labels.create({
                userId: "me",
                requestBody: {
                    name: LABEL_NAME,
                    labelListVisibility: "labelShow",
                    messageListVisibility: "show",
                },
            });

            // Return the created label's ID
            return response.data.id;
        } catch (err) {
            if (err.code === 409) {
                // If the label already exists, retrieve its ID
                const response = await gmail.users.labels.list({
                    userId: "me",
                });
                const label = response.data.labels.find(
                    (label) => label.name === LABEL_NAME
                );
                return label.id;
            } else {
                // If the error is not a conflict, throw the error
                throw err;
            }
        }
    }

    // Add Label to message and move it to the label folder
    async function addLabel(auth, message, labelId) {
        const gmail = google.gmail({ version: 'v1', auth });
        await gmail.users.messages.modify({
            userId: 'me',
            id: message.id,
            requestBody: {
                addLabelIds: [labelId],
                removeLabelIds: ['INBOX'],
            },
        });
    }

    async function main() {
        const labelId = await createLabel(auth);
        setInterval(async () => {
            const messages = await getUnrepliedMessages(auth);
            for (const message of messages) {
                await sendReply(auth, message);
                await addLabel(auth, message, labelId);
            }
        }, Math.floor(Math.random() * (120 - 45 + 1) + 45) * 1000); // Random interval between 45 and 120 seconds
    };

    main().catch(console.error);
});

app.listen(port, () => {
    console.log(`server is listening at http://localhost:${port}`);
});




/*
Libraries and technologies used

1. Google API Libraries ->  Used to authenticate with Google, retrieve unreplied messages, send vacation replies, create labels, and modify labels on messages.
2. Google OAuth Local Authentication -> Used to authenticate the application with the necessary scopes for accessing Gmail.
3. File System Promises (fs.promises) -> Used to read the content of the credentials file.



Note on areas where your code can be improved
1. It reply to the emails that are computer generated that doesn't need reply back.

2. Modularization: The entire logic is present in a single route handler, making it harder to understand and maintain.
                It can be improved by breaking down the logic into modular functions, each handling a specific task (e.g., authentication, label creation, message retrieval, and reply sending). This enhances code organization and readability.

3. Error Handling: The current error handling is minimal, and it would be beneficial to provide more informative error messages and log details.

4. Random Interval Calculation: The calculation for the random interval is a bit complex and could be better encapsulated in a separate function for clarity.

5. Security: The code assumes a successful authentication without handling potential authentication failures or refreshing tokens.

*/