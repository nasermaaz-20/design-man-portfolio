# خطة التنفيذ والبحث

الحالة: نُفّذت مهام الحركة الرئيسية. ثُبّت Anime.js 4.5.0 وحُذفت GSAP و@gsap/react وFramer Motion بعد نقل استدعاءاتها. أُضيف Playwright لفحص المتصفح. جدول مراجعة الكود أدناه يسجل حالة البداية قبل التنفيذ. راجع [الفحص](QA.md) للنتائج الفعلية.

## نتائج مراجعة الكود

| المصدر | الوضع الحالي | أثره على التنفيذ |
| --- | --- | --- |
| `package.json` | GSAP و`@gsap/react` وFramer Motion وLenis؛ Anime.js غير موجودة | نقل تدريجي ثم إزالة غير المستخدم |
| `Hero.jsx` | Framer Motion مع `.scroll-reveal` على الأب وحلقة طفو | توحيد الدخول ومنع التكرار |
| `Stats.jsx` | GSAP يبدأ عند mount، بلا cleanup للـtween؛ `scrollTrigger` غير مفعّل | تشغيل عند الظهور وتنظيف كامل |
| `useScrollAnimation.js` | IntersectionObserver يضيف class مرة | تطوير API تدعم مجموعات صغيرة وتبقي المحتوى مرئياً عند الفشل |
| `animations.css` | إخفاء الأقسام افتراضياً وتتابع ثابت حتى ستة أطفال | تهيئة حركات scoped وإزالة الإخفاء الدائم |
| `useLenis.js` | RAF مستقل وقراءة تقليل الحركة عند mount فقط | واجهة stop/start واحدة وتحديث حي للتفضيل |
| `globals.css` | native smooth scroll، وإخفاء المؤشر حسب العرض | منع تنازع smooth scroll وربط إخفاء المؤشر بجاهزية البديل |
| `ProjectModal.jsx` و`App.jsx` | إزالة فورية عند الإغلاق، وقفل overflow حسب selectedProject | فصل طلب الإغلاق عن اكتمال الخروج واستعادة التركيز |
| `FinalCTA.jsx` و`Footer.jsx` | `contact` موجود في Footer | نقل المعرّف إلى CTA حسب ترتيب التجربة المقترح |
| `index.html` | خطوط خارجية مع display=swap، وReact root فارغ | bootstrap صغير للغطاء وفشل واضح، بلا تعطيل تحميل التطبيق |

## المرحلة 0 — خط أساس

- [ ] شغّل النسخة الحالية وسجل صور desktop/mobile وقياسات البناء والأداء؛ لا تستنتج الأداء من أسماء المكتبات.
- [ ] راجع صور المشاريع بحجم العرض الجديد قبل تغيير النسب أو القص.
- [ ] قِس وقت ظهور Hero والتحميل على شبكة بطيئة ثم استخدمه للمقارنة.

## المرحلة 1 — أساس الحركة

- [x] ثبّت Anime.js عبر npm، وتحقق من الإصدار الفعلي وواجهاته؛ التوثيق الذي بحثناه يستخدم واجهات v4. سجل الإصدار في lockfile دون افتراض رقم أحدث إصدار.
- [x] أضف `src/motion/config.js` لقيم الحركة المركزية و`src/hooks/useMotionPreferences.js` لتفضيل تقليل الحركة والـpointer مع تنظيف المستمعين.
- [x] نُفّذت scopes محلية داخل hooks والمكونات مع `revert()` في cleanup، دون طبقة useAnimeScope إضافية لا يحتاجها المشروع.
- [x] طوّر `useScrollAnimation.js` مع المحافظة على استدعاءات الأقسام القديمة أثناء النقل. استخدم IntersectionObserver للدخول مرة، وAnime.js للحركة نفسها.
- [x] احصر `onScroll()` في المشاهد المستمرة مثل Process والتقدم. لا تنشئ مراقباً آخر لنفس الغرض على كل حرف.
- [x] استعمل wrapper للدخول وطبقة داخلية للـhover حتى لا يتشارك CSS وAnime.js في `transform` نفسه.
- [x] اجعل المحتوى مرئياً افتراضياً؛ تجهيز البداية المخفية فقط عند نجاح تهيئة الحركة، مع استعادة النهاية عند أي خطأ.

## المرحلة 2 — الافتتاحية والـHero

- [x] أضف bootstrap صغيراً في `index.html` لعرض الافتتاحية قبل React، مع CSS أساسي ومؤقت إزالة مستقل و`noscript`.
- [x] أُضيف LoadingScreen.jsx مع منطق الجاهزية داخله، وغطاء HTML واحد يديره bootstrap احتياطي مستقل. لم نحتج hook منفصلاً للجاهزية.
- [x] طبّق الحالات والمهلة والتجاوز والجلسة المذكورة في [السيناريو](STORYBOARD.md).
- [x] جاهزية الصورة تعتمد complete أو أحداث load/error. لا نستخدم decode كشرط انتظار. الخطوط المحددة فقط تنتظر حتى مهلة bootstrap، وفشل الأصل لا يعلق الشاشة.
- [x] قيّم preload متجاوباً لصورة Hero في HTML بحيث يطابق مصادر Vite والـbase path فعلياً؛ لا hardcode لمسار build ولا تنزيل نسختي الهاتف والديسكتوب معاً. لا preload لكل صور الموقع.
- [x] ابنِ timeline الـHero وانقل حركاته من Framer Motion. النسخة مع تجاوز الافتتاحية تبدأ مباشرة، ونسخة deep link تحترم موضع الزائر.
- [x] اربط Lenis بحالة الافتتاحية والحوار من مالك واحد؛ لا تبدأه مبكراً عند تداخل الأقفال.

