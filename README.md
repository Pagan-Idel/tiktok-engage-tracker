
TikTok Live Like Tracker

This project is a Next.js application that tracks the top 5 likers in a TikTok Live chat room. It connects to the TikTok Live chat room via a WebSocket connection and displays the users who have sent the most likes in real-time.

Table of Contents
- Features
- Prerequisites
- Installation
- Running the Application
- Usage
- Project Structure
- Contributing
- License

Features
- Connect to a TikTok Live chat room by username.
- Track and display the top 5 users who send the most likes in real-time.
- Automatically updates the list of top likers every 5 seconds.

Prerequisites

Before you begin, make sure you have the following installed:

1. Node.js: You need to have Node.js installed on your machine. Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. You can download and install Node.js from the official website (https://nodejs.org/).

2. npm: Node.js comes with npm (Node Package Manager) installed. npm allows you to install the required dependencies for this project.

To check if Node.js and npm are installed, open your terminal (Command Prompt, PowerShell, or Terminal) and type:

node -v
npm -v

You should see version numbers for both Node.js and npm. If not, please follow the installation instructions provided on the Node.js website.

Installation

Follow these steps to set up and run the project locally:

1. Download the Latest Release

   Download the latest release of the project from the Releases page on GitHub. Unzip the downloaded file to a location on your machine.

2. Navigate to the Project Directory

   In your terminal, go to the project's directory:

   cd tiktok-live-like-tracker

3. Install Dependencies

   Install the necessary dependencies using npm:

   npm install

   This command will install all the packages required by the project, as specified in the package.json file.

Running the Application

Once the dependencies are installed, you can start the development server:

npm run dev

This command starts the Next.js development server. The application will be available at http://localhost:8091.

Usage

1. Connect to TikTok Live

   - Open your web browser and go to http://localhost:8091.
   - Enter the TikTok username you want to connect to in the input field.
   - Click the "Connect" button.

2. View Top 5 Likers

   - Once connected, the app will display the top 5 users who have sent the most likes in real-time.
   - The list will automatically update every 5 seconds.

