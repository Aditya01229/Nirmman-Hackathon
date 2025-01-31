import requests
from PyQt6.QtWidgets import QWidget, QVBoxLayout, QLabel, QLineEdit, QPushButton, QMessageBox
import json

class LoginPage(QWidget):
    def __init__(self, parent):
        super().__init__()
        self.parent = parent
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout()

        # Title
        self.label = QLabel("🔐 Login")
        self.label.setStyleSheet("font-size: 24px; font-weight: bold;")
        layout.addWidget(self.label)

        # Email Input
        self.email_input = QLineEdit()
        self.email_input.setPlaceholderText("Enter Email")
        layout.addWidget(self.email_input)

        # Password Input
        self.password_input = QLineEdit()
        self.password_input.setPlaceholderText("Enter Password")
        self.password_input.setEchoMode(QLineEdit.EchoMode.Password)
        layout.addWidget(self.password_input)

        # Login Button
        self.login_btn = QPushButton("Login")
        self.login_btn.clicked.connect(self.login)
        layout.addWidget(self.login_btn)

        # Register Link
        self.register_btn = QPushButton("Create an Account")
        self.register_btn.clicked.connect(lambda: self.parent.setCurrentWidget(self.parent.register_page))
        layout.addWidget(self.register_btn)

        self.setLayout(layout)

    def login(self):
        email = self.email_input.text()
        password = self.password_input.text()

        if not email or not password:
            QMessageBox.warning(self, "Error", "All fields are required!")
            return

        # API Call
        url = "https://nirmman-hackathon-two.vercel.app/shop/login"
        data = {"email": email, "password": password}
        
        try:
            response = requests.post(url, json=data)
            
            print(f"Status Code: {response.status_code}")  # Debugging: print status code
            print(f"Response Data: {response.text}")  # Debugging: print the raw response data

            if response.status_code == 201:
                # Check if JWT token is returned in the response
                response_data = response.json()
                token = response_data.get("token")  # Assuming JWT token is returned
                if token:
                    self.store_jwt_token(token)  # Store the token locally
                    QMessageBox.information(self, "Success", "Login successful!")
                    self.parent.setCurrentWidget(self.parent.dashboard_page)  # Navigate to dashboard
                else:
                    QMessageBox.critical(self, "Error", "JWT token not found in response.")
            else:
                QMessageBox.critical(self, "Error", f"Login failed: {response.text}")
        except requests.exceptions.RequestException as e:
            QMessageBox.critical(self, "Error", f"An error occurred: {str(e)}")

    def store_jwt_token(self, token):
        with open("jwt_token.txt", "w") as file:
            file.write(token)  # Save token to a file
