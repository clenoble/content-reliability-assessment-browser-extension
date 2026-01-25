# Setting Up Mistral via Ollama on Windows

This guide will help you set up the local Mistral AI model using Ollama on Windows, allowing you to use the Reliability Assessment extension without sending data to external APIs.

## Prerequisites

- Windows 10 or later
- At least 8GB of RAM (16GB recommended)
- ~5GB of free disk space for the Mistral model

## Step 1: Install Ollama

### Option A: Using winget (Recommended)

Open PowerShell or Command Prompt and run:

```cmd
winget install Ollama.Ollama
```

### Option B: Manual Download

1. Visit https://ollama.com/download/windows
2. Download the installer
3. Run the installer and follow the prompts

After installation, Ollama should start automatically. You'll see the Ollama icon in your system tray (near the clock).

## Step 2: Verify Ollama Installation

Open a new PowerShell or Command Prompt window and run:

```cmd
ollama --version
```

You should see the version number displayed. If you get an error, restart your computer and try again.

## Step 3: Pull the Mistral Model

In PowerShell or Command Prompt, run:

```cmd
ollama pull mistral
```

This will download the Mistral model (~4.4GB). The download may take several minutes depending on your internet connection. You'll see a progress bar during the download.

## Step 4: Configure CORS (Critical Step)

Browser extensions require CORS to be enabled to communicate with Ollama. Without this configuration, you'll get a "403 Forbidden" error.

### Set the Environment Variable

1. **Open PowerShell as Administrator:**
   - Press `Win + X`
   - Select "Windows PowerShell (Admin)" or "Terminal (Admin)"

2. **Run this command:**

```powershell
[System.Environment]::SetEnvironmentVariable('OLLAMA_ORIGINS', '*', 'Machine')
```

3. **Completely stop Ollama:**
   - Right-click the Ollama icon in the system tray
   - Click "Quit Ollama"
   - Open Task Manager (`Ctrl + Shift + Esc`)
   - Ensure no `ollama.exe` processes are running

4. **Restart Ollama:**
   - Search for "Ollama" in the Start menu
   - Launch the application

## Step 5: Verify the Setup

### Test 1: Check if Ollama is Running

Open your web browser and navigate to:

```
http://localhost:11434/
```

You should see a message saying "Ollama is running".

### Test 2: Verify CORS Configuration

Open PowerShell and run:

```powershell
Invoke-WebRequest -Uri http://localhost:11434/api/tags -Headers @{"Origin"="chrome-extension://test"} -UseBasicParsing
```

If CORS is properly configured, you should see a response with `StatusCode: 200` and the response should include `Access-Control-Allow-Origin: *` in the headers.

If you get a 403 error, CORS is not configured. Double-check Step 4.

### Test 3: Verify the Mistral Model

Run this command in PowerShell:

```powershell
ollama list
```

You should see `mistral:latest` in the list of installed models.

## Step 6: Configure the Browser Extension

1. **Open the extension:**
   - In Chrome/Edge: Click the extension icon to open the side panel
   - In Firefox: Click the extension icon to open the popup

2. **Open Settings:**
   - Click "Configure Settings"

3. **Select Mistral:**
   - Under "Model Selection", choose "Mistral (Local - Ollama)"
   - Click "Save Settings"

## Step 7: Test the Extension

1. Navigate to any webpage with text content (e.g., a news article)
2. Click the extension icon
3. Click "Analyze Page Text"
4. Grant permission when prompted
5. Wait for the analysis to complete (this may take 30-60 seconds for local models)

## Troubleshooting

### Error: "Failed to connect to local model. Is Ollama running?"

**Solutions:**
- Verify Ollama is running (check system tray for the Ollama icon)
- Check if http://localhost:11434/ responds in your browser
- Try restarting Ollama

### Error: "Local API request failed: 403"

**Cause:** CORS is not properly configured.

**Solutions:**
1. Verify the environment variable is set:
   ```powershell
   $env:OLLAMA_ORIGINS
   ```
   Should display: `*`

2. If it shows nothing or an error:
   - Re-run the command from Step 4 in PowerShell as Administrator
   - Restart your computer (important!)
   - Verify again

3. Alternative method - Manual start with environment variable:
   - Quit Ollama from the system tray
   - Open PowerShell
   - Run:
     ```powershell
     $env:OLLAMA_ORIGINS = "*"
     & "C:\Users\$env:USERNAME\AppData\Local\Programs\Ollama\ollama.exe" serve
     ```
   - Leave this PowerShell window open while using the extension

### Error: "Request timeout"

**Cause:** The local model is slower than cloud APIs and needs more time to process.

**Solutions:**
- The extension timeout is set to 2 minutes, which should be sufficient for most texts
- Try analyzing shorter webpage content
- Consider upgrading your hardware (more RAM/faster CPU)
- Use a smaller/faster model like `phi3` or `tinyllama`:
  ```cmd
  ollama pull phi3
  ```
  (Note: You'll need to modify the extension code to use a different model)

### Extension works with Gemini but not Mistral

**Check:**
1. Verify Ollama is running (http://localhost:11434/)
2. Check browser console (F12 → Console tab) for detailed error messages
3. Check browser Network tab (F12 → Network tab, filter by "localhost") to see the actual request/response

### Ollama uses too much RAM/CPU

**Solutions:**
- Ollama loads the entire model into RAM when in use
- The model unloads automatically after a period of inactivity
- Close other applications to free up resources
- Consider using a smaller model

## Performance Notes

- **First Request:** May take 30-60 seconds as the model loads into memory
- **Subsequent Requests:** Usually faster (~20-30 seconds) as the model stays loaded
- **Local vs Cloud:** Local models are slower but provide complete privacy - your data never leaves your computer

## Privacy Benefits

Using Mistral via Ollama means:
- ✅ No API key required
- ✅ No data sent to external servers
- ✅ Complete privacy - all processing happens locally
- ✅ No usage limits or costs
- ✅ Works offline (after initial model download)

## Alternative Models

You can try other models available on Ollama:

```cmd
ollama pull phi3              # Smaller, faster model (3.8GB)
ollama pull llama3.1          # Larger, more capable model (4.7GB)
ollama pull gemma2            # Google's open model (5.4GB)
```

**Note:** The extension is currently configured for `mistral`. To use other models, you'll need to modify the `MODEL` value in the extension's source code (`src/constants.ts`).

## Getting Help

If you encounter issues not covered here:

1. Check the browser console (F12) for detailed error messages
2. Check Ollama's logs:
   - Right-click the Ollama system tray icon
   - Click "View Logs"
3. Restart both Ollama and your browser
4. Report issues at: https://github.com/[your-repo]/issues

## Uninstalling

To remove Ollama and free up disk space:

1. Quit Ollama from the system tray
2. Uninstall via Windows Settings → Apps → Ollama
3. Delete the models folder (if desired):
   ```
   C:\Users\[YourUsername]\.ollama
   ```
