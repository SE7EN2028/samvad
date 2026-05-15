# Samvad

A real-time chat application built because I wanted to see how Socket.io actually works and what happens when you throw it into a React app.

Samvad (which means "conversation" in Hindi, if you were wondering) is basically a room-based chat platform where people can jump into different rooms and talk to each other in real-time. Think Slack, but simpler. Think Discord, but lighter. Think... just a chat app that works.

## Why I Built This

I was learning Socket.io and kept thinking "okay so how does real-time stuff ACTUALLY work?" So instead of just doing tutorials, I decided to build something real. Now I have a working chat app that refreshes instantly when someone types. Pretty cool.

## Features (The Stuff That Works)

- **Real-time Messaging** - Type something, boom, it shows up immediately. No refresh needed.
- **Room-based Chat** - Create rooms or join existing ones. Keep conversations organized.
- **User Presence** - See who's online, who's typing, that kind of thing
- **Responsive UI** - Works on desktop and looks okay on mobile too (mobile not tested much though)
- **No Database Complexity** - Stores stuff in MongoDB but honestly it's pretty straightforward

## What I Learned

- Socket.io is actually pretty elegant once it clicks
- Real-time systems are harder than they look (latency issues, reconnection logic, all that fun stuff)
- CSS Grid is your friend
- Testing socket connections is a pain

## Tech Stack

- **Frontend**: React 
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Real-time**: Socket.io (the whole point)
- **Styling**: CSS

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB
- A willingness to deal with my code

### Installation

```bash
# Clone it
git clone https://github.com/SE7EN2028/samvad.git
cd samvad

# Frontend setup
cd samvad/client
npm install
npm start

# Backend setup (in another terminal)
cd samvad/server
npm install
npm start
```

## Project Structure

```
samvad/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                    # Node/Express backend
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API endpoints
│   ├── controllers/          # Business logic
│   ├── socket/              # Socket.io handlers
│   ├── server.js            # Entry point
│   └── package.json
└── README.md
```

No polling, no refresh. Just... instant. That's the whole magic.

## What I'd Add 

- Proper authentication (JWT or something)
- Message persistence
- Private DMs between users
- User profiles
- Emoji support (okay this is priority #1 actually)
- Message reactions
- File sharing
- Video calls (jk, that's too much)
- Actual error handling
- Tests

## Deployment

It's currently deployed on Render (because it's free and decent). The link is [here](https://samvad-s715.onrender.com/) if you want to poke around.

Fair warning: Render spins down free tier apps after 15 minutes of inactivity, so the first load might be slow. Very slow. Have patience.

## Development Notes

Running it locally is faster. Like, way faster. Render is nice but can't compete with `localhost`.

If you're testing Socket.io stuff, open multiple tabs and chat with yourself. It's weirdly fun.

## Contributing

Honestly if you want to add stuff, go for it. I'll probably merge it if it doesn't break things. No promises though.

## License

MIT because I'm not trying to be complicated about it.

## FAQ

**Q: Is this production-ready?**
A: No. Not even close. It's a learning project that happened to work.

**Q: Can I use this for actual work?**
A: You could, but I wouldn't. Add authentication at least.

**Q: Why no database persistence?**
A: Lazy. Also, I was focused on the real-time part.

**Q: Can you add `[feature]`?**
A: Maybe. Open an issue and we'll see.

**Q: Why is the code so messy?**
A: Because it's a side project and side projects don't need to be perfect.

**Q: Did you test this?**
A: Tested it manually by spamming messages. That counts, right?

**Q: Why Hindi name?**
A: Because it sounds cool and "samvad" literally means conversation. Plus, why not.

---

## Learning Resources (If You're Into That)

If you want to understand how this works:
- Socket.io docs - https://socket.io/docs/
- MERN tutorial - There's a million of them
- Real-time systems in general - Start with polling, then WebSockets, then Socket.io

## The Real Talk

This project taught me that building something real is way better than following tutorials. You hit actual problems. You google random errors at 2am. You fix stupid bugs that make you feel dumb. And that's the good stuff.

If this helps anyone understand how real-time chat works, awesome. If you just want a simple chat app to mess around with, cool. If you want to use this in production, please add authentication first. I'm begging you.

---

Have fun breaking things.
