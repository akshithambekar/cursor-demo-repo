"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ReactGrabChatbox } from "./react-grab-chatbox";

type ProcessingState = "idle" | "applying" | "committing" | "success" | "error";

interface ApiResponse {
    success: boolean;
    response?: string;
    message?: string;
}

interface GrabContent {
    code: string;
    filePath: string;
}

export function ReactGrabOverlay({ children }: { children: React.ReactNode }) {
    const [isDevelopment, setIsDevelopment] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [grabContent, setGrabContent] = useState<GrabContent | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [changeRequest, setChangeRequest] = useState("");
    const [processingState, setProcessingState] =
        useState<ProcessingState>("idle");
    const [apiResponse, setApiResponse] = useState<string>("");
    const [commitSha, setCommitSha] = useState<string>("");
    const [cursorPosition, setCursorPosition] = useState<{
        x: number;
        y: number;
    } | null>(null);
    const [hasAppliedChange, setHasAppliedChange] = useState(false);

    // Define all callbacks BEFORE any early returns
    const handleApply = useCallback(async () => {
        if (!grabContent || !changeRequest.trim()) {
            return;
        }

        // Construct the message with react-grab output and change request
        const message = `${grabContent.code}

in ${grabContent.filePath}

Change request: ${changeRequest}`;

        try {
            setProcessingState("applying");

            // Call the change API
            const changeResponse = await fetch("/api/opencode/change", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message }),
            });

            const changeData: ApiResponse = await changeResponse.json();

            if (!changeData.success) {
                setProcessingState("error");
                setApiResponse(
                    changeData.response || "Failed to apply changes"
                );
                return;
            }

            setApiResponse(
                changeData.response || "Changes applied successfully"
            );
            setHasAppliedChange(true);
            setProcessingState("idle");
        } catch (error) {
            setProcessingState("error");
            setApiResponse(
                error instanceof Error ? error.message : "An error occurred"
            );
        }
    }, [grabContent, changeRequest]);

    const handleReset = useCallback(() => {
        setChangeRequest("");
        setProcessingState("idle");
        setApiResponse("");
        setCommitSha("");
        setGrabContent(null);
        setHasAppliedChange(false);
        setCursorPosition(null);
    }, []);

    const handleDismiss = useCallback(() => {
        setGrabContent(null);
        setChangeRequest("");
        setProcessingState("idle");
        setApiResponse("");
        setCommitSha("");
        setHasAppliedChange(false);
        setCursorPosition(null);
    }, []);

    const handleCommit = useCallback(async () => {
        if (!grabContent) {
            return;
        }

        try {
            setProcessingState("committing");

            // Call the apply API to commit and push
            const applyResponse = await fetch("/api/opencode/apply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: "add, commit, and push changes",
                }),
            });

            const applyData: ApiResponse = await applyResponse.json();

            if (applyData.success) {
                setProcessingState("success");
                // Extract commit SHA from response if available
                const shaMatch = applyData.response?.match(/[a-f0-9]{7,40}/i);
                if (shaMatch) {
                    setCommitSha(shaMatch[0]);
                }
            } else {
                setProcessingState("error");
                setApiResponse(
                    applyData.response || "Failed to commit changes"
                );
            }
        } catch (error) {
            setProcessingState("error");
            setApiResponse(
                error instanceof Error ? error.message : "An error occurred"
            );
        }
    }, [grabContent]);

    useEffect(() => {
        setIsDevelopment(process.env.NODE_ENV === "development");
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isDevelopment || !mounted) return;

        // Initialize react-grab with content capture
        const initGrab = async () => {
            try {
                const { init } = await import("react-grab");
                const api = init();

                // Activate react-grab and set up content capture
                if (typeof api.activate === "function") {
                    api.activate();
                }

                // Set up content capture callback if available
                // Using type assertion to access the onGrab callback method
                const grabApi = api as { onGrab?: (callback: (content: { code: string; filePath: string }) => void) => void };
                if (typeof grabApi.onGrab === "function") {
                    grabApi.onGrab((content: { code: string; filePath: string }) => {
                        setGrabContent({
                            code: content.code,
                            filePath: content.filePath,
                        });
                        setIsCollapsed(false);
                    });
                }
            } catch (error) {
                console.error("Failed to initialize react-grab:", error);
            }
        };

        initGrab();

        // Track mouse position for overlay positioning
        const handleMouseMove = (e: MouseEvent) => {
            setCursorPosition({ x: e.clientX, y: e.clientY });
        };
        document.addEventListener("mousemove", handleMouseMove);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, [isDevelopment, mounted]);

    // In production or before mount, just render children
    if (!mounted || !isDevelopment) {
        return <>{children}</>;
    }

    return (
        <>
            {children}
            {grabContent && cursorPosition && (
                <ReactGrabChatbox
                    grabContent={grabContent}
                    cursorPosition={cursorPosition}
                    changeRequest={changeRequest}
                    processingState={processingState}
                    apiResponse={apiResponse}
                    commitSha={commitSha}
                    hasAppliedChange={hasAppliedChange}
                    isCollapsed={isCollapsed}
                    onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                    onChangeRequestChange={setChangeRequest}
                    onApply={handleApply}
                    onCommit={handleCommit}
                    onDismiss={handleDismiss}
                    onReset={handleReset}
                />
            )}
        </>
    );
}
