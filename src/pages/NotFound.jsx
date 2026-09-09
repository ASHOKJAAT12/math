import React from 'react';
import { NavLink } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import { Card } from '../components/common/Card';
import EmptyState from '../components/common/EmptyState';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound = () => {
    return (
        <PageContainer>
            <div className="flexItems-center justify-center min-h-[60vh]">
                <Card className="max-w-xl w-full mx-auto p-10 text-center shadow-card bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 border-dashed">
                    <EmptyState
                        icon={HelpCircle}
                        title="Page Not Found"
                        description="The page you're looking for does not exist or has been moved."
                    />
                    <div className="mt-8 flex justify-center">
                        <NavLink to="/">
                            <Button variant="primary" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" /> Back to Home
                            </Button>
                        </NavLink>
                    </div>
                </Card>
            </div>
        </PageContainer>
    );
};

export default NotFound;
