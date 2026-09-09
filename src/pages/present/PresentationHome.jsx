import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';
import SectionHeader from '../../components/common/SectionHeader';
import Card, { CardTitle, CardContent } from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Presentation, Play, Binary, Activity, Calculator, Settings2 } from 'lucide-react';

const presentations = [
    {
        id: 'root-finding',
        title: 'Root Finding Demo',
        description: 'Demonstrate bracket tracking, convergence, and algorithm speed (Bisection to Newton-Raphson).',
        icon: Calculator,
        color: 'from-orange-500 to-red-500'
    },
    {
        id: 'integration',
        title: 'Integration Demo',
        description: 'Showcase area approximation, subintervals, and exact error comparison (Trapezoidal to Simpson 3/8).',
        icon: Activity,
        color: 'from-blue-500 to-indigo-500'
    },
    {
        id: 'differentiation',
        title: 'Differentiation Demo',
        description: 'Visualize tangent line extraction, step-size (h) manipulation, and multi-h truncation error.',
        icon: Binary,
        color: 'from-emerald-500 to-teal-500'
    }
];

const PresentationHome = () => {
    const navigate = useNavigate();

    return (
        <PageContainer>
            <SectionHeader
                title="Classroom Presentation Mode"
                description="Demonstrate numerical methods interactively with formulas, calculations, steps, charts, and explanations. Optimized for projector screen sharing natively squarely safely."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {presentations.map(pres => (
                    <Card key={pres.id} className="hover:shadow-md transition-shadow flex flex-col h-full border-t-4 border-slate-200" style={{ borderTopColor: 'var(--tw-ring-color)', '--tw-ring-color': pres.id === 'root-finding' ? '#f97316' : pres.id === 'integration' ? '#3b82f6' : '#10b981' }}>
                        <div className={`p-4 bg-gradient-to-r ${pres.color} text-white flex justify-center`}>
                            <pres.icon className="h-12 w-12 opacity-90" />
                        </div>
                        <CardContent className="flex-grow flex flex-col pt-6">
                            <CardTitle className="text-xl mb-2">{pres.title}</CardTitle>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 flex-grow">{pres.description}</p>
                            <Button
                                variant="primary"
                                className="w-full flex items-center justify-center gap-2"
                                onClick={() => navigate(`/present/viewer?demo=${pres.id}`)}
                            >
                                <Play className="h-4 w-4" /> Start Presentation
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center max-w-3xl mx-auto">
                <Settings2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">Custom Presentation</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Configure your own bounds, tolerances, and functions into the presentation engine.
                </p>
                <Button variant="outline" className="px-8" onClick={() => navigate('/present/viewer?demo=custom')}>
                    Configure Custom Demo
                </Button>
            </div>
        </PageContainer>
    );
};

export default PresentationHome;
