# README
## This is the README for the "Open in Visual Studio" extension 
This extensions lets a user open the current file into Visual Studio 2013 or 2015.

If there an existing running instance, that will be used. Else a new instance will be loaded.

Effectively this extension detects the location of Visual Studio and runs "devenv.exe /edit <filename>".

Useful if you use VSCode as your editor, but need the power of the VSIDE for debugging or other things.