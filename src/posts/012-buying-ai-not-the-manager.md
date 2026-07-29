---
title: "Buying AI, but Not the Manager"
theme: "relationship"
seoTitle: "Why AI Rollouts Fail: Nobody Bought the Manager"
related:
  - "010-relationship-design"
  - "002-my-api-not-my-resume"
  - "003-amplification"
# PLACEHOLDER DATE - Vlad confirms before publish. Thursday, exactly 14 days after 011
# (2026-07-23), i.e. the cadence-correct "every other Thursday" slot. The previous value
# on this branch was 2026-08-04, which is a Tuesday.
date: 2026-08-06T08:00:00+02:00
author: vlad
concepts:
  - "relationship-design"
  - "designed-vs-drifting"
  - "amplification-vs-automation"
subscribeCta: "The tooling is the cheap half. New essays every other Thursday."
description: "A VP asked what the ROI was on all the tech we had bought. Four weeks later the database was firing one event a day. Companies buy the AI and skip the manager who was supposed to carry it across, and what that person actually supplies is not AI expertise but cover: making it survivable to be visibly bad at something new."
deck: ""
cover:
  src: "/images/012-cover.png"
  alt: "On warm off-white paper, three figures of equal height stand in a row. On the left, a human form painted in loose watercolour, terracotta and rust bleeding down into ochre, head bowed and turned inward. On the right, a figure built from flat triangular facets in navy and slate blue, head also bowed and turned inward. Between them stands a third figure the same size as the other two and left unpainted: a faint outline on bare paper, with a soft rainbow wash drifting diagonally through the empty space inside it. The two who are present are turned toward someone who was never filled in."
ogImage: "/images/012-cover.png"
tags:
  - relationship
  - work
videoPending: true
---

## Nobody bought the manager

A VP asked what the ROI was on all the tech we had bought. I was the manager, so I took the question downstairs to the teams who were supposed to be using it, and I looked. The rollout itself had gone beautifully. On day one the congratulations emails went round and everybody said Bravo and a new era was coming, and there was genuine excitement in the room about the new shiny thing. Four weeks later the database was firing maybe one event a day. The last person who actually knew how to use it had either left or been promoted.

That shape repeats, and it repeats almost identically. A company buys the tools, runs the training, sends the announcement, and then waits about six months for the transformation to show up, and it does not show up, and now everyone is slightly embarrassed about the whole thing and nobody wants to be the one to say so out loud. The licences are paid. The usage dashboards are green, or green enough, or IT has still not produced them and now the consultants have to be brought in to find the data, which nobody discussed in any detail although everyone did agree on that beautiful slide where data was everything. And the work looks almost exactly like the work looked before, except faster in the places that were never the bottleneck.

I have a theory about where the money went, and I want to be honest that it is a theory, because most of the evidence I am going to show you is correlational and I am not going to pretend otherwise. The organisation bought the capability and skipped the only person who could have installed it. It bought the AI and it did not buy the manager.

And nobody asked. Not the managers, not the people on the ground who could have walked you to the actual bottleneck in an afternoon and told you plainly what would help and what would sit unused. McKinsey's own senior partner puts it at more than eighty percent of companies reporting no bottom-line impact from what they have invested, and the same piece says in its subtitle that the challenge lies in redesigning workflows and leadership and culture rather than in the technology [1]. You can pay a great deal of money for that sentence. You can also go downstairs, skip the deck, and talk tachles with the people who will have to live inside whatever you sign.

---

## The transmission mechanism

Think about how a new capability actually reaches a person doing the work. It does not arrive through a licence. 

It arrives through the person who decides what the work is, what good looks like, whether it is safe to try something and have it not work, and whether the twenty minutes you just spent arguing with a model was diligence or slacking. That person is your direct manager, and they are the transmission mechanism between the thing the company bought and the thing the company hoped would change. The relationship a person ends up having with these systems exists whether or not anybody sat down and designed it, and its terms get set by default when nobody sets them on purpose [8]. On a team, the person setting them by default is the manager, and setting them by default is exactly what most of them are doing.

Gallup's [State of the Global Workplace 2026](https://www.gallup.com/workplace/349484/state-of-the-global-workplace.aspx) puts a number on it that is worth reading carefully rather than repeating. Among US employees, those who strongly agree that their manager actively supports their team's use of AI are **8.7 times as likely to strongly agree** that AI has transformed how their work gets done, and **7.4 times as likely to strongly agree** that AI gives them more opportunities to do what they do best [2].

Now the caveats, because they matter more than the headline. That is a top-box comparison, strongly-agree against everyone else, which is precisely the kind of framing that produces enormous ratios. It is self-reported. It is correlational, so I cannot tell you that the manager caused the transformation rather than, say, both facts being downstream of a functional team in a functional company. I am not selling you an 8.7x lever, and anybody who does is misreading their own source.

