"use client";

import React from "react";
import {
    ChevronUp,
    ChevronDown,
    CheckCircle,
    AlertCircle,
    Loader2,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type ProcessingState = "idle" | "applying" | "committing" | "success" | "error";

interface GrabContent {
    code: string;
    filePath: string;
}

interface ReactGrabChatboxProps {
    grabContent: GrabContent | null;
    cursorPosition: { x: number; y: number } | null;
    changeRequest: string;
    processingState: ProcessingState;
    apiResponse: string;
    commitSha: string;
    hasAppliedChange: boolean;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    onChangeRequestChange: (value: string) => void;
    onApply: () => void;
    onCommit: () => void;
    onDismiss: () => void;
    onReset: () => void;
}

export function ReactGrabChatbox({
    grabContent,
    cursorPosition,
    changeRequest,
    processingState,
    apiResponse,
    commitSha,
    hasAppliedChange,
    isCollapsed,
    onToggleCollapse,
    onChangeRequestChange,
    onApply,
    onCommit,
    onDismiss,
    onReset,
}: ReactGrabChatboxProps) {
    if (!grabContent) {
        return null;
    }

    const safePosition = cursorPosition || { x: 100, y: 100 };
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

    return (
        <div
            className="fixed z-9999 max-w-md"
            style={{
                width: "380px",
                left: Math.min(
                    safePosition.x + 10,
                    windowWidth - 400
                ),
                top: Math.min(
                    safePosition.y + 10,
                    windowHeight - 400
                ),
            }}
        >
            <Card
                className={cn(
                    "shadow-lg border border-zinc-800 bg-zinc-950 transition-all duration-300 ease-in-out overflow-hidden",
                    isCollapsed ? "h-auto" : "h-auto"
                )}
            >
                {/* Header */}
                <div
                    className={cn(
                        "flex flex-row items-center justify-between py-2 px-3",
                        "bg-zinc-900 border-b border-zinc-800"
                    )}
                >
                    <div className="text-xs text-emerald-600 font-mono">
                        in {grabContent.filePath}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onToggleCollapse}
                            className="p-1 hover:bg-white/20 rounded transition-colors"
                        >
                            {isCollapsed ? (
                                <ChevronDown className="h-4 w-4 text-zinc-500" />
                            ) : (
                                <ChevronUp className="h-4 w-4 text-zinc-500" />
                            )}
                        </button>
                        <button
                            onClick={onDismiss}
                            className="p-1 hover:bg-white/20 rounded transition-colors"
                        >
                            <X className="h-4 w-4 text-zinc-500" />
                        </button>
                    </div>
                </div>

                {!isCollapsed && (
                    <CardContent className="p-0">
                        {/* Textarea */}
                        <Textarea
                            id="change-request"
                            placeholder="What would you like to change?"
                            value={changeRequest}
                            onChange={(e) =>
                                onChangeRequestChange(e.target.value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    if (changeRequest.trim() && processingState === "idle") {
                                        onApply();
                                    }
                                }
                            }}
                            disabled={processingState !== "idle"}
                            className="min-h-[150px] resize-none text-sm text-white bg-zinc-950 border-0 rounded-none focus-visible:ring-0 placeholder:text-zinc-500"
                        />

                        {/* Status Messages */}
                        {processingState !== "idle" && (
                            <div className="px-3 py-2 border-t border-zinc-800">
                                <div className="flex items-center gap-2 text-sm">
                                    {processingState === "applying" && (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                            <span className="text-blue-500">
                                                Applying changes...
                                            </span>
                                        </>
                                    )}
                                    {processingState === "committing" && (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                                            <span className="text-orange-500">
                                                Committing changes...
                                            </span>
                                        </>
                                    )}
                                    {processingState === "success" && (
                                        <>
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span className="text-green-500">
                                                Changes applied!
                                            </span>
                                        </>
                                    )}
                                    {processingState === "error" && (
                                        <>
                                            <AlertCircle className="h-4 w-4 text-red-500" />
                                            <span className="text-red-500">
                                                {apiResponse ||
                                                    "An error occurred"}
                                            </span>
                                        </>
                                    )}
                                </div>
                                {commitSha && (
                                    <div className="text-xs text-white font-mono mt-1">
                                        {commitSha}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Apply Button */}
                        <div className="p-3 border-t border-zinc-800">
                            <Button
                                onClick={onApply}
                                disabled={
                                    !changeRequest.trim() ||
                                    processingState !== "idle"
                                }
                                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white"
                            >
                                Apply
                            </Button>
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
