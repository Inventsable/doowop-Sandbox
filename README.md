# doowop Sandbox

Just experimenting with a few onboarding indicator methods, not meant for production

![](https://thumbs.gfycat.com/YearlyTangibleCopperbutterfly-size_restricted.gif)

## Notes for myself

- This should be parsed between multiple npm packages:
  - **pinpoint** - A package that takes a querySelector string and returns a quadrant grid of positional values (NW, NC, NE, CW, CC, CE, etc)
  - **doowop** - A package that generates the actual HTML/SVG/Canvas elements used as indicators
  - **TBA** - A package that takes an array of dialog text (or allows custom dialog .vue components) and acts as the steps through a progression of onboarding prompts, like Inquirer.js but for visuals and walking a user through performing actions. IntroJS and ShepherdJS are great examples but too stylized and not flexible for very minimal, custom prompts (plus IntroJS is paid). Ideally this should be extemely minimal and unobtrusive
- Positioning breaks on any window resize. Instead of `appendChild()` and absolute positioning, it would probably be better to `insertBefore()` and use relative positioning.
- Z-Index of `auto` elements can also break when no z-index is explicitly defined.
- I want something as simple as a cloned HTML button with a thick border that radiates outward subtley, but this can be difficult to obey border-radius. Outlines cannot have a radius, though there may be a way to stack multiple small box-shadows onto an element to give the same effect?
