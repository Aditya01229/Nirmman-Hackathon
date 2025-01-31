from PyQt6.QtWidgets import QApplication, QStackedWidget
from login import LoginPage
from register import RegisterPage
from dashboard import DashboardPage  # Import dashboard page
import sys

class MainApp(QStackedWidget):
    def __init__(self):
        super().__init__()

        # Create pages
        self.login_page = LoginPage(self)
        self.register_page = RegisterPage(self)
        self.dashboard_page = DashboardPage(self)  # Create dashboard page

        # Add pages to stack
        self.addWidget(self.login_page)
        self.addWidget(self.register_page)
        self.addWidget(self.dashboard_page)  # Add dashboard to the stack

        # Set default page
        self.setCurrentWidget(self.login_page)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainApp()
    window.showMaximized()  # Maximize the window
    sys.exit(app.exec())

app.setStyleSheet("""
    QWidget {
        background-color: #f5f5f5;
    }
    QLabel {
        font-size: 18px;
    }
    QLineEdit {
        padding: 8px;
        font-size: 16px;
        border: 2px solid #ccc;
        border-radius: 5px;
    }
    QPushButton {
        padding: 10px;
        font-size: 16px;
        background-color: #0078D7;
        color: white;
        border-radius: 5px;
    }
    QPushButton:hover {
        background-color: #005BB5;
    }
""")
