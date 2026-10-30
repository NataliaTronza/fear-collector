/* =====================================================================
   ГРУПОВА ГРА (Firebase) — щоб клуб грав разом, на різних телефонах
   Поки тут порожньо, урок працює як зараз: кожен сам у себе на екрані.
   Щоб увімкнути спільну гру (можна взяти вже існуючий проєкт від іншого уроку,
   дані цього уроку лежать окремо, у гілці lessons/fear-collector):
   1. console.firebase.google.com → відкрити свій проєкт (або створити новий)
   2. Build → Realtime Database. Якщо бази ще немає: Create Database → Start in test mode
   3. Rules → додати блок lessons/fear-collector з firebase-rules.json → Publish
   4. ⚙ Project settings → Your apps → </> (Web) → скопіювати firebaseConfig
   5. вставити його сюди між { } замість цих рядків
   Якщо в скопійованому config немає рядка databaseURL, візьміть адресу бази
   згори сторінки Realtime Database і допишіть її рядком databaseURL: "...",
   ===================================================================== */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDQtVOvgL9rPy8G9USoyWOi0u9-SlmK3yo",
  authDomain: "gamelesson-695e9.firebaseapp.com",
  databaseURL: "https://gamelesson-695e9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "gamelesson-695e9",
  storageBucket: "gamelesson-695e9.firebasestorage.app",
  messagingSenderId: "1045543836968",
  appId: "1:1045543836968:web:560c8d4ddbb996c98bc41d",
};
