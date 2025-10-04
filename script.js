// Course Data Structure
const coursesData = [
    {
        id: 1,
        title: "Web Development Fundamentals",
        description: "Learn the basics of HTML, CSS, and JavaScript to build modern websites.",
        duration: "8 weeks",
        lessons: [
            {
                id: 1,
                title: "Introduction to HTML",
                description: "Understanding HTML structure and basic tags",
                duration: "45 min",
                completed: false
            },
            {
                id: 2,
                title: "CSS Styling Basics",
                description: "Learn how to style your HTML with CSS",
                duration: "60 min",
                completed: false
            },
            {
                id: 3,
                title: "JavaScript Fundamentals",
                description: "Introduction to JavaScript programming",
                duration: "90 min",
                completed: false
            },
            {
                id: 4,
                title: "Responsive Design",
                description: "Making your websites work on all devices",
                duration: "75 min",
                completed: false
            }
        ]
    },
    {
        id: 2,
        title: "Python Programming",
        description: "Master Python programming from basics to advanced concepts.",
        duration: "12 weeks",
        lessons: [
            {
                id: 1,
                title: "Python Basics",
                description: "Variables, data types, and basic operations",
                duration: "60 min",
                completed: false
            },
            {
                id: 2,
                title: "Control Structures",
                description: "Loops, conditionals, and functions",
                duration: "90 min",
                completed: false
            },
            {
                id: 3,
                title: "Data Structures",
                description: "Lists, dictionaries, and tuples",
                duration: "75 min",
                completed: false
            },
            {
                id: 4,
                title: "Object-Oriented Programming",
                description: "Classes, objects, and inheritance",
                duration: "120 min",
                completed: false
            },
            {
                id: 5,
                title: "File Handling",
                description: "Reading and writing files in Python",
                duration: "45 min",
                completed: false
            }
        ]
    },
    {
        id: 3,
        title: "Data Science with R",
        description: "Learn data analysis and visualization using R programming.",
        duration: "10 weeks",
        lessons: [
            {
                id: 1,
                title: "R Basics",
                description: "Introduction to R programming language",
                duration: "60 min",
                completed: false
            },
            {
                id: 2,
                title: "Data Manipulation",
                description: "Working with data frames and dplyr",
                duration: "90 min",
                completed: false
            },
            {
                id: 3,
                title: "Data Visualization",
                description: "Creating charts and graphs with ggplot2",
                duration: "75 min",
                completed: false
            },
            {
                id: 4,
                title: "Statistical Analysis",
                description: "Basic statistical tests and analysis",
                duration: "105 min",
                completed: false
            }
        ]
    },
    {
        id: 4,
        title: "Digital Marketing",
        description: "Learn modern digital marketing strategies and tools.",
        duration: "6 weeks",
        lessons: [
            {
                id: 1,
                title: "Marketing Fundamentals",
                description: "Understanding modern marketing principles",
                duration: "45 min",
                completed: false
            },
            {
                id: 2,
                title: "Social Media Marketing",
                description: "Leveraging social platforms for business",
                duration: "60 min",
                completed: false
            },
            {
                id: 3,
                title: "SEO and Content Marketing",
                description: "Search engine optimization and content strategy",
                duration: "75 min",
                completed: false
            },
            {
                id: 4,
                title: "Email Marketing",
                description: "Building and managing email campaigns",
                duration: "50 min",
                completed: false
            }
        ]
    }
];

// Application State
let currentPage = 'auth';
let currentCourse = null;
let currentUser = null;
let userProgress = JSON.parse(localStorage.getItem('userProgress')) || {};
let users = JSON.parse(localStorage.getItem('users')) || {};
let isSignUp = false;
let isAdmin = false;
let activityLog = JSON.parse(localStorage.getItem('activityLog')) || [];
let editingCourseId = null;

// Utility function to prevent duplicate welcome messages
function removeAllWelcomeMessages() {
    const allWelcomes = document.querySelectorAll('.user-welcome');
    allWelcomes.forEach(welcome => welcome.remove());
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthStatus();
    
    // Initialize admin user
    initializeAdminUser();
});

