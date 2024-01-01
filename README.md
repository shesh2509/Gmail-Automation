# Gmail-Automation


Description -This is a repository for Auto_reply_gmail_api_app App Developed using Node.js and Google APIs. -This app is able to respond to emails sent to your Gmail mailbox while you’re out on a vacation.

Features

1. Node.js clusters support.
2. Checks for new emails in a given Gmail ID.
3. Sends replies to emails that have no prior replies.
4. Adds a label to the email and moves the email to the label.
5. This app checks above steps every 45 to 120 in b/w sec random time interval.


# Libraries and technologies used

1. Google API Libraries ->  Used to authenticate with Google, retrieve unreplied messages, send vacation replies, create labels, and modify labels on messages.
2. Google OAuth Local Authentication -> Used to authenticate the application with the necessary scopes for accessing Gmail.
3. File System Promises (fs.promises) -> Used to read the content of the credentials file.



# Note on areas where your code can be improved
1. It reply to the emails that are computer generated that doesn't need reply back.

2. Modularization: The entire logic is present in a single route handler, making it harder to understand and maintain. It can be improved by breaking down the logic into modular functions, each handling a specific task (e.g., authentication, label creation, message retrieval, and reply sending). This enhances code organization and readability.

3. Error Handling: The current error handling is minimal, and it would be beneficial to provide more informative error messages and log details.

4. Random Interval Calculation: The calculation for the random interval is a bit complex and could be better encapsulated in a separate function for clarity.

5. Security: The code assumes a successful authentication without handling potential authentication failures or refreshing tokens.
