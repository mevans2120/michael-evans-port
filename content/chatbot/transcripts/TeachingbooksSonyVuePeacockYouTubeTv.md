---
questions:
  - What is TeachingBooks and what did Michael do for it?
  - What did Michael work on for Sony PlayStation View?
  - What did Michael work on for Peacock?
  - What projects did Michael work on with YouTube?
---
# Project Portfolio

## Teaching Books

I started working on Teaching Books when an old family friend, Nick—a former owner of Teaching Books—reached out and asked if I knew anything about responsive websites. This was when I was in the process of founding Before Labs, but I also needed to make some money, and I was working with some of my friends at Penzo on this.

When Nick called me and asked about responsive websites, I said, "Absolutely. That's what I've been working on for the past four years."

### About the Product

Teaching Books is an app for teachers. It has a big library full of books and teaching resources on those books—books that kids or students would read, along with materials that teachers can use to help teach those books. The product is sold to states and local governments.

It was Nick's passion project and had been around for about 20-25 years when we started working on it. I was 18 years old at the time. The site was written in Perl and was badly in need of a refresh. It was one of those websites where the content was wonderful but totally obscured by dated, clunky design.

### The Strategy

The strategy for Teaching Books was honestly simple. Sometimes it really is that straightforward:
- Make sure the books shine—they should be the star of the show
- Highlight the book pages and their resources
- Make it clear what resources are available
- Make it easy to find the books
- When you find them, clearly show what resources are available

We partnered with our friends at a now-defunct agency called Wild Short for help with the design, and I was working with Penzo on the build.

### Technical Approach

We built the front end using a more traditional framework. The backend was using Perl, and sometimes you really can't redo the backend. Maybe now with AI you could, but the idea of taking 18 years of operational processes that had been baked into this application and just redoing it for a company—especially one that's not minting money (when you're selling to educational districts, states, and local governments, they don't have the biggest budgets for these products)—wasn't feasible.

So we decided to leave the backend roughly as is, rebuild the front end, learn a bit about Perl, and go back in time. We left the backend and operational processes that the whole business was based on largely intact. I think that was the best decision we made on that project.

---

## Sony PlayStation View

I started working on Sony PlayStation View when I was contracting with Major League Baseball Advanced Media (MLB.tv). They've since been purchased by Disney/ABC. This was about 12 years ago.

### MLB Advanced Media's Innovation

Major League Baseball Advanced Media were the first ones to live stream sports—or really anything—and do a very good job of it. They got started doing this because one of the interesting things about baseball is that all the teams basically pooled their digital media rights. Every team's digital media rights were run by MLB Advanced Media.

They had streaming radio, then started streaming baseball, and got progressively better at it. They realized that no one else could really stream like they could. At the time, live streaming was described as "laying down the train tracks as the train is coming."

They used HLS (HTTP Live Streaming), which is an Apple format that allows you to stream over the internet in 6-second chunks, which you rebuild on the fly with the instructions you're given. They were really good at it.

They streamed March Madness, the Masters, and a ton of different sporting events. You might not have known they were behind it, but you would know their streaming quality was vastly superior to others at the time.

### The Sony View Project

This is why Sony decided to partner with MLB.tv on a PlayStation 3 product called Sony View. Sony View was a cable replacement—an OTT (over-the-top) app. Sony's vision was: all on demand, everything for cable. Everything that is ever streamed on cable should be on demand and available.

This presented a design challenge. I worked with them on the proof of concept: can we stream both from a design perspective and technology perspective, and have it work?

The technology was actually, in many ways, more straightforward than the design. Streaming stored content (as opposed to live content) is easier.

### The Design Challenge

The main challenge for me, because I was working on the UX design, was: how do we take these disparate data sources?

People are used to the TV guide, which shows when things are on, what kind of show it is, and how long it's on for. We selected a vendor for this metadata (there were a couple to choose from).

It turns out that the same movie will be streamed on AMC and also on ABC sometimes, but they'll have different metadata. Maybe it'll be called a "gangster movie" on one and a "crime drama" on another—it's the same movie, just using different metadata.

The solution I created was a taxonomy that unified this metadata, trying to keep it as simple as possible with a process for adding to it. If one says "gangster movie," let's call it "crime" or "drama." I filled out that mapping and made sure that when we had the same show from different providers with different data sources, we were able to translate it into one unified data source.

### Outcome

The good news: we were able to get the proof of concept working, where we were streaming live and stored content.

Sadly, the big five content providers did not want you to be able to have everything available on demand. You had to basically say you were going to "record" something, which would give you access to that show on demand. There were some other complicated rules around content and who could view it.

---

## Peacock

I worked on Peacock at Raw Materials. At that point, I'd already worked on YouTube TV and YouTube.

### Big Picture Strategy Work

At Raw Materials, I worked on several projects—many of them were big picture strategy and ideation exercises. These were inspirational ideas for products that had already shipped: what are some things that can be added to the roadmap? What can inspire the roadmap?

One of the most notable projects was exploring the idea of your phone as a second screen. While you're watching a show or movie, can your phone play a part?

The honest answer is: not really. The best second screen app is probably Twitter or Bluesky.

Nearly every TV company has said, "Hey, 80% of people watching TV have a phone in their hands. Let's see if we can have them engaged in both places." 

I think there are some ideas that could ultimately work—maybe when cooler features come in. We tried our best to show ideas like diving deep on stats around a particular player while they're playing. Some of this stuff will probably ultimately see the light of day, perhaps at the Olympics.

### White Label Product

The more impactful work we did was taking Peacock and turning it from just a standard product into what we called a white label product. Other cable providers and content providers could use the Peacock design system and technology, brand it, and deliver it to their customers.

This was really about engineering: taking the existing design system and speccing it out clearly. What goes where? How do we give content providers really good rules and onboarding for when they're setting up their own versions of Peacock?

That product is currently being used by some European cable providers.

---

## YouTube TV

I worked with YouTube while I was at Working Not Working Co.

### YouTube Projects

I worked on a few projects there. Two more notable ones were:

**YouTube Comments Improvement**  
How can we make YouTube comments a little better? YouTube comments are often considered to be the worst place on the internet. What are some things we can do to inspire people to be less awful to each other? 

Also, if you've ever seen live chat when something is extremely popular—just this stream of comments that's too much for a normal person to read—how do we show you the highlights or show it in a way that's readable and not crazy?

**YouTube Shopping**  
We did designs for YouTube Shopping, allowing creators to offer merch for their products and shop inside of YouTube.

### YouTube TV Web App

The last thing was YouTube TV. I worked on how we take YouTube TV, which Working Not Working Co. had designed, and translate it for the web app. I worked on building the YouTube TV web app.

Honestly, YouTube TV is one of my favorite products that I've both used and worked on.
