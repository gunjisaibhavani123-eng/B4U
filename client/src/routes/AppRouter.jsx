import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import ProtectedRoute from '@shared/components/ProtectedRoute';
import AppLayout from '@shared/components/AppLayout';

const WelcomePage = lazy(() => import('@features/auth/components/WelcomePage'));
const LoginForm = lazy(() => import('@features/auth/components/LoginForm'));
const RegisterForm = lazy(() => import('@features/auth/components/RegisterForm'));
const OnboardingLayout = lazy(() => import('@features/onboarding/components/OnboardingLayout'));
const DashboardPage = lazy(() => import('@features/dashboard/components/DashboardPage'));
const ExpenseListPage = lazy(() => import('@features/expense-tracker/components/ExpenseListPage'));
const AddExpenseForm = lazy(() => import('@features/expense-tracker/components/AddExpenseForm'));
const CategoryBreakdown = lazy(() => import('@features/expense-tracker/components/CategoryBreakdown'));
const GoalsOverview = lazy(() => import('@features/goals/components/GoalsOverview'));
const CreateGoalForm = lazy(() => import('@features/goals/components/CreateGoalForm'));
const GoalDetail = lazy(() => import('@features/goals/components/GoalDetail'));
const AddContribution = lazy(() => import('@features/goals/components/AddContribution'));
const ChecklistOverview = lazy(() => import('@features/financial-health/components/ChecklistOverview'));
const ChecklistItemDetail = lazy(() => import('@features/financial-health/components/ChecklistItemDetail'));
const NudgeEntryForm = lazy(() => import('@features/spending-nudge/components/NudgeEntryForm'));
const NudgeResultPage = lazy(() => import('@features/spending-nudge/components/NudgeResultPage'));
const BudgetOverview = lazy(() => import('@features/budget-planner/components/BudgetOverview'));
const BudgetSummary = lazy(() => import('@features/budget-planner/components/BudgetSummary'));
const LearnHome = lazy(() => import('@features/education/components/LearnHome'));
const TopicList = lazy(() => import('@features/education/components/TopicList'));
const VideoPlayer = lazy(() => import('@features/education/components/VideoPlayer'));
const ChatHome = lazy(() => import('@features/chat/components/ChatHome'));
const ProfilePage = lazy(() => import('@features/profile/components/ProfilePage'));

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Spin size="large" />
  </div>
);

export default function AppRouter() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public routes */}
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/onboarding" element={<OnboardingLayout />} />

        {/* Protected routes with bottom nav */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/expenses" element={<ExpenseListPage />} />
            <Route path="/expenses/breakdown" element={<CategoryBreakdown />} />
            <Route path="/goals" element={<GoalsOverview />} />
            <Route path="/goals/:id" element={<GoalDetail />} />
            <Route path="/financial-health" element={<ChecklistOverview />} />
            <Route path="/financial-health/:itemType" element={<ChecklistItemDetail />} />
            <Route path="/budget" element={<BudgetOverview />} />
            <Route path="/budget/summary" element={<BudgetSummary />} />
            <Route path="/learn" element={<LearnHome />} />
            <Route path="/learn/topic/:topicId" element={<TopicList />} />
            <Route path="/chat" element={<ChatHome />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Protected routes without bottom nav */}
          <Route path="/expenses/add" element={<AddExpenseForm />} />
          <Route path="/goals/create" element={<CreateGoalForm />} />
          <Route path="/goals/:id/add-money" element={<AddContribution />} />
          <Route path="/nudge" element={<NudgeEntryForm />} />
          <Route path="/nudge/result" element={<NudgeResultPage />} />
          <Route path="/learn/video/:videoId" element={<VideoPlayer />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