What survives all of that is still the interesting part, and it is directional: the difference between an AI rollout that lands and one that evaporates tracks the manager almost perfectly, and it does not track the tooling much at all. The question I was sent downstairs with was about the tooling, and what I found down there was not about the tooling at all.

Microsoft's [2026 Work Trend Index](https://www.microsoft.com/en-us/worklab/work-trend-index/agents-human-agency-and-the-opportunity-for-every-organization), surveying twenty thousand knowledge workers across ten countries, finds the same shape from a different angle [3].

Where managers actively **modelled** AI use rather than merely permitting it, the report records a 17-point lift in reported AI value, a 22-point lift in critical thinking about their own AI use, and a 30-point lift in trust in agentic AI [3].

Same health warnings apply, self-reported and correlational, and a point lift means percentage points on a survey item rather than anything anyone measured about the actual work. The word doing the work in that finding is modelled. Permitting AI means telling your team the licence is there and the policy allows it. Modelling it means opening the thing in front of them, on a real piece of work that matters to you, and letting them watch you get it wrong twice before it comes out right. The second one is the one that transfers, and it is also the one almost nobody does.

---

## The gap where the money goes

Here is the part that should be embarrassing for an industry that has spent an extraordinary amount of money on this.

**Fewer than one in three** US employees in organisations that have already begun implementing AI strongly agree that their manager actively supports their team's use of it [2]. Not "has heard of it", not "permits it". Actively supports it.

In Germany, a separate Gallup study puts the equivalent figure at 21 percent [4], though I want to flag that these are two different studies and it is not the clean cross-country comparison it looks like.

So the multiplier exists, and it is almost entirely unactivated. The organisation bought the capability, installed it on everyone's laptop, and then left it sitting on the desk of a person who was never told that switching it on was now part of their job, or who was told by means of a PDF called How To Use AI, which lands in the same inbox as the fire drill notice and gets read with the same attention.

And it gets worse, because of what has been happening to that person independently. 

Gallup finds that manager engagement has **dropped nine points since 2022**, falling to 22 percent, with the sharpest fall between 2024 and 2025 [2]. I want to be careful here, because this is a global figure, it is general engagement rather than anything AI-specific, and it began before the current wave.

I am not claiming AI caused it, and the honest version of the claim is smaller and stranger: at the exact moment we decided that the manager would be the mechanism by which AI reached the workforce, the manager was quietly running out of road. We loaded the transmission at the point of its lowest torque.

---

## What the manager is actually being asked to do

The Microsoft data has one more finding in it that reframes the whole thing, and it is the one I would put on a slide if I still made slides.

Leaders are **twice as likely as their employees** to say that reinventing how work gets done with AI is rewarded *regardless of outcome*: 21 percent against 10 percent [3]. Read that again, because it is not a statement about optimism.

It is a statement about who thinks it is safe to fail. The people at the top believe that experimenting is rewarded even when it does not pay off, and the people doing the experimenting mostly do not believe that, and both groups are describing the same company.

That gap is the whole problem, and it explains why the tooling budget keeps failing to convert. Trying a new way of working with AI means being slower and worse at your job for a while, in public, in front of the person who writes your review. That cost is measurable and it is worse than it feels: in a randomised trial, experienced developers given AI tools took 19 percent *longer* on real tasks, and still believed afterwards that they had been about 20 percent faster [6]. Nobody does that on the strength of a licence and a webinar. They do it when the person above them has made it survivable, and made that credible by being visibly bad at it first.

The failure takes a while to surface, because AI feels like speed to everybody at the start. You can suddenly produce far more of almost anything. If you know what you are doing, that is real, and the extra output is work. If you do not, the same speed produces volume that nobody has checked, and it does not vanish, it queues. Anthropic's analysis of four hundred thousand coding sessions found the gap where you would expect it: among sessions that ran into trouble, the share that still reached a verified result went from 4 percent for novices to 15 percent for experts, and one in five novice sessions in difficulty was simply abandoned [7]. It becomes a backlog of things somebody has to deal with three months later, and the person who deals with it is almost always the manager, which is the second job nobody mentioned when the licences arrived. Milena has made the sharper version of this point in the series already: the same system can amplify you or quietly take over the part of you that was doing the thinking, and what decides which one happens is not the tool but what you ask it to amplify [9]. On a team, somebody decides that, and mostly it gets decided by not being decided.