// Initialize application
function initializeApp() {
    // This will be called when user logs in
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.getElementById('home-link').addEventListener('click', () => showPage('home'));
    document.getElementById('progress-link').addEventListener('click', () => showPage('progress'));
    document.getElementById('admin-link').addEventListener('click', () => showPage('admin'));
    document.getElementById('logout-link').addEventListener('click', logout);
    document.getElementById('back-to-home').addEventListener('click', () => showPage('home'));
    
    // Authentication
    document.getElementById('auth-form').addEventListener('submit', handleAuth);
    document.getElementById('auth-switch-btn').addEventListener('click', toggleAuthMode);
    
    // Admin functionality
    setupAdminEventListeners();
}

// Check authentication status
function checkAuthStatus() {
    const sessionUser = localStorage.getItem('currentUser');
    if (sessionUser) {
        currentUser = JSON.parse(sessionUser);
        isAdmin = currentUser.email === 'admin@learnhub.com';
        console.log('User logged in:', currentUser.email, 'Is Admin:', isAdmin);
        showAuthenticatedUI();
        
        // If user tries to access admin page directly, redirect to home
        if (currentPage === 'admin' && !isAdmin) {
            showPage('home');
        } else {
            showPage('home');
        }
        
        renderHomePage();
        updateProgressStats();
    } else {
        showPage('auth');
    }
}

// Show authenticated UI
function showAuthenticatedUI() {
    document.getElementById('home-link').style.display = 'inline';
    document.getElementById('progress-link').style.display = 'inline';
    document.getElementById('logout-link').style.display = 'inline';
    
    // Only show admin link for actual admin users
    if (isAdmin && currentUser && currentUser.email === 'admin@learnhub.com') {
        document.getElementById('admin-link').style.display = 'inline';
        console.log('Admin link shown');
    } else {
        document.getElementById('admin-link').style.display = 'none';
        console.log('Admin link hidden - user is not admin');
    }
}

// Hide authenticated UI
function hideAuthenticatedUI() {
    document.getElementById('home-link').style.display = 'none';
    document.getElementById('progress-link').style.display = 'none';
    document.getElementById('admin-link').style.display = 'none';
    document.getElementById('logout-link').style.display = 'none';
}

// Page navigation
function showPage(pageName) {
    // Check admin access for admin page
    if (pageName === 'admin') {
        if (!isAdmin || !currentUser || currentUser.email !== 'admin@learnhub.com') {
            alert('Access denied. Admin privileges required.');
            return;
        }
    }
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(`${pageName}-page`).classList.add('active');
    currentPage = pageName;
    
    // Render appropriate content
    if (pageName === 'home') {
        renderHomePage();
    } else if (pageName === 'progress') {
        renderProgressPage();
    } else if (pageName === 'admin') {
        renderAdminPage();
    }
}

// Render home page
function renderHomePage() {
    const coursesGrid = document.getElementById('courses-grid');
    coursesGrid.innerHTML = '';
    
    // Remove ALL existing welcome messages to prevent duplicates
    removeAllWelcomeMessages();
    
    // Add welcome message only if user exists
    if (currentUser && currentUser.name) {
        const welcomeDiv = document.createElement('div');
        welcomeDiv.className = 'user-welcome';
        welcomeDiv.innerHTML = `
            <h3>Welcome back, ${currentUser.name}!</h3>
        `;
        coursesGrid.parentNode.insertBefore(welcomeDiv, coursesGrid);
    }
    
    coursesData.forEach(course => {
        const userCourseProgress = userProgress[currentUser.id] && userProgress[currentUser.id][course.id];
        const progress = userCourseProgress || {
            completed: false,
            lessonsCompleted: 0,
            totalLessons: course.lessons.length
        };
        
        const status = progress.completed ? 'completed' : 
                      progress.lessonsCompleted > 0 ? 'in-progress' : 'not-started';
        
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.innerHTML = `
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <div class="course-meta">
                <span class="course-duration">${course.duration}</span>
                <span class="course-status status-${status}">
                    ${status === 'completed' ? 'Completed' : 
                      status === 'in-progress' ? 'In Progress' : 'Not Started'}
                </span>
            </div>
        `;
        
        courseCard.addEventListener('click', () => showCourseDetail(course.id));
        coursesGrid.appendChild(courseCard);
    });
}

