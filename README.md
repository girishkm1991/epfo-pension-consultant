# 📋 EPFO Pension Consultant CRM

A professional web application for EPFO (Employees' Provident Fund Organization) pension consultants to manage clients, track payments, and handle follow-up reminders efficiently.

## ✨ Features

### 👥 Client Management
- Add and manage client profiles with complete information
- Track personal details (DOB, AADHAR, PAN)
- Store EPFO-specific data (UAN, pension status, monthly amount)
- Contact information and address management
- Service type and fee tracking
- Payment status monitoring
- Client notes and history

### 💰 Payment Tracking
- Record payments with multiple methods (Cash, UPI, Bank Transfer, Cheque)
- Track partial and full payments
- Payment history per client
- Monthly revenue analytics
- Payment method breakdown

### 🔔 Follow-up Reminders
- Create reminders for various tasks:
  - Follow-up calls
  - Payment due dates
  - Document submissions
  - Status checks
  - Meeting schedules
- Set priority levels (Low, Medium, High)
- Track reminder completion
- Overdue reminder highlighting

### 📊 Dashboard & Reports
- Real-time statistics:
  - Total clients count
  - Monthly revenue
  - Total collected amount
  - Pending follow-ups
- Today's meetings overview
- Recent payments list
- Pending reminders
- Monthly revenue reports
- Client statistics
- Collection rate tracking
- Payment method breakdown

### ⚙️ Settings & Data Management
- Backup and restore data
- Export to CSV
- Data import/export functionality
- Clear all data option

## 🚀 Quick Start

### Local Usage
1. Open `index.html` in your browser directly
2. Or use a simple HTTP server:
   ```bash
   npx http-server -p 8000
   # Visit http://localhost:8000
   ```

### Data Storage
- All data stored in browser's localStorage
- Persists between sessions
- No server required
- Backup feature available

## 🌐 Deployment to EC2

### Prerequisites
- EC2 instance (Ubuntu/Amazon Linux)
- SSH access
- Git installed

### Setup Steps

**1. SSH to your instance:**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

**2. Clone repository:**
```bash
cd /home/ubuntu
git clone https://github.com/your-username/epfo-pension-consultant.git
cd epfo-pension-consultant
```

**3. Install Nginx:**
```bash
sudo apt-get update
sudo apt-get install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

**4. Configure Nginx:**
```bash
sudo nano /etc/nginx/sites-available/default
```

Replace the `root` line with:
```nginx
root /home/ubuntu/epfo-pension-consultant;
```

Add this location block:
```nginx
location / {
    try_files $uri $uri/ =404;
}
```

**5. Test and reload:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

**6. Update Security Group:**
- Allow HTTP (port 80) and HTTPS (port 443)
- Restrict access as needed

**7. Access your app:**
```
http://your-ec2-public-ip
```

## 📱 Features Deep Dive

### Dashboard
- Quick overview of key metrics
- Today's schedule
- Recent transactions
- Pending actions

### All Clients
- View all registered clients
- Filter by status (Active/Inactive)
- Sort and search functionality
- Quick action buttons (View, Edit, Delete)
- CSV export

### Add Client
- Comprehensive form with sections:
  - Personal Information
  - EPFO Details
  - Contact Information
  - Service Details
  - Notes
- Auto-save functionality
- Form validation

### Payment Records
- Track all payments
- Payment method breakdown
- Client-wise payment history
- Payment trend analysis

### Reminders
- Create follow-up reminders
- Priority-based organization
- Completion tracking
- Overdue highlighting
- Multiple reminder types

### Reports
- Monthly revenue analysis
- Client statistics
- Collection rates
- Payment method breakdown
- Trend analysis

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Storage:** Browser LocalStorage
- **Server:** Nginx/Apache (for production)
- **Responsive:** Mobile-friendly design
- **Compatibility:** All modern browsers

## 📋 Default Data Structure

### Client Object
```javascript
{
  id: number,
  name: string,
  dob: date,
  aadhar: string,
  pan: string,
  uan: string,
  pensionStatus: string,
  pensionAmount: number,
  pensionStartDate: date,
  phone: string,
  email: string,
  address: string,
  serviceType: string,
  serviceFee: number,
  paymentStatus: string,
  amountPaid: number,
  notes: string,
  status: string,
  createdAt: timestamp
}
```

### Payment Object
```javascript
{
  id: number,
  clientId: number,
  amount: number,
  date: date,
  method: string,
  description: string,
  createdAt: timestamp
}
```

### Reminder Object
```javascript
{
  id: number,
  clientId: number,
  type: string,
  date: date,
  priority: string,
  description: string,
  completed: boolean,
  createdAt: timestamp
}
```

## 🔐 Privacy & Security

- Data stored locally on device
- No data sent to external servers
- Backup encryption recommended
- Regular data backups suggested

## 🚀 Future Enhancements

- Cloud database integration (MongoDB/Firebase)
- Multi-user support with authentication
- Email/SMS notifications
- Calendar integration
- Advanced reporting and analytics
- Mobile app version
- PDF invoice generation
- Integration with payment gateways
- Pension amount tracking
- Document management system

## 📞 Support

For issues or feature requests, please create an issue in the repository.

## 📄 License

MIT License - Free to use and modify

---

**Made with ❤️ for EPFO Pension Consultants**
