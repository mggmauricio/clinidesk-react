"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EnvCheckPage() {
    const [envVars, setEnvVars] = useState<Record<string, string>>({});

    useEffect(() => {
        // Collect all environment variables that start with NEXT_PUBLIC_
        const publicEnvVars: Record<string, string> = {};

        // Check for specific environment variables we're interested in
        const varsToCheck = [
            'NEXT_PUBLIC_API_URL',
            // Add other public env vars here
        ];

        varsToCheck.forEach(varName => {
            publicEnvVars[varName] = process.env[varName] || 'Not set';
        });

        setEnvVars(publicEnvVars);
    }, []);

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Environment Variables Check</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Public Environment Variables:</h3>
                        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                            {JSON.stringify(envVars, null, 2)}
                        </pre>
                    </div>

                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Browser Information:</h3>
                        <ul className="list-disc pl-5">
                            <li><strong>User Agent:</strong> {typeof navigator !== 'undefined' ? navigator.userAgent : 'Not available'}</li>
                            <li><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Not available'}</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 