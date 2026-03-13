## 2025 Self Review

Projects you worked on 2025 that you feel had a positive impact on the business
I have completed several big projects as the sole developer across tech stacks, and was a contributor to multiple projects as well. Ranging from integrating into existing high impact projects, building new distributed systems from the ground up, building enhancements and new features into internal system, to even training and deploying models to provide use at scale.

Some of these projects also had hard deadline constraints due to rapid high priority pre-black friday asks. These projects all excelled and had immediate use. These include:

• Adding the ability to add customer notes from the toolsite, including having all the features needed to keep relationship meter up to date. 
 • This offered immediate value due to internal system being down a few times during cyber 5. It allowed sales to have a backup to continue making sales during high sales impact hours.
• internal system inventory sales history old reporting 
 • This includes having accurate consistent results cached in redis from bigquery, and having data that is at most 1 hour old, all served in internal system. This replaces a process in internal system that never finished on time, and out of that had very inconsistent results. It also had several bugs in calculcations.
• V1 fraud dashboard 
 • This first iteration allowed our fraud team to catch a few extra fraud cases. This was followed up with a v2 later in december that had significantly improved accuracy and less false positives that is discussed more below. The frontend was built in javascript, the backend uses golang, and has regular refreshing of data and built in reviewal processes.
Other projects I led:
• Fraud dashboard v2 
 • This second iteration had a big impact on confidence intervals. This used machine learning to capture insights on patterns of fraudulent users. From there, I extracted simplified rules that gave further insight into what our model learned, and allowed toggling rules at scale. Also built a dashboard using html/js that has built in analytics and authentication to display all of the data. With being 85% accurate in determining fraudulent orders, this served as a layer to track account takeovers and used features to detect anomalous customer activity.
• Marketplace customer deduplication 
 • Towards the end of 2025, I finished up phase one of this task to convert the python script to a SQL script, using set deduplication algorithms in Bigquery. This uncovered several edge cases that the previous script didn't handle well, correcting the inaccuracy from ranging from 80-90% to 100%. 
• CDP Todo Lists
 • A solution that brought our teams data to an internal system. This was a cross-system integration that includes dynamically generated lists, real-time updates, personalized lists based on permissions, analytics being captured on intent, and strong internal system integrations for jumping between modules. I built out all sides of this implementation
• Customer classification model 
 • I trained a model that is able to predict customer's categories based off the kinds of items they are interacting with on the web, and recorded interactions in our internal system (Like invoices, quotes, etc). I also architected the infrastructure to handle this kind of predictions at scale with new pageviews, and every other interaction type in real time. We've received great feedback from sales which confirms that many of the tags it produces works well. This is not yet used in production, but the v1 work is complete. There is long term plans for this to be included in other models that data science team will be building as well.
• Framework documentation 
 • To better onboard other teams on the packages and libraries our team has built, I did a thorough analysis of our framework and added in-depth examples that broke down the why of using certain tools and best practices.
• Analytics service 
 • I overhauled our analytics service to be much more dynamic to new captured analytics in Golang. The old implementation was a major bottleneck in adding new kinds of analytics from different services. I designed a much more flexible system that allowed us to add many different kinds of analytics to capture at scale, coordinating with the downstream teams to ensure minimal impact.
• Moved to new price change system that internal system deprecated away from
• Teaching the team machine learning 
 • Held regular sessions, providing material to study in order to better improve our teams understanding of machine learning. This included assignments to take home to work on, and walkthroughs of existing systems and collaborative learning sessions.

Other projects I was a contributor in:
• Holiday album service
• Matchmaking
• Prospecting
• Toolsite
Other skills:
• Closely reviewing MRs to help catch things

Any Projects you worked on that could have gone better, and any thoughts on how we can set ourselves up to avoid those pitfalls in '26
I feel like all of my projects launched very well. However, something I am trying to practice more of is getting all requirements, nice to haves, and alignment of project expectations immediately as opposed to building something and finding out later. Inventory sales history.

## 2026 Self Review

- Customer Deduplication Model
    - Designed a pairwise model that is able to capture much of the nuance in what the business considers records to be duplicates. This offers an 80% reduction in noisy duplicates compared to the previous deterministic system. Also build a retrieval layer using siamese neural networks to generate learned embeddings for fast retrieval of potential matches.
    - Architected the infrastructure to handle this kind of predictions at scale in real time using a mix of Python, Golang, neo4j, and postgres with PGVector.
- Fostering and building more relationships with our internal data science team, helping drive the thinking of what it means to productionize machine learning models at real time scale.
- Consistent max outstanding reviews every year
- Customer Classification Model v2
    - Using ideas from the customer deduplication model, this takes a new angle on what it means to perform feature engineering. Generating embeddings of inventory, normalizing the embeddings, and having product embeddings define a customer allows us to be much more flexible in feature engineering and capture more products.