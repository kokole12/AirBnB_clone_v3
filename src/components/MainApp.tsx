import React, { useState, useEffect } from 'react';
import { useAuth, useUser, useClerk } from "@clerk/clerk-react";

// Layouts
import { PublicLayout } from './layout/PublicLayout';
import { DashboardLayout } from './layout/DashboardLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { SearchPage } from './pages/SearchPage';
import { PropertyDetailsPage } from './pages/PropertyDetailsPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { EmailVerificationPage } from './pages/EmailVerificationPage';

// Dashboard Pages
import { DashboardOverview } from './pages/dashboard/DashboardOverview';
import { MyProperties } from './pages/dashboard/MyProperties';
import { AddProperty } from './pages/dashboard/AddProperty';
import { Messages } from './pages/dashboard/Messages';
import { Settings } from './pages/dashboard/Settings';

export function MainApp() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const { signOut } = useClerk();

  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string>("");
  
  // Local state for role during registration flow, otherwise use Clerk metadata
  const [tempRole, setTempRole] = useState<'tenant' | 'landlord'>('tenant');

  const userRole = isSignedIn 
    ? ((user?.unsafeMetadata?.role as 'tenant' | 'landlord') || 'tenant')
    : tempRole;

  // Simple Navigation Handler
  const navigate = (page: string) => {
    // Basic route protection
    if (page.startsWith('dashboard')) {
        if (!isSignedIn) {
            setCurrentPage('login');
            return;
        }
        // Strict role check: Tenants cannot access dashboard
        if (userRole === 'tenant') {
            setCurrentPage('landing');
            return;
        }
    }
    
    // Log out logic logic handled by handleLogout
    
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleLoginSuccess = (role: 'tenant' | 'landlord', email?: string) => {
      // With Clerk, session is already active by the time we get here (for Login)
      // For Register, we might be verifying.
      
      // If we are signed in (Login success), navigate based on role
      if (isSignedIn) {
         if (role === 'landlord') {
            navigate('dashboard-overview');
         } else {
            navigate('landing');
         }
      }
  };

  const handleLogout = async () => {
      await signOut();
      navigate('landing');
  };

  const handleViewDetails = (id: string) => {
      setSelectedPropertyId(id);
      navigate('details');
  };

  // Render Logic
  const renderPage = () => {
    switch (currentPage) {
        // Public Pages
        case 'landing':
            return <LandingPage onNavigate={navigate} onViewDetails={handleViewDetails} />;
        case 'search':
            return <SearchPage onViewDetails={handleViewDetails} />;
        case 'details':
            return <PropertyDetailsPage propertyId={selectedPropertyId!} onBack={() => navigate('search')} />;
        
        // Auth Pages
        case 'login':
            return <LoginPage onNavigate={navigate} onLoginSuccess={(role) => {
                 // Clerk handles session. We just navigate.
                 if (role === 'landlord') {
                    navigate('dashboard-overview');
                 } else {
                    navigate('landing');
                 }
            }} />;
        case 'register':
            return <RegisterPage onNavigate={navigate} onLoginSuccess={(role, email) => {
                // Navigate to verification
                setTempRole(role);
                setPendingEmail(email || "");
                navigate('verification');
            }} />;
        case 'verification':
            return <EmailVerificationPage 
                email={pendingEmail}
                onVerify={() => {
                    // Verification complete, session active.
                    // Redirect based on the role we tracked or Clerk metadata (which might take a ms to sync locally?)
                    // Use tempRole to be safe if user object isn't instant.
                     if (tempRole === 'landlord') {
                        navigate('dashboard-overview');
                    } else {
                        navigate('landing');
                    }
                }} 
            />;
        
        // Dashboard Pages
        case 'dashboard-overview':
            return <DashboardOverview />;
        case 'dashboard-properties':
            return <MyProperties onAddProperty={() => navigate('dashboard-add-property')} />;
        case 'dashboard-add-property':
            return <AddProperty onCancel={() => navigate('dashboard-properties')} onSave={() => navigate('dashboard-properties')} />;
        case 'dashboard-messages':
            return <Messages />;
        case 'dashboard-settings':
            return <Settings />;
            
        default:
            return <LandingPage onNavigate={navigate} onViewDetails={handleViewDetails} />;
    }
  };

  if (!authLoaded) return null; // Or loading spinner

  // Wrap in appropriate layout
  if (currentPage.startsWith('dashboard')) {
      return (
          <DashboardLayout 
            onNavigate={navigate} 
            currentPage={currentPage}
            onLogout={handleLogout}
          >
              {renderPage()}
          </DashboardLayout>
      );
  }

  // Auth pages have their own internal layout
  if (currentPage === 'login' || currentPage === 'register' || currentPage === 'verification') {
      return renderPage();
  }

  return (
      <PublicLayout 
        onNavigate={navigate} 
        currentPage={currentPage} 
        isAuthenticated={isSignedIn || false}
        userRole={userRole}
        onLogout={handleLogout}
      >
          {renderPage()}
      </PublicLayout>
  );
}
