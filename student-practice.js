(() => {
'use strict';
window.VisionStudentPractice?.destroy?.();
let disposeArticle=()=>{};
let cancelArticleAudio=()=>{};
function cleanupArticle(){
  disposeArticle();
  disposeArticle=()=>{};
  cancelArticleAudio=()=>{};
}

const vocab = {
  "pleased_with_yourself": {
    "term": "pleased with yourself",
    "level": "B1",
    "uz": "o‘zingizdan mamnun"
  },
  "feel_low_on_energy": {
    "term": "feel low on energy",
    "level": "B1",
    "uz": "o‘zingizni holsiz his qilmoq / quvvati kam bo‘lmoq"
  },
  "less_able_to_perform": {
    "term": "less able to perform",
    "level": "B1",
    "uz": "avvalgidek yaxshi bajara olmaslik"
  },
  "depend_on_the_type_of_workout": {
    "term": "depend on the type of workout",
    "level": "B1",
    "uz": "mashq turiga bog‘liq bo‘lmoq"
  },
  "accustomed_body": {
    "term": "how accustomed your body is to it",
    "level": "B2–C1",
    "uz": "tanangiz bunga qanchalik odatlanganligi"
  },
  "help_your_body_recover": {
    "term": "help your body recover",
    "level": "B1",
    "uz": "tanangizning tiklanishiga yordam bermoq"
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
  "measurable_drop_in": {
    "term": "a measurable drop in",
    "level": "B2–C1",
    "uz": "...da o‘lchash mumkin bo‘lgan pasayish"
  },
  "unable_to_produce_as_much_force": {
    "term": "unable to produce as much force",
    "level": "B2–C1",
    "uz": "avvalgidek ko‘p kuch hosil qila olmaslik"
  },
  "dont_always_match_perfectly": {
    "term": "don’t always match perfectly",
    "level": "B2–C1",
    "uz": "har doim ham to‘liq mos kelmaslik"
  },
  "perception_of_tiredness": {
    "term": "our perception of tiredness",
    "level": "B2–C1",
    "uz": "charchoqni qanday sezishimiz / idrok etishimiz"
  },
  "develop_after_working_out": {
    "term": "develop after working out",
    "level": "B1",
    "uz": "mashqdan keyin paydo bo‘lmoq"
  },
  "unfamiliar_exercise": {
    "term": "an unfamiliar exercise",
    "level": "B1",
    "uz": "odatlanilmagan / notanish mashq"
  },
  "been_a_while_since": {
    "term": "it’s been a while since",
    "level": "B1",
    "uz": "... qilganimizga ancha vaqt bo‘ldi"
  },
  "particularly_associated_with": {
    "term": "particularly associated with",
    "level": "B2–C1",
    "uz": "ayniqsa ... bilan bog‘liq"
  },
  "single_cause": {
    "term": "There isn’t one single cause",
    "level": "B1",
    "uz": "buning faqat bitta sababi yo‘q"
  },
  "depending_on_what_exercise": {
    "term": "depending on what exercise you’ve done",
    "level": "B2–C1",
    "uz": "qaysi mashqni qilganingizga qarab"
  },
  "rely_on": {
    "term": "rely on",
    "level": "B1",
    "uz": "...ga tayanmoq / bog‘liq bo‘lmoq"
  },
  "trigger_muscle_contractions": {
    "term": "trigger muscle contractions",
    "level": "B2–C1",
    "uz": "mushak qisqarishlarini qo‘zg‘atmoq"
  },
  "affect_ability_to": {
    "term": "affect the muscle’s ability to",
    "level": "B2–C1",
    "uz": "mushakning ... qobiliyatiga ta’sir qilmoq"
  },
  "produce_force": {
    "term": "produce force",
    "level": "B2–C1",
    "uz": "kuch hosil qilmoq"
  },
  "plays_a_part": {
    "term": "plays a part",
    "level": "B1",
    "uz": "rol o‘ynamoq"
  },
  "temporarily_reduce_ability": {
    "term": "temporarily reduce the nervous system’s ability to",
    "level": "B2–C1",
    "uz": "asab tizimining ... qobiliyatini vaqtincha kamaytirmoq"
  },
  "contributing_to": {
    "term": "contributing to",
    "level": "B2–C1",
    "uz": "...ga sabab bo‘lishga hissa qo‘shib"
  },
  "demanding_exercise": {
    "term": "demanding exercise",
    "level": "B2–C1",
    "uz": "katta kuch talab qiladigan mashq"
  },
  "contribute_to_fatigue": {
    "term": "contribute to fatigue",
    "level": "B2–C1",
    "uz": "charchoqqa sabab bo‘lishga hissa qo‘shmoq"
  },
  "reduce_performance": {
    "term": "reduce performance",
    "level": "B2–C1",
    "uz": "jismoniy ko‘rsatkichni pasaytirmoq"
  },
  "accustomed_to_activity": {
    "term": "aren’t accustomed to the activity",
    "level": "B2–C1",
    "uz": "bu faoliyatga odatlanmagan"
  },
  "try_something_unfamiliar": {
    "term": "try something unfamiliar",
    "level": "B1",
    "uz": "odatlanilmagan narsani sinab ko‘rmoq"
  },
  "less_muscle_damage_and_soreness": {
    "term": "less muscle damage and soreness",
    "level": "B2–C1",
    "uz": "kamroq mushak shikastlanishi va og‘rig‘i"
  },
  "preservation_of_physical_performance": {
    "term": "better preservation of physical performance",
    "level": "B2–C1",
    "uz": "jismoniy ko‘rsatkichning yaxshiroq saqlanib qolishi"
  },
  "recovery_strategies": {
    "term": "recovery strategies",
    "level": "B2–C1",
    "uz": "tiklanish usullari / strategiyalari"
  },
  "replace_energy_stores": {
    "term": "replace the energy stores",
    "level": "B2–C1",
    "uz": "energiya zaxiralarini qayta to‘ldirmoq"
  },
  "adapt_and_recover_from": {
    "term": "adapt and recover from",
    "level": "B1",
    "uz": "...ga moslashmoq va undan tiklanmoq"
  },
  "instant_cure_for": {
    "term": "an instant cure for",
    "level": "B2–C1",
    "uz": "... uchun darhol yechim / tezkor davo"
  },
  "produced_mixed_results": {
    "term": "produced mixed results",
    "level": "B2–C1",
    "uz": "turlicha / bir xil bo‘lmagan natijalar berdi"
  },
  "consume_some_electrolytes": {
    "term": "consume some electrolytes",
    "level": "B2–C1",
    "uz": "elektrolitlarni iste’mol qilmoq"
  },
  "opportunity_to_recover": {
    "term": "further opportunity to recover",
    "level": "B2–C1",
    "uz": "yanada tiklanish imkoniyati"
  },
  "benefit_aspects_of": {
    "term": "may benefit aspects of",
    "level": "B2–C1",
    "uz": "...ning ayrim jihatlariga foyda berishi mumkin"
  },
  "alternate_recovery_techniques": {
    "term": "alternate recovery techniques",
    "level": "B2–C1",
    "uz": "muqobil tiklanish usullari"
  },
  "reduce_muscle_soreness": {
    "term": "reduce muscle soreness",
    "level": "B2–C1",
    "uz": "mushak og‘rig‘ini kamaytirmoq"
  },
  "strongest_effects_on": {
    "term": "one of the strongest effects on",
    "level": "B2–C1",
    "uz": "...ga eng kuchli ta’sirlardan biri"
  },
  "manageable_level": {
    "term": "at a manageable level",
    "level": "B2–C1",
    "uz": "uddalash mumkin bo‘lgan darajada"
  },
  "gradually_building_up": {
    "term": "gradually building up",
    "level": "B2–C1",
    "uz": "asta-sekin oshirib borish"
  },
  "well_hydrated_before_workouts": {
    "term": "well hydrated before workouts",
    "level": "B2–C1",
    "uz": "mashqdan oldin yetarlicha suyuqlik ichgan"
  },
  "allowing_time_to_recover": {
    "term": "allowing time to recover",
    "level": "B1",
    "uz": "tiklanishga vaqt bermoq"
  },
  "completely_exhausted": {
    "term": "completely exhausted",
    "level": "B1",
    "uz": "butunlay holdan toygan"
  },
  "doesnt_necessarily_mean": {
    "term": "doesn’t necessarily mean",
    "level": "B2–C1",
    "uz": "har doim ham ... degani emas"
  },
  "in_proportion_to": {
    "term": "in proportion to",
    "level": "B2–C1",
    "uz": "...ga mutanosib ravishda"
  },
  "disproportionate_to": {
    "term": "seems disproportionate to",
    "level": "B2–C1",
    "uz": "...ga nisbatan nomutanosibdek tuyulmoq"
  },
  "improve_with_recovery": {
    "term": "improve with recovery",
    "level": "B1",
    "uz": "tiklanish bilan yaxshilanmoq"
  },
  "comes_with_symptoms": {
    "term": "comes with symptoms such as",
    "level": "B2–C1",
    "uz": "... kabi alomatlar bilan birga kelmoq"
  },
  "post_workout_fatigue": {
    "term": "post-workout fatigue",
    "level": "B1",
    "uz": "mashqdan keyingi charchoq"
  },
  "muscle_weakness": {
    "term": "muscle weakness",
    "level": "B1",
    "uz": "mushak kuchsizligi"
  },
  "physical_performance": {
    "term": "physical performance",
    "level": "B2–C1",
    "uz": "jismoniy ko‘rsatkich / jismoniy natija"
  },
  "challenging_weights_session": {
    "term": "challenging weights session",
    "level": "B2–C1",
    "uz": "qiyin kuch mashg‘uloti"
  },
  "regular_runner": {
    "term": "a regular runner",
    "level": "B1",
    "uz": "muntazam yuguradigan odam"
  },
  "lifts_weights": {
    "term": "lifts weights",
    "level": "B1",
    "uz": "og‘irlik ko‘taradi"
  },
  "long_or_demanding_workout": {
    "term": "a long or demanding workout",
    "level": "B1",
    "uz": "uzoq yoki katta kuch talab qiladigan mashq"
  },
  "energy_stores": {
    "term": "energy stores",
    "level": "B2–C1",
    "uz": "energiya zaxiralari"
  },
  "protein_supplements": {
    "term": "protein supplements",
    "level": "B2–C1",
    "uz": "oqsil qo‘shimchalari"
  },
  "immediate_recovery": {
    "term": "immediate recovery",
    "level": "B2–C1",
    "uz": "tez / darhol tiklanish"
  },
  "long_run": {
    "term": "a long run",
    "level": "B1",
    "uz": "uzoq yugurish"
  },
  "intense_workout_session": {
    "term": "an intense workout session",
    "level": "B1",
    "uz": "juda intensiv mashg‘ulot"
  },
  "sweated_a_lot": {
    "term": "sweated a lot",
    "level": "B1",
    "uz": "ko‘p terlagan"
  },
  "hot_weather": {
    "term": "hot weather",
    "level": "B1",
    "uz": "issiq ob-havo"
  },
  "take_naps": {
    "term": "taking naps",
    "level": "B1",
    "uz": "kunduzgi mizg‘ib olish / qisqa uyqu"
  },
  "physical_and_mental_performance": {
    "term": "physical and mental performance",
    "level": "B2–C1",
    "uz": "jismoniy va aqliy ko‘rsatkich"
  },
  "gentle_exercise": {
    "term": "gentle exercise",
    "level": "B1",
    "uz": "yengil mashq"
  },
  "slow_walk": {
    "term": "a slow walk",
    "level": "B1",
    "uz": "sekin yurish"
  },
  "demanding_workouts": {
    "term": "demanding workouts",
    "level": "B1",
    "uz": "katta kuch talab qiladigan mashqlar"
  },
  "longer_workouts": {
    "term": "longer workouts",
    "level": "B1",
    "uz": "uzoqroq mashqlar"
  },
  "hot_conditions": {
    "term": "hot conditions",
    "level": "B1",
    "uz": "issiq sharoit"
  },
  "support_your_activity": {
    "term": "support your activity",
    "level": "B1",
    "uz": "faoliyatingizni qo‘llab-quvvatlamoq"
  },
  "body_is_prepared_for": {
    "term": "your body is prepared for",
    "level": "B1",
    "uz": "tanangiz tayyor bo‘lgan daraja"
  },
  "reduce_how_bad": {
    "term": "reduce how bad your post-workout fatigue is",
    "level": "B2–C1",
    "uz": "mashqdan keyingi charchoq qanchalik kuchli bo‘lishini kamaytirmoq"
  },
  "chest_pain": {
    "term": "chest pain",
    "level": "B1",
    "uz": "ko‘krak og‘rig‘i"
  },
  "unusual_breathlessness": {
    "term": "unusual breathlessness",
    "level": "B2–C1",
    "uz": "noodatiy nafas qisishi"
  }
,
  "rare_illness": {"term":"a rare illness","level":"B1","uz":"kam uchraydigan kasallik"},
  "developed_brain_damage": {"term":"developed brain damage","level":"B2–C1","uz":"miya shikastlanishi rivojlandi / miya zarar ko‘rdi"},
  "kidney_failure": {"term":"kidney failure","level":"B2–C1","uz":"buyrak yetishmovchiligi"},
  "intensive_care": {"term":"intensive care","level":"B2–C1","uz":"intensiv terapiya / reanimatsiya"},
  "caused_by_infection": {"term":"caused by infection","level":"B1","uz":"infeksiya sababli yuzaga kelgan"},
  "transmitted_in_a_variety_of_ways": {"term":"transmitted in a variety of ways","level":"B2–C1","uz":"turli yo‘llar bilan yuqishi mumkin"},
  "contact_with_animals": {"term":"contact with animals","level":"B1","uz":"hayvonlar bilan aloqa"},
  "shed_light_on": {"term":"shed light on","level":"B2–C1","uz":"...ga oydinlik kiritmoq"},
  "hygiene_precautions": {"term":"hygiene precautions","level":"B2–C1","uz":"gigiyena ehtiyot choralari"},
  "infection_risk": {"term":"infection risk","level":"B1","uz":"infeksiya yuqtirish xavfi"},
  "warning_signs": {"term":"Warning signs","level":"B1","uz":"ogohlantiruvchi belgilar"},
  "urgent_medical_assessment": {"term":"urgent medical assessment","level":"B2–C1","uz":"shoshilinch tibbiy ko‘rik / baholash"},
  "as_soon_as_possible": {"term":"as soon as possible","level":"B1","uz":"imkon qadar tezroq"},
  "leads_to": {"term":"leads to","level":"B1","uz":"...ga olib keladi"},
  "can_progress_to": {"term":"can progress to","level":"B2–C1","uz":"...gacha rivojlanishi mumkin"},
  "medical_treatment": {"term":"medical treatment","level":"B1","uz":"tibbiy davolash"},
  "spread_to_humans": {"term":"spread to humans","level":"B1","uz":"odamlarga yuqmoq / tarqalmoq"},
  "contaminated_food_and_water": {"term":"contaminated food and water","level":"B2–C1","uz":"ifloslangan oziq-ovqat va suv"},
  "come_into_contact_with": {"term":"come into contact with","level":"B1","uz":"... bilan aloqa qilmoq / tegmoq"},
  "not_the_only_way": {"term":"not the only way","level":"B1","uz":"yagona yo‘l emas"},
  "the_risk_lies_when": {"term":"The risk lies when","level":"B2–C1","uz":"xavf ... bo‘lganda yuzaga keladi"},
  "particularly_difficult_to_protect": {"term":"particularly difficult to protect","level":"B2–C1","uz":"himoya qilish ayniqsa qiyin"},
  "recognised_animal_reservoirs": {"term":"recognised animal reservoirs","level":"B2–C1","uz":"kasallik qo‘zg‘atuvchilarining tan olingan hayvon manbalari"},
  "expose_children_to": {"term":"expose children to","level":"B2–C1","uz":"bolalarni ... ta’siriga duchor qilmoq"},
  "identified_as_a_risk": {"term":"identified as a risk","level":"B2–C1","uz":"xavf sifatida aniqlangan"},
  "show_symptoms": {"term":"show symptoms","level":"B1","uz":"alomatlar ko‘rsatmoq"},
  "provide_children_with": {"term":"provide children with","level":"B1","uz":"bolalarga ... taqdim etmoq"},
  "appropriately_managed": {"term":"appropriately managed","level":"B2–C1","uz":"tegishli tarzda boshqarilgan"},
  "readily_accessible": {"term":"readily accessible","level":"B2–C1","uz":"oson foydalanish mumkin bo‘lgan"},
  "physical_separation": {"term":"physical separation","level":"B2–C1","uz":"jismoniy ajratish"},
  "need_to_ensure": {"term":"need to ensure","level":"B1","uz":"...ga ishonch hosil qilishi kerak"},
  "are_supervised": {"term":"are supervised","level":"B1","uz":"nazorat ostida bo‘ladi"},
  "as_effective_as": {"term":"as effective as","level":"B1","uz":"... kabi samarali"},
  "favour_venues_with": {"term":"favour venues with","level":"B2–C1","uz":"... mavjud joylarni afzal ko‘rmoq"},
  "running_water": {"term":"running water","level":"B1","uz":"oqayotgan suv"},
  "disposable_towels": {"term":"disposable towels","level":"B2–C1","uz":"bir martalik sochiqlar"},
  "wash_before_eating_or_drinking": {"term":"wash before eating or drinking","level":"B1","uz":"ovqatlanish yoki ichishdan oldin yuvmoq"}
};

const vocabDetails = {
  "pleased_with_yourself": {
    "ex": [
      "You should be pleased with yourself after finishing the project.",
      "Loyihani tugatganingizdan keyin o‘zingizdan mamnun bo‘lishingiz kerak."
    ],
    "syn": [
      "proud of yourself",
      "satisfied with yourself"
    ]
  },
  "feel_low_on_energy": {
    "ex": [
      "I feel low on energy when I do not sleep well.",
      "Yaxshi uxlamasam, o‘zimni holsiz his qilaman."
    ],
    "syn": [
      "feel tired",
      "feel drained"
    ]
  },
  "less_able_to_perform": {
    "ex": [
      "After a poor night’s sleep, athletes are less able to perform at their best.",
      "Yomon uyqudan keyin sportchilar avvalgidek yaxshi natija ko‘rsata olmaydi."
    ],
    "syn": [
      "less capable of performing"
    ]
  },
  "depend_on_the_type_of_workout": {
    "ex": [
      "Recovery time can depend on the type of workout you do.",
      "Tiklanish vaqti qiladigan mashq turiga bog‘liq bo‘lishi mumkin."
    ],
    "syn": [
      "vary with the type of workout"
    ]
  },
  "accustomed_body": {
    "ex": [
      "The soreness depends on how accustomed your body is to the exercise.",
      "Og‘riq tanangiz mashqqa qanchalik odatlanganiga bog‘liq."
    ],
    "syn": []
  },
  "help_your_body_recover": {
    "ex": [
      "Good sleep can help your body recover after exercise.",
      "Yaxshi uyqu mashqdan keyin tanangizning tiklanishiga yordam beradi."
    ],
    "syn": [
      "help you recover"
    ]
  },
  "perceived_fatigue": {
    "ex": [
      "Perceived fatigue can be high even when your muscles still have strength.",
      "Subyektiv seziladigan charchoq mushaklaringizda hali kuch bo‘lsa ham yuqori bo‘lishi mumkin."
    ],
    "syn": [
      "felt fatigue"
    ]
  },
  "performance_fatigability": {
    "ex": [
      "Performance fatigability can reduce how much force a muscle produces.",
      "Jismoniy ko‘rsatkichning charchoq sabab pasayishi mushak hosil qiladigan kuchni kamaytirishi mumkin."
    ],
    "syn": []
  },
  "measurable_drop_in": {
    "ex": [
      "The test showed a measurable drop in muscle strength.",
      "Test mushak kuchida o‘lchash mumkin bo‘lgan pasayishni ko‘rsatdi."
    ],
    "syn": [
      "measurable decrease in"
    ]
  },
  "unable_to_produce_as_much_force": {
    "ex": [
      "After the final set, the muscle was unable to produce as much force.",
      "Oxirgi setdan keyin mushak avvalgidek ko‘p kuch hosil qila olmadi."
    ],
    "syn": [
      "unable to generate as much force"
    ]
  },
  "dont_always_match_perfectly": {
    "ex": [
      "How tired you feel and how well you perform don’t always match perfectly.",
      "Qanchalik charchaganingiz va qanchalik yaxshi natija ko‘rsatishingiz har doim ham to‘liq mos kelmaydi."
    ],
    "syn": [
      "don’t always correspond exactly"
    ]
  },
  "perception_of_tiredness": {
    "ex": [
      "Stress can change our perception of tiredness.",
      "Stress charchoqni qanday sezishimizni o‘zgartirishi mumkin."
    ],
    "syn": [
      "sense of tiredness"
    ]
  },
  "develop_after_working_out": {
    "ex": [
      "Muscle soreness can develop after working out.",
      "Mushak og‘rig‘i mashqdan keyin paydo bo‘lishi mumkin."
    ],
    "syn": [
      "appear after exercise"
    ]
  },
  "unfamiliar_exercise": {
    "ex": [
      "An unfamiliar exercise can make your muscles sore the next day.",
      "Odatlanilmagan mashq ertasi kuni mushaklaringizni og‘ritishi mumkin."
    ],
    "syn": [
      "a new exercise"
    ]
  },
  "been_a_while_since": {
    "ex": [
      "It’s been a while since I last went running.",
      "Oxirgi marta yugurganimga ancha vaqt bo‘ldi."
    ],
    "syn": [
      "it has been some time since"
    ]
  },
  "particularly_associated_with": {
    "ex": [
      "This type of soreness is particularly associated with unfamiliar exercise.",
      "Bu turdagi og‘riq ayniqsa odatlanilmagan mashq bilan bog‘liq."
    ],
    "syn": [
      "especially linked to"
    ]
  },
  "single_cause": {
    "ex": [
      "There isn’t one single cause of tiredness after exercise.",
      "Mashqdan keyingi charchoqning faqat bitta sababi yo‘q."
    ],
    "syn": [
      "there is no single cause"
    ]
  },
  "depending_on_what_exercise": {
    "ex": [
      "Your muscles may feel different depending on what exercise you’ve done.",
      "Qaysi mashqni qilganingizga qarab mushaklaringiz turlicha his qilishi mumkin."
    ],
    "syn": [
      "depending on the exercise"
    ]
  },
  "rely_on": {
    "ex": [
      "Long workouts rely on energy stored in the body.",
      "Uzoq mashqlar tanada saqlangan energiyaga tayanadi."
    ],
    "syn": [
      "depend on"
    ]
  },
  "trigger_muscle_contractions": {
    "ex": [
      "Nerve signals trigger muscle contractions when you move.",
      "Harakat qilganingizda asab signallari mushak qisqarishlarini qo‘zg‘atadi."
    ],
    "syn": [
      "cause muscle contractions"
    ]
  },
  "affect_ability_to": {
    "ex": [
      "Fatigue can affect the muscle’s ability to produce force.",
      "Charchoq mushakning kuch hosil qilish qobiliyatiga ta’sir qilishi mumkin."
    ],
    "syn": [
      "influence the ability to"
    ]
  },
  "produce_force": {
    "ex": [
      "Strong muscles can produce force quickly.",
      "Kuchli mushaklar tezda kuch hosil qila oladi."
    ],
    "syn": [
      "generate force"
    ]
  },
  "plays_a_part": {
    "ex": [
      "Sleep plays a part in muscle recovery.",
      "Uyqu mushaklarning tiklanishida rol o‘ynaydi."
    ],
    "syn": [
      "has a role"
    ]
  },
  "temporarily_reduce_ability": {
    "ex": [
      "Hard exercise can temporarily reduce the nervous system’s ability to activate muscles.",
      "Og‘ir mashq asab tizimining mushaklarni faollashtirish qobiliyatini vaqtincha kamaytirishi mumkin."
    ],
    "syn": [
      "temporarily limit the ability"
    ]
  },
  "contributing_to": {
    "ex": [
      "Poor sleep may be contributing to your tiredness.",
      "Yomon uyqu charchashingizga sabab bo‘lishga hissa qo‘shayotgan bo‘lishi mumkin."
    ],
    "syn": [
      "adding to"
    ]
  },
  "demanding_exercise": {
    "ex": [
      "Demanding exercise usually requires more recovery time.",
      "Katta kuch talab qiladigan mashq odatda ko‘proq tiklanish vaqtini talab qiladi."
    ],
    "syn": [
      "strenuous exercise",
      "hard exercise"
    ]
  },
  "contribute_to_fatigue": {
    "ex": [
      "Heat and dehydration can contribute to fatigue.",
      "Issiq va suvsizlanish charchoqqa sabab bo‘lishga hissa qo‘shishi mumkin."
    ],
    "syn": [
      "add to fatigue"
    ]
  },
  "reduce_performance": {
    "ex": [
      "Lack of sleep can reduce performance during training.",
      "Uyqu yetishmasligi mashg‘ulot paytida jismoniy ko‘rsatkichni pasaytirishi mumkin."
    ],
    "syn": [
      "lower performance"
    ]
  },
  "accustomed_to_activity": {
    "ex": [
      "Beginners aren’t accustomed to the activity yet.",
      "Yangi boshlovchilar hali bu faoliyatga odatlanmagan."
    ],
    "syn": [
      "aren’t used to the activity"
    ]
  },
  "try_something_unfamiliar": {
    "ex": [
      "Start slowly when you try something unfamiliar.",
      "Odatlanilmagan narsani sinab ko‘rganingizda sekin boshlang."
    ],
    "syn": [
      "try something new"
    ]
  },
  "less_muscle_damage_and_soreness": {
    "ex": [
      "Regular training can lead to less muscle damage and soreness.",
      "Muntazam mashq kamroq mushak shikastlanishi va og‘rig‘iga olib kelishi mumkin."
    ],
    "syn": []
  },
  "preservation_of_physical_performance": {
    "ex": [
      "Good recovery supports better preservation of physical performance.",
      "Yaxshi tiklanish jismoniy ko‘rsatkichning yaxshiroq saqlanib qolishiga yordam beradi."
    ],
    "syn": []
  },
  "recovery_strategies": {
    "ex": [
      "Sleep and hydration are simple recovery strategies.",
      "Uyqu va yetarli suyuqlik ichish oddiy tiklanish usullaridir."
    ],
    "syn": [
      "recovery methods"
    ]
  },
  "replace_energy_stores": {
    "ex": [
      "A balanced meal can help replace the energy stores used during exercise.",
      "Muvozanatli ovqat mashq paytida ishlatilgan energiya zaxiralarini qayta to‘ldirishga yordam beradi."
    ],
    "syn": [
      "restore energy stores",
      "replenish energy stores"
    ]
  },
  "adapt_and_recover_from": {
    "ex": [
      "Your body needs time to adapt and recover from harder training.",
      "Tanangiz qiyinroq mashqqa moslashish va undan tiklanish uchun vaqtga muhtoj."
    ],
    "syn": [
      "adjust to and recover from"
    ]
  },
  "instant_cure_for": {
    "ex": [
      "There is no instant cure for normal post-workout fatigue.",
      "Oddiy mashqdan keyingi charchoq uchun darhol yechim yo‘q."
    ],
    "syn": [
      "quick fix for"
    ]
  },
  "produced_mixed_results": {
    "ex": [
      "Studies on this method have produced mixed results.",
      "Bu usul bo‘yicha tadqiqotlar turlicha natijalar berdi."
    ],
    "syn": [
      "shown mixed results"
    ]
  },
  "consume_some_electrolytes": {
    "ex": [
      "After heavy sweating, you may need to consume some electrolytes.",
      "Ko‘p terlaganingizdan keyin elektrolitlarni iste’mol qilishingiz kerak bo‘lishi mumkin."
    ],
    "syn": [
      "take in some electrolytes"
    ]
  },
  "opportunity_to_recover": {
    "ex": [
      "A rest day gives your body a further opportunity to recover.",
      "Dam olish kuni tanangizga yanada tiklanish imkoniyatini beradi."
    ],
    "syn": [
      "more time to recover"
    ]
  },
  "benefit_aspects_of": {
    "ex": [
      "A short nap may benefit aspects of mental performance.",
      "Qisqa uyqu aqliy ko‘rsatkichning ayrim jihatlariga foyda berishi mumkin."
    ],
    "syn": [
      "help aspects of"
    ]
  },
  "alternate_recovery_techniques": {
    "ex": [
      "Some athletes use alternate recovery techniques after hard sessions.",
      "Ba’zi sportchilar og‘ir mashg‘ulotlardan keyin muqobil tiklanish usullaridan foydalanadi."
    ],
    "syn": [
      "alternative recovery methods"
    ]
  },
  "reduce_muscle_soreness": {
    "ex": [
      "Light movement may help reduce muscle soreness.",
      "Yengil harakat mushak og‘rig‘ini kamaytirishga yordam berishi mumkin."
    ],
    "syn": [
      "ease muscle soreness"
    ]
  },
  "strongest_effects_on": {
    "ex": [
      "Sleep has one of the strongest effects on recovery.",
      "Uyqu tiklanishga eng kuchli ta’sirlardan birini ko‘rsatadi."
    ],
    "syn": [
      "greatest effects on"
    ]
  },
  "manageable_level": {
    "ex": [
      "Keep the intensity at a manageable level when you return to training.",
      "Mashg‘ulotga qaytganda intensivlikni uddalash mumkin bo‘lgan darajada saqlang."
    ],
    "syn": [
      "at a reasonable level"
    ]
  },
  "gradually_building_up": {
    "ex": [
      "Gradually building up your training can reduce excessive soreness.",
      "Mashg‘ulotni asta-sekin oshirib borish kuchli og‘riqni kamaytirishi mumkin."
    ],
    "syn": [
      "increasing gradually",
      "building up slowly"
    ]
  },
  "well_hydrated_before_workouts": {
    "ex": [
      "Try to be well hydrated before workouts in hot weather.",
      "Issiq ob-havoda mashqdan oldin yetarlicha suyuqlik ichgan bo‘lishga harakat qiling."
    ],
    "syn": [
      "properly hydrated before workouts"
    ]
  },
  "allowing_time_to_recover": {
    "ex": [
      "Allowing time to recover is part of a good training plan.",
      "Tiklanishga vaqt berish yaxshi mashg‘ulot rejasining bir qismidir."
    ],
    "syn": [
      "giving time to recover"
    ]
  },
  "completely_exhausted": {
    "ex": [
      "You should not feel completely exhausted after every workout.",
      "Har bir mashqdan keyin butunlay holdan toygan bo‘lishingiz shart emas."
    ],
    "syn": [
      "totally exhausted",
      "completely worn out"
    ]
  },
  "doesnt_necessarily_mean": {
    "ex": [
      "Feeling sore doesn’t necessarily mean the workout was better.",
      "Og‘riq sezish har doim ham mashq yaxshiroq bo‘lgan degani emas."
    ],
    "syn": [
      "does not always mean"
    ]
  },
  "in_proportion_to": {
    "ex": [
      "Your recovery time should be in proportion to how hard you trained.",
      "Tiklanish vaqtingiz qanchalik qattiq mashq qilganingizga mutanosib bo‘lishi kerak."
    ],
    "syn": [
      "proportional to"
    ]
  },
  "disproportionate_to": {
    "ex": [
      "The tiredness seems disproportionate to the amount of exercise you did.",
      "Charchoq qilgan mashqingiz miqdoriga nisbatan nomutanosibdek tuyuladi."
    ],
    "syn": [
      "out of proportion to"
    ]
  },
  "improve_with_recovery": {
    "ex": [
      "Normal fatigue should improve with recovery.",
      "Oddiy charchoq tiklanish bilan yaxshilanishi kerak."
    ],
    "syn": [
      "get better with recovery"
    ]
  },
  "comes_with_symptoms": {
    "ex": [
      "Seek help if fatigue comes with symptoms such as chest pain.",
      "Agar charchoq ko‘krak og‘rig‘i kabi alomatlar bilan birga kelsa, yordam so‘rang."
    ],
    "syn": [
      "is accompanied by symptoms such as"
    ]
  },
  "post_workout_fatigue": {
    "ex": [
      "Post-workout fatigue is common after a very hard session.",
      "Juda og‘ir mashg‘ulotdan keyin mashqdan keyingi charchoq odatiy hol."
    ],
    "syn": [
      "post-exercise fatigue"
    ]
  },
  "muscle_weakness": {
    "ex": [
      "Muscle weakness can make simple movements feel harder.",
      "Mushak kuchsizligi oddiy harakatlarni ham qiyinlashtirishi mumkin."
    ],
    "syn": [
      "weakness in the muscles"
    ]
  },
  "physical_performance": {
    "ex": [
      "Good sleep can improve physical performance.",
      "Yaxshi uyqu jismoniy ko‘rsatkichni yaxshilashi mumkin."
    ],
    "syn": [
      "physical ability"
    ]
  },
  "challenging_weights_session": {
    "ex": [
      "He felt tired after a challenging weights session.",
      "U qiyin kuch mashg‘ulotidan keyin charchadi."
    ],
    "syn": [
      "hard weights session"
    ]
  },
  "regular_runner": {
    "ex": [
      "A regular runner usually adapts to long runs more easily.",
      "Muntazam yuguradigan odam odatda uzoq yugurishlarga osonroq moslashadi."
    ],
    "syn": [
      "regular jogger"
    ]
  },
  "lifts_weights": {
    "ex": [
      "She lifts weights three times a week.",
      "U haftasiga uch marta og‘irlik ko‘taradi."
    ],
    "syn": [
      "does weight training"
    ]
  },
  "long_or_demanding_workout": {
    "ex": [
      "Eat enough after a long or demanding workout.",
      "Uzoq yoki katta kuch talab qiladigan mashqdan keyin yetarli ovqatlaning."
    ],
    "syn": [
      "long or strenuous workout"
    ]
  },
  "energy_stores": {
    "ex": [
      "Carbohydrates help refill your energy stores after exercise.",
      "Uglevodlar mashqdan keyin energiya zaxiralarini qayta to‘ldirishga yordam beradi."
    ],
    "syn": [
      "energy reserves"
    ]
  },
  "protein_supplements": {
    "ex": [
      "Protein supplements are not necessary for everyone.",
      "Oqsil qo‘shimchalari hamma uchun ham zarur emas."
    ],
    "syn": [
      "protein products"
    ]
  },
  "immediate_recovery": {
    "ex": [
      "Water and rest can support immediate recovery after training.",
      "Suv va dam olish mashg‘ulotdan keyingi tez tiklanishga yordam berishi mumkin."
    ],
    "syn": [
      "rapid recovery"
    ]
  },
  "long_run": {
    "ex": [
      "I usually drink more water after a long run.",
      "Men odatda uzoq yugurishdan keyin ko‘proq suv ichaman."
    ],
    "syn": [
      "long-distance run"
    ]
  },
  "intense_workout_session": {
    "ex": [
      "An intense workout session can leave you tired for several hours.",
      "Juda intensiv mashg‘ulot sizni bir necha soat charchatishi mumkin."
    ],
    "syn": [
      "hard workout session"
    ]
  },
  "sweated_a_lot": {
    "ex": [
      "Drink more water if you sweated a lot during training.",
      "Mashg‘ulot paytida ko‘p terlagan bo‘lsangiz, ko‘proq suv iching."
    ],
    "syn": [
      "perspired heavily"
    ]
  },
  "hot_weather": {
    "ex": [
      "Exercise feels harder in hot weather.",
      "Issiq ob-havoda mashq qilish qiyinroq tuyuladi."
    ],
    "syn": [
      "warm weather"
    ]
  },
  "take_naps": {
    "ex": [
      "Some athletes take naps after hard morning sessions.",
      "Ba’zi sportchilar og‘ir ertalabki mashg‘ulotlardan keyin kunduzgi qisqa uyqu qiladi."
    ],
    "syn": [
      "have short naps"
    ]
  },
  "physical_and_mental_performance": {
    "ex": [
      "Sleep affects both physical and mental performance.",
      "Uyqu jismoniy va aqliy ko‘rsatkichga ta’sir qiladi."
    ],
    "syn": [
      "physical and cognitive performance"
    ]
  },
  "gentle_exercise": {
    "ex": [
      "Gentle exercise can help you move without putting too much stress on the body.",
      "Yengil mashq tanaga ortiqcha zo‘riqish bermasdan harakat qilishga yordam beradi."
    ],
    "syn": [
      "light exercise"
    ]
  },
  "slow_walk": {
    "ex": [
      "A slow walk can be a good way to stay active on a rest day.",
      "Sekin yurish dam olish kunida faol qolishning yaxshi usuli bo‘lishi mumkin."
    ],
    "syn": [
      "gentle walk"
    ]
  },
  "demanding_workouts": {
    "ex": [
      "Do not schedule several demanding workouts in a row.",
      "Bir necha katta kuch talab qiladigan mashqni ketma-ket rejalashtirmang."
    ],
    "syn": [
      "strenuous workouts",
      "hard workouts"
    ]
  },
  "longer_workouts": {
    "ex": [
      "Longer workouts usually require more food and rest.",
      "Uzoqroq mashqlar odatda ko‘proq ovqat va dam olishni talab qiladi."
    ],
    "syn": [
      "extended workouts"
    ]
  },
  "hot_conditions": {
    "ex": [
      "Your body loses more fluid in hot conditions.",
      "Issiq sharoitda tanangiz ko‘proq suyuqlik yo‘qotadi."
    ],
    "syn": [
      "hot environments"
    ]
  },
  "support_your_activity": {
    "ex": [
      "Eat enough food to support your activity.",
      "Faoliyatingizni qo‘llab-quvvatlash uchun yetarli ovqatlaning."
    ],
    "syn": [
      "support your exercise"
    ]
  },
  "body_is_prepared_for": {
    "ex": [
      "Do not train much harder than your body is prepared for.",
      "Tanangiz tayyor bo‘lgan darajadan ancha qattiqroq mashq qilmang."
    ],
    "syn": [
      "your body is ready for"
    ]
  },
  "reduce_how_bad": {
    "ex": [
      "Good recovery habits can reduce how bad your post-workout fatigue is.",
      "Yaxshi tiklanish odatlari mashqdan keyingi charchoq qanchalik kuchli bo‘lishini kamaytirishi mumkin."
    ],
    "syn": [
      "make your post-workout fatigue less severe"
    ]
  },
  "chest_pain": {
    "ex": [
      "Stop exercising and seek help if you have chest pain.",
      "Ko‘krak og‘rig‘i bo‘lsa, mashqni to‘xtating va yordam so‘rang."
    ],
    "syn": [
      "pain in the chest"
    ]
  },
  "unusual_breathlessness": {
    "ex": [
      "Unusual breathlessness after light activity should not be ignored.",
      "Yengil faoliyatdan keyingi noodatiy nafas qisishini e’tiborsiz qoldirmaslik kerak."
    ],
    "syn": [
      "unusual shortness of breath"
    ]
  },
  "rare_illness": {
    "ex": [
      "Doctors discovered that the child had a rare illness.",
      "Shifokorlar bolada kam uchraydigan kasallik borligini aniqladi."
    ],
    "syn": [
      "uncommon illness"
    ]
  },
  "developed_brain_damage": {
    "ex": [
      "The patient developed brain damage after a severe infection.",
      "Bemor og‘ir infeksiyadan keyin miya shikastlanishiga uchradi."
    ],
    "syn": [
      "suffered brain damage"
    ]
  },
  "kidney_failure": {
    "ex": [
      "Severe dehydration can sometimes contribute to kidney failure.",
      "Kuchli suvsizlanish ba’zan buyrak yetishmovchiligiga sabab bo‘lishi mumkin."
    ],
    "syn": [
      "renal failure"
    ]
  },
  "intensive_care": {
    "ex": [
      "The patient was taken to intensive care for close monitoring.",
      "Bemor yaqindan kuzatish uchun intensiv terapiyaga olib ketildi."
    ],
    "syn": [
      "critical care"
    ]
  },
  "caused_by_infection": {
    "ex": [
      "Some serious illnesses are caused by infection.",
      "Ba’zi jiddiy kasalliklar infeksiya sababli yuzaga keladi."
    ],
    "syn": [
      "resulting from infection"
    ]
  },
  "transmitted_in_a_variety_of_ways": {
    "ex": [
      "Some infections can be transmitted in a variety of ways.",
      "Ba’zi infeksiyalar turli yo‘llar bilan yuqishi mumkin."
    ],
    "syn": [
      "spread in different ways"
    ]
  },
  "contact_with_animals": {
    "ex": [
      "Wash your hands after contact with animals.",
      "Hayvonlar bilan aloqadan keyin qo‘llaringizni yuving."
    ],
    "syn": [
      "contact with livestock"
    ]
  },
  "shed_light_on": {
    "ex": [
      "The new study may shed light on how the infection spreads.",
      "Yangi tadqiqot infeksiya qanday tarqalishiga oydinlik kiritishi mumkin."
    ],
    "syn": [
      "clarify",
      "help explain"
    ]
  },
  "hygiene_precautions": {
    "ex": [
      "Simple hygiene precautions can lower the risk of infection.",
      "Oddiy gigiyena ehtiyot choralari infeksiya xavfini kamaytirishi mumkin."
    ],
    "syn": [
      "hygiene measures"
    ]
  },
  "infection_risk": {
    "ex": [
      "Good handwashing can reduce infection risk.",
      "Qo‘llarni yaxshi yuvish infeksiya yuqtirish xavfini kamaytirishi mumkin."
    ],
    "syn": [
      "risk of infection"
    ]
  },
  "warning_signs": {
    "ex": [
      "Parents should know the warning signs of serious illness.",
      "Ota-onalar jiddiy kasallikning ogohlantiruvchi belgilarini bilishi kerak."
    ],
    "syn": [
      "warning symptoms"
    ]
  },
  "urgent_medical_assessment": {
    "ex": [
      "Severe symptoms may require urgent medical assessment.",
      "Og‘ir alomatlar shoshilinch tibbiy ko‘rikni talab qilishi mumkin."
    ],
    "syn": [
      "urgent medical evaluation"
    ]
  },
  "as_soon_as_possible": {
    "ex": [
      "Call a doctor as soon as possible if the symptoms become severe.",
      "Alomatlar kuchaysa, imkon qadar tezroq shifokorga qo‘ng‘iroq qiling."
    ],
    "syn": [
      "as quickly as possible"
    ]
  },
  "leads_to": {
    "ex": [
      "Poor hygiene sometimes leads to infection.",
      "Yomon gigiyena ba’zan infeksiyaga olib keladi."
    ],
    "syn": [
      "results in"
    ]
  },
  "can_progress_to": {
    "ex": [
      "Without treatment, the infection can progress to a more serious condition.",
      "Davolanmasa, infeksiya yanada jiddiy holatgacha rivojlanishi mumkin."
    ],
    "syn": [
      "can develop into"
    ]
  },
  "medical_treatment": {
    "ex": [
      "Early medical treatment can prevent serious complications.",
      "Erta tibbiy davolash jiddiy asoratlarning oldini olishi mumkin."
    ],
    "syn": [
      "medical care"
    ]
  },
  "spread_to_humans": {
    "ex": [
      "Some animal infections can spread to humans.",
      "Ba’zi hayvon infeksiyalari odamlarga yuqishi mumkin."
    ],
    "syn": [
      "pass to humans"
    ]
  },
  "contaminated_food_and_water": {
    "ex": [
      "Contaminated food and water can carry harmful bacteria.",
      "Ifloslangan oziq-ovqat va suv zararli bakteriyalarni tashishi mumkin."
    ],
    "syn": [
      "polluted food and water"
    ]
  },
  "come_into_contact_with": {
    "ex": [
      "Children may come into contact with animals at petting zoos.",
      "Bolalar hayvonot bog‘larida hayvonlar bilan aloqa qilishi mumkin."
    ],
    "syn": [
      "have contact with"
    ]
  },
  "not_the_only_way": {
    "ex": [
      "Touching animals is not the only way an infection can spread.",
      "Hayvonlarga tegish infeksiya tarqalishining yagona yo‘li emas."
    ],
    "syn": [
      "not the sole way"
    ]
  },
  "the_risk_lies_when": {
    "ex": [
      "The risk lies when children touch their mouths before washing their hands.",
      "Xavf bolalar qo‘llarini yuvmasdan og‘ziga tekkizganda yuzaga keladi."
    ],
    "syn": [
      "the danger arises when"
    ]
  },
  "particularly_difficult_to_protect": {
    "ex": [
      "Very young children can be particularly difficult to protect from germs.",
      "Juda yosh bolalarni mikroblardan himoya qilish ayniqsa qiyin bo‘lishi mumkin."
    ],
    "syn": [
      "especially hard to protect"
    ]
  },
  "recognised_animal_reservoirs": {
    "ex": [
      "Cattle are recognised animal reservoirs for some bacteria.",
      "Qoramollar ayrim bakteriyalarning tan olingan hayvon manbalaridir."
    ],
    "syn": [
      "known animal reservoirs"
    ]
  },
  "expose_children_to": {
    "ex": [
      "Poor hygiene can expose children to harmful bacteria.",
      "Yomon gigiyena bolalarni zararli bakteriyalar ta’siriga duchor qilishi mumkin."
    ],
    "syn": [
      "put children in contact with"
    ]
  },
  "identified_as_a_risk": {
    "ex": [
      "Eating near animals has been identified as a risk.",
      "Hayvonlar yaqinida ovqatlanish xavf sifatida aniqlangan."
    ],
    "syn": [
      "recognised as a risk"
    ]
  },
  "show_symptoms": {
    "ex": [
      "Some infected animals do not show symptoms.",
      "Ba’zi zararlangan hayvonlar alomatlar ko‘rsatmaydi."
    ],
    "syn": [
      "display symptoms"
    ]
  },
  "provide_children_with": {
    "ex": [
      "The venue should provide children with a safe place to wash their hands.",
      "Joy bolalarga qo‘llarini yuvish uchun xavfsiz joy taqdim etishi kerak."
    ],
    "syn": [
      "give children"
    ]
  },
  "appropriately_managed": {
    "ex": [
      "Animal contact areas should be appropriately managed.",
      "Hayvonlar bilan aloqa qilinadigan joylar tegishli tarzda boshqarilishi kerak."
    ],
    "syn": [
      "properly managed"
    ]
  },
  "readily_accessible": {
    "ex": [
      "Handwashing facilities should be readily accessible to visitors.",
      "Qo‘l yuvish joylaridan tashrif buyuruvchilar oson foydalanishi mumkin bo‘lishi kerak."
    ],
    "syn": [
      "easily accessible"
    ]
  },
  "physical_separation": {
    "ex": [
      "Physical separation between eating and animal areas can improve safety.",
      "Ovqatlanish joylari bilan hayvonlar hududi o‘rtasidagi jismoniy ajratish xavfsizlikni oshirishi mumkin."
    ],
    "syn": [
      "physical division"
    ]
  },
  "need_to_ensure": {
    "ex": [
      "Parents need to ensure that children wash their hands properly.",
      "Ota-onalar bolalar qo‘llarini to‘g‘ri yuvishiga ishonch hosil qilishi kerak."
    ],
    "syn": [
      "must make sure"
    ]
  },
  "are_supervised": {
    "ex": [
      "Young children are supervised while they wash their hands.",
      "Yosh bolalar qo‘llarini yuvayotganda nazorat ostida bo‘ladi."
    ],
    "syn": [
      "are watched"
    ]
  },
  "as_effective_as": {
    "ex": [
      "A quick rinse is not as effective as proper handwashing.",
      "Tezda chayish qo‘llarni to‘g‘ri yuvish kabi samarali emas."
    ],
    "syn": [
      "equally effective as"
    ]
  },
  "favour_venues_with": {
    "ex": [
      "Families should favour venues with good handwashing facilities.",
      "Oilalar yaxshi qo‘l yuvish sharoiti mavjud joylarni afzal ko‘rishi kerak."
    ],
    "syn": [
      "prefer venues with"
    ]
  },
  "running_water": {
    "ex": [
      "Wash your hands with soap and running water.",
      "Qo‘llaringizni sovun va oqayotgan suv bilan yuving."
    ],
    "syn": []
  },
  "disposable_towels": {
    "ex": [
      "Use disposable towels to dry your hands after washing.",
      "Qo‘llaringizni yuvgandan keyin bir martalik sochiqlardan foydalaning."
    ],
    "syn": [
      "single-use towels"
    ]
  },
  "wash_before_eating_or_drinking": {
    "ex": [
      "Children should wash before eating or drinking after touching animals.",
      "Bolalar hayvonlarga tekkandan keyin ovqatlanish yoki ichishdan oldin qo‘llarini yuvishi kerak."
    ],
    "syn": [
      "wash before having food or drink"
    ]
  }
};

const strictSynonyms = {
  "less_able_to_perform": [
    "less capable of performing"
  ],
  "measurable_drop_in": [
    "measurable decrease in"
  ],
  "unable_to_produce_as_much_force": [
    "unable to generate as much force"
  ],
  "dont_always_match_perfectly": [
    "don’t always correspond exactly"
  ],
  "develop_after_working_out": [
    "appear after exercise"
  ],
  "particularly_associated_with": [
    "especially linked to"
  ],
  "single_cause": [
    "there is no single cause"
  ],
  "rely_on": [
    "depend on"
  ],
  "trigger_muscle_contractions": [
    "cause muscle contractions"
  ],
  "affect_ability_to": [
    "influence the ability to"
  ],
  "produce_force": [
    "generate force"
  ],
  "plays_a_part": [
    "has a role"
  ],
  "demanding_exercise": [
    "strenuous exercise",
    "hard exercise"
  ],
  "reduce_performance": [
    "lower performance"
  ],
  "accustomed_to_activity": [
    "aren’t used to the activity"
  ],
  "recovery_strategies": [
    "recovery methods"
  ],
  "replace_energy_stores": [
    "replenish energy stores",
    "restore energy stores"
  ],
  "instant_cure_for": [
    "quick fix for"
  ],
  "reduce_muscle_soreness": [
    "ease muscle soreness"
  ],
  "gradually_building_up": [
    "increasing gradually",
    "building up slowly"
  ],
  "allowing_time_to_recover": [
    "giving time to recover"
  ],
  "completely_exhausted": [
    "totally exhausted",
    "completely worn out"
  ],
  "doesnt_necessarily_mean": [
    "does not always mean"
  ],
  "disproportionate_to": [
    "out of proportion to"
  ],
  "improve_with_recovery": [
    "get better with recovery"
  ],
  "comes_with_symptoms": [
    "is accompanied by symptoms such as"
  ],
  "post_workout_fatigue": [
    "post-exercise fatigue"
  ],
  "muscle_weakness": [
    "weakness in the muscles"
  ],
  "intense_workout_session": [
    "hard workout session"
  ],
  "demanding_workouts": [
    "strenuous workouts",
    "hard workouts"
  ],
  "chest_pain": [
    "pain in the chest"
  ],
  "unusual_breathlessness": [
    "unusual shortness of breath"
  ],
  "rare_illness": [
    "uncommon illness"
  ],
  "kidney_failure": [
    "renal failure"
  ],
  "intensive_care": [
    "critical care"
  ],
  "caused_by_infection": [
    "resulting from infection"
  ],
  "transmitted_in_a_variety_of_ways": [
    "spread in different ways"
  ],
  "shed_light_on": [
    "clarify",
    "help explain"
  ],
  "hygiene_precautions": [
    "hygiene measures"
  ],
  "infection_risk": [
    "risk of infection"
  ],
  "urgent_medical_assessment": [
    "urgent medical evaluation"
  ],
  "as_soon_as_possible": [
    "as quickly as possible"
  ],
  "leads_to": [
    "results in"
  ],
  "can_progress_to": [
    "can develop into"
  ],
  "spread_to_humans": [
    "pass to humans"
  ],
  "come_into_contact_with": [
    "have contact with"
  ],
  "particularly_difficult_to_protect": [
    "especially hard to protect"
  ],
  "identified_as_a_risk": [
    "recognised as a risk"
  ],
  "show_symptoms": [
    "display symptoms"
  ],
  "appropriately_managed": [
    "properly managed"
  ],
  "readily_accessible": [
    "easily accessible"
  ],
  "need_to_ensure": [
    "must make sure"
  ],
  "favour_venues_with": [
    "prefer venues with"
  ],
  "disposable_towels": [
    "single-use towels"
  ]
};

const vocabExtraExamples = {
  "pleased_with_yourself": [
    "You can be pleased with yourself for keeping your promise.",
    "Va’dangizda turganingiz uchun o‘zingizdan mamnun bo‘lishingiz mumkin."
  ],
  "feel_low_on_energy": [
    "She often feels low on energy in the late afternoon.",
    "U tushdan keyin kechroq paytda ko‘pincha o‘zini holsiz his qiladi."
  ],
  "less_able_to_perform": [
    "People are less able to perform well when they are extremely tired.",
    "Odamlar juda charchaganda avvalgidek yaxshi natija ko‘rsata olmaydi."
  ],
  "depend_on_the_type_of_workout": [
    "How sore you feel can depend on the type of workout you choose.",
    "Qanchalik og‘riq sezishingiz tanlagan mashq turingizga bog‘liq bo‘lishi mumkin."
  ],
  "accustomed_body": [
    "You may recover faster when your body is accustomed to the activity.",
    "Tanangiz faoliyatga odatlangan bo‘lsa, tezroq tiklanishingiz mumkin."
  ],
  "help_your_body_recover": [
    "A nutritious meal can help your body recover after a long run.",
    "To‘yimli ovqat uzoq yugurishdan keyin tanangizning tiklanishiga yordam beradi."
  ],
  "perceived_fatigue": [
    "Perceived fatigue may increase when you are stressed or worried.",
    "Stress yoki xavotir paytida subyektiv seziladigan charchoq kuchayishi mumkin."
  ],
  "performance_fatigability": [
    "Researchers measured performance fatigability after the cycling test.",
    "Tadqiqotchilar velosiped testidan keyin jismoniy ko‘rsatkichning charchoq sabab pasayishini o‘lchadi."
  ],
  "measurable_drop_in": [
    "There was a measurable drop in speed near the end of the race.",
    "Poyganing oxiriga yaqin tezlikda o‘lchash mumkin bo‘lgan pasayish kuzatildi."
  ],
  "unable_to_produce_as_much_force": [
    "Tired muscles may be unable to produce as much force as fresh muscles.",
    "Charchagan mushaklar dam olgan mushaklardek ko‘p kuch hosil qila olmasligi mumkin."
  ],
  "dont_always_match_perfectly": [
    "Our feelings and the actual results don’t always match perfectly.",
    "His-tuyg‘ularimiz va haqiqiy natijalar har doim ham to‘liq mos kelmaydi."
  ],
  "perception_of_tiredness": [
    "A good mood can sometimes change your perception of tiredness.",
    "Yaxshi kayfiyat ba’zan charchoqni qanday sezishingizni o‘zgartirishi mumkin."
  ],
  "develop_after_working_out": [
    "A mild ache may develop after working out for the first time in weeks.",
    "Bir necha haftadan keyin ilk bor mashq qilganda yengil og‘riq paydo bo‘lishi mumkin."
  ],
  "unfamiliar_exercise": [
    "Try an unfamiliar exercise with a lighter weight at first.",
    "Odatlanilmagan mashqni avval yengilroq og‘irlik bilan sinab ko‘ring."
  ],
  "been_a_while_since": [
    "It’s been a while since we last visited our grandparents.",
    "Bobo-buvimizni oxirgi marta ko‘rganimizga ancha vaqt bo‘ldi."
  ],
  "particularly_associated_with": [
    "This problem is particularly associated with very hot weather.",
    "Bu muammo ayniqsa juda issiq ob-havo bilan bog‘liq."
  ],
  "single_cause": [
    "There isn’t one single cause of poor sleep.",
    "Yomon uyquning faqat bitta sababi yo‘q."
  ],
  "depending_on_what_exercise": [
    "You may need more water depending on what exercise you’ve done.",
    "Qaysi mashqni qilganingizga qarab sizga ko‘proq suv kerak bo‘lishi mumkin."
  ],
  "rely_on": [
    "Many people rely on public transport to get to work.",
    "Ko‘p odamlar ishga borish uchun jamoat transportiga tayanadi."
  ],
  "trigger_muscle_contractions": [
    "Electrical signals from nerves can trigger muscle contractions.",
    "Asablardan keladigan elektr signallari mushak qisqarishlarini qo‘zg‘atishi mumkin."
  ],
  "affect_ability_to": [
    "Lack of sleep can affect your ability to concentrate.",
    "Uyqu yetishmasligi diqqatni jamlash qobiliyatingizga ta’sir qilishi mumkin."
  ],
  "produce_force": [
    "Your legs need to produce force when you jump.",
    "Sakraganingizda oyoqlaringiz kuch hosil qilishi kerak."
  ],
  "plays_a_part": [
    "Diet also plays a part in your overall health.",
    "Ovqatlanish ham umumiy sog‘lig‘ingizda rol o‘ynaydi."
  ],
  "temporarily_reduce_ability": [
    "A serious lack of sleep can temporarily reduce your ability to focus.",
    "Jiddiy uyqusizlik diqqatni jamlash qobiliyatingizni vaqtincha kamaytirishi mumkin."
  ],
  "contributing_to": [
    "Heavy traffic is contributing to air pollution in the city.",
    "Kuchli tirbandlik shahardagi havo ifloslanishiga hissa qo‘shmoqda."
  ],
  "demanding_exercise": [
    "Have a proper meal after demanding exercise.",
    "Katta kuch talab qiladigan mashqdan keyin to‘g‘ri ovqatlaning."
  ],
  "contribute_to_fatigue": [
    "Long working hours can contribute to fatigue.",
    "Uzoq ish soatlari charchoqqa sabab bo‘lishga hissa qo‘shishi mumkin."
  ],
  "reduce_performance": [
    "Dehydration can reduce performance in hot conditions.",
    "Suvsizlanish issiq sharoitda jismoniy ko‘rsatkichni pasaytirishi mumkin."
  ],
  "accustomed_to_activity": [
    "After a few weeks, your body becomes more accustomed to the activity.",
    "Bir necha haftadan keyin tanangiz bu faoliyatga ko‘proq odatlanadi."
  ],
  "try_something_unfamiliar": [
    "Travelling is a good chance to try something unfamiliar.",
    "Sayohat odatlanilmagan narsani sinab ko‘rish uchun yaxshi imkoniyat."
  ],
  "less_muscle_damage_and_soreness": [
    "A gradual training plan may lead to less muscle damage and soreness.",
    "Mashg‘ulotni asta-sekin oshirish rejasi kamroq mushak shikastlanishi va og‘rig‘iga olib kelishi mumkin."
  ],
  "preservation_of_physical_performance": [
    "Rest is important for the preservation of physical performance during a long competition.",
    "Uzoq musobaqa davomida jismoniy ko‘rsatkichni saqlab qolish uchun dam olish muhim."
  ],
  "recovery_strategies": [
    "Different athletes prefer different recovery strategies.",
    "Turli sportchilar turli tiklanish usullarini afzal ko‘radi."
  ],
  "replace_energy_stores": [
    "Eating carbohydrates after training can help replace energy stores.",
    "Mashg‘ulotdan keyin uglevod iste’mol qilish energiya zaxiralarini qayta to‘ldirishga yordam beradi."
  ],
  "adapt_and_recover_from": [
    "Give your body enough time to adapt and recover from a new routine.",
    "Tanangizga yangi tartibga moslashish va undan tiklanish uchun yetarli vaqt bering."
  ],
  "instant_cure_for": [
    "There is no instant cure for poor fitness.",
    "Jismoniy tayyorgarlik pastligi uchun darhol yechim yo‘q."
  ],
  "produced_mixed_results": [
    "The new treatment has produced mixed results so far.",
    "Yangi davolash usuli hozirgacha turlicha natijalar berdi."
  ],
  "consume_some_electrolytes": [
    "You can consume some electrolytes after exercising for a long time in the heat.",
    "Issiqda uzoq vaqt mashq qilgandan keyin elektrolitlarni iste’mol qilishingiz mumkin."
  ],
  "opportunity_to_recover": [
    "A quiet weekend gave her an opportunity to recover.",
    "Tinch dam olish kunlari unga tiklanish imkoniyatini berdi."
  ],
  "benefit_aspects_of": [
    "Regular exercise may benefit aspects of mental health.",
    "Muntazam mashq ruhiy salomatlikning ayrim jihatlariga foyda berishi mumkin."
  ],
  "alternate_recovery_techniques": [
    "The coach introduced alternate recovery techniques to the team.",
    "Murabbiy jamoaga muqobil tiklanish usullarini tanishtirdi."
  ],
  "reduce_muscle_soreness": [
    "A gentle walk may reduce muscle soreness the next day.",
    "Yengil yurish ertasi kuni mushak og‘rig‘ini kamaytirishi mumkin."
  ],
  "strongest_effects_on": [
    "Daily habits often have the strongest effects on long-term health.",
    "Kundalik odatlar ko‘pincha uzoq muddatli salomatlikka eng kuchli ta’sir ko‘rsatadi."
  ],
  "manageable_level": [
    "Keep your weekly workload at a manageable level.",
    "Haftalik ish yuklamangizni uddalash mumkin bo‘lgan darajada saqlang."
  ],
  "gradually_building_up": [
    "Gradually building up your running distance can help prevent injury.",
    "Yugurish masofasini asta-sekin oshirib borish jarohatning oldini olishga yordam beradi."
  ],
  "well_hydrated_before_workouts": [
    "Athletes should be well hydrated before workouts in summer.",
    "Sportchilar yozda mashqdan oldin yetarlicha suyuqlik ichgan bo‘lishi kerak."
  ],
  "allowing_time_to_recover": [
    "Allowing time to recover can improve your next training session.",
    "Tiklanishga vaqt berish keyingi mashg‘ulotingizni yaxshilashi mumkin."
  ],
  "completely_exhausted": [
    "He felt completely exhausted after working all night.",
    "U tun bo‘yi ishlagandan keyin butunlay holdan toygan edi."
  ],
  "doesnt_necessarily_mean": [
    "A high price doesn’t necessarily mean better quality.",
    "Yuqori narx har doim ham sifat yaxshiroq degani emas."
  ],
  "in_proportion_to": [
    "The amount of rest should be in proportion to the effort you make.",
    "Dam olish miqdori qilgan harakatingizga mutanosib bo‘lishi kerak."
  ],
  "disproportionate_to": [
    "The cost seems disproportionate to the quality of the product.",
    "Narx mahsulot sifatiga nisbatan nomutanosibdek tuyuladi."
  ],
  "improve_with_recovery": [
    "Your energy levels should improve with recovery.",
    "Quvvat darajangiz tiklanish bilan yaxshilanishi kerak."
  ],
  "comes_with_symptoms": [
    "See a doctor if the illness comes with symptoms such as a high fever.",
    "Kasallik yuqori isitma kabi alomatlar bilan birga kelsa, shifokorga murojaat qiling."
  ],
  "post_workout_fatigue": [
    "Post-workout fatigue usually becomes less noticeable after proper rest.",
    "Mashqdan keyingi charchoq odatda yaxshi dam olgandan keyin kamroq seziladi."
  ],
  "muscle_weakness": [
    "Muscle weakness may make it difficult to climb stairs.",
    "Mushak kuchsizligi zinadan chiqishni qiyinlashtirishi mumkin."
  ],
  "physical_performance": [
    "Regular training can improve physical performance over time.",
    "Muntazam mashq vaqt o‘tishi bilan jismoniy ko‘rsatkichni yaxshilashi mumkin."
  ],
  "challenging_weights_session": [
    "Take a rest day after a challenging weights session if you need one.",
    "Agar kerak bo‘lsa, qiyin kuch mashg‘ulotidan keyin bir kun dam oling."
  ],
  "regular_runner": [
    "A regular runner may find five kilometres quite easy.",
    "Muntazam yuguradigan odam uchun besh kilometr ancha oson bo‘lishi mumkin."
  ],
  "lifts_weights": [
    "My brother lifts weights at the gym after work.",
    "Akam ishdan keyin sport zalida og‘irlik ko‘taradi."
  ],
  "long_or_demanding_workout": [
    "Plan enough recovery time after a long or demanding workout.",
    "Uzoq yoki katta kuch talab qiladigan mashqdan keyin yetarli tiklanish vaqtini rejalashtiring."
  ],
  "energy_stores": [
    "Your energy stores can become low during a very long workout.",
    "Juda uzoq mashq paytida energiya zaxiralaringiz kamayishi mumkin."
  ],
  "protein_supplements": [
    "Some people use protein supplements after training.",
    "Ba’zi odamlar mashg‘ulotdan keyin oqsil qo‘shimchalaridan foydalanadi."
  ],
  "immediate_recovery": [
    "A cool drink can support immediate recovery after exercise in the heat.",
    "Salqin ichimlik issiqda mashqdan keyingi tez tiklanishga yordam berishi mumkin."
  ],
  "long_run": [
    "She listens to podcasts during a long run.",
    "U uzoq yugurish paytida podkast tinglaydi."
  ],
  "intense_workout_session": [
    "Drink enough water before an intense workout session.",
    "Juda intensiv mashg‘ulotdan oldin yetarli suv iching."
  ],
  "sweated_a_lot": [
    "I sweated a lot during the football match.",
    "Men futbol o‘yini paytida ko‘p terladim."
  ],
  "hot_weather": [
    "We avoid exercising outside at midday in hot weather.",
    "Issiq ob-havoda tush payti tashqarida mashq qilishdan saqlanamiz."
  ],
  "take_naps": [
    "I sometimes take naps when I feel very tired in the afternoon.",
    "Tushdan keyin juda charchaganimda ba’zan qisqa uyqu qilaman."
  ],
  "physical_and_mental_performance": [
    "A balanced routine can support physical and mental performance.",
    "Muvozanatli tartib jismoniy va aqliy ko‘rsatkichni qo‘llab-quvvatlashi mumkin."
  ],
  "gentle_exercise": [
    "Gentle exercise is often easier on tired muscles.",
    "Yengil mashq charchagan mushaklarga ko‘pincha yengilroq tushadi."
  ],
  "slow_walk": [
    "We took a slow walk around the park after dinner.",
    "Kechki ovqatdan keyin bog‘da sekin sayr qildik."
  ],
  "demanding_workouts": [
    "Give yourself enough rest between demanding workouts.",
    "Katta kuch talab qiladigan mashqlar orasida o‘zingizga yetarli dam bering."
  ],
  "longer_workouts": [
    "Longer workouts are not always better workouts.",
    "Uzoqroq mashqlar har doim ham yaxshiroq mashqlar degani emas."
  ],
  "hot_conditions": [
    "Workers need regular breaks in hot conditions.",
    "Ishchilar issiq sharoitda muntazam tanaffus qilishi kerak."
  ],
  "support_your_activity": [
    "Choose meals that give you enough energy to support your activity.",
    "Faoliyatingizni qo‘llab-quvvatlash uchun yetarli quvvat beradigan ovqatlarni tanlang."
  ],
  "body_is_prepared_for": [
    "Increase the distance only when your body is prepared for it.",
    "Masofani faqat tanangiz bunga tayyor bo‘lganda oshiring."
  ],
  "reduce_how_bad": [
    "Rest and hydration can reduce how bad your post-workout fatigue is.",
    "Dam olish va yetarli suyuqlik ichish mashqdan keyingi charchoq qanchalik kuchli bo‘lishini kamaytirishi mumkin."
  ],
  "chest_pain": [
    "He went to the hospital because of sudden chest pain.",
    "U to‘satdan paydo bo‘lgan ko‘krak og‘rig‘i sabab kasalxonaga bordi."
  ],
  "unusual_breathlessness": [
    "Tell a doctor if you experience unusual breathlessness during normal activities.",
    "Oddiy faoliyat paytida noodatiy nafas qisishi bo‘lsa, shifokorga ayting."
  ],
  "rare_illness": [
    "The doctors were able to identify the rare illness quickly.",
    "Shifokorlar kam uchraydigan kasallikni tezda aniqlay oldi."
  ],
  "developed_brain_damage": [
    "The report said that the patient developed brain damage after the accident.",
    "Hisobotda bemor baxtsiz hodisadan keyin miya shikastlanishiga uchragani aytilgan."
  ],
  "kidney_failure": [
    "Kidney failure requires medical treatment and careful monitoring.",
    "Buyrak yetishmovchiligi tibbiy davolash va ehtiyotkor kuzatuvni talab qiladi."
  ],
  "intensive_care": [
    "She remained in intensive care for several days.",
    "U bir necha kun intensiv terapiyada qoldi."
  ],
  "caused_by_infection": [
    "The swelling was caused by infection.",
    "Shish infeksiya sababli yuzaga kelgan edi."
  ],
  "transmitted_in_a_variety_of_ways": [
    "Viruses can be transmitted in a variety of ways.",
    "Viruslar turli yo‘llar bilan yuqishi mumkin."
  ],
  "contact_with_animals": [
    "Children should wash their hands after contact with animals.",
    "Bolalar hayvonlar bilan aloqadan keyin qo‘llarini yuvishi kerak."
  ],
  "shed_light_on": [
    "The interview may shed light on what happened that evening.",
    "Suhbat o‘sha oqshom nima bo‘lganiga oydinlik kiritishi mumkin."
  ],
  "hygiene_precautions": [
    "Restaurants must follow basic hygiene precautions.",
    "Restoranlar asosiy gigiyena ehtiyot choralariga rioya qilishi kerak."
  ],
  "infection_risk": [
    "Washing your hands regularly can lower infection risk.",
    "Qo‘llarni muntazam yuvish infeksiya yuqtirish xavfini kamaytirishi mumkin."
  ],
  "warning_signs": [
    "Learn the warning signs before the condition becomes serious.",
    "Holat jiddiylashishidan oldin ogohlantiruvchi belgilarni bilib oling."
  ],
  "urgent_medical_assessment": [
    "The child was sent for urgent medical assessment.",
    "Bola shoshilinch tibbiy ko‘rikka yuborildi."
  ],
  "as_soon_as_possible": [
    "Please send me the document as soon as possible.",
    "Iltimos, hujjatni imkon qadar tezroq menga yuboring."
  ],
  "leads_to": [
    "Too little sleep often leads to poor concentration.",
    "Juda kam uxlash ko‘pincha diqqatning pasayishiga olib keladi."
  ],
  "can_progress_to": [
    "A small problem can progress to something more serious if ignored.",
    "Kichik muammo e’tiborsiz qoldirilsa, yanada jiddiy holatgacha rivojlanishi mumkin."
  ],
  "medical_treatment": [
    "He recovered well after receiving medical treatment.",
    "U tibbiy davolashdan keyin yaxshi tiklandi."
  ],
  "spread_to_humans": [
    "Certain diseases can spread to humans from animals.",
    "Ayrim kasalliklar hayvonlardan odamlarga yuqishi mumkin."
  ],
  "contaminated_food_and_water": [
    "Travellers should be careful with contaminated food and water.",
    "Sayohatchilar ifloslangan oziq-ovqat va suvdan ehtiyot bo‘lishi kerak."
  ],
  "come_into_contact_with": [
    "You may come into contact with many different people at a large event.",
    "Katta tadbirda ko‘plab turli odamlar bilan aloqa qilishingiz mumkin."
  ],
  "not_the_only_way": [
    "Driving is not the only way to get around the city.",
    "Mashina haydash shahar bo‘ylab yurishning yagona yo‘li emas."
  ],
  "the_risk_lies_when": [
    "The risk lies when people ignore basic safety rules.",
    "Xavf odamlar asosiy xavfsizlik qoidalarini e’tiborsiz qoldirganda yuzaga keladi."
  ],
  "particularly_difficult_to_protect": [
    "Personal information can be particularly difficult to protect online.",
    "Shaxsiy ma’lumotlarni internetda himoya qilish ayniqsa qiyin bo‘lishi mumkin."
  ],
  "recognised_animal_reservoirs": [
    "Scientists study recognised animal reservoirs to understand how diseases spread.",
    "Olimlar kasalliklar qanday tarqalishini tushunish uchun tan olingan hayvon manbalarini o‘rganadi."
  ],
  "expose_children_to": [
    "Parents should avoid exposing children to cigarette smoke.",
    "Ota-onalar bolalarni sigaret tutuni ta’siriga duchor qilishdan saqlanishi kerak."
  ],
  "identified_as_a_risk": [
    "Poor ventilation was identified as a risk in the report.",
    "Yomon shamollatish hisobotda xavf sifatida aniqlangan."
  ],
  "show_symptoms": [
    "Some people can carry an infection without showing symptoms.",
    "Ba’zi odamlar alomatlar ko‘rsatmasdan infeksiyani tashib yurishi mumkin."
  ],
  "provide_children_with": [
    "Schools should provide children with a safe place to learn.",
    "Maktablar bolalarga o‘qish uchun xavfsiz joy taqdim etishi kerak."
  ],
  "appropriately_managed": [
    "The situation can be controlled if it is appropriately managed.",
    "Vaziyat tegishli tarzda boshqarilsa, uni nazorat qilish mumkin."
  ],
  "readily_accessible": [
    "Clean drinking water should be readily accessible to everyone.",
    "Toza ichimlik suvidan hamma oson foydalanishi mumkin bo‘lishi kerak."
  ],
  "physical_separation": [
    "Physical separation can reduce contact between different groups.",
    "Jismoniy ajratish turli guruhlar o‘rtasidagi aloqani kamaytirishi mumkin."
  ],
  "need_to_ensure": [
    "Managers need to ensure that the building is safe.",
    "Rahbarlar bino xavfsizligiga ishonch hosil qilishi kerak."
  ],
  "are_supervised": [
    "Children are supervised during the swimming lesson.",
    "Bolalar suzish darsi paytida nazorat ostida bo‘ladi."
  ],
  "as_effective_as": [
    "Online lessons can be as effective as classroom lessons in some situations.",
    "Ba’zi holatlarda onlayn darslar sinfdagi darslar kabi samarali bo‘lishi mumkin."
  ],
  "favour_venues_with": [
    "We favour venues with plenty of natural light.",
    "Biz tabiiy yorug‘lik ko‘p bo‘lgan joylarni afzal ko‘ramiz."
  ],
  "running_water": [
    "The village now has clean running water.",
    "Qishloqda endi toza oqayotgan suv bor."
  ],
  "disposable_towels": [
    "Disposable towels are available beside the sink.",
    "Rakvina yonida bir martalik sochiqlar bor."
  ],
  "wash_before_eating_or_drinking": [
    "Always wash before eating or drinking after gardening.",
    "Bog‘da ishlagandan keyin ovqatlanish yoki ichishdan oldin doimo qo‘llaringizni yuving."
  ]
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
  },
  {
    "id": "petting-zoos-safe",
    "title": "Are petting zoos safe?",
    "kicker": "HEALTH & SAFETY",
    "level": "B2",
    "minutes": "7 min read",
    "byline": "Thomas Jeffries · The Conversation · 3 September 2026",
    "sections": [
      {
        "heading": null,
        "paragraphs": [
          [
            {
              "text": "A three-year-old girl has died from a rare illness after visiting a petting zoo in Victoria.",
              "uz": "Viktoriyadagi hayvonlarni silab ko‘rish mumkin bo‘lgan hayvonot bog‘iga tashrif buyurgan uch yoshli qiz kam uchraydigan kasallikdan vafot etdi."
            },
            {
              "text": "She had developed brain damage and kidney failure after spending weeks in intensive care.",
              "uz": "U bir necha hafta intensiv terapiyada yotganidan so‘ng miya shikastlanishi va buyrak yetishmovchiligiga duch keldi."
            }
          ],
          [
            {
              "text": "The girl is confirmed to have had haemolytic uraemic syndrome, a rare but serious serious condition, caused by infection with a specific type of Escherichia coli bacteria (or E. coli for short).",
              "uz": "Qizda gemolitik-uremik sindrom bo‘lgani tasdiqlandi; bu E. coli deb qisqartiriladigan Escherichia coli bakteriyasining muayyan turi bilan infeksiya natijasida yuzaga keladigan kam uchraydigan, ammo jiddiy holat."
            },
            {
              "text": "This can be transmitted in a variety of ways, including after contact with animals on a farm or at a petting zoo.",
              "uz": "Bu turli yo‘llar bilan yuqishi mumkin, jumladan ferma yoki hayvonlarni silash mumkin bo‘lgan hayvonot bog‘ida hayvonlar bilan aloqa qilgandan keyin."
            }
          ],
          [
            {
              "text": "Fortunately, such tragic cases are rare.",
              "uz": "Yaxshiyamki, bunday fojeali holatlar kam uchraydi."
            },
            {
              "text": "But they do shed light on bacterial infections harboured by some animals and the need to take hygiene precautions when visiting petting zoos.",
              "uz": "Ammo ular ayrim hayvonlarda mavjud bo‘lishi mumkin bo‘lgan bakterial infeksiyalar va bunday joylarga tashrif buyurganda gigiyena ehtiyot choralarini ko‘rish zarurligiga oydinlik kiritadi."
            }
          ],
          [
            {
              "text": "I’m a microbiology lecturer, and I’m planning to visit a petting zoo next weekend with my family.",
              "uz": "Men mikrobiologiya o‘qituvchisiman va kelasi dam olish kunlari oilam bilan hayvonlarni silash mumkin bo‘lgan hayvonot bog‘iga borishni rejalashtiryapman."
            },
            {
              "text": "Here’s what we know about the infection risk at petting zoos, and what parents can do to help keep their children safe.",
              "uz": "Quyida bunday hayvonot bog‘laridagi infeksiya xavfi haqida nimalarni bilishimiz va ota-onalar bolalarini xavfsiz saqlash uchun nimalar qilishi mumkinligi bayon qilingan."
            }
          ]
        ]
      },
      {
        "heading": "What is haemolytic uraemic syndrome?",
        "paragraphs": [
          [
            {
              "text": "Haemolytic uraemic syndrome most commonly results from infection with types of E. coli that produce a specific toxin called the Shiga toxin.",
              "uz": "Gemolitik-uremik sindrom ko‘pincha Shiga toksini deb ataladigan maxsus toksin ishlab chiqaradigan E. coli turlari bilan infeksiya natijasida yuzaga keladi."
            },
            {
              "text": "Early symptoms of infection are nausea, stomach cramps, vomiting and diarrhoea, which can contain blood.",
              "uz": "Infeksiyaning dastlabki alomatlari ko‘ngil aynishi, qorin tirishishi, qusish va ba’zan qon aralash bo‘lishi mumkin bo‘lgan ich ketishidir."
            }
          ],
          [
            {
              "text": "Warning signs that need urgent medical assessment include bloody diarrhoea, markedly reduced urination, lethargy, pallor (looking pale), unexplained bruising or red-purple spots on the skin.",
              "uz": "Shoshilinch tibbiy ko‘rikni talab qiladigan ogohlantiruvchi belgilar qatoriga qonli ich ketishi, siydik ajralishining keskin kamayishi, holsizlik, oqarib ketish, sababsiz ko‘karishlar yoki terida qizil-binafsha dog‘lar kiradi."
            }
          ],
          [
            {
              "text": "If a doctor suspects someone has haemolytic uraemic syndrome, they will ask about symptoms and examine the person.",
              "uz": "Agar shifokor kimdadir gemolitik-uremik sindrom bor deb gumon qilsa, alomatlar haqida so‘raydi va bemorni ko‘rikdan o‘tkazadi."
            },
            {
              "text": "Hospitalisation as soon as possible will be necessary.",
              "uz": "Imkon qadar tezroq shifoxonaga yotqizish zarur bo‘ladi."
            },
            {
              "text": "Blood, stool and sometimes urine tests confirm the diagnosis.",
              "uz": "Qon, najas va ba’zan siydik tahlillari tashxisni tasdiqlaydi."
            }
          ],
          [
            {
              "text": "The Shiga toxin can damage the lining of blood vessels, which leads to circulatory and kidney problems.",
              "uz": "Shiga toksini qon tomirlari ichki qavatiga zarar yetkazishi mumkin, bu esa qon aylanishi va buyrak bilan bog‘liq muammolarga olib keladi."
            },
            {
              "text": "This can progress to haemolytic uraemic syndrome, leading to kidney failure, high blood pressure, seizures and in some cases death.",
              "uz": "Bu gemolitik-uremik sindromgacha rivojlanib, buyrak yetishmovchiligi, yuqori qon bosimi, tutqanoq va ayrim hollarda o‘limga olib kelishi mumkin."
            }
          ],
          [
            {
              "text": "So emergency medical treatment is essential, in a hospital intensive care unit, with dialysis and blood transfusions often needed.",
              "uz": "Shuning uchun shifoxonaning intensiv terapiya bo‘limida shoshilinch tibbiy davolash juda muhim bo‘lib, ko‘pincha dializ va qon quyish talab etiladi."
            },
            {
              "text": "The disease is more common in children.",
              "uz": "Bu kasallik bolalarda ko‘proq uchraydi."
            }
          ]
        ]
      },
      {
        "heading": "How is it spread?",
        "paragraphs": [
          [
            {
              "text": "These bacteria can can spread to humans by contaminated food and water.",
              "uz": "Bu bakteriyalar ifloslangan oziq-ovqat va suv orqali odamlarga yuqishi mumkin."
            },
            {
              "text": "Humans can also spread the bacteria to other humans, via faeces, such as when changing nappies.",
              "uz": "Odamlar ham bakteriyani boshqa odamlarga najas orqali, masalan, taglik almashtirish paytida yuqtirishi mumkin."
            }
          ],
          [
            {
              "text": "But the situation most relevant here is the spread via some animals.",
              "uz": "Ammo bu yerda eng muhim holat — bakteriyaning ayrim hayvonlar orqali tarqalishidir."
            },
            {
              "text": "Bacteria are present on animal fur and wool, so children can come into contact with it when patting or cuddling an animal.",
              "uz": "Bakteriyalar hayvonlarning juni va yungida bo‘lishi mumkin, shuning uchun bolalar hayvonni silaganda yoki quchoqlaganda ular bilan aloqa qilishi mumkin."
            },
            {
              "text": "But that’s not the only way.",
              "uz": "Ammo bu yagona yo‘l emas."
            }
          ],
          [
            {
              "text": "Bacteria are also present on manure, bedding, soil, feed, enclosure floors and fences.",
              "uz": "Bakteriyalar go‘ng, to‘shama, tuproq, yem, hayvonlar saqlanadigan joy polida va panjaralarda ham bo‘lishi mumkin."
            },
            {
              "text": "The risk lies when people’s contaminated hands come into contact with their mouth.",
              "uz": "Xavf odamlarning ifloslangan qo‘llari og‘iz bilan aloqa qilganda yuzaga keladi."
            }
          ],
          [
            {
              "text": "Toddlers are particularly difficult to protect because they often put fingers, toys, food and dummies in their mouths and need help to wash their hands thoroughly.",
              "uz": "Kichik yoshdagi bolalarni himoya qilish ayniqsa qiyin, chunki ular ko‘pincha barmoqlarini, o‘yinchoqlarni, ovqatni va so‘rg‘ichlarni og‘ziga soladi hamda qo‘llarini yaxshilab yuvishda yordamga muhtoj bo‘ladi."
            }
          ]
        ]
      },
      {
        "heading": "Are some animals riskier than others?",
        "paragraphs": [
          [
            {
              "text": "Cattle and other ruminants, including sheep and goats, are recognised animal reservoirs for Shiga-producing E. coli, as well as some other pathogens.",
              "uz": "Qoramol va boshqa kavsh qaytaruvchi hayvonlar, jumladan qo‘y va echkilar, Shiga toksini ishlab chiqaruvchi E. coli hamda ayrim boshqa kasallik qo‘zg‘atuvchilarining tan olingan hayvon manbalari hisoblanadi."
            }
          ],
          [
            {
              "text": "For example, animal contact can also expose children to Salmonella, Campylobacter and Cryptosporidium, all of which can cause gastroenteritis.",
              "uz": "Masalan, hayvonlar bilan aloqa bolalarni Salmonella, Campylobacter va Cryptosporidium ta’siriga ham duchor qilishi mumkin; ularning barchasi gastroenteritga sabab bo‘lishi mumkin."
            }
          ],
          [
            {
              "text": "While exposure to these can occur on farms, petting zoos and open zoos specifically have been identified as a risk for these microorganisms.",
              "uz": "Bu mikroorganizmlarga fermalarda ham duch kelish mumkin, ammo ayniqsa hayvonlarni silash mumkin bo‘lgan va ochiq hayvonot bog‘lari xavf sifatida aniqlangan."
            },
            {
              "text": "Animals may not always show symptoms.",
              "uz": "Hayvonlar har doim ham alomatlar ko‘rsatmasligi mumkin."
            }
          ]
        ]
      },
      {
        "heading": "But petting zoos are great for kids, aren’t they?",
        "paragraphs": [
          [
            {
              "text": "Petting zoos and farm experiences can provide children with educational experiences involving animals, farming, food production and animal welfare.",
              "uz": "Hayvonlarni silash mumkin bo‘lgan hayvonot bog‘lari va ferma tajribalari bolalarga hayvonlar, dehqonchilik, oziq-ovqat ishlab chiqarish va hayvonlar farovonligi bilan bog‘liq ta’limiy tajribalarni taqdim etishi mumkin."
            },
            {
              "text": "They’re also such a great family activity and educational resource.",
              "uz": "Ular oilaviy faoliyat va ta’limiy manba sifatida ham juda foydali."
            }
          ],
          [
            {
              "text": "The Australian Veterinary Association supports petting zoos where animal health, welfare, public safety and disease-transmission risks are appropriately managed.",
              "uz": "Avstraliya veterinariya assotsiatsiyasi hayvonlar salomatligi, farovonligi, jamoat xavfsizligi va kasallik yuqish xavflari tegishli tarzda boshqariladigan hayvonot bog‘larini qo‘llab-quvvatlaydi."
            }
          ],
          [
            {
              "text": "Hygiene plans include clear communication about the risks of infection, readily accessible handwashing facilities, and physical separation between animal-contact and food areas.",
              "uz": "Gigiyena rejalariga infeksiya xavfi haqida aniq ma’lumot berish, qo‘l yuvish uchun oson foydalaniladigan sharoitlar va hayvonlar bilan aloqa qilinadigan joylarni ovqatlanish hududlaridan jismonan ajratish kiradi."
            }
          ],
          [
            {
              "text": "Parents need to ensure their children are supervised.",
              "uz": "Ota-onalar bolalari nazorat ostida ekaniga ishonch hosil qilishi kerak."
            },
            {
              "text": "Most importantly, they need to ensure their children’s hands are washed before coming into contact with anything that might go into a child’s mouth – a dummy, or food, for instance.",
              "uz": "Eng muhimi, ota-onalar bolaning og‘ziga tushishi mumkin bo‘lgan narsalarga, masalan so‘rg‘ich yoki ovqatga tegishdan oldin bolalarning qo‘llari yuvilganiga ishonch hosil qilishi kerak."
            },
            {
              "text": "Hand sanitiser is not as effective as washing with soap and water for 20 seconds or more.",
              "uz": "Qo‘l antiseptigi qo‘llarni sovun va suv bilan 20 soniya yoki undan ko‘proq yuvish kabi samarali emas."
            }
          ],
          [
            {
              "text": "So when choosing a petting zoo, favour venues with handwashing stations immediately outside animal areas, with running water, soap, disposable towels and signs reminding visitors to wash before eating or drinking.",
              "uz": "Shuning uchun bunday hayvonot bog‘ini tanlaganda hayvonlar hududidan chiqishda qo‘l yuvish joylari, oqayotgan suv, sovun, bir martalik sochiqlar va tashrif buyuruvchilarga ovqatlanish yoki ichishdan oldin qo‘l yuvishni eslatadigan belgilar mavjud joylarni afzal ko‘ring."
            }
          ]
        ]
      }
    ],
    "exerciseQuestions": [
      {
        "prompt": "If a case “sheds light on” a problem, it...",
        "options": [
          "helps people understand it better",
          "completely hides it",
          "makes it impossible to study"
        ],
        "answer": 0
      },
      {
        "prompt": "“Hygiene precautions” are actions taken to...",
        "options": [
          "reduce health and infection risks",
          "make animals grow faster",
          "replace medical treatment"
        ],
        "answer": 0
      },
      {
        "prompt": "If something can be “transmitted in a variety of ways”, it can...",
        "options": [
          "spread in several different ways",
          "only spread through water",
          "never pass between people"
        ],
        "answer": 0
      },
      {
        "prompt": "“Urgent medical assessment” means...",
        "options": [
          "a medical check that should happen quickly",
          "a routine school lesson",
          "a long holiday from work"
        ],
        "answer": 0
      },
      {
        "prompt": "If one problem “leads to” another, it...",
        "options": [
          "causes or results in it",
          "prevents it completely",
          "has no connection with it"
        ],
        "answer": 0
      },
      {
        "prompt": "“Contaminated food and water” contains...",
        "options": [
          "something harmful or dirty",
          "extra vitamins only",
          "nothing that can affect health"
        ],
        "answer": 0
      },
      {
        "prompt": "To “come into contact with” something means to...",
        "options": [
          "touch it or be exposed to it",
          "forget about it",
          "move far away from it"
        ],
        "answer": 0
      },
      {
        "prompt": "If animals “may not always show symptoms”, they...",
        "options": [
          "can carry an infection without looking ill",
          "are always obviously sick",
          "cannot carry microorganisms"
        ],
        "answer": 0
      },
      {
        "prompt": "“Readily accessible” handwashing facilities are...",
        "options": [
          "easy to reach and use",
          "locked and difficult to find",
          "only available to staff"
        ],
        "answer": 0
      },
      {
        "prompt": "“Physical separation” between two areas means...",
        "options": [
          "keeping the areas apart",
          "mixing the areas together",
          "removing both areas"
        ],
        "answer": 0
      },
      {
        "prompt": "If parents “need to ensure” something, they need to...",
        "options": [
          "make sure it happens",
          "ignore it",
          "guess whether it happened"
        ],
        "answer": 0
      },
      {
        "prompt": "If hand sanitiser is “not as effective as” soap and water, it...",
        "options": [
          "does not work as well",
          "works better in every case",
          "has exactly the same effect"
        ],
        "answer": 0
      }
    ]
  }
];
let activeArticleIndex=0;
let activeArticle=null;

function readingStudentId(data){
  const student=data?.student||{};
  return String(student.id||[student.full_name,student.group,student.grade_or_age].filter(Boolean).join('|')||'student');
}

function completionKey(data){
  return 'vision-reading-completed:v3:'+readingStudentId(data);
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
    "prompt": "If you “feel low on energy”, you...",
    "options": [
      "do not have much energy",
      "feel stronger than usual",
      "need less rest"
    ],
    "answer": 0
  },
  {
    "prompt": "If something “depends on the type of workout”, the result...",
    "options": [
      "changes according to the workout",
      "is always the same",
      "has nothing to do with exercise"
    ],
    "answer": 0
  },
  {
    "prompt": "To “help your body recover” means to help it...",
    "options": [
      "return to a normal condition",
      "work much harder",
      "avoid all movement"
    ],
    "answer": 0
  },
  {
    "prompt": "“A measurable drop in performance” is...",
    "options": [
      "a decrease that can be measured",
      "a feeling with no change at all",
      "an increase in performance"
    ],
    "answer": 0
  },
  {
    "prompt": "If two things “don’t always match perfectly”, they...",
    "options": [
      "are not always completely the same",
      "are never related",
      "always produce the same result"
    ],
    "answer": 0
  },
  {
    "prompt": "“It’s been a while since I exercised” means...",
    "options": [
      "I exercised a long time ago",
      "I exercise every day",
      "I have just finished exercising"
    ],
    "answer": 0
  },
  {
    "prompt": "If one thing is “particularly associated with” another, it is...",
    "options": [
      "strongly connected with it",
      "completely separate from it",
      "less important than it"
    ],
    "answer": 0
  },
  {
    "prompt": "If something “affects the muscle’s ability to produce force”, it...",
    "options": [
      "changes how well the muscle can produce force",
      "makes the muscle disappear",
      "only changes body temperature"
    ],
    "answer": 0
  },
  {
    "prompt": "If the nervous system “plays a part”, it...",
    "options": [
      "has a role in what happens",
      "is not involved at all",
      "stops the process completely"
    ],
    "answer": 0
  },
  {
    "prompt": "To “reduce performance” means to...",
    "options": [
      "make performance worse",
      "make performance perfect",
      "measure performance"
    ],
    "answer": 0
  },
  {
    "prompt": "Research that has “produced mixed results” has...",
    "options": [
      "given different or inconsistent findings",
      "given exactly the same finding every time",
      "not produced any findings"
    ],
    "answer": 0
  },
  {
    "prompt": "Starting “at a manageable level” means starting...",
    "options": [
      "at a level you can reasonably handle",
      "at the hardest possible level",
      "without any preparation"
    ],
    "answer": 0
  },
  {
    "prompt": "To “gradually build up” activity means to...",
    "options": [
      "increase it little by little",
      "increase it all at once",
      "stop it completely"
    ],
    "answer": 0
  },
  {
    "prompt": "If fatigue is “in proportion to” the exercise, it is...",
    "options": [
      "reasonable compared with the amount of exercise",
      "far greater than expected",
      "completely unrelated to exercise"
    ],
    "answer": 0
  },
  {
    "prompt": "“Doesn’t necessarily mean” is used when something...",
    "options": [
      "is not always true",
      "is definitely true",
      "can never happen"
    ],
    "answer": 0
  },
  {
    "prompt": "If a problem “comes with symptoms such as” chest pain, it...",
    "options": [
      "appears together with signs like chest pain",
      "always disappears immediately",
      "only affects the legs"
    ],
    "answer": 0
  }
];

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

function findArticleExample(key){
  const item=vocab[key];
  if(!item||!activeArticle)return null;
  const needle=String(item.term||'').toLowerCase();
  for(const section of activeArticle.sections||[]){
    for(const paragraph of section.paragraphs||[]){
      for(const sentence of paragraph||[]){
        if(String(sentence.text||'').toLowerCase().includes(needle)){
          return [sentence.text,sentence.uz||''];
        }
      }
    }
  }
  return null;
}

function vocabExampleHtml(example){
  if(!example||!example[0])return '';
  return '<span class="vocab-example"><span class="vocab-example-en">'+esc(example[0])+'</span><span class="vocab-example-uz">'+esc(example[1]||'')+'</span></span>';
}

function preferredEnglishVoice(locale){
  if(!('speechSynthesis' in window))return null;
  const voices=window.speechSynthesis.getVoices();
  const target=locale.toLowerCase();
  return voices.find(v=>String(v.lang||'').toLowerCase()===target)||
    voices.find(v=>String(v.lang||'').toLowerCase().replace('_','-')===target)||
    voices.find(v=>String(v.lang||'').toLowerCase().startsWith(target))||
    null;
}

function speakVocab(key,accent){
  const item=vocab[key];
  if(!item||!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined')return;
  cancelArticleAudio();
  const locale=accent==='gb'?'en-GB':'en-US';
  const utterance=new SpeechSynthesisUtterance(item.term);
  utterance.lang=locale;
  const voice=preferredEnglishVoice(locale);
  if(voice)utterance.voice=voice;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function wordHtml(key,displayText){
  const item=vocab[key];
  const detail=vocabDetails[key]||{ex:['',''],syn:[]};
  const text=displayText||item.term;
  const cls=item.level==='B1'?'b1':'b2';
  const examples=[
    vocabExampleHtml(detail.ex),
    vocabExampleHtml(vocabExtraExamples[key])
  ].filter(Boolean).join('');
  const synonyms=(strictSynonyms[key]||[]).slice(0,2);
  const synonymHtml=synonyms.length?'<span class="vocab-synonyms"><b>Synonyms</b><span class="vocab-synonym-list">'+synonyms.map(s=>'<span class="vocab-synonym">'+esc(s)+'</span>').join('')+'</span></span>':'';
  return '<span class="vocab-word '+cls+'" role="button" tabindex="0" data-vocab="'+esc(key)+'" aria-expanded="false">'+
    esc(text)+
    '<span class="vocab-popover" aria-hidden="true">'+
      '<span class="vocab-card-head"><small>'+esc(item.level)+'</small><strong>'+esc(item.term)+'</strong></span>'+
      '<span class="vocab-meaning"><b>Uzbek</b><em>'+esc(item.uz)+'</em></span>'+
      '<span class="vocab-pronunciation" aria-label="Pronunciation">'+
        '<button class="vocab-audio" type="button" data-accent="gb" data-vocab="'+esc(key)+'" aria-label="Hear British pronunciation">🇬🇧 <span>British</span> 🔊</button>'+
        '<button class="vocab-audio" type="button" data-accent="us" data-vocab="'+esc(key)+'" aria-label="Hear American pronunciation">🇺🇸 <span>American</span> 🔊</button>'+
      '</span>'+
      '<span class="vocab-examples"><b>Examples</b>'+examples+'</span>'+
      synonymHtml+
    '</span>'+
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

const readingHighlightColors=['red','blue','yellow','green'];

function highlighterHtml(){
  return '<div class="reading-highlighter" id="reading-highlighter" aria-label="Text highlighting">'+
    '<div class="highlight-controls" role="group" aria-label="Choose a highlighter colour">'+
      '<strong>Highlight</strong>'+
      readingHighlightColors.map(color=>'<button class="highlight-color" type="button" data-highlight="'+color+'" aria-label="Use '+color+' highlighter" aria-pressed="false"><span class="highlight-swatch highlight-'+color+'" aria-hidden="true"></span>'+color[0].toUpperCase()+color.slice(1)+'</button>').join('')+
      '<button class="highlight-remove" type="button" data-highlight="remove" aria-label="Use highlight eraser" aria-pressed="false">Remove</button>'+
    '</div>'+
    '<p class="highlight-help">Choose a colour first, then select text. That colour stays active so you can highlight as many parts as you want. Choose another colour to switch, or tap the active tool again to turn it off.</p>'+
    '<p class="highlight-status" id="highlight-status" role="status" aria-live="polite">Choose a colour to start highlighting. Highlights are saved on this device.</p>'+
  '</div>';
}

function bindReadingHighlighter(root,data,signal){
  const copy=root.querySelector('#article-copy');
  const toolbar=root.querySelector('#reading-highlighter');
  const status=root.querySelector('#highlight-status');
  const buttons=[...toolbar.querySelectorAll('[data-highlight]')];
  const sentences=[...copy.querySelectorAll('.article-sentence')];
  const key='vision-reading-highlights:v1:'+encodeURIComponent(readingStudentId(data))+':'+activeArticle.id;
  let selected=[];
  let activeTool=null;

  // Vocabulary popovers contain extra text; never count it as part of the article.
  function textNodes(sentence){
    const walker=document.createTreeWalker(sentence,NodeFilter.SHOW_TEXT,{
      acceptNode:node=>node.parentElement.closest('.vocab-popover')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT
    });
    const nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    return nodes;
  }

  const originals=sentences.map(sentence=>textNodes(sentence).map(node=>node.data).join(''));
  let highlights=[];
  try{
    const saved=JSON.parse(localStorage.getItem(key)||'[]');
    if(Array.isArray(saved))highlights=saved.filter(item=>item&&
      Number.isInteger(item.sentence)&&typeof originals[item.sentence]==='string'&&
      item.text===originals[item.sentence]&&readingHighlightColors.includes(item.color)&&
      Number.isInteger(item.start)&&Number.isInteger(item.end)&&
      item.start>=0&&item.end>item.start&&item.end<=item.text.length
    ).sort((a,b)=>a.sentence-b.sentence||a.start-b.start).reduce((valid,item)=>{
      const last=valid[valid.length-1];
      if(!last||item.sentence!==last.sentence||item.start>=last.end)valid.push(item);
      return valid;
    },[]);
  }catch{}

  function paint(){
    sentences.forEach((sentence,index)=>{
      sentence.querySelectorAll('mark.reading-highlight').forEach(mark=>mark.replaceWith(...mark.childNodes));
      sentence.normalize();
      const ranges=highlights.filter(item=>item.sentence===index);
      let offset=0;
      textNodes(sentence).forEach(node=>{
        const text=node.data;
        const start=offset;
        offset+=text.length;
        const matches=ranges.filter(item=>item.start<offset&&item.end>start);
        if(!matches.length)return;
        const fragment=document.createDocumentFragment();
        let cursor=0;
        matches.forEach(item=>{
          const from=Math.max(0,item.start-start);
          const to=Math.min(text.length,item.end-start);
          fragment.append(document.createTextNode(text.slice(cursor,from)));
          const mark=document.createElement('mark');
          mark.className='reading-highlight highlight-'+item.color;
          mark.dataset.highlightColor=item.color;
          mark.textContent=text.slice(from,to);
          fragment.append(mark);
          cursor=to;
        });
        fragment.append(document.createTextNode(text.slice(cursor)));
        node.replaceWith(fragment);
      });
    });
  }

  function readSelection(){
    const selection=window.getSelection();
    if(!selection||selection.isCollapsed||!selection.rangeCount)return [];
    const range=selection.getRangeAt(0);
    if(!copy.contains(range.startContainer)||!copy.contains(range.endContainer))return [];
    const parts=[];
    sentences.forEach((sentence,index)=>{
      let offset=0,from=null,to=null;
      textNodes(sentence).forEach(node=>{
        const length=node.data.length;
        if(length&&range.intersectsNode(node)){
          const start=range.startContainer===node?range.startOffset:0;
          const end=range.endContainer===node?range.endOffset:length;
          if(end>start){
            if(from===null)from=offset+start;
            to=offset+end;
          }
        }
        offset+=length;
      });
      if(from!==null&&originals[index].slice(from,to).trim()){
        parts.push({sentence:index,text:originals[index],start:from,end:to});
      }
    });
    return parts;
  }

  function captureSelection(){
    if(!copy.isConnected)return;
    const parts=readSelection();
    if(parts.length){
      selected=parts;
      copy.querySelectorAll('.vocab-word.open').forEach(word=>word.classList.remove('open'));
    }else{
      selected=[];
    }
  }

  function changeRange(part,color){
    const next=[];
    highlights.forEach(item=>{
      if(item.sentence!==part.sentence||item.end<=part.start||item.start>=part.end){next.push(item);return;}
      if(item.start<part.start)next.push({...item,end:part.start});
      if(item.end>part.end)next.push({...item,start:part.end});
    });
    if(color!=='remove')next.push({...part,color});
    highlights=next.sort((a,b)=>a.sentence-b.sentence||a.start-b.start).reduce((merged,item)=>{
      const last=merged[merged.length-1];
      if(last&&last.sentence===item.sentence&&last.color===item.color&&last.end===item.start)last.end=item.end;
      else merged.push(item);
      return merged;
    },[]);
  }

  function persist(){
    try{
      if(highlights.length)localStorage.setItem(key,JSON.stringify(highlights));
      else localStorage.removeItem(key);
      return true;
    }catch{
      status.textContent='Your changes are visible, but this browser could not save them.';
      return false;
    }
  }

  function updateToolState(){
    buttons.forEach(button=>{
      const isActive=button.dataset.highlight===activeTool;
      button.classList.toggle('active',isActive);
      button.setAttribute('aria-pressed',isActive?'true':'false');
    });
  }

  function toolName(tool){
    return tool==='remove'?'Eraser':tool[0].toUpperCase()+tool.slice(1)+' highlighter';
  }

  function applyActiveSelection(){
    if(!activeTool)return;
    captureSelection();
    if(!selected.length)return;
    const tool=activeTool;
    selected.forEach(part=>changeRange(part,tool));
    paint();
    window.getSelection()?.removeAllRanges();
    selected=[];
    if(persist()){
      status.textContent=tool==='remove'
        ?'Highlight removed. Eraser is still active.'
        :tool[0].toUpperCase()+tool.slice(1)+' highlight saved. '+tool[0].toUpperCase()+tool.slice(1)+' is still active.';
    }
  }

  toolbar.addEventListener('click',event=>{
    const button=event.target.closest('[data-highlight]');
    if(!button)return;
    const tool=button.dataset.highlight;
    activeTool=activeTool===tool?null:tool;
    updateToolState();
    if(activeTool){
      status.textContent=toolName(activeTool)+' is active. Select as many parts of the text as you want.';
    }else{
      status.textContent='Highlighter is off. Choose a colour whenever you want to continue.';
    }
  },{signal});

  copy.addEventListener('pointerup',()=>{
    if(!activeTool)return;
    // Let the browser finish its native text selection first, including touch handles.
    setTimeout(applyActiveSelection,0);
  },{signal});

  copy.addEventListener('keyup',event=>{
    if(!activeTool)return;
    if(event.key==='Shift'||event.shiftKey)setTimeout(applyActiveSelection,0);
  },{signal});

  document.addEventListener('keydown',event=>{
    if(event.key!=='Escape')return;
    selected=[];
    window.getSelection()?.removeAllRanges();
  },{signal});

  paint();
  updateToolState();
  return {hasSelection:()=>selected.length>0||readSelection().length>0};
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
    const isUnlocked=index===0||Array.from({length:index},(_,i)=>i).every(i=>completed.has(i));
    return '<button class="reading-list-row'+(isDone?' completed':'')+(isUnlocked?'':' locked')+'" data-article-index="'+index+'" type="button" '+(isUnlocked?'':'disabled aria-disabled="true"')+'>'+
      '<strong class="reading-list-label">Article '+(index+1)+'</strong>'+
      '<div class="reading-list-status'+(isDone?' done':isUnlocked?'':' locked')+'">'+(isDone?'✓':isUnlocked?'→':'🔒')+'</div>'+
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
function articleSpeechSegments(article){
  if(!article)return [];
  const segments=[];
  if(article.title)segments.push(article.title);
  (article.sections||[]).forEach(section=>{
    if(section.heading)segments.push(section.heading);
    (section.paragraphs||[]).forEach(paragraph=>{
      paragraph.forEach(sentence=>{
        if(sentence&&sentence.text)segments.push(sentence.text);
      });
    });
  });
  return segments;
}

function estimateSpeechSegmentSeconds(text){
  const words=String(text||'').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1.4,words/2.35+.22);
}

function articleAudioTimeline(article){
  let cursor=0;
  return articleSpeechSegments(article).map((text,index)=>{
    const duration=estimateSpeechSegmentSeconds(text);
    const item={text,index,start:cursor,end:cursor+duration,duration};
    cursor+=duration;
    return item;
  });
}

function articleAudioDurationSeconds(article){
  const timeline=articleAudioTimeline(article);
  return timeline.length?timeline[timeline.length-1].end:0;
}

function formatAudioTime(value){
  const seconds=Math.max(0,Math.round(Number(value)||0));
  const mins=Math.floor(seconds/60);
  const secs=seconds%60;
  return mins+':'+String(secs).padStart(2,'0');
}

function getActiveExerciseQuestions(){
  return Array.isArray(activeArticle?.exerciseQuestions)&&activeArticle.exerciseQuestions.length?activeArticle.exerciseQuestions:exerciseQuestions;
}

function getArticleVocabCount(article){
  if(!article)return 0;
  const text=(article.sections||[]).flatMap(section=>(section.paragraphs||[]).flatMap(paragraph=>paragraph.map(sentence=>sentence.text||''))).join(' ').toLowerCase();
  return vocabEntries.reduce((count,[,item])=>count+(text.includes(item.term.toLowerCase())?1:0),0);
}

function exercisesHtml(){
  return getActiveExerciseQuestions().map((q,i)=>
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
      '<button class="back-to-reading article-return-button" id="back-to-reading" type="button" aria-label="Back to Reading library"><span class="return-arrow">←</span><span>Back to Reading</span></button>'+
      '<article class="reading-article-shell" id="reading-article-shell">'+
        '<div class="article-topbar">'+
          '<div><span class="article-kicker">'+esc(activeArticle.kicker)+'</span><h1>'+esc(activeArticle.title)+'</h1><div class="article-byline">'+esc(activeArticle.byline||'')+'</div><div class="article-meta"><span>'+esc(activeArticle.level)+'</span><span>'+esc(activeArticle.minutes)+'</span><span>'+getArticleVocabCount(activeArticle)+' key items</span></div></div>'+
          '<button class="translation-toggle" id="translation-toggle" type="button" aria-pressed="false"><span class="toggle-track"><i></i></span><span><b>Translation mode</b><small id="translation-mode-label">Off</small></span></button>'+
        '</div>'+
        '<section class="article-audio-panel" id="article-audio-panel" aria-label="Article audio">'+
          '<div class="article-audio-heading">'+
            '<div><span class="article-audio-eyebrow">LISTEN WHILE YOU READ</span><strong>Full article audio</strong><small>Choose an accent and voice, change speed, or jump to any point in the article.</small></div>'+
          '</div>'+
          '<div class="article-player-list">'+
            '<div class="article-player-row" data-audio-player="gb">'+
              '<button class="article-player-play" type="button" data-article-accent="gb" aria-label="Play British English article"><span>▶</span></button>'+
              '<div class="article-player-accent"><span class="article-player-flag">🇬🇧</span><span><strong>British English</strong><small>Full article</small></span></div>'+
              '<div class="article-player-track">'+
                '<input class="article-audio-seek" data-article-seek="gb" type="range" min="0" max="'+Math.max(1,Math.round(articleAudioDurationSeconds(activeArticle)))+'" step="1" value="0" aria-label="British article playback position">'+
                '<div class="article-player-time"><span data-current-time="gb">0:00</span><span data-total-time="gb">'+formatAudioTime(articleAudioDurationSeconds(activeArticle))+'</span></div>'+
                '<div class="article-player-tools">'+
                  '<button class="article-skip-button" type="button" data-skip-accent="gb" data-skip="-10" aria-label="Go back 10 seconds">↶ 10s</button>'+
                  '<div class="article-gender-control" role="group" aria-label="British voice gender"><span>Voice</span><div class="article-gender-options"><button type="button" data-gender-accent="gb" data-gender="female" class="active" aria-pressed="true">Female</button><button type="button" data-gender-accent="gb" data-gender="male" aria-pressed="false">Male</button></div></div>'+
                  '<label class="article-tool-select article-speed-select"><span>Speed</span><select data-rate-select="gb" aria-label="British playback speed"><option value="0.8">0.8×</option><option value="0.95" selected>0.95×</option><option value="1">1.0×</option><option value="1.15">1.15×</option><option value="1.3">1.3×</option></select></label>'+
                  '<button class="article-skip-button" type="button" data-skip-accent="gb" data-skip="10" aria-label="Go forward 10 seconds">10s ↷</button>'+
                '</div>'+
              '</div>'+
            '</div>'+
            '<div class="article-player-row" data-audio-player="us">'+
              '<button class="article-player-play" type="button" data-article-accent="us" aria-label="Play American English article"><span>▶</span></button>'+
              '<div class="article-player-accent"><span class="article-player-flag">🇺🇸</span><span><strong>American English</strong><small>Full article</small></span></div>'+
              '<div class="article-player-track">'+
                '<input class="article-audio-seek" data-article-seek="us" type="range" min="0" max="'+Math.max(1,Math.round(articleAudioDurationSeconds(activeArticle)))+'" step="1" value="0" aria-label="American article playback position">'+
                '<div class="article-player-time"><span data-current-time="us">0:00</span><span data-total-time="us">'+formatAudioTime(articleAudioDurationSeconds(activeArticle))+'</span></div>'+
                '<div class="article-player-tools">'+
                  '<button class="article-skip-button" type="button" data-skip-accent="us" data-skip="-10" aria-label="Go back 10 seconds">↶ 10s</button>'+
                  '<div class="article-gender-control" role="group" aria-label="American voice gender"><span>Voice</span><div class="article-gender-options"><button type="button" data-gender-accent="us" data-gender="female" class="active" aria-pressed="true">Female</button><button type="button" data-gender-accent="us" data-gender="male" aria-pressed="false">Male</button></div></div>'+
                  '<label class="article-tool-select article-speed-select"><span>Speed</span><select data-rate-select="us" aria-label="American playback speed"><option value="0.8">0.8×</option><option value="0.95" selected>0.95×</option><option value="1">1.0×</option><option value="1.15">1.15×</option><option value="1.3">1.3×</option></select></label>'+
                  '<button class="article-skip-button" type="button" data-skip-accent="us" data-skip="10" aria-label="Go forward 10 seconds">10s ↷</button>'+
                '</div>'+
              '</div>'+
            '</div>'+
          '</div>'+
        '</section>'+
        '<div class="article-guide"><span class="guide-dot b1"></span><b>B1 useful English</b><span class="guide-dot b2"></span><b>B2–C1 vocabulary</b><p>Tap a bold word for its Uzbek meaning, examples, similar words, and British or American pronunciation. Turn on Translation Mode to translate full sentences.</p></div>'+
        highlighterHtml()+
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
  if(dash)dash.onclick=()=>{cleanupArticle();callbacks.onDashboard&&callbacks.onDashboard();};
  if(refresh)refresh.onclick=()=>callbacks.onRefresh&&callbacks.onRefresh();
  if(signout)signout.onclick=()=>{cleanupArticle();callbacks.onSignOut&&callbacks.onSignOut();};
}

function renderHome(root,data,callbacks){
  cleanupArticle();
  root.innerHTML=practiceHomeHtml(data);
  bindHeader(root,callbacks);
  root.querySelector('#open-reading-library').onclick=()=>renderLibrary(root,data,callbacks);
  root.querySelector('#open-listening-library').onclick=()=>renderListening(root,data,callbacks);
}

function renderLibrary(root,data,callbacks){
  cleanupArticle();
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
  cleanupArticle();
  root.innerHTML=listeningHtml(data);
  bindHeader(root,callbacks);
  root.querySelector('#back-to-practice').onclick=()=>renderHome(root,data,callbacks);
}

function renderArticle(root,data,callbacks){
  cleanupArticle();
  if(!activeArticle){renderLibrary(root,data,callbacks);return;}
  root.innerHTML=articleHtml();
  bindHeader(root,callbacks);
  root.querySelector('#back-to-reading').onclick=()=>renderLibrary(root,data,callbacks);

  const shell=root.querySelector('#reading-article-shell');
  const toggle=root.querySelector('#translation-toggle');
  const label=root.querySelector('#translation-mode-label');
  const articleEvents=new AbortController();
  const highlighter=bindReadingHighlighter(root,data,articleEvents.signal);

  const articleAudioButtons=[...root.querySelectorAll('.article-player-play')];
  const articleAudioTimelineData=articleAudioTimeline(activeArticle);
  const articleAudioTotal=articleAudioTimelineData.length?articleAudioTimelineData[articleAudioTimelineData.length-1].end:0;
  const audioPlayers={
    gb:{position:0,playing:false,paused:false,gender:'female',rate:.95},
    us:{position:0,playing:false,paused:false,gender:'female',rate:.95}
  };
  let activeAudioAccent=null;
  let audioRun=0;
  let progressTimer=null;
  let timerStartedAt=0;
  let timerStartPosition=0;

  function playerEls(accent){
    const row=root.querySelector('[data-audio-player="'+accent+'"]');
    return {
      row,
      button:root.querySelector('.article-player-play[data-article-accent="'+accent+'"]'),
      icon:root.querySelector('.article-player-play[data-article-accent="'+accent+'"] span'),
      seek:root.querySelector('[data-article-seek="'+accent+'"]'),
      current:root.querySelector('[data-current-time="'+accent+'"]')
    };
  }

  function syncPlayerUi(accent){
    const state=audioPlayers[accent];
    const els=playerEls(accent);
    if(!state||!els.row)return;
    const max=Math.max(1,articleAudioTotal);
    const clamped=Math.max(0,Math.min(max,state.position));
    const percent=Math.max(0,Math.min(100,(clamped/max)*100));
    els.row.classList.toggle('playing',state.playing&&!state.paused);
    els.row.classList.toggle('paused',state.paused);
    if(els.button){
      els.button.setAttribute('aria-label',(state.playing&&!state.paused?'Pause ':'Play ')+(accent==='gb'?'British':'American')+' English article');
      els.button.setAttribute('aria-pressed',String(state.playing&&!state.paused));
    }
    if(els.icon)els.icon.textContent=state.playing&&!state.paused?'Ⅱ':'▶';
    if(els.seek){
      els.seek.value=String(Math.round(clamped));
      els.seek.style.setProperty('--audio-progress',percent+'%');
    }
    if(els.current)els.current.textContent=formatAudioTime(clamped);
  }

  function syncAllPlayerUi(){
    syncPlayerUi('gb');
    syncPlayerUi('us');
  }

  function clearProgressTimer(){
    if(progressTimer){
      clearInterval(progressTimer);
      progressTimer=null;
    }
  }

  function startProgressTimer(accent){
    clearProgressTimer();
    timerStartedAt=performance.now();
    timerStartPosition=audioPlayers[accent].position;
    progressTimer=setInterval(()=>{
      const state=audioPlayers[accent];
      if(!state||!state.playing||state.paused||activeAudioAccent!==accent)return;
      const elapsed=(performance.now()-timerStartedAt)/1000;
      const speedFactor=(state.rate||.95)/.95;
      state.position=Math.min(articleAudioTotal,timerStartPosition+elapsed*speedFactor);
      syncPlayerUi(accent);
    },200);
  }

  function setOtherPlayersInactive(exceptAccent){
    ['gb','us'].forEach(accent=>{
      if(accent===exceptAccent)return;
      audioPlayers[accent].playing=false;
      audioPlayers[accent].paused=false;
      syncPlayerUi(accent);
    });
  }

  function locateArticlePosition(seconds){
    const target=Math.max(0,Math.min(articleAudioTotal,Number(seconds)||0));
    if(!articleAudioTimelineData.length)return null;
    let segment=articleAudioTimelineData.find(item=>target<item.end);
    if(!segment)segment=articleAudioTimelineData[articleAudioTimelineData.length-1];
    const fraction=segment.duration?Math.max(0,Math.min(1,(target-segment.start)/segment.duration)):0;
    const rawIndex=Math.floor(segment.text.length*fraction);
    const before=segment.text.slice(0,rawIndex);
    const lastSpace=before.lastIndexOf(' ');
    const charIndex=rawIndex>0?(lastSpace>=0?lastSpace+1:rawIndex):0;
    return {segment,charIndex,target};
  }

  function haltArticleSpeech({preservePosition=true,markPaused=false}={}){
    audioRun++;
    clearProgressTimer();
    if('speechSynthesis' in window)window.speechSynthesis.cancel();
    if(activeAudioAccent){
      const state=audioPlayers[activeAudioAccent];
      if(state){
        if(!preservePosition)state.position=0;
        state.playing=false;
        state.paused=markPaused;
        syncPlayerUi(activeAudioAccent);
      }
    }
    activeAudioAccent=null;
  }

  function speakArticleFrom(accent,position){
    if(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined')return;
    const located=locateArticlePosition(position);
    if(!located){
      audioPlayers[accent].playing=false;
      audioPlayers[accent].paused=false;
      syncPlayerUi(accent);
      return;
    }

    const state=audioPlayers[accent];
    state.position=located.target;
    state.playing=true;
    state.paused=false;
    activeAudioAccent=accent;
    setOtherPlayersInactive(accent);
    const runId=++audioRun;

    function speakSegment(segmentIndex,startChar){
      if(runId!==audioRun||activeAudioAccent!==accent||!state.playing||state.paused)return;
      if(segmentIndex>=articleAudioTimelineData.length){
        clearProgressTimer();
        state.position=articleAudioTotal;
        state.playing=false;
        state.paused=false;
        activeAudioAccent=null;
        syncPlayerUi(accent);
        return;
      }

      const segment=articleAudioTimelineData[segmentIndex];
      const source=segment.text;
      const charStart=Math.max(0,Math.min(source.length,startChar||0));
      const spoken=source.slice(charStart).trimStart();
      const leadingTrim=source.slice(charStart).length-spoken.length;
      const effectiveStart=charStart+leadingTrim;
      if(!spoken){
        speakSegment(segmentIndex+1,0);
        return;
      }

      const charFraction=source.length?effectiveStart/source.length:0;
      state.position=segment.start+segment.duration*charFraction;
      syncPlayerUi(accent);
      startProgressTimer(accent);

      const locale=accent==='gb'?'en-GB':'en-US';
      const utterance=new SpeechSynthesisUtterance(spoken);
      utterance.lang=locale;
      const voice=voiceForGender(accent,state.gender)||preferredEnglishVoice(locale);
      if(voice)utterance.voice=voice;
      utterance.rate=state.rate||.95;

      utterance.onboundary=event=>{
        if(runId!==audioRun||activeAudioAccent!==accent||state.paused)return;
        if(typeof event.charIndex==='number'&&source.length){
          const absoluteChar=Math.min(source.length,effectiveStart+event.charIndex);
          state.position=segment.start+segment.duration*(absoluteChar/source.length);
          timerStartedAt=performance.now();
          timerStartPosition=state.position;
          syncPlayerUi(accent);
        }
      };

      utterance.onend=()=>{
        if(runId!==audioRun||activeAudioAccent!==accent||state.paused)return;
        state.position=segment.end;
        syncPlayerUi(accent);
        speakSegment(segmentIndex+1,0);
      };

      utterance.onerror=event=>{
        if(runId!==audioRun)return;
        if(event.error==='interrupted'||event.error==='canceled')return;
        clearProgressTimer();
        state.playing=false;
        state.paused=false;
        activeAudioAccent=null;
        syncPlayerUi(accent);
      };

      window.speechSynthesis.speak(utterance);
    }

    speakSegment(located.segment.index,located.charIndex);
  }

  function toggleArticlePlayer(accent){
    if(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined')return;
    const state=audioPlayers[accent];

    if(activeAudioAccent===accent&&state.playing&&!state.paused){
      window.speechSynthesis.pause();
      clearProgressTimer();
      state.paused=true;
      syncPlayerUi(accent);
      return;
    }

    if(activeAudioAccent===accent&&state.paused){
      window.speechSynthesis.resume();
      state.paused=false;
      state.playing=true;
      startProgressTimer(accent);
      syncPlayerUi(accent);
      return;
    }

    haltArticleSpeech({preservePosition:true,markPaused:false});
    speakArticleFrom(accent,state.position>=articleAudioTotal-.5?0:state.position);
  }

  articleAudioButtons.forEach(button=>{
    button.addEventListener('click',()=>toggleArticlePlayer(button.dataset.articleAccent),{signal:articleEvents.signal});
  });

  root.querySelectorAll('.article-audio-seek').forEach(seek=>{
    const accent=seek.dataset.articleSeek;
    const state=audioPlayers[accent];
    let resumeAfterSeek=false;
    let seeking=false;

    function beginSeeking(){
      if(seeking)return;
      seeking=true;
      resumeAfterSeek=activeAudioAccent===accent&&state.playing&&!state.paused;

      haltArticleSpeech({preservePosition:true,markPaused:true});
      state.playing=false;
      state.paused=true;
      syncPlayerUi(accent);
    }

    // Pointer events already cover mouse, touch and pen on modern browsers.
    // Using mousedown/touchstart as well caused duplicate seek cycles.
    seek.addEventListener('pointerdown',beginSeeking,{signal:articleEvents.signal});

    seek.addEventListener('input',()=>{
      // Keyboard seeking may fire input without pointerdown.
      if(!seeking)beginSeeking();

      const target=Math.max(0,Math.min(articleAudioTotal,Number(seek.value)||0));
      state.position=target;
      state.playing=false;
      state.paused=true;
      syncPlayerUi(accent);
    },{signal:articleEvents.signal});

    function finishSeeking(){
      if(!seeking)return;

      const target=Math.max(0,Math.min(articleAudioTotal,Number(seek.value)||0));
      const shouldResume=resumeAfterSeek;

      // The current speech was already cancelled when seeking began.
      // Do not cancel again here after playback has restarted.
      state.position=target;
      state.playing=false;
      state.paused=true;

      seeking=false;
      resumeAfterSeek=false;
      syncPlayerUi(accent);

      if(shouldResume){
        state.paused=false;
        speakArticleFrom(accent,target);
      }
    }

    // Range inputs emit change once the user releases the knob / finishes the click.
    seek.addEventListener('change',finishSeeking,{signal:articleEvents.signal});
  });

  function inferredVoiceGender(voice){
    const name=String(voice?.name||'').toLowerCase();
    const femaleHints=['female','woman','zira','jenny','aria','samantha','victoria','karen','moira','tessa','veena','susan','hazel','sonia','kate','serena','ava','allison','salli','joanna','kendra','kimberly'];
    const maleHints=['male','man','david','mark','guy','alex','daniel','george','ryan','fred','tom','aaron','matthew','joey','justin','brian','arthur'];
    if(femaleHints.some(h=>name.includes(h)))return 'female';
    if(maleHints.some(h=>name.includes(h)))return 'male';
    return '';
  }

  function voiceForGender(accent,gender){
    const voices=voicesForAccent(accent);
    const exact=voices.find(v=>inferredVoiceGender(v)===gender);
    if(exact)return exact;
    if(gender==='female')return voices[0]||null;
    return voices[1]||voices[0]||null;
  }

  function voicesForAccent(accent){
    if(!('speechSynthesis' in window))return [];
    const locale=(accent==='gb'?'en-GB':'en-US').toLowerCase();
    const regional=window.speechSynthesis.getVoices().filter(v=>{
      const lang=String(v.lang||'').toLowerCase().replace('_','-');
      return lang===locale||lang.startsWith(locale);
    });
    const seen=new Set();
    return regional.filter(v=>{
      const key=v.voiceURI||v.name;
      if(seen.has(key))return false;
      seen.add(key);
      return true;
    });
  }

  root.querySelectorAll('[data-gender-accent]').forEach(button=>{
    button.addEventListener('click',()=>{
      const accent=button.dataset.genderAccent;
      const gender=button.dataset.gender;
      const state=audioPlayers[accent];
      if(!state||!['female','male'].includes(gender))return;

      const wasPlaying=activeAudioAccent===accent&&state.playing&&!state.paused;
      const wasPaused=activeAudioAccent===accent&&state.paused;
      const position=state.position;
      state.gender=gender;

      root.querySelectorAll('[data-gender-accent="'+accent+'"]').forEach(choice=>{
        const selected=choice.dataset.gender===gender;
        choice.classList.toggle('active',selected);
        choice.setAttribute('aria-pressed',String(selected));
      });

      if(wasPlaying){
        haltArticleSpeech({preservePosition:true,markPaused:false});
        state.position=position;
        speakArticleFrom(accent,position);
      }else if(wasPaused){
        haltArticleSpeech({preservePosition:true,markPaused:false});
        state.position=position;
        state.paused=true;
        syncPlayerUi(accent);
      }
    },{signal:articleEvents.signal});
  });

  root.querySelectorAll('[data-rate-select]').forEach(select=>{
    select.addEventListener('change',()=>{
      const accent=select.dataset.rateSelect;
      const state=audioPlayers[accent];
      const nextRate=Math.max(.7,Math.min(1.5,Number(select.value)||.95));
      const wasPlaying=activeAudioAccent===accent&&state.playing&&!state.paused;
      const wasPaused=activeAudioAccent===accent&&state.paused;
      const position=state.position;
      state.rate=nextRate;
      if(wasPlaying){
        haltArticleSpeech({preservePosition:true,markPaused:false});
        state.position=position;
        speakArticleFrom(accent,position);
      }else if(wasPaused){
        haltArticleSpeech({preservePosition:true,markPaused:false});
        state.position=position;
        state.paused=true;
        syncPlayerUi(accent);
      }
    },{signal:articleEvents.signal});
  });

  root.querySelectorAll('[data-skip-accent]').forEach(button=>{
    button.addEventListener('click',()=>{
      const accent=button.dataset.skipAccent;
      const state=audioPlayers[accent];
      const delta=Number(button.dataset.skip)||0;
      const target=Math.max(0,Math.min(articleAudioTotal,state.position+delta));
      const shouldResume=activeAudioAccent===accent&&state.playing&&!state.paused;

      haltArticleSpeech({preservePosition:true,markPaused:true});
      state.position=target;
      state.playing=false;
      state.paused=true;
      syncPlayerUi(accent);

      if(shouldResume){
        state.paused=false;
        speakArticleFrom(accent,target);
      }
    },{signal:articleEvents.signal});
  });

  syncAllPlayerUi();

  cancelArticleAudio=()=>{
    haltArticleSpeech({preservePosition:true,markPaused:true});
  };
  disposeArticle=()=>{
    haltArticleSpeech({preservePosition:true,markPaused:false});
    articleEvents.abort();
  };

  function closeWords(except){
    root.querySelectorAll('.vocab-word.open').forEach(el=>{
      if(el===except)return;
      el.classList.remove('open');
      el.setAttribute('aria-expanded','false');
      const popover=el.querySelector('.vocab-popover');
      if(popover)popover.setAttribute('aria-hidden','true');
    });
  }

  root.querySelector('#article-copy').addEventListener('click',e=>{
    const audio=e.target.closest('.vocab-audio');
    if(audio){
      e.preventDefault();
      e.stopPropagation();
      speakVocab(audio.dataset.vocab,audio.dataset.accent);
      return;
    }
    if(e.target.closest('.vocab-popover')){
      e.stopPropagation();
      return;
    }
    if(highlighter.hasSelection())return;
    const word=e.target.closest('.vocab-word');
    if(word){
      e.stopPropagation();
      const wasOpen=word.classList.contains('open');
      closeWords(word);
      const shouldOpen=!wasOpen;
      word.classList.toggle('open',shouldOpen);
      word.setAttribute('aria-expanded',String(shouldOpen));
      const popover=word.querySelector('.vocab-popover');
      if(popover)popover.setAttribute('aria-hidden',String(!shouldOpen));
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
    if(!e.target.closest('.vocab-word'))closeWords();
  },{signal:articleEvents.signal});

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
    const total=getActiveExerciseQuestions().length;
    score.textContent=correct+' / '+total+' correct';
    score.className='exercise-score '+(correct===total?'excellent':correct>=Math.ceil(total*.75)?'good':'keep-going');
    if(answered<total){
      score.textContent=correct+' / '+total+' correct · '+(total-answered)+' unanswered';
    }else if(correct===total){
      markArticleCompleted(data,activeArticleIndex);
      score.textContent='Perfect · '+correct+' / '+total+' · Article completed';
    }else{
      score.textContent=correct+' / '+total+' correct · Fix the incorrect answers to unlock the next article';
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

window.VisionStudentPractice={render,destroy:cleanupArticle};
})();
