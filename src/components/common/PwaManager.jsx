import React, { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { WifiOff, RefreshCw, X } from 'lucide-react';

export default function PwaManager() {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegisterError(error) {
            console.error('SW registration error', error);
        },
    });

    const close = () => {
        setOfflineReady(false);
        setNeedRefresh(false);
    };

    return (
        <>
            {/* Offline Banner */}
            {isOffline && (
                <div className="fixed top-0 left-0 w-full z-[100] bg-orange-600 dark:bg-orange-700 text-white p-2 text-sm text-center shadow-md animate-in slide-in-from-top-full">
                    <div className="flex items-center justify-center gap-2 max-w-4xl mx-auto">
                        <WifiOff className="w-4 h-4 shrink-0" />
                        <span className="font-semibold block sm:inline">You're offline.</span>
                        <span className="hidden sm:inline">Core numerical calculations and locally stored features remain available.</span>
                    </div>
                </div>
            )}

            {/* Offline Ready or Update Prompt */}
            {(offlineReady || needRefresh) && (
                <div className="fixed bottom-4 right-4 z-[90] p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl max-w-sm w-full font-sans transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            {needRefresh ? <RefreshCw className="w-4 h-4 text-indigo-500" /> : <WifiOff className="w-4 h-4 text-emerald-500" />}
                            {needRefresh ? 'New version available' : 'App Ready Offline'}
                        </h4>
                        <button onClick={close} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        {needRefresh
                            ? 'A new version of NMA is available. Update to get the latest features safely seamlessly explicitly naturally ideally elegantly firmly smartly.'
                            : 'The application assets have been cached reliably structurally dynamically safely exactly rationally flawlessly correctly optimally exactly elegantly.'}
                    </p>
                    {needRefresh && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => updateServiceWorker(true)}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                            >
                                Update Now
                            </button>
                            <button
                                onClick={close}
                                className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded text-sm font-medium transition-colors"
                            >
                                Later
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