// Show course detail page
function showCourseDetail(courseId) {
    currentCourse = coursesData.find(course => course.id === courseId);
    showPage('course-detail');
    renderCourseDetail();
}

// Render course detail page
function renderCourseDetail() {
    const userCourseProgress = userProgress[currentUser.id] && userProgress[currentUser.id][currentCourse.id];
    const progress = userCourseProgress || {
        completed: false,
        lessonsCompleted: 0,
        totalLessons: currentCourse.lessons.length
    };
    
    const progressPercentage = Math.round((progress.lessonsCompleted / progress.totalLessons) * 100);
    
    // Update course header
    document.getElementById('course-title').textContent = currentCourse.title;
    document.getElementById('course-description').textContent = currentCourse.description;
    document.getElementById('progress-fill').style.width = `${progressPercentage}%`;
    document.getElementById('progress-text').textContent = `${progressPercentage}% Complete`;
    
    // Render lessons
    const lessonsList = document.getElementById('lessons-list');
    lessonsList.innerHTML = '';
    
    currentCourse.lessons.forEach((lesson, index) => {
        const lessonItem = document.createElement('div');
        lessonItem.className = `lesson-item ${lesson.completed ? 'completed' : ''}`;
        lessonItem.innerHTML = `
            <div class="lesson-title">${lesson.title}</div>
            <div class="lesson-description">${lesson.description}</div>
            <div class="lesson-actions">
                <span class="lesson-duration">${lesson.duration}</span>
                <button class="complete-btn ${lesson.completed ? 'completed' : ''}" 
                        onclick="toggleLessonCompletion(${index})"
                        ${lesson.completed ? 'disabled' : ''}>
                    ${lesson.completed ? 'Completed' : 'Mark Complete'}
                </button>
            </div>
        `;
        lessonsList.appendChild(lessonItem);
    });
}

// Toggle lesson completion
function toggleLessonCompletion(lessonIndex) {
    const lesson = currentCourse.lessons[lessonIndex];
    lesson.completed = !lesson.completed;
    
    // Initialize user progress if not exists
    if (!userProgress[currentUser.id]) {
        userProgress[currentUser.id] = {};
    }
    if (!userProgress[currentUser.id][currentCourse.id]) {
        userProgress[currentUser.id][currentCourse.id] = {
            completed: false,
            lessonsCompleted: 0,
            totalLessons: currentCourse.lessons.length
        };
    }
    
    // Update progress
    const progress = userProgress[currentUser.id][currentCourse.id];
    progress.lessonsCompleted = currentCourse.lessons.filter(l => l.completed).length;
    progress.completed = progress.lessonsCompleted === progress.totalLessons;
    
    saveProgress();
    renderCourseDetail();
    updateProgressStats();
}

// Render progress page
function renderProgressPage() {
    updateProgressStats();
    
    const progressCourses = document.getElementById('progress-courses');
    progressCourses.innerHTML = '';
    
    coursesData.forEach(course => {
        const userCourseProgress = userProgress[currentUser.id] && userProgress[currentUser.id][course.id];
        const progress = userCourseProgress || {
            completed: false,
            lessonsCompleted: 0,
            totalLessons: course.lessons.length
        };
        
        const progressPercentage = Math.round((progress.lessonsCompleted / progress.totalLessons) * 100);
        
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.innerHTML = `
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <div class="course-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                </div>
                <span>${progressPercentage}% Complete (${progress.lessonsCompleted}/${progress.totalLessons} lessons)</span>
            </div>
            <div class="course-meta">
                <span class="course-duration">${course.duration}</span>
                <span class="course-status status-${progress.completed ? 'completed' : 'in-progress'}">
                    ${progress.completed ? 'Completed' : 'In Progress'}
                </span>
            </div>
        `;
        
        courseCard.addEventListener('click', () => showCourseDetail(course.id));
        progressCourses.appendChild(courseCard);
    });
}

