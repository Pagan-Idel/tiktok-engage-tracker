
# Tiktok Live Tool

This application tracks likes and follows on TikTok Live events. Follow the instructions below to set up and run the app on Windows.

## Prerequisites

### 1. Install MySQL on Windows

1. **Download MySQL Installer**:
   - Go to the official MySQL website: [MySQL Installer for Windows](https://dev.mysql.com/downloads/installer/).
   - Download the **MySQL Installer (MSI)** — you can choose the **smaller web installer** (which will download additional components as needed) or the **full installer**.

2. **Run the Installer**:
   - Double-click the downloaded `.msi` file to start the installation.

3. **Choose Setup Type**:
   - Select **Server only**.
   - Click **Next**.
   - Click **Execute**.
   - Once you see the green checkmark, click **Next**.

4. **Installation**:
   - **Networking and Type**: Leave the default settings. **Next**.
   - **Authentication Method**: Choose "Use Legacy Authentication" (this ensures compatibility with older applications that use the MySQL `root` user). **Next**.
   - **Accounts and Roles**: Set the Root Password to `root`. Repeat the same password. Then **Next**.
   - **Windows Service**: Make sure "Configure MySQL Server as a Windows Service" is checked. Windows Service Name is set to MYSQL80 and "Standard System Account" is selected. **Next**.
   - **Server File Permissions**: Select "Yes, grant full access to the user running the Windows Service (if applicable) and the administrators group only. Other users and groups will not have access.". Then **Next**.
   - **Apply Configuration**: Simply click **Execute**.

5. **Product Configuration**:
   - **Product Configuration**: Simply click **Next**.

6. **Installation Complete**:
   - Complete the installation by clicking **Finish**. MySQL will now be installed and configured.

### 2. Install Node.js and npm on Windows
You need Node.js and npm installed to run this app. Follow these steps:
1. Go to the official Node.js website: https://nodejs.org/
2. Download the **Windows Installer** for your system (LTS version is recommended for most users).
3. Run the installer and follow the instructions, making sure to check the box to install **npm** along with Node.js.
4. Once installed, verify the installation by running the following commands in a command prompt:
   ```bash
   node -v
   npm -v
   ```
   You should see version numbers for both Node.js and npm.

## Installation

1. Create a folder called `Documents` in your `C:\` drive if it does not already exist.
2. Download program from releases at https://github.com/Pagan-Idel/tiktok-live-like-tracker/releases
3. Unzip and paste the program into your new Documents folder.

## Running the App

### Create a Desktop Shortcut
To make this app easily runnable from your desktop, follow these steps:
1. Right-click on the `desktop.vbs` file in the program files and select **Send to > Desktop (Create Shortcut)**.

### Running the App (Only done on the first time opening the app)
1. **First Click**: The first time you click the desktop shortcut, it will run `npm install` to install the necessary dependencies.
2. **Second Click**: The second time you click the desktop shortcut, it will build the app using `npm run build`.
3. **Third Click**: The third time you click the desktop shortcut, the app will start and open in your browser.

Please wait at least 30 seconds for the app to start on your browser the very first time running it.

### Stopping the App
To stop the app, you can simply close the command prompt window that opens minimized when running the shortcut.

## Supported Platforms
Currently, this app is only supported on Windows.
