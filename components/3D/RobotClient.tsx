'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const RobotCanvas = dynamic(
    () => import('./RobotCanvas'),
    {
        ssr: false,
        loading: () => <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black animate-pulse" />
    }
);

export default function RobotClient() {
    return (
        <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse" />}>
            <RobotCanvas />
        </Suspense>
    );
}
