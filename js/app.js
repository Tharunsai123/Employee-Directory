// Employee Directory App - Main JavaScript File

// State Management
const state = {
    employees: [],
    filteredEmployees: [],
    currentPage: 1,
    pageSize: 10,
    sortBy: '',
    filters: {
        firstName: '',
        department: '',
        role: ''
    },
    editingEmployee: null
};

// Mock Data - Initial employees
const mockEmployees = [
    { id: 1, firstName: 'Tharun', lastName: 'Sai', email: 'tharun@example.com', department: 'HR', role: 'Manager' },
    { id: 2, firstName: 'Pranav', lastName: 'Ranga Sai', email: 'pranav@example.com', department: 'Finance', role: 'Analyst' },
    { id: 3, firstName: 'Sasidhar', lastName: 'Naga', email: 'sasidhar@example.com', department: 'IT', role: 'Developer' },
    { id: 4, firstName: 'Prakash', lastName: 'Reddy', email: 'prakash@example.com', department: 'Marketing', role: 'Designer' },
    { id: 5, firstName: 'Shabari', lastName: 'Nath', email: 'shabari@example.com', department: 'Sales', role: 'Executive' },
    { id: 6, firstName: 'Jay', lastName: 'Krishna', email: 'jay@example.com', department: 'IT', role: 'Developer' },
    { id: 7, firstName: 'Janardhan', lastName: 'Reddy', email: 'janardhan@example.com', department: 'HR', role: 'Executive' },
    { id: 8, firstName: 'Chaitanya', lastName: 'kumar', email: 'chaitanya@example.com', department: 'Finance', role: 'Manager' },
    { id: 9, firstName: 'Sudheer', lastName: 'kumar', email: 'sudheer@example.com', department: 'IT', role: 'Manager' },
    { id: 10, firstName: 'Jathin', lastName: 'Sundhar', email: 'Jathin@example.com', department: 'Marketing', role: 'Analyst' },
    { id: 11, firstName: 'Dhoni', lastName: 'M S', email: 'dhoni@example.com', department: 'Sales', role: 'Manager' },
    { id: 12, firstName: 'Virat', lastName: 'Kohli', email: 'virat@example.com', department: 'HR', role: 'Analyst' }
];

// DOM Elements
const elements = {
    employeeGrid: document.getElementById('employeeGrid'),
    searchInput: document.getElementById('searchInput'),
    sortSelect: document.getElementById('sortSelect'),
    pageSizeSelect: document.getElementById('pageSize'),
    filterBtn: document.getElementById('filterBtn'),
    addEmployeeBtn: document.getElementById('addEmployeeBtn'),
    filterSidebar: document.getElementById('filterSidebar'),
    employeeModal: document.getElementById('employeeModal'),
    deleteModal: document.getElementById('deleteModal'),
    employeeForm: document.getElementById('employeeForm'),
    pagination: document.getElementById('pagination')
};

// Initialize App
function initApp() {
    // Load data from localStorage or use mock data
    const savedEmployees = localStorage.getItem('employees');
    state.employees = savedEmployees ? JSON.parse(savedEmployees) : [...mockEmployees];
    state.filteredEmployees = [...state.employees];
    
    // Set up event listeners
    setupEventListeners();
    
    // Initial render
    renderEmployees();
}

// Event Listeners Setup
function setupEventListeners() {
    // Search
    elements.searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    // Sort
    elements.sortSelect.addEventListener('change', handleSort);
    
    // Page size
    elements.pageSizeSelect.addEventListener('change', handlePageSizeChange);
    
    // Filter
    elements.filterBtn.addEventListener('click', () => toggleFilterSidebar(true));
    document.getElementById('closeFilter').addEventListener('click', () => toggleFilterSidebar(false));
    document.getElementById('applyFilter').addEventListener('click', applyFilters);
    document.getElementById('resetFilter').addEventListener('click', resetFilters);
    
    // Add Employee
    elements.addEmployeeBtn.addEventListener('click', () => openEmployeeModal());
    
    // Modal controls
    document.getElementById('closeModal').addEventListener('click', closeEmployeeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeEmployeeModal);
    elements.employeeForm.addEventListener('submit', handleEmployeeSubmit);
    
    // Delete modal
    document.getElementById('cancelDelete').addEventListener('click', closeDeleteModal);
    document.getElementById('confirmDelete').addEventListener('click', confirmDelete);
    
    // Close modals on outside click
    elements.employeeModal.addEventListener('click', (e) => {
        if (e.target === elements.employeeModal) closeEmployeeModal();
    });
    elements.deleteModal.addEventListener('click', (e) => {
        if (e.target === elements.deleteModal) closeDeleteModal();
    });
}

// Search functionality
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    state.filteredEmployees = state.employees.filter(emp => {
        const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
        return fullName.includes(searchTerm) || emp.email.toLowerCase().includes(searchTerm);
    });
    
    state.currentPage = 1;
    renderEmployees();
}