// Update progress statistics
function updateProgressStats() {
    if (!currentUser) return;
    
    const userCourseProgress = userProgress[currentUser.id] || {};
    const completedCourses = Object.values(userCourseProgress).filter(p => p.completed).length;
    
    document.getElementById('completed-courses').textContent = completedCourses;
}

// Save progress to localStorage
function saveProgress() {
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
}

// Reset progress (for testing purposes)
function resetProgress() {
    localStorage.removeItem('userProgress');
    userProgress = {};
    initializeApp();
    if (currentPage === 'home') {
        renderHomePage();
    } else if (currentPage === 'progress') {
        renderProgressPage();
    } else if (currentPage === 'course-detail' && currentCourse) {
        renderCourseDetail();
    }
}

// Authentication Functions
function toggleAuthMode() {
    isSignUp = !isSignUp;
    const nameGroup = document.getElementById('name-group');
    const confirmPasswordGroup = document.getElementById('confirm-password-group');
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const authSubmitBtn = document.getElementById('auth-submit-btn');
    const authSwitchText = document.getElementById('auth-switch-text');
    const authSwitchBtn = document.getElementById('auth-switch-btn');
    
    if (isSignUp) {
        nameGroup.style.display = 'block';
        confirmPasswordGroup.style.display = 'block';
        authTitle.textContent = 'Create Your Account';
        authSubtitle.textContent = 'Join LearnHub and start your learning journey';
        authSubmitBtn.textContent = 'Sign Up';
        authSwitchText.textContent = 'Already have an account?';
        authSwitchBtn.textContent = 'Sign In';
    } else {
        nameGroup.style.display = 'none';
        confirmPasswordGroup.style.display = 'none';
        authTitle.textContent = 'Welcome to LearnHub';
        authSubtitle.textContent = 'Sign in to continue your learning journey';
        authSubmitBtn.textContent = 'Sign In';
        authSwitchText.textContent = 'Don\'t have an account?';
        authSwitchBtn.textContent = 'Sign Up';
    }
    
    // Clear form
    document.getElementById('auth-form').reset();
    clearMessages();
}

function handleAuth(e) {
    e.preventDefault();
    clearMessages();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const name = formData.get('name');
    const confirmPassword = formData.get('confirm-password');
    
    console.log('Form submission:', { isSignUp, email, hasPassword: !!password, name, hasConfirmPassword: !!confirmPassword });
    
    if (isSignUp) {
        handleSignUp(email, password, name, confirmPassword);
    } else {
        handleSignIn(email, password);
    }
}

function handleSignUp(email, password, name, confirmPassword) {
    console.log('Sign up attempt:', { email, name, hasPassword: !!password, hasConfirmPassword: !!confirmPassword });
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showError('Please fill in all fields.');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('Passwords do not match.');
        return;
    }
    
    if (password.length < 6) {
        showError('Password must be at least 6 characters long.');
        return;
    }
    
    if (users[email]) {
        showError('An account with this email already exists.');
        return;
    }
    
    // Create new user
    const userId = Date.now().toString();
    users[email] = {
        id: userId,
        name: name,
        email: email,
        password: password, // In production, hash this password
        createdAt: new Date().toISOString()
    };
    
    // Initialize user progress
    userProgress[userId] = {};
    coursesData.forEach(course => {
        userProgress[userId][course.id] = {
            completed: false,
            lessonsCompleted: 0,
            totalLessons: course.lessons.length
        };
    });
    
    saveUsers();
    saveProgress();
    
    showSuccess('Account created successfully!');
    setTimeout(() => {
        currentUser = users[email];
        isAdmin = currentUser.email === 'admin@learnhub.com';
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showAuthenticatedUI();
        showPage('home');
        removeAllWelcomeMessages(); // Prevent duplicates
        renderHomePage();
        updateProgressStats();
        console.log('User signed up and logged in:', currentUser);
    }, 1000);
}

