// v4
import { useState, useEffect } from "react";

const SUPABASE_URL = "https://sawwcbecxhbjkmnxgmpw.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhd3djYmVjeGhiamttbnhnbXB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NjA1NzUsImV4cCI6MjA5ODIzNjU3NX0.qvAbYXSRXSdqgletnTNUxILit5u99V_j1yrSr0smGWs";
const SB_HEADERS = { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Prefer": "return=representation" };

async function sbGet(table) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?order=id.asc`, { headers: SB_HEADERS });
    const d = await r.json();
    return Array.isArray(d) && d.length > 0 ? d : null;
  } catch { return null; }
}
async function sbPost(table, data) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, { method: "POST", headers: SB_HEADERS, body: JSON.stringify(data) });
    return r.json();
  } catch { return null; }
}

// נתונים סטטיים — fallback אם Supabase לא נגיש מהארטיפקט
const STATIC_RESOURCES = [
  { id: 1, title: "GAD-7 — שאלון חרדה כללית", type: "שאלון", description: "שאלון 7 פריטים למדידת חומרת חרדה כללית. מתאים לסקירה ומעקב.", tags: ["חרדה","GAD","דאגה","פאניקה"], link: "https://www.hiv.uw.edu/page/mental-health-screening/gad-7", lang: "אנגלית", source: "" },
  { id: 2, title: "PHQ-9 — שאלון דיכאון", type: "שאלון", description: "כלי סקירה ומדידה לדיכאון מג'ורי. נרחב וקל ליישום.", tags: ["דיכאון","MDD","עצב","אנהדוניה"], link: "https://www.phqscreeners.com/", lang: "אנגלית", source: "" },
  { id: 3, title: "זיהוי מחשבות אוטומטיות — גישת בק", type: "פרוטוקול", description: "לפי ג'ודית בק: זיהוי NATs באמצעות שאלות סוקרטיות ורישום מחשבות. שלב יסוד ב-CBT.", tags: ["חרדה","דיכאון","מחשבות אוטומטיות","עיוותי חשיבה"], link: "#", lang: "עברית", source: "judith-beck" },
  { id: 4, title: "עבודה על אמונות ליבה (Core Beliefs) — בק", type: "פרוטוקול", description: "לפי בק: זיהוי אמונות ליבה שליליות ושינוין דרך שאלות ובדיקת עדויות.", tags: ["חרדה","דיכאון","אמונות ליבה","סכמות"], link: "#", lang: "עברית", source: "judith-beck" },
  { id: 5, title: "הפעלה התנהגותית ותזמון פעילויות — בק", type: "פרוטוקול", description: "טכניקה מרכזית לדיכאון: תכנון פעילויות מהנות ומשמעותיות, מדידת הנאה ושליטה.", tags: ["דיכאון","חרדה","הפעלה התנהגותית"], link: "#", lang: "עברית", source: "judith-beck" },
  { id: 6, title: "דף עבודה לבדיקת מחשבות — 7 עמודות (בק)", type: "פרוטוקול", description: "תיעוד מצב, מחשבה אוטומטית, רגש, עדויות בעד ונגד, מחשבה מאוזנת, תוצאה.", tags: ["חרדה","דיכאון","בדיקת מציאות","עיוותי חשיבה"], link: "#", lang: "עברית", source: "judith-beck" },
  { id: 7, title: "ERP — חשיפה ומניעת תגובה", type: "פרוטוקול", description: "פרוטוקול מובנה לטיפול ב-OCD. כולל היררכיית חשיפות ויומן מעקב.", tags: ["OCD","כפייתיות","טקסים","חשיפה"], link: "#", lang: "אנגלית", source: "" },
  { id: 8, title: "פרוטוקול חשיפה הדרגתית", type: "פרוטוקול", description: "בניית סולם חשיפות מ-0 ל-100 SUDS, מדריך למטפל ומטופל.", tags: ["פוביה","חרדה חברתית","חשיפה","SUDS"], link: "#", lang: "עברית", source: "" },
  { id: 9, title: "PE — חשיפה ממושכת לטראומה", type: "פרוטוקול", description: "פרוטוקול Prolonged Exposure של פואה. מבנה 12 מפגשים.", tags: ["PTSD","טראומה","זיכרונות"], link: "#", lang: "אנגלית", source: "" },
  { id: 10, title: "המודל הקוגניטיבי — הסבר למטופל (לפי בק)", type: "פסיכואדוקציה", description: "הסבר על הקשר בין מחשבות, רגשות והתנהגות. יש להציגו כבר במפגש הראשון.", tags: ["דיכאון","חרדה","פסיכואדוקציה","מודל קוגניטיבי"], link: "#", lang: "עברית", source: "judith-beck" },
  { id: 11, title: "הסבר על תגובות פוסט טראומה", type: "פסיכואדוקציה", description: "חוברת למטופל המסבירה תגובות נורמטיביות לטראומה ומסגרת הטיפול.", tags: ["PTSD","טראומה","עיבוד"], link: "#", lang: "עברית", source: "" },
  { id: 12, title: "Cognitive Behavior Therapy: Basics and Beyond — Judith S. Beck", type: "ספר", description: "ספר היסוד של CBT. מכסה את המודל הקוגניטיבי, מחשבות אוטומטיות ואמונות ליבה.", tags: ["CBT","ספר יסוד","דיכאון","חרדה"], link: "https://www.guilford.com/books/Cognitive-Behavior-Therapy/Judith-Beck/9781462544196", lang: "אנגלית", source: "judith-beck" },
  { id: 13, title: "Cognitive Therapy of Depression — Aaron T. Beck", type: "ספר", description: "הספר המקורי של אהרון בק משנת 1979. קלאסי וחובה לכל מטפל CBT.", tags: ["CBT","ספר","דיכאון","אהרון בק"], link: "#", lang: "אנגלית", source: "" },
  { id: 14, title: "Anxiety Free — Robert L. Leahy", type: "ספר", description: "ספר מעשי של רוברט ליהי על טיפול ב-CBT בחרדה. פרקטי ונגיש.", tags: ["CBT","ספר","חרדה","דאגה"], link: "#", lang: "אנגלית", source: "" },
  { id: 15, title: "מחשבות ורגשות — הבסיס לצמיחה אישית | מקיי, דיוויס, פנינג", type: "ספר", description: "רב-מכר ישראלי בעברית. ספר CBT מקיף לשינוי דפוסי חשיבה וניהול רגשות. הוצאת פוקוס.", tags: ["CBT","ספר","עברית","מחשבות","רגשות","דיכאון","חרדה"], link: "#", lang: "עברית", source: "" },
  { id: 16, title: "היבטים — פסיכולוגיה קלינית בעברית", type: "אתר", description: "אתר מקצועי בעברית עם מאמרים, כלים קליניים וחומרי פסיכואדוקציה למטפלים ישראלים.", tags: ["CBT","אתר","עברית","פסיכואדוקציה"], link: "https://www.hebpsy.net/", lang: "עברית", source: "" },
  { id: 17, title: "Beck Institute — אתר רשמי", type: "אתר", description: "האתר הרשמי של מכון ג'ודית בק. משאבים מקצועיים, הכשרות ופרוטוקולים.", tags: ["CBT","אתר","פרוטוקולים","שאלונים"], link: "https://beckinstitute.org/", lang: "אנגלית", source: "judith-beck" },
  { id: 18, title: "Psychology Tools — דפי עבודה ב-CBT", type: "אתר", description: "מאגר ענק של דפי עבודה, מדריכים ופרוטוקולים ב-CBT בשפות שונות.", tags: ["CBT","אתר","דפי עבודה","כלים"], link: "https://www.psychologytools.com/", lang: "אנגלית", source: "" },
  { id: 19, title: "פסיכואדוקציה על דיכאון — מה זה ואיך CBT עוזר", type: "פסיכואדוקציה", description: "הסבר למטופל על דיכאון: מהו, מה גורם לו, ואיך CBT מסייע לצאת ממנו.", tags: ["דיכאון","פסיכואדוקציה","MDD","CBT"], link: "#", lang: "עברית", source: "judith-beck" },
  { id: 20, title: "פסיכואדוקציה על חרדה — מה זה ואיך CBT עוזר", type: "פסיכואדוקציה", description: "הסבר למטופל על חרדה: מהי, מה תפקידה, ולמה הימנעות מחמירה אותה.", tags: ["חרדה","פסיכואדוקציה","CBT","פחד"], link: "#", lang: "עברית", source: "" },
  { id: 21, title: "פסיכואדוקציה על GAD — חרדה כללית מוכללת", type: "פסיכואדוקציה", description: "הסבר למטופל על הפרעת חרדה מוכללת: דאגה כרונית, תסמינים גופניים, ומעגל הדאגה.", tags: ["GAD","חרדה","פסיכואדוקציה","דאגה"], link: "#", lang: "עברית", source: "" },
  { id: 22, title: "פסיכואדוקציה על PTSD — תגובה לטראומה", type: "פסיכואדוקציה", description: "הסבר למטופל על PTSD: מהי טראומה, תגובות נורמטיביות, ומדוע הסימפטומים נמשכים.", tags: ["PTSD","טראומה","פסיכואדוקציה","פלאשבק"], link: "#", lang: "עברית", source: "" },
  { id: 23, title: "פסיכואדוקציה על OCD — מעגל הכפייתיות", type: "פסיכואדוקציה", description: "הסבר למטופל על OCD: מחשבות חודרניות, מעגל הכפייתיות, ולמה הטקסים מחמירים את הבעיה.", tags: ["OCD","כפייתיות","פסיכואדוקציה","מחשבות חודרניות"], link: "#", lang: "עברית", source: "" },
  { id: 24, title: "פסיכואדוקציה על אכילה רגשית — הקשר בין רגשות לאוכל", type: "פסיכואדוקציה", description: "הסבר למטופל על אכילה רגשית: מה זה, למה זה קורה, וכיצד CBT עוזר לשבור את המעגל.", tags: ["אכילה רגשית","פסיכואדוקציה","CBT","רגשות","התמודדות"], link: "#", lang: "עברית", source: "" },
];

const STATIC_THERAPISTS = [
  { id: 1, name: "ד\"ר מיכל לוי", role: "מטפל פעיל", city: "תל אביב", specialties: ["חרדה","דיכאון","OCD"], populations: ["מבוגרים","מתבגרים"], bio: "מטפלת CBT עם 10 שנות ניסיון. מתמחה בחרדה ו-OCD. מוסמכת ממכון בק.", avatar: "מ" },
  { id: 2, name: "עמית כהן", role: "סטודנט CBT", city: "חיפה", specialties: ["PTSD / טראומה"], populations: ["מבוגרים"], bio: "בהכשרה מתקדמת ב-CBT. רקע בעבודה סוציאלית.", avatar: "ע" },
  { id: 3, name: "ד\"ר רונית שמיר", role: "פסיכיאטר", city: "ירושלים", specialties: ["דיכאון","דיספוריה מגדרית","התמכרויות"], populations: ["מבוגרים","LGBTQ+"], bio: "פסיכיאטרית המשלבת CBT בטיפול תרופתי.", avatar: "ר" },
];

const DETAILS = {
  1: { bg: "GAD-7 הוא שאלון סטנדרטי למדידת חרדה כללית, פותח ב-2006. מורכב מ-7 שאלות, כל אחת מדורגת 0-3, סהכ 0-21.", steps: ["0-4: מינימלית", "5-9: קלה", "10-14: בינונית", "15-21: קשה — שקול הפניה"], tips: "ירידה של 5 נקודות נחשבת שיפור קליני משמעותי.", links: [{ l: "GAD-7 רשמי", u: "https://www.hiv.uw.edu/page/mental-health-screening/gad-7" }] },
  2: { bg: "PHQ-9 הוא כלי הסקירה הנפוץ ביותר לדיכאון. 9 שאלות, מדורג 0-27. אמין ומהיר.", steps: ["1-4: מינימלי", "5-9: קל", "10-14: בינוני", "15-19: בינוני-קשה", "20-27: קשה — טיפול דחוף"], tips: "שאלה 9 (מחשבות אובדניות) חובה לברר בנפרד.", links: [{ l: "PHQ-9 רשמי", u: "https://www.phqscreeners.com/" }] },
  3: { bg: "זיהוי מחשבות אוטומטיות (NATs) הוא אבן יסוד ב-CBT של ג'ודית בק. המחשבות הן ספונטניות, מהירות, ולרוב לא מודעות.", steps: ["מפגש 1-2: הצגת המודל הקוגניטיבי", "מפגש 3: זיהוי מחשבות בסיטואציות אישיות", "מפגש 4-5: דף מחשבות (Thought Record)", "מפגש 6+: שאלות סוקרטיות"], tips: "שאלי: 'מה עבר לך בראש ברגע שהרגשת כך?' — זו הדלת למחשבה האוטומטית.", links: [{ l: "Beck Institute", u: "https://beckinstitute.org" }] },
  4: { bg: "אמונות ליבה (Core Beliefs) הן אמונות עמוקות לגבי עצמנו, העולם ועתידנו. לפי בק, הן מתפתחות בילדות ונחשבות כעובדות מוחלטות.", steps: ["שלב 1: זיהוי — טכניקת חץ כלפי מטה (Downward Arrow)", "שלב 2: מיפוי — עדויות בעד ונגד", "שלב 3: ניסוח חלופי מאוזן", "שלב 4: יומן הצלחות לחיזוק"], tips: "אמונות ליבה עמידות — עבדי עליהן לאורך זמן.", links: [{ l: "Psychology Tools", u: "https://www.psychologytools.com" }] },
  5: { bg: "הפעלה התנהגותית שוברת את מעגל הדיכאון: נסיגה מפעילויות מגבירה דיכאון. ההפעלה מכניסה פעילויות חיוביות בחזרה לחיים.", steps: ["שלב 1: מיפוי פעילויות שבוע — דירוג הנאה ושליטה (0-10)", "שלב 2: ניתוח קשר פעילות-רגש", "שלב 3: תכנון פעילויות ביומן", "שלב 4: מעקב לפני ואחרי"], tips: "הפעולה קודמת לרגש — לא צריך להרגיש כמו לעשות משהו כדי לעשות אותו.", links: [{ l: "Psychology Tools", u: "https://www.psychologytools.com" }] },
  6: { bg: "דף עבודה לבדיקת מחשבות (Thought Record) הוא הכלי המרכזי ב-CBT של בק. 7 עמודות שמובילות ממחשבה שלילית לתגובה מאוזנת.", steps: ["עמודה 1: מצב", "עמודה 2: מחשבה אוטומטית + אמונה (0-100%)", "עמודה 3: רגש + עוצמה (0-100%)", "עמודות 4-5: עדויות בעד ונגד", "עמודה 6: מחשבה מאוזנת", "עמודה 7: תוצאה"], tips: "התחילי עם 3 עמודות בלבד ותוסיפי בהדרגה.", links: [{ l: "Psychology Tools", u: "https://www.psychologytools.com" }] },
  7: { bg: "ERP הוא הפרוטוקול הזהב ל-OCD. הרציונל: הימנעות מטקסים משמרת חרדה. חשיפה + מניעת תגובה מלמדים את המוח שהחרדה עוברת.", steps: ["שלב 1: פסיכואדוקציה על מעגל OCD", "שלב 2: בניית היררכיית חשיפות (SUDS 0-100)", "שלב 3: חשיפות קלות ראשונות", "שלב 4: מניעת תגובה בזמן חרדה", "שלב 5: עלייה הדרגתית בהיררכיה"], tips: "להישאר עד שה-SUDS יורד ב-50%. לא לעלות בהיררכיה לפני שמתרגלים.", links: [{ l: "IOCDF", u: "https://iocdf.org" }] },
  8: { bg: "חשיפה הדרגתית לפוביות וחרדות. המטרה: הסתגלות — הלמידה שהגירוי המפחיד אינו מסוכן.", steps: ["שלב 1: הסבר רציונל החשיפה", "שלב 2: בניית סולם SUDS (0-100)", "שלב 3: חשיפה מדומיינת (In Vitro)", "שלב 4: חשיפה חיה (In Vivo)", "שלב 5: מניעת התנהגויות ביטחון"], tips: "להישאר בסיטואציה עד ירידת SUDS ב-50% — עזיבה מוקדמת מחזקת את הפחד.", links: [{ l: "Psychology Tools", u: "https://www.psychologytools.com" }] },
  9: { bg: "PE של פואה ורוטבאום — הפרוטוקול המבוסס ביותר ל-PTSD. מבוסס על תיאוריית עיבוד רגשי: הטראומה שמורה כ'פתוחה' ודורשת עיבוד.", steps: ["מפגש 1-2: פסיכואדוקציה על PTSD", "מפגש 3: נשימה סרעפתית + רשימת הימנעויות", "מפגש 4-9: חשיפה בדמיון (Imaginal Exposure)", "מפגש 4-9 (במקביל): חשיפה In Vivo", "מפגש 10-12: עיבוד ומניעת הישנות"], tips: "לא להתחיל PE לפני יציבות. פסיכואדוקציה וברית טיפולית קודמות.", links: [{ l: "VA PTSD", u: "https://www.ptsd.va.gov" }] },
  10: { bg: "המודל הקוגניטיבי הוא לב ה-CBT. מחשבות (לא אירועים) משפיעות על רגשות והתנהגות. בק מדגישה להציגו כבר במפגש הראשון.", steps: ["הצג מצב: מכר עובר ולא מברך — מה תחשוב?", "הדגם: מחשבות שונות = רגשות שונים", "קשר למצב האישי של המטופל", "שיעורי בית: לשים לב למחשבות ביום"], tips: "דוגמה אישית של המטופל תמיד עדיפה על דוגמה תיאורטית.", links: [{ l: "Beck Institute", u: "https://beckinstitute.org" }] },
  11: { bg: "פסיכואדוקציה על PTSD מפחיתה בושה, מגבירה מוטיבציה ומחזקת ברית טיפולית. צעד ראשון וחיוני.", steps: ["הסבר מהי תגובת PTSD ולמה היא מתרחשת", "נרמול: תגובות נורמליות לאירוע לא נורמלי", "הסבר Fight / Flight / Freeze", "הסבר מדוע הימנעות משמרת סימפטומים"], tips: "הסימפטומים אינם חולשה — הם הגנה של המוח.", links: [{ l: "VA PTSD", u: "https://www.ptsd.va.gov" }] },
  12: { bg: "ספר היסוד של CBT. מהדורה 3 (2021). הטקסט הסטנדרטי להכשרת מטפלי CBT בעולם.", steps: ["פרקים 1-4: יסודות המודל הקוגניטיבי", "פרקים 5-9: תכנון טיפול ומבנה מפגש", "פרקים 10-14: מחשבות אוטומטיות", "פרקים 15-18: אמונות ביניים וליבה", "פרקים 19-22: טכניקות התנהגותיות וסיום"], tips: "תרגלי כל טכניקה על עצמך לפני יישום עם מטופלים.", links: [{ l: "Guilford Press", u: "https://www.guilford.com/books/Cognitive-Behavior-Therapy/Judith-Beck/9781462544196" }] },
  13: { bg: "הספר המקורי של אהרון בק (1979) — יסודות הגישה הקוגניטיבית לדיכאון. קלאסי וחובה.", steps: ["חלק א: תיאוריה — המודל הקוגניטיבי", "חלק ב: טכניקות קוגניטיביות", "חלק ג: טכניקות התנהגותיות", "חלק ד: עדויות אמפיריות"], tips: "לטיפול מעשי יומיומי — ספר ג'ודית בק עדכני יותר.", links: [] },
  14: { bg: "Anxiety Free של רוברט ליהי — פרק נפרד לכל הפרעת חרדה. נגיש למטפלים ומטופלים כאחד.", steps: ["פרק 1: הבנת החרדה", "פרקים 2-7: GAD, OCD, פאניקה, פוביות, PTSD, חרדה חברתית", "כלים: דפי עבודה ותרגילים", "סיכום: שמירה על ההישגים"], tips: "מתאים כספר עזרה עצמית למטופלים.", links: [] },
  15: { bg: "מחשבות ורגשות — רב-מכר ישראלי בעברית. CBT מקיף ומעשי לשינוי דפוסי חשיבה וניהול רגשות.", steps: ["פרקים 1-3: עיוותי חשיבה", "פרקים 4-7: כלים לשינוי מחשבות", "פרקים 8-11: כעס, בושה, אשמה", "פרקים 12+: חיים מספקים יותר"], tips: "מצוין כשיעורי בית — כל פרק כולל תרגילים מעשיים.", links: [] },
  16: { bg: "היבטים — האתר המקצועי המוביל בעברית לפסיכולוגיה קלינית. מאמרים, שאלונים וחומרי פסיכואדוקציה בעברית.", steps: ["מאמרים מקצועיים עדכניים", "חומרי פסיכואדוקציה למטופלים", "שאלונים בעברית", "פורומים מקצועיים"], tips: "כדאי לבדוק לפני מפגשים — חוסך תרגום.", links: [{ l: "היבטים", u: "https://www.hebpsy.net/" }] },
  17: { bg: "האתר הרשמי של מכון בק — מקור ראשוני לחדשות, מחקרים, הכשרות ומשאבים בגישת CBT.", steps: ["Resources — דפי עבודה וסרטוני הדגמה", "Training — קורסים מקוונים והסמכות", "Blog — עדכונים שבועיים", "Find a Therapist — מאגר מטפלים עולמי"], tips: "סרטוני ג'ודית בק עצמה הם המשאב הכי טוב שיש.", links: [{ l: "Beck Institute", u: "https://beckinstitute.org" }] },
  24: {
    bg: "אכילה רגשית היא שימוש באוכל כדי להתמודד עם רגשות — לא מתוך רעב פיזי, אלא מתוך רעב רגשי. זוהי תגובה נפוצה מאוד לסטרס, עצב, בדידות, שעמום, חרדה, ולעיתים גם לשמחה. האוכל מספק הרגעה זמנית — אך לרוב מוביל לאשמה, בושה ומעגל שקשה לצאת ממנו.\n\nלפי CBT, אכילה רגשית מוזנת על ידי מחשבות אוטומטיות ('רק השוקולד יגרום לי להרגיש טוב'), אמונות ליבה ('אני לא מסוגל/ת להתמודד אחרת'), וחוסר בכלים לוויסות רגשי. הטיפול כולל זיהוי הטריגרים הרגשיים, פיתוח כלים חלופיים להתמודדות, ועבודה על הדפוסים הקוגניטיביים שמזינים את המעגל.\n\nחשוב להבחין בין אכילה רגשית להפרעות אכילה קליניות (BED, בולימיה) — אם יש התנהגויות קיצוניות כמו אכילת כפייה או פיצוי, יש להפנות לאבחון מקצועי.",
    patientText: `אכילה רגשית — למה זה קורה ואיך אפשר לשנות?

כולנו אכלנו לפעמים לא מתוך רעב — אלא מתוך עצב, לחץ, שעמום, או פשוט כי "מגיע לנו". זה אנושי לגמרי. אכילה רגשית הופכת לבעיה כשהיא הדרך העיקרית שלנו להתמודד עם רגשות קשים — וכשהיא מלווה בתחושת איבוד שליטה, אשמה, ובושה.

מה קורה בפועל? הרגש הקשה עולה (לחץ, עצב, שעמום) → המוח מחפש הקלה מהירה → האוכל נותן הרגשה טובה לכמה דקות → ואז מגיעה האשמה → שמגבירה את הרגש הקשה → ואנחנו אוכלים שוב. זהו המעגל.

הדבר החשוב ביותר להבין: אכילה רגשית היא לא חולשת רצון ולא עניין של "פשוט להפסיק". זו התנהגות שהמוח למד כי היא עוזרת — ואפשר ללמד אותו אחרת. בטיפול שנעשה יחד נלמד לזהות מה הרגש שמניע את האכילה, מה המחשבות שמגיעות איתו, ונמצא ביחד דרכים אחרות להתמודד — שאינן כרוכות בבושה אחר כך.`,
    steps: [
      "שלב 1: יומן אכילה ורגשות — תיעוד מה, מתי, ומה הרגשתי לפני",
      "שלב 2: זיהוי טריגרים רגשיים אישיים — אילו רגשות מובילים לאכילה?",
      "שלב 3: זיהוי מחשבות אוטומטיות לפני ואחרי האכילה",
      "שלב 4: פיתוח כלים חלופיים לוויסות רגשי — נשימה, הסחה, קשר עם אדם",
      "שלב 5: עבודה על אמונות ליבה הקשורות לשליטה, ערך עצמי ורגשות",
      "שלב 6: בניית סביבה תומכת ותכנון מראש לרגעי סיכון",
    ],
    tips: "לא לאסור אוכלים — זה מגביר את המשיכה אליהם. המטרה היא לפתח מודעות ובחירה, לא שליטה נוקשה.",
    links: [
      { l: "National Alliance for Eating Disorders", u: "https://www.allianceforeatingdisorders.com/" },
    ],
  },
  19: {
    bg: "דיכאון הוא הרבה יותר מ'עצב'. זוהי הפרעה רגשית שמשפיעה על המחשבות, הגוף וההתנהגות. אנשים עם דיכאון חווים עצב מתמשך, ירידה בהנאה מדברים שפעם אהבו, קשיי שינה, עייפות, קשיי ריכוז, ולעיתים מחשבות שליליות על עצמם ועל העתיד. חשוב לדעת: דיכאון הוא לא חולשת אופי ולא בחירה — הוא מצב שניתן לטיפול.\n\nלפי הגישה הקוגניטיבית של ג'ודית בק, דיכאון מוזן על ידי מחשבות שליליות אוטומטיות לגבי שלושה תחומים: עצמנו ('אני חסר ערך'), העולם ('שום דבר לא ילך טוב') והעתיד ('אין לי תקווה'). מחשבות אלו מובילות להתנהגויות כמו נסיגה חברתית וצמצום פעילות — שמחמירות את הדיכאון עוד יותר.\n\nCBT מטפל בדיכאון על ידי זיהוי ושינוי מחשבות שליליות אוטומטיות, הגברת פעילויות מהנות ומשמעותיות, ועבודה על אמונות ליבה עמוקות. מחקרים רבים מראים ש-CBT יעיל כמו תרופות לדיכאון קל-בינוני — וההישגים נשמרים לאורך זמן.",
    patientText: `מה זה דיכאון ואיך טיפול CBT יכול לעזור?

דיכאון הוא הרבה יותר מ"עצב". זה מצב שמשפיע על האופן שבו אנחנו חושבים, מרגישים ומתנהגים. אנשים עם דיכאון לעיתים קרובות מרגישים עייפות, חוסר עניין בדברים שפעם אהבו, קשיי שינה, וקושי להתרכז. חשוב לדעת: דיכאון הוא לא חולשה ולא בחירה — זה מצב שמוכר היטב ויש לו טיפול יעיל.

אחת הסיבות שדיכאון "תקוע" היא שהמחשבות שלנו משפיעות על ההרגשה. כשאנחנו בדיכאון, המוח נוטה לייצר מחשבות כמו "אני לא שווה כלום", "שום דבר לא ישתנה" או "אין לי עתיד". מחשבות אלה גורמות לנו לסגת מפעילויות ומאנשים — וזה מגביר את הדיכאון. נוצר מעגל שקשה לצאת ממנו לבד.

הטיפול שנעשה יחד (CBT) עוזר לשבור את המעגל הזה. נלמד להכיר את המחשבות השליליות האוטומטיות שעולות, לבחון אם הן מדויקות — ולמצוא דרכים לחשוב ולפעול אחרת. שלב אחרי שלב, זה מוביל לשינוי אמיתי בהרגשה.`,
    steps: ["הסבר מהו דיכאון ומה ההבדל מ'עצב רגיל'", "הצג את המשולש הקוגניטיבי: עצמי, עולם, עתיד", "הסבר את מעגל הדיכאון: מחשבה שלילית → נסיגה → עוד דיכאון", "הצג את תפקיד ה-CBT: שבירת המעגל ממחשבות והתנהגות"],
    tips: "מטופלים עם דיכאון לעיתים מאמינים שאין להם כוח לשנות — הדגש שפעולה קטנה אחת ביום היא התחלה מספיקה.",
    links: [{ l: "PHQ-9 — מדידת דיכאון", u: "https://www.phqscreeners.com/" }],
  },
  20: {
    bg: "חרדה היא תגובה טבעית ואנושית לסכנה. מערכת העצבים שלנו בנויה לזהות איומים ולהפעיל תגובת 'הילחם או ברח' — שבאה לידי ביטוי בדופק מהיר, נשימה מואצת ומתח שרירים. בעבר הרחוק, תגובה זו הצילה חיים. הבעיה מתחילה כשהמערכת 'נורה' גם בפני סכנות שאינן מהוות איום ממשי.\n\nהגורם המרכזי שמשמר חרדה הוא הימנעות. כשאנחנו נמנעים ממצב מפחיד אנחנו מרגישים הקלה מיידית — אך בטווח הארוך הימנעות מחזקת את המוח בכך שהמצב אכן מסוכן. כך נוצר מעגל: פחד → הימנעות → הקלה קצרת טווח → פחד גדול יותר.\n\nב-CBT הטיפול בחרדה כולל הבנת המנגנון, אתגור מחשבות מפחיתות, וחשיפה הדרגתית — כניסה מכוונת למצבים מפחידים בצעדים קטנים ובטוחים, עד שהמוח לומד שאין סכנה אמיתית.",
    patientText: `מה זה חרדה ולמה היא לא עוזרת לנו?

חרדה היא תגובה שהמוח שלנו פיתח כדי להגן עלינו מסכנות. כשאנחנו מרגישים מאוימים, הגוף מיד מגיב: הלב פועם מהר יותר, הנשימה מואצת, השרירים מתכווצים. זו תגובה אוטומטית שנועדה לעזור לנו להילחם או לברוח. הבעיה היא שהמוח לא תמיד מבחין בין סכנה אמיתית לבין פגישה בעבודה, בחינה, או מפגש חברתי — ומפעיל את אותה אזעקה.

הדבר שגורם לחרדה להישאר ואפילו להתחזק הוא הימנעות. כשאנחנו נמנעים ממצב מפחיד, אנחנו מרגישים הקלה — אבל זה למעשה מחזק את המוח לחשוב שהמצב היה באמת מסוכן. אז בפעם הבאה, הפחד גדול יותר. הטיפול שנעשה יחד יעזור לנו להבין את המנגנון הזה, ולאט לאט ללמד את המוח שהוא יכול להתמודד — בלי לברוח.`,
    steps: ["הסבר על תפקיד החרדה ומדוע היא קיימת", "הדגם את תגובת Fight-or-Flight בגוף", "הסבר את מעגל הימנעות: פחד → בריחה → חיזוק הפחד", "הצג חשיפה כפתרון: 'להישאר במצב עד שהפחד יורד'"],
    tips: "נרמול: 'חרדה היא לא סימן לסכנה — היא סימן שמוחך עובד קשה מדי לשמור עליך.'",
    links: [{ l: "GAD-7 — מדידת חרדה", u: "https://www.hiv.uw.edu/page/mental-health-screening/gad-7" }],
  },
  21: {
    bg: "הפרעת חרדה מוכללת (GAD) מאופיינת בדאגה כרונית, מוגזמת וקשה לשליטה על נושאים שונים. אנשים עם GAD מתקשים לעצור את שרשרת הדאגות, ומרגישים מתח שרירי, עייפות, קשיי שינה וקשיי ריכוז.\n\nמחקרים מראים שדאגה ב-GAD לא עוזרת לפתור בעיות — היא יוצרת אשליה של שליטה תוך גרימת סבל רציני. לפי CBT, הדאגה מוזנת על ידי אמונות שגויות כמו 'דאגה מגינה עלי' או 'אם משהו רע יקרה, לא אוכל להתמודד'.\n\nהטיפול ב-GAD כולל זיהוי נושאי הדאגה, אבחנה בין דאגות ניתנות לפתרון לבין כאלה שאינן, תרגול נכחות (מיינדפולנס) ואתגור אמונות הליבה.",
    patientText: `מה זה GAD — חרדה כללית מוכללת?

אולי אתה/את מרגיש/ה שאתה/את דואג/ת כל הזמן — על הבריאות, על הכסף, על הילדים, על מה שיהיה. גם כשהכל בסדר, תמיד יש משהו אחר לדאוג לגביו. הדאגה מרגישה בלתי נשלטת — כאילו המחשבות רצות לבד ואתה/את לא יכול/ה לעצור אותן. לפעמים זה גם בגוף: מתח בכתפיים, כאבי ראש, קשיי שינה, עייפות מתמדת. זו הפרעת חרדה מוכללת, וזה נפוץ הרבה יותר ממה שחושבים.

הדבר החשוב להבין הוא שהדאגה מרגישה כאילו היא עוזרת — כאילו אם נדאג מספיק, נהיה מוכנים לכל תרחיש. אבל בפועל, רוב הדברים שאנחנו דואגים להם לא קורים — ואפילו אם הם קורים, אנחנו מסוגלים להתמודד. הטיפול שנעשה יחד יעזור לנו לזהות את שרשרות הדאגה, להבחין בין מה שאפשר לפתור לבין מה שאי אפשר לשלוט בו — וללמוד לשחרר.`,
    steps: ["הסבר מהי GAD והבדלה מ'עצבנות רגילה'", "עזור למטופל לזהות את נושאי הדאגה המרכזיים שלו", "אבחן: האם הדאגה ניתנת לפתרון? אם כן — פתרו. אם לא — שחרר", "הצג טכניקות: 'זמן דאגה' קבוע, מיינדפולנס, אתגור אמונות"],
    tips: "טכניקת 'זמן דאגה': 20 דקות קבועות ביום לדאגה בלבד. מחוץ לזמן זה — לדחות כל דאגה בעדינות.",
    links: [{ l: "GAD-7 — שאלון אבחוני", u: "https://www.hiv.uw.edu/page/mental-health-screening/gad-7" }],
  },
  22: {
    bg: "PTSD מתפתחת לאחר חשיפה לאירוע טראומטי. התגובה לטראומה היא נורמלית לחלוטין — המוח מנסה להתמודד עם חוויה מכריעה. PTSD מאובחן כשהתסמינים נמשכים מעל חודש ופוגעים בתפקוד.\n\nארבע קבוצות תסמינים: (1) חוויה מחודשת — פלאשבקים, סיוטים. (2) הימנעות — ממקומות, אנשים, מחשבות. (3) שינויים קוגניטיביים — אשמה, בושה, ניתוק. (4) עוררות יתר — בהלות, קשיי שינה, רגזנות.\n\nהסימפטומים אינם סימן לחולשה — הם ביטוי לכך שהמוח לא הספיק לעבד את החוויה. הטיפול עוזר למוח לסיים את תהליך העיבוד ולאחסן את הזיכרון כ'עבר' במקום כ'הווה מאיים'.",
    patientText: `מה זה PTSD ולמה המוח שלנו מגיב כך?

אחרי חוויה קשה ומאיימת, המוח שלנו לפעמים "נתקע". במקום לשמור את הזיכרון כאירוע שקרה בעבר, הוא ממשיך לחוות אותו כאילו הוא קורה עכשיו — דרך פלאשבקים, סיוטים, ותגובות גופניות עזות. אפשר גם להרגיש רצון עז להימנע מכל מה שמזכיר את האירוע, להיות בכוננות תמידית, לחוש ניתוק, אשמה או בושה. כל אלה הם תגובות של מוח שמנסה להגן עליך — לא סימן לחולשה.

חשוב מאוד שתדע/י: התגובות שאתה/את חווה/ה הן נורמליות לחלוטין. כמעט כל אדם שחווה טראומה חמורה יחווה חלק מהתסמינים האלה. הטיפול שנעשה יחד יעזור למוח לעבד את מה שקרה בצורה בטוחה ומבוקרת, כך שהזיכרון יוכל להיות מאוחסן כ'משהו שקרה בעבר' — ולא כאיום שממשיך להיות כאן.`,
    steps: ["הסבר מהי טראומה ומדוע המוח מגיב כך", "נרמול: 'תגובות נורמליות לאירוע לא נורמלי'", "הסבר את 4 קבוצות התסמינים בשפה פשוטה", "הסבר מדוע הימנעות משמרת PTSD ומה הטיפול עושה"],
    tips: "הימנע משאלות מפורטות על הטראומה בשלב הפסיכואדוקציה — זה יכול להציף לפני שיש כלים לעיבוד.",
    links: [{ l: "VA PTSD Resources", u: "https://www.ptsd.va.gov" }],
  },
  23: {
    bg: "OCD מורכב מאובססיות — מחשבות חודרניות מטרידות — וקומפולסיות — טקסים שנועדו להפחית חרדה. הסעד זמני בלבד, והמחשבה חוזרת חזקה יותר.\n\nמחשבות חודרניות הן תופעה אנושית אוניברסלית. ההבדל אצל אנשים עם OCD הוא בפרשנות: הם מאמינים שהמחשבה מסוכנת ושחייבים לנטרל אותה. דווקא ניסיון הנטרול — הטקסים — הוא שהופך את המחשבה לבעיה.\n\nהטיפול הוא ERP: להיחשף למחשבה המפחידה מבלי לבצע את הטקס, עד שהמוח לומד שהמחשבה אינה מסוכנת.",
    patientText: `מה זה OCD ולמה הטקסים לא עוזרים לאורך זמן?

לפעמים עולות לנו מחשבות שמרגישות מפחידות, מביכות, או פשוט לא מתאימות לנו. המוח מנסה להיפטר מהן — על ידי בדיקה חוזרת, שטיפה, ספירה, תפילה, או פעולות אחרות שנותנות הרגשת הקלה. אבל ההקלה קצרת מועד, והמחשבה חוזרת שוב — ולפעמים חזקה אף יותר. זהו מעגל ה-OCD.

הדבר החשוב ביותר שכדאי לדעת: המחשבות עצמן הן לא הבעיה. לכולם עוברות מחשבות מוזרות ולא רצויות — זה חלק מלהיות אנושי. הבעיה היא מה שאנחנו עושים איתן. כשאנחנו מנסים לנטרל מחשבה, אנחנו בעצם מאמתים למוח שהיא מסוכנת. הטיפול שנעשה יחד יעזור לנו ללמוד לאט לאט לחיות עם אי הנוחות — בלי להגיב לה — עד שהמוח מבין שאין סכנה אמיתית.`,
    steps: ["הסבר מהן מחשבות חודרניות וש'לכולם יש אותן'", "הסבר את מעגל OCD: מחשבה → חרדה → טקס → הקלה → חזרה", "הסבר מדוע הטקסים מחמירים את ה-OCD לאורך זמן", "הצג ERP: 'להישאר עם החרדה בלי להגיב — עד שהיא יורדת מעצמה'"],
    tips: "מטפורת הגל: 'חרדה היא כמו גל — אם תניח לו, הוא תמיד יגיע לשיא ואז ייסוג.'",
    links: [{ l: "IOCDF — OCD Guide", u: "https://iocdf.org" }],
  },
};

const TYPE_COLORS = { "שאלון": { bg: "#EEF2FF", text: "#4338CA", border: "#C7D2FE" }, "פרוטוקול": { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0" }, "פסיכואדוקציה": { bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA" }, "ספר": { bg: "#FDF4FF", text: "#7E22CE", border: "#E9D5FF" }, "אתר": { bg: "#F0F9FF", text: "#0369A1", border: "#BAE6FD" } };
const TYPE_ICONS = { "שאלון": "☑", "פרוטוקול": "📋", "פסיכואדוקציה": "📖", "ספר": "📗", "אתר": "🌐" };
const ALL_TYPES = ["שאלון", "פרוטוקול", "פסיכואדוקציה", "ספר", "אתר"];
const ROLE_COLORS = { "סטודנט CBT": { bg: "#EFF6FF", text: "#1D4ED8" }, "מטפל פעיל": { bg: "#F0FDF4", text: "#15803D" }, "פסיכיאטר": { bg: "#FDF4FF", text: "#7E22CE" }, "מדריך / סופרוויזור": { bg: "#FFF7ED", text: "#C2410C" } };
const ROLES = ["סטודנט CBT", "מטפל פעיל", "פסיכיאטר", "מדריך / סופרוויזור"];
const CITIES = ["תל אביב", "ירושלים", "חיפה", "באר שבע", "רמת גן", "פתח תקווה", "נתניה", "ראשון לציון", "אחר"];
const SPECS = ["חרדה", "דיכאון", "OCD", "PTSD / טראומה", "חרדה חברתית", "פוביות", "דיספוריה מגדרית", "התמכרויות", "הפרעות אכילה", "ADHD", "אוטיזם", "אבל ואובדן", "זוגיות ומשפחה", "ילדים ומתבגרים"];
const POPS = ["מבוגרים", "מתבגרים", "ילדים", "קשישים", "LGBTQ+", "זוגות", "משפחות"];

function Badge({ type }) {
  const c = TYPE_COLORS[type] || { bg: "#F3F4F6", text: "#374151", border: "#E5E7EB" };
  return <span style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}`, borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>{TYPE_ICONS[type] || "📌"} {type}</span>;
}

