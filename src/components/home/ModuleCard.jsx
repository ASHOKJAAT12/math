import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../common/Card';
import Button from '../common/Button';

const ModuleCard = ({ title, description, methods = [], linkTo, buttonText, Icon }) => {
    return (
        <Card className="flex flex-col h-full hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center gap-4">
                {Icon && (
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                        <Icon size={24} />
                    </div>
                )}
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">{description}</p>

                {methods.length > 0 && (
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-3">
                            Included Methods
                        </h4>
                        <ul className="space-y-2">
                            {methods.map((method, index) => (
                                <li key={index} className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2.5"></span>
                                    {method}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Link to={linkTo} className="w-full">
                    <Button variant="outline" className="w-full justify-between group">
                        {buttonText}
                        <span className="transform transition-transform group-hover:translate-x-1">→</span>
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
};

export default ModuleCard;