function handleSignIn(email, password) {
    console.log('Sign in attempt:', { email, hasPassword: !!password });
    
    if (!email || !password) {
        showError('Please enter both email and password.');
        return;
    }
    
    const user = users[email];
    if (!user) {
        showError('No account found with this email.');
        return;
    }
    
    if (user.password !== password) {
        showError('Incorrect password.');
        return;
    }
    
    currentUser = user;
    isAdmin = currentUser.email === 'admin@learnhub.com';
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showSuccess('Welcome back!');
    
    setTimeout(() => {
        showAuthenticatedUI();
        showPage('home');
        removeAllWelcomeMessages(); // Prevent duplicates
        renderHomePage();
        updateProgressStats();
        console.log('User signed in:', currentUser, 'Is Admin:', isAdmin);
    }, 1000);
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    hideAuthenticatedUI();
    showPage('auth');
    isSignUp = false;
    toggleAuthMode();
}

function showError(message) {
    const authCard = document.querySelector('.auth-card');
    const existingError = authCard.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    authCard.insertBefore(errorDiv, authCard.querySelector('.auth-form'));
}

function showSuccess(message) {
    const authCard = document.querySelector('.auth-card');
    const existingSuccess = authCard.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    authCard.insertBefore(successDiv, authCard.querySelector('.auth-form'));
}

function clearMessages() {
    const authCard = document.querySelector('.auth-card');
    const existingError = authCard.querySelector('.error-message');
    const existingSuccess = authCard.querySelector('.success-message');
    if (existingError) existingError.remove();
    if (existingSuccess) existingSuccess.remove();
}

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

// Admin Functionality
function setupAdminEventListeners() {
    // Admin tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!isAdmin || !currentUser || currentUser.email !== 'admin@learnhub.com') {
                alert('Access denied. Admin privileges required.');
                return;
            }
            const tab = e.target.dataset.tab;
            switchAdminTab(tab);
        });
    });
    
    // Course management
    const addCourseBtn = document.getElementById('add-course-btn');
    const courseForm = document.getElementById('course-form');
    const addLessonBtn = document.getElementById('add-lesson-btn');
    const cancelCourseBtn = document.getElementById('cancel-course');
    const closeBtn = document.querySelector('.close');
    const userSearch = document.getElementById('user-search');
    const courseModal = document.getElementById('course-modal');
    
    if (addCourseBtn) addCourseBtn.addEventListener('click', () => {
        if (!isAdmin || !currentUser || currentUser.email !== 'admin@learnhub.com') {
            alert('Access denied. Admin privileges required.');
            return;
        }
        openCourseModal();
    });
    
    if (courseForm) courseForm.addEventListener('submit', (e) => {
        if (!isAdmin || !currentUser || currentUser.email !== 'admin@learnhub.com') {
            alert('Access denied. Admin privileges required.');
            e.preventDefault();
            return;
        }
        handleCourseSubmit(e);
    });
    
    if (addLessonBtn) addLessonBtn.addEventListener('click', () => {
        if (!isAdmin || !currentUser || currentUser.email !== 'admin@learnhub.com') {
            alert('Access denied. Admin privileges required.');
            return;
        }
        addLessonField();
    });
    
    if (cancelCourseBtn) cancelCourseBtn.addEventListener('click', closeCourseModal);
    if (closeBtn) closeBtn.addEventListener('click', closeCourseModal);
    
    if (userSearch) userSearch.addEventListener('input', () => {
        if (!isAdmin || !currentUser || currentUser.email !== 'admin@learnhub.com') {
            return;
        }
        filterUsers();
    });
    
    // Modal close on outside click
    if (courseModal) {
        courseModal.addEventListener('click', (e) => {
            if (e.target.id === 'course-modal') {
                closeCourseModal();
            }
        });
    }
}

