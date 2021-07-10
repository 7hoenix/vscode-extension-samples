/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as path from 'path';
// import { workspace, ExtensionContext, TextDocument } from 'vscode';
import { workspace, ExtensionContext, TextDocumentChangeEvent, TextDocument, Disposable, OutputChannel, FileSystemWatcher as VFileSystemWatcher, DiagnosticCollection, Diagnostic as VDiagnostic, Uri, ProviderResult, CancellationToken, Position as VPosition, Location as VLocation, Range as VRange, CompletionItem as VCompletionItem, CompletionList as VCompletionList, SignatureHelp as VSignatureHelp, SignatureHelpContext as VSignatureHelpContext, Definition as VDefinition, DefinitionLink as VDefinitionLink, DocumentHighlight as VDocumentHighlight, SymbolInformation as VSymbolInformation, CodeActionContext as VCodeActionContext, Command as VCommand, CodeLens as VCodeLens, FormattingOptions as VFormattingOptions, TextEdit as VTextEdit, WorkspaceEdit as VWorkspaceEdit, Hover as VHover, CodeAction as VCodeAction, DocumentSymbol as VDocumentSymbol, DocumentLink as VDocumentLink, TextDocumentWillSaveEvent, WorkspaceFolder as VWorkspaceFolder, CompletionContext as VCompletionContext, CompletionItemProvider, HoverProvider, SignatureHelpProvider, DefinitionProvider, ReferenceProvider, DocumentHighlightProvider, CodeActionProvider, DocumentSymbolProvider, DocumentFormattingEditProvider, DocumentRangeFormattingEditProvider, OnTypeFormattingEditProvider, RenameProvider, DocumentLinkProvider, DocumentColorProvider, DeclarationProvider, FoldingRangeProvider, ImplementationProvider, SelectionRangeProvider, TypeDefinitionProvider, WorkspaceSymbolProvider, CallHierarchyProvider, FileWillCreateEvent, FileWillRenameEvent, FileWillDeleteEvent, FileCreateEvent, FileDeleteEvent, FileRenameEvent, LinkedEditingRangeProvider } from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

function onSaveWrapper(textDocument: TextDocument, next: (textDocument: TextDocument) => void) {
	console.log(">>>>>>>>>>>");
	console.log(textDocument.fileName);
	console.log(">>>>>>>>>>>");
	console.log(textDocument.getText());
	next(textDocument);
}

// function handleDiagnosticsSignature(uri: Uri, diagnostics: VDiagnostic[]) {

// }
// export interface HandleDiagnosticsSignature {
//     (this: void, uri: Uri, diagnostics: VDiagnostic[]): void;
// }

function handleDiagnostics(uri: Uri, diagnostics: VDiagnostic[], next: (uri: Uri, diagnostics: VDiagnostic[]) => void) {
	console.log("<<<<<<<<<<<");
	console.log(uri.path);
	console.log("<<<<<<<<<<<");
	console.log(diagnostics);
	next(uri, diagnostics);
}

// handleDiagnostics?: (this: void, uri: Uri, diagnostics: VDiagnostic[], next: HandleDiagnosticsSignature) => void;

export function activate(context: ExtensionContext) {
	// The server is implemented in node
	const serverModule = context.asAbsolutePath(
		path.join('server', 'out', 'server.js')
	);
	// The debug options for the server
	// --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
	const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		}
	};

	// export interface NextSignature<P, R> {
	// 	(this: void, data: P, next: (data: P) => R): R;
	// }

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: 'file', language: 'plaintext' }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		},
		middleware: {
			didSave: onSaveWrapper,
			handleDiagnostics: handleDiagnostics
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'languageServerExample',
		'Language Server Example',
		serverOptions,
		clientOptions
	);

	// Start the client. This will also launch the server
	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
