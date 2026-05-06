import * as vscode from 'vscode';
import { RockyView } from './rockyView';

export function activate(ctx: vscode.ExtensionContext): void {
  const view = new RockyView(ctx);

  ctx.subscriptions.push(
    vscode.window.registerWebviewViewProvider('rocky.view', view),
    vscode.commands.registerCommand('rocky.show', () =>
      vscode.commands.executeCommand('rocky.view.focus')
    ),
    vscode.commands.registerCommand('rocky.hide', () => view.dispose()),
  );

  // Auto-show Rocky in the bottom panel on every startup
  vscode.commands.executeCommand('rocky.view.focus');
}

export function deactivate(): void {}
