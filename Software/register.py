from PyQt6.QtWidgets import QWidget, QVBoxLayout, QLabel, QLineEdit, QPushButton, QMessageBox
import requests

class RegisterPage(QWidget):
    def __init__(self, parent):
        super().__init__()
        self.parent = parent
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout()

        # Title
        self.label = QLabel("📝 Register")
        self.label.setStyleSheet("font-size: 24px; font-weight: bold;")
        layout.addWidget(self.label)

        # Name Input
        self.name_input = QLineEdit()
        self.name_input.setPlaceholderText("Enter Name")
        layout.addWidget(self.name_input)

        # Phone Input
        self.phone_input = QLineEdit()
        self.phone_input.setPlaceholderText("Enter Number")
        layout.addWidget(self.phone_input)

        # Email Input
        self.email_input = QLineEdit()
        self.email_input.setPlaceholderText("Enter Email")
        layout.addWidget(self.email_input)

        # Password Input
        self.password_input = QLineEdit()
        self.password_input.setPlaceholderText("Enter Password")
        self.password_input.setEchoMode(QLineEdit.EchoMode.Password)
        layout.addWidget(self.password_input)

        # Register Button
        self.register_btn = QPushButton("Register")
        self.register_btn.clicked.connect(self.register)
        layout.addWidget(self.register_btn)

        # Back to Login
        self.login_btn = QPushButton("Back to Login")
        self.login_btn.clicked.connect(lambda: self.parent.setCurrentWidget(self.parent.login_page))
        layout.addWidget(self.login_btn)

        self.setLayout(layout)

    def register(self):
        name = self.name_input.text()
        email = self.email_input.text()
        password = self.password_input.text()
        phone= self.phone_input.text()

        if not name or not email or not password:
            QMessageBox.warning(self, "Error", "All fields are required!")
            return

        # API Call
        url = "https://nirmman-hackathon-two.vercel.app/shop/shopentry"
        data = {"name": name,"phn_number": phone,"email": email,"password":password}
        response = requests.post(url, json=data)

        if response.status_code == 201:
            QMessageBox.information(self, "Success", "Registration successful!")
            self.parent.setCurrentWidget(self.parent.login_page)
        else:
            QMessageBox.critical(self, "Error", "Registration failed")
