// EPFO Pension Consultant CRM Application
class EPFOConsultantCRM {
    constructor() {
        this.clients = JSON.parse(localStorage.getItem('epfoClients')) || [];
        this.payments = JSON.parse(localStorage.getItem('epfoPayments')) || [];
        this.reminders = JSON.parse(localStorage.getItem('epfoReminders')) || [];
        this.nextId = JSON.parse(localStorage.getItem('nextEPFOId')) || 1;
        this.editingClientId = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.populateSelectOptions();
        this.renderDashboard();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleNavigation(btn));
        });

        // Forms
        document.getElementById('clientForm')?.addEventListener('submit', (e) => this.handleAddClient(e));
        document.getElementById('paymentForm')?.addEventListener('submit', (e) => this.handleAddPayment(e));
        document.getElementById('reminderForm')?.addEventListener('submit', (e) => this.handleAddReminder(e));

        // Filters
        document.getElementById('statusFilter')?.addEventListener('change', () => this.renderClients());

        // Month navigation
        document.getElementById('prevMonth')?.addEventListener('click', () => this.previousMonth());
        document.getElementById('nextMonth')?.addEventListener('click', () => this.nextMonth());

        // Search
        document.getElementById('searchInput')?.addEventListener('input', (e) => this.handleSearch(e.target.value));
    }

    handleNavigation(btn) {
        // Update active button
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Get page name
        const pageName = btn.getAttribute('data-page');
        this.switchPage(pageName);
    }

    switchPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));

        // Show selected page
        const page = document.getElementById(pageName);
        if (page) {
            page.classList.add('active');
        }

        // Update page title
        const titleMap = {
            'dashboard': 'Dashboard',
            'clients': 'All Clients',
            'add-client': this.editingClientId ? 'Edit Client' : 'Add New Client',
            'payments': 'Payment Records',
            'reminders': 'Follow-up Reminders',
            'add-reminder': 'Add Reminder',
            'reports': 'Reports & Analytics',
            'settings': 'Settings'
        };
        document.getElementById('pageTitle').textContent = titleMap[pageName] || 'Dashboard';

        // Render content
        if (pageName === 'dashboard') this.renderDashboard();
        else if (pageName === 'clients') this.renderClients();
        else if (pageName === 'payments') this.renderPayments();
        else if (pageName === 'reminders') this.renderReminders();
        else if (pageName === 'reports') this.renderReports();
    }

    // CLIENT MANAGEMENT
    handleAddClient(e) {
        e.preventDefault();

        if (this.editingClientId) {
            // Update existing client
            const client = this.clients.find(c => c.id === this.editingClientId);
            if (client) {
                client.name = document.getElementById('clientName').value;
                client.dob = document.getElementById('clientDOB').value;
                client.aadhar = document.getElementById('aadhar').value;
                client.pan = document.getElementById('pan').value;
                client.uan = document.getElementById('uan').value;
                client.pensionStatus = document.getElementById('pensionStatus').value;
                client.pensionAmount = parseFloat(document.getElementById('pensionAmount').value) || 0;
                client.pensionStartDate = document.getElementById('pensionStartDate').value;
                client.phone = document.getElementById('phone').value;
                client.email = document.getElementById('email').value;
                client.address = document.getElementById('address').value;
                client.serviceType = document.getElementById('serviceType').value;
                client.serviceFee = parseFloat(document.getElementById('serviceFee').value);
                client.paymentStatus = document.getElementById('paymentStatus').value;
                client.amountPaid = parseFloat(document.getElementById('amountPaid').value) || 0;
                client.notes = document.getElementById('notes').value;
                client.updatedAt = new Date().toISOString();

                this.saveData();
                this.showAlert('Client updated successfully!', 'success');
                this.editingClientId = null;
                document.getElementById('clientForm').reset();
                this.switchPage('clients');
            }
        } else {
            // Add new client
            const client = {
                id: this.nextId++,
                name: document.getElementById('clientName').value,
                dob: document.getElementById('clientDOB').value,
                aadhar: document.getElementById('aadhar').value,
                pan: document.getElementById('pan').value,
                uan: document.getElementById('uan').value,
                pensionStatus: document.getElementById('pensionStatus').value,
                pensionAmount: parseFloat(document.getElementById('pensionAmount').value) || 0,
                pensionStartDate: document.getElementById('pensionStartDate').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                address: document.getElementById('address').value,
                serviceType: document.getElementById('serviceType').value,
                serviceFee: parseFloat(document.getElementById('serviceFee').value),
                paymentStatus: document.getElementById('paymentStatus').value,
                amountPaid: parseFloat(document.getElementById('amountPaid').value) || 0,
                notes: document.getElementById('notes').value,
                createdAt: new Date().toISOString(),
                status: 'active'
            };

            this.clients.push(client);
            this.saveData();
            this.showAlert('Client added successfully!', 'success');
            document.getElementById('clientForm').reset();
            this.switchPage('clients');
        }
        this.populateSelectOptions();
    }

    renderClients() {
        const container = document.getElementById('clientsList');
        const statusFilter = document.getElementById('statusFilter')?.value || 'all';

        let filtered = this.clients;
        if (statusFilter !== 'all') {
            filtered = this.clients.filter(c => c.status === statusFilter);
        }

        if (filtered.length === 0) {
            container.innerHTML = '<div class="no-data"><p>No clients found</p></div>';
            return;
        }

        const html = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>UAN</th>
                            <th>Phone</th>
                            <th>Service</th>
                            <th>Fee</th>
                            <th>Paid</th>
                            <th>Pending</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filtered.map(client => `
                            <tr>
                                <td>${this.escapeHtml(client.name)}</td>
                                <td>${this.escapeHtml(client.uan)}</td>
                                <td>${this.escapeHtml(client.phone)}</td>
                                <td>${client.serviceType}</td>
                                <td>₹${client.serviceFee.toFixed(0)}</td>
                                <td>₹${client.amountPaid.toFixed(0)}</td>
                                <td>₹${(client.serviceFee - client.amountPaid).toFixed(0)}</td>
                                <td><span class="badge badge-${client.paymentStatus}">${client.paymentStatus}</span></td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn btn-sm btn-secondary" onclick="app.viewClient(${client.id})">View</button>
                                        <button class="btn btn-sm btn-secondary" onclick="app.editClient(${client.id})">Edit</button>
                                        <button class="btn btn-sm btn-danger" onclick="app.deleteClient(${client.id})">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        container.innerHTML = html;
    }

    viewClient(id) {
        const client = this.clients.find(c => c.id === id);
        if (!client) return;

        const clientPayments = this.payments.filter(p => p.clientId === id);
        const pendingReminders = this.reminders.filter(r => r.clientId === id && !r.completed);

        const html = `
            <div class="client-detail">
                <h3>${this.escapeHtml(client.name)}</h3>
                <div class="detail-grid">
                    <div class="detail-section">
                        <h4>Personal Information</h4>
                        <p><strong>DOB:</strong> ${client.dob || 'N/A'}</p>
                        <p><strong>AADHAR:</strong> ${this.escapeHtml(client.aadhar) || 'N/A'}</p>
                        <p><strong>PAN:</strong> ${this.escapeHtml(client.pan) || 'N/A'}</p>
                    </div>
                    <div class="detail-section">
                        <h4>EPFO Details</h4>
                        <p><strong>UAN:</strong> ${this.escapeHtml(client.uan)}</p>
                        <p><strong>Status:</strong> ${client.pensionStatus}</p>
                        <p><strong>Monthly Amount:</strong> ₹${client.pensionAmount}</p>
                        <p><strong>Start Date:</strong> ${client.pensionStartDate || 'N/A'}</p>
                    </div>
                    <div class="detail-section">
                        <h4>Contact</h4>
                        <p><strong>Phone:</strong> ${this.escapeHtml(client.phone)}</p>
                        <p><strong>Email:</strong> ${this.escapeHtml(client.email) || 'N/A'}</p>
                        <p><strong>Address:</strong> ${this.escapeHtml(client.address) || 'N/A'}</p>
                    </div>
                    <div class="detail-section">
                        <h4>Service Details</h4>
                        <p><strong>Type:</strong> ${client.serviceType}</p>
                        <p><strong>Fee:</strong> ₹${client.serviceFee}</p>
                        <p><strong>Paid:</strong> ₹${client.amountPaid}</p>
                        <p><strong>Pending:</strong> ₹${client.serviceFee - client.amountPaid}</p>
                    </div>
                </div>
                <div class="detail-section">
                    <h4>Payment History</h4>
                    ${clientPayments.length > 0 ? `
                        <table>
                            <thead>
                                <tr><th>Date</th><th>Amount</th><th>Method</th><th>Description</th></tr>
                            </thead>
                            <tbody>
                                ${clientPayments.map(p => `
                                    <tr>
                                        <td>${this.formatDate(p.date)}</td>
                                        <td>₹${p.amount}</td>
                                        <td>${p.method}</td>
                                        <td>${this.escapeHtml(p.description)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : '<p>No payments yet</p>'}
                </div>
                ${client.notes ? `
                    <div class="detail-section">
                        <h4>Notes</h4>
                        <p>${this.escapeHtml(client.notes)}</p>
                    </div>
                ` : ''}
            </div>
        `;

        document.getElementById('modalBody').innerHTML = html;
        document.getElementById('clientModal').style.display = 'block';
    }

    editClient(id) {
        const client = this.clients.find(c => c.id === id);
        if (!client) return;

        // Populate form with client data
        document.getElementById('clientName').value = client.name;
        document.getElementById('clientDOB').value = client.dob || '';
        document.getElementById('aadhar').value = client.aadhar || '';
        document.getElementById('pan').value = client.pan || '';
        document.getElementById('uan').value = client.uan;
        document.getElementById('pensionStatus').value = client.pensionStatus;
        document.getElementById('pensionAmount').value = client.pensionAmount;
        document.getElementById('pensionStartDate').value = client.pensionStartDate || '';
        document.getElementById('phone').value = client.phone;
        document.getElementById('email').value = client.email || '';
        document.getElementById('address').value = client.address || '';
        document.getElementById('serviceType').value = client.serviceType;
        document.getElementById('serviceFee').value = client.serviceFee;
        document.getElementById('paymentStatus').value = client.paymentStatus;
        document.getElementById('amountPaid').value = client.amountPaid;
        document.getElementById('notes').value = client.notes || '';

        // Set editing flag
        this.editingClientId = id;

        // Change button text
        const submitBtn = document.querySelector('#clientForm button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Update Client';
        }

        // Switch to add-client page
        this.switchPage('add-client');

        // Scroll to form
        document.querySelector('#add-client').scrollIntoView({ behavior: 'smooth' });
    }

    deleteClient(id) {
        if (confirm('Are you sure you want to delete this client?')) {
            this.clients = this.clients.filter(c => c.id !== id);
            this.payments = this.payments.filter(p => p.clientId !== id);
            this.saveData();
            this.renderClients();
            this.showAlert('Client deleted successfully!', 'success');
        }
    }

    // PAYMENT MANAGEMENT
    handleAddPayment(e) {
        e.preventDefault();

        const clientId = parseInt(document.getElementById('paymentClientId').value);
        const amount = parseFloat(document.getElementById('paymentAmount').value);

        // Update client payment info
        const client = this.clients.find(c => c.id === clientId);
        if (client) {
            client.amountPaid += amount;
            if (client.amountPaid >= client.serviceFee) {
                client.paymentStatus = 'paid';
            } else if (client.amountPaid > 0) {
                client.paymentStatus = 'partial';
            }
        }

        // Record payment
        const payment = {
            id: Date.now(),
            clientId: clientId,
            amount: amount,
            date: document.getElementById('paymentDate').value,
            method: document.getElementById('paymentMethod').value,
            description: document.getElementById('paymentDescription').value,
            createdAt: new Date().toISOString()
        };

        this.payments.push(payment);
        this.saveData();
        this.showAlert('Payment recorded successfully!', 'success');
        document.getElementById('paymentForm').reset();
        this.switchPage('payments');
    }

    renderPayments() {
        const container = document.getElementById('paymentsList');

        if (this.payments.length === 0) {
            container.innerHTML = '<div class="no-data"><p>No payments recorded yet</p></div>';
            return;
        }

        const html = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Client Name</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Method</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.payments.map(payment => {
                            const client = this.clients.find(c => c.id === payment.clientId);
                            return `
                                <tr>
                                    <td>${client ? this.escapeHtml(client.name) : 'Unknown'}</td>
                                    <td>₹${payment.amount.toFixed(0)}</td>
                                    <td>${this.formatDate(payment.date)}</td>
                                    <td>${payment.method}</td>
                                    <td>${this.escapeHtml(payment.description)}</td>
                                    <td>
                                        <button class="btn btn-sm btn-danger" onclick="app.deletePayment(${payment.id})">Delete</button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
        container.innerHTML = html;
    }

    deletePayment(id) {
        const payment = this.payments.find(p => p.id === id);
        if (!payment) return;

        if (confirm('Are you sure you want to delete this payment?')) {
            // Revert payment from client
            const client = this.clients.find(c => c.id === payment.clientId);
            if (client) {
                client.amountPaid -= payment.amount;
                if (client.amountPaid === 0) {
                    client.paymentStatus = 'pending';
                } else if (client.amountPaid < client.serviceFee) {
                    client.paymentStatus = 'partial';
                }
            }

            this.payments = this.payments.filter(p => p.id !== id);
            this.saveData();
            this.renderPayments();
            this.showAlert('Payment deleted successfully!', 'success');
        }
    }

    // REMINDER MANAGEMENT
    handleAddReminder(e) {
        e.preventDefault();

        const reminder = {
            id: Date.now(),
            clientId: parseInt(document.getElementById('reminderClientId').value),
            type: document.getElementById('reminderType').value,
            date: document.getElementById('reminderDate').value,
            priority: document.getElementById('reminderPriority').value,
            description: document.getElementById('reminderDescription').value,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.reminders.push(reminder);
        this.saveData();
        this.showAlert('Reminder created successfully!', 'success');
        document.getElementById('reminderForm').reset();
        this.switchPage('reminders');
    }

    renderReminders() {
        const container = document.getElementById('remindersList');
        const today = new Date().toISOString().split('T')[0];
        const sorted = this.reminders.sort((a, b) => new Date(a.date) - new Date(b.date));

        if (sorted.length === 0) {
            container.innerHTML = '<div class="no-data"><p>No reminders set</p></div>';
            return;
        }

        const html = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Client</th>
                            <th>Type</th>
                            <th>Priority</th>
                            <th>Due Date</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sorted.map(reminder => {
                            const client = this.clients.find(c => c.id === reminder.clientId);
                            const isOverdue = reminder.date < today && !reminder.completed;
                            return `
                                <tr style="${isOverdue ? 'background-color: #ffe6e6;' : ''}">
                                    <td>${client ? this.escapeHtml(client.name) : 'Unknown'}</td>
                                    <td>${reminder.type}</td>
                                    <td><span class="priority-badge priority-${reminder.priority}">${reminder.priority}</span></td>
                                    <td>${this.formatDate(reminder.date)}</td>
                                    <td>${this.escapeHtml(reminder.description)}</td>
                                    <td>${reminder.completed ? '✓ Completed' : 'Pending'}</td>
                                    <td>
                                        <div class="action-buttons">
                                            ${!reminder.completed ? `
                                                <button class="btn btn-sm btn-success" onclick="app.completeReminder(${reminder.id})">Done</button>
                                            ` : ''}
                                            <button class="btn btn-sm btn-danger" onclick="app.deleteReminder(${reminder.id})">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
        container.innerHTML = html;
    }

    completeReminder(id) {
        const reminder = this.reminders.find(r => r.id === id);
        if (reminder) {
            reminder.completed = true;
            this.saveData();
            this.renderReminders();
            this.showAlert('Reminder marked as completed!', 'success');
        }
    }

    deleteReminder(id) {
        if (confirm('Delete this reminder?')) {
            this.reminders = this.reminders.filter(r => r.id !== id);
            this.saveData();
            this.renderReminders();
            this.showAlert('Reminder deleted!', 'success');
        }
    }

    // DASHBOARD
    renderDashboard() {
        const today = new Date().toISOString().split('T')[0];
        const thisMonth = new Date().toISOString().substring(0, 7);

        // Stats
        document.getElementById('totalClients').textContent = this.clients.length;

        const monthRevenue = this.payments
            .filter(p => p.date.startsWith(thisMonth))
            .reduce((sum, p) => sum + p.amount, 0);
        document.getElementById('monthRevenue').textContent = '₹' + monthRevenue.toFixed(0);

        const totalCollected = this.payments.reduce((sum, p) => sum + p.amount, 0);
        document.getElementById('totalCollected').textContent = '₹' + totalCollected.toFixed(0);

        const pendingFollowups = this.reminders.filter(r => !r.completed).length;
        document.getElementById('pendingFollowups').textContent = pendingFollowups;

        // Today's Meetings
        const todaysMeetings = this.reminders.filter(r => r.date === today && !r.completed);
        const meetingsHtml = todaysMeetings.length === 0
            ? '<p class="no-data">No meetings today</p>'
            : todaysMeetings.map(r => {
                const client = this.clients.find(c => c.id === r.clientId);
                return `<div class="list-item ${r.priority}">
                    <div><strong>${client?.name || 'Unknown'}</strong><br>${r.type}</div>
                    <span>${r.priority}</span>
                </div>`;
            }).join('');
        document.getElementById('todaysMeetings').innerHTML = meetingsHtml;

        // Recent Payments
        const recentPayments = this.payments.slice(-5).reverse();
        const paymentsHtml = recentPayments.length === 0
            ? '<p class="no-data">No recent payments</p>'
            : recentPayments.map(p => {
                const client = this.clients.find(c => c.id === p.clientId);
                return `<div class="list-item">
                    <div><strong>${client?.name || 'Unknown'}</strong><br>₹${p.amount} - ${p.method}</div>
                    <span>${this.formatDate(p.date)}</span>
                </div>`;
            }).join('');
        document.getElementById('recentPayments').innerHTML = paymentsHtml;

        // Pending Reminders
        const pendingReminders = this.reminders.filter(r => !r.completed).slice(0, 5);
        const remindersHtml = pendingReminders.length === 0
            ? '<p class="no-data">No pending reminders</p>'
            : pendingReminders.map(r => {
                const client = this.clients.find(c => c.id === r.clientId);
                return `<div class="list-item ${r.priority}">
                    <div><strong>${client?.name || 'Unknown'}</strong><br>${r.type}</div>
                    <span>${this.formatDate(r.date)}</span>
                </div>`;
            }).join('');
        document.getElementById('pendingReminders').innerHTML = remindersHtml;
    }

    // REPORTS
    renderReports() {
        const monthValue = document.getElementById('reportMonth')?.value || new Date().toISOString().substring(0, 7);
        const [year, month] = monthValue.split('-');

        // Revenue Report
        const monthPayments = this.payments.filter(p => p.date.startsWith(monthValue));
        const totalRevenue = monthPayments.reduce((sum, p) => sum + p.amount, 0);
        const avgPayment = monthPayments.length > 0 ? totalRevenue / monthPayments.length : 0;

        const revenueHtml = `
            <div class="report-stat">
                <div class="report-stat-item">
                    <div class="report-stat-label">Total Revenue</div>
                    <div class="report-stat-value">₹${totalRevenue.toFixed(0)}</div>
                </div>
                <div class="report-stat-item">
                    <div class="report-stat-label">Transactions</div>
                    <div class="report-stat-value">${monthPayments.length}</div>
                </div>
                <div class="report-stat-item">
                    <div class="report-stat-label">Average Payment</div>
                    <div class="report-stat-value">₹${avgPayment.toFixed(0)}</div>
                </div>
            </div>
            <h5>Payment Breakdown</h5>
            ${monthPayments.length > 0 ? `
                <table>
                    <thead>
                        <tr><th>Date</th><th>Client</th><th>Amount</th><th>Method</th></tr>
                    </thead>
                    <tbody>
                        ${monthPayments.map(p => {
                            const client = this.clients.find(c => c.id === p.clientId);
                            return `
                                <tr>
                                    <td>${this.formatDate(p.date)}</td>
                                    <td>${client?.name || 'Unknown'}</td>
                                    <td>₹${p.amount}</td>
                                    <td>${p.method}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            ` : '<p>No payments this month</p>'}
        `;
        document.getElementById('revenueReport').innerHTML = revenueHtml;

        // Client Statistics
        const activeClients = this.clients.filter(c => c.status === 'active').length;
        const paidClients = this.clients.filter(c => c.paymentStatus === 'paid').length;
        const pendingPayments = this.clients.filter(c => c.paymentStatus === 'pending').length;
        const totalFees = this.clients.reduce((sum, c) => sum + c.serviceFee, 0);
        const totalPaid = this.clients.reduce((sum, c) => sum + c.amountPaid, 0);

        const statsHtml = `
            <div class="report-stat">
                <div class="report-stat-item">
                    <div class="report-stat-label">Active Clients</div>
                    <div class="report-stat-value">${activeClients}</div>
                </div>
                <div class="report-stat-item">
                    <div class="report-stat-label">Fully Paid</div>
                    <div class="report-stat-value">${paidClients}</div>
                </div>
                <div class="report-stat-item">
                    <div class="report-stat-label">Pending Payment</div>
                    <div class="report-stat-value">${pendingPayments}</div>
                </div>
                <div class="report-stat-item">
                    <div class="report-stat-label">Collection Rate</div>
                    <div class="report-stat-value">${totalFees > 0 ? ((totalPaid / totalFees) * 100).toFixed(0) : 0}%</div>
                </div>
            </div>
            <h5>Fee Summary</h5>
            <p><strong>Total Service Fees:</strong> ₹${totalFees.toFixed(0)}</p>
            <p><strong>Total Collected:</strong> ₹${totalPaid.toFixed(0)}</p>
            <p><strong>Outstanding:</strong> ₹${(totalFees - totalPaid).toFixed(0)}</p>
        `;
        document.getElementById('clientStats').innerHTML = statsHtml;

        // Payment Summary
        const paymentMethods = {};
        this.payments.forEach(p => {
            paymentMethods[p.method] = (paymentMethods[p.method] || 0) + p.amount;
        });

        const summaryHtml = `
            <div class="report-stat" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));">
                ${Object.entries(paymentMethods).map(([method, amount]) => `
                    <div class="report-stat-item">
                        <div class="report-stat-label">${method}</div>
                        <div class="report-stat-value">₹${amount.toFixed(0)}</div>
                    </div>
                `).join('')}
            </div>
        `;
        document.getElementById('paymentSummary').innerHTML = summaryHtml;
    }

    previousMonth() {
        const picker = document.getElementById('reportMonth');
        const [year, month] = picker.value.split('-');
        const date = new Date(year, parseInt(month) - 2);
        picker.value = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
        this.renderReports();
    }

    nextMonth() {
        const picker = document.getElementById('reportMonth');
        const [year, month] = picker.value.split('-');
        const date = new Date(year, parseInt(month));
        picker.value = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
        this.renderReports();
    }

    // UTILITIES
    populateSelectOptions() {
        const clientSelects = ['paymentClientId', 'reminderClientId'];
        clientSelects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                const options = this.clients.map(c => `<option value="${c.id}">${this.escapeHtml(c.name)}</option>`).join('');
                select.innerHTML = '<option value="">Choose a client...</option>' + options;
            }
        });
    }

    handleSearch(query) {
        // Search implementation
        console.log('Search:', query);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showAlert(message, type = 'success') {
        const alert = document.getElementById('alert');
        alert.textContent = message;
        alert.className = `alert ${type}`;
        alert.style.display = 'block';
        setTimeout(() => {
            alert.style.display = 'none';
        }, 3000);
    }

    closeModal() {
        document.getElementById('clientModal').style.display = 'none';
    }

    // DATA MANAGEMENT
    saveData() {
        localStorage.setItem('epfoClients', JSON.stringify(this.clients));
        localStorage.setItem('epfoPayments', JSON.stringify(this.payments));
        localStorage.setItem('epfoReminders', JSON.stringify(this.reminders));
        localStorage.setItem('nextEPFOId', JSON.stringify(this.nextId));
    }

    backupData() {
        const backup = {
            clients: this.clients,
            payments: this.payments,
            reminders: this.reminders,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('epfoBackup', JSON.stringify(backup));
        this.showAlert('Data backup created successfully!', 'success');
    }

    restoreData() {
        const backup = localStorage.getItem('epfoBackup');
        if (backup) {
            const data = JSON.parse(backup);
            this.clients = data.clients || [];
            this.payments = data.payments || [];
            this.reminders = data.reminders || [];
            this.saveData();
            this.showAlert('Data restored successfully!', 'success');
            location.reload();
        } else {
            this.showAlert('No backup found!', 'error');
        }
    }

    exportToCSV() {
        let csv = 'Name,UAN,Phone,Service Type,Fee,Paid,Pending,Status\n';
        this.clients.forEach(c => {
            csv += `"${c.name}","${c.uan}","${c.phone}","${c.serviceType}",${c.serviceFee},${c.amountPaid},${c.serviceFee - c.amountPaid},"${c.paymentStatus}"\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'clients_' + new Date().toISOString().split('T')[0] + '.csv';
        a.click();
    }

    exportClients() {
        this.exportToCSV();
    }

    clearAllData() {
        if (confirm('Are you sure? This will delete ALL data permanently!')) {
            localStorage.clear();
            this.clients = [];
            this.payments = [];
            this.reminders = [];
            this.nextId = 1;
            this.showAlert('All data cleared!', 'success');
            location.reload();
        }
    }
}

// Initialize
const app = new EPFOConsultantCRM();
