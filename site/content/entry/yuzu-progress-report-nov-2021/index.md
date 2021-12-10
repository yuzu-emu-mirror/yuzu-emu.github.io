+++
date = "2021-12-010T12:00:00-03:00"
title = "Progress Report November 2021"
author = "GoldenX86"
coauthor = "CaptV0rt3x"
forum = 503829
+++

Hello yuz-ers! Welcome to November’s progress report. This month, we present to you a full input rewrite, UI navigation with controllers, massive kernel changes resulting in 
improved performance and stability, and more.

<!--more-->  

## Project Kraken

Oh boy, what a treat [german77](https://github.com/german77) has for us. 
As we mentioned in the previous progress report, `Project Kraken`, our latest input rewrite, is now available to all users.

But what does it mean? 
Well, Kraken has multiple goals — first of all is accuracy. 
Behaving closer to how the Nintendo Switch operates is our goal.
Secondly, simplifying and removing old redundant code makes maintenance and scalability a lot easier.
And most importantly, making all input event-based instead of polling-based. 
This means that instead of asking the controller what it did at regular intervals, the controller itself will report its actions the moment the user inputs an action. This 
applies to buttons, triggers, sticks, motion — the whole deal.
The end result is reduced input lag.

But those aren't the only improvements, Kraken also includes many bug fixes and new additions.
Users can now invert or turn any button into a toggle (press again to release) in any emulated controller. 
Previously this was only possible on a limited variety of controllers.

{{< imgs
	"./toggle.png| Did someone say they wanted to beat Dark Souls with a driving wheel?"
  >}}

Buttons are named instead of numbered on non-SDL input controllers, assisting with identification.

{{< imgs
	"./button.png| SDL input, like native Nintendo controllers or Xbox controllers, will have numbered buttons rather than named"
  >}}

While we recommend using controllers without third party drivers, full [UDP Cemuhook support](https://cemuhook.sshnuke.net/) is available at 
`Emulation > Configure… > Controls > Advanced > Enabled UDP controllers`.

Previously, Cemuhook was only used for UDP motion, but now even Android apps can connect to yuzu.
Cemuhook provides a guide on how to set up UDP devices [here](https://cemuhook.sshnuke.net/padudpserver.html). 

{{< imgs
	"./udp.png| There must be someone trying to play with a phone as a Joy-Con somewhere"
  >}}

Keyboard and mouse emulation is improved, allowing games that natively support USB mouse and keyboard inputs to function correctly.

{{< imgs
	"./km.png| Useful in games like Animal Crossing: New Horizons that accept an actual keyboard on the Switch"
  >}}

Additionally, there are hundreds of bugfixes in the backend. To list a few:

- Dual Joy-Cons will now correctly reconnect instead of reverting to “any” input after a yuzu reboot.
- Analog triggers are properly mapped (this includes Gamecube controllers).
- Configuration parameters are shared on all emulated controller types.
- Battery level is now informed when available.
- Pressing a button will automatically reconnect the first player.
- Rumble on the right side is fixed.

For those interested, the [pull request](https://github.com/yuzu-emu/yuzu/pull/7255) description includes all the technical information on how Kraken now operates, including 
the internal changes to every subsystem.

[Subsequent](https://github.com/yuzu-emu/yuzu/pull/7472) [pull requests](https://github.com/yuzu-emu/yuzu/pull/7476) by [Morph](https://github.com/Morph1984) and german77 
provided further fixes and cleanups.
For example, in the past yuzu would determine automatically if the controller applet needed to pop-up, removing an annoyance in single player games.
Kraken shipped with a bug causing the controllers to remain in configure mode, awaiting an applet that never came up.
german77 [corrected this behavior](https://github.com/yuzu-emu/yuzu/pull/7465) to enable the controllers in such cases.

## Other input changes

A highly requested feature is [controller navigation over UI elements](https://github.com/yuzu-emu/yuzu/pull/7452), and that’s exactly what german77 delivered.
Currently there is support for the game list and profile selector (if the user created several profiles).
The feature is in its baby steps, so expect some rough edges. For example, when in the controller applet or when trying to hold the stick. We are currently working on refining it.

Here’s an example on the GPD Win 3:

{{< imgs
	"./ui.mp4| Steam Deck hype train, here we go!"
  >}}

When asking for the character’s name in `Famicom Detective Club: The Missing Heir`, the game generated an error in Chinese and then crashed.
The issue is rooted in a bad behaviour in how text is handled with the On-Screen Keyboard (OSK). There’s no need to ask for user confirmation on text that has been already 
confirmed.
The resulting error message was corrupted due to using the wrong character encoding.
Morph [addressed both issues](https://github.com/yuzu-emu/yuzu/pull/7303), and the game can be played now.

{{< imgs
	"./detective.png| Elementary, my dear yuzu (Famicom Detective Club: The Missing Heir)"
  >}}

german77 got tired of having to constantly modify the code when testing different types of unsupported controllers, so he added a 
[toggle to allow](https://github.com/yuzu-emu/yuzu/pull/7451) them.
We don’t recommend enabling this setting for normal gameplay, but if anyone wants to try it out, the option is in 
`Emulation > Configure… > General > Debug > Enable all Controller Types`.

## Graphical fixes

One of the missing video formats was `VP8`. We didn’t implement it until now because there were very few known games that used it.
There are at least 3 known games using `VP8` at the moment: `TY the Tasmanian Tiger HD`, `Diablo II: Resurrected`, and `Pokémon Brilliant Diamond/Shining Pearl`. Thus,
[epicboy](https://github.com/yuzu-emu/yuzu/pull/7326) attacked his keyboard and implemented [VP8 support](https://github.com/yuzu-emu/yuzu/pull/7326) into yuzu. However, there are known issues with Pokémon `VP8` decoding that we’re working to address.

{{< imgs
	"./vp8.mp4| Cue the fanfare (Pokémon Shining Pearl)"
  >}}


Textures can be divided on colour or depth formats, but everything changed when the [TCR](https://yuzu-emu.org/entry/yuzu-tcr/) attacked.

In OpenGL, a conversion method was missing for copying “incompatible” texture formats, like colour <-> depth format copies. epicboy 
[worked around this limitation](https://github.com/yuzu-emu/yuzu/pull/7349) by using the same method implemented in BGR <-> RGB conversions that we've mentioned in the past.

Countless glitches were fixed, two notable examples being the shadows in `Luigi’s Mansion 3` and the cutscenes in `Bayonetta 2`.

{{< single-title-imgs
    "You can now focus on... gameplay (Bayonetta 2)"
    "./bayobug.mp4"
    "./bayofix.mp4"
    >}}
    
&nbsp;
    
{{< single-title-imgs
    "No more ghost shadows (Luigi's Mansion 3)"
    "./lm3bug.mp4"
    "./lm3fix.mp4"
    >}}

With the release of `Pokémon Brilliant Diamond/Shining Pearl`, a [Unity](https://unity.com/) engine game, and `SHIN MEGAMI TENSEI V`, an 
[Unreal Engine 4](https://www.unrealengine.com/) game, we realized how much work needs to be done to solve stability and rendering issues affecting both engines.
Since we don’t have that many GPU developers available (especially in finals months), we can only focus on one thing at a time, so first, Unity.

[Blit detection](https://yuzu-emu.org/entry/yuzu-progress-report-may-2021/#graphical-fixes) suffered some regressions with the introduction of the resolution scaler, 
[Project ART](https://yuzu-emu.org/entry/yuzu-art/). 
[Blinkhawk](https://github.com/FernandoS27) [fixed them and added texture format](https://github.com/yuzu-emu/yuzu/pull/7368) `D24S8` to `RGBA8` conversions to Vulkan, 
fixing several crashes affecting both APIs in this new Pokémon remake.

Morph later included [some more fixes](https://github.com/yuzu-emu/yuzu/pull/7395) for this pull request.

Another issue affecting `Pokémon Brilliant Diamond/Shining Pearl` is an interesting corruption that can happen in battles and in reflections after some 
time, or with certain attacks that cover the whole screen. By replacing the old “format deduction algorithm” and instead utilizing [full depth conversions](https://github.com/yuzu-emu/yuzu/pull/7396), Blinkhawk fixed this colourful bug.

{{< single-title-imgs
    "What a trip, almost like a Disney song (Pokémon Brilliant Diamond)"
    "./bdspbug.png"
    "./bdspfix.png"
    >}}

One of the (many) missing texture formats is `S8_UINT`, an 8-bit stencil texture. Morph used a homebrew unit test to verify he was making progress. `Baldur’s Gate 1 and 2` and `Citizens of Space` make use of `S8_UINT`, but as 
both games need other formats that are still missing and other fixes, they weren't very helpful in testing.

While [there is support for S8_UINT in both OpenGL and Vulkan](https://github.com/yuzu-emu/yuzu/pull/7357) now, NVIDIA is the only vendor to specify support for the format in Vulkan, meaning that any 
affected game running on an AMD or Intel GPU will need to stick to OpenGL to get proper rendering.

{{< single-title-imgs
    "Testing homebrew"
    "./s8uintbug.png"
    "./s8uintfix.png"
    >}}

[vonchenplus](https://github.com/vonchenplus) found a bug where image creation would include width size restrictions that wouldn’t apply to later updates and downloads, 
causing OpenGL to spam errors.
[Properly handling those cases](https://github.com/yuzu-emu/yuzu/pull/7294) allows the driver to calm down.
Proper and cleaner code can also mean less driver overhead.

Continuing with the implementation of unsupported formats, vonchenplus added `R5G6B5_UNORM_PACK16` [textures to Vulkan](https://github.com/yuzu-emu/yuzu/pull/7291) and 
`S8_UINT_D24_UNORM` [globally](https://github.com/yuzu-emu/yuzu/pull/7466). 
Again, just like `S8_UINT`, AMD and Intel hardware lack Vulkan support for `S8_UINT_D24_UNORM`.

vonchenplus also [converted all uses of legacy attributes](https://github.com/yuzu-emu/yuzu/pull/7375) within shaders into generic attributes, since they were not 
supported by some graphics drivers, improving compatibility.

These four changes improve `DRAGON QUEST BUILDERS`, but more work is required to make the game playable. If you're interested in testing this game, use Vulkan, or 
disable Asynchronous GPU Emulation when using OpenGL. Beware, crashes may occur.

{{< imgs
	"./dqb.png| Missing graphics make the game not an optimal experience for now (DRAGON QUEST BUILDERS)"
  >}}

Let's go back to the topic of fixing issues introduced by the resolution scaler. Users reported that taking screenshots at the 1x resolution multiplier resulted in saved images with a size higher than the rendering resolution of the game.
A mix up resulted in the screenshot being saved at the window size instead of the game’s framebuffer size.
epicboy [fixed the logic](https://github.com/yuzu-emu/yuzu/pull/7389) and we’re back to proper screenshot resolutions.

[liushuyu](https://github.com/liushuyu), our fantastic Web Admin, [received reports](https://github.com/flathub/org.yuzu_emu.yuzu/issues/200) 
[of systems with multiple GPUs](https://github.com/flathub/org.yuzu_emu.yuzu/issues/218) experiencing crashes while running the Flatpak version of yuzu on Linux.
It seems like the bundled version of [mesa](https://www.mesa3d.org/) and [ffmpeg](https://ffmpeg.org/) will not work on systems with different GPU vendors.
This is caused by Flatpak's built-in ffmpeg lacking support for NVDEC and VDPAU on NVIDIA hardware, and having broken codec detection.
Just your average GNOME, who manages both Flatpak and FlatHub.

liushuyu submitted [two](https://github.com/yuzu-emu/yuzu/pull/7431) [separate](https://github.com/yuzu-emu/yuzu/pull/7467) pull requests addressing this problem, but more 
edge cases continue to appear, so the battle isn’t over yet.

While we continue to work towards winning this war on Flatpak issues, please stick to using our [AppImages](https://yuzu-emu.org/downloads/#linux), or 
[manually building yuzu](https://yuzu-emu.org/wiki/building-for-linux/).
If you prefer to manually build yuzu, make sure that your ffmpeg library is capable of decoding `VP8`, `VP9`, and `H.264` on hardware.
It seems like the only way to solve this problem will be to just ship our own ffmpeg instead of Flatpak’s default version.

## UI changes

[MightyCreak](https://github.com/MightyCreak) has been working on changes in behaviour to the default light theme.
Previously, yuzu would ignore the system wide theme, sticking to a light palette even if the system switched to a dark one.
[Renaming the Light theme to Default, and allowing it to match the behaviour of the system theme](https://github.com/yuzu-emu/yuzu/pull/7330), makes for a more streamlined user experience.
At the moment, this behaviour only works correctly on Linux, Windows’ Qt doesn’t yet support system wide themes.

[Yours truly (GoldenX86)](https://github.com/yuzu-emu/yuzu/pull/7342) decided that the previous missing keys error screen wasn’t clear enough and fixed it right up, short and sweet.

{{< single-title-imgs
    "For some reason, people seem to forget what hyperlinks are for"
    "./keysbug.png"
    "./keysfix.png"
    >}}

While working on the resolution scaler and its included filters, Blinkhawk named FSR `AMD'S FIDELITYFX SR` on the bottom status bar. 
As this was a bit too long, Morph [renamed it](https://github.com/yuzu-emu/yuzu/pull/7369) to simply `FSR`.
Small change, but more pleasing to the eyes.

{{< single-title-imgs
    "Better, don't you agree?"
    "./fsrbug.png"
    "./fsrfix.png"
    >}}

[Kewlan](https://github.com/Kewlan) implemented a very nice addition for high refresh rate users.
With the introduction of the FPS unlimiter that players can toggle by pressing `Ctrl + U` while in-game, a cap was introduced in the configuration to allow setting a 
multiplier of the native framerate as the upper limit.

For example, if a game runs at 30FPS, and the user wants to limit it to 120FPS to better match the maximum refresh rate of their display, a 4x multiplier would be 
needed. A 2x multiplier if the game runs at 60FPS natively.

The problem with this approach is that as shown in the example, different games will run at different framerates natively, so a global value isn't ideal.
Kewlan [added support for framerate caps in the custom configuration](https://github.com/yuzu-emu/yuzu/pull/7404) and users can access it by right clicking a game in yuzu’s list and selecting properties. This way, the user can set their preferred cap on a per-game basis.

{{< single-title-imgs
    "If you buy a new display, remember to manually increase the refresh rate!"
    "./cap1.png"
    "./cap2.png"
    >}}

If the user wants a value that isn’t a multiple of the native framerate of the game, they can use software like 
[MSI Afterburner](https://www.guru3d.com/files-details/msi-afterburner-beta-download.html) to specify a custom limit.

There has been some extensive work to improve hotkeys.

[v1993](https://github.com/v1993) received a report that yuzu’s window will flicker if the user holds the `Esc` key when trying to exit fullscreen. 
[That won’t happen any more](https://github.com/yuzu-emu/yuzu/pull/7353).

german77 discovered that holding a hotkey would constantly spam the input. This was unintended, so he ensured [this behaviour was no more](https://github.com/yuzu-emu/yuzu/pull/7355).

[heinarmann](https://github.com/heinermann) modified [the Menu bar as follows:](https://github.com/yuzu-emu/yuzu/pull/7419)

In `Emulation`, the `Start` button has been removed and `Continue` will now say `Pause` when applicable and vice versa. `Restart` will no longer cause a crash.
In `File`, `Load Amiibo...` was improved. We still have issues with several games when using this function, so consider it in a beta state.
`TAS` [received its own submenu](https://github.com/yuzu-emu/yuzu/pull/7406) in `Tools > TAS`. And in exciting news, Exiting the emulator will now work while in fullscreen!

{{< single-title-imgs
    " "
    "./tasbug.png"
    "./tasfix.png"
    >}}

## Kernel fixes

Morph fixed [a compilation warning](https://github.com/yuzu-emu/yuzu/pull/7278) in the kernel `SVC::WaitSynchronization`, where the parameter `num_handles` was wrongly 
declared as an unsigned integer when it was actually a signed integer.

heinermann discovered a bug in the kernel that crashed yuzu upon exiting.

This happened because dummy threads in the kernel weren't getting destroyed properly. When yuzu was exited during emulation or after stopping emulation, these threads stayed alive even though the kernel got destroyed, thus causing yuzu to crash.

[By making the kernel own these threads](https://github.com/yuzu-emu/yuzu/pull/7359), we ensure they get destroyed when the kernel gets destroyed, mitigating the crash.

[OatmealDome](https://github.com/OatmealDome) fixed a bug that caused some homebrew to not boot. The fix was to 
[pass default threadinfo when the kernel creates a thread](https://github.com/yuzu-emu/yuzu/pull/7320), allowing homebrew to boot.

## Skyline framework, Part 1

[itsmeft24](https://github.com/itsmeft24), [jam1garner](https://github.com/jam1garner), and Morph started working on adding support for the 
[Skyline](https://github.com/skyline-dev/skyline) modding framework. 
This will allow for more intricate code mods, such as using [ARCropolis](https://github.com/Raytwo/ARCropolis), a mod loader for Smash Ultimate made by 
[Raytwo](https://github.com/Raytwo) and [blujay](https://github.com/blu-dev).

All these PRs [[1](https://github.com/yuzu-emu/yuzu/pull/7393)], [[2](https://github.com/yuzu-emu/yuzu/pull/7394)], [[3]](https://github.com/yuzu-emu/yuzu/pull/7407) are part of the 
on-going effort to implement support for the modding framework in yuzu.

There are more juicy additions, but they didn't make it in time to be mentioned in this article, we will continue to expand on Skyline's progress in December's report.
See the current progress [here](https://github.com/yuzu-emu/yuzu/issues/7392).

## General changes and bugfixes

Not much to talk about in this section this time, mostly just service stubs and implementations.

`Animal Crossing: New Horizons` takes the spotlight [with](https://github.com/yuzu-emu/yuzu/pull/7283) [4](https://github.com/yuzu-emu/yuzu/pull/7285) 
[stubs](https://github.com/yuzu-emu/yuzu/pull/7287) to make the new 2.0.0 update playable. Thank you, german77 and Morph.

german77 also provides `Just Dance 2022` [with its own stub](https://github.com/yuzu-emu/yuzu/pull/7293) for the `EndFreeCommunication` service.

And finally, Morph [implements the](https://github.com/yuzu-emu/yuzu/pull/7482) `GetCompletionEvent` service for `Super Bomberman R Online`. 
However, as the game requires online services, it won’t be playable for now.

## Future projects

`Project Gaia` continues to progress and is receiving optimizations as we speak. We're not that far away from starting internal testing on it.

That’s all folks! As always, thank you so much for your attention, and we’ll see you next time!

Special thanks to RodrigoTR and PacoA for their provided media.

&nbsp;
{{< article-end >}}
