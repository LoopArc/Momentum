// src/features/WelcomeTourModal.jsx

// A simple, zero-dependency modal component
export const WelcomeTourModal = ({ onStart, onDecline }) => {
  return (
    <div className="fixed inset-0 bg-bg-color/60 backdrop-blur-md z-[9998] flex justify-center items-center p-4">
      <div className="bg-gray-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-2xl w-full max-w-md border border-white/10 text-center shadow-xl max-h-[calc(100vh-2rem)] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-primary-text">
          به Momentum خوش آمدید!
        </h2>
        <p className="text-sm text-secondary-text mb-6">
          آیا مایلید یک تور کوتاه برای آشنایی با ویژگی‌های اصلی داشته باشید؟
        </p>
        <div className="flex gap-4">
          <button
            onClick={onStart}
            className="flex-1 py-3 rounded-lg font-medium text-base cursor-pointer transition-colors bg-accent text-bg-color hover:bg-button-hover"
          >
            بله، تور را نشان بده
          </button>
          <button
            onClick={onDecline}
            className="flex-1 py-3 border border-border-default hover:border-gray-500 rounded-lg font-medium text-base cursor-pointer transition-colors text-primary-text"
          >
            شاید بعداً
          </button>
        </div>
      </div>
    </div>
  );
};

