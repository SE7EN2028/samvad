const MessageSkeleton = () => {
    const skeletonMessages = Array(6).fill(null);

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {skeletonMessages.map((_, idx) => (
                <div key={idx} className={`flex ${idx % 2 === 0 ? "justify-start" : "justify-end"}`}>
                    <div className="max-w-[70%]">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="size-8 rounded-full bg-slate-800 animate-pulse" />
                            <div className="h-4 w-16 bg-slate-800 rounded animate-pulse" />
                        </div>
                        <div className="h-16 w-48 bg-slate-800 rounded-2xl animate-pulse" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MessageSkeleton;