function Chip({ active, onClick, children }) {
  return <button onClick={onClick} style={{ border: `1.5px solid ${active ? "#1D4ED8" : "#E2E8F0"}`, background: active ? "#EFF6FF" : "#F8FAFC", color: active ? "#1D4ED8" : "#6B7280", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: active ? 700 : 400, cursor: "pointer", fontFamily: "inherit" }}>{children}</button>;
}

function ResourceCard({ item, onOpen }) {
  return (
    <div onClick={() => onOpen(item)} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "16px 18px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 7, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <Badge type={item.type} />
        {item.source === "judith-beck" && <span style={{ background: "#FEF9C3", color: "#854D0E", border: "1px solid #FDE68A", borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>📘 בק</span>}
        <span style={{ background: item.lang === "עברית" ? "#F0FDF4" : "#EFF6FF", color: item.lang === "עברית" ? "#15803D" : "#1D4ED8", border: `1px solid ${item.lang === "עברית" ? "#BBF7D0" : "#BFDBFE"}`, borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>{item.lang === "עברית" ? "🇮🇱" : "🌐"} {item.lang}</span>
        <span style={{ marginRight: "auto", fontSize: 11, color: "#93C5FD" }}>לפרטים ←</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 15, color: "#1E293B", lineHeight: 1.4 }}>{item.title}</div>
      <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>{item.description}</div>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {(item.tags || []).slice(0, 4).map(t => <span key={t} style={{ background: "#F1F5F9", color: "#475569", borderRadius: 8, padding: "2px 7px", fontSize: 11 }}>{t}</span>)}
      </div>
    </div>
  );
}

const QUESTIONNAIRES = {
  1: {
    name: "GAD-7",
    instruction: "במשך השבועיים האחרונים, באיזו תדירות הוטרדת מהבעיות הבאות?",
    options: ["כלל לא (0)", "מספר ימים (1)", "יותר ממחצית הימים (2)", "כמעט כל יום (3)"],
    questions: [
      "הרגשת עצבני/ת, חרד/ה או מאוד במתח",
      "לא הצלחת/י להפסיק לדאוג או לשלוט בדאגה",
      "דאגת/י יתר על המידה לגבי דברים שונים",
      "קשה היה לך להירגע",
      "היית/י כל כך חסר/ת מנוחה שקשה היה לשבת בשקט",
      "נעשית/ה מגורה/ת או עצבני/ת בקלות",
      "הרגשת/י פחד כאילו משהו נורא עומד לקרות",
    ],
    interpret: (score) => {
      if (score <= 4) return { label: "חרדה מינימלית", color: "#15803D", bg: "#F0FDF4", border: "#BBF7D0", note: "מעקב בלבד" };
      if (score <= 9) return { label: "חרדה קלה", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", note: "שקול התערבות" };
      if (score <= 14) return { label: "חרדה בינונית", color: "#C2410C", bg: "#FFF7ED", border: "#FED7AA", note: "מומלץ טיפול" };
      return { label: "חרדה קשה", color: "#991B1B", bg: "#FEF2F2", border: "#FECACA", note: "טיפול נדרש — שקול הפניה לפסיכיאטר" };
    },
  },
  2: {
    name: "PHQ-9",
    instruction: "במשך השבועיים האחרונים, באיזו תדירות הוטרדת מהבעיות הבאות?",
    options: ["כלל לא (0)", "מספר ימים (1)", "יותר ממחצית הימים (2)", "כמעט כל יום (3)"],
    questions: [
      "עניין מועט או הנאה מועטת בפעילויות",
      "הרגשת עצב, דיכאון, או חוסר תקווה",
      "קשיי הירדמות, שמירה על שינה, או שינה מוגזמת",
      "הרגשת עייפות או חוסר אנרגיה",
      "תיאבון ירוד או אכילת יתר",
      "הרגשת רע עם עצמך — שאתה/י כישלון, שאכזבת את עצמך או את משפחתך",
      "קשיי ריכוז בדברים כגון קריאה או צפייה בטלוויזיה",
      "תנועה או דיבור איטיים מהרגיל — או להיפך, היית חסר/ת מנוחה יותר מהרגיל",
      "מחשבות שעדיף שתהיה/י מת/ה, או מחשבות לפגוע בעצמך",
    ],
    interpret: (score) => {
      if (score <= 4) return { label: "דיכאון מינימלי", color: "#15803D", bg: "#F0FDF4", border: "#BBF7D0", note: "מעקב בלבד" };
      if (score <= 9) return { label: "דיכאון קל", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", note: "שקול התערבות" };
      if (score <= 14) return { label: "דיכאון בינוני", color: "#C2410C", bg: "#FFF7ED", border: "#FED7AA", note: "מומלץ תכנית טיפול" };
      if (score <= 19) return { label: "דיכאון בינוני-קשה", color: "#9A3412", bg: "#FEF2F2", border: "#FECACA", note: "טיפול פעיל מומלץ" };
      return { label: "דיכאון קשה", color: "#7F1D1D", bg: "#FEF2F2", border: "#FECACA", note: "טיפול דחוף — שקול הפניה לפסיכיאטר" };
    },
  },
};

function QuestionnaireView({ q, onClose }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const allAnswered = q.questions.every((_, i) => answers[i] !== undefined);
  const score = Object.values(answers).reduce((a, b) => a + b, 0);
  const result = submitted ? q.interpret(score) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10, padding: "12px 14px", fontSize: 13, color: "#1E40AF" }}>
        📋 {q.instruction}
      </div>
      {q.questions.map((question, i) => (
        <div key={i} style={{ background: i % 2 === 0 ? "#F8FAFC" : "#fff", borderRadius: 10, padding: "12px 14px", border: "1px solid #E5E7EB" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B", marginBottom: 10 }}>{i + 1}. {question}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {q.options.map((opt, j) => (
              <button key={j} onClick={() => setAnswers(a => ({ ...a, [i]: j }))} style={{
                textAlign: "right", background: answers[i] === j ? "#EFF6FF" : "#fff",
                color: answers[i] === j ? "#1D4ED8" : "#374151",
                border: `1.5px solid ${answers[i] === j ? "#BFDBFE" : "#E2E8F0"}`,
                borderRadius: 8, padding: "8px 12px", fontSize: 13,
                fontWeight: answers[i] === j ? 700 : 400,
                cursor: "pointer", fontFamily: "inherit", direction: "rtl",
              }}>{opt}</button>
            ))}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button onClick={() => setSubmitted(true)} disabled={!allAnswered} style={{
          background: allAnswered ? "#1D4ED8" : "#E2E8F0",
          color: allAnswered ? "#fff" : "#9CA3AF",
          border: "none", borderRadius: 10, padding: "13px",
          fontWeight: 700, fontSize: 15, cursor: allAnswered ? "pointer" : "not-allowed",
          fontFamily: "inherit",
        }}>
          {allAnswered ? "חשב ניקוד ←" : `נותרו ${q.questions.length - Object.keys(answers).length} שאלות`}
        </button>
      ) : result && (
        <div style={{ background: result.bg, border: `1.5px solid ${result.border}`, borderRadius: 14, padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontWeight: 800, fontSize: 20, color: result.color }}>{score} / {q.questions.length * 3}</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: result.color }}>{result.label}</div>
          </div>
          <div style={{ fontSize: 13, color: result.color, fontWeight: 600, marginBottom: 12 }}>🔔 {result.note}</div>
          {q.name === "PHQ-9" && answers[8] > 0 && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 12px", marginBottom: 12, fontSize: 13, color: "#991B1B", fontWeight: 600 }}>
              ⚠️ שאלה 9 קיבלה ציון {answers[8]} — חובה לבצע הערכת סיכון אובדני מפורטת
            </div>
          )}
          <button onClick={() => { setAnswers({}); setSubmitted(false); }} style={{ background: "rgba(255,255,255,0.7)", border: "1px solid currentColor", borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: result.color }}>
            מלא שוב
          </button>
        </div>
      )}
    </div>
  );
}

