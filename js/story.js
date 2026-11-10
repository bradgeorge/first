/* Story content for THE ROSENBERG FILE.
   Markup inside text: **bold**, {{tap-to-declassify}}, [[permanent redaction]].
   Every section is a list of steps; each step is one sheet tossed onto the desk. */
window.STORY = [
  {
    id: "open", title: "Case File Opened",
    steps: [
      { t: "cover" },
      {
        t: "doc", tone: "white", ref: ["Sing Sing Prison, N.Y.", "June 19, 1953"],
        head: "Two parents. One electric chair.", kicker: "Summary of case",
        img: "couple.jpg", cap: "Julius and Ethel Rosenberg, 1951, separated by a wire screen in a police van.", kb: { o: "50% 30%" },
        body: [
          "On a summer night in 1953, the United States executed **Julius and Ethel Rosenberg**, a married couple from New York City.",
          "They were the only American civilians put to death for spying during the entire Cold War.",
          "How did a quiet couple with two young sons end up here? Open the file and follow the evidence."
        ],
        stamps: [{ txt: "Executed", cls: "", x: "50%", y: "38%", r: -10 }]
      }
    ]
  },

  {
    id: "world", title: "The World Before",
    steps: [
      {
        t: "doc", tone: "yellow", ref: ["Background brief", "1929 – 1939"],
        head: "The Great Depression", kicker: "Context: hard times",
        img: "soupline.jpg", cap: "Unemployed men line up for free soup in Chicago, 1931.", kb: { o: "30% 50%", x: "4%" },
        body: [
          "In 1929 the American economy crashed. Banks failed, factories closed, and about **one in four workers** lost their job.",
          "This decade is called the **Great Depression**. Many young people felt the system had failed them and went looking for a different one."
        ]
      },
      {
        t: "doc", tone: "white", ref: ["Background brief", "Ideas in the air"],
        head: "What is communism?", kicker: "Context: the big idea",
        body: [
          "**Communism** is the idea that workers, not private owners, should control farms and factories, and share what they produce.",
          "In the 1930s it looked hopeful to some struggling Americans. The **Communist Party USA** was legal, and tens of thousands joined.",
          "Its biggest supporter was a country on the other side of the world."
        ],
        stamps: [{ txt: "Background", cls: "blue small", x: "62%", y: "4%", r: 6 }]
      },
      {
        t: "doc", tone: "manila", ref: ["Foreign power", "U.S.S.R."],
        head: "The Soviet Union", kicker: "Who is the other side?",
        img: "stalin.jpg", cap: "Joseph Stalin, dictator of the Soviet Union, 1943.", tall: true, kb: { o: "50% 25%" },
        body: [
          "The **Soviet Union** (also called the **USSR**) was a huge communist country centred on Russia. It stretched from Europe to the Pacific.",
          "It was ruled by **Joseph Stalin**, a dictator who jailed or killed millions of his own people. Many American communists did not know, or did not believe, how brutal he was."
        ]
      }
    ]
  },

  {
    id: "couple", title: "Julius & Ethel",
    steps: [
      {
        t: "stack", head: "Subjects of interest", ref: ["Personal history", "New York City"],
        cards: [
          { img: "orchard.jpg", cap: "Lower East Side, N.Y.", body: "Both grew up poor on Manhattan's crowded **Lower East Side**, children of Jewish immigrant families." },
          { img: "ethel-arrest.jpg", cap: "Ethel Greenglass, b. 1915", body: "Ethel was a gifted singer who once dreamed of the stage. She became a secretary and a union organiser." },
          { img: "julius-arrest.jpg", cap: "Julius Rosenberg, b. 1918", body: "Julius studied electrical engineering at City College and joined the **Young Communist League**." },
          { img: "couple.jpg", cap: "Married June 18, 1939", body: "They met in 1936 at a union event where Ethel sang. They married in 1939 and had two sons, **Michael** (1943) and **Robert** (1947)." }
        ]
      },
      {
        t: "quiz", q: "Julius was a teenager when he met Ethel. How old was he?",
        opts: ["15", "18", "21", "24"], a: 1,
        ex: "He was **18**, and Ethel was 21. Both were already deeply involved in left-wing politics."
      }
    ]
  },

  {
    id: "war", title: "World War II",
    steps: [
      {
        t: "doc", tone: "white", ref: ["Background brief", "1939 – 1945"],
        head: "A world at war", kicker: "Context: World War II",
        img: "yalta.jpg", cap: "Allied leaders Churchill (UK), Roosevelt (USA) and Stalin (USSR) at Yalta, February 1945.", kb: { o: "50% 40%" },
        body: [
          "From 1939 to 1945, **World War II** was fought between the Allies and the Axis: Nazi Germany, Italy and Japan.",
          "In 1941 the United States and the Soviet Union ended up on the **same side**. They were allies, but they never trusted each other."
        ]
      },
      {
        t: "folder", tab: "65-RECRUIT", label: "PERSONNEL\nROSENBERG, Julius\nU.S. Army Signal Corps",
        head: "The engineer", kicker: "Inside the file",
        body: [
          "In 1940 Julius got a job as a civilian engineer for the **U.S. Army Signal Corps**, checking electronics made for the military.",
          "Around **1942**, he was recruited by Soviet intelligence. His code name in Soviet messages was {{ANTENNA}}, later {{LIBERAL}}.",
          "He began building a ring of friends who passed U.S. military secrets to Moscow."
        ],
        stamps: [{ txt: "Secret", cls: "", x: "60%", y: "2%", r: -8 }]
      },
      {
        t: "quiz", q: "Julius's Soviet handler later wrote about their secret meetings. How many times did he say they met?",
        opts: ["About 5", "About 15", "About 50", "Over 200"], a: 2,
        ex: "Handler **Alexander Feklisov** said he met Julius about **50 times** between 1943 and 1946, often after dark in New York."
      },
      {
        t: "package", head: "A Christmas package", ref: ["Item recovered", "Dec. 1944"],
        label: "TO: A. F.\nCONSULATE\nNEW YORK\n— HANDLE WITH CARE —",
        img: "fuse.svg", cap: "Diagram of a proximity fuze inside an artillery shell.",
        body: "According to Feklisov, Julius handed over a working **proximity fuze**: a tiny radio in a shell's nose that explodes it near a plane, no direct hit needed. It was one of America's best-kept secrets of the war."
      }
    ]
  },

  {
    id: "bomb", title: "The Manhattan Project",
    steps: [
      {
        t: "doc", tone: "white", ref: ["Background brief", "1942 – 1945"],
        head: "The Manhattan Project", kicker: "Context: the bomb",
        img: "trinity.jpg", cap: "The Trinity test, the first nuclear explosion. New Mexico, July 16, 1945.", kb: { o: "50% 60%", s: 1.25 },
        body: [
          "The **Manhattan Project** was a top-secret U.S. program to build the first **atomic bomb**, a weapon that could destroy a whole city.",
          "Its main lab was hidden at **Los Alamos**, New Mexico. Over 100,000 people worked on the project, and most never knew what they were building."
        ]
      },
      {
        t: "polaroid", img: "poster.png", cap: "Security poster, Manhattan Project", contain: true,
        head: "Loose lips", body: "Workers were warned again and again to keep quiet. But one of the machinists in Los Alamos had a direct line to Julius Rosenberg."
      },
      {
        t: "doc", tone: "yellow", ref: ["Personnel", "Los Alamos, Aug. 1944"],
        head: "The brother-in-law", kicker: "Subject: GREENGLASS, David",
        img: "greenglass.jpg", cap: "David Greenglass, Ethel's younger brother.", kb: { o: "20% 50%" },
        body: [
          "Ethel's little brother, **David Greenglass**, was an Army sergeant and machinist. In 1944 he was assigned to Los Alamos.",
          "In November 1944 his wife **Ruth** visited him and asked, on Julius's behalf, whether he would pass along secrets. David said yes."
        ],
        stamps: [{ txt: "Los Alamos", cls: "blue small", x: "62%", y: "2%", r: 5 }]
      },
      {
        t: "doc", tone: "white", ref: ["Gov't Exhibit", "Sketch, 1945"],
        head: "The sketches", kicker: "Evidence",
        img: "greenglass-diagram.png", contain: true, tall: true, cap: "Greenglass's re-drawn sketch of an implosion bomb, shown at trial in 1951.",
        body: [
          "Greenglass drew rough sketches of the **implosion lens** molds he worked on, a key part of the bomb's design.",
          "Experts later called his drawings crude. But they showed the Soviets that their other spies were telling the truth."
        ]
      }
    ]
  },

  {
    id: "jello", title: "The Jell-O Box",
    steps: [
      {
        t: "quiz", q: "Spies who had never met needed a secret way to recognise each other. What did Julius use?",
        opts: ["A torn Jell-O box", "Two halves of a dollar bill", "A red rose in the lapel", "A matching playing card"], a: 0,
        ex: "Julius cut the side of a **Jell-O box** in two. Ruth Greenglass kept one half. A stranger arriving with the other half would be a real Soviet courier."
      },
      {
        t: "jello", head: "Match the pieces", ref: ["Albuquerque, N.M.", "June 3, 1945"],
        body: "Courier **Harry Gold** knocked on the Greenglasses' door holding the other half. His password: {{\"I come from Julius.\"}}"
      },
      {
        t: "quiz", q: "Harry Gold paid David Greenglass for his information. How much?",
        opts: ["$50", "$500", "$5,000", "$50,000"], a: 1,
        ex: "Gold handed over **$500** in an envelope, about two months' pay for an average American worker at the time."
      },
      {
        t: "doc", tone: "white", ref: ["Subject: FUCHS, Klaus", "Los Alamos"],
        head: "The bigger fish", kicker: "Related case",
        img: "fuchs.jpg", cap: "Klaus Fuchs, German-born British physicist.", tall: true, kb: { o: "50% 30%" },
        body: [
          "The day before, Gold had met someone far more important: **Klaus Fuchs**, a top physicist on the bomb team.",
          "Fuchs gave the Soviets detailed plans for the plutonium bomb. Most historians agree his secrets were worth far more than anything from the Greenglass–Rosenberg ring."
        ],
        stamps: [{ txt: "Courier: Gold", cls: "small", x: "52%", y: "40%", r: 7 }]
      }
    ]
  },

  {
    id: "coldwar", title: "The Cold War Begins",
    steps: [
      {
        t: "doc", tone: "white", ref: ["Background brief", "August 1945"],
        head: "The bomb is used", kicker: "Context",
        img: "nagasaki.jpg", cap: "The atomic bombing of Nagasaki, Japan. August 9, 1945.", tall: true, kb: { o: "50% 35%" },
        body: [
          "In August 1945 the U.S. dropped atomic bombs on the Japanese cities of **Hiroshima** and **Nagasaki**, killing well over 100,000 people. Japan surrendered and World War II ended.",
          "For now, only America had the bomb."
        ]
      },
      {
        t: "doc", tone: "yellow", ref: ["Background brief", "1946 onward"],
        head: "An Iron Curtain", kicker: "Context: the Cold War",
        img: "ironcurtain.png", contain: true, cap: "Europe split in two. The Soviet side is to the east.",
        body: [
          "With the war over, the old allies became rivals. The Soviet Union took control of Eastern Europe, cut off behind what Winston Churchill called an **\"Iron Curtain.\"**",
          "This standoff is called the **Cold War**: \"cold\" because the U.S. and USSR never fought each other directly. They competed with spies, threats and weapons instead."
        ]
      },
      {
        t: "quiz", q: "When did U.S. intelligence expect the Soviets to build their own atomic bomb?",
        opts: ["Within a year", "Around 1953", "Not until the 1970s", "Never"], a: 1,
        ex: "A 1949 CIA estimate named **mid-1953** as the most likely date. The Soviets did it nearly four years sooner."
      },
      {
        t: "doc", tone: "green", ref: ["Intelligence flash", "Sept. 1949"],
        head: "\"Joe-1\"", kicker: "Flash: Soviet test detected",
        body: [
          "On **August 29, 1949**, the Soviet Union secretly tested its first atomic bomb. U.S. planes picked up radioactive dust days later.",
          "Americans called it **\"Joe-1\"** after Stalin. Its design was a close copy of the American bomb. Someone had been leaking secrets."
        ],
        stamps: [{ txt: "Top Secret", cls: "small", x: "64%", y: "12%", r: -9 }]
      }
    ]
  },

  {
    id: "web", title: "The Web Unravels",
    steps: [
      {
        t: "doc", tone: "green", ref: ["Telegram (Saving)", "Arlington Hall, Va."],
        head: "Breaking the code", kicker: "Project VENONA",
        body: [
          "Since 1943, U.S. Army codebreakers had been quietly decoding old Soviet spy telegrams. The program was code-named **VENONA**.",
          "The messages mentioned an agent called {{LIBERAL}}, whose wife was named {{ETHEL}}. One said she \"knows about her husband's work.\"",
          "The decoded cables were kept so secret they could not be used in court."
        ],
        stamps: [{ txt: "Top Secret", cls: "small", x: "62%", y: "3%", r: -7 }]
      },
      {
        t: "board", head: "Follow the string", ref: ["Arrests", "1950"],
        nodes: [
          { img: "fuchs.jpg", name: "Fuchs", date: "Feb 1950", x: 2, y: 0, note: "**Klaus Fuchs** confesses in Britain and describes his American courier." },
          { img: "gold.jpg", name: "Gold", date: "May 22, 1950", x: 70, y: 3, note: "The FBI finds **Harry Gold**. He confesses and names a soldier in Albuquerque." },
          { img: "greenglass.jpg", pos: "18% 40%", name: "Greenglass", date: "June 15, 1950", x: 36, y: 31, note: "**David Greenglass** is arrested. He points to his brother-in-law." },
          { img: "julius-arrest.jpg", name: "Julius", date: "July 17, 1950", x: 2, y: 61, note: "**Julius Rosenberg** is arrested at home in front of his family." },
          { img: "ethel-arrest.jpg", name: "Ethel", date: "Aug 11, 1950", x: 70, y: 62, note: "**Ethel Rosenberg** is arrested after testifying to a grand jury. Her sons are 7 and 3." }
        ]
      },
      {
        t: "doc", tone: "white", ref: ["Background brief", "1950"],
        head: "Red Scare", kicker: "Context: fear at home",
        img: "mccarthy.jpg", cap: "Senator Joseph McCarthy, 1954.", tall: true, kb: { o: "50% 30%" },
        body: [
          "In June 1950 the **Korean War** began, with American troops fighting communist forces backed by the Soviets and China.",
          "At home, Senator **Joseph McCarthy** claimed communists had infiltrated the government. Fear of hidden traitors, the **\"Red Scare,\"** swept the country."
        ]
      },
      {
        t: "doc", tone: "yellow", ref: ["FBI memorandum", "July 1950"],
        head: "A lever", kicker: "Internal: Director, FBI",
        img: "hoover.jpg", cap: "FBI Director J. Edgar Hoover.", tall: true, kb: { o: "50% 30%" },
        body: [
          "Julius refused to talk. Prosecutors had little evidence against Ethel.",
          "FBI Director **J. Edgar Hoover** wrote that charging his wife {{\"might serve as a lever\"}} to make Julius confess. He never did.",
          "Ethel was charged with conspiracy too."
        ],
        stamps: [{ txt: "Confidential", cls: "", x: "44%", y: "38%", r: -8 }]
      }
    ]
  },

  {
    id: "trial", title: "The Trial",
    steps: [
      {
        t: "doc", tone: "white", ref: ["U.S. v. Rosenberg et al.", "March 6, 1951"],
        head: "The People vs. the Rosenbergs", kicker: "Federal court, New York",
        img: "exhibit8.jpg", cap: "Robert Meeropol, the Rosenbergs' younger son, holds a copy of a trial exhibit decades later.", kb: { o: "50% 40%" },
        body: [
          "The trial began on **March 6, 1951**. The Rosenbergs and their friend **Morton Sobell** were charged with **conspiracy to commit espionage**.",
          "It was not treason, because the Soviet Union had been a U.S. ally, not an enemy, at the time. Both Rosenbergs said they were innocent."
        ]
      },
      {
        t: "doc", tone: "white", ref: ["Transcript excerpt", "Testimony"],
        head: "A brother testifies", kicker: "Witness: David & Ruth Greenglass",
        img: "david-ruth.jpg", cap: "David and Ruth Greenglass.", kb: { o: "50% 35%" },
        body: [
          "The star witnesses were Ethel's own brother and his wife.",
          "They said Ethel {{typed up David's handwritten notes about the bomb}} at the Rosenbergs' kitchen table.",
          "This was the main evidence that Ethel took an active part. David got a lighter sentence. Ruth was never charged."
        ]
      },
      {
        t: "verdict", head: "The verdict", ref: ["Jury verdict", "March 29, 1951"],
        body: "After less than a day of discussion, the jury reached a decision on all three defendants.",
        stamp: "Guilty"
      },
      {
        t: "doc", tone: "yellow", ref: ["Sentencing", "April 5, 1951"],
        head: "\"Worse than murder\"", kicker: "Judge Irving Kaufman",
        body: [
          "Judge Kaufman blamed the couple for helping the Soviets get the bomb and for American deaths in Korea. {{\"I consider your crime worse than murder,\"}} he said.",
          "Julius and Ethel: **death**. Morton Sobell: 30 years. David Greenglass: 15 years. Harry Gold had already received 30."
        ],
        stamps: [{ txt: "Death", cls: "", x: "64%", y: "3%", r: -10 }]
      },
      {
        t: "poll", q: "The main evidence against Ethel came from her brother, who got a deal. Was that enough to sentence her to death?",
        opts: ["Yes, she was part of the plot", "No, the evidence was too thin", "I'm not sure"],
        ex: "There's no single right answer. Even in 1951, many people, including some who believed Julius was guilty, thought Ethel's death sentence was too harsh."
      }
    ]
  },

  {
    id: "appeals", title: "Two Years on Death Row",
    steps: [
      {
        t: "doc", tone: "white", ref: ["News clipping", "1951 – 1953"],
        head: "The world takes sides", kicker: "Appeals & protests",
        img: "memorial.jpg", cap: "The grown-up sons, Michael and Robert Meeropol, speak at a memorial event in New York, 1975.", kb: { o: "50% 50%" },
        body: [
          "For two years, lawyers appealed and the case became a worldwide cause. Huge crowds marched in Paris, London and New York.",
          "**Albert Einstein**, the artist **Pablo Picasso** and even **Pope Pius XII** asked for mercy."
        ]
      },
      {
        t: "quiz", q: "Which famous scientist publicly asked for the Rosenbergs' lives to be spared?",
        opts: ["Albert Einstein", "Marie Curie", "Isaac Newton", "Thomas Edison"], a: 0,
        ex: "**Einstein** wrote to President Truman and to the newspapers. Curie, Newton and Edison had all died before the trial."
      },
      {
        t: "polaroid", img: "sons.jpg", cap: "Michael's letter to the President, 1953", contain: true, tall: true,
        head: "Two little boys", body: "Their sons, Michael and Robert, visited them in prison and even delivered a letter to the White House asking the President to spare their parents."
      },
      {
        t: "doc", tone: "manila", ref: ["The White House", "Feb. & June 1953"],
        head: "Clemency denied", kicker: "President Eisenhower",
        body: [
          "The new president, **Dwight D. Eisenhower**, refused to spare them, twice.",
          "He believed that showing mercy would look weak while American soldiers were dying in Korea.",
          "The execution was set for June 19, 1953, the day after their **14th wedding anniversary**."
        ],
        stamps: [{ txt: "Denied", cls: "", x: "60%", y: "2%", r: -8 }]
      }
    ]
  },

  {
    id: "execution", title: "June 19, 1953",
    steps: [
      {
        t: "doc", tone: "white", ref: ["Sing Sing Prison", "Ossining, N.Y."],
        head: "Sing Sing", kicker: "Final hours",
        img: "singsing.jpg", cap: "Sing Sing Prison on the Hudson River.", kb: { o: "40% 50%" },
        body: [
          "A last-minute delay granted by one Supreme Court justice was overturned by the full court on the day of the execution. One final offer still stood: **confess**, and live.",
          "Neither Julius nor Ethel confessed."
        ]
      },
      {
        t: "doc", tone: "yellow", ref: ["Report of execution", "8:16 P.M."],
        head: "Executed", kicker: "Case closed?",
        body: [
          "Julius was executed in the electric chair at **8:06 p.m.** Ethel followed minutes later.",
          "Their sons, aged **10** and **6**, were now orphans. They were later adopted by a songwriter, **Abel Meeropol**, and took his last name."
        ],
        stamps: [{ txt: "Executed", cls: "", x: "58%", y: "3%", r: -8 }]
      },
      {
        t: "quiz", q: "How long was Ethel held in prison between her arrest and her execution?",
        opts: ["About 6 months", "About 1 year", "Almost 3 years", "10 years"], a: 2,
        ex: "Ethel was arrested in **August 1950** and executed in **June 1953**, almost **3 years** later, much of it alone on death row."
      }
    ]
  },

  {
    id: "truth", title: "Declassified",
    steps: [
      {
        t: "doc", tone: "green", ref: ["Declassified", "July 11, 1995"],
        head: "The cables go public", kicker: "VENONA released",
        body: [
          "In **1995** the U.S. government finally released the VENONA decrypts.",
          "They confirmed what Julius always denied: he {{was a real Soviet agent who ran a spy ring}}.",
          "But the cables never gave Ethel a code name, and never said she spied herself."
        ],
        stamps: [{ txt: "Declassified", cls: "blue", x: "40%", y: "3%", r: -6 }]
      },
      {
        t: "doc", tone: "white", ref: ["Interview", "2001"],
        head: "\"I don't remember\"", kicker: "Statement: David Greenglass",
        img: "greenglass.jpg", cap: "David Greenglass, 1950.", kb: { o: "70% 50%" },
        body: [
          "In 2001, Greenglass admitted he had no real memory of Ethel typing anything. He said it was probably his wife, Ruth.",
          "He said he lied to protect Ruth and their children: {{\"My wife is more important to me than my sister.\"}}"
        ]
      },
      {
        t: "doc", tone: "white", ref: ["Statement", "2008"],
        head: "The last defendant talks", kicker: "Morton Sobell, age 91",
        img: "sobell-file.jpg", cap: "Morton Sobell's prison file from Alcatraz.", kb: { o: "40% 40%" },
        body: [
          "In 2008, Morton Sobell finally admitted that he and Julius had spied for the Soviets.",
          "He said Julius gave **military electronics**, not real bomb secrets, and that Ethel knew but **did not take part**."
        ]
      },
      {
        t: "doc", tone: "manila", ref: ["Summary of findings", "Today"],
        head: "What we know now", kicker: "Case review",
        body: [
          "**Julius:** guilty of spying. His atomic help to the Soviets was probably small; Klaus Fuchs gave far more.",
          "**Ethel:** knew about her husband's work, but the key evidence against her was false.",
          "Her sons, Michael and Robert Meeropol, have spent decades asking presidents to clear her name."
        ]
      },
      {
        t: "poll", q: "Now that you've seen the whole file: was justice served?",
        opts: ["Yes, for both", "Only for Julius", "No, for neither", "It's complicated"],
        ex: "Historians still argue about this case. Most agree that Julius was a spy, that Ethel's trial was unfair, and that fear during the Cold War shaped the outcome."
      }
    ]
  },

  {
    id: "end", title: "Case Closed",
    steps: [{ t: "end" }]
  }
];
