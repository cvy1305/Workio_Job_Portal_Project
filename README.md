# Workio - Job Portal Platform

A modern, full-stack job portal platform that connects job seekers with recruiters. Built with React and Node.js, it provides an efficient and user-friendly environment for job hunting and recruitment.

## Features

###  Authentication & User Management
- **Dual User Types** - Separate registration for job seekers (candidates) and recruiters
- **Secure Login/Logout** - JWT-based authentication with cookie management
- **Password Validation** - Minimum 8 characters with real-time validation feedback
- **Profile Image Upload** - Cloudinary integration for secure image storage
- **User Type Protection** - Route protection based on user type (candidate/recruiter)
- **Session Management** - Persistent login with automatic token validation

###  Advanced Job Search & Discovery
- **Real-time Search** - Instant filtering of job titles and locations as you type
- **Autocomplete Suggestions** - Dropdown suggestions sorted alphabetically for job titles and locations
- **Category Filtering** - Filter jobs by programming, design, marketing, etc.
- **Location Filtering** - Search by specific cities or regions
- **Reset Filters** - One-click filter reset functionality
- **Search Persistence** - Search results maintained across page navigation


###  Job Application Management
- **Apply for Jobs** - One-click job application with resume validation
- **Application Tracking** - View all applications with status updates
- **Withdraw Applications** - Cancel applications before recruiter review
- **Resume Requirement** - Must upload resume before applying to jobs

###  Recruiter Dashboard & Job Management
- **Job Posting** - Rich text editor (Quill) for detailed job descriptions
- **Job Categories** - Predefined categories with icons and descriptions
- **Job Visibility Toggle** - Show/hide jobs from public listings
- **Job Deletion** - Remove jobs with confirmation dialog
- **Application Management** - View and manage all job applications
- **Status Updates** - Change application status (Pending, Accepted, Rejected)
- **Candidate Profiles** - View candidate details and resumes

###  User Interface & Experience
- **Modern Design** - Clean, professional interface with Tailwind CSS
- **Loading States** - Skeleton loaders and loading spinners
- **Toast Notifications** - Real-time feedback for all user actions
- **Error Handling** - User-friendly error messages and validation
- **Smooth Animations** - Transitions and hover effects throughout


###  Security & Data Protection
- **Password Hashing** - Bcrypt encryption for secure password storage
- **JWT Tokens** - Secure authentication tokens with expiration
- **CORS Protection** - Cross-origin request security
- **File Upload Security** - Secure image and resume uploads via Cloudinary
- **Input Validation** - Server-side validation for all user inputs


## How to Use

### For Job Seekers
1. **Register** - Create account as "Candidate" with profile image
2. **Upload Resume** - Add your resume to apply for jobs
3. **Search Jobs** - Use real-time search or browse by category
4. **Apply** - Click job cards to view details and apply
5. **Track Applications** - Monitor application status in Applications page
6. **Withdraw** - Cancel applications if needed before recruiter review

### For Recruiters
1. **Register** - Create account as "Recruiter" with company details
2. **Post Jobs** - Use rich text editor to create detailed job listings
3. **Manage Jobs** - Edit, delete, or toggle visibility of job postings
4. **View Applications** - See all applications for your jobs
5. **Update Status** - Accept, reject, or keep applications pending
