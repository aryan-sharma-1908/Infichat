import React from "react";
import { MessageCircle, Users } from "lucide-react";

const ConversationSkeleton = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      {/* Blurry gradient background using #fbadba and #8ADCF9 */}
      <div
        className="absolute inset-0 bg-[linear-gradient(135deg,#fef5f6_0%,#f2fafd_50%,#e8f7fc_100%)] dark:bg-[linear-gradient(135deg,#1a1516_0%,#0f1a1f_50%,#151a24_100%)]"
      />
      <div className="absolute top-1/4 -left-20 h-64 w-64 rounded-full bg-[#fbadba]/40 dark:bg-[#fbadba]/25 blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 h-72 w-72 rounded-full bg-[#8ADCF9]/40 dark:bg-[#8ADCF9]/25 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-96 rounded-full bg-[#fbadba]/20 dark:bg-[#8ADCF9]/15 blur-3xl" />

      <div className="relative z-10 bg-white/80 dark:bg-[#37353E]/90 backdrop-blur-md shadow-xl rounded-3xl p-10 max-w-md border border-[#fbadba]/20 dark:border-white/10">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-[#fbadba]/20 dark:bg-[#8ADCF9]/20 flex items-center justify-center border border-[#fbadba]/30 dark:border-[#8ADCF9]/30">
            <MessageCircle size={32} className="text-[#fbadba] dark:text-[#8ADCF9]" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">
          No conversation selected
        </h2>

        <p className="text-gray-500 dark:text-gray-300 mb-6">
          Pick a friend from the left to start chatting or continue a
          conversation.
        </p>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-400 dark:text-gray-400">
          <Users size={16} className="text-[#8ADCF9]" />
          <span>Your chats will appear here</span>
        </div>
      </div>
    </div>
  );
};

export default ConversationSkeleton;
