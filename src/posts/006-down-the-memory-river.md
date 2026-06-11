---
title: "Down the memory river with AI"
date: 2026-06-11T08:00:00+02:00
author: vlad
subscribeCta: "Human memory and AI memory differ more than you think. New essays every other Thursday."
description: "Human memory and AI memory are not the same kind of thing, and treating them as one will quietly mislead you. A naive builder's field notes: what each kind of memory is for, why giving an AI more memory can make it worse, and why the real skill is knowing what to keep, and what to ask."
deck: ""
cover:
  src: "/images/006-cover.png"
  alt: "A wide watercolor river valley split into two styles: a warm, hand-painted ochre-and-amber left bank with rolling hills, scattered trees, and a small lone human figure at the water's edge; and a cool navy-and-teal right side where the mountains are rendered as low-poly triangles linked by a grid of dots and lines, with a single bright orange map-marker pin set on the dry geometric ground a short way from the water. A river runs down the centre, joining the two halves. Three spheres hang in the pale sky, one of them striped in rainbow colours."
ogImage: "/images/006-cover.png"
tags:
  - behavior
  - memory
# youtubeId: ""  # VIDEO PLACEHOLDER — add when the motion-cover / video version is produced (see VladWriting video-placeholder.md)
---

Memory is a curious thing. I was on Google Maps looking for a city my brother had told me about, a place along the river Mosel where he says he wants to retire one day. I was sure I'd found it. My memory was reading the name off the map, and I was convinced: this is the one, it can't be any other. There was just one problem. The Mosel was about a hundred kilometres from the city I was staring at.

I kept moving around the map. My partner, curious where this place was, leaned over and pointed at a spot right on the river, and *voilà*, there it was. The city my brother had meant. It sounded different. It was spelled different. And it was the right one. But the little grey area between my eyes had had a different idea, and held onto it with complete confidence.

That little grey area doesn't replay memories, it rebuilds them. Every time you recall something, you slightly rewrite it. It is also embodied: the body is part of the machinery, not just the brain (Ianì, 2019). Forgetting, the thing we treat as failure, isn't a malfunction at all. It's an active process the brain runs on purpose, with the prefrontal cortex deliberately suppressing memories (Anderson & Hulbert, 2021), and it earns its keep: forgetting is part of how we generalize, stay current, and regulate emotion (Nørby, 2015). My confidently-wrong city wasn't a bug. It was memory doing exactly what memory does.

I should be honest about how I know any of this. I didn't survey the field. I pulled a small handful of papers, kept the few facts that genuinely surprised me, and stopped. Treat the above as a window, not a map.

I think a lot about memory, and I'll admit I'm sometimes worried about losing mine, which comes naturally with age. So I'm curious what digital space and AI can give me. Not a perfect human memory; that isn't something I can solve, and it isn't even what I want. What I want is to use my memory and the machine's memory together, in a very optimal way.

Because they are not the same, mine and the AI's. I came at my own AI's memory the way I come at most things: as a product manager and a forever learner, not a memory scientist or a systems engineer. I wanted it to remember the way a good colleague remembers, and I built toward that gut feeling. I almost certainly don't use the best methods. So take this as field notes from a naive builder, in the good sense: naive enough to keep expecting the machine to just carry things the way a person does, and surprised, every time, when it didn't.

The first surprise was that more memory made things worse, not better. I spent about three months teaching my AI everything: notes, rules, shortcuts, the lot. Then one day it spent roughly three hours untangling its own accumulated notes and never got to the work I'd actually asked for. I deleted almost all of it and kept a single page.

The second surprise was stranger, and it's where Mosel comes back. The machine would tell me something with total confidence that used to be true and wasn't anymore. It would point me at something that no longer existed, or treat a decision we'd made weeks earlier as if it still stood. Exactly my mistake on the map. Except I had the small doubt that made me keep scrolling, and a partner who pointed at the river. The machine had neither. It served the old version with the same certainty as the new one, and never once felt the "wait, is that still right?"

