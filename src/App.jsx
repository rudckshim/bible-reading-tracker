import React, { useEffect, useMemo, useState } from "react";import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronDown, Globe2, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";

const LANGUAGES = {
  ko: {
    label: "한국어",
    appName: "Worship and Praise our Christ!",
    title: "성경 일독 체크표",
    description: "각 장을 누르면 색칠됩니다.",
    reset: "초기화",
    completed: "완료",
    incomplete: "미완료",
    chapterUnit: "장",
    progressText: (checked, total) => `${checked} / ${total}장 완료`,
    books: [
      "창세기", "출애굽기", "레위기", "민수기", "신명기", "여호수아", "사사기", "룻기", "사무엘상", "사무엘하",
      "열왕기상", "열왕기하", "역대상", "역대하", "에스라", "느헤미야", "에스더", "욥기", "시편", "잠언",
      "전도서", "아가", "이사야", "예레미야", "예레미야애가", "에스겔", "다니엘", "호세아", "요엘", "아모스",
      "오바댜", "요나", "미가", "나훔", "하박국", "스바냐", "학개", "스가랴", "말라기", "마태복음",
      "마가복음", "누가복음", "요한복음", "사도행전", "로마서", "고린도전서", "고린도후서", "갈라디아서", "에베소서", "빌립보서",
      "골로새서", "데살로니가전서", "데살로니가후서", "디모데전서", "디모데후서", "디도서", "빌레몬서", "히브리서", "야고보서", "베드로전서",
      "베드로후서", "요한일서", "요한이서", "요한삼서", "유다서", "요한계시록",
    ],
  },
  en: {
    label: "English",
    appName: "Worship and Praise our Christ!",
    title: "Bible Reading Tracker",
    description: "Tap each chapter to color it in.",
    reset: "Reset",
    completed: "completed",
    incomplete: "incomplete",
    chapterUnit: "chapters",
    progressText: (checked, total) => `${checked} / ${total} chapters completed`,
    books: [
      "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
      "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
      "Ecclesiastes", "Song of Songs", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
      "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi", "Matthew",
      "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians",
      "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter",
      "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation",
    ],
  },
  es: {
    label: "Español",
    appName: "Worship and Praise our Christ!",
    title: "Registro de lectura bíblica",
    description: "Toca cada capítulo para colorearlo.",
    reset: "Reiniciar",
    completed: "completado",
    incomplete: "incompleto",
    chapterUnit: "capítulos",
    progressText: (checked, total) => `${checked} / ${total} capítulos completados`,
    books: [
      "Génesis", "Éxodo", "Levítico", "Números", "Deuteronomio", "Josué", "Jueces", "Rut", "1 Samuel", "2 Samuel",
      "1 Reyes", "2 Reyes", "1 Crónicas", "2 Crónicas", "Esdras", "Nehemías", "Ester", "Job", "Salmos", "Proverbios",
      "Eclesiastés", "Cantar de los Cantares", "Isaías", "Jeremías", "Lamentaciones", "Ezequiel", "Daniel", "Oseas", "Joel", "Amós",
      "Abdías", "Jonás", "Miqueas", "Nahúm", "Habacuc", "Sofonías", "Hageo", "Zacarías", "Malaquías", "Mateo",
      "Marcos", "Lucas", "Juan", "Hechos", "Romanos", "1 Corintios", "2 Corintios", "Gálatas", "Efesios", "Filipenses",
      "Colosenses", "1 Tesalonicenses", "2 Tesalonicenses", "1 Timoteo", "2 Timoteo", "Tito", "Filemón", "Hebreos", "Santiago", "1 Pedro",
      "2 Pedro", "1 Juan", "2 Juan", "3 Juan", "Judas", "Apocalipsis",
    ],
  },
  zh: {
    label: "中文",
    appName: "Worship and Praise our Christ!",
    title: "圣经阅读打卡表",
    description: "点击每一章即可上色。",
    reset: "重置",
    completed: "已完成",
    incomplete: "未完成",
    chapterUnit: "章",
    progressText: (checked, total) => `已完成 ${checked} / ${total} 章`,
    books: [
      "创世记", "出埃及记", "利未记", "民数记", "申命记", "约书亚记", "士师记", "路得记", "撒母耳记上", "撒母耳记下",
      "列王纪上", "列王纪下", "历代志上", "历代志下", "以斯拉记", "尼希米记", "以斯帖记", "约伯记", "诗篇", "箴言",
      "传道书", "雅歌", "以赛亚书", "耶利米书", "耶利米哀歌", "以西结书", "但以理书", "何西阿书", "约珥书", "阿摩司书",
      "俄巴底亚书", "约拿书", "弥迦书", "那鸿书", "哈巴谷书", "西番雅书", "哈该书", "撒迦利亚书", "玛拉基书", "马太福音",
      "马可福音", "路加福音", "约翰福音", "使徒行传", "罗马书", "哥林多前书", "哥林多后书", "加拉太书", "以弗所书", "腓立比书",
      "歌罗西书", "帖撒罗尼迦前书", "帖撒罗尼迦后书", "提摩太前书", "提摩太后书", "提多书", "腓利门书", "希伯来书", "雅各书", "彼得前书",
      "彼得后书", "约翰一书", "约翰二书", "约翰三书", "犹大书", "启示录",
    ],
  },
  ja: {
    label: "日本語",
    appName: "Worship and Praise our Christ!",
    title: "聖書通読チェック表",
    description: "各章をタップすると色が付きます。",
    reset: "リセット",
    completed: "完了",
    incomplete: "未完了",
    chapterUnit: "章",
    progressText: (checked, total) => `${checked} / ${total}章 完了`,
    books: [
      "創世記", "出エジプト記", "レビ記", "民数記", "申命記", "ヨシュア記", "士師記", "ルツ記", "サムエル記上", "サムエル記下",
      "列王記上", "列王記下", "歴代誌上", "歴代誌下", "エズラ記", "ネヘミヤ記", "エステル記", "ヨブ記", "詩篇", "箴言",
      "伝道者の書", "雅歌", "イザヤ書", "エレミヤ書", "哀歌", "エゼキエル書", "ダニエル書", "ホセア書", "ヨエル書", "アモス書",
      "オバデヤ書", "ヨナ書", "ミカ書", "ナホム書", "ハバクク書", "ゼパニヤ書", "ハガイ書", "ゼカリヤ書", "マラキ書", "マタイの福音書",
      "マルコの福音書", "ルカの福音書", "ヨハネの福音書", "使徒の働き", "ローマ人への手紙", "コリント人への手紙 第一", "コリント人への手紙 第二", "ガラテヤ人への手紙", "エペソ人への手紙", "ピリピ人への手紙",
      "コロサイ人への手紙", "テサロニケ人への手紙 第一", "テサロニケ人への手紙 第二", "テモテへの手紙 第一", "テモテへの手紙 第二", "テトスへの手紙", "ピレモンへの手紙", "ヘブル人への手紙", "ヤコブの手紙", "ペテロの手紙 第一",
      "ペテロの手紙 第二", "ヨハネの手紙 第一", "ヨハネの手紙 第二", "ヨハネの手紙 第三", "ユダの手紙", "ヨハネの黙示録",
    ],
  },
};

