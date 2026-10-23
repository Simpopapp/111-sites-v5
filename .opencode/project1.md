transcribe the full list showed in this video > teach me about each item like if yout teaching a 10 old kid > now use each one to make a full website teaching how to use it in real usable cases with interacrive examples, and uxui projected to be comprehensive, intuitive and fluid. MEGA BRAIN, DO IT!!!
Here is the full breakdown of the viral reel by @nataindata ("Who’s gonna tell
vibe coders about...").

When building software using AI assistants ("vibe coding"), apps look and feel
functional when tested locally with one person. However, once scaled to
thousands of concurrent users, real money, network latency, and malicious
actors, production infrastructure concepts become critical.

Below is the complete transcription of all 111 items, followed by an ELI10
(Explain Like I'm 10) breakdown, and finally the source code for an interactive
educational web app featuring live simulations and production architectural
patterns.

Part 1: Full Transcription (The 111 Production Essentials)

1.  Rate Limiting
2.  Caching
3.  Load Balancing
4.  Reverse Proxies
5.  API Gateways
6.  CI/CD
7.  Docker
8.  Kubernetes
9.  Service Discovery
10. Circuit Breakers
11. Timeouts
12. Retries
13. Exponential Backoff
14. Idempotency
15. Message Queues
16. Pub/Sub
17. Event-Driven Architecture
18. Distributed Transactions
19. Saga Pattern
20. Dead Letter Queues
21. Cron Jobs
22. WebSockets
23. Long Polling
24. Server-Sent Events
25. Database Indexing
26. Query Optimization
27. N+1 Queries
28. Connection Pooling
29. Read Replicas
30. Sharding
31. Partitioning
32. Replication
33. Leader Election
34. CAP Theorem
35. Eventual Consistency
36. Optimistic Locking
37. Pessimistic Locking
38. Distributed Locks
39. Race Conditions
40. Deadlocks
41. Memory Leaks
42. Garbage Collection
43. Thread Safety
44. Backpressure
45. Autoscaling
46. Horizontal Scaling
47. Vertical Scaling
48. CDN
49. Edge Caching
50. Cache Invalidation
51. Feature Flags
52. Blue-Green Deployments
53. Canary Releases
54. Rolling Deployments
55. Rollbacks
56. Health Checks
57. Liveness & Readiness Probes
58. Monitoring
59. Logging
60. Distributed Tracing
61. Metrics
62. Alerting
63. SLOs (Service Level Objectives)
64. SLIs (Service Level Indicators)
65. Error Budgets
66. Observability
67. Secrets Management
68. IAM (Identity & Access Management)
69. OAuth
70. JWT Rotation
71. TLS
72. Encryption at Rest
73. Encryption in Transit
74. WAF (Web Application Firewall)
75. DDoS Protection
76. CORS (Cross-Origin Resource Sharing)
77. CSRF (Cross-Site Request Forgery)
78. SQL Injection
79. XSS (Cross-Site Scripting)
80. SSRF (Server-Side Request Forgery)
81. Database Migrations
82. Schema Versioning
83. Disaster Recovery
84. Backups
85. Failover
86. Multi-Region Deployments
87. Chaos Engineering
88. Cost Optimization
89. Cold Starts
90. Serverless Limits
91. Latency
92. Throughput
93. P99 Latency
94. Tail Latency
95. Network Partitions
96. Clock Skew
97. DNS
98. TCP vs UDP
99. HTTP/2 & HTTP/3
100. gRPC
101. Webhooks
102. API Versioning
103. Semantic Versioning
104. Infrastructure as Code
105. Terraform
106. Helm Charts
107. Build Caching
108. Dependency Hell
109. Production Incidents
110. On-call
111. Postmortems

Part 2: Explaining Every Item to a 10-Year-Old

🚦 Traffic Control & Gateways (1–5)

1.  Rate Limiting: An ice cream shop where everyone can only get 1 scoop per
    minute. It stops a bully from ordering 10,000 cones at once and making the
    machine explode.
2.  Caching: Writing down the answer to a hard math puzzle on a sticky note on
    your desk, so you don't have to calculate it again when asked 5 seconds
    later.
3.  Load Balancing: A school cafeteria with 4 lunch lines and a teacher
    directing students to the shortest line so nobody waits forever.
4.  Reverse Proxies: A butler standing at your front door. Visitors tell the
    butler what they want; the butler runs inside, fetches it, and hands it back
    so strangers never enter your house.
5.  API Gateways: The front desk security guard at a skyscraper who checks
    badges, scans bags, and points you to the right elevator.

📦 Containers & Automation (6–9)

6.  CI/CD: A robotic factory conveyor belt. Every time you finish a LEGO
    instruction page, the robot inspects it, tests if it holds together, and
    packs it for delivery automatically.
7.  Docker: A lunchbox with dividers. It packs your sandwich, apple, and juice
    box so it tastes the exact same whether you eat it at home, school, or on a
    bus.
8.  Kubernetes: An air traffic controller for thousands of toy delivery drones,
    replacing broken drones and directing extra drones where packages pile up.
9.  Service Discovery: A magical phonebook for computers that automatically
    updates phone numbers when friends move to new houses.

🛡️ Resiliency & Fault Handling (10–14)

10. Circuit Breakers: A switch in your house that trips and turns off the
    electricity if a wire sparks, preventing the whole house from catching fire.
11. Timeouts: Waiting 5 seconds for a friend to answer the door; if they don't,
    you walk away instead of standing on the porch forever.
12. Retries: Tapping the TV remote a second time if the first press didn't
    register.
13. Exponential Backoff: Knocking on your brother's door: wait 1 second; knock
    again: wait 2 seconds; knock again: wait 4 seconds. You stop banging
    constantly so you don't irritate everyone.
14. Idempotency: An elevator button. Whether you press it once or hammer it 50
    times, the elevator still arrives at your floor only once without charging
    you 50 elevator trips.

📬 Async, Messages & Streaming (15–24)

15. Message Queues: The tray on a teacher's desk where students submit homework.
    The teacher grades them one at a time so they don't get swamped.
16. Pub/Sub: The school morning loudspeaker announcement. The principal speaks
    once, and every classroom tuned in hears it at the same time.
17. Event-Driven Architecture: Setting up dominoes. When one falls, it knocks
    the next down automatically without someone having to push each one
    manually.
18. Distributed Transactions: Swapping a shiny Pokémon card with a friend across
    the cafeteria table. You both let go of the cards at the exact same instant,
    or the trade doesn't count.
19. Saga Pattern: A treasure hunt with checkpoints. If you fail step 4, the
    rules tell you how to walk backward and undo steps 3, 2, and 1 cleanly.
20. Dead Letter Queues: The "Lost and Found" bin for letters the mail carrier
    couldn't deliver because the address was smeared.
21. Cron Jobs: Your morning alarm clock that rings at 7:00 AM every single
    weekday without fail.
22. WebSockets: A pair of two-way walkie-talkies held open between you and your
    best friend so you can talk instantly without redialing.
23. Long Polling: Asking "Are we there yet?" in the car, and the driver stays
    silent until you finally reach the hotel, and only then says "Yes!".
24. Server-Sent Events: A live ticker tape on sports TV that continuously
    updates you with the game score.

🗄️ Databases & Storage Engines (25–33)

25. Database Indexing: The index at the back of a 500-page book so you find
    "Dinosaurs" in 2 seconds instead of reading every page.
26. Query Optimization: Asking a librarian "Where is Harry Potter 3?" instead of
    saying "Bring me every book in this library so I can search through them."
27. N+1 Queries: Asking the waiter for 10 pancakes, and then making them run to
    the kitchen 10 separate times to fetch one pad of butter on each trip.
28. Connection Pooling: A fleet of 10 school buses kept running in the parking
    lot so kids jump on instantly, instead of building a brand-new bus from
    scratch for every kid.
29. Read Replicas: Photocopying a comic book so 5 friends can read it at the
    same time while you write the next chapter in the original notebook.
30. Sharding: Storing half your toy collection at Grandma's house and the other
    half at your house because your bedroom closet is full.
31. Partitioning: Sorting your LEGO bricks into separate drawers labeled "Red",
    "Blue", and "Yellow".
32. Replication: Storing a duplicate copy of your video game save file on a USB
    thumb drive so your progress isn't lost if the console breaks.
33. Leader Election: Kids playing kickball picking a captain to call the coin
    toss, with a clear backup in case the captain goes home early.

⚖️ Distributed Systems & Concurrency (34–44)

34. CAP Theorem: The Golden Rule of computer networks: You can only pick 2 out
    of 3: Fast, Always Agrees, or Works When Cables Break.
35. Eventual Consistency: Texting a joke to a group chat. Some friends read it
    immediately, some read it 10 minutes later, but eventually everyone gets it.
36. Optimistic Locking: Writing an answer on a chalkboard assuming no one will
    touch it; before you walk away, you glance back to make sure nobody erased
    it.
37. Pessimistic Locking: Locking the bathroom door so no one else can even turn
    the handle while you're inside.
38. Distributed Locks: A single wooden talking stick for 10 kids spread out over
    Zoom; only the kid holding the digital token gets to speak.
39. Race Conditions: Two people diving for the last slice of pizza at the exact
    same fraction of a second.
40. Deadlocks: Two polite people meeting in a narrow doorway, both stepping in
    the same direction and getting stuck forever.
41. Memory Leaks: Never throwing away candy wrappers until your bedroom is
    completely stuffed to the ceiling and you can't open the door.
42. Garbage Collection: A room-cleaning robot that roams around collecting
    wrappers you dropped and tossing them into the trash bin.
43. Thread Safety: Two chefs working in the same small kitchen without bumping
    elbows or salting the soup twice.
44. Backpressure: Telling a friend pouring cereal into your bowl to "Slow down!
    My bowl is overflowing!"

📈 Scaling & Delivery (45–50)

45. Autoscaling: Hiring extra cashiers at a toy store on Black Friday, and
    letting them go home when the crowd leaves.
46. Horizontal Scaling: Adding 3 more delivery scooters to deliver 4 times as
    many pizzas.
47. Vertical Scaling: Trading your bicycle for a high-powered motorcycle.
48. CDN (Content Delivery Network): Putting copies of a popular movie in
    convenience stores in every neighborhood so nobody has to drive across the
    country to rent it.
49. Edge Caching: Keeping your favorite jacket on the coat hook right by the
    front door instead of in the attic.
50. Cache Invalidation: Throwing away old milk in the fridge when the carton
    expires so you don't drink sour milk by mistake.

🚀 Deployments & Safety (51–57)

51. Feature Flags: A secret light switch in a video game that only lets
    developers test laser blasters before showing it to all players.
52. Blue-Green Deployments: Building an identical playground right next to the
    old one. Once finished, you open the gate to the new one and close the old
    one instantly with zero wait.
53. Canary Releases: Letting 5 kids test the new slide first to make sure it
    isn't slippery, before inviting the rest of the school.
54. Rolling Deployments: Upgrading classroom desks one row at a time while class
    stays in session.
55. Rollbacks: Pressing "Undo" (Ctrl+Z) on the universe when an update breaks
    the game.
56. Health Checks: A doctor tapping your knee with a rubber mallet to make sure
    your reflexes work.
57. Liveness & Readiness Probes: Liveness: "Are you awake?" Readiness: "Have you
    finished brushing your teeth and are you ready for school?"

📊 Observability & SRE (58–66)

58. Monitoring: The dashboard gauges in a car showing speed, gas level, and
    engine temperature.
59. Logging: Writing in a diary every notable thing that happened during the
    day.
60. Distributed Tracing: Putting a GPS tracker on a package so you see every
    airport, truck, and mailroom it passed through.
61. Metrics: Counting how many goals you scored in soccer this season.
62. Alerting: The smoke detector beeping loudly when toast burns.
63. SLOs: A promise to your parents: "My room will be clean 99% of the days this
    month."
64. SLIs: The actual ruler or stopwatch measuring how clean the room really was.
65. Error Budgets: Being allowed to stay up past bedtime exactly twice a month
    without getting grounded.
66. Observability: Being able to figure out why a cake tasted bad just by
    looking at the oven thermometer, timer logs, and recipe ingredients.

🔐 Security & Identity (67–80)

67. Secrets Management: A fireproof safe with a combination dial to store the
    house key, instead of taping the key to the front door mat.
68. IAM: A list of permissions: Older brother can drive the car; younger sister
    can only ride in the back seat.
69. OAuth: Using your Nintendo account to log into Pokémon without telling the
    Pokémon app your actual Nintendo password.
70. JWT Rotation: A visitor wristband at a waterpark that expires every hour and
    gets swapped for a fresh colored band at the kiosk.
71. TLS: Talking in secret pig-latin through a soundproof pipe so eavesdroppers
    hear only gibberish.
72. Encryption at Rest: Locking your diary inside a steel safe when you aren't
    reading it.
73. Encryption in Transit: Handing a sealed, wax-stamped envelope to a courier.
74. WAF: A bouncer at the club door checking IDs and turning away troublemakers
    carrying water balloons.
75. DDoS Protection: Digging extra canal channels to divert a sudden flash flood
    around your sandcastle.
76. CORS: A school rule that says kids from a rival school can't walk into your
    locker room without a permission slip.
77. CSRF: A trick where someone hands you a piece of paper that secretly
    instructs the bank teller to hand over your pocket money.
78. SQL Injection: Asking a teacher "Can I look up student [Bob; erase all
    grades]?" and tricking the computer into deleting the school database.
79. XSS: Someone writing a mean message on the classroom chalkboard with
    invisible ink that tricks whoever reads it into shouting out loud.
80. SSRF: Tricking the server into ordering a pizza to its own hidden bedroom
    closet.

🛠️ Infrastructure, Network & Protocols (81–111)

81. Database Migrations: Carefully adding a new column to a spreadsheet without
    scrambling any of the existing rows.
82. Schema Versioning: Labeling your blueprint "Floor Plan v2.1" so the builders
    don't build v1.0 by mistake.
83. Disaster Recovery: Having an emergency escape backpack packed in case a
    storm hits your house.
84. Backups: Copying your school project to Google Drive and a flash drive
    before shut down.
85. Failover: A generator that kicks in 1 second after the main power goes out.
86. Multi-Region Deployments: Operating one lemonade stand in London and another
    in New York so an earthquake in one city doesn't close your whole business.
87. Chaos Engineering: Intentionally pulling random cords in your game setup to
    see if the game can survive without crashing.
88. Cost Optimization: Turning off the lights in rooms you aren't using to keep
    the electric bill low.
89. Cold Starts: Turning on a lawnmower that's been sitting in the snow all
    winter; it takes a few seconds to sputter to life.
90. Serverless Limits: A microwave that shuts off if you try to heat a burrito
    for longer than 15 minutes straight.
91. Latency: How long it takes for a ball to reach you after your friend throws
    it.
92. Throughput: How many tennis balls your friend can throw at you in 60
    seconds.
93. P99 Latency: Testing 100 throws: 99 arrive in 1 second, but 1 took 10
    seconds because the dog caught it.
94. Tail Latency: The slowest unlucky throws at the very end of the line.
95. Network Partitions: A fallen tree cutting off the telephone cable between
    two neighborhoods.
96. Clock Skew: Two watches in the same room showing times that differ by 3
    minutes.
97. DNS: The contact list in your phone translating "Grandma" into +1-555-0199.
98. TCP vs UDP: TCP is a certified letter requiring a signature (slow and
    reliable). UDP is tossing a paper plane out the window (fast, but might get
    lost).
99. HTTP/2 & HTTP/3: Upgrading a single-lane dirt road to an 8-lane superhighway
    with bullet trains.
100. gRPC: A private high-speed pneumatic tube system between banks that shoots
     binary capsules back and forth in microseconds.
101. Webhooks: Asking your mom to text you the exact moment dinner is ready,
     instead of coming downstairs every 30 seconds.
102. API Versioning: Keeping the old menu for regular customers while
     introducing the new menu for new visitors.
103. Semantic Versioning: Numbering rules: v1.2.3 (1 = Major changes that break
     stuff; 2 = New cool stuff; 3 = Bug fixes).
104. Infrastructure as Code: A recipe that tells a 3D printer how to build an
     entire house from scratch.
105. Terraform: The universal remote control that orders AWS, Google Cloud, and
     Cloudflare to build identical servers simultaneously.
106. Helm Charts: A pre-bundled package of LEGO bricks with complete assembly
     blueprints.
107. Build Caching: Reusing the already-baked cake base so you only have to
     frost the top layer when someone changes the icing color.
108. Dependency Hell: Trying to install a game that needs ToyTool v1, but your
     computer already has ToyTool v2, and your music player needs v1.5.
109. Production Incidents: The fire alarm sounding at 3 AM because a server
     broke down while customers were buying items.
110. On-call: The firefighter carrying the pager this weekend, ready to drop
     everything and fix emergencies.
111. Postmortems: A calm meeting after the fire to ask: "Why did the toaster
     spark, and what smoke detector can we install so this never happens again?"

Part 3: The Complete Interactive Web Application

Below is a self-contained, responsive, modern Single Page Application built with
HTML5, Tailwind CSS, Lucide Icons, and Vanilla JavaScript.

Key Features Included:

  - Interactive Search & Multi-Domain Filters across all 111 concepts.
  - Dynamic "Production Readiness Score" Audit System: Check items off to
    evaluate an app's resilience.
  - Embedded Interactive Sandbox Visualizers:
    1.  Token Bucket Rate Limiter (Live click-tester with 429 triggers).
    2.  Resilience Circuit Breaker (Simulate downstream faults, state
        transitions: CLOSED \rightarrow OPEN \rightarrow HALF-OPEN).
    3.  N+1 Query vs. Eager Loading Latency Visualizer.
    4.  SQL Injection Tester (Compare raw concatenation vs. parameterized
        queries).
    5.  Live Pub/Sub & Queue Worker Simulator.
    6.  P99 & Tail Latency Distribution Simulator.

How to Run:

Save the code block below as index.html and double-click to open it in any web
browser.

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VibeCoder Academy • 111 Production Architecture Fundamentals</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              50: '#eef2ff',
              100: '#e0e7ff',
              500: '#6366f1',
              600: '#4f46e5',
              700: '#4338ca',
              900: '#1e1b4b',
            }
          }
        }
      }
    }
  </script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    code, pre, .font-mono { font-family: 'JetBrains Mono', monospace; }
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-indigo-500 selection:text-white">

  <!-- TOP NAVIGATION BAR -->
  <header class="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="p-2 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
          <i data-lucide="cpu" class="w-6 h-6"></i>
        </div>
        <div>
          <span class="text-xs uppercase tracking-widest font-bold text-indigo-400">Survival Guide</span>
          <h1 class="text-lg font-bold text-white flex items-center gap-2">
            111 Vibe Coder Architecture Essentials
          </h1>
        </div>
      </div>
      
      <!-- Readiness Tracker Widget -->
      <div class="hidden md:flex items-center space-x-4 bg-slate-800/80 border border-slate-700/60 rounded-full px-4 py-1.5">
        <span class="text-xs font-medium text-slate-400">Production Readiness:</span>
        <div class="w-32 bg-slate-700 rounded-full h-2.5 overflow-hidden">
          <div id="readinessBar" class="bg-gradient-to-r from-amber-500 to-emerald-400 h-2.5 rounded-full transition-all duration-500" style="width: 0%"></div>
        </div>
        <span id="readinessPercent" class="text-xs font-mono font-bold text-emerald-400">0%</span>
      </div>
    </div>
  </header>

  <!-- HERO SECTION -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 text-center md:text-left">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/80 pb-8">
      <div class="max-w-3xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-4">
          <i data-lucide="shield-alert" class="w-3.5 h-3.5"></i> Bridging the gap between "It works on localhost" and 1,000,000 users
        </div>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          What vibe coding doesn’t teach you until production crashes.
        </h2>
        <p class="mt-3 text-slate-400 text-base leading-relaxed">
          AI writes code fast, but distributed systems require real architecture. Browse all 111 concepts, learn them with 10-year-old analogies, inspect production mitigation patterns, and test live interactive simulations.
        </p>
      </div>
      <div class="flex flex-wrap gap-2 justify-center">
        <button onclick="openSandbox('ratelimit')" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition">
          <i data-lucide="zap" class="w-4 h-4 text-amber-400"></i> Rate Limiter
        </button>
        <button onclick="openSandbox('circuit')" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition">
          <i data-lucide="power" class="w-4 h-4 text-rose-400"></i> Circuit Breaker
        </button>
        <button onclick="openSandbox('nplusone')" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition">
          <i data-lucide="database" class="w-4 h-4 text-cyan-400"></i> N+1 Visualizer
        </button>
        <button onclick="openSandbox('sqli')" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition">
          <i data-lucide="lock" class="w-4 h-4 text-emerald-400"></i> SQL Injection
        </button>
      </div>
    </div>

    <!-- SEARCH & FILTER BAR -->
    <div class="mt-6 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div class="relative w-full md:w-96">
        <i data-lucide="search" class="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
        <input 
          type="text" 
          id="searchInput" 
          placeholder="Search by keyword, concept or number (e.g. 'P99', 'JWT', 'N+1')..." 
          class="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          oninput="renderCards()"
        >
      </div>

      <!-- Categories Pills -->
      <div id="categoryPills" class="flex flex-wrap gap-1.5 w-full md:w-auto">
        <!-- Injected via JS -->
      </div>
    </div>
  </section>

  <!-- MAIN LIST CONTAINER -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-1 w-full">
    <div class="flex items-center justify-between text-xs text-slate-400 mb-4 px-1">
      <span id="resultsCount">Showing 111 items</span>
      <span>Click any card to inspect code & architecture blueprints</span>
    </div>

    <!-- Cards Grid -->
    <div id="cardsGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Injected via JS -->
    </div>
  </main>

  <!-- INTERACTIVE MODAL (DETAILS & SANDBOX) -->
  <div id="modalOverlay" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div id="modalBox" class="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl relative">
      <!-- Close Button -->
      <button onclick="closeModal()" class="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>

      <div id="modalContent" class="p-6 sm:p-8">
        <!-- Injected Dynamically -->
      </div>
    </div>
  </div>

  <!-- SCRIPT: DATA & INTERACTIVITY -->
  <script>
    const itemsData = [
      { id: 1, name: "Rate Limiting", cat: "Traffic", eli: "An ice cream shop where you can only order 1 scoop every 60 seconds so one bully doesn't take all the cones.", risk: "Without rate limits, a single scraping bot or buggy script can crash your server with 50,000 requests/sec, driving your cloud bill to thousands.", fix: "Token bucket or sliding window algorithm implemented via Redis or Cloudflare edge rules." },
      { id: 2, name: "Caching", cat: "Performance", eli: "Writing down the answer to a tough math problem on a sticky note so you don't redo the work 5 seconds later.", risk: "Hitting the database for static or semi-static data on every page load causes high latency and database exhaustion.", fix: "In-memory caching via Redis, HTTP caching headers (Cache-Control), and CDN caching." },
      { id: 3, name: "Load Balancing", cat: "Traffic", eli: "A lunch lady directing students evenly into 4 different cafeteria lines so no single line is stalled.", risk: "Sending all traffic to a single server instance limits capacity and creates an immediate single point of failure.", fix: "Round-robin, least-connections, or IP-hash load balancers (AWS ALB, NGINX, Cloudflare)." },
      { id: 4, name: "Reverse Proxies", cat: "Traffic", eli: "A butler standing at the front door who gets what you need from inside so strangers never enter your house.", risk: "Directly exposing internal application servers to the internet exposes internal ports, IP addresses, and headers.", fix: "Deploy NGINX, Caddy, or Envoy in front of internal services to handle TLS termination and request sanitation." },
      { id: 5, name: "API Gateways", cat: "Traffic", eli: "The skyscraper security desk that checks visitor badges, scans bags, and points you to the correct elevator.", risk: "Duplicating authentication, rate limiting, and telemetry logic in 20 different microservice endpoints.", fix: "Use a centralized API Gateway (Kong, AWS API Gateway, Traefik) for auth, throttling, and routing." },
      { id: 6, name: "CI/CD", cat: "DevOps", eli: "A factory robot that automatically inspects every LEGO piece, tests its strength, and boxes it for shipping.", risk: "Manual FTP/SSH file updates result in broken deployments, forgotten migrations, and human mistakes.", fix: "Automate test-and-deploy pipelines using GitHub Actions, GitLab CI, or ArgoCD." },
      { id: 7, name: "Docker", cat: "DevOps", eli: "A sealed bento box that keeps your lunch fresh and tasting exactly the same anywhere in the world.", risk: "'Works on my machine' syndrome where missing OS packages or version mismatches crash code in staging.", fix: "Package code, runtime dependencies, and OS libraries into standardized Docker containers." },
      { id: 8, name: "Kubernetes", cat: "DevOps", eli: "An air traffic controller for thousands of toy drones that replaces dead drones and steers extra ones during rushes.", risk: "Containers crash silently or run out of memory without an automated orchestrator to restart or balance them.", fix: "Declarative cluster orchestration with self-healing, rolling updates, and autoscaling." },
      { id: 9, name: "Service Discovery", cat: "DevOps", eli: "A phone directory that updates phone numbers dynamically when friends change houses.", risk: "Hardcoding internal server IP addresses breaks as soon as cloud instances autoscale or restart.", fix: "DNS-based service discovery (Consul, CoreDNS) or service mesh control planes." },
      { id: 10, name: "Circuit Breakers", cat: "Resilience", eli: "A safety switch in your home that turns off electricity when wires overheat so the house doesn't catch fire.", risk: "Repeatedly calling a down third-party API causes request queues to pile up, exhausting all server worker threads.", fix: "Wrap external network requests in a circuit breaker pattern (Resilience4j, Cockatiel) that fails fast when thresholds trip." },
      { id: 11, name: "Timeouts", cat: "Resilience", eli: "Knocking on a door for 5 seconds; if nobody answers, you leave instead of waiting forever.", risk: "A database query or API hanging indefinitely holds open connections until the server runs out of file descriptors.", fix: "Enforce aggressive, explicit socket and request timeouts across all HTTP clients and database connections." },
      { id: 12, name: "Retries", cat: "Resilience", eli: "Pressing the TV remote button a second time if the first click didn't turn it on.", risk: "Failing an entire customer order because of a 5-millisecond transient network blip.", fix: "Implement idempotent retry policies on transient 5xx HTTP codes or network disconnects." },
      { id: 13, name: "Exponential Backoff", cat: "Resilience", eli: "Waiting 1 second, then 2, then 4, then 8 seconds before knocking again so you don't annoy your brother.", risk: "Retrying failed requests instantly with hundreds of clients launches a self-inflicted DDoS attack.", fix: "Multiply wait intervals by 2^n with randomized jitter to spread traffic spikes." },
      { id: 14, name: "Idempotency", cat: "Resilience", eli: "An elevator button: pressing it 20 times doesn't summon 20 elevators or charge you 20 tickets.", risk: "A user double-clicking 'Pay Now' charges their credit card twice because the API processed both POST requests.", fix: "Include unique Idempotency-Keys in payment and mutation requests; store and check keys in Redis." },
      { id: 15, name: "Message Queues", cat: "Async", eli: "The teacher's submission inbox tray where tests sit safely until the teacher grades them one by one.", risk: "Running heavy PDF generation or email dispatch directly inside the HTTP request loop causes 30s timeouts.", fix: "Offload long-running background tasks to message brokers like RabbitMQ, SQS, or BullMQ." },
      { id: 16, name: "Pub/Sub", cat: "Async", eli: "The school morning intercom: one announcement is broadcast, and every classroom tuned in receives it.", risk: "Tightly coupling services by having the checkout service manually call 8 different APIs sequentially.", fix: "Publish an `OrderPlaced` event to Kafka, Google Cloud Pub/Sub, or Redis Pub/Sub; allow listeners to consume independently." },
      { id: 17, name: "Event-Driven Architecture", cat: "Async", eli: "A line of dominoes where tipping one automatically triggers the subsequent blocks.", risk: "Synchronous blocking architectures cascade failures: if service D slows down, services A, B, and C all collapse.", fix: "Decouple systems around asynchronous domain events and event streams." },
      { id: 18, name: "Distributed Transactions", cat: "Async", eli: "Swapping Pokémon cards across the table: both kids release cards simultaneously, or the trade cancels.", risk: "Charging a card successfully while the database fails to record the purchase leaves money taken with no order created.", fix: "Two-Phase Commit (2PC) or asynchronous compensation workflows." },
      { id: 19, name: "Saga Pattern", cat: "Async", eli: "A treasure hunt checklist where failing step 3 gives instructions to walk backwards and put step 2 and 1 items back.", risk: "Distributed systems cannot easily execute traditional database transactions across multiple microservices.", fix: "Orchestrate sequential steps with corresponding compensating transactions to roll back state if an intermediate step fails." },
      { id: 20, name: "Dead Letter Queues", cat: "Async", eli: "The post office shelf for mail with unreadable addresses that needs human review.", risk: "A poisoned message with malformed JSON loops forever through your worker, crashing it on repeat.", fix: "Route unprocessable messages to a Dead Letter Queue (DLQ) after 3–5 failed attempts, and trigger alerts." },
      { id: 21, name: "Cron Jobs", cat: "Async", eli: "Your alarm clock set to ring at 7:00 AM every weekday morning.", risk: "Multiple autoscaled server instances each running the same cron job at midnight, resulting in duplicate billings.", fix: "Use a centralized job runner (Temporal, AWS EventBridge, BullMQ repeatable jobs) with distributed locks." },
      { id: 22, name: "WebSockets", cat: "Streaming", eli: "A dedicated two-way walkie-talkie held open with your friend so either can speak instantly.", risk: "Polling an API every 500ms to check for new chat messages wastes vast server CPU and bandwidth.", fix: "Establish full-duplex persistent WebSocket connections for real-time multiplayer, chat, and collaborative tools." },
      { id: 23, name: "Long Polling", cat: "Streaming", eli: "Asking 'Are we there yet?', and your mom stays quiet until you reach the hotel before saying 'Yes!'.", risk: "Older mobile environments or firewalls that kill raw WebSocket connections break real-time updates.", fix: "Client sends an HTTP request; server delays response until new data is available or a timeout occurs." },
      { id: 24, name: "Server-Sent Events", cat: "Streaming", eli: "A stock ticker on the TV screen that streams incoming scores without you asking repeatedly.", risk: "Using heavy bi-directional WebSockets when you only need one-way streaming (like LLM token generation).", fix: "Use lightweight HTTP-based Server-Sent Events (SSE) for one-way server-to-client streaming." },
      { id: 25, name: "Database Indexing", cat: "Database", eli: "The index section at the back of a huge dictionary so you find words in 2 seconds.", risk: "Querying unindexed columns requires a Full Table Scan, slowing queries from 2ms to 25 seconds as data grows.", fix: "Add B-tree indexes on columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses." },
      { id: 26, name: "Query Optimization", cat: "Database", eli: "Asking the librarian for the exact book title rather than asking them to bring out all 10,000 books.", risk: "Writing `SELECT *` across joined tables loads massive blobs into memory, choking database I/O.", fix: "Select only required fields, leverage `EXPLAIN ANALYZE`, and eliminate unnecessary subqueries." },
      { id: 27, name: "N+1 Queries", cat: "Database", eli: "Ordering 10 pancakes, and having the waiter make 10 separate trips to fetch one pad of butter each time.", risk: "Fetching 100 blog posts, then running 100 extra individual queries to get the author for each post.", fix: "Use SQL `JOIN` or ORM eager loading (`include` / `preload`) to fetch related data in a single round-trip." },
      { id: 28, name: "Connection Pooling", cat: "Database", eli: "A fleet of school buses parked outside ready to go so drivers don't assemble a new bus each morning.", risk: "Creating a new database connection for every incoming HTTP request exhausts DB memory within seconds.", fix: "Use connection poolers like PgBouncer or built-in ORM pools to reuse a fixed number of connections." },
      { id: 29, name: "Read Replicas", cat: "Database", eli: "Photocopying a comic book so 5 friends can read it while you draw new pages in the master notebook.", risk: "All reporting queries and user reads overload the primary database, blocking critical write transactions.", fix: "Direct intensive `SELECT` traffic to read-only replica database instances." },
      { id: 30, name: "Sharding", cat: "Database", eli: "Splitting your toy collection across Grandma's house and your house because your closet is full.", risk: "A monolithic database outgrows the storage capacity and disk throughput of the biggest cloud server available.", fix: "Horizontally partition tables across independent database servers using a consistent sharding key." },
      { id: 31, name: "Partitioning", cat: "Database", eli: "Separating your LEGO bricks into separate drawers labeled 'Red', 'Blue', and 'Yellow'.", risk: "A table with 500 million audit logs causes index trees to outgrow RAM, crippling query performance.", fix: "Use declarative table partitioning (by date range or hash) to prune scans to relevant chunks." },
      { id: 32, name: "Replication", cat: "Database", eli: "Saving your game file on a flash drive so you don't lose progress if the console breaks.", risk: "A disk failure on your single database server permanently destroys user data and takes down the business.", fix: "Run synchronous or asynchronous streaming replication to standby instances." },
      { id: 33, name: "Leader Election", cat: "Database", eli: "Kids picking a kickball team captain so everyone knows who makes the final call.", risk: "Two distributed cron servers both believing they are the master, leading to duplicate financial payouts.", fix: "Use consensus algorithms (Raft, Paxos) or distributed locks (Etcd, ZooKeeper) to elect a single primary." },
      { id: 34, name: "CAP Theorem", cat: "Distributed", eli: "A triangle where you can only pick two corners: Consistency, Availability, or Partition Tolerance.", risk: "Expecting a distributed network to be 100% consistent and 100% available when network cables get severed.", fix: "Design architectures intentionally for CP (consistency over availability) or AP (availability over consistency)." },
      { id: 35, name: "Eventual Consistency", cat: "Distributed", eli: "Sending a postcard to a friend: they will read the news eventually, but not at the exact moment you mailed it.", risk: "Users refresh the page immediately after updating a profile picture and panic when they see the old picture for 2 seconds.", fix: "Design UX to handle replica replication lag gracefully with optimistic client-side state." },
      { id: 36, name: "Optimistic Locking", cat: "Distributed", eli: "Writing an answer on the chalkboard assuming no one will erase it, and checking once before you submit.", risk: "Two administrators editing a product description at the same time overwrite each other's work silently.", fix: "Add a `version` column to database rows; reject updates where `version != expected_version`." },
      { id: 37, name: "Pessimistic Locking", cat: "Distributed", eli: "Locking the bathroom door while inside so no one else can even turn the handle.", risk: "Two shoppers purchasing the last concert ticket concurrently results in negative inventory balances.", fix: "Use SQL `SELECT ... FOR UPDATE` within a transaction to lock rows during critical inventory decrements." },
      { id: 38, name: "Distributed Locks", cat: "Distributed", eli: "A single talking stick passed around a circle; only the child holding it can speak.", risk: "Multiple server instances performing the same critical migration simultaneously.", fix: "Implement Redlock (Redis) or use database advisory locks with strict TTL safety timeouts." },
      { id: 39, name: "Race Conditions", cat: "Distributed", eli: "Two kids diving for the last slice of pizza at the exact same fraction of a second.", risk: "Concurrent requests check account balance, verify funds, and both withdraw money before the balance updates.", fix: "Enforce atomic database updates (`SET balance = balance - amount WHERE balance >= amount`)." },
      { id: 40, name: "Deadlocks", cat: "Distributed", eli: "Two polite people trying to pass each other in a narrow doorway, continuously stepping in the same direction.", risk: "Transaction A locks Row 1 and waits for Row 2, while Transaction B locks Row 2 and waits for Row 1, freezing both.", fix: "Acquire locks in a strict, predictable order across all endpoints, and configure deadlock timeouts." },
      { id: 41, name: "Memory Leaks", cat: "Performance", eli: "Never throwing away candy wrappers until your bedroom is completely stuffed to the ceiling.", risk: "Unclosed database cursors, uncleared intervals, or global arrays steadily consume RAM until the OS terminates the server.", fix: "Profile Node/Go/Python memory heaps, run leak detectors, and avoid unmanaged global state." },
      { id: 42, name: "Garbage Collection", cat: "Performance", eli: "A robot vacuum roaming around collecting empty wrappers and throwing them in the trash.", risk: "Sudden garbage collection pauses freeze your application threads, causing latency spikes.", fix: "Tune GC thresholds, reduce object allocations in hot loops, or use languages with manual memory control." },
      { id: 43, name: "Thread Safety", cat: "Performance", eli: "Two chefs working in the same tiny kitchen without bumping elbows or salting the sauce twice.", risk: "Concurrent threads writing to shared in-memory variables corrupt data structures.", fix: "Use thread-safe data structures, mutexes, or immutable data patterns." },
      { id: 44, name: "Backpressure", cat: "Performance", eli: "Telling your friend pouring juice into your cup: 'Stop! It's overflowing!'.", risk: "A fast producer floods a slower consumer with messages until the consumer runs out of memory and crashes.", fix: "Implement flow control, reactive streams, and queue-depth throttling to slow down upstream producers." },
      { id: 45, name: "Autoscaling", cat: "Scaling", eli: "Opening extra checkout lines at the grocery store when a rush arrives, and closing them when customers leave.", risk: "Your app crashes during a marketing launch because server count remains fixed at 2 instances.", fix: "Set up horizontal pod/instance autoscaling triggered by CPU, memory, or request-rate metrics." },
      { id: 46, name: "Horizontal Scaling", cat: "Scaling", eli: "Buying 4 more bicycles so 4 friends can deliver newspapers simultaneously.", risk: "Assuming an app can scale horizontally when sessions are stored in local server memory instead of Redis.", fix: "Build stateless applications that can scale to arbitrary instance counts behind a load balancer." },
      { id: 47, name: "Vertical Scaling", cat: "Scaling", eli: "Trading in your bicycle for a heavy-duty monster truck.", risk: "Vertical scaling hits a hard hardware and financial ceiling quickly; you cannot buy an infinite CPU.", fix: "Use vertical scaling for early simplicity, but transition to stateless horizontal architecture before maxing out." },
      { id: 48, name: "CDN (Content Delivery Network)", cat: "Scaling", eli: "Putting movie copies in corner stores worldwide so people don't have to fly to Hollywood to rent one.", risk: "Users in Australia experience 800ms load times downloading images from a single server in Virginia.", fix: "Cache static assets (JS, CSS, images, video) across globally distributed Edge CDN locations." },
      { id: 49, name: "Edge Caching", cat: "Scaling", eli: "Keeping your winter coat on the hook right next to the front door instead of upstairs in the attic.", risk: "Origin servers get flooded with identical requests for public pages and assets.", fix: "Cache dynamic and static responses close to the user using Cloudflare Workers, Fastly, or CloudFront." },
      { id: 50, name: "Cache Invalidation", cat: "Performance", eli: "Throwing away expired milk from the fridge so no one drinks sour milk by mistake.", risk: "Users continue seeing stale prices, broken permissions, or outdated text long after updates.", fix: "Use deterministic cache invalidation tags (surrogate keys), short TTLs, or versioned asset URLs." },
      { id: 51, name: "Feature Flags", cat: "DevOps", eli: "A secret light switch that lets developers test laser blasters before showing them to all players.", risk: "Deploying incomplete features directly to all users risks widespread bugs and outages.", fix: "Wrap new features in dynamic feature toggle evaluation services (LaunchDarkly, Unleash, PostHog)." },
      { id: 52, name: "Blue-Green Deployments", cat: "DevOps", eli: "Building an identical playground next door, and instantly unlocking the gate to the new one when ready.", risk: "In-place deployments cause downtime and partial 502 Bad Gateway errors during file replacement.", fix: "Maintain two identical environments (Blue and Green); switch load balancer routing instantly." },
      { id: 53, name: "Canary Releases", cat: "DevOps", eli: "Letting 5 students test the new water slide first to verify it's safe before everyone climbs up.", risk: "Shipping a major version update to 100% of users immediately exposes everyone to critical undetected regressions.", fix: "Route 2% of live traffic to the new release, monitor error rates for 30 minutes, then scale to 100%." },
      { id: 54, name: "Rolling Deployments", cat: "DevOps", eli: "Swapping out classroom desks one row at a time while class continues without interruption.", risk: "Deploying to all servers at once causes complete service interruption during startup.", fix: "Update server instances incrementally, waiting for readiness probes before taking the next batch down." },
      { id: 55, name: "Rollbacks", cat: "DevOps", eli: "Pressing the 'Undo' button on the universe when a game update breaks the world.", risk: "When a bug hits production, engineers panic-fix live code instead of reverting cleanly.", fix: "Automate instantaneous rollbacks to the prior immutable Docker container image or commit artifact." },
      { id: 56, name: "Health Checks", cat: "Reliability", eli: "A doctor tapping your knee with a small rubber hammer to verify your reflexes work.", risk: "A load balancer sending user traffic to a server whose process is hung or out of memory.", fix: "Expose an unauthenticated `/healthz` HTTP endpoint that confirms app and dependency status." },
      { id: 57, name: "Liveness & Readiness Probes", cat: "Reliability", eli: "Liveness: 'Are you alive?'. Readiness: 'Have you packed your backpack and are you ready for class?'.", risk: "A container receiving live user traffic before its database connection or caches have initialized.", fix: "Configure separate probes: Liveness restarts crashed pods; Readiness holds traffic until ready." },
      { id: 58, name: "Monitoring", cat: "Observability", eli: "The dashboard in a car showing speed, gas level, and oil temperature.", risk: "Discovering your app has been down for 6 hours only when users complain on Twitter.", fix: "Install synthetic uptime monitors (Datadog, Better Uptime) tracking critical user journeys." },
      { id: 59, name: "Logging", cat: "Observability", eli: "Writing a notebook entry whenever anything notable happens during the day.", risk: "A bug occurs in production and there are zero breadcrumbs, stack traces, or context to diagnose it.", fix: "Implement structured JSON logging with request IDs, timestamps, and log levels (INFO, WARN, ERROR)." },
      { id: 60, name: "Distributed Tracing", cat: "Observability", eli: "Attaching a GPS tracker to a package so you see every airport and mail truck it traveled through.", risk: "In a microservice system, not knowing which of the 12 microservices caused a 3-second delay.", fix: "Inject OpenTelemetry trace and span headers (`traceparent`) through all service boundaries." },
      { id: 61, name: "Metrics", cat: "Observability", eli: "Keeping a scoreboard that tracks how many soccer goals you scored each week.", risk: "Guessing whether server load is increasing or decreasing over time without hard numeric trends.", fix: "Collect time-series metrics (Prometheus/Grafana) on CPU, memory, request volume, and error rates." },
      { id: 62, name: "Alerting", cat: "Observability", eli: "A loud smoke alarm going off when the kitchen toaster burns.", risk: "Alert fatigue: engineers receive 400 irrelevant Slack notifications a day and ignore the real emergency.", fix: "Send high-severity alerts (PagerDuty, Opsgenie) only for customer-impacting SLO violations." },
      { id: 63, name: "SLOs (Service Level Objectives)", cat: "Observability", eli: "Promising your parents: 'My bedroom will be clean 99% of days this month'.", risk: "Engineers argue endlessly about whether an app is 'fast enough' or 'reliable enough'.", fix: "Define precise measurable targets (e.g. 99.9% of API requests return 200 in <300ms over 30 days)." },
      { id: 64, name: "SLIs (Service Level Indicators)", cat: "Observability", eli: "The stopwatch used to measure the exact time it took to clean the room.", risk: "Setting arbitrary reliability goals without having a concrete metric to measure them against.", fix: "The exact ratio of successful requests over total valid requests over a rolling window." },
      { id: 65, name: "Error Budgets", cat: "Observability", eli: "Being allowed to stay up late twice a month without getting your privileges revoked.", risk: "Product teams continuously push unstable features without pausing to fix tech debt.", fix: "If 0.1% downtime allowance is burned, feature releases freeze and the team focuses on reliability." },
      { id: 66, name: "Observability", cat: "Observability", eli: "Figuring out why a cake tastes bad just by reading the oven thermometer logs and ingredient list.", risk: "Being able to see that an error occurred, but having zero tools to deduce *why* it occurred.", fix: "Unify the three pillars (Logs, Metrics, and Traces) into a correlated debugging platform." },
      { id: 67, name: "Secrets Management", cat: "Security", eli: "A fireproof lockbox with a combo lock to store your key, instead of putting it under the welcome mat.", risk: "Committing API keys, database passwords, or JWT secrets directly into public GitHub repositories.", fix: "Use dedicated secrets managers (AWS Secrets Manager, HashiCorp Vault, Doppler); inject via environment variables." },
      { id: 68, name: "IAM (Identity & Access Management)", cat: "Security", eli: "A rule list: big brother can drive the car; little sister can only ride in the back seat.", risk: "Giving your web server full root/admin permissions to read and delete every cloud database resource.", fix: "Enforce Principle of Least Privilege: grant microservices access only to the exact tables they need." },
      { id: 69, name: "OAuth", cat: "Security", eli: "Using your school ID to enter a museum without handing the museum your private home address.", risk: "Asking users to type their raw Google or Facebook password into your untrusted app.", fix: "Use OAuth 2.0 / OpenID Connect authorization flows with delegated scopes." },
      { id: 70, name: "JWT Rotation", cat: "Security", eli: "An amusement park wristband that expires every hour and gets swapped for a fresh color band.", risk: "A stolen JWT token with infinite expiration gives an attacker lifetime access to a user's account.", fix: "Issue short-lived access tokens (15m) alongside revocable, rotating refresh tokens." },
      { id: 71, name: "TLS", cat: "Security", eli: "Speaking secret pig-latin through a soundproof tube so nobody can eavesdrop on your conversation.", risk: "Sending plaintext HTTP passwords and credit cards across public Wi-Fi networks where anyone can sniff them.", fix: "Enforce TLS 1.3 across all domains; automatically renew free certificates via Let's Encrypt." },
      { id: 72, name: "Encryption at Rest", cat: "Security", eli: "Locking your secret diary inside a steel vault when you aren't reading it.", risk: "If a cloud disk or backup volume is stolen or unmounted, all customer data is visible in plain text.", fix: "Enable AES-256 disk and database encryption across all storage volumes and S3 buckets." },
      { id: 73, name: "Encryption in Transit", cat: "Security", eli: "Handing an important letter to a courier inside a sealed wax-stamped envelope.", risk: "Internal traffic between microservices moving over unencrypted VPC wires can be inspected.", fix: "Enforce mutual TLS (mTLS) for all inter-service communication inside your cluster." },
      { id: 74, name: "WAF (Web Application Firewall)", cat: "Security", eli: "A bouncer checking backpacks at the gate and tossing out anyone carrying water balloons.", risk: "Malicious bots bombarding your login forms with credential stuffing attacks.", fix: "Deploy a WAF (Cloudflare WAF, AWS WAF) to inspect payloads and filter known vulnerability probes." },
      { id: 75, name: "DDoS Protection", cat: "Security", eli: "Digging extra water canals around your sandcastle so a sudden giant wave gets diverted safely.", risk: "A rival floods your server with 100 Gbps of junk packets, taking your entire company offline.", fix: "Use distributed Anycast DDoS scrubbing networks (Cloudflare, AWS Shield) at the internet edge." },
      { id: 76, name: "CORS (Cross-Origin Resource Sharing)", cat: "Security", eli: "A school rule saying kids from the neighboring school cannot open your school locker without permission.", risk: "Setting `Access-Control-Allow-Origin: *` on authenticated APIs lets malicious sites make requests on behalf of users.", fix: "Explicitly whitelist only trusted frontend origin domains on sensitive API endpoints." },
      { id: 77, name: "CSRF (Cross-Site Request Forgery)", cat: "Security", eli: "A trick where someone tricks you into handing a signed note to the banker asking for all your allowance.", risk: "A logged-in user visits a malicious website that silently triggers a `POST /transfer-money` to your API.", fix: "Use SameSite=Strict cookies and validate anti-CSRF challenge tokens on mutation endpoints." },
      { id: 78, name: "SQL Injection", cat: "Security", eli: "Telling a teacher your name is 'Bobby; DROP TABLE Students' to trick the computer into deleting school grades.", risk: "Concatenating strings into SQL queries allows attackers to bypass authentication and dump database tables.", fix: "Always use parameterized queries, prepared statements, or modern type-safe ORMs." },
      { id: 79, name: "XSS (Cross-Site Scripting)", cat: "Security", eli: "Writing a prank note on the classroom board in magic ink that tricks anyone who reads it into shouting.", risk: "Allowing users to post raw `<script>` tags that steal cookies and session tokens from other users.", fix: "Sanitize and escape all user input before rendering into HTML; implement strict Content Security Policy (CSP)." },
      { id: 80, name: "SSRF (Server-Side Request Forgery)", cat: "Security", eli: "Tricking the school delivery messenger into delivering a pizza straight into the principal's private safe.", risk: "A user submits a URL for an avatar, and your backend fetches `http://169.254.169.254` to steal AWS metadata tokens.", fix: "Disable following redirects, block private IP ranges (`10.0.0.0/8`, `192.168.0.0/16`), and validate URL schemes." },
      { id: 81, name: "Database Migrations", cat: "Database", eli: "Carefully adding a new column to a spreadsheet without scrambling any of the existing rows.", risk: "Renaming a database column directly causes the currently running server code to crash with missing column errors.", fix: "Use multi-phase expand/contract migrations: add column, deploy code, backfill data, remove old column." },
      { id: 82, name: "Schema Versioning", cat: "Database", eli: "Labeling your toy blueprints 'Version 2.0' so builders don't build the old version by mistake.", risk: "Different branches of code operating on mismatched database schemas, causing silent data corruption.", fix: "Track migrations in version control with timestamped files managed by Prisma, Flyway, or Liquibase." },
      { id: 83, name: "Disaster Recovery", cat: "Reliability", eli: "Keeping a packed emergency backpack ready in case a storm damages your house.", risk: "An entire cloud region suffers an outage and your business remains offline for 48 hours without a plan.", fix: "Establish documented Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO) with rehearsed recovery drills." },
      { id: 84, name: "Backups", cat: "Reliability", eli: "Copying your school paper to both Google Drive and a USB drive before going to sleep.", risk: "Ransomware or an errant automated script deletes production data with no restorable snapshot available.", fix: "Run automated daily encrypted backups with point-in-time recovery (PITR) and cross-account isolation." },
      { id: 85, name: "Failover", cat: "Reliability", eli: "A backup generator that hums to life 1 second after the main neighborhood power cuts out.", risk: "When a primary database crashes, the application throws 500 errors until someone wakes up to fix it.", fix: "Configure automated health-monitored failover to standby database and compute instances." },
      { id: 86, name: "Multi-Region Deployments", cat: "Reliability", eli: "Running a lemonade stand in London and another in New York so one rainy day doesn't stop your sales.", risk: "An AWS us-east-1 outage takes your entire global product offline.", fix: "Deploy active-active or active-passive instances across geographically separate data centers." },
      { id: 87, name: "Chaos Engineering", cat: "Reliability", eli: "Purposely pulling random cables on your computer to verify your game doesn't crash.", risk: "Discovering how your system behaves during server crashes for the first time during peak customer traffic.", fix: "Use tools like Chaos Mesh or Gremlin in staging to terminate random pods and verify graceful degradation." },
      { id: 88, name: "Cost Optimization", cat: "DevOps", eli: "Turning off bedroom lights when you leave so your family's electricity bill doesn't skyrocket.", risk: "A vibe-coded serverless function with an infinite loop generates an unexpected $30,000 monthly bill.", fix: "Set spending alerts, right-size database instances, configure lifecycle policies on object storage, and set execution limits." },
      { id: 89, name: "Cold Starts", cat: "Performance", eli: "Starting a lawnmower that's been sitting in the freezing cold all winter; it takes a few seconds to rumble.", risk: "Serverless functions spinning up on-demand take 3 to 8 seconds to serve the first customer's request.", fix: "Keep containers warm with scheduled pingers, minimize container bundle size, or use lightweight Edge runtimes." },
      { id: 90, name: "Serverless Limits", cat: "Performance", eli: "A microwave that automatically turns off if you try to cook anything for longer than 15 minutes.", risk: "Assuming AWS Lambda or Vercel functions can process a 45-minute video render without timing out.", fix: "Acknowledge 15-minute execution ceilings and connection limits; offload long-running tasks to dedicated containers." },
      { id: 91, name: "Latency", cat: "Performance", eli: "How long you have to wait after throwing a baseball before your friend catches it.", risk: "Slow database calls and remote API hops stack up, creating a sluggish user experience that kills conversion.", fix: "Reduce network hops, optimize queries, and place computation closer to users via Edge networks." },
      { id: 92, name: "Throughput", cat: "Performance", eli: "How many tennis balls your friend can throw at you in 60 seconds.", risk: "A system that responds in 20ms for 1 user grinds to a halt when 500 users query it simultaneously.", fix: "Increase concurrency, remove blocking I/O bottlenecks, and use asynchronous processing pipelines." },
      { id: 93, name: "P99 Latency", cat: "Performance", eli: "Throwing 100 balls: 99 arrive in 1 second, but 1 ball took 10 seconds because the dog grabbed it.", risk: "Looking only at 'average' latency hides the fact that 1 out of every 100 high-value customers experiences a 10s delay.", fix: "Instrument percentile monitoring (P50, P90, P99) to optimize the worst-case customer experience." },
      { id: 94, name: "Tail Latency", cat: "Performance", eli: "The unlucky throws at the very end of the line that took way longer than everything else.", risk: "In a microservice system making 50 sub-requests per page load, tail latency guarantees every page feels slow.", fix: "Hedge requests, enforce strict per-service timeouts, and eliminate noisy-neighbor issues." },
      { id: 95, name: "Network Partitions", cat: "Distributed", eli: "A fallen tree breaking the phone wire between two sides of town.", risk: "Servers on different sides of a partitioned network make conflicting updates, creating split-brain data corruption.", fix: "Use consensus algorithms that require a quorum (>50% of nodes) before accepting writes." },
      { id: 96, name: "Clock Skew", cat: "Distributed", eli: "Two wall clocks in the same room showing times that differ by 3 minutes.", risk: "Relying on server wall-clock timestamps to determine the order of financial trades causes invalid transaction order.", fix: "Synchronize clocks using NTP/PTP, and rely on logical clocks (Lamport timestamps) for event ordering." },
      { id: 97, name: "DNS", cat: "Networking", eli: "The phone address book that turns 'Grandma' into her actual phone number.", risk: "Setting DNS TTL to 72 hours means an IP address change leaves users unable to reach your site for 3 days.", fix: "Set reasonable TTLs (e.g. 300 seconds) during migrations and use multi-provider DNS resilience." },
      { id: 98, name: "TCP vs UDP", cat: "Networking", eli: "TCP is a certified letter requiring a signature; UDP is tossing a paper airplane out the window.", risk: "Using TCP for video streaming or gaming creates stuttering when a single lost packet blocks all subsequent data.", fix: "Use TCP for reliable data (APIs, web pages); use UDP/QUIC for live media, gaming, and real-time streaming." },
      { id: 99, name: "HTTP/2 & HTTP/3", cat: "Networking", eli: "Upgrading a single-lane dirt road to an 8-lane superhighway with bullet trains.", risk: "Old HTTP/1.1 connections suffer head-of-line blocking, requiring browsers to open multiple slow TCP connections.", fix: "Enable HTTP/2 multiplexing and HTTP/3 QUIC on your CDN and reverse proxies." },
      { id: 100, name: "gRPC", cat: "Networking", eli: "A high-speed pneumatic tube system between banks that shoots binary capsules in microseconds.", risk: "Parsing heavy JSON strings between 50 internal microservices burns CPU and increases latency.", fix: "Use gRPC with Protocol Buffers for typed, high-performance inter-service communication." },
      { id: 101, name: "Webhooks", cat: "Async", eli: "Asking your mom to text you when dinner is ready instead of walking downstairs every 30 seconds.", risk: "Failing to verify webhook cryptographic signatures allows bad actors to forge fake payment-completed notifications.", fix: "Verify HMAC signatures (e.g. Stripe `stripe-signature`), handle duplicates idempotently, and process asynchronously." },
      { id: 102, name: "API Versioning", cat: "Protocols", eli: "Keeping the original restaurant menu for regulars while offering the new menu to new guests.", risk: "Changing an API field name breaks every older version of your mobile app currently installed on user phones.", fix: "Version endpoints explicitly (`/v1/checkout`, `/v2/checkout`) or use version headers." },
      { id: 103, name: "Semantic Versioning", cat: "Protocols", eli: "A secret code: v1.2.3 (1 = broke old stuff; 2 = cool new features; 3 = tiny bug fixes).", risk: "Pushing breaking changes in a minor patch update breaks all automated build tools that rely on your library.", fix: "Strictly adhere to `MAJOR.MINOR.PATCH` standards across all public libraries and services." },
      { id: 104, name: "Infrastructure as Code", cat: "DevOps", eli: "A written recipe that tells a 3D printer how to build an entire house from scratch.", risk: "Clicking around in cloud consoles manually means nobody knows how to rebuild the infrastructure when it breaks.", fix: "Define all servers, VPCs, and databases in declarative code repositories (Terraform, Pulumi)." },
      { id: 105, name: "Terraform", cat: "DevOps", eli: "A magic universal remote that tells AWS, Google Cloud, and Cloudflare to build identical servers at once.", risk: "Configuration drift where production differs wildly from documentation, preventing reliable scaling.", fix: "Manage cloud state files safely and run `terraform plan` reviews before applying production changes." },
      { id: 106, name: "Helm Charts", cat: "DevOps", eli: "A box containing all the LEGO bricks and step-by-step instructions bundled together.", risk: "Managing 35 raw Kubernetes YAML files manually leads to copy-paste mistakes and broken pods.", fix: "Package Kubernetes deployments into versioned, parameter-driven Helm charts." },
      { id: 107, name: "Build Caching", cat: "DevOps", eli: "Using an already-baked cake sponge so you only need to put frosting on top when decorating.", risk: "Re-downloading and recompiling all dependencies on every small git commit wastes 30 minutes per build.", fix: "Configure multi-stage Docker build caching and dependency caching in CI runners." },
      { id: 108, name: "Dependency Hell", cat: "DevOps", eli: "Wanting to play a game that needs toy tool v1, but your computer already has v2, and your music player needs v1.5.", risk: "Unpinned packages upgrade automatically overnight, introducing breaking changes and breaking production builds.", fix: "Commit strict lockfiles (`package-lock.json`, `poetry.lock`) and regularly audit outdated libraries." },
      { id: 109, name: "Production Incidents", cat: "SRE", eli: "The fire alarm blaring in the middle of the night because the toaster caught fire.", risk: "Engineers panic, talk over each other in chaotic chats, and inadvertently make outages worse.", fix: "Establish an Incident Commander, dedicated communication channels, and clear escalation protocols." },
      { id: 110, name: "On-call", cat: "SRE", eli: "The firefighter carrying the emergency pager this weekend, ready to run when the bell rings.", risk: "An outage occurs at 3 AM on a Saturday and nobody notices until Monday morning.", fix: "Set up healthy, compensated on-call rotations with automated paging escalation trees." },
      { id: 111, name: "Postmortems", cat: "SRE", eli: "A calm meeting after the fire to ask: 'Why did the toaster spark, and what smoke detector can we install?'.", risk: "Teams play the blame game, fire individuals, and repeat the exact same architectural outage 2 months later.", fix: "Conduct blameless postmortems focusing on system vulnerabilities, root causes, and actionable prevention items." }
    ];

    // State
    let checkedItems = new Set();
    let currentFilter = 'All';

    const categories = ['All', 'Traffic', 'Performance', 'DevOps', 'Resilience', 'Async', 'Streaming', 'Database', 'Distributed', 'Scaling', 'Observability', 'Security', 'Reliability', 'Networking', 'Protocols', 'SRE'];

    // DOM Elements
    const cardsGrid = document.getElementById('cardsGrid');
    const searchInput = document.getElementById('searchInput');
    const categoryPills = document.getElementById('categoryPills');
    const resultsCount = document.getElementById('resultsCount');
    const readinessBar = document.getElementById('readinessBar');
    const readinessPercent = document.getElementById('readinessPercent');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalContent = document.getElementById('modalContent');

    // Initialize Category Pills
    function initFilters() {
      categoryPills.innerHTML = categories.map(cat => `
        <button 
          onclick="setFilter('${cat}')" 
          class="px-2.5 py-1 rounded-lg text-xs font-medium transition ${
            currentFilter === cat 
              ? 'bg-indigo-600 text-white shadow-sm' 
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700/50'
          }"
        >
          ${cat}
        </button>
      `).join('');
    }

    function setFilter(cat) {
      currentFilter = cat;
      initFilters();
      renderCards();
    }

    function toggleCheck(id, event) {
      event.stopPropagation();
      if (checkedItems.has(id)) {
        checkedItems.delete(id);
      } else {
        checkedItems.add(id);
      }
      updateReadiness();
      renderCards();
    }

    function updateReadiness() {
      const pct = Math.round((checkedItems.size / itemsData.length) * 100);
      readinessBar.style.width = `${pct}%`;
      readinessPercent.textContent = `${pct}%`;
    }

    // Render Cards
    function renderCards() {
      const query = searchInput.value.toLowerCase().trim();
      const filtered = itemsData.filter(item => {
        const matchesCategory = currentFilter === 'All' || item.cat === currentFilter;
        const matchesSearch = item.name.toLowerCase().includes(query) ||
                              item.eli.toLowerCase().includes(query) ||
                              item.id.toString() === query ||
                              item.cat.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
      });

      resultsCount.textContent = `Showing ${filtered.length} of ${itemsData.length} items`;

      if (filtered.length === 0) {
        cardsGrid.innerHTML = `
          <div class="col-span-full py-16 text-center text-slate-500">
            <i data-lucide="help-circle" class="w-10 h-10 mx-auto mb-2 opacity-50"></i>
            <p class="text-sm">No architecture concepts match your search.</p>
          </div>
        `;
        lucide.createIcons();
        return;
      }

      cardsGrid.innerHTML = filtered.map(item => {
        const isChecked = checkedItems.has(item.id);
        return `
          <div 
            onclick="openDetailModal(${item.id})"
            class="group bg-slate-900/60 hover:bg-slate-900 border ${isChecked ? 'border-emerald-500/40' : 'border-slate-800'} hover:border-slate-700 rounded-xl p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between hover:shadow-lg relative"
          >
            <div>
              <div class="flex items-start justify-between gap-2 mb-2.5">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-400 border border-slate-700">
                    #${item.id}
                  </span>
                  <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    ${item.cat}
                  </span>
                </div>
                <button 
                  onclick="toggleCheck(${item.id}, event)" 
                  title="Check if handled in your codebase"
                  class="p-1 rounded-md transition ${isChecked ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-600 hover:text-slate-400'}"
                >
                  <i data-lucide="${isChecked ? 'check-circle-2' : 'circle'}" class="w-5 h-5"></i>
                </button>
              </div>

              <h3 class="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                ${item.name}
              </h3>
              
              <div class="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                <span class="text-indigo-400 font-semibold">ELI10:</span> ${item.eli}
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span class="group-hover:text-slate-300 transition-colors">Inspect Mitigation</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"></i>
            </div>
          </div>
        `;
      }).join('');

      lucide.createIcons();
    }

    // Modal Details View
    function openDetailModal(id) {
      const item = itemsData.find(i => i.id === id);
      if (!item) return;

      modalContent.innerHTML = `
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              Concept #${item.id}
            </span>
            <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">
              ${item.cat}
            </span>
          </div>
        </div>

        <h2 class="text-2xl font-bold text-white mt-4">${item.name}</h2>

        <div class="mt-6 space-y-4">
          <!-- 10-Year-Old Explanation -->
          <div class="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-4">
            <h4 class="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <i data-lucide="sparkles" class="w-3.5 h-3.5"></i> Like You're 10 Years Old (ELI10)
            </h4>
            <p class="text-sm text-slate-300 leading-relaxed">${item.eli}</p>
          </div>

          <!-- Why Vibe Coders Break It -->
          <div class="bg-rose-950/20 border border-rose-500/20 rounded-xl p-4">
            <h4 class="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <i data-lucide="alert-triangle" class="w-3.5 h-3.5"></i> Why Vibe Coders Break It In Production
            </h4>
            <p class="text-sm text-slate-300 leading-relaxed">${item.risk}</p>
          </div>

          <!-- Production Fix Blueprint -->
          <div class="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4">
            <h4 class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <i data-lucide="check-shield" class="w-3.5 h-3.5"></i> Production Architectural Solution
            </h4>
            <p class="text-sm text-slate-300 leading-relaxed">${item.fix}</p>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
          <button 
            onclick="toggleCheck(${item.id}, event); openDetailModal(${item.id});" 
            class="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              checkedItems.has(item.id) 
                ? 'bg-emerald-600 text-white' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }"
          >
            <i data-lucide="${checkedItems.has(item.id) ? 'check' : 'plus'}" class="w-4 h-4"></i>
            ${checkedItems.has(item.id) ? 'Implemented in My App' : 'Mark as Implemented'}
          </button>
          <button onclick="closeModal()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium">
            Close
          </button>
        </div>
      `;

      modalOverlay.classList.remove('hidden');
      lucide.createIcons();
    }

    function closeModal() {
      modalOverlay.classList.add('hidden');
    }

    // Close modal on Escape or outside click
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });

    // -------------------------------------------------------------
    // INTERACTIVE SANDBOX SIMULATORS (Live Engines)
    // -------------------------------------------------------------
    function openSandbox(type) {
      modalOverlay.classList.remove('hidden');
      
      if (type === 'ratelimit') {
        renderRateLimitSandbox();
      } else if (type === 'circuit') {
        renderCircuitBreakerSandbox();
      } else if (type === 'nplusone') {
        renderNPlusOneSandbox();
      } else if (type === 'sqli') {
        renderSqlInjectionSandbox();
      }
      lucide.createIcons();
    }

    // 1. RATE LIMITER SIMULATOR (Token Bucket)
    let tokens = 5;
    const maxTokens = 5;
    setInterval(() => {
      if (tokens < maxTokens) {
        tokens++;
        updateBucketUI();
      }
    }, 1500);

    function renderRateLimitSandbox() {
      modalContent.innerHTML = `
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <span class="text-xs font-mono font-bold text-amber-400">Interactive Sandbox #1</span>
          <span class="text-xs text-slate-400">Token Bucket Algorithm</span>
        </div>
        <h2 class="text-xl font-bold text-white mt-3">Rate Limiting Simulator</h2>
        <p class="text-xs text-slate-400 mt-1">Bucket capacity: 5 tokens. Refill rate: 1 token / 1.5s. Click rapidly to trigger 429 Too Many Requests.</p>

        <div class="mt-6 bg-slate-950 border border-slate-800 rounded-xl p-5 text-center">
          <div class="flex justify-center items-center gap-2 mb-4" id="tokenDisplay">
            <!-- Tokens injected -->
          </div>
          <button 
            id="fireReqBtn"
            onclick="fireRateLimitRequest()" 
            class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-indigo-600/30"
          >
            Send HTTP GET /api/v1/data
          </button>
          <div id="rateLimitLog" class="mt-4 font-mono text-xs text-left p-3 bg-slate-900 rounded-lg h-28 overflow-y-auto custom-scrollbar border border-slate-800 text-slate-400">
            [Ready] Click above to dispatch network requests.
          </div>
        </div>
      `;
      updateBucketUI();
    }

    function updateBucketUI() {
      const container = document.getElementById('tokenDisplay');
      if (!container) return;
      container.innerHTML = Array.from({ length: maxTokens }).map((_, i) => `
        <div class="w-8 h-8 rounded-lg border ${i < tokens ? 'bg-amber-500 border-amber-400 text-slate-950' : 'bg-slate-800 border-slate-700 text-slate-600'} flex items-center justify-center font-mono font-bold text-xs transition-all">
          <i data-lucide="zap" class="w-4 h-4"></i>
        </div>
      `).join('');
      lucide.createIcons();
    }

    function fireRateLimitRequest() {
      const log = document.getElementById('rateLimitLog');
      const time = new Date().toLocaleTimeString();
      if (tokens > 0) {
        tokens--;
        log.innerHTML = `<span class="text-emerald-400">[${time}] 200 OK</span> - Request passed. Remaining tokens: ${tokens}<br>` + log.innerHTML;
      } else {
        log.innerHTML = `<span class="text-rose-400 font-bold">[${time}] 429 TOO MANY REQUESTS</span> - Rate limit exceeded. Throttled.<br>` + log.innerHTML;
      }
      updateBucketUI();
    }

    // 2. CIRCUIT BREAKER SIMULATOR
    let cbState = 'CLOSED'; // CLOSED, OPEN, HALF-OPEN
    let failCount = 0;

    function renderCircuitBreakerSandbox() {
      modalContent.innerHTML = `
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <span class="text-xs font-mono font-bold text-rose-400">Interactive Sandbox #2</span>
          <span class="text-xs text-slate-400">Fault Tolerance Pattern</span>
        </div>
        <h2 class="text-xl font-bold text-white mt-3">Circuit Breaker State Machine</h2>
        <p class="text-xs text-slate-400 mt-1">If 3 requests fail consecutively, the circuit trips to OPEN, instantly failing fast without stressing the downstream service.</p>

        <div class="mt-6 bg-slate-950 border border-slate-800 rounded-xl p-5 text-center">
          <div class="inline-block px-4 py-1.5 rounded-full text-xs font-mono font-bold mb-4" id="cbBadge">
            STATE: CLOSED (Normal Operation)
          </div>

          <div class="flex justify-center gap-3">
            <button onclick="sendCbRequest(true)" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition">
              Simulate Success (200)
            </button>
            <button onclick="sendCbRequest(false)" class="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition">
              Simulate Downstream Error (500)
            </button>
            <button onclick="resetCb()" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl border border-slate-700">
              Reset
            </button>
          </div>

          <div id="cbLog" class="mt-4 font-mono text-xs text-left p-3 bg-slate-900 rounded-lg h-28 overflow-y-auto custom-scrollbar border border-slate-800 text-slate-400">
            [Ready] Circuit breaker listening.
          </div>
        </div>
      `;
      updateCbBadge();
    }

    function updateCbBadge() {
      const badge = document.getElementById('cbBadge');
      if (!badge) return;
      if (cbState === 'CLOSED') {
        badge.className = 'inline-block px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
        badge.textContent = `STATE: CLOSED (Normal - Failures: ${failCount}/3)`;
      } else if (cbState === 'OPEN') {
        badge.className = 'inline-block px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse';
        badge.textContent = `STATE: OPEN (Failing Fast - Downstream Protected)`;
      }
    }

    function sendCbRequest(isSuccess) {
      const log = document.getElementById('cbLog');
      const time = new Date().toLocaleTimeString();

      if (cbState === 'OPEN') {
        log.innerHTML = `<span class="text-amber-400">[${time}] FAST FAIL:</span> Circuit is OPEN. Request blocked in 0.1ms without calling broken service.<br>` + log.innerHTML;
        return;
      }

      if (isSuccess) {
        failCount = 0;
        log.innerHTML = `<span class="text-emerald-400">[${time}] 200 OK:</span> Downstream service responded successfully.<br>` + log.innerHTML;
      } else {
        failCount++;
        log.innerHTML = `<span class="text-rose-400">[${time}] 500 ERROR:</span> Remote service timeout/failure (${failCount}/3).<br>` + log.innerHTML;
        if (failCount >= 3) {
          cbState = 'OPEN';
          log.innerHTML = `<span class="text-amber-300 font-bold">[${time}] TRIP:</span> 3 failures reached! Circuit is now OPEN.<br>` + log.innerHTML;
          setTimeout(() => {
            cbState = 'CLOSED';
            failCount = 0;
            updateCbBadge();
            if (document.getElementById('cbLog')) {
              document.getElementById('cbLog').innerHTML = `<span class="text-cyan-400">[AUTO]</span> Circuit cooldown ended. Resetting to CLOSED.<br>` + document.getElementById('cbLog').innerHTML;
            }
          }, 5000);
        }
      }
      updateCbBadge();
    }

    function resetCb() {
      cbState = 'CLOSED';
      failCount = 0;
      updateCbBadge();
    }

    // 3. N+1 QUERY VISUALIZER
    function renderNPlusOneSandbox() {
      modalContent.innerHTML = `
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <span class="text-xs font-mono font-bold text-cyan-400">Interactive Sandbox #3</span>
          <span class="text-xs text-slate-400">Database Performance</span>
        </div>
        <h2 class="text-xl font-bold text-white mt-3">N+1 Queries vs Eager Loading</h2>
        <p class="text-xs text-slate-400 mt-1">Simulate fetching 25 users and their addresses with and without ORM eager loading.</p>

        <div class="mt-6 bg-slate-950 border border-slate-800 rounded-xl p-5">
          <div class="flex justify-center gap-4 mb-5">
            <button onclick="runNPlusOneSim(true)" class="px-4 py-2 bg-rose-600/80 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl border border-rose-500/30">
              Run Naive Loop (N+1)
            </button>
            <button onclick="runNPlusOneSim(false)" class="px-4 py-2 bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl border border-emerald-500/30">
              Run Eager JOIN (1 Query)
            </button>
          </div>

          <div id="queryMetrics" class="grid grid-cols-2 gap-3 text-center mb-4">
            <div class="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span class="text-xs text-slate-500 block">Total Database Queries</span>
              <span id="metricCount" class="text-2xl font-mono font-extrabold text-white">-</span>
            </div>
            <div class="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span class="text-xs text-slate-500 block">Roundtrip Latency</span>
              <span id="metricTime" class="text-2xl font-mono font-extrabold text-white">-</span>
            </div>
          </div>

          <div id="queryLog" class="font-mono text-xs p-3 bg-slate-900 rounded-lg h-28 overflow-y-auto custom-scrollbar border border-slate-800 text-slate-400">
            [Ready] Select an execution pattern above to view generated SQL queries.
          </div>
        </div>
      `;
    }

    function runNPlusOneSim(isNaive) {
      const log = document.getElementById('queryLog');
      const count = document.getElementById('metricCount');
      const time = document.getElementById('metricTime');
      log.innerHTML = '';

      if (isNaive) {
        count.textContent = '26 queries';
        count.className = 'text-2xl font-mono font-extrabold text-rose-400';
        time.textContent = '312 ms';
        time.className = 'text-2xl font-mono font-extrabold text-rose-400';

        log.innerHTML += `<span class="text-amber-400">SELECT * FROM users LIMIT 25;</span><br>`;
        for (let i = 1; i <= 25; i++) {
          log.innerHTML += `<span class="text-rose-400">SELECT * FROM addresses WHERE user_id = ${i};</span><br>`;
        }
      } else {
        count.textContent = '1 query';
        count.className = 'text-2xl font-mono font-extrabold text-emerald-400';
        time.textContent = '14 ms';
        time.className = 'text-2xl font-mono font-extrabold text-emerald-400';

        log.innerHTML = `<span class="text-emerald-400">SELECT users.*, addresses.* FROM users LEFT JOIN addresses ON addresses.user_id = users.id LIMIT 25;</span><br><span class="text-slate-500">-- Single round-trip data fetch completed via eager load index scan.</span>`;
      }
    }

    // 4. SQL INJECTION TESTER
    function renderSqlInjectionSandbox() {
      modalContent.innerHTML = `
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <span class="text-xs font-mono font-bold text-emerald-400">Interactive Sandbox #4</span>
          <span class="text-xs text-slate-400">Security Architecture</span>
        </div>
        <h2 class="text-xl font-bold text-white mt-3">SQL Injection Interactive Demo</h2>
        <p class="text-xs text-slate-400 mt-1">See how unescaped string concatenation alters database AST logic vs parameterized placeholders.</p>

        <div class="mt-6 bg-slate-950 border border-slate-800 rounded-xl p-5">
          <label class="block text-xs font-semibold text-slate-300 mb-1">Simulated User Input (Username):</label>
          <div class="flex gap-2 mb-4">
            <input 
              id="sqliInput" 
              type="text" 
              value="' OR '1'='1" 
              class="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-amber-300 focus:outline-none focus:border-indigo-500"
            >
            <button onclick="testSqli(true)" class="px-3 py-1.5 bg-rose-600/80 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl">
              Unescaped Query
            </button>
            <button onclick="testSqli(false)" class="px-3 py-1.5 bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl">
              Parameterized Query
            </button>
          </div>

          <div id="sqliOutput" class="font-mono text-xs p-4 bg-slate-900 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
            [Awaiting Execution] Click one of the execution modes above to inspect generated SQL logic.
          </div>
        </div>
      `;
    }

    function testSqli(isVulnerable) {
      const val = document.getElementById('sqliInput').value;
      const out = document.getElementById('sqliOutput');

      if (isVulnerable) {
        out.innerHTML = `
          <div class="text-rose-400 font-bold mb-1">⚠️ VULNERABLE CODE: String Concat / Template Literals</div>
          <div class="bg-black/50 p-2 rounded text-slate-400 mb-2">
            const query = \`SELECT * FROM users WHERE user = '\${input}' AND pass = 'secret'\`;
          </div>
          <div class="text-rose-300">
            Executed SQL: <span class="bg-rose-950/60 px-1 text-white font-bold">SELECT * FROM users WHERE user = '' OR '1'='1' AND pass = 'secret'</span>
          </div>
          <p class="text-[11px] text-rose-400/90 mt-2">
            RESULT: Because '1'='1' is always TRUE, the password check is short-circuited. The attacker logs in as the first user (Administrator) without a password.
          </p>
        `;
      } else {
        out.innerHTML = `
          <div class="text-emerald-400 font-bold mb-1">✅ SECURE CODE: Prepared Statement / Parameterized</div>
          <div class="bg-black/50 p-2 rounded text-slate-400 mb-2">
            db.query('SELECT * FROM users WHERE user = $1 AND pass = $2', [input, password]);
          </div>
          <div class="text-emerald-300">
            Executed SQL: <span class="bg-emerald-950/60 px-1 text-white font-bold">SELECT * FROM users WHERE user = ? AND pass = ?</span>
          </div>
          <p class="text-[11px] text-emerald-400/90 mt-2">
            RESULT: The database treats the input strictly as a literal string value, searching for an account whose actual username is literally "' OR '1'='1". Query fails safely with 0 rows.
          </p>
        `;
      }
    }

    // Initialize App
    initFilters();
    renderCards();
    updateReadiness();
  </script>
</body>
</html>

What to Explore in the Web App

1.  Interactive Search: Type any concept (e.g., P99, Saga, JWT, Deadlock) to
    filter immediately.
2.  Interactive Sandboxes:
      - Test the Rate Limiter with rapid clicks to trigger HTTP 429.
      - Inject errors into the Circuit Breaker to watch it transition from
        CLOSED to OPEN.
      - Switch between Naive N+1 Queries and an Eager JOIN to see the database
        round-trip drop from 26 queries to 1.
      - Test the SQL Injection Playground to compare string concatenation
        against prepared statements.
3.  App Audit Tool: Check off each architecture pattern your app has implemented
    to monitor its live Production Readiness Score.
