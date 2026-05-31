-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LEAVE', 'HOLIDAY');

-- CreateEnum
CREATE TYPE "FeeStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'PARTIAL', 'WAIVED');

-- CreateTable
CREATE TABLE "AttendanceRecord" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "markedBy" TEXT NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AttendanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeePayment" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "feeType" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "paidAmount" DECIMAL(10,2) NOT NULL,
    "dueDate" DATE NOT NULL,
    "paidDate" TIMESTAMP(3),
    "status" "FeeStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMode" TEXT,
    "transactionId" TEXT,
    "razorpayOrderId" TEXT,
    "receipt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeePayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "vendor" TEXT,
    "approvedBy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "date" DATE NOT NULL,
    "receipt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimetableSlot" (
    "id" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "teacherName" TEXT NOT NULL,
    "room" TEXT,

    CONSTRAINT "TimetableSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamResult" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "examName" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "maxMarks" INTEGER NOT NULL,
    "obtainedMarks" INTEGER NOT NULL,
    "grade" TEXT NOT NULL,
    "percentage" DECIMAL(5,2) NOT NULL,
    "rank" INTEGER,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "channel" TEXT NOT NULL,
    "sentBy" TEXT NOT NULL,
    "readCount" INTEGER NOT NULL DEFAULT 0,
    "totalRecipients" INTEGER NOT NULL DEFAULT 0,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "details" JSONB,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AttendanceRecord_class_section_date_idx" ON "AttendanceRecord"("class", "section", "date");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceRecord_studentId_date_key" ON "AttendanceRecord"("studentId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "FeePayment_transactionId_key" ON "FeePayment"("transactionId");

-- CreateIndex
CREATE INDEX "FeePayment_studentId_idx" ON "FeePayment"("studentId");

-- CreateIndex
CREATE INDEX "FeePayment_status_idx" ON "FeePayment"("status");

-- CreateIndex
CREATE INDEX "Expense_category_date_idx" ON "Expense"("category", "date");

-- CreateIndex
CREATE UNIQUE INDEX "TimetableSlot_class_section_day_period_key" ON "TimetableSlot"("class", "section", "day", "period");

-- CreateIndex
CREATE INDEX "ExamResult_examId_idx" ON "ExamResult"("examId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamResult_studentId_examId_subject_key" ON "ExamResult"("studentId", "examId", "subject");

-- CreateIndex
CREATE INDEX "AuditLog_userId_createdAt_idx" ON "AuditLog"("userId", "createdAt");
