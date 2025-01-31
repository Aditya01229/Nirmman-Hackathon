import os
import webbrowser
import requests
import win32print  # For Windows printing
import win32api    # For Windows printing
import io

def process_print_request(request_id, token):
    """Process the print request and automatically print the files."""
    
    # Define the API URL to fetch the print files for the given request_id
    request_url = f"https://nirmman-hackathon-two.vercel.app/print-request/{request_id}"
    headers = {"Authorization": f"Bearer {token}"}

    try:
        # Send a request to fetch print files based on request_id
        response = requests.get(request_url, headers=headers)
        
        if response.status_code == 200:
            print(f"✅ Fetched print files for request {request_id} successfully.")
            print_data = response.json()  # Get the print files from the response
            
            if print_data:
                # Loop through files in the request and print them
                for file in print_data['printFiles']:
                    file_url = file['cloud_address']
                    print(f"Processing file: {file_url}")
                    print_file(file_url)  # Print each file
            else:
                print(f"❌ No print files found for request ID: {request_id}")

        else:
            print(f"❌ Failed to fetch print files: {response.status_code} - {response.text}")
    
    except requests.exceptions.RequestException as e:
        print(f"⚠ Network error: {e}")

def print_file(file_url):
    """Download the file, open it on PC, and send it to the printer."""

    try:
        # Step 1: Download the file
        file_response = requests.get(file_url)
        if file_response.status_code == 200:
            file_content = file_response.content
            file_extension = file_url.split('.')[-1].lower()

            if file_extension == 'pdf':
                file_name = "temp.pdf"
                print("📄 PDF detected: Downloading and opening...")
            elif file_extension in ['jpg', 'jpeg', 'png']:
                file_name = "temp_image.jpg"
                print("🖼 Image detected: Downloading and opening...")
            else:
                print(f"❌ Unsupported file format: {file_extension}")
                return
            
            # Save the file locally
            with open(file_name, "wb") as f:
                f.write(file_content)
            print(f"✅ File downloaded: {file_name}")

            # Step 2: Open the file on the PC
            webbrowser.open(os.path.abspath(file_name))
            print(f"👁 Opening {file_name} on PC...")

            # Step 3: Send file to the printer
            send_to_printer(file_name)

        else:
            print(f"❌ Failed to download file: {file_url}")

    except requests.exceptions.RequestException as e:
        print(f"⚠ Error downloading file: {e}")

def send_to_printer(file_path):
    """Send the file to the default printer."""
    
    try:
        printer_name = win32print.GetDefaultPrinter()
        print(f"🖨 Sending file {file_path} to printer: {printer_name}")

        win32api.ShellExecute(0, "print", file_path, None, ".", 0)
        print(f"✅ File {file_path} printed successfully.")

    except Exception as e:
        print(f"❌ Error printing file {file_path}: {e}")