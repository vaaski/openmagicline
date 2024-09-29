<h1><p align="center">Openmagicline</p></h1>
<p align="center">The Magicline API for everybody.</p>

## Synopsis

I'm working at a gym that has been using [magicline](https://magicline.com) for
well over a decade now.

When they switched to a completely new cloud-based web-interface in about 2016,
using magicline got a lot slower. The new interface not only took a
significant time to get used to, it also runs considerably slower than
the previous (native) one. This sucks for an environment where the
customer expects fast and reliable service.

I build custom software to speed up the workflow, and Openmagicline is the
adapter that powers it.

Openmagicline is a **reverse-engineered**, **strongly-typed** version of
magicline's internal API.

## Usage

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

## Features

- **Strongly-typed** - All API calls and responses are typed
- **Authenticates** - Automatically re-authenticates on session expiry
- **Covered** - Probably close to 100% test coverage

## Roadmap

- Detect magicline version and warn if openmagicline is outdated
- Improve tests and verify API responses with something like zod

## New in v2

- Added setting `organizationUnitId` per instance to avoid re-checking it.
  - This is optional, it'll get the default unitID if not provided.
- Added checkoutByCustomerID to Checkin class which utilizes a cached map of
  customerID -> checkinID to avoid having to re-list checkins.
- Switched to [Bun](https://bun.sh) for package management and testing.
- Switched to [ofetch](https://npmr.vaa.ski/ofetch) for HTTP requests.
- Switched to [Biome](https://biomejs.dev) for linting and formatting.
