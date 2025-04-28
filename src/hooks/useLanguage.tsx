import { useState, useEffect, createContext, useContext } from "react";
import { translations } from "@/i18n/translations";

export type Language = "en" | "zh";

// 创建一个上下文以在整个应用中共享语言状态
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// 语言提供者组件
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const savedLanguage = localStorage.getItem("language") as Language;
      return (savedLanguage === "zh" || savedLanguage === "en") ? savedLanguage : "en";
    } catch (error) {
      console.error("读取语言设置错误:", error);
      return "en";
    }
  });

  // 更新语言并保存到localStorage
  const setLanguage = (lang: Language) => {
    try {
      localStorage.setItem("language", lang);
      setLanguageState(lang);
    } catch (error) {
      console.error("保存语言设置错误:", error);
      setLanguageState(lang); // 即使存储失败也更新状态
    }
  };

  const value = {
    language,
    setLanguage,
    t: translations[language]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// 导出自定义钩子
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage必须在LanguageProvider内部使用");
  }
  return context;
};