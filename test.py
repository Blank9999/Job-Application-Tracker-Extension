import spacy
from collections import Counter
nlp = spacy.load("en_core_web_trf")
text = """Skip to main content
 (0)
-
-
SOFTWARE ENGINEER INTERN (TORONTO) - SPRING 2025
Location  Toronto, Ontario, Canada
Category  Engineering
Req ID  3265
APPLY NOW 
SAVE JOB

Build the future of the AI Data Cloud. Join the Snowflake team.

Snowflake started with a clear vision: develop a cloud data platform that is effective, affordable, and accessible to all data users. Snowflake developed an innovative new product with a built-for-the-cloud architecture that combines the power of data warehousing, the flexibility of big data platforms, and the elasticity of the cloud at a fraction of the cost of traditional solutions. We are now a global, world-class organization with offices in more than a dozen countries and serving many more.

We’re looking for dedicated students who share our passion for ground-breaking technology and want to create a lasting future for you and Snowflake.

WHAT WE OFFER:

Paid, full-time internships in the heart of the software industry

Post-internship career opportunities (full-time and/or additional internships)

Exposure to a fast-paced, fun and inclusive culture

A chance to work with world-class experts on challenging projects

Opportunity to provide meaningful contributions to a real system used by customers

High level of access to supervisors (manager and mentor), detailed direction without micromanagement, feedback throughout your internship, and a final evaluation

Stuff that matters: treated as a member of the Snowflake team, included in company meetings/activities, flexible hours, casual dress code, accommodations to work from home, swag and much more

When return to office in effect, catered lunches, access to gaming consoles, recreational games, happy hours, company outings, and more

WHAT WE EXPECT:

Desired class level: 3rd/4th year Undergraduates, Masters, or PhD

Desired majors: Computer Science, Computer Engineering, Software Engineering, or related field

Required coursework: algorithms, data structures, and operating systems

Recommended coursework: cloud computing, database systems, distributed systems, and real-time programming

Bonus experience: working experience, research or publications in databases or distributed systems, and contributions to open source 

When: Spring 2025 (January - April 2025) 

Duration: 12 week minimum, 12-16 weeks recommended

Excellent programming skills in C++ or Java 

Knowledge of data structures and algorithms

Strong problem solving and ability to learn quickly in a dynamic environment

Experience with working as a part of a team

Dedication and passion for technology

WHAT YOU WILL LEARN/GAIN:

How to build enterprise grade, reliable, and trustworthy software/services

Exposure to SQL or other database technologies

Understanding of database internals, large-scale data processing, transaction processing, distributed systems, and data warehouse design

Implementation, testing of features in query compilation, compiler design, query execution

Experience working with cloud infrastructure, AWS, Azure, and/or Google Cloud in particular

Learning about cutting edge database technology and research

POSSIBLE TEAMS/WORK FOCUS AREAS:

Data Applications Infrastructure, Data Marketplace, Data Privacy, Data Sharing 

High performance large-scale data processing

Large-scale distributed systems

Software-as-a-Service platform

Software frameworks for stability and performance testing

Every Snowflake employee is expected to follow the company’s confidentiality and security standards for handling sensitive data. Snowflake employees must abide by the company’s data security plan as an essential part of their duties. It is every employee's duty to keep customer information secure and confidential.

Snowflake is growing fast, and we’re scaling our team to help enable and accelerate our growth. We are looking for people who share our values, challenge ordinary thinking, and push the pace of innovation while building a future for themselves and Snowflake.

How do you want to make your impact?

APPLY NOW 
SAVE JOB
Snowflake is an equal opportunity employer. All qualified applicants will receive consideration for employment without regard to age, color, gender identity or expression, marital status, national origin, disability, protected veteran status, race, religion, pregnancy, sexual orientation, or any other characteristic protected by applicable laws, regulations and ordinances.
toronto canada
EXPLORE SNOWFLAKE ​​​​IN TORONTO
SIMILAR JOBS
Software Engineer Intern (Toronto) - Summer 2025

Location
Toronto, Ontario, Canada 
Category
Engineering 
ReqId
3268

SOLUTION INNOVATION - Platform Specialist

Location
Remote - Remote, New York, United States 
Category
Engineering 
ReqId
REQ12581

STAY IN THE KNOW

Receive updates on similar jobs once a week

Enter Email address (Required)
ACTIVATE
SHARE THIS OPPORTUNITY
Share via email
Share via Facebook
Share via LinkedIn
Share via twitter
ABOUT US
About Snowflake
Investor Relations
Newsroom
ESG at Snowflake
MORE RESOURCES
Hiring Process
Snowflake for Good
Talent Community
LIFE AT SNOWFLAKE
Culture
Benefits
Locations
Snowlife Blog
Leadership
FOLLOW US
Separator
© 2025 Snowflake Inc. All Rights Reserved
Privacy Notice
Site Terms
Cookies Settings
Equal Opportunity
Job Application Detected!

We detected that this page is related to a job application. Do you want us to add this

Create New File Open Existing File"""

text = text.lower()
# Process the text
doc = nlp(text)

label_counts = {"ORG": Counter(), "GPE": Counter()}

# Access named entities
# for ent in doc.ents:
#     print(f"Text: {ent.text}, Label: {ent.label_}, Start: {ent.start}, End: {ent.end}")

# entities = {"ORG": [], "GPE": [], "TITLE": []}
    
#     # print([(w.text, w.pos_) for w in doc])

# for ent in doc.ents:
#     if ent.label_ == "ORG":
#         entities["ORG"].append(ent.text)  # Company name
#     elif ent.label_ == "GPE":
#         entities["GPE"].append(ent.text)  # Location
#     elif ent.label_ == "PERSON":  # Job title approximation (customize if needed)
#         entities["TITLE"].append(ent.text)

# # Attempt pattern matching for job title
# job_title = None
# for token in doc:
#     if token.pos_ == "NOUN" and "job" in token.text.lower():
#         job_title = token.text
#         break

# # Combine results
# extracted_data = {
#     "company_name": entities["ORG"][0] if entities["ORG"] else None,
#     "location": entities["GPE"][0] if entities["GPE"] else None,
#     "job_title": job_title or (entities["TITLE"][0] if entities["TITLE"] else None)
# }

# print(f"Extracted data: {extracted_data}")

for ent in doc.ents:
    if ent.label_ in label_counts:
        label_counts[ent.label_][ent.text] += 1  # Increment count for the entity text

# Find the highest appearance word for each label
most_common_words = {
    label: counts.most_common(1)[0] if counts else None
    for label, counts in label_counts.items()
}

# Output results
print("Entity Counts by Label:")
for label, counts in label_counts.items():
    print(f"{label}: {dict(counts)}")

print("\nMost Common Words by Label:")
for label, word_data in most_common_words.items():
    if word_data:
        print(f"{label}: '{word_data[0]}' with {word_data[1]} appearances")
    else:
        print(f"{label}: None")

        