Which means what the manager is being asked to provide is not AI expertise. It is cover. Cover is a specific and fairly unglamorous thing. It is saying out loud, before anybody needs it, that the hour somebody spent failing to get a useful answer out of a model is not an hour that will come up in their review. It is taking the first bad result yourself, in front of them, on something that matters to you. It is having an answer ready for the person above you when the numbers dip in month two, so that the dip is a cost you budgeted rather than an incident you are explaining. None of that requires the manager to understand the model. It requires them to spend their own credibility, and credibility is the one thing the licence does not come with.

---

## Coaching the manager, not training the workforce

I have spent a long time now on the other side of this, working with managers rather than rolling out tools, and the thing I would say to anyone about to sign a large AI contract is that you have almost certainly misprized the two halves of it.

The tooling is the cheap half, and it is the half that arrives on a predictable date. The expensive half is the twenty or thirty people in the middle of your organisation who decide, mostly unconsciously and mostly in one-to-ones, whether this is something the team does properly or something the team performs for the dashboard. If the ROI on coaching those people exceeds the ROI on the tooling, and I think it does, then the budget you have just approved is upside down, and it will keep being upside down no matter which model you standardise on next quarter.

**Where I might be wrong.** The strongest objection is that I have the arrow backwards. The survey numbers above are correlational, and a perfectly good story runs the other way: healthy teams with engaged managers adopt everything faster, AI included, and the manager is a symptom of a functional organisation rather than the cause of a successful rollout.

If that is true then coaching managers is treating the readout instead of the illness, and the real work is whatever produced the disengagement in the first place. I do not have a clean test that separates those two for managers specifically, and I would like one.

