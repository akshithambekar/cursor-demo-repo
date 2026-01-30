"use client";

import React from "react";
import {
    ChevronUp,
    ChevronDown,
    CheckCircle,
    AlertCircle,
    Loader2,
    Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
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
    if (!grabContent || !cursorPosition) {
        return null;
    }

    return (
        <div
            className="fixed z-9999 max-w-md"
            style={{
                width: "380px",
                left: Math.min(
                    cursorPosition.x + 10,
                    window.innerWidth - 400
                ),
                top: Math.min(
                    cursorPosition.y + 10,
                    window.innerHeight - 400
                ),
            }}
        >
            <Card
                className={cn(
                    "shadow-lg border-2 transition-all duration-300 ease-in-out",
                    isCollapsed ? "h-auto" : "h-auto"
                )}
            >
                <CardHeader
                    className={cn(
                        "flex flex-row items-center justify-between py-3 px-4 cursor-pointer relative",
                        "bg-linear-to-r from-violet-600 to-indigo-600 text-white"
                    )}
                    onClick={onToggleCollapse}
                >
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        React-Grab Editor
                    </CardTitle>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDismiss();
                            }}
                            className="p-1 hover:bg-white/20 rounded transition-colors"
                        >
                            <Zap
                                className="h-3 w-3"
                                style={{ transform: "rotate(45deg)" }}
                            />
                        </button>
                        {isCollapsed ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </div>
                </CardHeader>

                {!isCollapsed && (
                    <CardContent className="p-4 space-y-4">
                        {/* Selected Element Info */}
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground">
                                Selected Element
                            </Label>
                            <div className="bg-muted rounded-md p-3 text-xs font-mono overflow-x-auto">
                                <div className="text-emerald-600 dark:text-emerald-400 mb-1">
                                    in {grabContent.filePath}
                                </div>
                                <pre className="text-foreground whitespace-pre-wrap break-all">
                                    {grabContent.code}
                                </pre>
                            </div>
                        </div>

                        <Separator />

                        {/* Change Request Input */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="change-request"
                                className="text-xs font-medium text-muted-foreground"
                            >
                                What would you like to change?
                            </Label>
                            <Textarea
                                id="change-request"
                                placeholder="e.g., Change the button color to blue..."
                                value={changeRequest}
                                onChange={(e) =>
                                    onChangeRequestChange(e.target.value)
                                }
                                disabled={processingState !== "idle"}
                                className="min-h-[80px] resize-none text-sm"
                            />
                        </div>

                        {/* Processing States */}
                        {processingState !== "idle" && (
                            <div className="space-y-2">
                                <Separator />
                                <div className="flex items-center gap-2 text-sm">
                                    {processingState === "applying" && (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                            <span className="text-blue-600 dark:text-blue-400">
                                                Applying changes with
                                                OpenCode...
                                            </span>
                                        </>
                                    )}
                                    {processingState ===
                                        "committing" && (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                                            <span className="text-orange-600 dark:text-orange-400">
                                                Committing and pushing
                                                changes...
                                            </span>
                                        </>
                                    )}
                                    {processingState === "success" && (
                                        <>
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span className="text-green-600 dark:text-green-400">
                                                Changes committed
                                                successfully!
                                            </span>
                                        </>
                                    )}
                                    {processingState === "error" && (
                                        <>
                                            <AlertCircle className="h-4 w-4 text-red-500" />
                                            <span className="text-red-600 dark:text-red-400">
                                                {apiResponse ||
                                                    "An error occurred"}
                                            </span>
                                        </>
                                    )}
                                </div>
                                {commitSha && (
                                    <div className="text-xs text-muted-foreground font-mono bg-muted rounded px-2 py-1">
                                        Commit: {commitSha}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Success: HMR Reminder */}
                        {processingState === "success" && (
                            <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950 rounded px-3 py-2">
                                The preview will auto-refresh via HMR
                                when the change is applied.
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            {processingState === "idle" ? (
                                <>
                                    <Button
                                        onClick={onApply}
                                        disabled={!changeRequest.trim()}
                                        className="flex-1 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                                    >
                                        Apply
                                    </Button>
                                    <Button
                                        onClick={onCommit}
                                        disabled={!hasAppliedChange}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        Commit
                                    </Button>
                                </>
                            ) : processingState === "success" ||
                              processingState === "error" ? (
                                <Button onClick={onReset} className="flex-1">
                                    {processingState === "success"
                                        ? "Make Another Change"
                                        : "Try Again"}
                                </Button>
                            ) : null}
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
