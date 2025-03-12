"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ApiTestPage() {
    const [apiUrl, setApiUrl] = useState<string>("");
    const [testResult, setTestResult] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        // Get the API URL from environment variable
        setApiUrl(process.env.NEXT_PUBLIC_API_URL || "");
    }, []);

    const testDirectFetch = async () => {
        setIsLoading(true);
        setTestResult("Testing direct fetch...");

        try {
            const url = `${apiUrl}/health-check`;
            console.log("Testing direct fetch to:", url);

            const response = await fetch(url);
            const status = `Status: ${response.status} ${response.statusText}`;

            // Get response headers
            const headers: Record<string, string> = {};
            response.headers.forEach((value, key) => {
                headers[key] = value;
            });

            // Try to get response as text
            const text = await response.text();

            setTestResult(
                `Direct fetch result:\n${status}\n\nHeaders:\n${JSON.stringify(headers, null, 2)}\n\nResponse:\n${text}`
            );
        } catch (error) {
            console.error("Direct fetch error:", error);
            setTestResult(`Direct fetch error: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsLoading(false);
        }
    };

    const testLoginEndpoint = async () => {
        setIsLoading(true);
        setTestResult("Testing login endpoint...");

        try {
            // Create test credentials
            const formData = new FormData();
            formData.append("username", "test_user");
            formData.append("password", "test_password");

            const url = `${apiUrl}/login/`;
            console.log("Testing login endpoint:", url);

            const response = await fetch(url, {
                method: "POST",
                body: formData,
            });

            const status = `Status: ${response.status} ${response.statusText}`;

            // Get response headers
            const headers: Record<string, string> = {};
            response.headers.forEach((value, key) => {
                headers[key] = value;
            });

            // Try to get response as text
            const text = await response.text();

            // Try to parse as JSON if possible
            let jsonData = "Not valid JSON";
            try {
                if (text.trim()) {
                    jsonData = JSON.stringify(JSON.parse(text), null, 2);
                } else {
                    jsonData = "Empty response";
                }
            } catch (e) {
                jsonData = `Not valid JSON: ${text}`;
            }

            setTestResult(
                `Login endpoint test:\n${status}\n\nHeaders:\n${JSON.stringify(headers, null, 2)}\n\nResponse:\n${jsonData}`
            );
        } catch (error) {
            console.error("Login endpoint error:", error);
            setTestResult(`Login endpoint error: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>API Test Page</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <p><strong>API URL:</strong> {apiUrl || "Not configured"}</p>
                    </div>

                    <div className="flex space-x-4 mb-4">
                        <Button onClick={testDirectFetch} disabled={isLoading}>
                            Test Direct Fetch
                        </Button>
                        <Button onClick={testLoginEndpoint} disabled={isLoading}>
                            Test Login Endpoint
                        </Button>
                    </div>

                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Test Result:</h3>
                        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 whitespace-pre-wrap">
                            {testResult || "No test run yet"}
                        </pre>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 