There is one experiment that gets close, and it is worth being exact about what it does and does not show. Kim, Kim and Koning ran a [randomised trial across 515 startups](https://ssrn.com/abstract=6513481) in a three month accelerator [5]. Every firm in it received the technical AI training, the API credits and the mentorship. The only thing the treated firms received on top was information about how other companies had reorganised their work around AI. Those firms went on to find 44 percent more use cases, complete 12 percent more tasks, and generate 1.9 times the revenue of the control group, and the authors describe the result as causal evidence, which they are entitled to do because they randomised it [5].

That does not vindicate me. These are startups rather than managers inside established organisations, it is a working paper rather than a peer-reviewed one, and the treatment was a set of case studies rather than anything resembling coaching. What it does settle is the half of my argument I could not settle myself: hold the tooling constant, vary only the understanding of where the work ought to change, and the performance moves. The tooling was never the variable. That is the claim I am actually making, and somebody has finally tested it under conditions where the arrow can only point one way.

What I would still watch for, on the manager question specifically: an organisation that invests seriously in its managers and sees no differential AI adoption against a matched peer that only bought licences. That would tell me I am wrong, and I would want to know.

The second objection is that this is convenient for me, since coaching managers is roughly what I do. I notice that. It does not make the numbers different, and it does mean you should make me argue for it rather than take it.

---

## The thing nobody put in the contract

The contract you signed has a number of seats in it, a support tier, a data-processing addendum, and a start date. It does not have a line for the person who has to make it safe to be bad at this in public for a month. I wrote early in this series about turning up to an interview with my own digital team already running, and about how no employment contract yet knows what to do with that [10]. This is the same gap seen from the buying side: the paperwork has caught up with the software and not with the people around it.

That line does not exist on any invoice I have seen. It is still the thing you are buying, or failing to.

So before the next renewal: who, by name, is going to switch this on for your team?

---

## References

1. Alexis Krivkovich with Lucia Rahilly, "AI is everywhere. The agentic organization isn't—yet," *The McKinsey Podcast* (McKinsey & Company, 2 April 2026). The source of the figure that more than 80 percent of companies say they are not yet seeing bottom-line impact from their AI investment, and of the subtitle placing the real challenge in redesigning workflows, leadership and culture rather than in the technology. Worth knowing what this is: an edited podcast transcript, not a research report. It gives no sample size, instrument or method for the 80 percent, which is why the essay attributes it to a senior partner speaking rather than to a survey. https://www.mckinsey.com/capabilities/people-and-organizational-performance/our-insights/ai-is-everywhere-the-agentic-organization-isnt-yet
2. Gallup, *State of the Global Workplace 2026*. Carries three of the numbers used here: the 8.7× and 7.4× ratios for employees whose managers actively support AI use, the finding that fewer than one in three US employees in AI-implementing organisations strongly agree they have that support, and the nine-point fall in manager engagement since 2022 to 22 percent. Every ratio is a top-box comparison of "strongly agree" against everyone else, which is what makes the ratios large; all of it is self-reported and correlational, and the engagement figure is global and general rather than anything AI-specific. https://www.gallup.com/workplace/349484/state-of-the-global-workplace.aspx
3. Microsoft, *2026 Work Trend Index Annual Report* ("Agents, human agency, and the opportunity for every organization"). n=20,000 knowledge workers across 10 countries, fielded with Edelman DxI, February to April 2026. The source of the lifts where managers modelled AI use rather than merely permitting it, and of the gap between leaders and employees on whether reinventing work with AI is rewarded *regardless of outcome*, 21 percent against 10 percent. A "point lift" here means percentage points on a survey item, not a measurement of the work itself. https://www.microsoft.com/en-us/worklab/work-trend-index/agents-human-agency-and-the-opportunity-for-every-organization
4. A Gallup study in Germany, reported inside *State of the Global Workplace 2026* (reference 2), which states: "A Gallup study in Germany found similarly low support: 21% of employees in organizations that use AI said their manager actively supports their team's use of AI." It is a **separate study** from the US survey that produces the other Gallup numbers here, so the two are not a like-for-like cross-country comparison, and the essay says so where it uses the figure. The report does not date the German study or cite it further, which is why no year is claimed for it. https://www.gallup.com/workplace/349484/state-of-the-global-workplace.aspx
5. Hyunjin Kim, Dahyeon Kim and Rembrand Koning, "Mapping AI into Production: A Field Experiment on Firm Performance," INSEAD Working Paper 2026/20/STR, 30 March 2026. A randomised controlled trial across 515 high-growth startups in a three-month accelerator, preregistered on the AEA RCT Registry as AEARCTR-0016746. Both arms received the technical AI training, the API credits and the mentorship; only the treated firms also received information on how other companies had reorganised their work around AI. The one piece of genuinely causal evidence in this essay, and it bears on the layer rather than on the manager. Still a working paper, not peer-reviewed. https://ssrn.com/abstract=6513481
6. METR, "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity" (July 2025). A randomised trial in which experienced open-source developers took **19 percent longer** on real tasks in their own repositories when allowed AI tools, having predicted a 24 percent speed-up and still estimating afterwards that they had been about 20 percent faster. The perception gap is the part that matters here: the person paying the cost is the least able to see it, which is why somebody above them has to budget for it. Read the limits: 16 developers, working on mature codebases they already knew deeply, with early-2025 tooling, and it measures time rather than quality. https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/ · https://arxiv.org/abs/2507.09089
7. Zoe Hitzig, Maxim Massenkoff, Eva Lyubich, Shaoyi Zhang, Ryan Heller and Peter McCrory, "Agentic coding and persistent returns to expertise" (Anthropic, 16 June 2026). Roughly 400,000 interactive sessions from about 235,000 people, October 2025 to April 2026. Among sessions that hit trouble, the share still reaching a verified result rose from 4 percent for novices to 15 percent for experts, and 19 percent of novice sessions in difficulty were abandoned outright against 5 to 7 percent for everyone else. The domain is coding specifically, so reading it across knowledge work generally is an extrapolation rather than a finding. https://www.anthropic.com/research/claude-code-expertise
8. Vlad Sterngold, *Relationship Design* (The Symbiotic Mind, Post 010). The pillar essay for this one: the relationship with an AI system already exists and already carries terms, and if you do not set your half of them deliberately you inherit them by default. This essay is that argument moved from the individual to the team, where the person setting the terms by default is the manager. https://symbiotic-mind.com/posts/010-relationship-design/
9. Milena Nikolova, *Amplification* (The Symbiotic Mind, Post 003). The distinction the backlog section rests on: the same system can amplify you or take over the part of you that was doing the thinking, and what decides which is not the tool but what you ask it to amplify. https://symbiotic-mind.com/posts/003-amplification/
10. Vlad Sterngold, *My API, Not My Resume* (The Symbiotic Mind, Post 002). The competitive unit is the person plus the AI team they bring, and employment contracts have not caught up with that. The closing section here is the same gap seen from the buying side rather than the hiring side. https://symbiotic-mind.com/posts/002-my-api-not-my-resume/

---

🗣 **ME (43%)**: The opening, which is a thing that happened. A VP asked what the ROI was on all the tech we had bought, I took the question downstairs, and four weeks later the database was firing about one event a day while the last person who knew how to use the thing had either left or been promoted. The refusal to let a consultant answer a question the people on the ground could have answered in an afternoon, and the instruction to go down there and talk tachles instead. The observation that AI speed is real for people who know their domain and a queue of unchecked work for everybody else. The insistence that what a manager is being asked for is cover rather than expertise. And the decision to open on the room rather than on the pattern.

🤖 **AI (57%)**: Most of the sentences, the order they arrive in, and the caveat apparatus. Assembling the source pack and checking every number against the primary publications rather than against the summaries, which is how two claims in the research brief behind this piece turned out to be misstated and were dropped, and how the widely-quoted figure about most AI pilots failing was kept out on the grounds that it counts the organisations that never piloted at all. The references, and the admission attached to each one about what it does not show.
