import sys
import qrcode
import requests
import webbrowser
from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QLabel, QPushButton, QHBoxLayout, QStackedWidget,
    QScrollArea, QMessageBox, QTableWidget, QTableWidgetItem, QHeaderView
)
from PyQt6.QtGui import QPixmap
from PyQt6.QtCore import Qt, QTimer


class DashboardPage(QWidget):
    def __init__(self, parent):
        super().__init__()
        self.parent = parent
        self.init_ui()

    def init_ui(self):
        layout = QHBoxLayout()

        # Sidebar (Profile Info + QR Code + Logout)
        self.sidebar = QWidget()
        self.sidebar_layout = QVBoxLayout()

        # Profile Icon (Rectangular)
        self.profile_icon = QLabel()
        self.set_profile_icon("path_to_profile_icon.png")  # Set rectangular profile icon
        self.sidebar_layout.addWidget(self.profile_icon)

        # QR Code
        self.qr_code = QLabel()
        self.generate_qr_code("Shopkeeper_123")
        self.sidebar_layout.addWidget(self.qr_code)

        # User Info
        self.user_info = QLabel("Loading user info...")
        self.sidebar_layout.addWidget(self.user_info)

        # Logout Button
        self.logout_btn = QPushButton("Logout")
        self.logout_btn.clicked.connect(self.logout)
        self.sidebar_layout.addWidget(self.logout_btn)

        self.sidebar.setLayout(self.sidebar_layout)

        # Main Dashboard Content
        self.stack = QStackedWidget()

        # Print Queue Page
        self.print_queue_page = PrintQueuePage(self)
        self.stack.addWidget(self.print_queue_page)

        # Default Main Content Page
        self.main_content = QWidget()
        self.main_content_layout = QVBoxLayout()

        # Printer Queue Button (Switches to PrintQueuePage)
        self.printer_queue_btn = QPushButton("View Printer Queue")
        self.printer_queue_btn.clicked.connect(lambda: self.stack.setCurrentWidget(self.print_queue_page))
        self.main_content_layout.addWidget(self.printer_queue_btn)

        self.main_content.setLayout(self.main_content_layout)
        self.stack.addWidget(self.main_content)

        # Scroll Area (Fix for proper rendering)
        scroll_area = QScrollArea()
        scroll_area.setWidget(self.stack)
        scroll_area.setWidgetResizable(True)  # Ensures proper resizing

        layout.addWidget(self.sidebar)
        layout.addWidget(scroll_area)

        self.setLayout(layout)
        self.stack.setCurrentWidget(self.main_content)
        self.fetch_data()  # 🔹 Fetch user and queue data

    def set_profile_icon(self, image_path):
        """Set rectangular profile image safely."""
        pixmap = QPixmap(image_path)
        if pixmap.isNull():
            print(f"Error: Image '{image_path}' not found. Using default.")
            pixmap = QPixmap(150, 150)  # Placeholder blank image
            pixmap.fill(Qt.GlobalColor.lightGray)  # Default gray placeholder
        else:
            pixmap = pixmap.scaled(150, 150, Qt.AspectRatioMode.KeepAspectRatio, Qt.TransformationMode.SmoothTransformation)
        self.profile_icon.setPixmap(pixmap)

    def generate_qr_code(self, shop_id):
        """Generate and display QR code."""
        custom_url = f"https://print-frontend-ten.vercel.app/form/{shop_id}"
        img = qrcode.make(custom_url)
        img.save("profile_qr.png")
        self.qr_code.setPixmap(QPixmap("profile_qr.png").scaled(150, 150, Qt.AspectRatioMode.KeepAspectRatio))

    def fetch_data(self):
        """Fetch user info and printer queue using JWT token."""
        token = self.get_jwt_token()
        if token:
            self.fetch_user_info(token)  # Get user info
            self.print_queue_page.fetch_print_queue()  # Get printer queue
        else:
            self.user_info.setText("No valid token found. Please log in again.")

    def fetch_user_info(self, token):
        """Fetch user profile from API."""
        headers = {"Authorization": f"Bearer {token}"}
        url = "https://nirmman-hackathon-two.vercel.app/shop/getshop"  # Replace with correct endpoint

        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                user_data = response.json()
                self.user_info.setText(f"Name: {user_data.get('name')}\nShop Id: {user_data.get('id')}\nEmail: {user_data.get('email')}\n Phone No.: {user_data.get('phn_number')}")
            else:
                self.user_info.setText("Failed to fetch user info.")
        except requests.exceptions.RequestException as e:
            self.user_info.setText(f"Error: {str(e)}")

    def logout(self):
        """Logout and clear JWT token."""
        with open("jwt_token.txt", "w") as file:
            file.write("")
        self.parent.setCurrentWidget(self.parent.login_page)

    def get_jwt_token(self):
        """Retrieve JWT token from local storage."""
        try:
            with open("jwt_token.txt", "r") as file:
                return file.read().strip()
        except FileNotFoundError:
            return None


