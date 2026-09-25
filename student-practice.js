(() => {
'use strict';

const vocab = {
  "pleased_with_yourself": {
    "term": "pleased with yourself",
    "level": "B1",
    "uz": "o‘zingizdan mamnun"
  },
  "drained": {
    "term": "drained",
    "level": "B2–C1",
    "uz": "juda holdan toygan"
  },
  "low_on_energy": {
    "term": "low on energy",
    "level": "B1",
    "uz": "quvvati kam / holsiz"
  },
  "depend_on": {
    "term": "depend on",
    "level": "B1",
    "uz": "...ga bog‘liq bo‘lmoq"
  },
  "accustomed": {
    "term": "accustomed",
    "level": "B2–C1",
    "uz": "odatlangan"
  },
  "recover": {
    "term": "recover",
    "level": "B1",
    "uz": "tiklanmoq"
  },
  "perceived_fatigue": {
    "term": "perceived fatigue",
    "level": "B2–C1",
    "uz": "subyektiv seziladigan charchoq"
  },
  "performance_fatigability": {
    "term": "performance fatigability",
    "level": "B2–C1",
    "uz": "jismoniy ko‘rsatkichning charchoq sabab pasayishi"
  },
  "measurable_drop": {
    "term": "measurable drop",
    "level": "B2–C1",
    "uz": "o‘lchash mumkin bo‘lgan pasayish"
  },
  "unable_to": {
    "term": "unable to",
    "level": "B1",
    "uz": "qila olmaydigan"
  },
  "perception": {
    "term": "perception",
    "level": "B2–C1",
    "uz": "idrok / sezish"
  },
  "delayed_onset_muscle_soreness": {
    "term": "delayed-onset muscle soreness",
    "level": "B2–C1",
    "uz": "kechikib paydo bo‘ladigan mushak og‘rig‘i"
  },
  "aching_and_stiffness": {
    "term": "aching and stiffness",
    "level": "B2–C1",
    "uz": "og‘riq va qotish"
  },
  "working_out": {
    "term": "working out",
    "level": "B1",
    "uz": "mashq qilish"
  },
  "unfamiliar": {
    "term": "unfamiliar",
    "level": "B2–C1",
    "uz": "notanish / odatlanilmagan"
  },
  "associated_with": {
    "term": "associated with",
    "level": "B2–C1",
    "uz": "... bilan bog‘liq"
  },
  "eccentric_exercise": {
    "term": "eccentric exercise",
    "level": "B2–C1",
    "uz": "mushak cho‘zilgan holda ishlaydigan mashq"
  },
  "contribute": {
    "term": "contribute",
    "level": "B2–C1",
    "uz": "sabab bo‘lishga hissa qo‘shmoq"
  },
  "rely_on": {
    "term": "rely on",
    "level": "B1",
    "uz": "...ga tayanmoq"
  },
  "electrically_charged_particles": {
    "term": "electrically-charged particles",
    "level": "B2–C1",
    "uz": "elektr zaryadlangan zarrachalar"
  },
  "ions": {
    "term": "ions",
    "level": "B2–C1",
    "uz": "ionlar"
  },
  "muscle_contractions": {
    "term": "muscle contractions",
    "level": "B2–C1",
    "uz": "mushak qisqarishlari"
  },
  "affect": {
    "term": "affect",
    "level": "B1",
    "uz": "ta’sir qilmoq"
  },
  "depleted": {
    "term": "depleted",
    "level": "B2–C1",
    "uz": "zaxirasi tugagan / holdan toygan"
  },
  "nervous_system": {
    "term": "nervous system",
    "level": "B2–C1",
    "uz": "asab tizimi"
  },
  "plays_a_part": {
    "term": "plays a part",
    "level": "B1",
    "uz": "rol o‘ynaydi"
  },
  "spinal_cord": {
    "term": "spinal cord",
    "level": "B2–C1",
    "uz": "orqa miya"
  },
  "strenuous_exercise": {
    "term": "strenuous exercise",
    "level": "B2–C1",
    "uz": "juda kuch talab qiladigan mashq"
  },
  "temporarily": {
    "term": "temporarily",
    "level": "B2–C1",
    "uz": "vaqtincha"
  },
  "central_fatigue": {
    "term": "central fatigue",
    "level": "B2–C1",
    "uz": "markaziy charchoq"
  },
  "demanding_exercise": {
    "term": "demanding exercise",
    "level": "B2–C1",
    "uz": "katta kuch talab qiladigan mashq"
  },
  "carbohydrates": {
    "term": "carbohydrates",
    "level": "B2–C1",
    "uz": "uglevodlar"
  },
  "electrolytes": {
    "term": "electrolytes",
    "level": "B2–C1",
    "uz": "elektrolitlar"
  },
  "sodium": {
    "term": "sodium",
    "level": "B2–C1",
    "uz": "natriy"
  },
  "dehydration": {
    "term": "dehydration",
    "level": "B2–C1",
    "uz": "suvsizlanish"
  },
  "soreness": {
    "term": "soreness",
    "level": "B2–C1",
    "uz": "mushak og‘rig‘i / achishish"
  },
  "adapt": {
    "term": "adapt",
    "level": "B1",
    "uz": "moslashmoq"
  },
  "repeated_bout_effect": {
    "term": "repeated-bout effect",
    "level": "B2–C1",
    "uz": "takroriy mashq ta’siri"
  },
  "preservation": {
    "term": "preservation",
    "level": "B2–C1",
    "uz": "saqlanib qolish"
  },
  "recovery_strategies": {
    "term": "recovery strategies",
    "level": "B2–C1",
    "uz": "tiklanish usullari"
  },
  "amino_acids": {
    "term": "amino acids",
    "level": "B2–C1",
    "uz": "aminokislotalar"
  },
  "instant_cure": {
    "term": "instant cure",
    "level": "B2–C1",
    "uz": "darhol davolaydigan yechim"
  },
  "mixed_results": {
    "term": "mixed results",
    "level": "B2–C1",
    "uz": "turlicha / bir xil bo‘lmagan natijalar"
  },
  "consume": {
    "term": "consume",
    "level": "B2–C1",
    "uz": "iste’mol qilmoq"
  },
  "benefit": {
    "term": "benefit",
    "level": "B1",
    "uz": "foyda bermoq"
  },
  "water_immersion": {
    "term": "water immersion",
    "level": "B2–C1",
    "uz": "suvga tushib tiklanish usuli"
  },
  "manageable_level": {
    "term": "manageable level",
    "level": "B2–C1",
    "uz": "uddalash mumkin bo‘lgan daraja"
  },
  "gradually_building_up": {
    "term": "gradually building up",
    "level": "B2–C1",
    "uz": "asta-sekin oshirib borish"
  },
  "well_hydrated": {
    "term": "well hydrated",
    "level": "B2–C1",
    "uz": "yetarli darajada suyuqlik ichgan"
  },
  "exhausted": {
    "term": "exhausted",
    "level": "B1",
    "uz": "juda charchagan / holdan toygan"
  },
  "in_proportion_to": {
    "term": "in proportion to",
    "level": "B2–C1",
    "uz": "...ga mutanosib ravishda"
  },
  "disproportionate": {
    "term": "disproportionate",
    "level": "B2–C1",
    "uz": "nomutanosib / haddan tashqari"
  },
  "fainting": {
    "term": "fainting",
    "level": "B2–C1",
    "uz": "hushdan ketish"
  },
  "breathlessness": {
    "term": "breathlessness",
    "level": "B2–C1",
    "uz": "nafas qisishi"
  }
};

const readingArticles=[
  {
    "id": "post-workout-fatigue",
    "title": "What is post-workout fatigue – and can you prevent it?",
    "kicker": "HEALTH & FITNESS",
    "level": "B2–C1",
    "minutes": "9 min read",
    "byline": "Athalie Redwood-Brown · The Conversation · 3 September 2026",
    "sections": [
      {
        "heading": null,
        "paragraphs": [
          [
            {
              "text": "You finish a workout feeling pleased with yourself.",
              "uz": "Mashg‘ulotni tugatib, o‘zingizdan mamnun bo‘lasiz."
            },
            {
              "text": "But an hour later, your legs feel heavy, climbing the stairs seems impossible and all you want to do is sit down.",
              "uz": "Ammo bir soat o‘tgach, oyoqlaringiz og‘irlashadi, zinadan chiqish imkonsizdek tuyuladi va faqat o‘tirishni xohlaysiz."
            }
          ],
          [
            {
              "text": "The feeling of being drained after a tough working is often described as “post-workout fatigue”.",
              "uz": "Og‘ir mashqdan keyin juda holdan toyish hissi ko‘pincha “mashqdan keyingi charchoq” deb ataladi."
            },
            {
              "text": "You might feel low on energy, while your muscles may feel heavy, weak or less able to perform.",
              "uz": "Sizda quvvat kamayishi mumkin, mushaklaringiz esa og‘ir, kuchsiz yoki avvalgidek ishlay olmaydigandek tuyulishi mumkin."
            }
          ],
          [
            {
              "text": "While some tiredness after exercise is normal, how much you experience can depend on the type of workout you’ve done, how hard you’ve worked and how accustomed your body is to it.",
              "uz": "Mashqdan keyin biroz charchash odatiy bo‘lsa-da, charchoq darajasi qilgan mashqingiz turiga, qanchalik qattiq ishlaganingizga va tanangiz bunga qanchalik odatlanganiga bog‘liq bo‘lishi mumkin."
            },
            {
              "text": "Fortunately, there are things you can do to help your body recover.",
              "uz": "Yaxshiyamki, tanangizning tiklanishiga yordam berish uchun qilishingiz mumkin bo‘lgan ishlar bor."
            }
          ]
        ]
      },
      {
        "heading": "What is post-workout fatigue?",
        "paragraphs": [
          [
            {
              "text": "There are two sides to fatigue.",
              "uz": "Charchoqning ikki tomoni bor."
            },
            {
              "text": "The first is perceived fatigue, which is your own feeling of tiredness and effort.",
              "uz": "Birinchisi — subyektiv seziladigan charchoq, ya’ni sizning o‘zingiz his qiladigan charchoq va zo‘riqish."
            },
            {
              "text": "The second is performance fatigability, which refers to a measurable drop in what your body can do – such as a muscle being unable to produce as much force.",
              "uz": "Ikkinchisi — jismoniy ko‘rsatkichning charchoq sabab pasayishi bo‘lib, bu tanangiz qila oladigan ishda o‘lchash mumkin bo‘lgan pasayishni anglatadi, masalan, mushakning avvalgidek kuch hosil qila olmasligi."
            }
          ],
          [
            {
              "text": "The two don’t always match perfectly, which is why fatigue is now understood as a complicated process involving both the body and our perception of tiredness.",
              "uz": "Bu ikkisi har doim ham bir-biriga to‘liq mos kelmaydi, shuning uchun charchoq hozir tanani ham, charchoqni qanday sezishimizni ham o‘z ichiga oladigan murakkab jarayon deb tushuniladi."
            }
          ],
          [
            {
              "text": "Fatigue is also different from delayed-onset muscle soreness (Doms) – the aching and stiffness that can develop after working out.",
              "uz": "Charchoq, shuningdek, kechikib paydo bo‘ladigan mushak og‘rig‘idan (DOMS) farq qiladi — bu mashqdan keyin paydo bo‘lishi mumkin bo‘lgan og‘riq va qotishdir."
            },
            {
              "text": "Doms typically happens if we’ve done an unfamiliar exercise, or when it’s been a while since we last exercised.",
              "uz": "DOMS odatda odatlanilmagan mashq qilganimizda yoki oxirgi marta mashq qilganimizga ancha vaqt bo‘lganida yuz beradi."
            },
            {
              "text": "Doms is also particularly associated with eccentric exercise (when a muscle works while getting longer) – such as when lowering a dumbbell.",
              "uz": "DOMS, ayniqsa, eksentrik mashq bilan bog‘liq bo‘ladi — bunda mushak uzayayotgan paytda ishlaydi, masalan, gantelni pastga tushirganda."
            }
          ]
        ]
      },
      {
        "heading": "Why does post-workout fatigue happen?",
        "paragraphs": [
          [
            {
              "text": "There isn’t one single cause.",
              "uz": "Buning faqat bitta sababi yo‘q."
            },
            {
              "text": "Different processes contribute depending on what exercise you’ve done, how hard you’ve worked and for how long.",
              "uz": "Qaysi mashqni qilganingiz, qanchalik qattiq va qancha vaqt ishlaganingizga qarab turli jarayonlar bunga sabab bo‘lishi mumkin."
            }
          ],
          [
            {
              "text": "Some of this fatigue may be caused by the changes that happen inside the muscles, for example.",
              "uz": "Masalan, bu charchoqning bir qismi mushaklar ichida sodir bo‘ladigan o‘zgarishlar tufayli yuz berishi mumkin."
            },
            {
              "text": "In order for our muscles to move during an exercise, they rely on electrically-charged particles called ions which trigger muscle contractions.",
              "uz": "Mashq paytida mushaklarimiz harakatlanishi uchun ular mushak qisqarishlarini qo‘zg‘atadigan ionlar deb ataluvchi elektr zaryadlangan zarrachalarga tayanadi."
            },
            {
              "text": "But exercise also causes changes to these ions, which can affect the muscle’s ability to contract and produce force later in their workout.",
              "uz": "Ammo mashq bu ionlarda ham o‘zgarishlar keltirib chiqaradi, bu esa mashq davomida keyinroq mushakning qisqarish va kuch hosil qilish qobiliyatiga ta’sir qilishi mumkin."
            },
            {
              "text": "This may explain why people feel like their muscles are depleted and fatigued after a workout.",
              "uz": "Bu odamlar nega mashqdan keyin mushaklari kuchsizlangan va charchagandek his qilishini tushuntirishi mumkin."
            }
          ],
          [
            {
              "text": "The nervous system plays a part, too.",
              "uz": "Asab tizimi ham bunda rol o‘ynaydi."
            },
            {
              "text": "The brain and spinal cord send signals telling our muscles to contract.",
              "uz": "Miya va orqa miya mushaklarimizga qisqarishni buyuruvchi signallar yuboradi."
            },
            {
              "text": "Strenuous exercise can temporarily reduce the nervous system’s ability to fully activate the muscles, contributing to what is sometimes called central fatigue.",
              "uz": "Juda kuch talab qiladigan mashq asab tizimining mushaklarni to‘liq faollashtirish qobiliyatini vaqtincha kamaytirishi mumkin, bu esa ba’zan markaziy charchoq deb ataladigan holatga sabab bo‘ladi."
            }
          ],
          [
            {
              "text": "Fuel is another factor, particularly during longer or demanding exercise.",
              "uz": "Energiya zaxirasi ham yana bir omil, ayniqsa uzoqroq yoki katta kuch talab qiladigan mashqlarda."
            },
            {
              "text": "Our muscles store carbohydrates from the foods we eat to use later for energy.",
              "uz": "Mushaklarimiz ovqatdan olingan uglevodlarni keyinchalik energiya sifatida ishlatish uchun saqlaydi."
            },
            {
              "text": "But exercise reduces these stores, which can contribute to fatigue.",
              "uz": "Ammo mashq bu zaxiralarni kamaytiradi, bu esa charchoqqa sabab bo‘lishi mumkin."
            }
          ],
          [
            {
              "text": "Sweating also causes us to lose water and electrolytes, such as sodium, which are important for keeping our muscles and nerves working normally.",
              "uz": "Terlash natijasida biz suv va natriy kabi elektrolitlarni ham yo‘qotamiz; ular mushaklar va asablarning normal ishlashi uchun muhim."
            },
            {
              "text": "If enough fluid is lost without being replaced, dehydration can reduce performance and make physical activity feel harder.",
              "uz": "Agar yetarlicha suyuqlik yo‘qotilib, uning o‘rni to‘ldirilmasa, suvsizlanish jismoniy ko‘rsatkichni pasaytirib, faoliyatni qiyinroq his qildirishi mumkin."
            }
          ]
        ]
      },
      {
        "heading": "Is it worse if you’re new to exercise?",
        "paragraphs": [
          [
            {
              "text": "Beginners to exercise may experience more soreness and and muscle weakness because their bodies aren’t accustomed to the activity.",
              "uz": "Mashqni endi boshlaganlarda ko‘proq mushak og‘rig‘i va kuchsizlik bo‘lishi mumkin, chunki ularning tanasi bu faoliyatga odatlanmagan."
            },
            {
              "text": "However, even experienced exercisers can experience it – particularly when they try something unfamiliar.",
              "uz": "Biroq, hatto tajribali mashq qiluvchilar ham buni boshdan kechirishi mumkin, ayniqsa odatlanilmagan narsani sinab ko‘rganlarida."
            },
            {
              "text": "For example, a regular runner who rarely lifts weights may feel very sore after their first challenging weights session.",
              "uz": "Masalan, muntazam yuguradigan, ammo kamdan-kam og‘irlik ko‘taradigan odam birinchi qiyin kuch mashg‘ulotidan keyin juda qattiq mushak og‘rig‘ini his qilishi mumkin."
            }
          ],
          [
            {
              "text": "Fortunately for us, the body adapts.",
              "uz": "Yaxshiyamki, tana moslashadi."
            },
            {
              "text": "Repeating similar exercises generally cause less muscle damage and soreness – something scientists call the repeated-bout effect.",
              "uz": "O‘xshash mashqlarni takrorlash odatda mushak shikastlanishi va og‘rig‘ini kamaytiradi — olimlar buni takroriy mashq ta’siri deb atashadi."
            },
            {
              "text": "A 2023 review found less muscle soreness and better preservation of physical performance after a second bout of muscle-damaging exercise compared with the first.",
              "uz": "2023-yildagi sharhda mushakni shikastlaydigan mashqning ikkinchi marta bajarilishidan keyin birinchisiga qaraganda mushak og‘rig‘i kamroq va jismoniy ko‘rsatkich yaxshiroq saqlangani aniqlangan."
            }
          ],
          [
            {
              "text": "So, post-workout fatigue isn’t just a beginner’s problem.",
              "uz": "Demak, mashqdan keyingi charchoq faqat yangi boshlovchilarning muammosi emas."
            }
          ]
        ]
      },
      {
        "heading": "How can you recover?",
        "paragraphs": [
          [
            {
              "text": "Some of the most useful recovery strategies are also the simplest: food, fluids, sleep and time.",
              "uz": "Eng foydali tiklanish usullarining ayrimlari eng oddiylari hamdir: ovqat, suyuqlik, uyqu va vaqt."
            }
          ],
          [
            {
              "text": "After a long or demanding workout, eating carbohydrates helps replace the energy stores our muscles have used.",
              "uz": "Uzoq yoki qiyin mashqdan keyin uglevod iste’mol qilish mushaklar ishlatgan energiya zaxiralarini to‘ldirishga yordam beradi."
            }
          ],
          [
            {
              "text": "Protein is also important.",
              "uz": "Oqsil ham muhim."
            },
            {
              "text": "Protein provides amino acids, which the body needs to adapt and recover from the exercise we’ve just done.",
              "uz": "Oqsil aminokislotalarni beradi; tana hozirgina qilgan mashqimizga moslashish va undan tiklanish uchun ularga muhtoj."
            },
            {
              "text": "However, protein supplements certainly aren’t an instant cure for tired or aching muscles – and research into their effects on soreness and immediate recovery has produced mixed results.",
              "uz": "Biroq, oqsil qo‘shimchalari charchagan yoki og‘riyotgan mushaklar uchun darhol yechim emas; ularning mushak og‘rig‘i va tez tiklanishga ta’siri bo‘yicha tadqiqotlar turlicha natijalar bergan."
            }
          ],
          [
            {
              "text": "Replacing the fluid we’ve sweated out is also important.",
              "uz": "Terlash orqali yo‘qotgan suyuqlikni qayta to‘ldirish ham muhim."
            },
            {
              "text": "For most shorter workouts, water is enough.",
              "uz": "Ko‘pchilik qisqaroq mashqlar uchun suvning o‘zi yetarli."
            },
            {
              "text": "But if you’ve done a long run, an intense workout session or have sweated a lot (such as during hot weather), you may want to consume some electrolytes as well.",
              "uz": "Ammo uzoq yugurgan bo‘lsangiz, juda intensiv mashq qilgan bo‘lsangiz yoki ko‘p terlagan bo‘lsangiz, masalan issiq havoda, elektrolitlarni ham iste’mol qilish foydali bo‘lishi mumkin."
            }
          ],
          [
            {
              "text": "Sleep is important as it gives the body further opportunity to recover.",
              "uz": "Uyqu muhim, chunki u tanaga yanada tiklanish imkonini beradi."
            },
            {
              "text": "Research in athletes suggests that increasing sleep, either by sleeping longer at night or taking naps, may benefit aspects of physical and mental performance.",
              "uz": "Sportchilar ustidagi tadqiqotlar tungi uyquni uzaytirish yoki kunduzgi mizg‘ish orqali uyquni ko‘paytirish jismoniy va aqliy ko‘rsatkichlarning ayrim jihatlariga foyda berishi mumkinligini ko‘rsatadi."
            }
          ],
          [
            {
              "text": "There’s also some evidence for alternate recovery techniques, including gentle exercise (such as a slow walk or yoga), massages and water immersion.",
              "uz": "Yengil mashq, masalan sekin yurish yoki yoga, massaj va suvga tushish kabi muqobil tiklanish usullari foydali bo‘lishi mumkinligini ko‘rsatadigan ayrim dalillar ham bor."
            },
            {
              "text": "A review of 99 studies found several of these techniques could reduce muscle soreness, with massage showing one of the strongest effects on people’s feelings of fatigue.",
              "uz": "99 ta tadqiqot sharhi bu usullarning bir nechtasi mushak og‘rig‘ini kamaytirishi mumkinligini, massaj esa odamlarning charchoq hissiga eng kuchli ta’sirlardan birini ko‘rsatganini aniqladi."
            }
          ]
        ]
      },
      {
        "heading": "Can you prevent it?",
        "paragraphs": [
          [
            {
              "text": "You can’t.",
              "uz": "To‘liq oldini ola olmaysiz."
            },
            {
              "text": "But if you want to reduce how bad your post-workout fatigue is, try to avoid suddenly doing much more than your body is prepared for.",
              "uz": "Ammo mashqdan keyingi charchoqni kamaytirmoqchi bo‘lsangiz, tanangiz tayyor bo‘lganidan birdaniga ancha ko‘p mashq qilishdan saqlaning."
            },
            {
              "text": "Starting a new activity at a manageable level and gradually building up gives your body time to adapt.",
              "uz": "Yangi faoliyatni uddalash mumkin bo‘lgan darajada boshlash va uni asta-sekin oshirib borish tanangizga moslashish uchun vaqt beradi."
            }
          ],
          [
            {
              "text": "Making sure you’re well hydrated before workouts is also sensible – particularly for longer workouts or when exercising in hot conditions.",
              "uz": "Mashqdan oldin yetarlicha suyuqlik ichganingizga ishonch hosil qilish ham to‘g‘ri, ayniqsa uzoqroq mashqlarda yoki issiq sharoitda mashq qilganda."
            },
            {
              "text": "Eating enough to support your activity and allowing time to recover between demanding workouts helps as well.",
              "uz": "Faoliyatingizni qo‘llab-quvvatlash uchun yetarlicha ovqatlanish va qiyin mashqlar orasida tiklanishga vaqt berish ham yordam beradi."
            }
          ],
          [
            {
              "text": "Most importantly, feeling completely exhausted doesn’t necessarily mean you’ve had a better workout.",
              "uz": "Eng muhimi, butunlay holdan toyish albatta yaxshiroq mashq qilganingizni anglatmaydi."
            },
            {
              "text": "Some fatigue is expected, but it should generally be in proportion to the exercise you’ve done and improve with recovery.",
              "uz": "Biroz charchoq kutiladi, ammo u odatda qilgan mashqingizga mutanosib bo‘lishi va tiklanish bilan yaxshilanishi kerak."
            }
          ],
          [
            {
              "text": "If the amount of fatigue you experience after a workout seems disproportionate to the workout you’ve done, doesn’t improve with recovery or comes with symptoms such as chest pain, fainting or unusual breathlessness, speak to a doctor.",
              "uz": "Agar mashqdan keyingi charchoq qilgan mashqingizga nisbatan haddan tashqari bo‘lsa, tiklanish bilan yaxshilanmasa yoki ko‘krak og‘rig‘i, hushdan ketish yoki noodatiy nafas qisishi kabi alomatlar bilan birga kelsa, shifokorga murojaat qiling."
            }
          ]
        ]
      }
    ]
  }
];
let activeArticleIndex=0;
let activeArticle=null;

function completionKey(data){
  const student=data?.student||{};
  const id=student.id||[student.full_name,student.group,student.grade_or_age].filter(Boolean).join('|')||'student';
  return 'vision-reading-completed:v2:'+String(id);
}

function getCompletedArticles(data){
  try{
    const saved=JSON.parse(localStorage.getItem(completionKey(data))||'[]');
    return new Set(Array.isArray(saved)?saved.map(Number):[]);
  }catch{
    return new Set();
  }
}

function markArticleCompleted(data,index){
  const completed=getCompletedArticles(data);
  completed.add(Number(index));
  try{localStorage.setItem(completionKey(data),JSON.stringify([...completed]));}catch{}
}

const paragraphBreaks = new Set([]);
const exerciseQuestions = [
  {
    "prompt": "If you feel “drained” after exercise, you feel...",
    "options": [
      "full of energy",
      "very tired and without energy",
      "slightly hungry"
    ],
    "answer": 1
  },
  {
    "prompt": "If your body is “accustomed” to an activity, it is...",
    "options": [
      "used to it",
      "afraid of it",
      "injured by it"
    ],
    "answer": 0
  },
  {
    "prompt": "A “measurable drop” is a decrease that...",
    "options": [
      "can be measured",
      "cannot be noticed",
      "happens only once"
    ],
    "answer": 0
  },
  {
    "prompt": "Which phrase means that something helps cause a result?",
    "options": [
      "contribute to",
      "recover from",
      "depend on"
    ],
    "answer": 0
  },
  {
    "prompt": "Muscles “rely on” ions means muscles...",
    "options": [
      "avoid ions",
      "depend on ions",
      "remove ions"
    ],
    "answer": 1
  },
  {
    "prompt": "“Strenuous exercise” is exercise that...",
    "options": [
      "requires a lot of effort",
      "is always short",
      "needs no recovery"
    ],
    "answer": 0
  },
  {
    "prompt": "If muscles are “depleted”, their available resources are...",
    "options": [
      "built up",
      "largely used up",
      "unchanged"
    ],
    "answer": 1
  },
  {
    "prompt": "“Dehydration” happens when the body...",
    "options": [
      "loses too much fluid",
      "stores too much energy",
      "builds more muscle"
    ],
    "answer": 0
  },
  {
    "prompt": "The “repeated-bout effect” describes how...",
    "options": [
      "repeating similar exercise may cause less soreness",
      "every workout becomes harder",
      "sleep makes exercise unnecessary"
    ],
    "answer": 0
  },
  {
    "prompt": "If research produces “mixed results”, the findings are...",
    "options": [
      "all identical",
      "not completely consistent",
      "always negative"
    ],
    "answer": 1
  },
  {
    "prompt": "“Gradually building up” an activity means...",
    "options": [
      "increasing it little by little",
      "stopping it suddenly",
      "doing the maximum immediately"
    ],
    "answer": 0
  },
  {
    "prompt": "If fatigue is “disproportionate”, it is...",
    "options": [
      "too great compared with what caused it",
      "exactly expected",
      "very short-lived"
    ],
    "answer": 0
  }
];


const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

function wordHtml(key,displayText){
  const item=vocab[key];
  const text=displayText||item.term;
  const cls=item.level==='B1'?'b1':'b2';
  return '<span class="vocab-word '+cls+'" role="button" tabindex="0" data-vocab="'+esc(key)+'">'+
    esc(text)+
    '<span class="vocab-popover" aria-hidden="true"><small>'+esc(item.level)+'</small><strong>'+esc(item.term)+'</strong><em>'+esc(item.uz)+'</em></span>'+
  '</span>';
}

const vocabEntries=Object.entries(vocab).sort((a,b)=>b[1].term.length-a[1].term.length);

function highlightText(text){
  let pieces=[{text:String(text),html:false}];
  for(const [key,item] of vocabEntries){
    const next=[];
    const needle=item.term.toLowerCase();
    for(const piece of pieces){
      if(piece.html){next.push(piece);continue;}
      const source=piece.text;
      const lower=source.toLowerCase();
      let cursor=0;
      let found=false;
      while(cursor<source.length){
        const pos=lower.indexOf(needle,cursor);
        if(pos===-1)break;
        found=true;
        if(pos>cursor)next.push({text:source.slice(cursor,pos),html:false});
        const match=source.slice(pos,pos+needle.length);
        next.push({text:wordHtml(key,match),html:true});
        cursor=pos+needle.length;
      }
      if(found){if(cursor<source.length)next.push({text:source.slice(cursor),html:false});}
      else next.push(piece);
    }
    pieces=next;
  }
  return pieces.map(piece=>piece.html?piece.text:esc(piece.text)).join('');
}

function sentenceHtml(sentence,index){
  return '<span class="article-sentence" data-sentence="'+index+'" tabindex="0">'+highlightText(sentence.text)+'</span>'+
         '<span class="sentence-translation" data-translation="'+index+'">'+esc(sentence.uz)+'</span> ';
}
function header(active){
  return '<header class="portal-header"><div class="portal-header-inner">'+
    '<div class="portal-brand"><img src="./vision-logo.jpg" alt="Vision Learning Centre"><div><strong>Vision Student Progress</strong><span>VISION LEARNING CENTRE</span></div></div>'+
    '<div class="portal-header-actions"><button class="signout refresh-button" id="practice-refresh" type="button">↻ Refresh</button><button class="signout" id="practice-signout" type="button">Sign out</button></div>'+
  '</div></header>'+
  '<div class="student-section-nav-wrap"><nav class="student-section-nav" aria-label="Student portal sections">'+
    '<button class="student-section-tab '+(active==='dashboard'?'active':'')+'" id="practice-dashboard-tab" type="button">Dashboard</button>'+
    '<button class="student-section-tab '+(active==='practice'?'active':'')+'" type="button">Practice</button>'+
  '</nav></div>';
}

function practiceHomeHtml(data){
  const student=data?.student||{};
  return '<div class="portal practice-view">'+header('practice')+
    '<main class="portal-main practice-main">'+
      '<section class="practice-hero"><div><small>PRACTICE</small><h1>Practice</h1><p>Choose what you want to practise.</p></div><div class="practice-student">'+esc(student.full_name||'Student')+'</div></section>'+
      '<section class="practice-category-list" aria-label="Practice categories">'+
        '<button class="practice-category-row" id="open-reading-library" type="button">'+
          '<div class="practice-category-icon">R</div>'+
          '<div class="practice-category-copy"><strong>Reading</strong><span>Articles, useful vocabulary, translations and interactive exercises</span></div>'+
          '<div class="practice-category-arrow">→</div>'+
        '</button>'+
        '<button class="practice-category-row" id="open-listening-library" type="button">'+
          '<div class="practice-category-icon">L</div>'+
          '<div class="practice-category-copy"><strong>Listening</strong><span>Listening materials and practice activities</span></div>'+
          '<div class="practice-category-arrow">→</div>'+
        '</button>'+
      '</section>'+
    '</main></div>';
}

function libraryHtml(data){
  const student=data?.student||{};
  const completed=getCompletedArticles(data);
  const articleRows=readingArticles.map((item,index)=>{
    const isDone=completed.has(index);
    return '<button class="reading-list-row'+(isDone?' completed':'')+'" data-article-index="'+index+'" type="button">'+
      '<strong class="reading-list-label">Article '+(index+1)+'</strong>'+
      '<div class="reading-list-status'+(isDone?' done':'')+'">'+(isDone?'✓':'→')+'</div>'+
    '</button>';
  }).join('');
  const count=readingArticles.length;
  return '<div class="portal practice-view">'+header('practice')+
    '<main class="portal-main practice-main">'+
      '<button class="back-to-reading" id="back-to-practice" type="button">← Practice</button>'+
      '<section class="practice-hero"><div><small>PRACTICE</small><h1>Reading</h1><p>Choose an article to read and practise.</p></div><div class="practice-student">'+esc(student.full_name||'Student')+'</div></section>'+
      '<section class="reading-library">'+
        '<div class="section-title-row"><div><span>READING MATERIALS</span><h2>Articles</h2></div><small>'+count+' '+(count===1?'article':'articles')+'</small></div>'+
        (count?'<div class="reading-list">'+articleRows+'</div>':'<div class="practice-empty-state"><strong>No articles yet.</strong><p>Your reading materials will appear here after they are added.</p></div>')+
      '</section>'+
    '</main></div>';
}

function listeningHtml(data){
  const student=data?.student||{};
  return '<div class="portal practice-view">'+header('practice')+
    '<main class="portal-main practice-main">'+
      '<button class="back-to-reading" id="back-to-practice" type="button">← Practice</button>'+
      '<section class="practice-hero"><div><small>PRACTICE</small><h1>Listening</h1><p>Listen, understand, and build useful vocabulary.</p></div><div class="practice-student">'+esc(student.full_name||'Student')+'</div></section>'+
      '<section class="reading-library listening-empty">'+
        '<div class="section-title-row"><div><span>LISTENING MATERIALS</span><h2>Listening</h2></div><small>0 materials</small></div>'+
        '<div class="practice-empty-state"><strong>Listening materials will appear here.</strong><p>We are building Reading first, then we can add the Listening system in this section.</p></div>'+
      '</section>'+
    '</main></div>';
}

function articleBodyHtml(){
  if(!activeArticle)return '';
  let out='';
  let sentenceIndex=0;
  activeArticle.sections.forEach(section=>{
    if(section.heading)out+='<h2 class="article-section-heading">'+esc(section.heading)+'</h2>';
    section.paragraphs.forEach(paragraph=>{
      out+='<p>'+paragraph.map(sentence=>sentenceHtml(sentence,sentenceIndex++)).join(' ')+'</p>';
    });
  });
  return out;
}
function exercisesHtml(){
  return exerciseQuestions.map((q,i)=>
    '<div class="exercise-question" data-question="'+i+'" data-answer="'+q.answer+'">'+
      '<div class="exercise-number">'+(i+1)+'</div>'+
      '<div class="exercise-content"><p>'+esc(q.prompt)+'</p><div class="exercise-options">'+
        q.options.map((o,idx)=>'<button type="button" data-option="'+idx+'">'+esc(o)+'</button>').join('')+
      '</div></div>'+
    '</div>'
  ).join('');
}

function articleHtml(){
  return '<div class="portal practice-view">'+header('practice')+
    '<main class="portal-main practice-main">'+
      '<button class="back-to-reading" id="back-to-reading" type="button">← Reading library</button>'+
      '<article class="reading-article-shell" id="reading-article-shell">'+
        '<div class="article-topbar">'+
          '<div><span class="article-kicker">'+esc(activeArticle.kicker)+'</span><h1>'+esc(activeArticle.title)+'</h1><div class="article-byline">'+esc(activeArticle.byline||'')+'</div><div class="article-meta"><span>'+esc(activeArticle.level)+'</span><span>'+esc(activeArticle.minutes)+'</span><span>'+Object.keys(vocab).length+' key items</span></div></div>'+
          '<button class="translation-toggle" id="translation-toggle" type="button" aria-pressed="false"><span class="toggle-track"><i></i></span><span><b>Translation mode</b><small id="translation-mode-label">Off</small></span></button>'+
        '</div>'+
        '<div class="article-guide"><span class="guide-dot b1"></span><b>B1 useful English</b><span class="guide-dot b2"></span><b>B2–C1 vocabulary</b><p>Tap a bold word for its Uzbek translation. Turn on Translation Mode to translate full sentences.</p></div>'+
        '<div class="article-copy" id="article-copy">'+articleBodyHtml()+'</div>'+
      '</article>'+
      '<section class="vocab-practice-section">'+
        '<div class="practice-section-head"><div><span>AFTER READING</span><h2>Vocabulary practice</h2><p>Choose the best answer. You can change an answer before checking your score.</p></div><div class="exercise-score" id="exercise-score">Not checked</div></div>'+
        '<div class="exercise-list" id="exercise-list">'+exercisesHtml()+'</div>'+
        '<div class="exercise-actions"><button class="check-answers" id="check-answers" type="button">Check answers</button><button class="retry-exercises" id="retry-exercises" type="button">Try again</button></div>'+
      '</section>'+
    '</main></div>';
}

function bindHeader(root,callbacks){
  const dash=root.querySelector('#practice-dashboard-tab');
  const refresh=root.querySelector('#practice-refresh');
  const signout=root.querySelector('#practice-signout');
  if(dash)dash.onclick=()=>callbacks.onDashboard&&callbacks.onDashboard();
  if(refresh)refresh.onclick=()=>callbacks.onRefresh&&callbacks.onRefresh();
  if(signout)signout.onclick=()=>callbacks.onSignOut&&callbacks.onSignOut();
}

function renderHome(root,data,callbacks){
  root.innerHTML=practiceHomeHtml(data);
  bindHeader(root,callbacks);
  root.querySelector('#open-reading-library').onclick=()=>renderLibrary(root,data,callbacks);
  root.querySelector('#open-listening-library').onclick=()=>renderListening(root,data,callbacks);
}

function renderLibrary(root,data,callbacks){
  root.innerHTML=libraryHtml(data);
  bindHeader(root,callbacks);
  root.querySelector('#back-to-practice').onclick=()=>renderHome(root,data,callbacks);
  root.querySelectorAll('.reading-list-row').forEach(row=>{
    row.onclick=()=>{
      const index=Number(row.dataset.articleIndex);
      activeArticleIndex=Number.isFinite(index)?index:0;
      activeArticle=readingArticles[activeArticleIndex]||readingArticles[0];
      renderArticle(root,data,callbacks);
    };
  });
}

function renderListening(root,data,callbacks){
  root.innerHTML=listeningHtml(data);
  bindHeader(root,callbacks);
  root.querySelector('#back-to-practice').onclick=()=>renderHome(root,data,callbacks);
}

function renderArticle(root,data,callbacks){
  if(!activeArticle){renderLibrary(root,data,callbacks);return;}
  root.innerHTML=articleHtml();
  bindHeader(root,callbacks);
  root.querySelector('#back-to-reading').onclick=()=>renderLibrary(root,data,callbacks);

  const shell=root.querySelector('#reading-article-shell');
  const toggle=root.querySelector('#translation-toggle');
  const label=root.querySelector('#translation-mode-label');

  function closeWords(except){
    root.querySelectorAll('.vocab-word.open').forEach(el=>{if(el!==except)el.classList.remove('open');});
  }

  root.querySelector('#article-copy').addEventListener('click',e=>{
    const word=e.target.closest('.vocab-word');
    if(word){
      e.stopPropagation();
      const wasOpen=word.classList.contains('open');
      closeWords(word);
      word.classList.toggle('open',!wasOpen);
      return;
    }
    const sentence=e.target.closest('.article-sentence');
    if(sentence&&shell.classList.contains('translation-on')){
      sentence.classList.toggle('translated');
      const t=root.querySelector('[data-translation="'+sentence.dataset.sentence+'"]');
      if(t)t.classList.toggle('show',sentence.classList.contains('translated'));
    }
  });

  root.querySelector('#article-copy').addEventListener('keydown',e=>{
    if((e.key==='Enter'||e.key===' ')&&e.target.classList.contains('vocab-word')){
      e.preventDefault();
      e.target.click();
    }
    if((e.key==='Enter'||e.key===' ')&&e.target.classList.contains('article-sentence')&&shell.classList.contains('translation-on')){
      e.preventDefault();
      e.target.click();
    }
  });

  document.addEventListener('click',function outsideClose(e){
    if(!root.isConnected){document.removeEventListener('click',outsideClose);return;}
    if(!e.target.closest('.vocab-word'))closeWords();
  });

  toggle.onclick=()=>{
    const on=!shell.classList.contains('translation-on');
    shell.classList.toggle('translation-on',on);
    toggle.classList.toggle('on',on);
    toggle.setAttribute('aria-pressed',String(on));
    label.textContent=on?'On':'Off';
    if(!on){
      root.querySelectorAll('.article-sentence.translated').forEach(el=>el.classList.remove('translated'));
      root.querySelectorAll('.sentence-translation.show').forEach(el=>el.classList.remove('show'));
    }
  };

  root.querySelectorAll('.exercise-question').forEach(q=>{
    q.querySelectorAll('.exercise-options button').forEach(btn=>{
      btn.onclick=()=>{
        q.querySelectorAll('.exercise-options button').forEach(b=>b.classList.remove('selected'));
        btn.classList.add('selected');
        q.classList.remove('correct','wrong');
      };
    });
  });

  root.querySelector('#check-answers').onclick=()=>{
    let correct=0;
    let answered=0;
    root.querySelectorAll('.exercise-question').forEach(q=>{
      const selected=q.querySelector('.exercise-options button.selected');
      q.querySelectorAll('.exercise-options button').forEach(b=>b.classList.remove('correct-option','wrong-option'));
      q.classList.remove('correct','wrong');
      if(!selected)return;
      answered++;
      const isCorrect=Number(selected.dataset.option)===Number(q.dataset.answer);
      if(isCorrect){
        correct++;
        q.classList.add('correct');
        selected.classList.add('correct-option');
      }else{
        q.classList.add('wrong');
        selected.classList.add('wrong-option');
        const correctBtn=q.querySelector('.exercise-options button[data-option="'+q.dataset.answer+'"]');
        if(correctBtn)correctBtn.classList.add('correct-option');
      }
    });
    const score=root.querySelector('#exercise-score');
    score.textContent=correct+' / '+exerciseQuestions.length+' correct';
    score.className='exercise-score '+(correct===exerciseQuestions.length?'excellent':correct>=6?'good':'keep-going');
    if(answered<exerciseQuestions.length){
      score.textContent=correct+' / '+exerciseQuestions.length+' correct · '+(exerciseQuestions.length-answered)+' unanswered';
    }else{
      markArticleCompleted(data,activeArticleIndex);
    }
  };

  root.querySelector('#retry-exercises').onclick=()=>{
    root.querySelectorAll('.exercise-question').forEach(q=>{
      q.classList.remove('correct','wrong');
      q.querySelectorAll('.exercise-options button').forEach(b=>b.classList.remove('selected','correct-option','wrong-option'));
    });
    const score=root.querySelector('#exercise-score');
    score.textContent='Not checked';
    score.className='exercise-score';
  };
}

function render({root,data,onDashboard,onRefresh,onSignOut}){
  renderHome(root,data,{onDashboard,onRefresh,onSignOut});
}

window.VisionStudentPractice={render};
})();