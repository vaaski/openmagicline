<h1><p align="center">openmagicline</p></h1>
<p align="center">the magicline API for everybody.</p>

## synopsis

I'm working at a gym that uses [magicline](https://magicline.com) for well over 10 years now.

When they switched to a completely new web-based interface in about 2016,
the speed of our workflow has decreased significantly. The new interface
not only took a significant time to get used to, it also runs considerably
slower than the previous (native) one. This sucks for an environment where
the customer expects fast and reliable service.

Openmagicline is a **reverse-engineered**, **strong-typed** version of
magicline's internal API.

This will be the base for my second (planned) magicline-related project:
**a lightweight, fast and counter-focused interface** for the most basic
magicline tasks like checkin-in, check-out and retail product sales.

## usage

I wouldn't recommend using this today and I'd consider it unstable and
changing rapidly. You can however play around with it and contribute as
you see fit.

## testing

I strive for 100% coverage with automated tests using [`ava`](https://npmr.vaa.ski/ava).

This is very useful for rapidly detecting changes in magicline's internal API.
There will be periodic tests set up using GitHub actions once I consider
openmagicline stable.
