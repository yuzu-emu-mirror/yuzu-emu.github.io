+++
date = "2021-04-10T12:00:00-03:00"
title = "Progress Report March 2021"
author = "GoldenX86"
coauthor = "Honghoa"
forum = 391903
+++ 

Hi yuz-ers, we're here with the March progress report to offer you our latest news! We continue to update the Kernel, some considerations have been made for specific hardware, we have several changes and fixes to discuss, and we have a sneak peek at the progress on Project Hades.

<!--more-->

## General bug fixes and improvements

[Morph](https://github.com/Morph1984) to the rescue! [Fixing CalculateSpanBetween](https://github.com/yuzu-emu/yuzu/pull/6053) allows `Super Smash Bros. Ultimate’s` Spirit Board to work!
A separate PR [improving ClockSnapshot](https://github.com/yuzu-emu/yuzu/pull/6054) fixes the timers.

{{< imgs
	"./spirit.png| More work is needed to make World of Light playable, we continue to fight for it! (Super Smash Bros. Ultimate)"
  >}}

Those who have paid attention to our previous progress reports will notice that we sometimes write about when a service is `stubbed` (ignored, basically) to allow a game to progress further.
This process requires manual intervention each and every time a game update or new game uses a new unimplemented service.
To mitigate user frustration, [epicboy](https://github.com/ameerj) implemented [Auto-Stubbing](https://github.com/yuzu-emu/yuzu/pull/6062), continuing [previous work](https://github.com/yuzu-emu/yuzu/pull/4237) from [ogniK.](https://github.com/ogniK5377) 

With this toggle, games will just ignore any unimplemented services and continue running, allowing developers to focus on the services that need urgent, proper implementations.
This is not a new invention by any means. Several emulators in the past have used this feature to great benefit, reducing the load on developers and providing a better experience for the end user.

Keep in mind that auto-stub will be always disabled by default on each boot, so it has to be manually enabled for each session by going to `Emulation > Configure > General > Debug > Enable Auto-Stub`.

{{< imgs
	"./stub.png| You can find it here, at the bottom of the picture in the Advanced section"
  >}}

[Morph](https://github.com/Morph1984) took it upon himself to [update the emulated Switch firmware version to 11.0.1](https://github.com/yuzu-emu/yuzu/pull/6070), and [the NgWord version,](https://github.com/yuzu-emu/yuzu/pull/6069) improving compatibility with recent games, and solving some odd bugs.
For example, `Disgaea` games no longer require a firmware dump to be playable.

We now have some new additions to our command line arguments thanks to [german77](https://github.com/german77).
Users can [select which user profile to load](https://github.com/yuzu-emu/yuzu/pull/6116) by adding the `-u #` argument to their command, with `#` being the profile number.
For example, by using `yuzu.exe -u 1 -g "path_to_game"`, the second profile will be selected.

In an attempt to reduce file size when downloading yuzu and also reduce the download size when building it from source, [toastUnlimited](https://github.com/lat9nq) reworked [how FFmpeg is linked](https://github.com/yuzu-emu/yuzu/pull/5880).
This way, only what is needed for yuzu is built, reducing the size and build time required for this module, and as an added bonus Linux users will avoid problems with possible outdated versions included in their distributions. Data capped users rejoice!

[ivan-boikov](https://github.com/ivan-boikov) fixed an [issue where pressing Cancel would result in the wrong destination folder](https://github.com/yuzu-emu/yuzu/pull/6092) in the file system configuration. Nothing beats quality of life fixes!

`Microsoft Visual Studio`, by default, will compile applications with the character set corresponding to the region of the local developer’s PC. 
This limitation can cause issues for certain regions like Asia when trying to build our source.
Morph bypassed this limitation [by forcing the UTF-8 character set.](https://github.com/yuzu-emu/yuzu/pull/6029)
As an added benefit, some UI elements like up and down arrows started rendering. Free bonus.

{{< imgs
	"./utf8.png| There's nothing like a good arrow icon."
  >}}

While a ton of work is needed to make `MONSTER HUNTER RISE` run, including finishing the shader decompiler rewrite and implementing the asynchronous software keyboard, that doesn’t mean [ogniK](https://github.com/ogniK5377) can’t start some preliminary work.
In this particular case, the focus is to improve [`Parental Control` emulation,](https://github.com/yuzu-emu/yuzu/pull/6112) bringing it closer to the Switch’s native hardware implementation.

## Graphic improvements

Since the introduction of `Asynchronous shaders`, we noticed that not all drivers like the feature.
In particular, Intel Windows OpenGL, and the proprietary AMD drivers (for both Windows with Adrenalin, and Linux with AMDGPU-PRO) despise the setting, with Intel ignoring it at a driver level, and AMD outright skipping frames, resulting in massive stuttering.

[toastUnlimited](https://github.com/lat9nq) [added a blacklist](https://github.com/yuzu-emu/yuzu/pull/6095) for our red and blue GPU users, ensuring no performance or graphical regressions occur while attempting to use a feature that their drivers can’t support in OpenGL anyway.
It’s worth mentioning that Asynchronous shaders work as intended in Vulkan and all free Linux OpenGL drivers, be it for AMD or Intel. Nvidia works as expected on any combination of API or OS with their proprietary drivers.
Thanks to [theboy181](https://github.com/theboy181) for the suggestion!

[bunnei](https://github.com/bunnei) implemented an optimization that affects all graphic caches (texture, buffer, shader).
By [using a flat array](https://github.com/yuzu-emu/yuzu/pull/6028), cache performance is improved slightly, with the bonus of some memory bandwidth saved due to better resource allocation.
A small but measurable 5% performance bump can be experienced, for example, in `Super Mario Odyssey`.

## Technical fixes, continued

The [dynarmic](https://github.com/MerryMage/dynarmic) submodule has been recently [updated in this PR](https://github.com/yuzu-emu/yuzu/pull/6047), merging the latest changes with yuzu.
Thanks to the efforts of [merry](https://github.com/MerryMage/) and [lioncash](https://github.com/lioncash), many `thumb32` instructions (a subset of ARM instructions) were implemented, increasing the amount of instructions supported for 32-bit games on yuzu.

Additionally, all floating-point instructions received minor optimizations, and a couple of bugs in the implementation of [AVX-512 extensions](https://github.com/yuzu-emu/yuzu/pull/6118) were fixed too.
There was also a problem with `AMD` CPUs, where previously dynarmic disabled the use of the `BMI` instruction set (used for bit manipulation), due to being extremely slow in those processors.
However, on Zen 3 and newer, the performance of these instructions has increased considerably, so now dynarmic allows these `AMD` processors to use `BMI` instructions if the detected CPU is fast enough to perform them.

All of these changes were possible thanks to the contribution of [Wunkolo](https://github.com/Wunkolo) to dynarmic (which eventually made it to yuzu), so shoutouts for the great work!

Going back to kernel updates, [bunnei](https://github.com/bunnei/) [reworked and cleaned the kernel memory management code](https://github.com/yuzu-emu/yuzu/pull/6099).
As the name implies, this is the part of the OS that allocates memory resources for games when they request them.
With this change, the implementation matches more closely that of the Nintendo Switch.
As always, these changes make it easier to support any future hardware revisions, along with all other kernel changes that are currently ongoing.

Bunnei also fixed [a memory leak](https://github.com/yuzu-emu/yuzu/pull/6036) caused by `dummy threads`.
These dummies are used by yuzu to interact with our emulated kernel.
Every "real" emulated thread has a dummy associated with it.
As explained in the [previous progress report](https://yuzu-emu.org/entry/yuzu-progress-report-feb-2021/), yuzu utilizes fibers in order to emulate threads.
However, these dummy threads don't actually use fibers.
With this change, bunnei removed some unnecessary memory overhead by removing the creation of fibers (which would only be needed for "real" emulated threads), thus reducing the memory usage by a bit.

Another bug that was also fixed by bunnei was related to how [JIT states are saved between page table changes](https://github.com/yuzu-emu/yuzu/pull/6100).
A [page table](https://en.wikipedia.org/wiki/Page_table) is a scheme used to map physical memory into virtual memory, used to give processes the impression they're working with a unique, contiguous section of memory, regardless of where and how this memory is actually stored.
Due to the way dynarmic is coded, whenever yuzu changes the page table that is currently in use, it needs to recreate the CPU JIT.
But, until now, yuzu wasn't saving and restoring the state of this JIT properly when this happened.
However, with this change, all the context needed by the JIT is now stored and retrieved correctly.

## Input improvements

Not all devices can do `N-key rollover`, meaning pressing many keys/buttons at the same time without some inputs being missed. 
For this, [german77](https://github.com/german77) implemented a [toggle to hold a button for you.](https://github.com/yuzu-emu/yuzu/pull/6040)
This way you can ask yuzu to keep pressing a button, freeing your hand and devices from it, while you move to something else! 
To access this feature, right click the Modifier button in control settings, and select `Toggle button`.

{{< imgs
	"./toggle.png| Right click any button or modifier"
  >}}

For those using [Cemuhook](https://cemuhook.sshnuke.net/) to provide motion via an Android device, [german77](https://github.com/german77) has a nice stability improvement for you! 
[Each individual socket connection now needs its unique client ID.](https://github.com/yuzu-emu/yuzu/pull/6004) 

In a separate PR, german77 [tests using a single UDP connection per server](https://github.com/yuzu-emu/yuzu/pull/6127) instead of per controller, reducing the error rate thanks to simplified communications.
The end result of this work is more stable connections for motion devices.

Xbox 360 and Xbox One controllers were incorrectly displayed as just `Xinput Controller` in our device list, causing confusion to our users.
Additionally, the default Pro Controller mapping had its face buttons swapped by mistake.
[german77](https://github.com/german77) [fixed both issues.](https://github.com/yuzu-emu/yuzu/pull/6119) Bad defaults are bad.

## Future projects

Project Hades, our rewrite of the shader decompiler, is taking shape.
On the games that can be booted now, we can already measure performance increases and countless bugs fixed.

Here’s a sneak peak, fresh from the source.

{{< imgs
	"./wip.png| You can say it's one hell of a rewrite!"
  >}}

While our graphics devs continue to rewrite all shader instructions, we can inform everyone that the new pipeline cache for Vulkan is fully working, storing and loading just as well as OpenGL’s shader cache, while even being faster!

{{< single-title-imgs
    "No more hard crashes (Fire Emblem: Three Houses)"
    "./wip1.png"
    "./wip2.png"
    "./wip3.png"
  >}}

On top of that, Rodrigo also implemented a new kind of asynchronous shader “secret technique” that scales better with the number of threads available, and produces zero graphical glitches!

{{< imgs
	"./wip4.png| The Bokoblin Slayer (Hyrule Warriors: Age of Calamity)"
  >}}

We will expand this information once Hades is out and has its own dedicated article.

That’s all folks! Thank you so much for allowing us to take some of your time, and see you next month!

&nbsp;
<h4 style="text-align:center;">
<b>Please consider supporting us on [Patreon](https://www.patreon.com/yuzuteam)!<br>
If you would like to contribute to this project, check out our [GitHub](https://github.com/yuzu-emu/yuzu)!</b>
</h4>
