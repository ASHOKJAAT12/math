import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import ModuleCard from '../components/home/ModuleCard';
import FeatureSection from '../components/home/FeatureSection';
import Button from '../components/common/Button';
import { Target, Activity, Tangent } from 'lucide-react'; // Import icons

const Home = () => {
    return (
        <PageContainer>
            {/* Hero Section */}
            <div className="py-20 text-center max-w-3xl mx-auto rounded-3xl mb-16 bg-gradient-to-b from-indigo-50 to-white dark:from-slate-900 dark:to-slate-950 border border-indigo-100 dark:border-slate-800">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
                    Numerical Methods Analyzer
                </h1>
                <p className="text-xl sm:text-2xl text-indigo-600 dark:text-indigo-400 font-medium mb-4">
                    Analyze, solve, visualize, and compare numerical methods in one interactive platform.
                </p>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto px-4">
                    The platform will help students understand numerical methods by comparing mathematical accuracy, convergence, iterations, and computational performance.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
                    <Link to="/root-finding">
                        <Button size="lg" className="w-full sm:w-auto">Explore Methods</Button>
                    </Link>
                    <Link to="/compare">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto">Compare Methods</Button>
                    </Link>
                </div>
            </div>

            {/* Module Cards Section */}
            <div className="mb-20">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Calculation Modules</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <ModuleCard
                        title="Root Finding"
                        description="Find approximate roots of nonlinear equations using multiple numerical methods."
                        methods={['Bisection', 'Regula Falsi', 'Newton-Raphson', 'Secant']}
                        linkTo="/root-finding"
                        buttonText="Open Root Finding"
                        Icon={Target}
                    />
                    <ModuleCard
                        title="Numerical Integration"
                        description="Approximate definite integrals and compare numerical integration techniques."
                        methods={['Trapezoidal Rule', "Simpson's 1/3 Rule", "Simpson's 3/8 Rule"]}
                        linkTo="/integration"
                        buttonText="Open Integration"
                        Icon={Activity}
                    />
                    <ModuleCard
                        title="Numerical Differentiation"
                        description="Approximate derivatives and study numerical error as the step size changes."
                        methods={['Forward Difference', 'Backward Difference', 'Central Difference']}
                        linkTo="/differentiation"
                        buttonText="Open Differentiation"
                        Icon={Tangent}
                    />
                </div>
            </div>

            {/* Features Section */}
            <FeatureSection />

            {/* Comparison Preview Section */}
            <div className="mt-20 py-16 px-6 bg-slate-900 dark:bg-slate-950 rounded-3xl shadow-xl text-center border-t border-slate-800 relative overflow-hidden">
                <div className="relative z-10 max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold text-white mb-4">Compare Numerical Methods</h2>
                    <p className="text-lg text-slate-300 mb-8">
                        The platform will allow users to compare methods based on accuracy, iterations, error, execution time, and convergence in a unified dashboard.
                    </p>
                    <Link to="/compare">
                        <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 focus:ring-slate-100">
                            Go to Comparison
                        </Button>
                    </Link>
                </div>
            </div>
        </PageContainer>
    );
};

export default Home;