function switchAdminTab(tabName) {
    console.log('Switching to tab:', tabName);
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeTabBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTabBtn) {
        activeTabBtn.classList.add('active');
    }
    
    // Update tab content
    document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    const activeTabContent = document.getElementById(`admin-${tabName}`);
    if (activeTabContent) {
        activeTabContent.classList.add('active');
    }
    
    // Load tab-specific data
    if (tabName === 'overview') {
        loadAdminOverview();
    } else if (tabName === 'courses') {
        loadCoursesTable();
    } else if (tabName === 'users') {
        loadUsersTable();
    } else if (tabName === 'analytics') {
        loadAnalytics();
    }
}

function renderAdminPage() {
    // Double-check admin access
    if (!isAdmin || !currentUser || currentUser.email !== 'admin@learnhub.com') {
        alert('Access denied. Admin privileges required.');
        showPage('home');
        return;
    }
    
    // Ensure we're on the overview tab by default
    switchAdminTab('overview');
}

function loadAdminOverview() {
    // Update admin stats
    const totalUsers = Object.keys(users).length;
    const totalCourses = coursesData.length;
    const activeUsers = Object.keys(userProgress).length;
    const completedLessons = Object.values(userProgress).reduce((total, userProgress) => {
        return total + Object.values(userProgress).reduce((userTotal, courseProgress) => {
            return userTotal + (courseProgress.lessonsCompleted || 0);
        }, 0);
    }, 0);
    
    document.getElementById('admin-total-users').textContent = totalUsers;
    document.getElementById('admin-total-courses').textContent = totalCourses;
    document.getElementById('admin-active-users').textContent = activeUsers;
    document.getElementById('admin-completed-lessons').textContent = completedLessons;
    
    // Load recent activity
    loadRecentActivity();
}

function loadRecentActivity() {
    const activityList = document.getElementById('activity-list');
    activityList.innerHTML = '';
    
    // Get recent activities (last 10)
    const recentActivities = activityLog.slice(-10).reverse();
    
    if (recentActivities.length === 0) {
        activityList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No recent activity</p>';
        return;
    }
    
    recentActivities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        const iconClass = activity.type === 'user' ? 'user' : 
                         activity.type === 'course' ? 'course' : 'lesson';
        
        activityItem.innerHTML = `
            <div class="activity-icon ${iconClass}">${activity.type.charAt(0).toUpperCase()}</div>
            <div class="activity-content">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
            </div>
            <div class="activity-time">${formatTime(activity.timestamp)}</div>
        `;
        
        activityList.appendChild(activityItem);
    });
}