I kept wanting that to be a flaw in my own setup, something more memory or better search would cure. It isn't. AI memory degrades as it gets longer: models use the start and end of a long context far better than the middle (Liu et al., 2023 / TACL 2024). The fact that stopped me cold is that it fails even when the right answer is perfectly retrieved and placed right in front of it. Length alone drops performance by 13.9% to 85%, independent of how good the retrieval was (Context Length Alone Hurts LLM Performance Despite Perfect Retrieval, EMNLP 2025 Findings). "Just give it a bigger memory and better search" does not solve this. One industry study (Chroma's "context rot," not peer-reviewed) found the same slide starting well before the memory was anywhere near full, across many leading models, so it isn't one company's quirk.

So I've stopped trying to make the machine's memory more like mine. I keep the separation clean, and I enjoy the outcome more for it. What I want from digital memory isn't a copy of my own. It's leverage for the one small superpower I think I do have: thinking quick, connecting dots across very different spaces, ideas, domains. I'm not claiming to be the best at it, but I see it as mine. With digital memory, that kind of connecting is now genuinely possible at a scale I couldn't reach alone.

What's left for me to learn is how to ask. A good question doesn't make the machine's memory bigger or smarter on its own. What it changes is what I can pull out of it: the sharper the line of questioning, the deeper the connections it will make across everything it holds. The memory is the machine's job now. Mine is two things: asking well enough to reach what's already in there, and deciding what was worth keeping in the first place.

But there's a part of this I'm still turning over. With people, the way we really find each other is by listening and then staying with the questions that follow. Asking is how I show I care, and how I learn who you are. The machine already listens without tiring, so I keep wondering whether my questions can do the other half too: not just fish old things back out, but slowly change the shape of what's kept. The more time I spend with it, the more it feels as if the same rule holds on both sides of the screen: asking isn't only how you find things again. It's part of how the memory forms.

I want to be careful not to romanticise it. The machine isn't learning to care about me; it's consolidating what my questions surface. None of it happens without the infrastructure underneath. That is the floor: over bad plumbing, no question is good enough; over good plumbing, the question becomes the lever. I haven't proven this to myself yet, not properly, not with my own setup. But it has already changed what I think the work is. Back on the map, two small things saved me: a flicker of doubt, and someone who pointed at the river. The machine has neither, so with it I have to be both, the doubt that keeps me scrolling and the finger on the water. The discipline was never accumulation. It's knowing what to keep, and what to ask.

---

*In the next post: the harder question. Not how to remember more, but what should be allowed to become memory in the first place.*

---

## References

1. Nørby, S. (2015). *Why Forget? On the Adaptive Value of Memory Loss.* Perspectives on Psychological Science. DOI: 10.1177/1745691615596787 · PMID: 26385996.
2. Anderson, M. C., & Hulbert, J. C. (2021). *Active Forgetting: Adaptation of Memory by Prefrontal Control.* Annual Review of Psychology. DOI: 10.1146/annurev-psych-072720-094140 · PMID: 32928060.
3. Ianì, F. (2019). *Embodied Memories: Reviewing the Role of the Body in Memory Processes.* Psychonomic Bulletin & Review. DOI: 10.3758/s13423-019-01674-x.
4. Liu, N. F., et al. (2024). *Lost in the Middle: How Language Models Use Long Contexts.* Transactions of the Association for Computational Linguistics (TACL). arXiv:2307.03172.
5. *Context Length Alone Hurts LLM Performance Despite Perfect Retrieval.* (2025). Findings of EMNLP 2025. arXiv:2510.05381.
6. Chroma Research. (2025). *Context Rot: How Increasing Input Tokens Impacts LLM Performance.* research.trychroma.com/context-rot. *(Industry report; not peer-reviewed.)*
7. Chhikara, P., et al. (2025). *Mem0: Building Production-Ready AI Agents with Scalable Long-Term Memory.* arXiv:2504.19413.
8. Xu, W., et al. (2025). *A-MEM: Agentic Memory for LLM Agents.* arXiv:2502.12110.
9. Park, J. S., et al. (2023). *Generative Agents: Interactive Simulacra of Human Behavior.* UIST '23. arXiv:2304.03442.
10. Huang, K., et al. (2017). *It Doesn't Hurt to Ask: Question-Asking Increases Liking.* Journal of Personality and Social Psychology. DOI: 10.1037/pspi0000491.

---

🗣 **ME (50%)**: The scene on the Mosel, the lived experience of building my own AI memory, the question at the centre, and where it lands.

🤖 **AI (50%)**: The outside research and its verification, two of the three sections drafted from my notes, the weave into one essay, and the editing.
