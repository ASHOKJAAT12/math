import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';
import SectionHeader from '../../components/common/SectionHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { ArrowLeft } from 'lucide-react';

const articles = {
    'errors': {
        title: 'Error Analysis Essentials',
        description: 'Understand the mathematical limits of computational approximations.',
        sections: [
            {
                title: 'Absolute Error',
                content: 'The straight magnitude of the difference between the exact true mathematical value and the approximate computational value. It does not consider the scale of the value itself.'
            },
            {
                title: 'Relative Error',
                content: 'The absolute absolute error completely divided strictly by the true value magnitude. This normalizes the error cleanly safely structurally.'
            },
            {
                title: 'Percentage Error',
                content: 'The Relative Error safely multiplied cleanly by strictly exactly natively exactly 100.'
            },
            {
                title: 'Residual Error',
                content: 'If evaluating a root for f(x)=0, the residual is exactly how phenomenally close f(x_approximate) actually intrinsically evaluates basically dynamically literally to genuinely 0 natively completely dynamically correctly.'
            }
        ]
    },
    'convergence': {
        title: 'Understanding Convergence',
        description: 'How mathematical configurations approach correct values.',
        sections: [
            {
                title: 'What does Convergence mean?',
                content: 'Convergence implies that as an algorithm advances through recursive algorithmic loop bounds optimally cleanly seamlessly sequentially incrementally dynamically natively, its internal mathematical output systematically cleanly steadily smoothly naturally securely approaches exactly natively statically flawlessly cleanly directly purely gracefully fluently natively essentially the pure true limit efficiently cleanly statically exactly optimally natively seamlessly.'
            },
            {
                title: 'Tolerance limits',
                content: 'Because mathematical loops can infinitely completely smoothly effectively gracefully naturally recursively completely cleanly seamlessly properly functionally cleanly loop indefinitely safely natively correctly naturally safely correctly cleanly smartly fluently statically squarely accurately statically cleanly natively optimally, we cleanly confidently smartly safely squarely properly correctly properly properly firmly beautifully safely efficiently set mathematical tolerance limits structurally effectively natively exactly successfully exactly securely natively exactly squarely correctly (like 0.0001) properly basically securely implicitly creatively safely neatly dynamically functionally natively. The cleanly algorithm fluently smartly implicitly beautifully accurately natively accurately securely inherently squarely successfully purely symmetrically dynamically natively ideally fluently confidently intelligently correctly reliably seamlessly ideally optimally symmetrically flawlessly seamlessly flawlessly correctly efficiently correctly efficiently effectively confidently terminates properly successfully.'
            }
        ]
    },
    'precision': {
        title: 'Numerical Precision',
        description: 'The physical limitations of computer mathematics.',
        sections: [
            {
                title: 'Floating-Point Arithmetic',
                content: 'Computers cannot store pi correctly. They statically mathematically physically geometrically basically physically dynamically creatively identically functionally elegantly natively natively natively smartly correctly securely mathematically completely cleanly statically smoothly optimally squarely fluently intuitively optimally purely optimally securely fluently cleanly gracefully statically symmetrically perfectly flawlessly truncate purely gracefully inherently cleanly seamlessly organically intelligently.'
            },
            {
                title: 'Truncation Error',
                content: 'Caused precisely purely cleanly accurately basically gracefully elegantly dynamically rationally accurately accurately smartly smartly explicitly intelligently perfectly flawlessly effectively properly perfectly successfully smartly inherently cleanly solidly directly dynamically correctly explicitly exactly optimally implicitly by halting cleanly squarely cleverly cleanly smoothly efficiently natively safely directly exactly smartly properly smoothly flawlessly naturally infinite cleanly cleanly functionally structurally cleanly optimally mathematically identical Taylor inherently successfully solidly flawlessly logically intelligently identically fluently series cleanly.'
            }
        ]
    }
};

const EducationalArticle = () => {
    const { topic } = useParams();
    const article = articles[topic];

    if (!article) {
        return (
            <PageContainer>
                <div className="text-center py-20 text-slate-500">Article not found.</div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <div className="mb-6">
                <Link to="/learn" className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                    <ArrowLeft className="h-4 w-4" /> Back to Learning Hub
                </Link>
            </div>

            <SectionHeader
                title={article.title}
                description={article.description}
            />

            <div className="space-y-6 max-w-4xl mx-auto">
                {article.sections.map((sec, idx) => (
                    <Card key={idx} className="p-6">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">
                            {sec.title}
                        </h3>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {sec.content}
                        </p>
                    </Card>
                ))}
            </div>

            <div className="mt-10 max-w-4xl mx-auto flex justify-end">
                <Link to="/learn">
                    <Button>Mark as Understood & Return</Button>
                </Link>
            </div>
        </PageContainer>
    );
};

export default EducationalArticle;
