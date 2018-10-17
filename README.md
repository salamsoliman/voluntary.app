# voluntary.app


## User Overview 

This project is a set of frameworks and an application for an in-browser webRTC-based secure p2p messaging app platform. 

### opening the app

The app can be opened in several ways:

1. by opening https://voluntary.app in a web browser
2. by opening downloading the source and opening the index.html file in a web browser
3. putting the repo on your own local or remote web server and loading index.html from it

### creating an identity

1. navigate to /Identities
2. click on the + button in the next column to create a new identity
3. click on the new identity, then click on it's "profile" row
4. click on the name field and enter a name for the identity

You've now created and named an identity. 
You can find it's public key in it's Profile. 
The public key is how you'll share your identity with other people.
You can create as many identities as you like and use them to separate different parts of your life (work, friends, hobbies, etc).

### adding a contact

1. get a friend to share their public key with you 
2. navigate to one of your identities (the one you'd like to add this contact to) 
3. click on "contacts" and hit the + button at the top of the next column 
4. click on the new contact and then click on it's profile row
5. paste your friend's public key into the public key field and set the name field

You've now added a contact to one of your identities. 
You'll now be able to see their public posts.
If they add you as a contact too, they'll see your public posts and you'll be able to exchange direct messages with them.

### sending a direct message



### posting, replying, reposting, liking








## Developer Overview

### Components 

- an in-browser webRTC-based decentralized messaging platform 
- a desktop-like (e.g. AppKit) UI framework in which apps can be built with no templates or html
- a Miller column based scalable, reactive common UI system which automatically works on desktop, tablets and phones
- a naked objects framework which can generate a UI based on model objects (most apps require no UI code)
- an intergrated client-side transparent persistence framework (most apps require developer to declare stored objects and fields)
- a notifications system which automatically synchronizes the UI, model, and persistence

On top of this system, decentralized apps (dapps) can quicky be built with very little code. 
A decentralized Twitter app is included as an example.

See the docs folder for more developer documentation.
