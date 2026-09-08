import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import SectionHeader from '../components/common/SectionHeader';
import { Card } from '../components/common/Card';
import EmptyState from '../components/common/EmptyState';
import { History as HistoryIcon } from 'lucide-react';

const History = () => {
    return (
        <PageContainer>
            <SectionHeader
                title="Calculation History"
                description="View past calculations, results, and runtime performance matrices."
            />

            <Card className="min-h-[400px] flex items-center justify-center">
                <div className="max-w-md w-full p-6">
                    <EmptyState
                        icon={HistoryIcon}
                        title="No calculation history yet"
                        description="Your recent problem setups and their analysis results will be displayed here once numerical methods are implemented in Phase 2."
                    />
                </div>
            </Card>
        </PageContainer>
    );
};

export default History;
