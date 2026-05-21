import platform
import subprocess
import os
import sys

def launch_extension_helper():
    print("=" * 60)
    print(" 🛠️  Universal YouTube Shorts Blocker - Setup Assistant 🛠️ ")
    print("=" * 60)
    
    user_os = platform.system()
    print(f"\n[+] Detected Operating System: {user_os}")
    print("[+] Searching for a compatible Chromium browser...")

    target_url = "chrome://extensions/"
    browser_launched = False

    if user_os == "Darwin":  # This is macOS
        # List of paths where Mac installs Chromium browsers, matched to their extension URLs
        mac_browsers = [
            ("/Applications/Google Chrome.app", "chrome://extensions/", "Google Chrome"),
            ("/Applications/Brave Browser.app", "brave://extensions/", "Brave Browser"),
            ("/Applications/Microsoft Edge.app", "edge://extensions/", "Microsoft Edge")
        ]
        
        for app_path, url, name in mac_browsers:
            if os.path.exists(app_path):
                print(f"[✔] Found {name}! Launching directly...")
                # The 'open -a' command forces macOS to use a specific application
                subprocess.Popen(["open", "-a", app_path, url])
                browser_launched = True
                break

    # Fallback for Windows/Linux or if no Mac app was found in /Applications
    if not browser_launched:
        import webbrowser
        print("[!] Using default system browser fallback...")
        try:
            webbrowser.open(target_url)
        except Exception as e:
            print(sys.stderr, f"\n[!] Error opening browser: {e}")

    print("\n NEXT STEPS WHEN THE BROWSER OPENS:")
    print(" 1. Turn ON 'Developer Mode' (toggle in the top-right corner).")
    print(" 2. Click the 'Load unpacked' button (top-left corner).")
    print(" 3. Select this repository folder to activate the extension!\n")
    print("=" * 60)

if __name__ == "__main__":
    launch_extension_helper()