const SidebarSkeleton = () => {
    const skeletonContacts = Array(8).fill(null);

    return (
        <aside className="h-full w-20 lg:w-72 border-r border-glass-border flex flex-col transition-all duration-200">
            <div className="border-b border-glass-border w-full p-5">
                <div className="flex items-center gap-2">
                    <div className="size-6 bg-slate-800 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-slate-800 rounded animate-pulse hidden lg:block" />
                </div>
            </div>

            <div className="overflow-y-auto w-full py-3">
                {skeletonContacts.map((_, idx) => (
                    <div key={idx} className="w-full p-3 flex items-center gap-3">
                        <div className="relative mx-auto lg:mx-0">
                            <div className="size-12 bg-slate-800 rounded-full animate-pulse" />
                        </div>

                        <div className="hidden lg:block text-left min-w-0 flex-1">
                            <div className="h-4 w-32 bg-slate-800 rounded mb-2 animate-pulse" />
                            <div className="h-3 w-16 bg-slate-800 rounded animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default SidebarSkeleton;