// Sort functionality
function handleSort() {
    const sortBy = elements.sortSelect.value;
    
    if (!sortBy) {
        state.filteredEmployees = [...state.employees];
    } else {
        state.filteredEmployees.sort((a, b) => {
            if (sortBy === 'firstName') {
                return a.firstName.localeCompare(b.firstName);
            } else if (sortBy === 'department') {
                return a.department.localeCompare(b.department);
            }
            return 0;
        });
    }
    
    state.currentPage = 1;
    renderEmployees();
}

// Page size change
function handlePageSizeChange() {
    state.pageSize = parseInt(elements.pageSizeSelect.value);
    state.currentPage = 1;
    renderEmployees();
}

// Filter sidebar toggle
function toggleFilterSidebar(show) {
    elements.filterSidebar.classList.toggle('active', show);
}

// Apply filters
function applyFilters() {
    const firstName = document.getElementById('filterFirstName').value.toLowerCase();
    const department = document.getElementById('filterDepartment').value;
    const role = document.getElementById('filterRole').value;
    
    state.filters = { firstName, department, role };
    
    state.filteredEmployees = state.employees.filter(emp => {
        const matchFirstName = !firstName || emp.firstName.toLowerCase().includes(firstName);
        const matchDepartment = !department || emp.department === department;
        const matchRole = !role || emp.role === role;
        
        return matchFirstName && matchDepartment && matchRole;
    });
    
    state.currentPage = 1;
    renderEmployees();
    toggleFilterSidebar(false);
}

// Reset filters
function resetFilters() {
    document.getElementById('filterFirstName').value = '';
    document.getElementById('filterDepartment').value = '';
    document.getElementById('filterRole').value = '';
    
    state.filters = { firstName: '', department: '', role: '' };
    state.filteredEmployees = [...state.employees];
    
    state.currentPage = 1;
    renderEmployees();
}

// Render employees
function renderEmployees() {
    const start = (state.currentPage - 1) * state.pageSize;
    const end = start + state.pageSize;
    const paginatedEmployees = state.filteredEmployees.slice(start, end);
    
    if (paginatedEmployees.length === 0) {
        elements.employeeGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <h3>No employees found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
    } else {
        elements.employeeGrid.innerHTML = paginatedEmployees.map(employee => `
            <div class="employee-card" data-id="${employee.id}">
                <h3 class="employee-name">${employee.firstName} ${employee.lastName}</h3>
                <div class="employee-info"><strong>Email:</strong> ${employee.email}</div>
                <div class="employee-info"><strong>Department:</strong> ${employee.department}</div>
                <div class="employee-info"><strong>Role:</strong> ${employee.role}</div>
                <div class="card-actions">
                    <button class="btn btn-primary btn-sm" onclick="editEmployee(${employee.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteEmployee(${employee.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }
    
    renderPagination();
}

// Render pagination
function renderPagination() {
    const totalPages = Math.ceil(state.filteredEmployees.length / state.pageSize);
    
    if (totalPages <= 1) {
        elements.pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button onclick="changePage(${state.currentPage - 1})" 
                ${state.currentPage === 1 ? 'disabled' : ''}>
            Previous
        </button>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= state.currentPage - 2 && i <= state.currentPage + 2)) {
            paginationHTML += `
                <button onclick="changePage(${i})" 
                        class="${i === state.currentPage ? 'active' : ''}">
                    ${i}
                </button>
            `;
        } else if (i === state.currentPage - 3 || i === state.currentPage + 3) {
            paginationHTML += '<span>...</span>';
        }
    }
    
    // Next button
    paginationHTML += `
        <button onclick="changePage(${state.currentPage + 1})" 
                ${state.currentPage === totalPages ? 'disabled' : ''}>
            Next
        </button>
    `;
    
    // Page info
    paginationHTML += `
        <span class="pagination-info">
            Page ${state.currentPage} of ${totalPages}
        </span>
    `;
    
    elements.pagination.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(state.filteredEmployees.length / state.pageSize);
    if (page >= 1 && page <= totalPages) {
        state.currentPage = page;
        renderEmployees();
    }
}

// Open employee modal
function openEmployeeModal(employee = null) {
    state.editingEmployee = employee;
    
    // Update modal title
    document.getElementById('modalTitle').textContent = employee ? 'Edit Employee' : 'Add Employee';
    
    // Reset form
    elements.employeeForm.reset();
    clearFormErrors();
    
    // Fill form if editing
    if (employee) {
        document.getElementById('firstName').value = employee.firstName;
        document.getElementById('lastName').value = employee.lastName;
        document.getElementById('email').value = employee.email;
        document.getElementById('department').value = employee.department;
        document.getElementById('role').value = employee.role;
    }
    
    elements.employeeModal.classList.add('active');
}

// Close employee modal
function closeEmployeeModal() {
    elements.employeeModal.classList.remove('active');
    state.editingEmployee = null;
}

// Handle employee form submission
function handleEmployeeSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        department: document.getElementById('department').value,
        role: document.getElementById('role').value
    };
    
    if (state.editingEmployee) {
        // Update existing employee
        const index = state.employees.findIndex(emp => emp.id === state.editingEmployee.id);
        state.employees[index] = { ...state.employees[index], ...formData };
        showToast('Employee updated successfully', 'success');
    } else {
        // Add new employee
        const newEmployee = {
            id: Date.now(),
            ...formData
        };
        state.employees.push(newEmployee);
        showToast('Employee added successfully', 'success');
    }
    
    // Save to localStorage
    localStorage.setItem('employees', JSON.stringify(state.employees));
    
    // Reset filtered employees and render
    state.filteredEmployees = [...state.employees];
    applyCurrentFiltersAndSort();
    renderEmployees();
    closeEmployeeModal();
}

// Form validation
function validateForm() {
    let isValid = true;
    clearFormErrors();
    
    // First Name validation
    const firstName = document.getElementById('firstName').value.trim();
    if (!firstName) {
        showFormError('firstName', 'First name is required');
        isValid = false;
    } else if (firstName.length < 2) {
        showFormError('firstName', 'First name must be at least 2 characters');
        isValid = false;
    }
    
    // Last Name validation
    const lastName = document.getElementById('lastName').value.trim();
    if (!lastName) {
        showFormError('lastName', 'Last name is required');
        isValid = false;
    } else if (lastName.length < 2) {
        showFormError('lastName', 'Last name must be at least 2 characters');
        isValid = false;
    }
    
    // Email validation
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        showFormError('email', 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showFormError('email', 'Please enter a valid email address');
        isValid = false;
    } else {
        // Check for duplicate email
        const isDuplicate = state.employees.some(emp => 
            emp.email === email && emp.id !== state.editingEmployee?.id
        );
        if (isDuplicate) {
            showFormError('email', 'Email already exists');
            isValid = false;
        }
    }
    
    // Department validation
    const department = document.getElementById('department').value;
    if (!department) {
        showFormError('department', 'Department is required');
        isValid = false;
    }
    
    // Role validation
    const role = document.getElementById('role').value;
    if (!role) {
        showFormError('role', 'Role is required');
        isValid = false;
    }
    
    return isValid;
}

// Show form error
function showFormError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}Error`);
    const inputElement = document.getElementById(fieldName);
    
    errorElement.textContent = message;
    inputElement.classList.add('error');
}

// Clear form errors
function clearFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    const inputElements = document.querySelectorAll('.form-input');
    
    errorElements.forEach(el => el.textContent = '');
    inputElements.forEach(el => el.classList.remove('error'));
}