function ResourceModal({ item, onClose }) {
  const [aiText, setAiText] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [modalTab, setModalTab] = useState(QUESTIONNAIRES[item.id] ? "questionnaire" : "info");
  const d = DETAILS[item.id];
  const q = QUESTIONNAIRES[item.id];

  async function expand() {
    setAiLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: `אתה מומחה CBT המתבסס על גישת ג'ודית בק. עבור: "${item.title}" תן הרחבה קלינית בעברית:\n\n🔬 עומק קליני: (מנגנון פסיכולוגי)\n⚠️ אתגרים שכיחים: (2-3)\n🎯 התאמות לאוכלוסיות: (ילדים, טראומה וכו')\n📋 דוגמה לשאלה סוקרטית\n\nקצר ומעשי.` }] })
      });
      const data = await res.json();
      setAiText(data.content?.map(b => b.text || "").join("") || "שגיאה.");
    } catch { setAiText("שגיאה בחיבור."); }
    setAiLoading(false);
  }

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "16px", overflowY: "auto" }}>
      <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 680, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", marginTop: 10 }}>
        <div style={{ background: "linear-gradient(135deg,#1E40AF,#0EA5E9)", borderRadius: "20px 20px 0 0", padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}><Badge type={item.type} />{item.source === "judith-beck" && <span style={{ background: "#FEF9C3", color: "#854D0E", borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>📘 בק</span>}</div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 16, lineHeight: 1.4 }}>{item.title}</div>
            </div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: 32, height: 32, color: "#fff", fontSize: 18, cursor: "pointer", flexShrink: 0, marginRight: 8 }}>✕</button>
          </div>
          {q && (
            <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
              {[["questionnaire", "☑ מילוי שאלון"], ["info", "📖 מידע קליני"]].map(([key, label]) => (
                <button key={key} onClick={() => setModalTab(key)} style={{
                  background: modalTab === key ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)",
                  color: "#fff", border: `1px solid ${modalTab === key ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)"}`,
                  borderRadius: 20, padding: "5px 14px", fontSize: 13,
                  fontWeight: modalTab === key ? 700 : 400, cursor: "pointer", fontFamily: "inherit",
                }}>{label}</button>
              ))}
            </div>
          )}
        </div>
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
          {q && modalTab === "questionnaire" ? (
            <QuestionnaireView q={q} onClose={onClose} />
          ) : (<>
            <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, background: "#F8FAFC", borderRadius: 10, padding: "12px 14px" }}>{item.description}</div>
            {d ? (<>
              <div><div style={{ fontWeight: 700, fontSize: 14, color: "#1E293B", marginBottom: 8 }}>📖 רקע קליני</div><div style={{ fontSize: 13, color: "#374151", lineHeight: 1.85, whiteSpace: "pre-line" }}>{d.bg}</div></div>
              {d.patientText && (
                <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, padding: "16px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#15803D" }}>💬 טקסט למטופל — מוכן לשליחה / קריאה</div>
                    <button onClick={() => navigator.clipboard.writeText(d.patientText)} style={{ background: "#15803D", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>📋 העתק</button>
                  </div>
                  <div style={{ fontSize: 13, color: "#166534", lineHeight: 1.85, whiteSpace: "pre-line", background: "#fff", borderRadius: 8, padding: "12px 14px", border: "1px solid #BBF7D0" }}>{d.patientText}</div>
                </div>
              )}
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#1E293B", marginBottom: 10 }}>🗓 מהלך טיפול מוצע</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {d.steps.map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ background: "#1E40AF", color: "#fff", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                      <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: "#FEF9C3", border: "1px solid #FDE68A", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#854D0E", marginBottom: 4 }}>💡 טיפ קליני</div>
                <div style={{ fontSize: 13, color: "#92400E", lineHeight: 1.65 }}>{d.tips}</div>
              </div>
              {d.links && d.links.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {d.links.map((lk, i) => <a key={i} href={lk.u} target="_blank" rel="noreferrer" style={{ background: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE", borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>{lk.l} ↗</a>)}
                </div>
              )}
            </>) : item.link && item.link !== "#" ? (
              <div style={{ textAlign: "center" }}><a href={item.link} target="_blank" rel="noreferrer" style={{ background: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE", borderRadius: 10, padding: "10px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", display: "inline-block" }}>🔗 עבור לקישור ↗</a></div>
            ) : null}
            <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 14 }}>
              {!aiText && !aiLoading && <button onClick={expand} style={{ width: "100%", background: "linear-gradient(135deg,#EFF6FF,#F0FDF4)", border: "1.5px solid #BFDBFE", borderRadius: 12, padding: "12px", fontWeight: 700, fontSize: 14, color: "#1D4ED8", cursor: "pointer", fontFamily: "inherit" }}>🤖 הרחב עם AI — עומק קליני ואתגרים</button>}
              {aiLoading && <div style={{ textAlign: "center", color: "#6B7280", padding: "12px" }}>⏳ AI מייצר תוכן...</div>}
              {aiText && <div style={{ background: "linear-gradient(135deg,#EFF6FF,#F0FDF4)", border: "1px solid #BFDBFE", borderRadius: 12, padding: "14px" }}><div style={{ fontWeight: 700, color: "#1D4ED8", marginBottom: 8, fontSize: 14 }}>🤖 הרחבת AI</div><div style={{ fontSize: 13, color: "#374151", lineHeight: 1.85, whiteSpace: "pre-line" }}>{aiText}</div></div>}
            </div>
          </>)}
        </div>
      </div>
    </div>
  );
}

