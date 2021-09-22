---
title: Quickstart Guide
description: A guide designed to get you started with yuzu quickly.
---

## Table of Contents

* [Downloading and Installing yuzu](#downloading-and-installing-yuzu)
* [Hardware Requirements](#hardware-requirements)
* [yuzu Quickstart Guide](#yuzu-quickstart-guide)
* [Prerequisites](#prerequisites)
* [Preparing the microSD card](#preparing-the-microsd-card)
* [Booting into RCM](#booting-into-rcm)
* [Booting into Hekate](#booting-into-hekate)
* [Mounting the microSD card to your computer in Hekate](#mounting-the-microsd-card-to-your-computer-in-hekate)
* [Dumping Prod.keys and Title.keys](#dumping-prodkeys-and-titlekeys)
* [Backing up Switch NAND (Optional but Recommended)](#backing-up-switch-nand-optional-but-recommended)
* [Dumping System Update Firmware](#dumping-system-update-firmware)
* [Dumping Cartridge Games](#dumping-cartridge-games)
* [Dumping Installed Titles (eShop)](#dumping-installed-titles-eshop)
* [Dumping Save Files (Optional)](#dumping-save-files-optional)
* [Rebooting the Switch Back to its Original State](#rebooting-the-switch-back-to-its-original-state)
* [Running yuzu](#running-yuzu)

## Downloading and Installing yuzu

{{< youtube j0fXerrGjF4 >}}

## Hardware Requirements

#### CPU: 

Any x86_64 CPU with support for the FMA instruction set. 6 threads or more are recommended.

- Minimum: Intel Core i5-4430 / AMD Ryzen 3 1200

- Recommended: Intel Core i5-10400 / AMD Ryzen 5 3600

#### Dedicated graphics: 

OpenGL 4.6 or Vulkan 1.1 compatible hardware and drivers are mandatory. Half-float support and 4GB of VRAM are recommended.

- Minimum for Linux: NVIDIA GeForce GT 1030 2GB / AMD Radeon R7 240 2GB

- Minimum for Windows: NVIDIA GeForce GT 1030 2GB / AMD Radeon RX 550 2GB

- Recommended: NVIDIA GeForce GTX 1650 4GB / AMD Radeon RX Vega 56 8GB

#### Integrated graphics:

Integrated graphics will produce very low performance. A dedicated GPU will produce better results on all scenarios.
This is only for listing iGPU support.

- Minimum for Linux: Intel HD 5300 / AMD Radeon R5 Graphics

- Minimum for Windows: Intel HD Graphics 520 / AMD Radeon Vega 3

- Recommended: Intel UHD Graphics 750 / AMD Radeon Vega 7

#### RAM: 

Since an integrated GPU uses system RAM as its video memory (VRAM), our memory requirement in this configuration is higher.

- Minimum with dedicated graphics: 8GB

- Minimum with integrated graphics: 12GB

- Recommended: 16GB

#### Notes:

- Windows users are recommended to run Windows 10 1803 or newer to get the best performance.

- Our recommended specifications don't guarantee perfect performance in most games, but rather strive to provide a cost effective recommendation while still considering performance.

- Most games are playable on older Nvidia GPUs from the Fermi family (400 series) or later, but at least Pascal (1000 series) is strongly recommended.

- CPUs lacking the FMA instruction set will produce very poor results. Intel Core gen 3 series or older, AMD phenom II or older and all Pentium/Celeron/Atom CPUs will not produce optimal results.

- Mobile CPUs will not reach the same performance as their desktop counterparts due to thermal, power, and technical limitations. 

- Old GCN 1.0 and GCN 2.0 Radeon GPUs on Linux require manually forcing the amdgpu kernel module.

- **GPUs must support OpenGL 4.6 & OpenGL Compatibility profile, or Vulkan 1.1 (or higher).**<br>
To find out if your GPU meets these requirements, visit https://opengl.gpuinfo.org or https://vulkan.gpuinfo.org/ and check your GPU details.<br>

Sample Image:

![GPUInfo](./gpu_info.png)

## yuzu Quickstart Guide

To start playing commercial games, yuzu needs a couple of system files and folders from your switch in order to play them properly.
To check if your Switch is hackable, visit https://damota.me/ssnc/checker and test your Switch's serial number.

<article class="message has-text-weight-semibold">
    <div class="message-body">
        <p>NOTE:</p>
        <ul>
            <li>If your Switch is patched, you will be unable to complete the following steps.</li>
            <li>The 2019 Switch revision (Mariko/Red Box/HAC-001(-01)) and the Switch Lite are both patched and you will not be able to complete the following steps.</li>
        </ul>
    </div>
</article>

This guide will help you copy all your system files, games, updates, and DLC from your switch to your computer and organize them in a format yuzu understands.
This process should take about 60 to 90 minutes.

**IMPORTANT:**  
**Make sure to place your Nintendo Switch into Airplane Mode before starting this guide.**  
`System Settings -> Airplane Mode -> Airplane Mode "ON"`

## Prerequisites

- A Nintendo Switch vulnerable to the fusée gelée RCM exploit -- Visit https://damota.me/ssnc/checker and test your Switch's serial number
- An SD card with at least 30 GB of free space (an almost empty 32GB card will work)
- A USB-C to USB-A or USB-C to USB-C Cable to connect your Switch to your computer
- [TegraRcmGUI](https://github.com/eliboa/TegraRcmGUI/releases/latest) -- Download `TegraRcmGUI_v2.6_Installer.msi`
- [Hekate](https://github.com/CTCaer/hekate/releases/latest) -- Download `hekate_ctcaer_X.X.X_Nyx_X.X.X.zip`
- [Atmosphere](https://github.com/Atmosphere-NX/Atmosphere/releases/latest) -- Download both `atmosphere-X.X.X-master-XXXXXXXX+hbl-X.X.X+hbmenu-X.X.X.zip` and `fusee.bin`
- [Lockpick_RCM](https://github.com/shchmue/Lockpick_RCM/releases/latest) -- Download `Lockpick_RCM.bin`
- [nxdumptool](https://github.com/DarkMatterCore/nxdumptool/releases/latest) -- Download `nxdumptool.nro`
- [nxDumpMerger](https://github.com/emiyl/nxDumpMerger/releases/latest) -- Download `nxDumpMerger_Windows.zip`
- [TegraExplorer](https://github.com/suchmememanyskill/TegraExplorer/releases/latest) -- Download `TegraExplorer.bin`
- [microSD Card Reader](https://www.amazon.com/dp/B006T9B6R2) -- If your computer has one built-in, you can use that
- [RCM Jig](https://www.amazon.com/dp/B07J9JJRRG) <-- We highly recommend one like this, but you could use any of the methods outlined [here](https://noirscape.github.io/RCM-Guide/)

`%YUZU_DIR%` is the home directory for yuzu on your computer:

    - For Windows, this is '%APPDATA%\yuzu' or 'C:\Users\{username}\AppData\Roaming\yuzu'
    - For Linux, this is '~/.local/share/yuzu'

## Preparing the microSD Card

1. We will now prepare the microSD card.
    - 1a. Extract the contents inside the `atmosphere-X.X.X-master-XXXXXXXX+hbl-X.X.X+hbmenu-X.X.X.zip` and `hekate_ctcaer_X.X.X_Nyx_X.X.X.zip` files into the root of your microSD card. Just drag and drop the contents, do not create any new folders.
    - 1b. Rename the `hekate_ctcaer_X.X.X.bin` file to `reboot_payload.bin` and move it into the `atmosphere` folder. Replace the file when prompted.
    - 1c. Place the `fusee.bin`, `Lockpick_RCM.bin` and `TegraExplorer.bin` files into the `payloads` folder, which is inside the `bootloader` folder in your microSD card.
    - 1d. Create a folder named `nxdumptool` within the `switch` folder of your SD card and place the `nxdumptool.nro` file inside it.
    - 1e. Once done, eject the microSD card and insert it into your Nintendo Switch.

{{< imgs
    "./sd_template.png|Your SD card should look like this."
>}}

## Booting into RCM

2. We will now boot your Nintendo Switch into RCM mode
    - 2a. Run the TegraRcmGUI installer you downloaded from the prerequisites, and after installation, start the program. 
    - 2b. In the `Settings` tab, click on `Install Driver` which will install the drivers necessary for your computer to interface with your Nintendo Switch. 
    - 2c. After the drivers have been installed, plug your Nintendo Switch into your computer.
    - 2d. Power off your Switch while it is still connected to your computer.
    - 2e. Insert your RCM jig into the right joy-con slot, make sure it is seated securely at the base, and then press VOL+ and Power buttons at the same time. Nothing should happen on your Switch; if the switch starts to turn on normally, go back to the beginning of step 2d and try again.
    - 2f. If you see the Nintendo Switch icon in the lower left corner flash green and state `RCM O.K.`, your switch has successfully entered RCM mode.

## Booting into Hekate

3. We will now boot your Nintendo Switch (already in [RCM mode](#booting-into-rcm)) into Hekate, a custom bootloader.
    - 3a. Extract the `hekate_ctcaer_X.X.X.bin` file from the `hekate_ctcaer_X.X.X_Nyx_X.X.X.zip` file you downloaded from the prerequisites to any accessible directory on your computer.
    - 3b. Run TegraRcmGUI. In the `Payload` tab of TegraRcmGUI, click on the folder icon and navigate to the `hekate_ctcaer_X.X.X.bin` file you extracted earlier.
    - 3c. Click on `Inject Payload` and your Switch will boot into the Hekate menu.
    
## Mounting the microSD card to your computer in Hekate

_**NOTE:** These steps will be used in other sections below. Do **not** follow this section yet if you are [booted into Hekate for the first time.](#booting-into-rcm) Skip to the [next section](#dumping-prod-keys-and-title-keys) for now._

4. We will now mount the microSD card as a drive from your Switch to your computer in Hekate, via USB.
    - 4a. In the Hekate Home menu, tap on the `Tools` tab to show the Tools menu.
    - 4b. Tap on `USB Tools`.
    - 4c. Tap on `SD Card`. Your SD card should now be mounted as a drive to your computer.
    
    To unmount the SD card: Safely eject the drive from your computer and tap on `Close` from your Switch's screen.

5. We will now return to the Hekate Home menu.
    - 5a. Tap on `Close` again to return to the Tools menu.
    - 5b. Tap on the `Home` tab to return to the Hekate Home menu.

## Dumping Prod.keys and Title.keys

6. We will now dump your `prod.keys` and `title.keys` for decryption of your game files.
    - 6a. Boot your Nintendo Switch into [RCM mode](#booting-into-rcm) (steps 2c. to 2f.) and make sure it is connected to your computer.
    - 6b. Boot into [Hekate](#booting-into-hekate) (steps 3b. to 3c.)
    - 6c. When it has successfully booted into the Hekate menu, tap on `Payloads`. This will show a list of payloads.
    - 6d. Tap on `Lockpick_RCM.bin` in the list of payloads.
    - 6e. After Lockpick_RCM has successfully booted, press the power button to select `Dump from SysNAND`. 
    - 6f. Wait for it to finish deriving the keys.
    - 6g. After Lockpick_RCM has finished deriving the keys, please make note of the location of the key files. Default is: `sd:/switch/prod.keys` and `sd:/switch/title.keys`.
    - 6h. Press any button to return to the menu, then navigate with the VOL+/VOL- buttons to highlight and select `Reboot to hekate` by pressing the power button. You should now be booted back into Hekate.
    - 6i. [Mount the SD card to your computer in Hekate](#mounting-the-microsd-card-to-your-computer-in-hekate) (steps 4a. to 4c.)
    - 6j. Navigate to your SD card drive and copy both `prod.keys` and `title.keys` to the `%YUZU_DIR%/keys` directory.
    - 6k. Once you're done copying, [safely eject the SD card drive in your computer and return to the Hekate Home menu.](#mounting-the-microsd-card-to-your-computer-in-hekate) (steps 5a. to 5b.)

## Backing up Switch NAND (Optional but Recommended)

7. We will now boot Hekate to dump your switch's NAND. This step is optional, but highly recommended to ensure you have a backup of your Switch's data in its internal storage.
    - 7a. Boot your Nintendo Switch into [RCM mode](#booting-into-rcm) (steps 2c. to 2f.) and make sure it is connected to your computer.
    - 7b. Boot into [Hekate](#booting-into-hekate) (steps 3b. to 3c.)
    - 7c. When it has successfully booted into the Hekate Home menu, tap on the `Tools` tab and select `Backup eMMC`.
    - 7d. Underneath the `Full` section, tap on `eMMC BOOT0 & BOOT1`. This may take a few seconds to load. After it is finished filling the progress bar it should say `Finished and verified!`. Beneath `Filepath:` you will see the location of the dump. 
    - 7e. Tap on `Close` and select `eMMC RAW GPP`. This should take some time as the Switch's `rawnand.bin` is quite large. If the progress bar appears to go backwards at some points or turn green, do not worry as this is Hekate verifying the data. This should take between 15-45 minutes depending on the quality/speed of your SD card and the default verification setting. Please keep note of the location the output file is placed.
    - 7f. Tap on `Close` two times to return to the Tools menu.
    - 7g. [Mount the SD card to your computer in Hekate](#mounting-the-microsd-card-to-your-computer-in-hekate) (steps 4b. to 4c.)
    - 7h. Navigate to your SD card drive and copy the `backup` folder to your computer.
    - 7i. Once you're done copying, [safely eject the SD card drive in your computer and return to the Hekate Home menu.](#mounting-the-microsd-card-to-your-computer-in-hekate) (steps 5a. to 5b.)

## Dumping System Update Firmware

8. Some games such as `Mario Kart 8 Deluxe` require the use of files found inside the `Nintendo Switch System Update Firmware` to be playable. In this step, we will now dump the firmware files from your Switch for use in yuzu.
    - 8a. Boot your Nintendo Switch into [RCM mode](#booting-into-rcm) (steps 2c. to 2f.) and make sure it is connected to your computer.
    - 8b. Boot into [Hekate](#booting-into-hekate) (steps 3b. to 3c.)
    - 8c. When it has successfully booted into the Hekate Home menu, tap on `Payloads`. This will show a list of payloads.
    - 8d. Tap on `TegraExplorer.bin` in the list of payloads.
    - 8e. After TegraExplorer has successfully booted, navigate through the menu using the `VOL+/VOL-` buttons to highlight and select the `FirmwareDump.te` option by pressing the `POWER` button.
    - 8f. Select the `Dump sysmmc` option
    - 8g. Once the dumping process is finished, the `.nca` files will be located in your SD card at `sd:/tegraexplorer/Firmware/<firmware version>`.
    - 8h. Press any button to return to the main menu.
    - 8i. Select the `Reboot to bootloader/update.bin` option. You should now be booted back into Hekate.
    - 8j. [Mount the SD card to your computer in Hekate](#mounting-the-microsd-card-to-your-computer-in-hekate) (steps 4a. to 4c.)
    - 8k. Navigate to your SD card drive and copy the contents in the firmware folder (step 8f.) to `%YUZU_DIR%/nand/system/Contents/registered`. Alternatively, you can write `%appdata%\yuzu\nand\system\Contents\registered` in the address bar of a file explorer. The `registered` folder should be full of `.nca` files.
    - 8l. Once you're done copying, [safely eject the SD card drive in your computer and return to the Hekate Home menu.](#mounting-the-microsd-card-to-your-computer-in-hekate) (steps 5a. to 5b.)

## Dumping Cartridge Games

9. We will now dump the `Cartridge Image (XCI)` file from your game cartridge(s), to use in yuzu. Insert the game cartridge of your choice.
    - 9a. Boot your Nintendo Switch into [RCM mode](#booting-into-rcm) (steps 2c. to 2f.) and make sure it is connected to your computer.
    - 9b. Boot into [Hekate](#booting-into-hekate) (steps 3b. to 3c.)
    - 9c. When it has successfully booted into the Hekate Home menu, tap on `Payloads`. This will show a list of payloads.
    - 9d. Tap on `fusee.bin` in the list of payloads.
    - 9e. Your Switch will launch into Custom Firmware Mode (CFW), and once your Switch has booted into the HOME Menu, press and hold the `R` button on your controller and launch a game. This will launch the Homebrew Menu in `title override mode`.
    - 9f. Either use the touchscreen or navigate using your controller, and select `nxdumptool`.
    - 9g. Select the `Dump gamecard content` option.
    - 9h. Select the `Cartridge Image (XCI) dump` option.
    - 9i. Once the cartridge image has been dumped, press any button to return to the previous menu and then press `+` to return to the Homebrew Menu.
    - 9j. Select `Reboot to Payload` and then press `-` on your controller to return to the Hekate Home menu.
    - 9k. [Mount the SD card to your computer in Hekate](#mounting-the-microsd-card-to-your-computer-in-hekate) (steps 4a. to 4c.)
    - 9l. Navigate to your SD card drive. XCI dumps are located under `sd:/switch/nxdumptool/XCI`.
    - 9m. If your XCIs are dumped in parts with `.xc0`, `.xc1`, `.xc2`, etc extensions, use the `nxDumpMerger` tool you have downloaded in the prerequisites to assist in merging these parts into a complete XCI. If they were dumped as complete XCI files with the `.xci` extension, you can proceed to copy these to a game directory of your choice.
    - 9n. Extract the contents of `nxDumpMerger_Windows.zip` into a new folder and start the program.
    - 9o. Select the button with the triple dots `...` next to the `Input` field. This will open a file selector.
    - 9p. Find and select one of the parts and click `Open`.
    - 9q. Next, select the button with the triple dots `...` next to the `Output` field. This will open a folder selector.
    - 9r. Select a folder where you would like your games stored in your computer and then click `Select Folder`. (**NOTE:** Do not select a folder inside the SD card or you will quickly run out of space and experience slow transfer speeds in the merging process.)
    - 9s. After completing these steps, the parts are ready to be merged. Select `Merge Dump` and the program will merge the parts into a complete XCI located in the `Output` folder. Repeat these steps for all other games dumped as parts.
    - 9t. Once you're done merging, [safely eject the SD card drive in your computer and return to the Hekate Home menu.](#mounting-the-microsd-card-to-your-computer-in-hekate) (steps 5a. to 5b.)

## Dumping Installed Titles (eShop)

10. We will now dump the `Nintendo Submission Package (NSP)` file from your installed eShop game(s), to use in yuzu.
    - 10a. Boot your Nintendo Switch into [RCM mode](#booting-into-rcm) (steps 2c. to 2f.) and make sure it is connected to your computer.
    - 10b. Boot into [Hekate](#booting-into-hekate) (steps 3b. to 3c.)
    - 10c. When it has successfully booted into the Hekate menu, tap on `Payloads`. This will show a list of payloads.
    - 10d. Tap on `fusee.bin` in the list of payloads.
    - 10e. Your Switch will launch into Custom Firmware Mode (CFW), and once your Switch has booted into the home menu, press and hold the R button on your controller and launch a game. This will launch the Homebrew Menu in `title override mode`.
    - 10f. Either use the touchscreen or navigate using your controller, and select `nxdumptool`.
    - 10g. Select the `Dump installed SD Card / eMMC Content` option.
    - 10h. Select the game you want to dump.
    - 10i. Select the `Nintendo Submission Package (NSP) dump` option.
    - 10j. If your game contains an update or DLC, you will see multiple dumping options such as `Dump base application NSP`, `Dump installed update NSP` or/and `Dump installed DLC NSP` in the next screen. Select `Dump base application NSP` to dump the base game.
    - 10k. Select the `Start NSP dump process` option and wait for the dumping process to finish.
    - 10l. Press the `B button` to return to the previous menu(s) and repeat the previous steps to dump the base, updates and DLC of all your games.
    - 10m. Once all your games are dumped, press any button to return to the previous menu and then press `+` to return to the Homebrew Menu.
    - 10n. Select `Reboot to Payload` and then press `-` on your controller to return to the Hekate Home menu.
    - 10o. [Mount the SD card to your computer in Hekate](#mounting-the-microsd-card-to-your-computer-in-hekate) (steps 4a. to 4c.)
    - 10p. Navigate to your SD card drive. NSP dumps are located under `sd:/switch/nxdumptool/NSP`.
    - 10q. If your NSPs are dumped as folders with `00`, `01`, `02`, etc parts within them, use the `nxDumpMerger` tool you have downloaded in the prerequisites to assist in merging these parts into a complete NSP. If they were dumped as files, you can proceed to copy these to a game directory of your choice.
    - 10r. Extract the contents of `nxDumpMerger` into a new folder and start the program. (Skip the extraction if you already followed step 9n.)
    - 10s. Select the button with the triple dots `...` next to the `Input` field. This will open a file selector.
    - 10t. Find a NSP that is dumped as a folder with parts. Select one of the parts within the folder and click `Open`.
    - 10u. Next, select the button with the triple dots `...` next to the `Output` field. This will open a folder selector.
    - 10v. Select a folder where you would like your games stored in your computer and then click `Select Folder`. (**NOTE:** Do not select a folder inside the SD card or you will quickly run out of space and experience slow transfer speeds in the merging process.)
    - 10w. After completing these steps, the parts are ready to be merged. Select `Merge Dump` and the program will merge the parts into a complete NSP located in the `Output` folder. Repeat these steps for all folder NSPs.
    - 10x. Once you're done merging, [safely eject the SD card drive in your computer and return to the Hekate Home menu.](#mounting-the-microsd-card-to-your-computer-in-hekate) (steps 5a. to 5b.)

## Dumping Save Files (Optional)

11. We will now dump the games' save files from your switch to use in yuzu.
    - 11a. Download [JKSV.nro](https://github.com/J-D-K/JKSV/releases/latest)
    - 11b. Boot your Nintendo Switch into [RCM mode](#booting-into-rcm) (steps 2c. to 2f.) and make sure it is connected to your computer.
    - 11c. Boot into [Hekate](#booting-into-hekate) (steps 3b. to 3c.)
    - 11d. [Mount the SD card to your computer in Hekate](#mounting-the-microsd-card-to-your-computer-in-hekate) (steps 4a. to 4c.)
    - 11e. Navigate to your SD card drive and place the `JKSV.nro` file inside the `switch` folder.
    - 11f. Once you're done, [safely eject the SD card drive in your computer and return to the Hekate Home menu.](#mounting-the-microsd-card-to-your-computer-in-hekate) (steps 5a. to 5b.)
    - 11g. Tap on `Payloads`. This will show a list of payloads.
    - 11h. Tap on `fusee.bin` in the list of payloads.
    - 11i. Your Switch will launch into Custom Firmware Mode (CFW), and once your Switch has booted into the home menu, press and hold the `R` button on your controller and launch a game. This will launch the Homebrew Menu in `title override mode`.
    - 11j. Either use the touchscreen or navigate using your controller, and choose `JKSV`.
    - 11k. Move up or down to select a source to dump save data for a single game. (Most save files are stored under the user account of choice. Some save data are located under Device, such as Animal Crossing: New Horizons.)
    - 11l. **For dumping all save data at once from selected source:** Press `X` and then select the `Dump All for <source name>` option.
    - 11m. **For dumping save data of a single game:** Press `A` and then select the game of choice, then press `A` again and select the `New` option.
    - 11n. JKSV will being up the keyboard to set a name for your save data folder. By default, it generates a name containing the source name (user account, Device, etc.) alongside the date and time of when it was dumped, else you can name it to whatever you want. Once you're done, press `+` to dismiss the keyboard.
    - 11o. Once you're done dumping, press `+` to close JKSV.
    - 11p. Select `Reboot to Payload` and then press `-` on your controller to return to the Hekate menu.
    - 11q. [Mount the SD card to your computer in Hekate](#mounting-the-microsd-card-to-your-computer-in-hekate) (steps 4a. to 4c.)
    - 11r. Navigate to your SD card drive. Your save files will be located in `sd:/JKSV/<name of the game>/<folder name from step 11n>/`.
    - 11s. Follow the instructions in the [How do I add a Save to my Game](https://yuzu-emu.org/wiki/faq/#how-do-i-add-a-save-to-my-game) section of our [FAQ.](https://yuzu-emu.org/wiki/faq/)
    - 11t. Once you're done transferring your save files, [safely eject the SD card drive in your computer and return to the Hekate Home menu.](#mounting-the-microsd-card-to-your-computer-in-hekate) (steps 5a. to 5b.)
    
## Rebooting the Switch Back to its Original State

12. If you're done following the sections you needed for yuzu, we will now reboot the Switch back to its original state.
    - 12a. From the Hekate Home Menu, tap on `Reboot`.
    - 12b. Tap on `OFW`.
    - 12c. Your Switch will now reboot into the original firmware.

## Running yuzu

9. We will now run yuzu to verify that your dumped keys and games are being read correctly.
    - 9a. Run either the `yuzu` or `yuzu Early Access` shortcuts that were created by the yuzu installer tool.
    - 9b. in yuzu, click on `+ Add New Game Directory` in the browser, and navigate to the folder where you placed your `XCI` or `NSP` files.

### If you need any help during this process or get a strange error during or while using yuzu, feel free to ask for help on the yuzu discord! Happy Emulating!
