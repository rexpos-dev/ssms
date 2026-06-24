-- Bridges Academy School Management System Database Schema
-- Database: ssms_sql
-- MySQL Version: 5.7+

-- ============================================================
-- USERS & AUTHENTICATION
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    profile_picture VARCHAR(255),
    role ENUM('admin', 'teacher', 'student', 'parent') NOT NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
);

-- ============================================================
-- ADMIN & STAFF
-- ============================================================

CREATE TABLE IF NOT EXISTS admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100),
    designation VARCHAR(100),
    hire_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS teachers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100),
    qualification VARCHAR(255),
    specialization VARCHAR(255),
    hire_date DATE,
    experience_years INT,
    bio TEXT,
    office_hours VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_department (department)
);

-- ============================================================
-- ACADEMIC STRUCTURE
-- ============================================================

CREATE TABLE IF NOT EXISTS grades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    grade_name VARCHAR(50) NOT NULL,
    grade_level INT NOT NULL,
    description TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    UNIQUE KEY unique_grade (grade_name, grade_level),
    INDEX idx_grade_level (grade_level)
);

CREATE TABLE IF NOT EXISTS sections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    section_name VARCHAR(50) NOT NULL,
    grade_id INT NOT NULL,
    capacity INT,
    class_teacher_id INT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (grade_id) REFERENCES grades(id) ON DELETE CASCADE,
    FOREIGN KEY (class_teacher_id) REFERENCES teachers(id) ON DELETE SET NULL,
    UNIQUE KEY unique_section (section_name, grade_id),
    INDEX idx_grade_id (grade_id),
    INDEX idx_class_teacher_id (class_teacher_id)
);

CREATE TABLE IF NOT EXISTS subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    credit_hours INT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_subject_code (subject_code)
);

CREATE TABLE IF NOT EXISTS grade_subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    grade_id INT NOT NULL,
    subject_id INT NOT NULL,
    is_mandatory BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (grade_id) REFERENCES grades(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_grade_subject (grade_id, subject_id),
    INDEX idx_grade_id (grade_id),
    INDEX idx_subject_id (subject_id)
);

-- ============================================================
-- STUDENTS & ENROLLMENT
-- ============================================================

CREATE TABLE IF NOT EXISTS students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    admission_number VARCHAR(50) UNIQUE NOT NULL,
    admission_date DATE NOT NULL,
    current_grade_id INT,
    current_section_id INT,
    mother_tongue VARCHAR(100),
    blood_group VARCHAR(10),
    status ENUM('active', 'graduated', 'dropped', 'transferred') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (current_grade_id) REFERENCES grades(id) ON DELETE SET NULL,
    FOREIGN KEY (current_section_id) REFERENCES sections(id) ON DELETE SET NULL,
    INDEX idx_roll_number (roll_number),
    INDEX idx_admission_number (admission_number),
    INDEX idx_current_grade (current_grade_id),
    INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS student_enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    grade_id INT NOT NULL,
    section_id INT NOT NULL,
    academic_year VARCHAR(10) NOT NULL,
    enrollment_date DATE NOT NULL,
    status ENUM('active', 'completed', 'withdrawn') DEFAULT 'active',
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (grade_id) REFERENCES grades(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (student_id, academic_year, grade_id),
    INDEX idx_student_id (student_id),
    INDEX idx_academic_year (academic_year),
    INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS student_subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    academic_year VARCHAR(10) NOT NULL,
    enrollment_status ENUM('enrolled', 'completed', 'dropped') DEFAULT 'enrolled',
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_subject (student_id, subject_id, academic_year),
    INDEX idx_student_id (student_id),
    INDEX idx_subject_id (subject_id)
);

-- ============================================================
-- PARENTS & GUARDIANS
-- ============================================================

