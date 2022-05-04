// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import path = require('path');
import * as vscode from 'vscode';
import { Utils as uriUtils } from 'vscode-uri';
import { writeTemplateControllerFile } from './templates/templateControllerFile';
import { writeTemplateModuleFile } from './templates/templateModuleFile';
import { writeTemplateServiceFile } from './templates/templateServiceFile';
import pascalize from './util/pascalize';

const createInFolder = async (targetFolder: vscode.Uri, resourceNameKebabCase: string, resourceNamePascal: string, controllerPath: string) => {
	const svcFilename = `${ resourceNameKebabCase }.service.ts`;
	await vscode.workspace.fs.writeFile(uriUtils.resolvePath(targetFolder, svcFilename), Buffer.from(writeTemplateServiceFile(svcFilename, resourceNamePascal)));
	if (Boolean(controllerPath)) {
		const controllerFN = `${resourceNameKebabCase}.controller.ts`;
		await vscode.workspace.fs.writeFile(uriUtils.resolvePath(targetFolder, controllerFN), Buffer.from(writeTemplateControllerFile(controllerFN, resourceNameKebabCase, resourceNamePascal, controllerPath)));
	}
	const moduleFN = `${resourceNameKebabCase}.module.ts`;
	await vscode.workspace.fs.writeFile(
		uriUtils.resolvePath(targetFolder, moduleFN),
		Buffer.from(writeTemplateModuleFile(moduleFN, resourceNamePascal, resourceNameKebabCase, Boolean(controllerPath)))
	);
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, "vscode-nestjs-generator" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	let rightClickMenuCmd = vscode.commands.registerCommand('vscode-nestjs-generator.createAtTargetedFolder', async (inputURI: vscode.Uri) => {
		const uri = ((await vscode.workspace.fs.stat(inputURI)).type === vscode.FileType.Directory) ? inputURI : uriUtils.resolvePath(inputURI, '..');
		if ((await vscode.workspace.fs.stat(inputURI)).type !== vscode.FileType.Directory) {
			await vscode.window.showErrorMessage('Neither the selected path nor its parent is not a directory.');
			return;
		}
		const resourceNameKebabCase = uri.path[uri.path.length - 1];
		if (!resourceNameKebabCase) { return; }
		const resNameInput = await vscode.window.showInputBox({
			title: 'Resource name (e.g. User)',
			value: pascalize(resourceNameKebabCase),
			valueSelection: undefined
		});
		if (!resNameInput) { return; }
		const controllerPathInput = await vscode.window.showInputBox({
			title: 'Specify API endpoint path (empty for no controller)',
			value: '/' + resourceNameKebabCase,
			valueSelection: undefined
		});
		if (controllerPathInput === undefined) { return; }
		return createInFolder(uri, resourceNameKebabCase, resNameInput, controllerPathInput);
	});
	let rightClickMenuCmdNoCon = vscode.commands.registerCommand('vscode-nestjs-generator.createAtTargetedFolderNoController', async (inputURI: vscode.Uri) => {
		const uri = ((await vscode.workspace.fs.stat(inputURI)).type === vscode.FileType.Directory) ? inputURI : uriUtils.resolvePath(inputURI, '..');
		if ((await vscode.workspace.fs.stat(inputURI)).type !== vscode.FileType.Directory) {
			await vscode.window.showErrorMessage('Neither the selected path nor its parent is not a directory.');
			return;
		}
		const resourceNameKebabCase = uri.path[uri.path.length - 1];
		if (!resourceNameKebabCase) { return; }
		const resNameInput = await vscode.window.showInputBox({
			title: 'Resource name (e.g. User)',
			value: pascalize(resourceNameKebabCase),
			valueSelection: undefined
		});
		if (!resNameInput) { return; }
		return createInFolder(uri, resourceNameKebabCase, resNameInput, '');
	});

	let rightClickMenuSubfolderCmd = vscode.commands.registerCommand('vscode-nestjs-generator.createInSubFolder', async (inputURI: vscode.Uri) => {
		const uri = ((await vscode.workspace.fs.stat(inputURI)).type === vscode.FileType.Directory) ? inputURI : uriUtils.resolvePath(inputURI, '..');
		if ((await vscode.workspace.fs.stat(inputURI)).type !== vscode.FileType.Directory) {
			await vscode.window.showErrorMessage('Neither the selected path nor its parent is not a directory.');
			return;
		}
		const subfolderName = await vscode.window.showInputBox({
			title: 'Subfolder & resource paths name',
			placeHolder: 'e.g. user',
		});
		if (!subfolderName) { return; }
		const resourceNameKebabCase = subfolderName;
		const resNameInput = await vscode.window.showInputBox({
			title: 'Resource name (e.g. User)',
			value: pascalize(resourceNameKebabCase),
			valueSelection: undefined
		});
		if (!resNameInput) { return; }
		const controllerPathInput = await vscode.window.showInputBox({
			title: 'Specify API endpoint path (empty for no controller)',
			value: '/' + resourceNameKebabCase,
			valueSelection: undefined
		});
		if (controllerPathInput === undefined) { return; }
		return createInFolder(uriUtils.resolvePath(uri, subfolderName), resourceNameKebabCase, resNameInput, controllerPathInput);
	});
	let rightClickMenuSubfolderCmdNoCon = vscode.commands.registerCommand('vscode-nestjs-generator.createInSubFolderNoController', async (inputURI: vscode.Uri) => {
		const uri = ((await vscode.workspace.fs.stat(inputURI)).type === vscode.FileType.Directory) ? inputURI : uriUtils.resolvePath(inputURI, '..');
		if ((await vscode.workspace.fs.stat(inputURI)).type !== vscode.FileType.Directory) {
			await vscode.window.showErrorMessage('Neither the selected path nor its parent is not a directory.');
			return;
		}
		const subfolderName = await vscode.window.showInputBox({
			title: 'Subfolder & resource paths name',
			placeHolder: 'e.g. foo -> foo.service.ts, foo.module.ts, foo.controller.ts',
		});
		if (!subfolderName) { return; }
		const resourceNameKebabCase = subfolderName;
		if (!resourceNameKebabCase) { return; }
		const resNameInput = await vscode.window.showInputBox({
			title: 'Resource classes name (e.g. User)',
			value: pascalize(resourceNameKebabCase),
			valueSelection: undefined
		});
		if (!resNameInput) { return; }
		return createInFolder(uriUtils.resolvePath(uri, subfolderName), resourceNameKebabCase, resNameInput, '');
	});

	let cmd1 = vscode.commands.registerCommand('vscode-nestjs-generator.createInManualSpecifiedFolder', async () => {
		// The code you place here will be executed every time your command is executed
		// vscode.window.showInformationMessage('Hello World from nestjs-generator!');
		let targetWorkspace: vscode.WorkspaceFolder | undefined = undefined;
		if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 1) {
			targetWorkspace = await vscode.window.showWorkspaceFolderPick();
		} else {
			targetWorkspace = vscode.workspace.workspaceFolders?.[0];
		}
		if (!targetWorkspace) {
			vscode.window.showInformationMessage('No workspace found or selected.');
			return;
		}

		const folderRelPathInput = await vscode.window.showInputBox({
			placeHolder: 'src/modules/user/user-*',
			title: 'Where will this be created?',
			validateInput: (val) => val?.length ? null : 'Value required.'
		});

		if (folderRelPathInput) {
			const targetFolder = uriUtils.resolvePath(targetWorkspace!.uri, folderRelPathInput);
			await vscode.workspace.fs.createDirectory(targetFolder)
				.then(
					async () => {
						const paths = folderRelPathInput.split(/[\\/]/g);
						const resourceNameKebabCase = paths[paths.length - 1];
						const resNameInput = await vscode.window.showInputBox({
							title: 'Resource name (e.g. User)',
							value: pascalize(resourceNameKebabCase),
							valueSelection: undefined
						});
						if (!resNameInput) { return; }
						const controllerPathInput = await vscode.window.showInputBox({
							title: 'Specify API endpoint path (empty for no controller)',
							value: '/' + resourceNameKebabCase,
							valueSelection: undefined
						});
						if (controllerPathInput === undefined) { return; }
						return createInFolder(targetFolder, resourceNameKebabCase, resNameInput, controllerPathInput);
					},
					(reason) => {
						vscode.window.showErrorMessage(JSON.stringify(reason));
					}
				);
		}
	});

	context.subscriptions.push(cmd1);
	context.subscriptions.push(rightClickMenuCmd);
	context.subscriptions.push(rightClickMenuCmdNoCon);
	context.subscriptions.push(rightClickMenuSubfolderCmd);
	context.subscriptions.push(rightClickMenuSubfolderCmdNoCon);
}

// this method is called when your extension is deactivated
export function deactivate() {}
