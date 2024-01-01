# Gmail-Automation


Description -This is a repository for Auto_reply_gmail_api_app App Developed using Node.js and Google APIs. -This app is able to respond to emails sent to your Gmail mailbox while you’re out on a vacation.

Features

1. Node.js clusters support.
2. Checks for new emails in a given Gmail ID.
3. Sends replies to emails that have no prior replies.
4. Adds a label to the email and moves the email to the label.
5. This app checks above steps every 45 to 120 in b/w sec random time interval.


Getting Started

First Thing to do go to Google Cloud Console and set up the OAuth 2.0 authentication for your application, follow these steps:

1. Go to the Google Cloud Console (https://console.developers.google.com) and create a new project. Provide a suitable name for your project and click on the "Create" button.
2. Once the project is created, click on the project name to navigate to the project dashboard.
3. In the left sidebar, click on the "Credentials" tab under the "APIs & Services" section.
4. On the Credentials page, click on the "Create credentials" button and select "OAuth client ID" from the dropdown menu.
5. Select the application type as "Web application" and provide a name for the OAuth 2.0 client ID.
6. In the "Authorized redirect URIs" field, enter the redirect URI where you want to receive the authorization code. For this code, you can use "http://localhost:3000/oauth2callback".
7. Click on the "Create" button to create the OAuth client ID. You will see a modal displaying the client ID and client secret. Copy the values of the client ID and client secret.
8. Enable gmail api.
9. Now, in your code, replace the placeholder values in the credentials.json file with the respective values you obtained: Add client_id value. Add client_secret value. Add redirect_uris and all.
10. Save the credentials.json file.


# Libraries and technologies used

1. Google API Libraries ->  Used to authenticate with Google, retrieve unreplied messages, send vacation replies, create labels, and modify labels on messages.
2. Google OAuth Local Authentication -> Used to authenticate the application with the necessary scopes for accessing Gmail.



# Note on areas where your code can be improved
1. It reply to the emails that are computer generated that doesn't need reply back.

2. Modularization: The entire logic is present in a single route handler, making it harder to understand and maintain. It can be improved by breaking down the logic into modular functions, each handling a specific task (e.g., authentication, label creation, message retrieval, and reply sending). This enhances code organization and readability.

3. Error Handling: The current error handling is minimal, and it would be beneficial to provide more informative error messages and log details.

4. Random Interval Calculation: The calculation for the random interval is a bit complex and could be better encapsulated in a separate function for clarity.

5. Security: The code assumes a successful authentication without handling potential authentication failures or refreshing tokens.