CREATE TABLE IF NOT EXISTS parents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    occupation VARCHAR(100),
    contact_address TEXT,
    emergency_contact VARCHAR(20),
    relationship_type ENUM('mother', 'father', 'guardian', 'other') NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_relationship_type (relationship_type),
    INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS student_parents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    parent_id INT NOT NULL,
    relationship_type ENUM('mother', 'father', 'guardian', 'other') NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES parents(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_parent (student_id, parent_id),
    INDEX idx_student_id (student_id),
    INDEX idx_is_primary (is_primary)
);

-- ============================================================
-- CLASSES & SCHEDULES
-- ============================================================

CREATE TABLE IF NOT EXISTS class_assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT NOT NULL,
    subject_id INT NOT NULL,
    section_id INT NOT NULL,
    academic_year VARCHAR(10) NOT NULL,
    semester INT,
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
    UNIQUE KEY unique_assignment (teacher_id, subject_id, section_id, academic_year),
    INDEX idx_teacher_id (teacher_id),
    INDEX idx_section_id (section_id),
    INDEX idx_academic_year (academic_year),
    INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS class_schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    class_assignment_id INT NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_assignment_id) REFERENCES class_assignments(id) ON DELETE CASCADE,
    INDEX idx_class_assignment_id (class_assignment_id),
    INDEX idx_day_of_week (day_of_week)
);

-- ============================================================
-- ATTENDANCE
-- ============================================================

CREATE TABLE IF NOT EXISTS attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    class_assignment_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    status ENUM('present', 'absent', 'late', 'excused') DEFAULT 'present',
    remarks TEXT,
    recorded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (class_assignment_id) REFERENCES class_assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (recorded_by) REFERENCES teachers(id) ON DELETE SET NULL,
    UNIQUE KEY unique_attendance (student_id, class_assignment_id, attendance_date),
    INDEX idx_student_id (student_id),
    INDEX idx_attendance_date (attendance_date),
    INDEX idx_status (status)
);

-- ============================================================
-- GRADES & ASSESSMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS assessment_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    assessment_name VARCHAR(100) NOT NULL,
    assessment_code VARCHAR(20) UNIQUE NOT NULL,
    max_marks DECIMAL(10, 2) NOT NULL,
    weight_percentage DECIMAL(5, 2),
    description TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active'
);

CREATE TABLE IF NULL NOT EXISTS student_grades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    assessment_type_id INT NOT NULL,
    marks_obtained DECIMAL(10, 2),
    grade_letter VARCHAR(2),
    academic_year VARCHAR(10) NOT NULL,
    recorded_by INT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (assessment_type_id) REFERENCES assessment_types(id) ON DELETE CASCADE,
    FOREIGN KEY (recorded_by) REFERENCES teachers(id) ON DELETE SET NULL,
    UNIQUE KEY unique_grade (student_id, subject_id, assessment_type_id, academic_year),
    INDEX idx_student_id (student_id),
    INDEX idx_academic_year (academic_year),
    INDEX idx_grade_letter (grade_letter)
);

CREATE TABLE IF NOT EXISTS subject_grades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    academic_year VARCHAR(10) NOT NULL,
    total_marks DECIMAL(10, 2),
    average_marks DECIMAL(10, 2),
    grade_letter VARCHAR(2),
    status ENUM('completed', 'pending') DEFAULT 'pending',
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_subject_grade (student_id, subject_id, academic_year),
    INDEX idx_student_id (student_id),
    INDEX idx_academic_year (academic_year)
);

-- ============================================================
-- ASSIGNMENTS & HOMEWORK
-- ============================================================