function loadCoursesTable() {
    const tbody = document.getElementById('courses-table-body');
    tbody.innerHTML = '';
    
    coursesData.forEach(course => {
        const studentsCount = Object.values(userProgress).filter(userProgress => 
            userProgress[course.id] && userProgress[course.id].lessonsCompleted > 0
        ).length;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.title}</td>
            <td>${course.lessons.length}</td>
            <td>${course.duration}</td>
            <td>${studentsCount}</td>
            <td>
                <button class="btn-secondary" onclick="editCourse(${course.id})">Edit</button>
                <button class="btn-danger" onclick="deleteCourse(${course.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function loadUsersTable() {
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = '';
    
    Object.values(users).forEach(user => {
        const userProgressData = userProgress[user.id] || {};
        const completedCourses = Object.values(userProgressData).filter(progress => progress.completed).length;
        const joinDate = new Date(user.createdAt).toLocaleDateString();
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${joinDate}</td>
            <td>${completedCourses} courses completed</td>
            <td>
                <button class="btn-success" onclick="viewUserProgress('${user.id}')">View Progress</button>
                <button class="btn-danger" onclick="deleteUser('${user.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function loadAnalytics() {
    // Simple analytics display (in a real app, you'd use a charting library)
    const completionChart = document.getElementById('completion-chart');
    const engagementChart = document.getElementById('engagement-chart');
    
    // Course completion rates
    const courseStats = coursesData.map(course => {
        const studentsCount = Object.values(userProgress).filter(userProgress => 
            userProgress[course.id] && userProgress[course.id].lessonsCompleted > 0
        ).length;
        const completedCount = Object.values(userProgress).filter(userProgress => 
            userProgress[course.id] && userProgress[course.id].completed
        ).length;
        
        return {
            name: course.title,
            completionRate: studentsCount > 0 ? Math.round((completedCount / studentsCount) * 100) : 0
        };
    });
    
    completionChart.innerHTML = `
        <div style="text-align: center;">
            <h4>Course Completion Rates</h4>
            ${courseStats.map(stat => `
                <div style="margin: 1rem 0; padding: 0.5rem; background: #f8f9fa; border-radius: 5px;">
                    <strong>${stat.name}</strong>: ${stat.completionRate}%
                </div>
            `).join('')}
        </div>
    `;
    
    // User engagement
    const totalUsers = Object.keys(users).length;
    const activeUsers = Object.keys(userProgress).length;
    const engagementRate = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
    
    engagementChart.innerHTML = `
        <div style="text-align: center;">
            <h4>User Engagement</h4>
            <div style="font-size: 2rem; font-weight: bold; color: #667eea; margin: 1rem 0;">
                ${engagementRate}%
            </div>
            <p>${activeUsers} of ${totalUsers} users are active</p>
        </div>
    `;
}

function openCourseModal(courseId = null) {
    editingCourseId = courseId;
    const modal = document.getElementById('course-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('course-form');
    
    if (courseId) {
        const course = coursesData.find(c => c.id === courseId);
        title.textContent = 'Edit Course';
        document.getElementById('course-title-input').value = course.title;
        document.getElementById('course-description-input').value = course.description;
        document.getElementById('course-duration-input').value = course.duration;
        
        // Load existing lessons
        const lessonsContainer = document.getElementById('lessons-container');
        lessonsContainer.innerHTML = '';
        course.lessons.forEach(lesson => {
            addLessonField(lesson.title, lesson.description, lesson.duration);
        });
    } else {
        title.textContent = 'Add New Course';
        form.reset();
        document.getElementById('lessons-container').innerHTML = '';
    }
    
    modal.style.display = 'block';
}

function closeCourseModal() {
    document.getElementById('course-modal').style.display = 'none';
    editingCourseId = null;
}

function addLessonField(title = '', description = '', duration = '') {
    const container = document.getElementById('lessons-container');
    const lessonDiv = document.createElement('div');
    lessonDiv.className = 'lesson-item-admin';
    lessonDiv.innerHTML = `
        <input type="text" placeholder="Lesson Title" value="${title}" required>
        <input type="text" placeholder="Description" value="${description}" required>
        <input type="text" placeholder="Duration" value="${duration}" required>
        <button type="button" onclick="this.parentElement.remove()">×</button>
    `;
    container.appendChild(lessonDiv);
}

function handleCourseSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('course-title-input').value;
    const description = document.getElementById('course-description-input').value;
    const duration = document.getElementById('course-duration-input').value;
    
    // Collect lessons
    const lessonInputs = document.querySelectorAll('.lesson-item-admin');
    const lessons = Array.from(lessonInputs).map((lessonDiv, index) => {
        const inputs = lessonDiv.querySelectorAll('input');
        return {
            id: index + 1,
            title: inputs[0].value,
            description: inputs[1].value,
            duration: inputs[2].value,
            completed: false
        };
    });
    
    if (editingCourseId) {
        // Update existing course
        const courseIndex = coursesData.findIndex(c => c.id === editingCourseId);
        coursesData[courseIndex] = {
            ...coursesData[courseIndex],
            title,
            description,
            duration,
            lessons
        };
        logActivity('course', 'Course Updated', `${title} has been updated`);
    } else {
        // Add new course
        const newCourse = {
            id: Math.max(...coursesData.map(c => c.id)) + 1,
            title,
            description,
            duration,
            lessons
        };
        coursesData.push(newCourse);
        logActivity('course', 'Course Created', `${title} has been added`);
    }
    
    saveCourses();
    closeCourseModal();
    loadCoursesTable();
}

function editCourse(courseId) {
    openCourseModal(courseId);
}

function deleteCourse(courseId) {
    if (confirm('Are you sure you want to delete this course?')) {
        const course = coursesData.find(c => c.id === courseId);
        coursesData.splice(coursesData.findIndex(c => c.id === courseId), 1);
        logActivity('course', 'Course Deleted', `${course.title} has been deleted`);
        saveCourses();
        loadCoursesTable();
    }
}

function viewUserProgress(userId) {
    const user = users[Object.keys(users).find(email => users[email].id === userId)];
    alert(`User Progress for ${user.name}:\n\nThis would show detailed progress in a real application.`);
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        const userEmail = Object.keys(users).find(email => users[email].id === userId);
        const user = users[userEmail];
        delete users[userEmail];
        delete userProgress[userId];
        logActivity('user', 'User Deleted', `${user.name} has been deleted`);
        saveUsers();
        saveProgress();
        loadUsersTable();
    }
}

function filterUsers() {
    const searchTerm = document.getElementById('user-search').value.toLowerCase();
    const rows = document.querySelectorAll('#users-table-body tr');
    
    rows.forEach(row => {
        const name = row.cells[0].textContent.toLowerCase();
        const email = row.cells[1].textContent.toLowerCase();
        
        if (name.includes(searchTerm) || email.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function logActivity(type, title, description) {
    activityLog.push({
        type,
        title,
        description,
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 100 activities
    if (activityLog.length > 100) {
        activityLog = activityLog.slice(-100);
    }
    
    localStorage.setItem('activityLog', JSON.stringify(activityLog));
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
}

function saveCourses() {
    localStorage.setItem('coursesData', JSON.stringify(coursesData));
}

// Initialize admin user if not exists
function initializeAdminUser() {
    if (!users['admin@learnhub.com']) {
        users['admin@learnhub.com'] = {
            id: 'admin',
            name: 'Admin User',
            email: 'admin@learnhub.com',
            password: 'admin123',
            createdAt: new Date().toISOString()
        };
        saveUsers();
        console.log('Admin user created: admin@learnhub.com / admin123');
    }
}

// Add reset button functionality (for development)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize admin user
    initializeAdminUser();
    
    // Add debug buttons for development
    const debugContainer = document.createElement('div');
    debugContainer.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    `;
    
    // Reset button
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset All Data';
    resetBtn.style.cssText = `
        background: #dc3545;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        cursor: pointer;
    `;
    resetBtn.addEventListener('click', () => {
        if (confirm('This will reset all data including user accounts. Are you sure?')) {
            localStorage.clear();
            location.reload();
        }
    });
    
    // Admin login button
    const adminBtn = document.createElement('button');
    adminBtn.textContent = 'Login as Admin';
    adminBtn.style.cssText = `
        background: #007bff;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        cursor: pointer;
    `;
    adminBtn.addEventListener('click', () => {
        currentUser = users['admin@learnhub.com'];
        isAdmin = true;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showAuthenticatedUI();
        showPage('home');
        renderHomePage();
        updateProgressStats();
        console.log('Logged in as admin');
    });
    
    // Test user button
    const testUserBtn = document.createElement('button');
    testUserBtn.textContent = 'Create Test User';
    testUserBtn.style.cssText = `
        background: #28a745;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        cursor: pointer;
    `;
    testUserBtn.addEventListener('click', () => {
        const testEmail = 'test@example.com';
        const testUser = {
            id: 'test123',
            name: 'Test User',
            email: testEmail,
            password: 'test123',
            createdAt: new Date().toISOString()
        };
        users[testEmail] = testUser;
        saveUsers();
        console.log('Test user created:', testEmail, 'password: test123');
        alert('Test user created! Email: test@example.com, Password: test123');
    });
    
    debugContainer.appendChild(adminBtn);
    debugContainer.appendChild(testUserBtn);
    debugContainer.appendChild(resetBtn);
    document.body.appendChild(debugContainer);
});