// Edit employee
function editEmployee(id) {
    const employee = state.employees.find(emp => emp.id === id);
        if (employee) {
        openEmployeeModal(employee);
    }
}

// Delete employee
function deleteEmployee(id) {
    const employee = state.employees.find(emp => emp.id === id);
    if (employee) {
        document.getElementById('deleteEmployeeName').textContent = 
            `${employee.firstName} ${employee.lastName}`;
        elements.deleteModal.classList.add('active');
        elements.deleteModal.dataset.employeeId = id;
    }
}

// Close delete modal
function closeDeleteModal() {
    elements.deleteModal.classList.remove('active');
    delete elements.deleteModal.dataset.employeeId;
}

// Confirm delete
function confirmDelete() {
    const id = parseInt(elements.deleteModal.dataset.employeeId);
    
    // Remove from state
    state.employees = state.employees.filter(emp => emp.id !== id);
    state.filteredEmployees = state.filteredEmployees.filter(emp => emp.id !== id);
    
    // Save to localStorage
    localStorage.setItem('employees', JSON.stringify(state.employees));
    
    // Re-render
    renderEmployees();
    closeDeleteModal();
    showToast('Employee deleted successfully', 'success');
}

// Apply current filters and sort
function applyCurrentFiltersAndSort() {
    // Apply search
    const searchTerm = elements.searchInput.value.toLowerCase();
    if (searchTerm) {
        state.filteredEmployees = state.filteredEmployees.filter(emp => {
            const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
            return fullName.includes(searchTerm) || emp.email.toLowerCase().includes(searchTerm);
        });
    }
    
    // Apply filters
    if (state.filters.firstName || state.filters.department || state.filters.role) {
        state.filteredEmployees = state.filteredEmployees.filter(emp => {
            const matchFirstName = !state.filters.firstName || 
                emp.firstName.toLowerCase().includes(state.filters.firstName);
            const matchDepartment = !state.filters.department || 
                emp.department === state.filters.department;
            const matchRole = !state.filters.role || emp.role === state.filters.role;
            
            return matchFirstName && matchDepartment && matchRole;
        });
    }
    
    // Apply sort
    const sortBy = elements.sortSelect.value;
    if (sortBy) {
        state.filteredEmployees.sort((a, b) => {
            if (sortBy === 'firstName') {
                return a.firstName.localeCompare(b.firstName);
            } else if (sortBy === 'department') {
                return a.department.localeCompare(b.department);
            }
            return 0;
        });
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Hide and remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Debounce utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);