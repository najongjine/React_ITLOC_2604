import React from "react";

interface ChatHeaderProps {
    onReset: () => void;
    isStreaming: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onReset, isStreaming }) => {
    return (
        <div
            className="aivtuber-header"
            style={{
            }}
        >
            <h1>
                AI Vtuber (LlamaIndex)
            </h1>
            <button
                className="aivtuber-reset-button"
                onClick={onReset}
                disabled={isStreaming}
                style={{
                    background: isStreaming ? "#aaa" : "#50E3C2",
                    cursor: isStreaming ? "not-allowed" : "pointer",
                }}
            >
                🔄 대화 초기화
            </button>
        </div>
    );
};

export default ChatHeader;