CREATE TABLE IF NOT EXISTS assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    class_assignment_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    assignment_date DATE NOT NULL,
    due_date DATE NOT NULL,
    max_marks INT,
    attachment_url VARCHAR(255),
    status ENUM('draft', 'published', 'closed') DEFAULT 'draft',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (class_assignment_id) REFERENCES class_assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES teachers(id) ON DELETE SET NULL,
    INDEX idx_class_assignment_id (class_assignment_id),
    INDEX idx_due_date (due_date),
    INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS assignment_submissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    assignment_id INT NOT NULL,
    student_id INT NOT NULL,
    submission_date DATETIME,
    submission_file VARCHAR(255),
    submission_text TEXT,
    marks_obtained INT,
    feedback TEXT,
    submission_status ENUM('not_submitted', 'submitted', 'late', 'graded') DEFAULT 'not_submitted',
    graded_by INT,
    graded_at TIMESTAMP NULL,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (graded_by) REFERENCES teachers(id) ON DELETE SET NULL,
    UNIQUE KEY unique_submission (assignment_id, student_id),
    INDEX idx_assignment_id (assignment_id),
    INDEX idx_student_id (student_id),
    INDEX idx_submission_status (submission_status)
);

-- ============================================================
-- COMMUNICATION
-- ============================================================

CREATE TABLE IF NOT EXISTS messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,
    recipient_id INT,
    subject VARCHAR(255),
    message_content TEXT NOT NULL,
    message_type ENUM('personal', 'announcement', 'class_update') DEFAULT 'personal',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_sender_id (sender_id),
    INDEX idx_recipient_id (recipient_id),
    INDEX idx_message_type (message_type),
    INDEX idx_is_read (is_read)
);

CREATE TABLE IF NOT EXISTS announcements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    announcement_type ENUM('general', 'academic', 'event', 'emergency') DEFAULT 'general',
    target_audience ENUM('all', 'students', 'teachers', 'parents', 'admin') DEFAULT 'all',
    posted_by INT,
    attachment_url VARCHAR(255),
    posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_from DATE,
    valid_to DATE,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    status ENUM('draft', 'published', 'archived') DEFAULT 'published',
    FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_announcement_type (announcement_type),
    INDEX idx_target_audience (target_audience),
    INDEX idx_status (status)
);

-- ============================================================
-- CONDUCT & DISCIPLINE
-- ============================================================

CREATE TABLE IF NOT EXISTS conduct_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    incident_date DATE NOT NULL,
    incident_type VARCHAR(100) NOT NULL,
    description TEXT,
    severity ENUM('minor', 'moderate', 'serious') DEFAULT 'minor',
    action_taken TEXT,
    reported_by INT,
    parent_notified BOOLEAN DEFAULT FALSE,
    notified_date TIMESTAMP NULL,
    status ENUM('open', 'resolved', 'pending_review') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (reported_by) REFERENCES teachers(id) ON DELETE SET NULL,
    INDEX idx_student_id (student_id),
    INDEX idx_incident_date (incident_date),
    INDEX idx_severity (severity),
    INDEX idx_status (status)
);

-- ============================================================
-- ACADEMIC CALENDAR & EVENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS academic_years (
    id INT PRIMARY KEY AUTO_INCREMENT,
    year_name VARCHAR(20) UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('draft', 'active', 'completed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS holidays (
    id INT PRIMARY KEY AUTO_INCREMENT,
    holiday_name VARCHAR(100) NOT NULL,
    holiday_date DATE NOT NULL,
    academic_year_id INT,
    category VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE SET NULL,
    INDEX idx_holiday_date (holiday_date),
    INDEX idx_academic_year_id (academic_year_id)
);

CREATE TABLE IF NOT EXISTS events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_name VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME,
    event_type VARCHAR(100),
    description TEXT,
    location VARCHAR(255),
    organizer_id INT,
    attachment_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_event_date (event_date),
    INDEX idx_event_type (event_type)
);

-- ============================================================
-- FINANCIAL MANAGEMENT
-- ============================================================

CREATE TABLE IF NOT EXISTS fee_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fee_name VARCHAR(100) NOT NULL,
    fee_code VARCHAR(20) UNIQUE NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    academic_year VARCHAR(10) NOT NULL,
    is_mandatory BOOLEAN DEFAULT TRUE,
    description TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS student_fees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    fee_type_id INT NOT NULL,
    academic_year VARCHAR(10) NOT NULL,
    amount_due DECIMAL(12, 2),
    amount_paid DECIMAL(12, 2) DEFAULT 0,
    due_date DATE,
    payment_status ENUM('pending', 'partial', 'paid', 'overdue') DEFAULT 'pending',
    last_payment_date TIMESTAMP NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (fee_type_id) REFERENCES fee_types(id) ON DELETE CASCADE,
    INDEX idx_student_id (student_id),
    INDEX idx_payment_status (payment_status),
    INDEX idx_academic_year (academic_year)
);