const BOOK_CHAPTERS = [
  50, 40, 27, 36, 34, 24, 21, 4, 31, 24,
  22, 25, 29, 36, 10, 13, 10, 42, 150, 31,
  12, 8, 66, 52, 5, 48, 12, 14, 3, 9,
  1, 4, 7, 3, 3, 3, 2, 14, 4, 28,
  16, 24, 21, 28, 16, 16, 13, 6, 6, 4,
  4, 5, 3, 6, 4, 3, 1, 13, 5, 5,
  3, 5, 1, 1, 1, 22,
];

function hslForBook(index) {
  const startHue = 8;
  const endHue = 275;
  const hue = startHue + (endHue - startHue) * (index / (BOOK_CHAPTERS.length - 1));
  return `hsl(${hue} 78% 58%)`;
}

function storageKey(bookIndex, chapter) {
  return `book-${bookIndex + 1}-chapter-${chapter}`;
}

function getSavedLanguage() {
  try {
    const saved = localStorage.getItem("bible-reading-language");
    return LANGUAGES[saved] ? saved : "ko";
  } catch {
    return "ko";
  }
}

function getSavedChecks() {
  try {
    return JSON.parse(localStorage.getItem("bible-reading-checked") || "{}");
  } catch {
    return {};
  }
}

export default function App() {
  useEffect(() => {
    if (Capacitor.getPlatform() !== "web") {
      StatusBar.setOverlaysWebView({ overlay: false });
      StatusBar.setStyle({ style: Style.Light });
      StatusBar.setBackgroundColor({ color: "#f8fafc" });
    }
  }, []);

  const [language, setLanguage] = useState(getSavedLanguage);
  const [checked, setChecked] = useState(getSavedChecks);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const t = LANGUAGES[language];

  const books = useMemo(
    () =>
      BOOK_CHAPTERS.map((chapters, index) => ({
        name: t.books[index],
        chapters,
        index,
      })),
    [t]
  );

  const totalChapters = BOOK_CHAPTERS.reduce((sum, chapters) => sum + chapters, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const progress = Math.round((checkedCount / totalChapters) * 100);

  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    localStorage.setItem("bible-reading-language", nextLanguage);
    setIsLanguageOpen(false);
  };

  const toggleChapter = (bookIndex, chapter) => {
    const key = storageKey(bookIndex, chapter);
    setChecked((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem("bible-reading-checked", JSON.stringify(next));
      return next;
    });
  };

  const resetAll = () => {
    setChecked({});
    localStorage.removeItem("bible-reading-checked");
  };

  return (
      <div className="min-h-screen bg-slate-50 px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] text-slate-900 sm:px-4 sm:pb-4 sm:pt-[max(1rem,env(safe-area-inset-top))] md:px-8 md:pb-8 md:pt-[max(2rem,env(safe-area-inset-top))]">      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl bg-white p-4 shadow-sm sm:p-6 md:p-8">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="min-w-0 flex-1 whitespace-nowrap pr-2 text-[clamp(0.58rem,2.4vw,0.875rem)] font-medium leading-none text-slate-500">
                {t.appName}
              </p>

              <div className="flex shrink-0 items-center gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsLanguageOpen((prev) => !prev)}
                    className="flex min-w-fit items-center gap-1.5 whitespace-nowrap rounded-2xl bg-slate-100 px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 sm:gap-2 sm:px-4 sm:py-3 sm:text-sm"
                  >
                    <Globe2 className="h-4 w-4 shrink-0 text-slate-500" />
                    <span className="whitespace-nowrap">{t.label}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-slate-500 transition ${
                        isLanguageOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isLanguageOpen && (
                    <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-2xl bg-white p-2 shadow-xl ring-1 ring-slate-200">
                      {Object.entries(LANGUAGES).map(([code, info]) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => changeLanguage(code)}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${
                            language === code
                              ? "bg-slate-100 text-slate-900"
                              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <span>{info.label}</span>
                          {language === code && <CheckCircle2 className="h-4 w-4" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={resetAll}
                  className="h-auto shrink-0 gap-1.5 rounded-2xl px-3 py-2.5 text-xs sm:gap-2 sm:px-4 sm:py-3 sm:text-sm"
                >
                  <RotateCcw className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">{t.reset}</span>
                </Button>
              </div>
            </div>

            <div className="text-left">
              <h1 className="text-[clamp(1.7rem,7vw,3rem)] font-bold leading-tight tracking-tight text-slate-900">
                {t.title}
              </h1>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">
                {t.description}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-sm font-medium text-slate-600">
              <span>{t.progressText(checkedCount, totalChapters)}</span>
              <span>{progress}%</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-200">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-red-400 via-amber-400 via-emerald-400 via-sky-400 to-violet-500"
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 80, damping: 18 }}
              />
            </div>
          </div>
        </header>

        <main className="space-y-4">
          {books.map((book) => {
            const color = hslForBook(book.index);
            const bookChecked = Array.from(
              { length: book.chapters },
              (_, i) => checked[storageKey(book.index, i + 1)]
            ).filter(Boolean).length;

            return (
              <Card key={book.index} className="overflow-hidden rounded-3xl border-0 shadow-sm">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: color }} />
                    <h2 className="text-xl font-bold">{book.name}</h2>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                      {bookChecked}/{book.chapters}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {Array.from({ length: Math.ceil(book.chapters / 10) }, (_, rowIndex) => {
                      const start = rowIndex * 10 + 1;
                      const end = Math.min(start + 9, book.chapters);

                      return (
                        <div
                          key={rowIndex}
                          className="grid grid-cols-10 gap-[clamp(0.2rem,1vw,0.5rem)]"
                        >
                          {Array.from({ length: end - start + 1 }, (_, i) => {
                            const chapter = start + i;
                            const key = storageKey(book.index, chapter);
                            const isChecked = !!checked[key];

                            return (
                              <motion.button
                                key={key}
                                type="button"
                                whileTap={{ scale: 0.9 }}
                                onClick={() => toggleChapter(book.index, chapter)}
                                className="relative flex aspect-square w-full min-w-0 items-center justify-center rounded-full border-[clamp(1px,0.45vw,2px)] text-[clamp(0.62rem,2.9vw,0.95rem)] font-bold transition focus:outline-none focus:ring-2 focus:ring-offset-2"
                                style={{
                                  borderColor: color,
                                  backgroundColor: isChecked ? color : "white",
                                  color: isChecked ? "white" : color,
                                  boxShadow: isChecked ? `0 8px 18px ${color}33` : "none",
                                }}
                                aria-label={`${book.name} ${chapter} ${t.chapterUnit} ${
                                  isChecked ? t.completed : t.incomplete
                                }`}
                              >
                                {isChecked && (
                                  <CheckCircle2 className="absolute h-5 w-5 opacity-20" />
                                )}
                                <span>{chapter}</span>
                              </motion.button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </main>

        <footer className="pb-6 pt-2 text-center text-sm text-slate-400">
          <p>
            Made by Rudckshim ·{" "}
            <a
              href="https://github.com/rudckshim"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-slate-600"
            >
              GitHub
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}