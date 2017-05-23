'use strict';
// The module 'vscode' contains the VS Code extensibility API Import the module
// and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as Winreg from "winreg";

// this method is called when your extension is activated your extension is
// activated the very first time the command is executed
export function activate(context : vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors
    // (console.error) This line of code will only be executed once when your
    // extension is activated
    console.log('Congratulations, your extension "open-in-vs" is now active!');

    function createExtension(commandId, version, vsVersionName) {

        // The command has been defined in the package.json file Now provide the
        // implementation of the command with  registerCommand The commandId parameter
        // must match the command field in package.json
        let disposable = vscode
            .commands
            .registerCommand(commandId, () => {
                // The code you place here will be execute every time your command is executed
                // Display a message box to the user
                var doc = vscode.window.activeTextEditor.document;

                // vscode.window.showInformationMessage('Launching Visual Studio ' +
                // vsVersionName + '...');
                var isDirty = doc.isDirty;

                // save the file if it is dirty
                var docPromise = Promise.resolve < boolean > (true);
                if (isDirty) {
                    docPromise = doc.save() as Promise < boolean >;
                }

                docPromise
                    .then(function (didSave) {
                        var docFilename = doc.fileName;

                        if (!didSave) {
                            vscode
                                .window
                                .showInformationMessage('Error saving file');
                        }

                        var regKey = new Winreg({
                            hive: Winreg.HKLM,
                            key: "\\Software\\Wow6432Node\\Microsoft\\VisualStudio\\" + version
                        });

                        // TODO: Look up different folder for non-64 bit
                        regKey.get("InstallDir", function (err, result) {
                            if (result != null) {
                                var devenvPath = result.value + "devenv.exe";
                                var cp = require("child_process");
                                cp.execFile(devenvPath, ["/edit", docFilename]);
                            }
                            else
                            {
                                var nextFallbackCommand = getNextFallback(commandId);
                                if (nextFallbackCommand) {
                                    vscode.commands.executeCommand(nextFallbackCommand);
                                }
                            }
                        });
                    });
            });

        context
            .subscriptions
            .push(disposable);
    }

    createExtension("extension.openInVs2010", "10.0", "2010");
    createExtension("extension.openInVs2012", "11.0", "2012");
    createExtension("extension.openInVs2013", "12.0", "2013");
    createExtension("extension.openInVs2015", "14.0", "2015");
    createExtension("extension.openInVs2017", "15.0", "2017");
}

function getNextFallback(currentVersion: string) {
    let fallbackTable = [
        "extension.openInVs2017",
        "extension.openInVs2015",
        "extension.openInVs2013",
        "extension.openInVs2012",
        "extension.openInVs2010"
    ];

    for (var index = 0; index < fallbackTable.length; ++index) {
        if (currentVersion == fallbackTable[index]){
            return fallbackTable[index + 1];
        }
    }

    return null;
}

// this method is called when your extension is deactivated
export function deactivate() {}