CREATE TABLE IF NOT EXISTS fee_payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_fee_id INT NOT NULL,
    amount_paid DECIMAL(12, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method ENUM('cash', 'check', 'online', 'bank_transfer') DEFAULT 'cash',
    transaction_id VARCHAR(100),
    payment_remarks TEXT,
    received_by INT,
    FOREIGN KEY (student_fee_id) REFERENCES student_fees(id) ON DELETE CASCADE,
    FOREIGN KEY (received_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_student_fee_id (student_fee_id),
    INDEX idx_payment_date (payment_date)
);

-- ============================================================
-- REPORTS & DOCUMENTATION
-- ============================================================

CREATE TABLE IF NOT EXISTS documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    document_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(50),
    document_url VARCHAR(255) NOT NULL,
    related_student_id INT,
    uploaded_by INT,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date DATE,
    document_status ENUM('valid', 'expired', 'pending_verification') DEFAULT 'valid',
    FOREIGN KEY (related_student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_related_student_id (related_student_id),
    INDEX idx_document_type (document_type)
);

CREATE TABLE IF NOT EXISTS activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action_type VARCHAR(100),
    entity_type VARCHAR(100),
    entity_id INT,
    details TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_action_type (action_type)
);

-- ============================================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX idx_users_role_status ON users(role, status);
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_teachers_user_id ON teachers(user_id);
CREATE INDEX idx_parents_user_id ON parents(user_id);
CREATE INDEX idx_enrollment_student_year ON student_enrollments(student_id, academic_year);
CREATE INDEX idx_messages_sender_recipient ON messages(sender_id, recipient_id);
CREATE INDEX idx_attendance_student_date ON attendance(student_id, attendance_date);
CREATE INDEX idx_grades_student_year ON student_grades(student_id, academic_year);

-- Insert default academic year
INSERT IGNORE INTO academic_years (year_name, start_date, end_date, status)
VALUES ('2024-2025', '2024-06-01', '2025-05-31', 'active');

-- Insert sample grades
INSERT IGNORE INTO grades (grade_name, grade_level, status) VALUES
('Grade 9', 9, 'active'),
('Grade 10', 10, 'active'),
('Grade 11', 11, 'active'),
('Grade 12', 12, 'active');

-- Insert sample assessment types
INSERT IGNORE INTO assessment_types (assessment_name, assessment_code, max_marks, weight_percentage) VALUES
('Class Test', 'CT', 20, 20),
('Mid Term', 'MT', 40, 30),
('Final Exam', 'FE', 100, 50);

-- Insert sample subjects
INSERT IGNORE INTO subjects (subject_name, subject_code, credit_hours, status) VALUES
('English Language', 'ENG101', 4, 'active'),
('Mathematics', 'MATH101', 4, 'active'),
('Physics', 'PHY101', 4, 'active'),
('Chemistry', 'CHEM101', 4, 'active'),
('Biology', 'BIO101', 4, 'active'),
('History', 'HIS101', 3, 'active'),
('Geography', 'GEO101', 3, 'active'),
('Computer Science', 'CS101', 4, 'active');

-- Insert sample fee types
INSERT IGNORE INTO fee_types (fee_name, fee_code, amount, academic_year, is_mandatory) VALUES
('Tuition Fee', 'TUITION', 50000, '2024-2025', TRUE),
('Exam Fee', 'EXAM', 5000, '2024-2025', TRUE),
('Sports Fee', 'SPORTS', 3000, '2024-2025', FALSE),
('Lab Fee', 'LAB', 2000, '2024-2025', FALSE);

SET FOREIGN_KEY_CHECKS=1;