function TherapistCard({ t, onConnect }) {
  const rc = ROLE_COLORS[t.role] || { bg: "#F1F5F9", text: "#374151" };
  return (
    <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "18px", display: "flex", gap: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#1E40AF,#0EA5E9)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, flexShrink: 0 }}>{t.avatar || (t.name || "?")[0]}</div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#1E293B" }}>{t.name}</span>
          <span style={{ background: rc.bg, color: rc.text, borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>{t.role}</span>
        </div>
        <div style={{ fontSize: 12, color: "#6B7280" }}>📍 {t.city}</div>
        <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{t.bio}</div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 2 }}>
          {(t.specialties || []).map(s => <span key={s} style={{ background: "#EEF2FF", color: "#4338CA", borderRadius: 8, padding: "2px 7px", fontSize: 11 }}>{s}</span>)}
          {(t.populations || []).map(p => <span key={p} style={{ background: "#F0FDF4", color: "#15803D", borderRadius: 8, padding: "2px 7px", fontSize: 11 }}>{p}</span>)}
        </div>
        <button onClick={() => onConnect(t)} style={{ alignSelf: "flex-start", marginTop: 4, background: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE", borderRadius: 8, padding: "5px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>💬 התחבר</button>
      </div>
    </div>
  );
}

const INTAKE_SECTIONS = [
  { id: "personal", icon: "👤", title: "פרטים אישיים", fields: [{ id: "name", label: "שם מלא", type: "text", ph: "שם פרטי ומשפחה" }, { id: "dob", label: "תאריך לידה", type: "text", ph: "DD/MM/YYYY" }, { id: "phone", label: "טלפון", type: "text", ph: "" }, { id: "email", label: "אימייל", type: "text", ph: "" }, { id: "gender", label: "מגדר", type: "radio", opts: ["זכר", "נקבה", "נון-בינארי / אחר"] }, { id: "status", label: "מצב משפחתי", type: "radio", opts: ["רווק/ה", "זוגי/ות", "נשוי/אה", "גרוש/ה", "אלמן/ה"] }, { id: "job", label: "עיסוק", type: "text", ph: "" }] },
  { id: "referral", icon: "📍", title: "הפניה והבעיה", fields: [{ id: "ref_src", label: "כיצד הגעת אלינו?", type: "radio", opts: ["הפניה רופא/פסיכיאטר", "המלצת חבר/משפחה", "אינטרנט", "אחר"] }, { id: "complaint", label: "מה מביא אותך לטיפול? (במילים שלך)", type: "textarea" }, { id: "duration", label: "מאז מתי?", type: "text", ph: "" }, { id: "trigger", label: "האם היה אירוע מפעיל?", type: "textarea" }, { id: "severity", label: "עוצמת הקושי (0-10)", type: "radio", opts: ["0-3 קל", "4-6 בינוני", "7-10 קשה"] }] },
  { id: "history", icon: "🗂", title: "היסטוריה טיפולית", fields: [{ id: "prev_tx", label: "טיפול פסיכולוגי קודם?", type: "radio", opts: ["כן", "לא"] }, { id: "prev_details", label: "אם כן — סוג, משך, מה עזר", type: "textarea" }, { id: "hosp", label: "אשפוז פסיכיאטרי?", type: "radio", opts: ["כן", "לא"] }, { id: "meds", label: "טיפול תרופתי נוכחי?", type: "radio", opts: ["כן", "לא"] }, { id: "meds_det", label: "אם כן — שם, מינון, רושם", type: "text", ph: "" }] },
  { id: "symptoms", icon: "🔍", title: "תסמינים נוכחיים", fields: [{ id: "symp", label: "סמן את כל הרלוונטיים", type: "checkbox", opts: ["עצב / דיכאון", "חרדה / דאגה", "התקפי פאניקה", "מחשבות טורדניות", "כפייתיות / טקסים", "פוביות", "קשיי שינה", "שינויים בתיאבון", "עייפות", "קשיי ריכוז", "רגזנות / כעס", "מחשבות אובדניות", "PTSD", "בעיות זוגיות/חברתיות", "שימוש בחומרים"] }, { id: "symp_other", label: "נוספים", type: "text", ph: "" }] },
  { id: "cbt", icon: "🧠", title: "מחשבות, רגשות, התנהגות", note: "לפי בק: חשוב להבין את הקשר בין מחשבות אוטומטיות, רגשות ודפוסי התנהגות כבר מהמפגש הראשון.", fields: [{ id: "thoughts", label: "מחשבות חוזרות מטרידות", type: "textarea" }, { id: "emotions", label: "רגשות קשים (עצב, פחד, כעס, בושה...)", type: "textarea" }, { id: "behaviors", label: "מה עושים כשמרגישים כך? (הימנעות, בידוד...)", type: "textarea" }, { id: "coping", label: "מה עוזר להרגיש טוב יותר, ולו לזמן קצר?", type: "textarea" }] },
  { id: "background", icon: "📖", title: "רקע ביוגרפי", fields: [{ id: "childhood", label: "ילדות ומשפחת מוצא", type: "textarea" }, { id: "events", label: "אירועי חיים משמעותיים / טראומות", type: "textarea" }, { id: "fam_psych", label: "בעיות נפשיות במשפחה?", type: "radio", opts: ["כן", "לא", "לא ידוע"] }] },
  { id: "functioning", icon: "⚙️", title: "תפקוד נוכחי", fields: [{ id: "func_work", label: "עבודה / לימודים", type: "radio", opts: ["תקין", "ירידה קלה", "ירידה משמעותית", "לא מתפקד/ת"] }, { id: "func_social", label: "חברתי", type: "radio", opts: ["תקין", "ירידה קלה", "ירידה משמעותית", "בידוד"] }, { id: "sleep", label: "שינה", type: "radio", opts: ["תקינה", "קשיי הירדמות", "יקיצות לילה", "שינה מוגזמת"] }, { id: "appetite", label: "תיאבון", type: "radio", opts: ["תקין", "ירידה", "עלייה"] }] },
  { id: "goals", icon: "🎯", title: "מטרות הטיפול", note: "לפי בק: קביעת מטרות ברורות וניתנות למדידה — שלב מרכזי כבר במפגש הראשון.", fields: [{ id: "goal_change", label: "מה רוצים שישתנה?", type: "textarea" }, { id: "goal_vision", label: "איך יראו החיים אחרי הטיפול?", type: "textarea" }, { id: "goal_notes", label: "מה חשוב שנדע לפני שמתחילים?", type: "textarea" }] },
  { id: "risk", icon: "⚠️", title: "הערכת סיכון", note: "יש להעריך בכל אינטייק. אם יש חשש — פעל לפי פרוטוקול הארגון.", fields: [{ id: "suicidal", label: "מחשבות אובדניות כיום?", type: "radio", opts: ["אין", "פסיביות", "פעילות ללא תכנית", "עם תכנית"] }, { id: "attempts", label: "ניסיונות אובדניים בעבר?", type: "radio", opts: ["לא", "כן — יש לפרט"] }, { id: "harm", label: "מחשבות לפגיעה באחרים?", type: "radio", opts: ["אין", "יש — יש לפרט"] }, { id: "risk_notes", label: "הערות הערכת סיכון", type: "textarea" }] },
  { id: "therapist", icon: "📝", title: "רשמי המטפל/ת", fields: [{ id: "impression", label: "התרשמות ראשונית", type: "textarea" }, { id: "dx", label: "השערות אבחנה (DSM-5)", type: "textarea" }, { id: "core_bel", label: "אמונות ליבה אפשריות (לפי בק)", type: "textarea" }, { id: "plan", label: "תכנית טיפול ראשונית", type: "textarea" }, { id: "tx_name", label: "שם המטפל/ת", type: "text", ph: "" }, { id: "tx_date", label: "תאריך", type: "text", ph: "DD/MM/YYYY" }] },
];

function IntakeTab() {
  const [answers, setAnswers] = useState({});
  const [sec, setSec] = useState(0);
  const [saved, setSaved] = useState(false);
  const s = INTAKE_SECTIONS[sec];
  const inp = { width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 14, border: "1.5px solid #E2E8F0", outline: "none", background: "#FAFAFA", boxSizing: "border-box", fontFamily: "inherit", direction: "rtl" };

  function setVal(id, val) { setAnswers(a => ({ ...a, [id]: val })); }
  function toggleChk(id, opt) { setAnswers(a => { const cur = a[id] || []; return { ...a, [id]: cur.includes(opt) ? cur.filter(x => x !== opt) : [...cur, opt] }; }); }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17, color: "#1E293B" }}>טופס אינטייק — מטופל חדש</div>
          <div style={{ fontSize: 12, color: "#9CA3AF" }}>מבוסס על עקרונות ג'ודית בק</div>
        </div>
        <button onClick={() => setSaved(true)} style={{ background: "#1D4ED8", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>💾 שמור</button>
      </div>
      {saved && <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "10px 14px", marginBottom: 12, color: "#15803D", fontWeight: 600 }}>✅ נשמר!</div>}
      <div style={{ background: "#E2E8F0", borderRadius: 99, height: 5, marginBottom: 12, overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(90deg,#1E40AF,#0EA5E9)", width: `${((sec + 1) / INTAKE_SECTIONS.length) * 100}%`, height: "100%", borderRadius: 99, transition: "width 0.3s" }} />
      </div>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
        {INTAKE_SECTIONS.map((section, i) => (
          <button key={section.id} onClick={() => setSec(i)} style={{ background: sec === i ? "#1D4ED8" : i < sec ? "#DBEAFE" : "#F1F5F9", color: sec === i ? "#fff" : i < sec ? "#1D4ED8" : "#9CA3AF", border: "none", borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: sec === i ? 700 : 400, cursor: "pointer", fontFamily: "inherit" }}>{section.icon}</button>
        ))}
      </div>
      <div style={{ background: "#fff", borderRadius: 16, padding: "18px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
        <div style={{ background: "linear-gradient(135deg,#1E40AF,#0EA5E9)", borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{s.icon} {s.title}</div>
        </div>
        {s.note && <div style={{ background: "#FEF9C3", border: "1px solid #FDE68A", borderRadius: 8, padding: "10px 12px", marginBottom: 14, fontSize: 13, color: "#854D0E" }}>📘 {s.note}</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {s.fields.map(f => (
            <div key={f.id}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5, display: "block" }}>{f.label}</label>
              {f.type === "text" && <input value={answers[f.id] || ""} onChange={e => setVal(f.id, e.target.value)} placeholder={f.ph} style={inp} />}
              {f.type === "textarea" && <textarea value={answers[f.id] || ""} onChange={e => setVal(f.id, e.target.value)} style={{ ...inp, minHeight: 75, resize: "vertical" }} />}
              {f.type === "radio" && <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 4 }}>{f.opts.map(o => <button key={o} onClick={() => setVal(f.id, o)} style={{ background: answers[f.id] === o ? "#EFF6FF" : "#F8FAFC", color: answers[f.id] === o ? "#1D4ED8" : "#6B7280", border: `1.5px solid ${answers[f.id] === o ? "#BFDBFE" : "#E2E8F0"}`, borderRadius: 20, padding: "5px 12px", fontSize: 12, fontWeight: answers[f.id] === o ? 700 : 400, cursor: "pointer", fontFamily: "inherit" }}>{o}</button>)}</div>}
              {f.type === "checkbox" && <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>{f.opts.map(o => { const chk = (answers[f.id] || []).includes(o); return <button key={o} onClick={() => toggleChk(f.id, o)} style={{ background: chk ? "#EEF2FF" : "#F8FAFC", color: chk ? "#4338CA" : "#6B7280", border: `1.5px solid ${chk ? "#C7D2FE" : "#E2E8F0"}`, borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: chk ? 700 : 400, cursor: "pointer", fontFamily: "inherit" }}>{chk ? "✓ " : ""}{o}</button>; })}</div>}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
          <button onClick={() => setSec(i => Math.max(0, i - 1))} disabled={sec === 0} style={{ background: sec === 0 ? "#F8FAFC" : "#E2E8F0", color: sec === 0 ? "#CBD5E1" : "#374151", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 600, fontSize: 13, cursor: sec === 0 ? "not-allowed" : "pointer", fontFamily: "inherit" }}>← הקודם</button>
          <span style={{ fontSize: 12, color: "#9CA3AF", alignSelf: "center" }}>{sec + 1} / {INTAKE_SECTIONS.length}</span>
          {sec < INTAKE_SECTIONS.length - 1
            ? <button onClick={() => setSec(i => i + 1)} style={{ background: "#1D4ED8", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>הבא ←</button>
            : <button onClick={() => setSaved(true)} style={{ background: "#15803D", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>✅ סיים</button>}
        </div>
      </div>
    </div>
  );
}

function ConceptTab() {
  const [answers, setAnswers] = useState({});
  const [saved, setSaved] = useState(false);
  const [showExplain, setShowExplain] = useState(false);

  function setVal(id, val) { setAnswers(a => ({ ...a, [id]: val })); }

  const inp = { width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 14, border: "1.5px solid #E2E8F0", outline: "none", background: "#FAFAFA", boxSizing: "border-box", fontFamily: "inherit", direction: "rtl" };
  const ta = { ...inp, minHeight: 80, resize: "vertical" };
  const lbl = { fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5, display: "block" };
  const secTitle = (icon, title, sub) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ background: "linear-gradient(135deg,#1E40AF,#0EA5E9)", borderRadius: 10, padding: "10px 14px" }}>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{icon} {title}</div>
        {sub && <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );

  const EXPLAIN = `המשגה קלינית (Case Conceptualization) היא המפה שמנחה את הטיפול. היא עוזרת למטפל להבין לא רק מה המטופל מרגיש — אלא למה, ומה מנציח את הקושי.

לפי ג'ודית בק, ההמשגה בנויה משלוש רמות:

1. אמונות ליבה (Core Beliefs) — המשקפיים שדרכן המטופל רואה את עצמו, העולם והעתיד. מתפתחות בילדות ונחשבות כאמת מוחלטת.

2. אמונות ביניים (Intermediate Beliefs) — כללים, הנחות ועמדות שנובעות מאמונות הליבה. לדוגמה: "אם אעשה כל דבר בשלמות, אני שווה ערך."

3. מחשבות אוטומטיות (Automatic Thoughts) — מחשבות ספונטניות שעולות במצבים ספציפיים ומשפיעות על הרגש וההתנהגות.

ההמשגה גם כוללת הבנת הרקע ההתפתחותי שיצר את אמונות הליבה, והדרכים שהמטופל מתמודד איתן (הימנעות, פיצוי, כניעה).

המשגה טובה מאפשרת לתכנן טיפול ממוקד, לצפות קשיים, ולהסביר למטופל למה הטיפול בנוי כפי שהוא בנוי.

─────────────────────────────

פורמולציה (Formulation) — מה זה ואיך עושים?

בעוד ההמשגה היא "המפה המלאה" של המטופל, הפורמולציה היא הסבר ממוקד למצב ספציפי — מדוע הבעיה הנוכחית מתרחשת ומה מנציח אותה. אפשר לחשוב עליה כך: ההמשגה היא הספר, הפורמולציה היא הפרק הרלוונטי.

הפורמולציה מבוססת על מודל ה-5P הנפוץ בקליניקה:

1. Predisposing (גורמי רקע) — מה ברקע ובהיסטוריה של המטופל תרם להתפתחות הבעיה? גנטיקה, חוויות ילדות, אישיות.

2. Precipitating (גורמים מפעילים) — מה גרם לבעיה להופיע עכשיו? אירוע חיים, שינוי, משבר.

3. Perpetuating (גורמים מנציחים) — מה שומר על הבעיה ומונע ממנה להיפתר? הימנעות, מחשבות שליליות, דפוסים.

4. Protective (גורמי הגנה) — מה שומר על המטופל? חוזקות, תמיכה חברתית, מוטיבציה.

5. Presenting (הבעיה המוצגת) — מה המטופל מתאר כסיבה לפנייה?

─────────────────────────────

דוגמה קצרה — מטופלת עם דיכאון:

Predisposing: אמא דיכאונית, ביקורת תמידית בבית — אמונת ליבה "אני לא מספיקה"
Precipitating: פיטורים מהעבודה לפני 3 חודשים
Perpetuating: מסתגרת בבית, מפסיקה לעשות דברים שאהבה, מחשבות "לא שווה לנסות"
Protective: קשר טוב עם אחות, מוטיבציה לחזור לעבודה, הייתה בטיפול בעבר וזה עזר
Presenting: "אני לא מצליחה לקום בבוקר ואין לי כוח לכלום"`;

  return (
    <div>
      {/* כותרת */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17, color: "#1E293B" }}>טופס המשגה קלינית</div>
          <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>לפי מודל ג'ודית בק — CBT Case Conceptualization</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowExplain(v => !v)} style={{ background: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE", borderRadius: 8, padding: "8px 14px", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
            {showExplain ? "סגור הסבר" : "💡 מה זה המשגה?"}
          </button>
          <button onClick={() => setSaved(true)} style={{ background: "#1D4ED8", color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>💾 שמור</button>
        </div>
      </div>

      {/* הסבר */}
      {showExplain && (
        <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 14, padding: "18px 18px", marginBottom: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#1D4ED8", marginBottom: 10 }}>💡 מה זה המשגה קלינית?</div>
          <div style={{ fontSize: 13, color: "#1E3A5F", lineHeight: 1.85, whiteSpace: "pre-line" }}>{EXPLAIN}</div>
        </div>
      )}

      {saved && <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "10px 14px", marginBottom: 14, color: "#15803D", fontWeight: 600 }}>✅ ההמשגה נשמרה!</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

        {/* פרטי מטופל */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "18px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
          {secTitle("👤", "פרטי מטופל")}
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}><label style={lbl}>שם</label><input value={answers.name || ""} onChange={e => setVal("name", e.target.value)} style={inp} /></div>
            <div style={{ flex: 1 }}><label style={lbl}>גיל</label><input value={answers.age || ""} onChange={e => setVal("age", e.target.value)} style={inp} /></div>
          </div>
          <div style={{ marginTop: 12 }}><label style={lbl}>אבחנה ראשית (DSM-5)</label><input value={answers.dx || ""} onChange={e => setVal("dx", e.target.value)} placeholder="לדוגמה: הפרעת דיכאון מג'ורי (MDD)" style={inp} /></div>
          <div style={{ marginTop: 12 }}><label style={lbl}>בעיה מוצגת ומטרות הטיפול</label><textarea value={answers.presenting || ""} onChange={e => setVal("presenting", e.target.value)} placeholder="מה מביא את המטופל לטיפול? מה הוא רוצה להשיג?" style={ta} /></div>
        </div>

        {/* רקע התפתחותי */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "18px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
          {secTitle("📖", "רקע התפתחותי", "אירועים ונסיבות שעיצבו את אמונות הליבה")}
          <label style={lbl}>חוויות ילדות משמעותיות</label>
          <textarea value={answers.childhood || ""} onChange={e => setVal("childhood", e.target.value)} placeholder="אירועים, קשרים, אווירה משפחתית שהשפיעו על התפתחות האמונות..." style={ta} />
          <div style={{ marginTop: 12 }}><label style={lbl}>אירועי חיים מרכזיים / טראומות</label>
          <textarea value={answers.trauma || ""} onChange={e => setVal("trauma", e.target.value)} placeholder="אובדנים, טראומות, מעברים משמעותיים..." style={ta} /></div>
        </div>

        {/* אמונות ליבה */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "18px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
          {secTitle("🔴", "אמונות ליבה (Core Beliefs)", "אמונות עמוקות על עצמי, העולם והעתיד")}
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 12px", marginBottom: 14, fontSize: 12, color: "#991B1B" }}>
            💡 דוגמאות: "אני חסר ערך" / "אני חלש" / "אני לא אהוב" / "העולם מסוכן" / "אנשים לא אמינים"
          </div>
          <label style={lbl}>אמונות ליבה לגבי עצמי</label>
          <textarea value={answers.cb_self || ""} onChange={e => setVal("cb_self", e.target.value)} placeholder='לדוגמה: "אני לא מספיק טוב", "אני כישלון"' style={ta} />
          <div style={{ marginTop: 12 }}><label style={lbl}>אמונות ליבה לגבי אחרים / העולם</label>
          <textarea value={answers.cb_world || ""} onChange={e => setVal("cb_world", e.target.value)} placeholder='לדוגמה: "אנשים יזנחו אותי", "העולם מסוכן"' style={ta} /></div>
          <div style={{ marginTop: 12 }}><label style={lbl}>אמונות ליבה לגבי העתיד</label>
          <textarea value={answers.cb_future || ""} onChange={e => setVal("cb_future", e.target.value)} placeholder='לדוגמה: "אין לי עתיד", "לעולם לא אצליח"' style={ta} /></div>
        </div>

        {/* אמונות ביניים */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "18px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
          {secTitle("🟡", "אמונות ביניים (Intermediate Beliefs)", "כללים, הנחות ועמדות הנובעות מאמונות הליבה")}
          <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "10px 12px", marginBottom: 14, fontSize: 12, color: "#92400E" }}>
            💡 דוגמאות: "אם אצליח בכל דבר — אני שווה" / "אסור לי לבקש עזרה" / "אם אהיה חזק — לא יפגעו בי"
          </div>
          <label style={lbl}>כללים ועמדות</label>
          <textarea value={answers.ib_rules || ""} onChange={e => setVal("ib_rules", e.target.value)} placeholder='לדוגמה: "חייב תמיד להצליח כדי שיאהבו אותי"' style={ta} />
          <div style={{ marginTop: 12 }}><label style={lbl}>הנחות (אם... אז...)</label>
          <textarea value={answers.ib_assume || ""} onChange={e => setVal("ib_assume", e.target.value)} placeholder='לדוגמה: "אם אפשל — אאבד את אהבת האנשים"' style={ta} /></div>
        </div>

        {/* אסטרטגיות התמודדות */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "18px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
          {secTitle("⚙️", "אסטרטגיות התמודדות", "הדרכים שהמטופל מתמודד עם אמונות הליבה")}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ ...lbl, color: "#7E22CE" }}>🔵 הימנעות (Avoidance)</label>
              <textarea value={answers.cope_avoid || ""} onChange={e => setVal("cope_avoid", e.target.value)} placeholder="ממה המטופל נמנע? מצבים, אנשים, רגשות..." style={ta} />
            </div>
            <div>
              <label style={{ ...lbl, color: "#C2410C" }}>🔶 פיצוי יתר (Overcompensation)</label>
              <textarea value={answers.cope_over || ""} onChange={e => setVal("cope_over", e.target.value)} placeholder="פרפקציוניזם, שליטה, הישגיות מוגזמת..." style={ta} />
            </div>
            <div>
              <label style={{ ...lbl, color: "#0369A1" }}>⚪ כניעה (Surrender)</label>
              <textarea value={answers.cope_surr || ""} onChange={e => setVal("cope_surr", e.target.value)} placeholder="בידוד, פסיביות, תלות באחרים..." style={ta} />
            </div>
          </div>
        </div>

        {/* מחשבות אוטומטיות */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "18px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
          {secTitle("💭", "מחשבות אוטומטיות טיפוסיות", "דוגמאות למחשבות שעולות במצבים ספציפיים")}
          <textarea value={answers.auto_thoughts || ""} onChange={e => setVal("auto_thoughts", e.target.value)} placeholder='לדוגמה: "אני לא מסוגל", "הם חושבים עלי רע", "זה לא יצליח"' style={{ ...ta, minHeight: 100 }} />
        </div>

        {/* תכנית טיפול */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "18px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
          {secTitle("🎯", "תכנית טיפול מבוססת המשגה")}
          <label style={lbl}>מוקד הטיפול — מה נעבד קודם?</label>
          <textarea value={answers.tx_focus || ""} onChange={e => setVal("tx_focus", e.target.value)} placeholder="האם נתחיל ממחשבות אוטומטיות? אמונות ביניים? הפעלה התנהגותית?" style={ta} />
          <div style={{ marginTop: 12 }}><label style={lbl}>התערבויות מרכזיות מתוכננות</label>
          <textarea value={answers.tx_interventions || ""} onChange={e => setVal("tx_interventions", e.target.value)} placeholder="Thought Record, Behavioral Activation, ERP, חשיפה הדרגתית..." style={ta} /></div>
          <div style={{ marginTop: 12 }}><label style={lbl}>קשיים צפויים בטיפול</label>
          <textarea value={answers.tx_obstacles || ""} onChange={e => setVal("tx_obstacles", e.target.value)} placeholder="התנגדות, קשיי שיעורי בית, דפוסים שעשויים להופיע בברית הטיפולית..." style={ta} /></div>
        </div>

        <button onClick={() => setSaved(true)} style={{ background: "#1D4ED8", color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontWeight: 700, fontSize: 16, cursor: "pointer", fontFamily: "inherit" }}>
          💾 שמור המשגה
        </button>

        {/* פורמולציה 5P */}
        <div style={{ borderTop: "2px dashed #E2E8F0", paddingTop: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#1E293B", marginBottom: 4 }}>פורמולציה קלינית — מודל 5P</div>
          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 16 }}>הסבר ממוקד למצב הנוכחי של המטופל</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { key: "p1", color: "#7E22CE", bg: "#FDF4FF", border: "#E9D5FF", label: "1️⃣ Predisposing — גורמי רקע", placeholder: "מה ברקע תרם להתפתחות הבעיה? גנטיקה, חוויות ילדות, אישיות..." },
              { key: "p2", color: "#C2410C", bg: "#FFF7ED", border: "#FED7AA", label: "2️⃣ Precipitating — גורמים מפעילים", placeholder: "מה גרם לבעיה להופיע עכשיו? אירוע חיים, שינוי, משבר..." },
              { key: "p3", color: "#B91C1C", bg: "#FEF2F2", border: "#FECACA", label: "3️⃣ Perpetuating — גורמים מנציחים", placeholder: "מה שומר על הבעיה? הימנעות, מחשבות שליליות, דפוסים..." },
              { key: "p4", color: "#15803D", bg: "#F0FDF4", border: "#BBF7D0", label: "4️⃣ Protective — גורמי הגנה", placeholder: "מה שומר על המטופל? חוזקות, תמיכה חברתית, מוטיבציה..." },
              { key: "p5", color: "#0369A1", bg: "#F0F9FF", border: "#BAE6FD", label: "5️⃣ Presenting — הבעיה המוצגת", placeholder: "מה המטופל מתאר כסיבה לפנייה?" },
            ].map(({ key, color, bg, border, label, placeholder }) => (
              <div key={key} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: "14px 16px" }}>
                <label style={{ ...lbl, color }}>{label}</label>
                <textarea value={answers[key] || ""} onChange={e => setVal(key, e.target.value)} placeholder={placeholder} style={{ ...ta, background: "#fff", border: `1px solid ${border}` }} />
              </div>
            ))}
          </div>

          <button onClick={() => setSaved(true)} style={{ background: "#7E22CE", color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontWeight: 700, fontSize: 16, cursor: "pointer", fontFamily: "inherit", width: "100%", marginTop: 14 }}>
            💾 שמור פורמולציה
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("search");
  const [diagnosis, setDiagnosis] = useState("");
  const [aiResults, setAiResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [db, setDb] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);
  const [dbError, setDbError] = useState(null);
  const [therapists, setTherapists] = useState([]);
  const [thLoading, setThLoading] = useState(true);
  const [filterType, setFilterType] = useState("הכל");
  const [filterLang, setFilterLang] = useState("הכל");
  const [filterRole, setFilterRole] = useState("הכל");
  const [filterSpec, setFilterSpec] = useState("הכל");
  const [filterCity, setFilterCity] = useState("הכל");
  const [form, setForm] = useState({ title: "", type: "שאלון", description: "", tags: "", link: "", source: "", lang: "עברית" });
  const [addSuccess, setAddSuccess] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [connectMsg, setConnectMsg] = useState(null);
  const [communityView, setCommunityView] = useState("list");
  const [regForm, setRegForm] = useState({ name: "", role: ROLES[1], city: CITIES[0], specialties: [], populations: [], bio: "" });
  const [regSuccess, setRegSuccess] = useState(false);

  useEffect(() => {
    // טוען נתונים סטטיים מיד
    setDb(STATIC_RESOURCES);
    setTherapists(STATIC_THERAPISTS);
    setDbLoading(false);
    setThLoading(false);
    // מנסה לטעון מ-Supabase ברקע (אם נגיש)
    sbGet("resources").then(d => { if (d) setDb(prev => [...STATIC_RESOURCES, ...d.filter(r => r.id > 18)]); });
    sbGet("therapists").then(d => { if (d) setTherapists(prev => [...STATIC_THERAPISTS, ...d.filter(t => t.id > 3)]); });
  }, []);

  async function handleSearch() {
    if (!diagnosis.trim()) return;
    setSearching(true); setAiResults(null);
    const q = diagnosis.trim().toLowerCase();
    const manual = db.filter(item => (item.tags || []).some(t => t.toLowerCase().includes(q)) || item.title.toLowerCase().includes(q) || (item.description || "").toLowerCase().includes(q));
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: `אתה עוזר קליני CBT המתבסס על ג'ודית בק. עזרה עבור: "${diagnosis}".\n\n🔍 הבנת הבעיה לפי בק: (1-2 משפטים)\n📋 פרוטוקולים מומלצים: (2-3)\n☑ שאלונים מומלצים: (2-3)\n📖 נושאי פסיכואדוקציה: (2-3)\n📗 הפניה לספר בק:\n💡 טיפ קליני:\n\nעברית בלבד, קצר ומעשי.` }] })
      });
      const data = await res.json();
      setAiResults({ aiText: data.content?.map(b => b.text || "").join("") || "שגיאה.", manual });
    } catch { setAiResults({ aiText: "שגיאה בחיבור.", manual }); }
    setSearching(false);
  }

  async function handleAdd() {
    if (!form.title.trim() || !form.description.trim()) return;
    const item = { tags: form.tags.split(",").map(t => t.trim()).filter(Boolean), type: form.type, title: form.title, description: form.description, link: form.link || "#", source: form.source === "judith-beck" ? "judith-beck" : "", lang: form.lang };
    const result = await sbPost("resources", item);
    if (Array.isArray(result) && result[0]) setDb(prev => [...prev, result[0]]);
    setForm({ title: "", type: "שאלון", description: "", tags: "", link: "", source: "", lang: "עברית" });
    setAddSuccess(true); setTimeout(() => setAddSuccess(false), 3000);
  }

  async function handleRegister() {
    if (!regForm.name.trim()) return;
    const t = { name: regForm.name, role: regForm.role, city: regForm.city, specialties: regForm.specialties, populations: regForm.populations, bio: regForm.bio, avatar: regForm.name.trim()[0] };
    const result = await sbPost("therapists", t);
    if (Array.isArray(result) && result[0]) setTherapists(prev => [...prev, result[0]]);
    setRegSuccess(true); setTimeout(() => { setRegSuccess(false); setCommunityView("list"); }, 2000);
  }

  function toggleArr(key, val) { setRegForm(f => ({ ...f, [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val] })); }

  const filteredDb = db.filter(i => (filterType === "הכל" || i.type === filterType) && (filterLang === "הכל" || i.lang === filterLang));
  const filteredTh = therapists.filter(t => (filterRole === "הכל" || t.role === filterRole) && (filterSpec === "הכל" || (t.specialties || []).includes(filterSpec)) && (filterCity === "הכל" || t.city === filterCity));

  const inp = { width: "100%", padding: "10px 12px", borderRadius: 8, fontSize: 14, border: "1.5px solid #E2E8F0", outline: "none", background: "#FAFAFA", boxSizing: "border-box", fontFamily: "inherit", direction: "rtl" };
  const lbl = { fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5, display: "block" };

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Segoe UI', Arial, sans-serif", direction: "rtl" }}>
      {selectedItem && <ResourceModal item={selectedItem} onClose={() => setSelectedItem(null)} />}

      <div style={{ background: "linear-gradient(135deg,#1E40AF,#0EA5E9)", padding: "22px 20px 16px", color: "#fff" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 2 }}>🧠 פלטפורמה קלינית למטפלי CBT</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>CBT Resource Hub</div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>מבוסס ג'ודית בק · Supabase · קהילת מטפלים</div>
        </div>
      </div>

      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", overflowX: "auto" }}>
          {[["search","🔍 חיפוש"],["add","➕ הוספה"],["library",`📚 מאגר (${db.length})`],["community",`👥 קהילה (${therapists.length})`],["intake","📋 אינטייק"],["concept","🧩 המשגה"]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{ padding: "12px 16px", border: "none", background: "none", cursor: "pointer", fontWeight: tab === key ? 700 : 500, fontSize: 13, color: tab === key ? "#1D4ED8" : "#6B7280", borderBottom: tab === key ? "2.5px solid #1D4ED8" : "2.5px solid transparent", fontFamily: "inherit", whiteSpace: "nowrap" }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "18px 14px" }}>

        {tab === "search" && (
          <div>
            <div style={{ background: "#fff", borderRadius: 16, padding: "20px 18px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)", marginBottom: 16 }}>
              <label style={{ ...lbl, fontSize: 14 }}>הכנס אבחנה או בעיה:</label>
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                <input value={diagnosis} onChange={e => setDiagnosis(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} placeholder="חרדה חברתית, דיכאון, OCD..." style={{ ...inp, flex: 1 }} />
                <button onClick={handleSearch} disabled={searching} style={{ background: searching ? "#93C5FD" : "#1D4ED8", color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", fontWeight: 700, fontSize: 14, cursor: searching ? "not-allowed" : "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>{searching ? "..." : "חפש"}</button>
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                {["חרדה","דיכאון","OCD","PTSD","פוביה","אמונות ליבה","דיספוריה מגדרית","התמכרויות"].map(s => (
                  <button key={s} onClick={() => setDiagnosis(s)} style={{ background: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE", borderRadius: 20, padding: "3px 11px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{s}</button>
                ))}
              </div>
            </div>
            {searching && <div style={{ textAlign: "center", padding: "30px", color: "#6B7280" }}>⏳ מחפש עבור <strong>{diagnosis}</strong>...</div>}
            {aiResults && (
              <div>
                <div style={{ background: "linear-gradient(135deg,#EFF6FF,#F0FDF4)", border: "1px solid #BFDBFE", borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
                  <div style={{ fontWeight: 700, color: "#1D4ED8", marginBottom: 6, fontSize: 14 }}>🤖 המלצות AI עבור: {diagnosis}</div>
                  <div style={{ color: "#374151", fontSize: 13, lineHeight: 1.9, whiteSpace: "pre-line" }}>{aiResults.aiText}</div>
                </div>
                {aiResults.manual.length > 0 && <>
                  <div style={{ fontWeight: 600, color: "#374151", marginBottom: 10, fontSize: 13 }}>📚 {aiResults.manual.length} משאבים במאגר:</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{aiResults.manual.map(item => <ResourceCard key={item.id} item={item} onOpen={setSelectedItem} />)}</div>
                </>}
              </div>
            )}
          </div>
        )}

        {tab === "add" && (
          <div style={{ background: "#fff", borderRadius: 16, padding: "20px 18px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
            <div style={{ fontWeight: 700, fontSize: 17, color: "#1E293B", marginBottom: 16 }}>הוספת משאב למאגר</div>
            {addSuccess && <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "10px 14px", marginBottom: 14, color: "#15803D", fontWeight: 600 }}>✅ נוסף בהצלחה ל-Supabase!</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              <div><label style={lbl}>כותרת *</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inp} /></div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}><label style={lbl}>סוג</label><select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={inp}>{ALL_TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
                <div style={{ flex: 1 }}><label style={lbl}>שפה</label><select value={form.lang} onChange={e => setForm(f => ({ ...f, lang: e.target.value }))} style={inp}><option>עברית</option><option>אנגלית</option></select></div>
              </div>
              <div><label style={lbl}>תיאור *</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ ...inp, minHeight: 75, resize: "vertical" }} /></div>
              <div><label style={lbl}>תגיות (פסיק)</label><input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="חרדה, GAD" style={inp} /></div>
              <div><label style={lbl}>קישור</label><input value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="https://..." style={{ ...inp, direction: "ltr" }} /></div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="checkbox" id="beck" checked={form.source === "judith-beck"} onChange={e => setForm(f => ({ ...f, source: e.target.checked ? "judith-beck" : "" }))} style={{ width: 16, height: 16, cursor: "pointer" }} />
                <label htmlFor="beck" style={{ fontSize: 14, color: "#854D0E", fontWeight: 600, cursor: "pointer" }}>📘 מבוסס על ג'ודית בק</label>
              </div>
              <button onClick={handleAdd} style={{ background: "#1D4ED8", color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>➕ הוסף למאגר</button>
            </div>
          </div>
        )}

        {tab === "library" && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#1E293B", marginBottom: 12 }}>כל המשאבים ({filteredDb.length})</div>
            {dbLoading ? <div style={{ textAlign: "center", padding: "50px", color: "#6B7280" }}><div style={{ fontSize: 28 }}>⏳</div><div style={{ marginTop: 8, fontSize: 14 }}>טוען מ-Supabase...</div></div> : dbError ? <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: 12, padding: "16px", color: "#991B1B", fontSize: 14 }}>⚠️ {dbError}</div> : (<>
              <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                {["הכל","עברית","אנגלית"].map(l => <Chip key={l} active={filterLang === l} onClick={() => setFilterLang(l)}>{l === "עברית" ? "🇮🇱 עברית" : l === "אנגלית" ? "🌐 אנגלית" : "🌍 הכל"}</Chip>)}
              </div>
              <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
                {["הכל",...ALL_TYPES].map(t => {
                  const c = TYPE_COLORS[t] || { bg: "#F1F5F9", text: "#374151", border: "#E2E8F0" };
                  const active = filterType === t;
                  const count = t === "הכל" ? filteredDb.length : filteredDb.filter(i => i.type === t).length;
                  return <button key={t} onClick={() => setFilterType(t)} style={{ background: active ? c.bg : "#F8FAFC", color: active ? c.text : "#9CA3AF", border: `1.5px solid ${active ? c.border : "#E2E8F0"}`, borderRadius: 20, padding: "4px 11px", fontSize: 12, fontWeight: active ? 700 : 400, cursor: "pointer", fontFamily: "inherit" }}>{TYPE_ICONS[t]} {t} ({count})</button>;
                })}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{filteredDb.map(item => <ResourceCard key={item.id} item={item} onOpen={setSelectedItem} />)}</div>
            </>)}
          </div>
        )}

        {tab === "community" && (
          <div>
            {connectMsg && <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 12, padding: "12px 16px", marginBottom: 14, color: "#1D4ED8", fontWeight: 600 }}>💬 בקשת התחברות נשלחה ל{connectMsg}! <button onClick={() => setConnectMsg(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", marginRight: 8 }}>✕</button></div>}
            {regSuccess && <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, padding: "12px 16px", marginBottom: 14, color: "#15803D", fontWeight: 700 }}>✅ הפרופיל נוסף לקהילה!</div>}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#1E293B" }}>קהילת מטפלי CBT ({filteredTh.length})</div>
              <button onClick={() => setCommunityView(v => v === "list" ? "register" : "list")} style={{ background: communityView === "register" ? "#F1F5F9" : "#1D4ED8", color: communityView === "register" ? "#374151" : "#fff", border: "none", borderRadius: 10, padding: "8px 14px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                {communityView === "register" ? "← חזרה" : "➕ הצטרף"}
              </button>
            </div>
            {communityView === "register" ? (
              <div style={{ background: "#fff", borderRadius: 16, padding: "20px 18px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#1E293B", marginBottom: 16 }}>יצירת פרופיל מקצועי</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div><label style={lbl}>שם מלא *</label><input value={regForm.name} onChange={e => setRegForm(f => ({ ...f, name: e.target.value }))} placeholder="שם / ד״ר" style={inp} /></div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ flex: 1 }}><label style={lbl}>תפקיד</label><select value={regForm.role} onChange={e => setRegForm(f => ({ ...f, role: e.target.value }))} style={inp}>{ROLES.map(r => <option key={r}>{r}</option>)}</select></div>
                    <div style={{ flex: 1 }}><label style={lbl}>עיר</label><select value={regForm.city} onChange={e => setRegForm(f => ({ ...f, city: e.target.value }))} style={inp}>{CITIES.map(c => <option key={c}>{c}</option>)}</select></div>
                  </div>
                  <div><label style={lbl}>תחומי התמחות</label><div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>{SPECS.map(s => { const a = regForm.specialties.includes(s); return <button key={s} onClick={() => toggleArr("specialties", s)} style={{ background: a ? "#EEF2FF" : "#F8FAFC", color: a ? "#4338CA" : "#6B7280", border: `1.5px solid ${a ? "#C7D2FE" : "#E2E8F0"}`, borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: a ? 700 : 400, cursor: "pointer", fontFamily: "inherit" }}>{s}</button>; })}</div></div>
                  <div><label style={lbl}>אוכלוסיות</label><div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>{POPS.map(p => { const a = regForm.populations.includes(p); return <button key={p} onClick={() => toggleArr("populations", p)} style={{ background: a ? "#F0FDF4" : "#F8FAFC", color: a ? "#15803D" : "#6B7280", border: `1.5px solid ${a ? "#BBF7D0" : "#E2E8F0"}`, borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: a ? 700 : 400, cursor: "pointer", fontFamily: "inherit" }}>{p}</button>; })}</div></div>
                  <div><label style={lbl}>ביו קצרה</label><textarea value={regForm.bio} onChange={e => setRegForm(f => ({ ...f, bio: e.target.value }))} placeholder="כמה מילים על הניסיון והגישה שלך..." style={{ ...inp, minHeight: 75, resize: "vertical" }} /></div>
                  <button onClick={handleRegister} style={{ background: "#1D4ED8", color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>🚀 הצטרף לקהילה</button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ background: "#fff", borderRadius: 12, padding: "12px 14px", marginBottom: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}><span style={{ fontSize: 11, color: "#9CA3AF", alignSelf: "center" }}>תפקיד:</span>{["הכל",...ROLES].map(r => <Chip key={r} active={filterRole === r} onClick={() => setFilterRole(r)}>{r}</Chip>)}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}><span style={{ fontSize: 11, color: "#9CA3AF", alignSelf: "center" }}>התמחות:</span>{["הכל","חרדה","דיכאון","OCD","PTSD / טראומה","דיספוריה מגדרית","התמכרויות"].map(s => <Chip key={s} active={filterSpec === s} onClick={() => setFilterSpec(s)}>{s}</Chip>)}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}><span style={{ fontSize: 11, color: "#9CA3AF", alignSelf: "center" }}>עיר:</span>{["הכל",...CITIES.slice(0,5)].map(c => <Chip key={c} active={filterCity === c} onClick={() => setFilterCity(c)}>{c}</Chip>)}</div>
                </div>
                {thLoading
                  ? <div style={{ textAlign: "center", padding: "40px", color: "#6B7280" }}><div style={{ fontSize: 28 }}>⏳</div><div style={{ marginTop: 8, fontSize: 14 }}>טוען מ-Supabase...</div></div>
                  : filteredTh.length === 0
                  ? <div style={{ textAlign: "center", padding: "30px", color: "#9CA3AF", fontSize: 14 }}>לא נמצאו מטפלים</div>
                  : <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{filteredTh.map(t => <TherapistCard key={t.id} t={t} onConnect={t => setConnectMsg(t.name)} />)}</div>}
              </>
            )}
          </div>
        )}

        {tab === "intake" && <IntakeTab />}
        {tab === "concept" && <ConceptTab />}

      </div>
    </div>
  );
}
