"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
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
    const [hasAppliedChange, setHasAppliedChange] = useState(false);
    const chatboxRef = useRef<HTMLDivElement>(null);
    const reactGrabApiRef = useRef<any>(null);

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

            // Call the apply API
            const changeResponse = await fetch("/api/opencode/apply", {
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
    }, []);

    const handleDismiss = useCallback(() => {
        setGrabContent(null);
        setChangeRequest("");
        setProcessingState("idle");
        setApiResponse("");
        setCommitSha("");
        setHasAppliedChange(false);
    }, []);

    const handleCommit = useCallback(async () => {
        if (!grabContent) {
            return;
        }

        try {
            setProcessingState("committing");

            // Call the apply API to commit and push
            const applyResponse = await fetch("/api/opencode/commit", {
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
        const initGrab = async () => {
            try {
                const { init } = await import("react-grab/core");
                const api = init({
                    onElementSelect: (element: any) => {
                        setGrabContent({
                            code:
                                element.code ||
                                element.element?.outerHTML ||
                                "",
                            filePath: element.filePath || "",
                        });
                        setIsCollapsed(false);
                    },
                });
                reactGrabApiRef.current = api;
            } catch (error) {
                console.error("Failed to initialize react-grab:", error);
            }
        };

        if (isDevelopment && mounted) {
            initGrab();
        }
    }, [isDevelopment, mounted]);

    useEffect(() => {
        setIsDevelopment(process.env.NODE_ENV === "development");
        setMounted(true);
    }, []);

    // Deactivate react-grab when chatbox opens
    useEffect(() => {
        if (reactGrabApiRef.current) {
            if (grabContent) {
                // Deactivate to hide the hover overlay
                reactGrabApiRef.current.deactivate();
            } else {
                // Reactivate when chatbox is closed
                reactGrabApiRef.current.activate();
            }
        }
    }, [grabContent]);

    // Handle escape key to close chatbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && grabContent) {
                handleDismiss();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [grabContent, handleDismiss]);

    // Handle click outside chatbox to close
    const handleBackdropClick = useCallback(
        (e: React.MouseEvent) => {
            if (grabContent && chatboxRef.current) {
                // Check if click is outside the chatbox
                const chatbox = chatboxRef.current.querySelector(
                    '[class*="shadow-lg"]'
                );
                if (chatbox && !chatbox.contains(e.target as Node)) {
                    handleDismiss();
                }
            }
        },
        [grabContent, handleDismiss]
    );

    if (!mounted || !isDevelopment) {
        return <>{children}</>;
    }

    return (
        <div ref={chatboxRef} onClick={handleBackdropClick} className="relative">
            {children}
            {grabContent && (
                <div onClick={(e) => e.stopPropagation()}>
                    <ReactGrabChatbox
                        grabContent={grabContent}
                        cursorPosition={{ x: 100, y: 100 }}
                        changeRequest={changeRequest}
                        processingState={processingState}
                        apiResponse={apiResponse}
                        commitSha={commitSha}
                        hasAppliedChange={hasAppliedChange}
                        isCollapsed={isCollapsed}
                        onToggleCollapseAction={() => setIsCollapsed(!isCollapsed)}
                        onChangeRequestChangeAction={setChangeRequest}
                        onApplyAction={handleApply}
                        onCommitAction={handleCommit}
                        onDismissAction={handleDismiss}
                        onResetAction={handleReset}
                    />
                </div>
            )}
        </div>
    );
}
