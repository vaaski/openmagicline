<h1><p align="center">openmagicline</p></h1>
<p align="center">The Magicline API for everybody.</p>

## synopsis

I'm working at a gym that has been using [magicline](https://magicline.com) for well over 10 years now.

When they switched to a completely new web-based interface in about 2016,
using magicline got a lot slower. The new interface not only took a
significant time to get used to, it also runs considerably slower than
the previous (native) one. This sucks for an environment where the
customer expects fast and reliable service.

Openmagicline is a **reverse-engineered**, **strongly-typed** version of
magicline's internal API.

## usage

This is far from feature-complete as I only implement the parts I need.
Feel free to use it, but expect a lot of functionality to be missing.

I am, however, very open to [contributions](#ideas) and this project should be a
solid starting point for anyone who wants to implement missing functionality.

```ts
const magicline = new Openmagicline({
  gym: "gym", // example for https://gym.web.magicline.com
  username: "your username",
  password: "your password",
})

await magicline.login()
await magicline.customer.search("John Doe")
```

## features

- **Strongly-typed** - All API calls and responses are typed
- **Authenticates** - Automatically re-authenticates on session expiry
- **Covered** - [100% test coverage](#testing)

## ideas (contributions welcome)

- detect magicline version and warn if openmagicline is outdated
- improve tests with zod
- verify API responses with zod

## testing

I strive for 100% coverage with automated tests using [`ava`](https://npmr.vaa.ski/ava).

This is very useful for rapidly detecting changes in magicline's internal API.
There will be periodic tests set up using GitHub actions once I consider
openmagicline stable.