## المرحلة 3 — الأقسام والتمرير

- [x] عدّل ترتيب `App.jsx` وفق التكوين المقترح، والمعرض في `SelectedWork.jsx` مع المحافظة على البيانات.
- [x] طبّق كشف الصور والنصوص في `ProjectArt.jsx` و`About.jsx`، وفصل hover في `GlowCard.jsx`.
- [x] طُبّق Services ومسار Process باستخدام CSS transforms هندسية مرتبطة بـAnime.js onScroll، مع اتجاه متجاوب بدلاً من SVG يحتاج إعادة حساب مسارات.
- [x] انقل عدادات `Stats.jsx` إلى Anime.js مع تشغيل واحد عند الدخول وقيمة نهائية دائمة.
- [x] أضف دخول الشهادات وCTA وFooter، مع نقل `contact` وإضافة anchor offset.
- [x] حدّث `Navbar.jsx` لمؤشر القسم وتقدم الصفحة وقائمة الهاتف. تجنب قراءة layout وكتابة styles بالتناوب داخل scroll handlers.

## المرحلة 4 — التفاعلات والتنظيف

- [x] أضف lifecycle الخروج للـmodal مع focus trap وEscape واستعادة التركيز وscroll position.
- [x] نفّذ الانتقال المشترك للصورة فقط بعد نجاح الحوار الأساسي؛ قِس من rect إلى rect واستعمل transforms، مع fallback للحالات غير القابلة للقياس.
- [x] احتفظ بـCSS للألوان والحدود والـhover البسيط. ألغِ `transition: all` عن العناصر التي يحركها Anime.js.
- [x] قيّم تعطيل native smooth scroll عند تشغيل Lenis، واستعمال المسار الأصلي عند تقليل الحركة. احتفظ بـRAF واحد لـLenis؛ لا تضفه أيضاً إلى tick آخر.
- [x] احذف GSAP و`@gsap/react` وFramer Motion فقط بعد نقل جميع الاستدعاءات؛ ابحث مجدداً في `src` ثم حدّث lockfile عبر npm.
- [x] حدّث وصف الحركات في README الموجود بتعديل محدود عند اكتمال النقل. الملف الحالي غير متتبع في Git؛ حافظ على محتواه ولا تستبدله.

## ملكية الملفات

| الملف/المجموعة | المسؤولية المستهدفة |
| --- | --- |
| `src/motion/config.js` — جديد | مدد ومسافات وسياسة حركة موحدة |
| scopes محلية و`useMotionPreferences.js` | lifecycle والتفضيلات |
| `LoadingScreen.jsx` وbootstrap في `index.html` | جاهزية المقدمة وحالاتها |
| `App.jsx` | ترتيب الأقسام وحالة المقدمة والحوار |
| `useLenis.js` | دورة التمرير وأقفال التفاعل والتنظيف |
| `animations.css` و`globals.css` | CSS داعم وإتاحة وfallback، بلا ازدواجية في الخصائص |
| `src/sections/*` وlayout وui | مراجع محلية وتطبيق سيناريو كل جزء |
| `package.json` و`package-lock.json` | تثبيت ونقل الاعتماديات |
| `index.html` | إظهار مبكر للغطاء وفشل bootstrap واكتشاف الأصول |

## مراجع رسمية وقرار كل مرجع

تمت المراجعة في 2026-11-08. هذه المراجع تثبت واجهات ومبادئ؛ قيم الإخراج والمهل والحدود العددية في الخطة قرارات خاصة بالمشروع.

- [Anime.js — React](https://animejs.com/documentation/getting-started/using-with-react/): يوضح الجمع بين effect وscope والتنظيف. نطبّق scope محلياً بدلاً من حركات عامة.
- [Anime.js — Scope](https://animejs.com/documentation/scope/): يدعم root وmedia queries. نستعمله للفصل بين المكونات وتغيّر التفضيلات.
- [Anime.js — Timeline](https://animejs.com/documentation/timeline/): ينسق الحركات والـcallbacks. مناسب لتسلسل المقدمة والـHero.
- [Anime.js — onScroll](https://animejs.com/documentation/events/onscroll/): يدعم إطلاق وربط الحركات بالتمرير. نخصصه للمشاهد التي تعتمد فعلاً على موضع التمرير.
- [web.dev — Animation performance](https://web.dev/articles/animations-guide): نبدأ بـtransform وopacity ونتحقق من paint/layout. استعمال `will-change` مؤقت ومحدود، والقص والمؤثرات تُقاس قبل اعتمادها.
- [MDN — Reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion): تفضيل المستخدم مصدر مباشر لتخفيف الحركة؛ لا تكفي قاعدة CSS لتوقيف JavaScript.
- [web.dev — Optimize LCP](https://web.dev/articles/optimize-lcp): اكتشاف الصورة الرئيسية مبكراً وإعطاؤها الأولوية، مع تجنب lazy loading لها. نستنتج للمشروع أن المقدمة لا يجوز أن تؤخر طلب أصول الـHero.
- [Google — Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals): أهداف إرشادية LCP حتى 2.5s وINP دون 200ms وCLS دون 0.1. هذه أهداف للتحقق وليست نتائج للموقع؛ قياسات المختبر لا تثبت الأداء الميداني وحدها.