class PrintQueuePage(QWidget):
    """Print Queue Page with Single Cancel & Print Button for Each User."""

    def __init__(self, parent):
        super().__init__()
        self.parent = parent
        self.init_ui()
        self.fetch_print_queue()
        self.start_timer()

    def init_ui(self):
        layout = QVBoxLayout()

        # Title
        self.label = QLabel("🖨️ Print Queue")
        self.label.setStyleSheet("font-size: 24px; font-weight: bold; text-align: center;")
        layout.addWidget(self.label)

        # Table
        self.table = QTableWidget()
        self.table.setColumnCount(3)
        self.table.setHorizontalHeaderLabels(["User", "Details", "Actions"])
        self.table.horizontalHeader().setSectionResizeMode(QHeaderView.ResizeMode.Stretch)
        layout.addWidget(self.table)

        # Back to Dashboard Button
        self.back_btn = QPushButton("⬅ Back to Dashboard")
        self.back_btn.clicked.connect(lambda: self.parent.stack.setCurrentWidget(self.parent.main_content))
        layout.addWidget(self.back_btn)

        self.setLayout(layout)

    def start_timer(self):
        """Refresh queue every 2 seconds."""
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.fetch_print_queue)
        self.timer.start(6000)

    def fetch_print_queue(self):
        """Fetch print queue safely."""
        url = "https://nirmman-hackathon-two.vercel.app/shop/getqueue"
        headers = {"Authorization": f"Bearer {self.parent.get_jwt_token()}"}

        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                self.update_table(response.json())
            else:
                print(f"Failed to fetch queue: {response.status_code} - {response.text}")
                self.table.setRowCount(0)  # Clear table if API fails
        except requests.exceptions.RequestException as e:
            print(f"Network Error: {e}")

    def update_table(self, queue_data):
        """Update the table and ensure buttons are visible."""
        self.table.setRowCount(0)  # Clear previous data

        for user in queue_data:
            row = self.table.rowCount()
            self.table.insertRow(row)

            # Column 1: User Name
            self.table.setItem(row, 0, QTableWidgetItem(user["name"]))

            # Column 2: File Count & Amount
            details = f"Files: {len(user['printFiles'])} | Amount: ₹{user['total_amt']}"
            self.table.setItem(row, 1, QTableWidgetItem(details))

            # Column 3: Buttons - (Preview, Cancel, Print)
            action_widget = QWidget()
            action_layout = QVBoxLayout()

            # 👁️ Preview Files Button
            preview_btn = QPushButton("👁️ Preview Files")
            preview_btn.clicked.connect(lambda checked, u=user: self.preview_files(u))
            action_layout.addWidget(preview_btn)

            # ❌ Cancel Request Button (Send request_id to API)
            cancel_btn = QPushButton("❌ Cancel Request")
            cancel_btn.clicked.connect(lambda checked, u_id=user["id"]: self.cancel_request(u_id, user["printFiles"][0]["printRequestId"] if user["printFiles"] else None))
            action_layout.addWidget(cancel_btn)

            # 🖨️ Print Files Button
            print_btn = QPushButton("🖨️ Print")

            # Only enable the print button if there are files in printFiles
            if user["printFiles"]:
                print_btn.clicked.connect(lambda checked, req_id=user["printFiles"][0]["printRequestId"]: self.print_files(req_id))
            else:
                print_btn.setEnabled(False)  # Disable print button if no files

            action_layout.addWidget(print_btn)

            # Set layout for action buttons inside the cell
            action_layout.setContentsMargins(0, 0, 0, 0)
            action_widget.setLayout(action_layout)

            # Set widget in the table cell
            self.table.setCellWidget(row, 2, action_widget)

            # Ensure row height is set so buttons are visible
            self.table.setRowHeight(row, 60)

    def preview_files(self, user):
        """Preview files (open links in the browser)."""
        for file in user["printFiles"]:
            webbrowser.open(file["cloud_address"])

    def cancel_request(self, user_id, request_id):
        """Cancel the print request for a user using a GET request."""
        if request_id:
            url = f"https://nirmman-hackathon-two.vercel.app/shop/markcomplete/{request_id}"
            headers = {"Authorization": f"Bearer {self.parent.get_jwt_token()}"}

            try:
                response = requests.get(url, headers=headers)  # 🔹 Using GET request instead of DELETE
                if response.status_code == 200:
                    print(f"Request {request_id} canceled successfully")
                    self.fetch_print_queue()  # Refresh the queue after deletion
                else:
                    print(f"Cancel failed: {response.text}")
            except requests.exceptions.RequestException as e:
                print(f"Error: {e}")

    def print_files(self, request_id):
        """Mark request as complete and print files automatically."""
        mark_complete_url = f"https://nirmman-hackathon-two.vercel.app/shop/markcomplete/{request_id}"
        headers = {"Authorization": f"Bearer {self.parent.get_jwt_token()}"}

        try:
            from auto_printer import process_print_request
            process_print_request(request_id,self.parent.get_jwt_token())
            # Mark request as complete
            response = requests.get(mark_complete_url, headers=headers)
            if response.status_code == 200:
                print(f"✅ Request {request_id} marked as complete.")

                # Start automatic printing
                
                self.fetch_print_queue()  # Refresh queue
            else:
                print(f"❌ Mark complete failed: {response.text}")
        except requests.exceptions.RequestException as e:
            print(f"⚠️ Network error: {e}")
